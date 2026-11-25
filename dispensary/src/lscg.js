/* WHAT'S IN THIS FILE (lscg.js)
   LSCG, done LSCG's way (Laynie, Nov 16: "We should handle it like LSCG, and defer to LSCG for those when it that
   extension is detected").
   - LSCG's own (sedative, aphrodisiac, mind control, suggestible since Nov 3, antidote) are LSCG's whenever LSCG is loaded. Our Sedative
     steps aside; a trap, an injector or the farm girl's call gives LSCG's own through its front door (api.drugs.dose).
   - Our doses go in LSCG's own list (its extension API, docs/api.md in LSCG): players switch each one on in LSCG's
     Drug Enhancements, like LSCG's own, and then LSCG players see a bar for it showin' the time left.
   - One door per dose: a needle LSCG catches with our words comes to us through LSCG; if LSCG lets it pass (not switched
     on there), we catch it ourselves (needle.js waits a moment to see which).
   - Somebody not on your list gets nothin' through LSCG either (drug.beforeApply).
   Notes for Little Sera as we go: extensions can't make their own lastin' states yet, so a dose keeps its own clock and
   only shows LSCG its level (minutes left; decay 0, set every tick).
*/
import { LSCG_ID } from "./config.js";
import { VERSION } from "./version.js";
import { BOOK, give, end, active, leftMs, clearAll, partFor } from "./doses.js";
import { handTextOf } from "./needle.js";
import { isLater, queue } from "./later.js";
import { allowed } from "./ladder.js";
import { st } from "./store.js";
import { hardOn, askOut } from "./hardcore.js";
import { nipsLscg } from "./nipples.js";
import { local } from "./say.js";

const W = window;
let api = null, caps = null, syncing = null;
const REG = {}, lastLscg = {};
const ours = (id) => LSCG_ID + "." + id;
const minsLeft = (id) => Math.ceil(leftMs(id) / 60000);
export const BREATH_MINS = 10;   // what each breath through soaked gear keeps a dose topped up to

// is LSCG here at all (an old one without the extension API still owns its own)
export function lscgPresent() {
  if (W.LSCG) return true;
  try { const sdk = W.bcModSdk; if (sdk && typeof sdk.getModsInfo === "function") return sdk.getModsInfo().some((m) => m && m.name === "LSCG"); } catch (e) { /* fine */ }
  return false;
}
export const lscgApi = () => !!(api && caps && caps.has("drugs"));
export const lscgHas = (id) => lscgApi() && !!REG[id];
export const lastLscgDose = (id) => lastLscg[id] || 0;

// one of LSCG's own, from code (a trap, an injector, the farm girl's call): false if it didn't take
export function lscgDose(type, o) {
  if (!lscgApi()) return false;
  o = o || {};
  try { return !!api.drugs.dose(type, { multiplier: Math.max(0.2, Math.min(3, Number(o.x) || 1)), method: o.method || "inject", sender: o.by, minigame: false }); } catch (e) { return false; }
}
// our dose's bar in LSCG (only shows if they've switched it on there)
export function lscgShow(id, by) {
  if (!lscgHas(id) || syncing) return;
  syncing = id;
  try { api.drugs.dose(ours(id), { multiplier: 1, method: "inject", sender: by || undefined, minigame: false }); } catch (e) { /* fine */ } finally { syncing = null; }
}

