/* WHAT'S IN THIS FILE (hardlock.js)
   THE COMPANION IN HARDCORE (Laynie, Nov 17: "hardcore would generally lock their settings how they want currently have
   them, or have them set by someone else that is a keyholder. i think limits are theirs period, but hardcore locks them
   and keeps them from being changed"). Hardcore lives in The Farmhand's Dispensary (it's on your account there); while
   it's on, the Companion's game-rule switches stay as they were when you locked in. Your keyholders can set them, from
   their Dispensary's editor (yours passes their word on: setHardPrefs). Never locked: your privacy choices (the record,
   the relay, private feelings) and what only changes how things look to you (chimes, sounds, compact cards).
   The farm switches the farm girl keeps (breedable, traps, potions...) and your limits are frozen on her side.
*/
const W = window;
// pref → [what the switch says, stored the other way round (a "no…" pref: on when it's false)]
export const HARD_PREFS = {
  gear: ["Farm can put real gear on me", false],
  marks: ["Farm can mark my body", false],
  strip: ["Farm can strip me", false],
  shape: ["Farm can change my body shape", false],
  stir: ["Farm can stir me up", false],
  noFace: ["Farm can set my face", true],
  noLead: ["Lead me instead of teleportin'", true],
  noSlow: ["Carryin' slows me down", true],
  noTrance: ["Trance haze", true],
  brandOff: ["Show my farm brand", true],
  off: ["Farmhand Companion on", true],
};
export function hardNow() {
  try { const D = W.FarmhandDispensary; return D && typeof D.hard === "function" ? D.hard() : null; } catch (e) { return null; }
}
export const prefLocked = (k) => Object.prototype.hasOwnProperty.call(HARD_PREFS, k) && !!hardNow();
export const LOCKED_NOTE = "🔒 Hardcore: that switch stays as it was when you locked in. Your keyholders can change it from their Dispensary.";

// for your Dispensary: the frozen switches as a keyholder sees them, and their word on them
export function hardPrefsOf(prefs) {
  const out = {};
  for (const [k, [label, inv]] of Object.entries(HARD_PREFS)) out[k] = { label, on: inv ? !prefs[k] : !!prefs[k] };
  return out;
}
// returns what changed, in words; set(k, v) stores it (past the lock), after(k) runs a switch's own follow-up
export function setHardPrefsOn(prefs, want, set, after) {
  const said = [];
  for (const [k, on] of Object.entries(want || {})) {
    const def = HARD_PREFS[k]; if (!def || typeof on !== "boolean") continue;
    const [label, inv] = def, now = inv ? !prefs[k] : !!prefs[k];
    if (now === on) continue;
    set(k, inv ? !on : on);
    try { if (after) after(k); } catch (e) { /* fine */ }
    said.push("\"" + label + "\" " + (on ? "on" : "off"));
  }
  return said;
}
