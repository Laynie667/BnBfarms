// ==UserScript==
// @name         BnB Farm add-on: Work
// @namespace    bnbfarm
// @version      1.0.3
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-work.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-work.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Staff leaderboard, private write-ups (writer and recipient only; others see a count) and opt-in inspections with an automatic checklist. Runs on the farm bot's computer, next to the Farmhand Bot script.
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

  // addons/work/index.js
  var api = null;
  function D() {
    const d = api.data();
    d.writeups = d.writeups || [];
    d.optIn = d.optIn || {};
    d.insp = d.insp || null;
    d.last = d.last || null;
    return d;
  }
  function leaderboard() {
    const S = api.staffScores(), wk = api.weekKey();
    const rows = Object.entries(S).filter(([, x]) => x.week === wk && x.pts > 0).sort((a, b) => b[1].pts - a[1].pts).slice(0, 10);
    if (!rows.length) return "\u{1F3C6} STAFF THIS WEEK\nNobody's earned points yet. Chores at their place, refills, grooming, midwifing and inspections all count.";
    return "\u{1F3C6} STAFF THIS WEEK\n" + rows.map(([mn, x], i) => i + 1 + ". " + api.name(Number(mn)) + ": " + x.pts + " pts \xB7 " + api.hoursThisWeek(Number(mn)).toFixed(1) + " h" + (Object.keys(x.why || {}).length ? " (" + Object.entries(x.why).map(([k, v]) => k + " " + v).join(", ") + ")" : "")).join("\n");
  }
  var canSee = (w, mn) => w.by === mn || w.to === mn;
  function cmdWriteup(c) {
    const { sender, args, rest, api: A } = c, d = D();
    if (String(args[0] || "").toLowerCase() === "remove") {
      const i = d.writeups.findIndex((w) => String(w.id) === String(args[1] || "").replace(/^#/, ""));
      if (i < 0) return c.reply("Which one, sugar? ?wu shows the numbers you can see.");
      if (d.writeups[i].by !== sender && !A.isProprietor(sender)) return c.reply("Only whoever wrote it, or a proprietor, can take a write-up off, hon.");
      d.writeups.splice(i, 1);
      A.save();
      return c.reply("\u{1F4DD} Write-up taken off.");
    }
    const t = A.find(args[0]), text = rest.split(/\s+/).slice(1).join(" ").trim();
    if (!t || !A.rec(t) || !text) return c.reply("Here's how: ?wu <who> <what happened>. Only you and they can read it; everybody else sees a count.");
    if (t === sender) return c.reply("You can't write yourself up, sugar.");
    d.seq = (d.seq || 0) + 1;
    d.writeups.push({ id: d.seq, to: t, by: sender, text: text.slice(0, 500), at: Date.now() });
    A.save();
    A.audit(sender, "WRITEUP", String(t));
    A.notice(t, "\u{1F4DD} " + A.name(sender) + " wrote you up: " + text.slice(0, 500) + "\n(Only you and they can read this. ?wu shows yours.)");
    c.reply("\u{1F4DD} Written up (#" + d.seq + "). Only you and " + A.name(t) + " can read it.");
  }
  function writeupsText(viewer, who) {
    const d = D(), list = who ? d.writeups.filter((w) => w.to === who) : d.writeups.filter((w) => canSee(w, viewer));
    const mine = list.filter((w) => canSee(w, viewer)), hidden = list.length - mine.length;
    let o = "\u{1F4DD} WRITE-UPS" + (who ? " \u2014 " + api.name(who) : "") + "\n";
    o += mine.length ? mine.map((w) => "#" + w.id + " " + api.name(w.by) + " \u2192 " + api.name(w.to) + ", " + new Date(w.at).toLocaleDateString() + ": " + w.text).join("\n") : "None you can read.";
    if (hidden) o += "\n\u2026and " + hidden + " more written by other people (only they and " + api.name(who) + " can read those).";
    if (!who) {
      const counts = {};
      for (const w of d.writeups) counts[w.to] = (counts[w.to] || 0) + 1;
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
      if (top.length) o += "\n\nCounts: " + top.map(([mn, n]) => api.name(Number(mn)) + " " + n).join(", ");
    }
    return o;
  }
  function autoChecks() {
    const items = [], here = api.here();
    const barn = api.peek("barn-life");
    const stock = here.filter((mn) => api.hasRole(mn, api.ROLE.LIVESTOCK));
    const hungry = stock.filter((mn) => barn.optIn && barn.optIn[mn] && barn.needs && barn.needs[mn] && (barn.needs[mn].food < 25 || barn.needs[mn].water < 25));
    if (barn.optIn) items.push({ what: "Stock fed and watered", ok: !hungry.length, note: hungry.map(api.name).join(", ") });
    const full = stock.filter((mn) => {
      const p = api.prod(mn);
      return p && api.makesMilk(mn) && p.milk / Math.max(1, api.milkCap(mn)) > 0.9;
    });
    items.push({ what: "Nobody left overfull with milk", ok: !full.length, note: full.map(api.name).join(", ") });
    const troughs = Object.keys(api.spots()).filter((n) => n.startsWith("trough"));
    if (troughs.length) {
      const empty = troughs.filter((t) => barn.troughs && barn.troughs[t] === 0);
      items.push({ what: "Troughs stocked", ok: !empty.length, note: empty.join(", ") });
    }
    const behind = here.filter((mn) => api.isStaff(mn) && api.clockedIn(mn) && api.rec(mn).chore);
    items.push({ what: "Chores done", ok: !behind.length, note: behind.map(api.name).join(", ") });
    const duty = here.filter((mn) => api.isStaff(mn) && api.onDuty(mn));
    items.push({ what: "Staff on duty", ok: duty.length > 0, note: duty.length + " on duty" });
    return items;
  }
  function inspText() {
    const x = D().insp;
    if (!x) return "No inspection under way.";
    if (!x.items) return "\u{1F50D} Inspection by " + api.name(x.by) + " starts in " + Math.max(0, Math.ceil((x.startAt - Date.now()) / 6e4)) + " min.";
    return "\u{1F50D} INSPECTION by " + api.name(x.by) + "\n" + x.items.map((it, i) => i + 1 + ". " + (it.ok ? "\u2705 " : "\u274C ") + it.what + (it.note ? " (" + it.note + ")" : "")).join("\n") + "\n?insp pass|fail <what> adds one \xB7 ?insp end finishes";
  }
  function cmdInspection(c) {
    const { sender, args, rest, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
    const boss = A.isHerdmaster(sender) || A.isProprietor(sender);
    if (w === "start") {
      if (!boss) return c.reply("Inspections are started by herdmasters and proprietors, sugar.");
      if (d.insp) return c.reply("There's one under way already.\n" + inspText());
      const n = parseInt(args[1], 10), mins = Math.max(0, Math.min(60, isNaN(n) ? 10 : n));
      d.insp = { by: sender, startAt: Date.now() + mins * 6e4, items: null, staff: [] };
      A.save();
      for (const mn of A.here()) if (d.optIn[mn] && A.isStaff(mn) && A.onDuty(mn) && mn !== sender) A.notice(mn, "\u{1F50D} Heads up: " + A.name(sender) + " is inspectin' the farm in " + mins + " minutes.");
      if (!mins) begin();
      return c.reply("\u{1F50D} Inspection " + (mins ? "in " + mins + " minutes" : "starts now") + ". Staff who switched inspections on have been warned.");
    }
    if (w === "pass" || w === "fail") {
      if (!d.insp || !d.insp.items) return c.reply("There's no inspection under way, hon.");
      if (d.insp.by !== sender && !A.isProprietor(sender)) return c.reply("Only the inspector marks the checklist, sugar.");
      const what = rest.split(/\s+/).slice(1).join(" ").trim();
      if (!what) return c.reply("What did you check, sugar? ?insp fail pen 2 gate left open");
      d.insp.items.push({ what: what.slice(0, 120), ok: w === "pass", note: "" });
      A.save();
      return c.reply(inspText());
    }
    if (w === "end") {
      if (!d.insp) return c.reply("There's no inspection under way, hon.");
      if (d.insp.by !== sender && !A.isProprietor(sender)) return c.reply("Only the inspector finishes it, sugar.");
      if (!d.insp.items) begin();
      const x = d.insp, total = x.items.length, ok = x.items.filter((i) => i.ok).length, score = total ? Math.round(ok / total * 10) : 10;
      const report = inspText().split("\n?insp")[0] + "\n\nScore: " + score + "/10";
      for (const mn of x.staff) {
        if (score >= 5) A.staffPoints(mn, Math.round(score / 2), "inspection");
        A.notice(mn, "\u{1F50D} Inspection's done: " + score + "/10." + (score >= 5 ? " Points to everybody on duty!" : " Let's tidy up, y'all."));
      }
      A.staffPoints(sender, 1, "inspecting");
      d.last = { at: Date.now(), by: sender, score };
      d.insp = null;
      A.save();
      return c.reply(report);
    }
    if (w === "on" || w === "off") {
      if (!A.isStaff(sender)) return c.reply("Inspections are a staff thing, sugar.");
      if (w === "on") d.optIn[sender] = true;
      else delete d.optIn[sender];
      A.save();
      return c.reply(w === "on" ? "\u{1F50D} You'll be warned about inspections and share their score." : "\u{1F50D} You're out of inspections. No warnings, no score.");
    }
    c.reply(inspText() + (d.last ? "\nLast one: " + d.last.score + "/10 by " + A.name(d.last.by) + ", " + new Date(d.last.at).toLocaleDateString() : "") + "\n\n?insp on|off \xB7 ?insp start [minutes] \xB7 pass|fail <what> \xB7 end");
  }
  function begin() {
    const d = D(), x = d.insp;
    if (!x || x.items) return;
    x.items = autoChecks();
    x.staff = api.here().filter((mn) => d.optIn[mn] && api.isStaff(mn) && api.onDuty(mn));
    api.notice(x.by, inspText());
    api.save();
  }
  function tick() {
    const x = D().insp;
    if (x && !x.items && Date.now() >= x.startAt) begin();
  }
  function companion(mn) {
    if (!api.isStaff(mn)) {
      const n = D().writeups.filter((w) => w.to === mn).length;
      return n ? { cards: [{ title: "Write-ups", text: n + " on your record. Only you and whoever wrote each one can read it.", buttons: [{ label: "Read mine", cmd: "wu" }] }] } : null;
    }
    const d = D(), S = api.staffScores()[mn], wk = api.weekKey();
    const cards = [{
      title: "My work this week",
      lines: [["Points", S && S.week === wk ? S.pts : 0], ["Hours", api.hoursThisWeek(mn).toFixed(1)]],
      buttons: [{ label: "Leaderboard", cmd: "top" }, { label: "Write-ups", cmd: "wu" }]
    }];
    cards.push({
      title: "Inspections",
      toggles: [{ label: "Take part in inspections", desc: "Warnings before one starts, and a share of the score.", on: !!d.optIn[mn], cmd: "insp " + (d.optIn[mn] ? "off" : "on") }],
      text: d.insp ? inspText() : void 0,
      buttons: api.isHerdmaster(mn) || api.isProprietor(mn) ? d.insp ? [{ label: "Finish inspection", cmd: "insp end", accent: true }] : [{ label: "Start inspection (10 min)", cmd: "insp start" }] : void 0
    });
    if (api.isHerdmaster(mn) || api.isProprietor(mn)) cards.push({
      staff: true,
      title: "Write somebody up",
      input: { placeholder: "Bessie late for milking again", label: "Write up", cmd: "wu" },
      note: "Only you and they can read it. Everybody else sees a count."
    });
    return { cards };
  }
  connect({
    name: "work",
    label: "Work",
    version: "1.0.0",
    guide: "?top shows staff points this week (chores done at their place, refills, grooming, midwifing, bookings, inspections, glory stalls). Herdmasters and proprietors: ?wu <who> <what> (only you and they can read it), ?insp start [minutes] / pass|fail <what> / end. Staff: ?insp on|off.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      top: { usage: "top", aliases: ["leaderboard"], rank: "staff", private: true, run: (c) => c.reply(leaderboard()) },
      // ?wu lists the ones you can read · ?wu <who> theirs (a count for anybody else's) · ?wu <who> <what> writes one (herdmasters)
      wu: { usage: "wu [<who> <what happened>]", aliases: ["writeup", "writeups"], private: true, run: (c) => {
        if (c.args.length >= 2 && String(c.args[0]).toLowerCase() !== "remove" || String(c.args[0] || "").toLowerCase() === "remove") {
          if (!(c.api.isHerdmaster(c.sender) || c.api.isProprietor(c.sender))) return c.reply("Write-ups are written by herdmasters and proprietors, sugar.");
          return cmdWriteup(c);
        }
        const who = c.args[0] ? c.api.find(c.args[0]) : null;
        if (c.args[0] && !who) return c.reply("Who's that, hon?");
        c.reply(writeupsText(c.sender, who));
      } },
      insp: { usage: "insp start|pass|fail|end|on|off", aliases: ["inspection", "inspections"], rank: "staff", private: true, run: cmdInspection }
    },
    on: { tick },
    companion
  });
})();
