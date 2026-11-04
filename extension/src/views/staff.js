/* WHAT'S IN THIS FILE (staff.js)
   The Staff panel, tidied Nov 4 like the Livestock one (Laynie: "tidying like that would be good across all panels"):
   🗂 Office (safeword calls, look somebody up, what you looked up) · 📝 Queue · 🐑 Herd · 📜 Contracts, and under ⋯:
   🏚 Barn · ⏱ Shift (your duty and pasture too) · 🗺 Zones · 📒 Log (whoever may read it). On call and the ECHS card
   went to ⚙ Settings › Staff tools (settingspages.js), the guides to ⚙ Settings › Guides.
*/
import { h, card, title, muted, btn, chip, toggle, rows } from "../dom.js";
import { seasonsCard } from "./livestock.js";
import { DURATIONS } from "../../../shared/bcplus.js";
import { summonReady } from "../addons.js";
import { shift, zones } from "./staffdata.js";
import { logTab } from "./log.js";
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

// you on the job: your roles and keys, on duty or out to pasture (the top of the Shift tab)
function duty(ctx) {
  const s = ctx.s;
  return h("div", { class: "fhc-sum" },
    h("div", { class: "fhc-sum-top" }, h("span", { class: "fhc-nm" }, s.name), h("span", { class: "fhc-purse" }, s.onDuty ? "● on duty" : "out to pasture")),
    h("div", { class: "fhc-chips" }, (s.roles || []).map((r) => chip(r.toLowerCase())), (s.keys || []).map((k) => chip(k + " key")),
      s.onCall && chip("on call", "alert"), s.herdLeader && chip("herd: " + s.herdLeader)),
    h("div", { class: "fhc-kv", style: { border: "none", padding: "0" } }, muted(s.onDuty ? "Silver and gold keys out." : "Bronze key only. Your Livestock panel is yours."),
      s.pastureLock ? chip("kept out by " + s.pastureLock, "alert")
        : btn(s.onDuty ? "Go to pasture" : "Back on duty", () => ctx.send(s.onDuty ? "pasture" : "onduty"), !s.onDuty)),
    muted("Pasture puts your silver and gold keys away, makes you livestock for the visit, and takes you off call (mandated staff stay summonable). It doesn't lock you out. Only a ?turnout from your herd leader does that."));
}
function shiftTab(ctx) {
  return [duty(ctx), shift(ctx), h("div", null, ["record", "myherd", "keys"].map((c) => btn(c === "myherd" ? "My herd" : c[0].toUpperCase() + c.slice(1), () => ctx.send(c)))), latest(ctx)];
}
// 🐑 who's here: one line each (milk, heat, carryin'), opens to their buttons
function herd(ctx) {
  const f = ctx.ui.herdF || "all", list = (ctx.s.herd || []).filter((x) =>
    f === "all" || (f === "mine" && x.mine) || (f === "milk" && x.milk !== null && x.milk >= 75) || (f === "heat" && x.heat));
  const act = (c, x) => () => ctx.send(c + " " + x.mn);
  return [
    h("div", null, [["all", "On the map"], ["mine", "My herd"], ["milk", "Needs milkin'"], ["heat", "In heat"]].map(([id, l]) =>
      h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx.setUi({ herdF: id }) }, l))),
    list.length ? rows(ctx, "herd", list.map((x) => ({ id: "h" + x.mn,
      label: (x.mine ? "★ " : "") + x.name, dot: x.milk !== null && x.milk >= 75,
      sum: [x.role, x.where, x.milk !== null ? x.milk + "%" : null, x.heat ? "🔥" : null, x.preg ? "🍼" : null, x.denied ? "capped" : null].filter(Boolean).join(" · "),
      body: () => [
        x.milk !== null ? h("div", { class: "fhc-bar-track" }, h("div", { class: "fhc-bar-fill" + (x.milk >= 75 ? " fhc-fill-alert" : ""), style: { width: Math.min(100, x.milk) + "%" } })) : null,
        h("div", { class: "fhc-chips" }, x.mine && chip("my herd", "acc"), x.heat && chip("in heat", "alert"), x.preg && chip("carryin'", "good"),
          x.denied && chip("teats capped", "alert"), x.milk !== null && chip(x.milk + "% full")),
        h("div", null, btn("Record", act("record", x), true), btn("Milk", act("milk", x)), btn("Drain", act("drain", x)),
          btn("Edge", act("edge", x)), btn("Summon to me", act("summon", x)),
          x.mine && (x.reins ? btn("🐴 Let go", act("reins off", x)) : btn("🐴 Reins", act("reins", x))))] }))) : muted("Nobody matches right now."),
  ];
}

