/* WHAT'S IN THIS FILE (seed.js)
   SEED, ANYWHERE, AND THE BREEDER'S SEAL (Nov 19; Laynie: "Definitely the insemination and breeders seal, and I would
   love if the crafter can specify how much it deposits in which every hole, nipples, ass, pussy, or mouth in ml, l, or
   gallons"). The rules (the words, how much and where, the seal's slots) are in shared/seed.js; the farm girl reads
   the same ones.
   • A DOSE OF SEED (doses.js `seed`): a crafted needle, drink, kiss or bit of gear with seed words on it puts its
     crafter's own seed in you, as much as it says, where it says. The crafter has to be on your list, the same as
     whoever's holdin' it. Your Dispensary keeps count of what's in you (your pussy, ass, throat and tits), whose it is,
     and every load you've taken.
   • HOW MUCH YOU HOLD: your belly holds what the farm says you can (a capacity shot stretches it; 200 mL to start),
     and the rest spills back out. Your tits hold a litre (two with a seal or a toy in them). Off the farm it drains out
     slowly, faster from a looser hole, and the room sees it drip when you're bare. A plug or a seal keeps it in.
   • THE BREEDER'S SEAL: gear that says so, crafted by somebody on your list. The hole it's in keeps every drop (no
     spillin', however much goes in, up to 40 L), opens only for its maker's seed, and while it's in, only its maker's
     loads can catch. Out it comes, and most of what it held gushes out with it.
   • THE FARM'S BOOKS: your Dispensary hands every load to the farm girl, the moment it lands if she's in the room,
     otherwise the next time you're in hers (dispSeed). She books it as that crafter's load: it can catch, with them as
     sire (her own rules: ?breedable on, Fertile, Sure-Catch makes it take), and she sends her numbers back
     (dispSeedOk). A load that landed while somebody else's seal was in can't catch.
   Your belly's roundness goes to the Companion's drawn body (FarmhandDispensary.seedBelly).
*/
import { SEED_HOLES, SEED_WORD, BASE_CAP, NIP_CAP, SEED_TOTAL_MAX, SEED_HALF_LIFE_H, GAPE_LEAK_X, sealsOn, seedPlan, seedDecode, amountSay, loadSay, bellyFrom } from "../../shared/seed.js";
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { BOT } from "./config.js";
import { st, save } from "./store.js";
import { allowed } from "./ladder.js";
import { LINES } from "./lines.js";
import { local, action, pick, nameOf, inRoom, myName } from "./say.js";
import { craftText } from "./needle.js";
import { holesHave, holesNow, toysNow } from "./holes.js";
import { nipsOpen } from "./nipples.js";
import { toyIn } from "./toys-list.js";
import "./lines-seed.js";
import { takeQuick } from "./carry.js";

const W = window, MIN = 60000, HOUR = 3600000;
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const botIn = () => (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
const BELLY = ["vulva", "butt", "mouth"];
const tellPage = (detail) => { try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail })); } catch (e) { /* fine */ } };

// ── your books: st().seed ──
// h: what's in each hole now { ml, by: { sire: mL } } · n, ml: every load you've taken, and how much · from: whose
// (the 40 most recent) · pend/fly: loads waitin' for the farm girl · cap: how much your belly holds (the farm's word) ·
// seals: what's sealed now · leak, drip: what's run out since the last drip line
function S() {
  const s = st();
  if (!s.seed || typeof s.seed !== "object") s.seed = {};
  const o = s.seed;
  if (!o.h || typeof o.h !== "object") o.h = {};
  for (const h of SEED_HOLES) if (!o.h[h] || typeof o.h[h] !== "object") o.h[h] = { ml: 0, by: {} };
  for (const k of ["from", "seals", "leak", "drip"]) if (!o[k] || typeof o[k] !== "object") o[k] = {};
  if (!Array.isArray(o.pend)) o.pend = [];
  if (typeof o.n !== "number") o.n = 0;
  if (typeof o.ml !== "number") o.ml = 0;
  if (typeof o.id !== "number") o.id = 0;
  if (typeof o.ep !== "string" || !o.ep) o.ep = Math.random().toString(36).slice(2, 10);   // (these books' own name: the farm starts countin' again for fresh ones)
  return o;
}
export const seedCap = () => Math.max(BASE_CAP, Number(S().cap) || BASE_CAP);
const bellyHeld = () => BELLY.reduce((a, h) => a + (S().h[h].ml || 0), 0);
export const seedBelly = () => bellyFrom(bellyHeld(), seedCap());

