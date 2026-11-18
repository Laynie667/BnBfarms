/* WHAT'S IN THIS FILE (shared/ink/live-art.js)
   MADE BY A SCRIPT from the tattoo sheets' own drawing (studio/web/_refs/tattoos/tattoos7.html): the shapes, the
   letters and the farm's logo, so the live designs (live.js) are drawn in the game exactly as they were on the sheets.
   Don't edit it by hand: change the sheets, then make it again (docs/TATTOOS.md says how).
   Two changes from the sheets: the logo loads from the repo, and fonts go through fontOf (live.js sets which fonts).
*/
/* eslint-disable */
const LOGO_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/shared/brand/";
let FONT_OF = (f) => "'" + f + "'";
export function setFontOf(fn) { FONT_OF = fn; }
const fontOf = (f) => FONT_OF(f);
// FARM TATTOOS, a first sheet for Laynie to look over (Nov 17): text in real tattoo styles, the farm's own trap words,
// suggestive shapes, on three skin tones. Ink drawn dark and a little soft, then laid into the skin (multiply), the way
// a tattoo sits. Each card says where it would go.
const INK = "#16121c", PINK = "#d4237a", RED = "#b3122e";
const CW = 380, CH = 250;

function rng(seed) { let s = seed >>> 0; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967295; }
// ── the shapes ──
function heart(g, x, y, s) { g.beginPath(); g.moveTo(x, y + s * 0.35); g.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.45, y - s * 1.05, x, y - s * 0.45); g.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s, y - s * 0.4, x, y + s * 0.35); g.closePath(); }
function paw(g, x, y, s) { g.beginPath(); g.ellipse(x, y + s * 0.25, s * 0.42, s * 0.34, 0, 0, Math.PI * 2); g.fill(); for (const [dx, dy] of [[-0.48, -0.28], [-0.17, -0.55], [0.17, -0.55], [0.48, -0.28]]) { g.beginPath(); g.ellipse(x + dx * s, y + dy * s, s * 0.15, s * 0.19, dx * 0.6, 0, Math.PI * 2); g.fill(); } }
function hoof(g, x, y, s) { g.beginPath(); g.ellipse(x - s * 0.22, y, s * 0.2, s * 0.36, -0.15, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x + s * 0.22, y, s * 0.2, s * 0.36, 0.15, 0, Math.PI * 2); g.fill(); }
function horseshoe(g, x, y, s) { const r = s * 0.55; g.lineWidth = s * 0.24; g.lineCap = "butt"; g.beginPath(); g.arc(x, y, r, -Math.PI * 0.1, Math.PI * 1.1, false); g.stroke(); const fs = g.fillStyle; g.fillStyle = "#fff"; for (let i = 0; i < 6; i++) { const a = -Math.PI * 0.02 + i * (Math.PI * 1.04 / 5); g.beginPath(); g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, s * 0.04, 0, Math.PI * 2); g.fill(); } g.fillStyle = fs; }
function arrowDown(g, x, y, len, w) { g.lineWidth = w; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + len); g.stroke(); g.beginPath(); g.moveTo(x - w * 2.6, y + len - w * 2.6); g.lineTo(x, y + len + w * 0.8); g.lineTo(x + w * 2.6, y + len - w * 2.6); g.stroke(); }
function tally(g, x, y, n, h) { g.lineWidth = 3.2; g.lineCap = "round"; for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), k = i % 5, gx = x + grp * (h * 0.95); if (k < 4) { g.beginPath(); g.moveTo(gx + k * h * 0.17, y); g.lineTo(gx + k * h * 0.17 + 2, y + h); g.stroke(); } else { g.beginPath(); g.moveTo(gx - h * 0.08, y + h * 0.85); g.lineTo(gx + h * 0.62, y + h * 0.12); g.stroke(); } } }
function barcode(g, x, y, w, h, seed) { const r = rng(seed); let cx = x; while (cx < x + w) { const bw = 1 + Math.floor(r() * 4); if (r() > 0.35) g.fillRect(cx, y, bw, h); cx += bw + 1; } }
function crown(g, x, y, s) { g.beginPath(); g.moveTo(x - s, y); g.lineTo(x - s, y - s * 0.6); g.lineTo(x - s * 0.5, y - s * 0.2); g.lineTo(x, y - s * 0.85); g.lineTo(x + s * 0.5, y - s * 0.2); g.lineTo(x + s, y - s * 0.6); g.lineTo(x + s, y); g.closePath(); g.fill(); }
function flame(g, x, y, s) { g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x - s * 0.6, y - s * 0.3, x - s * 0.2, y - s * 0.7, x, y - s * 1.2); g.bezierCurveTo(x + s * 0.15, y - s * 0.7, x + s * 0.65, y - s * 0.5, x, y); g.fill(); }
function tentacle(g, x, y, s, dir) { const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * Math.PI * 1.6; pts.push([x + dir * (s * 1.1 * t + Math.sin(a) * s * 0.18 * t), y - s * 0.95 * t + Math.cos(a * 1.4) * s * 0.1 * t, s * 0.16 * (1 - t) + 2]); } const fs = g.fillStyle; for (const [px, py, r] of pts) { g.beginPath(); g.arc(px, py, r, 0, Math.PI * 2); g.fill(); } g.fillStyle = "#fff"; for (let i = 4; i < 44; i += 6) { const [px, py, r] = pts[i]; g.beginPath(); g.arc(px + dir * r * 0.15, py + r * 0.55, r * 0.32, 0, Math.PI * 2); g.fill(); } g.fillStyle = fs; }
function knotBulb(g, x, y, w, h) { const L = x - w, R = x + w; g.beginPath(); g.moveTo(L, y - h * 0.32); g.lineTo(L + w * 0.35, y - h * 0.32); g.bezierCurveTo(L + w * 0.42, y - h * 1.1, L + w * 0.9, y - h * 1.1, L + w * 0.95, y - h * 0.4); g.lineTo(R - w * 0.25, y - h * 0.34); g.quadraticCurveTo(R, y - h * 0.3, R + h * 0.2, y); g.quadraticCurveTo(R, y + h * 0.3, R - w * 0.25, y + h * 0.34); g.lineTo(L + w * 0.95, y + h * 0.4); g.bezierCurveTo(L + w * 0.9, y + h * 1.1, L + w * 0.42, y + h * 1.1, L + w * 0.35, y + h * 0.32); g.lineTo(L, y + h * 0.32); g.closePath(); g.fill(); }
// the womb crest: a heart for a womb, horns curlin' out, and arrows that point down
function wombCrest(g, x, y, s, col) {
  g.strokeStyle = col; g.fillStyle = col; g.lineCap = "round"; g.lineJoin = "round";
  g.lineWidth = s * 0.06; heart(g, x, y, s * 0.42); g.stroke();
  g.lineWidth = s * 0.035; heart(g, x, y + s * 0.02, s * 0.26); g.stroke();
  for (const d of [-1, 1]) {
    g.lineWidth = s * 0.05; g.beginPath(); g.moveTo(x + d * s * 0.3, y - s * 0.12);
    g.bezierCurveTo(x + d * s * 0.75, y - s * 0.38, x + d * s * 1.05, y - s * 0.05, x + d * s * 0.92, y + s * 0.18);
    g.bezierCurveTo(x + d * s * 0.85, y + s * 0.3, x + d * s * 0.68, y + s * 0.28, x + d * s * 0.7, y + s * 0.15); g.stroke();
    g.lineWidth = s * 0.03; g.beginPath(); g.moveTo(x + d * s * 0.36, y + s * 0.12); g.quadraticCurveTo(x + d * s * 0.7, y + s * 0.42, x + d * s * 1.12, y + s * 0.22); g.stroke();
    g.beginPath(); g.arc(x + d * s * 1.15, y + s * 0.2, s * 0.04, 0, Math.PI * 2); g.fill();
  }
  g.lineWidth = s * 0.035; arrowDown(g, x, y + s * 0.42, s * 0.28, s * 0.035);
  for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x, y - s * 0.62 - i * s * 0.1, s * (0.03 - i * 0.007), 0, Math.PI * 2); g.fill(); }
}
// letters along a rainbow arc (a tramp stamp's curve): textY is where the middle of the words sits
function arcText(g, t, cx, textY, R, font, size) {
  g.font = size + "px " + fontOf(font); g.textAlign = "center"; g.textBaseline = "middle";
  const span = g.measureText(t).width / R, cy = textY + R; let a = -Math.PI / 2 - span / 2;
  for (const ch of t) { const da = g.measureText(ch).width / R, mid = a + da / 2; g.save(); g.translate(cx + Math.cos(mid) * R, cy + Math.sin(mid) * R); g.rotate(mid + Math.PI / 2); g.fillText(ch, 0, 0); g.restore(); a += da; }
}
function snout(g, x, y, s) { g.lineWidth = s * 0.12; g.beginPath(); g.ellipse(x, y, s, s * 0.72, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.ellipse(x - s * 0.33, y, s * 0.16, s * 0.26, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x + s * 0.33, y, s * 0.16, s * 0.26, 0, 0, Math.PI * 2); g.fill(); }
function text(g, t, x, y, font, size, opt) {
  opt = opt || {}; g.font = (opt.weight || "") + " " + size + "px " + fontOf(font); g.textAlign = opt.align || "center"; g.textBaseline = "middle";
  let s = size; while (opt.max && g.measureText(t).width > opt.max && s > 10) { s -= 2; g.font = (opt.weight || "") + " " + s + "px " + fontOf(font); }
  if (opt.stroke) { g.lineWidth = opt.stroke; g.strokeStyle = opt.strokeColor || INK; g.lineJoin = "round"; g.strokeText(t, x, y); }
  g.fillText(t, x, y);
  return s;
}
function drips(g, x0, x1, y, seed, n) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), len = 6 + r() * 22; g.lineWidth = 2 + r() * 2.5; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + len); g.stroke(); g.beginPath(); g.arc(x, y + len, g.lineWidth * 0.7, 0, Math.PI * 2); g.fill(); } }

