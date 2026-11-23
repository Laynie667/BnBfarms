  /* WHAT'S IN THIS FILE (06b-relog.js)
     GETTIN' THE FARM OFFICE BACK AFTER A DROP (Nov 23; Laynie: "make the relog feature more robust, it seems not to
     currently work", "i meant the bot relogging after a disconnect"). In the players' records, most drops the bot was
     back in a minute or two, but three times it was gone from half an hour to eight hours (Nov 11, Nov 22, the night of
     Nov 23). Since the game's November update (R134):
       • when the server throws a game off (sendin' too much, a second login, a restart), the game closes its own
         connection, and a connection closed on purpose is never opened again. The Relog screen sat there "not
         connected" (even its own Log Back In button does nothin' then), and the bot waited for the server "to come back".
       • so after 5 minutes the watchdog reloaded the page, and a reload stops dead at "Are you sure you want to leave the
         club?" (WCE asks it, with its Confirm leaving on). Nobody there to click: the office stayed shut.
       • a full room keeps out even its admin, and the watchdog reloaded over that too.
     Now:
       • a closed connection is opened again by the bot: CFG.RECONNECT_FIRST_S after the drop, then twice as long each
         try, never more than CFG.RECONNECT_MAX_S apart. Then the usual login (06-login.js tryLogin) and back to the room.
       • somebody openin' the bot's account elsewhere (the server's "duplicated login") gets CFG.DUP_LOGIN_WAIT_MIN before
         the bot takes it back, so they aren't kicked straight off.
       • the page is reloaded only when nothin' else has worked for CFG.WATCHDOG_MIN (07-send.js watchdog), nothin' may ask
         "leave?" on the way out, and a reload that still doesn't happen is tried again.
       • a full farm is waited out, not reloaded over.
       • every drop is written down (when, what the server said, how long till it was back: GM "bnb_drops", shown in the
         Tampermonkey status), and one of CFG.DROP_TELL_MIN or more is beeped to the proprietors once it's back.
  */
  if (CFG.RECONNECT_FIRST_S === undefined) CFG.RECONNECT_FIRST_S = 10;
  if (CFG.RECONNECT_MAX_S === undefined) CFG.RECONNECT_MAX_S = 120;
  if (CFG.DUP_LOGIN_WAIT_MIN === undefined) CFG.DUP_LOGIN_WAIT_MIN = 3;
  if (CFG.DROP_TELL_MIN === undefined) CFG.DROP_TELL_MIN = 5;
  const DROPS_KEY = "bnb_drops", DROPS_KEEP = 20;
  function dropsList(){ try { const d = JSON.parse(GM_getValue(DROPS_KEY, "[]")); return Array.isArray(d) ? d : []; } catch(e){ return []; } }
  function dropsSave(d){ try { GM_setValue(DROPS_KEY, JSON.stringify(d.slice(-DROPS_KEEP))); } catch(e){} }
  const dropWords = (w) => ({ ErrorRateLimited: "the server cut it off for sendin' too much", ErrorDuplicatedLogin: "the bot's account was opened somewhere else",
    "transport close": "the line went", "transport error": "the line went", "ping timeout": "no answer from the server in time",
    "io server disconnect": "the server closed it", "io client disconnect": "the game closed it" })[w] || w || "the line went";
  // the connection went: written down once per drop (the server's reason comes first, then the socket's own)
  function dropped(why){
    const now = Date.now(); why = String(why || "");
    if (why === "ErrorDuplicatedLogin") state.dupUntil = now + CFG.DUP_LOGIN_WAIT_MIN*60000;
    if (state.droppedAt){
      if (why && !state.dropWhy){ state.dropWhy = why; const d = dropsList(), last = d[d.length-1]; if (last && !last.back){ last.why = why.slice(0, 40); dropsSave(d); } }
      return;
    }
    state.droppedAt = now; state.dropWhy = why; state.reconnectTries = 0; state.reconnectAt = 0;
    const d = dropsList(); d.push({ at: now, why: why.slice(0, 40) }); dropsSave(d);
    warn("Dropped: "+dropWords(why)+".");
  }
  // back on duty (the heartbeat, healthy): the drop's closed, and a long one is told to the proprietors
  function droppedBack(){
    if (!state.droppedAt) return;
    const mins = Math.round((Date.now() - state.droppedAt) / 60000), why = state.dropWhy;
    const d = dropsList(), last = d[d.length-1]; if (last && !last.back){ last.back = Date.now(); dropsSave(d); }
    state.droppedAt = 0; state.dropWhy = ""; state.reconnectTries = 0; state.reconnectAt = 0; state.dupUntil = 0;
    log("Back on duty after a drop of "+mins+" min ("+dropWords(why)+").");
    if (mins >= CFG.DROP_TELL_MIN){ try { for (const p of CFG.PROPRIETORS) beep(p, "📶 The farm office dropped "+mins+" minutes ago, "+dropWords(why)+", and it's back on duty now."); } catch(e){} }
  }
  // the game's connection is closed and nothin's reopenin' it: open it again. true: a try went out
  function reopen(){
    const s = W.ServerSocket, now = Date.now();
    if (!s || typeof s.connect !== "function" || s.connected) return false;
    if (!state.droppedAt) dropped("");   // (a drop nobody heard: the page woke up to it)
    if (state.dupUntil > now) return false;   // somebody else has the account for a bit
    if (s.active && now - state.droppedAt < CFG.RECONNECT_MAX_S*1000) return false;   // socket.io is still tryin' by itself
    const wait = Math.min(CFG.RECONNECT_MAX_S, CFG.RECONNECT_FIRST_S * Math.pow(2, state.reconnectTries || 0)) * 1000;
    if (now - Math.max(state.droppedAt, state.reconnectAt || 0) < wait) return false;
    state.reconnectAt = now; state.reconnectTries = (state.reconnectTries || 0) + 1;
    log("The connection's closed: openin' it again (try "+state.reconnectTries+").");
    setBadge("reconnectin'… ("+state.reconnectTries+")", "#ffc49b");
    try { s.connect(); return true; } catch(e){ warn("reconnect:", e); return false; }
  }
  // nothin' may stop a reload to ask "leave the club?" (WCE asks it, with Confirm leaving on): nobody's there to click
  function leaveQuietly(){
    try { W.onbeforeunload = null; } catch(e){}
    try {
      const P = W.BeforeUnloadEvent && W.BeforeUnloadEvent.prototype;
      if (P){
        Object.defineProperty(P, "returnValue", { configurable: true, get(){ return ""; }, set(){} });
        Object.defineProperty(P, "preventDefault", { configurable: true, writable: true, value: function(){} });
      }
    } catch(e){ warn("leave prompt:", e); }
  }
  // for the status: the last few drops
  function dropsText(){
    const d = dropsList().slice(-4); if (!d.length) return "none written down";
    const clock = (t) => new Date(t).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    return d.map(x => clock(x.at)+": "+dropWords(x.why)+(x.back ? ", back after "+Math.max(0, Math.round((x.back - x.at)/60000))+" min" : ", not back yet")).join(" · ");
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __reopen: reopen, __dropped: dropped, __droppedBack: droppedBack, __dropsList: dropsList, __leaveQuietly: leaveQuietly, __watchdog: () => watchdog(), __dropsText: dropsText });
