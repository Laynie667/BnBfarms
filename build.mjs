// npm run build  → makes dist/farmhand-bot.user.js and dist/farmhand-companion.user.js
// npm run watch  → same, and rebuilds every time you save a file
import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const targets = [
  { name: "bot",       entry: "bot/src/farmhand.js",    header: "bot/header.txt",       out: "dist/farmhand-bot.user.js",       version: pkg.versions.bot },
  { name: "companion", entry: "extension/src/index.js", header: "extension/header.txt", out: "dist/farmhand-companion.user.js", version: pkg.versions.companion },
];

mkdirSync("dist", { recursive: true });
const watch = process.argv.includes("--watch");

for (const t of targets) {
  const header = readFileSync(t.header, "utf8").replace("{{VERSION}}", t.version);
  const options = {
    entryPoints: [t.entry],
    bundle: true,
    format: "iife",
    target: "es2020",
    charset: "utf8",
    legalComments: "none",
    banner: { js: header },
    define: { __FARMHAND_VERSION__: JSON.stringify(t.version) },
    outfile: t.out,
    logLevel: "info",
  };
  if (watch) await (await esbuild.context(options)).watch();
  else await esbuild.build(options);
}
if (!watch) console.log("✅ Built bot v" + pkg.versions.bot + " and companion v" + pkg.versions.companion + " into dist/");
