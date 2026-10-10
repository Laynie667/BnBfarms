// ==UserScript==
// @name         BnB Farm add-on: Barn life
// @namespace    bnbfarm
// @version      1.0.5
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
  var ROMP = [
    [
      "%a% drops their shoulders, rump in the air, and bounces at %b%. It's on.",
      "%a% and %b% go tumbling through the straw, a tangle of limbs and tails, each tryin' to pin the other.",
      "%w% ends up on top, pantin' and pleased with themselves, with %l% squirmin' and laughin' underneath."
    ],
    [
      "%a% nips at %b%'s flank and bolts. %b% is after them before the straw settles.",
      "Round the pen they go, %b% gainin', till the pair of them go down in a heap by the fence.",
      "%w% sits right on %l%'s back and won't budge till they cry uncle. Or moo."
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
  var RPS_FORFEIT = [
    "%l% has to moo for %w%, loud enough for the barn to hear.",
    "%w% gets to pin %l% and lick their face clean, ear to ear.",
    "%l% carries %w%'s pride around all day: loser grooms the winner. Get to it.",
    "%w% claims a forfeit: %l% kneels and nuzzles their hand like good stock.",
    "%l% gets their rump swatted, once, by %w%. Fair's fair.",
    "%l% owes %w% a belly rub. A long one."
  ];
  var BEATS = { rock: "scissors", scissors: "paper", paper: "rock" };
  var TURNOUT_CALL = [
    "\u{1F514} Evenin' turn-out! The bell's ringin', y'all. Come on out to the pasture: ten minutes, and there's a ribbon for everybody who shows.",
    "\u{1F514} That's the turn-out bell. Everybody out to the pasture for the evenin'. Ten minutes, and a ribbon if you make it.",
    "\u{1F514} Clang, clang! Turn-out time. Stretch your legs in the pasture, sweet things. Ten minutes."
  ];
  var TURNOUT_SCENE = [
    "\u{1F33E} The herd's out for the evenin': %names% graze shoulder to shoulder as the light goes gold, tails flickin', nobody in any hurry.",
    "\u{1F33E} Turn-out. %names% settle into the pasture together, nosin' the grass and each other, warm flanks touchin' as the sun goes down.",
    "\u{1F33E} %names% amble out under the evenin' sky and bunch up the way a herd does, chewin' slow, one of them already half asleep on another's shoulder."
  ];
  var TURNOUT_ALONE = [
    "\u{1F33E} %names% has the whole pasture to themselves this evenin', and makes the most of it: a long stretch, a roll in the grass, and a ribbon for showin' up."
  ];
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
    const [w, l] = Math.random() < 0.5 ? [a, b] : [b, a], beats = pick(ROMP);
    beats.forEach((t, i) => api.later(() => {
      if (api.onMap(a) && api.onMap(b)) api.emote("\u{1F43E} " + fill(t, { a: N(a), b: N(b), w: N(w), l: N(l) }), a);
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
    api.emote("\u270A " + N(w) + " throws " + pw + ", " + N(l) + " throws " + pl + ". " + N(w) + " wins! " + fill(pick(RPS_FORFEIT), { w: N(w), l: N(l) }), w);
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
    const line = pick(TURNOUT_CALL);
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
    api.emote(fill(pick(there.length === 1 ? TURNOUT_ALONE : TURNOUT_SCENE), { names }).replace("%names%", names), there[0]);
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
      api2.notice(mn, (need === "water" ? "\u{1F4A7} " : need === "food" ? "\u{1F33E} " : "\u{1FAAE} ") + fill(pick(REMIND[need]), { name: api2.name(mn) }));
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
    api2.emote("\u{1F33E} " + fill(pick(EAT), { name: api2.name(mn) }), mn);
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
    api2.emote("\u{1F4A7} " + fill(pick(DRINK), { name: api2.name(mn) }), mn);
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
      const line = fill(pick(DRUNK_LINES[x.lvl]), { name: api2.name(drinker) });
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
  var GROOM_STOCK = [
    "%by% nuzzles in close and grooms %name% from ears to rump, slow and thorough, till their coat lies smooth.",
    "%by% licks and nibbles along %name%'s neck and shoulders, groomin' them the way stock do. %name% leans into it.",
    "%by% works over %name% with tongue and teeth and nose, pickin' out the straw, and doesn't skip the good spots.",
    "%name% holds still and sighs while %by% grooms them, flank to flank, both of them warm and drowsy by the end.",
    "%by% combs through %name%'s hair with their fingers, then nuzzles behind an ear. %name%'s tail gives them away."
  ];
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
    A.emote("\u{1FAAE} " + fill(pick(A.isStaff(sender) ? GROOM : GROOM_STOCK), { name: A.name(t), by: A.name(sender) }), t);
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
