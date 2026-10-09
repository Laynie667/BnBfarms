/* WHAT'S IN THIS FILE (glory-stalls/scenes.js)
   The glory stall scenes, built fresh every time and always told as a story, in order:

     arrival → who comes through the hole → teasing → entry (stretching, if they're big) →
     early → middle → (another round, maybe moving to another hole) → late → build-up →
     the finish (where, and how much) → a knot tie, if there's a knot → aftermath → they leave

   Every stranger has one CHARACTER for the whole scene (greedy, slow, a talker, nervous, a regular, a
   breeder, on their break): their arrival, the way they talk, the pace and the way they leave all match.
   Reactions from the person in the stall are early, middle or late, so "right on the edge" never comes
   before the stranger is even inside. No line plays twice in one scene. A funnel gag gets its own scene.

   Kinds of cock (the farm's own types): human, canine (knot, ties), equine (flared, floods),
   feline (barbed), draconic (ridged), double (two at once, pussy and ass). Sizes: modest, thick, huge,
   hyper. The load follows both.

   Lengths: most scenes are one stranger (6–9 minutes); some take extra rounds (9–16); now and then a
   queue of three or four strangers takes turns (20–45). Beats come 22–32 seconds apart; the person can
   step off the spot to stop at any time.

   Writing more: add a line to any pool. %n is the person in the stall; %from and %to are hole words in
   SWITCH lines. Every line should name %n or be about the stall around them. No round brackets.
*/

const pickFrom = (a) => a[Math.floor(Math.random() * a.length)];
const between = (lo, hi) => lo + Math.random() * (hi - lo);
const chance = (p) => Math.random() < p;

// ── who comes to the hole ─────────────────────────────────
export const TYPES = {
  human:    { w: 34 },
  canine:   { w: 18, knot: true },
  equine:   { w: 14, flare: true },
  feline:   { w: 10 },
  draconic: { w: 10 },
  double:   { w: 6 },
};
export const SIZES = { modest: { w: 30, ml: [10, 20] }, thick: { w: 34, ml: [18, 35] }, huge: { w: 24, ml: [30, 60] }, hyper: { w: 12, ml: [60, 140] } };
const LOAD_X = { human: 1, canine: 1.2, equine: 1.6, feline: 0.9, draconic: 1.3, double: 1.5 };
const BIG = (v) => v.size === "huge" || v.size === "hyper" || v.type === "equine";

export function pickVisitor(holes) {
  const types = Object.entries(TYPES).filter(([k]) => k !== "double" || (holes.includes("vulva") && holes.includes("butt")));
  let r = Math.random() * types.reduce((a, [, t]) => a + t.w, 0), type = "human";
  for (const [k, t] of types) { r -= t.w; if (r <= 0) { type = k; break; } }
  const sz = Object.entries(SIZES); let s = Math.random() * sz.reduce((a, [, x]) => a + x.w, 0), size = "thick";
  for (const [k, x] of sz) { s -= x.w; if (s <= 0) { size = k; break; } }
  if (type === "equine" && size === "modest") size = "thick";   // there's no such thing as a modest horse
  return { type, size };
}
// a real visitor's own cock, in the same words
export function sizeFromInches(inches) { return inches >= 13 ? "hyper" : inches >= 9 ? "huge" : inches >= 6 ? "thick" : "modest"; }
const SIZE_WORD = { modest: "neat little", thick: "thick, heavy", huge: "huge", hyper: "absurdly huge" };
const HOLE_WORD = { mouth: "mouth", vulva: "pussy", butt: "ass" };

// ── strangers: one character for the whole scene ──────────
const PERSONAS = {
  greedy: {
    arrive: ["Somebody practically runs up to %n's stall, already fumbling with their belt before they reach the hole.",
             "Heavy, quick footsteps, and the wall in front of %n jolts as someone slams up against it, breathing hard.",
             "A fist bangs on the boards next to %n. \"Open up. I haven't got all day.\""],
    talk:   ["\"Fuck, yes. Take it. All of it.\"", "\"Don't you dare slow down on me.\"", "\"That's it, that's what I came for.\"", "\"Harder. You can take harder than that.\""],
    leave:  ["They yank free, zip up and stomp off without a word, already done with %n.",
             "A last rough slap on the boards, and the greedy one is gone as fast as they came."],
    pace: "rough",
  },
  slow: {
    arrive: ["Unhurried footsteps. Someone settles in outside %n's stall like they've got all afternoon.",
             "A bench creaks on the other side of the wall. Whoever it is means to take their time with %n.",
             "Somebody stops at the hole and just looks for a long, long moment before doing anything at all."],
    talk:   ["\"Slow. I want to feel every bit of you.\"", "\"Mm. No rush. None at all.\"", "\"There. Stay right there. Just like that.\"", "\"You feel that? I'm going to make this last.\""],
    leave:  ["They stay a long while afterward, just resting against the boards, before finally strolling off.",
             "A gentle pat on the wall, almost tender, and the slow footsteps fade away."],
    pace: "slow",
  },
  talker: {
    arrive: ["\"Well, look at what they've got waiting for me,\" says a voice outside %n's stall, delighted.",
             "Someone strolls up humming, stops at the hole and lets out a low whistle. \"Oh, you're lovely.\"",
             "A cheerful voice right at the hole: \"Hello in there. Ready for me?\" It doesn't wait for an answer."],
    talk:   ["\"God, you're so warm. Do you know how good this feels?\"", "\"I've been thinking about this all morning, you know.\"", "\"Listen to that. Listen to how wet that sounds.\"",
             "\"Tell me you want it. Go on. I can hear you.\"", "\"You're going to feel me for hours after this.\"", "\"Fuck, I could stay in here all day.\""],
    leave:  ["\"Same time tomorrow,\" the voice says, and they actually laugh as they walk off.",
             "They chat the whole way out, half to %n and half to themselves, until the door bangs shut."],
    pace: "steady",
  },
  nervous: {
    arrive: ["Hesitant footsteps. They stop, start, stop again outside %n's stall. Someone's working up the nerve.",
             "A shaky breath on the other side of the boards. \"Is this, um. Is this okay?\" a quiet voice asks.",
             "Someone peers through the gap under the door, then at the hole, then fumbles for a long time with a zipper."],
    talk:   ["\"Oh. Oh god. Oh, that's good.\"", "\"Sorry, I, sorry, I don't, oh fuck.\"", "\"Is this, does it feel okay? It feels so good.\"", "\"I can't, I'm not going to last, I'm sorry.\""],
    leave:  ["\"Thank you,\" whispers the nervous one, sounding dazed, and the footsteps hurry off.",
             "A breathless little laugh, a mumbled thanks, and they're gone, probably blushing all the way home."],
    pace: "nervous",
  },
  regular: {
    arrive: ["Familiar footsteps. Whoever it is knows exactly which stall they want, and it's %n's.",
             "\"There you are,\" murmurs a voice at the hole. \"Missed this one.\"",
             "Someone knocks their usual knock on %n's wall, two slow, one quick, like they've done it a hundred times."],
    talk:   ["\"Still the best stall on the farm.\"", "\"You remember me, don't you. I can tell.\"", "\"Just how I like it. You never change.\"", "\"Same as always. Good.\""],
    leave:  ["\"See you next week,\" says the regular, and taps their knock on the wall on the way out.",
             "The regular lingers a moment, gives the boards a fond pat, and heads off like they own the place."],
    pace: "steady",
  },
  breeder: {
    arrive: ["Somebody stops outside %n's stall and sniffs the air, slow and deliberate, like they're checking if %n's ripe.",
             "A low voice: \"Fertile ones in this row, they said.\" Footsteps stop at %n's hole.",
             "Someone comes up to %n's stall with a purpose, the kind who isn't here for a quick one."],
    talk:   ["\"Hold still. I want this deep.\"", "\"You're getting bred. Every drop stays in.\"", "\"Good. Take it. Take my seed.\"", "\"Don't waste a drop of it.\""],
    leave:  ["The breeder stays buried until the very last moment, then slips out and presses a thumb over %n to keep it all in before leaving.",
             "\"That one'll take,\" the breeder says with total certainty, and walks away satisfied."],
    pace: "deep", alwaysInside: true, prefers: "vulva",
  },
  quickie: {
    arrive: ["Quick footsteps, a glance up and down the row. Somebody on a short break, muttering about only having five minutes.",
             "A farmhand, by the sound of the boots, ducks in from the yard. \"Quick one. Quick one, then back to work.\"",
             "The outer door bangs open and someone rushes straight to %n's hole, still pulling off their work gloves."],
    talk:   ["\"No time, no time, just, fuck, yes.\"", "\"Nobody's coming. Keep going.\"", "\"I've got to be back in a minute.\""],
    leave:  ["They're gone before %n's even stopped shaking, boots hurrying back out to the yard.",
             "A zipper, a hurried \"thanks,\" and the door bangs shut. Break's over."],
    pace: "rough", short: true,
  },
};
function pickPersona(hole, rough) {
  // on a punishment shift, mostly the rough and the deep ones
  if (rough && chance(0.75)) { const r = Object.keys(PERSONAS).filter((k) => ["rough", "deep"].includes(PERSONAS[k].pace)); if (r.length) return r[Math.floor(Math.random() * r.length)]; }
  const keys = Object.keys(PERSONAS).filter((k) => !PERSONAS[k].prefers || PERSONAS[k].prefers === hole || chance(0.3));
  return keys[Math.floor(Math.random() * keys.length)];
}