const LOOKUPS = ["record", "milk", "drain", "inspect", "vet", "quota", "stats", "keys", "size", "pedigree"];
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
  // look somebody up: a name (then a button), or the whole thing typed ("vet Bessie") and Enter
  const who = () => String(ctx.ui.look || "").trim();
  const look = (c) => () => (who() ? ctx.send(c + " " + who()) : ctx.hint("Type who first, in the Look somebody up box."));
  const typed = () => { const v = who(); if (!v) return; ctx.send(LOOKUPS.includes(v.split(/\s+/)[0].toLowerCase()) && /\s/.test(v) ? v : "record " + v); ctx.setUi({ look: "" }); };
  return [
    safeCards(ctx),
    h("div", { class: "fhc-sec" },
      h("div", { class: "fhc-sh" }, "Look somebody up"),
      h("input", { class: "fhc-in", placeholder: "Bessie, or a member number", "aria-label": "Look somebody up", value: ctx.ui.look || "", oninput: (e) => ctx.setUi({ look: e.target.value }, true),
        onkeydown: (e) => { if (e.key === "Enter") typed(); } }),
      h("div", null, LOOKUPS.slice(0, 6).map((c) => btn(c[0].toUpperCase() + c.slice(1), look(c), c === "record"))),
      muted("What you look up lands here, not in the chat. Stats, keys, size and pedigree work too: type ?stats Bessie in the box at the bottom.")),
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
  // when the rules apply (BC+'s conditions), from the boxes: nothing filled in means always
  const q = (v) => /\s/.test(v) ? "\"" + v + "\"" : v;
  const when = () => {
    const u = ctx.ui, p = [];
    if (u.ctRoom) p.push("room=" + u.ctRoom);
    if ((u.ctNames || "").trim()) p.push((u.ctNamesMode === "notin" ? "notnames=" : "names=") + q(u.ctNames.trim()));
    if ((u.ctMembers || "").trim()) p.push((u.ctMembersMode === "absent" ? "without=" : "with=") + u.ctMembers.trim().replace(/\s+/g, ""));
    if (u.ctRole) p.push((u.ctRoleMode === "absent" ? "norole=" : "role=") + u.ctRole);
    if (u.ctFrom && u.ctTo) p.push("time=" + u.ctFrom + "-" + u.ctTo);
    if ((u.ctOnly || "").trim()) p.push("only=" + u.ctOnly.trim().replace(/\s+/g, ""));
    return p.length ? " when " + p.join(" ") : "";
  };
  const sel = (key, opts) => h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ [key]: e.target.value }, true) }, opts.map(([v, l]) => h("option", { value: v, selected: (ctx.ui[key] || "") === v ? "selected" : null }, l)));
  const timeIn = (key) => h("input", { class: "fhc-in", type: "time", value: ctx.ui[key] || "", style: { width: "110px" }, oninput: (e) => ctx.setUi({ [key]: e.target.value }, true) });
  // another contract? (the farm's 10y9t-renewals.js): a day before a timed one ends I ask them; a yes lands here
  const rn = ctx.s.renewals || [], hrs = (t) => Math.max(1, Math.round((t - Date.now()) / 3600000)) + " h";
  const renewCard = rn.length ? card(title("📜 Renewals"), muted("A day before a timed contract ends, the farm asks if they'd like another. Offer it gives them the same one again, the same length (they need to be in the room)."),
    rn.map((r) => h("div", { class: "fhc-kv" },
      h("span", null, h("b", null, r.name), " · \"" + r.title + "\"" + (r.dur ? " (" + r.dur + ")" : "") + " · " + (r.ended ? "ended" : "ends in " + hrs(r.until))),
      r.said === "yes" && !r.offered ? (r.here && ctx.s.herdmaster ? btn("Offer it", () => ctx.send("renew offer " + r.mn), true) : chip(r.here ? "said yes" : "said yes · not here", "acc"))
        : chip(r.offered ? "offered again" : r.said === "no" ? "said no" : "asked", r.said === "no" ? "" : "acc"))),
    h("div", null, btn("All renewals", () => ctx.send("renew")))) : null;
  return [
    renewCard,
    card(title("Offer a BC+ contract"), muted("They read it in their own BC+ and only sign if they want it. Herdmasters and proprietors can offer."),
      field("Contract", h("input", { class: "fhc-in", value: ctx.ui.ctTpl || "deep", placeholder: "fun, deep, nhl, or one of yours", oninput: (e) => ctx.setUi({ ctTpl: e.target.value }, true) })),
      field("For (name or member number, here in the room)", input("Bessie", "ctWho", ctx)),
      field("How long", select("ctDur", DURATIONS.map((d) => [d.key, d.label]), ctx)),
      h("details", { style: { margin: "6px 0" } }, h("summary", null, "When the rules apply (BC+ conditions: leave empty for always)"),
        field("Rooms", sel("ctRoom", [["", "Any room"], ["public", "Public rooms only"], ["private", "Private rooms only"]])),
        field("Room names", h("div", { class: "fhc-row", style: { padding: "0", border: "none" } }, sel("ctNamesMode", [["in", "Only in"], ["notin", "Not in"]]),
          h("input", { class: "fhc-in", value: ctx.ui.ctNames || "", placeholder: "farm, barn (part of the name)", oninput: (e) => ctx.setUi({ ctNames: e.target.value }, true) }))),
        field("Who's there", h("div", { class: "fhc-row", style: { padding: "0", border: "none" } }, sel("ctMembersMode", [["present", "While one of these is there"], ["absent", "While none of these is there"]]),
          h("input", { class: "fhc-in", value: ctx.ui.ctMembers || "", placeholder: "member numbers, like 221397, 232922", oninput: (e) => ctx.setUi({ ctMembers: e.target.value }, true) }))),
        field("Their BC+ roles", h("div", { class: "fhc-row", style: { padding: "0", border: "none" } }, sel("ctRoleMode", [["present", "While somebody this close is there"], ["absent", "While nobody this close is there"]]),
          sel("ctRole", [["", "Anybody"], ["owner", "Owner"], ["lover", "Lover"], ["mistress", "Mistress"], ["whitelist", "Whitelist"], ["friend", "Friend"]]))),
        field("Time of day", h("div", { class: "fhc-row", style: { padding: "0", border: "none" } }, "from", timeIn("ctFrom"), "to", timeIn("ctTo"))),
        field("Only these rules (empty: all of them)", h("input", { class: "fhc-in", value: ctx.ui.ctOnly || "", placeholder: "pet.speech, pet.hearing", oninput: (e) => ctx.setUi({ ctOnly: e.target.value }, true) }))),
      h("div", null, btn("Preview", () => ctx.send("contract show " + tpl() + (who() ? " " + who() : "") + when())),
        btn("Offer it", () => who() ? ctx.send("contract offer " + tpl() + " " + who() + " " + dur() + when()) : ctx.hint("Type who it's for first, in the For box."), true))),
    card(title("In force"), btn("List farm contracts", () => ctx.send("contract list")),
      field("Somebody's contracts", input("Bessie", "ctLook", ctx)),
      h("div", null, btn("Ask their BC+", () => ctx.ui.ctLook ? ctx.send("contract check " + ctx.ui.ctLook) : ctx.hint("Type whose contracts first.")),
        btn("Release", () => ctx.ui.ctLook ? ctx.send("contract release " + ctx.ui.ctLook) : ctx.hint("Type whose contract to release first.")))),
    latest(ctx),
  ];
}

