/* WHAT'S IN THIS FILE (safeword.js)
   THE WAY OUT, which nothing ever locks. /dispensary safeword, the button on the Dispensary's page, the game's own
   safeword (revert or release), and LSCG's safeword: every dose in you is lifted at once, and if the farm girl's here
   she lifts the farm's side of them too. Hardcore (step 2) locks your settings, never this.
*/
import { clearAll } from "./doses.js";
import { tellSafeword } from "./farm.js";
import { local } from "./say.js";
import { NOTES } from "./lines.js";

export function safeword(from) {
  const n = clearAll("safeword");
  tellSafeword();
  local(NOTES.safeword, "#e0a0a0");
  return n;
}

export function initSafeword(mod) {
  for (const f of ["ChatRoomSafewordRevert", "ChatRoomSafewordRelease"]) {
    try { mod.hookFunction(f, 0, (args, next) => { const r = next(args); try { safeword("game"); } catch (e) { /* fine */ } return r; }); } catch (e) { /* an older game */ }
  }
}
