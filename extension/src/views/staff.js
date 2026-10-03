// The staff panel: duty, the Office (lookups about other people land here), contracts, the barn, guides, switches.
import { h, card, title, muted, btn, chip, toggle } from "../dom.js";
import { guidesTab } from "./common.js";
import { panelPrefs } from "./livestock.js";
import { DURATIONS } from "../../../shared/bcplus.js";
import { summonReady } from "../addons.js";
import { herd, tease, zones, voice, shift } from "./staffdata.js";
import { BOT_MEMBER } from "../config.js";

// the most recent answer from the bot, shown under the forms so staff needn't flip to the Inbox
export function latest(ctx) {
  const r = ctx.feed.filter((x) => x.kind === "reply").slice(-1)[0];
  return r ? card(title("Latest answer"), h("div", { class: "fhc-card" }, r.text)) : null;
}
const field = (label, input) => h("label", { class: "fhc-label" }, label, input);
const input = (ph, key, ctx) => h("input", { class: "fhc-in", placeholder: ph, value: ctx.ui[key] || "", oninput: (e) => ctx.setUi({ [key]: e.target.value }, true) });
const select = (key, opts, ctx) => h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ [key]: e.target.value }, true) },
  opts.map(([v, l]) => h("option", { value: v, selected: (ctx.ui[key] || opts[0][0]) === v ? "selected" : null }, l)));

function me(ctx) {
  const s = ctx.s;
  return [
    card(h("div", { class: "fhc-title" }, s.name),
      h("div", { style: { marginTop: "6px" } }, (s.roles || []).map((r) => chip(r.toLowerCase(), "acc")), (s.keys || []).map((k) => chip(k + " key")),
        s.onCall && chip("on call", "alert"), s.herdLeader && chip("herd: " + s.herdLeader))),
    card(h("div", { class: "fhc-kv" }, h("div", null, title("Duty"), muted(s.onDuty ? "On duty · silver and gold keys out" : "Out to pasture · bronze key only · your Livestock panel is yours")),
        s.pastureLock ? chip("kept out by " + s.pastureLock, "alert")
          : btn(s.onDuty ? "Go to pasture" : "Back on duty", () => ctx.send(s.onDuty ? "pasture" : "onduty"), !s.onDuty)),
      muted("Pasture puts your silver and gold keys away, makes you livestock for the visit, and takes you off call (mandated staff stay summonable). It doesn't lock you out. Only a ?turnout from your herd leader does that.")),
    h("div", null, ["record", "hours", "myherd", "keys", "chores"].map((c) => btn(c[0].toUpperCase() + c.slice(1), () => ctx.send(c)))),
    latest(ctx),
  ];
}

// safeword calls sit at the top of the Office till someone says they're handled
function safeCards(ctx) {
  const recent = ctx.feed.filter((x) => x.kind === "notice" && /SAFEWORD/.test(x.text) && Date.now() - x.at < 60 * 60000 && !ctx.ui["done" + x.at]);
  return recent.map((x) => h("div", { class: "fhc-box alert" }, h("b", null, x.text),
    muted("Everything's paused and on-call staff were summoned. Nothin' has been released. Check on them first, then decide."),
    h("div", { style: { marginTop: "8px" } },
      btn("I'm goin' to them", () => ctx.send("where"), true),
      btn("All okay, close it", () => ctx.setUi({ ["done" + x.at]: true })))));
}
function office(ctx) {
  const docs = ctx.docs.slice().reverse();
  const sel = docs.find((d) => d.id === ctx.ui.doc) || docs[0];
  return [
    safeCards(ctx),
    muted("Anything you look up about somebody else lands here, not in the chat: record, stats, vet, quota, keys, size, pedigree."),
    h("div", null, h("input", { class: "fhc-in", placeholder: "Look somebody up: vet Bessie", value: ctx.ui.look || "", oninput: (e) => ctx.setUi({ look: e.target.value }, true),
      onkeydown: (e) => { if (e.key === "Enter" && ctx.ui.look) { ctx.send(ctx.ui.look); ctx.setUi({ look: "" }); } } })),
    docs.length ? h("div", { class: "fhc-split" },
      h("div", { class: "fhc-docs" }, docs.map((d) => h("button", { type: "button", class: "fhc-doc" + (sel && d.id === sel.id ? " on" : ""), onclick: () => ctx.setUi({ doc: d.id }) },
        h("b", null, d.who), h("div", { class: "fhc-muted" }, d.kind + " · " + new Date(d.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))))),
      sel && h("div", { class: "fhc-box", style: { flex: "1", minWidth: "0" } }, h("div", { class: "fhc-card" }, sel.text),
        h("div", { style: { marginTop: "8px" } }, btn("Refresh", () => ctx.send(sel.kind + " " + sel.about)), btn("Close", () => ctx.closeDoc(sel.id)))))
      : card(title("Nothin' on the desk"), muted("Try ?vet, ?record or ?stats with somebody's name.")),
  ];
}