// ── the pools ──────────────────────────────────────────────
const ARRIVE = [
  "Footsteps slow outside %n's stall, stop, shuffle closer. Someone is reading the chalk on the door.",
  "The latch on the outer door clacks. Heavy boots, then breathing right up against the boards in front of %n.",
  "A shadow slides across the slats of %n's stall. It stops at the hole and stays there.",
  "Two knocks on the wall beside %n's head, then a third. Somebody wants service.",
  "A belt buckle jingles on the other side of the wall. Then a zipper, slow, like they want %n to hear it.",
  "Someone spits into their palm outside %n's stall. The wet sound of a hand working, getting ready.",
  "The boards in front of %n creak as somebody leans their whole weight against them.",
  "A low voice on the other side: \"This one free?\" Nobody answers. The footsteps come closer anyway.",
  "Something sniffs at the hole in %n's stall, long and curious, warm breath puffing through.",
  "Hooves, or boots, %n can't tell, clop right up to the hole and stop.",
  "%n hears someone stop, groan softly at what they see, and start undoing their trousers in a hurry.",
  "A hand reaches through the hole first and squeezes whatever of %n it can find, possessive, before letting go.",
  "Somebody outside laughs low: \"Oh, that one's ready,\" and %n's whole body flushes hot.",
  "A coin rattles into the honesty tin by %n's door, then a hand slaps the wall: paid and waiting.",
  "The stall row goes quiet, and in the hush %n hears one set of footsteps coming straight for them.",
];
const REVEAL = {
  human:    ["A %size cock pushes through the hole, flushed dark and rock hard, a bead of wet already shining at the tip.",
             "Through the hole comes a %size cock, veined and twitching, so hard it bobs, nudging blindly toward %n.",
             "A %size cock slides through the hole and just hangs there, throbbing, dripping on the straw, waiting for %n to want it.",
             "A %size cock pokes through, the stranger's hand still wrapped around the base, stroking it slowly an inch from %n."],
  canine:   ["A slick red dog cock slides through, tapered and dripping, %size, with a fat knot already swelling at the base.",
             "Something pink-red and pointed pokes through the hole, %size and slick, pulsing little spurts of clear wet, the knot behind it fat and promising.",
             "A %size dog cock pushes through, glossy and hot, already twitching and dribbling, the knot just behind the hole."],
  equine:   ["A horse cock shoves through the hole, %size, mottled pink and black, the broad flat head twitching and starting to flare.",
             "The hole barely fits it: a long, heavy horse cock, %size, the flared head bobbing an inch from %n and dripping on the straw.",
             "Inch after inch of %size horse cock slides through the hole and keeps coming, heavy enough to sag, the blunt head blooming."],
  feline:   ["A short, thick cock pokes through, %size, ringed with soft little barbs that catch the light like velvet thorns.",
             "Through the hole comes a cat-like cock, %size, its barbed sides glistening, twitching with quick little throbs.",
             "A %size barbed cock slips through, the soft spines bristling as it pulses, eager and quick."],
  draconic: ["A ridged cock slides through the hole, %size, scaled at the base, its ridges stacked like rungs all the way to a tapered tip.",
             "Something warm and ridged pushes through, %size, hot as a stove, the ridges flexing as it searches for %n.",
             "A %size dragon's cock eases through, ridge after ridge, slick and glistening, radiating heat into the stall."],
  double:   ["Two cocks slide through a widened hole, one above the other, %size, both hard, both looking for somewhere to go.",
             "The stranger has two, stacked and twitching, %size each, and they press through the hole together.",
             "A pair of %size cocks push through side by side, rubbing against each other, both dripping."],
};
const TEASE = {
  mouth: ["It rubs across %n's lips, smearing wet until they shine, then slaps softly against %n's cheek.",
          "It rests on %n's tongue, heavy and salty, letting %n taste it before doing anything else.",
          "The tip traces %n's lips around and around, teasing, pulling back just when %n's mouth falls open for it.",
          "It pushes against %n's mouth until %n's lips part, then holds there, throbbing, making %n wait.",
          "It drags slowly across %n's face, from cheek to lips, marking %n with its scent.",
          "The tip is pressed to %n's lips until they're wet with it, and the stranger groans and pushes a little closer.",
          "The stranger taps it against %n's tongue, once, twice, three times, like ringing a bell."],
  vulva: ["The head drags up and down through %n's pussy, slow, gathering wet, bumping %n's clit on every pass.",
          "It slaps against %n's pussy a few times, wet little smacks, before settling at the entrance.",
          "It nudges %n's folds apart and rubs there, teasing, until %n is dripping for it.",
          "The stranger grinds the shaft along %n's slit without going in, and %n can feel every inch of it.",
          "Just the tip presses in, then pulls back out, then presses in again, until %n is whining for it.",
          "It circles %n's clit in slow, slick little rings until %n's legs start to tremble.",
          "A thumb spreads %n open first, and the stranger takes a long look before lining up."],
  butt:  ["Spit, then the tip circles %n's ass, pressing, easing off, pressing again until the ring starts to give.",
          "Slick, cold lube drips down %n's crack before the head presses against their ass, patient and insistent.",
          "It rubs against %n's ass in slow circles, working the rim soft before it even tries.",
          "The head pushes and pulls back, pushes and pulls back, coaxing %n's ass open one little bit at a time.",
          "A slick finger works into %n's ass first, then a second, stretching them while the cock waits its turn.",
          "It slides up and down between %n's cheeks, slow and slick, until %n is aching for it."],
};
// for a funnel gag: the cock can't go in, so it's all about the funnel
const FUNNEL = [
  "The stranger sees the funnel strapped in %n's mouth and laughs softly. \"Oh, that's convenient.\"",
  "The tip comes to rest on the rim of the funnel, dripping into it, and %n can taste every drop trickling down.",
  "The stranger strokes themselves over the funnel, slow and steady, letting %n listen to it.",
  "Every stroke squeezes a bead of wet into the funnel. %n has no choice but to swallow it.",
  "The stranger rubs the head around and around the funnel's mouth, teasing, close, so close.",
  "%n's throat works helplessly around the tube as the stranger's breathing gets heavier above it.",
];
const ENTRY = {
  human:    { mouth: ["It slides over %n's tongue and keeps going until %n's lips meet the wood.", "It pushes past %n's lips in one smooth stroke and settles heavy on %n's tongue."],
              vulva: ["It sinks into %n's pussy in one long push, the stranger groaning through the boards.", "It eases into %n's pussy slow and deep, stretching %n around every inch."],
              butt:  ["It pushes past %n's ring with a slow, burning stretch and settles deep.", "It works into %n's ass inch by inch until the stranger's hips press flush to the wall."] },
  canine:   { mouth: ["The pointed tip slips straight to the back of %n's throat, quick and eager, already spurting little warm jets."],
              vulva: ["It plunges into %n's pussy in one quick thrust and starts at once, hot little spurts with every jab.", "It finds %n's pussy on the first try and drives in, the knot bumping against %n's lips."],
              butt:  ["It jabs into %n's ass with no warning at all and starts going, the knot bumping the rim with every push."] },
  equine:   { mouth: ["The flat head forces %n's jaw wide, wider, and slides in only as far as %n's mouth can possibly take."],
              vulva: ["The broad head stretches %n's pussy wide, so slowly, a few inches at a time, until %n is stuffed and gasping."],
              butt:  ["The blunt head presses and presses until %n's ass gives around it with a gasp, stretched past anything %n is used to."] },
  feline:   { mouth: ["It slides over %n's tongue, the barbs a soft prickling drag, strange and ticklish."],
              vulva: ["It pushes into %n's pussy and every barb drags along the inside, a velvety rasp that makes %n twitch."],
              butt:  ["It slides into %n's ass and the barbs scrape gently on the way in, a prickling, maddening drag."] },
  draconic: { mouth: ["Ridge after ridge pops past %n's lips, each one a little thicker than the last, until %n's mouth is full of it."],
              vulva: ["It works into %n's pussy one ridge at a time, each ring popping in with a little jolt that %n feels to the core."],
              butt:  ["It pushes into %n's ass ridge by ridge, every ring stretching %n and then slipping in with a thick, filthy pop."] },
  double:   { vulva: ["Both press in at once, one into %n's pussy, one into %n's ass, and %n is stuffed full twice over."],
              butt:  ["Both press in at once, one into %n's pussy, one into %n's ass, and %n is stuffed full twice over."],
              mouth: ["One slides into %n's mouth while the other slaps wetly against %n's cheek, waiting its turn."] },
};
// only for the big ones, right after it goes in
const STRETCH = {
  mouth: ["%n's jaw aches already. It's so big %n can only take the head and a little more.", "%n's lips are stretched tight around it, drool spilling from the corners."],
  vulva: ["%n's pussy is stretched wide around it, so full %n can barely breathe.", "%n can feel it pressing up inside, deep enough to make their belly flutter."],
  butt:  ["%n's ass is stretched so wide it burns, and %n has to breathe slow to take it.", "It fills %n so deep %n swears they can feel it in their stomach."],
};
const RHYTHM = {
  mouth: {
    early: ["It starts slow, sliding in and out over %n's tongue, getting a feel for %n's mouth.",
            "The stranger pushes a little deeper with each stroke, testing how much %n can take.",
            "It pulls back to let %n breathe, then slides right back in, a little further this time."],
    mid:   ["It fucks %n's mouth with long strokes, pulling almost all the way out before sliding back over %n's tongue.",
            "Drool runs down %n's chin and drips onto their chest as the pace picks up.",
            "It pulls out to let %n gasp, taps their tongue twice, and slides right back in.",
            "Fingers curl through the hole and catch in %n's hair, keeping %n's face pressed to the wood."],
    late:  ["The stranger holds deep and grinds, rocking against the back of %n's throat, %n's eyes watering.",
            "It's fucking %n's throat now, fast and sloppy, the wall rattling.",
            "Every stroke goes all the way, %n's nose pressed to the boards, the stranger groaning on every one."],
  },
  vulva: {
    early: ["It starts with slow, shallow strokes, letting %n's pussy open up around it.",
            "It rocks gently into %n, deeper each time, until it's all the way in.",
            "The stranger finds a lazy rhythm, sliding in and out of %n's pussy with wet little sounds."],
    mid:   ["It pumps into %n's pussy with steady, deep strokes, the wall creaking in time.",
            "The stranger finds the angle that makes %n gasp and stays right there, working it.",
            "Wet, slapping sounds fill the stall. %n's thighs are slick and shaking.",
            "It slows to deep, grinding circles, buried as far as it'll go, then speeds back up without warning."],
    late:  ["Every thrust rocks %n forward against the stall. %n has to brace on the rail to keep still.",
            "It's pounding %n now, hard and fast, the boards banging against their frame.",
            "The stranger is slamming into %n's pussy with everything they've got, chasing it."],
  },
  butt: {
    early: ["It starts gentle, short little strokes, letting %n's ass get used to it.",
            "It eases in and out of %n's ass, slow and slick, a little deeper each time.",
            "The stranger holds still a moment, buried in %n, then begins to move."],
    mid:   ["It works %n's ass with long, steady strokes, dragging almost out before sinking back to the root.",
            "It holds deep in %n's ass, grinding, letting %n feel how full they are.",
            "Short, quick thrusts, then a long slow one that makes %n moan into the straw.",
            "The stranger's hips slap against the wall again and again, driving every stroke deep into %n."],
    late:  ["The pace turns rough. %n's ass is used hard, the boards thumping against their frame.",
            "It's pounding %n's ass now, fast and relentless, the whole stall shaking.",
            "Every stroke goes to the hilt, hard enough to push little gasps out of %n."],
  },
};
const PACE_LINE = {
  rough:   ["There's nothing gentle about it. The stranger uses %n like they paid for it.", "The wall shudders with every rough, impatient thrust into %n."],
  slow:    ["The stranger refuses to hurry, every stroke long and lingering, until %n is squirming for more.", "It's slow, almost torturously slow, and %n can feel every single inch."],
  steady:  ["The stranger keeps a steady, comfortable rhythm in %n, settling in for the long haul.", "Stroke after stroke into %n, unhurried and certain, like they know exactly what they're doing."],
  nervous: ["The rhythm is clumsy at first, stopping and starting, then the stranger finds their courage and %n feels it get better fast.", "They gasp at every stroke into %n, like they can't believe how good it feels."],
  deep:    ["The stranger doesn't pull back far. They stay deep in %n, grinding, pressing as far as they can reach.", "Every stroke ends buried to the hilt in %n, held there, pushing deep."],
};
const TYPE_RHYTHM = {
  human:    ["The stranger grunts with every thrust into %n, the sound muffled by the boards.", "A hand slaps the wall above %n, holding on for leverage.", "%n can feel it throbbing, getting harder still."],
  canine:   ["It humps in a frantic, blurring rhythm, the knot slapping against %n with every jab, swelling bigger.", "Little hot spurts keep coming with every thrust, making %n slicker and slicker.", "The knot is getting fat now, bumping against %n, threatening to push in."],
  equine:   ["Each stroke is slow and heavy, like being worked by a piston, and %n feels every inch of it all the way down.", "The flare is already blooming, catching and dragging inside %n on every pull back.", "It's so heavy the stranger has to brace with both hands to keep thrusting into %n."],
  feline:   ["Short, sharp thrusts, the barbs raking softly every time it pulls back, making %n jerk and gasp.", "It's quick and relentless, all hips, and those barbs make every stroke feel like ten to %n.", "The barbs prickle and drag on every pull, and %n can't decide if it's too much or not enough."],
  draconic: ["The ridges drag in and out, in and out, each one catching on its way through %n with a thick little pop.", "It's hot inside %n, hotter than any cock should be, and it seems to swell with every stroke.", "%n can count the ridges by feel, every single one, on every single stroke."],
  double:   ["The two cocks take turns, one pushing in as the other pulls back, so %n is never empty for a second.", "Both thrust together, and %n is pinned between them against the wall.", "%n is so full, twice over, that every movement makes them gasp."],
};
// What it does to them: how it feels and what their body does on its own, never what they choose to do
// (asked for: "more of what's done to me, and much less what I do").
const REACT = {
  mouth: {
    early: ["%n's mouth is filled, heavy and salty, the taste of the stranger everywhere.",
            "%n's jaw is eased open wider than it wants to go, and held there.",
            "A soft, surprised sound is pushed out of %n around it.",
            "%n's lips are stretched around it, tingling, wet.",
            "It settles on %n's tongue like it owns the place.",
            "%n's breath stutters through their nose as their mouth is taken."],
    mid:   ["%n's throat is opened a little more on every stroke.",
            "Spit runs from the corners of %n's stretched lips and nobody wipes it away.",
            "A muffled moan is fucked right out of %n.",
            "%n's eyes water as it's pushed deeper, and deeper again.",
            "%n's head is held still for it, cheek pressed to the wood.",
            "Every stroke drags over %n's tongue, and %n can taste how close the stranger is getting.",
            "%n's mouth is used like it was built for this."],
    late:  ["%n's throat is used hard and fast, and all %n can do is take it.",
            "Tears and drool run down %n's face. The stranger doesn't slow down.",
            "%n's throat flutters helplessly around it.",
            "%n is held right down to the root, nose to the boards, until their vision sparkles.",
            "Little choked sounds are forced out of %n on every thrust.",
            "%n's jaw aches, their lips are numb, and it just keeps going."],
  },
  vulva: {
    early: ["A gasp is pulled out of %n as their pussy is opened up.",
            "%n's pussy is stretched slowly around it, inch by inch.",
            "%n's breath catches as they're filled.",
            "%n's pussy flutters around it, already giving in.",
            "Warmth floods through %n as it settles deep.",
            "%n's knees go weak the moment it pushes in."],
    mid:   ["%n's pussy is fucked so wet the sound is obscene.",
            "A helpless moan spills out of %n every time it bottoms out.",
            "%n is rocked forward against the boards with every stroke.",
            "%n's pussy clenches around it on its own, and the stranger groans.",
            "Every thrust lands right where %n is most sensitive, and %n shakes.",
            "%n's thighs are slick and trembling, held open for it.",
            "Pleasure is dragged out of %n whether they're ready or not."],
    late:  ["%n is pounded hard and fast, toes curling in the straw.",
            "%n is pushed right to the edge and held there.",
            "%n's whole body shudders, pinned against the stall and fucked.",
            "Broken little cries are knocked out of %n with every slam.",
            "%n's pussy spasms around it, helpless, overwhelmed.",
            "%n can't think. %n can only be filled."],
  },
  butt: {
    early: ["%n's ass is stretched open slowly, a deep, burning fullness.",
            "A low groan is pressed out of %n as their ass is filled.",
            "%n's ass is held open while it works its way in.",
            "%n's breath shudders as it settles deep inside.",
            "%n's ring gives way around it, and a shiver runs all the way up %n's spine.",
            "%n is stuffed full, and it's only just started."],
    mid:   ["%n's ass is worked in long, steady strokes.",
            "Soft, rhythmic grunts are fucked out of %n.",
            "%n's ass squeezes around it on its own, stretched and full.",
            "%n is shoved forward on every thrust and dragged back on every pull.",
            "%n's hips are held still while their ass is used.",
            "Every stroke reaches somewhere deep that makes %n's legs shake.",
            "%n's ass is taken like it belongs to the stall."],
    late:  ["%n's ass is used hard, the boards thumping against the frame.",
            "%n's legs tremble, but they're held in place and fucked anyway.",
            "%n is stretched to the limit, moaning out loud now.",
            "%n's knees slip on the straw, and the stranger just pulls them back.",
            "Every stroke goes to the hilt and knocks the breath out of %n.",
            "%n is shaking all over, ass clenching around it, helpless to stop it."],
  },
};
// another round, maybe in another hole
const SECOND_WIND = [
  "The stranger pulls out, breathing hard, and just rubs it against %n for a while, letting %n ache for it.",
  "It slows right down, almost lazy, savouring %n, every stroke long enough that %n squirms.",
  "The stranger shifts their stance, gets a better grip on the wall, and starts into %n again harder than before.",
  "It pulls nearly all the way out and stays there, just the tip, until %n is aching for the rest of it.",
  "The stranger wants it to last. The pace drops to slow, deep grinding into %n, and it goes on and on.",
];
const SWITCH = [
  "It slides out of %n's %from with a wet sound, and a moment later presses into %n's %to instead.",
  "The stranger pulls out of %n's %from and lines up somewhere new: %n's %to.",
  "\"Let's try the other one,\" mutters the stranger, and it leaves %n's %from to push into %n's %to.",
];
const BUILD = [
  "The stranger's breathing goes ragged and fast. The wall in front of %n shudders.",
  "A groan rolls through the boards, deep and desperate. They're close, and %n can feel it.",
  "The thrusts into %n lose their rhythm, short and jerky. Hands clamp the edges of the hole.",
  "\"Fuck, fuck, here it comes,\" from the other side of %n's wall, barely a whisper.",
  "Everything goes tight and still for one long second, the stranger trembling against %n's boards.",
  "It swells even harder inside %n, and %n knows it's coming.",
];
const AMOUNT = (ml) => ml < 15 ? "a hot little spurt" : ml < 30 ? "a warm, creamy load" : ml < 60 ? "a thick, heavy load that just keeps pulsing" : ml < 100 ? "a huge, pumping flood" : "an absurd, never-ending flood";
const HOLE_PLACE = { mouth: "%n's throat", vulva: "%n's pussy", butt: "%n's ass" };
const OUTSIDE = { mouth: ["%n's face", "%n's lips and chin", "%n's tongue and cheeks", "%n's hair and face", "%n's eyes and nose", "%n's forehead and down into their eyelashes",
                           "%n's open mouth and all down their chin", "%n's face and tits", "%n's upturned face, then their heaving tits", "%n's cheeks, nose and parted lips"],
                  vulva: ["%n's ass and thighs", "%n's back", "the lips of %n's pussy", "%n's ass cheeks", "%n's spread pussy and clit", "%n's belly and mound",
                          "%n's back, all the way up to their hair", "the backs of %n's thighs and the soles of their feet"],
                  butt: ["%n's back", "%n's ass cheeks", "the small of %n's back", "%n's thighs", "%n's gaping hole and around it", "%n's spine, from tailbone to neck"] };
