/* WHAT'S IN THIS FILE (drawnbody.js)
   THE DRAWN BODY, from the outfit studio. Breasts from DD to R in your own skin, your belly, and everything you wear
   fitted to them: bras and tops grown over the breasts, straps round them, harnesses and belts left where the game puts
   them with the breasts hanging in front, what's on your nipples moved onto your nipples, panties under the belly.

   Live for everyone with the Companion (Laynie, Oct 14: "that should be live for everyone. based on what i set from my
   outfit studio"). Your Companion tells the room your settings (a small hidden message: the cup, the breast sliders, the
   belly, the piece choices), and every other Companion in the room draws you with them, the way yours does. Theirs come
   to you the same way. Players without the Companion see the game's own picture: nothing can change their screens.
   Nothing about your character is changed for anybody. Off until you switch it on (Toggles), and off takes it away,
   for you and for them.

   It is the studio's own drawing (studio/web/body-engine.js), so what the studio shows is what you get. The settings
   are made in the studio. THE FARM'S LOOK comes from the bot (Laynie, Oct 14: "the outfit studio settings should route
   through the bot anyway"): the bot hands every Companion the settings its own Companion has (Laynie's, from her
   studio), so a phone with no studio gets them too. On top of it each player picks their own cup and whether their
   belly shows. Somebody with a studio of their own can fetch theirs from it, or paste its code, and theirs wins until
   they go back to the farm's.

   How it hands its drawings to the game: the live game only takes a picture by its name (an address), and a drawing
   handed over as itself broke every character refresh once (Companion 0.16.2, see belly.js). So every drawing of ours
   is trimmed to what's on it, turned into a picture address, and handed over by that. The game keeps every picture it
   was ever given, so the ones we no longer use are taken back out of its lists after a while.
*/
import "../../studio/web/breasts-drawing.js";   // window.FarmBreasts: the breasts themselves
import "../../studio/web/body-engine.js";       // window.FarmBodyEngine: the studio's drawing
import { bellyDrawing, bellyTrial } from "./belly.js";
import { makeMsg } from "../../shared/protocol.js";

const W = window;
const KEY = "farmhand-drawn-body", SEE_KEY = "farmhand-drawn-body-see", FARM_KEY = "farmhand-drawn-body-farm";
const CODE_HEAD = "FARMBODY1:";
const STUDIO = "http://localhost:4780";
const DEFAULTS = () => ({ v: 1, on: false, cup: 12, breast: {}, wear: {}, belly: null, auto: true, tuck: true, dress: true, mould: { items: [], mode: {} } });
let S = DEFAULTS(), sdk = null, hooked = false, seeOthers = true;
let farm = null;                                   // { at, body }: the farm's look, from the bot (S.saved: they brought their own instead)
const mine = { S: null, E: null };                 // you
const others = new Map();                          // member number → { S, E, at }: what other Companions told us

