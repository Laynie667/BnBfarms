  /* WHAT'S IN THIS FILE (10u6-more-traps-2.js)
     Six more traps (Laynie, Oct 15: "Only six new ones?"). 10u-traps.js runs them like the rest.
       trap-crate      a breedin' crate, rump to the gate, and the herd sire let in: round after round (needs ?breedable
                       for it to go inside; otherwise he ruts over them)
       trap-carousel   the milkin' carousel: a turnin' parlor, milked (or the sleeve), filled, and round again
       trap-plow       hitched to the plow and driven down a furrow with a crop; slow on their feet for a bit after
       trap-bale       baled in tight with only the rump out, and anybody passin' can ?use them, like the pillory
       trap-scarecrow  tied up on the post in the field, and the farmhands take their turns
       trap-washline   pegged out on the washin' line with clothespins wherever they'll grip
     Lines fit the body (tags, 10y9d-body-fit.js). Hard limits and the safeword work the same as every trap.
     %n name · %c the cock · %h the hole · %ml how much
  */
  Object.assign(TRAP_KINDS, {
    crate:     { icon: "🐖", what: "a breedin' crate, rump to the gate, and the herd sire let in for as many rounds as he's got", limit: /\b(breed|crate|gang|size)/i },
    carousel:  { icon: "🎠", what: "the milkin' carousel: milked, filled, and round again", limit: /\b(milk|lactat|machine)/i },
    plow:      { icon: "🌾", what: "hitched to the plow and driven down a furrow with a crop", limit: /\b(pony|harness|pull|crop|impact)/i },
    bale:      { icon: "🌾", what: "baled in tight with your rump out, and anybody passin' can use you", limit: /\b(stuck|public|free ?use|bale)/i },
    scarecrow: { icon: "🌽", what: "tied up on the scarecrow post, and the farmhands take their turns", limit: /\b(public|free ?use|gang|rope)/i },
    washline:  { icon: "🧺", what: "pegged out on the washin' line with clothespins wherever they'll grip", limit: /\b(clamp|clothespin|peg|pain)/i },
  });
  ANTHRO.crate = { sire: -22, name: "the herd sire", type: "equine", loads: 3, ml: 260, hold: 8, hole: "vulva", bonus: 1.7, where: "the breedin' crate" };
  ANTHRO.scarecrow = { sire: ANON_STUD, name: "the farmhands", type: "human", loads: 3, ml: 120, hold: 9, hole: "vulva", bonus: 1.2, where: "the scarecrow post" };
  Object.assign(TRAP_NEEDS, {
    bale: mn => limitBlocks(mn, "breed") ? "their limits rule it out" : null,
    carousel: mn => makesMilk(mn) || makesSemen(mn) ? null : "nothin' to milk",
  });
  const moreLine2 = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, TRAPS2_LINES[kind][key]), mn, v);
  Object.assign(MORE_TRAPS, {
    crate(mn, spot){ anthroScene(mn, "crate", spot); },
    scarecrow(mn, spot){ anthroScene(mn, "scarecrow", spot); },
    carousel(mn){
      const T = TRAPS2_LINES.carousel, p = prodOf(mn), r = rec(mn), milk = makesMilk(mn) && p.milk >= 1, seed = makesSemen(mn);
      const hole = r.breedable && !limitBlocks(mn, "breed") ? openHole(mn, "vulva") : null, v = { h: hole && hole !== "mouth" ? TRAP_HOLE[hole] : "" };
      trapHold(mn, 5, "the milkin' carousel");
      trapRun(mn, "carousel", [T.board].concat([milk || !seed ? T.milk : T.sleeve], [v.h ? T.fill : T.tease], [T.round]), () => {
        const gotM = milk ? drainMilk(mn, p.milk) : 0, gotS = seed ? drainSemen(mn, p.semen) : 0;
        if (v.h){ trapFill(mn, hole, 120 + Math.random()*120, CFG.TRAP_OVERFULL); tally(mn); }
        v.ml = ml(gotM + gotS);
        emote("🎠 "+moreLine2("carousel", "end", mn, v), mn);
        face(mn, "milked", 60); arouse(mn, 30);
      }, v);
    },
    plow(mn){
      trapHold(mn, 4, "the plow harness");
      trapRun(mn, "plow", TRAPS2_LINES.plow.beats, () => {
        const r = rec(mn); r.gluedUntil = Math.max(r.gluedUntil || 0, Date.now() + 5*60000); r.plowed = (r.plowed || 0) + 1;
        emote("🌾 "+moreLine2("plow", "end", mn), mn);
        arouse(mn, 15);
        later(() => earnRibbons(mn, 1, "pullin' a straight furrow"), 2000);
      });
    },
    bale(mn){
      const pos = posOf(mn), r = rec(mn);
      trapRun(mn, "bale", TRAPS2_LINES.bale.beats, () => {
        if (!pos) return;
        r.benched = { until: Date.now() + tmin(mn, CFG.TRAP_PILLORY_MIN)*60000, X: pos.X, Y: pos.Y, name: "the hay bale", by: BOTMN(), uses: 0, since: Date.now(), ambAt: Date.now() + 3*60000, trap: true };
        tell(mn, "🌾 Baled in for "+CFG.TRAP_PILLORY_MIN+" minutes with your rump out, sugar. Anybody who walks up can ?use you. Your safeword gets you out.");
      });
    },
    washline(mn){
      trapHold(mn, 4, "the washin' line");
      trapRun(mn, "washline", TRAPS2_LINES.washline.beats, () => { emote("🧺 "+moreLine2("washline", "end", mn), mn); arouse(mn, 25); face(mn, "edged", 60); });
    },
  });

  const TRAPS2_LINES = {
    carousel: {
      board: [
        "The stall floor turns out to be a platform, and it starts to turn. Cuffs catch %n's wrists and ankles at the first stop: they're on the milkin' carousel now.",
        "%n steps into what looks like an empty stall, and the whole floor lurches and rotates. A yoke drops over their neck. The carousel has a new rider.",
        "A gate swings shut behind %n and the stall begins, slowly, to go round. Straps cinch them in place, bent over a padded rail.",
      ],
      milk: [
        "First stop: cups. They latch on with a greedy pull and milk %n hard all the way round to the next station.",
        "{t}At the first stop the cups find %n's teats and pull long and steady, and milk runs down the lines as the carousel turns.",
        "{nt}At the first stop little cups seal over %n's nipples and suck, and thin warm milk runs down the lines as they turn.",
        "The carousel grinds to its first stop and the milkers come down. %n is drained in long, wet pulls while the wheel creaks.",
      ],
      sleeve: [
        "{c}First stop: a warm sleeve slides down %n's cock and starts to milk it, root to tip, as the carousel turns.",
        "{c}At the first station a sleeve swallows %n's cock and pumps, slow and wet, and a jar under it starts to fill.",
        "{c}The carousel stops, and somethin' soft and slick closes round %n's cock and starts to pull.",
      ],
      fill: [
        "Second stop. A greased post rises behind %n and pushes into their %h, and it pumps somethin' warm into them for the whole station.",
        "At the second station a machine cock slides into %n's %h and thrusts in time with the creak of the wheel, and fills them before it lets go.",
        "Round to the next stop, and a fat nozzle finds %n's %h and empties itself inside them, warm and thick.",
      ],
      tease: [
        "Second stop. Brushes and soft paddles work over %n's thighs and belly and everywhere between, and keep them squirmin' all the way round.",
        "At the second station a ridged roller rubs up and down between %n's legs while the carousel creaks on.",
        "{c}The next stop is a feather wheel that strokes %n's cock so lightly they can barely stand it.",
      ],
      round: [
        "Then round again. And again. The carousel doesn't stop just because %n's shakin'.",
        "Every lap, %n gets milked and filled and milked again, and the farm girl waves each time they pass.",
        "The wheel turns and turns, and %n has lost count of the laps, dizzy and drippin'.",
        "{t}By the third lap %n's tits are sore and swingin', and the cups latch on again anyway.",
      ],
      end: [
        "The carousel grinds to a halt at last and drops %n off at the gate, wobbly, with %ml milked out of them and somethin' sloshin' in their belly.",
        "The wheel stops. The straps let go. %n stumbles off the carousel milked down by %ml and dizzy as a calf.",
        "Last lap done: %ml in the jars, and %n tipped off the platform onto the straw, spinnin' still.",
      ],
    },
    plow: {
      beats: [
        ["A harness drops over %n's shoulders and cinches tight before they can shrug it off. Behind them, chains rattle onto the plow.",
         "%n is collared, girthed and hitched to the old plow in three quick moves, and somebody behind them picks up a crop.",
         "Straps snap round %n's chest and hips, a bit slides between their teeth, and the plow's traces are buckled to the harness."],
        ["\"Walk on.\" The crop taps %n's flank, and they lean into the harness and pull. The plow bites the dirt and starts to move.",
         "%n hauls the plow down the field, step by heavy step, while the furrow opens behind them and the crop keeps time.",
         "The plow catches on a root and %n has to throw their whole weight into the harness. The crop lands, and they pull harder."],
        ["Sweat runs down %n's back. Halfway down the furrow the farmhands on the fence start cheerin' them on.",
         "{t}%n's tits bounce in the harness with every heavy step, and a farmhand on the fence whistles.",
         "{c}%n's cock swings with every step as they lean into the harness, and the crop flicks it once, just for fun.",
         "The crop snaps across %n's rump whenever they slow, and they don't slow much."],
        ["At the end of the furrow %n is turned round and sent straight back up the next one.",
         "One furrow, two, three. %n's legs are shakin' and the field is lookin' very well plowed.",
         "Somebody says the furrow's a bit crooked, and %n is made to plow it again."],
      ],
      end: [
        "The traces come off at last and %n stands blowin' in the field, legs like jelly and a straight furrow behind them. Good work.",
        "Unhitched, %n stumbles to the water trough and drinks like a pony after a long day. The field is plowed.",
        "The harness drops off and %n sinks down in the dirt, done in, with the farmhands givin' them a round of applause.",
      ],
    },
    bale: {
      beats: [
        ["The hay baler swallows %n up to the waist before they can step back, and rumbles, and starts to pack the hay in tight round them.",
         "%n trips into the bale pile and the baler's arm sweeps round, pressin' hay in round their middle and binding it with twine.",
         "A spring flips %n head first into an open bale, and the baler closes over them with a crunch of packed hay."],
        ["When it's done there's a big round bale in the yard with %n's legs and rump stickin' out of it and nothin' else to see.",
         "%n is packed in hay to the hips, their head and arms somewhere inside the bale, and their backside out in the sunshine for anybody walkin' by.",
         "Twine creaks. The bale holds. All anybody can see of %n is a pair of kickin' legs and a rump turned up to the sky."],
        ["Somebody chalks USE ME on the side of the bale, with an arrow pointin' down.",
         "{v}%n's pussy is right there at the height of a passin' farmhand's belt, and the breeze is cool on it.",
         "{nv}%n's ass is right there at the height of a passin' farmhand's belt, and the breeze is cool on it.",
         "A farmhand stops, reads the chalk, looks at %n's rump, and starts to undo their belt."],
      ],
    },
    washline: {
      beats: [
        ["A line whips round %n's wrists and hauls them up onto the washin' line, toes just touchin' the grass, and the clothespins come out.",
         "%n is strung up by their wrists between two posts, right alongside the sheets, and a basket of clothespins is set down beside them.",
         "The washin' line snags %n and hoists them, and they hang there between a pillowcase and somebody's bloomers."],
        ["The first peg goes on an earlobe. The second on the other. Then they start goin' on everywhere else.",
         "{t}Pegs go on %n's nipples, one, two, and then all round the soft undersides of their tits, a whole crown of them.",
         "{nt}Pegs bite onto %n's nipples, then march down their chest and belly in a neat little line.",
         "{c}A row of pegs goes down the length of %n's cock, and two more on their balls for luck.",
         "{v}Clothespins pinch the lips of %n's pussy open, one each side, then two more.",
         "Pegs go on the soft insides of %n's thighs, all the way up, wherever there's skin to grip."],
        ["The breeze picks up. %n swings on the line with the sheets, and every peg tugs and stings as they sway.",
         "Somebody flicks the pegs one by one, idly, like plucking a fiddle, and %n yelps on every note.",
         "%n hangs out to dry in the sunshine, pegged all over, while the farm girl hangs up the rest of the laundry round them."],
        ["Then the pegs come off, one at a time, and each one stings worse comin' off than goin' on.",
         "The farm girl runs her hand down the line of pegs and pops them all off at once. %n's yell carries to the far paddock.",
         "Off they come, slow, one every few breaths, and %n is shakin' and gaspin' by the last."],
      ],
      end: [
        "The line lets %n down onto the grass, tender all over and dotted with little pink marks, smellin' of sunshine and clean sheets.",
        "%n is unpegged and unstrung, and sits in the grass rubbin' all the places that sting. Dry, at least.",
        "Down off the line comes %n, pinched pink everywhere, and the farm girl folds them up with the rest of the washin'. Figuratively.",
      ],
    },
  };
  // the herd sire and the farmhands at the post: lines for the anthro scene (10u3-anthro-traps.js runs them)
  Object.assign(ANTHRO_LINES, {
    crate: {
      beats: [
        ["The gate swings shut behind %n and they're in a breedin' crate: steel bars on both sides, a padded bar under their belly, and their rump pressed right up to the back gate.",
         "Bars close round %n on both sides and a belly-bar lifts their hips. It's a breedin' crate, built so the dam can't turn, can't kneel, can't do anything but stand there and be bred.",
         "%n is herded into a narrow steel crate. Cuffs click at their ankles, a bar settles over their back, and the back gate is left open, waitin'."],
        ["Somewhere in the barn a heavy door unbolts. Hooves, slow and heavy, and a snort that shakes the dust off the rafters. The herd sire is comin'.",
         "A farmhand leads him in on a chain: the herd sire, the biggest stud on the farm, a stallion-man near two heads taller than the doorway, already hard and drippin'.",
         "He comes in snortin', the herd sire, and he doesn't need to be shown where to go. He can smell %n from the door."],
        ["He looks %n over through the bars, nostrils flarin', and lays one big hand on their rump, possessive. Then he steps up behind the gate.",
         "He presses up against the back of the crate and %n feels him, hot and heavy and enormous, slap down across their backside.",
         "The crate creaks as he takes hold of the bars on either side of %n's hips. There's nowhere to go, and he knows it."],
      ],
      in: [
        ["He lines his %c cock up with %n's %h and leans in, slow and relentless, the broad head stretchin' them till they're sure it won't fit, and then it does, and keeps comin'.",
         "He breeds %n hard from the first stroke, a %c cock buried in their %h to the root, the crate ringin' with every thrust.",
         "He sinks his %c cock into %n's %h a hand's width at a time, groanin', until they're stuffed so full they can't breathe, and only then does he start to move."],
        ["He floods them the first time with a long shudderin' snort, and he doesn't pull out. He just goes again, slower, deeper.",
         "One load, then he grinds and starts again. The second round is harder. The crate's bars are bent a little by the end of it.",
         "He ruts %n through a second round and a third, and every time he finishes he stays, and swells, and fills them more."],
      ],
      over: [["He can't have them inside, so he ruts against %n through the bars instead, his %c cock dragged up and down their thighs and across their back, and marks the whole crate."]],
      end: ["Three rounds. When the herd sire finally backs out of the crate, %n's %h gushes, and there's still %ml of him packed inside them, sloshin' when they breathe.",
            "The herd sire snorts, satisfied, and is led away. %n hangs over the belly bar, bred to the brim with %ml of stud, legs shakin' too hard to stand.",
            "He leaves %n bred hard and bred deep: %ml of the farm's best seed sealed up in their %h, and the gate swingin' open behind them."],
      endOver: ["The herd sire is led off, still snortin', and %n is left in the crate glazed with him from shoulders to heels.",
                "He marks %n all over and stamps off, and the farm girl has to hose the crate down round them."],
    },
    scarecrow: {
      beats: [
        ["A rope takes %n by the wrists and hauls them up onto the scarecrow post in the middle of the cornfield, arms stretched out along the crossbar.",
         "%n is tied to the scarecrow post, arms out wide, ankles roped to the pole, and somebody plonks a straw hat on their head.",
         "The old scarecrow's been taken down, and %n has been tied up in its place: arms along the crossbar, legs bound to the post, in the middle of the field."],
        ["A crow lands on the crossbar beside %n, looks at them, and decides they're no threat at all.",
         "The farmhands workin' the field stop, look up at the new scarecrow, and grin at each other.",
         "Somebody stuffs a bit of straw into the front of %n's clothes, for authenticity, and gives their rump a pat."],
        ["The first farmhand wanders over at lunch, leans their pitchfork on the post, and makes use of the scarecrow.",
         "\"Best scarecrow we've ever had,\" says a farmhand, and unbuckles. The others line up behind."],
      ],
      in: [
        ["One after another the farmhands take their turn with %n's %h, quick and rough, the post creakin', the crows watchin'.",
         "They use %n's %h in turns between rows of corn, each one pullin' their hat brim down and gettin' back to work after."],
        ["By afternoon %n's lost count. Every farmhand who passes the post takes a turn in their %h before goin' back to the corn.",
         "The last farmhand of the day takes his time with %n's %h while the sun goes down orange behind the cornstalks."],
      ],
      over: [["They can't have %n proper, so each farmhand that passes finishes over them instead, on their belly, their thighs, their straw hat, and the crows keep their distance."]],
      end: ["Untied at sundown, %n slides down the post with %ml of farmhand in their %h, straw in their hair and crows' feathers stuck to them.",
            "The field's empty and %n is let down off the post at last, bred full of %ml from a whole day of farmhands, and no crow went near the corn.",
            "%n is cut down from the post at dusk, drippin' %ml down their thighs. The corn's never been safer."],
      endOver: ["Cut down at sundown, %n is glazed from the hat down and smells like a day's work in the field.",
                "The farmhands untie their scarecrow at dusk, sticky and sun-warm, and leave the hat on them for luck."],
    },
  });
