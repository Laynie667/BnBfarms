// Farm contracts against BC+'s OWN code: the catalog matches BC+, every ready-made contract passes
// BC+'s sanitizer unchanged, and our checker catches what BC+ would drop or refuse.
// Needs the BC+ source next door (../reference/bc-plus). Without it, this test is skipped.
const fs = require("fs"), path = require("path"), os = require("os");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const BCP = path.resolve(__dirname, "../../reference/bc-plus");
if (!fs.existsSync(path.join(BCP, "src/modules/Contracts.ts"))) { out("BC+ source not found, skipped ->", "skipped"); process.exit(0); }

const esbuild = require("esbuild");
const pkg = JSON.parse(fs.readFileSync(path.join(BCP, "package.json"), "utf8"));
const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "farm-bcp-")), "t.cjs");
const fwd = (p) => p.replace(/\\/g, "/");
esbuild.buildSync({
  stdin: { resolveDir: __dirname, loader: "ts", contents:
    `export * as farm from "${fwd(path.resolve(__dirname, "../shared/bcplus.js"))}";
     export { sanitizeContractPayload } from "${fwd(path.join(BCP, "src/system/contracts/ContractTypes.ts"))}";
     export { RULE_DEFINITIONS } from "${fwd(path.join(BCP, "src/rules/index.ts"))}";` },
  bundle: true, format: "cjs", platform: "neutral", outfile: file, logLevel: "error",
  alias: { "@": path.join(BCP, "src") },
  loader: { ".png": "empty", ".svg": "empty", ".css": "empty", ".vue": "empty" },
  external: ["bondage-club-mod-sdk"],
  define: { BCP_VERSION: JSON.stringify(pkg.version), BCP_DEV_ENV: "false", BCP_STABLE: "true", BCP_SAVE_KEY: '""' },
});
global.window = global; global.Player = {}; global.LZString = {};
for (const k of ["ServerPlayerIsInChatRoom", "ChatRoomSendLocal", "ServerSend"]) global[k] = () => {};
const { farm, sanitizeContractPayload, RULE_DEFINITIONS } = require(file);

// 1. the catalog is BC+'s real rule list
const live = RULE_DEFINITIONS.map((r) => r.id).sort().join(",");
const ours = [...farm.RULES.keys()].sort().join(",");
out("1 catalog matches BC+ " + pkg.version + " ->", live === ours, "(" + farm.RULES.size + " rules; re-run tools/bcplus-catalog.mjs if false)");
out("1 catalog version ->", farm.BCPLUS_VERSION === pkg.version);

// 2. every ready-made contract is clean, and survives BC+'s sanitizer unchanged
const farmInfo = { bot: 260239, staff: [221397, 232922, 700, 800], rooms: ["B&B Farm", "B&B Barn"] };
const species = ["cow", "bull", "pony", "goat", "pig", "sheep", "bunny", "pup", "kitt", "fox", "wolf", "deer", "goblin", ""];
let clean = 0, same = 0, total = 0;
for (const depth of ["fun", "deep", "nhl"]) for (const sp of species) for (const d of farm.DURATIONS) {
  total++;
  const c = farm.makeContract({ title: "B&B Farm " + depth, terms: "Terms.", duration: d, depth, who: { name: "Bessiemaybe Longname", species: sp }, farm: farmInfo });
  const problems = farm.checkContract(c);
  if (!problems.length) clean++; else out("  problem", depth, sp, d.key, "->", problems.join(" | "), false);
  const s = sanitizeContractPayload(Object.assign({ author: 260239, authorName: "Farm" }, c));
  const back = s && { title: s.title, terms: s.terms, durationMin: s.durationMin, policy: s.policy, rules: s.rules };
  if (s && JSON.stringify(back) === JSON.stringify(c)) same++; else out("  changed by BC+", depth, sp, d.key, "->", false);
}
out("2 every ready-made contract is clean ->", clean === total, clean + "/" + total);
out("2 BC+ keeps every one exactly ->", same === total, same + "/" + total);

// 3. the checker catches what BC+ would drop or refuse
const base = () => farm.makeContract({ title: "T", duration: "1w", depth: "deep", who: { name: "Moo", species: "cow" }, farm: farmInfo });
const c1 = base(); c1.rules["body.controlOrgasms"].settings.mode = "Ask staff first";
out("3 bad choice caught ->", farm.checkContract(c1).some((p) => /Edged, Ruined, Unresistable/.test(p)));
const c2 = base(); c2.rules["settings.safeword"] = farm.makeSpec("settings.safeword", { value: "Safeword disabled" });
out("3 safeword rule refused ->", farm.checkContract(c2).some((p) => /never/.test(p)));
const c3 = base(); c3.rules["made.up"] = farm.makeSpec("made.up");
out("3 unknown rule caught ->", farm.checkContract(c3).some((p) => /no rule by that name/.test(p)));
const c4 = base(); c4.rules["control.nickname"].settings.nickname = "A nickname far too long for BC";
out("3 long nickname caught ->", farm.checkContract(c4).some((p) => /20 characters/.test(p)));
const c5 = base(); c5.durationMin = 50000;
out("3 over 30 days caught ->", farm.checkContract(c5).some((p) => /30 days/.test(p)));

// 4. words people type
out("4 durations ->", ["an hour", "12h", "a day", "week", "two weeks", "a month", "forever"].map((w) => (farm.durationFrom(w) || {}).key).join(",") === "1h,12h,1d,1w,2w,1m,perm");
out("4 depths ->", ["playful", "deep", "no human left"].map((w) => (farm.depthFrom(w) || {}).key).join(",") === "fun,deep,nhl");
out("4 pet sounds ->", farm.petFor("bull").animal === "Cow" && farm.petFor("pig").animal === "Custom" && farm.petFor("pig").sounds.includes("oink"));
