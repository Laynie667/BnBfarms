/* WHAT'S IN THIS FILE (breed.js)
   BREEDIN' ANYWHERE (Nov 19; Laynie: "We can improve the farms breeding im sure, so it works anywhere too", "I want to
   be the best baby factory wherever I go", then "all of them, non clinical language please, make it hot and sexy").
   • REAL LOADS, ANYWHERE (your switch, "Breed me anywhere", off to start): a cock in you (the game's own Penetrate
     actions) and its owner cums (the game's own orgasm): that's a load of theirs in you, in your seed books like any
     other (seed.js), handed to the farm girl, and it can catch there. Off the farm only: on her farm, her own scenes
     count it. Whoever it is has to be on your list.
       If they run the Dispensary too, theirs tells yours how big a load they gave and whether they're knotted
       (dispLoad), from the farm's numbers for their cock. Otherwise it's a good thick load.
   • KNOTS, ANYWHERE: a knotted cock ties you. For its minutes you can't step away from them on a map (it never stops
     you leavin' a room), and the room sees it swell, lock and let go.
   • HIPS UP: rump up on all fours, knees spread, or hogtied, within five minutes of a load in your pussy or ass, and
     it's likelier to take: the farm girl gives it its chance with your hips up.
   • RIPE DAYS: the farm keeps a cycle for you (Fertile on): two days in seven you're ripe, and a load takes twice as
     easy. Your Dispensary knows the days (dispWelcome), and you feel it, and now and then the room does too.
*/
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { useOf } from "../../shared/holes.js";
import { SEED_WORD, amountSay, loadSay } from "../../shared/seed.js";
import { BOT } from "./config.js";
import { st, save } from "./store.js";
import { allowed } from "./ladder.js";
import { LINES } from "./lines.js";
import { local, action, pick, nameOf, inRoom, myName } from "./say.js";
import { seedGive, seedMarkUp } from "./seed.js";
import "./lines-breed.js";

