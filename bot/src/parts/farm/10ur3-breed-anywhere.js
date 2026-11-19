  /* WHAT'S IN THIS FILE (10ur3-breed-anywhere.js)
     BREEDIN' ANYWHERE, THE FARM'S SIDE (Nov 19; Laynie: "I want to be the best baby factory wherever I go", then "all
     of them, non clinical language please, make it hot and sexy"). Part one, catchin':
       RIPE DAYS     everybody Fertile has a cycle: two days in seven they're ripe, and every load takes twice as easy
                     (CFG.RIPE). Told once when it starts, shown in ?stats, and their Dispensary feels it anywhere.
       HIPS UP       on all fours, knees spread, or hogtied within five minutes of a load in their pussy or ass, and that
                     load gets another chance to take, half again as likely (CFG.LEGS_UP_X). Off the farm their
                     Dispensary marks the load and I give it that chance when I book it.
       BROOD WOMB    their switch (?broodwomb): carryin', every load takes and adds to the litter (rollConception, as
                     Sure-Catch does), up to the farm's hyper sizes.
       THEIR COCK    their Dispensary gets my numbers for their cock (a load's size, knotted, how long a tie lasts), so
                     it can tell whoever they cum in, anywhere (dispensary/src/breed.js).
  */
  // the cycle: a start for each of them, set the first time it's asked for, somewhere in the week so nobody's in step
  function cycleOf(mn){
    const r = rec(mn); if (!r) return 0;
    if (!(r.cycleAt > 0)){ r.cycleAt = Date.now() - Math.floor(Math.random() * CFG.RIPE.EVERY_D) * 86400000; saveLedger(); }
    return r.cycleAt;
  }
  // which day of their cycle it is (0 …), and whether that's a ripe one
  function cycleDay(mn, at){ const D = 86400000, n = Math.floor(((at || Date.now()) - cycleOf(mn)) / D), e = CFG.RIPE.EVERY_D; return { n, k: ((n % e) + e) % e }; }
  function isRipe(mn, at){ const r = rec(mn); if (!r || !r.fertile) return false; const { k } = cycleDay(mn, at); return k >= CFG.RIPE.FROM_D && k < CFG.RIPE.FROM_D + CFG.RIPE.DAYS; }
  function ripeX(mn, at){ return isRipe(mn, at) ? CFG.RIPE.X : 1; }
  // their ripe days, for their Dispensary (only for somebody breedable and Fertile)
  function ripeWire(mn){ const r = rec(mn); if (!r || !r.breedable || !r.fertile || limitBlocks(mn)) return null; return { at: cycleOf(mn), every: CFG.RIPE.EVERY_D, from: CFG.RIPE.FROM_D, days: CFG.RIPE.DAYS }; }
  const RIPE_TELL = [
    "🌸 You're ripe today, sugar. That warm ache low in your belly's tellin' you so: any load in you the next two days takes twice as easy.",
    "🌸 Ripe and achin', hon. For two days every load's twice as likely to catch. Go get yourself bred.",
    "🌸 Mmh, somebody's ripe. Two days of the easiest catchin' you'll get all week, sweetie.",
  ];
  // once a cycle, when it starts (or when they first come in durin' it)
  function ripeTick(mn, r, p, now){
    if (!r || !r.fertile || !r.breedable || limitBlocks(mn) || !charFor(mn)) return;
    if (!isRipe(mn, now)) return;
    const { n } = cycleDay(mn, now), cyc = Math.floor((n - CFG.RIPE.FROM_D) / CFG.RIPE.EVERY_D);
    if (p.ripeTold === cyc) return;
    p.ripeTold = cyc; saveLedger();
    tell(mn, RIPE_TELL[Math.floor(Math.random() * RIPE_TELL.length)]);
  }
  // their cock, for their Dispensary: how big a load, knotted or not, how long a tie lasts
  function cockWire(mn){
    if (!rec(mn) || !makesSemen(mn)) return null;
    const p = prodOf(mn), T = typeInfo(mn);
    const load = Math.round(Math.max(CFG.PROD.MIN_LOAD, (p.semen || 0) * CFG.PROD.LOAD_SHARE) * (T.loadX || 1) * perkLoadX(mn));
    if (!knotted(mn)) return { load, knot: false };
    const frac = (sizeOf(mn, "knot") - 1) / (CFG.SIZES.knot.max - 1), span = CFG.TIE_MAX_M - CFG.TIE_MIN_M;
    return { load, knot: true, tie: [Math.round(CFG.TIE_MIN_M + span * frac * 0.6), Math.round(CFG.TIE_MIN_M + span * (0.4 + 0.6 * frac))] };
  }
  // HIPS UP: rump up after a load, and it gets another chance to take
  const HIPS_UP = ["AllFours", "Hogtied", "KneelingSpread"];
  function hipsUpOn(mn){ const C = charFor(mn), lo = C && C.PoseMapping && C.PoseMapping.BodyLower; return HIPS_UP.includes(lo); }
  const LEGS_UP_LINES = [
    "%t stays down with their hips tipped high, keepin' %s load deep where it can take.",
    "Rump up and knees spread, %t holds every drop of %s seed inside and lets it work.",
    "%t doesn't move an inch: hips up, belly warm, %s load settlin' right where it belongs.",
    "%t arches and keeps their rump in the air, coaxin' %s seed deeper. Good breeder.",
    "%t stays bent over and still, holdin' %s load in like it's precious. It might be.",
  ];
  function legsUpTick(mn, p, now){
    const f = p.lastFill;
    if (!f || f.up || p.preg || now - (f.at || 0) > CFG.LEGS_UP_MIN * 60000 || !(f.hole === "vulva" || f.hole === "butt")) return;
    if (!hipsUpOn(mn)) return;
    f.up = true;
    const left = Math.min(f.ml || 0, p.held[f.hole] || 0), who = f.stud > 0 ? (typeof sireName === "function" ? sireName(f.stud) : plainName(f.stud)) + "'s" : "their";
    if (onMap(mn)) emote("🍑 " + pickFresh("legsup", LEGS_UP_LINES).replace(/%t/g, plainName(mn)).replace(/%s/g, who), mn);
    if (!(left >= 1) || !canCatchIn(mn, f.hole)) return;
    const caught = rollConception(mn, f.stud, left, CFG.LEGS_UP_X, f.hole);
    if (!caught) return;
    const sp = f.stud > 0 && rec(f.stud) ? prodOf(f.stud) : null;
    if (sp){ sp.totals.conceived = (sp.totals.conceived || 0) + 1; rollBoard(); const Y = L.yield; Y.s = Y.s || {}; Y.s[f.stud] = (Y.s[f.stud] || 0) + 1; }
    seedCaught(mn, f.stud, caught, false);
    saveLedger();
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __isRipe: (mn, at) => isRipe(mn, at), __ripeWire: (mn) => ripeWire(mn), __cockWire: (mn) => cockWire(mn), __legsUp: (mn) => legsUpTick(mn, prodOf(mn), Date.now()) });

  /* PART TWO, CARRYIN' (Nov 19). Their Dispensary carries the litter with them: I tell it what they're carryin'
     (carryWire: in my welcome and my answer to their loads), and it tells me what they did away (their hello: a birth,
     a layin'), which I book here, quietly, without actin' it out again.
       QUICKENING DRAUGHT   a day off their pregnancy a dose (never closer than two hours to due), half a day off a
                            clutch: a needle here, or handed over with their loads from elsewhere. */
  function carryWire(mn){
    const r = rec(mn), p = r && r.prod; if (!p) return undefined;
    const w = birthWords(mn), g = p.preg, e = p.eggs;
    return { preg: g ? { since: g.since, due: g.due, count: g.count || 1, sires: (g.sires || []).slice(0, 6).map(s => sireName(s)) } : null,
      eggs: e ? { n: e.n, layAt: e.layAt, by: e.by ? sireName(e.by) : "" } : null,
      heat: { until: inHeat(p) ? p.heat.until : 0, next: r.naturalHeat && !limitBlocks(mn, "heat") ? (p.nextHeatAt || 0) : 0 },
      open: p.openUntil || 0, litters: (p.offspring && p.offspring.litters) || 0, one: w.one, many: w.many,
      bornSeen: r.dispBornSeen || 0, laidSeen: r.dispLaidSeen || 0 };
  }
  // their hello: what happened away
  function carryHello(mn, m){
    const r = rec(mn); if (!r) return;
    if (!r.dispCarry){ r.dispCarry = true; saveLedger(); }   // (their Dispensary births anywhere: I wait for it when they're away and due)
    const p = prodOf(mn), now = Date.now();
    const B = m.born && typeof m.born === "object" ? m.born : null;
    if (B && Number(B.at) > (r.dispBornSeen || 0) && Number(B.at) <= now + 60000){
      r.dispBornSeen = Number(B.at);
      if (p.preg){
        p.labour = null; p.dueOnMap = 0;
        const mw = Math.max(0, Math.floor(Number(B.midwife) || 0));
        giveBirth(mn, { midwife: mw, helps: Math.max(0, Math.min(50, Number(B.helps) || 0)), away: true });
        p.openUntil = Math.max(0, Number(B.at)) + CFG.BREDBACK_MIN * 60000;   // (wide open for the hour after it, by when it happened)
      }
      saveLedger();
    }
    const Ly = m.laid && typeof m.laid === "object" ? m.laid : null;
    if (Ly && Number(Ly.at) > (r.dispLaidSeen || 0) && Number(Ly.at) <= now + 60000){
      r.dispLaidSeen = Number(Ly.at);
      if (p.eggs){
        const e = p.eggs; p.eggs = null; p.dueOnMap = 0;
        p.offspring.eggs = (p.offspring.eggs || 0) + e.n;
        try { eggsLaid(mn, e.n, false); } catch(err){ warn("eggs laid:", err); }
        if (!L.studbook) L.studbook = [];
        L.studbook.push({ t: Number(Ly.at), dam: mn, sires: [e.by], kids: { male: 0, female: 0, futa: 0 }, eggs: e.n });
        audit(CFG.BOT_MEMBER, "EGGS", mn + " " + e.n + " (away)");
        tell(mn, "🥚 Your clutch is on the books, sugar: " + e.n + " eggs from " + sireName(e.by) + "'s, laid away from the farm.");
      }
      saveLedger();
    }
  }
  // the Quickening Draught: returns what it did ("" when there's nothin' to hurry)
  function quickenBooks(mn, x){
    const p = prodOf(mn); if (!p) return "";
    const now = Date.now(), out = [];
    x = Math.max(1, Math.min(20, Math.round(Number(x) || 1)));
    if (p.preg && !p.labour){
      const step = Math.min(x * 86400000, Math.max(0, p.preg.due - now - 2 * 3600000));
      if (step > 0){ p.preg.due -= step; p.preg.since -= step; out.push("pregnancy hurried along " + (step >= 86400000 ? Math.round(step / 86400000) + " day" + (step >= 1.5 * 86400000 ? "s" : "") : Math.round(step / 3600000) + " hours")); }
    }
    if (p.eggs) { p.eggs.layAt = Math.max(now + 30 * 60000, p.eggs.layAt - x * 12 * 3600000); out.push("the clutch ripens faster"); }
    if (out.length) saveLedger();
    return out.join(", ");
  }
  const QUICKEN_LINES = [
    "%t's belly swells rounder right before everybody's eyes, the litter inside hurried along and growin'.",
    "Warmth floods %t's belly, and it grows, heavier and tighter. They're closer to due now.",
    "%t gasps and cups their belly as it tightens and swells. Whatever's in there's growin' fast.",
  ];
  function quickenLine(mn){ return pickFresh("quicken", QUICKEN_LINES).replace(/%t/g, plainName(mn)); }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __carryWire: (mn) => carryWire(mn), __carryHello: (mn, m) => carryHello(mn, m), __quicken: (mn, x) => quickenBooks(mn, x) });
