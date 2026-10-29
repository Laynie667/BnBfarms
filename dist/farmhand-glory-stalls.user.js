// ==UserScript==
// @name         BnB Farm add-on: Glory stalls
// @namespace    bnbfarm
// @version      1.10.1
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-glory-stalls.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-glory-stalls.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Glory stall spots: simulated scenes every 10-30 minutes (one stranger, a queue, or two or three at once through different holes), real visitors, shifts, punishment shifts and a board. Runs on the farm bot's computer, next to the Farmhand Bot script.
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
  function animalOf(api2, mn) {
    let k = "default";
    try {
      k = api2 && api2.species && api2.species(mn) || "default";
    } catch (e) {
    }
    const w = ANIMALS[k] || ANIMALS.default, b = bodyOf(api2, mn), male = !!(b && (b.g === "male" || b.g === "femboy"));
    return { key: ANIMALS[k] ? k : "default", kin: KIN[k] || null, a: male ? w.m : w.f, young: w.young, call: w.call, sound: pick(w.sound), sounds: w.sound, male };
  }

  // addons/glory-stalls/scenes-more.js
  var OWN = {
    any: {
      early: [
        "{c}%n's own cock stirs and fills against the boards, untouched, a little harder with every push.",
        "{c}Nobody's laid a finger on %n's cock, and it's hard anyway, bobbing under them in time.",
        "{c}{nv}%n's balls draw up tight the moment the stranger gets going.",
        "{t}%n's tits sway with every stroke, nipples brushing the rough wood.",
        "{t}%n's nipples have gone tight and pebbled, and every push rubs them on the boards.",
        "{nt}%n's bare chest is pressed flat to the warm wood, nipples catching on the grain.",
        "{fb}%n's soft little chest is flushed pink, and their cock is already leaking onto the straw.",
        "{fu}%n's cock and pussy both throb at once, and they can't tell which one to feel first.",
        "{v}%n's pussy has gone slick and swollen already, and nobody's even been near it.",
        "%n's skin prickles hot from their ears all the way down their back.",
        "%n's toes curl in the straw and stay curled.",
        "A flush creeps up %n's throat and over their cheeks, hot enough to feel."
      ],
      mid: [
        "{c}%n's cock slaps their belly with every thrust, drooling a string of wet onto the straw.",
        "{c}{nv}Every stroke rocks %n's balls, heavy and drawn up tight, and their cock jerks with it.",
        "{c}A clear drip hangs from the tip of %n's cock and swings with every thrust before it falls.",
        "{c}%n's cock bounces stiff and neglected under them, leaking a little more every time they're rocked forward.",
        "{t}%n's tits bounce and slap together, heavy, nipples hard as pebbles.",
        "{t}Every thrust drags %n's nipples over the wood until they're swollen and sore and aching for more.",
        "{t}%n's tits are squashed flat against the boards, spilling out to the sides with every push.",
        "{nt}%n's chest heaves against the wall, nipples rubbed raw on the grain, and it only makes them harder.",
        "{fb}%n's little cock bounces untouched, and they're blushing all the way down their chest.",
        "{fu}%n's cock bobs and drips while their pussy clenches, and both of them ache.",
        "{v}{nc}%n's pussy is slick and swollen, dripping down their thighs in long, shiny trails.",
        "%n's belly tightens on every stroke, a hot coil winding lower and lower.",
        "Sweat runs down the dip of %n's back and pools there, and every thrust sends it trickling.",
        "%n's thighs quiver and won't stop."
      ],
      late: [
        "{c}%n's cock is so hard it hurts, throbbing against the boards, right on the edge with nobody touching it.",
        "{c}{nv}%n's balls pull up tight. Their cock jerks once, twice, and starts leaking a steady stream onto the straw.",
        "{c}Without a hand on it, %n's cock spurts across the boards, pumped out of them by every thrust.",
        "{t}%n's tits jolt and bounce so hard it aches, nipples throbbing.",
        "{t}%n's nipples are scraped raw on the boards and so hard they sting.",
        "{nt}%n's nipples are rubbed raw from the wood and so stiff they ache.",
        "{fb}%n's little cock twitches and spills all on its own, and they whimper at how easy it was.",
        "{fu}%n cums from both at once, cock spurting and pussy squeezing, and the stall goes white for a second.",
        "{v}%n's pussy spasms and gushes, soaking their thighs and the straw under them.",
        "%n's legs shake so hard they can barely stay where they've been put.",
        "%n's whole body goes tight as a bowstring and stays there, trembling."
      ]
    },
    butt: {
      early: [
        "{c}{nv}Each push presses right on the spot behind %n's cock, and it jerks like somebody touched it.",
        "{c}{nv}%n's cock hangs heavy and starts to drip the moment the stranger's all the way in.",
        "{v}%n's pussy clenches on nothing every time their ass is filled, empty and jealous."
      ],
      mid: [
        "{c}{nv}It grinds over %n's sweet spot on every stroke, and a long string of wet hangs from their cock.",
        "{c}{nv}%n's cock leaks steadily, milked from the inside, every stroke squeezing out a little more.",
        "{c}{nv}%n's cock throbs in time with every stroke, so stiff it lifts off their belly, and nobody's touched it once.",
        "{v}%n's pussy drips, empty and aching, while their ass gets all the attention.",
        "{fu}%n's pussy clenches empty and their cock leaks, both left alone while the stranger uses their ass."
      ],
      late: [
        "{c}{nv}It hammers the spot behind %n's cock until they spill, hands-free, in thick helpless pulses.",
        "{c}{nv}%n is fucked right over the edge from the inside, cock jerking and spurting onto the straw without a touch.",
        "{v}%n's pussy clenches and gushes on nothing while their ass is pounded."
      ]
    },
    vulva: {
      early: [
        "{c}%n's cock stands stiff the moment their pussy is filled.",
        "{v}%n's clit throbs, swollen and slick, every time the stranger bottoms out.",
        "{v}%n's pussy grips and flutters around it, already greedy for more."
      ],
      mid: [
        "{v}Every stroke grinds over %n's clit until it's aching and twitching.",
        "{c}%n's cock bobs and slaps their belly in time with the one in their pussy.",
        "{v}%n is so wet the straw under them is soaked through.",
        "{v}%n's pussy makes the filthiest sounds, slick and sucking, on every pull back."
      ],
      late: [
        "{v}%n's pussy clamps down and flutters, squeezing, cumming hard around it.",
        "{c}%n's cock spurts untouched as their pussy is pounded over the edge.",
        "{v}%n squirts all over the stranger and the boards, helpless, and the stranger laughs and keeps going."
      ]
    },
    mouth: {
      early: [
        "{c}%n's cock twitches every time the stranger slides over their tongue.",
        "{v}%n's pussy throbs, empty, every time their mouth is filled."
      ],
      mid: [
        "{c}Every time it hits the back of %n's throat, their own cock jerks and drips.",
        "{v}%n is soaking wet from nothing but having their mouth used.",
        "{t}Drool runs off %n's chin and drips onto their tits.",
        "{nt}Drool runs off %n's chin and down their bare chest."
      ],
      late: [
        "{c}%n's cock throbs and leaks steadily onto the straw, worked up from nothing but a throat full of cock.",
        "{v}%n's thighs are slick and shaking, their pussy clenching on nothing, and nobody's touched them there once.",
        "{t}%n's tits are slick with drool, and their nipples ache."
      ]
    }
  };
  var GEAR = {
    collar: [
      "A hand snakes through the hatch, hooks two fingers in %n's collar and holds them there.",
      "%n's collar is gripped and twisted, just enough to remind them who's holding on.",
      "The tag on %n's collar clinks against the boards with every thrust.",
      "Somebody reads the name on %n's collar out loud through the boards, and laughs."
    ],
    leash: [
      "Somebody finds %n's leash dangling and loops it round the post, short. %n can't lean away an inch.",
      "%n's leash is pulled taut through the slats, and every tug drags them back onto the stranger.",
      "The leash clipped to %n gets wrapped once round a fist. Now the stranger steers."
    ],
    bell: [
      "The bell at %n's throat rings with every stroke, and the whole row can hear how hard they're being used.",
      "Ding, ding, ding: %n's bell keeps time for everybody outside.",
      "%n's bell jangles wildly, and somebody down the aisle laughs at the sound."
    ],
    blind: [
      "%n can't see a thing behind the blindfold. There's only touch and heat and the breathing through the boards.",
      "Blindfolded, %n never knows what's coming until it's already happening.",
      "Every touch lands on %n out of the dark, and they jump at each one."
    ],
    hood: [
      "Inside the hood, %n's world has shrunk to their own breathing and whatever's using them.",
      "The hood muffles everything. %n only knows the stranger by what's being done to them.",
      "%n's hooded head bumps the boards with every thrust, as nameless as the stranger."
    ],
    gag: {
      notMouth: [
        "%n moans into their gag, a thick wet sound that goes nowhere.",
        "Drool runs out round %n's gag and strings down onto the straw.",
        "%n tries to say something. The gag turns it into a soft, useless noise, and the stranger laughs.",
        "Whatever %n means to say, the gag says it for them: mmph."
      ]
    },
    ringGag: {
      mouthOnly: [
        "The ring holds %n's mouth wide open, and they have no say at all in what goes into it.",
        "%n's jaw is held open by the ring, so the stranger never has to ask."
      ],
      notMouth: [
        "Spit pours freely through %n's ring gag, down their chin and onto their chest.",
        "%n's mouth hangs open round the ring, drooling, and every moan comes out wet and wide."
      ]
    },
    arms: [
      "%n's bound arms strain once and give up. They're not going anywhere.",
      "With their arms tied, %n can't brace, can't push back, can't do anything but take it.",
      "The ropes on %n's arms creak in time with every stroke.",
      "%n's tied hands open and close behind them, grabbing at nothing."
    ],
    paws: [
      "%n's mittened paws scrabble at the boards, useless, unable to grip a thing.",
      "%n paws at the wall with their padded hands. They can't hold on, so they just get rocked.",
      "%n's hands are stuffed into paws. They can't even make a fist about it."
    ],
    legs: [
      "%n's bound legs can't spread any wider or close an inch. They stay exactly as open as they were tied.",
      "%n's ankles are bound, so all they can do is wobble on the spot and take it."
    ],
    nipples: [
      "The clamps on %n's nipples swing with every thrust, each swing a bright little bite.",
      "Something tugs the chain on %n's nipples through the slats and holds it taut, and %n squeals.",
      "%n's clamped nipples throb in time with the stranger's strokes."
    ],
    cage: [
      "{c}%n's caged cock strains against the bars, leaking through them in a slow, helpless drip.",
      "{c}Locked in its cage, %n's cock swells and pushes and gets nowhere. It just drips.",
      "{c}Every stroke squeezes a little more out of %n's caged cock, dribbling through the bars onto the straw.",
      "{c}%n's cage is full and aching, and the stranger never touches it once."
    ],
    plugBack: {
      notButt: [
        "The plug in %n's ass shifts and grinds with every stroke from the other side.",
        "%n's plug gets nudged deeper with every thrust, and they clench round it without meaning to.",
        "With their ass already plugged, every stroke makes %n feel twice as full."
      ]
    },
    plugFront: {
      notVulva: [
        "Whatever's stuffed in %n's pussy grinds deeper with every stroke, and they clench round it.",
        "%n's pussy is already plugged, so every stroke squeezes them full from both sides."
      ]
    },
    harness: [
      "Somebody grabs %n's harness through the hatch and uses it like a handle, hauling them back onto every stroke.",
      "%n's harness creaks, gripped by a strange hand and pulled tight with each thrust."
    ],
    noseRing: [
      "A finger hooks %n's nose ring through the slats and tugs. %n follows it, of course.",
      "%n's nose ring gets a teasing flick from outside, and they snort."
    ],
    ears: [
      "%n's ears are scratched through the slats, rough and fond, like a good animal's.",
      "Somebody tugs one of %n's ears and laughs when they squeak."
    ],
    hooves: [
      "%n's hooves scrape and clatter on the boards, hunting for footing and never quite finding it.",
      "%n's hoof boots slip in the straw, and the stranger just hauls them back into place."
    ],
    heels: [
      "%n's heels skid on the boards with every thrust, ankles wobbling.",
      "Up on their heels, %n can't brace properly, and they're rocked off balance again and again."
    ],
    latex: [
      "%n's latex squeaks against the boards with every thrust, slick and shining.",
      "The rubber on %n is hot and tight, and every stroke makes it creak.",
      "Sweat pools under %n's latex, and it squelches softly every time they're shoved forward."
    ]
  };
  var KIND_POOLS = {
    cow: [
      "{t}%n's heavy udder sways under them with every stroke, and the stranger reaches through to give it a squeeze.",
      "{t}The stranger gives one of %n's teats a tug through the gap, like they're checkin' how full the cow is.",
      "The stranger slaps %n's flank like they're checking a heifer at market.",
      "{m}The stranger slaps %n's flank like they're checking a young bull at market.",
      "A moo is fucked right out of %n, then another, and somebody down the row moos back."
    ],
    horse: [
      "%n stamps a foot and tosses their head, snorting like a pony being broke to harness.",
      "%n's breath comes in hard snorts through their nose, a horse's breathing.",
      "The stranger grips %n's mane through the slats and holds on like they're riding."
    ],
    dog: [
      "%n's tongue lolls out and they pant, hot and quick, like the good animal they are.",
      "%n whines high in their throat and pushes back, like they're in heat.",
      "%n's hips twitch and wiggle, a happy, helpless wag with no tail needed."
    ],
    cat: [
      "%n's back dips and their hips rise, a cat presenting without being told.",
      "A rumbling purr shakes out of %n and goes on and on.",
      "%n kneads at the boards with their fingers, slow, the way a cat does when it's being stroked just right."
    ],
    pig: [
      "%n grunts and squeals on every stroke, and the stranger laughs at the noises.",
      "%n is shoved face first into the straw like a pig in the mud, and they don't mind one bit."
    ],
    bunny: [
      "%n's foot thumps the boards, fast and helpless, the way bunnies do when it's too good.",
      "%n's nose twitches and they squeak with every push."
    ],
    goat: [
      "%n bleats on every thrust, high and wavering, and can't stop.",
      "%n butts their head against the boards, stubborn as a goat, and it only makes the stranger laugh."
    ],
    deer: [
      "%n trembles all over like a startled deer, but they don't bolt.",
      "%n's breath comes high and fast, a deer's breathing, every stroke a little gasp."
    ],
    rat: [
      "%n squeaks on every thrust, high and helpless, whiskers twitchin' against the boards.",
      "%n's long tail curls tight round their own thigh, and they chitter and push back for more like a greedy little gutter rat.",
      "%n's round ears flatten back, and they squeak so needy the next stall over starts laughin'."
    ],
    dragon: [
      "%n growls low through the boards on every thrust, claws scrapin' the wood, tail lashin' behind them.",
      "%n's wings press flat against the stall walls and shiver, and a hot, smoky breath fogs the hole.",
      "%n lets out a ragged little rawr and pushes back for more like a dragon guardin' its hoard."
    ],
    goblin: [
      "%n cackles and moans by turns, enjoying themselves far too much for somebody stuck in a stall.",
      "%n mutters filthy goblin encouragement through the wall, and the stranger takes it to heart."
    ]
  };
  var KIND = {
    cow: KIND_POOLS.cow,
    bull: KIND_POOLS.cow,
    horse: KIND_POOLS.horse,
    pony: KIND_POOLS.horse,
    dog: KIND_POOLS.dog,
    pup: KIND_POOLS.dog,
    wolf: KIND_POOLS.dog,
    fox: KIND_POOLS.dog,
    cat: KIND_POOLS.cat,
    kitt: KIND_POOLS.cat,
    pig: KIND_POOLS.pig,
    bunny: KIND_POOLS.bunny,
    rabbit: KIND_POOLS.bunny,
    goat: KIND_POOLS.goat,
    sheep: KIND_POOLS.goat,
    deer: KIND_POOLS.deer,
    goblin: KIND_POOLS.goblin,
    rat: KIND_POOLS.rat,
    dragon: KIND_POOLS.dragon
  };
  var SOUND = [
    "Out of %n comes %snd, loud enough to carry down the row.",
    "%n can't help it: %snd, right there in the stall.",
    "Every stroke pushes %snd out of %n.",
    `The stranger laughs at %snd from %n. "That's it. Make your noise."`,
    "%n bites their lip, and %snd gets out anyway."
  ];
  var MORE = {
    ARRIVE: [
      "Somebody leans on the boards beside %n and just breathes for a while, working up to it.",
      "The chalk scratches on %n's door. Somebody's adding their own mark before they've even started.",
      "Boots stop. A long, considering silence, then the rustle of a belt coming undone.",
      "%n hears someone spit, swear softly and fumble with buttons in a hurry.",
      "The smell of somebody's pipe drifts in first, then the shape of them at the hole.",
      "A pair of knees thumps down on the boards outside %n's stall. Whoever it is means to settle in.",
      "Somebody hums a hymn as they come down the row, and stops humming at %n's hole.",
      'The latch rattles. A voice says, mostly to itself, "Right. This one."',
      "Someone taps the boards three times by %n's hip, like knocking on a door they mean to come through.",
      "A shadow fills the gap at the hole, and %n feels the warmth of somebody standing right there.",
      "Somebody's been out working the fields; %n can smell sun and sweat and hay on them before anything else.",
      "Two pairs of boots stop at %n's stall. A coin is flipped. One pair walks on, grumbling.",
      'A low whistle, then: "They said this stall was the good one."'
    ],
    REVEAL: {
      human: [
        "A %size cock nudges through the hole, thick veins standing out, the head flushed dark and slick.",
        "A %size cock slips through and bobs there, curved up and twitching, a string of wet hanging from the tip.",
        "Through the hole comes a %size cock, half hard and filling fast as the stranger looks at %n.",
        "A %size cock pushes through, uncut and heavy, the skin sliding back as it stiffens."
      ],
      canine: [
        "A %size dog cock juts through the hole, red and glistening, the sheath pushed back and the knot already starting.",
        "Pointed and slick, a %size dog cock pokes through, twitching, spitting little warm drips onto the straw.",
        "A %size canine cock slides through, the knot a fat swell just behind the hole, already throbbing."
      ],
      equine: [
        "A horse cock pushes through, %size, the flat head blooming as it comes, a heavy drip swinging from the end.",
        "It takes a while for all of it to come through: %size, mottled and heavy, a thick ring standing out halfway along the shaft.",
        "A long, thick horse cock sags through the hole, %size, and the stranger has to lift it with both hands to aim."
      ],
      feline: [
        "A %size feline cock flicks through the hole, quick and eager, its soft barbs bristling.",
        "Through the gap comes a short, thick barbed cock, %size, twitching with quick little pulses.",
        "A %size cat's cock nudges through, every soft spine standing up as it throbs."
      ],
      draconic: [
        "Heat comes through the hole first, then a %size dragon's cock, ridged and slick, glistening like it's oiled.",
        "A %size draconic cock pushes through, scaled at the root, ridges flaring as it hardens.",
        "Something ridged and heavy slides through, %size, the tip tapered and the base thick as a wrist."
      ],
      double: [
        "Two %size cocks push through the widened hole, one stacked over the other, both twitching for somewhere warm.",
        "A pair of %size cocks slide through together and bump against %n at once, one high and one low.",
        "The stranger shoves two through at once, %size each, and they slap wetly against %n in turn."
      ]
    },
    TEASE: {
      mouth: [
        "It rests on %n's bottom lip, heavy and hot, and waits for %n's tongue to come looking.",
        "The stranger traces %n's mouth with the tip like they're painting it on.",
        "It bumps against %n's cheek, then their chin, then their lips, never quite where %n wants it.",
        "Salt and musk fill %n's nose as it slides along their cheek and settles at their lips.",
        "The tip slips just past %n's lips and rests on their tongue, perfectly still, until %n has to suck."
      ],
      vulva: [
        "It spreads %n open with the head and holds there, letting the cool air of the stall in.",
        "The stranger rubs it along %n's slit slowly enough that %n can feel every vein of it.",
        "It taps against %n's clit, light and wet, then pulls back to make them wait.",
        "%n's pussy lips are parted by the tip, kissed by it, and left open and wanting.",
        "It pushes in a finger's width, pulls back, pushes in a little more, teasing %n open."
      ],
      butt: [
        "The stranger smears slick round %n's ass with the head and presses, never quite enough.",
        "It nestles in the crack of %n's ass and throbs there, hot and heavy, letting %n know what's coming.",
        "A thumb holds %n's ass open while the tip circles the rim, slow and slick.",
        "It presses in just a little, stretches %n's ring, then slips back out to do it again.",
        "%n's ass is teased so long it starts to flutter and give before the stranger even pushes."
      ]
    },
    FUNNEL: [
      "A slow drip of wet patters into the funnel, and %n's throat works around every drop.",
      "The stranger rests their cock on the funnel's lip and strokes, unhurried, watching %n's eyes.",
      "%n can hear every wet stroke over the funnel, and can do nothing but wait for what's coming down it.",
      "The stranger taps the head against the funnel like a spoon on a cup. Dinner's coming.",
      "A long string of wet drips from the tip into the funnel and slides down into %n."
    ],
    ENTRY: {
      human: {
        mouth: ["It slides in over %n's tongue and keeps coming until it bumps the back of their throat.", "The stranger eases it in slow, letting %n's lips stretch around every inch."],
        vulva: ["It pushes into %n's pussy with a slick, steady glide, all the way to the root.", "One firm push and it's buried in %n's pussy, the stranger sighing like they've come home."],
        butt: ["It presses and presses until %n's ass gives, then sinks in deep with a long groan from the stranger.", "It slides into %n's ass slow and greased, one patient inch at a time."]
      },
      canine: {
        mouth: ["It darts into %n's mouth and starts humping at once, spurting little salty jets across their tongue.", "The tapered tip finds %n's throat quick and pushes in, the knot thumping against their lips."],
        vulva: ["It finds %n's pussy and drives straight in, quick, frantic, the knot bumping their lips on every jab.", "It jabs at %n twice, misses, then plunges into their pussy and starts going like it's starving."],
        butt: ["It slips into %n's ass fast and slick and starts humping at once, no patience at all.", "It pushes into %n's ass in quick short jabs, the knot already swelling against the rim."]
      },
      equine: {
        mouth: ["%n's lips are stretched round the flat head and no further; it's all their mouth can hold.", "The broad head pushes at %n's mouth until their jaw is open as wide as it goes, and then it pushes in."],
        vulva: ["The flat head stretches %n's pussy so wide they can't breathe, then sinks in, slow and enormous.", "Inch by inch the horse cock pushes into %n's pussy, until they're stuffed and shaking and there's still more outside."],
        butt: ["It takes forever and %n feels every second of it: the horse cock forcing their ass open around that broad flat head.", "%n's ass is stretched round the horse cock till it burns, and then it slides deeper."]
      },
      feline: {
        mouth: ["It slips into %n's mouth quick and eager, the barbs prickling over their tongue.", "The barbed cock pushes past %n's lips, every soft spine tickling the roof of their mouth."],
        vulva: ["It darts into %n's pussy, the barbs raking softly on the way in, and %n squeaks.", "Every little barb catches as it slides into %n's pussy, a fizzing, prickling stretch."],
        butt: ["The barbs drag on %n's ring as it pushes in, a strange sharp sweetness.", "It slips into %n's ass in one quick push, barbs bristling inside."]
      },
      draconic: {
        mouth: ["Ridge after ridge slides over %n's tongue, hot as a stove, until their mouth is full.", "It pushes into %n's mouth, the ridges popping past their lips one after another."],
        vulva: ["It pushes into %n's pussy one ridge at a time, each ring popping in and making %n gasp.", "The heat of it hits first, then the ridges, stretching %n's pussy wider with every one."],
        butt: ["%n's ass is opened one ridge at a time, each one bigger than the last.", "It pushes into %n's ass, hot and ridged, every ring stretching them and slipping in with a pop."]
      },
      double: {
        mouth: ["One cock slides over %n's tongue while the other rubs along their cheek, waiting its turn."],
        vulva: ["Both cocks push in together, one into %n's pussy and one into %n's ass, and %n can't breathe for the fullness."],
        butt: ["Both cocks push in together, one into %n's pussy and one into %n's ass, and %n can't breathe for the fullness."]
      }
    },
    STRETCH: {
      mouth: [
        "%n's jaw aches round it, opened wider than it's ever been asked to go.",
        "There's no room left in %n's mouth for their tongue. It's pinned flat underneath.",
        "%n's lips are stretched thin and shiny around it, and the corners of their mouth sting."
      ],
      vulva: [
        "%n's pussy is stretched so full the skin is tight and shining round it.",
        "%n can see the bulge of it in their own belly, pushing up from inside.",
        "It's too big, nearly, and %n's pussy aches and clenches and somehow takes it anyway."
      ],
      butt: [
        "%n's ass is stretched so tight around it that every heartbeat throbs there.",
        "It's so deep in %n's ass they can feel it pressing up under their belly button.",
        "%n has to breathe slow and loose just to keep taking it, their ass stretched to the limit."
      ]
    },
    RHYTHM: {
      mouth: {
        early: ["It slides in and out of %n's mouth slowly, letting their tongue learn every ridge and vein.", "Short strokes over %n's tongue, the stranger groaning softly each time %n's lips close."],
        mid: ["The stranger fucks %n's mouth like it's theirs, steady and deep, spit dripping from the hatch.", "It pulls all the way out, slaps %n's tongue, and pushes all the way back in.", "%n's mouth makes wet, sucking noises with every stroke, loud in the little stall."],
        late: ["The stranger holds %n's head against the boards and drives into their throat, fast and rough.", "Every stroke goes all the way down %n's throat now, and the stranger groans on every one."]
      },
      vulva: {
        early: ["It moves in %n's pussy slow and shallow, then a little deeper, then deeper still.", "The stranger rocks into %n gently, letting their pussy stretch and soften round it."],
        mid: ["It drives into %n's pussy with long, rolling strokes, the boards creaking in time.", "The stranger grinds in deep and circles, buried, before pulling out and doing it again.", "It fucks %n's pussy with a steady, squelching rhythm that can be heard down the row."],
        late: ["It slams into %n's pussy hard enough to shove them forward on every stroke.", "The stranger's hips bang the boards as they pound %n's pussy, chasing their finish."]
      },
      butt: {
        early: ["It rocks in %n's ass in tiny strokes, giving them time to open.", "The stranger moves slow and careful in %n's ass at first, letting the stretch settle."],
        mid: ["It strokes in and out of %n's ass long and smooth, every inch dragged out and pushed back.", "The stranger finds a rolling, filling rhythm in %n's ass and keeps it.", "It holds deep in %n's ass, grinds, pulls back, and does it again."],
        late: ["It hammers %n's ass now, the stall rattling, the stranger grunting on every stroke.", "The stranger fucks %n's ass rough and fast, hips smacking the boards."]
      }
    },
    PACE_LINE: {
      rough: ["The stranger's grip on the hatch is white-knuckled, and every stroke into %n is a shove.", "No warm-up, no mercy. The stranger takes %n hard from the first stroke to the last.", "Each thrust jolts %n forward so hard their teeth click."],
      slow: ["The stranger takes their time, so slow that %n starts to beg with their body.", "Long, slow, deliberate strokes, with a pause at the end of each one that leaves %n aching.", "Every stroke takes so long that %n forgets what fast even feels like."],
      steady: ["Steady as a pump in the dairy, the stranger works %n without missing a beat.", "The stranger finds a rhythm with %n and sticks to it, comfortable and sure.", "It's not hurried and not lazy: a good, honest rhythm, and %n settles into it."],
      nervous: ["The stranger keeps stopping to gasp and start again, like they can't quite believe it.", "Little shaky breaths come through the boards with every stroke into %n.", "Every time %n moans, the stranger loses their rhythm and has to find it again."],
      deep: ["The stranger hardly pulls back at all, just grinds deep in %n and holds there.", "Every stroke ends with the stranger pressed flush to the wall, as deep in %n as they can get.", "Buried deep, the stranger rocks in tiny strokes, never leaving %n for a moment."]
    },
    TYPE_RHYTHM: {
      human: ["The stranger mutters under their breath with every stroke into %n, swearing softly.", "%n can feel the stranger's heartbeat in it, quick and hard.", "A hand comes through the hatch and grips whatever of %n it can reach, holding on."],
      canine: ["It humps %n in a frantic blur, quick little jabs, the knot swelling bigger by the second.", "The dog cock pulses warm little spurts into %n with every jab.", "The stranger's panting through the boards, quick and hot, like an animal."],
      equine: ["The horse cock flares a little more on every pull back, catching inside %n.", "Each slow stroke shoves %n forward and drags them back, like being worked by a steam engine.", "%n can feel the thick ring halfway along it pass in and out of them on every stroke."],
      feline: ["Quick, sharp thrusts, and the barbs leave %n tingling and twitching after every one.", "The barbed cock pumps fast and short, and %n can't keep still under it.", "Every pull back rakes %n with those soft little barbs, and they gasp each time."],
      draconic: ["The heat of it seeps into %n until they're sweating from the inside out.", "The ridges ripple and flex inside %n like the thing's alive on its own.", "Each ridge bumps over %n's tightest spot on the way out, one after another."],
      double: ["The two cocks rub together through the thin wall inside %n, and the stranger groans.", "%n is stretched twice over, and every stroke is two strokes.", "They pump into %n together, then in turns, and %n stops being able to tell the difference."]
    },
    REACT: {
      mouth: {
        early: ["%n's tongue is pressed flat and heavy under it.", "Salt floods %n's mouth, and they swallow without meaning to."],
        mid: ["%n's throat jumps and squeezes every time it's touched.", "%n's cheeks hollow round it whether they mean them to or not."],
        late: ["%n's vision swims, their throat stuffed and used.", "Spit and wet run from %n's mouth in long strings, and they can't close it."]
      },
      vulva: {
        early: ["%n's pussy opens up around it with a soft, wet sound.", "A shiver runs up from %n's pussy to their scalp."],
        mid: ["%n's hips rock back to meet it before they can stop themselves.", "%n's pussy squeezes and squeezes, milking every stroke."],
        late: ["%n's pussy is so tender and swollen that every stroke makes them cry out.", "%n is fucked through one peak and straight up the next."]
      },
      butt: {
        early: ["%n's ass clenches hard round it, then slowly, slowly lets go.", "%n's breath goes ragged as their ass is stretched full."],
        mid: ["%n's ass grips and loosens in waves, and every wave makes the stranger groan.", "%n's back arches on its own, offering their ass up for more."],
        late: ["%n's ass is fucked loose and slick and still it's taken harder.", "%n sobs into the straw, ass stuffed, every stroke too much and not enough."]
      }
    },
    SECOND_WIND: [
      "The stranger pulls out and lets %n hang empty for a long moment, then sinks back in, slower than before.",
      "A pause, a sip of something, a satisfied sigh, and the stranger starts on %n all over again.",
      "The stranger shifts to a wider stance, groans, and gets a second wind.",
      "It slides out and rubs along %n wetly, getting hard again, before it pushes back in."
    ],
    SWITCH: [
      "The stranger pulls out of %n's %from with a wet pop and, after a moment's thought, tries %n's %to.",
      `"Now this one," says the stranger, and leaves %n's %from for %n's %to.`,
      "It slips out of %n's %from, drips across the straw and presses into %n's %to instead.",
      "%n's %from is left empty and aching while the stranger takes their %to."
    ],
    BUILD: [
      "The stranger's breath catches, then catches again. Not long now.",
      '"Here it comes, here it comes," chants the stranger, barely above a whisper.',
      "It swells inside %n, thicker than it's been all scene, and throbs.",
      "The stranger's grip on the hatch tightens until the wood creaks.",
      "Everything the stranger has goes into the next three strokes, and %n knows exactly what's coming."
    ],
    PAINT: [
      "It slips free at the last second and empties over %where in heavy, hot spurts: %amt.",
      "The stranger aims and lets go, and %amt lands across %where, warm and thick.",
      '"Hold still for it," and %n does, and %amt glazes %where while the stranger groans.',
      "It jerks and spurts over %where, %amt, splashing and dripping, painting %n good and proper."
    ],
    PAINT_AFTER: [
      "It's drying tacky on %n's skin already, and it pulls every time they twitch.",
      "%n can smell it on themselves, strong and salty, and so will everybody else.",
      "{t}It runs down the curve of %n's tits and drips off their nipples onto the straw.",
      "{nt}It runs down %n's bare chest and gathers in their belly button.",
      "A drip of it hangs off the end of %n's nose and won't fall."
    ],
    KNOT_HOLD: [
      "%n tugs, once, and gasps. The knot isn't going anywhere, and neither are they.",
      "The stranger sighs against the boards and settles in. They're tied, and they'll stay tied a while.",
      "Every little throb of the knot pushes a bit more into %n, and there's nothing to do but feel it.",
      "%n is plugged tight with the knot, full and stuck and stretched, the stranger panting on the other side."
    ],
    KNOT_FREE: [
      "At last the knot shrinks enough to slip free with a thick, wet sound, and a flood comes after it.",
      "The knot pulls free with a pop that makes %n yelp, and everything it was holding in comes pouring out.",
      "It finally softens and slides out of %n, and a warm gush runs down their thighs behind it."
    ],
    AFTER_IN: {
      mouth: ["%n's mouth is full of the taste of it, and it'll be there for hours.", "%n swallows and swallows, and there's still more coating their tongue.", "A thick drop escapes the corner of %n's mouth and runs down their chin."],
      vulva: ["%n's pussy is so full it drips with every breath they take.", "Warm and heavy, the load sits deep in %n, and a slow trickle finds its way out.", "%n's pussy clenches round the emptiness and squeezes out a thick, warm drip."],
      butt: ["%n's ass twitches and leaks, slick and used.", "%n can feel the load deep in their belly, heavy and warm, sloshing a little when they move.", "A long drip slides out of %n's ass and down the back of their thigh."]
    },
    AFTER_OUT: [
      "%n is left marked and sticky, and nobody's coming with a cloth.",
      "It cools into a glaze on %n's skin that cracks a little when they move.",
      "Straw sticks to the wet patches on %n, and they look like exactly what they are: well used."
    ],
    FUNNEL_AFTER: [
      "%n swallows the last of it down the tube, throat working, eyes watering.",
      "The funnel gurgles empty, and %n's belly is warm and heavy with what went down it.",
      "Drops still trickle down the funnel's sides into %n long after the stranger's gone.",
      "%n hiccups, full, the taste of the stranger coating the whole way down."
    ],
    LEAVE: [
      "The stranger knocks twice on the boards, a little thank you, and goes.",
      "Footsteps fade, a door creaks, and %n is alone with what was left behind.",
      '"Same again tomorrow," says the stranger to nobody in particular, and leaves.',
      "The stranger wipes off on a rag hung by the hatch for just that, tosses it back, and walks off.",
      "Somebody jingles another coin into the honesty tin on their way out. Well earned.",
      "A last fond slap on the boards, and the stranger strolls off whistling."
    ],
    ATMOS: [
      "The tally chalk by %n's door has been worn down to a stub today.",
      "Somebody's left a bucket and a sponge at the end of the row. Nobody's used it.",
      "Down the row, someone's stall door creaks open and somebody wobbles out, bow-legged.",
      "The barn cat wanders past the gap under %n's door, sniffs, and moves on unimpressed.",
      "Rain patters on the roof, and the stalls fill with the smell of wet wood and warm bodies.",
      "Someone in the next stall is giggling breathlessly at something only they can see.",
      `A farmhand counts heads down the row out loud, and pauses at %n's door. "Still in there? Good."`,
      "The straw in %n's stall has gone flat and warm from their own body.",
      "Somewhere a gate bangs, and every head in the stall row turns toward the sound."
    ],
    NEXT_UP: [
      "The boards barely stop shaking before the next one leans on them.",
      '"Is it my turn?" somebody asks outside. It is.',
      "A new stranger, smelling of soap this time, steps up to %n's hole.",
      "There's a short scuffle outside over whose turn it is. The winner steps up to %n's hole."
    ],
    TAUNTS: [
      `"Somebody's lucky, owning this %a."`,
      '"Go on, %call for me. Louder."',
      '"Look at this %a, gagging for it."',
      '"They ought to charge more for this one."',
      `"Best hole in the barn, and it doesn't even have a name."`,
      `"You were made for a wall, weren't you."`,
      `"Somebody fetch a bucket, this one's leaking."`,
      `"I'll be back with my friends."`,
      '"Such a good %a. Such a good, empty %a."'
    ],
    PRAISES: [
      `"You're wonderful, you know that?"`,
      '"Thank you. Really. Thank you."',
      `"Perfect. You're perfect."`,
      '"Good %a. Such a good %a."',
      `"I'm going to dream about this stall."`,
      `"You're doing so well in there."`,
      `"That's the best I've had all week."`,
      `"Easy, sweetheart. I've got you."`
    ],
    PERSONAS: {
      greedy: {
        arrive: ["Somebody shoulders the last one out of the way and claims %n's hole for themselves.", "Hurried boots, a grunt, and the wall jolts. Somebody's in a hurry for %n."],
        leave: ["The greedy one tucks away, slaps the boards hard, and stomps off, already looking for the next stall.", "They take one last shove at %n's hole for good measure and leave without a backward glance."]
      },
      slow: {
        arrive: ["Someone sets down a stool outside %n's stall, sits, and sighs, like they've earned a long afternoon.", 'A patient voice: "No hurry, sweetheart. None at all."'],
        leave: ["The slow one stays a long time, resting against the boards, before ambling off.", "A last, lingering stroke of %n's skin through the hatch, and the slow one finally goes."]
      },
      talker: {
        arrive: [`"Well, hello there," a voice says at the hole. "Don't mind me, I'll do all the talking."`, "Somebody arrives mid-story, still chatting to a friend, and doesn't stop chatting as they unbuckle."],
        leave: ["The talker keeps up a running commentary all the way down the row and out of earshot.", `"Lovely chat," says the talker, though %n hasn't said a word, and off they go.`]
      },
      nervous: {
        arrive: ["Somebody's boots stop, back off, come back, and stop again at %n's hole.", 'A very quiet voice: "Is, um, is it alright if I?" Nobody answers. They take that as a yes.'],
        leave: ["The nervous one stammers a thank you and practically runs.", 'A shaky laugh, a mumbled "wow," and the nervous one is gone.']
      },
      regular: {
        arrive: ["The regular's knock, two slow and one quick. %n would know it anywhere.", `"Hello again," says a familiar voice, settling in at %n's hole like it's their own chair.`],
        leave: ["The regular pats the boards twice, fond, like saying goodnight to a horse.", '"Same time next week," promises the regular, and taps the knock on the way out.']
      },
      breeder: {
        arrive: ["Somebody stops at %n's stall and reads the chalk on the door twice before stepping up.", `A heavy, purposeful tread, and a voice: "This one'll do. This one'll take."`],
        leave: ["The breeder leaves a hand pressed flat over %n a long while, keeping it all in, before going.", '"Keep that warm," says the breeder, and goes off satisfied.']
      },
      quickie: {
        arrive: ['Somebody darts in from the yard, glancing over their shoulder. "Two minutes. Two minutes."', "A farmhand still holding a pitchfork leans it on the wall and steps straight up to %n."],
        leave: ["They're gone at a jog, buckling as they run.", "A hurried pat, a muttered thanks, and the door bangs. Break's over."]
      }
    },
    JOIN2: [
      "Somebody new leans on the board %where, watches for a while, then decides to join in.",
      `"Mind if I?" asks a voice %where. They don't wait to hear.`,
      "A second coin hits the tin, and the hatch %where swings open."
    ],
    JOIN3: [
      "The last hatch creaks open. %n has a stranger at every one now.",
      "A third stranger shoulders up to the boards and claims what's left of %n.",
      `"Don't leave me out," laughs a third voice, and the last hatch opens.`
    ],
    TOGETHER: {
      any: [
        "The two strangers grunt in turns, and %n is rocked between them like a boat.",
        "%n's %a and %b are both full, and every move one stranger makes, %n feels in the other.",
        "There's no rest for %n: when one stranger slows, the other speeds up.",
        "The strangers chat over %n like they're sharing a bench at the fair."
      ],
      spit: [
        "%n is pushed onto the cock in front by every stroke from behind, a perfect, filthy rhythm.",
        "Drool and moans spill out of %n's mouth together, round the cock that's filling it.",
        "The two strangers grip %n from both ends and simply use them between them.",
        "%n's throat is plugged and their behind is full, and the only sound they can make is a wet hum."
      ],
      dp: [
        "%n's pussy and ass are both packed full, and the two cocks grind against each other inside them.",
        "One slides out of %n's pussy as the other sinks into their ass, back and forth, never stopping.",
        "Stuffed twice over, %n's legs shake so hard the strangers have to hold them up.",
        "The two strangers find a rhythm together, and %n is filled from both sides at once, again and again."
      ],
      three: [
        "Every hatch has a stranger, and every stranger has a piece of %n.",
        "%n is rocked from three sides at once, and the stall rattles fit to come apart.",
        "Mouth, pussy and ass, all full, all moving, and %n lost in the middle of it."
      ]
    },
    FIRST_DONE: [
      "One stranger's done and stays to watch. The other is just getting started on %n.",
      "One hatch goes quiet. The other goes harder.",
      '"Your turn to finish," one says to the other, and the other picks up the pace on %n.'
    ],
    BOTH_AT_ONCE: [
      "They both go at once, groaning together, and %n is filled from both ends in the same heartbeat.",
      "A shout from one hatch, a groan from the other, and both of them empty into %n together.",
      "The two strangers finish in the same moment, and %n doesn't know which way to shake."
    ],
    ALL_DONE: [
      "One by one the hatches swing shut, and %n is left dripping in the quiet.",
      "The strangers laugh together as they leave the hatches. %n just hangs there, emptied of everything but what they left.",
      "The stall finally stops shaking and the last hatch swings shut. %n is full, sticky, and breathing hard.",
      "Nobody's left at any hatch. %n sags, leaking from everywhere they were used."
    ],
    ARRANGE: {
      punished: {
        open: [
          "%n is marched into the punishment stall and strapped into the frame, hips up and every hatch open. The farmhand chalks PUNISHED on the door and leaves.",
          "The frame's cuffs snap shut on %n's wrists and ankles. A farmhand checks each one, nods, and opens the hatches. The shift has begun.",
          "%n is bent over the bar and buckled down by a farmhand who doesn't say a word. The sign on the door is enough: PUNISHMENT, USE FREELY."
        ],
        remind: [
          "The punishment sign rattles on the door every time the stall shakes.",
          "%n strains against the frame, just to see. It doesn't give.",
          "Somebody outside taps the punishment sign and chuckles.",
          "The shift clock ticks on the wall above the frame. %n can't see it, only hear it."
        ],
        close: [
          "Still strapped, still open, still on the clock. The next one won't be long.",
          "The farmhand passes, glances in, and leaves %n locked in exactly as they are.",
          "Another mark on the tally. The punishment shift isn't over."
        ]
      },
      bound: {
        open: [
          "Tied as they are, %n is steered into the stall by their ropes and left kneeling where the farmhand puts them.",
          "%n is lowered onto the bench in their bonds and strapped down for good measure. The hatches are opened behind them.",
          "With their bonds already on, %n doesn't need much arranging: a nudge here, a push there, and they're in place."
        ],
        remind: [
          "%n's bonds creak with every stroke, holding them still for it.",
          "Tied, %n can't even turn to see who's using them.",
          "The ropes bite a little more each time %n is shoved forward.",
          "%n tests their bonds without thinking, and they hold as tight as ever."
        ],
        close: [
          "Still bound, %n is left for the next one.",
          "The farmhand doesn't come to untie %n. There's more to come.",
          "%n stays tied up and dripping, right where they were put."
        ]
      },
      voluntary: {
        open: {
          kneel: ["%n kneels right up close to the hatch and opens their mouth, nobody needing to ask.", "%n settles on their knees at the hatch, tips their head back, and waits."],
          bench: ["%n lays themselves across the bench and nudges their hips back against the hatch, eager.", "%n climbs onto the bench on their own, spreads their knees, and waits for company."],
          fours: ["%n sinks down onto all fours in the warm straw and backs up to the hatch, ready.", "On hands and knees in the straw, %n wiggles back until their rump meets the cool air at the hatch."],
          wall: ["%n leans into the hatch wall and lines themselves up with the openings, perfectly still.", "%n stands with their palms flat on the hatch wall, back arched, and waits to be used."]
        },
        remind: [
          "%n could stop any time. They push back for more instead.",
          "Nobody's making %n stay. They stay.",
          "The stall door is right there behind %n. They don't so much as glance at it.",
          "%n shifts to give the stranger a better angle, all by themselves."
        ],
        close: [
          "%n stays put, catching their breath, ready for whoever's next.",
          "%n doesn't move from the spot. They're not finished.",
          "The stranger's gone, and %n is already settling back into position."
        ]
      }
    }
  };

  // addons/glory-stalls/visitors-more.js
  var TYPES = {
    goblin: { w: 9 },
    orc: { w: 7 },
    bovine: { w: 5, flare: true },
    tentacle: { w: 4 },
    imp: { w: 5 }
  };
  var LOAD_X = { goblin: 2.2, orc: 1.8, bovine: 2, tentacle: 1.4, imp: 1.2 };
  var REVEAL = {
    goblin: [
      "A knobbly green cock pokes through the hole, %size, and behind it a pair of balls far too big for whoever's attached, swinging and heavy.",
      "Something short and green and very eager shoves through the hole, %size and twitching, with a cackle on the other side of the wall.",
      "A goblin cock bobs through the hole, %size, warty and hot, its owner hopping to reach and giggling the whole time."
    ],
    orc: [
      "A thick green cock slides through the hole, %size, veined like an oak root, and the wall groans as a big body leans on it.",
      "Through the hole comes an orc's cock, %size and heavy, dark green at the head, already dripping on the straw.",
      "A %size green cock pushes through, so thick the hole creaks around it, and a grunt like a bear's comes through the boards."
    ],
    bovine: [
      "The hole splinters a little as a bull's cock pushes through, %size, long and pink with a broad blunt head, and a snort shakes the wall.",
      "A minotaur's cock slides in, %size, heavy as a fence post, and two great hooves stamp in the straw outside.",
      "Something enormous and pink nudges through the hole, %size, with a heavy musk that fills the stall before it's halfway in."
    ],
    tentacle: [
      "Something wet slithers through the hole. Then another. Slick, searching tentacles, %size, feeling their way toward %n.",
      "A slimy tentacle-cock eases through the hole, %size and tapered, curling at the tip, and two thinner ones follow it in.",
      "The hole fills with glistening tentacles, the thickest one %size and ridged, all of them dripping and tasting the air."
    ],
    imp: [
      "A dusky red cock slips through the hole, %size, ending in a little spade-shaped tip, and the stall gets warmer.",
      "Through the hole comes an imp's cock, %size, ridged and hot as a coal, a giggle like a kettle whistle behind it.",
      "A %size red cock with a spaded tip wiggles through, and a pointed tail flicks the other side of the gap."
    ]
  };
  var ENTRY = {
    goblin: {
      mouth: ["It jabs past %n's lips quick and greedy, small enough to bob all the way in, the goblin squealing with glee."],
      vulva: ["It darts into %n's pussy and starts pumping at once, quick as a rabbit, those big balls slapping the wall."],
      butt: ["It jabs into %n's ass with no patience at all and the goblin cackles as it sinks in."]
    },
    orc: {
      mouth: ["It forces %n's jaw wide and fills their mouth to the back, the orc rumbling with satisfaction."],
      vulva: ["It splits %n's pussy open in one heavy shove, the orc grunting like he's lifting a log."],
      butt: ["It presses and presses at %n's ass until the ring gives with a stretch that makes %n gasp, and then it's in, deep."]
    },
    bovine: {
      mouth: ["The broad head fills %n's mouth to the corners and stops, all it can fit, pulsing on their tongue."],
      vulva: ["It pushes into %n's pussy slow and enormous, stretching them till they're sure it won't fit, and then it does."],
      butt: ["It works into %n's ass inch by straining inch, the minotaur snorting and patient as a plough horse."]
    },
    tentacle: {
      mouth: ["One slides over %n's tongue and down, while another strokes their cheek and a third traces their throat from outside."],
      vulva: ["The thick one slides into %n's pussy while the thinner ones curl around their thighs and hold them open."],
      butt: ["The tapered tip coils into %n's ass, slick and searching, and the others wrap round %n's hips to pull them closer."]
    },
    imp: {
      mouth: ["It slips onto %n's tongue hot as a sip of tea, the spade tip flicking at the back of their throat."],
      vulva: ["The spaded tip catches as it pushes into %n's pussy, then slides home, burning sweet."],
      butt: ["It wiggles into %n's ass, hot and slippery, the spade tip catching on the way in."]
    }
  };
  var TYPE_RHYTHM = {
    goblin: [
      "The goblin humps in a frantic little blur, cackling, heavy balls smacking the boards.",
      "Little green hands grip the edge of the hole as the goblin goes at %n like a terrier.",
      '"Mine, mine, mine," the goblin chants through the wall in time with every quick thrust.',
      "It's small and quick and absolutely tireless, and %n starts losing count of the strokes."
    ],
    orc: [
      "Each thrust shakes the whole stall. The orc fucks like he fights: hard, heavy and without stopping.",
      "A big green hand slaps the wall above %n and stays there, bracing.",
      "The orc grunts on every stroke, deep and rhythmic, like he's chopping wood.",
      "%n feels every vein of it, thick as a wrist, dragging in and out."
    ],
    bovine: [
      "Slow, deep, heavy strokes, the minotaur's breath steaming through the gaps in the boards.",
      "Every thrust rocks %n forward against the wall, and the bull snorts in time.",
      "The broad head starts to swell, flaring wider on every slow pull back.",
      "Hooves stamp outside. The minotaur leans his whole weight into %n, rumbling."
    ],
    tentacle: [
      "The tentacles move in waves, one pushing in as another pulls back, never still.",
      "A slick tentacle curls round %n's waist from outside the hole and holds them there.",
      "The thick one swells and ripples inside %n, while the thin ones stroke everywhere they can reach.",
      "Slime drips from every one of them, pooling on the straw under %n."
    ],
    imp: [
      "The imp giggles and fucks %n in quick, teasing little bursts, stopping just to hear them whine.",
      "Heat pours off it, so warm that %n starts to sweat.",
      "The spade tip catches and tugs inside %n on every pull back.",
      "A pointed tail snakes through the hole and flicks %n's thigh like a riding crop."
    ]
  };
  var FINISH = {
    goblin: (place, amt) => "The goblin squeals and floods " + place + ": " + amt + ", far more than anything that size should hold, pumping and pumping till it runs out of %n.",
    orc: (place, amt) => "The orc roars and buries it to the root, emptying into " + place + ": " + amt + ", thick and hot, holding %n against the wall till he's done.",
    bovine: (place, amt) => "The head flares wide and the minotaur bellows, filling " + place + ": " + amt + ", so much it gushes back out around him.",
    tentacle: (place, amt) => "Every tentacle shudders at once and pumps " + place + " full of warm slime: " + amt + ", and the thin ones keep stroking while it oozes out.",
    imp: (place, amt) => "The imp shrieks with delight and spurts deep into " + place + ": " + amt + ", hot as a candle, tingling all the way through %n."
  };
  var PERSONAS = {
    goblins: {
      type: "goblin",
      arrive: [
        "A gaggle of giggling goblins crowds outside %n's stall, shoving each other for first go.",
        '"Ooh, a fresh one!" A goblin voice squeaks at the hole, and three more come running.',
        "Something small climbs onto an upturned bucket outside %n's stall, cackling, while its friends hold the bucket steady."
      ],
      talk: ['"Pretty, pretty, PRETTY."', '"My turn after! My turn after!"', '"Big one for a little goblin, eh? Heh heh."', `"Hold still, tall thing, I'm almost there."`],
      leave: [
        "The goblin hops down and the next one scrambles up in its place, before the gaggle finally wanders off squabbling.",
        "Cackling and slapping each other's backs, the goblins scamper off to tell the others."
      ],
      pace: "rough"
    },
    orc: {
      type: "orc",
      arrive: [
        "Heavy boots. Somebody very big ducks under the stall doorframe and the wall bows as he leans on it.",
        `A rumbling voice outside %n's stall: "They said this one takes it rough." It isn't a question.`,
        "The boards creak as something enormous settles against them, smelling of leather and smoke."
      ],
      talk: ['"Good. Strong. Take it."', '"Hrrm. Tight. Better."', `"You'll walk funny after. Good."`],
      leave: [
        "The orc grunts, satisfied, and the floorboards complain all the way to the door.",
        "A heavy hand pats the wall like he's patting a good horse, and the orc stomps off."
      ],
      pace: "rough"
    },
    minotaur: {
      type: "bovine",
      arrive: [
        "Hooves, heavy and slow. A huge horned shadow falls across %n's stall and stops.",
        "The smell hits first: musk and hay and bull. Then the snort, right at the hole.",
        "The minotaur has to duck his horns to fit in the aisle, and when he reaches %n's stall he paws the straw."
      ],
      talk: ['"Mmmrrr."', '"Breed. Good."', '"Still. Hold still."'],
      leave: [
        "The minotaur snorts, long and satisfied, and his hooves fade off toward the pasture.",
        "He stays buried a long while, then pulls out with a snort and plods away."
      ],
      pace: "deep",
      alwaysInside: true
    },
    tentacled: {
      type: "tentacle",
      arrive: [
        "A wet, slithering sound comes down the row, and something cold drips through the gap under %n's stall door.",
        "The light through the hole goes green and wavery. Something is pressed against the other side, and it's moving.",
        "Nobody walks up to %n's stall. Something oozes up to it instead."
      ],
      talk: ["A low gurgle comes through the boards.", "A wet, pleased sort of burble shakes the wall.", "Something on the other side hums, deep and slow, like a pond."],
      leave: [
        "The tentacles slide back through the hole one by one, leaving slime on everything, and the wet sound fades away down the row.",
        "Whatever it was slithers off, and the stall smells of pondwater for an hour."
      ],
      pace: "steady"
    },
    imp: {
      type: "imp",
      arrive: [
        "A tiny cloud of smoke, a giggle, and an imp is hanging upside down from the stall rail, grinning at %n's hole.",
        "Something small and red and horned skips down the row tapping on stalls, and stops at %n's with a delighted squeak.",
        "The air goes warm and smells of struck matches. Somebody's very pleased to have found %n."
      ],
      talk: [`"Ooh, you're fun. You're SO fun."`, '"Say please. Go on. Say it."', '"I could do this all century, sweetling."'],
      leave: [
        "With a pop and a puff of smoke, the imp's gone, leaving %n tingling and the stall far too warm.",
        "The imp blows a kiss through the hole and skips off giggling."
      ],
      pace: "steady"
    },
    oldfarmer: {
      arrive: [
        "Slow boots and a creaking back. The old farmer from down the lane settles in outside %n's stall with a groan.",
        `"Now then," says an old voice at the hole, like he's greetin' new stock at market. "Let's have a look at you."`
      ],
      talk: ['"Good stock, this. Good stock."', `"Back in my day we didn't have holes. We had fences."`, '"Steady now. Steady."'],
      leave: [
        'The old farmer gives the boards a pat, says "Fine animal," and shuffles off toward the pub.',
        `"That'll do," says the old farmer, buttoning up slow, and he's gone.`
      ],
      pace: "slow"
    },
    tourist: {
      arrive: [
        "A camera shutter clicks outside %n's stall. Somebody's visiting the farm and very much enjoying the tour.",
        '"Is this, is this one of the attractions?" a tourist asks nobody, and decides it is.'
      ],
      talk: ['"Wait till I tell them back home."', `"Smile! Oh, right, you can't see me."`, '"Best farm holiday ever."'],
      leave: [
        "One last camera click, and the tourist wanders off to find the gift shop.",
        "The tourist thanks %n very politely, like a waiter, and goes."
      ],
      pace: "nervous"
    },
    overseer: {
      arrive: [
        "Clipboard footsteps. The overseer is doing the rounds, and %n's stall is next on the list.",
        '"Quality check," says a crisp voice at the hole, and a pen clicks.'
      ],
      talk: ['"Hm. Adequate."', `"Tighter, please. I'm taking notes."`, '"Your numbers had better be up this week."'],
      leave: [
        "The overseer makes a note, signs it, and moves on to the next stall.",
        '"Satisfactory," the overseer says, and the clipboard goes back under an arm.'
      ],
      pace: "steady"
    },
    lumberjack: {
      arrive: [
        "Sawdust and sweat and big boots. A lumberjack fresh off shift stops at %n's stall, flexing sore hands.",
        `"Long day," a deep voice says through the hole. "You'll do me right."`
      ],
      talk: ['"Timber."', `"That's a good stall, that."`, '"Mm. Better than a hot bath."'],
      leave: [
        "The lumberjack stretches till his back cracks, thanks %n, and heads off to the cabin.",
        "Heavy boots and a contented whistle fade off toward the woods."
      ],
      pace: "rough"
    },
    bestman: {
      arrive: [
        "Laughter and the clink of bottles: a wedding party's spilled into the barn, and the best man's found %n's stall.",
        `"Last night of freedom!" somebody shouts, and the groom's mates shove the best man toward %n's hole.`
      ],
      talk: [`"Don't tell the bride!"`, '"Oi, you lot, wait your turn!"', '"Best. Wedding. Ever."'],
      leave: [
        "The best man staggers off to a cheer from his mates, and the next one's already pushing up to the hole.",
        "Somebody pours champagne over the wall for %n, and the party moves on."
      ],
      pace: "rough",
      short: true
    },
    stableboy: {
      arrive: [
        "The stable boy, hay in his hair, checks nobody's looking and slips up to %n's stall.",
        'Soft quick steps from the stables. "Just a quick one, before the horses need me."'
      ],
      talk: [`"You're so much better than the horses."`, `"Shh, shh, they'll hear."`, '"I think about this all week."'],
      leave: [
        "The stable boy hurries back to the horses, red to the ears.",
        "A whispered thank you, and he's off at a run before anyone sees."
      ],
      pace: "nervous",
      short: true
    }
  };
  var DEEPER = {
    RHYTHM: {
      mouth: [
        "The stranger holds %n's head still through the hole with nothing but the angle of it and fucks their mouth slow and deep.",
        "Spit runs down %n's chin in long strings with every stroke, and the stranger groans at the wet sound of it.",
        "It slides along %n's tongue and nudges the back of their throat, again and again, until %n stops fighting the urge to swallow round it.",
        "The stranger pulls almost all the way out, lets %n breathe once, and sinks back in to the root.",
        "%n's lips are stretched tight and shining, and every stroke drags them a little further out."
      ],
      vulva: [
        "Long, wet, unhurried strokes, every one dragging out of %n's pussy and sinking back in with a sound that fills the stall.",
        "The stranger grinds in deep and stays, rocking, pressed so hard against the wall the boards creak.",
        "%n's pussy grips on every pull back like it's trying to keep it, and the stranger swears softly through the wall.",
        "The pace picks up, slows, picks up again, the stranger finding exactly what makes %n's knees buckle and doing it over and over.",
        "Every stroke squelches now, %n so wet it runs down the inside of their thighs."
      ],
      butt: [
        "Each stroke into %n's ass is long and heavy, the stretch never quite going away, the fullness building and building.",
        "The stranger works %n's ass in short deep grinds, then long strokes, then short again, keeping them guessing.",
        "%n's ring clings and drags on every pull back, and the stranger groans like it's the best thing they've ever felt.",
        "It's buried to the root and held there, throbbing, until %n squirms, and only then does it start moving again.",
        "Slick sounds and the slap of hips on boards, over and over, steady as a pump."
      ]
    },
    REACT: {
      mouth: [
        "%n's eyes water and their throat flutters round it, and they keep their mouth open anyway, wanting more.",
        "A muffled moan buzzes round the cock in %n's mouth, and the stranger shudders at the feel of it.",
        "%n's jaw aches sweetly, their lips tingling, the taste of the stranger everywhere."
      ],
      vulva: [
        "%n's pussy clenches and flutters round it, and their hips push back to the wall without asking.",
        "Heat climbs up %n's belly in slow waves, and every stroke pushes it a little higher.",
        "{t}%n's tits press and drag against the boards with every thrust, nipples aching.",
        "%n's legs tremble so hard they have to lean their whole weight on the wall."
      ],
      butt: [
        "%n's ass clenches and relaxes in waves, and every time it relaxes the stranger sinks in deeper.",
        "A deep, low fullness spreads through %n's belly, and they moan into the boards.",
        "{c}%n's cock leaks steadily onto the straw, every stroke in their ass pushing a little more out."
      ]
    },
    ATMOS: [
      "Down the row, another stall's boards are rattling in time with %n's. Somebody laughs.",
      "The barn cat sits on the rafter above %n's stall and watches with perfect indifference.",
      "A queue's forming outside. %n can hear boots shuffling and somebody complaining about the wait.",
      "Rain starts drumming on the barn roof, loud and steady, and the stall feels warmer for it.",
      "Somebody's left a lantern burning outside, and the light through the hole flickers on %n's skin.",
      "The straw under %n's knees is damp now, and it smells of sweat and hay and sex."
    ]
  };

  // addons/glory-stalls/scenes.js
  var pickFrom = (a) => a[Math.floor(Math.random() * a.length)];
  var between2 = (lo, hi) => lo + Math.random() * (hi - lo);
  var chance = (p) => Math.random() < p;
  var TYPES2 = {
    human: { w: 34 },
    canine: { w: 18, knot: true },
    equine: { w: 14, flare: true },
    feline: { w: 10 },
    draconic: { w: 10 },
    double: { w: 6 }
  };
  var SIZES = { modest: { w: 30, ml: [10, 20] }, thick: { w: 34, ml: [18, 35] }, huge: { w: 24, ml: [30, 60] }, hyper: { w: 12, ml: [60, 140] } };
  var LOAD_X2 = { human: 1, canine: 1.2, equine: 1.6, feline: 0.9, draconic: 1.3, double: 1.5 };
  var BIG = (v) => v.size === "huge" || v.size === "hyper" || v.type === "equine" || v.type === "bovine" || v.type === "orc";
  function pickVisitor(holes) {
    const types = Object.entries(TYPES2).filter(([k]) => k !== "double" || holes.includes("vulva") && holes.includes("butt"));
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
    if ((type === "orc" || type === "bovine") && (size === "modest" || size === "thick")) size = "huge";
    if (type === "goblin" && size === "hyper") size = "thick";
    return { type, size };
  }
  function sizeFromInches(inches) {
    return inches >= 13 ? "hyper" : inches >= 9 ? "huge" : inches >= 6 ? "thick" : "modest";
  }
  var SIZE_WORD = { modest: "neat little", thick: "thick, heavy", huge: "huge", hyper: "absurdly huge" };
  var sized = (line, v) => String(line).replace("%size", SIZE_WORD[v.size]).replace(/\b([Aa]) (absurdly)\b/g, "$1n $2");
  var HOLE_WORD = { mouth: "mouth", vulva: "pussy", butt: "ass" };
  var PERSONAS2 = {
    greedy: {
      arrive: [
        "Somebody practically runs up to %n's stall, already fumbling with their belt before they reach the hole.",
        "Heavy, quick footsteps, and the wall in front of %n jolts as someone slams up against it, breathing hard.",
        `A fist bangs on the boards next to %n. "Open up. I haven't got all day."`
      ],
      talk: ['"Fuck, yes. Take it. All of it."', `"Don't you dare slow down on me."`, `"That's it, that's what I came for."`, '"Harder. You can take harder than that."'],
      leave: [
        "They yank free, zip up and stomp off without a word, already done with %n.",
        "A last rough slap on the boards, and the greedy one is gone as fast as they came."
      ],
      pace: "rough"
    },
    slow: {
      arrive: [
        "Unhurried footsteps. Someone settles in outside %n's stall like they've got all afternoon.",
        "A bench creaks on the other side of the wall. Whoever it is means to take their time with %n.",
        "Somebody stops at the hole and just looks for a long, long moment before doing anything at all."
      ],
      talk: ['"Slow. I want to feel every bit of you."', '"Mm. No rush. None at all."', '"There. Stay right there. Just like that."', `"You feel that? I'm going to make this last."`],
      leave: [
        "They stay a long while afterward, just resting against the boards, before finally strolling off.",
        "A gentle pat on the wall, almost tender, and the slow footsteps fade away."
      ],
      pace: "slow"
    },
    talker: {
      arrive: [
        `"Well, look at what they've got waiting for me," says a voice outside %n's stall, delighted.`,
        `Someone strolls up humming, stops at the hole and lets out a low whistle. "Oh, you're lovely."`,
        `A cheerful voice right at the hole: "Hello in there. Ready for me?" It doesn't wait for an answer.`
      ],
      talk: [
        `"God, you're so warm. Do you know how good this feels?"`,
        `"I've been thinking about this all morning, you know."`,
        '"Listen to that. Listen to how wet that sounds."',
        '"Tell me you want it. Go on. I can hear you."',
        `"You're going to feel me for hours after this."`,
        '"Fuck, I could stay in here all day."'
      ],
      leave: [
        '"Same time tomorrow," the voice says, and they actually laugh as they walk off.',
        "They chat the whole way out, half to %n and half to themselves, until the door bangs shut."
      ],
      pace: "steady"
    },
    nervous: {
      arrive: [
        "Hesitant footsteps. They stop, start, stop again outside %n's stall. Someone's working up the nerve.",
        'A shaky breath on the other side of the boards. "Is this, um. Is this okay?" a quiet voice asks.',
        "Someone peers through the gap under the door, then at the hole, then fumbles for a long time with a zipper."
      ],
      talk: [`"Oh. Oh god. Oh, that's good."`, `"Sorry, I, sorry, I don't, oh fuck."`, '"Is this, does it feel okay? It feels so good."', `"I can't, I'm not going to last, I'm sorry."`],
      leave: [
        '"Thank you," whispers the nervous one, sounding dazed, and the footsteps hurry off.',
        "A breathless little laugh, a mumbled thanks, and they're gone, probably blushing all the way home."
      ],
      pace: "nervous"
    },
    regular: {
      arrive: [
        "Familiar footsteps. Whoever it is knows exactly which stall they want, and it's %n's.",
        '"There you are," murmurs a voice at the hole. "Missed this one."',
        "Someone knocks their usual knock on %n's wall, two slow, one quick, like they've done it a hundred times."
      ],
      talk: ['"Still the best stall on the farm."', `"You remember me, don't you. I can tell."`, '"Just how I like it. You never change."', '"Same as always. Good."'],
      leave: [
        '"See you next week," says the regular, and taps their knock on the wall on the way out.',
        "The regular lingers a moment, gives the boards a fond pat, and heads off like they own the place."
      ],
      pace: "steady"
    },
    breeder: {
      arrive: [
        "Somebody stops outside %n's stall and sniffs the air, slow and deliberate, like they're checking if %n's ripe.",
        `A low voice: "Fertile ones in this row, they said." Footsteps stop at %n's hole.`,
        "Someone comes up to %n's stall with a purpose, the kind who isn't here for a quick one."
      ],
      talk: ['"Hold still. I want this deep."', `"You're getting bred. Every drop stays in."`, '"Good. Take it. Take my seed."', `"Don't waste a drop of it."`],
      leave: [
        "The breeder stays buried until the very last moment, then slips out and presses a thumb over %n to keep it all in before leaving.",
        `"That one'll take," the breeder says with total certainty, and walks away satisfied.`
      ],
      pace: "deep",
      alwaysInside: true,
      prefers: "vulva"
    },
    quickie: {
      arrive: [
        "Quick footsteps, a glance up and down the row. Somebody on a short break, muttering about only having five minutes.",
        'A farmhand, by the sound of the boots, ducks in from the yard. "Quick one. Quick one, then back to work."',
        "The outer door bangs open and someone rushes straight to %n's hole, still pulling off their work gloves."
      ],
      talk: ['"No time, no time, just, fuck, yes."', `"Nobody's coming. Keep going."`, `"I've got to be back in a minute."`],
      leave: [
        "They're gone before %n's even stopped shaking, boots hurrying back out to the yard.",
        `A zipper, a hurried "thanks," and the door bangs shut. Break's over.`
      ],
      pace: "rough",
      short: true
    }
  };
  function pickPersona(hole, rough, v) {
    const own = Object.keys(PERSONAS2).filter((k) => PERSONAS2[k].type && v && PERSONAS2[k].type === v.type);
    if (own.length && chance(0.8)) return own[Math.floor(Math.random() * own.length)];
    if (rough && chance(0.75)) {
      const r = Object.keys(PERSONAS2).filter((k) => !PERSONAS2[k].type && ["rough", "deep"].includes(PERSONAS2[k].pace));
      if (r.length) return r[Math.floor(Math.random() * r.length)];
    }
    const keys = Object.keys(PERSONAS2).filter((k) => !PERSONAS2[k].type && (!PERSONAS2[k].prefers || PERSONAS2[k].prefers === hole || chance(0.3)));
    return keys[Math.floor(Math.random() * keys.length)];
  }
  var ARRIVE = [
    "Footsteps slow outside %n's stall, stop, shuffle closer. Someone is reading the chalk on the door.",
    "The latch on the outer door clacks. Heavy boots, then breathing right up against the boards in front of %n.",
    "A shadow slides across the slats of %n's stall. It stops at the hole and stays there.",
    "Two knocks on the wall beside %n's head, then a third. Somebody wants service.",
    "A belt buckle jingles on the other side of the wall. Then a zipper, slow, like they want %n to hear it.",
    "Someone spits into their palm outside %n's stall. The wet sound of a hand working, getting ready.",
    "The boards in front of %n creak as somebody leans their whole weight against them.",
    'A low voice on the other side: "This one free?" Nobody answers. The footsteps come closer anyway.',
    "Something sniffs at the hole in %n's stall, long and curious, warm breath puffing through.",
    "Hooves, or boots, %n can't tell, clop right up to the hole and stop.",
    "%n hears someone stop, groan softly at what they see, and start undoing their trousers in a hurry.",
    "A hand reaches through the hole first and squeezes whatever of %n it can find, possessive, before letting go.",
    `Somebody outside laughs low: "Oh, that one's ready," and %n's whole body flushes hot.`,
    "A coin rattles into the honesty tin by %n's door, then a hand slaps the wall: paid and waiting.",
    "The stall row goes quiet, and in the hush %n hears one set of footsteps coming straight for them."
  ];
  var REVEAL2 = {
    human: [
      "A %size cock pushes through the hole, flushed dark and rock hard, a bead of wet already shining at the tip.",
      "Through the hole comes a %size cock, veined and twitching, so hard it bobs, nudging blindly toward %n.",
      "A %size cock slides through the hole and just hangs there, throbbing, dripping on the straw, waiting for %n to want it.",
      "A %size cock pokes through, the stranger's hand still wrapped around the base, stroking it slowly an inch from %n."
    ],
    canine: [
      "A slick red dog cock slides through, tapered and dripping, %size, with a fat knot already swelling at the base.",
      "Something pink-red and pointed pokes through the hole, %size and slick, pulsing little spurts of clear wet, the knot behind it fat and promising.",
      "A %size dog cock pushes through, glossy and hot, already twitching and dribbling, the knot just behind the hole."
    ],
    equine: [
      "A horse cock shoves through the hole, %size, mottled pink and black, the broad flat head twitching and starting to flare.",
      "The hole barely fits it: a long, heavy horse cock, %size, the flared head bobbing an inch from %n and dripping on the straw.",
      "Inch after inch of %size horse cock slides through the hole and keeps coming, heavy enough to sag, the blunt head blooming."
    ],
    feline: [
      "A short, thick cock pokes through, %size, ringed with soft little barbs that catch the light like velvet thorns.",
      "Through the hole comes a cat-like cock, %size, its barbed sides glistening, twitching with quick little throbs.",
      "A %size barbed cock slips through, the soft spines bristling as it pulses, eager and quick."
    ],
    draconic: [
      "A ridged cock slides through the hole, %size, scaled at the base, its ridges stacked like rungs all the way to a tapered tip.",
      "Something warm and ridged pushes through, %size, hot as a stove, the ridges flexing as it searches for %n.",
      "A %size dragon's cock eases through, ridge after ridge, slick and glistening, radiating heat into the stall."
    ],
    double: [
      "Two cocks slide through a widened hole, one above the other, %size, both hard, both looking for somewhere to go.",
      "The stranger has two, stacked and twitching, %size each, and they press through the hole together.",
      "A pair of %size cocks push through side by side, rubbing against each other, both dripping."
    ]
  };
  var TEASE = {
    mouth: [
      "It rubs across %n's lips, smearing wet until they shine, then slaps softly against %n's cheek.",
      "It rests on %n's tongue, heavy and salty, letting %n taste it before doing anything else.",
      "The tip traces %n's lips around and around, teasing, pulling back just when %n's mouth falls open for it.",
      "It pushes against %n's mouth until %n's lips part, then holds there, throbbing, making %n wait.",
      "It drags slowly across %n's face, from cheek to lips, marking %n with its scent.",
      "The tip is pressed to %n's lips until they're wet with it, and the stranger groans and pushes a little closer.",
      "The stranger taps it against %n's tongue, once, twice, three times, like ringing a bell."
    ],
    vulva: [
      "The head drags up and down through %n's pussy, slow, gathering wet, bumping %n's clit on every pass.",
      "It slaps against %n's pussy a few times, wet little smacks, before settling at the entrance.",
      "It nudges %n's folds apart and rubs there, teasing, until %n is dripping for it.",
      "The stranger grinds the shaft along %n's slit without going in, and %n can feel every inch of it.",
      "Just the tip presses in, then pulls back out, then presses in again, until %n is whining for it.",
      "It circles %n's clit in slow, slick little rings until %n's legs start to tremble.",
      "A thumb spreads %n open first, and the stranger takes a long look before lining up."
    ],
    butt: [
      "Spit, then the tip circles %n's ass, pressing, easing off, pressing again until the ring starts to give.",
      "Slick, cold lube drips down %n's crack before the head presses against their ass, patient and insistent.",
      "It rubs against %n's ass in slow circles, working the rim soft before it even tries.",
      "The head pushes and pulls back, pushes and pulls back, coaxing %n's ass open one little bit at a time.",
      "A slick finger works into %n's ass first, then a second, stretching them while the cock waits its turn.",
      "It slides up and down between %n's cheeks, slow and slick, until %n is aching for it."
    ]
  };
  var FUNNEL = [
    `The stranger sees the funnel strapped in %n's mouth and laughs softly. "Oh, that's convenient."`,
    "The tip comes to rest on the rim of the funnel, dripping into it, and %n can taste every drop trickling down.",
    "The stranger strokes themselves over the funnel, slow and steady, letting %n listen to it.",
    "Every stroke squeezes a bead of wet into the funnel. %n has no choice but to swallow it.",
    "The stranger rubs the head around and around the funnel's mouth, teasing, close, so close.",
    "%n's throat works helplessly around the tube as the stranger's breathing gets heavier above it."
  ];
  var ENTRY2 = {
    human: {
      mouth: ["It slides over %n's tongue and keeps going until %n's lips meet the wood.", "It pushes past %n's lips in one smooth stroke and settles heavy on %n's tongue."],
      vulva: ["It sinks into %n's pussy in one long push, the stranger groaning through the boards.", "It eases into %n's pussy slow and deep, stretching %n around every inch."],
      butt: ["It pushes past %n's ring with a slow, burning stretch and settles deep.", "It works into %n's ass inch by inch until the stranger's hips press flush to the wall."]
    },
    canine: {
      mouth: ["The pointed tip slips straight to the back of %n's throat, quick and eager, already spurting little warm jets."],
      vulva: ["It plunges into %n's pussy in one quick thrust and starts at once, hot little spurts with every jab.", "It finds %n's pussy on the first try and drives in, the knot bumping against %n's lips."],
      butt: ["It jabs into %n's ass with no warning at all and starts going, the knot bumping the rim with every push."]
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
  var STRETCH = {
    mouth: ["%n's jaw aches already. It's so big %n can only take the head and a little more.", "%n's lips are stretched tight around it, drool spilling from the corners."],
    vulva: ["%n's pussy is stretched wide around it, so full %n can barely breathe.", "%n can feel it pressing up inside, deep enough to make their belly flutter."],
    butt: ["%n's ass is stretched so wide it burns, and %n has to breathe slow to take it.", "It fills %n so deep %n swears they can feel it in their stomach."]
  };
  var RHYTHM = {
    mouth: {
      early: [
        "It starts slow, sliding in and out over %n's tongue, getting a feel for %n's mouth.",
        "The stranger pushes a little deeper with each stroke, testing how much %n can take.",
        "It pulls back to let %n breathe, then slides right back in, a little further this time."
      ],
      mid: [
        "It fucks %n's mouth with long strokes, pulling almost all the way out before sliding back over %n's tongue.",
        "Drool runs down %n's chin and drips onto their chest as the pace picks up.",
        "It pulls out to let %n gasp, taps their tongue twice, and slides right back in.",
        "Fingers curl through the hole and catch in %n's hair, keeping %n's face pressed to the wood."
      ],
      late: [
        "The stranger holds deep and grinds, rocking against the back of %n's throat, %n's eyes watering.",
        "It's fucking %n's throat now, fast and sloppy, the wall rattling.",
        "Every stroke goes all the way, %n's nose pressed to the boards, the stranger groaning on every one."
      ]
    },
    vulva: {
      early: [
        "It starts with slow, shallow strokes, letting %n's pussy open up around it.",
        "It rocks gently into %n, deeper each time, until it's all the way in.",
        "The stranger finds a lazy rhythm, sliding in and out of %n's pussy with wet little sounds."
      ],
      mid: [
        "It pumps into %n's pussy with steady, deep strokes, the wall creaking in time.",
        "The stranger finds the angle that makes %n gasp and stays right there, working it.",
        "Wet, slapping sounds fill the stall. %n's thighs are slick and shaking.",
        "It slows to deep, grinding circles, buried as far as it'll go, then speeds back up without warning."
      ],
      late: [
        "Every thrust rocks %n forward against the stall. %n has to brace on the rail to keep still.",
        "It's pounding %n now, hard and fast, the boards banging against their frame.",
        "The stranger is slamming into %n's pussy with everything they've got, chasing it."
      ]
    },
    butt: {
      early: [
        "It starts gentle, short little strokes, letting %n's ass get used to it.",
        "It eases in and out of %n's ass, slow and slick, a little deeper each time.",
        "The stranger holds still a moment, buried in %n, then begins to move."
      ],
      mid: [
        "It works %n's ass with long, steady strokes, dragging almost out before sinking back to the root.",
        "It holds deep in %n's ass, grinding, letting %n feel how full they are.",
        "Short, quick thrusts, then a long slow one that makes %n moan into the straw.",
        "The stranger's hips slap against the wall again and again, driving every stroke deep into %n."
      ],
      late: [
        "The pace turns rough. %n's ass is used hard, the boards thumping against their frame.",
        "It's pounding %n's ass now, fast and relentless, the whole stall shaking.",
        "Every stroke goes to the hilt, hard enough to push little gasps out of %n."
      ]
    }
  };
  var PACE_LINE = {
    rough: ["There's nothing gentle about it. The stranger uses %n like they paid for it.", "The wall shudders with every rough, impatient thrust into %n."],
    slow: ["The stranger refuses to hurry, every stroke long and lingering, until %n is squirming for more.", "It's slow, almost torturously slow, and %n can feel every single inch."],
    steady: ["The stranger keeps a steady, comfortable rhythm in %n, settling in for the long haul.", "Stroke after stroke into %n, unhurried and certain, like they know exactly what they're doing."],
    nervous: ["The rhythm is clumsy at first, stopping and starting, then the stranger finds their courage and %n feels it get better fast.", "They gasp at every stroke into %n, like they can't believe how good it feels."],
    deep: ["The stranger doesn't pull back far. They stay deep in %n, grinding, pressing as far as they can reach.", "Every stroke ends buried to the hilt in %n, held there, pushing deep."]
  };
  var TYPE_RHYTHM2 = {
    human: ["The stranger grunts with every thrust into %n, the sound muffled by the boards.", "A hand slaps the wall above %n, holding on for leverage.", "%n can feel it throbbing, getting harder still."],
    canine: ["It humps in a frantic, blurring rhythm, the knot slapping against %n with every jab, swelling bigger.", "Little hot spurts keep coming with every thrust, making %n slicker and slicker.", "The knot is getting fat now, bumping against %n, threatening to push in."],
    equine: ["Each stroke is slow and heavy, like being worked by a piston, and %n feels every inch of it all the way down.", "The flare is already blooming, catching and dragging inside %n on every pull back.", "It's so heavy the stranger has to brace with both hands to keep thrusting into %n."],
    feline: ["Short, sharp thrusts, the barbs raking softly every time it pulls back, making %n jerk and gasp.", "It's quick and relentless, all hips, and those barbs make every stroke feel like ten to %n.", "The barbs prickle and drag on every pull, and %n can't decide if it's too much or not enough."],
    draconic: ["The ridges drag in and out, in and out, each one catching on its way through %n with a thick little pop.", "It's hot inside %n, hotter than any cock should be, and it seems to swell with every stroke.", "%n can count the ridges by feel, every single one, on every single stroke."],
    double: ["The two cocks take turns, one pushing in as the other pulls back, so %n is never empty for a second.", "Both thrust together, and %n is pinned between them against the wall.", "%n is so full, twice over, that every movement makes them gasp."]
  };
  var REACT = {
    mouth: {
      early: [
        "%n's mouth is filled, heavy and salty, the taste of the stranger everywhere.",
        "%n's jaw is eased open wider than it wants to go, and held there.",
        "A soft, surprised sound is pushed out of %n around it.",
        "%n's lips are stretched around it, tingling, wet.",
        "It settles on %n's tongue like it owns the place.",
        "%n's breath stutters through their nose as their mouth is taken."
      ],
      mid: [
        "%n's throat is opened a little more on every stroke.",
        "Spit runs from the corners of %n's stretched lips and nobody wipes it away.",
        "A muffled moan is fucked right out of %n.",
        "%n's eyes water as it's pushed deeper, and deeper again.",
        "%n's head is held still for it, cheek pressed to the wood.",
        "Every stroke drags over %n's tongue, and %n can taste how close the stranger is getting.",
        "%n's mouth is used like it was built for this."
      ],
      late: [
        "%n's throat is used hard and fast, and all %n can do is take it.",
        "Tears and drool run down %n's face. The stranger doesn't slow down.",
        "%n's throat flutters helplessly around it.",
        "%n is held right down to the root, nose to the boards, until their vision sparkles.",
        "Little choked sounds are forced out of %n on every thrust.",
        "%n's jaw aches, their lips are numb, and it just keeps going."
      ]
    },
    vulva: {
      early: [
        "A gasp is pulled out of %n as their pussy is opened up.",
        "%n's pussy is stretched slowly around it, inch by inch.",
        "%n's breath catches as they're filled.",
        "%n's pussy flutters around it, already giving in.",
        "Warmth floods through %n as it settles deep.",
        "%n's knees go weak the moment it pushes in."
      ],
      mid: [
        "%n's pussy is fucked so wet the sound is obscene.",
        "A helpless moan spills out of %n every time it bottoms out.",
        "%n is rocked forward against the boards with every stroke.",
        "%n's pussy clenches around it on its own, and the stranger groans.",
        "Every thrust lands right where %n is most sensitive, and %n shakes.",
        "%n's thighs are slick and trembling, held open for it.",
        "Pleasure is dragged out of %n whether they're ready or not."
      ],
      late: [
        "%n is pounded hard and fast, toes curling in the straw.",
        "%n is pushed right to the edge and held there.",
        "%n's whole body shudders, pinned against the stall and fucked.",
        "Broken little cries are knocked out of %n with every slam.",
        "%n's pussy spasms around it, helpless, overwhelmed.",
        "%n can't think. %n can only be filled."
      ]
    },
    butt: {
      early: [
        "%n's ass is stretched open slowly, a deep, burning fullness.",
        "A low groan is pressed out of %n as their ass is filled.",
        "%n's ass is held open while it works its way in.",
        "%n's breath shudders as it settles deep inside.",
        "%n's ring gives way around it, and a shiver runs all the way up %n's spine.",
        "%n is stuffed full, and it's only just started."
      ],
      mid: [
        "%n's ass is worked in long, steady strokes.",
        "Soft, rhythmic grunts are fucked out of %n.",
        "%n's ass squeezes around it on its own, stretched and full.",
        "%n is shoved forward on every thrust and dragged back on every pull.",
        "%n's hips are held still while their ass is used.",
        "Every stroke reaches somewhere deep that makes %n's legs shake.",
        "%n's ass is taken like it belongs to the stall."
      ],
      late: [
        "%n's ass is used hard, the boards thumping against the frame.",
        "%n's legs tremble, but they're held in place and fucked anyway.",
        "%n is stretched to the limit, moaning out loud now.",
        "%n's knees slip on the straw, and the stranger just pulls them back.",
        "Every stroke goes to the hilt and knocks the breath out of %n.",
        "%n is shaking all over, ass clenching around it, helpless to stop it."
      ]
    }
  };
  var SECOND_WIND = [
    "The stranger pulls out, breathing hard, and just rubs it against %n for a while, letting %n ache for it.",
    "It slows right down, almost lazy, savouring %n, every stroke long enough that %n squirms.",
    "The stranger shifts their stance, gets a better grip on the wall, and starts into %n again harder than before.",
    "It pulls nearly all the way out and stays there, just the tip, until %n is aching for the rest of it.",
    "The stranger wants it to last. The pace drops to slow, deep grinding into %n, and it goes on and on."
  ];
  var SWITCH = [
    "It slides out of %n's %from with a wet sound, and a moment later presses into %n's %to instead.",
    "The stranger pulls out of %n's %from and lines up somewhere new: %n's %to.",
    `"Let's try the other one," mutters the stranger, and it leaves %n's %from to push into %n's %to.`
  ];
  var BUILD = [
    "The stranger's breathing goes ragged and fast. The wall in front of %n shudders.",
    "A groan rolls through the boards, deep and desperate. They're close, and %n can feel it.",
    "The thrusts into %n lose their rhythm, short and jerky. Hands clamp the edges of the hole.",
    `"Fuck, fuck, here it comes," from the other side of %n's wall, barely a whisper.`,
    "Everything goes tight and still for one long second, the stranger trembling against %n's boards.",
    "It swells even harder inside %n, and %n knows it's coming."
  ];
  var AMOUNT = (ml) => ml < 15 ? "a hot little spurt" : ml < 30 ? "a warm, creamy load" : ml < 60 ? "a thick, heavy load that just keeps pulsing" : ml < 100 ? "a huge, pumping flood" : "an absurd, never-ending flood";
  var HOLE_PLACE = { mouth: "%n's throat", vulva: "%n's pussy", butt: "%n's ass" };
  var OUTSIDE = {
    mouth: [
      "%n's face",
      "%n's lips and chin",
      "%n's tongue and cheeks",
      "%n's hair and face",
      "%n's eyes and nose",
      "%n's forehead and down into their eyelashes",
      "%n's open mouth and all down their chin",
      "%n's face and tits",
      "%n's upturned face, then their heaving tits",
      "%n's cheeks, nose and parted lips"
    ],
    vulva: [
      "%n's ass and thighs",
      "%n's back",
      "the lips of %n's pussy",
      "%n's ass cheeks",
      "%n's spread pussy and clit",
      "%n's belly and mound",
      "%n's back, all the way up to their hair",
      "the backs of %n's thighs and the soles of their feet"
    ],
    butt: ["%n's back", "%n's ass cheeks", "the small of %n's back", "%n's thighs", "%n's gaping hole and around it", "%n's spine, from tailbone to neck"]
  };
  var PAINT = [
    "At the last second it pulls out and paints %where: %amt, hot ropes landing one after another while %n gasps.",
    "It yanks free and jerks itself hard, and %amt splatters across %where, rope after rope, until %n is dripping with it.",
    '"Look at me," the voice says, and %n does, and it comes all over %where: %amt, thick enough to string between their lashes.',
    "It slaps wet against %n's skin and lets go: %amt of it, glazing %where and running down in warm, heavy streams.",
    "It pulls out with a groan and empties over %where, %amt, pulse after pulse, marking %n like property.",
    '"Hold still." %amt hits %where in thick white stripes, and the stranger rubs the head through it, smearing it in.',
    "It comes in a hot, sudden gush all over %where: %amt, so much it drips off %n in long pearly strings."
  ];
  var PAINT_AFTER = [
    "Cum slides slowly down %n's face, catches on their lip, and drips onto their tits.",
    "%n can't open one eye; it's glued shut with somebody's load. They don't dare wipe it.",
    "It's in %n's hair, on their lashes, running off their chin in a sticky string to the straw.",
    "A stranger's taste is on %n's lips now, salty and warm, and it isn't going anywhere.",
    "The load cools on %n's skin into a tacky glaze that pulls every time they move.",
    "A drop runs from %n's chin all the way down between their breasts and keeps going.",
    "%n's face is a mess of it, nose to chin, and somebody outside the stall laughs at the sight.",
    "It's still warm where it pooled in the hollow of %n's throat."
  ];
  function finishLine(v, hole, ml, inside, funnel, pick2 = pickFrom) {
    const amt = AMOUNT(ml) + ", easily " + Math.round(ml) + " mL of it";
    if (hole === "mouth" && funnel) return "The stranger cums straight into the funnel: " + amt + ", pouring down the tube and into %n's throat whether %n swallows or not.";
    if (!inside) return pick2(PAINT).replace("%where", pick2(OUTSIDE[hole])).replace("%amt", amt);
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
        if (FINISH[v.type]) return FINISH[v.type](place, amt);
        return pick2([
          "It buries itself to the hilt and cums deep in " + place + ": " + amt + ", throbbing with every spurt while %n shudders around it.",
          "With a strangled groan it empties into " + place + ": " + amt + ", pulse after pulse, until %n can feel the heat of it spreading."
        ]);
    }
  }
  var KNOT_TIE = [
    "The knot won't come free. %n is stuck to the wall, tied, the stranger panting on the other side, cum trapped deep inside.",
    "Tied fast. Every little shift of the stranger tugs at %n from the inside, and there's nothing to do but wait for the knot to go down.",
    "Minutes pass, %n and the stranger locked together through the wall. The knot throbs and pumps out a little more every so often.",
    "Finally the knot softens and slips free with a wet pop, and a gush follows it out of %n."
  ];
  var KNOT_HOLD = KNOT_TIE.slice(0, 3);
  var KNOT_FREE = [KNOT_TIE[3]];
  var AFTER = {
    inside: {
      mouth: ["It pours down %n's throat faster than %n can swallow, and some escapes down their chin.", "The taste lingers, thick and salty, coating %n's tongue.", "It coats %n's lips and tongue, thick and salty, and the taste stays."],
      vulva: ["When it slides out, warm cum runs down %n's thighs in slow, sticky trails.", "%n's pussy twitches and leaks, the load sitting heavy and warm inside them.", "It's pumped so deep into %n that it takes a while to start dripping out."],
      butt: ["It pulls out with a wet pop and %n's ass gapes for a moment before it starts to leak.", "%n can feel it settle deep in their belly, warm and heavy.", "A slow, warm trickle starts down the back of %n's thigh."]
    },
    outside: ["%n is left sticky and dripping, cum cooling on their skin.", "It drips slowly off %n onto the straw. Nobody's coming to wipe it off.", "%n can feel it running down, warm and then cool, marking them."].concat(PAINT_AFTER)
  };
  var FUNNEL_AFTER = ["It all drains down the funnel into %n, gurgling empty at last.", "The last of it trickles down the tube, and %n swallows, flushed and dazed."];
  var LEAVE = [
    "A zipper, a satisfied sigh, and the footsteps fade down the row away from %n's stall.",
    "A pat on the boards above %n's head, almost fond, and the stranger is gone.",
    `"Good stall," mutters the stranger to %n's wall, and walks off whistling.`,
    "Hooves clatter away down the aisle. Someone's already shuffling up to take their place at %n's hole.",
    "The outer door bangs shut. %n is alone again, dripping, waiting for whoever's next."
  ];
  var ATMOS = [
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
    "The tin cup by %n's door rattles in the breeze. Nobody's filled it in a while."
  ];
  var NEXT_UP = [
    "Before %n can even catch their breath, the next stranger is already at the hole.",
    "There's a line now. %n can hear them outside, shuffling, impatient, one stepping forward the moment the last one leaves.",
    "Somebody was waiting and watching the whole time, and now it's their turn with %n.",
    "A new set of footsteps, a new smell, a new shape pressing against the boards. %n's stall isn't getting a rest today.",
    "The door hasn't even swung shut behind the last one before someone else steps up to %n's hole, already hard.",
    `"My turn," says somebody outside %n's stall, and %n hears the last one laugh as they make room.`
  ];
  var TAUNTS = [
    `"Fuck, you're good at this."`,
    `"They keep you well used in here, don't they."`,
    '"Look at that. Made for a wall."',
    `"Whose %a is this? I'm coming back for more."`,
    '"Dripping already. Desperate little thing."',
    `"Hold still. You're just somewhere warm to finish."`,
    `"I'm telling everyone about this stall."`,
    '"%call for me. Go on."',
    `"Doesn't even need a face. Just this."`,
    `"You'll be leaking all day, and you'll love it."`
  ];
  var PRAISES = [`"God, you're good. Thank you."`, '"Best stall on the farm, honestly."', `"That's it, that's perfect, you're perfect."`, '"So good. So, so good."'];
  ARRIVE.push(
    "Somebody whistles low at the sight of %n's stall and comes straight over.",
    "The smell reaches %n first, sweat and musk, and then the shape of someone filling the hole.",
    "A rough hand tests the edge of the hole, feels around until it brushes %n, then pulls back to make room for something else.",
    `Somebody leans in close to the boards and breathes, "Oh, you're already wet for me," before %n even sees them.`,
    "Boots scrape to a stop. A long pause, like the stranger is deciding which of %n's holes they want first."
  );
  TEASE.mouth.push(
    "It paints a slick line across %n's lips, slow, then pulls back just out of reach of %n's tongue.",
    "The stranger feeds %n just the head, in and out, in and out, until %n is chasing it.",
    "%n's tongue flicks out to taste it, and the stranger groans and lets %n lick the whole length.",
    "It rubs slow circles on %n's tongue, smearing it with salt, making %n's mouth water."
  );
  TEASE.vulva.push(
    "It rocks against %n's clit, slick and heavy, until %n is twitching on every bump.",
    "The stranger slaps it wetly against %n's pussy, one, two, three, then rubs the sting away with the tip.",
    "It slips in an inch and stops, holding there, until %n's whole body is begging for the rest.",
    "Two fingers spread %n wide and the stranger drags the head through the wet, taking their time."
  );
  TEASE.butt.push(
    "A thumb presses against %n's ass and circles there while the cock rubs between %n's cheeks.",
    "Warm spit, then the head presses, retreats, presses, until %n's ass starts to open on its own.",
    "It nudges at %n's ass so slowly that %n ends up pushing back onto it first.",
    "The stranger works lube into %n with two fingers, stretching and teasing, before lining up."
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
  TYPE_RHYTHM2.human.push("The stranger's hips slap the boards with every stroke into %n, steady as a metronome.", "%n hears the stranger's belt buckle rattle against the wall in time.");
  TYPE_RHYTHM2.canine.push("It's pure frantic rutting now, and %n can feel the knot swelling bigger by the second.", "The dog cock pulses with every jab, filling %n with little warm bursts.");
  TYPE_RHYTHM2.equine.push("The horse cock pushes deeper than anything should, and %n's whole body rocks with it.", "%n can feel the flare dragging, catching, swelling inside on every stroke.");
  TYPE_RHYTHM2.feline.push("Quick, hard little thrusts, and every one of them leaves %n tingling from the barbs.", "The barbs make %n gasp each time it pulls back, a sharp sweet scrape.");
  TYPE_RHYTHM2.draconic.push("The ridges ripple inside %n, a slow wave that makes %n's toes curl.", "It's like being filled with something molten, and %n can't stop moaning.");
  TYPE_RHYTHM2.double.push("One slides deep while the other teases, then they switch, and %n loses track of which is which.", "Being filled twice over makes %n gasp on every single stroke.");
  PACE_LINE.rough.push("They're not making love to %n's stall, they're using it, hard and fast and selfish.");
  PACE_LINE.slow.push("Every stroke into %n is unhurried, deliberate, savouring, like they've got all the time in the world.");
  PACE_LINE.steady.push("It settles into a rhythm with %n so even and comfortable it's almost hypnotic.");
  PACE_LINE.nervous.push("Every little sound %n makes seems to surprise the stranger, and they push in harder each time.");
  PACE_LINE.deep.push("Buried as deep in %n as it'll go, the stranger just grinds there, slow and possessive.");
  SECOND_WIND.push(
    "The stranger stops, buried deep in %n, and just breathes for a moment before starting again.",
    "A hand slaps the wall above %n, the stranger laughs breathlessly, and the pace picks right back up.",
    "It slows to almost nothing, teasing %n with tiny strokes, until %n whimpers, and then it speeds up again."
  );
  BUILD.push(
    "The stranger's thighs are shaking against the wall in front of %n now.",
    `"Don't move, don't you move," breathes the stranger, holding %n still.`,
    "It throbs once, hard, inside %n, and the stranger lets out a long, broken groan.",
    "The boards in front of %n creak as the stranger's whole weight sags against them."
  );
  AFTER.inside.mouth.push("Every drop went down %n's throat. All that's left is the taste, and the ache in their jaw.", "It leaves %n's tongue coated and their lips swollen and shining.");
  AFTER.inside.vulva.push("%n's pussy is so full that a little more spills out every time they breathe.", "Warm and heavy, it sits low in %n's belly, and %n squeezes their thighs together to keep it.");
  AFTER.inside.butt.push("%n's ass stays open and slick, leaking slowly onto the straw.", "%n can feel every drop of it inside, warm and heavy and theirs now.");
  AFTER.outside.push("It slides slowly down %n's skin, sticky and cooling, and there's nowhere to wipe it.", "%n is a glistening mess, marked, and everyone who walks past will smell it.");
  LEAVE.push(
    "Someone pockets their gloves, pats %n's wall twice, and strolls back out into the sunshine.",
    '"Thanks, gorgeous," through the boards, and then the stranger is gone, leaving %n dripping.',
    "The stranger stays leaning on the wall a while, catching their breath, then wanders off without a word.",
    "A low laugh, a zipper, and the footsteps fade, leaving %n shaking in the quiet."
  );
  NEXT_UP.push(
    "The next one doesn't even wait for the last one's footsteps to fade before stepping up to %n's hole.",
    "Somebody in the queue has clearly been watching %n through a crack, because they're hard and ready the second they step up.",
    "%n barely has time to swallow before another shape fills the hole."
  );
  FUNNEL.push(
    "The stranger tilts the funnel with one finger so it points straight down %n's throat, and grins.",
    "Drops patter into the funnel as the stranger strokes faster, each one making %n's throat work.",
    "%n can hear the slick, quick sounds of the stranger's hand right above the funnel, getting faster."
  );
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
    "The air in %n's stall is heavy and sweet, sweat and leather and something warmer underneath."
  );
  for (const k of Object.keys(PERSONAS2)) {
    const add = {
      greedy: [`"Mine. This one's mine right now."`, `"You're going to take every bit of this."`],
      slow: ['"Beautiful. Just beautiful."', `"Breathe for me. Slow. That's it."`],
      talker: ['"I can feel you squeezing me. Do that again."', `"I'm going to tell everyone about you."`],
      nervous: [`"I've never, I mean, oh, oh god."`, `"Is it, can I, I'm so close already."`],
      regular: [`"That's my good one."`, '"I always save myself for this stall."'],
      breeder: ['"Keep it in. I mean it."', `"You'll be round with it in a month."`],
      quickie: ['"God, I needed this."', `"Faster, faster, I've got to go."`]
    }[k];
    if (add) PERSONAS2[k].talk.push(...add);
  }
  var into = (pool, more) => {
    if (Array.isArray(pool) && Array.isArray(more)) pool.push(...more);
  };
  function addOct15() {
    into(ARRIVE, MORE.ARRIVE);
    into(FUNNEL, MORE.FUNNEL);
    into(SECOND_WIND, MORE.SECOND_WIND);
    into(SWITCH, MORE.SWITCH);
    into(BUILD, MORE.BUILD);
    into(PAINT, MORE.PAINT);
    into(PAINT_AFTER, MORE.PAINT_AFTER);
    into(AFTER.outside, MORE.PAINT_AFTER);
    into(AFTER.outside, MORE.AFTER_OUT);
    into(KNOT_HOLD, MORE.KNOT_HOLD);
    into(KNOT_FREE, MORE.KNOT_FREE);
    into(FUNNEL_AFTER, MORE.FUNNEL_AFTER);
    into(LEAVE, MORE.LEAVE);
    into(ATMOS, MORE.ATMOS);
    into(NEXT_UP, MORE.NEXT_UP);
    into(TAUNTS, MORE.TAUNTS);
    into(PRAISES, MORE.PRAISES);
    into(JOIN2, MORE.JOIN2);
    into(JOIN3, MORE.JOIN3);
    into(FIRST_DONE, MORE.FIRST_DONE);
    into(BOTH_AT_ONCE, MORE.BOTH_AT_ONCE);
    into(ALL_DONE, MORE.ALL_DONE);
    for (const k of Object.keys(MORE.REVEAL)) into(REVEAL2[k], MORE.REVEAL[k]);
    for (const h of ["mouth", "vulva", "butt"]) {
      into(TEASE[h], MORE.TEASE[h]);
      into(STRETCH[h], MORE.STRETCH[h]);
      into(AFTER.inside[h], MORE.AFTER_IN[h]);
      for (const ph of ["early", "mid", "late"]) {
        into(RHYTHM[h][ph], MORE.RHYTHM[h][ph]);
        into(REACT[h][ph], MORE.REACT[h][ph]);
      }
    }
    for (const t of Object.keys(MORE.ENTRY)) for (const h of Object.keys(MORE.ENTRY[t])) into((ENTRY2[t] = ENTRY2[t] || {})[h] = ENTRY2[t][h] || [], MORE.ENTRY[t][h]);
    for (const k of Object.keys(MORE.PACE_LINE)) into(PACE_LINE[k], MORE.PACE_LINE[k]);
    for (const k of Object.keys(MORE.TYPE_RHYTHM)) into(TYPE_RHYTHM2[k], MORE.TYPE_RHYTHM[k]);
    for (const k of Object.keys(MORE.TOGETHER)) into(TOGETHER[k], MORE.TOGETHER[k]);
    for (const k of Object.keys(MORE.PERSONAS)) if (PERSONAS2[k]) {
      into(PERSONAS2[k].arrive, MORE.PERSONAS[k].arrive);
      into(PERSONAS2[k].leave, MORE.PERSONAS[k].leave);
    }
    for (const k of Object.keys(MORE.ARRANGE)) {
      const A = ARRANGE[k], B = MORE.ARRANGE[k];
      if (Array.isArray(A.open)) into(A.open, B.open);
      else for (const p of Object.keys(B.open)) into(A.open[p], B.open[p]);
      into(A.remind, B.remind);
      into(A.close, B.close);
    }
  }
  var ownPool = (h, phase) => OWN.any[phase].concat((OWN[h] || {})[phase] || []);
  function gearPools(gear, hole, body) {
    const out = [];
    for (const [k, v] of Object.entries(GEAR)) {
      if (!gear || !gear[k]) continue;
      if (Array.isArray(v)) {
        out.push(v);
        continue;
      }
      if (v.mouthOnly && hole === "mouth") out.push(v.mouthOnly);
      if (v.notMouth && hole !== "mouth") out.push(v.notMouth);
      if (v.notButt && hole !== "butt") out.push(v.notButt);
      if (v.notVulva && hole !== "vulva") out.push(v.notVulva);
    }
    return out.filter((p) => p.some((l) => fits(l, body)));
  }
  function kindLine(animal, pick2) {
    if (!animal) return null;
    const own = KIND[animal.key];
    if (own && chance(0.6)) return pick2(own);
    const snd = pickFrom(animal.sounds || [animal.sound || "a soft moan"]);
    return pick2(SOUND).replace("%snd", snd);
  }
  var kindWords = (line, animal) => {
    const a = animal && animal.a || "animal", call = animal && animal.call || "moan";
    return String(line).replace(/%a\b/g, a).replace(/(^|["!?.]\s*)%call/g, (m, p) => p + call.charAt(0).toUpperCase() + call.slice(1)).replace(/%call/g, call);
  };
  function freshPicker(body) {
    const used = /* @__PURE__ */ new Set();
    return (list) => {
      const ok = fitting(list, body), pool = ok.filter((x) => !used.has(x));
      const v = pickFrom(pool.length ? pool : ok);
      used.add(v);
      return untag(v);
    };
  }
  function oneVisitor(beats, { hole, visitor, funnel, degrade, praise, rounds, first, holes, pick: pick2, rough, gear, animal, body }) {
    const v = visitor, persona = PERSONAS2[pickPersona(hole, rough, v)];
    const add = (t, extra) => {
      if (t) beats.push(Object.assign({ t }, extra || {}));
    };
    const talk = () => chance(0.6) ? "A voice through the boards: " + pick2(persona.talk) : null;
    const voice = () => degrade && chance(0.35) ? "A voice through the boards: " + kindWords(pick2(TAUNTS), animal) : praise && chance(0.35) ? "A voice through the boards: " + kindWords(pick2(PRAISES), animal) : null;
    const atmos = () => chance(0.3) ? pick2(ATMOS) : null;
    const own = (h2, phase, p) => chance(p) ? pick2(ownPool(h2, phase)) : null;
    let gearLeft = chance(0.85) ? 1 + (rounds > 0 && chance(0.5) ? 1 : 0) : 0, kindLeft = chance(0.6) ? 1 : 0;
    const gearBit = (h2) => {
      if (gearLeft <= 0) return null;
      const g = gearPools(gear, h2, body);
      if (!g.length) return null;
      gearLeft--;
      return pick2(pickFrom(g));
    };
    const kindBit = () => {
      if (kindLeft <= 0) return null;
      kindLeft--;
      return kindLine(animal, pick2);
    };
    if (persona.short) rounds = 0;
    add(first ? chance(0.6) ? pick2(persona.arrive) : pick2(ARRIVE) : pick2(NEXT_UP));
    if (!first && chance(0.5)) add(pick2(persona.arrive));
    add(atmos());
    add(sized(pick2(REVEAL2[v.type]), v));
    if (hole === "mouth" && funnel) {
      add(pick2(FUNNEL));
      add(pick2(FUNNEL));
      add(talk());
      add(pick2(FUNNEL));
      add(voice() || atmos());
      add(pick2(FUNNEL));
      add(pick2(BUILD));
      const [lo2, hi2] = SIZES[v.size].ml, ml2 = Math.round(between2(lo2, hi2) * (LOAD_X2[v.type] || 1));
      add(finishLine(v, hole, ml2, true, true, pick2), { finish: true, inside: true, ml: ml2, hole, visitor: v });
      add(pick2(FUNNEL_AFTER));
      add(chance(0.6) ? pick2(persona.leave) : pick2(LEAVE));
      return;
    }
    add(pick2(TEASE[hole]));
    if (!persona.short && chance(0.6)) add(pick2(TEASE[hole]));
    add(pick2((ENTRY2[v.type] || ENTRY2.human)[hole] || ENTRY2.human[hole]));
    if (BIG(v) && STRETCH[hole]) add(pick2(STRETCH[hole]));
    let h = hole;
    add(pick2(REACT[h].early));
    add(own(h, "early", 0.45));
    add(pick2(RHYTHM[h].early));
    add(pick2(PACE_LINE[persona.pace]));
    add(pick2(RHYTHM[h].mid));
    add(pick2(TYPE_RHYTHM2[v.type]));
    add(pick2(REACT[h].mid));
    add(own(h, "mid", 0.55) || gearBit(h));
    add(talk());
    add(gearBit(h));
    if (!persona.short) {
      add(pick2(RHYTHM[h].mid));
      add(voice() || atmos());
    }
    if (!persona.short) {
      add(pick2(REACT[h].mid));
      add(pick2(RHYTHM[h].mid));
      add(own(h, "mid", 0.5) || atmos());
    }
    for (let r = 0; r < rounds; r++) {
      const others = (holes || []).filter((x) => x !== h);
      if (v.type !== "double" && others.length && chance(0.4)) {
        const to = pickFrom(others);
        add(pick2(SWITCH).replace("%from", HOLE_WORD[h]).replace("%to", HOLE_WORD[to]));
        h = to;
        add(pick2(REACT[h].early));
      } else add(pick2(SECOND_WIND));
      add(pick2(RHYTHM[h].mid));
      add(pick2(TYPE_RHYTHM2[v.type]));
      add(pick2(REACT[h].mid));
      add(chance(0.5) ? own(h, "mid", 1) : kindBit());
      add(talk() || voice());
    }
    add(pick2(RHYTHM[h].late));
    add(pick2(REACT[h].late));
    add(own(h, "late", 0.6) || kindBit());
    add(talk());
    add(kindBit());
    add(pick2(BUILD));
    const inside = persona.alwaysInside || v.type === "canine" || v.type === "double" || chance(0.6);
    const [lo, hi] = SIZES[v.size].ml;
    const ml = Math.round(between2(lo, hi) * (LOAD_X2[v.type] || 1));
    add(finishLine(v, h, ml, inside, false, pick2), { finish: true, inside, ml, hole: h, visitor: v });
    if (inside && v.type === "canine") {
      add(pick2(KNOT_HOLD));
      add(pick2(KNOT_FREE));
    }
    add(inside ? pick2(AFTER.inside[h]) : pick2(AFTER.outside));
    add(voice());
    add(chance(0.65) ? pick2(persona.leave) : pick2(LEAVE));
  }
  var JOIN2 = [
    "Another set of footsteps stops outside. A second hatch in %n's stall creaks open.",
    "%n is still busy when the board %where slides aside. Somebody else wants a turn, and they're not waiting.",
    '"Room for one more?" a new voice asks. Nobody says no, least of all %n.',
    "A second stranger has been watching through the slats. Now they step up to the hatch %where.",
    "The stall's other hatch clacks open. Someone's been waiting their turn and decided they don't have to.",
    "Two sets of boots now. The second one stops right at the hatch %where.",
    'A low whistle from outside: "Look at that. Both ends free?" Not for long.',
    "A hand slaps the board %where, then the hatch there swings open. %n isn't getting a break.",
    `The first stranger laughs as a second steps up: "Go on, there's plenty of %n to go round."`,
    "Somebody new jingles a coin into the tin and heads straight for the free hatch %where.",
    "A second shadow falls over the slats, and the hatch %where opens without so much as a knock.",
    `"Don't mind me," says a new voice, and the hatch %where swings wide.`
  ];
  var JOIN3 = [
    "A third shadow falls across the slats. Every hatch in %n's stall is spoken for now.",
    '"Make room," says a third voice, and the last hatch opens.',
    "%n hears a third zipper. There's one hatch left, and it doesn't stay empty.",
    "A third stranger squeezes in at the last hatch, and %n is completely surrounded.",
    "Word has gotten around the barn. A third one steps up, already hard.",
    "The stall rocks as a third stranger leans on it. %n has three now."
  ];
  var TOGETHER = {
    any: [
      "Both strangers find a rhythm together, and %n is pushed back and forth between them like a toy.",
      "When one pushes in, the other pulls back. %n is never empty for a second.",
      "They thrust at the same moment, and %n is pinned in the middle, filled at both ends.",
      "%n's %a and %b are both stuffed full, and every sound %n makes is a moan.",
      "The stall shakes from two sides now, two rhythms that never quite match.",
      "%n can feel both of them throbbing at once, one in their %a, one in their %b.",
      "One stranger slows down so the other can speed up. They're working %n like a team.",
      '"Feel that?" one asks the other through the boards. They both laugh, and both push deeper into %n.',
      "%n is pushed one way and pulled the other. Either way, someone's buried in them.",
      "Every thrust into %n's %b drives them forward onto the cock in their %a.",
      "The two of them settle into it, unhurried, using %n's %a and %b like they've done this together before.",
      "%n is so full of the two of them that there's no room left to think."
    ],
    // the mouth and one behind
    spit: [
      "Spitroasted between the two hatches, %n is rocked forward onto one cock and back onto the other.",
      "Drool runs from %n's stuffed mouth with every push from behind.",
      "The one behind thrusts hard, and it shoves %n's face all the way down onto the one in front.",
      "%n can't moan properly with their mouth full, so the moans come out muffled and wet around the cock in their throat.",
      "Hands from the front hatch hold %n's head steady while the one behind sets the pace.",
      "Front and back, in and out, and %n is the thing in the middle that makes it work.",
      `"Hold still for me," says the one behind. "No, for me," says the one in front, and %n can't hold still for either of them.`,
      "The one in front pulls out to let %n breathe, just as the one behind slams deep, and the gasp is all for them.",
      "%n's whole body is stretched between two hatches, a cock at each end and nowhere to go.",
      "Every stroke from behind pushes %n's lips to the root of the cock in front."
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
      "They find each other's rhythm through %n, and %n is the thing that ties it together."
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
      "Muffled moans, wet sounds from three directions, and the stall shaking on its frame."
    ]
  };
  var FIRST_DONE = [
    "One stranger is spent, but the other is nowhere near done with %n.",
    "One pulls out, finished, and the other takes it as a cue to really go to town on %n.",
    "With one hatch empty now, all of %n's attention lands on the one still going.",
    '"My turn to finish," growls the one still at it, and %n braces.',
    "The finished one hangs around at the hatch to watch the other use %n.",
    "One down. The other is still pounding away like nothing happened.",
    "%n barely has time to feel the first load before the other stranger picks up the pace.",
    "The first one zips up and leaves %n to the other, who isn't slowing down."
  ];
  var BOTH_AT_ONCE = [
    "They finish at the same moment, both hatches shaking, and %n is flooded at both ends at once.",
    "One groans, then the other, and then they're both cumming into %n together.",
    '"Now," one of them gasps, and they let go together, pumping %n full from both sides.',
    "Both of them bury themselves as deep as they can go and empty into %n at the same time.",
    "The stall goes still and tight, both strangers shuddering, and %n feels it from two places at once.",
    "Two loads at once. %n doesn't know which to feel first."
  ];
  var ALL_DONE = [
    "Every hatch is empty now. %n sags in the stall, dripping from more than one place.",
    "The hatches close one by one. %n is left used, full, and trembling.",
    "Nobody's left at the holes. %n slumps against the boards, leaking, breathing hard.",
    "Quiet again, at last. %n hangs there, full of strangers, legs shaking.",
    "The strangers leave together, laughing low. %n can feel what they left behind for a long time."
  ];
  var SIDE = { mouth: "in front of %n", vulva: "behind %n", butt: "behind %n" };
  var HOLE_SAYS = { mouth: /mouth|throat|tongue|lips/i, vulva: /pussy/i, butt: /\bass\b/i };
  function atHole(h, line, bothBehind) {
    if (!line || HOLE_SAYS[h].test(line)) return line;
    const lead = h !== "mouth" && bothBehind ? "In %n's " + HOLE_WORD[h] + ", " : "At the hatch " + SIDE[h] + ", ";
    return lead + line.charAt(0).toLowerCase() + line.slice(1);
  }
  function revealAt(h, v, pick2) {
    const line = sized(pick2(REVEAL2[v.type]), v);
    return "At the hatch " + SIDE[h] + ", " + line.charAt(0).toLowerCase() + line.slice(1);
  }
  var say = (h, line) => (h === "mouth" ? "From the hatch in front of %n: " : "From behind %n: ") + line;
  function together(beats, { hole, visitor, holes, degrade, praise, pick: pick2, rough, gear, animal, body }) {
    const add = (t, extra2) => {
      if (t) beats.push(Object.assign({ t }, extra2 || {}));
    };
    const back = holes.filter((h) => h !== "mouth"), order = [hole];
    if (hole === "mouth") order.push(pickFrom(back));
    else order.push(holes.includes("mouth") && chance(0.65) ? "mouth" : back.find((h) => h !== hole) || "mouth");
    const third = holes.find((h) => !order.includes(h));
    if (third && chance(0.35)) order.push(third);
    const bothBehind = order.includes("vulva") && order.includes("butt");
    const at = (h, line) => atHole(h, line, bothBehind);
    const vis = order.map((h, i) => i === 0 ? visitor : (() => {
      let v;
      do {
        v = pickVisitor(holes);
      } while (v.type === "double");
      return v;
    })());
    const pers = order.map((h) => PERSONAS2[pickPersona(h, rough)]);
    const talk = (i) => chance(0.5) ? say(order[i], pick2(pers[i].talk)) : null;
    const voice = () => degrade && chance(0.3) ? "A voice through the boards: " + kindWords(pick2(TAUNTS), animal) : praise && chance(0.3) ? "A voice through the boards: " + kindWords(pick2(PRAISES), animal) : null;
    let gearLeft = chance(0.85) ? 1 : 0, kindLeft = chance(0.6) ? 1 : 0;
    const extra = (h) => {
      if (gearLeft > 0 && chance(0.4)) {
        const g = gearPools(gear, h, body);
        if (g.length) {
          gearLeft--;
          return pick2(pickFrom(g));
        }
      }
      if (kindLeft > 0 && chance(0.3)) {
        kindLeft--;
        return kindLine(animal, pick2);
      }
      return chance(0.35) ? pick2(ownPool(h, "mid")) : null;
    };
    const pool = () => {
      const both = order.slice(0, 2), lines = TOGETHER.any.slice();
      if (both.includes("mouth")) lines.push(...TOGETHER.spit, ...TOGETHER.spit);
      else lines.push(...TOGETHER.dp, ...TOGETHER.dp);
      return pick2(lines).replace(/%a/g, HOLE_WORD[both[0]]).replace(/%b/g, HOLE_WORD[both[1]]);
    };
    const first = order.length === 3 ? () => pick2(TOGETHER.three) : pool;
    add(chance(0.6) ? pick2(pers[0].arrive) : pick2(ARRIVE));
    add(revealAt(order[0], vis[0], pick2), { reveal: true });
    add(at(order[0], pick2(TEASE[order[0]])));
    add(at(order[0], pick2((ENTRY2[vis[0].type] || ENTRY2.human)[order[0]] || ENTRY2.human[order[0]])));
    if (BIG(vis[0]) && STRETCH[order[0]]) add(at(order[0], pick2(STRETCH[order[0]])));
    add(at(order[0], pick2(RHYTHM[order[0]].early)));
    add(pick2(REACT[order[0]].early));
    for (let i = 1; i < order.length; i++) {
      add((i === 1 ? pick2(JOIN2) : pick2(JOIN3)).replace("%where", SIDE[order[i]]));
      add(revealAt(order[i], vis[i], pick2), { reveal: true });
      add(at(order[i], pick2((ENTRY2[vis[i].type] || ENTRY2.human)[order[i]] || ENTRY2.human[order[i]])));
      if (BIG(vis[i]) && STRETCH[order[i]]) add(at(order[i], pick2(STRETCH[order[i]])));
      add(i === 2 ? pick2(TOGETHER.three) : pool());
    }
    const rounds = 4 + Math.floor(Math.random() * 4);
    for (let r = 0; r < rounds; r++) {
      const i = r % order.length, h = order[i];
      add(at(h, pick2(RHYTHM[h].mid)));
      if (chance(0.6)) add(at(h, pick2(TYPE_RHYTHM2[vis[i].type])));
      add(pick2(REACT[h].mid));
      add(extra(h));
      add(chance(0.6) ? first() : talk(i));
      if (chance(0.3)) add(voice() || (chance(0.5) ? pick2(ATMOS) : null));
    }
    for (let i = 0; i < order.length; i++) add(at(order[i], pick2(RHYTHM[order[i]].late)));
    add(pick2(REACT[order[0]].late));
    if (chance(0.5)) add(pick2(ownPool(order[0], "late")));
    add(pick2(BUILD));
    const load = (v) => {
      const [lo, hi] = SIZES[v.size].ml;
      return Math.round(between2(lo, hi) * (LOAD_X2[v.type] || 1));
    };
    const finishOne = (i) => {
      const v = vis[i], h = order[i], inside = v.type === "canine" || chance(0.65), ml = load(v);
      add(finishLine(v, h, ml, inside, false, pick2), { finish: true, inside, ml, hole: h, visitor: v });
      return inside;
    };
    const insides = [];
    let i0 = 0;
    if (order.length >= 2 && chance(0.3)) {
      add(pick2(BOTH_AT_ONCE));
      insides.push(finishOne(0), finishOne(1));
      i0 = 2;
    } else {
      insides.push(finishOne(0));
      i0 = 1;
    }
    for (let i = i0; i < order.length; i++) {
      add(pick2(FIRST_DONE));
      add(at(order[i], pick2(RHYTHM[order[i]].late)));
      if (chance(0.5)) add(talk(i));
      add(pick2(BUILD));
      insides.push(finishOne(i));
    }
    const knotted = order.findIndex((h, i) => vis[i].type === "canine" && insides[i]);
    if (knotted >= 0) add(pick2(KNOT_HOLD));
    for (let i = 0; i < order.length; i++) if (insides[i] && chance(0.7)) add(pick2(AFTER.inside[order[i]]));
    if (knotted >= 0) add(pick2(KNOT_FREE));
    add(voice());
    add(pick2(ALL_DONE));
  }
  var ARRANGE = {
    punished: {
      open: [
        "The punishment frame closes around %n with a heavy clunk: neck and wrists pinned in the board, hips strapped down, every hole turned toward the hatches. Nobody asked %n what they wanted today.",
        "A farmhand buckles %n into the stall's punishment rig and tugs every strap twice. %n can't stand, can't turn, can't hide. The sign on the door says USE FREELY.",
        "%n is bent over the padded bar and locked there, ankles held apart by a bar bolted to the floor. The shift clock on the wall starts ticking.",
        "The stocks board drops into place over %n's neck and wrists. Behind them, the hatches slide open one by one. This is a punishment, and the whole barn knows it.",
        "%n is strapped in face first against the wall, hips held up by a padded sling, and left there. Whoever comes by gets to use %n however they like, for as long as the shift lasts.",
        "The punishment stall's door is locked behind %n. Cuffs at the wrists, a strap across the back, the hatches open. A stick of chalk hangs by the tally board for the strangers to keep count."
      ],
      remind: [
        "The straps creak as %n is shoved forward, and they hold %n exactly where the stranger wants them.",
        "%n couldn't pull away if they tried. The frame makes sure of that.",
        "Somebody outside reads the punishment sign out loud and laughs.",
        "The stocks board digs into %n's neck with every thrust. There's nowhere to go.",
        "A passing farmhand checks the straps, finds them tight, and leaves %n to it.",
        "The chalk squeaks on the tally board as another mark goes up beside %n's name.",
        "%n's cuffed hands open and close on nothing. That's all the say they get today."
      ],
      close: [
        "The frame stays locked. The shift isn't over just because one stranger is.",
        "%n hangs in the straps, used and dripping, waiting for whoever's next whether they like it or not.",
        "Another chalk mark on the board. Still locked in. Still on the clock.",
        "Nobody comes to let %n out. The hatches stay open."
      ]
    },
    bound: {
      open: [
        "Bound as they already are, %n is guided down onto the stall's padded kneeler and left there, helpless and on display.",
        "With their arms already tied, all %n can do is kneel where they're put. A farmhand nudges them right up against the hatch and walks away.",
        "%n is led into the stall in their bonds and bent over the bench, a strap cinched across their back to keep them there.",
        "Tied up and put on show, %n is arranged on the stall's bench like a gift waiting to be unwrapped.",
        "A farmhand takes %n by their bonds, steers them into the stall and positions them just so, then latches the door."
      ],
      remind: [
        "%n pulls at their bonds without meaning to. They hold, of course.",
        "Tied the way they are, %n can't do a thing to slow the stranger down.",
        "The ropes creak in time with every thrust into %n.",
        "%n squirms in their bonds, which only makes the stranger grip them harder.",
        "Bound and kept in place, %n just has to take whatever comes through the hatch."
      ],
      close: [
        "Still tied, %n is left exactly where they were put, waiting for the next one.",
        "Nobody unties %n. They're not finished being used yet.",
        "%n stays bound and dripping, right where the farmhand left them."
      ]
    },
    voluntary: {
      open: {
        kneel: [
          "%n kneels on the soft mat in front of the low hatch, hands folded in their lap, mouth already open and waiting.",
          "%n settles onto their knees by the hatch all on their own and rests their cheek against the warm wood to wait.",
          "%n kneels at the hatch with their hands behind their back, nobody's rule but their own."
        ],
        bench: [
          "%n bends over the padded bench by choice, hips up, and reaches back to spread themselves for whoever comes.",
          "%n climbs onto the stall's bench, rests their chest on the cushion and settles their ass right up against the hatch. Nobody made them.",
          "%n lies over the bench and lets their legs fall open, offered up and waiting."
        ],
        fours: [
          "%n gets down on all fours in the straw, backed up to the hatch, and waits like a good farm animal.",
          "%n drops to hands and knees in the stall and eases back until they feel the cool air of the hatch on their skin."
        ],
        wall: [
          "%n presses themselves flat to the hatch wall, lined up with the openings, and holds very still.",
          "%n stands in the stall with their hands on the beam overhead, back arched, offered up to the hatches."
        ]
      },
      remind: [
        "%n stays exactly where they put themselves, nothing holding them there but how much they want it.",
        "Nothing's holding %n in place. They stay anyway.",
        "The stall door is unlatched right behind %n. They don't even look at it.",
        "%n could step off the spot whenever they like. They don't."
      ],
      close: [
        "%n stays right where they are, still in position, waiting for whoever's next.",
        "%n doesn't move. They came here for this, and they're not done.",
        "The stranger's gone. %n settles back into position, ready for more."
      ]
    }
  };
  function arrange(beats, setup, firstHole, pick2) {
    const A = ARRANGE[setup];
    if (!A) return;
    const open = setup === "voluntary" ? pick2(A.open[firstHole === "mouth" ? pickFrom(["kneel", "kneel", "wall"]) : pickFrom(["bench", "fours", "wall"])]) : pick2(A.open);
    const firstFinish = beats.findIndex((b) => b.finish);
    const end = firstFinish > 0 ? firstFinish : beats.length;
    const spots = [Math.floor(end / 3), Math.floor(2 * end / 3)].filter((i) => i > 3).sort((a, b) => b - a);
    for (const i of spots) beats.splice(i, 0, { t: pick2(A.remind) });
    beats.unshift({ t: open });
    beats.push({ t: pick2(A.close) });
  }
  function buildScene({ hole, visitor, funnel, degrade, praise, holes, length, setup, body, gear, animal }) {
    const beats = [], open = holes && holes.length ? holes : [hole], pick2 = freshPicker(body);
    const usable = open.filter((h) => h !== "mouth" || !funnel);
    const canTogether = usable.length >= 2 && visitor.type !== "double" && usable.includes(hole);
    const r = setup === "punished" ? 0.3 + Math.random() * 0.7 : Math.random();
    let kind = length || (r < 0.3 ? "single" : r < 0.62 ? "long" : r < 0.84 && canTogether ? "together" : r < 0.84 ? "long" : "marathon");
    if (kind === "together" && !canTogether) kind = "long";
    if (kind === "together") {
      together(beats, { hole, visitor, holes: usable, degrade, praise, pick: pick2, rough: setup === "punished", gear, animal, body });
      arrange(beats, setup, hole, pick2);
      const fin = beats.filter((b) => b.finish);
      return { beats, kind, ml: fin.reduce((a, b) => a + b.ml, 0), inside: fin.some((b) => b.inside) };
    }
    const rounds = () => kind === "single" ? 0 : 1 + Math.floor(Math.random() * 2);
    oneVisitor(beats, { hole, visitor, funnel, degrade, praise, rounds: rounds(), first: true, holes: open, pick: pick2, rough: setup === "punished", gear, animal, body });
    if (kind === "marathon") {
      const more = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < more; i++) {
        const v = pickVisitor(open);
        const h = v.type === "double" ? "vulva" : pickFrom(open);
        oneVisitor(beats, { hole: h, visitor: v, funnel: funnel && h === "mouth", degrade, praise, rounds: Math.random() < 0.4 ? 1 : 0, first: false, holes: open, pick: pick2, rough: setup === "punished", gear, animal, body });
      }
    }
    arrange(beats, setup, hole, pick2);
    const finishes = beats.filter((b) => b.finish);
    return { beats, kind, ml: finishes.reduce((a, b) => a + b.ml, 0), inside: finishes.some((b) => b.inside) };
  }
  function buildRealScene({ hole, visitor, funnel, ml, inside, body }) {
    const pick2 = freshPicker(body);
    if (hole === "mouth" && funnel) return [sized(pick2(REVEAL2[visitor.type]), visitor), pick2(FUNNEL), pick2(FUNNEL), finishLine(visitor, hole, ml, true, true, pick2)];
    return [
      sized(pick2(REVEAL2[visitor.type]), visitor),
      pick2((ENTRY2[visitor.type] || ENTRY2.human)[hole] || ENTRY2.human[hole]),
      pick2(RHYTHM[hole].mid),
      pick2(TYPE_RHYTHM2[visitor.type]),
      finishLine(visitor, hole, ml, inside, funnel, pick2)
    ];
  }
  addOct15();
  Object.assign(TYPES2, TYPES);
  Object.assign(LOAD_X2, LOAD_X);
  Object.assign(REVEAL2, REVEAL);
  Object.assign(ENTRY2, ENTRY);
  Object.assign(TYPE_RHYTHM2, TYPE_RHYTHM);
  Object.assign(PERSONAS2, PERSONAS);
  for (const h of ["mouth", "vulva", "butt"]) {
    into(RHYTHM[h].mid, DEEPER.RHYTHM[h]);
    into(REACT[h].mid, DEEPER.REACT[h]);
  }
  into(ATMOS, DEEPER.ATMOS);

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
  var stallOf = (mn) => stallIds().find((id) => api.onSpot(mn, "glory-" + id, 0)) || null;
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
  var named = (text, mn) => api.nameOnce ? api.nameOnce(String(text), mn) : String(text).replace(/%n/g, api.name(mn));
  function startScene(id, mn) {
    const holes = openHoles(mn);
    if (!holes.length) return;
    let visitor = pickVisitor(holes);
    try {
      if (api.potions && api.potions(mn).includes("goblinmusk") && Math.random() < 0.6) visitor = { type: "goblin", size: Math.random() < 0.5 ? "thick" : "huge" };
    } catch (e) {
    }
    const hole = visitor.type === "double" ? "vulva" : pick(holes);
    const r = api.rec(mn) || {}, funnel = hole === "mouth" && api.funnelOn(mn);
    const sh = D().shifts[mn], C = api.char(mn);
    const tied = !!(C && (C.Appearance || []).some((x) => x && x.Asset && x.Asset.Group && ["ItemArms", "ItemHands"].includes(x.Asset.Group.Name)));
    const setup = sh && sh.punish && sh.until > Date.now() ? "punished" : tied ? "bound" : "voluntary";
    const scene = buildScene({ hole, visitor, funnel, degrade: !!r.degradeMe, praise: !!r.praiseMe, holes, setup, body: bodyOf(api, mn), gear: gearOf(api, mn), animal: animalOf(api, mn) });
    running.set(id, { mn, scene, hole, visitor, i: 0 });
    api.log("stall " + id + ": " + scene.kind + ", " + visitor.size + " " + visitor.type + " in the " + hole + " for " + mn);
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
    api.privateEmote(mn, named(beat.t, mn));
    if (run.i === 3 && api.potionBit) {
      const pb = api.potionBit(mn);
      if (pb) api.later(() => api.privateEmote(mn, pb), 7e3);
    }
    if (run.i === 2 && api.tailBit) {
      const tb = api.tailBit(mn, run.hole, "the stranger");
      if (tb) api.later(() => api.privateEmote(mn, tb), 9e3);
    }
    if (beat.finish) {
      finish(id, mn, beat.hole || run.hole, beat.ml, beat.inside, beat.visitor || run.visitor);
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
      if (api.splat) for (const h of holes) api.splat(mn, h);
      p.totals.received = (p.totals.received || 0) + ml;
      p.last = p.last || Date.now();
    }
    api.tally(mn);
    const me = d.people[mn] = d.people[mn] || { holes: {}, ml: 0 };
    bump(me, 1);
    if (inside) {
      for (const h of holes) me.holes[h] = (me.holes[h] || 0) + 1;
      me.ml = (me.ml || 0) + ml;
    } else {
      me.splatters = (me.splatters || 0) + 1;
      me.mlOutside = (me.mlOutside || 0) + ml;
      if (api.paint) api.paint(mn, hole === "mouth" ? "face" : hole === "butt" ? "back" : "ass");
    }
    me.biggest = Math.max(me.biggest || 0, ml);
    if (visitor) {
      me.kinds = me.kinds || {};
      me.kinds[visitor.type] = (me.kinds[visitor.type] || 0) + 1;
    }
    bump(d.stalls[id] = d.stalls[id] || {}, 1);
    {
      const cl = Object.values(d.claims || {}).find((c) => c.mn === mn && c.day === today());
      if (cl) cl.n = (cl.n || 0) + 1;
    }
    const leader = api.herdLeaderOf(mn);
    if (leader) api.staffPoints(leader, 1, "glory");
    const r = api.rec(mn);
    let took = null;
    const womb = holes.find((h) => api.canCatchIn ? api.canCatchIn(mn, h) : h === "vulva");
    if (inside && womb && r && r.breedable && r.fertile && !api.limitBlocks(mn, "breed")) {
      if (p) p.lastFill = { at: Date.now(), stud: api.ANON_STUD, ml: ml / holes.length, hole: womb };
      took = api.rollConception(mn, api.ANON_STUD, ml / holes.length, void 0, womb);
      if (took === "new") api.later(() => api.notice(mn, "\u{1F37C} A warm, heavy feelin' settles low in your belly\u2026 somethin' from the stalls took, sugar. (?stats shows it)"), 2e4);
    }
    if (inside && api.bred) for (const h of holes) api.bred(mn, api.ANON_STUD, h, ml / holes.length, h === (womb || "vulva") ? took : null);
    api.save();
  }
  try {
    const WW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    if (WW.__FARMHAND_TEST__) WW.__gloryFinish = (...x) => finish(...x);
  } catch (e) {
  }
  function scheduleNext(id, mn) {
    const sh = D().shifts[mn], pun = sh && sh.punish && sh.until > Date.now();
    const s = D().stalls[id] = D().stalls[id] || {};
    s.next = Date.now() + (pun ? between(5, 15) : between(10, 30)) * 6e4;
    api.save();
  }
  var toldWhy = {};
  function tick() {
    const d = D(), now = Date.now();
    try {
      claimsTick();
    } catch (e) {
    }
    for (const [mn, sh] of Object.entries(d.shifts)) {
      if (sh.until > now) continue;
      delete d.shifts[mn];
      api.notice(Number(mn), "\u{1F573}\uFE0F Your " + (sh.punish ? "punishment " : "") + "shift in the glory stalls is over, sugar. You can step out.");
      if (api.ribbons) api.ribbons(Number(mn), sh.punish ? 1 : 3, sh.punish ? "servin' out your punishment shift" : "workin' a shift in the glory stalls");
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
          toldWhy[mn] = toldWhy[mn] || 0;
          if (Date.now() - toldWhy[mn] > 6e5) {
            toldWhy[mn] = Date.now();
            api.notice(mn, "\u{1F573}\uFE0F This is glory stall " + id + ", but nothin' will happen here: " + why + ".");
          }
          s.next = Infinity;
          continue;
        }
        s.next = now + between(2, 5) * 6e4;
        api.notice(mn, "\u{1F573}\uFE0F You're in glory stall " + id + ". Somebody will come along soon. Step off the spot whenever you want to stop.");
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
          api.notice(v, "\u{1F573}\uFE0F Stall " + id + " is occupied. ?stall use mouth, ?stall use pussy or ?stall use ass. Whoever's inside never learns your name.");
        }
        continue;
      }
      if (now >= (s.next || 0) && !whyNot(mn)) {
        startScene(id, mn);
        continue;
      }
      if (!whyNot(mn) && now >= (s.atmosAt || 0)) {
        if (s.atmosAt) api.privateEmote(mn, named(pick(ATMOS), mn));
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
      return c.reply(w === "on" ? "\u{1F573}\uFE0F Glory stalls: ON. Stand on a glory stall spot and strangers will use you, and staff can put you on punishment shifts. Your limits and whatever's locked on you still count. ?glory off any time." : "\u{1F573}\uFE0F Glory stalls: OFF. Nothin' will happen to you in the stalls, and nobody can put you on a punishment shift.");
    }
    const me = d.people[sender];
    c.reply("\u{1F573}\uFE0F Glory stalls: " + (d.optIn[sender] ? "ON" : "OFF") + " (?glory on / ?glory off)" + (me ? "\nToday: " + (me.day === today() ? me.today : 0) + " \xB7 all time: " + (me.total || 0) + " (mouth " + (me.holes.mouth || 0) + ", pussy " + (me.holes.vulva || 0) + ", ass " + (me.holes.butt || 0) + (me.splatters ? ", over them " + me.splatters : "") + ")" + (me.biggest ? " \xB7 biggest load " + Math.round(me.biggest) + " mL" : "") + (me.kinds ? " \xB7 most often: " + Object.entries(me.kinds).sort((a, b) => b[1] - a[1])[0][0] : "") : "") + (d.shifts[sender] ? "\nOn " + (d.shifts[sender].punish ? "a punishment " : "") + "shift for " + Math.ceil((d.shifts[sender].until - Date.now()) / 6e4) + " more minutes." : ""));
  }
  function claimOf(id) {
    const c = (D().claims || {})[id];
    return c && c.day === today() ? c : null;
  }
  function tallyOf(mn) {
    const me = D().people[mn];
    return me && me.day === today() ? me.today : 0;
  }
  function claimsTick() {
    const d = D();
    d.claims = d.claims || {};
    const old = Object.entries(d.claims).filter(([, c]) => c.day !== today());
    if (!old.length) return;
    let best = null;
    for (const [id, c] of old) {
      const n = c.n || 0;
      if (n > 0 && (!best || n > best.n)) best = { id, mn: c.mn, n };
      delete d.claims[id];
    }
    if (best) {
      api.notice(best.mn, "\u{1F573}\uFE0F Your stall had the fullest tally on the farm yesterday, sugar: " + best.n + ". That's a ribbon.");
      if (api.ribbons) api.ribbons(best.mn, 1, "the fullest glory stall of the day");
    }
    api.save();
  }
  function board(staff) {
    const d = D(), ids = stallIds();
    if (!ids.length) return "\u{1F573}\uFE0F No glory stalls are set up yet. Herdmasters: ?spot set glory-1 inside the booth and ?spot set glory-1-visitor outside the hole.";
    return "\u{1F573}\uFE0F GLORY STALLS\n" + ids.map((id) => {
      const s = d.stalls[id] || {}, mn = occupantOf(id), n = s.day === today() ? s.today : 0;
      const sh = mn && d.shifts[mn];
      const cl = claimOf(id);
      return "Stall " + id + (cl ? " (" + api.name(cl.mn) + "'s stall, " + tallyOf(cl.mn) + " today)" : "") + ": " + (mn ? (staff || cl && cl.mn === mn ? api.name(mn) : "occupied") + (running.has(id) ? " \xB7 busy right now" : "") : "empty") + " \xB7 " + n + " today" + (staff && sh ? " \xB7 " + (sh.punish ? "punishment " : "") + "shift, " + Math.ceil((sh.until - Date.now()) / 6e4) + " min left" : "");
    }).join("\n");
  }
  function cmdStall(c) {
    const { sender, args, api: A } = c, d = D(), sub = String(args[0] || "").toLowerCase(), staff = A.isStaff(sender);
    if (!sub || sub === "board") return c.reply(board(staff));
    if (sub === "claim" || sub === "unclaim") {
      d.claims = d.claims || {};
      const mine = Object.entries(d.claims).find(([, x]) => x.mn === sender && x.day === today());
      if (sub === "unclaim") {
        if (!mine) return c.reply("You've no stall of your own today, sugar.");
        delete d.claims[mine[0]];
        A.save();
        return c.reply("\u{1F573}\uFE0F Your name's off the door of stall " + mine[0] + ".");
      }
      const id = stallOf(sender);
      if (!id) return c.reply("Stand in the stall you want first, sugar, then ?stall claim.");
      if (whyNot(sender)) return c.reply("You can't claim a stall just now: " + whyNot(sender) + ".");
      if (mine) return c.reply(mine[0] === id ? "Stall " + id + " is already yours today, sugar." : "You've got stall " + mine[0] + " today, sugar. ?stall unclaim first if you want this one.");
      if (claimOf(id)) return c.reply("Stall " + id + " has " + A.name(claimOf(id).mn) + "'s name on the door today.");
      d.claims[id] = { mn: sender, day: today(), n: 0 };
      A.save();
      A.privateEmote(sender, "The farm girl chalks " + A.name(sender) + "'s name on the door of stall " + id + `, with a zero under it. "Let's see you fill that in, sugar."`);
      return c.reply("\u{1F573}\uFE0F Stall " + id + " is yours for today. Your name's on the door and every finish gets chalked under it, on the ?stalls board for all to see. The fullest door tonight earns a ribbon. ?stall unclaim takes it down.");
    }
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
      const visitor = { type: TYPES2[kind] ? kind : "human", size: sizeFromInches(A.cockInches(sender) || 7) };
      if (visitor.type === "double" && !(hole !== "mouth" && openHoles(mn).includes("vulva") && openHoles(mn).includes("butt"))) visitor.type = "human";
      const inside = true, funnel = hole === "mouth" && A.funnelOn(mn);
      A.privateEmote(sender, "You step up to the hole and push through into the " + w + " waiting on the other side. You finish " + (load >= 1 ? "deep inside, about " + Math.round(load) + " mL" : "with a shudder") + ". Whoever's in there never sees your face.");
      const body = bodyOf(A, mn);
      const lines = load >= 1 ? buildRealScene({ hole, visitor, funnel, ml: load, inside, body }) : buildRealScene({ hole, visitor, funnel, ml: 0, inside, body }).slice(0, 4).concat(["The stranger shudders and finishes against the wall, then pulls away."]);
      lines.forEach((l, i) => A.later(() => A.privateEmote(mn, named(l, mn)), i * 5e3));
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
      if (who !== sender) A.notice(who, "\u{1F573}\uFE0F " + A.name(sender) + " put you on a " + mins + " minute shift in the glory stalls. Find an empty stall, sugar.");
      return c.reply("\u{1F573}\uFE0F " + (who === sender ? "You're" : A.name(who) + " is") + " on a " + mins + " minute stall shift.");
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
      A.notice(who, "\u{1F573}\uFE0F " + A.name(sender) + " sentenced you to " + mins + " minutes in the glory stalls" + (free ? ", stall " + free : ". Find a free stall") + ". Strangers come more often on a punishment shift. Your safeword still works.");
      return c.reply("\u{1F573}\uFE0F " + A.name(who) + " is on a " + mins + " minute punishment shift" + (free ? " in stall " + free : " (no stall's free right now, they'll have to wait for one)") + ".");
    }
    if (sub === "release" || sub === "end") {
      const who = args[1] ? A.find(args[1]) : sender;
      if (who !== sender && !staff) return c.reply("Only staff end somebody else's shift, sugar.");
      if (!who || !d.shifts[who]) return c.reply((who === sender ? "You're" : A.name(who) + " isn't") + (who === sender ? " not on a shift, hon." : " on a shift, hon."));
      if (who === sender && d.shifts[who].punish) return c.reply("You can't let yourself off a punishment shift, sugar. Ask staff, or use your safeword if you need out.");
      delete d.shifts[who];
      A.save();
      if (who !== sender) A.notice(who, "\u{1F573}\uFE0F " + A.name(sender) + " let you off your stall shift.");
      return c.reply("\u{1F573}\uFE0F Shift ended.");
    }
    c.reply("?stalls shows the board \xB7 ?stall use mouth|pussy|ass (from a visitor spot) \xB7 ?stall shift <minutes>" + (staff ? " \xB7 ?stall shift <who> <minutes> \xB7 ?stall punish <who> <minutes> \xB7 ?stall release <who>" : ""));
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
      toggles: [{ label: "Glory stalls: strangers can use me", desc: "Also lets staff give you punishment shifts. Your limits and whatever's locked on you still count.", on: !!d.optIn[mn], cmd: "glory " + (d.optIn[mn] ? "off" : "on") }],
      lines: me ? [["Today", me.day === today() ? me.today : 0], ["All time", me.total || 0], ["Inside: mouth \xB7 pussy \xB7 ass", (me.holes.mouth || 0) + " \xB7 " + (me.holes.vulva || 0) + " \xB7 " + (me.holes.butt || 0)], ["Splattered", me.splatters || 0]] : void 0,
      chips: sh ? [{ text: (sh.punish ? "punishment shift" : "on shift") + " \xB7 " + Math.max(0, Math.ceil((sh.until - Date.now()) / 6e4)) + " min", kind: sh.punish ? "alert" : "acc" }] : void 0,
      buttons: [{ label: "The board", cmd: "stalls" }]
    });
    if (api.isStaff(mn) && stallIds().length) {
      cards.push({
        staff: true,
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
    guide: "Stand on a glory stall spot (glory-1, glory-2\u2026) after ?glory on, and strangers come by every 10\u201330 minutes. Each visit is about five minutes of private emotes only you see, and it counts on your record. A real visitor on the stall's visitor spot can ?stall use mouth|pussy|ass. ?stalls is the board. Staff: ?stall shift <who> <minutes>, ?stall punish <who> <minutes>, ?stall release <who>. Step off the spot to stop; ?safe always works.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      glory: { usage: "glory on|off", private: true, run: cmdGlory },
      stall: { usage: "stall use|claim|unclaim|shift|punish|release", private: true, run: cmdStall },
      stalls: { usage: "stalls", private: true, run: (c) => c.reply(board(c.api.isStaff(c.sender))) }
    },
    on: { tick, safe: onSafe },
    companion
  });
})();
