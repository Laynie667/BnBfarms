// ==UserScript==
// @name         BnB Farm add-on: Map tools
// @namespace    bnbfarm
// @version      1.0.3
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-map-tools.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-map-tools.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Opt-in fenced pens (wander out, get tugged back with a naughty mark) and a weekly heat map of time and action by zone. Runs on the farm bot's computer, next to the Farmhand Bot script.
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

  // addons/map-tools/index.js
  var api = null;
  function D() {
    const d = api.data();
    d.pens = d.pens || {};
    d.fence = d.fence || {};
    d.heat = d.heat || { week: "", time: {}, action: {} };
    d.tugged = d.tugged || {};
    return d;
  }
  function middle(zone) {
    const z = api.zones()[zone];
    if (!z || !z.a || !z.b) return null;
    return { X: Math.round((z.a.X + z.b.X) / 2), Y: Math.round((z.a.Y + z.b.Y) / 2) };
  }
  function tick() {
    const d = D(), now = Date.now(), wk = api.weekKey();
    if (d.heat.week !== wk) d.heat = { week: wk, time: {}, action: {} };
    const minutes = api.cfg.HEARTBEAT_MS / 6e4;
    for (const mn of api.here()) {
      for (const z of api.zonesOf(mn)) d.heat.time[z.group] = (d.heat.time[z.group] || 0) + minutes;
      const pen = d.pens[mn];
      if (!pen || !d.fence[mn] || !api.onMap(mn) || api.inZone(mn, pen.zone)) continue;
      if (now - (d.tugged[mn] || 0) < 6e4) continue;
      d.tugged[mn] = now;
      const to = middle(pen.zone);
      if (to) api.teleport(mn, to, false);
      const r = api.rec(mn);
      if (r) r.naughtyMarks = (r.naughtyMarks || 0) + 1;
      api.emote("\u{1F404} " + api.name(mn) + " wandered out of the " + pen.zone + " pen and gets tugged right back in by the collar. Naughty!", mn);
    }
    api.save();
  }
  function onAction(mn) {
    const d = D();
    for (const z of api.zonesOf(mn)) d.heat.action[z.group] = (d.heat.action[z.group] || 0) + 1;
  }
  function heatText() {
    const h = D().heat;
    const zones = [...new Set(Object.keys(h.time).concat(Object.keys(h.action)))];
    if (!zones.length) return "\u{1F5FA}\uFE0F No heat map yet this week. It fills in as people spend time in zones.";
    const rows = zones.map((z) => [z, Math.round(h.time[z] || 0), h.action[z] || 0]).sort((a, b) => b[1] - a[1]);
    const top = Math.max(1, ...rows.map((r) => r[1]));
    return "\u{1F5FA}\uFE0F HEAT MAP (this week)\n" + rows.map(([z, t, a]) => "\u2588".repeat(Math.max(1, Math.round(t / top * 10))) + " " + z + ": " + t + " min \xB7 " + a + " actions").join("\n");
  }
  function cmdPen(c) {
    const { sender, args, api: A } = c, d = D();
    const t = A.find(args[0]), z = String(args[1] || "").toLowerCase();
    if (!t || !A.rec(t)) return c.reply("Here's how: ?pen <who> <zone> puts them in a pen \xB7 ?pen <who> off lets them out.");
    if (z === "off" || z === "out") {
      delete d.pens[t];
      A.save();
      A.notice(t, "\u{1F404} You're let out of your pen.");
      return c.reply("\u{1F404} " + A.name(t) + " is out of their pen.");
    }
    if (!A.zones()[z]) return c.reply("There's no zone called '" + z + "', sugar. ?zones lists them.");
    d.pens[t] = { zone: z, by: sender, at: Date.now() };
    A.save();
    A.notice(t, "\u{1F404} " + A.name(sender) + " put you in the " + z + " pen." + (d.fence[t] ? " Wander out and you'll be tugged back." : " (You haven't said ?fence on, so nothin' stops you leavin'.)"));
    c.reply("\u{1F404} " + A.name(t) + " is penned in " + z + (d.fence[t] ? ", fenced." : ". They haven't said ?fence on, so it isn't enforced."));
  }
  function companion(mn) {
    if (!api.rec(mn)) return null;
    const d = D(), cards = [], pen = d.pens[mn];
    cards.push({
      title: "Pens",
      text: pen ? "You're penned in " + pen.zone + "." : void 0,
      toggles: [{ label: "Fence me in", desc: "If staff pen you, wandering out tugs you back (and earns a naughty mark).", on: !!d.fence[mn], cmd: "fence " + (d.fence[mn] ? "off" : "on") }]
    });
    if (api.isStaff(mn)) cards.push({ staff: true, title: "Heat map", text: heatText(), input: { placeholder: "Bessie barn", label: "Pen (who, zone)", cmd: "pen" } });
    return { cards };
  }
  connect({
    name: "map-tools",
    label: "Map tools",
    version: "1.0.0",
    guide: "Pens: staff ?pen <who> <zone> (or off). With ?fence on, wandering out tugs you back with a naughty mark. Staff: ?busy shows where people spend time and where things happen this week.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      pen: { usage: "pen <who> <zone>", rank: "staff", private: true, run: cmdPen },
      fence: { usage: "fence on|off", private: true, run: (c) => {
        const d = D(), w = String(c.args[0] || "").toLowerCase();
        if (w !== "on" && w !== "off") return c.reply("\u{1F404} Fence: " + (d.fence[c.sender] ? "ON" : "off") + ". ?fence on lets a pen hold you; ?fence off and pens are just a suggestion.");
        if (w === "on") d.fence[c.sender] = true;
        else delete d.fence[c.sender];
        c.api.save();
        c.reply(w === "on" ? "\u{1F404} Fence ON. If staff pen you, you'll be tugged back when you wander." : "\u{1F404} Fence off. Pens won't hold you.");
      } },
      busy: { usage: "busy", aliases: ["heatmap"], rank: "staff", private: true, run: (c) => c.reply(heatText()) }
    },
    on: { tick, activity: (data) => {
      const a = api.activityInfo(data);
      if (a.src) onAction(a.src);
    }, roleplay: (mn, text, type) => {
      if (type === "Emote") onAction(mn);
    } },
    companion
  });
})();
