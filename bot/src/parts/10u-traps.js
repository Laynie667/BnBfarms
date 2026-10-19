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
  function isSubject(mn){ return hasRole(mn, ROLE.SUBJECT); }
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
  // can this trap spring on them right now? null = yes
  function trapWhyNot(mn, kind){
    const r = rec(mn), K = TRAP_KINDS[kind];
    if (!r || !K) return "no such trap";
    if (!isSubject(mn)) return "not a subject";
    if (r.trapsOff) return "they've paused the traps";
    if ((r.trapSkip || []).includes(kind)) return "they've ruled that one out";
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
    if (ANTHRO[kind] && /\b(anthro|furr|beast)/i.test(lim)) return "their limits rule it out";
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

  const tFill = (t, mn, v) => bodyWords(mn, t).replace(/%n/g, plainName(mn)).replace(/%ml/g, (v && v.ml) || "").replace(/%c/g, (v && v.c) || "").replace(/%h/g, (v && v.h) || "").replace(/%x/g, (v && v.x) || "");
  // a trap's story, a beat at a time, then what it leaves behind
  function trapRun(mn, kind, beats, done, v){
    state.trapRuns = state.trapRuns || new Map();
    const run = { kind, i: 0, timer: null, beats: (beats = beats.slice()) };   // (a copy: ?struggle can add to it)
    const before = { pissed: (rec(mn) || {}).pissed || 0, eggs: ((prodOf(mn) || {}).eggs || {}).n || 0 };
    try { offerBets(mn, kind); } catch(e){ warn("bets:", e); }   // watchers get a flutter (10y3-trap-ranks.js)
    // it never lets go before its story's told
    { const r0 = rec(mn); if (r0 && r0.penned && r0.penned.trap) r0.penned.until = Math.max(r0.penned.until, Date.now() + (beats.length + 1)*CFG.TRAP_BEAT_S*1000); }
    const gearPlan = trapGearStart(mn, kind);   // real gear, for those who let the farm put it on them (10y-farm-gear.js)
    state.trapRuns.set(mn, run);
    const step = () => {
      if (state.trapRuns.get(mn) !== run) return;
      if (run.i < beats.length && charFor(mn)){
        const b = beats[run.i++];
        emote(TRAP_KINDS[kind].icon+" "+tFill(pickFor(mn, "trap:"+kind+":"+run.i, Array.isArray(b) ? b : [b]), mn, v)+(intensityTail(mn, run.i, beats.length, kind) || bodyTail(mn, kind, run.i)), mn);
        toysBeat(mn, run.i, beats.length);   // any buzzin' toy they're wearin' follows the scene (10y6-keepers.js)
        run.timer = setTimeout(step, CFG.TRAP_BEAT_S*1000);
        return;
      }
      state.trapRuns.delete(mn);
      if (charFor(mn)){ try { done(); trapDone(mn, kind, before); } catch(e){ warn("trap "+kind+":", e); } }
      try { trapGearDone(mn, charFor(mn) ? gearPlan : null); } catch(e){ warn("trap gear:", e); }
      try { if (charFor(mn)) keepersAfter(mn, kind, before); toysAfter(mn); } catch(e){ warn("keepsake:", e); }
      try { if (charFor(mn) && TRAP_SOUND_END[kind]) sound(mn, TRAP_SOUND_END[kind]); } catch(e){}   // ...and when it lets go   // the album card; toys go still or back how they were (10y6-keepers.js)
      try { if (charFor(mn)) trapAfter(mn, kind, before); } catch(e){ warn("trap after:", e); }
      try { if (charFor(mn)) symbioteAfterTrap(mn, kind); } catch(e){ warn("trap symbiote:", e); }
      try { if (charFor(mn)) trapMess(mn, kind); } catch(e){ warn("trap mess:", e); }   // the mess its equipment leaves (10u7-traps-3.js)   // somethin' waitin' in it (10v4-symbiotes.js)   // ranks, bets, bein' handed on (10y3-trap-ranks.js)   // (what they're left wearin': 10x-trap-extras.js)
      trapFree(mn); saveLedger(); syncCompanions(true);
    };
    step();
  }
  // the safeword (and ?subject quit): whatever's got them lets go, and every trap stays quiet for an hour
  function trapStop(mn, quietMin){
    const run = state.trapRuns && state.trapRuns.get(mn);
    if (run){ clearTimeout(run.timer); state.trapRuns.delete(mn); toysFollow(mn, null); }
    sitStop(mn, "safe");        // up off the nest (10y6-keepers.js)
    if (quietMin == null) uddersSafe(mn);   // up out of the farrowin' stall (10y7-udders.js)
    trapWaitEnd(mn, "quiet");   // the tickle rack, the mirror box (10u4-more-traps.js)
    sceneStop(mn);              // a layin' or a birth scene (10y2-brood.js)
    gearOff(mn, null, "hold"); if (quietMin == null) gearOff(mn, null, "trap");
    if (quietMin == null){ const r1 = rec(mn); if (r1){ r1.run = null; } if (state.lend && state.lend.mn === mn) state.lend = null; cursedOff(mn, "safe"); }   // a safeword ends a gauntlet run, a loan, a curse and the suit   // what it had on them comes off (all of it, on a safeword)
    { const r0 = rec(mn); if (r0 && r0.benched && r0.benched.trap) unbench(mn, "safe"); }   // the pillory
    trapFree(mn);
    const r = rec(mn); if (r && isSubject(mn)){ r.trapQuiet = Date.now() + (quietMin == null ? 60 : quietMin)*60000; saveLedger(); }
    return !!run;
  }

  // ── what each trap does ────────────────────────────────────
  const INJECTOR_LOADS = ["lactation", "virility", "fertility", "heat inducer", "egg laying", "hyper pregnancy", "udder growth", "ass growth", "lactation x2", "fertility x2"];
  function openHole(mn, want){
    const order = (want ? [want] : []).concat(["vulva", "butt", "mouth"]);
    return order.find(h => (h !== "vulva" || hasVulva(mn)) && !holeBlocked(mn, h)) || null;
  }
  const TRAP_HOLE = { vulva: "pussy", butt: "ass", mouth: "throat" };
  // pour somethin' into a hole: what fits stays, the rest runs out. Returns what stayed.
  function trapFill(mn, hole, amount, over){
    amount *= holeX(mn, hole);   // a trained hole is given more (10y6-keepers.js)
    const p = prodOf(mn), room = Math.max(0, capacity(mn)*(over || 1) - heldTotal(p)), kept = Math.min(amount, room);
    p.held[hole] = (p.held[hole] || 0) + kept; p.totals.received += kept;
    try { holeTook(mn, hole, kept); } catch(e){ warn("holes:", e); }
    if (hole === "mouth" && kept >= CFG.HUNGRY_ML){ p.boosts = p.boosts || {}; p.boosts.hungry = Date.now() + 3600000; }
    return kept;
  }
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
    return x;
  }
  // clutches STACK: every encounter adds to what they're already carryin', up to CFG.EGG_MAX
  function layClutch(mn, n, by){
    const p = prodOf(mn), [dl, dh] = CFG.EGG_DAYS;
    n = Math.max(1, Math.min(CFG.EGG_MAX, Math.round(n * eggX(mn))));
    if (p.eggs) p.eggs.n = Math.min(CFG.EGG_MAX, p.eggs.n + n);
    else p.eggs = { n, by, since: Date.now(), layAt: Date.now() + (dl + Math.random()*(dh - dl))*86400000 };
    eggTypesNote(p, n, by);   // what laid them (10y4-corruption.js)
    try { bredBack(mn); } catch(e){ warn("bred back:", e); }   // filled again inside the hour (10y7-udders.js)
    saveLedger(); audit(BOTMN(), "CLUTCH", mn+" "+n+" by "+by);
    return p.eggs.n;
  }
  // hyper: a worn item, a shot, a tonic, or just bad luck in the water
  function hyperEggs(mn, luck){ const p = prodOf(mn); return wornTags(mn).has("hyper") || boosted(p, "hyper") || Math.random() < (luck || 0); }

  function springTrap(mn, kind, spot, force){
    if (kind === "random"){
      // a tile in a place springs that place's traps (10ua-trap-themes.js); nothin' fits there, or no place: any trap
      const placed = spot ? themePool(mn, spot) : [];
      const can = placed.length ? placed : Object.keys(TRAP_KINDS).filter(k => k !== "tentacle" && !trapWhyNot(mn, k));
      if (!can.length) return "nothin' they can spring right now";
      kind = can[Math.floor(Math.random()*can.length)];
    }
    const why = trapWhyNot(mn, kind);
    if (why) return why;
    const r = rec(mn), p = prodOf(mn), T = TRAP_LINES[kind], v = {};
    r.trapLog = (r.trapLog || []).concat({ t: Date.now(), kind, spot: spot || "" }).slice(-20);
    r.trapN = (r.trapN || 0) + 1;
    trapSprung(mn, kind, spot);   // tallies, the trap card, bait (10x-trap-extras.js)
    audit(BOTMN(), "TRAP", mn+" "+kind+(spot ? " at "+spot : "")+(force ? " (by hand)" : ""));
    tell(mn, TRAP_KINDS[kind].icon+" You've sprung a trap, sugar: "+TRAP_KINDS[kind].what+". Your safeword stops it cold.");
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
        const m0 = makesMilk(mn) ? p.milk : 0, s0 = makesSemen(mn) ? p.semen : 0;
        trapRun(mn, kind, (m0 >= s0 ? T.milk : T.seed).concat(T.both), () => {
          const gotM = m0 > 0 ? drainMilk(mn, p.milk) : 0, gotS = s0 > 0 ? drainSemen(mn, p.semen) : 0;
          emote("🥛 "+tFill(pickFor(mn, "trap:milker:end", T.end), mn, { ml: ml(gotM + gotS) }), mn);
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

  // the thing in the water: five scenes, and it always leaves eggs
  function tentacleScene(mn, spot, deep){   // deep: the thing in the well (it keeps them longer, and lays more)
    const r = rec(mn), p = prodOf(mn), T = TRAP_LINES.tentacle, v = {};
    const lower = openHole(mn, "vulva"), back = !holeBlocked(mn, "butt") && lower !== "butt" ? "butt" : null, mouth = !holeBlocked(mn, "mouth");
    v.h = lower && lower !== "mouth" ? TRAP_HOLE[lower] : "belly";
    const kin = parasiteOn(mn);   // it knows its own: a gentler comin', and double the clutch
    const beats = (kin ? [PARASITE_MORE.kin] : []).concat(deep ? [BROOD_LINES.wellGrab, BROOD_LINES.wellDeep] : [T.grab], [T.strip, lower && lower !== "mouth" ? T.take : T.takeShut, back ? T.second : T.wrap, mouth ? T.mouth : T.muzzle], T.churn ? [T.churn] : [], [T.swell]);   // (churn: 10w2-trap-lines-deeper.js)
    trapHold(mn, deep ? 10 : 6, deep ? "the well" : "the water");
    trapRun(mn, "tentacle", beats, () => {
      const [lo, hi] = CFG.EGG_COUNT, hyper = hyperEggs(mn, CFG.TENTACLE_HYPER_CHANCE);
      const n = layClutch(mn, (lo + 2 + Math.floor(Math.random()*(hi - lo + 1))) * (hyper ? 3 + Math.floor(Math.random()*2) : 1) * (kin ? 2 : 1) * (deep ? 1.5 : 1), TENTACLE_SIRE);
      v.x = String(n);
      if (lower && lower !== "mouth") trapFill(mn, lower, 250 + Math.random()*250, CFG.TRAP_OVERFULL);
      if (back) trapFill(mn, "butt", 150 + Math.random()*200, CFG.TRAP_OVERFULL);
      if (mouth) trapFill(mn, "mouth", 120, CFG.TRAP_OVERFULL);
      tally(mn);
      emote("🥚 "+tFill(pickFor(mn, "trap:tentacle:end", hyper ? T.endHyper : T.end), mn, v), mn);
      tell(mn, "🥚 "+(hyper ? "It packed you till you couldn't hold another one: " : "It left ")+n+" eggs in your "+v.h+", sugar. You'll be layin' in a few days, and you'll be slow on your feet till then.");
      bodyMark(mn, { splat: ["tummy", "chest", "face"] }); face(mn, "afterglow", 180); arouse(mn, 50);
      r.tentacled = (r.tentacled || 0) + 1;
    }, v);
  }

  // ── every heartbeat: who's standin' on what ────────────────
  function trapTick(){
    const now = Date.now();
    state.trapAt = state.trapAt || new Map();      // subject → the spot they're stood on (so one visit is one roll)
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber;
      if (mn === BOTMN() || !isSubject(mn)) continue;
      const r = rec(mn);
      const on = trapSpots().find(([n]) => onSpot(mn, n, 0)), wet = !on && waterSpots().find(([n]) => onSpot(mn, n, 1));
      const here = on ? on[0] : wet ? wet[0] : null, was = state.trapAt.get(mn);
      if (!here){ state.trapAt.delete(mn); continue; }
      const fresh = !was || was.spot !== here;
      if (fresh) state.trapAt.set(mn, { spot: here, at: now });
      if (!huntOn() && !r.trapEager && !onGauntlet(mn) && now - (r.trapAt || 0) < CFG.TRAP_COOLDOWN_MIN*60000) continue;    // one trap at a time, with a breather between (not durin' a hunt)
      if (on){
        if (!fresh) continue;                                                             // step off and back on to spring it again
        r.spotTrapAt = r.spotTrapAt || {};
        if (!r.trapEager && !onGauntlet(mn) && now - (r.spotTrapAt[here] || 0) < CFG.TRAP_RESET_MIN*60000*nightX().reset/dangerX(mn).chance/rankX(mn).reset) continue;   // each trap takes a while to reset (half as long after dark)
        const kind = trapKindOf(here);
        if (!springTrap(mn, kind, here)){ r.trapAt = now; r.spotTrapAt[here] = now; saveLedger(); }
      } else {
        // water: a slim chance when they wade in, and again every few minutes they linger
        const st = state.trapAt.get(mn);
        if (!fresh && now - (st.rolled || 0) < CFG.TENTACLE_LINGER_MIN*60000/(potionOn(mn, "tentaclemusk") ? 5 : 1)) continue;   // (with Tentacle Musk on, it looks again every minute)
        st.rolled = now;
        const wk = waterKindOf(here);   // tentacles, leeches, the well, or slime (10y2-brood.js)
        if (((wk === "tentacle" && parasiteKin(mn, now)) || Math.random() < Math.min(1, CFG.TENTACLE_CHANCE*nightX().water*dangerX(mn).chance*rankX(mn).water*(potionOn(mn, "tentaclemusk") ? CFG.MUSK_WATER_X : 1))) && !springTrap(mn, wk, here)){ r.trapAt = now; saveLedger(); }   // (three times as hungry after dark)
      }
    }
    toyTick(); moreTrapTick(); newTrapTick(); mazeTick(); trapExtrasTick(); farmGearTick(Date.now()); broodTick(); corruptionTick(); cursedTick(); keepersTick(); uddersTick();
  }

  // ── toys that do things on their own ───────────────────────
  const AUTO_INJECT = ["auto-injector", "autoinjector", "auto inject", "self-inject", "auto-dose", "auto doser"];
  const OVI_WORDS = ["ovipositor"];
  const FEED_WORDS = ["auto-feed", "autofeed", "auto feeder", "self-feed", "force-feed", "forcefeed"];
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
        if (hasWord(text, AUTO_INJECT) && due("inj", CFG.AUTOINJECT_MIN)){
          const ok = applyShot(mn, BOTMN(), text, { open: tFill(pickFor(mn, "toy:inj", TOY_LINES.inject), mn, { c: itemName(it) }), from: "your "+itemName(it)+"'s dose", heatH: 1 });
          if (ok) audit(BOTMN(), "AUTOINJECT", mn+" "+itemName(it));
        }
        // an ovipositor on a gag, a belt, a plug or a dildo
        if (TOY_GROUPS[g] && hasWord(text, OVI_WORDS) && (r.eggs || isSubject(mn)) && !limitBlocks(mn, "eggs") && due("ovi", CFG.OVI_MIN)){
          const [lo, hi] = CFG.EGG_COUNT, hyper = tagsIn(text).has("hyper") || hyperEggs(mn, 0);
          const n0 = (lo + Math.floor(Math.random()*(hi - lo + 1))) * shotTimes(text) * (hyper ? 3 : 1);
          const n = layClutch(mn, n0, TOY_SIRE), hole = TOY_GROUPS[g];
          emote("🥚 "+tFill(pickFor(mn, "toy:ovi:"+hole, TOY_LINES.ovi[hole]), mn, { c: itemName(it), x: String(n0) }), mn);
          tell(mn, "🥚 Your "+itemName(it)+" just laid "+n0+" eggs in you, sugar. You're carryin' "+n+" now.");
          arouse(mn, 20);
        }
        // a funnel gag (or any gag) that feeds on its own
        if (TOY_GROUPS[g] === "mouth" && hasWord(text, FEED_WORDS) && due("feed", CFG.AUTOFEED_MIN)){
          const piss = !!r.watersports && /piss|golden|urin/.test(text);
          const kept = trapFill(mn, "mouth", CFG.AUTOFEED_ML * shotTimes(text), CFG.TRAP_OVERFULL);
          if (kept >= 1){
            if (!piss) p.milk = Math.min(milkCap(mn), p.milk + kept * CFG.PROD.SWALLOW_TO_MILK);
            emote("🍼 "+tFill(pickFor(mn, "toy:feed:"+(piss ? "p" : "f"), piss ? TOY_LINES.feedPiss : TOY_LINES.feed), mn, { c: itemName(it), ml: ml(kept) }), mn);
            if (typeof addonsEmit === "function") addonsEmit("fed", mn, kept, piss ? "piss" : "feed");
          } else if (now - (p.toyAt.fullTold || 0) > 30*60000){ p.toyAt.fullTold = now; tell(mn, "🍼 Your "+itemName(it)+" gurgles, but there's not room for another drop in you, sugar."); }
        }
        // a toy crafted as a cock: the farm talks about it like one
        if ((g === "ItemVulva" || g === "ItemButt" || g === "ItemPelvis" || g === "ItemDevices") && !hasWord(text, OVI_WORDS) && !hasWord(text, AUTO_INJECT)){
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
    return Math.round(Math.min(CFG.SLOW_MAX, s) * 10) / 10;
  }

  // ── commands ───────────────────────────────────────────────
  function trapsList(){ return Object.entries(TRAP_KINDS).map(([k, t]) => t.icon+" "+k+": "+t.what).join("\n"); }
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
      if (a0 === "quit" || a0 === "leave"){
        if (!isSubject(sender)){ R("You're not signed up as a test subject, sugar."); return true; }
        trapStop(sender, 0); r.roles = r.roles.filter(x => x !== ROLE.SUBJECT); r.trapQuiet = 0; saveLedger(); audit(sender, "SUBJECT", "quit");
        R("🧪 You're off the subject list, sugar. Not one trap on this farm will spring for you now. Thank you for volunteerin'.");
        syncCompanions(true); return true;
      }
      if (a0 === "add" || a0 === "remove"){
        if (!isProprietor(sender)){ R("Sorry, sugar, signin' subjects up is just for the proprietors."); return true; }
        const t = resolveTarget(args[1]);
        if (!t || t === BOTMN()){ R("Who, sugar? ?subject "+a0+" <who>, like ?subject "+a0+" Daisy or ?subject "+a0+" 123456."); return true; }
        const tr = rec(t, true); tr.name = plainName(t);
        if (a0 === "add"){
          if (isSubject(t)){ R(plainName(t)+" is already a test subject, sugar."); return true; }
          tr.roles.push(ROLE.SUBJECT); saveLedger(); audit(sender, "SUBJECT", "add "+t);
          R("🧪 "+plainName(t)+" is signed up as a test subject. Every trap on the farm will spring for them now, and the water's not safe either.");
          tell(t, "🧪 "+plainName(sender)+" has signed you up as a TEST SUBJECT at B&B Farm, sugar. From here on the farm's traps spring for you and nobody else: step on the wrong spot and you might get dosed, drained, bred, stripped, pumped full or filled with eggs. And mind the water.\n"+
                  "?traps shows what's out there · ?traps off pauses every one · ?traps skip <kind> rules one out · ?subject quit takes you off the list for good · your SAFEWORD stops a trap cold. Your hard limits still rule.");
        } else {
          if (!isSubject(t)){ R(plainName(t)+" isn't a test subject, sugar."); return true; }
          trapStop(t, 0); tr.roles = tr.roles.filter(x => x !== ROLE.SUBJECT); tr.trapQuiet = 0; saveLedger(); audit(sender, "SUBJECT", "remove "+t);
          R("🧪 "+plainName(t)+" is off the subject list."); tell(t, "🧪 You've been taken off the test subject list, sugar. The traps won't spring for you any more.");
        }
        syncCompanions(true); return true;
      }
      if (isProprietor(sender) && (!a0 || a0 === "list")){
        const subs = Object.values(L.people).filter(x => x.roles && x.roles.includes(ROLE.SUBJECT));
        R(subs.length ? "🧪 TEST SUBJECTS\n"+subs.map(x => "• "+plainName(x.mn)+" ("+x.mn+")"+(charFor(x.mn) ? " ●" : "")+" · traps sprung: "+(x.trapN || 0)+(x.tentacled ? " · taken by the water: "+x.tentacled : "")+(x.trapsOff ? " · paused" : "")+((x.trapSkip || []).length ? " · skips "+x.trapSkip.join(", ") : "")).join("\n")+
                        "\n?subject add <who> · ?subject remove <who> · ?traps for the spots"
                      : "🧪 No test subjects yet, sugar. ?subject add <who> signs a volunteer up, and then the trap spots (?traps) spring for them and nobody else.");
        return true;
      }
      R(isSubject(sender) ? "🧪 You're a test subject, sugar. Traps sprung on you so far: "+(r.trapN || 0)+". ?traps shows what's out there, ?traps off pauses them, ?subject quit takes you off the list."
                          : "🧪 Test subjects are volunteers the proprietors sign up. The farm's traps spring for them and nobody else. Ask a proprietor if you fancy it.");
      return true;
    }
    if (cmd === "traps" || cmd === "trap"){
      if (a0 === "themes" || a0 === "places"){ R(themesText()); return true; }   // which traps each place springs (10ua-trap-themes.js)
      if (a0 === "on" || a0 === "off"){
        if (!isSubject(sender)){ R("Only a test subject has traps to switch, sugar."); return true; }
        r.trapsOff = a0 === "off"; if (r.trapsOff) trapStop(sender, 0); r.trapQuiet = 0; saveLedger();
        R(r.trapsOff ? "🧪 Traps paused. Not one will spring for you till you say ?traps on." : "🧪 Traps are live again, sugar. Watch your step."); return true;
      }
      if (a0 === "eager"){
        if (!isSubject(sender)){ R("Only a test subject has traps to hurry up, sugar."); return true; }
        const v = String(args[1] || "").toLowerCase();
        if (v !== "on" && v !== "off"){ R("🧪 Eager is "+(r.trapEager ? "ON" : "off")+" for you, sugar: ?traps eager on skips the breather between traps and the wait for a trap to reset. Step off a trap and back on, and it has you again."); return true; }
        r.trapEager = v === "on"; saveLedger(); syncCompanions(true);
        R(r.trapEager ? "🧪 Eager: ON. No breather between traps, no waitin' for one to reset. Step off and back on and it springs again. ?traps eager off when you've had enough." : "🧪 Eager: off. The traps go back to takin' their time with you."); return true;
      }
      if (a0 === "skip" || a0 === "allow"){
        if (!isSubject(sender)){ R("Only a test subject has traps to rule out, sugar."); return true; }
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
        const why = springTrap(t, k, "", true);
        if (!why){ const tr = rec(t); tr.trapAt = Date.now(); saveLedger(); }
        R(why ? "🧪 That trap won't spring on "+plainName(t)+": "+why+"." : "🧪 Sprung on "+plainName(t)+"."); return true;
      }
      const spots = trapSpots(), water = waterSpots();
      if (isStaff(sender))
        R("🧪 TRAPS (they spring for test subjects and nobody else)\n"+trapsList()+
          "\n\nSet one: stand on the spot and say ?spot set trap-<kind> (trap-milker-2 for a second one; plain ?spot set trap springs pot luck)."+
          "\nOut there now: "+(spots.length ? spots.map(([n]) => n+(L.trapLoads && L.trapLoads[n] ? " ["+L.trapLoads[n]+"]" : "")).join(", ") : "none yet")+
          "\nWater the thing lives in: "+(water.length ? water.map(([n]) => n).join(", ") : "none yet (?spot set pond, pool, creek, water, well, bath…)")+
          "\n?trap load <spot> <words> · ?trap bait <spot> <ribbons> · ?trap spring <who> <kind> · ?subject for the list"+
          "\n?trap make <name> <what it does>… builds one of your own (?trap made) · ?whistle <which> <who> calls one of the farm's own to them"+
          "\n?hunt start [minutes] · ?pack on|off · nest spots (?spot set nest) and ?gather · crate spots (?spot set crate)");
      else if (isSubject(sender))
        R("🧪 WHAT'S OUT THERE FOR YOU\n"+trapsList()+"\n\nThere are "+spots.length+" trap"+(spots.length === 1 ? "" : "s")+" hidden on the farm"+(water.length ? ", and somethin' lives in the water" : "")+". I'm not tellin' you where."+
          "\n?struggle when one has you (one try) · ?traps eager on skips the waits · ?traps off pauses them · ?traps skip <kind> rules one out"+((r.trapSkip || []).length ? " (you skip: "+r.trapSkip.join(", ")+")" : "")+" · your safeword stops one cold.");
      else R("🧪 The farm's traps only spring for test subjects, sugar, and you're not one. You can walk right over 'em.");
      return true;
    }
    return false;
  }
