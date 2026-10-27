  /* WHAT'S IN THIS FILE (10w-trap-lines-more.js)
     A second helping of lines for every pool the traps, the thing in the water, the self-actin' toys and the
     parasite draw from, so the same trap reads different the tenth time. Nothin' here changes what anything does:
     each line is added to the pool it belongs to. %n name · %c cock or toy · %h hole · %ml how much · %x how many
  */
  (function(){
    const more = (pools, ...extra) => extra.forEach((lines, i) => { if (pools[i]) pools[i].push(...lines); });
    const T = TRAP_LINES, A = ANTHRO_LINES, Y = TOY_LINES, G = PARASITE_LINES;

    // ── the machine traps ──
    more(T.injector.beats,
      ["A floorboard clicks. Two rubber-padded jaws close on %n's upper arm, gentle and absolutely firm, and a third arm rises with a syringe as long as a hand.",
       "%n brushes a wire strung across the aisle. A chair folds up out of the floor behind their knees, sits them down, and straps them in. A tray of needles slides out beside it."],
      ["A drop wells up bright at the tip of the needle. The arm flicks the barrel twice with a steel finger, the way a vet does.",
       "It picks its spot on %n's hip, taps for a vein it doesn't need, and lines up, steady as a clock."]);
    T.injector.open.push("The needle goes into %n smooth and deep, the plunger sinks on its own, and the barrel empties to the last drop.",
                         "There's a sharp little sting in %n's hip, a cold bloom spreadin' under the skin, and the arm folds away with its barrel empty.");
    more(T.milker.milk,
      ["The straw under %n's chest lifts, and a pair of steel cups on long hoses snakes up and clamps onto their nipples, suckin' them deep in one gulp.",
       "A yoke swings shut on %n's neck, the stanchion kind, and a milkin' claw is swung in under them and fitted on with a hiss."],
      ["The pulsator finds its beat: squeeze, release, squeeze. %n's milk comes whether they want to give it or not, drummin' into the can.",
       "The line jumps and goes white. %n moans, long and low, as the machine takes its first real pull."]);
    more(T.milker.seed,
      ["A harness whips round %n's hips and cinches. A fat clear tube rises between their thighs and slurps their cock down like a calf on a bottle.",
       "The trap bends %n over a rail, and from underneath a warm oiled sleeve slides up their length and locks on at the root."],
      ["It ripples from tip to root in slow hungry waves, and a thin vibratin' wand settles in against the back of their sack.",
       "The suction builds, lets off, builds higher. %n's cock is bein' worked by somethin' that has never once been tired."]);
    T.milker.both[0].push("The trap has a tank to fill and it means to fill it. %n is milked past the first let-down, past the second, into the thin sweet dregs.",
                          "%n's legs give out. The straps hold them up. The pump goes right on, wringin' them.");
    T.milker.end.push("The gauge on the wall swings to %ml and the cups let go with a gasp. %n is left hangin' over the bar, emptied, tinglin' and good for nothin'.",
                      "%ml in the can. The trap pats %n dry with a rag on a stick, real considerate, and drops them in the straw.");
    more(T.breeder.beats,
      ["A noose of soft rope drops over %n's shoulders and reels them backwards against a padded bench. It tips, and up come their hips, and out go their knees.",
       "The breedin' stand in the corner was built for mares. It turns out it adjusts. %n is in it, hobbled and tail-tied, before they've worked out the levers."],
      ["A hatch slides open in the wall behind %n. What comes out of it on its greased arm is %c, veined, wet, and much too real for a machine.",
       "The frame hums. Behind %n somethin' heavy and %c swings into place and drools a long warm string down the back of their thigh."]);
    more(T.breeder.in,
      ["It nudges at %n's %h, twice, three times, findin' the angle. Then it drives in to the base and the whole frame shudders.",
       "The machine takes %n's %h in one slow relentless push, bottoms out, and holds there a second so they can feel just how much of it there is."],
      ["It finds a rhythm and keeps it: deep, wet and exactly as hard as it likes. %n can't move anything but their toes.",
       "The stand rocks. %n's breath comes out of them in grunts, one a stroke, and the gears whine higher."]);
    T.breeder.end.push("The arm locks forward and somethin' deep in the wall goes thump, thump, thump. %ml, pumped into %n's %h in thick heavy spurts. The frame holds them tilted a full minute after, so it stays in.",
                       "It breeds %n to the end of its stroke and empties its tank: %ml, hot, up their %h. The hobbles click open. Nobody helps them down.");
    T.breeder.endOver.push("The arm pulls back and lets fly across %n's rump and the small of their back, %ml in long hot stripes, then wipes its own tip clean on their thigh and retracts.");
    more(T.gas.beats,
      ["%n opens a feed bin and it sighs in their face: a warm pink breath that smells like clover honey and somebody's skin.",
       "There's a perfume bottle on the rail with a card that says SNIFF ME. %n is the kind who does."],
      ["It goes through %n like a hot drink. Their mouth falls open. Their thighs slide against each other, slick already.",
       "%n's knees soften. Their nipples stand up. Somewhere low in their belly a slow greedy pulse starts, and builds, and builds."],
      ["When their head clears they're on all fours with their back arched and their tail in the air, and they're not sure when that happened.",
       "The pink's gone from the air and all of it's in %n now: flushed, pantin', presentin' to an empty barn."]);
    more(T.snare.beats,
      ["A net flips up out of the hay and scoops %n clean off the floor. Four ropes pull four corners and they're hangin' in it, spread like a starfish.",
       "%n's wrist goes through a loop danglin' from a beam, and the loop bites. The other wrist follows. Two more catch their knees and lift."],
      ["A soft mitten on a jointed arm starts to stroke the inside of %n's thighs, up, and up, and not quite.",
       "From below, a slim wand tipped with a ball of lambswool rises and begins to dab and circle, light as breath."],
      ["%n bucks toward it and it pulls back exactly that far. It's done this before. It's better at it than they are.",
       "It brings %n to the very lip of it four times and leaves them there four times, swingin', swearin', soaked."]);
    T.snare.end.push("The net lowers %n to the straw and falls slack. They lie there with their hips still workin' at nothin'.",
                     "It unwinds and lets %n drop to their hands and knees, shiverin', every nerve lit and not one of them satisfied.");
    more(T.mud.beats,
      ["There's a plank across the wallow. %n walks out on it. It's hinged in the middle.",
       "%n leans on the sty rail to look at the pigs. The rail was sawn through and waxed over, some time ago, by somebody patient."],
      ["Splat. Face, chest and belly, the full length of them, in mud the hogs have been improvin' for a year.",
       "They go in backwards with their legs in the air, and the wallow closes over them with a long wet smack."],
      ["%n sits up in it, blinkin' out of a brown mask, with mud packed in their ears and a sow lookin' at them like they're in her spot.",
       "They come out on their hands and knees, coated, drippin', gruntin' with the effort. Honestly, hon, it's hard to tell which one's the pig."]);
    more(T.spray.beats,
      ["A hoop drops over %n and tightens round their arms. Overhead a tank the size of a rain barrel tilts on its pivot.",
       "%n walks between two posts and brass arms swing out of both, pinnin' their wrists wide. A row of spouts along the top rail coughs."],
      ["It's the mornin's collection, kept warm: thick stud cream by the gallon. It comes down on %n in ropes and sheets.",
       "The spouts spit, one at a time, takin' turns: across the lips, across the tits, a long one up the belly, like a firin' squad."],
      ["They're iced like a bun. It hangs off %n's lashes and runs down between their legs, and the posts let go.",
       "%n stands in the drippin' aftermath with their hair glued flat, lickin' their lips before they can think better of it."]);
    more(T.spray.piss,
      ["A hoop drops over %n and tightens round their arms, and pushes them down to kneel. Overhead a pipe as thick as a wrist swings round.",
       "%n is caught at the wrists between two posts and sat down on their heels. A tin gutter above them starts to tick and drip."],
      ["The valve opens all the way. A hard hot yellow stream hits %n in the chest and climbs to their face, steady as a pump.",
       "It comes down like summer rain, warm, gold and stinkin', soakin' their hair, fillin' the hollow of their collarbone, runnin' off their nipples."],
      ["The stream stutters out. %n kneels in the steam with piss drippin' off their nose and chin, soaked through and marked.",
       "When it stops, %n is wet to the skin and reekin', sittin' in a warm puddle with their lips pressed shut and their cheeks on fire."]);
    more(T.wire.beats,
      ["%n hears a little zzzip from the doorframe as they pass through it.",
       "There's a row of fish hooks on threads hangin' in the dark of the passage, fine as spider silk. %n walks right into them."],
      ["Every thread reels in at once. Hems, collars, waistbands, all gone the same second, with a sound like a sail tearin'.",
       "The hooks catch, the spools spin, and %n is turned out of their clothes like a pea out of a pod."],
      ["%n stands in the doorway in their skin, goosefleshed, with their clothes wavin' at them from a rafter.",
       "Bare, top to toe. %n covers what two hands can cover. It isn't enough, and the barn's full."]);
    more(T.clamp.beats,
      ["A hinged steel shell swings up from the floor and shuts over %n's crotch like a clam, warm on the inside and snug as a glove.",
       "%n straddles a low rail to climb over it. The rail has other ideas: it rises, fits itself between their legs, and locks at the hips."],
      ["It purrs. It's got soft parts in there, and they move, and they know exactly what they're doin'.",
       "Inside it, somethin' slick starts to lap and flutter. %n grabs the nearest post with both hands."],
      ["Up, up, right to the top of the hill, and click: nothin'. %n sobs. A little counter on the clamp rolls over to 1.",
       "It lets %n get within one heartbeat, and stops, cool and still. Then it starts again from the bottom, and the counter ticks."]);
    more(T.pump.beats,
      ["A sling catches %n under the belly and lifts their hips. A hose as thick as two fingers rises behind them with a soft bulb on the tip.",
       "The trap folds %n over a tilted bench, head down, tail up, and uncoils a long clear tube from a tank marked WARM."],
      ["It noses into %n's %h, slides in a good long way, and the bulb swells to hold it there. The tank starts to glug.",
       "The nozzle works its way up %n's %h, blows itself up snug behind the ring, and opens the tap."],
      ["A quart. Two. %n's belly drops and rounds till it's restin' on the bench, and their groans go up a note with every glug.",
       "They watch their own middle grow, tight and smooth and heavy. There's a line on the tank and the level's not near it yet."]);
    T.pump.end.push("The tap shuts and the bulb goes down. %ml. %n stands up one careful inch at a time, huge, sloshin', bow-backed, and walks like a goose.",
                    "%ml, all of it in %n's %h, and their gut's so round the skin shines. The hose reels in. Every step sets it swingin'.");
    more(T.eggs.beats,
      ["A stool rises out of the floor and takes %n right between the legs, liftin' them onto tiptoe. There's a smooth, wet, knuckled shaft stickin' up through the seat.",
       "Clamps take %n's thighs and sit them down slow over a hole in a bench. Somethin' warm and ridged is comin' up out of it."],
      ["It threads itself up %n's %h, bump by bump, and its blunt tip presses against the very back of them and stays.",
       "The shaft sinks into %n's %h till they're seated, and then a ring at its base inflates and they couldn't lift off it if they tried."],
      ["A knot of pressure starts at the bottom and climbs. %n's eyes go round. It passes into them, fat and slick, and drops. Another's already risin'.",
       "The first egg stretches %n open on its way through and lands inside with a weight they feel in their knees. The post swells again."]);
    T.eggs.end.push("%x. The post counts them out with a soft ding apiece, plugs %n with a gob of clear jelly, and sinks away. They stand there a long moment with both hands on the lumps.",
                    "The clamps open with %x eggs bedded down in %n's %h. They rattle, faintly, when %n walks.");
    T.eggs.endHyper.push("The dingin' goes on and on. %x eggs, shoved up %n's %h till their belly sticks out like a full sack and they can feel the top ones under their ribs.");
    more(T.lantern.beats,
      ["A music box starts up somewhere, tinklin'. A little lamp comes down out of the dark on a thread, turnin', and its light goes round the walls like a slow wheel.",
       "%n sees a glow under a stall door and peeks. Inside there's nothin' but a lantern on a string, swingin', and suddenly it's very hard to shut the door again."],
      ["Round and round. %n's breathin' matches it. Their hands hang open. Somethin' in the back of their head lies down and curls up.",
       "It's warm in the light. It's easy in the light. %n lets their jaw hang and their eyes go soft and follows it, follows it."],
      ["A thin line of spit runs off %n's lip. They don't notice. The lantern's talkin', and they're agreein' with every word.",
       "%n's knees part by themselves. Their hand drifts down and rests between their legs, not doin' anything, just holdin', the way they've been told."]);
    T.lantern.thought.push("There's a warm blank where your worries were. In the middle of it, one idea, glowin': when somebody wants to use you, you say thank you.",
                           "You wake up standin'. You feel wonderful. You feel empty, and you'd like very much for somebody to fill you.",
                           "It's quiet in your head, sugar. The lantern left just one thing in there: your body's for breedin', and that's a happy thought.");

    // ── the thing in the water ──
    T.tentacle.grab.push("%n kneels at the edge to wash their hands. Their reflection smiles. They aren't smilin'. Then the reflection's arms come up out of the water, and they're not arms.",
                         "The lily pads drift apart all at once. From the black water under them a thick, pale, suckered limb rises like a question mark and curls round %n's waist.",
                         "A cold loop cinches round %n's thigh and pulls. Another has their wrist. The water round their feet is suddenly full of slow, heavy movement.");
    T.tentacle.strip.push("It hauls %n out to where the water's waist deep and holds them floatin' on their back, arms out, legs drawn up and apart. Dozens of thinner arms rise round them like reeds and start to touch.",
                          "The thing turns %n over in its coils the way you'd turn a peach, lookin' for the soft side. Slick tips slide under straps and into seams, and everything %n had on floats away.",
                          "Suckers kiss their way up %n's belly to their chest and latch on, tuggin'. A tongue-thin tendril winds round and round their throat, loose as a ribbon, and tips their head back.");
    T.tentacle.take.push("It doesn't push into %n's %h so much as pour. A fat arm flattens, squeezes itself inside, and swells back out to its full thickness once it's in.",
                         "The big one rubs its whole dripping length along %n's %h, back and forth, till they're slick with it. Then it curls its tip and screws in, deep, deeper, till it finds the end of them and leans.",
                         "Two thin ones hold %n's %h spread like fingers. The breeder comes up between them, as thick as a forearm and ridged along the bottom, and takes them in one long slide.");
    T.tentacle.takeShut.push("Everything's stoppered, so it gets clever: it wraps the plug in a thin coil and plays with it, tuggin', twistin', fuckin' %n with their own gear while the rest squeezes their belly.");
    T.tentacle.second.push("A third, knobbled along its length like a string of beads, feeds itself into %n's ass a bead at a time. Each one pops in. %n counts nine before they lose the number.",
                           "The one in front and the one behind find each other through %n, and start to move together, slow, like two hands kneadin' bread.",
                           "It isn't satisfied with one hole. A cold tip circles %n's ass, dips, and then the whole thick limb follows it in and starts to thrust.");
    T.tentacle.wrap.push("The coils round %n's chest draw tight and loose, tight and loose, pumpin' their breath for them, in time with the thing inside.");
    T.tentacle.mouth.push("A soft, blunt arm noses along %n's lips, smearin' them with somethin' that tastes of honey and salt, and slips inside when they gasp. It goes down their throat without a hitch. They don't even gag.",
                          "%n moans and the thing drinks the sound: a tentacle slides into their mouth, fat as a plum, and starts pumpin' somethin' warm down them. Their eyes roll back. Their body stops fightin' and starts ridin'.",
                          "It kisses %n. There's no other word. A wet rosette of small tendrils seals over their mouth and a long one slips between, strokin' their tongue, feedin' them sweet slime in pulses.");
    T.tentacle.muzzle.push("It strokes %n's gagged face with a broad wet tip, almost tender, and winds a coil over their eyes instead.");
    T.tentacle.swell.push("Out in the deep water somethin' huge rolls over, and the limb in %n's %h goes hard as a rail. Round shapes start movin' up through it under the skin, crowdin' each other.",
                          "The thrustin' stops. It seats itself as deep as it'll go and holds %n perfectly still. Then the first egg comes, squeezin' up the arm, spreadin' them wide and slippin' through, and it lays a second right on top.",
                          "%n feels it before they understand it: a firm, slick ball forced up into them, then another, each one packin' in beside the last, their belly liftin' a little more every time.");
    T.tentacle.end.push("%x eggs, laid deep in %n's %h. It tops them off with a hot flood of slime, slides out with a sound like a boot comin' out of a bog, and the pond closes over it. %n is left floatin' in the shallows, belly up and round.",
                        "It finishes: %x. The arms unwind in no hurry, pettin' %n's swollen middle as they go, and set them on the grass. The water goes flat as glass. A single bubble comes up.",
                        "The thing leaves %x eggs in %n's %h and a pint of its slime in every other hole. It carries them to the bank, real careful with its clutch, and sinks.");
    T.tentacle.endHyper.push("It lays till %n is full and then makes room. %x eggs, crammed up their %h, their belly swellin' out over the water like a second moon. It has to help them to the bank. They can't close their legs.",
                             "%x. %n stopped countin' at twenty. The thing packs their %h till the skin's drum-tight and lumpy all over, kisses the dome of it with a sucker, and slides off into the dark, emptied.");

    // ── toys that act on their own ──
    Y.inject.push("The %c hums, somethin' cold slides under %n's skin, and the hum stops. Dosed, like it or not.",
                  "A tiny piston fires inside %n's %c. They gasp and clap a hand over it. Too late: it's in.");
    Y.ovi.mouth.push("The %c pulses against the roof of %n's mouth and starts to lay. %x eggs, slippin' over their tongue and down, and all they can do is swallow.",
                     "%n's eyes water as the %c stretches their throat round one egg after another, %x of them, each landin' in their belly with a little weight.");
    Y.ovi.vulva.push("The %c seated in %n stiffens and swells. One by one, %x eggs are squeezed up through it and laid deep, where they bump against each other and settle.",
                     "%n stops mid-step and holds onto somethin'. Their %c is layin' in them again: %x this time, pushed in slow and snug.");
    Y.ovi.butt.push("%n's %c fattens at the root and feeds %x eggs up their ass, firm and slippery, each one nudgin' the last one higher.",
                    "There's a pop, and a pop, and a pop: the %c packin' %x eggs up %n's back door while they stand there with their knees together.");
    Y.feed.push("Gurgle. The %c tips a fresh %ml of thick warm mash down %n's gullet, and their throat pumps like a calf's on the teat.",
                "%n didn't ask to be fed, but the %c runs on a clock: %ml, straight down, till their belly pushes out another inch.",
                "The %c drools %ml of rich cream and seed into %n in a slow steady run. They drink. They don't get a say.");
    Y.feedPiss.push("The %c hisses, and %n's mouth floods hot and bitter and yellow. %ml. They swallow it all, shudderin'.",
                    "%n's %c opens its valve: %ml of warm piss, straight down the funnel. They gulp it like the gutter they've been made into.");
    Y.cock.push("Every time %n sits, the %c toy in their %h reminds them it's there. They've started sittin' down slow.",
                "%n shifts their hips and bites their lip. The %c cock in their %h found the spot again.");
    Y.cockBig.push("You can see the %c thing in %n's %h from the front: a long bulge under the skin of their belly that moves when they breathe.",
                   "%n has to stop and brace on a post. That %c brute in their %h just slid a half inch deeper, and their legs went.");
    Y.cockKnot.push("The %c toy's knot has swelled up tight inside %n's %h again. They walk like they're carryin' an egg between their thighs.",
                    "%n gives the knotted %c thing in their %h a hopeful wiggle. It's locked in to the hilt. They whine and let go.");

    // ── somebody waitin' in the trap ──
    more(A.stallion.beats,
      ["There's a fresh apple on the rail outside the stud stall. %n reaches for it. The stall door was never latched.",
       "\"You're the new mare.\" It isn't a question. The stallion stud ducks under the lintel, shakes out his mane, and looks %n over like he's buyin'."],
      ["He walks %n backward into the stall with one hand on their chest and kicks the door shut with a hoof. \"Turn round. Hands on the manger.\"",
       "He takes %n's wrists in one fist, lifts, and sets them down over a hay bale as easy as hangin' up a bridle."],
      ["He's hard already, and when it slaps against the back of %n's thigh it's like bein' hit with a warm fence post.",
       "%n feels the heat comin' off it before it touches them. It's longer than their forearm and the head of it's flat as a mushroom cap."]);
    more(A.stallion.in,
      ["He works the head against %n's %h in slow circles, lettin' his own slick do the job, and then leans his whole weight forward. Somethin' gives.",
       "\"Breathe out.\" He pushes. %n's %h opens round him an impossible inch at a time, and he keeps comin'."],
      ["He goes deep enough that %n feels him under their ribs, pulls back till only the flare's in, and does it again, slow as a plough.",
       "The bale scrapes across the floor with every stroke. He snorts, flattens his ears, and starts to really rut."]);
    A.stallion.end.push("His flare locks and he empties himself: %ml, in gouts that %n feels land one by one. He stays in till he softens, then slides out with a flood behind him and tosses them a horse blanket.",
                        "He whinnies through his teeth and it goes on and on, %ml of it, swellin' %n's %h and their belly with it. When he steps back, they pour. \"Tomorrow,\" he says.");
    more(A.bull.beats,
      ["\"Got a fresh one.\" The bull-man doesn't look up from the pail he's scrubbin'. He just reaches out one arm as %n passes and steers their head into the stanchion.",
       "%n is nosin' round the milk room. The bars close. A shadow the size of a barn door falls over them."],
      ["He rolls his sleeves up over forearms like hams and warms his hands at the stove first. \"Cold hands sour the milk.\"",
       "He ties %n's tail up out of the way with a bit of twine, pats their flank, and sets his stool."],
      ["He strips each teat with a long firm pull that goes clear to the root of %n. The milk sings in the pail. \"Lets down pretty,\" he grunts.",
       "His thumbs roll and squeeze, and %n's milk comes in hard thin jets. He's got an easy, sleepy rhythm, and he doesn't break it."]);
    more(A.bull.in,
      ["\"Stubborn in the back quarter.\" He stands, unbuckles, and feeds himself into %n's %h, thick and blunt and slow. \"There. Now she flows.\"",
       "He leans his chest on %n's back, cock sinkin' into their %h under its own weight, and reaches round to go on milkin' with both hands."],
      ["Every thrust shoves %n against the bars and every pull drains them a little more. They don't know which end to moan about.",
       "He ruts like he milks: unhurried, deep, sure. The ring in his nose knocks against the stanchion in time."]);
    A.bull.end.push("He lows, deep in his chest, and %n's %h takes %ml of him in slow thick surges. He milks out the last drop with his thumb, wipes them down with a warm rag, and lets the gate swing.",
                    "%ml into %n's %h, a full pail under them, and a great hot hand rubbin' their back while they shake. \"That's a good day's yield, heifer.\"");
    more(A.toms.beats,
      ["\"Mouse,\" says a lazy voice from the top of the hay stack. \"I told you a mouse'd come.\" Two tomcat-men peer down at %n, chins on their hands.",
       "Somethin' bats at %n's hair from above. They look up into a pair of green eyes and a slow grin full of small sharp teeth."],
      ["They take turns knockin' %n over. Every time %n gets up, a paw hooks an ankle. It's a game. %n isn't winnin'.",
       "The grey one sits on %n's back, washin' a hand, while the orange one walks round to look at what's stickin' out."],
      ["\"Mine first.\" \"You had the last one first.\" They settle it by one holdin' %n's scruff in his teeth and the other gettin' on with it.",
       "The orange tom kneads %n's hips with both hands, claws just barely out, purrin' like a saw."]);
    more(A.toms.in,
      ["His cock's slim and quick and covered in soft backward spines. In is easy. Out makes %n scream.",
       "He takes %n's %h in a dozen fast shallow strokes, bites down, and drags himself out against the grain. %n's whole body clenches."],
      ["The second one's lazier and crueller: slow in, slower out, lettin' every barb catch. %n is yowlin' and shovin' back at him before he's half done.",
       "Between them they rake %n into a heat so sharp it's nearly pain. %n hears themselves beggin' for the next one."]);
    A.toms.end.push("They leave %ml in %n's %h and stroll off along a beam with their tails up, not lookin' back. %n rolls in the hay, rubbin' their face on it, callin'.",
                    "%ml and a fire. The toms sit up top washin' their whiskers while %n crawls round the loft floor with their rump high, cryin' for anybody.");
    more(A.drake.beats,
      ["Every shiny thing that's gone missin' on the farm this year is piled in the old dovecote. %n picks up a brass bell. The pile opens an eye.",
       "It's warm as a bread oven behind the boiler. %n goes to see why. The why uncurls, bronze and horned, with a hiss like a kettle."],
      ["\"Thief,\" the drake says, pleasantly. \"Or tribute. I haven't decided.\" His tail's already round %n's waist.",
       "He draws %n in against his hot scaled belly and smells their hair. \"Soft. Empty. That won't do at all.\""],
      ["He arranges %n in the nest the way he arranges his coins: just so, on their back, knees up, where the light catches them.",
       "A claw tip traces down %n's breastbone to their navel and taps there. \"Here,\" he decides. \"I'll put them here.\""]);
    more(A.drake.in,
      ["He's ridged and tapered and hot as a kettle, and he goes into %n's %h slow, enjoyin' the way they jump at each ridge.",
       "The drake's cock is slick with somethin' that tingles. He sinks it in %n's %h to the root and they feel the heat spread up through their whole belly."],
      ["He rolls his hips like a wave and rumbles, and smoke curls from his nostrils. At the base of him, the first egg nudges for room.",
       "\"Hold still for the clutch.\" He locks his tail round %n's thigh. Somethin' round is pressin' at their %h from inside him."]);
    A.drake.end.push("%ml, hot as tea, and then %x eggs, pushed up %n's %h one at a time while he counts in his own tongue. He settles on top of them, wings mantled, broodin', till they've stopped shiverin'.",
                     "He seeds %n's %h with %ml and lays %x after it, each egg as warm as a stone from the hearth. \"Now you're worth guardin',\" he purrs, and adds them to the hoard for an hour.");
    more(A.naga.beats,
      ["The grain sacks in the corner are breathin'. %n pokes one. It isn't a sack.",
       "\"Ssso warm,\" somebody sighs overhead. A long patterned body spills down the ladder in loops, and the last loop has %n in it."],
      ["She winds on, lazy, a coil for the ankles, a coil for the knees, a coil for the ribs, hummin' to herself.",
       "Her tail tip tucks itself under %n's chin and lifts their face. Her eyes don't blink. \"You'll do for both.\""],
      ["The coils part %n's thighs for her without her seemin' to think about it. Two slick, pointed heads press up against them, one a little above the other.",
       "She squeezes, and %n's breath goes out, and in that soft moment she lines herself up, twice."]);
    more(A.naga.in,
      ["She slides both in together, one for %n's %h and one for whatever's next to it, and they're so smooth and tapered that %n has taken all of both before they know it.",
       "Twin cocks, cool as river stones, glide up into %n side by side. She gives a long satisfied hiss and tightens every coil a notch."],
      ["Her whole length moves in a slow travellin' ripple, and %n is slid up and down on the two of her like a bead on a string.",
       "She doesn't thrust. She constricts. Every squeeze drives her deeper and wrings a helpless noise out of %n."]);
    A.naga.end.push("Both of her pulse at once and %n is filled twice over, %ml of cool seed. She holds them a while longer, just for the warmth, then lets them slide out of her coils onto the sacks.",
                    "%ml, in two holes, and a kiss from a forked tongue. The naga unwinds, loop by loop, and %n is left tinglin', leakin' and squeezed limp.");
    more(A.kennel.beats,
      ["There's a bowl in the big kennel with %n's name chalked on it. They crawl in to see. That's how you catch a nosy pup.",
       "\"In.\" A hand between %n's shoulders, a shove, and the kennel door bangs. The mastiff-man hunkers down inside with them, fillin' the space."],
      ["He looks %n over with heavy-lidded patience. \"Hands and knees. Chest down. You know how a bitch stands.\"",
       "He sniffs along %n's spine to the nape and closes his jaws there, gentle, just to feel them go still."],
      ["\"We'll go till you take the knot easy. However long that is.\"",
       "He's unhurried. He's got all night, a locked door, and a job to do."]);
    more(A.kennel.in,
      ["He hilts in %n's %h and stays, grindin', lettin' the knot swell against the outside of them, bigger, bigger, till it's push or burst. Then he pushes.",
       "The mastiff fucks %n's %h in short deep jabs, and on each one the knot stretches them a hair more, until all at once it's through and they're locked."],
      ["\"Good. Feel that? Don't pull.\" He lies down on them, heavy and hot, and they throb round him while he fills them a spurt at a time.",
       "Round two he makes %n back onto the knot themselves. He just kneels there, arms folded, and waits for them to manage it."]);
    A.kennel.end.push("By the time the door's unlatched %n's %h has taken his knot twice without tearin' up, and holds %ml to prove it. He scratches them behind the ear. \"Trainin' up nicely.\"",
                      "%ml, and a %h stretched to fit him. The mastiff noses %n out of the kennel with a pat on the rump. \"Same time tomorrow, pup.\"");
    more(A.hive.beats,
      ["The old bee skep at the end of the orchard has a door in it now, person-sized, and the hum inside sounds like a word.",
       "A drone lands on the path in front of %n and bows. Then three more behind them. They're bein' escorted."],
      ["\"Sweet thing,\" the queen says, and every drone hums it after her. She unfolds two of her arms. \"Come and be fed.\"",
       "She's enormous up close, soft and gold-furred at the throat, with a waist %n could circle in two hands and a tail like a ripe pear."],
      ["Her kiss tastes of every flower on the farm. %n's legs stop takin' orders.",
       "Honey runs from the corner of %n's mouth. A drone licks it away, very proper, and holds them up."]);
    more(A.hive.in,
      ["The drones lay %n down in a hollow of warm wax, belly up. The queen's tail curls over, and the wet tip of it kisses %n's %h and slides home.",
       "She folds over %n, four hands holdin' theirs, and her long smooth ovipositor works its way up their %h a slow inch at a time."],
      ["One. Two. The eggs are small and many and they come in a steady patient stream, and the queen sings while she lays.",
       "%n drifts, drunk on jelly, while egg after egg slips up inside them and the drones fan their wings to keep them cool."]);
    A.hive.end.push("She seals %x eggs into %n's %h with a dab of wax and presses her forehead to theirs. By the time they're walked home, their chest is achin' full. Royal jelly does that.",
                    "%x, capped and safe. The queen strokes %n's swellin' teats with a feathered hand. \"You'll feed them well.\" The drones hum agreement.");
    more(A.goat.beats,
      ["\"Oi. Down here.\" %n looks down. The billy's lyin' on the hay bales with his hands behind his head and everything else on show.",
       "A horn hooks %n's collar from behind and tugs. \"Not so fast, darlin'.\""],
      ["He stinks, and he knows it, and he flares his nostrils like it's cologne. \"That's buck, that is. You'll get to like it.\"",
       "He walks round %n once on his clickin' hooves, flappin' his tongue, and stops in front."],
      ["He taps %n's bottom lip with one finger. \"That. I want that.\"",
       "\"Knees,\" he says, cheerful as anything, and puts a hand on top of %n's head."]);
    more(A.goat.in,
      ["It's skinny and fast and it's in %n's %h before they've finished kneelin'. He bleats with joy and starts to jab.",
       "He gets a horn-grip on %n's hair and humps their %h like it owes him money."],
      ["He talks the whole time. None of it's fit to repeat. %n's ears go red.",
       "\"Look at me. Look up. There's a good nanny.\" Slap, slap, slap, his beard in %n's eyes."]);
    A.goat.end.push("He jams in, quivers all over, and squirts %ml down %n's %h. Then he licks their cheek, long and rank, and bounces off over the fence.",
                    "%ml, quick as a sneeze, down %n's %h. He burps, scratches, and saunters away, leavin' them to cough.");
    more(A.sow.beats,
      ["\"There you are, piglet. I've been callin'.\" %n hasn't heard anybody callin'. They're picked up anyway.",
       "A warm, enormous softness closes round %n from behind and a voice like fresh bread says, \"Oh, you poor hungry thing.\""],
      ["She's got an apron on over nothin' much, and she's built like a feather bed. %n sinks into her lap and it's the most comfortable they've been all week.",
       "She tucks %n's head into the crook of her arm and starts to rock, creak, creak, before they can object."],
      ["\"Open up, sweet thing.\" The teat's fat and soft and it's drippin' on %n's chin already.",
       "She squeezes a bead of milk onto %n's lips, and when they lick it without thinkin', she slips the whole teat in."]);
    more(A.sow.in,
      ["It's so rich %n's eyes cross. They suck, and swallow, and suck, and somewhere far away her hand is hitchin' up her apron.",
       "By the third swallow %n has stopped wantin' to leave. By the tenth, they wouldn't notice the barn burnin' down. Under them, somethin' stiff and thick is pressin' up."],
      ["\"Just you keep drinkin'.\" She lifts %n by the hips and settles them down on her cock, inch by fat inch, into their %h.",
       "She rocks, and it slides deeper into %n's %h, and they whimper round the teat, and she says, \"I know, sweet thing. I know. Take all of it.\""]);
    A.sow.end.push("She breeds %n's %h slow and cums the same way: %ml, in long lazy pulses, hummin' an old milkin' song. Then she rocks them till the milk's gone down, and carries them out to the straw.",
                   "%ml, deep in %n's %h, and a belly full of sow's milk on top. She kisses their forehead. \"Sleep now. You'll be hungry again by supper.\"");

    // ── the parasite ──
    G.latch.push("The stranger grunts, finishes, and pulls back. What follows him through the hole isn't him: a soft pink mouth with no face round it, which fits itself over %n's lips and sinks a root down their throat like a key in a lock.",
                 "Somethin' warm slides off the cock and onto %n's tongue as it leaves, and it doesn't go down. It spreads. In three breaths it has grown out over their lips into a fat, shiny, pulsin' pout that isn't theirs.");
    G.dose.push("%n gulps. They didn't mean to. The lips on their face are milkin' their own throat, sendin' down another thick sweet helpin'.",
                "The parasite kisses %n from the inside, deep, and leaves somethin' warm behind. They can feel it start to work before it's reached their belly.",
                "A bulge travels down %n's throat under the skin. Feedin' time. The fat pink lips smack, wetly, satisfied.");
    G.convert.push("%ml, and not a drop of it for %n. The tentacle in their gullet swells, drinks, and squirts back a mouthful of its own brew, hot and thick as syrup.",
                   "The parasite sucks the cock in %n's mouth clean, takes all %ml for itself, and rewards its host a second later with a long shudderin' gush of serum.",
                   "%n feels the load go by and get caught. %ml. The lips on their mouth flush dark and happy, and then it's payin' them back, with interest.");
    G.off.push("It's had its twelve hours. The lips on %n's face give one last lingerin' suck, let go, and drop off, pullin' a yard of wet root out after them.",
               "%n hiccups and the whole thing comes loose: lips, tentacle and all, slidin' out over their tongue and plop into the straw. Their mouth feels empty in a way it never has.");
    G.purge.push("Two fingers, a firm grip and a long steady pull. The parasite comes up out of %n like a weed out of wet ground, and they heave and spit and gasp.");
    G.crave.push("You swallow, and there's nothin' to swallow. Your mouth feels wrong with nothin' in it.",
                 "Somebody walks past and you smell them. Just that. Your tongue's already wet.",
                 "You've been suckin' on your own two fingers for a minute now. It isn't helpin'.");
    G.craveBad.push("You'd take it off the floor. You'd lick it off somebody's boot. You need cum the way a calf needs the teat, and you need it now.",
                    "Your jaw aches from wantin'. There's a hot knot under your tongue, and only one thing unties it.");
    G.sated.push("It hits your tongue and your eyes close. There. There it is. You hold it in your mouth a second before you let it go down.",
                 "Warm, thick, salt. Every tight thing in you unknots at once. You could cry. You lick your lips and look for more.");
    G.bud.push("%n kisses %c, and when they part there's a thread of pink between their mouths that isn't spit. It snaps, and curls back onto %c's lip, and starts to spread.",
               "The lips on %n's face open against %c's and breathe somethin' in. %c pulls back, touchin' their mouth. It's already swellin'.");
  })();