function barn(ctx) {
  const who = () => (ctx.ui.barnWho || "").trim();
  const act = (c) => () => (who() ? ctx.send(c + " " + who()) : ctx.hint("Type who first, in the Who box."));
  return [
    card(title("Barn work"), field("Who", input("Bessie", "barnWho", ctx)),
      h("div", null, ["milk", "collect", "drain", "edge", "denial", "ruin", "inspect", "vet", "quota"].map((c) => btn(c[0].toUpperCase() + c.slice(1), act(c))))),
    card(title("Jars"), btn("The jar shelf", () => ctx.send("jars")),
      muted("To breed somebody from a jar: ?inseminate <who> <jar> [hole]. They always get asked first, and anyone with jar breedin' off can't be."),
      h("div", null, btn("Breed from a jar…", () => ctx.fillBox("inseminate " + (who() ? who() + " " : ""))))),
    card(title("Herd"), h("div", null, ["myherd", "herdcall", "herdsummon", "roster", "stock", "queue"].map((c) => btn(c, () => ctx.send(c)))),
      h("div", null, btn("Summon to me", act("summon")), btn("Claim", act("claim")), btn("Turn out", act("turnout")), btn("Let up", act("letup")))),
    seasonsCard(ctx),
    latest(ctx),
  ];
}