// how it lands on them, outside
const PAINT = [
  "At the last second it pulls out and paints %where: %amt, hot ropes landing one after another while %n gasps.",
  "It yanks free and jerks itself hard, and %amt splatters across %where, rope after rope, until %n is dripping with it.",
  "\"Look at me,\" the voice says, and %n does, and it comes all over %where: %amt, thick enough to string between their lashes.",
  "It slaps wet against %n's skin and lets go: %amt of it, glazing %where and running down in warm, heavy streams.",
  "It pulls out with a groan and empties over %where, %amt, pulse after pulse, marking %n like property.",
  "\"Hold still.\" %amt hits %where in thick white stripes, and the stranger rubs the head through it, smearing it in.",
  "It comes in a hot, sudden gush all over %where: %amt, so much it drips off %n in long pearly strings.",
];
const PAINT_AFTER = [
  "Cum slides slowly down %n's face, catches on their lip, and drips onto their tits.",
  "%n can't open one eye; it's glued shut with somebody's load. They don't dare wipe it.",
  "It's in %n's hair, on their lashes, running off their chin in a sticky string to the straw.",
  "A stranger's taste is on %n's lips now, salty and warm, and it isn't going anywhere.",
  "The load cools on %n's skin into a tacky glaze that pulls every time they move.",
  "A drop runs from %n's chin all the way down between their breasts and keeps going.",
  "%n's face is a mess of it, nose to chin, and somebody outside the stall laughs at the sight.",
  "It's still warm where it pooled in the hollow of %n's throat.",
];
function finishLine(v, hole, ml, inside, funnel) {
  const amt = AMOUNT(ml) + ", easily " + Math.round(ml) + " mL of it";
  if (hole === "mouth" && funnel) return "The stranger cums straight into the funnel: " + amt + ", pouring down the tube and into %n's throat whether %n swallows or not.";
  if (!inside) return pickFrom(PAINT).replace("%where", pickFrom(OUTSIDE[hole])).replace("%amt", amt);
  const place = HOLE_PLACE[hole];
  switch (v.type) {
    case "canine": return "The knot shoves in and locks, and the stranger cums deep into " + place + ": " + amt + ", pumped in pulse after pulse while they're tied together.";
    case "equine": return "The flare blooms wide inside " + place + " and the horse cock floods it: " + amt + ", so much it pushes back out around the shaft.";
    case "feline": return "It cums in quick hard jerks deep in " + place + ": " + amt + ", and the barbs rake every inch of %n on the way out.";
    case "draconic": return "Every ridge swells and throbs at once as it empties into " + place + ": " + amt + ", hot as bathwater.";
    case "double": return "Both cocks unload at once, one into %n's pussy and one into %n's ass: " + amt + " between them, filling %n from both ends.";
    default: return pickFrom(["It buries itself to the hilt and cums deep in " + place + ": " + amt + ", throbbing with every spurt while %n shudders around it.",
                              "With a strangled groan it empties into " + place + ": " + amt + ", pulse after pulse, until %n can feel the heat of it spreading."]);
  }
}
const KNOT_TIE = ["The knot won't come free. %n is stuck to the wall, tied, the stranger panting on the other side, cum trapped deep inside.",
                  "Tied fast. Every little shift of the stranger tugs at %n from the inside, and there's nothing to do but wait for the knot to go down.",
                  "Minutes pass, %n and the stranger locked together through the wall. The knot throbs and pumps out a little more every so often.",
                  "Finally the knot softens and slips free with a wet pop, and a gush follows it out of %n."];
