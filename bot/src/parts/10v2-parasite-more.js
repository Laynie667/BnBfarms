  /* WHAT'S IN THIS FILE (10v2-parasite-more.js)
     More of the parasite (10v-parasite.js has the lips, the belt, the doses, the craving and the kiss):
     • STRAINS. It latches as one of four, and its gear says which:
         Breeder: fertility, hyper pregnancy, egg laying. Grower: sizes, and it doses every 20 minutes.
         Glutton: drinks the host's milk at every feed and makes them make more.
         Tyrant: the host can't cum while it's on; every orgasm they reach for is eaten and turned into a dose.
     • IT BLOOMS. Lips first; suckers on the teats from hour 4 (they drink milk); a root below from hour 8
       (it drinks loads taken in pussy or ass too). A parasite that came back as a belt blooms the other way up.
     • IT LAYS its own clutch in the host in its last hour. Laid at the nest, those eggs hatch there, and the
       hatchling takes the next person with ?parasite on who steps onto the nest.
     • IT WANTS. Every hour or two an urge: a glory stall, a kiss, a load to swallow. Obeyed: an extra dose.
       Ignored: an hour held at the edge.
     • KIN. The thing in the water knows its own: a host near water is always taken (once in half an hour),
       and it lays double.
     • IT PASSES IN MILK: nursing from a host can pass it on, the same as a kiss (only to somebody with ?parasite on).
     • IT LEAVES A SEED: when it drops off there's a small chance it grows back from inside within a day.
     • IT TALKS THROUGH THEM: that part is in the Companion (now and then a word of theirs comes out as what it wants).
  */
  const PARASITE_SIRE = -7;
  const STRAINS = {
    breeder: { name: "Breeder", serums: ["fertility", "hyper pregnancy", "growth", "egg laying", "fertility", "capacity"], every: 30, can: mn => !limitBlocks(mn, "breed"),
               tell: "It's a BREEDER: it wants you ripe. Fertility, hyper pregnancy, clutches of eggs, over and over, till anything that so much as looks at you leaves you carryin'." },
    grower:  { name: "Grower", serums: ["growth", "growth", "capacity", "growth", "growth", "fertility"], every: 20, can: () => true,
               tell: "It's a GROWER: it feeds you every twenty minutes, and nearly all of it goes to makin' more of you. Tits, cock, balls, ass, round and round, and all of it for keeps." },
    glutton: { name: "Glutton", serums: ["lactation", "udder growth", "lactation", "capacity", "growth", "lactation"], every: 30, can: mn => (makesMilk(mn) && !limitBlocks(mn, "milk")) || makesSemen(mn),
               tell: "It's a GLUTTON: it's as hungry for your milk as for cum. It'll drink you down at every feed, and dose you so you make twice as much for it next time." },
    tyrant:  { name: "Tyrant", serums: ["growth", "fertility", "heat inducer", "growth", "hyper pregnancy", "capacity"], every: 30, can: mn => !/\b(denial|orgasm|edg|ruin)/i.test(rec(mn).limits || ""),
               tell: "It's a TYRANT: you don't cum while it's on you. Every time you get there, it eats it, ruins it, and pays you in serum instead. Twelve hours of that." },
  };
  const strainOf = g => STRAINS[g && g.strain] || STRAINS.grower;
  function pickStrain(mn){ const can = Object.keys(STRAINS).filter(k => STRAINS[k].can(mn)); if (W.__FARMHAND_TEST__ && can.includes(W.__forceStrain)) return W.__forceStrain; return can[Math.floor(Math.random()*can.length)] || "grower"; }
  // which parts of it have grown in: the lips form blooms downward, the belt form upward
  function parasiteParts(g){
    const h = (Date.now() - g.since) / 3600000, stage = h >= CFG.PARASITE_BLOOM_H[1] ? 3 : h >= CFG.PARASITE_BLOOM_H[0] ? 2 : 1;
    return g.form === "belt" ? { stage, root: true, suckers: stage >= 2, lips: stage >= 3 } : strainParts(strainKey(g), stage);   // each strain blooms its own way (10v3-parasite-strains.js)
  }
  const pmLine = (key, mn, v) => tFill(pickFor(mn, "para2:"+key, PARASITE_MORE[key]), mn, v);
  // what their Companion should have on them for it
  function parasiteGear(mn){
    if (CFG.STRAIN_GEAR) return strainGear(mn);   // each strain's own pieces, colour and words, for the body it's on (10v3-parasite-strains.js)
    const r = rec(mn), g = r.parasite, P = parasiteParts(g), S = strainOf(g), out = [], base = { always: true, color: "#E0607F", until: g.until };
    if (P.lips) out.push(Object.assign({ slot: "lips", name: "Parasite Lips", desc: S.name+" strain. Fat, wet, living lips sealed over the mouth, with a tentacle seated down the throat. It feeds its host serum and swallows every load they suck out." }, base));
    if (P.suckers) out.push(Object.assign({ slot: "chestbra", items: ["ForbiddenChastityBra"], name: "Parasite Suckers", desc: S.name+" strain. Two soft pink mouths latched over the teats, sucking in slow greedy pulls. They drink every drop of milk and give something hotter back." }, base));
    if (P.root) out.push(Object.assign({ slot: "belt", name: g.form === "belt" ? "Parasite Belt" : "Parasite Root", desc: S.name+" strain. A band of hot living flesh sealed round the hips, with a thick root pulsing in each hole. It drinks every load they take and pumps its own brew back in." }, base));
    return out;
  }
  // called once when it latches (10v-parasite.js)
  function parasiteBorn(mn){
    const r = rec(mn), g = r.parasite, p = prodOf(mn);
    g.strain = pickStrain(mn); g.stageTold = 1; g.urgeAt = Date.now() + (40 + Math.random()*40)*60000;
    g.next = Date.now() + strainOf(g).every*60000;
    strainBorn(mn);   // what it does to this body from the first minute (10v3-parasite-strains.js)
    r.parasiteSeed = 0;
    saveLedger();
    later(() => { if (parasiteOn(mn)) tell(mn, "👄 "+strainTell(mn)); }, 9000);
  }
  // called when it comes off, however it comes off
  function parasiteGone(mn, g, how){
    const r = rec(mn), p = prodOf(mn);
    if (g && g.strain === "tyrant" && p) p.deniedUntil = Math.min(p.deniedUntil || 0, Date.now());
    strainGoneMore(mn, g);   // a Weaver's cocoon comes off with it (10v6)
    if (how === "done" && r.parasiteOn && Math.random() < CFG.PARASITE_SEED_CHANCE) r.parasiteSeed = Date.now() + (2 + Math.random()*18)*3600000;
  }
  // every heartbeat, for each host that's here
  function parasiteMoreTick(mn, r, now){
    const g = r.parasite, P = parasiteParts(g), p = prodOf(mn);
    // it blooms
    if (P.stage > (g.stageTold || 1)){
      g.stageTold = P.stage; saveLedger();
      const grew = g.form === "belt" ? (P.stage === 2 ? "suckers" : "lipsLate") : bloomWhat(g, P.stage);
      emote("👄 "+pmLine(PARASITE_MORE[strainKey(g)+"_bloom_"+grew] ? strainKey(g)+"_bloom_"+grew : "bloom_"+grew, mn), mn); arouse(mn, 20); syncCompanions(true);
      { const st = P.stage; later(() => { if (parasiteOn(mn)) tell(mn, "👄 "+strainBloomTell(mn, st)); }, 7000); }
    }
    strainTick(mn, r, now);   // the Breeder's first clutch, the Tyrant's edges (10v3-parasite-strains.js)
    // it lays, in its last hour
    if (!g.laid && g.until - now < 3600000 && !limitBlocks(mn, "eggs")){
      g.laid = true;
      const [lo, hi] = CFG.EGG_COUNT, n0 = lo + Math.floor(Math.random()*(hi - lo + 1));
      layClutch(mn, n0, PARASITE_SIRE); p.eggs.para = true;
      emote("🥚 "+pmLine("lay", mn), mn);
      tell(mn, "🥚 The parasite's laid its own clutch in you before it goes, sugar. Lay them at the nest and one'll hatch there, lookin' for somebody new.");
      saveLedger(); syncCompanions(true);
    }
    // it wants
    if (g.urge && now > g.urge.until){
      g.urge = null; g.urgeAt = now + (60 + Math.random()*60)*60000;
      p.deniedUntil = Math.max(p.deniedUntil || 0, now + CFG.PARASITE_URGE_PUNISH_MIN*60000);
      privateLine(mn, pmLine(PARASITE_MORE[strainKey(g)+"_urgeFail"] ? strainKey(g)+"_urgeFail" : "urgeFail", mn), "emote"); arouse(mn, 40, 94); saveLedger(); syncCompanions(true);
    } else if (g.urge && g.urge.kind === "glory" && Object.keys(L.spots || {}).some(n => /^glory-\d+$/.test(n) && onSpot(mn, n, 0))) parasiteUrgeDone(mn, "glory");
    else if (g.urge && g.urge.kind === "nest" && nestSpots().some(n => onSpot(mn, n, 0))) parasiteUrgeDone(mn, "nest");
    else if (g.urge && g.urge.kind === "water" && waterSpots().some(([n]) => onSpot(mn, n, 1))) parasiteUrgeDone(mn, "water");   // (the Deep: 10v6)
    else if (g.urge && g.urge.kind === "kneel" && kneelingNow(mn)){ g.urge.knelt = (g.urge.knelt || 0) + 1; if (g.urge.knelt >= 3) parasiteUrgeDone(mn, "kneel"); else saveLedger(); }   // (three heartbeats on their knees, a minute or so)
    else if (!g.urge && now >= (g.urgeAt || 0) && !quietNow(mn) && !heldByTrap(mn) && !r.benched && !r.penned && !(p && p.stall)){
      const kinds = urgeKinds(mn, g, P);
      if (!kinds.length){ g.urgeAt = now + 30*60000; return; }
      const kind = kinds[Math.floor(Math.random()*kinds.length)], mins = URGE_MINS[kind] || 10;
      g.urge = { kind, until: now + mins*60000 }; saveLedger();
      privateLine(mn, pmLine(PARASITE_MORE[strainKey(g)+"_urge_"+kind] ? strainKey(g)+"_urge_"+kind : "urge_"+kind, mn), "emote");
      tell(mn, "👄 It wants somethin', sugar: "+urgeAsk(mn, kind)+", inside "+mins+" minutes. Do it and it'll be sweet to you. Don't, and it'll hold you at the edge for an hour.");
      if (kind === "beg") try { syncCompanions(); } catch(e){}   // its Say it button (10ui-say.js)
    }
  }
  // WHAT EACH STRAIN WANTS (Laynie, Oct 14: "lets do the parasites"). They all used to want the same three things. Now:
  //   Breeder  bred (a load in pussy or ass), a kiss, the nest
  //   Grower   a load swallowed, a milkin', a glory stall
  //   Glutton  a milkin', a load swallowed, a glory stall
  //   Tyrant   on your knees, beggin' out loud, a kiss
  // Each only if it can be done: no swallowin' without its lips on them, no milkin' for somebody who makes nothin',
  // no nest or glory stall the farm hasn't got, no breedin' past a limit that rules it out.
  const STRAIN_URGES = { breeder: ["bred", "kiss", "nest"], grower: ["swallow", "milked", "glory"], glutton: ["milked", "swallow", "glory"], tyrant: ["kneel", "beg", "kiss"] };
  const URGE_MINS = { swallow: 15, bred: 15, milked: 15, nest: 10, glory: 10, kiss: 10, kneel: 10, beg: 10 };
  function urgeKinds(mn, g, P){
    const glory = Object.keys(L.spots || {}).some(n => /^glory-\d+$/.test(n));
    return (STRAIN_URGES[strainKey(g)] || ["kiss", "swallow", "glory"]).filter(k =>
      k === "swallow" ? !!P.lips && !holeBlocked(mn, "mouth") :
      k === "glory"   ? glory :
      k === "nest"    ? nestSpots().length > 0 :
      k === "water"   ? waterSpots().length > 0 :
      k === "bred"    ? !limitBlocks(mn, "breed") :
      k === "milked"  ? (makesMilk(mn) && !limitBlocks(mn, "milk")) || makesSemen(mn) :
      true);
  }
  // what they're told to do, for the body they've got
  function urgeAsk(mn, kind){
    const v = hasVulva(mn);
    return { kiss: "kiss somebody on the mouth", swallow: "swallow a load", glory: "get yourself into a glory stall", nest: "go and settle yourself in the nest",
             bred: v ? "take a load in your pussy or your ass" : "take a load up your ass",
             milked: makesMilk(mn) && !limitBlocks(mn, "milk") ? "get yourself milked" : "get your cock milked",
             kneel: "get down on your knees and stay there", water: "go and get yourself in the water", beg: "beg for it, out loud, where folks can hear you" }[kind] || "do as it says";
  }
  // on their knees (or all fours) in the game right now
  function kneelingNow(mn){ const C = charFor(mn); if (!C) return false; const a = [].concat(C.ActivePose || [], C.Pose || []); return a.some(p => /^(Kneel|KneelingSpread|AllFours)$/.test(String(p))); }
  // a line in the room from them: the Tyrant wanted beggin'
  const BEG_WORDS = /\b(please|plea+se|beg|begging|beggin'?|pretty please|i need (it|you|this|to)|let me cum|need to cum|have mercy|mercy)\b/i;
  function parasiteHeard(mn, text){ const g = rec(mn) && rec(mn).parasite; if (g && g.urge && g.urge.kind === "beg" && BEG_WORDS.test(String(text))) return parasiteUrgeDone(mn, "beg"); return false; }
  function parasiteUrgeDone(mn, kind){
    const r = rec(mn), g = r && r.parasite;
    if (!g || !g.urge || g.urge.kind !== kind || !parasiteOn(mn)) return false;
    g.urge = null; g.urgeAt = Date.now() + (60 + Math.random()*60)*60000; saveLedger();
    const k = strainKey(g)+"_urgeDone";
    later(() => { if (parasiteOn(mn)){ parasiteDose(mn, 1, pmLine(PARASITE_MORE[k] ? k : "urgeDone", mn)); arouse(mn, 25); } }, 5000);
    return true;
  }
  // after each regular feed: the suckers (or a Glutton, from the start) drink their milk
  function parasiteAfterDose(mn){
    const r = rec(mn), g = r.parasite, p = prodOf(mn);
    g.drinking = true; try { afterDoseDrink(mn, r, g, p); } finally { g.drinking = false; }   // (its own drinkin' isn't the milkin' it asked them to go and get)
  }
  function afterDoseDrink(mn, r, g, p){
    strainAfterDose(mn);   // the Glutton's sleeve (10v3-parasite-strains.js)
    if (!(parasiteParts(g).suckers || g.strain === "glutton") || !makesMilk(mn) || p.milk < 20) return;
    const got = drainMilk(mn, p.milk * (g.strain === "glutton" ? 0.8 : 0.4));
    if (got < 5) return;
    g.drunk = (g.drunk || 0) + got;
    emote("👄 "+pmLine("drink", mn, { ml: ml(got) }), mn);
    if (g.strain === "glutton") addBoost(p, "milk", 6*3600000, 1);
    saveLedger();
  }
  // a Tyrant eats what they reach for
  function parasiteClimax(mn){
    const r = rec(mn), g = r && r.parasite;
    if (!g || !parasiteOn(mn)) return;
    if (g.strain === "gloss") return glossClimax(mn, g);   // a Gloss wants it, and pays for it (10v6)
    if (g.strain !== "tyrant") return;
    const now = Date.now(); if (now - (g.ateAt || 0) < 60000) return;
    g.ateAt = now; g.eaten = (g.eaten || 0) + 1;
    parasiteDose(mn, 1, pmLine("tyrant", mn));
  }
  // nursing from a host: it passes in milk
  function parasiteNurse(host, drinker){
    try {
      if (!parasiteOn(host) || parasiteOn(drinker) || host === drinker) return;
      const r = rec(drinker);
      if (!r || !r.parasiteOn || (r.parasiteNext || 0) > Date.now() || /\bparasit/i.test(r.limits || "")) return;
      if (Math.random() >= CFG.PARASITE_KISS_CHANCE*dangerX(drinker).chance) return;
      emote("👄 "+tFill(pickFor(host, "para2:nurse", PARASITE_MORE.nurse), host, { c: plainName(drinker) }), drinker);
      later(() => { if (charFor(drinker) && !parasiteOn(drinker)) parasiteLatch(drinker, "nursed from "+host); }, 3000);
    } catch(e){ warn("parasite nurse:", e); }
  }
  // the seed it left, and the hatchling at the nest (called once a heartbeat)
  function parasiteWorldTick(now){
    for (const [k, r] of Object.entries(L.people)){
      if (!r.parasiteSeed || now < r.parasiteSeed) continue;
      const mn = parseInt(k, 10);
      if (!charFor(mn)) continue;                                  // it waits till they're here
      r.parasiteSeed = 0;
      if (!r.parasiteOn || parasiteOn(mn) || /\bparasit/i.test(r.limits || "")){ saveLedger(); continue; }
      emote("👄 "+pmLine("regrow", mn), mn);
      parasiteLatch(mn, "grew back");
    }
    if (L.nestBrood > 0){
      for (const C of (W.ChatRoomCharacter || [])){
        const mn = C.MemberNumber, r = rec(mn);
        if (mn === CFG.BOT_MEMBER || !r || !r.parasiteOn || parasiteOn(mn) || (r.parasiteNext || 0) > now || /\bparasit/i.test(r.limits || "")) continue;
        if (!nestSpots().some(n => onSpot(mn, n, 0))) continue;
        L.nestBrood--; saveLedger();
        emote("🥚 "+pmLine("hatch", mn), mn);
        later(() => { if (charFor(mn) && !parasiteOn(mn)) parasiteLatch(mn, "hatched at the nest"); }, 3000);
        break;
      }
    }
  }
  // the thing in the water knows its own
  function parasiteKin(mn, now){
    const r = rec(mn);
    if (!parasiteOn(mn) || now - (r.kinAt || 0) < (strainKey(r.parasite) === "deep" ? CFG.DEEP_KIN_MIN : 30)*60000) return false;   // (the Deep is kin twice over: 10v6)
    r.kinAt = now; return true;
  }

  const PARASITE_MORE = {
    bloom_suckers: [
      "The parasite on %n ripples and spreads. Two soft pink buds push out of it, crawl down over their chest, and close over both nipples like little wet mouths. They start to suck.",
      "%n gasps. The thing on them has grown: a pair of fleshy cups have latched onto their teats and are pullin' in a slow, greedy rhythm, drinkin' whatever comes.",
      "It's bloomin'. Thin pink tendrils trail across %n's skin to their tits and swell at the tips into suckers that seal on tight and begin to nurse."],
    bloom_root: [
      "The parasite isn't done growin'. A thick strand of it slides down %n's belly, wraps their hips in a hot wet band, and pushes a fat root up into each hole below. %n's knees buckle.",
      "{nv}It's found the rest of %n. A sash of livin' flesh knots itself round their hips, and one slow thick tendril works its way up their ass and settles there, pulsin'.",
      "{v}It's found the rest of %n. A sash of livin' flesh knots itself round their hips, and two slow thick tendrils work their way up inside, front and back, and settle there, pulsin'.",
      "{v}%n feels it creep lower, and lower, and then it's between their legs, sealin' over them, rootin' up into their cunt and their ass both. Lips, teats and holes: it has all of them now.",
      "{nv}%n feels it creep lower, and lower, and then it's between their legs, sealin' over them, rootin' slow and deep up their ass. Mouth, nipples and hole: it has every one of them now."],
    bloom_lipsLate: [
      "The belt on %n sends a pink runner up their body, over their chest and throat. It reaches their mouth, flattens, and seals over their lips, and a tendril slides down their throat. It has all of them now.",
      "The last of it blooms: a wet pink mouth closes over %n's own, plump and shinin', and somethin' long and soft feeds itself past their tongue. Lips, teats and holes, every one taken."],
    lay: [
      "The parasite goes still, and then every root of it swells at once. %n feels eggs bein' pushed into them, small and slick and many, wherever it's buried: its own clutch, left in the host before it goes.",
      "Somethin' is comin' down the tendril in %n. They feel the first egg pass, then a string of them, pumped in slow and packed down deep. It's makin' sure there'll be more of it.",
      "It lays in %n without any fuss at all, a soft steady pulse and a growin' weight low in their belly. By the time they understand what it's doin', it's done."],
    hatch: [
      "One of the eggs in the nest splits with a wet little crack as %n steps in. Somethin' pink and quick uncoils from it and goes straight up their leg.",
      "The nest was not empty. A shell rocks, opens, and a small glistenin' thing pours itself out, tastes the air, and leaps at %n's face."],
    regrow: [
      "%n coughs, and somethin' moves in their throat that isn't a cough. The parasite left a piece of itself behind, and it's been growin'. Pink flesh wells up over their tongue and seals across their lips from the inside.",
      "It never really left %n. Somewhere deep in them a seed of it has been swellin' all day, and now it climbs: up, out, and over, bloomin' back into the same fat wet lips as before."],
    urge_kiss: [
      "The thing on you throbs, and a want that isn't yours rises up through it: a mouth. Somebody's mouth on yours. It wants to taste another one.",
      "It tugs at your lips from the inside. It wants to be kissed, deep and wet, by somebody who doesn't know what they're kissin'."],
    urge_swallow: [
      "It's hungry. The root in your throat flexes, and your mouth floods. It wants a cock, and what comes out of one, and it wants it soon.",
      "A hollow ache opens under your tongue and spreads. The parasite wants feedin': a hot load, straight from the source."],
    urge_glory: [
      "A picture comes into your head and stays there: the glory stalls, the holes in the boards, all those cocks. It knows where the food is, and it wants you kneelin' there.",
      "It pulls at you like a leash. The stalls. Go to the stalls and get on your knees. It'll make it worth your while."],
    urgeDone: [
      "The parasite shivers with pleasure at gettin' its way, squeezes %n everywhere it touches, and pumps them a long, sweet, generous dose.",
      "It got what it wanted, and it's grateful. A warm rush of serum floods into %n, thick and slow, like bein' kissed from the inside.",
      "Good host. The thing on %n purrs against their skin and pays them: a deep, hot, lingerin' dose."],
    urgeFail: [
      "You didn't do it. The parasite goes cold and tight on you, and then it starts to stroke, exactly where it'll hurt most, and stops. It's goin' to keep you right there for an hour.",
      "It gave you a simple thing to do. Now it winds you up, slow and cruel, to the very edge, and holds you. No. Not for an hour. That's what disobeyin' costs."],
    drink: [
      "The suckers on %n's teats clamp down and pull, hard and long. %ml of milk goes straight into the parasite, and it flushes a deep, satisfied rose.",
      "%n moans as the thing nurses them: deep greedy draws at both nipples, %ml drunk down in a minute. It leaves them tinglin' and already fillin' again.",
      "The parasite drinks. %n can feel the milk leavin' them in thick pulses, %ml of it, and the soft wet mouths on their tits squeezin' for more."],
    tyrant: [
      "%n starts to cum, and the parasite takes it. Every root and sucker clamps tight at the very top, and the orgasm just drains out of them, ruined, swallowed. What it gives back is a dose.",
      "Right at the peak the thing on %n squeezes, and the pleasure is gone, sucked out of them like marrow from a bone. %n sobs. The parasite hums, fed, and pumps them full of serum instead.",
      "It lets %n climb all the way up, and then it eats what's at the top. They're left twitchin' and empty with a hot dose spreadin' in their belly where the cummin' should have been."],
    nurse: [
      "%c draws on %n's teat, and somethin' that isn't milk comes with it: a little slick knot of pink that slips over their tongue before they can spit.",
      "The milk %c is swallowin' from %n has a thread of the parasite in it. It goes down easy. It doesn't stay down."],
    kin: [
      "The thing in the water rises slow this time, almost careful. One thin arm reaches out and touches the parasite on %n, and both of them shiver. It knows its own.",
      "It comes up out of the water for %n without any hurry at all, and the parasite on them strains toward it like a pup toward its mother. This isn't an attack. It's a visit.",
      "The water opens for %n. A tentacle strokes the livin' flesh sealed on them, tip to tip, tastin', and then the rest of it comes to do what kin does: add to the brood."],
  };
