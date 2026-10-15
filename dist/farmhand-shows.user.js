// ==UserScript==
// @name         BnB Farm add-on: Shows
// @namespace    bnbfarm
// @version      1.1.0
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-shows.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-shows.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Udder judging, breeding stand, pony cart race (checkpoint zones) and obedience trial (cues), ribbons on records, and placard spots / display cases. Runs on the farm bot's computer, next to the Farmhand Bot script.
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
  var TAG_ANY = /\{(?:nv|nc|nt|fu|fb|ok|v|c|t|f|m)\}/g;
  var TAG_LEAD = /^((?:\{(?:nv|nc|nt|fu|fb|v|c|t|f|m)\})+)/;
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
        if (t === "v" && !b.vulva || t === "nv" && b.vulva || t === "c" && !b.cock || t === "nc" && b.cock || t === "t" && !b.tits || t === "nt" && b.tits || t === "f" && b.g !== "female" || t === "m" && b.g !== "male" || t === "fu" && b.g !== "futa" || t === "fb" && b.g !== "femboy") return false;
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
  function lineFor(api2, mn, list, key) {
    if (!Array.isArray(list) || !list.length) return "";
    const b = bodyOf(api2, mn);
    let t;
    try {
      t = key && api2 && api2.pickFor && api2.tags >= 2 ? untag(api2.pickFor(mn, key, list)) : pickFit(list, b);
    } catch (e) {
      t = pickFit(list, b);
    }
    return api2 && api2.fit && api2.tags >= 2 ? api2.fit(mn, t) : t;
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
    sheep: { f: "ewe", m: "ram", young: ["lamb", "lambs"], call: "baa", sound: ["a soft baa", "a trembling baa"] },
    default: { f: "animal", m: "animal", young: ["little one", "little ones"], call: "moan", sound: ["a soft moan", "a needy whimper", "a shaky gasp"] }
  };
  function animalOf(api2, mn) {
    let k = "default";
    try {
      k = api2 && api2.species && api2.species(mn) || "default";
    } catch (e) {
    }
    const w = ANIMALS[k] || ANIMALS.default, b = bodyOf(api2, mn), male = !!(b && (b.g === "male" || b.g === "femboy"));
    return { key: ANIMALS[k] ? k : "default", a: male ? w.m : w.f, young: w.young, call: w.call, sound: pick(w.sound), sounds: w.sound, male };
  }

  // addons/shows/more-lines.js
  var GAIT = {
    cow: ["lumbers", "trundles", "barrels"],
    bull: ["charges", "thunders", "barrels"],
    pony: ["gallops", "thunders", "prances"],
    horse: ["gallops", "thunders", "canters"],
    deer: ["bounds", "springs", "darts"],
    pig: ["trots", "scurries", "hurtles"],
    pup: ["scrambles", "bounds", "tears"],
    dog: ["bounds", "tears", "races"],
    kitt: ["streaks", "darts", "pounces"],
    cat: ["streaks", "darts", "slinks"],
    goblin: ["scuttles", "scrambles", "cackles"],
    bunny: ["hops", "bounds", "zigzags"],
    rabbit: ["hops", "bounds", "zigzags"],
    fox: ["darts", "streaks", "bounds"],
    wolf: ["lopes", "races", "tears"],
    goat: ["clatters", "bounds", "skitters"],
    sheep: ["trots", "bundles", "bounces"],
    default: ["runs", "dashes", "races"]
  };
  var ENTER = {
    udder: [
      "{t}\u{1F380} %name% steps into the ring for udder judgin', heavy and swingin', and gives the judges a good long look.",
      "{t}\u{1F380} %name% walks into the ring slow and proud, udder full and tight for the judges.",
      "{nt}\u{1F380} %name% steps into the ring for udder judgin', chest out and nipples stiff, ready to show what they give.",
      "\u{1F380} %name% is led into the ring for udder judgin' and stands square, waitin' to be felt over."
    ],
    breeding: [
      "\u{1F380} %name% steps into the ring for the breedin' stand, and the stud book comes out.",
      "\u{1F380} %name% struts into the breedin' ring like they've got a season's worth to show for it.",
      "{v}\u{1F380} %name% takes the breedin' stand, tail up and proud.",
      "{c}\u{1F380} %name% takes the breedin' stand, every inch a stud and showin' it."
    ],
    race: [
      "\u{1F380} %name% paws the ground at the start line, ready to go.",
      "\u{1F380} %name% lines up for the cart race, stampin' and snortin' and rarin' to go.",
      "\u{1F380} %name% shakes out their legs at the start and eyes the course."
    ],
    obedience: [
      "\u{1F380} %name% trots into the ring for the obedience trial and sits pretty for the judges.",
      "\u{1F380} %name% steps into the obedience ring, ears pricked, watchin' the judge's hands.",
      "\u{1F380} %name% comes into the ring and waits for their first cue, all eyes and good manners."
    ]
  };
  var CUE_OK = [
    "\u{1F380} %name% does it perfectly on cue. The judge marks the card.",
    "\u{1F380} %name% nails the cue, quick and neat, and the crowd claps.",
    "\u{1F380} Right on cue! %name% gets a nod from the judge and a pat on the head.",
    "\u{1F380} %name% does just what was asked, first time. Good %a%.",
    "\u{1F380} Perfect. %name% gives a pleased little %call% and the judge marks it down."
  ];
  var CUE_MISS = [
    "\u{1F380} %name% misses the cue. The judge shakes their head and marks it down.",
    "\u{1F380} %name% gets distracted by somethin' in the straw and misses it entirely.",
    "\u{1F380} Not quite. %name% gets halfway there and loses their nerve. The judge marks it down.",
    "\u{1F380} %name% looks at the judge, looks at the crowd, and does the wrong thing with great confidence."
  ];
  var FINISH = [
    "\u{1F3C1} %name% %gait% across the finish line in %time% seconds!",
    "\u{1F3C1} Over the line! %name% %gait% home in %time% seconds, flanks heavin'.",
    "\u{1F3C1} %name% %gait% through the last checkpoint and over the line: %time% seconds.",
    "\u{1F3C1} Here comes %name%, flat out for the line, %time% seconds on the clock!"
  ];
  var BEST = [
    "\u{1F380} The judge pins a blue ribbon on %name%. Best in show!",
    "\u{1F380} Blue ribbon for %name%, and a round of applause from the rail. Best in show!",
    "\u{1F380} The judge steps back, looks %name% over once more, and pins the blue on them. Best in show!"
  ];
  var BEST_COLLAR = [
    "\u{1F380} The judge pins a blue ribbon to %name%'s collar. Best in show!",
    "\u{1F380} A blue ribbon goes on %name%'s collar, and the judge gives it a proud little tug. Best in show!"
  ];
  var BEST_HARNESS = [
    "\u{1F380} The judge buckles a blue rosette to %name%'s harness. Best in show!"
  ];
  var WEAR = [
    "\u{1F380} %name% wears their %ribbon% proudly.",
    "\u{1F380} %name% shows off their %ribbon% to anybody who'll look.",
    "\u{1F380} %name%'s %ribbon% catches the light as they come in."
  ];
  var WEAR_COLLAR = [
    "\u{1F380} %name% has their %ribbon% pinned to their collar, and it bobs when they walk.",
    "\u{1F380} There's a %ribbon% on %name%'s collar today, and they keep checkin' it's still there."
  ];

  // addons/shows/index.js
  var EVENTS = { udder: "Udder Judging", breeding: "Breeding Stand", race: "Pony Cart Race", obedience: "Obedience Trial" };
  var PLACES = ["\u{1F947} 1st", "\u{1F948} 2nd", "\u{1F949} 3rd"];
  var RIBBON = ["blue", "red", "yellow"];
  var api = null;
  var raceTimer = null;
  function D() {
    const d = api.data();
    d.show = d.show || null;
    d.ribbons = d.ribbons || {};
    d.placards = d.placards || {};
    d.ribbonSaid = d.ribbonSaid || {};
    return d;
  }
  function about(mn, pool, key, extra) {
    const an = animalOf(api, mn), gait = GAIT[an.key] || GAIT.default;
    return fill(lineFor(api, mn, pool, key), Object.assign({ name: api.name(mn), a: an.a, call: an.call, gait: pick(gait) }, extra || {}));
  }
  var avg = (o) => {
    const v = Object.values(o || {});
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
  };
  var latestRibbon = (mn) => {
    const r = D().ribbons[mn];
    return r && r.length ? r[r.length - 1] : null;
  };
  var ribbonText = (x) => x ? RIBBON[x.place] + " ribbon, " + PLACES[x.place].slice(3) + " in the " + EVENTS[x.event] : "";
  function scores(sh) {
    const ids = Object.keys(sh.entrants).map(Number);
    if (sh.event === "udder") {
      const milk = Object.fromEntries(ids.map((m) => [m, api.yieldWeek(m)])), top = Math.max(1, ...Object.values(milk));
      return ids.map((m) => [m, 5 * milk[m] / top + avg(sh.entrants[m].scores) / 2]);
    }
    if (sh.event === "breeding") {
      const since = /* @__PURE__ */ new Date();
      since.setDate(1);
      since.setHours(0, 0, 0, 0);
      const book = api.studbook().filter((e) => e.t >= since.getTime());
      return ids.map((m) => {
        const p = api.prod(m);
        return [m, book.filter((e) => e.dam === m || e.sires.includes(m)).length + (p && p.preg ? 1 : 0) + avg(sh.entrants[m].scores) / 100];
      });
    }
    if (sh.event === "race") return ids.filter((m) => sh.entrants[m].done).map((m) => [m, 1e6 - (sh.entrants[m].done - sh.start) / 1e3]);
    if (sh.event === "obedience") return ids.map((m) => {
      const e = sh.entrants[m];
      return [m, e.cues ? e.passed / e.cues * 10 : 0];
    });
    return [];
  }
  var shown = (sh, m, v) => sh.event === "race" ? ((sh.entrants[m].done - sh.start) / 1e3).toFixed(1) + " s" : sh.event === "breeding" ? Math.floor(v) + " this month" : v.toFixed(1) + "/10";
  function checkpoints() {
    const zs = api.zones(), sp = api.spots(), out = [];
    for (let i = 1; i <= 20; i++) {
      const n = "race-" + i;
      if (zs[n] || sp[n]) out.push(n);
      else break;
    }
    return out;
  }
  var atCheckpoint = (mn, n) => api.inZone(mn, n) || api.onSpot(mn, n, 1);
  function raceTick() {
    const d = D(), sh = d.show;
    if (!sh || sh.event !== "race" || !sh.start || sh.closed) {
      raceTimer = null;
      return;
    }
    const cps = checkpoints();
    for (const [k, e] of Object.entries(sh.entrants)) {
      const mn = Number(k);
      if (e.done || !api.char(mn)) continue;
      if (atCheckpoint(mn, cps[e.cp])) {
        e.cp++;
        if (e.cp >= cps.length) {
          e.done = Date.now();
          api.emote(about(mn, FINISH, "finish", { time: ((e.done - sh.start) / 1e3).toFixed(1) }), mn);
        } else api.privateEmote(mn, "Checkpoint " + e.cp + " of " + cps.length + "! On to " + cps[e.cp] + ".");
      }
    }
    const all = Object.values(sh.entrants);
    if (Date.now() - sh.start > 10 * 6e4 || all.length && all.every((e) => e.done)) {
      closeShow(sh.by);
      raceTimer = null;
      return;
    }
    raceTimer = api.later(raceTick, 1e3);
  }
  var cues = /* @__PURE__ */ new Map();
  function giveCue(judge, mn, cue) {
    const pos = api.pos(mn);
    cues.set(mn, { cue, judge, until: Date.now() + 3e4, from: pos ? { X: pos.X, Y: pos.Y } : null, heard: false });
    api.privateEmote(mn, api.name(judge) + ' gives you a cue: "' + cue + '". You have 30 seconds.');
    api.later(() => judgeCue(mn), 30500);
  }
  function judgeCue(mn) {
    const c = cues.get(mn), sh = D().show;
    if (!c) return;
    cues.delete(mn);
    if (!sh || sh.event !== "obedience" || !sh.entrants[mn]) return;
    let ok = c.heard;
    if (c.cue === "heel") {
      const a = api.pos(mn), b = api.pos(c.judge);
      ok = !!(a && b && Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 1);
    }
    if (c.cue === "stay") {
      const a = api.pos(mn);
      ok = !!(a && c.from && a.X === c.from.X && a.Y === c.from.Y);
    }
    const e = sh.entrants[mn];
    e.cues++;
    if (ok) e.passed++;
    api.save();
    api.emote(about(mn, ok ? CUE_OK : CUE_MISS, ok ? "cueok" : "cuemiss"), mn);
  }
  function onRoleplay(mn, text) {
    const c = cues.get(mn);
    if (!c || c.heard) return;
    if (c.cue === "speak" || c.cue !== "heel" && c.cue !== "stay" && new RegExp("\\b" + c.cue.replace(/[^a-z]/gi, "") + "\\w*", "i").test(text)) c.heard = true;
  }
  function closeShow(by) {
    const d = D(), sh = d.show;
    if (!sh) return "No show is on.";
    sh.closed = true;
    const ranked = scores(sh).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
    d.show = null;
    if (!ranked.length) {
      api.announce("\u{1F380} The " + EVENTS[sh.event] + " is over, y'all. Nobody placed this time.");
      api.save();
      return "Closed. Nobody placed.";
    }
    ranked.forEach(([mn], place) => {
      (d.ribbons[mn] = d.ribbons[mn] || []).push({ event: sh.event, place, at: Date.now() });
      delete d.ribbonSaid[mn];
      if (api.ribbons) api.ribbons(Number(mn), [5, 3, 2][place] || 1, "placin' in the show");
    });
    api.announce("\u{1F380} " + EVENTS[sh.event].toUpperCase() + " RESULTS: " + ranked.map(([mn, v], i) => PLACES[i] + " " + api.name(mn) + " (" + shown(sh, mn, v) + ")").join(" \xB7 "));
    {
      const w = Number(ranked[0][0]), g = gearOf(api, w);
      api.emote(about(w, g.collar ? BEST_COLLAR : g.harness ? BEST_HARNESS : BEST, "best"), w);
    }
    api.save();
    return "Closed and ribbons handed out.";
  }
  function cmdShow(c) {
    const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase(), staff = A.isStaff(sender), sh = d.show;
    if (w === "open") {
      if (!staff) return c.reply("Staff open the shows, sugar.");
      const ev = String(args[1] || "").toLowerCase();
      if (!EVENTS[ev]) return c.reply("Which show? ?show open udder | breeding | race | obedience");
      if (sh) return c.reply("The " + EVENTS[sh.event] + " is already on. ?show close first.");
      if (ev === "race" && !checkpoints().length) return c.reply("Set up the course first: zones or spots called race-1, race-2, race-3\u2026 in order.");
      d.show = { event: ev, by: sender, entrants: {}, start: 0, at: Date.now() };
      A.save();
      A.announce("\u{1F380} The " + EVENTS[ev] + " is open, y'all! Stock, say ?show enter." + (ev === "race" ? " Staff start the clock with ?show go." : ev === "obedience" ? " Judges: ?show cue <who> sit|stay|heel|speak|beg." : " Judges: ?show score <who> <1-10>."));
      return;
    }
    if (w === "enter") {
      if (!sh) return c.reply("There's no show on right now, hon.");
      if (!A.hasRole(sender, A.ROLE.LIVESTOCK)) return c.reply("The show ring's for stock, sugar.");
      if (sh.event === "udder" && !A.makesMilk(sender)) return c.reply("Udder judging is for milkers, hon.");
      if (sh.event === "race" && sh.start) return c.reply("The race has already started, sugar. Next time!");
      sh.entrants[sender] = sh.entrants[sender] || { scores: {}, cues: 0, passed: 0, cp: 0, done: 0 };
      A.save();
      A.emote(about(sender, ENTER[sh.event] || ["\u{1F380} %name% steps into the ring for the " + EVENTS[sh.event] + "."], "enter:" + sh.event), sender);
      return;
    }
    if (w === "go") {
      if (!staff || !sh || sh.event !== "race") return c.reply(sh && sh.event === "race" ? "Staff start the race, sugar." : "There's no race open.");
      if (!Object.keys(sh.entrants).length) return c.reply("Nobody's entered yet.");
      sh.start = Date.now();
      A.save();
      A.announce("\u{1F3C1} Ready\u2026 set\u2026 GO! Through " + checkpoints().join(", ") + " in order!");
      if (!raceTimer) raceTimer = A.later(raceTick, 1e3);
      return;
    }
    if (w === "score") {
      if (!staff || !sh) return c.reply(sh ? "Judges are staff, sugar." : "There's no show on.");
      const t = A.find(args[1]), n = parseFloat(args[2]);
      if (!t || !sh.entrants[t] || !(n >= 1 && n <= 10)) return c.reply("?show score <who> <1-10>, for somebody who's entered.");
      if (t === sender) return c.reply("You can't judge yourself, sugar!");
      sh.entrants[t].scores[sender] = n;
      A.save();
      return c.reply("Scored " + A.name(t) + " " + n + "/10.");
    }
    if (w === "cue") {
      if (!staff || !sh || sh.event !== "obedience") return c.reply("Cues are for judges at an obedience trial, sugar.");
      const t = A.find(args[1]), cue = String(args[2] || "").toLowerCase().replace(/[^a-z]/g, "");
      if (!t || !sh.entrants[t] || !cue) return c.reply("?show cue <who> sit | down | beg | heel | stay | speak");
      if (cues.has(t)) return c.reply(A.name(t) + " is still working on the last cue.");
      giveCue(sender, t, cue);
      return c.reply("Cue given. 30 seconds.");
    }
    if (w === "close") {
      if (!staff) return c.reply("Staff close the shows, sugar.");
      return c.reply(closeShow(sender));
    }
    if (!sh) return c.reply("\u{1F380} No show on right now. Staff: ?show open udder | breeding | race | obedience.");
    const now = scores(sh).sort((a, b) => b[1] - a[1]);
    c.reply("\u{1F380} " + EVENTS[sh.event] + (sh.start ? " (under way)" : "") + "\nEntered: " + (Object.keys(sh.entrants).map((m) => A.name(Number(m))).join(", ") || "nobody yet") + (now.length ? "\nStanding: " + now.slice(0, 3).map(([m, v], i) => i + 1 + ". " + A.name(m) + " " + shown(sh, m, v)).join(", ") : ""));
  }
  function onJoin(mn) {
    const x = latestRibbon(mn), d = D();
    if (!x) return;
    const today = api.dayKey();
    if (d.ribbonSaid[mn] === today) return;
    d.ribbonSaid[mn] = today;
    api.save();
    api.later(() => api.char(mn) && api.emote(about(mn, gearOf(api, mn).collar ? WEAR.concat(WEAR_COLLAR) : WEAR, "wear", { ribbon: ribbonText(x) }), mn), 12e3);
  }
  function placardText(name) {
    const t = D().placards[name] || "(nothing written yet)";
    const who = api.whoOnSpot("display-" + name, 0)[0];
    if (!who) return "\u{1FAA7} " + name + ": " + t;
    const r = api.rec(who) || {}, rib = latestRibbon(who);
    return "\u{1FAA7} " + name + ": " + t + "\nOn display: " + api.name(who) + (r.species ? ", " + r.species : "") + (rib ? " \xB7 " + ribbonText(rib) : "");
  }
  function cmdPlacard(c) {
    const { sender, args, rest, api: A } = c, d = D();
    if (String(args[0] || "").toLowerCase() === "set") {
      if (!A.isStaff(sender)) return c.reply("Staff write the placards, sugar.");
      const name = String(args[1] || "").toLowerCase().replace(/^placard-/, ""), text = rest.split(/\s+/).slice(2).join(" ").trim();
      if (!name || !text) return c.reply("?sign set <name> <text>, for a spot called placard-<name>.");
      d.placards[name] = text.slice(0, 400);
      A.save();
      return c.reply("\u{1FAA7} Placard " + name + " written." + (A.spot("placard-" + name) ? "" : " (Set a spot called placard-" + name + " so people can read it there.)"));
    }
    const near = Object.keys(A.spots()).filter((n) => n.startsWith("placard-") && A.onSpot(sender, n, 2));
    if (!near.length) return c.reply("Stand by a placard to read it, sugar.");
    c.reply(near.map((n) => placardText(n.slice(8))).join("\n\n"));
  }
  function companion(mn) {
    if (!api.rec(mn)) return null;
    const d = D(), sh = d.show, rib = d.ribbons[mn] || [], cards = [];
    if (sh || rib.length) cards.push({
      title: "Shows",
      text: sh ? "The " + EVENTS[sh.event] + " is on" + (sh.entrants[mn] ? ", and you're entered." : ".") : void 0,
      lines: rib.slice(-5).reverse().map((x) => [PLACES[x.place], EVENTS[x.event] + " \xB7 " + new Date(x.at).toLocaleDateString()]),
      buttons: sh && !sh.entrants[mn] ? [{ label: "Enter the show", cmd: "show enter", accent: true }] : [{ label: "Show status", cmd: "show" }]
    });
    if (api.isStaff(mn)) cards.push({
      staff: true,
      title: "Run a show",
      buttons: sh ? [{ label: "Close and award", cmd: "show close", accent: true }].concat(sh.event === "race" && !sh.start ? [{ label: "Start the race", cmd: "show go" }] : []) : Object.keys(EVENTS).map((e) => ({ label: EVENTS[e], cmd: "show open " + e })),
      input: sh ? sh.event === "obedience" ? { placeholder: "Bessie sit", label: "Cue", cmd: "show cue" } : sh.event === "race" ? void 0 : { placeholder: "Bessie 8", label: "Score", cmd: "show score" } : void 0
    });
    return cards.length ? { cards } : null;
  }
  connect({
    name: "shows",
    label: "Shows",
    version: "1.0.0",
    guide: "Staff: ?show open udder | breeding | race | obedience, ?show score <who> <1-10>, ?show cue <who> <cue>, ?show go (race), ?show close. Stock: ?show enter. Ribbons stay on your record (?prizes); your latest one gets shown off. Placards: ?sign by a placard spot; staff ?sign set <name> <text>.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      show: { usage: "show open|enter|score|cue|go|close", private: true, run: cmdShow },
      // (?ribbons is the farm's scrip now: show placings are ?prizes)
      prizes: { usage: "prizes", aliases: ["rosettes"], private: true, run: (c) => {
        const t = c.args[0] ? c.api.find(c.args[0]) : c.sender, r = t && D().ribbons[t] || [];
        c.reply(r.length ? "\u{1F380} RIBBONS \u2014 " + c.api.name(t) + "\n" + r.map((x) => PLACES[x.place] + " \xB7 " + EVENTS[x.event] + " \xB7 " + new Date(x.at).toLocaleDateString()).join("\n") : t ? c.api.name(t) + " has no ribbons yet." : "Who's that, hon?");
      } },
      sign: { usage: "sign [set <name> <text>]", aliases: ["placard"], private: true, run: cmdPlacard }
    },
    on: { join: onJoin, roleplay: onRoleplay },
    companion
  });
})();
