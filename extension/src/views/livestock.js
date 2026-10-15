/* WHAT'S IN THIS FILE (livestock.js)
   The Livestock panel (your own): Me, Milking (with your gear), Breeding, Inbox, Guides, Toggles (farm
   switches, gender, panel settings).
*/
// The livestock panel: your own record, milk, breeding, inbox, guides and switches.
// Also the "Livestock" view staff and proprietors switch to for their own personal info.
import { h, card, title, muted, btn, chip, bar, toggle, ml } from "../dom.js";
import { guidesTab, safetyTab } from "./common.js";
import { storeTab } from "./store.js";
import { gearLore } from "../gearlore.js";
import { localSaveState, localSavePick, localSaveReconnect, localSaveNow, localSaveLoad } from "../localsave.js";
import { VERSION } from "../version.js";
import { drawnBodyState, drawnBodySet, drawnBodyCup, drawnBodyPaste, drawnBodyFromStudio, drawnBodySeeOthers, drawnBodyBelly, drawnBodyUseFarm } from "../drawnbody.js";

const pct = (a, b) => (b ? (100 * a) / b : 0);
const hoursLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 3600000));

// what has you right now, in plain lines, and the quiet button
export function happeningCard(ctx) {
  const s = ctx.s, hp = s.happening || [], quiet = s.quietUntil && s.quietUntil > Date.now();
  if (!hp.length && !s.onBooks) return null;
  return card(h("div", { class: "fhc-kv" }, title("What's happenin' to you"), quiet ? chip("quiet", "acc") : null),
    hp.length ? hp.map((t) => h("div", { style: { margin: "3px 0" } }, t)) : muted("Nothin' has hold of you right now."),
    h("div", null, quiet ? btn("End the quiet", () => ctx.send("quiet off")) : btn("An hour's quiet", () => ctx.send("quiet 60")),
      muted(quiet ? "Nothin' new starts on you till it's over." : "Quiet: no new traps, urges, scents or teasin' for an hour. It doesn't stop what already has you; the safe word does.")));
}
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
    happeningCard(ctx),
    bars.some(Boolean) && card(title("Today"), bars,
      s.heatUntil && muted("In heat for " + hoursLeft(s.heatUntil) + " more hours"),
      s.preg && muted("Carryin' for " + s.preg.sires.join(" & ") + " · due in " + Math.max(0, Math.ceil((s.preg.due - Date.now()) / 86400000)) + " day(s)")),
    (s.body || []).length && card(title("Body"), h("div", { class: "fhc-grid" },
      s.body.map((b) => h("div", null, muted(b.label), h("div", { style: { fontWeight: 600 } }, b.size))))),
    s.today && card(title("Marks"), h("div", { class: "fhc-grid" },
      [["Used today", s.today.tally], ["Naughty marks", s.today.naughty], ["Praised", s.today.praised]].map(([k, v]) => h("div", null, muted(k), h("div", { style: { fontWeight: 600 } }, v))))),
    s.kept && card(h("div", { class: "fhc-kv" }, title("🏷️ Kept by " + s.kept.by), chip(Math.max(1, Math.ceil((s.kept.until - Date.now()) / 86400000)) + " day(s)", "acc")),
      s.kept.tag ? muted("Your tag: " + s.kept.tag) : null, s.kept.name ? muted("This week you're called: " + s.kept.name) : null,
      (s.kept.milk || []).length ? muted("Milked at " + s.kept.milk.map((x) => x + ":00").join(" and ")) : null,
      h("div", null, btn("What that means", () => ctx.send("kept")), btn("End it", () => ctx.send("kept off")))),
    s.intensity && card(title("How the farm talks to you"),
      h("div", null, [["tender", "Tender"], ["rough", "Rough"], ["filthy", "Filthy"]].map(([id, label]) =>
        h("button", { type: "button", class: "fhc-pill" + (s.intensity === id ? " on" : ""), onclick: () => ctx.send("intensity " + id) }, label))),
      muted(s.intensity === "tender" ? "Softer words, and the traps lean mild." : s.intensity === "filthy" ? "Dirtier words, and the traps lean brutal." : "As written."),
      muted("It calls you: " + (((s.words || {}).call || []).join(", ") || "whatever comes to mind") + " · never: " + (((s.words || {}).never || []).join(", ") || "nothin' ruled out")),
      h("div", null, btn("Names I love…", () => ctx.fillBox("callme ")), btn("Never call me…", () => ctx.fillBox("nevercall ")))),
    h("div", { class: "fhc-quick" }, ["stats", "measure", "record", "pedigree", "keys"].map((c) => btn(c[0].toUpperCase() + c.slice(1), () => ctx.send(c)))),
  ];
}

