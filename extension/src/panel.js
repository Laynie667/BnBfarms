/* WHAT'S IN THIS FILE (panel.js)
   The panel itself: the 🌾 button (drag it, pin it), the panel (drag it), the panel switch
   (Livestock/Guest, Staff, Dashboard), the safety bar, tabs, banners for questions, the latest answer
   on every tab, and your own settings.
*/
// The farm panel: a 🌾 button that opens a panel with a view for each hat you wear
// (Livestock or Guest, Staff, Dashboard), tabs inside each, and a command box.
import { HISTORY_MAX, PREFS_KEY } from "./config.js";
import { CSS, THEME } from "./styles.js";
import { h, btn } from "./dom.js";
import { LIVESTOCK_TABS } from "./views/livestock.js";
import { GUEST_TABS } from "./views/guest.js";
import { STAFF_TABS } from "./views/staff.js";
import { DASHBOARD_TABS } from "./views/dashboard.js";
import { withExtras } from "./views/extras.js";

const VIEWS = {
  guest: { label: "Guest", tabs: GUEST_TABS },
  livestock: { label: "Livestock", tabs: LIVESTOCK_TABS },
  staff: { label: "Staff", tabs: STAFF_TABS },
  dashboard: { label: "Dashboard", tabs: DASHBOARD_TABS },
};

function loadPrefs() { try { return JSON.parse(window.localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; } }
function savePrefs(p) { try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) { /* private window: fine */ } }

export class Panel {
  constructor(onCommand, api) {
    this.onCommand = onCommand;
    this.api = api || {};
    this.outfit = null;
    this.unread = 0;
    this.welcome = {};
    this.s = { name: "", onBooks: false };
    this.feed = []; this.docs = []; this.asks = []; this.choose = null;
    this.ui = {};
    this.prefs = loadPrefs();
    if (this.prefs.chatToo === undefined) this.prefs.chatToo = true;   // farm messages show in chat too, unless they switch it off
    this.status = "…";
    const doc = window.document;

    const style = doc.createElement("style");
    style.textContent = CSS + ":root{" + Object.entries(THEME).map(([k, v]) => "--fh-" + k + ":" + v).join(";") + "}";
    doc.head.appendChild(style);

    this.btn = h("button", { id: "fhc-btn", type: "button", title: "B&B Farm", "aria-label": "B&B Farm panel" }, "🌾");
    this.btn.style.touchAction = "none";
    this.btn.addEventListener("pointerdown", (e) => this.dragButton(e));
    this.btn.addEventListener("click", () => { if (!this.btnDragged) this.toggle(); this.btnDragged = false; });
    this.el = h("div", { id: "fhc-panel", role: "dialog", "aria-label": "B&B Farm" });
    this.el.addEventListener("keydown", (e) => e.stopPropagation());   // keep BC from treatin' panel typin' as game keys
    // what changes is redrawn in here; the command box below is built once and never touched again, so a message
    // arrivin' never steals focus, pops a phone's keyboard back up, or zooms the screen
    this.top = h("div", { class: "fhc-top" });
    this.form = h("form", { class: "fhc-form", onsubmit: (e) => { e.preventDefault(); const i = this.form.querySelector("#fhc-input"); if (i.value.trim()) this.ask(i.value.trim()); i.value = ""; } },
      h("label", { class: "fhc-grow", style: { display: "flex" } }, h("span", { class: "fhc-sr" }, "Ask the farm girl"),
        h("input", { id: "fhc-input", class: "fhc-in", placeholder: "Ask the farm girl… (stats, size, help me)", autocomplete: "off" })),
      h("button", { type: "submit", class: "fhc-b fhc-b-acc", style: { margin: "0" } }, "Send"));
    // drag the corner to resize (mouse or finger)
    this.grip = h("div", { class: "fhc-grip", title: "Drag to resize", "aria-hidden": "true" });
    this.grip.addEventListener("pointerdown", (e) => this.resize(e));
    this.el.append(this.top, this.form, this.grip);
    doc.body.appendChild(this.btn);
    doc.body.appendChild(this.el);
    this.placeButton();
    this.render();
  }

