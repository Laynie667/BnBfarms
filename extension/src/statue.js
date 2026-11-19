/* THE STATUE SERUM (The Farmhand's Dispensary, Nov 18). Laynie approved the defaults: body and hair only; stone,
   porcelain, gold, black latex, marble or bronze; the brand turns with the skin; half an hour; arousal frozen (that
   part's the Dispensary's). Then: "it needs to work on the cock and balls too" (it does: they're skin), and the eyes,
   "glass is great".
   While it's in somebody, their skin and their hair are drawn in the material: the game's own body pictures, the drawn
   belly, breasts and cock (body-engine.js marks those "skin"), the lips, the brows and the hair. Each one is shaded from
   its own light and dark, so it keeps its shape, and the same on any skin colour. Their eyes are glass set in the material:
   the whites turn, the iris keeps its colour. Blush and tears go (stone doesn't blush). Their ink is cut into the material (shared/ink/ink.js asks here). Clothes and
   everything worn stay as they are.
   Your Companion tells the room ("statue": { mat, left }) when it starts and ends, and when you come into a room, so
   everybody with one sees it. The farm bot's own account draws nobody this way (its PC has the farm to run). */
import { makeMsg } from "../../shared/protocol.js";
import { BOT_MEMBER } from "./config.js";
import { warnSome } from "./warn.js";

const W = window;
export const MATS = ["stone", "porcelain", "gold", "latex", "marble", "bronze"];
// what turns, what goes, by the game's own folder for the picture
const TURN = /^(BodyUpper|BodyLower|ArmsLeft|ArmsRight|HandsLeft|HandsRight|Head|Nipples|Pussy|Mouth|BodyMarkings)$/, HAIR = /^(HairFront|HairBack|Eyebrows)$/, EYES = /^(Eyes|Eyes2)$/;
const HIDE = /^(Blush|Fluids)$/;
// the group's folder: the first one after Female3DCG/, past an override's own two (Echo's body is
// Female3DCG/Override/EchoV2/BodyUpper/...; a pose is BodyLower/Kneel/...)
const groupOf = (src) => { const i = src.indexOf("/Female3DCG/"); if (i < 0) return ""; const seg = src.slice(i + 12).split("/"); seg.pop(); if (seg[0] === "Override") seg.splice(0, 2); return seg[0] || ""; };
const onBot = () => !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
const others = new Map();   // member number → { mat, until }

// ── the materials: a colour for every shade (t: 0 the picture's darkest, about 0.9 its lit skin, 1 its brightest) ──
const RAMPS = {
  stone:     [[0, 40, 38, 36], [0.45, 96, 92, 88], [0.8, 150, 145, 138], [0.92, 172, 167, 159], [1, 200, 195, 187]],
  marble:    [[0, 110, 106, 102], [0.5, 196, 192, 186], [0.85, 232, 229, 224], [1, 250, 248, 245]],
  porcelain: [[0, 104, 112, 130], [0.5, 200, 206, 218], [0.86, 238, 240, 246], [0.97, 252, 252, 255], [1, 255, 255, 255]],
  gold:      [[0, 60, 34, 4], [0.35, 140, 92, 16], [0.7, 214, 162, 44], [0.9, 246, 208, 96], [1, 255, 246, 200]],
  bronze:    [[0, 44, 24, 12], [0.4, 120, 70, 34], [0.75, 182, 112, 56], [0.92, 226, 166, 104], [1, 246, 208, 160]],
  latex:     [[0, 4, 4, 6], [0.55, 16, 16, 20], [0.8, 34, 34, 42], [0.92, 90, 90, 104], [1, 220, 220, 232]],
};
// how each one's light falls: a curve on t (metal and latex shine harder), and what its ink is cut in
const CURVE = { stone: (t) => t, marble: (t) => t, porcelain: (t) => Math.pow(t, 0.9), gold: (t) => Math.pow(t, 1.35), bronze: (t) => Math.pow(t, 1.25), latex: (t) => Math.pow(t, 2.4) };
const ramp = (R, t) => {
  for (let k = 1; k < R.length; k++) if (t <= R[k][0]) { const a = R[k - 1], b = R[k], f = (t - a[0]) / (b[0] - a[0] || 1); return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f]; }
  const z = R[R.length - 1]; return [z[1], z[2], z[3]];
};
// a little grain and mottling for stone, veins for marble: from where on her the pixel is, so they run on across
// pictures. Worked out once, on a 512 square that repeats (a whole body's worth of noise per picture would stall a frame).
const hash = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) & 0xffff) / 0xffff; };
const smooth = (x, y, p) => { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), w = (v) => ((v % p) + p) % p;
  const a = hash(w(xi), w(yi)), b = hash(w(xi + 1), w(yi)), c = hash(w(xi), w(yi + 1)), d = hash(w(xi + 1), w(yi + 1)); return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy; };
