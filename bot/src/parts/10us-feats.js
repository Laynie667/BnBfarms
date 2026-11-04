  /* WHAT'S IN THIS FILE (10us-feats.js)
     FEATS AND PERKS (Laynie, Nov 3–4: perks by category, tiers that stack and accumulate, credit for the past, Trap Magnet as
     it is, a Gold Star track for littles, and an egg-layin' track "potentially at a penalty to how much they earn ribbon
     wise. cant have them exploiting the tentacle traps").
     • TRACKS: each counts somethin' the farm already keeps, five tiers each. A new tier is a feat: announced in the farm's
       voice, and a stingy handful of ribbons (the tier's number). The perk that goes with the track grows with every tier,
       on its own, no slots. ?perks off <perk> switches one off (and on again) if you'd rather not have it workin'.
     • THE PAST COUNTS: the first time the farm looks, every tier somebody's totals already earn is theirs, quietly, in one
       message (no ribbons for the back-pay: the purse stays stingy).
     • ?feats · ?feats <who> · ?perks · ?perks off|on <perk>. The Companion's 🏅 Feats tab shows the bars.
     • The nursery's Gold stars track is private like everything in the nursery: only the little sees it, and only nursery
       folk ever hear about it.
     The perks reach the rest of the farm through the small perk… functions at the bottom (milk, capacity, breedin', eggs,
     loads, traps, quota grace, the store, bets, kryptonite rumours, nursery stars).
  */
  const FEATS = [
    { key: "dairy", icon: "🥛", name: "Dairy", unit: "L milked", tiers: [10, 50, 150, 400, 1000], count: (mn) => (prodOf(mn).totals.milked || 0) / 1000,
      perk: "Heavy Udders", desc: (t) => "+" + 5 * t + "% milk capacity" + (t >= 3 ? ", and your milk grades a step higher" : "") },
    { key: "breeding", icon: "🐂", name: "Breeding stock", unit: "L of seed taken", tiers: [1, 4, 10, 25, 60], count: (mn) => (prodOf(mn).totals.received || 0) / 1000,
      perk: "Breeder's Belly", desc: (t) => "+" + 4 * t + "% fertility and " + 100 * t + " mL more room" },
    { key: "mother", icon: "🍼", name: "Motherhood", unit: "litters", tiers: [1, 3, 6, 12, 25], count: (mn) => (prodOf(mn).offspring || {}).litters || 0,
      perk: "Good Mother", desc: (t) => "pregnancy " + 5 * t + "% shorter" + (t >= 5 ? ", and twins far likelier" : "") },
    { key: "eggs", icon: "🥚", name: "Egg layer", unit: "eggs laid", tiers: [10, 50, 150, 400, 1000], count: (mn) => (prodOf(mn).offspring || {}).eggs || 0,
      perk: "Prolific Layer", desc: (t) => "clutches " + 10 * t + "% bigger and " + 8 * t + "% quicker to come, but your eggs fetch " + 15 * t + "% fewer ribbons at market" },
    { key: "stud", icon: "💦", name: "Stud", unit: "covers", tiers: [10, 50, 150, 400, 1000], count: (mn) => prodOf(mn).totals.covers || 0,
      perk: "Prize Stud", desc: (t) => "loads " + 5 * t + "% bigger" + (t >= 4 ? ", and likelier to catch" : "") },
    { key: "trapped", icon: "🪤", name: "Trapped", unit: "traps sprung", tiers: [10, 40, 100, 250, 600], count: (mn) => (rec(mn) || {}).trapN || 0,
      perk: "Trap Magnet", desc: (t) => "traps find you " + 10 * t + "% more often" + (t >= 3 ? ", and now and then one pays you a ribbon" : "") },
    { key: "worker", icon: "📋", name: "Hard worker", unit: "day quota streak (your best)", tiers: [3, 7, 14, 30, 60], count: (mn) => { const r = rec(mn) || {}; return Math.max(r.quotaBest || 0, r.quotaStreak || 0); },
      perk: "Reliable", desc: (t) => (t >= 2 ? (t >= 4 ? "two" : "one") + " free quota grace a week" : "nothin' yet (a free quota grace comes at II)") + (t >= 5 ? ", and a ribbon more for milk a day" : "") },
    { key: "favourite", icon: "🎀", name: "Farm favourite", unit: "ribbons earned", tiers: [25, 100, 250, 600, 1500], count: (mn) => (rec(mn) || {}).ribbonsEver || 0,
      perk: "Favourite", desc: (t) => 2 * t + "% off at the store (on things over a ribbon)" },
    { key: "mischief", icon: "🗝️", name: "Mischief", unit: "bits of mischief", tiers: [1, 5, 15, 40, 100], count: (mn) => { const m = (rec(mn) || {}).mischief || {}; return (m.krypto || 0) + (m.bets || 0) + (m.coax || 0); },
      perk: "Sharp Eyes", desc: (t) => (t >= 2 ? "sharper kryptonite rumours, " : "") + "bets pay " + (2 + 0.1 * t).toFixed(1) + " times" },
    { key: "goldstar", icon: "⭐", name: "Gold stars", unit: "gold stars", tiers: [5, 20, 50, 120, 300], count: (mn) => ((rec(mn) || {}).nursery || {}).starsEver || 0, nursery: true,
      perk: "Gold Star Little", desc: (t) => (t >= 2 ? "+" + (t >= 4 ? 2 : 1) + " star" + (t >= 4 ? "s" : "") + " a day" : "nothin' yet (an extra star a day comes at II)") + (t >= 3 ? ", and stars come easier" : "") },
  ];
  const TIER_NAME = ["", "I", "II", "III", "IV", "V"];
  const FEAT_LINES = [
    "🏅 %n earns a feat: %f %t. %why The farm's noticed. %p",
    "🏅 Somebody chalks it on the barn door: %n, %f %t. %why %p",
    "🏅 The farm girl rings the bell for %n: %f %t! %why %p",
    "🏅 %n's made %f %t, and the whole barn hears about it. %why %p",
  ];
  const trackFor = (mn, F) => !F.nursery || ((rec(mn) || {}).nursery || {}).role === "little";
  function featTierOf(F, n){ let t = 0; for (let i = 0; i < F.tiers.length; i++) if (n >= F.tiers[i]) t = i + 1; return t; }
  const fmt = (n) => (n >= 100 || Number.isInteger(n) ? Math.floor(n) : Math.floor(n * 10) / 10);
  // a perk's level: its track's tier, unless they've switched it off
  function perkLv(mn, key){ const r = rec(mn); if (!r || !r.feats || (r.perksOff || []).includes(key)) return 0; return r.feats[key] || 0; }
  // look at somebody's totals: any new tier is a feat (quiet: the first look, the past counted)
  function featCheck(mn, quiet){
    const r = rec(mn); if (!r || !(r.roles || []).length) return [];
    const first = !r.feats; r.feats = r.feats || {};
    if (r.ribbonsEver == null) r.ribbonsEver = r.ribbons || 0;   // (ribbons were never counted before Nov 4: the purse they hold is the start)
    const got = [];
    for (const F of FEATS){
      if (!trackFor(mn, F)) continue;
      let n = 0; try { n = F.count(mn); } catch(e){ continue; }
      const t = featTierOf(F, n), was = r.feats[F.key] || 0;
      if (t > was){ r.feats[F.key] = t; for (let k = was + 1; k <= t; k++) got.push({ F, t: k }); }
    }
    if (!got.length){ if (first) saveLedger(); return got; }
    saveLedger(); syncCompanions(true);
    if (first || quiet){
      if (got.length) tell(mn, "🏅 The farm's been keepin' count, sugar, and some of it's already yours: " + bestOf(got).map(g => g.F.icon + " " + g.F.name + " " + TIER_NAME[g.t] + " (" + g.F.perk + ")").join(", ") + ". Your perks are workin' already. ?feats shows the lot.");
      return got;
    }
    for (const g of got){
      const why = "(" + g.F.tiers[g.t - 1] + " " + g.F.unit + ")", perk = g.F.perk + " grows: " + g.F.desc(g.t) + ".";
      if (g.F.nursery){ if (typeof nurseryTell === "function") nurseryTell(mn, "⭐ " + plainName(mn) + "'s earned a gold-star feat: " + g.F.name + " " + TIER_NAME[g.t] + "! " + perk); }
      else if (charFor(mn)) emote(pickFresh("feat", FEAT_LINES).replace(/%n/g, plainName(mn)).replace(/%f/g, g.F.icon + " " + g.F.name).replace(/%t/g, TIER_NAME[g.t]).replace(/%why/g, why).replace(/%p/g, perk), mn);
      else tell(mn, "🏅 A feat: " + g.F.icon + " " + g.F.name + " " + TIER_NAME[g.t] + " " + why + ". " + perk);
      earnRibbons(mn, g.t, "the " + g.F.name + " " + TIER_NAME[g.t] + " feat", CFG.BOT_MEMBER);
    }
    return got;
  }
  const bestOf = (got) => { const m = new Map(); for (const g of got) if (!m.has(g.F.key) || m.get(g.F.key).t < g.t) m.set(g.F.key, g); return [...m.values()]; };
  function featsTick(){
    const now = Date.now(); if (now - (state.featsAt || 0) < 120000) return; state.featsAt = now;
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber; if (mn === CFG.BOT_MEMBER) continue;
      try { featCheck(mn); reliableTick(mn, now); } catch(e){ warn("feats:", e); }
    }
  }
  // Reliable: a free quota grace once (or twice) a week
  function reliableTick(mn, now){
    const r = rec(mn), t = perkLv(mn, "worker"); if (!r || t < 2) return;
    const wk = weekKey(), per = t >= 4 ? 2 : 1;
    if (!r.graceGift || r.graceGift.wk !== wk) r.graceGift = { wk, n: 0 };
    if (r.graceGift.n >= per || (r.quotaGrace || 0) >= 2) return;
    r.graceGift.n++; r.quotaGrace = (r.quotaGrace || 0) + 1; saveLedger();
    tell(mn, "📋 Reliable: the farm's put a quota grace in your pocket for the week, sugar (" + r.quotaGrace + " held).");
  }
  function featsText(mn, asker){
    const r = rec(mn); if (!r || !(r.roles || []).length) return plainName(mn) + " isn't on the books, sugar.";
    if (!r.feats) featCheck(mn, true);
    const self = mn === asker, nurseryOk = self || (typeof nurseryOn === "function" && nurseryOn(asker));
    const rows = FEATS.filter(F => trackFor(mn, F) && (!F.nursery || nurseryOk)).map(F => {
      let n = 0; try { n = F.count(mn); } catch(e){}
      const t = r.feats[F.key] || 0, next = F.tiers[t], off = (r.perksOff || []).includes(F.key);
      return F.icon + " " + F.name + " " + (t ? TIER_NAME[t] : "–") + " · " + fmt(n) + (next ? " of " + next : "") + " " + F.unit + (t ? "\n    " + F.perk + (off ? " (switched off)" : "") + ": " + F.desc(t) : "");
    });
    const titles = titleNames(mn);
    return "🏅 " + (self ? "YOUR FEATS" : plainName(mn).toUpperCase() + "'S FEATS") + "\n" + rows.join("\n") + (titles.length ? "\n🎖️ Titles: " + titles.join(" · ") : "") + (self ? "\n\n?perks off <perk> switches one off." : "");
  }
  function featsCommand(cmd, sender, args, R){
    const r = rec(sender);
    if (cmd === "feats" || cmd === "feat" || cmd === "achievements"){
      const t = args[0] ? resolveTarget(args[0]) : sender;
      if (!t || !rec(t)){ R("Whose feats, sugar? ?feats <who>, or just ?feats for yours."); return; }
      R(featsText(t, sender)); return;
    }
    // ?perks · ?perks off|on <perk>
    if (!r || !(r.roles || []).length){ R("Perks are for folks on the books, sugar."); return; }
    if (!r.feats) featCheck(sender, true);
    const a0 = String(args[0] || "").toLowerCase(), name = args.slice(1).join(" ").toLowerCase();
    if (a0 === "off" || a0 === "on"){
      const F = FEATS.find(F => F.key === name || F.perk.toLowerCase() === name || F.name.toLowerCase() === name || F.perk.toLowerCase().startsWith(name) && name.length >= 3);
      if (!F){ R("Which perk, sugar? " + FEATS.filter(F => trackFor(sender, F)).map(F => F.perk).join(", ") + "."); return; }
      r.perksOff = (r.perksOff || []).filter(k => k !== F.key); if (a0 === "off") r.perksOff.push(F.key);
      saveLedger(); syncCompanions(true); R("🏅 " + F.perk + ": " + (a0 === "off" ? "switched off. It stays earned; ?perks on " + F.perk + " brings it back." : "on again.")); return;
    }
    const mine = FEATS.filter(F => trackFor(sender, F) && (r.feats[F.key] || 0) > 0);
    R("🏅 YOUR PERKS\n" + (mine.length ? mine.map(F => F.icon + " " + F.perk + " " + TIER_NAME[r.feats[F.key]] + ((r.perksOff || []).includes(F.key) ? " (off)" : "") + ": " + F.desc(r.feats[F.key])).join("\n") : "None yet, sugar. ?feats shows how close you are.") + "\n\n?perks off <perk> · ?perks on <perk>");
  }
  // what the Companion's 🏅 Feats tab shows (only ever to the one it's about)
  function featsStateFor(mn, s){
    const r = rec(mn); if (!r || !(r.roles || []).length) return;
    if (!r.feats) featCheck(mn, true);
    s.feats = { tracks: FEATS.filter(F => trackFor(mn, F)).map(F => { let n = 0; try { n = F.count(mn); } catch(e){} const t = r.feats[F.key] || 0;
      return { key: F.key, icon: F.icon, name: F.name, tier: t, n: fmt(n), next: F.tiers[t] || null, prev: t ? F.tiers[t - 1] : 0, unit: F.unit, perk: F.perk, desc: t ? F.desc(t) : F.desc(1).replace(/^/, "at I: "), off: (r.perksOff || []).includes(F.key) }; }),
      titles: titleNames(mn) };
  }

  // ── the perks, where the rest of the farm asks ──
  const perkMilkX = (mn) => 1 + 0.05 * perkLv(mn, "dairy");
  const perkGrade = (mn) => (perkLv(mn, "dairy") >= 3 ? 8 : 0);
  const perkCap = (mn) => 100 * perkLv(mn, "breeding");
  const perkFertX = (mn) => 1 + 0.04 * perkLv(mn, "breeding");
  const perkPregX = (mn) => 1 - 0.05 * perkLv(mn, "mother");
  const perkTwins = (mn) => (perkLv(mn, "mother") >= 5 ? 0.2 : 0);
  const perkEggX = (mn) => 1 + 0.1 * perkLv(mn, "eggs");
  const perkEggDaysX = (mn) => 1 - 0.08 * perkLv(mn, "eggs");
  const perkEggPayX = (mn) => Math.max(0.25, 1 - 0.15 * perkLv(mn, "eggs"));
  const perkLoadX = (mn) => 1 + 0.05 * perkLv(mn, "stud");
  const perkCatchX = (mn) => { const t = perkLv(mn, "stud"); return t >= 5 ? 1.2 : t >= 4 ? 1.1 : 1; };
  const perkTrapX = (mn) => 1 + 0.1 * perkLv(mn, "trapped");
  const perkMilkRibbon = (mn) => (perkLv(mn, "worker") >= 5 ? 1 : 0);
  function perkPrice(mn, price){ const t = perkLv(mn, "favourite"); return !t || !(price > 1) ? price : Math.max(1, Math.round(price * (1 - 0.02 * t))); }
  const perkBetX = (mn) => 2 + 0.1 * perkLv(mn, "mischief");
  const perkHintLetters = (mn) => { const t = perkLv(mn, "mischief"); return t >= 4 ? 3 : t >= 2 ? 2 : 1; };
  const perkStars = (mn) => { const t = perkLv(mn, "goldstar"); return t >= 4 ? 2 : t >= 2 ? 1 : 0; };
  const perkStarChance = (mn) => (perkLv(mn, "goldstar") >= 3 ? 0.1 : 0);
  // a trap sprung on somebody with Trap Magnet III+: now and then it pays a ribbon
  function perkTrapPay(mn){ const t = perkLv(mn, "trapped"); if (t >= 3 && Math.random() < (t >= 5 ? 0.35 : 0.2)) later(() => earnRibbons(mn, 1, "bein' the farm's favourite bait (Trap Magnet)"), 2500); }
  // a bit of mischief, for the Mischief track
  function mischief(mn, k){ const r = rec(mn); if (!r) return; r.mischief = r.mischief || {}; r.mischief[k] = (r.mischief[k] || 0) + 1; }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __featCheck: (m, q) => featCheck(m, q), __featsTick: () => { state.featsAt = 0; featsTick(); }, __perkLv: (m, k) => perkLv(m, k), __perkPrice: (m, p) => perkPrice(m, p), __perks: { perkMilkX, perkCap, perkFertX, perkPregX, perkEggX, perkEggDaysX, perkEggPayX, perkLoadX, perkCatchX, perkTrapX, perkBetX, perkStars, perkHintLetters } });