// what you're hooked up to right now, read off you by the farm
function gearCard(s) {
  const g = s.gear || {};
  const steps = (lv) => h("div", { style: { display: "flex", gap: "4px", marginTop: "6px" } },
    [1, 2, 3, 4].map((n) => h("div", { style: { flex: "1", height: "9px", borderRadius: "3px", background: n <= lv ? "var(--fh-accent)" : "var(--fh-line)" } })));
  return card(title("Milkin' gear"),
    g.milk ? [h("div", { class: "fhc-kv" }, h("b", null, g.milk.name), h("span", null, g.milk.ml + " mL a minute")), steps(g.milk.level),
              muted(["", "Gentle", "Steady", "Hard", "Max"][g.milk.level] + (g.milk.kind === "echo" ? " · the more worked up you are, the faster it draws" : ""))]
      : muted("No pump on right now. A lactation pump, Echo's portable pump, the milk vendor or a milkin' stall all milk you here."),
    g.machine && h("div", { class: "fhc-kv" }, h("span", null, "⚙️ " + g.machine.name), h("span", { class: "fhc-muted" }, g.machine.intensity < 0 ? "off" : "intensity " + g.machine.intensity)),
    g.funnel && h("div", { class: "fhc-kv" }, h("span", null, "Funnel gag"), h("span", { class: "fhc-muted" }, "fitted, and it counts as open")));
}

function milking(ctx) {
  const s = ctx.s;
  if (!s.milk && !s.semen) return [card(title("Milking"), muted("You're not makin' milk right now. Flip Milkable on in Toggles if you'd like to."))];
  return [
    s.milk && card(title("Milk"), bar("In your udder", ml(s.milk.ml) + " of " + ml(s.milk.cap), pct(s.milk.ml, s.milk.cap)),
      muted("Grade " + s.milk.grade + (s.milk.lastAt ? " · last milked " + Math.round((Date.now() - s.milk.lastAt) / 60000) + " min ago" : ""))),
    s.quota && card(title("Quota"), bar("Today", ml(s.quota.ml) + " of " + ml(s.quota.goal), pct(s.quota.ml, s.quota.goal), "good")),
    s.semen && card(title("Seed"), bar("Stored", ml(s.semen.ml) + " of " + ml(s.semen.cap), pct(s.semen.ml, s.semen.cap))),
    gearCard(s),
    s.stallUntil && card(h("div", { class: "fhc-kv" }, title("Milkin' stall"),
      chip(Math.max(0, Math.round((s.stallUntil - Date.now()) / 60000)) + " min left", "acc")), muted("It drains you down to a quarter of what you hold, then lets go.")),
    s.dial && card(h("div", { class: "fhc-kv" }, title("The stall dial"), s.milkCums ? chip("milked till you came × " + s.milkCums, "acc") : null),
      h("div", null, [["gentle", "Gentle"], ["steady", "Steady"], ["hard", "Hard"], ["punishing", "Punishin'"]].map(([id, label]) =>
        h("button", { type: "button", class: "fhc-pill" + (s.dial === id ? " on" : ""), onclick: () => ctx.send("stalldial " + id) }, label))),
      muted({ gentle: "Slow and sweet. It leaves you a third.", steady: "It drains you to a quarter.", hard: "Fast and deep, down to an eighth, and sore teats after.", punishing: "Past empty. You'll be sensitive for an hour after." }[s.dial] || ""),
      muted("Run hot enough in the stall and the cups will tip you over.")),
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
      s.preg && muted("🍼 Carryin' for " + s.preg.sires.join(" & ")),
      s.eggs && muted("🥚 Carryin' " + s.eggs.n + " eggs · ?lay at the nest, or they come when they're due")),
    s.trapCard && muted("🧪 Your trap card is on the Traps tab."),
    h("div", null, btn("My tally", () => ctx.send("tally")), btn("Eggs", () => ctx.send("eggs")), btn("Wash up", () => ctx.send("wash")), btn("Pedigree", () => ctx.send("pedigree"))),
  ];
}