const AFTER = {
  inside: { mouth: ["It pours down %n's throat faster than %n can swallow, and some escapes down their chin.", "The taste lingers, thick and salty, coating %n's tongue.", "It coats %n's lips and tongue, thick and salty, and the taste stays."],
            vulva: ["When it slides out, warm cum runs down %n's thighs in slow, sticky trails.", "%n's pussy twitches and leaks, the load sitting heavy and warm inside them.", "It's pumped so deep into %n that it takes a while to start dripping out."],
            butt:  ["It pulls out with a wet pop and %n's ass gapes for a moment before it starts to leak.", "%n can feel it settle deep in their belly, warm and heavy.", "A slow, warm trickle starts down the back of %n's thigh."] },
  outside: ["%n is left sticky and dripping, cum cooling on their skin.", "It drips slowly off %n onto the straw. Nobody's coming to wipe it off.", "%n can feel it running down, warm and then cool, marking them."].concat(PAINT_AFTER),
};
const FUNNEL_AFTER = ["It all drains down the funnel into %n, gurgling empty at last.", "The last of it trickles down the tube, and %n swallows, flushed and dazed."];
const LEAVE = [
  "A zipper, a satisfied sigh, and the footsteps fade down the row away from %n's stall.",
  "A pat on the boards above %n's head, almost fond, and the stranger is gone.",
  "\"Good stall,\" mutters the stranger to %n's wall, and walks off whistling.",
  "Hooves clatter away down the aisle. Someone's already shuffling up to take their place at %n's hole.",
  "The outer door bangs shut. %n is alone again, dripping, waiting for whoever's next.",
];
// the stall around them: smells, sounds, the feel of the place (also when nobody's at the hole)
export const ATMOS = [
  "The stall smells of sweat, straw and old cum, thick in the warm air around %n.",
  "Somebody's cheap strawberry lube is drifting in from the next stall over.",
  "A muffled moan from further down the row, then a rhythmic thump against the boards.",
  "Rain drums on the tin roof above the stalls, and the air in %n's booth turns damp and close.",
  "Somewhere outside, the cows low and a gate clanks shut.",
  "A cool draft blows in through the hole and raises goosebumps across %n's skin.",
  "The boards under %n's knees are worn smooth and a little sticky.",
  "Light falls through the slats in thin gold stripes across %n's body.",
  "Two voices chat right outside %n's stall, as if nobody's in here at all, then move along.",
  "Musk hangs in the air, heavy and animal. Somebody's been busy all afternoon.",
  "A farmhand's broom swishes past outside %n's stall, then stops, then moves on.",
  "The stall next door creaks and rattles in a steady rhythm. Someone's getting used hard.",
  "A fly buzzes lazily around %n's stall and settles on the rail.",
  "The faint smell of hay, leather and somebody's cologne drifts in through the hole.",
  "Shadows of legs shuffle past the gap under %n's door: somebody's waiting their turn.",
  "Somewhere a door latch clicks, and %n's stomach flips, waiting to see if it's for them.",
  "The afternoon heat makes the stall close and drowsy, %n's skin damp with sweat.",
  "A wet slap and a gasp from the stall across the aisle, then laughter.",
  "The smell of the milking barn drifts over, warm and sweet, mixing with the musk.",
  "A rooster crows somewhere, absurdly, in the middle of it all.",
  "The tin cup by %n's door rattles in the breeze. Nobody's filled it in a while.",
];
const NEXT_UP = [
  "Before %n can even catch their breath, the next stranger is already at the hole.",
  "There's a line now. %n can hear them outside, shuffling, impatient, one stepping forward the moment the last one leaves.",
  "Somebody was waiting and watching the whole time, and now it's their turn with %n.",
  "A new set of footsteps, a new smell, a new shape pressing against the boards. %n's stall isn't getting a rest today.",
  "The door hasn't even swung shut behind the last one before someone else steps up to %n's hole, already hard.",
  "\"My turn,\" says somebody outside %n's stall, and %n hears the last one laugh as they make room.",
];
export const TAUNTS = [
  "\"Fuck, you're good at this.\"", "\"They keep you well used in here, don't they.\"", "\"Look at that. Made for a wall.\"",
  "\"Whose cow is this? I'm coming back for more.\"", "\"Dripping already. Desperate little thing.\"", "\"Hold still. You're just somewhere warm to finish.\"",
  "\"I'm telling everyone about this stall.\"", "\"Moo for me. Go on.\"", "\"Doesn't even need a face. Just this.\"", "\"You'll be leaking all day, and you'll love it.\"",
];
export const PRAISES = ["\"God, you're good. Thank you.\"", "\"Best stall on the farm, honestly.\"", "\"That's it, that's perfect, you're perfect.\"", "\"So good. So, so good.\""];


