/* WHAT'S IN THIS FILE (toys-list.js)
   THE NIPPLE TOYS (Nov 18; Laynie: "maybe make them plug able with certain toys? like beads, dildos, vibrators, etc?",
   then "I mean art for existing items"): the game's own toys, made to fit an open nipple, in the game's nipple slot. The
   list, and what's in somebody's nipples now. toys.js puts them in the game; the pictures are drawn by
   tools/nipple-toys-art.js and hosted in the repo (toys/v1).
   • Each is the nipple version of one of the game's toys, and whoever owns that toy owns this one.
   • They hold the nipples open while they're in (and so the stretch trains), and they go in only when they're open.
*/
const W = window;
// id: ours · from: the game's toy · label: the wardrobe's name · open: how wide it holds them · states: its pictures'
// states (typed: the beads in; pump: how pumped up) · vibe: the game's remote · lock: takes a lock
export const TOYS = [
  { id: "FarmNipBeadsXL", from: ["ItemButt", "AnalBeads2"], label: "Nipple Beads XL", open: 2, states: "typed" },
  { id: "FarmNipBeads", from: ["ItemButt", "AnalBeads"], label: "Nipple Beads", open: 3 },
  { id: "FarmNipPlug", from: ["ItemButt", "BlackButtPlug"], label: "Black Nipple Plug", open: 3 },
  { id: "FarmNipHeartPlug", from: ["ItemButt", "SuccubusHeartButtPlug"], label: "Succubus Heart Nipple Plug", open: 2 },
  { id: "FarmNipDemonPlug", from: ["ItemButt", "DemonPlug"], label: "Demon Tail Nipple Plug", open: 2 },
  { id: "FarmNipLockPlug", from: ["ItemButt", "ButtPlugLock"], label: "Nipple Plug Lock", open: 3, lock: true },
  { id: "FarmNipPumpPlug", from: ["ItemButt", "InflVibeButtPlug"], label: "Inflatable Vibrating Nipple Plug", open: 2, states: "pump", vibe: "modular" },
  { id: "FarmNipVibePlug", from: ["ItemButt", "VibratingButtplug"], label: "Vibrating Nipple Plug", open: 3, vibe: true },
  { id: "FarmNipEgg", from: ["ItemVulva", "VibratingEgg"], label: "Nipple Vibrating Egg", open: 2, vibe: true },
  { id: "FarmNipWiredEgg", from: ["ItemVulva", "WiredEgg"], label: "Wired Nipple Egg", open: 2, vibe: true },
  { id: "FarmNipBenWa", from: ["ItemVulva", "BenWaBalls"], label: "Nipple Ben Wa Balls", open: 2 },
  { id: "FarmNipDildo", from: ["ItemVulva", "PenisDildo"], label: "Nipple Dildo", open: 3 },
  { id: "FarmNipVibeDildo", from: ["ItemVulva", "VibratingDildo"], label: "Vibrating Nipple Dildo", open: 3, vibe: true },
  { id: "FarmNipPumpDildo", from: ["ItemVulva", "InflatableVibeDildo"], label: "Inflatable Vibrating Nipple Dildo", open: 3, states: "pump", vibe: "modular" },
  { id: "FarmNipSound", from: ["ItemVulvaPiercings", "UrethralSound"], label: "Nipple Sound", open: 1 },
];
export const TOY_BY = Object.fromEntries(TOYS.map((t) => [t.id, t]));
export const SIZES = ["Small", "Normal", "Large", "XLarge", "FlatSmall", "FlatMedium"];
export const STATES = { typed: ["typed0", "typed1", "typed2", "typed3", "typed4"], pump: ["f0", "f1", "f2", "f3", "f4"] };

// the toy in somebody's nipples (the item), or null
export function toyIn(C) {
  const it = C && Array.isArray(C.Appearance) ? C.Appearance.find((i) => i && i.Asset && i.Asset.Group && i.Asset.Group.Name === "ItemNipples") : null;
  return it && TOY_BY[it.Asset.Name] ? it : null;
}
export const toyOf = (it) => (it && it.Asset ? TOY_BY[it.Asset.Name] || null : null);
export const toyLocked = (it) => !!(it && it.Property && it.Property.LockedBy);
// how wide the toy in them holds them: 0 none, 1 to 3 (a pump-up, wider the more it's pumped)
export function toyOpen(C) {
  const it = toyIn(C), T = toyOf(it); if (!T) return 0;
  const f = T.states === "pump" ? Number(it.Property && it.Property.InflateLevel) || 0 : 0;
  return Math.max(1, Math.min(3, T.open + Math.ceil(f / 2)));
}
export const mineToy = () => toyIn(W.Player);
