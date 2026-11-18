/* WHAT'S IN THIS FILE (page.js)
   THE DISPENSARY'S PAGE: Preferences → Extensions → The Farmhand's Dispensary (/dispensary opens it too).
   What's in you now, the safeword, who can dose you, the clock, and each dose's own switch.
*/
import { h } from "../../extension/src/dom.js";
import { LADDER, PROPRIETORS } from "./config.js";
import { VERSION } from "./version.js";
import { st, save } from "./store.js";
import { BOOK, doseIds, active, leftMs, setClock, TENDER_SPOTS, TENDER_DEFAULT, TOLERANCE_HOURS, partOf } from "./doses.js";
import { LATER_MAX, FUSE_MINS, CRAVE_AFTER, CRAVE_DAYS } from "./later.js";
import { KINDS, kindIds, mine as paraIn, letGo } from "./parasites.js";
import { DRIP_MINS, INJECT_EVERY, PAUSE_MINS } from "./worn.js";
import { ladderWho } from "./ladder.js";
import { lscgPresent, lscgApi } from "./lscg.js";
import { safeword } from "./safeword.js";
import { ANIMALS } from "../../shared/noises.js";
import { hardOn, keyholders, lock, dueAt, hardLog, wards, keyDo, wardState, CHECK_DAYS, addKey, removeKey } from "./hardcore.js";

const W = window, ID = "FarmhandDispensary";
let box = null, note = "";

const CSS = `
#fd-page{position:fixed;left:50%;top:3%;transform:translateX(-50%);width:min(760px,96vw);max-height:94vh;max-height:94dvh;overflow-y:auto;overflow-x:hidden;
  -webkit-overflow-scrolling:touch;z-index:2147483000;padding:14px 18px;box-sizing:border-box;background:#211a24;color:#ecdfe8;border:2px solid #b78ac8;
  border-radius:12px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 6px 30px #000a}
@media (max-width:700px),(pointer:coarse) and (max-width:1000px){#fd-page{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;max-height:none;border-radius:0;border-width:0;padding:10px 12px}}
#fd-page h2{margin:0;flex:1;font-family:Bitter,Georgia,serif;color:#d9b3e6}
#fd-page h3{margin:16px 0 6px;font-size:15px;color:#d9b3e6}
#fd-page .fd-card{background:#2b2230;border:1px solid #4a3a52;border-radius:8px;padding:10px 12px;margin:6px 0}
#fd-page .fd-muted{color:#b3a2b8;font-size:12.5px}
#fd-page .fd-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#fd-page button{font:inherit;cursor:pointer;border-radius:7px;border:1px solid #8e6aa0;background:#3a2c42;color:#ecdfe8;padding:5px 12px;min-height:32px}
#fd-page button.fd-safe{background:#6e2330;border-color:#c06070;font-weight:700}
#fd-page select{font:inherit;max-width:100%;padding:4px 6px;border-radius:6px;background:#1b151e;color:#ecdfe8;border:1px solid #6e5a78}
#fd-page label{display:flex;align-items:center;gap:8px;cursor:pointer}
#fd-page .fd-note{color:#e6c37a;margin:6px 0}
@media (pointer:coarse){#fd-page select,#fd-page input{font-size:16px}#fd-page button{min-height:40px}}
`;
function styles() {
  if (W.document.getElementById("fd-style")) return;
  const s = W.document.createElement("style"); s.id = "fd-style"; s.textContent = CSS; W.document.head.appendChild(s);
}