// ── more lines (each batch is pushed into its pool; add your own the same way) ──
ARRIVE.push(
  "Somebody whistles low at the sight of %n's stall and comes straight over.",
  "The smell reaches %n first, sweat and musk, and then the shape of someone filling the hole.",
  "A rough hand tests the edge of the hole, feels around until it brushes %n, then pulls back to make room for something else.",
  "Somebody leans in close to the boards and breathes, \"Oh, you're already wet for me,\" before %n even sees them.",
  "Boots scrape to a stop. A long pause, like the stranger is deciding which of %n's holes they want first.",
);
TEASE.mouth.push(
  "It paints a slick line across %n's lips, slow, then pulls back just out of reach of %n's tongue.",
  "The stranger feeds %n just the head, in and out, in and out, until %n is chasing it.",
  "%n's tongue flicks out to taste it, and the stranger groans and lets %n lick the whole length.",
  "It rubs slow circles on %n's tongue, smearing it with salt, making %n's mouth water.",
);
TEASE.vulva.push(
  "It rocks against %n's clit, slick and heavy, until %n is twitching on every bump.",
  "The stranger slaps it wetly against %n's pussy, one, two, three, then rubs the sting away with the tip.",
  "It slips in an inch and stops, holding there, until %n's whole body is begging for the rest.",
  "Two fingers spread %n wide and the stranger drags the head through the wet, taking their time.",
);
TEASE.butt.push(
  "A thumb presses against %n's ass and circles there while the cock rubs between %n's cheeks.",
  "Warm spit, then the head presses, retreats, presses, until %n's ass starts to open on its own.",
  "It nudges at %n's ass so slowly that %n ends up pushing back onto it first.",
  "The stranger works lube into %n with two fingers, stretching and teasing, before lining up.",
);
STRETCH.mouth.push("%n's jaw creaks around it, so wide, so full, every breath through the nose.");
STRETCH.vulva.push("It's so big %n's pussy aches around it, a deep, delicious stretch that won't let up.");
STRETCH.butt.push("%n's ass grips it like a fist, stretched to the limit, every inch a slow burn.");
RHYTHM.mouth.early.push("It rocks gently on %n's tongue, letting %n learn the shape of it.", "Shallow, slow strokes, the stranger sighing every time %n's lips close around it.");
RHYTHM.mouth.mid.push("It slides deeper, tapping the back of %n's throat, then back, then deeper again.", "The stranger holds %n's head still through the hole and fucks %n's mouth in long, wet strokes.", "Every stroke drags %n's lips along the length of it, spit stringing back with each pull.");
RHYTHM.mouth.late.push("%n's throat is used hard now, the stranger past caring about anything but finishing.", "It hammers into %n's mouth so fast %n can only hold on and take it.");
RHYTHM.vulva.early.push("It slides in and out of %n's pussy slow and sure, getting wetter with every stroke.", "The stranger eases in deep and grinds there, warming %n up.");
RHYTHM.vulva.mid.push("The stranger angles up and hits a spot that makes %n's knees buckle, again and again.", "It slides almost all the way out, then slams back in, over and over, a rhythm %n can't keep quiet through.", "It fucks %n in long, rolling strokes, the boards creaking like a bed.");
RHYTHM.vulva.late.push("It's relentless now, every stroke deep and hard, %n's pussy squelching around it.", "The stranger holds %n's hips through the hole and fucks %n like they mean to break the wall.");
RHYTHM.butt.early.push("It moves in %n's ass so slowly, barely rocking, letting %n stretch around it.", "The stranger gives %n's ass a few patient strokes, then a few more, a little deeper each time.");
RHYTHM.butt.mid.push("It works %n's ass in steady, filling strokes, every one ending buried.", "The stranger finds a good, deep rhythm in %n's ass and settles into it.", "It pulls out until just the head is in %n, then sinks all the way back, slow and heavy.");
RHYTHM.butt.late.push("%n's ass is getting fucked hard and fast now, slapping, rough, the stall rattling.", "It drives into %n's ass with short, brutal thrusts, chasing the finish.");
TYPE_RHYTHM.human.push("The stranger's hips slap the boards with every stroke into %n, steady as a metronome.", "%n hears the stranger's belt buckle rattle against the wall in time.");
TYPE_RHYTHM.canine.push("It's pure frantic rutting now, and %n can feel the knot swelling bigger by the second.", "The dog cock pulses with every jab, filling %n with little warm bursts.");
TYPE_RHYTHM.equine.push("The horse cock pushes deeper than anything should, and %n's whole body rocks with it.", "%n can feel the flare dragging, catching, swelling inside on every stroke.");
TYPE_RHYTHM.feline.push("Quick, hard little thrusts, and every one of them leaves %n tingling from the barbs.", "The barbs make %n gasp each time it pulls back, a sharp sweet scrape.");
TYPE_RHYTHM.draconic.push("The ridges ripple inside %n, a slow wave that makes %n's toes curl.", "It's like being filled with something molten, and %n can't stop moaning.");
TYPE_RHYTHM.double.push("One slides deep while the other teases, then they switch, and %n loses track of which is which.", "Being filled twice over makes %n gasp on every single stroke.");
PACE_LINE.rough.push("They're not making love to %n's stall, they're using it, hard and fast and selfish.");
PACE_LINE.slow.push("Every stroke into %n is unhurried, deliberate, savouring, like they've got all the time in the world.");
PACE_LINE.steady.push("It settles into a rhythm with %n so even and comfortable it's almost hypnotic.");
PACE_LINE.nervous.push("Every little sound %n makes seems to surprise the stranger, and they push in harder each time.");
PACE_LINE.deep.push("Buried as deep in %n as it'll go, the stranger just grinds there, slow and possessive.");
SECOND_WIND.push("The stranger stops, buried deep in %n, and just breathes for a moment before starting again.",
  "A hand slaps the wall above %n, the stranger laughs breathlessly, and the pace picks right back up.",
  "It slows to almost nothing, teasing %n with tiny strokes, until %n whimpers, and then it speeds up again.");
BUILD.push("The stranger's thighs are shaking against the wall in front of %n now.", "\"Don't move, don't you move,\" breathes the stranger, holding %n still.",
  "It throbs once, hard, inside %n, and the stranger lets out a long, broken groan.", "The boards in front of %n creak as the stranger's whole weight sags against them.");
AFTER.inside.mouth.push("Every drop went down %n's throat. All that's left is the taste, and the ache in their jaw.", "It leaves %n's tongue coated and their lips swollen and shining.");
AFTER.inside.vulva.push("%n's pussy is so full that a little more spills out every time they breathe.", "Warm and heavy, it sits low in %n's belly, and %n squeezes their thighs together to keep it.");
AFTER.inside.butt.push("%n's ass stays open and slick, leaking slowly onto the straw.", "%n can feel every drop of it inside, warm and heavy and theirs now.");
AFTER.outside.push("It slides slowly down %n's skin, sticky and cooling, and there's nowhere to wipe it.", "%n is a glistening mess, marked, and everyone who walks past will smell it.");
LEAVE.push("Someone pockets their gloves, pats %n's wall twice, and strolls back out into the sunshine.",
  "\"Thanks, gorgeous,\" through the boards, and then the stranger is gone, leaving %n dripping.",
  "The stranger stays leaning on the wall a while, catching their breath, then wanders off without a word.",
  "A low laugh, a zipper, and the footsteps fade, leaving %n shaking in the quiet.");
NEXT_UP.push("The next one doesn't even wait for the last one's footsteps to fade before stepping up to %n's hole.",
  "Somebody in the queue has clearly been watching %n through a crack, because they're hard and ready the second they step up.",
  "%n barely has time to swallow before another shape fills the hole.");
FUNNEL.push("The stranger tilts the funnel with one finger so it points straight down %n's throat, and grins.",
  "Drops patter into the funnel as the stranger strokes faster, each one making %n's throat work.",
  "%n can hear the slick, quick sounds of the stranger's hand right above the funnel, getting faster.");
