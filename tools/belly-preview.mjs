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
const bodies = [["Small", "White"], ["Normal", "White"], ["Large", "Asian"], ["XLarge", "Black"]];
const html = `<!doctype html><meta charset="utf-8"><title>Belly preview</title>
<body style="margin:0;background:#8a8f98;font:13px sans-serif;color:#fff">
<div id="rows"></div>
<script>
${src.slice(a, b)}
const BODIES = ${JSON.stringify(bodies.map(([size, tone]) => ({ label: size + ", " + tone, up: b64("BodyUpper/" + size + "_" + tone + ".png"), low: b64("BodyLower/" + (size === "XLarge" ? "XLarge" : size) + "_" + tone + ".png") })))};
const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = u; });
(async () => {
  for (const B of BODIES) {
    const up = await load(B.up), low = await load(B.low);
    const row = document.createElement("div"); row.style.cssText = "display:flex;gap:3px;margin-bottom:3px;align-items:flex-start";
    for (let size = 0; size <= 3; size++) {
      const c = document.createElement("canvas"); c.width = 500; c.height = 700; c.style.cssText = "width:190px;background:#b9bec7";
      const g = c.getContext("2d");
      if (up) g.drawImage(up, 0, 0); if (low) g.drawImage(low, 0, 462);
      if (size) {
        // the same reading the Companion does: the typical bright skin in a patch from the middle of the torso
        const d = g.getImageData(226, 388, 48, 40).data, good = [];
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && d[i] + d[i + 1] + d[i + 2] > 90 && Math.min(d[i], d[i + 1], d[i + 2]) < 238) good.push([d[i], d[i + 1], d[i + 2]]);
        good.sort((m, n) => (m[0] + m[1] + m[2]) - (n[0] + n[1] + n[2]));
        const skin = good.length >= 40 ? good[Math.floor(good.length * 0.7)] : FALLBACK.White;
        const cv = bellyCanvas(size, skin), [dx, dy] = bellyPlace(size, 0, 0, cv);
        g.drawImage(cv, dx, dy);
      }
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
