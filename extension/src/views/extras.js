/* WHAT'S IN THIS FILE (extras.js)
   The "Farm extras" tab: whatever the bot's add-on scripts (glory stalls, barn life, pregnancy…) want
   you to see. The add-on describes cards (text, bars, chips, buttons, switches, a box to type in) and
   this draws them, so nobody has to install anything extra for a new add-on.
*/
import { h, card, title, muted, btn, chip, bar, toggle } from "../dom.js";

// add-ons that have somethin' for this panel (an add-on can say which panels with views: [...])
// staff: true cards (bookings, punishments, write-ups, show controls…) only on the Staff panel, never the Livestock one
function modsFor(ctx, view) {
  const mods = ctx.s.mods || {};
  return Object.entries(mods).filter(([, m]) => m && typeof m === "object" && (!Array.isArray(m.views) || m.views.includes(view)) && Array.isArray(m.cards))
    .map(([name, m]) => [name, Object.assign({}, m, { cards: m.cards.filter((c) => c && (view === "staff" ? true : !c.staff)) })])
    .filter(([, m]) => m.cards.length);
}

function drawCard(ctx, name, c, i) {
  const key = "x_" + name + "_" + i;
  return card(
    c.title && title(String(c.title)),
    c.text && h("div", { class: "fhc-card", style: { whiteSpace: "pre-wrap" } }, String(c.text)),
    Array.isArray(c.lines) && c.lines.map((l) => h("div", { class: "fhc-kv" }, h("span", null, String(l[0] ?? l)), l[1] !== undefined ? h("b", null, String(l[1])) : null)),
    Array.isArray(c.bars) && c.bars.map((b) => bar(String(b.label || ""), String(b.value ?? ""), Number(b.pct) || 0, b.kind)),
    Array.isArray(c.chips) && c.chips.length ? h("div", null, c.chips.map((x) => chip(String(x.text ?? x), x.kind))) : null,
    Array.isArray(c.toggles) && c.toggles.map((t) => toggle(String(t.label || ""), t.desc ? String(t.desc) : "", !!t.on, () => ctx.send(String(t.cmd)))),
    c.input && h("div", null,
      h("input", { class: "fhc-in", placeholder: String(c.input.placeholder || ""), value: ctx.ui[key] || "", oninput: (e) => ctx.setUi({ [key]: e.target.value }, true) }),
      btn(String(c.input.label || "Send"), () => {
        const v = (ctx.ui[key] || "").trim();
        if (!v) return ctx.hint("Type somethin' in the box first.");
        ctx.send(String(c.input.cmd) + " " + v); ctx.setUi({ [key]: "" });
      }, true)),
    Array.isArray(c.buttons) && c.buttons.length ? h("div", { style: { marginTop: "6px" } }, c.buttons.map((b) => btn(String(b.label || b.cmd), () => ctx.send(String(b.cmd)), !!b.accent))) : null,
    c.note && muted(String(c.note)));
}

function render(ctx, view) {
  const list = modsFor(ctx, view);
  if (!list.length) return [muted("No farm extras for you right now.")];
  return list.map(([name, m]) => h("div", null,
    h("div", { class: "fhc-muted", style: { margin: "8px 2px 2px" } }, "🧩 " + String(m.label || name)),
    m.cards.map((c, i) => drawCard(ctx, name, c, i))));
}

// adds the tab (just before Guides) only when an add-on has somethin' to show here
export function withExtras(tabs, view, ctx) {
  if (!modsFor(ctx, view).length) return tabs;
  const t = { id: "extras", label: "Farm extras", render: (c) => render(c, view) };
  const at = tabs.findIndex((x) => x.id === "guides");
  return at < 0 ? tabs.concat(t) : tabs.slice(0, at).concat(t, tabs.slice(at));
}
