/* WHAT'S IN THIS FILE (settingspages.js)
   THE SETTINGS PAGES (Nov 4, Phase 3 of the plan; Laynie saw the mockups and said "the mock ups look alot better").
   Every switch the Companion has, on eight pages instead of one long Toggles tab:
     🐄 Farm switches · 🪞 Body and look · ⛓ Gear and marks · 💬 Messages · 🔒 Privacy and record · 📖 Guides ·
     🧰 Advanced · ℹ About
   and a "Find a setting" box that looks through all of them. They show in the game's own settings (Preferences →
   Extensions → Farmhand Companion, settings.js), or in the panel behind its ⚙ where the game has no such page.
   Nothing here changed what a switch does: they only moved.
*/
import { h, card, title, muted, btn, toggle } from "../dom.js";
import { guidesTab } from "./common.js";
import { SWITCH_INFO, farmSwitches, trapThemesCard, drawnBodyCard, extraSwitches } from "./livestock.js";
import { localSaveState, localSavePick, localSaveReconnect, localSaveNow, localSaveLoad } from "../localsave.js";
import { memlogText } from "../memlog.js";
import { VERSION } from "../version.js";
import { BOT_MEMBER } from "../config.js";
import { redrawRoom } from "../botscreen.js";
import { voice } from "./staffdata.js";
import { workCard } from "./staff.js";

// the farm switches by what they're about (the commands and words are SWITCH_INFO's, livestock.js)
const pick = (...ids) => ids.map((id) => SWITCH_INFO.find((x) => x[0] === id)).filter(Boolean);
const FARM_GROUPS = [
  ["🐂 Breedin'", ["breedable", "fertile", "futa", "mpreg", "freeuse", "naturalheat"]],
  ["🥛 Milk", ["milkable", "seedmilk", "jarok"]],
  ["🪤 Traps and play", ["traps", "eager", "bench", "potions", "dares"]],
  ["🪱 Things that latch on", ["parasite", "symbiote", "watersports"]],
];
// a switch the Companion keeps on this computer: on is on, or (flip) on unless it's been switched off
const pref = (ctx, key, label, desc, after) => toggle(label, desc, !!ctx.prefs[key], () => { ctx.setPref(key, !ctx.prefs[key]); if (after) after(); });
const prefNot = (ctx, key, label, desc) => toggle(label, desc, !ctx.prefs[key], () => { ctx.setPref(key, !ctx.prefs[key]); ctx.api.rehello && ctx.api.rehello(); });
const rehello = (ctx) => () => ctx.api.rehello && ctx.api.rehello();

function farmPage(ctx) {
  const s = ctx.s;
  if (!s.onBooks) return [card(title("🐄 Farm switches"), muted("Once you're on the books, your milkin', breedin', trap and teasin' switches show up here."),
    btn("Apply to join", () => ctx.send("apply"), true))];
  return [
    muted("Saved by the farm girl, so they follow you to any computer. Your limits still win, and your safeword stops everything."),
    FARM_GROUPS.map(([head, ids]) => card(title(head), farmSwitches(ctx, pick(...ids)))),
    trapThemesCard(ctx),
    extraSwitches(ctx),
  ];
}

function bodyPage(ctx) {
  const s = ctx.s, brandAt = { hipL: "left hip", hipR: "right hip", thighL: "left thigh", thighR: "right thigh", mons: "low belly", tummy: "tummy", chestL: "left breast", chestR: "right breast", shoulderL: "left shoulder", shoulderR: "right shoulder" };
  return [
    drawnBodyCard(ctx),
    card(title("📏 Body shape"),
      pref(ctx, "shape", "Farm can change my body shape", "Your chest grows a size on your character for every two udder sizes the farm gives you (up to the game's biggest), and your hips widen with a growin' ass or a heavy belly. Everything you're wearin' is redrawn to fit. Your own shape is remembered and comes back when the growth goes, when you switch this off, and for an hour after your safeword.", rehello(ctx))),
    s.brand ? card(title("🔥 The farm's brand"),
      toggle("Show my farm brand", "The B&B logo the farm seared on you, on your " + (brandAt[s.brand.place] || "hip") + ". Off hides it on every screen (it's still on your record).",
        !ctx.prefs.brandOff, () => { ctx.setPref("brandOff", !ctx.prefs.brandOff); ctx.api.brandSync && ctx.api.brandSync(); })) : null,
    s.onBooks ? card(title("🐾 Your animal"), muted("How the farm sees you. It picks your farm outfit."),
      h("div", { style: { marginTop: "6px" } }, ["female", "male", "futa", "femboy", "nonbinary"].map((g) =>
        h("button", { type: "button", class: "fhc-pill" + (s.gender === g ? " on" : ""), onclick: () => ctx.send("gender " + g) }, g))),
      farmSwitches(ctx, pick("ownoutfit"))) : null,
    card(title("👗 Farm outfit"), muted("Dress me puts back on the outfit your record calls for (your species and gender, or your uniform while you're clocked in), in case it's come off or been changed."),
      btn("Dress me", () => ctx.send("dressme"), true),
      ctx.api.hasBackup && ctx.api.hasBackup() ? h("div", null, muted("Your own clothes are kept on this computer."), btn("Change back into my own clothes", () => ctx.api.back && ctx.api.back())) : null),
  ];
}

