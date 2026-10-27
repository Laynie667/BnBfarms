  /* WHAT'S IN THIS FILE (10uo-away-books.js)
     AWAY TOO LONG, OFF THE BOOKS (Laynie, Oct 27: "the bot should automatically unregister livestock, guest, and luxury
     guest who have not been inside the same room as the bot in two weeks", then "that doesnt include anyone registered
     with a perm contract").
     • Once a minute, while the bot's in the farm room, it notes everybody on the books who's in there with it.
     • The two weeks only count time the bot itself is in the room. If the bot's off (the PC asleep, the move to the
       server) nobody's clock runs, so a farm that's shut never costs anybody their place.
     • Who it's for: livestock, guests and luxury guests. Never staff or the proprietors, and never anybody holdin' a
       signed permanent farm contract.
     • 12 days away: a note (beeped if they're online, kept for them if not) that comin' by keeps their place.
       14 days: off the books, the same as ?unregister (paperwork archived, keys pulled, off the whitelist). A note waits
       for them and staff are told. A few a minute at most, so a big batch doesn't flood the room's whitelist.
     • Everybody's clock started when this came in (Oct 27); nobody was timed before.
     ?away (staff) shows who's been gone longest and when they'd come off.
  */
  if (CFG.AWAY_BOOKS_DAYS === undefined) CFG.AWAY_BOOKS_DAYS = 14;
  if (CFG.AWAY_BOOKS_WARN_DAYS === undefined) CFG.AWAY_BOOKS_WARN_DAYS = 12;
  const AWAY_ROLES = ["LIVESTOCK", "GUEST", "LUXURY"];
  // the bot's own time in the farm room, in minutes (it only moves while the bot's in there)
  function awayClock(){ L.away = L.away || { min: 0, at: 0 }; return L.away; }
  // a signed farm contract with no end date
  function permContract(mn){ contractsLedger(); return L.contracts.some(x => x.mn === mn && x.status === "signed" && !x.until && !x.durationMin); }
  // why the two weeks don't apply to somebody ("" = they do)
  function awayKept(mn, r){
    if (!r || !r.roles || !r.roles.some(x => AWAY_ROLES.includes(x))) return "not stock or a guest";
    if (mn === CFG.BOT_MEMBER || isProprietor(mn)) return "a proprietor";
    if (isStaff(mn)) return "staff";
    if (permContract(mn)) return "a permanent contract";
    return "";
  }
  function awayDays(r){ const A = awayClock(); return Math.max(0, (A.min - (r.hereMin == null ? A.min : r.hereMin)) / 1440); }
  function awayTick(){
    const now = Date.now(), A = awayClock();
    if (now - (state.awayAt || 0) < 60000) return;
    const gap = state.awayAt ? now - state.awayAt : 60000;
    state.awayAt = now;
    A.min += Math.min(gap, 3*60000) / 60000;   // (a PC asleep for hours counts as a few minutes at most)
    A.at = now;
    // everybody here with the bot: their clock starts over
    for (const C of (W.ChatRoomCharacter || [])){
      const r = C && C.MemberNumber !== CFG.BOT_MEMBER && rec(C.MemberNumber); if (!r) continue;
      r.hereMin = A.min; r.hereAt = now;
      if (r.awayWarned) r.awayWarned = 0;
    }
    const off = [], gone = [];
    let changed = false;
    for (const [k, r] of Object.entries(L.people)){
      const mn = parseInt(k, 10);
      if (r.hereMin == null){ r.hereMin = A.min; r.hereAt = now; changed = true; continue; }   // (the clock starts now)
      if (awayKept(mn, r)) continue;
      const d = awayDays(r);
      if (d >= CFG.AWAY_BOOKS_DAYS){ if (off.length < 5) off.push(mn); continue; }
      if (d >= CFG.AWAY_BOOKS_WARN_DAYS && !r.awayWarned){
        r.awayWarned = now; changed = true;
        beep(mn, "🌾 We haven't seen you on the farm in "+Math.floor(d)+" days, "+plainName(mn)+". Come by in the next couple of days (just step into the farm room) and you keep your place. "+
                 "After two weeks away I take folks off the books. Your paperwork's kept safe either way, sugar.");
      }
    }
    for (const mn of off){
      const name = plainName(mn);
      if (!offTheBooks(mn, CFG.BOT_MEMBER, "away "+CFG.AWAY_BOOKS_DAYS+" days")) continue;   // (10um-friend-check.js)
      beep(mn, "📋 You've been away from the farm for two weeks, "+name+", so I've taken you off the books. Your paperwork's tucked safe in the drawer: come back and ?apply whenever you like, sugar.");
      gone.push(name+" ("+mn+")");
    }
    if (gone.length) notifyStaff("📋 Away from the farm for "+CFG.AWAY_BOOKS_DAYS+" days, so off the books now (paperwork archived): "+gone.join(", ")+".", true);
    if (changed || now - (state.awaySavedAt || 0) > 10*60000){ state.awaySavedAt = now; saveLedger(); }
  }
  // ?away (staff): who's been gone longest
  function awayCommand(sender, args, R){
    const rows = [];
    for (const [k, r] of Object.entries(L.people)){
      const mn = parseInt(k, 10);
      if (awayKept(mn, r) || r.hereMin == null) continue;
      const d = awayDays(r); if (d >= 1) rows.push([d, mn, r]);
    }
    rows.sort((a, b) => b[0] - a[0]);
    const kept = Object.keys(L.people).map(Number).filter(mn => awayKept(mn, rec(mn)) === "a permanent contract");
    const days = (n) => n+" day"+(n === 1 ? "" : "s");
    const line = ([d, mn, r]) => "  • "+plainName(mn)+" · "+days(Math.floor(d))+" away"+(r.hereAt ? " (last here "+new Date(r.hereAt).toLocaleDateString()+")" : "")+
      " · off the books in "+days(Math.max(0, Math.ceil(CFG.AWAY_BOOKS_DAYS - d)))+(r.awayWarned ? " · told" : "");
    R("🗓️ AWAY FROM THE FARM\n"+(rows.length ? rows.slice(0, 20).map(line).join("\n")+(rows.length > 20 ? "\n  …and "+(rows.length - 20)+" more." : "") : "  Nobody's been gone a whole day.")+
      "\n\nLivestock and guests come off the books after "+CFG.AWAY_BOOKS_DAYS+" days away (with a note at "+CFG.AWAY_BOOKS_WARN_DAYS+"). The days only count while I'm in the room. "+
      "Never staff, the proprietors, or anybody on a permanent contract"+(kept.length ? " ("+kept.slice(0, 10).map(plainName).join(", ")+(kept.length > 10 ? "…" : "")+")" : "")+".");
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __awayTick: (gap) => { state.awayAt = gap ? Date.now() - gap : 0; awayTick(); }, __awayAdd: (days) => { awayClock().min += days*1440; } });
