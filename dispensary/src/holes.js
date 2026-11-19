/* WHAT'S IN THIS FILE (holes.js)
   HOLE TRAINING, ANYWHERE (Nov 18; Laynie: "if we can do the hole training better, i would love to explore that idea",
   then all seven of the ideas, and: too big goes in "aching, sometimes even painful", a "cruel" or "sadist" tag, the
   heal switch off to start, and goals from "anyone who can dose"). The rules are in shared/holes.js; the farm girl
   reads the same ones.
   • THE BOOKS ARE THE FARM'S. Your pussy, ass and throat each have a size: how open it is now (stretched) and its
     usual (trained). Your Dispensary keeps a copy and counts what happens off the farm, and hands it to the farm girl
     the next time you're both in a room (dispHoles); she sends her numbers back (dispHolesOk). Without the farm, your
     Dispensary's numbers are the only ones.
   • TOYS IN YOU stretch you to their size, and how it feels goes by how much bigger they are than you're trained:
     a good stretch, an ache, or it hurts (your "Too-big toys can hurt" switch keeps it at an ache). A trainer (crafted
     to say stretcher, trainer, gaper and such, or cruel, or with a goal) trains your usual up while it's in.
   • A PUMP OR BEADS crafted as a trainer grows with you: once you've caught up with it, it pumps up a notch (or slides
     another bead in), up to its goal. A cruel one doesn't wait for you.
   • GOALS: on the trainer ("goal: gaping", "train her to loose in 3 days"), or sent by somebody allowed to dose you
     (/dispensary train <who> <ass|pussy|throat> <size> [in 3 days | by friday]). In a hurry, it works you harder.
   • USE: fingers, a tongue, a fist, a cock or a toy from somebody's hand stretch you, and train you a little when
     they're bigger than you're trained. A cock that cums in a loose hole drips back out (the Companion draws it).
   • HEALIN' (your switch, off to start): left be a day, your usual closes half a size a day.
   • THE ROOM NOTICES a loose hole, now and then, when it's bare. Only you hear about it when it's covered or plugged.
   The safeword lifts every goal and rests your gear 15 minutes (what's in you still holds you open: it's in you).
*/
import { HOLES, HOLE_SIZES, HOLE_WORD, TRAIN_H, TIGHTEN_H, HEAL_GRACE_H, HEAL_PER_DAY, USE_BUDGET_H, clampSize, sizeWord, sizeSay, toyIn, pumpSize, pumpRecord, rateOf, hurtOf, useOf, goalSize, goalDue, holeOfGroup } from "../../shared/holes.js";
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { BOT } from "./config.js";
import { st, save } from "./store.js";
import { craftText } from "./needle.js";
import { allowed } from "./ladder.js";
import { LINES } from "./lines.js";
import { local, action, fill, pick, nameOf, inRoom } from "./say.js";
import { setArousal } from "./doses.js";
import { hornyOf } from "./horny.js";
import "./lines-holes.js";

