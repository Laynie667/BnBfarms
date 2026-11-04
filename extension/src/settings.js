// THE FARMHAND PAGE IN THE GAME'S OWN SETTINGS (Oct 19). Laynie: "we need to consider a actual menu for the add on in the
// extensions folder similar to other add ons to contain settings like enable/disable addon, the full guides, etc, to
// reduce bloat in the add-on panels." So: Preferences → Extensions → Farmhand Companion. Since Nov 4 it holds every
// switch, on eight pages with a "Find a setting" box (views/settingspages.js); the panel's ⚙ opens it.
// (The game's PreferenceRegisterExtensionSetting: a page of ours while it's open; the game's Exit leaves it.)
import { h, btn } from "./dom.js";
import { settingsView } from "./views/settingspages.js";

const W = window, ID = "FarmhandCompanion";
let panel = null, box = null, page = "switches";
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
function draw() {
  if (!box) return;
  const c = ctx();
  box.replaceChildren(
    h("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" } },
      h("h2", { style: { margin: "0", flex: "1" } }, "🌾 Farmhand Companion"),
      btn("Back", () => { if (typeof W.PreferenceSubscreenExtensionsClear === "function") W.PreferenceSubscreenExtensionsClear(); else close(); }, true)),
    h("div", { id: "fhc-set-note", style: { display: "none", margin: "6px 0", color: "#c9a35b" } }),
    settingsView(c, page, (p) => { page = p; draw(); }));
}
function open() {
  close();
  box = W.document.createElement("div");
  box.id = "fhc-settings";
  // where it sits is in styles.js (#fhc-settings): a centred card on a wide screen, the whole screen on a phone
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
// from the panel: straight to the page (the game opens its settings on the Extensions page, then ours).
// which: the page to open on (switches, body, gear, messages, privacy, guides, advanced, about)
export function openSettings(which) {
  if (which) page = which === "files" ? "privacy" : which;
  try { if (typeof W.PreferenceSubscreenExtensionsOpen === "function") { W.PreferenceSubscreenExtensionsOpen(ID); return true; } } catch (e) { /* below */ }
  return false;
}
