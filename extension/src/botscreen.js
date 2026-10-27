/* WHAT'S IN THIS FILE (botscreen.js)
   THE FARM GIRL'S OWN SCREEN, KEPT LIGHT (Oct 27). Laynie: "looking for what can be merged into the companion to help with
   lag, and limit how much has to be sent via my connection". The bot's tab on Laynie's PC drew every character in the
   room, over and over: every piece anybody put on or took off (a trap's gear, a mess, an outfit) meant downloading that
   item's pictures and keeping them on the graphics card, for a screen nobody watches. The bot never looks at people,
   it reads what they wear, so on the bot's own account the room isn't drawn at all.
   Preferences → Extensions → Farmhand Companion → "Draw the room on the farm girl's screen" puts the drawing back (for
   somebody sittin' at the bot's keyboard). Outside the room (the wardrobe, a profile) everything draws as normal.
*/
import { BOT_MEMBER } from "./config.js";

const W = window;
let prefs = () => ({});
let skipped = 0, wasRoom = false;
const onBot = () => !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
export const screenLight = () => onBot() && !prefs().drawRoom;
export const screenSkipped = () => skipped;

function redraw(list) {
  for (const C of list) { try { if (C && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } }
}
// switched back on: everybody in the room, drawn again
export function redrawRoom() { redraw([W.Player].concat(W.ChatRoomCharacter || [])); }

export function initBotScreen(mod, getPrefs) {
  prefs = getPrefs;
  try {
    // ahead of every other drawing step (the drawn body is 2, the messes 3): on the bot's screen in the room, nothing
    mod.hookFunction("CommonDrawAppearanceBuild", 20, (args, next) => {
      if (W.CurrentScreen === "ChatRoom" && screenLight()) { skipped++; return undefined; }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] light bot screen unavailable:", e); return; }
  // out of the room (the wardrobe, somebody's profile): the bot herself, and whoever's being looked at, drawn for real
  setInterval(() => {
    const inRoom = W.CurrentScreen === "ChatRoom";
    if (wasRoom && !inRoom && screenLight()) redraw([W.Player, W.InformationSheetSelection].filter(Boolean));
    wasRoom = inRoom;
  }, 1000);
}