  /* ── the 🌾 button: drag it anywhere (mouse or finger), pin it to keep it put ── */
  placeButton() {
    const p = this.prefs.btnPos;
    if (p) Object.assign(this.btn.style, { left: this.clampX(p.x, 46) + "px", top: this.clampY(p.y, 46) + "px", right: "auto", bottom: "auto" });
    else Object.assign(this.btn.style, { left: "", top: "", right: "12px", bottom: "12px" });
  }
  clampX(x, w) { return Math.max(0, Math.min(window.innerWidth - w, x)); }
  clampY(y, hgt) { return Math.max(0, Math.min(window.innerHeight - hgt, y)); }
  dragButton(e) {
    if (this.prefs.btnPinned) return;
    const r = this.btn.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top, x0 = e.clientX, y0 = e.clientY;
    let moving = false;
    const move = (ev) => {
      if (!moving && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;   // a tap is a tap, not a drag
      moving = true; this.btnDragged = true;
      Object.assign(this.btn.style, { left: this.clampX(ev.clientX - dx, 46) + "px", top: this.clampY(ev.clientY - dy, 46) + "px", right: "auto", bottom: "auto" });
    };
    const up = () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
      if (!moving) return;
      const b = this.btn.getBoundingClientRect();
      this.prefs.btnPos = { x: Math.round(b.left), y: Math.round(b.top) }; savePrefs(this.prefs);
      if (this.el.classList.contains("open") && !this.prefs.pos) this.placePanel();
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  }
  // the panel opens beside the button (unless you've dragged the panel somewhere yourself)
  placePanel() {
    this.el.classList.toggle("full", !!this.prefs.full);
    const sz = this.prefs.size;
    if (sz) Object.assign(this.el.style, { width: Math.min(sz.w, window.innerWidth - 8) + "px", height: Math.min(sz.h, window.innerHeight - 8) + "px" });
    else Object.assign(this.el.style, { width: "", height: "" });
    if (this.prefs.pos) { Object.assign(this.el.style, { left: this.clampX(this.prefs.pos.x, 120) + "px", top: this.clampY(this.prefs.pos.y, 60) + "px", right: "auto", bottom: "auto" }); return; }
    if (!this.prefs.btnPos) { Object.assign(this.el.style, { left: "", top: "", right: "12px", bottom: "66px" }); return; }
    const b = this.btn.getBoundingClientRect(), r0 = this.el.getBoundingClientRect();
    const pw = r0.width || Math.min(440, window.innerWidth - 24), ph = r0.height || Math.min(640, window.innerHeight * 0.78);
    const left = this.clampX(b.left + 46 - pw, pw);
    const top = b.top - ph - 8 >= 0 ? b.top - ph - 8 : this.clampY(b.bottom + 8, ph);
    Object.assign(this.el.style, { left: left + "px", top: top + "px", right: "auto", bottom: "auto" });
  }
  resetPlaces() { delete this.prefs.btnPos; delete this.prefs.pos; delete this.prefs.size; delete this.prefs.full; savePrefs(this.prefs); this.placeButton(); this.placePanel(); this.render(); }

  /* ── what the rest of the Companion calls ── */
  setStatus(text) { this.status = text; const s = this.el.querySelector("#fhc-status"); if (s) s.textContent = text; }
  setWelcome(w) { this.welcome = w || {}; this.render(); }
  setState(s) { this.s = s || this.s; this.render(); }
  add(text, kind = "reply") {
    this.feed.push({ text: String(text), kind, at: Date.now() });
    // the newest answer shows on whatever tab you're on, so a button never looks like it did nothin'
    if (kind !== "mine") this.fresh = { text: String(text), kind };
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
  setOutfit(o) { this.outfit = o; this.ping(true); this.render(); }
  ask(cmd) { this.add(cmd, "mine"); this.onCommand(cmd); }

  toggle(open = !this.el.classList.contains("open")) {
    if (open) this.placePanel();
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
      s: this.s, welcome: this.welcome, feed: this.feed, docs: this.docs, ui: this.ui, prefs: this.prefs, api: this.api,
      send: (cmd) => this.ask(cmd),
      // a button that can't do anything yet says why, instead of quietly doin' nothin'
      hint: (msg) => this.add("👉 " + msg, "notice"),
      fillBox: (text) => { this.add("👉 Finish it in the box at the bottom, then press Send: ?" + text + "…", "notice"); const i = this.form.querySelector("#fhc-input"); if (i) { i.value = text; if (!touchScreen()) i.focus(); } },
      setUi: (patch, quiet) => { Object.assign(this.ui, patch); if (!quiet) this.render(); },
      setPref: (k, v) => { this.prefs[k] = v; savePrefs(this.prefs); this.render(); },
      closeDoc: (id) => { this.docs = this.docs.filter((d) => d.id !== id); this.render(); },
      resetPlaces: () => { this.resetPlaces(); this.add("👉 The 🌾 button and panel are back in the corner, at their usual size.", "notice"); },
    };
  }
  render() {
    const ctx = this.ctx(), view = this.view(), V = VIEWS[view];
    const tabs = view === "guest" ? V.tabs : withExtras(V.tabs, view, ctx);   // + "Farm extras" when an add-on has somethin'
    const tabKey = "tab_" + view, tab = tabs.find((t) => t.id === this.ui[tabKey]) || tabs[0];
    const scroll = this.el.querySelector(".fhc-body"), keep = scroll ? scroll.scrollTop : 0;
    this.el.classList.toggle("compact", !!this.prefs.compact);
    const full = !!this.prefs.full;
    this.top.replaceChildren(
      h("div", { class: "fhc-head", style: { touchAction: "none" }, onpointerdown: (e) => this.drag(e) },
        h("div", null, h("div", { class: "fhc-title" }, "🌾 B&B Farm"), h("div", { id: "fhc-status", class: "fhc-muted" }, this.status)),
        h("div", { style: { display: "flex", gap: "6px" } },
          h("button", { type: "button", class: "fhc-pill", title: full ? "Back to a panel" : "Full screen", "aria-label": full ? "Back to a panel" : "Full screen",
            onclick: () => { this.prefs.full = !full; savePrefs(this.prefs); this.placePanel(); this.render(); } }, full ? "🗗" : "⛶"),
          h("button", { type: "button", class: "fhc-pill", "aria-label": "Close the panel", onclick: () => this.toggle(false) }, "✕"))),
      this.views().length > 1 && h("div", { class: "fhc-row" }, h("span", { class: "fhc-grow fhc-muted" }, "Panel"),
        this.views().map((v) => h("button", { type: "button", class: "fhc-pill" + (v === view ? " on" : ""), onclick: () => { this.prefs.view = v; savePrefs(this.prefs); this.render(); } }, VIEWS[v].label))),
      // Safe word, I'm stuck and Call staff live in the Safety tab (Guest and Livestock panels; staff reach it from Livestock)

      h("nav", { class: "fhc-row", "aria-label": "Panel sections" }, tabs.map((t) => {
        const n = t.badge ? t.badge(ctx) : 0;
        return h("button", { type: "button", class: "fhc-pill" + (t === tab ? " on" : ""), onclick: () => { this.ui[tabKey] = t.id; this.render(); } }, t.label + (n ? " · " + n : ""));
      })),
      h("div", { class: "fhc-body" }, this.banners(), safeRender(tab, ctx)));
    const body = this.el.querySelector(".fhc-body"); if (body) body.scrollTop = keep;
  }
  // questions waitin' on you, on every tab
  banners() {
    const out = [];
    const view = this.view(), tabNow = this.ui["tab_" + view];
    if (this.fresh && tabNow !== "inbox") out.push(h("div", { class: "fhc-box", style: { borderColor: this.fresh.kind === "notice" ? "var(--fh-good)" : "var(--fh-accent)" } },
      h("div", { class: "fhc-kv", style: { borderBottom: "none", padding: "0" } },
        h("span", { class: "fhc-muted" }, this.fresh.kind === "notice" ? "From the farm" : "Answer"),
        h("button", { type: "button", class: "fhc-pill", "aria-label": "Dismiss", onclick: () => { this.fresh = null; this.render(); } }, "✕")),
      h("div", { class: "fhc-card" + (this.fresh.kind === "notice" ? " notice" : ""), style: { maxHeight: "180px", overflowY: "auto" } }, this.fresh.text)));
    const o = this.outfit;
    if (o) out.push(h("div", { class: "fhc-box ask" },
      h("b", null, "👗 " + (o.why ? o.why + ": " : "") + "put on your " + o.label + "?"),
      h("div", { class: "fhc-muted" }, "Your own clothes are kept so you can change back. Body and hair aren't touched, and nothin' already locked on you moves." +
        (o.keys.length ? " Any locked pieces get high security padlocks the farm's keyholders can open." : "")),
      h("div", { style: { marginTop: "8px" } },
        btn("Yes, dress me", () => { this.outfit = null; this.api.wear && this.api.wear(o); this.render(); }, true),
        btn("Not now", () => { this.outfit = null; this.api.decline && this.api.decline(o); this.render(); }))));
    if (this.choose) out.push(h("div", { class: "fhc-box ask" }, h("div", { style: { whiteSpace: "pre-wrap" } }, this.choose.text),
      h("div", { style: { marginTop: "8px" } }, (this.choose.choices || []).map((c) => btn(c, () => { this.choose = null; this.ask(c); }, true)))));
    for (const a of this.asks) out.push(h("div", { class: "fhc-box ask" }, h("div", null, a.text),
      h("div", { style: { marginTop: "8px" } },
        btn("Yes", () => { this.asks = this.asks.filter((x) => x !== a); this.ask("yes"); }, true),
        btn("No", () => { this.asks = this.asks.filter((x) => x !== a); this.ask("no"); }))));
    return out;
  }
  // drag the corner grip: the panel grows or shrinks from its top-left corner, and remembers the size
  resize(e) {
    e.preventDefault(); e.stopPropagation();
    const r = this.el.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
    // pin the top-left corner where it is, so only the size changes
    Object.assign(this.el.style, { left: r.left + "px", top: r.top + "px", right: "auto", bottom: "auto" });
    const move = (ev) => {
      const w = Math.max(300, Math.min(window.innerWidth - r.left - 4, r.width + ev.clientX - x0));
      const hh = Math.max(300, Math.min(window.innerHeight - r.top - 4, r.height + ev.clientY - y0));
      Object.assign(this.el.style, { width: w + "px", height: hh + "px" });
    };
    const up = () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
      const b = this.el.getBoundingClientRect();
      this.prefs.size = { w: Math.round(b.width), h: Math.round(b.height) }; this.prefs.pos = { x: Math.round(b.left), y: Math.round(b.top) }; savePrefs(this.prefs);
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  }
  drag(e) {
    if (e.target.closest("button") || this.prefs.full) return;
    const r = this.el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    // pointer events: a mouse and a finger both drag it
    const move = (ev) => Object.assign(this.el.style, { left: this.clampX(ev.clientX - dx, 120) + "px", top: this.clampY(ev.clientY - dy, 60) + "px", right: "auto", bottom: "auto" });
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
      const b = this.el.getBoundingClientRect(); this.prefs.pos = { x: Math.round(b.left), y: Math.round(b.top) }; savePrefs(this.prefs); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  }
}

// a phone or tablet (no mouse): don't put the cursor in a box by itself, it pops the keyboard and zooms
function touchScreen() { try { return window.matchMedia("(pointer: coarse)").matches; } catch (e) { return false; } }

// one broken tab mustn't take the whole panel down
function safeRender(tab, ctx) {
  try { return tab.render(ctx); }
  catch (e) { console.warn("[Farmhand Companion]", e); return h("div", { class: "fhc-box alert" }, "This tab hit a snag. The rest of the panel still works."); }
}
