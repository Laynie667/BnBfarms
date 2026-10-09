/* WHAT'S IN THIS FILE (work/index.js)
   Work, an add-on for the farm bot: the staff leaderboard, write-ups, and inspections.

   • Leaderboard (?top): staff points this week, from everything the farm counts: chores done in
     the right place, trough refills, grooming, midwifing, stud bookings, glory stall uses by their herd,
     inspections. Hours clocked show beside them.
   • Write-ups (herdmasters and proprietors): ?wu <who> <what happened>. Only the one who wrote it and
     the one who got it can read it; everyone else just sees how many someone has. ?wu [who],
     ?wu remove <#> (the writer or a proprietor).
   • Inspections (herdmasters and proprietors start them): ?insp start [minutes, default 10].
     Only staff who switched inspections on (?insp on) are warned and share the score; not
     everybody has time for them. When it begins, the bot builds the checklist from what it knows
     (stock fed and watered, nobody overfull with milk, troughs stocked, chores done, somebody on duty).
     The inspector adds their own with ?insp fail <what> or ?insp pass <what>, and finishes
     with ?insp end: a score out of 10, a report, and points for the staff who were on duty.
*/
import { connect } from "../_lib/connect.js";

let api = null;
function D() {
  const d = api.data();
  d.writeups = d.writeups || [];   // [{ id, to, by, text, at }]
  d.optIn = d.optIn || {};         // inspections: member → true
  d.insp = d.insp || null;         // the inspection under way
  d.last = d.last || null;         // the last finished one { at, by, score }
  return d;
}

// ── leaderboard ────────────────────────────────────────────
function leaderboard() {
  const S = api.staffScores(), wk = api.weekKey();
  const rows = Object.entries(S).filter(([, x]) => x.week === wk && x.pts > 0).sort((a, b) => b[1].pts - a[1].pts).slice(0, 10);
  if (!rows.length) return "🏆 STAFF THIS WEEK\nNobody's earned points yet. Chores at their place, refills, grooming, midwifing and inspections all count.";
  return "🏆 STAFF THIS WEEK\n" + rows.map(([mn, x], i) => (i + 1) + ". " + api.name(Number(mn)) + ": " + x.pts + " pts · " +
    api.hoursThisWeek(Number(mn)).toFixed(1) + " h" + (Object.keys(x.why || {}).length ? " (" + Object.entries(x.why).map(([k, v]) => k + " " + v).join(", ") + ")" : "")).join("\n");
}

