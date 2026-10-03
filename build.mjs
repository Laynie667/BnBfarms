// npm run build  → makes dist/farmhand-bot.user.js and dist/farmhand-companion.user.js
// npm run watch  → same, and rebuilds every time you save a file
import * as esbuild from "esbuild";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

// The bot lives in bot/src/parts/, one topic per file. They're pieces of one big function, so they're
// joined back together in file-name order (00-open.js … 18-boot.js) before bundling.
const PARTS_DIR = "bot/src/parts";
const botParts = {
  name: "bot-parts",
  setup(build) {
    build.onResolve({ filter: /^farmhand-bot-parts$/ }, () => ({ path: "farmhand-bot-parts", namespace: "bot-parts" }));
    build.onLoad({ filter: /.*/, namespace: "bot-parts" }, () => {
      const files = readdirSync(PARTS_DIR).filter((f) => f.endsWith(".js")).sort();
      return {
        contents: files.map((f) => readFileSync(PARTS_DIR + "/" + f, "utf8")).join(""),
        resolveDir: resolve("bot/src"),
        watchFiles: files.map((f) => resolve(PARTS_DIR, f)),
        loader: "js",
      };
    });
  },
};

const targets = [
  { name: "bot",       entry: "farmhand-bot-parts",     header: "bot/header.txt",       out: "dist/farmhand-bot.user.js",       version: pkg.versions.bot, plugins: [botParts] },
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
    plugins: t.plugins || [],
    logLevel: "info",
  };
  if (watch) await (await esbuild.context(options)).watch();
  else await esbuild.build(options);
}
if (!watch) console.log("✅ Built bot v" + pkg.versions.bot + " and companion v" + pkg.versions.companion + " into dist/");
