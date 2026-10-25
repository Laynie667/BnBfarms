  /* WHAT'S IN THIS FILE (10ub-themed-traps.js)
     New traps for the places that had few (10ua-trap-themes.js picks by place). Oct 19, first batch:
       kennel    groomer (the grooming table) · whelping (the whelping box and the kennel stud) · leashpost (tied out in the yard)
       stalls    teatcheck (the morning teat check)
       bench     wax (candle wax, drip by drip)
       stockade  tomatoes (the rotten-fruit stall in the square)
       cabin     bearskin (the trapper and the rug by the fire) · trophy (mounted on the trophy wall) · hottub (the lumberjacks' tub)
       pigsty    slop (the slop bucket) · hogtie (hogtied in the sty)
       glory     booth (the peep booth) · milkinghole (the milking hole)
       trough    feedbag (a feedbag strapped on)
       wildlife  stag (the rutting stag, also in the pasture)
       office    desk (the overseer's desk) · inspection (the clipboard inspection) · stamp (the office stamps)
     %n name · %c the cock · %h the hole · %ml how much · %x a word
  */
  Object.assign(TRAP_KINDS, {
    groomer:     { icon: "🪮", what: "the kennel's grooming table: bathed, brushed, fluffed and shown off", limit: /\b(groom|bath|wash|pet ?play)/i },
    whelping:    { icon: "🐕", what: "the whelping box, and the kennel's champion stud", limit: /\b(breed|knot|beast)/i },
    leashpost:   { icon: "🦮", what: "clipped to the post in the dog yard and left for anybody passin'", limit: /\b(public|free ?use|leash|tie)/i },
    teatcheck:   { icon: "🍼", what: "the mornin' teat check: squeezed, measured, graded and stripped", limit: /\b(milk|lactat|nipple)/i },
    wax:         { icon: "🕯️", what: "the bench and a lit candle, drip by drip", limit: /\b(wax|heat|burn|candle)/i },
    tomatoes:    { icon: "🍅", what: "the stocks in the square, and a cart of soft fruit for throwin'", limit: /\b(stocks|pillory|messy|food|humiliat)/i },
    bearskin:    { icon: "🐻", what: "the trapper's cabin: the rug by the fire, and the trapper", limit: /\b(breed|cum|creampie)/i },
    trophy:      { icon: "🦌", what: "mounted on the cabin's trophy wall, on display", limit: /\b(display|suspen|object|humiliat)/i },
    hottub:      { icon: "♨️", what: "the lumberjacks' hot tub, and the lumberjacks", limit: /\b(gang|water|breed)/i },
    slop:        { icon: "🪣", what: "the slop bucket, over your head, and the pigs come runnin'", limit: /\b(mud|filth|food|messy|humiliat)/i },
    hogtie:      { icon: "🐷", what: "hogtied in the sty and left in the muck for the boar", limit: /\b(hogtie|mud|filth|rope)/i },
    booth:       { icon: "🎟️", what: "the peep booth: a window, a coin slot, and holes in the walls", limit: /\b(public|display|glory|exhibit)/i },
    milkinghole: { icon: "🕳️", what: "the milking hole: something on the other side of the wall wants your milk", limit: /\b(milk|lactat|glory|machine)/i },
    feedbag:     { icon: "👜", what: "a feedbag strapped over your face till it's empty", limit: /\b(feed|stuff|food|force)/i },
    stag:        { icon: "🦌", what: "the rutting stag in the trees, and it's his season", limit: /\b(breed|beast|anthro|rut)/i },
    desk:        { icon: "🗄️", what: "the overseer's desk: bent over it, and an audit", limit: /\b(spank|paddle|office|humiliat)/i },
    inspection:  { icon: "📋", what: "the clipboard inspection: every inch checked, measured and written up", limit: /\b(inspect|exam|humiliat|measure)/i },
    stamp:       { icon: "🖃", what: "the office stamps: inked, approved and filed", limit: /\b(writ|mark|stamp|humiliat)/i },
  });
  // the ones with somebody waitin' in them breed like the other anthro traps (10u3-anthro-traps.js)
  ANTHRO.whelping = { sire: -30, name: "the kennel's champion stud", type: "canine", loads: 3, ml: 180, hold: 8, hole: "vulva", bonus: 1.9, where: "the whelping box" };
  ANTHRO.bearskin = { sire: -31, name: "the trapper",                type: "human",  loads: 2, ml: 160, hold: 7, hole: "vulva", bonus: 1.5, where: "the trapper's cabin" };
  ANTHRO.hottub   = { sire: -32, name: "the lumberjacks",            type: "human",  loads: 4, ml: 110, hold: 8, hole: "vulva", bonus: 1.6, where: "the hot tub" };
  ANTHRO.stag     = { sire: -33, name: "the rutting stag",           type: "equine", loads: 2, ml: 300, hold: 6, hole: "vulva", bonus: 1.7, where: "the deer run" };
  ANTHRO.booth    = { sire: ANON_STUD, name: "the booth's customers", type: "human", loads: 4, ml: 70, hold: 7, hole: "mouth", bonus: 1.1, where: "the peep booth" };
  Object.assign(ANTHRO_LINES, {
    whelping: {
      beats: [
        ["%n steps into the whelping shed and the half door bangs shut. Straw, a heat lamp, a low padded box, and a sign on the wall: BREEDING IN PROGRESS.",
         "The kennel girl takes %n by the collar, says \"Champion's ready for you,\" and walks them into the whelping box like it's the most ordinary thing in the world."],
        ["The stud's a big rangy hound-man with a show ribbon still pinned to his collar, and he's been waiting all week. He circles %n twice, sniffing, tail going.",
         "He's the kennel's champion, all lean muscle and long legs, and he looks at %n the way he looks at his dinner bowl. His sheath's already swelling."],
        ["Two kennel hands kneel on either side and hold %n square in the straw, rump high, the way the breed book says. \"Steady,\" one of them croons, to %n or the dog, it isn't clear.",
         "A hand presses %n's shoulders flat, another lifts their tail out of the way, and the champion is guided up and over like a mare at the stand."],
      ],
      in: [
        ["He mounts and pumps into %n's %h fast and furious, the way dogs do, and the hands keep %n still while his knot swells and catches and ties them tight.",
         "His %c cock fills %n's %h in quick hard thrusts, then the knot pushes in, fat and hot, and they're tied, rump to rump, while the kennel girl checks her watch."],
        ["Tied, he turns and stands back to back with %n, the way the champions do, and pumps another load in every time he shifts his weight.",
         "The hands time the tie on a stopwatch and write it in the book, while the knot keeps everything inside %n where it belongs."],
      ],
      over: [["The hands angle him off, and he ruts against %n's thighs and finishes across their back while the kennel girl tuts."]],
      end: ["Three ties, %ml, written in the book in neat pencil. The kennel girl pats %n's flank. \"Good bitch. We'll know in a few weeks.\"",
            "%n is let out of the whelping box with %ml of champion seed in their %h and a breeding certificate pinned to their collar."],
      endOver: ["He finishes over %n's back, %ml of it, and the kennel girl crosses the date off with a sigh."],
    },
    bearskin: {
      beats: [
        ["The door of the trapper's cabin creaks shut behind %n. There's a fire going, a jug of somethin' strong on the table, and a huge bearskin rug in front of the hearth.",
         "%n ducks into the old cabin out of the cold and finds it warm, lamplit, and occupied: the trapper's back from the woods, boots off, beard full of frost melt."],
        ["He's a big slow man in a fur vest, smelling of woodsmoke and pine tar, and he looks %n over like a pelt he's pricing. \"You'll do,\" he says. \"Get on the rug.\"",
         "He doesn't say much. He points at the bearskin, and when %n doesn't move fast enough he picks them up and puts them there himself."],
        ["The fur is thick and warm and smells of the woods. He kneels over %n with the firelight behind him and unbuckles his belt without hurry.",
         "He spreads %n out on the bearskin by the fire like he's laying out a catch, rough hands on their hips, the heat of the hearth on their skin."],
      ],
      in: [
        ["He takes %n's %h slow and heavy, all his weight behind every stroke, pressing them down into the fur till they're buried in it.",
         "His %c cock opens %n's %h with steady, patient strokes, the kind of man who's done this every winter and isn't in any rush."],
        ["When he finishes he stays put, buried, and does it again before the fire's burned down, then once more for the road.",
         "He finishes deep with a grunt like a felled tree, rests a while with his beard in %n's neck, and then starts again."],
      ],
      over: [["He rubs himself off against %n's belly on the warm fur and finishes across it, slow, a long winter's worth."]],
      end: ["By the time the fire's down to coals, %n is curled on the bearskin full of %ml of trapper, warm to the bone and smellin' of woodsmoke.",
            "The trapper throws another log on, wipes himself off on the rug, and lets %n go in the morning with %ml in their %h and fur in their hair."],
      endOver: ["He leaves %ml cooling on %n's belly and goes to bed without a word. The fire keeps them warm."],
    },
    hottub: {
      beats: [
        ["Steam rolls out of the cedar hot tub behind the cabin, and four lumberjacks are already in it, beards wet, shoulders like barn doors. One of them crooks a finger at %n.",
         "%n follows the sound of laughing to the back of the cabin and finds the lumberjacks' hot tub, steaming, crowded, and short one guest."],
        ["They haul %n in, clothes and all, and the clothes don't last. The water's near scalding and every square inch of the tub is muscle and beard.",
         "Big hands pass %n round the tub like a jug, one lap to the next, everybody getting a feel and a laugh."],
        ["They sit %n on the edge, then on a lap, then on another, the water slapping at the cedar boards as the bench starts to rock.",
         "Somebody holds %n's arms behind them, somebody else spreads their knees, and the other two argue about who's first."],
      ],
      in: [
        ["They take turns in %n's %h, one after another in the steaming water, each one finishing deep with a holler the whole woods can hear.",
         "Four lumberjacks, four %c cocks, one after another in %n's %h, and the water's sloshing out over the sides by the second."],
        ["By the third they've stopped bothering to take turns and just pass %n between them, never empty for long.",
         "The last one takes his time while the others drink and cheer him on."],
      ],
      over: [["They pass %n round the tub and finish over them one by one, and the steam does its best to wash it off."]],
      end: ["They lift %n out of the tub boiled pink and %ml fuller, wrap them in a towel and send them home with a bottle of whiskey.",
            "%n climbs out of the hot tub wobbly-legged, steaming, and dripping %ml of lumberjack down their thighs."],
      endOver: ["%n gets out of the tub scrubbed by the hot water and sticky all over again, %ml of lumberjack on them."],
    },
    stag: {
      beats: [
        ["Out past the fence where the trees start, %n hears it: a deep groaning bellow, and the crack of antlers on bark. It's rutting season.",
         "A path through the bracken, a smell like musk and turned earth, and then the stag steps out of the trees in front of %n and lowers his head."],
        ["He's a stag-man, eight feet with the rack, chest heaving, every inch of him swollen with the season. He bellows again and paws the ground, and his eyes are on %n.",
         "His antlers are wide as a doorway and his nostrils flare at %n's scent. He's been fighting all week for a doe. He's decided %n will do."],
        ["He herds %n against a fallen oak with his chest and his antlers, crowding them in, and there's no getting round him.",
         "One shove of his head and %n is bent over the mossy log with a stag's weight coming down behind them."],
      ],
      in: [
        ["He covers %n in one great lunge, his long tapered %c cock driving into their %h, and he ruts like it's the last day of the season.",
         "He mounts %n's %h in short savage thrusts, bellowing into the trees, the log creaking under them both."],
        ["He finishes with a roar that scatters every bird in the wood, hot and deep, and doesn't let %n up till he's done it twice.",
         "When he's finished the first time he just stands there over %n, blowing, and then mounts them again."],
      ],
      over: [["He ruts against %n's thighs till he bellows and finishes across the moss and their back."]],
      end: ["The stag crashes off into the trees and %n is left draped over the log, %ml of buck in their %h, smelling of musk and moss.",
            "%n stumbles back out of the woods with leaves in their hair and %ml of rutting stag running down their legs."],
      endOver: ["%n is left on the moss with %ml of stag across their back, and a long walk home."],
    },
    booth: {
      beats: [
        ["A narrow door with a curtain and a sign: PEEP BOOTH, ONE COIN. %n steps in to look, and the door locks behind them. They're the show.",
         "%n finds themselves in a tiny round booth lined with windows and little holes, and a coin drops somewhere outside with a clink."],
        ["Shutters slide up one at a time. Faces in the windows. Then, in the holes, cocks, one after another, as the coins keep dropping.",
         "Every coin opens another window. The booth fills up with eyes, and the holes at hip height start to fill too."],
        ["A speaker crackles: \"The customers would like you on your knees.\" There's nowhere else to be in a booth this small.",
         "A voice through a hole: \"Go on, then. We paid.\" %n kneels on the little velvet pad in the middle."],
      ],
      in: [
        ["%n goes round the booth hole by hole, mouth on one, hands on two more, while the windows watch and the coin slot keeps clinking.",
         "They take every %c cock that comes through the wall in their mouth, one after another, and the customers finish down their throat."],
        ["The coins don't stop for a long time. %n's jaw aches. The customers don't care.",
         "Every one finishes, and every one leaves a coin on the way out."],
      ],
      over: [["The customers finish through the holes all over %n, and the windows fog up."]],
      end: ["When the last shutter drops, %n kneels in the booth with %ml of customers in their belly and a pile of coins on the floor.",
            "The door unlocks with a buzz. %n crawls out of the peep booth glazed and swallowed full, %ml of it, coins stuck to their knees."],
      endOver: ["The door unlocks. %n crawls out of the booth covered, %ml of customers drying on them."],
    },
  });

  const THEMED_LINES = {
    groomer: {
      beats: [
        ["The kennel girl whistles, and before %n can ask why they're up on the grooming table with a noose-loop round their neck and a strap round their middle.",
         "%n is lifted onto the steel grooming table by two kennel hands, clipped in at the collar and the waist, and told to stand pretty."],
        ["A warm hose, a bucket of suds, and a stiff brush everywhere: behind the ears, under the arms, between the toes, between everything else.",
         "{t}The kennel girl soaps %n's tits with both hands, thorough as a show groomer, and rinses them twice to be sure.",
         "{c}%n's cock is soaped, rinsed and soaped again, the kennel girl humming along like it's just another coat.",
         "{v}The brush goes between %n's legs too, soft and quick, and the kennel girl says \"There's a good girl\" without looking up."],
        ["Then the dryer, then the comb, then a spritz of something that smells like show day, and a bow on the collar.",
         "The kennel girl blow-dries %n till they're fluffed, combs them out, and clips a little rosette to their collar."],
        ["\"Walk,\" she says, and leads %n up and down the kennel aisle on a short show lead while the hands judge their gait.",
         "%n is stacked, made to stand square and still for inspection, and the hands go over them like judges at a county fair."],
      ],
      end: ["%n is unclipped, groomed to a shine and smelling of puppy shampoo, with a ribbon on their collar that says BEST IN KENNEL.",
            "The kennel girl gives %n a treat and a pat. \"Prettiest thing in the kennels today.\" They smell like a show dog for hours."],
    },
    leashpost: {
      beats: [
        ["A hand on %n's collar, a click, and they're clipped to the iron post in the dog yard on a lead just long enough to kneel.",
         "%n wanders into the dog yard and a kennel hand clips them to the post. \"Wait,\" he says, and leaves."],
        ["It's a busy yard. Farmhands cut through it, dogs trot past, and every one of them stops to look at what's tied to the post.",
         "The first passer-by pats %n's head. The second gives their ass a slap. The third stops a good while longer."],
        ["Folks start using %n as they go by, the way you'd use a water trough: a quick drink, and on with the day.",
         "{v}Somebody bends %n over the post and has a quick go at their pussy, then whistles on his way.",
         "{c}A farm girl stops, crouches, and strokes %n's cock till they whimper, then leaves them hanging.",
         "A farmhand pushes %n's head down and uses their mouth, quick and practical, and goes back to work."],
      ],
      end: ["The kennel hand comes back, unclips %n, and takes them in, dripping and dusty, a few strangers' worth on them.",
            "By the time anybody remembers %n is out there, the whole yard's had a turn. They come off the post stiff, sticky and very well used."],
    },
    teatcheck: {
      beats: [
        ["\"Teat check,\" the dairy girl calls, and %n is in the head gate before they've finished their first yawn.",
         "%n is walked into the check stall and the head gate drops shut. A clipboard, a tape, and cold hands."],
        ["Each teat is squeezed, rolled and pulled till it gives a drop, and the drop is held up to the light and graded.",
         "{t}The dairy girl weighs each of %n's udders in her palm, lets them drop, and writes a number down.",
         "{nt}The dairy girl pinches and pulls at %n's flat nipples till they're red and sore, and writes NO YIELD with a little frown."],
        ["Then she strips them out by hand, long firm pulls, a pail between %n's knees.",
         "Stripped by hand, quick and hard, till every quarter's empty and %n is squirming in the gate."],
      ],
      end: ["Graded, measured and stripped, %n is let out of the head gate with sore teats and a mark on the dairy board.",
            "The head gate lifts. %n's nipples throb. The clipboard says Grade B, could do better."],
    },
    wax: {
      beats: [
        ["Strapped flat on the bench, %n watches the farmhand light a fat red candle and wait for the wax to pool.",
         "%n is buckled down on the bench, and somebody strikes a match. A candle, and a long patient look."],
        ["The first drop lands on %n's belly. Then their thigh. Then the inside of their thigh, closer, and closer.",
         "{t}Drops fall one by one around %n's nipples, circling, until the last one lands right on the tip.",
         "{c}The farmhand drips a slow line of wax down the length of %n's cock and watches them strain against the straps.",
         "{v}A slow trickle of wax runs down %n's mound and the farmhand holds the candle there just long enough."],
        ["When %n's covered in hardened red, the farmhand peels it off with a fingernail, piece by piece, and starts over.",
         "They paint %n in wax till they look like a sealed letter, then crack it off with a riding crop."],
      ],
      end: ["%n is unbuckled pink and tingling all over, little red flakes of wax still stuck in odd places.",
            "The candle's burned down to a stub. %n gets up off the bench marked in red welts and drips that'll fade by morning."],
    },
    tomatoes: {
      beats: [
        ["The stocks in the square snap shut on %n's neck and wrists, and somebody wheels up a cart of very ripe fruit.",
         "%n is locked into the stocks in the middle of the square, and a hand-painted sign goes up: ONE COPPER A THROW."],
        ["The first tomato bursts on %n's forehead. The crowd cheers. A queue forms.",
         "Splat. A soft tomato right on the cheek, and juice runs into %n's eyes. Then a plum. Then a lot more."],
        ["Children aim for the face, farmhands aim lower, and somebody brings a basket of overripe berries.",
         "%n gets pelted till they're dripping red and pulp from hair to chin, seeds in their ears, and still the coppers keep coming."],
      ],
      end: ["When the cart's empty, %n is let out of the stocks dripping with tomato and berry juice, the square cheering.",
            "The stocks open on a %n plastered head to chest in fruit pulp, sticky, red, and a few coppers richer for the farm."],
    },
    trophy: {
      beats: [
        ["The trapper hoists %n onto the trophy wall and straps them in, between the elk and the bear head, at just the right height.",
         "%n is mounted on the cabin wall like a hunting trophy, wrists and ankles strapped wide to the planks."],
        ["A brass plate is screwed in underneath: LOCAL GAME, TAKEN THIS SEASON. Visitors come to admire the specimen.",
         "The trapper's friends come by to see the new trophy, and they run their hands over it like they'd judge a pelt."],
        ["{t}One of them gives %n's tits a squeeze. \"Good condition.\" Another one agrees.",
         "{c}One of them gives %n's cock a tug and laughs. \"Mounted right.\"",
         "They admire %n for hours, drinking by the fire, and every now and then one of them gets up for a closer look."],
      ],
      end: ["When the visitors go home, the trapper takes %n down off the wall. \"Best trophy I've had.\" They're stiff from hanging there all night.",
            "%n is unstrapped from the trophy wall in the morning, the brass plate left behind with a space for next season's catch."],
    },
    slop: {
      beats: [
        ["A bucket tips from the sty rail and the whole slop pail goes over %n's head: peelings, mash, sour milk, all of it.",
         "%n slips on the sty boards and lands in the slop trough just as the pig girl pours the next pail in."],
        ["The pigs hear the slop hit and come running, snorting, rooting, and %n is covered in what they want.",
         "Snouts everywhere: under %n's arms, in their hair, round their ankles, snuffling the slop off them."],
        ["{t}The pig girl hops the rail, scoops the mash off %n's tits with both hands, and takes her time about it.",
         "The pigs root %n over in the muck till they're rolled in it, and the pig girl just laughs at the rail."],
      ],
      end: ["%n climbs out of the sty plastered in slop and mud, rooted over by every pig on the farm.",
            "The pig girl hoses %n off just enough to see their face. The rest of them smells like the sty."],
    },
    hogtie: {
      beats: [
        ["Ropes snap tight around %n's wrists and ankles, then the wrists to the ankles, and they're dropped belly down in the sty's softest mud.",
         "The pig girl hogties %n fast as a calf at a rodeo and rolls them into the wallow."],
        ["The mud's warm and deep, and %n sinks in up to their chin, rocking, unable to do anything but wriggle.",
         "Hogtied in the muck, %n can only rock and squirm while the pigs gather round to sniff."],
        ["Then the boar comes over, the boar-man who keeps the sty, heavy and slow on two legs, and stands over %n in the mud, grunting.",
         "The boar-man takes a long interested look at the trussed thing in his wallow and scratches his belly."],
        ["{v}He kneels in the mud and runs a thick hand between %n's bound legs, and the pig girl doesn't call him off.",
         "He rubs his bristly bulk all over %n, rolling them in the mud, marking them.",
         "{c}He gives %n's cock a squeeze in one big hand and %n squeals into the mud."],
      ],
      end: ["The pig girl cuts %n loose at sundown, caked in mud from head to heel, smelling of the boar.",
            "%n is pulled out of the wallow still tied, mud to the eyebrows, and left to dry on the fence."],
    },
    milkinghole: {
      beats: [
        ["A hole in the wall at chest height, a padded rim, and a sign: MILK HERE. %n leans in to look and the rim closes snug around them.",
         "%n is pressed up to the milking hole by a farmhand who means well, and something soft locks around them through the wall."],
        ["On the other side, hands. Then a mouth. Then cups, cold and pulling, hungry for whatever %n has.",
         "{t}Whatever's on the other side latches onto %n's tits and starts to suck, hard, rhythmic, greedy.",
         "{nt}Whatever's on the other side has a go at %n's chest anyway, then gives up and goes lower.",
         "{c}A hand finds %n's cock through the lower hole and starts milking that too, long and slow."],
        ["It milks %n till there's nothing left, and then for a good while after.",
         "The pulling doesn't stop. %n is held to the wall and drained, and whoever's on the other side is very, very happy about it."],
      ],
      end: ["The rim lets go and %n staggers back from the wall, drained and sore, sticky on both sides.",
            "%n is let out of the milking hole wrung dry, their chest throbbing, and a satisfied sigh comes through the wall."],
    },
    feedbag: {
      beats: [
        ["A canvas feedbag goes over %n's face before they can duck, strapped behind their head, full to the brim with warm mash.",
         "The feed girl straps a feedbag on %n like they're a pony at the fair. \"Eat up. All of it.\""],
        ["There's nothing to do but eat. %n chews and swallows, chews and swallows, mash up to their nose.",
         "Every time %n stops, the feed girl shakes the bag and it settles fuller round their mouth."],
        ["%n's belly rounds out with every mouthful. The feed girl pats it like a melon to check it's ripening.",
         "{t}Mash dribbles out of the bag and down %n's tits. Nobody wipes it off."],
      ],
      end: ["The feedbag comes off empty. %n's belly is round and tight, mash all over their chin and chest.",
            "%n is unbuckled stuffed to bursting, face plastered in mash, and the feed girl scratches a tally on the barn door."],
    },
    desk: {
      beats: [
        ["\"In my office,\" says the overseer, and %n is bent over the big oak desk before the door's even shut.",
         "%n is called into the farm office and pushed face down across the overseer's desk, cheek on the ledger."],
        ["\"Your numbers are down,\" the overseer says, and picks up a wooden ruler. \"Let's discuss them.\"",
         "The overseer reads out every one of %n's shortfalls from the ledger, and a ruler comes down on their ass for each one."],
        ["Each stroke is entered in the ledger in neat red ink. The overseer is very thorough.",
         "{t}When the ruler's done, the overseer reaches under and squeezes %n's tits like checking stock. \"Hmm.\"",
         "When the audit's done the overseer leans back, unzips, and reminds %n that the office is a place of service."],
        ["%n spends the rest of the audit under the desk, on their knees, while the overseer does the paperwork.",
         "Then %n is filed under the desk on their knees, and the overseer signs papers with one hand and holds their head with the other."],
      ],
      end: ["%n crawls out from under the desk with red stripes on their ass, a sore jaw, and a note in the ledger: AUDITED.",
            "The overseer signs off on %n's file, stamps it, and sends them back to work with a pat and a warning."],
    },
    inspection: {
      beats: [
        ["A clipboard, a tape measure, and an office clerk with very cold hands. \"Annual inspection,\" she says. \"Strip.\"",
         "%n is stood on the inspection mark in the office and the clerk clicks her pen."],
        ["Height, weight, hips, chest, every hole and every inch, all measured and written down in tiny neat handwriting.",
         "{t}The tape goes round %n's chest three times, high, low and over the nipples, and the clerk tuts at the numbers.",
         "{c}The clerk measures %n's cock soft, then makes it hard with her cold hand and measures it again.",
         "{v}The clerk spreads %n with two gloved fingers and writes something down that makes her eyebrows rise."],
        ["Teeth, gait, temperament: %n is made to walk, turn, bend, cough, and moo on command.",
         "The clerk checks %n's mouth, flexes their limbs, and makes them bend and show everything twice."],
      ],
      end: ["Inspection complete. %n is handed back their clothes and a carbon copy: FIT FOR PURPOSE.",
            "The clerk staples the report shut. %n is graded, filed and sent out flushed to the ears."],
    },
    stamp: {
      beats: [
        ["The office clerk pulls %n over by the collar and inks a big rubber stamp. \"Paperwork,\" she says.",
         "%n is stood against the filing cabinet while the clerk lines up her stamps on the desk: APPROVED, INSPECTED, PROPERTY."],
        ["Thunk. APPROVED across %n's ass. Thunk. INSPECTED on their thigh. Thunk, thunk, thunk.",
         "{t}A big red GRADE A right across %n's chest, slightly crooked. The clerk tuts and does another one straight.",
         "The clerk stamps %n everywhere there's room, humming, licking her thumb to turn the pages."],
        ["Then the date stamp, the farm's seal, and a little filing number on the back of the neck.",
         "Last, a big FILED stamp on %n's forehead, and the clerk sits back satisfied."],
      ],
      end: ["%n leaves the office stamped all over in red and blue ink, officially filed and approved.",
            "The ink'll take days to scrub off. %n walks out covered in the office's stamps, processed."],
    },
  };
  const themedLine = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, THEMED_LINES[kind][key]), mn, v);
  // the mess each leaves (10u7-traps-3.js)
  Object.assign(MESS_BY_TRAP, {
    slop: ["mash", ["face", "chest", "tummy"]], hogtie: ["mud", ["face", "chest", "tummy"]], feedbag: ["mash", ["face", "chest"]],
    tomatoes: ["strawberry", ["face", "forehead", "chest"]], leashpost: ["cum", ["tummy", "face"]], milkinghole: ["milk", ["chest"]],
    whelping: ["cum", ["tummy"]], bearskin: ["cum", ["tummy"]], hottub: ["cum", ["tummy", "chest"]], stag: ["cum", ["tummy"]], booth: ["cum", ["face", "chest"]],
  });
  // what each needs to have somethin' to work on (10u4-more-traps.js)
  Object.assign(TRAP_NEEDS, {
    teatcheck:   mn => (makesMilk(mn) || hasPart(mn, "udder")) && !limitBlocks(mn, "milk") ? null : "nothin' for the teat check to work on",
    milkinghole: mn => !limitBlocks(mn, "milk") ? null : "their limits rule it out",
  });
  function themedRun(mn, kind, hold, where, after){
    trapHold(mn, hold, where);
    trapRun(mn, kind, THEMED_LINES[kind].beats, () => {
      try { if (after) after(); } catch(e){ warn("themed trap:", e); }
      emote(TRAP_KINDS[kind].icon+" "+themedLine(kind, "end", mn), mn);
    });
  }
  Object.assign(MORE_TRAPS, {
    groomer(mn){ themedRun(mn, "groomer", 4, "the grooming table", () => { const p = prodOf(mn); if (p) p.painted = null; bodyMark(mn, { wash: true }); face(mn, "afterglow", 60); }); },
    leashpost(mn){ themedRun(mn, "leashpost", 5, "the dog yard post", () => { arouse(mn, 40); tally(mn); }); },
    teatcheck(mn){ themedRun(mn, "teatcheck", 3, "the check stall", () => { if (makesMilk(mn)) drainMilk(mn, prodOf(mn).milk); arouse(mn, 15); }); },
    wax(mn){ themedRun(mn, "wax", 4, "the bench", () => { arouse(mn, 30); face(mn, "edged", 60); }); },
    tomatoes(mn){ themedRun(mn, "tomatoes", 5, "the stocks in the square", () => { face(mn, "edged", 60); }); },
    trophy(mn){ themedRun(mn, "trophy", 6, "the trophy wall", () => { arouse(mn, 25); }); },
    slop(mn){ themedRun(mn, "slop", 3, "the sty", () => {}); },
    hogtie(mn){ themedRun(mn, "hogtie", 6, "the wallow", () => { const r = rec(mn); r.muddy = Date.now(); }); },
    milkinghole(mn){ themedRun(mn, "milkinghole", 4, "the milking hole", () => { const p = prodOf(mn); if (makesMilk(mn)) drainMilk(mn, p.milk); arouse(mn, 30); }); },
    feedbag(mn){ themedRun(mn, "feedbag", 4, "the feedbag", () => {}); },
    desk(mn){ themedRun(mn, "desk", 5, "the overseer's desk", () => { arouse(mn, 20); face(mn, "edged", 60); }); },
    inspection(mn){ themedRun(mn, "inspection", 4, "the inspection mark", () => { arouse(mn, 15); }); },
    stamp(mn){ themedRun(mn, "stamp", 3, "the office", () => {
      const w = ["APPROVED", "INSPECTED", "GRADE A", "FILED", "PROPERTY"][Math.floor(Math.random()*5)];
      bodyMark(mn, { write: { line: w, area: ["hips", "chest", "waist"][Math.floor(Math.random()*3)] } });
    }); },
  });