// ── sheet two: tattoos that keep count, the traps' own brands, and new styles ──
// a seared brand: the shape raised and healin' (dark edge, angry core, a shine on top), not ink
function scar(g, ink, x0, y0) {
  const w = ink.width, h = ink.height, tint = (col, blur, dx, dy, a) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const cg = c.getContext("2d"); cg.filter = blur ? "blur(" + blur + "px)" : "none"; cg.drawImage(ink, 0, 0); cg.filter = "none"; cg.globalCompositeOperation = "source-in"; cg.fillStyle = col; cg.fillRect(0, 0, w, h); g.globalAlpha = a; g.drawImage(c, x0 + dx, y0 + dy); g.globalAlpha = 1; };
  tint("#5e1414", 3, 0, 1, 0.75); tint("#b4524a", 0.6, 0, 0, 0.95); tint("#f2b9a8", 0.8, -1, -1.4, 0.45);
}
// glow ink: shows bright while you're dosed (a UV look)
function glow(g, ink, x0, y0, col) {
  const c = document.createElement("canvas"); c.width = ink.width; c.height = ink.height; const cg = c.getContext("2d"); cg.drawImage(ink, 0, 0); cg.globalCompositeOperation = "source-in"; cg.fillStyle = col; cg.fillRect(0, 0, c.width, c.height);
  g.save(); g.shadowColor = col; g.shadowBlur = 18; g.drawImage(c, x0, y0); g.shadowBlur = 8; g.drawImage(c, x0, y0); g.restore();
}
// stick-and-poke: letters made of little dots, a bit wobbly
function poked(g, t, x, y, font, size, seed) {
  const c = document.createElement("canvas"); c.width = 380; c.height = 250; const cg = c.getContext("2d"); cg.fillStyle = "#000"; text(cg, t, x, y, font, size, { max: 340 });
  const d = cg.getImageData(0, 0, c.width, c.height).data, r = rng(seed);
  for (let yy = 0; yy < c.height; yy += 3) for (let xx = 0; xx < c.width; xx += 3) if (d[(yy * c.width + xx) * 4 + 3] > 120 && r() > 0.15) { g.beginPath(); g.arc(xx + (r() - 0.5) * 1.6, yy + (r() - 0.5) * 1.6, 1.3 + r() * 0.6, 0, Math.PI * 2); g.fill(); }
}
function cowSpots(g, x, y, w, h, seed) { const r = rng(seed); for (let i = 0; i < 7; i++) { g.beginPath(); const cx = x + r() * w, cy = y + r() * h, rr = 10 + r() * 20; for (let k = 0; k <= 12; k++) { const a = k / 12 * Math.PI * 2, q = rr * (0.7 + r() * 0.5); if (k) g.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q); else g.moveTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q); } g.closePath(); g.fill(); } }
function egg(g, x, y, s) { g.beginPath(); g.ellipse(x, y, s * 0.36, s * 0.48, 0, 0, Math.PI * 2); g.fill(); }
function jug(g, x, y, s) { g.beginPath(); g.moveTo(x - s * 0.3, y - s * 0.55); g.lineTo(x + s * 0.3, y - s * 0.55); g.lineTo(x + s * 0.32, y - s * 0.35); g.quadraticCurveTo(x + s * 0.55, y - s * 0.1, x + s * 0.5, y + s * 0.5); g.lineTo(x - s * 0.5, y + s * 0.5); g.quadraticCurveTo(x - s * 0.55, y - s * 0.1, x - s * 0.32, y - s * 0.35); g.closePath(); g.fill(); }
function padlock(g, x, y, s) { g.lineWidth = s * 0.14; g.beginPath(); g.arc(x, y - s * 0.25, s * 0.32, Math.PI, 0); g.stroke(); heart(g, x, y + s * 0.38, s * 0.62); g.fill(); const fs = g.fillStyle; g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y + s * 0.18, s * 0.08, 0, Math.PI * 2); g.fill(); g.fillRect(x - s * 0.03, y + s * 0.2, s * 0.06, s * 0.18); g.fillStyle = fs; }
function key(g, x, y, s) { g.lineWidth = s * 0.1; g.beginPath(); g.arc(x, y, s * 0.22, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(x + s * 0.22, y); g.lineTo(x + s * 0.95, y); g.lineTo(x + s * 0.95, y + s * 0.18); g.moveTo(x + s * 0.75, y); g.lineTo(x + s * 0.75, y + s * 0.14); g.stroke(); }
function target(g, x, y, s) { g.lineWidth = s * 0.07; for (const k of [1, 0.68, 0.36]) { g.beginPath(); g.arc(x, y, s * k, 0, Math.PI * 2); g.stroke(); } g.beginPath(); g.arc(x, y, s * 0.12, 0, Math.PI * 2); g.fill(); }
function pigRing(g, x, y, s) { g.lineWidth = s * 0.12; g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.stroke(); snout(g, x, y, s * 0.55); }
function wolfMark(g, x, y, s) { g.lineWidth = s * 0.12; g.beginPath(); g.arc(x, y, s, Math.PI * 0.62, Math.PI * 1.88); g.arc(x + s * 0.32, y - s * 0.12, s * 0.78, Math.PI * 1.75, Math.PI * 0.72, true); g.closePath(); g.stroke(); paw(g, x - s * 0.15, y + s * 0.08, s * 0.5); }
function daggers(g, x, y, s) { g.lineWidth = s * 0.09; g.lineCap = "round"; for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x - d * s * 0.7, y - s * 0.7); g.lineTo(x + d * s * 0.55, y + s * 0.55); g.stroke(); g.beginPath(); g.moveTo(x + d * s * 0.32 - s * 0.18, y + s * 0.32 + d * s * 0.18 * 0); g.lineTo(x + d * s * 0.32 + s * 0.18, y + s * 0.32); g.stroke(); } }

