  /* WHAT'S IN THIS FILE (10y9k-latex-traps.js)
     The latex traps (Laynie, Oct 25: "need more traps for the latex"). Eight of them, each with real latex gear put on
     through the Companion ("Farm can put real gear on me"), its own two extra beats, tender and filthy lines, and a place:
       vacbed      the vacuum bed in the rubber shed: sealed in a latex sheet and the air sucked out
       rubbervat   the rubber vat: dunked in warm liquid latex, and it sets into a skin (a glossy catsuit after, 20 minutes)
       dollmaker   the doll press: hooded, binder on, polished, and stood in the window as the farm's rubber doll
       rubberstall the rubber milkin' stall: sealed in a sheath with only the teats out, and milked (makers of milk only)
       bodybag     the inflatable body bag: zipped in, pumped up tight as a drum, and teased through the rubber
       rubbermaid  the rubber dairymaid: a girl in head-to-toe latex who mitts you, muzzles you and has her way
       blackpool   the black pool in the woods: livin' latex that climbs out, fills you and seals you in it
       rubberpup   the rubber kennel: a whole rubber pup outfit (catsuit, pup hood, the paw-padded petsuit, a dog collar with
                   a bone tag, a leash, and a puppy tail plug, or a strapped-on tail when a plug's ruled out), and you're taught to beg
                   (Laynie, Oct 27: "the rubberpup trap should really feature a full outfit")
     Every one of them leaves livin' latex behind a third of the time, for somebody with ?symbiote on (10v4-symbiotes.js),
     and they come up more often for somebody already wearin' livin' latex (10ua2-trap-weights.js).
     A new place for them, the rubber shed (spots named rubber…, latex…, vat…), and they're in the older places too.
     Limits that mention latex or rubber rule all of them out.
     %n name · %ml how much
  */
  Object.assign(TRAP_KINDS, {
    vacbed:      { icon: "🫧", what: "the vacuum bed in the rubber shed: sealed in a sheet of latex and the air sucked out", limit: /\b(latex|rubber|vacuum|breath|encas|immobil)/i },
    rubbervat:   { icon: "🛢️", what: "the rubber vat: dunked in warm liquid latex until it sets into a second skin", limit: /\b(latex|rubber|encas|dunk)/i },
    dollmaker:   { icon: "🎎", what: "the doll press: hooded, bound and polished into the farm's rubber doll", limit: /\b(latex|rubber|doll|objectif|hood|display)/i },
    rubberstall: { icon: "🍼", what: "the rubber milkin' stall: sealed in a sheath with only your teats out, and milked", limit: /\b(latex|rubber|milk|encas)/i },
    bodybag:     { icon: "🎈", what: "the inflatable body bag: zipped in, pumped up tight, and teased through the rubber", limit: /\b(latex|rubber|inflat|encas|immobil)/i },
    rubbermaid:  { icon: "🧤", what: "the rubber dairymaid: mitts, a muzzle, and her latex hands all over you", limit: /\b(latex|rubber|mitt|muzzl|gag)/i },
    blackpool:   { icon: "⚫", what: "the black pool in the woods: livin' latex that climbs out, fills you and seals you in", limit: /\b(latex|rubber|monster|encas|tentacl)/i },
    rubberpup:   { icon: "🦴", what: "the rubber kennel: zipped into a whole rubber pup outfit (catsuit, pup hood, a petsuit with padded paws, collar and bone tag, leash and tail) and taught to beg", limit: /\b(latex|rubber|pup|pet ?play|hood|petsuit)/i },
  });
  const LATEX_KINDS = ["vacbed", "rubbervat", "dollmaker", "rubberstall", "bodybag", "rubbermaid", "blackpool", "rubberpup"];
  Object.assign(TRAP_NEEDS, {
    rubberstall: mn => (makesMilk(mn) || hasPart(mn, "udder")) && !limitBlocks(mn, "milk") ? null : "nothin' for the stall to milk",
    blackpool:   mn => limitBlocks(mn, "breed") ? "their limits rule it out" : null,
  });
  // they leave livin' latex behind (10v4-symbiotes.js)
  for (const k of LATEX_KINDS){ SYM_TRAP[k] = "latex"; if (!LATEX_TRAPS.includes(k)) LATEX_TRAPS.push(k); }   // (the older slime, suit, glue and dip keep the smaller chance)

  const LATEX_BLACK_GEAR = "#121214";
  // the real gear (10y-farm-gear.js): hood and mitts need Companion 0.42.0
  Object.assign(TRAP_GEAR, {
    vacbed:      [{ when: "hold", slot: "device", label: "Vacuum Bed", items: ["VacBedDeluxe"], color: LATEX_BLACK_GEAR,
                    desc: "A frame strung with a double sheet of black latex, zipped shut round them and sucked flat, every curve of them printed in rubber." }],
    rubbervat:   [{ when: "after", slot: "suit", label: "Vat Skin", items: ["LatexCatsuit"], color: LATEX_BLACK_GEAR, mins: 20,
                    desc: "The vat's latex, set into a seamless glossy skin from the neck down. It peels off eventually. Not yet." },
                  { when: "after", slot: "gloves", label: "Vat Skin (hands)", items: ["LatexElbowGloves"], color: LATEX_BLACK_GEAR, mins: 20,
                    desc: "Dipped to the elbows and set: smooth black latex over every finger, squeakin' when they make a fist." }],
    dollmaker:   [{ when: "hold", slot: "hood", label: "Doll Hood", items: ["LatexHood", "TransparentLatexHood"], color: LATEX_BLACK_GEAR,
                    desc: "A tight black latex hood pulled over the whole head and smoothed down, with a doll's painted smile where a face should be." },
                  { when: "hold", slot: "arms", label: "Doll Binder", items: ["SeamlessLatexArmbinder", "LatexArmbinder"], color: LATEX_BLACK_GEAR,
                    desc: "A seamless latex sleeve that swallows both arms behind them, laced to the shoulders, so a doll stands the way it's posed." },
                  { when: "after", slot: "tag", label: "Doll Tag", items: ["CollarNameTag", "CollarNameTagLivestock"], mins: 20,
                    desc: "A little card on a string round the neck, in the press's tidy print: FARM DOLL. HANDLE FREELY. POLISH WEEKLY." }],
    rubberstall: [{ when: "hold", slot: "torso", label: "Stall Sheath", items: ["LatexSuit"], color: LATEX_BLACK_GEAR,
                    desc: "A black rubber sheath that seals them in from collar to hip with two cut-outs, so the only thing the stall can see is teats." },
                  { when: "hold", slot: "cups", label: "Rubber Cups", items: ["LactationPump", "NippleSuctionCups"],
                    desc: "Soft black rubber cups sucked on through the sheath's openings, pullin' slow and steady, droplets beadin' on the latex round them." }],
    bodybag:     [{ when: "hold", slot: "device", label: "Inflatable Body Bag", items: ["InflatableBodyBag"], color: LATEX_BLACK_GEAR,
                    desc: "A thick black rubber bag zipped up to the chin and pumped till it hugs like a fist. Every squeeze from outside lands everywhere at once." }],
    rubbermaid:  [{ when: "hold", slot: "mitts", label: "Dairymaid's Mitts", items: ["LatexBondageMitts"], color: LATEX_BLACK_GEAR,
                    desc: "Ball-shaped latex mitts strapped on at the wrist. No fingers, no grip, nothing to stop her hands with." },
                  { when: "hold", slot: "lips", label: "Dairymaid's Muzzle", items: ["LatexMuzzleMask", "LatexSheathGag"], color: LATEX_BLACK_GEAR,
                    desc: "A smooth rubber muzzle over the mouth and chin, so the only sounds that get out are the wet, muffled ones." }],
    blackpool:   [{ when: "hold", slot: "legs", label: "Black Pool Latex (legs)", items: ["Slime"], color: LATEX_BLACK_GEAR,
                    desc: "Livin' latex from the pool, climbed up both legs to the hip and set like warm tar, holdin' them knee-deep where they stood." },
                  { when: "hold", slot: "arms", label: "Black Pool Latex (arms)", items: ["Slime"], color: LATEX_BLACK_GEAR,
                    desc: "A glossy black glove of it that ran up both arms and pulled them together, warm and pulsing, like it's breathin'." }],
    // the whole pup (Oct 27): the item names are the game's own (checked against its asset list). The petsuit, collar, tag
    // and tail are only ever those items (only): if this game hasn't got one, nothin' goes on in its place
    rubberpup:   [{ when: "hold", slot: "suit", label: "Rubber Pup Skin", items: ["LatexCatsuit"], color: LATEX_BLACK_GEAR,
                    desc: "A black latex catsuit rolled on from the toes up and smoothed down tight, talc and all, so the pup underneath shines like a wet nose from the neck down." },
                  { when: "hold", slot: "suitLower", label: "Rubber Pup Skin (legs)", items: ["LatexCatsuit"], color: LATEX_BLACK_GEAR,
                    desc: "The catsuit's legs, glossy and seamless, moulded over hips and thighs and down to the toes." },
                  { when: "hold", slot: "hood", label: "Rubber Pup Hood", items: ["LatexDogHood", "LatexDogMask"], color: LATEX_BLACK_GEAR,
                    desc: "A black latex pup hood with floppy ears and a muzzle, pulled down snug and buckled, so the only words left are woofs." },
                  { when: "hold", slot: "arms", label: "Rubber Petsuit", items: ["PawPaddedPetsuitArms"], only: true,
                    desc: "Arms folded at the elbow and laced into the petsuit's latex sleeves, with fat padded paws on the ends. Pups walk on their elbows here." },
                  { when: "hold", slot: "legs", label: "Rubber Petsuit (legs)", items: ["PawPaddedPetsuitLegs"], only: true,
                    desc: "Legs folded at the knee and laced snug into the petsuit, padded where they meet the floor. Pups kneel, and pups crawl." },
                  { when: "hold", slot: "collar", label: "Kennel Collar", items: ["DogCollar"], only: true, color: "#9E1B24",
                    desc: "A wide red dog collar buckled snug, with a ring at the front for the leash. It stays on a while after, so everybody knows." },
                  { when: "after", slot: "collar", label: "Kennel Collar", items: ["DogCollar"], only: true, color: "#9E1B24", mins: 30,
                    desc: "A wide red dog collar buckled snug, with a ring at the front for the leash. It stays on a while after, so everybody knows." },
                  { when: "hold", slot: "tag", label: "Good Pup Tag", items: ["CollarPupBone"], only: true,
                    desc: "A little bone-shaped tag on the collar: GOOD PUP on one side and, on the other, PROPERTY OF THE RUBBER KENNEL." },
                  { when: "after", slot: "tag", label: "Good Pup Tag", items: ["CollarPupBone"], only: true, mins: 30,
                    desc: "A little bone-shaped tag on the collar: GOOD PUP on one side and, on the other, PROPERTY OF THE RUBBER KENNEL." },
                  { when: "hold", slot: "leash", label: "Kennel Leash", items: ["CollarLeash"],
                    desc: "A short red lead clipped to the collar ring, held by the kennel hand, or looped over the kennel post when they're busy." },
                  { when: "hold", slot: mn => pupPlugOk(mn) ? "plug" : null, slotNote: "plug, unless their limits or a belt rule it out", label: "Pup's Tail Plug",
                    items: ["PuppyTailPlug1", "PuppyTailPlug"], only: true,
                    desc: "A fluffy puppy tail on a smooth plug, worked in slow and given a tug to check it's seated. It wags when they wiggle, and they wiggle." },
                  { when: "hold", slot: mn => pupPlugOk(mn) ? null : "tail", slotNote: "tail, when a plug's ruled out", label: "Rubber Pup Tail",
                    items: ["PuppyTailStrap", "PuppyTailStrap1"], only: true, color: LATEX_BLACK_GEAR,
                    desc: "A glossy black puppy tail strapped on at the base of the spine, and it wags when they wiggle." }],
  });
  // a tail plug only where nothin's against it: their limits, or a belt in the way
  function pupPlugOk(mn){ return !/\b(anal|plug|butt ?plug|insert)/i.test((rec(mn) || {}).limits || "") && !holeBlocked(mn, "butt"); }
  Object.assign(TRAP_SOUND_END, { vacbed: "hiss", bodybag: "hiss", rubberstall: "unlatch", dollmaker: "unlatch", rubberpup: "gate" });

  const LATEX_LINES = {
    vacbed: {
      beats: [
        ["The rubber shed door swings shut behind %n, and a stable hand in black gloves is waitin' by a frame strung with two sheets of latex.",
         "%n trips over a hose on the rubber shed floor and lands right between the open sheets of the vacuum bed. Somebody zips it before they're up.",
         "\"In you get,\" says the hand by the vacuum bed, and holds the top sheet up like a blanket. %n is in it before they think to argue."],
        ["The zip runs all the way round, and the latex is cool and slick against every inch of %n's skin.",
         "{t}The sheet settles over %n's tits first, soft and heavy, and then the zip closes over everything else.",
         "A tube goes in by %n's mouth for breathin', and then the lid is sealed."],
        ["The pump starts. The air goes out in one long sigh and the latex comes down on %n like a hand pressin' everywhere at once.",
         "Flat. Every curve of %n is printed in black rubber, and they can't move a finger. The pump hums, satisfied.",
         "{c}The sheet pulls tight over %n's cock and shows off every inch of it, hard and pinned flat against their belly.",
         "{v}The latex sucks into every fold between %n's legs, and it's like bein' licked by somethin' that won't stop."],
        ["The hand runs gloved fingers over the sheet, slow, tracin' %n's outline like a map.",
         "A wand hums against the latex right where it'll do the most good, and %n can't squirm away from it, can't even twitch.",
         "Folk come in to look. Somebody squeaks a palm down %n's flank. Somebody else taps the sheet over their nipples, just to watch them jump."],
      ],
      end: ["The valve hisses, the air rushes back, and the zip comes open on %n, pink and sweaty and slippery, printed with rubber lines.",
            "When the pump finally stops, %n is peeled out of the bed like a sticker off a sheet, glossy with sweat and shakin'.",
            "The lid lifts and the cool air hits %n's soaked skin, and the hand gives them a towel and a pat on the ass."],
    },
    rubbervat: {
      beats: [
        ["There's a vat in the rubber shed as big as a horse trough, full of warm black latex, and %n's foot finds the edge of it on a slick spot.",
         "Two farm hands catch %n under the arms, swing them up, and lower them feet first into the rubber vat, slow, like dippin' a candle.",
         "%n leans over the vat to look, and somebody behind them gives a helpful little shove."],
        ["It's warm as a bath and thick as honey, and it closes over %n's hips, their waist, their chest, and holds there.",
         "They're lowered to the neck. The latex hugs everything it touches, and when they try to move it moves with them, slow and heavy.",
         "{t}The latex swallows %n's tits and holds them, warm and snug, like a pair of hands that came out of the dark."],
        ["Up they come, glistening, and the farm hands hang %n off a hook to drip while the first coat sets.",
         "Then down again. Three coats, four, each one tighter as it dries, until %n is shiny black from the neck down.",
         "{c}%n's cock comes out of the vat in its own glossy sheath, every vein shown off under the shine.",
         "{v}The latex sets into every crease between %n's legs, and it's tight enough to feel like it's always touchin'."],
        ["A hand with a rag and a bottle of polish goes over every inch, buffin' %n till they gleam like a new boot.",
         "The farm hands step back to admire the work, and one of them can't keep their hands off, squeakin' a palm over %n's ass.",
         "Somebody tugs at the set rubber over %n's belly, lets it snap back, and grins when %n gasps."],
      ],
      end: ["%n is let down off the hook in a seamless black skin, glossy from collar to toes, and it isn't comin' off for a while.",
            "They walk %n out of the shed squeakin' at every step, polished and sealed and very, very shiny.",
            "The last coat dries, the farm hands hand %n a mirror, and there's somethin' black and gleamin' lookin' back."],
    },
    dollmaker: {
      beats: [
        ["A woman in a latex apron looks %n up and down at the office door, says \"you'll do,\" and leads them by the wrist to the doll press.",
         "%n wanders into the back room where the farm's dolls are made, and the dollmaker is already measurin' them with her eyes.",
         "\"Stand still,\" says the dollmaker, and %n does, because there's a tape measure round their waist before they can ask why."],
        ["The binder comes first: a long sleeve of latex that swallows %n's arms behind them and laces up to the shoulders.",
         "Then the hood, pulled down over %n's head and smoothed flat, nose holes and nothing else, with a painted doll's smile on the front.",
         "Every buckle is pulled snug and every seam smoothed, and the dollmaker hums while she works, like she's done this a hundred times."],
        ["She polishes %n all over with a soft cloth, slow, till the black catches every light in the room.",
         "{t}She takes her time on %n's tits, buffin' each one in little circles till the nipples stand up through the shine.",
         "She poses %n: chin up, back arched, one knee bent. Then she steps back and moves them an inch to the left.",
         "{c}She tucks %n's cock just so, then decides it looks better standin', and strokes it till it does."],
        ["%n is carried to the shop window and set on a little stand, a card round their neck, for everybody walkin' by to see.",
         "Folk stop at the window and point. One of them comes in and asks how much. The dollmaker says it's not for sale, but they can touch.",
         "Hands. A lot of them, squeakin' over the rubber, testin' how a doll bends. %n can't see any of them coming."],
      ],
      end: ["The dollmaker takes %n off the stand at last, peels the hood off a pink, dazed face, and says they were her best one this week.",
            "The binder's unlaced, the hood comes off, and %n stands there blinking, still wearin' the doll's little card.",
            "%n is unpacked like a parcel, hood first, and the dollmaker writes them a little tag before she lets them go."],
    },
    rubberstall: {
      beats: [
        ["The stall at the end of the barn is lined in black rubber, and the second %n's in it, a rubber sheath is pulled up over them to the collar.",
         "A milkmaid in latex gloves leads %n into the rubber stall and tugs a black sheath over their head and down over their body.",
         "%n steps into the rubber stall and the gate swings shut. There's a sheath hangin' on a hook, and two hands helpin' them into it."],
        ["It seals at the throat and the hip, glossy and tight, with two holes cut right where the teats come through.",
         "{t}%n's tits are pulled through the openings, and the latex squeezes round the base of each one, pushin' them out full and round.",
         "{nt}The sheath's openings sit over %n's nipples and squeeze, and it pushes everything it can toward them.",
         "{nt}The latex is cut away over %n's nipples and squeezes in round them, so they stand out hard, puffy and pink against the shine."],
        ["The cups go on: black rubber, warm, and they suck the teats in deep, slow at first and then steady.",
         "The milk comes down, and the rubber round the cups is slick with it in no time, droplets beadin' and runnin' down the shine.",
         "The milkmaid strokes %n through the sheath while it works, firm, like she's coaxin' a shy cow, and it works."],
        ["Squeezed in rubber, sucked at by the cups, %n can't tell where the sheath stops and they start.",
         "The jug fills. The milkmaid holds it up to the light, nods, and turns the cups up a notch.",
         "{c}A gloved hand finds %n's cock through the sheath and milks that too, in time with the cups, till both are dripping."],
      ],
      end: ["The cups pop off and the sheath peels away, and %n's skin is pink and steaming, teats sore and swollen and %ml lighter.",
            "The milkmaid unseals the sheath, wipes %n down, and carries off %ml in a jug with their name on it.",
            "%n is let out of the stall slick with sweat and milk, %ml emptier, and still feelin' the squeeze of the rubber."],
    },
    bodybag: {
      beats: [
        ["Two farm hands catch %n by the ankles and wrists and lay them in an open bag of thick black rubber on the shed floor.",
         "%n steps on a slick patch by the rubber shed, slides, and lands right in the open mouth of a black inflatable bag.",
         "\"Lie down,\" says the farm hand holdin' the bag open, and %n is in it and zipped to the chin before the word's done."],
        ["The zip runs up past their chin and the pump goes on, and the bag starts to swell round %n like a fist closin'.",
         "It fills and fills. Their arms are pinned to their sides, their legs pressed together, and the rubber creaks with every breath.",
         "Tight as a drum, and still the pump goes, till %n is a black, glossy bundle that can't do anything but wriggle."],
        ["A hand presses on the bag over %n's belly, and the squeeze runs all through the rubber and lands everywhere at once.",
         "A wand hums against the rubber between %n's legs, and the whole bag carries it, like they're bein' touched all over.",
         "{t}Somebody kneads the bag where %n's tits are pressed flat, and the rubber pinches every nipple at once."],
        ["They roll %n over and do it again from the other side, and then they sit on the bag like a cushion and chat.",
         "The farm hands take turns, pressin', squeezin', strokin', and %n's muffled noises get higher every time.",
         "Somebody pumps one more breath of air in, just to hear the rubber creak, and %n squeaks right along with it."],
      ],
      end: ["The valve opens with a long sigh, the zip comes down, and %n spills out of the bag pink and damp and boneless.",
            "When the air's out, %n is peeled from the rubber like a ripe fruit from its skin, sweaty and trembling.",
            "The bag goes flat with a wheeze and %n lies there inside it for a long moment before they can crawl out."],
    },
    rubbermaid: {
      beats: [
        ["A dairymaid in head-to-toe black latex catches %n by the collar at the dairy door, gloves squeakin', and says she's been waitin'.",
         "%n hears squeakin' footsteps behind them, and a girl in a glossy latex dairymaid's dress takes them by the elbow.",
         "\"There you are,\" says the rubber dairymaid, like %n is late for milkin', and leads them off by the wrist."],
        ["She straps round black mitts over %n's hands first, buckled at the wrist, and pats them like she's admirin' a pair of hooves.",
         "Then a rubber muzzle over %n's mouth, smooth and snug, buckled behind the head. \"Better. Now you're quiet.\"",
         "She hums while she straps them in, rubber squeakin' on rubber, and every touch of her gloves is cool and slick."],
        ["Then her hands. Gloved, slippery, and everywhere, slidin' over %n's skin like she's polishin' a prize animal.",
         "{t}She cups %n's tits in her shiny palms and rolls the nipples between rubber fingertips, slow, watchin' %n's face.",
         "{c}She takes %n's cock in a slick latex fist and strokes it, firm and slow, and squeezes on the way up.",
         "{v}Two slick rubber fingers slide between %n's legs and stay there, curlin', unhurried, very sure of themselves."],
        ["She bends %n over the dairy table and keeps goin', and %n's muffled noises bounce round the room.",
         "She brings them right to the edge and holds them there, squeakin' her gloves together, and laughs at the noise they make.",
         "\"Good girl,\" or \"good boy,\" or \"good stock,\" she says, whichever gets the biggest twitch, and then she does it again."],
      ],
      end: ["The rubber dairymaid unbuckles the muzzle and the mitts, kisses %n on the forehead, and squeaks off to find the next one.",
            "%n is left draped over the dairy table, flushed and sticky and still feelin' slick rubber fingers everywhere.",
            "She peels her gloves off with a snap, wipes %n down with them, and leaves them on the table as a souvenir."],
    },
    blackpool: {
      beats: [
        ["There's a pool in the woods that doesn't reflect anything, and when %n steps near it, it reaches out and takes their ankle.",
         "%n kneels by a still black pool to drink, and the surface bulges up into somethin' like a hand and pulls them in.",
         "The ground goes soft under %n's feet, glossy and black, and then it's up past their knees and holdin' on."],
        ["It climbs. Warm as skin, slick as oil, up %n's legs and over their hips, settin' where it's been like tar.",
         "Black latex runs up both of %n's arms and pulls their wrists together, and it pulses, like it's breathin' with them.",
         "{t}A glossy wave of it closes over %n's tits and squeezes, and two little mouths of it latch onto the nipples."],
        ["Then it finds its way in. A thick, slick tendril of it, then another, fillin' %n up slow and certain.",
         "{v}It slides into %n's pussy and swells to fit, and keeps swellin', warm and heavy and alive.",
         "{nv}It pushes into %n's ass and swells to fill them, warm and heavy, and starts to move.",
         "It fucks %n slow and deep, the whole pool rippling with every stroke, and the black creeps up toward their chin."],
        ["It pours itself into them, warm and thick, until %n's belly rounds out with it.",
         "%n can feel it fillin' them and sealin' them at once, inside and out, and it hums like it's pleased.",
         "The pool throbs once, twice, and empties a hot black load into %n, and holds them there while it settles."],
      ],
      end: ["The pool lets go all at once and slides back into itself, and %n crawls out glossy black to the waist and %ml fuller.",
            "%n is spat back out on the moss, the latex peelin' off their skin in warm sheets, belly full and round.",
            "It sets them down gently on the bank, like somethin' it's finished with for now, and the surface goes still."],
    },
    rubberpup: {
      beats: [
        ["A kennel hand with a squeaky toy calls %n over to the rubber kennel, and before they can ask what for, there's a black latex suit held open in front of them like a coat at the door.",
         "%n stops by the black-painted kennel at the end of the row, and two kennel hands step out on either side of them with a catsuit, a hood and very big smiles.",
         "\"Here, pup,\" says the kennel hand, holdin' up a glossy black catsuit by the shoulders, and %n's foot is in it before they've finished sayin' no.",
         "The rubber kennel's gate is standin' open. There's a bowl in there with %n's name painted on it, and a kennel hand sat on an upturned crate, dustin' a black catsuit with talc.",
         "%n sits down on the bench by the rubber kennel for a breather, and their boots are off before they notice, and somebody's rollin' black latex up over their toes.",
         "\"New pup!\" the kennel hand calls over their shoulder, and three more come out of the rubber shed with their arms full of latex.",
         "A whistle, two short notes, and %n turns toward it without thinkin'. The kennel hand who blew it grins. \"Good. You already come when you're called.\"",
         "%n leans on the kennel fence, and a pair of talc-dusted hands starts peelin' their clothes off them from behind, quick and practised."],
        ["The catsuit's rolled up their legs and over their hips and zipped to the throat, squeakin' all the way, and smoothed down everywhere till %n shines like a wet nose.",
         "Then the hood: black latex with a muzzle and floppy ears, pulled down snug and buckled at the back. When %n tries to talk, it comes out a woof.",
         "Their arms are folded at the elbow and laced into the petsuit's sleeves, fat padded paws on the ends, and their legs folded and laced the same, and %n is down on all fours because there's no other way left to be.",
         "A red collar is buckled round %n's throat, snug, with a little bone-shaped tag that says GOOD PUP, and the leash clicks onto the ring.",
         "The tail goes on last, black and fluffy, and the kennel hand gives it a tug to check it's seated, and %n's hips wiggle all on their own.",
         "Every lace is pulled tight and every buckle done up, and the kennel hand runs a palm over %n from hood to tail, squeakin', to check the fit.",
         "{t}The catsuit squeezes %n's tits up round and glossy, and the petsuit laces cross right under them, so they hang heavy and shinin' between %n's front paws.",
         "{c}The catsuit's moulded tight over %n's cock, every inch of it shown off in black shine, and it's already stiffenin' under the rubber.",
         "{v}The latex is smoothed down between %n's legs so tight that every fold of them shows through, glossy, and the kennel hand pats it the way you'd pat a good dog's flank.",
         "%n tries to stand up, and the folded petsuit legs say no, and they tip forward onto their padded paws with a squeak. Everybody laughs, kindly."],
        ["Then lessons. Sit. Beg. Roll over. Every one gets a rub through the latex, and every miss gets a swat on the rump.",
         "{t}\"Beg,\" and %n sits back on their folded legs, paws up, tits bouncin' in the shine, and gets a treat for it.",
         "%n is walked round the kennel yard on a short leash, crawlin' on elbows and knees, nose to the ground, while the other kennel hands watch and clap.",
         "{c}A hand scratches behind %n's rubber ears and then lower, and lower, till their cock's bobbin' under the latex and they're pantin' through the muzzle.",
         "\"Heel.\" %n heels. \"Down.\" %n goes down, chest to the straw, rump up. \"Stay.\" And they stay, tremblin', for a very long time.",
         "\"Speak,\" says the kennel hand, and %n woofs through the hood, and the kennel hand says \"louder,\" and they woof louder, and the whole yard hears it.",
         "%n is taught to shake a paw, and to roll over, and to show their belly, and every time they get it right somebody rubs the belly they showed.",
         "{v}\"Present,\" says the kennel hand, and taps %n's rump, and %n learns what that means very quickly, and gets a long slow rub between the legs for learnin' it.",
         "Every time %n wobbles, the leash comes up short and the kennel hand waits, patient, till they're square on their paws again.",
         "A clicker, a treat, a pat: %n learns to come to the click faster than anybody has ever learned anythin'."],
        ["The kennel hand plays fetch. %n fetches, crawlin' as fast as the petsuit lets them, and every time they get their belly rubbed, and every time the hand rubs a little lower.",
         "%n is told to roll over and show their belly, and the whole yard has a go at rubbin' it.",
         "A bowl of water and a squeaky toy, and %n is left to wag at the end of the leash while folk come by to pat the new pup.",
         "{c}A good pup gets a treat, and %n's treat is a slick rubber-gloved hand round their cock, pumpin' slow, while they pant and wiggle.",
         "{v}Good pups get their scratches, and the kennel hand scratches %n right between the legs, through the latex, till they're humpin' the air.",
         "%n is let off the leash in the yard to play. The kennel hands throw a ball and sit in the shade to watch them chase it on folded legs.",
         "%n learns to hump a kennel hand's boot, and learns it fast, and the hand says \"good,\" over and over, and doesn't move the boot.",
         "Somebody gets down on the straw with %n and wrestles them, rough and laughin', and pins them, and rubs their belly till they're whinin'.",
         "{t}The kennel hand rubs %n's rubber-tight tits like a dog's belly, both hands, round and round, and %n's back leg kicks."],
      ],
      end: ["The hood comes off and the paws are unlaced, and %n's face is pink and sweaty and still makin' little woofs.",
            "%n is let off the leash with a scratch behind the ears and a biscuit, and they still want to sit when they're told.",
            "The kennel hand unbuckles the hood, ruffles %n's sweaty hair, tells them they're a very good pup, and leaves the collar on.",
            "They peel %n out of the rubber like a banana, steamin' and slick, and the collar with its little bone tag stays on, so everybody knows.",
            "The petsuit laces come undone, and %n's arms and legs unfold stiff and tingly, and they stand up on two feet for the first time in ages, and wobble.",
            "%n is rubbed down with a towel like a pup after a bath, the catsuit peeled off them, and sent on their way with GOOD PUP still hangin' at their throat.",
            "\"Same time tomorrow,\" says the kennel hand, unclippin' the leash, and %n nods before they can stop themselves.",
            "Out of the rubber at last, %n is printed all over with latex creases, and for the first few steps they've forgotten how to walk on two legs."],
    },
  };
  const latexLine = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, LATEX_LINES[kind][key]), mn, v);
  function latexRun(mn, kind, hold, where, after, v){
    trapHold(mn, hold, where);
    trapRun(mn, kind, LATEX_LINES[kind].beats, () => {
      let vv = v;
      try { const got = after ? after() : null; if (got) vv = Object.assign({}, v || {}, got); } catch(e){ warn("trap:", e); }
      emote(TRAP_KINDS[kind].icon+" "+latexLine(kind, "end", mn, vv), mn);
    }, v);
  }
  Object.assign(MORE_TRAPS, {
    vacbed(mn){ latexRun(mn, "vacbed", 5, "the vacuum bed", () => { arouse(mn, 35); face(mn, "edged", 60); }); },
    rubbervat(mn){ latexRun(mn, "rubbervat", 5, "the rubber vat", () => { arouse(mn, 20); face(mn, "afterglow", 60); }); },
    dollmaker(mn){ latexRun(mn, "dollmaker", 6, "the doll press", () => { arouse(mn, 25); face(mn, "edged", 60); }); },
    rubberstall(mn){ latexRun(mn, "rubberstall", 5, "the rubber stall", () => {
      const got = drainMilk(mn, ((prodOf(mn) || {}).milk || 0) * 0.6); arouse(mn, 30); face(mn, "afterglow", 60);
      return { ml: ml(got || 0) };
    }); },
    bodybag(mn){ latexRun(mn, "bodybag", 5, "the body bag", () => { arouse(mn, 40); face(mn, "edged", 90); }); },
    rubbermaid(mn){ latexRun(mn, "rubbermaid", 5, "the dairy", () => { arouse(mn, 45); face(mn, "edged", 120); }); },
    blackpool(mn){ latexRun(mn, "blackpool", 6, "the black pool", () => {
      const h = openHole(mn), got = h ? trapFill(mn, h, 260) : 0;
      try { corrupt(mn, 4, "the black pool"); } catch(e){}
      arouse(mn, 50); face(mn, "afterglow", 120);
      return { ml: ml(got || 0) };
    }); },
    rubberpup(mn){ latexRun(mn, "rubberpup", 6, "the rubber kennel", () => { arouse(mn, 20); face(mn, "afterglow", 60); }); },
  });

  // ── their own extra beats (10ue-trap-scenes.js) ──
  trapScene("vacbed",
    ["The latex is so tight now that %n can feel their own heartbeat in it, poundin' back at them from every side.",
     "Sweat pools under the sheet and has nowhere to go, and it makes the rubber slide on %n's skin with every tiny breath.",
     "The hand drums their fingers on the sheet over %n's belly, and it carries all through the bed like a shiver."],
    ["{t}Somebody pinches %n's nipple through the latex, right through, and there's nowhere at all to squirm.",
     "{c}A gloved palm strokes the outline of %n's cock through the sheet, slow, from root to tip, and %n can't even buck into it.",
     "{v}The wand comes back and stays, pressed into the sheet between %n's legs, and the rubber holds them right against it.",
     "The pump gives one more pull, and the latex goes even tighter, and %n lets out a long, muffled noise into the breathin' tube."]);
  trapScene("rubbervat",
    ["One more dip, just to the chin, and the latex fills in every gap the last coats missed, warm and heavy.",
     "%n is turned slowly on the hook so every side gets its share, drippin' long black strings back into the vat.",
     "The farm hands brush the last drips smooth with wide soft brushes, and every stroke is like bein' petted."],
    ["{t}The set latex holds %n's tits up high and round, glossy as two polished apples, and one of the hands gives them a squeeze to check.",
     "{c}They polish %n's cock last, slow, with a lot of polish and a lot of attention, till it's standin' and gleamin'.",
     "{v}A hand slides between %n's legs to smooth the latex down there, and takes far longer about it than it needs to.",
     "They tap the new skin all over with their knuckles, listenin', like you'd check a melon, and it makes %n squirm."]);
  trapScene("dollmaker",
    ["The dollmaker moves %n's chin up with one gloved finger, and %n's head stays where she leaves it.",
     "She paints a little number on the back of %n's neck in white, and writes it in her ledger too.",
     "She checks every buckle twice, slow, like a farmer checkin' the gate's latched, and gives %n's rump a pat when she's done."],
    ["A customer in the window asks if the doll is real. The dollmaker pinches %n's ass and they squeak, and the customer laughs.",
     "{t}A customer's teasin' finger taps the glass, then reaches in round it and tweaks a nipple, and the dollmaker allows it.",
     "{c}One customer can't stop playin' with the doll's cock, and the dollmaker charges them for the polish after.",
     "Somebody bends the doll over to see how far it goes, and the answer is quite a long way."]);
  trapScene("rubberstall",
    ["The milkmaid tightens the sheath another notch at the waist, and everythin' it's holdin' pushes harder at the cups.",
     "The cups pulse, slow and then quick and then slow, and the milk comes in rhythmic squirts that %n can feel in their toes.",
     "Steam curls off the rubber where it meets %n's skin, and the stall smells warm and sweet and like a new tire."],
    ["{t}The milkmaid strips each of %n's teats by hand between pulls, rubber fingers squeezin' every last bead out.",
     "{c}The hand on %n's cock keeps time with the cups, and %n doesn't know which they're closer to.",
     "{v}The milkmaid's knee slides between %n's legs and stays there, pressin' through the sheath, and %n humps it without meanin' to.",
     "\"Good,\" says the milkmaid, pattin' the rubber over %n's belly, \"good, that's it, let it all down.\""]);
  trapScene("bodybag",
    ["Somebody sits right on %n's middle, bouncin' a little, and the whole bag squeezes and squeaks round them.",
     "They tie the bag to a hook and let it swing, and %n sways in the dark, held tight everywhere.",
     "A hand thumps the bag like a drum, and %n feels every thump from their toes to their scalp."],
    ["{t}Two palms press down where %n's tits are pinned, and slide in circles, and the rubber does the rest.",
     "{c}The wand is held right against the bulge of %n's cock, and the bag holds them up into it, nowhere to go.",
     "{v}The wand moves lower, and the bag squeezes %n's thighs together round it, and they can't get away from it at all.",
     "The farm hand leans close to the zip and whispers what they're goin' to do next, and %n can hear every word."]);
  trapScene("rubbermaid",
    ["She snaps her gloves, slow, one finger at a time, so %n can hear exactly what's comin'.",
     "She squirts slick oil into her palms and rubs it in, and the latex shines and squeaks even louder.",
     "She tugs the muzzle strap one hole tighter and says \"there,\" like she's settled somethin'."],
    ["{t}She milks %n's tits with her rubber hands, long strokes from the base to the tip, like she's done it all her life.",
     "{c}She works %n's cock with two slick fists at once, twistin', and stops dead every time they're close.",
     "{v}She curls her slick fingers inside %n and presses her thumb just above, and holds still until %n starts to beg into the muzzle.",
     "She slaps %n's ass with a flat rubber palm, and the crack echoes round the dairy, and then she rubs the sting away."]);
  trapScene("blackpool",
    ["The latex creeps up over %n's shoulders and down their back, smooth and warm, and it ripples where it touches.",
     "Little mouths of it open and close over %n's skin, kissin', suckin', everywhere it's covered.",
     "The pool hums, low, like a purr, and %n can feel it in their teeth."],
    ["{v}Another tendril finds %n's ass while the first one's still in their pussy, and they're stuffed full of warm, livin' black.",
     "{nv}A second tendril joins the first, and %n's ass is stretched round both of them, slick and full.",
     "{t}The mouths on %n's nipples suck harder, and harder, until %n's back arches out of the pool.",
     "{c}A sleeve of it closes round %n's cock and milks it, slow and certain, and drinks every drop it gets."]);
  trapScene("rubberpup",
    ["The kennel hand rubs %n's ears through the hood, and the latex squeaks, and %n's hips wiggle without askin'.",
     "Down, and %n's chest goes to the straw. Up, and they're on their paws again. Every one earns a pat.",
     "The tail gets a tug, gentle, just to see %n wag it, and they do, and everybody coos.",
     "Sweat's runnin' inside the catsuit now, and every move squelches, and %n's as wet and shiny as a seal.",
     "%n's leash is looped over the kennel post while the kennel hand fetches a brush, and %n waits, pantin', because waitin' is what pups do.",
     "The kennel hand brushes %n down with a stiff bristle brush, all over the rubber, in long strokes, and %n leans into every one.",
     "A bowl of water is set down, and %n has to lap at it through the muzzle, and makes a terrible mess, and gets praised for it.",
     "Somebody clips a little bell to %n's collar so the whole yard can hear the new pup comin'."],
    ["{t}\"Show your belly,\" and %n rolls onto their back, paws up, rubber-tight tits bare to the sky, and the kennel hand rubs and rubs.",
     "{c}A good pup gets a treat: a hand wrapped round %n's cock through the latex, a few slow pumps, and then it stops. Good pup.",
     "{v}The kennel hand scratches lower, and lower, till their fingers are rubbin' slick circles between %n's legs through the rubber.",
     "%n is taught to hump the kennel hand's boot, and they learn it fast, and the hand says \"good,\" over and over.",
     "{v}Every time %n presents, a rubber-gloved finger slides along the shine between their legs, slow, and they wiggle back for more.",
     "{c}%n's cock strains so hard against the catsuit that the kennel hand laughs and gives it a rub, the way you'd scratch a pup for bein' keen.",
     "Somebody gets down nose to nose with %n and tells them what a good, good pup they are, and %n's whole back end wiggles.",
     "%n gets a treat for every trick, and the treats are kisses on the muzzle and long slow strokes down their back to the root of their tail."]);

  // ── the intensity dial (10y9b-intensity-lines.js) ──
  Object.assign(INTENSITY_BY_TRAP, {
    vacbed:      { tender: ["The hand keeps one palm flat on the sheet over %n's heart the whole time, so they know somebody's there.", "The bed only goes as tight as a hug, and stays there.", "The breathin' tube smells of mint, and every breath is easy."],
                   filthy: ["Vacuum-packed like a ham, %n's cunt and asshole printed in the rubber for the whole shed to look at.", "Flat and helpless and drippin' inside the sheet, %n is just a body-shaped toy for whoever wants a squeeze.", "The sheet's slick with %n's own juices by the end, and the hand laughs at the wet squelch it makes."] },
    rubbervat:   { tender: ["The latex is warm as a bath and the hands holdin' %n never let them slip.", "They lower %n in slow, a little at a time, till it feels like bein' tucked in.", "Every coat is smoothed down with soft brushes, like bein' groomed."],
                   filthy: ["Dipped like a cheap candle and hung up drippin', %n looks like somethin' you'd fuck and then wipe clean.", "The rubber's set right into %n's crack and over their swollen clit, and every step is goin' to rub.", "Polished to a shine so the farm can see its own reflection in %n's ass."] },
    dollmaker:   { tender: ["The dollmaker is gentle, and every buckle's checked for pinches before it's done up.", "She talks to %n the whole time, soft, tellin' them how lovely they look.", "Every hand on the doll is a careful one, because the dollmaker's watchin'."],
                   filthy: ["A rubber fuckdoll in a shop window, posed with its legs spread and its price on a card.", "Customers stick fingers in every hole the doll's got, and the dollmaker writes each one down.", "%n is nothin' but holes and shine under that hood, and everybody who comes in treats them that way."] },
    rubberstall: { tender: ["The cups start soft and stay soft, coaxin' instead of pullin'.", "The milkmaid strokes %n's hair through the gap in the sheath, and murmurs.", "The rubber's warm, and it holds %n like a hammock while they let down."],
                   filthy: ["Sealed in rubber with just their udders hangin' out, %n is a milk bag with legs.", "The cups suck %n's teats out long and dark and they're moanin' like a cow in season.", "Milk and cunt-juice both run down the inside of the sheath, and it squelches when they move."] },
    bodybag:     { tender: ["It's like bein' held by somethin' enormous and warm, and %n stops fightin' it.", "The farm hand pats the bag over %n's shoulder, gentle, every few minutes.", "The pressure is even everywhere, and it's the stillest %n's been all week."],
                   filthy: ["Pumped up and squeezed, %n's tits and cunt crushed against the rubber, and they're squealin' in there like a pig.", "The farm hands use %n like a beanbag that moans, and take turns grindin' on it.", "%n cums in the bag, and nobody notices, and the wand doesn't stop."] },
    rubbermaid:  { tender: ["Her hands are slow and sure, and she never once hurries %n.", "She kisses the muzzle where %n's lips are, through the rubber, and smiles.", "She stops to stroke %n's cheek when they're shakin' too hard, and waits."],
                   filthy: ["She fucks %n with her slick rubber fingers like she's milkin' a dumb cow, and calls them one.", "Drool runs out round the muzzle and %n's leakin' on the floor, and she laughs and makes them lick it off her glove.", "She edges %n till they're humpin' her rubber thigh like a dog, and then she does it again."] },
    blackpool:   { tender: ["The pool is warm, and it moves slow, and somethin' in how it holds %n feels almost fond.", "It fills them gently, like a tide comin' in.", "It hums when %n shivers, and goes slower."],
                   filthy: ["It pumps %n full of hot black slime till their belly bulges and it's oozin' out round every tendril.", "Every hole stuffed with livin' latex at once, %n is a host and a toy and nothin' else.", "It fucks %n like a breedin' pen fucks a sow, and they're beggin' for it to keep goin'."] },
    rubberpup:   { tender: ["The kennel hand is all praise and scratches, and %n's tail really does start to wag.", "Every trick earns a treat and a cuddle, and nobody is cross with a pup that gets it wrong.", "The paws are padded soft, and the leash is never yanked.",
                            "The petsuit is laced snug, never tight, and the kennel hand checks %n's paws for pinches every few minutes.", "\"Good pup, good pup,\" over and over, soft, and a hand that never stops strokin' %n's back.",
                            "Every time %n's unsure, the kennel hand gets down on the straw with them and shows them, patient."],
                   filthy: ["A rubber bitch on a leash, %n is taught to present and hump boots and beg with their tongue out.", "Their cunt's drippin' on the straw and the whole kennel yard can smell what a needy pup they are.", "Good pups get bred, the kennel hand says, and %n wags so hard at that it's embarrassin'.",
                            "\"Down,\" and %n's rubber face goes to the straw and their rump goes up, and everybody in the yard knows what for.",
                            "%n's leash is tied off at the post and they're left presentin' for anybody walkin' past, under a sign: TRY BEFORE YOU BUY.",
                            "{c}The kennel hands jerk %n's cock through the latex till it's drippin', and then make them lick it off a rubber glove."] },
  });

  // ── the general beats they draw on (10ud-trap-depth.js) ──
  depthOf(["held"], ["vacbed", "rubbervat", "dollmaker", "rubberstall", "bodybag", "rubbermaid", "blackpool", "rubberpup"]);
  depthOf(["tease"], ["vacbed", "dollmaker", "bodybag", "rubbermaid", "rubberpup"]);
  depthOf(["milk"], ["rubberstall"]);
  depthOf(["breed"], ["blackpool"]);
  depthOf(["watched"], ["dollmaker", "rubberpup", "vacbed"]);

  // ── where they are (10ua-trap-themes.js): the rubber shed, and the older places ──
  TRAP_THEMES.rubber = { label: "the rubber shed", near: /rubber|latex|^vat/, kinds: LATEX_KINDS.concat(["slime", "suit", "glue"]) };
  for (const [place, kinds] of Object.entries({
    stalls: ["rubberstall", "rubbermaid"], kennel: ["rubberpup"], office: ["dollmaker"], wildlife: ["blackpool"], cabin: ["vacbed", "bodybag"],
    bench: ["vacbed", "dollmaker"], trough: ["rubbervat"], stockade: ["dollmaker"],
  })) for (const k of kinds) if (TRAP_THEMES[place] && !TRAP_THEMES[place].kinds.includes(k)) TRAP_THEMES[place].kinds.push(k);

  // ── what the moment draws (10ua2-trap-weights.js) ──
  TW.latex.kinds.push(...LATEX_KINDS);
  for (const [f, ks] of Object.entries({ corrupt: ["blackpool", "rubbervat"], night: ["blackpool"], alone: ["blackpool", "vacbed", "bodybag"],
                                         crowd: ["dollmaker", "rubberpup"], milk: ["rubberstall"] })) for (const k of ks) if (!TW[f].kinds.includes(k)) TW[f].kinds.push(k);
