// THE FARM'S LINES, READ FROM THE SOURCE (Nov 4, Phase 5 of the plan). Shared by tools/pool-audit.mjs (the full report)
// and tests/lines.test.cjs (the line checker every release runs): every pool of lines is an array of three or more
// strings, wherever it's written, in the bot's parts or in a part of its own (addons/).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// every .js file under these folders
export function sourceFiles(...dirs) {
  const files = [];
  const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) { if (n !== "node_modules") walk(p); } else if (/\.(m?js|cjs)$/.test(n)) files.push(p); } };
  for (const d of dirs) walk(d);
  return files;
}
// every pool in a file, and the line each starts on
export function poolsIn(file) {
  const src = readFileSync(file, "utf8");
  return pools(src).map((p) => ({ at: src.slice(0, p.at).split("\n").length, lines: p.lines }));
}

// ── a small tokenizer: string literals and brackets, skipping comments and regexes ──
export function tokens(src) {
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
export function pools(src) {
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

// (not "orgasm": Laynie, Nov 4, of a line reworded to dodge it: "misleading and super vague. it was honestly better with
// the word orgasm". A plain, exact word beats a vague one.)
export const CLINICAL = /\b(lactat\w*|mammar\w*|secret(e|ion)\w*|ejaculat\w*|genital\w*|vagina\w*|penis(es)?|semen|urethra\w*|anus|rectum|rectal|uterus|uterine|ovar\w*|testicle\w*|scrotum|areola\w*|labia\w*|intercourse|copulat\w*|arous(al|ed)|stimulat\w*|insert(ion|ed)?|fluid)\b/i;

// THE RULES EVERY LINE KEEPS (a release stops on any of these). Softer things, like a body word a line doesn't tag or
// a "her" that might be the farm girl, are the audit's to list: only somebody readin' the line can say.
const TAGS = "nv|nc|nt|fu|fb|nb|ok|v|c|t|f|m";
const LEAD = new RegExp("^(?:\\[[a-z]+\\])*(?:\\{(?:" + TAGS + ")\\})+");   // ([cow] and the like in front: the wash's own picks, 10ug-wash.js)
export const MUST = [
  ["a clinical word", (l) => CLINICAL.test(l)],
  ["the same little word twice", (l) => /\b(the|a|an|and|to|of|in|on|is|its|their|they|them|with|at|for|as|but|or|by|from|into|over|was|be)\s+\1\b/i.test(l)],   // (not "it": "tells it it's done")
  ["a {tag} that would show (not at the front)", (l) => new RegExp("\\{(?:" + TAGS + ")\\}").test(l.replace(LEAD, ""))],
  ["a {tag} the bot doesn't know", (l) => /^\{[a-z]{1,3}\}/.test(l) && !LEAD.test(l)],
  ["an odd number of quote marks", (l) => ((l.match(/"/g) || []).length % 2) === 1],
  ["\"undefined\" or the like", (l) => /\bundefined\b|\bNaN\b|\[object Object\]/.test(l)],
];
// a string long enough to be a line someone reads (an item name or a keyword isn't), the same as the audit counts
export const isLine = (s) => typeof s === "string" && s.length > 25 && /[a-z]/.test(s) && / /.test(s);
export const mustFix = (line) => MUST.filter(([, test]) => test(String(line))).map(([name]) => name);
