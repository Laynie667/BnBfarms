// The proprietors' dashboard: write BC+ contracts rule by rule, and check the addons the farm leans on.
// The rule picker is built from BC+'s own rule list (shared/bcplus-rules.json), so every setting gets
// the right kind of control and only values BC+ accepts.
import { h, card, title, muted, btn, chip } from "../dom.js";
import { RULES, NEVER, BCPLUS_VERSION } from "../../../shared/bcplus.js";
import { bcplusStatus, summonReady } from "../addons.js";
import { latest } from "./staff.js";
import { BOT_MEMBER } from "../config.js";

const field = (label, el) => h("label", { class: "fhc-label" }, label, el);
const q = (v) => '"' + String(v).replace(/"/g, "'") + '"';

// one control per BC+ setting type; values are kept in ctx.ui under "set:<rule>:<name>"
function settingControl(ctx, rule, s) {
  const key = "set:" + rule.id + ":" + s.name, cur = ctx.ui[key];
  const set = (v) => ctx.setUi({ [key]: v }, true);
  const def = Array.isArray(s.default) ? s.default.join("\n") : String(s.default);
  switch (s.type) {
    case "checkbox":
      return h("select", { class: "fhc-sel", onchange: (e) => set(e.target.value) },
        ["on", "off"].map((v) => h("option", { value: v, selected: (cur || (s.default ? "on" : "off")) === v ? "selected" : null }, v)));
    case "option":
      return h("select", { class: "fhc-sel", onchange: (e) => set(e.target.value) },
        s.options.map((o) => h("option", { value: o, selected: (cur || s.default) === o ? "selected" : null }, o)));
    case "stringList":
      return h("textarea", { class: "fhc-in", rows: 3, placeholder: "one " + (s.entryLabel || "entry") + " per line" + (s.maxEntries ? " · up to " + s.maxEntries : ""),
        oninput: (e) => set(e.target.value) }, cur !== undefined ? cur : def);
    case "members":
      return h("input", { class: "fhc-in", placeholder: "farm, staff, or member numbers", value: cur !== undefined ? cur : "farm", oninput: (e) => set(e.target.value) });
    default:
      return h("input", { class: "fhc-in", maxlength: s.maxChars || 256, value: cur !== undefined ? cur : def, oninput: (e) => set(e.target.value) });
  }
}
// the ?contract add line for the picked rule and its settings
function addCommand(ctx, name, rule) {
  const pairs = rule.settings.map((s) => {
    const key = "set:" + rule.id + ":" + s.name;
    let v = ctx.ui[key];
    if (v === undefined) v = s.type === "checkbox" ? (s.default ? "on" : "off") : s.type === "members" ? "farm" : Array.isArray(s.default) ? s.default.join("\n") : s.default;
    if (s.type === "stringList") v = String(v).split("\n").map((x) => x.trim()).filter(Boolean).join("|");
    return s.name + "=" + q(v);
  });
  return ("contract add " + name + " " + rule.id + " " + pairs.join(" ")).trim();
}

function contracts(ctx) {
  // the name is read when a button's pressed (typin' doesn't redraw the tab)
  const nm = () => (ctx.ui.dName || "").trim().toLowerCase();
  const name = nm();
  const cats = [...new Set([...RULES.values()].map((r) => r.category))];
  const cat = ctx.ui.dCat || cats[0];
  const inCat = [...RULES.values()].filter((r) => r.category === cat);
  const rule = RULES.get(ctx.ui.dRule) && RULES.get(ctx.ui.dRule).category === cat ? RULES.get(ctx.ui.dRule) : inCat[0];
  const need = () => !nm() && (ctx.hint("Give your contract a name first (one word, like prizecow)."), true);
  return [
    card(title("Your contract"),
      field("Name (one word)", h("input", { class: "fhc-in", placeholder: "prizecow", value: ctx.ui.dName || "", oninput: (e) => ctx.setUi({ dName: e.target.value }, true) })),
      ctx.ui.dWarn && !name ? muted("Give it a name first, sugar.") : null,
      h("div", null,
        ["fun", "deep", "nhl"].map((b) => btn("New from " + b, () => !need() && ctx.send("contract new " + nm() + " from " + b))),
        btn("New, empty", () => !need() && ctx.send("contract new " + nm()))),
      field("Title", h("input", { class: "fhc-in", maxlength: 60, value: ctx.ui.dTitle || "", oninput: (e) => ctx.setUi({ dTitle: e.target.value }, true) })),
      field("Terms they'll read (%name% becomes their name)", h("textarea", { class: "fhc-in", rows: 3, maxlength: 1000, oninput: (e) => ctx.setUi({ dTerms: e.target.value }, true) }, ctx.ui.dTerms || "")),
      h("div", null,
        btn("Save title", () => !need() && (ctx.ui.dTitle ? ctx.send("contract title " + nm() + " " + ctx.ui.dTitle) : ctx.hint("Type the title first."))),
        btn("Save terms", () => !need() && (ctx.ui.dTerms ? ctx.send("contract terms " + nm() + " " + ctx.ui.dTerms) : ctx.hint("Write the terms first."))),
        btn("Farm ends it", () => !need() && ctx.send("contract policy " + nm() + " farm")),
        btn("Either side ends it", () => !need() && ctx.send("contract policy " + nm() + " either")))),
    card(title("Add a BC+ rule"), muted("Every rule and setting BC+ " + BCPLUS_VERSION + " has. Only values BC+ accepts can be picked."),
      field("Kind", h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ dCat: e.target.value, dRule: "" }) },
        cats.map((c) => h("option", { value: c, selected: c === cat ? "selected" : null }, c)))),
      field("Rule", h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ dRule: e.target.value }) },
        inCat.map((r) => h("option", { value: r.id, selected: r === rule ? "selected" : null }, r.name + (NEVER[r.id] ? " (never on the farm)" : ""))))),
      rule && muted(rule.description),
      rule && NEVER[rule.id] ? h("div", { class: "fhc-box alert" }, "The farm never uses this one: it " + NEVER[rule.id] + ".")
        : rule && [rule.settings.map((s) => field((s.label || s.name).replace(/:$/, ""), settingControl(ctx, rule, s))),
          h("div", null, btn("Add to " + (name || "contract"), () => !need() && ctx.send(addCommand(ctx, nm(), rule)), true),
            btn("Take it out", () => !need() && ctx.send("contract remove " + nm() + " " + rule.id)))]),
    card(title("Check and send"), h("div", null, btn("Preview", () => !need() && ctx.send("contract show " + nm())), btn("All contracts", () => ctx.send("contract list")),
      btn("Delete", () => !need() && ctx.send("contract delete " + nm()))), muted("Offer it from the Staff panel's Contracts tab.")),
    latest(ctx),
  ];
}

