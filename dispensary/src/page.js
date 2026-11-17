/* WHAT'S IN THIS FILE (page.js)
   THE DISPENSARY'S PAGE: Preferences → Extensions → The Farmhand's Dispensary (/dispensary opens it too).
   What's in you now, the safeword, who can dose you, the clock, and each dose's own switch.
*/
import { h } from "../../extension/src/dom.js";
import { LADDER } from "./config.js";
import { VERSION } from "./version.js";
import { st, save } from "./store.js";
import { BOOK, doseIds, active, leftMs, setClock } from "./doses.js";
import { ladderWho } from "./ladder.js";
import { lscgPresent, lscgApi } from "./lscg.js";
import { safeword } from "./safeword.js";

const W = window, ID = "FarmhandDispensary";
let box = null, note = "";

const CSS = `
#fd-page{position:fixed;left:50%;top:3%;transform:translateX(-50%);width:min(760px,96vw);max-height:94vh;max-height:94dvh;overflow-y:auto;overflow-x:hidden;
  -webkit-overflow-scrolling:touch;z-index:2147483000;padding:14px 18px;box-sizing:border-box;background:#211a24;color:#ecdfe8;border:2px solid #b78ac8;
  border-radius:12px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 6px 30px #000a}
@media (max-width:700px),(pointer:coarse) and (max-width:1000px){#fd-page{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;max-height:none;border-radius:0;border-width:0;padding:10px 12px}}
#fd-page h2{margin:0;flex:1;font-family:Bitter,Georgia,serif;color:#d9b3e6}
#fd-page h3{margin:16px 0 6px;font-size:15px;color:#d9b3e6}
#fd-page .fd-card{background:#2b2230;border:1px solid #4a3a52;border-radius:8px;padding:10px 12px;margin:6px 0}
#fd-page .fd-muted{color:#b3a2b8;font-size:12.5px}
#fd-page .fd-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#fd-page button{font:inherit;cursor:pointer;border-radius:7px;border:1px solid #8e6aa0;background:#3a2c42;color:#ecdfe8;padding:5px 12px;min-height:32px}
#fd-page button.fd-safe{background:#6e2330;border-color:#c06070;font-weight:700}
#fd-page select{font:inherit;max-width:100%;padding:4px 6px;border-radius:6px;background:#1b151e;color:#ecdfe8;border:1px solid #6e5a78}
#fd-page label{display:flex;align-items:center;gap:8px;cursor:pointer}
#fd-page .fd-note{color:#e6c37a;margin:6px 0}
@media (pointer:coarse){#fd-page select,#fd-page input{font-size:16px}#fd-page button{min-height:40px}}
`;
function styles() {
  if (W.document.getElementById("fd-style")) return;
  const s = W.document.createElement("style"); s.id = "fd-style"; s.textContent = CSS; W.document.head.appendChild(s);
}

const clockTip = (mode) => {
  const p = st().penalty;
  return mode === "real"
    ? "Real time: your timers keep running while you're logged off. To make up for it, every timer runs " + p + "% longer, so a 2-hour dose lasts " + (2 * (1 + p / 100)).toFixed(1).replace(/\.0$/, "") + " hours."
    : "While online: your timers only count down while you're logged in. A 2-hour dose is 2 hours of you being here.";
};
export function timeLeft(ms) {
  const m = Math.ceil(ms / 60000);
  return m >= 120 ? Math.floor(m / 60) + " h " + (m % 60 ? (m % 60) + " min" : "") : m >= 60 ? "1 h " + (m - 60 ? (m - 60) + " min" : "") : m + " min";
}

