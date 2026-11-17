/* WHAT'S IN THIS FILE (safeword.js)
   THE WAY OUT. /dispensary safeword, the button on the Dispensary's page, the game's own
   safeword (revert or release), and LSCG's safeword: every dose in you is lifted at once, and if the farm girl's here
   she lifts the farm's side of them too. In HARDCORE (which only you switch on, for yourself) it asks your keyholders
   to let you out instead (hardcore.js).
*/
import { clearAll } from "./doses.js";
import { tellSafeword } from "./farm.js";
import { local } from "./say.js";
import { NOTES } from "./lines.js";
import { hardOn, askOut } from "./hardcore.js";

export function safeword(from) {
  if (hardOn()) { askOut(); return 0; }   // hardcore: your keyholders, your end date, or 30 days without a check-in
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