ATMOS.push(
  "The straw under %n is damp and warm and smells of everything that's happened in this stall.",
  "Somebody in the next stall is counting out loud, slow, and then the counting turns into moaning.",
  "A horse whinnies somewhere out in the yard, and the whole row of stalls laughs at once.",
  "Sunlight catches the dust hanging in the air of %n's stall, drifting, golden.",
  "The wood of the wall is warm under %n's cheek, rubbed smooth by a hundred faces before.",
  "Someone's left a bucket of cold water just outside %n's door. %n can hear it slosh in the breeze.",
  "The low drone of the milking pumps drifts over from the barn, steady as a heartbeat.",
  "%n's own breathing sounds loud in the little stall, quick and shallow, waiting.",
  "A chalk tally by %n's door gets a little longer every hour. %n can hear the stub scratch it.",
  "The air in %n's stall is heavy and sweet, sweat and leather and something warmer underneath.",
);
for (const k of Object.keys(PERSONAS)) {
  const add = { greedy: ["\"Mine. This one's mine right now.\"", "\"You're going to take every bit of this.\""],
                slow: ["\"Beautiful. Just beautiful.\"", "\"Breathe for me. Slow. That's it.\""],
                talker: ["\"I can feel you squeezing me. Do that again.\"", "\"I'm going to tell everyone about you.\""],
                nervous: ["\"I've never, I mean, oh, oh god.\"", "\"Is it, can I, I'm so close already.\""],
                regular: ["\"That's my good one.\"", "\"I always save myself for this stall.\""],
                breeder: ["\"Keep it in. I mean it.\"", "\"You'll be round with it in a month.\""],
                quickie: ["\"God, I needed this.\"", "\"Faster, faster, I've got to go.\""] }[k];
  if (add) PERSONAS[k].talk.push(...add);
}

// ── put a scene together, in order ─────────────────────────
// a picker that never repeats a line inside one scene
// (in a queue, every stranger shares it, so lines nobody's used yet come first)
function freshPicker() {
  const used = new Set();
  return (list) => { const pool = list.filter((x) => !used.has(x)); const v = pickFrom(pool.length ? pool : list); used.add(v); return v; };
}

// one stranger, start to finish, as a little story
function oneVisitor(beats, { hole, visitor, funnel, degrade, praise, rounds, first, holes, pick, rough }) {
  const v = visitor, persona = PERSONAS[pickPersona(hole, rough)];
  const add = (t, extra) => { if (t) beats.push(Object.assign({ t }, extra || {})); };
  const talk = () => (chance(0.6) ? "A voice through the boards: " + pick(persona.talk) : null);
  const voice = () => (degrade && chance(0.35) ? "A voice through the boards: " + pick(TAUNTS) : praise && chance(0.35) ? "A voice through the boards: " + pick(PRAISES) : null);
  const atmos = () => (chance(0.3) ? pick(ATMOS) : null);
  if (persona.short) rounds = 0;

  // 1. arrival, and who it is
  add(first ? (chance(0.6) ? pick(persona.arrive) : pick(ARRIVE)) : pick(NEXT_UP));
  if (!first && chance(0.5)) add(pick(persona.arrive));
  add(atmos());
  add(pick(REVEAL[v.type]).replace("%size", SIZE_WORD[v.size]));

  // a funnel gag: the cock can't go in, so it's a scene of its own
  if (hole === "mouth" && funnel) {
    add(pick(FUNNEL)); add(pick(FUNNEL)); add(talk()); add(pick(FUNNEL)); add(voice() || atmos()); add(pick(FUNNEL));
    add(pick(BUILD));
    const [lo, hi] = SIZES[v.size].ml, ml = Math.round(between(lo, hi) * (LOAD_X[v.type] || 1));
    add(finishLine(v, hole, ml, true, true), { finish: true, inside: true, ml, hole, visitor: v });
    add(pick(FUNNEL_AFTER));
    add(chance(0.6) ? pick(persona.leave) : pick(LEAVE));
    return;
  }

  // 2. teasing, then in (and how it feels if they're big)
  add(pick(TEASE[hole]));
  if (!persona.short && chance(0.6)) add(pick(TEASE[hole]));
  add(pick((ENTRY[v.type] || ENTRY.human)[hole] || ENTRY.human[hole]));
  if (BIG(v) && STRETCH[hole]) add(pick(STRETCH[hole]));

  // 3. early → middle
  let h = hole;
  add(pick(REACT[h].early));
  add(pick(RHYTHM[h].early));
  add(pick(PACE_LINE[persona.pace]));
  add(pick(RHYTHM[h].mid));
  add(pick(TYPE_RHYTHM[v.type]));
  add(pick(REACT[h].mid));
  add(talk());
  if (!persona.short) { add(pick(RHYTHM[h].mid)); add(voice() || atmos()); }

  // 4. more rounds for the ones who take their time, sometimes moving to another hole
  for (let r = 0; r < rounds; r++) {
    const others = (holes || []).filter((x) => x !== h);
    if (v.type !== "double" && others.length && chance(0.4)) {
      const to = pickFrom(others);
      add(pick(SWITCH).replace("%from", HOLE_WORD[h]).replace("%to", HOLE_WORD[to]));
      h = to;
      add(pick(REACT[h].early));
    } else add(pick(SECOND_WIND));
    add(pick(RHYTHM[h].mid));
    add(pick(TYPE_RHYTHM[v.type]));
    add(pick(REACT[h].mid));
    add(talk() || voice());
  }

  // 5. late, build-up, finish
  add(pick(RHYTHM[h].late));
  add(pick(REACT[h].late));
  add(talk());
  add(pick(BUILD));
  const inside = persona.alwaysInside || v.type === "canine" || v.type === "double" || chance(0.6);
  const [lo, hi] = SIZES[v.size].ml;
  const ml = Math.round(between(lo, hi) * (LOAD_X[v.type] || 1));
  add(finishLine(v, h, ml, inside, false), { finish: true, inside, ml, hole: h, visitor: v });

  // 6. after: the knot, the mess, the goodbye
  if (inside && v.type === "canine") { add(pick(KNOT_TIE.slice(0, 3))); add(KNOT_TIE[3]); }
  add(inside ? pick(AFTER.inside[h]) : pick(AFTER.outside));
  add(voice());
  add(chance(0.65) ? pick(persona.leave) : pick(LEAVE));
}

