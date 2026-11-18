/* WHAT'S IN THIS FILE (icons.js)
   DOSE ICONS (Laynie's pick, Nov 17; Nov 18 "keep going with everything for the dispensary"): a small row of icons by
   the people in the room who've doses in them, the way the game shows a friend or a lover. Each dose's own icon (💗
   Needy Nectar, 🐂 Rut, 🎈 Fill-Out...), up to five, and 🪱 for a parasite.
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
export function initIcons(mod) {
  try {
    mod.hookFunction("ChatRoomDrawCharacterStatusIcons", 0, (args, next) => {
      const r = next(args);
      try {
        const [C, X, Y, Z] = args;
        if (st().iconsShow === false || !C) return r;
        const t = iconsFor(C.MemberNumber);
        if (t && typeof W.DrawTextFit === "function") W.DrawTextFit(t, X + 250 * Z, Y + 22 * Z, 200 * Z, "White", "Black");
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
