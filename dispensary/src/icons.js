/* WHAT'S IN THIS FILE (icons.js)
   DOSE ICONS (Laynie's pick, Nov 17; Nov 18 "keep going with everything for the dispensary"): a small row of icons by
   the people in the room who've doses in them, the way the game shows a friend or a lover. Each dose's own icon (💗
   Needy Nectar, 🐂 Rut, 🎈 Fill-Out...), and 🪱 for a parasite: the game's icon size, three at most, then "+n", and
   every one by name when you hover them.
   • Your Dispensary tells the room what's in you (a small hidden message), and everybody else's Dispensary draws it by
     you; theirs come to you the same way. Only Dispensary users see them.
   • Two switches on the page, both yours: show the icons, and let others see yours. Both on to start.
*/
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { st } from "./store.js";
import { BOOK, doseIds, active } from "./doses.js";

const W = window, others = new Map();   // member → { ids, para, at }
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const inRoom = () => W.CurrentScreen === "ChatRoom" && typeof W.ServerSend === "function";
const mineNow = () => ({ ids: doseIds().filter(active).slice(0, 8), para: Object.keys(st().para || {}).length > 0 });
let lastSig = "", lastAt = 0;
// tell the room (when it changes, at most every few seconds; and when somebody asks)
export function iconsTell(force) {
  if (!inRoom()) return false;
  const S = st(), m = S.iconsShare === false ? { ids: [], para: false } : mineNow(), sig = JSON.stringify(m);
  if (!force && (sig === lastSig || Date.now() - lastAt < 4000)) return false;
  lastSig = sig; lastAt = Date.now();
  try { W.ServerSend("ChatRoomChat", makeMsg("dispIcons", m)); return true; } catch (e) { return false; }
}
function onIcons(from, m) {
  const ids = Array.isArray(m.ids) ? m.ids.filter((id) => typeof id === "string" && BOOK[id]).slice(0, 8) : [];
  const was = iconsDosed(from);
  if (!ids.length && !m.para) others.delete(from); else others.set(from, { ids, para: !!m.para, at: Date.now() });
  // dosed or not changed: their glow ink lights up or goes dark (shared/ink/ink.js listens)
  if (was !== iconsDosed(from)) { try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail: { type: "icons", from } })); } catch (e) { /* fine */ } }
}
// is anythin' in them right now (yours from your own doses; anybody else's from their icons)
export function iconsDosed(mn) { const e = mn === me() ? mineNow() : others.get(mn); return !!(e && e.ids.length); }
export function iconsFor(mn) {
  const e = mn === me() ? mineNow() : others.get(mn);
  if (!e) return "";
  return e.ids.slice(0, 5).map((id) => BOOK[id].icon).join("") + (e.para ? "🪱" : "");
}
// DRAWN SMALL (Nov 18, Laynie: "they are just big"): the size of the game's own icons (40 at the room's zoom; on the map,
// where they show by the name of whoever you hover, that's half), in the game's free spots on that top row. Three at
// most, then "+n"; hover them for the doses by name.
/* global MainCanvas, CommonGetFont */
const canvas = () => (typeof MainCanvas !== "undefined" && MainCanvas) || W.MainCanvas || null;
const fontOf = (px) => { try { if (typeof CommonGetFont === "function") return CommonGetFont(px); } catch (e) { /* fine */ } return px + "px Arial"; };
export function iconsItems(mn) {
  const e = mn === me() ? mineNow() : others.get(mn);
  if (!e) return [];
  return e.ids.filter((id) => BOOK[id]).map((id) => ({ icon: BOOK[id].icon, label: BOOK[id].label })).concat(e.para ? [{ icon: "🪱", label: "A parasite" }] : []);
}
export function drawIcons(C, X, Y, Z) {
  const items = iconsItems(C.MemberNumber), M = canvas(); if (!items.length || !M) return 0;
  const shown = items.length > 3 ? items.slice(0, 2).concat({ icon: "+" + (items.length - 2) }) : items;
  const s = 40 * Z, x0 = X + 190 * Z;   // (the game's own: 70 to 150, then 310 on; 190 to 300 is free)
  M.save();
  try {
    M.textAlign = "center"; M.textBaseline = "middle"; M.font = fontOf(Math.max(8, Math.round(30 * Z)));
    M.lineWidth = Math.max(1, 3 * Z); M.strokeStyle = "black"; M.fillStyle = "white";
    shown.forEach((it, i) => { const x = x0 + s * i + s / 2, y = Y + s / 2; if (it.icon[0] === "+") M.strokeText(it.icon, x, y); M.fillText(it.icon, x, y); });
    // hover: what's in them, by name
    if (typeof W.MouseIn === "function" && W.MouseIn(x0, Y, s * shown.length, s)) {
      const px = 22, lh = px + 8; M.font = fontOf(px); M.textAlign = "left";
      const lines = items.map((it) => it.icon + " " + it.label), w = Math.max(...lines.map((l) => M.measureText(l).width)) + 20, h = lines.length * lh + 10;
      const bx = Math.max(4, Math.min(x0, 2000 - w - 4)), by = Y + s + 4;
      M.fillStyle = "rgba(20,14,24,0.88)"; M.fillRect(bx, by, w, h); M.strokeStyle = "rgba(255,255,255,0.35)"; M.lineWidth = 1; M.strokeRect(bx, by, w, h);
      M.fillStyle = "white"; lines.forEach((l, i) => M.fillText(l, bx + 10, by + 5 + lh * i + lh / 2));
    }
  } finally { M.restore(); }
  return shown.length;
}
export function initIcons(mod) {
  try {
    mod.hookFunction("ChatRoomDrawCharacterStatusIcons", 0, (args, next) => {
      const r = next(args);
      try {
        const [C, X, Y, Z] = args;
        if (st().iconsShow === false || !C) return r;
        drawIcons(C, X, Y, Z || 1);
      } catch (e) { /* fine */ }
      return r;
    });
  } catch (e) { console.warn("[Dispensary] dose icons can't be drawn:", e); }
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try {
        const data = args[0];
        if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me()) {
          const m = readMsg(data);
          if (m && m.type === "dispIcons") onIcons(data.Sender, m);
          else if (m && m.type === "dispIconsAsk") iconsTell(true);
        }
      } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { /* fine */ }
  // walkin' into a room: say what's in you, and ask what's in them
  try { mod.hookFunction("ChatRoomSync", 3, (args, next) => { const r = next(args); others.clear(); setTimeout(() => { iconsTell(true); try { W.ServerSend("ChatRoomChat", makeMsg("dispIconsAsk", {})); } catch (e) { /* fine */ } }, 3000); return r; }); } catch (e) { /* fine */ }
}
export const iconsReset = () => { others.clear(); lastSig = ""; lastAt = 0; };
