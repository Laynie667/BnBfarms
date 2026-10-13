/* WHAT'S IN THIS FILE (belly.js)
   THE BELLY TEST (Oct 12). The game has no belly, and its body is one flat picture that can't be stretched in one
   place. So this draws one: a round belly in the game's own flat style, in your own skin colour, laid right over
   the skin and under everything you're wearing. Three sizes, from the buttons at the bottom of Toggles.

   It's a trial to see whether a drawn belly looks good enough to build on. Only you see it, and only on your own
   character: nothing is sent to anybody and nothing about your character is changed. "Off" takes it away.

   How: the game builds a character by drawing its layers one after another (CommonDrawAppearanceBuild). We step in
   right after the lower body is drawn, read the skin colour off what was just painted, and paint the belly there.
*/
const W = window;
const SKIN_TOP = 12;                 // the game's drawing order: everything up to here is skin (the body, nipples, pussy or cock)
let trial = 0;                       // 0 off · 1 small · 2 medium · 3 large
// >>> belly drawing (kept self-contained: tools/belly-preview.mjs lifts this block out to draw a preview)
// rx: half its width at the widest · ry: half its height · sag: how far the weight has dropped (0 = a ball, 0.3 = heavy and low)
const SIZES = [null, { rx: 50, ry: 54, sag: 0.16 }, { rx: 70, ry: 80, sag: 0.22 }, { rx: 92, ry: 112, sag: 0.28 }];
const FALLBACK = { White: [236, 204, 196], Asian: [232, 200, 164], Black: [120, 86, 70] };
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const rgb = (c, k) => "rgb(" + clamp(c[0] * k) + "," + clamp(c[1] * k) + "," + clamp(c[2] * k) + ")";
// A belly has weight (Laynie, Oct 12: "too much of a ball, not enough gravity"). Seen from the front it's a pear: narrow
// where it leaves the ribs, widest well below the middle, and a full round underside that hangs. t runs round the
// outline, 0 at the right, a quarter turn at the bottom.
function bellyPoint(S, cx, cy, t) {
  const sn = Math.sin(t), cs = Math.cos(t);
  const wide = 1 + S.sag * sn - S.sag * 0.55 * (sn < 0 ? sn * sn : 0);   // wider low down, drawn in up top
  const drop = sn > 0 ? 1 + S.sag * 0.35 * sn : 1 - S.sag * 0.25 * -sn;  // the underside hangs a little further than a circle would
  return [cx + S.rx * cs * wide / (1 + S.sag), cy + S.ry * sn * drop / (1 + S.sag * 0.35)];
}
function bellyPath(g, S, cx, cy, from, to) {
  const steps = 72;
  for (let i = 0; i <= steps; i++) { const p = bellyPoint(S, cx, cy, from + (to - from) * i / steps); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }
}
// the picture: lit from the upper left, heavier and warmer underneath, inked round the sides and bottom, with a navel
function bellyCanvas(size, skin) {
  const S = SIZES[size], pad = 6, w = S.rx * 2 + pad * 2, hgt = S.ry * 2 + pad * 2, cx = w / 2, cy = hgt / 2, low = cy + S.ry * 0.28;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = hgt;
  const g = cv.getContext("2d");
  const whole = () => { g.beginPath(); bellyPath(g, S, cx, cy, 0, Math.PI * 2); g.closePath(); };
  // skin: the lightest part sits high on the curve, and it deepens toward the underside where the weight is
  const grad = g.createRadialGradient(cx - S.rx * 0.22, low - S.ry * 0.42, S.rx * 0.1, cx, low, S.ry * 1.05);
  grad.addColorStop(0, rgb(skin, 1.03)); grad.addColorStop(0.55, rgb(skin, 1)); grad.addColorStop(1, rgb([skin[0], skin[1] * 0.93, skin[2] * 0.92], 0.94));
  g.fillStyle = grad; whole(); g.fill();
  // the shadow it throws on itself, underneath
  g.save(); whole(); g.clip();
  const under = g.createLinearGradient(0, low + S.ry * 0.25, 0, cy + S.ry + pad);
  under.addColorStop(0, "rgba(150,70,60,0)"); under.addColorStop(1, "rgba(150,70,60,0.22)");
  g.fillStyle = under; g.fillRect(0, 0, w, hgt);
  // a warm blush low on the curve
  const blush = g.createRadialGradient(cx, low + S.ry * 0.2, 2, cx, low + S.ry * 0.2, S.rx * 0.85);
  blush.addColorStop(0, "rgba(214,120,120,0.14)"); blush.addColorStop(1, "rgba(214,120,120,0)");
  g.fillStyle = blush; g.fillRect(0, 0, w, hgt);
  // the shine the game paints on skin: a soft white streak down the upper left, following the curve
  g.translate(cx - S.rx * 0.36, low - S.ry * 0.3); g.rotate(-0.22);
  const sh = g.createRadialGradient(0, 0, 0, 0, 0, S.ry * 0.36);
  sh.addColorStop(0, "rgba(255,255,255,0.8)"); sh.addColorStop(0.5, "rgba(255,255,255,0.3)"); sh.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = sh; g.scale(0.34, 1); g.beginPath(); g.arc(0, 0, S.ry * 0.36, 0, Math.PI * 2); g.fill();
  g.restore();
  // melt the top into the ribs, in the middle only, so there's no hard line under the chest
  g.globalCompositeOperation = "destination-out";
  { const fr = Math.min(S.rx * 0.9, 56);
    g.save(); g.translate(cx, cy - S.ry * 0.98); g.scale(1, (S.ry * 0.7) / fr);
    const fade = g.createRadialGradient(0, 0, fr * 0.3, 0, 0, fr);
    fade.addColorStop(0, "rgba(0,0,0,1)"); fade.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = fade; g.beginPath(); g.arc(0, 0, fr, 0, Math.PI * 2); g.fill(); g.restore(); }
  g.globalCompositeOperation = "source-over";
  // the ink: round the sides and underneath, the way the game outlines a body; thicker under, where it hangs
  // a small belly is narrower than the waist it sits on, so only its underside is inked: a line up its sides would
  // show as a ring inside the torso. The bigger it gets, the further up the sides the line runs.
  const up = [0, -0.14, 0.02, 0.3][size] * Math.PI;
  g.strokeStyle = rgb(skin, 0.28); g.lineCap = "round"; g.lineJoin = "round";
  g.lineWidth = 1.5; g.beginPath(); bellyPath(g, S, cx, cy, -up, Math.PI + up); g.stroke();
  g.lineWidth = 2.1; g.beginPath(); bellyPath(g, S, cx, cy, Math.PI * 0.2, Math.PI * 0.8); g.stroke();
  // the navel, low, because the weight has pulled it down; pushed out on the biggest
  g.strokeStyle = rgb(skin, 0.45); g.lineWidth = 1.4; g.beginPath();
  const ny = low + S.ry * 0.12;
  if (size >= 3) { g.ellipse(cx, ny, 4.5, 3.2, 0, 0, Math.PI * 2); }
  else { g.moveTo(cx - 0.5, ny - S.ry * 0.07); g.quadraticCurveTo(cx + 3, ny, cx - 0.5, ny + S.ry * 0.07); }
  g.stroke();
  // on the biggest, the faint line that runs down from the navel
  if (size >= 2) { g.strokeStyle = rgb(skin, 0.72); g.lineWidth = 1; g.globalAlpha = 0.45; g.beginPath(); g.moveTo(cx, ny + 6); g.lineTo(cx, cy + S.ry * 0.86); g.stroke(); g.globalAlpha = 1; }
  return cv;
}
// where its top-left corner goes, given where the upper-body picture was drawn: hung from just under the ribs
function bellyPlace(size, upperX, upperY, cv) { const S = SIZES[size]; return [upperX + 250 - cv.width / 2, upperY + 392 + S.ry * 0.62 - cv.height / 2]; }
// <<< belly drawing
// The game keeps every picture it draws in a list it looks things up in BY NAME, and it expects every name to be text.
// Handing it the drawing itself (Oct 12, Companion 0.16.2) put a non-text name in that list, and from then on every
// character refresh crashed in the game's own clean-up (AnimationPurge: "key.startsWith is not a function"): no dressing,
// no restraints, no looking at anybody, till the page was reloaded. So the belly is handed over as a picture address
// (text), one per size and skin colour, and scrubCache() takes out anything that isn't text.
const pictures = new Map();
function bellyPicture(size, skin) {
  const key = size + ":" + skin.map((v) => Math.round(v / 4) * 4).join(",");
  let p = pictures.get(key);
  if (!p) { const cv = bellyCanvas(size, skin); p = { url: cv.toDataURL("image/png"), width: cv.width, height: cv.height }; if (pictures.size > 24) pictures.clear(); pictures.set(key, p); }
  return p;
}
export function scrubCache() {
  let n = 0;
  try { for (const name of ["DrawImageCache", "GLDrawImageCache"]) { const m = W[name]; if (m && typeof m.forEach === "function" && typeof m.delete === "function") { const bad = []; m.forEach((v, k) => { if (typeof k !== "string") bad.push(k); }); for (const k of bad) { m.delete(k); n++; } } } } catch (e) { /* not a plain list in this version: leave it */ }
  return n;
}
// what colour did the game just paint their skin? read it off the canvas, a little under the chest
// Readin' a pixel back off the screen makes the graphics card stop and wait, and the map redraws characters a lot
// (Laynie, Oct 12: "the map just loads a lot slower"). So the colour is read once for each body and skin, and kept.
const skinSeen = new Map();
function skinFor(C, bx, by) {
  const it = (C.DrawAppearance || C.Appearance || []).find((x) => x && x.Asset && x.Asset.Group && x.Asset.Group.Name === "BodyUpper");
  const key = it ? it.Asset.Name + "|" + JSON.stringify(it.Color || "") : "?";
  let c = skinSeen.get(key);
  if (!c) { c = skinAt(C, bx, by); if (skinSeen.size > 12) skinSeen.clear(); skinSeen.set(key, c); }
  return c;
}
function skinAt(C, bx, by) {
  try {
    const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL;
    if (gl && typeof gl.readPixels === "function") {
      // One block out of the middle of the torso. A single point near the waist's edge landed on the body's own
      // shading (seen live: the belly came out a shade too tan), so take a patch and use its typical bright skin:
      // not the white shine down the centre line, and not the darker edges.
      const bw = 48, bh = 40, px = new Uint8Array(bw * bh * 4);
      gl.readPixels(Math.round(bx + 226), Math.round(gl.canvas.height - (by + 388) - bh), bw, bh, gl.RGBA, gl.UNSIGNED_BYTE, px);
      const good = [];
      for (let i = 0; i < px.length; i += 4) if (px[i + 3] > 200 && px[i] + px[i + 1] + px[i + 2] > 90 && Math.min(px[i], px[i + 1], px[i + 2]) < 238) good.push([px[i], px[i + 1], px[i + 2]]);
      if (good.length >= 40) { good.sort((m, n) => (m[0] + m[1] + m[2]) - (n[0] + n[1] + n[2])); return good[Math.floor(good.length * 0.7)]; }
    }
  } catch (e) { /* fall back to the named colour */ }
  const it = (C.DrawAppearance || C.Appearance || []).find((a) => a && a.Asset && a.Asset.Group && a.Asset.Group.Name === "BodyUpper");
  const col = it && (Array.isArray(it.Color) ? it.Color[0] : it.Color);
  if (typeof col === "string" && /^#[0-9a-fA-F]{6}$/.test(col)) return [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
  return FALLBACK[col] || FALLBACK.White;
}
let hooked = false, sdk = null;
export function initBelly(mod) { sdk = mod; setTimeout(scrubCache, 4000); }   // nothin' is hooked until the test is switched on
function hookBelly(mod) {
  if (hooked || !mod) return; hooked = true;
  try {
    mod.hookFunction("CommonDrawAppearanceBuild", 1, (args, next) => {
      let finish = null;
      try {
        const C = args[0], cb = args[1];
        if (trial && C && W.Player && C.MemberNumber === W.Player.MemberNumber && cb && typeof cb.drawImage === "function") {
          // WHERE in the stack it goes (Oct 12, seen live: "the layers between the legs and belly clip now and then").
          // The game draws skin first, in this order: chest and arms (7), marks on the skin (8), hips and legs (9), nipples (11),
          // what's between the legs (12). Clothes and gear come after (13 and up). The belly used to go in right after the legs,
          // so the pussy or cock was painted over the bottom of it. Now it waits for all the skin: it goes in just before the
          // first thing that isn't skin, or at the very end on a bare body.
          let upper = null, lower = false, done = false;
          const prio = (src) => { const m = new RegExp("/Assets/[^/]+/([^/]+)/").exec(src); if (!m) return 99; try { const g = W.AssetGroupGet && W.AssetGroupGet(C.AssetFamily, m[1]); return g && typeof g.DrawingPriority === "number" ? g.DrawingPriority : 99; } catch (e) { return 99; } };
          const paint = () => {
            if (done || !upper || !lower) return; done = true;
            const S = SIZES[trial], cv = bellyPicture(trial, skinFor(C, upper[0], upper[1]));   // { url, width, height }: a picture the game can cache by name
            const [dx, dy] = bellyPlace(trial, upper[0], upper[1], cv);
            cb.drawImage(cv.url, dx, dy, {});
            if (typeof cb.drawImageBlink === "function") cb.drawImageBlink(cv.url, dx, dy, {});
          };
          const before = (src) => { if (!done && lower && typeof src === "string" && prio(src) > SKIN_TOP) paint(); };
          const after = (src, x, y) => { if (typeof src !== "string") return; if (src.includes("/BodyUpper/")) upper = [x, y]; if (src.includes("/BodyLower/")) lower = true; };
          const wrap = (name) => (typeof cb[name] === "function" ? (src, x, y, o) => { try { before(src); } catch (e) { console.warn("[Farmhand Companion] belly:", e); } cb[name](src, x, y, o); try { after(src, x, y); } catch (e) { console.warn("[Farmhand Companion] belly:", e); } } : cb[name]);
          args[1] = Object.assign({}, cb, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize") });
          finish = paint;   // (a bare body: nothin' comes after the skin, so it goes in at the very end)
        }
      } catch (e) { console.warn("[Farmhand Companion] belly hook:", e); }
      const out = next(args);   // the game's own drawing, called once, whatever happened above
      if (finish) { try { finish(); } catch (e) { console.warn("[Farmhand Companion] belly:", e); } }
      return out;
    });
  } catch (e) { console.warn("[Farmhand Companion] belly test unavailable:", e); }
}
// 0 off · 1, 2, 3. Redraws your own character.
export function bellyTrial(n, say) {
  trial = Math.max(0, Math.min(3, Math.round(Number(n)) || 0));
  scrubCache();
  if (trial) hookBelly(sdk);
  const redraw = () => { try { if (W.Player && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(W.Player); } catch (e) { console.warn("[Farmhand Companion] belly redraw:", e); } };
  redraw(); setTimeout(redraw, 500); setTimeout(redraw, 1800);   // (the game loads a new picture a moment after it's first asked for)
  if (say) say(trial ? "Belly test: " + ["", "small", "medium", "large"][trial] + ". Look at your character with nothing over your middle. Only you can see it. Tell Claude how it looks: the shape, the colour match, where it sits." : "Belly test off.");
}
