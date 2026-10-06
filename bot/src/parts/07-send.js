  /* WHAT'S IN THIS FILE (07-send.js)
     Everything the bot SENDS: the paced send queue (so the server never kicks it), anti-idle, map-room
     walkin' (speaker spots, home tile), emotes, chat, whispers (out-of-character on maps so they get
     through), beeps, the Companion link, names, greetings.
  */
  /* ═══════════ ANTI-IDLE ═══════════ */

  function keepalive(){
    const now = Date.now();
    if (now - state.lastKeepalive < CFG.KEEPALIVE_MIN*60000) return;
    state.lastKeepalive = now;
    // invisible server traffic — resets any idle timer, shows nothing in chat
    send("ChatRoomChat", { Content:"BnBKeepAlive", Type:"Hidden" });
    dbg("keepalive sent");
  }

  function nudge(){
    if (!CFG.KEEPALIVE_NUDGE) return;
    const now = Date.now();
    if (now - state.lastNudge < CFG.NUDGE_MIN*60000) return;
    state.lastNudge = now;
    try {
      const C = charFor(CFG.BOT_MEMBER);
      const pos = C && C.MapData && C.MapData.Pos;
      if (!pos) return;
      const back = { X: pos.X, Y: pos.Y };
      const tryDirs = [[1,0],[-1,0],[0,1],[0,-1]];
      for (const [dx,dy] of tryDirs){
        const nx = pos.X+dx, ny = pos.Y+dy;
        if (typeof W.ChatRoomMapViewIsWall === "function" && W.ChatRoomMapViewIsWall(nx,ny)) continue;
        if (nx<0||ny<0||nx>=40||ny>=40) continue;
        // The server stores exactly what we send as MapData, so send MapData itself.
        // (v0.9.0 wrapped it as { MapData: ... }, which gave everyone a Pos-less bot.)
        C.MapData.Pos = { X:nx, Y:ny };
        send("ChatRoomCharacterMapDataUpdate", C.MapData);
        later(()=>{
          try {
            // only step back if I haven't walked over to somebody since
            if (C.MapData.Pos.X !== nx || C.MapData.Pos.Y !== ny) return;
            C.MapData.Pos = back;
            send("ChatRoomCharacterMapDataUpdate", C.MapData);
          } catch(e){}
        }, 2500);
        dbg("nudged");
        return;
      }
    } catch(e){ dbg("nudge failed (harmless):", e); }
  }

  function watchdog(){
    if (!CFG.WATCHDOG_ENABLED || state.reloading || state.dormant) return;   // a quiet copy isn't stuck, it's standing by
    const stale = Date.now() - state.lastHealthy;
    if (stale > CFG.WATCHDOG_MIN*60000){
      state.reloading = true;
      warn("WATCHDOG: unhealthy for "+Math.round(stale/60000)+" min. Reloading.");
      setBadge("watchdog reload…","#ff9b9b");
      try { for (const p of CFG.PROPRIETORS) beep(p, "⚠️ Oops, the farm office tripped over its own boots. Reloadin' now, back in a jiffy!"); } catch(e){}
      later(()=>{ try { W.location.reload(); } catch(e){} }, 3000);
    }
  }

  // Browsers slow down normal timers in a background tab (down to once a MINUTE after
  // a few minutes), which made replies and milkin' look stalled. Timers that live in a
  // Worker don't get slowed, so every delay in the script runs through here.
  const wTimers = new Map(); let wSeq = 0;
  function later(fn, ms){
    if (!state.worker) return setTimeout(fn, ms);
    const id = ++wSeq; wTimers.set(id, { fn, every:false });
    state.worker.postMessage({ set:id, ms:Math.max(0, ms|0), every:false });
    return id;
  }
  function every(fn, ms){
    if (!state.worker) return setInterval(fn, ms);
    const id = ++wSeq; wTimers.set(id, { fn, every:true });
    state.worker.postMessage({ set:id, ms:Math.max(1, ms|0), every:true });
    return id;
  }
  function startWorkerTimer(){
    if (!CFG.USE_WORKER_TIMER) return false;
    try {
      const src = "let hb=null;const T={};onmessage=function(e){var d=e.data;" +
                  "if(d==='start'){if(hb)clearInterval(hb);hb=setInterval(function(){postMessage('tick');}," + CFG.HEARTBEAT_MS + ");return;}" +
                  "if(d&&d.set){T[d.set]=(d.every?setInterval:setTimeout)(function(){if(!d.every)delete T[d.set];postMessage({fire:d.set});},d.ms);}};";
      const blob = new Blob([src], { type:"application/javascript" });
      const w = new Worker(URL.createObjectURL(blob));
      w.onmessage = (e)=>{
        if (e.data === "tick"){ try { heartbeat(); } catch(err){ warn("worker heartbeat:",err); } return; }
        const id = e.data && e.data.fire, t = id && wTimers.get(id);
        if (!t) return;
        if (!t.every) wTimers.delete(id);
        try { t.fn(); } catch(err){ warn("timer:", err); }
      };
      w.postMessage("start");
      state.worker = w;
      log("Worker timer started — background throttling defeated (heartbeat, send queue and every delay).");
      return true;
    } catch(e){ warn("Worker timer failed, falling back:", e); return false; }
  }

  /* ───────────── messaging ───────────── */

  // EVERYTHING the bot sends in-room goes through here: chat, whispers, beeps,
  // key pushes, teleports, map moves. The server disconnects anyone sending more
  // than 20 messages in a second, so one paced queue keeps us safe. Urgent items
  // (safeword, stuck, summons) jump ahead of routine ones.
  // three lanes: urgent (safety), replies to whoever just asked, then everything else
  // (key syncs, ambient emotes), so a busy room never makes a command feel slow
  // emojis break in BC's chat (boxes, odd spacing): stripped from everything that lands in chat or a beep.
  // (Hidden messages to the Companion keep them; its panel shows them fine.)
  const EMOJI = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[\uFE0F\u200D\u20E3])/gu;
  const noEmoji = (s) => String(s).replace(EMOJI, "").replace(/[ \t]{2,}/g, " ").replace(/^([*(]?)[ \t]+/gm, "$1").replace(/[ \t]+$/gm, "");
  function send(ev, data, urgent){
    // the Companion on the bot's OWN account sits on this same page: hand its messages over directly
    // (no trip to the server and back, which the game may not do for messages to yourself)
    if (ev === "ChatRoomChat" && data && data.Type === "Hidden" && data.Target === CFG.BOT_MEMBER && typeof W.__farmhandOwnPanel === "function"){
      const copy = JSON.parse(JSON.stringify(Object.assign({}, data, { Sender: CFG.BOT_MEMBER })));
      setTimeout(() => { try { W.__farmhandOwnPanel(copy); } catch(e){ warn("own panel:", e); } }, 0);
      return;
    }
    if (ev === "AccountBeep" && data && typeof data.Message === "string") data = Object.assign({}, data, { Message: noEmoji(data.Message) });
    else if (ev === "ChatRoomChat" && data && data.Type !== "Hidden" && typeof data.Content === "string") data = Object.assign({}, data, { Content: noEmoji(data.Content) });
    // a panel's state update replaces one for the same person still waitin' in the queue: only the newest
    // matters, and a pile of stale ones would make every panel lag behind
    if (ev === "ChatRoomChat" && data && data.Type === "Hidden" && data.Dictionary && data.Dictionary.type === "state"){
      for (const lane of [state.urgent, state.replies || [], state.queue]){
        const i = lane.findIndex(x => x.ev === ev && x.data && x.data.Type === "Hidden" && x.data.Target === data.Target && x.data.Dictionary && x.data.Dictionary.type === "state");
        if (i >= 0){ lane[i] = { ev, data }; pump(); return; }
      }
    }
    if (urgent) state.urgent.push({ ev, data });
    else if (state.inReply) (state.replies || (state.replies = [])).push({ ev, data });
    else {
      state.queue.push({ ev, data });
      if (state.queue.length > CFG.QUEUE_MAX){
        state.queue.splice(0, state.queue.length - CFG.QUEUE_MAX);
        warn("send queue overflow — dropped oldest routine messages");
      }
    }
    pump();
  }
  function pump(){
    // a pacing timer that never fired would freeze sendin' for good; after a few seconds, unstick it
    if (state.sending && Date.now() - (state.sentAt||0) > CFG.SEND_INTERVAL_MS*5 + 3000) state.sending = false;
    if (state.sending) return;
    const lane = state.urgent.length ? state.urgent : (state.replies && state.replies.length) ? state.replies : state.queue;
    const m = lane[0];
    if (!m) return;
    // the connection's down: keep it, and try again shortly (instead of sendin' it into nothin')
    if (!socketAlive()){ if (!state.sendRetry) state.sendRetry = later(()=>{ state.sendRetry = null; pump(); }, 2000); return; }
    lane.shift();
    state.sending = true; state.sentAt = Date.now();
    try { W.ServerSend(m.ev, m.data); }
    catch(e){
      warn("send:",e);
      m.tries = (m.tries||0) + 1;
      if (m.tries < 3) lane.unshift(m);   // put it back and try again
    }
    later(()=>{ state.sending=false; pump(); }, CFG.SEND_INTERVAL_MS);
  }
  // In BC, everything after a "(" is out-of-character, and on a map out-of-character text reaches the WHOLE
  // map. So a room emote or chat line must never carry round brackets: they become square ones here, for
  // every line the bot or an add-on says out loud. (Private whispers are different: those start with "("
  // on purpose, so they reach the person anywhere on the map.)
  const inCharacter = (s) => String(s).replace(/\(/g, "[").replace(/\)/g, "]");
  function enqueue(m, urgent){
    if (m && (m.Type === "Emote" || m.Type === "Chat") && typeof m.Content === "string") m = Object.assign({}, m, { Content: inCharacter(m.Content) });
    send("ChatRoomChat", m, urgent);
  }
  // spoken out loud: only heard in hearing range of me on a map, so I step over to whoever it's about
  // somebody who just walked in isn't on the map for a moment; hold their line till they are (up to ~10 s),
  // then it goes to them alone
  function waitPlaced(mn, go, last){
    if (!mn || !mapRoom() || onMap(mn) || !charFor(mn)) return false;
    let n = 0;
    const tryIt = () => { if (onMap(mn)) return go(); if (++n < 5 && charFor(mn)) return later(tryIt, 2000); last(); };
    later(tryIt, 2000);
    return true;
  }
  function say(t, urgent, who){
    const subject = who || aboutWhom(t);
    if (subject && waitPlaced(subject, () => say(t, urgent, subject), () => privateTo(subject, t, "chat"))) return;
    if (speakersOn() && speakerSend(subject, t, "chat", urgent)) return;   // the speaker spot talks for me
    // on a map I don't walk over (unless CFG.SPEAKER_MODE is "walk"): it goes privately to the people near
    // whoever it's about, or, if it's about nobody (an announcement), to everybody on the map
    if (mapRoom() && CFG.SPEAKER_MODE !== "walk"){
      if (subject && speakerSend(subject, t, "chat", urgent)) return;
      if (!subject){ toEveryone(t, "chat", urgent); return; }
      // about somebody, but nobody to send it round (they're mid-join, or just left): only to them, never out
      // loud (seen live: a greeting said to the whole room when someone rejoined)
      if (charFor(subject)) privateTo(subject, t, "chat");
      return;
    }
    walkTo(subject, urgent); enqueue({ Content:t, Type:"Chat" }, urgent);
  }
  // a room emote everybody nearby sees (no name in front; I write the whole line)
  /* MAP ROOMS: a player only sees my emotes while I'm in their sight, hears my chat inside their
     hearing range, and gets my whispers within 1 tile (BC's "map room hearing distances").
     So I walk over to whoever the emote is about before I make it, and my whispers start with "("
     because out-of-character text is never range-filtered. */
  const mapRoom = () => !!(W.ChatRoomData && W.ChatRoomData.MapData && W.ChatRoomData.MapData.Type && W.ChatRoomData.MapData.Type !== "Never");
  function walkTo(mn, urgent){
    if (!mn || !mapRoom()) return;
    const me = charFor(CFG.BOT_MEMBER), them = charFor(mn);
    const a = me && me.MapData && me.MapData.Pos, b = them && them.MapData && them.MapData.Pos;
    if (!a || !b || b.X < 0 || b.Y < 0) return;
    // speaker spots (?spot set speaker-barn, speaker-pens…): if any are set, I only ever stand on those,
    // pickin' the one nearest the action, so I'm not poppin' up beside people and spookin' 'em
    const speakers = Object.entries(L.spots || {}).filter(([n]) => n.startsWith("speaker")).map(([, s]) => s);
    if (speakers.length){
      const d = s => Math.max(Math.abs(s.X-b.X), Math.abs(s.Y-b.Y));
      const best = speakers.reduce((x, y) => d(y) < d(x) ? y : x);
      if (best.X === a.X && best.Y === a.Y) return;   // already on the best one: stay put
      me.MapData.Pos = { X: best.X, Y: best.Y };
      send("ChatRoomCharacterMapDataUpdate", me.MapData, urgent);
      state.walkedAt = Date.now();
      return;
    }
    if (Math.max(Math.abs(a.X-b.X), Math.abs(a.Y-b.Y)) <= 2) return;   // close enough already
    const to = spotBeside(mn);
    if (!to) return;
    me.MapData.Pos = { X: to.X, Y: to.Y };
    send("ChatRoomCharacterMapDataUpdate", me.MapData, urgent);
    state.walkedAt = Date.now();
  }
  // back to my home tile (?spot set home) once things have been quiet a little while
  function homeTick(){
    const home = spotFor("home"), me = charFor(CFG.BOT_MEMBER), p = me && me.MapData && me.MapData.Pos;
    if (!home || !p || !mapRoom()) return;
    // with speaker spots set I just stay on the last one I used (less hoppin' about)
    if (Object.keys(L.spots || {}).some(n => n.startsWith("speaker"))) return;
    if (p.X === home.X && p.Y === home.Y) return;
    if (Date.now() - (state.walkedAt||0) < CFG.HOME_AFTER_S*1000) return;
    me.MapData.Pos = { X: home.X, Y: home.Y };
    send("ChatRoomCharacterMapDataUpdate", me.MapData);
  }
  // who a line is about: the person named EARLIEST in it, matched exactly the way the bot writes names
  // (their nickname or name, as a whole word, capitals and all), so "sugar" or "honey" in the bot's own
  // talk never matches somebody called Sugar or Honey. Anyone in the room counts, placed on the map or not.
  function aboutWhom(text){
    text = String(text);
    // the earliest name in the line; where two start at the same place ("Alexia's Laynie" and "Alexia"), the longer one
    let best = null, at = Infinity, len = 0;
    for (const c of (W.ChatRoomCharacter||[])){
      const mn = c.MemberNumber; if (mn === CFG.BOT_MEMBER) continue;
      const r = rec(mn), names = [...new Set([plainName(mn), c.Nickname, c.Name, r && r.name].filter(n => n && String(n).length > 1))];
      for (const n of names){
        const i = indexOfWord(text, String(n));
        if (i >= 0 && (i < at || (i === at && String(n).length > len))){ at = i; best = mn; len = String(n).length; }
      }
    }
    return best;
  }
  function indexOfWord(text, word){
    let from = 0;
    for (;;){
      const i = text.indexOf(word, from);
      if (i < 0) return -1;
      const before = text[i-1], after = text[i+word.length];
      if (!(before && /[\p{L}\p{N}]/u.test(before)) && !(after && /[\p{L}\p{N}]/u.test(after))) return i;
      from = i + 1;
    }
  }
  // an announcement for the whole farm (weather, feedin' time, curfew, winners…): everybody hears it,
  // even when it names somebody. On a map that's privately to each person; otherwise plain room chat.
  function announce(t, urgent){
    if (mapRoom() && CFG.SPEAKER_MODE !== "walk"){ toEveryone(t, "chat", urgent); return; }
    enqueue({ Content:t, Type:"Chat" }, urgent);
  }
  // who: the person it's about (worked out from the names in it if left out)
  // also: people who get every line wherever they're standin' (a scene's two people: whoever's doin' it,
  // even from across the map, and whoever it's done to)
  function emote(t, who, also){
    if (state.cmdWatch) state.cmdWatch.emotes.push(String(t));
    const subject = who || aboutWhom(t);
    if (subject && waitPlaced(subject, () => emote(t, subject, also), () => privateTo(subject, t, "emote"))) return;
    also = (also || []).filter(m => m && m !== CFG.BOT_MEMBER && onMap(m));
    if (mapRoom() && subject){
      // 1. FROM THEM: a line about somebody with the Companion is posted by their own Companion as their own
      //    emote (no name in front), so the game shows it to exactly the people who can see them. Only ever
      //    someone the line is about (them, the other one in a breedin', whoever acted on them).
      const parties = [subject].concat(namesHere(t).filter(m => m !== subject));
      const by = parties.find(m => canRelay(m) && namedIn(String(t), [m]));
      if (by){
        relayEmote(by, t, subject);
        const seen = sightOf(by) ? new Set(audience(by, "see")) : null;
        // (not knowin' who can see them: a scene's other person gets a copy only if they're out of range)
        const far = m => { const p = charFor(by) && charFor(by).MapData && charFor(by).MapData.Pos, q = charFor(m) && charFor(m).MapData && charFor(m).MapData.Pos;
                           return !p || !q || Math.max(Math.abs(p.X-q.X), Math.abs(p.Y-q.Y)) > CFG.SPEAKER_RANGE; };
        for (const m of new Set(parties.concat(also))) if (m !== by && (!seen ? also.includes(m) && far(m) : !seen.has(m))) privateTo(m, t, "emote");
        return;
      }
      // 2. otherwise: the speaker spot near them, or privately to whoever's near them. No walkin' over.
      if (speakersOn() && speakerSend(subject, t, "emote")) return;
      if (CFG.SPEAKER_MODE !== "walk"){
        // everybody around ANY of the people it's about (a breedin' names two), each once
        const who = new Set();
        for (const a of parties){ const s = audienceFor(a, t, "emote"); if (s) for (const m of s) who.add(m); }
        for (const m of also) who.add(m);
        if (who.size){ for (const m of who) privateTo(m, t, "emote"); return; }
      }
    } else if (mapRoom() && CFG.SPEAKER_MODE !== "walk"){ toEveryone(t, "emote"); return; }   // about nobody: everybody hears it
    // about somebody on a map, and nobody around them to tell: only them, never a public emote
    if (mapRoom() && subject && CFG.SPEAKER_MODE !== "walk"){ if (charFor(subject)) privateTo(subject, t, "emote"); return; }
    walkTo(subject);
    for (const c of splitMessage(t, 900)) enqueue({ Content:"*"+c, Type:"Emote" });
  }
  // everybody on the map the line names. A name that only shows up inside somebody else's longer name
  // doesn't count: "Alexia's Laynie kneels" names Laynie, not Alexia.
  function namesHere(text){
    const people = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER && onMap(m));
    return people.filter(m => {
      const mine = namesOf(m);
      let t = String(text);
      for (const o of people){
        if (o === m) continue;
        for (const n of namesOf(o)){
          if (n.length > 3 && mine.some(x => x.length < n.length && n.includes(x))){
            const i = t.toLowerCase().indexOf(n);
            if (i >= 0) t = t.split(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig")).join(" ");
          }
        }
      }
      return namedIn(t, [m]);
    });
  }
  // has a Companion that can post farm emotes for them (v0.9+), and they haven't switched that off
  function canRelay(mn){
    const c = state.companions.get(mn);
    return !!(hasCompanion(mn) && c && c.relay !== false && verAtLeast(c.ver, "0.9.0"));
  }
  function verAtLeast(v, min){
    const a = String(v||"0").split(".").map(Number), b = min.split(".").map(Number);
    for (let i = 0; i < 3; i++){ if ((a[i]||0) !== b[i]) return (a[i]||0) > b[i]; }
    return true;
  }
  // ask their Companion to post it; if it can't (switched off, an owner rule blocks emotes, too many at once),
  // it says so and the line goes out privately to the people near them instead
  function relayEmote(mn, text, subject){
    state.relays = state.relays || new Map();
    const id = ++companionSeq;
    state.relays.set(id, { text, subject: subject || mn, at: Date.now() });
    state.relays.get(id).by = mn;
    enqueue(makeMsg("relay", { text: String(text).slice(0, 900), id }, mn));
    for (const [k, r] of state.relays) if (Date.now() - r.at > 120000) state.relays.delete(k);
  }
  function relayRefused(id){
    const r = state.relays && state.relays.get(id);
    if (!r) return;
    state.relays.delete(id);
    const who = new Set();
    for (const a of new Set([r.by, r.subject])){ const s = a && audienceFor(a, r.text, "emote"); if (s) for (const m of s) who.add(m); }
    if (!who.size){ for (const c of splitMessage(r.text, 900)) enqueue({ Content:"*"+c, Type:"Emote" }); return; }
    for (const m of who) privateTo(m, r.text, "emote");
  }
  // one line, privately, drawn in their chat (Companion) or whispered out-of-character
  function privateTo(mn, text, kind){
    const line = (kind === "emote" ? "*" : "")+String(text);
    if (hasCompanion(mn)) enqueue(makeMsg("roomline", { text: line, kind }, mn));
    else for (const part of splitMessage(line, 900)) enqueue({ Content: "("+part.replace(/\(/g, "[").replace(/\)/g, "]"), Type:"Whisper", Target: mn });
  }
  // an announcement about nobody in particular, on a map: privately to everybody here
  function toEveryone(text, kind, urgent){
    const line = (kind === "emote" ? "*" : "")+String(text);
    for (const c of (W.ChatRoomCharacter||[])){
      const mn = c.MemberNumber;
      if (mn === CFG.BOT_MEMBER) continue;
      if (hasCompanion(mn)) enqueue(makeMsg("roomline", { text: line, kind }, mn), urgent);
      else for (const part of splitMessage(line, 900)) enqueue({ Content: "("+part.replace(/\(/g, "[").replace(/\)/g, "]"), Type:"Whisper", Target: mn }, urgent);
    }
  }

  /* SPEAKER SPOTS AS MY VOICE (CFG.SPEAKER_MODE "voice"): I stay put. The speaker spot nearest the action
     "says" it: everybody within CFG.SPEAKER_RANGE tiles of that spot (or of whoever it's about), plus
     everyone the line names, gets it. Companion users see a normal-lookin' emote line in their chat;
     everyone else gets it as a private out-of-character whisper (the map never filters those). */
  const speakersOn = () => mapRoom() && CFG.SPEAKER_MODE === "voice" && Object.keys(L.spots || {}).some(n => n.startsWith("speaker"));
  function speakerSend(anchor, text, kind, urgent){
    const who = audienceFor(anchor, text, kind);
    if (!who) return false;   // nobody to anchor it to: fall back to the room
    const line = (kind === "emote" ? "*" : "")+String(text);
    for (const mn of who){
      if (hasCompanion(mn)) enqueue(makeMsg("roomline", { text: line, kind }, mn), urgent);
      else for (const c of splitMessage(line, 900)) enqueue({ Content: "("+c.replace(/\(/g, "[").replace(/\)/g, "]"), Type:"Whisper", Target: mn }, urgent);
    }
    return true;
  }
  // everybody a line about someone should reach: them, whoever it names, and whoever can see/hear them
  // (their Companion's report) or is near them and the nearest speaker spot
  function audienceFor(anchor, text, kind){
    const here = (W.ChatRoomCharacter||[]).filter(c => c.MemberNumber !== CFG.BOT_MEMBER && c.MapData && c.MapData.Pos);
    const pos = mn => { const c = charFor(mn); return c && c.MapData && c.MapData.Pos; };
    const at = anchor && pos(anchor);
    if (!at) return null;
    const speakers = Object.entries(L.spots || {}).filter(([n]) => n.startsWith("speaker")).map(([, s]) => s);
    const dist = (p, q) => Math.max(Math.abs(p.X-q.X), Math.abs(p.Y-q.Y));
    const spot = speakers.length ? speakers.reduce((x, y) => dist(y, at) < dist(x, at) ? y : x) : at;   // no speakers: just around them
    const R = CFG.SPEAKER_RANGE;
    const named = here.map(c => c.MemberNumber).filter(m => namedIn(String(text), [m]));
    const who = new Set([anchor].concat(named));
    // their Companion said exactly who can see (or hear) them: those people. Otherwise everyone within range.
    if (sightOf(anchor) && !speakersOn()) for (const m of audience(anchor, kind === "chat" ? "hear" : "see")) who.add(m);
    else for (const c of here) if (dist(c.MapData.Pos, spot) <= R || dist(c.MapData.Pos, at) <= R) who.add(c.MemberNumber);
    // the one it's about and anyone it names always get it; onlookers only if their Companion can draw it as a
    // normal room line (a whisper about somebody else just looks like a message sent to the wrong person)
    for (const m of [...who]) if (m !== anchor && !named.includes(m) && !hasCompanion(m)) who.delete(m);
    return who;
  }
  // are they in the room and standin' on the map right now?
  function onMap(mn){
    const C = charFor(mn);
    if (!C) return false;
    const mapRoom = !!(W.ChatRoomData && W.ChatRoomData.MapData && W.ChatRoomData.MapData.Type && W.ChatRoomData.MapData.Type !== "Never");
    if (!mapRoom) return true;
    const pos = C.MapData && C.MapData.Pos;
    return !!(pos && pos.X >= 0 && pos.Y >= 0);
  }
  // the first of these people who isn't here, or null when everybody is
  function missing(...mns){ return mns.find(m => m && !onMap(m)) || null; }
  function whisper(target,text,urgent,plain){
    if (!plain && hasCompanion(target)){ toCompanion(target, text, "notice", urgent); return; }
    if (target === CFG.BOT_MEMBER){ selfLine(text); return; }   // a whisper to itself would never arrive
    // the server only delivers a whisper to someone in this room; anyone else gets a beep (or the summary later)
    if (!charFor(target)){ if (canBeep(target)) for (const c of splitMessage(text,900)) send("AccountBeep",{ MemberNumber:target, BeepType:"", Message:c }, urgent); else holdMail(target, text); return; }
    // in a map room a whisper only reaches someone within 1 tile, unless it's out-of-character:
    // everything after a "(" gets through, so I open one and keep any ")" in the text from closin' it
    const ooc = mapRoom();
    for (const c of splitMessage(text,900)) enqueue({ Content: ooc ? "("+c.replace(/\(/g, "[").replace(/\)/g, "]") : c, Type:"Whisper", Target:target }, urgent);
  }
  function splitMessage(text,max){
    text = String(text);
    if (text.length<=max) return [text];
    const out=[]; let buf="";
    for (let line of text.split("\n")){
      // a single huge line (a long application answer) gets hard-cut, or the
      // server silently drops anything over 2000 characters
      while (line.length > max){
        if (buf){ out.push(buf.trimEnd()); buf=""; }
        out.push(line.slice(0,max)); line = line.slice(max);
      }
      if ((buf+line+"\n").length>max){ if(buf) out.push(buf.trimEnd()); buf=""; }
      buf += line+"\n";
    }
    if (buf.trim()) out.push(buf.trimEnd());
    return out;
  }
  /* ── Farmhand Companion: folks runnin' the extension get my answers in their farm panel ── */
  const COMPANION_TTL_MS = 3*60*60*1000;
  function hasCompanion(mn){
    const c = state.companions.get(mn);
    return !!(c && Date.now() - c.at < COMPANION_TTL_MS && inRoom() && charFor(mn));
  }
  function companionCount(){ let n = 0; for (const mn of state.companions.keys()) if (hasCompanion(mn)) n++; return n; }
  let companionSeq = 0;
  // extra: more fields for every piece (a doc's kind and who it's about)
  function toCompanion(mn, text, kind, urgent, extra){
    if (state.cmdWatch && state.cmdWatch.mn === mn) state.cmdWatch.replied = true;
    const parts = splitMessage(text, 1800), id = ++companionSeq;
    parts.forEach((t, i) => enqueue(makeMsg(kind, Object.assign({ text:t, id, part:i+1, of:parts.length }, extra||{}), mn), urgent));
  }
  function pingCompanions(force){
    if (!inRoom() || (!force && Date.now() - state.lastPing < 10*60*1000)) return;
    state.lastPing = Date.now();
    enqueue(makeMsg("ping", { ver:VERSION }));
  }
  // is their Companion really still there? It answers a ping with a hello; no answer in 30 s and the bot stops
  // sendin' them things only a panel can show (a closed tab or a turned-off script never says bye)
  function probeCompanion(mn){
    if (!state.companions.has(mn)) return;
    const t0 = Date.now();
    enqueue(makeMsg("ping", { ver:VERSION }, mn), true);
    later(()=>{ const c = state.companions.get(mn); if (c && c.at < t0){ state.companions.delete(mn); log("Companion of "+mn+" didn't answer; sendin' plain text from now on."); } }, 30000);
  }
  function onCompanion(m){
    const mn = m.from;
    if (!mn) return;
    if (m.type === "relayNo"){ relayRefused(m.id); return; }
    if (m.type === "sight"){ onSight(mn, m); return; }
    if (m.type === "leadOk" || m.type === "leadNo"){ leadAnswer(mn, m); return; }
    if (m.type === "hello"){
      state.companions.set(mn, { at:Date.now(), ver:String(m.ver||"?"), relay: m.relay !== false, off: (m.off && typeof m.off === "object") ? m.off : {} });
      log("Companion hello from "+mn+" (v"+(m.ver||"?")+")");
      enqueue(makeMsg("welcome", { ver:VERSION, proto:PROTOCOL, name:plainName(mn), staff:isStaff(mn) }, mn));
      later(()=>syncCompanions(), 800);
      return;
    }
    if (m.type === "bye"){ state.companions.delete(mn); return; }
    if (m.type === "outfitSave"){ saveOutfit(mn, m); return; }
    if (m.type === "outfitAnswer"){ outfitAnswer(mn, m); return; }
    if (m.type === "cmd"){
      const text = String(m.text||"").trim().replace(/^[?\-!.\/]+/, "").slice(0, 2000);   // "/record Alexia" works too   // contract terms can run to 1,000
      if (!text) return;
      const c = state.companions.get(mn);
      if (c) c.at = Date.now(); else state.companions.set(mn, { at:Date.now(), ver:"?" });
      state.heard++; state.lastHealthy = Date.now();
      log("HEARD [companion] "+mn+": "+text.slice(0,70));
      if (!handleYesNo(mn, text)) handleCommand(mn, text, "companion");
      later(()=>syncCompanions(), 1500);   // their switches or numbers may have just changed
    }
  }
  function beep(mn,msg,urgent){
    if (mn === CFG.BOT_MEMBER && !hasCompanion(mn)){ selfLine(msg); return; }
    if (hasCompanion(mn)){
      toCompanion(mn, msg, "notice", urgent);
      // urgent ones (safewords, summons, staff calls, new applications) ALSO pop a real beep: it makes a
      // sound and shows even when the panel's closed or the tab's in the background. Routine lines don't.
      if (urgent && canBeep(mn)) send("AccountBeep", { MemberNumber:mn, BeepType:"", Message:String(msg).split("\n")[0].slice(0, 300) }, urgent);
      return;
    }
    // standin' right here on the map? a whisper reaches 'em, so no beep
    if (CFG.WHISPER_FIRST && inRoom() && onMap(mn)){ whisper(mn, msg, urgent); return; }
    // a beep only arrives if they have the bot on THEIR friend list (canBeep); here in the room a whisper
    // still works, and otherwise it's kept for them and handed over when they next come to the farm
    if (!canBeep(mn)){
      if (inRoom() && charFor(mn)){ whisper(mn, msg, urgent); return; }
      holdMail(mn, msg); return;
    }
    const chunks = splitMessage(msg, 900);
    const max = CFG.BEEP_MAX_CHUNKS;
    for (const c of chunks.slice(0,max)) send("AccountBeep",{ MemberNumber:mn, BeepType:"", Message:c }, urgent);
    if (chunks.length > max)
      send("AccountBeep",{ MemberNumber:mn, BeepType:"", Message:"(…I had to cut that one short, sugar. It's a long one! Try narrowin' it down.)" }, urgent);
  }

  // Messages that couldn't reach somebody (offline, or no beep route and not here) aren't replayed one by
  // one: most of them (tease lines, heat notices) only mattered at the time. The last 10 are kept, and when
  // they're back they get ONE short summary: how many, and the gist of the latest few.
  function holdMail(mn, msg){
    L.mailbox = L.mailbox || {};
    const gist = String(msg).split("\n")[0].replace(/\s+/g, " ").trim().slice(0, 90);
    const box = L.mailbox[mn] = (L.mailbox[mn] || []).concat({ t: Date.now(), gist }).slice(-10);
    saveLedger(); dbg("held for "+mn+": "+box.length);
  }
  function deliverMail(mn){
    const box = L.mailbox && L.mailbox[mn];
    if (!box || !box.length) return;
    const latest = box.slice(-3).reverse(), more = box.length - latest.length;
    const text = "📬 "+box.length+" farm message"+(box.length === 1 ? "" : "s")+" while you were away. The latest:\n"+
                 latest.map(x => "• "+x.gist).join("\n")+(more > 0 ? "\n…and "+more+" older." : "");
    if (hasCompanion(mn)) toCompanion(mn, text, "notice");
    else if (charFor(mn)) whisper(mn, text);
    else if (canBeep(mn)) send("AccountBeep", { MemberNumber:mn, BeepType:"", Message:text.slice(0, 1000) });
    else return;   // still can't reach them: keep it
    delete L.mailbox[mn]; saveLedger();
  }

  // the bot's own account (someone at the bot's keyboard): shown on its own screen only
  function selfLine(text){
    try {
      if (typeof W.ChatRoomSendLocal !== "function") return log("[to self] "+text);
      const p = W.document.createElement("div");
      p.style.cssText = "color:#c9a35b;white-space:pre-wrap;margin:0.25em 0";
      p.textContent = String(text);
      W.ChatRoomSendLocal(p.outerHTML);
    } catch(e){ warn("self line:", e); }
  }
  function reply(mn, text, channel){
    if (channel === "companion" || (channel !== "chat" && hasCompanion(mn))){ toCompanion(mn, text, "reply"); return; }
    if (mn === CFG.BOT_MEMBER){ selfLine(text); return; }
    if (channel === "beep"){ beep(mn, text); return; }
    if (channel === "bot"){ if (canBeep(mn)) beep(mn, text); else whisper(mn, text); return; }
    if (channel === "chat"){
      if (CFG.CHAT_REPLY_BEEP && canBeep(mn)) { beep(mn, text); return; }
      // an answer belongs to whoever asked: on a map, just to them (not to whoever it happens to mention)
      if (String(text).length <= CFG.CHAT_REPLY_SAY_MAX){ if (mapRoom()) privateTo(mn, text, "chat"); else say(text, false, mn); return; }
      whisper(mn, text);
      if (!canBeep(mn)) {
        say(plainName(mn) + ", I whispered that one to you, hon! Add me ("+CFG.BOT_MEMBER+") to your friend list and say ?friend, and I can reach you anywhere.", false, mn);
      }
      return;
    }
    whisper(mn, text);
  }

  /* ───────────── names ───────────── */

  function charFor(mn){ try { return (W.ChatRoomCharacter||[]).find(c=>c.MemberNumber===mn)||null; } catch(e){ return null; } }
  function plainName(mn){
    if (mn === ANON_STUD) return "an anonymous stranger at the glory stalls";   // add-ons breed with this one
    const r0 = L.people[mn]; if (r0 && r0.nameSet) return r0.nameSet;   // set by a proprietor with ?edit
    const C = charFor(mn);
    if (C){ try { if (typeof W.CharacterNickname==="function") return W.CharacterNickname(C); } catch(e){}
            return C.Nickname||C.Name||"stranger"; }
    const r = rec(mn); return (r&&r.name)?r.name:("#"+mn);
  }
  // a story line names them in full once, then by the last part of their name ("Alexia's Laynie" ... "Laynie's
  // mouth"): seen live, a long nickname three times in one line reads heavy
  function shortName(mn){
    const full = plainName(mn), parts = String(full).trim().split(/\s+/);
    return parts.length > 1 && parts[parts.length-1].length >= 2 ? parts[parts.length-1] : full;
  }
  function nameOnce(text, mn){
    const full = plainName(mn), short = shortName(mn);
    let seen = false;
    return String(text).replace(/%n/g, () => { if (!seen){ seen = true; return full; } return short; });
  }
  function titledName(mn){
    const C = charFor(mn), n = plainName(mn);
    if (!C) return n;
    const t = (C.Title && C.Title!=="None") ? C.Title : "";
    return t ? t+" "+n : n;
  }
  function fill(t,mn){ return String(t).replace(/%titled_name%/g,titledName(mn)).replace(/%name%/g,plainName(mn)); }
  // every name somebody goes by: account name, nickname, and the name on the books
  function namesOf(mn){
    const C = charFor(mn), r = rec(mn), out = [];
    for (const n of [C && C.Nickname, C && C.Name, r && r.name]) if (n) out.push(String(n).toLowerCase());
    return out;
  }
  // a member number, a name or nickname, or the start of one ("bess" finds Bessie Mae),
  // as long as it only fits one person. Folks in the room count first, then the books.
  // A name could fit more than one person (another account, someone in the room with the same name).
  // Everyone it could be is looked at together: an exact name beats the start of one; then somebody on the
  // farm's books beats somebody who isn't; then somebody here beats somebody away. If it's still a real
  // tie, nobody's picked: the command says so and lists them with their member numbers (see handleCommand).
  function resolveTarget(arg){
    if (!arg) return null;
    arg = String(arg).replace(/^@/,"").replace(/[,.!?:;]+$/,"");
    if (/^#?\d+$/.test(arg)) return parseInt(arg.replace("#",""),10);
    const low = arg.toLowerCase();
    if (!low) return null;
    const room = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER);
    const books = Object.keys(L.people).map(k => parseInt(k,10));
    const all = [...new Set(room.concat(books))];
    const onBooks = m => { const r = rec(m); return !!(r && r.roles && r.roles.length); };
    const score = m => (onBooks(m) ? 2 : 0) + (charFor(m) ? 1 : 0);
    const choose = (list) => {
      if (list.length <= 1) return list[0] || null;
      const best = Math.max(...list.map(score)), top = list.filter(m => score(m) === best);
      if (top.length === 1) return top[0];
      state.ambiguous = { arg, list: top };   // a real tie: handleCommand tells them
      return null;
    };
    const exact = all.filter(m => namesOf(m).includes(low));
    if (exact.length) return choose(exact);
    if (low.length < 3) return null;
    const starts = all.filter(m => namesOf(m).some(n => n.startsWith(low) || n.split(/\s+/).some(w => w.startsWith(low))));
    return choose(starts);
  }

  /* ───────────── greeting ───────────── */

  const GREETINGS = [
    "Evenin', %titled_name%! Gate's open, come on in, sugar. 🌻",
    "Well hey there, %titled_name%! Wipe your boots and make yourself at home.",
    "%titled_name%! Didn't even hear the truck pull up. Welcome to B&B Farm, sweetie!",
    "Welcome, %titled_name%! If you're new 'round here, say ?rules out loud and I'll fill you in.",
    "Mornin', %titled_name%! Coffee's fresh and so's the hay. ☕",
    "Afternoon, %titled_name%! Mind the ruts on your way in, darlin'.",
    "Hey there, %titled_name%! Say ?help any time, hon. I keep the books 'round here."
  ];
  const RETURN_GREETINGS = [
    "Well look who's back! Told ya the gate swings both ways, %titled_name%. 💕",
    "%titled_name%! I just knew you'd turn up again, sugar.",
    "Back for more, %titled_name%? Straw's still warm and I saved you a spot."
  ];

  function greet(mn){
    if (!CFG.GREET_ENABLED || mn===CFG.BOT_MEMBER) return;
    const last = state.greeted.get(mn)||0;
    if (Date.now()-last < CFG.GREET_COOLDOWN_MIN*60000) return;
    state.greeted.set(mn, Date.now());
    const r0 = rec(mn);
    const known = L.archive[mn] || (r0 && r0.roles && r0.roles.length);
    const pool = known ? RETURN_GREETINGS : GREETINGS;
    const line = pool[Math.floor(Math.random()*pool.length)];
    later(()=>say(fill(line,mn), false, mn), 1500);   // addressed to them: never guessed from the names on the map
    const r = rec(mn); if (r){ r.name = plainName(mn); saveLedger(); }
  }

  // Things that happen when somebody walks in, after the greeting.
  function onArrive(mn){
    // summoned? put them where they were called to
    const a = state.arrivals.get(mn);
    if (a){
      state.arrivals.delete(mn);
      if (Date.now() < a.until){
        const pt = firstSpot(a.spot, "summon");
        if (pt) later(()=>teleport(mn, pt, true), 2500);
      }
    }
    // the notice board, once per visit
    if (CFG.NOTICE_ON_JOIN && L.notice && state.greeted.get(mn) > Date.now()-5000)
      later(()=>whisper(mn, "📌 "+L.notice.text), 3500);
    // anniversaries
    const r = rec(mn);
    if (CFG.ANNIVERSARY_ENABLED && r && r.roles.length && r.registeredAt){
      const d0 = new Date(r.registeredAt), now = new Date();
      const years = now.getFullYear() - d0.getFullYear();
      if (years >= 1 && d0.getMonth() === now.getMonth() && d0.getDate() === now.getDate() && r.annivYear !== now.getFullYear()){
        r.annivYear = now.getFullYear(); saveLedger();
        later(()=>say("🎉 "+years+" year"+(years===1?"":"s")+" on the books today, "+plainName(mn)+"! Somebody fetch this sweetie a ribbon!", false, mn), 4500);
      }
    }
  }

  // Opted-in folks on the farm get a teasing whisper now and then.
  function teaseTick(){
    if (!CFG.TEASE_ENABLED || !L.tease.length) return;
    const now = Date.now();
    const gap = () => (CFG.TEASE_MIN_GAP_MIN + Math.random()*(CFG.TEASE_MAX_GAP_MIN-CFG.TEASE_MIN_GAP_MIN))*60000;
    for (const C of (W.ChatRoomCharacter||[])){
      const mn = C.MemberNumber;
      const r = rec(mn);
      if (!r || !r.teaseOptIn) { state.teaseNext.delete(mn); continue; }
      const next = state.teaseNext.get(mn);
      if (!next){ state.teaseNext.set(mn, now + gap()); continue; }   // first one comes a while after they arrive
      if (now < next) continue;
      state.teaseNext.set(mn, now + gap());
      const line = L.tease[Math.floor(Math.random()*L.tease.length)];
      whisper(mn, "😈 "+fill(line.text, mn));
    }
  }