function contracts(ctx) {
  // read the boxes when the button's pressed, not when the tab was drawn
  const tpl = () => (ctx.ui.ctTpl || "deep").trim(), who = () => (ctx.ui.ctWho || "").trim(), dur = () => ctx.ui.ctDur || "1w";
  return [
    card(title("Offer a BC+ contract"), muted("They read it in their own BC+ and only sign if they want it. Herdmasters and proprietors can offer."),
      field("Contract", h("input", { class: "fhc-in", value: ctx.ui.ctTpl || "deep", placeholder: "fun, deep, nhl, or one of yours", oninput: (e) => ctx.setUi({ ctTpl: e.target.value }, true) })),
      field("For (name or member number, here in the room)", input("Bessie", "ctWho", ctx)),
      field("How long", select("ctDur", DURATIONS.map((d) => [d.key, d.label]), ctx)),
      h("div", null, btn("Preview", () => ctx.send("contract show " + tpl() + (who() ? " " + who() : ""))),
        btn("Offer it", () => who() && ctx.send("contract offer " + tpl() + " " + who() + " " + dur()), true))),
    card(title("In force"), btn("List farm contracts", () => ctx.send("contract list")),
      field("Somebody's contracts", input("Bessie", "ctLook", ctx)),
      h("div", null, btn("Ask their BC+", () => ctx.ui.ctLook && ctx.send("contract check " + ctx.ui.ctLook)),
        btn("Release", () => ctx.ui.ctLook && ctx.send("contract release " + ctx.ui.ctLook)))),
    latest(ctx),
  ];
}

function barn(ctx) {
  const who = () => (ctx.ui.barnWho || "").trim();
  const act = (c) => () => who() && ctx.send(c + " " + who());
  return [
    card(title("Barn work"), field("Who", input("Bessie", "barnWho", ctx)),
      h("div", null, ["milk", "collect", "drain", "edge", "denial", "ruin", "inspect", "vet", "quota"].map((c) => btn(c[0].toUpperCase() + c.slice(1), act(c))))),
    card(title("Jars"), btn("The jar shelf", () => ctx.send("jars")),
      muted("To inseminate: ?inseminate <who> <jar> [hole]. They always get asked first, and anyone with jar insemination off can't be."),
      h("div", null, btn("Inseminate…", () => ctx.fillBox("inseminate " + (who() ? who() + " " : ""))))),
    card(title("Herd"), h("div", null, ["myherd", "herdcall", "herdsummon", "roster", "stock", "queue"].map((c) => btn(c, () => ctx.send(c)))),
      h("div", null, btn("Summon to me", act("summon")), btn("Claim", act("claim")), btn("Turn out", act("turnout")), btn("Let up", act("letup")))),
    latest(ctx),
  ];
}

// on call only works if your summon rule lets the bot pull you
function summonCheck() {
  const r = summonReady(BOT_MEMBER);
  if (r === null) return muted("BCX isn't loaded here. If you use BC+'s Ready to be summoned instead, add the farm bot (" + BOT_MEMBER + ") to it.");
  return h("div", { class: "fhc-kv" }, h("span", null, "Summon rule"), chip(r.ok ? "ready" : r.why, r.ok ? "good" : "alert"));
}
function toggles(ctx) {
  const s = ctx.s, sw = s.switches || {};
  return [
    card(title("Work"), muted("Most staff leave this off. Mandated farmhands are always on call."),
      s.mandated ? h("div", { class: "fhc-kv" }, h("span", null, "On call"), chip("always (mandated)", "alert"))
        : toggle("On call", "Let the office summon you from anywhere with BCX or BC+ summoning", !!sw.forced, () => ctx.send("forced")),
      s.onCall && summonCheck()),
    muted("Your own milkin' and breedin' switches are on your Livestock panel."),
    panelPrefs(ctx),
  ];
}

export const STAFF_TABS = [
  { id: "me", label: "Me", render: me },
  { id: "herd", label: "Herd", render: herd },
  { id: "office", label: "Office", render: office, badge: (ctx) => ctx.docs.length },
  { id: "contracts", label: "Contracts", render: contracts },
  { id: "barn", label: "Barn", render: barn },
  { id: "tease", label: "Tease lines", render: tease },
  { id: "voice", label: "Voice", render: voice },
  { id: "zones", label: "Zones", render: zones },
  { id: "shift", label: "Shift", render: shift },
  { id: "guides", label: "Guides", render: (ctx) => guidesTab(ctx, true) },
  { id: "toggles", label: "Toggles", render: toggles },
];
