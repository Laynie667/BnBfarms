// The livestock panel: your own record, milk, breeding, inbox, guides and switches.
// Also the "Livestock" view staff and proprietors switch to for their own personal info.
import { h, card, title, muted, btn, chip, bar, toggle, ml } from "../dom.js";
import { guidesTab } from "./common.js";

const pct = (a, b) => (b ? (100 * a) / b : 0);
const hoursLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 3600000));

function me(ctx) {
  const s = ctx.s;
  const chips = [s.tier && chip(s.tier, "acc"), s.species && chip(s.species), s.gender && chip(s.gender),
                 ...(s.keys || []).map((k) => chip(k + " key")), s.heatUntil && chip("in heat", "alert"), s.preg && chip("carryin'", "good")];
  const bars = [
    s.milk && bar("Milk", ml(s.milk.ml) + " of " + ml(s.milk.cap) + " · grade " + s.milk.grade, pct(s.milk.ml, s.milk.cap)),
    s.quota && bar("Today's quota", ml(s.quota.ml) + " of " + ml(s.quota.goal) + (s.quota.streak ? " · streak " + s.quota.streak : ""), pct(s.quota.ml, s.quota.goal), "good"),
    s.semen && bar("Seed", ml(s.semen.ml) + " of " + ml(s.semen.cap), pct(s.semen.ml, s.semen.cap)),
    s.holding && s.holding.ml > 0 && bar("Holding", ml(s.holding.ml) + " of " + ml(s.holding.cap), pct(s.holding.ml, s.holding.cap), "alert"),
  ];
  return [
    card(h("div", { class: "fhc-title" }, s.name), h("div", { style: { marginTop: "6px" } }, chips)),
    bars.some(Boolean) && card(title("Today"), bars,
      s.heatUntil && muted("In heat for " + hoursLeft(s.heatUntil) + " more hours"),
      s.preg && muted("Carryin' for " + s.preg.sires.join(" & ") + " · due in " + Math.max(0, Math.ceil((s.preg.due - Date.now()) / 86400000)) + " day(s)")),
    (s.body || []).length && card(title("Body"), h("div", { class: "fhc-grid" },
      s.body.map((b) => h("div", null, muted(b.label), h("div", { style: { fontWeight: 600 } }, b.size))))),
    s.today && card(title("Marks"), h("div", { class: "fhc-grid" },
      [["Used today", s.today.tally], ["Naughty marks", s.today.naughty], ["Praised", s.today.praised]].map(([k, v]) => h("div", null, muted(k), h("div", { style: { fontWeight: 600 } }, v))))),
    h("div", { class: "fhc-quick" }, ["stats", "measure", "record", "pedigree", "keys"].map((c) => btn(c[0].toUpperCase() + c.slice(1), () => ctx.send(c)))),
  ];
}

function milking(ctx) {
  const s = ctx.s;
  if (!s.milk && !s.semen) return [card(title("Milking"), muted("You're not makin' milk right now. Flip Milkable on in Toggles if you'd like to."))];
  return [
    s.milk && card(title("Milk"), bar("In your udder", ml(s.milk.ml) + " of " + ml(s.milk.cap), pct(s.milk.ml, s.milk.cap)),
      muted("Grade " + s.milk.grade + (s.milk.lastAt ? " · last milked " + Math.round((Date.now() - s.milk.lastAt) / 60000) + " min ago" : ""))),
    s.quota && card(title("Quota"), bar("Today", ml(s.quota.ml) + " of " + ml(s.quota.goal), pct(s.quota.ml, s.quota.goal), "good")),
    s.semen && card(title("Seed"), bar("Stored", ml(s.semen.ml) + " of " + ml(s.semen.cap), pct(s.semen.ml, s.semen.cap))),
    card(title("Milkin' gear"), muted("Pumps, stalls and the milk vendor show up here once the farm reads your gear (comin' soon).")),
    h("div", null, btn("Quota", () => ctx.send("quota")), btn("Milk board", () => ctx.send("board"))),
  ];
}