const W = window, MIN = 60000, HOUR = 3600000, DAY = 86400000;
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const botIn = () => (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
const charOf = (mn) => (mn === me() ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
export const breedAnyOn = () => st().breedAny === true;
const HOLE_OF = { ItemVulva: "vulva", ItemButt: "butt", ItemMouth: "mouth" };
export const DEFAULT_LOAD = [30, 60];   // a good thick load, from somebody the farm hasn't measured

// ── fill in a line ──
const said = {};
function lineOf(key, v) {
  const L = LINES.breed && LINES.breed[key]; if (!L || !L.length) return "";
  let t = pick(L); if (L.length > 1 && t === said[key]) t = L[(L.indexOf(t) + 1) % L.length];
  said[key] = t; v = v || {};
  return String(t).replace(/%t/g, myName()).replace(/%S/g, v.S || "somebody").replace(/%s/g, v.s || "somebody's").replace(/%a/g, v.a || "")
    .replace(/%l/g, v.l || "a load").replace(/%h/g, v.h || "pussy").replace(/^\s*(\S)/, (m, c) => m.slice(0, -1) + c.toUpperCase());
}

// ── THEIR SIDE: you just came in somebody (your Dispensary tells theirs how big, and if you're knotted) ──
let lastIn = null;   // { target, h, at }: where your cock last was
function myLoad() {
  const F = st().cock;   // the farm's numbers for your cock (dispWelcome)
  let ml = F && F.load > 0 ? F.load : DEFAULT_LOAD[0] + Math.random() * (DEFAULT_LOAD[1] - DEFAULT_LOAD[0]);
  try { const D = W.FarmhandDispensary; if (D && D.active && D.active("rut")) ml *= 1.5; } catch (e) { /* fine */ }
  const tie = F && F.knot ? (F.tie && F.tie.length === 2 ? F.tie : [5, 15]) : null;
  return { ml: Math.round(ml), knot: !!tie, mins: tie ? Math.round(tie[0] + Math.random() * (tie[1] - tie[0])) : 0 };
}
function onMyClimax() {
  const f = lastIn; lastIn = null;
  if (!f || Date.now() - f.at > 90000 || W.ActivityOrgasmRuined || !charOf(f.target)) return false;
  const L0 = myLoad();
  try { W.ServerSend("ChatRoomChat", makeMsg("dispLoad", { h: f.h, ml: L0.ml, knot: L0.knot ? 1 : 0, mins: L0.mins }, f.target)); } catch (e) { return false; }
  return true;
}

// ── YOUR SIDE: a load from a real cock (holes.js tells us whose cock was in you, and that they came) ──
const waiting = new Map();   // who → { h, at, t (timer) }: they came in you; their Dispensary may say how much
const told = new Map();      // who → { h, ml, knot, mins, at }: their Dispensary said it first
export function realLoad(from, h) {
  if (!breedAnyOn() || botIn() || !from || from === me() || !allowed(from)) return false;
  if (!["vulva", "butt", "throat", "mouth"].includes(h)) return false;
  h = h === "throat" ? "mouth" : h;
  const pre = told.get(from);
  if (pre && Date.now() - pre.at < 8000) { told.delete(from); book(from, h, pre); return true; }
  const w = waiting.get(from); if (w) clearTimeout(w.t);
  waiting.set(from, { h, at: Date.now(), t: setTimeout(() => { waiting.delete(from); book(from, h, null); }, 2500) });
  return true;
}
function onLoadMsg(from, m) {
  const o = { ml: Math.max(1, Math.min(5000, Number(m.ml) || 0)), knot: m.knot ? 1 : 0, mins: Math.max(0, Math.min(40, Number(m.mins) || 0)), at: Date.now() };
  const w = waiting.get(from);
  if (w) { clearTimeout(w.t); waiting.delete(from); book(from, w.h, o); return; }
  told.set(from, o);
}
function book(from, h, o) {
  const ml = o && o.ml ? o.ml : Math.round(DEFAULT_LOAD[0] + Math.random() * (DEFAULT_LOAD[1] - DEFAULT_LOAD[0]));
  const r = seedGive({ by: from, sire: from, nm: nameOf(from) !== "somebody" ? nameOf(from) : "", p: h + "=" + ml, via: "cock", quiet: true });
  if (!r || !r.ok) return null;
  const v = { S: nameOf(from), s: nameOf(from) + "'s", a: amountSay(ml), l: loadSay(ml), h: SEED_WORD[h] };
  local(lineOf("load_" + h, v) + ((r.spilt && r.spilt[h] >= 5) ? " " + lineOf("load_full", v) : ""));
  if (o && o.knot && h !== "mouth" && charOf(from)) tieTo(from, h, o.mins || 10);
  return r;
}

// ── a knot ──
function tieTo(by, h, mins) {
  const S = st(), now = Date.now();
  S.tie = { by, h, until: Math.max((S.tie && S.tie.by === by && S.tie.until) || 0, now + Math.max(3, mins) * MIN) };
  save();
  if (inRoom()) action(lineOf("knot_tie", { S: nameOf(by), h: SEED_WORD[h] }));
}
export const tied = () => { const t = st().tie; return t && t.until > Date.now() ? t : null; };
let tugAt = 0;
// a step on a map: while you're tied, only as far as you can go stuck on them
function tieOk(X, Y) {
  const t = tied(); if (!t) return true;
  const C = charOf(t.by), pos = C && C.MapData && C.MapData.Pos; if (!pos || typeof pos.X !== "number") return true;
  if (Math.max(Math.abs(X - pos.X), Math.abs(Y - pos.Y)) <= 1) return true;
  if (Date.now() - tugAt > 20000) { tugAt = Date.now(); local(lineOf("knot_tug", { S: nameOf(t.by), h: SEED_WORD[t.h] })); }
  return false;
}
function tieTick(now) {
  const t = st().tie; if (!t) return;
  if (t.until <= now || !charOf(t.by)) {
    delete st().tie; save();
    if (inRoom() && charOf(t.by)) action(lineOf("knot_free", { S: nameOf(t.by), h: SEED_WORD[t.h] }));
  }
}

// ── hips up, after a load ──
const UP_POSES = ["AllFours", "Hogtied", "KneelingSpread"];
export function hipsUp() { try { const P = W.Player, lower = P && P.PoseMapping && P.PoseMapping.BodyLower; return UP_POSES.includes(lower); } catch (e) { return false; } }
function upTick(now) {
  if (!hipsUp()) return;
  const n = seedMarkUp(now - 5 * MIN);   // (seed.js: the loads in your pussy or ass from the last five minutes)
  if (n && n.who) local(lineOf("legs_up", { s: n.who === me() ? "your own" : (nameOf(n.who) !== "somebody" ? nameOf(n.who) : n.nm || "their") + "'s" }));
}

// ── ripe days (the farm's cycle for you, Fertile on) ──
export function ripeNow(now) {
  const R = st().ripe; if (!R || !(R.at > 0)) return false;
  now = now || Date.now();
  const d = Math.floor((now - R.at) / DAY), every = R.every || 7, k = ((d % every) + every) % every;
  return k >= (R.from || 3) && k < (R.from || 3) + (R.days || 2);
}
let ripeWas = null, ripeNext = 0, ripeRoomNext = 0;
function ripeTick(now) {
  const r = ripeNow(now);
  if (ripeWas === null) { ripeWas = r; ripeNext = now + (20 + Math.random() * 20) * MIN; ripeRoomNext = now + (60 + Math.random() * 60) * MIN; return; }
  if (r !== ripeWas) { ripeWas = r; local(lineOf(r ? "ripe_start" : "ripe_end")); ripeNext = now + (30 + Math.random() * 20) * MIN; return; }
  if (!r || !inRoom()) return;
  if (now >= ripeNext) { ripeNext = now + (35 + Math.random() * 25) * MIN; local(lineOf("ripe_mine")); }
  if (now >= ripeRoomNext) { ripeRoomNext = now + (90 + Math.random() * 60) * MIN; action(lineOf("ripe_room")); }
}
// the farm's numbers for you (dispWelcome): your ripe days, your cock
export function breedWelcome(m) {
  const S = st();
  if (m && m.ripe && typeof m.ripe === "object" && Number(m.ripe.at) > 0) S.ripe = { at: Number(m.ripe.at), every: Math.max(2, Math.min(30, Number(m.ripe.every) || 7)), from: Math.max(0, Math.min(29, Number(m.ripe.from) || 3)), days: Math.max(1, Math.min(10, Number(m.ripe.days) || 2)) };
  else if (m && m.ripe === null) delete S.ripe;
  if (m && m.cock && typeof m.cock === "object") S.cock = { load: Math.max(0, Math.min(5000, Math.round(Number(m.cock.load) || 0))), knot: !!m.cock.knot, tie: Array.isArray(m.cock.tie) ? m.cock.tie.slice(0, 2).map((x) => Math.max(1, Math.min(40, Number(x) || 5))) : null };
  else if (m && m.cock === null) delete S.cock;
  save();
}

export function breedTick(now) {
  now = now || Date.now();
  tieTick(now);
  upTick(now);
  ripeTick(now);
}

export function initBreed(mod) {
  // the actions you do to somebody (yours: where your cock is) and their loads in you
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try {
        const data = args[0];
        if (data && data.Type === "Activity" && data.Sender === me()) {
          const D = Array.isArray(data.Dictionary) ? data.Dictionary : [], get = (k) => { const e = D.find((x) => x && x[k] != null); return e ? e[k] : null; };
          const name = String(get("ActivityName") || ""), tgt = Number(get("TargetCharacter")) || 0, grp = String(get("FocusGroupName") || ""), A = D.find((x) => x && x.Tag === "ActivityAsset");
          const U = useOf(name, A ? A.AssetName : "", ""), h = HOLE_OF[grp];
          if (U && U.cock && h && tgt && tgt !== me()) lastIn = { target: tgt, h: h === "mouth" ? "throat" : h, at: Date.now() };
        } else if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me()) {
          const m = readMsg(data); if (m && m.type === "dispLoad") onLoadMsg(data.Sender, m);
        }
      } catch (e) { console.warn("[Dispensary] breed:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] breedin' can't hear the room:", e); }
  try { mod.hookFunction("ActivityOrgasmStart", 2, (args, next) => { try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer()) setTimeout(() => onMyClimax(), 300); } catch (e) { /* fine */ } return next(args); }); } catch (e) { /* fine */ }
  // a knot holds you where you are on a map
  try { mod.hookFunction("ChatRoomMapViewCanEnterTile", 2, (args, next) => { const t = next(args); try { return t > 0 && !tieOk(args[0], args[1]) ? 0 : t; } catch (e) { return t; } }); } catch (e) { /* fine */ }
}
// (tests)
export const breedReset = () => { lastIn = null; waiting.forEach((w) => clearTimeout(w.t)); waiting.clear(); told.clear(); delete st().tie; ripeWas = null; };
export const breedClimax = () => onMyClimax();
export const breedLastIn = () => lastIn;
