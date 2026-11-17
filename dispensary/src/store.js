/* WHAT'S IN THIS FILE (store.js)
   Your Dispensary settings and the doses runnin' in you, kept on your ACCOUNT (the game's Player.ExtensionSettings,
   saved by the server) as well as in this browser. They follow you between your phone and your PC, and clearin' the
   browser doesn't undo anything (hardcore will lean on that).
*/
import { KEY, LADDER, DEFAULT_RUNG, PENALTY } from "./config.js";

const W = window;
let S = null, saveT = null;
const listeners = [];

const fresh = () => ({ v: 1, who: DEFAULT_RUNG, clock: "online", penalty: PENALTY, off: {}, doses: {}, farm: [], farmAt: 0, seen: 0, stock: false, hard: { on: false, log: [] }, wards: {}, keys: [], species: "", speciesFarm: "", screen: true });
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
      s.doses[k] = o;
    }
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
