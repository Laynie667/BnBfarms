/* WHAT'S IN THIS FILE (shared/ink/panel.js)
   THE INK PANEL (/ink): your four ink slots and your brand, and for each:
   • SIZE (Laynie, Nov 18: tattoos need "better sizing options"): how big, from a quarter to four times, and its width and
     height on their own. It goes on the item (Property.FarmInk: sz, sw, sh), so everybody with an add-on sees it the same.
     The game's Layering screen still moves, turns and layers it, and its own scale works on top of this.
   • WHAT IT SAYS, for a live design: your words, a name, a number, and whether it follows the farm's count.
   Colours are the wardrobe's own colour picker: every design has a layer per colour (Nov 18, "recolorable").
*/
const CSS = `
#fi-panel{position:fixed;left:50%;top:4%;transform:translateX(-50%);width:min(620px,96vw);max-height:92vh;max-height:92dvh;overflow-y:auto;z-index:2147483000;
  padding:12px 16px;box-sizing:border-box;background:#211a24;color:#ecdfe8;border:2px solid #b78ac8;border-radius:12px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 6px 30px #000a}
@media (max-width:700px),(pointer:coarse) and (max-width:1000px){#fi-panel{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;max-height:none;border-radius:0;border-width:0;padding:10px 12px}}
#fi-panel h2{margin:0;flex:1;font-family:Bitter,Georgia,serif;color:#d9b3e6;font-size:19px}
#fi-panel .fi-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#fi-panel .fi-card{background:#2b2230;border:1px solid #4a3a52;border-radius:8px;padding:9px 11px;margin:7px 0}
#fi-panel .fi-muted{color:#b3a2b8;font-size:12.5px}
#fi-panel label.fi-slide{display:grid;grid-template-columns:4.2em 1fr 3.4em;align-items:center;gap:8px;margin:3px 0}
#fi-panel input[type=range]{width:100%}
#fi-panel input[type=text],#fi-panel input[type=number]{font:inherit;padding:4px 6px;border-radius:6px;background:#1b151e;color:#ecdfe8;border:1px solid #6e5a78;min-width:0;flex:1}
#fi-panel button{font:inherit;cursor:pointer;border-radius:7px;border:1px solid #8e6aa0;background:#3a2c42;color:#ecdfe8;padding:4px 11px;min-height:30px}
@media (pointer:coarse){#fi-panel input{font-size:16px}#fi-panel button{min-height:40px}}
`;
const SLOTS = [["FarmInk1", "Ink 1"], ["FarmInk2", "Ink 2"], ["FarmInk3", "Ink 3"], ["FarmInk4", "Ink 4"], ["FarmBrand", "Brand"]];
let box = null, api = null, Wd = null, note = "";
const el = (tag, attrs, ...kids) => {
  const e = Wd.document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) { if (v == null || v === false) continue; if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else if (k === "style") e.style.cssText = v; else e.setAttribute(k, v === true ? "" : String(v)); }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(typeof k === "string" ? Wd.document.createTextNode(k) : k);
  return e;
};
const pct = (v) => Math.round((Number(v) || 1) * 100);
// a slider: shows as you drag, written on when you let go
function slide(label, min, max, val, onSet) {
  const out = el("span", { class: "fi-muted" }, val + "%");
  const r = el("input", { type: "range", min, max, step: 5, value: val, "aria-label": label, oninput: (e) => { out.textContent = e.target.value + "%"; }, onchange: (e) => onSet(Number(e.target.value) / 100) });
  return el("label", { class: "fi-slide" }, el("span", null, label), r, out);
}
function slotCard(slot, name) {
  const w = api.worn().find((x) => x.slot === slot);
  if (!w) return el("div", { class: "fi-card" }, el("b", null, name + ": "), el("span", { class: "fi-muted" }, "empty. Pick a design in the wardrobe (Farm " + name + ")."));
  const own = w.values || {}, kids = [el("div", { class: "fi-row" }, el("b", null, name + ": " + w.title))];
  kids.push(slide("Size", 25, 400, pct(own.sz), (v) => set(slot, { sz: v === 1 ? null : v })));
  kids.push(slide("Width", 50, 200, pct(own.sw), (v) => set(slot, { sw: v === 1 ? null : v })));
  kids.push(slide("Height", 50, 200, pct(own.sh), (v) => set(slot, { sh: v === 1 ? null : v })));
  if (w.live) {
    const f = w.fields || [];
    if (f.includes("t") || f.includes("list") || f.includes("num") || f.includes("n")) {
      const cur = f.includes("t") ? own.t || "" : f.includes("list") ? (own.list || []).join(", ") : f.includes("num") ? (own.num != null ? String(own.num) : "") : own.n != null ? String(own.n) : "";
      const hint = f.includes("t") ? "Your words, or a name" : f.includes("list") ? "Names, with commas between" : f.includes("num") ? "A number (yours if empty)" : "A number of your own";
      const inp = el("input", { type: f.includes("t") || f.includes("list") ? "text" : "number", value: cur, placeholder: hint, "aria-label": hint, maxlength: 60 });
      kids.push(el("div", { class: "fi-row", style: "margin-top:6px" }, inp, el("button", { onclick: () => { api.command(slotKey(slot) + " " + (String(inp.value).trim() || "clear")); note = "Written on " + w.title + "."; draw(); } }, "Write")));
    }
    if (w.auto) kids.push(el("label", { class: "fi-row", style: "margin-top:4px" },
      el("input", { type: "checkbox", checked: !own.manual, onchange: (e) => { api.command(slotKey(slot) + (e.target.checked ? " auto" : " " + (own.n != null ? own.n : 0))); draw(); } }), el("span", null, "Follow the farm's count")));
  }
  kids.push(el("div", { class: "fi-row", style: "margin-top:6px" }, el("button", { onclick: () => { set(slot, { sz: null, sw: null, sh: null }); draw(); } }, "Normal size")));
  return el("div", { class: "fi-card" }, kids);
}
const slotKey = (slot) => (slot === "FarmBrand" ? "brand" : slot.slice(-1));
function set(slot, v) { if (api.write(slot, v)) note = ""; draw(); }
function view() {
  return [
    el("div", { class: "fi-row", style: "margin-bottom:6px" }, el("h2", null, "🖋️ Your farm ink"), el("button", { onclick: () => close() }, "Close")),
    note ? el("div", { class: "fi-muted", style: "color:#e6c37a" }, note) : null,
    SLOTS.map(([s, n]) => slotCard(s, n)),
    el("div", { class: "fi-muted", style: "margin-top:8px" }, "Colours: the wardrobe's colour picker, a layer for each colour. Moving, turning and over or under clothes: the game's Layering button. Everybody with the Companion or the Dispensary sees your ink as you set it."),
  ];
}
function draw() { if (box) box.replaceChildren(...view().flat().filter(Boolean)); }
export function openInkPanel(W, a) {
  Wd = W; api = a; close();
  if (!W.document.getElementById("fi-style")) { const s = W.document.createElement("style"); s.id = "fi-style"; s.textContent = CSS; W.document.head.appendChild(s); }
  box = W.document.createElement("div"); box.id = "fi-panel"; W.document.body.appendChild(box); draw();
  return true;
}
export function close() { if (box) { box.remove(); box = null; } note = ""; }
export const panelOpen = () => !!box;