const clockTip = (mode) => {
  const p = st().penalty;
  return mode === "real"
    ? "Real time: your timers keep running while you're logged off. To make up for it, every timer runs " + p + "% longer, so a 2-hour dose lasts " + (2 * (1 + p / 100)).toFixed(1).replace(/\.0$/, "") + " hours."
    : "While online: your timers only count down while you're logged in. A 2-hour dose is 2 hours of you being here.";
};
// Fill-Out's part, Tender's spot, in the list of what's in you
const partLabel = (id) => (id === "fillout" ? " (" + ({ cup: "tits", belly: "belly", ass: "ass" }[partOf(id)] || "tits") + ")" : id === "tender" ? " (" + TENDER_SPOTS[partOf(id)].word + ")" : "");
export function timeLeft(ms) {
  const m = Math.ceil(ms / 60000);
  return m >= 120 ? Math.floor(m / 60) + " h " + (m % 60 ? (m % 60) + " min" : "") : m >= 60 ? "1 h " + (m - 60 ? (m - 60) + " min" : "") : m + " min";
}

// ── hardcore, on the page (step 2) ─────────────────────────
const DAY_MS = 86400000;
const dateOf = (t) => { try { return new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" }); } catch (e) { return ""; } };
const inDays = (t) => { const d = Math.ceil((t - Date.now()) / DAY_MS); return d <= 0 ? "today" : d === 1 ? "tomorrow" : "in " + d + " days (" + dateOf(t) + ")"; };
const keyName = (mn) => { const P = W.Player || {}; const own = P.Ownership && P.Ownership.MemberNumber === mn; const c = (W.ChatRoomCharacter || []).find((x) => x && x.MemberNumber === mn); return (c ? (c.Nickname || c.Name) : "#" + mn) + (own ? " (your owner)" : PROPRIETORS.includes(mn) ? " (proprietor)" : ""); };
let endPick = "7";
function hardWarning(days, keys) {
  return "Hardcore. Until it ends, you can't change your Dispensary settings, and your safeword won't lift your doses: it asks your keyholders (" +
    keys.map(keyName).join(", ") + ") to let you out instead.\n\nIt ends " + (days ? "in " + days + " day" + (days === 1 ? "" : "s") : "when a keyholder ends it, or after " + CHECK_DAYS + " days with no keyholder checkin' in (bein' in a room with you counts)") +
    ". Your keyholders can change your settings, let you out, or end it whenever they like.\n\nLock yourself in?";
}
// keyholders: your owner, the proprietors for farm stock, and anybody you add by member number
let keyInput = "";
const WHY_NOT = { number: "That isn't a member number.", self: "You can't hold your own key.", already: "They already hold your key.", full: "That's ten keyholders: remove one first.", locked: "Not while you're locked in." };
function keyholdersCard() {
  const S = st(), locked = hardOn(), P = W.Player || {}, own = P.Ownership && P.Ownership.MemberNumber, rows = [];
  if (typeof own === "number" && own > 0) rows.push(h("div", null, "🗝️ " + keyName(own) + ": always, as your owner"));
  if (S.stock) rows.push(h("div", null, "🗝️ " + PROPRIETORS.map(keyName).join(" and ") + ": you're on the farm's books"));
  for (const mn of S.keys || []) rows.push(h("div", { class: "fd-row" }, "🗝️ " + keyName(mn), locked ? null : h("button", { onclick: () => { removeKey(mn); note = ""; draw(); } }, "Remove")));
  if (!rows.length) rows.push(h("div", { class: "fd-muted" }, "Nobody yet."));
  const input = h("input", { type: "text", inputmode: "numeric", placeholder: "Member number", "aria-label": "Add a keyholder by member number", value: keyInput,
    style: { width: "11em", padding: "4px 6px", borderRadius: "6px", background: "#1b151e", color: "#ecdfe8", border: "1px solid #6e5a78" }, oninput: (e) => { keyInput = e.target.value; } });
  return [h("h3", null, "Keyholders"), h("div", { class: "fd-card" }, rows,
    locked ? h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Locked in with you till hardcore's over.")
      : h("div", { class: "fd-row", style: { marginTop: "8px" } }, input,
        h("button", { onclick: () => { const n = Number(String(keyInput).trim()), r = addKey(n); note = r.ok ? "🗝️ " + keyName(n) + " holds your key now." : (WHY_NOT[r.why] || "Couldn't add them."); if (r.ok) keyInput = ""; draw(); } }, "Add")),
    h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Keyholders can let you out of hardcore, change your settings while you're locked in, or end it. Your limits stay yours: nobody changes them while you're locked in, not even them."))];
}
function hardCard() {
  const out = [h("h3", null, "Hardcore")];
  const keys = keyholders();
  if (!hardOn()) {
    const endSel = h("select", { "aria-label": "When hardcore ends", onchange: (e) => { endPick = e.target.value; } },
      [["1", "1 day"], ["3", "3 days"], ["7", "7 days"], ["14", "14 days"], ["30", "30 days"], ["0", "No end date (a keyholder checks in every " + CHECK_DAYS + " days)"]]
        .map(([v, t]) => h("option", { value: v, selected: v === endPick ? true : undefined }, t)));
    out.push(h("div", { class: "fd-card" },
      h("div", { class: "fd-muted" }, "Lock yourself in. Your settings are your keyholders' to change, and your safeword asks them to let you out instead of liftin' your doses. Only you can switch it on."),
      h("div", { style: { margin: "6px 0" } }, keys.length ? "Your keyholders: " + keys.map(keyName).join(", ") + "." : "You've no keyholder yet: add one above by member number, or have an owner, or be on the farm's books (the proprietors hold the key for farm stock)."),
      h("div", { class: "fd-row" }, endSel,
        h("button", { disabled: keys.length ? undefined : true, onclick: () => {
          const days = Number(endPick) || 0;
          if (typeof W.confirm === "function" && !W.confirm(hardWarning(days, keys))) return;
          const r = lock(days); note = r.ok ? "🔒 Locked in." : "Couldn't lock in: " + (r.why === "nokey" ? "you've no keyholder." : r.why); draw();
        } }, "🔒 Lock me in"))));
    return out;
  }
  const H = st().hard;
  out.push(h("div", { class: "fd-card" },
    h("div", null, "🔒 Locked in since " + dateOf(H.since) + ". " + (H.until ? "It ends " + inDays(H.until) + "." : "No end date: it lets go " + inDays(dueAt()) + " unless a keyholder checks in before then.")),
    h("div", { class: "fd-muted" }, "Your keyholders: " + keys.map(keyName).join(", ") + ". They can change your settings, let you out, or end it."),
    hardLog().slice(-5).reverse().map((l) => h("div", { class: "fd-muted" }, dateOf(l.t) + " · " + (l.by === (W.Player && W.Player.MemberNumber) ? "you" : l.by ? keyName(l.by) : "the clock") + ": " + l.what))));
  return out;
}
let editing = null;   // { mn, who, clock, off }
function keysCard() {
  const list = Object.entries(wards());
  if (!list.length) return [];
  const out = [h("h3", null, "Keys you hold")];
  for (const [k, x] of list) {
    const mn = Number(k), inRoom = (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn), name = (x.name || "#" + mn) + " (" + mn + ")";
    const go = (what, data) => { const how = keyDo(mn, what, data); note = how ? "🗝️ Sent " + (how === "room" ? "in the room" : "by beep") + "." : "Couldn't reach " + name + " just now."; draw(); };
    const kids = [
      h("div", null, "🗝️ " + name + ": " + (x.until ? "ends " + inDays(x.until) : "lets go " + inDays(x.due) + " without a check-in") + (x.asked && Date.now() - x.asked < DAY_MS ? " · askin' to be let out" : "")),
      h("div", { class: "fd-row", style: { marginTop: "6px" } },
        h("button", { onclick: () => go("check") }, "Check in"),
        h("button", { onclick: () => go("letout") }, "Let out (lift every dose)"),
        h("button", { onclick: () => { if (typeof W.confirm !== "function" || W.confirm("End " + name + "'s hardcore?")) go("end"); } }, "End hardcore"),
        inRoom ? h("button", { onclick: () => { editing = { mn }; keyDo(mn, "state"); draw(); } }, "Their settings") : null),
    ];
    const ws = editing && editing.mn === mn ? wardState(mn) : null;
    if (editing && editing.mn === mn) {
      if (!ws) kids.push(h("div", { class: "fd-muted" }, "Askin' their Dispensary..."));
      else {
        editing.who = editing.who || ws.who; editing.clock = editing.clock || ws.clock; editing.off = editing.off || Object.assign({}, ws.off);
        if (ws.companion && !editing.comp) editing.comp = Object.fromEntries(Object.entries(ws.companion).map(([k2, v]) => [k2, !!(v && v.on)]));
        kids.push(h("div", { class: "fd-card" },
          h("div", { class: "fd-muted" }, (ws.doses || []).length ? "In them now: " + ws.doses.map((d) => (BOOK[d.id] ? BOOK[d.id].label : d.id) + " (" + timeLeft(d.left) + ")").join(", ") : "No doses in them."),
          h("select", { "aria-label": "Who can dose them", onchange: (e) => { editing.who = e.target.value; } }, LADDER.map((r) => h("option", { value: r.id, selected: r.id === editing.who ? true : undefined }, r.label))),
          h("div", { class: "fd-row", style: { gap: "14px", margin: "6px 0" } },
            ["online", "real"].map((c) => h("label", null, h("input", { type: "radio", name: "fd-ward-clock", checked: editing.clock === c ? true : undefined, onchange: () => { editing.clock = c; } }), c === "real" ? "Real time" : "While online"))),
          doseIds().map((id) => h("label", null, h("input", { type: "checkbox", checked: !editing.off[id] ? true : undefined, onchange: (e) => { editing.off[id] = !e.target.checked; } }), BOOK[id].label)),
          ws.companion ? [h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Their Companion:"),
            Object.entries(ws.companion).map(([k2, v]) => h("label", null, h("input", { type: "checkbox", checked: editing.comp[k2] ? true : undefined, onchange: (e) => { editing.comp[k2] = e.target.checked; } }), (v && v.label) || k2))] : null,
          h("div", { class: "fd-row", style: { marginTop: "6px" } },
            h("button", { onclick: () => { const off = {}; for (const id of doseIds()) off[id] = !!editing.off[id]; const e2 = editing; editing = null; go("set", Object.assign({ who: e2.who, clock: e2.clock, off }, e2.comp ? { companion: e2.comp } : {})); } }, "Save their settings"),
            h("button", { onclick: () => { editing = null; draw(); } }, "Close"))));
      }
    }
    out.push(h("div", { class: "fd-card" }, kids));
  }
  return out;
}

function view() {
  const S = st(), now = doseIds().filter(active), locked = hardOn() ? true : undefined;
  const kids = [];
  kids.push(h("div", { class: "fd-row", style: { marginBottom: "6px" } },
    h("h2", null, "💉 The Farmhand's Dispensary"),
    h("button", { onclick: () => { if (typeof W.PreferenceSubscreenExtensionsClear === "function") W.PreferenceSubscreenExtensionsClear(); else close(); } }, "Back")));
  if (note) kids.push(h("div", { class: "fd-note" }, note));
  if (locked) kids.push(h("div", { class: "fd-card fd-note" }, "🔒 Hardcore: your keyholders hold these settings. You can look, but only they can change them."));

  // in you now, and the way out
  kids.push(h("h3", null, "In you now"));
  kids.push(h("div", { class: "fd-card" },
    now.length ? now.map((id) => h("div", null, BOOK[id].icon + " " + BOOK[id].label + (st().doses[id].x > 1 ? " ×" + st().doses[id].x : "") + partLabel(id) + ": " + timeLeft(leftMs(id)) + " left" + (S.clock === "online" ? " of your time here" : ""))) : h("div", { class: "fd-muted" }, "Nothin'. You're clear."),
    S.later.length ? h("div", null, "💊 " + (S.later.length === 1 ? "A time-release capsule's" : S.later.length + " time-release capsules are") + " waitin' in you. You won't know when.") : null,
    h("div", { class: "fd-row", style: { marginTop: "8px" } },
      locked
        ? h("button", { class: "fd-safe", onclick: () => { safeword("page"); note = "🗝️ Your keyholders have been asked to let you out."; draw(); } }, "🗝️ Ask to be let out")
        : h("button", { class: "fd-safe", onclick: () => { safeword("page"); note = "Safeword: every dose lifted."; draw(); } }, "🔴 Safeword: lift every dose"),
      h("span", { class: "fd-muted" }, locked ? "Hardcore: your safeword asks your keyholders to let you out. Your doses stay till one of them does."
        : "The game's own safeword does it too, and so does /dispensary safeword."))));

  // who can dose you
  kids.push(h("h3", null, "Who can dose you"));
  const sel = h("select", { "aria-label": "Who can dose you", disabled: locked, onchange: (e) => { st().who = e.target.value; save(); note = ""; draw(); } },
    LADDER.map((r) => h("option", { value: r.id, selected: r.id === S.who ? true : undefined }, r.label)));
  kids.push(h("div", { class: "fd-card" }, sel, h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Right now: " + ladderWho() + ". You can always dose yourself.")));

  // the clock
  kids.push(h("h3", null, "The clock"));
  const radio = (mode, label) => h("label", { title: clockTip(mode) },
    h("input", { type: "radio", name: "fd-clock", disabled: locked, checked: S.clock === mode ? true : undefined, onchange: () => { setClock(mode); draw(); } }), label);
  kids.push(h("div", { class: "fd-card" },
    h("div", { class: "fd-row", style: { gap: "18px" } }, radio("online", "While online"), radio("real", "Real time (+" + S.penalty + "%)")),
    h("div", { class: "fd-muted", style: { marginTop: "4px" } }, clockTip(S.clock))));

  // what you see, and your animal
  kids.push(h("h3", null, "Touches"));
  kids.push(h("div", { class: "fd-card" },
    h("label", null, h("input", { type: "checkbox", checked: S.screen !== false ? true : undefined, onchange: (e) => { st().screen = e.target.checked; save(); draw(); } }), h("b", null, "Screen touches")),
    h("div", { class: "fd-muted" }, "A dose you can see at the edges of your own screen: the Sedative dims it, Denial Serum pulses pink near the top, Heat hazes it warm, Needy Nectar flushes it, Rut reddens it, the Airhead Elixir goes soft and pink. Only you see them. With reduce motion set on your computer, they hold still."),
    h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", checked: S.iconsShow !== false ? true : undefined, onchange: (e) => { st().iconsShow = e.target.checked; save(); draw(); } }), h("b", null, "Dose icons by people")),
    h("label", null, h("input", { type: "checkbox", checked: S.iconsShare !== false ? true : undefined, onchange: (e) => { st().iconsShare = e.target.checked; save(); draw(); } }), h("b", null, "Let others see mine")),
    h("div", { class: "fd-muted" }, "A small row of icons by anybody with doses in them (each dose's own icon), the way the game shows a friend. Only people with the Dispensary see them, and only if they let them show."),
    h("div", { class: "fd-row", style: { marginTop: "8px" } },
      h("span", null, "Your animal, for Moo Juice:"),
      h("select", { "aria-label": "Your animal", onchange: (e) => { st().species = e.target.value; save(); draw(); } },
        [h("option", { value: "", selected: !S.species ? true : undefined }, S.speciesFarm ? "The farm's word (" + S.speciesFarm + ")" : "Cow, till the farm says")]
          .concat(ANIMALS.map((a) => h("option", { value: a, selected: S.species === a ? true : undefined }, a)))))));

  // the doses
  kids.push(h("h3", null, "Doses"));
  const lscg = lscgPresent();
  for (const id of doseIds()) {
    const B = BOOK[id], theirs = B.lscg && lscg;
    kids.push(h("div", { class: "fd-card" },
      h("label", null,
        h("input", { type: "checkbox", checked: !S.off[id] ? true : undefined, disabled: theirs || locked ? true : undefined,
          onchange: (e) => { if (e.target.checked) delete st().off[id]; else st().off[id] = true; save(); draw(); } }),
        h("b", null, B.icon + " " + B.label)),
      h("div", { class: "fd-muted" }, B.desc),
      h("div", { class: "fd-muted" }, "Words on a crafted item: " + B.keywords.join(", ") + ". Add x2 to x5 for a stronger dose."),
      theirs ? h("div", { class: "fd-note" }, "LSCG is loaded, so this one is LSCG's own: LSCG's settings decide.") : null,
      B.lscgOnly && !lscg ? h("div", { class: "fd-muted" }, "Needs LSCG.") : null));
  }
  // the extras (Nov 17): where Tender goes, time-release capsules, tolerance, cravings
  kids.push(h("h3", null, "How doses take you"));
  kids.push(h("div", { class: "fd-card" },
    h("div", { class: "fd-row" }, h("span", null, "🌸 Where Tender goes when the bottle doesn't say:"),
      h("select", { "aria-label": "Where Tender goes", disabled: locked, onchange: (e) => { st().tenderSpot = e.target.value; save(); draw(); } },
        Object.entries(TENDER_SPOTS).map(([k, s2]) => h("option", { value: k, selected: (S.tenderSpot || TENDER_DEFAULT) === k ? true : undefined }, s2.word)))),
    h("div", { class: "fd-muted", style: { marginTop: "8px" } }, "💊 A needle that also says time-release, slow-release, delayed or capsule doesn't hit at once: it goes off somewhere between " + FUSE_MINS[0] + " and " + FUSE_MINS[1] + " minutes later, at a moment nobody knows. Up to " + LATER_MAX + " can wait in you; your safeword clears them."),
    h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.tolerance ? true : undefined, onchange: (e) => { st().tolerance = e.target.checked; save(); draw(); } }), h("b", null, "Tolerance")),
    h("div", { class: "fd-muted" }, "The same dose again within " + TOLERANCE_HOURS + " hours takes a fifth less for each one before it, down to two fifths. You're told when it does."),
    h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.cravings ? true : undefined, onchange: (e) => { st().cravings = e.target.checked ? Date.now() : 0; save(); draw(); } }), h("b", null, "Cravings")),
    h("div", { class: "fd-muted" }, "Once you've had " + CRAVE_AFTER + " doses in " + CRAVE_DAYS + " days, now and then, while nothin's in you, you want another (a note only you see). On the farm the farm girl notices, and offers: say ?fix and she sees to it. Only doses from here on count.")));
  // gear that doses (Nov 18, worn.js)
  kids.push(h("h3", null, "Gear, drinks and kisses"));
  kids.push(h("div", { class: "fd-card fd-muted" },
    h("div", null, "Crafted gear you wear doses you when its words say a dose and how:"),
    h("div", null, "• drip, IV, laced, coated or soaked: keeps it in you while it's on (" + DRIP_MINS + " minutes' worth, topped up)"),
    h("div", null, "• injector, auto-inject, dosing or pump: a dose every " + INJECT_EVERY + " minutes (\"every 10 minutes\" sets its own)"),
    h("div", null, "• on climax, when kissed, when touched, when spanked: a dose each time"),
    h("div", null, "• roulette or mystery dose: a different one of the doses you allow, each time"),
    h("div", null, "• a drink or a treat somebody feeds you (Sip, Eat), and lip gloss or lipstick with a dose in it, on a kiss"),
    h("div", { style: { marginTop: "4px" } }, "Whoever crafted it has to be on your list. Your safeword clears what's in you and rests your gear " + PAUSE_MINS + " minutes.")));
  // crafted parasites (Nov 18, parasites.js): each kind yours to switch on
  kids.push(h("h3", null, "Parasites"));
  const inMe = paraIn();
  kids.push(h("div", { class: "fd-card" },
    h("div", { class: "fd-muted" }, "Crafted parasites, anywhere: put on you in a crafted item that names them, by somebody on your list. Each kind only takes if you switch it on. Your safeword takes them off."),
    kindIds().map((k) => { const K = KINDS[k], p = inMe[k]; return h("label", { style: { marginTop: "4px" } },
      h("input", { type: "checkbox", disabled: locked, checked: S.parasites && S.parasites[k] ? true : undefined, onchange: (e) => { const P = st().parasites || (st().parasites = {}); if (e.target.checked) P[k] = true; else { delete P[k]; letGo(k, "quiet"); } save(); draw(); } }),
      h("span", null, K.icon + " " + K.label + (p ? " · in you" + (p.until ? ", " + timeLeft(Math.max(0, p.until - Date.now())) + " left" : "") + (p.name ? " (" + p.name + "'s)" : "") : ""))); }),
    h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.mouthAuto ? true : undefined, onchange: (e) => { st().mouthAuto = e.target.checked; save(); draw(); } }),
      h("span", null, "The mouthpiece's words go straight out, without askin' me first")),
    h("div", { class: "fd-muted" }, "What each does: parasite lips feed you their crafter's strain and spread by a kiss; livin' latex drinks your climaxes; milk moss keeps you leakin'; the nestling grows your belly every time you cum; the brood mother lays little ones you pass on by a kiss; the leash vine keeps you near its crafter on a map; the mouthpiece lets its crafter put words in your mouth (/dispensary say, or nope).")));
  if (lscg) {
    kids.push(h("div", { class: "fd-card fd-muted" }, lscgApi()
      ? "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's. Our doses are in LSCG's Drug Enhancements list too: switch them on there as well to see a bar with the time left."
      : "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's."));
  }
  kids.push(...keyholdersCard(), ...hardCard(), ...keysCard());
  kids.push(h("div", { class: "fd-muted", style: { marginTop: "14px" } }, "The Farmhand's Dispensary v" + VERSION + " · B&B Farm. On the farm, the farm girl keeps the farm's books and your Dispensary does the rest."));
  return kids;
}
function draw() { if (box) box.replaceChildren(...view()); }
export function open() { close(); styles(); box = W.document.createElement("div"); box.id = "fd-page"; W.document.body.appendChild(box); draw(); }
export function close() { if (box) { box.remove(); box = null; } note = ""; }
export const pageOpen = () => !!box;
// (the clock's redraw waits while you're pickin' somethin', so a list doesn't snap shut under your finger)
export function redrawPage(force) { const a = W.document.activeElement; if (!force && box && a && box.contains(a) && /^(SELECT|INPUT)$/.test(a.tagName)) return; draw(); }

export function initPage() {
  if (typeof W.PreferenceRegisterExtensionSetting !== "function") return false;
  try {
    W.PreferenceRegisterExtensionSetting({
      Identifier: ID, ButtonText: "The Farmhand's Dispensary",
      load: () => open(), run: () => {}, click: () => {}, exit: () => { close(); return true; }, unload: () => close(),
    });
    return true;
  } catch (e) { console.warn("[Dispensary] its page couldn't go in the game's Extensions:", e); return false; }
}
export function openPage() {
  try { if (typeof W.PreferenceSubscreenExtensionsOpen === "function") { W.PreferenceSubscreenExtensionsOpen(ID); return true; } } catch (e) { /* below */ }
  open();
  return true;
}
