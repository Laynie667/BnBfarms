/* WHAT'S IN THIS FILE (glory-stalls/scenes.js)
   The glory stall scenes, built fresh every time from pools of lines, so they rarely repeat:
     arrival → who comes through the hole (their kind of cock, and its size) → teasing → entry →
     rhythm → build-up → the finish (where, and how much) → aftermath → the stranger leaves,
   with atmosphere (smells, sounds, the stall itself) and, for ?degrade or ?praise people, voices
   through the wall woven in between. About 11–14 beats, 22–32 seconds apart: five minutes or so.

   Kinds of cock (the farm's own types): human, canine (knot, ties), equine (flared, floods),
   feline (barbed), draconic (ridged), double (two at once, pussy and ass).
   Sizes: modest, thick, huge, hyper. The load follows both.

   Writing more: add lines to any pool below. %n is the person in the stall. In a line with d: the d text
   is used for people with ?degrade on; p: for ?praise on. Every line should name %n, or be about the
   stall around them. No round brackets (they'd make the line out-of-character).
*/

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const between = (lo, hi) => lo + Math.random() * (hi - lo);
const chance = (p) => Math.random() < p;

// ── who comes to the hole ─────────────────────────────────
export const TYPES = {
  human:    { w: 34, word: "cock" },
  canine:   { w: 18, word: "canine cock", knot: true },
  equine:   { w: 14, word: "horse cock", flare: true },
  feline:   { w: 10, word: "barbed cock" },
  draconic: { w: 10, word: "ridged cock" },
  double:   { w: 6,  word: "pair of cocks" },
};
export const SIZES = { modest: { w: 30, ml: [10, 20] }, thick: { w: 34, ml: [18, 35] }, huge: { w: 24, ml: [30, 60] }, hyper: { w: 12, ml: [60, 140] } };
const LOAD_X = { human: 1, canine: 1.2, equine: 1.6, feline: 0.9, draconic: 1.3, double: 1.5 };

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