// ── write-ups ──────────────────────────────────────────────
const canSee = (w, mn) => w.by === mn || w.to === mn;
function cmdWriteup(c) {
  const { sender, args, rest, api: A } = c, d = D();
  if (String(args[0] || "").toLowerCase() === "remove") {
    const i = d.writeups.findIndex((w) => String(w.id) === String(args[1] || "").replace(/^#/, ""));
    if (i < 0) return c.reply("Which one, sugar? ?wu shows the numbers you can see.");
    if (d.writeups[i].by !== sender && !A.isProprietor(sender)) return c.reply("Only whoever wrote it, or a proprietor, can take a write-up off, hon.");
    d.writeups.splice(i, 1); A.save(); return c.reply("📝 Write-up taken off.");
  }
  const t = A.find(args[0]), text = rest.split(/\s+/).slice(1).join(" ").trim();
  if (!t || !A.rec(t) || !text) return c.reply("Here's how: ?wu <who> <what happened>. Only you and they can read it; everybody else sees a count.");
  if (t === sender) return c.reply("You can't write yourself up, sugar.");
  d.seq = (d.seq || 0) + 1;
  d.writeups.push({ id: d.seq, to: t, by: sender, text: text.slice(0, 500), at: Date.now() });
  A.save(); A.audit(sender, "WRITEUP", String(t));
  A.notice(t, "📝 " + A.name(sender) + " wrote you up: " + text.slice(0, 500) + "\n(Only you and they can read this. ?wu shows yours.)");
  c.reply("📝 Written up (#" + d.seq + "). Only you and " + A.name(t) + " can read it.");
}
function writeupsText(viewer, who) {
  const d = D(), list = who ? d.writeups.filter((w) => w.to === who) : d.writeups.filter((w) => canSee(w, viewer));
  const mine = list.filter((w) => canSee(w, viewer)), hidden = list.length - mine.length;
  let o = "📝 WRITE-UPS" + (who ? " — " + api.name(who) : "") + "\n";
  o += mine.length ? mine.map((w) => "#" + w.id + " " + api.name(w.by) + " → " + api.name(w.to) + ", " + new Date(w.at).toLocaleDateString() + ": " + w.text).join("\n") : "None you can read.";
  if (hidden) o += "\n…and " + hidden + " more written by other people (only they and " + api.name(who) + " can read those).";
  if (!who) {   // counts for everybody, nothing more
    const counts = {}; for (const w of d.writeups) counts[w.to] = (counts[w.to] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (top.length) o += "\n\nCounts: " + top.map(([mn, n]) => api.name(Number(mn)) + " " + n).join(", ");
  }
  return o;
}

// ── inspections ────────────────────────────────────────────
function autoChecks() {
  const items = [], here = api.here();
  const barn = api.peek("barn-life");
  const stock = here.filter((mn) => api.hasRole(mn, api.ROLE.LIVESTOCK));
  // fed and watered (only people who use barn life)
  const hungry = stock.filter((mn) => barn.optIn && barn.optIn[mn] && barn.needs && barn.needs[mn] && (barn.needs[mn].food < 25 || barn.needs[mn].water < 25));
  if (barn.optIn) items.push({ what: "Stock fed and watered", ok: !hungry.length, note: hungry.map(api.name).join(", ") });
  // nobody achin' full of milk
  const full = stock.filter((mn) => { const p = api.prod(mn); return p && api.makesMilk(mn) && p.milk / Math.max(1, api.milkCap(mn)) > 0.9; });
  items.push({ what: "Nobody left overfull with milk", ok: !full.length, note: full.map(api.name).join(", ") });
  // troughs
  const troughs = Object.keys(api.spots()).filter((n) => n.startsWith("trough"));
  if (troughs.length) { const empty = troughs.filter((t) => barn.troughs && barn.troughs[t] === 0); items.push({ what: "Troughs stocked", ok: !empty.length, note: empty.join(", ") }); }
  // chores done
  const behind = here.filter((mn) => api.isStaff(mn) && api.clockedIn(mn) && api.rec(mn).chore);
  items.push({ what: "Chores done", ok: !behind.length, note: behind.map(api.name).join(", ") });
  // somebody on duty
  const duty = here.filter((mn) => api.isStaff(mn) && api.onDuty(mn));
  items.push({ what: "Staff on duty", ok: duty.length > 0, note: duty.length + " on duty" });
  return items;
}
function inspText() {
  const x = D().insp;
  if (!x) return "No inspection under way.";
  if (!x.items) return "🔍 Inspection by " + api.name(x.by) + " starts in " + Math.max(0, Math.ceil((x.startAt - Date.now()) / 60000)) + " min.";
  return "🔍 INSPECTION by " + api.name(x.by) + "\n" + x.items.map((it, i) => (i + 1) + ". " + (it.ok ? "✅ " : "❌ ") + it.what + (it.note ? " (" + it.note + ")" : "")).join("\n") +
    "\n?insp pass|fail <what> adds one · ?insp end finishes";
}
function cmdInspection(c) {
  const { sender, args, rest, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
  const boss = A.isHerdmaster(sender) || A.isProprietor(sender);
  if (w === "start") {
    if (!boss) return c.reply("Inspections are started by herdmasters and proprietors, sugar.");
    if (d.insp) return c.reply("There's one under way already.\n" + inspText());
    const n = parseInt(args[1], 10), mins = Math.max(0, Math.min(60, isNaN(n) ? 10 : n));
    d.insp = { by: sender, startAt: Date.now() + mins * 60000, items: null, staff: [] };
    A.save();
    for (const mn of A.here()) if (d.optIn[mn] && A.isStaff(mn) && A.onDuty(mn) && mn !== sender) A.notice(mn, "🔍 Heads up: " + A.name(sender) + " is inspectin' the farm in " + mins + " minutes.");
    if (!mins) begin();
    return c.reply("🔍 Inspection " + (mins ? "in " + mins + " minutes" : "starts now") + ". Staff who switched inspections on have been warned.");
  }
  if (w === "pass" || w === "fail") {
    if (!d.insp || !d.insp.items) return c.reply("There's no inspection under way, hon.");
    if (d.insp.by !== sender && !A.isProprietor(sender)) return c.reply("Only the inspector marks the checklist, sugar.");
    const what = rest.split(/\s+/).slice(1).join(" ").trim();
    if (!what) return c.reply("What did you check, sugar? ?insp fail pen 2 gate left open");
    d.insp.items.push({ what: what.slice(0, 120), ok: w === "pass", note: "" }); A.save();
    return c.reply(inspText());
  }
  if (w === "end") {
    if (!d.insp) return c.reply("There's no inspection under way, hon.");
    if (d.insp.by !== sender && !A.isProprietor(sender)) return c.reply("Only the inspector finishes it, sugar.");
    if (!d.insp.items) begin();
    const x = d.insp, total = x.items.length, ok = x.items.filter((i) => i.ok).length, score = total ? Math.round((ok / total) * 10) : 10;
    const report = inspText().split("\n?insp")[0] + "\n\nScore: " + score + "/10";
    // the staff who were on duty and signed up for inspections share the result
    for (const mn of x.staff) { if (score >= 5) A.staffPoints(mn, Math.round(score / 2), "inspection"); A.notice(mn, "🔍 Inspection's done: " + score + "/10." + (score >= 5 ? " Points to everybody on duty!" : " Let's tidy up, y'all.")); }
    A.staffPoints(sender, 1, "inspecting");
    d.last = { at: Date.now(), by: sender, score }; d.insp = null; A.save();
    return c.reply(report);
  }
  if (w === "on" || w === "off") {
    if (!A.isStaff(sender)) return c.reply("Inspections are a staff thing, sugar.");
    if (w === "on") d.optIn[sender] = true; else delete d.optIn[sender];
    A.save();
    return c.reply(w === "on" ? "🔍 You'll be warned about inspections and share their score." : "🔍 You're out of inspections. No warnings, no score.");
  }
  c.reply(inspText() + (d.last ? "\nLast one: " + d.last.score + "/10 by " + A.name(d.last.by) + ", " + new Date(d.last.at).toLocaleDateString() : "") +
    "\n\n?insp on|off · ?insp start [minutes] · pass|fail <what> · end");
}
function begin() {
  const d = D(), x = d.insp; if (!x || x.items) return;
  x.items = autoChecks();
  x.staff = api.here().filter((mn) => d.optIn[mn] && api.isStaff(mn) && api.onDuty(mn));
  api.notice(x.by, inspText());
  api.save();
}
function tick() { const x = D().insp; if (x && !x.items && Date.now() >= x.startAt) begin(); }

// ── Companion cards ────────────────────────────────────────
function companion(mn) {
  if (!api.isStaff(mn)) {
    const n = D().writeups.filter((w) => w.to === mn).length;
    return n ? { cards: [{ title: "Write-ups", text: n + " on your record. Only you and whoever wrote each one can read it.", buttons: [{ label: "Read mine", cmd: "wu" }] }] } : null;
  }
  const d = D(), S = api.staffScores()[mn], wk = api.weekKey();
  const cards = [{ title: "My work this week", lines: [["Points", S && S.week === wk ? S.pts : 0], ["Hours", api.hoursThisWeek(mn).toFixed(1)]],
    buttons: [{ label: "Leaderboard", cmd: "top" }, { label: "Write-ups", cmd: "wu" }] }];
  cards.push({ title: "Inspections", toggles: [{ label: "Take part in inspections", desc: "Warnings before one starts, and a share of the score.", on: !!d.optIn[mn], cmd: "insp " + (d.optIn[mn] ? "off" : "on") }],
    text: d.insp ? inspText() : undefined,
    buttons: (api.isHerdmaster(mn) || api.isProprietor(mn)) ? (d.insp ? [{ label: "Finish inspection", cmd: "insp end", accent: true }] : [{ label: "Start inspection (10 min)", cmd: "insp start" }]) : undefined });
  if (api.isHerdmaster(mn) || api.isProprietor(mn)) cards.push({ staff: true, title: "Write somebody up", input: { placeholder: "Bessie late for milking again", label: "Write up", cmd: "wu" },
    note: "Only you and they can read it. Everybody else sees a count." });
  return { cards };
}

connect({
  name: "work",
  label: "Work",
  version: "1.0.0",
  guide: "?top shows staff points this week (chores done at their place, refills, grooming, midwifing, bookings, inspections, glory stalls). " +
    "Herdmasters and proprietors: ?wu <who> <what> (only you and they can read it), ?insp start [minutes] / pass|fail <what> / end. Staff: ?insp on|off.",
  setup(a) { api = a; D(); },
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
    insp: { usage: "insp start|pass|fail|end|on|off", aliases: ["inspection", "inspections"], rank: "staff", private: true, run: cmdInspection },
  },
  on: { tick },
  companion,
});
