// ==UserScript==
// @name         BnB Farm add-on: Breeding
// @namespace    bnbfarm
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-breeding.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-breeding.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Pregnancy stages with belly size 1-5, cravings, kicks, midwives, staff-only stud bookings and breeding season (15th-21st): heat, pent-up studs, a nightly stud book and a crown for the most-bred. Runs on the farm bot's computer, next to the Farmhand Bot script.
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
  var fill = (text, vars2) => String(text).replace(/%(\w+)%/g, (m, k) => vars2[k] !== void 0 ? vars2[k] : m);
  var TAG_ANY = /\{(?:nv|nc|nt|fu|fb|nb|ok|v|c|t|f|m)\}/g;
  var TAG_LEAD = /^((?:\{(?:nv|nc|nt|fu|fb|nb|v|c|t|f|m)\})+)/;
  var VULVA_W = /\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i;
  var TITS_W = /\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i;
  var GIRL_W = /\b(girl|heifer|mare|broodmare)\b/i;
  var untag = (t) => String(t == null ? "" : t).replace(TAG_ANY, "");
  var bodyOf = (api4, mn) => {
    try {
      return api4 && api4.body && mn ? api4.body(mn) : null;
    } catch (e) {
      return null;
    }
  };
  var gearOf = (api4, mn) => {
    try {
      return api4 && api4.gear && mn && api4.gear(mn) || {};
    } catch (e) {
      return {};
    }
  };
  function fits(line2, b) {
    const s = String(line2), m = s.match(TAG_LEAD);
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
  function lineFor(api4, mn, list, key) {
    if (!Array.isArray(list) || !list.length) return "";
    const b = bodyOf(api4, mn);
    let t;
    try {
      t = key && api4 && api4.pickFor && api4.tags >= 2 ? untag(api4.pickFor(mn, key, list)) : pickFit(list, b);
    } catch (e) {
      t = pickFit(list, b);
    }
    return api4 && api4.fit && api4.tags >= 2 ? api4.fit(mn, t) : t;
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
    dragon: { f: "dragoness", m: "drake", young: ["hatchling", "hatchlings"], call: "growl", sound: ["a low, rumbling growl", "a hot, hissing breath", "a ragged little rawr"] },
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
  function animalOf(api4, mn) {
    let k = "default";
    try {
      k = api4 && api4.species && api4.species(mn) || "default";
    } catch (e) {
    }
    const w = ANIMALS[k] || ANIMALS.default, b = bodyOf(api4, mn), male = !!(b && (b.g === "male" || b.g === "femboy"));
    return { key: ANIMALS[k] ? k : "default", kin: KIN[k] || null, a: male ? w.m : w.f, young: w.young, call: w.call, sound: pick(w.sound), sounds: w.sound, male };
  }

  // addons/breeding/more-lines.js
  var MORE = {
    CRAVINGS: [
      "You'd kill for a mouthful of somebody's cum right now, %name%. Warm, salty, straight from the source.",
      "{v}Your belly's growlin' and your pussy's achin' and you honestly can't tell which hunger's louder, %name%.",
      "{t}You want your swollen breasts sucked, %name%. Hard. You want the pressure gone and a mouth on you.",
      "Pickles and cream. Together. Don't ask, %name%. Just go find some.",
      "You're cravin' to be bred again, %name%, even though you're already full of %litter%. Greedy thing.",
      "Somethin' about the smell of hay has you droolin', %name%. Pregnant brain is a hell of a thing.",
      "You keep thinkin' about bein' milked, %name%. Long and slow, till you're soft and empty."
    ],
    KICKS: [
      "%name%'s round belly ripples, then bulges hard on one side as somethin' inside stretches out.",
      "%name% gasps and grabs a rail. That one landed somewhere low and sensitive, and their thighs press together.",
      "Two little kicks at once on %name%'s tight belly, like there's an argument goin' on in there.",
      "%name%'s belly button pops out a little further as somethin' inside shoves for room.",
      "A kick hard enough to make %name% leak a spurt of milk from both nipples. They flush bright pink.",
      "%name% rubs slow circles on their belly and murmurs somethin' soft. The kickin' only gets wilder."
    ],
    MIDWIFE: [
      `{v}%by% kneels between %name%'s spread thighs, slick to the wrists, coaxin' and coaxin'. "That's it. Push for me, mama."`,
      "{t}%by% strokes %name%'s swollen breasts to bring the milk down and get things movin', murmurin' low and steady.",
      "%by% holds %name%'s hand and lets them squeeze as hard as they need, never lookin' away."
    ],
    RUTTY: [
      "%name% catches the scent of heat and their cock stiffens so fast it aches. They take a step toward it without meanin' to.",
      "Somewhere close by, somebody's in heat. %name% can smell it, taste it, and their balls draw up tight.",
      "%name% groans low in their chest. Every breath tastes like somebody ripe and ready, and they're leakin' already.",
      "%name%'s cock throbs against their belly. They'd mount the first thing that smelled like that.",
      "%name%'s nostrils flare and their hips give a helpless little thrust at the air. Rut's got 'em."
    ],
    STAGE_ROOM: {
      showing: [
        "%name%'s belly has a soft, proud curve to it now. Bred, and anybody can see it.",
        "There's no hidin' it anymore: %name% is showin', belly rounded where the seed took root."
      ],
      heavy: [
        "{t}%name% waddles now, belly huge and tight and heavy, breasts swollen and leakin' for %litter% to come.",
        "%name%'s belly's so big it sways when they walk, skin shiny-taut, and they have to lean back to balance it."
      ],
      nesting: [
        "%name% keeps draggin' straw into a corner and lowerin' themselves into it, pantin', belly tight and low.",
        "%name% can't settle. They pace, nest, pace again, belly hangin' low, every few minutes a groan."
      ]
    },
    BRED_MARKS: {
      3: ["Three breedin's in and %name%'s still bein' passed around the stand. The farm girl marks it on the board."],
      5: ["{v}Five. %name%'s pussy hasn't been empty all season, and it shows."],
      10: ["{f}Ten breedin's. %name% is the farm's busiest broodmare this season, and the barn knows it."]
    }
  };

  // addons/breeding/more-lines-2.js
  var MORE2 = {
    STAGE_YOU: {
      showing: [
        "\u{1F930} Your belly's rounder this mornin', %name%, and your clothes know it before you do.",
        "\u{1F930} There's a little swell under your hand when you rub your belly now, %name%. Somethin' took.",
        "\u{1F930} You're showin', %name%. Folks are goin' to start pattin' your belly without askin'.",
        "\u{1F930} Your belly's gone soft and round and proud, %name%. Everybody can see what got put in you."
      ],
      heavy: [
        "\u{1F930} You're heavy now, %name%. Gettin' up takes two tries, and your belly gets there first.",
        "\u{1F930} You feel %litter% kick when you lie down and kick again when you stand up, %name%. You're big as a barrel.",
        "\u{1F930} Your belly's tight as a drum, %name%, and you walk with your hands on your back to hold it up.",
        "\u{1F930} You're carryin' heavy, %name%. Every step you feel %litter% shift and settle."
      ],
      nesting: [
        "\u{1F930} You can't sit still, %name%. You want straw, and a corner, and somebody to stroke your back.",
        "\u{1F930} Your belly's dropped low, %name%. It won't be long now, and every bit of you knows it.",
        "\u{1F930} You keep fussin' with the straw, %name%, pushin' it into a nest without meanin' to.",
        "\u{1F930} Everything aches and everything's ready, %name%. Find your nest, sugar."
      ]
    },
    STAGE_ROOM: {
      showing: [
        "%name% has a round little belly now, and keeps restin' a hand on it when they think nobody's lookin'.",
        "The curve of %name%'s belly has gone from maybe to certainly. They're carryin'.",
        "{t}%name%'s belly has started to swell, and their tits have gone fuller with it.",
        "%name% turns sideways in the light, and there it is: bred and showin'."
      ],
      heavy: [
        "%name% lowers themselves onto a hay bale with a grunt, belly first, heavy as a harvest.",
        "%name%'s belly is huge and high, and it rolls now and then as somethin' inside shifts.",
        "{t}%name%'s tits are heavy and full to match their belly, and they leak a little when they stretch.",
        "%name% waddles across the barn, one hand on their back and their belly leadin' the way."
      ],
      nesting: [
        "%name% has made a nest of straw in the corner and keeps fluffin' it, pantin' between goes.",
        "%name% circles and circles before lyin' down, belly low and tight, makin' little grunts.",
        "%name% is restless as any %a% about to drop, pacin' and nestin' and pacin' again.",
        "%name% can't settle. They lie down, get up, scratch at the straw, lie down. It's nearly time."
      ]
    },
    CRAVINGS: [
      "You want somethin' cold and somethin' sweet, %name%, and you want it right now.",
      "You keep thinkin' about warm milk, a whole pail of it, %name%.",
      "You'd let anybody rub your belly right now, %name%, and you'd purr for it.",
      "{v}Your pussy's swollen and achin' and wantin' attention, %name%. Bein' bred does that.",
      "{c}You're hard more often than not, %name%, and it isn't helpin' your temper.",
      "{t}Your tits ache, %name%. You want somebody's mouth on them, drinkin' the ache away.",
      "{t}Your nipples are so sore your top hurts, %name%. You'd rather go without.",
      "You're hungry, %name%. Not peckish: hungry, like you could eat a whole trough.",
      "Salt. You want salt, %name%. Lick it off somebody if you have to.",
      "You want to be filled again, %name%, even though you're already full of %litter%. Greedy %a%.",
      "You'd give a ribbon for a nap in warm straw with somebody's arms round you, %name%.",
      "You're eatin' for %eatin%, %name%, and your belly won't let you forget it."
    ],
    KICKS: [
      "Somethin' inside %name% kicks hard enough to make the hand on their belly jump.",
      "%name% stops mid-step, both hands on their belly, while whatever's in there has a good long wriggle.",
      "A little bump pushes out of %name%'s belly, round as a knee, and slides away again.",
      "%name% laughs and winces at once. That one got them right under the ribs.",
      "%name%'s belly rolls like a sack of kittens, and they sit down quick.",
      "Anybody watchin' %name% sees their belly twitch and bulge, and %name% sighs and rubs it.",
      "%name% gasps. That kick landed low, and their knees go a bit weak.",
      "{t}A hard kick, and %name% leaks a little from both nipples. They flush and pretend nobody saw."
    ],
    MIDWIFE: [
      "%by% kneels in the straw with %name%, a hand low on their belly, breathin' with them through the next wave.",
      `%by% rubs slow circles into the small of %name%'s back and murmurs, "That's it. Nearly. Nearly."`,
      "%by% wipes %name%'s face with a cool cloth and holds their hand through it.",
      `{v}%by% checks between %name%'s thighs and grins. "Not long now, sweet thing. I can see the way it's goin'."`,
      "{nv}%by% presses on %name%'s belly with both palms, gentle and firm, and talks them through it.",
      "%by% props %name% up on a hay bale and stays right beside them, steady as a fence post."
    ],
    RUTTY: [
      "%name%'s head comes up and their nostrils flare. Somebody near here is in heat, and %name% knows it in their balls.",
      "%name% shifts on their feet, cock thickenin', breathin' in that heavy, sweet smell.",
      "The heat-smell hits %name% and their whole body goes tight and restless.",
      "%name% swallows hard. Somebody close by is ripe, and every bit of them wants to mount.",
      "%name%'s cock throbs and leaks. They'd follow that smell anywhere.",
      "%name% paces, snortin', unable to settle with that smell on the air."
    ],
    BRED_MARKS: {
      3: [
        "%name%'s third breedin' this season goes on the board in red chalk. The farm girl underlines it.",
        "Three. %name% gets a ribbon on their gate and a wink from the farm girl."
      ],
      5: [
        "Five times bred. %name%'s gate is lookin' festive, all ribbons.",
        "The farm girl rings the barn bell once for %name%'s fifth breedin'. It's tradition now."
      ],
      10: [
        "Ten breedin's this season. The farm girl climbs a ladder to add %name%'s chalk mark, there's no room left lower down.",
        "Ten. Folks stop by %name%'s gate just to count the ribbons."
      ]
    },
    CALL_STUD: [
      "\u{1F525} %name% is in heat %where% and can't keep still. They're askin' for a stud, sugar, and you're on the list.",
      "\u{1F525} A heat call: %name%, %where%, rump up and achin' with it. You signed up for this.",
      "\u{1F525} %name% is ripe and in heat %where%. Go see to them before somebody else does.",
      "\u{1F525} %name%'s in season %where%, and their call's gone out to every stud on the farm. Including you."
    ],
    CALLED: [
      "\u{1F525} The call's out to %n% stud%s% on the farm. Find somewhere soft and wait, sugar.",
      "\u{1F525} %n% stud%s% will be catchin' your scent about now. Stay where you are.",
      "\u{1F525} %n% stud%s% heard that. Get comfortable, sugar, and get presentin'."
    ],
    MATED: [
      "\u{1F49E} %a% and %b% bump foreheads and that's that: mates for the day. The farm girl chalks a heart on the barn door.",
      "\u{1F49E} %b% leans into %a%'s side and stays there. Mates till midnight.",
      "\u{1F49E} %a% and %b% are a pair today. Anybody tryin' to cut in gets a look.",
      "\u{1F49E} %a% nuzzles %b%'s neck, %b% nuzzles right back, and the whole barn knows they're mates today."
    ],
    CROWN: [
      "\u{1F451} The farm girl pins a big blue rosette on %name%: most bred of the season. Their belly's earned it.",
      "\u{1F451} %name% is crowned most bred of the season, and the farm girl hangs the blue rosette right where everybody can see it.",
      "\u{1F451} A blue rosette for %name%, most bred of the season, and a round of applause from the barn."
    ],
    CROWN_COLLAR: [
      "\u{1F451} The farm girl pins a big blue rosette on %name%'s collar: most bred of the season. Their belly's earned it.",
      "\u{1F451} A blue rosette goes on %name%'s collar, most bred of the season, and the farm girl gives it a proud little tug."
    ],
    BIRTH_MIDWIFE: [
      "\u{1F37C} %by% cleans the newborns and tucks them against %name%, every one of them healthy. Good work, midwife.",
      "\u{1F37C} %by% wraps the little ones in clean straw and settles them with %name%. Every one's breathin' fine.",
      "\u{1F37C} %by% sits back on their heels, grinnin', as %name% curls round the newborns. A good birth, and a good midwife.",
      "\u{1F37C} %by% counts them twice, smiles, and helps %name% get comfortable with them. All healthy."
    ],
    BOOKED_STUD: [
      "\u{1F402} You've been booked to breed %dam%, sugar. I'll tell you when you're both on the farm.",
      "\u{1F402} There's a bookin' with your name on it: %dam%. I'll let you know when they're here.",
      "\u{1F402} Staff booked you for %dam%. Save some for 'em, sugar. I'll tell you when it's time."
    ],
    BOOKED_DAM: [
      "\u{1F404} You've been booked with %stud%, sugar. I'll tell you when you're both on the farm.",
      "\u{1F404} %stud% is booked to breed you. I'll let you know when they're here, sugar.",
      "\u{1F404} Staff have booked you with %stud%. I'll come find you when it's time."
    ],
    TIME_STUD: [
      "\u{1F402} Your bookin' with %dam% is up, sugar. They're here. Head for the breedin' stand.",
      "\u{1F402} %dam% is on the farm, and so are you. That bookin' won't keep itself, sugar.",
      "\u{1F402} It's time: %dam% is here for your bookin'. The stand's waitin'."
    ],
    TIME_DAM: [
      "\u{1F404} %stud% is here for your bookin', sugar. Head for the breedin' stand.",
      "\u{1F404} %stud%'s on the farm. Time to go get bred, sugar.",
      "\u{1F404} Your stud's arrived: %stud%. The stand's waitin' for you both."
    ]
  };

  // addons/breeding/pairs.js
  var api = null;
  var D = null;
  function pairsSetup(a, data) {
    api = a;
    D = data;
  }
  var P = () => {
    const d = D();
    d.pairs = d.pairs || { studs: {}, called: {}, day: "", mates: {}, paid: {} };
    const p = d.pairs;
    if (p.day !== api.dayKey()) {
      p.day = api.dayKey();
      p.mates = {};
      p.paid = {};
    }
    p.studs = p.studs || {};
    p.called = p.called || {};
    return p;
  };
  var onBooks = (mn) => {
    const r = api.rec(mn);
    return !!(r && r.roles && r.roles.length);
  };
  var whereIs = (mn) => {
    const z = api.zonesOf(mn)[0];
    const q = api.pos(mn);
    return z ? "in " + z.name.replace(/-/g, " ") : q ? "at " + q.X + "," + q.Y : "on the farm";
  };
  var CALL_STUD = [
    "\u{1F525} %name% is in heat %where% and callin' for a stud. Tail up, achin' for it. Go on, sugar.",
    "\u{1F525} Somebody needs breedin': %name%, %where%, in heat and askin' for you studs by name. First one there gets 'em.",
    "\u{1F525} %name%'s in season %where% and beggin' for a cock. You signed up for stud calls, so here's one."
  ];
  var CALLED = [
    "\u{1F525} You lift your tail and call. %n% stud%s% heard you. Stay put and present, sugar.",
    "\u{1F525} The call's gone out to %n% stud%s% on the farm. Somebody'll be along to see to you."
  ];
  var MATED_ = [
    "\u{1F49E} %a% and %b% rub noses and it's settled: mates for the day. Anybody watchin' can guess what comes next.",
    "\u{1F49E} %a% nuzzles up under %b%'s chin and gets nuzzled right back. Mates till midnight, those two.",
    "\u{1F49E} %b% says yes. %a% and %b% are a pair today, flank to flank, and the farm girl chalks their names side by side on the barn door."
  ];
  CALL_STUD.push(...MORE2.CALL_STUD);
  CALLED.push(...MORE2.CALLED);
  var MATED = MATED_.concat(MORE2.MATED);
  function cmdStudcall(c) {
    const { sender, args, api: A } = c, p = P(), w = String(args[0] || "").toLowerCase();
    if (!onBooks(sender)) return c.reply("That's for folks on the farm's books, sugar.");
    if (w !== "on" && w !== "off") return c.reply("\u{1F402} Stud calls are " + (p.studs[sender] ? "ON" : "off") + " for you. ?studcall on and I'll tell you when somebody in heat calls for a stud; ?studcall off to stop.");
    if (w === "on") p.studs[sender] = true;
    else delete p.studs[sender];
    A.save();
    c.reply(w === "on" ? "\u{1F402} Stud calls ON. When somebody in heat says ?callstud, I'll tell you where they are." + (A.makesSemen(sender) ? "" : " (You'll need a cock for it to be much use, sugar.)") : "\u{1F402} Stud calls off.");
  }
  function cmdCallstud(c) {
    const { sender, api: A } = c, p = P(), pr = A.prod(sender), r = A.rec(sender);
    if (!onBooks(sender) || !pr) return c.reply("That's for stock on the farm's books, sugar.");
    if (!r.breedable) return c.reply("You'd need ?breedable on before callin' a stud, sugar.");
    if (!A.inHeat(pr)) return c.reply("You're not in heat, sugar. A stud call's for when you're achin' for it.");
    if (!A.onMap(sender)) return c.reply("You've got to be here on the farm to be found, sugar.");
    if (Date.now() - (p.called[sender] || 0) < 20 * 6e4) return c.reply("You called not long ago, sugar. Give the studs a chance to get to you.");
    const studs = A.here().filter((m) => m !== sender && p.studs[m] && A.makesSemen(m) && A.onMap(m));
    if (!studs.length) return c.reply("No stud on the farm is takin' calls right now, sugar. (Studs sign up with ?studcall on.)");
    p.called[sender] = Date.now();
    A.save();
    const line2 = fill(lineFor(A, sender, CALL_STUD, "call"), { name: A.name(sender), where: whereIs(sender) });
    for (const m of studs) A.notice(m, line2);
    c.reply(fill(pick(CALLED), { n: studs.length, s: studs.length === 1 ? "" : "s" }));
  }
  function cmdMate(c) {
    const { sender, args, api: A } = c, p = P(), N = A.name, w = String(args[0] || "").toLowerCase();
    if (!onBooks(sender)) return c.reply("That's for folks on the farm's books, sugar.");
    if (!w) return c.reply(p.mates[sender] ? "\u{1F49E} Your mate today is " + N(p.mates[sender]) + ". Breedin' each other is likelier to take, and the first time pays you both a ribbon. ?mate off ends it." : "\u{1F49E} You've no mate today, sugar. ?mate <who> asks them. Mates last till midnight: breedin' your mate is likelier to take, and the first time pays you both a ribbon.");
    if (w === "off") {
      const m = p.mates[sender];
      if (!m) return c.reply("You've no mate to part from, sugar.");
      delete p.mates[sender];
      delete p.mates[m];
      A.save();
      A.notice(m, "\u{1F494} " + N(sender) + " has wandered off. You're not mates any more today, sugar.");
      return c.reply("\u{1F494} You and " + N(m) + " aren't mates any more today.");
    }
    const t = A.find(args[0]);
    if (!t || !onBooks(t) || t === sender) return c.reply("Who, sugar? ?mate <who>, somebody on the farm's books.");
    if (p.mates[sender]) return c.reply("You've already got a mate today: " + N(p.mates[sender]) + ". ?mate off first, if you must.");
    if (p.mates[t]) return c.reply(N(t) + " is already somebody's mate today, sugar.");
    if (!A.onMap(sender) || !A.onMap(t)) return c.reply("You both need to be here on the farm, sugar.");
    A.ask(t, "\u{1F49E} " + N(sender) + " wants to be your mate for the day, sugar: breedin' each other is likelier to take, and the first time pays you both a ribbon. Say yes or no.", (yes) => {
      const q = P();
      if (!yes) return A.notice(sender, N(t) + " said no to bein' your mate today, sugar.");
      if (q.mates[sender] || q.mates[t]) return A.notice(sender, "Too late, sugar: one of you paired off with somebody else.");
      q.mates[sender] = t;
      q.mates[t] = sender;
      A.save();
      A.emote(fill(pick(MATED), { a: N(sender), b: N(t) }), sender);
    });
    c.reply("\u{1F49E} I've asked " + N(t) + ".");
  }
  function pairsBred(stud, dam, hole, mlIn, took) {
    if (!(stud > 0) || !(mlIn > 0)) return;
    const p = P();
    if (p.mates[stud] !== dam) return;
    if (!took && (hole === "vulva" || hole === "butt") && api.rollConception) {
      const again = api.rollConception(dam, stud, mlIn, 1, hole);
      if (again) api.later(() => api.emote("\u{1F49E} Mates catch easier: a moment later somethin' settles deep in " + api.name(dam) + ". " + api.name(stud) + "'s seed took after all.", dam), 9e3);
    }
    const key = stud < dam ? stud + ":" + dam : dam + ":" + stud;
    if (!p.paid[key]) {
      p.paid[key] = true;
      api.save();
      if (api.ribbons) {
        api.ribbons(stud, 1, "breedin' your mate");
        api.ribbons(dam, 1, "bein' bred by your mate");
      }
    }
  }
  var pairsCommands = {
    studcall: { usage: "studcall on|off", private: true, run: cmdStudcall },
    callstud: { usage: "callstud", private: true, run: cmdCallstud },
    mate: { usage: "mate <who>", private: true, run: cmdMate }
  };
  function pairsCards(mn) {
    const p = P(), out = [];
    out.push({
      title: "\u{1F49E} Mates and stud calls",
      lines: [["Mate today", p.mates[mn] ? api.name(p.mates[mn]) : "nobody"]],
      toggles: [{ label: "Take stud calls", desc: "When somebody in heat says ?callstud, you're told where they are", on: !!p.studs[mn], cmd: "studcall " + (p.studs[mn] ? "off" : "on") }],
      buttons: [{ label: "Call a stud (in heat)", cmd: "callstud" }],
      input: { placeholder: "Bessie", label: "Ask to be mates", cmd: "mate" }
    });
    return out;
  }
  var PAIRS_GUIDE = " Studs: ?studcall on to be told when somebody in heat says ?callstud. Mates for the day: ?mate <who> (breedin' your mate is likelier to take, and pays you both a ribbon).";

  // addons/breeding/midwife.js
  var api2 = null;
  var D2 = null;
  var POOLS = { claim: [], born: [] };
  function midwifeSetup(a, data, pools) {
    api2 = a;
    D2 = data;
    POOLS = Object.assign(POOLS, pools || {});
  }
  var HELP_GAP_MIN = 3;
  var AFTER_MIN = 60;
  var M = () => {
    const d = D2();
    d.mw = d.mw || {};
    for (const k of ["trusted", "noCheck", "checked", "paid", "helpAt", "born", "labour"]) d.mw[k] = d.mw[k] || {};
    return d.mw;
  };
  var canMidwife = (mn) => !!(mn && (api2.rank(mn) >= 1 || M().trusted[mn]));
  var near = (a, b) => {
    const p = api2.pos(a), q = api2.pos(b);
    return !!(p && q && Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y)) <= 1);
  };
  var along = (p) => p && p.preg ? Math.min(1, Math.max(0, (Date.now() - p.preg.since) / Math.max(1, p.preg.due - p.preg.since))) : null;
  var stageKey = (f) => f < 0.33 ? "early" : f < 0.66 ? "showing" : f < 0.9 ? "heavy" : "nesting";
  var STAGE_WORD = { early: "early days", showing: "showin'", heavy: "heavy with it", nesting: "nestin'" };
  function vars(mn, by, extra) {
    const an = animalOf(api2, mn), L = api2.labour, y = L && L.young ? L.young(mn) : an.young, p = api2.prod(mn), n = p && p.preg && p.preg.count || 1;
    return Object.assign({
      name: api2.name(mn),
      by: by ? api2.name(by) : "",
      young: y[0],
      youngs: y[1],
      brood: n > 1 ? y[1] : y[0],
      place: L && L.place ? L.place(mn) : "the birthin' straw",
      sound: L && L.sound ? L.sound(mn) : an.sound
    }, extra || {});
  }
  var line = (mn, pool, key, by, extra) => fill(lineFor(api2, mn, pool, "mw:" + key), vars(mn, by, extra));
  var CHECKUP = [
    "%by% kneels beside %name% and lays both hands flat on their belly, feelin' slow and careful for the %brood%.",
    "%by% presses an ear to %name%'s swollen belly, listenin', one hand rubbin' slow circles.",
    "%by% runs practiced hands over %name%'s belly, pressin' here and there, judgin' how high they're carryin'.",
    "%by% has %name% lie back in the straw and feels along their belly from top to bottom, hummin' to themselves.",
    "%by% cups the underside of %name%'s belly and gives it a gentle heft, weighin' what's in there.",
    "%by% checks %name% over the way a good hand checks stock: belly, teats, hips, then a pat on the rump.",
    "%by% spreads warm hands on %name%'s belly and waits. Somethin' in there kicks right back, and %by% grins."
  ];
  var SELF_CHECK = [
    "%name% sits back in the straw with both hands on their belly, feelin' for the %brood%.",
    "%name% rubs slow circles on their own belly, pressin' gently, tryin' to feel what's in there."
  ];
  var CARRY = {
    early: ["carryin' small yet, hardly a swell", "barely showin', just a little firmness low down"],
    showing: ["carryin' high and round", "belly firm and high, and growin' nicely"],
    heavy: ["carryin' heavy and wide", "belly big and tight, and plenty movin' in there"],
    nesting: ["dropped low and heavy, any time now", "sittin' low, belly hard, ready to come"]
  };
  var HELP = [
    '%by% gets behind %name% and holds them up under the arms. "Breathe with me. Now push, long and slow."',
    "%by% digs the heel of their hand into the small of %name%'s back, right where it aches, and the next push goes deeper.",
    `%by% counts %name% through the push, one hand flat on their belly, feelin' it work. "That's it. That's it. Good."`,
    "%by% presses warm cloths low on %name%'s belly and talks them through it, soft and steady.",
    `%by% kneels between %name%'s knees, watchin', coachin'. "I can see it movin'. One more like that."`,
    "%by% lets %name% grip both their hands through a long one, and doesn't flinch when they squeeze.",
    "%by% strokes the sweaty hair back off %name%'s face and murmurs to them, and %name% pushes harder for it.",
    "%by% presses on the top of %name%'s belly in time with the push, helpin' it down.",
    "%name% lets out %sound% and bears down with everything, %by% right there holdin' them.",
    "%by% rolls %name%'s nipples slow between finger and thumb, and the next squeeze comes harder and quicker for it.",
    "%by% rocks %name%'s hips side to side through the squeeze, openin' them up, coaxin' the %brood% lower."
  ];
  var UNSTICK = [
    `%by% slicks their hand and reaches in slow and gentle, feelin' for the stuck %young%. A careful turn, a long groan from %name%, and it comes round right. "There. Now push."`,
    `%by% presses on %name%'s belly from outside with both hands, coaxin' the %young% round, slow, slow, till it shifts. "Got it. Push, sugar."`,
    "%by% has %name% up on all fours, rocks their hips side to side, and works the %young% round with patient hands till it lines up."
  ];
  var INDUCE = [
    "%by% rubs %name%'s belly low and firm, workin' slow circles, and brings them a cup of the farm's bitter labour tea. It isn't long before the first real squeeze comes.",
    "%by% walks %name% up and down the barn, hands on their hips, then has them squat and rock. The %brood% drops low. Their body's ready.",
    "%by% kneads the base of %name%'s belly and rolls their nipples between finger and thumb till %name% gasps. That does it: here comes the first squeeze."
  ];
  var AFTER = [
    "%by% cleans %name% up with warm water and soft cloths, then kneads their swollen breasts till the milk lets down in a rush.",
    "%by% props %name% up in fresh straw, brings them water, and rubs their achin' belly while they nurse the %brood%.",
    "%by% kneads %name%'s heavy breasts slow and firm, coaxin' the milk in, then tucks a blanket round them. Good work, sugar.",
    "%by% washes %name% down, checks them over gentle, and sits with them a while, hand on their emptied belly, till they doze."
  ];
  var CALL = [
    "\u{1F37C} %name% has gone into labour in %place%. Midwives wanted: ?midwife %name%, standin' next to them.",
    "\u{1F37C} Labour's started: %name%, in %place%. A midwife's hands would help. ?midwife %name%, right beside them."
  ];
  var STUCK_CALL = [
    "\u{1F37C} %name% has one stuck, turned crossways! A midwife's hands, quick: ?midwife %name%, standin' next to them.",
    "\u{1F37C} %name%'s labour has stalled on a stuck %young%. Anybody who can midwife: ?midwife %name%, right beside them."
  ];
  function timeLeft(p) {
    const ms = p.preg.due - Date.now();
    if (ms <= 0) return "past their time";
    const h = ms / 36e5;
    if (h < 24) {
      const r = Math.max(1, Math.round(h));
      return "due within " + r + " hour" + (r === 1 ? "" : "s");
    }
    const dd = Math.round(h / 24);
    return "about " + dd + " day" + (dd === 1 ? "" : "s") + " to go";
  }
  function countGuess(mn, f, n, rough) {
    const v = vars(mn);
    if (f < 0.33) return "too soon to feel how many";
    if (rough && f < 0.9) return "can't tell how many on your own";
    if (f < 0.66) return n === 1 ? "just the one, by the feel of it" : "more than one in there, at least two";
    if (f < 0.9) {
      if (n <= 2) return n === 1 ? "one " + v.young + ", by the feel of it" : "two, by the feel of it";
      const lo = n - (Math.random() < 0.5 ? 1 : 0);
      return "feels like " + lo + ", maybe " + (lo + 1);
    }
    return n === 1 ? "one " + v.young + ", sure as anything" : n + " " + v.youngs + ", every one countable now";
  }
  function findings(mn, rough, forThem) {
    const p = api2.prod(mn), f = along(p), n = p.preg.count || 1, k = stageKey(f);
    const parts = [STAGE_WORD[k] + ", " + timeLeft(p), p.preg.due <= Date.now() ? "more than ready" : pick(CARRY[k]), countGuess(mn, f, n, rough)];
    if (p.preg.via === "butt") parts.push("carried in the ass, high and snug");
    if (p.preg2) parts.push("and a second litter in the other hole");
    if (!rough && !forThem) parts.push("bred by " + p.preg.sires.map(api2.name).join(" & "));
    return parts.map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(". ") + ".";
  }
  function doCheckup(c, by, t, lead) {
    const m = M();
    if (api2.onMap(t)) api2.emote("\u{1FA7A} " + line(t, CHECKUP, "checkup", by), t);
    c.reply("\u{1FA7A} " + (lead || "") + "Checkup on " + api2.name(t) + ": " + findings(t, false, false));
    api2.notice(t, "\u{1FA7A} " + api2.name(by) + " gave you a checkup: " + findings(t, false, true));
    m.checked[t] = { at: Date.now(), by };
    const key = by + ":" + t;
    if (m.paid[key] !== api2.dayKey()) {
      m.paid[key] = api2.dayKey();
      if (api2.isStaff(by)) api2.staffPoints(by, 1, "checkup");
    }
    api2.save();
  }
  function cmdCheckup(c) {
    const { sender, args } = c, w = String(args[0] || "").toLowerCase(), m = M();
    if (w === "off" || w === "on") {
      if (w === "off") m.noCheck[sender] = true;
      else delete m.noCheck[sender];
      api2.save();
      return c.reply(w === "off" ? "\u{1FA7A} No checkups on you, sugar. ?checkup on lets the midwives' hands back." : "\u{1FA7A} Midwives can check you over again, sugar. ?checkup off stops it.");
    }
    const t = args[0] ? api2.find(args[0]) : sender;
    if (!t) return c.reply("Who am I checkin', sugar? ?checkup <who>, standin' next to them.");
    const p = api2.prod(t);
    if (t === sender) {
      if (!p || !p.preg) return c.reply("You're not carryin' right now, sugar.");
      if (api2.onMap(t)) api2.emote("\u{1FA7A} " + line(t, SELF_CHECK, "self"), t);
      return c.reply("\u{1FA7A} What you can feel: " + findings(t, true, true));
    }
    if (!canMidwife(sender)) return c.reply("Checkups are for staff and the midwives they trust, sugar. ?midwives shows who.");
    if (!p || !p.preg) return c.reply(api2.name(t) + " isn't carryin' right now, hon.");
    if (m.noCheck[t]) return c.reply(api2.name(t) + " has said no checkups, sugar.");
    if (p.labour) return c.reply(api2.name(t) + " is in labour right now! ?midwife " + api2.name(t) + " to help 'em through it.");
    if (!near(sender, t)) return c.reply("Get right down next to " + api2.name(t) + " to feel, sugar.");
    doCheckup(c, sender, t);
  }
  function cmdMidwife(c) {
    const { sender, args } = c, m = M();
    const t = args[0] ? api2.find(args[0]) : null, p = t && api2.prod(t);
    if (!t || !p) return c.reply("Who's birthin', sugar? ?midwife <who>, standin' next to them.");
    if (!canMidwife(sender)) return c.reply("Midwifin' is for staff and the midwives they trust, sugar. ?midwives shows who.");
    if (t === sender) return c.reply("You can't midwife yourself, sugar. ?checkup on your own gives you a feel.");
    const lb = p.labour, now = Date.now();
    if (!lb) {
      const born = m.born[t];
      if (born && now - born.at < AFTER_MIN * 6e4 && !born.tended) {
        if (!near(sender, t)) return c.reply("Get right down next to " + api2.name(t) + " to tend 'em, sugar.");
        born.tended = sender;
        p.freshUntil = Math.max(p.freshUntil || now, now) + 864e5;
        if (api2.onMap(t)) api2.emote("\u{1F37C} " + line(t, AFTER, "after", sender), t);
        if (api2.isStaff(sender)) api2.staffPoints(sender, 1, "midwife");
        api2.notice(t, "\u{1F37C} " + api2.name(sender) + " tended you after the birth. Your milk'll stay fresh and heavy a day longer.");
        api2.save();
        return c.reply("\u{1F37C} You tended " + api2.name(t) + ". Their milk'll stay fresh a day longer.");
      }
      if (p.preg) {
        if (m.noCheck[t]) return c.reply(api2.name(t) + " isn't in labour yet, and they've said no checkups, sugar.");
        if (!near(sender, t)) return c.reply(api2.name(t) + " isn't in labour yet. Get right down next to 'em for a checkup, sugar.");
        return doCheckup(c, sender, t, "Not in labour yet, so you give 'em a checkup. ");
      }
      return c.reply(api2.name(t) + " isn't carryin', hon. The midwives get called when somebody goes into labour.");
    }
    if (!near(sender, t)) return c.reply("Get right down next to " + api2.name(t) + " to help, sugar.");
    const rec = m.labour[t] = m.labour[t] || { helpers: {} };
    rec.helpers = rec.helpers || {};
    if (!lb.midwife) {
      lb.midwife = sender;
      rec.midwife = sender;
      api2.emote("\u{1F37C} " + line(t, POOLS.claim, "claim", sender), t);
      api2.save();
      return c.reply("\u{1F37C} You're " + api2.name(t) + "'s midwife. Stay by 'em, and ?midwife " + api2.name(t) + " every few minutes to help 'em along.");
    }
    if (!rec.midwife) rec.midwife = lb.midwife;
    const k = sender + ":" + t, wait = (m.helpAt[k] || 0) + HELP_GAP_MIN * 6e4 - now;
    if (wait > 0) return c.reply("Let 'em catch their breath, sugar. You can help again in " + (wait > 9e4 ? Math.ceil(wait / 6e4) + " minutes" : "a moment") + ".");
    if (!api2.labour) {
      api2.emote("\u{1F37C} " + line(t, HELP, "help", sender), t);
      return c.reply("\u{1F37C} You help " + api2.name(t) + " through it.");
    }
    m.helpAt[k] = now;
    rec.helpers[sender] = (rec.helpers[sender] || 0) + 1;
    if (lb.stuck) {
      api2.labour.unstick(t, sender);
      rec.turned = sender;
      api2.emote("\u{1F37C} " + line(t, UNSTICK, "unstick", sender), t);
      api2.save();
      return c.reply("\u{1F37C} You turned it. " + api2.name(t) + "'s movin' again.");
    }
    const left = api2.labour.help(t);
    api2.emote("\u{1F37C} " + line(t, HELP, "help", sender), t);
    api2.save();
    c.reply("\u{1F37C} That helped. " + (left == null ? "" : left <= 4 ? "Nearly there." : "About " + left + " minutes to go."));
  }
  function cmdInduce(c) {
    const { sender, args } = c;
    const t = args[0] ? api2.find(args[0]) : null, p = t && api2.prod(t);
    if (!canMidwife(sender)) return c.reply("Bringin' labour on is for staff and the midwives they trust, sugar.");
    if (!t || !p || !p.preg) return c.reply("Who's ready to birth, sugar? ?induce <who>, standin' next to them.");
    if (t === sender) return c.reply("Ask a midwife to bring it on for you, sugar.");
    if (p.labour) return c.reply(api2.name(t) + " is already in labour, hon. ?midwife " + api2.name(t) + " to help.");
    const f = along(p);
    if (f < 0.9) return c.reply("Too soon, sugar: " + api2.name(t) + " is only " + STAGE_WORD[stageKey(f)] + ". Wait till they're nestin'.");
    if (!api2.labour) return c.reply("The farm girl can't bring labour on yet, sugar: she needs updatin'.");
    if (!near(sender, t)) return c.reply("Get right down next to " + api2.name(t) + " first, sugar.");
    c.reply("\u{1FA7A} I've asked " + api2.name(t) + " if they're ready to birth.");
    api2.ask(t, "\u{1FA7A} " + api2.name(sender) + " wants to bring your labour on now, sugar. Ready to birth? Say yes or no.", (yes) => {
      if (!yes) {
        api2.notice(sender, "\u{1FA7A} " + api2.name(t) + " isn't ready yet. Let 'em be, sugar.");
        return;
      }
      const pp = api2.prod(t);
      if (!pp || !pp.preg || pp.labour) return;
      if (!api2.onMap(t)) {
        api2.notice(sender, "\u{1FA7A} " + api2.name(t) + " said yes, but they're not on the farm anymore.");
        return;
      }
      api2.emote("\u{1FA7A} " + line(t, INDUCE, "induce", sender), t);
      api2.labour.start(t);
      const lb = api2.prod(t).labour;
      if (lb) lb.midwife = sender;
      M().labour[t] = { midwife: sender, helpers: {}, induced: true };
      api2.save();
    });
  }
  function cmdMidwives(c) {
    const { sender, args } = c, m = M(), w = String(args[0] || "").toLowerCase();
    if (w === "add" || w === "remove" || w === "off") {
      if (api2.rank(sender) < 2) return c.reply("Only herdmasters and proprietors trust somebody with midwifin', sugar.");
      const t = args[1] ? api2.find(args[1]) : null;
      if (!t || !api2.rec(t)) return c.reply("Who, sugar? ?midwives " + w + " <who> (they need to be on the farm's books).");
      if (w === "add") {
        m.trusted[t] = { by: sender, at: Date.now() };
        api2.save();
        api2.notice(t, "\u{1FA7A} " + api2.name(sender) + " trusts you as one of the farm's midwives now, sugar: ?checkup <who> to feel how far along somebody is, ?midwife <who> to see 'em through labour, ?induce <who> once they're nestin'.");
        return c.reply("\u{1FA7A} " + api2.name(t) + " is a farm midwife now.");
      }
      delete m.trusted[t];
      api2.save();
      return c.reply("\u{1FA7A} " + api2.name(t) + " isn't a farm midwife anymore" + (api2.isStaff(t) ? " (staff can always midwife, though)" : "") + ".");
    }
    const names = Object.keys(m.trusted).map((x) => api2.name(Number(x)));
    c.reply("\u{1FA7A} Midwives: every member of staff" + (names.length ? ", plus " + names.join(", ") : "") + "." + (api2.rank(sender) >= 2 ? " ?midwives add <who> / remove <who>." : ""));
  }
  var midwifeCommands = {
    checkup: { usage: "checkup [<who>|on|off]", private: true, run: cmdCheckup },
    midwife: { usage: "midwife <who>", private: true, run: cmdMidwife },
    induce: { usage: "induce <who>", private: true, run: cmdInduce },
    midwives: { usage: "midwives [add|remove <who>]", private: true, run: cmdMidwives }
  };
  function callMidwives(mn, text) {
    try {
      api2.notifyStaff(untag(text), true);
    } catch (e) {
    }
    const m = M();
    for (const x of api2.here()) if (m.trusted[x] && !api2.isStaff(x) && x !== mn) api2.notice(x, text);
  }
  function midwifeLabour(mn, info) {
    const m = M();
    m.labour[mn] = m.labour[mn] || { helpers: {} };
    api2.save();
    callMidwives(mn, line(mn, CALL, "call", 0, { place: info && info.place || vars(mn).place }));
  }
  function midwifeStuck(mn) {
    callMidwives(mn, line(mn, STUCK_CALL, "stuckcall"));
  }
  function midwifeBirth(mn, kids, sires, info) {
    const m = M(), rec = m.labour[mn] || {}, d = D2();
    delete m.labour[mn];
    const mw = rec.midwife || info && info.midwife || d.lastMidwife && d.lastMidwife[mn] || 0;
    if (d.lastMidwife) delete d.lastMidwife[mn];
    m.born[mn] = { at: Date.now(), midwife: mw && mw !== api2.cfg.BOT_MEMBER ? mw : 0 };
    const helpers = Object.assign({}, rec.helpers || {});
    if (mw && mw !== api2.cfg.BOT_MEMBER && helpers[mw] == null) helpers[mw] = 0;
    let helps = 0;
    for (const [h, n0] of Object.entries(helpers)) {
      const hm = Number(h), n = Number(n0) || 0, turned = rec.turned === hm ? 1 : 0;
      helps += n;
      if (api2.isStaff(hm)) {
        const pts = (hm === mw ? 2 : 0) + Math.min(4, n) + turned;
        if (pts > 0) api2.staffPoints(hm, pts, "midwife");
      } else if (api2.ribbons && (n > 0 || hm === mw)) api2.ribbons(hm, 1 + (n >= 3 ? 1 : 0), "midwifin' " + api2.name(mn));
    }
    if (helps >= 2 && api2.ribbons) api2.ribbons(mn, 1, "a smooth birthin'");
    if (mw && mw !== api2.cfg.BOT_MEMBER && api2.onMap(mn) && POOLS.born.length) api2.later(() => api2.emote(line(mn, POOLS.born, "born", mw), mn), 8e3);
    api2.save();
  }
  function midwifeTick() {
    const m = M(), now = Date.now();
    for (const [k, b] of Object.entries(m.born)) if (now - b.at > 2 * AFTER_MIN * 6e4) delete m.born[k];
    for (const [k, at] of Object.entries(m.helpAt)) if (now - at > 36e5) delete m.helpAt[k];
    for (const mn of Object.keys(m.labour)) {
      const p = api2.prod(Number(mn));
      if (!p || !p.labour && !p.preg) delete m.labour[mn];
    }
  }
  function ago(t) {
    const mins = Math.round((Date.now() - t) / 6e4);
    return mins < 60 ? mins + " min ago" : mins < 1440 ? Math.round(mins / 60) + " h ago" : Math.round(mins / 1440) + " d ago";
  }
  function midwifeCard(viewer) {
    if (!canMidwife(viewer)) return null;
    const m = M(), rows = [], buttons = [];
    const carrying = api2.here().map((mn) => [mn, api2.prod(mn)]).filter(([, p]) => p && p.preg).sort((a, b) => (b[1].labour ? 1 : 0) - (a[1].labour ? 1 : 0) || a[1].preg.due - b[1].preg.due);
    for (const [mn, p] of carrying.slice(0, 12)) {
      const nm = api2.name(mn);
      if (p.labour) {
        const left = Math.max(0, Math.ceil((p.labour.until - Date.now()) / 6e4));
        rows.push([nm, "\u{1F37C} in labour" + (p.labour.stuck ? ", one's stuck!" : ", about " + left + " min to go") + (p.labour.midwife ? " \xB7 midwife " + api2.name(p.labour.midwife) : " \xB7 no midwife yet")]);
        if (buttons.length < 4) buttons.push({ label: (p.labour.stuck ? "Turn it: " : "Help ") + nm, cmd: "midwife " + nm });
      } else {
        const f = along(p), ck = m.checked[mn];
        rows.push([nm, STAGE_WORD[stageKey(f)] + " \xB7 " + timeLeft(p) + " \xB7 " + (m.noCheck[mn] ? "no checkups" : ck ? "checked " + ago(ck.at) : "not checked yet")]);
        if (buttons.length < 4 && !m.noCheck[mn]) buttons.push({ label: "Checkup " + nm, cmd: "checkup " + nm });
      }
    }
    return {
      staff: api2.isStaff(viewer),
      title: "\u{1FA7A} Expectin' on the farm",
      note: "Stand right beside them first. ?checkup <who> \xB7 ?midwife <who> in labour (again every few minutes helps it along) \xB7 ?induce <who> once they're nestin'.",
      lines: rows.length ? rows : [["Nobody", "nobody carryin' on the farm right now"]],
      buttons: buttons.length ? buttons : void 0
    };
  }
  var MIDWIFE_GUIDE = " Midwives (staff, and anybody a herdmaster trusts with ?midwives add <who>): ?checkup <who> feels how far along somebody is and how many; ?midwife <who> sees them through labour (again every few minutes helps it along, and turns a stuck one) and tends them after; ?induce <who> brings labour on once they're nestin', if they say yes. ?checkup off: no checkups on you.";

  // addons/breeding/index.js
  var api3 = null;
  function D3() {
    const d = api3.data();
    d.preg = d.preg || {};
    d.bookings = d.bookings || [];
    d.week = d.week || {};
    d.optIn = d.optIn || {};
    d.scent = d.scent || {};
    return d;
  }
  function along2(p) {
    return p && p.preg ? Math.min(1, Math.max(0, (Date.now() - p.preg.since) / Math.max(1, p.preg.due - p.preg.since))) : null;
  }
  var STAGES = [
    { at: 0, key: "early", label: "early days" },
    { at: 0.33, key: "showing", label: "showin'" },
    { at: 0.66, key: "heavy", label: "heavy with it" },
    { at: 0.9, key: "nesting", label: "nestin'" }
  ];
  var stageOf = (f) => STAGES.filter((s) => f >= s.at).slice(-1)[0];
  var bellySize = (f) => Math.min(5, 1 + Math.floor(f * 5));
  var STAGE_LINES = {
    showing: {
      you: "\u{1F930} Your belly's started to round out, %name%. Anybody lookin' can tell now.",
      room: "%name%'s belly has started to round out, soft and unmistakable. They're showin'."
    },
    heavy: {
      you: "\u{1F930} You're heavy with it now, %name%: belly full and tight, %litter% movin' inside you.",
      room: "%name% is heavy with %litter% now, belly big and tight, and they move a little slower for it."
    },
    nesting: {
      you: "\u{1F930} You're nestin', %name%. Restless, achy, and wantin' a soft corner of straw. It won't be long.",
      room: "%name% is restless and nestin', pawing straw into a pile and lowering themselves into it with a groan. It won't be long now."
    }
  };
  var CRAVINGS = [
    "You're cravin' somethin' salty somethin' fierce, %name%.",
    "All you can think about is a big bowl of warm milk, %name%.",
    "You'd do just about anything for somethin' sweet right now, %name%.",
    "You're achin' for a big, thick load, %name%. Funny what bein' bred does to you.",
    "You want to be held and rubbed, %name%. Your belly especially.",
    "You're starvin', %name%. Eatin' for %eatin% now."
  ];
  var KICKS = [
    "%name%'s belly jumps with a kick hard enough to see from across the pen.",
    "A little foot pushes out against %name%'s tight belly, then rolls away. They gasp and rub the spot.",
    "%name%'s whole belly shifts and rolls as somethin' inside turns over. They stop and breathe through it.",
    "Something kicks %name% right in the ribs. They wince and laugh and press a hand to it."
  ];
  var MIDWIFE = [
    "%by% kneels beside %name% in the straw, one hand on their belly and the other on their back, talking them through every push.",
    "%by% settles in as midwife, wiping %name%'s brow and guiding them through the next contraction."
  ];
  var RUTTY = [
    "The scent of somebody in heat drifts over, and %name%'s cock twitches. They breathe it in deep.",
    "%name% catches the smell of heat on the air and goes stiff and restless, nostrils flaring.",
    "%name% can't stop lookin' toward the scent of heat nearby. Their breathing's gone heavy."
  ];
  function words(mn, extra) {
    const an = animalOf(api3, mn), p = api3.prod(mn), n = p && p.preg && p.preg.count || 1, young = an.young || ["little one", "little ones"];
    const litter = "the " + (n > 1 ? young[1] : young[0]);
    return Object.assign({ name: api3.name(mn), litter, Litter: litter.charAt(0).toUpperCase() + litter.slice(1), eatin: n > 1 ? "a whole litter" : "two", a: an.a, young: young[0] }, extra || {});
  }
  var lineAbout = (mn, pool, key, extra) => fill(lineFor(api3, mn, pool, key), words(mn, extra));
  var isBreedWeek = (d = /* @__PURE__ */ new Date()) => d.getDate() >= 15 && d.getDate() <= 21;
  var NIGHT_HOUR = 21;
  var PENT_H = 4;
  var PRIZE = { dam: 10, stud: 5 };
  var localDay = (d = /* @__PURE__ */ new Date()) => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  var monthKey = (d = /* @__PURE__ */ new Date()) => d.toISOString().slice(0, 7);
  function weekEnd() {
    const d = /* @__PURE__ */ new Date();
    return new Date(d.getFullYear(), d.getMonth(), 22, 0, 0, 0).getTime();
  }
  function tick() {
    const d = D3(), now = Date.now(), here = api3.here();
    for (const mn of here) {
      const p = api3.prod(mn);
      if (!p) continue;
      const f = along2(p);
      if (f === null) {
        delete d.preg[mn];
        continue;
      }
      const x = d.preg[mn] = d.preg[mn] || { stage: "early" };
      const st = stageOf(f);
      if (st.key !== x.stage && STAGE_LINES[st.key]) {
        x.stage = st.key;
        api3.notice(mn, lineAbout(mn, [STAGE_LINES[st.key].you].concat(MORE2.STAGE_YOU[st.key] || []), "you:" + st.key));
        if (api3.onMap(mn)) api3.emote("\u{1F930} " + lineAbout(mn, [STAGE_LINES[st.key].room].concat((MORE.STAGE_ROOM || {})[st.key] || [], MORE2.STAGE_ROOM[st.key] || []), "room:" + st.key), mn);
        api3.save();
      }
      if ((st.key === "showing" || st.key === "heavy") && now >= (x.craveAt || 0)) {
        if (x.craveAt) api3.notice(mn, "\u{1F930} " + lineAbout(mn, CRAVINGS, "crave"));
        x.craveAt = now + between(120, 240) * 6e4;
      }
      if ((st.key === "heavy" || st.key === "nesting") && api3.onMap(mn) && now >= (x.kickAt || 0)) {
        if (x.kickAt) api3.emote("\u{1F930} " + lineAbout(mn, KICKS, "kick"), mn);
        x.kickAt = now + between(20, 40) * 6e4;
      }
    }
    bookingsTick(here);
    breedWeekTick(here);
  }
  function bookingsTick(here) {
    const d = D3(), set = new Set(here);
    for (const b of d.bookings) {
      if (b.told || !set.has(b.stud) || !set.has(b.dam) || !api3.onMap(b.stud) || !api3.onMap(b.dam)) continue;
      b.told = Date.now();
      const who = { dam: api3.name(b.dam), stud: api3.name(b.stud) };
      api3.notice(b.stud, fill(pick(MORE2.TIME_STUD), who));
      api3.notice(b.dam, fill(pick(MORE2.TIME_DAM), who));
      api3.save();
    }
  }
  function cmdBook(c) {
    const { sender, args, api: A } = c, d = D3(), w = String(args[0] || "").toLowerCase();
    if (w === "done" || w === "remove" || w === "cancel") {
      const i = d.bookings.findIndex((b2) => String(b2.id) === String(args[1] || "").replace(/^#/, ""));
      if (i < 0) return c.reply("Which booking, sugar? ?book shows the numbers.");
      const b = d.bookings.splice(i, 1)[0];
      A.save();
      if (w === "done") A.staffPoints(sender, 1, "booking");
      return c.reply("\u{1F402} Booking #" + b.id + " (" + A.name(b.stud) + " \xD7 " + A.name(b.dam) + ") " + (w === "done" ? "done. Good work!" : "taken off the list."));
    }
    const stud = A.find(args[0]), dam = A.find(args[1]);
    if (!stud || !dam || !A.rec(stud) || !A.rec(dam)) return c.reply("Here's how, sugar: ?book <stud> <who>, like ?book Rex Bessie. ?book shows the list.");
    const rd = A.rec(dam);
    if (!rd.breedable || A.limitBlocks(dam, "breed")) return c.reply(A.name(dam) + " isn't breedable, hon, so they can't be booked.");
    if (d.bookings.some((b) => b.stud === stud && b.dam === dam)) return c.reply("That pair's already booked, sugar.");
    d.seq = (d.seq || 0) + 1;
    d.bookings.push({ id: d.seq, stud, dam, by: sender, at: Date.now(), told: 0 });
    A.save();
    A.audit(sender, "BOOK", stud + "x" + dam);
    const who = { dam: A.name(dam), stud: A.name(stud) };
    A.notice(stud, fill(pick(MORE2.BOOKED_STUD), who));
    A.notice(dam, fill(pick(MORE2.BOOKED_DAM), who));
    c.reply("\u{1F402} Booked: #" + d.seq + " " + A.name(stud) + " \xD7 " + A.name(dam) + ".");
  }
  var bookingsText = () => {
    const b = D3().bookings;
    return b.length ? "\u{1F402} STUD BOOKINGS\n" + b.map((x) => "#" + x.id + " " + api3.name(x.stud) + " \xD7 " + api3.name(x.dam) + (x.told ? " \xB7 told, waitin' on 'em" : "")).join("\n") : "\u{1F402} No stud bookings right now. Staff add them with ?book <stud> <who>.";
  };
  function breedWeekTick(here) {
    const d = D3(), now = /* @__PURE__ */ new Date(), mk = monthKey(now);
    if (d.week.month !== mk) d.week = { month: mk };
    if (now.getDate() === 14 && !d.week.warned && here.length) {
      d.week.warned = true;
      api3.announce("\u{1F4C5} Breedin' season starts tomorrow, y'all! Anybody who said ?season on comes into heat for it, and every breedin' goes in the stud book.");
      api3.save();
    }
    if (!isBreedWeek(now)) {
      crownTick(here);
      return;
    }
    if (!d.week.said && here.length) {
      d.week.said = true;
      api3.announce("\u{1F525} It's breedin' season on the farm! Everybody signed up is comin' into heat, the studs are fillin' up fast, and every breedin' goes in the stud book. I read it out every night, and the most-bred gets crowned on the last one. \u{1F402}");
      for (const mn of here) if (d.optIn[mn] && api3.makesSemen(mn)) api3.notice(mn, "\u{1F402} Breedin' season's on, sugar. Your balls fill half again faster all week, and four hours full leaves you pent up. Go find somebody in heat.");
      api3.save();
    }
    seasonPentTick(here);
    nightlyTick(here);
    d.week.heated = d.week.heated || {};
    for (const mn of here) {
      const r = api3.rec(mn), p = api3.prod(mn);
      if (!r || !p || !d.optIn[mn] || d.week.heated[mn] || !r.breedable || !r.fertile || api3.limitBlocks(mn, "heat") || p.preg) continue;
      d.week.heated[mn] = true;
      api3.startHeat(mn, api3.ANON_STUD, Math.max(1, (weekEnd() - Date.now()) / 36e5));
      api3.save();
    }
    const inHeat = here.filter((mn) => api3.prod(mn) && api3.inHeat(api3.prod(mn)) && !api3.prod(mn).heat.quiet);
    if (!inHeat.length) return;
    for (const stud of here) {
      if (!api3.makesSemen(stud) || inHeat.includes(stud) || Date.now() - (d.scent[stud] || 0) < 15 * 6e4) continue;
      const sp = api3.pos(stud);
      if (!sp || !inHeat.some((m) => {
        const q = api3.pos(m);
        return q && Math.max(Math.abs(q.X - sp.X), Math.abs(q.Y - sp.Y)) <= 3;
      })) continue;
      d.scent[stud] = Date.now();
      api3.privateEmote(stud, lineAbout(stud, RUTTY, "rutty"));
    }
  }
  function season() {
    const d = D3(), mk = monthKey();
    if (d.week.month !== mk) d.week = { month: mk };
    const w = d.week;
    w.bred = w.bred || {};
    w.took = w.took || {};
    w.covers = w.covers || {};
    return w;
  }
  var BRED_MARKS = {
    3: [
      "The farm girl hangs a little red ribbon on %name%'s gate. Three breedin's this season, and countin'.",
      "%name% gets a chalk mark on the barn door for every breedin'. That's three now."
    ],
    5: [
      "Five times bred this season. The farm girl ties a second ribbon on %name%'s gate and gives their belly a pat.",
      "%name%'s chalk marks on the barn door have reached five. Folks are startin' to notice."
    ],
    10: [
      "Ten! The barn door's runnin' out of room for %name%'s chalk marks. That's a real breeder.",
      "Ten loads this season. The farm girl just shakes her head and hangs a whole bunch of ribbons on %name%'s gate."
    ]
  };
  CRAVINGS.push(...MORE.CRAVINGS, ...MORE2.CRAVINGS);
  KICKS.push(...MORE.KICKS, ...MORE2.KICKS);
  MIDWIFE.push(...MORE.MIDWIFE, ...MORE2.MIDWIFE);
  RUTTY.push(...MORE.RUTTY, ...MORE2.RUTTY);
  for (const k of Object.keys(MORE.BRED_MARKS)) BRED_MARKS[k].push(...MORE.BRED_MARKS[k], ...MORE2.BRED_MARKS[k] || []);
  function onBred(stud, dam, hole, mlIn, took) {
    const counts = hole === "vulva" || hole === "butt" && api3.mpregOn && api3.mpregOn(dam);
    if (!counts || !isBreedWeek() || !D3().optIn[dam] || !(mlIn > 0)) return;
    const w = season();
    w.bred[dam] = (w.bred[dam] || 0) + 1;
    if (took) w.took[dam] = (w.took[dam] || 0) + 1;
    if (stud > 0 && stud !== dam && D3().optIn[stud]) w.covers[stud] = (w.covers[stud] || 0) + 1;
    api3.save();
    const lines = BRED_MARKS[w.bred[dam]];
    if (lines && api3.onMap(dam)) api3.later(() => api3.emote("\u{1F525} " + lineAbout(dam, lines, "marks"), dam), 6e3);
  }
  function rankList(o, n, unit) {
    return Object.entries(o).filter(([m]) => Number(m) > 0).sort((a, b) => b[1] - a[1]).slice(0, n).map(([m, v], i) => "  " + (["\u{1F947}", "\u{1F948}", "\u{1F949}"][i] || i + 1 + ".") + " " + api3.name(Number(m)) + ", " + v + " " + unit(v)).join("\n");
  }
  function bookText(night) {
    const w = season();
    const dams = rankList(w.bred, 5, (v) => v === 1 ? "time" : "times"), studs = rankList(w.covers, 3, (v) => v === 1 ? "cover" : "covers");
    const caught = Object.keys(w.took).filter((m) => Number(m) > 0).map((m) => api3.name(Number(m)));
    const head = "\u{1F4D6} THE STUD BOOK" + (night ? ", night " + night + " of breedin' season" : "");
    if (!dams && !studs) return head + "\nNot one breedin' in it yet. Y'all are slackin'. \u{1F402}";
    return head + "\n\u{1F404} Most bred\n" + (dams || "  (nobody yet)") + "\n\u{1F402} Busiest studs\n" + (studs || "  (nobody yet)") + (caught.length ? "\n\u{1F37C} Caught this season: " + caught.join(", ") : "");
  }
  function seasonPentTick(here) {
    const d = D3(), now = Date.now();
    for (const mn of here) {
      if (!d.optIn[mn] || !api3.makesSemen(mn)) continue;
      const p = api3.prod(mn);
      if (!p || p.pentUp || !p.semenFullSince || now - p.semenFullSince < PENT_H * 36e5) continue;
      p.pentUp = true;
      api3.save();
      api3.notice(mn, "\u{1F624} Breedin' season's got you achin', " + api3.name(mn) + ". You're all pent up: the next load's a big, potent one.");
    }
  }
  function readOut(here, text) {
    if (!api3.hasCompanion || !api3.privateSay) return api3.announce(text);
    for (const mn of here) {
      if (api3.hasCompanion(mn)) api3.notice(mn, text);
      else api3.privateSay(mn, text);
    }
  }
  function nightlyTick(here) {
    const w = season(), now = /* @__PURE__ */ new Date();
    if (!here.length || now.getHours() < NIGHT_HOUR || w.readDay === localDay(now)) return;
    if (now.getDate() === 21) {
      crownTick(here, true);
      return;
    }
    w.readDay = localDay(now);
    api3.save();
    readOut(here, bookText(now.getDate() - 14));
  }
  function crownTick(here, lastNight) {
    const d = D3(), w = season(), now = /* @__PURE__ */ new Date();
    if (w.prized || !w.said || !here.length) return;
    if (!lastNight && now.getDate() < 22) return;
    w.prized = true;
    w.readDay = localDay(now);
    const top = (o) => Object.entries(o).filter(([m]) => Number(m) > 0).sort((a, b) => b[1] - a[1] || (w.took[b[0]] || 0) - (w.took[a[0]] || 0))[0];
    const dam = top(w.bred), stud = top(w.covers);
    if (!dam) {
      api3.save();
      readOut(here, "\u{1F4D6} Breedin' season's over, and not a single breedin' made the stud book. Next month, y'all. \u{1F402}");
      return;
    }
    const champ = { month: w.month, dam: Number(dam[0]), times: dam[1], stud: stud ? Number(stud[0]) : 0, covers: stud ? stud[1] : 0 };
    d.champions = (d.champions || []).concat(champ).slice(-12);
    api3.save();
    readOut(here, bookText(7) + "\n\n\u{1F451} That's the season, y'all! " + api3.name(champ.dam) + " is the farm's most-bred, " + champ.times + " times" + (champ.stud ? ", and " + api3.name(champ.stud) + " the busiest stud with " + champ.covers : "") + ". Ribbons for the winners! \u{1F402}");
    if (api3.ribbons) api3.ribbons(champ.dam, PRIZE.dam, "bein' the most-bred of breedin' season", true);
    if (champ.stud && api3.ribbons) api3.ribbons(champ.stud, PRIZE.stud, "bein' the busiest stud of breedin' season", true);
    if (api3.onMap(champ.dam)) api3.later(() => api3.emote(lineAbout(champ.dam, gearOf(api3, champ.dam).collar ? MORE2.CROWN_COLLAR : MORE2.CROWN, "crown"), champ.dam), 4e3);
    api3.audit(api3.cfg.BOT_MEMBER, "SEASON", w.month + " " + champ.dam + "x" + champ.times + (champ.stud ? " stud " + champ.stud + "x" + champ.covers : ""));
  }
  function onBirth(mn, kids, sires, info) {
    const d = D3();
    delete d.preg[mn];
    midwifeBirth(mn, kids, sires, info);
    api3.save();
  }
  function cmdBreedweek(c) {
    const { sender, args, api: A } = c, d = D3(), w = String(args[0] || "").toLowerCase();
    if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar.");
    if (w === "book" || w === "top" || w === "board") return c.reply(bookText() + (isBreedWeek() ? "" : "\n(Breedin' season is the 15th to the 21st.)") + champText());
    if (w === "on" || w === "off") {
      if (w === "on") d.optIn[sender] = true;
      else delete d.optIn[sender];
      A.save();
      const rs = A.rec(sender);
      return c.reply(w === "on" ? "\u{1F525} You're in for breedin' season (the 15th to the 21st each month). " + (A.makesSemen(sender) ? "Your balls fill faster that week and you get pent up quicker. " : "") + (rs.breedable && rs.fertile ? "You'll come into heat for it. " : rs.breedable ? "Say ?fertile on to come into heat for it. " : "Say ?breedable on (and ?fertile on) to come into heat for it. ") + "Every time you're bred goes in the stud book, read out to the farm each night." : "Breedin' season: you're out. No heat, and you're not in the stud book.");
    }
    const w0 = season();
    c.reply("\u{1F525} Breedin' season is the 15th to the 21st each month" + (isBreedWeek() ? ", and it's on right now!" : ".") + " You're " + (d.optIn[sender] ? "in" : "out") + " (?season on / off). ?season book shows the stud book." + (isBreedWeek() && d.optIn[sender] ? "\nYou've been bred " + (w0.bred[sender] || 0) + " times this season" + (A.makesSemen(sender) ? " and covered " + (w0.covers[sender] || 0) : "") + "." : "") + champText());
  }
  function champText() {
    const c = (D3().champions || []).slice(-1)[0];
    return c ? "\n\u{1F451} Last season's most-bred: " + api3.name(c.dam) + " (" + c.times + ")" + (c.stud ? " \xB7 busiest stud: " + api3.name(c.stud) + " (" + c.covers + ")" : "") : "";
  }
  function companion(mn) {
    const r = api3.rec(mn);
    if (!r) return null;
    const d = D3(), p = api3.prod(mn), f = along2(p), cards = [];
    if (f !== null) {
      const st = stageOf(f), days = Math.max(0, Math.ceil((p.preg.due - Date.now()) / 864e5));
      cards.push({
        title: "Expectin'",
        bars: [{ label: "Along", value: Math.round(f * 100) + "%", pct: f * 100, kind: "good" }],
        lines: [["Stage", st.label], ["Belly size", bellySize(f) + " of 5"], ["Due", days ? "in " + days + " day" + (days === 1 ? "" : "s") : "any time now"], ["Sired by", p.preg.sires.map(api3.name).join(" & ")]]
      });
    }
    const w = season(), seasonLines = isBreedWeek() && d.optIn[mn] ? [["Bred this season", String(w.bred[mn] || 0)]].concat(api3.makesSemen(mn) ? [["Covers this season", String(w.covers[mn] || 0)]] : []) : void 0;
    cards.push({
      title: "Breedin' season",
      note: "The 15th to the 21st each month. You come into heat for it if you're breedable and fertile; studs fill faster. Every breedin' goes in the stud book, read out each night, and the most-bred is crowned on the last one.",
      lines: seasonLines,
      toggles: [{ label: "Join breedin' season", on: !!d.optIn[mn], cmd: "season " + (d.optIn[mn] ? "off" : "on") }],
      chips: isBreedWeek() ? [{ text: "on now", kind: "alert" }] : void 0,
      buttons: [{ label: "My pedigree", cmd: "pedigree" }, { label: "Stud book", cmd: "season book" }]
    });
    const mine = d.bookings.filter((b) => b.stud === mn || b.dam === mn);
    if (mine.length) cards.push({ title: "My bookings", lines: mine.map((b) => ["#" + b.id, api3.name(b.stud) + " \xD7 " + api3.name(b.dam)]) });
    if (api3.isStaff(mn)) cards.push({ staff: true, title: "Stud bookings", text: bookingsText(), input: { placeholder: "Rex Bessie", label: "Book (stud, who)", cmd: "book" } });
    if (r.roles && r.roles.length) cards.push(...pairsCards(mn));
    const mc = midwifeCard(mn);
    if (mc) cards.push(mc);
    return { cards };
  }
  connect({
    name: "breeding",
    label: "Breeding",
    version: "1.3.0",
    // (its addon.json's, put in by the build)
    guide: "Pregnancy now has stages (early, showin', heavy, nestin') with a belly size 1\u20135, cravings, and kicks nearby people can see. Breedin' season is the 15th\u201321st of each month: ?season on to come into heat for it (studs fill faster and get pent up sooner). Every breedin' goes in the stud book, read out each night from 9 pm; the most-bred is crowned on the last night (10 ribbons, 5 for the busiest stud). ?season book shows it. Staff: ?book <stud> <who>, ?book, ?book done <#>." + MIDWIFE_GUIDE + PAIRS_GUIDE,
    setup(a) {
      api3 = a;
      D3();
      pairsSetup(a, D3);
      midwifeSetup(a, D3, { claim: MIDWIFE, born: MORE2.BIRTH_MIDWIFE });
    },
    commands: {
      ...pairsCommands,
      // ?book lists them (anyone) · staff: ?book <stud> <who> adds one, ?book done|remove <#>
      book: { usage: "book [<stud> <who>]", aliases: ["bookings"], private: true, run: (c) => {
        if (!c.args.length) return c.reply(bookingsText());
        if (!c.api.isStaff(c.sender)) return c.reply("Only staff add stud bookings, sugar. ?book shows the list.");
        cmdBook(c);
      } },
      // the "Expectin'" card, for people without the Companion
      belly: { usage: "belly", private: true, run: (c) => {
        const t = c.args[0] ? c.api.find(c.args[0]) : c.sender, p = t && c.api.prod(t), f = along2(p);
        if (f === null) return c.reply((t === c.sender ? "You're" : c.api.name(t) + " is") + " not expectin' right now, sugar.");
        const days = Math.max(0, Math.ceil((p.preg.due - Date.now()) / 864e5));
        c.reply("\u{1F930} " + c.api.name(t) + ": " + stageOf(f).label + " \xB7 belly size " + bellySize(f) + " of 5 \xB7 " + Math.round(f * 100) + "% along \xB7 due " + (days ? "in " + days + " day" + (days === 1 ? "" : "s") : "any time now") + " \xB7 sired by " + p.preg.sires.map(c.api.name).join(" & "));
      } },
      season: { usage: "season on|off|book", aliases: ["breedweek", "studbook"], private: true, run: cmdBreedweek },
      ...midwifeCommands
    },
    on: { tick: () => {
      midwifeTick();
      tick();
    }, birth: onBirth, labour: midwifeLabour, labourStuck: midwifeStuck, bred: (...x) => {
      onBred(...x);
      pairsBred(...x);
    } },
    // signed-up studs fill half again faster during breedin' season
    rates: { semen: (mn) => isBreedWeek() && D3().optIn[mn] ? 1.5 : 1 },
    companion
  });
})();