// ── more than one at once: strangers at different holes together ──────────
// Two (mouth and one behind, or pussy and ass), sometimes three. Each brings their own cock; the story moves
// between them, with lines about takin' them together, and every finish counts on its own.
const JOIN2 = [
  "Another set of footsteps stops outside. A second hatch in %n's stall creaks open.",
  "%n is still busy when the board %where slides aside. Somebody else wants a turn, and they're not waiting.",
  "\"Room for one more?\" a new voice asks. Nobody says no, least of all %n.",
  "A second stranger has been watching through the slats. Now they step up to the hatch %where.",
  "The stall's other hatch clacks open. Someone's been waiting their turn and decided they don't have to.",
  "Two sets of boots now. The second one stops right at the hatch %where.",
  "A low whistle from outside: \"Look at that. Both ends free?\" Not for long.",
  "A hand slaps the board %where, then the hatch there swings open. %n isn't getting a break.",
  "The first stranger laughs as a second steps up: \"Go on, there's plenty of %n to go round.\"",
  "Somebody new jingles a coin into the tin and heads straight for the free hatch %where.",
  "A second shadow falls over the slats, and the hatch %where opens without so much as a knock.",
  "\"Don't mind me,\" says a new voice, and the hatch %where swings wide.",
];
const JOIN3 = [
  "A third shadow falls across the slats. Every hatch in %n's stall is spoken for now.",
  "\"Make room,\" says a third voice, and the last hatch opens.",
  "%n hears a third zipper. There's one hatch left, and it doesn't stay empty.",
  "A third stranger squeezes in at the last hatch, and %n is completely surrounded.",
  "Word has gotten around the barn. A third one steps up, already hard.",
  "The stall rocks as a third stranger leans on it. %n has three now.",
];
// %a and %b: two of the holes in use (mouth, pussy, ass)
const TOGETHER = {
  any: [
    "Both strangers find a rhythm together, and %n is pushed back and forth between them like a toy.",
    "When one pushes in, the other pulls back. %n is never empty for a second.",
    "They thrust at the same moment, and %n is pinned in the middle, filled at both ends.",
    "%n's %a and %b are both stuffed full, and every sound %n makes is a moan.",
    "The stall shakes from two sides now, two rhythms that never quite match.",
    "%n can feel both of them throbbing at once, one in their %a, one in their %b.",
    "One stranger slows down so the other can speed up. They're working %n like a team.",
    "\"Feel that?\" one asks the other through the boards. They both laugh, and both push deeper into %n.",
    "%n is pushed one way and pulled the other. Either way, someone's buried in them.",
    "Every thrust into %n's %b drives them forward onto the cock in their %a.",
    "The two of them settle into it, unhurried, using %n's %a and %b like they've done this together before.",
    "%n is so full of the two of them that there's no room left to think.",
  ],
  // the mouth and one behind
  spit: [
    "Spitroasted between the two hatches, %n is rocked forward onto one cock and back onto the other.",
    "Drool runs from %n's stuffed mouth with every push from behind.",
    "The one behind thrusts hard, and it shoves %n's face all the way down onto the one in front.",
    "%n can't moan properly with their mouth full, so the moans come out muffled and wet around the cock in their throat.",
    "Hands from the front hatch hold %n's head steady while the one behind sets the pace.",
    "Front and back, in and out, and %n is the thing in the middle that makes it work.",
    "\"Hold still for me,\" says the one behind. \"No, for me,\" says the one in front, and %n can't hold still for either of them.",
    "The one in front pulls out to let %n breathe, just as the one behind slams deep, and the gasp is all for them.",
    "%n's whole body is stretched between two hatches, a cock at each end and nowhere to go.",
    "Every stroke from behind pushes %n's lips to the root of the cock in front.",
  ],
  // pussy and ass
  dp: [
    "Both lower holes are full, and %n can feel the two cocks rubbing against each other through them.",
    "They take turns, one in as the other slides out, so %n is stretched in a rolling, endless wave.",
    "Stuffed in both pussy and ass at once, %n can barely breathe.",
    "The two cocks thrust together, and %n's legs nearly give out from the fullness.",
    "%n is double-stuffed and dripping, and the strangers haven't even sped up yet.",
    "%n's pussy and ass squeeze around the two of them in turn, and both strangers groan.",
    "The thin wall inside %n is all that separates the two cocks, and %n feels every ridge and throb of both.",
    "They find each other's rhythm through %n, and %n is the thing that ties it together.",
  ],
  // three at once
  three: [
    "Three strangers, three hatches, and %n in the middle of all of it.",
    "There isn't a part of %n that isn't being used now, mouth, pussy and ass all at once.",
    "The stall rattles from three sides, and %n just hangs there and takes it.",
    "Whenever %n tries to focus on one of them, the other two drag them back.",
    "%n is stuffed at every end, and they've stopped being a person for a while. They're just the middle of the stall.",
    "Three cocks, three rhythms, and %n stretched across all of them.",
    "The three strangers laugh to each other through the boards, and keep going.",
    "Muffled moans, wet sounds from three directions, and the stall shaking on its frame.",
  ],
};
const FIRST_DONE = [
  "One stranger is spent, but the other is nowhere near done with %n.",
  "One pulls out, finished, and the other takes it as a cue to really go to town on %n.",
  "With one hatch empty now, all of %n's attention lands on the one still going.",
  "\"My turn to finish,\" growls the one still at it, and %n braces.",
  "The finished one hangs around at the hatch to watch the other use %n.",
  "One down. The other is still pounding away like nothing happened.",
  "%n barely has time to feel the first load before the other stranger picks up the pace.",
  "The first one zips up and leaves %n to the other, who isn't slowing down.",
];
const BOTH_AT_ONCE = [
  "They finish at the same moment, both hatches shaking, and %n is flooded at both ends at once.",
  "One groans, then the other, and then they're both cumming into %n together.",
  "\"Now,\" one of them gasps, and they let go together, pumping %n full from both sides.",
  "Both of them bury themselves as deep as they can go and empty into %n at the same time.",
  "The stall goes still and tight, both strangers shuddering, and %n feels it from two places at once.",
  "Two loads at once. %n doesn't know which to feel first.",
];
const ALL_DONE = [
  "Every hatch is empty now. %n sags in the stall, dripping from more than one place.",
  "The hatches close one by one. %n is left used, full, and trembling.",
  "Nobody's left at the holes. %n slumps against the boards, leaking, breathing hard.",
  "Quiet again, at last. %n hangs there, full of strangers, legs shaking.",
  "The strangers leave together, laughing low. %n can feel what they left behind for a long time.",
];
const SIDE = { mouth: "in front of %n", vulva: "behind %n", butt: "behind %n" };
const HOLE_SAYS = { mouth: /mouth|throat|tongue|lips/i, vulva: /pussy/i, butt: /\bass\b/i };
// a line about what one stranger is doin', saying which one when the line doesn't: the hatch in front or behind,
// or the hole itself when both strangers are behind (pussy and ass)
function atHole(h, line, bothBehind) {
  if (!line || HOLE_SAYS[h].test(line)) return line;
  const lead = h !== "mouth" && bothBehind ? "In %n's " + HOLE_WORD[h] + ", " : "At the hatch " + SIDE[h] + ", ";
  return lead + line.charAt(0).toLowerCase() + line.slice(1);
}
// a cock showin' up at a particular hatch
function revealAt(h, v, pick) {
  const line = pick(REVEAL[v.type]).replace("%size", SIZE_WORD[v.size]);
  return "At the hatch " + SIDE[h] + ", " + line.charAt(0).toLowerCase() + line.slice(1);
}
const say = (h, line) => (h === "mouth" ? "From the hatch in front of %n: " : "From behind %n: ") + line;

function together(beats, { hole, visitor, holes, degrade, praise, pick, rough }) {
  const add = (t, extra) => { if (t) beats.push(Object.assign({ t }, extra || {})); };
  // who goes where: the first one keeps their hole; the next take others (mouth + one behind, or both behind)
  const back = holes.filter((h) => h !== "mouth"), order = [hole];
  if (hole === "mouth") order.push(pickFrom(back));
  else order.push(holes.includes("mouth") && chance(0.65) ? "mouth" : back.find((h) => h !== hole) || "mouth");
  const third = holes.find((h) => !order.includes(h));
  if (third && chance(0.35)) order.push(third);
  const bothBehind = order.includes("vulva") && order.includes("butt");   // two strangers behind: say which hole
  const at = (h, line) => atHole(h, line, bothBehind);
  const vis = order.map((h, i) => i === 0 ? visitor : (() => { let v; do { v = pickVisitor(holes); } while (v.type === "double"); return v; })());
  const pers = order.map((h) => PERSONAS[pickPersona(h, rough)]);
  const talk = (i) => chance(0.5) ? say(order[i], pick(pers[i].talk)) : null;
  const voice = () => (degrade && chance(0.3) ? "A voice through the boards: " + pick(TAUNTS) : praise && chance(0.3) ? "A voice through the boards: " + pick(PRAISES) : null);
  const pool = () => {
    const both = order.slice(0, 2), lines = TOGETHER.any.slice();
    if (both.includes("mouth")) lines.push(...TOGETHER.spit, ...TOGETHER.spit); else lines.push(...TOGETHER.dp, ...TOGETHER.dp);
    return pick(lines).replace(/%a/g, HOLE_WORD[both[0]]).replace(/%b/g, HOLE_WORD[both[1]]);
  };
  const first = order.length === 3 ? () => pick(TOGETHER.three) : pool;

  // 1. the first one arrives and gets started
  add(chance(0.6) ? pick(pers[0].arrive) : pick(ARRIVE));
  add(revealAt(order[0], vis[0], pick), { reveal: true });
  add(at(order[0], pick(TEASE[order[0]])));
  add(at(order[0], pick((ENTRY[vis[0].type] || ENTRY.human)[order[0]] || ENTRY.human[order[0]])));
  if (BIG(vis[0]) && STRETCH[order[0]]) add(at(order[0], pick(STRETCH[order[0]])));
  add(at(order[0], pick(RHYTHM[order[0]].early)));
  add(pick(REACT[order[0]].early));

  // 2. the others join, one at a time
  for (let i = 1; i < order.length; i++) {
    add((i === 1 ? pick(JOIN2) : pick(JOIN3)).replace("%where", SIDE[order[i]]));
    add(revealAt(order[i], vis[i], pick), { reveal: true });
    add(at(order[i], pick((ENTRY[vis[i].type] || ENTRY.human)[order[i]] || ENTRY.human[order[i]])));
    if (BIG(vis[i]) && STRETCH[order[i]]) add(at(order[i], pick(STRETCH[order[i]])));
    add(i === 2 ? pick(TOGETHER.three) : pool());
  }

  // 3. the middle: movin' between them, with lines about all of them at once
  const rounds = 4 + Math.floor(Math.random() * 4);
  for (let r = 0; r < rounds; r++) {
    const i = r % order.length, h = order[i];
    add(at(h, pick(RHYTHM[h].mid)));
    if (chance(0.6)) add(at(h, pick(TYPE_RHYTHM[vis[i].type])));
    add(pick(REACT[h].mid));
    add(chance(0.6) ? first() : talk(i));
    if (chance(0.3)) add(voice() || (chance(0.5) ? pick(ATMOS) : null));
  }

  // 4. late: everyone speeds up
  for (let i = 0; i < order.length; i++) add(at(order[i], pick(RHYTHM[order[i]].late)));
  add(pick(REACT[order[0]].late));
  add(pick(BUILD));

  // 5. the finishes, in an order that makes sense: sometimes two together, otherwise one after another
  const load = (v) => { const [lo, hi] = SIZES[v.size].ml; return Math.round(between(lo, hi) * (LOAD_X[v.type] || 1)); };
  const finishOne = (i) => {
    const v = vis[i], h = order[i], inside = v.type === "canine" || chance(0.65), ml = load(v);
    add(finishLine(v, h, ml, inside, false), { finish: true, inside, ml, hole: h, visitor: v });
    return inside;
  };
  const insides = [];
  let i0 = 0;
  if (order.length >= 2 && chance(0.3)) {
    add(pick(BOTH_AT_ONCE));
    insides.push(finishOne(0), finishOne(1));
    i0 = 2;
  } else {
    insides.push(finishOne(0));
    i0 = 1;
  }
  for (let i = i0; i < order.length; i++) {
    add(pick(FIRST_DONE));
    add(at(order[i], pick(RHYTHM[order[i]].late)));
    if (chance(0.5)) add(talk(i));
    add(pick(BUILD));
    insides.push(finishOne(i));
  }

  // 6. after: a knot that ties, the mess at each hole, and they leave
  const knotted = order.findIndex((h, i) => vis[i].type === "canine" && insides[i]);
  if (knotted >= 0) add(pick(KNOT_TIE.slice(0, 3)));
  for (let i = 0; i < order.length; i++) if (insides[i] && chance(0.7)) add(pick(AFTER.inside[order[i]]));
  if (knotted >= 0) add(KNOT_TIE[3]);
  add(voice());
  add(pick(ALL_DONE));
}

