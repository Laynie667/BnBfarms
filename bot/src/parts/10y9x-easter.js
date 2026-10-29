  /* WHAT'S IN THIS FILE (10y9x-easter.js)
     EASTER on the farm (Laynie, Oct 27: "easter, yes"): the sweet side of it, eggs and chocolate and bonnets and bunny
     suits, from the Sunday before Easter Sunday to Easter Monday by the bot's clock (it moves every year: easterOf in
     10y9m-seasons.js). While it's on, a third of what the plain trap tiles spring is from this pack, a tile named
     trap-easter springs nothin' else, the warren, the egg posts, the bakery bench, the creamery, the pie contest and the
     honey pot come round more, and the farm girl wears an Easter bonnet, bunny ears and a bunny tail.
       hiddeneggs    stuffed with chocolate eggs and hidden in the straw for the egg hunt, and the hunters find every one
       chocfountain  dipped in the chocolate fountain at the Easter fair up to the neck, and licked clean
       bunnysuit     zipped into a bunny girl suit, ears, cuffs and a tail plug, and set out on the Easter display
       basket        tied in a nest of paper grass in a basket as big as a bathtub, and delivered to somebody's door
       marshmallow   dunked in warm marshmallow fluff and rolled in pastel sugar like a marshmallow chick, and nibbled
       eggroll       sealed in a giant painted egg and rolled down the big hill, and whoever catches it opens it
       bonnet        the bonnet parade: paraded round the yard in an Easter bonnet and not much else, and judged slowly
       chocbunny     pressed into the big chocolate bunny mould, set in a chocolate shell, and broken out a bite at a time
     And THE EGG HUNT: ?egghunt looks for the eggs hidden round the farm, once every 20 minutes, Easter only.
     A chocolate egg (it works like one of the sweet potions), a soft one that's gone all over you (with "Farm can mark my
     body"), now and then a golden egg worth a ribbon (once a day at most), or a trick: a strange jelly bean, or, with your
     traps on, an egg that was bait for one of Easter's traps. ?egghunt board: who's found the most this Easter.
     New messes for the Companion to draw: marshmallow. (The chocolate's the farm's own.)
     %n name · %c the cock · %h the hole · %ml how much · %x how many
  */
  Object.assign(MESS, { marshmallow: "#FCE6EF" });
  const MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Easter week: the Sunday before Easter Sunday to Easter Monday, this year's (or next year's, once it's gone by)
  function easterWeek(dt){
    const y = dt.getFullYear(), e = easterOf(y);
    return { from: new Date(y, e.getMonth(), e.getDate() - 7), to: new Date(y, e.getMonth(), e.getDate() + 1), sunday: e };
  }
  season("easter", {
    label: "Easter", icon: "🐣",
    alias: ["eastertide", "easterweek", "easterfair", "eastersunday", "eastermonday"],
    on: (dt) => { const w = easterWeek(dt), t = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()); return t >= w.from && t <= w.to; },
    dates: (dt) => {
      dt = dt || seasonDate();
      let w = easterWeek(dt);
      if (new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()) > w.to) w = easterWeek(new Date(dt.getFullYear() + 1, 0, 1));
      const a = w.from, b = w.to, s = w.sunday;
      return MON3[a.getMonth()]+" "+a.getDate()+" – "+(a.getMonth() === b.getMonth() ? "" : MON3[b.getMonth()]+" ")+b.getDate()+", "+b.getFullYear()+" (Easter Sunday's "+MON3[s.getMonth()]+" "+s.getDate()+")";
    },
    blurb: "egg hunts, chocolate, bonnets and bunny suits",
    hint: "?egghunt: hunt for the eggs hidden round the farm, every 20 minutes (a golden one's worth a ribbon). ?egghunt board: who's found the most.",
    why: ["It's Easter on the farm, sugar, and somebody hid this one just for you.", "The farm's full of hidden eggs this week, and you found a big one.",
          "Easter on the farm: everythin's sweet, and so are you.", "Somebody's been fillin' baskets all week, sugar, and yours had a surprise in it."],
    start: ["Easter's come to the farm! There are eggs hidden in every hayloft and hedge, a chocolate fountain at the fair, bonnets on the fence posts, and a bunny suit hangin' on the barn door with your name on it. ?egghunt to go lookin'.",
            "It's Easter week on the farm, sugar. The dye's dry on the eggs, the chocolate's set in the moulds, and the egg hunt's on: ?egghunt, every twenty minutes, and there's a golden one out there somewhere.",
            "Easter on the farm! Pastel ribbons on the gates, marshmallow on the stove, the big hill's ready for the egg rollin' and the bonnet parade's at noon. Go find some eggs (?egghunt)."],
    end: ["Easter's over on the farm. The last eggs have been found (mostly), the chocolate fountain's scrubbed out, and the bonnets are back in their boxes.",
          "Easter Monday's gone, sugar. The bunny suits are back on their hangers, the paper grass is swept out of the hayloft, and somebody's still findin' chocolate in places chocolate shouldn't be."],
    also: ["warren", "eggs", "bakery", "creamery", "pieeat", "honey"],
    // the farm girl's: an Easter bonnet, bunny ears and a bunny tail (only those, never a stand-in)
    costume: [
      { slot: "hat", name: "Easter Bonnet", items: ["Bonnet1", "Bonnet2"], desc: "A wide straw Easter bonnet with ribbons and silk flowers round the brim." },
      { slot: "ears", name: "Bunny Ears", items: ["BunnyEars1", "FloppyBunnyEars"], desc: "Tall soft bunny ears, pink inside." },
      { slot: "tail", name: "Bunny Tail", items: ["BunnyTailStrap"], desc: "A round white bunny tail, fluffy as a cotton ball." },
    ],
  });
  for (const [k, places] of Object.entries({ warren: ["wildlife", "pasture"], eggs: ["wildlife", "stalls"], bakery: ["trough", "cabin"], creamery: ["trough", "stalls"], pieeat: ["trough", "pasture"], honey: ["wildlife", "trough"] }))
    if (!SEASON_PLACES[k]) SEASON_PLACES[k] = places;

  // ── the egg hunt (the trap) ──
  seasonTrap("easter", "hiddeneggs", {
    icon: "🥚", what: "the egg hunt: stuffed with chocolate eggs and hidden in the straw for the herd to find, and the hunters find every last one", limit: /\b(insert|stuff|plug|public)/i, hold: 6, where: "the egg hunt",   // (eggs in their limits: hidden ON them, not in)
    before(mn, v){ v.eggs = !limitBlocks(mn, "eggs"); v.x = String(6 + Math.floor(Math.random()*7)); },
    lines: {
      beats: (mn, v) => { const T = SEASON_LINES.hiddeneggs; return v.eggs ? [T.found, T.fill, T.hide, T.hunt] : [T.found, T.tease, T.hide, T.huntTease]; },
      found: ["The farm's Easter egg hunt needs one more hidin' place, and the farmhands with the baskets have decided it's %n.",
              "%n walks into the hayloft right in the middle of the farmhands hidin' the eggs for the hunt, and one of them says, \"Oh, perfect,\" and they all turn round.",
              "There's a basket of foil-wrapped chocolate eggs by the barn door, and three farmhands with grins, and a sign: EGG HUNT AT NOON. %n's got about a minute to wonder where they're goin' to hide them all."],
      fill: ["They lay %n back in the straw and start hidin' the eggs, one at a time, little chocolate eggs warm from somebody's pocket, pressed in where nobody'd think to look.",
             "\"Best hidin' place on the farm,\" says the farmhand with the basket, and pops the first foil-wrapped egg into %n, slow, and then the next, and then the next.",
             "One by one the little chocolate eggs go in, smooth and round and warm, and the farmhands count them out loud, and %n's squirmin' by four."],
      tease: ["They lay %n back in the straw and tuck the eggs all round them instead: in the crook of their arm, under their chin, between their thighs, wherever a hunter'd have to get close to find one.",
              "\"We'll hide 'em on you, then,\" says the farmhand with the basket, and tucks foil eggs everywhere on %n there's a dip or a fold, very carefully, very slowly."],
      hide: ["Then they cover %n over with straw, all but their face, and put a little flag in the straw that says WARMER, and go to ring the bell.",
             "They tuck %n under a heap of hay in the corner of the loft and leave a trail of foil wrappers to it, and the bell rings for the hunt.",
             "They hide %n in the hay with just their toes stickin' out, which the farmhands say is a clue, and run off to start the hunt."],
      hunt: ["The hunters come up the ladder with their baskets, and it doesn't take them long, and they kneel round %n in the straw and start findin' eggs, one at a time, very thoroughly.",
             "\"Got one!\" Then another. The hunters find the eggs one at a time, and every one comes out slow and sticky, and every one gets a cheer, and %n's moanin' into the straw by the third.",
             "{v}The hunters find the eggs in %n's pussy one at a time, with their fingers, slow, warm and melty, and every one makes them gasp, and every hunter wants the next one.",
             "It's a proper egg hunt: everybody's down on their knees, everybody's searchin' %n, and %n's pushin' them out one by one for whoever's closest, red-faced and grinnin'."],
      huntTease: ["The hunters come up the ladder with their baskets and kneel round %n in the straw, and search them very, very thoroughly for every last egg.",
                  "\"Got one!\" Then another. The hunters find the eggs tucked all over %n one at a time, with their fingers and their mouths, and nobody's in any hurry.",
                  "{t}A hunter finds an egg tucked between %n's tits and takes it out with her teeth, slow, and then checks very carefully there aren't any more.",
                  "{c}Somebody finds an egg tucked under %n's balls and takes their time about gettin' it out, and their fingers keep findin' %n's cock instead."],
      end: ["The last of the %x eggs comes out into a hunter's basket, sticky and warm, and the hunters kiss %n on the cheek one by one and go off to count their prizes, and %n's left in the straw, empty and glowin' and smeared with chocolate.",
            "%n lays the last of %x chocolate eggs for the hunt, flushed and shakin' and sticky, and the hunter who found it holds it up like a trophy, and the whole loft cheers.",
            "All %x eggs found, every one of them, and the hunters help %n out of the straw, melted chocolate all down their thighs, and give them the biggest egg in the basket for bein' such a good hidin' place."],
      endTease: ["The hunters find the last egg, the one that rolled down somewhere very silly, and help %n out of the straw flushed and sticky and grinnin'.",
                 "The hunt's over, every egg found, and %n's lyin' in the straw smeared with melted chocolate, very well searched, and the hunters give them the biggest egg in the basket."],
    },
    after(mn, v){ arouse(mn, 40, 95); face(mn, "afterglow", 90); return { endKey: v.eggs ? "end" : "endTease" }; },
    scene: [["Somewhere below, the farm girl rings the hunt bell again for the ones who haven't found any yet.",
             "Foil wrappers glint in the straw everywhere, pink and gold and blue, and somebody's eaten a lot more eggs than they've found.",
             "A hunter with an empty basket looks very hard at %n and asks if there's any left. There are.",
             "The hayloft's warm and the chocolate's warmer, and it's startin' to melt into everythin'."],
            ["{t}A hunter checks under each of %n's tits for eggs, one and then the other, and then checks again in case she missed one.",
             "{c}A hunter finds a foil egg hidden by %n's cock and makes a big show of fishin' for it.",
             "{v}A hunter's fingers find a melty egg in %n's pussy and draw it out slow, and suck the chocolate off after.",
             "A hunter licks a smear of melted chocolate off %n's neck and says it's to check it's real."]],
    tender: ["The eggs are little and smooth and warm, and the farmhands go so slow and ask so often.", "The straw's soft and the hunters are gentle, and somebody holds %n's hand through every egg.",
             "Every hunter says thank you to %n for every egg they find."],
    filthy: ["%n's stuffed full of chocolate eggs and laid out in the straw for the whole farm to dig 'em out of, and they're beggin' for more hunters.", "The hunters fish eggs out of %n one at a time, sticky and slow, and %n's moanin' like a hen layin'.",
             "%n's the farm's Easter basket, and every hunter gets a turn to rummage."],
    mess: ["chocolate", ["tummy", "thighs"]],
    gear: [{ when: "hold", slot: mn => limitBlocks(mn, "eggs") ? null : "plug", slotNote: "plug, not when eggs are in their limits", label: "Easter Egg Plug", items: ["EggVibePlugXXL"], desc: "A big round egg plug, pastel and smooth, keepin' the chocolate eggs in till the hunt starts." }],
    depth: ["watched", "tease"], tw: ["day", "nest", "crowd"], places: ["stalls", "wildlife", "pasture"], sound: "straw", tags: ["pregnancy", "public"],
    writes: ["FOUND YOU", "EGG HUNT", "LAYIN' HEN", "LOOK HERE"],
  });

  // ── the chocolate fountain ──
  seasonTrap("easter", "chocfountain", {
    icon: "🍫", what: "the chocolate fountain at the Easter fair: dipped in warm chocolate up to the neck, and licked clean by everybody with a sweet tooth", limit: /\b(food|messy|sticky|public|lick)/i, hold: 6, where: "the chocolate fountain",
    lines: {
      beats: [
        ["The Easter fair's chocolate fountain is as tall as a farmhand, three tiers of warm runnin' chocolate, and the keeper's got a ribbon in one hand and a twinkle in her eye, and she's lookin' at %n.",
         "%n stops at the chocolate fountain for a strawberry on a stick, and the keeper says, \"Oh, we can do better than a strawberry,\" and lifts the rope.",
         "There's a sign by the chocolate fountain: DIPPIN' AT NOON, and it's noon, and a crowd's gathered, and the keeper's beckonin' %n over."],
        ["They tie %n's knees to the fountain's rim with a brown ribbon and tip them back under the top tier, and the warm chocolate pours over their shoulders and down their front in a smooth glossy sheet.",
         "The keeper dips %n like a strawberry, slow, right up to the neck, and brings them out glossy and brown and drippin', and the crowd claps.",
         "Warm chocolate pours down over %n's head and shoulders, thick and slow and smellin' of every sweet shop there's ever been, and runs down every bit of them."],
        ["Then the queue starts, and the first in it leans in and licks a long slow stripe of chocolate off %n's collarbone, and goes back for more.",
         "{t}Somebody licks the chocolate off %n's tits in long slow strokes, and sucks it off each nipple, and the crowd goes ooh.",
         "{c}A fair-goer kneels and licks the chocolate off %n's cock, slow, from the root to the tip, and keeps goin' long after it's clean.",
         "{v}A tongue follows a drip of chocolate down %n's belly and between their legs, and finds somethin' sweeter waitin' there.",
         "Everybody wants a taste. Tongues on %n's neck, their fingers, their thighs, their ears, and the keeper dips them again every time they start to show through."],
      ],
      end: ["The fountain's switched off at last, and %n's untied, licked mostly clean and very well tasted, sticky in all the places the tongues didn't reach.",
            "The keeper wraps %n in a towel at the end of the day and gives them the last strawberry, and %n walks home glossy and sticky and smellin' of chocolate.",
            "%n's let down off the fountain licked clean by half the fair, chocolate in their hair and a smear of it on their mouth, and they lick it off themselves."],
    },
    after(mn){ arouse(mn, 45, 95); face(mn, "afterglow", 90); return null; },
    scene: [["The fountain burbles away behind %n, warm chocolate pourin' tier to tier, and the smell of it carries right across the fair.",
             "Somebody's sellin' marshmallows on sticks to dip, and keeps dippin' them in %n instead.",
             "The queue goes right past the hoopla stall and round the cake tent, and it isn't gettin' shorter.",
             "Bunting flaps over the fair in every pastel colour, and a fiddler plays somethin' jolly by the gate."],
            ["{t}Somebody holds a strawberry to each of %n's nipples, dips it in the chocolate there, and eats it.",
             "{c}Somebody dips a finger in the fountain, paints a stripe of chocolate down %n's cock, and licks it off slowly.",
             "{v}A fair-goer's tongue works the chocolate out from between %n's thighs, slow and thorough, and the queue waits.",
             "Somebody licks the chocolate off %n's lips and then kisses them, which wasn't on the sign."]],
    tender: ["The chocolate's warm, never hot, and the keeper checks it on her wrist before every dip.", "Every fair-goer says please before they lick, and thank you after.",
             "The keeper keeps a hand on %n's shoulder the whole time and asks if they'd like a sip of water."],
    filthy: ["%n's dipped like a strawberry and licked like a candy apple by everybody at the fair, and they're moanin' for the next tongue.", "%n's a glossy, sticky, chocolate-covered treat for the whole queue, and the queue's goin' round twice.",
             "The fair laps %n clean and the keeper dips them again, and %n's beggin' for both."],
    mess: ["chocolate", ["chest", "tummy", "face"]],
    gear: [{ when: "hold", slot: "legs", label: "Fountain Ribbon", items: ["Ribbons"], color: "#5A321C", desc: "A brown satin ribbon round their knees, tied to the rim of the chocolate fountain." }],
    depth: ["mess", "watched"], tw: ["day", "crowd"], places: ["trough", "pasture", "stockade"], sound: "wet", tags: ["messy", "public"],
    writes: ["DIPPED", "LICK ME", "MILK CHOCOLATE", "SWEET TOOTH"],
  });

  // ── the bunny suit ──
  seasonTrap("easter", "bunnysuit", {
    icon: "🐰", what: "the bunny suit rack: zipped into a bunny girl suit, ears and cuffs and a tail plug, and set out on the Easter display for the fair to play with", limit: /\b(costume|plug|anal|public|display|objectif)/i, hold: 7, where: "the Easter display",
    lines: {
      beats: [
        ["There's a rack of bunny suits by the barn door for the Easter display, satin and lace and little white tails, and the display's short one bunny. The farmhand mindin' it looks at %n and holds one up against them. \"Your size.\"",
         "%n walks past the Easter display, a little stage of hay bales and painted eggs and bunnies in satin suits, and one of the bunnies hops down, takes their hand, and leads them round the back to get changed.",
         "A farmhand with a tape measure and a bunny suit over her arm stops %n in the lane. \"There you are. The display opens in ten minutes and you're not even dressed.\""],
        ["They zip %n into the bunny suit, satin tight as a second skin, collar and cuffs and a big bow at the throat, and a pair of tall ears in their hair.",
         "Satin suit, tall ears, white collar and cuffs, and last of all the tail: a round white fluffy tail on a plug, slid in slow, and the farmhand gives it a little tug to check it's in.",
         "The farmhand dresses %n like a doll, ears and collar and cuffs and the satin suit, and bends them over a hay bale for the tail, which goes in slow and stays in."],
        ["Then out onto the display they go, posed on a hay bale between the painted eggs, and the fair comes by to look, and to touch, and to tug the tail.",
         "{t}The satin's cut so low %n's tits are nearly out of it, and the fair-goers keep findin' reasons to adjust it.",
         "{c}The suit's cut tight, and %n's cock is a very obvious shape in it, and somebody keeps strokin' it through the satin to smooth out the creases.",
         "{v}Somebody lifts the crotch of the satin aside and strokes %n's pussy, slow, to see if the bunny's really soft all over.",
         "Folk queue up to have their picture drawn with the bunny, and every one of them gets a squeeze or a pat or a tug on the tail while they're at it."],
        ["Every hour the farmhand has the bunnies hop, and %n hops, and the tail plug shifts with every hop, and the crowd claps.",
         "The fair-goers feed %n carrots by hand, and pat their ears, and pull their tail, and every pull makes them squeak, and every squeak gets a cheer.",
         "A fair-goer pays the farmhand a penny for a cuddle with the bunny, and the cuddle goes on a lot longer than a penny's worth, and nobody stops it."],
      ],
      end: ["The display closes at sundown and %n's let off their hay bale, sore-eared and wobbly and very well petted, and the farmhand lets them keep the ears.",
            "%n's unzipped out of the bunny suit at the end of the day, flushed and grinnin', and they can still feel where the tail was all the way home.",
            "The fair goes home and the bunnies come off the display, and %n's tail is the last to come out, slow, with the whole display watchin'."],
    },
    after(mn){ arouse(mn, 40, 92); face(mn, "afterglow", 90); return null; },
    scene: [["The other bunnies on the display wiggle their noses at %n and giggle, and one of them blows a kiss.",
             "A painted sign over the display says EASTER BUNNIES, PLEASE DO NOT FEED. Everybody feeds them.",
             "The satin's warm in the sun, and the hay bale's scratchy through it, and the tail won't let %n forget it's there.",
             "Somebody wins a chocolate egg at the hoopla and gives it to %n, and %n has to eat it without usin' their hands."],
            ["{t}A fair-goer straightens %n's satin top and their thumbs brush both nipples on the way, slow, not by accident.",
             "{c}Somebody pats %n's satin-covered cock like they'd pat a bunny, and keeps pattin'.",
             "{v}A hand slides under %n's satin and strokes, soft, for a whole hop and a half.",
             "Somebody tugs %n's tail, gentle, and then not so gentle, and %n squeaks right on cue."]],
    tender: ["The farmhand checks %n's tail and ears every hour and asks if they'd like a sit-down.", "The fair-goers pet %n gently, like a real bunny, and say what a good bunny they are.",
             "There's a cushion on %n's hay bale and a bowl of water and a carrot, and somebody keeps it topped up."],
    filthy: ["%n's a satin-wrapped fuck-bunny on show for the whole fair, and every tug on their tail makes them beg louder.", "The fair-goers queue up to play with the bunny, and the bunny's dripping through her satin.",
             "%n hops for the crowd with a plug in their ass and their tits nearly out, and they'd hop all night if anybody asked."],
    gear: [{ when: "hold", slot: "suit", label: "Bunny Girl Suit", items: ["BunnySuit"], only: true, desc: "A tight satin bunny girl suit, cut low and high, with a big bow at the throat." },
           { when: "hold", slot: "ears", label: "Bunny Suit Ears", items: ["BunnyEars1", "BunnyEars2"], only: true, desc: "Tall satin bunny ears on a band, pink inside." },
           { when: "hold", slot: "cloak", label: "Bunny Collar and Cuffs", items: ["BunnyCollarCuffs"], only: true, desc: "A white collar with a bow tie, and white cuffs, the proper bunny girl kind." },
           { when: "hold", slot: "plug", label: "Bunny Tail Plug", items: ["BunnyTailPlug1", "BunnyTailPlug2"], desc: "A round white fluffy bunny tail on a plug, slid in and given a little tug to check." }],
    depth: ["watched", "tease"], tw: ["day", "crowd"], places: ["stockade", "pasture", "stalls"], sound: "straw", tags: ["public", "restraint"],
    writes: ["GOOD BUNNY", "PET ME", "PULL MY TAIL", "EASTER BUNNY"],
  });

  // ── the Easter basket ──
  seasonTrap("easter", "basket", {
    icon: "🧺", what: "the giant Easter basket: tied in a nest of paper grass in a basket as big as a bathtub, bow and all, and delivered to somebody's door", limit: /\b(bondage|restrain|tied|gift|present)/i,
    stud: { sire: -78, name: "whoever the basket was for", type: "human", loads: 2, ml: 230, hold: 7, hole: "vulva", bonus: 1.3, where: "an Easter basket", person: true },
    lines: {
      beats: [
        ["There's an Easter basket in the barn as big as a bathtub, full of pink paper grass and chocolate eggs, with a big bow on the handle and an empty space in the middle about %n's size.",
         "Two farmhands are fillin' baskets in the barn, and they've got one left over, a great big one, and nothin' big enough to put in it. Then %n walks in.",
         "%n hears giggles in the tack room, and goes to look, and gets bundled into a giant Easter basket before they can ask what's funny."],
        ["They sit %n in the paper grass, tie their wrists and ankles with pastel ribbon so they'll keep the shape, and tuck chocolate eggs all round them like a nest.",
         "They curl %n up in the basket on a bed of pink grass, tie a ribbon round their wrists and another round their ankles, and pop a little chocolate bunny in their mouth.",
         "Pastel ribbon round %n's wrists and ankles, paper grass up to their waist, eggs tucked all round them, and a big bow tied on top, and a tag on the handle that says WITH LOVE."],
        ["Then two farmhands pick up the basket and carry it across the yard, and knock on a door, and leave it on the step, and run.",
         "The basket's carried off and left on a doorstep with a knock, and the door opens, and whoever it was for looks down and starts to grin.",
         "{c}Whoever the basket was for kneels on the step, pushes the paper grass aside, and finds %n's cock first, and doesn't let go of it.",
         "{v}Whoever the basket was for lifts %n out of the paper grass by the hips, runs a thumb up between their legs, and finds the best present in the basket.",
         "{t}Whoever the basket's for unties the bow, pushes the paper grass down, and finds %n's tits first, and squeezes them like they're checkin' for chocolate."],
      ],
      in: [
        ["They carry the whole basket inside and take %n's %h right there in the paper grass, slow, with chocolate eggs crunchin' under them.",
         "They lift %n out of the basket and onto the kitchen table, still in their ribbons, and push into their %h, unwrappin' their Easter present properly."],
        ["They fill %n twice, deep, and kiss the chocolate off their mouth after, and say it's the best Easter basket they've ever had.",
         "When they finish they stay in, holdin' %n close in the paper grass, and then they want their second helpin', and have it."],
      ],
      over: [["They don't take them. They kneel over the basket and stroke themselves till they spill across %n's belly, right in among the chocolate eggs."]],
      end: ["Whoever the basket was for unties %n at last, gives them a chocolate egg for the road and a kiss on the head, and sends them back across the yard with %ml in their %h and paper grass in their hair.",
            "%n's sent home in the empty basket, carried back across the yard by the same two giggling farmhands, %ml warm in their %h and the WITH LOVE tag still round their neck.",
            "%n climbs out of the basket with %ml in their %h, pink grass stuck to them everywhere, and whoever it was for keeps the basket, and the bow, and is already askin' when Easter is next year."],
      endOver: ["%n's untied with %ml across their belly and chocolate eggs stuck to it, and whoever the basket was for licks them clean, every egg's worth.",
                "%n's sent home with %ml of them drippin' through the paper grass, and the bow round their neck."],
    },
    scene: [["The paper grass rustles every time %n moves, and gets everywhere, and will be found in their clothes for weeks.",
             "Chocolate eggs crunch and roll out of the basket and across the floor, and nobody picks them up.",
             "The bow on the handle comes undone at last and drapes over %n's face, pink and silky.",
             "Somebody knocks on the door partway through. Nobody answers it."],
            ["{t}They pop a chocolate egg in each of %n's hands and squeeze %n's tits while they hold them.",
             "{c}They stroke %n's cock through a handful of paper grass, and it tickles, and %n laughs and gasps at once.",
             "{v}Their fingers find %n's clit in among the paper grass and circle, slow, while they take what's theirs.",
             "They feed %n a chocolate egg and kiss it out of their mouth before it melts."]],
    tender: ["The ribbons are soft and loose, and whoever the basket was for unwraps %n slowly, like somethin' precious.", "They hold %n close in the paper grass and kiss their forehead after.",
             "It's the gentlest present anybody's ever unwrapped, and the most thanked for."],
    filthy: ["%n's tied up in a basket and left on a doorstep like a treat, and they're beggin' to be unwrapped hard.", "Whoever the basket was for fucks their Easter present into the paper grass, and the present's moanin' for seconds.",
             "%n's the best thing in the basket, and they're bein' eaten first."],
    gear: [{ when: "hold", slot: "arms", label: "Basket Ribbon (arms)", items: ["Ribbons"], color: "#F7B8D0", desc: "Pastel pink ribbon round their wrists, tied in a bow, keepin' them nested in the Easter basket." },
           { when: "hold", slot: "legs", label: "Basket Ribbon (legs)", items: ["Ribbons"], color: "#B8DDF7", desc: "Pastel blue ribbon round their ankles, so they stay curled up in the paper grass till they're unwrapped." }],
    depth: ["breed", "held"], tw: ["day", "breed"], places: ["stalls", "cabin", "office"], sound: "straw", tags: ["restraint"],
    writes: ["WITH LOVE", "UNWRAP ME", "FOR YOU", "EASTER TREAT"],
  });

  // ── the marshmallow vat ──
  seasonTrap("easter", "marshmallow", {
    icon: "🍬", what: "the marshmallow vat: dunked in warm marshmallow fluff, rolled in pastel sugar like a marshmallow chick, and nibbled", limit: /\b(food|messy|sticky|lick|bite)/i, hold: 6, where: "the marshmallow vat",
    lines: {
      beats: [
        ["The kitchen's makin' marshmallow chicks for Easter, and there's a whole copper vat of warm white fluff on the stove, and a tray of pastel sugar, and the cook looks at %n and says, \"Big chick.\"",
         "%n follows the sweet vanilla smell into the farm kitchen and finds the marshmallow vat bubblin', and the cook's already holdin' out a ladle and a ribbon.",
         "There's a sign on the kitchen door: MARSHMALLOW DAY, KEEP OUT. %n doesn't keep out, and the cook grins and shuts the door behind them."],
        ["They tie %n's wrists with sugar twine and lower them into the vat, slow, and the warm fluff closes over them up to the shoulders, soft and thick and sticky as anythin'.",
         "The marshmallow's warm and so thick it holds %n where they're put, and the cook ladles it over their shoulders and their hair till they're white and fluffy all over.",
         "In they go, up to the chin, and the fluff squishes up between their fingers and toes and everywhere else, sweet and warm and impossible to get out of."],
        ["Then out onto the tray of sugar, and they roll %n in it, pink on one side and yellow on the other, till they're a proper marshmallow chick.",
         "{t}The cook rolls %n in the pastel sugar and pats it on with her hands, extra on their tits, till they glitter pink.",
         "{c}A kitchen hand pats sugar onto %n's cock with both hands, slow, for a very long time, and calls it decoratin'.",
         "They pipe a little beak on %n's nose and two dots for eyes, and sit them on the cake stand, and the whole kitchen comes to look."],
        ["Then the kitchen nibbles. A bite of marshmallow off %n's shoulder, a lick of sugar off their wrist, little nips all over, and every nip comes away sticky.",
         "{v}Somebody nibbles the marshmallow off the inside of %n's thigh, higher and higher, and finds it's not all marshmallow up there.",
         "The cook pulls a long sticky string of marshmallow off %n's belly and eats it, and so does everyone else, one string at a time, slow."],
      ],
      end: ["The cook rinses %n off under the pump at last, pink and sticky and nibbled all over, and gives them a real marshmallow chick for bein' such a good one.",
            "%n's let out of the kitchen sticky from head to toe, sugar in their hair and marshmallow in places they'll be findin' it for days.",
            "The kitchen gives %n a round of applause and a towel, and %n walks home glitterin' pink, nibbled and sticky and very sweet."],
    },
    after(mn){ arouse(mn, 40, 92); face(mn, "afterglow", 90); return null; },
    scene: [["The kitchen smells of vanilla and sugar and warm copper, and the windows are all fogged up.",
             "A tray of proper marshmallow chicks sits on the side watchin', every one of them pink and yellow and very small next to %n.",
             "The fluff stretches in long sticky strings every time %n moves, and the kitchen hands keep gettin' tangled in it.",
             "The cook hums while she works, and taps the spoon on the vat in time."],
            ["{t}Somebody licks the sugar off %n's tits, slow, and nibbles the marshmallow off each nipple.",
             "{c}Somebody takes a little nibble of marshmallow off the tip of %n's cock, then a longer lick.",
             "{v}A tongue works its way through the marshmallow between %n's legs, slow, and finds them sticky in two different ways.",
             "Somebody kisses %n with a mouthful of marshmallow and leaves it there."]],
    tender: ["The fluff's warm as a bath, and the cook cleans it out of %n's eyes with a soft cloth.", "Every nibble's tiny and soft, and everybody asks before they take one.",
             "The cook wraps %n in a clean apron after and sits them by the stove to warm up."],
    filthy: ["%n's dunked, sugared and nibbled like a sweet, and they're moanin' for the next bite.", "The whole kitchen eats marshmallow off %n, and %n's sticky and squirmin' and beggin' them not to stop.",
             "%n's a sticky, sugary, well-licked mess, and the cook's goin' back to the vat for seconds."],
    mess: ["marshmallow", ["chest", "tummy", "face"]],
    gear: [{ when: "hold", slot: "ropeArms", label: "Sugar Twine", items: ["HempRope"], color: "#F6C7D8", desc: "Pink candy-striped baker's twine round their wrists, holdin' them in the marshmallow vat." }],
    depth: ["mess", "tease"], tw: ["day"], places: ["trough", "cabin", "office"], sound: "wet", tags: ["messy"],
    writes: ["MARSHMALLOW", "SWEET CHICK", "NIBBLE ME", "STICKY"],
  });

  // ── egg rollin' ──
  seasonTrap("easter", "eggroll", {
    icon: "🎨", what: "egg rollin': sealed in a giant painted egg and rolled down the big hill, and whoever catches it at the bottom gets to open it", limit: /\b(bondage|enclos|confin|dizz|stranger)/i,
    stud: { sire: -79, name: "the egg catcher", type: "human", loads: 2, ml: 210, hold: 6, hole: "vulva", bonus: 1.3, where: "the bottom of the egg hill", person: true },
    lines: {
      beats: [
        ["Up on the big hill the farm's rollin' painted eggs for Easter, and the biggest egg of all is as big as a hay bale, hinged in the middle, painted in stripes and stars, and open. The farmhands look at %n.",
         "%n climbs the big hill to watch the egg rollin', and gets there just in time to be helped into the giant painted egg at the top of it.",
         "There's a giant painted egg at the top of the big hill, and a crowd, and a farmhand holdin' it open like a door. \"In you get. Tuck your knees up.\""],
        ["They tuck %n into the egg on a bed of straw, knees up, ribbon round their ankles, and close it up, and it's dark and snug and smells of paint.",
         "The egg closes round %n with a click, and through the little air holes they can hear the crowd countin' down from ten.",
         "They tie %n's ankles with a pastel ribbon so they'll roll nice and round, close the egg, and give it a pat. \"Good luck in there.\""],
        ["And down the hill they go, rollin', bumpin', tumblin', the whole world spinnin', and the crowd cheerin' all the way down.",
         "Down and down, over and over, straw everywhere, and at the bottom the egg wobbles to a stop against somebody's boots.",
         "{c}The egg stops at the bottom of the hill, and it opens, and the farmhand who caught it reaches in and takes %n's cock in their hand before %n's even stopped bein' dizzy.",
         "{v}The egg's caught at the bottom, and opened, and the farmhand who caught it lifts %n out still dizzy, lays them on the grass and slides a hand between their legs to see what the prize is.",
         "The egg rolls to a stop, the hinge pops, and %n's lookin' up at the grinnin' farmhand who caught it, the dizziest prize on the farm."],
      ],
      in: [
        ["The catcher takes %n's %h right there at the bottom of the hill, with the crowd still comin' down it, and the world's still spinnin' a bit, and that makes it better.",
         "The catcher kneels in the grass and pushes into %n's %h, slow, while %n's head stops spinnin' and the rest of them starts."],
        ["They fill %n twice, there in the grass, and the crowd reaches the bottom of the hill and cheers the best catch of the year.",
         "When they finish they hold %n there on the grass till the spinnin' stops, and then they do it again, for luck."],
      ],
      over: [["The catcher doesn't take them. They stroke themselves over %n in the grass till they spill across their belly, and the crowd cheers the catch."]],
      end: ["The catcher helps %n up, dizzy and grass-stained with %ml in their %h, and carries the empty egg back up the hill for the next roll.",
            "%n sits up at the bottom of the egg hill with %ml in their %h, straw in their hair and the world still tippin' a little, and the crowd gives them a cheer.",
            "The egg catcher keeps the prize ribbon and gives %n a chocolate egg, and %n wobbles off with %ml in their %h and the sky still spinnin'."],
      endOver: ["%n's left at the bottom of the hill dizzy and grinnin', painted with %ml of the catcher, and the next egg's already comin' down.",
                "The catcher dusts the straw off %n, misses the %ml on their belly on purpose, and gives them the prize ribbon."],
    },
    scene: [["Painted eggs keep rollin' past them down the hill, little ones, wobblin' and bumpin', and nobody's chasin' those.",
             "The giant egg lies open in the grass beside them like a cracked shell, straw spillin' out of it.",
             "Up the hill the crowd's comin' down at a run to see who caught the big one.",
             "%n's head's still spinnin', and every thrust tips the sky one way and then the other."],
            ["{t}The catcher squeezes %n's tits like they're checkin' the prize for cracks.",
             "{c}The catcher strokes %n's cock in the grass, slow, while %n gets their breath back.",
             "{v}The catcher's thumb circles %n's clit while the world goes round.",
             "The catcher kisses %n, long and slow, and that doesn't help the dizziness at all."]],
    tender: ["The egg's lined with soft straw and a cushion, and the farmhands roll it gentle, mostly.", "The catcher holds %n till the spinnin' stops, and only then starts.",
             "The catcher brushes the straw off %n's face and asks if they're all right before anythin' else."],
    filthy: ["%n's rolled down a hill in an egg and fucked at the bottom by whoever caught it, and they want to go again.", "%n's the dizziest prize at the fair, and the catcher's havin' every bit of them.",
             "The catcher cracks their Easter egg open and eats the prize right there in the grass, and the prize is moanin' about it."],
    gear: [{ when: "hold", slot: "legs", label: "Egg-Roll Ribbon", items: ["Ribbons"], color: "#F2D16B", desc: "A pastel yellow ribbon round their ankles, so they roll nice and round inside the giant painted egg." }],
    depth: ["breed", "watched"], tw: ["day", "crowd", "breed"], places: ["pasture", "wildlife"], sound: "wood", tags: ["restraint", "public"],
    writes: ["CAUGHT", "PRIZE EGG", "ROLLED", "OPEN ME"],
  });

  // ── the bonnet parade ──
  seasonTrap("easter", "bonnet", {
    icon: "👒", what: "the bonnet parade: paraded round the yard in an Easter bonnet and not much else, and judged on every inch, slowly", limit: /\b(public|exhibit|humiliat|nud|naked|judg)/i, hold: 6, where: "the bonnet parade",
    lines: {
      beats: [
        ["The Easter bonnet parade's about to start, and one of the entrants hasn't turned up, and the farm girl's holdin' a bonnet covered in silk flowers and lookin' straight at %n.",
         "%n wanders into the yard just as the bonnet parade lines up, and somebody pins a number on them and pops a bonnet on their head. \"You're number seven. Off you go.\"",
         "There's a bonnet on a hook by the gate with a tag that says ENTRANT 7, and a judge with a clipboard by the gate, and a crowd, and the judge says, \"Seven? You're late. Strip.\""],
        ["They tie the bonnet ribbons under %n's chin and take everythin' else, and out into the yard they go, round the ring, in a bonnet and a smile and nothin' much in between.",
         "The parade goes round the yard in a slow ring, and %n's in it, bonnet on, the rest of them on show, and the crowd claps every lap.",
         "Round the yard they walk, slow, bonnet bobbin', and the crowd along the fence cheers and whistles and points out the nicer bits."],
        ["Then the judges, three of them with clipboards, and they judge everythin', slow and close and with their hands, and make notes.",
         "{t}A judge weighs %n's tits in her hands, one and then the other, very serious, and makes a note on her clipboard, and then checks again.",
         "{c}A judge lifts %n's cock on the end of his pencil, looks at it from every side, and writes somethin' down, and the crowd leans in to see.",
         "{v}A judge has %n stand with their feet apart and kneels to examine them very closely, and makes a long note, and the crowd goes quiet.",
         "The judges walk round %n three times, lift their arms, turn them by the shoulders, and confer, and look again, and confer again."],
        ["Then %n's asked to turn, and bend, and turn again, and twirl so the bonnet ribbons fly, and the crowd counts the twirls.",
         "The judges ask for another lap, slower, and then another, and the crowd's on its feet by the third.",
         "The judges can't decide, so they ask %n to stand on the box in the middle of the yard while they think about it. For a long time."],
      ],
      end: ["\"Best in show,\" say the judges at last, and pin a rosette on %n's bonnet, and the crowd cheers, and %n's handed their clothes back flushed scarlet to the ears.",
            "%n comes second, which the judges say is only because the winner had a bigger bonnet, and they get a pastel rosette and a lot of applause on the way out of the ring.",
            "The judges give %n Most Admired, which isn't a prize they've ever given before, and %n walks out of the ring in their bonnet with every eye in the yard on them."],
    },
    after(mn){ arouse(mn, 40, 92); face(mn, "afterglow", 90); return null; },
    scene: [["The bonnet's covered in silk primroses and ribbons, and it's much the most dressed bit of %n.",
             "Somebody at the fence holds up a scorecard with a ten on it every time %n goes by.",
             "The other entrants in the parade are all in their best clothes, and keep glancin' at %n and then at each other.",
             "A breeze picks up the bonnet ribbons and flutters them, and that's the only thing coverin' anythin' for a moment."],
            ["{t}A judge cups %n's tits from behind to check how they sit, and takes much longer about it than she needs.",
             "{c}A judge measures %n's cock against the side of his clipboard and writes the number down.",
             "{v}A judge runs a finger slowly between %n's legs, checks it, and writes \"very good\" and underlines it.",
             "A judge straightens %n's bonnet and kisses their cheek, which is against the rules, and nobody minds."]],
    tender: ["The judges are kind and say somethin' nice about everythin' they look at.", "The crowd claps %n every lap, and somebody throws a primrose.",
             "The farm girl walks beside %n round the ring and holds their hand, in her own bonnet."],
    filthy: ["%n's paraded round the yard in nothin' but a bonnet while the whole farm stares, and they're drippin' with it.", "The judges handle %n like a prize heifer at the show, and %n's moanin' for top marks.",
             "%n's bent over for the judges in front of everybody, bonnet bobbin', and they'd do another lap slower."],
    gear: [{ when: "hold", slot: "hat", label: "Parade Bonnet", items: ["Bonnet1", "Bonnet2"], desc: "An Easter bonnet covered in silk primroses and ribbons, tied under the chin. The most dressed bit of them." }],
    depth: ["watched", "tease"], tw: ["day", "crowd"], places: ["stockade", "pasture"], sound: "gate", tags: ["public"],
    writes: ["BEST IN SHOW", "ENTRANT 7", "JUDGED", "MOST ADMIRED"],
  });

  // ── the chocolate bunny mould ──
  seasonTrap("easter", "chocbunny", {
    icon: "🍫", what: "the chocolate bunny mould: pressed into the big mould, set in a shell of chocolate in the cold room, and broken out a bite at a time", limit: /\b(food|messy|confin|enclos|bondage|bite)/i, hold: 7, where: "the chocolate bunny mould",
    lines: {
      beats: [
        ["The kitchen's makin' the giant chocolate bunny for the Easter fair, and the mould's open on the table, a great bunny-shaped hollow, and the chocolate's run short. The cook looks at the mould, and at %n, and at the mould.",
         "%n wanders into the cold room at the back of the kitchen, and the cook follows them in with a jug of warm chocolate and the big bunny mould. \"Stand still, sugar.\"",
         "There's a sign on the kitchen table: GIANT CHOCOLATE BUNNY, HOLLOW. The cook taps it. \"Doesn't have to be hollow,\" she says, and pulls %n over."],
        ["They paint %n with warm chocolate all over, then press the two halves of the mould round them and strap it shut, and pour the rest in, and it fills up all round them, warm and thick.",
         "In the mould %n goes, chocolate poured in round them up to the neck, and the cook straps it shut and wheels it into the cold room to set.",
         "The chocolate's warm goin' in and cool comin' out, and it sets round %n in the cold room in a hard glossy shell, and they can't move a finger."],
        ["When the mould comes off there's a giant chocolate bunny on the table with a very real face peekin' out of it, and the kitchen gathers round with hungry looks.",
         "They stand the chocolate bunny on the cake stand, %n inside it, glossy and brown and perfectly set, and the whole kitchen comes to admire it.",
         "Out of the mould comes a glossy chocolate bunny, ears and all, and %n's in it from the neck down, and the shell creaks every time they breathe."],
        ["Then the kitchen eats it. Snap, a bite off the shoulder. Crack, a piece off the hip. And every bit that comes away leaves %n bare and sticky underneath for a tongue to find.",
         "{t}Somebody breaks the chocolate off %n's chest a piece at a time, and licks what's underneath, and takes their time on both tits.",
         "{c}A kitchen hand breaks the chocolate away from %n's cock very carefully, a bit at a time, and licks every bit clean as it comes free.",
         "{v}Somebody cracks the shell between %n's legs and finds them melted and warm underneath, and licks, slow.",
         "Bite by bite the chocolate bunny gets eaten, and bite by bite %n comes out of it, and every bite's followed by a lick."],
      ],
      end: ["The last of the chocolate bunny gets eaten off %n's toes, and they're helped down off the cake stand bare and sticky and licked all over, with a chocolate ear for the road.",
            "%n's eaten out of the chocolate bunny one bite at a time, and stands on the cake stand at the end of it smeared brown and grinnin', and the kitchen says it's the best Easter bunny they've ever made.",
            "There's nothin' left of the chocolate bunny but crumbs and %n, sticky and shakin' and very well eaten, and the cook wraps them in a tea towel and sends them home."],
    },
    after(mn){ arouse(mn, 45, 95); face(mn, "afterglow", 90); return null; },
    scene: [["The cold room's chilly, and the chocolate shell creaks every time %n takes a breath.",
             "Bits of chocolate shell crack off and fall on the floor, and the kitchen hands squabble over them.",
             "The cook's very proud of the ears. She keeps sayin' so. They're very good ears.",
             "Every bite of chocolate snaps loud in the quiet kitchen."],
            ["{t}Somebody breaks the chocolate off one of %n's nipples and sucks the melt off it.",
             "{c}The chocolate round %n's cock cracks right down the middle when it twitches, and the kitchen cheers.",
             "{v}A finger pushes through the soft chocolate between %n's legs, warm underneath, and stays a while.",
             "Somebody bites a piece of shell off %n's shoulder and kisses the bare skin under it."]],
    tender: ["The chocolate's warm goin' on, and the cold room's not too cold, and the cook checks on %n every few minutes.", "Everybody breaks the chocolate off gently, a little at a time, so it never pulls.",
             "The cook holds %n's hand through the side of the mould while it sets."],
    filthy: ["%n's set in chocolate and eaten out of it by the whole kitchen, and they're moanin' for every bite.", "The kitchen licks %n clean one cracked piece at a time, and %n's beggin' them to eat faster.",
             "%n's a chocolate bunny with a live one inside, and the live one's wetter than the chocolate."],
    mess: ["chocolate", ["chest", "tummy", "thighs"]],
    gear: [{ when: "hold", slot: "legs", label: "Mould Straps", items: ["HempRope"], color: "#4A2A18", desc: "The chocolate bunny mould's leather straps, buckled round their legs to hold the two halves shut while it sets." }],
    depth: ["mess", "held", "tease"], tw: ["day"], places: ["trough", "cabin", "office"], sound: "creak", tags: ["messy", "restraint"],
    writes: ["CHOCOLATE BUNNY", "BITE ME", "HOLLOW? NO", "EAT ME"],
  });

  // ── the egg hunt: ?egghunt ────────────────────────────────
  const EGG_SWEETS = [
    { id: "clover", name: "a cream-filled chocolate egg" }, { id: "golden", name: "a gold-foil caramel egg" }, { id: "honey", name: "a honeycomb egg" },
    { id: "musk", name: "a blue sugar egg" }, { id: "feather", name: "a sherbet-filled egg" }, { id: "heatmist", name: "a cinnamon heart egg" },
  ];
  const EGG_TRICKS = { moo: "a jelly bean that tastes of grass", bell: "a hollow egg with a little bell in it", hiccup: "a fizzin' egg that crackles on your tongue",
                       needy: "a pink sugar egg with a heart on it", wrongbarn: "a mystery-flavour jelly bean", wolfscent: "a wolf-shaped chocolate", goblinmusk: "a green chocolate egg that smells of goblin",
                       tentaclemusk: "a squishy purple jelly egg" };
  const EGG_MESSES = ["chocolate", "marshmallow", "caramel", "strawberry"];
  function eggHuntCommand(sender, args, R){
    const r = rec(sender), now = Date.now(), year = seasonDate().getFullYear();
    if (String(args[0] || "").toLowerCase() === "board"){
      const rows = Object.values(L.people).filter(x => x.eggHunt && x.eggHunt.y === year && x.eggHunt.n > 0).sort((a, b) => b.eggHunt.n - a.eggHunt.n).slice(0, 10);
      R("🥚 THE EGG HUNT, "+year+"\n"+(rows.length ? rows.map((x, i) => "  "+(i + 1)+". "+plainName(x.mn)+" · "+x.eggHunt.n+" egg"+(x.eggHunt.n === 1 ? "" : "s")+(x.eggHunt.gold ? " ("+x.eggHunt.gold+" golden)" : "")).join("\n") : "  Nobody's found one yet. ?egghunt to go lookin'."));
      return;
    }
    if (!onBooks(sender)){ R("🥚 The egg hunt's for folks on the books, sugar."); return; }
    if (!seasonsOn().includes("easter")){ R("🥚 It's not Easter, sugar. The eggs get hidden "+seasonDates("easter")+"."); return; }
    if (!charFor(sender)){ R("🥚 The eggs are hidden on the farm, sugar. Come by and hunt."); return; }
    if (state.trapRuns && state.trapRuns.has(sender)){ R("🥚 You're a bit tied up right now, sugar. The eggs'll keep."); return; }
    const H = r.eggHunt && r.eggHunt.y === year ? r.eggHunt : (r.eggHunt = { y: year, n: 0, gold: 0, at: 0, goldDay: "" });
    const wait = (H.at || 0) + 20*60000 - now;
    if (wait > 0){ R("🥚 You've just been round, sugar ("+H.n+" found so far). Give the farmhands a chance to hide some more: "+Math.ceil(wait/60000)+" minute"+(Math.ceil(wait/60000) === 1 ? "" : "s")+"."); return; }
    H.at = now; saveLedger(); audit(sender, "EGGHUNT", String(H.n));
    emote("🐣 "+tFill(pickFor(sender, "egg:look", EGG_LINES.look), sender), sender);
    later(() => {
      if (!charFor(sender)) return;
      const roll = Math.random();
      // a golden egg: a ribbon, once a day at most
      if (roll < 0.1 && H.goldDay !== dayKey()){
        H.goldDay = dayKey(); H.n++; H.gold = (H.gold || 0) + 1; saveLedger();
        emote("🐣 "+tFill(pickFor(sender, "egg:gold", EGG_LINES.gold), sender), sender); earnRibbons(sender, 1, "a golden egg", BOTMN());
        return;
      }
      // a trick: an egg that was bait for one of Easter's traps (theirs on), or a strange jelly bean
      if (roll < 0.35){
        if (isSubject(sender) && !trapBreathing(sender) && Math.random() < 0.5){
          const ks = SEASONS.easter.kinds.filter(k => !trapWhyNot(sender, k));
          if (ks.length){
            H.n++; saveLedger();
            emote("🐣 "+tFill(pickFor(sender, "egg:trap", EGG_LINES.trap), sender), sender);
            const k = ks[Math.floor(Math.random()*ks.length)];
            later(() => { if (charFor(sender) && !springTrap(sender, k, "")){ const r2 = rec(sender); r2.trapAt = Date.now(); saveLedger(); } }, 2000);
            return;
          }
        }
        const c = TRICKS.filter(x => EGG_TRICKS[x.id] && potionDef(x.id) && (!x.traps || isSubject(sender)) && !potionRefusal(sender, x.id, sender));
        if (c.length){
          const pick = c[Math.floor(Math.random()*c.length)];
          H.n++; saveLedger();
          emote("🐣 "+tFill(pickFor(sender, "egg:trick", EGG_LINES.trick), sender, { x: EGG_TRICKS[pick.id] }), sender);
          later(() => { if (charFor(sender)) givePotion(sender, pick.id, BOTMN(), "an Easter egg candy"); }, 1500);
          return;
        }
      }
      // a soft one that's gone all over them
      if (roll < 0.55 && hasCompanion(sender)){
        const m = EGG_MESSES[Math.floor(Math.random()*EGG_MESSES.length)];
        if (trapMess(sender, "egghunt", m)){ H.n++; saveLedger(); emote("🐣 "+tFill(pickFor(sender, "egg:mess:"+m, EGG_LINES.mess[m]), sender), sender); return; }
      }
      // a chocolate egg (a sweet potion), or just a pretty shell
      const c = EGG_SWEETS.filter(x => potionDef(x.id) && !potionRefusal(sender, x.id, sender) && (x.id !== "heatmist" || !limitBlocks(sender, "heat")));
      if (c.length && Math.random() < 0.8){
        const pick = c[Math.floor(Math.random()*c.length)];
        H.n++; saveLedger();
        emote("🐣 "+tFill(pickFor(sender, "egg:sweet", EGG_LINES.sweet), sender, { x: pick.name }), sender);
        later(() => { if (charFor(sender)) givePotion(sender, pick.id, BOTMN(), "an Easter egg candy"); }, 1500);
        return;
      }
      emote("🐣 "+tFill(pickFor(sender, "egg:empty", EGG_LINES.empty), sender), sender);
    }, 2500);
  }
  const EGG_LINES = {
    look: ["%n goes egg huntin' round the farm, peerin' under hay bales and up in the hedges and into every bucket.",
           "%n checks the hayloft, the henhouse, behind the water butt and under the farm girl's porch, lookin' for eggs.",
           "%n goes round the farm on tiptoe, basket on their arm, lookin' in every nook a farmhand might've hidden an egg.",
           "The farm girl gives %n a little basket and a wink, and off they go huntin' through the straw."],
    gold: ["Right at the back of the hayloft, in a nest of straw, %n finds it: a golden egg, heavy and gleamin', with a ribbon tucked inside. 🎀 One ribbon!",
           "%n lifts a flowerpot by the porch and there it is, the golden egg, glintin'. Inside is a blue ribbon. 🎀 One ribbon, sugar!",
           "Under the water trough, wrapped in gold foil, %n finds the golden egg, and inside is a ribbon. 🎀 The farm girl claps."],
    sweet: ["Tucked in the hedge, %n finds %x, and eats it right there.", "In an old boot by the barn door, %n finds %x, still wrapped, and pops it in their mouth.",
            "Behind a bale in the hayloft, %n finds %x, and it's gone before they've even stood up.", "There's %x hidden in the feed bin, and %n finds it, and eats it, and licks their fingers."],
    trick: ["%n finds an egg in the henhouse that isn't a hen's egg at all. It's %x, and they eat it before they think. Somewhere a farmhand giggles.",
            "%n's very proud of the egg they found under the porch, right up till they eat it. It was %x.",
            "In the hedge, wrapped in pink foil, %n finds %x. The foil says EAT ME. They do. Oh dear."],
    trap: ["%n spots a big painted egg sittin' all by itself in the middle of the yard, and reaches for it, and it was never an egg at all. It was bait.",
           "There's an egg on a string at the edge of the farm, and %n picks it up, and the string's tied to somethin' else.",
           "%n crawls into the straw after a gleamin' egg, and the straw closes up behind them. The farm's got an Easter surprise of its own."],
    mess: {
      chocolate: ["%n finds a chocolate egg on a sunny windowsill and picks it up, and it's gone completely soft, and it's all down their front.", "The chocolate egg %n finds in the hayloft's been sat on. It's all over their hands, then their face, then everywhere."],
      marshmallow: ["%n finds a marshmallow egg in the hedge and squeezes it to see if it's real, and it bursts all over them, sticky and sweet.", "A marshmallow egg, warm from the sun, and %n bites it, and it goes everywhere."],
      caramel: ["%n finds a caramel egg in the barn and bites it, and the caramel runs down their chin and their chest and all the way down.", "The caramel egg %n finds is gooey in the middle, and the middle ends up on them."],
      strawberry: ["%n finds a strawberry cream egg tucked in the strawberry beds, and it pops when they pick it up, pink cream all over their hands and front.", "A strawberry cream egg, squashed flat on the path, and %n slips in it."],
    },
    empty: ["%n finds an egg under the porch, beautifully painted, flowers and stripes, and quite empty. Still, it's very pretty.", "All %n finds is a pretty painted shell, and a foil wrapper somebody's already eaten.",
            "The egg in the hedge turns out to be a pebble somebody painted. %n keeps it anyway."],
  };
  if (W.__FARMHAND_TEST__) Object.assign(W, { __easterWeek: (d) => easterWeek(new Date(d)) });
