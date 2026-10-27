  /* WHAT'S IN THIS FILE (03b-storage.js)
     Keepin' the books safe, past what Tampermonkey holds (Laynie, Oct 15: "i mean better storage than what
     tampermonkey has"). Three things:
       · every save of the books also goes into the browser's own database (IndexedDB), built for big data. If
         Tampermonkey's copy is ever lost, the bot finds the database copy at start-up and puts it back.
       · a folder on the computer, picked once with the 💾 chip under the badge: a dated backup of the books every
         hour (the last two days kept) and a "latest" copy every ten minutes. Real files: they survive a crash, a
         reinstall or a new browser.
       · 💾 → Load the books from a file: puts a backup back (asks first, says how many people are in it).
     The bot's login is never in any of it: only the books.
  */
  /* ───────────── storage ───────────── */

  const STORE = { db: null, dir: null, perm: "none", savedAt: 0, latestAt: 0, hourKey: "", chip: null, menu: null, err: "" };
  function storeDb(){
    if (STORE.db) return STORE.db;
    STORE.db = new Promise((ok, no) => {
      try {
        const IDB = W.indexedDB || (typeof indexedDB !== "undefined" ? indexedDB : null); if (!IDB) return no(new Error("no database here"));
        const rq = IDB.open("farmhand-bot", 1);
        rq.onupgradeneeded = () => { try { rq.result.createObjectStore("kv"); } catch(e){} };
        rq.onsuccess = () => ok(rq.result); rq.onerror = () => no(rq.error);
      } catch(e){ no(e); }
    });
    STORE.db.catch(()=>{ STORE.db = null; });
    return STORE.db;
  }
  async function storeGet(k){ const db = await storeDb(); return new Promise((ok, no) => { const rq = db.transaction("kv").objectStore("kv").get(k); rq.onsuccess = () => ok(rq.result); rq.onerror = () => no(rq.error); }); }
  async function storePut(k, v){ const db = await storeDb(); return new Promise((ok, no) => { const tx = db.transaction("kv", "readwrite"); tx.objectStore("kv").put(v, k); tx.oncomplete = () => ok(true); tx.onerror = () => no(tx.error); }); }

  // every save of the books (03-ledger.js) lands here too, at most once a minute (the newest one waits its turn)
  function storeMirror(json){
    STORE.pending = json;
    if (STORE.mirrorTimer) return;
    STORE.mirrorTimer = later(() => {
      STORE.mirrorTimer = null; const j = STORE.pending; STORE.pending = null; if (!j) return;
      STORE.mirrorAt = Date.now();
      storePut("ledger", { at: Date.now(), json: j }).then(() => { STORE.savedAt = Date.now(); }).catch(e => { STORE.err = String(e && e.message || e); });
    }, Math.max(0, (STORE.mirrorAt || 0) + 60000 - Date.now()));
  }
  // start-up: Tampermonkey's copy is missing but the database has one: put it back and start again
  function storeRecover(rawWasEmpty){
    if (!rawWasEmpty) return;
    storeGet("ledger").then(v => {
      if (!v || typeof v.json !== "string") return;
      let n = 0; try { n = Object.keys(JSON.parse(v.json).people || {}).length; } catch(e){ return; }
      if (n < 2 || GM_getValue(LEDGER_KEY, "")) return;
      warn("The books were missing from Tampermonkey; putting back the copy from the browser's database ("+n+" people, saved "+new Date(v.at).toLocaleString()+").");
      STORE.restoring = true;   // nothin' saves over it before the reload
      GM_setValue(LEDGER_KEY, v.json); later(() => W.location.reload(), 500);
    }).catch(()=>{});
  }

  // ── the folder ──
  const stamp = (d) => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+"-"+String(d.getHours()).padStart(2,"0");
  async function storeWrite(name, text){
    const fh = await STORE.dir.getFileHandle(name, { create: true }), w = await fh.createWritable();
    await w.write(text); await w.close();
  }
  async function storeFolderTick(force){
    if (!STORE.dir || STORE.perm !== "granted" || !L || state.dormant) return;
    if (!force && typeof officeCheck === "function" && !officeCheck()) return;
    const now = new Date(), json = JSON.stringify(L);
    try {
      if (force || Date.now() - STORE.latestAt > 10*60000){ await storeWrite("bnb-ledger-latest.json", json); STORE.latestAt = Date.now(); }
      const hk = stamp(now);
      if (force || STORE.hourKey !== hk){
        await storeWrite("bnb-ledger-"+hk+".json", json); STORE.hourKey = hk;
        // the last two days of hourly copies: older ones go
        const cut = stamp(new Date(Date.now() - 48*3600000));
        for await (const [name] of STORE.dir.entries()){
          const m = /^bnb-ledger-(\d{4}-\d\d-\d\d-\d\d)\.json$/.exec(name);
          if (m && m[1] < cut) { try { await STORE.dir.removeEntry(name); } catch(e){} }
        }
      }
      STORE.err = "";
    } catch(e){ STORE.err = String(e && e.message || e); warn("backup folder:", e); if (/permission|not allowed/i.test(STORE.err)) STORE.perm = "prompt"; }
    storeChipText();
  }
  async function storePickFolder(){
    try {
      if (typeof W.showDirectoryPicker !== "function"){ W.alert("This browser can't save to a folder (Chrome and Edge can). Use \"Farmhand: export ledger\" in the Tampermonkey menu instead."); return; }
      const d = await W.showDirectoryPicker({ id: "bnb-farm", mode: "readwrite" });
      STORE.dir = d; STORE.perm = "granted"; await storePut("dir", d);
      await storeFolderTick(true);
    } catch(e){ if (!/abort/i.test(String(e && e.name))) { STORE.err = String(e && e.message || e); warn("pick folder:", e); } }
    storeChipText();
  }
  async function storeReconnect(){
    try { STORE.perm = await STORE.dir.requestPermission({ mode: "readwrite" }); if (STORE.perm === "granted") await storeFolderTick(true); }
    catch(e){ STORE.err = String(e && e.message || e); }
    storeChipText();
  }
  function storeLoadFile(){
    const inp = W.document.createElement("input"); inp.type = "file"; inp.accept = ".json,application/json";
    inp.onchange = () => {
      const f = inp.files && inp.files[0]; if (!f) return;
      f.text().then(t => {
        let d = null; try { d = JSON.parse(t); } catch(e){}
        if (!d || typeof d !== "object" || !d.people || typeof d.people !== "object"){ W.alert("That file isn't the farm's books."); return; }
        const n = Object.keys(d.people).length, now = Object.keys((L && L.people) || {}).length;
        if (!W.confirm("Put these books back?\n\n"+f.name+"\n"+n+" people in it (the books now have "+now+").\n\nWhat's in the books now is replaced. The bot restarts.")) return;
        STORE.restoring = true;   // nothin' saves over it before the reload
        const json = JSON.stringify(d); GM_setValue(LEDGER_KEY, json);
        storePut("ledger", { at: Date.now(), json }).catch(()=>{}).then(() => W.location.reload());
      });
    };
    inp.click();
  }

  // ── the 💾 chip under the badge ──
  function storeChipText(){
    const c = STORE.chip; if (!c) return;
    const t = (ms) => new Date(ms).toTimeString().slice(0, 5);
    if (!STORE.dir) { c.textContent = "💾 back up the books: pick a folder"; c.style.color = "#ffd98a"; }
    else if (STORE.perm !== "granted") { c.textContent = "💾 click to reconnect the backup folder"; c.style.color = "#ff9a7a"; }
    else if (STORE.err) { c.textContent = "💾 backup trouble: " + STORE.err.slice(0, 60); c.style.color = "#ff9a7a"; }
    else { c.textContent = "💾 backed up " + (STORE.latestAt ? t(STORE.latestAt) : "soon") + " · " + STORE.dir.name; c.style.color = "#b8e08a"; }
  }
  function storeMenu(){
    if (STORE.menu){ STORE.menu.remove(); STORE.menu = null; return; }
    const m = W.document.createElement("div");
    m.style.cssText = "position:fixed;top:48px;left:4px;z-index:2147483647;background:rgba(20,15,10,.95);border:1px solid #8a6a3a;border-radius:5px;padding:6px;display:flex;flex-direction:column;gap:4px;font:12px/1.4 monospace";
    const b = (label, fn) => { const x = W.document.createElement("button"); x.textContent = label; x.style.cssText = "background:#3a2a18;color:#ffd98a;border:1px solid #8a6a3a;border-radius:4px;padding:3px 8px;cursor:pointer;text-align:left;font:inherit"; x.onclick = () => { m.remove(); STORE.menu = null; fn(); }; m.appendChild(x); };
    if (STORE.dir && STORE.perm !== "granted") b("Reconnect " + STORE.dir.name, storeReconnect);
    b(STORE.dir ? "Pick a different folder" : "Pick a folder for backups", storePickFolder);
    if (STORE.dir && STORE.perm === "granted") b("Back up now", () => storeFolderTick(true));
    b("Load the books from a file…", storeLoadFile);
    W.document.body.appendChild(m); STORE.menu = m;
  }
  function storageBoot(){
    try {
      if (CFG.SHOW_BADGE && W.document && W.document.body && !STORE.chip){
        const c = W.document.createElement("div");
        c.style.cssText = "position:fixed;top:30px;left:4px;z-index:2147483647;background:rgba(20,15,10,.88);font:11px/1.4 monospace;padding:3px 8px;border:1px solid #8a6a3a;border-radius:5px;cursor:pointer;user-select:none;max-width:320px";
        c.title = "The farm's books, backed up to a folder on this computer";
        c.addEventListener("click", () => (STORE.dir && STORE.perm !== "granted") ? storeReconnect() : storeMenu());
        W.document.body.appendChild(c); STORE.chip = c; storeChipText();
      }
      storeGet("dir").then(async d => {
        if (!d) return; STORE.dir = d;
        try { STORE.perm = await d.queryPermission({ mode: "readwrite" }); } catch(e){ STORE.perm = "prompt"; }
        storeChipText(); if (STORE.perm === "granted") storeFolderTick(false);
      }).catch(()=>{});
      every(() => { storeFolderTick(false); }, 60000);
    } catch(e){ warn("storage:", e); }
  }
