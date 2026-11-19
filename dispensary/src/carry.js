/* WHAT'S IN THIS FILE (carry.js)
   CARRYIN' ANYWHERE (Nov 19; Laynie: "I want to be the best baby factory wherever I go", then "all of them, non
   clinical language please, make it hot and sexy"). Part two of breedin' anywhere. The farm girl keeps the books and
   tells your Dispensary what you're carryin' (dispWelcome and dispSeedOk: `carry`), and your Dispensary lets you feel
   it wherever you are:
   • CARRYIN': you feel it take hold, then show, then grow heavy, kick and leak, and you crave seed; now and then the
     room sees it. Your drawn belly grows with it anywhere (the Companion reads bellyAll).
   • HEAT: your natural heat comes on wherever you are (the farm's clock), with the simmer and the room noticin'; and
     a stud runnin' the Dispensary catches the scent of anybody in heat near them.
   • LABOUR WHERE YOU ARE: due, and not on the farm? Your waters break right where you are. The room sees every wave;
     anybody there can be your midwife (a touch on your belly or between your legs helps it along), and you deliver
     there. The farm girl books the litter the next time you're in her room (your hello carries it: `born`).
   • EGGS: a clutch that's due comes out wherever you are, one slick egg at a time (`laid`).
   • BACK TO BACK: for an hour after a birth you're wide open, and a load in you takes four times as easy.
   • THE QUICKENING DRAUGHT (doses.js `quicken`): a day off your pregnancy a dose. Off the farm your Dispensary hands it
     to her with your loads.
   • THE BREEDER'S SCAN (doses.js `scan`): somebody on your list scans your belly, and the room hears what's in there.
*/
import { makeMsg } from "../../shared/protocol.js";
import { amountSay, bellyFrom } from "../../shared/seed.js";
import { BOT } from "./config.js";
import { st, save } from "./store.js";
import { allowed } from "./ladder.js";
import { LINES } from "./lines.js";
import { local, action, pick, nameOf, inRoom, myName } from "./say.js";
import { seedInfo, seedCap } from "./seed.js";
import { ripeNow } from "./breed.js";
import "./lines-carry.js";

const W = window, MIN = 60000, HOUR = 3600000, DAY = 86400000;
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const botIn = () => (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
const charOf = (mn) => (mn === me() ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
const tellPage = (detail) => { try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail })); } catch (e) { /* fine */ } };
export const BREDBACK_MIN = 60, BREDBACK_X = 4;   // (the farm's own: bot CFG.BREDBACK_MIN, BREDBACK_X)

// ── what the farm says you're carryin': st().carry { preg, eggs, heat, open, litters, one, many } ──
const C = () => st().carry || null;
export function carryWelcome(m) {
  const c = m && m.carry; if (!c || typeof c !== "object") return;
  const S = st(), num = (v, lo, hi) => Math.max(lo, Math.min(hi, Number(v) || 0));
  const P = c.preg && typeof c.preg === "object" ? c.preg : null, E = c.eggs && typeof c.eggs === "object" ? c.eggs : null;
  S.carry = {
    preg: P ? { since: num(P.since, 0, 1e14), due: num(P.due, 0, 1e14), count: Math.round(num(P.count, 1, 60)), sires: Array.isArray(P.sires) ? P.sires.filter((x) => typeof x === "string").slice(0, 6).map((x) => x.slice(0, 40)) : [] } : null,
    eggs: E ? { n: Math.round(num(E.n, 1, 200)), layAt: num(E.layAt, 0, 1e14), by: typeof E.by === "string" ? E.by.slice(0, 40) : "" } : null,
    heat: { until: num(c.heat && c.heat.until, 0, 1e14), next: num(c.heat && c.heat.next, 0, 1e14) },
    open: num(c.open, 0, 1e14), litters: Math.round(num(c.litters, 0, 1e6)),
    one: typeof c.one === "string" ? c.one.slice(0, 20) : "little one", many: typeof c.many === "string" ? c.many.slice(0, 20) : "little ones",
    at: Date.now(),
  };
  // what you've done away that she's now booked
  if (S.born && Number(c.bornSeen) >= S.born.at) delete S.born;
  if (S.laid && Number(c.laidSeen) >= S.laid.at) delete S.laid;
  if (S.carry.preg && S.labour && S.labour.due !== S.carry.preg.due && !S.born) delete S.labour;   // (a different litter now)
  save(); tellPage({ type: "seed" });
}
// what goes in your hello: a birth or a layin' done away, for her books
export const carryHello = () => ({ born: st().born || undefined, laid: st().laid || undefined });

