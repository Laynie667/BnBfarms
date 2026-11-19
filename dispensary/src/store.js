/* WHAT'S IN THIS FILE (store.js)
   Your Dispensary settings and the doses runnin' in you, kept on your ACCOUNT (the game's Player.ExtensionSettings,
   saved by the server) as well as in this browser. They follow you between your phone and your PC, and clearin' the
   browser doesn't undo anything (hardcore will lean on that).
*/
import { KEY, LADDER, DEFAULT_RUNG, PENALTY } from "./config.js";

const W = window;
let S = null, saveT = null;
const listeners = [];

// (Nov 17, more: tolerance and cravings are yours to switch on; taken is the record they read; later holds the
// time-release capsules waitin' in you; tenderSpot is where Tender goes when the bottle doesn't say)
const fresh = () => ({ v: 1, who: DEFAULT_RUNG, clock: "online", penalty: PENALTY, off: {}, doses: {}, farm: [], farmAt: 0, seen: 0, stock: false, hard: { on: false, log: [] }, wards: {}, keys: [], species: "", speciesFarm: "", screen: true,
  tolerance: false, cravings: 0, taken: {}, later: [], tenderSpot: "",
  // (Nov 18: crafted parasites, each kind off till you switch it on; what's in you; the mouthpiece lettin' words straight
  // through; worn gear's pause after a safeword)
  parasites: {}, para: {}, mouthAuto: false, wornPause: 0, iconsShow: true, iconsShare: true, grow: {} });
const num = (v, lo, hi, d) => (typeof v === "number" && isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d);