// ── sheet three: the B&B mark itself, its lewd variations, and more of the farm's brands ──
// the farm's own logo (shared/brand), cut into pieces: the whole mark, the full sign, just the BB, just the bell
const IMG = {};
function loadImg(src) { return new Promise((res) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }); }
function crop(img, sx, sy, sw, sh, erase) { const c = document.createElement("canvas"); c.width = sw; c.height = sh; const cg = c.getContext("2d"); cg.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh); if (erase) { cg.globalCompositeOperation = "destination-out"; for (const [x, y, w, h] of erase) cg.fillRect(x - sx, y - sy, w, h); } return c; }
async function loadLogo() {
  const mark = await loadImg(LOGO_HOST + "brand-mark.png"), full = await loadImg(LOGO_HOST + "brand-full.png");
  IMG.mark = mark; IMG.full = full;
  IMG.letters = crop(mark, 0, 0, 205, 168, [[154, 121, 14, 15], [149, 135, 60, 40], [140, 148, 20, 30]]);   // the BB, the bell's chain wiped off
  IMG.bell = crop(mark, 128, 150, 66, 70);
  IMG.bellOnly = crop(mark, 128, 158, 66, 62);   // without its chain
  // one B for each: the two lean on each other, so they're cut apart along the slant between them
  const GAP = [[112, 0], [112, 30], [113, 72], [110, 84], [107, 96], [105, 108], [101, 120], [96, 128], [90, 168]];
  const half = (left) => { const c = document.createElement("canvas"); c.width = 205; c.height = 168; const cg = c.getContext("2d"); cg.beginPath(); cg.moveTo(left ? 0 : 205, 0); for (const [x, y] of GAP) cg.lineTo(x, y); cg.lineTo(left ? 0 : 205, 168); cg.closePath(); cg.clip(); cg.drawImage(IMG.letters, 0, 0); return c; };
  IMG.b1 = half(true); IMG.b2 = half(false);
}
// ── the farm's biggest drawn cup (R), the very shape studio/web/breasts-drawing.js draws: heavy, hangin', pressed together ──
function bigS(apart) { const i = 14, k = 1, r = 44 + 2.6 * i, sag = 0.06 + 0.22 * k, top = 1.34 + 0.16 * k; return { k, r, sag, top, bx: r * (1.03 - 0.13 * k) * (apart || 1), by: r * top }; }
function titPt(S, s, t) {
  const sn = Math.sin(t), cs = Math.cos(t);
  if (sn >= 0) return [s * S.bx + S.r * cs * (1 + S.sag * 0.30 * sn * sn) + s * S.r * 0.06 * S.k * sn * sn, S.by + S.r * sn * (1 + S.sag)];
  const up = -sn; return [s * S.bx + S.r * cs * (1 - 0.50 * up * up) - s * S.r * 0.20 * up * up, S.by - S.r * S.top * up];
}
// part of the outline: (in turns of the circle, for the right one; the left one is its mirror) the outer slope, the bottom, up the inside
function titArc(g, S, s, ox, oy, sc, a0, a1) { g.beginPath(); for (let j = 0; j <= 120; j++) { let t = (a0 + (a1 - a0) * j / 120) * Math.PI; if (s < 0) t = Math.PI - t; const p = titPt(S, s, t), X = ox + p[0] * sc, Y = oy + p[1] * sc; if (j) g.lineTo(X, Y); else g.moveTo(X, Y); } }
function titPath(g, S, s, ox, oy, sc) { g.beginPath(); for (let j = 0; j <= 160; j++) { const p = titPt(S, s, j / 160 * Math.PI * 2), X = ox + p[0] * sc, Y = oy + p[1] * sc; if (j) g.lineTo(X, Y); else g.moveTo(X, Y); } g.closePath(); }
function ownSide(g, s, ox, f) { g.save(); g.beginPath(); if (s < 0) g.rect(-9999, -9999, 9999 + ox, 99999); else g.rect(ox, -9999, 9999, 99999); g.clip(); f(); g.restore(); }
// letters that drip: every drip starts at a real bottom edge of the ink above it
const DRIPS = [];
function dripFrom(g, w, h, x0, x1, seed, n) {
  const data = g.getImageData(0, 0, w, h).data, r = rng(seed), lows = [];
  for (let x = x0; x < x1; x += 3) { for (let y = h - 1; y > 0; y--) if (data[(y * w + x) * 4 + 3] > 140) { lows.push([x, y]); break; } }
  const picked = []; for (const [x, y] of lows) if (r() < n / lows.length * 1.6 && !picked.some(([px]) => Math.abs(px - x) < 16)) picked.push([x, y]);
  DRIPS.length = 0;
  for (const [x, y] of picked) {
    // a fat, soft run: it gathers wide at the edge, runs a little narrower, and swells into a round drop at the end
    const wd = 8 + r() * 6, len = r() < 0.3 ? 4 + r() * 8 : 16 + Math.pow(r(), 1.4) * 58, wob = (r() - 0.5) * 3;
    g.beginPath();
    g.moveTo(x - wd * 1.5, y - 2);
    g.quadraticCurveTo(x - wd * 0.5, y, x - wd * 0.45, y + Math.min(len, wd * 1.2));
    g.bezierCurveTo(x - wd * 0.42 + wob, y + len * 0.6, x - wd * 0.5, y + len * 0.85, x - wd * 0.62, y + len);
    g.arc(x, y + len, wd * 0.62, Math.PI, 0, true);
    g.bezierCurveTo(x + wd * 0.5, y + len * 0.85, x + wd * 0.42 + wob, y + len * 0.6, x + wd * 0.45, y + Math.min(len, wd * 1.2));
    g.quadraticCurveTo(x + wd * 0.5, y, x + wd * 1.5, y - 2);
    g.closePath(); g.fill();
    DRIPS.push([x, y, wd, len]);
  }
}
// draw a piece of the logo as solid ink in any colour, centred, h tall
function logo(g, which, cx, cy, h, col) {
  const src = IMG[which], s = h / src.height, w = src.width * s;
  const c = document.createElement("canvas"); c.width = Math.ceil(w); c.height = Math.ceil(h); const cg = c.getContext("2d");
  cg.drawImage(src, 0, 0, w, h); cg.globalCompositeOperation = "source-in"; cg.fillStyle = col || INK; cg.fillRect(0, 0, c.width, c.height);
  g.drawImage(c, cx - w / 2, cy - h / 2); return w;
}
// words along the bottom of a circle, readin' left to right and upright (a stamp's lower edge)
function arcTextLow(g, t, cx, textY, R, font, size) {
  g.font = size + "px " + fontOf(font); g.textAlign = "center"; g.textBaseline = "middle";
  const span = g.measureText(t).width / R, cy = textY - R; let a = Math.PI / 2 + span / 2;
  for (const ch of t) { const da = g.measureText(ch).width / R, mid = a - da / 2; g.save(); g.translate(cx + Math.cos(mid) * R, cy + Math.sin(mid) * R); g.rotate(mid - Math.PI / 2); g.fillText(ch, 0, 0); g.restore(); a -= da; }
}
// a dog bone, like the one under the sign
function boneShape(g, cx, cy, w, h) {
  const r = h * 0.36, L = cx - w / 2 + r, R = cx + w / 2 - r;
  g.beginPath(); g.rect(L, cy - h * 0.3, R - L, h * 0.6);
  for (const [x, y] of [[L, cy - h * 0.26], [L, cy + h * 0.26], [R, cy - h * 0.26], [R, cy + h * 0.26]]) { g.moveTo(x + r, y); g.arc(x, y, r, 0, Math.PI * 2); }
}
function boneOutline(g, cx, cy, w, h, lw) {
  boneShape(g, cx, cy, w, h); g.fill("nonzero");
  g.save(); g.globalCompositeOperation = "destination-out"; boneShape(g, cx, cy, w - lw * 2, h - lw * 2); g.fill("nonzero"); g.restore();
}
function cut(g, f) { g.save(); g.globalCompositeOperation = "destination-out"; f(); g.restore(); }
// a cattle ear tag: a little tab with a hole, a wide body
function earTag(g, cx, top, w, h) {
  g.beginPath(); g.roundRect(cx - w * 0.18, top, w * 0.36, h * 0.34, 14); g.roundRect(cx - w / 2, top + h * 0.24, w, h * 0.76, 26);
}
// a prize rosette: ribbon tails, a frilled ring, a plain middle
function rosette(g, cx, cy, r, ring, tails, mid) {
  g.fillStyle = tails;
  for (const d of [-1, 1]) { g.beginPath(); g.moveTo(cx + d * r * 0.15, cy + r * 0.3); g.lineTo(cx + d * r * 0.75, cy + r * 1.55); g.lineTo(cx + d * r * 0.45, cy + r * 1.35); g.lineTo(cx + d * r * 0.25, cy + r * 1.62); g.lineTo(cx - d * r * 0.2, cy + r * 0.45); g.closePath(); g.fill(); }
  g.fillStyle = ring; for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86, r * 0.2, 0, Math.PI * 2); g.fill(); }
  g.beginPath(); g.arc(cx, cy, r * 0.88, 0, Math.PI * 2); g.fill();
  g.fillStyle = mid; g.beginPath(); g.arc(cx, cy, r * 0.62, 0, Math.PI * 2); g.fill();
}
// the curly bits either side of a tramp stamp
function flourish(g, x, y, s, d) {
  g.lineCap = "round"; g.lineWidth = s * 0.07;
  g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + d * s * 0.6, y - s * 0.5, x + d * s * 1.2, y + s * 0.3, x + d * s * 1.6, y - s * 0.1);
  g.bezierCurveTo(x + d * s * 1.8, y - s * 0.25, x + d * s * 1.65, y - s * 0.45, x + d * s * 1.5, y - s * 0.32); g.stroke();
  g.lineWidth = s * 0.045; g.beginPath(); g.moveTo(x + d * s * 0.3, y + s * 0.12); g.bezierCurveTo(x + d * s * 0.8, y + s * 0.55, x + d * s * 1.3, y + s * 0.45, x + d * s * 1.55, y + s * 0.22); g.stroke();
  g.beginPath(); g.arc(x + d * s * 1.62, y + s * 0.2, s * 0.06, 0, Math.PI * 2); g.fill();
}