function load() {
  try { const d = JSON.parse(W.localStorage.getItem(KEY)); if (d && typeof d === "object") S = Object.assign(DEFAULTS(), d); } catch (e) { /* fresh */ }
  try { seeOthers = W.localStorage.getItem(SEE_KEY) !== "0"; } catch (e) { /* on */ }
  try { const f = JSON.parse(W.localStorage.getItem(FARM_KEY)); if (f && typeof f.at === "number" && f.body) { const b = clean(f.body); if (b) farm = { at: f.at, body: b }; } } catch (e) { /* none yet */ }
  mine.S = S;
}
// What you're drawn with: your own studio's settings if you brought them, otherwise the farm's look (plain settings till
// it arrives). On top, your cup and your belly FOLLOW THE FARM unless you pick your own (Laynie, Oct 14: "the belly
// sizes in game need to automatically adjust based on how full or pregnant each player is", "same for tit sizes and
// growth"): the bot says your cup as it counts it (1 AA ... 20 R, the same scale as here) and how big your belly is
// (0 none ... 4 huge), and both change as the farm changes you.
let farmMe = null;                                 // { cup, belly } for you, from the bot (state.drawn)
const BELLY_STAGES = [null, { k: 50 / 92, kr: 54 / 112, sag: 0.16, lift: 0 }, { k: 70 / 92, kr: 80 / 112, sag: 0.22, lift: 5 }, { k: 1, kr: 1, sag: 0.28, lift: 20 }, { k: 1.2, kr: 1.2, sag: 0.32, lift: 30 }];
const bellyMode = () => S.bellyMode || (S.bellyOn ? "on" : "farm");
function bellyAt(base, stage) {
  // the look's standing belly is the large one (stage 3); smaller and bigger are drawn in proportion to it, raised or
  // dropped the way the belly drawing's own sizes are. Other poses only if the look has them switched on.
  const out = {}, s = BELLY_STAGES[stage], ref = BELLY_STAGES[3];
  for (const k of ["std", "AllFours", "Hogtied"]) {
    const b = (base && base[k]) || (k === "std" ? { rx: 92, ry: 112, sag: 0.28, x: 0, y: -20, behind: false, flat: false, cut: 0.74 } : null); if (!b) continue;
    if (!s) { out[k] = Object.assign({}, b, { on: false }); continue; }
    out[k] = Object.assign({}, b, { on: k === "std" ? true : !!b.on, rx: Math.round((b.rx || 92) * s.k), ry: Math.round((b.ry || 112) * s.kr), sag: Math.max(0, Math.min(0.5, (b.sag || 0.28) * s.sag / ref.sag)), y: (b.y || 0) + (k === "std" ? ref.lift - s.lift : 0) });
  }
  return out;
}
function eff() {
  const base = S.saved || !farm ? S : farm.body, e = Object.assign({}, base, { on: S.on });
  if (S.cupSet) e.cup = S.cup; else if (farmMe && farmMe.cup >= 1) e.cup = farmMe.cup;
  const mode = bellyMode();
  e.belly = mode === "studio" ? base.belly : bellyAt(base.belly, mode === "off" ? 0 : mode === "on" ? 3 : Math.max(0, Math.min(4, Math.round(Number(farmMe && farmMe.belly) || 0))));
  return e;
}
// the bot's word on your size (index.js hands over state.drawn)
export function drawnBodyFarmState(d) {
  if (!d || typeof d !== "object") return;
  const cup = Math.max(0, Math.min(20, Math.round(Number(d.cup) || 0))), belly = Math.max(0, Math.min(4, Math.round(Number(d.belly) || 0)));
  if (farmMe && farmMe.cup === cup && farmMe.belly === belly) return;
  farmMe = { cup, belly };
  if (!S.on) return;
  if (mine.E) apply(mine.E, eff()); redraw(60); tell(true);
}
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
  p = { src: c.toDataURL("image/png"), dx: x0, dy: y0 }; made.set(cv, p);
  if (!used.has(p.src)) fresh = true;   // (a new drawing with the very same picture as before is no reason to draw again: that went round and round)
  used.set(p.src, Date.now());
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
  // and anybody who's left the room and not been seen for an hour
  for (const [mn, o] of others) if (Date.now() - o.at > 3600000 && !charOf(mn)) others.delete(mn);
  // somebody who's left the room: their drawings go (they're big); what they look like stays, and is drawn fresh if they're back
  for (const [mn, o] of others) if (o.E && Date.now() - o.at > 120000 && !charOf(mn)) o.E = null;
  return n;
}

// ── whose character is whose ──
const charOf = (mn) => (W.Player && W.Player.MemberNumber === mn ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || null);
const itemOf = (C, g) => (C && Array.isArray(C.Appearance) ? C.Appearance.find((a) => a && a.Asset && a.Asset.Group && a.Asset.Group.Name === g) : undefined);

