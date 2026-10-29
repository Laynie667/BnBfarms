  /* WHAT'S IN THIS FILE (10x-trap-extras.js)
     What grew up round the traps (10u-traps.js) once the test subjects started springin' them:
     • ?struggle        one try at slippin' whatever has you. Win: out early, and a ribbon. Lose: it tightens.
     • ?hunt start [min] proprietors: a bell, every trap reset, a finish spot. Subjects who reach it get ribbons.
                         ?hunt · how it stands · ?hunt stop
     • THE ROAMIN' PACK  if there's a trap-wolves den, the pack moves to a different spot every hour, and subjects
                         only hear roughly where. ?pack on|off (proprietors) · ?pack says where they were last heard.
     • ?trap bait <spot> <ribbons>  proprietors: the next subject that trap catches is paid for it.
     • AFTERMATH         muddy, slimed, pissed on, branded, reekin' of boar or goat: it shows on their right-now strip
                         till they ?wash, and stock standin' close get a line about it now and then.
     • THE NEST          ?spot set nest. Carryin' a clutch at least an hour old? Stand on it and ?lay.
                         Staff ?gather the eggs: the farm sells them, and the layers get ribbons.
     • ?free <who>       stand by a caught subject and try to get them out (it may get you instead).
       ?goad <who>       ...or help the trap along.
     • THE TRAP CARD     every kind that's had a subject, how often, and what's still out there (Companion).
     • THE CRATE         ?spot set crate. Only a subject can open it: ribbons, a bottle, or somethin' with teeth.
     • AFTER DARK        through curfew the traps reset twice as fast and the water's three times as hungry.
     • SUBJECT OF THE WEEK on the ?board: most traps sprung, most eggs laid, most loads from things with fur.
  */
  const xLine = (key, mn, v) => tFill(pickFor(mn, "trapx:"+key, EXTRA_LINES[key]), mn, v);
  function subjWeek(){ const k = weekKey(); if (!L.subjWeek || L.subjWeek.week !== k) L.subjWeek = { week: k, traps: {}, eggs: {}, fur: {} }; return L.subjWeek; }
  const bump1 = (o, mn, n) => { o[mn] = (o[mn] || 0) + (n || 1); };
  const nightX = () => (inCurfew() ? { reset: 0.5, water: 3 } : { reset: 1, water: 1 });
  function huntOn(){ return !!(L.hunt && L.hunt.until > Date.now()); }

  // a trap went off: the tallies, and any bait on it
  function trapSprung(mn, kind, spot){
    const r = rec(mn);
    r.trapKinds = r.trapKinds || {}; r.trapKinds[kind] = (r.trapKinds[kind] || 0) + 1;
    bump1(subjWeek().traps, mn);
    if (spot && L.trapBait && L.trapBait[spot]){
      const n = L.trapBait[spot]; delete L.trapBait[spot];
      later(() => earnRibbons(mn, n, "takin' the bait"), 3000);
    }
  }
  // a trap finished with them: what they're left wearin'
  function trapDone(mn, kind, before){
    const r = rec(mn), d = r.dirt = r.dirt || {}, now = Date.now();
    if (kind === "mud" || kind === "boar") d.mud = now;
    if (kind === "slime") d.slime = now;
    if ((r.pissed || 0) > (before.pissed || 0)) d.piss = now;
    if (kind === "boar" || kind === "goat" || kind === "kennel" || kind === "wolves") d.reek = { boar: "boar", goat: "billy goat", kennel: "kennel", wolves: "wolf" }[kind];
    if (kind === "brand" && r.branded) d.brand = r.branded;
    if (ANTHRO[kind] && ANTHRO[kind].sire <= -10) bump1(subjWeek().fur, mn, ANTHRO[kind].loads);
    // ...and what it writes on them, so everybody can read what had them
    const words = TRAP_WRITES[kind];
    if (words && Math.random() < CFG.TRAP_WRITE_CHANCE){
      const w = words[Math.floor(Math.random()*words.length)];
      later(() => { if (bodyMark(mn, { write: { line: w, area: ["hips", "waist", "chest", "ribs"][Math.floor(Math.random()*4)] } })){ const r2 = rec(mn); r2.dirt = r2.dirt || {}; r2.dirt.brand = w; saveLedger(); } }, 4000);
    }
  }
  const TRAP_WRITES = {
    wolves: ["PACK BITCH", "KNOTTED X5", "WOLF BRED", "PACK'S HOLE"], stallion: ["MARE", "HORSE FUCKED", "STUD'S MARE", "TOOK IT ALL"], bull: ["HEIFER", "BULL BRED", "MILKED AND BRED"],
    warren: ["BUNNY HOLE", "BRED X10", "RABBIT'S FUCKTOY"], boar: ["SOW", "HOG BRED", "BOAR'S SOW", "PLUGGED SOW"], toms: ["QUEEN IN HEAT", "TOM'S TOY", "BARBED AND BRED"],
    drake: ["DRAGON'S BROODER", "EGG LAYER", "HOARD"], naga: ["BOTH HOLES", "SNAKE STUFFED"], kennel: ["KENNEL BITCH", "KNOT TRAINED", "GOOD BITCH"],
    hive: ["HIVE BROODER", "EGG CELL"], goat: ["BILLY'S MOUTH", "THROAT FUCKED"], sow: ["MATRON'S PET", "NURSED AND BRED"],
    tentacle: ["EGG SACK", "TENTACLE BRED", "BROODER", "FULL OF EGGS"], breeder: ["MACHINE BRED", "BREEDING STOCK"], eggs: ["EGG SACK", "LAYS ON COMMAND"],
    pump: ["PUMPED FULL", "FILL TO HERE"], milker: ["MILKED DRY", "DAIRY STOCK"], wall: ["HOLE IN A FENCE", "USED BY STRANGERS", "BOTH ENDS"], pillory: ["HELP YOURSELF", "PUBLIC HOLES"],
    clamp: ["DENIED", "NO CUMMING"], paddle: ["SPANKED X20", "BAD ANIMAL"], spray: ["CUM RAG", "SPRAYED"], trough: ["PISS TROUGH", "FARM URINAL"], vines: ["SEED BED", "PLANTED"],
  };
  function aftermathOf(mn){
    const d = (rec(mn) || {}).dirt || {}, out = [];
    if (d.mud) out.push({ icon: "🐖", text: "Caked in mud" });
    if (d.slime) out.push({ icon: "🟢", text: "Slimed" });
    if (d.piss) out.push({ icon: "💛", text: "Pissed on" });
    if (d.reek) out.push({ icon: "👃", text: "Reeks of "+d.reek });
    if (d.brand) out.push({ icon: "🖋️", text: "Branded: "+d.brand });
    return out;
  }
  function aftermathWash(mn){ const r = rec(mn); if (!r || !r.dirt) return false; const had = aftermathOf(mn).length > 0; r.dirt = null; r.gluedUntil = 0; return had; }
  // somebody close by notices
  function smellTick(now){
    if (now - (state.smellAt || 0) < CFG.SMELL_MIN*60000) return;
    state.smellAt = now;
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, d = (rec(mn) || {}).dirt;
      if (!d || !(d.mud || d.slime || d.piss || d.reek)) continue;
      const near = (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(m => m !== mn && m !== CFG.BOT_MEMBER && rec(m) && (() => { const a = posOf(mn), b = posOf(m); return a && b && Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 2; })());
      if (!near.length || Math.random() < 0.5) continue;
      const what = d.reek ? d.reek : d.piss ? "piss" : d.slime ? "slime" : "the hog wallow";
      privateLine(near[Math.floor(Math.random()*near.length)], tFill(pickFor(mn, "trapx:smell", EXTRA_LINES.smell), mn, { c: what }), "emote");
    }
  }

  // ── ?struggle ──
  function struggle(mn, R){
    const r = rec(mn), run = state.trapRuns && state.trapRuns.get(mn);
    const held = run ? "run" : r && r.trapWait ? "wait" : r && r.benched && r.benched.trap ? "pillory" : null;
    if (!held){ R("Nothin's got hold of you, sugar."); return; }
    const key = held === "run" ? run : held === "wait" ? r.trapWait : r.benched;
    if (key.struggled){ R("You've had your one try at this one, sugar. It's got you."); return; }
    key.struggled = true;
    let heavy = 1; try { const p = prodOf(mn); if (heldTotal(p) > 0.8*capacity(mn) || bellyStage(mn) >= 3 || (makesMilk(mn) && p.milk > 0.9*milkCap(mn))) heavy = 0.6; } catch(e){}   // full and heavy: harder to get loose (Oct 24)
    if (Math.random() < CFG.STRUGGLE_CHANCE*heavy){
      if (held === "pillory") unbench(mn, "safe");
      trapStop(mn, 0);
      emote("💪 "+xLine("free", mn), mn);
      later(() => earnRibbons(mn, 1, "slippin' a trap"), 2000);
      R("💪 You're out, sugar! That's a ribbon for you.");
    } else {
      if (held === "run" && run.beats) run.beats.splice(run.i, 0, EXTRA_LINES.tighten, EXTRA_LINES.tighten);
      if (held === "wait"){ r.trapWait.until += 2*60000; if (r.penned) r.penned.until += 2*60000; }
      if (held === "pillory") r.benched.until += 3*60000;
      saveLedger();
      if (held !== "run") emote("⛓️ "+xLine("tighten", mn), mn);
      R("⛓️ No good, sugar. It's got you tighter than before, and it'll keep you longer.");
    }
  }

  // ── ?free / ?goad ──
  function heldByTrap(mn){ const r = rec(mn); return !!((state.trapRuns && state.trapRuns.has(mn)) || (r && (r.trapWait || (r.benched && r.benched.trap)))); }
  function byTrapCommand(cmd, sender, args, R){
    const t = resolveTarget(args[0]) || (W.ChatRoomCharacter || []).map(c => c.MemberNumber).find(m => m !== sender && heldByTrap(m) && (() => { const a = posOf(sender), b = posOf(m); return a && b && Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 2; })());
    if (!t || !heldByTrap(t)){ R("There's nobody caught near you, sugar. Get within a couple of steps of somebody a trap has."); return; }
    const a = posOf(sender), b = posOf(t);
    if (t === sender || !a || !b || Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) > 2){ R(t === sender ? "?struggle is the one for gettin' yourself out, sugar." : "Get right up to "+plainName(t)+" first, sugar."); return; }
    const v = { c: plainName(sender) };
    if (cmd === "goad"){
      emote("😈 "+xLine("goad", t, v), t); arouse(t, 15); audit(sender, "GOAD", String(t));
      R("😈 You lend the trap a hand with "+plainName(t)+"."); return;
    }
    state.freeTried = state.freeTried || new Map();
    if (Date.now() - (state.freeTried.get(sender+":"+t) || 0) < 5*60000){ R("You've tried, sugar. Give it a few minutes."); return; }
    state.freeTried.set(sender+":"+t, Date.now());
    audit(sender, "FREE", String(t));
    if (Math.random() < CFG.FREE_CHANCE){
      const r = rec(t); if (r.benched && r.benched.trap) unbench(t, "safe");
      trapStop(t, 0);
      emote("🤝 "+xLine("rescued", t, v), t);
      R("🤝 Got 'em out. "+plainName(t)+" owes you one.");
    } else {
      emote("🤝 "+xLine("rescueFail", t, v), t);
      R("It wouldn't give, sugar."+(isSubject(sender) ? " And now it's noticed you." : ""));
      if (isSubject(sender) && !trapBreathing(sender) && Math.random() < 0.5) later(() => { const why = springTrap(sender, "random", "", true); if (!why){ rec(sender).trapAt = Date.now(); saveLedger(); } }, 4000);
    }
  }

  // ── the hunt ──
  const HUNT_GOALS = /^(pasture|barn|trough|summon|staff|milking|stocks|breedingstand|bench|nest|pen)/;
  function huntCommand(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase();
    if (a0 === "start"){
      if (!isProprietor(sender)){ R("Startin' a hunt is for the proprietors, sugar."); return; }
      if (huntOn()){ R("There's a hunt on already, sugar. ?hunt stop ends it."); return; }
      const goals = Object.keys(L.spots || {}).filter(n => n === "hunt-goal" || HUNT_GOALS.test(n));
      const goal = (L.spots || {})["hunt-goal"] ? "hunt-goal" : goals[Math.floor(Math.random()*goals.length)];
      if (!goal){ R("I need somewhere to finish, sugar: ?spot set hunt-goal (or a pasture, barn or trough spot)."); return; }
      const mins = Math.max(5, Math.min(60, parseInt(args[1], 10) || CFG.HUNT_MIN));
      L.hunt = { id: Date.now(), until: Date.now() + mins*60000, goal, by: sender, done: [] };
      for (const r of Object.values(L.people)) if (isSubject(r.mn)){ r.trapAt = 0; r.spotTrapAt = {}; }
      saveLedger(); audit(sender, "HUNT", goal+" "+mins+"m");
      announce("🔔 THE HUNT IS ON! Every trap on the farm's been reset. Everybody with traps on: get yourselves to "+goal+" inside "+mins+" minutes and there's "+CFG.HUNT_RIBBONS+" ribbons in it. Whatever catches you on the way, catches you.");
      R("🔔 Hunt started: finish at "+goal+", "+mins+" minutes."); return;
    }
    if (a0 === "stop"){
      if (!isProprietor(sender)){ R("Only the proprietors can call a hunt off, sugar."); return; }
      if (!huntOn()){ R("There's no hunt on, sugar."); return; }
      huntEnd(); R("🔔 Hunt called off."); return;
    }
    R(huntOn() ? "🔔 The hunt's on for "+Math.ceil((L.hunt.until - Date.now())/60000)+" more minutes. Finish: "+L.hunt.goal+". Made it so far: "+(L.hunt.done.length ? L.hunt.done.map(plainName).join(", ") : "nobody")+"."
               : "🔔 No hunt right now."+(isProprietor(sender) ? " ?hunt start [minutes] rings the bell." : ""));
  }
  function huntEnd(){
    const h = L.hunt; if (!h) return;
    L.hunt = null; saveLedger();
    announce("🔔 The hunt's over. "+(h.done.length ? "Made it through: "+h.done.map(plainName).join(", ")+"." : "Not one subject made it to the finish. The traps had a fine day."));
  }
  function huntTick(now){
    const h = L.hunt; if (!h) return;
    if (h.until <= now){ huntEnd(); return; }
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber;
      if (!isSubject(mn) || h.done.includes(mn) || heldByTrap(mn) || !onSpot(mn, h.goal, 1)) continue;
      h.done.push(mn); saveLedger();
      emote("🏁 "+xLine("finish", mn, { x: String(h.done.length) }), mn);
      earnRibbons(mn, CFG.HUNT_RIBBONS + (h.done.length === 1 ? 1 : 0), h.done.length === 1 ? "first home in the hunt" : "finishin' the hunt");
    }
  }

  // ── the roamin' pack ──
  const PACK_AVOID = /^(safe|rescue|summon|staff|speaker|glory|milking|bench|pen|stocks|trap|nest|crate|hunt)/;
  function packOn(){ return L.packOn !== false && trapSpots().some(([n]) => /^trap-wolves/.test(n)); }
  function packTick(now){
    if (!packOn()) return;
    const subjectsHere = (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(isSubject);
    if (!L.pack || now - L.pack.at > CFG.PACK_MOVE_MIN*60000){
      const spots = Object.keys(L.spots || {}).filter(n => !PACK_AVOID.test(n) && !WATER_SPOT.test(n));
      if (!spots.length) return;
      L.pack = { spot: spots[Math.floor(Math.random()*spots.length)], at: now }; saveLedger();
      for (const mn of subjectsHere) if (!trapWhyNot(mn, "wolves") || heldByTrap(mn)) tell(mn, "🐺 "+xLine("packHeard", mn, { c: L.pack.spot.replace(/-?\d+$/, "") }));
    }
    for (const mn of subjectsHere){
      const r = rec(mn);
      if (!onSpot(mn, L.pack.spot, 0) || trapBreathing(mn) || now - (r.packAt || 0) < 30*60000) continue;   // (on its tile, not near it: Oct 24)
      if (!springTrap(mn, "wolves", L.pack.spot)){ r.trapAt = now; r.packAt = now; saveLedger(); }
    }
  }

  // ── the crate ──
  function crateTick(now){
    const crates = Object.keys(L.spots || {}).filter(n => n === "crate" || /^crate-[a-z0-9]+$/.test(n));
    if (!crates.length) return;
    L.crateAt = L.crateAt || {};
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber; if (!isSubject(mn) || heldByTrap(mn)) continue;
      const r = rec(mn); if (r.trapsOff || (r.trapQuiet || 0) > now) continue;
      const c = crates.find(n => onSpot(mn, n, 0)); if (!c || now - (L.crateAt[c] || 0) < CFG.CRATE_RESET_MIN*60000) continue;
      L.crateAt[c] = now; saveLedger();
      const roll = Math.random() / dangerX(mn).chance;   // a Danger Draught: likelier to bite
      if (roll < 0.27){ const n = 1 + Math.floor(Math.random()*2); emote("📦 "+xLine("crateGood", mn), mn); earnRibbons(mn, n, "what was in the crate"); }
      else if (roll < 0.43){
        const can = POTIONS.filter(P => !potionRefusal(mn, P.id, mn)), P = can[Math.floor(Math.random()*can.length)];
        emote("📦 "+xLine("cratePotion", mn), mn); if (P) later(() => givePotion(mn, P.id, CFG.BOT_MEMBER, "from the crate"), 2500);
      } else {
        emote("📦 "+xLine("crateBad", mn), mn);
        later(() => { if (!springTrap(mn, "random", c)){ r.trapAt = Date.now(); saveLedger(); } }, 3000);
      }
    }
  }

  // ── the nest ──
  function nestSpots(){ return Object.keys(L.spots || {}).filter(n => n === "nest" || /^nest-[a-z0-9]+$/.test(n)); }
  function eggsLaid(mn, n, atNest, types){
    bump1(subjWeek().eggs, mn, n);
    openedUp(mn);   // wide open for an hour (10y7-udders.js)
    try { albumAdd(mn, "🥚", "A clutch laid", n+" eggs pushed out"+(atNest ? " into the nest" : ", right where you stood")+"."+(eggTypesText(types) ? " "+eggTypesText(types)+"." : "")); } catch(e){}   // a keepsake (10y6-keepers.js)
    if (!atNest) return;
    L.nest = L.nest || { eggs: 0, by: {} };
    L.nest.eggs += n; bump1(L.nest.by, mn, n);   // (kept for the gatherin')
    // what kinds, per layer (they sell for different prices: 10y4-corruption.js)
    L.nest.types = L.nest.types || {}; const mine = L.nest.types[mn] = L.nest.types[mn] || {};
    const tt = types && Object.keys(types).length ? types : { stud: n };
    for (const [t, k] of Object.entries(tt)) mine[t] = (mine[t] || 0) + k;
  }
  function nestCommand(cmd, sender, args, R){
    if (cmd === "lay"){
      const p = prodOf(sender);
      if (!p || !p.eggs){ R("You're not carryin' a clutch, sugar."); return; }
      const nest = nestSpots().find(n => onSpot(sender, n, 1));
      if (!nest){ R(nestSpots().length ? "Get yourself onto the nest first, sugar. They'll come on their own when they're due, wherever you are." : "There's no nest set up yet, sugar. They'll come on their own when they're due."); return; }
      if (Date.now() - p.eggs.since < CFG.NEST_MIN_H*3600000){ R("They've not been in you an hour yet, sugar. Let 'em settle."); return; }
      if (state.sceneRuns && state.sceneRuns.has(sender)){ R("They're already comin', sugar. Keep pushin'."); return; }
      if (CFG.LAY_SCENE){ layScene(sender, nest); R("🥚 Here they come, sugar. Bear down."); return; }   // the long way (10y2-brood.js)
      const e = p.eggs; p.eggs = null;
      p.offspring.eggs = (p.offspring.eggs || 0) + e.n;
      if (!L.studbook) L.studbook = [];
      L.studbook.push({ t: Date.now(), dam: sender, sires: [e.by], kids: { male: 0, female: 0, futa: 0 }, eggs: e.n });
      eggsLaid(sender, e.n, true, e.types);
      if (e.para) L.nestBrood = (L.nestBrood || 0) + 1;   // one of the parasite's own: it'll hatch here
      saveLedger(); audit(sender, "EGGS", sender+" "+e.n+" at the nest");
      emote("🥚 "+xLine(e.n >= 12 ? "layBig" : "lay", sender, { x: String(e.n), c: plainName(e.by) }), sender);
      face(sender, "afterglow", 120); syncCompanions(true);
      R("🥚 "+e.n+" eggs in the nest, sugar. Staff'll gather them, and there's ribbons in it for you when they do."); return;
    }
    // ?gather
    if (!isStaff(sender)){ R("Gatherin' eggs is a job for staff, sugar."); return; }
    const n = L.nest && L.nest.eggs;
    if (!n){ R("The nest's empty, sugar."); return; }
    if (!nestSpots().some(s => onSpot(sender, s, 2))){ R("Come over to the nest to gather, sugar."); return; }
    const by = L.nest.by, types = L.nest.types || {}; L.nest = { eggs: 0, by: {} }; saveLedger(); audit(sender, "GATHER", String(n));
    for (const [m, k] of Object.entries(by)) leaderShare(parseInt(m, 10), earnRibbons(parseInt(m, 10), Math.min(CFG.GATHER_MAX_RIBBONS, eggsWorth(types[m], k)), "eggs sold at market"+(eggTypesText(types[m]) ? " ("+eggTypesText(types[m])+")" : "")));   // a herd leader takes a share (10y6-keepers.js)
    earnRibbons(sender, 1, "gatherin' the eggs");
    emote("🧺 "+xLine("gather", sender, { x: String(n) }), sender);
    R("🧺 "+n+" eggs gathered and off to market. The layers have been paid: "+Object.entries(by).map(([m, k]) => plainName(parseInt(m, 10))+" ("+k+")").join(", ")+".");
  }

  // ── everything that ticks ──
  function trapExtrasTick(){
    const now = Date.now();
    try { huntTick(now); packTick(now); crateTick(now); smellTick(now); baitTick(now); } catch(e){ warn("trap extras:", e); }
  }
  function baitTick(now){
    if (!L.trapBait || !Object.keys(L.trapBait).length) return;
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber; if (!isSubject(mn)) continue;
      const r = rec(mn); if (now - (r.baitTold || 0) < 10*60000) continue;
      if (Object.keys(L.trapBait).some(s => onSpot(mn, s, 3) && !onSpot(mn, s, 0))){ r.baitTold = now; privateLine(mn, tFill(pickFor(mn, "trapx:bait", EXTRA_LINES.bait), mn), "emote"); }
    }
  }
  function trapCardFor(mn){
    const r = rec(mn); if (!isSubject(mn)) return null;
    const k = r.trapKinds || {}, all = Object.keys(TRAP_KINDS).filter(x => k[x] || !SEASON_OF[x] || seasonOnFor(x));   // (out of season, the ones they haven't found yet don't count: 10y9m)
    return { total: r.trapN || 0, kinds: all.filter(x => k[x]).map(x => ({ kind: x, icon: TRAP_KINDS[x].icon, n: k[x] })), left: all.filter(x => !k[x]).length,
             eggs: (prodOf(mn).offspring || {}).eggs || 0, paused: !!r.trapsOff, eager: !!r.trapEager, danger: dangerX(mn).on, corr: corruptionOf(mn), under: underOf(mn), rank: SUBJECT_RANKS[rankOfSubject(mn)].name, nextRank: (SUBJECT_RANKS[rankOfSubject(mn) + 1] || {}).at || 0, hunt: huntOn() ? { until: L.hunt.until, goal: L.hunt.goal } : null };
  }
  function subjBoardLine(){
    const w = subjWeek(), top = (o, unit) => { const e = Object.entries(o).sort((a, b) => b[1] - a[1])[0]; return e ? plainName(parseInt(e[0], 10))+" ("+e[1]+" "+unit+")" : null; };
    const t = top(w.traps, "traps"), e = top(w.eggs, "eggs"), f = top(w.fur, "loads"), hb = top(w.hatched || {}, "hatched");
    return t || e || f || hb ? "\n\n🧪 Test subject of the week: "+(t || "nobody yet")+(e ? "\n🥚 Best layer: "+e : "")+(f ? "\n🐺 Most bred by things with fur: "+f : "")+(hb ? "\n🐣 Broodiest: "+hb : "") : "";
  }

  function extrasCommand(cmd, sender, args, R){
    if (cmd === "struggle") return struggle(sender, R);
    if (cmd === "free" || cmd === "goad") return byTrapCommand(cmd, sender, args, R);
    if (cmd === "hunt") return huntCommand(sender, args, R);
    if (cmd === "lay" || cmd === "gather") return nestCommand(cmd, sender, args, R);
    if (cmd === "pack"){
      const a0 = String(args[0] || "").toLowerCase();
      if (a0 === "on" || a0 === "off"){
        if (!isProprietor(sender)){ R("The pack answers to the proprietors, sugar."); return; }
        L.packOn = a0 === "on"; if (!L.packOn) L.pack = null; saveLedger();
        R(L.packOn ? "🐺 The pack's loose. It moves every hour, and it needs a trap-wolves den somewhere on the farm." : "🐺 The pack's kennelled. They'll stay in their den."); return;
      }
      R(!packOn() ? "🐺 No pack roamin', sugar."+(isProprietor(sender) ? " It needs a trap-wolves spot, and ?pack on." : "")
        : isStaff(sender) && L.pack ? "🐺 The pack's at "+L.pack.spot+" right now. ?pack off kennels them."
        : "🐺 The pack's out there somewhere. "+(L.pack ? "Last heard near "+L.pack.spot.replace(/-?\d+$/, "")+"." : "Nobody's heard them yet today."));
    }
  }

  const EXTRA_LINES = {
    free: ["%n twists, heaves, and somethin' gives: a strap, a pin, a rope. They tumble out of the trap and scramble clear before it can grab again.",
           "A wriggle, a yank, a bit of skin left behind, and %n is out of it. The trap snaps shut on empty air.",
           "%n finds the catch with their toes and kicks it. Everything springs open at once. They don't wait to see if it resets."],
    tighten: ["%n thrashes, and the trap answers by takin' up the slack. Every strap draws a notch tighter.",
              "Strugglin' only wakes it up. Somethin' ratchets, and %n is held twice as fast as before.",
              "%n pulls. The trap pulls back, harder, and settles in to keep them a good while longer."],
    goad: ["%c steps up beside the trap and gives it a hand: holdin' %n open for it, turnin' the crank a little faster.",
           "%c doesn't help %n out. %c helps the trap, pressin' %n down into it and whisperin' somethin' filthy in their ear.",
           "\"Oh, don't mind me.\" %c reaches in, tweaks, strokes, and leaves %n squirmin' twice as hard for whatever has them."],
    rescued: ["%c gets both hands on the catch and wrenches. The trap lets go of %n with a clang, and the pair of them stumble clear.",
              "%c hauls %n out by the arms while the trap snaps and grabs at their heels. Free.",
              "A boot on the lever, a shoulder under %n, and %c has them out of it before it knows what happened."],
    rescueFail: ["%c pulls and pries at the trap holdin' %n. It doesn't budge. If anything, it seems to settle.",
                 "%c tugs at %n. The trap tugs back. The trap wins.",
                 "%c tries the catch, the hinge, the straps. Whatever has %n has them good, and %c gets their fingers pinched for the trouble."],
    finish: ["%n staggers over the line, pantin': number %x home in the hunt, and still in one piece. Mostly.",
             "%n makes it to the finish! Number %x. Whatever they went through to get here, it shows.",
             "Here comes %n, weavin', flushed, and across the line: %x in the hunt."],
    packHeard: ["The pack was heard near the %c not long ago, sugar. Howlin', and close together.",
                "Somebody saw yellow eyes out by the %c. I'd walk wide of it. Or not.",
                "Wolf tracks, fresh, headin' for the %c. Thought you'd want to know."],
    bait: ["Somethin' glints in the straw a few steps off. Ribbons, maybe. Left out, just lyin' there.",
           "There's a little heap of somethin' bright up ahead, right where a careless animal might step.",
           "You catch a flash of ribbon out of the corner of your eye. It's sittin' somewhere it has no business bein'."],
    smell: ["You catch a whiff of %n before you see them: %c, and plenty of it.",
            "%n smells of %c. There's no polite way round it.",
            "Standin' this close to %n, all you can smell is %c.",
            "The breeze shifts and brings you %n: %c, ripe and unmistakable."],
    crateGood: ["%n pries the lid off the crate. Ribbons! Somebody's stash, and nobody's lookin'.",
                "The crate opens easy. Inside, on a bed of straw: a little roll of ribbons, tied with string."],
    cratePotion: ["%n lifts the lid, and a glass bottle rolls out, unstoppers itself, and breathes in their face.",
                  "Inside the crate there's one small bottle with no label. It's already open. %n has already sniffed it."],
    crateBad: ["%n lifts the lid. Somethin' inside lifts it the rest of the way.",
               "The crate was not empty and it was not ribbons. The lid flies back and it has %n by the wrist.",
               "Click. The crate was the trap."],
    lay: ["%n settles into the nest, spreads their knees and bears down. One by one, with a grunt for each, they push out %x slick warm eggs into the straw.",
          "%n squats over the nest, holdin' the rail, belly rollin'. The first egg crowns, stretches them wide, and drops. Then the rest: %x, all told.",
          "It takes %n a good while and a lot of moanin'. When they're done there are %x eggs steamin' in the nest, and they're emptied and shakin'."],
    layBig: ["%n crawls into the nest with a belly near draggin' and starts to lay. It goes on, and on, each egg stretchin' them fresh: %x of them, till the nest is heaped and they've collapsed beside it.",
             "%x eggs. %n lays them in the nest in one long, groanin', shudderin' rush, and somewhere past the tenth they stop bein' able to tell layin' from cummin'."],
    gather: ["%n goes round the nest with a basket and collects %x warm eggs, wipin' each one on their apron.",
             "%x eggs, counted into the basket by %n. They'll fetch a fair price at market."],
  };
