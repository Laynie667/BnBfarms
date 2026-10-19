// Oct 19: more glory hole visitors (Laynie: "id also like more gloryhole visitors and types... goblin traps and visitors
// too"). Every new kind of cock and every new character makes a whole scene, with nothing left unfilled.
const fs = require("fs"), path = require("path"), os = require("os");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const esbuild = require("esbuild"), tmp = path.join(os.tmpdir(), "fh-glory-" + process.pid + ".cjs");
esbuild.buildSync({ entryPoints: [path.join(__dirname, "../addons/glory-stalls/scenes.js")], bundle: true, format: "cjs", outfile: tmp, logLevel: "silent" });
globalThis.window = globalThis.window || {};
const tmp2 = tmp.replace(/\.cjs$/, "-vm.cjs");
esbuild.buildSync({ entryPoints: [path.join(__dirname, "../addons/glory-stalls/visitors-more.js")], bundle: true, format: "cjs", outfile: tmp2, logLevel: "silent" });
const S = require(tmp), VM = require(tmp2);
const body = { g: "female", vulva: true, cock: false, tits: true };
const NEW = ["goblin", "orc", "bovine", "tentacle", "imp"];
ok(NEW.every((t) => S.TYPES[t]), "the new kinds are in the list (" + Object.keys(S.TYPES).join(", ") + ")");
const bad = [], seen = new Set(), personas = new Set();
for (const type of NEW) for (const hole of ["mouth", "vulva", "butt"]) for (let i = 0; i < 12; i++) {
  const lines = S.buildScene({ hole, visitor: { type, size: "thick" }, funnel: false, degrade: false, praise: false, holes: ["mouth", "vulva", "butt"], body, gear: {}, animal: { key: "cow", a: "cow", call: "moo", sounds: ["a moo"] } });
  const text = (lines.beats || lines).map((b) => (typeof b === "string" ? b : b.t)).join(" | ");
  if (/undefined|%size|%[a-z]{2,}|\{[a-z]{1,2}\}/.test(text)) bad.push(type + "/" + hole + ": " + (text.match(/.{0,50}(undefined|%size|%[a-z]{2,}|\{[a-z]{1,2}\}).{0,30}/) || [""])[0]);
  seen.add(type);
  for (const [k, P] of Object.entries(VM.PERSONAS)) if (P.arrive.some((a) => text.includes(a.replace(/%n/g, "").slice(10, 40)))) personas.add(k);
}
ok(!bad.length, "every new kind makes a whole scene, nothing unfilled (" + bad.slice(0, 3).join(" ; ") + ")");
ok(["goblins", "orc", "minotaur", "tentacled", "imp"].some((k) => personas.has(k)), "the new kinds bring their own characters (" + [...personas].join(", ") + ")");
// the picker reaches the new kinds
const counts = {}; for (let i = 0; i < 4000; i++) { const v = S.pickVisitor(["mouth", "vulva", "butt"]); counts[v.type] = (counts[v.type] || 0) + 1; }
ok(NEW.every((t) => counts[t] > 0), "they come to the hole on their own (" + NEW.map((t) => t + " " + (counts[t] || 0)).join(", ") + ")");
out(fails ? "FAILED " + fails : "all passed"); process.exit(fails ? 1 : 0);
