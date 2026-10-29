/* WHAT'S IN THIS FILE (nursery.js)
   The 🧸 Nursery panel, only for people on the farm's nursery list (the bot sends s.nursery to nobody else).
   Littles: Play (little space, things to do), Games, Gear (stuffies and baby things on their own character),
   My grown-ups (ask for a cuddle, a change…), Settings. Caregivers: Littles (each little here, with everything
   they can do for them), Invite, Settings. Everything the nursery says goes only to nursery folk.
*/
import { h, card, title, muted, btn, chip, toggle } from "../dom.js";
import { safetyTab } from "./common.js";
import { inbox } from "./livestock.js";

const N = (ctx) => ctx.s.nursery || {};
const ACT_LABEL = { story: "📖 Story", nap: "😴 Nap", snack: "🍪 Snack", colour: "🖍️ Colourin'", blocks: "🧱 Blocks", bubbles: "🫧 Bubbles", sing: "🎵 Sing-song",
  puzzle: "🧩 Puzzle", teaparty: "🫖 Tea party", dance: "💃 Dance", swing: "🌳 Swing", sandbox: "🏖️ Sandbox", puppets: "🧦 Puppets", dressup: "👑 Dress-up",
  chalk: "🖍️ Chalk", ducks: "🦆 Feed the ducks", animals: "🐑 Baby animals", hay: "🌾 Hay pile", tractor: "🚜 Pedal tractor", garden: "🍓 Strawberries", stars: "⭐ Stars" };
const CARE_LABEL = { cuddle: "🤗 Cuddle", praise: "🌟 Praise", pat: "✋ Head pats", tuck: "🛏️ Tuck in", story: "📖 Story", bottle: "🍼 Bottle", snack: "🍪 Snack",
  check: "🔍 Check", change: "🧷 Change", bath: "🛁 Bath", rock: "🪑 Rock", sing: "🎵 Lullaby", kiss: "💋 Forehead kiss", tickle: "🪶 Tickle", play: "🧸 Play",
  wipe: "🧽 Wipe face", stuffie: "🧸 Give a stuffie" };
const ASK_LABEL = { cuddle: "🤗 A cuddle", change: "🧷 A change", story: "📖 A story", snack: "🍪 A snack", play: "🧸 Play with me", nap: "😴 I'm sleepy",
  bath: "🛁 A bath", bottle: "🍼 A bottle", help: "🙋 Help" };
const WET = ["dry", "a little damp", "soggy", "leaking!"];
const MESS = { cake: "cake", cream: "cream", honey: "honey", maple: "syrup", chocolate: "chocolate", strawberry: "strawberry", mud: "mud", slime: "slime" };
const grid = (items) => h("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" } }, items);

function stars(ctx) { const n = N(ctx); return chip("⭐ " + (n.stars || 0) + " of " + (n.cap || 0) + " today", "acc"); }
// a grown-up offered a stuffie: hold it, or not
function offerCard(ctx) {
  const o = ctx.ui.nurseryOffer; if (!o) return null;
  const g = (N(ctx).gear || []).find((x) => x.id === o.gear);
  return card(title("🧸 " + o.from + " is holdin' out a " + o.label),
    h("div", null, btn("Hold it", () => { const r = g && ctx.api.nurseryWear ? ctx.api.nurseryWear(g) : { ok: false, why: "no Companion helper" }; ctx.hint(r.ok ? "You're holdin' the " + o.label + "." : "Couldn't: " + r.why + "."); ctx.setUi({ nurseryOffer: null }); }, true),
      btn("No thanks", () => ctx.setUi({ nurseryOffer: null }))));
}