// only what's expected, in range: what comes back from the server could be anything
export function clean(d) {
  const s = fresh();
  if (!d || typeof d !== "object") return s;
  if (LADDER.some((r) => r.id === d.who)) s.who = d.who;
  if (d.clock === "real") s.clock = "real";
  s.penalty = Math.round(num(d.penalty, 0, 200, PENALTY));
  if (d.off && typeof d.off === "object") for (const [k, v] of Object.entries(d.off)) if (/^[a-z]{2,20}$/.test(k) && v === true) s.off[k] = true;
  if (d.doses && typeof d.doses === "object") {
    for (const [k, x] of Object.entries(d.doses)) {
      if (!/^[a-z]{2,20}$/.test(k) || !x || typeof x !== "object") continue;
      const o = { x: Math.round(num(x.x, 1, 5, 1)), by: Math.round(num(x.by, 0, 1e9, 0)), at: num(x.at, 0, 1e14, 0) };
      if (typeof x.until === "number") o.until = num(x.until, 0, 1e14, 0);
      else o.left = num(x.left, 0, 30 * 86400000, 0);
      if (typeof x.p === "string" && /^[a-z]{2,12}$/.test(x.p)) o.p = x.p;
      s.doses[k] = o;
    }
  }
  s.tolerance = d.tolerance === true;
  s.cravings = num(d.cravings, 0, 1e14, 0);
  if (typeof d.tenderSpot === "string" && /^[a-z]{2,12}$/.test(d.tenderSpot)) s.tenderSpot = d.tenderSpot;
  if (d.taken && typeof d.taken === "object") {
    for (const [k, list] of Object.entries(d.taken).slice(0, 40)) {
      if (!/^[a-z]{2,20}$/.test(k) || !Array.isArray(list)) continue;
      const l = list.filter((t) => typeof t === "number" && isFinite(t) && t > 0).slice(-20);
      if (l.length) s.taken[k] = l;
    }
  }
  if (d.parasites && typeof d.parasites === "object") for (const [k, v] of Object.entries(d.parasites).slice(0, 20)) if (/^[a-z]{2,12}$/.test(k) && v === true) s.parasites[k] = true;
  if (d.para && typeof d.para === "object") {
    for (const [k, x] of Object.entries(d.para).slice(0, 10)) {
      if (!/^[a-z]{2,12}$/.test(k) || !x || typeof x !== "object") continue;
      s.para[k] = { by: Math.round(num(x.by, 0, 1e9, 0)), name: String(x.name || "").slice(0, 30), since: num(x.since, 0, 1e14, 0), until: num(x.until, 0, 1e14, 0),
        strain: Array.isArray(x.strain) ? x.strain.filter((i) => typeof i === "string" && /^[a-z]{2,20}$/.test(i)).slice(0, 4) : [], fed: num(x.fed, 0, 1e14, 0),
        stage: Math.round(num(x.stage, 0, 9, 0)), n: Math.round(num(x.n, 0, 1e6, 0)), eggs: Math.round(num(x.eggs, 0, 9, 0)), next: num(x.next, 0, 1e14, 0) };
    }
  }
  if (d.grow && typeof d.grow === "object") for (const k of ["cup", "ass", "cock", "balls"]) { const v = num(d.grow[k], -10, 10, 0); if (v) s.grow[k] = Math.round(v); }   // (growth off the farm)
  // (Nov 18, later: these were saved but never read back, so a reload forgot them. Your nipples' trained stretch and
  // whether they close up, their loads; kits: the switch, what they put on, how fast, your saved ones, and the kit on
  // you now with your old outfit it's holdin'; horny gear's switch. Hole training's books and its two switches.)
  if (d.nipTrain && typeof d.nipTrain === "object") s.nipTrain = { lvl: num(d.nipTrain.lvl, 0, 3, 0), at: num(d.nipTrain.at, 0, 1e14, 0), open: num(d.nipTrain.open, 0, 1e14, 0), used: num(d.nipTrain.used, 0, 1e14, 0) };
  if (typeof d.nipsHeal === "boolean") s.nipsHeal = d.nipsHeal;
  if (d.nipLoads) s.nipLoads = Math.round(num(d.nipLoads, 0, 1e7, 0));
  if (d.nipLoadsBy && typeof d.nipLoadsBy === "object") { s.nipLoadsBy = {}; for (const [k, v] of Object.entries(d.nipLoadsBy).slice(-40)) if (/^\d{1,9}$/.test(k)) s.nipLoadsBy[k] = Math.round(num(v, 0, 1e7, 0)); }
  if (typeof d.hornyOn === "boolean") s.hornyOn = d.hornyOn;
  s.kitsOn = d.kitsOn === true;
  if (["slow", "steady", "fast", "now"].includes(d.kitSpeed)) s.kitSpeed = d.kitSpeed;
  if (["clothes", "binds", "both"].includes(d.kitWhat)) s.kitWhat = d.kitWhat;
  if (d.kits && typeof d.kits === "object") { s.kits = {}; for (const [k, v] of Object.entries(d.kits).slice(0, 8)) if (typeof k === "string" && k.length <= 40 && typeof v === "string" && v.length <= 12000) s.kits[k] = v; }
  { const K = d.kit, bundle = (a) => (Array.isArray(a) ? a.filter((b) => b && typeof b === "object" && typeof b.Group === "string" && typeof b.Name === "string").slice(0, 120) : []);
    if (K && typeof K === "object" && typeof K.key === "string" && Array.isArray(K.pieces)) {
      s.kit = { key: K.key.slice(0, 40), flav: typeof K.flav === "string" ? K.flav.slice(0, 40) : "plain", by: Math.round(num(K.by, 0, 1e9, 0)), old: bundle(K.old), pieces: bundle(K.pieces),
        queue: Array.isArray(K.queue) ? K.queue.filter((g) => typeof g === "string").slice(0, 120) : [], next: num(K.next, 0, 1e14, 0), at: num(K.at, 0, 1e14, 0), done: K.done === true, back: Math.round(num(K.back, 0, 999, 0)) };
    } }
  if (typeof d.holesHeal === "boolean") s.holesHeal = d.holesHeal;
  if (d.holesPain === false) s.holesPain = false;
  if (d.holes && typeof d.holes === "object") {
    const o = d.holes, out = { m: {}, pend: [], goals: {}, id: Math.round(num(o.id, 0, 1e12, 0)), sync: num(o.sync, 0, 1e14, 0), ep: typeof o.ep === "string" && /^[a-z0-9]{4,12}$/.test(o.ep) ? o.ep : "" };
    const lvl = (v) => Math.round(num(v, 1, 20, 1));
    for (const h of ["vulva", "butt", "throat"]) {
      const x = o.m && o.m[h];
      if (x && typeof x === "object") out.m[h] = { n: lvl(x.n), u: lvl(x.u), cr: num(x.cr, 0, 12, 0), t: num(x.t, 0, 1e14, 0), g: num(x.g, 0, 1e14, 0), hl: num(x.hl, 0, 1, 0),
        tk: typeof x.tk === "string" ? x.tk.slice(0, 120) : "", ta: num(x.ta, 0, 1e14, 0), gd: typeof x.gd === "string" ? x.gd.slice(0, 120) : "",
        ub: x.ub && typeof x.ub === "object" ? { at: num(x.ub.at, 0, 1e14, 0), n: num(x.ub.n, 0, 100, 0) } : undefined };
      const g = o.goals && o.goals[h];
      if (g && typeof g === "object") out.goals[h] = { to: lvl(g.to), by: Math.round(num(g.by, 0, 1e9, 0)), due: num(g.due, 0, 1e14, 0), at: num(g.at, 0, 1e14, 0) };
    }
    if (Array.isArray(o.has)) out.has = o.has.filter((h) => ["vulva", "butt", "throat"].includes(h));
    const op = (x) => { if (!x || typeof x !== "object" || !["vulva", "butt", "throat"].includes(x.h)) return null; const r = { h: x.h }; for (const k of ["up", "down", "tight", "set", "st"]) if (typeof x[k] === "number") r[k] = Math.round(num(x[k], 0, 20, 0)); return Object.keys(r).length > 1 ? r : null; };
    if (Array.isArray(o.pend)) out.pend = o.pend.map(op).filter(Boolean).slice(-80);
    if (o.fly && typeof o.fly === "object" && Array.isArray(o.fly.ops)) out.fly = { id: Math.round(num(o.fly.id, 0, 1e12, 0)), ops: o.fly.ops.map(op).filter(Boolean).slice(0, 60), at: 0 };
    s.holes = out;
  }
  // (Nov 19) seed: what's in you, whose, every load you've taken, and what's waitin' for the farm girl (seed.js)
  if (d.seed && typeof d.seed === "object") {
    const o = d.seed, HS = ["vulva", "butt", "mouth", "nips"], mn = (k) => /^\d{1,9}$/.test(String(k));
    const by = (m) => { const r = {}; if (m && typeof m === "object") for (const [k, v] of Object.entries(m).slice(0, 8)) if (mn(k)) r[k] = num(v, 0, 40000, 0); return r; };
    const ld = (x) => (x && typeof x === "object" && HS.includes(x.h) && Number(x.by) > 0 ? { h: x.h, ml: Math.round(num(x.ml, 0, 40000, 0)), by: Math.round(num(x.by, 0, 1e9, 0)), at: num(x.at, 0, 1e14, 0), nc: x.nc ? 1 : 0, here: x.here ? 1 : 0, nm: typeof x.nm === "string" ? x.nm.slice(0, 40) : undefined, up: x.up ? 1 : undefined, via: x.via === "cock" ? "cock" : undefined } : null);
    // (a draught waitin' in flight with them)
    const out = { h: {}, from: {}, seals: {}, leak: {}, drip: {}, pend: [], n: Math.round(num(o.n, 0, 1e7, 0)), ml: num(o.ml, 0, 1e10, 0), id: Math.round(num(o.id, 0, 1e12, 0)), cap: num(o.cap, 0, 60000, 0), sync: num(o.sync, 0, 1e14, 0),
      ep: typeof o.ep === "string" && /^[a-z0-9]{4,12}$/.test(o.ep) ? o.ep : "", no: typeof o.no === "string" ? o.no.slice(0, 20) : "" };
    for (const h of HS) { const x = o.h && o.h[h]; out.h[h] = { ml: x && typeof x === "object" ? num(x.ml, 0, 40000, 0) : 0, by: x && typeof x === "object" ? by(x.by) : {} }; }
    if (o.from && typeof o.from === "object") for (const [k, f] of Object.entries(o.from).slice(-40)) if (mn(k) && f && typeof f === "object") out.from[k] = { n: Math.round(num(f.n, 0, 1e7, 0)), ml: num(f.ml, 0, 1e10, 0), at: num(f.at, 0, 1e14, 0), nm: typeof f.nm === "string" ? f.nm.slice(0, 40) : "" };
    if (o.seals && typeof o.seals === "object") for (const h of HS) { const x = o.seals[h]; if (x && typeof x === "object" && Number(x.by) > 0) out.seals[h] = { by: Math.round(num(x.by, 0, 1e9, 0)), g: String(x.g || "").slice(0, 40), nm: String(x.nm || "").slice(0, 40) }; }
    if (Array.isArray(o.pend)) out.pend = o.pend.map(ld).filter(Boolean).slice(-60);
    if (o.fly && typeof o.fly === "object" && Array.isArray(o.fly.loads)) out.fly = { id: Math.round(num(o.fly.id, 0, 1e12, 0)), loads: o.fly.loads.map(ld).filter(Boolean).slice(0, 30), at: 0, quick: o.fly.quick ? Math.round(num(o.fly.quick, 0, 20, 0)) : undefined };
    s.seed = out;
  }
  // (Nov 19) breedin' anywhere (breed.js): your switch, a knot you're tied on, the farm's ripe days and cock for you
  s.breedAny = d.breedAny === true;
  // (Nov 19, part two: carry.js) what the farm says you're carryin', and what you did away for her books
  if (d.carry && typeof d.carry === "object") s.carry = d.carry;   // (carry.js carryWelcome cleans it as it comes in)
  const stamp = (x, keys) => { if (!x || typeof x !== "object") return undefined; const o = {}; for (const k of keys) if (typeof x[k] === "number" && isFinite(x[k])) o[k] = x[k]; return o.at > 0 || o.start > 0 ? o : undefined; };
  s.born = stamp(d.born, ["at", "midwife", "helps", "n", "due"]); if (!s.born) delete s.born;
  s.laid = stamp(d.laid, ["at", "n"]); if (!s.laid) delete s.laid;
  s.labour = stamp(d.labour, ["start", "until", "next", "due", "helps", "midwife"]); if (!s.labour) delete s.labour;
  s.laying = stamp(d.laying, ["start", "next", "pushes"]); if (!s.laying) delete s.laying;
  if (d.quick) s.quick = Math.round(num(d.quick, 0, 20, 0)); if (d.heatAt) s.heatAt = num(d.heatAt, 0, 1e14, 0);
  if (d.tie && typeof d.tie === "object" && Number(d.tie.by) > 0 && ["vulva", "butt"].includes(d.tie.h)) s.tie = { by: Math.round(num(d.tie.by, 0, 1e9, 0)), h: d.tie.h, until: num(d.tie.until, 0, 1e14, 0) };
  if (d.ripe && typeof d.ripe === "object" && num(d.ripe.at, 0, 1e14, 0) > 0) s.ripe = { at: num(d.ripe.at, 0, 1e14, 0), every: Math.round(num(d.ripe.every, 2, 30, 7)), from: Math.round(num(d.ripe.from, 0, 29, 3)), days: Math.round(num(d.ripe.days, 1, 10, 2)) };
  if (d.cock && typeof d.cock === "object") s.cock = { load: Math.round(num(d.cock.load, 0, 5000, 0)), knot: d.cock.knot === true, tie: Array.isArray(d.cock.tie) ? d.cock.tie.slice(0, 2).map((x) => Math.round(num(x, 1, 40, 5))) : null };
  s.mouthAuto = d.mouthAuto === true;
  s.guided = d.guided === true;   // (Nov 19: you've opened a guide, so the guides fold away at the top of the page)
  s.iconsShow = d.iconsShow !== false; s.iconsShare = d.iconsShare !== false;   // (dose icons: both on till you switch them off)
  s.wornPause = num(d.wornPause, 0, 1e14, 0);
  if (Array.isArray(d.later)) {
    s.later = d.later.filter((c) => c && typeof c === "object" && /^[a-z]{2,20}$/.test(c.id)).slice(0, 5).map((c) => {
      const o = { id: c.id, x: Math.round(num(c.x, 1, 5, 1)), by: Math.round(num(c.by, 0, 1e9, 0)) };
      if (typeof c.p === "string" && /^[a-z]{2,12}$/.test(c.p)) o.p = c.p;
      if (typeof c.fire === "number") o.fire = num(c.fire, 0, 1e14, 0); else o.in = num(c.in, 0, 6 * 3600000, 0);
      return o;
    });
  }
  if (Array.isArray(d.farm)) s.farm = d.farm.filter((m) => Number.isInteger(m) && m > 0).slice(0, 300);
  s.farmAt = num(d.farmAt, 0, 1e14, 0);
  s.seen = num(d.seen, 0, 1e14, 0);
  s.stock = d.stock === true;
  if (typeof d.species === "string" && /^[a-z]{2,12}$/.test(d.species)) s.species = d.species;            // your own pick
  if (typeof d.speciesFarm === "string" && /^[a-z]{2,20}$/.test(d.speciesFarm)) s.speciesFarm = d.speciesFarm;   // the farm's word
  s.screen = d.screen !== false;
  if (Array.isArray(d.keys)) s.keys = [...new Set(d.keys.filter((m) => Number.isInteger(m) && m > 0 && m < 1e9))].slice(0, 10);
  if (d.hard && typeof d.hard === "object") {
    const H = d.hard;
    s.hard = { on: H.on === true, since: num(H.since, 0, 1e14, 0), until: num(H.until, 0, 1e14, 0), checkAt: num(H.checkAt, 0, 1e14, 0),
      log: Array.isArray(H.log) ? H.log.filter((l) => l && typeof l === "object").slice(-50).map((l) => ({ t: num(l.t, 0, 1e14, 0), by: Math.round(num(l.by, 0, 1e9, 0)), what: String(l.what || "").slice(0, 200) })) : [] };
  }
  if (d.wards && typeof d.wards === "object") {
    for (const [k, x] of Object.entries(d.wards).slice(0, 50)) {
      if (!/^\d{1,9}$/.test(k) || !x || typeof x !== "object") continue;
      s.wards[k] = { name: String(x.name || "").slice(0, 40), until: num(x.until, 0, 1e14, 0), due: num(x.due, 0, 1e14, 0), seen: num(x.seen, 0, 1e14, 0), checked: num(x.checked, 0, 1e14, 0), asked: num(x.asked, 0, 1e14, 0) };
    }
  }
  return s;
}

