  /* WHAT'S IN THIS FILE (10y9n2-halloween-2.js)
     More of Halloween week (10y9n-halloween.js has the season and the ones with somebody waitin' in them):
       cauldron     the witch's cauldron: stewed in her bubblin' brew, and it does somethin' (one of the potions, for a while)
       broomstick   the witch's broom: tied on, and it hums and bucks and keeps them right at the edge
       candyapple   the caramel vat at the fair: dipped like a candy apple, stuck on a post, and licked by the fair
       taffy        the taffy puller: stretched, folded, tickled and sugared
       mummy        the old sarcophagus: wrapped in linen by the mummy, and left on show with the right bits bare
       hauntedhouse the haunted house: hands in the walls, a paddle in the dark, and a hole in the wall
       costumetrunk the attic's costume trunk: shut in, and out dressed as somethin' else for an hour (real ears and a tail)
       treatdoor    the treat door: knock, and it's a trick or a treat
     And TRICK-OR-TREATIN': ?trickortreat (or ?tot) knocks on the farm girl's door, once every 20 minutes, Halloween only.
     A treat (a candy that works like one of the sweet potions, a sweet mess with "Farm can mark my body", now and then a
     ribbon, once a day at most) or a trick (one of Halloween's traps, if theirs are on, or a silly candy).
     %n name · %h the hole · %ml how much · %x the costume, the candy
  */
  seasonTrap("halloween", "cauldron", {
    icon: "🧙", what: "the witch's cauldron: stewed in her bubblin' brew, and it does somethin' to you", limit: /\b(messy|bath|wet|dunk|witch)/i, hold: 5, where: "the witch's cauldron",
    lines: {
      beats: [
        ["There's a cauldron bubblin' behind the cabin, big as a washtub, and a witch in a pointy hat stirrin' it. \"Oh, perfect,\" she says when she sees %n. \"I was one ingredient short.\"",
         "A witch on the cabin porch crooks her finger at %n, and their feet walk them over to her cauldron all on their own.",
         "%n follows the smell of plums and spice round the back of the cabin, and there's a witch there with a cauldron and a ladle and a very pleased smile."],
        ["She tips %n into the cauldron, clothes and all, and the brew's warm as a bath and purple as a plum, and it fizzes on their skin.",
         "\"In you get,\" says the witch, and helps %n over the iron lip, and they sink to the chin in somethin' thick and warm that tingles everywhere.",
         "The brew closes over %n's shoulders, warm and fizzy, and their clothes melt away in it like sugar in tea."],
        ["She stirs, and the ladle bumps %n here and there, and every bump tingles, and she adds a pinch of this and a handful of that.",
         "\"Eye of newt,\" she says, droppin' things in, \"wing of bat, and a good long feel.\" She reaches into the brew for the last one.",
         "She leans over the cauldron and kisses %n, deep, and the brew bubbles up round them like it's jealous."],
        ["{t}Her hand slips into the brew and fondles %n's tits, slow, while she reads from her book with the other.",
         "{c}She reaches down into the brew and finds %n's cock and strokes it while she stirs, and the bubbles come faster.",
         "{v}Her fingers slide between %n's legs under the brew, and the warm fizz gets in everywhere her fingers open up.",
         "Somethin' in the brew wraps round %n's legs, soft as pondweed, and holds them open while she works.",
         "The witch chants, and the brew glows, and %n feels it soak in deep, like it's lookin' for somethin' to change."],
      ],
      end: ["The witch fishes %n out with her ladle, purple to the chin and tinglin', and pats them dry. \"Let's see what it does,\" she says.",
            "%n climbs out of the cauldron drippin' purple and fizzy, and the witch writes somethin' down in her book.",
            "\"Done,\" says the witch, tappin' the ladle on the rim, and %n slides out onto the grass, soaked in brew and tinglin' all over."],
      dud: ["The witch frowns into the cauldron. \"Didn't take,\" she says, and fishes %n out with a sigh, purple and fizzin' and very well stirred.",
            "\"Hm,\" says the witch, sniffin' %n all over. \"Nothin'. Must've been the newt.\" She lets them out anyway, drippin' purple."],
    },
    after(mn){
      // the brew: one of the potions, the ones it can be for them (their limits rule, same as any potion)
      const r = rec(mn), can = ["wrongbarn", "feather", "bigbritches", "heatmist", "clover", "honey"].filter(id => potionDef(id) && !potionRefusal(mn, id, mn) && (id !== "heatmist" || !limitBlocks(mn, "heat")));
      arouse(mn, 30); face(mn, "edged", 60);
      if (!can.length) return { endKey: "dud" };
      const id = can[Math.floor(Math.random()*can.length)];
      later(() => { if (charFor(mn)) givePotion(mn, id, BOTMN(), "the witch's brew"); }, 2500);
      return null;
    },
    scene: [["The witch's black cat sits on the woodpile and watches, unimpressed.",
             "The brew bubbles up between %n's legs, fat warm bubbles, one after another.",
             "She stirs widdershins, and the brew gets warmer, and %n's thoughts get fuzzier.",
             "She tastes the brew off a fingertip, then off %n's shoulder, and decides it needs more of %n."],
            ["{t}A big bubble bursts right under %n's tits and they bob up out of the brew, pink and glistenin', and the witch tweaks them.",
             "{c}The bubbles rise up round %n's cock like a hundred little kisses, and the witch laughs at the face they make.",
             "{v}The brew fizzes inside %n wherever it can get, warm and tingly, and the witch says that's the magic workin'.",
             "The witch climbs in with them, hat and all, and the brew sloshes over the rim."]],
    tender: ["The brew is warm as a bath, and the witch keeps %n's chin above it with one gentle hand.", "She hums while she stirs, and it's the most peaceful %n's felt all week.",
             "She checks the heat with her elbow, the way you'd check a bath, and adds a little cold."],
    filthy: ["The witch stews %n like a dumplin' and feels up every inch of the meat.", "%n's soakin' in a cauldron of sex magic with a witch's fingers in them, and they've never been hornier.",
             "She tells %n they'll make a lovely familiar, and scritches them under the chin like a naughty kitten."],
    mess: ["brew", ["chest", "tummy", "face"]],
    gear: [{ when: "hold", slot: "device", label: "The Witch's Cauldron", items: ["MilkCan"], color: "#1A1A1A", desc: "A great black iron pot, big enough to sit in up to the chin, bubblin' with somethin' warm and purple that smells of plums and spice." }],
    depth: ["held", "tease", "mess"], tw: ["night"], places: ["cabin", "trough", "wildlife"], sound: "wet", soundEnd: "wet", tags: ["messy"],
  });

  seasonTrap("halloween", "broomstick", {
    icon: "🧹", what: "the witch's broom: tied on, and it hums and bucks and keeps you right at the edge", limit: /\b(edg|denial|heights?|vibr|fly)/i, hold: 5, where: "the witch's broom",
    lines: {
      beats: [
        ["A broom's leanin' on the cabin wall, and when %n walks past, it hops. Then it hops again, after them.",
         "A witch zooms by on a broom, laughin', and swoops down and scoops %n up behind her before they can duck.",
         "%n picks up a broom to sweep the porch, and the broom has other ideas: it slides between their legs and lifts them right off their feet."],
        ["The bristles curl round %n's ankles and hold, the witch ties their thighs to the handle with black cord, and up they go over the farm.",
         "Up over the barn roof, over the pond, over the pumpkin patch, and the broom handle's hummin' between %n's legs like a fiddle string.",
         "The broom climbs into the sky, and %n grabs the handle with both hands, and it starts to buzz."],
        ["{c}The handle's pressed right along %n's cock and balls, and it hums, and every time it dips through a gust the hum goes up a notch.",
         "{v}The handle's pressed right into %n's pussy, and it hums, and every swoop over the barn roof grinds it harder against their clit.",
         "The broom bucks like a colt, and every buck grinds the hummin' handle harder into %n, and the witch behind them laughs in their ear.",
         "The witch behind %n wraps her arms round them and slides her hands up under their top, and the broom does a loop-the-loop."],
        ["Every time %n's about to tip over the edge, the broom stops hummin' and does a lazy circle, waitin'.",
         "The witch knows exactly when to say \"whoa,\" and the broom stops dead in the air, and %n wails.",
         "They swoop low over the pasture, low enough to brush the grass, and everybody down there looks up at the noises %n's makin'."],
      ],
      end: ["The broom lands soft as a leaf on the cabin porch, and the witch unties %n, wobbly and achin' and right at the very edge, and says, \"Same time next week.\"",
            "Back on the ground, %n slides off the broom and their legs fold under them, still hummin' all over, and they never got to finish.",
            "The broom drops %n in a haystack, gentle as anything, and flies off on its own, and %n's left pantin' in the hay, edged half out of their mind."],
    },
    after(mn){
      const p = prodOf(mn); if (p) p.deniedUntil = Math.max(p.deniedUntil || 0, Date.now() + 10*60000);   // still at the edge a while (with the Companion's "hold me at the edge" on)
      arouse(mn, 45, 95); face(mn, "edged", 120);
      return null;
    },
    scene: [["The moon's huge, and they fly right across it, and somebody down on the farm points.",
             "A bat flies alongside for a while, curious, then gets bored and goes.",
             "The wind whips %n's hair, the broom handle hums, and the farm's tiny and far away below.",
             "The witch cackles, an actual cackle, and the broom dives toward the pond."],
            ["{c}The witch's hand closes round %n's cock and holds it still against the hummin' handle, and won't let it move.",
             "{v}The witch's fingers spread %n open so the handle's hum hits just right, and then the broom stops.",
             "{t}The witch squeezes %n's tits from behind, and every squeeze the broom bucks.",
             "The witch kisses the back of %n's neck and whispers how close they are, as if they didn't know."]],
    tender: ["The witch holds %n tight the whole way, and the broom never once tips.", "They fly slow, under the stars, and the witch points out the constellations between edges.",
             "The broom's hum is soft and steady, like a cat purrin'."],
    filthy: ["%n's humpin' a broomstick over the whole farm, moanin' loud enough to wake the dead.", "The witch edges %n till they're cryin' and beggin' and promisin' her anything.",
             "%n's drippin' off the end of the broom like a raincloud, and everybody below gets a sprinkle."],
    gear: [{ when: "hold", slot: "legs", label: "Broom Ties", items: ["HempRope"], color: "#1C1C1C", desc: "Black cord round both thighs, tyin' them to the broom so they can't fall off, and can't get off either." }],
    depth: ["held", "tease"], tw: ["night"], places: ["pasture", "wildlife", "cabin"], sound: "buzz", tags: [],
  });

  seasonTrap("halloween", "candyapple", {
    icon: "🍎", what: "the caramel vat at the fair: dipped like a candy apple, stuck on a post, and licked by the whole fair", limit: /\b(food|messy|sticky|lick)/i, hold: 6, where: "the candy apple stall",
    lines: {
      beats: [
        ["The candy apple stall at the fair has a vat of warm caramel as big as a bathtub, and the man runnin' it looks at %n and says, \"You'd make a lovely apple.\"",
         "%n leans over the caramel vat at the candy stall to smell it, and the stall keeper gives them a friendly little nudge.",
         "There's a sign on the candy stall: TODAY'S SPECIAL. Under the sign is a vat of warm caramel, and the stall keeper's holdin' out a hand to help %n in."],
        ["Dipped to the neck, slow, the way you dip an apple, and lifted out glossy and golden and drippin'. The caramel's warm, not hot, and it sets soft.",
         "In they go, up to the chin in warm golden caramel, and out they come, coated and gleamin' in the lantern light.",
         "The stall keeper dips %n twice for a thick coat, turnin' them slow so it's even all over."],
        ["They tie %n's wrists to the stall post above their head, like an apple on a stick, and put up a sign: ONE LICK, ONE PENNY.",
         "%n's stood up on the counter with their wrists tied to the post, and the line starts formin' before the caramel's even set.",
         "The stall keeper rolls %n in crushed nuts for good measure, and sticks them up on the post for the fair to see."],
        ["Folk queue up for a lick, and every one of them takes a long, slow one, and some of them go round to the back of the line again.",
         "{t}The first customer licks the caramel off %n's tits, slow, one and then the other, and pays double.",
         "{c}Somebody kneels and licks the caramel off %n's cock, and takes a very long time about it.",
         "{v}A customer licks a long stripe up between %n's legs, through the caramel, and keeps goin' when it's all gone."],
      ],
      end: ["By closin' time the line's licked %n mostly clean, and the stall keeper unties them, sticky and shiny and pinker than any apple.",
            "The stall keeper takes %n down off the post, licked clean in some places and very much not in others, and gives them a candy apple for their trouble.",
            "%n's untied at last, caramel in their hair and between their toes and in places they'll be findin' it for days."],
    },
    after(mn){ arouse(mn, 30); face(mn, "edged", 60); return null; },
    scene: [["The caramel's settin' soft, and every move %n makes cracks it a little, and the crowd likes the sound.",
             "The stall keeper shoos a wasp off %n with a paper fan and goes back to countin' pennies.",
             "The smell of warm caramel and roasted nuts carries right across the fair, and the line gets longer.",
             "Somebody dribbles a little more caramel over %n's shoulders, for the ones at the back of the queue."],
            ["{t}A tongue circles each of %n's nipples, round and round, till the caramel's gone and the nipple's hard and pink.",
             "{c}Somebody sucks the caramel off the tip of %n's cock like a lollipop, and %n's knees buckle.",
             "{v}A tongue digs for caramel between %n's legs and finds somethin' sweeter.",
             "Somebody licks the caramel off %n's neck and nibbles, and pays extra for the nibble."]],
    tender: ["Every lick is soft and slow and sweet, and every customer says thank you.", "The stall keeper gives %n sips of cold cider between customers.",
             "The caramel's warm and gentle, and %n feels like a dessert somebody's very fond of."],
    filthy: ["%n's a sticky caramel fuck-treat on a stick, and the whole fair's slobberin' on them.", "Folk lick %n like dogs at a bowl, and %n's drippin' more than caramel.",
             "One penny a lick, and %n's the stall's best seller, and they're moanin' like they're the one bein' paid."],
    mess: ["caramel", ["chest", "tummy", "face"]],
    gear: [{ when: "hold", slot: "ropeArms", label: "Candy Stick", items: ["HempRope"], color: "#C47A2C", desc: "Their wrists tied up over their head to the candy stall's post, like an apple on a stick." }],
    depth: ["held", "watched", "mess"], tw: ["crowd", "day"], places: ["trough", "stockade", "office"], sound: "wet", tags: ["messy", "public"],
  });

  seasonTrap("halloween", "taffy", {
    icon: "🍬", what: "the taffy puller: stretched on its arms, pulled and folded, tickled and sugared", limit: /\b(tickl|stretch|food|messy)/i, hold: 5, where: "the taffy puller",
    lines: {
      beats: [
        ["The taffy puller in the candy barn is a big machine with two shiny arms that go round and round, and %n gets too close, and one of the arms hooks their wrist.",
         "%n stops to watch the taffy puller, pink taffy stretchin' and foldin' on its two big arms, and the machine reaches out and takes them too.",
         "\"Mind the puller,\" says the candy maker, a moment too late, as the machine's hooks catch %n's wrists and ankles."],
        ["The arms pull, slow, and %n stretches out between them, and then they swing round and fold %n over, and then they pull again.",
         "Round go the arms, and %n's stretched long and folded in half, over and over, the way you pull taffy till it's soft and shiny.",
         "The puller hums and the arms turn, and %n's pulled long and pinned wide, and the candy maker smiles."],
        ["The candy maker brushes %n all over with warm pink taffy syrup, and the hooks keep stretchin' them so she can reach everywhere.",
         "She dusts %n with sugar, a great snowy handful, and it sticks to every sweaty inch of them.",
         "\"Needs workin',\" says the candy maker, and pushes her sugared fingers into %n's ribs, and they shriek."],
        ["She tickles %n everywhere the puller stretches them open: ribs, armpits, the backs of their knees, the soles of their feet.",
         "{c}She works %n's cock like a rope of taffy, pullin' and twistin' with sugared fingers, till it's shiny and hard.",
         "{t}She kneads %n's tits like taffy, foldin' and squeezin', and the puller holds them still for it.",
         "{v}She slides two sugary fingers into %n's pussy and pulls them out slow, and holds them up, shinin' and stringy, to show them."],
      ],
      end: ["The puller winds down and the candy maker unhooks %n, pink and sticky and sugared all over, pulled soft as fresh taffy.",
            "The arms stop. %n hangs there, giggly and limp and shiny with syrup, and the candy maker cuts them a piece of taffy shaped like them.",
            "%n's let down off the hooks, stretched and folded and sugared and laughin' helplessly."],
    },
    after(mn){ arouse(mn, 25); face(mn, "afterglow", 60); return null; },
    scene: [["The puller's arms creak round, slow and patient, and every turn %n's stretched a little longer.",
             "Sugar dust floats in the air and sticks to %n's eyelashes.",
             "The candy maker sings the taffy song, the one about pullin' and foldin', and taps her foot.",
             "The pink taffy on the other hook stretches and sags next to %n, and they're not sure which of them looks softer."],
            ["{t}The hooks pull %n's arms wide, and the candy maker tickles the undersides of their tits till they're squealin'.",
             "{c}A sugary hand pulls %n's cock long and slow, like stretchin' taffy, and lets it spring back.",
             "{v}She tickles the insides of %n's thighs, higher and higher, till her fingers are slick for a different reason.",
             "Feathers, now, a whole fistful, all over %n's stretched-out belly, and %n laughs till they can't breathe."]],
    tender: ["The puller stretches gentle, never more than %n can take.", "The candy maker stops the tickles every time %n's out of breath, and waits for them to laugh again.",
             "She pops a piece of soft taffy in %n's mouth between folds."],
    filthy: ["%n's pulled and folded like candy and tickled till they're droolin'.", "The candy maker fingers %n open between every fold and licks the sugar off.",
             "%n's sticky, sugared and stretched out for anybody's hands, and moanin' between giggles."],
    mess: ["cake", ["chest", "tummy"]],
    gear: [{ when: "hold", slot: "arms", label: "Taffy Hooks (arms)", items: ["HempRope"], color: "#F4A6C6", desc: "Pink candy-striped cord from both wrists to the taffy puller's arms, pullin' them wide on every turn." },
           { when: "hold", slot: "legs", label: "Taffy Hooks (legs)", items: ["HempRope"], color: "#F4A6C6", desc: "Pink candy-striped cord round both ankles, hooked to the puller's other arm." }],
    depth: ["held", "tease"], tw: ["day"], places: ["stockade", "bench", "office"], sound: "machine", soundEnd: "unlatch", tags: ["restraint", "messy"],
  });

  seasonTrap("halloween", "mummy", {
    icon: "🧻", what: "the old sarcophagus: wrapped in linen by the mummy, head to toe, and left on show with the right bits bare", limit: /\b(mummif|encas|wrap|immobil|display)/i, hold: 6, where: "the mummy's tomb",
    lines: {
      beats: [
        ["The haunted barn's got a sarcophagus in it this week, gold and blue and very old, and as %n leans in to read the carvings, the lid swings open.",
         "%n hears scrapin' in the haunted barn and goes to look. A mummy's climbin' out of a painted stone coffin, sheddin' dust, and it reaches for them with both bandaged hands.",
         "There's a mummy standin' in the corner of the haunted barn, and %n thinks it's a costume until it turns its head and looks at them."],
        ["\"My consort,\" the mummy rasps, and bows, and starts wrappin' %n in linen, round and round, quick as a spider.",
         "The mummy has %n by the wrist and a roll of linen in its other hand, and it wraps them from the ankles up, tight and neat, like it's done it a thousand times.",
         "Round and round goes the linen, ankles, knees, thighs, arms pinned to their sides, until %n's a bundle with a face."],
        ["It leaves gaps. Neat little windows in the linen, right where it matters, and it seems very pleased with its work.",
         "{t}It wraps round %n's tits, under and over, pushin' them up and out through a gap in the linen like an offerin'.",
         "{c}It wraps everything but %n's cock, which it leaves standin' out of the bandages like a candle.",
         "{v}It leaves a gap between %n's legs, smooths the linen down round it, and runs a dusty finger along the gap."],
        ["It stands %n up in the open sarcophagus for everybody comin' through the haunted barn to see, and the visitors can't keep their hands to themselves.",
         "Folk come through the haunted barn with lanterns and stop at the sarcophagus, and somebody reaches through the gaps in the linen, and then everybody does.",
         "The mummy guards %n like treasure and lets the visitors touch, one at a time, for an offerin' of a coin."],
      ],
      end: ["The mummy unwinds %n at last, round and round, and the linen falls in a heap, and %n stumbles out of the sarcophagus pink, sweaty and very well handled.",
            "At midnight the mummy unwraps its consort with great ceremony, kisses %n's hand with its dusty lips, and climbs back into its coffin.",
            "The linen comes off in one long strip, and %n spins free, dizzy and tingly, and the mummy waves goodbye from its sarcophagus."],
    },
    after(mn){ arouse(mn, 30); face(mn, "edged", 60); return null; },
    scene: [["The linen's soft and old and smells of cedar and spice, and it hugs %n everywhere at once.",
             "A lantern swings past, and the shadows of the old carvings crawl across %n's wrapped body.",
             "The mummy hums a song, a very old one, and pats the linen smooth whenever it wrinkles.",
             "A visitor reads the little card by the sarcophagus out loud: THE MUMMY'S CONSORT. PLEASE TOUCH."],
            ["{t}Hands come through the gaps and squeeze %n's tits where they push out of the linen, and somebody pinches.",
             "{c}Somebody strokes %n's cock where it stands out of the bandages, slow, and calls their friends over to watch.",
             "{v}Fingers find the gap between %n's legs and sink in, and the mummy nods its approval.",
             "Somebody tickles %n's nose with the loose end of the linen, and they can't do a thing about it."]],
    tender: ["The linen's wrapped snug, not tight, and the mummy checks every turn with a careful finger.", "The mummy stands by %n the whole time like a guard, and nobody touches without askin' it first.",
             "Every visitor whispers somethin' kind to the mummy's consort."],
    filthy: ["Wrapped up like a present with every hole unwrapped, %n's the haunted barn's free-use exhibit.", "The visitors finger and fondle %n like a museum piece nobody's guardin'.",
             "%n's leakin' through the linen, and the mummy says it's the finest offerin' it's had in three thousand years."],
    gear: [{ when: "hold", slot: "arms", label: "Mummy Wraps (arms)", items: ["HempRope"], color: "#E3D9BF", desc: "Old linen bandages wound round and round, pinnin' their arms to their sides." },
           { when: "hold", slot: "legs", label: "Mummy Wraps (legs)", items: ["HempRope"], color: "#E3D9BF", desc: "Linen wound from the ankles to the thighs, neat as a parcel, with a gap left where it matters." },
           { when: "hold", slot: "torso", label: "Mummy Wraps (body)", items: ["HempRopeHarness"], color: "#E3D9BF", desc: "Linen criss-crossed over their chest and belly, smellin' of cedar, every bit that ought to show left showin'." }],
    depth: ["held", "watched", "tease"], tw: ["crowd", "night"], places: ["bench", "office", "rubber", "cabin"], sound: "rope", soundEnd: "ropelong", tags: ["restraint", "monsters", "public"],
  });

  seasonTrap("halloween", "hauntedhouse", {
    icon: "🏚️", what: "the haunted house: hands in the walls, a paddle in the dark, and a hole in the wall where somebody's waitin'", limit: /\b(scare|fear|tickl|paddl|spank|impact|glory)/i, hold: 6, where: "the haunted house",
    lines: {
      beats: [
        ["There's a haunted house in the old cabin this week, with a sign that says ENTER IF YOU DARE, and %n dares.",
         "%n goes into the haunted house for a laugh, and the door slams behind them, and every candle goes out.",
         "The haunted house is pitch dark and creakin', and %n feels their way down a hallway that seems a lot longer than the cabin is."],
        ["Hands come out of the walls: dozens of them, through little holes, gropin' and squeezin' and pinchin' every bit of %n they can reach.",
         "The hallway's lined with holes, and out of every hole comes a hand, and the hands have opinions about %n's clothes, and the clothes come off.",
         "%n squeezes down a narrow passage, and the walls are full of hands, warm ones, and they tickle and grope and steer %n along."],
        ["Somethin' in the dark swats %n's ass with a paddle, crack, and a ghostly voice says, \"BOO.\" Then again. And again.",
         "A paddle comes out of the dark, crack, across %n's rump, and somebody behind the wall giggles.",
         "Fingers tickle %n's ribs from both walls at once, and they're laughin' and squirmin' and they can't get away."],
        ["The passage ends at a wall with a hole in it, a hole exactly the shape of %n's hips, and the hands push them back against it.",
         "At the end of the hall the hands bend %n over and press their ass up against a hole in the wall, and hold them there.",
         "{c}A hand from the wall wraps round %n's cock and pulls them forward, right up against a hole in the boards, and somethin' on the other side is waitin'."],
      ],
      end: ["Whatever's behind the wall fills %n's %h with %ml and lets go, and the hands push them out the back door into the night air, blinkin' and drippin'.",
            "The candles come back on all at once. %n's alone in the hallway with %ml in their %h and a red handprint on their ass. The walls are just walls.",
            "%n stumbles out of the haunted house the back way, %ml runnin' out of their %h, and the sign on the door says THANK YOU FOR VISITING now."],
      endOver: ["Whatever's behind the wall spills %ml across %n's back and lets them go, and they stumble out into the night, laughin' shakily.",
                "%n comes out of the haunted house the back way, red-bottomed, tickled breathless and painted with %ml."],
    },
    after(mn){ const got = hwFill(mn, 150, 1.1); arouse(mn, 35); face(mn, got.h ? "bred" : "afterglow", 90); return got.h ? { ml: ml(got.ml), h: TRAP_HOLE[got.h] } : { endKey: "endOver", ml: ml(got.ml) }; },
    scene: [["Somethin' cold and wet drips on %n's neck from the ceilin'. It's just water. Probably.",
             "A skeleton drops from the ceilin' on a string, rattlin', and %n shrieks, and the hands in the walls laugh.",
             "The floor creaks under every step, and somethin' under the floor creaks back.",
             "A ghostly voice whispers %n's name from inside the walls, and then whispers what it's goin' to do to them."],
            ["{t}Two hands come out of the wall at chest height and squeeze %n's tits, and won't let go till they've had a good long feel.",
             "{c}A hand from the wall strokes %n's cock as they pass, then another, and another, all the way down the hall.",
             "{v}Fingers slip out of the walls and between %n's legs, and %n's wet before they've gone three steps.",
             "The paddle again, crack, and a giggle, and %n's ass is glowin' as red as the candles."]],
    tender: ["The hands are gentle, and they steer %n so they never bump into anything.", "The paddle's a soft one, more a pat than a crack, and the giggles are friendly.",
             "A voice in the wall asks if %n's havin' fun, and waits for the answer."],
    filthy: ["%n's groped down the whole haunted house like a free sample, and every hand gets a squeeze.", "They paddle %n's ass red and finger them wet and shove them up against the hole in the wall like a treat.",
             "%n's moanin' louder than any ghost in the place, and the walls love it."],
    depth: ["held", "tease", "watched"], tw: ["night", "crowd"], places: ["cabin", "glory", "office"], sound: "creak", soundEnd: "gate", tags: ["public"],
  });

  // the costume trunk: what they come out as (only pieces the game has, checked in the farm's own outfits)
  const COSTUMES = [
    { x: "kitten", sp: /kitt|cat/, ears: "KittenEars2", tail: "KittenTailStrap1", color: "#1A1A1A" },
    { x: "bunny",  sp: /bun|rabbit/, ears: "BunnyEars1", tail: "BunnyTailStrap" },
    { x: "fox",    sp: /fox/, ears: "FoxEars1", tail: "FoxTailsStrap" },
    { x: "puppy",  sp: /pup|dog|wolf/, ears: "PuppyEars1", tail: "PuppyTailStrap" },
    { x: "pony",   sp: /pony|horse|mare/, ears: "PonyEars1", tail: "HorseTailStrap" },
    { x: "mouse",  sp: /mouse|mice/, ears: "MouseEars2", tail: "MouseTailStrap1" },
    { x: "cow",    sp: /cow|bull|heifer/, ears: "CowEars", tail: "CowtailStrap" },
  ];
  seasonTrap("halloween", "costumetrunk", {
    icon: "👗", what: "the costume trunk in the attic: shut in, and out again dressed as somethin' else for an hour", limit: /\b(costume|enclos|claustro|box|trunk)/i, hold: 4, where: "the costume trunk",
    before(mn, v){
      const sp = String((rec(mn) || {}).species || "").toLowerCase(), can = COSTUMES.filter(c => !c.sp.test(sp)), C = can[Math.floor(Math.random()*can.length)] || COSTUMES[0];
      v.x = C.x;
      // what it puts on them, for an hour (set now, before the trap starts: 10y-farm-gear.js reads it as it begins)
      TRAP_GEAR.costumetrunk = [
        { when: "after", slot: "ears", label: "Costume Ears", items: [C.ears], color: C.color, mins: 60, only: true, desc: "A pair of "+C.x+" ears out of the attic's costume trunk. They buckled themselves on, and they'll come off in an hour." },
        { when: "after", slot: "tail", label: "Costume Tail", items: [C.tail], color: C.color, mins: 60, only: true, desc: "A "+C.x+" tail out of the costume trunk, strapped on snug. It wags a little on its own." },
      ];
    },
    lines: {
      beats: [
        ["Up in the attic there's a big old costume trunk with a brass lock, and when %n lifts the lid to look, somethin' inside grabs them and pulls them in.",
         "%n climbs into the attic's costume trunk to dig for somethin' to wear to the party, and the lid slams shut on them.",
         "The trunk in the attic rattles as %n walks past. Then it opens, all by itself, and a sleeve reaches out and takes their hand."],
        ["Dark. A mothball smell. Feathers and lace and fur and somethin' that wriggles, and %n's clothes are bein' pulled off them by sleeves with no arms in them.",
         "Inside the trunk it's dark and soft and crowded with costumes, and they're all tryin' themselves on %n at once.",
         "The lid's shut tight. Feathers tickle %n's face, satin slides between their legs, and somethin' furry is buttonin' itself onto them."],
        ["A pair of ears pushes itself onto %n's head, and a tail buckles itself on behind, and somethin' giggles in the dark.",
         "{c}A silk scarf winds round %n's cock and ties itself in a bow, very neatly, and pulls.",
         "{v}A feather boa slides between %n's legs, back and forth, back and forth, slow.",
         "{t}A lace corset laces itself up round %n's ribs, tight, and lifts their tits up for the party."],
        ["The trunk rocks on the attic floor while the costumes have their fun, and from outside it sounds like somebody's havin' a very good time.",
         "The costumes don't stop at dressin' %n. They're feelin' them up, all of them, gloves and sleeves and stockings, everywhere at once.",
         "Somethin' in the trunk decides %n's a %x, and everything in there agrees."],
      ],
      end: ["The lid flies open and %n tumbles out onto the attic floor dressed as a %x, ears and tail and all, flushed and rumpled, and it isn't comin' off for an hour.",
            "The trunk spits %n out, and they're a %x now, ears on their head and a tail behind, and every costume in the trunk sighs happily.",
            "%n climbs out of the trunk a %x, from the ears to the tail, and the trunk's lock clicks shut, satisfied."],
    },
    after(mn){ arouse(mn, 20); face(mn, "afterglow", 60); return null; },
    scene: [["A top hat knocks itself onto %n's head, decides it doesn't suit them, and knocks itself off again.",
             "The mothballs rattle round the corners of the trunk like little marbles.",
             "Somethin' in the trunk sings a show tune, muffled, very off-key.",
             "A mask presses itself to %n's face, thinks about it, and moves on."],
            ["{t}A pair of satin gloves cup %n's tits from behind and squeeze, like they're measurin' them for somethin'.",
             "{c}A velvet glove strokes %n's cock, slow, and another one cups their balls, and they can't tell whose hands they are because there aren't any.",
             "{v}A silk stocking slides up between %n's legs and rubs, slow and smooth, and won't stop.",
             "A feather duster tickles %n's ribs till they're squealin' in the dark."]],
    tender: ["The costumes are soft and warm, and everything smells like an old, loved closet.", "The trunk rocks %n like a cradle between costumes.", "Somethin' velvet strokes %n's hair the whole time."],
    filthy: ["Groped by every costume in the trunk at once, %n's the dress-up doll the attic's been waitin' for.", "The gloves finger %n open and the boa rubs them raw, and %n's moanin' into a mask.",
             "%n comes out of that trunk dressed for the party and drippin' like they've already been to it."],
    // (before() picks the costume each time; this is the one the equipment list shows)
    gear: [{ when: "after", slot: "ears", label: "Costume Ears", items: ["KittenEars2"], color: "#1A1A1A", mins: 60, only: true, desc: "A pair of costume ears out of the attic's trunk: a kitten's, a bunny's, a fox's, a pup's, a pony's, a mouse's or a cow's. They come off in an hour." },
           { when: "after", slot: "tail", label: "Costume Tail", items: ["KittenTailStrap1"], color: "#1A1A1A", mins: 60, only: true, desc: "The tail to go with the ears, strapped on snug. It wags a little on its own." }],
    depth: ["held", "tease"], tw: ["alone"], places: ["office", "cabin", "rubber"], sound: "creak", soundEnd: "unlock", tags: [],
  });

  seasonTrap("halloween", "treatdoor", {
    icon: "🚪", what: "the treat door: knock, and it's a trick or a treat", limit: null, hold: 4, where: "the treat door",
    before(mn, v){ v.trick = Math.random() < 0.5; },
    lines: {
      beats: (mn, v) => { const T = SEASON_LINES.treatdoor; return [T.knock].concat(v.trick ? [T.trick1, T.trick2, T.trick3] : [T.treat1, T.treat2, T.treat3]); },
      knock: ["There's a door standin' on its own in the middle of the yard, no house behind it, with a jack-o'-lantern on the step and a sign: KNOCK FOR A TREAT. %n knocks.",
              "%n finds a little red door set into the side of the barn that was never there before, with a brass knocker shaped like a bat. They knock, and the door says, \"Trick or treat?\"",
              "A door's propped up in the pumpkin patch with nothin' behind it, and from behind it comes a voice: \"Knock knock, sugar.\" %n knocks back."],
      treat1: ["The door opens a crack and a hand comes out holdin' a candy wrapped in orange foil. \"Treat,\" says the voice. \"Come closer for the rest of it.\"",
               "\"Treat!\" says the door, and swings open, and there's nobody behind it, just warm air and the smell of chocolate, and somethin' pulls %n through."],
      treat2: ["Hands from the other side of the door undo %n's clothes, gentle, and a warm mouth kisses its way down their belly.",
               "{c}A mouth on the other side of the cat flap finds %n's cock and sucks, slow and sweet, like a lollipop.",
               "{v}A tongue through the letterbox licks %n's pussy, slow, like it's the treat and not them.",
               "{t}The door's knocker turns into a hand and cups %n's tit, and the letterbox purrs."],
      treat3: ["The door hums and the mouth keeps goin', sweet and slow, until %n's meltin' against the wood like warm toffee.",
               "Whatever's behind the door takes its time, and when %n finally cums, the jack-o'-lantern on the step grins wider."],
      trick1: ["\"TRICK!\" yells the door, and flies open, and somethin' grabs %n by the collar and hauls them halfway through, and the door shuts on their waist.",
               "\"Trick,\" says the door, sweetly, and a bucket of pumpkin guts tips over %n's head from somewhere up above, and then the door grabs them."],
      trick2: ["Stuck halfway through the door, head and shoulders on one side and the rest on the other, and %n can hear somebody walkin' up behind them.",
               "The door's got %n round the middle like a picture frame, and their bottoms get tugged down by a hand that thinks this is very funny.",
               "{c}Somethin' on the far side of the door gets hold of %n's cock and won't let go, and %n's stuck there, wriggly and squeakin'."],
      trick3: ["Somebody on the yard side spanks %n twice, BOO and BOO, and then takes hold of their hips.",
               "A cold hand, then a warm hand, and then somebody's pressed up behind %n, and the door creaks with laughter."],
      endTreat: ["The door gives %n a candy for the road and closes, and when they look back it's just the side of the barn. They're sticky with caramel and grinnin'.",
                 "\"Happy Halloween,\" says the door, and shuts, and %n's left on the step with a candy in their hand and caramel drippin' down their chest.",
                 "The door kisses %n's knuckles with its letterbox and closes, and the jack-o'-lantern on the step winks."],
      endTrick: ["Whoever was behind %n fills their %h with %ml and the door lets go, and %n tumbles out into the yard covered in pumpkin and drippin'. The door's gone.",
                 "The door spits %n out with %ml in their %h and pumpkin in their hair, and slams, and it's just a plain old door again, leanin' on nothin'.",
                 "\"Gotcha,\" says the door, and lets %n go: pumpkin guts, a red bottom, and %ml of somebody runnin' out of their %h."],
      endTrickOver: ["Whoever was behind %n spills %ml over their ass and the door lets go, and %n tumbles out into the yard with pumpkin in their hair.",
                     "The door lets %n go with a hat of pumpkin guts, a red bottom and %ml across their back, and it slams, laughin'."],
    },
    after(mn, v){
      if (!v.trick){
        trapMess(mn, "treatdoor", "caramel");
        later(() => { if (charFor(mn)) treatCandy(mn, "the treat door"); }, 2500);
        arouse(mn, 35); face(mn, "afterglow", 90);
        return { endKey: "endTreat" };
      }
      trapMess(mn, "treatdoor", "pumpkin");
      later(() => { if (charFor(mn)) bodyMark(mn, { write: { line: "TRICKED", area: "hips" } }); }, 4000);
      const got = hwFill(mn, 140, 1.2); arouse(mn, 35); face(mn, got.h ? "bred" : "edged", 90);
      return got.h ? { endKey: "endTrick", ml: ml(got.ml), h: TRAP_HOLE[got.h] } : { endKey: "endTrickOver", ml: ml(got.ml) };
    },
    scene: [["The jack-o'-lantern on the step watches the whole thing, and its candle flickers like it's laughin'.",
             "The door's brass knocker knocks by itself, twice, for no reason anybody can see.",
             "Somebody on the far side of the door is hummin' a Halloween tune and keeps losin' their place.",
             "Leaves blow round %n's ankles, and the door creaks on hinges that aren't hung on anything."],
            ["{t}A hand through the letterbox gives %n's tit a friendly squeeze.",
             "{c}A hand through the cat flap gives %n's cock a squeeze, just to say hello.",
             "{v}A finger through the letterbox finds %n's pussy and gives it a slow little rub.",
             "The door whispers %n's name through the keyhole, very sweetly, and %n shivers."]],
    tender: ["Whatever's behind the door is gentle, and it keeps askin' if %n's havin' a nice Halloween.", "The door holds %n carefully, like it's afraid of scratchin' them.",
             "There's a sweet little candy at the end either way, and the door makes sure %n knows it."],
    filthy: ["The door uses %n like a glory hole somebody left on the porch for Halloween.", "%n's moanin' at a door, and the door's very pleased with itself.",
             "Trick or treat, and %n's drippin' like the answer was both."],
    depth: ["tease", "held"], tw: [], places: ["glory", "cabin", "kennel", "stalls"], sound: "softgate", soundEnd: "gate", tags: [],
  });

  // a load from somebody nobody saw (the haunted house's wall, the treat door's trick): in a hole if they're ?breedable, or over them
  function hwFill(mn, amount, bonus){
    const r = rec(mn), h0 = r && r.breedable ? openHole(mn) : null, h = h0 === "mouth" ? null : h0;
    if (!h){ splatBody(mn, "back", amount); return { h: null, ml: amount }; }
    const got = trapFill(mn, h, amount, CFG.TRAP_OVERFULL); tally(mn);
    if (r.fertile && canCatchIn(mn, h)) try { rollConception(mn, ANON_STUD, got, bonus || 1, h); } catch(e){ warn("halloween:", e); }
    splatBody(mn, h, got);
    return { h, ml: got };
  }

  // ── trick-or-treatin' at the farm girl's door ─────────────
  // The sweet ones (reward and silly potions) as candies, and the tricky ones (the punishments, and the scents for
  // somebody with traps on). Each says what it is; the potion's own rules (their limits) decide if it can be had.
  const TREATS = [
    { id: "clover", name: "a cream-filled bonbon" }, { id: "golden", name: "a gold-foil toffee" }, { id: "honey", name: "a honeycomb chew" },
    { id: "musk", name: "a blue ribbon lollipop" }, { id: "feather", name: "a sherbet fizz" }, { id: "heatmist", name: "a cinnamon heart" },
  ];
  const TRICKS = [
    { id: "moo", name: "a moo-flavoured jelly bean" }, { id: "bell", name: "a jingle-bell gobstopper" }, { id: "hiccup", name: "a fizzin' pop rock" },
    { id: "needy", name: "a pink sugar mouse" }, { id: "wolfscent", name: "a wolf-shaped gummy", traps: true }, { id: "goblinmusk", name: "a green goblin drop", traps: true },
    { id: "tentaclemusk", name: "a squishy purple gummy octopus", traps: true }, { id: "wrongbarn", name: "a mystery-flavour candy corn" },
  ];
  const SWEET_MESSES = ["caramel", "chocolate", "cake", "strawberry", "honey"];
  // a candy for them: the first of the pool that their limits and the potion's own rules allow → true if they got one
  function giveCandy(mn, pool, why){
    const traps = isSubject(mn) && !(rec(mn) || {}).trapsOff;
    const can = pool.filter(c => potionDef(c.id) && (!c.traps || traps) && !potionRefusal(mn, c.id, mn) && (c.id !== "heatmist" || !limitBlocks(mn, "heat")));
    if (!can.length) return null;
    const c = can[Math.floor(Math.random()*can.length)];
    return givePotion(mn, c.id, BOTMN(), why || "a trick-or-treat candy") ? c : null;
  }
  function treatCandy(mn, why){ return giveCandy(mn, TREATS, why); }
  function trickOrTreat(sender, args, R){
    const r = rec(sender), now = Date.now();
    if (!onBooks(sender)){ R("🎃 Trick-or-treatin' is for folks on the books, sugar."); return; }
    const on = seasonsOn().filter(id => SEASONS[id].tot);
    if (!on.length){ R("🎃 It's not Halloween, sugar. Come knockin' when the pumpkins are out ("+seasonDates("halloween")+")."); return; }
    if (!charFor(sender)){ R("🎃 Come to the farm and knock, sugar. I can't hand candy through a beep."); return; }
    if (state.trapRuns && state.trapRuns.has(sender)){ R("🎃 You're a little tied up right now, sugar. Knock when it lets go of you."); return; }
    const wait = (r.totAt || 0) + 20*60000 - now;
    if (wait > 0){ R("🎃 You've only just been, sugar. Come back in "+Math.ceil(wait/60000)+" minute"+(Math.ceil(wait/60000) === 1 ? "" : "s")+"."); return; }
    r.totAt = now; r.totN = (r.totN || 0) + 1; saveLedger(); audit(sender, "TRICKORTREAT", String(r.totN));
    emote("🎃 "+tFill(pickFor(sender, "tot:knock", TOT_LINES.knock), sender), sender);
    const trick = Math.random() < 0.4;
    later(() => {
      if (!charFor(sender)) return;
      if (!trick){
        // a treat: a ribbon now and then (once a day at most), a sweet mess for those who like one, or a candy
        const roll = Math.random();
        if (roll < 0.12 && r.totRibbonDay !== dayKey()){
          r.totRibbonDay = dayKey(); saveLedger();
          emote("🎃 "+tFill(pickFor(sender, "tot:ribbon", TOT_LINES.ribbon), sender), sender); earnRibbons(sender, 1, "trick-or-treatin'", BOTMN());
          return;
        }
        if (roll < 0.35 && hasCompanion(sender)){
          const m = SWEET_MESSES[Math.floor(Math.random()*SWEET_MESSES.length)];
          if (trapMess(sender, "tot", m)){ emote("🎃 "+tFill(pickFor(sender, "tot:mess:"+m, TOT_LINES.mess[m] || TOT_LINES.mess.caramel), sender), sender); return; }
        }
        const c = TREATS.filter(x => potionDef(x.id) && !potionRefusal(sender, x.id, sender) && (x.id !== "heatmist" || !limitBlocks(sender, "heat")));
        if (c.length){
          const pick = c[Math.floor(Math.random()*c.length)];
          emote("🎃 "+tFill(pickFor(sender, "tot:treat", TOT_LINES.treat), sender, { x: pick.name }), sender);
          later(() => { if (charFor(sender)) givePotion(sender, pick.id, BOTMN(), "a trick-or-treat candy"); }, 1500);
          return;
        }
        emote("🎃 "+tFill(pickFor(sender, "tot:plain", TOT_LINES.plain), sender), sender);
        return;
      }
      // a trick: one of Halloween's own traps, if theirs are on (half the time), or a tricky candy
      if (isSubject(sender) && !trapBreathing(sender) && Math.random() < 0.5){
        const ks = on.reduce((a, id) => a.concat(SEASONS[id].kinds), []).filter(k => !trapWhyNot(sender, k));
        if (ks.length){
          emote("🎃 "+tFill(pickFor(sender, "tot:trap", TOT_LINES.trap), sender), sender);
          const k = ks[Math.floor(Math.random()*ks.length)];
          later(() => { if (charFor(sender) && !springTrap(sender, k, "")){ const r2 = rec(sender); r2.trapAt = Date.now(); saveLedger(); } }, 2000);
          return;
        }
      }
      const c = TRICKS.filter(x => potionDef(x.id) && (!x.traps || isSubject(sender)) && !potionRefusal(sender, x.id, sender));
      if (c.length){
        const pick = c[Math.floor(Math.random()*c.length)];
        emote("🎃 "+tFill(pickFor(sender, "tot:trick", TOT_LINES.trick), sender, { x: pick.name }), sender);
        later(() => { if (charFor(sender)) givePotion(sender, pick.id, BOTMN(), "a trick-or-treat candy"); }, 1500);
        later(() => { if (charFor(sender)) bodyMark(sender, { write: { line: "TRICKED", area: "hips" } }); }, 3500);
        return;
      }
      emote("🎃 "+tFill(pickFor(sender, "tot:silly", TOT_LINES.silly), sender), sender);
    }, 2500);
  }
  const TOT_LINES = {
    knock: ["%n knocks on the farm girl's door, and it swings open on her in a pointy witch's hat and little black cat ears, holdin' a big orange bowl. \"Trick or treat, sugar?\"",
            "%n knocks, and the farm girl opens up in her witch's hat with a cat's tail swishin' behind her, and grins. \"Well, what have we here?\"",
            "The farm girl's porch is covered in pumpkins and cobwebs, and when %n knocks she pops out in her cat ears and witch's hat, bowl of candy on her hip.",
            "%n knocks, and from inside the farm girl calls \"just a minute!\" and comes out straightenin' her witch's hat, with candy in one hand and a wicked look in her eye."],
    treat: ["\"Treat,\" she decides, and drops %x into %n's hand, and kisses the tip of their nose.",
            "She digs through the bowl for a good one and comes up with %x, and pops it in %n's mouth herself.",
            "\"You've been sweet,\" she says, \"so you get somethin' sweet,\" and gives %n %x, still warm from her apron pocket."],
    trick: ["\"Trick,\" she says, very sweetly, and gives %n %x, and does not say what it does.",
            "She smiles far too nicely and hands %n %x. \"Go on. Eat it.\" The whole porch holds its breath.",
            "\"Oh, I've got a special one for you,\" she purrs, and presses %x into %n's palm and closes their fingers round it."],
    trap: ["\"Trick,\" she says, and steps aside, and there's somethin' in her hallway that very much isn't her.",
           "\"Oh, a trick, I think,\" says the farm girl, and taps her wand on %n's head, and the porch boards open under them.",
           "She looks %n up and down and says \"trick,\" and pushes them gently off the porch, right into somethin' waitin'."],
    ribbon: ["\"Oh, I've got a special treat for you,\" says the farm girl, and pins a little orange ribbon to %n's collar. It's a real one.",
             "The farm girl rummages in her bowl and comes up with a ribbon instead of a candy. \"Don't tell the others,\" she whispers."],
    mess: {
      caramel: ["\"Treat,\" says the farm girl, and drizzles warm caramel over %n's chest from a jug she was keepin' by the door, and licks a little off. \"Mm. Ready.\""],
      chocolate: ["She dips her fingers in a pot of warm chocolate and paints a big smile across %n's chest. \"There. A treat you wear.\""],
      cake: ["She hands %n a cupcake and then squishes it right into their chest, frostin' first, and giggles like a goblin."],
      strawberry: ["\"Strawberry sauce,\" she says, and pours it over %n's shoulders and lets it run down. \"For somebody who's sweet enough already.\""],
      honey: ["She takes a honey dipper out of her apron and drizzles a long gold string of it down %n's chest, slow, and watches it run."],
    },
    plain: ["\"Treat,\" she says, and gives %n a plain old toffee. It's just a toffee. It's a very good toffee.",
            "She gives %n an apple. A real one. \"Healthy,\" she says, and winks."],
    silly: ["\"Trick,\" she says, and blows a raspberry at %n and shuts the door. Then opens it again and gives them a toffee. \"Gotcha.\"",
            "She pulls a rubber spider out of the bowl and drops it down %n's top, and laughs till her hat falls off."],
  };
  if (W.__FARMHAND_TEST__) Object.assign(W, { __hwFill: (m, a) => hwFill(m, a, 1), __treatCandy: (m) => treatCandy(m) });
