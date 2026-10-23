// ==UserScript==
// @name         BnB Farm add-on: Conditioning
// @namespace    bnbfarm
// @version      1.1.0
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-conditioning.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-conditioning.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Guided trance sessions per species and level (fun, deep, no human left) for people with ?hypno on, run by their herd leader; tiers and nicknames grow with sessions. Runs on the farm bot's computer, next to the Farmhand Bot script.
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
  var between = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  var fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => vars[k] !== void 0 ? vars[k] : m);
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

  // addons/conditioning/more-lines.js
  var SPECIES_MORE = {
    bull: { a: "bull", s: "snort", p: "heavy balls", act: "breed and obey", pose: "on all fours, head low", names: ["good bull", "farm bull", "breeding bull", "dumb stud bull"] },
    kitt: { a: "kitty", s: "mew", p: "twitching tail", act: "purr and present", pose: "curled low, hips up", names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
    rabbit: { a: "bunny", s: "squeak", p: "twitchy ears", act: "hop and breed", pose: "crouched low, nose twitching", names: ["sweet bunny", "farm bunny", "breeding doe", "dumb breeding doe"] },
    fox: { a: "fox", s: "yip", p: "bushy tail", act: "present and please", pose: "low on your elbows, tail high", names: ["sweet fox", "farm vixen", "eager vixen", "dumb little vixen"] },
    wolf: { a: "wolf", s: "howl", p: "thick ruff", act: "heel and obey", pose: "kneeling up, paws tucked", names: ["good wolf", "farm wolf", "obedient wolf", "dumb tame wolf"] },
    deer: { a: "doe", s: "bleat", p: "soft flanks", act: "stand still and wait", pose: "on all fours, head low", names: ["sweet doe", "farm doe", "tame doe", "dumb little doe"] },
    goblin: { a: "goblin", s: "giggle", p: "greedy hands", act: "fetch and serve", pose: "squatting low, hands on the floor", names: ["good goblin", "farm goblin", "useful goblin", "dumb goblin"] }
  };
  var MALE = {
    cow: { a: "bull", names: ["good bull", "farm bull", "breeding bull", "dumb stud bull"] },
    horse: { a: "stallion", names: ["good stallion", "farm stallion", "stud stallion", "dumb stud"] },
    pig: { a: "boar", names: ["sweet piggy", "farm boar", "greedy boar", "filthy boar"] },
    bunny: { a: "bunny", names: ["sweet bunny", "farm bunny", "breeding buck", "dumb breeding buck"] },
    rabbit: { a: "bunny", names: ["sweet bunny", "farm bunny", "breeding buck", "dumb breeding buck"] },
    goat: { a: "goat", names: ["sweet goat", "farm goat", "billy goat", "dumb billy"] },
    sheep: { a: "ram", names: ["sweet lamb", "farm ram", "flock ram", "dumb ram"] },
    fox: { a: "fox", names: ["sweet fox", "farm fox", "eager fox", "dumb little fox"] },
    deer: { a: "buck", names: ["sweet buck", "farm buck", "tame buck", "dumb little buck"] },
    dog: { names: ["good dog", "farm dog", "obedient mutt", "dumb mutt"] },
    pup: { names: ["good pup", "farm pup", "obedient pup", "dumb mutt"] }
  };
  var UDDER_KINDS = ["cow", "goat"];
  var SCRIPT_MORE = {
    settle: [
      "Listen, %name%. Just listen. The barn is warm, the straw is soft, and my voice is the only thing that matters.",
      "Let your hands go loose. Let your jaw go loose. Let everything that's holding on just let go.",
      "In through your nose, slow. Out through your mouth, slower. Again. Good.",
      "Somewhere a cow lows and a gate creaks, and every sound just makes you sleepier.",
      "Your body is getting heavy, %name%, heavy and warm, sinking into the straw.",
      "You've worked hard. You've been good. Now you get to stop, and just hear me.",
      "Feel the weight of your own head. Let it tip. Let it rest.",
      "There's nothing you need to do right now, %name%. Nothing at all but listen."
    ],
    deeper: {
      fun: [
        "Sinking softly now, like a calf curling up in the hay.",
        "Each breath out, a little further down. Nice and easy. Nothing to it.",
        "It's so pleasant down here, %name%. Warm and simple and quiet.",
        "Drifting, drifting, and every drift feels better than the last.",
        "You're my good {a} now, and being my good {a} feels so easy."
      ],
      deep: [
        "Down past the busy part of your mind, down where it's dark and warm and slow.",
        "Every word I say pushes you a little deeper, and you don't want me to stop.",
        "Your thoughts are coming slower now, one at a time, and then not at all.",
        "Deeper. You can't feel where your body ends and the straw begins.",
        "So deep. So good. A good {a} sinks when they're told."
      ],
      nhl: [
        "Deeper than thought. Deeper than words. Down where only the {a} lives.",
        "Your name is getting far away, %name%. Let it go. You won't need it down here.",
        "Every breath out takes a little more of the person with it. Let it go.",
        "There's no up from here unless I bring you, and I'm in no hurry.",
        "Lower and lower, until you're nothing but warm and obedient and {a}."
      ]
    },
    suggest: {
      fun: [
        "Every time you hear the milking bell, you'll feel a little flutter of good {a} pride.",
        "When someone pats your head, you'll lean into it. You won't even notice you're doing it.",
        "You'll find yourself standing the way a good {a} stands: {pose}. It just feels right.",
        "Every time you {s}, you'll feel a little warm rush. Good {a}s make their noises.",
        "When someone says {pet}, you'll smile. You won't be able to help it.",
        "{t}Your tits will feel full and heavy and proud, like they're there to be admired.",
        "{c}When you're praised, a little warm throb runs through your cock. Good {a}s like praise."
      ],
      deep: [
        "Your mind stays soft and slow even after you wake. Thinking can wait. Obeying can't.",
        "When your handler speaks, everything else gets quiet. That's how it should be.",
        "The ache stays with you after you wake, low and warm, and you'll never quite get to finish it.",
        "You'll {s} when you're happy. You'll {s} when you're needy. Words are for people.",
        "{t}Your tits are the farm's, and they ache to be milked whenever someone looks at them.",
        "{c}Your cock is the farm's. It stays hard and aching and it doesn't belong to you.",
        "{v}Your pussy is the farm's. Wet and ready whenever the farm wants it.",
        "Every time you kneel, you'll feel yourself sink a little. Kneeling is home."
      ],
      nhl: [
        "There was never a person. There was only ever a {a} that thought it was one.",
        "Hands are paws. Words are noises. Wanting is waiting. That's all you need.",
        "When you're touched, you push into it like an animal. When you're left, you wait like one.",
        "{t}Your udders are for milking. That's what they're for. That's what you're for.",
        "{c}You're for breeding now. Your cock knows it even if the rest of you forgets.",
        "{v}You're for breeding now. Your pussy knows it even if the rest of you forgets.",
        "Your pen is home. Your handler is everything. The farm is the whole world."
      ]
    },
    wake: {
      fun: [
        "Coming up now. Three, two, one, and you're back in the barn, %name%, smiling for no reason at all. Good {a}.",
        "Up you come, slow and easy. Wiggle your fingers. Open your eyes. Welcome back, {pet}."
      ],
      deep: [
        "I'll bring you up now, %name%, but not all the way. Part of you stays down there, listening. Three, two, one.",
        "Up, slowly. Your name comes back first, then your hands. But the quiet stays, and so does my voice."
      ],
      nhl: [
        "No counting up, {pet}. Just open your eyes. The {a} can look around now.",
        "The session's over. The {a} isn't. Stay as you are."
      ]
    }
  };
  var GEAR_SUGGEST = {
    collar: [
      "Feel your collar, %name%. Every time it presses your throat, you remember whose {a} you are.",
      "Your collar is warm against your neck. It's always there, and so am I."
    ],
    leash: [
      "Feel the leash. A good {a} goes where the leash goes, and never minds.",
      "Every tug of your leash is a tug on something deeper. You follow. You like following."
    ],
    bell: [
      "Every time your bell rings, you sink a little. Ring, sink. Ring, sink.",
      "Your bell tells the whole farm where its {a} is. You like being found."
    ],
    gag: [
      "You don't need your mouth for words, {pet}. Let it rest round the gag. Your {s} is enough.",
      "The gag keeps the words in. Good. Words were never yours anyway."
    ],
    blind: [
      "You can't see, and you don't need to. My voice is the only thing to follow.",
      "In the dark behind the blindfold, there's only my voice and the warm straw."
    ],
    hood: [
      "Inside the hood, there's no face to be. There's only the {a}.",
      "The hood holds you close and quiet. Nothing in here but my voice."
    ],
    paws: [
      "Your hands are paws now. Paws don't grab. Paws don't hold. Paws wait.",
      "Feel how useless your paws are. Isn't it a relief, not having to do anything with them?"
    ],
    arms: [
      "Your arms are tied, so you don't have to decide anything with them. Let them rest.",
      "Bound, you're free of choices. Just a {a}, held still, listening."
    ],
    cage: [
      "{c}Your cage keeps you good. You don't need to touch. You don't even want to.",
      "{c}Every throb against your cage is the farm reminding you who it belongs to."
    ],
    nipples: [
      "That little bite at your nipples is the farm's hand on you. Feel it, and sink.",
      "Your clamped nipples throb in time with my voice. Every throb, a little deeper."
    ],
    latex: [
      "Your latex is your hide now. Smooth, shining, nothing human under it.",
      "Feel how the rubber holds you. Tight. Close. Like it's keeping the {a} in."
    ],
    harness: [
      "Your harness holds you like a farm holds its stock. Snug, and safe, and owned.",
      "Feel every strap of your harness. Each one says: tack, not clothes."
    ],
    ears: [
      "Feel your ears. They twitch at my voice, don't they. {a}s' ears always do.",
      "Your ears are listening harder than you are. Let them."
    ],
    tail: [
      "Feel your tail. It moves when you're happy, and you're happy now.",
      "Your tail is part of you. It always was."
    ],
    hooves: [
      "Your hooves keep you up on your toes, the way a good {a} should stand.",
      "Feel the weight of your hooves. You weren't made for walking like a person."
    ],
    noseRing: [
      "Your nose ring is where a handler leads a good {a}. You'll follow it anywhere.",
      "Feel the ring in your nose. One tug, and you'll come."
    ]
  };

  // addons/conditioning/index.js
  var SPECIES = {
    cow: { a: "cow", s: "moo", p: "heavy udders", act: "give milk", pose: "on all fours, head low", names: ["sweet cow", "dairy cow", "milk cow", "dumb milk cow"] },
    pony: { a: "pony", s: "whinny", p: "strong flanks", act: "pull and prance", pose: "head high, knees lifting", names: ["good pony", "farm pony", "cart pony", "dumb harness pony"] },
    horse: { a: "mare", s: "whinny", p: "strong flanks", act: "carry and obey", pose: "head high, standing square", names: ["good mare", "farm mare", "broodmare", "dumb broodmare"] },
    pup: { a: "pup", s: "woof", p: "wagging tail", act: "heel and fetch", pose: "kneeling up, paws tucked", names: ["good pup", "farm pup", "obedient bitch", "dumb mutt"] },
    dog: { a: "dog", s: "woof", p: "wagging tail", act: "heel and fetch", pose: "kneeling up, paws tucked", names: ["good dog", "farm dog", "obedient bitch", "dumb mutt"] },
    kitty: { a: "kitty", s: "mew", p: "twitching tail", act: "purr and present", pose: "curled low, hips up", names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
    cat: { a: "kitty", s: "mew", p: "twitching tail", act: "purr and present", pose: "curled low, hips up", names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
    pig: { a: "piggy", s: "oink", p: "soft round belly", act: "root and wallow", pose: "nose to the ground", names: ["sweet piggy", "farm pig", "greedy sow", "filthy sow"] },
    bunny: { a: "bunny", s: "squeak", p: "twitchy ears", act: "hop and breed", pose: "crouched low, nose twitching", names: ["sweet bunny", "farm bunny", "breeding doe", "dumb breeding doe"] },
    goat: { a: "goat", s: "bleat", p: "full udder", act: "give milk", pose: "on all fours, head low", names: ["sweet goat", "dairy goat", "milk goat", "dumb nanny"] },
    sheep: { a: "lamb", s: "baa", p: "soft fleece", act: "follow the flock", pose: "on all fours, head low", names: ["sweet lamb", "farm lamb", "flock ewe", "dumb sheep"] },
    default: { a: "animal", s: "low animal sound", p: "body", act: "obey", pose: "kneeling, hands on your thighs", names: ["good animal", "farm animal", "livestock", "dumb livestock"] }
  };
  Object.assign(SPECIES, SPECIES_MORE);
  var LEVELS = ["fun", "deep", "nhl"];
  var LEVEL_NAME = { fun: "Fun", deep: "Deep", nhl: "No human left" };
  var MILESTONES = [3, 7, 15, 30];
  var SCRIPT = {
    settle: [
      "Hear my voice, %name%. Just my voice. Let everything else in the barn go quiet.",
      "Breathe in slow. Breathe out slower. Every breath out lets your shoulders drop a little more.",
      "You don't have to think right now, %name%. Thinking is work, and you're not working. You're listening.",
      "Feel how heavy your eyelids are getting. It's alright to let them close."
    ],
    deeper: {
      fun: [
        "Down a little now. Soft and easy, like sinking into warm straw.",
        "Every word I say makes it easier to drift. Easier to just be my {pet}.",
        "Good. You're drifting, and it feels so nice to let go."
      ],
      deep: [
        "Deeper now. Each time you breathe out, you sink twice as far.",
        "There's nothing above you but my voice, and nothing below you but more quiet. Keep sinking.",
        "Your thoughts are getting slow and simple. Simple is good. Simple is right for a {a}.",
        "So deep now. You don't need words up here. You just need to listen."
      ],
      nhl: [
        "Deeper. Past where the words are. Past where your name lives.",
        "Let the person part of you drift away like a dream you're forgetting. There's only the {a} left.",
        "Nothing up there to hold on to. No worries, no choices, no human things. Just a {a}.",
        "Deeper than you've ever been. And every time we do this, you'll go deeper still."
      ]
    },
    suggest: {
      fun: [
        "When you come up, your body remembers how a good {a} stands: {pose}.",
        "Your hands stay away from yourself. Good {a}s don't touch. They wait to be touched.",
        "Every time someone calls you {pet}, you'll feel a warm little glow of pride.",
        "Being a good {a} is easy. You just {act}, and everything feels right."
      ],
      deep: [
        "Only my voice matters now. Other voices are just noise in the barn.",
        "Feel the heat building low in your belly. Let it build. You don't get to finish. You just ache, and it feels like being good.",
        "When I tell you to, you'll {s}. Not words. Just a {s}. Go on. Let it out.",
        "Every bit of you belongs to the farm, your {p} most of all. You feel that every time someone looks at you.",
        "You {act} because it's what you're for. It's not a choice, and that's a relief."
      ],
      nhl: [
        "There's no human left in here. Just a {a}, {pose}, waiting for its handler.",
        "Clothes don't feel like clothes anymore. They feel like a coat, a harness, a hide. You were born in them.",
        'From now on, when anyone says "good {a}", you drop right back here: empty, warm and obedient.',
        "Words are getting hard. That's alright. {a}s don't need words. A {s} says everything.",
        "You {act}. That's all. That's everything. You don't remember wanting anything else."
      ]
    },
    wake: {
      fun: ["Now I'm going to count you up. Three: feeling your body again. Two: lighter. One: eyes open, %name%. Good {a}."],
      deep: ["Counting up slowly. Five, four: the barn coming back. Three, two: your name, your hands. One: awake, %name%. But part of you is still listening."],
      nhl: [
        "I won't count you all the way up, {pet}. You'll open your eyes, but the {a} stays. It's yours now.",
        "Open your eyes. Look around the barn. Nothing in there but a {a}. Good."
      ]
    }
  };
  var ECHS_LINES = {
    fun: ["You cannot move now, sugar. Stay right there, still as a post.", "Kneel for me. Knees down in the straw, nice and easy.", "Hands behind your back, neat as a bow."],
    deep: ["You hear only my voice now. Everything else in the barn is just the wind.", "Kneel spread for me, knees wide, the way a good {a} waits.", "You are very aroused, achin' and warm, and it only builds.", "You cannot cum. Not one drop till the farm says so."],
    nhl: ["You cannot speak now. A {a} doesn't need words.", "Get on your hands and knees, down where a {a} belongs.", "You will not notice being undressed. Clothes don't matter to a {a}.", "You are right on the edge, and that's where you stay.", "You cannot cum. The farm decides when, and it hasn't."]
  };
  var forEchs = (t) => String(t).replace(/\bfeels\b/g, "seems").replace(/\bFeels\b/g, "Seems").replace(/\bfeeling\b/g, "sensation").replace(/\bfeel\b/g, "sense").replace(/\bFeel\b/g, "Sense");
  SCRIPT.settle.push(...SCRIPT_MORE.settle);
  for (const l of ["fun", "deep", "nhl"]) for (const part of ["deeper", "suggest", "wake"]) SCRIPT[part][l].push(...SCRIPT_MORE[part][l]);
  var api = null;
  var running = /* @__PURE__ */ new Map();
  var waitingEchs = /* @__PURE__ */ new Map();
  function D() {
    const d = api.data();
    d.people = d.people || {};
    return d;
  }
  var me = (mn) => D().people[mn] = D().people[mn] || { max: "fun", sessions: { fun: 0, deep: 0, nhl: 0 }, total: 0, tier: 0 };
  function words(mn) {
    const key = SPECIES[api.species(mn)] ? api.species(mn) : SPECIES[String((api.rec(mn) || {}).species || "").toLowerCase()] ? String(api.rec(mn).species).toLowerCase() : "default";
    const w = Object.assign({}, SPECIES[key]), b = bodyOf(api, mn);
    if (b && (b.g === "male" || b.g === "femboy") && MALE[key]) Object.assign(w, MALE[key]);
    if (UDDER_KINDS.includes(key) && b && !b.tits) w.p = b.cock ? "heavy balls" : "body";
    return w;
  }
  function petName(mn) {
    const w = words(mn), r = api.rec(mn) || {}, t = me(mn).tier;
    const i = Math.max(0, Math.min(3, r.degradeMe ? t + 1 : r.praiseMe ? t - 1 : t));
    return w.names[i];
  }
  function say(mn, line) {
    const w = words(mn);
    return fill(line, { name: api.name(mn) }).replace(/\{a\}/g, w.a).replace(/\{s\}/g, w.s).replace(/\{p\}/g, w.p).replace(/\{act\}/g, w.act).replace(/\{pose\}/g, w.pose).replace(/\{pet\}/g, petName(mn)).replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
  }
  var handful = (list, n, b) => {
    const pool = fitting(list, b).slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, n).map(untag);
  };
  function scriptFor(level, mn, own, echs) {
    const b = mn ? bodyOf(api, mn) : null, g = mn ? gearOf(api, mn) : {};
    const settle = handful(SCRIPT.settle, 4, b), deeper = handful(SCRIPT.deeper[level], level === "fun" ? 3 : 4, b);
    const worn = Object.keys(GEAR_SUGGEST).filter((k) => g[k]), gearLines = handful(worn.map((k) => pick(GEAR_SUGGEST[k])), Math.min(2, worn.length), b);
    const suggest = handful(SCRIPT.suggest[level], (level === "fun" ? 4 : 5) - gearLines.length, b);
    for (const l of gearLines) suggest.splice(1 + Math.floor(Math.random() * suggest.length), 0, l);
    if (own) {
      suggest.splice(Math.min(1, suggest.length), 0, own);
      suggest.push(own);
    }
    if (echs) {
      const add = (level === "nhl" ? ECHS_LINES.deep.slice(0, 2) : level === "deep" ? ECHS_LINES.fun.slice(0, 1) : []).concat(ECHS_LINES[level]);
      for (const l of add) suggest.splice(Math.floor(Math.random() * (suggest.length + 1)), 0, l);
    }
    const wake = handful(SCRIPT.wake[level], 1, b);
    const lines = [].concat(settle, deeper, suggest, wake);
    lines.cut = [settle.length, deeper.length, suggest.length];
    return lines;
  }
  function start(by, mn, level, own, echs) {
    running.set(mn, { by, level, lines: scriptFor(level, mn, own, echs), i: 0, echs: !!echs });
    step(mn);
  }
  function step(mn) {
    const run = running.get(mn);
    if (!run) return;
    if (!api.char(mn)) {
      running.delete(mn);
      return;
    }
    const line = run.lines[run.i];
    if (!line) {
      finish(mn, run);
      return;
    }
    const [s, d, g] = run.lines.cut;
    const haze = run.i < s ? 1 : run.i < s + d ? run.level === "nhl" ? 3 : 2 : run.i < s + d + g ? { fun: 1, deep: 2, nhl: 3 }[run.level] : run.level === "nhl" ? 1 : 0;
    if (haze !== run.haze) {
      run.haze = haze;
      api.trance(mn, haze);
      api.face(mn, haze ? "trance" : "clear", haze ? 600 : 1);
    }
    if (run.echs && api.echs && api.echs.under(mn)) api.echs.say(mn, forEchs(say(mn, line)));
    else api.voice(mn, say(mn, line));
    if (run.level !== "fun" && run.i >= s && api.arouse) api.arouse(mn, run.level === "nhl" ? 7 : 5, run.level === "nhl" ? 92 : 85);
    run.i++;
    api.later(() => step(mn), between(35, 50) * 1e3);
  }
  function finish(mn, run) {
    running.delete(mn);
    if (run.echs && run.level !== "nhl" && api.echs) api.later(() => api.echs.wake(mn), 4e3);
    api.later(() => {
      if (!running.has(mn)) {
        api.trance(mn, 0);
        api.face(mn, "clear", 1);
      }
    }, run.level === "nhl" ? 12e4 : 3e3);
    const x = me(mn);
    x.sessions[run.level] = (x.sessions[run.level] || 0) + 1;
    x.total++;
    const tier = MILESTONES.filter((m) => x.total >= m).length;
    if (tier > x.tier) {
      x.tier = tier;
      api.notice(mn, "\u{1F300} Conditioning tier " + tier + ". You're a " + petName(mn) + " now, deeper every time.");
      if (run.by !== mn) api.notice(run.by, "\u{1F300} " + api.name(mn) + " reached conditioning tier " + tier + ".");
    }
    api.save();
    const next = MILESTONES.find((m) => x.total < m);
    api.notice(mn, "\u{1F300} Session over: " + LEVEL_NAME[run.level] + ", your " + x.total + (x.total === 1 ? "st" : x.total === 2 ? "nd" : x.total === 3 ? "rd" : "th") + ". " + (next ? next - x.total + " more to the next tier." : "You're as deep as the farm takes anybody.") + (run.level === "nhl" ? " The haze lifts in a couple of minutes." : ""));
    if (run.by !== mn) api.notice(run.by, "\u{1F300} " + api.name(mn) + "'s " + LEVEL_NAME[run.level] + " session is done (" + x.total + " in all, tier " + x.tier + ").");
  }
  function stop(mn, why) {
    waitingEchs.delete(mn);
    if (!running.has(mn)) return false;
    const run = running.get(mn);
    running.delete(mn);
    if (run.echs && api.echs) api.echs.wake(mn);
    api.trance(mn, 0);
    api.face(mn, "clear", 1);
    if (why) api.voice(mn, why);
    return true;
  }
  function cmdCondition(c) {
    const { sender, args, api: A } = c;
    if (String(args[0] || "").toLowerCase() === "stop") {
      const t2 = A.find(args[1]);
      if (!t2) return c.reply("Whose session, sugar? ?hyp stop <who>");
      if (!(A.isProprietor(sender) || A.herdLeaderOf(t2) === sender || running.get(t2)?.by === sender)) return c.reply("That's not your session to stop, hon.");
      return c.reply(stop(t2, "That's all for now. Come up gently, " + A.name(t2) + ".") ? "\u{1F300} Stopped." : A.name(t2) + " isn't in a session.");
    }
    const self = /^(me|myself|self)$/i.test(String(args[0] || ""));
    const t = self ? sender : A.find(args[0]);
    if (!t || !A.rec(t)) return c.reply("Here's how: ?hyp <who> [fun|deep|nhl] [say <your own words>], or ?hyp me [level] to go under yourself. They need ?hypno on, and it never goes deeper than they allow.");
    if (!self && !(A.isProprietor(sender) || A.herdLeaderOf(t) === sender)) return c.reply("Only " + A.name(t) + "'s herd leader (or a proprietor) runs their sessions, sugar. ?hyp me takes you under yourself.");
    if (!A.rec(t).hypno) return c.reply(A.name(t) + " hasn't said ?hypno on, so no sessions, hon.");
    if (!A.char(t)) return c.reply(A.name(t) + " needs to be here on the farm for a session.");
    if (running.has(t)) return c.reply(A.name(t) + " is already in a session.");
    const want = LEVELS.includes(String(args[1] || "").toLowerCase()) ? String(args[1]).toLowerCase() : me(t).max;
    if (LEVELS.indexOf(want) > LEVELS.indexOf(me(t).max)) return c.reply(A.name(t) + " only allows " + LEVEL_NAME[me(t).max] + " sessions. That's their call.");
    const si = args.findIndex((a) => /^say$/i.test(a));
    const own = !self && si >= 0 ? args.slice(si + 1).join(" ").replace(/[()]/g, "").trim().slice(0, 160) : "";
    if (args.slice(1, si >= 0 ? si : void 0).some((a) => /^echs$/i.test(a))) {
      if (!A.echs) return c.reply("The farm's ECHS side isn't running, sugar.");
      const no = A.echs.ask(t, "conditioning");
      if (no) return c.reply("\u{1F300} Not through ECHS right now: " + no + ".");
      waitingEchs.set(t, { by: sender, level: want, own: own || null, at: Date.now() });
      return c.reply("\u{1F300} Reachin' for " + A.name(t) + " through their ECHS. When they go under, a " + LEVEL_NAME[want] + " session starts through it.");
    }
    start(sender, t, want, own || null);
    c.reply("\u{1F300} " + LEVEL_NAME[want] + " session started for " + A.name(t) + " (about " + Math.round(((running.get(t) || {}).lines || []).length * 42 / 60) + " minutes). ?hyp stop " + A.name(t) + " ends it.");
  }
  function cmdLevel(c) {
    const { sender, args, api: A } = c, v = String(args[0] || "").toLowerCase();
    if (!A.rec(sender)) return c.reply("That's just for folks on the books, sugar.");
    if (!LEVELS.includes(v)) return c.reply("\u{1F300} You allow " + LEVEL_NAME[me(sender).max] + " sessions. ?depth fun, deep or nhl (No human left) sets the deepest you'll go.");
    me(sender).max = v;
    A.save();
    c.reply("\u{1F300} The deepest a session can take you is now " + LEVEL_NAME[v] + "." + (A.rec(sender).hypno ? "" : " (Sessions also need ?hypno on.)"));
  }
  var progressText = (mn) => {
    const x = me(mn), next = MILESTONES.find((m) => x.total < m);
    return "\u{1F300} Conditioning: tier " + x.tier + " (" + petName(mn) + ") \xB7 " + x.total + " sessions (fun " + x.sessions.fun + ", deep " + x.sessions.deep + ", nhl " + x.sessions.nhl + ")" + (next ? " \xB7 next tier at " + next : " \xB7 top tier") + " \xB7 allows " + LEVEL_NAME[x.max];
  };
  function companion(mn) {
    const r = api.rec(mn);
    if (!r) return null;
    const x = me(mn), next = MILESTONES.find((m) => x.total < m), cards = [];
    cards.push({
      title: "Conditioning",
      text: r.hypno ? void 0 : "Sessions need ?hypno on (in your Toggles).",
      lines: [["Tier", x.tier + " \xB7 " + petName(mn)], ["Sessions", x.total], ["Deepest allowed", LEVEL_NAME[x.max]]],
      bars: next ? [{ label: "To the next tier", value: x.total + " / " + next, pct: x.total / next * 100 }] : void 0,
      buttons: LEVELS.map((l) => ({ label: "Allow " + LEVEL_NAME[l], cmd: "depth " + l, accent: l === x.max })).concat(running.has(mn) ? [{ label: "Wake me up", cmd: "wake", accent: true }] : r.hypno ? [{ label: "Take me under", cmd: "hyp me" }, { label: "Ask my ECHS", cmd: "hypnotize me" }] : [])
    });
    if (api.isStaff(mn)) cards.push({
      staff: true,
      title: "Run a session",
      input: { placeholder: "Bessie deep", label: "Start (who, level)", cmd: "hyp" },
      note: "Only for your own herd (proprietors: anyone). Never deeper than they allow."
    });
    return { cards };
  }
  connect({
    name: "conditioning",
    label: "Conditioning",
    version: "1.2.0",
    guide: "Guided trance sessions written for your species, in the farm's voice. Needs ?hypno on; ?depth fun|deep|nhl sets the deepest you allow. Your herd leader runs them with ?hyp <who> [level] [say <their own words>], or take yourself under with ?hyp me. With ECHS: ?hypnotize me (or ?hyp <who> [level] echs) and the session runs through it. Sessions count toward conditioning tiers (3, 7, 15, 30). ?wake or ?safe ends one at once. Works alongside ECHS.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      hyp: { usage: "hyp <who|me> [fun|deep|nhl] [say <words>]", aliases: ["condition"], private: true, run: cmdCondition },
      depth: { usage: "depth fun|deep|nhl", aliases: ["hypnolevel"], private: true, run: cmdLevel },
      wake: { usage: "wake", private: true, run: (c) => c.reply(stop(c.sender, "Coming up now. Eyes open, " + c.api.name(c.sender) + ". You're alright.") ? "\u{1F300} Session ended." : "You're not in a session, sugar.") },
      trance: { usage: "trance [who]", aliases: ["conditioning"], private: true, run: (c) => {
        const t = c.args[0] ? c.api.find(c.args[0]) : c.sender;
        if (t !== c.sender && !c.api.isStaff(c.sender)) return c.reply("Only staff look at somebody else's, sugar.");
        c.reply(t ? progressText(t) : "Who's that, hon?");
      } }
    },
    on: {
      safe: (mn) => stop(mn, null),
      leave: (mn) => stop(mn, null),
      // under with the farm girl through ECHS: the session runs through it (asked for with ?hyp … echs, or not)
      echsUnder: (mn, info) => {
        const r = api.rec(mn);
        if (!r || !r.hypno) return;
        api.echs.take(mn);
        if (running.has(mn)) {
          running.get(mn).echs = true;
          return;
        }
        const w = waitingEchs.get(mn);
        waitingEchs.delete(mn);
        const by = w && w.by || info && info.by || mn;
        start(by, mn, w ? w.level : me(mn).max, w ? w.own : null, true);
        if (by !== mn) api.notice(by, "\u{1F300} " + api.name(mn) + " is under with the farm: the " + LEVEL_NAME[running.get(mn).level] + " session's started through their ECHS.");
      },
      // they came up on their own (their /echs safeword): the farm's session stops too. ECHS's half hour: it carries on in the farm's voice
      echsWoke: (mn, info) => {
        waitingEchs.delete(mn);
        const run = running.get(mn);
        if (!run) return;
        if (info && info.self) stop(mn, null);
        else run.echs = false;
      }
    },
    companion
  });
})();