function breeding(ctx) {
  const s = ctx.s, sw = s.switches || {};
  const rows = [["Breedable", sw.breedable], ["Fertile", sw.fertile], ["Jar insemination", sw.jarok ? "asks first" : "never"],
                ["Free use", sw.freeuse], ["Natural heat", sw.naturalheat]];
  return [
    card(title("Breedin'"), rows.map(([k, v]) => h("div", { class: "fhc-kv" }, h("span", null, k), h("span", { class: "fhc-muted" }, v === true ? "on" : v === false ? "off" : v))),
      s.heatUntil && muted("🔥 In heat · " + hoursLeft(s.heatUntil) + " h left"),
      s.preg && muted("🍼 Carryin' for " + s.preg.sires.join(" & "))),
    h("div", null, btn("My tally", () => ctx.send("tally")), btn("Eggs", () => ctx.send("eggs")), btn("Wash up", () => ctx.send("wash")), btn("Pedigree", () => ctx.send("pedigree"))),
  ];
}

export function inbox(ctx) {
  const f = ctx.ui.filter || "all";
  const items = ctx.feed.filter((x) => f === "all" || x.kind === f);
  return [
    h("div", null, [["all", "All"], ["notice", "From the farm"], ["reply", "Answers"], ["mine", "You asked"]].map(([id, label]) =>
      h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx.setUi({ filter: id }) }, label))),
    items.length ? items.slice().reverse().map((x) => h("div", { class: "fhc-card " + x.kind },
      h("span", { class: "fhc-time" }, new Date(x.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        (x.kind === "notice" ? " · from the farm" : x.kind === "mine" ? " · you asked" : "")), x.text)) : muted("Nothin' here yet."),
  ];
}

// the farm switches you hold, flipped with the same commands you'd type
export const SWITCH_INFO = [
  ["breedable", "Breedable", "You can be bred and filled"], ["fertile", "Fertile", "You can catch"],
  ["jarok", "Jar insemination", "On: staff still ask every time · Off: never"], ["freeuse", "Free use", "Any stud may have you without askin'"],
  ["futa", "Futa", "Cock and vulva both, milk and semen both"], ["milkable", "Milkable", "Make milk"],
  ["naturalheat", "Natural heat", "Come into heat on your own every 7 days"], ["praise", "Praise", "Let staff's praise count"],
  ["degrade", "Degrade", "Let staff's degradin' count"], ["tally", "Tally marks", "Show your tally on ?who and the board"],
  ["teaseme", "Tease me", "Let staff tease lines name you"],
];
export function farmSwitches(ctx, list) {
  const sw = ctx.s.switches || {};
  return list.map(([cmd, label, desc]) => toggle(label, desc, !!sw[cmd], () => ctx.send(cmd + " " + (sw[cmd] ? "off" : "on"))));
}
export function panelPrefs(ctx) {
  return card(title("This panel"), muted("Only on your computer."),
    [["compact", "Compact cards", "Smaller text, more on screen"], ["chime", "Chime on notices", "A soft sound when the farm messages you"],
     ["popopen", "Open on new notice", "Pop the panel open by itself"]].map(([k, label, desc]) =>
      toggle(label, desc, !!ctx.prefs[k], () => ctx.setPref(k, !ctx.prefs[k]))));
}
function toggles(ctx) {
  return [card(title("Farm settings"), muted("Saved by the farm girl. Your limits still win."), farmSwitches(ctx, SWITCH_INFO)),
          card(title("Gender"), muted("How the farm sees you. It picks your farm outfit."),
            h("div", { style: { marginTop: "6px" } }, ["female", "male", "futa", "femboy"].map((g) =>
              h("button", { type: "button", class: "fhc-pill" + (ctx.s.gender === g ? " on" : ""), onclick: () => ctx.send("gender " + g) }, g)))),
          panelPrefs(ctx)];
}

export const LIVESTOCK_TABS = [
  { id: "me", label: "Me", render: me },
  { id: "milk", label: "Milking", render: milking },
  { id: "breed", label: "Breeding", render: breeding },
  { id: "inbox", label: "Inbox", render: inbox },
  { id: "guides", label: "Guides", render: (ctx) => guidesTab(ctx, false) },
  { id: "toggles", label: "Toggles", render: toggles },
];
