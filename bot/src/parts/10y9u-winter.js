  /* WHAT'S IN THIS FILE (10y9u-winter.js)
     WINTER on the farm (Laynie, Oct 27: "winter pack yes"; the ideas doc: "A frozen pond, gingerbread icing messes, and
     mistletoe over the kissing gate"). December and January by the bot's clock; ?seasons start winter runs it any other
     time. While it's on (10y9m-seasons.js) a third of what the plain trap tiles spring is from this pack, a tile named
     trap-winter (or trap-snow) springs nothin' else, the trapper's bearskin rug, the lumberjacks' hot tub, the bakery
     bench and the kissin' gate come round more, and the farm girl wraps up in a red winter hat, shawl and fur gloves.
       frozenpond   the frozen duck pond: skates froze fast in the ice, and every skater on the pond takes a turn
       gingerbread  the gingerbread man the bakers brought to life: warm spiced dough, a candy-cane cock, icin' after
       mistletoe    the mistletoe over the kissin' gate: tied up under it, and everybody passin' collects a kiss
       yeti         the yeti down from the hills, who carries you up to his cave and wraps you in his fur after
       giftwrap     gift-wrapped in ribbon, put in a box under the farm's big tree, tagged UNWRAP ME
       stocking     the giant stockin' by the hearth: hung up in it, and everybody passin' fills it
       sauna        the sauna by the pond: steamed, switched with birch, rolled in the snow, and back in the heat
       cocoastand   the cocoa stand: milked into the pot (if they make milk), or the cocoa poured over them, and licked
       frostfae     the frost-fae in the hedgerow: frost kisses, and kept right at the edge for their game
       snowman      packed into the farmyard snowman with the good bits dug out, and the yard plays
     And ?stocking: once a day, look in your stockin' on the farm's hearth: a sweet (it works like one of the sweet
     potions), a sweet mess with "Farm can mark my body", now and then a ribbon, or coal if you've been naughty since
     last time (a naughty mark, or a naughty or degraded tier).
     New messes for the Companion to draw: royal icin', cocoa, eggnog, peppermint syrup.
     %n name · %c the cock · %h the hole · %ml how much · %x the sweet
  */
  Object.assign(MESS, { icing: "#FFFDF8", cocoa: "#6E4128", eggnog: "#F1E0AA", peppermint: "#E23A52" });
  season("winter", {
    label: "Winter", icon: "❄️",
    alias: ["snow", "snowy", "midwinter", "christmas", "xmas", "holidays", "holiday", "festive", "wintertime", "december", "january", "winterfair"],
    on: (dt) => dt.getMonth() === 11 || dt.getMonth() === 0,   // December and January
    dates: () => "Dec 1 – Jan 31",
    blurb: "snow on the barns, gingerbread, mistletoe, and a stockin' on the hearth",
    hint: "?stocking: look in your stockin' on the farm's hearth, once a day (coal if you've been naughty).",
    why: ["It's winter on the farm, and the snow was hidin' somethin'.", "Somethin' came in out of the cold for you, sugar.",
          "The farm's all snow and tinsel this month, and this one was wrapped just for you.", "Winter on the farm: nobody stays cold for long."],
    start: ["Winter's come to the farm. There's snow on the barn roofs, ice on the duck pond, gingerbread in the oven and mistletoe over the kissin' gate. Wrap up warm, sugar, and look in your stockin' on my hearth (?stocking).",
            "The first snow's fallen on the farm, sugar. The pond's froze over, the bakery's been busy, and there are things out in the drifts that only come down from the hills this time of year.",
            "It's winter on the farm! Lanterns on the fence posts, cocoa on the stove, a sauna steamin' by the pond, and a whole crop of traps that only come out when it snows."],
    end: ["Winter's done on the farm for another year. The snow's gone to slush, the gingerbread's all eaten, and the stockin's are back up in the attic.",
          "The thaw's come, sugar. The pond's water again, the snowmen are puddles, and whatever came down from the hills has gone back up them. Till next winter."],
    also: ["bearskin", "hottub", "bakery", "kissgate"],
    // the farm girl's: the game's own red winter hat, short shawl and fur gloves (only those, never a stand-in), in their own colours
    costume: [
      { slot: "hat", name: "Winter Hat", items: ["Santa1"], desc: "A red winter hat with a white fur brim and a fluffy white bobble on the end that bounces when she walks." },
      { slot: "cloak", name: "Winter Shawl", items: ["XmasShortShawl"], desc: "A short red shawl trimmed with white fur, done up at the throat with a little bow." },
      { slot: "gloves", name: "Fur Gloves", items: ["GlovesFur"], desc: "Soft white fur gloves, warm as toast, for handin' out cocoa." },
    ],
  });
  for (const [k, places] of Object.entries({ bearskin: ["cabin"], hottub: ["cabin", "wildlife"], bakery: ["trough", "bench"], kissgate: ["stockade", "glory"] }))
    if (!SEASON_PLACES[k]) SEASON_PLACES[k] = places;

  // ── the frozen pond ──
  seasonTrap("winter", "frozenpond", {
    icon: "🧊", what: "the frozen duck pond: your skates froze fast in the ice, and every skater on the pond takes a turn", limit: /\b(cold|ice|gang|free ?use|public)/i, hold: 6, where: "the frozen pond",
    lines: {
      beats: [
        ["The duck pond's froze solid and the whole farm's out skatin' on it, and %n's doin' fine right up until they glide over the soft spot by the spring.",
         "%n laces up a pair of skates and goes out on the frozen pond, and halfway across, the ice under them goes slushy, and then, just as quick, hard again.",
         "There's a skatin' party on the frozen pond, lanterns on poles all round the edge, and %n skates out into the middle to show off a spin."],
        ["Their skates are froze fast in the ice, both of them, solid as if they'd grown there. %n tugs, and wobbles, and stays exactly where they are.",
         "%n tries to skate on and can't. The slush has set round both their boots like stone, and they're stuck standin' in the middle of the pond with their arms windmillin'.",
         "Froze in, ankle-deep, right in the middle where everybody skates past. %n bends down to dig at it, and that's the wrong thing to do, because now they're bent over."],
        ["The first skater to come by gives %n's bottom a friendly slap on the way past. The second one stops to help, and helps themself to a feel instead.",
         "Skaters circle %n like geese, round and round, and every lap somebody reaches out: a squeeze, a pinch, a cold glove slidin' up under their coat.",
         "{t}A skater glides up behind %n, slips both gloved hands up under their jumper and cups their tits, and holds on for a whole lap of the pond.",
         "{c}Somebody skates past and gets a hand down the front of %n's trousers on the way, and cold fingers wrap round %n's cock and stroke it once, twice, and they're gone.",
         "{v}A skater pulls up behind %n, tugs their bottoms down a few inches, runs two cold fingers along %n's pussy, slow, and skates off laughin'."],
        ["Then one of them stops for good. Skates scrape to a halt behind %n, gloves take hold of their hips, and the whole pond slows down to watch.",
         "A big skater in a striped scarf grinds to a stop behind %n, peels their bottoms down to their froze-in knees, and says, \"Don't you worry. I'll warm you up.\"",
         "Somebody skates a slow circle round %n, sizin' them up, then comes in close behind and presses up warm against them, and %n isn't cold anywhere any more."],
      ],
      end: ["The skater spills %ml into %n's %h with a groan that fogs the air, and somebody pours a kettle of hot water round their boots. The ice lets go, and so do %n's knees.",
            "%n's thawed out at last with a kettle from the bank, %ml warm in their %h, and they wobble off the pond on their skates with everybody clappin'.",
            "By the time the farmhands chip %n's skates free, the skater's long gone and %ml of them is runnin' down the inside of %n's thighs, steamin' a little in the cold."],
      endOver: ["The skater pulls back and spills %ml across %n's bare bottom, hot as a stove in the cold air, and the farmhands come with a kettle to melt their boots free.",
                "%n's chipped out of the ice with %ml of somebody froze in streaks on their backside, and a red handprint on each cheek from the laps before."],
    },
    after(mn){
      const got = hwFill(mn, 150, 1.2); arouse(mn, 35); face(mn, got.h ? "bred" : "afterglow", 90);
      return got.h ? { endKey: "end", ml: ml(got.ml), h: TRAP_HOLE[got.h] } : { endKey: "endOver", ml: ml(got.ml) };
    },
    scene: [["The ice creaks under the skaters, a long low sound like the pond's thinkin' about somethin'.",
             "Somebody's roastin' chestnuts on a brazier by the bank, and the smell drifts out across the ice.",
             "A pair of ducks waddle over the ice to look at %n, decide they're not bread, and waddle off again.",
             "The lanterns on their poles swing in the wind, and the shadows of the skaters wheel round %n in circles."],
            ["{t}A skater glides past and gives each of %n's tits a squeeze through their coat, like checkin' fruit at the market.",
             "{c}A gloved hand finds %n's cock on the way past and gives it a long slow tug, and the glove's very cold and the hand inside it very warm.",
             "{v}Cold fingers slip between %n's thighs on the way past and rub, quick and wicked, and they're gone before %n can squeak.",
             "Somebody skates up and kisses %n on the mouth, warm and hot-chocolatey, and spins off backwards wavin'."]],
    tender: ["Somebody tucks a scarf round %n's neck first, so they're not cold up top while they wait.", "The skaters are gentle, and every one of them asks %n if their feet are warm enough.",
             "Somebody brings %n a cup of hot cider and holds it for them, sip by sip, between laps."],
    filthy: ["%n's stuck bent over on the ice like a fence post, and every skater on the pond treats them like one they're allowed to lean on.", "The whole pond takes turns slappin' and squeezin' %n's bare bottom, and %n's moanin' loud enough to crack the ice.",
             "%n's the skatin' party's free entertainment, froze in place and drippin', and nobody's in any hurry to fetch the kettle."],
    gear: [{ when: "hold", slot: "ropeFeet", label: "Frozen Fast", items: ["HempRope"], color: "#CFE8F5", desc: "Ice up over both their boots and round the ankles, froze solid. They're not goin' anywhere till somebody fetches a kettle." }],
    depth: ["held", "watched", "breed"], tw: ["crowd", "day"], places: ["wildlife", "pasture"], sound: "creak", tags: ["restraint", "public"],
    writes: ["THIN ICE", "FROZEN ASSET", "SKATE BY", "ON ICE"],
  });

  // ── the gingerbread man ──
  seasonTrap("winter", "gingerbread", {
    icon: "🍪", what: "the gingerbread man the bakers brought to life: six foot of warm spiced dough, a candy-cane cock, and icin' all over you after", limit: /\b(food|messy|sticky|monster)/i,
    stud: { sire: -70, name: "the gingerbread man", type: "human", loads: 2, ml: 200, hold: 6, hole: "vulva", bonus: 1.2, where: "the bakery", person: true },
    lines: {
      beats: [
        ["The bakery's warm as a summer kitchen, and on the coolin' rack by the oven there's a gingerbread man as tall as the door, iced buttons down his chest and a big frosted grin. He sits up when %n walks in.",
         "%n follows the smell of ginger and cloves into the bakery, and somethin' tall and brown and sugar-dusted steps out from behind the flour sacks and says, \"Run, run, as fast as you can.\" Then it catches them anyway.",
         "The bakers made a gingerbread man for the winter fair, six foot of him, and somebody must've put somethin' extra in the dough, because he's walkin' round the bakery now and he's very interested in %n."],
        ["He lifts %n onto the floury bakin' table like they weigh nothin' and leans over them, warm right through like he's fresh out of the oven, smellin' of treacle and spice.",
         "He backs %n up against the warm bricks of the bread oven and pins them there with one big spiced hand on their chest, and his icin' grin gets wider.",
         "He sweeps a whole gingerbread house off the table with one arm, roof and all, and lays %n down in the crumbs instead."],
        ["He undresses %n with careful dough fingers, button by button, and every inch he uncovers he licks, slow, like he's checkin' if it's sweet enough.",
         "{c}He finds %n's cock and wraps a warm spiced hand round it, and it's like bein' stroked by fresh bread, soft and hot and smellin' of treacle.",
         "{v}He spreads %n's thighs on the floury table and slides a thick warm finger into their pussy, and it comes out glistenin', and he licks it, and nods.",
         "{t}He cups %n's tits in his big warm hands and pipes a little swirl of icin' on each nipple from a bag on the counter, then licks it off, one and then the other.",
         "There's a candy-cane stripe painted down the front of him, red and white, and it leads right down to somethin' that's very definitely not just for decoration."],
      ],
      in: [
        ["He pushes into %n's %h slow and warm, a candy-cane cock as smooth as boiled sugar, and the whole bakery smells of ginger as he starts to move.",
         "He takes %n's %h right there on the table, and the flour puffs up round them in clouds with every thrust, and the bakin' trays rattle on their hooks."],
        ["He fills %n twice, hot as a tray straight out of the oven, and the second time he groans so loud a gumdrop pops off his chest.",
         "When he cums it's warm and thick and sweet, and he keeps goin' right through it, and fills them again before his icin' grin starts to droop."],
      ],
      over: [["He doesn't take them. He ruts his candy-cane cock between %n's floury thighs, slow and sticky, till he spills hot across their belly.",
              "He sits %n up on the counter and strokes himself against them till he paints their belly, then pipes a little icin' heart on top of it."]],
      end: ["The gingerbread man pipes GOOD ENOUGH TO EAT across %n in icin', lifts them down off the table with %ml warm in their %h, and goes back to sit on his coolin' rack.",
            "%n climbs off the bakin' table with %ml in their %h, flour in their hair and icin' all over, and the gingerbread man waves goodbye with a crumbly little wave.",
            "He leaves %n slumped against the warm oven with %ml of him in their %h and a gumdrop pressed into their hand, and the bakers come back from lunch to a very floury bakery."],
      endOver: ["%n slides off the counter with %ml of gingerbread man drippin' down their belly, iced like a cake, and he tips a little icin' hat they hadn't noticed he had.",
                "The gingerbread man wipes %n down with a tea towel, misses most of the %ml on their belly on purpose, and pipes a smile on their chest for the road."],
    },
    scene: [["Flour drifts down off the shelves every time the table bumps the wall, and settles on them both like snow.",
             "The oven ticks and hums behind them, and the whole bakery's as warm as a summer afternoon.",
             "One of his gumdrop buttons pops loose and rolls away under the table. He doesn't notice. He's busy.",
             "A tray of mince pies steams on the rack, and the steam fogs the bakery window so nobody outside can see in. Mostly."],
            ["{t}He licks a stripe of icin' off %n's tit and makes a happy crumbly noise about it.",
             "{c}He gives %n's cock a squeeze with a hand so warm it might've just come out of the oven.",
             "{v}His thumb rubs slow circles on %n's clit, sticky with icin', and he hums like a kettle.",
             "He licks the flour off %n's neck, and his tongue's warm and tastes of ginger."]],
    tender: ["He's warm and soft and careful, and he keeps askin' if %n's comfy on the table.", "He tucks a folded tea towel under %n's head so the table's not so hard.",
             "He smells like a kitchen on bakin' day, and he holds %n like somethin' fresh and precious."],
    filthy: ["The gingerbread man bends %n over the flour sacks and fucks them like he's kneadin' dough, hard and slappy.", "%n's a floury, sticky, icin'-smeared mess, moanin' like they're bein' paid for it, and the gingerbread man's not done yet.",
             "He stuffs %n full of warm sweet seed and licks the overflow off them like it's the best part of the recipe."],
    mess: ["icing", ["chest", "tummy", "face"]],
    gear: [{ when: "hold", slot: "ropeArms", label: "Bakery Ribbon", items: ["Ribbons"], color: "#C8102E", desc: "A red ribbon off the cake boxes, tied round their wrists and looped over the bakin' table's leg." }],
    depth: ["breed", "mess"], tw: ["day", "breed"], places: ["trough", "cabin", "office"], sound: "wood", tags: ["messy", "monsters"],
    writes: ["FRESH BAKED", "GOOD ENOUGH TO EAT", "ICED", "SWEET TREAT"],
  });

  // ── the mistletoe ──
  seasonTrap("winter", "mistletoe", {
    icon: "🌿", what: "the mistletoe over the kissin' gate: tied up under it, and everybody who passes owes a kiss, and collects", limit: /\b(kiss|public|free ?use|gang)/i, hold: 5, where: "under the mistletoe",
    lines: {
      beats: [
        ["Somebody's hung a big bunch of mistletoe over the kissin' gate this month, white berries and a red velvet bow, and %n's standin' right under it before they notice.",
         "%n goes through the kissin' gate and somebody behind them clears their throat and points up. Mistletoe. \"Rules are rules, sugar.\"",
         "There's a sprig of mistletoe hangin' over the kissin' gate and a little crowd waitin' by it, and they all look very pleased when %n walks up."],
        ["Before %n can duck out, somebody ties their wrists up to the gate post with a red velvet ribbon, right under the mistletoe, and a queue starts formin'.",
         "The gate swings and catches %n in its little pen, and a farmhand ties a ribbon round their wrists and the post for good measure. \"Stay put. You're popular.\"",
         "\"Everybody gets a kiss,\" says the farmhand runnin' the gate, tyin' %n's wrists up under the mistletoe with a red ribbon. \"Everybody.\""],
        ["The first kiss is sweet, on the cheek. The second's on the mouth. The third one takes a long time and uses tongue, and the crowd cheers.",
         "One by one they come up for their kiss, every one of them a little bolder than the last, and some of them go round to the back of the queue again.",
         "Kisses on the mouth, kisses on the neck, a kiss on the inside of the wrist that makes %n shiver all over. Somebody keeps count out loud."],
        ["Then somebody kneels. \"Didn't say where the kiss had to go,\" they say, and tugs %n's bottoms down.",
         "{t}Somebody unbuttons %n's top and kisses each of their tits in turn, slow, and sucks a nipple pink before they let it go.",
         "{c}A farmhand gets down on their knees, pulls %n's cock out into the cold air and kisses the tip, then takes the whole of it in their warm mouth.",
         "{v}Somebody kneels, nudges %n's knees apart and kisses their pussy the way they'd kiss their mouth, deep and slow and with a lot of tongue.",
         "The kisses wander lower and lower, and by the end of the queue there's not an inch of %n that's not been kissed under the mistletoe."],
      ],
      end: ["The last of the queue gets their kiss and the farmhand unties the ribbon. %n stumbles out of the kissin' gate kissed pink all over, lipstick on their neck and their knees not workin'.",
            "The mistletoe's lost half its berries by the time the queue's done, one for every kiss, the old way, and %n's let go flushed and dazed and covered in lipstick.",
            "\"That's everybody,\" says the farmhand, and unties %n, and kisses them once more on the forehead for luck. %n's lips are numb, and the rest of them very much isn't."],
    },
    after(mn){ arouse(mn, 40); face(mn, "afterglow", 90); return null; },
    scene: [["A robin sits on the gate post and watches the queue, head on one side.",
             "Somebody at the back of the queue's brought a flask of mulled cider and is passin' it round.",
             "Snow starts to fall, big soft flakes, and they land on %n's eyelashes between kisses.",
             "The farmhand runnin' the gate plucks a berry off the mistletoe for every kiss, the old way, and there are a lot of berries goin'."],
            ["{t}Somebody kisses their way across %n's chest from one nipple to the other, and back again for luck.",
             "{c}Somebody kneels in the snow, kisses all the way up %n's cock from the root to the tip, and gets back in the queue.",
             "{v}A kiss lands right between %n's legs, warm and slow, and the next one in the queue says that one counted double.",
             "Somebody kisses %n so deep and long that the crowd starts to count, and gets to forty."]],
    tender: ["Every kiss is soft, and every kisser says thank you.", "The ribbon's tied loose and soft, and somebody checks it isn't pinchin' between kisses.",
             "The queue's full of friendly faces, and every one of them wishes %n a warm winter."],
    filthy: ["%n's the kissin' gate's toll, tied up and kissed, licked and sucked by the whole farm, and they're moanin' for the next one.", "The kisses stopped bein' kisses about halfway down the queue, and nobody minds, least of all %n.",
             "%n's lipstick-smeared and drippin', squirmin' on the ribbon, and the queue's got longer, not shorter."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Mistletoe Ribbon", items: ["Ribbons"], color: "#B3122E", desc: "A red velvet ribbon tyin' their wrists up to the kissin' gate's post, right under the mistletoe." }],
    depth: ["tease", "watched"], tw: ["crowd", "day"], places: ["stockade", "glory", "pasture"], sound: "softgate", soundEnd: "gate", tags: ["public", "restraint"],
    writes: ["KISSED", "KISS ME", "UNDER THE MISTLETOE", "KISSED BY EVERYBODY"],
  });

  // ── the yeti ──
  seasonTrap("winter", "yeti", {
    icon: "🏔️", what: "the yeti down from the hills: twice your size, warm as a stove under all that white fur, and he wants somebody to keep him company till spring", limit: /\b(size|monster|beast|big|cold)/i,
    stud: { sire: -71, name: "the yeti", type: "human", loads: 2, ml: 340, hold: 8, hole: "vulva", bonus: 1.6, where: "the yeti's cave" },
    lines: {
      beats: [
        ["Snow's driftin' deep up by the top field, and %n's wadin' through it when the biggest drift of all stands up. It's white and shaggy and twice as tall as they are, and it rumbles.",
         "There are footprints in the snow by the top field, every one as long as %n's arm, and they lead straight up to %n, because whatever made them is standin' right behind them.",
         "A blizzard comes down off the hills out of nowhere, and out of it walks a yeti, eight foot of white fur and frost, with eyes as blue as the ice on the pond."],
        ["He scoops %n up against his chest like a lost lamb and carries them off through the snow to a cave in the hillside, warm and dry inside, with a nest of furs in the back.",
         "%n tries to run and gets about four steps. The yeti picks them up round the waist, tucks them under one shaggy arm and lopes off with them up to his cave.",
         "He doesn't grab. He holds out one huge furry hand and waits, and when %n's fingers are too cold to say no to anything warm, he wraps them up in his arms and carries them home."],
        ["In the cave he lays %n down on a pile of furs and peels their froze-stiff clothes off, and then lies down over them, and it's like bein' buried in the warmest blanket in the world.",
         "{c}His great warm hand closes round %n's cock and the whole of it disappears in his fist, and he rumbles, pleased, when it twitches.",
         "{v}He parts %n's thighs with two big fingers and strokes their pussy, slow and warm and careful, like a man holdin' a bird's egg.",
         "{t}He buries his face in %n's tits, fur ticklin' everywhere, and his breath's as hot as a kettle on their cold skin.",
         "Under all that white fur he's hot as a stove, and hard, and very, very big, and he rumbles somethin' that might be \"mine\"."],
      ],
      in: [
        ["He eases into %n's %h a little at a time, and it's a lot, and he's patient about it, rumblin' soft every time they gasp, till he's all the way in.",
         "He fills %n's %h with a cock as big as the rest of him, slow and deep, and the furs bunch up under them and the whole cave smells of snow and musk."],
        ["He breeds %n slow and heavy, the way snow falls, and when he cums it's a flood, hot as a bath, and he holds them through every bit of it.",
         "Twice he fills %n, the second time with his whole huge body curled round theirs to keep the heat in, and his rumble shakes the icicles at the cave mouth."],
      ],
      over: [["He doesn't take them. He ruts between %n's thighs on the furs, slow and heavy, and spills across their belly and chest in a flood that steams in the cold air.",
              "He holds %n against his chest and strokes himself against them till he floods their belly, then licks their face, rough and warm, like a big friendly cat."]],
      end: ["The yeti wraps %n up in his softest fur with %ml of him warm in their %h, carries them back down to the farm gate, and leaves them there tucked up like a parcel.",
            "%n wakes up hours later in the cave with %ml in their %h, wrapped in furs and warmer than they've been all winter, the yeti snorin' like a landslide beside them.",
            "He carries %n home through the snow with %ml of him in their %h and their belly full and warm, sets them down in the barn, and lopes off back up the hill."],
      endOver: ["The yeti wraps %n up in a fur, %ml of him still steamin' on their belly, and carries them home to the farm gate.",
                "%n's carried back down to the farm wrapped in white fur and painted with %ml of yeti, and he gives them a gentle pat on the head before he goes."],
    },
    scene: [["Icicles drip at the cave mouth, the blizzard howls outside, and in here it's warm as summer.",
             "There's a little fire burnin' at the back of the cave. He must've lit it for them. That's thoughtful, for a yeti.",
             "His fur's so thick %n can lose both hands in it, and they do, holdin' on.",
             "He rumbles the whole time, low and steady, a sound %n can feel in their teeth."],
            ["{t}His huge thumbs circle %n's nipples till they're hard as hailstones, and then he warms them in his mouth.",
             "{c}His fist works %n's cock slow and steady, warm as an oven glove, and he won't let go.",
             "{v}His thumb rubs %n's clit in slow circles, and for somethin' that big he's very, very gentle.",
             "He licks %n's neck, slow and rough, and the warmth of it goes all the way down."]],
    tender: ["He wraps %n up in his arms and his fur so not one inch of them is cold.", "He's slow and patient, and he stops and rumbles a question every time %n gasps.",
             "He hums somethin' low and soft the whole time, like a lullaby made of avalanches."],
    filthy: ["The yeti breeds %n like he means to have them carryin' by spring, and %n's beggin' him to.", "%n's stretched round a monster cock in a cave in the snow, moanin' loud enough to bring the drifts down.",
             "He fills %n so full they slosh, and then fills 'em again for the cold."],
    gear: [{ when: "after", slot: "device", label: "Yeti's Fur Wrap", items: ["FurBlanketWrap"], mins: 20, desc: "One of the yeti's own white furs, wrapped round them snug as a cocoon and tied off. Warm as anything. Not easy to get out of." }],
    depth: ["held", "breed"], tw: ["alone", "night", "breed"], places: ["wildlife", "pasture", "cabin"], sound: "straw", tags: ["monsters"],
    writes: ["YETI'S MATE", "SNOWED IN", "WINTER BRED"],
  });

  // ── gift-wrapped ──
  seasonTrap("winter", "giftwrap", {
    icon: "🎁", what: "gift-wrapped: tied up in ribbon, popped in a box with a bow on top, tagged UNWRAP ME and left under the farm's big tree", limit: /\b(bondage|restrain|tied|public|display|free ?use)/i, hold: 6, where: "under the farm's big tree",
    before(mn, v){ v.used = Math.random() < 0.55; },
    lines: {
      beats: (mn, v) => { const T = SEASON_LINES.giftwrap; return [T.b1, T.b2, T.b3, v.used ? T.used : T.tease]; },
      b1: ["The farmhands are wrappin' presents in the big barn, a mountain of paper and ribbon, and one of them looks at %n and says, \"Hold still. You'll fit.\"",
           "%n wanders into the barn where the presents are bein' wrapped and gets a ribbon looped round their wrists before they've even said hello.",
           "There's a big empty box under the farm's tree, wrapped in red paper, with a tag on it that says UNWRAP ME. It's %n-sized. That's not an accident."],
      b2: ["Red ribbon round the wrists, round the ankles, criss-crossed over the chest, and finished with a big bow right where it'll be the most fun to pull.",
           "They wrap %n up like a parcel, ribbon round and round, tie it off in a big fat bow on their hip, and stick a gift tag on their bottom.",
           "{t}The ribbon goes under and over %n's tits, pushin' them up and out like they're the present, and the bow sits right between them.",
           "{c}They tie a little red bow round the base of %n's cock, very neat, very festive, and step back to admire it."],
      b3: ["Into the box they go, ribbons and all, with the lid left off so everybody can see what's inside, and the box goes under the tree with the rest of the presents.",
           "They pop %n in the gift box, up on their knees, bow on top, and slide them under the big tree between a sack of oats and a new saddle.",
           "\"To: everybody,\" a farmhand writes on the tag, \"from: the farm,\" and pats %n on the head and leaves them under the tree."],
      used: ["Somebody can't wait. They kneel by the box, pull one end of the bow, and unwrap just enough of %n to get at the best part.",
             "Folk come by all evenin' to shake the presents, and one of them decides %n's the present they want, and climbs right into the box with them.",
             "{v}A farmhand pulls the ribbon off %n's hips, nudges their knees apart in the box and helps themself to their pussy, slow, like openin' a present carefully to save the paper.",
             "{c}Somebody unwraps the bow on %n's cock with their teeth, then turns %n round in the box and takes them from behind."],
      tease: ["Everybody who comes by gives the present a shake and a squeeze, and nobody's allowed to open it till the farm girl says so.",
              "Folk come by to guess what's in the box, and every guess needs a good feel first, and %n's squirmin' in their ribbons before long.",
              "{t}Somebody tugs the bow between %n's tits and the ribbon pulls tight round them, and then they tie it again, slower.",
              "{c}Everybody who passes flicks the little bow on %n's cock, and some of them give it a good long stroke while they're there."],
      endUsed: ["Whoever unwrapped %n leaves %ml in their %h, ties the bow back on a bit wonky, and puts the lid on the box. The farm girl lets them out at suppertime.",
                "%n's let out of the box at last, ribbons all tangled, %ml of somebody runnin' out of their %h and the gift tag still stuck to their bottom.",
                "The ribbons come off one by one, and %n climbs out of the box with %ml in their %h and THANK YOU written on the tag in somebody's handwritin'."],
      endUsedOver: ["Whoever unwrapped %n spills %ml over them, re-ties the bow, and leaves them in the box, sticky and beribboned, till the farm girl lets them out.",
                    "%n climbs out of the box at suppertime with %ml painted across their ribbons and the gift tag stuck to them in a very sticky way."],
      endTease: ["At suppertime the farm girl pulls the big bow, and all the ribbons fall off %n at once, and they climb out of the box shiverin' and wantin' and squeezed all over.",
                 "Nobody was allowed to open the present after all. The farm girl unties %n at suppertime, tinglin' from an evenin' of shakes and squeezes, and never once unwrapped.",
                 "The farm girl lets %n out of their box with a kiss on the nose. \"Best present I've had all year,\" she says, \"and nobody even got to open it.\""],
    },
    after(mn, v){
      arouse(mn, 40);
      if (!v.used){ face(mn, "edged", 90); return { endKey: "endTease" }; }
      const got = hwFill(mn, 140, 1.2); face(mn, got.h ? "bred" : "afterglow", 90);
      return got.h ? { endKey: "endUsed", ml: ml(got.ml), h: TRAP_HOLE[got.h] } : { endKey: "endUsedOver", ml: ml(got.ml) };
    },
    scene: [["The tree's lit with little lanterns, and they glint off the ribbon every time %n wriggles.",
             "Somebody shakes the box next to %n's and guesses \"socks\". It's socks.",
             "The barn smells of pine needles and paper and the mulled cider warmin' by the door.",
             "A farmhand comes by with a roll of sticky tape and tapes the gift tag back on where it was peelin'."],
            ["{t}Somebody squeezes %n's tits through the ribbon, one and then the other, like guessin' what's in a stocking.",
             "{c}Somebody gives %n's cock a squeeze through the ribbon and says, \"Oh, I know what this one is.\"",
             "{v}Somebody runs a finger along the ribbon between %n's legs, and it comes back wet, and they grin.",
             "Somebody tugs the big bow just a little, not enough to undo it, just enough to make %n gasp."]],
    tender: ["The ribbons are soft satin, tied snug and never tight.", "The farm girl tucks a cushion into the box so %n's knees don't ache.",
             "Everybody who comes by tells the present how lovely it looks."],
    filthy: ["%n's the farm's present to itself, tied up with a bow on and tagged for anybody to open.", "Gift-wrapped and stuffed in a box, %n's the gift that keeps on givin', and everybody wants a turn unwrappin' it.",
             "%n's squirmin' in their ribbons, drippin' through the satin, a present nobody's goin' to return."],
    gear: [{ when: "hold", slot: "arms", label: "Gift Ribbon (arms)", items: ["Ribbons"], color: "#C8102E", desc: "Red satin ribbon round and round their wrists, tied off in a fat bow." },
           { when: "hold", slot: "legs", label: "Gift Ribbon (legs)", items: ["Ribbons"], color: "#C8102E", desc: "Red satin ribbon round their legs from the ankles up, neat as a parcel." },
           { when: "hold", slot: "device", label: "Gift Box", items: ["GiftBox"], desc: "A big gift box wrapped in red paper, the lid left off so everybody can see what's inside, tagged UNWRAP ME." }],
    depth: ["held", "watched", "tease"], tw: ["crowd", "night"], places: ["cabin", "office", "stockade"], sound: "rope", soundEnd: "ropelong", tags: ["restraint", "public"],
    writes: ["UNWRAP ME", "TO: EVERYBODY", "OPEN ME FIRST", "BEST PRESENT"],
  });

  // ── the giant stockin' ──
  seasonTrap("winter", "stocking", {
    icon: "🧦", what: "the giant stockin' on the hearth: popped in up to the chest, hung on its hook, and filled by everybody passin'", limit: /\b(bondage|restrain|toys?|public|suspen)/i, hold: 6, where: "the big hearth",
    lines: {
      beats: [
        ["The big hearth in the farmhouse has stockin's hung all along it, and one of them's enormous, red and white and big enough for a person. A farmhand holds it open for %n with a grin.",
         "%n's warmin' their hands by the big hearth when two farmhands take them, one under each arm, and lower them feet first into a giant red stockin'.",
         "There's a stockin' on the hearth hook with %n's name stitched on the cuff in white letters, and it's far too big for socks, and the farmhands are already holdin' it open."],
        ["In they go, feet first, right up to the armpits, arms pinned at their sides in the soft red wool, and the farmhands hang the stockin' back on its hook with %n in it, toes a hand's width off the hearth.",
         "The stockin's snug as a sausage skin. It holds %n's arms to their sides and their knees together, and up they go on the big brass hook by the fire, toes kickin' in the wool.",
         "Up on the hook they go, stuffed in the stockin' to the chest, swingin' gently, toasty warm from the fire and not able to do a single thing about anything."],
        ["Then folk start fillin' the stockin'. A hand reaches in at the top with a sweet, leaves it down the front of %n's shirt, and keeps goin'.",
         "Everybody who walks past puts a little somethin' in %n's stockin': a sweet, a ribbon, a hand that wanders all the way down to the toe.",
         "{t}A farmhand reaches in the top of the stockin' and finds %n's tits, tucks a sweet between them, and gives them a good long squeeze for luck.",
         "{c}Somebody's hand goes all the way down the stockin' and finds %n's cock, and strokes it inside the warm wool till they're squirmin' on the hook.",
         "{v}A hand slides down inside the stockin', between %n's thighs, finds their pussy and leaves two fingers there while its owner chats about the weather."],
        ["Somebody drops in a little egg that buzzes, and it works its way down the stockin' till it finds somewhere to settle, and settles there, and buzzes.",
         "The stockin' gets fuller and fuller, sweets and ribbons and nuts and hands, and %n squirms on the hook in front of everybody, red as the wool.",
         "The fire crackles, the stockin' sways, and every time %n wriggles, somethin' buzzin' down in the toe of it shifts and makes them wriggle more."],
      ],
      end: ["The farmhands lift the stockin' down at last and tip %n out on the hearth rug in a heap of sweets and ribbons, flushed and sweaty and very, very well stuffed.",
            "%n's lifted off the hook and unrolled from the stockin' like a sweet from its wrapper, and the little egg comes too, still buzzin', and stays put.",
            "Down comes the stockin', and out comes %n, pink as a candy cane and pantin', with half the sweets in the farmhouse stuck to them somewhere."],
    },
    after(mn){
      arouse(mn, 40); face(mn, "afterglow", 90);
      later(() => { if (charFor(mn)) treatCandy(mn, "a stockin' candy"); }, 3000);   // one of the sweets in it was a good one
      return null;
    },
    scene: [["The fire crackles and pops, and the stockin' sways on its hook in the warm air comin' off it.",
             "Somebody hangs a sprig of holly on the hook next to %n, for decoration.",
             "The farm cat curls up on the hearth rug under %n's dangling toes and goes to sleep.",
             "A log shifts in the grate and sends up a shower of sparks, and everybody in the room says \"ooh\"."],
            ["{t}A hand reaches into the stockin' and plays with %n's nipple while its owner reads a letter with the other.",
             "{c}Somebody reaches all the way down and gives %n's cock a slow squeeze through the wool, like checkin' what's in a present.",
             "{v}Fingers slide down inside the stockin' and rub %n's pussy slow, in time with the clock on the mantel.",
             "Somebody tickles %n's toes where they poke out the bottom of the stockin', and %n swings like a bell."]],
    tender: ["The stockin's soft as a blanket and the fire's warm, and %n's never been so cosy while bein' groped.", "Every hand that goes in the stockin' leaves a sweet behind, every single one.",
             "The farm girl comes by now and then to check %n's not too warm by the fire, and gives them a sip of water."],
    filthy: ["%n's a stockin' stuffer, hung on the hearth for anybody to reach in and play with, and everybody does.", "There's a buzzin' egg wedged somewhere deep and a dozen hands in the wool, and %n's moanin' for the whole farmhouse to hear.",
             "%n's drippin' down the inside of the stockin' and the farmhands make jokes about it bein' damp."],
    gear: [{ when: "hold", slot: "arms", label: "The Big Stockin'", items: ["HempRope"], color: "#C8102E", desc: "The giant stockin's red wool, snug round their arms and holdin' them to their sides while they hang on the hearth." },
           { when: "after", slot: "plug", label: "Stockin' Stuffer", items: ["EggVibePlugXXL"], color: "#C8102E", mins: 20, desc: "The buzzin' egg from the toe of the stockin', still buzzin', tucked in snug right where it settled." }],
    depth: ["held", "tease", "watched"], tw: ["night", "crowd"], places: ["cabin"], sound: "rope", tags: ["restraint", "public"],
    writes: ["STOCKIN' STUFFER", "NAUGHTY OR NICE?", "FILLED"],
  });

  // ── the sauna ──
  seasonTrap("winter", "sauna", {
    icon: "🧖", what: "the sauna by the pond: steamed pink, switched with birch, rolled in the snow, and back in the heat again", limit: /\b(heat|hot|cold|spank|impact|pain)/i, hold: 5, where: "the sauna",
    lines: {
      beats: [
        ["There's a little wooden sauna by the frozen pond, smoke curlin' out of its chimney, and a big bearded sauna keeper in nothin' but a towel holds the door open for %n. \"In. You look cold.\"",
         "%n's teeth are chatterin' when the sauna keepers spot them, and before they know it they're stripped to the skin and pushed into the steam.",
         "The sauna door opens in a cloud of steam and a pair of big sauna keepers come out pink as hams, see %n, look at each other, and carry them back in."],
        ["Inside it's as hot as a summer noon, and they lay %n out on the top bench and ladle water on the stones till the steam's so thick they can't see their own hands.",
         "The steam rolls over %n in waves, the sweat runs off them in rivers, and big hands rub them down with it, slow, everywhere.",
         "They sit %n between them on the bench, pressed close on both sides, all heat and muscle and sweat, and somebody pours another ladle on the stones."],
        ["Then out come the birch switches, leafy and soaked, and they beat %n with them, swish swish swish, back and bottom and thighs, till the skin tingles bright pink.",
         "\"Good for the blood,\" says the bearded one, and switches %n's bottom with a bundle of birch twigs, swish swish, while the other holds them down.",
         "{c}One of them switches %n's thighs while the other strokes %n's cock, slow, and the swish and the stroke keep the same time.",
         "{t}The birch leaves swish across %n's tits, soft and stingin', and their nipples go hard in the heat."],
        ["Then out the door they go, all three of them, straight into a snowdrift, and the sauna keepers roll %n in the snow, and %n shrieks loud enough to scare the crows.",
         "Out into the snow, naked and steamin', rolled in a drift till they gasp, then picked up and carried straight back into the heat, and the heat's like a kiss all over.",
         "The cold's like a slap and the heat after is like honey, and they do it twice more, and by the end %n doesn't know which way is up."],
      ],
      end: ["The sauna keepers wrap %n in a big towel, pink from head to toe and tinglin' in every inch, and sit them by the stove with a mug of somethin' hot. They've never felt so alive.",
            "%n stumbles out of the sauna glowin' like a coal, switched pink, sweaty and shiverin' at the same time, and the sauna keepers wave them off with a slap on the bottom.",
            "The sauna keepers let %n go with a birch leaf stuck to their bottom, a glow all over and legs like jelly. \"Same time tomorrow,\" says the bearded one."],
    },
    after(mn){ arouse(mn, 35); face(mn, "afterglow", 120); return null; },
    scene: [["The stones hiss every time somebody ladles water on them, and the steam rolls up to the rafters.",
             "The little window's fogged solid. Outside it's snowin'. In here it's July.",
             "The wood's so hot it's nearly too hot to sit on, and the sauna keepers don't seem to notice.",
             "Somebody hums a drinkin' song, and the steam swallows the tune."],
            ["{c}A big wet hand wraps round %n's cock and strokes it in the steam, slick with sweat, and doesn't hurry.",
             "{v}A hand slides between %n's thighs, slick with sweat, and rubs their pussy slow while the steam rolls over them.",
             "{t}Big sweaty hands squeeze %n's tits, and the sweat runs down between them.",
             "A sauna keeper kisses %n, slow and hot, and tastes of salt and woodsmoke."]],
    tender: ["The sauna keepers keep a bucket of cold water by %n and splash their face whenever it gets too much.", "The switches are soft and leafy, and they're switched like they're bein' dusted, not punished.",
             "Every time they come in from the snow there's a warm towel waitin', and a big warm arm."],
    filthy: ["%n's sweaty and switched and squirmin' between two big naked sauna keepers, and they've stopped pretendin' it's for their health.", "Every swish of the birch makes %n moan, and the sauna keepers swish harder to hear it.",
             "%n's slick as a seal from head to toe, and nobody in the sauna's keepin' their hands to themselves."],
    depth: ["tease", "held"], tw: ["night", "alone"], places: ["cabin", "wildlife"], sound: "spank", soundEnd: "creak", tags: [],
    writes: ["SWITCHED PINK", "STEAMED", "WELL DONE"],
  });

  // ── the cocoa stand ──
  seasonTrap("winter", "cocoastand", {
    icon: "☕", what: "the cocoa stand at the winter fair: milked straight into the pot if you make milk, or the cocoa's poured over you, and either way the fair drinks up", limit: /\b(milk|lactat|food|messy|public|lick)/i, hold: 6, where: "the cocoa stand",
    before(mn, v){ const p = prodOf(mn); v.milk = !!(makesMilk(mn) && p && p.milk > 40); },
    lines: {
      beats: (mn, v) => { const T = SEASON_LINES.cocoastand; return v.milk ? [T.come, T.milk1, T.milk2, T.drink] : [T.come, T.pour1, T.pour2, T.lick]; },
      come: ["The cocoa stand at the winter fair has a pot as big as a cauldron and a queue right round the block, and the keeper's just run out of milk. Then she sees %n.",
             "%n queues up at the cocoa stand for a mug, and the stand keeper looks them up and down and says, \"Oh, you'll do nicely. Come round the back.\"",
             "There's a sign on the cocoa stand: HOT COCOA, MADE FRESH. Under it stands the keeper, holdin' out a hand to help %n up onto the counter."],
      milk1: ["They sit %n up on the counter over the big copper pot, and the stand keeper rolls up her sleeves and starts milkin' them by hand, straight into the cocoa.",
              "{t}The keeper unbuttons %n's top, cups one of their heavy tits over the pot and squeezes, and a long white stream rings off the copper and swirls into the chocolate.",
              "Warm hands on %n's chest, a slow squeeze, and the first stream of milk hits the cocoa with a hiss, and the queue cheers."],
      milk2: ["Squeeze and pull, squeeze and pull, and the pot gets paler and creamier, and the stand keeper hums while she works and never spills a drop.",
              "{t}Both tits at once now, one in each hand, and the milk sprays into the pot in two warm streams while the front of the queue leans in to watch.",
              "The keeper stirs with one hand and milks with the other, tastes it off the spoon, and decides it needs more of %n."],
      drink: ["Then the cocoa's poured, mug after mug, and every one that's handed over the counter, the drinker raises it to %n before they sip.",
              "The whole fair drinks %n's cocoa, and the queue keeps comin', and the keeper keeps milkin', and %n's nipples are sore and tinglin' and very well looked after.",
              "\"Best batch all winter,\" says somebody with a cocoa moustache, and pats %n on the knee, and gets back in the queue for another."],
      pour1: ["They sit %n up on the counter, and the stand keeper takes the big ladle out of the pot and tips warm cocoa over their shoulders, slow, and it runs down all over them.",
              "\"Can't make the milk?\" says the stand keeper. \"Then you'll be the mug,\" and she pours a whole jug of warm cocoa down %n's front.",
              "The cocoa's warm, not hot, and it pours over %n's head and shoulders and down their front in a thick brown sheet that smells of chocolate and cinnamon."],
      pour2: ["Then a squirt of whipped cream on top, a handful of little marshmallows and a sprinkle of cinnamon, and %n's served.",
              "{t}The keeper tops %n with whipped cream, a swirl on each tit and a marshmallow on each nipple, and steps back to admire her work.",
              "{c}A dollop of whipped cream goes right on the tip of %n's cock, with a marshmallow on top of that, and the queue whistles."],
      lick: ["Folk queue up to drink straight off %n, slurpin' cocoa off their collarbones and out of their belly button and goin' back round for seconds.",
             "{t}Somebody licks the cocoa off %n's tits, slow, and sucks the marshmallow off one nipple and then the other.",
             "{c}Somebody kneels and licks the cream off %n's cock, and keeps goin' long after the cream's all gone.",
             "{v}A tongue chases a drip of cocoa all the way down %n's belly and between their legs, and finds it isn't the only thing wet down there."],
      endMilk: ["The stand keeper puts the lid on the pot at last, %ml of %n stirred into the cocoa and drunk by half the fair, and helps them down off the counter, light and empty and glowin'.",
                "%n's milked of %ml into the cocoa pot before the stand closes, and the keeper gives them the last mug, made with their own milk, for the road.",
                "By closin' time the whole fair's had a mug of %n, %ml of them gone into the pot, and the keeper buttons them back up and kisses their cheek. \"Same time tomorrow.\""],
      endDry: ["Not one more drop comes, however the keeper squeezes, so she pours %n a mug of the ordinary cocoa instead and lets them down off the counter, sore and tinglin'.",
               "%n's run dry before the queue is, and the keeper laughs and lets them down with a mug of their own and a kiss on the cheek."],
      endPour: ["The stand closes, and %n climbs down off the counter licked mostly clean, sticky with cocoa in all the places tongues didn't reach.",
                "%n's let down off the counter at closin' time with chocolate in their hair, cream in their ears and a marshmallow stuck somewhere they won't find till bedtime.",
                "The keeper wipes %n down with a cloth, misses most of it, and sends them off smellin' like the best cocoa at the fair."],
    },
    after(mn, v){
      arouse(mn, 35);
      if (v.milk){
        const got = drainMilk(mn, prodOf(mn).milk*0.6);
        trapMess(mn, "cocoastand", "milk", ["milk", ["chest"]]); face(mn, "milked", 90);
        return got > 0 ? { endKey: "endMilk", ml: ml(got) } : { endKey: "endDry" };
      }
      trapMess(mn, "cocoastand", "cocoa", ["cocoa", ["chest", "tummy", "face"]]); face(mn, "afterglow", 90);
      return { endKey: "endPour" };
    },
    scene: [["The fair's lit up with lanterns, and somebody's playin' a fiddle by the roast chestnut cart.",
             "The steam off the cocoa pot curls up into the cold air and smells like every good winter mornin' there ever was.",
             "Somebody's sheepdog barks at the queue and gets shushed. The queue doesn't move. Nobody's leavin' this queue.",
             "The keeper hands out mugs with one hand and takes pennies with the other, and never once stops smilin'."],
            ["{t}The keeper squeezes %n's tits, one then the other, slow, to see how they're holdin' up, and decides they'll do for a while yet.",
             "{c}Somebody in the queue reaches over the counter and gives %n's cock a squeeze for luck.",
             "{v}A hand slips up %n's thigh under the counter and gives their pussy a slow, sticky rub.",
             "Somebody licks a drip of cocoa off %n's chin, and then their lips, and then gets told off for queue-jumpin'."]],
    tender: ["The keeper's hands are warm and slow, and she asks %n every so often if they'd like a break.", "Every customer says thank you to %n, not the keeper, and means it.",
             "There's a stool on the counter for %n, with a cushion on it, and a blanket over their knees."],
    filthy: ["%n's the fair's cocoa cow, sat on the counter and squeezed for every mug, and the queue goes right round the block.", "%n's served up sticky and sweet on the counter for anybody with a penny and a tongue.",
             "%n's moanin' louder than the fiddler by the time the queue's done with them."],
    gear: [{ when: "hold", slot: "legs", label: "Cocoa Stand Ribbon", items: ["Ribbons"], color: "#7A3B1E", desc: "A brown satin ribbon round their knees, tied to the counter's leg so they can't wriggle off while they're bein' served." }],
    depth: ["milk", "watched", "mess"], tw: ["milk", "crowd", "day"], places: ["trough", "stalls", "stockade"], sound: "wet", tags: ["milking", "messy", "public"],
    writes: ["HOT COCOA", "MADE FRESH", "SERVED WARM", "ONE MUG, ONE PENNY"],
  });

  // ── the frost-fae ──
  seasonTrap("winter", "frostfae", {
    icon: "❄️", what: "the frost-fae in the hedgerow: cold kisses, frost on every bit of you, and kept right at the edge for their game", limit: /\b(cold|ice|edg|denial|fae|fair(y|ies)|monster)/i, hold: 5, where: "the frosty hedgerow",
    lines: {
      beats: [
        ["The hedgerow by the lane's white with frost this mornin', every twig furred in it, and as %n walks past, the frost starts to laugh.",
         "Blue lights dance over the frozen field at dusk, and when %n stops to look, they come driftin' over, and every one of them is a tall, pale, laughin' fae with hair like icicles.",
         "%n's breath fogs in the cold, and the fog doesn't drift away. It hangs there and grows, and shapes itself into a tall, slender woman made of frost, and she smiles with lips like blue ice."],
        ["Three frost-fae step out of the hedge, beautiful and cold and laughin' like breakin' ice, and their long fingers have %n's clothes off before they've finished sayin' \"wait.\"",
         "They spin a lace of hoarfrost round %n's wrists, fine as spider silk and strong as iron, and lift their arms up over their head and tie them to a branch of the old thorn.",
         "\"A warm one,\" the fae whisper all together, in voices like ice crackin' on a pond. \"Let's play.\" And they wind frost round %n's wrists and hold them fast to the hedge."],
        ["Then the kisses: cold kisses everywhere, three mouths at once, and wherever they land the frost blooms in ferns across %n's skin, and tingles.",
         "{t}Two of the fae bend to %n's tits and blow on their nipples, slow, till they're hard as icicles and rimed with frost, and then they lick the frost off.",
         "{c}A fae wraps her long cold fingers round %n's cock and strokes it, slow, and frost creeps up it in little ferns, and she laughs when it throbs.",
         "{v}One of the fae kneels between %n's legs and blows a thin thread of cold air right on their clit, and %n's knees give."],
        ["Every time %n's about to tip over the edge, the fae stop, all at once, and stand there laughin', waitin' for the warmth to ebb, and then they start again.",
         "The fae know exactly how close %n is. They can see it in the fog of their breath. And every time it's nearly there, they blow it cold.",
         "It's a game, the fae's favourite: how close can a warm one get without tippin' over. %n loses, over and over, and the fae win every time."],
      ],
      end: ["The sun comes up over the hill and the frost-fae melt away with it, laughin', and the frost lace drips off %n's wrists. They're left in the hedgerow achin' and edged, covered in frost ferns that won't fade for an hour.",
            "\"Again tomorrow,\" the fae whisper, and scatter like snow in the wind, and %n's left shiverin' and burnin' at the same time, right at the edge and nowhere near allowed over it.",
            "The fae get bored all at once, the way fae do, and blow away down the lane, and %n's left tied to the hedge with frost on their lashes and not one bit of relief till the lace melts."],
    },
    after(mn){
      const p = prodOf(mn); if (p) p.deniedUntil = Math.max(p.deniedUntil || 0, Date.now() + 10*60000);   // still at the edge a while (with the Companion's "hold me at the edge" on)
      arouse(mn, 45, 95); face(mn, "edged", 120);
      return null;
    },
    scene: [["A robin lands on the thorn above %n's tied hands, looks at the fae, and thinks better of it.",
             "Every breath %n takes turns to fog, and the fae breathe it in like perfume.",
             "Frost creeps along the hedge as the fae play, twig by twig, till the whole lane's white.",
             "One of the fae sings, high and thin, a song like wind in a chimney, and the others laugh."],
            ["{t}A fae circles each of %n's nipples with a fingertip of frost, round and round, and leaves a little star of ice on each.",
             "{c}Frost blooms along %n's cock wherever the fae's fingers have been, and her warm breath melts it off again.",
             "{v}A cold tongue flicks %n's clit, once, twice, and the fae laughs when they buck against the hedge.",
             "A fae kisses %n's mouth, cold as snowmelt, and steals the warmth right out of their breath."]],
    tender: ["The fae are wicked, but they're never cruel: the frost tingles and never bites.", "One of the fae keeps her cold hand on %n's cheek the whole time, gentle, like she's fond of them.",
             "The frost lace is soft as silk, and the fae check it with a cool fingertip now and then."],
    filthy: ["The fae edge %n till they're sobbin' and beggin' a hedge for mercy, and the hedge laughs.", "%n's drippin' and froze and tied to a thorn, humpin' the air, and the fae think it's the funniest thing they've seen all winter.",
             "%n would sell their soul to the fae for one more second, and the fae know it, and don't take the deal."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Frost Lace", items: ["HempRope"], color: "#D8ECFA", desc: "Lace spun out of hoarfrost round their wrists, fine as spider silk. It doesn't melt, and it doesn't let go." }],
    depth: ["tease", "held"], tw: ["night", "alone"], places: ["wildlife", "pasture"], sound: "hiss", tags: ["monsters"],
    writes: ["FAE'S PLAYTHING", "FROSTBITTEN", "NOT YET"],
  });

  // ── the farmyard snowman ──
  seasonTrap("winter", "snowman", {
    icon: "⛄", what: "the farmyard snowman: packed into him to the chin by the farmhands, the good bits dug out, and the whole yard plays", limit: /\b(cold|ice|encas|immobil|public|display)/i, hold: 6, where: "the farmyard snowman",
    lines: {
      beats: [
        ["There's a snowball fight in the farmyard, and %n's winnin' it right up until four farmhands tackle them into the biggest drift.",
         "The farmhands are buildin' a snowman in the yard, a big one, and they've done the bottom and the top and they're short a middle. Then %n walks out of the barn.",
         "%n goes over to admire the farmyard snowman, and the farmhands who built it look at each other and grin, and one of them says, \"Needs somethin', doesn't it.\""],
        ["They pack the snow round %n handful by handful, patted smooth and firm, till they're the snowman's big round middle with just their head stickin' out the top. It's farm snow, the soft kind. It's never as cold as you'd think.",
         "Round and round go the farmhands with armfuls of snow, packin' it tight, and in five minutes %n's the middle of a snowman from the ankles to the chin, and they can't so much as wiggle.",
         "They pack %n into a ball of snow for the snowman's middle, pat it firm, set the snowman's head on a plank behind them, and step back to admire a snowman with a face that blushes."],
        ["Then they dig little windows in the snow, right where it matters, and step back and laugh.",
         "{t}They scoop the snow away from %n's tits so they poke out the front like a pair of snowballs, and press two lumps of coal on them for buttons. The coal's cold. %n squeaks.",
         "{c}They dig %n's cock out of the snow and leave it standin' out the front, and somebody says the snowman's carrot nose has come down to the wrong place.",
         "{v}They dig a little hollow in the front, between %n's legs, and the cold air gets in, and so does a farmhand's warm hand."],
        ["Folk come by all mornin' to see the farmyard snowman, and every one of them stops to play with the bits that poke out.",
         "Somebody wraps a scarf round %n's neck and puts a hat on their head, and somebody else warms their hands on the bits of %n that are bare, and takes their time about it.",
         "{c}Everybody who passes gives the snowman's \"carrot\" a stroke for luck, and by midday it's the luckiest snowman on the farm.",
         "{t}Everybody who walks past pinches the snowman's coal buttons, and %n's as red as a holly berry from the neck up."],
      ],
      end: ["By the afternoon the sun's out and the snowman's slumpin', and %n slides out of the slush pink and shivery and grinnin', and the farmhands wrap them up in a blanket by the stove.",
            "The farmhands dig %n out at last and rub them warm with a big towel, and the snowman gets a new middle made of plain old snow, which nobody pays any attention to.",
            "%n's thawed free by the farm girl with a kettle of warm water and a mug of cocoa, and the snowman's left with a %n-shaped hole in his tummy."],
    },
    after(mn){ arouse(mn, 35); face(mn, "edged", 90); return null; },
    scene: [["A crow lands on the snowman's head, looks down at %n, and caws, rude as anything.",
             "The farmhands start a second snowman next to %n and argue about whether it's lookin' at them.",
             "The sun comes out for a minute, and a drip of meltwater runs down the back of %n's neck.",
             "Somebody sticks two twigs in the snow for arms and waves one of them at passers-by."],
            ["{t}Somebody warms %n's nipples in their mouth, one and then the other, and puts the coal buttons back on after.",
             "{c}Somebody wraps a warm mitten round %n's cock and strokes it, slow, and says it's to stop it gettin' frostbite.",
             "{v}A warm hand slips into the hollow between %n's legs and rubs, slow, and it's the only warm bit of them, and then it's very warm indeed.",
             "Somebody gives the snowman a kiss on the mouth, and the snowman kisses back."]],
    tender: ["The farmhands check %n's toes are warm every half hour, and pack fresh warm snow where it's gone icy.", "Somebody keeps a mug of cocoa to %n's lips the whole time, sip by sip.",
             "The snow's packed soft and the farmhands are gentle, and %n's never been so cosy bein' a snowman."],
    filthy: ["%n's the farmyard snowman with the good bits on show, and everybody who walks past helps themself.", "Packed in snow to the chin and squirmin', %n's the farm's favourite thing to play with this mornin'.",
             "Every bit of %n that pokes out of the snow's been squeezed, stroked or sucked by noon, and the queue to build the next snowman's growin'."],
    gear: [{ when: "hold", slot: "device", label: "The Farmyard Snowman", items: ["Snowman"], desc: "Packed into the farmyard snowman up to the chin, patted smooth, with a scarf on top and the good bits dug out." }],
    depth: ["held", "watched", "tease"], tw: ["day", "crowd"], places: ["pasture", "stockade", "cabin"], sound: "wet", tags: ["restraint", "public"],
    writes: ["FROSTY", "SNOW BUNNY", "PLAY WITH ME", "BUILT TO LAST"],
  });

  // ── ?stocking: what's in yours this mornin' ──
  // the sweet ones (as winter sweets), the tricky ones (as coal), the same rules as a trick-or-treat candy (10y9n2-halloween-2.js)
  const STOCKING_SWEETS = { clover: "a peppermint cream", golden: "a gold-foil chocolate coin", honey: "a honey gingerbread star", musk: "a blue-striped candy cane",
    feather: "a sugared snowflake", heatmist: "a cinnamon heart" };
  const STOCKING_COAL = { moo: "a lump of coal (it's liquorice, and it tastes of moo)", bell: "a lump of coal with a jingle bell inside", hiccup: "a lump of coal that fizzes",
    needy: "a lump of coal with a pink sugar heart", wrongbarn: "a lump of coal in the shape of somebody else's barn", wolfscent: "a wolf-shaped lump of coal",
    goblinmusk: "a lump of coal that smells of goblin", tentaclemusk: "a squishy purple lump of coal with far too many arms" };
  const STOCKING_MESSES = ["peppermint", "cocoa", "icing", "eggnog", "honey", "chocolate"];
  function candyOk(mn, c){
    const traps = isSubject(mn) && !(rec(mn) || {}).trapsOff;
    return potionDef(c.id) && (!c.traps || traps) && !potionRefusal(mn, c.id, mn) && (c.id !== "heatmist" || !limitBlocks(mn, "heat"));
  }
  function stockingCommand(sender, args, R){
    const r = rec(sender);
    if (!onBooks(sender)){ R("🧦 Stockin's are for folks on the books, sugar."); return; }
    if (!seasonsOn().includes("winter")){ R("🧦 It's not winter, sugar. The stockin's go up on the farm's hearth on the first of December."); return; }
    if (!charFor(sender)){ R("🧦 Your stockin's hangin' on the farm's hearth, sugar. Come by and look in it."); return; }
    if (state.trapRuns && state.trapRuns.has(sender)){ R("🧦 You're a bit tied up right now, sugar. Your stockin'll keep."); return; }
    if (r.stockingDay === dayKey()){ R("🧦 You've had today's, sugar. There'll be somethin' new in it tomorrow."); return; }
    // naughty: a naughty mark since they last looked, or a naughty or degraded tier
    const marks = r.naughtyMarks || 0, naughty = CFG.PUNISH_TIERS.includes(r.tier) || (r.stockingMarks !== undefined && marks > r.stockingMarks);
    r.stockingDay = dayKey(); r.stockingMarks = marks; r.stockingN = (r.stockingN || 0) + 1; saveLedger(); audit(sender, "STOCKING", naughty ? "coal" : "nice");
    emote("🧦 "+tFill(pickFor(sender, "stocking:look", STOCKING_LINES.look), sender), sender);
    later(() => {
      if (!charFor(sender)) return;
      if (naughty){
        const c = TRICKS.filter(x => STOCKING_COAL[x.id] && candyOk(sender, x));
        const pick = c.length ? c[Math.floor(Math.random()*c.length)] : null;
        emote("🧦 "+tFill(pickFor(sender, "stocking:coal", pick ? STOCKING_LINES.coal : STOCKING_LINES.plainCoal), sender, { x: pick ? STOCKING_COAL[pick.id] : "" }), sender);
        if (pick) later(() => { if (charFor(sender)) givePotion(sender, pick.id, BOTMN(), "a stockin' candy"); }, 1500);
        later(() => { if (charFor(sender)) bodyMark(sender, { write: { line: "NAUGHTY LIST", area: "hips" } }); }, 3500);
        return;
      }
      // nice: a ribbon now and then, a sweet mess for those who like one, or a sweet
      const roll = Math.random();
      if (roll < 0.08){ emote("🧦 "+tFill(pickFor(sender, "stocking:ribbon", STOCKING_LINES.ribbon), sender), sender); earnRibbons(sender, 1, "your stockin'", BOTMN()); return; }
      if (roll < 0.33 && hasCompanion(sender)){
        const m = STOCKING_MESSES[Math.floor(Math.random()*STOCKING_MESSES.length)];
        if (trapMess(sender, "stocking", m)){ emote("🧦 "+tFill(pickFor(sender, "stocking:mess:"+m, STOCKING_LINES.mess[m]), sender), sender); return; }
      }
      const c = TREATS.filter(x => STOCKING_SWEETS[x.id] && candyOk(sender, x));
      if (c.length){
        const pick = c[Math.floor(Math.random()*c.length)];
        emote("🧦 "+tFill(pickFor(sender, "stocking:sweet", STOCKING_LINES.sweet), sender, { x: STOCKING_SWEETS[pick.id] }), sender);
        later(() => { if (charFor(sender)) givePotion(sender, pick.id, BOTMN(), "a stockin' candy"); }, 1500);
        return;
      }
      emote("🧦 "+tFill(pickFor(sender, "stocking:plain", STOCKING_LINES.plain), sender), sender);
    }, 2000);
  }
  const STOCKING_LINES = {
    look: ["%n goes to the big hearth and finds their stockin', the one with their name stitched on the cuff, and it's lumpy. They reach in.",
           "There's a stockin' on the farm's hearth with %n's name on it in white letters, and somethin's been put in it overnight. %n reaches down into the toe.",
           "%n unhooks their stockin' from the hearth, gives it a shake, hears somethin' rattle, and tips it out into their hand.",
           "The farm girl's by the hearth in her red winter hat when %n comes for their stockin', and she watches them reach in with a very innocent look on her face."],
    sweet: ["Down in the toe there's %x, wrapped in shiny paper, and a little note from the farm girl that says \"for bein' good\".",
            "%n finds %x in the toe of their stockin', and eats it right there by the fire.",
            "There's %x in there, and a satsuma, and a handful of nuts. %n has the sweet first, obviously."],
    coal: ["There's somethin' in the toe, all right: %x, and a little note in the farm girl's writin' that says \"NAUGHTY\". %n eats it anyway.",
           "%n tips their stockin' out and gets %x and a puff of soot. The farm girl tuts. \"Should've thought of that before, sugar.\"",
           "%x. That's all that's in it. The farm girl pats %n on the head. \"Go on, eat it. It's good for you.\" It is not good for them."],
    plainCoal: ["There's a lump of coal in the toe. A real one. %n gets soot all over their hands, and the farm girl tuts.",
                "Coal. Just coal. The farm girl writes somethin' on her clipboard, and %n's fairly sure it's their name."],
    ribbon: ["There's a ribbon in the toe of %n's stockin', a real one, tied in a bow, with a note: \"for a good winter.\"",
             "%n reaches into their stockin' and pulls out a little red rosette. It's a real ribbon. The farm girl winks."],
    plain: ["There's a satsuma in the toe, and a handful of walnuts, and a little wooden cow somebody's carved. It's sweet.",
            "%n finds a pair of thick wool socks in their stockin'. Warm, soft, and in the farm's colours. Very practical."],
    mess: {
      peppermint: ["Somethin' in the toe bursts when %n squeezes it: a whole bag of peppermint syrup, and it runs down their arm and splashes all down their front, sticky and pink."],
      cocoa: ["There's a little flask in the stockin', and when %n opens it, warm cocoa sloshes out all down their front. The farm girl laughs till her hat falls off."],
      icing: ["%n reaches in and gets a handful of royal icin', thick and white, and before they can do anything about it the farm girl smears the rest of it on their chest. \"Merry winter.\""],
      eggnog: ["A paper cup of eggnog's been wedged in the toe, and it tips all over %n when they pull the stockin' down, creamy and cold and smellin' of nutmeg."],
      honey: ["There's a honeycomb in the stockin', and it's been squashed, and %n's covered in honey to the elbow before they've worked out what it is."],
      chocolate: ["Somebody's left a chocolate orange in %n's stockin' right by the fire, and it's melted, and now %n's wearin' most of it."],
    },
  };

  if (W.__FARMHAND_TEST__) Object.assign(W, { __stocking: (m) => stockingCommand(m, [], (t) => tell(m, t)) });
