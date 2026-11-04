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
     AWAY HOLD (Laynie, Oct 27, from the ideas doc): ?away hold <who> 30d [why] (staff) pauses somebody's two weeks while
     they're away on purpose: a trip, exams, a hospital stay. I tell them. While it's on they get no notes and never come
     off the books, and when it runs out their clock carries on from where it stopped (comin' by in the meantime starts it
     over, same as always). ?away hold <who> off ends it early.
     WELCOME HOME: somebody who got the 12-day note and then steps back into the farm gets greeted by name, told their
     place is kept, and their herd leader hears they're back.
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
    if (r.awayHold && r.awayHold.until > Date.now()) return "on hold till "+new Date(r.awayHold.until).toLocaleDateString();
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
      const gone = r.awayWarned ? Math.floor(awayDays(r)) : 0;
      r.hereMin = A.min; r.hereAt = now;
      if (r.awayHold) r.awayHold.days = 0;   // (on hold and came by anyway: nothin' carries over)
      if (r.awayWarned){ r.awayWarned = 0; welcomeHome(C.MemberNumber, gone || CFG.AWAY_BOOKS_WARN_DAYS); }   // the 12-day note, and they came back
    }
    const off = [], gone = [];
    let changed = false;
    for (const [k, r] of Object.entries(L.people)){
      const mn = parseInt(k, 10);
      if (r.hereMin == null){ r.hereMin = A.min; r.hereAt = now; changed = true; continue; }   // (the clock starts now)
      if (r.awayHold){
        const days = r.awayHold.days || 0;
        if (r.awayHold.until > now){ r.hereMin = A.min - days*1440; continue; }   // paused: the days stay where they stopped
        // the hold's over: the clock carries on from where it stopped
        r.awayHold = null; r.hereMin = A.min - days*1440; changed = true;
        if (!awayKept(mn, r)) beep(mn, "🗓️ Your hold on the farm's run out, "+plainName(mn)+", so your away clock's goin' again from where it stopped ("+
          Math.floor(days)+" of "+CFG.AWAY_BOOKS_DAYS+" days). Step into the farm room any time and it starts over. Hope it all went well, sugar.");
      }
      if (awayKept(mn, r)) continue;
      const d = awayDays(r);
      if (d >= CFG.AWAY_BOOKS_DAYS){ if (off.length < 5) off.push(mn); continue; }
      if (d >= CFG.AWAY_BOOKS_WARN_DAYS && !r.awayWarned){
        r.awayWarned = now; changed = true;
        beep(mn, "🌾 We haven't seen you on the farm in "+Math.floor(d)+" days, "+plainName(mn)+". Come by in the next couple of days (just step into the farm room) and you keep your place. "+
                 "After two weeks away I take folks off the books. Your paperwork's kept safe either way, sugar. (Away on purpose for a while? Ask staff to put your place on hold.)");
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
    if (String(args[0] || "").toLowerCase() === "hold"){ awayHoldCommand(sender, args.slice(1), R); return; }
    const kept = Object.keys(L.people).map(Number).filter(mn => awayKept(mn, rec(mn)) === "a permanent contract");
    const held = Object.keys(L.people).map(Number).filter(mn => { const h = rec(mn).awayHold; return h && h.until > Date.now(); });
    const days = (n) => n+" day"+(n === 1 ? "" : "s");
    const line = ([d, mn, r]) => "  • "+plainName(mn)+" · "+days(Math.floor(d))+" away"+(r.hereAt ? " (last here "+new Date(r.hereAt).toLocaleDateString()+")" : "")+
      " · off the books in "+days(Math.max(0, Math.ceil(CFG.AWAY_BOOKS_DAYS - d)))+(r.awayWarned ? " · told" : "");
    R("🗓️ AWAY FROM THE FARM\n"+(rows.length ? rows.slice(0, 20).map(line).join("\n")+(rows.length > 20 ? "\n  …and "+(rows.length - 20)+" more." : "") : "  Nobody's been gone a whole day.")+
      "\n\nLivestock and guests come off the books after "+CFG.AWAY_BOOKS_DAYS+" days away (with a note at "+CFG.AWAY_BOOKS_WARN_DAYS+"). The days only count while I'm in the room. "+
      "Never staff, the proprietors, or anybody on a permanent contract"+(kept.length ? " ("+kept.slice(0, 10).map(plainName).join(", ")+(kept.length > 10 ? "…" : "")+")" : "")+"."+
      (held.length ? "\n\n⏸️ ON HOLD\n"+held.map(m => { const h = rec(m).awayHold; return "  • "+plainName(m)+" · till "+new Date(h.until).toLocaleDateString()+(h.why ? " · "+h.why : "")+" · "+Math.floor(h.days || 0)+" days used, kept"; }).join("\n") : "")+
      "\n?away hold <who> 30d [why] pauses somebody's clock (a trip, exams, a hospital stay) · ?away hold <who> off");
  }
  // "30d", "2w", "12h", "30" (days) → milliseconds, or 0
  function holdLength(w){
    const m = /^(\d+(?:\.\d+)?)\s*(d|day|days|w|wk|week|weeks|h|hr|hrs|hour|hours|m|mo|month|months)?$/.exec(String(w || "").toLowerCase().trim());
    if (!m) return 0;
    const n = parseFloat(m[1]), u = (m[2] || "d")[0];
    return n * (u === "h" ? 3600000 : u === "w" ? 7*86400000 : u === "m" ? 30*86400000 : 86400000);
  }
  // ?away hold <who> 30d [why] · ?away hold <who> off (staff)
  function awayHoldCommand(sender, args, R){
    if (!isStaff(sender)){ R("Holdin' somebody's place is for staff, sugar. Ask one of them."); return; }
    const t = resolveTarget(args[0]), r = t && rec(t), v = String(args[1] || "").toLowerCase();
    if (!t || !r){ R("?away hold <who> 30d [why]: pauses their two weeks while they're away on purpose (a trip, exams, a hospital stay). 2w, 30d, 12h work; up to a year. ?away hold <who> off ends it."); return; }
    const A = awayClock(), now = Date.now();
    if (v === "off" || v === "end" || v === "stop"){
      const h = r.awayHold;
      if (!h || h.until <= now){ R(plainName(t)+" isn't on hold, sugar."); return; }
      r.awayHold = null; r.hereMin = A.min - (h.days || 0)*1440; saveLedger(); audit(sender, "AWAY_HOLD", t+" off");
      R("🗓️ "+plainName(t)+"'s hold is off. Their clock carries on from "+Math.floor(h.days || 0)+" days.");
      beep(t, "🗓️ Your hold on the farm's been lifted, "+plainName(t)+", so your away clock's goin' again from where it stopped ("+Math.floor(h.days || 0)+" of "+CFG.AWAY_BOOKS_DAYS+" days). Step into the farm room and it starts over, sugar.");
      return;
    }
    r.roles = r.roles || [];
    const why0 = awayKept(t, Object.assign({}, r, { awayHold: null }));
    if (why0){ R(plainName(t)+" doesn't need one, sugar: "+(why0 === "not stock or a guest" ? "the two weeks are only for livestock and guests." : "they're "+why0+", so the two weeks never apply to them.")); return; }
    const ms = holdLength(args[1]);
    if (!ms || ms < 3600000 || ms > 366*86400000){ R("How long, sugar? Like ?away hold "+plainName(t)+" 30d (or 2w, 12h). An hour to a year."); return; }
    const used = r.awayHold && r.awayHold.until > now ? (r.awayHold.days || 0) : awayDays(r), why = args.slice(2).join(" ").trim().slice(0, 80);
    r.awayHold = { until: now + ms, days: used, by: sender, at: now, why };
    saveLedger(); audit(sender, "AWAY_HOLD", t+" "+args[1]+(why ? " "+why : ""));
    const till = new Date(now + ms).toLocaleDateString();
    R("🗓️ "+plainName(t)+"'s place is on hold till "+till+". Their clock stays at "+Math.floor(used)+" days and nobody takes them off the books meanwhile. ?away hold "+plainName(t)+" off ends it.");
    beep(t, "🗓️ Your place on the farm is on hold till "+till+", "+plainName(t)+(why ? " ("+why+")" : "")+". Your away clock's paused: no notes, and nobody takes you off the books while you're gone. "+
            "When it's up, it carries on from where it stopped ("+Math.floor(used)+" of "+CFG.AWAY_BOOKS_DAYS+" days). Take care of yourself, sugar. We'll be here.");
  }
  // somebody who had the 12-day note walked back in: hello by name, their place is kept, and their herd leader hears
  const WELCOME_HOME = [
    "🌾 Well, look who's home! Welcome back, %n. Your place on the farm's kept, sugar, right where you left it.",
    "🌾 %n! You came back. Your stall's still got your name on it, sugar, and your place is kept.",
    "🌾 Welcome home, %n. We missed you round here. Your place on the farm is kept, sugar: you're not goin' anywhere.",
    "🌾 There's %n! Welcome back, sugar. The farm kept your place warm for you.",
  ];
  function welcomeHome(mn, days){
    later(() => {
      if (!charFor(mn) || !rec(mn)) return;
      say(pickFresh("away:welcome", WELCOME_HOME).replace(/%n/g, plainName(mn)), false, mn);
      const lead = herdLeaderOf(mn);
      if (lead && lead !== mn) beep(lead, "🌾 "+plainName(mn)+" is back on the farm after "+days+" days away. Their place is kept.");
      audit(CFG.BOT_MEMBER, "WELCOME_HOME", String(mn));
    }, 5000);
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __awayTick: (gap) => { state.awayAt = gap ? Date.now() - gap : 0; awayTick(); }, __awayAdd: (days) => { awayClock().min += days*1440; },
    __awayDays: (mn) => awayDays(rec(mn)), __holdLength: (w) => holdLength(w) });
