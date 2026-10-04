// node tools/who-audit.mjs
// Lists every say(...) / emote(...) in the bot and add-ons that doesn't say who the line is about.
// Those fall back to guessing from the names in the text (aboutWhom), which is how lines end up with the
// wrong person. Each one listed should pass its person explicitly: emote(text, who) / say(text, urgent, who).
import { readFileSync, readdirSync, existsSync } from "node:fs";

const files = readdirSync("bot/src/parts").filter((f) => f.endsWith(".js")).map((f) => "bot/src/parts/" + f)
  .concat(readdirSync("addons").filter((d) => !d.startsWith("_") && existsSync("addons/" + d + "/index.js")).map((d) => "addons/" + d + "/index.js"));

const rows = [];
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const re = /\b(api\.|A\.|c\.api\.)?(emote|say)\(/g;
  let m;
  while ((m = re.exec(src))) {
    const before = src.slice(Math.max(0, m.index - 10), m.index);
    if (/function\s*$/.test(before)) continue;                  // the definitions themselves
    if (!m[1] && /[\w$]\.\s*$/.test(before)) continue;           // someone else's .say / .emote
    let i = m.index + m[0].length, depth = 1, args = 1, inStr = null;
    for (; i < src.length && depth > 0; i++) {
      const ch = src[i];
      if (inStr) { if (ch === "\\") { i++; continue; } if (ch === inStr) inStr = null; continue; }
      if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
      if ("([{".includes(ch)) depth++;
      else if (")]}".includes(ch)) depth--;
      else if (ch === "," && depth === 1) args++;
    }
    const needs = m[2] === "emote" ? args < 2 : args < 3;
    if (needs) rows.push(f + ":" + src.slice(0, m.index).split("\n").length + "  " + m[2] + "  " + src.slice(m.index, Math.min(i, m.index + 110)).replace(/\s+/g, " "));
  }
}
console.log(rows.length + " calls don't say who they're about");
for (const r of rows) console.log(r);
