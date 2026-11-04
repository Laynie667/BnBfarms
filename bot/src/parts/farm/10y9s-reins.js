  /* WHAT'S IN THIS FILE (10y9s-reins.js)
     ON THE REINS (Laynie, Oct 27, from the ideas doc: "When a herd leader says ?reins <pet>, I lead the pet over and keep
     them at heel on the map. When the leader walks, the pet follows a step behind. When the pet safewords, or the leader
     says ?reins off, I let go.")
     • ?reins <who> [minutes]: their herd leader (or a proprietor), for somebody in their own herd who's here on the map.
       An hour unless they say (5 to 240 minutes).
     • The pet's own Companion walks them, a step behind the leader, at their own pace (slower when they're bound or
       carryin'). No Companion, or "Walk me places" switched off in it: I hop them along behind instead.
     • While somethin' else of the farm's has hold of them (a trap, the stocks, a pen, the bench, the milkin' stall, a
       knot) they stay where they are; the reins pick up again when it lets go.
     • It ends with ?reins off [who] (the leader, or a herdmaster), their safeword, either of them leavin' the room, or
       the time runnin' out.
     • ?reins: who's on yours. In the Companion: a chip for the pet, a "Let go" card for the leader, and a Reins button
       on the Herd tab. (?walk is the old lead: it hops them right beside you every few seconds.)
  */
  if (CFG.REINS_MIN === undefined) CFG.REINS_MIN = 60;           // how long, when the leader doesn't say
  if (CFG.REINS_MAX_MIN === undefined) CFG.REINS_MAX_MIN = 240;
  if (CFG.REINS_HOP_MS === undefined) CFG.REINS_HOP_MS = 4000;   // no Companion walkin' them: hopped along at most this often
  const REINS_ON = [
    "%l clips the reins onto %n's collar and gives them a little tug. Heel, sugar.",
    "%l gathers up %n's reins, nice and short, and brings them round to heel.",
    "%l takes %n's reins in one hand and clicks their tongue. Walk on.",
    "%l snaps a lead rein on %n and wraps the end round their fist. Where %l goes, %n goes.",
    "%l loops the reins over %n's head, settles them, and gives the order: heel.",
  ];
  const REINS_OFF = [
    "%l unclips the reins from %n's collar. Free to wander, sugar.",
    "%l drops %n's reins and gives them a pat. Off you go.",
    "%l coils up the reins and lets %n loose.",
  ];
  const reinsLine = (pool, key, pet, by) => pickFresh(key, pool).replace(/%l/g, plainName(by)).replace(/%n/g, plainName(pet));
  function reinsOf(mn){ const r = rec(mn), x = r && r.reins; return x && x.until > Date.now() ? x : null; }
  // who's on this leader's reins (they're all here in the room: the reins come off when anybody leaves)
  function onReinsOf(leader){ return Object.keys(L.people).map(Number).filter(m => { const x = reinsOf(m); return x && x.by === leader; }); }
  // somethin' else of the farm's has hold of them just now: the reins wait
  function reinsHeld(mn){
    const r = rec(mn) || {}, p = prodOf(mn) || {}, now = Date.now();
    return !!(heldByTrap(mn) || (r.penned && r.penned.until > now) || (r.stocked && r.stocked.until > now) || (r.benched && r.benched.until > now) ||
              (p.stall && p.stall.until) || p.tieUntil > now);
  }
  // let go: why is off (the leader), staff, left (the leader went), gone (they went), time, safe
  function reinsLet(mn, why, by){
    const r = rec(mn), x = r && r.reins; if (!x) return false;
    r.reins = null; saveLedger(); syncCompanions();
    if (state.reinsHop) state.reinsHop.delete(mn);
    if (state.reinsHold) state.reinsHold.delete(mn);
    const pet = plainName(mn), lead = plainName(x.by), here = !!charFor(mn);
    if (why === "off"){ if (here) say("🐴 "+reinsLine(REINS_OFF, "reins:off", mn, x.by), false, mn); if (here) whisper(mn, "🐴 "+lead+" let go of your reins, sugar."); }
    else if (why === "staff"){ if (here) whisper(mn, "🐴 "+plainName(by)+" took your reins off, sugar."); if (charFor(x.by)) whisper(x.by, "🐴 "+plainName(by)+" took "+pet+" off your reins."); }
    else if (why === "left"){ if (here) whisper(mn, "🐴 "+lead+" left the farm, so I've taken your reins off, sugar."); }
    else if (why === "gone"){ if (charFor(x.by)) whisper(x.by, "🐴 "+pet+" left the room, so the reins came off."); }
    else if (why === "time"){ if (here) whisper(mn, "🐴 Time's up: you're off "+lead+"'s reins, sugar."); if (charFor(x.by)) whisper(x.by, "🐴 Time's up on "+pet+"'s reins. ?reins "+pet+" takes them up again."); }
    else if (why === "safe"){ if (charFor(x.by)) whisper(x.by, "🐴 "+pet+" called their safeword, so the reins are off."); }
    return true;
  }
  // no Companion walkin' them: hop them to the step behind the leader (the side the leader came from), now and then
  function reinsStep(mn, force){
    const x = reinsOf(mn); if (!x) return;
    const lp = posOf(x.by), pp = posOf(mn); if (!lp || !pp || lp.X < 0 || pp.X < 0) return;
    state.reinsTrail = state.reinsTrail || new Map();
    const tr = state.reinsTrail.get(x.by) || [], last = tr[tr.length - 1];
    if (!last || last.X !== lp.X || last.Y !== lp.Y){ tr.push({ X: lp.X, Y: lp.Y }); if (tr.length > 4) tr.shift(); state.reinsTrail.set(x.by, tr); }
    if (Math.max(Math.abs(pp.X - lp.X), Math.abs(pp.Y - lp.Y)) <= 1) return;   // at heel already
    state.reinsHop = state.reinsHop || new Map();
    if (!force && Date.now() - (state.reinsHop.get(mn) || 0) < CFG.REINS_HOP_MS) return;
    state.reinsHop.set(mn, Date.now());
    const from = tr.length > 1 ? tr[tr.length - 2] : pp, dx = Math.sign(from.X - lp.X), dy = Math.sign(from.Y - lp.Y);
    const back = { X: lp.X + dx, Y: lp.Y + dy };
    let wall = false; try { wall = typeof W.ChatRoomMapViewIsWall === "function" && W.ChatRoomMapViewIsWall(back.X, back.Y); } catch(e){}
    const taken = (W.ChatRoomCharacter || []).some(c => c && c.MemberNumber !== mn && c.MapData && c.MapData.Pos && c.MapData.Pos.X === back.X && c.MapData.Pos.Y === back.Y);
    const to = (dx || dy) && !wall && !taken ? back : spotBeside(x.by);
    if (to) teleport(mn, to, false, true);
  }
  // every few seconds (with the leads, 18-boot.js)
  function reinsTick(){
    const now = Date.now();
    state.reinsHold = state.reinsHold || new Map();
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C && C.MemberNumber, r = mn && rec(mn), x = r && r.reins;
      if (!x) continue;
      if (x.until <= now){ reinsLet(mn, "time"); continue; }
      if (!charFor(x.by)){ reinsLet(mn, "left"); continue; }
      const held = reinsHeld(mn);
      if (held !== !!state.reinsHold.get(mn)){ state.reinsHold.set(mn, held); syncCompanions(); }   // (their Companion waits, or walks again)
      if (held || canLead(mn)) continue;   // their own Companion keeps them at heel
      reinsStep(mn);
    }
    // anybody on the reins who isn't here any more: let go (once a minute)
    if (now - (state.reinsSweepAt || 0) < 60000) return;
    state.reinsSweepAt = now;
    for (const [k, r] of Object.entries(L.people)) if (r.reins){ const mn = parseInt(k, 10); if (!charFor(mn) || r.reins.until <= now) reinsLet(mn, r.reins.until <= now ? "time" : "gone"); }
  }
  const minsLeft = (t) => Math.max(1, Math.ceil((t - Date.now())/60000))+" min";
  function reinsCommand(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase(), now = Date.now();
    if (["off", "drop", "letgo", "free", "release"].includes(a0)){
      const t = args[1] ? resolveTarget(args[1]) : null;
      if (args[1] && !t){ R("Whose reins, sugar? ?reins off <who>, or just ?reins off for all of yours."); return; }
      const list = t ? [t] : onReinsOf(sender);
      if (!list.length){ R("You've nobody on your reins, sugar."); return; }
      const done = [];
      for (const m of list){
        const x = reinsOf(m);
        if (!x){ R(plainName(m)+" isn't on anybody's reins, sugar."); continue; }
        if (x.by !== sender && !isHerdmaster(sender)){ R("Those are "+plainName(x.by)+"'s reins, sugar: only they (or a herdmaster) let go."); continue; }
        reinsLet(m, x.by === sender ? "off" : "staff", sender); audit(sender, "REINS", "off "+m); done.push(plainName(m));
      }
      if (done.length) R("🐴 Let go of "+done.join(", ")+".");
      return;
    }
    if (!a0){
      const mine = onReinsOf(sender), on = reinsOf(sender);
      R("🐴 "+(mine.length ? "On your reins: "+mine.map(m => plainName(m)+" ("+minsLeft(reinsOf(m).until)+" left)").join(", ")+". ?reins off [who] lets go." : "You've nobody on your reins.")+
        (on ? "\nYou're on "+plainName(on.by)+"'s reins, "+minsLeft(on.until)+" left." : "")+
        "\n?reins <who> [minutes]: somebody in your own "+herdWord(sender)+", at heel a step behind you wherever you walk ("+CFG.REINS_MIN+" minutes unless you say, up to "+CFG.REINS_MAX_MIN+"). Their safeword lets go.");
      return;
    }
    const t = resolveTarget(args[0]);
    if (!t || !rec(t)){ R("Lead who, sugar? ?reins <who> [minutes]: somebody in your own "+herdWord(sender)+", here on the map. ?reins off lets go."); return; }
    if (t === sender){ R("You can't hold your own reins, sugar."); return; }
    if (!membership(t, sender) && !isProprietor(sender)){ R("You can only take up the reins of your own "+herdWord(sender)+", sugar."); return; }
    if (!charFor(t) || !charFor(sender)){ R("You both need to be here on the farm for that, hon."); return; }
    if (!onMap(t) || !onMap(sender)){ R("You both need to be out on the map for the reins, sugar."); return; }
    const x0 = reinsOf(t);
    if (x0 && x0.by !== sender){ R(plainName(t)+" is on "+plainName(x0.by)+"'s reins already, sugar."); return; }
    const mins = Math.max(5, Math.min(CFG.REINS_MAX_MIN, parseInt(args[1], 10) || CFG.REINS_MIN));
    if (state.leashes) state.leashes.delete(t);   // (off the old ?walk lead, if they were on it)
    rec(t).reins = { by: sender, at: now, until: now + mins*60000 };
    saveLedger(); syncCompanions(); audit(sender, "REINS", t+" "+mins+"m");
    if (x0){ R("🐴 "+plainName(t)+"'s on your reins for "+mins+" minutes from now."); return; }
    say("🐴 "+reinsLine(REINS_ON, "reins:on", t, sender), false, t);
    const walks = canLead(t);
    whisper(t, "🐴 You're on "+plainName(sender)+"'s reins for "+mins+" minutes, sugar: wherever they walk, you follow a step behind"+(walks ? "" : " (I'll hop you along after them)")+". Your safeword lets go.");
    R("🐴 "+plainName(t)+" is on your reins for "+mins+" minutes. Walk, and they follow a step behind you. ?reins off lets go."+
      (reinsHeld(t) ? " Somethin's got hold of them just now: the reins pick up when it lets go." : "")+(walks ? "" : " (No Companion walkin' them, so I hop them along behind you.)"));
    if (!walks && !reinsHeld(t)) reinsStep(t, true);
  }
  // the Companion: the pet's own walks them (cues.js), the leader gets a "Let go" card
  function reinsStateFor(mn, s){
    const x = reinsOf(mn);
    if (x) s.reins = { mn: x.by, name: plainName(x.by), until: x.until, hold: (state.reinsHold && state.reinsHold.get(mn)) || undefined };
    const mine = onReinsOf(mn);
    if (mine.length) s.reinsMine = mine.map(m => ({ mn: m, name: plainName(m), until: reinsOf(m).until }));
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __reinsTick: () => { state.reinsSweepAt = 0; reinsTick(); }, __reinsOf: (m) => reinsOf(m), __reinsHeld: (m) => reinsHeld(m), __reinsStep: (m) => reinsStep(m, true) });
