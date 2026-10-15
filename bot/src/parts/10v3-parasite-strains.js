  /* WHAT'S IN THIS FILE (10v3-parasite-strains.js)
     The four strains told apart (Laynie, Oct 12: "each parasite type kind of evolves the same way"). Each one now
     blooms in its own order, wears its own colour, puts its own pieces on its host, brews for the body it's on,
     and does one thing none of the others do. What it does also depends on the host: pussy, cock, both, or a femboy.

       BREEDER (rose)   lips → a root below at hour 4 → suckers and a brood sac round the belly at hour 8.
                        It lays twice: once at the half-way mark and once before it goes. A host with no womb is
                        given one for the day (a load in the ass can take) and carries its eggs there.
       GROWER (violet)  lips → suckers at hour 4 → a root at hour 8, and a livin' sheath over a cock.
                        It grows what the host has: cock and balls on a male, tits and ass on a female, all of it on
                        a futa, and on a femboy it grows hips, ass and a pair of tits they didn't have.
       GLUTTON (gold)   lips AND suckers from the first minute → a sleeve over a cock at hour 4 → a root at hour 8.
                        It drinks milk at every feed, and from hour 4 it milks a cock dry at every feed too, and
                        leaves the host makin' more of both.
       TYRANT (blood)   lips AND a clasp from the first minute (a cage on a cock, a sealed belt on a pussy)
                        → suckers at hour 4 → a web over the body at hour 8. No cummin' while it's on, and from
                        hour 8 it walks its host to the edge every quarter hour and leaves them there.
     A parasite that came back as a belt still blooms from the hips up, whatever its strain.
  */
  const STRAIN_COLOR = { breeder: "#E0607F", grower: "#8E5BD6", glutton: "#E8C36A", tyrant: "#7A1F2B" };
  const strainKey = g => (g && STRAINS[g.strain] ? g.strain : "grower");
  // which pieces have grown in by this stage (1, 2 or 3)
  function strainParts(strain, stage){
    switch (strain){
      case "breeder": return { stage, lips: true, root: stage >= 2, suckers: stage >= 3 };
      case "glutton": return { stage, lips: true, suckers: true, root: stage >= 3 };
      case "tyrant":  return { stage, lips: true, root: true, suckers: stage >= 2 };
      default:        return { stage, lips: true, suckers: stage >= 2, root: stage >= 3 };
    }
  }
  // what's new at this stage, for the line the room sees
  function bloomWhat(g, stage){
    const a = strainParts(strainKey(g), stage - 1), b = strainParts(strainKey(g), stage);
    return b.suckers && !a.suckers ? "suckers" : b.root && !a.root ? "root" : "more";
  }
  // its brew, for the body it's on
  function strainSerums(mn){
    const g = rec(mn).parasite, k = strainKey(g), b = bodyOf(mn);
    if (k === "breeder") return b.vulva ? STRAINS.breeder.serums : ["mpreg", "fertility", "egg laying", "capacity", "hyper pregnancy", "ass growth"];
    if (k === "grower"){
      if (b.g === "futa")   return ["cock growth", "udder growth", "balls growth", "ass growth", "capacity", "growth"];
      if (b.g === "femboy") return ["ass growth", "udder growth", "ass growth", "capacity", "udder growth", "balls growth"];
      if (b.cock && !b.vulva) return ["cock growth", "balls growth", "cock growth", "capacity", "balls growth", "ass growth"];
      return ["udder growth", "ass growth", "udder growth", "capacity", "ass growth", "fertility"];
    }
    if (k === "glutton") return b.cock ? ["virility", "lactation", "balls growth", "capacity", "virility", "udder growth"] : STRAINS.glutton.serums;
    if (k === "tyrant")  return b.cock ? ["balls growth", "heat inducer", "virility", "growth", "capacity", "fertility"] : STRAINS.tyrant.serums;
    return STRAINS[k].serums;
  }
  const STRAIN_GEAR = {
    breeder: { lips: "Soft rose lips sealed over the mouth, with a feeder down the throat. Everything it gives them is meant to end in a full belly.",
               suckers: "Two rose-pink mouths on the teats, drawin' slow, gettin' them ready to nurse what it means them to carry.", suckersFlat: "Two rose-pink mouths on a flat chest, suckin' patiently at nipples it has plans for.",
               root: "A hot band round the hips with a root seated against the womb, keepin' it open and ripe and pumpin' it full of what makes things take.",
               rootCock: "A hot band round the hips with a root deep in the ass, makin' a place in there for somethin' to grow. A load in that hole can take now.",
               torso: { name: "Brood Sac", desc: "A warm web of livin' flesh cradlin' the belly from underneath, holdin' the weight of what's been put in there and squeezin' when it moves." } },
    grower:  { lips: "Violet lips, thick and wet, feedin' in gulps every twenty minutes. Every swallow ends up as more of them somewhere.",
               suckers: "Violet cups latched on the tits, pullin' them out long, and they're a little heavier after every feed.", suckersFlat: "Violet cups latched on a flat chest that isn't goin' to stay flat. It's pullin' a pair of tits out of them.",
               suckersMale: "Violet cups latched on the nipples, suckin' between feeds. Everything it pours in goes to the cock and balls.",
               root: "A violet band round the hips with a root in each hole, swellin' a little thicker every hour to keep up with what it's made of them.",
               rootCock: "A violet band round the hips and a root in the ass, pressin' on the spot that makes a cock fill and fatten.",
               cage: { name: "Grower's Sheath", items: ["ChastityPouch", "LatexNulge", "FullCasingCage"], stage: 3, desc: "A livin' violet sleeve swallowed over the cock and balls, kneadin', and both are bigger each time it loosens to let them see." } },
    glutton: { lips: "Fat golden lips that never stop workin', suckin' at the tongue between feeds like it can't wait for the next thing to swallow.",
               suckers: "Two greedy golden mouths on the teats from the first minute, drinkin' them flat and leavin' them makin' more.", suckersFlat: "Two greedy golden mouths on the nipples, suckin' hard at a chest that's startin' to give them somethin'.",
               root: "A golden band round the hips with a hungry root in each hole, drinkin' down every load before it's had time to settle.",
               rootCock: "A golden band round the hips with a hungry root in the ass, milkin' them from the inside so the sleeve in front never runs dry.",
               cage: { name: "Glutton's Sleeve", items: ["FullCasingCage", "ChastityPouch", "LatexNulge"], stage: 2, desc: "A wet golden throat closed over the cock to the root, swallowin' in slow waves. It milks them dry at every feed and drinks all of it." } },
    tyrant:  { lips: "Dark red lips clamped over the mouth like a hand. It decides what goes in, and it has decided they don't cum.",
               suckers: "Two dark mouths on the nipples that suck right up to the edge of too much, and stop there.", suckersFlat: "Two dark mouths on the nipples that suck right up to the edge of too much, and stop there.",
               root: "A blood-dark belt sealed over the pussy from the first minute, with a root inside that rubs, and rubs, and goes still the moment they start to climb.",
               rootCock: "A blood-dark band round the hips with a root in the ass that finds the spot, leans on it, and lets go the moment they start to climb.",
               cage: { name: "Tyrant's Cage", items: ["TechnoChastityCage", "FullCasingCage", "PlasticChastityCage2"], stage: 1, desc: "A tight dark sheath locked down over the cock, too small to get hard in, with one wet tongue of itself lickin' the tip. It eats every orgasm they reach for." },
               torso: { name: "Tyrant's Web", desc: "Dark livin' cords drawn tight over the whole body, wrist to hip to throat. It moves them where it wants and holds them still when it's teasin'." } },
  };
  function strainGear(mn){
    const r = rec(mn), g = r.parasite, P = parasiteParts(g), k = strainKey(g), S = STRAINS[k], D = STRAIN_GEAR[k], b = bodyOf(mn), out = [];
    const base = { always: true, color: STRAIN_COLOR[k], until: g.until }, add = (slot, name, desc, items) => out.push(Object.assign({ slot, name, desc: (S.name+" strain. "+desc).slice(0, 180) }, items ? { items } : {}, base));
    if (P.lips) add("lips", "Parasite Lips", D.lips);
    if (P.suckers) add("cups", "Parasite Suckers", b.tits ? D.suckers : b.g === "male" && D.suckersMale ? D.suckersMale : D.suckersFlat);
    if (P.root) add("belt", g.form === "belt" ? "Parasite Belt" : "Parasite Root", b.vulva ? D.root : D.rootCock);
    if (b.cock && D.cage && P.stage >= D.cage.stage) add("dildo", D.cage.name, D.cage.desc, D.cage.items);
    if (D.torso && P.stage >= 3) add("torso", D.torso.name, D.torso.desc, ["TentacleSuit"]);
    return out;
  }
  // what the host is told when it latches: its strain, for their body
  function strainTell(mn){
    const g = rec(mn).parasite, k = strainKey(g), b = bodyOf(mn);
    const T = {
      breeder: b.vulva ? "It's a BREEDER: it wants you ripe. Fertility, hyper pregnancy, clutches of eggs, over and over, till anything that so much as looks at you leaves you carryin'. It'll root in you at hour four, and it lays in you twice."
                       : "It's a BREEDER, and it doesn't care that you've no womb: it's makin' you one. For as long as it's on you a load in your ass can take, and it means to fill that hole with eggs twice before it goes.",
      grower:  b.g === "futa" ? "It's a GROWER: it feeds you every twenty minutes and it grows all of you. Cock, balls, tits, ass, round and round, and every bit of it for keeps."
             : b.g === "femboy" ? "It's a GROWER, and it's decided what you ought to look like: wider hips, a fatter ass, and a pair of tits you didn't walk in with. Every twenty minutes, and all of it for keeps."
             : b.cock ? "It's a GROWER: it feeds you every twenty minutes, and it all goes to your cock and your balls. Thicker, heavier, fuller, for keeps. By hour eight it'll have a sheath over them to help."
             : "It's a GROWER: it feeds you every twenty minutes, and it all goes to your tits and your ass. Bigger, heavier, rounder, and every bit of it for keeps.",
      glutton: b.cock ? "It's a GLUTTON: it's hungry for everything you make. It drinks your milk if you've any, and from hour four it'll have a sleeve over your cock, milkin' you dry at every feed and dosin' you to make more."
                      : "It's a GLUTTON: it's as hungry for your milk as for cum. It's on your teats already. It'll drink you down at every feed, and dose you so you make twice as much for it next time.",
      tyrant:  b.cock ? "It's a TYRANT: you don't cum while it's on you. It's caged your cock already. Every time you get there it eats it and pays you in serum, and your balls will only get heavier. Twelve hours of that."
                      : "It's a TYRANT: you don't cum while it's on you. It's sealed over your pussy already. Every time you get there, it eats it, ruins it, and pays you in serum instead. Twelve hours of that.",
    };
    return T[k];
  }
  // what the host is told each time it blooms
  function strainBloomTell(mn, stage){
    const g = rec(mn).parasite, k = strainKey(g), b = bodyOf(mn), late = stage >= 3;
    if (g.form === "belt") return late ? "It's reached your mouth now, sugar. All of it's on you." : "It's climbin', sugar. It has your nipples now.";
    const T = {
      breeder: late ? "It has your "+(b.tits ? "teats" : "nipples")+" now, and it's wrapped your belly in a warm sac of itself to hold what it's bred into you. It lays once more before it goes."
                    : (b.vulva ? "It's rooted in you, right up against your womb, keepin' it open and ripe. Half-way through its time it'll start layin' in there." : "It's rooted in your ass, and it's made a place in there to carry. Half-way through its time it'll start fillin' it with eggs."),
      grower:  late ? (b.cock ? "It's grown a sheath over your cock and balls, sugar, and a root behind. They'll both be bigger when it lets you look." : "It's rooted in you now, sugar, swellin' as you do.")
                    : (b.tits ? "It has your tits now, pullin' them out long. They'll be heavier after every feed."
                       : b.g === "femboy" ? "It's on your chest now, and it's pullin'. You're goin' to have somethin' there by the time it's done."
                       : "It's on your nipples now, suckin' between feeds just to keep you squirmin'. Every drop it pours in still goes to your cock and balls."),
      glutton: late ? "It's rooted below now as well. Anything anybody puts in you, it drinks before you've felt the warmth of it."
                    : (b.cock ? "It's swallowed your cock, sugar. From here on it milks you dry at every feed, and doses you so there's more next time." : "It's hungrier. It'll drain your teats lower at every feed from here on."),
      tyrant:  late ? "It's webbed over all of you now. Every quarter hour it's goin' to walk you right to the edge and leave you standin' there."
                    : "It has your nipples now, and it only uses them to wind you up.",
    };
    return T[k];
  }
  // once, when it latches
  function strainBorn(mn){
    const r = rec(mn), g = r.parasite, p = prodOf(mn), k = strainKey(g), b = bodyOf(mn);
    if (k === "breeder" && !b.vulva && !limitBlocks(mn, "breed")) addBoost(p, "mpreg", g.until - Date.now(), 1);   // a place to carry, for the day
    if (k === "tyrant") p.deniedUntil = Math.max(p.deniedUntil || 0, g.until);
  }
  // after each regular feed
  function strainAfterDose(mn){
    const r = rec(mn), g = r.parasite, p = prodOf(mn), k = strainKey(g), P = parasiteParts(g);
    // the Glutton's sleeve milks a cock dry
    if (k === "glutton" && P.stage >= 2 && makesSemen(mn) && p.semen >= 10){
      const got = drainSemen(mn, p.semen * 0.8);
      if (got >= 3){ g.drunk = (g.drunk || 0) + got; emote("👄 "+pmLine("sleeve", mn, { ml: ml(got) }), mn); addBoost(p, "semen", 6*3600000, 1); arouse(mn, 15, 94); saveLedger(); }
    }
  }
  // every heartbeat
  function strainTick(mn, r, now){
    const g = r.parasite, p = prodOf(mn), k = strainKey(g), P = parasiteParts(g);
    // the Breeder lays at the half-way mark too
    if (k === "breeder" && !g.laidMid && P.stage >= 2 && now >= g.since + (g.until - g.since)/2 && !limitBlocks(mn, "eggs")){
      g.laidMid = true;
      const [lo, hi] = CFG.EGG_COUNT;
      layClutch(mn, lo + Math.floor(Math.random()*(hi - lo + 1)), PARASITE_SIRE); p.eggs.para = true;
      emote("🥚 "+pmLine("layMid", mn), mn);
      tell(mn, "🥚 The Breeder's laid its first clutch in you, sugar, and it's not finished. There'll be another before it goes.");
      saveLedger(); syncCompanions(true);
    }
    // the Tyrant walks them to the edge
    if (k === "tyrant" && P.stage >= 3 && now - (g.edgeAt || 0) > CFG.TYRANT_EDGE_MIN*60000 && !quietNow(mn) && !heldByTrap(mn)){
      g.edgeAt = now; arouse(mn, 70, 94);
      privateLine(mn, pmLine("tyrantEdge", mn), "emote"); saveLedger();
    }
  }
  Object.assign(PARASITE_MORE, {
    bloom_more: ["The parasite on %n shivers and thickens. It's grown again, and it's tightened its hold everywhere it already had one.",
                 "Somethin' changes in the thing wearin' %n. It spreads a little further, grips a little harder, and %n's breath catches."],
    sleeve: ["{c}The golden sleeve on %n's cock clenches and swallows, root to tip, again and again, till it's wrung %ml out of them and drunk every drop. %n hangs on to the rail, emptied.",
             "{c}%n's hips jerk. The Glutton is milkin' their cock in long greedy gulps: %ml, straight down its throat, and it squeezes their balls for the last of it.",
             "{c}It doesn't ask. The sleeve ripples on %n's cock till they spill, %ml, and it keeps suckin' at the tip after, lookin' for more."],
    layMid: ["{v}%n doubles over with both hands on their belly. The Breeder's root has swollen, and it's pushin' eggs up into their womb one at a time, warm and round. It isn't even half done with them.",
             "{nv}%n doubles over, gaspin'. The Breeder's root is feedin' eggs up into their ass, one after another, into the place it made there. Their belly rounds out under their hands.",
             "The thing on %n pulses, slow and heavy, and with every pulse another egg goes in. %n's knees give. Half-way through its time, and it's started fillin' them."],
    tyrantEdge: ["It starts again. Everywhere it holds you it squeezes and strokes, patient, till you're a breath from cummin'. Then it goes still, and you stand there shakin' with nowhere to put it.",
                 "{c}The cage tightens, and the tongue inside it laps the tip of your cock slow, slower, till your balls draw up. Then nothin'. It's waitin' for you to come down so it can do it again.",
                 "{v}The root in you rubs that one spot, in little circles, till your legs are tremblin'. Then it stops dead. You'd beg, but it's got your mouth.",
                 "The web pulls you up on your toes and works you over all at once: nipples, hole, the back of your neck. Right at the top, it lets go of everything."],
  });
