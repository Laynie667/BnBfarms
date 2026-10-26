// ==UserScript==
// @name         BnB Farm add-on: Dairy
// @namespace    bnbfarm
// @version      1.1.0
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-dairy.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-dairy.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Warmer, more varied milking lines (with praise/degrade touches) and a weekly milk certificate that replaces the last one. Runs on the farm bot's computer, next to the Farmhand Bot script.
// @author       Laynie & Alexia
// @match        *://*.bondageprojects.elementfx.com/*
// @match        *://bondageprojects.elementfx.com/*
// @match        *://*.bondage-europe.com/*
// @match        *://bondage-europe.com/*
// @match        *://*.bondageprojects.com/*
// @match        *://bondageprojects.com/*
// @match        *://*.bondage-asia.com/*
// @match        *://bondage-asia.com/*
// @match        *://*.bondageeurope.com/*
// @match        *://bondageeurope.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(() => {
  // addons/_lib/connect.js
  var W = typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : typeof window !== "undefined" ? window : globalThis;
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
      const slow = setInterval(() => {
        go();
        if (done) clearInterval(slow);
      }, 1e4);
    }
  }
  var pick = (list) => list[Math.floor(Math.random() * list.length)];
  var TAG_ANY = /\{(?:nv|nc|nt|fu|fb|nb|ok|v|c|t|f|m)\}/g;
  var TAG_LEAD = /^((?:\{(?:nv|nc|nt|fu|fb|nb|v|c|t|f|m)\})+)/;
  var VULVA_W = /\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i;
  var TITS_W = /\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i;
  var GIRL_W = /\b(girl|heifer|mare|broodmare)\b/i;
  var untag = (t) => String(t == null ? "" : t).replace(TAG_ANY, "");
  var bodyOf = (api2, mn) => {
    try {
      return api2 && api2.body && mn ? api2.body(mn) : null;
    } catch (e) {
      return null;
    }
  };
  var gearOf = (api2, mn) => {
    try {
      return api2 && api2.gear && mn && api2.gear(mn) || {};
    } catch (e) {
      return {};
    }
  };
  function fits(line, b) {
    const s = String(line), m = s.match(TAG_LEAD);
    if (!b) return !m;
    if (m) {
      for (const t of m[1].slice(1, -1).split("}{")) {
        if (t === "v" && !b.vulva || t === "nv" && b.vulva || t === "c" && !b.cock || t === "nc" && b.cock || t === "t" && !b.tits || t === "nt" && b.tits || t === "f" && b.g !== "female" || t === "m" && b.g !== "male" || t === "fu" && b.g !== "futa" || t === "fb" && b.g !== "femboy" || t === "nb" && b.g !== "nonbinary") return false;
      }
      return true;
    }
    if (!b.vulva && VULVA_W.test(s)) return false;
    if (!b.tits && TITS_W.test(s)) return false;
    if (b.g === "male" && GIRL_W.test(s)) return false;
    return true;
  }
  function fitting(list, b) {
    const ok = list.filter((l) => fits(l, b));
    if (ok.length) return ok;
    const plain = list.filter((l) => !TAG_LEAD.test(l));
    return plain.length ? plain : list;
  }
  var ANIMALS = {
    cow: { f: "cow", m: "bull", young: ["calf", "calves"], call: "moo", sound: ["a low moo", "a soft, needy moo", "a long, shaky moo"] },
    bull: { f: "cow", m: "bull", young: ["calf", "calves"], call: "snort", sound: ["a deep snort", "a low bellow", "a rumbling snort"] },
    pony: { f: "pony", m: "pony", young: ["foal", "foals"], call: "whinny", sound: ["a breathy whinny", "a soft nicker", "a shaky little whinny"] },
    horse: { f: "mare", m: "stallion", young: ["foal", "foals"], call: "whinny", sound: ["a breathy whinny", "a low nicker", "a long, trembling whinny"] },
    deer: { f: "doe", m: "buck", young: ["fawn", "fawns"], call: "bleat", sound: ["a thin, wavering bleat", "a soft bleat"] },
    pig: { f: "sow", m: "boar", young: ["piglet", "piglets"], call: "oink", sound: ["a needy little oink", "a soft grunt", "a squealing gasp"] },
    pup: { f: "pup", m: "pup", young: ["pup", "pups"], call: "woof", sound: ["a high, needy whine", "a soft whimper", "a breathless yip"] },
    dog: { f: "bitch", m: "dog", young: ["pup", "pups"], call: "woof", sound: ["a needy whine", "a low whimper", "a shaky yip"] },
    kitt: { f: "kitty", m: "kitty", young: ["kitten", "kittens"], call: "mew", sound: ["a needy mewl", "a soft, broken purr", "a breathy mew"] },
    cat: { f: "cat", m: "tom", young: ["kitten", "kittens"], call: "mew", sound: ["a needy mewl", "a rumbling purr", "a breathy mew"] },
    goblin: { f: "goblin", m: "goblin", young: ["goblin brat", "goblin brats"], call: "cackle", sound: ["a ragged little cackle that turns into a moan", "a breathless giggle"] },
    bunny: { f: "bunny", m: "bunny", young: ["kit", "kits"], call: "squeak", sound: ["a breathy squeak", "a soft little squeak", "a thump of one foot"] },
    rabbit: { f: "doe", m: "buck", young: ["kit", "kits"], call: "squeak", sound: ["a breathy squeak", "a soft little squeak", "a thump of one foot"] },
    fox: { f: "vixen", m: "fox", young: ["kit", "kits"], call: "yip", sound: ["a high yip", "a breathy little whine", "a sharp, startled yip"] },
    wolf: { f: "wolf", m: "wolf", young: ["pup", "pups"], call: "howl", sound: ["a low, wavering howl", "a needy whine", "a rumbling growl"] },
    goat: { f: "nanny", m: "billy", young: ["kid", "kids"], call: "bleat", sound: ["a shaky bleat", "a soft bleat", "a loud, startled bleat"] },
    rat: { f: "rat", m: "rat", young: ["pinkie", "pinkies"], call: "squeak", sound: ["a high, needy squeak", "a breathless little squeak", "a shaky chitter"] },
    sheep: { f: "ewe", m: "ram", young: ["lamb", "lambs"], call: "baa", sound: ["a soft baa", "a trembling baa"] },
    default: { f: "animal", m: "animal", young: ["little one", "little ones"], call: "moan", sound: ["a soft moan", "a needy whimper", "a shaky gasp"] }
  };
  var KIN = {
    bull: "cow",
    cow: "bull",
    pony: "horse",
    horse: "pony",
    pup: "dog",
    dog: "pup",
    wolf: "dog",
    fox: "dog",
    kitt: "cat",
    cat: "kitt",
    rabbit: "bunny",
    bunny: "rabbit",
    sheep: "goat",
    goat: "sheep"
  };
  function animalOf(api2, mn) {
    let k = "default";
    try {
      k = api2 && api2.species && api2.species(mn) || "default";
    } catch (e) {
    }
    const w = ANIMALS[k] || ANIMALS.default, b = bodyOf(api2, mn), male = !!(b && (b.g === "male" || b.g === "femboy"));
    return { key: ANIMALS[k] ? k : "default", kin: KIN[k] || null, a: male ? w.m : w.f, young: w.young, call: w.call, sound: pick(w.sound), sounds: w.sound, male };
  }

  // addons/dairy/more-lines.js
  var MORE = {
    PUMP: [
      [
        // gentle
        "The pump on %n% sighs and lets go, sighs and lets go, and a slow bead of milk gathers at each nipple",
        "%n%'s pump works so softly it's more of a kiss than a pull, and the milk comes in lazy drips",
        "The cups give %n%'s nipples a patient little suckle, and the bottles fill one drop at a time",
        "%n%'s pump coaxes them like a calf that isn't in any hurry, and they let down slow and warm",
        "{t}The cups hug %n%'s teats and draw on them gently, and a thin white thread runs down each line",
        "{nt}The little cups on %n%'s flat chest pull their nipples long and pink, and a few warm drops come",
        "{fb}The pump suckles %n%'s puffy nipples so gently they squirm, and milk beads up shy and slow",
        "%n%'s pump hums low and easy, barely enough to keep the milk coming, plenty to keep them tingling"
      ],
      [
        // steady
        "The pump has found %n%'s rhythm, pull and rest, pull and rest, and the milk answers every time",
        "Twin streams run down the lines from %n% as the pump settles in to work",
        "%n%'s nipples are drawn deep into the cups on every pull, and milk spurts into the bottles in time",
        "The pump milks %n% like the good dairy %a% they are, steady and sure, and the bottles creep up",
        "{t}%n%'s teats stretch into the cups and spring back, stretch and spring back, milk running with each pull",
        "{t}The pump pulls long on %n%'s heavy udder, and the milk lets down in a warm rush",
        "{nt}The pump draws on %n%'s nipples firm and steady, and the milk runs thin and warm down the lines",
        "{fb}%n%'s puffy little nipples are pulled into the cups again and again, and milk runs out of them in thin streams"
      ],
      [
        // hard
        "The pump yanks at %n% hard and fast, and milk hits the bottles in hot spurts",
        "%n%'s pump is turned up so high it shudders on its hoses, wringing them out with every pull",
        "Each pull of the pump drags %n%'s nipples long and dark, and they gasp as the milk is hauled out",
        "The pump won't let up on %n%, pull, pull, pull, and milk sprays the inside of the cups white",
        "{t}%n%'s udder bounces with every savage pull, and milk gushes down the lines",
        "{t}The pump drags at %n%'s teats like it means to empty them for good, and the milk comes in floods",
        "{nt}The pump hauls on %n%'s nipples till they're stretched and throbbing, and every pull wrings out a hot spurt",
        "{fb}The pump sucks %n%'s puffy nipples so hard they whimper, and milk squirts into the cups"
      ]
    ],
    ECHO: [
      [
        "%n%'s %g% purrs along, and milk winds slowly up the hose",
        "The %g% sips at %n% like it's savouring them",
        "A gentle hum, a gentle pull: the %g% takes its time with %n%",
        "%n% barely feels the %g% working, just a warm, slow tug and a slow drip into the tank",
        "The %g%'s hose ticks with every little drop it draws out of %n%",
        "The %g% coaxes %n% along, soft as a hand"
      ],
      [
        "The %g% has %n% milking freely, a steady white pulse climbing the hose",
        "%n%'s %g% works in a long, comfortable rhythm, and the tank sloshes",
        "The %g% draws on %n% firm and even, and they sigh into it",
        "Milk runs up the %g%'s line from %n% like it's been waiting all day to go",
        "%n% leans back and lets the %g% do its work, and it works well",
        "The %g% and %n% have found each other's rhythm, and the tank is filling"
      ],
      [
        "The %g% hauls at %n% so hard its hoses buck, milk rushing into the tank",
        "%n% is gasping in the %g%, milk pouring out of them as fast as it can drink",
        "The %g% is roaring now, and %n% is pouring for it",
        "The %g%'s tank fills so fast it gurgles, %n% flushed and shaking above it",
        "The %g% wrings %n% out, pull after pull, and milk floods the hose",
        "%n% can't keep still in the %g%, and it can't keep up with them"
      ]
    ],
    FULL: {
      high: [
        "{t}, their udder still swollen and heavy, nowhere near done",
        "{t}. Their tits are so full they're hard to the touch",
        "{nt}, their chest still tight and aching, plenty left in them",
        ". They're nowhere near empty, and every pull is pure relief",
        ", leaking from the other side while they wait their turn"
      ],
      mid: [
        "{t}, their udder softening and lighter now",
        ". Half drained, and the ache is fading",
        ", the flow easing from a rush to a steady stream",
        "{nt}, the tightness in their chest easing",
        ""
      ],
      low: [
        "{t}, their udder soft and nearly spent, the pulls coming up thin",
        ". There's barely anything left, and the pump hunts for every drop",
        "{nt}, their chest soft and empty, nipples sore",
        ", the last thin drops coming slow",
        ". They're drained down near to nothing, and tender with it"
      ]
    },
    PRAISE: [
      " Good %a%. Such a good %a%.",
      " Look at that yield. The farm's lucky to have you.",
      " That's a proper milker, that is.",
      " Sweet thing, giving so much.",
      " The dairy's proud of you, sugar.",
      " What a good, full %a% you are.",
      " Every bottle a little ribbon, sweetheart.",
      " You were made for this, darlin'."
    ],
    DEGRADE: [
      " %Call% for it, %a%.",
      " Leaky, greedy little milk %a%.",
      " That's all you're for, and look how you love it.",
      " Just a set of teats with a %a% attached.",
      " Udders first, brains a long way second.",
      " Drip, drip, drip. Pathetic.",
      " Milked like the dumb %a% you are.",
      " The farm owns every drop, and you know it."
    ],
    STALL_MILK: [
      "The stall's cups pull at %n% in a deep, rolling rhythm, and milk drums into the bucket",
      "%n% rests their forehead on the rail while the stall milks them, slow and steady",
      "The stall's milker hums and pulls, and %n%'s milk runs warm down the lines",
      "The cups draw on %n% like hungry mouths, and %n% sways with every pull",
      "{t}The stall's cups tug %n%'s teats long, and the milk comes in warm, heavy pulses",
      "{t}%n%'s udder sways under the stall's cups as the milk is drawn out of them",
      "{nt}The stall's little cups suck at %n%'s nipples, and thin warm milk runs into the bucket",
      "{fb}The stall milks %n%'s puffy nipples patiently, and they squirm and drip for it",
      "The stall's pump thumps in its housing, and %n%'s milk pulses down the lines in time",
      "%n% stands quiet in the stall, eyes half shut, while the machine takes what it wants"
    ],
    STALL_SEMEN: [
      "The stall's sleeve slides down %n%'s %c% cock and back up, slow and wet, and their hips follow it",
      "A soft warm sleeve milks %n%'s %c% cock from root to tip, and a thick spurt lands in the jar",
      "%n%'s %c% cock is worked by the stall's sleeve like any other teat, and they moan with every pull",
      "The stall squeezes the head of %n%'s %c% cock on every upstroke, and the jar gets another warm pulse",
      "{c}{nv}A cup cradles %n%'s balls and kneads them while the sleeve strokes, and the stall drinks every drop",
      "{fu}The stall works %n%'s %c% cock and their pussy drips onto the boards beneath, both ends of them begging",
      "{fb}%n%'s cock is swallowed by the stall's sleeve, and they whimper and buck as it's milked",
      "The sleeve tightens round %n%'s %c% cock and pulls, and %n%'s knees knock together",
      "The stall's sleeve slurps and squeezes, and %n% spills into the jar in heavy, aching pulses",
      "%n% grips the stall's rail as the sleeve hauls another load out of their %c% cock"
    ],
    DONE: [
      "The stall's cups let go of %n% with a soft pop, one, two. Down to a quarter. Good %a%, off you go.",
      "The stall winds down, and %n% is left soft and light and dripping. Down to a quarter.",
      "The cups ease off %n% and swing up out of the way. A quarter left, sugar. Well milked.",
      "{t}The stall lets %n%'s teats go, pink and tender. Their udder's down to a quarter.",
      "The machine sighs to a stop. %n% wobbles out of the stall, a quarter full and grinnin'."
    ],
    DONE_SEMEN: [
      "The sleeve lets go of %n%'s spent cock with a wet sigh. Down to a quarter, and their legs are jelly.",
      "The stall's done with %n%: balls light, cock sore, a quarter left. Good stud.",
      "{c}{nv}The cup lets %n%'s balls go, and they're soft and light and aching. A quarter left.",
      "%n% staggers out of the stall milked down to a quarter, flushed to the ears.",
      "The jar's full and %n% is down to a quarter. The sleeve slides off them with a last squeeze."
    ],
    DRY: [
      "The %g% pulls at %n% and finds nothing left. They're milked dry, every drop in the tank.",
      "The %g% wheezes on empty. %n%'s been drained right down to nothing.",
      "{t}%n%'s udder hangs soft and empty under the %g%. Dry as a bone.",
      "{nt}%n%'s nipples are pink and sore, and the %g% gets nothing more out of them.",
      "Not a drop more. The %g% has had everything %n% had to give."
    ]
  };
  var GEAR_TAIL = {
    bell: [" Their bell clanks softly with every pull.", " Their cowbell rings in time with the pump.", " The bell at their throat jingles every time they shiver."],
    gag: [" Their moans come out muffled round the gag.", " Drool runs from round their gag, and they can't do a thing about it."],
    arms: [" With their arms tied, all they can do is sway in it.", " Their bound arms keep them still and offered up."],
    paws: [" Their mittened paws flex helplessly on the rail."],
    leash: [" Their leash is looped short round the rail, keeping them right where the milker wants them."],
    collar: [" A farmhand gives their collar a fond little tug in passing."],
    blind: [" Blindfolded, they can only feel the pull and hear the milk drum into the bottles."],
    hooves: [" Their hooves shift and stamp on the boards."],
    harness: [" Their harness creaks as they lean into the pull."],
    nipples: []
  };
  var SOUND_TAIL = [" %S% slips out of them.", " They let out %s%.", " %S% escapes them with the next pull.", " Every few pulls, %s%."];

  // addons/dairy/index.js
  var api = null;
  function D() {
    const d = api.data();
    d.week = d.week || { key: "", ml: {} };
    d.cert = d.cert || {};
    d.seen = d.seen || {};
    return d;
  }
  var PUMP = [
    [
      // gentle
      "The pump on %n%'s nipples gives a slow, patient tug, and warm milk beads up and drips into the bottles",
      "%n%'s pump purrs along soft and lazy, coaxing milk out a few drops at a time",
      "The cups on %n%'s teats pull gentle as a calf, and milk trickles down into the bottles",
      "%n%'s pump barely draws, just enough to keep their nipples tingling and the milk dripping"
    ],
    [
      // steady
      "The pump settles into a firm, steady rhythm on %n%, teats stretching into the cups with every pull",
      "Milk runs in thin, steady streams down the tubes from %n%'s swollen nipples",
      "Pull, release, pull: %n%'s pump works them like clockwork, and the bottles fill a finger at a time",
      "The pump draws long and deep on %n%'s teats, and they sigh as the milk lets down"
    ],
    [
      // hard
      "The pump on %n% is cranked all the way up, stretching their nipples long and wringing out hot spurts",
      "%n% squirms in the pump as it sucks hard and fast, milk spraying into the bottles",
      "The pump hauls on %n%'s teats like it's angry at them, and the milk comes in gushes",
      "Every hard pull of the pump drags a whimper and a spurt of milk out of %n%"
    ]
  ];
  var ECHO = [
    [
      "The %g% sighs along on %n%, and a thin line of milk creeps up the hose",
      "%n%'s %g% works slow and patient: drip, drip, into the tank",
      "The %g% hums softly on %n%, sipping at them more than milking"
    ],
    [
      "Milk flows steady up the %g%'s hose from %n%, and the tank's filling nicely",
      "The %g% has %n% let down good now; warm milk pulses up the line with every pull",
      "%n% leans into the %g%'s rhythm, milk running steady into the tank"
    ],
    [
      "%n% is so worked up the %g% can barely keep up. Milk gushes up the hoses into the tank",
      "The %g%'s tank sloshes as %n%, flushed and needy, pours milk into it",
      "The %g% roars on %n%, and the hoses jump with every hard gush of milk"
    ]
  ];
  var FULL = {
    high: [
      ", their udder still tight and heavy with plenty more to give",
      ". They're so full it aches, and every pull is a relief",
      ", milk leaking from both sides at once"
    ],
    mid: [", their udder softening as it empties", ". They're about half drained and still dripping", ""],
    low: [
      ", but they're nearly empty now and the pulls come up thin",
      ". There's hardly anything left, and the pump has to work for every drop",
      ", their teats sore and their udder soft and spent"
    ]
  };
  var PRAISE = [" Such a good animal, giving so much.", " Such a good milker.", " The farm's proud of you, sugar.", " Look at all that. Lovely."];
  var DEGRADE = [
    " Nothing but a dairy animal, and a leaky one at that.",
    " That's all you're good for, and you know it.",
    " Dripping like a broken tap. Pathetic little milker."
  ];
  var STALL_MILK = [
    "The stall's cups latch onto %n%'s teats and pull in a slow, rolling rhythm, milk running down the lines into the bucket",
    "%n% shifts their weight in the stall as the machine milks them, warm milk drumming into the bucket",
    "The stall's milker draws on %n% long and steady, and they let out %s%",
    "Milk streams from %n% into the stall's bucket while they rest their head on the rail"
  ];
  var STALL_SEMEN = [
    "%n%'s %c% cock is sealed in the stall's wet sleeve, and it strokes them root to tip in a slow, steady rhythm. Their hips twitch with every squeeze",
    "The stall milks %n%'s %c% cock like it's any other teat, and seed spurts into the jar in thick pulses",
    "A warm, buzzing cup hugs %n%'s balls while the sleeve works their cock. %n% is a moaning, dripping mess in the stall",
    "%n% bucks in the stall as the sleeve pulls another load out of them, the jar filling one hot pulse at a time"
  ];
  var DONE = [
    "The stall eases off once %n% is down to a quarter, teats sore and still dripping. Good job, sweetie. Off you go.",
    "The stall's cups let go of %n% with a wet pop. They're down to a quarter, soft and spent, and wobble out of the stall."
  ];
  var DONE_SEMEN = [
    "The stall wrings %n% down to the last quarter and lets go. Balls aching and light, legs wobbly. Good stud.",
    "The sleeve finally slides off %n%'s spent cock. They're down to a quarter and their knees are shaking."
  ];
  var DRY = [
    "The %g% pulls %n% completely dry. Every last drop is in the tank, and their teats are pink and tender.",
    "%n% is milked out: the %g% sucks at nothing but air, and they sag with relief."
  ];
  for (let t = 0; t < 3; t++) {
    PUMP[t].push(...MORE.PUMP[t]);
    ECHO[t].push(...MORE.ECHO[t]);
  }
  for (const k of ["high", "mid", "low"]) FULL[k].push(...MORE.FULL[k]);
  PRAISE.push(...MORE.PRAISE);
  DEGRADE.push(...MORE.DEGRADE);
  STALL_MILK.push(...MORE.STALL_MILK);
  STALL_SEMEN.push(...MORE.STALL_SEMEN);
  DONE.push(...MORE.DONE);
  DONE_SEMEN.push(...MORE.DONE_SEMEN);
  DRY.push(...MORE.DRY);
  var cap = (w) => String(w || "").charAt(0).toUpperCase() + String(w || "").slice(1);
  var who = (i) => Object.assign({}, i, { body: bodyOf(api, i.mn), on: gearOf(api, i.mn), an: animalOf(api, i.mn) });
  var part = (list, i) => untag(pick(fitting(list, i.body)));
  var say = (s, i) => s.replace(/%n%/g, i.name).replace(/%g%/g, i.gear || "milker").replace(/%c%/g, i.cock || "").replace(/%ml%/g, i.ml || "").replace(/%a%/g, i.an.a).replace(/%Call%/g, cap(i.an.call)).replace(/%call%/g, i.an.call).replace(/%S%/g, cap(i.an.sound)).replace(/%s%/g, i.an.sound);
  var fullness = (i) => part(i.full > 0.7 ? FULL.high : i.full > 0.35 ? FULL.mid : FULL.low, i);
  var tail = (i) => i.degrade && Math.random() < 0.5 ? part(DEGRADE, i) : i.praise && Math.random() < 0.5 ? part(PRAISE, i) : "";
  function extra(i) {
    const r = Math.random();
    if (r < 0.25) {
      const on = Object.keys(GEAR_TAIL).filter((k) => i.on[k] && GEAR_TAIL[k].length);
      if (on.length) return pick(GEAR_TAIL[pick(on)]);
    }
    if (r > 0.8) return pick(SOUND_TAIL);
    return "";
  }
  var tier = (level) => level <= 1 ? 0 : level <= 2 ? 1 : 2;
  var build = (f) => (raw) => {
    const i = who(raw);
    return say(f(i), i);
  };
  var lines = {
    pump: build((i) => part(PUMP[tier(i.level)], i) + fullness(i) + ". +" + i.ml + "." + extra(i) + tail(i)),
    echo: build((i) => part(ECHO[tier(i.level)], i) + fullness(i) + ". +" + i.ml + "." + extra(i) + tail(i)),
    stallMilk: build((i) => part(STALL_MILK, i) + fullness(i) + "." + extra(i) + tail(i)),
    stallSemen: build((i) => part(STALL_SEMEN, i) + "." + extra(i) + tail(i)),
    stallDone: build((i) => part(DONE, i)),
    stallDoneSemen: build((i) => part(DONE_SEMEN, i)),
    gearDry: build((i) => part(DRY, i))
  };
  var AWARDS = { "A+": "Blue-Ribbon Milker", A: "Grade A Dairy", B: "Good Steady Producer", C: "Doing Their Best", D: "Needs More Milking" };
  function tick() {
    const d = D(), wk = api.weekKey();
    for (const mn of api.here()) {
      const p = api.prod(mn);
      if (!p || !p.totals) continue;
      const was = d.seen[mn], now = p.totals.milked || 0;
      if (was !== void 0 && now > was) d.week.ml[mn] = (d.week.ml[mn] || 0) + (now - was);
      d.seen[mn] = now;
    }
    if (d.week.key && d.week.key !== wk) {
      for (const [mn, ml] of Object.entries(d.week.ml)) {
        if (!(ml >= 1)) continue;
        const grade = api.milkGrade(Number(mn)) || "C";
        d.cert[mn] = { week: d.week.key, grade, ml: Math.round(ml), award: AWARDS[grade] || AWARDS.C, at: Date.now() };
        api.notice(Number(mn), "\u{1F4DC} Your milk certificate for last week: " + certText(Number(mn)));
      }
      d.week = { key: wk, ml: {} };
    }
    if (!d.week.key) d.week.key = wk;
    api.save();
  }
  var certText = (mn) => {
    const c = D().cert[mn];
    return c ? "Grade " + c.grade + " \xB7 " + api.ml(c.ml) + ' \xB7 "' + c.award + '" (week of ' + c.week + ")" : null;
  };
  function companion(mn) {
    const p = api.prod(mn);
    if (!api.rec(mn) || !p || !api.makesMilk(mn)) return null;
    const d = D(), c = certText(mn), soFar = d.week.ml[mn] || 0;
    return { cards: [{
      title: "Milk certificate",
      text: c || "No certificate yet. Get milked this week and you'll get one when the week turns over.",
      lines: [["Milked so far this week", api.ml(soFar)]],
      buttons: [{ label: "Milk board", cmd: "board" }]
    }] };
  }
  connect({
    name: "dairy",
    label: "Dairy",
    version: "1.0.0",
    guide: "Warmer, more varied milking lines (pumps, Echo's pump and vendor, the milking stall), with a touch of praise or degradation if you switched those on. Every week you get a milk certificate with your grade and how much you gave; the new one replaces last week's. ?cert shows yours.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      cert: { usage: "cert", aliases: ["certificate"], private: true, run: (c) => {
        const t = c.args[0] ? c.api.find(c.args[0]) : c.sender;
        if (t !== c.sender && !c.api.isStaff(c.sender)) return c.reply("Only staff look at somebody else's certificate, sugar.");
        if (!t) return c.reply("Who's that, hon?");
        c.reply("\u{1F4DC} " + (certText(t) || c.api.name(t) + " doesn't have a certificate yet.") + " \xB7 so far this week: " + c.api.ml(D().week.ml[t] || 0));
      } }
    },
    on: { tick },
    lines,
    companion
  });
})();
