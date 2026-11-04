  /* WHAT'S IN THIS FILE (10y9v-yule.js)
     YULE on the farm (Laynie, Oct 27: "soltice and equinox based packs with pagan/wiccan themes would be cool"): the week
     of the winter solstice, Dec 18 to 24 by the bot's clock, inside winter (10y9u-winter.js), so both packs spring then.
     The old customs, kept the farm's way: the Yule log hauled in, the solstice play where the Holly King and the Oak King
     fight for the year (two of the farmhands, crowned for the night), the Wild Hunt in the storm, wassailin' the orchard,
     the ivy on the old barn, and the candles kept lit through the longest night. The rutting stag, the lantern and the
     trapper's bearskin rug come round more, and the farm girl wears a holly crown and a deep-red hooded cloak.
       yulelog    tied astride the Yule log as it's hauled in from the woods, every bump of the track grindin'
       hollyking  the solstice play: the Holly King and the Oak King fight for the year, and share the prize, you (both holes)
       wildhunt   the Wild Hunt: spectral huntsmen ride down out of the storm and take the quarry they've caught
       wassail    wassailin' the orchard: tied to the oldest apple tree, toasted with cider, licked, and the first wassailer's
       ivy        the old barn's ivy: it winds round you, holds you to the wall, and lays its berry pods in you
       longnight  the longest night: tied in the ring of candles, and the wax drips, an hour at a time, till the sun comes back
     New mess for the Companion to draw: red candle wax. %n name · %c the cock · %h the hole · %ml how much · %x how many
  */
  Object.assign(MESS, { wax: "#A3162B" });
  season("yule", {
    label: "Yule", icon: "🕯️",
    alias: ["wintersolstice", "yuletide", "jul", "longestnight", "midwinternight"],
    on: (dt) => { const d = md(dt); return d >= 1218 && d <= 1224; },
    dates: () => "Dec 18 – 24, the winter solstice",
    blurb: "the longest night, the Holly King and the Oak King, and the sun comin' back",
    why: ["It's Yule, the longest night, and somethin' old is abroad on the farm.", "The year's turnin' at the solstice, and this one turned on you.",
          "Yule on the farm: the dark's long, and it's full of things.", "The old customs want keepin' at Yule, sugar, and you've been kept."],
    start: ["Yule's come to the farm: the solstice, the longest night of the year. There's a log on the hearth that'll burn till mornin', holly over every door, and the Holly King and the Oak King fight for the year again tonight.",
            "It's the turn of the year, sugar. The nights are as long as they get, there are candles lit all round the farm, and out in the storm the Wild Hunt's ridin'. Keep a light in the window.",
            "Yule on the farm! Wassail in the orchard, the Yule log on the hearth, ivy creepin' over the old barn, and the longest night to get through. The sun comes back after. It always does."],
    end: ["Yule's over. The sun's comin' back a little more every day, the Yule log's ash on the fields, and the Holly King's crown is hangin' in the barn till next year.",
          "The longest night's behind us, sugar. The Hunt's gone back up into the clouds, the candles are out, and the days are gettin' longer."],
    also: ["stag", "lantern", "bearskin"],
    // the farm girl's: a holly crown and a deep-red hooded cloak, and the fur gloves she wears all winter
    costume: [
      { slot: "hat", name: "Holly Crown", items: ["FlowerCrown"], color: "#1F5C2E", desc: "A crown of dark green holly, for the longest night." },
      { slot: "cloak", name: "Yule Cloak", items: ["HoodedCloak"], color: "#7A1020", desc: "A long deep-red hooded cloak, for keepin' the longest night out." },
      { slot: "gloves", name: "Fur Gloves", items: ["GlovesFur"], desc: "Soft white fur gloves, warm as toast, for handin' out cocoa." },
    ],
  });
  for (const [k, places] of Object.entries({ stag: ["wildlife", "pasture"], lantern: ["wildlife", "cabin"], bearskin: ["cabin"] }))
    if (!SEASON_PLACES[k]) SEASON_PLACES[k] = places;

  // ── the Yule log ──
  seasonTrap("yule", "yulelog", {
    icon: "🪵", what: "the Yule log: tied astride it as it's hauled in from the woods, and every bump of the track grinds the old knot into you", limit: /\b(bondage|restrain|tied|public|edg|denial)/i, hold: 6, where: "the Yule log",
    lines: {
      beats: [
        ["The farmhands are haulin' the Yule log in from the woods, a great old ash trunk on ropes, singin' as they go, and when they see %n they stop singin' and start grinnin'.",
         "\"Every Yule log wants a rider,\" says the head farmhand, and %n's lifted up and sat astride the great trunk before they can ask what that means.",
         "There's a log as big as a cow on the track from the woods, ropes on the end of it and half the farm on the ropes, and somebody's saved a seat on top of it for %n."],
        ["They tie %n's ankles under the log with red ribbon, and their knees to the bark, and there's a big smooth knot in the wood right between their legs, polished by every Yule there's ever been.",
         "%n's tied on astride the log, thighs round it, ankles tied together underneath, and the old knot in the bark is pressed right up where it'll do the most mischief.",
         "Red ribbon round the ankles, round the knees, and a sprig of holly tucked behind %n's ear, and then everybody on the ropes heaves, and the log lurches off down the track."],
        ["Every rut in the track bumps the log, and every bump grinds the knot up into %n, and the farmhands on the ropes sing louder to cover the noises they're makin'.",
         "{c}The knot grinds against %n's cock and balls with every bump, slow and heavy, and they grip the bark with both hands and gasp.",
         "{v}The smooth old knot rocks against %n's pussy with every heave of the ropes, and it's warm from the sun of a hundred summers, and it doesn't stop.",
         "The track's bumpy, and the log's slow, and the farmhands take the long way round, past every pothole on the farm, and %n knows they're doin' it on purpose."],
        ["Folk come out of every barn to watch the log go by and toss holly at the rider, and somebody walks alongside for a while just to hold %n by the hips and rock them.",
         "At the farmhouse door they stop, and the log has to be got over the step, and they rock it, and rock it, and rock it, and %n's moanin' like a gate in the wind.",
         "Halfway home the farmhands stop for a sip of cider and leave the log rockin' gently on its ropes, and %n can't stop it rockin', and doesn't want to."],
      ],
      end: ["The log's rolled onto the hearth at last, and the farmhands untie %n and lift them down, wobbly and flushed and achin' right on the edge. \"Luck for the year,\" says the head farmhand, and lights the log.",
            "They untie %n at the hearth, legs shakin', red ribbon marks round their ankles and the knot's print on the inside of their thighs, and the Yule log's lit with the whole farm cheerin'.",
            "%n's lifted off the log by the fire, hot and edgy and very well ridden, and given the first cup of wassail for bringin' the luck in."],
    },
    after(mn){ arouse(mn, 45, 95); face(mn, "edged", 120); return null; },
    scene: [["The farmhands on the ropes sing an old haulin' song, one line each, and everybody joins in on the chorus.",
             "Snow sifts down off the branches as the log goes by, and lands on %n's shoulders and melts.",
             "The log's bark is rough under %n's hands, and smells of moss and woodsmoke and the deep woods.",
             "Somebody runs ahead to open every gate, and holds it, and stares."],
            ["{c}A farmhand walkin' alongside reaches up and strokes %n's cock where it's pressed to the bark, slow, in time with the haulin' song.",
             "{v}A farmhand walkin' alongside slips a hand between %n and the knot and rubs, and the next bump presses their fingers deeper.",
             "{t}Somebody walkin' alongside reaches up and squeezes %n's tits, one and then the other, for luck.",
             "Somebody walks alongside and kisses %n every time the log stops, which is a lot of times."]],
    tender: ["The farmhands put a folded blanket on the log first, so the bark doesn't scratch.", "Every time the log stops, somebody asks %n if they're all right up there, and means it.",
             "The haulin' song's slow and kind, and the farmhands pull gentle on the ropes."],
    filthy: ["%n's humpin' a log in front of the whole farm, and the whole farm's singin' about it.", "The knot's slick and %n's drippin' down the bark, and the farmhands take the bumpiest way home they can find.",
             "%n's the Yule log's rider, moanin' at every pothole, and they'd ride it to the woods and back again if anybody asked."],
    gear: [{ when: "hold", slot: "legs", label: "Yule Log Ribbons", items: ["Ribbons"], color: "#B3122E", desc: "Red ribbon round their ankles and knees, tyin' them astride the Yule log as it's hauled in." }],
    depth: ["held", "watched", "tease"], tw: ["crowd", "night"], places: ["wildlife", "cabin", "pasture"], sound: "rope", soundEnd: "wood", tags: ["restraint", "public"],
    writes: ["LOG RIDER", "YULE LUCK", "WELL RIDDEN"],
  });

  // ── the Holly King and the Oak King ──
  seasonTrap("yule", "hollyking", {
    icon: "👑", what: "the solstice play: the Holly King and the Oak King fight for the year, and the prize is you, and they share it", limit: /\b(double|both holes|gang|public|threesome)/i,
    stud: { sire: -72, name: "the Holly King and the Oak King", type: "human", loads: 2, ml: 220, hold: 8, hole: "vulva", bonus: 1.5, where: "the solstice play", person: true, both: true },
    lines: {
      beats: [
        ["The farm puts on the solstice play in the big barn at Yule, and two of the farmhands are crowned for it: the Holly King in green and berries, the Oak King in brown leaves and acorns. And somebody's put %n down as the prize.",
         "There's a ring of straw bales in the big barn and the whole farm sat round it, and in the middle stand the Holly King and the Oak King, crowned and painted, and the farm girl leads %n into the ring by the hand. \"Here's what you're fightin' for.\"",
         "%n wanders into the big barn at dusk and finds the solstice play about to start, and the Holly King takes one look at them and says, \"That one. That's the prize this year.\""],
        ["The kings fight for the year with wooden swords, round and round the ring, and the crowd cheers every whack, and %n's tied to the post in the middle in a crown of mistletoe, watchin' them.",
         "Clack, clack, go the wooden swords. The Holly King's had the dark half of the year, and he doesn't want to give it up, and the Oak King's come for the light. %n's at the post in the middle with their wrists tied with green ribbon.",
         "It's a proper fight, all bluster and stage-fallin', and the crowd boos the Holly King and cheers the Oak King, and at the end the Holly King goes down on one knee, as he does every year, and gives up the year."],
        ["Then the Oak King comes for his prize, and the Holly King gets up off his knee and comes too, because the play says the prize is shared, and has been since before anybody can remember.",
         "{c}The two kings untie %n from the post, and the Oak King wraps a hand round %n's cock and says, \"Fair's fair. The year's mine, but he gets his half.\"",
         "{v}The Oak King lays %n back on the straw and runs a hand up between their legs, and finds their pussy ready for him, and the Holly King kneels on the other side.",
         "{t}The Holly King cups %n's tits from behind, a good loser, and the Oak King kisses them, and the crowd round the bales goes very quiet."],
      ],
      in: [
        ["{v}The Oak King takes %n's %h, slow and proud, and the Holly King settles in behind and takes what's left, and the two kings rock %n between them like the year turnin'.",
         "{nv}The Oak King takes %n's %h, slow and proud, and the Holly King kneels at their head and feeds them his cock, and the two kings rock %n between them like the year turnin'.",
         "The light half of the year and the dark half, both of them in %n at once, and the crowd round the bales is on its feet."],
        ["The Oak King fills %n with a groan that rattles the barn doors, and the Holly King follows him over, and %n's stuffed full at both ends of the year.",
         "They finish together, the old way, one load for the dark half and one for the light, and the crowd throws holly and oak leaves into the ring."],
      ],
      over: [["They don't take them. They kneel either side of %n in the straw and stroke themselves over them, and paint them across the belly and chest, the dark half and the light half both, while the crowd cheers.",
              "The kings rut against %n from both sides, between their thighs and against their back, and spill across them together, and the crowd throws leaves."]],
      end: ["The kings lay %n down in the straw with %ml of the year in their %h, and the Holly King puts his crown on %n's head. \"Till midsummer,\" he says, \"when I win it back.\"",
            "%n's carried out of the ring on the kings' shoulders, %ml drippin' from their %h, wearin' the Holly King's crown, and the whole farm cheers the turnin' of the year.",
            "The play's over, the year's turned, and %n's left on the straw in the middle of the ring with %ml in their %h and holly in their hair."],
      endOver: ["The kings help %n up, painted with %ml of the both of them, and the Holly King crowns them with his holly. \"Till midsummer.\"",
                "%n's led out of the ring wearin' the Holly King's crown and %ml of the two kings, and the crowd's still throwin' oak leaves."],
    },
    scene: [["The crowd round the bales stamps its feet and claps the rhythm, slow, like a heartbeat.",
             "The barn's lit with lanterns and the Yule log's glow through the open door, and every shadow in the place is long.",
             "Somebody at the back's playin' a fiddle, the old tune that goes with the play, and everybody knows the words.",
             "The kings' crowns slip, the Holly King's berries scatter, and nobody stops to pick them up."],
            ["{t}The Holly King's hands are on %n's tits the whole time, squeezin' slow, and the Oak King's mouth is on their neck.",
             "{c}One of the kings has a hand round %n's cock and won't let go, and they argue, very politely, about whose turn it is.",
             "{v}The Oak King's thumb finds %n's clit and circles, slow as the year turnin', and the Holly King laughs into their hair.",
             "Both kings kiss %n at once, one each side of their mouth, and then each other, over them."]],
    tender: ["The kings are gentle, and every time %n gasps, one of them asks if the prize is all right.", "The Holly King holds %n's hand the whole time, a good loser, and strokes their hair.",
             "It's slow and warm and ceremonial, and every touch feels like it means somethin'."],
    filthy: ["%n's the prize of the solstice play, spitroasted by two kings in front of the whole farm, and they're beggin' for the year to never turn.", "The two kings use %n like they've won 'em, which they have, both of 'em.",
             "%n's stuffed at both ends by the light and the dark, and the crowd's countin' strokes."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Solstice Ribbon", items: ["Ribbons"], color: "#1F5C2E", desc: "Green ribbon round their wrists, tyin' them to the post in the middle of the solstice ring." },
           { when: "after", slot: "hat", label: "Holly King's Crown", items: ["FlowerCrown"], color: "#1F5C2E", mins: 30, desc: "The Holly King's own crown of holly and red berries, put on their head after the play. Till midsummer." }],
    depth: ["watched", "breed"], tw: ["crowd", "night", "breed"], places: ["stalls", "stockade", "cabin"], sound: "wood", tags: ["public"],
    writes: ["THE YEAR'S PRIZE", "BOTH KINGS", "SHARED", "TILL MIDSUMMER"],
  });

  // ── the Wild Hunt ──
  seasonTrap("yule", "wildhunt", {
    icon: "🏹", what: "the Wild Hunt: spectral huntsmen ride down out of the storm on the longest night, and you're the quarry they've caught", limit: /\b(gang|chase|hunt|ghost|spirit|monster|cnc|non.?con)/i,
    stud: { sire: -73, name: "the Wild Hunt", type: "human", loads: 3, ml: 160, hold: 8, hole: "vulva", bonus: 1.4, where: "the Wild Hunt's road", person: true },
    lines: {
      beats: [
        ["The wind gets up all at once on the longest night, and over it comes the sound of horns, and hooves on the clouds, and %n looks up to see the Wild Hunt pourin' down out of the storm.",
         "%n's crossin' the top field when the storm comes, and in the storm there are riders, pale and laughin', and their horns blow, and every one of them turns to look at %n.",
         "There's a sound like a hundred horns in the wind, and the lanterns all over the farm go out at once, and the Wild Hunt comes down the lane like a flood, and %n's standin' right in the way."],
        ["%n runs. Everybody runs from the Hunt. The huntsmen laugh, and let them, and ride them down in the stubble at the end of the field, and a rope of silver mist drops round %n's shoulders.",
         "The Huntmaster leans from his saddle, scoops %n up across his knees like a deer, and the whole Hunt rides on into the storm with %n slung over his saddlebow.",
         "The Hunt rides round %n in a ring, horns blowin', and the ring gets smaller, and smaller, and then they're off their horses, which are only mist and moonlight, and their hands are on %n."],
        ["They lay their quarry down on the frosty grass in the middle of their ring, and their hands are cold and their eyes are like stars, and they strip %n the way you'd skin a hare, quick and certain.",
         "{c}The Huntmaster kneels over %n and takes their cock in a cold hand and strokes it, and his eyes are silver, and he smiles like a man who's been huntin' for a thousand years.",
         "{v}The huntsmen hold %n's knees apart and the Huntmaster slides two cold fingers into their pussy, and the horns of the Hunt blow in the storm overhead.",
         "{t}Cold hands on %n's tits, two huntsmen at once, and their breath steams silver, and the storm howls round the ring like the hounds in the old stories."],
      ],
      in: [
        ["The Huntmaster takes %n's %h first, a huntsman's right, and he rides them like he rides the storm, hard and wild and fast.",
         "One after another the huntsmen take their turn in %n's %h, cold at first and then not cold at all, and the storm roars round them."],
        ["Three of them fill %n before the Hunt's horn calls them on, each one colder and deeper than the last, and the stars wheel overhead.",
         "The Huntmaster finishes in %n with a shout that turns into a horn call, and the next huntsman's already there, and the next."],
      ],
      over: [["They don't take them. They kneel round %n in the frost and stroke themselves, and spill across their quarry one after another, silver and cold, while the storm howls.",
              "The huntsmen rut against %n in the frost, between their thighs, over their back, and paint them silver with what the Hunt leaves behind."]],
      end: ["The Hunt's horn calls, and the riders are gone back up into the storm all at once, and %n's left on the frosty grass with %ml of the Wild Hunt in their %h and frost in their hair.",
            "The storm passes. The riders pass with it. %n lies in the middle of the field under the stars with %ml in their %h and the sound of horns still ringin' in their ears.",
            "\"Next Yule,\" says the Huntmaster, and kisses %n with lips like snowmelt, and rides off into the clouds, and leaves them %ml fuller than he found them."],
      endOver: ["The Hunt rides off into the storm and leaves %n in the frost, painted with %ml of silver, the horns fadin' over the hills.",
                "%n's left in the stubble under the stars with %ml of the Wild Hunt across their skin, and the storm's gone as quick as it came."],
    },
    scene: [["The horns of the Hunt blow overhead, long and wild, and the wind answers them.",
             "The Hunt's horses stand off in the dark, made of mist and moonlight, and wait, and don't come near.",
             "Snow whips round the ring of huntsmen, and none of it touches them.",
             "Somewhere far off, a farmhouse door slams. Nobody comes out on the longest night when the Hunt's ridin'."],
            ["{t}A huntsman's cold mouth closes on %n's nipple, and the cold of it goes all the way through them.",
             "{c}A cold hand strokes %n's cock while they're taken, fast, in time with the horns.",
             "{v}A huntsman's thumb rubs %n's clit, cold and quick, and the Hunt laughs when they buck.",
             "The Huntmaster holds %n's face in his cold hands and makes them look at the stars while it happens."]],
    tender: ["The Huntmaster wraps %n in his cloak first, so the frost can't get at them.", "For all their wildness the huntsmen are careful with their quarry, and every hand is steady.",
             "The Huntmaster tells %n, low, that it's an honour to be caught by the Hunt, and they almost believe it."],
    filthy: ["%n's the Hunt's quarry, run down and spread in the frost and used by every rider in turn.", "The huntsmen pass %n round the ring like a trophy, and %n's moanin' louder than their horns.",
             "%n's stuffed and frosted and drippin' silver, and the Hunt's not done with its catch."],
    gear: [{ when: "hold", slot: "ropeArms", label: "The Hunt's Rope", items: ["HempRope"], color: "#AEB9CC", desc: "A rope of silver mist from the Wild Hunt, round their wrists. It's cold as moonlight and it doesn't let go." }],
    depth: ["held", "breed"], tw: ["night", "alone", "breed"], places: ["wildlife", "pasture"], sound: "ropelong", tags: ["monsters"],
    writes: ["THE HUNT'S QUARRY", "CAUGHT", "RUN DOWN"],
  });

  // ── wassailin' the orchard ──
  seasonTrap("yule", "wassail", {
    icon: "🍎", what: "wassailin' the orchard: tied to the oldest apple tree, toasted with cider, licked clean, and the first wassailer gets the luck", limit: /\b(messy|food|public|lick|gang)/i, hold: 6, where: "the orchard",
    lines: {
      beats: [
        ["The farm goes out wassailin' the orchard at Yule, lanterns and pots and pans and a big bowl of hot cider, to wake the apple trees up for spring. %n's carryin' a lantern at the front, which is a mistake.",
         "There's a crowd in the orchard with lanterns and a steamin' wassail bowl, bangin' pans to wake the trees, and when %n comes to see, the wassail master points at them with his ladle. \"There's our toast.\"",
         "%n follows the singin' out to the orchard and finds the whole farm round the oldest apple tree, and the wassail master smiles and holds out a ribbon."],
        ["They tie %n to the oldest apple tree with red and green ribbon, their back to its old twisted trunk, and hang toast soaked in cider in the branches over their head for the robins.",
         "\"The old tree wants a gift,\" says the wassail master, tyin' %n's wrists round the trunk, \"and a toast,\" and he tips a ladle of warm cider over their head.",
         "Ribbon round the wrists, round the trunk, a sprig of mistletoe out of the branches tucked behind %n's ear, and the wassail master raises the bowl."],
        ["Then everybody toasts the tree, and every toast's poured over %n, warm cider down their chest and belly and legs, till they're soaked and steamin' in the cold.",
         "\"Wassail!\" shouts the crowd, and a ladle of cider goes over %n, and another, and the bangin' of the pots gets louder, and the cider runs into all their creases.",
         "{t}The wassail master pours a ladle of cider slow over %n's tits, and watches it run off the nipples, and pours another for luck."],
        ["Then the wassailers lick the tree's gift clean, one at a time, slow, and every one of them sings a line of the wassail song into %n's skin.",
         "{c}A wassailer kneels at the roots and licks the cider off %n's cock, and sucks it, and the crowd sings louder.",
         "{v}Somebody kneels in the frosty grass and licks the cider from between %n's legs, deep, and the old tree creaks.",
         "The cider's lapped off %n's neck and collarbones and belly by a dozen tongues, and somebody keeps refillin' the ladle."],
      ],
      end: ["The first wassailer gets the year's luck, the old way, and takes it against the tree: %ml of it in %n's %h, and the orchard cheers, and the pans bang, and the wassail master unties them.",
            "%n's untied from the old apple tree with %ml in their %h, cider in their hair and a dozen kisses on their skin. \"Good crop this year,\" says the wassail master.",
            "The first wassailer takes their luck in %n's %h against the old twisted trunk, %ml of it, and the robins come down for the toast."],
      endOver: ["The first wassailer takes their luck against the tree and spills %ml down %n's thighs, and the orchard cheers, and the pans bang.",
                "%n's untied from the old apple tree soaked in cider and %ml of somebody's luck, and the wassail master hangs another piece of toast in the branches."],
    },
    after(mn){
      const got = hwFill(mn, 150, 1.3); arouse(mn, 35); face(mn, got.h ? "bred" : "afterglow", 90);
      return got.h ? { endKey: "end", ml: ml(got.ml), h: TRAP_HOLE[got.h] } : { endKey: "endOver", ml: ml(got.ml) };
    },
    scene: [["The pots and pans bang to wake the trees, and the old apple tree creaks like it's listenin'.",
             "The wassail bowl goes round and round, hot and spicy, and everybody's cheeks are red.",
             "A robin flutters down to the toast in the branches right over %n's head, and stares at them.",
             "The singin' gets louder and further off key with every pass of the bowl."],
            ["{t}Somebody sucks a drop of cider off %n's nipple, and then the other, and then goes back to the first.",
             "{c}Somebody's hand wraps round %n's cock, sticky with cider, and strokes it in time with the song.",
             "{v}Fingers slip between %n's legs, slick with cider, and rub slow while the crowd sings.",
             "The wassail master kisses %n, deep, and tastes of hot cider and cloves."]],
    tender: ["The cider's warm, not hot, and the wassail master checks it on his wrist before every ladle.", "Somebody holds the wassail bowl to %n's lips between toasts so they get a sip too.",
             "Every wassailer whispers %n a wish for the year before they lick."],
    filthy: ["%n's the orchard's offerin', tied to a tree and soaked in cider, and the whole farm's lappin' it off 'em.", "Every tongue in the orchard's been on %n by the end, and %n's moanin' the wassail song.",
             "%n's sticky and drippin' and tied to a tree, and the wassailers keep comin' back for seconds."],
    mess: ["cider", ["chest", "tummy", "face"]],
    gear: [{ when: "hold", slot: "ropeArms", label: "Wassail Ribbons", items: ["Ribbons"], color: "#B3122E", desc: "Red and green ribbons, like the ones tied on the oldest apple tree, tyin' their wrists round its trunk." }],
    depth: ["held", "watched", "mess"], tw: ["crowd", "night"], places: ["pasture", "trough", "wildlife"], sound: "wet", tags: ["messy", "public", "restraint"],
    writes: ["WASSAIL", "THE ORCHARD'S GIFT", "GOOD CROP"],
  });

  // ── the ivy on the old barn ──
  seasonTrap("yule", "ivy", {
    icon: "🌿", what: "the ivy on the old barn: it winds round you, holds you to the wall, and lays its berry pods in you", limit: /\b(plants?|vines?|tentacles?|monster)/i, hold: 7, where: "the old barn's ivy",   // (eggs in their limits: it only plays)
    before(mn, v){ v.h = !limitBlocks(mn, "eggs") ? openHole(mn) : null; if (v.h === "mouth") v.h = null; },
    lines: {
      beats: (mn, v) => { const T = SEASON_LINES.ivy; return [T.b1, T.b2, T.b3, v.h ? T.lay : T.tease]; },
      b1: ["The old stone barn at the bottom of the farm is green with ivy all year, and at Yule its berries come black and glossy, and as %n walks by, the ivy moves.",
           "%n leans on the old barn wall to catch their breath, and the ivy on it is warm, which ivy shouldn't be, and it's windin' round their wrist.",
           "There's a rustle in the ivy on the old barn like somethin' breathin', and a tendril as thick as a finger curls out and taps %n on the shoulder."],
      b2: ["The ivy has them round the wrists and ankles before they can pull away, and it draws them back against the warm stone, and holds them there, spread like a pressed flower.",
           "Tendrils wind round %n's arms and legs and up under their clothes, and pull them flat to the barn wall, and the clothes come off in strips, eaten away by somethin' in the sap.",
           "The ivy wraps %n round and round, wrists to the wall, ankles apart, and the leaves rustle like it's whisperin' to itself, very pleased."],
      b3: ["Then the little tendrils go everywhere, explorin', ticklin', curlin' round every bit of %n they can find and tastin' it.",
           "{t}Tendrils curl round %n's tits and squeeze, and tiny ones wind round the nipples and tug, and the leaves shiver.",
           "{c}A tendril winds round %n's cock from the root to the tip and squeezes, slow, like it's measurin' it.",
           "{v}A tendril strokes along %n's pussy, slick with sap, and dips in, and out, and in again, explorin'."],
      lay: ["Then a thick green vine, heavy with berry pods, nudges into %n's %h, and pushes in deep, and %n feels the first pod go into them, and the next.",
            "The fattest vine on the barn noses up between %n's legs, finds their %h, and slides in, and swells, and starts to lay, pod after glossy pod.",
            "A vine as thick as a wrist works its way into %n's %h and pulses, and every pulse pushes another berry pod deep inside them."],
      tease: ["The ivy explores every inch of %n, slow and thorough, and seems to be lookin' for somethin' it can't find, and doesn't stop lookin'.",
              "The tendrils stroke and squeeze and curl for what feels like hours, and the ivy never once lets %n finish.",
              "The ivy holds %n to the wall and plays with them like a cat with a ball of wool, and the berries rustle."],
      end: ["The ivy lets go all at once and %n slides down the barn wall into the frosty grass, belly round with %x berry pods in their %h, sap drippin' down their thighs.",
            "%n's let down off the barn wall slow, the vines unwindin' one by one, with %x of the ivy's pods snug in their %h and a few black berries caught in their hair.",
            "The ivy pulls its fat vine out of %n's %h with a slick sound, and %x berry pods stay behind, and the leaves rustle like the barn's sighin'."],
      endTease: ["The ivy lets %n go as suddenly as it took them, and they slide down the wall into the grass, sap-slick and tinglin' and wound right up.",
                 "The tendrils unwind one by one, and %n's left leanin' on the old barn with leaf marks on their skin and nothin' at all to show for it but the ache."],
    },
    after(mn, v){
      arouse(mn, 40);
      if (!v.h){ face(mn, "edged", 90); return { endKey: "endTease" }; }
      const [lo, hi] = CFG.EGG_COUNT, n = layClutch(mn, lo + Math.floor(Math.random()*(hi - lo + 1)), -6);   // the vine patch's, to the brood book (seed pods)
      face(mn, "bred", 120);
      return { endKey: "end", x: String(n), h: TRAP_HOLE[v.h] };
    },
    scene: [["The ivy rustles, though there's no wind, and the berries knock together like little beads.",
             "Sap runs down %n's skin, warm and green-smellin', and wherever it runs it tingles.",
             "A robin lands in the ivy above %n's head, pecks a berry, and flies off quick.",
             "The old barn's stone is warm against %n's back, like the ivy's been keepin' it warm for them."],
            ["{t}Little tendrils wind round %n's nipples and tug in turn, and the leaves round them shiver.",
             "{c}The tendril round %n's cock squeezes and strokes, slow, from root to tip and back.",
             "{v}A tendril curls against %n's clit and rubs, slow and slick, and won't stop.",
             "A tendril strokes along %n's lips, and then slips between them, and tastes of green and honey."]],
    tender: ["The ivy holds %n gently, every tendril snug and never tight.", "The leaves stroke %n's face, soft as feathers, the whole time.",
             "The ivy's warm and slow, and it seems to know exactly where %n's comfy."],
    filthy: ["The ivy's stuffed %n full of its pods and it's still lookin' for room.", "%n's spread on the barn wall like a pressed flower, vines in every hole, and moanin' for more.",
             "The ivy breeds %n like a field it's sowin', pod after pod, and %n's thighs are slick with sap."],
    mess: ["slime", ["tummy", "chest"]],
    gear: [{ when: "hold", slot: "arms", label: "Ivy (arms)", items: ["HempRope"], color: "#2F5E1F", desc: "Ivy wound round and round their wrists and arms, holdin' them to the old barn wall." },
           { when: "hold", slot: "legs", label: "Ivy (legs)", items: ["HempRope"], color: "#2F5E1F", desc: "Ivy wound round their legs, holdin' them apart against the warm stone." }],
    depth: ["held", "tease"], tw: ["nest", "alone", "night"], places: ["wildlife", "stalls", "pasture"], sound: "creak", tags: ["monsters", "pregnancy", "restraint"],
    writes: ["SOWN", "POD FULL", "THE IVY'S"],
  });

  // ── the longest night ──
  seasonTrap("yule", "longnight", {
    icon: "🕯️", what: "the longest night: tied in the ring of candles that has to burn till dawn, and the wax drips, an hour at a time, till the sun comes back", limit: /\b(wax|heat|hot|pain|candles?|fire|burn)/i, hold: 6, where: "the ring of candles",
    lines: {
      beats: [
        ["On the longest night the farm keeps the candles lit till dawn, the old way, so the sun can find its way back. There's a ring of them in the big barn, and a space in the middle, and the farmhands are waitin' for somebody to fill it.",
         "The farm girl takes %n by the hand at sundown and leads them into the big barn, where a ring of candles is burnin' on the floor. \"Somebody keeps the vigil,\" she says. \"Tonight it's you.\"",
         "There's a ring of candles in the big barn, red and white, and the farmhands sittin' round it look up when %n comes in, and smile, and make room in the middle."],
        ["They lay %n down on a blanket in the middle of the candles, and tie their wrists and ankles out to four pegs, and the candlelight makes their skin glow gold.",
         "%n's stripped and laid in the ring, wrists tied over their head with red cord, and the candles flicker round them like a crown laid on the floor.",
         "Red cord round %n's wrists, round their ankles, out to the pegs at the edge of the ring, and the farmhands each pick up a candle."],
        ["Then the first drip. Hot, not too hot, a little red star on %n's belly that sets as they gasp. Then another, and another, slow, an hour's worth at a time.",
         "Each farmhand takes a turn with a candle, tippin' it so the red wax drips down onto %n in a slow patter, collarbone, belly, thigh, and every drop's a little shock.",
         "{t}The wax drips onto %n's tits, slow, a drop on each nipple, and they set hard and red, and the next drop lands on top.",
         "{c}A farmhand holds the candle high and lets the wax drip down along %n's cock, slow, and %n arches off the blanket.",
         "{v}A drop lands right between %n's legs, hot and quick, and they cry out, and the farmhand blows on it gently after."],
        ["The night's long, the longest there is, and the wax keeps comin', and so do the hands in between, strokin' the red stars off, warm and slow, before the next ones fall.",
         "Hour after hour the candles drip, and the farmhands take turns, and in between the drips their hands are everywhere, keepin' %n warm, keepin' them right on the edge.",
         "%n loses count of the drips, and the hours, and the hands, and the ring of candles burns lower, and the dark outside the barn door is as deep as it ever gets."],
      ],
      end: ["Then the barn door goes grey, then gold, and the sun comes back, the way it always does, and the farmhands untie %n and pick the wax off them one red star at a time. \"Kept,\" says the farm girl.",
            "Dawn comes in through the barn door, the first light of the new year, and the candles are blown out one by one, and %n's untied, spotted red all over and shakin' and glowin'.",
            "The sun comes up. The vigil's kept. %n's untied in the grey light, wax all over them like red berries, and somebody wraps them in a warm blanket and kisses their forehead."],
    },
    after(mn){ arouse(mn, 45); face(mn, "afterglow", 120); return null; },
    scene: [["A candle gutters, and a farmhand lights a new one off it straight away, so the ring's never broken.",
             "Outside, the wind howls round the barn on the longest night, and in here it's warm and gold and still.",
             "Somebody hums an old tune, low, and the others pick it up, and it goes round the ring like the candlelight.",
             "The wax pools on the barn floor round the candles, red and white, and sets."],
            ["{t}A farmhand picks the wax off %n's nipples with a fingernail, slow, and kisses each one before the next drop falls.",
             "{c}Somebody strokes %n's cock between drips, slow and warm, and stops just when it matters.",
             "{v}Warm fingers rub %n's clit between the drips, and stop, and the next drop lands, and they start again.",
             "Somebody brushes %n's hair off their face and kisses their forehead, and the next drip lands on their chest."]],
    tender: ["Every drop's tested on a wrist first, and none of them is ever too hot.", "The farm girl sits at %n's head the whole night and holds their hand.",
             "Between the drips, warm hands rub %n's skin, and somebody whispers that they're doin' so well."],
    filthy: ["%n's spread out in a ring of fire and waxed like a candle themselves, moanin' every time a drop lands.", "The farmhands drip and stroke and drip and stroke all night, and %n's beggin' for the sun to never come up.",
             "%n's covered in red wax and drippin' wet, and every farmhand in the ring's had their hands on 'em."],
    mess: ["wax", ["chest", "tummy"]],
    gear: [{ when: "hold", slot: "arms", label: "Vigil Cord (arms)", items: ["HempRope"], color: "#7A1020", desc: "Red cord round their wrists, tied out to a peg at the edge of the ring of candles." },
           { when: "hold", slot: "legs", label: "Vigil Cord (legs)", items: ["HempRope"], color: "#7A1020", desc: "Red cord round their ankles, tied out to the pegs, holdin' them spread in the middle of the candles." }],
    depth: ["tease", "held", "watched"], tw: ["night", "crowd"], places: ["cabin", "bench", "stalls"], sound: "creak", tags: ["restraint"],
    writes: ["KEPT THE VIGIL", "THE LONGEST NIGHT", "WAXED"],
  });
