// ==UserScript==
// @name         BnB Farm add-on: Shows
// @namespace    bnbfarm
// @version      1.0.2
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
          api.emote("\u{1F3C1} " + api.name(mn) + " thunders across the finish line in " + ((e.done - sh.start) / 1e3).toFixed(1) + " seconds!", mn);
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
    api.emote(ok ? "\u{1F380} " + api.name(mn) + " does it perfectly on cue. The judge marks the card." : "\u{1F380} " + api.name(mn) + " misses the cue. The judge shakes their head and marks it down.", mn);
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
    });
    api.announce("\u{1F380} " + EVENTS[sh.event].toUpperCase() + " RESULTS: " + ranked.map(([mn, v], i) => PLACES[i] + " " + api.name(mn) + " (" + shown(sh, mn, v) + ")").join(" \xB7 "));
    api.emote("\u{1F380} The judge pins a " + RIBBON[0] + " ribbon on " + api.name(ranked[0][0]) + ". Best in show!", ranked[0][0]);
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
      A.emote("\u{1F380} " + A.name(sender) + " steps into the ring for the " + EVENTS[sh.event] + ".", sender);
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
    api.later(() => api.char(mn) && api.emote("\u{1F380} " + api.name(mn) + " wears their " + ribbonText(x) + " proudly.", mn), 12e3);
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
    guide: "Staff: ?show open udder | breeding | race | obedience, ?show score <who> <1-10>, ?show cue <who> <cue>, ?show go (race), ?show close. Stock: ?show enter. Ribbons stay on your record (?ribbons); your latest one gets shown off. Placards: ?sign by a placard spot; staff ?sign set <name> <text>.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      show: { usage: "show open|enter|score|cue|go|close", private: true, run: cmdShow },
      ribbons: { usage: "ribbons", private: true, run: (c) => {
        const t = c.args[0] ? c.api.find(c.args[0]) : c.sender, r = t && D().ribbons[t] || [];
        c.reply(r.length ? "\u{1F380} RIBBONS \u2014 " + c.api.name(t) + "\n" + r.map((x) => PLACES[x.place] + " \xB7 " + EVENTS[x.event] + " \xB7 " + new Date(x.at).toLocaleDateString()).join("\n") : t ? c.api.name(t) + " has no ribbons yet." : "Who's that, hon?");
      } },
      sign: { usage: "sign [set <name> <text>]", aliases: ["placard"], private: true, run: cmdPlacard }
    },
    on: { join: onJoin, roleplay: onRoleplay },
    companion
  });
})();