// what's in a hole, and whose: added, or scaled (drainin', spillin'), or set (the farm's numbers)
function addTo(h, sire, ml) {
  if (!(ml > 0)) return;
  const x = S().h[h]; x.ml += ml; x.by[sire] = (x.by[sire] || 0) + ml;
  const ks = Object.keys(x.by); if (ks.length > 8) { ks.sort((a, b) => x.by[a] - x.by[b]); for (const k of ks.slice(0, ks.length - 8)) delete x.by[k]; }
}
function scaleTo(x, ml) {
  ml = Math.max(0, ml);
  if (ml < 0.5) { x.ml = 0; x.by = {}; return; }
  const f = x.ml > 0 ? ml / x.ml : 0;
  for (const k of Object.keys(x.by)) x.by[k] *= f;
  x.ml = ml;
}
const topSire = (h) => { const by = S().h[h].by; let best = 0, n = 0; for (const [k, v] of Object.entries(by)) if (v > n) { n = v; best = Number(k); } return best; };

// names: theirs in the room, else the one on their crafted item, else "somebody"
function nameFor(mn, nm) {
  if (!mn) return nm || "somebody";
  if (mn === me()) return myName();
  const n = nameOf(mn); if (n && n !== "somebody") return n;
  const f = S().from[mn]; return (f && f.nm) || nm || "somebody";
}
const poss = (sire, nm) => (!sire ? "somebody's" : sire === me() ? "their own" : nameFor(sire, nm) + "'s");
const holeList = (hs) => { const w = hs.map((h) => SEED_WORD[h]); return w.length < 2 ? w.join("") : w.slice(0, -1).join(", ") + " and " + w[w.length - 1]; };
const cap1 = (t) => String(t).replace(/^\s*(\S)/, (m, c) => m.slice(0, -1) + c.toUpperCase());
function fillSeed(t, v) {
  v = v || {};
  return String(t).replace(/%t/g, myName()).replace(/%b/g, v.b || "somebody").replace(/%S/g, v.S || "somebody").replace(/%s/g, v.s || "somebody's")
    .replace(/%a/g, v.a || "").replace(/%l/g, v.l || "a load").replace(/%h/g, v.h || "").replace(/%w/g, v.w || "").replace(/%g/g, v.g || "it").replace(/%x/g, v.x || "");
}
const said = {};   // pool → the line said last (never the same twice runnin')
function lineOf(key, v) {
  const L = LINES.seed && LINES.seed[key]; if (!L || !L.length) return "";
  let t = pick(L); if (L.length > 1 && t === said[key]) t = L[(L.indexOf(t) + 1) % L.length];
  said[key] = t;
  return cap1(fillSeed(t, v));
}
// cum on you, for the Companion to draw (only with its "Farm can mark my body" on)
const AREAS = { vulva: ["thighs"], butt: ["thighs"], mouth: ["face"], nips: ["chest"] };
function leak(h, ml) { tellPage({ type: "leak", mess: "cum", areas: AREAS[h] || ["thighs"], amount: Math.max(0.6, Math.min(3, 0.6 + Math.log10(Math.max(1, ml) / 20))) }); }

// ── the seals on you now: { hole: { by, g (its name), nm (its maker's) } }, only from somebody you let dose you ──
export function sealsNow() {
  const P = W.Player, out = {};
  if (!P) return out;
  for (const s of sealsOn(P.Appearance, craftText)) {
    if (s.by !== me() && !allowed(s.by)) continue;
    for (const h of s.holes) if (!out[h]) out[h] = { by: s.by, g: s.name, nm: s.maker };
  }
  return out;
}

