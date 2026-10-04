// ==UserScript==
// @name         BnB Farm add-on: Glory stalls
// @namespace    bnbfarm
// @version      1.1.0
// @description  Glory stall spots: simulated ~5 minute scenes every 10-30 minutes, real visitors, shifts, punishment shifts and a board. Runs on the farm bot's computer, next to the Farmhand Bot script.
// @author       Laynie & Alexia
// @match        *://*.bondageprojects.elementfx.com/*
// @match        *://bondageprojects.elementfx.com/*
// @match        *://*.bondage-europe.com/*
// @match        *://bondage-europe.com/*
// @match        *://*.bondageprojects.com/*
// @match        *://bondageprojects.com/*
// @match        *://*.bondage-asia.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(() => {
  // addons/_lib/connect.js
  var W = typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : window;
  function connect(def) {
    let done = false;
    const go = () => {
      if (done || !W.Farmhand || !W.Farmhand.register) return;
      done = true;
      try {
        W.Farmhand.register(def);
      } catch (e) {
        console.warn("[Farmhand add-on " + def.name + "] couldn't plug in:", e);
      }
    };
    if (W.Farmhand && W.Farmhand.register) go();
    else {
      W.addEventListener("farmhand:ready", go);
      let n = 0;
      const t = setInterval(() => {
        go();
        if (done || ++n > 60) clearInterval(t);
      }, 1e3);
    }
  }
  var pick = (list) => list[Math.floor(Math.random() * list.length)];
  var between = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  var fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => vars[k] !== void 0 ? vars[k] : m);

  // addons/glory-stalls/scenes.js
  var pick2 = (a) => a[Math.floor(Math.random() * a.length)];
  var between2 = (lo, hi) => lo + Math.random() * (hi - lo);
  var chance = (p) => Math.random() < p;
  var TYPES = {
    human: { w: 34, word: "cock" },
    canine: { w: 18, word: "canine cock", knot: true },
    equine: { w: 14, word: "horse cock", flare: true },
    feline: { w: 10, word: "barbed cock" },
    draconic: { w: 10, word: "ridged cock" },
    double: { w: 6, word: "pair of cocks" }
  };
  var SIZES = { modest: { w: 30, ml: [10, 20] }, thick: { w: 34, ml: [18, 35] }, huge: { w: 24, ml: [30, 60] }, hyper: { w: 12, ml: [60, 140] } };
  var LOAD_X = { human: 1, canine: 1.2, equine: 1.6, feline: 0.9, draconic: 1.3, double: 1.5 };
  function pickVisitor(holes) {
    const types = Object.entries(TYPES).filter(([k]) => k !== "double" || holes.includes("vulva") && holes.includes("butt"));
    let r = Math.random() * types.reduce((a, [, t]) => a + t.w, 0), type = "human";
    for (const [k, t] of types) {
      r -= t.w;
      if (r <= 0) {
        type = k;
        break;
      }
    }
    const sz = Object.entries(SIZES);
    let s = Math.random() * sz.reduce((a, [, x]) => a + x.w, 0), size = "thick";
    for (const [k, x] of sz) {
      s -= x.w;
      if (s <= 0) {
        size = k;
        break;
      }
    }
    if (type === "equine" && size === "modest") size = "thick";
    return { type, size };
  }
  function sizeFromInches(inches) {
    return inches >= 13 ? "hyper" : inches >= 9 ? "huge" : inches >= 6 ? "thick" : "modest";
  }
  var ARRIVE = [
    "Footsteps slow outside %n's stall, stop, shuffle closer. Someone is reading the chalk on the door.",
    "The latch on the outer door clacks. Heavy boots, then breathing right up against the boards in front of %n.",
    "A shadow slides across the slats of %n's stall. It stops at the hole and stays there.",
    "Two knocks on the wall beside %n's head, then a third, impatient. Somebody wants service.",
    "A belt buckle jingles on the other side of the wall. Then a zipper, slow, like they want %n to hear it.",
    "Someone spits into their palm outside %n's stall. The wet sound of a hand working, getting ready.",
    "The boards in front of %n creak as somebody leans their whole weight against them, already breathing hard.",
    'A low voice on the other side: "This one free?" Nobody answers. The footsteps come closer anyway.',
    "Something sniffs at the hole in %n's stall, long and curious, warm breath puffing through.",
    "The stall row goes quiet for a moment, then hooves, or boots, %n can't tell, clop right up to the hole."
  ];
  var REVEAL = {
    human: [
      "A %size cock pushes through the hole, flushed dark and already hard, a bead of precum shining at the tip.",
      "Through the hole comes a %size cock, veined and twitching, the foreskin sliding back as it nudges toward %n."
    ],
    canine: [
      "A slick red canine cock slides through, tapered to a point and dripping, %size, with a knot already swelling thick at the base.",
      "Something pink-red and pointed pokes through the hole, %size and slick, pulsing little spurts of clear fluid, the knot behind it fat and promising."
    ],
    equine: [
      "A horse cock shoves through the hole, %size, mottled pink and black, the broad flat head twitching and starting to flare.",
      "The hole barely fits it: a long, heavy horse cock, %size, the flared head bobbing an inch from %n and dripping on the straw."
    ],
    feline: [
      "A short, thick cock pokes through, %size, ringed with soft little barbs that catch the light like velvet thorns.",
      "Through the hole comes a cat-like cock, %size, its barbed sides glistening, twitching with quick little throbs."
    ],
    draconic: [
      "A ridged cock slides through the hole, %size, scaled at the base, its ridges stacked like rungs all the way to a tapered tip.",
      "Something warm and ridged pushes through, %size, hot as a stove, the ridges flexing as it searches for %n."
    ],
    double: [
      "Two cocks slide through a widened hole, one above the other, %size, both hard, both looking for somewhere to go.",
      "The stranger has two, stacked and twitching, %size each, and they press through the hole together."
    ]
  };
  var SIZE_WORD = { modest: "neat, modest", thick: "thick", huge: "huge", hyper: "absurdly huge" };
  var TEASE = {
    mouth: [
      "It rubs across %n's lips, smearing precum until they shine, then slaps wetly against %n's cheek.",
      "It rests on %n's tongue, heavy and salty, letting %n taste it before doing anything else.",
      "The tip traces %n's lips around and around, teasing, pulling back every time %n leans in.",
      "It pushes against %n's mouth until %n's lips part, then holds there, throbbing, making %n wait."
    ],
    vulva: [
      "The head drags up and down through %n's pussy, slow, gathering wet, bumping %n's clit on every pass.",
      "It slaps against %n's pussy a few times, wet little smacks, before settling at the entrance.",
      "It nudges %n's folds apart and rubs there, teasing the entrance until %n's hips push back on their own.",
      "The stranger grinds the shaft along %n's slit without going in, and %n can feel every inch of it."
    ],
    butt: [
      "Spit, then the tip circles %n's ass, pressing, easing off, pressing again until the ring starts to give.",
      "Slick, cold lube drips down %n's crack before the head presses against their ass, patient and insistent.",
      "It rubs against %n's ass in slow circles, working the rim soft before it even tries.",
      "The head pushes and pulls back, pushes and pulls back, coaxing %n's ass open one little bit at a time."
    ]
  };
  var ENTRY = {
    human: { mouth: ["It slides over %n's tongue and keeps going until %n's lips meet the wood."], vulva: ["It sinks into %n's pussy in one long push, the stranger groaning through the boards."], butt: ["It pushes past %n's ring with a slow, burning stretch and settles deep."] },
    canine: {
      mouth: ["The pointed tip slips straight to the back of %n's throat, quick and eager, already spurting little warm jets."],
      vulva: ["It plunges into %n's pussy in one quick thrust and starts at once, hot little spurts with every jab."],
      butt: ["It jabs into %n's ass with no warning at all and starts going, the knot bumping against the rim with every push."]
    },
    equine: {
      mouth: ["The flat head forces %n's jaw wide, wider, and slides in only as far as %n's mouth can possibly take."],
      vulva: ["The broad head stretches %n's pussy wide, so slowly, a few inches at a time, until %n is stuffed and gasping."],
      butt: ["The blunt head presses and presses until %n's ass gives around it with a gasp, stretched past anything %n is used to."]
    },
    feline: {
      mouth: ["It slides over %n's tongue, the barbs a soft prickling drag, strange and ticklish."],
      vulva: ["It pushes into %n's pussy and every barb drags along the inside, a velvety rasp that makes %n twitch."],
      butt: ["It slides into %n's ass and the barbs scrape gently on the way in, a prickling, maddening drag."]
    },
    draconic: {
      mouth: ["Ridge after ridge pops past %n's lips, each one a little thicker than the last, until %n's mouth is full of it."],
      vulva: ["It works into %n's pussy one ridge at a time, each ring popping in with a little jolt that %n feels to the core."],
      butt: ["It pushes into %n's ass ridge by ridge, every ring stretching %n and then slipping in with a thick, filthy pop."]
    },
    double: {
      vulva: ["Both press in at once, one into %n's pussy, one into %n's ass, and %n is stuffed full twice over."],
      butt: ["Both press in at once, one into %n's pussy, one into %n's ass, and %n is stuffed full twice over."],
      mouth: ["One slides into %n's mouth while the other slaps wetly against %n's cheek, waiting its turn."]
    }
  };
  var RHYTHM = {
    mouth: [
      "It fucks %n's mouth with long strokes, pulling almost all the way out before sliding back over %n's tongue.",
      "The stranger holds deep and grinds, rocking against the back of %n's throat, letting %n choke a little.",
      "Drool runs down %n's chin and drips onto their chest as the pace picks up.",
      "It pulls out to let %n gasp, slaps their tongue twice, and slides right back in.",
      "Fingers curl through the hole and catch in %n's hair, keeping %n's face pressed to the wood."
    ],
    vulva: [
      "It pumps into %n's pussy with steady, deep strokes, the wall creaking in time.",
      "The stranger finds the angle that makes %n gasp and stays right there, hammering it.",
      "Wet, slapping sounds fill the stall. %n's thighs are slick and shaking.",
      "It slows to deep, grinding circles, buried as far as it'll go, then speeds back up without warning.",
      "Every thrust rocks %n forward against the stall. %n has to brace on the rail to keep still."
    ],
    butt: [
      "It works %n's ass with long, steady strokes, dragging almost out before sinking back to the root.",
      "The pace turns rough. %n's ass is used hard, the boards thumping against their frame.",
      "It holds deep in %n's ass, grinding, letting %n feel how full they are.",
      "Short, quick thrusts, then a long slow one that makes %n moan into the straw.",
      "The stranger's hips slap against the wall again and again, driving every stroke deep into %n."
    ]
  };
  var TYPE_RHYTHM = {
    human: ["The stranger grunts with every thrust, the sound muffled by the boards.", "A hand slaps the wall above %n, holding on for leverage."],
    canine: ["It humps in a frantic, blurring rhythm, the knot slapping against %n with every jab, swelling bigger.", "Little hot spurts keep coming with every thrust, making %n slicker and slicker."],
    equine: ["Each stroke is slow and heavy, like being worked by a piston, and %n feels every inch of it all the way down.", "The flare is already blooming, catching and dragging inside %n on every pull back."],
    feline: ["Short, sharp thrusts, the barbs raking softly every time it pulls back, making %n jerk and gasp.", "It's quick and relentless, all hips, and those barbs make every stroke feel like ten."],
    draconic: ["The ridges drag in and out, in and out, each one catching on its way through %n with a thick little pop.", "It's hot inside %n, hotter than any cock should be, and it seems to swell with every stroke."],
    double: ["The two cocks take turns, one pushing in as the other pulls back, so %n is never empty for a second.", "Both thrust together, and %n is pinned between them against the wall."]
  };
  var BUILD = [
    "The stranger's breathing goes ragged and fast. The wall shudders.",
    "A groan rolls through the boards, deep and desperate. They're close.",
    "The thrusts lose their rhythm, short and jerky. Hands clamp the edges of the hole.",
    '"Fuck, fuck, here it comes," from the other side of the wall, barely a whisper.',
    "Everything goes tight and still for one long second, the stranger trembling against the boards."
  ];
  var AMOUNT = (ml) => ml < 15 ? "a thin little dribble" : ml < 30 ? "a decent, warm load" : ml < 60 ? "a thick, heavy load" : ml < 100 ? "a huge, pumping flood" : "an absurd, never-ending flood";
  var HOLE_PLACE = { mouth: "%n's throat", vulva: "%n's pussy", butt: "%n's ass" };
  var OUTSIDE = {
    mouth: ["%n's face", "%n's lips and chin", "%n's tongue and cheeks", "%n's hair and face"],
    vulva: ["%n's ass and thighs", "%n's back", "the lips of %n's pussy", "%n's ass cheeks"],
    butt: ["%n's back", "%n's ass cheeks", "the small of %n's back", "%n's thighs"]
  };
  function finishLine(v, hole, ml, inside, funnel) {
    const amt = AMOUNT(ml) + ", about " + Math.round(ml) + " mL";
    if (hole === "mouth" && funnel) return "The stranger cums straight into the funnel: " + amt + ", pouring down the tube and into %n's throat whether %n swallows or not.";
    if (!inside) return "At the last second it pulls out and paints " + pick2(OUTSIDE[hole]) + ": " + amt + ", hot ropes landing one after another.";
    const place = HOLE_PLACE[hole];
    switch (v.type) {
      case "canine":
        return "The knot shoves in and locks, and the stranger cums deep into " + place + ": " + amt + ", pumped in pulse after pulse while they're tied together.";
      case "equine":
        return "The flare blooms wide inside " + place + " and the horse cock floods it: " + amt + ", so much it pushes back out around the shaft.";
      case "feline":
        return "It cums in quick hard jerks deep in " + place + ": " + amt + ", and the barbs rake every inch of %n on the way out.";
      case "draconic":
        return "Every ridge swells and throbs at once as it empties into " + place + ": " + amt + ", hot as bathwater.";
      case "double":
        return "Both cocks unload at once, one into %n's pussy and one into %n's ass: " + amt + " between them, filling %n from both ends.";
      default:
        return "It buries itself to the hilt and cums deep in " + place + ": " + amt + ", throbbing with every spurt.";
    }
  }
  var KNOT_TIE = [
    "The knot won't come free. %n is stuck to the wall, tied, the stranger panting on the other side, cum trapped deep inside.",
    "Tied fast. Every little shift of the stranger tugs at %n from the inside, and there's nothing to do but wait for the knot to go down."
  ];
  var AFTER = {
    inside: {
      mouth: ["%n swallows and swallows, and still some escapes down their chin.", "The taste lingers, thick and salty, coating %n's tongue."],
      vulva: ["When it slides out, warm cum runs down %n's thighs in slow, sticky trails.", "%n's pussy twitches and leaks, the load sitting heavy and warm inside them."],
      butt: ["It pulls out with a wet pop and %n's ass gapes for a moment before it starts to leak.", "%n can feel it settle deep in their belly, warm and heavy."]
    },
    outside: ["%n is left sticky and dripping, cum cooling on their skin.", "It drips slowly off %n onto the straw. Nobody's coming to wipe it off."]
  };
  var LEAVE = [
    "A zipper, a satisfied sigh, and the footsteps fade down the row.",
    "A pat on the boards above %n's head, almost fond, and the stranger is gone.",
    '"Good stall," mutters the stranger, and walks off whistling.',
    "Hooves clatter away down the aisle. Someone's already shuffling up to take their place.",
    "The outer door bangs shut. %n is alone again, dripping, waiting for whoever's next.",
    "Somebody chalks another mark on the outside of %n's stall before they go."
  ];
  var ATMOS = [
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
    "Somewhere a door latch clicks, and %n's stomach flips, waiting to see if it's for them."
  ];
  var TAUNTS = [
    `"Fuck, you're good at this."`,
    `"They keep you well used in here, don't they."`,
    '"Look at that. Made for a wall."',
    `"Whose cow is this? I'm coming back for more."`,
    '"Dripping already. Desperate little thing."',
    `"Hold still. You're just somewhere warm to finish."`,
    `"I'm telling everyone about this stall."`,
    '"Moo for me. Go on."',
    `"Doesn't even need a face. Just this."`,
    `"You'll be leaking all day, and you'll love it."`
  ];
  var PRAISES = [
    `"God, you're good. Thank you."`,
    '"Best stall on the farm, honestly."',
    `"That's it, that's perfect, you're perfect."`,
    '"So good. So, so good."'
  ];
  function buildScene({ hole, visitor, funnel, degrade, praise }) {
    const v = visitor, beats = [];
    const voice = () => degrade && chance(0.4) ? "A voice through the boards: " + pick2(TAUNTS) : praise && chance(0.4) ? "A voice through the boards: " + pick2(PRAISES) : null;
    const atmos = () => chance(0.35) ? pick2(ATMOS) : null;
    const add = (t, extra) => {
      if (t) beats.push(Object.assign({ t }, extra || {}));
    };
    add(pick2(ARRIVE));
    add(atmos());
    add(pick2(REVEAL[v.type]).replace("%size", SIZE_WORD[v.size]));
    add(pick2(TEASE[hole]));
    if (chance(0.5)) add(pick2(TEASE[hole]));
    add(pick2((ENTRY[v.type] || ENTRY.human)[hole] || ENTRY.human[hole]));
    const rh = RHYTHM[hole].slice().sort(() => Math.random() - 0.5);
    add(rh[0]);
    add(pick2(TYPE_RHYTHM[v.type]));
    add(voice() || atmos());
    add(rh[1]);
    if (chance(0.5)) add(rh[2]);
    add(pick2(BUILD));
    const inside = funnel || v.type === "canine" || v.type === "double" || chance(0.75);
    const [lo, hi] = SIZES[v.size].ml;
    const ml = Math.round(between2(lo, hi) * (LOAD_X[v.type] || 1));
    add(finishLine(v, hole, ml, inside, funnel), { finish: true, inside, ml });
    if (inside && v.type === "canine") add(pick2(KNOT_TIE));
    add(inside ? pick2(AFTER.inside[hole]) : pick2(AFTER.outside));
    add(voice());
    add(pick2(LEAVE));
    return { beats, ml, inside };
  }
  function buildRealScene({ hole, visitor, funnel, ml, inside }) {
    return [
      pick2(REVEAL[visitor.type]).replace("%size", SIZE_WORD[visitor.size]),
      pick2((ENTRY[visitor.type] || ENTRY.human)[hole] || ENTRY.human[hole]),
      pick2(RHYTHM[hole]),
      pick2(TYPE_RHYTHM[visitor.type]),
      finishLine(visitor, hole, ml, inside, funnel)
    ];
  }

  // addons/glory-stalls/index.js
  var HOLE_WORDS = { mouth: "mouth", vulva: "pussy", butt: "ass" };
  var holeFrom = (w) => {
    w = String(w || "").toLowerCase();
    if (/^(mouth|throat|oral)$/.test(w)) return "mouth";
    if (/^(pussy|vulva|cunt|vagina)$/.test(w)) return "vulva";
    if (/^(ass|butt|anus|anal)$/.test(w)) return "butt";
    return null;
  };
  var api = null;
  var running = /* @__PURE__ */ new Map();
  var prompted = /* @__PURE__ */ new Map();
  function D() {
    const d = api.data();
    d.optIn = d.optIn || {};
    d.people = d.people || {};
    d.stalls = d.stalls || {};
    d.shifts = d.shifts || {};
    return d;
  }
  var today = () => api.dayKey();
  function bump(obj, n) {
    if (obj.day !== today()) {
      obj.day = today();
      obj.today = 0;
    }
    obj.today += n;
    obj.total = (obj.total || 0) + n;
  }
  function stallIds() {
    return Object.keys(api.spots()).map((n) => (/^glory-([a-z0-9]+)$/.exec(n) || [])[1]).filter(Boolean).sort((a, b) => (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0) || a.localeCompare(b));
  }
  var occupantOf = (id) => api.whoOnSpot("glory-" + id, 0)[0] || null;
  var visitorOf = (id) => api.whoOnSpot("glory-" + id + "-visitor", 0)[0] || null;
  var visitorStallOf = (mn) => stallIds().find((id) => api.onSpot(mn, "glory-" + id + "-visitor", 0)) || null;
  function openHoles(mn) {
    return api.HOLES.filter((h) => (h !== "vulva" || api.hasVulva(mn)) && !api.holeBlocked(mn, h));
  }
  function whyNot(mn) {
    const r = api.rec(mn);
    if (!r) return "you're not on the farm's books yet";
    if (!D().optIn[mn]) return "you haven't said ?glory on";
    if (api.limitBlocks(mn, "breed")) return "your limits rule it out";
    if (!openHoles(mn).length) return "everything's covered up (gag, chastity or plug)";
    return null;
  }
  function startScene(id, mn) {
    const holes = openHoles(mn);
    if (!holes.length) return;
    const visitor = pickVisitor(holes);
    const hole = visitor.type === "double" ? "vulva" : pick(holes);
    const r = api.rec(mn) || {}, funnel = hole === "mouth" && api.funnelOn(mn);
    const scene = buildScene({ hole, visitor, funnel, degrade: !!r.degradeMe, praise: !!r.praiseMe });
    running.set(id, { mn, scene, hole, visitor, i: 0 });
    api.log("stall " + id + ": " + visitor.size + " " + visitor.type + " in the " + hole + " for " + mn);
    step(id);
  }
  function step(id) {
    const run = running.get(id);
    if (!run) return;
    const { mn, scene } = run;
    if (!api.onSpot(mn, "glory-" + id, 0)) {
      running.delete(id);
      api.privateEmote(mn, "Behind " + api.name(mn) + ", the stranger at the hole grumbles at the empty stall and wanders off.");
      return;
    }
    const beat = scene.beats[run.i];
    if (!beat) {
      running.delete(id);
      scheduleNext(id, mn);
      return;
    }
    api.privateEmote(mn, fill(beat.t.replace(/%n/g, "%name%"), { name: api.name(mn) }));
    if (beat.finish) {
      finish(id, mn, run.hole, beat.ml, beat.inside, run.visitor);
      api.face(mn, beat.inside ? "bred" : "afterglow", 45);
      api.sound(mn, "wet");
    }
    run.i++;
    api.later(() => step(id), between(22, 32) * 1e3);
  }
  function finish(id, mn, hole, ml, inside, visitor) {
    const d = D(), p = api.prod(mn);
    const holes = visitor && visitor.type === "double" ? ["vulva", "butt"] : [hole];
    if (p && inside) {
      for (const h of holes) p.held[h] = (p.held[h] || 0) + ml / holes.length;
      p.totals.received = (p.totals.received || 0) + ml;
      p.last = p.last || Date.now();
    }
    api.tally(mn);
    const me = d.people[mn] = d.people[mn] || { holes: {}, ml: 0 };
    bump(me, 1);
    for (const h of holes) me.holes[h] = (me.holes[h] || 0) + 1;
    me.ml = (me.ml || 0) + ml;
    me.biggest = Math.max(me.biggest || 0, ml);
    if (visitor) {
      me.kinds = me.kinds || {};
      me.kinds[visitor.type] = (me.kinds[visitor.type] || 0) + 1;
    }
    bump(d.stalls[id] = d.stalls[id] || {}, 1);
    const leader = api.herdLeaderOf(mn);
    if (leader) api.staffPoints(leader, 1, "glory");
    const r = api.rec(mn);
    if (inside && holes.includes("vulva") && r && r.breedable && r.fertile && !api.limitBlocks(mn, "breed")) {
      if (p) p.lastFill = { at: Date.now(), stud: api.ANON_STUD, ml: ml / holes.length };
      const took = api.rollConception(mn, api.ANON_STUD, ml / holes.length);
      if (took === "new") api.later(() => api.notice(mn, "🍼 A warm, heavy feelin' settles low in your belly… somethin' from the stalls took, sugar. (?stats shows it)"), 2e4);
    }
    api.save();
  }
  function scheduleNext(id, mn) {
    const sh = D().shifts[mn], pun = sh && sh.punish && sh.until > Date.now();
    const s = D().stalls[id] = D().stalls[id] || {};
    s.next = Date.now() + (pun ? between(5, 15) : between(10, 30)) * 6e4;
    api.save();
  }
  function tick() {
    const d = D(), now = Date.now();
    for (const [mn, sh] of Object.entries(d.shifts)) {
      if (sh.until > now) continue;
      delete d.shifts[mn];
      api.notice(Number(mn), "🕳️ Your " + (sh.punish ? "punishment " : "") + "shift in the glory stalls is over, sugar. You can step out.");
      api.save();
    }
    for (const id of stallIds()) {
      if (running.has(id)) continue;
      const mn = occupantOf(id), s = d.stalls[id] = d.stalls[id] || {};
      if (!mn) {
        s.next = 0;
        s.who = 0;
        continue;
      }
      if (s.who !== mn) {
        s.who = mn;
        const why = whyNot(mn);
        if (why) {
          api.notice(mn, "🕳️ This is glory stall " + id + ", but nothin' will happen here: " + why + ".");
          s.next = Infinity;
          continue;
        }
        s.next = now + between(2, 5) * 6e4;
        api.notice(mn, "🕳️ You're in glory stall " + id + ". Somebody will come along soon. Step off the spot whenever you want to stop.");
        continue;
      }
      if (s.next === Infinity) {
        if (!whyNot(mn)) s.next = now + 6e4;
        continue;
      }
      const v = visitorOf(id);
      if (v && v !== mn) {
        if (prompted.get(v) !== id) {
          prompted.set(v, id);
          api.notice(v, "🕳️ Stall " + id + " is occupied. ?stall use mouth, ?stall use pussy or ?stall use ass. Whoever's inside never learns your name.");
        }
        continue;
      }
      if (now >= (s.next || 0) && !whyNot(mn)) {
        startScene(id, mn);
        continue;
      }
      if (!whyNot(mn) && now >= (s.atmosAt || 0)) {
        if (s.atmosAt) api.privateEmote(mn, fill(pick(ATMOS).replace(/%n/g, "%name%"), { name: api.name(mn) }));
        s.atmosAt = now + between(3, 6) * 6e4;
      }
    }
    for (const [v, id] of prompted) if (!api.onSpot(v, "glory-" + id + "-visitor", 0)) prompted.delete(v);
  }
  function cmdGlory(c) {
    const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
    if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar. ?apply gets you started.");
    if (w === "on" || w === "off") {
      if (w === "on") d.optIn[sender] = true;
      else delete d.optIn[sender];
      A.save();
      return c.reply(w === "on" ? "🕳️ Glory stalls: ON. Stand on a glory stall spot and strangers will use you, and staff can put you on punishment shifts. Your limits and whatever's locked on you still count. ?glory off any time." : "🕳️ Glory stalls: OFF. Nothin' will happen to you in the stalls, and nobody can put you on a punishment shift.");
    }
    const me = d.people[sender];
    c.reply("🕳️ Glory stalls: " + (d.optIn[sender] ? "ON" : "OFF") + " (?glory on / ?glory off)" + (me ? "\nToday: " + (me.day === today() ? me.today : 0) + " · all time: " + (me.total || 0) + " (mouth " + (me.holes.mouth || 0) + ", pussy " + (me.holes.vulva || 0) + ", ass " + (me.holes.butt || 0) + ")" + (me.biggest ? " · biggest load " + Math.round(me.biggest) + " mL" : "") + (me.kinds ? " · most often: " + Object.entries(me.kinds).sort((a, b) => b[1] - a[1])[0][0] : "") : "") + (d.shifts[sender] ? "\nOn " + (d.shifts[sender].punish ? "a punishment " : "") + "shift for " + Math.ceil((d.shifts[sender].until - Date.now()) / 6e4) + " more minutes." : ""));
  }
  function board(staff) {
    const d = D(), ids = stallIds();
    if (!ids.length) return "🕳️ No glory stalls are set up yet. Herdmasters: ?spot set glory-1 inside the booth and ?spot set glory-1-visitor outside the hole.";
    return "🕳️ GLORY STALLS\n" + ids.map((id) => {
      const s = d.stalls[id] || {}, mn = occupantOf(id), n = s.day === today() ? s.today : 0;
      const sh = mn && d.shifts[mn];
      return "Stall " + id + ": " + (mn ? (staff ? api.name(mn) : "occupied") + (running.has(id) ? " · busy right now" : "") : "empty") + " · " + n + " today" + (staff && sh ? " · " + (sh.punish ? "punishment " : "") + "shift, " + Math.ceil((sh.until - Date.now()) / 6e4) + " min left" : "");
    }).join("\n");
  }
  function cmdStall(c) {
    const { sender, args, api: A } = c, d = D(), sub = String(args[0] || "").toLowerCase(), staff = A.isStaff(sender);
    if (!sub || sub === "board") return c.reply(board(staff));
    if (sub === "use") {
      const id = visitorStallOf(sender);
      if (!id) return c.reply("Stand on a stall's visitor spot first, sugar (glory-1-visitor and so on).");
      const mn = occupantOf(id);
      if (!mn || mn === sender) return c.reply("Stall " + id + " is empty right now, hon.");
      if (whyNot(mn)) return c.reply("Stall " + id + " isn't takin' visitors right now, sugar.");
      if (running.has(id)) return c.reply("Somebody else is busy at stall " + id + ". Give 'em a few minutes.");
      const hole = holeFrom(args[1]) || pick(openHoles(mn));
      if (!openHoles(mn).includes(hole)) return c.reply("That one's blocked off at stall " + id + ". Try " + openHoles(mn).map((h) => HOLE_WORDS[h]).join(" or ") + ".");
      if (A.makesSemen(sender) && A.holeBlocked(sender, "penis")) return c.reply("You're locked up, sugar. Can't use the stall like that.");
      const sp = A.prod(sender);
      const load = A.makesSemen(sender) && sp ? A.drainSemen(sender, Math.max(sp.semen * A.cfg.PROD.LOAD_SHARE, Math.min(sp.semen, A.cfg.PROD.MIN_LOAD))) : 0;
      if (sp && load) sp.totals.given = (sp.totals.given || 0) + load;
      const w = HOLE_WORDS[hole];
      const kind = A.makesSemen(sender) ? A.penisType(sender) || "human" : "human";
      const visitor = { type: TYPES[kind] ? kind : "human", size: sizeFromInches(A.cockInches(sender) || 7) };
      if (visitor.type === "double" && !(hole !== "mouth" && openHoles(mn).includes("vulva") && openHoles(mn).includes("butt"))) visitor.type = "human";
      const inside = true, funnel = hole === "mouth" && A.funnelOn(mn);
      A.privateEmote(sender, "You step up to the hole and push through into the " + w + " waiting on the other side. You finish " + (load >= 1 ? "deep inside, about " + Math.round(load) + " mL" : "with a shudder") + ". Whoever's in there never sees your face.");
      const lines = load >= 1 ? buildRealScene({ hole, visitor, funnel, ml: load, inside }) : buildRealScene({ hole, visitor, funnel, ml: 0, inside }).slice(0, 4).concat(["The stranger shudders and finishes against the wall, then pulls away."]);
      lines.forEach((l, i) => A.later(() => A.privateEmote(mn, fill(l.replace(/%n/g, "%name%"), { name: A.name(mn) })), i * 5e3));
      A.later(() => finish(id, mn, hole, load, inside, visitor), (lines.length - 1) * 5e3);
      scheduleNext(id, mn);
      A.audit(sender, "USE", "stall " + id);
      return;
    }
    if (sub === "shift") {
      let who = sender, minArg = args[1];
      if (args[2] !== void 0 || args[1] && isNaN(parseInt(args[1], 10))) {
        if (!staff) return c.reply("Only staff put somebody else on a shift, sugar. ?stall shift <minutes> puts yourself on one.");
        who = A.find(args[1]);
        minArg = args[2];
      }
      const mins = parseInt(minArg, 10);
      if (!who || !A.rec(who)) return c.reply("Who's that, hon? ?stall shift <who> <minutes>.");
      if (!(mins >= 10 && mins <= 240)) return c.reply("How long, sugar? 10 to 240 minutes, like ?stall shift 60.");
      if (!d.optIn[who]) return c.reply(A.name(who) + " hasn't said ?glory on, so they can't be put on a shift.");
      d.shifts[who] = { until: Date.now() + mins * 6e4, by: sender, punish: false };
      A.save();
      A.audit(sender, "SHIFT", who + " " + mins + "m");
      if (who !== sender) A.notice(who, "🕳️ " + A.name(sender) + " put you on a " + mins + " minute shift in the glory stalls. Find an empty stall, sugar.");
      return c.reply("🕳️ " + (who === sender ? "You're" : A.name(who) + " is") + " on a " + mins + " minute stall shift.");
    }
    if (sub === "punish") {
      if (!staff) return c.reply("Punishment shifts are for staff to hand out, sugar.");
      const who = A.find(args[1]), mins = parseInt(args[2], 10);
      if (!who || !A.rec(who)) return c.reply("Here's how: ?stall punish <who> <minutes>, like ?stall punish Bessie 30.");
      if (!(mins >= 10 && mins <= 240)) return c.reply("How long, sugar? 10 to 240 minutes.");
      if (!d.optIn[who]) return c.reply(A.name(who) + " hasn't said ?glory on, so they can't be sent to the stalls. Pick another punishment.");
      const free = stallIds().find((id) => !occupantOf(id));
      d.shifts[who] = { until: Date.now() + mins * 6e4, by: sender, punish: true };
      A.save();
      A.audit(sender, "PUNISH", who + " " + mins + "m");
      if (free && A.onMap(who)) A.teleport(who, A.spot("glory-" + free), true);
      A.notice(who, "🕳️ " + A.name(sender) + " sentenced you to " + mins + " minutes in the glory stalls" + (free ? ", stall " + free : ". Find a free stall") + ". Strangers come more often on a punishment shift. Your safeword still works.");
      return c.reply("🕳️ " + A.name(who) + " is on a " + mins + " minute punishment shift" + (free ? " in stall " + free : " (no stall's free right now, they'll have to wait for one)") + ".");
    }
    if (sub === "release" || sub === "end") {
      const who = args[1] ? A.find(args[1]) : sender;
      if (who !== sender && !staff) return c.reply("Only staff end somebody else's shift, sugar.");
      if (!who || !d.shifts[who]) return c.reply((who === sender ? "You're" : A.name(who) + " isn't") + (who === sender ? " not on a shift, hon." : " on a shift, hon."));
      if (who === sender && d.shifts[who].punish) return c.reply("You can't let yourself off a punishment shift, sugar. Ask staff, or use your safeword if you need out.");
      delete d.shifts[who];
      A.save();
      if (who !== sender) A.notice(who, "🕳️ " + A.name(sender) + " let you off your stall shift.");
      return c.reply("🕳️ Shift ended.");
    }
    c.reply("?stalls shows the board · ?stall use mouth|pussy|ass (from a visitor spot) · ?stall shift <minutes>" + (staff ? " · ?stall shift <who> <minutes> · ?stall punish <who> <minutes> · ?stall release <who>" : ""));
  }
  function onSafe(mn) {
    const d = D();
    for (const [id, run] of running) if (run.mn === mn) {
      running.delete(id);
      const s = d.stalls[id] = d.stalls[id] || {};
      s.next = Date.now() + 60 * 6e4;
    }
    if (d.shifts[mn]) delete d.shifts[mn];
    api.save();
  }
  function companion(mn) {
    const d = D(), r = api.rec(mn);
    if (!r) return null;
    const me = d.people[mn], sh = d.shifts[mn], cards = [];
    cards.push({
      title: "Glory stalls",
      toggles: [{ label: "Strangers can use me in the stalls", desc: "Also lets staff give you punishment shifts. Your limits and whatever's locked on you still count.", on: !!d.optIn[mn], cmd: "glory " + (d.optIn[mn] ? "off" : "on") }],
      lines: me ? [["Today", me.day === today() ? me.today : 0], ["All time", me.total || 0], ["Mouth · pussy · ass", (me.holes.mouth || 0) + " · " + (me.holes.vulva || 0) + " · " + (me.holes.butt || 0)]] : void 0,
      chips: sh ? [{ text: (sh.punish ? "punishment shift" : "on shift") + " · " + Math.max(0, Math.ceil((sh.until - Date.now()) / 6e4)) + " min", kind: sh.punish ? "alert" : "acc" }] : void 0,
      buttons: [{ label: "The board", cmd: "stalls" }]
    });
    if (api.isStaff(mn) && stallIds().length) {
      cards.push({
        title: "Stall board",
        text: board(true),
        input: { placeholder: "Bessie 30", label: "Punish (who, minutes)", cmd: "stall punish" },
        buttons: [{ label: "Refresh", cmd: "stalls" }]
      });
    }
    return { cards };
  }
  connect({
    name: "glory-stalls",
    label: "Glory stalls",
    version: "1.0.0",
    guide: "Stand on a glory stall spot (glory-1, glory-2…) after ?glory on, and strangers come by every 10–30 minutes. Each visit is about five minutes of private emotes only you see, and it counts on your record. A real visitor on the stall's visitor spot can ?stall use mouth|pussy|ass. ?stalls is the board. Staff: ?stall shift <who> <minutes>, ?stall punish <who> <minutes>, ?stall release <who>. Step off the spot to stop; ?safe always works.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      glory: { usage: "glory on|off", private: true, run: cmdGlory },
      stall: { usage: "stall use|shift|punish|release", private: true, run: cmdStall },
      stalls: { usage: "stalls", private: true, run: (c) => c.reply(board(c.api.isStaff(c.sender))) }
    },
    on: { tick, safe: onSafe },
    companion
  });
})();
