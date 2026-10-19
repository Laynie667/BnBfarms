/* WHAT'S IN THIS FILE (glory-stalls/visitors-more.js)
   More who-comes-to-the-hole (Laynie, Oct 19: "id also like more gloryhole visitors and types... goblin traps and
   visitors too"). Merged into scenes.js at load.
     TYPES: goblin (small, knobbly, all balls: huge loads) · orc (big, green, thick) · bovine (a minotaur's, blunt and
     enormous) · tentacle (somethin' with more than one, slick and searching) · imp (spade-tipped and hot)
     PERSONAS: the goblin gang, the orc raider, the minotaur, the thing with tentacles, the imp (each comes with its
     own kind of cock), and more folk off the farm: the old farmer, the tourist with a camera, the overseer on
     inspection, the lumberjack off shift, the newlyweds' best man, the stable boy.
   %n is the person in the stall; %size the size word. No round brackets.
*/
export const TYPES = {
  goblin:   { w: 9 },
  orc:      { w: 7 },
  bovine:   { w: 5, flare: true },
  tentacle: { w: 4 },
  imp:      { w: 5 },
};
export const LOAD_X = { goblin: 2.2, orc: 1.8, bovine: 2.0, tentacle: 1.4, imp: 1.2 };
export const REVEAL = {
  goblin:   ["A knobbly green cock pokes through the hole, %size, and behind it a pair of balls far too big for whoever's attached, swinging and heavy.",
             "Something short and green and very eager shoves through the hole, %size and twitching, with a cackle on the other side of the wall.",
             "A goblin cock bobs through the hole, %size, warty and hot, its owner hopping to reach and giggling the whole time."],
  orc:      ["A thick green cock slides through the hole, %size, veined like an oak root, and the wall groans as a big body leans on it.",
             "Through the hole comes an orc's cock, %size and heavy, dark green at the head, already dripping on the straw.",
             "A %size green cock pushes through, so thick the hole creaks around it, and a grunt like a bear's comes through the boards."],
  bovine:   ["The hole splinters a little as a bull's cock pushes through, %size, long and pink with a broad blunt head, and a snort shakes the wall.",
             "A minotaur's cock slides in, %size, heavy as a fence post, and two great hooves stamp in the straw outside.",
             "Something enormous and pink nudges through the hole, %size, with a heavy musk that fills the stall before it's halfway in."],
  tentacle: ["Something wet slithers through the hole. Then another. Slick, searching tentacles, %size, feeling their way toward %n.",
             "A slimy tentacle-cock eases through the hole, %size and tapered, curling at the tip, and two thinner ones follow it in.",
             "The hole fills with glistening tentacles, the thickest one %size and ridged, all of them dripping and tasting the air."],
  imp:      ["A dusky red cock slips through the hole, %size, ending in a little spade-shaped tip, and the stall gets warmer.",
             "Through the hole comes an imp's cock, %size, ridged and hot as a coal, a giggle like a kettle whistle behind it.",
             "A %size red cock with a spaded tip wiggles through, and a pointed tail flicks the other side of the gap."],
};
export const ENTRY = {
  goblin:   { mouth: ["It jabs past %n's lips quick and greedy, small enough to bob all the way in, the goblin squealing with glee."],
              vulva: ["It darts into %n's pussy and starts pumping at once, quick as a rabbit, those big balls slapping the wall."],
              butt:  ["It jabs into %n's ass with no patience at all and the goblin cackles as it sinks in."] },
  orc:      { mouth: ["It forces %n's jaw wide and fills their mouth to the back, the orc rumbling with satisfaction."],
              vulva: ["It splits %n's pussy open in one heavy shove, the orc grunting like he's lifting a log."],
              butt:  ["It presses and presses at %n's ass until the ring gives with a stretch that makes %n gasp, and then it's in, deep."] },
  bovine:   { mouth: ["The broad head fills %n's mouth to the corners and stops, all it can fit, pulsing on their tongue."],
              vulva: ["It pushes into %n's pussy slow and enormous, stretching them till they're sure it won't fit, and then it does."],
              butt:  ["It works into %n's ass inch by straining inch, the minotaur snorting and patient as a plough horse."] },
  tentacle: { mouth: ["One slides over %n's tongue and down, while another strokes their cheek and a third traces their throat from outside."],
              vulva: ["The thick one slides into %n's pussy while the thinner ones curl around their thighs and hold them open."],
              butt:  ["The tapered tip coils into %n's ass, slick and searching, and the others wrap round %n's hips to pull them closer."] },
  imp:      { mouth: ["It slips onto %n's tongue hot as a sip of tea, the spade tip flicking at the back of their throat."],
              vulva: ["The spaded tip catches as it pushes into %n's pussy, then slides home, burning sweet."],
              butt:  ["It wiggles into %n's ass, hot and slippery, the spade tip catching on the way in."] },
};
export const TYPE_RHYTHM = {
  goblin:   ["The goblin humps in a frantic little blur, cackling, heavy balls smacking the boards.", "Little green hands grip the edge of the hole as the goblin goes at %n like a terrier.",
             "\"Mine, mine, mine,\" the goblin chants through the wall in time with every quick thrust.", "It's small and quick and absolutely tireless, and %n starts losing count of the strokes."],
  orc:      ["Each thrust shakes the whole stall. The orc fucks like he fights: hard, heavy and without stopping.", "A big green hand slaps the wall above %n and stays there, bracing.",
             "The orc grunts on every stroke, deep and rhythmic, like he's chopping wood.", "%n feels every vein of it, thick as a wrist, dragging in and out."],
  bovine:   ["Slow, deep, heavy strokes, the minotaur's breath steaming through the gaps in the boards.", "Every thrust rocks %n forward against the wall, and the bull snorts in time.",
             "The broad head starts to swell, flaring wider on every slow pull back.", "Hooves stamp outside. The minotaur leans his whole weight into %n, rumbling."],
  tentacle: ["The tentacles move in waves, one pushing in as another pulls back, never still.", "A slick tentacle curls round %n's waist from outside the hole and holds them there.",
             "The thick one swells and ripples inside %n, while the thin ones stroke everywhere they can reach.", "Slime drips from every one of them, pooling on the straw under %n."],
  imp:      ["The imp giggles and fucks %n in quick, teasing little bursts, stopping just to hear them whine.", "Heat pours off it, so warm that %n starts to sweat.",
             "The spade tip catches and tugs inside %n on every pull back.", "A pointed tail snakes through the hole and flicks %n's thigh like a riding crop."],
};
export const FINISH = {
  goblin:   (place, amt) => "The goblin squeals and floods " + place + ": " + amt + ", far more than anything that size should hold, pumping and pumping till it runs out of %n.",
  orc:      (place, amt) => "The orc roars and buries it to the root, emptying into " + place + ": " + amt + ", thick and hot, holding %n against the wall till he's done.",
  bovine:   (place, amt) => "The head flares wide and the minotaur bellows, filling " + place + ": " + amt + ", so much it gushes back out around him.",
  tentacle: (place, amt) => "Every tentacle shudders at once and pumps " + place + " full of warm slime: " + amt + ", and the thin ones keep stroking while it oozes out.",
  imp:      (place, amt) => "The imp shrieks with delight and spurts deep into " + place + ": " + amt + ", hot as a candle, tingling all the way through %n.",
};
export const PERSONAS = {
  goblins: {
    type: "goblin",
    arrive: ["A gaggle of giggling goblins crowds outside %n's stall, shoving each other for first go.",
             "\"Ooh, a fresh one!\" A goblin voice squeaks at the hole, and three more come running.",
             "Something small climbs onto an upturned bucket outside %n's stall, cackling, while its friends hold the bucket steady."],
    talk:   ["\"Pretty, pretty, PRETTY.\"", "\"My turn after! My turn after!\"", "\"Big one for a little goblin, eh? Heh heh.\"", "\"Hold still, tall thing, I'm almost there.\""],
    leave:  ["The goblin hops down and the next one scrambles up in its place, before the gaggle finally wanders off squabbling.",
             "Cackling and slapping each other's backs, the goblins scamper off to tell the others."],
    pace: "rough",
  },
  orc: {
    type: "orc",
    arrive: ["Heavy boots. Somebody very big ducks under the stall doorframe and the wall bows as he leans on it.",
             "A rumbling voice outside %n's stall: \"They said this one takes it rough.\" It isn't a question.",
             "The boards creak as something enormous settles against them, smelling of leather and smoke."],
    talk:   ["\"Good. Strong. Take it.\"", "\"Hrrm. Tight. Better.\"", "\"You'll walk funny after. Good.\""],
    leave:  ["The orc grunts, satisfied, and the floorboards complain all the way to the door.",
             "A heavy hand pats the wall like he's patting a good horse, and the orc stomps off."],
    pace: "rough",
  },
  minotaur: {
    type: "bovine",
    arrive: ["Hooves, heavy and slow. A huge horned shadow falls across %n's stall and stops.",
             "The smell hits first: musk and hay and bull. Then the snort, right at the hole.",
             "The minotaur has to duck his horns to fit in the aisle, and when he reaches %n's stall he paws the straw."],
    talk:   ["\"Mmmrrr.\"", "\"Breed. Good.\"", "\"Still. Hold still.\""],
    leave:  ["The minotaur snorts, long and satisfied, and his hooves fade off toward the pasture.",
             "He stays buried a long while, then pulls out with a snort and plods away."],
    pace: "deep", alwaysInside: true,
  },
  tentacled: {
    type: "tentacle",
    arrive: ["A wet, slithering sound comes down the row, and something cold drips through the gap under %n's stall door.",
             "The light through the hole goes green and wavery. Something is pressed against the other side, and it's moving.",
             "Nobody walks up to %n's stall. Something oozes up to it instead."],
    talk:   ["A low gurgle comes through the boards.", "A wet, pleased sort of burble shakes the wall.", "Something on the other side hums, deep and slow, like a pond."],
    leave:  ["The tentacles slide back through the hole one by one, leaving slime on everything, and the wet sound fades away down the row.",
             "Whatever it was slithers off, and the stall smells of pondwater for an hour."],
    pace: "steady",
  },
  imp: {
    type: "imp",
    arrive: ["A tiny cloud of smoke, a giggle, and an imp is hanging upside down from the stall rail, grinning at %n's hole.",
             "Something small and red and horned skips down the row tapping on stalls, and stops at %n's with a delighted squeak.",
             "The air goes warm and smells of struck matches. Somebody's very pleased to have found %n."],
    talk:   ["\"Ooh, you're fun. You're SO fun.\"", "\"Say please. Go on. Say it.\"", "\"I could do this all century, sweetling.\""],
    leave:  ["With a pop and a puff of smoke, the imp's gone, leaving %n tingling and the stall far too warm.",
             "The imp blows a kiss through the hole and skips off giggling."],
    pace: "steady",
  },
  oldfarmer: {
    arrive: ["Slow boots and a creaking back. The old farmer from down the lane settles in outside %n's stall with a groan.",
             "\"Now then,\" says an old voice at the hole, like he's greetin' new stock at market. \"Let's have a look at you.\""],
    talk:   ["\"Good stock, this. Good stock.\"", "\"Back in my day we didn't have holes. We had fences.\"", "\"Steady now. Steady.\""],
    leave:  ["The old farmer gives the boards a pat, says \"Fine animal,\" and shuffles off toward the pub.",
             "\"That'll do,\" says the old farmer, buttoning up slow, and he's gone."],
    pace: "slow",
  },
  tourist: {
    arrive: ["A camera shutter clicks outside %n's stall. Somebody's visiting the farm and very much enjoying the tour.",
             "\"Is this, is this one of the attractions?\" a tourist asks nobody, and decides it is."],
    talk:   ["\"Wait till I tell them back home.\"", "\"Smile! Oh, right, you can't see me.\"", "\"Best farm holiday ever.\""],
    leave:  ["One last camera click, and the tourist wanders off to find the gift shop.",
             "The tourist thanks %n very politely, like a waiter, and goes."],
    pace: "nervous",
  },
  overseer: {
    arrive: ["Clipboard footsteps. The overseer is doing the rounds, and %n's stall is next on the list.",
             "\"Quality check,\" says a crisp voice at the hole, and a pen clicks."],
    talk:   ["\"Hm. Adequate.\"", "\"Tighter, please. I'm taking notes.\"", "\"Your numbers had better be up this week.\""],
    leave:  ["The overseer makes a note, signs it, and moves on to the next stall.",
             "\"Satisfactory,\" the overseer says, and the clipboard goes back under an arm."],
    pace: "steady",
  },
  lumberjack: {
    arrive: ["Sawdust and sweat and big boots. A lumberjack fresh off shift stops at %n's stall, flexing sore hands.",
             "\"Long day,\" a deep voice says through the hole. \"You'll do me right.\""],
    talk:   ["\"Timber.\"", "\"That's a good stall, that.\"", "\"Mm. Better than a hot bath.\""],
    leave:  ["The lumberjack stretches till his back cracks, thanks %n, and heads off to the cabin.",
             "Heavy boots and a contented whistle fade off toward the woods."],
    pace: "rough",
  },
  bestman: {
    arrive: ["Laughter and the clink of bottles: a wedding party's spilled into the barn, and the best man's found %n's stall.",
             "\"Last night of freedom!\" somebody shouts, and the groom's mates shove the best man toward %n's hole."],
    talk:   ["\"Don't tell the bride!\"", "\"Oi, you lot, wait your turn!\"", "\"Best. Wedding. Ever.\""],
    leave:  ["The best man staggers off to a cheer from his mates, and the next one's already pushing up to the hole.",
             "Somebody pours champagne over the wall for %n, and the party moves on."],
    pace: "rough", short: true,
  },
  stableboy: {
    arrive: ["The stable boy, hay in his hair, checks nobody's looking and slips up to %n's stall.",
             "Soft quick steps from the stables. \"Just a quick one, before the horses need me.\""],
    talk:   ["\"You're so much better than the horses.\"", "\"Shh, shh, they'll hear.\"", "\"I think about this all week.\""],
    leave:  ["The stable boy hurries back to the horses, red to the ears.",
             "A whispered thank you, and he's off at a run before anyone sees."],
    pace: "nervous", short: true,
  },
};
