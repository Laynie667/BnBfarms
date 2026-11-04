// Nov 4, Phase 4 of the plan: the parts of the farm girl (the add-ons) and their manifests. Every part's addon.json is
// whole, the part plugs in under its own folder's name, tells the bot the version its addon.json has (they'd said
// 1.0.0 for months while the release bumped the file), and takes no word the bot or another part already has. The
// starter template (addons/_template) is built and plugged in too, so it stays a workin' part.
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const store = {}; const sent = []; const handlers = {}; const warns = [];
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], species: "cow", onDuty: true, herds: [], tempKeys: [], cover: [] },
  "501": { mn: 501, name: "Bessie", roles: ["LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [] },
}, applications: [], archive: {}, log: [], stuckLog: [], spots: {} });
global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
const at = (m, X, Y) => ({ MemberNumber: m, Name: "N" + m, MapData: { Pos: { X, Y }, PrivateState: {} }, Appearance: [] });
const chars = [at(260239, 1, 1), at(221397, 20, 20), at(501, 5, 5)];
const evts = {};
const W = { document: doc, addEventListener(e, f) { (evts[e] = evts[e] || []).push(f); }, dispatchEvent(ev) { (evts[ev.type] || []).forEach((f) => f(ev)); },
  CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } },
  location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => { sent.push([ev, d]); }, ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
  Player: { MemberNumber: 260239, FriendList: [221397, 501] },
  ChatRoomData: { Name: "B&B Farm", Admin: [260239], MapData: { Type: "Always" } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.map(String).join(" ")) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(ROOT, "dist/farmhand-bot.user.js"), "utf8"));
const realTimeout = setTimeout, wait = (ms) => new Promise((r) => realTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const toWhom = (mn, n) => sent.slice(n).filter(([e, d]) => d && (d.Target === mn || e === "AccountBeep" && d.MemberNumber === mn)).map(([e, d]) => String(d.Content || d.Message || "") + (d.Dictionary ? JSON.stringify(d.Dictionary) : "")).join(" | ");

(async () => {
  await wait(3500);
  // every part with a manifest (a private one only where it's built: it's never on GitHub)
  const parts = fs.readdirSync(path.join(ROOT, "addons"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && fs.existsSync(path.join(ROOT, "addons", d.name, "addon.json")))
    .map((d) => ({ dir: d.name, meta: JSON.parse(fs.readFileSync(path.join(ROOT, "addons", d.name, "addon.json"), "utf8")), dist: path.join(ROOT, "dist/farmhand-" + d.name + ".user.js") }))
    .filter((p) => !p.dir.startsWith("private-") || fs.existsSync(p.dist));
  ok(parts.length >= 8, "the parts: " + parts.map((p) => p.dir).join(", "));
  const badMeta = parts.filter((p) => !p.meta.label || !/^\d+\.\d+\.\d+$/.test(p.meta.version || "") || !p.meta.description);
  ok(!badMeta.length, "every addon.json has a label, a version and a description" + (badMeta.length ? " (not: " + badMeta.map((p) => p.dir).join(", ") + ")" : ""));
  for (const p of parts) eval(fs.readFileSync(p.dist, "utf8"));
  await wait(400);
  const list = W.Farmhand.list();
  const missing = parts.filter((p) => !list.some((a) => a.name === p.dir));
  ok(!missing.length, "each part plugs in under its folder's name" + (missing.length ? " (not: " + missing.map((p) => p.dir).join(", ") + ")" : ""));
  const wrongVer = parts.map((p) => [p, list.find((a) => a.name === p.dir)]).filter(([p, a]) => a && a.version !== p.meta.version);
  ok(!wrongVer.length, "each part tells the bot the version in its addon.json" + (wrongVer.length ? " (" + wrongVer.map(([p, a]) => p.dir + " says " + a.version + ", file " + p.meta.version).join("; ") + ")" : ""));
  const clash = warns.filter((w) => /belongs to the bot, skipped|is already taken by/.test(w));
  ok(!clash.length, "no part's command is skipped for clashin' with the bot or another part" + (clash.length ? " (" + clash.join("; ").slice(0, 300) + ")" : ""));
  ok(!list.some((a) => a.errors), "none of them broke while pluggin' in");

  // the starter template: built the way npm run build builds a part, then plugged in
  const esbuild = require("esbuild");
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, "addons/_template/addon.json"), "utf8"));
  const built = esbuild.buildSync({ entryPoints: [path.join(ROOT, "addons/_template/index.js")], bundle: true, write: false, format: "iife", target: "es2020",
    define: { __ADDON_VERSION__: JSON.stringify(meta.version) }, logLevel: "silent" });
  eval(built.outputFiles[0].text);
  await wait(300);
  const tpl = W.Farmhand.list().find((a) => a.name === "my-part");
  ok(tpl && tpl.version === meta.version && tpl.label === meta.label, "the template builds and plugs in, with its addon.json's version and label");
  let n = sent.length; handlers.AccountBeep({ MemberNumber: 501, Message: "wave" }); await wait(1500);
  ok(/That's 1 wave/.test(toWhom(501, n)), "...and its ?wave answers");
  const card = ((W.__stateFor(501).mods || {})["my-part"] || {}).cards || [];
  ok(card.length && card[0].title === "Waves", "...and its card goes to the Companion");
  ok(!warns.some((w) => /my-part/.test(w)), "...with nothin' logged against it");
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