function addons(ctx) {
  const b = bcplusStatus(), s = summonReady(BOT_MEMBER);
  return [
    card(title("BC+"), chip(b.text, b.has ? (b.match ? "good" : "alert") : "alert"),
      muted("Contracts are checked against BC+ " + BCPLUS_VERSION + ". If the club's BC+ moves on, re-run the catalog tool and rebuild.")),
    card(title("BCX summoning (you)"), s === null ? muted("BCX isn't loaded here.") : chip(s.ok ? "Ready to be summoned · the farm bot is allowed" : s.why, s.ok ? "good" : "alert"),
      muted("On-call staff see the same check on their Staff panel.")),
    card(title("Comin' soon"), muted("Echo's pumps and milk vendor, outfits by species and gender with high security locks, and the farm's own Listen to my voice (ECHS first).")),
  ];
}

const SPECIES = ["cow", "bull", "pony", "horse", "goat", "sheep", "pig", "bunny", "rabbit", "pup", "dog", "kitt", "cat", "fox", "wolf", "deer", "goblin"];
const GENDERS = ["female", "male", "futa", "femboy"];
const KEYS_TEXT = { staff: "farm staff + their herd leader", leader: "their herd leader only", owners: "the proprietors only" };

function outfits(ctx) {
  const saved = ctx.s.outfits || {}, rules = ctx.s.outfitRules || {};
  const sp = ctx.ui.oSp || "cow";
  const slotBox = (key, label) => h("div", { class: "fhc-box", style: { padding: "8px", borderColor: saved[key] ? "var(--fh-good)" : "var(--fh-line)", borderStyle: saved[key] ? "solid" : "dashed" } },
    h("b", null, label),
    muted(saved[key] ? saved[key].items + " pieces" + (saved[key].locks ? ", " + saved[key].locks + " locked" : "") : "Not set · uses the fallback"),
    h("div", { style: { marginTop: "6px" } }, btn("Save what I'm wearin'", () => ctx.api.save && ctx.api.save(key)),
      saved[key] ? btn("Clear", () => ctx.send("outfit clear " + key.replace("uniform:", "").replace("special:", "special ").replace("|", " ").replace("*", "any"))) : null));
  const specials = Object.keys(saved).filter((k) => k.startsWith("special:"));
  return [
    card(title("What gets saved"), chip("Clothes", "good"), chip("Restraints", "good"), chip("Locks", "good"), chip("never bodies or hair"),
      muted("Dress yourself (or a willin' helper), lock the pieces that should stay locked, then save it to a slot. Every saved lock goes on as a high security padlock.")),
    card(title("New stock, by species and gender"),
      h("label", { class: "fhc-label" }, "Species", h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ oSp: e.target.value }) },
        SPECIES.map((x) => h("option", { value: x, selected: x === sp ? "selected" : null }, x)))),
      h("div", { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
        GENDERS.map((g) => slotBox(sp + "|" + g, sp + " · " + g)).concat([slotBox(sp + "|*", sp + " · any gender")])),
      h("div", { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))", marginTop: "8px" } },
        GENDERS.map((g) => slotBox("*|" + g, "any species · " + g)).concat([slotBox("stock", "Any new stock")])),
      muted("No exact match? The farm falls back: this species + gender → this species → this gender → any new stock.")),
    card(title("Staff uniforms"), h("div", { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
      ["farmhand", "mandated", "herdmaster", "proprietor"].map((r) => slotBox("uniform:" + r, r)))),
    card(title("Specials"), specials.map((k) => slotBox(k, k.slice(8))),
      h("label", { class: "fhc-label" }, "New special (one word: luxury, fairday, prizecow…)",
        h("input", { class: "fhc-in", value: ctx.ui.oSpecial || "", oninput: (e) => ctx.setUi({ oSpecial: e.target.value }, true) })),
      btn("Save what I'm wearin' as this special", () => { const n = (ctx.ui.oSpecial || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""); if (n.length < 2) return ctx.hint("Name the special first (one word, like luxury)."); ctx.api.save && ctx.api.save("special:" + n); })),
    card(title("Locks"), h("div", { class: "fhc-kv" }, h("b", null, "High security padlock"), chip("every farm lock", "good")),
      h("label", { class: "fhc-label" }, "Who holds the keys", h("select", { class: "fhc-sel", onchange: (e) => ctx.send("outfit keys " + e.target.value) },
        Object.entries(KEYS_TEXT).map(([k, v]) => h("option", { value: k, selected: (rules.keys || "staff") === k ? "selected" : null }, v))))),
    card(title("When to dress people"),
      [["approve", "onApprove", "Offer the stock outfit on approval", "Picked by species and gender"],
       ["clockin", "onClockIn", "Offer the uniform at clock-in", "Mandated staff get theirs every shift"],
       ["changeback", "changeBack", "Change back at clock-out", "Their own clothes were kept and go back on"]].map(([cmd, k, label, desc]) =>
        h("div", { class: "fhc-tog" }, h("div", null, h("div", { class: "fhc-tog-l" }, label), muted(desc)),
          h("button", { type: "button", class: "fhc-sw" + (rules[k] ? " on" : ""), "aria-pressed": rules[k] ? "true" : "false", "aria-label": label,
            onclick: () => ctx.send("outfit rule " + cmd + " " + (rules[k] ? "off" : "on")) }, h("span")))),
      muted("Contracts offer an outfit when they're signed, too: ?contract outfit <name> auto|none|<slot>.")),
    latest(ctx),
  ];
}

export const DASHBOARD_TABS = [
  { id: "contracts", label: "BC+ contracts", render: contracts },
  { id: "outfits", label: "Outfits", render: outfits },
  { id: "addons", label: "Other addons", render: addons },
];
