  /* WHAT'S IN THIS FILE (10z9-chatlog.js)
     THE RECORD (Oct 19). Laynie wanted a record for diagnostics: everything a player sees in chat, their beeps and
     whispers and the commands they send the farm, sent by their Companion (extension/src/chatlog.js) and "saved
     hourly as a log file". It's opt-in for everybody (their Toggles), and always on for the proprietors in
     CFG.PROPRIETORS, with no switch. Whoever's in CFG.LOG_READERS (Laynie) gets a Log tab to read and filter it.
     Kept: in the browser's own database by the hour (two weeks), and, with the 💾 backup folder picked
     (03b-storage.js), as a text file per player per hour in its "logs" folder.
  */
  /* ───────────── the record ───────────── */

  const CHATLOG = { live: new Map(), who: new Map(), lastSave: 0, hourKey: "" };   // "mn|hour" → rows not saved yet · mn → newest
  const logHour = (t) => { const d = new Date(t); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+"-"+String(d.getHours()).padStart(2,"0"); };
  function chatlogOn(mn){ return CFG.PROPRIETORS.includes(mn) || !!(rec(mn) && rec(mn).chatlogOn); }
  // a Companion sent what it saw
  function onChatlog(mn, m){
    if (!Array.isArray(m.rows) || !rec(mn) && !CFG.PROPRIETORS.includes(mn)) return;
    const r = rec(mn); if (r && !r.chatlogOn && !CFG.PROPRIETORS.includes(mn)){ r.chatlogOn = true; saveLedger(); }   // (it only sends when they switched it on)
    const now = Date.now();
    for (const x of m.rows.slice(0, 200)){
      if (!x || typeof x.x !== "string") continue;
      const t = Number(x.t) || now; if (Math.abs(now - t) > 2*86400000) continue;
      const row = { t, k: String(x.k || "?").slice(0, 12), f: Number(x.f) || 0, x: x.x.slice(0, 600) };
      const key = mn+"|"+logHour(t), list = CHATLOG.live.get(key) || [];
      if (list.length < 6000) list.push(row);
      CHATLOG.live.set(key, list);
    }
    CHATLOG.who.set(mn, now);
  }
  // the database keeps them by the hour: what's waiting is added to its hour every few minutes, and on the hour
  async function chatlogSave(){
    if (!CHATLOG.live.size) return;
    const batches = Array.from(CHATLOG.live.entries()); CHATLOG.live.clear();
    for (const [key, rows] of batches){
      const [mn, hk] = key.split("|");
      try {
        const had = (await storeGet("log:"+mn+":"+hk)) || [];
        await storePut("log:"+mn+":"+hk, had.concat(rows));
      } catch(e){ const back = CHATLOG.live.get(key) || []; CHATLOG.live.set(key, rows.concat(back)); warn("record save:", e); }
    }
    CHATLOG.lastSave = Date.now();
  }
  // the folder: an hour's file once the hour's over
  async function chatlogFiles(hk){
    if (!STORE.dir || STORE.perm !== "granted") return;
    try {
      const keys = (await storeKeys()).filter(k => k.startsWith("log:") && k.endsWith(":"+hk));
      if (!keys.length) return;
      const dir = await STORE.dir.getDirectoryHandle("logs", { create: true });
      for (const k of keys){
        const mn = Number(k.split(":")[1]), rows = (await storeGet(k)) || [];
        const text = rows.sort((a, b) => a.t - b.t).map(r => chatlogLine(r, mn)).join("\n");
        const fh = await dir.getFileHandle("record-"+mn+"-"+hk+".txt", { create: true }), w = await fh.createWritable();
        await w.write(text+"\n"); await w.close();
      }
    } catch(e){ warn("record files:", e); }
  }
  async function storeKeys(){
    const db = await storeDb();
    return new Promise((ok, no) => { const rq = db.transaction("kv").objectStore("kv").getAllKeys(); rq.onsuccess = () => ok((rq.result || []).map(String)); rq.onerror = () => no(rq.error); });
  }
  async function storeDel(k){ const db = await storeDb(); return new Promise((ok) => { const tx = db.transaction("kv", "readwrite"); tx.objectStore("kv").delete(k); tx.oncomplete = () => ok(true); tx.onerror = () => ok(false); }); }
  const chatlogName = (mn) => { try { return plainName(mn) || String(mn); } catch(e){ return String(mn); } };
  function chatlogLine(r, mn){
    const d = new Date(r.t), tt = String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")+":"+String(d.getSeconds()).padStart(2,"0");
    return tt+" ["+r.k+"] "+(r.f ? chatlogName(r.f)+" ("+r.f+")" : "")+": "+r.x;
  }
  function chatlogTick(){
    try {
      const hk = logHour(Date.now());
      if (CHATLOG.hourKey && CHATLOG.hourKey !== hk){ const done = CHATLOG.hourKey; chatlogSave().then(() => chatlogFiles(done)); }
      else if (Date.now() - CHATLOG.lastSave > 5*60000) chatlogSave();
      CHATLOG.hourKey = hk;
      // two weeks kept, then they go
      if (!CHATLOG.pruned || Date.now() - CHATLOG.pruned > 6*3600000){
        CHATLOG.pruned = Date.now();
        const cut = logHour(Date.now() - 14*86400000);
        storeKeys().then(keys => { for (const k of keys) if (k.startsWith("log:") && k.split(":")[2] < cut) storeDel(k); }).catch(() => {});
      }
    } catch(e){ warn("record:", e); }
  }
  // the Log tab asks: whose (0 = everybody), how many hours back, which kind of line, which words
  async function chatlogAsk(mn, m){
    if (!(CFG.LOG_READERS || []).includes(mn)) return;
    const id = Date.now(), hours = Math.max(1, Math.min(24*14, Number(m.hours) || 3)), who = Number(m.who) || 0;
    const kind = String(m.kind || ""), q = String(m.q || "").toLowerCase().slice(0, 80);
    const from = Date.now() - hours*3600000, hks = new Set();
    for (let t = from; t <= Date.now() + 3600000; t += 3600000) hks.add(logHour(t));
    let rows = [];
    try { await chatlogSave(); } catch(e){ /* below: what couldn't be saved is still waitin' */ }
    try {
      const keys = (await storeKeys()).filter(k => { const p = k.split(":"); return p[0] === "log" && hks.has(p[2]) && (!who || Number(p[1]) === who); });
      for (const k of keys){ const of = Number(k.split(":")[1]); for (const r of ((await storeGet(k)) || [])) rows.push(Object.assign({ w: of }, r)); }
    } catch(e){ /* no database here: only what's waitin' */ }
    // and what hasn't reached the database yet (or can't: a browser without one keeps it here)
    for (const [key, list] of CHATLOG.live){ const [of, hk] = key.split("|"); if (hks.has(hk) && (!who || Number(of) === who)) for (const r of list) rows.push(Object.assign({ w: Number(of) }, r)); }
    rows = rows.filter(r => r.t >= from && (!kind || r.k === kind || (kind === "beep" && /^beep/.test(r.k))) && (!q || r.x.toLowerCase().includes(q) || String(r.f) === q || chatlogName(r.f).toLowerCase().includes(q)));
    rows.sort((a, b) => a.t - b.t);
    const total = rows.length; rows = rows.slice(-400).map(r => ({ t: r.t, k: r.k, f: r.f, n: r.f ? chatlogName(r.f) : "", w: who ? undefined : chatlogName(r.w), x: r.x }));
    // in parts small enough to send
    const parts = []; let cur = [], size = 0;
    for (const r of rows){ const s = JSON.stringify(r).length; if (size + s > 7000 && cur.length){ parts.push(cur); cur = []; size = 0; } cur.push(r); size += s; }
    parts.push(cur);
    parts.forEach((p, i) => enqueue(makeMsg("logRows", { id, rows: p, total, part: i + 1, of: parts.length }, mn)));
  }
  // for the Companion's state: whether they're recorded no matter what, whether they read the record, and whose there is
  function chatlogState(mn, s){
    s.logMust = CFG.PROPRIETORS.includes(mn);
    if ((CFG.LOG_READERS || []).includes(mn)){
      s.logReader = true;
      const ids = new Set(CHATLOG.who.keys()); for (const p of CFG.PROPRIETORS) ids.add(p);
      for (const [k, r] of Object.entries(L.people)) if (r && r.chatlogOn) ids.add(Number(k));
      s.logWho = Array.from(ids).slice(0, 80).map(x => ({ mn: x, name: chatlogName(x) }));
    }
  }
