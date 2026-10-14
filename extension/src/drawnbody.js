/* WHAT'S IN THIS FILE (drawnbody.js)
   THE DRAWN BODY, from the outfit studio. Breasts from DD to R in your own skin, your belly, and everything you wear
   fitted to them: bras and tops grown over the breasts, straps round them, harnesses and belts left where the game puts
   them with the breasts hanging in front, what's on your nipples moved onto your nipples, panties under the belly.

   Only you see it, and only on your own character: it changes how YOUR game draws you, nothing more. Nothing is sent to
   anybody and nothing about your character is changed. Off until you switch it on (Toggles), and off takes it away.

   It is the studio's own drawing (studio/web/body-engine.js), so what the studio shows is what you get. The settings
   (cup, the breast sliders, the belly, the per-piece choices) are made in the studio and copied over as a code.

   How it hands its drawings to the game: the live game only takes a picture by its name (an address), and a drawing
   handed over as itself broke every character refresh once (Companion 0.16.2, see belly.js). So every drawing of ours
   is trimmed to what's on it, turned into a picture address, and handed over by that. The game keeps every picture it
   was ever given, so the ones we no longer use are taken back out of its lists after a while.
*/
import "../../studio/web/breasts-drawing.js";   // window.FarmBreasts: the breasts themselves
import "../../studio/web/body-engine.js";       // window.FarmBodyEngine: the studio's drawing
import { bellyDrawing, bellyTrial } from "./belly.js";

const W = window;
const KEY = "farmhand-drawn-body";
const CODE_HEAD = "FARMBODY1:";
const DEFAULTS = () => ({ v: 1, on: false, cup: 12, breast: {}, wear: {}, belly: null, auto: true, mould: { items: [], mode: {} } });
let S = DEFAULTS(), E = null, sdk = null, hooked = false;

function load() { try { const d = JSON.parse(W.localStorage.getItem(KEY)); if (d && typeof d === "object") S = Object.assign(DEFAULTS(), d); } catch (e) { /* fresh */ } }
function save() { try { W.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private window: fine */ } }