function gearPage(ctx) {
  return [
    card(title("⛓ On your character"), muted("All of these are off until you switch them on. Your safeword takes everything off."),
      pref(ctx, "gear", "Farm can put real gear on me", "A trap that plugs, cups, clamps, chains, ropes or funnels you puts the real item on your character, and takes it off again when its time's up. Pull one off early and it goes back. Your safeword takes it all off. (The parasite doesn't need this: ?parasite on is its switch.)", rehello(ctx)),
      pref(ctx, "marks", "Farm can mark my body", "Loads leave the game's own splatters on your face, chest or tummy, wherever there's room, and farm words can be written on your body. ?wash takes them off."),
      pref(ctx, "strip", "Farm can strip me", "When the farm says so, your clothes come off (locked pieces stay). They're kept on this computer so you can dress again."),
      pref(ctx, "stir", "Farm can stir me up", "Traps, toys and scenes nudge your arousal meter up, and while the farm has you denied you're held at the edge instead of cummin'. A buzzin' toy you're wearin' follows a trap too: low while it teases, high when it breeds you, still while you're denied, then back how you had it. Your safeword still stops everything.", rehello(ctx))),
    // the farm's little cues on your own screen (cues.js); each one on unless you switch it off
    card(title("✨ On your screen"), muted("Only you see and hear these. Each is on unless you switch it off."),
      prefNot(ctx, "noLead", "Lead me instead of teleportin'", "When the farm moves you (feedin' time, the stocks, a summon), you walk there yourself, step by step"),
      prefNot(ctx, "noFace", "Farm can set my face", "Dazed when milk-drunk, flushed in heat, a trance stare… for a little while"),
      prefNot(ctx, "noSound", "Farm sounds", "The pump, the stall door, the feedin' bell. Only you hear them, at your game volume"),
      prefNot(ctx, "noTrance", "Trance haze", "A soft haze at the edges of your screen during conditioning sessions"),
      prefNot(ctx, "noSlow", "Carryin' slows me down", "The fuller you are (a pumped belly, a late litter, a clutch of eggs), the slower you walk on the map"),
      ctx.s.staff ? prefNot(ctx, "noMarkers", "Map markers (staff)", "Small badges over stock on your map: M needs milkin', H in heat, B expectin', X teats capped") : null),
  ];
}

function messagesPage(ctx) {
  const s = ctx.s;
  return [
    card(title("💬 Where the farm talks to you"),
      pref(ctx, "chatToo", "Farm messages in chat too", "Tease lines, heat, summons and other farm messages also show in your chat log, not just the panel"),
      pref(ctx, "chime", "Chime on notices", "A soft sound when the farm messages you"),
      pref(ctx, "popopen", "Open on new notice", "Pop the panel open by itself. Off: just the red number on 🌾"),
      toggle("Farm emotes about me come from me", "Belly kicks, milkin', breedin'… are posted as your own emote (no name in front), so the people who can see you see them and the farm girl needn't move. Only lines about you.",
        !ctx.prefs.noRelay, () => { ctx.setPref("noRelay", !ctx.prefs.noRelay); ctx.api.rehello && ctx.api.rehello(); }),
      prefNot(ctx, "noFeelings", "Private feelings", "Now and then, a line only you see about what you're feelin' (your gear, your arousal, how full you are)")),
    s.onBooks ? card(title("🗣 What the farm says"), muted("Saved by the farm girl."), farmSwitches(ctx, pick("teaseme", "hypno", "praise", "degrade"))) : null,
    s.intensity ? card(title("🌶 How the farm talks to you"),
      h("div", null, [["tender", "Tender"], ["rough", "Rough"], ["filthy", "Filthy"]].map(([id, label]) =>
        h("button", { type: "button", class: "fhc-pill" + (s.intensity === id ? " on" : ""), onclick: () => ctx.send("intensity " + id) }, label))),
      muted(s.intensity === "tender" ? "Softer words, and the traps lean mild." : s.intensity === "filthy" ? "Dirtier words, and the traps lean brutal." : "As written."),
      muted("It calls you: " + (((s.words || {}).call || []).join(", ") || "whatever comes to mind") + " · never: " + (((s.words || {}).never || []).join(", ") || "nothin' ruled out")),
      h("div", null, btn("Names I love…", () => ctx.fillBox("callme ")), btn("Never call me…", () => ctx.fillBox("nevercall ")))) : null,
  ];
}

