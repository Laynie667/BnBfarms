// node tools/equipment-list.mjs [out.md]
// Writes the full list of the farm's equipment, from the built bot: every trap (what it does, how it's set up on the map,
// what rules it out, the real gear it puts on and for how long, the mess it leaves), the mystery box, the livin' suit,
// the symbiotes and the mess shelf. Laynie, Oct 15: "I need a full list of the farm equipment, the descriptions, what
// items, how to get them, etc - so i can go through and maybe come up with better options." Build first.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/i, "$1");
const esbuild = require("esbuild"), tmp = join(tmpdir(), "fh-eq-" + process.pid + ".cjs");
await esbuild.build({ entryPoints: [join(ROOT, "extension/src/marks.js")], bundle: true, format: "cjs", outfile: tmp, logLevel: "silent" });
globalThis.window = globalThis.window || {};
const { GEAR_SLOTS } = require(tmp);
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
const MESS_SHELF = (W.__messShelf && W.__messShelf()) || [];

const words = (re) => re ? String(re.source).replace(/\\b|\\s|\(|\)|\?|\^|\$/g, "").replace(/\[([a-z])\]/gi, "$1").split("|").map((w) => w.replace(/s$/, "")).filter(Boolean).join(", ") : "";
const slotName = (s) => typeof s === "function" ? "the hole they have (a dildo slot with a pussy, a plug slot without)" : s;
const NEEDS = { cups: "needs milk or udders", weights: "needs balls", trough: "needs ?watersports on", pillory: "not for breed limits", wall: "not for breed limits", vines: "not for egg or heat limits",
  collection: "studs only (needs a cock)", seedshower: "", mudpit: "needs a second subject close by to wrestle" };
const piece = (x) => {
  const S = typeof x.slot === "string" ? GEAR_SLOTS[x.slot] : null;
  const items = (x.items || []).concat(S && S.names ? S.names.filter((n) => !(x.items || []).includes(n)).slice(0, 3) : []);
  const when = x.when === "after" ? "after the trap, for " + (typeof x.mins === "number" ? x.mins + " min" : "a while") : x.when === "hold" ? "while the trap holds them" : "on";
  return "  - **" + (x.label || x.name) + "** (" + (x.slotNote || slotName(x.slot)) + ", " + when + "). Game items: " + (items.join(", ") || "none") + ". " + (x.desc || "");
};
const out = [];
out.push("# B&B Farm equipment", "", "Everything the farm puts on somebody, built from the bot " + (W.__cfg && W.__cfg.VERSION ? W.__cfg.VERSION : "") + " on " + new Date().toISOString().slice(0, 10) + ".", "",
  "How traps are set up: staff mark a map tile with `?spot set trap-<name>` (for example `trap-bakery`). A tile named just `trap` springs a random one. Water tiles (named for a pond, stream, trough or well) hide the water traps. A subject who steps on the tile can be caught once it's reset (a few minutes; faster at night and with Danger Draught). `?trap spring <who> <name>` sets one off by hand (staff). Nobody is caught by a trap their limits rule out, or while they've paused traps.",
  "Real gear goes on only for players who switched on **Farm can put real gear on me** in the Companion; messes show for **Farm can mark my body**.", "");
out.push("## Traps", "");
const kinds = Object.keys(F.TRAP_KINDS).sort();
for (const k of kinds) {
  const K = F.TRAP_KINDS[k]; if (/^keep-|^custom/.test(k)) continue;
  out.push("### " + (K.icon || "") + " " + k, "", K.what ? K.what.charAt(0).toUpperCase() + K.what.slice(1) + "." : "", "");
  out.push("- **How to get it:** a tile named `trap-" + k + "`" + (NEEDS[k] ? "; " + NEEDS[k] : "") + ".");
  const lim = words(K.limit); if (lim) out.push("- **Ruled out by limits mentioning:** " + lim + ".");
  const m = F.MESS_BY_TRAP[k]; if (m) out.push("- **Mess it leaves:** " + m[0] + " on the " + m[1].join(" and ") + ".");
  const gear = F.TRAP_GEAR[k];
  if (gear && gear.length) { out.push("- **Equipment:**"); for (const x of gear) out.push(piece(x)); }
  else out.push("- **Equipment:** none yet.");
  out.push("");
}
out.push("## The mystery box", "", "Bought from the store (`?buy mysterybox` or `?mysterybox`, " + (W.__cfg.CURSE_BOX_PRICE || 4) + " ribbons). One at a time; it comes off when its time is up, the safeword takes it off at once, staff can `?mysterybox lift <who>`.", "");
for (const [k, C] of Object.entries(F.CURSES)) {
  out.push("### 🎁 " + C.name, "", C.what || "", "", "- **Lasts:** " + C.mins + " min." + (C.limit ? " Ruled out by limits mentioning: " + words(C.limit) + "." : ""), piece({ slot: C.slot, label: C.name, items: C.items, desc: C.desc, when: "on" }), "");
}
out.push("## The livin' suit", "", "A trap (`trap-suit`). It lands as a patch and spreads a stage an hour; each stage is real gear. It feeds on arousal, stops them cumming once it has their hips, and now and then walks them somewhere. The safeword peels it off; staff `?suit off <who>`.", "");
F.SUIT_STAGES.forEach((G, i) => { if (G.slot) out.push("### 🖤 Stage " + i + ": " + G.where, "", piece({ slot: G.slot, label: G.name, items: G.items, desc: G.desc, when: "on" }), ""); });
out.push("## Symbiotes", "", "For players who said `?symbiote on`. They bond after a trap now and then, from a `symbiote-<kind>` tile, or given by staff; they spread to others who said yes (latex by touch, moss in the milk, the nestling by a breeding). Fed, they last longer; the safeword sends them away.", "");
for (const [k, list] of Object.entries(F.SYM_GEAR || {})) {
  out.push("### " + k, "");
  for (const P of list) out.push(piece({ slot: P.slot, label: P.name, items: P.items, desc: P.desc, when: "on" }).replace("(", "(from stage " + P.at + (P.upTo ? " to " + P.upTo : "") + ", "));
  out.push("");
}
out.push("## Messes", "", "Each mess is drawn by the Companion on top of the game's own splatters. `?wash` takes them off.", "");
for (const [k, col] of Object.entries(F.MESS)) out.push("- **" + k + "** " + col + ": " + (Object.entries(F.MESS_BY_TRAP).filter(([, m]) => m[0] === k).map(([t]) => t).join(", ") || "from its own traps or the shelf"));
out.push("- **cum**: the breeding traps " + Object.entries(F.MESS_BY_TRAP).filter(([, m]) => m[0] === "cum").map(([t]) => t).join(", ") + ", every load in the stalls, and the seed shower", "");
if (MESS_SHELF.length) {
  out.push("## The mess shelf", "", "`?buy <one>` for yourself, or `?buy <one> for <who>`: they're asked first unless they said `?messes on`. Their limits count; piss needs both on `?watersports`.", "");
  for (const it of MESS_SHELF) out.push("- **" + it.name + "** (`" + it.id.replace(/^mess-/, "") + "`, " + it.price + " ribbons): " + it.desc);
  out.push("");
}
const file = process.argv[2] || join(ROOT, "docs/EQUIPMENT.md");
writeFileSync(file, out.join("\n"));
quiet("✅ " + kinds.length + " traps → " + file);
process.exit(0);