// ── littles ──
function playTab(ctx) {
  const n = N(ctx);
  const space = card(h("div", { class: "fhc-kv" }, title(n.space ? "🧸 You're little right now" : "🧸 Little space"), stars(ctx)),
    muted(n.space ? "The farm's grown-up things leave you be till you switch it off. Only nursery folk see what happens in here." : "Switch it on whenever you want to be little. While it's on, traps, breedin', milkin' and the rest of the grown-up farm leave you be."),
    btn(n.space ? "Grow back up" : "Go little", () => ctx.send(n.space ? "little off" : "little on"), !n.space));
  if (!n.space) return [offerCard(ctx), space];
  const w = n.wet || 0;
  const status = card(title("How you're doin'"),
    h("div", null, n.abcl ? chip("Paddin': " + WET[w], w >= 2 ? "warn" : w ? "acc" : "good") : null,
      (n.messes || []).map((m) => chip("Messy: " + (MESS[m] || m), "acc"))),
    (n.messes || []).length ? h("div", null, btn("🛁 Bath time", () => ctx.send("little bath"))) : null,
    !n.abcl ? muted("With the ABCL mod, the nursery can tell when your paddin' needs a change.") : null);
  return [offerCard(ctx), space, status,
    card(title("Things to do"), grid((n.acts || Object.keys(ACT_LABEL)).map((a) => btn(ACT_LABEL[a] || a, () => ctx.send("little " + a)))), muted("A gold star (a ribbon) now and then, a few a day."))];
}
function gamesTab(ctx) {
  const n = N(ctx); if (!n.space) return [card(title("🎲 Games"), muted("Go little first (Play tab), then come play."))];
  const g = (name, picks, label, desc) => card(title(label), muted(desc), grid(picks.map(([p, l]) => btn(l, () => ctx.send("little game " + name + (p ? " " + p : ""))))));
  return [
    g("rps", [["rock", "🪨 Rock"], ["paper", "📄 Paper"], ["scissors", "✂️ Scissors"]], "Rock, paper, scissors", "Against the farm girl."),
    g("guess", [["left", "👈 Left hand"], ["right", "👉 Right hand"]], "Which hand?", "There's a sweetie in one of 'em."),
    g("crayon", [["red", "🔴 Red"], ["blue", "🔵 Blue"], ["green", "🟢 Green"], ["yellow", "🟡 Yellow"]], "Guess the crayon", "She's hidin' one behind her back."),
    g("dice", [["", "🎲 Roll"]], "Dice", "Higher roll wins."),
    g("catch", [["", "⚽ Catch!"]], "Catch", "She tosses, you catch. Hopefully."),
    g("peekaboo", [["", "🙈 Peekaboo"]], "Peekaboo", "Always a winner."),
  ];
}
function gearTab(ctx) {
  const n = N(ctx), worn = ctx.api.nurseryWorn ? ctx.api.nurseryWorn() : {};
  const list = n.gear || [];
  const row = (kind, label) => card(title(label), grid(list.filter((x) => x.kind === kind).map((x) => {
    const on = worn[x.group] === x.name;
    return btn((on ? "✓ " : "") + x.label, () => { const r = on ? ctx.api.nurseryOff(x.group) : ctx.api.nurseryWear(x); ctx.hint(r.ok ? (on ? "Took off the " : "On: the ") + x.label + "." : "Couldn't: " + r.why + "."); ctx.setUi({}); }, on);
  })));
  return [offerCard(ctx),
    muted("These go on your own character, only when you press them, and come off the same way. Nothin' here is ever locked."),
    row("stuffie", "🧸 Stuffies"), row("mouth", "🍼 Pacifier and bottle"), row("wear", "🎀 Baby things"),
    btn("Take all of it off", () => { const r = ctx.api.nurseryOff ? ctx.api.nurseryOff() : { ok: false }; ctx.hint(r.ok ? "All the nursery things are off." : "Couldn't."); ctx.setUi({}); })];
}
function grownUpsTab(ctx) {
  const n = N(ctx), cs = n.carers || [];
  return [
    card(title("💞 My grown-ups"), cs.length ? cs.map((c) => h("div", { class: "fhc-kv" }, h("span", null, c.name), chip(c.here ? "here" : "away", c.here ? "good" : ""))) : muted("Nobody's paired with you yet. A caregiver can ask with ?nursery pair, and your Littlish Club grown-ups count too.")),
    n.space ? card(title("Ask a grown-up for…"), grid((n.asks || Object.keys(ASK_LABEL)).map((a) => btn(ASK_LABEL[a] || a, () => ctx.send("little ask " + a)))), muted("Only grown-ups who are here hear it.")) : muted("Go little first to ask your grown-ups for things."),
  ];
}
function littleSettings(ctx) {
  const n = N(ctx);
  return [card(title("Nursery settings"),
    toggle("Nursery traps", "Ball pits, bubbles, playpens and the like on the nursery's spots, while you're little.", !!n.traps, () => ctx.send("nursery traps " + (n.traps ? "off" : "on"))),
    h("div", { style: { marginTop: "8px" } }, btn("What can I do?", () => ctx.send("nursery")), btn("Leave the nursery", () => ctx.send("nursery leave"))))];
}

