  /* WHAT'S IN THIS FILE (10y9y-litha.js)
     LITHA on the farm (Laynie, Oct 27: "soltice and equinox based packs with pagan/wiccan themes would be cool"): the
     summer solstice, Jun 18 to 24 by the bot's clock, the longest day and the shortest night. The old midsummer customs,
     kept the farm's way: the solstice play again (at Yule the Holly King gave the year to the Oak King; at midsummer he
     comes to win it back, two farmhands crowned for it, as he promised), the fairy ring on Midsummer's Eve, leapin' the
     bonfire, the sun wheel turned with the sun, the mead hall, and Robin Goodfellow's flower juice. The hay bales, the
     honey pot, the corn maze, the windmill, the washin' line and the hot tub come round more, and the farm girl wears a
     crown of summer roses.
       oakking   the midsummer play: the Holly King comes to win the year back from the Oak King, and the prize is you
       fairyring step in the fairy ring on Midsummer's Eve and the fae folk dance you till dawn, and every one takes a turn
       bonfire   leap the midsummer bonfire for luck, and whoever's waitin' on the far side catches you
       sunwheel  tied spread on the great sun wheel, garlanded with flowers, and turned with the sun all afternoon
       mead      bent over the barrel in the mead hall, the midsummer mead poured down your back and licked off
       puck      Robin Goodfellow squeezes love-in-idleness on your eyelids while you doze, and you wake up wantin'
     %n name · %c the cock · %h the hole · %ml how much
  */
  season("litha", {
    label: "Litha", icon: "☀️",
    alias: ["summersolstice", "midsummer", "midsummerseve", "midsummersnight", "longestday", "summer", "solsticesummer"],
    on: (dt) => { const d = md(dt); return d >= 618 && d <= 624; },
    dates: () => "Jun 18 – 24, the summer solstice",
    blurb: "the longest day, the fairy ring, the bonfire, and the Holly King back for the year",
    why: ["It's Litha, the longest day, and the sun's got into everythin' on the farm.", "Midsummer on the farm, sugar: the nights are short and full of mischief.",
          "The sun's at the top of the year, and so's everybody's blood.", "It's the summer solstice, and the old midsummer magic's out walkin'."],
    start: ["Litha's come to the farm: the summer solstice, the longest day of the year. The bonfire's built on the top field, there's a fairy ring in the long meadow, and the Holly King's been seen sharpenin' his wooden sword. He's come for the year back, like he promised at Yule.",
            "It's midsummer, sugar. The sun hardly goes down, the mead's ready in the barn, the sun wheel's up on the green, and somebody saw the fae dancin' in the meadow last night.",
            "Litha on the farm! Roses on every fence, honey mead in the barrel, the bonfire waitin' to be leapt, and the shortest night of the year to get up to things in."],
    end: ["Litha's over. The days start gettin' shorter from here, the bonfire's ash on the top field, and the Holly King's got the year till Yule.",
          "Midsummer's gone, sugar. The fairy ring's just toadstools again, the mead barrel's dry, and the sun's on its way back down the year."],
    also: ["bale", "honey", "maze", "windmill", "washline", "hottub"],
    // the farm girl's: a crown of summer roses (only that, never a stand-in)
    costume: [
      { slot: "hat", name: "Midsummer Crown", items: ["RoseCrown", "FlowerCrown"], desc: "A crown of midsummer roses and meadowsweet, still smellin' of the hedge." },
    ],
  });
  for (const [k, places] of Object.entries({ bale: ["pasture"], honey: ["wildlife", "trough"], maze: ["pasture"], windmill: ["pasture"], washline: ["pasture", "cabin"], hottub: ["cabin"] }))
    if (!SEASON_PLACES[k]) SEASON_PLACES[k] = places;

  // ── the midsummer play ──
  seasonTrap("litha", "oakking", {
    icon: "👑", what: "the midsummer play: the Holly King comes to win the year back from the Oak King, two farmhands crowned for it, and the prize is you, shared", limit: /\b(double|both holes|gang|public|threesome)/i,
    stud: { sire: -81, name: "the Oak King and the Holly King", type: "human", loads: 2, ml: 220, hold: 8, hole: "vulva", bonus: 1.5, where: "the midsummer play", person: true, both: true },
    lines: {
      beats: [
        ["At Yule the Holly King gave up the year and said \"Till midsummer\", and it's midsummer, and here he is in the ring of hay bales on the green, crowned in holly, and the Oak King in his crown of oak leaves, and the whole farm sat round to watch. And somebody's put %n down as the prize.",
         "The midsummer play's on the green at sunset, the crowd all round on the hay bales, and the farm girl leads %n into the ring by the hand. \"Here's what they're fightin' for this time.\"",
         "%n wanders onto the green on the longest evenin' of the year and finds the ring of bales set up for the midsummer play, the two kings already in it, and the Holly King points his wooden sword straight at %n."],
        ["Clack, clack, go the wooden swords, round and round the ring, and %n's tied to the maypole in the middle with yellow ribbon, watchin' the light and the dark fight over them.",
         "The kings fight all over the ring, all bluster and stage-fallin', and this time the crowd cheers the Holly King, and at the end the Oak King goes down on one knee, as he does every midsummer, and gives the year back.",
         "It's a proper fight, the Oak King's had the bright half of the year and the Holly King wants it back, and the crowd stamps and whistles, and %n's tied to the pole in the middle with flowers in their hair."],
        ["Then the Holly King comes for his prize, and the Oak King gets up off his knee and comes too, because the play says the prize is shared, and has since before anybody can remember.",
         "{c}The two kings untie %n from the pole, and the Holly King wraps a hand round %n's cock and says, \"Fair's fair. The year's mine again, but he gets his half.\"",
         "{v}The Holly King lays %n back on the warm grass and runs a hand up between their legs, and finds their pussy ready, and the Oak King kneels on the other side.",
         "{t}The Oak King cups %n's tits from behind, a good loser, and the Holly King kisses them, and the crowd goes very quiet in the long gold light."],
      ],
      in: [
        ["{v}The Holly King takes %n's %h, slow and proud, and the Oak King settles in behind and takes what's left, and the two kings rock %n between them like the year turnin' back.",
         "{nv}The Holly King takes %n's %h, slow and proud, and the Oak King kneels at their head and feeds them his cock, and the two kings rock %n between them like the year turnin' back.",
         "The bright half of the year and the dark half, both of them in %n at once, on the longest evenin' there is, and the crowd round the bales is on its feet."],
        ["The Holly King fills %n with a groan that sends the swifts screamin' up off the barn roof, and the Oak King follows him over, and %n's stuffed full at both ends of the year.",
         "They finish together, the old way, one load for the light half and one for the dark, and the crowd throws roses and oak leaves into the ring."],
      ],
      over: [["They don't take them. They kneel either side of %n in the warm grass and stroke themselves over them, and paint them across the belly and chest, the light half and the dark half both, while the crowd cheers."]],
      end: ["The kings lay %n down in the grass with %ml of the year in their %h, and the Oak King puts his crown of oak leaves on %n's head. \"Till Yule,\" he says, \"when I win it back.\"",
            "%n's carried out of the ring on the kings' shoulders as the sun finally goes down, %ml drippin' from their %h, wearin' the Oak King's crown, and the whole farm cheers the turnin' of the year.",
            "The play's over, the year's turned back again, and %n's left lyin' in the warm grass in the middle of the ring with %ml in their %h and rose petals in their hair."],
      endOver: ["The kings help %n up, painted with %ml of the both of them, and the Oak King crowns them with his oak leaves. \"Till Yule.\"",
                "%n's led out of the ring wearin' the Oak King's crown and %ml of the two kings, and the crowd's still throwin' roses."],
    },
    scene: [["The sun's low and gold and won't go down, and every shadow on the green is a mile long.",
             "Swifts scream round the barn roof, and the crowd claps the rhythm, slow, like a heartbeat.",
             "Somebody at the back's playin' the fiddle, the same old tune as at Yule, only faster.",
             "The kings' crowns slip, the Holly King's berries scatter in the grass, the Oak King's leaves come loose, and nobody picks them up."],
            ["{t}The Oak King's hands are on %n's tits the whole time, squeezin' slow, and the Holly King's mouth is on their neck.",
             "{c}One of the kings has a hand round %n's cock and won't let go, and they argue, very politely, about whose turn it is.",
             "{v}The Holly King's thumb finds %n's clit and circles, slow as the sun goin' down, and the Oak King laughs into their hair.",
             "Both kings kiss %n at once, one each side of their mouth, and then each other, over them."]],
    tender: ["The kings are gentle, and every time %n gasps one of them asks if the prize is all right.", "The Oak King holds %n's hand the whole time, a good loser, and strokes their hair.",
             "It's slow and warm and ceremonial, and every touch feels like it means somethin'."],
    filthy: ["%n's the prize of the midsummer play, spitroasted by two kings in front of the whole farm in broad daylight, and they're beggin' for the year to never turn.", "The two kings use %n like they've won 'em, which they have, both of 'em, again.",
             "%n's stuffed at both ends by the light and the dark on the longest day of the year, and the crowd's countin' strokes."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Midsummer Ribbon", items: ["Ribbons"], color: "#E8B923", desc: "Yellow ribbon round their wrists, tyin' them to the pole in the middle of the midsummer ring." },
           { when: "after", slot: "hat", label: "Oak King's Crown", items: ["FlowerCrown"], color: "#5C7A2E", mins: 30, desc: "The Oak King's crown of oak leaves and acorns, put on their head after the play. Till Yule." }],
    depth: ["watched", "breed"], tw: ["crowd", "day", "breed"], places: ["pasture", "stockade"], sound: "wood", tags: ["public"],
    writes: ["THE YEAR'S PRIZE", "BOTH KINGS", "SHARED AGAIN", "TILL YULE"],
  });

  // ── the fairy ring ──
  seasonTrap("litha", "fairyring", {
    icon: "🍄", what: "the fairy ring: step into the ring of toadstools on Midsummer's Eve, and the fae folk dance you round till dawn and every one of them takes a turn", limit: /\b(gang|fae|fair(y|ies)|monster|magic|dance|trance)/i,
    stud: { sire: -82, name: "the fae folk", type: "human", loads: 4, ml: 110, hold: 9, hole: "vulva", bonus: 1.2, where: "the fairy ring",
            after(mn){ face(mn, "trance", 90); } },   // (a trance in their limits keeps the ring from springin' at all)
    lines: {
      beats: [
        ["There's a ring of toadstools in the long meadow that nobody steps in, not ever, and on Midsummer's Eve %n's walkin' home across the meadow in the dusk and doesn't see it till both feet are in.",
         "Music, faint and sweet, from the long meadow at dusk, and lights like fireflies in a ring, and %n goes to look, and the ring opens to let them in, and closes behind them.",
         "%n's crossin' the meadow on Midsummer's Eve when the fae come out of the long grass, tall and fine-boned and laughin', a dozen of them, and take %n by both hands and pull them into the ring."],
        ["The fae folk dance %n round the ring, round and round, faster and faster, passin' them hand to hand, and every one of them is beautiful, and every one of them is lookin' at %n like a feast.",
         "Round and round they go, the fae all round them, tall and pale and gold-eyed, and the music never stops, and %n can't remember how to stop dancin' either.",
         "Their clothes are gone somewhere in the dance and %n doesn't remember losin' them, and the fae's hands are on them as they spin, cool and quick and everywhere."],
        ["Then the music slows, and the fae lay %n down in the middle of the ring on a bed of meadowsweet, and stand round them in a circle, and their eyes shine.",
         "{c}A fae with silver hair kneels and takes %n's cock in her long cool fingers, and strokes it in time with the music, and the others hum along.",
         "{v}A fae with eyes like a cat's spreads %n's thighs and licks their pussy slow, his tongue cool and clever, and the music goes on round them.",
         "{t}Two of the fae kiss %n's tits, one each, with mouths that taste of honey and dew, and the others clap the time.",
         "The fae kneel round %n in the ring, a dozen of them, and every hand that touches them is cool and gentle and very, very sure."],
      ],
      in: [
        ["The first of the fae takes %n's %h, slow, in time with the music, and the rest dance round them in the ring, waitin' their turns.",
         "One by one the fae take %n's %h, each one fine-boned and cool-skinned and tireless, and the music never stops and neither do they."],
        ["They take their turns till the sky goes grey, every one, and every one of them fills %n, and the music goes on and on.",
         "When the last fae finishes the first is back, and %n's lost count of them, and lost count of the hours, and the stars are fadin'."],
      ],
      over: [["They don't take them. They dance round %n in the ring and spill across them one by one, cool and sweet, till they're glistenin' with it."]],
      end: ["Dawn comes and the music stops in the middle of a note, and the fae are gone, and %n wakes in the middle of a ring of toadstools with dew on them and %ml of the fae folk in their %h, and no idea what day it is.",
            "%n stumbles out of the fairy ring at sunrise, dizzy and dreamy, %ml of fae in their %h, and the farm says they've been gone all night and %n says it was only a few minutes.",
            "The fae kiss %n goodbye one by one as the sun comes up, and fade, and %n's lyin' in the meadowsweet with %ml in their %h, still hummin' a tune they'll never quite remember."],
      endOver: ["%n wakes at dawn in the ring of toadstools, glistenin' with %ml of the fae, and the music's still goin' round in their head.",
                "The fae fade with the sunrise and leave %n in the dew, painted with %ml of them and smilin' at nothin'."],
    },
    scene: [["The music has no tune %n can hold onto, and it gets inside their head and dances there.",
             "Fireflies, or somethin' like fireflies, circle the ring at head height and never fly off.",
             "One of the fae wears a crown of foxgloves and laughs at everythin', and the laugh sounds like bells.",
             "The stars wheel overhead, faster than stars should, and the night's over far too soon and lasts forever."],
            ["{t}Cool fae fingers circle %n's nipples, round and round, in time with the music.",
             "{c}A fae strokes %n's cock with the tips of her fingers, so light it's nearly not there, and %n can't stand it.",
             "{v}A fae's long fingers find %n's clit and play it like an instrument, and the music swells.",
             "A fae kisses %n deep, and their mouth tastes of honey and summer rain, and their head swims."]],
    tender: ["The fae are gentle as moths, and the meadowsweet's soft, and somebody holds %n's head in their lap all night.", "The fae sing to %n between turns, soft, in a language that sounds like water.",
             "Every fae kisses %n's forehead before they take their turn, and thanks them after."],
    filthy: ["%n's passed round a dozen fae all night in the fairy ring, and they've lost their head and found they don't miss it.", "The fae fuck %n till dawn in a circle of toadstools, and %n's beggin' them to keep them forever.",
             "%n's the fae folk's midsummer plaything, spread on the meadowsweet and used by every one of them, and they're singin' about it."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Fae Ribbon", items: ["Ribbons"], color: "#B9E2C8", desc: "A pale green ribbon that wasn't there a moment ago, round their wrists, and it won't untie till the music stops." }],
    depth: ["breed"], tw: ["night", "alone", "breed"], places: ["wildlife", "pasture"], sound: "straw", tags: ["monsters"],
    writes: ["FAE-TOUCHED", "DANCED TILL DAWN", "KEPT BY THE RING", "MIDSUMMER"],
  });

  // ── the midsummer bonfire ──
  seasonTrap("litha", "bonfire", {
    icon: "🔥", what: "leapin' the midsummer bonfire: jump it for luck, and whoever's waitin' on the far side catches you and carries you off into the dark", limit: /\b(stranger|carry|outdoor|fire)/i,
    stud: { sire: -83, name: "the bonfire catcher", type: "human", loads: 2, ml: 230, hold: 7, hole: "vulva", bonus: 1.5, where: "the far side of the bonfire", person: true },
    lines: {
      beats: [
        ["The midsummer bonfire's roarin' on the top field, and the farm's takin' turns to leap it for luck, and the crowd's chantin' %n's name, and there's nothin' for it but to run and jump.",
         "%n's handed a cup of mead and pushed toward the bonfire by a crowd of laughin' farmhands. \"Leap it! Leap it for luck!\" And somebody's waitin' on the far side with their arms open.",
         "It's an old custom: leap the midsummer fire and you'll have luck all year, and whoever catches you on the other side has you till sunrise. %n leaps."],
        ["%n clears the flames by a hand's breadth, heat on their legs, sparks in their hair, and lands right in a pair of strong arms on the far side, and the crowd roars.",
         "Over the fire %n goes, the heat roarin' up round them, and comes down on the other side into somebody's arms, and gets kissed before their feet touch the ground.",
         "%n leaps, and for a moment they're flyin' through the sparks, and then they're caught, swung round once, and carried off away from the light."],
        ["The catcher carries %n down the field to where the firelight doesn't reach, and lays them in the warm grass, and the bonfire roars on behind them.",
         "{c}The catcher lays %n down in the long grass, the fire still roarin' up the field, and wraps a hot hand round %n's cock. \"That's my luck for the year,\" they say.",
         "{v}In the dark at the edge of the field the catcher lays %n down and slides a hand between their legs, and finds them as hot as the fire.",
         "{t}The catcher pulls %n's top open in the dark and kisses their tits, one and then the other, and their mouth tastes of mead and smoke."],
      ],
      in: [
        ["The catcher takes %n's %h right there in the warm grass, with the bonfire glowin' on the clouds and the crowd still chantin' up the field.",
         "They take %n's %h slow and hot, the fire's glow on their skin, sparks driftin' down out of the sky round them like stars fallin'."],
        ["They fill %n twice before the bonfire burns down, deep and hot, and hold them close in the grass after.",
         "When they finish they don't let go, and by the time the fire's embers they've had %n again, and that's luck for the year twice over."],
      ],
      over: [["They don't take them. They kneel over %n in the grass, the firelight behind them, and stroke themselves till they spill hot across %n's belly."]],
      end: ["The bonfire's burned down to a red glow by the time the catcher walks %n back up the field, smoky and grass-stained with %ml in their %h, and the farm cheers the lucky one.",
            "%n comes back to the bonfire's embers at sunrise with %ml in their %h, sparks still in their hair, and a whole year's luck.",
            "The catcher kisses %n goodbye by the embers at dawn, and %n goes home smellin' of woodsmoke with %ml warm in their %h and luck for a whole year."],
      endOver: ["%n walks back up to the embers painted with %ml of their catcher, smoky and grinnin', and that's luck for the year.",
                "The catcher leaves %n in the grass with %ml across their belly and sparks still driftin' down."],
    },
    scene: [["Up the field the next leaper goes over the fire, and the crowd roars, and somebody else gets caught.",
             "Sparks go up into the short summer night and hang there with the stars.",
             "The fire crackles and spits and the whole field smells of woodsmoke and trampled grass.",
             "Somebody's drummin' by the fire, slow and steady, and it carries all the way down the field."],
            ["{t}The catcher squeezes %n's tits in the firelight and kisses the sweat off them.",
             "{c}The catcher strokes %n's cock slow, the firelight flickerin' over both of them.",
             "{v}The catcher's fingers circle %n's clit, slow and hot, in time with the drum up the field.",
             "The catcher kisses %n with a mouth that tastes of mead, long and slow."]],
    tender: ["The catcher wraps %n in their own cloak in the grass, and holds them close the whole time.", "They go slow, and ask, and brush the sparks out of %n's hair.",
             "The catcher whispers to %n how brave the leap was, and kisses their singed eyebrows."],
    filthy: ["%n leapt the fire and landed on a cock, and they're beggin' for more luck.", "The catcher fucks %n in the dark at the edge of the firelight, and the whole field can hear how lucky they're gettin'.",
             "%n's carried off and bred in the grass like the custom says, and they'd leap that fire every night for it."],
    depth: ["breed"], tw: ["night", "breed", "crowd"], places: ["pasture", "wildlife"], sound: "wood", tags: [],
    writes: ["LUCKY", "CAUGHT", "LEAPT THE FIRE", "MIDSUMMER LUCK"],
  });

  // ── the sun wheel ──
  seasonTrap("litha", "sunwheel", {
    icon: "☀️", what: "the sun wheel: tied spread on the great wooden wheel on the green, garlanded with flowers, and turned with the sun all afternoon", limit: /\b(bondage|restrain|spread|public|dizz|tease)/i, hold: 7, where: "the sun wheel",
    lines: {
      beats: [
        ["The sun wheel's up on the green for midsummer, a great wooden wheel painted gold with spokes like sunbeams, and it needs somebody on it to turn, and the farmhands with the garlands are lookin' at %n.",
         "%n walks out onto the green and finds the sun wheel, painted gold and hung with flowers, and the farmhands turnin' it stop and grin and hold out a garland.",
         "\"The sun wheel needs its sun,\" says the farm girl, and takes %n by the hand, and leads them to the great gold wheel in the middle of the green."],
        ["They tie %n onto the wheel spread like a star, wrists and ankles to the rim, and hang garlands of roses and daisies round their neck and wrists and hips.",
         "Spread-eagled on the gold wheel, flowers round every limb, %n's the sun at the middle of it, and the farmhands give the wheel its first slow turn.",
         "They garland %n in yellow roses and tie them to the wheel by the wrists and ankles, and the wheel creaks, and starts to turn."],
        ["Round turns the wheel, slow, as slow as the sun, and %n goes up and round and over, and the crowd turns its heads to follow them.",
         "The farmhands turn the wheel a little every time the shadow on the green moves, all afternoon, and %n's upside down, and right way up, and upside down.",
         "{t}Every time the wheel brings %n round, somebody reaches up and squeezes their tits for luck, and they go up and over again.",
         "{c}Every turn brings %n's cock round past the crowd, and every turn somebody gives it a stroke for luck, and the wheel turns on.",
         "{v}Every turn brings %n's spread thighs past the front of the crowd, and every turn somebody reaches up and strokes between them."],
        ["The sun beats down and the wheel turns, and every time %n comes round the bottom, somebody kisses them, or touches them, or tickles them, and every time they go up again achin' for more.",
         "By mid-afternoon %n's flushed and sun-warm and dizzy, and every touch on the way round has wound them tighter, and the wheel's still turnin'.",
         "The farmhands turn it faster as the sun goes down the sky, and %n comes round and round, and every hand that reaches for them stops just short."],
      ],
      end: ["The sun touches the hills and the wheel stops, and %n's untied from it sun-warmed and flower-crowned and achin' all over, and the farm girl gives them a cool drink and a kiss.",
            "They untie %n from the sun wheel at sunset, wobbly and dizzy and flushed from head to toe, roses in their hair and right on the edge.",
            "%n's let down off the wheel at the end of the longest day, dizzy and sun-drunk and so wound up they can barely stand, and the crowd cheers the turnin' of the sun."],
    },
    after(mn){ arouse(mn, 45, 96); face(mn, "edged", 90); return null; },
    scene: [["The wheel creaks every time it turns, a slow wooden creak, and a petal falls off one of the garlands and drifts down.",
             "The green smells of cut grass and roses, and somebody's sellin' strawberries by the gate.",
             "Upside down, the whole farm looks different, and everybody in it is lookin' up at %n.",
             "The shadow of the wheel turns on the grass like a sundial, and the crowd moves round with it."],
            ["{t}Somebody tucks a rose into %n's garland right between their tits, and takes a long time about it.",
             "{c}Somebody ties a daisy chain round the base of %n's cock as the wheel goes by, and the crowd laughs.",
             "{v}A farmhand reaches up as the wheel comes round and slides a finger along %n's pussy, slow, and lets the wheel carry them away from it.",
             "Somebody reaches up and kisses %n every time they come round the bottom, and waits for the next turn."]],
    tender: ["The farmhands turn the wheel gentle, and stop it right way up whenever %n wants a rest.", "Somebody holds a parasol over %n's face as the wheel turns so the sun's not in their eyes.",
             "The farm girl walks round with the wheel and holds %n's hand at every turn she can reach."],
    filthy: ["%n's spread on a wheel in the sun for the whole farm to grope, round and round, all afternoon, and they're drippin' on the grass.", "Every turn of the wheel brings %n's spread holes past the crowd, and the crowd helps itself.",
             "%n's the farm's midsummer centrepiece, turned and touched and teased till sunset, and they're beggin' for one more turn."],
    gear: [{ when: "hold", slot: "device", label: "The Sun Wheel", items: ["WheelFortune", "LuckyWheel"], desc: "A great wooden wheel painted gold, spokes like sunbeams, with them tied spread across it like the sun in the middle." },
           { when: "hold", slot: "arms", label: "Rose Garlands", items: ["Ribbons"], color: "#F2C14E", desc: "Garlands of yellow roses tied round their wrists, fastened to the rim of the sun wheel." }],
    depth: ["held", "watched", "tease"], tw: ["day", "crowd"], places: ["pasture", "stockade"], sound: "creak", tags: ["restraint", "public"],
    writes: ["SUNSHINE", "TURNED", "THE LONGEST DAY", "SUN-KISSED"],
  });

  // ── the mead hall ──
  seasonTrap("litha", "mead", {
    icon: "🍯", what: "the mead hall: bent over the barrel, the midsummer mead poured down your back, and the brewers lick off every drop to taste the batch", limit: /\b(food|messy|sticky|drunk|alcohol|public|lick)/i, hold: 6, where: "the mead hall",
    lines: {
      beats: [
        ["The barn's been turned into a mead hall for midsummer, long tables and a big barrel of honey mead at the end, and the brewers are arguin' over whether this year's batch is ready. They need somebody to pour it on. They look at %n.",
         "%n wanders into the mead hall for a cup and the head brewer takes them by the elbow. \"Old custom,\" she says. \"First pourin' goes on a body, not in a cup.\"",
         "There's a sign on the mead barrel: FIRST TASTE AT NOON. It's noon, and the brewers are gathered round, and the head brewer's beckonin' %n over."],
        ["They bend %n over the great oak barrel, wrists tied to the hoops on the far side, and the head brewer pulls the bung, and warm golden mead pours down %n's back in a slow sticky stream.",
         "Over the barrel %n goes, tied by the wrists, and the mead runs down their spine and over their hips and down their legs, warm and golden and smellin' of honey and summer.",
         "The brewers tip the first jug of mead over %n's shoulders, slow, and it runs down every curve of them, sticky and gold."],
        ["Then the brewers taste the batch, the old way, straight off %n, long slow licks from the backs of their knees all the way up, and every one says it's the best year yet.",
         "{t}The head brewer reaches under %n and catches the mead runnin' off their tits in her palms, and drinks it, and goes back for more.",
         "{c}A brewer kneels and licks the mead off %n's cock, slow, savourin', like a proper taster, and says it needs a second opinion.",
         "{v}A brewer follows a drip of mead down between %n's legs with his tongue, and decides the batch is sweetest there.",
         "Every brewer tastes, and argues, and tastes again, and pours more to be sure, and %n's sticky and gold and moanin' over the barrel."],
      ],
      end: ["The batch is declared ready, the best in years, and the brewers untie %n from the barrel, sticky and honey-sweet and tipsy just from the smell of it.",
            "%n's let up off the barrel at last, licked mostly clean, still gold and sticky in the hard places, and the head brewer gives them the first cup.",
            "The brewers toast %n with the first cups of the batch, and %n walks out of the mead hall glowin', sticky to the knees, smellin' like a honeycomb."],
    },
    after(mn){ arouse(mn, 40, 92); face(mn, "afterglow", 90); return null; },
    scene: [["The mead hall's warm and smells of honey and oak, and bees keep driftin' in through the open doors after it.",
             "Somebody bangs a cup on the long table and starts a song about bees, and everybody joins in.",
             "The barrel's warm from the sun through the barn door, and the mead in it sloshes every time %n moves.",
             "A brewer writes TASTING NOTES on a slate and keeps rubbin' them out and startin' again."],
            ["{t}A brewer pours a little mead on each of %n's tits and licks it off, one then the other, for comparison.",
             "{c}Somebody dribbles mead down %n's cock and licks it off, slow, and calls it a fine finish.",
             "{v}A brewer's tongue works slow between %n's legs, chasin' every drop of mead.",
             "Somebody kisses %n with a mouthful of mead and makes them swallow it."]],
    tender: ["The mead's warm, never hot, and the brewers pour it gentle, a little at a time.", "The head brewer keeps a hand on %n's back and asks every so often if they'd like a rest.",
             "Every brewer thanks %n for the taste, and means it."],
    filthy: ["%n's bent over a barrel with mead runnin' down their crack, and the brewers are lickin' it out of every hole.", "%n's the mead hall's tastin' spoon, sticky and gold and moanin' for the next brewer.",
             "The brewers lap %n clean and pour on more, and %n's beggin' them to drink the whole barrel off them."],
    mess: ["honey", ["chest", "tummy", "thighs"]],
    gear: [{ when: "hold", slot: "ropeArms", label: "Barrel Rope", items: ["HempRope"], color: "#B8862B", desc: "Rope round their wrists, tied off to the iron hoops of the mead barrel so they stay bent over it." }],
    depth: ["mess", "held", "watched"], tw: ["day", "crowd"], places: ["trough", "stalls", "cabin"], sound: "wood", tags: ["messy", "public", "restraint"],
    writes: ["FIRST TASTE", "HONEY MEAD", "BEST BATCH", "SWEET AS MEAD"],
  });

  // ── Robin Goodfellow's flower ──
  seasonTrap("litha", "puck", {
    icon: "🌸", what: "Robin Goodfellow's mischief: the trickster sprite squeezes love-in-idleness on your eyelids while you doze in the meadow, and you wake up wantin' the first one you see", limit: /\b(trance|charm|magic|drug|aphrodis|love.?potion)/i, hold: 5, where: "the midsummer meadow",   // (heat in their limits: the plain endin', no heat)
    before(mn, v){ v.heat = !limitBlocks(mn, "heat"); },
    lines: {
      beats: [
        ["It's the hottest afternoon of the year, and %n lies down in the long meadow for a minute in the shade of the hawthorn, and the bees hum, and their eyes close.",
         "%n dozes off in the meadow on the longest day, warm and lazy, with the clover hummin' all round them.",
         "The sun's so warm and the meadow's so soft that %n lies down in it, just for a minute, and is asleep before they know it."],
        ["Somethin' small and quick and grinnin' creeps out of the hawthorn while they sleep: Robin Goodfellow, the midsummer sprite, with a little purple flower in his hand, and he squeezes it, one drop on each of %n's eyelids.",
         "A little laughin' sprite drops out of the hawthorn, light as a leaf, and leans over %n's sleepin' face, and squeezes the juice of a little purple flower onto their eyelids. Love-in-idleness. Whoever they see first, they'll want.",
         "Robin Goodfellow's out makin' mischief on midsummer, and he's found %n asleep, and he's got the purple flower, and he's grinnin' like he's heard the best joke in the world."],
        ["%n wakes up, and the first thing they see is a farmhand crossin' the meadow with a scythe over his shoulder, and all at once they want him more than they've ever wanted anythin'.",
         "%n's eyes open, and the first face they see is the haymaker's, leanin' over them to see if they're all right, and %n's heart nearly stops with how much they want her.",
         "{c}%n wakes achin', cock hard against their belly, and the first face they see is a farmhand's, and they'd crawl across the meadow to him.",
         "{v}%n wakes wet and achin', pussy throbbin', and the first face they see is the stable hand's, and they're on their feet and reachin' for her before they've thought about it."],
        ["They're very surprised, and then very pleased, and they don't need askin' twice, and the meadow's long enough to hide in.",
         "The farmhand looks at %n, and at the purple stain on their eyelids, and laughs, and then stops laughin', and lies down in the clover with them.",
         "%n begs, and the farmhand's happy to be begged, and somewhere in the hawthorn Robin Goodfellow's laughin' so hard he falls off his branch."],
      ],
      endHeat: ["The love-in-idleness doesn't wear off when the farmhand's done. %n walks home through the meadow still achin', in heat, wantin' everybody they look at. Robin Goodfellow follows them halfway, gigglin'.",
                "%n gets up out of the clover flushed and well tumbled and not one bit less wantin', the purple juice still glintin' on their eyelids, and every face they pass makes it worse.",
                "The sprite's juice is still workin' when the sun goes down. %n's in heat, sugar, and every farmhand on the way home is the most beautiful thing they've ever seen."],
      endPlain: ["The love-in-idleness wears off at sunset, and %n sits up in the clover, flushed and well tumbled, and wonders what on earth came over them. Somewhere in the hawthorn somebody's still gigglin'.",
                 "%n wakes up properly at sunset with clover in their hair and a very satisfied farmhand dozin' beside them, and a purple stain on each eyelid, and no regrets.",
                 "The sprite's juice fades with the light, and %n walks home through the long meadow pink-cheeked and grinnin', and the farmhand walks them all the way to the gate."],
    },
    after(mn, v){
      arouse(mn, 50, 96); face(mn, v.heat ? "heat" : "afterglow", 120);
      if (v.heat){ startHeat(mn, BOTMN(), 1); return { endKey: "endHeat" }; }
      return { endKey: "endPlain" };
    },
    scene: [["Bees hum in the clover and the hawthorn smells sweet and heavy in the heat.",
             "A little laugh comes from the hawthorn, high and wicked, and when %n looks there's nothin' there.",
             "The meadow's so long and the grass so high that nobody walkin' by on the lane would ever see.",
             "A purple flower lies dropped in the grass by %n's hand, crushed, still glistenin'."],
            ["{t}%n pulls the farmhand's hands to their tits and holds them there, beggin' with their eyes.",
             "{c}%n strokes their own cock as they watch the farmhand come closer, and can't stop.",
             "{v}%n's so wet from the flower juice that the farmhand's fingers slide straight in, and %n moans like they've been waitin' years.",
             "%n kisses the farmhand like they've been in love all their lives, and maybe, for the afternoon, they have."]],
    tender: ["The farmhand understands what's happened and is very kind about it, and very gentle.", "Whoever %n wakes to holds them and strokes their hair till the wantin' calms a little.",
             "It's sweet and silly and warm, and the farmhand keeps kissin' %n's purple-stained eyelids."],
    filthy: ["%n wakes up drugged with fae juice and throws themselves at the first farmhand they see, and the farmhand catches them gladly.", "%n's beggin' in the clover for a cock they'd never looked at twice yesterday, and gettin' it.",
             "The sprite's flower turns %n into a needy, beggin' thing on the meadow floor, and Robin Goodfellow laughs himself silly."],
    mess: ["pollen", ["face", "chest"]],
    depth: ["tease"], tw: ["day", "alone"], places: ["pasture", "wildlife"], sound: "straw", tags: [],
    writes: ["LOVE-STRUCK", "IN IDLENESS", "PUCK'D", "BEWITCHED"],
  });