// ── new ways for ink to sit in the skin ──
// an inspection stamp: purple, patchy where the stamp didn't take
function stamp(g, ink, x0, y0, col, seed) {
  const c = document.createElement("canvas"); c.width = ink.width; c.height = ink.height; const cg = c.getContext("2d");
  cg.drawImage(ink, 0, 0); cg.globalCompositeOperation = "source-in"; cg.fillStyle = col; cg.fillRect(0, 0, c.width, c.height);
  cg.globalCompositeOperation = "destination-out"; const r = rng(seed);
  for (let i = 0; i < 1400; i++) { cg.globalAlpha = 0.3 + r() * 0.7; cg.beginPath(); cg.arc(r() * c.width, r() * c.height, 0.5 + r() * 1.8, 0, Math.PI * 2); cg.fill(); }
  for (let i = 0; i < 5; i++) { cg.globalAlpha = 0.18 + r() * 0.2; cg.fillRect(0, r() * c.height, c.width, 6 + r() * 16); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.9; g.drawImage(c, x0, y0); g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
}
// a paddle's welt: red and swollen, where the cut-out letters stay pale
function welt(g, ink, x0, y0) {
  const w = ink.width, h = ink.height, tint = (col, blur, a, op) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const cg = c.getContext("2d"); cg.filter = blur ? "blur(" + blur + "px)" : "none"; cg.drawImage(ink, 0, 0); cg.filter = "none"; cg.globalCompositeOperation = "source-in"; cg.fillStyle = col; cg.fillRect(0, 0, w, h); g.globalCompositeOperation = op || "source-over"; g.globalAlpha = a; g.drawImage(c, x0, y0); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; };
  tint("#c22f3a", 9, 0.55, "multiply"); tint("#d8434c", 3, 0.5, "multiply"); tint("#ff8f8a", 2, 0.22);
}

