  /* WHAT'S IN THIS FILE (10ud-trap-depth.js)
     Longer, fuller trap scenes (Laynie, Oct 19: "the scenes could be expanded, more detailed, and longer scenes would be
     amazing for the traps... non-clinical language, and tons of variety"). Every trap's own story still runs in its own
     order; in the middle of it, two or three more beats are woven in from what kind of trap it is: being bred, being
     held, being made a mess of, being milked, being teased, and the folk who stop to watch. Each beat is picked for the
     body it's about ({tags}), never the same twice running. More beats at higher intensity (?intensity), fewer for somebody on ?intensity tender, more on filthy.
     subject who asked for gentle ones.
  */
  const DEPTH_KIND = {};   // kind → its kinds of scene
  const depthOf = (list, kinds) => { for (const k of kinds) DEPTH_KIND[k] = (DEPTH_KIND[k] || []).concat(list); };
  depthOf(["breed"], ["breeder", "pump", "crate", "wheel", "kissgate", "wall", "bale", "studchair", "seedshower", "booth", "wolves", "stallion", "bull", "warren",
    "boar", "toms", "drake", "naga", "kennel", "hive", "goat", "sow", "maze", "whelping", "bearskin", "hottub", "stag", "goblinraid", "goblinpit", "warband",
    "minotaur", "werewolf", "foxden", "lionpride", "ramstud", "clutch", "tentacle", "vines", "eggs", "saddle", "scarecrow", "leashpost"]);
  depthOf(["held"], ["snare", "net", "pillory", "stocks", "squeezechute", "twine", "yoke", "hogtie", "trophy", "ponycart", "winch", "scarecrow", "washline",
    "windmill", "carousel", "goblincart", "saddle", "desk", "wax", "glue", "bench", "crate", "studchair", "groomer", "tomatoes", "auction", "goblinmarket", "wall", "kissgate", "plow"]);
  depthOf(["mess"], ["mud", "mudpit", "slop", "honey", "fountain", "bakery", "creamery", "buttermill", "syruptap", "pieeat", "mudslide", "tomatoes", "dip", "glue",
    "slime", "spray", "mister", "chute", "feedbag", "trough", "stocks", "seedshower", "hogtie", "goblincart"]);
  depthOf(["milk"], ["milker", "cups", "carousel", "teatcheck", "milkinghole", "collection", "yoke", "bull", "buttermill"]);
  depthOf(["tease"], ["teaser", "tickle", "lantern", "mirror", "gas", "foxden", "wax", "desk", "inspection", "groomer", "stamp", "leashpost", "auction",
    "goblinmarket", "pricetag", "brand", "scale", "weights", "clamp", "paddle", "injector", "wire", "bell", "shrine", "trophy", "squeezechute"]);
  depthOf(["watched"], ["stocks", "pillory", "auction", "goblinmarket", "tomatoes", "leashpost", "trophy", "booth", "wall", "kissgate", "bale", "ponycart",
    "goblincart", "washline", "windmill", "scarecrow", "pieeat", "wheel", "carousel"]);

  const DEPTH_LINES = {
    breed: [
      "There's no hurry in it now: every stroke goes all the way, and %n feels each one land deep and settle.",
      "%n loses the count. The rhythm is all there is: the push, the drag, the slap of skin, the creak of whatever's holding them.",
      "{v}Every thrust nudges something deep inside %n's pussy, and their whole body clenches around it without asking them first.",
      "{nv}%n's ass is worked open wider with every stroke, until the stretch turns into something warm and hungry.",
      "{c}%n's own cock bobs and drips with every push, untouched and aching, leaving a wet trail wherever it swings.",
      "{t}%n's tits sway and bounce in time, heavy, nipples dragging and catching on everything under them.",
      "A big hand settles on the small of %n's back and holds them right where they're wanted. They don't argue.",
      "The breath on %n's neck goes ragged, hot, close. Whoever's in them is getting near and wants them to know it.",
      "%n's belly is already warm and full from earlier, and every new push shoves it a little deeper.",
      "{v}%n can feel the head of it kissing the very end of them, again and again, like knocking to be let in.",
      "%n's legs start to shake and give, and it doesn't matter: they're held up by what's in them.",
      "There's a pause, buried to the hilt, a long throbbing stillness, and then it starts again harder.",
      "%n's whole world narrows to being filled: in, out, in, the warm wet sound of it, the weight on their back.",
      "{fu}Both of %n's halves ache at once: their pussy squeezing tight round what's in it and their cock dripping in the straw.",
      "Something drips down %n's thigh from the last load while the next one's still being worked into them.",
      "%n's toes curl and their fingers dig into whatever they can reach, and they make a sound they'll be embarrassed about later.",
    ],
    held: [
      "%n tests what's holding them, wrist, ankle, hip. Nothing gives. It just holds, patient and certain.",
      "Every wriggle pulls something tighter. %n stops wriggling. Then starts again, because it feels so good to be stopped.",
      "%n can't reach anything, can't cover anything, can't close anything. They're exactly as open as the farm wants them.",
      "The straps creak when %n breathes. That's the most they can move now: breathing.",
      "{t}Held the way they are, %n's tits are pushed out round and tight, and they throb with their own heartbeat.",
      "{c}%n's cock strains against nothing at all, bobbing, the one part of them that's still free to move.",
      "%n's arms have gone heavy and floaty in the ties. Their head drops. It's easier to just hang there.",
      "Somebody checks the buckles, snugs one a notch tighter, and pats %n's flank like a well-tied calf.",
      "There's an itch on %n's nose they can't scratch, and it's the most maddening thing in the world.",
      "%n's knees are wide and they can't close them, and the cool air on everything between is its own kind of touch.",
      "The longer %n's held, the quieter they go, until struggling is a memory and waiting is all they are.",
      "A loose strand of hair falls in %n's eyes. Nobody moves it. They can't either.",
      "%n's muscles ache in the pose, a sweet steady burn, and every minute of it makes them a little softer.",
    ],
    mess: [
      "It's everywhere now: in %n's hair, behind their ears, between their fingers and toes, slowly sliding down their back.",
      "%n squelches when they shift, and the sound alone makes them blush to the ears.",
      "It drips off %n's chin in slow strings and lands on their chest, and nobody wipes it.",
      "{t}It pools between %n's tits and slowly overflows, a sticky trickle running down over their belly.",
      "{c}It runs down %n's cock and drips off the end, and somebody laughs at the sight of it.",
      "{v}It finds its way between %n's legs, warm and slick, and keeps on finding it.",
      "%n tries to blink it out of their eyes and only smears it further. They give up and let it be.",
      "It's drying tacky in places now and still wet in others, and every move peels and sticks.",
      "%n can taste it on their lips no matter how they lick them, and they keep licking them anyway.",
      "Somebody draws a finger through the mess on %n's back and writes their initial in it.",
      "The smell of it is everywhere, thick and sweet and filthy, and %n will be smelling it for hours.",
      "There isn't a clean inch of %n left, and the farm hands agree that's an improvement.",
    ],
    milk: [
      "The pull comes in long, patient waves, and with every one %n feels themselves let down a little more.",
      "{t}%n's udders tingle, then ache, then let go, warm milk running down the lines in steady pulses.",
      "{t}Every pull drags %n's nipples long and swollen, and the ache of it sinks right down into their belly.",
      "{nt}Even flat, %n's nipples are sucked swollen and tender, pulled again and again till they throb.",
      "{c}The milker on %n's cock pulls in slow rippling strokes, drawing every drop up and out of them.",
      "%n can hear it: the rhythmic wheeze of the pump and the drip into the can, and their breathing falls into time with it.",
      "The milk can fills a finger's width at a time. Somebody taps it, nods, and leaves them to it.",
      "%n's whole body has gone slack and warm, the way a good milker makes a cow go, eyes half closed.",
      "There's a hand on %n's flank, slow circles, like calming a heifer at her first milking.",
      "Drained, and still it pulls, gentle now, coaxing out drops %n didn't know they had.",
    ],
    tease: [
      "It stops just short, every time. %n's hips chase it and catch nothing.",
      "Somebody blows softly across %n's skin, and every hair on their body stands up.",
      "%n's breath hitches, and hitches, and the farm hand watching smiles and slows down even more.",
      "{v}A fingertip traces the very edge of %n's pussy, round and round, never quite where they need it.",
      "{c}A thumb rubs slow circles just under the head of %n's cock, and stops, and starts, and stops.",
      "{t}A nail drags lightly round %n's nipple, close, closer, and away again.",
      "%n is brought right up to the edge and held there, trembling, then left to cool, then brought up again.",
      "The worst part is the waiting: %n never knows when the next touch is coming, or where.",
      "\"Not yet,\" somebody murmurs, and %n whines like the animal they are.",
      "Every inch of %n is listening now, skin humming, ready for the smallest touch.",
      "%n's thighs are shaking and wet and it hasn't even properly started.",
    ],
    watched: [
      "A little crowd has gathered. Somebody's eating an apple. Somebody else has brought a stool.",
      "%n can hear them talking about them like stock at a fair: the shape of their rump, the noise they make, whether they'll take.",
      "A new farmhand points and asks a question, and an old one answers it in loving detail.",
      "Every gasp %n makes gets a little murmur from the onlookers, and that makes it so much worse, and better.",
      "Somebody takes bets on how long %n will last. The odds are not in %n's favour.",
      "Passers-by slow down, look, and stop. Nobody moves on.",
      "%n catches someone's eye in the crowd. They wink. %n goes red to the collarbones.",
      "A farmer leans on the fence with his arms folded, like he's watching the weather, and doesn't look away once.",
    ],
  };
  // WHO'S THERE (Nov 20, Laynie: "some beats seem unconnected"). These lines are woven into every kind of trap, and some
  // need somebody there: a partner in them ("whoever's in them", the breath on their neck, the weight on their back), or
  // folk about (somebody murmurin' "not yet", a fingertip, the crowd). Woven into a machine or a post or a bin of gas, that
  // was somebody appearin' out of nowhere. The trap's own story says who's there (trapCast, from its own beats), and a
  // line that needs somebody it hasn't got is left out. What's left is topped up with lines about the trap and them alone.
  const NEEDS_PARTNER = /whoever's in|breath on %n's neck|weight on (?:their|%n's) back|slap of skin|big hand/i;
  const NEEDS_PEOPLE = /\b(somebody|someone|farmhands?|farm ?hands?|farmer|onlookers?|crowd|passers-by|watchers?|bets|fingertip|a nail|a hand\b|hands find|everybody|folk|whoever)\b/i;
  const HAS_PARTNER = /\b(he|his|him|stud|stallion|colt|wolf|wolves|bull|boar|ram|stag|buck|drake|goblins?|minotaur|werewolf|fox|foxes|lion|lions|hound|hounds|dog|dogs|tom|toms|naga|ogre|orc|satyr|centaur|whoever|farmhand's cock)\b/i;
  const HAS_PEOPLE = /\b(somebody|someone|farmhands?|farm ?hands?|farmer|crowd|onlookers?|folk|passers-by|customers?|baker|auctioneer|plow hand|everybody|queue|watchin'|watching|the yard|the square)\b/i;
  // (beats: the trap's own, each already down to the one line this scene will say: trapRun picks them first)
  // (what's only a likeness doesn't count: "like a mare bein' stood for a stud" is a frame, not a stud)
  function trapCast(beats){
    const told = (beats || []).map(b => [].concat(b).join(" ")).join(" ").replace(/\b(like|as if|as though|the way)\b[^,.;:!?]*/gi, " ");
    return { partner: HAS_PARTNER.test(told), people: HAS_PEOPLE.test(told) };
  }
  function castFits(t, cast){ return !cast || ((cast.partner || !NEEDS_PARTNER.test(t)) && (cast.people || !NEEDS_PEOPLE.test(t))); }
  // the giggle gas's own (Nov 20: it was gettin' the heat gas's beats): ticklish past bearin', and it turns
  DEPTH_LINES.giggle = [
    "Every brush of air on %n's ribs sets them off again, and they squirm and wheeze and can't get away from their own skin.",
    "%n laughs till it hurts, and somewhere in the laughin' it turns into a moan, and they can't tell which one's comin' out of them.",
    "Their own hair tickles. Their own breath tickles. %n curls up gigglin', and that only makes it worse.",
    "{v}%n's laughin' so hard their thighs clench, and every clench rubs their swollen clit, and the giggles go breathy and wet.",
    "{c}%n's cock bobs and twitches every time they shake with it, hard from nothin' but not bein' able to stop.",
    "{t}%n's tits jiggle with every helpless giggle, and the jiggle tickles, and round it goes again.",
    "Tears run down %n's face and they're gaspin' between squeals, flushed pink from forehead to belly.",
    "%n tries to hold still. Holdin' still tickles worse. They break, squealin', and thrash in the straw with their legs kickin'."];
  // the trap and them, nobody else: for when the lines that need somebody are left out
  const DEPTH_ALONE = {
    breed: [
      "It doesn't tire and it doesn't hurry. Every stroke goes all the way in, and every one pulls back out slow enough for %n to feel the drag of it.",
      "{v}%n's pussy has stopped fightin' it. It just takes, wet and loose and sloppy, and squelches every time it's filled.",
      "{nv}%n's ass has given up clenchin'. It's open and slick and takes every inch like it was made to.",
      "There's no face to look at and nobody to beg. Just the thing in them, and the rhythm, and %n's own noises comin' back off the walls.",
      "%n's belly bulges a little with every push, and they watch it happen, glassy-eyed, the way you'd watch a pot come to the boil.",
      "{c}%n's cock bounces and drools with every stroke, untouched, leavin' a shiny string on whatever's under them.",
      "{t}%n's tits swing under them, heavy and loose, slappin' together in time with it.",
      "It finds the spot and stays on it, grindin', and %n's toes curl so hard they cramp.",
      "%n cums without meanin' to, clenchin' and sobbin', and it doesn't even slow down. It fucks them right through it and out the other side.",
      "{v}Every time it bottoms out it nudges the very end of %n, and their whole cunt flutters round it.",
      "Slick runs out of %n round the shaft and down their thighs, and the sound of it is filthy."],
    held: [
      "%n tests the hold again. It doesn't give a hair. They go limp, and somethin' low in them throbs at how little say they've got.",
      "Every bit of %n is out and on show and there's not a thing they can cover. Their skin prickles all over with it.",
      "{v}Held open like this, %n can feel the air on their pussy, cool on all that wet, and it makes them clench on nothin'.",
      "{c}%n's cock bobs out in front of them, hard and drippin', and there's no hidin' it and no touchin' it.",
      "%n's arms burn and their legs shake, and the ache of bein' held turns warm and sticky the longer it goes on.",
      "They squirm, and it's no use, and squirmin' rubs their thighs together, and that's worse."],
    mess: [
      "It's in %n's hair, behind their ears, between their toes, and pooled hot in the crease of their thighs.",
      "Every time %n moves it squelches, and every squelch makes them blush harder.",
      "{t}It runs off %n's nipples in fat slow drops, and they can feel every one let go.",
      "%n licks their lips without thinkin' and gets a mouthful, and then, after a second, licks them again.",
      "{v}It's found its way between %n's lips, warm in there, and they can't tell any more what's the mess and what's them.",
      "%n is slick from chin to knees, and the shine on them catches the light every time they breathe."],
    milk: [
      "The pull doesn't stop. Draw, squeeze, let go, draw, and %n's whole body has learned to rock with it.",
      "{t}Their nipples are drawn long and dark in the cups, swollen fat, and every pull sends a hot thread straight down between %n's legs.",
      "{c}Every pull on their chest makes %n's cock jump, and it's drippin' as steady as the cups are.",
      "The milk comes in spurts now, hard enough to rattle the glass, and %n moans with every one like it's bein' pulled out of their cunt.",
      "%n's leakin' somewhere else too, and the mat under them is soaked through."],
    tease: [
      "It comes and goes. Every time %n gets close it eases off, and every time they slump it starts again.",
      "{v}%n's clit's swollen fat and stickin' out, and the air movin' over it is nearly enough, and nowhere near.",
      "{c}%n's cock throbs against nothin', leakin' a steady string, so close the tip's gone dark.",
      "%n rocks their hips at the empty air like somethin' might be there to meet them. Nothin' is.",
      "Every inch of %n's skin is listenin' now. A draught across their nipples nearly finishes them.",
      "%n's thighs are soaked and their breath's all whimpers, and nothin's so much as touched them where they want it.",
      "They beg out loud, to nobody, real words, and hearin' their own voice beggin' makes them wetter."],
  };
  // two or three more beats, from what kind of trap it is, woven into the middle of its own story
  // (cast: who's there, trapCast. fams: a variant's own kinds of scene, the giggle gas or an ink spray, in place of the trap's)
  function deepenBeats(mn, kind, beats, cast, fams){
    try {
      let kinds = (fams && fams.length ? fams : DEPTH_KIND[kind]) || ["tease"];
      if (cast && !cast.people) kinds = kinds.filter(k => k !== "watched").concat(kinds.includes("watched") && kinds.length === 1 ? ["tease"] : []);   // (nobody about: nobody watchin')
      if (!kinds.length) kinds = ["tease"];
      if (!Array.isArray(beats) || beats.length < 2) return beats;
      const it = intensityOf(mn), gentle = it === "tender", hard = it === "filthy";   // ?intensity tender | rough | filthy (10y7-udders.js)
      const n = gentle ? 1 : hard ? 3 : 2;
      const out = beats.slice(), used = new Set();
      for (let i = 0; i < n; i++){
        const k = kinds[Math.floor(Math.random()*kinds.length)];
        // a different share of the pool for each beat, so no line comes up twice in one scene
        const own = (DEPTH_LINES[k] || []).filter(t => castFits(t, cast));
        const alone = cast && (k === "breed" ? !cast.partner : !cast.people);   // (a machine or a post in them, nobody about: the trap-and-them lines go in the mix)
        const all = !DEPTH_ALONE[k] || (own.length >= 6 && !alone) ? own : own.concat(DEPTH_ALONE[k]); if (!all.length) continue;
        const left = all.filter(t => !used.has(t)).sort(() => Math.random() - 0.5), size = Math.max(4, Math.ceil(left.length / n));
        const plain = left.filter(t => !/^\{/.test(t)).slice(0, 2);   // (two that fit any body, always)
        const pool = plain.concat(left.filter(t => !plain.includes(t)).slice(0, size - plain.length));
        if (!pool.length) continue; pool.forEach(t => used.add(t));
        // in the back half, never after the last: once the trap has got going, so a mess has landed before it's dripping
        // and the milking's started before it's "drained, and still it pulls" (Laynie, Oct 20: "make sure they all make sense")
        const lo = Math.max(1, Math.ceil((out.length - 1) / 2)), at = lo + Math.floor(Math.random()*(out.length - lo));
        out.splice(at, 0, pool.slice());
      }
      return out;
    } catch(e){ return beats; }
  }
