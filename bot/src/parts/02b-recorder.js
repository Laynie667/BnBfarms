  /* WHAT'S IN THIS FILE (02b-recorder.js)
     The flight recorder: a rollin' last hour of everything the bot sees and does, for findin' problems.
     Everything the game sends the bot (chat, whispers, emotes, actions, beeps, people movin' on the map,
     items and restraints changin', people joinin' and leavin'), everything the bot sends (to the room, to
     each Companion, to people without one), the bot's own log lines and its start-up steps.
     It's kept through a reload (so a start that went wrong is still there afterwards), and downloaded as a
     file with /office record save (or the Tampermonkey menu). Passwords, e-mails and login data are never
     recorded. The file has people's private messages to the bot in it: keep it private.
  */

  const REC_KEY = "bnb_flight_v1";
  const REC = { on: true, keepMin: 60, maxChars: 4000000, ev: [], looks: new Map(), saveAt: 0, size: 0 };
  // (on/off is remembered: /office record off)
  try { const o = GM_getValue("bnb_flight_on", true); REC.on = o !== false; } catch(e){}
  try { const old = JSON.parse(GM_getValue(REC_KEY, "null")); if (old && Array.isArray(old.ev)){ REC.ev = old.ev; REC.size = JSON.stringify(old.ev).length; } } catch(e){}

  const SECRET = /pass(word)?|e-?mail|token|secret|accountname|cookie/i;
  function recClean(v, depth){
    if (v === null || typeof v !== "object") return typeof v === "string" && v.length > 600 ? v.slice(0, 600)+"…" : v;
    if ((depth||0) > 4) return "…";
    if (Array.isArray(v)) return v.slice(0, 40).map(x => recClean(x, (depth||0)+1));
    const o = {};
    for (const k of Object.keys(v).slice(0, 40)){ o[k] = SECRET.test(k) ? "[hidden]" : recClean(v[k], (depth||0)+1); }
    return o;
  }

  // one thing that happened: [time, kind, what]
  function recPush(kind, what){
    if (!REC.on) return;
    const e = [Date.now(), kind, what];
    REC.ev.push(e);
    REC.size += JSON.stringify(e).length;
    const cut = Date.now() - REC.keepMin*60000;
    while (REC.ev.length && (REC.ev[0][0] < cut || REC.size > REC.maxChars)){ REC.size -= JSON.stringify(REC.ev.shift()).length; }
    if (Date.now() - REC.saveAt > 120000) recSave();
  }
  function recSave(){
    REC.saveAt = Date.now();
    try { GM_setValue(REC_KEY, JSON.stringify({ v:1, ev: REC.ev })); } catch(e){ try { console.warn(TAG, "recorder save:", e); } catch(e2){} }
  }
  // log lines and start-up steps
  function recNote(kind, args){
    try { recPush(kind, args.map(a => a instanceof Error ? String(a.stack||a).slice(0, 800) : (typeof a === "object" ? recClean(a) : String(a).slice(0, 800)))); } catch(e){}
  }
  function recStep(what, extra){ recPush("step", extra ? [what, recClean(extra)] : [what]); }

  // what someone is wearin', short: group → item (crafted name) [lock]
  function recLook(appearance){
    const m = {};
    for (const it of (appearance || [])){
      try {
        const g = it.Group || (it.Asset && it.Asset.Group && it.Asset.Group.Name); if (!g) continue;
        const a = it.Name || (it.Asset && it.Asset.Name) || "?";
        const craft = it.Craft && it.Craft.Name ? " \""+String(it.Craft.Name).slice(0, 40)+"\"" : "";
        const lock = it.Property && it.Property.LockedBy ? " ["+it.Property.LockedBy+"]" : "";
        m[g] = a+craft+lock;
      } catch(e){}
    }
    return m;
  }
  // only what changed since last time (put on, taken off, locked, unlocked)
  function recLookChange(mn, appearance){
    if (!mn || !appearance) return;
    const now = recLook(appearance), was = REC.looks.get(mn);
    REC.looks.set(mn, now);
    if (!was){ recPush("wearing", { mn, items: now }); return; }
    const ch = {};
    for (const g of new Set(Object.keys(now).concat(Object.keys(was)))) if (now[g] !== was[g]) ch[g] = now[g] ? (was[g] ? was[g]+" → "+now[g] : "+ "+now[g]) : "- "+was[g];
    if (Object.keys(ch).length) recPush("items", { mn, ch });
  }

  // what came in from the game, made short and safe
  function recIn(ev, d){
    if (!REC.on) return;
    try {
      switch (ev){
        case "ChatRoomMessage": {
          if (!d) return;
          const o = { from:d.Sender, type:d.Type, text: typeof d.Content === "string" ? d.Content.slice(0, 600) : d.Content };
          if (d.Target) o.to = d.Target;
          if (d.Type === "Hidden" && d.Content === "FarmhandMsg") o.farm = recClean(d.Dictionary);
          else if (d.Type === "Activity" || d.Type === "Action") o.dict = recClean(d.Dictionary);
          recPush("in", o); return;
        }
        case "ChatRoomSync": {
          if (!d) return;
          for (const c of (d.Character||[])) recLookChange(c.MemberNumber, c.Appearance);
          recPush("room", { name:d.Name, admins:(d.Admin||[]).length, whitelist:(d.Whitelist||[]).length, map: d.MapData && d.MapData.Type,
                            people:(d.Character||[]).map(c => [c.MemberNumber, c.Nickname||c.Name, c.MapData && c.MapData.Pos]) });
          return;
        }
        case "ChatRoomSyncSingle": case "ChatRoomSyncCharacter":
          if (d && d.Character){ recLookChange(d.Character.MemberNumber, d.Character.Appearance); }
          return;
        case "ChatRoomSyncItem":
          if (d && d.Item) recPush("item", { by:d.Source, mn:d.Item.Target, group:d.Item.Group, name:d.Item.Name, craft: d.Item.Craft && d.Item.Craft.Name, lock: d.Item.Property && d.Item.Property.LockedBy });
          return;
        case "ChatRoomSyncMapData": if (d) recPush("move", { mn:d.MemberNumber, pos: d.MapData && d.MapData.Pos }); return;
        case "ChatRoomSyncMemberJoin": if (d && d.Character){ recPush("join", { mn:d.Character.MemberNumber, name:d.Character.Nickname||d.Character.Name, pos: d.Character.MapData && d.Character.MapData.Pos }); recLookChange(d.Character.MemberNumber, d.Character.Appearance); } return;
        case "ChatRoomSyncMemberLeave": if (d) recPush("leave", { mn:d.SourceMemberNumber }); return;
        case "AccountBeep": if (d) recPush("beep-in", { from:d.MemberNumber, name:d.MemberName, type:d.BeepType||"", text: String(d.Message||"").slice(0, 600) }); return;
        case "LoginResponse": recPush("in", { ev, ok: typeof d === "object" ? "logged in" : String(d) }); return;   // never the account data
        case "AccountQueryResult": if (d) recPush("in", { ev, query:d.Query, count: Array.isArray(d.Result) ? d.Result.length : null }); return;
        default: recPush("in", { ev, data: recClean(d) });
      }
    } catch(e){}
  }
  // what the bot (or the game on its behalf) sent
  function recOut(ev, d){
    if (!REC.on) return;
    try {
      if (/Login|Password|AccountCreate/i.test(ev)){ recPush("out", { ev, data:"[hidden]" }); return; }
      if (ev === "ChatRoomChat" && d){
        const o = { type:d.Type, text: typeof d.Content === "string" ? d.Content.slice(0, 600) : d.Content };
        if (d.Target) o.to = d.Target;
        if (d.Type === "Hidden" && d.Content === "FarmhandMsg") o.farm = recClean(d.Dictionary);
        recPush("out", o); return;
      }
      if (ev === "AccountBeep" && d){ recPush("beep-out", { to:d.MemberNumber, text: String(d.Message||"").slice(0, 600) }); return; }
      if (ev === "AccountUpdate"){ recPush("out", { ev, keys: d ? Object.keys(d) : [] }); return; }
      recPush("out", { ev, data: recClean(d) });
    } catch(e){}
  }

  // hook the game's socket once it exists (called from attachListeners)
  function recAttach(){
    if (recAttach._done || !W.ServerSocket) return;
    try {
      if (typeof W.ServerSocket.onAny === "function") W.ServerSocket.onAny((ev, d) => recIn(ev, d));
      else recStep("recorder: this game's socket can't be watched in full; only the bot's own handlers are recorded");
      if (typeof W.ServerSend === "function" && !W.ServerSend.__farmRec){
        const orig = W.ServerSend;
        const wrapped = function(ev, d){ recOut(ev, d); return orig.apply(this, arguments); };
        wrapped.__farmRec = true;
        W.ServerSend = wrapped;
      }
      recAttach._done = true;
      recStep("recorder attached");
    } catch(e){ try { console.warn(TAG, "recorder:", e); } catch(e2){} }
  }

  // the file: a first line sayin' what's in it, then one line per thing that happened
  function recFile(){
    const head = {
      file: "B&B Farm bot flight recorder", saved: new Date().toISOString(), version: (typeof VERSION !== "undefined" ? VERSION : "?"),
      note: "Private: this has people's messages to the bot in it. No passwords or e-mails are recorded.",
      minutes: REC.keepMin, events: REC.ev.length,
      bot: (()=>{ try { return { me: W.Player && W.Player.MemberNumber, room: W.ChatRoomData && W.ChatRoomData.Name, admin: botIsAdmin(),
                    dormant: state.dormant||null, companions: [...state.companions.keys()], addons: (W.Farmhand && W.Farmhand.list) ? W.Farmhand.list() : [],
                    queue: state.queue.length, urgent: state.urgent.length, badge: state.badge && state.badge.textContent }; } catch(e){ return String(e); } })(),
      kinds: "step=start-up step, log/warn=bot log, in/out=game messages, beep-in/beep-out, move=map moves, join/leave, wearing=what they had on when first seen, items=what changed on them, item=one item put on/changed, room=room snapshot"
    };
    return JSON.stringify(head)+"\n"+REC.ev.map(e => JSON.stringify([new Date(e[0]).toISOString().slice(11, 23), e[1], e[2]])).join("\n")+"\n";
  }
  function recDownload(){
    recSave();
    const name = "farmhand-recording-"+new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")+".jsonl";
    try {
      const blob = new Blob([recFile()], { type: "application/json" });
      const a = W.document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = name;
      W.document.body.appendChild(a); a.click();
      setTimeout(() => { try { a.remove(); URL.revokeObjectURL(a.href); } catch(e){} }, 2000);
      return name;
    } catch(e){ warn("recorder download:", e); return null; }
  }
  try { W.addEventListener("beforeunload", () => recSave()); } catch(e){}
  try { GM_registerMenuCommand("🌾 Download the bot's flight recording (last hour)", () => recDownload()); } catch(e){}
  recStep("script loaded");
