// ==UserScript==
// @name         BnB Farm add-on: Barn life
// @namespace    bnbfarm
// @version      1.2.1
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-barn-life.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-barn-life.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Opt-in food, water and grooming at trough and water spots (BC+/MPA bowls count), trough refills, grooming by staff, and milk-drunk. Runs on the farm bot's computer, next to the Farmhand Bot script.
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
  var fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => vars[k] !== void 0 ? vars[k] : m);
  var TAG_ANY = /\{(?:nv|nc|nt|fu|fb|nb|ok|v|c|t|f|m)\}/g;
  var TAG_LEAD = /^((?:\{(?:nv|nc|nt|fu|fb|nb|v|c|t|f|m)\})+)/;
  var VULVA_W = /\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i;
  var TITS_W = /\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i;
  var GIRL_W = /\b(girl|heifer|mare|broodmare)\b/i;
  var untag = (t) => String(t == null ? "" : t).replace(TAG_ANY, "");
  var bodyOf = (api3, mn) => {
    try {
      return api3 && api3.body && mn ? api3.body(mn) : null;
    } catch (e) {
      return null;
    }
  };
  var gearOf = (api3, mn) => {
    try {
      return api3 && api3.gear && mn && api3.gear(mn) || {};
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
  var pickFit = (list, b) => untag(pick(fitting(list, b)));
  function lineFor(api3, mn, list, key) {
    if (!Array.isArray(list) || !list.length) return "";
    const b = bodyOf(api3, mn);
    let t;
    try {
      t = key && api3 && api3.pickFor && api3.tags >= 2 ? untag(api3.pickFor(mn, key, list)) : pickFit(list, b);
    } catch (e) {
      t = pickFit(list, b);
    }
    return api3 && api3.fit && api3.tags >= 2 ? api3.fit(mn, t) : t;
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
  function animalOf(api3, mn) {
    let k = "default";
    try {
      k = api3 && api3.species && api3.species(mn) || "default";
    } catch (e) {
    }
    const w = ANIMALS[k] || ANIMALS.default, b = bodyOf(api3, mn), male = !!(b && (b.g === "male" || b.g === "femboy"));
    return { key: ANIMALS[k] ? k : "default", kin: KIN[k] || null, a: male ? w.m : w.f, young: w.young, call: w.call, sound: pick(w.sound), sounds: w.sound, male };
  }

  // addons/barn-life/more-lines.js
  var EAT = [
    "%name% gets their nose right down in the trough and doesn't come up till half of it's gone.",
    "%name% eats noisily, a happy little grunt between mouthfuls.",
    "%name% roots through the feed for the sweet bits, scattering the rest all over the floor.",
    "%name% stands at the trough chewin' slow and steady, like the good farm %a% they are.",
    "%name% eats till their belly's round and tight, then has just one more mouthful."
  ];
  var EAT_KIND = {
    cow: [
      "%name% pulls a big mouthful of hay from the trough and chews it slow, jaw goin' round and round like a proper cow.",
      "%name% grazes at the trough, lowin' softly between mouthfuls, tail flickin'.",
      "%name% chews and chews and chews, dreamy-eyed, then goes back for more."
    ],
    horse: [
      "%name% lips at the oats in the trough, snufflin' for the sweetest ones, and crunches them up.",
      "%name% buries their nose in the hay net and tugs out a mouthful, chewin' with a contented snort.",
      "%name% stamps once at the trough, impatient, then gets their face in the feed."
    ],
    pig: [
      "%name% snuffles and snorts through the trough, nose first, slop all up their cheeks.",
      "%name% roots through the feed like there's a truffle at the bottom, gruntin' happily.",
      "%name% eats like a proper pig, loud and messy and delighted about it."
    ],
    dog: [
      "%name% wolfs the feed down in about four seconds flat, then licks the trough clean.",
      "%name% eats with their whole face, tail goin', and looks up hopeful for seconds.",
      "%name% gulps their food so fast they have to stop for a little cough, then dives back in."
    ],
    cat: [
      "%name% eats daintily from the very edge of the trough, one fussy mouthful at a time.",
      "%name% sniffs every bit of the feed before decidin' it's acceptable, then eats it all.",
      "%name% picks at the trough, pausin' to lick their lips, unhurried and particular."
    ],
    bunny: [
      "%name% nibbles at the greens in the trough, nose twitchin', little bites, very fast.",
      "%name% munches a whole leaf from one end to the other without stoppin'."
    ],
    goat: [
      "%name% eats the feed, a corner of the trough sign and a bit of somebody's sleeve.",
      "%name% headbutts the trough, gets what falls out, and chews it with great satisfaction."
    ],
    deer: [
      "%name% eats in quick, nervous little bites, lookin' up between every one.",
      "%name% nibbles at the feed delicately, ears flickin' at every sound in the barn."
    ],
    bull: [
      "%name% shoves their face into the trough and eats like a bull, huge mouthfuls, snortin' between them.",
      "%name% clears half the trough in one go, chewin' slow and heavy, and dares anybody to say a word."
    ],
    sheep: [
      "%name% crops at the hay in neat little bites, munchin' steady, never lookin' up.",
      "%name% follows the next one over to the trough, because that's where everybody's goin', and eats."
    ],
    fox: [
      "%name% snatches the best bits from the trough and darts off a step to eat them, eyes bright.",
      "%name% eats with one ear turned back, like somebody might take it off 'em."
    ],
    wolf: [
      "%name% bolts the feed down, growlin' softly at anybody who comes close to the trough.",
      "%name% tears into the feed like it was hunted, then licks their chops."
    ],
    rat: [
      "%name% nibbles at everything in the trough, one quick bite of each, whiskers twitchin'.",
      "%name% stuffs their cheeks full and squirrels the rest away in a corner of the stall for later.",
      "%name% picks through the feed with greedy little hands and eats the crumbs nobody else wanted."
    ],
    goblin: [
      "%name% eats with both hands and no manners, grinnin' through a mouthful.",
      "%name% stuffs their pockets with feed for later, then eats what's left."
    ]
  };
  var EAT_BOUND = [
    "With no hands to help, %name% has to push their whole face into the trough and eat like stock.",
    "%name% kneels and eats straight from the trough, hands useless, feed sticking to their chin and cheeks.",
    "Their hands are no good to them, so %name% noses the feed into a pile and gobbles it face-first."
  ];
  var DRINK = [
    "%name% drinks long and greedy, throat bobbin', and comes up gasping and dripping.",
    "%name% laps at the water, quick and noisy, till their chin and chest are soaked.",
    "%name% sucks the water up in long pulls, eyes closed, sighing between gulps.",
    "%name% dunks their whole face in, blows bubbles, and drinks."
  ];
  var DRINK_KIND = {
    cow: ["%name% drinks in long, slow pulls, like a cow at the pond, water runnin' off their chin."],
    horse: ["%name% plunges their muzzle in and drinks deep, ears flickin', then blows out a snort that splashes everywhere."],
    pig: ["%name% slurps at the water trough, then flops in it a little to cool off."],
    dog: ["%name% laps at the water so fast and sloppy that most of it ends up on the floor."],
    cat: ["%name% laps delicately at the very edge of the water, then shakes a drop off their nose with disgust."],
    bunny: ["%name% takes quick little sips, nose wigglin', and keeps an eye out the whole time."],
    goat: ["%name% drinks, then tries to climb into the water trough. It's a goat thing."],
    bull: ["%name% drinks in great heavy gulps, then blows hard through their nose and splashes the whole trough."],
    sheep: ["%name% drinks in neat little sips and keeps close to the others at the trough."],
    fox: ["%name% laps quick and quiet, ears turnin' at every sound, ready to dart off."],
    wolf: ["%name% laps the water loud and long, then shakes their head and showers everybody nearby."],
    deer: ["%name% drinks with their head low and their eyes up, startin' at every creak of the barn."],
    rat: ["%name% sips at the very edge of the trough, whiskers wet, then washes their face with their hands."],
    goblin: ["%name% drinks straight from the trough with both hands, gulpin' and slurpin', and wipes their mouth on their arm."]
  };
  var DRINK_BOUND = [
    "No hands, so %name% gets down and laps from the water trough like any animal would.",
    "%name% kneels at the water and drinks face-first, water drippin' off their nose and chin."
  ];
  var EAT_GAG = [
    "%name% presses their gagged face into the trough and works the mash in round the edges of the gag, most of it endin' up on their chin.",
    "%name% can't chew past the gag, so they suck the soft feed in a bit at a time, droolin' mash down their front.",
    "%name% mashes their face into the feed and gets what they can past the gag, snortin', smeared to the ears.",
    "Feed squeezes in round the gag a mouthful at a time while %name% gulps and dribbles, determined not to go hungry.",
    "%name% laps the wet mash off the trough's edge round the gag, slow and sloppy, and comes up glazed in it."
  ];
  var DRINK_GAG = [
    "%name% dunks their gagged mouth in the water and lets it run in round the gag, gulpin' and splutterin'.",
    "Water dribbles in past the gag a sip at a time while %name% kneels at the trough, half of it runnin' down their chest.",
    "%name% tips their head and lets the water pour in round the gag, swallowin' hard, soaked to the collar.",
    "%name% slurps noisily through the gag, chin drippin', and keeps at it till the thirst lets go."
  ];
  var DRINK_FUNNEL = [
    "A farmhand tips a ladle of water into %name%'s funnel, and they swallow it down, eyes watering.",
    "%name% stands by the water while someone pours it down their funnel for them, a gurgle at a time."
  ];
  var GROOM = [
    "%by% brushes %name% from neck to tail, slow and thorough, until they're glossy and sighing.",
    "%by% picks the straw out of %name%'s hair, one bit at a time, humming while they work.",
    "%by% works a soft brush in circles down %name%'s back, and %name% leans so hard into it they nearly fall over.",
    "%by% gives %name% a wipe down with a warm damp cloth, then a brush, then a pat. Show ready.",
    "%by% combs %name%'s hair out smooth and checks them over, ears to hooves."
  ];
  var GROOM_KIND = {
    cow: [
      "%by% curries %name%'s flanks in big circles, raisin' the dust, then brushes them down smooth. %name% lows happily.",
      "%by% brushes %name% down like a show cow, then fluffs the tuft of their tail."
    ],
    horse: [
      "%by% brushes %name%'s mane out and braids it neat, then works through their tail till it shines.",
      "%by% curries %name% down, picks out their hooves and finishes with a soft brush. %name% nickers."
    ],
    dog: [
      "%by% brushes %name% all over, and %name% rolls onto their back for the belly. They get the belly.",
      "%by% gives %name% a good brushin' and a scratch behind the ears, and %name%'s whole back end wiggles."
    ],
    cat: [
      "%by% strokes a soft brush down %name%'s back, and %name% purrs and pushes up into every stroke.",
      "%by% brushes %name% just the way they like it, and gets a slow blink for their trouble."
    ],
    pig: [
      "%by% scrubs %name% down with a stiff brush and a bucket of warm water, and %name% grunts happily.",
      "%by% scratches %name% behind the ears with the brush, and %name% leans in and groans."
    ],
    bunny: ["%by% brushes %name% out till they're fluffy as a dandelion, and their nose twitches in thanks."],
    sheep: ["%by% fluffs up %name%'s wool, picks out the burrs, and gives them a pat on the rump."],
    goat: ["%by% brushes %name% and gets nibbled for their trouble. %name% looks very pleased with themselves."],
    bull: ["%by% curries %name%'s broad back with a stiff brush, and %name% leans their whole weight into it with a low rumble."],
    fox: ["%by% brushes out %name%'s tail till it's bushy and glossy, and %name% can't help showin' it off after."],
    wolf: ["%by% works the brush through %name%'s thick ruff, and %name% goes still and sleepy-eyed under it."],
    deer: ["%by% brushes %name% down slow and gentle, and %name% stops tremblin' halfway through."],
    rat: [
      "%by% brushes %name%'s fur smooth and cleans behind their round little ears, and %name% chitters the whole time.",
      "%by% gives %name%'s long tail a wipe-down and a brush, and %name% grooms their own whiskers to match."
    ],
    goblin: ["%by% scrubs the mud off %name% with a stiff brush, and %name% complains about every inch of it, grinnin'."]
  };
  var GROOM_GEAR = {
    latex: ["%by% polishes %name%'s latex with a soft cloth until it shines like a wet apple.", "%by% wipes %name%'s rubber down and buffs it to a gleam, and %name% squeaks."],
    collar: ["%by% unbuckles %name%'s collar, brushes underneath it, and buckles it back, snug."],
    harness: ["%by% checks every strap of %name%'s harness, oils the leather and tightens it a hole."],
    hooves: ["%by% picks out %name%'s hooves one at a time and gives them a polish."],
    bell: ["%by% gives %name%'s bell a polish too, and it rings bright when they're done."],
    tail: ["%by% brushes %name%'s tail out long and smooth."]
  };
  var GROOM_STOCK = [
    "%by% grooms %name% the way herd animals do: nose to neck, slow, with little nibbles at the itchy places.",
    "%by% leans into %name% and rubs their cheek along %name%'s shoulder, groomin' and claimin' all at once.",
    "%by% licks a stubborn patch of %name%'s hair flat, then nuzzles it for good measure.",
    "%name% and %by% take turns groomin' each other, and both end up drowsy and leanin' together."
  ];
  var REMIND = {
    food: [
      "Your belly's rumblin', %name%. Find a trough before you start chewin' the fence.",
      "You're peckish, %name%. The feed won't eat itself.",
      "Somethin' smells good at the trough, %name%, and your belly's noticed."
    ],
    water: [
      "Your lips are dry, %name%. Get yourself to the water.",
      "You're parched, %name%. A long drink would fix you right up.",
      "You've been workin' up a thirst, %name%. The water's waitin'."
    ],
    groom: ["You're a tangle of straw and mud, %name%. Ask somebody for a brushin'.", "You're lookin' rumpled, %name%. A groom would perk you right up."]
  };
  var DRUNK_LINES = {
    1: [
      "Warm milk settles in %name%'s belly, and they sigh, soft and pleased.",
      "%name% licks the last of the milk off their lips, warm all the way through.",
      "%name% goes a little pink and a lot content, a hand on their full belly."
    ],
    2: [
      "%name% sways where they stand, eyes half shut, belly warm and full of milk.",
      "%name% yawns a big, jaw-crackin' yawn and leans on the nearest post.",
      "%name% has gone soft and slow and smiley, like a calf after a good feed."
    ],
    3: [
      "%name% is milk-drunk and proud of it: wobbly, giggly, and lookin' for somebody to lean on.",
      "%name% hiccups, giggles, and sits down in the straw very suddenly, drunk on milk.",
      "%name% is so full of warm milk they've gone boneless, smilin' at nothin' with a dribble on their chin."
    ]
  };
  var ROMP = [
    [
      "%a% crouches low, eyes bright, and pounces on %b% with a happy noise.",
      "The two of them roll across the straw, kickin' up a cloud of it, laughin' and squirmin'.",
      "%w% comes out on top, straw in their hair, sittin' on %l% like a prize."
    ],
    [
      "%a% sneaks up on %b% and nips their ear, then bolts.",
      "%b% gives chase round the hay bales, and the pair of them go crashin' through a pile of straw.",
      "%w% catches %l% by the ankle, and %l% goes down in a heap, laughin' too hard to get up."
    ],
    [
      "%a% and %b% lock shoulders and push, digging in, neither willing to give an inch.",
      "They shove back and forth across the pen, snortin' and grinnin', until somebody's feet slip.",
      "%w% shoves %l% right into the hay pile and stands over them, very pleased."
    ],
    [
      "%b% flops down in the straw and %a% flops right on top of them.",
      "There's a lot of wigglin' and tickling and squealin', and straw goes everywhere.",
      "%l% ends up pinned and tickled breathless, %w% grinnin' down at them."
    ]
  ];
  var RPS_FORFEIT = [
    "%l% has to %lcall% for %w%, loud enough for the whole barn to hear.",
    "%l% carries %w%'s feed bucket for the rest of the day. Them's the rules.",
    "%w% gets a piggyback from %l% to the water trough and back.",
    "%l% has to let %w% pick the straw out of their hair, slow, in front of everybody.",
    "%l% gives %w% a nuzzle and a groom, and has to say thank you after.",
    "%w% gets %l%'s spot by the warm wall tonight."
  ];
  var TURNOUT_CALL = [
    "\u{1F514} There goes the turn-out bell! Pasture, y'all: ten minutes, and a ribbon for every one of you who comes out.",
    "\u{1F514} Ding-a-ling! Evenin' turn-out. The grass is sweet and the sky's goin' pink. Ten minutes to get out there."
  ];
  var TURNOUT_SCENE = [
    "\u{1F33E} %names% spill out into the pasture together, kick up their heels in the evenin' air, and settle down to graze side by side.",
    "\u{1F33E} The herd's out: %names%, noses in the grass, the last of the sun warm on their backs.",
    "\u{1F33E} %names% wander out to the pasture, and somebody starts a game of chase that nobody finishes. Then they all lie down in a heap."
  ];
  var TURNOUT_ALONE = [
    "\u{1F33E} %names% has the pasture all to themselves tonight: a good roll in the grass, a long look at the sunset, and a ribbon.",
    "\u{1F33E} Just %names% out in the evenin' pasture, grazin' quiet under a pink sky. A ribbon for turnin' out."
  ];

  // addons/barn-life/herd.js
  var api = null;
  var D = null;
  var needsOf = null;
  var isOn = null;
  function herdSetup(a, data, needs, on2) {
    api = a;
    D = data;
    needsOf = needs;
    isOn = on2;
  }
  var H = () => {
    const d = D();
    d.herd = d.herd || { ok: {}, wins: {}, bell: {} };
    d.herd.ok = d.herd.ok || {};
    d.herd.wins = d.herd.wins || {};
    d.herd.bell = d.herd.bell || {};
    return d.herd;
  };
  var games = /* @__PURE__ */ new Map();
  var keyOf = (a, b) => a < b ? a + ":" + b : b + ":" + a;
  var gameOf = (mn) => [...games.values()].find((g) => g.a === mn || g.b === mn) || null;
  var onBooks = (mn) => {
    const r = api.rec(mn);
    return !!(r && r.roles && r.roles.length);
  };
  var nextTo = (a, b, reach) => {
    const p = api.pos(a), q = api.pos(b);
    return !!(p && q && Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y)) <= (reach || 2));
  };
  var ROMP2 = [
    [
      "%a% drops their shoulders, rump in the air, and bounces at %b%. It's on.",
      "%a% and %b% go tumbling through the straw, a tangle of limbs and tails, each tryin' to pin the other.",
      "%w% ends up on top, pantin' and pleased with themselves, with %l% squirmin' and laughin' underneath."
    ],
    [
      "%a% nips at %b%'s flank and bolts. %b% is after them before the straw settles.",
      "Round the pen they go, %b% gainin', till the pair of them go down in a heap by the fence.",
      "%w% sits right on %l%'s back and won't budge till they cry uncle. Or %lcall%."
    ],
    [
      "%a% butts their head into %b%'s shoulder, playful, askin' for trouble.",
      "%b% shoves back and the two of them wrestle, shoulder to shoulder, gruntin' and gigglin'.",
      "%w% rolls %l% over and blows a raspberry on their belly. %l% shrieks."
    ],
    [
      "%b% snatches a wisp of hay and dangles it. %a% lunges for it.",
      "A tug-of-war over one piece of hay, the both of them growlin' through their teeth and tails goin'.",
      "The hay snaps. %w% gets the bigger half and prances a victory lap round %l%."
    ]
  ];
  var RPS_FORFEIT2 = [
    "%l% has to %lcall% for %w%, loud enough for the barn to hear.",
    "%w% gets to pin %l% and lick their face clean, ear to ear.",
    "%l% carries %w%'s pride around all day: loser grooms the winner. Get to it.",
    "%w% claims a forfeit: %l% kneels and nuzzles their hand like good stock.",
    "%l% gets their rump swatted, once, by %w%. Fair's fair.",
    "%l% owes %w% a belly rub. A long one."
  ];
  var BEATS = { rock: "scissors", scissors: "paper", paper: "rock" };
  var TURNOUT_CALL2 = [
    "\u{1F514} Evenin' turn-out! The bell's ringin', y'all. Come on out to the pasture: ten minutes, and there's a ribbon for everybody who shows.",
    "\u{1F514} That's the turn-out bell. Everybody out to the pasture for the evenin'. Ten minutes, and a ribbon if you make it.",
    "\u{1F514} Clang, clang! Turn-out time. Stretch your legs in the pasture, sweet things. Ten minutes."
  ];
  var TURNOUT_SCENE2 = [
    "\u{1F33E} The herd's out for the evenin': %names% graze shoulder to shoulder as the light goes gold, tails flickin', nobody in any hurry.",
    "\u{1F33E} Turn-out. %names% settle into the pasture together, nosin' the grass and each other, warm flanks touchin' as the sun goes down.",
    "\u{1F33E} %names% amble out under the evenin' sky and bunch up the way a herd does, chewin' slow, one of them already half asleep on another's shoulder."
  ];
  var TURNOUT_ALONE2 = [
    "\u{1F33E} %names% has the whole pasture to themselves this evenin', and makes the most of it: a long stretch, a roll in the grass, and a ribbon for showin' up."
  ];
  ROMP2.push(...ROMP);
  RPS_FORFEIT2.push(...RPS_FORFEIT);
  TURNOUT_CALL2.push(...TURNOUT_CALL);
  TURNOUT_SCENE2.push(...TURNOUT_SCENE);
  TURNOUT_ALONE2.push(...TURNOUT_ALONE);
  var callOf = (mn) => animalOf(api, mn).call;
  function allowed(a, b) {
    const u = H().ok[b + ":" + a];
    return !!(u && u > Date.now());
  }
  function startGame(a, b, kind) {
    const N = api.name;
    if (kind === "rps") {
      games.set(keyOf(a, b), { a, b, kind, picks: {}, until: Date.now() + 75e3 });
      for (const m of [a, b]) api.notice(m, "\u270A\u270B\u270C\uFE0F Rock, paper, scissors with " + N(m === a ? b : a) + "! Say ?rps rock, ?rps paper or ?rps scissors. You've got a minute, and only I see what you pick.");
      return;
    }
    if (kind === "race") {
      const spots = Object.keys(api.spots()).filter((s) => /^(trough|water|pasture|turnout|pen|bench|milking)/.test(s) && !api.onSpot(a, s, 3) && !api.onSpot(b, s, 3));
      if (!spots.length) return startGame(a, b, "romp");
      const spot = pick(spots);
      games.set(keyOf(a, b), { a, b, kind, spot, until: Date.now() + 15e4 });
      api.emote("\u{1F3C1} " + N(a) + " and " + N(b) + ' line up, noses level. The farm girl points: "First one to ' + spot.replace(/-/g, " ") + ' wins. Go!"', a);
      for (const m of [a, b]) api.notice(m, "\u{1F3C1} Race! First to stand on " + spot + " wins. Run, sugar!");
      return;
    }
    const [w, l] = Math.random() < 0.5 ? [a, b] : [b, a], beats = pick(ROMP2);
    beats.forEach((t, i) => api.later(() => {
      if (api.onMap(a) && api.onMap(b)) api.emote("\u{1F43E} " + fill(t, { a: N(a), b: N(b), w: N(w), l: N(l), lcall: callOf(l) }), a);
    }, i * 9e3));
    api.later(() => won(w, l, "romp"), beats.length * 9e3);
  }
  function won(w, l, kind) {
    const h = H(), day = api.dayKey();
    for (const m of [w, l]) if (isOn(m)) {
      const n = needsOf(m);
      n.groom = Math.min(100, n.groom + 10);
    }
    if (h.wins[w] !== day) {
      h.wins[w] = day;
      if (api.ribbons) api.ribbons(w, 1, "winnin' at " + (kind === "rps" ? "rock, paper, scissors" : kind === "race" ? "a race" : "a romp"));
    }
    api.save();
  }
  function cmdPlay(c) {
    const { sender, args, api: A } = c, N = A.name;
    if (!onBooks(sender)) return c.reply("Playin's for folks on the farm's books, sugar. ?apply gets you started.");
    const t = A.find(args[0]), kind = /^(rps|rock|paper|scissors)$/i.test(args[1] || "") ? "rps" : /^(race|run|chase)$/i.test(args[1] || "") ? "race" : /^(romp|wrestle|tumble)$/i.test(args[1] || "") ? "romp" : pick(["romp", "romp", "rps", "race"]);
    if (!t || !onBooks(t)) return c.reply("\u{1F43E} Who do you want to play with, sugar? ?play <who> picks a game for you, or name it: ?play <who> romp \xB7 ?play <who> rps (rock, paper, scissors) \xB7 ?play <who> race");
    if (t === sender) return c.reply("Playin' with yourself is a different command, sugar. Find a friend.");
    if (!A.onMap(sender) || !A.onMap(t) || !nextTo(sender, t, 3)) return c.reply("Get up close to " + N(t) + " first, sugar.");
    if (gameOf(sender) || gameOf(t)) return c.reply("One game at a time, sugar. Finish the one that's goin'.");
    const go = () => startGame(sender, t, kind);
    if (allowed(sender, t)) {
      go();
      return c.reply("\u{1F43E} Game on with " + N(t) + "!");
    }
    A.ask(t, "\u{1F43E} " + N(sender) + " wants to play with you (" + (kind === "rps" ? "rock, paper, scissors" : kind === "race" ? "a race" : "a romp in the straw") + "), sugar. Say yes or no.", (yes) => {
      if (!yes) return A.notice(sender, N(t) + " doesn't feel like playin' right now, sugar.");
      H().ok[t + ":" + sender] = Date.now() + 2 * 36e5;
      H().ok[sender + ":" + t] = Date.now() + 2 * 36e5;
      A.save();
      if (A.onMap(sender) && A.onMap(t)) go();
    });
    c.reply("\u{1F43E} I've asked " + N(t) + " if they want to play.");
  }
  function cmdRps(c) {
    const g = gameOf(c.sender), p = String(c.args[0] || "").toLowerCase();
    if (!g || g.kind !== "rps") return c.reply("You're not in a game of rock, paper, scissors, sugar. ?play <who> rps starts one.");
    if (!BEATS[p]) return c.reply("?rps rock, ?rps paper or ?rps scissors, sugar.");
    if (g.picks[c.sender]) return c.reply("You've already thrown " + g.picks[c.sender] + ", sugar. No take-backs.");
    g.picks[c.sender] = p;
    c.reply("\u{1F92B} " + p[0].toUpperCase() + p.slice(1) + " it is. Waitin' on the other one.");
    if (g.picks[g.a] && g.picks[g.b]) settleRps(g);
  }
  function settleRps(g) {
    games.delete(keyOf(g.a, g.b));
    const N = api.name, pa = g.picks[g.a], pb = g.picks[g.b];
    if (!pa && !pb) return;
    if (!pa || !pb) {
      const w2 = pa ? g.a : g.b, l2 = pa ? g.b : g.a;
      api.emote("\u270A " + N(w2) + " throws " + (pa || pb) + ", and " + N(l2) + " just stands there chewin'. " + N(w2) + " wins by default.", w2);
      return won(w2, l2, "rps");
    }
    if (pa === pb) return api.emote("\u270A " + N(g.a) + " and " + N(g.b) + " both throw " + pa + ". A draw! They eye each other. Best go again.", g.a);
    const [w, l, pw, pl] = BEATS[pa] === pb ? [g.a, g.b, pa, pb] : [g.b, g.a, pb, pa];
    api.emote("\u270A " + N(w) + " throws " + pw + ", " + N(l) + " throws " + pl + ". " + N(w) + " wins! " + fill(pick(RPS_FORFEIT2), { w: N(w), l: N(l), lcall: callOf(l) }), w);
    won(w, l, "rps");
  }
  var pastureSpot = () => Object.keys(api.spots()).find((s) => /^(pasture|turnout)/.test(s)) || null;
  function ring() {
    const h = H(), spot = pastureSpot();
    if (!spot) return false;
    h.bell.day = api.dayKey();
    h.bell.until = Date.now() + 10 * 6e4;
    h.bell.spot = spot;
    api.save();
    const line = pick(TURNOUT_CALL2);
    for (const mn of api.here()) if (onBooks(mn)) api.notice(mn, line);
    return true;
  }
  function settleTurnout() {
    const h = H(), spot = h.bell.spot;
    h.bell.until = 0;
    api.save();
    const there = api.here().filter((mn) => onBooks(mn) && api.onSpot(mn, spot, 4));
    if (!there.length) return;
    const N = there.map(api.name), names = N.length === 1 ? N[0] : N.slice(0, -1).join(", ") + " and " + N[N.length - 1];
    api.emote(fill(pick(there.length === 1 ? TURNOUT_ALONE2 : TURNOUT_SCENE2), { names }).replace("%names%", names), there[0]);
    for (const mn of there) {
      if (api.ribbons) api.ribbons(mn, 1, "comin' out for evenin' turn-out");
      if (isOn(mn)) {
        const n = needsOf(mn);
        n.groom = Math.min(100, n.groom + 5);
      }
    }
    api.save();
  }
  function herdTick() {
    const now = Date.now(), h = H();
    for (const g of [...games.values()]) {
      if (g.kind === "race") {
        const w = api.onSpot(g.a, g.spot, 1) ? g.a : api.onSpot(g.b, g.spot, 1) ? g.b : 0;
        if (w) {
          games.delete(keyOf(g.a, g.b));
          const l = w === g.a ? g.b : g.a;
          api.emote("\u{1F3C1} " + api.name(w) + " gets there first, chest heavin', and turns to watch " + api.name(l) + " come puffin' up behind. " + api.name(w) + " wins the race!", w);
          won(w, l, "race");
          continue;
        }
      }
      if (now > g.until) {
        if (g.kind === "rps") settleRps(g);
        else {
          games.delete(keyOf(g.a, g.b));
          for (const m of [g.a, g.b]) api.notice(m, "\u{1F3C1} Nobody made it in time. Call it a draw, sugar.");
        }
      }
    }
    if (h.bell.until && now >= h.bell.until) settleTurnout();
    const hour = h.bell.hour === void 0 ? 19 : h.bell.hour;
    if (!h.bell.off && (/* @__PURE__ */ new Date()).getHours() === hour && h.bell.day !== api.dayKey() && api.here().some(onBooks)) ring();
  }
  function cmdBell(c) {
    const { sender, args, api: A } = c, h = H(), w = String(args[0] || "").toLowerCase();
    if (!A.isProprietor(sender)) return c.reply("\u{1F514} Evenin' turn-out rings at " + (h.bell.hour === void 0 ? 19 : h.bell.hour) + ":00" + (h.bell.off ? " (switched off right now)" : "") + ". Come out to the pasture when you hear it, sugar: there's a ribbon in it.");
    if (w === "now") return c.reply(ring() ? "\u{1F514} Rung. Ten minutes for them to get to the pasture." : "There's no pasture spot yet, sugar. Stand in the pasture and say ?spot set pasture.");
    if (w === "hour" && /^\d{1,2}$/.test(args[1] || "") && Number(args[1]) < 24) {
      h.bell.hour = Number(args[1]);
      A.save();
      return c.reply("\u{1F514} Turn-out rings at " + h.bell.hour + ":00 from now on.");
    }
    if (w === "off" || w === "on") {
      h.bell.off = w === "off";
      A.save();
      return c.reply("\u{1F514} Evenin' turn-out is " + (h.bell.off ? "off." : "on."));
    }
    c.reply("\u{1F514} Evenin' turn-out: " + (h.bell.off ? "OFF" : "on") + ", at " + (h.bell.hour === void 0 ? 19 : h.bell.hour) + ":00 on my clock, at the " + (pastureSpot() || "pasture (not set: ?spot set pasture)") + " spot.\n?bell now \xB7 ?bell hour <0-23> \xB7 ?bell off|on");
  }
  var herdCommands = {
    play: { usage: "play <who> [romp|rps|race]", run: cmdPlay },
    rps: { usage: "rps rock|paper|scissors", private: true, run: cmdRps },
    bell: { usage: "bell", private: true, run: cmdBell }
  };
  function herdCards(mn) {
    const g = gameOf(mn);
    if (g && g.kind === "rps" && !g.picks[mn]) return [{
      title: "\u270A Rock, paper, scissors",
      text: "Against " + api.name(g.a === mn ? g.b : g.a) + ". Pick one, only I see it.",
      buttons: [{ label: "\u270A Rock", cmd: "rps rock", accent: true }, { label: "\u270B Paper", cmd: "rps paper", accent: true }, { label: "\u270C\uFE0F Scissors", cmd: "rps scissors", accent: true }]
    }];
    if (g && g.kind === "race") return [{ title: "\u{1F3C1} Race!", text: "First to stand on " + g.spot + " wins." }];
    return [];
  }
  var HERD_GUIDE = " Play: ?play <who> (a romp, rock-paper-scissors or a race; they're asked first). Evenin' turn-out rings at 7 pm: come out to the pasture for a ribbon (proprietors: ?bell).";

  // addons/barn-life/index.js
  var FULL = 100;
  var PER_H = { food: 100 / 8, water: 100 / 6, groom: 100 / 24 };
  var TROUGH_HELPINGS = 20;
  var DRUNK = ["", "content", "sleepy", "milk-drunk"];
  var DRUNK_DECAY_MIN = 7;
  var api2 = null;
  function D2() {
    const d = api2.data();
    d.optIn = d.optIn || {};
    d.needs = d.needs || {};
    d.troughs = d.troughs || {};
    d.drunk = d.drunk || {};
    return d;
  }
  var on = (mn) => !D2().farmOff && !!D2().optIn[mn] && !!api2.rec(mn);
  function needsOf2(mn) {
    const d = D2();
    return d.needs[mn] = d.needs[mn] || { food: FULL, water: FULL, groom: FULL, t: Date.now(), warned: {}, said: 0 };
  }
  var near = (mn, prefix) => Object.keys(api2.spots()).find((n) => n.startsWith(prefix) && api2.onSpot(mn, n, 1)) || null;
  var EAT2 = [
    "%name% buries their face in the trough and eats like they haven't seen food in days, chewing noisily.",
    "%name% noses through the feed at the trough, picking out the best bits before gobbling the rest.",
    "%name% kneels at the trough and eats without using their hands, crumbs all over their chin."
  ];
  var DRINK2 = [
    "%name% laps at the water trough, slurping loudly until their chin is dripping.",
    "%name% dunks their face in the water and drinks long and deep, coming up gasping.",
    "%name% drinks greedily from the water trough, splashing half of it down their chest."
  ];
  var GROOM2 = [
    "%by% brushes %name% down with long, firm strokes, working the tangles out until they're glossy and sighing.",
    "%by% curries %name% from neck to tail, then smooths them down with a soft brush. %name% leans into every stroke.",
    "%by% gives %name% a proper grooming: brushed, wiped down and checked over, ready for show."
  ];
  var REMIND2 = {
    food: ["Your tummy rumbles, %name%. The trough's waitin'.", "You're gettin' mighty hungry, %name%. Go eat at the trough."],
    water: ["Your mouth's gone dry, %name%. Get to the water.", "You're thirsty, %name%. The water trough never runs dry."],
    groom: ["You're lookin' scruffy, %name%. Ask a farmhand for a brushin'."]
  };
  var DRUNK_LINES2 = {
    1: ["A warm, content feeling spreads through %name%'s belly. They lick their lips, wanting more."],
    2: [
      "%name%'s eyelids droop. Full of warm milk, they sway a little where they stand, sleepy and soft.",
      "%name% yawns, cheeks flushed and belly warm, leaning on whoever's closest."
    ],
    3: [
      "%name% is completely milk-drunk: glassy-eyed, giggly and boneless, mumbling about more.",
      "%name% wobbles on their feet, drunk on milk, a dreamy smile on their face and a dribble on their chin."
    ]
  };
  EAT2.push(...EAT);
  DRINK2.push(...DRINK);
  GROOM2.push(...GROOM);
  for (const k of Object.keys(REMIND)) REMIND2[k].push(...REMIND[k]);
  for (const k of Object.keys(DRUNK_LINES)) DRUNK_LINES2[k].push(...DRUNK_LINES[k]);
  var kindOf = (mn) => animalOf(api2, mn);
  var bound = (g) => !!(g.arms || g.paws || g.hands);
  var kindLines = (T, mn) => {
    const k = kindOf(mn);
    return T[k.key] || k.kin && T[k.kin] || null;
  };
  function eatPool(mn, g) {
    if (mouthFull(mn) && Math.random() < 0.8) return EAT_GAG;
    const k = kindLines(EAT_KIND, mn);
    if (bound(g) && Math.random() < 0.7) return EAT_BOUND;
    return k && Math.random() < 0.6 ? k : EAT2;
  }
  function drinkPool(mn, g) {
    if (api2.funnelOn && api2.funnelOn(mn)) return DRINK_FUNNEL;
    if (mouthFull(mn) && Math.random() < 0.8) return DRINK_GAG;
    const k = kindLines(DRINK_KIND, mn);
    if (bound(g) && Math.random() < 0.7) return DRINK_BOUND;
    return k && Math.random() < 0.5 ? k : DRINK2;
  }
  function groomPool(mn) {
    const g = gearOf(api2, mn), on2 = Object.keys(GROOM_GEAR).filter((k2) => g[k2]), k = kindLines(GROOM_KIND, mn), r = Math.random();
    if (on2.length && r < 0.35) return GROOM_GEAR[pick(on2)];
    return k && r < 0.75 ? k : GROOM2;
  }
  var words = (mn, extra) => Object.assign({ name: api2.name(mn), a: kindOf(mn).a, call: kindOf(mn).call }, extra || {});
  var mouthFull = (mn) => {
    const g = gearOf(api2, mn);
    return !!(api2.holeBlocked && api2.holeBlocked(mn, "mouth")) || !!g.gag || !!g.ringGag;
  };
  function tick() {
    if (D2().farmOff) return;
    const now = Date.now(), here = new Set(api2.here());
    for (const [k, n] of Object.entries(D2().needs)) {
      const mn = Number(k);
      if (!on(mn) || !here.has(mn)) {
        n.t = now;
        continue;
      }
      const h = (now - (n.t || now)) / 36e5;
      n.t = now;
      for (const need of ["food", "water", "groom"]) n[need] = Math.max(0, n[need] - PER_H[need] * h);
      remind(mn, n);
    }
    for (const [k, x] of Object.entries(D2().drunk)) {
      if (now - x.t < DRUNK_DECAY_MIN * 6e4) continue;
      x.lvl--;
      x.t = now;
      if (x.lvl <= 0) {
        delete D2().drunk[k];
        api2.notice(Number(k), "\u{1F95B} The milk-drunk haze lifts. You're clear-headed again.");
      }
    }
    api2.save();
  }
  function remind(mn, n) {
    if (Date.now() - (n.said || 0) < 30 * 6e4) return;
    for (const need of ["water", "food", "groom"]) {
      const lvl = n[need] <= 10 ? 10 : n[need] <= 25 ? 25 : 0;
      if (!lvl || (n.warned[need] || 100) <= lvl) continue;
      n.warned[need] = lvl;
      n.said = Date.now();
      api2.notice(mn, (need === "water" ? "\u{1F4A7} " : need === "food" ? "\u{1F33E} " : "\u{1FAAE} ") + fill(lineFor(api2, mn, REMIND2[need], "remind:" + need), words(mn)));
      return;
    }
  }
  function eat(mn, reply, how) {
    if (!on(mn)) return reply("Barn life isn't on for you, sugar. ?needs on switches it on.");
    const t = near(mn, "trough");
    if (!t) return reply("You need to be at a trough to eat, sugar (a spot called trough-\u2026).");
    const d = D2(), left = d.troughs[t] === void 0 ? TROUGH_HELPINGS : d.troughs[t];
    if (left <= 0) {
      api2.notifyStaff("\u{1F33E} " + t + " is empty and " + api2.name(mn) + " is hungry. ?refill " + t + " standing next to it.", true);
      return reply("The trough's licked clean, hon. I've told staff it needs fillin'.");
    }
    const n = needsOf2(mn);
    if (n.food >= 95) return reply("You're stuffed already, sugar.");
    d.troughs[t] = left - 1;
    n.food = Math.min(FULL, n.food + 50);
    n.warned.food = 100;
    api2.emote("\u{1F33E} " + fill(lineFor(api2, mn, eatPool(mn, gearOf(api2, mn)), "eat"), words(mn)), mn);
    api2.save();
    if (how !== "bowl") reply("\u{1F33E} Food " + Math.round(n.food) + "% \xB7 the trough has " + d.troughs[t] + " helpings left.");
  }
  function drink(mn, reply, how) {
    if (!on(mn)) return reply("Barn life isn't on for you, sugar. ?needs on switches it on.");
    if (!near(mn, "water")) return reply("You need to be at a water spot to drink, sugar (a spot called water-\u2026).");
    const n = needsOf2(mn);
    if (n.water >= 95) return reply("You're not thirsty right now, hon.");
    n.water = Math.min(FULL, n.water + 60);
    n.warned.water = 100;
    api2.emote("\u{1F4A7} " + fill(lineFor(api2, mn, drinkPool(mn, gearOf(api2, mn)), "drink"), words(mn)), mn);
    api2.save();
    if (how !== "bowl") reply("\u{1F4A7} Water " + Math.round(n.water) + "%.");
  }
  function milkDrunk(milker, drinker, ml, grade) {
    if (!on(drinker)) return;
    const d = D2(), x = d.drunk[drinker] = d.drunk[drinker] || { lvl: 0, t: Date.now() };
    const before = x.lvl;
    x.lvl = Math.min(3, x.lvl + (/^A/.test(grade || "") || ml >= 150 ? 2 : 1));
    x.t = Date.now();
    api2.face(drinker, "milkdrunk", x.lvl * 7 * 60);
    if (x.lvl !== before) {
      const line = fill(lineFor(api2, drinker, DRUNK_LINES2[x.lvl], "drunk:" + x.lvl), words(drinker));
      if (x.lvl === 3) api2.emote("\u{1F95B} " + line, drinker);
      else api2.privateEmote(drinker, line);
    }
    api2.save();
  }
  function onActivity(data) {
    const a = api2.activityInfo(data);
    if (a.src !== a.tgt || !on(a.src)) return;
    const noop = () => {
    };
    if (/Bowl_?Eat$/i.test(a.act) && near(a.src, "trough")) eat(a.src, noop, "bowl");
    else if (/Bowl_?Drink$/i.test(a.act) && near(a.src, "water")) drink(a.src, noop, "bowl");
  }
  var bar = (v) => Math.round(v) + "%";
  function cmdNeeds(c) {
    const { sender, args, api: A } = c, d = D2(), w = String(args[0] || "").toLowerCase();
    if (w === "farm") {
      if (!A.isProprietor(sender)) return c.reply("Only proprietors switch barn life on or off for the whole farm, sugar.");
      const v = String(args[1] || "").toLowerCase();
      d.farmOff = v ? v === "off" : !d.farmOff;
      A.save();
      return c.reply("\u{1F33E} Barn life for the whole farm: " + (d.farmOff ? "OFF. Nobody gets hungry or reminded." : "ON (for everyone who said ?needs on)."));
    }
    if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar.");
    if (w === "on" || w === "off") {
      if (w === "on") {
        d.optIn[sender] = true;
        needsOf2(sender).t = Date.now();
      } else delete d.optIn[sender];
      A.save();
      return c.reply(w === "on" ? "\u{1F33E} Barn life ON. You'll get hungry, thirsty and scruffy over time (only while you're here). Eat at a trough, drink at a water spot, and ask staff to groom you. ?needs off any time." : "\u{1F33E} Barn life OFF. No more hunger, thirst or reminders.");
    }
    if (!on(sender)) return c.reply("\u{1F33E} Barn life is off for you" + (d.farmOff ? " (switched off farm-wide)" : "") + ". ?needs on switches it on.");
    const n = needsOf2(sender), x = d.drunk[sender];
    c.reply("\u{1F33E} Food " + bar(n.food) + " \xB7 \u{1F4A7} Water " + bar(n.water) + " \xB7 \u{1FAAE} Grooming " + bar(n.groom) + (x ? " \xB7 \u{1F95B} " + DRUNK[x.lvl] : ""));
  }
  function cmdRefill(c) {
    const { sender, args, api: A } = c, d = D2();
    const t = String(args[0] || "").toLowerCase() || near(sender, "trough");
    if (!t || !A.spot(t) || !t.startsWith("trough")) return c.reply("Which trough, sugar? ?refill trough-1, standin' next to it.");
    if (!A.onSpot(sender, t, 1)) return c.reply("You need to be standin' at " + t + " to fill it, hon.");
    d.troughs[t] = TROUGH_HELPINGS;
    A.staffPoints(sender, 1, "refill");
    A.save();
    A.emote("\u{1F33E} " + A.name(sender) + " hauls a sack over and fills " + t + " to the brim with fresh feed.", sender);
  }
  var GROOM_STOCK2 = [
    "%by% nuzzles in close and grooms %name% from ears to rump, slow and thorough, till their coat lies smooth.",
    "%by% licks and nibbles along %name%'s neck and shoulders, groomin' them the way stock do. %name% leans into it.",
    "%by% works over %name% with tongue and teeth and nose, pickin' out the straw, and doesn't skip the good spots.",
    "%name% holds still and sighs while %by% grooms them, flank to flank, both of them warm and drowsy by the end.",
    "%by% combs through %name%'s hair with their fingers, then nuzzles behind an ear. %name%'s tail gives them away."
  ];
  GROOM_STOCK2.push(...GROOM_STOCK);
  function cmdGroom(c) {
    const { sender, args, api: A } = c;
    const t = A.find(args[0]);
    if (!A.rec(sender) || !(A.rec(sender).roles || []).length) return c.reply("Groomin's for folks on the farm's books, sugar. ?apply gets you started.");
    if (!t || !A.rec(t)) return c.reply("Who are we groomin', sugar? ?groom <who>, standin' next to them.");
    if (t === sender) return c.reply("You can't reach your own back, sugar. Ask somebody to groom you.");
    if (!on(t)) return c.reply(A.name(t) + " doesn't have barn life on, so there's nothin' to track. Brush 'em anyway, they'll like it!");
    const me = A.pos(sender), them = A.pos(t);
    if (!me || !them || Math.max(Math.abs(me.X - them.X), Math.abs(me.Y - them.Y)) > 1) return c.reply("Get right up next to " + A.name(t) + " to groom 'em, hon.");
    const n = needsOf2(t);
    n.groom = FULL;
    n.warned.groom = 100;
    if (A.isStaff(sender)) A.staffPoints(sender, 1, "groom");
    A.save();
    A.emote("\u{1FAAE} " + fill(lineFor(A, t, A.isStaff(sender) ? groomPool(t) : GROOM_STOCK2, "groom"), words(t, { by: A.name(sender) })), t);
  }
  function rate(mn) {
    if (!on(mn)) return 1;
    const n = needsOf2(mn);
    if (n.food < 25 || n.water < 25) return 0.75;
    if (n.food >= 60 && n.water >= 60 && n.groom >= 50) return 1.1;
    return 1;
  }
  function companion(mn) {
    if (!api2.rec(mn)) return null;
    const d = D2(), cards = herdCards(mn);
    const tg = { label: "Barn life (food, water, grooming)", desc: "Only while you're here. Reminders come privately, at most every 30 minutes.", on: !!d.optIn[mn], cmd: "needs " + (d.optIn[mn] ? "off" : "on") };
    if (!on(mn)) cards.push({ title: "Barn life", toggles: [tg], note: d.farmOff ? "Switched off farm-wide right now." : void 0 });
    else {
      const n = needsOf2(mn), x = d.drunk[mn];
      const kind = (v) => v < 25 ? "alert" : v >= 60 ? "good" : void 0;
      cards.push({
        title: "Barn life",
        toggles: [tg],
        bars: [
          { label: "\u{1F33E} Food", value: bar(n.food), pct: n.food, kind: kind(n.food) },
          { label: "\u{1F4A7} Water", value: bar(n.water), pct: n.water, kind: kind(n.water) },
          { label: "\u{1FAAE} Grooming", value: bar(n.groom), pct: n.groom, kind: kind(n.groom) }
        ],
        chips: x ? [{ text: "\u{1F95B} " + DRUNK[x.lvl], kind: "acc" }] : void 0,
        buttons: [{ label: "Eat (at a trough)", cmd: "eat" }, { label: "Drink (at water)", cmd: "drink" }],
        note: rate(mn) > 1 ? "Well kept: you're milkin' a little better." : rate(mn) < 1 ? "Hungry or thirsty: your milk's slowin' down." : void 0
      });
    }
    if (api2.isStaff(mn)) {
      const tr = Object.keys(api2.spots()).filter((n) => n.startsWith("trough"));
      if (tr.length) cards.push({
        staff: true,
        title: "Troughs",
        lines: tr.map((t) => [t, (d.troughs[t] === void 0 ? TROUGH_HELPINGS : d.troughs[t]) + " / " + TROUGH_HELPINGS]),
        input: { placeholder: "Bessie", label: "Groom (stand next to them)", cmd: "groom" },
        note: "Refill a trough with ?refill <trough> standin' next to it."
      });
    }
    return { cards };
  }
  connect({
    name: "barn-life",
    label: "Barn life",
    version: "1.0.0",
    guide: "?needs on to get hungry, thirsty and scruffy while you're on the farm (?needs off stops it). Eat at a trough spot with ?eat, drink at a water spot with ?drink (BC+ and MPA bowl activities count there too). Staff: ?groom <who> next to them, ?refill <trough> next to it. Drinking milk makes you content, then sleepy, then milk-drunk. Proprietors: ?needs farm on|off." + HERD_GUIDE,
    setup(a) {
      api2 = a;
      D2();
      herdSetup(a, D2, needsOf2, on);
    },
    commands: {
      ...herdCommands,
      needs: { usage: "needs on|off", private: true, run: cmdNeeds },
      eat: { usage: "eat", run: (c) => eat(c.sender, c.reply) },
      drink: { usage: "drink", run: (c) => drink(c.sender, c.reply) },
      refill: { usage: "refill <trough>", rank: "staff", run: cmdRefill },
      groom: { usage: "groom <who>", run: cmdGroom }
      // stock can groom each other too
    },
    on: { tick: () => {
      tick();
      herdTick();
    }, activity: onActivity, nurse: milkDrunk },
    rates: { milk: rate },
    companion
  });
})();
