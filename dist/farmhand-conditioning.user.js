// ==UserScript==
// @name         BnB Farm add-on: Conditioning
// @namespace    bnbfarm
// @version      2.5.0
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-conditioning.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-conditioning.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Guided trance sessions from the farm's trance library (inductions, deepeners, suggestions, triggers, wakes; written in the studio's trance editor), per species and level (fun, deep, no human left), for people with ?hypno on. With LSCG: its own trance in the farm's name, its beats, and triggers planted as LSCG suggestions. The farm's pull builds through the day (nudges, slippin' words, and at the top the farm takes them down). Tiers and nicknames grow with sessions. Runs on the farm bot's computer, next to the Farmhand Bot script.
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
  var pick = (list2) => list2[Math.floor(Math.random() * list2.length)];
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
  function fitting(list2, b) {
    const ok = list2.filter((l) => fits(l, b));
    if (ok.length) return ok;
    const plain = list2.filter((l) => !TAG_LEAD.test(l));
    return plain.length ? plain : list2;
  }

  // addons/conditioning/more-lines.js
  var SPECIES_MORE = {
    bull: { a: "bull", s: "snort", p: "heavy balls", act: "breed and obey", pose: "on all fours, head low", names: ["good bull", "farm bull", "breeding bull", "dumb stud bull"] },
    kitt: { a: "kitty", s: "mew", p: "twitching tail", act: "purr and present", pose: "curled low, hips up", names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
    rabbit: { a: "bunny", s: "squeak", p: "twitchy ears", act: "hop and breed", pose: "crouched low, nose twitching", names: ["sweet bunny", "farm bunny", "breeding doe", "dumb breeding doe"] },
    fox: { a: "fox", s: "yip", p: "bushy tail", act: "present and please", pose: "low on your elbows, tail high", names: ["sweet fox", "farm vixen", "eager vixen", "dumb little vixen"] },
    wolf: { a: "wolf", s: "howl", p: "thick ruff", act: "heel and obey", pose: "kneeling up, paws tucked", names: ["good wolf", "farm wolf", "obedient wolf", "dumb tame wolf"] },
    deer: { a: "doe", s: "bleat", p: "soft flanks", act: "stand still and wait", pose: "on all fours, head low", names: ["sweet doe", "farm doe", "tame doe", "dumb little doe"] },
    rat: { a: "rat", s: "squeak", p: "twitching whiskers", act: "scurry and serve", pose: "crouched low, hands tucked under your chin", names: ["sweet ratslut", "farm rat", "greedy little rat", "dumb gutter rat"] },
    dragon: { a: "dragon", s: "growl", p: "folded wings", act: "guard and obey", pose: "crouched low, wings folded, tail curled round you", names: ["good dragon", "farm dragon", "tame dragon", "dumb little dragon"] },
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
    dragon: { a: "drake", names: ["good drake", "farm drake", "tame drake", "dumb little drake"] },
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
        "Hands are {paws}. Words are noises. Wanting is waiting. That's all you need.",
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
      "Your hands are {paws} now. {paws} don't grab. {paws} don't hold. {paws} wait.",
      "Feel how useless your {paws} are. Isn't it a relief, not having to do anything with them?"
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

  // shared/trance-script.js
  var KINDS = ["induction", "deepener", "convincer", "suggestion", "trigger", "compulsion", "hangon", "wake", "slip", "nudge", "session"];
  var SPOKEN = KINDS.filter((k) => k !== "session");
  var SESSION_KINDS = ["induction", "deepener", "convincer", "suggestion", "trigger", "compulsion", "hangon", "wake"];
  var ASIDE = ["slip", "nudge"];
  var PLANTED = ["trigger", "compulsion", "hangon"];
  var WHEN = {
    wake: "they come up out of a session",
    leader: "their herd leader walks in",
    "leader talks": "their herd leader says somethin'",
    stall: "a milkin' stall takes them",
    full: "they're near full (80%)",
    fed: "a feeder feeds them",
    pat: "somebody pats their head",
    squeeze: "somebody gropes their tits",
    cum: "they cum"
  };
  var EFFECTS = {
    mootalk: "their sound slips out between their words",
    cowtalk: "no I: just this {animal}",
    yes: "every no comes out yes",
    edge: "kept right at the edge",
    needy: "kept warm and needy",
    fours: "they stay down low (kneelin' or all fours, their pick)",
    handsoff: "their hands won't touch themselves",
    hearing: "only the farm's voice (and their herd leader's) comes through",
    names: "everybody's names go fuzzy",
    heel: "drawn to their herd leader's side"
  };
  var KEEP_MS = { fun: 864e5, deep: 7 * 864e5 };
  var HANG_CAP_S = { fun: 20 * 60, deep: 60 * 60, nhl: 4 * 3600 };
  var LEVELS = ["fun", "deep", "nhl"];
  var BANDS = { delta: [1.5, 3.5], theta: [4.5, 7], alpha: [8.5, 11.5], beta: [13, 20] };
  var HZ_MIN = 1;
  var HZ_MAX = 30;
  var MAX_DOES = 3;
  var LABELS = ["level", "for", "wears", "tone", "pace", "pick", "beats", "volume", "look", "deeper", "pull", "trigger", "does", "waits", "when", "chance", "effect", "lasts", "visor"];
  var TONES = ["praise", "degrade"];
  var LSCG = {
    cum: "Orgasm",
    deny: "Denial",
    needy: "Insatiable",
    touch: "Perform Activity",
    strip: "Strip",
    pose: "Assume Pose",
    follow: "Follow",
    say: "Speak Phrase",
    forget: "Forget"
  };
  var FARM = { sound: "bnbfarm.sound", stall: "bnbfarm.stall", beg: "bnbfarm.beg", dose: "farmhand-dispensary.dose" };
  var FARM_TYPES = Object.values(FARM);
  var STEP_NAMES = { [FARM.sound]: "Their Sound", [FARM.stall]: "To a Free Stall", [FARM.beg]: "Beg to Be Milked", [FARM.dose]: "Take a Dose" };
  var stepName = (type) => STEP_NAMES[type] || String(type);
  var POSES = {
    kneel: { lower: "Kneel" },
    "kneel spread": { lower: "KneelingSpread" },
    "kneeling spread": { lower: "KneelingSpread" },
    "all fours": { full: "AllFours" },
    fours: { full: "AllFours" },
    stand: { upper: "BaseUpper", lower: "BaseLower" },
    "legs closed": { lower: "LegsClosed" },
    "legs spread": { lower: "Spread" },
    "hands behind": { upper: "BackBoxTie" },
    "hands behind back": { upper: "BackBoxTie" },
    "elbows behind": { upper: "BackElbowTouch" },
    "hands up": { upper: "OverTheHead" },
    "arms up": { upper: "OverTheHead" },
    yoked: { upper: "Yoked" }
  };
  var STRIP = {
    top: ["ClothOuter", "Cloth", "Suit", "Bra", "Corset"],
    bottoms: ["ClothLower", "SuitLower", "Panties", "Garters"],
    bottom: ["ClothLower", "SuitLower", "Panties", "Garters"],
    underwear: ["Bra", "Panties"],
    feet: ["Shoes", "Socks", "SocksLeft", "SocksRight"],
    shoes: ["Shoes"],
    gloves: ["Gloves"],
    hat: ["Hat"]
  };
  var ZONES = {
    head: "ItemHead",
    hair: "ItemHead",
    ears: "ItemEars",
    nose: "ItemNose",
    mouth: "ItemMouth",
    lips: "ItemMouth",
    neck: "ItemNeck",
    arms: "ItemArms",
    hands: "ItemHands",
    tits: "ItemBreast",
    breasts: "ItemBreast",
    chest: "ItemBreast",
    udders: "ItemBreast",
    nipples: "ItemNipples",
    belly: "ItemTorso",
    torso: "ItemTorso",
    hips: "ItemPelvis",
    pelvis: "ItemPelvis",
    pussy: "ItemVulva",
    vulva: "ItemVulva",
    clit: "ItemVulvaPiercings",
    cock: "ItemPenis",
    butt: "ItemButt",
    ass: "ItemButt",
    legs: "ItemLegs",
    thighs: "ItemLegs",
    feet: "ItemBoots"
  };
  var FORGET = { deny: "Denial", denial: "Denial", needy: "Insatiable", insatiable: "Insatiable", follow: "Follow", say: "Speak Phrase" };
  var clean = (s) => String(s == null ? "" : s).trim();
  var lc = (s) => clean(s).toLowerCase();
  var list = (s) => clean(s).split(/\s*,\s*/).map(clean).filter(Boolean);
  var slug = (s) => lc(s).replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "block";
  function seconds(s) {
    s = lc(s);
    if (!s) return null;
    if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
    const m = /^(?:(\d+(?:\.\d+)?)\s*h(?:ours?|rs?)?)?\s*(?:(\d+(?:\.\d+)?)\s*m(?:in)?s?)?\s*(?:(\d+(?:\.\d+)?)\s*s(?:ec)?s?)?$/.exec(s);
    if (!m || !m[1] && !m[2] && !m[3]) return null;
    return Math.round((Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)) * 10) / 10;
  }
  function parsePace(s) {
    s = lc(s);
    const m = /^(\d+(?:\.\d+)?)\s*(?:s|sec|secs)?\s*(?:-|to|–)\s*(\d+(?:\.\d+)?\s*(?:s|sec|secs|m|min)?)$/.exec(s);
    if (m) {
      const a = seconds(m[1]), b = seconds(/[a-z]/.test(m[2]) ? m[2] : m[2] + "s");
      return a != null && b != null && a > 0 && b >= a ? { min: a, max: b } : null;
    }
    const one = seconds(s);
    return one != null && one > 0 ? { min: one, max: one } : null;
  }
  function rate(s) {
    s = lc(s).replace(/hz$/, "").trim();
    if (!s) return null;
    if (/^\d+(\.\d+)?$/.test(s)) {
      const n = Number(s);
      return n >= HZ_MIN && n <= HZ_MAX ? { hz: n } : null;
    }
    const m = /^(?:deep\s+)?(delta|theta|alpha|beta)(?:\s+(\d+(?:\.\d+)?))?$/.exec(s);
    if (!m) return null;
    if (m[2]) {
      const n = Number(m[2]);
      return n >= HZ_MIN && n <= HZ_MAX ? { hz: n, band: m[1] } : null;
    }
    return { band: m[1] };
  }
  function parseBeats(s) {
    s = lc(s);
    if (!s) return null;
    if (/^(off|none|stop|silent)$/.test(s)) return { off: true };
    let over = null;
    const o = /\s+over\s+(.+)$/.exec(s);
    if (o) {
      over = seconds(o[1]);
      if (over == null) return null;
      s = s.slice(0, o.index);
    }
    const parts = s.split(/\s*(?:→|->|=>|\bto\b)\s*/);
    if (parts.length > 2) return null;
    const from = parts[0] ? rate(parts[0]) : null, to = parts.length === 2 ? rate(parts[1]) : null;
    if (parts[0] && !from) return null;
    if (parts.length === 2 && !to) return null;
    if (!from && !to) return null;
    return { from: from || null, to: to || null, over: over != null ? Math.min(3600, Math.max(0, over)) : null };
  }
  function hzOf(r, rng) {
    if (!r) return null;
    if (r.hz != null) return r.hz;
    const b = BANDS[r.band];
    if (!b) return null;
    return Math.round((b[0] + (rng || Math.random)() * (b[1] - b[0])) * 10) / 10;
  }
  function parseLook(s) {
    const out = {}, bad = [];
    for (const part of list(lc(s))) {
      let m;
      if (part === "clear" || part === "off" || part === "none") {
        Object.assign(out, { haze: 0, spiral: "off", rings: false, words: false, names: false });
        continue;
      }
      if (m = /^haze\s+(\d{1,3})\s*%?$/.exec(part)) {
        out.haze = Math.min(100, Number(m[1]));
        continue;
      }
      if (/^haze\s+(off|none)$/.test(part)) {
        out.haze = 0;
        continue;
      }
      if (m = /^spiral(?:\s+(off|slow|on|fast))?$/.exec(part)) {
        out.spiral = m[1] === "fast" ? "on" : m[1] || "slow";
        continue;
      }
      if (m = /^rings(?:\s+(on|off))?$/.exec(part)) {
        out.rings = m[1] !== "off";
        continue;
      }
      if (m = /^words(?:\s+(drift|on|off))?$/.exec(part)) {
        out.words = m[1] !== "off";
        continue;
      }
      if (m = /^names(?:\s+(blur|blurred|on|clear|off))?$/.exec(part)) {
        out.names = !(m[1] === "clear" || m[1] === "off");
        continue;
      }
      bad.push(part);
    }
    return { look: out, bad };
  }
  function steps(s) {
    const out = [];
    let cur = "", q = null;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (q) {
        cur += c;
        if (c === q) q = null;
        continue;
      }
      if (c === '"' || c === "\u201C") {
        q = c === "\u201C" ? "\u201D" : '"';
        cur += c;
        continue;
      }
      if (c === "\u2192" || c === ";") {
        out.push(cur);
        cur = "";
        continue;
      }
      if ((c === "-" || c === "=") && s[i + 1] === ">") {
        out.push(cur);
        cur = "";
        i++;
        continue;
      }
      cur += c;
    }
    out.push(cur);
    return out.map(clean).filter(Boolean);
  }
  var unquote = (s) => clean(s).replace(/^["“](.*)["”]$/, "$1").trim();
  function parseStep(s, ctx) {
    ctx = ctx || {};
    const t = clean(s), l = t.toLowerCase();
    let m;
    if (/^(cum|orgasm|come)$/.test(l)) return { type: LSCG.cum, arguments: {} };
    if (/^(deny|denial|denied|edge)$/.test(l)) return { type: LSCG.deny, arguments: {} };
    if (/^(needy|insatiable|horny)$/.test(l)) return { type: LSCG.needy, arguments: {} };
    if (m = /^strip(?:\s+(.+))?$/i.exec(t)) {
      const what = list((m[1] || "all").replace(/\s+and\s+/gi, ","));
      if (what.some((w) => /^(all|everything)$/i.test(w))) return { type: LSCG.strip, arguments: { selection: { all: true, random: false, groups: [] } } };
      if (what.some((w) => /^(random|one|something)$/i.test(w))) return { type: LSCG.strip, arguments: { selection: { all: false, random: true, groups: [] } } };
      const groups = [];
      for (const w of what) {
        if (STRIP[w.toLowerCase()]) groups.push(...STRIP[w.toLowerCase()]);
        else if (/^[A-Z][A-Za-z]+$/.test(w)) groups.push(w);
        else return { error: 'strip what? "' + w + '" (top, bottoms, underwear, feet, all, random, or a slot like ClothLower)' };
      }
      return { type: LSCG.strip, arguments: { selection: { all: false, random: false, groups: Array.from(new Set(groups)) } } };
    }
    if (m = /^pose\s+(.+)$/i.exec(t)) {
      let p = clean(m[1]).toLowerCase();
      if (p === "{low}" || p === "low") p = ctx.low === "fours" ? "all fours" : "kneel";
      const raw = /^(upper|lower|full)\s+([A-Za-z]+)$/i.exec(clean(m[1]));
      const sel = raw ? { [raw[1].toLowerCase()]: raw[2] } : POSES[p];
      if (!sel) return { error: 'pose what? "' + m[1] + `" ({low}, kneel, kneel spread, all fours, stand, hands behind, hands up, or upper/lower/full <the game's pose>)` };
      return { type: LSCG.pose, arguments: { selection: Object.assign({ upper: "", lower: "", full: "" }, sel) } };
    }
    if (m = /^say(?:\s*:)?(?:\s+(.+))?$/i.exec(t)) {
      const words2 = m[1] ? unquote(m[1]) : "";
      if (/[()]/.test(words2) || /^[*!/.]/.test(words2)) return { error: "what they say can't start with * ! / . or have round brackets" };
      return { type: LSCG.say, arguments: words2 ? { config: words2.slice(0, 200) } : {} };
    }
    if (/^follow(\s+(me|speaker|them))?$/i.test(t)) return { type: LSCG.follow, arguments: { speakerOnly: true } };
    if (m = /^(?:touch|do|activity)\s+([A-Za-z]+)\s+(?:on\s+)?(?:(?:their|your|the|my)\s+)?([A-Za-z]+)(?:\s+(self|own|speaker|me|them|named))?$/i.exec(t)) {
      const act = m[1][0].toUpperCase() + m[1].slice(1), zw = m[2].toLowerCase(), zone = ZONES[zw] || (/^Item[A-Z][A-Za-z]+$/.test(m[2]) ? m[2] : null);
      if (!zone) return { error: 'touch where? "' + m[2] + `" (head, mouth, neck, tits, nipples, belly, pussy, cock, butt, hands, feet, or the game's Item\u2026 name)` };
      const who = (m[3] || "").toLowerCase(), a = { selection: { name: act, group: zone } };
      if (who === "self" || who === "own") a.self = true;
      else if (who === "speaker" || who === "me") a.speakerOnly = true;
      return { type: LSCG.touch, arguments: a };
    }
    if (m = /^forget(?:\s+(.+))?$/i.exec(t)) {
      const what = list((m[1] || "all").replace(/\s+and\s+/gi, ","));
      if (what.some((w) => /^(all|everything)$/i.test(w))) return { type: LSCG.forget, arguments: { selection: { all: true, instructions: [] } } };
      const ins = [];
      for (const w of what) {
        const f = FORGET[w.toLowerCase()];
        if (!f) return { error: 'forget what? "' + w + '" (all, deny, needy, follow, say)' };
        ins.push(f);
      }
      return { type: LSCG.forget, arguments: { selection: { all: false, instructions: Array.from(new Set(ins)) } } };
    }
    if (m = /^(?:moo|sound|noise|make (?:their|your|a) (?:sound|noise))(?:\s+(\d+))?$/i.exec(t)) {
      const n = Number(m[1] || 1);
      if (!(n >= 1 && n <= 3)) return { error: "moo once, twice or three times (moo, moo 2, moo 3)" };
      return { type: FARM.sound, arguments: { options: { times: n } } };
    }
    if (/^(?:stall|to (?:a |the )?stalls?|go to (?:a |the )?(?:free )?(?:milk(?:in'?g?)? )?stall)$/i.test(t)) return { type: FARM.stall, arguments: { options: {} } };
    if (m = /^beg(?:\s+to be milked|\s+for it)?(?:\s*:)?(?:\s+(.+))?$/i.exec(t)) {
      const words2 = m[1] ? unquote(m[1]) : "";
      if (/[()]/.test(words2) || /^[*!/.]/.test(words2)) return { error: "what they beg can't start with * ! / . or have round brackets" };
      return { type: FARM.beg, arguments: { options: words2 ? { words: words2.slice(0, 120) } : {} } };
    }
    if (m = /^dose\s+(.+?)(?:\s+(half|whole|double))?$/i.exec(t)) return { type: FARM.dose, arguments: { options: { dose: lc(m[1]).slice(0, 40), strength: lc(m[2] || "whole") } } };
    return { error: `I don't know "` + t + `" (cum, deny, needy, strip \u2026, pose \u2026, say "\u2026", follow, touch <Activity> <zone>, forget \u2026, or the farm's: moo, stall, beg "\u2026", dose <name>)` };
  }
  function parseDoes(does, waits, ctx) {
    const parts = steps(clean(does));
    if (!parts.length) return { error: "does what? (at least one: cum, deny, needy, strip, pose, say, follow, touch, forget, moo, stall, beg, dose)" };
    if (parts.length > MAX_DOES) return { error: "at most " + MAX_DOES + " things (LSCG's limit), not " + parts.length };
    const w = list(waits || "").map(seconds), out = [];
    for (let i = 0; i < parts.length; i++) {
      const r = parseStep(parts[i], ctx);
      if (r.error) return { error: r.error };
      if (i > 0 && w[i - 1] != null) {
        if (w[i - 1] < 1 || w[i - 1] > 30) return { error: "a wait is 1 to 30 seconds" };
        r.delay = Math.round(w[i - 1] * 1e3);
      }
      out.push(r);
    }
    return { ok: true, instructions: out };
  }
  var CUE = /\[([^\]]*)\]/g;
  function readCue(c) {
    const s = lc(c);
    let m;
    if (m = /^(?:wait|pause)\s+(.+)$/.exec(s)) {
      const v = seconds(m[1]);
      return v != null && v >= 0 && v <= 600 ? { wait: v } : { bad: c };
    }
    if (m = /^deeper\s*\+?\s*(-?\d+)$/.exec(s)) return { deeper: Math.max(-100, Math.min(100, Number(m[1]))) };
    if (m = /^beats\s+(.+)$/.exec(s)) {
      const b = parseBeats(m[1]);
      return b ? { beats: b } : { bad: c };
    }
    if (m = /^look\s+(.+)$/.exec(s)) {
      const L = parseLook(m[1]);
      return L.bad.length ? { bad: c } : { look: L.look };
    }
    return { bad: c };
  }
  function parseLibrary(text) {
    const blocks = [], errors = [], warnings = [];
    const rows = String(text == null ? "" : text).replace(/\r\n?/g, "\n").split("\n");
    let b = null, inLabels = false;
    const err = (n, msg) => {
      errors.push({ line: n, block: b ? b.kind + ": " + b.name : "", msg });
      if (b) b.bad = true;
    };
    const warn = (n, msg) => warnings.push({ line: n, block: b ? b.kind + ": " + b.name : "", msg });
    const close = () => {
      if (b) {
        finish(b, err, warn);
        blocks.push(b);
      }
      b = null;
    };
    rows.forEach((raw, i) => {
      const n = i + 1, line = raw.replace(/\s+$/, "");
      const head = /^===\s*([A-Za-z]+)\s*:\s*(.*?)\s*=*\s*$/.exec(line);
      if (head) {
        close();
        const kind = head[1].toLowerCase(), name = clean(head[2]);
        b = { kind, name, labels: {}, raw: {}, lines: [], at: n };
        inLabels = true;
        if (!KINDS.includes(kind)) err(n, 'no such kind "' + head[1] + '" (' + KINDS.join(", ") + ")");
        if (!name) err(n, "a block needs a name: === " + kind + ": Its Name");
        return;
      }
      if (/^\s*(#|\/\/)/.test(line)) return;
      if (!b) {
        if (clean(line)) warn(n, "this is outside any block, so it's skipped (start one with === kind: Name)");
        return;
      }
      if (!clean(line)) {
        if (b.lines.length || Object.keys(b.raw).length) inLabels = false;
        return;
      }
      const lab = /^\s*([A-Za-z]+)\s*:\s*(.*)$/.exec(line);
      const key = lab && lab[1].toLowerCase();
      if (inLabels && lab && (LABELS.includes(key) || b.kind === "session" && SESSION_KINDS.includes(key))) {
        if (b.kind === "session" && SESSION_KINDS.includes(key)) (b.raw.picks = b.raw.picks || []).push([key, lab[2], n]);
        else b.raw[key] = [lab[2], n];
        return;
      }
      inLabels = false;
      if (b.kind === "session") {
        warn(n, "a session only lists blocks (like deepener: any); this line is skipped");
        return;
      }
      let text2 = line.trim();
      const cues = [];
      text2 = text2.replace(CUE, (all, c) => {
        const r = readCue(c);
        if (r.bad != null) warn(n, "I don't know the cue [" + c + "] (wait, deeper, beats, look)");
        else cues.push(r);
        return " ";
      });
      if (/[()]/.test(text2)) {
        warn(n, "round brackets taken out: hypno add-ons skip anything after one");
        text2 = text2.replace(/[()]/g, "");
      }
      text2 = text2.replace(/\s{2,}/g, " ").trim();
      if (text2 || cues.length) b.lines.push({ text: text2, cues, at: n });
    });
    close();
    const seen = /* @__PURE__ */ new Map();
    for (const x of blocks) {
      const k = x.kind + ":" + lc(x.name);
      if (seen.has(k)) {
        errors.push({ line: x.at, block: x.kind + ": " + x.name, msg: "two " + x.kind + "s are called " + x.name + " (line " + seen.get(k) + ")" });
        x.bad = true;
      } else seen.set(k, x.at);
    }
    for (const x of blocks.filter((y) => y.kind === "session" && !y.bad)) {
      for (const p of x.labels.picks || []) for (const it of p.items) if (it.name && !blocks.some((y) => y.kind === p.kind && lc(y.name) === lc(it.name))) {
        errors.push({ line: p.at, block: "session: " + x.name, msg: "there's no " + p.kind + " called " + it.name });
        x.bad = true;
      }
    }
    return { blocks, errors, warnings };
  }
  function finish(b, err, warn) {
    const r = b.raw, L = b.labels;
    const get = (k) => r[k] ? r[k] : null;
    if (get("level")) {
      const v = list(lc(r.level[0])).map((x) => x === "no human left" ? "nhl" : x);
      const bad = v.filter((x) => !LEVELS.includes(x) && x !== "any" && x !== "all");
      if (bad.length) err(r.level[1], "level is fun, deep or nhl, not " + bad.join(", "));
      L.level = v.includes("any") || v.includes("all") ? LEVELS.slice() : v.filter((x) => LEVELS.includes(x));
    }
    if (get("for")) {
      const v = list(lc(r.for[0]));
      L.for = v.includes("any") || v.includes("all") ? null : v;
    }
    if (get("wears")) L.wears = list(lc(r.wears[0]));
    if (get("tone")) {
      const v = lc(r.tone[0]);
      if (v === "any" || v === "") L.tone = "";
      else if (!TONES.includes(v)) err(r.tone[1], "tone is praise or degrade (or any), not " + r.tone[0]);
      else L.tone = v;
    }
    if (get("pace")) {
      const p = parsePace(r.pace[0]);
      if (!p) err(r.pace[1], 'pace is like 30s or 20-40s, not "' + r.pace[0] + '"');
      else L.pace = p;
    }
    if (get("pick")) {
      const p = Number(clean(r.pick[0]));
      if (!(p >= 1 && p <= 99 && Math.floor(p) === p)) err(r.pick[1], "pick is a number of lines, like 3");
      else L.pick = p;
    }
    if (get("beats")) {
      const v = parseBeats(r.beats[0]);
      if (!v) err(r.beats[1], 'beats like "theta", "6", "alpha 10 \u2192 theta 6 over 3m" or "off" (1 to 30 Hz), not "' + r.beats[0] + '"');
      else L.beats = v;
    }
    if (get("volume")) {
      const m = /^(\d{1,3})\s*%?$/.exec(clean(r.volume[0]));
      if (!m || Number(m[1]) > 100) err(r.volume[1], "volume is 0% to 100% of their own");
      else L.volume = Number(m[1]);
    }
    if (get("look")) {
      const v = parseLook(r.look[0]);
      if (v.bad.length) err(r.look[1], "I don't know the look " + v.bad.join(", ") + " (haze N%, spiral slow|on|off, rings on|off, words drift|off, names blur|clear, clear)");
      else L.look = v.look;
    }
    if (get("deeper")) {
      const m = /^\+?\s*(-?\d+)$/.exec(clean(r.deeper[0]));
      if (!m) err(r.deeper[1], "deeper is a number, like +10");
      else L.deeper = Math.max(-100, Math.min(100, Number(m[1])));
    }
    if (get("pull")) {
      const m = /^(\d{1,3})\s*%?\s*\+?$/.exec(clean(r.pull[0]));
      if (!ASIDE.includes(b.kind)) warn(r.pull[1], "pull only means somethin' on a slip or a nudge, so it's skipped here");
      else if (!m || Number(m[1]) > 100) err(r.pull[1], "pull is how far the farm's pull has to be built up first, 0 to 100, like: pull: 60");
      else L.pull = Number(m[1]);
    }
    if (b.kind === "trigger") {
      if (!get("trigger") || clean(r.trigger[0]).length < 4) err(get("trigger") ? r.trigger[1] : b.at, "a trigger needs its phrase, 4 letters or more: trigger: milkin' time");
      else {
        L.trigger = clean(r.trigger[0]).replace(/[()]/g, "").slice(0, 80);
        if (/^[*!/.]/.test(L.trigger)) err(r.trigger[1], "a trigger can't start with * ! / .");
      }
    } else if (get("trigger")) warn(r.trigger[1], "trigger only means somethin' on a trigger block, so it's skipped here");
    if (b.kind === "trigger" || b.kind === "compulsion") {
      if (!get("does")) err(b.at, "a " + b.kind + ' needs what it does: does: pose {low} \u2192 say "Moo"');
      else {
        const d = parseDoes(r.does[0], get("waits") ? r.waits[0] : "", { low: "kneel" });
        if (d.error) err(r.does[1], d.error);
        else {
          L.does = clean(r.does[0]);
          L.waits = get("waits") ? clean(r.waits[0]) : "";
        }
      }
    } else for (const k of ["does", "waits"]) if (get(k)) warn(r[k][1], k + " only means somethin' on a trigger or a compulsion, so it's skipped here");
    if (b.kind === "compulsion") {
      const w = get("when") ? lc(r.when[0]).replace(/[-_]+/g, " ").replace(/\s+/g, " ") : "";
      if (!w) err(b.at, "a compulsion needs what sets it off: when: " + Object.keys(WHEN).join(" | "));
      else if (!WHEN[w]) err(r.when[1], "when is one of " + Object.keys(WHEN).join(", ") + ', not "' + r.when[0] + '"');
      else L.when = w;
      if (get("chance")) {
        const m = /^(\d{1,2}(?:\.\d+)?)\s*%?$/.exec(clean(r.chance[0]));
        if (!m || Number(m[1]) < 1 || Number(m[1]) > 50) err(r.chance[1], "chance is 1% to 50% (a small one: 10% if you leave it out)");
        else L.chance = Number(m[1]);
      }
    } else for (const k of ["when", "chance"]) if (get(k)) warn(r[k][1], k + " only means somethin' on a compulsion, so it's skipped here");
    if (b.kind === "hangon") {
      const e = get("effect") ? lc(r.effect[0]).replace(/[\s'-]+/g, "") : "";
      if (!e) err(b.at, "a hang-on needs its effect: effect: " + Object.keys(EFFECTS).join(" | "));
      else if (!EFFECTS[e]) err(r.effect[1], "effect is one of " + Object.keys(EFFECTS).join(", ") + ', not "' + r.effect[0] + '"');
      else L.effect = e;
      if (get("lasts")) {
        const s = seconds(r.lasts[0]);
        if (s == null || s < 60 || s > 4 * 3600) err(r.lasts[1], "lasts is 1m to 4h, like: lasts: 30m");
        else L.lasts = s;
      }
    } else for (const k of ["effect", "lasts"]) if (get(k)) warn(r[k][1], k + " only means somethin' on a hang-on, so it's skipped here");
    if (get("visor")) {
      if (b.kind !== "session") warn(r.visor[1], "visor only means somethin' on a session, so it's skipped here");
      else L.visor = /^(yes|on|true|y)$/i.test(clean(r.visor[0]));
    }
    if (b.kind === "session") {
      L.picks = (r.picks || []).map(([kind, v, n]) => ({ kind, at: n, items: list(v).map((it) => {
        const m = /^any(?:\s+(\d+))?$/i.exec(it);
        if (m) return { any: Number(m[1] || 1) };
        if (/^all$/i.test(it)) return { all: true };
        return { name: it };
      }) }));
      if (!L.picks.length) err(b.at, "a session lists its blocks in order, like: induction: any");
    } else if (!b.lines.length && b.kind !== "trigger") warn(b.at, "this " + b.kind + " has no lines");
    if (L.pick && L.pick > b.lines.length && b.lines.length) warn(r.pick[1], "pick " + L.pick + " but there are only " + b.lines.length + " lines");
    delete b.raw;
  }
  function fits2(b, who) {
    const L = b.labels || {};
    who = who || {};
    if (b.bad) return false;
    if (L.tone && ![].concat(who.tone || []).includes(L.tone)) return false;
    if (who.level && L.level && L.level.length && !L.level.includes(who.level)) return false;
    if (L.for && L.for.length && !L.for.includes(lc(who.species))) return false;
    if (L.wears && L.wears.length && !L.wears.some((w) => (who.wears || []).includes(w))) return false;
    return true;
  }
  var shuffle = (a, rng) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor((rng || Math.random)() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function planSession(blocks, who, opts) {
    opts = opts || {};
    const rng = opts.rng || Math.random;
    const good = blocks.filter((b) => !b.bad);
    const sessions = good.filter((b) => b.kind === "session" && fits2(b, who));
    let recipe = opts.name ? sessions.find((b) => lc(b.name) === lc(opts.name)) : null;
    if (!recipe && sessions.length) recipe = sessions[Math.floor(rng() * sessions.length)];
    const picks = recipe ? recipe.labels.picks : [
      { kind: "induction", items: [{ any: 1 }] },
      { kind: "deepener", items: [{ any: 1 }] },
      { kind: "suggestion", items: [{ any: 2 }] },
      { kind: "trigger", items: [{ any: 1 }] },
      { kind: "wake", items: [{ any: 1 }] }
    ];
    const used = /* @__PURE__ */ new Set(), out = [];
    for (const p of picks) {
      const pool = good.filter((b) => b.kind === p.kind && fits2(b, who));
      for (const it of p.items) {
        if (it.name) {
          const b = good.find((x) => x.kind === p.kind && lc(x.name) === lc(it.name));
          if (b && !used.has(b)) {
            out.push(b);
            used.add(b);
          }
          continue;
        }
        const free = shuffle(pool.filter((b) => !used.has(b)), rng);
        const take = it.all ? free : free.slice(0, it.any || 1);
        for (const b of take) {
          out.push(b);
          used.add(b);
        }
      }
    }
    return { name: recipe ? recipe.name : "", recipe: recipe || null, blocks: out };
  }
  function sessionSteps(plan, opts) {
    opts = opts || {};
    const rng = opts.rng || Math.random, keep = opts.keep || (() => true);
    const out = [];
    for (const b of plan.blocks) {
      const L = b.labels || {};
      let lines = b.lines.filter((l) => !l.text || keep(l.text));
      if (L.pick && lines.length > L.pick) {
        const idx = shuffle(lines.map((x, i) => i), rng).slice(0, L.pick).sort((a, c) => a - c);
        lines = idx.map((i) => lines[i]);
      }
      const pace = L.pace || { min: 30, max: 30 };
      const gap = () => Math.round((pace.min + rng() * (pace.max - pace.min)) * 10) / 10;
      const first = { kind: b.kind, block: b.name, start: true };
      if (L.beats) first.beats = beatsNow(L.beats, rng);
      if (L.volume != null) first.volume = L.volume;
      if (L.look) first.look = L.look;
      if (!lines.length) {
        out.push(Object.assign(first, { text: "", gap: 0 }));
      }
      lines.forEach((l, i) => {
        const s = i === 0 ? first : { kind: b.kind, block: b.name };
        s.text = l.text;
        s.gap = gap();
        for (const c of l.cues || []) {
          if (c.wait != null) s.gap = c.wait;
          if (c.deeper != null) s.deeper = (s.deeper || 0) + c.deeper;
          if (c.beats) s.beats = beatsNow(c.beats, rng);
          if (c.look) s.look = Object.assign({}, s.look || {}, c.look);
        }
        out.push(s);
      });
      const last = out[out.length - 1];
      if (L.deeper) last.deeper = (last.deeper || 0) + L.deeper;
      if (PLANTED.includes(b.kind)) last.plant = b;
    }
    return out;
  }
  function beatsNow(v, rng) {
    if (!v) return null;
    if (v.off) return { off: true };
    return { from: hzOf(v.from, rng), to: hzOf(v.to, rng), over: v.over };
  }
  function fillIn(text, words2) {
    return String(text == null ? "" : text).replace(/\{([a-z]+)\}/gi, (all, k) => words2 && words2[k.toLowerCase()] != null ? String(words2[k.toLowerCase()]) : all);
  }
  var SUGG_PREFIX = "bnbfarm-";
  function lscgSuggestion(b, opts) {
    opts = opts || {};
    const words2 = opts.words || {};
    const L = b.labels, d = parseDoes(fillIn(L.does, Object.assign({}, words2, { low: "{low}" })), L.waits, { low: opts.low });
    if (d.error) return { error: d.error };
    return {
      id: SUGG_PREFIX + slug(b.name),
      name: "B&B " + b.name,
      trigger: fillIn(L.trigger, words2).replace(/[()]/g, "").slice(0, 80),
      installedBy: opts.by || -1,
      installedByName: opts.byName || "The farm",
      installedAt: opts.now || Date.now(),
      exclusive: false,
      instructions: d.instructions.map((x) => {
        const o = { type: x.type, arguments: x.arguments };
        if (x.delay != null) o.delay = x.delay;
        return o;
      })
    };
  }
  function farmCompulsion(b, opts) {
    opts = opts || {};
    const words2 = opts.words || {}, L = b.labels;
    const d = parseDoes(fillIn(L.does, Object.assign({}, words2, { low: "{low}" })), L.waits, { low: opts.low });
    if (d.error) return { error: d.error };
    return {
      id: SUGG_PREFIX + "c-" + slug(b.name),
      name: "B&B " + b.name,
      trigger: "",
      when: L.when,
      chance: Math.max(0.01, Math.min(0.5, (L.chance || 10) / 100)),
      instructions: d.instructions.map((x) => {
        const o = { type: x.type, arguments: x.arguments };
        if (x.delay != null) o.delay = x.delay;
        return o;
      })
    };
  }

  // shared/trance-more.js
  var MORE = `# \u2500\u2500 more of the farm's trance (Nov 25, Laynie: "bulk up the sessions content and hypno scripts", "any species and
# gender", and ?degrade / ?praise followed: "yes ~"). tone: praise blocks only reach somebody with ?praise on, tone:
# degrade only somebody with ?degrade on; everything else reaches anybody. A line starting {t} is for tits, {c} a cock,
# {v} a pussy, {nt} {nc} {nv} without; {f} {m} {fu} {fb} {nb} for a girl, a guy, a futa, a femboy, nonbinary.

# \u2500\u2500 inductions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== induction: The Glow
pace: 35-45s
pick: 4
beats: alpha 10 \u2192 theta 6 over 3m
look: haze 25%, spiral slow

Look at the light, {name}. Just the light, soft and warm, right in front of your eyes.
Don't look away. You don't need to. It's so easy to keep lookin'.
Every time it pulses, your eyelids get a little heavier.
Everything around the light goes dim and far away. Only the glow is close.
The longer you watch it, the less there is behind your eyes.
Let it fill your eyes up. Let it fill your head up. There's room for it.
Your eyes want to close now, {name}. Let them, and the glow stays right there behind them.

=== induction: Countin' Down in the Straw
pace: 30-40s
beats: alpha 10 \u2192 theta 6 over 3m
look: haze 20%, spiral slow

I'm going to count down from ten, {name}, and every number takes you further down into the straw.
Ten. Your shoulders drop.
Nine. Your hands go loose and heavy.
Eight. Your breathing slows all on its own.
Seven. Six. The barn goes quiet around you.
Five. Halfway down, and it feels so good to sink.
Four. Three. Thoughts driftin' away like chaff on the wind.
Two. Nearly there.
One. All the way down, {name}. Good {animal}.

=== induction: Head to Tail
pace: 35-45s
pick: 6
beats: alpha 9 \u2192 theta 6 over 3m
look: haze 20%

Feel the top of your head go soft and warm, {name}, like sun on straw.
It runs down over your forehead, and your brow smooths right out.
Down over your eyes. They're so heavy now. Too heavy to hold open.
Your jaw loosens. Your mouth falls a little open, and that's alright.
Down your neck, over your shoulders. All the work just slides off them.
Down your arms, all the way to your {paws}. Heavy {paws}. Loose {paws}.
Down your chest, and every breath goes deeper and slower.
Down your belly, warm and soft and easy.
Down your legs, all the way down. Nothin' left holdin' on anywhere.
From your head to your {paws}, there's nothin' left in you but loose and warm and listenin'.

=== induction: The Milker's Rhythm
pace: 30-40s
pick: 5
beats: alpha 10 \u2192 theta 5 over 4m
look: haze 25%, rings on

Listen, {name}. Somewhere in the barn the milker's runnin'. Hiss. And release. Hiss. And release.
Breathe with it. In as it hisses. Out as it lets go.
In. And out. Slower than you'd breathe on your own. That's alright. The machine knows the pace.
Every time it lets go, you let go a little more too.
Your body's learnin' the rhythm. It doesn't need you to count anymore.
In. And out. Pulled, and released. Pulled, and released.
That's all you are right now: the rhythm, and my voice over it.

# \u2500\u2500 deepeners \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== deepener: The Cellar Stairs
level: deep, nhl
pace: 35-45s
beats: theta \u2192 delta 3 over 4m
look: haze 45%, rings on, words drift
deeper: +20

There's a door in the barn floor, {name}, and stairs goin' down into the cool dark.
Take the first step. Feel how much heavier you are on it.
Every step down, you're twice as deep as the step before.
The light from the barn gets smaller above you. You don't need it.
Down. And down. The stone's cool and the air smells of hay and milk.
Halfway down, you can't remember what you were thinkin' about up there.
Down past where thinkin' happens. Down where it's just quiet and warm.
At the bottom there's a soft pile of straw, and you sink right into it.

=== deepener: The Warm Trough
level: fun, deep
pace: 35-45s
pick: 4
beats: theta 6 \u2192 theta 5 over 3m
look: haze 35%, words drift
deeper: +15

Picture a big trough of warm water, {name}, steam liftin' off it in the cool barn.
Step in. Feel the warm come up over your {paws}, your legs, your hips.
Sink down into it till only your head's above the water.
All the tightness melts out of you into the water and floats away.
The warmer you get, the heavier you get, and the deeper you go.
Nothin' to hold up. The water holds you. The farm holds you.

=== deepener: Pasture Sunset
pace: 35-45s
pick: 4
beats: theta 6 \u2192 theta 5 over 4m
look: haze 30%, spiral slow, words drift
deeper: +15

You're out in the far pasture, {name}, and the sun's goin' down slow and gold.
Every inch it sinks, you sink with it.
The grass is warm and soft under you, and the herd's quiet all around.
The sky goes orange, then pink, then deep blue, and you go deeper with every colour.
When the sun's gone, there's only the warm dark and my voice.

=== deepener: Up and Down Again
level: deep, nhl
pace: 25-35s
beats: theta 6 \u2192 delta 3 over 5m
look: haze 40%, rings on, words drift
deeper: +25

In a moment I'll bring you up, just a little, and then you'll drop twice as deep.
Up now. Eyes flutter. Almost awake. Almost.
And drop. All the way down, deeper than before.
Up again, just to the edge. Feel how heavy it is up there.
And drop. Deeper. So much easier to fall than to climb.
Every time you come up, you fall further. Up once more, {name}.
And down. Down past where you were. Down where you belong.

=== deepener: Deeper Every Time
level: nhl
pace: 40-50s
beats: theta \u2192 delta 2 over 5m
look: haze 60%, spiral on, rings on, words drift, names blur
deeper: +30

You've been here before, {name}. Your body remembers the way down.
It doesn't wait for my words anymore. It starts sinkin' the moment it hears me.
Every time we do this, you go a little deeper and come back a little less.
There's a floor somewhere down here. You haven't found it yet. You won't today.
Let the {animal} have the dark. It knows what to do with it.

# \u2500\u2500 convincers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== convincer: Eyes Shut Tight
pace: 30s
pick: 3

Your eyelids are stuck shut now, {name}. Heavy and stuck, like warm wax.
Try to open them. Go on. The harder you try, the tighter they stick.
Stop tryin'. Good. Feel how good it is not to try.
Every time you try and can't, you go deeper.

=== convincer: Where's Your Name
level: deep, nhl
pace: 30-40s

I want you to think of your name. Your own name. Reach for it.
It's slippin', isn't it? It was right there a moment ago.
That's alright. You don't need it down here. Good {animal}s don't need names.
When you wake, it'll come back. Maybe. Bit by bit.

=== convincer: Stuck Fast
pace: 30s

Rest your {paws} on your thighs, {name}. Let them settle.
They're gettin' heavy now. Heavier. Stuck right where they are.
Try to lift them. Try. They won't come. They're happy where they are.
Good. Stuck {paws} on a still {animal}. Nothin' to do but listen.

# \u2500\u2500 suggestions: for anybody \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Sweet and Good
tone: praise
pace: 35-45s
pick: 3

You're doin' so well, {name}. The farm's proud of you.
Every time you let go like this, you're the best {animal} in the barn.
You're safe here. Cared for. Wanted. That's what bein' the farm's means.
Every good thing you feel right now, you'll find again the next time you hear me.
Such a good {pet}. Sweet and soft and good.

=== suggestion: Dumb and Happy
tone: degrade
level: deep, nhl
pace: 35-45s
pick: 3

Look at you. Thinkin's too hard for a {animal} like you, isn't it?
That's alright. You weren't built for thinkin'. You were built for this.
Dumb and happy. Empty and warm. That's all a {pet} needs to be.
Every thought you lose today makes you a better {animal}.
You don't even mind how dumb you're gettin'. You like it.

=== suggestion: The Ache
level: deep, nhl
pace: 35-45s
pick: 4

There's a warm ache startin' low in you, {name}, and it grows with every word.
{v}Your pussy's gettin' wet and swollen, achin' to be used.
{c}Your cock's thickenin', heavy and hard, achin' to be milked.
{t}Your tits feel tight and full, nipples stiff and wantin' hands.
The ache doesn't go away. It just sits there, wantin', and you let it.
You don't get to finish. You just ache, and the achin' feels like bein' good.
Every time you feel it later, you'll think of the farm.

=== suggestion: Belongs to the Farm
level: deep, nhl
pace: 35-45s
pick: 3

Say it to yourself in your head, {name}: I belong to the farm.
Again. I belong to the farm. Feel how true it sounds.
Your {body}, your {paws}, every warm wet bit of you. The farm's.
You don't have to decide anything. The farm decides. You just {act}.
When you come up, it'll still be true. It'll always be true.

=== suggestion: Under Glass
pace: 35-45s
pick: 3

Every time somethin' covers your eyes, {name}, you'll remember this feelin'.
A blindfold, a hood, a visor: the dark comes, and you drop.
The less you can see, the more you can feel.
And the deeper you go, the more the farm's voice is all there is.

=== suggestion: Held on the Edge
level: deep, nhl
pace: 35-45s
pick: 4

You're right at the edge now, {name}. So close you can taste it.
And you stay there. Right there. The farm holds you there.
{v}Wet and throbbin' and achin', and not one stroke more.
{c}Hard and leakin' and achin', and not one stroke more.
You love it here. Right on the edge. Where good {animal}s are kept.
When you're allowed, you'll know. Till then, you ache.

# \u2500\u2500 cows and bulls \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Dairy Thoughts
for: cow, bull
pace: 35-45s
pick: 4

Cows don't worry about anything, {name}. They graze, they rest, they get milked.
{t}Your udders are heavy and full, and the fuller they get, the dumber and happier you get.
{t}When hands milk you, all the thoughts squirt right out with the milk.
{c}Your balls are heavy and full, and the farm loves to milk a good bull dry.
{c}Every load you give the farm makes you a better bull.
A {sound} feels better in your mouth than any word.
Chew slow. Breathe slow. Think slow. Good {animal}.

=== suggestion: Dumb Milk Cow
for: cow, bull
tone: degrade
level: deep, nhl
pace: 35-45s
pick: 3

{t}{f}You're just a big dumb milk cow, {name}. Udders and a moo, and that's all.
{t}{nb}You're just big dumb udders and a moo, {name}, and that's all.
{c}You're just a big dumb breedin' bull. A pair of heavy balls and a snort.
{t}{fu}Udders and a cock to milk, both. The farm gets twice as much out of a dumb thing like you.
Nobody asks a {animal} what it thinks. Nobody needs to.
The only clever thing you'll ever do is stand still for the milker.

=== suggestion: Good Cow
for: cow, bull
tone: praise
pace: 35-45s
pick: 3

You're such a good {animal}, {name}. The farm's best.
{t}Your milk's the sweetest in the barn, and everybody knows it.
{c}Your seed's the finest in the barn, and the farm's proud to have you.
Every time somebody calls you a good {animal}, you'll glow right through.

=== trigger: Milk Letdown
for: cow, goat
level: deep, nhl
trigger: let it down
does: needy \u2192 beg
waits: 2s

{t}And somethin' to keep. When anyone tells you to let it down, your udders tingle and ache and you go lookin' for the milker.
{nt}And somethin' to keep. When anyone tells you to let it down, you go all warm and needy and go lookin' for the milker.

=== slip: Cow Talk
for: cow, bull
pull: 10

Moo.
Mooo~
Mm\u2026 grass\u2026
{t}Milk\u2026 me\u2026
{c}Need\u2026 drained\u2026
This {animal}'s\u2026 happy\u2026

=== nudge: Pasture Whispers
for: cow, bull

The grass is sweet today, {name}.
{t}Feel how full you're gettin'. The milker's waitin'.
{c}Feel how heavy your balls are gettin'. The milker's waitin'.
Good {animal}s don't hurry, {name}. Slow and heavy.
Chew on it slow, {pet}. Nothin' to think about.

# \u2500\u2500 ponies and horses \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Bit and Bridle
for: pony, horse
pace: 35-45s
pick: 4

Feel the bit between your teeth, {name}. It feels right there.
A good {animal} goes where the reins say. Left. Right. Trot on.
Your knees want to lift high. Prance. Show off for the farm.
Every time somebody takes your reins, you'll feel proud and eager.
{f}Such a pretty mare, tail high and head up.
{m}Such a strong stallion, muscles warm and ready.
A {sound} says everything a word could, and better.

=== suggestion: Dumb Show Pony
for: pony, horse
tone: degrade
level: deep, nhl
pace: 35-45s
pick: 3

You're just a dumb show {animal}, {name}. Pretty to look at, nothin' upstairs.
Somebody else holds the reins, because you'd only walk into a fence on your own.
{f}A broodmare's for breedin' and showin', not for thinkin'.
{m}A stud's for breedin', not for thinkin'. Just a big dumb stud.
Prance, {pet}. That's all you're good for, and you love it.

=== trigger: Walk On
for: pony, horse
trigger: walk on
does: pose stand \u2192 moo
waits: 2s

And this one stays. When anyone tells you walk on, you're up on your feet and whinnyin' before you've thought about it.

=== slip: Pony Talk
for: pony, horse
pull: 10

Whinny~
Nnhh\u2026 hay\u2026
*snorts*
Trot\u2026 trot\u2026
This {animal} wants\u2026 oats\u2026

=== nudge: Paddock Whispers
for: pony, horse

Feel the bit, {name}. Feel how right it sits.
Lift those knees, {pet}. Somebody's watchin'.
Good {animal}s wait for the reins.

# \u2500\u2500 pups, dogs, wolves, foxes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Good Pup
for: pup, dog, wolf, fox
pace: 35-45s
pick: 4

Your tail's waggin', {name}. You can't help it. You're so happy to be here.
When somebody calls you, your whole body wants to go to them.
Sit. Stay. Heel. Every command feels like a treat.
Good {animal}s don't need words. A wag and a {sound} say it all.
{f}Such a good girl.
{m}Such a good boy.
{fb}Such a good, pretty pup.
{fu}Such a good, needy pup.
Every pat on your head goes straight down to your tail.

=== suggestion: Dumb Mutt
for: pup, dog, wolf, fox
tone: degrade
level: deep, nhl
pace: 35-45s
pick: 3

You're just a dumb mutt, {name}. A wet nose and a waggin' tail.
Can't even remember what you were doin' a second ago, can you? Good.
{f}A dumb little bitch in heat, nose down, tail up.
{m}A dumb mutt that humps whatever's closest.
Fetch, roll over, beg. That's all the thinkin' you'll ever need.

=== trigger: Who's a Good One
for: pup, dog, wolf, fox
trigger: who's a good
does: moo 2 \u2192 pose {low}
waits: 2s

And somethin' to keep. When anyone asks who's a good one, the {sound}s come tumblin' out and you drop down {low}, waggin'.

=== slip: Pup Talk
for: pup, dog, wolf, fox
pull: 10

Woof!
Arf arf~
*pants happily*
Good\u2026 good {animal}\u2026
Walkies?

=== nudge: Kennel Whispers
for: pup, dog, wolf, fox

Who's a good {animal}, {name}? You are.
Your tail's waggin' again, {pet}.
Heel, {name}. Good {animal}s heel.

# \u2500\u2500 kitties \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Warm Kitty
for: kitty, cat, kitt
pace: 35-45s
pick: 4

You're curled up in a warm patch of sun, {name}, and you're purrin'.
Every stroke down your back makes you arch into the hand.
Kitties don't come when they're called. They come when they want. And you want.
{v}You're in heat, {name}. Hips up, tail to the side, achin' for it.
{c}You're restless and hot, rubbin' against anything that'll hold still.
A {sound} slips out every time somebody touches you.

=== suggestion: Needy Kitty
for: kitty, cat, kitt
tone: degrade
level: deep, nhl
pace: 35-45s
pick: 3

You're just a needy little {animal}, {name}, yowlin' for attention.
Too dumb to do anything but rub against legs and beg.
{v}Hips up and yowlin', a cat in heat with nothin' else in her head.
{c}Needy and leakin', rubbin' yourself on anything warm.
Purr for it, {pet}. That's all you've got.

=== trigger: Here Kitty
for: kitty, cat, kitt
trigger: here kitty
does: pose all fours \u2192 moo
waits: 2s

And this one stays. When anyone says here kitty, you're down on all fours and mewin' before you know it.

=== slip: Kitty Talk
for: kitty, cat, kitt
pull: 10

Mew~
Mrrrow\u2026
*purrs*
Pet\u2026 pet me\u2026
Nya~

=== nudge: Sunbeam Whispers
for: kitty, cat, kitt

That warm spot's callin' you, {name}.
Stretch, {pet}. Long and slow.
Purr for the farm, {name}.

# \u2500\u2500 pigs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Happy in the Mud
for: pig
pace: 35-45s
pick: 4

You're wallowin' in warm mud, {name}, and it feels so good to be dirty.
Piggies don't care how they look. They care about the trough, and the warm, and bein' rubbed.
Every {sound} makes you a little happier and a little dumber.
{f}Such a fat happy sow.
{m}Such a big greedy boar.
When the trough's full, you're the first one there, every time.

=== suggestion: Filthy Pig
for: pig
tone: degrade
level: deep, nhl
pace: 35-45s
pick: 3

You're a filthy greedy pig, {name}, and you love bein' one.
Snout in the trough, rump in the air, oinkin' for more.
{f}A dirty sow that rolls over for anybody.
{m}A greedy boar that ruts on anything.
The messier you get, the better you feel.

=== trigger: Suey
for: pig
trigger: sooey
does: moo 2 \u2192 pose all fours
waits: 2s

And this one's the oldest call on the farm. When anyone calls sooey, you're down on all fours and oinkin' for your supper.

=== slip: Piggy Talk
for: pig
pull: 10

Oink!
Oink oink~
*snorts*
More\u2026 trough\u2026

# \u2500\u2500 bunnies \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Twitchy Bunny
for: bunny, rabbit
pace: 35-45s
pick: 4

Your nose is twitchin', {name}, and your ears are up.
Bunnies are soft and quick and always, always ready.
{f}A breedin' doe, made to be filled, over and over.
{m}A busy buck, always lookin' for the next doe.
{fu}Both at once: a doe to fill and a buck to breed.
Every time somebody pets your ears, you go limp and soft.

=== suggestion: Breedin' Bunny
for: bunny, rabbit
tone: degrade
level: deep, nhl
pace: 35-45s
pick: 3

You're just a dumb breedin' bunny, {name}. That's all bunnies are for.
{v}Always wet, always ready, always waitin' to be bred.
{c}Always hard, always ready, hump hump hump.
No thoughts. Just twitchin' and breedin'.

=== slip: Bunny Talk
for: bunny, rabbit
pull: 10

Squeak!
*nose twitches*
Hop\u2026 hop\u2026
Breed\u2026 bun\u2026

# \u2500\u2500 goats and sheep \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Follow the Flock
for: sheep
pace: 35-45s
pick: 3

Sheep don't lead, {name}. They follow. And followin' is so easy.
Wherever the flock goes, you go, and you never have to choose.
Soft and woolly and warm, pressed in with the others.
A {sound} when you're happy. A {sound} when you're lost. That's all you need.

=== suggestion: Hungry Goat
for: goat
pace: 35-45s
pick: 3

Goats are always hungry, {name}, always curious, always into somethin'.
{t}Your little udders fill up so fast, achin' for the milker.
{c}You're a randy billy, always lookin' for trouble.
A {sound} and a head-butt. That's how goats say please.

=== slip: Flock Talk
for: goat, sheep
pull: 10

Baa~
Meh-eh-eh\u2026
*chews*
Follow\u2026 follow\u2026

# \u2500\u2500 deer, rats, dragons, goblins \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

=== suggestion: Soft Doe
for: deer
pace: 35-45s
pick: 3

You're so soft and shy, {name}, frozen still in the clearin'.
{f}Big eyes, quiet steps, and so easy to catch.
{m}A young buck, proud of his antlers and so easy to lead.
When somebody gentle comes close, you go perfectly still and let them.

=== suggestion: Little Rat
for: rat
pace: 35-45s
pick: 3

You're a busy little {animal}, {name}, whiskers twitchin', nose into everything.
Small and quick and always hungry for more.
A {sound} and a scurry, and you're right where the farm wants you.

=== suggestion: Tamed Dragon
for: dragon
pace: 35-45s
pick: 4

Even a dragon can be tamed, {name}. Even you.
All that fire, banked low and warm, waitin' to be told where to go.
Your claws curl soft. Your wings fold tight. You let the farm hold the reins.
A low {sound} rumbles in your chest every time you're praised.
The bigger the beast, the sweeter it is when it kneels.

=== suggestion: Giggly Goblin
for: goblin
pace: 35-45s
pick: 3

You're a giggly little {animal}, {name}, too silly to sit still.
Every time you try to think, a {sound} bubbles up instead.
Goblins don't plan. Goblins play, and get caught, and get kept.

# \u2500\u2500 more for anybody: triggers, compulsions, hang-ons, wakes \u2500\u2500

=== trigger: Drop for the Farm
level: deep, nhl
trigger: drop for the farm
does: pose {low} \u2192 forget all
waits: 2s

And this one goes deepest. When anyone tells you drop for the farm, you're down {low}, and everythin' else just lets go.

=== trigger: Present
level: deep, nhl
trigger: present yourself
does: strip bottoms \u2192 pose kneel spread
waits: 3s

And this one's for the barn. When anyone tells you to present yourself, your bottoms come off and you kneel spread, waitin'.

=== compulsion: Bell Ring
level: deep, nhl
when: leader talks
does: moo
chance: 8%

And sometimes, when the one who leads your herd speaks, a little {sound} slips out of you, just to answer.

=== compulsion: Fed and Sleepy
when: fed
does: pose {low} \u2192 needy
waits: 3s

And when the farm feeds you, sometimes you go warm and heavy and sink right down {low} where you are.

=== compulsion: Milked and Grateful
level: deep, nhl
when: stall
does: moo 2
chance: 12%

When the cups take hold of you, sometimes you just have to say thank you the only way a {animal} can.

=== hangon: Heel
level: deep, nhl
effect: heel
lasts: 30m

For a while after, you'll want to stay close to the one who leads your herd. Close enough to touch.

=== hangon: Needy After
level: deep, nhl
effect: needy
lasts: 45m

And the warm ache stays with you a while after. It doesn't go away. It just waits.

=== hangon: Fuzzy Names
level: nhl
effect: names
lasts: 30m

For a while after, names won't stick. Faces go soft. There's just the farm, and the herd.

=== wake: Back to the Barn, Sweetly
tone: praise
pace: 15s
pick: 1
beats: theta \u2192 alpha 11 over 1m
look: clear

Up you come now, slow and warm, {name}. Three, two, one. Eyes open. You did so well. Such a good {animal}.
Coming up now, {name}, feeling safe and proud and loved. Three, two, one, and you're back in the barn with us.

=== wake: Up, Dumb Thing
tone: degrade
level: deep
pace: 15s
pick: 1
beats: \u2192 alpha 10 over 1m
look: haze 10%, rings off, words off

Up you come, {pet}. Three, two, one. Eyes open. Not that there's much behind them now.
Wakey wakey, dumb {animal}. Back to the barn. Try not to think too hard on the way.

# \u2500\u2500 sessions (the ones marked visor: yes are on the farm's public visor list) \u2500\u2500

=== session: Under the Glow
visor: yes
induction: The Glow
deepener: any
suggestion: Under Glass, any
wake: any

=== session: Udder Worship
level: deep, nhl
for: cow, goat
visor: yes
induction: The Milker's Rhythm
deepener: The Cellar Stairs, any
convincer: any
suggestion: Dairy Thoughts, The Ache, any
trigger: Milk Letdown, any
compulsion: any
hangon: any
wake: any

=== session: Stud Service
level: deep, nhl
for: cow, bull, horse, pony, pig, bunny, rabbit
visor: yes
induction: any
deepener: any
suggestion: The Ache, Held on the Edge, any
trigger: any
hangon: On the Edge, any
wake: any

=== session: Pony Trainin'
level: fun, deep
for: pony, horse
visor: yes
induction: Countin' Down in the Straw
deepener: Pasture Sunset
suggestion: Bit and Bridle, any
trigger: Walk On
wake: any

=== session: Good Pup
level: fun, deep
for: pup, dog, wolf, fox
visor: yes
induction: any
deepener: The Warm Trough, any
suggestion: Good Pup, any
trigger: Who's a Good One
hangon: any
wake: any

=== session: Kitty in Heat
level: deep, nhl
for: kitty, cat, kitt
visor: yes
induction: Head to Tail
deepener: any
suggestion: Warm Kitty, The Ache, any
trigger: Here Kitty
hangon: any
wake: any

=== session: Mud and Trough
level: fun, deep
for: pig
visor: yes
induction: any
deepener: The Warm Trough
suggestion: Happy in the Mud, any
trigger: Suey
wake: any

=== session: Deep Barn Cellar
level: nhl
visor: yes
induction: any
deepener: The Cellar Stairs, Up and Down Again, Deeper Every Time
convincer: Where's Your Name, any
suggestion: Belongs to the Farm, any 2
trigger: Drop for the Farm, any
compulsion: any 2
hangon: any 2
wake: any
`;

  // shared/trance-starter.js
  var CORE = `# The farm's starter trance library. The studio's trance editor opens this when you start fresh.
# Every block: === kind: Name, then labels, then the lines. A session is a recipe of blocks.

=== induction: Settling In
pace: 35-45s
pick: 4
beats: alpha 10 \u2192 theta 6 over 3m
look: haze 20%, spiral slow

Hear my voice, {name}. Just my voice. Let everything else in the barn go quiet.
Listen, {name}. Just listen. The barn is warm, the straw is soft, and my voice is the only thing that matters.
Breathe in slow. Breathe out slower. Every breath out lets your shoulders drop a little more.
In through your nose, slow. Out through your mouth, slower. Again. Good.
Let your hands go loose. Let your jaw go loose. Let everything that's holding on just let go.
You don't have to think right now, {name}. Thinking is work, and you're not working. You're listening.
Somewhere a cow lows and a gate creaks, and every sound just makes you sleepier.
Feel how heavy your eyelids are getting. It's alright to let them close.
Your body is getting heavy, {name}, heavy and warm, sinking into the straw.
You've worked hard. You've been good. Now you get to stop, and just hear me.
Feel the weight of your own head. Let it tip. Let it rest.
There's nothing you need to do right now, {name}. Nothing at all but listen.

=== deepener: Soft Straw
level: fun
pace: 35-45s
pick: 3
beats: theta 6
look: haze 35%
deeper: +15

Down a little now. Soft and easy, like sinking into warm straw.
Every word I say makes it easier to drift. Easier to just be a {pet}.
Good. You're drifting, and it feels so nice to let go.
Sinking softly now, like a calf curling up in the hay.
Each breath out, a little further down. Nice and easy. Nothing to it.
It's so pleasant down here, {name}. Warm and simple and quiet.
Drifting, drifting, and every drift feels better than the last.
You're a good {animal} now, and being a good {animal} feels so easy.

=== deepener: Dark and Warm
level: deep
pace: 35-45s
pick: 4
beats: theta \u2192 delta 3.5 over 4m
look: haze 50%, rings on, words drift
deeper: +25

Deeper now. Each time you breathe out, you sink twice as far.
There's nothing above you but my voice, and nothing below you but more quiet. Keep sinking.
Your thoughts are getting slow and simple. Simple is good. Simple is right for a {animal}.
So deep now. You don't need words down here. You just need to listen.
Down past the busy part of your mind, down where it's dark and warm and slow.
Every word I say pushes you a little deeper, and you don't want me to stop.
Your thoughts are coming slower now, one at a time, and then not at all.
Deeper. You can't feel where your body ends and the straw begins.
So deep. So good. A good {animal} sinks when they're told.

=== deepener: Past the Words
level: nhl
pace: 35-45s
pick: 4
beats: delta 3 \u2192 2 over 4m
look: haze 65%, rings on, words drift, names blur
deeper: +35

Deeper. Past where the words are. Past where your name lives.
Let the person part of you drift away like a dream you're forgetting. There's only the {animal} left.
Nothing up there to hold on to. No worries, no choices, no human things. Just a {animal}.
Deeper than you've ever been. And every time we do this, you'll go deeper still.
Deeper than thought. Deeper than words. Down where only the {animal} lives.
Your name is getting far away, {name}. Let it go. You won't need it down here.
Every breath out takes a little more of the person with it. Let it go.
There's no up from here unless I bring you, and I'm in no hurry.
Lower and lower, until you're nothing but warm and obedient and {animal}.

=== convincer: Heavy Hands
level: deep, nhl
pace: 30-40s
pick: 2

Your hands are so heavy, {name}. Too heavy to lift. Try, and feel how they just stay where they are.
Your eyelids are sealed now, warm and soft. The harder you try to open them, the deeper you sink.
Your {paws} are resting where they fell. Nothin' in you wants to move them.

=== suggestion: Good Animal
level: fun
pace: 35-45s
pick: 3

When you come up, your body remembers how a good {animal} waits: {low}.
Your hands stay away from yourself. Good {animal}s don't touch. They wait to be touched.
Every time someone calls you {pet}, you'll feel a warm little glow of pride.
Being a good {animal} is easy. You just {act}, and everything feels right.
Every time you hear the milking bell, you'll feel a little flutter of good {animal} pride.
When someone pats your head, you'll lean into it. You won't even notice you're doing it.
Every time you {sound}, you'll feel a little warm rush. Good {animal}s make their noises.
When someone says {pet}, you'll smile. You won't be able to help it.
{t}Your tits will feel full and heavy and proud, like they're there to be admired.
{c}When you're praised, a little warm throb runs through your cock. Good {animal}s like praise.

=== suggestion: Only the Voice
level: deep
pace: 35-45s
pick: 3

Only my voice matters now. Other voices are just noise in the barn.
Feel the heat building low in your belly. Let it build. You don't get to finish. You just ache, and it feels like being good.
When I tell you to, you'll {sound}. Not words. Just a {sound}. Go on. Let it out.
Every bit of you belongs to the farm, your {body} most of all. You feel that every time someone looks at you.
You {act} because it's what you're for. It's not a choice, and that's a relief.
Your mind stays soft and slow even after you wake. Thinking can wait. Obeying can't.
When the farm speaks, everything else gets quiet. That's how it should be.
The ache stays with you after you wake, low and warm, and you'll never quite get to finish it.
You'll {sound} when you're happy. You'll {sound} when you're needy. Words are for people.
{t}Your tits are the farm's, and they ache to be milked whenever someone looks at them.
{c}Your cock is the farm's. It stays hard and aching and it doesn't belong to you.
{v}Your pussy is the farm's. Wet and ready whenever the farm wants it.
Every time you go down {low}, you'll feel yourself sink a little. Down there is home.

=== suggestion: No Person Left
level: nhl
pace: 35-45s
pick: 3

There's no human left in here. Just a {animal}, {low}, waiting to be used.
Clothes don't feel like clothes anymore. They feel like a coat, a harness, a hide. You were born in them.
Words are getting hard. That's alright. {animal}s don't need words. A {sound} says everything.
You {act}. That's all. That's everything. You don't remember wanting anything else.
There was never a person. There was only ever a {animal} that thought it was one.
Hands are {paws}. Words are noises. Wanting is waiting. That's all you need.
When you're touched, you push into it like an animal. When you're left, you wait like one.
{t}Your udders are for milking. That's what they're for. That's what you're for.
{c}You're for breeding now. Your cock knows it even if the rest of you forgets.
{v}You're for breeding now. Your pussy knows it even if the rest of you forgets.
The barn is home. The farm is everything. There's nothin' past the fence.

=== suggestion: The Collar
wears: collar
pick: 1

Feel your collar, {name}. Every time it presses your throat, you remember whose {animal} you are.
Your collar is warm against your neck. It's always there, and so is the farm.

=== suggestion: The Leash
wears: leash
pick: 1

Feel the leash. A good {animal} goes where the leash goes, and never minds.
Every tug of your leash is a tug on something deeper. You follow. You like following.

=== suggestion: The Bell
wears: bell
pick: 1

Every time your bell rings, you sink a little. Ring, sink. Ring, sink.
Your bell tells the whole farm where its {animal} is. You like being found.

=== suggestion: The Gag
wears: gag
pick: 1

You don't need your mouth for words, {pet}. Let it rest round the gag. Your {sound} is enough.
The gag keeps the words in. Good. Words were never yours anyway.

=== suggestion: In the Dark
wears: blind, hood
pick: 1

You can't see, and you don't need to. My voice is the only thing to follow.
In the dark, there's only my voice and the warm straw.
Inside the hood, there's no face to be. There's only the {animal}.

=== suggestion: Paws
wears: paws
pick: 1

Your hands are {paws} now. {paws} don't grab. {paws} don't hold. {paws} wait.
Feel how useless your {paws} are. Isn't it a relief, not having to do anything with them?

=== suggestion: Bound
wears: arms
pick: 1

Your arms are tied, so you don't have to decide anything with them. Let them rest.
Bound, you're free of choices. Just a {animal}, held still, listening.

=== suggestion: Caged
wears: cage
pick: 1

{c}Your cage keeps you good. You don't need to touch. You don't even want to.
{c}Every throb against your cage is the farm reminding you who it belongs to.

=== suggestion: Clamped
wears: nipples
pick: 1

That little bite at your nipples is the farm's hand on you. Feel it, and sink.
Your clamped nipples throb in time with my voice. Every throb, a little deeper.

=== suggestion: Hide and Tack
wears: latex, harness
pick: 1

Your latex is your hide now. Smooth, shining, nothing human under it.
Feel how the rubber holds you. Tight. Close. Like it's keeping the {animal} in.
Your harness holds you like a farm holds its stock. Snug, and safe, and owned.
Feel every strap of your harness. Each one says: tack, not clothes.

=== suggestion: Ears and Tail
wears: ears, tail
pick: 1

Feel your ears. They twitch at my voice, don't they. {animal}s' ears always do.
Feel your tail. It moves when you're happy, and you're happy now.

=== suggestion: Hooves
wears: hooves
pick: 1

Your hooves keep you up on your toes, the way a good {animal} should stand.
Feel the weight of your hooves. You weren't made for walking like a person.

=== suggestion: Nose Ring
wears: noseRing
pick: 1

Your nose ring is where the farm leads a good {animal}. You'll follow it anywhere.
Feel the ring in your nose. One tug, and you'll come.

=== trigger: Good Animal
trigger: good {animal}
does: say "{sound}~"

And now somethin' to keep. Whenever anyone calls you a good {animal}, a happy little {sound} bubbles right up out of you, and nothin' else will come out till it has.

=== trigger: Low and Still
trigger: low and still
does: pose {low}

And somethin' to keep. When you hear the words low and still, your body goes down {low} before you've thought about it at all.

=== trigger: Milking Time
level: deep, nhl
trigger: milking time
does: strip top \u2192 pose {low} \u2192 say "{sound}\u2026 milk me, please."
waits: 3s, 3s

And somethin' to keep, deep down where you can't reach it. When anyone says it's milking time, your top comes off, you go down {low}, and you ask for it.

=== trigger: Needy Thing
level: deep, nhl
trigger: such a needy {animal}
does: needy \u2192 deny
waits: 2s

And this one stays with you. When anyone calls you such a needy {animal}, the heat comes up in you, and it won't let you finish.

=== trigger: Let Go
level: deep, nhl
trigger: let go for the farm
does: forget all \u2192 cum
waits: 2s

And this one's a kindness. When you hear let go for the farm, everything held back comes undone at once.

=== trigger: To the Stalls
level: deep, nhl
trigger: to the stalls
does: moo \u2192 beg
waits: 2s

And somethin' for the barn to keep. When anyone sends you to the stalls, the {sound} comes up out of you first, then the beggin', and your feet find their own way to a free stall.

# \u2500\u2500 part 3: compulsions (somethin' happenin' sets them off, now and then) and hang-ons (they stay a while after) \u2500\u2500
# How long they stay: from a Fun session a day (a compulsion fires once), from Deep a week, renewed each time they land;
# from No human left, set for good (only a herd leader or a proprietor takes them out).

=== compulsion: First Sound
when: wake
does: moo
chance: 15%

And sometimes, when you come up, the first thing out of you won't be a word at all.

=== compulsion: Knees for the Leader
level: deep, nhl
when: leader
does: pose {low}

When the one who leads your herd walks in, sometimes your knees just give, and down you go, {low}.

=== compulsion: Melt at a Pat
level: deep, nhl
when: pat
does: pose {low} \u2192 moo
waits: 2s

A pat on your head, and sometimes you just melt, right down {low}, with a happy little {sound}.

=== compulsion: Beggin' in the Stall
level: deep, nhl
when: stall
does: beg "{sound}\u2026 more\u2026 milk me more\u2026"

And when the cups take hold of you in the stall, sometimes you can't help beggin' for more.

=== compulsion: So Full
level: deep, nhl
when: full
does: needy \u2192 beg
waits: 3s

When you're full and heavy, sometimes it all turns to wantin', and you go lookin' for a stall.

=== compulsion: Hands on You
level: deep, nhl
when: squeeze
does: needy \u2192 moo
waits: 2s

When somebody's hands are on your {body}, sometimes the heat comes right up, and a {sound} with it.

=== compulsion: Mooin' as You Come
level: nhl
when: cum
does: moo 2

And when you finish, sometimes it's the {animal} that comes out of you, not a word.

=== hangon: Moo Talk
effect: mootalk
lasts: 30m

For a while after you come up, your {sound} keeps slippin' out between your words.

=== hangon: This Animal
level: deep, nhl
effect: cowtalk
lasts: 1h

And for a while after, there's no I. Just this {animal}.

=== hangon: Down Low
level: deep, nhl
effect: fours
lasts: 20m

Your body stays down {low} a while after, where it's comfy.

=== hangon: Hands Off
level: deep, nhl
effect: handsoff
lasts: 30m

Your hands stay off yourself a while after. That's not theirs to touch.

=== hangon: On the Edge
level: deep, nhl
effect: edge
lasts: 1h

You'll stay right at the edge a while after, achin', and it won't let you over.

=== hangon: Only the Farm's Voice
level: deep, nhl
effect: hearing
lasts: 20m

For a while after, the barn stays quiet but for the farm's voice.

=== hangon: Can't Say No
level: nhl
effect: yes
lasts: 1h

And for a while after, no won't come out of you. Only yes.

# \u2500\u2500 part 2: the farm's pull through the day \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
# slip: what comes out of their mouth in place of their own words, when their speech gets hijacked (said out loud, as them)
# nudge: the farm's whispers through the day, only to them. pull: how built up the pull has to be first (0-100)

=== slip: Simple Sounds

{sound}.
{sound}~
Mm\u2026 {sound}\u2026
{sound}? {sound}.
Mmh\u2026 what was I\u2026

=== slip: Good Animal Words
pull: 20

Good {animal}s don't need words.
Good {animal}s just listen.
The farm knows best.
So quiet in here\u2026
Mm\u2026 so warm\u2026

=== slip: Full and Achin'
pull: 40

{t}So full\u2026 need milked\u2026
{t}Milk me\u2026 please\u2026
{c}Need\u2026 drained\u2026
Need the stall\u2026 need it\u2026

=== slip: Empty
level: deep, nhl
pull: 60

Empty and happy.
No thoughts. Just {sound}.
This {animal} belongs to the barn.
Good {animal}s give milk.
Nothin' up here but straw\u2026

=== slip: No Human Left
level: nhl
pull: 80

There's no person in here.
Just a {animal}. Just a {animal}.
{sound}\u2026 {sound}\u2026 {sound}\u2026

=== nudge: Little Whispers

Good {animal}s don't need to think, {name}.
Breathe out, {name}. That's it.
The barn's so warm today.
Somethin' in you is always listening, {name}.
Easy, {pet}. Nothin' to hurry for.

=== nudge: Drowsy
pull: 30

So heavy, {name}. Your eyes want to close.
You could just let go, right here.
Doesn't the straw look soft, {pet}?
Every breath out, a little further down.
Thinkin's gettin' harder, isn't it?

=== nudge: Nearly There
pull: 60

Soon, {name}. You can feel it comin', can't you?
Your words are slippin'. That's alright.
The farm's waitin' for you, {pet}.
Just a little more and you're ours again.
Let it fill you right up.

=== wake: Count Up
level: fun
pace: 15s
pick: 1
beats: theta \u2192 alpha 11 over 1m
look: clear

Now I'm going to count you up. Three: feeling your body again. Two: lighter. One: eyes open, {name}. Good {animal}.
Coming up now. Three, two, one, and you're back in the barn, {name}, smiling for no reason at all. Good {animal}.
Up you come, slow and easy. Wiggle your fingers. Open your eyes. Welcome back, {pet}.

=== wake: Not All the Way
level: deep
pace: 15s
pick: 1
beats: \u2192 alpha 10 over 1m
look: haze 15%, rings off, words off

Counting up slowly. Five, four: the barn coming back. Three, two: your name, your hands. One: awake, {name}. But part of you is still listening.
I'll bring you up now, {name}, but not all the way. Part of you stays down there, listening. Three, two, one.
Up, slowly. Your name comes back first, then your hands. But the quiet stays, and so does the farm's voice.

=== wake: The Animal Stays
level: nhl
pace: 15s
pick: 1
beats: \u2192 theta 6 over 1m
look: haze 30%, rings off, words off

I won't count you all the way up, {pet}. You'll open your eyes, but the {animal} stays. It's yours now.
Open your eyes. Look around the barn. Nothing in there but a {animal}. Good.
No counting up, {pet}. Just open your eyes. The {animal} can look around now.
The session's over. The {animal} isn't. Stay as you are.

=== session: Fun in the Straw
level: fun
visor: yes
induction: any
deepener: any
suggestion: any 2
trigger: any
hangon: any
wake: any

=== session: Deep in the Barn
level: deep
visor: yes
induction: any
deepener: any
convincer: any
suggestion: any 3
trigger: any 2
compulsion: any
hangon: any
wake: any

=== session: No Human Left
level: nhl
visor: yes
induction: any
deepener: any
convincer: any
suggestion: any 3
trigger: any 2
compulsion: any 2
hangon: any 2
wake: any
`;
  var STARTER = CORE + "\n" + MORE;

  // shared/visor.js
  var MAX_SESSIONS = 5;
  var MAX_NEED = 5;
  var MAX_WORDS = 12;
  var MAX_PICS = 20;
  var clamp = (v, lo, hi, d) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d;
  };
  var str = (s, n) => String(s == null ? "" : s).replace(/[()<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
  var okLink = (u) => typeof u === "string" && u.length <= 600 && /^https:\/\/[a-z0-9.-]+(:[0-9]+)?\/[^\s"'<>()]*$/i.test(u) && !/\.(html?|php|aspx?|jsp|js|mjs|css|json|txt|xml|pdf|zip|rar|7z|exe|msi|apk|mp4|webm|mov|mp3|wav|ogg|svg)([?#]|$)/i.test(u);
  var SPIRALS = ["classic", "pinwheel", "tight", "tunnel", "counter", "hearts", "paws", "bells", "words", "none"];
  var SPINS = ["slow", "slower", "still"];
  var PLACES = ["behind", "over", "both"];
  var CHAT_FX = ["whisper", "melt", "fade", "watermark"];
  var FX = ["float", "wave", "breath", "tunnel", "bloom", "warp", "ripple", "crowd", "kalei", "hearts", "aura", "meter", "face", "zoom"];
  var LOOK_DEFAULTS = { spiral: "classic", spin: "slow", place: "behind", spOp: 0.4, breathe: true, drift: true, chat: ["whisper", "fade", "watermark"], lines: "", linesNeed: 0, linesLock: false, fx: [] };
  function normTuning(t) {
    t = t && typeof t === "object" ? t : {};
    const list2 = (a, n, len) => (Array.isArray(a) ? a : String(a || "").split(",")).map((x) => str(x, len)).filter(Boolean).slice(0, n);
    const out = base(t, list2), D2 = LOOK_DEFAULTS, keep = (k, v) => {
      if (JSON.stringify(v) !== JSON.stringify(D2[k])) out[k] = v;
    };
    keep("spiral", SPIRALS.includes(t.spiral) ? t.spiral : D2.spiral);
    keep("spin", SPINS.includes(t.spin) ? t.spin : D2.spin);
    keep("place", PLACES.includes(t.place) ? t.place : D2.place);
    keep("spOp", Math.round(clamp(t.spOp, 0.1, 0.7, D2.spOp) * 100) / 100);
    keep("breathe", t.breathe === void 0 ? D2.breathe : !!t.breathe);
    keep("drift", t.drift === void 0 ? D2.drift : !!t.drift);
    keep("chat", t.chat === void 0 ? D2.chat : CHAT_FX.filter((x) => (Array.isArray(t.chat) ? t.chat : []).includes(x)));
    keep("lines", str(t.lines, 80));
    keep("linesNeed", out.lines ? Math.round(clamp(t.linesNeed, 0, 20, 0)) : 0);
    keep("linesLock", !!(out.lines && t.linesLock));
    keep("fx", FX.filter((x) => (Array.isArray(t.fx) ? t.fx : []).includes(x)));
    return out;
  }
  function base(t, list2) {
    return {
      v: 1,
      sessions: list2(t.sessions, MAX_SESSIONS, 60),
      need: Math.round(clamp(t.need, 0, MAX_NEED, 1)),
      show: t.show === "wearer" ? "wearer" : "crafter",
      words: list2(t.words, MAX_WORDS, 24),
      set: str(t.set, 40),
      pictures: (Array.isArray(t.pictures) ? t.pictures : []).filter(okLink).slice(0, MAX_PICS),
      wordEvery: clamp(t.wordEvery, 2, 8, 3),
      // seconds between words, never under 2
      wordMs: Math.round(clamp(t.wordMs, 500, 1e3, 800)),
      // how long each shows (fadin' in and out inside it)
      wordOp: clamp(t.wordOp, 0.15, 0.6, 0.45),
      // how bright a word gets, never full
      picOp: clamp(t.picOp, 0.1, 0.8, 0.35),
      // how see-through the pictures are
      picEvery: Math.round(clamp(t.picEvery, 8, 60, 20)),
      fit: t.fit === "contain" ? "contain" : "cover"
    };
  }
  function stable(v) {
    if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
    if (v && typeof v === "object") return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + stable(v[k])).join(",") + "}";
    return JSON.stringify(v);
  }
  function fnv(s, seed) {
    let h = seed >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function tuningCode(t) {
    const s = stable(normTuning(t));
    return (fnv(s, 2166136261).toString(36).padStart(7, "0").slice(-4) + fnv(s, 2538058380).toString(36).padStart(7, "0").slice(-4)).toLowerCase();
  }
  var codeOk = (code, t) => typeof code === "string" && !!t && tuningCode(t) === code.toLowerCase();

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
  var LEVELS2 = ["fun", "deep", "nhl"];
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
    deep: ["You hear only my voice now. Everything else in the barn is just the wind.", "Kneel spread for me, knees wide, the way a good {a} waits.", "You are so worked up, achin' and warm, and it only builds.", "You cannot cum. Not one drop till the farm says so."],
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
    w.paws = HOOVES.includes(key) ? "hooves" : key === "dragon" ? "claws" : "paws";
    return w;
  }
  var HOOVES = ["cow", "pony", "horse", "goat", "sheep", "pig", "bull", "deer"];
  function petName(mn) {
    const w = words(mn), r = api.rec(mn) || {}, t = me(mn).tier;
    const i = Math.max(0, Math.min(3, r.degradeMe ? t + 1 : r.praiseMe ? t - 1 : t));
    return w.names[i];
  }
  function say(mn, line) {
    const w = words(mn);
    return fill(line, { name: api.name(mn) }).replace(/\{a\}/g, w.a).replace(/\{s\}/g, w.s).replace(/\{p\}/g, w.p).replace(/\{act\}/g, w.act).replace(/\{pose\}/g, w.pose).replace(/\{pet\}/g, petName(mn)).replace(/\{paws\}/g, w.paws || "paws").replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
  }
  var handful = (list2, n, b) => {
    const pool = fitting(list2, b).slice();
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
  var STUDIO = "http://localhost:4780/__studio/trance/";
  var LIB = null;
  var pullFails = 0;
  var nextPull = 0;
  function lib() {
    if (LIB) return LIB;
    const d = D(), own = d.lib && typeof d.lib.text === "string" ? d.lib : null;
    let p = own ? parseLibrary(own.text) : null;
    if (!p || !p.blocks.some((b) => !b.bad && b.kind !== "session" && b.lines.length)) p = parseLibrary(STARTER);
    LIB = Object.assign(p, { from: own ? "studio" : "starter", stamp: own ? own.stamp : "", at: own ? own.at : 0 });
    return LIB;
  }
  function setLib(text, stamp) {
    if (text == null) delete D().lib;
    else D().lib = { text: String(text).slice(0, 4e5), stamp: String(stamp || "").slice(0, 60), at: Date.now() };
    LIB = null;
    api.save();
    const L = lib();
    for (const m of api.here()) if (told.has(m)) sendPull(m);
    return L;
  }
  async function pull(force) {
    const W2 = typeof window !== "undefined" ? window : null;
    if (!W2 || typeof W2.fetch !== "function") return { fail: "no way to reach the studio from here" };
    if (!force && Date.now() < nextPull) return null;
    try {
      const r = await W2.fetch(STUDIO + "published.json", { cache: "no-store" });
      if (!r.ok) throw new Error("the studio answered " + r.status);
      const pub = await r.json();
      pullFails = 0;
      nextPull = Date.now() + 6e4;
      if (!pub || !pub.stamp) return { none: true };
      if (!force && D().lib && D().lib.stamp === pub.stamp) return { same: true };
      const t = await W2.fetch(STUDIO + "published.txt", { cache: "no-store" });
      if (!t.ok) throw new Error("the studio answered " + t.status);
      const L = setLib(await t.text(), pub.stamp);
      api.log("trance library from the studio (" + pub.stamp + "): " + L.blocks.length + " blocks, " + L.errors.length + " mistakes");
      return { got: L };
    } catch (e) {
      pullFails++;
      nextPull = Date.now() + Math.min(10, pullFails) * 6e4;
      return { fail: String(e && e.message || e) };
    }
  }
  function libText() {
    const L = lib(), n = (k) => L.blocks.filter((b) => b.kind === k && !b.bad).length;
    return "\u{1F300} Trance library: " + (L.from === "studio" ? "pushed from the studio " + new Date(L.at).toISOString().slice(0, 16).replace("T", " ") : "the starter one") + " \xB7 " + n("session") + " sessions, " + n("induction") + " inductions, " + n("deepener") + " deepeners, " + n("convincer") + " convincers, " + n("suggestion") + " suggestions, " + n("trigger") + " triggers, " + n("wake") + " wakes" + (L.errors.length ? " \xB7 " + L.errors.length + " mistakes (those blocks are skipped): " + L.errors.slice(0, 3).map((e) => "line " + e.line + " " + e.msg).join("; ") : "");
  }
  function speciesKey(mn) {
    const s = String(api.species(mn) || "").toLowerCase(), r = String((api.rec(mn) || {}).species || "").toLowerCase();
    return SPECIES[s] ? s : SPECIES[r] ? r : s || r || "default";
  }
  var wearsOf = (mn) => {
    const g = gearOf(api, mn);
    return Object.keys(g).filter((k) => g[k]);
  };
  var tonesOf = (mn) => {
    const r = api.rec(mn) || {};
    return [].concat(r.praiseMe ? ["praise"] : [], r.degradeMe ? ["degrade"] : []);
  };
  var lowOf = (mn) => me(mn).low === "fours" ? "fours" : "kneel";
  function wordsFor(mn) {
    const w = words(mn), lead = api.herdLeaderOf ? api.herdLeaderOf(mn) : null;
    return {
      name: api.name(mn),
      animal: w.a,
      sound: w.s,
      body: w.p,
      pet: petName(mn),
      act: w.act,
      pose: w.pose,
      paws: w.paws || "paws",
      low: lowOf(mn) === "fours" ? "on all fours" : "on your knees",
      herd: lead && lead !== mn ? api.name(lead) : "the farm",
      a: w.a,
      s: w.s,
      p: w.p
    };
  }
  var sayLib = (mn, line) => fillIn(untag(line), wordsFor(mn)).replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
  function tellOnce(mn, key, text) {
    const x = me(mn), day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    x.told = x.told || {};
    if (x.told[key] === day) return;
    x.told[key] = day;
    api.save();
    api.notice(mn, text);
  }
  var plantedOf = (mn) => {
    const x = me(mn);
    return x.sugg = x.sugg || {};
  };
  var lscgOn = (hs) => !!(hs && hs.lscg && hs.on);
  var isComp = (x) => x && x.kind === "compulsion";
  function keepUntil(level, was) {
    if (level === "nhl" || was && was.perm) return { until: null, perm: true };
    const ms = KEEP_MS[level] || KEEP_MS.fun, until = Date.now() + ms;
    return { until: was && was.until ? Math.max(was.until, until) : until, perm: false };
  }
  function plant(mn, run, b) {
    if (!api.hasCompanion || !api.hasCompanion(mn)) {
      api.log(b.kind + " " + b.name + " not planted in " + mn + ": no Companion");
      return;
    }
    if (b.kind === "hangon") return plantHangon(mn, run, b);
    if (b.kind === "compulsion") return plantCompulsion(mn, run, b);
    const sg = lscgSuggestion(b, { words: wordsFor(mn), low: lowOf(mn), by: api.cfg.BOT_MEMBER, byName: api.name(api.cfg.BOT_MEMBER) || "The farm", now: Date.now() });
    if (sg.error) {
      api.log("trigger " + b.name + " can't be planted: " + sg.error);
      return;
    }
    const hs = api.hypnoState(mn), all = plantedOf(mn), was = all[sg.id];
    all[sg.id] = Object.assign({ kind: "trigger", s: sg, block: b.name, level: run.level, at: Date.now(), via: lscgOn(hs) ? "lscg" : "farm", ok: false, fired: was ? was.fired || 0 : 0, fought: was ? was.fought || 0 : 0 }, keepUntil(run.level, was));
    api.save();
    if (lscgOn(hs)) plantLscg(mn);
    else sendFarm(mn);
  }
  function plantCompulsion(mn, run, b) {
    const c = farmCompulsion(b, { words: wordsFor(mn), low: lowOf(mn) });
    if (c.error) {
      api.log("compulsion " + b.name + " can't be planted: " + c.error);
      return;
    }
    const all = plantedOf(mn), was = all[c.id];
    all[c.id] = Object.assign({
      kind: "compulsion",
      s: { id: c.id, name: c.name, trigger: "", instructions: c.instructions },
      when: c.when,
      chance: c.chance,
      once: run.level === "fun" && !(was && !was.once),
      block: b.name,
      level: run.level,
      at: Date.now(),
      via: "farm",
      ok: true,
      fired: was ? was.fired || 0 : 0,
      fought: was ? was.fought || 0 : 0
    }, keepUntil(run.level, was));
    api.save();
  }
  function plantHangon(mn, run, b) {
    const secs = Math.min(HANG_CAP_S[run.level] || HANG_CAP_S.fun, b.labels.lasts || 1800);
    api.hypno(mn, { do: "hangon", id: slug(b.name), name: b.name, effect: b.labels.effect, until: Date.now() + secs * 1e3, low: lowOf(mn) });
  }
  function plantLscg(mn, quiet) {
    const hs = api.hypnoState(mn) || {}, want = Object.values(plantedOf(mn)).filter((x) => x.via === "lscg" && !x.ok), out = me(mn).unplant || [];
    if (!want.length && !out.length) return false;
    const miss = [];
    if (!hs.sugg) miss.push("tick Allow suggestions in LSCG's Hypnosis settings");
    if (!hs.ours) miss.push((hs.scopes || []).includes("states") ? "be under in the farm's name (it plants them next session)" : "let the farm in: LSCG settings \u2192 Extensions \u2192 B&B Farm, Hypnosis and States");
    if (miss.length) {
      if (!quiet && want.length) tellOnce(mn, "plant", "\u{1F300} The farm has " + want.length + " trigger" + (want.length === 1 ? "" : "s") + " waitin' to go into your LSCG. First " + miss.join(", and ") + ".");
      return false;
    }
    const now = Date.now(), go = want.filter((x) => !x.tried || now - x.tried > 3e4);
    if (!go.length && !out.length) return false;
    for (const x of go) x.tried = now;
    api.lscgPlant(mn, go.map((x) => x.s), out, hs.ver);
    me(mn).unplant = [];
    api.save();
    if (go.length) api.later(() => api.hypno(mn, { do: "check", ids: go.map((x) => x.s.id) }), 4e3);
    return true;
  }
  function sendFarm(mn) {
    const on = !!(api.rec(mn) || {}).hypno;
    const list2 = on ? Object.values(plantedOf(mn)).filter((x) => x.via === "farm" && !isComp(x)).map((x) => x.s) : [];
    api.hypno(mn, { do: "suggestions", list: list2 });
  }
  function fadeTick() {
    const now = Date.now();
    for (const [k, x] of Object.entries(D().people)) {
      const all = x.sugg;
      if (!all) continue;
      let farm = false;
      for (const [id, p] of Object.entries(all)) {
        if (!p.until || p.until > now) continue;
        delete all[id];
        if (p.via === "lscg" && p.ok) (x.unplant = x.unplant || []).push(p.s);
        if (p.via === "farm" && !isComp(p)) farm = true;
      }
      if (farm && api.char(Number(k))) sendFarm(Number(k));
    }
  }
  var fadeText = (x) => x.perm ? "set for good" : x.until ? "fades " + (x.until - Date.now() > 36 * 36e5 ? "in " + Math.round((x.until - Date.now()) / 864e5) + " days" : "in " + Math.max(1, Math.round((x.until - Date.now()) / 36e5)) + " hours") + (x.once ? ", fires once" : "") : "";
  function plantedText(mn, forMe) {
    const all = Object.values(plantedOf(mn));
    if (!all.length) return "\u{1F300} " + (forMe ? "Nothin's" : api.name(mn) + " has nothin'") + " planted by the farm" + (forMe ? " in you." : ".");
    return "\u{1F300} Planted by the farm" + (forMe ? " in you" : " in " + api.name(mn)) + ":\n" + all.map((x) => "\u2022 " + x.block + ": " + (isComp(x) ? "when " + (WHEN[x.when] || x.when) + ", " + Math.round((x.chance || 0.1) * 100) + "% of the time" : '"' + x.s.trigger + '"') + " \u2192 " + x.s.instructions.map((i) => stepName(i.type)).join(", ") + " \xB7 " + (isComp(x) ? "a compulsion" : x.via === "farm" ? "the farm's own" : x.ok ? "in their LSCG" : "waitin' for LSCG") + (x.fired ? " \xB7 fired " + x.fired + (x.fought ? ", fought off " + x.fought : "") : "") + (fadeText(x) ? " \xB7 " + fadeText(x) : "")).join("\n") + (forMe ? "\n?planted remove <name> takes one out (all: every one; ones set for good only your herd leader or a proprietor can)." + (all.some((x) => x.via === "lscg" && x.ok) ? " Ones in your LSCG also go with LSCG's own: /lscg remove-suggestion B&B <name>." : "") : "");
  }
  function compel(mn, when, by) {
    const r = api.rec(mn);
    if (!r || !r.hypno || !api.char(mn) || !api.hasCompanion || !api.hasCompanion(mn) || running.has(mn) || held(mn) || when !== "wake" && when !== "cum" && idle(mn)) return false;
    const now = Date.now(), list2 = Object.values(plantedOf(mn)).filter((x) => isComp(x) && x.when === when && (!x.until || x.until > now));
    let fired = false;
    for (const x of list2) {
      if (now - (x.rolled || 0) < 10 * 6e4) continue;
      x.rolled = now;
      if (Math.random() >= (x.chance || 0.1)) continue;
      const who = by && by !== mn ? by : api.cfg.BOT_MEMBER;
      api.hypno(mn, { do: "compel", id: x.s.id, name: x.s.name, when, by: who, byName: api.name(who) || "The farm", instructions: x.s.instructions });
      fired = true;
      break;
    }
    api.save();
    return fired;
  }
  function landed(mn, x) {
    if (!x) return;
    if (isComp(x) && x.once) {
      delete plantedOf(mn)[x.s.id];
      return;
    }
    if (x.until) x.until = Math.max(x.until, Date.now() + (KEEP_MS[x.level] || KEEP_MS.fun));
  }
  var herdOf = (lead) => api.here().filter((m) => m !== lead && api.herdLeaderOf && api.herdLeaderOf(m) === lead);
  var PULL = { NUDGE_MIN: [4, 9], STEP: [2, 4], TRIGGER: 5, SESSION: 8, SESSION_CAP: 90, MILKED: 3, AFTER_COLLECT: 20, AWAY_PER_H: 10, IDLE_MIN: 20 };
  var pullOf = (mn) => {
    const x = me(mn);
    return x.pull = x.pull || { n: 0, at: Date.now(), next: 0 };
  };
  function pullOn(mn) {
    const r = api.rec(mn), hs = api.hypnoState(mn);
    return !!(r && r.hypno && api.hasCompanion && api.hasCompanion(mn) && !(hs && hs.pullOff));
  }
  var idle = (mn) => !!(api.idleMin && api.idleMin(mn) > PULL.IDLE_MIN);
  var held = (mn) => !!(api.busy && api.busy(mn));
  var pullFree = (mn) => pullOn(mn) && !!api.char(mn) && !running.has(mn) && !held(mn) && !idle(mn);
  function asideLines(mn, kind, n) {
    const who = { level: me(mn).max, species: speciesKey(mn), wears: wearsOf(mn), tone: tonesOf(mn) }, b = bodyOf(api, mn), out = [];
    for (const blk of lib().blocks) {
      if (blk.kind !== kind || !fits2(blk, who)) continue;
      const need = blk.labels.pull || 0;
      if (n != null && need > n) continue;
      for (const l of blk.lines) if (l.text && fits(l.text, b)) out.push({ t: sayLib(mn, l.text).slice(0, 160), p: need });
    }
    return out;
  }
  var told = /* @__PURE__ */ new Map();
  function sendPull(mn, slips) {
    if (!api.hasCompanion || !api.hasCompanion(mn)) return;
    const L = lib(), w = wordsFor(mn), key = L.from + ":" + (L.stamp || "") + ":" + me(mn).max + ":" + speciesKey(mn) + ":" + tonesOf(mn).join("+");
    const bd = bodyOf(api, mn) || {};
    const msg = {
      do: "pull",
      n: pullOn(mn) ? Math.round(pullOf(mn).n) : 0,
      sound: w.sound,
      animal: w.animal,
      herd: api.herdLeaderOf && api.herdLeaderOf(mn) || 0,
      low: lowOf(mn),
      species: speciesKey(mn),
      tone: tonesOf(mn),
      body: { g: String(bd.g || ""), tits: !!bd.tits, cock: !!bd.cock, vulva: !!bd.vulva }
    };
    if (slips || told.get(mn) !== key) {
      msg.slips = asideLines(mn, "slip", null).slice(0, 60);
      told.set(mn, key);
    }
    api.hypno(mn, msg);
  }
  function pullAdd(mn, add) {
    if (!pullOn(mn)) return;
    const p = pullOf(mn), was = p.n;
    p.n = Math.max(0, Math.min(100, p.n + add));
    p.at = Date.now();
    api.save();
    if (Math.floor(was / 10) !== Math.floor(p.n / 10)) sendPull(mn);
    if (p.n >= 100) collect(mn);
  }
  function pullTick() {
    fadeTick();
    const now = Date.now(), here = new Set(api.here());
    for (const mn of here) {
      if (!Object.values(plantedOf(mn)).some((x) => isComp(x) && x.when === "full")) continue;
      try {
        const p = api.prod(mn);
        if (p && api.makesMilk(mn) && p.milk >= api.milkCap(mn) * 0.8) compel(mn, "full");
      } catch (e) {
      }
    }
    for (const [k, x] of Object.entries(D().people)) {
      const mn = Number(k), p = x.pull;
      if (!p || p.n <= 0 || here.has(mn) && pullOn(mn) && !idle(mn)) continue;
      const h = (now - (p.at || now)) / 36e5;
      if (h >= 0.1) {
        p.n = Math.max(0, p.n - h * PULL.AWAY_PER_H);
        p.at = now;
      }
    }
    const gap = () => between(PULL.NUDGE_MIN[0] * 60, PULL.NUDGE_MIN[1] * 60) * 1e3;
    for (const mn of here) {
      if (!pullFree(mn)) continue;
      const p = pullOf(mn);
      if (p.n >= 100) {
        collect(mn);
        continue;
      }
      if (!p.next || p.next - now > PULL.NUDGE_MIN[1] * 6e4) {
        p.next = now + gap();
        continue;
      }
      if (now < p.next) continue;
      p.next = now + gap();
      nudge(mn);
    }
    api.save();
  }
  var NUDGES = ["haze", "voice", "voice", "blur", "spiral"];
  function nudge(mn) {
    const p = pullOf(mn);
    p.n = Math.min(100, p.n + between(PULL.STEP[0], PULL.STEP[1]));
    p.at = Date.now();
    let fx = pick(NUDGES.filter((f) => (f !== "blur" || p.n >= 20) && (f !== "spiral" || p.n >= 40))), text = "";
    if (fx === "voice") {
      const ls = asideLines(mn, "nudge", p.n);
      if (ls.length) {
        const top = Math.max(...ls.map((x) => x.p));
        text = pick(ls.filter((x) => x.p >= top - 30)).t;
      } else fx = "haze";
    }
    api.hypno(mn, { do: "nudge", fx, text, n: Math.round(p.n) });
    api.save();
    if (p.n >= 100) collect(mn);
  }
  function collect(mn) {
    if (!pullFree(mn)) return;
    const p = pullOf(mn), now = Date.now();
    if (p.collectedAt && now - p.collectedAt < 10 * 6e4) return;
    p.collectedAt = now;
    api.save();
    api.notice(mn, "\u{1F300} It's been fillin' you up all day, a little at a time, and now there's no room left. You drop right where you are, and the farm comes for you.");
    const lead = api.herdLeaderOf && api.herdLeaderOf(mn);
    if (lead && lead !== mn && api.char(lead)) api.notice(lead, "\u{1F300} " + api.name(mn) + " dropped under on their own. The farm's takin' them down.");
    start(api.cfg.BOT_MEMBER, mn, me(mn).max, null, false, { collected: true });
  }
  var stallAsked = /* @__PURE__ */ new Map();
  function toStall(mn) {
    if (!api.char(mn) || !api.rec(mn)) return;
    const now = Date.now();
    if (now - (stallAsked.get(mn) || 0) < 2e4) return;
    stallAsked.set(mn, now);
    if (held(mn)) {
      api.notice(mn, "\u{1F300} Your feet want the milkin' stalls, but somethin's holdin' you right where you are.");
      return;
    }
    const stalls = Object.entries(api.spots()).filter(([n, s]) => n.startsWith("milking") && s && s.X >= 0 && s.Y >= 0).map(([, s]) => s);
    if (!stalls.length) {
      api.notice(mn, "\u{1F300} You go lookin' for a milkin' stall, but the farm hasn't set one out.");
      return;
    }
    const at = api.pos(mn) || { X: 0, Y: 0 }, others = api.here().filter((m) => m !== mn).map((m) => api.pos(m)).filter(Boolean);
    const far = (s) => Math.max(Math.abs(s.X - at.X), Math.abs(s.Y - at.Y));
    const free = stalls.filter((s) => !others.some((o) => o.X === s.X && o.Y === s.Y)).sort((a, b) => far(a) - far(b));
    if (!free.length) {
      api.notice(mn, "\u{1F300} Every milkin' stall's taken. You hover close by, achin' for a turn.");
      return;
    }
    if (far(free[0]) === 0) return;
    api.teleport(mn, { X: free[0].X, Y: free[0].Y });
  }
  if (typeof window !== "undefined" && window.__FARMHAND_TEST__) window.__condPull = {
    tick: () => pullTick(),
    PULL,
    nudge: (mn) => nudge(mn),
    add: (mn, n) => pullAdd(mn, n),
    of: (mn) => pullOf(mn),
    compel: (mn, when, by) => compel(mn, when, by),
    fade: () => fadeTick(),
    planted: (mn) => plantedOf(mn)
  };
  function start(by, mn, level, own, echs, opts) {
    opts = opts || {};
    if (echs) {
      running.set(mn, { by, level, lines: scriptFor(level, mn, own, echs), i: 0, echs: true });
      step(mn);
      return;
    }
    const plan = planSession(lib().blocks, { level, species: speciesKey(mn), wears: wearsOf(mn), tone: tonesOf(mn) }, { name: opts.session });
    if (!plan.blocks.some((b2) => b2.lines.length)) {
      running.set(mn, { by, level, lines: scriptFor(level, mn, own, false), i: 0, echs: false });
      step(mn);
      return;
    }
    const b = bodyOf(api, mn), steps2 = sessionSteps(plan, { keep: (t) => fits(t, b) });
    if (own) {
      const i = steps2.findIndex((s) => s.kind === "suggestion" || s.kind === "trigger" || s.kind === "convincer");
      steps2.splice(i >= 0 ? i : Math.max(1, steps2.length - 1), 0, { kind: "suggestion", block: "own", text: own, gap: 40 });
      const w = steps2.findIndex((s) => s.kind === "wake");
      steps2.splice(w >= 0 ? w : steps2.length, 0, { kind: "suggestion", block: "own", text: own, gap: 40 });
    }
    const ms = steps2.reduce((n, s) => n + (s.gap || 0) * 1e3, 0);
    const run = { by, level, steps: steps2, i: 0, lib: true, plan: plan.name, depth: 0, started: Date.now(), ms, collected: !!opts.collected };
    running.set(mn, run);
    api.hypno(mn, { do: "under", by: api.cfg.BOT_MEMBER, ms: Math.round(ms + 3e5), level, session: plan.name });
    api.face(mn, "trance", Math.round(ms / 1e3) + 120);
    step(mn);
  }
  function step(mn) {
    const run = running.get(mn);
    if (!run) return;
    if (!api.char(mn)) {
      running.delete(mn);
      return;
    }
    if (run.lib) return stepLib(mn, run);
    const line = run.lines[run.i];
    if (!line) {
      finish2(mn, run);
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
  function stepLib(mn, run) {
    const s = run.steps[run.i];
    if (!s) {
      finish2(mn, run);
      return;
    }
    if (s.start || s.beats || s.look || s.volume != null) {
      const cue = { do: "cue", kind: s.kind, block: s.block };
      if (s.beats) cue.beats = s.beats;
      if (s.volume != null) cue.volume = s.volume;
      if (s.look) cue.look = s.look;
      api.hypno(mn, cue);
    }
    if (s.deeper) {
      run.depth = Math.max(0, Math.min(100, run.depth + s.deeper));
      api.hypno(mn, { do: "depth", depth: run.depth });
    }
    if (s.text) api.voice(mn, sayLib(mn, s.text));
    if (s.plant) {
      try {
        plant(mn, run, s.plant);
      } catch (e) {
        api.log("plant: " + (e && e.message || e));
      }
    }
    if (run.level !== "fun" && s.text && s.kind !== "induction" && s.kind !== "wake" && api.arouse) api.arouse(mn, run.level === "nhl" ? 7 : 5, run.level === "nhl" ? 92 : 85);
    run.i++;
    api.later(() => step(mn), Math.max(1, s.gap || 0) * 1e3);
  }
  function finish2(mn, run) {
    running.delete(mn);
    if (run.echs && run.level !== "nhl" && api.echs) api.later(() => api.echs.wake(mn), 4e3);
    if (run.lib) {
      if (run.level === "nhl") api.hypno(mn, { do: "linger", secs: 120 });
      else {
        run.waking = true;
        api.later(() => {
          if (!running.has(mn)) {
            api.hypno(mn, { do: "wake" });
            api.face(mn, "clear", 1);
          }
        }, 4e3);
      }
      if (run.level === "nhl") api.later(() => {
        if (!running.has(mn)) api.face(mn, "clear", 1);
      }, 12e4);
      api.later(() => {
        if (!running.has(mn)) compel(mn, "wake");
      }, run.level === "nhl" ? 125e3 : 8e3);
    } else api.later(() => {
      if (!running.has(mn)) {
        api.trance(mn, 0);
        api.face(mn, "clear", 1);
      }
    }, run.level === "nhl" ? 12e4 : 3e3);
    const x = me(mn);
    x.sessions[run.level] = (x.sessions[run.level] || 0) + 1;
    x.total++;
    if (pullOn(mn)) {
      const p = pullOf(mn);
      p.n = run.collected ? PULL.AFTER_COLLECT : Math.min(PULL.SESSION_CAP, Math.max(p.n, p.n + PULL.SESSION));
      p.at = Date.now();
      sendPull(mn);
    }
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
  function visorDone(mn, level) {
    const x = me(mn), lv = LEVELS2.indexOf(level) > LEVELS2.indexOf(x.max) ? x.max : level;
    x.sessions[lv] = (x.sessions[lv] || 0) + 1;
    x.total++;
    if (pullOn(mn)) {
      const p = pullOf(mn);
      p.n = Math.min(PULL.SESSION_CAP, Math.max(p.n, p.n + PULL.SESSION));
      p.at = Date.now();
      sendPull(mn);
    }
    const tier = MILESTONES.filter((m) => x.total >= m).length;
    if (tier > x.tier) {
      x.tier = tier;
      api.notice(mn, "\u{1F300} Conditioning tier " + tier + ". You're a " + petName(mn) + " now, deeper every time.");
    }
    api.save();
  }
  function stop(mn, why) {
    waitingEchs.delete(mn);
    if (!running.has(mn)) return false;
    const run = running.get(mn);
    running.delete(mn);
    if (run.echs && api.echs) api.echs.wake(mn);
    if (run.lib) api.hypno(mn, { do: "wake", quiet: !why });
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
    const want = LEVELS2.includes(String(args[1] || "").toLowerCase()) ? String(args[1]).toLowerCase() : me(t).max;
    if (LEVELS2.indexOf(want) > LEVELS2.indexOf(me(t).max)) return c.reply(A.name(t) + " only allows " + LEVEL_NAME[me(t).max] + " sessions. That's their call.");
    const si = args.findIndex((a) => /^say$/i.test(a));
    const own = !self && si >= 0 ? args.slice(si + 1).join(" ").replace(/[()]/g, "").trim().slice(0, 160) : "";
    if (args.slice(1, si >= 0 ? si : void 0).some((a) => /^echs$/i.test(a))) {
      if (!A.echs) return c.reply("The farm's ECHS side isn't running, sugar.");
      const no = A.echs.ask(t, "conditioning");
      if (no) return c.reply("\u{1F300} Not through ECHS right now: " + no + ".");
      waitingEchs.set(t, { by: sender, level: want, own: own || null, at: Date.now() });
      return c.reply("\u{1F300} Reachin' for " + A.name(t) + " through their ECHS. When they go under, a " + LEVEL_NAME[want] + " session starts through it.");
    }
    const ss = args.findIndex((a) => /^session$/i.test(a));
    const session = ss >= 0 ? args.slice(ss + 1, si > ss ? si : void 0).join(" ").trim() : "";
    start(sender, t, want, own || null, false, { session });
    const run = running.get(t) || {};
    c.reply("\u{1F300} " + LEVEL_NAME[want] + " session started for " + A.name(t) + (run.plan ? " (" + run.plan + ")" : "") + ", about " + Math.max(1, Math.round(run.lib ? run.ms / 6e4 : (run.lines || []).length * 42 / 60)) + " minutes. ?hyp stop " + A.name(t) + " ends it.");
  }
  function cmdLevel(c) {
    const { sender, args, api: A } = c, v = String(args[0] || "").toLowerCase();
    if (!A.rec(sender)) return c.reply("That's just for folks on the books, sugar.");
    if (!LEVELS2.includes(v)) return c.reply("\u{1F300} You allow " + LEVEL_NAME[me(sender).max] + " sessions. ?depth fun, deep or nhl (No human left) sets the deepest you'll go.");
    me(sender).max = v;
    A.save();
    c.reply("\u{1F300} The deepest a session can take you is now " + LEVEL_NAME[v] + "." + (A.rec(sender).hypno ? "" : " (Sessions also need ?hypno on.)"));
  }
  var progressText = (mn) => {
    const x = me(mn), next = MILESTONES.find((m) => x.total < m);
    return "\u{1F300} Conditioning: tier " + x.tier + " (" + petName(mn) + ") \xB7 " + x.total + " sessions (fun " + x.sessions.fun + ", deep " + x.sessions.deep + ", nhl " + x.sessions.nhl + ")" + (next ? " \xB7 next tier at " + next : " \xB7 top tier") + " \xB7 allows " + LEVEL_NAME[x.max] + (pullOn(mn) ? " \xB7 the farm's pull " + Math.round(pullOf(mn).n) + "%" : "");
  };
  function companion(mn) {
    const r = api.rec(mn);
    if (!r) return null;
    const x = me(mn), next = MILESTONES.find((m) => x.total < m), cards = [], planted = Object.values(plantedOf(mn));
    cards.push({
      title: "Conditioning",
      text: r.hypno ? void 0 : "Sessions need ?hypno on (in your Toggles).",
      lines: [
        ["Tier", x.tier + " \xB7 " + petName(mn)],
        ["Sessions", x.total],
        ["Deepest allowed", LEVEL_NAME[x.max]],
        ["Down low", lowOf(mn) === "fours" ? "on all fours" : "kneelin'"],
        ["Trance", lscgLine(mn)],
        ["Planted", planted.length ? planted.length + " trigger" + (planted.length === 1 ? "" : "s") : "none"]
      ],
      bars: [].concat(
        next ? [{ label: "To the next tier", value: x.total + " / " + next, pct: x.total / next * 100 }] : [],
        pullOn(mn) ? [{ label: "The farm's pull", value: Math.round(pullOf(mn).n) + "%", pct: pullOf(mn).n }] : []
      ),
      buttons: LEVELS2.map((l) => ({ label: "Allow " + LEVEL_NAME[l], cmd: "depth " + l, accent: l === x.max })).concat([{ label: "Kneel", cmd: "lowpose kneel", accent: lowOf(mn) === "kneel" }, { label: "All fours", cmd: "lowpose fours", accent: lowOf(mn) === "fours" }]).concat(planted.length ? [{ label: "What's planted", cmd: "planted" }] : []).concat(running.has(mn) ? [{ label: "Wake me up", cmd: "wake", accent: true }] : r.hypno ? [{ label: "Take me under", cmd: "hyp me" }, { label: "Ask my ECHS", cmd: "hypnotize me" }] : [])
    });
    if (api.isStaff(mn)) cards.push({
      staff: true,
      title: "Run a session",
      input: { placeholder: "Bessie deep", label: "Start (who, level)", cmd: "hyp" },
      note: "Only for your own herd (proprietors: anyone). Never deeper than they allow. Add: session <name> to pick one of the library's."
    });
    return { cards };
  }
  function lscgLine(mn) {
    const hs = api.hypnoState(mn);
    if (!hs) return "the farm's own (no word from your Companion yet)";
    if (!hs.lscg) return "the farm's own (no LSCG)";
    if (!hs.on) return "the farm's own (LSCG's hypnosis is off)";
    const need = [];
    if (!(hs.scopes || []).includes("states") || !(hs.scopes || []).includes("hypno")) need.push("let the farm in: LSCG settings \u2192 Extensions \u2192 B&B Farm, Hypnosis and States");
    if (!hs.sugg) need.push("tick Allow suggestions");
    return need.length ? "LSCG, once you " + need.join(", and ") : "LSCG's own, in the farm's name";
  }
  function cmdPlanted(c) {
    const { sender, args, api: A } = c, verb = String(args[0] || "").toLowerCase();
    if (verb === "remove" || verb === "clear") {
      let rest = args.slice(1), t2 = sender;
      if (rest.length > 1) {
        const who = A.find(rest[rest.length - 1]);
        if (who && who !== sender && A.rec(who)) {
          t2 = who;
          rest = rest.slice(0, -1);
        }
      }
      if (t2 !== sender && !(A.isProprietor(sender) || A.herdLeaderOf(t2) === sender)) return c.reply("Only their herd leader or a proprietor takes out what's planted in " + A.name(t2) + ", sugar.");
      const all = plantedOf(t2), name = verb === "clear" ? "all" : rest.join(" ").trim().toLowerCase().replace(/^b&b\s+/, "");
      const found = Object.keys(all).filter((id) => name === "all" || all[id].block.toLowerCase() === name || all[id].s.trigger && all[id].s.trigger.toLowerCase() === name);
      if (!found.length) return c.reply("\u{1F300} Nothin' planted by that name. ?planted" + (t2 === sender ? "" : " " + A.name(t2)) + " shows the list.");
      const locked = t2 === sender && !A.isProprietor(sender) ? found.filter((id) => all[id].perm) : [];
      const hit = found.filter((id) => !locked.includes(id));
      if (!hit.length) return c.reply("\u{1F300} " + (locked.length === 1 ? "That one's" : "Those are") + " set for good, sugar. Only your herd leader or a proprietor takes " + (locked.length === 1 ? "it" : "them") + " out. (?hypno off rests everything the farm planted in you.)");
      const lscgOnes = hit.filter((id) => all[id].via === "lscg" && all[id].ok).map((id) => all[id].s.name);
      for (const id of hit) {
        if (all[id].via === "lscg" && all[id].ok) (me(t2).unplant = me(t2).unplant || []).push(all[id].s);
        delete all[id];
      }
      A.save();
      sendFarm(t2);
      c.reply("\u{1F300} Taken out: " + hit.length + "." + (locked.length ? " (" + locked.length + " set for good stay" + (locked.length === 1 ? "s" : "") + ": only your herd leader or a proprietor takes those out.)" : "") + (lscgOnes.length ? " The farm takes " + (lscgOnes.length === 1 ? "the LSCG copy" : "the LSCG copies") + " out the next time " + (t2 === sender ? "you're" : A.name(t2) + " is") + " under in its name, or " + (t2 === sender ? "you can now" : "they can now") + " with LSCG's own: " + lscgOnes.map((n) => "/lscg remove-suggestion " + n).join(" \xB7 ") + "." : ""));
      if (t2 !== sender) A.notice(t2, "\u{1F300} " + A.name(sender) + " took out " + hit.length + " of the farm's triggers in you." + (lscgOnes.length ? " Your LSCG still has " + (lscgOnes.length === 1 ? "one" : lscgOnes.length) + " till the farm takes it out next session, or now: /lscg remove-suggestion " + lscgOnes.join(" \xB7 ") : ""));
      return;
    }
    const t = args[0] ? A.find(args.join(" ")) : sender;
    if (!t || !A.rec(t)) return c.reply("Whose, sugar? ?planted [who]");
    if (t !== sender && !(A.isProprietor(sender) || A.herdLeaderOf(t) === sender || A.isStaff(sender))) return c.reply("Only staff look at what's planted in somebody else, hon.");
    c.reply(plantedText(t, t === sender));
  }
  connect({
    name: "conditioning",
    label: "Conditioning",
    version: "2.5.0",
    // (its addon.json's, put in by the build)
    guide: "Guided trance sessions in the farm's voice, put together from the farm's trance library (inductions, deepeners, suggestions, triggers, wakes). Needs ?hypno on; ?depth fun|deep|nhl sets the deepest you allow. Your herd leader runs them with ?hyp <who> [level] [session <name>] [say <their own words>], or take yourself under with ?hyp me. With LSCG (its hypnosis on, and the farm let in under LSCG settings \u2192 Extensions \u2192 B&B Farm): you go under LSCG's own trance in the farm's name, its beats play if you turned them on, and a session's triggers go into your LSCG as its own suggestions (tick Allow suggestions). Without LSCG, the farm's own trance and triggers. ?lowpose kneel|fours picks the pose a trigger puts you in. ?planted shows what the farm planted; ?planted remove <name> takes one out. With ECHS: ?hypnotize me (or ?hyp <who> [level] echs). Sessions count toward conditioning tiers (3, 7, 15, 30). ?wake or ?safe ends one at once. The farm's pull: with ?hypno on and the Companion, it builds through the day (a haze, a whisper, a blurred line); triggers, sessions and milkin's feed it, time away drains it. From 60 your words start slippin', and at 100 you drop under and the farm takes you down. Your Companion's trance settings switch it, and the slippin', off. LSCG's suggestion editor gets the farm's own instructions too (make your sound, go to a free milkin' stall, beg to be milked).",
    setup(a) {
      api = a;
      D();
      const tick = () => {
        pull(false).catch(() => {
        });
        api.later(tick, 6e4);
      };
      api.later(tick, 15e3);
      const ptick = () => {
        try {
          pullTick();
        } catch (e) {
          api.log("pull: " + (e && e.message || e));
        }
        api.later(ptick, 6e4);
      };
      api.later(ptick, 2e4);
    },
    commands: {
      planted: { usage: "planted [who] | planted remove <name|all> [who]", private: true, run: cmdPlanted },
      lowpose: { usage: "lowpose kneel|fours", aliases: ["low"], private: true, run: (c) => {
        const v = String(c.args[0] || "").toLowerCase(), A = c.api;
        if (!A.rec(c.sender)) return c.reply("That's just for folks on the books, sugar.");
        if (!/^(kneel|kneeling|knees|fours|allfours|all)$/.test(v)) return c.reply("\u{1F300} When a trigger puts you down low, you go " + (lowOf(c.sender) === "fours" ? "on all fours" : "to your knees") + ". ?lowpose kneel or ?lowpose fours, whichever's comfier.");
        me(c.sender).low = /^(fours|allfours|all)$/.test(v) ? "fours" : "kneel";
        A.save();
        sendPull(c.sender);
        c.reply("\u{1F300} Down low means " + (lowOf(c.sender) === "fours" ? "on all fours" : "on your knees") + " for you now. Triggers planted from here on use it" + (Object.keys(plantedOf(c.sender)).length ? " (ones already planted keep theirs till the next session plants them again)" : "") + ".");
      } },
      trancelib: { usage: "trancelib [pull|starter]", private: true, run: async (c) => {
        if (!c.api.isProprietor(c.sender)) return c.reply("That's the proprietors', sugar.");
        const v = String(c.args[0] || "").toLowerCase();
        if (v === "starter") {
          setLib(null);
          return c.reply("\u{1F300} Back to the starter library.\n" + libText());
        }
        if (v === "pull") {
          const r = await pull(true);
          return c.reply(r && r.got ? "\u{1F300} Pulled from the studio.\n" + libText() : r && r.none ? "\u{1F300} The studio's open, but nothin's been pushed yet." : "\u{1F300} Couldn't reach the studio on this PC (" + (r && r.fail || "?") + "). It needs to be running: Start the studio.bat.");
        }
        c.reply(libText());
      } },
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
      safe: (mn) => {
        stop(mn, null);
        api.hypno(mn, { do: "clear" });
        const p = pullOf(mn);
        p.n = 0;
        p.at = Date.now();
        api.save();
        sendPull(mn);
      },
      leave: (mn) => {
        stop(mn, null);
        told.delete(mn);
      },
      hypnoSwitch: (mn, on) => {
        if (!on) {
          stop(mn, null);
          const p = pullOf(mn);
          p.n = 0;
          p.at = Date.now();
          api.save();
        }
        sendPull(mn, true);
        if (Object.keys(plantedOf(mn)).length) sendFarm(mn);
      },
      // a milkin' (the stall's, or staff's ?milk) feeds the pull; the farm's "go to a free stall" instruction lands here
      milked: (mn) => pullAdd(mn, PULL.MILKED),
      // the farm's visor (the Companion's visor.js): a crafter's tuning kept here (any wearer on the farm can have it, the code
      // proves it's the one), handed to a wearer who asks, and a finished visor session counted
      visor: (mn, d) => {
        const all = D().visors = D().visors || {};
        if (d.do === "keep") {
          if (!codeOk(d.code, d.t)) return;
          all[d.code] = { t: normTuning(d.t), by: mn, at: Date.now() };
          const k = Object.keys(all).sort((a, b) => all[a].at - all[b].at);
          for (const x of k.slice(0, Math.max(0, k.length - 300))) delete all[x];
          api.save();
          return;
        }
        if (d.do === "ask") {
          const x = all[d.code];
          if (x) api.hypno(mn, { do: "visor", code: d.code, t: x.t });
          return;
        }
        if (d.do === "done" && api.rec(mn)) visorDone(mn, d.level);
      },
      hypnoDo: (mn, d) => {
        if (d && d.what === "stall") toStall(mn);
      },
      // part 3: farm moments a compulsion can answer to
      join: (mn) => {
        for (const m of herdOf(mn)) compel(m, "leader", mn);
      },
      // their herd leader walks in
      roleplay: (mn, text, type) => {
        if (type === "Chat" && !/^\s*\(/.test(String(text))) for (const m of herdOf(mn)) compel(m, "leader talks", mn);
      },
      stall: (mn) => compel(mn, "stall"),
      fed: (mn) => compel(mn, "fed"),
      climax: (mn, content) => {
        if (/^Orgasm\d/.test(String(content || ""))) compel(mn, "cum");
      },
      activity: (data) => {
        const a = api.activityInfo ? api.activityInfo(data) : null;
        if (!a || !a.tgt || a.src === a.tgt) return;
        if (a.focus === "ItemHead" && /^(Pet|Pat|Caress|Stroke|Ruffle)/i.test(a.act)) compel(a.tgt, "pat", a.src);
        else if (a.focus === "ItemBreast" && /^(Grope|Squeeze|Pinch|Caress|Fondle|MassageHands|Massage)/i.test(a.act)) compel(a.tgt, "squeeze", a.src);
      },
      // their Companion on their LSCG (trance.js): anything waitin' to be planted goes in when it can; LSCG come or gone,
      // the triggers move with it (the farm's own carried out by their Companion, LSCG's own by their LSCG)
      hypnoState: (mn, hs) => {
        if (!told.has(mn) && api.rec(mn)) sendPull(mn, true);
        const all = plantedOf(mn), list2 = Object.values(all);
        if (!list2.length) return;
        if (lscgOn(hs)) {
          const moved = list2.filter((x) => x.via === "farm" && !isComp(x));
          for (const x of moved) {
            x.via = "lscg";
            x.ok = false;
          }
          if (moved.length) {
            api.save();
            sendFarm(mn);
          }
          if (hs.planted && hs.planted.length) {
            for (const x of list2) if (x.via === "lscg" && hs.planted.includes(x.s.id)) x.ok = true;
          }
          plantLscg(mn, true);
        } else {
          const moved = list2.filter((x) => x.via === "lscg");
          for (const x of moved) {
            x.via = "farm";
            x.ok = false;
          }
          if (moved.length) api.save();
          sendFarm(mn);
        }
      },
      hypnoEvent: (mn, e) => {
        const run = running.get(mn), all = plantedOf(mn);
        if (e.ev === "checked") {
          for (const id of e.ids) if (all[id]) all[id].ok = e.found.includes(id);
          api.save();
          const missed = e.ids.filter((id) => all[id] && !all[id].ok);
          if (missed.length) api.log("LSCG didn't take " + missed.join(", ") + " for " + mn + " (their item permission, or they weren't under in the farm's name)");
          return;
        }
        if (e.ev === "safeword") {
          stop(mn, null);
          return;
        }
        if (e.ev === "awake" && run && run.lib && !run.waking && e.method && e.method !== "farm") {
          stop(mn, null);
          api.notice(mn, "\u{1F300} You came up out of it" + (e.method === "snap" ? " at a snap of fingers" : e.method === "boop" ? " with a boop" : e.method === "word" ? " at your wake word" : e.method === "timeout" ? " when LSCG's trance time ran out" : "") + ", so that session's over. ?hyp me takes you back down.");
          if (run.by !== mn) api.notice(run.by, "\u{1F300} " + api.name(mn) + " came up out of the session early.");
          return;
        }
        if (e.ev === "resolved" || e.ev === "fired") {
          const x = all[e.id] || Object.values(all).find((y) => y.s.name === e.name);
          if (x) {
            x.fired = (x.fired || 0) + 1;
            if (e.resisted) x.fought = (x.fought || 0) + 1;
            x.last = Date.now();
            if (!e.resisted) landed(mn, x);
            api.save();
          }
          if (!e.resisted) pullAdd(mn, PULL.TRIGGER);
        }
      },
      // under with the farm girl through ECHS: the session runs through it (asked for with ?hyp … echs, or not)
      echsUnder: (mn, info) => {
        const r = api.rec(mn);
        if (!r || !r.hypno) return;
        api.echs.take(mn);
        if (running.has(mn)) {
          running.get(mn).echs = true;
          api.echs.take(mn, running.get(mn).level);
          return;
        }
        const w = waitingEchs.get(mn);
        waitingEchs.delete(mn);
        const by = w && w.by || info && info.by || mn;
        start(by, mn, w ? w.level : me(mn).max, w ? w.own : null, true);
        if (running.has(mn)) api.echs.take(mn, running.get(mn).level);
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