function setUp(L) {
  try { api = L.getModApi({ id: LSCG_ID, name: "The Farmhand's Dispensary", version: VERSION }); } catch (e) { api = null; return; }
  caps = L.capabilities || new Set();
  if (caps.has("drugs")) {
    for (const [id, B] of Object.entries(BOOK)) {
      if (B.lscg || B.instant || B.noLscg || REG[id]) continue;   // (a kit's no drug: it isn't LSCG's to list)   // LSCG's own are never ours to add (nor the Purge: LSCG has its antidote)
      try {
        api.drugs.register({
          name: id, label: B.label, description: B.desc, keywords: B.keywords, color: B.color, soakKeywords: B.soak || undefined,
          max: 600, decayPerMinute: 0, tickSeconds: 20,
          onDose(ctx) {
            if (syncing === id) { ctx.setLevel(minsLeft(id)); return; }
            // LSCG caught it (a needle, a drink, a breath of gas): the dose is ours to give
            lastLscg[id] = Date.now();
            // a soaked or laced gag, mask or bit, or a gas mask (LSCG 0.9.9): it doses on every breath, so a breath keeps
            // the dose topped up to a few minutes instead of addin' a whole dose each time (Nov 17: it piled up hours a
            // minute). It wears off soon after the gear comes off.
            if (ctx.method === "breath") {
              const r0 = give(id, { by: ctx.sender, mins: BREATH_MINS, upto: true, quiet: active(id) });
              ctx.setLevel(r0.ok ? minsLeft(id) : 0);
              return;
            }
            const mult = Math.max(0.5, Math.min(2, Number(ctx.multiplier) || 1));
            // what's on the needle (Fill-Out's part, Tender's spot, a time-release capsule): the words in their hand
            const text = typeof ctx.sender === "number" ? handTextOf(ctx.sender) : "", p = partFor(id, text) || undefined;
            if (text && isLater(text)) { queue(id, { by: ctx.sender, x: 1, p }); ctx.setLevel(active(id) ? minsLeft(id) : 0); return; }
            const r = give(id, { by: ctx.sender, mins: Math.round(B.mins * mult), p });
            ctx.setLevel(r.ok ? minsLeft(id) : 0);
          },
          onTick(ctx) { const m = active(id) ? minsLeft(id) : 0; if (ctx.level !== m) ctx.setLevel(m); },
          onWearOff() { if (active(id)) end(id, "lscg"); },   // LSCG's antidote, or LSCG's safeword
        });
        REG[id] = true;
      } catch (e) { console.warn("[Dispensary] LSCG wouldn't take " + id + ":", e); }
    }
  }
  // the nipple actions, as LSCG extension activities (nipples.js)
  try { nipsLscg(api, caps); } catch (e) { console.warn("[Dispensary] LSCG nipple actions:", e); }
  // "Take a dose", one of the farm's own instructions in LSCG's suggestion editor (the farm's trance, part 2, Nov 25)
  if (api.hypno && typeof api.hypno.registerInstruction === "function" && (!caps.size || caps.has("hypno.instructions"))) {
    try {
      api.hypno.registerInstruction({ name: "dose", label: "Take a dose",
        description: "The Farmhand's Dispensary: they take one of its doses (or LSCG's own), as if it was given to them. Only from somebody they'd take a dose from: whoever said the trigger, or whoever planted it.",
        options: [{ type: "text", key: "dose", label: "Which dose", maxLength: 40, description: "Its name, like Moo, Needy Nectar, Heat or Sedative." },
          { type: "select", key: "strength", label: "How strong", choices: [{ value: "whole", label: "A whole dose" }, { value: "half", label: "Half a dose" }, { value: "double", label: "A double dose" }] }],
        perform: (c) => { const r = takeByName(c.options.dose, c.options.strength, c.sender, c.installedBy); if (!r.ok) local("🌀 Somethin' in you reaches for a dose, and doesn't get one: " + (WHY_NOT[r.why] || "it didn't take") + "."); },
      });
    } catch (e) { console.warn("[Dispensary] LSCG wouldn't take the dose instruction:", e); }
  }
  if (caps.has("events")) {
    try { api.events.on("safeword", () => { if (hardOn()) askOut(); else clearAll("safeword"); }); } catch (e) { /* fine */ }
    try {
      api.events.before("drug.beforeApply", (c) => {
        const p = c && c.payload;
        if (!p || !Array.isArray(p.types) || syncing) return;
        for (let i = p.types.length - 1; i >= 0; i--) {
          const m = /^farmhand-dispensary\.([a-z]+)$/.exec(String(p.types[i]));
          if (m && (st().off[m[1]] || (typeof p.sender === "number" && !allowed(p.sender)))) p.types.splice(i, 1);
        }
      });
    } catch (e) { /* fine */ }
  }
}

// a dose by its name, the farm's trance's way (its "dose" instruction, LSCG's or the farm's own triggers): its id, its label
// or one of its words; whole, half or double; only from somebody on their list (whoever said the trigger, or planted it)
const WHY_NOT = { none: "no dose was named", unknown: "the Dispensary has no dose by that name", who: "not from them, they're not on your list", off: "you've got that one switched off", lscg: "LSCG's own wouldn't take", nolscg: "that one needs LSCG" };
export function takeByName(name, strength, by, also) {
  const q = String(name || "").toLowerCase().replace(/[^a-z' -]/g, "").trim();
  if (!q) return { ok: false, why: "none" };
  const ids = Object.keys(BOOK), lab = (k) => String(BOOK[k].label || "").toLowerCase();
  const id = ids.find((k) => k === q.replace(/[\s'-]+/g, "")) || ids.find((k) => lab(k) === q) ||
    ids.find((k) => (BOOK[k].keywords || []).some((w) => String(w).toLowerCase() === q)) || ids.find((k) => lab(k).includes(q));
  if (!id) return { ok: false, why: "unknown" };
  const from = [by, also].map(Number).filter((m) => m > 0), giver = from.find((m) => allowed(m));
  if (!giver) return { ok: false, why: "who" };
  const B = BOOK[id], s = String(strength || "whole");
  if (B.lscg && lscgPresent()) return lscgDose(B.lscg, { by: giver, x: s === "double" ? 2 : s === "half" ? 0.5 : 1 }) ? { ok: true, id } : { ok: false, why: "lscg" };
  return Object.assign({ id }, give(id, { by: giver, x: s === "double" ? 2 : 1, mins: s === "half" ? Math.max(1, Math.round(B.mins / 2)) : undefined }));
}

export function initLscg() {
  const q = (W.LSCG_OnLoad = W.LSCG_OnLoad || []);
  q.push((L) => { try { setUp(L); } catch (e) { console.warn("[Dispensary] LSCG hookup:", e); } });
}
