/* WHAT'S IN THIS FILE (staffdata.js)
   Staff tabs built from live bot data: Herd, Tease lines, Zones (the little map), Voice, Shift.
*/
// Staff tabs that show the farm's live picture: who's here, tease lines, zones, voice lines, shifts.
import { h, card, title, muted, btn, chip } from "../dom.js";

const MAP = 40, PX = 7;   // BC maps are 40 × 40 tiles; 7 px a tile fits the panel

export function herd(ctx) {
  const f = ctx.ui.herdF || "all", list = (ctx.s.herd || []).filter((x) =>
    f === "all" || (f === "mine" && x.mine) || (f === "milk" && x.milk !== null && x.milk >= 75) || (f === "heat" && x.heat));
  const act = (c, x) => () => ctx.send(c + " " + x.mn);
  return [
    h("div", null, [["all", "On the map"], ["mine", "My herd"], ["milk", "Needs milkin'"], ["heat", "In heat"]].map(([id, l]) =>
      h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx.setUi({ herdF: id }) }, l))),
    list.length ? list.map((x) => card(
      h("div", { class: "fhc-kv" }, h("b", null, x.name), h("span", { class: "fhc-muted" }, x.role + (x.where ? " · " + x.where : ""))),
      x.milk !== null ? h("div", { class: "fhc-bar-track", style: { margin: "6px 0" } },
        h("div", { class: "fhc-bar-fill" + (x.milk >= 75 ? " fhc-fill-alert" : ""), style: { width: Math.min(100, x.milk) + "%" } })) : null,
      h("div", null, x.mine && chip("my herd", "acc"), x.heat && chip("in heat", "alert"), x.preg && chip("carryin'", "good"),
        x.denied && chip("teats capped", "alert"), x.milk !== null && chip(x.milk + "% full")),
      h("div", { style: { marginTop: "6px" } }, btn("Record", act("record", x), true), btn("Milk", act("milk", x)), btn("Drain", act("drain", x)),
        btn("Edge", act("edge", x)), btn("Summon to me", act("summon", x))))) : muted("Nobody matches right now."),
  ];
}

export function tease(ctx) {
  const lines = ctx.s.tease;
  if (!lines) return [muted("Tease lines are for herdmasters and proprietors.")];
  return [
    card(h("div", { class: "fhc-kv" }, title("Tease lines"), h("span", { class: "fhc-muted" }, lines.length + " lines · " + (ctx.s.teaseOpted || 0) + " opted in")),
      lines.length ? lines.map((t, i) => h("div", { class: "fhc-kv" }, h("span", null, h("b", null, (i + 1) + ". "), t),
        h("button", { type: "button", class: "fhc-b", onclick: () => ctx.send("tease remove " + (i + 1)) }, "Remove"))) : muted("No lines yet.")),
    card(h("label", { class: "fhc-label" }, "New line · %name% becomes their name",
        h("textarea", { class: "fhc-in", rows: 2, oninput: (e) => ctx.setUi({ teaseDraft: e.target.value }, true) }, ctx.ui.teaseDraft || "")),
      btn("Add line", () => { const t = (ctx.ui.teaseDraft || "").trim(); if (!t) return ctx.hint("Write the line first."); ctx.send("tease add " + t); ctx.setUi({ teaseDraft: "" }); }, true)),
  ];
}