// ── how round you are: seed, a litter, eggs (the farm's own sum, bot 10y2-brood.js bellyStage) ──
export function bellyAll(now) {
  now = now || Date.now();
  const c = C(), I = seedInfo();
  let w = 0;
  const full = I.belly / Math.max(1, seedCap()); if (full > 0.8) w += (full - 0.8) * 3;
  if (c && c.eggs && !st().laid) w += c.eggs.n / 10;
  const g = c && c.preg && !st().born ? c.preg : null;
  if (g) { const f = Math.max(0, Math.min(1, (now - g.since) / Math.max(1, g.due - g.since))); w += f * (1 + g.count * 0.5); }
  return w >= 8 ? 4 : w >= 4 ? 3 : w >= 2 ? 2 : w >= 0.8 ? 1 : 0;
}

// ── fill in a line ──
const said = {};
function lineOf(key, v) {
  const L = LINES.carry && LINES.carry[key]; if (!L || !L.length) return "";
  let t = pick(L); if (L.length > 1 && t === said[key]) t = L[(L.indexOf(t) + 1) % L.length];
  said[key] = t; v = v || {};
  const c = C() || {}, g = c.preg || {}, n = v.c || g.count || 1;
  const kids = n === 1 ? "a " + (c.one || "little one") : n + " " + (c.many || "little ones");
  return String(t).replace(/%t/g, myName()).replace(/%b/g, v.b || "somebody").replace(/%S/g, v.S || sireWords(g.sires))
    .replace(/%kids/g, kids).replace(/%many/g, c.many || "little ones").replace(/%one/g, c.one || "little one").replace(/%c/g, String(n))
    .replace(/%e/g, String(v.e || (c.eggs && c.eggs.n) || "")).replace(/%a/g, v.a || "").replace(/%d/g, v.d || "")
    .replace(/^\s*(\S)/, (m, ch) => m.slice(0, -1) + ch.toUpperCase());
}
const sireWords = (s) => !s || !s.length ? "their sire's" : s.length === 1 ? s[0] + "'s" : s.slice(0, -1).join(", ") + " and " + s[s.length - 1] + "'s";
const dueWords = (due) => { const ms = due - Date.now(); return ms <= 0 ? "due right now" : ms < 36 * HOUR ? "due in " + Math.max(1, Math.round(ms / HOUR)) + " hours" : "due in " + Math.round(ms / DAY) + " days"; };

// ── carryin': how far along, and what you feel ──
export function stageOf(now) {
  const g = C() && C().preg; if (!g || st().born) return "";
  const f = (now - g.since) / Math.max(1, g.due - g.since);
  return f >= 1 ? "due" : f >= 0.7 ? "heavy" : f >= 0.3 ? "show" : "early";
}
let feelNext = 0, roomNext = 0, craveNext = 0;
function feelTick(now) {
  const s = stageOf(now); if (!s || !inRoom()) return;
  if (!feelNext) { feelNext = now + (8 + Math.random() * 10) * MIN; roomNext = now + (40 + Math.random() * 30) * MIN; craveNext = now + (50 + Math.random() * 40) * MIN; return; }
  if (now >= feelNext) { feelNext = now + (25 + Math.random() * 20) * MIN; local(lineOf((s === "due" ? "heavy" : s) + "_mine")); if (s === "heavy" || s === "due") tellPage({ type: "leak", mess: "milk", areas: ["chest"], amount: 0.8 }); }
  if (now >= roomNext && s !== "early") { roomNext = now + (60 + Math.random() * 40) * MIN; action(lineOf(s === "show" ? "room_show" : "room_heavy")); }
  if (now >= craveNext) { craveNext = now + (70 + Math.random() * 50) * MIN; local(lineOf("crave")); }
}