// ── handing drawings to the game by name ──
const made = new WeakMap();            // canvas → { src, dx, dy }
const used = new Map();                // src → when last handed over
let fresh = false;                     // a new picture went out on this drawing: draw again once it has loaded
const gone = new Set();                // taken out of the game's lists: if it's wanted again it loads again, so draw again then too
function picture(cv) {
  let p = made.get(cv); if (p) { if (!p.src) return null; if (gone.delete(p.src)) fresh = true; used.set(p.src, Date.now()); return p; }
  const w = cv.width, h = cv.height; if (!w || !h) return null;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  try {
    const d = cv.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    for (let y = 0; y < h; y++) { const o = y * w * 4; for (let x = 0; x < w; x++) if (d[o + x * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  } catch (e) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
  if (x1 < 0) { p = { src: null, dx: 0, dy: 0 }; made.set(cv, p); return null; }   // nothing on it
  const c = W.document.createElement("canvas"); c.width = x1 - x0 + 1; c.height = y1 - y0 + 1;
  c.getContext("2d").drawImage(cv, -x0, -y0);
  p = { src: c.toDataURL("image/png"), dx: x0, dy: y0 }; made.set(cv, p); used.set(p.src, Date.now()); fresh = true;
  return p;
}
// pictures not handed over for a while come out of the game's lists (and the drawing card's memory)
function prune() {
  const old = Date.now() - 30000; let n = 0;
  for (const [src, t] of used) {
    if (t > old) continue; used.delete(src); gone.add(src); n++;
    try { const m = W.GLDrawImageCache; if (m && typeof m.delete === "function") m.delete(src); } catch (e) { /* fine */ }
    try { const m = W.DrawImageCache; if (m && typeof m.delete === "function") m.delete(src); } catch (e) { /* fine */ }
    try { const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL, tc = gl && gl.textureCache; const t2 = tc && tc.get(src); if (t2) { if (t2.texture) gl.deleteTexture(t2.texture); tc.delete(src); } } catch (e) { /* fine */ }
  }
  if (gone.size > 400) gone.clear();
  return n;
}

// ── drawing you again ──
let againT = null;
function redraw(soon) {
  clearTimeout(againT);
  againT = setTimeout(() => { try { if (W.Player && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(W.Player); } catch (e) { console.warn("[Farmhand Companion] drawn body redraw:", e); } }, soon || 60);
}

// ── the engine, set up from the settings ──
function engine() {
  if (E) return E;
  if (!W.FarmBelly) W.FarmBelly = bellyDrawing;
  if (typeof W.FarmBodyEngine !== "function" || !W.FarmBreasts) return null;
  E = W.FarmBodyEngine({
    S: { get C() { return W.Player; } },
    bodyItem: (g) => (W.Player && Array.isArray(W.Player.Appearance) ? W.Player.Appearance.find((a) => a && a.Asset && a.Asset.Group && a.Asset.Group.Name === g) : undefined),
    setBody: () => {},          // never: your body items are yours
    redraw: () => redraw(60),
    picture,
    // a picture an add-on supplies (the Echo clothing mod's): the address the add-on gives the game for it. The add-on steps
    // into the game's DrawGetImage and swaps the address there, and the first thing DrawGetImage does is look the address up
    // in the game's picture list. So that lookup is watched for a moment (and answered with nothing, so nothing is loaded
    // or kept), and the address it was asked for is the one.
    mapSrc: (src) => {
      if (typeof W.DrawGetImage !== "function") return src;
      /* (the game's live version keeps that list in a const, which isn't on window: named bare, it still answers) */
      // eslint-disable-next-line no-undef
      const lists = [typeof DrawCacheImage !== "undefined" ? DrawCacheImage : W.DrawCacheImage, W.DrawImageCache].filter((c) => c && typeof c.get === "function"); if (!lists.length) return src;
      let seen = null; const kept = lists.map((c) => [c, Object.prototype.hasOwnProperty.call(c, "get"), c.get]);
      try { for (const [c] of kept) c.get = function (k) { if (seen == null) seen = k; return { isLoaded: () => false, data: undefined, complete: false }; }; W.DrawGetImage(src); }
      catch (e) { /* nothing */ }
      finally { for (const [c, own, g] of kept) { if (own) c.get = g; else delete c.get; } }
      return typeof seen === "string" && seen ? seen : src;
    },
  });
  apply();
  return E;
}
function apply() {
  if (!E) return;
  const B = E.BREAST, b = S.breast || {};
  B.cup = Math.max(0, Math.min(W.FarmBreasts.CUPS.length - 1, Math.round(Number(S.cup) || 0)));
  for (const k of ["full", "hang", "apart", "x", "y", "nip", "nipY", "nipX"]) if (typeof b[k] === "number" && isFinite(b[k])) B[k] = b[k];
  B.wear = S.wear && typeof S.wear === "object" ? Object.assign({}, S.wear) : {};
  B.out.clear(); B.cover.clear(); B.cvKey = ""; B.holdSig = "";
  const fits = S.belly && typeof S.belly === "object" ? S.belly : null;
  for (const k of Object.keys(E.BELLY.fits)) { const f = E.BELLY.fits[k]; Object.assign(f, E.FIT0(), k === "std" ? {} : { behind: true, y: k === "AllFours" ? -60 : -75 }); if (fits && fits[k]) Object.assign(f, fits[k]); }
  E.BELLY.auto = S.auto !== false; B.tuck = S.tuck !== false; B.dress = S.dress !== false;
  E.MOULD.items.clear(); E.MOULD.mode.clear(); E.MOULD.out.clear();
  for (const it of (S.mould && S.mould.items) || []) E.MOULD.items.add(String(it));
  for (const [k, m] of Object.entries((S.mould && S.mould.mode) || {})) if (E.MOULD.items.has(k)) E.MOULD.mode.set(k, String(m));
  E.GEN.drawn = false;          // the game's own cock: the drawn ones aren't ready
}

function hook() {
  if (hooked || !sdk) return; hooked = true;
  try {
    sdk.hookFunction("CommonDrawAppearanceBuild", 2, (args, next) => {
      const C = args[0];
      if (!S.on || !E || !C || C !== W.Player) return next(args);
      fresh = false;
      let out;
      try { out = E.draw(C, args[1], (cb2) => { args[1] = cb2; return next(args); }); }
      catch (e) { console.warn("[Farmhand Companion] drawn body:", e); return next(args); }
      if (fresh) { redraw(250); setTimeout(() => redraw(0), 1200); }   // (a new picture takes a moment to load)
      return out;
    });
  } catch (e) { console.warn("[Farmhand Companion] drawn body unavailable:", e); hooked = false; }
}

export function initDrawnBody(mod) {
  sdk = mod; load();
  setInterval(prune, 20000);
  if (S.on) setTimeout(() => { if (engine()) { W.__farmDrawnBody = true; hook(); redraw(500); } }, 3000);   // (switched on last time: back on once the game is up)
}

// ── what the Toggles screen shows and does ──
export function drawnBodyState() {
  const up = W.Player && Array.isArray(W.Player.Appearance) ? W.Player.Appearance.find((a) => a && a.Asset && a.Asset.Group && a.Asset.Group.Name === "BodyUpper") : null;
  const cups = (W.FarmBreasts && W.FarmBreasts.CUPS) || [];
  return { on: !!S.on, cup: S.cup, cupName: cups[S.cup] || "?", cups, chest: up && up.Asset ? up.Asset.Name : "", fromStudio: !!S.saved, belly: !!(S.belly && S.belly.std && S.belly.std.on) };
}
export function drawnBodySet(on, say) {
  S.on = !!on; save();
  if (S.on) {
    if (!engine()) { S.on = false; save(); return say && say("The drawn body didn't load. Reload the page and try again."); }
    bellyTrial(0);                // (the old belly test would be a second belly)
    W.__farmDrawnBody = true; apply(); hook();
  } else W.__farmDrawnBody = false;
  redraw(60); setTimeout(() => redraw(0), 800);
  if (say) {
    const st = drawnBodyState();
    if (!S.on) say("Drawn body off. You're the game's own picture again.");
    else if (S.cup >= 6 && st.chest !== "XLarge") say("Drawn body on, " + st.cupName + " cup. Your chest needs to be the game's biggest size (wardrobe, body, upper body: the largest) for the drawn breasts to show; the belly and fitting work already.");
    else say("Drawn body on: " + st.cupName + " cup" + (st.belly ? " with your belly" : "") + ". Only you see it.");
  }
}
export function drawnBodyCup(i, say) {
  const n = W.FarmBreasts ? W.FarmBreasts.CUPS.length : 21;
  S.cup = Math.max(6, Math.min(n - 1, Math.round(Number(i) || 0))); save(); apply(); redraw(60);
  if (say) say("Cup: " + drawnBodyState().cupName + ".");
}
// the code from the studio's "Copy for the Companion" button
export function drawnBodyPaste(text, say) {
  try {
    const t = String(text || "").trim(); if (!t.startsWith(CODE_HEAD)) throw new Error("that isn't a code from the studio (it starts with " + CODE_HEAD + ")");
    const raw = W.LZString && typeof W.LZString.decompressFromBase64 === "function" ? W.LZString.decompressFromBase64(t.slice(CODE_HEAD.length)) : null;
    const d = raw && JSON.parse(raw); if (!d || typeof d !== "object" || d.v !== 1) throw new Error("the code is damaged or from a newer studio");
    const num = (v, lo, hi, def) => (typeof v === "number" && isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def);
    S.cup = num(d.cup, 0, 20, S.cup);
    S.breast = {}; for (const k of ["full", "hang", "apart", "x", "y", "nip", "nipY", "nipX"]) if (typeof d.breast?.[k] === "number" && isFinite(d.breast[k])) S.breast[k] = d.breast[k];
    S.wear = {}; for (const [k, v] of Object.entries(d.wear || {})) if (/^[\w/ -]{1,80}$/.test(k) && ["behind", "plain", "nipple", ""].includes(v)) S.wear[k] = v;
    S.belly = {}; for (const k of ["std", "AllFours", "Hogtied"]) { const f = d.belly?.[k]; if (!f) continue; S.belly[k] = { on: !!f.on, behind: !!f.behind, flat: !!f.flat, rx: num(f.rx, 20, 170, 70), ry: num(f.ry, 20, 190, 80), sag: num(f.sag, 0, 0.5, 0.22), x: num(f.x, -120, 120, 0), y: num(f.y, -200, 200, 0), cut: num(f.cut, 0.2, 1, 0.74) }; }
    S.auto = d.auto !== false; S.tuck = d.tuck !== false; S.dress = d.dress !== false;
    S.mould = { items: (Array.isArray(d.mould?.items) ? d.mould.items : []).filter((k) => typeof k === "string" && k.length < 80).slice(0, 200), mode: {} };
    for (const [k, m] of Object.entries(d.mould?.mode || {})) if (S.mould.items.includes(k) && ["wide", "over", "under"].includes(m)) S.mould.mode[k] = m;
    S.saved = typeof d.saved === "string" ? d.saved.slice(0, 40) : new Date().toISOString();
    save(); apply(); redraw(60);
    if (say) say("Settings from the studio put in: " + drawnBodyState().cupName + " cup" + (S.belly.std && S.belly.std.on ? ", your belly" : "") + ", " + Object.keys(S.wear).length + " piece choices. " + (S.on ? "" : "Switch the drawn body on to see it."));
    return true;
  } catch (e) { if (say) say("I couldn't read that code: " + (e && e.message || e)); return false; }
}