// ── sheet four: lewd brands, the farm's paperwork inked on skin, and a few new styles ──
function upArrow(g, x, y0, y1, wd) { g.lineWidth = wd; g.lineCap = "butt"; g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y0 + wd * 2); g.stroke(); g.beginPath(); g.moveTo(x - wd * 2.4, y0 + wd * 2.6); g.lineTo(x, y0); g.lineTo(x + wd * 2.4, y0 + wd * 2.6); g.closePath(); g.fill(); }
function star(g, x, y, r) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; if (i) g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); else g.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.closePath(); }
function drop(g, x, y, s) { g.beginPath(); g.moveTo(x, y - s); g.bezierCurveTo(x + s * 0.2, y - s * 0.5, x + s * 0.7, y - s * 0.05, x + s * 0.7, y + s * 0.35); g.arc(x, y + s * 0.35, s * 0.7, 0, Math.PI); g.bezierCurveTo(x - s * 0.7, y - s * 0.05, x - s * 0.2, y - s * 0.5, x, y - s); g.closePath(); g.fill(); }
function lips(g, x, y, s, rot) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath(); g.moveTo(-s, 0); g.bezierCurveTo(-s * 0.6, -s * 0.55, -s * 0.25, -s * 0.6, 0, -s * 0.28); g.bezierCurveTo(s * 0.25, -s * 0.6, s * 0.6, -s * 0.55, s, 0); g.bezierCurveTo(s * 0.5, -s * 0.1, -s * 0.5, -s * 0.1, -s, 0); g.fill();
  g.beginPath(); g.moveTo(-s, s * 0.03); g.bezierCurveTo(-s * 0.5, s * 0.1, s * 0.5, s * 0.1, s, s * 0.03); g.bezierCurveTo(s * 0.6, s * 0.66, -s * 0.6, s * 0.66, -s, s * 0.03); g.fill();
  g.globalCompositeOperation = "destination-out"; g.lineWidth = Math.max(1, s * 0.035); g.lineCap = "round";   // the little creases a real kiss leaves
  for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(i * s * 0.17, s * 0.14); g.lineTo(i * s * 0.2, s * 0.44); g.stroke(); g.beginPath(); g.moveTo(i * s * 0.15, -s * 0.1); g.lineTo(i * s * 0.18, -s * 0.34); g.stroke(); }
  g.restore();
}
function care(g, kind, x, y) {   // laundry-tag symbols
  g.lineWidth = 2.6; g.lineJoin = "round";
  if (kind === "tub") { g.beginPath(); g.moveTo(x - 17, y - 9); g.lineTo(x - 13, y + 12); g.lineTo(x + 13, y + 12); g.lineTo(x + 17, y - 9); g.stroke(); g.beginPath(); g.moveTo(x - 15, y - 4); g.quadraticCurveTo(x - 8, y - 9, x - 2, y - 4); g.quadraticCurveTo(x + 6, y + 1, x + 15, y - 4); g.stroke(); g.font = "bold 11px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("69", x, y + 5); }
  if (kind === "noBleach") { g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x + 15, y + 12); g.lineTo(x - 15, y + 12); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(x - 15, y - 12); g.lineTo(x + 15, y + 14); g.moveTo(x + 15, y - 12); g.lineTo(x - 15, y + 14); g.stroke(); }
  if (kind === "tumble") { g.strokeRect(x - 13, y - 13, 26, 26); g.beginPath(); g.arc(x, y, 9, 0, Math.PI * 2); g.stroke(); for (const d of [-3, 3]) { g.beginPath(); g.arc(x + d, y, 1.6, 0, Math.PI * 2); g.fill(); } }
  if (kind === "noDry") { g.strokeRect(x - 13, y - 13, 26, 26); g.beginPath(); g.moveTo(x - 13, y - 13); g.lineTo(x + 13, y + 13); g.moveTo(x + 13, y - 13); g.lineTo(x - 13, y + 13); g.stroke(); }
}
function qr(g, x, y, cell, seed) {   // looks like one, scans as nothin' (a made-up pattern, not a real code)
  const N = 21, r = rng(seed), finder = (cx, cy) => { g.fillRect(x + cx * cell, y + cy * cell, 7 * cell, 7 * cell); g.save(); g.globalCompositeOperation = "destination-out"; g.fillRect(x + (cx + 1) * cell, y + (cy + 1) * cell, 5 * cell, 5 * cell); g.restore(); g.fillRect(x + (cx + 2) * cell, y + (cy + 2) * cell, 3 * cell, 3 * cell); };
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const inF = (i < 8 && j < 8) || (i > N - 9 && j < 8) || (i < 8 && j > N - 9); if (!inF && r() < 0.48) g.fillRect(x + i * cell, y + j * cell, cell, cell); }
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
}