// ── heat, anywhere ──
let heatDone = 0;
function heatTick(now, giveHeat) {
  const c = C(); if (!c || botIn()) return;
  const next = c.heat && c.heat.next;
  if (!(next > 0) || now < next || heatDone === next || st().heatAt === next || now - next > 12 * HOUR) return;
  heatDone = next; st().heatAt = next; save();
  const mins = Math.max(10, Math.round((next + 12 * HOUR - now) / MIN));
  try { giveHeat(mins, lineOf("heat_start")); } catch (e) { /* fine */ }
}
// a stud runnin' the Dispensary smells it on anybody near
const scentAt = new Map();
function scentTick(now, idsOf) {
  const P = W.Player; if (!P || typeof P.HasPenis !== "function" || !P.HasPenis() || !inRoom()) return;
  for (const c of W.ChatRoomCharacter || []) {
    if (!c || c.MemberNumber === me()) continue;
    const ids = idsOf(c.MemberNumber); if (!ids.includes("heat")) continue;
    if (now - (scentAt.get(c.MemberNumber) || 0) < HOUR) continue;
    scentAt.set(c.MemberNumber, now);
    local(lineOf("heat_scent", { b: nameOf(c.MemberNumber) }));
    try { const A = P.ArousalSettings; if (A && typeof W.ActivitySetArousal === "function") W.ActivitySetArousal(P, Math.min(100, (Number(A.Progress) || 0) + 10)); } catch (e) { /* fine */ }
  }
}

// ── labour where you are ──
const helped = new Map();   // who → when they last helped
function labourTick(now) {
  const S = st(), c = C(), g = c && c.preg;
  if (!g || S.born || botIn()) { if (S.labour && (!g || S.born)) { delete S.labour; save(); } return; }
  if (!S.labour) {
    if (now < g.due || !inRoom()) return;
    const mins = Math.min(90, 45 + Math.max(0, g.count - 1) * 3);
    S.labour = { start: now, until: now + mins * MIN, next: now + (6 + Math.random() * 4) * MIN, due: g.due, helps: 0, midwife: 0 };
    save(); action(lineOf("water"));
    return;
  }
  const L = S.labour;
  if (now >= L.until) {
    S.born = { at: now, midwife: L.midwife || 0, helps: L.helps || 0, n: g.count, due: g.due };
    delete S.labour; save();
    action(L.midwife && charOf(L.midwife) ? lineOf("birth_midwife", { b: nameOf(L.midwife) }) : lineOf("birth"));
    tellPage({ type: "leak", mess: "milk", areas: ["chest"], amount: 1.5 }); tellPage({ type: "seed" });
    return;
  }
  if (now >= L.next && inRoom()) {
    L.next = now + (6 + Math.random() * 4) * MIN; save();
    const f = (now - L.start) / Math.max(1, L.until - L.start);
    action(lineOf(f < 0.4 ? "early" : f < 0.8 ? "strong" : "close"));
  }
}
// a touch on your belly or between your legs while you labour: they're helpin' (and the first one's your midwife)
export function labourTouch(from, group) {
  const L = st().labour; if (!L || !from || from === me() || !/^Item(Pelvis|Torso|Vulva|Breast)$/.test(String(group || ""))) return false;
  if (Date.now() - (helped.get(from) || 0) < 3 * MIN) return false;
  helped.set(from, Date.now());
  if (!L.midwife) L.midwife = from;
  L.helps = (L.helps || 0) + 1; L.until = Math.max(Date.now() + MIN, L.until - 3 * MIN);   // (it eases them along)
  save(); action(lineOf("midwife", { b: nameOf(from) }));
  return true;
}

// ── eggs, wherever you are ──
function layTick(now) {
  const S = st(), c = C(), e = c && c.eggs;
  if (!e || S.laid || botIn() || now < e.layAt || !inRoom()) { if (S.laying && (!e || S.laid)) { delete S.laying; save(); } return; }
  if (!S.laying) { S.laying = { start: now, next: now + 2 * MIN, pushes: 0 }; save(); action(lineOf("lay_start")); return; }
  const Y = S.laying;
  if (now < Y.next) return;
  Y.pushes += 1; Y.next = now + (2 + Math.random() * 2) * MIN;
  if (Y.pushes >= Math.min(4, 1 + Math.ceil(e.n / 3))) { S.laid = { at: now, n: e.n }; delete S.laying; save(); action(lineOf("lay_done", { e: e.n })); tellPage({ type: "seed" }); return; }
  save(); action(lineOf("lay_push"));
}