const COLORS = ["#8fbf6a", "#c9a35b", "#b8403a", "#7fa8c9", "#c48bd9", "#d98c6a"];
export function zones(ctx) {
  const zs = ctx.s.zones;
  if (!zs) return [muted("Zones are for herdmasters and proprietors.")];
  const groups = [...new Set(Object.values(zs).map((z) => z.group))];
  const color = (g) => COLORS[groups.indexOf(g) % COLORS.length];
  const sel = ctx.ui.zone && zs[ctx.ui.zone] ? ctx.ui.zone : Object.keys(zs)[0];
  const name = () => (ctx.ui.zoneName || sel || "").trim().toLowerCase();   // the box shows the picked zone until they type
  return [
    card(title("Farm map"),
      h("div", { style: { position: "relative", width: MAP * PX + "px", height: MAP * PX + "px", margin: "6px auto 0", background: "var(--fh-well)", border: "1px solid var(--fh-line)", borderRadius: "6px" } },
        Object.entries(zs).filter(([, z]) => z.a && z.b).map(([n, z]) => h("button", { type: "button", title: n, "aria-label": n, onclick: () => ctx.setUi({ zone: n }),
          style: { position: "absolute", padding: "0", left: Math.min(z.a.X, z.b.X) * PX + "px", top: Math.min(z.a.Y, z.b.Y) * PX + "px",
            width: (Math.abs(z.a.X - z.b.X) + 1) * PX + "px", height: (Math.abs(z.a.Y - z.b.Y) + 1) * PX + "px",
            background: color(z.group) + "44", border: (n === sel ? "3px solid var(--fh-text)" : "1px solid " + color(z.group)) } }))),
      h("div", { style: { marginTop: "6px" } }, groups.map((g) => h("span", { class: "fhc-chip", style: { borderColor: color(g) } }, g)))),
    card(title("Zones"), Object.keys(zs).length ? Object.entries(zs).map(([n, z]) => h("button", { type: "button", class: "fhc-doc" + (n === sel ? " on" : ""), style: { width: "100%", marginBottom: "4px" }, onclick: () => ctx.setUi({ zone: n }) },
        h("b", null, n), h("div", { class: "fhc-muted" }, "part of " + z.group + " · A " + (z.a ? z.a.X + "," + z.a.Y : "—") + " → B " + (z.b ? z.b.X + "," + z.b.Y : "—")))) : muted("No zones yet."),
      btn("Who's where", () => ctx.send("zone who"))),
    card(title(sel ? "Editin' " + sel : "New zone"),
      h("label", { class: "fhc-label" }, "Zone name (one word)", h("input", { class: "fhc-in", value: ctx.ui.zoneName || sel || "", oninput: (e) => ctx.setUi({ zoneName: e.target.value }, true) })),
      h("div", null, btn("Set A where I stand", () => name() ? ctx.send("zone a " + name()) : ctx.hint("Name the zone first.")), btn("Set B where I stand", () => name() ? ctx.send("zone b " + name()) : ctx.hint("Name the zone first."))),
      h("label", { class: "fhc-label" }, "Pair with (one place, odd shapes)", h("input", { class: "fhc-in", placeholder: "barn", value: ctx.ui.zonePair || "", oninput: (e) => ctx.setUi({ zonePair: e.target.value }, true) })),
      h("div", null, btn("Pair", () => (name() && ctx.ui.zonePair) ? ctx.send("zone pair " + name() + " " + ctx.ui.zonePair.trim().toLowerCase()) : ctx.hint("Name the zone, and the place to pair it with.")),
        btn("Unpair", () => name() ? ctx.send("zone unpair " + name()) : ctx.hint("Name the zone first.")), btn("Delete", () => name() ? ctx.send("zone clear " + name()) : ctx.hint("Name the zone first.")))),
  ];
}

