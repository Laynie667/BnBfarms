// node tools/belly-preview.mjs [path to BondageClub/Assets/Female3DCG] [out.html]
// Draws the Companion's belly (the block between ">>> belly drawing" and "<<< belly drawing" in extension/src/belly.js)
// over the game's own body pictures, at every size, so the shape can be judged without logging in.
// The body pictures are embedded in the page, so the page works wherever it is opened.
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const A = resolve(process.argv[2] || "../reference/Bondage-College-new/Bondage-College-master/BondageClub/Assets/Female3DCG");
const out = resolve(process.argv[3] || "belly-preview.html");
const src = readFileSync(new URL("../extension/src/belly.js", import.meta.url), "utf8");
const a = src.indexOf("// >>> belly drawing"), b = src.indexOf("// <<< belly drawing");
if (a < 0 || b < 0) throw new Error("the belly drawing block isn't marked in extension/src/belly.js");
const b64 = (p) => "data:image/png;base64," + readFileSync(join(A, p)).toString("base64");
const bodies = [["Small", "White", ""], ["Normal", "White", ""], ["Normal", "White", "AllFours"], ["Normal", "White", "Hogtied"], ["Large", "Asian", ""], ["XLarge", "Black", ""]];
const html = `<!doctype html><meta charset="utf-8"><title>Belly preview</title>
<body style="margin:0;background:#8a8f98;font:13px sans-serif;color:#fff">
<div id="rows"></div>
<script>
${src.slice(a, b)}
const BODIES = ${JSON.stringify(bodies.map(([size, tone, pose]) => ({ label: size + ", " + tone + (pose ? ", " + pose : ""), pose, up: b64("BodyUpper/" + (pose ? pose + "/" : "") + size + "_" + tone + ".png"), low: pose ? "" : b64("BodyLower/" + size + "_" + tone + ".png") })))};
const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = u; });
(async () => {
  for (const B of BODIES) {
    const up = await load(B.up), low = B.low ? await load(B.low) : null;
    const row = document.createElement("div"); row.style.cssText = "display:flex;gap:3px;margin-bottom:3px;align-items:flex-start";
    for (let size = 0; size <= 3; size++) {
      const c = document.createElement("canvas"); c.width = 500; c.height = 700; c.style.cssText = "width:190px;background:#b9bec7";
      const g = c.getContext("2d");
      const behind = !!B.pose;
      if (!behind) { if (up) g.drawImage(up, 0, 0); if (low) g.drawImage(low, 0, 462); }
      if (size) {
        if (behind && up) { const t = document.createElement("canvas"); t.width = 500; t.height = 700; t.getContext("2d").drawImage(up, 0, 0); g.__src = t.getContext("2d"); }
        // the same reading the Companion does: the typical bright skin in a patch from the middle of the torso
        const at = skinPatch(B.pose), d = (g.__src || g).getImageData(at[0], at[1], 48, 40).data, good = [];
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && d[i] + d[i + 1] + d[i + 2] > 90 && Math.min(d[i], d[i + 1], d[i + 2]) < 238) good.push([d[i], d[i + 1], d[i + 2]]);
        good.sort((m, n) => (m[0] + m[1] + m[2]) - (n[0] + n[1] + n[2]));
        const skin = good.length >= 40 ? good[Math.floor(good.length * 0.7)] : FALLBACK.White;
        const cv = bellyCanvas(size, skin, B.pose === "AllFours"), [dx, dy] = bellyPlace(size, 0, 0, cv, B.pose);
        g.drawImage(cv, dx, dy);
      }
      if (behind && up) g.drawImage(up, 0, 0);   // on all fours the chest goes down after the belly, in front of it
      row.appendChild(c);
    }
    const tag = document.createElement("div"); tag.textContent = B.label; tag.style.padding = "4px";
    row.appendChild(tag); document.getElementById("rows").appendChild(row);
  }
  document.title = "Belly preview ready";
})();
</script></body>`;
writeFileSync(out, html);
console.log("wrote", out, Math.round(html.length / 1024) + " KB");
