/* WHAT'S IN THIS FILE (doses.js)
   THE DOSE BOOK, THE CLOCK, AND WHAT EACH DOSE DOES.
   A dose is words on a crafted item ("Denial Serum x2"). Givin' one adds its time; the clock counts it down, either
   only while you're online or in real time (with the penalty on top, config.js). Step 1 (Nov 17) has two:
     Denial Serum   held right at the edge: you can't go over till it wears off
     Sedative       heavy, drowsy and slow (LSCG's own sedative instead, whenever LSCG is loaded)
*/
import { st, save } from "./store.js";
import { LINES } from "./lines.js";
import { local, action, fill, pick, inRoom } from "./say.js";
import { lscgPresent, lscgShow } from "./lscg.js";

const W = window, MIN = 60000, CAP = 48 * 60 * MIN;

export const BOOK = {
  denial: {
    label: "Denial Serum", icon: "🚫", mins: 120, color: "#b04a7a", farm: true,
    words: /\b(denial serum|edge serum|orgasm (?:block\w*|denial)|held at the edge)\b/,
    keywords: ["denial serum", "edge serum", "orgasm block"],
    desc: "Held right at the edge: you can climb all you like, but you can't go over till it wears off. Two hours a dose.",
  },
  sedative: {
    label: "Sedative", icon: "💤", mins: 60, color: "#6d7fa8", farm: true, lscg: "sedative",
    words: /\b(sedat\w*|tranquili[sz]\w*|drowsy|sleepy serum)\b/,
    keywords: ["sedative", "tranquilizer"],
    desc: "Heavy, drowsy and slow: a sleepy face, slow feet, and eyes that keep wantin' to close. An hour a dose.",
  },
};
export const doseIds = () => Object.keys(BOOK);

// "Denial Serum x2", "triple sedative": how many doses in one go (1 to 5), like the farm's shots
export function stackOf(text) {
  const t = String(text || "").toLowerCase(), m = /\bx\s?([2-5])\b|\b([2-5])\s?x\b/.exec(t);
  if (m) return Number(m[1] || m[2]);
  return /\btriple\b/.test(t) ? 3 : /\bdouble\b/.test(t) ? 2 : 1;
}
export function dosesIn(text) {
  const t = String(text || "").toLowerCase(), x = stackOf(t);
  return doseIds().filter((id) => BOOK[id].words.test(t)).map((id) => ({ id, x }));
}

const penaltyF = () => 1 + st().penalty / 100;
export function active(id) {
  const d = st().doses[id];
  return !!d && (typeof d.until === "number" ? d.until > Date.now() : d.left > 0);
}
// what's left: real time on the real clock, your online time on the online one
export function leftMs(id) {
  const d = st().doses[id];
  if (!d) return 0;
  return typeof d.until === "number" ? Math.max(0, d.until - Date.now()) : Math.max(0, d.left || 0);
}

// give a dose. o: { by, x, mins (instead of the book's time × x), line (the room's line instead of ours), quiet,
// upto (top it up to at least this much instead of addin': the same dose arriving twice by two roads) }
export function give(id, o) {
  o = o || {};
  const B = BOOK[id], S = st();
  if (!B) return { ok: false, why: "unknown" };
  if (S.off[id]) return { ok: false, why: "off" };
  if (B.lscg && lscgPresent()) return { ok: false, why: "lscg" };   // LSCG's own: the callers route it there
  const now = Date.now(), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
  const dur = Math.max(MIN, Math.min(CAP, (Number(o.mins) > 0 ? Number(o.mins) : B.mins * x) * MIN));
  const was = active(id), d = S.doses[id], by = Number(o.by) || 0;
  if (S.clock === "real") {
    const add = dur * penaltyF(), base = was && typeof d.until === "number" ? d.until : now;
    S.doses[id] = { x, by, at: now, until: Math.min(now + CAP * penaltyF(), o.upto ? Math.max(base, now + add) : base + add) };
  } else {
    const base = was && typeof d.left === "number" ? d.left : 0;
    S.doses[id] = { x, by, at: now, left: Math.min(CAP, o.upto ? Math.max(base, dur) : base + dur) };
  }
  save();
  if (!was) start(id);
  if (!o.quiet) action(fill(o.line || pick(LINES[id].take)));
  try { lscgShow(id, by); } catch (e) { /* fine */ }
  return { ok: true };
}

