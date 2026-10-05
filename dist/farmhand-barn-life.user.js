// ==UserScript==
// @name         BnB Farm add-on: Barn life
// @namespace    bnbfarm
// @version      1.0.2
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
      const slow = setInterval(() => {
        go();
        if (done) clearInterval(slow);
      }, 1e4);
    }
  }
  var pick = (list) => list[Math.floor(Math.random() * list.length)];
  var fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => vars[k] !== void 0 ? vars[k] : m);

  // addons/barn-life/index.js
  var FULL = 100;
  var PER_H = { food: 100 / 8, water: 100 / 6, groom: 100 / 24 };
  var TROUGH_HELPINGS = 20;
  var DRUNK = ["", "content", "sleepy", "milk-drunk"];
  var DRUNK_DECAY_MIN = 7;
  var api = null;
  function D() {
    const d = api.data();
    d.optIn = d.optIn || {};
    d.needs = d.needs || {};
    d.troughs = d.troughs || {};
    d.drunk = d.drunk || {};
    return d;
  }
  var on = (mn) => !D().farmOff && !!D().optIn[mn] && !!api.rec(mn);
  function needsOf(mn) {
    const d = D();
    return d.needs[mn] = d.needs[mn] || { food: FULL, water: FULL, groom: FULL, t: Date.now(), warned: {}, said: 0 };
  }
  var near = (mn, prefix) => Object.keys(api.spots()).find((n) => n.startsWith(prefix) && api.onSpot(mn, n, 1)) || null;
  var EAT = [
    "%name% buries their face in the trough and eats like they haven't seen food in days, chewing noisily.",
    "%name% noses through the feed at the trough, picking out the best bits before gobbling the rest.",
    "%name% kneels at the trough and eats without using their hands, crumbs all over their chin."
  ];
  var DRINK = [
    "%name% laps at the water trough, slurping loudly until their chin is dripping.",
    "%name% dunks their face in the water and drinks long and deep, coming up gasping.",
    "%name% drinks greedily from the water trough, splashing half of it down their chest."
  ];
  var GROOM = [
    "%by% brushes %name% down with long, firm strokes, working the tangles out until they're glossy and sighing.",
    "%by% curries %name% from neck to tail, then smooths them down with a soft brush. %name% leans into every stroke.",
    "%by% gives %name% a proper grooming: brushed, wiped down and checked over, ready for show."
  ];
  var REMIND = {
    food: ["Your tummy rumbles, %name%. The trough's waitin'.", "You're gettin' mighty hungry, %name%. Go eat at the trough."],
    water: ["Your mouth's gone dry, %name%. Get to the water.", "You're thirsty, %name%. The water trough never runs dry."],
    groom: ["You're lookin' scruffy, %name%. Ask a farmhand for a brushin'."]
  };
  var DRUNK_LINES = {
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
  function tick() {
    if (D().farmOff) return;
    const now = Date.now(), here = new Set(api.here());
    for (const [k, n] of Object.entries(D().needs)) {
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
    for (const [k, x] of Object.entries(D().drunk)) {
      if (now - x.t < DRUNK_DECAY_MIN * 6e4) continue;
      x.lvl--;
      x.t = now;
      if (x.lvl <= 0) {
        delete D().drunk[k];
        api.notice(Number(k), "🥛 The milk-drunk haze lifts. You're clear-headed again.");
      }
    }
    api.save();
  }
  function remind(mn, n) {
    if (Date.now() - (n.said || 0) < 30 * 6e4) return;
    for (const need of ["water", "food", "groom"]) {
      const lvl = n[need] <= 10 ? 10 : n[need] <= 25 ? 25 : 0;
      if (!lvl || (n.warned[need] || 100) <= lvl) continue;
      n.warned[need] = lvl;
      n.said = Date.now();
      api.notice(mn, (need === "water" ? "💧 " : need === "food" ? "🌾 " : "🪮 ") + fill(pick(REMIND[need]), { name: api.name(mn) }));
      return;
    }
  }
  function eat(mn, reply, how) {
    if (!on(mn)) return reply("Barn life isn't on for you, sugar. ?needs on switches it on.");
    const t = near(mn, "trough");
    if (!t) return reply("You need to be at a trough to eat, sugar (a spot called trough-…).");
    const d = D(), left = d.troughs[t] === void 0 ? TROUGH_HELPINGS : d.troughs[t];
    if (left <= 0) {
      api.notifyStaff("🌾 " + t + " is empty and " + api.name(mn) + " is hungry. ?refill " + t + " standing next to it.", true);
      return reply("The trough's licked clean, hon. I've told staff it needs fillin'.");
    }
    const n = needsOf(mn);
    if (n.food >= 95) return reply("You're stuffed already, sugar.");
    d.troughs[t] = left - 1;
    n.food = Math.min(FULL, n.food + 50);
    n.warned.food = 100;
    api.emote("🌾 " + fill(pick(EAT), { name: api.name(mn) }), mn);
    api.save();
    if (how !== "bowl") reply("🌾 Food " + Math.round(n.food) + "% · the trough has " + d.troughs[t] + " helpings left.");
  }
  function drink(mn, reply, how) {
    if (!on(mn)) return reply("Barn life isn't on for you, sugar. ?needs on switches it on.");
    if (!near(mn, "water")) return reply("You need to be at a water spot to drink, sugar (a spot called water-…).");
    const n = needsOf(mn);
    if (n.water >= 95) return reply("You're not thirsty right now, hon.");
    n.water = Math.min(FULL, n.water + 60);
    n.warned.water = 100;
    api.emote("💧 " + fill(pick(DRINK), { name: api.name(mn) }), mn);
    api.save();
    if (how !== "bowl") reply("💧 Water " + Math.round(n.water) + "%.");
  }
  function milkDrunk(milker, drinker, ml, grade) {
    if (!on(drinker)) return;
    const d = D(), x = d.drunk[drinker] = d.drunk[drinker] || { lvl: 0, t: Date.now() };
    const before = x.lvl;
    x.lvl = Math.min(3, x.lvl + (/^A/.test(grade || "") || ml >= 150 ? 2 : 1));
    x.t = Date.now();
    api.face(drinker, "milkdrunk", x.lvl * 7 * 60);
    if (x.lvl !== before) {
      const line = fill(pick(DRUNK_LINES[x.lvl]), { name: api.name(drinker) });
      if (x.lvl === 3) api.emote("🥛 " + line, drinker);
      else api.privateEmote(drinker, line);
    }
    api.save();
  }
  function onActivity(data) {
    const a = api.activityInfo(data);
    if (a.src !== a.tgt || !on(a.src)) return;
    const noop = () => {
    };
    if (/Bowl_?Eat$/i.test(a.act) && near(a.src, "trough")) eat(a.src, noop, "bowl");
    else if (/Bowl_?Drink$/i.test(a.act) && near(a.src, "water")) drink(a.src, noop, "bowl");
  }
  var bar = (v) => Math.round(v) + "%";
  function cmdNeeds(c) {
    const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
    if (w === "farm") {
      if (!A.isProprietor(sender)) return c.reply("Only proprietors switch barn life on or off for the whole farm, sugar.");
      const v = String(args[1] || "").toLowerCase();
      d.farmOff = v ? v === "off" : !d.farmOff;
      A.save();
      return c.reply("🌾 Barn life for the whole farm: " + (d.farmOff ? "OFF. Nobody gets hungry or reminded." : "ON (for everyone who said ?needs on)."));
    }
    if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar.");
    if (w === "on" || w === "off") {
      if (w === "on") {
        d.optIn[sender] = true;
        needsOf(sender).t = Date.now();
      } else delete d.optIn[sender];
      A.save();
      return c.reply(w === "on" ? "🌾 Barn life ON. You'll get hungry, thirsty and scruffy over time (only while you're here). Eat at a trough, drink at a water spot, and ask staff to groom you. ?needs off any time." : "🌾 Barn life OFF. No more hunger, thirst or reminders.");
    }
    if (!on(sender)) return c.reply("🌾 Barn life is off for you" + (d.farmOff ? " (switched off farm-wide)" : "") + ". ?needs on switches it on.");
    const n = needsOf(sender), x = d.drunk[sender];
    c.reply("🌾 Food " + bar(n.food) + " · 💧 Water " + bar(n.water) + " · 🪮 Grooming " + bar(n.groom) + (x ? " · 🥛 " + DRUNK[x.lvl] : ""));
  }
  function cmdRefill(c) {
    const { sender, args, api: A } = c, d = D();
    const t = String(args[0] || "").toLowerCase() || near(sender, "trough");
    if (!t || !A.spot(t) || !t.startsWith("trough")) return c.reply("Which trough, sugar? ?refill trough-1, standin' next to it.");
    if (!A.onSpot(sender, t, 1)) return c.reply("You need to be standin' at " + t + " to fill it, hon.");
    d.troughs[t] = TROUGH_HELPINGS;
    A.staffPoints(sender, 1, "refill");
    A.save();
    A.emote("🌾 " + A.name(sender) + " hauls a sack over and fills " + t + " to the brim with fresh feed.", sender);
  }
  function cmdGroom(c) {
    const { sender, args, api: A } = c;
    const t = A.find(args[0]);
    if (!t || !A.rec(t)) return c.reply("Who are we groomin', sugar? ?groom <who>, standin' next to them.");
    if (!on(t)) return c.reply(A.name(t) + " doesn't have barn life on, so there's nothin' to track. Brush 'em anyway, they'll like it!");
    const me = A.pos(sender), them = A.pos(t);
    if (!me || !them || Math.max(Math.abs(me.X - them.X), Math.abs(me.Y - them.Y)) > 1) return c.reply("Get right up next to " + A.name(t) + " to groom 'em, hon.");
    const n = needsOf(t);
    n.groom = FULL;
    n.warned.groom = 100;
    A.staffPoints(sender, 1, "groom");
    A.save();
    A.emote("🪮 " + fill(pick(GROOM), { name: A.name(t), by: A.name(sender) }), t);
  }
  function rate(mn) {
    if (!on(mn)) return 1;
    const n = needsOf(mn);
    if (n.food < 25 || n.water < 25) return 0.75;
    if (n.food >= 60 && n.water >= 60 && n.groom >= 50) return 1.1;
    return 1;
  }
  function companion(mn) {
    if (!api.rec(mn)) return null;
    const d = D(), cards = [];
    const tg = { label: "Barn life (food, water, grooming)", desc: "Only while you're here. Reminders come privately, at most every 30 minutes.", on: !!d.optIn[mn], cmd: "needs " + (d.optIn[mn] ? "off" : "on") };
    if (!on(mn)) cards.push({ title: "Barn life", toggles: [tg], note: d.farmOff ? "Switched off farm-wide right now." : void 0 });
    else {
      const n = needsOf(mn), x = d.drunk[mn];
      const kind = (v) => v < 25 ? "alert" : v >= 60 ? "good" : void 0;
      cards.push({
        title: "Barn life",
        toggles: [tg],
        bars: [
          { label: "🌾 Food", value: bar(n.food), pct: n.food, kind: kind(n.food) },
          { label: "💧 Water", value: bar(n.water), pct: n.water, kind: kind(n.water) },
          { label: "🪮 Grooming", value: bar(n.groom), pct: n.groom, kind: kind(n.groom) }
        ],
        chips: x ? [{ text: "🥛 " + DRUNK[x.lvl], kind: "acc" }] : void 0,
        buttons: [{ label: "Eat (at a trough)", cmd: "eat" }, { label: "Drink (at water)", cmd: "drink" }],
        note: rate(mn) > 1 ? "Well kept: you're milkin' a little better." : rate(mn) < 1 ? "Hungry or thirsty: your milk's slowin' down." : void 0
      });
    }
    if (api.isStaff(mn)) {
      const tr = Object.keys(api.spots()).filter((n) => n.startsWith("trough"));
      if (tr.length) cards.push({
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
    guide: "?needs on to get hungry, thirsty and scruffy while you're on the farm (?needs off stops it). Eat at a trough spot with ?eat, drink at a water spot with ?drink (BC+ and MPA bowl activities count there too). Staff: ?groom <who> next to them, ?refill <trough> next to it. Drinking milk makes you content, then sleepy, then milk-drunk. Proprietors: ?needs farm on|off.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      needs: { usage: "needs on|off", private: true, run: cmdNeeds },
      eat: { usage: "eat", run: (c) => eat(c.sender, c.reply) },
      drink: { usage: "drink", run: (c) => drink(c.sender, c.reply) },
      refill: { usage: "refill <trough>", rank: "staff", run: cmdRefill },
      groom: { usage: "groom <who>", rank: "staff", run: cmdGroom }
    },
    on: { tick, activity: onActivity, nurse: milkDrunk },
    rates: { milk: rate },
    companion
  });
})();
