// Nov 4, Phase 5 of the plan: ONE LINE CHECKER over every pool of lines the farm has, run on every release.
// Twice over: from the source (the bot's parts and every part of its own in addons/, the private one left out), and
// from the pools the runnin' bot holds (W.__lines(), so lines added with .push(...) are read too). Every line keeps the
// rules in tools/lines.mjs: no clinical word (Laynie: "avoid clinical language"), no {tag} that would show, no tag the
// bot doesn't know, no odd quote mark, no "the the", no "undefined", and no line twice in its own pool.
// The softer things (a body word with no tag, a "her" that may be the farm girl) stay in tools/pool-audit.mjs's report.
const fs = require("fs"), path = require("path"), { pathToFileURL } = require("url");
const ROOT = path.join(__dirname, "..");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };

(async () => {
  const { sourceFiles, poolsIn, mustFix, isLine, MUST } = await import(pathToFileURL(path.join(ROOT, "tools/lines.mjs")).href);

  // the rules themselves: each catches what it's for, and leaves good lines be
  const bad = ["%n's lactation runs heavy and warm all mornin' long.", "The farmhand pats the the cow on the rump and moves on.",
    "%n kneels in the straw {v}and spreads for the farmhand.", "{zz}%n kneels in the straw and waits for whoever comes.",
    "\"Good cow, %n moans the farmhand into the straw at dawn.", "%n gets undefined ribbons for the trouble this mornin'."];
  const good = ["{nv}{c}%n's cock bobs as the farmhand leads them along.", "[cow]{t}The farmhand washes %n's udders like a dairy hand would.",
    "Somebody pats the pumpkin and tells it it's done very well.", "\"Good cow,\" the farmhand says, and %n moos right back."];
  ok(bad.every((l) => mustFix(l).length === 1), "each rule catches its own kind of bad line (" + bad.map((l) => mustFix(l).join("/") || "missed").join(" · ") + ")");
  ok(good.every((l) => !mustFix(l).length), "...and leaves good lines be (" + good.map((l) => mustFix(l).join("/") || "ok").join(" · ") + ")");
  ok(MUST.length >= 6, "the rules: " + MUST.map(([n]) => n).join(", "));

  // 1. from the source
  const files = sourceFiles(path.join(ROOT, "bot/src/parts"), path.join(ROOT, "addons")).filter((f) => !/[\\/]private-/.test(f));
  const found = [], repeats = []; let lines = 0, pools = 0;
  for (const f of files) for (const p of poolsIn(f)) {
    const ls = p.lines.filter(isLine); if (ls.length < 3) continue;
    pools++; const seen = new Set();
    for (const l of ls) { lines++;
      for (const r of mustFix(l)) found.push(path.relative(ROOT, f) + ":" + p.at + " (" + r + ") " + l.slice(0, 90));
      if (seen.has(l)) repeats.push(path.relative(ROOT, f) + ":" + p.at + " " + l.slice(0, 70)); seen.add(l); }
  }
  ok(lines > 15000, "read " + lines + " lines in " + pools + " pools from " + files.length + " files");
  ok(!found.length, "every line in the source keeps the rules" + (found.length ? ":\n    " + found.slice(0, 20).join("\n    ") : ""));
  ok(!repeats.length, "no line is in its own pool twice" + (repeats.length ? ":\n    " + repeats.slice(0, 10).join("\n    ") : ""));

  // 2. from the runnin' bot: every pool it holds, however it was built
  const store = { bnb_ledger_v1: JSON.stringify({ v: 4, people: {}, applications: [], archive: {}, log: [], stuckLog: [], spots: {} }) };
  global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
  const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
  const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, ServerSend() {}, ServerSocket: { connected: true, on() {} },
    Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [260239], MapData: { Type: "Always" } }, ChatRoomCharacter: [], ChatRoomPlayerIsAdmin: () => true, Commands: [] };
  global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = Object.assign(global.URL || {}, { createObjectURL() {} });
  const quiet = { ...console, log: () => {}, warn: () => {} }, was = global.console; global.console = quiet;
  W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(ROOT, "dist/farmhand-bot.user.js"), "utf8"));
  global.console = was;
  const live = [], seenObj = new Set();
  const walk = (x, where) => {
    if (!x || typeof x !== "object" || seenObj.has(x)) return; seenObj.add(x);
    if (Array.isArray(x)) { if (x.length >= 3 && x.every((v) => typeof v === "string")) { live.push({ where, lines: x }); return; } x.forEach((v, i) => walk(v, where + "[" + i + "]")); return; }
    for (const [k, v] of Object.entries(x)) walk(v, where + "." + k);
  };
  for (const [k, v] of Object.entries(W.__lines())) walk(v, k);
  const liveBad = [], liveRep = []; let liveN = 0;
  for (const p of live) { const seen = new Set();
    for (const l of p.lines.filter(isLine)) { liveN++;
      for (const r of mustFix(l)) liveBad.push(p.where + " (" + r + ") " + l.slice(0, 90));
      if (seen.has(l)) liveRep.push(p.where + " " + l.slice(0, 70)); seen.add(l); } }
  ok(liveN > 5000, "read " + liveN + " lines in " + live.length + " pools the runnin' bot holds");
  ok(!liveBad.length, "every line the bot holds keeps the rules" + (liveBad.length ? ":\n    " + liveBad.slice(0, 20).join("\n    ") : ""));
  ok(!liveRep.length, "no line is in its own pool twice there either" + (liveRep.length ? ":\n    " + liveRep.slice(0, 10).join("\n    ") : ""));
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