const T = 512, FIELDS = {};
function field(mat) {
  if (FIELDS[mat]) return FIELDS[mat];
  const f = new Float32Array(T * T);
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
    const i = y * T + x;
    if (mat === "stone") f[i] = (hash(x, y) - 0.5) * 16 + (smooth(x / 16, y / 16, T / 16) * 0.6 + smooth(x / 8, y / 8, T / 8) * 0.4 - 0.5) * 24;
    else if (mat === "marble") { const n = smooth(x / 64, y / 64, T / 64) * 0.6 + smooth(x / 32, y / 32, T / 32) * 0.3 + smooth(x / 16, y / 16, T / 16) * 0.1, v = Math.abs(Math.sin((x + y * 0.6) * Math.PI * 4 / T + 5.5 * n)); f[i] = v < 0.1 ? Math.pow(1 - v / 0.1, 1.6) : 0; }
    else if (mat === "env") f[i] = 0.5 + 0.5 * Math.sin(((y + x * 0.3) / T) * Math.PI * 2 * 3 + 3 * smooth(x / 64, y / 64, T / 64));   // the room, caught in polished metal
  }
  return (FIELDS[mat] = f);
}

// THE EYES (Laynie, Nov 18: "needs to affect the eyes in some way"; of carved, glint and glass: "glass is great").
// Like glass eyes set in a statue: the whites and the lids turn, and the iris keeps its own colour. The game colours
// only an eye picture's mid-grey (the iris: GLDraw.js, its half-alpha shader), so that's found here by the same test,
// and coloured as the game would (hex, the game's own colour for it).
const hexRGB = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || "")); if (!m) return null; const v = parseInt(m[1], 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
// a picture in the material (ink: cut into it, darker). ox, oy: where it's drawn on her, for the grain to line up
function inMaterial(img, mat, ox, oy, how, hex) {   // how: "skin", "hair", "eyes" or "ink"
  const ink = how === "ink";
  const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height; if (!w || !h) return null;
  const c = W.document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0);
  let id; try { id = g.getImageData(0, 0, w, h); } catch (e) { return null; }   // (a picture from somewhere that won't share its pixels)
  const d = id.data, R = RAMPS[mat] || RAMPS.stone, curve = CURVE[mat] || CURVE.stone;
  const eye = how === "eyes" ? hexRGB(hex) : null;
  // its own light: its commonest bright shade (the flat lit skin, painted alike on every body picture), so the pieces
  // match where they meet, and dark and light skin turn alike
  const bins = new Uint32Array(64); let n = 0;
  for (let i = 0; i < d.length; i += 4 * 3) if (d[i + 3] > 200) { const l = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11; if (l > 24) { bins[l >> 2]++; n++; } }
  if (!n) return c;
  let peak = 6, best = 0; for (let k = 6; k < 64; k++) { const v = bins[k - 1] + 2 * bins[k] + (bins[k + 1] || 0); if (v > best) { best = v; peak = k; } }
  let ref = (peak * 4 + 2) / 0.86;   // (that shade at 0.86: room above it for a shine)
  // hair's all light and shadow, with no one flat shade: its brightest tenth is its light instead
  if (how !== "skin") { const lums = []; for (let i = 0; i < d.length; i += 4 * 5) if (d[i + 3] > 128) lums.push(d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11); lums.sort((a, b) => a - b); ref = Math.max(24, lums[Math.floor(lums.length * 0.9)] || 24) / 0.92; }
  ox = ((Math.round(ox || 0) % T) + T) % T; oy = ((Math.round(oy || 0) % T) + T) % T;
  const F = mat === "stone" || mat === "marble" ? field(mat) : null, E = mat === "gold" || mat === "bronze" ? field("env") : null;
  for (let y = 0, i = 0; y < h; y++) for (let x = 0; x < w; x++, i += 4) {
    if (!d[i + 3]) continue;
    let t = Math.min(1, (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / ref);
    if (ink) t = 0.12 + t * 0.3;   // ink: cut in, in the material's own shadow
    else if (E) { const e = E[((y + oy) & (T - 1)) * T + ((x + ox) & (T - 1))]; t = Math.max(0, Math.min(1, 0.6 + Math.tanh((t - 0.86) * 3) * 0.42 + (e - 0.5) * 0.3)); }   // metal: its shading pushed, and the room caught in it
    let [r, gg, b] = ramp(R, curve(t));
    if (eye) {   // the iris: its own colour, glass in the material
      const sum = d[i] + d[i + 1] + d[i + 2];   // (the game's own test: 0.8 to 1.2 of its "half alpha", by brightness alone)
      if (sum >= 305 && sum <= 458) { const f = sum / 383; r = eye[0] * f; gg = eye[1] * f; b = eye[2] * f; }
    }
    if (F) {
      const v = F[((y + oy) & (T - 1)) * T + ((x + ox) & (T - 1))];
      if (mat === "stone") { r += v; gg += v; b += v; }
      else if (mat === "marble" && v) { const k = v * 0.32; r += (118 - r) * k; gg += (112 - gg) * k; b += (108 - b) * k; }
    }
    d[i] = r < 0 ? 0 : r > 255 ? 255 : r; d[i + 1] = gg < 0 ? 0 : gg > 255 ? 255 : gg; d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
  }
  g.putImageData(id, 0, 0); return c;
}

// ── what's kept: pictures by address, drawings by themselves. Kept few, and let go of when nobody's a statue ──
const imgs = new Map();             // address → Image
const turned = new Map();           // "mat|address|x|y" → canvas (the most recently used last)
const turnedCv = new WeakMap();     // a drawing → { "mat|x|y": canvas }
const KEEP = 40;
function imgOf(src) {
  let im = imgs.get(src);
  if (!im) { im = new W.Image(); im.crossOrigin = "anonymous"; im.onload = () => redrawAll(400); im.src = src; imgs.set(src, im); if (imgs.size > 160) imgs.delete(imgs.keys().next().value); }
  return im.complete && im.naturalWidth ? im : null;
}
function turnedOf(src, mat, x, y, how, hex) {
  if (typeof src === "string") {
    const key = mat + "|" + how + "|" + (how === "eyes" ? (hex || "") + "|" : "") + src + "|" + Math.round(x) + "|" + Math.round(y);
    let c = turned.get(key); if (c) { turned.delete(key); turned.set(key, c); return c; }
    const im = imgOf(src); if (!im) return null;
    c = inMaterial(im, mat, x, y, how, hex); if (!c) return null;
    turned.set(key, c); if (turned.size > KEEP) turned.delete(turned.keys().next().value);
    return c;
  }
  if (!src || typeof src !== "object") return null;
  let by = turnedCv.get(src); if (!by) { by = {}; turnedCv.set(src, by); }
  const key = mat + "|" + how + "|" + Math.round(x) + "|" + Math.round(y);
  return by[key] || (by[key] = inMaterial(src, mat, x, y, how));
}
function forget() { turned.clear(); imgs.clear(); }

// ── who's a statue ──
function mineNow() {
  try { const D = W.FarmhandDispensary, d = D && typeof D.dose === "function" ? D.dose("statue") : null; return d ? { mat: MATS.includes(d.p) ? d.p : "stone", left: d.left } : null; } catch (e) { return null; }
}
export function statueOf(C) {
  if (!C || onBot()) return null;
  if (C === W.Player || (typeof C.IsPlayer === "function" && C.IsPlayer())) { const m = mineNow(); return m ? m.mat : null; }
  const o = typeof C.MemberNumber === "number" ? others.get(C.MemberNumber) : null;
  if (!o) return null;
  if (o.until < Date.now()) { others.delete(C.MemberNumber); return null; }
  return o.mat;
}

// ── drawing ──
const charOf = (mn) => (Array.isArray(W.ChatRoomCharacter) ? W.ChatRoomCharacter.find((c) => c && c.MemberNumber === mn) : null);
const redrawT = new Map();
function redrawC(C, soon) {
  if (!C) return; const key = C.MemberNumber; clearTimeout(redrawT.get(key));
  redrawT.set(key, setTimeout(() => { try { if (typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { warnSome("[Farmhand Companion] statue redraw:", e); } }, soon || 0));
}
function redrawAll(soon) {
  for (const C of W.ChatRoomCharacter || []) if (statueOf(C)) redrawC(C, soon);
  if (W.Player && statueOf(W.Player) && !(W.ChatRoomCharacter || []).includes(W.Player)) redrawC(W.Player, soon);
}
// what a picture is to a statue: "skin", "hair" or "eyes" (turned), "hide", or null (left alone)
function kindOf(src) {
  if (typeof src === "string") { const g = groupOf(src); return g ? (TURN.test(g) ? "skin" : HAIR.test(g) ? "hair" : EYES.test(g) ? "eyes" : HIDE.test(g) ? "hide" : null) : null; }
  if (!src || typeof src !== "object") return null;
  const from = src.__farmFrom;
  if (from === "skin") return "skin";
  // a game picture the drawn body drew again, standin' in for it: the hands tucked under or over the drawn breasts, the
  // nipples set on them, a piece shaped round the belly. Each is what it stands in for: hands are skin, a bra isn't.
  // (Laynie, Nov 19: "statue render missed hands". These came as drawings marked with the hand's own picture, and only
  // drawings marked "skin" turned.)
  return typeof from === "string" && from !== "skin" ? kindOf(from) : null;
}
let sdk = null, hooked = false;
function hook() {
  if (hooked || !sdk) return; hooked = true;
  try {
    // (Priority 4: after the drawn body and the belly have put their drawings in, before the ink's own: so the game's
    // body pictures and the drawn skin come through here, and the ink goes on to ink.js, which asks inkTint below)
    sdk.hookFunction("CommonDrawAppearanceBuild", 4, (args, next) => {
      const C = args[0], cb = args[1], mat = statueOf(C);
      if (!mat || !cb || typeof cb !== "object") return next(args);
      const wrap = (f, plain) => (typeof f !== "function" ? f : function (src, x, y, o) {
        const k = kindOf(src); if (!k) return f.call(this, src, x, y, o);
        if (k === "hide") return undefined;
        let t = null; try { t = turnedOf(src, mat, x, y, k, o && o.HexColor); } catch (e) { warnSome("[Farmhand Companion] statue:", e); }
        if (!t) return f.call(this, src, x, y, o);   // (not loaded yet: as it is, and again once it is)
        const o2 = Object.assign({}, o || {}); delete o2.HexColor; delete o2.FullAlpha;
        return plain.call(this, t, x, y, o2);
      });
      args[1] = Object.assign({}, cb, { drawImage: wrap(cb.drawImage, cb.drawImage), drawImageBlink: wrap(cb.drawImageBlink, cb.drawImageBlink),
        drawImageColorize: wrap(cb.drawImageColorize, cb.drawImage), drawImageColorizeBlink: wrap(cb.drawImageColorizeBlink, cb.drawImageBlink) });
      return next(args);
    });
    // into a room: say if you're a statue, and ask who else is
    sdk.hookFunction("ChatRoomSync", 0, (args, next) => { const r = next(args); others.clear(); setTimeout(() => { tell("sync"); send("statueAsk", {}); }, 2600); return r; });
  } catch (e) { console.warn("[Farmhand Companion] the Statue Serum can't draw:", e); hooked = false; }
}
// the ink, cut into the material (shared/ink/ink.js calls this for each of its pictures: a canvas, null for "not yet",
// or undefined for "leave it be")
W.__farmInkTint = (C, src, x, y) => {
  const mat = statueOf(C); if (!mat) return undefined;
  try { return turnedOf(src, mat, x, y, "ink"); } catch (e) { return undefined; }
};

// ── tellin' the room ──
const send = (type, data) => { try { if (W.ServerSend && (!W.ServerPlayerIsInChatRoom || W.ServerPlayerIsInChatRoom())) W.ServerSend("ChatRoomChat", makeMsg(type, data)); } catch (e) { /* not in a room */ } };
let told = "";
// why: "change" (it started, changed or wore off), anything else (into a room, somebody asked): only ever said while
// you're one, and once when it wears off
function tell(why) {
  if (onBot()) return;
  const m = mineNow(), sig = m ? m.mat : "";
  if (why === "change" && sig === told) return;
  const was = told; told = sig;
  if (m) send("statue", { mat: m.mat, left: Math.round(m.left) });
  else if (why === "change" && was) send("statue", { mat: "" });
}
// the Dispensary says the Statue Serum started or ended (index.js), and every few seconds as a check
export function statueCheck() {
  const sig = (mineNow() || {}).mat || "";
  if (sig === told) return false;
  tell("change"); redrawC(W.Player, 0);
  if (!sig && !others.size) forget();
  return true;
}
// another Companion's word
export function onStatueMsg(m) {
  const mn = m.from; if (!mn || (W.Player && mn === W.Player.MemberNumber) || onBot()) return;
  if (m.type === "statueAsk") { if (mineNow()) setTimeout(() => tell("ask"), 300 + Math.random() * 1500); return; }
  if (m.type !== "statue") return;
  const mat = MATS.includes(m.mat) ? m.mat : "", left = Math.max(0, Math.min(31 * 60000, Number(m.left) || 0));
  const had = others.get(mn);
  if (!mat || !left) { if (others.delete(mn)) { redrawC(charOf(mn), 0); if (!others.size && !mineNow()) forget(); } return; }
  others.set(mn, { mat, until: Date.now() + left });
  if (!had || had.mat !== mat) { hook(); redrawC(charOf(mn), 0); }
}
export function initStatue(mod) {
  sdk = mod; hook();
  setInterval(() => { try { statueCheck(); for (const [mn, o] of others) if (o.until < Date.now()) { others.delete(mn); redrawC(charOf(mn), 0); } } catch (e) { /* fine */ } }, 5000);
}
if (W.__FARMHAND_TEST__) W.__statue = { inMaterial, statueOf, others, kindOf, turnedOf };
