// ==UserScript==
// @name         BnB Farm add-on: Dairy
// @namespace    bnbfarm
// @version      1.0.2
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
    " Moo for it, cow.",
    " That's all you're good for, and you know it.",
    " Dripping like a broken tap. Pathetic little milker."
  ];
  var STALL_MILK = [
    "The stall's cups latch onto %n%'s teats and pull in a slow, rolling rhythm, milk running down the lines into the bucket",
    "%n% shifts their weight in the stall as the machine milks them, warm milk drumming into the bucket",
    "The stall's milker draws on %n% long and steady, and they let out a soft, contented moo",
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
  var say = (s, i) => s.replace(/%n%/g, i.name).replace(/%g%/g, i.gear || "milker").replace(/%c%/g, i.cock || "").replace(/%ml%/g, i.ml || "");
  var fullness = (i) => pick(i.full > 0.7 ? FULL.high : i.full > 0.35 ? FULL.mid : FULL.low);
  var tail = (i) => i.degrade && Math.random() < 0.5 ? pick(DEGRADE) : i.praise && Math.random() < 0.5 ? pick(PRAISE) : "";
  var tier = (level) => level <= 1 ? 0 : level <= 2 ? 1 : 2;
  var lines = {
    pump: (i) => say(pick(PUMP[tier(i.level)]) + fullness(i) + ". +" + i.ml + "." + tail(i), i),
    echo: (i) => say(pick(ECHO[tier(i.level)]) + fullness(i) + ". +" + i.ml + "." + tail(i), i),
    stallMilk: (i) => say(pick(STALL_MILK) + fullness(i) + "." + tail(i), i),
    stallSemen: (i) => say(pick(STALL_SEMEN) + "." + tail(i), i),
    stallDone: (i) => say(pick(DONE), i),
    stallDoneSemen: (i) => say(pick(DONE_SEMEN), i),
    gearDry: (i) => say(pick(DRY), i)
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
