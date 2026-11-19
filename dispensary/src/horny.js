/* WHAT'S IN THIS FILE (horny.js)
   HORNY GEAR (Nov 18; Laynie: "the devices being horny", "a horny tag on parasites so they are more active with
   thrusting", then yes to it makin' you cum, to its own switch, and to breeding gear).
   • A crafted item whose name or description says "horny" or "hungry" uses whoever wears it, by itself, every six to ten
     minutes ("insatiable" or "ravenous": every two to four, and rougher). What it does goes by where it's worn:
       in your pussy or ass     it thrusts (plugs, dildos, tentacle plugs, eggs)
       on your nipples          it suckles and tugs; a nipple toy in an open nipple fucks it (and they train)
       in your mouth            it fucks your throat
       crotch, belt, harness    it grinds and tightens
     Every time, your arousal goes up a step. Close enough, and with nothin' denyin' you, it tips you over: the game's
     own orgasm. Now and then the room sees it; in between, only you do.
   • "Breeding" or "seeding" on it as well: when you cum, it cums too, and fills you.
   • A crafted parasite that says "horny" is twice as busy (parasites.js), and squirms and thrusts in between.
   • Whoever crafted it has to be on your list, like any of the Dispensary's gear. Its own switch on the page, on to
     start. The safeword stops it (with the rest of your gear), and it's quiet while you're out of a room.
*/
import { st } from "./store.js";
import { craftText } from "./needle.js";
import { allowed } from "./ladder.js";
import { LINES } from "./lines.js";
import { local, action, fill, pick, inRoom } from "./say.js";
import { active, setArousal } from "./doses.js";
import { toyIn } from "./toys-list.js";
import "./lines-horny.js";

const W = window, MIN = 60000;
export const HORNY = /\b(horny|hungry|insatiable|ravenous)\b/;
const RAVENOUS = /\b(insatiable|ravenous)\b/;
export const BREEDS = /\b(breeding|seeding|breeder)\b/;
export const hornyOf = (text) => (HORNY.test(String(text || "")) ? (RAVENOUS.test(String(text || "")) ? 2 : 1) : 0);
// where it's worn: what it does
export function whereOf(group) {
  const g = String(group || "");
  if (/^Item(Vulva|Butt)$/.test(g)) return "hole";
  if (/^ItemNipples/.test(g) || g === "ItemBreast") return "nips";
  if (/^ItemMouth/.test(g)) return "mouth";
  if (/^Item(Pelvis|VulvaPiercings|Torso|Torso2)$/.test(g)) return "crotch";
  return null;
}
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const okFrom = (by) => !by || by === me() || allowed(by);
const paused = () => (st().wornPause || 0) > Date.now();
export const hornyOn = () => st().hornyOn !== false;
// (the lines say "it": "Hungry Clamps" reads as a pair of them)
const onePiece = (n) => (/[^s]s$/i.test(String(n).trim()) ? "pair of " + n : n);
const nameOf = (it) => onePiece((it && it.Craft && it.Craft.Name) || (it && it.Asset && (it.Asset.Description || it.Asset.Name)) || "it");
const meter = () => { const A = W.Player && W.Player.ArousalSettings; return A && A.Active !== "Inactive" && A.Active !== "NoMeter" ? A : null; };

// the horny gear you're wearin': [{ item, key, text, by, where, lvl, breed }]
export function hornyGear() {
  const P = W.Player, out = [];
  if (!P || !Array.isArray(P.Appearance)) return out;
  for (const item of P.Appearance) {
    if (!item || !item.Craft || !item.Asset || !item.Asset.Group) continue;
    const text = craftText(item), lvl = hornyOf(text), where = whereOf(item.Asset.Group.Name);
    if (!lvl || !where) continue;
    out.push({ item, key: item.Asset.Group.Name + ":" + (item.Craft.Name || ""), text, by: Number(item.Craft.MemberNumber) || 0, where, lvl, breed: BREEDS.test(text) });
  }
  return out;
}

let deps = { nipsToyUsed: () => {} };
const next = {};   // gear key → when it goes at them next
const gap = (lvl) => (lvl === 2 ? 2 + Math.random() * 2 : 6 + Math.random() * 4) * MIN;
const lineOf = (key, v) => { const L = LINES.horny && LINES.horny[key]; return L && L.length ? fill(pick(L), v).replace(/%g/g, (v && v.g) || "it") : ""; };
// in the middle of cummin' already (the game's own): leave it be
const cumming = () => { const A = W.Player && W.Player.ArousalSettings; return !!(A && Number(A.OrgasmStage) > 0); };