// ── caregivers ──
function littlesTab(ctx) {
  const n = N(ctx), ls = n.littles || [];
  if (!ls.length) return [card(title("🧸 Littles"), muted("No littles here right now. Littles who are here, and the ones you're paired with, show up in this tab."), stars(ctx))];
  const pick = ctx.ui.nurseryLittle && ls.find((l) => l.mn === ctx.ui.nurseryLittle) ? ctx.ui.nurseryLittle : (ls.find((l) => l.here && l.space) || ls[0]).mn;
  const L = ls.find((l) => l.mn === pick);
  return [
    card(h("div", { class: "fhc-kv" }, title("🧸 Littles"), stars(ctx)),
      h("div", null, ls.map((l) => h("button", { type: "button", class: "fhc-pill" + (l.mn === pick ? " on" : ""), onclick: () => ctx.setUi({ nurseryLittle: l.mn }) }, l.name + (l.mine ? " 💞" : ""))))),
    card(title(L.name),
      h("div", null, chip(L.here ? "here" : "away", L.here ? "good" : ""), chip(L.space ? "little now" : "not little right now", L.space ? "acc" : ""),
        L.wet ? chip("Paddin': " + WET[L.wet], L.wet >= 2 ? "warn" : "acc") : null, (L.messes || []).map((m) => chip("Messy: " + (MESS[m] || m), "acc"))),
      L.here && L.space ? grid((n.cares || Object.keys(CARE_LABEL)).map((c) => btn(CARE_LABEL[c] || c, () => ctx.send("care " + c + " " + L.mn), c === "change" && L.wet >= 2 || c === "bath" && (L.messes || []).length)))
        : muted(L.here ? "They're not in their little space right now." : "They're not at the farm right now."),
      L.mine ? null : h("div", null, btn("Ask to be their grown-up", () => ctx.send("nursery pair " + L.mn)))),
  ];
}
function inviteTab(ctx) {
  const box = h("input", { class: "fhc-in", placeholder: "Their name or member number", value: ctx.ui.nurseryWho || "", oninput: (e) => ctx.setUi({ nurseryWho: e.target.value }, true) });
  const go = (cmd) => { const v = (ctx.ui.nurseryWho || "").trim(); if (!v) return ctx.hint("Type their name first."); ctx.send(cmd + " " + v); };
  return [card(title("➕ Invite a little"), muted("They get a Yes / Not now card first. Once they say yes, they're in the nursery and paired with you."), box,
    h("div", { style: { marginTop: "6px" } }, btn("Invite as a little", () => go("nursery add") , true), btn("Ask to be their grown-up", () => go("nursery pair")))),
    ctx.s.proprietor ? card(title("Proprietors"), muted("Add a caregiver with ?nursery add <who> caregiver. ?nursery list shows everyone; ?nursery remove <who> takes them off."),
      h("div", null, btn("Add as a caregiver", () => { const v = (ctx.ui.nurseryWho || "").trim(); if (!v) return ctx.hint("Type their name first."); ctx.send("nursery add " + v + " caregiver"); }), btn("The list", () => ctx.send("nursery list")))) : null];
}
function carerSettings(ctx) {
  return [card(title("Nursery settings"), muted("Everything you do here is seen only by nursery folk."),
    h("div", null, btn("What can I do?", () => ctx.send("nursery")), btn("The list", () => ctx.send("nursery list")), btn("Leave the nursery", () => ctx.send("nursery leave"))))];
}

const show = (role) => (ctx) => N(ctx).role === role;
export const NURSERY_TABS = [
  { id: "play", label: "🧸 Play", show: show("little"), render: playTab },
  { id: "games", label: "🎲 Games", show: show("little"), render: gamesTab },
  { id: "gear", label: "🎀 Gear", show: show("little"), render: gearTab },
  { id: "grownups", label: "💞 Grown-ups", show: show("little"), render: grownUpsTab },
  { id: "littles", label: "🧸 Littles", show: show("caregiver"), render: littlesTab },
  { id: "invite", label: "➕ Invite", show: show("caregiver"), render: inviteTab },
  { id: "inbox", label: "📬 Inbox", render: inbox },
  { id: "nsettings", label: "⚙️ Nursery", render: (ctx) => (N(ctx).role === "little" ? littleSettings(ctx) : carerSettings(ctx)) },
  { id: "safety", label: "🆘 Safety", render: safetyTab, offRow: true },
];
