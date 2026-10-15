// node tools/pool-audit.mjs [--json out.json]
// Reads the bot's parts and the add-ons and lists every pool of lines (an array of three or more strings), then checks
// each line for the things that go wrong in the farm's writing: a body part the reader may not have, clinical words,
// a he/she where "they" belongs, round brackets in room lines, doubled words, leftover placeholders, repeats, and pools
// too small to stay fresh. It only reads; it changes nothing. The private add-on is read (it's on this computer) but
// nothing from it is written into the report's examples.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) { if (n !== "node_modules") walk(p); } else if (/\.(m?js|cjs)$/.test(n)) files.push(p); } };
walk(join(ROOT, "bot/src/parts")); walk(join(ROOT, "addons"));

// ── a small tokenizer: string literals and brackets, skipping comments and regexes ──
function tokens(src) {
  const out = []; let i = 0, prev = "";
  const regexOk = () => !prev || /[(,=:[!&|?{};+\-*%<>~^]$/.test(prev) || /\b(return|typeof|case|in|of|new|delete|void|throw)$/.test(prev);
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "/") { const e = src.indexOf("\n", i); i = e < 0 ? src.length : e; continue; }
    if (c === "/" && d === "*") { const e = src.indexOf("*/", i + 2); i = e < 0 ? src.length : e + 2; continue; }
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1, s = "", tmpl = false;
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") { const n = src[j + 1]; s += n === "n" ? "\n" : n === "u" ? String.fromCharCode(parseInt(src.slice(j + 2, j + 6), 16)) : n; j += n === "u" ? 6 : 2; continue; }
        if (c === "`" && src[j] === "$" && src[j + 1] === "{") { tmpl = true; let depth = 1; j += 2; s += "${…}"; while (j < src.length && depth) { if (src[j] === "{") depth++; else if (src[j] === "}") depth--; j++; } continue; }
        s += src[j]; j++;
      }
      out.push({ t: "str", v: s, at: i, tmpl }); prev = "s"; i = j + 1; continue;
    }
    if (c === "/" && regexOk()) { let j = i + 1, cls = false; while (j < src.length) { const k = src[j]; if (k === "\\") { j += 2; continue; } if (k === "[") cls = true; else if (k === "]") cls = false; else if (k === "/" && !cls) break; else if (k === "\n") break; j++; } i = j + 1; while (/[a-z]/.test(src[i] || "")) i++; prev = "r"; continue; }
    if ("[](){},+".includes(c)) { out.push({ t: c, at: i }); prev = c; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    let j = i; while (j < src.length && !/[\s"'`[\](){},+/]/.test(src[j])) j++; if (j === i) j++;
    prev = src.slice(i, j); i = j;
  }
  return out;
}
// pools: [ "…", "…", … ] with three or more strings (a string joined with + counts as one line)
function pools(src) {
  const tk = tokens(src), res = [], stack = [];
  for (let k = 0; k < tk.length; k++) {
    const t = tk[k];
    if (t.t === "[") stack.push({ at: t.at, items: [], cur: null, bad: false });
    else if (t.t === "]") { const p = stack.pop(); if (!p) continue; if (p.cur != null) p.items.push(p.cur); if (!p.bad && p.items.length >= 3 && p.items.every((x) => typeof x === "string")) res.push({ at: p.at, lines: p.items }); if (stack.length) stack[stack.length - 1].bad = true; }
    else if (!stack.length) continue;
    else { const p = stack[stack.length - 1];
      if (t.t === "str") p.cur = p.cur == null ? t.v : p.cur + t.v;
      else if (t.t === ",") { if (p.cur != null) p.items.push(p.cur); else p.bad = true; p.cur = null; }
      else if (t.t === "+") { /* joined */ }
      else if (t.t === "(" || t.t === ")" || t.t === "{" || t.t === "}") p.bad = true; }
  }
  return res;
}

const CLINICAL = /\b(lactat\w*|mammar\w*|secret(e|ion)\w*|ejaculat\w*|genital\w*|vagina\w*|penis(es)?|semen|urethra\w*|anus|rectum|rectal|uterus|uterine|ovar\w*|testicle\w*|scrotum|areola\w*|labia\w*|intercourse|copulat\w*|orgasm(ic)?|arous(al|ed)|stimulat\w*|insert(ion|ed)?|fluid)\b/i;
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