// ── how they're arranged in the stall, and how the scene follows from it ──────────
// Asked for: a scene that opens by telling them how they're set up (punished, bound, or there by choice), and
// that carries on from it. punished: on a punishment shift (locked in, rougher strangers, no way out). bound:
// already tied up when they stepped in. voluntary: they put themselves there.
const ARRANGE = {
  punished: {
    open: [
      "The punishment frame closes around %n with a heavy clunk: neck and wrists pinned in the board, hips strapped down, every hole turned toward the hatches. Nobody asked %n what they wanted today.",
      "A farmhand buckles %n into the stall's punishment rig and tugs every strap twice. %n can't stand, can't turn, can't hide. The sign on the door says USE FREELY.",
      "%n is bent over the padded bar and locked there, ankles held apart by a bar bolted to the floor. The shift clock on the wall starts ticking.",
      "The stocks board drops into place over %n's neck and wrists. Behind them, the hatches slide open one by one. This is a punishment, and the whole barn knows it.",
      "%n is strapped in face first against the wall, hips held up by a padded sling, and left there. Whoever comes by gets to use %n however they like, for as long as the shift lasts.",
      "The punishment stall's door is locked behind %n. Cuffs at the wrists, a strap across the back, the hatches open. A stick of chalk hangs by the tally board for the strangers to keep count.",
    ],
    remind: [
      "The straps creak as %n is shoved forward, and they hold %n exactly where the stranger wants them.",
      "%n couldn't pull away if they tried. The frame makes sure of that.",
      "Somebody outside reads the punishment sign out loud and laughs.",
      "The stocks board digs into %n's neck with every thrust. There's nowhere to go.",
      "A passing farmhand checks the straps, finds them tight, and leaves %n to it.",
      "The chalk squeaks on the tally board as another mark goes up beside %n's name.",
      "%n's cuffed hands open and close on nothing. That's all the say they get today.",
    ],
    close: [
      "The frame stays locked. The shift isn't over just because one stranger is.",
      "%n hangs in the straps, used and dripping, waiting for whoever's next whether they like it or not.",
      "Another chalk mark on the board. Still locked in. Still on the clock.",
      "Nobody comes to let %n out. The hatches stay open.",
    ],
  },
  bound: {
    open: [
      "Bound as they already are, %n is guided down onto the stall's padded kneeler and left there, helpless and on display.",
      "With their arms already tied, all %n can do is kneel where they're put. A farmhand nudges them right up against the hatch and walks away.",
      "%n is led into the stall in their bonds and bent over the bench, a strap cinched across their back to keep them there.",
      "Tied up and put on show, %n is arranged on the stall's bench like a gift waiting to be unwrapped.",
      "A farmhand takes %n by their bonds, steers them into the stall and positions them just so, then latches the door.",
    ],
    remind: [
      "%n pulls at their bonds without meaning to. They hold, of course.",
      "Tied the way they are, %n can't do a thing to slow the stranger down.",
      "The ropes creak in time with every thrust into %n.",
      "%n squirms in their bonds, which only makes the stranger grip them harder.",
      "Bound and kept in place, %n just has to take whatever comes through the hatch.",
    ],
    close: [
      "Still tied, %n is left exactly where they were put, waiting for the next one.",
      "Nobody unties %n. They're not finished being used yet.",
      "%n stays bound and dripping, right where the farmhand left them.",
    ],
  },
  voluntary: {
    open: {
      kneel: ["%n kneels on the soft mat in front of the low hatch, hands folded in their lap, mouth already open and waiting.",
              "%n settles onto their knees by the hatch all on their own and rests their cheek against the warm wood to wait.",
              "%n kneels at the hatch with their hands behind their back, nobody's rule but their own."],
      bench: ["%n bends over the padded bench by choice, hips up, and reaches back to spread themselves for whoever comes.",
              "%n climbs onto the stall's bench, rests their chest on the cushion and settles their ass right up against the hatch. Nobody made them.",
              "%n lies over the bench and lets their legs fall open, offered up and waiting."],
      fours: ["%n gets down on all fours in the straw, backed up to the hatch, and waits like a good farm animal.",
              "%n drops to hands and knees in the stall and eases back until they feel the cool air of the hatch on their skin."],
      wall:  ["%n presses themselves flat to the hatch wall, lined up with the openings, and holds very still.",
              "%n stands in the stall with their hands on the beam overhead, back arched, offered up to the hatches."],
    },
    remind: [
      "%n stays exactly where they put themselves, nothing holding them there but how much they want it.",
      "Nothing's holding %n in place. They stay anyway.",
      "The stall door is unlatched right behind %n. They don't even look at it.",
      "%n could step off the spot whenever they like. They don't.",
    ],
    close: [
      "%n stays right where they are, still in position, waiting for whoever's next.",
      "%n doesn't move. They came here for this, and they're not done.",
      "The stranger's gone. %n settles back into position, ready for more.",
    ],
  },
};
// wrap a built scene in its arrangement: the opening first, a couple of reminders in the middle, the closing last
function arrange(beats, setup, firstHole, pick) {
  const A = ARRANGE[setup];
  if (!A) return;
  const open = setup === "voluntary"
    ? pick(A.open[firstHole === "mouth" ? pickFrom(["kneel", "kneel", "wall"]) : pickFrom(["bench", "fours", "wall"])])
    : pick(A.open);
  const firstFinish = beats.findIndex((b) => b.finish);
  const end = firstFinish > 0 ? firstFinish : beats.length;
  // reminders at about a third and two thirds of the way to the first finish (never before the cock shows up)
  const spots = [Math.floor(end / 3), Math.floor((2 * end) / 3)].filter((i) => i > 3).sort((a, b) => b - a);
  for (const i of spots) beats.splice(i, 0, { t: pick(A.remind) });
  beats.unshift({ t: open });
  beats.push({ t: pick(A.close) });
}

// a whole scene. Most are one stranger; some take extra rounds; now and then a queue takes turns.
// And sometimes, when they have more than one hole open, two or three strangers use them at once (together).
export function buildScene({ hole, visitor, funnel, degrade, praise, holes, length, setup }) {
  const beats = [], open = holes && holes.length ? holes : [hole], pick = freshPicker();
  // together needs two holes a cock can get into (a funnel gag keeps the mouth out of it) and a single-cock first stranger
  const usable = open.filter((h) => h !== "mouth" || !funnel);
  const canTogether = usable.length >= 2 && visitor.type !== "double" && usable.includes(hole);
  // a punishment shift runs longer: more strangers, more rounds
  const r = setup === "punished" ? 0.3 + Math.random() * 0.7 : Math.random();
  let kind = length || (r < 0.45 ? "single" : r < 0.7 ? "long" : r < 0.88 && canTogether ? "together" : r < 0.88 ? "long" : "marathon");
  if (kind === "together" && !canTogether) kind = "long";
  if (kind === "together") {
    together(beats, { hole, visitor, holes: usable, degrade, praise, pick, rough: setup === "punished" });
    arrange(beats, setup, hole, pick);
    const fin = beats.filter((b) => b.finish);
    return { beats, kind, ml: fin.reduce((a, b) => a + b.ml, 0), inside: fin.some((b) => b.inside) };
  }
  const rounds = () => (kind === "single" ? 0 : 1 + Math.floor(Math.random() * 2));
  oneVisitor(beats, { hole, visitor, funnel, degrade, praise, rounds: rounds(), first: true, holes: open, pick, rough: setup === "punished" });
  if (kind === "marathon") {
    const more = 2 + Math.floor(Math.random() * 2);   // two or three more strangers
    for (let i = 0; i < more; i++) {
      const v = pickVisitor(open);
      const h = v.type === "double" ? "vulva" : pickFrom(open);
      oneVisitor(beats, { hole: h, visitor: v, funnel: funnel && h === "mouth", degrade, praise, rounds: Math.random() < 0.4 ? 1 : 0, first: false, holes: open, pick, rough: setup === "punished" });
    }
  }
  arrange(beats, setup, hole, pick);
  const finishes = beats.filter((b) => b.finish);
  return { beats, kind, ml: finishes.reduce((a, b) => a + b.ml, 0), inside: finishes.some((b) => b.inside) };
}

// a real visitor: a shorter scene from the same pools, with their own cock and their own load
export function buildRealScene({ hole, visitor, funnel, ml, inside }) {
  const pick = freshPicker();
  if (hole === "mouth" && funnel) return [pick(REVEAL[visitor.type]).replace("%size", SIZE_WORD[visitor.size]), pick(FUNNEL), pick(FUNNEL), finishLine(visitor, hole, ml, true, true)];
  return [
    pick(REVEAL[visitor.type]).replace("%size", SIZE_WORD[visitor.size]),
    pick((ENTRY[visitor.type] || ENTRY.human)[hole] || ENTRY.human[hole]),
    pick(RHYTHM[hole].mid),
    pick(TYPE_RHYTHM[visitor.type]),
    finishLine(visitor, hole, ml, inside, funnel),
  ];
}
