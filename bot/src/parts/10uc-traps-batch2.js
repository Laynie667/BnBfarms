  /* WHAT'S IN THIS FILE (10uc-traps-batch2.js)
     The second batch of themed traps (Laynie, Oct 19: "I need a ton of sexy farm traps, furry traps, pregnancy traps,
     messy traps, and restraints traps, and more in any combination. its my players favorite features... goblin traps
     and visitors too"). A new place, the goblin camp (spots named goblin…, cave…, camp…), and more for the others.
       goblins    goblinraid (a raiding party, every one of them takes a turn) · goblinpit (the breeding pit) ·
                  goblinmarket (sold at the goblin market) · goblincart (trussed on the goblin cart) · warband (the orc chief)
       furry      minotaur · werewolf (at the full moon) · foxden (the fox-brothers' den) · lionpride (the pride's lion) ·
                  ramstud (the ram in the paddock)
       pregnancy  shrine (the fertility shrine) · studchair (the breeding chair) · clutch (the egg-layer in the pond)
       messy      buttermill (the butter churn) · syruptap (the maple taps) · pieeat (the pie contest) · mudslide
       restraint  squeezechute (the cattle chute) · twine (baler twine in the hayloft) · yoke (the milkmaid's yoke) ·
                  ponycart (harnessed to the pony cart)
     %n name · %c the cock · %h the hole · %ml how much · %x a word
  */
  Object.assign(TRAP_KINDS, {
    goblinraid:   { icon: "👺", what: "a goblin raiding party: caught, tied and taken turns on by every one of them", limit: /\b(goblin|gang|breed)/i },
    goblinpit:    { icon: "🕳️", what: "the goblins' breeding pit, and the goblins who keep it", limit: /\b(goblin|breed|pregnan)/i },
    goblinmarket: { icon: "💰", what: "the goblin market: put on a block and haggled over", limit: /\b(goblin|auction|sold|humiliat)/i },
    goblincart:   { icon: "🛒", what: "trussed up on the goblin cart and paraded round the camp", limit: /\b(goblin|rope|display|humiliat)/i },
    warband:      { icon: "🪓", what: "the orc warchief's tent, and his idea of tribute", limit: /\b(orc|breed|size|rough)/i },
    minotaur:     { icon: "🐂", what: "the minotaur in the back paddock, and a bull's idea of a cow", limit: /\b(size|breed|beast|anthro)/i },
    werewolf:     { icon: "🌕", what: "the full moon, the woods, and the werewolf who finds you there", limit: /\b(knot|breed|beast|anthro)/i },
    foxden:       { icon: "🦊", what: "the fox-brothers' den: teased silly, then shared", limit: /\b(tickl|gang|breed|anthro)/i },
    lionpride:    { icon: "🦁", what: "the pride's lion-man, and the lionesses who hold you down for him", limit: /\b(breed|beast|anthro|barb)/i },
    ramstud:      { icon: "🐏", what: "the ram in the paddock, rutting for the season", limit: /\b(breed|beast|anthro|rut)/i },
    shrine:       { icon: "🪔", what: "the fertility shrine: incense, a warm charm, and a womb that won't stay empty", limit: /\b(heat|pregnan|breed|fertil)/i },
    studchair:    { icon: "🪑", what: "the breeding chair, and a line of studs with appointments", limit: /\b(breed|gang|pregnan)/i },
    clutch:       { icon: "🥚", what: "the thing in the pond that lays its eggs in whoever wades in", limit: /\b(eggs?|ovipos|tentacl)/i },
    buttermill:   { icon: "🧈", what: "the butter churn: strapped to it and churned till there's butter everywhere", limit: /\b(food|messy|milk|splosh)/i },
    syruptap:     { icon: "🍁", what: "the maple grove taps, and a bucket of syrup with your name on it", limit: /\b(food|messy|syrup|splosh)/i },
    pieeat:       { icon: "🥧", what: "the pie-eating contest: hands tied, face first, and you don't win", limit: /\b(food|messy|feed|splosh)/i },
    mudslide:     { icon: "🛝", what: "the mudslide in the bottom field, and the mud at the end of it", limit: /\b(mud|messy|filth)/i },
    squeezechute: { icon: "🚧", what: "the cattle squeeze chute: clamped in, handled, and let out when they're done", limit: /\b(immobil|restrain|squeez)/i },
    twine:        { icon: "🧶", what: "baler twine in the hayloft, and somebody who knows knots", limit: /\b(rope|shibari|bondage|immobil)/i },
    yoke:         { icon: "🪵", what: "the milkmaid's yoke: locked across your shoulders with full buckets on it", limit: /\b(yoke|restrain|milk|carry)/i },
    ponycart:     { icon: "🐴", what: "harnessed to the pony cart, bit in, and driven round the farm", limit: /\b(pony|harness|bit|pet ?play)/i },
  });
  // the ones with somebody waitin' in them breed like the other anthro traps (10u3-anthro-traps.js)
  Object.assign(ANTHRO, {
    goblinraid: { sire: -40, name: "the goblin raiders",      type: "human",    loads: 8, ml: 70,  hold: 9, hole: "vulva", bonus: 2.4, where: "the goblin camp", litter: [3, 6] },
    goblinpit:  { sire: -41, name: "the pit goblins",         type: "human",    loads: 6, ml: 90,  hold: 9, hole: "vulva", bonus: 2.6, where: "the breeding pit", litter: [4, 7] },
    warband:    { sire: -42, name: "the orc warchief",        type: "human",    loads: 2, ml: 380, hold: 7, hole: "vulva", bonus: 1.7, where: "the warchief's tent" },
    minotaur:   { sire: -43, name: "the minotaur",            type: "equine",   loads: 2, ml: 600, hold: 8, hole: "vulva", bonus: 1.8, where: "the back paddock" },
    werewolf:   { sire: -44, name: "the werewolf",            type: "canine",   loads: 3, ml: 220, hold: 9, hole: "vulva", bonus: 1.8, where: "the moonlit woods" },
    foxden:     { sire: -45, name: "the fox brothers",        type: "canine",   loads: 4, ml: 110, hold: 8, hole: "vulva", bonus: 1.5, where: "the fox den" },
    lionpride:  { sire: -46, name: "the pride's lion",        type: "feline",   loads: 3, ml: 150, hold: 7, hole: "vulva", bonus: 1.6, where: "the pride's rock" },
    ramstud:    { sire: -47, name: "the ram",                 type: "human",    loads: 2, ml: 240, hold: 6, hole: "vulva", bonus: 1.6, where: "the ram's paddock" },
    studchair:  { sire: ANON_STUD, name: "the chair's studs",  type: "human",    loads: 5, ml: 120, hold: 9, hole: "vulva", bonus: 2.0, where: "the breeding chair" },
    clutch:     { sire: -48, name: "the thing in the pond",   type: "draconic", loads: 2, ml: 160, hold: 7, hole: "vulva", bonus: 0,   where: "the pond", eggs: true },
  });
  Object.assign(ANTHRO_LINES, {
    goblinraid: {
      beats: [
        ["A whistle from the hedge, then a dozen more, and %n is suddenly knee deep in goblins: green, grinning, armed with rope and very pleased with themselves.",
         "Something tugs %n's ankle, then their wrist, and a net drops over them from the trees. \"GOT ONE!\" shrieks a goblin, and the raiding party pours out."],
        ["They tie %n with more enthusiasm than skill, wrists, ankles, a loop round the neck for leadin', and they argue the whole time about who caught them.",
         "The goblins truss %n up and carry them off on their shoulders, a dozen little hands everywhere, back to the camp fire."],
        ["At the camp they draw lots with knucklebones for turns. The goblin who loses has to go last, and sulks loudly about it.",
         "%n is dumped on a heap of furs by the fire while the raiders line up, shoving and squabbling, the biggest balls first."],
      ],
      in: [
        ["The first goblin climbs on and takes %n's %h with a delighted squeal, quick and frantic, and the next one's already tugging his sleeve.",
         "One after another the goblins take turns in %n's %h, each one quick and greedy, each one cackling, each one emptying far more than something so small should have."],
        ["Eight goblins, eight loads, and by the end %n's belly is swollen and sloshing with goblin seed while the raiders dance round the fire.",
         "They go round twice. The little ones keep coming back. %n stops being able to tell them apart, only that every one of them finishes deep."],
      ],
      over: [["The goblins take turns over %n by the fire and cover them head to toe, cackling at the mess."]],
      end: ["At dawn the raiders untie %n and push them back toward the farm, %ml of goblin sloshing in their %h and a goblin's war paint on their cheek.",
            "%n is let go at sunup, stuffed with %ml of goblin seed and smelling of campfire, a dozen little handprints on their ass."],
      endOver: ["The goblins send %n home at dawn glazed with %ml of them and chuckling about it for days."],
    },
    goblinpit: {
      beats: [
        ["The ground gives way and %n slides down into a warm, straw-lined pit. Torches flicker up on the rim, and green faces peer down.",
         "%n follows a trail of shiny trinkets right to the edge of a hole in the ground, and a little shove from behind does the rest."],
        ["\"Fresh breeder!\" A goblin with a ledger ticks something off. \"Pit's open, lads.\" Ladders drop down from every side.",
         "The pit goblins are bigger than the raiders, and better organised: one holds a clipboard, one holds %n, the rest queue."],
        ["They tie %n's ankles to stakes, wide, and stuff a bundle of straw under their hips so everything stays in.",
         "%n is laid on the warm straw, hips propped up on a feed sack. \"Tilt helps,\" the goblin with the clipboard explains."],
      ],
      in: [
        ["The breeders climb down one at a time and fill %n's %h, each one holding deep till he's done, and the clipboard goblin times them.",
         "Each pit goblin ruts into %n's %h hard and short and finishes buried, and the next one's waiting at the bottom of the ladder."],
        ["When the last one's done the clipboard goblin pats %n's swollen belly. \"Litter in this one. Big one.\"",
         "They leave %n tilted on the feed sack for an hour after, plugged with a wad of straw, so none of it's wasted."],
      ],
      over: [["The pit goblins finish across %n's thighs and belly and the clipboard goblin marks them DUD with a sigh."]],
      end: ["They winch %n out of the pit at last, belly heavy with %ml of goblin seed and a ledger entry that says LITTER EXPECTED.",
            "%n climbs out of the breeding pit on wobbly legs, stuffed with %ml, a goblin tally scratched on their thigh."],
      endOver: ["%n climbs out of the pit sticky with %ml of goblin and very much not bred, to the goblins' disgust."],
    },
    warband: {
      beats: [
        ["Drums. A ring of tents, banners with skulls on, and two orc guards who take %n by the elbows and walk them to the biggest tent.",
         "%n wanders too close to the orc camp and is marched in as tribute before they can explain anything."],
        ["The warchief is enormous: green, scarred, tusked, sprawled on a throne of furs. He looks %n over like a horse he's been given.",
         "He's built like a barn door with tusks, and he laughs, deep, when he sees what his warriors have brought him."],
        ["\"Tribute,\" he rumbles, and his guards bend %n over the war table among the maps.",
         "He pulls %n into his lap, turns them round, and bends them over the arm of his throne."],
      ],
      in: [
        ["He takes %n's %h with a %c cock as thick as his wrist, slow at first, then like he's conquering a village.",
         "The warchief splits %n's %h open in one heavy stroke and ruts them across the war table, maps flying."],
        ["He finishes with a roar that sets the war drums going outside, holds %n there, and then does it again for the drums.",
         "When he's done he tosses %n to the furs, drinks, and comes back for a second helping."],
      ],
      over: [["The warchief finishes over %n's back and laughs, slapping their ass like a trophy."]],
      end: ["The warchief lets %n go with %ml of orc in their %h and a tribute token on a thong round their neck.",
            "%n staggers out of the orc camp at dawn, %ml fuller and barely able to walk, the drums still going behind them."],
      endOver: ["%n leaves the orc camp marked with %ml of warchief and a war paint handprint on their ass."],
    },
    minotaur: {
      beats: [
        ["The gate to the back paddock is open. It's never open. %n steps through, and a snort like a steam engine answers from the barn.",
         "Hoofbeats, heavy, getting closer. %n turns just in time to see the minotaur come round the hay barn with his head down."],
        ["He's nine feet of muscle and fur, horns as wide as a cart, a ring through his nose, and he stops in front of %n and breathes on them.",
         "The minotaur circles %n slow, snuffling at their hair, their neck, their thighs, and rumbles like an earthquake at what he finds."],
        ["A hand the size of a feed bucket pushes %n down onto a hay bale, ass up, and holds them there.",
         "He hooks one horn under %n's arm and tips them over the fence rail like a sack of feed."],
      ],
      in: [
        ["He mounts and pushes his enormous %c cock into %n's %h, slow, impossibly deep, while %n claws at the hay.",
         "The minotaur drives into %n's %h with a bellow, stretching them wider than anything ever has, and keeps going."],
        ["He floods %n so full their belly rounds out, holds them there snorting, and then mounts them again before they've stopped shaking.",
         "Two loads, each one enough to swell %n's belly, and he licks the back of their neck between them like a bull with a cow."],
      ],
      over: [["The minotaur ruts between %n's thighs and paints the hay bale and their back with an enormous load."]],
      end: ["%n is left over the hay bale with a belly swollen by %ml of minotaur, and the gate's shut behind them when they finally crawl out.",
            "The minotaur wanders back to the barn. %n lies in the hay for a long while, %ml heavier, before they can stand."],
      endOver: ["%n is left plastered in %ml of minotaur and smelling like the back paddock."],
    },
    werewolf: {
      beats: [
        ["The moon's full and fat over the woods. %n shouldn't be out here. A howl, very close, says so.",
         "%n takes the short cut through the trees on a full moon, and something big starts following them."],
        ["He comes out of the dark on all fours and rises on two: grey, huge, shaggy, eyes like coins, and his ears go flat as he scents %n.",
         "The werewolf circles once and then knocks %n flat in the leaves, nose buried in their neck, a growl rumbling through both of them."],
        ["He flips %n onto their belly and hauls their hips up, and the moonlight shows exactly how ready he is.",
         "Pinned under a paw the size of a shovel, %n can feel his %c cock hard against their thigh."],
      ],
      in: [
        ["He mounts and drives into %n's %h like a beast, which he is, faster and faster, until the knot slams in and ties them under the moon.",
         "He takes %n's %h in quick savage thrusts, howling, and knots them so tight they couldn't run if they wanted to."],
        ["Tied, he pumps load after load into %n and howls at the moon, and when the knot slips he takes them again.",
         "Three times before moonset, each one knotted, each one leaving %n fuller and more his."],
      ],
      over: [["He ruts between %n's thighs till he howls, and paints their back silver in the moonlight."]],
      end: ["By dawn the wolf is a man again, asleep in the leaves, and %n limps home with %ml of werewolf knotted into their %h.",
            "%n wakes in the leaves at sunrise, alone, belly round with %ml, a bite mark on their shoulder."],
      endOver: ["%n gets home at dawn with %ml of werewolf dried silver on their back and leaves in their hair."],
    },
    foxden: {
      beats: [
        ["A ribbon on a hedge, then another, then a third, and %n follows them right into a burrow that opens up into a cosy den.",
         "%n hears giggling in the bracken and finds a hole that's far too big for a fox. Two red tails disappear into it."],
        ["The fox brothers are grinning, red-furred, quick, with clever paws and very bad intentions. They pull %n in and spin them round between them.",
         "Two fox-men, then three, then four, all brothers, all wearing the same sly grin, and they've got feathers."],
        ["They tickle %n till they can't breathe for laughing, feet, ribs, under the arms, until %n's helpless and squirming on the den floor.",
         "The brothers hold %n down and tease them with the feathers until %n is giggling, then moaning, then begging."],
      ],
      in: [
        ["Then they take turns. Each fox mounts %n's %h quick and clever, knots them, and the next one tickles them while they wait.",
         "One at a time the fox brothers knot %n's %h, and the ones waiting keep the feathers going so %n never stops squirming."],
        ["By the last brother %n can't tell if they're laughing or cumming, and the foxes think that's the funniest thing in the world.",
         "Four knots, four ties, and the den smells of fox for a week."],
      ],
      over: [["The fox brothers finish over %n, cackling, and tickle them all the while."]],
      end: ["The foxes push %n out of the den at last, giggly and stuffed with %ml of fox, feathers stuck to every sticky inch.",
            "%n crawls out of the den with %ml of fox brothers inside and a feather in their hair. The giggling follows them halfway home."],
      endOver: ["%n escapes the den tickled breathless and glazed with %ml of fox."],
    },
    lionpride: {
      beats: [
        ["Out on the warm rocks past the orchard, the pride of lion-folk is sunning itself, and the lionesses lift their heads as %n wanders by.",
         "%n climbs the rocks to look at the view and finds a lion-woman looking back, and then three more."],
        ["The lionesses herd %n up onto the flat rock where the pride's lion-man lies, huge, golden, maned, lazily licking a paw.",
         "A lioness takes %n by the scruff, gentle as anythin', and carries them up to the lion."],
        ["He rolls to his feet and stretches, and two of the lionesses hold %n down on the warm stone for him.",
         "The lion sniffs %n over, rumbles approval, and the lionesses pin %n flat with their paws."],
      ],
      in: [
        ["He covers %n and takes their %h in short fierce thrusts, the barbs on his %c cock raking on every pull back, and bites the back of %n's neck.",
         "The lion mounts and ruts %n's %h like it's mating season on the plains, quick and barbed, and roars when he finishes."],
        ["Then he rests a while in the sun, and mounts them again, and the lionesses purr approvingly each time.",
         "Three times in an afternoon, the way lions do, and the lionesses lick %n clean between."],
      ],
      over: [["The lion ruts between %n's thighs and finishes across their back, roaring at the sky."]],
      end: ["The pride lets %n go at sundown, warm from the rocks and stuffed with %ml of lion, scratches on their shoulders.",
            "%n climbs down off the rocks with %ml of lion in their %h, licked clean by the lionesses and very sleepy."],
      endOver: ["%n leaves the rocks with %ml of lion drying on them and the lionesses still purring."],
    },
    ramstud: {
      beats: [
        ["The ram's paddock gate swings shut on %n's heels, and on the far side of it the ram lifts his curly head and stamps.",
         "%n climbs into the ram's paddock after a lost glove. The ram has other ideas about why they're there."],
        ["He's a ram-man, thick-necked, curled horns, a fleece across his chest, and he lowers his head and paws the ground at %n.",
         "He butts %n gently in the chest, then less gently, herding them back against the fence."],
        ["One more butt and %n is over the feed trough, and the ram's hands are on their hips.",
         "He pins %n against the fence with his horns either side of their head, breathing hard."],
      ],
      in: [
        ["He takes %n's %h in deep hard thrusts that rattle the fence, grunting, every one of them a little headbutt from behind.",
         "The ram ruts %n's %h like he's knocking down a gate, short and brutal and determined."],
        ["He finishes deep and stays, and then, because it's the season, he goes again.",
         "Twice, and he'd go a third time if the farmhand didn't come to see what the racket was."],
      ],
      over: [["The ram ruts against %n's thighs and splashes the trough and their back."]],
      end: ["%n climbs out of the ram's paddock with %ml of ram in their %h and fleece stuck to their back.",
            "The ram goes back to his hay, satisfied. %n limps off, %ml heavier and smelling of wool."],
      endOver: ["%n leaves the paddock with %ml of ram across their back and a bruise from the horns."],
    },
    studchair: {
      beats: [
        ["%n sits down in the padded chair in the breeding shed, and it tips back and the straps close: wrists, waist, ankles in the stirrups, wide.",
         "The breeding chair is upholstered in worn red leather and has stirrups. %n is buckled into it before they've finished reading the sign."],
        ["A board on the wall lists the afternoon's appointments. Five names. The first one's already knocking.",
         "The breeding girl checks %n's chart, adjusts the stirrups wider, and props a cushion under their hips."],
        ["\"Next,\" says the breeding girl, and the first stud walks in unbuckling.",
         "The studs come in one at a time, like at a doctor's, each with a little appointment card."],
      ],
      in: [
        ["One after another, each stud steps up between the stirrups and breeds %n's %h, finishing deep, and the breeding girl ticks them off.",
         "Five studs, five %c cocks, five loads deep in %n's %h, while the chair keeps their hips tipped up so it all stays."],
        ["Between each one the breeding girl pats %n's belly and writes the time down.",
         "When the last one's done, the chair stays tilted back for an hour, and %n can feel all of it settling."],
      ],
      over: [["The studs finish across %n's belly one by one, and the breeding girl tuts at the waste."]],
      end: ["The straps open at last. %n is unbuckled with %ml in their %h, an appointment card for a scan in two weeks.",
            "%n climbs out of the breeding chair, %ml heavier, and the breeding girl hands them a lollipop for being good."],
      endOver: ["%n is unbuckled glazed with %ml across their belly and an appointment to try again tomorrow."],
    },
    clutch: {
      beats: [
        ["The pond's warm today, warm as a bath, and %n wades in to their waist before something smooth wraps round their ankle.",
         "%n kneels at the pond's edge for a drink and a slick grey arm rises out of the water and pulls them in."],
        ["It's big, soft, many-armed, and it holds %n floating on their back in the warm water, gently, like a hammock.",
         "Under the water, more arms: one round their waist, two round their thighs, easing them apart."],
        ["Something long and smooth and tapered slides up between %n's legs, nuzzling, searching.",
         "The thing hums, a deep pleased vibration through the water, and its ovipositor finds %n."],
      ],
      in: [
        ["It slides into %n's %h and starts to pulse, and egg after egg pushes into them, round and heavy and warm.",
         "The ovipositor fills %n's %h, and %n can feel each egg travel down it and settle inside, one, then another, then another."],
        ["It strokes their swelling belly with its arms while it lays, slow and patient, until %n is round and full.",
         "When it's done it seals them with something warm and sticky, so nothing comes out before it's time."],
      ],
      over: [["It lays its eggs in the warm water against %n's belly and coats them in jelly instead."]],
      end: ["The thing lets %n drift to the shallows, belly round and heavy with a clutch of %x eggs, and slides back into the deep.",
            "%n crawls out of the pond with %x eggs inside, belly heavy and gently shifting, smelling of warm water."],
      endOver: ["%n wades out of the pond covered in warm jelly and smelling of pondweed."],
    },
  });

  const BATCH2_LINES = {
    goblinmarket: {
      beats: [
        ["Goblin hands haul %n up onto an upturned crate in the middle of the goblin market, and a goblin auctioneer bangs a pan with a spoon.",
         "%n is led into the goblin market on a rope and stood on the selling block between a cage of chickens and a barrel of pickled eggs."],
        ["\"Fine big beast! Good teeth! Fat in the right places!\" The auctioneer pokes %n everywhere he mentions.",
         "{t}The auctioneer hefts %n's tits one at a time. \"Milker! Look at that! Milker!\"",
         "{c}The auctioneer lifts %n's cock on a stick so the crowd can see. \"Breeder! Bids!\"",
         "Goblins crowd the block, squeezing, prodding, sniffing, one of them trying %n's teeth with a coin."],
        ["The bidding goes wild: a bag of buttons, a goat, three shiny spoons and somebody's grandmother, and the hammer comes down.",
         "Sold, for a sack of turnips and a hat. The winning goblin climbs up and puts the hat on %n."],
      ],
      end: ["Somebody on the farm buys %n back for two pies before nightfall, still wearing the goblin's hat.",
            "%n is ransomed back to the farm by sundown for a sack of carrots, sticky with goblin handprints."],
    },
    goblincart: {
      beats: [
        ["Ropes, lots of them, badly tied but very many, and %n is lashed spread-eagled to the bed of a rickety goblin cart.",
         "The goblins roll %n onto a wooden cart and tie them down with every bit of string they own."],
        ["Then the parade: round and round the goblin camp, goblins banging pots, others riding on %n's belly like a float.",
         "The cart bumps over every rock in the camp while goblins throw muck and flowers in equal measure."],
        ["Every lap, the cart stops and anyone who wants a feel gets one.",
         "{t}Goblins climb up to bounce %n's tits and cheer.",
         "{c}A goblin ties a ribbon round %n's cock and declares it a prize.",
         "Muck flies, flowers fly, and %n gets thoroughly decorated."],
      ],
      end: ["The cart tips %n off at the edge of the farm, covered in muck and flowers and goblin fingerprints.",
            "The goblins untie %n when the parade's over, mostly, and they hobble home with string still round one ankle."],
    },
    shrine: {
      beats: [
        ["A ring of standing stones in the orchard, and in the middle a mossy shrine heaped with offerings: eggs, milk, little clay bellies.",
         "%n finds the old fertility shrine behind the orchard. Incense is burning. Nobody lit it."],
        ["The smoke is sweet and thick, and every breath of it warms %n somewhere low, and lower.",
         "%n kneels without meaning to. The incense curls round them like hands and settles in their belly."],
        ["The warmth spreads and blooms. Their belly tightens, empty and wanting, aching to be filled.",
         "{v}%n's womb throbs in time with the incense smoke, empty and hungry.",
         "Their skin flushes and their thighs press together. Whatever the shrine's charm is, it's working."],
      ],
      end: ["%n stumbles out of the stone ring in heat, ripe, achin' and desperate to be bred.",
            "The incense burns out. %n leaves the shrine flushed and aching, their belly crying out for a stud."],
    },
    buttermill: {
      beats: [
        ["The dairy girl buckles %n into the harness of the old butter churn, like a pony at a mill, and gives the plunger a pat.",
         "%n is strapped to the arm of the big butter churn, and the dairy girl tips in a bucket of fresh cream."],
        ["Round and round, pushing the arm, while the churn goes thump-thump and cream slops over the top and onto %n.",
         "%n churns until the cream turns thick and yellow, splashing them to the chest every time the plunger drops."],
        ["When it's butter, the dairy girl scoops it out and spreads the first pat on %n's lips. \"Taste your work.\"",
         "{t}The dairy girl smears fresh butter on %n's tits, laughing, and polishes them till they shine.",
         "The leftover buttermilk goes over %n's head, and the dairy girl calls it the finishin' rinse."],
      ],
      end: ["%n is unbuckled greasy with butter and dripping buttermilk, smelling like the best breakfast on the farm.",
            "%n comes off the churn slick with butter from collar to knees, and the barn cats follow them for an hour."],
    },
    syruptap: {
      beats: [
        ["Out in the maple grove the taps are running and the buckets are full, and somebody ties %n to the biggest tree.",
         "%n is lashed to a maple with a tap in it, right under the bucket, and someone kicks the bucket's peg loose."],
        ["Warm maple syrup glugs down over %n's head and keeps coming, slow and amber and endless.",
         "The bucket tips and syrup sheets over %n, sticky and sweet, gluing their hair to their face."],
        ["Then the bees find them. And then the farmhands find them, and they're hungrier than the bees.",
         "{t}A farmhand licks the syrup off %n's tits, slow, savouring every bit.",
         "{c}Somebody kneels and licks the syrup off %n's cock till it's shining and twitching.",
         "The farmhands take turns licking syrup off %n, taking their time about it."],
      ],
      end: ["%n is cut loose glazed amber and sticky from scalp to toes, and they'll be finding syrup for days.",
            "%n peels off the maple tree with a sticky rip, licked clean in places and lacquered everywhere else."],
    },
    pieeat: {
      beats: [
        ["A long table at the fair, a row of pies, and a farmhand ties %n's hands behind their back. \"Pie-eatin' contest. On your marks.\"",
         "%n is entered in the pie contest without being asked, hands tied, kneeling in front of a cream pie the size of a cartwheel."],
        ["\"GO!\" and a hand on the back of %n's head pushes their face into the pie.",
         "Face first into the first pie, then the second, a hand in their hair making sure they get all of it."],
        ["Cream up the nose, berries in the ears, crust everywhere, and the crowd cheering every time %n comes up for air.",
         "{t}The pies slide off %n's face onto their tits and down their front, and the crowd roars.",
         "Somebody adds a pie on top of %n's head for good measure."],
      ],
      end: ["%n doesn't win. They come up dripping cream and berries, last place, and the crowd gives them a ribbon anyway.",
            "The judge declares %n the messiest contestant in the history of the fair. They have the cream in their hair to prove it."],
    },
    mudslide: {
      beats: [
        ["The bottom field's turned into one long slick slope of mud, and somebody at the top gives %n a cheerful shove.",
         "%n slips at the top of the muddy bank and goes down it on their back, faster and faster."],
        ["Mud sprays up over %n's face, into their mouth, down everything, as they skid all the way down.",
         "They hit the bottom with a splash in a pool of mud as deep as a bath."],
        ["The farmhands at the bottom haul %n out and send them back up for another go. And another.",
         "{t}%n's tits are slick brown with mud, and a farmhand wipes a clean stripe across them, grinning.",
         "By the third slide there isn't a clean inch of %n left."],
      ],
      end: ["%n crawls out of the mud pool brown from head to heel, and the farmhands hose them down, eventually.",
            "%n is caked in mud from the slide, and the pigs look at them like one of their own."],
    },
    squeezechute: {
      beats: [
        ["%n walks into the cattle chute and the side panels squeeze in, snug, firm, until they can't turn, can't step back, can't do anything at all.",
         "The head gate drops on %n's neck and the squeeze panels close, and they're held like a heifer at the vet's.",
         "The chute closes on %n with a hiss of air, and the head gate catches their neck. They're held like any other beast waitin' on the vet."],
        ["Hands come through the bars from both sides. Ear tags checked. Teeth checked. Everything else checked.",
         "{t}A hand through the bars squeezes %n's tits like udders, judging.",
         "{v}A gloved hand slips between %n's legs through the gap and checks how ready they are.",
         "{c}A hand through the bars weighs %n's balls and gives them a pat."],
        ["The squeeze tightens another notch, and somebody marks a number on %n's rump with a crayon.",
         "They're left squeezed in the chute for a while, just for practice, while the farmhands chat."],
      ],
      end: ["The panels release and %n stumbles out of the chute, handled, numbered and very thoroughly checked.",
            "The head gate lifts. %n walks out of the chute with a crayon number on their ass and their knees wobbling."],
    },
    twine: {
      beats: [
        ["Up in the hayloft somebody's waiting with a ball of orange baler twine and a very patient look.",
         "%n climbs into the hayloft to nap and wakes up with their wrists already tied."],
        ["Loop after loop: wrists to elbows, elbows to back, a harness round the chest, ankles to thighs, every knot snug.",
         "{t}The twine goes over and under %n's tits in a tight diamond, framing them till they swell.",
         "{c}A loop of twine goes round %n's cock and balls and gets tied off with a neat bow."],
        ["Then they're hauled up off the hay by a rope over the beam, slowly turning, and left to hang.",
         "They're left trussed on the hay bales like a parcel, every wriggle pulling a knot tighter."],
      ],
      end: ["The knots come undone one by one at last, leaving %n patterned with red twine marks for the rest of the day.",
            "%n is lowered and untied, criss-crossed in rope marks, bits of hay stuck everywhere."],
    },
    yoke: {
      beats: [
        ["The milkmaid's yoke drops across %n's shoulders and the wrist cuffs click shut at either end, and a full bucket of milk is hung on each side.",
         "A wooden yoke is locked across %n's neck and wrists and two sloshing pails hung from it. \"Up to the house with those.\""],
        ["%n staggers across the yard with the pails swinging, milk slopping over the rims and down their legs.",
         "Every step sloshes milk onto %n's thighs. The farmhands watch from the fence and place bets."],
        ["Halfway there they stumble, and the pails tip, and all of it goes down %n's front.",
         "{t}Milk soaks %n's tits and drips off their nipples while they try to stay upright.",
         "When they finally get there, the cook sends them back for more."],
      ],
      end: ["The yoke's unlocked at last and %n stands there soaked in milk, shoulders aching, every fly on the farm interested.",
            "%n is let out of the yoke dripping milk from neck to knees, and the cook doesn't say thank you."],
    },
    ponycart: {
      beats: [
        ["A bridle, a bit, blinkers, a harness, and %n is buckled between the shafts of the pony cart before they've worked out what's happening.",
         "The stable girl backs %n into the cart shafts like a pony, buckles them in and slips the bit between their teeth."],
        ["A flick of the reins. \"Walk on.\" %n pulls the cart round the farmyard while the stable girl rides in it.",
         "A crop taps %n's flank, and they're off round the paddock with a passenger, the cart bouncing behind them."],
        ["\"Trot!\" and the crop again. %n's breath steams around the bit and drool runs down their chin.",
         "{t}The harness straps cross over %n's tits and bounce them with every trotting step.",
         "{c}The harness has a ring for %n's cock, and it bobs with every step, and the stable girl thinks that's very funny.",
         "Round the yard, down the lane, up the hill. The stable girl isn't in any hurry."],
      ],
      end: ["Back in the yard, the stable girl unbuckles %n, rubs them down with a towel and gives them an apple.",
            "%n is led back to the stable, lathered and drooling round the bit, and gets a sugar lump for being a good pony."],
    },
  };
  const batch2Line = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, BATCH2_LINES[kind][key]), mn, v);
  function batch2Run(mn, kind, hold, where, after){
    trapHold(mn, hold, where);
    trapRun(mn, kind, BATCH2_LINES[kind].beats, () => {
      try { if (after) after(); } catch(e){ warn("trap:", e); }
      emote(TRAP_KINDS[kind].icon+" "+batch2Line(kind, "end", mn), mn);
    });
  }
  Object.assign(MORE_TRAPS, {
    goblinmarket(mn){ batch2Run(mn, "goblinmarket", 5, "the goblin market", () => { arouse(mn, 20); face(mn, "edged", 60); }); },
    goblincart(mn){ batch2Run(mn, "goblincart", 6, "the goblin cart", () => { arouse(mn, 25); }); },
    shrine(mn){ batch2Run(mn, "shrine", 4, "the fertility shrine", () => {
      const p = prodOf(mn);
      if (!limitBlocks(mn, "heat")) startHeat(mn, BOTMN(), 2);
      if (p && !limitBlocks(mn, "breed")) addBoost(p, "fert", 24*3600000, 1);
      arouse(mn, 50); face(mn, "edged", 120);
    }); },
    buttermill(mn){ batch2Run(mn, "buttermill", 5, "the butter churn", () => {}); },
    syruptap(mn){ batch2Run(mn, "syruptap", 5, "the maple grove", () => { arouse(mn, 30); }); },
    pieeat(mn){ batch2Run(mn, "pieeat", 4, "the pie contest", () => {}); },
    mudslide(mn){ batch2Run(mn, "mudslide", 4, "the mudslide", () => { const r = rec(mn); r.muddy = Date.now(); }); },
    squeezechute(mn){ batch2Run(mn, "squeezechute", 5, "the squeeze chute", () => { arouse(mn, 15); }); },
    twine(mn){ batch2Run(mn, "twine", 6, "the hayloft", () => { arouse(mn, 25); }); },
    yoke(mn){ batch2Run(mn, "yoke", 5, "the milkmaid's yoke", () => {}); },
    ponycart(mn){ batch2Run(mn, "ponycart", 6, "the pony cart", () => { arouse(mn, 20); }); },
  });
  // the mess each leaves (10u7-traps-3.js)
  Object.assign(MESS_BY_TRAP, {
    goblinraid: ["cum", ["tummy", "face"]], goblinpit: ["cum", ["tummy"]], warband: ["cum", ["tummy"]], minotaur: ["cum", ["tummy", "chest"]],
    werewolf: ["cum", ["tummy"]], foxden: ["cum", ["tummy"]], lionpride: ["cum", ["tummy"]], ramstud: ["cum", ["tummy"]], studchair: ["cum", ["tummy"]],
    clutch: ["slime", ["tummy"]], goblincart: ["mud", ["chest", "tummy"]],
    buttermill: ["cream", ["face", "chest", "tummy"]], syruptap: ["maple", ["face", "chest", "tummy"]], pieeat: ["cream", ["face", "forehead", "chest"]],
    mudslide: ["mud", ["face", "chest", "tummy"]], yoke: ["milk", ["chest", "tummy"]],
  });
  // the places they belong to (10ua-trap-themes.js), and a new one: the goblin camp
  TRAP_THEMES.goblin = { label: "the goblin camp", near: /goblin|cave|camp|orc/, kinds: ["goblinraid", "goblinpit", "goblinmarket", "goblincart", "warband"] };
  for (const [place, kinds] of Object.entries({
    pasture: ["minotaur", "ramstud", "mudslide", "ponycart", "goblinraid", "yoke"], wildlife: ["werewolf", "foxden", "lionpride", "clutch", "shrine", "goblinraid"],
    stalls: ["studchair", "squeezechute", "minotaur", "buttermill"], trough: ["buttermill", "syruptap", "pieeat"], cabin: ["twine", "shrine", "werewolf"],
    stockade: ["goblinmarket", "pieeat", "squeezechute"], kennel: ["werewolf", "foxden"], pigsty: ["mudslide", "goblincart"], bench: ["studchair", "twine"],
    office: ["goblinmarket"], glory: ["studchair"],
  })) for (const k of kinds) if (TRAP_THEMES[place] && !TRAP_THEMES[place].kinds.includes(k)) TRAP_THEMES[place].kinds.push(k);