// ── A DOSE OF SEED (doses.js gives it) ──
// o: { by (who gave it), sire (whose seed: the crafter), nm (their name, off the item), x, p (how much where:
// shared/seed.js seedEncode), via ("needle", "sip", "kiss", "gear", "breed"), g (the gear), hole (where the gear sits),
// quiet }
export function seedGive(o) {
  o = o || {};
  const sire = Number(o.sire) || Number(o.by) || me(), by = Number(o.by) || sire, now = Date.now();
  if (sire !== me() && !allowed(sire)) return { ok: false, why: "ladder" };
  const plan = seedPlan(seedDecode(o.p), { have: holesHave(), nipsOpen: nipsOpen() > 0, via: o.via, x: o.x, hole: o.hole });
  const holes = SEED_HOLES.filter((h) => plan[h] > 0);
  if (!holes.length) return { ok: false, why: "none" };
  const D = S(), seals = sealsNow(), cap = seedCap(), here = botIn();
  const f = D.from[sire] || (D.from[sire] = { n: 0, ml: 0, at: 0, nm: "" });
  if (o.nm) f.nm = String(o.nm).slice(0, 40); else if (!f.nm && sire !== me() && nameOf(sire) !== "somebody") f.nm = nameOf(sire);
  const nc = Object.values(seals).some((s) => s.by !== sire);   // somebody else's seal is in: this can't catch
  const kept = {}, spilt = {}, refused = [], held = [];
  const stage0 = bellyFrom(bellyHeld(), cap);
  for (const h of holes) {
    const ml = plan[h], seal = seals[h];
    if (seal && seal.by !== sire) { refused.push(h); spilt[h] = ml; continue; }   // it opens only for its maker
    const room = h === "nips" ? Math.max(0, NIP_CAP * (seal || toyIn(W.Player) ? 2 : 1) - D.h.nips.ml)
      : seal ? Math.max(0, SEED_TOTAL_MAX - bellyHeld()) : Math.max(0, cap - bellyHeld());
    kept[h] = Math.min(ml, room); spilt[h] = ml - kept[h];
    if (seal) held.push(h);
    addTo(h, sire, kept[h]);
  }
  const went = holes.filter((h) => !refused.includes(h)), total = went.reduce((a, h) => a + plan[h], 0);
  if (went.length) {
    D.n += 1; D.ml += total; f.n += 1; f.ml += total; f.at = now;
    const ks = Object.keys(D.from); if (ks.length > 40) { ks.sort((a, b) => D.from[a].at - D.from[b].at); for (const k of ks.slice(0, ks.length - 40)) delete D.from[k]; }
    for (const h of went) D.pend.push({ h, ml: Math.round(plan[h]), by: sire, at: now, nc: nc ? 1 : 0, here: here ? 1 : 0, nm: f.nm || undefined, via: o.via === "cock" ? "cock" : undefined });
    if (D.pend.length > 60) D.pend = D.pend.slice(-60);
  }
  save(); tellPage({ type: "seed" });
  if (here) sendSoon();
  for (const h of holes) if (spilt[h] >= 5) leak(h, spilt[h]);
  if (o.via === "breed") { if (went.length && !o.silent) local("💦 It left " + amountSay(total) + " of " + poss(sire, o.nm).replace(/^their own$/, "your own") + " seed in your " + holeList(went) + "."); }
  else if (!o.quiet) {
    const v = { b: nameFor(by), s: poss(sire, o.nm), g: o.g || "gear" }, parts = [];
    const open = o.via === "sip" ? "open_sip" : o.via === "kiss" ? "open_kiss" : o.via === "gear" ? "open_gear" : by === me() ? "open_self" : "open_needle";
    parts.push(lineOf(open, v));
    if (went.length) {
      const tier = total < 150 ? "s" : total < 1500 ? "m" : "l";
      parts.push(went.length === 1 ? lineOf(went[0] + "_" + tier, Object.assign({}, v, { a: amountSay(total), l: loadSay(total), h: SEED_WORD[went[0]] }))
        : lineOf("many_" + tier, Object.assign({}, v, { a: amountSay(total), l: loadSay(total), w: holeList(went) })));
      const sp = went.filter((h) => spilt[h] >= 5);
      if (sp.length) {
        const h0 = sp.find((h) => h === "vulva" || h === "butt") || sp[0], x = sp.reduce((a, h) => a + spilt[h], 0);
        parts.push(lineOf(h0 === "mouth" ? "spill_mouth" : h0 === "nips" ? "spill_nips" : "spill_hole", Object.assign({}, v, { x: amountSay(x), h: SEED_WORD[h0] })));
      }
      if (held.length) parts.push(lineOf("seal_hold", Object.assign({}, v, { g: seals[held[0]].g })));
    }
    if (refused.length) { const s0 = seals[refused[0]]; parts.push(lineOf("seal_refuse", Object.assign({}, v, { g: s0.g, S: nameFor(s0.by, s0.nm) }))); }
    const stage = bellyFrom(bellyHeld(), cap);
    if (stage > stage0 && stage >= 1) parts.push(lineOf(stage >= 4 ? "full_3" : stage >= 2 ? "full_2" : "full_1", v));
    const text = parts.filter(Boolean).join(" ");
    if (text) action(text);
  }
  return { ok: went.length > 0, why: went.length ? "" : "sealed", kept, spilt, refused, holes: went, total };
}