const W = window, MIN = 60000, HOUR = 3600000, DAY = 86400000;
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const botIn = () => (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
const charOf = (mn) => (mn === me() ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
const okBy = (by) => !by || by === me() || allowed(by);
const paused = (now) => (st().wornPause || 0) > (now || Date.now());
export const painOn = () => st().holesPain !== false;
export const healOn = () => st().holesHeal === true;

// ── your books ──
function H() {
  const S = st();
  if (!S.holes || typeof S.holes !== "object") S.holes = {};
  const o = S.holes;
  if (!o.m || typeof o.m !== "object") o.m = {};
  if (!Array.isArray(o.pend)) o.pend = [];
  if (!o.goals || typeof o.goals !== "object") o.goals = {};
  if (typeof o.id !== "number") o.id = 0;
  if (typeof o.ep !== "string" || !o.ep) o.ep = Math.random().toString(36).slice(2, 10);   // (these books' own name: the farm girl starts countin' again for a fresh one)
  return o;
}
// one hole: n stretched now · u trained · cr hours toward the next size · t last trained or used · g last stretched ·
// hl healin' · tk the toy in it (and ta since when) · pa its last pump · gd a toy's goal already met
function hole(h) {
  const o = H(), S = HOLE_SIZES[h];
  let x = o.m[h];
  if (!x || typeof x !== "object") x = o.m[h] = { n: S.start, u: S.start, cr: 0, t: 0, g: 0, hl: 0 };
  return x;
}
// the holes you have: the farm's word if it's said, otherwise your body's
export function holesHave() {
  const o = H();
  if (Array.isArray(o.has) && o.has.length) return HOLES.filter((h) => o.has.includes(h));
  const P = W.Player; let v = true;
  try { if (P && typeof P.HasVagina === "function") v = !!P.HasVagina(); else if (P && typeof P.HasPenis === "function") v = !P.HasPenis(); } catch (e) { /* as it is */ }
  return (v ? ["vulva"] : []).concat(["butt", "throat"]);
}

// ── what goes to the farm girl ──
// one change: up (usual + k) · down (usual - k) · tight (usual - k, and closed to it) · set (usual and now = k, your
// own pick) · st (stretched to at least k)
function change(h, op) {
  const o = H(), last = o.pend[o.pend.length - 1];
  const kinds = Object.keys(op);
  if (last && last.h === h && kinds.length === 1 && Object.keys(last).filter((k) => k !== "h").join() === kinds[0]) {
    const k = kinds[0]; if (k === "st") last.st = Math.max(last.st, op.st); else if (k === "set") last.set = op.set; else last[k] += op[k];
  } else o.pend.push(Object.assign({ h }, op));
  if (o.pend.length > 80) o.pend = o.pend.slice(-80);
  save(); sendSoon();
}
let sendT = null, askedAt = 0;
function sendSoon() { clearTimeout(sendT); sendT = setTimeout(() => { try { sendNow(false); } catch (e) { /* fine */ } }, 1500); }
// hand what's waitin' to the farm girl, if she's here: everything in one go, under one number, till she says she has it
export function sendNow(ask) {
  const o = H();
  if (!botIn() || typeof W.ServerSend !== "function") return false;
  if (o.fly && Date.now() - (o.fly.at || 0) < 60000) return false;   // (waitin' on her: she'll answer)
  if (!o.fly && o.pend.length) { o.id += 1; o.fly = { id: o.id, ops: o.pend.slice(0, 60), at: 0 }; o.pend = o.pend.slice(60); }
  const f = o.fly;
  if (!f && !ask) return false;
  try { W.ServerSend("ChatRoomChat", makeMsg("dispHoles", f ? { ep: o.ep, id: f.id, ops: f.ops } : { ep: o.ep, id: 0, ops: [] }, BOT)); } catch (e) { return false; }
  if (f) f.at = Date.now();
  askedAt = Date.now(); save();
  return true;
}
// her numbers: { vulva: [now, usual], ... } and the holes she says you have
function fromFarm(sizes, has) {
  const o = H();
  if (Array.isArray(has)) o.has = has.filter((h) => HOLES.includes(h));
  if (o.fly || o.pend.length || !sizes || typeof sizes !== "object") return;   // (ours are ahead of hers: wait)
  for (const h of HOLES) {
    const v = sizes[h]; if (!Array.isArray(v)) continue;
    const x = hole(h); x.n = clampSize(h, v[0]); x.u = clampSize(h, v[1]); if (x.n < x.u) x.n = x.u;
  }
  o.sync = Date.now(); save();
}
export function holesWelcome(m) { if (m && m.holes) fromFarm(m.holes.sizes, m.holes.has); }
function onOk(m) {
  const o = H(), id = Number(m.id) || 0;
  if (o.fly && id >= o.fly.id) o.fly = null;
  if (m.none) { o.sync = 0; save(); return; }   // (not on her books: yours are the only ones)
  fromFarm(m.sizes, m.has);
}

// ── the toys in you ──
const keyOf = (it) => it.Asset.Group.Name + ":" + it.Asset.Name + ":" + ((it.Craft && it.Craft.Name) || "");
export function toysNow() {
  const P = W.Player, out = {};
  if (!P || !Array.isArray(P.Appearance)) return out;
  for (const item of P.Appearance) {
    if (!item || !item.Asset || !item.Asset.Group || !holeOfGroup(item.Asset.Group.Name)) continue;
    const text = craftText(item), T = toyIn(item, text);
    if (!T || (out[T.hole] && out[T.hole].size >= T.size)) continue;
    T.item = item; T.key = keyOf(item); T.text = text; T.horny = !!hornyOf(text);
    out[T.hole] = T;
  }
  return out;
}

// ── goals ──
// the goal on a hole: one somebody sent (if they may still dose you), else the trainer's own
function goalFor(h, T, x) {
  const g = H().goals[h];
  if (g && g.to > 0 && okBy(g.by)) return { to: g.to, due: g.due || 0, by: g.by, sent: true };
  if (T && T.goal && T.trainer && okBy(T.by) && x.gd !== T.key) return { to: T.goal.to, due: T.goal.inMs ? (x.ta || Date.now()) + T.goal.inMs : 0, by: T.by, sent: false };
  return null;
}
export function setGoal(h, to, by, inMs) {
  if (!HOLES.includes(h) || !holesHave().includes(h)) return { ok: false, why: "hole" };
  const S = HOLE_SIZES[h]; to = Math.max(S.start, Math.min(S.natural, Math.round(Number(to) || 0)));
  if (!to) return { ok: false, why: "size" };
  if (to <= hole(h).u) return { ok: false, why: "already", to };
  H().goals[h] = { to, by: Number(by) || me(), due: inMs > 0 ? Date.now() + Math.min(30 * DAY, inMs) : 0, at: Date.now() };
  save();
  return { ok: true, to };
}
export function clearGoal(h) { const o = H(); if (h) { if (!o.goals[h]) return false; delete o.goals[h]; } else { if (!Object.keys(o.goals).length) return false; o.goals = {}; } save(); return true; }

// ── what's said ──
const lines = (key) => (LINES.holes && LINES.holes[key]) || [];
function line(key, h, v) {
  const L = lines(key); if (!L.length) return "";
  const x = hole(h);
  return fill(pick(L), { by: v && v.by }).replace(/%g/g, (v && v.g) || "toy").replace(/%h/g, HOLE_WORD[h]).replace(/%u/g, (v && v.u) || "it").replace(/%s/g, sizeSay(h, v && v.s != null ? v.s : x.u));
}
const tk = (h, key) => (h === "throat" ? key + "_t" : key);
const said = {};   // hole → when a line about it was last said (so they don't pile up)
function say(key, h, v, room) { const t = line(tk(h, key), h, v) || line(key, h, v); if (!t) return ""; said[h] = Date.now(); if (room) action(t); else local(t); return t; }

// ── every few seconds ──
let lastTick = 0;
const nextBeat = {}, nextPump = {};
export function holesTick(now) {
  now = now || Date.now();
  const dt = lastTick ? Math.max(0, Math.min(now - lastTick, 15 * MIN)) : 0;
  lastTick = now;
  const have = holesHave(), toys = toysNow(), rest = paused(now);
  let dirty = false;
  for (const h of have) {
    const x = hole(h), T = toys[h], S = HOLE_SIZES[h];
    // stretched holes tighten back a size a day, down to their usual (the farm's own rule)
    if (!T && x.n > x.u && now - (x.g || 0) > TIGHTEN_H * HOUR) { x.n -= 1; x.g = now; dirty = true; }
    if (x.n < x.u) x.n = x.u;
    if (T) {
      if (x.tk !== T.key) {
        const was = Math.max(x.n, x.u); x.tk = T.key; x.ta = now; x.gd = T.goal && T.goal.to <= x.u ? T.key : "";   // (a goal you're already at: met)
        if (inRoom() && !rest) say("in_" + feel(T, was), h, { g: T.name }, true);
        nextBeat[h] = now + (4 + Math.random() * 4) * MIN; dirty = true;
      }
      if (!nextBeat[h]) nextBeat[h] = now + (3 + Math.random() * 4) * MIN;   // (after a reload: a little while first)
      if (T.size > x.n) { x.n = T.size; change(h, { st: x.n }); }
      x.g = now;
      if (!rest && train(h, x, T, dt, now)) dirty = true;
      if (!rest && T.pump && inRoom()) pumpTick(h, x, T, now);
      if (!rest && inRoom() && now >= (nextBeat[h] || 0)) { nextBeat[h] = now + (6 + Math.random() * 4) * MIN; beat(h, x, T); }
    } else if (x.tk) { x.tk = ""; x.ta = 0; delete nextBeat[h]; dirty = true; }
    // healin' (your switch): left be a day, the usual closes half a size a day
    if (healOn() && !T && x.u > S.start && now - Math.max(x.t || 0, x.g || 0) > HEAL_GRACE_H * HOUR && dt > 0) {
      x.hl = (x.hl || 0) + HEAL_PER_DAY * dt / DAY;
      if (x.hl >= 1) { x.hl = 0; x.u -= 1; if (x.n > x.u && now - (x.g || 0) > TIGHTEN_H * HOUR) x.n = x.u; change(h, { down: 1 }); say("heal", h, {}, false); }
      dirty = true;
    }
  }
  if (!rest) notice(now, toys);
  dripTick(now);
  // the farm girl: hand her what's waitin', and now and then ask for her numbers
  const o = H();
  if (botIn() && (o.pend.length || (o.fly && now - (o.fly.at || 0) > 60000) || now - askedAt > 10 * MIN)) sendNow(true);
  if (dirty && Math.random() < 0.1) save();
  return toys;
}
// how a toy feels to you: by how much bigger it is than you're trained
const feel = (T, u) => { const a = hurtOf(T.size - u, T.cruel, painOn()); return T.cruel && a >= 2 ? "cruel" : String(a); };

// the trainer works your usual up
function train(h, x, T, dt, now) {
  if (!T.trainer || !okBy(T.by) || !(dt > 0) || x.gd === T.key) return false;   // (its goal met: it's done with you)
  const S = HOLE_SIZES[h], G = goalFor(h, T, x), cap = Math.min(S.natural, T.size, G ? G.to : 99);
  if (x.u >= cap) { if (G && x.u >= G.to) goalMet(h, x, T, G); return false; }
  let r = rateOf(T.size - x.u, T.cruel);
  if (G && G.due) { const need = (G.to - x.u) * TRAIN_H * HOUR / Math.max(HOUR, G.due - now); r = Math.max(r, Math.min(4, need)); }   // in a hurry: it works you harder
  x.cr = (x.cr || 0) + r * dt / HOUR; x.t = now;
  let up = 0;
  while (x.cr >= TRAIN_H && x.u < cap) { x.cr -= TRAIN_H; x.u += 1; up++; if (x.n < x.u) x.n = x.u; }
  if (x.u >= cap) x.cr = Math.min(x.cr, TRAIN_H * 0.99);
  if (up) { change(h, { up }); if (inRoom()) say("trained", h, { g: T.name, s: x.u }, true); }
  if (G && x.u >= G.to) goalMet(h, x, T, G);
  return true;
}
function goalMet(h, x, T, G) {
  if (G.sent) clearGoal(h); else x.gd = T ? T.key : "";
  if (inRoom()) say("goal_done", h, { g: T ? T.name : "trainin'", s: x.u }, true);
  save();
}
// a pump or beads that grows with you: you've caught up with it (a cruel one doesn't wait), so up a notch
function pumpTick(h, x, T, now) {
  if (!T.trainer || !okBy(T.by) || !T.pump || x.gd === T.key) return false;
  const n = T.pump.n, last = T.pump.sizes.length - 1;
  if (n >= last || now < (nextPump[h] || 0)) return false;
  const G = goalFor(h, T, x), aim = Math.min(HOLE_SIZES[h].natural, G ? G.to : HOLE_SIZES[h].natural);
  if (T.size >= aim && x.u >= aim) return false;
  let want = x.u >= T.size || (T.cruel && x.u >= T.size - 1);
  if (!want && G && G.due) { const need = (G.to - x.u) * TRAIN_H * HOUR / Math.max(HOUR, G.due - now); want = need > rateOf(T.size - x.u, T.cruel) && T.size - x.u < 3; }   // behind: bigger, so it works faster
  if (!want || T.size >= aim + (T.cruel ? 1 : 0)) return false;
  nextPump[h] = now + 20 * MIN;
  try {
    if (typeof W.ExtendedItemSetOptionByRecord !== "function") return false;
    W.ExtendedItemSetOptionByRecord(W.Player, T.item, pumpRecord(T, n + 1), { push: true, C_Source: W.Player, refresh: true });
  } catch (e) { console.warn("[Dispensary] the trainer couldn't pump:", e); return false; }
  const bigger = pumpSize(T, n + 1);
  if (bigger > x.n) { x.n = bigger; change(h, { st: x.n }); }
  if (inRoom()) say(h === "throat" ? "pump" : T.pump.kind === "beads" ? "pump_beads" : T.cruel ? "pump_cruel" : "pump", h, { g: T.name }, true);
  return true;
}
// while it's in: how it feels, now and then
function beat(h, x, T) {
  const f = feel(T, x.u);
  if (f === "0") return "";
  if (T.horny && Math.random() < 0.5) return "";   // (horny gear's busy with you already: horny.js)
  const A = W.Player && W.Player.ArousalSettings, p = A && Number(A.Progress) || 0;
  if (A) setArousal(f === "1" ? p + 4 : f === "2" ? p + 2 : f === "3" ? p - 10 : p - 6);
  const room = f !== "1" && Math.random() < 0.3;
  return say((room ? "room_" : "mine_") + f, h, { g: T.name }, room) || say("mine_" + f, h, { g: T.name }, false);
}

// ── the room notices ──
let nextNotice = 0;
function bare(h) {
  try {
    const P = W.Player, I = W.InventoryPrerequisiteMessage; if (typeof I !== "function") return false;
    if (h === "butt") return I(P, "AccessButt") === "" && !(P.IsButtChaste && P.IsButtChaste());
    return I(P, "AccessCrotch") === "" && I(P, "AccessVulva") === "" && !(P.IsVulvaChaste && P.IsVulvaChaste());
  } catch (e) { return false; }
}
function notice(now, toys) {
  if (!inRoom()) { nextNotice = 0; return; }
  if (!nextNotice) { nextNotice = now + (10 + Math.random() * 15) * MIN; return; }
  if (now < nextNotice) return;
  nextNotice = now + (25 + Math.random() * 20) * MIN;
  const have = holesHave().filter((h) => now - (said[h] || 0) > 10 * MIN);
  const loose = have.filter((h) => h !== "throat" && hole(h).n >= 5);
  if (loose.length) {
    const h = loose[Math.floor(Math.random() * loose.length)], x = hole(h), T = toys[h];
    if (T) return say("notice_plug", h, { g: T.name }, false);
    if (bare(h)) return say(x.n >= 10 ? "notice_10" : x.n >= 7 ? "notice_7" : "notice_5", h, { s: x.n }, true);
    return Math.random() < 0.5 ? say("notice_cover", h, {}, false) : "";
  }
  if (have.includes("throat") && hole("throat").u >= 6 && Math.random() < 0.4) return say("notice", "throat", {}, false);
  return "";
}

// ── use: somebody's fingers, tongue, fist, cock or toy, in you ──
const usedAt = {};    // who:hole → when (counted at most every 45 seconds)
const inMe = new Map();   // who → { h, at } (their cock was in you: a load, if they cum soon)
function budgetLeft(x, now) { if (!x.ub || now - x.ub.at > HOUR) x.ub = { at: now, n: 0 }; return Math.max(0, USE_BUDGET_H - x.ub.n); }
export function holesUsed(from, act, group, asset, text, toyName) {
  const h = holeOfGroup(group); if (!h || h === "throat" && group !== "ItemMouth") return null;
  if (!holesHave().includes(h)) return null;
  const U = useOf(act, asset, text); if (!U) return null;
  if (toyName) U.toyName = toyName;
  const now = Date.now(), k = from + ":" + h;
  if (U.cock && from && from !== me()) inMe.set(from, { h, at: now });
  if (now - (usedAt[k] || 0) < 45000) return null;
  usedAt[k] = now;
  const x = hole(h), was = x.u, S = HOLE_SIZES[h];
  x.t = now;
  if (U.size > x.n) { x.n = U.size; x.g = now; change(h, { st: x.n }); }
  // trainin' a little: only past your usual, only up to its own size, and only so much an hour
  const d = U.size - x.u, cap = Math.min(S.natural, U.size);
  if (d >= 1 && x.u < cap && !paused(now)) {
    const add = Math.min(U.cr * rateOf(d, false) * (from === me() ? 0.5 : 1), budgetLeft(x, now));
    x.ub.n += add; x.cr = (x.cr || 0) + add;
    let up = 0; while (x.cr >= TRAIN_H && x.u < cap) { x.cr -= TRAIN_H; x.u += 1; up++; }
    if (up) { change(h, { up }); if (inRoom()) say("trained", h, { g: U.toy ? "toy" : U.kind, s: x.u }, true); }
  }
  save();
  // how it felt (only you see it), at most every three minutes
  const f = hurtOf(U.size - was, false, painOn());
  if (f && now - (said[h] || 0) > 3 * MIN) say("use_" + f, h, { u: whatWent(from, U) }, false);
  return { h, size: U.size, felt: f };
}
function whatWent(from, U) {
  const who = !from || from === me() ? "your own" : nameOf(from) + "'s";
  if (U.toy) return U.toyName ? "the " + U.toyName : "the " + String(U.toy).replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return who + " " + ({ fingers: "fingers", tongue: "tongue", fist: "fist", cock: "cock" })[U.kind];
}
// they came: a load in you, if their cock was just in you
const drips = [];   // { h, by, at }
let onLoad = null;   // (Nov 19, breed.js: a real load, on your seed books when you've said "Breed me anywhere")
export function holesOnLoad(f) { onLoad = f; }
export function holesClimaxOf(from) {
  const e = inMe.get(from); if (!e) return false;
  inMe.delete(from);
  if (Date.now() - e.at > 90000) return false;
  const h = e.h, x = hole(h), toys = toysNow();
  let booked = false;   // (on your books: breed.js says it in its own words, so not twice)
  if (onLoad) { try { booked = !!onLoad(from, h); } catch (err) { /* fine */ } }
  if (h === "throat") { if (!booked) say("swallow", h, { by: nameOf(from) }, false); return true; }
  if (x.n >= 5 && !toys[h]) drips.push({ h, by: from, at: Date.now() + (40 + Math.random() * 80) * 1000 });
  else if (!booked) say("kept", h, { by: nameOf(from) }, false);
  return true;
}
function dripTick(now) {
  for (let i = drips.length - 1; i >= 0; i--) {
    const d = drips[i]; if (now < d.at) continue;
    drips.splice(i, 1);
    if (!inRoom()) continue;
    say("drip", d.h, { by: nameOf(d.by) }, true);
    try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail: { type: "leak", mess: "cum", areas: ["thighs"], amount: 1 } })); } catch (e) { /* fine */ }
  }
}