// 🧪 Traps: a test subject's trap card, what the farm has on them right now, and the proprietors' own card
function traps(ctx) {
  const s = ctx.s, tc = s.trapCard, ad = s.trapAdmin, gear = s.farmGear || [];
  return [
    happeningCard(ctx),
    s.stateErr && card(title("Somethin' broke on the farm girl's end"), muted("Part of your panel didn't arrive. Tell the proprietors this line: " + s.stateErr)),
    tc ? card(h("div", { class: "fhc-kv" }, title("Trap card" + (tc.rank ? " · " + tc.rank : "")), chip(tc.total + " sprung" + (tc.nextRank ? " · next rank at " + tc.nextRank : ""), "acc")),
      tc.kinds.length ? h("div", null, tc.kinds.map((k) => chip(k.kind + " ×" + k.n))) : muted("Nothin's caught you yet. Give it time."),
      muted(tc.left + " kind" + (tc.left === 1 ? "" : "s") + " still to find" + (tc.eggs ? " · " + tc.eggs + " eggs laid" : "") + (tc.paused ? " · traps paused" : "") + (tc.eager ? " · eager (no waits)" : "") + (tc.danger ? " · Danger Draught in you" : "")),
      (tc.corr || tc.under) ? bar("Corruption", tc.corr + " of 100" + (tc.under ? " · gone under, depth " + tc.under : ""), tc.corr, "alert") : null,
      tc.hunt && muted("🔔 The hunt is on: get to " + tc.hunt.goal),
      h("div", null, btn("Struggle", () => ctx.send("struggle")), btn(tc.paused ? "Traps on" : "Pause traps", () => ctx.send("traps " + (tc.paused ? "on" : "off"))),
        btn(tc.eager ? "Eager: on" : "Eager: off", () => ctx.send("traps eager " + (tc.eager ? "off" : "on"))), btn("What's out there", () => ctx.send("traps")), btn("Lay (at the nest)", () => ctx.send("lay")), btn("My brood book", () => ctx.send("brood"))))
       : (s.roles || []).includes("SUBJECT")
         // a subject, but the farm girl sent no card: her bot is older than this panel
         ? card(title("Trap card"), muted("You're a test subject, and the traps are live for you. Your card isn't showin' because the farm girl's bot (v" + ((ctx.welcome && ctx.welcome.ver) || "?") + ") is older than this panel: it needs 0.22 or newer on her computer to send it."),
             h("div", null, btn("Struggle", () => ctx.send("struggle")), btn("What's out there", () => ctx.send("traps"))))
       : card(title("Traps"), muted("The farm's traps spring for test subjects and nobody else. A proprietor signs a volunteer up; you're not one right now, so you can walk right over them.")),
    card(title("On you right now"), gear.length ? gear.map((g) => h("div", { style: { marginTop: "6px" } }, h("div", { class: "fhc-kv" }, h("b", null, g.name), h("span", { class: "fhc-muted" }, Math.max(0, Math.ceil((g.until - Date.now()) / 60000)) + " min")), muted(gearLore(g.name) || g.desc || "")))
      : muted("No farm gear on you."),
      !ctx.prefs.gear && muted("Trap gear only goes on for real with \"Farm can put real gear on me\" switched on (Toggles → This panel).")),
    s.sitting && card(title("🪺 Sittin' the nest"), muted(s.sitting.n + " eggs under you. They hatch in about " + Math.max(1, Math.ceil((s.sitting.until - Date.now()) / 60000)) + " min."), h("div", null, btn("Get up", () => ctx.send("sit up")))),
    (s.holes && s.holes.length) ? card(title("What you've taken"),
      s.holes.map((x) => h("div", { class: "fhc-kv" }, h("span", null, "Your " + x.hole + " · " + x.rank), h("span", { class: "fhc-muted" }, x.loads + " loads" + (x.knots ? " · " + x.knots + " knots" : "") + (x.next ? " · next at " + x.next : "")))),
      muted("Every step a hole is trained, you hold more for good and the traps pour more into it.")) : null,
    (s.album && s.album.length) ? card(title("📔 Keepsakes"),
      s.album.map((e) => h("div", { style: { marginTop: "6px" } }, h("div", { class: "fhc-kv" }, h("b", null, e.i + " " + e.h), h("span", { class: "fhc-muted" }, new Date(e.t).toLocaleDateString())), muted(e.x))),
      muted("Only you can open this album.")) : null,
    ad && card(h("div", { class: "fhc-kv" }, title("Proprietor: subjects & traps"), chip(ad.subjects.length + " subject" + (ad.subjects.length === 1 ? "" : "s"), "acc")),
      ad.subjects.length ? ad.subjects.map((x) => h("div", { class: "fhc-kv" }, h("span", null, (x.here ? "● " : "") + x.name), h("span", { class: "fhc-muted" }, x.n + " sprung" + (x.paused ? " · paused" : ""))))
        : muted("Nobody's signed up yet: ?subject add <who>."),
      muted("Trap spots: " + (ad.spots.length ? ad.spots.join(", ") : "none yet (?spot set trap-<kind>)")),
      muted("Water: " + (ad.water.length ? ad.water.join(", ") : "none yet (?spot set pond)") + (ad.nest ? " · " + ad.nest + " eggs in the nest" : "") + (ad.pack ? " · pack at " + ad.pack : "")),
      ad.hunt && muted("🔔 Hunt on: finish at " + ad.hunt.goal + ", " + ad.hunt.done + " home"),
      h("div", null, btn("Kinds & spots", () => ctx.send("traps")), btn("Subjects", () => ctx.send("subject")), btn(ad.hunt ? "Stop the hunt" : "Start a hunt", () => ctx.send(ad.hunt ? "hunt stop" : "hunt start")),
        btn("Gather eggs", () => ctx.send("gather")))),
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
  ["mpreg", "Mpreg", "A load in your ass can take too, no item needed (with Breedable and Fertile on)"],
  ["jarok", "Jar insemination", "On: staff still ask every time · Off: never"], ["freeuse", "Free use", "Any stud may have you without askin'"],
  ["futa", "Futa", "Cock and vulva both, milk and semen both"], ["milkable", "Milkable", "Make milk"],
  ["naturalheat", "Natural heat", "Come into heat on your own every 7 days"], ["praise", "Praise", "Let staff's praise count"],
  ["degrade", "Degrade", "Let staff's degradin' count"], ["tally", "Tally marks", "Show your tally on ?who and the board"],
  ["teaseme", "Tease me", "Let staff tease lines name you"],
  ["hypno", "Hypno", "Let your herd leader's voice lines reach you, privately"],
  ["potions", "Potions", "Staff and the wheel can give you potions, and others can gift you one (you're asked first). Your limits still rule some out"],
  ["dares", "Dares", "Staff and the wheel can hand you a dare to do in half an hour"],
  ["watersports", "Watersports", "Piss play can find you: the spray trap, a feeder crafted for it, and the scenes that have it. Off until you say so"],
  ["parasite", "Parasite", "Swallow at the glory stalls and, rarely, a pair of livin' lips seals over your mouth for 12 hours: it feeds you fertility, growth, hyper pregnancy and capacity serum and turns every load you swallow into more"],
  ["symbiote", "Symbiotes", "Livin' latex, milk moss or the nestling can bond to you. Each gives you somethin' for as long as it's fed: room to hold more, more milk, an easier catch. They grow into real clothes on you (latex, moss), and they spread: latex by a touch, moss in the milk, the nestling by a breedin', to others who switched this on. Your safeword sends it away"],
  ["eager", "Traps: no cooldown", "Test subjects: no breather between traps and no wait for a trap to reset. Step off and back on and it springs again"],
  ["bench", "Use bench", "Staff and the wheel can sentence you to time strapped over the use bench, where anybody can use you. Your safeword ends it at once"],
];
// some switches only work once another is on; say so instead of lettin' a click do nothin'
const NEEDS = { freeuse: ["breedable", "Turn Breedable on first"] };
export function farmSwitches(ctx, list) {
  const sw = ctx.s.switches || {};
  return list.map(([cmd, label, desc]) => {
    const need = NEEDS[cmd];
    if (need && !sw[need[0]] && !sw[cmd]) return toggle(label, need[1] + " · " + desc, false, () => ctx.send(cmd + " on"));
    return toggle(label, desc, !!sw[cmd], () => ctx.send(cmd + " " + (sw[cmd] ? "off" : "on")));
  });
}
export function panelPrefs(ctx) {
  return card(title("This panel"), muted("Only on your computer."),
    [["chatToo", "Farm messages in chat too", "Tease lines, heat, summons and other farm messages also show in your chat log"],
     ["compact", "Compact cards", "Smaller text, more on screen"], ["chime", "Chime on notices", "A soft sound when the farm messages you"],
     ["popopen", "Open on new notice", "Pop the panel open by itself"],
     ["btnPinned", "Pin the 🌾 button", "Unpinned, you can drag it anywhere (mouse or finger). Pin it so it stays put."]].map(([k, label, desc]) =>
      toggle(label, desc, !!ctx.prefs[k], () => ctx.setPref(k, !ctx.prefs[k]))),
    toggle("Farm emotes about me come from me", "Belly kicks, milkin', breedin'… are posted as your own emote (no name in front), so the people who can see you see them and the farm girl needn't move. Only lines about you.",
      !ctx.prefs.noRelay, () => { ctx.setPref("noRelay", !ctx.prefs.noRelay); ctx.api.rehello && ctx.api.rehello(); }),
    // the farm's little cues on your own screen (cues.js); each one on unless you switch it off
    [["noLead", "Lead me instead of teleportin'", "When the farm moves you (feedin' time, the stocks, a summon), you walk there yourself, step by step"],
     ["noFace", "Farm can set my face", "Dazed when milk-drunk, flushed in heat, a trance stare… for a little while"],
     ["noSound", "Farm sounds", "The pump, the stall door, the feedin' bell. Only you hear them, at your game volume"],
     ["noTrance", "Trance haze", "A soft haze at the edges of your screen during conditioning sessions"],
     ["noFeelings", "Private feelings", "Now and then, a line only you see about what you're feelin' (your gear, your arousal, how full you are)"],
     ["noSlow", "Carryin' slows me down", "The fuller you are (a pumped belly, a late litter, a clutch of eggs), the slower you walk on the map"],
     ["noMarkers", "Map markers (staff)", "Small badges over stock on your map: M needs milkin', H in heat, B expectin', X teats capped"]].map(([k, label, desc]) =>
      toggle(label, desc, !ctx.prefs[k], () => { ctx.setPref(k, !ctx.prefs[k]); ctx.api.rehello && ctx.api.rehello(); })),
    // OFF until you turn it on: the farm touchin' your arousal meter (cues.js)
    toggle("Farm can stir me up", "Traps, toys and scenes nudge your arousal meter up, and while the farm has you denied you're held at the edge instead of cummin'. A buzzin' toy you're wearin' follows a trap too: low while it teases, high when it breeds you, still while you're denied, then back how you had it. Your safeword still stops everything.",
      !!ctx.prefs.stir, () => { ctx.setPref("stir", !ctx.prefs.stir); ctx.api.rehello && ctx.api.rehello(); }),
    // OFF until you turn it on: real items from the traps (marks.js)
    toggle("Farm can put real gear on me", "A trap that plugs, cups, clamps, chains, ropes or funnels you puts the real item on your character, and takes it off again when its time's up. Pull one off early and it goes back. Your safeword takes it all off. (The parasite doesn't need this: ?parasite on is its switch.)",
      !!ctx.prefs.gear, () => { ctx.setPref("gear", !ctx.prefs.gear); ctx.api.rehello && ctx.api.rehello(); }),
    // OFF until you turn it on: your character's own chest and hips growin' with the farm's sizes (marks.js)
    toggle("Farm can change my body shape", "Your chest grows a size on your character for every two udder sizes the farm gives you (up to the game's biggest), and your hips widen with a growin' ass or a heavy belly. Everything you're wearin' is redrawn to fit. Your own shape is remembered and comes back when the growth goes, when you switch this off, and for an hour after your safeword.",
      !!ctx.prefs.shape, () => { ctx.setPref("shape", !ctx.prefs.shape); ctx.api.rehello && ctx.api.rehello(); }),
    // these two are OFF until you turn them on, and anybody can: the farm changin' what your character looks like (marks.js)
    toggle("Farm can mark my body", "Loads leave the game's own splatters on your face, chest or tummy, wherever there's room, and farm words can be written on your body. ?wash takes them off.",
      !!ctx.prefs.marks, () => ctx.setPref("marks", !ctx.prefs.marks)),
    toggle("Farm can strip me", "When the farm says so, your clothes come off (locked pieces stay). They're kept on this computer so you can dress again.",
      !!ctx.prefs.strip, () => ctx.setPref("strip", !ctx.prefs.strip)),
    // (the scale trial and the belly experiment are gone: the drawn body does both. Laynie, Oct 14: "can also remove the
    // scaling test from earlier from the companion")
    btn("Put the button and panel back (size and full screen too)", () => ctx.resetPlaces && ctx.resetPlaces()),
    // everything above, and the drawn body, messes and memory log, kept as a file on this computer too (localsave.js)
    saveCard(ctx));
}
function saveCard(ctx) {
  const ls = localSaveState(), say = (t) => ctx.hint(t), t = (ms) => new Date(ms).toTimeString().slice(0, 5);
  const line = !ls.folder ? (ls.can ? "Not saving to a folder yet." : "This browser can't save to a folder (Chrome and Edge can). You can still load a file.")
    : ls.perm !== "granted" ? "Saving to " + ls.folder + " is paused till you reconnect it (the browser asks again after a restart)."
    : ls.err ? "Trouble saving to " + ls.folder + ": " + ls.err
    : "Saving to " + ls.folder + " every minute" + (ls.at ? ", last at " + t(ls.at) : "") + ", as " + ls.file + ".";
  return h("div", {},
    muted("Your settings as a file on this computer: everything here, your drawn body, your messes and the memory log. It survives a crash, a cleared browser or a new one. " + line),
    ls.folder && ls.perm !== "granted" ? btn("Reconnect " + ls.folder, () => localSaveReconnect(VERSION)) : null,
    ls.can ? btn(ls.folder ? "Save to a different folder" : "Save my settings to a folder…", () => localSavePick(VERSION)) : null,
    ls.folder && ls.perm === "granted" ? btn("Save now", () => localSaveNow(VERSION).then(() => say("Saved."))) : null,
    btn("Load my settings from a file…", () => { say("Pick the farmhand-companion file to load…"); localSaveLoad(say); }));
}
// The drawn body, from the outfit studio: breasts past the game's biggest, your belly, and what you wear fitted to them.
// Off until you switch it on. Everyone with the Companion sees it (drawnbody.js shares the settings with the room).
// Its own card, at the top of every Toggles tab: tucked inside "This panel" it wasn't found (Laynie, Oct 14).
// It's drawn with the farm's look, which the farm girl hands out, plus your own cup and belly; a studio of your own
// can replace the farm's look with yours.
export function drawnBodyCard(ctx) {
  const st = drawnBodyState(), say = (t) => ctx.hint(t);
  const code = h("textarea", { class: "fhc-in", rows: 2, placeholder: "…or paste the code from the studio's Copy for the Companion button" });
  return card(title("Drawn body (outfit studio)"),
    toggle("Show my drawn body", "Breasts from DD to R in your own skin, your belly, and what you wear fitted to them, on your character. Everyone here with the Companion sees it; people without it see the game's own picture of you. Off takes it away.",
      st.on, () => { drawnBodySet(!st.on, say); ctx.setPref("drawnBody", !st.on); }),
    h("div", { class: "fhc-kv", style: { marginTop: "6px" } }, muted("Cup"),
      h("select", { class: "fhc-sel", onchange: (e) => { const v = e.target.value; drawnBodyCup(v === "auto" ? "auto" : Number(v), say); ctx.setPref("drawnBodyCup", v); } },
        [h("option", { value: "auto", selected: !st.cupSet }, "Follow the farm" + (st.farmCup ? " (" + (st.cups[st.farmCup] || "?") + " now)" : ""))].concat(
          st.cups.map((c, i) => (i < 6 ? null : h("option", { value: String(i), selected: st.cupSet && i === st.cup }, c)))))),
    st.on && st.cup >= 6 && st.chest && st.chest !== "XLarge" ? muted("Your chest is set to " + st.chest + " in the wardrobe. Set it to the biggest for the drawn breasts to show.") : null,
    h("div", { class: "fhc-kv", style: { marginTop: "6px" } }, muted("Belly"),
      h("select", { class: "fhc-sel", onchange: (e) => { drawnBodyBelly(e.target.value, say); ctx.setPref("drawnBodyBelly", e.target.value); } },
        [["farm", "Follow the farm" + (st.farmBelly ? " (showing now)" : " (flat now)")], ["on", "Always"], ["off", "Never"]].concat(st.fromStudio ? [["studio", "As my studio has it"]] : [])
          .map(([v, label]) => h("option", { value: v, selected: st.bellyMode === v }, label)))),
    muted("Following the farm, your cup is the size the farm has grown your udder to, and your belly shows and grows as you fill up, carry eggs or get bred."),
    muted(st.fromStudio ? "Using your own studio settings." : st.fromFarm ? "Using the farm's look, with your own cup and belly." : "The farm's look comes from the farm girl once you're in her room; plain settings till then."),
    st.fromStudio ? btn("Use the farm's look instead", () => { drawnBodyUseFarm(say); ctx.setPref("drawnBodyAt", Date.now()); }) : null,
    h("div", { style: { marginTop: "8px" } }, muted("Got an outfit studio of your own? Bring its settings over:")),
    h("div", { style: { marginTop: "4px" } }, btn("Get my studio's settings", () => { drawnBodyFromStudio(say).then((ok) => { if (ok) ctx.setPref("drawnBodyAt", Date.now()); }); }, true)),
    muted("Works while the studio is running on this computer: it takes what you last saved there (Save the breasts, Save all the fits)."),
    h("div", { style: { marginTop: "6px" } }, code),
    btn("Put in the pasted code", () => { if (drawnBodyPaste(code.value, say)) ctx.setPref("drawnBodyAt", Date.now()); }),
    toggle("See other people's drawn bodies", "Draw other Companion users the way their studio settings say" + (st.othersHere ? " (" + st.othersHere + " here now)" : "") + ". Off: everybody else is the game's own picture on your screen.",
      st.seeOthers, () => { drawnBodySeeOthers(!st.seeOthers, say); ctx.setPref("drawnBodySee", !st.seeOthers); }));
}
// every switch the farm's add-ons offer (glory stalls, barn life, breeding week, fences…), in one place
function extraSwitches(ctx) {
  const list = [];
  for (const m of Object.values(ctx.s.mods || {})) for (const c of (m.cards || []).filter((c) => c && !c.staff)) for (const t of (c.toggles || [])) list.push([m.label, t]);
  if (!list.length) return null;
  return card(title("Farm extras"), muted("The farm's add-ons. Each one is off until you switch it on."),
    list.map(([label, t]) => toggle(String(t.label), (t.desc ? String(t.desc) + " " : "") + "(" + label + ")", !!t.on, () => ctx.send(String(t.cmd)))));
}
function toggles(ctx) {
  return [drawnBodyCard(ctx),
          card(title("Farm settings"), muted("Saved by the farm girl. Your limits still win."), farmSwitches(ctx, SWITCH_INFO)),
          extraSwitches(ctx),
          card(title("Gender"), muted("How the farm sees you. It picks your farm outfit."),
            h("div", { style: { marginTop: "6px" } }, ["female", "male", "futa", "femboy"].map((g) =>
              h("button", { type: "button", class: "fhc-pill" + (ctx.s.gender === g ? " on" : ""), onclick: () => ctx.send("gender " + g) }, g)))),
          ctx.api.hasBackup && ctx.api.hasBackup() ? card(title("Farm outfit"), muted("The farm dressed you, and your own clothes are kept on this computer."),
            btn("Change back into my own clothes", () => ctx.api.back && ctx.api.back())) : null,
          panelPrefs(ctx)];
}

export const LIVESTOCK_TABS = [
  { id: "me", label: "Me", render: me },
  { id: "safety", label: "🆘 Safety", render: safetyTab },
  { id: "milk", label: "Milking", render: milking },
  { id: "breed", label: "Breeding", render: breeding },
  { id: "traps", label: "🧪 Traps", render: traps },
  { id: "store", label: "🎀 Store", render: storeTab },
  { id: "inbox", label: "Inbox", render: inbox },
  { id: "guides", label: "Guides", render: (ctx) => guidesTab(ctx, false) },
  { id: "toggles", label: "Toggles", render: toggles },
];
