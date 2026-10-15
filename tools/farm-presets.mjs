// node tools/farm-presets.mjs
// Writes studio/web/farm-presets.json: every set of equipment the farm puts on somebody (each trap's gear, the mystery
// box's curses, the livin' suit's stages) and every mess colour, as presets the studio can put on with one click
// (Laynie, Oct 15: "added the farm items to the studio as presets, so i can view each set without having to wait in
// game to trigger"). It reads them from the built bot (dist/), so build first. Run again after the gear changes.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/i, "$1");

// the Companion's slot table: which game groups and items each piece's slot means
const esbuild = require("esbuild"), tmp = join(tmpdir(), "fh-slots-" + process.pid + ".cjs");
await esbuild.build({ entryPoints: [join(ROOT, "extension/src/marks.js")], bundle: true, format: "cjs", outfile: tmp, logLevel: "silent" });
globalThis.window = globalThis.window || {};
const { GEAR_SLOTS } = require(tmp);

// the bot, on a stand-in page, just long enough to read its lists
const store = {};
globalThis.GM_getValue = (k, d) => (k in store ? store[k] : d); globalThis.GM_setValue = (k, v) => (store[k] = v); globalThis.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend() {}, ServerSocket: { connected: false, on() {} }, Player: { MemberNumber: 0 }, ChatRoomCharacter: [], Commands: [] };
globalThis.unsafeWindow = W; Object.assign(globalThis.window, W); globalThis.Blob = class {}; globalThis.URL = { createObjectURL() {} };
const quiet = console.log; console.log = () => {}; console.warn = () => {};
W.__FARMHAND_TEST__ = true;
(0, eval)(readFileSync(join(ROOT, "dist/farmhand-bot.user.js"), "utf8"));
console.log = quiet;
const F = W.__farmSets();

// a stand-in body to settle "which hole" pieces: with a pussy (dildo) and without (plug)
const pieceOut = (x, body) => {
  let slot = x.slot;
  if (typeof slot === "function") slot = body === "pussy" ? "dildo" : "plug";
  const S = GEAR_SLOTS[slot]; if (!S) return null;
  const mins = typeof x.mins === "function" ? "" : x.mins;
  return { slot, groups: S.groups, items: (x.items || []).concat(S.names), color: x.color || (Array.isArray(S.color) ? S.color : S.color || null), label: x.label || x.name, when: x.when || "on", mins: mins || null, desc: x.desc || "" };
};
const sets = [];
for (const [kind, list] of Object.entries(F.TRAP_GEAR)) {
  const K = F.TRAP_KINDS[kind] || {};
  for (const body of list.some((x) => typeof x.slot === "function") ? ["pussy", "no pussy"] : [""]) {
    const pieces = list.map((x) => pieceOut(x, body)).filter(Boolean);
    if (pieces.length) sets.push({ group: "Traps", name: (K.icon ? K.icon + " " : "") + kind + (body ? " (" + body + ")" : ""), what: K.what || "", pieces });
  }
}
for (const [kind, C] of Object.entries(F.CURSES)) {
  for (const body of ["pussy", "no pussy"]) {
    const p = pieceOut({ slot: C.slot, label: C.name, desc: C.desc, items: C.items }, body);
    if (p) sets.push({ group: "Mystery box", name: "🎁 " + C.name + (kind === "plug" ? " (" + body + ")" : ""), what: C.what, pieces: [p] });
    if (kind !== "plug") break;
  }
}
const suit = [];
F.SUIT_STAGES.forEach((G, i) => { if (!G.slot) return; suit.push(pieceOut({ slot: G.slot, label: G.name, desc: G.desc, items: G.items, color: F.SUIT_COLOR }, "pussy")); sets.push({ group: "Livin' suit", name: "🖤 stage " + i + ": " + G.where, what: "as far as it has spread", pieces: suit.filter(Boolean).slice() }); });
for (const [kind, list] of Object.entries(F.SYM_GEAR || {})) {
  const top = Math.max(0, ...list.map((P) => P.at));
  for (let st = 1; st <= top; st++) {
    const pieces = list.filter((P) => st >= P.at && !(P.upTo && st > P.upTo)).map((P) => pieceOut({ slot: P.slot, label: P.name, desc: P.desc, items: P.items, color: P.color }, "pussy")).filter(Boolean);
    if (pieces.length) sets.push({ group: "Symbiotes", name: (kind === "latex" ? "🖤 livin' latex" : "🌱 milk moss") + ", stage " + st, what: "as far as it has grown", pieces });
  }
}
const messes = Object.entries(F.MESS).map(([name, color]) => ({ name, color, traps: Object.entries(F.MESS_BY_TRAP).filter(([, m]) => m[0] === name).map(([k]) => k) }));
writeFileSync(join(ROOT, "studio/web/farm-presets.json"), JSON.stringify({ made: new Date().toISOString(), sets, messes }, null, 1));
quiet("✅ " + sets.length + " equipment sets and " + messes.length + " messes → studio/web/farm-presets.json");
process.exit(0);