// one go at them
export function hornyBeat(g) {
  const v = { g: nameOf(g.item) };
  const A = meter();
  if (A) setArousal((Number(A.Progress) || 0) + (g.lvl === 2 ? 18 : 12));
  const room = Math.random() < 0.35;
  const t = room ? lineOf(g.where + "_room", v) : lineOf(g.where + (g.lvl === 2 ? "_rough" : "_mine"), v) || lineOf(g.where + "_mine", v);
  if (t) (room ? action(t) : local(t));
  if (g.where === "nips" && toyIn(W.Player) === g.item) { try { deps.nipsToyUsed(); } catch (e) { /* fine */ } }   // (a toy in an open nipple: fuckin' it)
  // close, and nothin' holdin' you back: over you go
  if (A && Number(A.Progress) >= 95 && !active("denial") && !cumming() && typeof W.ActivityOrgasmPrepare === "function") {
    const l = lineOf("tipped", v); if (l) action(l);
    try { W.ActivityOrgasmPrepare(W.Player); } catch (e) { /* fine */ }
  }
  return t;
}
// every few seconds
export function hornyTick(now) {
  now = now || Date.now();
  const gear = hornyOn() && !paused() && inRoom() ? hornyGear().filter((g) => okFrom(g.by)) : [];
  const on = new Set(gear.map((g) => g.key));
  for (const k of Object.keys(next)) if (!on.has(k)) delete next[k];   // (off: its clock goes with it)
  for (const g of gear) {
    if (!next[g.key]) { next[g.key] = now + gap(g.lvl) / 2; continue; }   // (put on just now: a little while first)
    if (now < next[g.key]) continue;
    next[g.key] = now + gap(g.lvl);
    hornyBeat(g);
  }
}
// HORNY PARASITES (parasites.js marks them): between feeds they squirm and thrust, every four to seven minutes
const paraNext = {};
export function hornyParaTick(now) {
  now = now || Date.now();
  const P = deps.para ? deps.para() : {};
  for (const k of Object.keys(paraNext)) if (!P[k] || !P[k].horny) delete paraNext[k];
  if (!hornyOn() || paused() || !inRoom()) return;
  for (const [kind, p] of Object.entries(P)) {
    if (!p || !p.horny || !(LINES.horny && LINES.horny["para_" + kind])) continue;
    if (!paraNext[kind]) { paraNext[kind] = now + (2 + Math.random() * 3) * MIN; continue; }
    if (now < paraNext[kind]) continue;
    paraNext[kind] = now + (p.horny === 2 ? 2 + Math.random() * 2 : 4 + Math.random() * 3) * MIN;
    const A = meter(); if (A) setArousal((Number(A.Progress) || 0) + (p.horny === 2 ? 14 : 9));
    const t = lineOf("para_" + kind, {}); if (t) (Math.random() < 0.3 ? action(t) : local(t));
    if (kind === "nips") { try { deps.nipsToyUsed(); } catch (e) { /* fine */ } }
    if (A && Number(A.Progress) >= 95 && !active("denial") && !cumming() && typeof W.ActivityOrgasmPrepare === "function") { const l = lineOf("tipped_para", {}); if (l) action(l); try { W.ActivityOrgasmPrepare(W.Player); } catch (e) { /* fine */ } }
  }
}
// you came: breeding gear cums too, and fills you
const LEAK = { hole: ["thighs"], mouth: ["face"], nips: ["chest"], crotch: ["thighs"] };
export function hornyClimax() {
  if (!hornyOn() || paused()) return 0;
  let n = 0;
  for (const g of hornyGear()) {
    if (!g.breed || !okFrom(g.by)) continue;
    const t = lineOf("bred_" + g.where, { g: nameOf(g.item) }) || lineOf("bred_hole", { g: nameOf(g.item) });
    if (t) action(t);
    try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail: { type: "leak", mess: "cum", areas: LEAK[g.where] || ["thighs"], amount: g.lvl === 2 ? 1.8 : 1.3 } })); } catch (e) { /* fine */ }
    n++;
  }
  return n;
}
export function initHorny(mod, d) {
  deps = Object.assign(deps, d || {});
  try {
    mod.hookFunction("ActivityOrgasmStart", 3, (args, next) => {
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && !W.ActivityOrgasmRuined) setTimeout(() => hornyClimax(), 900); } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { /* fine */ }
}
export const hornyReset = () => { for (const k of Object.keys(next)) delete next[k]; };
