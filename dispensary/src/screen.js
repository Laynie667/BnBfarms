/* WHAT'S IN THIS FILE (screen.js)
   SCREEN TOUCHES: a dose you can see at the edges of your own screen (only you see them). A switch on the page turns
   them off, and with "reduce motion" set on your computer they hold still instead of breathin'.
     the Sedative     the screen dims at the edges and lifts again, like eyelids that won't stay up
     Denial Serum     a slow pink pulse at the edges once you're close to the top
     Heat             a warm haze
     Needy Nectar     a pink flush (LSCG draws its own when it's loaded)
     Rut              a hungry red at the edges
     Airhead Elixir   a soft, bubbly pink haze
*/
import { st } from "./store.js";
import { active } from "./doses.js";

const W = window;
let el = null, styled = false;
const CSS = `
#fd-screen{position:fixed;inset:0;pointer-events:none;z-index:2147482000;transition:opacity 1.5s ease}
#fd-screen.breathe{animation:fd-breathe 7s ease-in-out infinite}
#fd-screen.pulse{animation:fd-pulse 2.4s ease-in-out infinite}
@keyframes fd-breathe{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes fd-pulse{0%,100%{opacity:.25}50%{opacity:.9}}
@media (prefers-reduced-motion: reduce){#fd-screen.breathe,#fd-screen.pulse{animation:none;opacity:.6}}
`;
function ensure() {
  if (!styled) { const s = W.document.createElement("style"); s.textContent = CSS; W.document.head.appendChild(s); styled = true; }
  if (!el) { el = W.document.createElement("div"); el.id = "fd-screen"; el.setAttribute("aria-hidden", "true"); W.document.body.appendChild(el); }
  return el;
}
const arousal = () => { const A = W.Player && W.Player.ArousalSettings; return A ? Number(A.Progress) || 0 : 0; };
// which touch shows now (the strongest wins), or none
export function screenNow() {
  if (st().screen === false || W.CurrentScreen !== "ChatRoom") return null;
  if (active("denial") && arousal() >= 85) return { bg: "radial-gradient(ellipse at center, transparent 55%, rgba(220,60,130,.55) 100%)", cls: "pulse", id: "denial" };
  if (active("sedative")) return { bg: "radial-gradient(ellipse at center, transparent 35%, rgba(10,10,20,.75) 100%)", cls: "breathe", id: "sedative" };
  if (active("rut")) return { bg: "radial-gradient(ellipse at center, transparent 45%, rgba(170,40,20,.42) 100%)", cls: "breathe", id: "rut" };
  if (active("airhead")) return { bg: "radial-gradient(ellipse at center, rgba(255,200,235,.10) 25%, rgba(255,150,210,.38) 100%)", cls: "breathe", id: "airhead" };
  if (active("heat")) return { bg: "radial-gradient(ellipse at center, rgba(255,140,60,.06) 30%, rgba(255,110,40,.35) 100%)", cls: "breathe", id: "heat" };
  if (active("needy")) return { bg: "radial-gradient(ellipse at center, rgba(255,120,170,.05) 40%, rgba(255,90,150,.3) 100%)", cls: "breathe", id: "needy" };
  return null;
}
export function screenTick() {
  const s = screenNow();
  if (!s) { if (el) { el.remove(); el = null; } return null; }
  const e = ensure();
  if (e.dataset.id !== s.id) { e.dataset.id = s.id; e.style.background = s.bg; e.className = s.cls; }
  return s.id;
}
