// node tools/pool-audit.mjs [--json out.json]
// Reads the bot's parts and the add-ons and lists every pool of lines (an array of three or more strings), then checks
// each line for the things that go wrong in the farm's writing: a body part the reader may not have, clinical words,
// a he/she where "they" belongs, round brackets in room lines, doubled words, leftover placeholders, repeats, and pools
// too small to stay fresh. It only reads; it changes nothing. The private add-on is read (it's on this computer) but
// nothing from it is written into the report's examples.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pools, CLINICAL } from "./lines.mjs";   // (the line reader, shared with tests/lines.test.cjs, the checker every release runs)

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) { if (n !== "node_modules") walk(p); } else if (/\.(m?js|cjs)$/.test(n)) files.push(p); } };
walk(join(ROOT, "bot/src/parts")); walk(join(ROOT, "addons"));

const VULVA = /\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i, TITS = /\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i, COCK = /\b(cock|cocks|balls|dick|shaft|knot)\b/i, GIRL = /\b(girl|girls|heifer|mare|broodmare|she|her|hers|herself)\b/i, GENDERED = /\b(she|her|hers|herself|he|him|his|himself)\b/i;
const TAG = /^(?:\{(?:nv|nc|nt|fu|fb|v|c|t|f|m)\})+/;
const rep = { files: 0, pools: 0, lines: 0, findings: {}, small: [], dupes: [] };
const add = (k, f, line, text) => { (rep.findings[k] = rep.findings[k] || []).push({ f, line, text: text.slice(0, 160) }); };
const seen = new Map();
for (const f of files) {
  const src = readFileSync(f, "utf8"), rel = relative(ROOT, f).replace(/\\/g, "/"), priv = rel.includes("private-laynie"), lineAt = (at) => src.slice(0, at).split("\n").length;
  rep.files++;
  for (const p of pools(src)) {
    const lines = p.lines.filter((l) => l.length > 25 && /[a-z]/.test(l) && / /.test(l)); if (lines.length < 3) continue;
    rep.pools++; rep.lines += lines.length; const ln = lineAt(p.at);
    if (lines.length < 5) rep.small.push({ f: rel, line: ln, n: lines.length, first: priv ? "(private)" : lines[0].slice(0, 80) });
    for (const l of lines) {
      const tagged = TAG.test(l), show = priv ? "(private)" : l;
      if (CLINICAL.test(l)) add("clinical: " + (l.match(CLINICAL)[0].toLowerCase()), rel, ln, show);
      if (!tagged && VULVA.test(l)) add("pussy words, untagged", rel, ln, show);
      if (!tagged && TITS.test(l)) add("tit words, untagged", rel, ln, show);
      if (!tagged && COCK.test(l)) add("cock words, untagged", rel, ln, show);
      if (GENDERED.test(l.replace(/%\w+%?/g, ""))) add("he/she (not they)", rel, ln, show);
      if (/\([^)]*\)/.test(l) && !/^\s*\(/.test(l)) add("round brackets", rel, ln, show);
      if (/\b(\w+) \1\b/i.test(l) && !/\b(that that|had had|very very|more more)\b/i.test(l)) add("doubled word", rel, ln, show);
      if (/ {2,}|\s[,.!?]|\.\.(?!\.)/.test(l)) add("spacing", rel, ln, show);
      if (/%[a-z]+(?![a-z%])/.test(l) && !/%(n|ml|c|h|x|a|b|s|t|p|w|d|g|v|k|l|z)\b/.test(l)) add("odd placeholder", rel, ln, show);
      const key = l.toLowerCase().replace(/%\w+%?/g, "%").replace(/[^a-z% ]/g, ""); if (seen.has(key) && seen.get(key) !== rel + ":" + ln) rep.dupes.push({ a: seen.get(key), b: rel + ":" + ln, text: show.slice(0, 100) }); else seen.set(key, rel + ":" + ln);
    }
  }
}
const out = process.argv.indexOf("--json");
if (out > 0) writeFileSync(process.argv[out + 1], JSON.stringify(rep, null, 1));
console.log(`files ${rep.files} · pools ${rep.pools} · lines ${rep.lines} · small pools (<5) ${rep.small.length} · repeated lines ${rep.dupes.length}`);
for (const [k, v] of Object.entries(rep.findings).sort((a, b) => b[1].length - a[1].length)) console.log(String(v.length).padStart(5), k);
