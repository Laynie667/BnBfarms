// The farm panel: a 🌾 button that opens a panel with a view for each hat you wear
// (Livestock or Guest, Staff, Dashboard), tabs inside each, and a command box.
import { HISTORY_MAX, PREFS_KEY } from "./config.js";
import { CSS, THEME } from "./styles.js";
import { h, btn } from "./dom.js";
import { LIVESTOCK_TABS } from "./views/livestock.js";
import { GUEST_TABS } from "./views/guest.js";
import { STAFF_TABS } from "./views/staff.js";
import { DASHBOARD_TABS } from "./views/dashboard.js";

const VIEWS = {
  guest: { label: "Guest", tabs: GUEST_TABS },
  livestock: { label: "Livestock", tabs: LIVESTOCK_TABS },
  staff: { label: "Staff", tabs: STAFF_TABS },
  dashboard: { label: "Dashboard", tabs: DASHBOARD_TABS },
};

function loadPrefs() { try { return JSON.parse(window.localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; } }
function savePrefs(p) { try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) { /* private window: fine */ } }

export class Panel {
  constructor(onCommand) {
    this.onCommand = onCommand;
    this.unread = 0;
    this.welcome = {};
    this.s = { name: "", onBooks: false };
    this.feed = []; this.docs = []; this.asks = []; this.choose = null;
    this.ui = {};
    this.prefs = loadPrefs();
    this.status = "…";
    const doc = window.document;

    const style = doc.createElement("style");
    style.textContent = CSS + ":root{" + Object.entries(THEME).map(([k, v]) => "--fh-" + k + ":" + v).join(";") + "}";
    doc.head.appendChild(style);

    this.btn = h("button", { id: "fhc-btn", type: "button", title: "B&B Farm", "aria-label": "B&B Farm panel", onclick: () => this.toggle() }, "🌾");
    this.el = h("div", { id: "fhc-panel", role: "dialog", "aria-label": "B&B Farm" });
    this.el.addEventListener("keydown", (e) => e.stopPropagation());   // keep BC from treatin' panel typin' as game keys
    if (this.prefs.pos) Object.assign(this.el.style, { left: this.prefs.pos.x + "px", top: this.prefs.pos.y + "px", right: "auto", bottom: "auto" });
    doc.body.appendChild(this.btn);
    doc.body.appendChild(this.el);
    this.render();
  }

  /* ── what the rest of the Companion calls ── */
  setStatus(text) { this.status = text; const s = this.el.querySelector("#fhc-status"); if (s) s.textContent = text; }
  setWelcome(w) { this.welcome = w || {}; this.render(); }
  setState(s) { this.s = s || this.s; this.render(); }
  add(text, kind = "reply") {
    this.feed.push({ text: String(text), kind, at: Date.now() });
    while (this.feed.length > HISTORY_MAX) this.feed.shift();
    if (kind !== "mine") this.ping();
    this.render();
  }
  addDoc(d) {
    this.docs = this.docs.filter((x) => !(x.about === d.about && x.kind === d.kind));   // a fresh lookup replaces the old one
    this.docs.push(Object.assign({ id: "d" + Date.now() + Math.random().toString(36).slice(2, 6), at: Date.now() }, d));
    this.ui.doc = this.docs[this.docs.length - 1].id;
    if (this.view() === "staff") this.ui.tab_staff = "office";
    this.ping(); this.render();
  }
  addAsk(a) { this.asks = this.asks.filter((x) => Date.now() - x.at < 10 * 60000).concat([Object.assign({ at: Date.now() }, a)]); this.ping(true); this.render(); }
  setChoose(c) { this.choose = c; this.ping(true); this.render(); }
  ask(cmd) { this.add(cmd, "mine"); this.onCommand(cmd); }

  toggle(open = !this.el.classList.contains("open")) {
    this.el.classList.toggle("open", open);
    if (open) { this.unread = 0; this.btn.removeAttribute("data-unread"); }
  }
  show(visible) { this.btn.style.display = visible ? "" : "none"; if (!visible) this.toggle(false); }

