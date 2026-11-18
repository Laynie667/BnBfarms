/* WHAT'S IN THIS FILE (senses.js)
   POSES AND SENSES (docs/DISPENSARY.md steps 4 and 5; Laynie, Nov 18: "keep going with everything for the dispensary").
     Weak Knees      down on your knees, and you can't get up on your own (somebody can help you up: the game's own
                     "with help")
     Down Girl       down on all fours, and you stay down there the same way
     Blinder Drops   your sight dims, the game's own blindness (a stronger dose, darker: three levels)
     Cotton Ears     muffled, the game's own deafness (a stronger dose, deafer: four levels)
     Tunnel Vision   only a circle in the middle of your screen (screen.js draws it)
     Haze            everything soft and blurry (the game's picture, not the chat)
   All of them lift the moment the dose ends, with your safeword, or with the Purge. The game's own pose rules still
   rule: nothin' here puts you in a pose your gear won't let you take.
*/
import { active, xOfDose } from "./doses.js";

const W = window;
const STANDING = () => (Array.isArray(W.PoseAllStanding) ? W.PoseAllStanding : ["BaseLower", "LegsClosed", "LegsOpen", "Spread"]);
const isMe = (C) => !!(C && typeof C.IsPlayer === "function" && C.IsPlayer());
// the pose the dose puts you in: Weak Knees kneels you, Down Girl puts you on all fours
export function poseNow() { return active("allfours") ? "AllFours" : active("weakknees") ? "Kneel" : null; }
export function settle() {
  const pose = poseNow(); if (!pose || !W.Player) return false;
  try {
    const now = [].concat(W.Player.ActivePose || []);
    if (now.includes(pose)) return false;
    if (typeof W.PoseSetActive === "function") { W.PoseSetActive(W.Player, pose); if (typeof W.ServerSend === "function" && W.CurrentScreen === "ChatRoom" && typeof W.ChatRoomCharacterUpdate === "function") W.ChatRoomCharacterUpdate(W.Player); return true; }
  } catch (e) { /* the game's pose rules said no: fine */ }
  return false;
}
// the haze: the game's picture soft and blurry (not the chat, not the page)
let hazed = false;
export function hazeTick() {
  const want = active("haze") && W.CurrentScreen === "ChatRoom";
  const cv = W.document && W.document.getElementById("MainCanvas");
  if (!cv) return;
  if (want && !hazed) { cv.style.filter = "blur(" + (1 + Math.min(4, xOfDose("haze"))) + "px)"; hazed = true; }
  else if (!want && hazed) { cv.style.filter = ""; hazed = false; }
}
export function initSenses(mod) {
  // can't get up on your own: standing needs somebody's help while Weak Knees or Down Girl is in you
  try {
    mod.hookFunction("PoseCanChangeUnaidedStatus", 4, (args, next) => {
      const r = next(args);
      try {
        const [C, poseName] = args, PCS = W.PoseChangeStatus;
        if (isMe(C) && poseNow() && PCS && STANDING().includes(poseName) && r === PCS.ALWAYS) return PCS.NEVER_WITHOUT_AID;
        if (isMe(C) && active("allfours") && PCS && poseName === "Kneel" && r === PCS.ALWAYS) return PCS.NEVER_WITHOUT_AID;
      } catch (e) { /* fine */ }
      return r;
    });
  } catch (e) { console.warn("[Dispensary] Weak Knees can't hold you down:", e); }
  // blind and deaf: on top of whatever your gear does already
  const wrapPlayer = () => {
    const P = W.Player; if (!P || P.__fdSenses) return !!P;
    const blind = P.GetBlindLevel, deaf = P.GetDeafLevel;
    if (typeof blind === "function") P.GetBlindLevel = function (...a) { const v = blind.apply(this, a); return active("blinder") ? Math.max(v, Math.min(3, xOfDose("blinder"))) : v; };
    if (typeof deaf === "function") P.GetDeafLevel = function (...a) { const v = deaf.apply(this, a); return active("cotton") ? Math.max(v, Math.min(4, 1 + xOfDose("cotton"))) : v; };
    P.__fdSenses = true;
    return true;
  };
  if (!wrapPlayer()) { const t = setInterval(() => { if (wrapPlayer()) clearInterval(t); }, 1000); }
}
