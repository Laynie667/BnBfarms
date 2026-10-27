/* WHAT'S IN THIS FILE (messes.js)
   THE FARM'S OWN MESSES on players, drawn by the Companion (Laynie, Oct 15: "i love it and it needs to be integrated").
   The look is the studio's (studio/web/splatters.js, window.FarmMess): the game's own splatter strands, stamped where it
   landed, flipped and turned and narrowed, tinted and textured for each substance (cum, piss, milk, honey, maple,
   chocolate, strawberry, slime), smears for the thick ones (cream, cake, mud, mash), blended and smudged at the edges,
   layered as deep as it gets.

   • When the farm marks you (a load, a trap's mess: the "mark" the bot sends your Companion, with "Farm can mark my
     body" on), your Companion keeps a list of what landed where, and draws it on you. ?wash clears it.
   • It tells the room your list (a small hidden message), and every other Companion draws your messes on you the same
     way; theirs come to you. Players without the Companion see the game's own splatters, which still go on as before.
   • It follows your body: each mess is kept to where your skin is (the game's own body pictures, as it draws them), and
     moves with you when you kneel or go on all fours.
*/
import "../../studio/web/splatters.js";
import { makeMsg } from "../../shared/protocol.js";
import { BOT_MEMBER } from "./config.js";

const W = window, KEY = "farmhand-messes", MAX = 60;
// the bot's own account never draws anybody's messes, so it never asks for them or keeps them (Oct 27: every ask made
// every Companion in the room send its whole list, all of it downloaded on the bot's connection)
const onBot = () => !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
let sdk = null, hooked = false;
let mine = [];
// what happened last, for /farmmess (Laynie, Oct 20: a mess drawn on everybody but her)
const DIAG = { marks: [], draw: null, draws: 0, lastErr: "", got: 0 };                                  // [{ k: kind, a: [areas], s: seed, t: when }]
const others = new Map();                       // member → { list, at }
// the bot's colours for its messes (10u7-traps-3.js MESS, CFG.PISS_COLOR), back to the kind of mess
const BY_COLOR = { "#fff4dc": "cream", "#e0a030": "honey", "#8b4a1c": "maple", "#4a2a18": "chocolate", "#e04a6a": "strawberry", "#f7f7f0": "milk",
  "#5fae3a": "slime", "#6b4a2b": "mud", "#d8c08a": "mash", "#d9c13a": "piss", "#ffd8e6": "cake" };
const AREA_OF = { face: "face", forehead: "forehead", chest: "chest", tummy: "tummy", hair: "hair", thighs: "thighL", back: "back" };

function load() { try { const v = JSON.parse(W.localStorage.getItem(KEY)); if (Array.isArray(v)) mine = v.filter(ok).slice(-MAX); } catch (e) { mine = []; } }
function save() { try { W.localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) { /* fine */ } }
const ok = (e) => e && typeof e.k === "string" && W.FarmMess && W.FarmMess.KINDS[e.k] && Array.isArray(e.a) && Number.isFinite(e.s);
const clean = (list) => (Array.isArray(list) ? list.filter(ok).slice(-MAX).map((e) => ({ k: e.k, a: e.a.filter((x) => typeof x === "string" && W.FarmMess.AREAS[x]).slice(0, 6), s: e.s | 0, t: +e.t || 0, m: Math.max(0.5, Math.min(3, Number(e.m) || 1)) })) : []);

// ── the farm marked you: what landed, and where ──
export function messFromMark(m) {
  DIAG.marks.push({ at: Date.now(), mess: m && m.mess, splat: m && m.splat, farmMess: !!W.FarmMess }); if (DIAG.marks.length > 5) DIAG.marks.shift();
  if (!m || !Array.isArray(m.splat) || !m.splat.length || !W.FarmMess) return false;
  const kind = (typeof m.mess === "string" && W.FarmMess.KINDS[m.mess]) ? m.mess : (typeof m.color === "string" ? BY_COLOR[m.color.toLowerCase()] : null) || "cum";
  const a = [];
  for (const x of m.splat) { const k = AREA_OF[x]; if (k && !a.includes(k)) a.push(k); }
  // a wet mess runs: from the belly onto the thighs, now and then
  if (a.includes("tummy") && ["cum", "piss", "milk", "honey", "maple", "chocolate", "strawberry", "slime"].includes(kind) && Math.random() < 0.4) a.push(Math.random() < 0.5 ? "thighL" : "thighR");
  if (!a.length) a.push("chest");
  const amt = Number(m.amount) > 0 ? Math.max(0.5, Math.min(3, Number(m.amount))) : 1;   // a bigger load, a bigger mess
  mine.push({ k: kind, a, s: (Math.random() * 1e9) | 0, t: Date.now(), m: Math.round(amt * 10) / 10 });
  if (mine.length > MAX) mine = mine.slice(-MAX);
  save(); tell(true); redrawMe();
  return true;
}
export function messWash() { if (!mine.length) return false; mine = []; save(); tell(true); redrawMe(); return true; }
export function messCount() { return mine.length; }
// a rinse at the water (Oct 26): about a third of the messes come off, the oldest first
export function messRinse() { if (!mine.length) return false; mine = mine.slice(Math.max(1, Math.ceil(mine.length / 3))); save(); tell(true); redrawMe(); return true; }