// ── every few seconds: it drains, it drips, seals go in and come out, the farm girl gets what's waitin' ──
let lastTick = 0, lastStage = -1;
// bare enough for the room to see it run down your thighs (the game's own reach checks)
function bare(h) {
  try {
    const P = W.Player, I = W.InventoryPrerequisiteMessage; if (typeof I !== "function") return false;
    if (h === "butt") return I(P, "AccessButt") === "" && !(P.IsButtChaste && P.IsButtChaste());
    return I(P, "AccessCrotch") === "" && I(P, "AccessVulva") === "" && !(P.IsVulvaChaste && P.IsVulvaChaste());
  } catch (e) { return false; }
}
export function seedTick(now) {
  now = now || Date.now();
  const dt = lastTick ? Math.max(0, Math.min(now - lastTick, 15 * MIN)) : 0;
  lastTick = now;
  const D = S(), seals = sealsNow(), here = botIn(), room = inRoom();
  let dirty = false, sealSaid = false;
  // a seal goes in, or comes out
  for (const h of SEED_HOLES) {
    const was = D.seals[h], is = seals[h];
    if (is && (!was || was.by !== is.by || was.g !== is.g)) {
      D.seals[h] = { by: is.by, g: is.g, nm: is.nm || "" }; dirty = true;
      if (room && !sealSaid && h !== "nips") { sealSaid = true; action(lineOf("seal_in", { g: is.g, S: nameFor(is.by, is.nm), h: SEED_WORD[h] })); }
    } else if (!is && was) {
      delete D.seals[h]; dirty = true;
      const x = D.h[h];
      if (x.ml >= 30 && h !== "mouth") {
        const out = Math.round(x.ml * 0.6), who = topSire(h);
        scaleTo(x, x.ml - out);
        if (room) { action(lineOf("seal_out", { g: was.g, a: amountSay(out), s: poss(who, (D.from[who] || {}).nm), h: SEED_WORD[h] })); leak(h, out); }
      }
    }
  }
  // it drains: a plug or a seal keeps it in; a looser hole lets it go faster; a throat's is swallowed
  if (dt > 0) {
    const toys = toysNow(), N = holesNow().holes;
    for (const h of SEED_HOLES) {
      const x = D.h[h];
      if (!(x.ml > 0)) continue;
      if (seals[h] || ((h === "vulva" || h === "butt") && toys[h]) || (h === "nips" && toyIn(W.Player))) continue;
      const n = (h === "vulva" || h === "butt") && N[h] ? N[h].now || 1 : 1;
      const hl = SEED_HALF_LIFE_H[h] / (1 + GAPE_LEAK_X * (n - 1));
      const left = x.ml * Math.pow(0.5, dt / (hl * HOUR)), out = x.ml - left;
      scaleTo(x, left);
      if ((h === "vulva" || h === "butt") && !here) D.leak[h] = (D.leak[h] || 0) + out;
    }
  }
  // it drips back out (off the farm: on it, the farm girl has her own way of sayin' it)
  if (!here && room) for (const h of ["vulva", "butt"]) {
    if ((D.leak[h] || 0) < 25 || now - (D.drip[h] || 0) < 9 * MIN) continue;
    D.drip[h] = now; const x = D.leak[h]; D.leak[h] = 0; dirty = true;
    const who = topSire(h), v = { s: poss(who, (D.from[who] || {}).nm), h: SEED_WORD[h] };
    if (bare(h)) { action(lineOf("drip_room", v)); leak(h, x); } else local(lineOf("drip_mine", Object.assign({}, v, { s: v.s.replace(/^their own$/, "your own") })));
  }
  if (here) { D.leak = {}; }
  // the farm girl: what's waitin' goes to her
  if (here && (D.pend.length || st().quick || (D.fly && now - (D.fly.at || 0) > 60000))) sendNow();
  // your belly changed: the Companion draws it again
  const stage = seedBelly();
  if (stage !== lastStage) { lastStage = stage; tellPage({ type: "seed" }); }
  if (dirty || (dt > 0 && Math.random() < 0.05)) save();
}