// ── sheet five: old-school colour flash for the herd, trophies that keep score, signs and stickers, new styles ──
const YEL = "#efc02a", YEL2 = "#c4950f", GRN = "#3f8a2e", RED2 = "#d42020";
// an old-school banner: a curved band with notched tails tucked behind it
function banner(g, cx, cy, bw, bh, col, tail, t, font, size) {
  const L = cx - bw / 2, R = cx + bw / 2;
  for (const d of [-1, 1]) { const x0 = d < 0 ? L : R; g.beginPath(); g.moveTo(x0 - d * 12, cy - bh * 0.15); g.lineTo(x0 + d * bh * 1.05, cy - bh * 0.15); g.lineTo(x0 + d * bh * 0.62, cy + bh * 0.38); g.lineTo(x0 + d * bh * 1.05, cy + bh * 0.9); g.lineTo(x0 - d * 12, cy + bh * 0.9); g.closePath(); g.fillStyle = tail; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.lineJoin = "round"; g.stroke(); }
  g.beginPath(); g.moveTo(L, cy - bh / 2); g.quadraticCurveTo(cx, cy - bh / 2 - 12, R, cy - bh / 2); g.lineTo(R, cy + bh / 2); g.quadraticCurveTo(cx, cy + bh / 2 - 12, L, cy + bh / 2); g.closePath();
  g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
  g.fillStyle = INK; text(g, t, cx, cy - 5, font, size, { max: bw - 22 });
}
// a canine cock, pointed tip, the knot swellin' near the base (L long, laid along angle a from its base at x, y)
function canine(g, x, y, L, a) {
  const hh = L * 0.13, pt = (u, v) => [x + Math.cos(a) * u - Math.sin(a) * v, y + Math.sin(a) * u + Math.cos(a) * v];
  const P = []; const M = (u, v) => P.push(pt(u, v));
  g.beginPath(); let p = pt(0, -hh * 0.7); g.moveTo(p[0], p[1]);
  const seg = (c1, c2, e) => { const a1 = pt(...c1), a2 = pt(...c2), b = pt(...e); g.bezierCurveTo(a1[0], a1[1], a2[0], a2[1], b[0], b[1]); };
  seg([L * 0.04, -hh * 1.6], [L * 0.26, -hh * 1.7], [L * 0.32, -hh * 0.82]);   // the knot, top
  seg([L * 0.55, -hh * 0.9], [L * 0.86, -hh * 0.62], [L, 0]);                // the shaft, taperin' to the tip
  seg([L * 0.86, hh * 0.62], [L * 0.55, hh * 0.9], [L * 0.32, hh * 0.82]);
  seg([L * 0.26, hh * 1.7], [L * 0.04, hh * 1.6], [0, hh * 0.7]);
  g.closePath();
}
// fill a shape, then outline it in black: the old-school way
function flash(g, path, col, lw) { path(); g.fillStyle = col; g.fill(); path(); g.strokeStyle = INK; g.lineWidth = lw || 4; g.lineJoin = "round"; g.stroke(); }
function speckle(g, seed, n, w, h) { const r = rng(seed); g.save(); g.globalCompositeOperation = "destination-out"; for (let i = 0; i < n; i++) { g.globalAlpha = 0.4 + r() * 0.6; g.beginPath(); g.arc(r() * w, r() * h, 0.5 + r() * 1.6, 0, Math.PI * 2); g.fill(); } g.restore(); }
function paisley(g, x, y, s, rot) {
  g.save(); g.translate(x, y); g.rotate(rot);
  const shape = (k) => { g.beginPath(); g.moveTo(0, -s * k); g.bezierCurveTo(s * 0.95 * k, -s * 0.85 * k, s * 0.9 * k, s * 0.65 * k, 0, s * 0.72 * k); g.bezierCurveTo(-s * 0.72 * k, s * 0.75 * k, -s * 0.82 * k, 0, -s * 0.22 * k, -s * 0.22 * k); g.quadraticCurveTo(-s * 0.04 * k, -s * 0.5 * k, 0, -s * k); };
  g.lineWidth = 2.6; shape(1); g.stroke(); g.lineWidth = 1.5; shape(0.62); g.stroke(); g.beginPath(); g.arc(s * 0.08, s * 0.12, s * 0.12, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 9; i++) { const a = -0.3 + i * 0.36; g.beginPath(); g.arc(Math.cos(a) * s * 1.05 + s * 0.1, Math.sin(a) * s * 1.0 + s * 0.05, 1.5, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
function leaf(g, x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(s * 0.5, -s * 0.45, s, 0); g.quadraticCurveTo(s * 0.5, s * 0.45, 0, 0); g.fill(); g.restore(); }
function blossom(g, x, y, s, petals) { g.lineWidth = 1.8; for (let i = 0; i < (petals || 8); i++) { const a = i / (petals || 8) * Math.PI * 2; g.beginPath(); g.ellipse(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.42, s * 0.2, a, 0, Math.PI * 2); g.stroke(); } g.beginPath(); g.arc(x, y, s * 0.18, 0, Math.PI * 2); g.fill(); }

// ── sheet six: the species brands (one shield for every kind of stock), old-school parodies, bondage ink, labels ──
function shield(g, cx, cy, W, H) { const t = cy - H / 2, L = cx - W / 2, R = cx + W / 2; g.beginPath(); g.moveTo(L + 14, t); g.lineTo(R - 14, t); g.quadraticCurveTo(R, t, R, t + 14); g.lineTo(R, cy + H * 0.1); g.quadraticCurveTo(R - 8, cy + H * 0.36, cx, cy + H / 2); g.quadraticCurveTo(L + 8, cy + H * 0.36, L, cy + H * 0.1); g.lineTo(L, t + 14); g.quadraticCurveTo(L, t, L + 14, t); g.closePath(); }
// every species brand is the same shield: the animal's mark up top, its word under it
function speciesBrand(word, icon) { return (g, w, h) => { const cx = w / 2, cy = h / 2 + 2; g.fillStyle = INK; g.strokeStyle = INK; g.lineWidth = 8; shield(g, cx, cy, 172, 206); g.stroke(); icon(g, cx, cy - 30); text(g, word, cx, cy + 44, "Black Ops One", 29, { max: 132 }); }; }
const ICON = {
  cow: (g, x, y) => { for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x + d * 18, y - 18); g.quadraticCurveTo(x + d * 58, y - 22, x + d * 52, y - 56); g.quadraticCurveTo(x + d * 44, y - 30, x + d * 12, y - 6); g.closePath(); g.fill(); g.beginPath(); g.ellipse(x + d * 40, y - 4, 16, 7, d * 0.35, 0, Math.PI * 2); g.fill(); }
    g.beginPath(); g.ellipse(x, y + 4, 26, 30, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x, y + 28, 23, 14, 0, 0, Math.PI * 2); g.fill();
    cut(g, () => { for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 9, y + 29, 3.6, 5, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(x + d * 12, y - 2, 3.6, 0, Math.PI * 2); g.fill(); } }); },
  horse: (g, x, y) => { g.lineCap = "butt"; g.lineWidth = 22; g.beginPath(); g.arc(x, y - 4, 36, -0.12 * Math.PI, 1.12 * Math.PI); g.stroke(); cut(g, () => { for (let i = 0; i < 6; i++) { const a = -0.03 * Math.PI + i * (1.06 * Math.PI / 5); g.beginPath(); g.arc(x + Math.cos(a) * 36, y - 4 + Math.sin(a) * 36, 3.6, 0, Math.PI * 2); g.fill(); } }); },
  dog: (g, x, y) => paw(g, x, y + 4, 72),
  pig: (g, x, y) => { g.beginPath(); g.ellipse(x, y, 42, 30, 0, 0, Math.PI * 2); g.fill(); cut(g, () => { for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 13, y, 6.5, 11, 0, 0, Math.PI * 2); g.fill(); } }); },
  fox: (g, x, y) => { g.beginPath(); g.moveTo(x - 30, y + 34); g.bezierCurveTo(x - 64, y - 6, x - 16, y - 56, x + 44, y - 42); g.bezierCurveTo(x + 6, y - 30, x - 22, y - 2, x - 8, y + 34); g.closePath(); g.fill(); cut(g, () => { g.lineWidth = 3; g.beginPath(); g.moveTo(x + 10, y - 50); g.lineTo(x + 4, y - 40); g.lineTo(x + 14, y - 36); g.lineTo(x + 8, y - 26); g.stroke(); }); },
  bunny: (g, x, y) => { for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 15, y - 26, 10, 30, d * 0.18, 0, Math.PI * 2); g.fill(); } g.beginPath(); g.ellipse(x, y + 16, 32, 26, 0, 0, Math.PI * 2); g.fill(); cut(g, () => { for (const d of [-1, 1]) { g.beginPath(); g.arc(x + d * 12, y + 12, 3.6, 0, Math.PI * 2); g.fill(); } heart(g, x, y + 24, 5); g.fill(); }); },
  cat: (g, x, y) => { g.beginPath(); g.ellipse(x, y + 8, 38, 30, 0, 0, Math.PI * 2); g.fill(); for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x + d * 36, y - 6); g.lineTo(x + d * 38, y - 40); g.lineTo(x + d * 8, y - 18); g.closePath(); g.fill(); }
    cut(g, () => { for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 14, y + 4, 4, 7, 0, 0, Math.PI * 2); g.fill(); } g.beginPath(); g.moveTo(x - 5, y + 16); g.lineTo(x + 5, y + 16); g.lineTo(x, y + 21); g.closePath(); g.fill(); g.lineWidth = 2; for (const d of [-1, 1]) for (const k of [-1, 1]) { g.beginPath(); g.moveTo(x + d * 14, y + 22 + k * 3); g.lineTo(x + d * 34, y + 20 + k * 7); g.stroke(); } }); },
  dragon: (g, x, y) => { g.beginPath(); g.moveTo(x - 44, y + 26); g.lineTo(x - 30, y - 36); g.lineTo(x + 48, y - 44); g.quadraticCurveTo(x + 30, y - 14, x + 40, y + 4); g.quadraticCurveTo(x + 14, y + 2, x + 16, y + 30); g.quadraticCurveTo(x - 10, y + 16, x - 44, y + 26); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x - 30, y - 36); g.lineTo(x - 38, y - 50); g.lineTo(x - 22, y - 40); g.closePath(); g.fill(); cut(g, () => { g.lineWidth = 3; g.beginPath(); g.moveTo(x - 28, y - 32); g.lineTo(x + 36, y + 2); g.moveTo(x - 30, y - 28); g.lineTo(x + 14, y + 26); g.stroke(); }); },
};
function swallow(g, x, y, s, flip) {
  g.save(); g.translate(x, y); g.scale(flip ? -1 : 1, 1);
  const body = () => { g.beginPath(); g.moveTo(s * 0.9, -s * 0.02); g.quadraticCurveTo(s * 0.62, -s * 0.3, s * 0.28, -s * 0.2); g.quadraticCurveTo(-s * 0.1, -s * 0.12, -s * 0.42, -s * 0.06); g.lineTo(-s * 1.25, -s * 0.36); g.lineTo(-s * 0.7, s * 0.03); g.lineTo(-s * 1.2, s * 0.3); g.lineTo(-s * 0.38, s * 0.14); g.quadraticCurveTo(s * 0.35, s * 0.34, s * 0.9, -s * 0.02); g.closePath(); };
  const wing = () => { g.beginPath(); g.moveTo(s * 0.3, -s * 0.18); g.quadraticCurveTo(s * 0.0, -s * 0.95, -s * 0.75, -s * 1.05); g.quadraticCurveTo(-s * 0.35, -s * 0.6, -s * 0.18, -s * 0.08); g.closePath(); };
  flash(g, body, "#2a5fb0", 3); g.save(); body(); g.clip(); g.fillStyle = "#d8261f"; g.beginPath(); g.ellipse(s * 0.3, s * 0.14, s * 0.42, s * 0.2, 0.15, 0, Math.PI * 2); g.fill(); g.restore(); body(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
  flash(g, wing, "#2a5fb0", 3); g.fillStyle = INK; g.beginPath(); g.arc(s * 0.6, -s * 0.12, s * 0.05, 0, Math.PI * 2); g.fill();
  g.restore();
}
function rope(g, pts) {   // a rope: straight between its ties, outlined, with the lay twisting along it
  const seg = (f) => { for (let i = 0; i < pts.length - 1; i++) f(pts[i], pts[i + 1]); };
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = INK; g.lineWidth = 11; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) g.lineTo(p[0], p[1]); g.stroke();
  cut(g, () => { g.lineWidth = 6.5; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) g.lineTo(p[0], p[1]); g.stroke(); });
  g.lineWidth = 1.6; seg(([x0, y0], [x1, y1]) => { const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L; for (let t = 5; t < L - 3; t += 7) { const x = x0 + ux * t, y = y0 + uy * t; g.beginPath(); g.moveTo(x - uy * 4 - ux * 2.5, y + ux * 4 - uy * 2.5); g.lineTo(x + uy * 4 + ux * 2.5, y - ux * 4 + uy * 2.5); g.stroke(); } });
}
function tie(g, x, y) { g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, 9, 7, 0.3, 0, Math.PI * 2); g.fill(); cut(g, () => { g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 5, y - 3); g.lineTo(x + 5, y + 3); g.stroke(); }); }