// ── drawing somebody again ──
const againT = new Map();
function redrawMn(mn, soon) {
  clearTimeout(againT.get(mn));
  againT.set(mn, setTimeout(() => { try { const C = charOf(mn); if (C && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { console.warn("[Farmhand Companion] drawn body redraw:", e); } }, soon || 60));
}
const redraw = (soon) => { if (W.Player) redrawMn(W.Player.MemberNumber, soon); };

// ── an engine per body, set up from its settings ──
// (yours follows the game's Player itself: it was made by member number, and made before the game knew yours, so it
// looked for nobody and never drew you, while everyone else's worked. Laynie, Oct 14: "i can see changes on others,
// but not on myself", on her phone and on the bot.)
function makeEngine(mn) {
  if (!W.FarmBelly) W.FarmBelly = bellyDrawing;
  if (typeof W.FarmBodyEngine !== "function" || !W.FarmBreasts) return null;
  const who = mn == null ? () => W.Player || null : () => charOf(mn);
  return W.FarmBodyEngine({
    S: { get C() { return who(); } },
    bodyItem: (g) => itemOf(who(), g),
    setBody: () => {},          // never: their body items are theirs
    redraw: () => (mn == null ? redraw(60) : redrawMn(mn, 60)),
    picture,
    budget: mn == null ? 128e6 : 48e6,   // how much of its drawings it keeps (body-engine.js): yours more, everybody else's less
  });
}
function engine() { if (!mine.E && W.Player) mine.E = makeEngine(null); if (mine.E) apply(mine.E, eff()); return mine.E; }
function apply(E, s) {
  if (!E) return;
  const B = E.BREAST, b = s.breast || {};
  B.cup = Math.max(0, Math.min(W.FarmBreasts.CUPS.length - 1, Math.round(Number(s.cup) || 0)));
  for (const k of ["full", "hang", "apart", "x", "y", "nip", "nipY", "nipX"]) if (typeof b[k] === "number" && isFinite(b[k])) B[k] = b[k];
  B.wear = s.wear && typeof s.wear === "object" ? Object.assign({}, s.wear) : {};
  B.out.clear(); B.cover.clear(); B.cvKey = ""; B.holdSig = "";
  const fits = s.belly && typeof s.belly === "object" ? s.belly : null;
  for (const k of Object.keys(E.BELLY.fits)) { const f = E.BELLY.fits[k]; Object.assign(f, E.FIT0(), k === "std" ? {} : { behind: true, y: k === "AllFours" ? -60 : -75 }); if (fits && fits[k]) Object.assign(f, fits[k]); }
  E.BELLY.auto = s.auto !== false; B.tuck = s.tuck !== false; B.dress = s.dress !== false;
  E.MOULD.items.clear(); E.MOULD.mode.clear(); E.MOULD.out.clear();
  for (const it of (s.mould && s.mould.items) || []) E.MOULD.items.add(String(it));
  for (const [k, m] of Object.entries((s.mould && s.mould.mode) || {})) if (E.MOULD.items.has(k)) E.MOULD.mode.set(k, String(m));
  E.GEN.drawn = false;          // the game's own cock: the drawn ones aren't ready
}

// settings from anywhere (the studio's code, the studio itself, another Companion): only what's expected, in range
function clean(d) {
  if (!d || typeof d !== "object") return null;
  const num = (v, lo, hi, def) => (typeof v === "number" && isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def);
  const s = DEFAULTS();
  s.cup = Math.round(num(d.cup, 0, 20, 12));
  for (const k of ["full", "hang", "apart", "x", "y", "nip", "nipY", "nipX"]) { const v = d.breast && d.breast[k]; if (typeof v === "number" && isFinite(v)) s.breast[k] = num(v, -100, 100, 0); }
  let n = 0; for (const [k, v] of Object.entries(d.wear || {})) if (n < 80 && /^[\w/ -]{1,80}$/.test(k) && ["behind", "plain", "nipple", ""].includes(v)) { s.wear[k] = v; n++; }
  s.belly = {}; for (const k of ["std", "AllFours", "Hogtied"]) { const f = d.belly && d.belly[k]; if (!f || typeof f !== "object") continue; s.belly[k] = { on: !!f.on, behind: !!f.behind, flat: !!f.flat, rx: num(f.rx, 20, 170, 70), ry: num(f.ry, 20, 190, 80), sag: num(f.sag, 0, 0.5, 0.22), x: num(f.x, -120, 120, 0), y: num(f.y, -200, 200, 0), cut: num(f.cut, 0.2, 1, 0.74) }; }
  s.auto = d.auto !== false; s.tuck = d.tuck !== false; s.dress = d.dress !== false;
  s.mould = { items: (Array.isArray(d.mould && d.mould.items) ? d.mould.items : []).filter((k) => typeof k === "string" && /^[\w/ -]{1,80}$/.test(k)).slice(0, 60), mode: {} };
  for (const [k, m] of Object.entries((d.mould && d.mould.mode) || {})) if (s.mould.items.includes(k) && ["wide", "over", "under"].includes(m)) s.mould.mode[k] = m;
  return s;
}
// what's shared with the room: the settings, no more
const shareOf = (s) => ({ cup: s.cup, breast: s.breast, wear: s.wear, belly: s.belly, auto: s.auto, tuck: s.tuck, dress: s.dress, mould: s.mould });

// ── telling the room, and hearing from it ──
const send = (type, data) => { try { if (W.ServerSend && W.ServerPlayerIsInChatRoom && W.ServerPlayerIsInChatRoom()) W.ServerSend("ChatRoomChat", makeMsg(type, data)); } catch (e) { /* not in a room */ } };
let toldAt = 0, askedAt = 0;
function tell(force) {
  if (!force && Date.now() - toldAt < 8000) return; toldAt = Date.now();
  send("body", S.on ? { on: true, body: shareOf(eff()) } : { on: false });
}
function ask() { if (Date.now() - askedAt < 8000) return; askedAt = Date.now(); send("bodyAsk", {}); }
// a message from another Companion (index.js hands these over)
export function onBodyMsg(m) {
  const mn = m.from; if (!mn || (W.Player && mn === W.Player.MemberNumber)) return;
  if (m.type === "bodyAsk") { if (S.on) setTimeout(() => tell(), 300 + Math.random() * 1500); return; }
  if (m.type !== "body") return;
  if (!m.on) { if (others.delete(mn)) redrawMn(mn, 60); return; }
  const s = clean(m.body); if (!s) return;
  let o = others.get(mn);
  if (!o) { o = { S: s, E: makeEngine(mn), at: Date.now() }; others.set(mn, o); } else { o.S = s; o.at = Date.now(); }
  if (o.E) apply(o.E, s);
  hook(); redrawMn(mn, 120); setTimeout(() => redrawMn(mn, 0), 1500);
}

function hook() {
  if (hooked || !sdk) return; hooked = true;
  try {
    sdk.hookFunction("CommonDrawAppearanceBuild", 2, (args, next) => {
      const C = args[0]; if (!C) return next(args);
      let E = null;
      if (C === W.Player) { if (S.on) E = mine.E || engine(); }
      else if (seeOthers && typeof C.MemberNumber === "number") { const o = others.get(C.MemberNumber); if (o) { o.at = Date.now(); if (!o.E) { o.E = makeEngine(C.MemberNumber); if (o.E) apply(o.E, o.S); } E = o.E; } }
      if (!E) return next(args);
      fresh = false;
      let out;
      try { out = E.draw(C, args[1], (cb2) => { args[1] = cb2; return next(args); }); }
      catch (e) { console.warn("[Farmhand Companion] drawn body:", e); return next(args); }
      if (fresh) { const mn = C.MemberNumber; redrawMn(mn, 250); setTimeout(() => redrawMn(mn, 0), 1200); }   // (a new picture takes a moment to load)
      return out;
    });
    // into a room: say what you look like, and ask what everybody else does
    sdk.hookFunction("ChatRoomSync", 0, (args, next) => { const r = next(args); setTimeout(() => { if (S.on) tell(true); if (seeOthers) ask(); }, 2500); return r; });
  } catch (e) { console.warn("[Farmhand Companion] drawn body unavailable:", e); hooked = false; }
}

export function initDrawnBody(mod) {
  sdk = mod; load();
  setInterval(prune, 20000);
  setTimeout(() => {
    if (S.on && engine()) { W.__farmDrawnBody = true; redraw(500); }   // (switched on last time: back on once the game is up)
    hook(); if (S.on) tell(true); if (seeOthers) ask();
  }, 3000);
}

// ── what the Toggles screen shows and does ──
export function drawnBodyState() {
  const up = itemOf(W.Player, "BodyUpper"), cups = (W.FarmBreasts && W.FarmBreasts.CUPS) || [], e = eff();
  return { on: !!S.on, cup: e.cup, cupName: cups[e.cup] || "?", cups, cupSet: !!S.cupSet, farmCup: farmMe && farmMe.cup >= 1 ? farmMe.cup : 0, farmBelly: farmMe ? farmMe.belly : 0, bellyMode: bellyMode(),
           chest: up && up.Asset ? up.Asset.Name : "", fromStudio: !!S.saved, fromFarm: !S.saved && !!farm,
           belly: !!(e.belly && e.belly.std && e.belly.std.on), seeOthers, othersHere: Array.from(others.keys()).filter((mn) => charOf(mn)).length };
}
// ── the farm's look, from the bot (index.js hands these over) ──
// the bot's welcome says which look it has: the "at" to ask with, or null when this one's already here
export function farmLookWanted(look) { const at = Number(look) || 0; return at && (!farm || farm.at !== at) ? (farm ? farm.at : 0) : null; }
export function onFarmLook(m) {
  const at = Number(m && m.at), b = clean(m && m.body); if (!at || !b) return;
  if (farm && farm.at === at) return;
  farm = { at, body: b }; try { W.localStorage.setItem(FARM_KEY, JSON.stringify(farm)); } catch (e) { /* private window: fine */ }
  if (S.saved) return;                                   // they're using their own
  if (mine.E) apply(mine.E, eff());
  if (S.on) { redraw(60); tell(true); }
}
// your belly: "farm" (as full or pregnant as the farm has you, the default), "on" (always, the large one), "off", or
// "studio" (as your own studio has it)
export function drawnBodyBelly(mode, say) {
  S.bellyMode = ["farm", "on", "off", "studio"].includes(mode) ? mode : "farm"; delete S.bellyOn; save(); if (mine.E) apply(mine.E, eff()); redraw(60); tell(true);
  if (say) say({ farm: "Your belly follows the farm: it shows, and grows, as you fill up or get bred.", on: "Belly always on.", off: "Belly off.", studio: "Your belly is the one your own studio has." }[S.bellyMode]);
}
// back to the farm's look, from settings of your own
export function drawnBodyUseFarm(say) {
  delete S.saved; S.cupSet = false; save(); if (mine.E) apply(mine.E, eff()); redraw(60); tell(true);
  if (say) say(farm ? "Back to the farm's look." : "Back to the farm's look: it comes from the farm girl when you're in her room.");
}
export function drawnBodySet(on, say) {
  S.on = !!on; save();
  if (S.on) {
    if (!engine()) { S.on = false; save(); return say && say("The drawn body didn't load. Reload the page and try again."); }
    bellyTrial(0);                // (the old belly test would be a second belly)
    W.__farmDrawnBody = true; hook();
  } else W.__farmDrawnBody = false;
  tell(true);
  redraw(60); setTimeout(() => redraw(0), 800);
  if (say) {
    const st = drawnBodyState();
    if (!S.on) say("Drawn body off. You're the game's own picture again, for you and everybody else.");
    else if (S.cup >= 6 && st.chest !== "XLarge") say("Drawn body on, " + st.cupName + " cup. Your chest needs to be the game's biggest size (wardrobe, body, upper body: the largest) for the drawn breasts to show; the belly and fitting work already.");
    else say("Drawn body on: " + st.cupName + " cup" + (st.belly ? " with your belly" : "") + ". Everyone here with the Companion sees it too.");
  }
}
export function drawnBodySeeOthers(on, say) {
  seeOthers = !!on; try { W.localStorage.setItem(SEE_KEY, on ? "1" : "0"); } catch (e) { /* fine */ }
  for (const mn of others.keys()) redrawMn(mn, 60);
  if (on) { hook(); ask(); }
  if (say) say(on ? "You'll see other people's drawn bodies." : "Other people are drawn the game's own way on your screen.");
}
export function drawnBodyCup(i, say) {
  const n = W.FarmBreasts ? W.FarmBreasts.CUPS.length : 21;
  if (i === "auto") { S.cupSet = false; save(); if (mine.E) apply(mine.E, eff()); redraw(60); tell(true); if (say) say("Your cup follows the farm: " + drawnBodyState().cupName + " now, and it changes as you grow."); return; }
  S.cup = Math.max(6, Math.min(n - 1, Math.round(Number(i) || 0))); S.cupSet = true; save(); if (mine.E) apply(mine.E, eff()); redraw(60); tell(true);
  if (say) say("Cup: " + drawnBodyState().cupName + ", whatever the farm does. Pick Follow the farm to have it grow with you again.");
}
function take(d, say, from) {
  const s = clean(d); if (!s) throw new Error("the settings are damaged");
  s.on = S.on; s.bellyMode = S.bellyMode; s.bellyOn = S.bellyOn; s.cupSet = S.cupSet; s.cup = S.cupSet ? S.cup : s.cup; s.saved = typeof d.saved === "string" ? d.saved.slice(0, 40) : new Date().toISOString();
  S = s; mine.S = S; save(); if (mine.E) apply(mine.E, eff()); redraw(60); tell(true);
  if (say) say("Settings " + from + " put in: " + drawnBodyState().cupName + " cup" + (S.belly.std && S.belly.std.on ? ", your belly" : "") + ", " + Object.keys(S.wear).length + " piece choices. " + (S.on ? "" : "Switch the drawn body on to see it."));
  return true;
}
// the code from the studio's "Copy for the Companion" button
export function drawnBodyPaste(text, say) {
  try {
    const t = String(text || "").trim(); if (!t.startsWith(CODE_HEAD)) throw new Error("that isn't a code from the studio (it starts with " + CODE_HEAD + ")");
    const raw = W.LZString && typeof W.LZString.decompressFromBase64 === "function" ? W.LZString.decompressFromBase64(t.slice(CODE_HEAD.length)) : null;
    const d = raw && JSON.parse(raw); if (!d || typeof d !== "object" || d.v !== 1) throw new Error("the code is damaged or from a newer studio");
    return take(d, say, "from the code");
  } catch (e) { if (say) say("I couldn't read that code: " + (e && e.message || e)); return false; }
}
// straight from the studio, while it's running on this computer: what its Save buttons last saved
export async function drawnBodyFromStudio(say) {
  try {
    const get = async (f) => { const r = await fetch(STUDIO + "/__studio/fits/" + f, { cache: "no-store" }); if (!r.ok) throw new Error(f + ": " + r.status); return r.json(); };
    const [br, be, it] = await Promise.all([get("breasts.json"), get("belly.json").catch(() => null), get("items.json").catch(() => null)]);
    if (!br) throw new Error("the studio hasn't saved any breasts yet (Save the breasts)");
    return take({ cup: br.cup, breast: br, wear: br.wear, belly: be && be.fits, tuck: br.tuck, dress: br.dress, mould: it ? { items: it.mould || [], mode: it.mouldMode || {} } : null, saved: br.saved }, say, "from your studio");
  } catch (e) { if (say) say("I couldn't reach your studio (" + (e && e.message || e) + "). Is it running? Start the studio.bat, then try again. Or use its Copy for the Companion button and paste the code here."); return false; }
}

// ── how much it's holding (memlog.js writes this down every half minute, for chasing the page running out of room) ──
export function drawnBodyMemory() {
  let kept = 0, engines = 0;
  for (const E of [mine.E, ...Array.from(others.values()).map((o) => o.E)]) if (E) { engines++; try { kept += E.keptBytes ? E.keptBytes() : 0; } catch (e) { /* fine */ } }
  return { engines, others: others.size, pictures: used.size, keptMB: Math.round(kept / 1e6) };
}