const localKey = () => "fd-" + (W.Player && W.Player.MemberNumber);
function fromAccount() {
  try {
    const raw = W.Player && W.Player.ExtensionSettings && W.Player.ExtensionSettings[KEY];
    if (typeof raw !== "string" || !raw) return null;
    const txt = W.LZString && typeof W.LZString.decompressFromBase64 === "function" ? W.LZString.decompressFromBase64(raw) : null;
    return txt ? JSON.parse(txt) : null;
  } catch (e) { return null; }
}
function fromBrowser() { try { return JSON.parse(W.localStorage.getItem(localKey())); } catch (e) { return null; } }

export function load() {
  // the account wins: it's the one that follows you about
  S = clean(fromAccount() || fromBrowser());
  return S;
}
export const st = () => S || load();

export function save(now) {
  clearTimeout(saveT);
  const go = () => {
    try { W.localStorage.setItem(localKey(), JSON.stringify(S)); } catch (e) { /* a private window: fine */ }
    try {
      if (W.Player && W.Player.ExtensionSettings && W.LZString && typeof W.ServerPlayerExtensionSettingsSync === "function") {
        W.Player.ExtensionSettings[KEY] = W.LZString.compressToBase64(JSON.stringify(S));
        W.ServerPlayerExtensionSettingsSync(KEY);
      }
    } catch (e) { console.warn("[Dispensary] couldn't save to your account:", e); }
  };
  if (now) go(); else saveT = setTimeout(go, 1500);
  for (const f of listeners) { try { f(); } catch (e) { /* fine */ } }
}
export function onSave(f) { listeners.push(f); }
