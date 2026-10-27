/* WHAT'S IN THIS FILE (look.js)
   Puttin' a change to YOUR look on your character and tellin' the room, for everything the farm changes on you (the
   splatters and the writing, farm gear, your shape, strip and dress, outfits). Oct 27, Laynie: "limit how much has to be
   sent via my connection". Every change used to send your whole character (every item, your profile, your mods' shared
   settings) to everybody in the room, the farm girl's tab too, each time: a trap that cups, plugs and splatters you sent
   it three or four times in a few seconds, and everybody downloaded every one. Now:
   • it's on your own character at once, and saved on your account at once, as before
   • a change to a few spots goes to the room as just those items (the way the game itself sends somebody tyin' you up)
   • a bigger one (an outfit, strip, dress) goes whole, once
   • and changes close together go together, a moment after the last one (never more than 3 seconds late)
*/
const W = window, P = () => W.Player;
const WAIT_MS = 900, MAX_MS = 3000, FEW = 3;
let timer = null, firstAt = 0, groups = new Set(), whole = false;
const SENT = { items: 0, whole: 0, merged: 0 };   // for /farmmem
export const lookSent = () => Object.assign({}, SENT);

const sig = (b) => JSON.stringify([b.Name, b.Color, b.Difficulty, b.Property, b.Craft]);
function changed(before, after) {
  const a = new Map(before.map((b) => [b.Group, sig(b)])), z = new Map(after.map((b) => [b.Group, sig(b)]));
  const out = new Set();
  for (const [g, k] of a) if (z.get(g) !== k) out.add(g);
  for (const g of z.keys()) if (!a.has(g)) out.add(g);
  return out;
}
// next: the whole new look, as the game bundles it (ServerAppearanceBundle)
export function commitLook(next) {
  const C = P();
  const before = W.ServerAppearanceBundle(C.Appearance);
  W.ServerAppearanceLoadFromBundle(C, C.AssetFamily, next, C.MemberNumber);
  if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(C);   // drawn, and saved on your account
  let ch;
  try { ch = changed(before, W.ServerAppearanceBundle(C.Appearance)); } catch (e) { ch = null; }   // (what the game really kept)
  if (ch && !ch.size) return;
  if (!ch) whole = true; else for (const g of ch) groups.add(g);
  if (groups.size > FEW || typeof W.ChatRoomCharacterItemUpdate !== "function" || W.CurrentScreen !== "ChatRoom") whole = true;
  if (whole) { flushLook(); return; }   // a big change goes whole at once, with whatever was waitin'
  if (firstAt) SENT.merged++; else firstAt = Date.now();
  clearTimeout(timer);
  timer = setTimeout(flushLook, Math.max(0, Math.min(WAIT_MS, firstAt + MAX_MS - Date.now())));
}
export function flushLook() {
  clearTimeout(timer); timer = null;
  if (!groups.size && !whole) return;
  const C = P(), list = [...groups], all = whole;
  firstAt = 0; groups = new Set(); whole = false;
  if (!C) return;
  try {
    // only the spots that changed, while you're in the room's own screen (the game's item update only works there)
    if (!all && W.CurrentScreen === "ChatRoom" && typeof W.ChatRoomCharacterItemUpdate === "function") { for (const g of list) W.ChatRoomCharacterItemUpdate(C, g); SENT.items += list.length; return; }
    if (typeof W.ChatRoomCharacterUpdate === "function") { W.ChatRoomCharacterUpdate(C); SENT.whole++; }
  } catch (e) { console.warn("[Farmhand Companion] sending your look:", e); }
}
