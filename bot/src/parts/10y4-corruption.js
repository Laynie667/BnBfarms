  /* WHAT'S IN THIS FILE (10y4-corruption.js)
     • CORRUPTION: a meter for each test subject, 0 to 100. Every trap adds to it, a clutch laid in them adds more,
       the parasite more still. It never goes down by itself. At 20, 40, 60, 80 and 100 somethin' changes for good:
         20 a heat that comes easier and stays longer · 40 a size, somewhere · 60 a cum cravin' that never quite leaves ·
         80 a word that slips out when they talk (Companion) · 100 Ruined: every trap leans brutal for them.
       Staff can ?cleanse <who> for 5 of their own ribbons: 20 points off (the changes already made stay).
     • WHAT YOU LAY MATTERS: eggs keep the mark of what laid them (water, drake, hive, parasite, post, vine, toy, stud).
       Each kind sells for its own price at the gatherin', and a clutch of three kinds or more sells for a quarter more.
     • THE NIGHT RAID: through curfew, now and then, the pack doesn't wait. It comes into the barn for whichever
       subjects are there.
     • GOIN' UNDER: the haze, the lantern and the mirror box stack into a depth (0 to 5) that wears off a step every
       half hour. From depth 2 the Companion makes their words simpler on screen.
     • THE GAUNTLET: with ?spot set gauntlet-start and gauntlet-end on the map, a subject who steps on the start is
       timed to the end. No breather between traps on the way. A pot of ribbons for finishin' (?gauntlet pot <n>,
       proprietors); the ?gauntlet board keeps the fastest run and the most ruined one.
     • LENT FOR THE NIGHT: a subject says ?lend me. For three minutes anybody can ?bid <ribbons>. The winner names
       three traps (?route <kind> <kind> <kind>) and the subject is put through them in order. The subject keeps
       half the bid.
  */
  const cLine = (key, mn, v) => tFill(pickFor(mn, "corr:"+key, CORR_LINES[key]), mn, v);
  const CORR_MARKS = [20, 40, 60, 80, 100];
  function corruptionOf(mn){ return Math.max(0, Math.min(100, Math.round((rec(mn) || {}).corr || 0))); }
  function corrupt(mn, n, why){
    const r = rec(mn); if (!r || !isSubject(mn) || !(n > 0)) return;
    const was = corruptionOf(mn); r.corr = Math.min(100, (r.corr || 0) + n);
    const now = corruptionOf(mn);
    r.corrMarks = r.corrMarks || [];
    for (const m of CORR_MARKS) if (was < m && now >= m && !r.corrMarks.includes(m)){ r.corrMarks.push(m); later(() => corruptMark(mn, m), 9000 + r.corrMarks.length*500); }
    saveLedger();
  }
  function corruptMark(mn, m){
    const r = rec(mn), p = prodOf(mn); if (!r || !p) return;
    if (m === 40){
      const parts = bodyParts(mn).filter(k => ["udder", "butt", "testes", "penis"].includes(k) && CFG.SIZES[k]), part = parts[Math.floor(Math.random()*parts.length)];
      if (part) setSize(mn, part, sizeOf(mn, part) + (CFG.SIZES[part].step || 1), true);
    }
    if (m === 60) r.crave = { until: Date.now() + 3650*86400000, ate: Date.now(), told: Date.now(), forGood: true };
    if (m === 80) r.corrWord = CORR_WORDS[Math.floor(Math.random()*CORR_WORDS.length)];
    saveLedger(); syncCompanions(true); audit(CFG.BOT_MEMBER, "CORRUPT", mn+" mark "+m);
    if (charFor(mn)) emote("🖤 "+cLine("mark"+m, mn, { x: r.corrWord || "" }), mn);
    tell(mn, "🖤 Corruption "+m+", sugar. "+CORR_TELL[m].replace("%x", r.corrWord || "")+" That one's for keeps.");
  }
  const CORR_WORDS = ["breed me", "more", "please", "use me", "fill me", "yes"];
  const CORR_TELL = { 20: "Your heats come easier now, and they stay half again as long.", 40: "Somethin' on you has grown a size, and it isn't goin' back.",
    60: "The cravin' for cum doesn't leave you any more. It only quiets when you're fed.", 80: "There's a word in your mouth now that comes out on its own: \"%x\".",
    100: "You're RUINED. Every gas, spray and needle on this farm goes for its worst with you now." };
  // heat lasts longer for the corrupted (used where the traps start a heat)
  function corrHeatX(mn){ return ((rec(mn) || {}).corrMarks || []).includes(20) ? 1.5 : 1; }
  function ruined(mn){ return ((rec(mn) || {}).corrMarks || []).includes(100); }

  // ── what laid it ──
  const EGG_TYPES = { water: { price: 0.25, name: "water eggs" }, drake: { price: 0.4, name: "drake eggs" }, hive: { price: 0.3, name: "hive eggs" }, parasite: { price: 0.5, name: "parasite eggs" },
                      post: { price: 0.2, name: "post eggs" }, vine: { price: 0.25, name: "seed pods" }, toy: { price: 0.2, name: "toy-laid eggs" }, stud: { price: 0.3, name: "stud's eggs" } };
  function eggTypeOf(by){ return by === -2 ? "water" : by === -3 ? "toy" : by === -5 ? "post" : by === -6 ? "vine" : by === -7 ? "parasite" : by === -16 ? "drake" : by === -19 ? "hive" : "stud"; }
  function eggTypesNote(p, n, by){ if (!p.eggs) return; const t = eggTypeOf(by); p.eggs.types = p.eggs.types || {}; p.eggs.types[t] = (p.eggs.types[t] || 0) + n; }
  function eggTypesText(types){ const e = Object.entries(types || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]); return e.length ? e.map(([t, n]) => n+" "+EGG_TYPES[t].name).join(", ") : ""; }
  // what a layer's eggs fetch at one gatherin'
  function eggsWorth(types, n){
    const e = Object.entries(types || {}).filter(([, k]) => k > 0);
    if (!e.length) return Math.max(1, Math.round(n / CFG.EGGS_PER_RIBBON));
    let v = e.reduce((a, [t, k]) => a + k * EGG_TYPES[t].price, 0);
    if (e.length >= 3) v *= 1.25;
    return Math.max(1, Math.round(v));
  }

  // ── goin' under ──
  function underOf(mn){
    const r = rec(mn); if (!r || !r.under) return 0;
    const steps = Math.floor((Date.now() - r.under.at) / (CFG.UNDER_STEP_MIN*60000));
    return Math.max(0, Math.min(5, r.under.d - steps));
  }
  function goUnder(mn, n){
    const r = rec(mn); if (!r || /\b(hypno|trance|mind)/i.test(r.limits || "")) return;
    const d = Math.min(5, underOf(mn) + n);
    r.under = { d, at: Date.now() }; saveLedger(); syncCompanions(true);
    if (d >= 2) later(() => privateLine(mn, cLine("under"+Math.min(4, d), mn), "emote"), 6000);
  }

  // ── the night raid ──
  function raidTick(now){
    if (!inCurfew() || now - (state.raidAt || 0) < CFG.RAID_EVERY_MIN*60000) return;
    state.raidAt = now;
    if (Math.random() >= CFG.RAID_CHANCE) return;
    const barn = Object.keys(L.spots || {}).filter(n => /^barn/.test(n));
    const there = (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(m => isSubject(m) && barn.some(b => onSpot(m, b, 4)) && !trapWhyNot(m, "wolves"));
    if (!there.length) return;
    emote("🐺 "+cLine("raid", there[0]), there[0]);
    there.slice(0, 3).forEach((m, i) => later(() => { if (!springTrap(m, "wolves", "", true)){ rec(m).trapAt = Date.now(); saveLedger(); } }, 6000 + i*4000));
  }

  // ── the gauntlet ──
  function gauntletOn(){ return !!(L.spots && L.spots["gauntlet-start"] && L.spots["gauntlet-end"]); }
  function gauntletTick(now){
    if (!gauntletOn()) return;
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber; if (!isSubject(mn)) continue;
      const r = rec(mn);
      if (!r.run && onSpot(mn, "gauntlet-start", 0) && !quietNow(mn) && now - (r.runEnded || 0) > 60000){
        r.run = { at: now, traps: r.trapN || 0 }; r.trapAt = 0; r.spotTrapAt = {}; saveLedger();
        emote("🏁 "+cLine("runStart", mn), mn);
        tell(mn, "🏁 You're on the gauntlet, sugar. Get to the far end. Every trap on the way is awake and none of them will wait their turn. Pot: "+(L.gauntletPot || CFG.GAUNTLET_POT)+" ribbons. Your safeword ends the run.");
      } else if (r.run && onSpot(mn, "gauntlet-end", 1) && !heldByTrap(mn)){
        const ms = now - r.run.at, traps = (r.trapN || 0) - r.run.traps;
        r.run = null; r.runEnded = now;
        L.gauntlet = L.gauntlet || {};
        const fast = !L.gauntlet.fast || ms < L.gauntlet.fast.ms, most = !L.gauntlet.ruined || traps > L.gauntlet.ruined.n;
        if (fast) L.gauntlet.fast = { mn, ms, t: now };
        if (most && traps > 0) L.gauntlet.ruined = { mn, n: traps, t: now };
        saveLedger();
        const mins = Math.floor(ms/60000), secs = Math.round((ms % 60000)/1000);
        emote("🏁 "+cLine(traps >= 3 ? "runEndRuined" : "runEnd", mn, { x: mins+"m "+secs+"s", c: String(traps) }), mn);
        earnRibbons(mn, (L.gauntletPot || CFG.GAUNTLET_POT) + (fast ? 2 : 0), fast ? "the fastest gauntlet run on the board" : "finishin' the gauntlet");
      } else if (r.run && now - r.run.at > CFG.GAUNTLET_MAX_MIN*60000){ r.run = null; r.runEnded = now; saveLedger(); tell(mn, "🏁 Time's up on your gauntlet run, sugar. The traps had the better of you today."); }
    }
  }
  function onGauntlet(mn){ return !!(rec(mn) || {}).run; }

  // ── lent for the night ──
  function lendTick(now){
    const l = state.lend; if (!l) return;
    if (l.stage === "bids" && now >= l.until){
      const top = l.bids.sort((a, b) => b.n - a.n)[0];
      if (!top || !charFor(top.by) || ribbonsOf(top.by) < top.n){ state.lend = null; if (charFor(l.mn)) tell(l.mn, "🕯️ Nobody bid on you, sugar. Maybe next time."); return; }
      spendRibbons(top.by, top.n, "a night's loan of "+plainName(l.mn));
      later(() => earnRibbons(l.mn, Math.max(1, Math.floor(top.n/2)), "bein' lent out"), 2000);
      Object.assign(l, { stage: "pick", winner: top.by, paid: top.n, until: now + 5*60000 });
      emote("🕯️ "+cLine("lendWon", l.mn, { c: plainName(top.by), x: String(top.n) }), l.mn);
      tell(top.by, "🕯️ "+plainName(l.mn)+" is yours to walk through three traps, sugar. ?route <kind> <kind> <kind>, inside five minutes. Kinds: "+Object.keys(TRAP_KINDS).filter(k => !trapWhyNotFree(l.mn, k)).join(", ")+".");
    } else if (l.stage === "pick" && now >= l.until){ state.lend = null; if (charFor(l.mn)) tell(l.mn, "🕯️ Your buyer never chose, sugar. You're let off."); }
    else if (l.stage === "walk" && !heldByTrap(l.mn) && now >= (l.next || 0)){
      const k = l.picks.shift();
      if (!k || !charFor(l.mn) || quietNow(l.mn) || (rec(l.mn).trapQuiet || 0) > now){ state.lend = null; return; }
      l.next = now + 40000;
      if (!springTrap(l.mn, k, "", true)){ rec(l.mn).trapAt = now; saveLedger(); }
      if (!l.picks.length) later(() => { if (state.lend === l) state.lend = null; }, 60000);
    }
  }
  function corruptionCommand(cmd, sender, args, R){
    const r = rec(sender), a0 = String(args[0] || "").toLowerCase(), now = Date.now();
    if (cmd === "cleanse"){
      if (!isStaff(sender)){ R("Cleansin' is staff work, sugar."); return; }
      const t = resolveTarget(args[0]);
      if (!t || !isSubject(t)){ R("Cleanse who, sugar? ?cleanse <a test subject>. It costs you 5 ribbons and takes 20 off their corruption."); return; }
      if (corruptionOf(t) <= 0){ R(plainName(t)+" is clean as a whistle, sugar."); return; }
      if (ribbonsOf(sender) < CFG.CLEANSE_COST){ R("That takes "+CFG.CLEANSE_COST+" ribbons, sugar, and you haven't got them."); return; }
      spendRibbons(sender, CFG.CLEANSE_COST, "cleansin' "+plainName(t));
      rec(t).corr = Math.max(0, (rec(t).corr || 0) - 20); saveLedger(); audit(sender, "CLEANSE", String(t)); syncCompanions(true);
      if (charFor(t)) emote("🕊️ "+cLine("cleanse", t, { c: plainName(sender) }), t);
      R("🕊️ Done. "+plainName(t)+"'s corruption is down to "+corruptionOf(t)+". What it already changed in them stays changed."); return;
    }
    if (cmd === "corruption"){
      const t = args[0] && isStaff(sender) ? resolveTarget(args[0]) : sender;
      if (!t || !rec(t) || !isSubject(t)){ R("Corruption's a thing that happens to test subjects, sugar."); return; }
      const m = rec(t).corrMarks || [], next = CORR_MARKS.find(x => corruptionOf(t) < x);
      R("🖤 "+plainName(t)+": corruption "+corruptionOf(t)+" of 100."+(m.length ? " Changed for good at "+m.slice().sort((a, b) => a - b).join(", ")+"." : "")+(next ? " Next change at "+next+"." : " Nothin' left to change.")+(underOf(t) ? " Gone under: depth "+underOf(t)+"." : "")); return;
    }
    if (cmd === "gauntlet"){
      if (a0 === "pot"){
        if (!isProprietor(sender)){ R("The pot's for the proprietors to set, sugar."); return; }
        L.gauntletPot = Math.max(0, Math.min(30, parseInt(args[1], 10) || 0)); saveLedger(); R("🏁 The gauntlet pot is "+L.gauntletPot+" ribbons."); return;
      }
      const g = L.gauntlet || {};
      R(!gauntletOn() ? "🏁 There's no gauntlet laid out, sugar."+(isStaff(sender) ? " Mark the two ends: ?spot set gauntlet-start and ?spot set gauntlet-end, with trap spots between." : "")
        : "🏁 THE GAUNTLET · pot "+(L.gauntletPot || CFG.GAUNTLET_POT)+" ribbons\nStep on the start to run it. No breather between traps on the way."+
          "\nFastest: "+(g.fast ? plainName(g.fast.mn)+", "+Math.floor(g.fast.ms/60000)+"m "+Math.round((g.fast.ms % 60000)/1000)+"s" : "nobody yet")+
          "\nMost ruined: "+(g.ruined ? plainName(g.ruined.mn)+", "+g.ruined.n+" traps in one run" : "nobody yet")); return;
    }
    if (cmd === "lend"){
      if (a0 !== "me"){ R("🕯️ ?lend me puts you up for three minutes, sugar. Whoever bids the most ribbons picks three traps to walk you through, and you keep half."); return; }
      if (!isSubject(sender)){ R("Only a test subject can be lent to the traps, sugar."); return; }
      if (state.lend){ R("Somebody's already on the block, sugar. Wait your turn."); return; }
      if (quietNow(sender) || heldByTrap(sender)){ R("Not just now, sugar."); return; }
      state.lend = { mn: sender, stage: "bids", until: now + CFG.LEND_BID_S*1000, bids: [] };
      announce("🕯️ "+cLine("lendOpen", sender));
      R("🕯️ You're on the block for "+Math.round(CFG.LEND_BID_S/60)+" minutes, sugar. Let's see what you fetch."); return;
    }
    if (cmd === "bid"){
      const l = state.lend, n = parseInt(args[0], 10);
      if (!l || l.stage !== "bids"){ R("There's nobody on the block right now, sugar."); return; }
      if (sender === l.mn){ R("You can't buy yourself, sugar."); return; }
      if (!(n >= 1) || ribbonsOf(sender) < n){ R("?bid <ribbons>, sugar, and you need to have them."); return; }
      const top = Math.max(0, ...l.bids.map(b => b.n));
      if (n <= top){ R("The bid stands at "+top+", sugar. You'll have to beat it."); return; }
      l.bids = l.bids.filter(b => b.by !== sender).concat({ by: sender, n });
      emote("🕯️ "+plainName(sender)+" bids "+n+" ribbon"+(n === 1 ? "" : "s")+" for "+plainName(l.mn)+".", l.mn); return;
    }
    if (cmd === "route"){
      const l = state.lend;
      if (!l || l.stage !== "pick" || l.winner !== sender){ R("You've nobody to walk through the traps just now, sugar."); return; }
      const picks = args.map(x => String(x).toLowerCase()).filter(k => TRAP_KINDS[k]).slice(0, 3);
      const bad = picks.find(k => trapWhyNotFree(l.mn, k));
      if (picks.length < 1 || bad){ R(bad ? "The "+bad+" trap won't take "+plainName(l.mn)+" ("+trapWhyNotFree(l.mn, bad)+"). Pick another." : "?route <kind> <kind> <kind>, sugar: up to three."); return; }
      Object.assign(l, { stage: "walk", picks, next: 0 });
      emote("🕯️ "+cLine("lendWalk", l.mn, { c: plainName(sender), x: picks.join(", then ") }), l.mn);
      R("🕯️ Off they go: "+picks.join(", then ")+"."); return;
    }
  }
  function corruptionTick(){
    const now = Date.now();
    try { raidTick(now); gauntletTick(now); lendTick(now); } catch(e){ warn("corruption tick:", e); }
  }

  const CORR_LINES = {
    mark20: ["Somethin' in %n has shifted. There's a flush on them that doesn't quite fade any more, and a restlessness in the hips. Heat's goin' to find them easy from now on.",
             "%n's body has learned somethin' from the traps: how to want it, fast, and for a long time. It shows in the way they stand."],
    mark40: ["%n looks down at themselves and finds more than there was this mornin'. The farm's been addin' to them a dose at a time, and this part's stayin'.",
             "A part of %n has swelled a size and settled there. That's not a potion wearin' off. That's what they are now."],
    mark60: ["%n licks their lips and looks at the nearest crotch without meanin' to. The cravin's got into them for good. They're a cum-fed animal now, and they'll always be a little hungry.",
             "There's a hollow in %n that only one thing fills. The traps put it there, and it isn't leavin'."],
    mark80: ["%n opens their mouth to say somethin' ordinary, and what comes out on the end of it is \"%x\". They clap a hand over their mouth. It'll happen again.",
             "The farm's put a word in %n's mouth: \"%x\". It slips out when they aren't watchin' for it, and it means it."],
    mark100: ["%n is RUINED. There isn't a hole, a teat or a thought in them the traps haven't been through. They stand there swayin', wet, half-smilin', and the whole farm can see it's finished its work.",
              "That's the last of what %n used to be. One hundred. Ruined stock: bred, stretched, dosed and hollowed out into exactly what this place makes. Every trap on the farm knows their name."],
    cleanse: ["%c scrubs %n down with cold well water and somethin' bitter, front and back, inside and out, till a little of the fog lifts from their eyes.",
              "%c makes %n drink the whole cup, holds their nose till it's down, and waits. A shudder goes through them, and some of what the traps put in comes out as sweat."],
    under2: ["Your thoughts have gone slow and soft. Long words keep slippin' away before you can say them.", "It's easier not to think. You notice you've stopped tryin'."],
    under3: ["There's not much in your head but warm fog and the wantin'. Talkin' is hard. Short words. Simple.", "You forget what you were sayin'. It doesn't matter. Nothin' much matters but bein' good."],
    under4: ["Empty. Happy. Wet. That's all of you there is right now.", "No think. Just feel. Just do what's said."],
    raid: ["A howl, close, inside the barn. Then another from the loft. The pack hasn't waited for anybody to wander tonight. They've come in for %n.",
           "The barn door creaks in the dark. Yellow eyes, low to the straw, a lot of them. The wolf-men have come lookin' for whoever's sleepin' in here."],
    runStart: ["%n steps onto the mark, and a bell rings down the whole length of the gauntlet. Every trap on the run clicks awake.", "A flag drops. %n is on the gauntlet, and the traps know it."],
    runEnd: ["%n crosses the far line in %x, with %c trap(s) sprung on the way. Not bad. Not bad at all.", "%x, and only %c of them got a piece of %n. The farm girl rings the bell and counts out the pot."],
    runEndRuined: ["%n crawls over the line in %x, and they look like it took every second: %c traps had them on the way. Used, dosed, drippin', and still they finished.",
                   "%x. %c traps. %n makes the end of the gauntlet on hands and knees, leakin' from everywhere, and collapses on the pot of ribbons."],
    lendOpen: ["%n is up on the block tonight, y'all. Highest bid picks three traps and walks them through the lot. ?bid your ribbons. Three minutes.",
               "Who wants %n for the evenin'? Three traps of your choosin', and they've no say in which. ?bid and let's hear it."],
    lendWon: ["Sold to %c for %x ribbons. %n is led down off the block on a short rope and handed over.", "%c takes it at %x. %n looks at their buyer, and at the traps, and swallows."],
    lendWalk: ["%c takes %n by the collar and walks them to the first one. The order's been decided: %x.", "\"This way.\" %c has a route planned for %n: %x."],
  };