// ── the farm girl's books ──
let sendT = null;
function sendSoon() { clearTimeout(sendT); sendT = setTimeout(() => { try { sendNow(); } catch (e) { /* fine */ } }, 1500); }
// everything waitin', in one go under one number, till she says she has it
export function sendNow() {
  const D = S();
  if (!botIn() || typeof W.ServerSend !== "function") return false;
  if (D.fly && Date.now() - (D.fly.at || 0) < 60000) return false;   // (waitin' on her: she'll answer)
  if (!D.fly && (D.pend.length || st().quick)) { D.id += 1; D.fly = { id: D.id, loads: D.pend.slice(0, 30), at: 0, quick: takeQuick() || undefined }; D.pend = D.pend.slice(30); }   // (a Quickening Draught taken away goes with them: carry.js)
  const f = D.fly; if (!f) return false;
  const held = {}; for (const h of SEED_HOLES) held[h] = Math.round(D.h[h].ml);
  try { W.ServerSend("ChatRoomChat", makeMsg("dispSeed", { ep: D.ep, id: f.id, loads: f.loads, held, quick: f.quick || undefined }, BOT)); } catch (e) { return false; }
  f.at = Date.now(); save();
  return true;
}
// her numbers for what's in you (only when nothin' of ours is waitin': then ours are ahead)
function fromFarm(m) {
  const D = S();
  if (Number(m.cap) > 0) D.cap = Math.min(60000, Math.round(Number(m.cap)));
  const held = m.held;
  if (!D.fly && !D.pend.length && held && typeof held === "object") {
    for (const h of BELLY) {
      const v = Number(held[h]); if (!(v >= 0) || !isFinite(v)) continue;
      const x = D.h[h], was = x.ml;
      scaleTo(x, Math.min(SEED_TOTAL_MAX, v));
      if (v >= 1 && (!was || !Object.keys(x.by).length) && Number(m.by) > 0) { x.by = {}; x.by[Number(m.by)] = x.ml; }
    }
    if (Number(m.by) > 0 && typeof m.nm === "string" && m.nm) { const f = D.from[Number(m.by)] || (D.from[Number(m.by)] = { n: 0, ml: 0, at: 0, nm: "" }); if (!f.nm) f.nm = m.nm.slice(0, 40); }
    D.sync = Date.now();
  }
  save(); tellPage({ type: "seed" });
}
let carryWelcomeFn = null;
export function seedOnCarry(f) { carryWelcomeFn = f; }
export function seedWelcome(m) { if (m && m.seed && typeof m.seed === "object") fromFarm(m.seed); }
function onOk(m) {
  const D = S(), id = Number(m.id) || 0;
  if (D.fly && id >= D.fly.id) D.fly = null;
  if (m.none) {
    if (m.none !== D.no) { D.no = String(m.none).slice(0, 20); if (m.none === "breedable") local("🐂 The farm girl didn't book that load: you're not breedable on her books. Say ?breedable on in her room if you want your loads to count there, and catch."); }
    save(); return;
  }
  D.no = "";
  if (m.seed) fromFarm(m.seed);
  if (m.carry) { try { carryWelcomeFn && carryWelcomeFn(m); } catch (e) { /* fine */ } }   // (what you're carryin' now: carry.js)
  if (D.pend.length) sendSoon();
}