// ── sheet seven: the rest of the species, womb crests that glow, the corruption's marks, and write-your-own ──
Object.assign(ICON, {
  goat: (g, x, y) => { g.lineCap = "round"; g.lineWidth = 9; for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x + d * 10, y - 22); g.bezierCurveTo(x + d * 18, y - 56, x + d * 50, y - 54, x + d * 46, y - 22); g.stroke(); g.beginPath(); g.ellipse(x + d * 32, y - 6, 15, 6, d * 0.4, 0, Math.PI * 2); g.fill(); }
    g.beginPath(); g.moveTo(x - 20, y - 18); g.quadraticCurveTo(x, y - 30, x + 20, y - 18); g.quadraticCurveTo(x + 18, y + 18, x + 8, y + 30); g.lineTo(x - 8, y + 30); g.quadraticCurveTo(x - 18, y + 18, x - 20, y - 18); g.fill();
    g.beginPath(); g.moveTo(x - 8, y + 26); g.lineTo(x + 8, y + 26); g.lineTo(x, y + 50); g.closePath(); g.fill(); cut(g, () => { for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 9, y - 4, 4, 2.6, 0, 0, Math.PI * 2); g.fill(); } }); },
  sheep: (g, x, y) => { for (const [dx, dy, r] of [[-28, -24, 15], [-12, -34, 16], [8, -35, 16], [26, -26, 15], [36, -10, 12], [-36, -10, 12]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, Math.PI * 2); g.fill(); }
    g.beginPath(); g.ellipse(x, y + 8, 20, 28, 0, 0, Math.PI * 2); g.fill(); for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 30, y + 4, 14, 6, d * 0.3, 0, Math.PI * 2); g.fill(); }
    cut(g, () => { g.lineWidth = 2.5; for (const [dx, dy] of [[-20, -26], [0, -34], [20, -26]]) { g.beginPath(); g.arc(x + dx, y + dy, 6, 0.2, 2.8); g.stroke(); } for (const d of [-1, 1]) { g.beginPath(); g.arc(x + d * 8, y + 2, 3.2, 0, Math.PI * 2); g.fill(); } }); },
  wolf: (g, x, y) => { g.beginPath(); g.moveTo(x, y + 40); g.lineTo(x - 14, y + 26); g.lineTo(x - 34, y + 10); g.lineTo(x - 40, y - 8); g.lineTo(x - 36, y - 48); g.lineTo(x - 16, y - 26); g.lineTo(x, y - 30); g.lineTo(x + 16, y - 26); g.lineTo(x + 36, y - 48); g.lineTo(x + 40, y - 8); g.lineTo(x + 34, y + 10); g.lineTo(x + 14, y + 26); g.closePath(); g.fill();
    cut(g, () => { for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x + d * 8, y - 4); g.lineTo(x + d * 24, y - 10); g.lineTo(x + d * 20, y - 2); g.closePath(); g.fill(); } g.beginPath(); g.ellipse(x, y + 30, 6, 4, 0, 0, Math.PI * 2); g.fill(); }); },
  deer: (g, x, y) => { for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 32, y - 22, 20, 10, d * -0.5, 0, Math.PI * 2); g.fill(); }
    g.beginPath(); g.moveTo(x - 22, y - 24); g.quadraticCurveTo(x, y - 36, x + 22, y - 24); g.quadraticCurveTo(x + 24, y + 4, x + 8, y + 36); g.quadraticCurveTo(x, y + 42, x - 8, y + 36); g.quadraticCurveTo(x - 24, y + 4, x - 22, y - 24); g.fill();
    cut(g, () => { for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * 11, y - 8, 4, 5.5, 0, 0, Math.PI * 2); g.fill(); } for (const [dx, dy] of [[-6, -22], [6, -24], [0, -14]]) { g.beginPath(); g.arc(x + dx, y + dy, 2.2, 0, Math.PI * 2); g.fill(); } }); },
  rat: (g, x, y) => { g.beginPath(); g.ellipse(x - 4, y + 4, 34, 22, -0.1, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(x + 22, y - 10); g.quadraticCurveTo(x + 48, y - 4, x + 54, y + 8); g.quadraticCurveTo(x + 40, y + 18, x + 22, y + 18); g.fill(); g.beginPath(); g.arc(x + 22, y - 14, 11, 0, Math.PI * 2); g.fill();
    g.lineWidth = 4; g.lineCap = "round"; g.beginPath(); g.moveTo(x - 36, y + 8); g.bezierCurveTo(x - 64, y + 10, x - 60, y - 30, x - 34, y - 34); g.stroke(); cut(g, () => { g.beginPath(); g.arc(x + 36, y + 2, 2.6, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(x + 22, y - 14, 5, 0, Math.PI * 2); g.fill(); }); },
  goblin: (g, x, y) => { g.beginPath(); g.moveTo(x - 26, y + 30); g.quadraticCurveTo(x - 30, y - 2, x - 10, y - 14); g.lineTo(x + 50, y - 46); g.lineTo(x + 34, y - 18); g.lineTo(x + 42, y - 14); g.quadraticCurveTo(x + 18, y + 26, x - 26, y + 30); g.closePath(); g.fill();
    cut(g, () => { g.beginPath(); g.moveTo(x - 6, y + 6); g.quadraticCurveTo(x + 8, y - 10, x + 30, y - 22); g.lineWidth = 4; g.stroke(); }); g.lineWidth = 3.5; g.beginPath(); g.arc(x - 18, y + 38, 8, 0, Math.PI * 2); g.stroke(); },
});
// the corruption: dark veins creepin' out from the words, branchin' as they go
function veins(g, x, y, ang, len, wd, depth, r) {
  if (depth <= 0 || len < 4) return;
  let px = x, py = y, a = ang; g.lineCap = "round";
  for (let i = 0; i < 6; i++) { a += (r() - 0.5) * 0.7; const nx = px + Math.cos(a) * len / 6, ny = py + Math.sin(a) * len / 6; g.lineWidth = Math.max(0.6, wd * (1 - i / 7)); g.beginPath(); g.moveTo(px, py); g.lineTo(nx, ny); g.stroke(); px = nx; py = ny; if (r() < 0.32) veins(g, px, py, a + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.6), len * 0.55, wd * 0.6, depth - 1, r); }
}
function corrupted(lines, size, seed) { return (g, w, h) => { const C = "#3a0d52", r = rng(seed); g.fillStyle = C; g.strokeStyle = C;
  const ys = lines.length === 1 ? [h / 2] : [h / 2 - size * 0.55, h / 2 + size * 0.55]; let maxW = 0;
  lines.forEach((t, i) => { const s = text(g, t, w / 2, ys[i], "Pirata One", size, { max: 320 }); g.font = s + "px 'Pirata One'"; maxW = Math.max(maxW, g.measureText(t).width); });
  const top = ys[0] - size * 0.42, bot = ys[ys.length - 1] + size * 0.42, L = w / 2 - maxW / 2, R = w / 2 + maxW / 2;
  for (let i = 0; i < 11; i++) { const side = r(); let x, y, a; if (side < 0.35) { x = L + r() * (R - L); y = top; a = -Math.PI / 2; } else if (side < 0.7) { x = L + r() * (R - L); y = bot; a = Math.PI / 2; } else if (side < 0.85) { x = L; y = top + r() * (bot - top); a = Math.PI; } else { x = R; y = top + r() * (bot - top); a = 0; } veins(g, x, y, a + (r() - 0.5) * 0.8, 20 + r() * 30, 2.6, 2, r); }
}; }
function ownWords(t, font, size, col, extra) { return (g, w, h) => { g.fillStyle = col || INK; g.strokeStyle = col || INK; text(g, t, w / 2, h / 2, font, size, { max: 330 }); if (extra) extra(g, w, h); }; }

const PINKGLOW = "#ff4fd8";

export { CH, CW, DRIPS, GRN, ICON, IMG, INK, PINK, PINKGLOW, RED, RED2, YEL, YEL2, arcText, arcTextLow, arrowDown, banner, barcode, bigS, blossom, boneOutline, boneShape, canine, care, corrupted, cowSpots, crop, crown, cut, daggers, dripFrom, drips, drop, earTag, egg, flame, flash, flourish, glow, heart, hoof, horseshoe, jug, key, knotBulb, leaf, lips, loadImg, loadLogo, logo, ownSide, ownWords, padlock, paisley, paw, pigRing, poked, qr, rng, rope, rosette, scar, shield, snout, speciesBrand, speckle, stamp, star, swallow, tally, target, tentacle, text, tie, titArc, titPath, titPt, upArrow, veins, welt, wolfMark, wombCrest };