function view() {
  const S = st(), now = doseIds().filter(active);
  const kids = [];
  kids.push(h("div", { class: "fd-row", style: { marginBottom: "6px" } },
    h("h2", null, "💉 The Farmhand's Dispensary"),
    h("button", { onclick: () => { if (typeof W.PreferenceSubscreenExtensionsClear === "function") W.PreferenceSubscreenExtensionsClear(); else close(); } }, "Back")));
  if (note) kids.push(h("div", { class: "fd-note" }, note));

  // in you now, and the way out
  kids.push(h("h3", null, "In you now"));
  kids.push(h("div", { class: "fd-card" },
    now.length ? now.map((id) => h("div", null, BOOK[id].icon + " " + BOOK[id].label + (st().doses[id].x > 1 ? " ×" + st().doses[id].x : "") + ": " + timeLeft(leftMs(id)) + " left" + (S.clock === "online" ? " of your time here" : ""))) : h("div", { class: "fd-muted" }, "Nothin'. You're clear."),
    h("div", { class: "fd-row", style: { marginTop: "8px" } },
      h("button", { class: "fd-safe", onclick: () => { safeword("page"); note = "Safeword: every dose lifted."; draw(); } }, "🔴 Safeword: lift every dose"),
      h("span", { class: "fd-muted" }, "Always works. The game's own safeword does it too, and so does /dispensary safeword."))));

  // who can dose you
  kids.push(h("h3", null, "Who can dose you"));
  const sel = h("select", { "aria-label": "Who can dose you", onchange: (e) => { st().who = e.target.value; save(); note = ""; draw(); } },
    LADDER.map((r) => h("option", { value: r.id, selected: r.id === S.who ? true : undefined }, r.label)));
  kids.push(h("div", { class: "fd-card" }, sel, h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Right now: " + ladderWho() + ". You can always dose yourself.")));

  // the clock
  kids.push(h("h3", null, "The clock"));
  const radio = (mode, label) => h("label", { title: clockTip(mode) },
    h("input", { type: "radio", name: "fd-clock", checked: S.clock === mode ? true : undefined, onchange: () => { setClock(mode); draw(); } }), label);
  kids.push(h("div", { class: "fd-card" },
    h("div", { class: "fd-row", style: { gap: "18px" } }, radio("online", "While online"), radio("real", "Real time (+" + S.penalty + "%)")),
    h("div", { class: "fd-muted", style: { marginTop: "4px" } }, clockTip(S.clock))));

  // the doses
  kids.push(h("h3", null, "Doses"));
  const lscg = lscgPresent();
  for (const id of doseIds()) {
    const B = BOOK[id], theirs = B.lscg && lscg;
    kids.push(h("div", { class: "fd-card" },
      h("label", null,
        h("input", { type: "checkbox", checked: !S.off[id] ? true : undefined, disabled: theirs ? true : undefined,
          onchange: (e) => { if (e.target.checked) delete st().off[id]; else st().off[id] = true; save(); draw(); } }),
        h("b", null, B.icon + " " + B.label)),
      h("div", { class: "fd-muted" }, B.desc),
      h("div", { class: "fd-muted" }, "Words on a crafted item: " + B.keywords.join(", ") + ". Add x2 to x5 for a stronger dose."),
      theirs ? h("div", { class: "fd-note" }, "LSCG is loaded, so this one is LSCG's own sedative: LSCG's settings decide.") : null));
  }
  if (lscg) {
    kids.push(h("div", { class: "fd-card fd-muted" }, lscgApi()
      ? "LSCG is loaded. Its sedative, aphrodisiac, mind control and antidote are LSCG's. Our doses are in LSCG's Drug Enhancements list too: switch them on there as well to see a bar with the time left."
      : "LSCG is loaded. Its sedative, aphrodisiac, mind control and antidote are LSCG's."));
  }
  kids.push(h("div", { class: "fd-muted", style: { marginTop: "14px" } }, "The Farmhand's Dispensary v" + VERSION + " · B&B Farm. On the farm, the farm girl keeps the farm's books and your Dispensary does the rest."));
  return kids;
}
function draw() { if (box) box.replaceChildren(...view()); }
export function open() { close(); styles(); box = W.document.createElement("div"); box.id = "fd-page"; W.document.body.appendChild(box); draw(); }
export function close() { if (box) { box.remove(); box = null; } note = ""; }
export const pageOpen = () => !!box;
export function redrawPage() { draw(); }

export function initPage() {
  if (typeof W.PreferenceRegisterExtensionSetting !== "function") return false;
  try {
    W.PreferenceRegisterExtensionSetting({
      Identifier: ID, ButtonText: "The Farmhand's Dispensary",
      load: () => open(), run: () => {}, click: () => {}, exit: () => { close(); return true; }, unload: () => close(),
    });
    return true;
  } catch (e) { console.warn("[Dispensary] its page couldn't go in the game's Extensions:", e); return false; }
}
export function openPage() {
  try { if (typeof W.PreferenceSubscreenExtensionsOpen === "function") { W.PreferenceSubscreenExtensionsOpen(ID); return true; } } catch (e) { /* below */ }
  open();
  return true;
}