function privacyPage(ctx) {
  const s = ctx.s;
  return [
    card(title("🔒 Privacy and record"),
      // the record (chatlog.js): off unless they switch it on. Laynie, Nov 4, the exact words: "It only should say 'This option
      // sends a copy of what the companion recieves and sends for bug squashing. Completely voluntary participation.'"
      s.logMust ? muted("📜 As a proprietor, your Companion always sends its record. There's no switch for it.")
        : toggle("Send a record of what I see", "This option sends a copy of what the companion receives and sends for bug squashing. Completely voluntary participation.",
          !!ctx.prefs.chatlog, () => ctx.setPref("chatlog", !ctx.prefs.chatlog)),
      s.onBooks ? farmSwitches(ctx, pick("tally")) : null),
    saveCard(ctx),
  ];
}

// everything on these pages, the drawn body, messes and memory log, kept as a file on this computer too (localsave.js)
function saveCard(ctx) {
  const ls = localSaveState(), say = (t) => ctx.hint(t), t = (ms) => new Date(ms).toTimeString().slice(0, 5);
  const line = !ls.folder ? (ls.can ? "Not saving to a folder yet." : "This browser can't save to a folder (Chrome and Edge can). You can still load a file.")
    : ls.perm !== "granted" ? "Saving to " + ls.folder + " is paused till you reconnect it (the browser asks again after a restart)."
    : ls.err ? "Trouble saving to " + ls.folder + ": " + ls.err
    : "Saving to " + ls.folder + " every minute" + (ls.at ? ", last at " + t(ls.at) : "") + ", as " + ls.file + ".";
  return card(title("💾 Your settings file"),
    muted("Your settings as a file on this computer: everything on these pages, your drawn body, your messes and the memory log. It survives a crash, a cleared browser or a new one. " + line),
    h("div", { style: { marginTop: "6px" } },
      ls.folder && ls.perm !== "granted" ? btn("Reconnect " + ls.folder, () => localSaveReconnect(VERSION)) : null,
      ls.can ? btn(ls.folder ? "Save to a different folder" : "Save my settings to a folder…", () => localSavePick(VERSION)) : null,
      ls.folder && ls.perm === "granted" ? btn("Save now", () => localSaveNow(VERSION).then(() => say("Saved."))) : null,
      btn("Load my settings from a file…", () => { say("Pick the farmhand-companion file to load…"); localSaveLoad(say); })));
}

function advancedPage(ctx) {
  // the farm girl's own account: her screen draws nobody unless somebody at her keyboard wants to watch (botscreen.js)
  const bot = window.Player && window.Player.MemberNumber === BOT_MEMBER;
  return [
    card(title("🧰 This panel"), muted("Only on this computer."),
      bot ? toggle("Draw the room on the farm girl's screen", "Off (the default), this tab doesn't draw anybody in the room: no pictures downloaded for what people wear, far less work and memory on this computer. The farm runs the same either way. Switch it on to watch the room or click on people from here.",
        !!ctx.prefs.drawRoom, () => { const on = !ctx.prefs.drawRoom; ctx.setPref("drawRoom", on); if (on) setTimeout(redrawRoom, 50); }) : null,
      pref(ctx, "compact", "Compact cards", "Smaller text, more on screen"),
      pref(ctx, "btnPinned", "Pin the 🌾 button", "Unpinned, you can drag it anywhere (mouse or finger). Pin it so it stays put."),
      h("div", { style: { marginTop: "6px" } }, btn("Put the button and panel back (size and full screen too)", () => ctx.resetPlaces && ctx.resetPlaces()))),
    card(title("🧠 Memory log"), muted("For chasing a page that runs out of room: how big things were, every half minute, for the last hour. /farmmem in chat shows it too."),
      h("pre", { style: { whiteSpace: "pre-wrap", fontSize: "11px", maxHeight: "300px", overflowY: "auto" } }, memlogText(12) || "Nothing yet.")),
  ];
}

