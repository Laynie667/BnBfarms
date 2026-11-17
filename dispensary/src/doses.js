/* WHAT'S IN THIS FILE (doses.js)
   THE DOSE BOOK, THE CLOCK, AND WHAT EACH DOSE DOES.
   A dose is words on a crafted item ("Denial Serum x2"). Givin' one adds its time; the clock counts it down, either
   only while you're online or in real time (with the penalty on top, config.js).
     step 1 (Nov 17)   Denial Serum, the Sedative (LSCG's own whenever LSCG is loaded)
     step 3 (Nov 17)   the shots and potions that work anywhere: Needy Nectar (LSCG's aphrodisiac when it's loaded),
                       Hair Trigger, Bitterroot, Moo Juice, Hiccup Fizz, Featherlight, Heat, the Purge, and Suggestible
                       (LSCG's only: without LSCG, the farm's obedience shot stays the farm's trance)
   The farm's potions speak in the farm girl's own voice (shared/potion-voice.js), on the farm and off it alike.
*/
import { st, save } from "./store.js";
import { LINES } from "./lines.js";
import { POTION_VOICE } from "../../shared/potion-voice.js";
import { local, action, fill, pick, inRoom, myName } from "./say.js";
import { lscgPresent, lscgShow, lscgDose } from "./lscg.js";

const W = window, MIN = 60000, CAP = 48 * 60 * MIN;