// ── the Tightening Balm on a hole (doses.js) ──
// which: "vulva", "butt", "throat" or "holes" (all of them) · x: how strong (two sizes a dose)
export function holesBalm(which, x, quiet) {
  const list = which === "holes" ? holesHave() : holesHave().filter((h) => h === which);
  const toys = toysNow(), out = [];
  for (const h of list) {
    const o = hole(h), S = HOLE_SIZES[h], k = Math.min(o.u - S.start, 2 * Math.max(1, Math.min(5, Number(x) || 1)));
    const T = toys[h];
    if (k <= 0 && o.n <= o.u) { if (!quiet) say("balm_none", h, {}, true); continue; }
    o.u -= Math.max(0, k); o.cr = 0; o.hl = 0; if (!T) { o.n = o.u; o.g = Date.now(); }
    change(h, { tight: Math.max(0, k) });
    if (!quiet) say(T ? "balm_plug" : "balm", h, { g: T && T.name, s: o.u }, true);
    out.push(h);
  }
  save();
  return out;
}
// ASS GROWTH, ANAL GAPE, PUSSY GAPE (Nov 19): the farm's own shot, off the farm. The hole opens a size for good, trained
// that way, up to natural (only the farm girl's own shots go past it). A Tightening Balm closes it back up.
export function holesGape(which, x, quiet) {
  const out = [];
  for (const h of holesHave().filter((k) => k === which)) {
    const o = hole(h), S = HOLE_SIZES[h], k = Math.min(S.natural - o.u, Math.max(1, Math.min(5, Number(x) || 1)));
    if (k <= 0) { if (!quiet) say("gape_max", h, {}, true); continue; }
    o.u += k; o.n = Math.max(o.n, o.u); o.g = Date.now(); o.hl = 0;
    change(h, { up: k });
    if (!quiet) say("gape", h, { s: o.u }, true);
    out.push(h);
  }
  save();
  return out;
}
// your own pick (the page, like the farm's ?size): your usual, up to natural
export function holesSet(h, lvl) {
  if (!holesHave().includes(h)) return false;
  const S = HOLE_SIZES[h], n = Math.max(S.start, Math.min(S.natural, Math.round(Number(lvl) || 0)));
  const x = hole(h); x.u = n; x.n = Math.max(n, toysNow()[h] ? x.n : n); x.cr = 0; x.hl = 0;
  change(h, { set: n });
  return true;
}
// the safeword: every goal lifted
export function holesSafe() { return clearGoal(); }

