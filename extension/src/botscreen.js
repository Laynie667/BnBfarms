/* WHAT'S IN THIS FILE (botscreen.js)
   THE FARM GIRL'S OWN SCREEN, KEPT LIGHT (Oct 27). Laynie: "looking for what can be merged into the companion to help with
   lag, and limit how much has to be sent via my connection". The bot's tab on Laynie's PC drew every character in the
   room, over and over: every piece anybody put on or took off (a trap's gear, a mess, an outfit) meant downloading that
   item's pictures and keeping them on the graphics card, for a screen nobody watches. The bot never looks at people,
   it reads what they wear, so on the bot's own account the room isn't drawn at all.
   Preferences → Extensions → Farmhand Companion → "Draw the room on the farm girl's screen" puts the drawing back (for
   somebody sittin' at the bot's keyboard). Outside the room (the wardrobe, a profile) everything draws as normal.

   THE SCREEN NAP (Nov 7). The game's newest version (R133) does a good bit of extra work for every picture it puts on
   screen, every frame: the map's floor, walls and furniture, ten times a second, all day, on a tab nobody's watching.
   Laynie's recordings of the bot's tab showed that drawing as its biggest job (the farm itself under 1%), and the page
   kept filling up and dying. So after NAP_MS with nobody touching the bot's tab, the map isn't drawn at all, just a
   plain "nappin'" card. Any mouse move, click, wheel or key over the page wakes it at once. The bot hears, answers,
   milks and moves the same either way: drawing is only for somebody looking. Advanced → "Let the farm girl's screen nap"
   switches it off.
*/
import { BOT_MEMBER } from "./config.js";

const W = window;
export const NAP_MS = 2 * 60000;
let prefs = () => ({});
let skipped = 0, wasRoom = false, lastTouch = Date.now(), naps = 0, wasNapping = false;
const onBot = () => !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
export const screenLight = () => onBot() && !prefs().drawRoom;
export const screenSkipped = () => skipped;
// the bot's own account, nap switched on (the default)
export const screenNapOn = () => onBot() && !prefs().noNap;
// is the bot's map asleep right now (only ever on the bot's own account, only in the room)
export const screenNapping = () => screenNapOn() && W.CurrentScreen === "ChatRoom" && Date.now() - lastTouch > NAP_MS;
export const screenNaps = () => naps;

function redraw(list) {
  for (const C of list) { try { if (C && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } }
}
// switched back on: everybody in the room, drawn again
export function redrawRoom() { redraw([W.Player].concat(W.ChatRoomCharacter || [])); }

function napCard() {
  try {
    if (typeof W.DrawRect === "function") W.DrawRect(0, 0, 1000, 1000, "#1d1712");
    if (typeof W.DrawText === "function") {
      W.DrawText("The farm girl's screen is nappin'.", 500, 470, "#e8d9bd", "black");
      W.DrawText("The farm runs the same. Move the mouse to wake it.", 500, 530, "#a8977a", "black");
    }
  } catch (e) { /* fine */ }
}

export function initBotScreen(mod, getPrefs) {
  prefs = getPrefs;
  // anybody at the bot's keyboard: the screen's awake
  const touch = () => { lastTouch = Date.now(); };
  for (const ev of ["mousemove", "mousedown", "wheel", "keydown", "touchstart", "pointerdown"]) {
    try { W.document.addEventListener(ev, touch, { capture: true, passive: true }); } catch (e) { /* fine */ }
  }
  try {
    // ahead of every other drawing step (the drawn body is 2, the messes 3): on the bot's screen in the room, nothing
    mod.hookFunction("CommonDrawAppearanceBuild", 20, (args, next) => {
      if (W.CurrentScreen === "ChatRoom" && screenLight()) { skipped++; return undefined; }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] light bot screen unavailable:", e); }
  try {
    // the map itself (floor, walls, furniture, and everybody on it): asleep, a plain card instead
    mod.hookFunction("ChatRoomMapViewDrawGrid", 20, (args, next) => {
      if (screenNapping()) { if (!wasNapping) { wasNapping = true; naps++; } napCard(); return undefined; }
      wasNapping = false;
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] screen nap unavailable:", e); }
  // out of the room (the wardrobe, somebody's profile): the bot herself, and whoever's being looked at, drawn for real
  setInterval(() => {
    const inRoom = W.CurrentScreen === "ChatRoom";
    if (wasRoom && !inRoom && screenLight()) redraw([W.Player, W.InformationSheetSelection].filter(Boolean));
    wasRoom = inRoom;
  }, 1000);
}
