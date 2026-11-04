  /* WHAT'S IN THIS FILE (10v6-parasite-strains-more.js)
     FOUR MORE STRAINS, AND FULLER OUTFITS FOR ALL EIGHT (Laynie, Oct 27: "I think the parasites would benefit from more
     strains and fuller outfits to spread into"). Like the first four (10v3-parasite-strains.js), each blooms in its own
     order, wears its own colour, brews for the body it's on, wants its own things, and does one thing none of the
     others do:
       OOZER (slime green)  lips → a root at hour 4 → suckers at hour 8. It slimes its host at every feed (a real slime
                            mess, with "Farm can mark my body") and keeps every hole slick and stretchin'. It spreads
                            as livin' slime: gloves, then stockings and the legs, then the whole body.
       WEAVER (pale silk)   lips → suckers at hour 4 → a root at hour 8. It spins: silk gloves and a silk harness, then
                            stockings, and every hour or so from hour 4 it cocoons its host's arms for a few minutes
                            and teases them while they hang there.
       DEEP (sea green)     lips and a tentacle tail from the first minute → a root at hour 4 → suckers and a tentacle
                            embrace over the body at hour 8. From hour 4 it pumps brine in at every feed, so they're
                            always sloshin'. Kin to the thing in the water, which comes for them twice as often, and
                            it wants them in the water.
       GLOSS (black rubber) lips and rubber gloves from the first minute → suckers, stockings and rubber legs at hour
                            4 → a root, the whole catsuit, elbow gloves and heels at hour 8. It WANTS them to cum: it
                            drinks every climax and pays a dose for it, squeezes them up between feeds, and keeps
                            them glossy and clean.
     And the first four spread further now: a tendril of a tail at hour 4, and sleeves and stockings of livin' flesh at
     hour 8, each in its own colour. All of it real clothes on their character (the parasite's own switch is the say-so),
     and what they had on goes back after.
  */
  if (CFG.WEAVER_COCOON_MIN === undefined) Object.assign(CFG, { WEAVER_COCOON_MIN: 60, WEAVER_COCOON_LEN: 3, GLOSS_SQUEEZE_MIN: 20, DEEP_BRINE_ML: 60, DEEP_KIN_MIN: 15 });
  if (CFG.STRAIN_FEED_CHANCE === undefined) CFG.STRAIN_FEED_CHANCE = 0.4;
  Object.assign(STRAIN_COLOR, { oozer: "#5FAE3A", weaver: "#EDE6D6", deep: "#2E8B7A", gloss: "#121214" });
  const strainLim = mn => String((rec(mn) || {}).limits || "");
  Object.assign(STRAINS, {
    oozer:  { name: "Oozer", serums: ["capacity", "fertility", "capacity", "growth", "capacity", "hyper pregnancy"], every: 25, can: mn => !/\b(slime|goo|ooze)/i.test(strainLim(mn)),
              tell: "It's an OOZER: it's made of slime, and it means to make you as slick as it is. Every hole loose and wet and stretchin', and slime all over you at every feed." },
    weaver: { name: "Weaver", serums: ["egg laying", "capacity", "fertility", "growth", "egg laying", "heat inducer"], every: 30, can: mn => !/\b(spider|web|arachn|cocoon)/i.test(strainLim(mn)),
              tell: "It's a WEAVER: it spins. Silk over your hands and round your body, and every so often it'll cocoon you and keep you hangin' a while." },
    deep:   { name: "Deep", serums: ["capacity", "fertility", "egg laying", "hyper pregnancy", "capacity", "growth"], every: 30, can: mn => !/\b(tentacl|sea ?monster)/i.test(strainLim(mn)),
              tell: "It's a DEEP: kin to the thing in the water. It'll keep you full of brine, and the water will come for you." },
    gloss:  { name: "Gloss", serums: ["growth", "capacity", "growth", "udder growth", "ass growth", "capacity"], every: 30, can: mn => !/\b(latex|rubber)/i.test(strainLim(mn)),
              tell: "It's a GLOSS: livin' rubber, and it wants you to cum. Every climax you have, it drinks, and pays you for it." },
  });
  // how each blooms (strainParts in 10v3 asks here first)
  const STRAIN_MORE = {
    oozer:  { parts: st => ({ stage: st, lips: true, root: st >= 2, suckers: st >= 3 }) },
    weaver: { parts: st => ({ stage: st, lips: true, suckers: st >= 2, root: st >= 3 }) },
    deep:   { parts: st => ({ stage: st, lips: true, root: st >= 2, suckers: st >= 3 }) },
    gloss:  { parts: st => ({ stage: st, lips: true, suckers: st >= 2, root: st >= 3 }) },
  };
  // its brew, for the body it's on (strainSerums in 10v3 asks here first)
  function strainSerumsMore(k, mn, b){
    if (k === "weaver" && !b.vulva) return ["capacity", "growth", "heat inducer", "capacity", "growth", "virility"];
    if (k === "deep" && !b.vulva) return ["capacity", "growth", "capacity", "virility", "fertility", "growth"];
    if (k === "gloss" && b.cock && !b.vulva) return ["growth", "capacity", "cock growth", "balls growth", "ass growth", "growth"];
    return STRAINS[k].serums;
  }
  Object.assign(STRAIN_GEAR, {
    oozer:  { lips: "Slick green lips of livin' slime sealed over the mouth, with a cool slippery tongue of it down the throat. Everythin' it touches, it leaves wet.",
              suckers: "Two cool green blobs of slime clamped over the teats, sloshin' and suckin', and they never stop drippin'.",
              suckersFlat: "Two cool green blobs of slime sealed over the nipples, suckin' gently and leavin' them glossy.",
              root: "A sash of green slime round the hips with a fat slick plug of itself in each hole, keepin' them wet and loose and open.",
              rootCock: "A sash of green slime round the hips and a slick fat plug of it deep in the ass, swellin' slow, keepin' it loose.",
              cage: { name: "Ooze Sleeve", items: ["LatexNulge", "ChastityPouch"], stage: 3, desc: "A cool green sleeve of slime swallowed over the cock and balls, sloshin' and squeezin', and it drips wherever they go." } },
    weaver: { lips: "Pale silk lips spun over the mouth, soft and sticky, with a fine thread of it down the throat that tugs when it feeds.",
              suckers: "Two pale spun cups over the teats, sticky as cobweb, suckin' in slow pulls.",
              suckersFlat: "Two little spun cups of silk over the nipples, sticky and tuggin'.",
              root: "A girdle of silk round the hips, spun tight, with a soft thick spindle of it seated in each hole.",
              rootCock: "A girdle of silk round the hips, with a soft thick spindle of it seated deep in the ass.",
              torso: { name: "Silk Harness", items: ["HempRopeHarness"], stage: 2, desc: "Pale silk strands spun round and round the body, crossin' over the chest and under it, tight as a harness and sticky to the touch." } },
    deep:   { lips: "Thick sea-green lips sealed over the mouth, tastin' of salt, with a tentacle coiled down the throat that pumps when it feeds.",
              suckers: "Two sea-green suckers on the teats, ringed and strong, pullin' like the tide.",
              suckersFlat: "Two sea-green suckers on the nipples, ringed like an octopus's, pullin' slow.",
              root: "A coil of sea-green tentacle round the hips with a thick arm of it in each hole, pumpin' brine in at every feed.",
              rootCock: "A coil of sea-green tentacle round the hips with a thick arm of it deep in the ass, pumpin' brine in at every feed.",
              cage: { name: "Deep's Coil", items: ["FullCasingCage", "LatexNulge"], stage: 3, desc: "A sea-green tentacle coiled tight round the cock and balls, suckers and all, squeezin' in slow waves like the sea." },
              torso: { name: "Deep's Embrace", items: ["TentacleSuit"], stage: 3, desc: "Sea-green tentacles wound over the whole body, shoulders to thighs, ringed suckers kissin' every inch, cool and wet and never still." } },
    gloss:  { lips: "Glossy black rubber lips sealed smooth over the mouth, squeakin' when they move, with a rubber tongue down the throat.",
              suckers: "Two black rubber cups sealed over the teats, sucked tight and shinin'.",
              suckersFlat: "Two black rubber cups sealed over the nipples, sucked tight and shinin'.",
              root: "Black rubber sealed over the hips and between the legs, seamless, with a rubber plug of itself in each hole that swells when it feeds.",
              rootCock: "Black rubber sealed over the hips and moulded round the cock, with a rubber plug of itself deep in the ass.",
              cage: { name: "Gloss Sheath", items: ["LatexNulge", "ChastityPouch"], stage: 3, desc: "A seamless black rubber sheath over the cock and balls, shinin', squeezin', and every time they cum it drinks it." } },
  });
  // what it spreads into: real clothes, in its colour (strainGear in 10v3 adds these). upTo: off again after that stage
  const fleshSpread = (word) => [
    { at: 2, slot: "tail", name: "Parasite Tail", items: ["Tentacles"], desc: "A thick "+word+" tendril sprouted from the base of the spine, curlin' and uncurlin', and it lifts whenever somebody stands behind them." },
    { at: 3, slot: "gloves", name: "Parasite Sleeves", items: ["LatexElbowGloves"], desc: word.charAt(0).toUpperCase()+word.slice(1)+" livin' flesh grown down both arms to the fingertips, warm and damp, pulsin' faintly." },
    { at: 3, slot: "socks", name: "Parasite Stockings", items: ["LatexSocks1"], desc: word.charAt(0).toUpperCase()+word.slice(1)+" livin' flesh grown up both legs to the thigh like stockings, warm and slick, squeezin' with every step." },
  ];
  const STRAIN_SPREAD = {
    breeder: fleshSpread("rose-pink"), grower: fleshSpread("violet"), glutton: fleshSpread("golden"), tyrant: fleshSpread("blood-dark"),
    oozer: [
      { at: 1, slot: "gloves", name: "Ooze Gloves", items: ["LatexShortGloves"], upTo: 2, desc: "Cool green slime gloved over both hands, drippin' from the fingertips, and it's spreadin'." },
      { at: 3, slot: "gloves", name: "Ooze Sleeves", items: ["LatexElbowGloves"], desc: "The slime has run up both arms to the elbow, slick and green and never quite still." },
      { at: 2, slot: "socks", name: "Ooze Stockings", items: ["LatexSocks1"], desc: "Green slime pooled round both feet and climbin' the calves, squelchin' at every step." },
      { at: 2, slot: "suitLower", name: "Ooze Skin (legs)", items: ["LatexCatsuit"], desc: "A slick green skin of livin' slime from the hips to the toes, glossy as wet glass, and it drips." },
      { at: 3, slot: "suit", name: "Ooze Skin (body)", items: ["LatexCatsuit"], desc: "Livin' slime from the throat down, a seamless green shine over every inch, sloshin' faintly when they move." },
    ],
    weaver: [
      { at: 2, slot: "gloves", name: "Silk Gloves", items: ["LatexElbowGloves"], desc: "Pale silk spun round and round both arms to the fingertips, fine as cobweb, sticky to the touch." },
      { at: 3, slot: "socks", name: "Silk Stockings", items: ["LatexSocks1"], desc: "Silk wound up both legs to the thigh, layer on layer, pale and sticky and fine." },
    ],
    deep: [
      { at: 1, slot: "tail", name: "Deep's Tail", items: ["Tentacles"], desc: "A sea-green tentacle grown from the base of the spine, ringed with suckers, curlin' round anythin' it can reach." },
      { at: 3, slot: "gloves", name: "Deep's Sleeves", items: ["LatexElbowGloves"], desc: "Sea-green tentacle wound down both arms to the wrist, suckers and all, cool and wet." },
      { at: 3, slot: "socks", name: "Deep's Stockings", items: ["LatexSocks1"], desc: "Sea-green tentacle coiled up both legs to the thigh, ringed suckers kissin' the skin." },
    ],
    gloss: [
      { at: 1, slot: "gloves", name: "Gloss Gloves", items: ["LatexShortGloves"], upTo: 2, desc: "Black livin' rubber sealed over both hands, smooth as a new boot, and it's spreadin'." },
      { at: 3, slot: "gloves", name: "Gloss Sleeves", items: ["LatexElbowGloves"], desc: "The rubber has run up both arms to the elbow, glossy black and seamless." },
      { at: 2, slot: "socks", name: "Gloss Stockings", items: ["LatexSocks1"], desc: "Black rubber grown smooth over the feet and calves." },
      { at: 2, slot: "suitLower", name: "Gloss Skin (legs)", items: ["LatexCatsuit"], desc: "Livin' rubber sealed over the hips and down both legs, shinin', and it squeezes with every step." },
      { at: 3, slot: "suit", name: "Gloss Skin (body)", items: ["LatexCatsuit"], desc: "Black rubber from the throat down, moulded to every curve, warm and alive, squeakin' when they breathe." },
      { at: 3, slot: "boots", name: "Gloss Heels", items: ["ThighHighLatexHeels"], desc: "It's grown itself a pair of thigh-high rubber heels. Its idea, not theirs." },
    ],
  };
  // the extra pieces for this strain at this stage (strainGear in 10v3)
  function strainSpreadGear(mn, g, P, k, base){
    const out = [];
    for (const x of STRAIN_SPREAD[k] || []){
      if (P.stage < x.at || (x.upTo && P.stage > x.upTo)) continue;
      out.push(Object.assign({ slot: x.slot, name: x.name, items: x.items, desc: (STRAINS[k].name+" strain. "+x.desc).slice(0, 180) }, base));
    }
    if (k === "weaver" && (g.cocoonUntil || 0) > Date.now())
      out.push(Object.assign({ slot: "arms", name: "Weaver's Cocoon", items: ["Web"], only: true, desc: "Weaver strain. Both arms spun up tight in silk against the body, a cocoon from shoulder to wrist. It'll let go in a few minutes. Probably." }, base));
    return out;
  }
  // what the host is told when it latches, and when it blooms (strainTell / strainBloomTell in 10v3 ask here first)
  function strainTellMore(k, mn, b){
    return {
      oozer: b.vulva ? "It's an OOZER, sugar: it's made of slime, and it means to make you as slick as it is. It feeds you every twenty-five minutes, it slimes you all over at every feed, and by hour four it'll be plugged in every hole you've got, keepin' them loose and wet and stretchin'."
                     : "It's an OOZER, sugar: livin' slime, and it means to make you as slick as it is. It feeds you every twenty-five minutes, it slimes you all over every time, and by hour four it'll be plugged up your ass, keepin' you loose and wet and stretchin'.",
      weaver: "It's a WEAVER, sugar: it spins. Silk over your hands and a silk harness round your body by hour four, and from then on, every hour or so, it'll cocoon your arms for a few minutes and keep you hangin' while it plays. It lays, too: a clutch, before it goes.",
      deep: "It's a DEEP, sugar, kin to the thing in the water, and it's already given you a tail. From hour four it's rooted in you, and it'll pump you full of brine at every feed so you're never once empty. The water knows you now: it'll come for you twice as often. And it'll want you in it.",
      gloss: b.cock ? "It's a GLOSS, sugar: livin' rubber, and it's the one that WANTS you to cum. Every climax you have, it drinks, and pays you a dose for it. It'll squeeze you up between feeds to make sure there's plenty, and it'll spread over you till you're rubber from the throat down."
                    : "It's a GLOSS, sugar: livin' rubber, and it wants you to cum. Every climax you have, it drinks and pays you a dose for. It'll squeeze you up between feeds to keep you ready, and spread over you till you're rubber from the throat down.",
    }[k];
  }
  function strainBloomTellMore(k, mn, b, late){
    const T = {
      oozer: late ? (b.tits ? "It's got your teats now, sugar, two cool wet mouths of slime, and the rest of it's gone over you from the throat down." : "It's on your nipples now, sugar, and the slime's gone over you from the throat down.")
                  : (b.vulva ? "It's rooted in you, sugar: a fat slick plug of slime in your pussy and your ass both, and it'll keep stretchin' them as it feeds." : "It's rooted in you, sugar: a fat slick plug of slime up your ass, and it'll keep stretchin' it as it feeds."),
      weaver: late ? "It's rooted below now, sugar, a spindle of silk in you, and it's spun stockings up both legs. It'll lay before it goes."
                   : "It's spun you a harness, sugar, and gloves, and cups over your teats. From here on, every hour or so, it'll cocoon you a while.",
      deep: late ? "It has all of you now, sugar: suckers on your teats and tentacles wound round your whole body. You're its own, as far as the water's concerned."
                 : "It's rooted in you, sugar, and from here on every feed comes with a bellyful of brine. You'll slosh.",
      gloss: late ? "You're rubber from the throat down, sugar, heels and all, and it's rooted in you below. It still wants you to cum. Often."
                  : "It's on your teats, sugar, and your legs are rubber to the hip. Cum for it. It pays well.",
    };
    return T[k];
  }
  // its own trick, after each feed (strainAfterDose in 10v3 calls this)
  function strainAfterDoseMore(mn, r, g, p, k, P){
    if (k === "oozer"){
      try { trapMess(mn, null, "slime"); } catch(e){}
      if (P.stage >= 2 && Math.random() < 0.5){
        const part = hasVulva(mn) && Math.random() < 0.5 ? "vulva" : "butt";
        if (CFG.SIZES[part] && sizeOf(mn, part) < sizeBase(mn, part) + 3){ setSize(mn, part, sizeOf(mn, part) + 1, false); emote("🟢 "+pmLine("oozerStretch", mn, { h: part === "vulva" ? "pussy" : "ass" }), mn); }
      } else if (Math.random() < 0.33) emote("🟢 "+pmLine("oozerSlime", mn), mn);
      saveLedger();
    }
    if (k === "deep" && P.stage >= 2){
      const h = openHole(mn, hasVulva(mn) ? "vulva" : "butt");
      if (h && h !== "mouth"){ const got = trapFill(mn, h, CFG.DEEP_BRINE_ML); if (got > 5 && Math.random() < 0.6) emote("🌊 "+pmLine("deepBrine", mn, { ml: ml(got), h: h === "vulva" ? "womb" : "belly" }), mn); saveLedger(); }
    }
    if (k === "gloss" && P.stage >= 2 && p && p.painted && p.painted.until > Date.now()){
      p.painted = null; bodyMark(mn, { wash: true }); try { aftermathWash(mn); } catch(e){}
      emote("🖤 "+pmLine("glossClean", mn), mn); saveLedger();
    }
    // and how the feed itself feels, strain by strain, now and then, just to them
    if (PARASITE_MORE[k+"_feed"] && Math.random() < CFG.STRAIN_FEED_CHANCE) privateLine(mn, pmLine(k+"_feed", mn), "emote");
  }
  // every heartbeat (strainTick in 10v3 calls this)
  function strainTickMore(mn, r, now, g, p, k, P){
    if (k === "weaver" && P.stage >= 2 && !(g.cocoonUntil > now) && now - (g.cocoonAt || g.since) > CFG.WEAVER_COCOON_MIN*60000 && !quietNow(mn) && !heldByTrap(mn) && !r.benched && !r.penned){
      g.cocoonAt = now; g.cocoonUntil = now + CFG.WEAVER_COCOON_LEN*60000;
      r.gluedUntil = Math.max(r.gluedUntil || 0, g.cocoonUntil); arouse(mn, 30, 92);
      emote("🕸️ "+pmLine("weaverCocoon", mn), mn); saveLedger(); syncCompanions(true);
      later(() => { if (parasiteOn(mn) && rec(mn).parasite === g){ emote("🕸️ "+pmLine("weaverFree", mn), mn); syncCompanions(true); } }, CFG.WEAVER_COCOON_LEN*60000 + 500);
    }
    if (k === "gloss" && now - (g.squeezeAt || g.since) > CFG.GLOSS_SQUEEZE_MIN*60000 && !quietNow(mn)){
      g.squeezeAt = now; arouse(mn, 18, 90); privateLine(mn, pmLine("glossSqueeze", mn), "emote"); saveLedger();
    }
  }
  // a Gloss drinks what they reach for, and pays for it (parasiteClimax in 10v2 hands it here)
  function glossClimax(mn, g){
    const now = Date.now(); if (now - (g.ateAt || 0) < 60000) return;
    g.ateAt = now; g.eaten = (g.eaten || 0) + 1;
    parasiteDose(mn, 1, pmLine("glossDrink", mn));
  }
  // a Weaver's cocoon comes off with it
  function strainGoneMore(mn, g){ const r = rec(mn); if (g && g.cocoonUntil > Date.now() && r && r.gluedUntil === g.cocoonUntil) r.gluedUntil = 0; }

  Object.assign(STRAIN_URGES, { oozer: ["bred", "swallow", "glory"], weaver: ["kneel", "nest", "kiss"], deep: ["water", "bred", "swallow"], gloss: ["beg", "kiss", "glory"] });
  Object.assign(URGE_MINS, { water: 10 });
  Object.assign(PARASITE_MORE, {
    // bloomin', for the room
    oozer_bloom_root: ["{v}The slime on %n sloshes, thickens, and slides down their belly in a cool green sheet, and two fat slick plugs of it ooze up into their pussy and their ass and settle there, swellin'.",
                       "{nv}The slime on %n slides down their belly in a cool green sheet and oozes up their ass in a fat slick plug, and settles, swellin'.",
                       "Green slime runs down %n's body like somebody tipped a bucket of it, and it doesn't drip off: it finds every hole and fills it, slick and cool and heavy."],
    oozer_bloom_suckers: ["Two cool green blobs of slime crawl up %n's chest and clamp over their nipples, sloshin', and start to suck.",
                          "The slime on %n has reached their chest, and two wet green mouths of it seal over their teats, drippin'.",
                          "%n's chest goes slick and green as the Oozer covers it, and it finds their nipples and sucks."],
    weaver_bloom_suckers: ["Pale threads spin out from the lips on %n's face, round their chest and over their nipples, and knit into two sticky little cups that start to pull.",
                           "The Weaver on %n spins, quick, and silk runs down their arms and round their body in a harness, and over each nipple in a sticky cup.",
                           "Silk, everywhere, spun fast and tight: a harness round %n's chest, gloves to their fingertips, and cups over their teats that suck."],
    weaver_bloom_root: ["{v}The Weaver spins lower, round %n's hips, between their legs, and a soft thick spindle of silk winds up into their pussy and another into their ass.",
                        "{nv}The Weaver spins lower, round %n's hips and between their legs, and a soft thick spindle of silk winds up their ass and stays there.",
                        "Silk girdles %n's hips and winds up their legs to the thigh, and below, somethin' spun and soft is pushed up inside them."],
    deep_bloom_root: ["{v}The tentacle tail on %n curls round their hip and between their legs, and two thick sea-green arms of it slide up into their pussy and their ass. Then the first brine comes, cold and salty.",
                      "{nv}The tentacle tail on %n curls between their legs and a thick sea-green arm of it slides up their ass. Then the first brine comes, cold and salty.",
                      "%n gasps, legs buckling: the Deep has rooted, a coil of tentacle round their hips and an arm of it inside, pumpin' the first cold rush of brine into them."],
    deep_bloom_suckers: ["Sea-green tentacles wind up over %n's whole body, shoulder to thigh, and two ringed suckers clamp over their teats and pull like the tide.",
                         "The Deep has all of %n now: tentacles wound round their body, round their arms and legs, and suckers on their nipples, cool and wet and never still.",
                         "%n's covered in it, sea-green coils from throat to thigh, suckers kissin' everywhere, and two of them latch on their teats and pull."],
    gloss_bloom_suckers: ["Black rubber spreads down %n's legs to the toes and up over their chest, and two rubber cups seal over their nipples with a wet little pop.",
                          "The rubber on %n's hands crawls on, over their hips, down both legs, glossy and tight, and over their teats in two shinin' cups.",
                          "%n's legs are rubber to the hip now, and their nipples are sealed under two sucked-tight cups of it, and it squeaks when they move."],
    gloss_bloom_root: ["Black rubber closes over the rest of %n, throat to toes, and grows them a pair of thigh-high heels, and below it pushes a swellin' plug of itself up inside them.",
                       "%n is rubber from the throat down now, seamless and shinin', heels and all, and somethin' rubber has rooted between their legs.",
                       "The Gloss finishes %n: elbow-length rubber, a catsuit of it to the chin, heels, and a plug of itself sealed in below. It hums, very pleased."],
    // their own tricks
    oozerSlime: ["Slime runs off %n in slow green ropes, all down their front and their thighs, and their skin shines with it.",
                 "The Oozer on %n sweats slime, cool and slick, till they're drippin' with it and leavin' wet green prints wherever they stand.",
                 "%n's covered in fresh slime after that feed, glossy green from chin to knees, and it squelches when they shift."],
    oozerStretch: ["The slime plug in %n's %h swells, slow and cool and relentless, and when it shrinks back they're looser than they were.",
                   "%n's %h is stretched a little wider by the slime in it, held there, and let go, and it doesn't quite close all the way.",
                   "The Oozer flexes in %n's %h, swellin' fat, and holds them open, and holds them open, and %n moans as it stretches them."],
    weaverCocoon: ["The Weaver spins without warnin': silk wraps round and round %n's arms, pinnin' them to their body, shoulder to wrist, and their feet are stuck where they stand.",
                   "%n's arms are drawn in tight and spun up in silk before they know it's happenin', a pale cocoon from shoulder to wrist, and the Weaver hums while it works.",
                   "Threads shoot out from the Weaver on %n and wrap, wrap, wrap, till their arms are spun tight to their sides and they're hangin' in silk, helpless, and the threads start to stroke."],
    weaverFree: ["The silk round %n's arms loosens, unspools, and slides off them in soft sticky skeins. The Weaver's done playin', for now.",
                 "The Weaver lets %n go, the cocoon slackenin' and fallin' away, leavin' their arms tingly and sticky.",
                 "%n's cocoon comes apart in pale threads, and they can move their arms again, and they're shakin'."],
    deepBrine: ["The Deep pumps a cold rush of brine into %n, %ml of it, and their %h rounds out and sloshes.",
                "%n gasps as the tentacle in them swells and empties, %ml of salt-cold brine, and they're sloshin' with it.",
                "Another feed, another bellyful: %ml of cold brine pumped into %n's %h by the thing coiled round their hips."],
    glossDrink: ["%n cums, and the Gloss drinks it, squeezin' every pulse out of them with rubber hands, and then pays them a long sweet dose for it.",
                 "Right at the peak the rubber on %n tightens all over and drinks it, every shudder of it, and hums, and pumps a dose into them like a tip.",
                 "%n's climax is swallowed whole by the rubber sealed over them, and it shivers, glossy and grateful, and feeds them for it."],
    glossSqueeze: ["The rubber on you squeezes, everywhere at once, slow and deliberate, right where it'll do the most, and doesn't stop until you're squirmin'. It wants you to cum. It's makin' sure you will.",
                   "Your rubber skin tightens and rubs, in waves, from your toes up, and settles between your legs and keeps goin'. It's hungry, and you're its food.",
                   "{c}The rubber round your cock tightens and strokes, slow, and you're hard in seconds. It wants you to cum. It's not subtle about it.",
                   "{v}The rubber between your legs presses and rolls, slow circles, right on your clit, and keeps goin'. It wants you to cum for it."],
    glossClean: ["The Gloss ripples over %n, and every splash and smear on them sinks into the rubber and is gone. Spotless, and shinin'.",
                 "Whatever mess was on %n is drunk into the rubber sealed over them, and it shines all the brighter for it."],
    // what they want
    // how each feed feels, strain by strain (strainAfterDoseMore)
    oozer_feed: ["The Ooze on %n swells and pulses, and a fresh warm gush of its brew slides down their throat, thick as syrup and sweet as sin. Everywhere it's spread over them goes slick and tingly all at once.",
                 "%n feels the Ooze move on them, one slow wet ripple from lips to hips, and then the swallow comes, warm and heavy, and their belly glows with it.",
                 "{v}A warm tendril of the Ooze slips between %n's thighs while it feeds them, just to keep their pussy wet. It does.",
                 "{c}The Ooze round %n's cock clenches and slurps while the brew goes down their throat, so they're fed at one end and milked at the other.",
                 "The Ooze burbles, a soft wet noise right against %n's ear, and floods their mouth with more than they can swallow tidy. It runs down their chin, and the Ooze licks it back up.",
                 "{t}The Ooze sucks at %n's nipples in slow pulses while it feeds them, and warm slime seeps out round their tits where it's sealed on.",
                 "%n's skin goes hot and buzzy under the Ooze as the brew hits, and the slime on them goes from clear to a deep, satisfied green.",
                 "The Ooze feeds %n the way it does everythin': messily, slowly, and far too much of it, till their throat works and works and it's still comin'."],
    weaver_feed: ["The Weaver's silk tightens over %n, every strand at once, one long slow squeeze from shoulders to thighs, and while they're held like that it pours its brew down their throat.",
                  "%n feels the Weaver's legs move on them, light and many and patient, and then the sweet heavy drink comes, and the silk round them goes warm.",
                  "The Weaver feeds %n with a shiver down every line of silk it's spun on them, a spider testin' its web for a catch, and findin' one.",
                  "{t}Fine silk threads draw tight round the base of %n's tits while the Weaver feeds them, liftin' them, bindin' them, till the teats stand hard in the cool air.",
                  "{v}A single silk thread pulled taut runs between %n's legs, and the Weaver plucks it, slow, like a harp string, while the brew goes down.",
                  "{c}The Weaver's silk wraps %n's cock in a fine, tight spiral while it feeds, and with every swallow they take, it draws the threads a little tighter.",
                  "The Weaver hums, a faint dry rustle against %n's lips, and the brew it gives them tastes of honey and somethin' darker, and their eyes go heavy.",
                  "%n's held so still in the silk that all they can do is swallow, and the Weaver knows it, and takes its time."],
    deep_feed: ["The Deep's coils roll over %n like a slow tide, and the brew comes with them, cool and salt-sweet, fillin' their mouth the way the sea fills a rock pool.",
                "%n tastes the ocean as the Deep feeds them: salt, and cold, and then a heat underneath it that spreads all the way down into their belly.",
                "Every sucker on the Deep's coils pulses at once against %n's skin, a hundred little kisses, and then the brew floods their throat.",
                "{v}A slick tendril of the Deep curls up between %n's legs and stays there, pulsin' in time with the swallows, keepin' its place for later.",
                "{c}The Deep's coil tightens wet and ridged round %n's cock while it feeds them, and squeezes in long slow waves like a swell comin' in.",
                "{t}The Deep's suckers fasten on %n's nipples and pull in time with a tide only it can feel, while its brew goes down their throat.",
                "%n hears the sea, faint and far off, while the Deep feeds them. There isn't a sea for miles. It doesn't matter.",
                "The Deep's brew is thick and cold and goes down slow, and %n's belly rounds a little with every swallow, heavy and sloshin'."],
    gloss_feed: ["The Gloss creaks as it feeds %n, rubber squeezin' snug everywhere it covers them, and the brew it gives them is warm and sweet and tastes faintly of latex.",
                 "%n's gloss-black skin shines a little brighter as the brew goes down, slick and tight and polished like it's just been buffed.",
                 "The Gloss tightens on %n, one long rubbery hug from throat to toes, and pushes its brew into their mouth while they're held too snug to squirm.",
                 "{t}The Gloss over %n's tits pulls tight and shiny, mouldin' every curve, and their stiff nipples stand out plain through it.",
                 "{c}The Gloss sheathin' %n's cock squeezes slick and snug as they swallow, and the shape of it shows through the rubber, every vein.",
                 "{v}The Gloss between %n's legs presses in, smooth and tight, a rubbery hand cupped over their pussy, and holds there while it feeds them.",
                 "Every breath %n takes, the Gloss creaks with it. Every swallow, it squeaks. They're a rubber thing now, and it's feedin' its rubber thing.",
                 "The Gloss feeds %n slow and tidy, not a drop wasted, and buffs itself to a shine on them after, pleased with its work."],
    breeder_feed: ["The Breeder on %n swells and pumps its brew down their throat, thick and warm, and their belly gives a slow, deep flutter, like somethin' in there's gettin' ready.",
                   "{v}%n feels the Breeder's brew land in their womb like a hot hand pressed low on their belly, and their pussy clenches on nothin', achin' to be filled.",
                   "{nv}%n feels the Breeder's brew pool low and hot in their belly, makin' room in them that wasn't there this mornin'.",
                   "The Breeder hums against %n's mouth while it feeds them, and every swallow makes them feel heavier, riper, readier.",
                   "%n's hips roll on their own as the Breeder's brew goes down, a slow needy grind, like their body's practisin' for what it's for.",
                   "{t}%n's tits swell tight and tender as the Breeder feeds them, and their nipples ache like they're expectin' somethin'.",
                   "The Breeder's brew is sweet and heavy and settles in %n like a promise, and they can't stop thinkin' about bein' bred.",
                   "Every gulp of the Breeder's brew makes %n's belly feel warmer and rounder and emptier all at once, and the empty is the worst part."],
    grower_feed: ["The Grower floods %n's mouth with its brew and they feel it go straight to work, a tight, sweet stretch spreadin' out under their skin.",
                  "{t}%n's tits throb as the Grower's brew goes down, swellin' heavier on their chest, and they can feel every ounce of the new weight.",
                  "{c}%n's cock and balls go hot and tight as the Grower feeds them, swellin' fuller and heavier, achin' with it.",
                  "%n's ass and hips prickle and fill out under the Grower's brew, plumper by the swallow, and their clothes start to complain.",
                  "The Grower's brew tastes like cream and honey and %n can't stop gulpin' it, and every gulp leaves a little more of them.",
                  "%n squirms as the Grower feeds them, a deep sweet ache spreadin' everywhere it's decided they ought to be bigger.",
                  "The Grower pulses against %n's lips, slow and satisfied, like a gardener watchin' somethin' come along nicely.",
                  "%n's skin feels snug all over after the Grower's fed them, tight over new curves, and they keep runnin' their hands over themselves to check."],
    glutton_feed: ["The Glutton drinks from %n as much as it gives, a greedy suckin' pull, and the brew it pours back makes them hungry, hungry, hungry.",
                   "%n's stomach growls as the Glutton feeds them, and it isn't food they want.",
                   "The Glutton's brew is rich and thick and leaves %n lickin' their lips for more, starvin' for somethin' to swallow.",
                   "{c}The Glutton's sleeve squeezes greedy round %n's cock while it feeds them, suckin' at the tip, pullin' out every drop it can get.",
                   "%n's mouth waters and keeps waterin' as the Glutton pours its brew down, and every cock in the room starts lookin' like supper.",
                   "The Glutton smacks its fat lips against %n's and swallows, then gives back, and %n's belly goes warm and wantin'.",
                   "{t}The Glutton's suckers pull at %n's nipples while it feeds, drinkin' what it can, and leave a hot, hungry ache behind.",
                   "%n swallows the Glutton's brew and somehow ends up hungrier than before, throat workin' at nothin'."],
    tyrant_feed: ["The Tyrant feeds %n its brew in small, measured sips, never quite enough, and their whole body aches for the rest.",
                  "%n's every nerve lights up as the Tyrant's brew goes down, right up to the edge, and the Tyrant holds them there, and holds them, and lets go.",
                  "The Tyrant squeezes, slow and deliberate, everywhere it's got a hold of %n, and they whimper, and it likes that.",
                  "{c}%n's cock throbs and leaks under the Tyrant's hold while it feeds them, hard as iron and not allowed to do one thing about it.",
                  "{v}%n's pussy clenches and drips as the Tyrant's brew hits, so close, so close, and the Tyrant knows exactly how close.",
                  "The Tyrant's brew is hot and sharp and goes down like an order, and %n's body follows it.",
                  "{t}The Tyrant pinches %n's nipples through its hold while it feeds them, just hard enough to make them gasp round its lips.",
                  "%n feels the Tyrant's patience as it feeds them: unhurried, certain, and in charge of every last twitch."],
    urge_water: ["There's a pull in you like a tide goin' out. The water. It wants you in the water, now.",
                 "Your skin's gone dry and tight and the thing on you is achin' for the wet. Go to the water. Get in it."],
    deep_urge_water: ["The tail on you curls toward the water and pulls, and the brine in your belly sloshes like it's answerin' somethin'. It wants you in the water, where its kin can find you.",
                      "You can smell the water from here, salt and cold, and the Deep on you strains toward it like a dog on a lead. Go. Get in. Let the water see you.",
                      "Somethin' in the water is callin' to the thing on you, and it's draggin' you toward it. In. Now."],
    deep_urge_bred: ["The tentacles round your hips tighten, and the brine in you churns. It wants somethin' warmer in you than brine: a load, deep, and it wants it soon.",
                     "It's coiled round your hips and pullin' them open. It wants you bred, so it's got somethin' to keep warm in there."],
    deep_urge_swallow: ["The tentacle down your throat flexes. It wants feedin': a load, swallowed, so it can turn it into brine and pump it back into you."],
    oozer_urge_bred: ["The slime in you swells and shivers and goes cool and empty. It wants somethin' warm poured into all that slick: a load, in you, soon.",
                      "Every hole it's stretched aches open and wet. It wants one of them filled. It doesn't care which, or by who."],
    oozer_urge_swallow: ["The slime down your throat goes thin and cold and hungry. It wants a load, swallowed, so it can be warm again.",
                         "Your mouth's floodin' with slime. It wants feedin', and only one thing will do it: somebody's cum, straight down."],
    oozer_urge_glory: ["The glory stalls. All those cocks through the boards, and every one of them somethin' warm for it. It wants you on your knees in there, mouth open."],
    weaver_urge_kneel: ["The silk on you tightens, and pulls, and your knees fold. It wants you low and still, the way it likes its catch. Kneel, and stay."],
    weaver_urge_nest: ["It wants a nest. Somewhere soft, somewhere it can spin round you. Go to the nest and settle, and let it work.",
                       "The Weaver's restless, threads twitchin', lookin' for a corner to fill. The nest. Take it to the nest."],
    weaver_urge_kiss: ["It wants a taste of somebody else. A kiss, deep, so it can tell if they'd be worth a thread or two."],
    gloss_urge_beg: ["The rubber squeezes you to the edge and stops, and waits. It wants to hear you. Out loud. Beg to cum, so everybody hears what you are.",
                     "It's wound you tight and it wants you to ask for it. Beg. Please. Loud enough to carry."],
    gloss_urge_kiss: ["Your rubber lips tingle. It wants them on somebody else's, slick and squeakin'. Kiss somebody. Long."],
    gloss_urge_glory: ["It's thinkin' of the glory stalls, through you: a queue of cocks and you on your knees, and every one of them a climax it can drink off the end of somebody else. Go."],
    oozer_urgeDone: ["The Oozer on %n shivers, warm and pleased, and every slick plug of it swells at once and pumps them a long cool dose.",
                     "Fed, the slime on %n goes heavy and sweet and settles, and leaks a generous dose into them by way of thanks."],
    weaver_urgeDone: ["The Weaver on %n hums, spinnin' slow, pleased, and lets down a long sweet dose along every thread it's got in them.",
                      "Good catch. The silk on %n tightens like a hug and feeds them, slow and generous."],
    deep_urgeDone: ["The Deep on %n coils tighter, pleased as the sea, and pumps them a long cold-sweet dose that settles low and stays.",
                    "It got what it wanted, and it pays like the tide comes in: a slow, deep, heavy dose into %n."],
    gloss_urgeDone: ["The Gloss squeaks against %n, all over, delighted, and pumps them a hot sweet dose, and keeps rubbin' after.",
                     "The rubber on %n warms and purrs and pays them a long dose for doin' as it asked, and squeezes them right back up to the edge for good measure."],
    oozer_urgeFail: ["It didn't get fed, and it sulks the way slime does: it goes cold and heavy in every hole it's stretched, and stays there, aching, for an hour, and won't let you finish.",
                     "No load, no mercy. The Oozer holds every hole it has wide and cold and empty, right at the edge, for an hour."],
    weaver_urgeFail: ["You didn't do as it said. The Weaver spins tight round everything it holds and strokes, and strokes, and stops, and keeps you hangin' at the edge for an hour."],
    deep_urgeFail: ["You stayed out of the water. The Deep coils round you cold and tight and holds you right at the brink for an hour, like a wave that won't break."],
    gloss_urgeFail: ["You wouldn't ask for it, so it won't give it. The rubber holds you at the edge, squeezin' and squeezin', for an hour, and drinks nothin', and lets you have nothin'."],
  });