// ── what the page, the Companion and the tests read ──
export function holesNow() {
  const out = {}, toys = toysNow(), o = H();
  for (const h of holesHave()) {
    const x = hole(h), T = toys[h], G = goalFor(h, T, x);
    out[h] = { label: HOLE_SIZES[h].label, now: x.n, trained: x.u, nowWord: sizeWord(h, x.n), trainedWord: sizeWord(h, x.u),
      toward: Math.max(0, Math.min(99, Math.floor(100 * (x.cr || 0) / TRAIN_H))),
      toy: T ? { name: T.name, size: T.size, feel: feel(T, x.u), trainer: T.trainer, cruel: T.cruel, pump: !!T.pump } : null,
      goal: G ? { to: G.to, word: sizeWord(h, G.to), due: G.due, by: G.by } : null };
  }
  return { holes: out, waiting: o.pend.length + (o.fly ? o.fly.ops.length : 0), sync: o.sync || 0, heal: healOn(), pain: painOn() };
}

// ── hearin' the room ──
function onActivity(data) {
  const D = Array.isArray(data.Dictionary) ? data.Dictionary : [], get = (key) => { const e = D.find((x) => x && x[key] != null); return e ? e[key] : null; };
  const name = String(get("ActivityName") || ""), src = Number(get("SourceCharacter")) || Number(data.Sender) || 0, tgt = Number(get("TargetCharacter")) || 0;
  if (tgt !== me()) return;
  const grp = String(get("FocusGroupName") || ""), A = D.find((x) => x && x.Tag === "ActivityAsset");
  let text = "";
  if (A) { const C = charOf(src), it = C && Array.isArray(C.Appearance) ? C.Appearance.find((i) => i && i.Asset && i.Asset.Name === A.AssetName && i.Asset.Group && i.Asset.Group.Name === A.GroupName) : null; text = craftText(it) || String(A.CraftName || "").toLowerCase(); }
  holesUsed(src, name, grp, A ? A.AssetName : "", text, A && A.CraftName ? String(A.CraftName) : "");
}
export function initHoles(mod) {
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try {
        const data = args[0];
        if (data && data.Type === "Activity") {
          if (/^Orgasm\d$/.test(String(data.Content || "")) && typeof data.Sender === "number" && data.Sender !== me()) holesClimaxOf(data.Sender);
          else onActivity(data);
        } else if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me()) {
          const m = readMsg(data);
          if (m && m.type === "dispHolesOk" && data.Sender === BOT) onOk(m);
          else if (m && m.type === "dispTrain") onTrain(data.Sender, m);
          else if (m && m.type === "dispTrainOk") onTrainOk(data.Sender, m);
        }
      } catch (e) { console.warn("[Dispensary] holes:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] holes can't hear the room:", e); }
  // walkin' into a room with the farm girl: hand her what's waitin'
  try { mod.hookFunction("ChatRoomSync", 2, (args, next) => { const r = next(args); setTimeout(() => { try { sendNow(true); } catch (e) { /* fine */ } }, 4000); return r; }); } catch (e) { /* the tick still does */ }
}