// applications waitin' for a yes or no, and how the bot's messages are doin'
function queue(ctx) {
  const apps = ctx.s.apps || [], m = ctx.s.mail;
  const role = (a) => (ctx.ui["role" + a.mn] || (a.staffTrack ? "farmhand" : "livestock"));
  return [
    card(h("div", { class: "fhc-kv" }, title("Applications"), chip(apps.length + " waitin'", apps.length ? "alert" : null)),
      apps.length ? apps.map((a) => h("div", { class: "fhc-box", style: { margin: "6px 0" } },
        h("div", { class: "fhc-kv" }, h("b", null, a.n + ". " + a.name), h("span", { class: "fhc-muted" }, new Date(a.at).toLocaleDateString())),
        muted(a.sum + (a.staffTrack ? " · wants to be staff" : "")),
        h("label", { class: "fhc-label" }, "Approve as", h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ ["role" + a.mn]: e.target.value }, true) },
          ["livestock", "guest", "luxury", "gloryhole", "farmhand", "mandated", "herdmaster"].map((r) => h("option", { value: r, selected: role(a) === r ? "selected" : null }, r)))),
        h("div", null, btn("Read it", () => ctx.send("app " + a.n)), btn("Approve", () => ctx.send("approve " + a.mn + " " + role(a)), true), btn("Deny", () => ctx.send("deny " + a.mn)))))
        : muted("Nobody's waitin'. New ones beep you as well as showin' here.")),
    m && card(title("The bot's messages"),
      h("div", { class: "fhc-kv" }, h("span", null, "Waitin' to send"), h("b", null, String(m.sending))),
      h("div", { class: "fhc-kv" }, h("span", null, "People with messages held (away or unreachable)"), h("b", null, String(m.held))),
      h("div", { class: "fhc-kv" }, h("span", null, "Online and beep-able (friends both ways)"), h("b", null, m.beepable === null ? "checkin'…" : String(m.beepable))),
      muted("Held messages turn into one short summary when that person's back.")),
    latest(ctx),
  ];
}

// on call only works if your summon rule lets the bot pull you
function summonCheck() {
  const r = summonReady(BOT_MEMBER);
  if (r === null) return muted("BCX isn't loaded here. If you use BC+'s Ready to be summoned instead, add the farm bot (" + BOT_MEMBER + ") to it.");
  return h("div", { class: "fhc-kv" }, h("span", null, "Summon rule"), chip(r.ok ? "ready" : r.why, r.ok ? "good" : "alert"));
}
// ⚙ Settings › Staff tools: on call (settingspages.js)
export function workCard(ctx) {
  const s = ctx.s, sw = s.switches || {};
  return card(title("⏱ On call"), muted("Most staff leave this off. Mandated farmhands are always on call."),
    s.mandated ? h("div", { class: "fhc-kv" }, h("span", null, "On call"), chip("always (mandated)", "alert"))
      : toggle("On call", "Let the office summon you from anywhere with BCX or BC+ summoning", !!sw.forced, () => ctx.send("forced")),
    s.onCall && summonCheck());
}

export const STAFF_TABS = [
  { id: "office", label: "🗂 Office", render: office, badge: (ctx) => ctx.docs.length },
  { id: "queue", label: "📝 Queue", render: queue, badge: (ctx) => (ctx.s.apps || []).length },
  { id: "herd", label: "🐑 Herd", render: herd },
  { id: "contracts", label: "📜 Contracts", render: contracts },
  { id: "barn", label: "🏚 Barn", render: barn },
  { id: "shift", label: "⏱ Shift", render: shiftTab },
  { id: "zones", label: "🗺 Zones", render: zones },   // (on the panel, not in ⚙: drawin' a zone needs the map in view)
  { id: "log", label: "📒 Log", render: logTab, show: (ctx) => !!ctx.s.logReader },   // the record (chatlog.js), for whoever may read it (221397)
];
