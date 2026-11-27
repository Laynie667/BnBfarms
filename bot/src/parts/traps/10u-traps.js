  /* WHAT'S IN THIS FILE (10u-traps.js)
     TEST SUBJECTS and the TRAPS only they can spring.
     • A proprietor signs a volunteer up: ?subject add <who>. It's a role that rides alongside whatever else they
       are. ?subject remove <who> takes it off, and the subject can walk away any time with ?subject quit.
     • TRAP SPOTS: stand somewhere and say ?spot set trap-<kind> (trap-injector, trap-milker-2…). A plain "trap"
       spot springs a different one every time. Nobody but a subject ever sets one off.
       ?traps lists the kinds. A subject can pause the lot (?traps off) or rule one kind out (?traps skip gas).
       ?trap load <spot> <words> fills an injector trap with the same words a crafted needle takes ("lactation x3").
       ?trap spring <who> <kind> lets a proprietor set one off by hand.
     • More traps with somebody waitin' in them (wolves, a stallion, a drake…) are in 10u3-anthro-traps.js.
     • THE THING IN THE WATER: a slim chance, every time a subject stands on a water spot (pond, pool, creek, water,
       well, bath…), that somethin' reaches up out of it. It always ends with a belly full of eggs.
     • TOYS THAT DO THINGS ON THEIR OWN (anybody on the books, read off the crafted words on what they wear):
       "auto-injector" doses the wearer every half hour with whatever else the item says ("auto-injector lactation x2"),
       "ovipositor" on a gag, belt, plug or dildo lays a clutch in them now and then (?eggs on, or a subject),
       "auto-feed" on a funnel gag pours a bellyful down them every ten minutes,
       and a cock type, a knot or a size word on a dildo, machine or belt makes it that cock in the farm's lines.
     • ?watersports on|off: piss play. Off until they say so; the spray trap and the feeder only use it when it's on.
     • Hard limits rule traps out the same as everywhere, and the SAFEWORD stops a trap mid-scene, opens whatever's
       holdin' them and keeps every trap quiet for an hour.
  */
  const BOTMN = () => CFG.BOT_MEMBER;
  const TENTACLE_SIRE = -2, TOY_SIRE = -3, FRAME_SIRE = -4, POST_SIRE = -5;
  function thingName(mn){
    return mn === -2 ? "the thing in the water" : mn === -3 ? "the toy buried in them" : mn === -4 ? "the breedin' frame" : mn === -5 ? "the egg post" : mn === -6 ? "the vine patch" : mn === -7 ? "the parasite" : mn <= -10 ? anthroSireName(mn) : null;
  }
  // TRAPS ARE OPT-IN (Laynie, Oct 20: "remove the subject role and make traps purely a opt-in with a toggle for everyone"):
  // anybody on the books says ?traps on (or flips Traps in the Companion's Toggles), and the traps spring for them; ?traps
  // off and they never do. The old test-subject role turns into the switch, on, the first time it's looked at.
  function isSubject(mn){
    const r = rec(mn); if (!r) return false;
    if (Array.isArray(r.roles) && r.roles.includes(ROLE.SUBJECT)){ r.roles = r.roles.filter(x => x !== ROLE.SUBJECT); if (r.trapsOn === undefined) r.trapsOn = !r.trapsOff; r.trapsOff = false; }
    return !!r.trapsOn || kryptoNow(mn);   // a proprietor down to stock by their kryptonite (10ur-shots-more.js)
  }
  const TRAP_KINDS = {
    injector: { icon: "💉", what: "a needle on a spring arm: a dose of whatever it's loaded with", limit: null },
    milker:   { icon: "🥛", what: "cups snap on and you're held till you're drained dry", limit: /\bmilk|lactat/i },
    breeder:  { icon: "🐎", what: "a frame folds you over and a machine cock breeds you", limit: /\b(breed|pregnan|impregnat|cum|creampie|seed)/i },
    gas:      { icon: "💨", what: "a puff of pink mist and you're in heat for an hour", limit: /\b(heat|arous|gas)/i },
    snare:    { icon: "🪢", what: "a rope round the ankle: held where you stand and teased", limit: /\b(snare|rope|immobil)/i },
    mud:      { icon: "🐖", what: "the ground gives way and you're in the wallow, filthy to the ears", limit: /\b(mud|humiliat|filth)/i },
    spray:    { icon: "💦", what: "nozzles hose you down with warm seed, or worse if you said ?watersports on", limit: /\b(cum|spray|bukkake)/i },
    wire:     { icon: "✂️", what: "a wire whips your clothes off and leaves you bare", limit: /\b(strip|nud|naked|expos)/i },
    clamp:    { icon: "🚫", what: "a clamp shuts over you: no cummin' for half an hour, and it keeps you right on the edge", limit: /\b(denial|chast|orgasm|edg)/i },
    pump:     { icon: "🎈", what: "a hose finds a hole and pumps your belly round and tight", limit: /\b(inflat|enema|pump|belly)/i },
    eggs:     { icon: "🥚", what: "a post rises up under you and lays a clutch in you", limit: /\b(eggs?|ovipos|clutch)/i },
    lantern:  { icon: "🏮", what: "a swingin' light you can't look away from, and a head full of fog", limit: /\b(hypno|trance|mind)/i },
    tentacle: { icon: "🐙", what: "the thing in the water. It always leaves eggs", limit: /\b(tentacle|eggs?|ovipos|clutch|monster)/i },
  };
  const WATER_SPOT = /^(water|pond|pool|creek|river|lake|well|bath|shower|spring|swim|stream|marsh|bog)/;
  function trapKindOf(name){
    const m = String(name || "").match(/^trap(?:-([a-z]+))?(?:-[a-z0-9]+)?$/);
    if (!m) return null;
    return m[1] && TRAP_KINDS[m[1]] ? m[1] : "random";
  }
  function trapSpots(){ return Object.entries(L.spots || {}).filter(([n]) => trapKindOf(n)); }
  function waterSpots(){ return Object.entries(L.spots || {}).filter(([n]) => (WATER_SPOT.test(n) || /^trough/.test(n)) && !trapKindOf(n)); }   // (a trough has leeches: 10y2-brood.js)
  // the breather between traps (Laynie, Oct 24: "Eager off didn't seem to apply the cool down either"): every trap that
  // finds them on its own (water, the pack, a raid, a scent, a botched rescue) waits it out, not only the tiles. It counts
  // from when the last trap let go of them. Eager, a hunt and the gauntlet skip it, as before.
  function trapBreathing(mn){
    const r = rec(mn); if (!r || r.trapEager || huntOn() || onGauntlet(mn)) return false;
    return Date.now() - (r.trapAt || 0) < breatherMs(mn);
  }
  // how long the breather is for them: a Trap Magnet shortens it, and so does a Danger Draught (Nov 20, Laynie: "danger
  // draught doesn't seem to work on the trigger chances the way it should": its bottle says every chancy thing is half
  // again as likely to get you, so the traps come round again in two thirds the time)
  function breatherMs(mn){ return CFG.TRAP_COOLDOWN_MIN*60000/perkTrapX(mn)/dangerX(mn).chance; }
  // can this trap spring on them right now? null = yes
  function trapWhyNot(mn, kind){
    const r = rec(mn), K = TRAP_KINDS[kind];
    if (!r || !K) return "no such trap";
    if (SEASON_OF[kind] && !state.trapByHand && !seasonOnFor(kind)) return "it's not the season for that one";   // (10y9m-seasons.js)
    if (!isSubject(mn)) return "they haven't switched traps on (?traps on)";
    if (r.trapsOff) return "they've paused the traps";
    if ((r.trapSkip || []).includes(kind)) return "they've ruled that one out";
    { const th = trapThemeOff(mn, kind); if (th) return "they've switched off "+th; }   // a whole kind of trap, off (10y9q-trap-switches.js)
    if ((r.trapQuiet || 0) > Date.now()) return "they called their safeword not long ago";
    if (quietNow(mn)) return "they've asked for quiet";
    const lim = String(r.limits || "");
    if (/\btraps?\b/i.test(lim) || (K.limit && K.limit.test(lim))) return "their limits rule it out";
    if (kind === "eggs" && limitBlocks(mn, "eggs")) return "their limits rule it out";
    if ((kind === "breeder" || kind === "pump") && limitBlocks(mn, "breed")) return "their limits rule it out";
    if (kind === "gas" && limitBlocks(mn, "heat")) return "their limits rule it out";
    if (kind === "milker" && !makesMilk(mn) && !makesSemen(mn)) return "nothin' to milk";
    if (ANTHRO[kind] && limitBlocks(mn, "breed")) return "their limits rule it out";
    if (TRAP_NEEDS[kind]){ const w = TRAP_NEEDS[kind](mn); if (w) return w; }
    if (r.trapWait) return "a trap already has them";
    { const fb = farmBusy(mn); if (fb) return fb; }   // (the farm has them just now: one thing at a time, Nov 24, 10h-body.js)
    if (ANTHRO[kind] && !ANTHRO[kind].person && /\b(anthro|furr|beast)/i.test(lim)) return "their limits rule it out";   // (the farm girl's a person: 10y9l)
    if (benchedNow(mn) || stockedNow(mn) || r.penned || (prodOf(mn) && prodOf(mn).stall)) return "they're held somewhere already";
    if (state.trapRuns && state.trapRuns.has(mn)) return "a trap already has them";
    return null;
  }
  // a nudge to their own arousal meter, if their Companion lets the farm do that (Toggles → "Farm can stir me up")
  function arouse(mn, add, cap){ if (hasCompanion(mn)) enqueue(makeMsg("arouse", { add: add || 0, cap: cap || 100 }, mn)); }

  // held where they stand for a while (the corral's own leash walks them back if they wander)
  function trapHold(mn, mins, label){
    const r = rec(mn), pos = posOf(mn);
    if (!r || !pos) return;
    r.penned = { until: Date.now() + tmin(mn, mins)*60000, X: pos.X, Y: pos.Y, name: label, by: BOTMN(), trap: true };   // (a Danger Draught: twice as long)
    saveLedger();
  }
  function trapFree(mn){ const r = rec(mn); if (r && r.penned && r.penned.trap && !r.penned.wait){ r.penned = null; saveLedger(); } }   // (the rack and the box keep hold: 10u4)

  // a load they couldn't hold any more of: "0 mL of stallion seed" read like nothin' happened (Laynie, Oct 20: "make sure
  // they all make sense"). Under 15 mL kept, the words say how much there was, not the number.
  const tinyMl = (v) => { const n = parseFloat(String((v && v.ml) || "").replace(/[^0-9.]/g, "")); return v && v.ml !== undefined && v.ml !== "" && Number.isFinite(n) && n < 15; };
  const mlWords = (t, v) => !tinyMl(v) ? t : t.replace(/(drained|milked)( down)? (of|by) %ml/g, "$1$2 of every last drop").replace(/%ml (fuller|heavier)/g, "a whole lot $1")
    .replace(/%ml of /g, "a flood of ").replace(/with %ml\b/g, "with a flood").replace(/%ml/g, "more than they could hold");
  // (and a capital to start it, whatever went in first: "a flood of feed, and the chute…" when the amount was put into words, Nov 20)
  const tFill = (t, mn, v) => bodyWords(mn, mlWords(t, v)).replace(/%n/g, plainName(mn)).replace(/%ml/g, (v && v.ml) || "").replace(/%c/g, (v && v.c) || "").replace(/%h/g, (v && v.h) || "").replace(/%x/g, (v && v.x) || "")
    .replace(/^(\s*["“]?)([a-z])/, (m, a, b) => a + b.toUpperCase());
  // a trap's story, a beat at a time, then what it leaves behind
  // opts.scene: this one's own two extra beats instead of the kind's (a stud's version: 10y9r2; [] for a variant, its own story)
  // opts.depth: a variant's own kinds of woven-in beat. opts.intro: its story only leads into a hold that goes on after (the
  // tickle rack, the mirror box), so what's woven in comes after its own last beat, while it's at them (Nov 20: "the brushes
  // start to explore" came after Moo had laughed herself hoarse)
  const INTRO_END = "~the hold goes on~";
  function trapRun(mn, kind, beats, done, v, opts){
    state.trapRuns = state.trapRuns || new Map();
    if (opts && opts.intro) beats = beats.concat([[INTRO_END]]);   // (a last beat that isn't one: everything's woven in before it, then it goes)
    beats = moreBeats(kind, beats);         // each beat with more of its own lines (10z5-trap-more.js and the batches after it)
    if (W.__FARMHAND_TEST__ && W.__onTrapBeats) try { W.__onTrapBeats(mn, kind, beats.filter(b => !(Array.isArray(b) && b[0] === INTRO_END)), opts); } catch(e){}   // (tests: the trap's own beats, as they'll run)
    beats = sceneBeats(kind, beats, opts && opts.scene);        // the trap's own two extra beats: one early, one before its last (10ue-trap-scenes.js)
    // its own lines picked now, one per beat, so who's in its story is what this telling of it actually says (Nov 20: a
    // pool where one line in ten had a farmhand made every telling "have people", and somebody came out of nowhere)
    beats = beats.map((b, i) => { const pool = Array.isArray(b) ? b : [b]; let t = null; try { t = pickFor(mn, "trap:"+kind+":"+(i + 1), pool); } catch(e){} return t ? [t] : pool; });
    const cast = trapCast(beats);           // who's in it: a partner in them? folk about? (10ud-trap-depth.js)
    beats = deepenBeats(mn, kind, beats, cast, opts && opts.depth);   // two or three more beats in the middle, from what kind of trap it is (10ud-trap-depth.js)
    beats = stateBeats(mn, kind, beats, cast, opts && opts.depth);    // and one about the state they're in: carryin', full, in heat, what they wear, their kind (10z4-trap-state.js)
    const stateKeys = (beats && beats.stateKeys) || new Set();       // (the states a beat's been about: a tail won't say the same again)
    beats = nipBeats(mn, kind, beats, v);   // open nipples: knotted, laid in, pumped, fucked (10z7-nipple-traps.js)
    if (opts && opts.intro) beats = beats.filter(b => !(Array.isArray(b) && b[0] === INTRO_END));
    const run = { kind, i: 0, timer: null, beats: (beats = beats.slice()), tails: new Set() };   // (a copy: ?struggle can add to it)
    const before = { pissed: (rec(mn) || {}).pissed || 0, eggs: ((prodOf(mn) || {}).eggs || {}).n || 0, held: heldNow(mn), milk: (prodOf(mn) || {}).milk || 0, heat: inHeat(prodOf(mn)), t: Date.now() };
    try { offerBets(mn, kind); } catch(e){ warn("bets:", e); }   // watchers get a flutter (10y3-trap-ranks.js)
    // it never lets go before its story's told
    { const r0 = rec(mn); if (r0 && r0.penned && r0.penned.trap) r0.penned.until = Math.max(r0.penned.until, Date.now() + (beats.length + 1)*CFG.TRAP_BEAT_S*1000); }
    const gearPlan = trapGearStart(mn, kind);   // real gear, for those who let the farm put it on them (10y-farm-gear.js)
    state.trapRuns.set(mn, run);
    const step = () => {
      if (state.trapRuns.get(mn) !== run) return;
      if (run.i < beats.length && charFor(mn)){
        const b = beats[run.i++];
        // (one more sentence on the end, now and then; never the same one twice in a scene, and not till the trap's two
        // fifths in: a stallion's "he's against the back of their womb" came the beat before he was in them, Nov 20)
        const late = run.i > Math.max(2, Math.floor(beats.length * 0.4));
        let tail = !late ? "" : intensityTail(mn, run.i, beats.length, kind) || bodyTail(mn, kind, run.i) || stateTail(mn, kind, run.i, stateKeys);
        if (tail && run.tails.has(tail.trim())) tail = ""; else if (tail) run.tails.add(tail.trim());
        const raw = pickFor(mn, "trap:"+kind+":"+run.i, Array.isArray(b) ? b : [b]);
        emote(TRAP_KINDS[kind].icon+" "+tFill(raw, mn, v)+tail+trapStripLine(mn, kind, raw, run), mn);   // (and the clothes the line takes off them: 10z9-trap-strip.js)
        toysBeat(mn, run.i, beats.length);   // any buzzin' toy they're wearin' follows the scene (10y6-keepers.js)
        run.timer = setTimeout(step, CFG.TRAP_BEAT_S*1000);
        return;
      }
      state.trapRuns.delete(mn);
      { const re = rec(mn); if (re){ re.trapAt = Date.now(); saveLedger(); } }   // the breather starts when it lets go
      if (charFor(mn)){ try { done(); trapDone(mn, kind, before); } catch(e){ warn("trap "+kind+":", e); } }
      try { trapGearDone(mn, charFor(mn) ? (gearPlan || []) : null); } catch(e){ warn("trap gear:", e); }   // (still here, with no gear of its own: [], so a wild trap can leave its cuffs)
      try { if (charFor(mn)) keepersAfter(mn, kind, before); toysAfter(mn); } catch(e){ warn("keepsake:", e); }
      try { if (charFor(mn) && TRAP_SOUND_END[kind]) sound(mn, TRAP_SOUND_END[kind]); } catch(e){}   // ...and when it lets go   // the album card; toys go still or back how they were (10y6-keepers.js)
      try { if (charFor(mn)) trapAfter(mn, kind, before); } catch(e){ warn("trap after:", e); }
      try { if (charFor(mn)) symbioteAfterTrap(mn, kind); } catch(e){ warn("trap symbiote:", e); }
      try { if (charFor(mn)) trapMess(mn, kind); } catch(e){ warn("trap mess:", e); }
      try { if (charFor(mn)) trapEnded(mn, kind, before); } catch(e){ warn("trap ended:", e); }   // how was it, the trap of the day, how they're left (10y9o, 10y9p)   // the mess its equipment leaves (10u7-traps-3.js)   // somethin' waitin' in it (10v4-symbiotes.js)   // ranks, bets, bein' handed on (10y3-trap-ranks.js)   // (what they're left wearin': 10x-trap-extras.js)
      trapFree(mn);
      try { if (charFor(mn)) nipTrapAfter(mn, kind); } catch(e){ warn("nipple trap:", e); }   // what it did to their nipples, after it frees them: a knot holds on (10z7-nipple-traps.js)
      wildDone(mn);   // (a wild trap's done hittin' harder: 10z8-wild-traps.js)
      saveLedger(); syncCompanions(true);
    };
    step();
  }
  // the safeword (and ?subject quit): whatever's got them lets go, and every trap stays quiet for an hour
  function trapStop(mn, quietMin){
    const run = state.trapRuns && state.trapRuns.get(mn);
    if (run){ clearTimeout(run.timer); state.trapRuns.delete(mn); toysFollow(mn, null); }
    if (state.nipPlan) state.nipPlan.delete(mn);   // (a safeword: nothin' more happens to their nipples)
    sitStop(mn, "safe");        // up off the nest (10y6-keepers.js)
    if (quietMin == null) uddersSafe(mn);   // up out of the farrowin' stall (10y7-udders.js)
    trapWaitEnd(mn, "quiet");   // the tickle rack, the mirror box (10u4-more-traps.js)
    sceneStop(mn);              // a layin' or a birth scene (10y2-brood.js)
    gearOff(mn, null, "hold"); if (quietMin == null){ gearOff(mn, null, "trap"); gearOff(mn, null, "wild"); buildLetGo(mn); }   // (a safeword takes off what a wild trap left too, and a progressive set: 10z9b-gear-build.js)
    wildDone(mn);
    if (quietMin == null){ const r1 = rec(mn); if (r1){ r1.run = null; } if (state.lend && state.lend.mn === mn) state.lend = null; cursedOff(mn, "safe"); }   // a safeword ends a gauntlet run, a loan, a curse and the suit   // what it had on them comes off (all of it, on a safeword)
    { const r0 = rec(mn); if (r0 && r0.benched && r0.benched.trap) unbench(mn, "safe"); }   // the pillory
    trapFree(mn);
    const r = rec(mn); if (r && isSubject(mn)){ r.trapQuiet = Date.now() + (quietMin == null ? 60 : quietMin)*60000; saveLedger(); }
    return !!run;
  }

  // the milker's end, when they came to it milked out already and there was next to nothin' to take
  const MILKER_DRY = [
    "The can's barely wet. %n was milked out already, and the cups suck on empty teats to the end of the cycle anyway, just to be sure, till %n's sobbin' at every pull.",
    "A few thin drops rattle into the can and that's all there is. The machine sulks, gives each sore nipple one last long tug for luck, and lets %n go.",
    "Nothin' left in %n to give, and the cups keep pullin' at what isn't there till their nipples are swollen fat and stingin', then pop off with a wet smack.",
    "{t}%n's tits are milked soft and empty, nipples drawn out long and tender, and the gauge never moved. The trap drops them in the straw, achin' for nothin'.",
    "{c}It drags at %n's cock long after they've nothin' left, sleeve slurpin', till they're cryin' and drippin' thin and clear, and only then does it let them go."];
  // ── what each trap does ────────────────────────────────────
  const INJECTOR_LOADS =["lactation", "virility", "fertility", "heat inducer", "egg laying", "hyper pregnancy", "udder growth", "ass growth", "lactation x2", "fertility x2"];
  function openHole(mn, want){
    const order = (want ? [want] : []).concat(["vulva", "butt", "mouth"]);
    return order.find(h => (h !== "vulva" || hasVulva(mn)) && !holeBlocked(mn, h)) || null;
  }
  const TRAP_HOLE = { vulva: "pussy", butt: "ass", mouth: "throat" };
  // pour somethin' into a hole: what fits stays, the rest runs out. Returns what stayed.
  function trapFill(mn, hole, amount, over){
    amount *= holeX(mn, hole) * (wildOn(mn) ? CFG.WILD.FILL_X : 1);   // a trained hole is given more (10y6-keepers.js); a wild trap gives half again (10z8)
    // the body steers it (Oct 24): a roomy one is given more, a tight one less but stretched by it, and one already
    // past full is flooded out first, then filled again
    try {
      const p0 = prodOf(mn), cap = capacity(mn), base = CFG.PROD.BASE_CAPACITY || cap;
      amount *= Math.max(0.75, Math.min(1.5, cap / base));
      if (heldTotal(p0) >= cap * 0.95 && (p0.held[hole] || 0) > 0){
        const out0 = Math.round(p0.held[hole] * 0.6); p0.held[hole] -= out0;
        later(() => emote("💦 "+tFill(pickFor(mn, "trap:flood", SIZE_TRAP_LINES.flood), mn, { ml: ml(out0) }), mn), 1500);
        bodyMark(mn, { splat: ["thighs"] });
      }
      if (cap <= base * 1.1 && Math.random() < 0.15){ p0.capBonus = (p0.capBonus || 0) + Math.round(base * 0.1); later(() => tell(mn, "🫦 "+tFill(pickFor(mn, "trap:stretch", SIZE_TRAP_LINES.stretch), mn)), 3000); }   // (a body with no room to spare: it stretches)
    } catch(e){ warn("size fill:", e); }
    const p = prodOf(mn), room = Math.max(0, capacity(mn)*(over || 1) - heldTotal(p)), kept = Math.min(amount, room);
    p.held[hole] = (p.held[hole] || 0) + kept; p.totals.received += kept;
    try { holeTook(mn, hole, kept); } catch(e){ warn("holes:", e); }
    if (hole === "mouth" && kept >= CFG.HUNGRY_ML){ p.boosts = p.boosts || {}; p.boosts.hungry = Date.now() + 3600000; }
    return kept;
  }
  const SIZE_TRAP_LINES = {
    flood: ["%n was already stuffed past full, so the first thing it does is flood them out: %ml of the last one gushes down their thighs before it starts fillin' them all over again.",
            "There's no room left in %n, so it makes some. A hot rush of what they were holdin' pours out of them, %ml of it, and then it pushes back in.",
            "%n's too full to take more, and it doesn't care. It squeezes %ml of the old load out of them in a slick flood, then sets to fillin' the space."],
    stretch: ["That was more than you were built to hold, sugar, and you held it. You've stretched a little roomier, and you'll stay that way.",
              "Tight as you are, it fit, and it left you a little bigger inside than you were. You'll hold more next time."],
  };
  // a clutch laid in them by somethin' that isn't a stud. Adds to one they're already carryin'.
  // how much bigger a clutch comes in for this body: fertility (a shot or gas, by level; a worn fertility item), bein' in heat,
  // and most of all Tentacle Musk
  function eggX(mn){
    const p = prodOf(mn); let x = 1;
    x *= 1 + 0.5*boostLevel(p, "fert");
    if (wornTags(mn).has("fertility")) x *= 1.5;
    if (inHeat(p)) x *= 1.25;
    x *= 1 + 2*potionX(mn, "tentaclemusk");
    x *= rankX(mn).eggs;   // a higher-ranked subject carries more (10y3-trap-ranks.js)
    x *= perkEggX(mn);     // Prolific Layer (10us-feats.js)
    return x;
  }
  // clutches STACK: every encounter adds to what they're already carryin', up to CFG.EGG_MAX
  function layClutch(mn, n, by){
    const p = prodOf(mn), [dl, dh] = CFG.EGG_DAYS;
    n = Math.max(1, Math.min(CFG.EGG_MAX, Math.round(n * eggX(mn))));
    if (p.eggs) p.eggs.n = Math.min(CFG.EGG_MAX, p.eggs.n + n);
    else p.eggs = { n, by, since: Date.now(), layAt: Date.now() + (dl + Math.random()*(dh - dl))*86400000*perkEggDaysX(mn) };
    eggTypesNote(p, n, by);   // what laid them (10y4-corruption.js)
    try { bredBack(mn); } catch(e){ warn("bred back:", e); }   // filled again inside the hour (10y7-udders.js)
    saveLedger(); audit(BOTMN(), "CLUTCH", mn+" "+n+" by "+by);
    return p.eggs.n;
  }
  // hyper: a worn item, a shot, a tonic, or just bad luck in the water
  function hyperEggs(mn, luck){ const p = prodOf(mn); return wornTags(mn).has("hyper") || boosted(p, "hyper") || Math.random() < (luck || 0); }

  function springTrap(mn, kind, spot, force){
    try { shotTrigger(mn, "trap"); } catch(e){ warn("trap trigger:", e); }   // an injector that answers a trap (10ur-shots-more.js)
    let drewBy = "";
    if (kind === "random"){
      // a tile in a place springs that place's traps (10ua-trap-themes.js); nothin' fits there, or no place: any trap
      // in season, about a third of the time it's from the season's own pack instead (10y9m-seasons.js)
      const sp = spot ? seasonPick(mn, spot) : null;
      const placed = sp ? sp.kinds : spot ? themePool(mn, spot) : [];
      const can = placed.length ? placed : Object.keys(TRAP_KINDS).filter(k => k !== "tentacle" && !SEASON_OF[k] && !trapWhyNot(mn, k));
      if (!can.length) return "nothin' they can spring right now";
      const pk = trapWeighted(mn, can);   // the moment makes some likelier: full udders, heat, the hour, a crowd (10ua2-trap-weights.js)
      kind = pk.kind; drewBy = (sp && sp.why) || pk.why;
    }
    const why = trapWhyNot(mn, kind);
    if (why) return why;
    const r = rec(mn), p = prodOf(mn), T = TRAP_LINES[kind], v = {};
    r.trapLog = (r.trapLog || []).concat(Object.assign({ t: Date.now(), kind, spot: spot || "" }, state.trapByHand ? { hand: 1 } : {})).slice(-20);
    r.trapN = (r.trapN || 0) + 1;
    try { perkTrapPay(mn); } catch(e){ warn("trap magnet:", e); }   // (10us-feats.js)
    trapSprung(mn, kind, spot);   // tallies, the trap card, bait (10x-trap-extras.js)
    audit(BOTMN(), "TRAP", mn+" "+kind+(spot ? " at "+spot : "")+(force ? " (by hand)" : ""));
    tell(mn, TRAP_KINDS[kind].icon+" "+(drewBy ? drewBy+" " : "")+"You've sprung a trap, sugar: "+TRAP_KINDS[kind].what+". Your safeword stops it cold.");
    face(mn, kind === "lantern" ? "trance" : "edged", 60);
    { const snd = TRAP_SOUND[kind] || (L.customTraps && L.customTraps[kind] && CUSTOM_SOUND[L.customTraps[kind].does]); if (snd) sound(mn, snd); }   // what it sounds like when it gets you (10y9c-sounds.js)
    // gas, spray and the needle come in kinds and strengths (10z-trap-variants.js)
    if (variantTrap(mn, kind, spot)){ saveLedger(); syncCompanions(true); return null; }
    switch (kind){
      case "injector": {
        const loaded = L.trapLoads && spot && L.trapLoads[spot];
        const pool = INJECTOR_LOADS.filter(t => (!/lactation|udder/.test(t) || makesMilk(mn)) && (!/virility/.test(t) || makesSemen(mn)) && (!/heat/.test(t) || !limitBlocks(mn, "heat")) &&
                                                (!/egg/.test(t) || !limitBlocks(mn, "eggs")) && (!/fertil|hyper/.test(t) || !limitBlocks(mn, "breed")));
        const text = loaded || pool[Math.floor(Math.random()*pool.length)] || "ass growth";
        trapHold(mn, 2, "the injector post");
        trapRun(mn, kind, T.beats, () => {
          const ok = applyShot(mn, BOTMN(), text, { open: tFill(pickFor(mn, "trap:inj:open", T.open), mn), from: "the trap's dose", heatH: 1 });
          if (!ok) emote("💉 "+tFill(T.dud, mn), mn);
          arouse(mn, 15);
        });
        break;
      }
      case "milker": {
        trapHold(mn, 4, "the milker");
        const m0 = makesMilk(mn) ? p.milk : 0, s0 = seedMilkable(mn) ? p.semen : 0;
        trapRun(mn, kind, (m0 >= s0 ? T.milk : T.seed).concat(T.both), () => {
          const gotM = m0 > 0 ? drainMilk(mn, p.milk) : 0, gotS = s0 > 0 ? drainSemen(mn, p.semen) : 0;
          // (next to nothin' in the can: they came to it milked out, and its end says so, Nov 20)
          if (gotM + gotS < 15) emote("🥛 "+tFill(pickFor(mn, "trap:milker:dry", MILKER_DRY), mn), mn);
          else emote("🥛 "+tFill(pickFor(mn, "trap:milker:end", T.end), mn, { ml: ml(gotM + gotS) }), mn);
          face(mn, "milked", 60); arouse(mn, 25);
        });
        break;
      }
      case "breeder": {
        const types = Object.keys(CFG.PENIS_TYPES).filter(t => t !== "double" && t !== "human"), type = types[Math.floor(Math.random()*types.length)];
        const inside = !!r.breedable, hole = inside ? openHole(mn, "vulva") : null;
        v.c = CFG.PENIS_TYPES[type].label; v.h = hole ? TRAP_HOLE[hole] : "";
        const load = Math.round((180 + Math.random()*220) * (CFG.PENIS_TYPES[type].loadX || 1));
        trapHold(mn, 4, "the breedin' frame");
        trapRun(mn, kind, T.beats.concat(hole ? T.in : T.over), () => {
          v.ml = ml(load);
          if (hole){
            const kept = trapFill(mn, hole, load);
            tally(mn);
            let took = null;
            if (hole !== "mouth" && r.fertile && canCatchIn(mn, hole)) took = rollConception(mn, FRAME_SIRE, kept, CFG.PENIS_TYPES[type].knot ? 1.5 : 1.2, hole);
            emote("🐎 "+tFill(pickFor(mn, "trap:breeder:end", T.end), mn, v)+(took === "new" ? " "+tFill(T.took, mn, v) : ""), mn);
            splatBody(mn, hole); face(mn, "bred", 90);
          } else {
            emote("🐎 "+tFill(pickFor(mn, "trap:breeder:endover", T.endOver), mn, v), mn);
            splatBody(mn, "back"); splatBody(mn, "ass");
          }
          arouse(mn, 30);
        }, v);
        break;
      }
      case "gas": {
        trapRun(mn, kind, T.beats, () => { startHeat(mn, BOTMN(), 1); arouse(mn, 40); });
        break;
      }
      case "snare": {
        trapHold(mn, 5, "the snare");
        trapRun(mn, kind, T.beats, () => { arouse(mn, 35, 92); emote("🪢 "+tFill(pickFor(mn, "trap:snare:end", T.end), mn), mn); });
        break;
      }
      case "mud": {
        trapRun(mn, kind, T.beats, () => {
          bodyMark(mn, { splat: ["face", "chest", "tummy"], color: "#6b4a2b" });
          r.muddy = Date.now(); r.naughtyMarks = r.naughtyMarks || 0;
        });
        break;
      }
      case "spray": {
        const piss = !!r.watersports && Math.random() < 0.5;
        trapHold(mn, 2, "the spray rack");
        trapRun(mn, kind, piss ? T.piss : T.beats, () => {
          bodyMark(mn, piss ? { splat: ["face", "chest", "tummy"], color: CFG.PISS_COLOR } : { splat: ["face", "chest", "tummy", "forehead"] });
          if (piss) r.pissed = (r.pissed || 0) + 1;
          arouse(mn, 15);
        });
        break;
      }
      case "wire": {
        trapRun(mn, kind, T.beats, () => { if (!bodyMark(mn, { strip: true })) tell(mn, "✂️ With the Companion and \"Farm can strip me\" on, that wire would have had every stitch off you, sugar."); arouse(mn, 10); });
        break;
      }
      case "clamp": {
        trapRun(mn, kind, T.beats, () => {
          p.deniedUntil = Math.max(p.deniedUntil || 0, Date.now() + tmin(mn, CFG.TRAP_DENY_MIN)*60000);
          arouse(mn, 60, 94); face(mn, "edged", 120);
          tell(mn, "🚫 Clamped: no cummin' for "+tmin(mn, CFG.TRAP_DENY_MIN)+" minutes, sugar, and it'll hold you right at the edge the whole time.");
        });
        break;
      }
      case "pump": {
        const hole = openHole(mn, "butt");
        if (!hole){ trapRun(mn, kind, T.none, () => {}); break; }
        v.h = TRAP_HOLE[hole];
        trapHold(mn, 3, "the pump");
        trapRun(mn, kind, T.beats, () => {
          const kept = trapFill(mn, hole, capacity(mn)*1.4, CFG.TRAP_OVERFULL);
          v.ml = ml(kept);
          emote("🎈 "+tFill(pickFor(mn, "trap:pump:end", T.end), mn, v), mn);
          arouse(mn, 20);
        }, v);
        break;
      }
      case "eggs": {
        const hole = openHole(mn, "vulva");
        if (!hole || hole === "mouth"){ trapRun(mn, kind, T.none, () => {}); break; }
        v.h = TRAP_HOLE[hole];
        trapHold(mn, 3, "the egg post");
        trapRun(mn, kind, T.beats, () => {
          const [lo, hi] = CFG.EGG_COUNT, hyper = hyperEggs(mn, 0.1);
          const n = layClutch(mn, (lo + Math.floor(Math.random()*(hi - lo + 1))) * (hyper ? 3 : 1), POST_SIRE);
          v.x = String(n);
          emote("🥚 "+tFill(pickFor(mn, "trap:eggs:end", hyper ? T.endHyper : T.end), mn, v), mn);
          arouse(mn, 25);
        }, v);
        break;
      }
      case "lantern": {
        trance(mn, 2);
        trapHold(mn, 3, "the lantern");
        trapRun(mn, kind, T.beats, () => {
          trance(mn, 0); arouse(mn, 30); goUnder(mn, 2);
          if (rec(mn) && rec(mn).hypno) later(() => { try { echsAsk(mn, CFG.BOT_MEMBER, "lantern"); } catch(e){} }, 8000);   // and the lantern reaches for their ECHS (10uj-echs.js)
          tell(mn, "🏮 "+tFill(pickFor(mn, "trap:lantern:thought", T.thought), mn));
        });
        break;
      }
      case "tentacle": tentacleScene(mn, spot); break;
      default: if (MORE_TRAPS[kind]) MORE_TRAPS[kind](mn, spot);   // 10u4-more-traps.js and on (a trap with its own way of runnin' comes first: the corn maze)
               else if (ANTHRO[kind]) anthroScene(mn, kind, spot);   // somebody's waitin' in this one (10u3-anthro-traps.js)
    }
    saveLedger(); syncCompanions(true);
    return null;
  }

  // the thing in the water: five scenes, and it always leaves eggs. It isn't always the same thing in there: the jelly
  // bloom, the eel-knot, the mother, the hungry one, the singin' one… each with lines and a way of its own (10y9r-water-beast.js)
  function tentacleScene(mn, spot, deep){   // deep: the thing in the well (it keeps them longer, and lays more)
    const r = rec(mn), p = prodOf(mn), T = TRAP_LINES.tentacle, v = {};
    const F = deep ? Object.assign({ id: "well" }, WATER_FORMS.classic) : waterForm(mn), FL = F.lines || {}, own = (k) => FL[k] || T[k];
    const lower = openHole(mn, "vulva"), back = !holeBlocked(mn, "butt") && lower !== "butt" ? "butt" : null, mouth = !holeBlocked(mn, "mouth");
    v.h = lower && lower !== "mouth" ? TRAP_HOLE[lower] : "belly";
    const kin = parasiteOn(mn);   // it knows its own: a gentler comin', and double the clutch
    const beats = (kin ? [PARASITE_MORE.kin] : []).concat(deep ? [BROOD_LINES.wellGrab, BROOD_LINES.wellDeep] : [own("grab")], [T.strip, lower && lower !== "mouth" ? own("take") : T.takeShut, back ? T.second : T.wrap, mouth ? T.mouth : T.muzzle], FL.sig ? [FL.sig] : [], T.churn ? [T.churn] : [], [own("swell")]);   // (churn: 10w2-trap-lines-deeper.js)
    trapHold(mn, deep ? 10 : F.hold || 6, deep ? "the well" : "the water");
    try { if (F.start) F.start(mn, v); } catch(e){ warn("water form:", e); }
    trapRun(mn, "tentacle", beats, () => {
      const [lo, hi] = CFG.EGG_COUNT, hyper = hyperEggs(mn, CFG.TENTACLE_HYPER_CHANCE * (F.hyperX || 1));
      const n = layClutch(mn, (lo + 2 + Math.floor(Math.random()*(hi - lo + 1))) * (hyper ? 3 + Math.floor(Math.random()*2) : 1) * (kin ? 2 : 1) * (deep ? 1.5 : 1) * (F.eggsX || 1), TENTACLE_SIRE);
      v.x = String(n);
      const fx = F.fillX || 1;
      if (lower && lower !== "mouth") trapFill(mn, lower, (250 + Math.random()*250)*fx, CFG.TRAP_OVERFULL);
      if (back) trapFill(mn, "butt", (150 + Math.random()*200)*fx, CFG.TRAP_OVERFULL);
      if (mouth) trapFill(mn, "mouth", 120, CFG.TRAP_OVERFULL);
      tally(mn);
      emote("🥚 "+tFill(pickFor(mn, "trap:tentacle:end:"+F.id, hyper ? own("endHyper") : own("end")), mn, v), mn);
      let more = "";
      try { more = (F.after && F.after(mn, v, n)) || ""; } catch(e){ warn("water form:", e); }
      const who = F.id === "classic" || F.id === "well" ? "It" : F.name.charAt(0).toUpperCase() + F.name.slice(1);
      tell(mn, "🥚 "+who+(hyper ? " packed you till you couldn't hold another one: " : " left ")+n+" eggs in your "+v.h+", sugar. You'll be layin' in a few days, and you'll be slow on your feet till then."+
        [more, F.tell].filter(Boolean).map(x => " "+x).join(""));
      if (!F.noSplat) bodyMark(mn, { splat: ["tummy", "chest", "face"] });
      if (F.mess) trapMess(mn, "tentacle", null, F.mess);
      face(mn, "afterglow", 180); arouse(mn, 50);
      r.tentacled = (r.tentacled || 0) + 1;
      if (!deep){ r.waterForms = r.waterForms || {}; r.waterForms[F.id] = (r.waterForms[F.id] || 0) + 1; }
    }, v);
  }

  // ── who's standin' on what: every heartbeat, and the moment they move ────────────────
  // how long a trap tile takes to reset for them (half as long after dark; a Danger Draught, a rank, a Trap Magnet: sooner)
  function trapResetMs(mn){ return CFG.TRAP_RESET_MIN*60000*nightX().reset/dangerX(mn).chance/rankX(mn).reset/perkTrapX(mn); }
  // one subject, right now: on a trap tile or in the water? (one visit is one roll: state.trapAt holds the spot they're on)
  function trapCheck(mn, now){
    if (mn === BOTMN() || !isSubject(mn)) return;
    if (farmBusy(mn)) return;   // (walked by the farm, or under with the farm girl: the tiles they cross leave them be, Nov 24)
    state.trapAt = state.trapAt || new Map();
    const r = rec(mn);
    const on = trapSpots().find(([n]) => onSpot(mn, n, 0)), wet = !on && waterSpots().find(([n]) => onSpot(mn, n, 0));   // (water and troughs too: on the tile, not beside it, Oct 24)
    const wild = !on && !wet ? wildHere(mn) : null;   // one of the farm girl's own, that moves about (10z8-wild-traps.js)
    const here = on ? on[0] : wet ? wet[0] : wild ? "wild:"+wild.id : null, was = state.trapAt.get(mn);
    if (!here){ state.trapAt.delete(mn); return; }
    const fresh = !was || was.spot !== here;
    if (fresh) state.trapAt.set(mn, { spot: here, at: now });
    if (wild && wildFor(mn)){ if (fresh) wildSpring(mn, wild, now); return; }   // (no breather for a wild one: it has its own minute's grace)
    // haven't said yes to the wild ones (Nov 20, off till they do): it's an ordinary farm trap for them, that place's
    // traps, with the breather and the reset like any set tile, and nothin' kept on them
    if (wild){
      if (!fresh || (!huntOn() && !r.trapEager && !onGauntlet(mn) && now - (r.trapAt || 0) < breatherMs(mn))) return;
      r.spotTrapAt = r.spotTrapAt || {};
      if (!r.trapEager && !onGauntlet(mn) && now - (r.spotTrapAt[here] || 0) < trapResetMs(mn)) return;
      const Z = CFG.WILD.ZONES[wild.g];
      if (!springTrap(mn, "random", Z ? "trap-theme-"+Z.theme : "")){ r.trapAt = now; r.spotTrapAt[here] = now; saveLedger(); }
      return;
    }
    if (!huntOn() && !r.trapEager && !onGauntlet(mn) && now - (r.trapAt || 0) < breatherMs(mn)) return;    // one trap at a time, with a breather between (not durin' a hunt)
    if (on){
      if (!fresh) return;                                                               // step off and back on to spring it again
      r.spotTrapAt = r.spotTrapAt || {};
      if (!r.trapEager && !onGauntlet(mn) && now - (r.spotTrapAt[here] || 0) < trapResetMs(mn)) return;   // each trap takes a while to reset
      const kind = trapKindOf(here);
      if (kind !== "random" && rateLetsBy(mn, kind)){ r.spotTrapAt[here] = now; saveLedger(); return; }   // one they said isn't for them lets them by now and then (10y9o-trap-ratings.js)
      if (!springTrap(mn, kind, here)){ r.trapAt = now; r.spotTrapAt[here] = now; saveLedger(); }
    } else {
      // water: a slim chance when they wade in, and again every few minutes they linger
      const st = state.trapAt.get(mn);
      if (!fresh && now - (st.rolled || 0) < CFG.TENTACLE_LINGER_MIN*60000/(potionOn(mn, "tentaclemusk") ? 5 : 1)) return;   // (with Tentacle Musk on, it looks again every minute)
      st.rolled = now;
      const wk = waterKindOf(here);   // tentacles, leeches, the well, or slime (10y2-brood.js)
      if (((wk === "tentacle" && parasiteKin(mn, now)) || Math.random() < waterOdds(mn, wk)) && !springTrap(mn, wk, here)){ r.trapAt = now; saveLedger(); }   // (three times as hungry after dark)
    }
  }
  // the water's odds for them, each time it looks
  function waterOdds(mn, wk){ return Math.min(1, CFG.TENTACLE_CHANCE*perkTrapX(mn)*nightX().water*dangerX(mn).chance*rankX(mn).water*(corrHas(mn, 10) ? 1.25 : 1)*(potionOn(mn, "tentaclemusk") ? CFG.MUSK_WATER_X : 1)*waterDayX(mn, wk)); }
  // ?trap why (Nov 20, Laynie: traps "not triggering like they should"): what's holdin' the traps back for somebody. A trap
  // that doesn't spring says nothin', so a breather, a reset or a limit looked like a broken trap. The tiles stay hidden:
  // a player hears about traps in general, and only about tiles that have already had them. Staff, askin' about somebody,
  // are told the tile they're stood on too.
  function trapWhyText(mn, asker){   // (you: somebody else is askin' about them, so it's "them" and "they")
    const r = rec(mn), now = Date.now(), you = mn !== asker, nm = plainName(mn);
    const own = (t) => you ? String(t) : String(t).replace(/\bthey've\b/g, "you've").replace(/\btheir\b/g, "your").replace(/\bthey\b/g, "you").replace(/\bthem\b/g, "you");
    const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms/1000)); return Math.floor(s/60)+":"+String(s%60).padStart(2, "0"); };
    const head = "🧪 What's holdin' the traps back for "+(you ? nm : "you, sugar")+":";
    if (!r) return head+"\n• Not on the farm's books.";
    if (!isSubject(mn)) return head+"\n• Traps are off"+(you ? " for them." : ": ?traps on and they spring for you.");
    const L1 = [];
    const dg = dangerX(mn);
    L1.push("• Traps: on"+(r.trapEager ? ", eager (no breather, no waitin' for a trap to reset)" : "")+(dg.on ? ". A Danger Draught's in "+(you ? "them" : "you")+": every chancy trap's half again as likely, and the traps come round sooner" : "")+".");
    L1.push(!r.wildIn ? "• 🕳️ Wild traps: off for "+(you ? "them" : "you")+". The farm's movin' tiles spring an ordinary trap, with the breather and the reset. ?traps wild says what the wild ones do." :
      "• 🕳️ Wild traps: on. The farm hides its own and moves them about: no warnin', no breather, a minute after the last one's all the grace there is"+(r.wildLimbs ? "; they can take "+(you ? "their" : "your")+" limbs" : "")+(r.wildLaced ? "; their kits come laced" : "")+".");
    if (r.trapsOff) L1.push("• ⏸️ Paused: "+(you ? "they've" : "you've")+" paused the traps.");
    if ((r.trapQuiet || 0) > now) L1.push("• 🛑 A safeword not long ago: nothin' springs for "+mmss(r.trapQuiet - now)+" yet.");
    if (quietNow(mn)) L1.push("• 🤫 "+own("They've asked for quiet")+": nothin' springs till that's over.");
    if (heldByTrap(mn) || r.trapWait || (state.trapRuns && state.trapRuns.has(mn))) L1.push("• 🪤 A trap has "+(you ? "them" : "you")+" right now.");
    else if (benchedNow(mn) || stockedNow(mn) || r.penned || (prodOf(mn) && prodOf(mn).stall)) L1.push("• 🔒 "+(you ? "They're" : "You're")+" held somewhere already: traps wait till "+(you ? "they're" : "you're")+" loose.");
    const brLeft = (huntOn() || r.trapEager || onGauntlet(mn)) ? 0 : breatherMs(mn) - (now - (r.trapAt || 0));
    L1.push(brLeft > 0 ? "• ⏳ Breather: "+mmss(brLeft)+" left before any trap can have "+(you ? "them" : "you")+" again." : "• ⏳ No breather: a trap can have "+(you ? "them" : "you")+" right now.");
    // tiles that have had them, still resettin' (no names: the tiles are hidden)
    if (!r.trapEager && !onGauntlet(mn)){
      const left = trapSpots().map(([n]) => trapResetMs(mn) - (now - ((r.spotTrapAt || {})[n] || 0))).filter(x => x > 0).sort((a, b) => a - b);
      if (left.length) L1.push("• 🔁 "+left.length+" trap"+(left.length === 1 ? "" : "s")+" that had "+(you ? "them" : "you")+" lately won't take "+(you ? "them" : "you")+" again yet: "+(left.length === 1 ? "it's ready in " : "the soonest in ")+mmss(left[0])+(left.length > 1 ? ", the last in "+mmss(left[left.length - 1]) : "")+".");
    }
    L1.push("• 👣 A trap "+(you ? "they're" : "you're")+" already stood on waits for "+(you ? "them" : "you")+" to step off and back on.");
    // kinds ruled out, and why (the lasting reasons only: the season, and bein' held, are said above or don't matter here)
    const groups = new Map();
    for (const k of Object.keys(TRAP_KINDS)){
      let why; try { why = trapWhyNot(mn, k); } catch(e){ why = null; }
      if (!why || /season|already has them|held somewhere|safeword|asked for quiet|paused|switched traps on/.test(why)) continue;
      const g = own(why); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(k);
    }
    if (groups.size) L1.push("• 🙅 Ruled out for "+(you ? "them" : "you")+": "+Array.from(groups.entries()).map(([g, ks]) => g.replace(/ rule it out$| rules it out$/, "")+": "+ks.slice(0, 8).join(", ")+(ks.length > 8 ? " and "+(ks.length - 8)+" more" : "")).join(" · ")+".");
    const notFor = Object.keys(TRAP_KINDS).filter(k => trapRateX(mn, k) < 1);
    if (notFor.length) L1.push("• 🎲 Ones "+(you ? "they" : "you")+" said aren't for "+(you ? "them" : "you")+" let "+(you ? "them" : "you")+" by now and then: "+notFor.map(k => k+" ("+rateOdds(Math.min(1, trapRateX(mn, k)*dg.chance))+")").join(", ")+".");
    if (waterSpots().length){ const w = waterOdds(mn, "tentacle"); L1.push("• 🌊 The water: "+(w >= 0.995 ? "certain" : Math.max(1, Math.round(w*100))+"%")+" each time "+(you ? "they wade" : "you wade")+" in, and again every "+Math.round(CFG.TENTACLE_LINGER_MIN/(potionOn(mn, "tentaclemusk") ? 5 : 1))+" min "+(you ? "they" : "you")+" stay."); }
    if (you){ const on = trapSpots().find(([n]) => onSpot(mn, n, 0)); if (on){ const left = trapResetMs(mn) - (now - ((r.spotTrapAt || {})[on[0]] || 0)); L1.push("• 📍 Stood on "+on[0]+" now"+(left > 0 && !r.trapEager ? ": it resets for them in "+mmss(left) : ": ready for them")+"."); } }
    return head+"\n"+L1.join("\n");
  }
  function trapTick(){
    const now = Date.now();
    try { wildTick(now); } catch(e){ warn("wild traps:", e); }   // the farm girl's own, placed and moved (10z8-wild-traps.js)
    for (const C of (W.ChatRoomCharacter || [])){ try { trapCheck(C.MemberNumber, now); } catch(e){ warn("trap check:", e); } }
    toyTick(); moreTrapTick(); newTrapTick(); mazeTick(); trapExtrasTick(); farmGearTick(Date.now()); broodTick(); corruptionTick(); cursedTick(); keepersTick(); uddersTick();
  }
  // THE MOMENT THEY MOVE (Nov 20, Laynie: "traps are not triggering like they should"). The heartbeat only looks every 20
  // seconds, so a trap only had you if you were stood on it at that moment: walk across one, or step on and off, and it
  // never knew. The game tells me every time somebody moves (16-listeners.js), and their trap tile, the water, the crate
  // and the roamin' pack are looked at then and there. (The game sends a walker's place about every half second, and
  // that's all I know of where they are: so every one is looked at, at once, and a trap on a tile they're seen crossin'
  // has them too.)
  function trapMoved(mn){
    if (!mn || mn === BOTMN() || state.dormant || !isSubject(mn) || !charFor(mn)) return;
    const now = Date.now();
    try { trapCheck(mn, now); } catch(e){ warn("trap on move:", e); }
    try { packTick(now); crateTick(now); } catch(e){ warn("trap extras on move:", e); }
  }

  // ── toys that do things on their own ───────────────────────
  const AUTO_INJECT = ["auto-injector", "autoinjector", "auto inject", "self-inject", "auto-dose", "auto doser"];
  const OVI_WORDS = ["ovipositor"];
  const FEED_WORDS = ["auto-feed", "autofeed", "auto feeder", "self-feed", "force-feed", "forcefeed"];
  // what comes down a feeder's tube, read off how it was crafted, so Barn Life gets fed or watered to match (Laynie, Nov 17).
  // First match wins: piss (only with ?watersports on) · cum · milk · water (on its own: water with oats in it is still feed) ·
  // slop (the farm's mash, and anything that doesn't say)
  function feedKind(text, r){
    const t = String(text || "").toLowerCase();
    if (r && r.watersports && /piss|golden|urin/.test(t)) return "piss";
    if (/\b(cum|semen|seed|spunk|jizz|protein)\b|stud cream/.test(t)) return "cum";
    if (/\b(milk|cream|formula)\b/.test(t)) return "milk";
    if (/\bwater\b/.test(t) && !/slop|mash|oat|gruel|porridge|kibble|grain|food|meal|chow|feed bag/.test(t)) return "water";
    return "slop";
  }
  const TOY_GROUPS = { ItemMouth: "mouth", ItemMouth2: "mouth", ItemMouth3: "mouth", ItemVulva: "vulva", ItemButt: "butt", ItemPelvis: "vulva", ItemDevices: "vulva", ItemVulvaPiercings: "vulva" };
  const hasWord = (text, words) => { const flat = squash(text); return words.some(w => flat.includes(squash(w))); };
  const itemName = it => String((it.Craft && it.Craft.Name) || (it.Asset && (it.Asset.Description || it.Asset.Name)) || "toy").replace(/[()]/g, "").slice(0, 40);
  // a dildo, machine or belt crafted as a cock: its type, a knot, and whether it's a big one
  function toyCock(text, asset){
    // only somethin' that's plainly a cock: a tail plug crafted "equine" or a belt that says "hyper pregnancy" isn't one
    if (!/dildo|cock|dick|phallus|shaft|penis|strap-?on|knotted/.test(text) && !/dildo|fuckmachine|sybian|strapon/i.test(asset || "")) return null;
    const pt = penisTagsIn(text), flat = squash(text);
    const type = pt.type || (flat.includes("knotted") || pt.knot > 0 ? "canine" : null);
    if (!type && !/hyper|huge|massive|horse|monster/.test(flat)) return null;
    return { type: type || "human", knot: pt.knot > 0 || flat.includes("knot") || !!(CFG.PENIS_TYPES[type] && CFG.PENIS_TYPES[type].knot), big: /hyper|huge|massive|monster|horse/.test(flat) };
  }
  function toyTick(){
    const now = Date.now();
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, r = rec(mn);
      if (mn === BOTMN() || !r || !r.roles || !r.roles.length || !Array.isArray(C.Appearance)) continue;
      if (((r.trapQuiet || 0) > now && isSubject(mn)) || quietNow(mn)) continue;
      const p = prodOf(mn); p.toyAt = p.toyAt || {};
      for (const it of C.Appearance){
        if (!it || !it.Craft || !it.Asset || !it.Asset.Group) continue;
        const g = it.Asset.Group.Name, text = craftText(it), key = g+":"+(it.Craft.Name || it.Asset.Name);
        if (!text || !/^Item/.test(g)) continue;
        const due = (k, mins) => { const t = p.toyAt[k+key]; if (!t){ p.toyAt[k+key] = now + mins*60000*(0.3 + Math.random()*0.4); return false; } if (now < t) return false; p.toyAt[k+key] = now + mins*60000*(0.8 + Math.random()*0.4); return true; };
        // an auto-injector: whatever else the item says, every half hour
        // a drip keeps it topped up instead; one with a trigger waits for its moment (10ur-shots-more.js)
        if (isDrip(text) && due("drip", CFG.SHOTS2.DRIP_MIN)) shotDrip(mn, it, text);
        else if (isInjector(text) && !isDrip(text) && !triggerOf(text).length && due("inj", CFG.AUTOINJECT_MIN)){
          const ok = applyShot(mn, BOTMN(), isRoulette(text) ? rouletteText(mn, text) : text, { auto: true, open: tFill(pickFor(mn, "toy:inj", TOY_LINES.inject), mn, { c: itemName(it) }), from: "your "+itemName(it)+"'s dose", heatH: 1 });
          if (ok) audit(BOTMN(), "AUTOINJECT", mn+" "+itemName(it));
        }
        // an ovipositor on a gag, a belt, a plug or a dildo
        if (TOY_GROUPS[g] && isOvi(text) && (r.eggs || isSubject(mn)) && !limitBlocks(mn, "eggs") && due("ovi", CFG.OVI_MIN)){
          const [lo, hi] = CFG.EGG_COUNT, hyper = tagsIn(text).has("hyper") || hyperEggs(mn, 0);
          const n0 = (lo + Math.floor(Math.random()*(hi - lo + 1))) * shotTimes(text) * (hyper ? 3 : 1);
          const n = layClutch(mn, n0, TOY_SIRE), hole = TOY_GROUPS[g];
          emote("🥚 "+tFill(pickFor(mn, "toy:ovi:"+hole, TOY_LINES.ovi[hole]), mn, { c: itemName(it), x: String(n0) }), mn);
          tell(mn, "🥚 Your "+itemName(it)+" just laid "+n0+" eggs in you, sugar. You're carryin' "+n+" now.");
          arouse(mn, 20);
        }
        // a funnel gag (or any gag) that feeds on its own
        if (TOY_GROUPS[g] === "mouth" && isFeeder(text) && due("feed", CFG.AUTOFEED_MIN)){
          const kind = feedKind(text, r), piss = kind === "piss";
          const kept = trapFill(mn, "mouth", CFG.AUTOFEED_ML * shotTimes(text), CFG.TRAP_OVERFULL);
          if (kept >= 1){
            if (!piss) p.milk = Math.min(milkCap(mn), p.milk + kept * CFG.PROD.SWALLOW_TO_MILK);
            const pool = { piss: TOY_LINES.feedPiss, cum: TOY_LINES.feedCum, milk: TOY_LINES.feedMilk, water: TOY_LINES.feedWater }[kind] || TOY_LINES.feed;
            emote("🍼 "+tFill(pickFor(mn, "toy:feed:"+kind, pool), mn, { c: itemName(it), ml: ml(kept) }), mn);
            if (typeof addonsEmit === "function") addonsEmit("fed", mn, kept, kind);   // Barn Life feeds or waters them by what it was
          } else if (now - (p.toyAt.fullTold || 0) > 30*60000){ p.toyAt.fullTold = now; tell(mn, "🍼 Your "+itemName(it)+" gurgles, but there's not room for another drop in you, sugar."); }
        }
        // a toy crafted as a cock: the farm talks about it like one
        if ((g === "ItemVulva" || g === "ItemButt" || g === "ItemPelvis" || g === "ItemDevices") && !isOvi(text) && !isInjector(text) && !isDrip(text)){
          const tc = toyCock(text, it.Asset.Name);
          if (tc && due("cock", CFG.TOYCOCK_MIN)){
            const where = g === "ItemButt" ? "ass" : g === "ItemDevices" ? (hasVulva(mn) ? "pussy" : "ass") : hasVulva(mn) ? "pussy" : "ass";
            emote("🍆 "+tFill(pickFor(mn, "toy:cock:"+(tc.knot ? "k" : tc.big ? "b" : "p"), tc.knot ? TOY_LINES.cockKnot : tc.big ? TOY_LINES.cockBig : TOY_LINES.cock), mn,
              { c: (tc.big ? "huge " : "")+CFG.PENIS_TYPES[tc.type].label, h: where }), mn);
            arouse(mn, tc.big ? 15 : 10);
            // a big one or a knot stretches them, a little at a time (the same trainin' a stretcher plug does)
            const part = where === "ass" ? "butt" : "vulva";
            if ((tc.big || tc.knot) && CFG.SIZES[part] && hasPart(mn, part)){
              p.toyStretch = (p.toyStretch || 0) + 1;
              if (p.toyStretch >= CFG.TOYCOCK_STRETCH_EVERY){ p.toyStretch = 0; setSize(mn, part, sizeOf(mn, part) + 1, false); }
            }
          }
        }
      }
    }
  }

  // how much slower somebody walks for what they're carryin' (1 = no slower). Their Companion does the slowin'.
  function slowOf(mn){
    const p = prodOf(mn); if (!p) return 1;
    const now = Date.now(); let s = 1;
    const full = heldTotal(p) / capacity(mn);
    if (full > 0.6) s += Math.min(1, (full - 0.6) * 1.5);                                   // a sloshin', over-full belly
    if (p.preg){ const frac = Math.max(0, Math.min(1, (now - p.preg.since) / Math.max(1, p.preg.due - p.preg.since))); s += frac * Math.min(1.2, 0.3 + 0.1*(p.preg.count || 1)); }
    if (p.preg2) s += 0.4;                                                                  // a second litter, in the other hole
    if (p.eggs) s += Math.min(1, 0.06 * p.eggs.n);                                          // a clutch
    if (makesMilk(mn) && p.milk >= milkCap(mn)*0.95) s += 0.2;                              // udders fit to burst
    const r = rec(mn); if (r && r.penned && !r.penned.trap) s += 0.3;                       // hobbled in the pen
    if (r && r.gluedUntil > now) s += 0.6;                                                  // glue or slime still on their feet
    if (boosted(p, "sedate") && !(dispFor(mn) && !dispFor(mn).lscg)) s += 0.8;             // a sedative in 'em (10ur-shots-more.js); their own Dispensary slows them itself (10ur2-dispensary.js)
    return Math.round(Math.min(CFG.SLOW_MAX, s) * 10) / 10;
  }

  // ── commands ───────────────────────────────────────────────
  // the traps by place, names only (there are over a hundred now: ?traps <name> says what one does)
  function trapsList(){
    const placed = new Set(), out = [];
    for (const T of Object.values(TRAP_THEMES)){ const ks = T.kinds.filter(k => TRAP_KINDS[k]); ks.forEach(k => placed.add(k)); if (ks.length) out.push(T.label+": "+ks.join(", ")); }
    const rest = Object.keys(TRAP_KINDS).filter(k => !placed.has(k) && !SEASON_OF[k] && !/^keep-|^custom/.test(k));
    if (rest.length) out.push("anywhere: "+rest.join(", "));
    { const sl = seasonsTrapList(); if (sl) out.push(sl); }   // (10y9m-seasons.js)
    return out.join("\n")+"\n?traps <name> says what one does.";
  }
  function trapAbout(k){
    const T = TRAP_KINDS[k], lim = T.limit ? String(T.limit.source).replace(/\\b|[()?^$]|\\s/g, "").split("|").filter(Boolean).join(", ") : "";
    return T.icon+" "+k+": "+T.what+"."+(lim ? " Limits that mention "+lim+" rule it out." : "");
  }
  function trapCommand(cmd, sender, args, R){
    const r = rec(sender), a0 = String(args[0] || "").toLowerCase();
    if (cmd === "watersports"){
      if (!r || !r.roles.length){ R("That's just for folks on the books, sugar."); return true; }
      if (!a0){ R(switchStatus("watersports", !!r.watersports)); return true; }
      if (!/^(on|off|yes|no)$/.test(a0)){ R("Just say ?watersports on or ?watersports off, sweetie."); return true; }
      const on = a0 === "on" || a0 === "yes";
      if (on && /\b(piss|watersport|urin|golden)/i.test(r.limits || "")){ R("Your hard limits rule that out, sugar, so I'll keep it off."); return true; }
      r.watersports = on; saveLedger(); audit(sender, "WATERSPORTS", on ? "on" : "off");
      R(on ? "💛 Watersports: ON. Piss play can find you now: the spray trap, a feeder that says so, and the scenes that have it. ?watersports off any time."
           : "💛 Watersports: off. Nobody and nothin' pisses on you or in you.");
      syncCompanions(true); return true;
    }
    if (cmd === "subject" || cmd === "subjects"){
      // (there's no subject list any more: traps are each player's own switch)
      if (isProprietor(sender) && (!a0 || a0 === "list")){
        const subs = Object.values(L.people).filter(x => isSubject(x.mn));
        R(subs.length ? "🧪 TRAPS SWITCHED ON\n"+subs.map(x => "• "+plainName(x.mn)+" ("+x.mn+")"+(charFor(x.mn) ? " ●" : "")+" · traps sprung: "+(x.trapN || 0)+(x.tentacled ? " · taken by the water: "+x.tentacled : "")).join("\n")
                      : "🧪 Nobody's got their traps switched on right now, sugar.");
        return true;
      }
      if (a0 === "quit" || a0 === "leave") return trapCommand("traps", sender, ["off"], R);
      R("🧪 There's no test subject list any more, sugar: the traps are everybody's own choice. ?traps on and they spring for you, ?traps off and they never do. It's in your Companion's Toggles too.");
      return true;
    }
    if (cmd === "traps" || cmd === "trap"){
      if (a0 === "themes" || a0 === "places"){ R(themesText()+(isSubject(sender) ? "\n\n"+trapThemeSummary(sender) : "")); return true; }
      if (a0 === "theme" || a0 === "kinds" || a0 === "kind"){ trapThemeCommand(sender, args.slice(1), R); return true; }   // whole kinds of trap on or off (10y9q-trap-switches.js)
      if (a0 === "ratings" || a0 === "rated" || a0 === "rates"){
        if (!isStaff(sender)){ R("The herd's ratings are for staff, sugar. ?rate shows your own."); return true; }
        R(trapRatingsText()); return true;   // (10y9o-trap-ratings.js)
      }
      if (a0 === "today" || a0 === "day"){ R(trapDayLine() || "🎯 No trap of the day yet: the farm hasn't any traps out."); return true; }
      if (a0 === "wild"){ wildCommand(sender, args, R); return true; }   // the farm girl's own traps, that move (10z8-wild-traps.js)
      if (a0 === "build"){ buildCommand(sender, args, R); return true; }   // progressive restraints (10z9b-gear-build.js)
      if (a0 === "where"){ R(isStaff(sender) ? wildWhereText() : "That's for staff, sugar. The traps are hidden, and the wild ones move."); return true; }
      if (a0 === "why"){   // what's holdin' the traps back (staff can ask about somebody else)
        const t = args[1] ? resolveTarget(args[1]) : sender;
        if (args[1] && !t){ R("Who, sugar? ?trap why, or (staff) ?trap why <who>."); return true; }
        if (t !== sender && !isStaff(sender)){ R("You can ask about your own traps, sugar: ?trap why."); return true; }
        R(trapWhyText(t, sender)); return true;
      }
      if (a0 && TRAP_KINDS[a0]){ R(trapAbout(a0)+(a0 === "tentacle" ? " "+waterFormsText(sender) : STUD_FORMS[a0] ? " "+studFormsText(sender, a0) : "")); return true; }   // ?traps bearskin: what that one does   // which traps each place springs (10ua-trap-themes.js)
      if (a0 === "on" || a0 === "off"){
        const was = isSubject(sender);
        r.trapsOn = a0 === "on"; r.trapsOff = false; if (!r.trapsOn){ trapStop(sender, 0); buildLetGo(sender); } r.trapQuiet = 0; saveLedger(); audit(sender, "TRAPS", a0); syncCompanions(true);
        R(r.trapsOn ? (was ? "🧪 Your traps are already on, sugar. Watch your step."
                           : "🧪 Traps: ON. Every trap on the farm will spring for you now, and the water's not safe either: step on the wrong spot and you might get dosed, drained, bred, stripped, pumped full or filled with eggs. "+
                             "?traps shows what's out there · ?traps skip <kind> rules one out · ?traps off and not one springs · your SAFEWORD stops a trap cold. Your hard limits still rule.")
                    : "🧪 Traps: off. Not one will spring for you till you say ?traps on."); return true;
      }
      if (a0 === "eager"){
        if (!isSubject(sender)){ R("Switch your traps on first (?traps on), sugar: then you've got traps to hurry up, sugar."); return true; }
        const v = String(args[1] || "").toLowerCase();
        if (v !== "on" && v !== "off"){ R("🧪 Eager is "+(r.trapEager ? "ON" : "off")+" for you, sugar: ?traps eager on skips the breather between traps and the wait for a trap to reset. Step off a trap and back on, and it has you again."); return true; }
        r.trapEager = v === "on"; saveLedger(); syncCompanions(true);
        R(r.trapEager ? "🧪 Eager: ON. No breather between traps, no waitin' for one to reset. Step off and back on and it springs again. ?traps eager off when you've had enough." : "🧪 Eager: off. The traps go back to takin' their time with you."); return true;
      }
      if (a0 === "skip" || a0 === "allow"){
        if (!isSubject(sender)){ R("Switch your traps on first (?traps on), sugar: then you've got traps to rule out, sugar."); return true; }
        const k = String(args[1] || "").toLowerCase();
        if (!TRAP_KINDS[k]){ R("Which one, sugar? ?traps "+a0+" <kind>: "+Object.keys(TRAP_KINDS).join(", ")+"."); return true; }
        r.trapSkip = (r.trapSkip || []).filter(x => x !== k); if (a0 === "skip") r.trapSkip.push(k); saveLedger();
        R(a0 === "skip" ? "🧪 The "+k+" trap won't spring for you any more. ?traps allow "+k+" brings it back." : "🧪 The "+k+" trap is back on for you."); return true;
      }
      if (a0 === "make" || a0 === "unmake" || a0 === "made") return customTrapCommand(a0, sender, args, R);   // home-built traps (10y6-keepers.js)
      if (a0 === "bait"){
        if (!isProprietor(sender) && !herdMembers(sender).some(x => isSubject(x.mn))){ R("Baitin' traps is for the proprietors, sugar, and for herd leaders with a subject in their herd."); return true; }
        const spot = String(args[1] || "").toLowerCase(), n = parseInt(args[2], 10);
        if (!L.spots || !L.spots[spot] || !trapKindOf(spot)){ R("Which trap, sugar? ?trap bait <spot> <ribbons>, like ?trap bait trap-wolves 3. ?trap bait <spot> 0 takes it back."); return true; }
        L.trapBait = L.trapBait || {};
        if (!(n > 0)){ delete L.trapBait[spot]; saveLedger(); R("🎀 Bait taken off "+spot+"."); return true; }
        L.trapBait[spot] = Math.min(10, n); saveLedger(); audit(sender, "TRAPBAIT", spot+" "+L.trapBait[spot]);
        R("🎀 "+spot+" is baited with "+L.trapBait[spot]+" ribbon"+(L.trapBait[spot] === 1 ? "" : "s")+". The next subject it catches gets paid for it."); return true;
      }
      if (a0 === "load"){
        if (!isProprietor(sender)){ R("Loadin' traps is just for the proprietors, sugar."); return true; }
        const spot = String(args[1] || "").toLowerCase(), words = args.slice(2).join(" ").trim();
        if (!L.spots || !L.spots[spot] || !trapKindOf(spot)){ R("Which trap, sugar? ?trap load <spot> <words>, like ?trap load trap-injector lactation x3. ?trap load <spot> empty goes back to pot luck."); return true; }
        L.trapLoads = L.trapLoads || {};
        if (!words || /^(empty|none|clear|random)$/i.test(words)){ delete L.trapLoads[spot]; saveLedger(); R("💉 "+spot+" is back to pot luck."); return true; }
        // gas, spray and needle traps take a kind and a strength: "musk brutal", "slime", "cocktail strong"
        { const vk = trapKindOf(spot), pl = VARIANTS[vk] ? parseTrapLoad(vk, words) : null;
          if (pl){ L.trapLoads[spot] = words.slice(0, 80).toLowerCase(); saveLedger(); audit(sender, "TRAPLOAD", spot+" "+words);
                   R("🧪 "+spot+" is set: "+(pl.variant || "any kind")+", "+(pl.sev ? SEVERITY[pl.sev].name : "any strength")+"."); return true; }
          if (vk === "gas" || vk === "spray"){ R("That trap takes a kind and a strength, sugar. Kinds: "+Object.keys(VARIANTS[vk]).join(", ")+". Strengths: mild, strong, brutal. Like ?trap load "+spot+" "+Object.keys(VARIANTS[vk])[2]+" strong."); return true; } }
        const tg = Array.from(tagsIn(words)).concat(sizeTagsIn(words).map(([k, d]) => k+(d > 0 ? " up" : " down")));
        if (!tg.length && !penisTagsIn(words).type && !penisTagsIn(words).knot){ R("I can't find a shot word in that, sugar. It takes the same words a crafted needle does: lactation, virility, fertility, heat inducer, egg laying, hyper pregnancy, mpreg, udder growth… and x2 to x5 on the end for a stronger dose."); return true; }
        L.trapLoads[spot] = words.slice(0, 80).toLowerCase(); saveLedger(); audit(sender, "TRAPLOAD", spot+" "+words);
        R("💉 "+spot+" is loaded: "+tg.join(", ")+(shotTimes(words) > 1 ? ", "+shotTimes(words)+" doses at once" : "")+"."); return true;
      }
      if (a0 === "spring"){
        customLoad();
        if (!isProprietor(sender)){ R("Springin' traps by hand is just for the proprietors, sugar."); return true; }
        const t = resolveTarget(args[1]), k = String(args[2] || "random").toLowerCase();
        if (!t || (k !== "random" && !TRAP_KINDS[k])){ R("?trap spring <who> <kind>, sugar. Kinds: "+Object.keys(TRAP_KINDS).join(", ")+". Leave the kind off for pot luck."); return true; }
        if (!charFor(t)){ R(plainName(t)+" isn't here, sugar."); return true; }
        state.trapByHand = true; let why;
        try { why = springTrap(t, k, "", true); } finally { state.trapByHand = false; }   // (a proprietor can spring the farm girl's own: 10y9l)
        if (!why){ const tr = rec(t); tr.trapAt = Date.now(); saveLedger(); }
        R(why ? "🧪 That trap won't spring on "+plainName(t)+": "+why+"." : "🧪 Sprung on "+plainName(t)+"."); return true;
      }
      const spots = trapSpots(), water = waterSpots();
      if (isStaff(sender))
        R("🧪 TRAPS (they spring for whoever has ?traps on, and nobody else)\n"+trapsList()+
          "\n\nSet one: stand on the spot and say ?spot set trap-<kind> (trap-milker-2 for a second one; plain ?spot set trap springs pot luck)."+
          "\nOut there now: "+(spots.length ? spots.map(([n]) => n+(L.trapLoads && L.trapLoads[n] ? " ["+L.trapLoads[n]+"]" : "")).join(", ") : "none yet")+
          "\nWater the thing lives in: "+(water.length ? water.map(([n]) => n).join(", ") : "none yet (?spot set pond, pool, creek, water, well, bath…)")+
          "\n?trap load <spot> <words> · ?trap bait <spot> <ribbons> · ?trap spring <who> <kind> · ?trap why <who> · ?subject for who has them on"+
          "\n?trap make <name> <what it does>… builds one of your own (?trap made) · ?whistle <which> <who> calls one of the farm's own to them"+
          "\n?hunt start [minutes] · ?pack on|off · nest spots (?spot set nest) and ?gather · crate spots (?spot set crate) · ?traps ratings"+
          (trapDayLine() ? "\n"+trapDayLine() : ""));
      else if (isSubject(sender))
        R("🧪 WHAT'S OUT THERE FOR YOU\n"+trapsList()+"\n\nThere are "+spots.length+" trap"+(spots.length === 1 ? "" : "s")+" hidden on the farm"+(water.length ? ", and somethin' lives in the water" : "")+". I'm not tellin' you where."+
          "\n?struggle when one has you (one try) · ?traps eager on skips the waits · ?traps off switches them off · ?traps skip <kind> rules one out"+((r.trapSkip || []).length ? " (you skip: "+r.trapSkip.join(", ")+")" : "")+
          " · ?traps theme <kind> off rules out a whole kind (furry, monsters, messy…)"+((r.trapThemesOff || []).length ? " (off: "+r.trapThemesOff.join(", ")+")" : "")+
          " · ?rate says how one was · ?trap why says what's holdin' them back · ?traps wild says what the farm's own wild ones do, off till you say so, not for the faint of heart · your safeword stops one cold."+(trapDayLine() ? "\n"+trapDayLine() : ""));
      else R("🧪 Your traps are off, sugar, so you can walk right over 'em. ?traps on and every trap on the farm springs for you (your limits and your safeword still rule). Here's what's out there:\n"+trapsList());
      return true;
    }
    return false;
  }

  // its commands, written in the command book (01b-commands.js); the big switch no longer lists them
  addCommand("traps trap subject subjects watersports watersport", { topic: "traps", run: (c) => trapCommand(c.cmd === "watersport" ? "watersports" : c.cmd, c.sender, c.args, c.R) });
  addCommand("eager",                    { topic: "traps", run: (c) => trapCommand("traps", c.sender, ["eager"].concat(c.args), c.R) });   // the no-cooldown switch, as its own command (and a Toggles switch)
  // the wild traps' three switches, as their own commands for the Companion's Toggles (10z8-wild-traps.js; off till they say so)
  addCommand("wildtraps",                { topic: "traps", run: (c) => trapCommand("traps", c.sender, ["wild"].concat(c.args), c.R) });
  addCommand("buildtraps",               { topic: "traps", run: (c) => trapCommand("traps", c.sender, ["build"].concat(c.args), c.R) });   // (the Companion's Progressive restraints switch)
  addCommand("wildlimbs",                { topic: "traps", run: (c) => trapCommand("traps", c.sender, ["wild", "limbs"].concat(c.args), c.R) });
  addCommand("wildlaced",                { topic: "traps", run: (c) => trapCommand("traps", c.sender, ["wild", "laced"].concat(c.args), c.R) });
