/* WHAT'S IN THIS FILE (hidehyp.js)
   Little Sera's suggestion (Nov 26, passed on by Laynie): "The hypno effects should hide when an accounts profile page,
   or preference windows are open."
   The farm's trance and visor show on the chat room screen only. On a profile, in the preferences (the farm's own
   settings and LSCG's among them), the wardrobe, the room's settings, or any other screen, they step aside, and come back
   the moment you're in the room again: the conditioning haze, the trance look, the pull's nudges, and the visor's dark,
   its afterimage, its spiral over the chat, its 🌀 and the peek window. (A visor's dark no longer covers the left half of
   the preferences screen, so nothin' there is out of reach.) Sound and sessions carry on underneath.
*/
const W = window;
const IDS = ["fhc-trance", "fhc-hyp", "fhc-nudge", "fhc-visor", "fhc-visor-after", "fhc-visor-wm", "fhc-visor-on", "fhc-peek"];
// (before anything's loaded there's no screen yet: nothin' to hide either)
export const offRoom = () => !!(W.CurrentScreen && W.CurrentScreen !== "ChatRoom");
export function hideTick() {
  const d = W.document; if (!d || !d.documentElement) return;
  if (d.head && !d.getElementById("fhc-hide-css")) {
    const s = d.createElement("style"); s.id = "fhc-hide-css";
    s.textContent = IDS.map((i) => "html.fhc-offroom #" + i).join(",") + "{display:none!important}";
    d.head.appendChild(s);
  }
  const off = offRoom();
  if (d.documentElement.classList.contains("fhc-offroom") !== off) d.documentElement.classList.toggle("fhc-offroom", off);
}
export function initHide(mod) {
  hideTick();
  setInterval(hideTick, 500);
  // and the moment the game changes screens
  if (mod) {
    try {
      mod.hookFunction("CommonSetScreen", 0, (args, next) => {
        const r = next(args);
        try { hideTick(); Promise.resolve(r).then(hideTick, hideTick); } catch (e) { /* the half-second check catches it */ }
        return r;
      });
    } catch (e) { /* an older game: the half-second check */ }
  }
}