// ── the pools ──────────────────────────────────────────────
const ARRIVE = [
  "Footsteps slow outside %n's stall, stop, shuffle closer. Someone is reading the chalk on the door.",
  "The latch on the outer door clacks. Heavy boots, then breathing right up against the boards in front of %n.",
  "A shadow slides across the slats of %n's stall. It stops at the hole and stays there.",
  "Two knocks on the wall beside %n's head, then a third, impatient. Somebody wants service.",
  "A belt buckle jingles on the other side of the wall. Then a zipper, slow, like they want %n to hear it.",
  "Someone spits into their palm outside %n's stall. The wet sound of a hand working, getting ready.",
  "The boards in front of %n creak as somebody leans their whole weight against them, already breathing hard.",
  "A low voice on the other side: \"This one free?\" Nobody answers. The footsteps come closer anyway.",
  "Something sniffs at the hole in %n's stall, long and curious, warm breath puffing through.",
  "The stall row goes quiet for a moment, then hooves, or boots, %n can't tell, clop right up to the hole.",
];
const REVEAL = {
  human:    ["A %size cock pushes through the hole, flushed dark and already hard, a bead of precum shining at the tip.",
             "Through the hole comes a %size cock, veined and twitching, the foreskin sliding back as it nudges toward %n."],
  canine:   ["A slick red canine cock slides through, tapered to a point and dripping, %size, with a knot already swelling thick at the base.",
             "Something pink-red and pointed pokes through the hole, %size and slick, pulsing little spurts of clear fluid, the knot behind it fat and promising."],
  equine:   ["A horse cock shoves through the hole, %size, mottled pink and black, the broad flat head twitching and starting to flare.",
             "The hole barely fits it: a long, heavy horse cock, %size, the flared head bobbing an inch from %n and dripping on the straw."],
  feline:   ["A short, thick cock pokes through, %size, ringed with soft little barbs that catch the light like velvet thorns.",
             "Through the hole comes a cat-like cock, %size, its barbed sides glistening, twitching with quick little throbs."],
  draconic: ["A ridged cock slides through the hole, %size, scaled at the base, its ridges stacked like rungs all the way to a tapered tip.",
             "Something warm and ridged pushes through, %size, hot as a stove, the ridges flexing as it searches for %n."],
  double:   ["Two cocks slide through a widened hole, one above the other, %size, both hard, both looking for somewhere to go.",
             "The stranger has two, stacked and twitching, %size each, and they press through the hole together."],
};
const SIZE_WORD = { modest: "neat, modest", thick: "thick", huge: "huge", hyper: "absurdly huge" };
const TEASE = {
  mouth: ["It rubs across %n's lips, smearing precum until they shine, then slaps wetly against %n's cheek.",
          "It rests on %n's tongue, heavy and salty, letting %n taste it before doing anything else.",
          "The tip traces %n's lips around and around, teasing, pulling back every time %n leans in.",
          "It pushes against %n's mouth until %n's lips part, then holds there, throbbing, making %n wait."],
  vulva: ["The head drags up and down through %n's pussy, slow, gathering wet, bumping %n's clit on every pass.",
          "It slaps against %n's pussy a few times, wet little smacks, before settling at the entrance.",
          "It nudges %n's folds apart and rubs there, teasing the entrance until %n's hips push back on their own.",
          "The stranger grinds the shaft along %n's slit without going in, and %n can feel every inch of it."],
  butt:  ["Spit, then the tip circles %n's ass, pressing, easing off, pressing again until the ring starts to give.",
          "Slick, cold lube drips down %n's crack before the head presses against their ass, patient and insistent.",
          "It rubs against %n's ass in slow circles, working the rim soft before it even tries.",
          "The head pushes and pulls back, pushes and pulls back, coaxing %n's ass open one little bit at a time."],
};
const ENTRY = {
  human:    { mouth: ["It slides over %n's tongue and keeps going until %n's lips meet the wood."], vulva: ["It sinks into %n's pussy in one long push, the stranger groaning through the boards."], butt: ["It pushes past %n's ring with a slow, burning stretch and settles deep."] },
  canine:   { mouth: ["The pointed tip slips straight to the back of %n's throat, quick and eager, already spurting little warm jets."],
              vulva: ["It plunges into %n's pussy in one quick thrust and starts at once, hot little spurts with every jab."],
              butt:  ["It jabs into %n's ass with no warning at all and starts going, the knot bumping against the rim with every push."] },
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
const RHYTHM = {
  mouth: ["It fucks %n's mouth with long strokes, pulling almost all the way out before sliding back over %n's tongue.",
          "The stranger holds deep and grinds, rocking against the back of %n's throat, letting %n choke a little.",
          "Drool runs down %n's chin and drips onto their chest as the pace picks up.",
          "It pulls out to let %n gasp, slaps their tongue twice, and slides right back in.",
          "Fingers curl through the hole and catch in %n's hair, keeping %n's face pressed to the wood."],
  vulva: ["It pumps into %n's pussy with steady, deep strokes, the wall creaking in time.",
          "The stranger finds the angle that makes %n gasp and stays right there, hammering it.",
          "Wet, slapping sounds fill the stall. %n's thighs are slick and shaking.",
          "It slows to deep, grinding circles, buried as far as it'll go, then speeds back up without warning.",
          "Every thrust rocks %n forward against the stall. %n has to brace on the rail to keep still."],
  butt:  ["It works %n's ass with long, steady strokes, dragging almost out before sinking back to the root.",
          "The pace turns rough. %n's ass is used hard, the boards thumping against their frame.",
          "It holds deep in %n's ass, grinding, letting %n feel how full they are.",
          "Short, quick thrusts, then a long slow one that makes %n moan into the straw.",
          "The stranger's hips slap against the wall again and again, driving every stroke deep into %n."],
};
const TYPE_RHYTHM = {
  human:    ["The stranger grunts with every thrust, the sound muffled by the boards.", "A hand slaps the wall above %n, holding on for leverage."],
  canine:   ["It humps in a frantic, blurring rhythm, the knot slapping against %n with every jab, swelling bigger.", "Little hot spurts keep coming with every thrust, making %n slicker and slicker."],
  equine:   ["Each stroke is slow and heavy, like being worked by a piston, and %n feels every inch of it all the way down.", "The flare is already blooming, catching and dragging inside %n on every pull back."],
  feline:   ["Short, sharp thrusts, the barbs raking softly every time it pulls back, making %n jerk and gasp.", "It's quick and relentless, all hips, and those barbs make every stroke feel like ten."],
  draconic: ["The ridges drag in and out, in and out, each one catching on its way through %n with a thick little pop.", "It's hot inside %n, hotter than any cock should be, and it seems to swell with every stroke."],
  double:   ["The two cocks take turns, one pushing in as the other pulls back, so %n is never empty for a second.", "Both thrust together, and %n is pinned between them against the wall."],
};
const BUILD = [
  "The stranger's breathing goes ragged and fast. The wall shudders.",
  "A groan rolls through the boards, deep and desperate. They're close.",
  "The thrusts lose their rhythm, short and jerky. Hands clamp the edges of the hole.",
  "\"Fuck, fuck, here it comes,\" from the other side of the wall, barely a whisper.",
  "Everything goes tight and still for one long second, the stranger trembling against the boards.",
];
const AMOUNT = (ml) => ml < 15 ? "a thin little dribble" : ml < 30 ? "a decent, warm load" : ml < 60 ? "a thick, heavy load" : ml < 100 ? "a huge, pumping flood" : "an absurd, never-ending flood";
const HOLE_PLACE = { mouth: "%n's throat", vulva: "%n's pussy", butt: "%n's ass" };
const OUTSIDE = { mouth: ["%n's face", "%n's lips and chin", "%n's tongue and cheeks", "%n's hair and face"],
                  vulva: ["%n's ass and thighs", "%n's back", "the lips of %n's pussy", "%n's ass cheeks"],
                  butt: ["%n's back", "%n's ass cheeks", "the small of %n's back", "%n's thighs"] };
function finishLine(v, hole, ml, inside, funnel) {
  const amt = AMOUNT(ml) + ", about " + Math.round(ml) + " mL";
  if (hole === "mouth" && funnel) return "The stranger cums straight into the funnel: " + amt + ", pouring down the tube and into %n's throat whether %n swallows or not.";
  if (!inside) return "At the last second it pulls out and paints " + pick(OUTSIDE[hole]) + ": " + amt + ", hot ropes landing one after another.";
  const place = HOLE_PLACE[hole];
  switch (v.type) {
    case "canine": return "The knot shoves in and locks, and the stranger cums deep into " + place + ": " + amt + ", pumped in pulse after pulse while they're tied together.";
    case "equine": return "The flare blooms wide inside " + place + " and the horse cock floods it: " + amt + ", so much it pushes back out around the shaft.";
    case "feline": return "It cums in quick hard jerks deep in " + place + ": " + amt + ", and the barbs rake every inch of %n on the way out.";
    case "draconic": return "Every ridge swells and throbs at once as it empties into " + place + ": " + amt + ", hot as bathwater.";
    case "double": return "Both cocks unload at once, one into %n's pussy and one into %n's ass: " + amt + " between them, filling %n from both ends.";
    default: return "It buries itself to the hilt and cums deep in " + place + ": " + amt + ", throbbing with every spurt.";
  }
}
const KNOT_TIE = ["The knot won't come free. %n is stuck to the wall, tied, the stranger panting on the other side, cum trapped deep inside.",
                  "Tied fast. Every little shift of the stranger tugs at %n from the inside, and there's nothing to do but wait for the knot to go down."];
const AFTER = {
  inside: { mouth: ["%n swallows and swallows, and still some escapes down their chin.", "The taste lingers, thick and salty, coating %n's tongue."],
            vulva: ["When it slides out, warm cum runs down %n's thighs in slow, sticky trails.", "%n's pussy twitches and leaks, the load sitting heavy and warm inside them."],
            butt:  ["It pulls out with a wet pop and %n's ass gapes for a moment before it starts to leak.", "%n can feel it settle deep in their belly, warm and heavy."] },
  outside: ["%n is left sticky and dripping, cum cooling on their skin.", "It drips slowly off %n onto the straw. Nobody's coming to wipe it off."],
};
const LEAVE = [
  "A zipper, a satisfied sigh, and the footsteps fade down the row.",
  "A pat on the boards above %n's head, almost fond, and the stranger is gone.",
  "\"Good stall,\" mutters the stranger, and walks off whistling.",
  "Hooves clatter away down the aisle. Someone's already shuffling up to take their place.",
  "The outer door bangs shut. %n is alone again, dripping, waiting for whoever's next.",
  "Somebody chalks another mark on the outside of %n's stall before they go.",
];
// the stall around them: smells, sounds, the feel of the place (also when nobody's at the hole)
export const ATMOS = [
  "The stall smells of sweat, straw and old cum, thick in the warm air.",
  "Somebody's cheap strawberry lube is drifting in from the next stall over.",
  "A muffled moan from further down the row, then a rhythmic thump against the boards.",
  "Rain drums on the tin roof above the stalls, and the air in %n's booth turns damp and close.",
  "Somewhere outside, the cows low and a gate clanks shut.",
  "A cool draft blows in through the hole and raises goosebumps across %n's skin.",
  "The boards under %n's knees are worn smooth and a little sticky.",
  "Light falls through the slats in thin gold stripes across %n's body.",
  "Two voices chat right outside, as if nobody's in here at all, then move along.",
  "Musk hangs in the air, heavy and animal. Somebody's been busy all afternoon.",
  "A farmhand's broom swishes past outside, then stops, then moves on.",
  "The stall next door creaks and rattles in a steady rhythm. Someone's getting used hard.",
  "A fly buzzes lazily around %n's stall and settles on the rail.",
  "The faint smell of hay, leather and somebody's cologne drifts in through the hole.",
  "Shadows of legs shuffle past the gap under the door: somebody's waiting their turn.",
  "Somewhere a door latch clicks, and %n's stomach flips, waiting to see if it's for them.",
];
export const TAUNTS = [
  "\"Fuck, you're good at this.\"",
  "\"They keep you well used in here, don't they.\"",
  "\"Look at that. Made for a wall.\"",
  "\"Whose cow is this? I'm coming back for more.\"",
  "\"Dripping already. Desperate little thing.\"",
  "\"Hold still. You're just somewhere warm to finish.\"",
  "\"I'm telling everyone about this stall.\"",
  "\"Moo for me. Go on.\"",
  "\"Doesn't even need a face. Just this.\"",
  "\"You'll be leaking all day, and you'll love it.\"",
];
export const PRAISES = [
  "\"God, you're good. Thank you.\"",
  "\"Best stall on the farm, honestly.\"",
  "\"That's it, that's perfect, you're perfect.\"",
  "\"So good. So, so good.\"",
];

// ── put a scene together ───────────────────────────────────
export function buildScene({ hole, visitor, funnel, degrade, praise }) {
  const v = visitor, beats = [];
  const voice = () => (degrade && chance(0.4) ? "A voice through the boards: " + pick(TAUNTS) : praise && chance(0.4) ? "A voice through the boards: " + pick(PRAISES) : null);
  const atmos = () => (chance(0.35) ? pick(ATMOS) : null);
  const add = (t, extra) => { if (t) beats.push(Object.assign({ t }, extra || {})); };
  // double needs both pussy and ass; if it's the mouth, the second one waits outside
  add(pick(ARRIVE));
  add(atmos());
  add(pick(REVEAL[v.type]).replace("%size", SIZE_WORD[v.size]));
  add(pick(TEASE[hole]));
  if (chance(0.5)) add(pick(TEASE[hole]));
  add(pick((ENTRY[v.type] || ENTRY.human)[hole] || ENTRY.human[hole]));
  const rh = RHYTHM[hole].slice().sort(() => Math.random() - 0.5);
  add(rh[0]); add(pick(TYPE_RHYTHM[v.type])); add(voice() || atmos()); add(rh[1]);
  if (chance(0.5)) add(rh[2]);
  add(pick(BUILD));
  // where it ends: inside most of the time, sometimes pulled out (never for a knot or a funnel)
  const inside = funnel || v.type === "canine" || v.type === "double" || chance(0.75);
  const [lo, hi] = SIZES[v.size].ml;
  const ml = Math.round(between(lo, hi) * (LOAD_X[v.type] || 1));
  add(finishLine(v, hole, ml, inside, funnel), { finish: true, inside, ml });
  if (inside && v.type === "canine") add(pick(KNOT_TIE));
  add(inside ? pick(AFTER.inside[hole]) : pick(AFTER.outside));
  add(voice());
  add(pick(LEAVE));
  return { beats, ml, inside };
}

// a real visitor: a shorter scene from the same pools, with their own cock and their own load
export function buildRealScene({ hole, visitor, funnel, ml, inside }) {
  return [
    pick(REVEAL[visitor.type]).replace("%size", SIZE_WORD[visitor.size]),
    pick((ENTRY[visitor.type] || ENTRY.human)[hole] || ENTRY.human[hole]),
    pick(RHYTHM[hole]),
    pick(TYPE_RHYTHM[visitor.type]),
    finishLine(visitor, hole, ml, inside, funnel),
  ];
}
