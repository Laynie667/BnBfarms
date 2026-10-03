/* WHAT'S IN THIS FILE (dom.js)
   A tiny helper for buildin' the panel safely (text always goes in as text, never as code), plus small
   pieces: cards, buttons, bars, switches.
*/
// A tiny element builder: h("div", { class: "x", onclick: fn }, "text", child, [more]).
// Text always goes in as text, never as HTML, so nothing the bot or another player sends can run as code.
export function h(tag, props, ...kids) {
  const el = window.document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k === "value") el.value = v;
    else el.setAttribute(k, v === true ? "" : String(v));
  }
  add(el, kids);
  return el;
}
function add(el, kids) {
  for (const k of kids) {
    if (k === null || k === undefined || k === false) continue;
    if (Array.isArray(k)) add(el, k);
    else el.appendChild(typeof k === "object" ? k : window.document.createTextNode(String(k)));
  }
}

// small pieces every view uses
export const card = (...kids) => h("div", { class: "fhc-box" }, ...kids);
export const title = (text) => h("div", { class: "fhc-h" }, text);
export const muted = (text) => h("div", { class: "fhc-muted" }, text);
export const btn = (label, onclick, accent) => h("button", { type: "button", class: accent ? "fhc-b fhc-b-acc" : "fhc-b", onclick }, label);
export const chip = (text, kind) => h("span", { class: "fhc-chip" + (kind ? " fhc-chip-" + kind : "") }, text);
export function bar(label, value, pct, kind) {
  return h("div", { class: "fhc-bar" },
    h("div", { class: "fhc-bar-row" }, h("span", null, label), h("span", { class: "fhc-muted" }, value)),
    h("div", { class: "fhc-bar-track" }, h("div", { class: "fhc-bar-fill" + (kind ? " fhc-fill-" + kind : ""), style: { width: Math.max(0, Math.min(100, pct)) + "%" } })));
}
export function toggle(label, desc, on, onflip) {
  return h("div", { class: "fhc-tog" },
    h("div", null, h("div", { class: "fhc-tog-l" }, label), desc ? h("div", { class: "fhc-muted" }, desc) : null),
    h("button", { type: "button", class: "fhc-sw" + (on ? " on" : ""), "aria-pressed": on ? "true" : "false", "aria-label": label, onclick: onflip }, h("span")));
}
export const ml = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + " L" : Math.round(n) + " mL");