export function initSeed(mod) {
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try {
        const data = args[0];
        if (data && data.Type === "Hidden" && data.Sender === BOT) { const m = readMsg(data); if (m && m.type === "dispSeedOk") onOk(m); }
      } catch (e) { console.warn("[Dispensary] seed:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] seed can't hear the farm girl:", e); }
  // walkin' into her room: hand her what's waitin'
  try { mod.hookFunction("ChatRoomSync", 2, (args, next) => { const r = next(args); setTimeout(() => { try { sendNow(); } catch (e) { /* fine */ } }, 4500); return r; }); } catch (e) { /* the tick still does */ }
}

// ── for the page, the Companion and the tests ──
export function seedInfo() {
  const D = S(), cap = seedCap(), belly = bellyHeld(), held = {};
  for (const h of SEED_HOLES) {
    const x = D.h[h], who = topSire(h), s = D.seals[h];
    held[h] = { ml: Math.round(x.ml), who: who ? nameFor(who, (D.from[who] || {}).nm) : "", seal: s ? { by: s.by, g: s.g, name: nameFor(s.by, s.nm) } : null };
  }
  const top = Object.entries(D.from).sort((a, b) => b[1].n - a[1].n).slice(0, 5).map(([k, f]) => ({ by: Number(k), name: nameFor(Number(k), f.nm), n: f.n, ml: Math.round(f.ml) }));
  return { held, belly: Math.round(belly), cap, pct: Math.round(100 * belly / cap), stage: bellyFrom(belly, cap), loads: D.n, ml: Math.round(D.ml), top,
    waiting: D.pend.length + (D.fly ? D.fly.loads.length : 0), sync: D.sync || 0, no: D.no || "" };
}
// let it all out (the page): what's in you drains away (a seal still holds its hole)
export function seedDrain() {
  const D = S(), seals = sealsNow(); let n = 0;
  for (const h of SEED_HOLES) { if (seals[h]) continue; n += D.h[h].ml; scaleTo(D.h[h], 0); }
  save(); tellPage({ type: "seed" });
  return Math.round(n);
}
// HIPS UP (breed.js): the loads in your pussy or ass since `since` that are still waitin' for the farm girl get their
// chance with your hips up. Returns whose the first newly marked one was ({ who, nm }), or null
export function seedMarkUp(since) {
  const D = S(); let first = null;
  for (const l of D.pend.concat(D.fly ? D.fly.loads : [])) {
    if (l.up || !(l.at >= since) || !(l.h === "vulva" || l.h === "butt")) continue;
    l.up = 1; if (!first) first = { who: l.by, nm: l.nm || "" };
  }
  if (first) save();
  return first;
}
export const seedState = () => JSON.parse(JSON.stringify(S()));
export const seedReset = () => { st().seed = {}; lastTick = 0; lastStage = -1; for (const k of Object.keys(said)) delete said[k]; };
