  /* WHAT'S IN THIS FILE (10o-bench.js)
     THE USE BENCH: a punishment out in the open. Staff (?bench <who> [minutes]) or the wheel (a "bench 20"
     slice) sentence somebody who said ?bench on to time strapped over a bench spot (?spot set bench,
     bench-2, bench-3…), and anybody standin' by can ?use them (mouth, pussy or ass) till the time's up.
     Somebody can also volunteer: ?bench me 30.
     • Only for people who said ?bench on. Their limits rule it out the same as the glory stalls do, and a gag,
       chastity or a plug closes that hole. Not ?breedable: loads go over them, never inside.
     • Every use is chalked on the bench: their count this sentence, the week's ?bench top, and the ?board.
     • Wander off and the farm girl straps them back down. Their SAFEWORD ends it at once (so does ?bench off).
     • A served sentence earns a ribbon.
  */
  function benchSpots(){ return Object.entries(L.spots || {}).filter(([n]) => n === "bench" || /^bench-[a-z0-9]+$/.test(n)); }
  function benchedNow(mn){ const r = rec(mn); return !!(r && r.benched && r.benched.until > Date.now()); }
  function benchedHere(){ return Object.keys(L.people).map(Number).filter(m => benchedNow(m) && onMap(m)); }
  const BENCH_HOLES = { mouth: "mouth", vulva: "pussy", butt: "ass" };
  function benchHole(w){
    w = String(w || "").toLowerCase();
    if (/^(mouth|throat|oral|face)$/.test(w)) return "mouth";
    if (/^(pussy|vulva|cunt|vagina)$/.test(w)) return "vulva";
    if (/^(ass|butt|anus|anal|arse)$/.test(w)) return "butt";
    return null;
  }
  function benchOpenHoles(mn){ return HOLES.filter(h => (h !== "vulva" || hasVulva(mn)) && !holeBlocked(mn, h)); }
  // can they be put on the bench at all? null = yes, otherwise why not (said to staff, never to the room)
  function benchWhyNot(mn){
    const r = rec(mn);
    if (!r || !r.roles || !r.roles.length) return plainName(mn)+" isn't on the farm's books, sugar.";
    if (!r.benchOn) return plainName(mn)+" hasn't said ?bench on, so they can't be put on the bench.";
    if (limitBlocks(mn, "breed")) return plainName(mn)+"'s limits rule the bench out.";
    if (!onMap(mn)) return plainName(mn)+" needs to be here on the map for that, hon.";
    if (benchedNow(mn)) return plainName(mn)+" is already on the bench.";
    if (stockedNow(mn)) return plainName(mn)+" is in the stocks right now.";
    if (!benchSpots().length) return "There's no bench set up yet, sugar. Stand on it and say ?spot set bench (bench-2, bench-3… for more).";
    return null;
  }
  // each pool is played as a shuffled deck, so nobody hears the same line twice till the whole pool's been used
  function benchLine(key, list){
    state.benchDecks = state.benchDecks || new Map();
    let d = state.benchDecks.get(key);
    if (!d || !d.length){ d = list.slice().sort(() => Math.random() - 0.5); state.benchDecks.set(key, d); }
    return d.pop();
  }
  const benchFill = (t, v) => String(t).replace(/%t/g, v.t).replace(/%u/g, v.u || "").replace(/%ml/g, v.ml || "").replace(/%n/g, String(v.n || ""));

  const BENCH_LINES = {
    on: [
      "%t is walked to the use bench, bent over the worn wood and strapped down at the waist and ankles, bottom up and open to anybody who wanders by.",
      "The farm girl leads %t to the bench, pushes them down over it and buckles the straps tight. \"Stay put, sugar. Folks'll be by.\"",
      "%t is laid face down over the use bench, wrists cuffed to the legs, knees spread wide by the bar. Everything's on offer now.",
      "A farmhand drapes %t over the use bench and cinches the strap across their back. A fresh chalk board hangs from the end: zero, for now.",
      "%t gets strapped over the bench in the middle of the yard, ass in the air, where every passin' animal can see and help themselves.",
    ],
    mouth: [
      "%u steps up to the head of the bench, takes a fistful of %t's hair and feeds their cock past those lips, usin' %t's mouth till they spill %ml down %t's throat.",
      "%u tilts %t's chin up off the bench and fucks their face slow and deep, then holds them there and empties %ml onto their tongue.",
      "%t's mouth is pried open and %u slides in, pumpin' till they groan and flood it with %ml. %t swallows what they can.",
      "%u grabs the bench and uses %t's throat like it was built for it, then pulls back just enough to finish %ml across %t's tongue.",
      "%u stands at the front of the bench and %t's mouth gets used, hard and messy, till %ml of warm cum is dribblin' down their chin.",
    ],
    vulva: [
      "%u steps up behind the bench, grips %t's hips and sinks into their pussy, pounding them against the wood till they bury it deep and pump %ml inside.",
      "%u takes their turn on %t's pussy, slow at first, then rough enough to rattle the straps, and leaves %ml of seed packed deep in them.",
      "%t's pussy is already slick when %u pushes in. They use it hard and finish deep, %ml of it, and %t can feel every pulse.",
      "%u spreads %t open with their thumbs, slides in to the hilt and breeds them right there on the bench, %ml of thick seed left behind.",
      "The bench creaks as %u ruts into %t's pussy from behind, grunting, then holds still and fills them with %ml.",
    ],
    butt: [
      "%u spits, lines up with %t's ass and works in inch by inch, then fucks them steady till they unload %ml deep inside.",
      "%u grabs a handful of %t's ass, spreads it and takes it, rough and greedy, finishin' %ml deep in them.",
      "%t's ass gets used next. %u pushes in to the root, rides them hard against the bench and leaves %ml behind.",
      "%u takes %t's ass slow and deep, savouring it, till they shudder and pump %ml inside.",
      "With a slap on the rump, %u sinks into %t's ass and doesn't stop till %ml is dripping back out of them.",
    ],
    over: [
      "%u uses %t's %h till they're close, then pulls out and paints %ml across %t's back.",
      "%u takes their pleasure from %t's %h, then pulls free at the last second and spills %ml over %t's ass and thighs.",
      "%u rides %t's %h hard, then pulls out and marks them, %ml splashed across the small of their back.",
    ],
    dry: [
      "%u steps up to the bench and has their way with %t's %h, hands and tongue and fingers, till %t is shaking in the straps.",
      "%u takes a turn on %t's %h, slow and thorough, workin' them over till they're squirmin' against the wood.",
      "%u leans over the bench and uses %t's %h however they like, and leaves them dripping and pantin'.",
      "%u gives %t's %h a long, rough goin'-over, then pats their rump and steps aside for the next one.",
    ],
    tally: [
      "The farm girl chalks another line on the board hangin' off the bench: %n now, and the line's still growin'.",
      "Another chalk mark goes up beside %t: %n so far. The board's fillin' up.",
      "%n marks on the bench board now. %t can hear the chalk squeak every time.",
    ],
    ambient: [
      "The straps creak every time you shift on the bench. The wood is warm under your belly now.",
      "Somebody walks past, slow, and you feel their eyes on everything you've got on show.",
      "A breeze moves across your bare, spread skin. Nothing to do but wait for the next one.",
      "You can hear the chalk board tap against the bench leg when you squirm.",
      "Your thighs are sticky and your knees ache from the spreader bar. Still you wait, bottom up.",
      "A farmhand gives your rump a slap in passing and laughs when you jump in the straps.",
      "The yard keeps on around you, voices and hooves and the pump in the barn, and you stay right where you're put.",
      "You catch yourself listening for footsteps, and you can't tell any more if you're dreadin' them or hopin'.",
    ],
    back: [
      "%t gets half a step off the bench before the farm girl catches the strap and buckles them right back down. \"Nuh uh, sugar.\"",
      "A farmhand hauls %t back over the bench and cinches the strap a notch tighter for tryin'.",
      "\"Where do you think you're goin'?\" The farm girl walks %t back to the bench and bends them over it again.",
    ],
    off: [
      "The straps come off and %t climbs stiffly off the use bench, used %n time%s, thighs sticky. The farm girl wipes the chalk board clean.",
      "%t is unbuckled at last, %n marks on the board and legs wobbly. \"Time served, sugar.\"",
      "The farm girl frees %t from the bench and helps them up. %n uses chalked up, and they're wearin' every one of 'em.",
    ],
  };

  function benchWeek(){ const k = weekKey(); if (!L.benchBoard || L.benchBoard.week !== k) L.benchBoard = { week: k, n: {}, by: {} }; return L.benchBoard; }

  // put them on the bench; returns the spot name, or null if it can't happen
  function benchIn(mn, mins, by, why){
    if (benchWhyNot(mn)) return null;
    const r = rec(mn), spots = benchSpots();
    const taken = (s) => (W.ChatRoomCharacter || []).some(c => c.MemberNumber !== mn && c.MapData && c.MapData.Pos && c.MapData.Pos.X === s.X && c.MapData.Pos.Y === s.Y);
    const [name, s] = spots.find(([, s]) => !taken(s)) || spots[0];
    if (r.penned) r.penned = null;    // the bench wins over the corral
    r.benched = { until: Date.now() + mins*60000, X: s.X, Y: s.Y, name, by: by || CFG.BOT_MEMBER, uses: 0, since: Date.now(), ambAt: Date.now() + (4 + Math.random()*4)*60000 };
    saveLedger(); audit(by || CFG.BOT_MEMBER, "BENCH", mn+" "+name+" "+mins+"m"+(why ? " ("+why+")" : ""));
    teleport(mn, { X: s.X, Y: s.Y }, true);
    later(() => { if (benchedNow(mn)) emote("🪵 "+benchFill(benchLine("on", BENCH_LINES.on), { t: plainName(mn) }), mn); }, 2500);
    tell(mn, "🪵 You're on the use bench for "+mins+" minutes, sugar"+(by && by !== CFG.BOT_MEMBER && by !== mn ? ", courtesy of "+plainName(by) : "")+
             ". Anybody standin' by can use you. Wander off and I'll strap you back down. Your safeword (or ?bench off) ends it right away.");
    syncCompanions(true);
    return name;
  }
  // how: "time" (served), "safe" (safeword: instant and quiet), "staff", "off" (they said ?bench off), "gone"
  function unbench(mn, how){
    const r = rec(mn); if (!r || !r.benched) return false;
    const b = r.benched; r.benched = null; saveLedger();
    audit(how === "staff" ? 0 : mn, "UNBENCH", mn+" "+how+" "+b.uses+" uses");
    syncCompanions(true);
    if (how === "safe") return true;   // the safeword says everything that needs sayin'
    if (how === "time"){
      if (onMap(mn)) emote("🪵 "+benchFill(benchLine("off", BENCH_LINES.off), { t: plainName(mn), n: b.uses }).replace(/%s/g, b.uses === 1 ? "" : "s"), mn);
      tell(mn, "🪵 Time served, sugar. You were used "+b.uses+" time"+(b.uses === 1 ? "" : "s")+" on the bench. Go get cleaned up and have some water.");
      later(() => earnRibbons(mn, 1, "servin' your time on the use bench"), 2000);
    } else if (how === "off") tell(mn, "🪵 The straps are off, sugar. You're free, and nobody can put you on the bench till you say ?bench on again.");
    else if (how === "staff") tell(mn, "🪵 Staff let you up off the bench, sugar. You're free to go.");
    return true;
  }
  function benchTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      if (!r.benched) continue;
      const mn = parseInt(k, 10), b = r.benched;
      // they turned it off or their limits changed: let them up
      if (!r.benchOn || limitBlocks(mn, "breed")){ unbench(mn, "off"); continue; }
      if (b.until <= now){ unbench(mn, "time"); continue; }
      const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos;
      if (!pos || pos.X < 0) continue;
      if (Math.max(Math.abs(pos.X - b.X), Math.abs(pos.Y - b.Y)) > 1){
        if (now - (b.pullAt || 0) < 30000) continue;
        b.pullAt = now; saveLedger();
        teleport(mn, { X: b.X, Y: b.Y }, true);
        emote("🪵 "+benchFill(benchLine("back", BENCH_LINES.back), { t: plainName(mn) }), mn);
        continue;
      }
      // waitin' between users: a private line now and then
      if (now >= (b.ambAt || 0)){ b.ambAt = now + (4 + Math.random()*4)*60000; privateLine(mn, benchLine("amb", BENCH_LINES.ambient), "emote"); }
    }
  }

  // ?use [who] [mouth|pussy|ass]: whoever's on the bench next to you
  function benchUse(sender, args, R){
    let t = null, holeArg = null;
    for (const a of args){ const h = benchHole(a); if (h){ holeArg = h; continue; } const m = resolveTarget(a); if (m && benchedNow(m)) t = m; }
    const near = (m) => { const p = posOf(sender), q = posOf(m); return p && q && Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y)) <= 2; };
    if (!t) t = benchedHere().find(near) || null;
    if (!t){ R(benchedHere().length ? "Get right up to the bench first, sugar (within a couple of steps). ?bench shows who's on it." : "Nobody's on the use bench right now, sugar."); return; }
    if (t === sender){ R("You can't use yourself, sugar. Just wait. Somebody'll be along."); return; }
    if (!rec(sender) || !(rec(sender).roles || []).length){ R("You need to be on the farm's books to use the bench, sugar. ?apply gets you started."); return; }
    if (!onMap(sender) || !near(t)){ R("Get right up to "+plainName(t)+" on the bench first, sugar."); return; }
    state.benchBusy = state.benchBusy || new Map();
    const last = state.benchBusy.get(t+":"+sender) || 0;
    if (Date.now() - last < CFG.BENCH_REUSE_SEC*1000){ R("Give it a minute, sugar. Let somebody else have a turn."); return; }
    const open = benchOpenHoles(t);
    if (!open.length){ R(plainName(t)+" is all covered up right now (gag, chastity, a plug), sugar."); return; }
    const hole = holeArg || open[Math.floor(Math.random()*open.length)];
    if (!open.includes(hole)){ R("That one's closed off, sugar. Try "+open.map(h => BENCH_HOLES[h]).join(" or ")+"."); return; }
    const sp = prodOf(sender), tp = prodOf(t), rt = rec(t);
    if (makesSemen(sender) && holeBlocked(sender, "penis")){ R("You're locked up, sugar. Can't use the bench like that."); return; }
    state.benchBusy.set(t+":"+sender, Date.now());
    // a load, if they make one and aren't denied
    let load = 0, pent = false;
    if (makesSemen(sender) && sp && !(sp.deniedUntil > Date.now())){
      pent = !!sp.pentUp;
      load = pent ? sp.semen * CFG.PENTUP_LOAD_X : Math.max(sp.semen * CFG.PROD.LOAD_SHARE, Math.min(sp.semen, CFG.PROD.MIN_LOAD));
      if (load < 1) load = 0;
      else {
        sp.semen = pent ? 0 : sp.semen - Math.min(sp.semen, load);
        if (pent){ sp.pentUp = false; sp.semenFullSince = 0; }
        sp.totals.given = (sp.totals.given || 0) + load;
      }
    }
    // inside only if they're ?breedable (the mouth is always fair game on the bench)
    const inside = load >= 1 && (hole === "mouth" || !!rt.breedable);
    const vars = { t: plainName(t), u: plainName(sender), ml: ml(load) };
    let line;
    if (!load) line = benchLine("dry", BENCH_LINES.dry).replace(/%h/g, BENCH_HOLES[hole]);
    else if (!inside) line = benchLine("over", BENCH_LINES.over).replace(/%h/g, BENCH_HOLES[hole]);
    else line = benchLine(hole, BENCH_LINES[hole]);
    if (pent && load) line += " Pent up as %u was, it just kept comin'.";
    let caught = null;
    if (inside){
      const kept = Math.min(load, Math.max(0, capacity(t) - heldTotal(tp)));
      tp.held[hole] = (tp.held[hole] || 0) + kept; tp.totals.received = (tp.totals.received || 0) + kept;
      tp.lastStud = sender;
      lscgSplatAt(t, HOLE_SPLAT[hole] || ["ItemVulva"], plainName(sender));
      if (hole === "mouth") tp.milk = Math.min(milkCap(t), tp.milk + kept * CFG.PROD.SWALLOW_TO_MILK);
      if (hole === "vulva"){
        sp.totals.covers = (sp.totals.covers || 0) + 1;
        tp.lastFill = { at: Date.now(), stud: sender, ml: kept };
        if (rt.fertile && !limitBlocks(t, "breed")) caught = rollConception(t, sender, kept, pent ? CFG.PENTUP_FERT_X : 1);
        if (caught){ sp.totals.conceived = (sp.totals.conceived || 0) + 1; rollBoard(); const Y = L.yield; Y.s = Y.s || {}; Y.s[sender] = (Y.s[sender] || 0) + 1; }
      }
      addonsEmit("bred", sender, t, hole, load, caught);   // the whole load counts for the stud book, even into somebody already full
    } else if (load) paintOn(t, hole === "mouth" ? "face" : "back", sender);
    tally(t);
    const b = rt.benched; b.uses++;
    const W0 = benchWeek(); W0.n[t] = (W0.n[t] || 0) + 1; W0.by[sender] = (W0.by[sender] || 0) + 1;
    saveLedger(); audit(sender, "BENCH_USE", t+" "+hole+(load ? " "+Math.round(load)+"mL" : ""));
    { const tb = Math.random() < 0.7 ? tailBit(t, hole, sender) : ""; if (tb) line += " "+tb.replace(/%/g, ""); }   // their tail, if they wear one
    emote("🪵 "+benchFill(line, vars), t, [sender]);
    face(t, inside ? "bred" : "afterglow", 40); sound(t, "wet");
    if (b.uses % 3 === 0) later(() => { if (benchedNow(t)) emote("🪵 "+benchFill(benchLine("tally", BENCH_LINES.tally), { t: plainName(t), n: b.uses }), t); }, 4000);
    if (caught === "new") later(() => tell(t, "🍼 A warm, heavy feelin' settles low in your belly, sugar. Somethin' from the bench took. (?stats shows it)"), 20000);
  }

  function benchText(mn){
    const r = rec(mn), here = Object.keys(L.people).map(Number).filter(benchedNow);
    const list = here.length ? here.map(m => "• "+plainName(m)+": "+rec(m).benched.uses+" use"+(rec(m).benched.uses === 1 ? "" : "s")+", "+
                                            Math.max(1, Math.ceil((rec(m).benched.until - Date.now())/60000))+" min left").join("\n") : "Nobody's on it right now.";
    const mine = r && r.benched ? "\nYou're on it: "+r.benched.uses+" use"+(r.benched.uses === 1 ? "" : "s")+" so far, "+Math.max(1, Math.ceil((r.benched.until - Date.now())/60000))+" minutes to go." : "";
    return "🪵 THE USE BENCH\n"+list+mine+"\n\nYou're "+(r && r.benchOn ? "ON" : "off")+" for it (?bench on|off). Stand by somebody on it and ?use [mouth|pussy|ass]. ?bench top for the week.";
  }
  function benchTopText(){
    const B = benchWeek();
    const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([m, n], i) => "  "+(i+1)+". "+plainName(parseInt(m, 10))+": "+n).join("\n") || "  (nobody yet)";
    return "🪵 THE BENCH THIS WEEK\nMost used\n"+top(B.n)+"\n\nBusiest users\n"+top(B.by);
  }
  // the ?board's bench line: the week's most-used, and anybody on it right now
  function benchBoardLine(){
    const B = benchWeek(), top = Object.entries(B.n).sort((a, b) => b[1] - a[1])[0];
    const now = Object.keys(L.people).map(Number).filter(benchedNow);
    if (!top && !now.length) return "";
    return "\n\n🪵 Use bench"+(top ? ": most used this week, "+plainName(parseInt(top[0], 10))+" ("+top[1]+")" : "")+
           (now.length ? (top ? " · " : ": ")+"on it now, "+now.map(m => plainName(m)+" ("+rec(m).benched.uses+")").join(", ") : "");
  }
  // ?bench · ?bench on|off · ?bench top · ?bench me [min] · staff: ?bench <who> [min] · ?unbench <who> · ?use
  function benchCommand(cmd, sender, args, R){
    if (cmd === "use"){ benchUse(sender, args, R); return; }
    const r = rec(sender), sub = String(args[0] || "").toLowerCase();
    if (cmd === "unbench"){
      if (!isStaff(sender)){ R("Only staff let somebody off the bench early, sugar. Your safeword always works for yourself."); return; }
      const t = resolveTarget(args[0]);
      if (!t || !unbench(t, "staff")){ R("They're not on the bench, hon. ?unbench <who>"); return; }
      R("🪵 Let "+plainName(t)+" up off the bench."); return;
    }
    if (sub === "on" || sub === "off"){
      if (!r || !r.roles || !r.roles.length){ R("The bench is for folks on the books, sugar."); return; }
      r.benchOn = sub === "on"; saveLedger(); syncCompanions(true);
      if (sub === "off" && r.benched){ unbench(sender, "off"); R("🪵 Bench off. You're unstrapped right now, and nobody can put you back."); return; }
      R(r.benchOn ? "🪵 Use bench ON. Staff and the wheel can sentence you to time on the bench, where anybody can use you. Your limits, your gear and ?breedable still count, and your safeword ends it at once. ?bench off any time."
                  : "🪵 Use bench off. Nobody can put you on it.");
      return;
    }
    if (sub === "top" || sub === "board"){ R(benchTopText()); return; }
    if (!sub){ R(benchText(sender)); return; }
    let t, minArg;
    if (sub === "me" || sub === "myself"){ t = sender; minArg = args[1]; }
    else {
      if (!isStaff(sender)){ R("Only staff put somebody on the bench, sugar (the wheel does too). You can volunteer: ?bench me 30."); return; }
      t = resolveTarget(args[0]); minArg = args[1];
    }
    if (!t || !rec(t)){ R("Who's goin' on the bench, sugar? ?bench <who> [minutes, 5-120]"); return; }
    const mins = Math.max(5, Math.min(CFG.BENCH_MAX_MIN, parseInt(minArg, 10) || 30));
    const why = benchWhyNot(t);
    if (why){ R(t === sender ? why.replace(plainName(t)+" hasn't said", "You haven't said").replace(plainName(t)+" needs", "You need").replace(plainName(t)+" is already", "You're already").replace(plainName(t)+"'s limits", "Your limits") : why); return; }
    benchIn(t, mins, sender, t === sender ? "volunteered" : "staff");
    R(t === sender ? "🪵 Strappin' you in for "+mins+" minutes, sugar." : "🪵 "+plainName(t)+" is on the use bench for "+mins+" minutes.");
  }
