/* WHAT'S IN THIS FILE (say.js)
   How the Dispensary talks. A local note only you see, and a line to the room sent from your OWN game (the way LSCG's
   drugs do it), so the farm girl doesn't have to narrate every dose through her one busy line (Laynie, Nov 17:
   "anything to make the farmgirls load a little lighter").
*/
const W = window;
export const inRoom = () => W.CurrentScreen === "ChatRoom" && typeof W.ServerSend === "function";
export const myName = () => { const P = W.Player || {}; return String(P.Nickname || P.Name || "Somebody"); };
export function nameOf(mn) {
  const C = (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
  return C ? String(C.Nickname || C.Name || "somebody") : "somebody";
}
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const fill = (t, v) => String(t).replace(/%t/g, myName()).replace(/%b/g, (v && v.by) || "somebody").replace(/%d/g, (v && v.dose) || "a dose");

// only you see it: text always goes in as text
export function local(text, color) {
  try {
    if (typeof W.ChatRoomSendLocal !== "function" || W.CurrentScreen !== "ChatRoom") return false;
    const d = W.document.createElement("div");
    d.style.cssText = "color:" + (color || "#c79bd8") + ";white-space:pre-wrap";
    d.textContent = "💉 " + text;
    W.ChatRoomSendLocal(d.outerHTML);
    return true;
  } catch (e) { return false; }
}

// the room sees it, as narration (no name in front)
export function action(text) {
  if (!inRoom() || !text) return false;
  const msg = String(text).slice(0, 900);
  try {
    W.ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [
      { Tag: "Beep", Text: "msg" }, { Tag: "发送私聊", Text: "msg" }, { Tag: "Biep", Text: "msg" }, { Tag: "Sonner", Text: "msg" },
      { Tag: "msg", Text: msg },
    ] });
    return true;
  } catch (e) { return false; }
}