function aboutPage(ctx) {
  const p = ctx.prefs;
  return [card(title("🌾 Farmhand Companion v" + VERSION),
    muted("The B&B Farm's helper: the 🌾 panel, the drawn body, the farm's messes and gear on you, and your switches. It only talks to the farm girl."),
    toggle("Farmhand Companion on", "Switched off, the Companion stays quiet after your next reload: no panel, no drawn body, no messes or farm gear on you, nothing sent to the farm. The game's settings page stays, so you can switch it back on.",
      !p.off, () => ctx.setPref("off", !p.off)),
    p.off ? h("div", { style: { marginTop: "6px" } }, btn("Reload now", () => window.location.reload(), true)) : null)];
}

export const SETTINGS_PAGES = [
  { id: "switches", label: "🐄 Farm switches", render: farmPage },
  { id: "body", label: "🪞 Body and look", render: bodyPage },
  { id: "gear", label: "⛓ Gear and marks", render: gearPage },
  { id: "messages", label: "💬 Messages", render: messagesPage },
  { id: "privacy", label: "🔒 Privacy and record", render: privacyPage },
  // staff only: on call and the ECHS card (Staff panel tabs till Nov 4). Zones stayed on the Staff panel: drawin' one
  // needs the map in view, and the game's settings screen covers it.
  { id: "staff", label: "🧑‍🌾 Staff tools", show: (ctx) => !!ctx.s.staff, render: (ctx) => [workCard(ctx), voice()] },
  { id: "guides", label: "📖 Guides", render: (ctx) => guidesTab(ctx, !!ctx.s.staff) },
  { id: "advanced", label: "🧰 Advanced", render: advancedPage },
  { id: "about", label: "ℹ About", render: aboutPage },
];
const pagesFor = (ctx) => SETTINGS_PAGES.filter((p) => !p.show || p.show(ctx));

// one page drawn safely: a page that breaks says so, and the rest still work
const drawPage = (p, ctx) => { try { return p.render(ctx); } catch (e) { console.warn("[Farmhand Companion]", e); return card(title(p.label), muted("This page hit a snag. The others still work.")); } };

// "Find a setting": every switch on every page whose words have it, with the page it's on
function findResults(ctx, q) {
  const out = [], want = q.trim().toLowerCase();
  for (const p of pagesFor(ctx)) {
    if (p.id === "guides") continue;   // (the guides have their own search)
    const box = h("div", null, drawPage(p, ctx));
    const hits = [...box.querySelectorAll(".fhc-tog")].filter((t) => t.textContent.toLowerCase().includes(want));
    if (hits.length) out.push(card(title(p.label), hits));
  }
  return out.length ? out : [muted("Nothin' matches \"" + q.trim() + "\". Try fewer letters, or look through the pages.")];
}

// the whole thing: the search box, the list of pages, and the page they're on. page/setPage: which one (kept by the caller)
export function settingsView(ctx, page, setPage) {
  const pages = pagesFor(ctx), cur = pages.find((p) => p.id === page) || pages[0];
  const results = h("div", { class: "fhc-set-body" });
  const find = ctx.ui.setFind || "";
  const fill = (q) => results.replaceChildren(...[].concat(q.trim() ? findResults(ctx, q) : drawPage(cur, ctx)).flat(Infinity).filter(Boolean));
  fill(find);
  // typin' redraws only the results, so the box keeps the focus and the phone keyboard stays up
  const input = h("input", { class: "fhc-in", type: "search", placeholder: "Find a setting…", "aria-label": "Find a setting", value: find, style: { width: "100%" },
    oninput: (e) => { ctx.setUi({ setFind: e.target.value }, true); fill(e.target.value); } });
  return h("div", null,
    h("div", { style: { margin: "0 0 10px" } }, input),
    h("div", { class: "fhc-set" },
      h("nav", { class: "fhc-set-nav", "aria-label": "Settings pages" }, pages.map((p) =>
        h("button", { type: "button", class: p === cur && !find.trim() ? "on" : "", onclick: () => { ctx.setUi({ setFind: "" }, true); setPage(p.id); } }, p.label))),
      results));
}