// ── goals sent between Dispensaries: /dispensary train <who> <hole> <size> [in 3 days | by friday] ──
export const HOLE_OF_WORD = (w) => { w = String(w || "").toLowerCase(); return /^(ass|butt|bum|asshole|anus|backdoor)$/.test(w) ? "butt" : /^(pussy|cunt|vulva|slit|cooch)$/.test(w) ? "vulva" : /^(throat|mouth|gullet)$/.test(w) ? "throat" : ""; };
export function sendGoal(to, h, words) {
  const size = goalSize(h, words), due = goalDue(words);
  if (!size) return { ok: false, why: "size" };
  if (to === me()) { const r = setGoal(h, size, me(), due); return r.ok ? { ok: true, self: true, to: size } : r; }
  try { W.ServerSend("ChatRoomChat", makeMsg("dispTrain", { h, to: size, due }, to)); return { ok: true, to: size }; } catch (e) { return { ok: false, why: "send" }; }
}
export function sendClear(to, h) {
  if (to === me()) return { ok: clearGoal(h || ""), self: true };
  try { W.ServerSend("ChatRoomChat", makeMsg("dispTrain", { h: h || "", clear: true }, to)); return { ok: true }; } catch (e) { return { ok: false, why: "send" }; }
}
function onTrain(from, m) {
  const h = String(m.h || "");
  const reply = (ok, why) => { try { W.ServerSend("ChatRoomChat", makeMsg("dispTrainOk", { h, ok, why: why || "", to: Number(m.to) || 0, clear: !!m.clear }, from)); } catch (e) { /* fine */ } };
  if (!allowed(from)) { local(nameOf(from) + " tried to set you a trainin' goal, but they aren't on your list."); return reply(false, "ladder"); }
  if (m.clear) { const g = H().goals; if (h && g[h]) delete g[h]; else if (!h) H().goals = {}; save(); local(nameOf(from) + " lifted your trainin' goal" + (h && HOLE_WORD[h] ? " for your " + HOLE_WORD[h] : "s") + "."); return reply(true); }
  if (!HOLES.includes(h)) return reply(false, "hole");
  const r = setGoal(h, m.to, from, Number(m.due) || 0);
  if (!r.ok) { return reply(false, r.why); }
  const g = H().goals[h];
  local("🎯 " + nameOf(from) + " has set you a trainin' goal: your " + HOLE_WORD[h] + ", " + sizeWord(h, r.to) + (g.due ? ", " + dueWords(g.due) : "") + ". Your trainers will work you there.");
  reply(true);
}
function onTrainOk(from, m) {
  const h = HOLE_WORD[m.h] || "holes";
  if (m.clear) { local(m.ok ? "Lifted " + nameOf(from) + "'s trainin' goal." : "Couldn't lift " + nameOf(from) + "'s goal: " + (m.why === "ladder" ? "you aren't on their list." : "they've none.")); return; }
  local(m.ok ? "🎯 " + nameOf(from) + "'s " + h + " has a goal now: " + sizeWord(m.h, m.to) + ". Their trainers will work them there."
    : "Couldn't set " + nameOf(from) + "'s goal: " + (m.why === "ladder" ? "you aren't on their list of who can dose them." : m.why === "hole" ? "they haven't got that." : m.why === "already" ? "they're already that open." : "that didn't take."));
}
export function dueWords(t) {
  const ms = t - Date.now();
  if (ms <= 0) return "overdue";
  return ms < 36 * HOUR ? "in " + Math.max(1, Math.round(ms / HOUR)) + " hours" : "in " + Math.round(ms / DAY) + " days";
}
// (tests)
export const holesState = () => JSON.parse(JSON.stringify(H()));
export const holesReset = () => { st().holes = {}; lastTick = 0; for (const o of [nextBeat, nextPump, said, usedAt]) for (const k of Object.keys(o)) delete o[k]; inMe.clear(); drips.length = 0; nextNotice = 0; };
export const holesDrips = () => drips.slice();
