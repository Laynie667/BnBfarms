  /* WHAT'S IN THIS FILE (10z5o-trap-more-15.js)
     Each trap's own lines grown (10z5-trap-more.js): the injector (all four ways it catches somebody, every strength of
     dose, the shot goin' in, the second needle), the breedin' wheel (every spin, in or over), and the two beats of their
     own for the gas, the spray rack, the injector, the wheel and the thing in the water (10ue-trap-scenes.js).
     The wheel's spins: %i first/second/third · %c the cock that spin brought (canine, flared equine...) · %h the hole.
  */
  {
    const I = VARIANT_LINES.injector, P = (name, pool, l) => poolMore("injector", name, pool, l);

    // ── the four ways it catches you ──
    P("arm, caught", I.styles.arm[0], [
      "%n reaches for a bridle hangin' on a hook, and the hook folds down into a padded clamp and closes on their wrist, and a brass arm swings round from behind the post.",
      "Two jointed arms come out of the wall at hip height, quiet as cats, and hold %n by the waist, firm and polite, while a third lifts a syringe up into the lamplight.",
      "A plate in the floor clicks, and a cuff on a spring arm snaps round %n's ankle, and another round their knee, and somethin' with a needle rises out of the straw.",
      "%n leans on the stall partition and it leans back: a rubber-padded arm wraps their shoulders, snug as a hug, and the needle arm unfolds from behind it."]);
    P("arm, lined up", I.styles.arm[1], [
      "The arm presses a rubber thumb into the soft of %n's thigh, feelin' for the right spot, the way a vet feels a cow's flank before the jab.",
      "It holds the needle a hair from %n's skin and waits, ticking, till they've stopped squirmin', because it's in no hurry at all.",
      "A cold wet swab circles %n's hip, round and round, and the needle follows it in, closer every circle.",
      "%n tries to twist away and the arm just turns with them, patient as a dance partner, and the point stays exactly where it was."]);
    P("chair, caught", I.styles.chair[0], [
      "A bench along the wall turns out to have arms, and the arms turn out to have buckles, and %n's sat down and strapped in before they've finished sittin'.",
      "The floor tips %n backward into a padded chair that wasn't there a second ago, and straps whip round their thighs and spread them over the leg rests.",
      "%n sits on a hay bale to rest, and the hay bale is a chair under a sack, and it has a strap for every limb they've got.",
      "A leather seat drops out of the hayloft on chains, scoops %n up behind the knees, and buckles itself round them, swingin' gently, with a tray of glass rattlin' alongside."]);
    P("chair, lined up", I.styles.chair[1], [
      "The chair's arm picks a syringe off the tray, turns it in the lamplight like a jeweller, and puts it back, and picks a bigger one.",
      "Somethin' cold dabs the crease of %n's thigh, then the soft of their belly, then their neck, tryin' each one like a taster.",
      "The leg rests swing a little wider. A rubber finger pinches up a fold of skin high inside %n's thigh and holds it there, waitin' for the needle.",
      "The lamp angles itself down onto %n, bright and warm, and the needle comes down through the light, glintin', slow as honey."]);
    P("dart, caught", I.styles.dart[0], [
      "Thwip. A dart with pink feathers sticks quiverin' in %n's bum, and somewhere up in the rafters a little brass barrel swivels to watch.",
      "%n hears a soft click from the hayloft, turns, and takes the dart square in the hip instead of the back, which the trap seems fine with.",
      "A row of knotholes in the barn wall turns out to be a row of tubes, and one of them puffs, and %n's got a dart in the thigh.",
      "Somethin' stings %n in the soft of the arm, and they look down at a feathered dart and a glass barrel already drainin' into them."]);
    P("dart, lined up", I.styles.dart[1], [
      "%n's legs go heavy as wet sacks, and they sit down hard in the straw while the dart finishes its work, glug by glug.",
      "They pluck at it, but the barbs hold, and the tip's already made their fingers too lazy to pull.",
      "The first of it is somethin' to make them sleepy-soft, and %n sinks down onto their elbows, blinkin', while the rest goes in.",
      "A second dart thwips in an inch from the first, because the trap likes things even."]);
    P("collar, caught", I.styles.collar[0], [
      "A heavy steel collar drops from a hook in the rafters and snaps shut round %n's throat with a click like a gate latch.",
      "Somethin' cold slides round %n's neck from behind and locks, and they can feel little glass vials sittin' snug against their pulse.",
      "A loop of leather and brass falls over %n's head and cinches, and a ring of tiny needles inside it settles against their skin, cold as dew.",
      "The collar's hangin' on a peg like a horse's, and %n only touches it, and it's round their neck and buckled before they let go."]);
    P("collar, lined up", I.styles.collar[1], [
      "The collar warms against %n's neck, hummin', and a little needle presses just hard enough to say it's there.",
      "A gauge on the buckle ticks from EMPTY toward FULL, and the vials round it start to glow, one after another.",
      "It tightens, just a notch, so %n can feel their own heartbeat against the needles, and then it chooses one.",
      "%n swallows, and the collar feels it, and ticks faster, like it's excited."]);

    // ── how big a dose ──
    P("mild dose", I.fill[0], [
      "Just a sip in the barrel, pale and pearly, hardly worth the needle.",
      "It's half a thimble, no more, glintin' in the bottom of the glass.",
      "The barrel's mostly air and a little cloud of somethin' pink at the tip.",
      "A tiny dose, the kind for a first time. A taste of it. A start."]);
    P("strong dose", I.fill[1], [
      "The barrel fills to the line, thick and gold and warm, and then a little past it.",
      "It's a proper dose: a full glass, slow and syrupy, with bubbles rising through it.",
      "Two barrels side by side, both full, both cloudy, both meant for %n.",
      "The syringe is as long as a hand and full to the stopper, and the plunger's already pressin'."]);
    P("brutal dose", I.fill[2], [
      "It's a drench gun, the kind for a herd bull, and it's full to the top with somethin' thick and glowin'.",
      "The glass is as big as a milk bottle and it's sloshin', and the label just says ALL OF IT.",
      "Three syringes, each one bigger than the last, lined up on the tray. The trap picks up all three.",
      "The barrel's so full it bulges, and the needle's as long as %n's finger, and the stuff inside is pulsin' slow like it's alive."]);

    // ── the shot goin' in (before what it does) ──
    P("mild shot", I.open[0], [
      "A quick little prick and a cool trickle, and %n hardly feels it, and then they do.",
      "The needle slips in and out like a hummingbird, and leaves a warm drop behind.",
      "It's over before %n's done flinchin': a pinch, a push, and a tiny bead of warm under the skin.",
      "The point barely kisses them, and the little dose goes in sweet and easy."]);
    P("strong shot", I.open[1], [
      "The needle sinks deep and the plunger drives down steady, and %n feels it go in like warm honey through a straw.",
      "It goes in to the hilt and empties slow, and a warm swollen knot rises under the skin and starts to spread.",
      "%n gasps as the dose floods in, heavy and hot, and they can feel it travellin' through them like a drink of whiskey on an empty belly.",
      "The trap leans on the plunger, all of it, and the warmth goes off through %n in waves."]);
    P("brutal shot", I.open[2], [
      "The big needle punches in and the dose comes after it like a burst pipe, and %n's whole body goes hot from the inside out.",
      "It pumps and pumps. %n can feel the stuff sloshin' under their skin, a lump the size of a fist, then spreadin' everywhere at once.",
      "The trap empties all of it into %n, stroke after heavy stroke, and they sag in its grip, sweatin', as a dose for a stud bull starts to work on them.",
      "It goes in so deep and so much that %n's leg goes numb, then their belly goes hot, then their whole body hums like a struck bell."]);
    P("second needle", I.second, [
      "Then it picks up another syringe, a different colour, and sticks %n again before the first one's settled.",
      "There's a click, a whir, and a second needle comes round, like the trap's decided one thing at a time is no fun.",
      "It isn't finished. A second barrel slots into place, and %n feels a fresh prick an inch from the first.",
      "The tray turns. The trap selects another, holds it up to the light, nods to itself, and goes in again."]);

    // ── the breedin' wheel ──
    const WH = TRAPS3_LINES.wheel, Q = (name, pool, l) => poolMore("wheel", name, pool, l);
    Q("strap", WH.strap, [
      "%n trips on a hoop in the straw and it rises, and it's the rim of a great painted wheel, and cuffs snap round their wrists and ankles as it rights itself.",
      "The barn doors swing open on a fairground wheel, painted red and gold with a dozen breeds round the rim, and two farmhands buckle %n onto the middle of it, spread like a star.",
      "There's a crowd in the barn and a barker with a megaphone, and he points at %n and shouts \"VOLUNTEER!\" and the crowd carries them to the wheel.",
      "A big wooden wheel's been bolted to the barn wall, its rim painted with studs of every kind, and %n's strapped across the hub with their legs wide and their hips right at the height a stud would want.",
      "Straps at the wrists, the ankles and round the waist, and %n is buckled spread-eagle across the breedin' wheel, and the barker spins it once, just to hear the crowd gasp."]);
    Q("spin, in", WH.spinIn, [
      "%i spin: the wheel ticks round and round and settles on a stud with a %c cock, and he grins, grips the rim in both hands and takes %n's %h in one long push.",
      "%i stop. The arrow points at a %c stud, and the crowd chants \"BREED, BREED, BREED!\" while he does exactly that to %n's %h.",
      "The wheel clacks to a halt on %i spin, %n upside down, and a stud with a %c cock steps up anyway and fills their %h at that angle, which takes some doin'.",
      "%i spin brings a %c stud, big and pleased with himself, and he holds the wheel still with one hand and ruts %n's %h with the other on their hip till he's finished.",
      "Round and round, and %i stop lands on %c. He's quick, he's deep, and he leaves %n's %h full and drippin' when the barker shouts \"SPIN!\""]);
    Q("spin, over", WH.spinOver, [
      "%i spin: a stud with a %c cock steps up, finds every way in shut, swears, and strokes himself off across %n's belly instead.",
      "%i stop on the wheel: %c. There's no way in, so he takes himself in hand and paints %n's thighs and belly, and the wheel turns again.",
      "The wheel lands on %c for %i spin. He looks %n over, shrugs, and finishes all over their chest with a groan the crowd cheers.",
      "%i spin: a %c stud ruts between %n's thighs, can't get in, and spends himself over their belly in thick hot ropes.",
      "%i stop, %c, and the stud has to make do: he grinds against %n till he spills across their hips, and steps back for the next.",
      "Round goes the wheel, and %i stop is a %c stud who can't get in, so he makes very sure %n's wearin' it instead."]);
    Q("end", WH.end, [
      "The wheel creaks to its last stop. Three spins, three studs, %ml of three kinds of seed sloshin' in %n's %h, and they couldn't tell you which way is up.",
      "The barker calls \"THAT'S YOUR LOT!\" and the farmhands unbuckle %n from the wheel, dizzy and dripping, %ml packed into their %h.",
      "%n comes off the wheel bred three ways over, %ml in their %h, and has to sit down in the straw because the barn won't stop spinnin'.",
      "Three spins, three loads, %ml of it. %n's unstrapped with a round of applause and a rosette pinned on them that says BEST IN SHOW.",
      "They let %n down off the breedin' wheel full to the brim, %ml leakin' out of their %h in three colours, and the crowd goes home happy.",
      "The wheel stops, %n's let go, and %ml of mixed seed runs down their thighs as they wobble off, still seein' the rim go round."]);
    Q("end, over", WH.endOver, [
      "Three spins, three studs, and none of them got in, so %n's let down off the wheel striped and spattered from neck to knee.",
      "The wheel stops for good, and %n's unstrapped plastered with three studs' worth of seed and dizzy as a top.",
      "%n comes off the breedin' wheel painted three times over, drippin', and the barker gives them a consolation rosette.",
      "No way in, so the studs made do, and %n's let go glazed in three kinds of seed with the crowd still cheerin'.",
      "The wheel creaks to its last stop. %n's covered in other people's pleasure from collarbone to thighs, and the world's still spinnin'.",
      "They unbuckle %n, wobbly and marked all over, and three studs tip their hats to them on the way out."]);

    // ── the two beats of their own ──
    trapSceneMore("gas",
      ["Whatever colour it is, it's in %n's lungs now and spreadin', and they can taste it at the back of their throat every time they breathe.",
       "The cloud swirls round %n like it's got somewhere to be and %n's where it is, and it clings to their skin in a fine damp bloom.",
       "%n holds their breath as long as they can, cheeks puffed, and lets it go in a gasp, and the next breath is twice as deep.",
       "The fumes find the warm places first: the backs of the knees, the inside of the elbows, the crease of the thighs, and they linger there."],
      ["%n's sat on the floor now, blinkin' at the boards, and the boards are blinkin' back. Whatever it was, it's workin'.",
       "A farmhand comes in, sniffs once, backs out, and holds the door shut from outside, grinnin' through the crack.",
       "The cloud's thinnin' at the top but it's thick as ever round %n, pooled round them like they're the plug in a bath.",
       "The valve under the boards gives one last long hiss, and %n gets every bit of it full in the face."]);
    trapSceneMore("spray",
      ["The spouts work round %n like a farmhand groomin' a show animal, every side, every crease, nothin' missed.",
       "The arms turn %n round to face the wall, and the spouts get to work on their back and bum, and then turn them back again.",
       "%n tries to close their legs and a padded bar slides between their knees and stops them, so the spouts can reach.",
       "The rack lifts %n up on their toes, arms high, so there's nowhere on them that isn't facin' a nozzle."],
      ["%n's drippin' from the elbows and the chin and the tips of their hair, and the drain at their feet is gurglin' happily.",
       "The farmhands have come to lean on the rail and watch, and one of them gives the tank a friendly thump to keep it goin'.",
       "A spout runs out, coughs, and refills, and comes back round to %n like it's missed them.",
       "Everything on %n's slick and shinin' and runnin', and the spouts give them one more slow pass from head to toe to be sure."]);
    trapSceneMore("injector",
      ["The trap holds %n very still and very close, and they can hear it countin' under its breath, tick, tick, tick, like a clock.",
       "A gauge on the side of the post swings from EMPTY to READY, and somethin' inside the post starts to warm up.",
       "A little brass funnel lowers itself over the needle and drips somethin' sweet on the point, a kindness, like sugar on the medicine.",
       "%n can see themselves in the curve of the glass barrel, stretched and gold, with whatever's inside it waitin' to be part of them."],
      ["The warmth spreads past the place the needle went in, down one leg and up into the belly, and keeps goin'.",
       "%n's pulse is thumpin' in their ears, and every thump pushes the dose a little further in, a little deeper.",
       "{t}%n's tits throb in time with their heart, warm and heavy, like somethin's fillin' them from the inside.",
       "{v}A slow wet heat pools between %n's legs and doesn't drain away, and their pussy goes soft and swollen and slick.",
       "{c}%n's balls draw up tight and their cock stands without bein' asked, and both are achin' by the time the trap lets go."]);
    trapSceneMore("wheel",
      ["The barker leans on the wheel between spins and gives it a slow lazy turn so the crowd can see every angle of %n.",
       "Somebody in the front row's keepin' a tally on a slate: which stud, which spin, how long he lasted.",
       "%n's hair is hangin' down one minute and up the next, and the cuffs creak, and the rim clicks past breed after breed.",
       "The crowd's takin' bets on the next stop, coins slappin' on a hay bale, and %n's the only one who doesn't get a say."],
      ["Seed's runnin' out of %n in a slow circle now, and every turn of the wheel flings a few drops at the front row.",
       "The next stud's already waitin' by the wheel, stripped and ready, watchin' the arrow like a hawk.",
       "\"Faster!\" somebody hollers, and the barker obliges, and %n's world goes round in a blur of painted breeds and grinnin' faces.",
       "%n's lost count of the turns. They know what's in them, and they know there's more comin', and that's about all they know."]);
    trapSceneMore("tentacle",
      ["The water round %n churns white, and every arm of it's slidin', squeezin', explorin', learnin' every curve of them by touch.",
       "Suckers kiss their way up the backs of %n's thighs, one after another, wet little pulls that leave red rings behind.",
       "An arm coils round %n's throat, soft and loose, not chokin', just holdin', like a hand at the back of the neck.",
       "%n's lifted off their feet and turned in the water, slow, like somethin' admirin' what it's caught."],
      ["Slime froths round every place it's in them, and runs down %n's legs into the water in long pearly strings.",
       "{t}The suckers on %n's tits are pullin' in rhythm now, and their nipples are swollen red and stretched long in the cups.",
       "{c}The hollow arm round %n's cock squeezes and ripples root to tip, and it doesn't stop when they cum. It drinks it.",
       "Its arms tighten everywhere at once, a long full-body squeeze, and %n feels every inch of them filled and held and owned."]);
  }