// ── back to back: wide open for an hour after a birth ──
export function openUntil() { const c = C(), S = st(); return Math.max((c && c.open) || 0, S.born ? S.born.at + BREDBACK_MIN * MIN : 0); }
let openSaid = 0;
function openTick(now) {
  const u = openUntil(); if (!(u > now) || openSaid === u || !inRoom()) return;
  openSaid = u; local(lineOf("open_mine"));
}

// ── the Quickening Draught (doses.js): off the farm, the farm gets it with your loads ──
export function quicken(x, quiet) {
  const c = C(), g = c && c.preg, S = st();
  x = Math.max(1, Math.min(5, Math.round(Number(x) || 1)));
  if ((!g || S.born) && !(c && c.eggs && !S.laid)) { if (!quiet) action(lineOf("quicken_none")); return { ok: false, why: "none" }; }
  const now = Date.now();
  if (g && !S.born) { const step = Math.min(x * DAY, Math.max(0, g.due - now - 2 * HOUR)); g.due -= step; g.since -= step; }
  if (c.eggs && !S.laid) c.eggs.layAt = Math.max(now + 30 * MIN, c.eggs.layAt - x * 12 * HOUR);
  if (!botIn()) S.quick = Math.min(20, (S.quick || 0) + x);   // (handed to her with your loads: seed.js)
  save(); tellPage({ type: "seed" });
  if (!quiet) action(lineOf("quicken"));
  return { ok: true };
}
export function takeQuick() { const n = st().quick || 0; if (n) { delete st().quick; save(); } return n; }

// ── the Breeder's Scan (doses.js): what's in there, for the room ──
export function scan(by) {
  const c = C(), g = c && c.preg, S = st(), I = seedInfo(), v = { b: by && by !== me() ? nameOf(by) : myName() };
  let t;
  if (g && !S.born) t = lineOf("scan_preg", Object.assign({}, v, { d: dueWords(g.due) })) + (c.eggs && !S.laid ? " " + lineOf("scan_eggs") : "");
  else if (c && c.eggs && !S.laid) t = lineOf("scan_preg", Object.assign({}, v, { c: c.eggs.n, S: c.eggs.by ? c.eggs.by + "'s" : "somebody's", d: "eggs, " + dueWords(c.eggs.layAt).replace("due", "ready") }));
  else if (I.belly >= 5) t = lineOf("scan_seed", Object.assign({}, v, { a: amountSay(I.belly) }));
  else t = lineOf("scan_empty", v);
  if (ripeNow()) t += " " + lineOf("scan_ripe");
  action(t);
  return { ok: true };
}

let lastTick = 0;
export function carryTick(now, deps) {
  now = now || Date.now();
  lastTick = now;
  try { labourTick(now); } catch (e) { console.warn("[Dispensary] labour:", e); }
  try { layTick(now); } catch (e) { console.warn("[Dispensary] eggs:", e); }
  try { feelTick(now); } catch (e) { /* fine */ }
  try { heatTick(now, deps.giveHeat); } catch (e) { /* fine */ }
  try { scentTick(now, deps.idsOf); } catch (e) { /* fine */ }
  try { openTick(now); } catch (e) { /* fine */ }
}
export function carryInfo(now) {
  now = now || Date.now();
  const c = C(), S = st(), g = c && c.preg && !S.born ? c.preg : null;
  return { carrying: g ? { count: g.count, sires: g.sires, due: g.due, dueWords: dueWords(g.due), stage: stageOf(now) } : null,
    eggs: c && c.eggs && !S.laid ? { n: c.eggs.n, by: c.eggs.by, layAt: c.eggs.layAt } : null,
    labour: S.labour ? { left: Math.max(0, S.labour.until - now), midwife: S.labour.midwife ? nameOf(S.labour.midwife) : "" } : null,
    born: S.born || null, laid: S.laid || null, heat: c && c.heat && c.heat.until > now ? c.heat.until : 0, nextHeat: c && c.heat ? c.heat.next : 0,
    open: openUntil() > now ? openUntil() : 0, litters: (c && c.litters) || 0, belly: bellyAll(now), known: !!c, one: (c && c.one) || "", many: (c && c.many) || "" };
}
export const carryReset = () => { delete st().carry; delete st().labour; delete st().born; delete st().laid; delete st().laying; delete st().quick; delete st().heatAt; feelNext = 0; heatDone = 0; openSaid = 0; scentAt.clear(); helped.clear(); };
export const carryFeelNow = () => { feelNext = 1; roomNext = 1; craveNext = 1; };