// a dose ends: worn off ("done"), LSCG's antidote ("lscg"), a safeword ("safeword"), or quietly ("quiet")
export function end(id, why) {
  const S = st();
  if (!S.doses[id]) return false;
  delete S.doses[id];
  save();
  stop(id);
  if ((why === "done" || why === "lscg") && LINES[id]) local(pick(LINES[id].off));
  return true;
}
export function clearAll(why) { let n = 0; for (const id of Object.keys(st().doses)) if (end(id, why)) n++; return n; }

// the clock, every few seconds. Online: only time you're here counts (a sleepin' laptop's gap doesn't).
let lastTick = 0, lastSave = 0;
export function tick() {
  const S = st(), now = Date.now(), gap = lastTick ? Math.max(0, Math.min(now - lastTick, 15000)) : 0;
  lastTick = now;
  for (const [id, d] of Object.entries(S.doses)) {
    if (!BOOK[id]) { delete S.doses[id]; continue; }
    if (typeof d.until !== "number") d.left = Math.max(0, (d.left || 0) - gap);
    if (!active(id)) end(id, "done");
    else feel(id, now);
  }
  if (now - lastSave > MIN) { lastSave = now; if (Object.keys(S.doses).length) save(); }
}

// switchin' the clock: what's left carries over, with the penalty added (or taken back off)
export function setClock(mode) {
  const S = st(), want = mode === "real" ? "real" : "online";
  if (S.clock === want) return;
  const now = Date.now(), f = penaltyF();
  for (const d of Object.values(S.doses)) {
    if (want === "real" && typeof d.until !== "number") { d.until = now + (d.left || 0) * f; delete d.left; }
    else if (want === "online" && typeof d.until === "number") { d.left = Math.max(0, d.until - now) / f; delete d.until; }
  }
  S.clock = want;
  save();
}

// ── what they do ───────────────────────────────────────────
const face = (group, expr, secs) => { try { if (typeof W.CharacterSetFacialExpression === "function" && W.Player) W.CharacterSetFacialExpression(W.Player, group, expr, secs); } catch (e) { /* fine */ } };
const felt = {};   // id → when we last did its now-and-then
function start(id) {
  if (id === "sedative") face("Eyes", "Dazed", 180);
}
function stop(id) {
  if (id === "sedative") face("Eyes", null);
  delete felt[id];
}
function feel(id, now) {
  if (id !== "sedative" || !inRoom()) return;
  const f = felt[id] || (felt[id] = { face: now, drift: now + (3 + Math.random() * 4) * MIN });
  if (now - f.face > 2 * MIN) { f.face = now; face("Eyes", "Dazed", 180); }
  if (now >= f.drift) { f.drift = now + (8 + Math.random() * 6) * MIN; local(pick(LINES.sedative.drift)); }
}

let heldTold = 0;
export function initDoses(mod) {
  // Denial Serum: held at the edge instead of goin' over
  try {
    mod.hookFunction("ActivityOrgasmPrepare", 6, (args, next) => {
      try {
        const C = args[0];
        if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("denial")) {
          if (C.ArousalSettings) C.ArousalSettings.Progress = 94;
          face("Blush", "High", 20);
          if (Date.now() - heldTold > MIN) { heldTold = Date.now(); local(pick(LINES.denial.held)); }
          return undefined;
        }
      } catch (e) { /* the game's own way, then */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] Denial Serum can't hold you:", e); }
  // the Sedative (ours): every step on a map takes longer
  try {
    mod.hookFunction("ChatRoomMapViewCanEnterTile", 1, (args, next) => {
      const t = next(args);
      try { return t > 0 && active("sedative") ? t * 1.6 : t; } catch (e) { return t; }
    });
  } catch (e) { console.warn("[Dispensary] the Sedative can't slow you:", e); }
}
