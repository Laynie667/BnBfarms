// THE FARMHAND PAGE IN THE GAME'S OWN SETTINGS (Oct 19). Laynie: "we need to consider a actual menu for the add on in the
// extensions folder similar to other add ons to contain settings like enable/disable addon, the full guides, etc, to
// reduce bloat in the add-on panels." So: Preferences → Extensions → Farmhand Companion. It holds the Companion's
// switching on and off, your switches for this panel and the drawn body, the record, your settings file, the memory log
// and the full guides. The panel's Toggles tab keeps the farm's own switches and a button that opens this.
// (The game's PreferenceRegisterExtensionSetting: a page of ours while it's open; the game's Exit leaves it.)
import { h, card, title, muted, btn, toggle } from "./dom.js";
import { panelPrefs, drawnBodyCard } from "./views/livestock.js";
import { guidesTab } from "./views/common.js";
import { memlogText } from "./memlog.js";
import { VERSION } from "./version.js";

const W = window, ID = "FarmhandCompanion";
let panel = null, box = null, tab = "switches";
export const settingsAvailable = () => typeof W.PreferenceRegisterExtensionSetting === "function";

function ctx() {
  const c = panel.ctx();
  return Object.assign({}, c, {
    setPref: (k, v) => { c.setPref(k, v); draw(); },
    setUi: (p, quiet) => { c.setUi(p, true); if (!quiet) draw(); },
    send: (cmd) => { c.send(cmd); setTimeout(draw, 1500); },
    hint: (m) => { c.hint(m); note(m); },
  });
}
function note(m) { const n = box && box.querySelector("#fhc-set-note"); if (n) { n.textContent = m; n.style.display = "block"; } }
const TABS = [
  ["switches", "Switches"],
  ["guides", "Guides"],
  ["files", "Your settings file"],
  ["about", "About"],
];
function body(c) {
  const p = c.prefs, s = c.s || {};
  if (tab === "guides") return guidesTab(c, !!s.staff);
  if (tab === "files") return [card(title("🧠 Memory log"), muted("For chasing a page that runs out of room: how big things were, every half minute, for the last hour. /farmmem in chat shows it too."),
    h("pre", { style: { whiteSpace: "pre-wrap", fontSize: "11px", maxHeight: "300px", overflowY: "auto" } }, memlogText(12) || "Nothing yet."))];
  if (tab === "about") return [card(title("🌾 Farmhand Companion v" + VERSION),
    muted("The B&B Farm's helper: the 🌾 panel, the drawn body, the farm's messes and gear on you, and your switches. It only talks to the farm girl."),
    toggle("Farmhand Companion on", "Switched off, the Companion stays quiet after your next reload: no panel, no drawn body, no messes or farm gear on you, nothing sent to the farm. This page stays, so you can switch it back on.",
      !p.off, () => c.setPref("off", !p.off)),
    p.off ? h("div", { style: { marginTop: "6px" } }, btn("Reload now", () => W.location.reload(), true)) : null)];
  return [drawnBodyCard(c), panelPrefs(c)];
}
function draw() {
  if (!box) return;
  const c = ctx();
  box.replaceChildren(
    h("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" } },
      h("h2", { style: { margin: "0", flex: "1" } }, "🌾 Farmhand Companion"),
      btn("Back", () => { if (typeof W.PreferenceSubscreenExtensionsClear === "function") W.PreferenceSubscreenExtensionsClear(); else close(); }, true)),
    h("nav", { class: "fhc-row" }, TABS.map(([id, label]) => h("button", { type: "button", class: "fhc-pill" + (tab === id ? " on" : ""), onclick: () => { tab = id; draw(); } }, label))),
    h("div", { id: "fhc-set-note", style: { display: "none", margin: "6px 0", color: "#c9a35b" } }),
    h("div", { style: { marginTop: "8px" } }, body(c)));
}
function open() {
  close();
  box = W.document.createElement("div");
  box.id = "fhc-settings";
  box.style.cssText = "position:fixed;left:50%;top:3%;transform:translateX(-50%);width:min(860px,96vw);max-height:94vh;overflow-y:auto;z-index:2147483000;padding:14px 18px;border-radius:10px;box-shadow:0 6px 30px rgba(0,0,0,0.6)";
  W.document.body.appendChild(box);
  draw();
}
function close() { if (box) { box.remove(); box = null; } }

export function initSettings(p) {
  panel = p;
  if (!settingsAvailable()) return false;
  try {
    W.PreferenceRegisterExtensionSetting({
      Identifier: ID, ButtonText: "Farmhand Companion",
      load: () => open(), run: () => {}, click: () => {}, exit: () => { close(); return true; }, unload: () => close(),
    });
    return true;
  } catch (e) { console.warn("[Farmhand Companion] settings page unavailable:", e); return false; }
}
// from the panel: straight to the page (the game opens its settings on the Extensions page, then ours)
export function openSettings(which) {
  if (which) tab = which;
  try { if (typeof W.PreferenceSubscreenExtensionsOpen === "function") { W.PreferenceSubscreenExtensionsOpen(ID); return true; } } catch (e) { /* below */ }
  return false;
}
