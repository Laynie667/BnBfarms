  /* WHAT'S IN THIS FILE (05-map.js)
     The map: pasture locks, key sync (which doors open for whom), named spots (?spot), teleportin'
     people, findin' a free tile beside someone, and summoning.
  */
  /* ═══════════ PASTURE LOCK ═══════════ */

  function canLockOut(actor, t){
    const extra = CFG.PASTURE_LOCKABLE[t];
    const leader = herdLeaderOf(t);
    // claimed staff and proprietors: their herd leader can turn them out
    if (CFG.PASTURE_LOCK_CLAIMED_STAFF && leader === actor && (isStaff(t) || isProprietor(t))) return true;
    if (!extra) return false;                       // otherwise only people listed in config
    return leader === actor || extra.includes(actor);
  }
  function canLetUp(actor, t){
    const r = rec(t);
    if (!r || !r.pastureLock) return false;
    const extra = CFG.PASTURE_LOCKABLE[t] || [];
    if (extra.includes(actor)) return true;         // e.g. Alexia can always let Laynie up
    const leader = herdLeaderOf(t);
    if (leader) return leader === actor;            // otherwise their herd leader, and only them
    return r.pastureLock.by === actor;              // nobody holds them: whoever locked them
  }

  /* ═══════════ KEY SYNC ═══════════ */

  function botIsAdmin(){
    try {
      if (typeof W.ChatRoomPlayerIsAdmin === "function") return !!W.ChatRoomPlayerIsAdmin();
      const admins = (W.ChatRoomData && W.ChatRoomData.Admin) || [];
      return admins.includes(CFG.BOT_MEMBER);
    } catch(e){ return false; }
  }

  function pushKeys(mn, tiers, quiet){
    if (!CFG.KEY_SYNC_ENABLED) return false;
    if (!botIsAdmin()) return false;
    if (!charFor(mn)) return false;
    const want = new Set(tiers);
    const dictionary = ALL_TIERS.map(t => ({ Tag:"MapViewChangeKey", Key:t, Bool: want.has(t) }));
    send("ChatRoomChat", {
      Content:"ChatRoomMapViewChangeKey", Type:"Hidden",
      Dictionary: dictionary, Target: mn
    });
    dbg("KEYS →", mn, Array.from(want).join("+") || "none");
    const sig = ALL_TIERS.filter(t=>want.has(t)).join(",");
    const prev = state.lastSynced.get(mn);
    state.lastSynced.set(mn, sig);
    if (!quiet && CFG.TELL_ON_KEY_CHANGE && prev !== undefined && prev !== sig) {
      beep(mn, "🔑 Your keys just changed, hon: " + (sig ? keyString(mn) : "none right now, so no doors'll open for you just yet."));
    }
    return true;
  }

  function syncKeys(mn, quiet){ return pushKeys(mn, keysOf(mn), quiet); }

  function syncAllPresent(quiet){
    let n = 0;
    for (const C of (W.ChatRoomCharacter||[])) {
      if (C.MemberNumber === CFG.BOT_MEMBER) continue;
      if (syncKeys(C.MemberNumber, quiet)) n++;
    }
    state.lastFullSync = Date.now();
    return n;
  }

  /* ═══════════ NAMED SPOTS ═══════════
     Staff stand somewhere and ?spot set <name>. Summons, safeword calls and
     rescues bring people to these. Later features (trough, milking, stocks,
     barn) read them by name too. */
  function spotFor(name){
    const n = String(name||"").toLowerCase();
    return (L.spots && L.spots[n]) || null;
  }
  // the first of these names that has been set, or null
  function firstSpot(...names){ for (const n of names){ const p = spotFor(n); if (p) return p; } return null; }

  // move somebody: with a v0.10 Companion they're LED there on foot (10h-body.js); force = teleport anyway
  // (stuck rescues, someone pinned or in the stocks)
  function teleport(mn, pt, urgent, force){
    if (!pt || !charFor(mn)) return false;
    if (!force && mn !== CFG.BOT_MEMBER && canLead(mn)) return lead(mn, pt, urgent);
    return teleportNow(mn, pt, urgent);
  }
  function teleportNow(mn, pt, urgent){
    if (!pt || !botIsAdmin() || !charFor(mn)) return false;
    // The game reads entry.Position — {X,Y} at the top level was silently ignored.
    send("ChatRoomChat", {
      Content:"ChatRoomMapViewTeleport", Type:"Hidden",
      Dictionary:[{ Tag:"MapViewTeleport", Position:{ X: pt.X, Y: pt.Y } }],
      Target: mn
    }, urgent);
    return true;
  }

  // a free tile right beside someone: not a wall, nobody standin' on it. Falls back to their own tile.
  function spotBeside(mn){
    const C = charFor(mn), p = C && C.MapData && C.MapData.Pos;
    if (!p) return null;
    const taken = new Set((W.ChatRoomCharacter||[]).filter(c => c.MapData && c.MapData.Pos).map(c => c.MapData.Pos.X+","+c.MapData.Pos.Y));
    const wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40;
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
      const x = p.X+dx, y = p.Y+dy;
      if (x < 0 || y < 0 || x >= wide || y >= high || taken.has(x+","+y)) continue;
      let blocked = false;
      try { if (typeof W.ChatRoomMapViewPositionIsBlocked === "function") blocked = !!W.ChatRoomMapViewPositionIsBlocked(x, y); } catch(e){}
      if (!blocked) return { X:x, Y:y };
    }
    return { X:p.X, Y:p.Y };
  }

  function rescueTeleport(mn){
    const pt = firstSpot("rescue","stuck") || CFG.RESCUE_POINT;
    if (!botIsAdmin()){
      beep(mn, "I'm sorry, hon, I can't move you right now because I've lost my room admin rights. Please call a proprietor or staff and they'll get you out.");
      return false;
    }
    return teleport(mn, pt, true, true);   // stuck: no walkin', straight out
  }

  /* ═══════════ SUMMONING ═══════════ */

  function forcedStaff(){
    const out = [];
    for (const k in L.people){
      const mn = parseInt(k,10);
      const r = L.people[k];
      if (!r) continue;
      if (!isStaff(mn)) continue;
      if (!onDuty(mn)) continue;
      if (isMandated(mn) || r.forced) out.push(mn);
    }
    return out;
  }

  // spot: the named spot to put them on when they walk in (falls back to "summon")
  function summon(mn, reason, calledBy, spot){
    if (!CFG.SUMMON_ENABLED) return false;
    const now = Date.now();
    const last = state.summonCooldown.get(mn) || 0;
    if (now - last < CFG.SUMMON_COOLDOWN_MIN * 60000) return false;
    state.summonCooldown.set(mn, now);
    state.arrivals.set(mn, { spot: spot || "summon", until: now + 15*60000 });

    const msg = CFG.SUMMON_MESSAGE.replace(/%room%/g, currentRoomName());
    send("AccountBeep", {
      MemberNumber: mn, BeepType: CFG.SUMMON_BEEPTYPE, Message: msg
    }, true);
    log("SUMMONED " + plainName(mn) + " (" + mn + ") — " + reason);
    audit(calledBy || CFG.BOT_MEMBER, "SUMMON", mn + " — " + reason);
    beep(mn,
      "🌾 You've been summoned to " + currentRoomName() + ", hon!\n" + reason +
      "\n\n" + (isMandated(mn) ? "You're mandated, sugar, so pull your boots on and come on down!"
                               : "You put yourself on call, sweetie, so boots on and come on down!"), true);
    return true;
  }

  function summonHelp(reason, calledBy, urgent, spot){
    if (!CFG.SUMMON_ENABLED) return 0;
    const pool = forcedStaff().filter(mn => mn !== calledBy);
    if (!pool.length) return 0;
    // mandated first, then away, then present if urgent
    const away = pool.filter(mn => !charFor(mn));
    const here = pool.filter(mn => charFor(mn));
    const order = away.sort((a,b)=> (isMandated(b)?1:0)-(isMandated(a)?1:0))
                      .concat(urgent ? here : []);
    let n = 0;
    for (const mn of order){
      if (n >= CFG.SUMMON_MAX_PER_CALL) break;
      if (summon(mn, reason, calledBy, spot)) n++;
    }
    return n;
  }

