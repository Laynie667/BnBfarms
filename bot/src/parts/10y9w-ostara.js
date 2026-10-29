  /* WHAT'S IN THIS FILE (10y9w-ostara.js)
     OSTARA on the farm (Laynie, Oct 27: "soltice and equinox based packs with pagan/wiccan themes would be cool"): the
     spring equinox, Mar 17 to 23 by the bot's clock, when the day and the night are even and the whole farm wakes up. The
     old spring customs, kept the farm's way: the March hares boxin' in the long grass, the Green Man out of the hedge (a
     farmhand in a mask of new leaves), the first sowin', the egg-dyein' tubs, the equinox see-saw that balances the day
     against the night, and the nixie in the thaw-brook. The warren, the egg posts, the seed shower, the vines and the
     plough come round more, and the farm girl wears a crown of spring flowers, hare's ears and a hare's tail.
       marchhares  two hare-men boxin' in the long grass over who gets you first, and the loser doesn't really lose
       greenman    the Green Man steps out of the hedge and claims the first bloom of spring, and crowns you with it after
       sowing      laid in the first furrow and tied to the plough, and the sowers sow you before they sow the field
       eggdye      dunked in the egg-dyein' tubs one colour after another, and the dyers paint flowers on you
       balance     the equinox see-saw: the day on one end, the night on the other, and you're what balances them
       nixie       the thaw-brook nixie: cold hands, colder kisses, and a clutch of her pearly spawn
     New messes for the Companion to draw: egg dye (pastel) and pollen.
     %n name · %c the cock · %h the hole · %ml how much · %x how many
  */
  Object.assign(MESS, { dye: "#E7A3C8", pollen: "#F2C230" });
  season("ostara", {
    label: "Ostara", icon: "🌱",
    alias: ["springequinox", "vernalequinox", "spring", "springtime", "thaw", "equinoxspring"],
    on: (dt) => { const d = md(dt); return d >= 317 && d <= 323; },
    dates: () => "Mar 17 – 23, the spring equinox",
    blurb: "the day and the night even, the hares boxin', and the whole farm wakin' up",
    why: ["It's Ostara, the spring equinox, and the farm's wakin' up all at once.", "The day and the night are even this week, sugar, and somethin' tipped the balance your way.",
          "Spring's come to the farm, and spring wants things.", "The sap's risin' at Ostara, sugar, in everythin' on the farm."],
    start: ["Ostara's come to the farm: the spring equinox, when the day and the night are even. The hares are boxin' in the top meadow, the hedges are full of catkins, and the first furrow's waitin' to be sown.",
            "It's the spring equinox, sugar. The thaw-brook's runnin' high, the dye tubs are out for the eggs, and somebody's seen the Green Man at the end of the lane again.",
            "Ostara on the farm! Primroses in the banks, catkins on the hazels, the see-saw up on the green and the whole farm feelin' the sap rise."],
    end: ["Ostara's over. The days are longer than the nights now, the furrows are sown, and the hares have calmed down. Mostly.",
          "The equinox has tipped, sugar. The light's winnin', the dye tubs are scrubbed out, and the Green Man's gone back into the hedge till next spring."],
    also: ["warren", "eggs", "seedshower", "vines", "plow"],
    // the farm girl's: a crown of spring flowers, hare's ears and a hare's tail (only those, never a stand-in)
    costume: [
      { slot: "hat", name: "Spring Crown", items: ["FlowerCrown"], desc: "A crown of the first spring flowers: primroses, violets and hazel catkins." },
      { slot: "ears", name: "Hare Ears", items: ["FloppyBunnyEars", "BunnyEars1"], color: "#B08A64", desc: "Long brown hare's ears, for the March hares she's pretendin' to be." },
      { slot: "tail", name: "Hare's Tail", items: ["BunnyTailStrap"], color: "#F2EDE4", desc: "A fluffy white scut of a tail that bobs when she hops about." },
    ],
  });
  for (const [k, places] of Object.entries({ warren: ["wildlife", "pasture"], eggs: ["wildlife", "stalls"], seedshower: ["pasture", "stalls"], vines: ["wildlife"], plow: ["pasture"] }))
    if (!SEASON_PLACES[k]) SEASON_PLACES[k] = places;

  // ── the March hares ──
  seasonTrap("ostara", "marchhares", {
    icon: "🐇", what: "the March hares: two hare-men boxin' in the long grass over who gets you first, and the loser doesn't really lose", limit: /\b(gang|rabbit|bunn|hare|threesome)/i,
    stud: { sire: -74, name: "the March hares", type: "human", loads: 4, ml: 90, hold: 7, hole: "vulva", bonus: 1.6, where: "the long grass" },
    lines: {
      beats: [
        ["Out in the top meadow the grass is long and green again, and two hare-men are up on their back legs in it, boxin', fur flyin', and they both stop dead when %n comes over the stile.",
         "%n hears the thump, thump of big feet in the long grass, and two tall brown hare-men come boundin' out of it, ears up, noses twitchin', and circle them.",
         "It's March, and the hares have gone mad the way they do, and two of them, tall as farmhands and twice as quick, have decided %n is what they're mad about."],
        ["They box over %n, paws up, ears back, a flurry of thumps, and %n ends up pushed down in the grass in the middle of it with a hare on either side.",
         "The bigger one bowls %n over into the long grass with one great hop, and the other boxes his ears for it, and then they both look down at %n.",
         "They stand over %n in the grass, chests heavin', fur all on end, and settle it the way March hares settle everythin': whoever's quickest."],
        ["Whiskers on %n's neck, quick little licks on their ear, and big soft paws pullin' their clothes off, all four paws at once, and nobody's arguin' any more.",
         "{c}A furry paw closes round %n's cock and strokes, fast and twitchy, while the other hare noses down their belly.",
         "{v}A hare's nose twitches between %n's thighs, warm breath and soft whiskers and then a long quick tongue, and their pussy's wet before they've finished gaspin'.",
         "{t}The hares nuzzle %n's tits, one each, soft fur and wet noses, and nibble very gently with their big front teeth.",
         "It's all quick paws and twitchin' noses and long legs thumpin' the ground, and %n's on their back in the grass with hare fur against every inch of them."],
      ],
      in: [
        ["The first hare's in %n's %h in one quick thrust, and he's fast, so fast, thumpin' his big foot on the ground with every buck of his hips.",
         "The winner mounts %n's %h and ruts quick as a heartbeat, and the loser sits up in the grass and waits his turn, twitchin' all over."],
        ["The first finishes with a squeal and a shudder and hops off, and the second's on %n before they've caught their breath, and then the first one's back again.",
         "They take turns, and turns, and more turns, the way hares do, quick and over and again, till %n's lost count and the grass is flattened for yards."],
      ],
      over: [["They don't take them. They rut against %n's thighs and belly, quick and twitchy, one and then the other and then the first again, and spill across them in the grass."]],
      end: ["The March hares box each other one last time for luck and bound off into the long grass, and leave %n in a flattened patch of meadow with %ml of hare in their %h.",
            "%n's left in the meadow with grass in their hair and %ml in their %h, and somewhere over the hill the two hares are boxin' again already.",
            "The hares lick %n's face, both at once, thump their feet, and they're gone, and %n's lyin' in the long grass full of %ml of them, laughin' at the sky."],
      endOver: ["%n sits up in the grass with %ml of hare across their belly, and the two of them are boxin' off over the hill.",
                "The hares bound away and leave %n in the flattened grass, spattered with %ml of quick hot March madness."],
    },
    scene: [["A skylark goes up out of the meadow singin' its head off, and doesn't come down for a long time.",
             "The grass is long and wet and smells green, and every so often a hare's big foot thumps it flat.",
             "The two of them stop to box again in the middle of it all, quick as anythin', and then remember what they were doin'.",
             "There are primroses in the grass by %n's head and catkins on the hedge, and the whole meadow's buzzin' with spring."],
            ["{t}A hare nibbles %n's nipple with his soft split lip, and his whiskers tickle, and he does it again because they squeaked.",
             "{c}The waitin' hare can't wait. He strokes %n's cock with a quick paw, his nose twitchin' with every stroke.",
             "{v}A long furry finger finds %n's clit and flicks it, quick and twitchy, keepin' time with the other hare's hips.",
             "A hare washes %n's face with his tongue, quick little licks, the way hares wash their own."]],
    tender: ["The hares are quick but gentle with it, all soft fur and warm noses, and they keep checkin' %n's face.", "One hare lies by %n's head and strokes their hair the whole time.",
             "They nuzzle %n after, one each side, warm and soft and twitchy, before they bound off."],
    filthy: ["%n's passed between two horny March hares in the long grass, again and again, quick as rabbits and twice as many times.", "%n's flat on their back in the meadow takin' hare after hare, legs in the air, beggin' the mad ones for more.",
             "The hares rut %n like it's the only thing spring's for, and %n's moanin' that it is."],
    depth: ["breed"], tw: ["day", "breed", "alone"], places: ["pasture", "wildlife"], sound: "straw", tags: ["furry"],
    writes: ["MARCH MAD", "HARE'S", "SPRING FEVER", "BOXED AND BRED"],
  });

  // ── the Green Man ──
  seasonTrap("ostara", "greenman", {
    icon: "🍃", what: "the Green Man: a farmhand in a mask of new leaves steps out of the hedge and claims the first bloom of spring, and crowns you with it after", limit: /\b(mask|stranger|outdoor)/i,
    stud: { sire: -75, name: "the Green Man", type: "human", loads: 2, ml: 240, hold: 7, hole: "vulva", bonus: 1.4, where: "the hedgerow", person: true,
            after(mn){ trapMess(mn, "greenman", "pollen", ["pollen", ["chest", "tummy", "face"]]); } },
    lines: {
      beats: [
        ["The hedge at the end of the lane rustles though there's no wind, and out of it steps the Green Man: a big farmhand in a mask of new oak and hawthorn leaves, ivy round his arms, catkins in his hair. Every spring somebody wears it. This spring he's lookin' at %n.",
         "%n's walkin' by the hedgerow when a leafy hand comes out of it and takes their wrist, gentle and very firm, and the Green Man steps out after it, all leaves and moss and green-painted skin.",
         "Somebody's been tellin' stories round the farm all week that the Green Man's been seen in the lane. %n laughed. Now he's standin' in front of them, tall and green and leafy, and %n's not laughin'."],
        ["\"First bloom of the spring,\" he says from behind the leaves, and lays %n down in the long grass under the hedge, among the violets.",
         "He walks %n backwards into the hedge till the hawthorn's at their back and the leaves are all round them, and the lane's gone, and there's only him.",
         "He picks %n up as if they were a bundle of sticks and carries them into the copse, to a bank of moss where the sun comes through, and lays them in it."],
        ["He undresses %n with big careful hands that smell of sap and turned earth, and every bit of skin he uncovers he dusts with pollen off the catkins in his hair.",
         "{c}A green-painted hand takes %n's cock and strokes it slow, like he's coaxin' somethin' up out of the ground.",
         "{v}He kneels and buries his leafy face between %n's thighs, and the leaves tickle and the tongue doesn't, and their pussy's soon as wet as the dew.",
         "{t}He kisses %n's tits through the leaves of his mask, slow, and the leaves brush their nipples till they're stiff as buds.",
         "The leaves of his mask rustle against %n's skin wherever he kisses them, and he kisses them a lot of places."],
      ],
      in: [
        ["He takes %n's %h slow and deep, the way the roots go down, and the moss is cool under them and he's warm as the sun.",
         "He settles between %n's thighs and pushes into their %h, slow and patient as spring, and doesn't hurry for anythin'."],
        ["He fills %n twice, deep, with a groan that sends the rooks up out of the copse, and holds them through it with his leaves all round them.",
         "When he cums it's warm and deep and goes on and on, and he stays in them after, holdin' still, like somethin' plantin' itself."],
      ],
      over: [["He doesn't take them. He kneels over %n in the moss and strokes himself till he spills across their belly, warm, like the first rain on a field."]],
      end: ["The Green Man weaves a crown of violets and primroses while %n gets their breath back, puts it on their head, and steps back into the hedge, and the leaves close behind him. %n's left in the moss with %ml in their %h and pollen all over.",
            "%n's left lyin' on the mossy bank, %ml of the Green Man in their %h, crowned with spring flowers, and the hedge is just a hedge again.",
            "\"The first bloom's picked,\" says the Green Man, and kisses %n through his leaves, and then he's gone, and %n's sittin' in the violets with %ml in their %h and a flower crown slippin' over one eye."],
      endOver: ["The Green Man crowns %n with violets, leaves %ml of him across their belly, and steps back into the hedge without a sound.",
                "%n's left in the moss painted with %ml of the Green Man and dusted gold with pollen, and the hedge doesn't so much as rustle."],
    },
    scene: [["A blackbird sings in the hedge right over them, very loud, as if it's tellin' everybody.",
             "Catkins shake loose from the Green Man's hair with every move, and the pollen drifts down over them both in a gold haze.",
             "The sun comes and goes through the new leaves, and the moss smells of rain and earth.",
             "Somewhere out in the lane a farmhand calls a name that might be the Green Man's real one, and he doesn't answer."],
            ["{t}He rubs pollen into %n's tits with his thumbs, slow, till they're gold and tinglin'.",
             "{c}He strokes %n's cock in time with his hips, his green-painted hand slick and warm.",
             "{v}His thumb finds %n's clit and circles it, slow as a bud openin'.",
             "He kisses %n deep through the leaves of his mask, and he tastes of sap and honey."]],
    tender: ["He's slow and kind and careful, and his leafy hands stroke %n's hair all the way through.", "He lays his own cloak of ivy under %n so the ground isn't cold.",
             "Every so often he stops to tuck a flower in %n's hair, as if he can't help it."],
    filthy: ["%n's on their back in the hedgerow gettin' bred by a man in a mask of leaves, and they're beggin' him to plant it deep.", "The Green Man ruts %n into the moss like he's sowin' a field, and %n's moanin' for every seed.",
             "%n's a pollen-dusted, grass-stained, well-planted mess, and the Green Man's not done plantin'."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Ivy Bands", items: ["HempRope"], color: "#3E6B2A", desc: "Ivy, wound round their wrists by the Green Man and tied to a hawthorn root." },
           { when: "after", slot: "hat", label: "First Bloom Crown", items: ["FlowerCrown"], mins: 30, desc: "A crown of violets and primroses the Green Man wove for the first bloom of spring." }],
    depth: ["breed"], tw: ["day", "alone", "breed"], places: ["wildlife", "pasture"], sound: "straw", tags: [],
    writes: ["FIRST BLOOM", "PLANTED", "GREEN MAN'S", "SPRING"],
  });

  // ── the first sowin' ──
  seasonTrap("ostara", "sowing", {
    icon: "🌱", what: "the first sowin': laid in the first furrow of spring and tied to the plough, and the sowers sow you before they sow the field", limit: /\b(gang|public|mud|dirt|outdoor)/i,
    stud: { sire: -76, name: "the sowers", type: "human", loads: 3, ml: 150, hold: 8, hole: "vulva", bonus: 1.5, where: "the first furrow", person: true },
    lines: {
      beats: [
        ["The big field's been ploughed for spring, the furrows long and dark and smellin' of rain, and the sowers are out with their seed bags. \"Old custom,\" the head sower says to %n. \"The first furrow gets sown by hand. By three hands, actually.\"",
         "%n comes down to the big field to watch the sowin' and finds the sowers waitin' at the top of the first furrow, seed bags on their hips, grinnin'. \"There's our luck for the year.\"",
         "The plough's standin' at the end of the first furrow with the earth fresh-turned behind it, and three sowers in their smocks are standin' by it, and when they see %n one of them says, \"Told you somebody'd come.\""],
        ["They lay %n down in the furrow, warm earth on either side, and tie their ankles to the plough's handles with the plough rope so they can't close their legs.",
         "The earth's soft and damp in the furrow, and the sowers lay %n in it face down, knees in the soil, and loop the plough rope round their ankles.",
         "They tie %n to the plough by the ankles with its own rope, spread across the furrow like they're part of the field, and the head sower scatters a handful of seed over them for luck."],
        ["The sowers stand round the furrow, smocks up, and decide the order the old way: by who sowed the most last year.",
         "{c}One of them kneels in the furrow and strokes %n's cock while the others argue about who's first. \"Got to get the soil warm,\" he says.",
         "{v}A sower spreads %n's pussy open with two earthy fingers, checks they're wet, and nods. \"Ready for sowin'.\"",
         "{t}The head sower kneels by %n's head and squeezes their tits, one in each hand, and says the sowin' rhyme, and the others say it back."],
      ],
      in: [
        ["The first sower kneels in the furrow and pushes into %n's %h, slow and deep, and the others start sowin' the rhyme, and he keeps time with it.",
         "One after another the sowers kneel in the furrow and take %n's %h, each one deep and steady, the way you put a seed in."],
        ["Three sowers, three loads, every one planted deep, and the head sower pats the earth round %n like they've been sown proper.",
         "The last sower finishes with a shout that carries across the whole field, and the others cheer, and somebody throws seed in the air like confetti."],
      ],
      over: [["They don't take them. They kneel round %n in the furrow and stroke themselves over them, one after another, and sow the earth and %n both."]],
      end: ["The sowers untie %n from the plough and help them up out of the furrow, earthy to the knees, %ml of the sowers in their %h, and then they go off to sow the rest of the field, singin'.",
            "%n climbs out of the first furrow with %ml in their %h, soil on their knees and seed in their hair, and the sowers tip their hats and get back to work.",
            "The head sower pats %n's belly. \"That's the field sown,\" he says, and %n waddles off home with %ml in their %h and the whole field to walk across first."],
      endOver: ["%n's let up out of the furrow sown all over with %ml of seed, and the sowers go back to the field cheerin'.",
                "The sowers untie %n, dusty and spattered with %ml of them, and call it the best start to a spring they've had."],
    },
    scene: [["Rooks come down on the far end of the field to pick at the furrows, and nobody shoos them.",
             "The earth's warm where the sun's been on it and cold where it hasn't, and %n can feel both.",
             "The sowin' rhyme goes round and round, one line each, and it gets slower and breathier as it goes.",
             "The plough horse stands at the end of the field and crops the hedge, and doesn't look round once."],
            ["{t}A sower's earthy hands are on %n's tits, kneadin' slow, leavin' brown fingerprints.",
             "{c}Somebody strokes %n's cock in the furrow while they wait their turn, slow, with soil on their fingers.",
             "{v}A thumb on %n's clit, circlin' in time with the rhyme, while the next sower gets ready.",
             "A sower scatters seed down %n's back, and it tickles, and it sticks."]],
    tender: ["The sowers lay a sack in the furrow first, so the earth's not cold under %n.", "They take their time, and the head sower holds %n's hand all the way through.",
             "Every sower kisses %n before he kneels, the old way, for luck."],
    filthy: ["%n's tied spread in the dirt and passed round three sowers like it's plantin' season, which it is.", "%n's knees-deep in the furrow, bred like a field and moanin' for the next seed.",
             "The sowers plough %n into the soil one after another, and %n's beggin' them to sow the whole field the same way."],
    mess: ["mud", ["tummy", "chest"]],
    gear: [{ when: "hold", slot: "legs", label: "Plough Rope", items: ["HempRope"], color: "#7A5A3A", desc: "The plough's own rope, round their ankles and tied off to the handles, holdin' them spread across the first furrow." }],
    depth: ["breed", "held", "watched"], tw: ["day", "breed"], places: ["pasture"], sound: "rope", tags: ["restraint", "public"],
    writes: ["SOWN", "FIRST FURROW", "SOWN FIELD", "PLANTED DEEP"],
  });

  // ── the egg-dyein' tubs ──
  seasonTrap("ostara", "eggdye", {
    icon: "🥚", what: "the egg-dyein' tubs: dunked in one colour after another till you're as pastel as the eggs, and the dyers paint flowers on you while you dry", limit: /\b(messy|paint|wet|dunk|public)/i, hold: 6, where: "the dye tubs",
    lines: {
      beats: [
        ["The dye tubs are out in the yard for the spring eggs, a row of them, pink and yellow and blue and lilac, and the dyers have run out of eggs. They look at %n.",
         "%n leans over the dye tubs to see the colours, and a pair of hands takes them by the hips and somebody says, \"Ooh, this one's a big one,\" and in they go.",
         "There's a line of eggs dryin' on a rack by the dye tubs, every colour of spring, and a space at the end of it about %n's size, and the dyers are wavin' them over."],
        ["They dunk %n in the pink tub first, right up to the chin, and hold them under the warm dye while it soaks in, and bring them up blushin' all over.",
         "Into the yellow tub, then, legs and all, and the dyers swish %n about in it with their hands to make sure the colour takes everywhere.",
         "They tie %n's wrists to the edge of the tub with a ribbon so they won't float off, and dunk them, and dunk them again, to get the colour even."],
        ["Then the blue tub, and the lilac, and by the end of it %n's every colour of the rack at once, and the dyers can't stop laughin'.",
         "{t}A dyer works the dye into %n's tits with both hands, slow, round and round, to get the colour into every bit of them.",
         "{c}The dyer's hands work lilac dye up and down %n's cock, very thorough, much more thorough than an egg needs.",
         "{v}A dyer's fingers work the pink right in between %n's legs, slow, and the dye isn't the only thing that's slick down there."],
        ["They sit %n on the rack to dry with the eggs, and paint them while they do: daisies on their shoulders, a bee on their hip, swirls and dots and a big bow on their bum.",
         "Out come the little brushes, and the dyers paint flowers all over %n while the dye dries, and the brushes tickle, and they paint slower when %n squirms.",
         "The dyers kneel round %n with their paint pots and decorate them like the best egg of the year, every bit of them, and argue about where the last flower goes."],
      ],
      end: ["They let %n off the rack at last, pastel from head to toe and painted with flowers, and give them a little paper ribbon for Best Egg.",
            "%n's let up off the egg rack dyed every colour of spring, flushed underneath it, and the dyers hang a FRAGILE sign round their neck for the walk home.",
            "The dyers untie %n, admire their work, and send them off across the yard lookin' like the brightest egg on the farm, still dyed pink in places nobody can see."],
    },
    after(mn){ arouse(mn, 35, 90); face(mn, "afterglow", 90); return null; },
    scene: [["The dye tubs steam in the cool spring air, and smell of vinegar and onion skins and somethin' sweet.",
             "A row of finished eggs looks on from the rack, every one of them a prettier colour than %n's ever seen an egg.",
             "The dyers sing while they work, a silly song about a hen who laid a rainbow, and they've changed the words to be about %n.",
             "Somebody comes by with a basket for the eggs and stops and stares and doesn't put %n in it. Quite."],
            ["{t}A dyer paints a daisy round each of %n's nipples, very slowly, with the very tip of the brush.",
             "{c}Somebody paints a stripe of yellow right down the length of %n's cock and blows on it to dry it.",
             "{v}A dyer paints a little flower on the inside of %n's thigh, then another higher up, then another higher than that.",
             "A dyer dots paint along %n's collarbone with a fine brush, one dot at a time, very close, breathin' on their skin."]],
    tender: ["The dye's warm, and the dyers check every tub with their elbows first so it's never too hot.", "The dyers wrap %n in a big soft towel between colours and rub them dry.",
             "Every flower they paint, the dyer asks %n where they'd like the next one."],
    filthy: ["%n's dunked and swished and rubbed and painted like an egg, and they're wet as the tubs and moanin' for another dunk.", "The dyers work the colour into every inch of %n with their hands, and %n's grindin' on every one of them.",
             "%n's the farm's prettiest Easter egg, and the dyers are takin' their sweet time paintin' the cracks."],
    mess: ["dye", ["chest", "tummy", "face", "thighs"]],
    gear: [{ when: "hold", slot: "arms", label: "Dye-Tub Ribbon", items: ["Ribbons"], color: "#E7A3C8", desc: "A pastel pink ribbon round their wrists, tied to the edge of the dye tub so they don't float off." }],
    depth: ["mess", "watched", "tease"], tw: ["day", "crowd"], places: ["trough", "stalls", "cabin"], sound: "wet", tags: ["messy", "public"],
    writes: ["BEST EGG", "FRAGILE", "HAND PAINTED", "DYED FOR SPRING"],
  });

  // ── the equinox see-saw ──
  seasonTrap("ostara", "balance", {
    icon: "⚖️", what: "the equinox see-saw: the day on one end and the night on the other, and you're what balances them, sat down on the post in the middle", limit: /\b(toy|dildo|tease|edg|denial|public)/i, hold: 6, where: "the equinox see-saw",
    lines: {
      beats: [
        ["Up on the green there's a great see-saw for the equinox, one end painted gold for the day and the other painted black for the night, and right in the middle there's a seat with a smooth wooden post standin' up out of it, and every farmhand on the green is lookin' at %n.",
         "The farmhands have put up the equinox see-saw on the green, as they do every spring, and they're lookin' for somebody to balance it, and they're lookin' at %n.",
         "%n wanders up onto the green and finds the equinox see-saw waitin', a day end and a night end and a seat in the middle with a polished wooden post in it, and two farmhands already sat on the ends."],
        ["They sit %n on the middle seat, slow, onto the post, and strap their legs to the beam so they can't climb off, and the post's smooth and thick and doesn't stop till %n's sat right down on it.",
         "They lower %n onto the polished post in the middle, slow, an inch at a time, till they're sat full on it, and buckle their thighs to the beam.",
         "\"Day and night even,\" says the farmhand on the gold end, \"and you're the even.\" They sit %n down on the middle post and strap them to the beam."],
        ["Then the farmhand on the day end pushes off, and the beam tips, and the post shifts in %n, and the night end comes down, and it shifts back, and the green goes very quiet.",
         "Up goes the day, down goes the night, and every time it tips the post rocks inside %n, and every time they gasp the farmhands push off a bit harder.",
         "The farmhands take turns on the ends, and every tip of the see-saw rocks %n on the post, slow, up and down, back and forth, and it never quite stops."],
        ["They bounce it, then, gentle and then not gentle, and the whole green's watchin', and %n's right on the edge and the see-saw won't let them over it.",
         "{c}%n's cock bobs with every tip of the beam, stiff and achin' and nobody touchin' it, and the farmhands make the tips slower on purpose.",
         "{v}%n's grindin' down on the post with every tip, slick and desperate, and every time they nearly get there the see-saw comes level and stops.",
         "Every time %n's close, the farmhands stop the see-saw dead level, and wait, and grin, and then start it again."],
      ],
      end: ["The day end and the night end come down together at last, perfectly even, and the farmhands unbuckle %n and lift them off the post, shakin', flushed, and still right on the edge.",
            "They lift %n off the see-saw at sundown, when the day and the night are even, and %n can barely stand, and nobody let them finish, and that was the point.",
            "%n's unstrapped and lifted off the polished post achin' and edgy and wobbly-legged, and the farmhands say it's the best balanced equinox they've ever had."],
    },
    after(mn){ arouse(mn, 50, 98); face(mn, "edged", 120); const p = prodOf(mn); if (p) p.deniedUntil = Math.max(p.deniedUntil || 0, Date.now() + 8*60000); return null; },
    scene: [["The see-saw creaks every time it tips, a long low wooden creak, and the whole green leans in.",
             "The sun's exactly halfway down the sky, and the shadow of the see-saw, with %n sat in the middle of it, lies across the green like the hand of a clock.",
             "Somebody keeps count of the tips on a slate, and somebody else is takin' bets on how many before %n begs.",
             "The farmhand on the night end blows %n a kiss every time he comes down."],
            ["{t}A farmhand stands by the beam and catches %n's tits as they bounce, squeezes, and lets go.",
             "{c}Somebody flicks %n's cock as the see-saw goes by, just once, and %n nearly comes off the beam.",
             "{v}A hand slips between %n and the seat and rubs their clit for exactly one tip of the see-saw, and then it's gone.",
             "Somebody walks alongside the beam and kisses %n on every up, and not on the downs."]],
    tender: ["The farmhands tip it slow and gentle, and ask %n every so often if it's too much.", "There's a cushion on the seat round the post, and the straps are padded.",
             "The farmhand on the day end talks to %n the whole time, low and kind, about nothin' much."],
    filthy: ["%n's sat on a post in the middle of the green, bein' bounced on it in front of everybody, and they're beggin' for a harder push.", "%n's a moanin', dripping mess on the see-saw, and the farmhands keep it perfectly even, perfectly cruel.",
             "Every tip fucks %n on the post a bit deeper, and the whole farm's watchin' them squirm for it."],
    gear: [{ when: "hold", slot: "legs", label: "See-Saw Straps", items: ["HempRope"], color: "#C9A227", desc: "Gold and black straps round their thighs, holdin' them sat on the middle post of the equinox see-saw." }],
    depth: ["tease", "watched", "held"], tw: ["day", "crowd"], places: ["pasture", "stockade"], sound: "creak", tags: ["restraint", "public"],
    writes: ["BALANCED", "EVEN", "DAY AND NIGHT", "KEPT LEVEL"],
  });

  // ── the thaw-brook nixie ──
  seasonTrap("ostara", "nixie", {
    icon: "🌊", what: "the thaw-brook nixie: the spring brook's water spirit pulls you in, cold hands and colder kisses, and leaves a clutch of her pearly spawn", limit: /\b(eggs?|monster|water|spirit|cold|tentacle)/i,
    stud: { sire: -77, name: "the brook nixie", type: "human", loads: 2, ml: 180, hold: 7, hole: "vulva", bonus: 0.8, where: "the thaw-brook", eggs: true },
    lines: {
      beats: [
        ["The brook's runnin' high with the thaw, loud and silver, and when %n stops to watch it a pale shape rises out of the deepest pool: a nixie, hair like waterweed, eyes like river stones, smilin'.",
         "%n kneels by the brook to cup a drink, and a cold wet hand closes round their wrist from under the water, and the nixie comes up after it, laughin' like the water does.",
         "There's singin' down by the thaw-brook, high and sweet and nothin' like a bird, and %n follows it to the bank, and the nixie's waitin' on a stone in the middle of the stream."],
        ["She pulls %n into the pool, gentle and impossible to argue with, and the water's cold as snowmelt and then, where she touches, warm.",
         "Her arms go round %n and the waterweed of her hair wraps round their wrists, and she sinks them both in the brook up to the chest.",
         "She draws %n out to the deep pool by the hands, singin', and the current pushes them against her, and she's cold and smooth as a river stone."],
        ["Her hands are everywhere under the water, cold and quick, and her kisses taste of snowmelt, and somethin' under the water's long and smooth and searchin'.",
         "{c}A cold hand closes round %n's cock under the water and strokes, and the cold makes it worse and better at the same time.",
         "{v}Cold fingers part %n's pussy under the water, and the brook rushes in after them, and %n gasps at the cold and then at the fingers.",
         "{t}The nixie kisses %n's tits with cold lips, and their nipples go tight as pebbles, and she laughs at them."],
      ],
      in: [
        ["Somethin' long and smooth and cool slides into %n's %h under the water, and the nixie holds them in the current and rocks with it.",
         "She wraps herself round %n in the deep pool and takes their %h with what she has instead of legs, slow and cold and strange and good."],
        ["She fills %n twice, cold as the brook, and then somethin' else follows, round and smooth, one after another, pearls from the bottom of the pool.",
         "When she finishes it's a cold rush, and then the pearls, one by one, her spawn, slippin' into %n and settlin' heavy and round."],
      ],
      over: [["She doesn't take them. She holds %n in the shallows and rubs against them till she spills, cold and pearly, across their belly in the water."]],
      end: ["The nixie pushes %n up onto the bank, kisses them once more with her cold mouth, and sinks back into the pool, and %n's left shiverin' on the grass with %ml in their %h and %x of her pearly spawn inside them.",
            "%n crawls up out of the thaw-brook soaked and cold and warm in the middle, with %ml of the nixie in their %h and %x pearls of her spawn settlin' heavy in their belly.",
            "The brook's just a brook again, loud and silver, and %n's lyin' on the bank in the thin spring sun with %ml in their %h and %x of the nixie's spawn tucked away inside."],
      endOver: ["The nixie leaves %n in the shallows, cold and pearly with %ml of her across their belly, and slips back under the water singin'.",
                "%n climbs out of the brook with %ml of the nixie streaked down their belly, shiverin' and grinnin'."],
    },
    scene: [["The thaw-brook roars over the stones, loud enough that nobody up at the farm could hear a thing.",
             "Little bits of ice still cling to the bank, and catch the sun, and melt.",
             "The nixie sings the whole time, a song with no words, high and sweet, right into %n's ear.",
             "Waterweed drifts round them both, and little silver fish dart away and come back to look."],
            ["{t}The nixie's cold hands cup %n's tits under the water, and her thumbs circle their nipples, slow as the current.",
             "{c}Cold fingers squeeze %n's cock under the water, and the brook rushes round it, and %n shudders.",
             "{v}The nixie's thumb finds %n's clit under the water and circles it, cold, and the warmth comes anyway.",
             "She kisses %n's neck with lips like snowmelt, and their whole body shivers."]],
    tender: ["The nixie holds %n close against the current so it never pulls them under.", "She warms the water round %n with her hands, somehow, wherever they're coldest.",
             "She sings to %n the whole time, soft, and strokes their wet hair out of their eyes."],
    filthy: ["%n's in a freezin' brook bein' bred by a water spirit and filled with her spawn, and they're beggin' for more.", "The nixie stuffs %n full of cold seed and pearly eggs, and %n's moanin' louder than the brook.",
             "%n's a shiverin', spawn-stuffed mess on the bank, and they'd go back in the water for another if she sang to them."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Waterweed", items: ["HempRope"], color: "#4F7F5C", desc: "Long green waterweed out of the nixie's hair, wound round their wrists and holdin' them in the deep pool." }],
    depth: ["breed"], tw: ["alone", "nest", "breed"], places: ["wildlife"], sound: "wet", tags: ["monsters", "pregnancy"],
    writes: ["SPAWNED", "NIXIE'S", "BROOK BRED", "PEARLS"],
  });
