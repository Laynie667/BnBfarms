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
let trial = 0;                       // 0 off · 1 small · 2 medium · 3 large
const SIZES = [null, { rx: 54, ry: 50 }, { rx: 76, ry: 72 }, { rx: 100, ry: 96 }];
const FALLBACK = { White: [236, 204, 196], Asian: [232, 200, 164], Black: [120, 86, 70] };
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const rgb = (c, k) => "rgb(" + clamp(c[0] * k) + "," + clamp(c[1] * k) + "," + clamp(c[2] * k) + ")";

// the picture: a round belly, lit from the upper left, outlined round the sides and underneath, with a navel
function bellyCanvas(size, skin) {
  const S = SIZES[size], pad = 6, w = S.rx * 2 + pad * 2, hgt = S.ry * 2 + pad * 2, cx = w / 2, cy = hgt / 2;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = hgt;
  const g = cv.getContext("2d");
  // skin, with a soft light on the upper left and a little weight underneath
  const grad = g.createRadialGradient(cx - S.rx * 0.3, cy - S.ry * 0.35, S.rx * 0.1, cx, cy, S.rx * 1.15);
  grad.addColorStop(0, rgb(skin, 1.04)); grad.addColorStop(0.6, rgb(skin, 1)); grad.addColorStop(1, rgb([skin[0], skin[1] * 0.9, skin[2] * 0.9], 0.93));
  g.fillStyle = grad;
  g.beginPath(); g.ellipse(cx, cy, S.rx, S.ry, 0, 0, Math.PI * 2); g.fill();
  // fade the top edge into the ribs so there's no hard line under the chest
  g.globalCompositeOperation = "destination-out";
  { // only where it meets the ribs, in the middle: a round soft patch, no wider than a waist
    const fr = Math.min(S.rx * 0.95, 60);
    g.save(); g.translate(cx, cy - S.ry * 0.95); g.scale(1, (S.ry * 0.85) / fr);
    const fade = g.createRadialGradient(0, 0, fr * 0.25, 0, 0, fr);
    fade.addColorStop(0, "rgba(0,0,0,1)"); fade.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = fade; g.beginPath(); g.arc(0, 0, fr, 0, Math.PI * 2); g.fill(); g.restore(); }
  g.globalCompositeOperation = "source-over";
  // the outline: sides and underneath only, the way the game inks a body
  g.strokeStyle = rgb(skin, 0.28); g.lineWidth = 1.6; g.lineCap = "round";
  g.beginPath(); { const up = [0, 0.1, 0.2, 0.33][size] * Math.PI; g.ellipse(cx, cy, S.rx, S.ry, 0, -up, Math.PI + up); } g.stroke();   // the bigger it is, the further up the sides the line runs
  // a warm blush low on the curve
  const blush = g.createRadialGradient(cx, cy + S.ry * 0.55, 2, cx, cy + S.ry * 0.55, S.rx * 0.8);
  blush.addColorStop(0, "rgba(214,120,120,0.16)"); blush.addColorStop(1, "rgba(214,120,120,0)");
  g.fillStyle = blush; g.beginPath(); g.ellipse(cx, cy, S.rx - 2, S.ry - 2, 0, 0, Math.PI * 2); g.fill();
  // the navel: a small dark notch, pushed out a little on the biggest
  { // the shine the game paints on skin: a soft white streak, upper left
    g.save(); g.translate(cx - S.rx * 0.38, cy - S.ry * 0.12); g.rotate(-0.35);
    const sh = g.createRadialGradient(0, 0, 0, 0, 0, S.rx * 0.34);
    sh.addColorStop(0, "rgba(255,255,255,0.85)"); sh.addColorStop(0.5, "rgba(255,255,255,0.35)"); sh.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sh; g.scale(0.42, 1); g.beginPath(); g.arc(0, 0, S.rx * 0.34, 0, Math.PI * 2); g.fill(); g.restore(); }
  g.strokeStyle = rgb(skin, 0.45); g.lineWidth = 1.4;
  g.beginPath();
  if (size >= 3) g.ellipse(cx, cy + S.ry * 0.18, 4, 3, 0, 0, Math.PI * 2);
  else { g.moveTo(cx, cy + S.ry * 0.12); g.quadraticCurveTo(cx + 2.5, cy + S.ry * 0.2, cx, cy + S.ry * 0.3); }
  g.stroke();
  return cv;
}
// what colour did the game just paint their skin? read it off the canvas, a little under the chest
function skinAt(C, bx, by) {
  try {
    const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL;
    if (gl && typeof gl.readPixels === "function") {
      for (const [dx, dy] of [[222, 416], [278, 416], [214, 402]]) {   // off the centre line: the game paints a white shine down the middle
        const px = new Uint8Array(4);
        gl.readPixels(Math.round(bx + dx), Math.round(gl.canvas.height - (by + dy) - 1), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        if (px[3] > 200 && px[0] + px[1] + px[2] > 90 && Math.min(px[0], px[1], px[2]) < 242) return [px[0], px[1], px[2]];
      }
    }
  } catch (e) { /* fall back to the named colour */ }
  const it = (C.DrawAppearance || C.Appearance || []).find((a) => a && a.Asset && a.Asset.Group && a.Asset.Group.Name === "BodyUpper");
  const col = it && (Array.isArray(it.Color) ? it.Color[0] : it.Color);
  if (typeof col === "string" && /^#[0-9a-fA-F]{6}$/.test(col)) return [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
  return FALLBACK[col] || FALLBACK.White;
}
export function initBelly(mod) {
  try {
    mod.hookFunction("CommonDrawAppearanceBuild", 1, (args, next) => {
      try {
        const C = args[0], cb = args[1];
        if (trial && C && W.Player && C.MemberNumber === W.Player.MemberNumber && cb && typeof cb.drawImage === "function") {
          let upper = null, done = false;
          const after = (src, x, y) => {
            if (done || typeof src !== "string") return;
            if (src.includes("/BodyUpper/")) upper = [x, y];
            if (src.includes("/BodyLower/") && upper) {
              done = true;
              const S = SIZES[trial], cv = bellyCanvas(trial, skinAt(C, upper[0], upper[1]));
              // centred on the navel of the upper-body picture, sittin' lower as it gets bigger
              const dx = upper[0] + 250 - cv.width / 2, dy = upper[1] + 432 + S.ry * 0.22 - cv.height / 2;
              cb.drawImage(cv, dx, dy, {});
              if (typeof cb.drawImageBlink === "function") cb.drawImageBlink(cv, dx, dy, {});
            }
          };
          const wrap = (name) => (typeof cb[name] === "function" ? (src, x, y, o) => { cb[name](src, x, y, o); try { if (!/Blink$/.test(name)) after(src, x, y); } catch (e) { console.warn("[Farmhand Companion] belly:", e); } } : cb[name]);
          args[1] = Object.assign({}, cb, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize") });
        }
      } catch (e) { console.warn("[Farmhand Companion] belly hook:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] belly test unavailable:", e); }
}
// 0 off · 1, 2, 3. Redraws your own character.
export function bellyTrial(n, say) {
  trial = Math.max(0, Math.min(3, Math.round(Number(n)) || 0));
  try { if (W.Player && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(W.Player); } catch (e) { console.warn("[Farmhand Companion] belly redraw:", e); }
  if (say) say(trial ? "Belly test: " + ["", "small", "medium", "large"][trial] + ". Look at your character with nothing over your middle. Only you can see it. Tell Claude how it looks: the shape, the colour match, where it sits." : "Belly test off.");
}
