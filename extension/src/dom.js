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
    else if (k === "value") { el.value = v; el.setAttribute("value", v); }   // the attribute too, so the shown value is in the markup
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
// A card folds: tap its title and the rest tucks away (a ▸ shows it's folded); it stays that way till tapped again.
// (Laynie, Oct 22: the panels needed tidyin', so each player can put away the cards they don't use.)
const FOLD_KEY = "fhc-folded";
let folded = null;
const foldSet = () => { if (!folded) { try { folded = new Set(JSON.parse(window.localStorage.getItem(FOLD_KEY)) || []); } catch (e) { folded = new Set(); } } return folded; };
const foldSave = () => { try { window.localStorage.setItem(FOLD_KEY, JSON.stringify([...foldSet()].slice(-200))); } catch (e) { /* fine */ } };
export const card = (...kids) => {
  const box = h("div", { class: "fhc-box" }, ...kids);
  const first = box.firstElementChild, t = first && (first.classList.contains("fhc-h") ? first : first.querySelector(":scope > .fhc-h"));
  if (!t || box.children.length < 2) return box;
  const key = (t.textContent || "").replace(/[·:].*$/, "").replace(/\d+/g, "").trim().slice(0, 40);
  if (!key) return box;
  t.classList.add("fhc-fold"); t.setAttribute("role", "button"); t.setAttribute("tabindex", "0");
  const set = (on) => { box.classList.toggle("fold", on); t.setAttribute("aria-expanded", on ? "false" : "true"); };
  set(foldSet().has(key));
  const flip = (e) => { e.preventDefault(); const on = !box.classList.contains("fold"); if (on) foldSet().add(key); else foldSet().delete(key); foldSave(); set(on); };
  t.addEventListener("click", flip);
  t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") flip(e); });
  return box;
};
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

/* ── the tidy panel's pieces (Laynie, Nov 4: "so much cleaner", and "tidying like that would be good across all panels") ── */
// small meters three to a row: { label, right, value, pct, kind } (kind: good / alert, or the accent colour)
export const meters = (list) => {
  const ms = list.filter(Boolean);
  return ms.length ? h("div", { class: "fhc-meters" }, ms.map((m) => h("div", { class: "fhc-m" },
    h("div", { class: "fhc-m-l" }, h("span", null, m.label), m.right ? h("span", null, m.right) : null),
    h("div", { class: "fhc-m-v" }, m.value),
    h("div", { class: "fhc-m-t" }, h("div", { class: m.kind ? "fhc-fill-" + m.kind : "", style: { width: Math.max(0, Math.min(100, m.pct || 0)) + "%" } }))))) : null;
};
// one-line rows that open where they sit: [{ id, label, sum, dot, body: () => [...] }]. Tap one and it opens, tap it
// again and it folds; one open at a time per list (which one is kept in ctx.ui, so a redraw leaves it open).
// A row with go() instead of body() is a link: it takes them somewhere else.
export function rows(ctx, key, list) {
  const items = list.filter(Boolean), openId = ctx.ui["open_" + key];
  if (!items.length) return null;
  return h("div", { class: "fhc-rows" }, items.map((r) => {
    const open = r.id === openId && r.body;
    const head = h("button", { type: "button", class: "fhc-r" + (open ? " open" : ""), "aria-expanded": r.body ? (open ? "true" : "false") : null,
      onclick: () => (r.go ? r.go() : ctx.setUi({ ["open_" + key]: open ? null : r.id })) },
      h("span", { class: "fhc-r-k" }, r.label, r.dot ? h("span", { class: "fhc-dot", "aria-label": "new" }) : null),
      r.sum ? h("span", { class: "fhc-r-s" }, r.sum) : null,
      h("span", { class: "fhc-r-c", "aria-hidden": "true" }, open ? "⌄" : "›"));
    return open ? [head, h("div", { class: "fhc-open" }, r.body())] : head;
  }));
}
// a few big buttons in a row, the last of them More ▾ with the rest in a menu under it
export function quick(ctx, key, list, more) {
  const isOpen = !!ctx.ui["more_" + key];
  return h("div", null,
    h("div", { class: "fhc-qa" }, list.filter(Boolean).map(([label, fn]) => h("button", { type: "button", class: "fhc-b", onclick: fn }, label)),
      more && more.length ? h("button", { type: "button", class: "fhc-b" + (isOpen ? " on" : ""), "aria-expanded": isOpen ? "true" : "false",
        onclick: () => ctx.setUi({ ["more_" + key]: !isOpen }) }, isOpen ? "More ▴" : "More ▾") : null),
    isOpen ? h("div", { class: "fhc-menu", role: "menu", "aria-label": "More" }, more.filter(Boolean).map(([label, fn]) =>
      h("button", { type: "button", role: "menuitem", class: "fhc-b", onclick: () => { ctx.setUi({ ["more_" + key]: false }, true); fn(); } }, label))) : null);
}
// a titled part of a tab, with a quiet line under it instead of a box round it
export const section = (head, right, ...kids) => h("div", { class: "fhc-sec" },
  h("div", { class: "fhc-sh" }, head, right ? h("span", { class: "fhc-sh-x" }, right) : null), ...kids);
// label: value pairs, two columns
export const pairs = (list) => {
  const ps = list.filter((p) => p && p[1] !== undefined && p[1] !== null && p[1] !== "" && p[1] !== false);
  return ps.length ? h("div", { class: "fhc-pairs" }, ps.map(([k, v]) => [h("span", { class: "fhc-muted" }, k), h("span", null, v)])) : null;
};
