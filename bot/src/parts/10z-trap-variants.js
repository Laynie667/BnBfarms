  /* WHAT'S IN THIS FILE (10z-trap-variants.js)
     The gas, spray and injection traps come in KINDS and in three STRENGTHS (10u-traps.js hands them over here).
     • Strength: mild, strong or brutal. Pot luck leans mild; a Danger Draught leans it the other way.
       A stronger trap holds longer, doses deeper and makes more of a mess.
     • Gas:   heat · milk · musk · needy · giggle · haze · rut · ripen · moo
       Spray: seed · piss (?watersports on only) · milk · slime · oil · ink · hose
       Needle: milk · seed · breed · heat · eggs · hyper · udder · ass · balls · cock · stretch · mpreg · cocktail
     • A proprietor can fix what a spot does: ?trap load trap-gas musk brutal · ?trap load trap-spray-2 slime ·
       ?trap load trap-injector cocktail strong (an injector also still takes plain needle words: "lactation x3").
     • THE DANGER DRAUGHT (10m-potions.js has the bottle): while it's in somebody, everything that works on a chance
       is half again as likely for them (catchin', the thing in the water, the parasite, a crate that bites), and
       every trap timer runs double. A second bottle on top: triple.
     • ?traps eager on|off: a subject's own switch to skip the breather between traps and the reset on each spot.
  */
  const SEVERITY = [null, { name: "mild", x: 1, t: 1 }, { name: "strong", x: 2, t: 1.5 }, { name: "brutal", x: 3, t: 2.5 }];
  // the Danger Draught: chance is how much likelier, time is how much longer
  function dangerX(mn){ const n = potionX(mn, "danger"); return { chance: n ? CFG.DANGER_CHANCE_X : 1, time: n >= 2 ? 3 : n === 1 ? 2 : 1, on: n > 0 }; }
  const tmin = (mn, mins) => mins * dangerX(mn).time;
  function pickSeverity(mn, fixed){
    if (fixed) return fixed;
    const w = ruined(mn) ? [0.1, 0.3, 0.6] : dangerX(mn).on ? [0.2, 0.4, 0.4] : [0.55, 0.3, 0.15], roll = Math.random();   // (Ruined: 10y4-corruption.js)
    return intensitySev(mn, roll < w[0] ? 1 : roll < w[0] + w[1] ? 2 : 3);   // tender leans mild, filthy leans brutal (10y7-udders.js)
  }
  // "musk brutal", "slime", "strong": what a proprietor loaded a spot with
  function parseTrapLoad(kind, words){
    const w = String(words || "").toLowerCase().split(/\s+/).filter(Boolean), out = { variant: null, sev: 0 };
    for (const x of w){
      const s = ["mild", "strong", "brutal"].indexOf(x); if (s >= 0){ out.sev = s + 1; continue; }
      if (VARIANTS[kind] && VARIANTS[kind][x]) out.variant = x;
    }
    return out.variant || out.sev ? out : null;
  }
  const vLine = (pool, key, mn, v) => tFill(pickFor(mn, "trapv:"+key, pool), mn, v);

  const NEEDLE_WORDS = { milk: "lactation", seed: "virility", breed: "fertility", heat: "heat inducer", eggs: "egg laying", hyper: "hyper pregnancy", udder: "udder growth",
                         ass: "ass growth", balls: "balls growth", cock: "cock growth", stretch: "capacity", mpreg: "mpreg" };
  const VARIANTS = {
    gas: {
      heat:   { can: mn => !limitBlocks(mn, "heat"), go(mn, S){ startHeat(mn, BOTMN(), tmin(mn, S.t)*corrHeatX(mn)); arouse(mn, 25 + 10*S.x); } },
      milk:   { can: mn => makesMilk(mn) && !limitBlocks(mn, "milk"), go(mn, S){ const p = prodOf(mn); addBoost(p, "milk", tmin(mn, 3)*3600000, S.x); p.milk = Math.min(milkCap(mn), p.milk + milkCap(mn)*0.3*S.x); arouse(mn, 10*S.x); } },
      musk:   { can: mn => !potionRefusal(mn, "musk", mn), go(mn, S){ for (let i = 0; i < S.x; i++) givePotion(mn, "musk", BOTMN(), "gas"); } },
      needy:  { can: mn => !potionRefusal(mn, "needy", mn), go(mn, S){ for (let i = 0; i < S.x; i++) givePotion(mn, "needy", BOTMN(), "gas"); arouse(mn, 20*S.x, 92); } },
      giggle: { can: mn => !potionRefusal(mn, "feather", mn), go(mn, S){ givePotion(mn, "feather", BOTMN(), "gas"); if (S.x >= 2 && !potionRefusal(mn, "hiccup", mn)) givePotion(mn, "hiccup", BOTMN(), "gas"); if (S.x >= 3) givePotion(mn, "feather", BOTMN(), "gas"); } },
      haze:   { can: mn => !/\b(hypno|trance|mind)/i.test(rec(mn).limits || ""), go(mn, S){ trance(mn, S.x); goUnder(mn, S.x); later(() => trance(mn, 0), tmin(mn, S.t)*120000); arouse(mn, 15*S.x); tell(mn, "🏮 "+tFill(pickFor(mn, "trap:lantern:thought", TRAP_LINES.lantern.thought), mn)); } },
      rut:    { can: mn => makesSemen(mn), go(mn, S){ const p = prodOf(mn); p.pentUp = true; addBoost(p, "semen", tmin(mn, 3)*3600000, S.x); p.semen = Math.min(semenCap(mn), p.semen + semenCap(mn)*0.3*S.x); arouse(mn, 20*S.x); } },
      ripen:  { can: mn => hasVulva(mn) && !limitBlocks(mn, "breed"), go(mn, S){ const p = prodOf(mn); addBoost(p, "fert", tmin(mn, 6)*3600000, S.x); if (S.x >= 3) addBoost(p, "hyper", tmin(mn, 6)*3600000, 1); arouse(mn, 10*S.x); } },
      moo:    { can: mn => !potionRefusal(mn, "moo", mn), go(mn, S){ for (let i = 0; i < Math.min(2, S.x); i++) givePotion(mn, "moo", BOTMN(), "gas"); } },
    },
    spray: {
      seed:   { can: () => true, hold: 2, go(mn, S){ bodyMark(mn, { splat: ["face", "chest", "tummy", "forehead", "face", "chest"].slice(0, 2 + S.x*1) }); if (S.x >= 3 && !holeBlocked(mn, "mouth")) trapFill(mn, "mouth", 80); arouse(mn, 10*S.x); } },
      piss:   { can: mn => !!rec(mn).watersports, hold: 2, go(mn, S){ const r = rec(mn); bodyMark(mn, { splat: ["face", "chest", "tummy", "forehead", "chest"].slice(0, 2 + S.x), color: CFG.PISS_COLOR }); if (S.x >= 2 && !holeBlocked(mn, "mouth")) trapFill(mn, "mouth", 60*S.x); r.pissed = (r.pissed || 0) + 1; arouse(mn, 10*S.x); } },
      milk:   { can: () => true, hold: 2, go(mn, S){ bodyMark(mn, { splat: ["face", "chest", "tummy", "chest"].slice(0, 1 + S.x), color: "#F3EEDD", mess: "milk" }); if (S.x >= 2 && !holeBlocked(mn, "mouth")){ const p = prodOf(mn), k = trapFill(mn, "mouth", 80*S.x); p.milk = Math.min(milkCap(mn), p.milk + k * CFG.PROD.SWALLOW_TO_MILK); } arouse(mn, 8*S.x); } },
      slime:  { can: mn => !/\b(slime|goo)/i.test(rec(mn).limits || ""), hold: 3, go(mn, S){ const r = rec(mn); bodyMark(mn, { splat: ["face", "chest", "tummy", "forehead"].slice(0, 1 + S.x), color: "#5FAE3A" }); r.gluedUntil = Date.now() + tmin(mn, 8*S.x)*60000; r.dirt = r.dirt || {}; r.dirt.slime = Date.now(); if (S.x >= 3) bodyMark(mn, { strip: true }); arouse(mn, 10*S.x); } },
      oil:    { can: mn => !/\barous/i.test(rec(mn).limits || ""), hold: 2, go(mn, S){ arouse(mn, 25*S.x, 95); face(mn, "heat", 120); if (S.x >= 3 && !limitBlocks(mn, "heat")) startHeat(mn, BOTMN(), tmin(mn, 1)); else if (!potionRefusal(mn, "needy", mn) && S.x >= 2) givePotion(mn, "needy", BOTMN(), "spray"); } },
      ink:    { can: mn => !/\b(writ|mark|humiliat)/i.test(rec(mn).limits || ""), hold: 2, go(mn, S){ const r = rec(mn), word = ["SPRAYED", "MARKED", "TRAP BAIT", "CAUGHT", "PROPERTY"][Math.floor(Math.random()*5)]; bodyMark(mn, { splat: ["chest", "tummy", "face"].slice(0, S.x), color: "#2A4FA8" }); if (S.x >= 2){ later(() => bodyMark(mn, { write: { line: word, area: "chest" } }), 1500); r.branded = word; r.dirt = r.dirt || {}; r.dirt.brand = word; } } },
      hose:   { can: () => true, hold: 1, go(mn){ const p = prodOf(mn); bodyMark(mn, { wash: true }); if (p) p.painted = null; aftermathWash(mn); } },
    },
  };
  // an injector's kinds are needle words
  for (const k of Object.keys(NEEDLE_WORDS)) (VARIANTS.injector = VARIANTS.injector || {})[k] = { word: NEEDLE_WORDS[k] };
  VARIANTS.injector.cocktail = { word: null };
  function needleCan(mn, k){
    if (k === "milk" || k === "udder") return makesMilk(mn) && !limitBlocks(mn, "milk");
    if (k === "seed" || k === "balls" || k === "cock") return makesSemen(mn);
    if (k === "heat") return !limitBlocks(mn, "heat");
    if (k === "eggs") return !limitBlocks(mn, "eggs");
    if (k === "breed" || k === "hyper" || k === "mpreg") return !limitBlocks(mn, "breed");
    return true;
  }

  // returns true when it took the trap over
  function variantTrap(mn, kind, spot){
    if (!VARIANTS[kind]) return false;
    const r = rec(mn), loaded = L.trapLoads && spot ? L.trapLoads[spot] : null, fixed = loaded ? parseTrapLoad(kind, loaded) : null;
    if (kind === "injector" && loaded && !fixed) return false;        // plain needle words: the old way handles those
    const S = SEVERITY[pickSeverity(mn, fixed && fixed.sev)], T = VARIANT_LINES[kind], v = { x: S.name };
    if (kind === "injector"){
      const kinds = Object.keys(NEEDLE_WORDS).filter(k => needleCan(mn, k));
      let k = fixed && fixed.variant ? fixed.variant : Math.random() < 0.15 ? "cocktail" : kinds[Math.floor(Math.random()*kinds.length)] || "stretch";
      const words = k === "cocktail" ? kinds.sort(() => Math.random() - 0.5).slice(0, 2).map(x => NEEDLE_WORDS[x]) : [NEEDLE_WORDS[k]];
      const style = Object.keys(T.styles)[Math.floor(Math.random()*Object.keys(T.styles).length)];
      trapHold(mn, 2 + S.x, "the injector");
      trapRun(mn, kind, T.styles[style].concat([T.fill[S.x - 1]]), () => {
        let ok = false;
        words.forEach((w, i) => { ok = applyShot(mn, BOTMN(), w+(S.x > 1 ? " x"+S.x : ""), { open: i ? vLine(T.second, "inj:second", mn, v) : vLine(T.open[S.x - 1], "inj:open"+S.x, mn, v), from: "the trap's dose", heatH: tmin(mn, S.t) }) || ok; });
        if (!ok) emote("💉 "+tFill(TRAP_LINES.injector.dud, mn), mn);
        arouse(mn, 10 + 5*S.x);
      }, v);
      r.trapSev = S.name; return true;
    }
    const can = Object.keys(VARIANTS[kind]).filter(k => VARIANTS[kind][k].can(mn));
    const k = fixed && fixed.variant && VARIANTS[kind][fixed.variant].can(mn) ? fixed.variant : can[Math.floor(Math.random()*can.length)];
    if (!k) return false;
    const V = VARIANTS[kind][k], lines = T[k];
    if (V.hold) trapHold(mn, V.hold + S.x, kind === "spray" ? "the spray rack" : "the gas");
    trapRun(mn, kind, [T.open, lines.cloud, lines.hit[S.x - 1], lines.after], () => { V.go(mn, S); }, v);
    r.trapSev = S.name;
    return true;
  }