  /* ── inside ── */
  ping(important) {
    if (this.el.classList.contains("open")) return;
    this.unread++; this.btn.setAttribute("data-unread", String(this.unread));
    if (this.prefs.popopen || important) { if (this.prefs.popopen) this.toggle(true); }
    if (this.prefs.chime) this.chime();
  }
  chime() {
    try {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      const a = new A(), o = a.createOscillator(), g = a.createGain();
      o.frequency.value = 660; g.gain.value = 0.05; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.15);
    } catch (e) { /* no sound: fine */ }
  }
  views() {
    const s = this.s, v = [s.onBooks ? "livestock" : "guest"];
    if (s.staff) v.push("staff");
    if (s.proprietor) v.push("dashboard");
    return v;
  }
  view() { const v = this.views(); return v.includes(this.prefs.view) ? this.prefs.view : v[v.length > 1 && this.s.staff ? 1 : 0]; }
  ctx() {
    return {
      s: this.s, welcome: this.welcome, feed: this.feed, docs: this.docs, ui: this.ui, prefs: this.prefs,
      send: (cmd) => this.ask(cmd),
      fillBox: (text) => { const i = this.el.querySelector("#fhc-input"); if (i) { i.value = text; i.focus(); } },
      setUi: (patch, quiet) => { Object.assign(this.ui, patch); if (!quiet) this.render(); },
      setPref: (k, v) => { this.prefs[k] = v; savePrefs(this.prefs); this.render(); },
      closeDoc: (id) => { this.docs = this.docs.filter((d) => d.id !== id); this.render(); },
    };
  }
  render() {
    const ctx = this.ctx(), view = this.view(), V = VIEWS[view];
    const tabKey = "tab_" + view, tab = V.tabs.find((t) => t.id === this.ui[tabKey]) || V.tabs[0];
    const scroll = this.el.querySelector(".fhc-body"), keep = scroll ? scroll.scrollTop : 0;
    // a message arrivin' mid-sentence mustn't eat what they're typin'
    const box = this.el.querySelector("#fhc-input"), typed = box ? box.value : "", hadFocus = box && window.document.activeElement === box;
    this.el.classList.toggle("compact", !!this.prefs.compact);
    this.el.replaceChildren(
      h("div", { class: "fhc-head", onmousedown: (e) => this.drag(e) },
        h("div", null, h("div", { class: "fhc-title" }, "🌾 B&B Farm"), h("div", { id: "fhc-status", class: "fhc-muted" }, this.status)),
        h("button", { type: "button", class: "fhc-pill", "aria-label": "Close the panel", onclick: () => this.toggle(false) }, "✕")),
      this.views().length > 1 && h("div", { class: "fhc-row" }, h("span", { class: "fhc-grow fhc-muted" }, "Panel"),
        this.views().map((v) => h("button", { type: "button", class: "fhc-pill" + (v === view ? " on" : ""), onclick: () => { this.prefs.view = v; savePrefs(this.prefs); this.render(); } }, VIEWS[v].label))),
      h("div", { class: "fhc-row" },
        h("button", { type: "button", class: "fhc-safe red", onclick: () => this.ask("safe") }, "Safe word"),
        h("button", { type: "button", class: "fhc-safe", onclick: () => this.ask("stuck") }, "I'm stuck"),
        h("button", { type: "button", class: "fhc-safe", style: { borderColor: "var(--fh-line)" }, onclick: () => this.ask("staff") }, "Call staff")),
      h("nav", { class: "fhc-row", "aria-label": "Panel sections" }, V.tabs.map((t) => {
        const n = t.badge ? t.badge(ctx) : 0;
        return h("button", { type: "button", class: "fhc-pill" + (t === tab ? " on" : ""), onclick: () => { this.ui[tabKey] = t.id; this.render(); } }, t.label + (n ? " · " + n : ""));
      })),
      h("div", { class: "fhc-body" }, this.banners(), safeRender(tab, ctx)),
      h("form", { class: "fhc-form", onsubmit: (e) => { e.preventDefault(); const i = e.target.querySelector("#fhc-input"); if (i.value.trim()) this.ask(i.value.trim()); i.value = ""; } },
        h("label", { class: "fhc-grow", style: { display: "flex" } }, h("span", { class: "fhc-sr" }, "Ask the farm girl"),
          h("input", { id: "fhc-input", class: "fhc-in", placeholder: "Ask the farm girl… (stats, size, help me)", autocomplete: "off" })),
        h("button", { type: "submit", class: "fhc-b fhc-b-acc", style: { margin: "0" } }, "Send")));
    const body = this.el.querySelector(".fhc-body"); if (body) body.scrollTop = keep;
    const box2 = this.el.querySelector("#fhc-input");
    if (box2){ box2.value = typed; if (hadFocus) box2.focus(); }
  }
  // questions waitin' on you, on every tab
  banners() {
    const out = [];
    if (this.choose) out.push(h("div", { class: "fhc-box ask" }, h("div", { style: { whiteSpace: "pre-wrap" } }, this.choose.text),
      h("div", { style: { marginTop: "8px" } }, (this.choose.choices || []).map((c) => btn(c, () => { this.choose = null; this.ask(c); }, true)))));
    for (const a of this.asks) out.push(h("div", { class: "fhc-box ask" }, h("div", null, a.text),
      h("div", { style: { marginTop: "8px" } },
        btn("Yes", () => { this.asks = this.asks.filter((x) => x !== a); this.ask("yes"); }, true),
        btn("No", () => { this.asks = this.asks.filter((x) => x !== a); this.ask("no"); }))));
    return out;
  }
  drag(e) {
    if (e.target.closest("button")) return;
    const r = this.el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    const move = (ev) => Object.assign(this.el.style, { left: Math.max(0, ev.clientX - dx) + "px", top: Math.max(0, ev.clientY - dy) + "px", right: "auto", bottom: "auto" });
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
      const b = this.el.getBoundingClientRect(); this.prefs.pos = { x: Math.round(b.left), y: Math.round(b.top) }; savePrefs(this.prefs); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  }
}

// one broken tab mustn't take the whole panel down
function safeRender(tab, ctx) {
  try { return tab.render(ctx); }
  catch (e) { console.warn("[Farmhand Companion]", e); return h("div", { class: "fhc-box alert" }, "This tab hit a snag. The rest of the panel still works."); }
}