// voice: the farm's potion its lines come from · every: minutes between its moments · room: those moments for the room
// (otherwise just for you) · lscg: LSCG's own drug of that kind (whenever LSCG's loaded it's LSCG's) · soak: the words
// that read right before "-soaked" or "-laced" on LSCG's soaked gear · instant: done at once, no clock
export const BOOK = {
  denial: {
    label: "Denial Serum", icon: "🚫", mins: 120, color: "#b04a7a", farm: true,
    words: /\b(denial serum|edge serum|orgasm (?:block\w*|denial)|held at the edge)\b/,
    keywords: ["denial serum", "edge serum", "orgasm block"], soak: ["denial", "edging"],
    desc: "Held right at the edge: you can climb all you like, but you can't go over till it wears off. Two hours a dose.",
  },
  sedative: {
    label: "Sedative", icon: "💤", mins: 60, color: "#6d7fa8", farm: true, lscg: "sedative",
    words: /\b(sedat\w*|tranquili[sz]\w*|drowsy|sleepy serum)\b/,
    keywords: ["sedative", "tranquilizer"],
    desc: "Heavy, drowsy and slow: a sleepy face, slow feet, and eyes that keep wantin' to close. An hour a dose.",
  },
  needy: {
    label: "Needy Nectar", icon: "💗", mins: 30, color: "#e0607e", farm: true, lscg: "horny", voice: "needy", every: [4, 7],
    words: /\b(aphrodisiac|horny|lust serum|libido|needy nectar)\b/,
    keywords: ["needy nectar", "aphrodisiac", "lust serum"],
    desc: "Achin' and squirmin': your arousal creeps up and won't settle, and your face gives you away. Half an hour a dose.",
  },
  hairtrigger: {
    label: "Hair Trigger", icon: "⚡", mins: 60, color: "#e8b04a", farm: true, every: [6, 10],
    words: /\b(hair[- ]?trigger|sensiti[sz]er|oversensitiv\w*)\b/,
    keywords: ["hair trigger", "sensitizer"], soak: ["sensitizer", "sensitizing"],
    desc: "Every touch counts double: whatever anybody does to you works you up twice as fast. An hour a dose.",
  },
  bitterroot: {
    label: "Bitterroot", icon: "🌿", mins: 30, color: "#6f8f4a", farm: true, voice: "bitterroot", every: [5, 8],
    words: /\b(bitterroot|ruin(?:ing|ed)? (?:serum|draught|tonic|shot))\b/,
    keywords: ["bitterroot"], soak: ["bitterroot", "ruin"],
    desc: "Every orgasm slips away ruined: you go over, and get none of the relief. Half an hour a dose.",
  },
  moo: {
    label: "Moo Juice", icon: "🐄", mins: 20, color: "#c9a35b", farm: true, voice: "moo", every: [6, 10], room: true,
    words: /\b(moo (?:serum|shot|juice))\b/,
    keywords: ["moo juice", "moo serum"], soak: ["moo"],
    desc: "Your words keep comin' out as the noises your animal makes. Twenty minutes a dose.",
  },
  hiccup: {
    label: "Hiccup Fizz", icon: "🫧", mins: 15, color: "#7ec8e3", farm: true, voice: "hiccup", every: [1, 3], room: true,
    words: /\b(hiccup\w*)\b/,
    keywords: ["hiccup fizz"], soak: ["hiccup"],
    desc: "Hiccups. In every other sentence. At the worst possible moments. Fifteen minutes a dose.",
  },
  feather: {
    label: "Featherlight", icon: "🪶", mins: 15, color: "#d9c8f0", farm: true, voice: "feather", every: [2, 4], room: true,
    words: /\b(featherlight|tickl\w* (?:serum|draught|potion|shot))\b/,
    keywords: ["featherlight"], soak: ["tickle", "tickling"],
    desc: "Unbearably ticklish: giggles slip into everything you say. Fifteen minutes a dose.",
  },
  heat: {
    label: "Heat", icon: "🔥", mins: 60, color: "#e0703a", farm: true, voice: "heatmist", every: [4, 6], room: true,
    words: /\b(heat[- ]?inducer|heat mist|in heat serum)\b/,
    keywords: ["heat inducer", "heat mist"], soak: ["heat"],
    desc: "In heat: your arousal won't drop below a simmer, and everybody near can tell. On the farm, the farm keeps the heat itself. An hour a dose.",
  },
  suggestible: {
    label: "Suggestible", icon: "🌀", mins: 30, color: "#4cd964", farm: true, lscg: "suggestible", lscgOnly: true,
    words: /\b(obedien\w*|docile|compliance|suggest[ia]ble)\b/,
    keywords: ["obedience", "docile"],
    desc: "LSCG's Suggestible: the more of it in you, the more you want to do as you're told. Only with LSCG; without it, the farm's obedience shot is the farm's trance.",
  },
  purge: {
    label: "Purge", icon: "🧼", mins: 0, color: "#9fc7c7", farm: true, instant: true,
    words: /\b(purge (?:serum|shot)|antidote|detox|cleanser)\b/,
    keywords: ["purge serum", "antidote"],
    desc: "Every dose in you flushed out at once (and LSCG's too, with its own antidote, when it's loaded).",
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

// what it says: the farm girl's own lines for a farm potion, otherwise the Dispensary's (lines.js)
const voiceOf = (id) => (BOOK[id] && BOOK[id].voice && POTION_VOICE[BOOK[id].voice]) || null;
const nameIn = (t) => String(t).replace(/%n/g, myName());
export function takeLine(id) { const v = voiceOf(id); return v && v.seen.length ? nameIn(pick(v.seen)) : LINES[id] && LINES[id].take ? fill(pick(LINES[id].take)) : ""; }
function nowLine(id) { const v = voiceOf(id); return v && v.now.length ? nameIn(pick(v.now)) : LINES[id] && LINES[id].now ? fill(pick(LINES[id].now)) : ""; }
function offLine(id) { const v = voiceOf(id); return v && v.off.length ? nameIn(pick(v.off)) : LINES[id] && LINES[id].off ? fill(pick(LINES[id].off)) : ""; }

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
  if (B.instant) return purge(o);
  if (B.lscg && lscgPresent()) return { ok: false, why: "lscg" };   // LSCG's own: the callers route it there
  if (B.lscgOnly) return { ok: false, why: "nolscg" };               // (and without LSCG, nothing of ours)
  const now = Date.now(), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
  const dur = Math.max(MIN, Math.min(CAP, (Number(o.mins) > 0 ? Number(o.mins) : B.mins * x) * MIN));
  const was = active(id), d = S.doses[id], by = Number(o.by) || 0;
  const xNow = Math.max(x, was && d ? d.x || 1 : 1);
  if (S.clock === "real") {
    const add = dur * penaltyF(), base = was && typeof d.until === "number" ? d.until : now;
    S.doses[id] = { x: xNow, by, at: now, until: Math.min(now + CAP * penaltyF(), o.upto ? Math.max(base, now + add) : base + add) };
  } else {
    const base = was && typeof d.left === "number" ? d.left : 0;
    S.doses[id] = { x: xNow, by, at: now, left: Math.min(CAP, o.upto ? Math.max(base, dur) : base + dur) };
  }
  save();
  if (!was) start(id);
  if (!o.quiet) action(o.line || takeLine(id));
  try { lscgShow(id, by); } catch (e) { /* fine */ }
  return { ok: true };
}
// the Purge: everything out at once, ours and (with LSCG) LSCG's own through its antidote
function purge(o) {
  const n = clearAll("purge");
  let lscg = false; if (lscgPresent()) { try { lscg = lscgDose("antidote", { by: o.by }); } catch (e) { /* fine */ } }
  if (!o.quiet) action(o.line || fill("%t shudders as the purge hits, and every dose in them drains away, clean and cold."));
  return { ok: true, n, lscg };
}

// a dose ends: worn off ("done"), LSCG's antidote ("lscg"), a safeword ("safeword"), the Purge, or quietly ("quiet")
export function end(id, why) {
  const S = st();
  if (!S.doses[id]) return false;
  delete S.doses[id];
  save();
  stop(id);
  if (why === "done" || why === "lscg") { const l = offLine(id); if (l) local(l); }
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
const meter = () => { const A = W.Player && W.Player.ArousalSettings; return A && A.Active !== "Inactive" && A.Active !== "NoMeter" ? A : null; };
function setArousal(v) {
  try { const A = meter(); if (!A) return; const n = Math.max(0, Math.min(100, Math.round(v))); if (typeof W.ActivitySetArousal === "function") W.ActivitySetArousal(W.Player, n); else A.Progress = n; } catch (e) { /* fine */ }
}
const xOf = (id) => (st().doses[id] && st().doses[id].x) || 1;
const felt = {};   // id → { face, next } (when its face was last set, when its next moment is)
function start(id) {
  if (id === "sedative") face("Eyes", "Dazed", 180);
  if (id === "needy" || id === "heat") face("Blush", "Medium", 120);
}
function stop(id) {
  if (id === "sedative") face("Eyes", null);
  if ((id === "needy" || id === "heat") && !active("needy") && !active("heat")) face("Blush", null);
  delete felt[id];
}
function feel(id, now) {
  const B = BOOK[id];
  const f = felt[id] || (felt[id] = { face: now, next: now + ((B.every ? B.every[0] : 3) + Math.random() * 2) * MIN });
  // what it does to you
  if (id === "sedative" && now - f.face > 2 * MIN) { f.face = now; face("Eyes", "Dazed", 180); }
  if (id === "needy") {   // creepin' up, and it won't settle (up to 70, more for a stronger dose)
    const A = meter(), cap = Math.min(92, 60 + 10 * xOf(id));
    if (A && (Number(A.Progress) || 0) < cap) setArousal((Number(A.Progress) || 0) + 2);
    if (now - f.face > 2 * MIN) { f.face = now; face("Blush", "Medium", 120); }
  }
  if (id === "heat") {    // a simmer it won't drop below
    const A = meter(), floor = Math.min(70, 25 + 15 * xOf(id));
    if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
    if (now - f.face > 2 * MIN) { f.face = now; face("Blush", "Medium", 120); }
  }
  // its moments, now and then: for the room, or just for you
  if (B.every && now >= f.next && inRoom()) {
    f.next = now + (B.every[0] + Math.random() * (B.every[1] - B.every[0])) * MIN;
    const l = nowLine(id);
    if (l) { if (B.room) action(l); else local(l); }
  } else if (!B.every && id === "sedative" && now >= f.next && inRoom()) {
    f.next = now + (8 + Math.random() * 6) * MIN; local(pick(LINES.sedative.drift));
  }
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
  // Bitterroot: you go over, and it's ruined (the game's own ruined orgasm)
  try {
    mod.hookFunction("ActivityOrgasmStart", 6, (args, next) => {
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("bitterroot")) W.ActivityOrgasmRuined = true; } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] Bitterroot can't ruin you:", e); }
  // Hair Trigger: every touch on you counts double
  try {
    mod.hookFunction("ActivitySetArousalTimer", 6, (args, next) => {
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("hairtrigger") && Number(args[3]) > 0) { args[3] = Number(args[3]) * 2; } } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] Hair Trigger can't reach you:", e); }
  // the Sedative (ours): every step on a map takes longer
  try {
    mod.hookFunction("ChatRoomMapViewCanEnterTile", 1, (args, next) => {
      const t = next(args);
      try { return t > 0 && active("sedative") ? t * 1.6 : t; } catch (e) { return t; }
    });
  } catch (e) { console.warn("[Dispensary] the Sedative can't slow you:", e); }
}
