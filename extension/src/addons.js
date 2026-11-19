/* WHAT'S IN THIS FILE (addons.js)
   Checks on other addons from your page: which BC+ you run, and whether BCX's Ready to be summoned
   lets the bot pull you.
*/
// What other addons this player is running, read straight from the page.
import { BCPLUS_VERSION } from "../../shared/bcplus.js";

// BC+ puts { version: { major, minor, patch }, loaded } on window.BCPlus
export function bcplusStatus() {
  const b = window.BCPlus;
  if (!b || !b.loaded) return { has: false, text: "not loaded" };
  const v = b.version || {};
  const ver = [v.major, v.minor, v.patch].join(".");
  return { has: true, ver, match: ver === BCPLUS_VERSION, text: ver === BCPLUS_VERSION ? "BC+ " + ver + " matches the farm" : "BC+ " + ver + " (the farm knows " + BCPLUS_VERSION + ")" };
}

// OPEN BC+ (Nov 19; Laynie: "can we add a button to the companion that opens bc plus? the recent bc plus update made it
// impossible to use the standard button"). BC+ has no call for it on window, but its own chat command "/bcp menu" opens
// your BC+ window (BC+ 0.14, src/modules/TextCommands.ts), so the Companion runs that: the command's own Action
// straight from the game's command list, or the game's command runner if that's all there is. BC+ keeps its own rules:
// in its hardcore your hands are bound, and it says so itself.
function bcpCommand() {
  try {
    /* global Commands */
    const list = Array.isArray(window.Commands) ? window.Commands : typeof Commands !== "undefined" && Array.isArray(Commands) ? Commands : [];
    return list.find((c) => c && String(c.Tag).toLowerCase() === "bcp") || null;
  } catch (e) { return null; }
}
export const bcplusCanOpen = () => !!(window.BCPlus && window.BCPlus.loaded) && bcpCommand() != null;
export function openBcplus() {
  const c = bcpCommand();
  try { if (c && typeof c.Action === "function") { c.Action.call(c, "menu", "/bcp menu", ["menu"]); return true; } } catch (e) { console.warn("[Farmhand Companion] BC+ wouldn't open:", e); }
  try { if (typeof window.CommandExecute === "function") { window.CommandExecute("/bcp menu"); return true; } } catch (e) { console.warn("[Farmhand Companion] BC+ wouldn't open:", e); }
  return false;
}

// is BCX's "Ready to be summoned" on, with the farm bot allowed? (null when BCX isn't there)
export function summonReady(bot) {
  try {
    const api = window.bcx && window.bcx.getModApi && window.bcx.getModApi("FarmhandCompanion");
    if (!api) return null;
    const r = api.getRuleState("alt_forced_summoning");
    if (!r || !r.inEffect) return { ok: false, why: "BCX's Ready to be summoned rule is off" };
    const allowed = (r.customData && r.customData.allowedMembers) || [];
    return allowed.includes(bot) ? { ok: true, why: "ready" } : { ok: false, why: "the farm bot (" + bot + ") isn't on the rule's allowed list" };
  } catch (e) { return null; }
}
