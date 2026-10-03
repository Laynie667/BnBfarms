// node tools/bcplus-catalog.mjs [path to bc-plus checkout]
// Reads BC+'s own rule list from its source and writes shared/bcplus-rules.json:
// every rule, its settings, their types, choices, limits and defaults.
// Run it again whenever BC+ updates (git pull in reference/bc-plus first).
import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const BCP = resolve(process.argv[2] || "../reference/bc-plus");
const pkg = JSON.parse(readFileSync(join(BCP, "package.json"), "utf8"));
const out = join(mkdtempSync(join(tmpdir(), "bcp-")), "rules.mjs");

await esbuild.build({
  entryPoints: [join(BCP, "src/rules/index.ts")],
  bundle: true, format: "esm", platform: "neutral", outfile: out, logLevel: "error",
  alias: { "@": join(BCP, "src") },
  loader: { ".png": "empty", ".svg": "empty", ".css": "empty", ".vue": "empty" },
  external: ["bondage-club-mod-sdk"],
  // the same build constants BC+'s own build.mjs sets
  define: { "process.env.NODE_ENV": '"production"', BCP_VERSION: JSON.stringify(pkg.version), BCP_DEV_ENV: "false",
            BCP_STABLE: "true", BCP_SAVE_KEY: '""' },
});

// the rule files only touch the game inside their functions, so light stand-ins are enough to load them
const g = globalThis;
g.window ??= g; g.Player ??= {}; g.LZString ??= {};
for (const k of ["ServerPlayerIsInChatRoom", "ChatRoomSendLocal", "ServerSend"]) g[k] ??= () => {};

const { RULE_DEFINITIONS } = await import(pathToFileURL(out).href);
const KEEP = ["type", "name", "label", "options", "default", "maxChars", "maxEntries", "entryLabel", "legacySeparator", "min", "max", "step"];
const rules = RULE_DEFINITIONS.map((r) => ({
  id: r.id, name: r.name, category: r.category, description: r.description,
  ...(r.bcxEquivalent ? { bcxEquivalent: r.bcxEquivalent } : {}),
  settings: (r.settings || []).map((s) => Object.fromEntries(KEEP.filter((k) => s[k] !== undefined).map((k) => [k, s[k]]))),
}));
writeFileSync("shared/bcplus-rules.json", JSON.stringify({ bcplusVersion: pkg.version, made: new Date().toISOString().slice(0, 10), rules }, null, 1) + "\n");
console.log(`✅ ${rules.length} BC+ rules (BC+ ${pkg.version}) → shared/bcplus-rules.json`);
