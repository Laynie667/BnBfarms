  /* WHAT'S IN THIS FILE (10y9f-lines-farm-wider.js)
     More for the farm's own goings-on: layin' at the nest, farrowin', the belly showin', the scents, the trough
     leeches, the well, the mystery box and the livin' suit. Thin pools get fuller, and a pool that was all about one
     kind of body gets lines for the others ({v} pussy, {nv} none, {c} cock, {t} tits, {nt} flat), so nobody is read
     a line meant for somebody else with only the words swapped. Nothin' here changes what any of it does.
     %n name · %c the helper, the sire, the item or the size word · %h hole · %ml how much · %x how many
  */
  (function(){
    const more = (pool, lines) => { if (Array.isArray(pool)) pool.push(...lines); };
    const B = BROOD_LINES, C = CURSE_LINES;

    // ── layin' at the nest ──
    more(B.layStart, [
      "%n circles the nest twice like a hen and sinks into the straw, thighs spread, both hands under a belly that's gone hard and low. Here it comes.",
      "%n kneels up in the nest, gripping the rail, and rocks. Somethin' heavy inside them has started to move toward the way out."]);
    more(B.layHelp, [
      "%c sits behind %n and lets them lean back against their chest, arms wrapped round that big belly. \"Push with me. Now.\"",
      "%c kneels between %n's knees with a soft cloth and a softer voice. \"You're doin' so good. Let the first one come.\""]);
    more(B.layFirst, [
      "{nv}The first egg presses at %n's ass from the inside, stretches their ring wide and hot round its fattest part, and slides out with a wet pop into the straw.",
      "{nv}%n bears down, grunting, and their hole opens round somethin' smooth and round and much too big, wider, wider, and then it's out and they gasp.",
      "%n pushes till they shake. The egg shows, slick and pale, slips back, shows again, and finally drops free with a sound like a kiss."]);
    more(B.layMid, [
      "The eggs come in a slow string now, one after another, each one easier and each one makin' %n moan louder than the last.",
      "%n's lost the count. They just push when their body says push, and the clutch piles up warm and glistenin' beneath them."]);
    more(B.layHelpMid, [
      "%c strokes %n's belly from the top down, slow, coaxin', and another egg rolls out into the straw with every pass.",
      "\"Look at that. Look how many,\" %c murmurs, and kisses the back of %n's neck while they push the next one out."]);
    more(B.layHuge, [
      "%n's lost track of everything but the next push. The eggs keep comin', the nest keeps fillin', and they're makin' noises they'll be embarrassed about later.",
      "It's like the clutch has no bottom. %n lays, rests a breath, lays again, belly shrinkin' a little at a time and the pile in the straw growin' huge."]);
    more(B.layEnd, [
      "One last push and the last egg's out. %x of them, warm and slick in the straw, and %n slumped over them with a dazed little smile.",
      "%x eggs, and the last one was the biggest. %n sags in the nest, belly soft and empty, breathin' like they've run a mile."]);
    more(B.layEndBig, [
      "%x eggs heaped in the nest, and %n lyin' on their side next to them, legs still shakin', a hand cupped over their emptied belly.",
      "It took everything %n had: %x eggs, and a nest that'll need more straw. They can't stop touchin' them."]);
    more(B.layEndHuge, [
      "%x eggs. The nest's overflowin' and so's %n: slime, tears, a dazed grin. They lie back in the middle of it all and stare at the rafters, empty and wonderin'.",
      "%n lays the last of %x and goes limp. Somebody has to bring a wheelbarrow for the clutch. Somebody else brings %n a blanket."]);

    // ── farrowin' ──
    more(B.farrowStart, [
      "%n's water goes in the middle of the aisle, and their knees go with it. The farm girl gets them to the farrowin' pen just in time.",
      "%n's belly drops and hardens all at once, and they go down on all fours in the straw with a long low moan. It's time."]);
    more(B.farrowCrown, [
      "%n pushes, rests, pushes, and the first of the litter slips out into the straw on a warm wet rush, kickin' already.",
      "The first one comes with a long, rising cry from %n and a gush that soaks the straw. The farm girl catches it, rubs it dry, and holds it up for them to see."]);
    more(B.farrowMid, [
      "{t}%n's tits are leakin' in steady streams now, and every new arrival roots its way toward them before %n's even finished pushin'.",
      "{nt}%n's chest is wet and achin', milk beadin' up and runnin' from both nipples, and the little ones already born are rootin' toward it.",
      "%n pushes through another, and another, sweat-soaked, lowin', the straw round them filling with squirmin' little bodies."]);
    more(B.farrowHuge, [
      "The litter goes on and on. %n is past countin', past talkin', just a body doin' what bodies do while the farm girl keeps catchin'.",
      "Another, and another. %n's belly is half what it was and still there's movement under the skin, and still they push."]);
    more(B.farrowEnd, [
      "{t}The last of %x (%ml), sired by %c, slides out into the straw. The whole litter crowds onto %n's leakin' tits, and %n lies back and lets them.",
      "{nt}The last of %x (%ml), sired by %c, slides out into the straw. %n's chest is swollen and leakin', and the litter latches on, greedy.",
      "%x born (%ml), every one of them %c's. %n lies in the warm straw with the litter tucked round them, too tired to lift their head and too happy to want to."]);

    // ── the belly showin' ──
    more(B.belly1, [
      "%n's belly's gone soft and round low down, the way a mare's does a few weeks along.",
      "There's a sweet little swell to %n's middle now, and they keep restin' a hand on it."]);
    more(B.belly2, [
      "%n's belly's heavy enough now to sway when they walk, and they've started leanin' back a little to carry it.",
      "%n's gone round and full in the middle, belly pushin' out tight against anything they wear."]);
    more(B.belly3, [
      "%n's belly is huge and tight and shinin', and it moves, now and then, all on its own.",
      "%n's carryin' so much now they walk with their knees apart and a hand pressed to the small of their back."]);
    more(B.belly4, [
      "%n's belly is so big it rests on their thighs when they sit, and they need help gettin' up. Somethin' in there shifts constantly.",
      "%n is enormous, belly swollen out past their knees, waddlin', groanin', and very, very full."]);
    more(B.bellySeen, [
      "%n's belly is so round and full you can't help starin'. It moves while you watch.",
      "You find yourself wonderin' how %n can still walk, carryin' a belly like that."]);

    // ── the scents ──
    more(B.scent_wolves, [
      "Somewhere out past the fence a wolf lifts its head, sniffs, and starts to trot. Then another. %n smells like supper.",
      "The yard dogs whine and press against the barn door. Out in the dark, the pack has caught %n's scent."]);
    more(B.scent_stallion, [
      "In the stud barn a door shudders on its hinges. The stallion's caught wind of %n, and he's had enough of waitin'.",
      "A long ringing neigh carries across the farm. The stallion knows where %n is, and he's comin'."]);
    more(B.scent_boar, [
      "The sty goes quiet. Then the boar squeals and hits the rails, and the rails give. He's smelled %n.",
      "Bristles, tusks and a nose like a bloodhound's: the boar's out, snufflin' along %n's trail."]);

    // ── the trough leeches ──
    more(B.leeches[0], [
      "%n dips a hand into the trough to splash their face. Somethin' slick and black curls round their wrist and doesn't let go.",
      "The surface of the trough bulges. A fat leech slips over the rim and onto %n before they can step back."]);
    more(B.leeches[1], [
      "{nt}Two fat leeches find %n's nipples and fasten on, mouths ringed round them, and start to suck, slow and patient, till they're puffy and tender.",
      "{t}Two leeches seal over %n's teats and start to drink, long hard pulls, and %n gasps at how good the first one feels.",
      "The leeches latch on wherever %n is warmest and settle in to drink, pulsin' gently as they swell."]);
    more(B.leeches[2], [
      "{c}A leech slides up %n's thigh, finds the head of their cock, and wraps its soft mouth round it. It doesn't bite. It suckles.",
      "{v}A leech slides up %n's thigh and finds their clit, and closes its soft round mouth over it, and pulls, and %n's knees fold.",
      "One slithers between %n's legs, nosin' for the softest place it can find, and fastens there with a slow wet suck."]);
    more(B.leeches[3], [
      "{nt}%n kneels by the trough with a leech on each nipple and another between their legs, all three swellin' fat on them, and they can't make themselves pull a single one off.",
      "The leeches drink and drink, pulsin' in time, and %n sways on their knees, flushed and gasping, milked by mouths with no faces."]);
    more(B.leechesEnd, [
      "{nt}The one between %n's legs drops off fat and sated. The two on their chest stay latched, swollen and heavy: %ml gone into them, and they want more.",
      "{nt}%n gets their breath back with two plump leeches still hangin' off their nipples, warm and full. %ml, and countin'.",
      "The last leech rolls off %n into the trough, round as a plum, and %n slumps against the rail, drained of %ml and tinglin' all over."]);

    // ── the well ──
    more(B.wellGrab, [
      "%n drops a pebble down the well to hear it splash. No splash. Instead, somethin' wet and quick comes up after it.",
      "The bucket comes up too heavy and too soon, and it isn't water in it. It's an arm, and it's got %n's wrist."]);
    more(B.wellDeep, [
      "Down here the dark is total, and warm, and wet, and alive. Coils slide over %n from every side, curious, unhurried, explorin' every inch.",
      "The shaft echoes %n's gasps back up at them. Somethin' holds them in the black, turnin' them slowly, as if lookin' them over by touch."]);

    // ── the mystery box ──
    more(C.open_plug, [
      "%n tips the box and a glossy black plug rolls into their palm, warm as skin. It squirms. Then it's gone, and %n's eyes go very wide.",
      "The box is lined with red velvet and holds a single plug, polished to a shine. It's seated in %n before they've finished sayin' \"oh, that's cute\"."]);
    more(C.open_belt, [
      "A slim belt of linked silver lies coiled in the box like a sleeping snake. It wakes. It wraps. It locks.",
      "%n lifts a jewelled belt from the box to admire it, and it slithers round their hips and clicks shut with a sound like a promise."]);
    more(C.open_cups, [
      "{nt}Two silver cups leap out of the box and seal over %n's nipples, suckin' them up into the cold metal with a greedy little kiss.",
      "{t}A pair of silver milkmaid's cups spring out and latch onto %n's tits before the lid's even fallen."]);
    more(C.open_funnel, [
      "A gold funnel in the box, polished bright. %n leans in to look, and it leans in back, and buckles itself into their mouth.",
      "The funnel in the box has a strap and a purpose. It finds %n's open mouth on the first try."]);
    more(C.open_hobble, [
      "Two pretty anklets with a little chain between them. %n holds them up, and they drop and snap round both ankles at once.",
      "The box tips over and two cuffs roll out, find %n's ankles, and close. Their stride just got a great deal shorter."]);
    more(C.tick_plug, [
      "There's a slow, thick swell inside %n's %h, and they have to stop and grip somethin' while it settles. Bigger again.",
      "%n's %h clenches round the plug as it fattens another size, and a little whine escapes them before they can stop it."]);
    more(C.tick_belt, [
      "The belt purrs against you, slow, climbin', and you're right at the brink when it clicks off, smug as a cat.",
      "A long teasing hum from the belt, and then nothin'. It's waitin' for you to calm down so it can do it again."]);
    more(C.tick_cups, [
      "{nt}The cups suck hard at %n's nipples and %ml slides up into them. %n's chest is tight and tingly again almost at once.",
      "{t}The cups draw long and deep and %ml disappears into them. %n's tits fill right back up behind it, achin'."]);
    more(C.tick_funnel, [
      "The funnel tips another %ml down %n's throat. They swallow, gasping, and their belly sloshes when they shift.",
      "Warm and thick, %ml more, straight down. %n's belly is round as a melon and the funnel's still not finished."]);
    more(C.off, [
      "The %c lets go of %n with a little sigh and goes still, just a pretty thing on the ground now. %n wobbles.",
      "It's over. The %c slips off %n and lies there gleamin' innocently in the straw, like it never did a thing."]);

    // ── the livin' suit ──
    more(C.suitTrap[0], [
      "Somethin' glossy drips from a cobweb onto %n's knee and spreads into a little black disc, warm as a hand.",
      "%n sits on a bench and gets up with a black shiny patch stuck to the back of their thigh."]);
    more(C.suitTrap[1], [
      "It doesn't peel. It doesn't smear. It just grows, a hair at a time, and where it grows %n's skin goes warm and sensitive.",
      "%n picks at the edge of it. The edge moves away from their nail and settles a little further up their leg."]);
    more(C.suitTrap[2], [
      "The black creeps up %n's thigh in a slow glossy tide. It's warm. It's squeezing. It seems very pleased to meet them.",
      "Every brush of %n's hand only feeds it. It's the size of a dinner plate now and pulsin' gently."]);
    more(C.suit1, [
      "Black latex flows down to %n's toes and up to their hips, seamless and gleamin', and it hugs every step they take.",
      "%n's legs are sheathed in livin' black from hip to heel, warm and tight and alive, flexin' a little out of time with them."]);
    more(C.suit2, [
      "{nv}The suit seals over %n's hips and between their legs in one smooth sweep, and a soft fat root of it slides up their ass and settles, pulsin'.",
      "{v}The suit flows between %n's legs and seals, and two soft roots of it push in, front and back, slow and certain, and begin to throb.",
      "Black latex closes over %n's hips and groin in one glossy sweep, and somethin' warm and patient pushes up inside them to stay."]);
    more(C.suit3, [
      "{nt}It climbs %n's belly and spreads over their chest, cuppin', kneadin', and a soft wet mouth forms over each nipple and starts to suck.",
      "The suit closes over %n's chest and squeezes, slow and rhythmic, like a pair of hands that know exactly what they're doin'."]);
    more(C.suit4, [
      "The black runs down %n's arms and welds their fingers into smooth glossy mitts. Their hands are the suit's now.",
      "It sheathes %n's arms to the fingertips and folds their wrists together behind their back, gently, to show who's in charge."]);
    more(C.suit5, [
      "The last of it slides up over %n's chin and seals their lips with a glossy kiss, and a slim tongue of it presses inside. Only their eyes are their own now.",
      "It finishes the job: throat, jaw, mouth, a smooth gleamin' gag of itself. %n is all suit now, breathin' through it, held by it."]);
    more(C.suitFeed, [
      "The suit ripples over you, everywhere at once, and you shudder, and it drinks the shudder down.",
      "It squeezes you slow from head to toe, like a long hug that never ends, and you're so wet inside it."]);
    more(C.suitWalk, [
      "The suit decides it wants a walk. %n's legs agree before %n does.",
      "%n's feet carry them off toward somewhere the suit has in mind, and their protests come out muffled behind the latex."]);
    more(C.suitOff, [
      "The suit loosens all at once, peels away down %n's body like a shed skin, and slithers off into the shadows, sated.",
      "It's done with them. The latex splits, slides off, and leaves %n shiverin', pink and gleamin' with sweat in the open air."]);
    more(C.suitPeeled, [
      "Two farmhands and a lot of warm oil, and the suit finally gives %n up, strip by clingy strip, with a sulky wet sound.",
      "It doesn't want to go. It takes coaxin', soapin' and a firm hand, and the last bit lets go of %n with a reluctant pop."]);
  })();