// ── telling the room, and hearing from it ──
const send = (type, data) => { try { if (W.ServerSend && W.ServerPlayerIsInChatRoom && W.ServerPlayerIsInChatRoom()) W.ServerSend("ChatRoomChat", makeMsg(type, data)); } catch (e) { /* not in a room */ } };
let toldAt = 0, askedAt = 0;
function tell(force) { if (!force && Date.now() - toldAt < 8000) return; toldAt = Date.now(); send("mess", { list: mine }); }
function ask() { if (onBot() || Date.now() - askedAt < 8000) return; askedAt = Date.now(); send("messAsk", {}); }
export function onMessMsg(m) {
  const mn = m.from; if (!mn || (W.Player && mn === W.Player.MemberNumber) || onBot()) return;
  if (m.type === "messAsk") { if (mine.length) setTimeout(() => tell(), 300 + Math.random() * 1500); return; }
  if (m.type !== "mess") return;
  const list = clean(m.list);
  if (!list.length) { if (others.delete(mn)) redrawMn(mn); return; }
  others.set(mn, { list, at: Date.now() }); hook(); redrawMn(mn);
}

// ── drawing ──
const charOf = (mn) => (W.Player && W.Player.MemberNumber === mn ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || null);
const againT = new Map();
function redrawMn(mn, soon) { clearTimeout(againT.get(mn)); againT.set(mn, setTimeout(() => { try { const C = charOf(mn); if (C && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } }, soon || 80)); }
const redrawMe = () => { if (W.Player) redrawMn(W.Player.MemberNumber); };
const listFor = (C) => (C === W.Player ? mine : (others.get(C.MemberNumber) || {}).list || []);
// the body's own pictures, loaded once each (for keeping a mess on the skin)
const imgs = new Map();
function img(src, mn) {
  let i = imgs.get(src); if (i) return i.complete && i.naturalWidth ? i : null;
  i = new Image(); i.onload = () => redrawMn(mn, 100); i.src = src; imgs.set(src, i); return null;
}
if (W.FarmMess && W.FarmMess.loadStamps) W.FarmMess.loadStamps("").then((n) => { if (n) { redrawMe(); for (const mn of others.keys()) redrawMn(mn); } });
const BODY = /(?:^|\/)(?:BodyUpper|BodyLower|Head|Arms|ArmsLeft|ArmsRight|Hands|HandsLeft|HandsRight|Pussy)\/[^?#]*\.(?:png|webp|jpe?g)/i;
// one picture per character, made again only when their list or their body changes
const made = new Map();   // member → { key, src, dx, dy }
// every skin picture of their last whole drawing: some bodies (Echo's, EchoV2) draw the skin late, after what's worn,
// so this drawing's skin isn't all there yet when the mess goes on (Laynie, Oct 20: only her kneeling legs were seen)
const skinOf = new Map();   // member → [[src, x, y]]
// an old picture comes out of the game's lists once the new one has had time to load: the game keeps every picture it's
// handed (and a copy on the graphics card) for good, so without this every pose, every new mess and every minute of a
// fresh one running piled up another picture till the page ran out of room and crashed
function forget(src) {
  if (!src || typeof src !== "string") return;   // (a drawing handed over as itself, R133 on: nothing was kept)
  setTimeout(() => {
    for (const p of made.values()) if (p.src === src) return;   // somebody's wearing that very picture again
    try { const m = W.GLDrawImageCache; if (m && typeof m.delete === "function") m.delete(src); } catch (e) { /* fine */ }
    try { const m = W.DrawImageCache; if (m && typeof m.delete === "function") m.delete(src); } catch (e) { /* fine */ }
    try { const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL, tc = gl && gl.textureCache; const t2 = tc && tc.get(src); if (t2) { if (t2.texture) gl.deleteTexture(t2.texture); tc.delete(src); } } catch (e) { /* fine */ }
  }, 5000);
}
function keep(mn, p) { const was = made.get(mn); made.set(mn, p); if (was && was.src && was.src !== p.src) forget(was.src); }
function messPicture(C, list, body) {
  const over = W.CanvasUpperOverflow || 700, h = (C.Canvas && C.Canvas.height) || 1000 + over;
  const up = body.find((b) => /\/BodyUpper\//.test(b[0])), ox = up ? up[1] : 0, oy = up ? up[2] - over : 0;
  const age = (e) => Math.min(5, Math.floor((Date.now() - (e.t || 0)) / 60000));
  const key = JSON.stringify(list) + "|" + list.map(age).join("") + "|" + body.map((b) => b[0] + "@" + b[1] + "," + b[2]).join(";");
  const was = made.get(C.MemberNumber); if (was && was.key === key) return was;
  let mask = null;
  if (body.length) { mask = W.document.createElement("canvas"); mask.width = 500; mask.height = h; const mg = mask.getContext("2d");
    for (const [src, x, y] of body) { const i = img(src, C.MemberNumber); if (!i) return was || null; mg.drawImage(i, x, y); } }
  const c = W.document.createElement("canvas"); c.width = 500; c.height = h; const g = c.getContext("2d");
  const at = (names) => names.map((n) => { const A = W.FarmMess.AREAS[n]; return [A[0] + ox, A[1] + over + oy, A[2]]; });
  for (const e of list) W.FarmMess.paintOn(g, mask, e.k, { at: at(e.a), seed: e.s, amount: e.m || 1, runX: 0.55 + 0.09 * age(e) });
  // R133 on: the drawing itself goes to the game (nothing made, nothing kept)
  if (typeof W.GLDrawLoadTransient === "function") { const p = { key, src: c, dx: 0, dy: 0 }; keep(C.MemberNumber, p); return p; }
  // before R133: trimmed to what's on it, handed over by address (that game takes pictures by name: see drawnbody.js)
  const d = g.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) { const p = { key, src: null }; keep(C.MemberNumber, p); return p; }
  const t = W.document.createElement("canvas"); t.width = x1 - x0 + 1; t.height = y1 - y0 + 1; t.getContext("2d").drawImage(c, -x0, -y0);
  const p = { key, src: t.toDataURL("image/png"), dx: x0, dy: y0, fresh: true }; keep(C.MemberNumber, p);
  return p;
}
function hook() {
  if (hooked || !sdk) return; hooked = true;
  try {
    // outside the drawn body's own step (priority 3 over its 2), so it has the game's real brushes. The mess goes on where
    // the game's own splatters would: on the skin, after the body (and the drawn belly and breasts), and before the first
    // thing worn over it, so clothes and hands cover it as they would. Naked, it's the last thing drawn.
    const SKIN = /^(BodyUpper|BodyLower|Head|Arms|ArmsLeft|ArmsRight|Hands|HandsLeft|HandsRight|Pussy|Nipples|Eyes|Eyes2|Eyebrows|Mouth|Blush|Fluids|Emoticon|BodyMarkings|FaceMarkings|Mask|HairBack|HairFront|Height|BodyStyle)$/;
    const groupRe = /(?:^|\/)Assets\/[^/]+\/(?:Override\/[^/]+\/)?([^/]+)\//;
    sdk.hookFunction("CommonDrawAppearanceBuild", 3, (args, next) => {
      const C = args[0], real = args[1];
      if (!C || !real || typeof real.drawImage !== "function" || !W.FarmMess || onBot()) return next(args);
      const list = listFor(C); if (C === W.Player) DIAG.got++; if (!list.length) return next(args);
      const body = [], all = [], sample = []; let canv = 0, done = false;
      const before = skinOf.get(C.MemberNumber) || [];
      const lay = () => {
        if (done) return; done = true;
        try {
          // this drawing's skin so far, and the rest from the last whole drawing
          const have = new Set(body.map((b) => b[0]));
          for (const b of before) if (!have.has(b[0])) { body.push(b); have.add(b[0]); }
          const p = messPicture(C, list, body);
          if (C === W.Player) { DIAG.draws++; DIAG.draw = { at: Date.now(), list: list.length, body: body.map((b) => String(b[0]).replace(/^.*Assets\/[^/]+\//, "") + "@" + b[1] + "," + b[2]), sample: sample.slice(), canv, pic: p ? (p.src ? (typeof p.src === "string" ? "picture" : "drawing " + p.src.width + "x" + p.src.height) : "empty") : "waiting for the body pictures" }; }
          if (p && p.src) {
            real.drawImage(p.src, p.dx, p.dy, {}); if (typeof real.drawImageBlink === "function") real.drawImageBlink(p.src, p.dx, p.dy, {});
            if (p.fresh) { p.fresh = false; const mn = C.MemberNumber; redrawMn(mn, 250); setTimeout(() => redrawMn(mn, 0), 1200); }   // (a new picture takes a moment to load)
          }
        } catch (e) { DIAG.lastErr = String(e && e.message || e); console.warn("[Farmhand Companion] messes:", e); }
      };
      const seen = (name) => (src, x, y, ...rest) => {
        if (C === W.Player) { if (typeof src === "string") { if (sample.length < 6) sample.push(src.replace(/^.*\/(?=[^/]+\/[^/]+$)/, "")); } else canv++; }
        if (typeof src === "string" && BODY.test(src) && !all.some((b) => b[0] === src)) all.push([src, x, y]);
        if (typeof src === "string" && !done) {
          if (BODY.test(src)) { if (!body.some((b) => b[0] === src)) body.push([src, x, y]); }
          // the first thing worn over the skin, once all of it is drawn (as many skin pictures as last time)
          else { const m = groupRe.exec(src); if (m && !SKIN.test(m[1]) && body.length && body.length >= before.length) lay(); }
        }
        return real[name](src, x, y, ...rest);
      };
      const wrap = {}; for (const n of ["drawImage", "drawImageBlink", "drawImageColorize", "drawImageColorizeBlink"]) if (typeof real[n] === "function") wrap[n] = seen(n);
      args[1] = Object.assign({}, real, wrap);
      const out = next(args);
      lay();
      if (all.length) { const was = skinOf.get(C.MemberNumber); skinOf.set(C.MemberNumber, all);
        if (!was || was.map((b) => b[0]).join() !== all.map((b) => b[0]).join()) redrawMn(C.MemberNumber, 120); }   // (the whole skin is known now: draw again with it)
      return out;
    });
    sdk.hookFunction("ChatRoomSync", 0, (args, next) => { const r = next(args); setTimeout(() => { if (mine.length) tell(true); ask(); }, 3000); return r; });
  } catch (e) { DIAG.lastErr = "hook: " + String(e && e.message || e); console.warn("[Farmhand Companion] messes unavailable:", e); hooked = false; }
}
export function initMesses(mod) {
  sdk = mod; load();
  // a fresh mess keeps running for its first five minutes: drawn again once a minute while it does
  setInterval(() => {
    const fresh = (l) => l.some((e) => Date.now() - (e.t || 0) < 6 * 60000);
    if (fresh(mine)) redrawMe();
    for (const [mn, o] of others) if (fresh(o.list)) redrawMn(mn);
  }, 60000);
  setTimeout(() => { hook(); if (mine.length) { tell(true); redrawMe(); } ask(); }, 3500);
}

// ── how much it's holding (memlog.js) ──
export function messMemory() { let pics = 0; for (const p of made.values()) if (p.src) pics++; return { pictures: pics, bytesKB: Math.round(Array.from(made.values()).reduce((n, p) => n + (p.src ? p.src.length : 0), 0) / 1000), imgs: imgs.size, others: others.size }; }

// ── /farmmess: where a mess on you got to ──
export function messDiag() {
  const ago = (t) => (t ? Math.round((Date.now() - t) / 1000) + "s ago" : "never");
  const L = [];
  L.push("hooked: " + hooked + " · splatter kit: " + !!W.FarmMess + (W.FarmMess && W.FarmMess.KINDS ? " (" + Object.keys(W.FarmMess.KINDS).length + " kinds)" : ""));
  L.push("on you now: " + mine.length + (mine.length ? " · newest " + mine[mine.length - 1].k + " on " + mine[mine.length - 1].a.join("+") + ", " + ago(mine[mine.length - 1].t) : ""));
  L.push("marks from the bot: " + (DIAG.marks.length ? DIAG.marks.map((x) => (x.mess || "?") + " " + ago(x.at)).join(", ") : "none since this page opened"));
  L.push("your body drawn: " + DIAG.got + " times, with a mess " + DIAG.draws + " times");
  if (DIAG.draw) L.push("last mess drawing: " + ago(DIAG.draw.at) + ", " + DIAG.draw.list + " messes, " + DIAG.draw.pic + "; skin pictures seen: " + (DIAG.draw.body.join(" ") || "NONE") + "; first pictures: " + (DIAG.draw.sample || []).join(" ") + "; drawings handed over: " + (DIAG.draw.canv || 0));
  if (DIAG.lastErr) L.push("last error: " + DIAG.lastErr);
  L.push("others with messes: " + others.size);
  return L.join("\n");
}
