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