export function voice(ctx) {
  const v = ctx.s.voice;
  if (!v) return [muted("Listen to my voice is for herd leaders.")];
  const target = ctx.ui.vTarget || "herd";
  const member = v.members.find((m) => String(m.mn) === String(target));
  const cur = target === "herd" ? v.herd : member || { on: false, lines: [], every: "15" };
  const who = target === "herd" ? "herd" : String(target);
  return [
    card(h("div", { class: "fhc-kv" }, h("div", null, title("Listen to my voice"), muted("Lines drift in privately, like a voice in their head. Only for stock who said ?hypno on.")),
        h("button", { type: "button", class: "fhc-sw" + (cur.on ? " on" : ""), "aria-pressed": cur.on ? "true" : "false", "aria-label": "Voice on or off",
          onclick: () => ctx.send("voice " + (cur.on ? "off" : "on") + " " + who) }, h("span"))),
      h("div", { style: { marginTop: "6px" } },
        h("button", { type: "button", class: "fhc-pill" + (target === "herd" ? " on" : ""), onclick: () => ctx.setUi({ vTarget: "herd" }) }, "Whole herd"),
        v.members.map((m) => h("button", { type: "button", class: "fhc-pill" + (String(target) === String(m.mn) ? " on" : ""), onclick: () => ctx.setUi({ vTarget: m.mn }) },
          m.name + (m.hypno ? "" : " (no ?hypno)")))),
      (cur.lines || []).length ? cur.lines.map((l, i) => h("div", { class: "fhc-kv" }, h("i", { style: { color: "#c9a3e6" } }, "[Voice] " + l),
        h("button", { type: "button", class: "fhc-b", onclick: () => ctx.send("voice remove " + who + " " + (i + 1)) }, "Remove"))) : muted("No lines yet."),
      h("label", { class: "fhc-label" }, "New line · %name% works", h("input", { class: "fhc-in", maxlength: 200, value: ctx.ui.vDraft || "", oninput: (e) => ctx.setUi({ vDraft: e.target.value }, true) })),
      btn("Add", () => { const t = (ctx.ui.vDraft || "").trim(); if (!t) return ctx.hint("Write the line first."); ctx.send("voice add " + who + " " + t); ctx.setUi({ vDraft: "" }); }, true),
      h("label", { class: "fhc-label" }, "How often", h("select", { class: "fhc-sel", onchange: (e) => ctx.send("voice every " + who + " " + e.target.value) },
        [["5", "Every 5 minutes"], ["15", "Every 15 minutes"], ["30", "Every 30 minutes"], ["chores", "Only during milkin' and chores"]].map(([k, l]) =>
          h("option", { value: k, selected: String(cur.every) === k ? "selected" : null }, l))))),
    card(title("ECHS sessions by depth"), muted("Still their ECHS: they agree to every induction, and their own switches and safeword win."),
      [["Fun", "Drifting · Yielding", "Not noticin' clothes or touches, posture, can't touch yourself, made to act"],
       ["Deep", "Entranced", "Follow and leash, made to speak, hears only your voice, arousal and orgasm"],
       ["No human left", "Deep · Blank", "Clothing illusion, planted triggers, suggestions that last after wakin'"]].map(([a, b, c]) =>
        h("div", { class: "fhc-kv", style: { display: "block" } }, h("b", null, a + " · "), h("span", { style: { color: "var(--fh-accent)" } }, b), muted(c)))),
  ];
}

export function shift(ctx) {
  const sh = ctx.s.shift || {};
  return [
    card(h("div", { class: "fhc-kv" }, h("div", null, title("Your shift"), muted((sh.clocked ? "On the clock" : "Off the clock") + " · " + (sh.weekH || 0) + " h this week")),
      btn(sh.clocked ? "Clock out" : "Clock in", () => ctx.send(sh.clocked ? "clockout" : "clockin"), !sh.clocked))),
    card(title("On duty"), (sh.onDuty || []).length ? sh.onDuty.map((n) => chip(n)) : muted("Nobody on duty here.")),
    card(title("On call"), muted("Mandated farmhands, plus staff who switched it on. Only these can be pulled in from other rooms."),
      (sh.onCall || []).length ? sh.onCall.map((o) => chip(o.name + (o.mandated ? " · mandated" : "") + (o.here ? " · here" : " · away"), o.here ? "good" : null)) : muted("Nobody's on call.")),
    ctx.s.log && card(title("Farm log"), ctx.s.log.map((e) => h("div", { class: "fhc-kv", style: { fontFamily: "ui-monospace,Consolas,monospace", fontSize: "11px" } },
      h("span", { class: "fhc-muted" }, new Date(e.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
      h("span", { style: { color: "var(--fh-accent)" } }, e.a), h("span", null, e.by + (e.d ? " · " + e.d : ""))))),
    h("div", null, btn("Hours", () => ctx.send("hours")), btn("Chores", () => ctx.send("chores")), btn("Spin the wheel", () => ctx.send("spin"))),
  ];
}
