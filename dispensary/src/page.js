/* WHAT'S IN THIS FILE (page.js)
   THE DISPENSARY'S PAGE: Preferences → Extensions → The Farmhand's Dispensary (/dispensary opens it too).
   Laid out like the Farmhand Companion's (Nov 21, Laynie: "can you organize the dispensary similar to the farmhand
   companion"): the safeword always at the top, a "Find a setting" box, and PAGES down the side, each a few cards about
   one thing. Every setting is on exactly one page (tests/dispensary-page.test.cjs checks):
     In you now · Who and when · Doses · Gear and kits · Nipples and holes · Breedin' · On your screen ·
     Hardcore and keys · Guides · About
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
import { nipsOpen, trainedLevel, nipsClose, nipsForce, lastPopped, nipLoads, NIP_WORDS } from "./nipples.js";
import { mineToy, toyOf, toyLocked } from "./toys-list.js";
import { kitNow, kitNames, SPEED_NAMES } from "./kits.js";
import { holesNow, holesSet, dueWords } from "./holes.js";
import { sizeWord, HOLE_SIZES } from "../../shared/holes.js";
import { GUIDES, GUIDE_BY } from "./guides.js";
import { seedInfo, seedDrain } from "./seed.js";
import { ripeNow, tied } from "./breed.js";
import { carryInfo } from "./carry.js";
import { amountSay } from "../../shared/seed.js";
import { BOT } from "./config.js";

const W = window, ID = "FarmhandDispensary";
let box = null, note = "";
let guide = "";   // the guide open now
let pageId = "now", find = "", box0 = false;   // the page you're on, what you're lookin' for in "Find a setting", opened yet this visit

const CSS = `
#fd-page{position:fixed;left:50%;top:3%;transform:translateX(-50%);width:min(900px,96vw);max-height:94vh;max-height:94dvh;overflow-y:auto;overflow-x:hidden;
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
#fd-page .fd-head{display:flex;align-items:center;gap:8px}
#fd-page .fd-head h3{flex:1}
#fd-page button.fd-how{font-size:12px;min-height:26px;padding:2px 9px;margin-top:10px;background:#2b2230;border-color:#6e5a78;color:#d9b3e6}
#fd-page .fd-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#fd-page button.fd-chip{font-size:12.5px;min-height:28px;padding:3px 10px;border-radius:14px;background:#2b2230;border-color:#6e5a78}
#fd-page button.fd-chip.fd-on{background:#5a3f68;border-color:#d9b3e6}
#fd-page .fd-guide{border-color:#8e6aa0;background:#2f2535}
#fd-page .fd-guide h4{margin:0;flex:1;font-size:16px;color:#f0d6f8;font-family:Bitter,Georgia,serif}
#fd-page .fd-guide ol,#fd-page .fd-guide ul{margin:6px 0 6px;padding-left:22px}
#fd-page .fd-guide li{margin:3px 0}
#fd-page .fd-words{margin:8px 0;padding:6px 8px;border-left:3px solid #8e6aa0;background:#281f2d;border-radius:4px}
#fd-page .fd-wrow{margin:5px 0;line-height:1.35}
#fd-page .fd-wrow code{white-space:normal;word-break:break-word}
#fd-page .fd-words summary{cursor:pointer;font-weight:bold}
#fd-page .fd-farmtext{white-space:pre-wrap;word-break:break-word;font-size:12px;margin:6px 0 0;max-height:420px;overflow:auto}
#fd-page .fd-try{background:#1e1822;border:1px dashed #6e5a78;border-radius:7px;padding:6px 10px;margin:6px 0}
#fd-page .fd-try code{font:13px/1.4 ui-monospace,Consolas,monospace;color:#ffd9a8;background:#0000;word-break:break-word}
#fd-page .fd-try button{font-size:11.5px;min-height:22px;padding:0 7px;margin-left:6px}
#fd-page .fd-set{display:flex;gap:16px;align-items:flex-start}
#fd-page .fd-nav{width:190px;flex-shrink:0;display:flex;flex-direction:column;gap:2px;position:sticky;top:0}
#fd-page .fd-nav button{text-align:left;min-height:36px;padding:0 10px;border-radius:8px;border:none;background:transparent;font-weight:600}
#fd-page .fd-nav button.fd-on{background:#2b2230;color:#d9b3e6}
#fd-page .fd-body{flex:1;min-width:0}
#fd-page .fd-body > h3:first-child,#fd-page .fd-body > .fd-head:first-child h3{margin-top:0}
#fd-page .fd-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#2b2230;border:1px solid #6e2330;border-radius:8px;padding:8px 12px;margin:4px 0 10px}
#fd-page input.fd-find{width:100%;box-sizing:border-box;padding:6px 10px;border-radius:8px;background:#1b151e;color:#ecdfe8;border:1px solid #6e5a78;margin:0 0 10px;font:inherit}
#fd-page .fd-found{margin:10px 0 2px;color:#b3a2b8;font-size:12.5px;text-transform:uppercase;letter-spacing:.04em}
@media (max-width:700px),(pointer:coarse) and (max-width:1000px){#fd-page .fd-set{flex-direction:column}#fd-page .fd-nav{width:auto;flex-direction:row;flex-wrap:wrap;position:static}
  #fd-page .fd-nav button{min-height:32px;border:1px solid #4a3a52;border-radius:999px}}
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
  return [...head("Keyholders", "hardcore"), h("div", { class: "fd-card" }, rows,
    locked ? h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Locked in with you till hardcore's over.")
      : h("div", { class: "fd-row", style: { marginTop: "8px" } }, input,
        h("button", { onclick: () => { const n = Number(String(keyInput).trim()), r = addKey(n); note = r.ok ? "🗝️ " + keyName(n) + " holds your key now." : (WHY_NOT[r.why] || "Couldn't add them."); if (r.ok) keyInput = ""; draw(); } }, "Add")),
    h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Keyholders can let you out of hardcore, change your settings while you're locked in, or end it. Your limits stay yours: nobody changes them while you're locked in, not even them."))];
}
function hardCard() {
  const out = [...head("Hardcore", "hardcore")];
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
  const out = [...head("Keys you hold", "hardcore")];
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

// ── the guides (Nov 19, guides.js; Laynie: "need to make guides in the dispensary for everything") ──
// A guide opens right under the heading you tapped its 📖 on (or under the list at the top), so you don't lose your place.
let guideWhere = "top", pendingGuide = "";
const copyBtn = (text) => (W.navigator && W.navigator.clipboard && typeof W.navigator.clipboard.writeText === "function"
  ? h("button", { title: "Copy it, to paste in the game's crafting", onclick: (e) => { const b = e.currentTarget; try { W.navigator.clipboard.writeText(text).then(() => { b.textContent = "Copied"; }, () => {}); } catch (x) { /* fine */ } } }, "Copy") : null);
function showGuide(id, where) {
  guide = GUIDE_BY[id] ? id : ""; guideWhere = where || "top";
  if (guide && !st().guided) { st().guided = true; save(); }
  draw();
  try { const g = box && box.querySelector(".fd-guide"); if (g && typeof g.scrollIntoView === "function") g.scrollIntoView({ block: "nearest" }); } catch (e) { /* fine */ }
}
function guideView(G) {
  const i = GUIDES.indexOf(G), next = GUIDES[i + 1], see = (G.see || []).filter((k) => GUIDE_BY[k]);
  return h("div", { class: "fd-card fd-guide" },
    h("div", { class: "fd-row" }, h("h4", null, G.icon + " " + G.title), h("button", { class: "fd-how", style: { marginTop: 0 }, onclick: () => { guide = ""; draw(); } }, "Close")),
    h("div", { style: { marginTop: "4px" } }, G.intro),
    h("ol", null, G.steps.map((s) => h("li", null, s))),
    // (Every word, Nov 24: the doses straight from the book, so a new dose is on the list the day it's made)
    G.doses ? h("div", { class: "fd-words" }, h("div", { class: "fd-muted" }, "The doses: any one of a dose's words on the item"),
      doseIds().map((id) => { const B = BOOK[id], ws = B.keywords && B.keywords.length ? B.keywords : [id === "kit" ? "kit, and the kit's own name" : B.label.toLowerCase()];
        return h("div", { class: "fd-wrow" }, h("b", null, (B.icon || "") + " " + B.label), " ", h("code", null, ws.join(" · ")), B.farm ? h("span", { class: "fd-muted" }, " · the farm girl reads it too") : null); })) : null,
    (G.lists || []).map((L) => h("div", { class: "fd-words" }, h("div", { class: "fd-muted" }, L.head),
      L.rows.map((r) => h("div", { class: "fd-wrow" }, h("b", null, r.what), " ", h("code", null, r.words.join(" · ")), h("div", { class: "fd-muted" }, "→ " + r.does))))),
    G.farm ? h("details", { class: "fd-words" }, h("summary", null, "🐄 On the farm: the farm girl's own list, as ?help shots gives it"), h("pre", { class: "fd-farmtext" }, G.farm)) : null,
    G.craft && G.craft.length ? h("div", { class: "fd-try" }, h("div", { class: "fd-muted" }, "Try it: craft one of these, word for word"),
      G.craft.map((c) => h("div", { style: { margin: "6px 0" } },
        h("div", null, "Name: ", h("code", null, c.name), copyBtn(c.name)),
        c.desc ? h("div", null, "Description: ", h("code", null, c.desc), copyBtn(c.desc)) : null,
        h("div", { class: "fd-muted" }, "→ " + c.note)))) : null,
    G.tips && G.tips.length ? [h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Worth knowin':"), h("ul", null, G.tips.map((t) => h("li", { class: "fd-muted" }, t)))] : null,
    h("div", { class: "fd-chips" },
      see.map((k) => h("button", { class: "fd-chip", onclick: () => showGuide(k, guideWhere) }, GUIDE_BY[k].icon + " " + GUIDE_BY[k].title)),
      next && guideWhere === "top" ? h("button", { class: "fd-chip", onclick: () => showGuide(next.id, "top") }, "Next: " + next.title + " ›") : null));
}
// a section's heading, its guide a tap away, and that guide under it when it's open there
const head = (title, id) => [h("div", { class: "fd-head" }, h("h3", null, title), id ? h("button", { class: "fd-how", "aria-label": "How " + title + " works", onclick: () => (guide === id && guideWhere === title ? (guide = "", draw()) : showGuide(id, title)) }, "📖 How it works") : null),
  guideWhere === title && GUIDE_BY[guide] ? guideView(GUIDE_BY[guide]) : null];   // (a see-also opens in the same place)
// the Guides page: every guide, and the one open under the list
function guidesPage() {
  const G = guideWhere === "top" ? GUIDE_BY[guide] : null;
  const out = [h("h3", null, "📖 Guides"), h("div", { class: "fd-card" },
    h("div", { class: "fd-muted" }, "How everythin' in here works, step by step, with crafts you can copy word for word. Every section on the other pages has its own 📖 How it works too."),
    h("div", { class: "fd-chips" }, GUIDES.map((g) => h("button", { class: "fd-chip" + (G && g.id === G.id ? " fd-on" : ""), onclick: () => (G && g.id === G.id ? (guide = "", draw()) : showGuide(g.id, "top")) }, g.icon + " " + g.title))))];
  if (G) out.push(guideView(G));
  return out;
}
// /dispensary guide <topic>: the page, open at that guide
export function guideNext(id) { pendingGuide = GUIDE_BY[id] ? id : ""; }

// the way out, at the top of every page: never more than a tap away
function safeBar() {
  const locked = hardOn(), n = doseIds().filter(active).length;
  return h("div", { class: "fd-bar" },
    locked
      ? h("button", { class: "fd-safe", onclick: () => { safeword("page"); note = "🗝️ Your keyholders have been asked to let you out."; draw(); } }, "🗝️ Ask to be let out")
      : h("button", { class: "fd-safe", onclick: () => { safeword("page"); note = "Safeword: every dose lifted."; draw(); } }, "🔴 Safeword: lift every dose"),
    h("span", { class: "fd-muted", style: { flex: "1 1 220px" } }, (n ? n + " dose" + (n === 1 ? "" : "s") + " in you. " : "Nothin' in you. ") + (locked ? "Hardcore: your safeword asks your keyholders to let you out. Your doses stay till one of them does."
      : "The game's own safeword does it too, and so does /dispensary safeword.")));
}

// ── the pages ──
function nowPage() {
  const S = st(), now = doseIds().filter(active);
  const kids = [];
  // in you now
  kids.push(...head("In you now", "start"));
  kids.push(h("div", { class: "fd-card" },
    now.length ? now.map((id) => h("div", null, BOOK[id].icon + " " + BOOK[id].label + (st().doses[id].x > 1 ? " ×" + st().doses[id].x : "") + partLabel(id) + ": " + timeLeft(leftMs(id)) + " left" + (S.clock === "online" ? " of your time here" : ""))) : h("div", { class: "fd-muted" }, "Nothin'. You're clear."),
    Object.values(S.grow || {}).some((v) => v) ? h("div", null, "📏 Grown (it stays): " + Object.entries(S.grow).filter(([, v]) => v).map(([k, v]) => ({ cup: "tits", ass: "ass", cock: "cock", balls: "balls" })[k] + " " + (v > 0 ? "+" : "") + v).join(", ") + ". A reducing serum takes a size back off.") : null,
    S.later.length ? h("div", null, "💊 " + (S.later.length === 1 ? "A time-release capsule's" : S.later.length + " time-release capsules are") + " waitin' in you. You won't know when.") : null,
    h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Your safeword is at the top of every page.")));
  return kids;
}
function whoPage() {
  const S = st(), locked = hardOn() ? true : undefined;
  const kids = [];
  // who can dose you
  kids.push(...head("Who can dose you", "safety"));
  const sel = h("select", { "aria-label": "Who can dose you", disabled: locked, onchange: (e) => { st().who = e.target.value; save(); note = ""; draw(); } },
    LADDER.map((r) => h("option", { value: r.id, selected: r.id === S.who ? true : undefined }, r.label)));
  kids.push(h("div", { class: "fd-card" }, sel, h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Right now: " + ladderWho() + ". You can always dose yourself.")));

  // the clock
  kids.push(...head("The clock", "safety"));
  const radio = (mode, label) => h("label", { title: clockTip(mode) },
    h("input", { type: "radio", name: "fd-clock", disabled: locked, checked: S.clock === mode ? true : undefined, onchange: () => { setClock(mode); draw(); } }), label);
  kids.push(h("div", { class: "fd-card" },
    h("div", { class: "fd-row", style: { gap: "18px" } }, radio("online", "While online"), radio("real", "Real time (+" + S.penalty + "%)")),
    h("div", { class: "fd-muted", style: { marginTop: "4px" } }, clockTip(S.clock))));
  return kids;
}
function screenPage() {
  const S = st();
  const kids = [];
  // what you see, and your animal
  kids.push(...head("Touches", "pick"));
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
  return kids;
}
function dosesPage() {
  const S = st(), locked = hardOn() ? true : undefined;
  const kids = [];
  // the doses
  kids.push(...head("Doses", "craft"));
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
  kids.push(...head("How doses take you", "timing"));
  kids.push(h("div", { class: "fd-card" },
    h("div", { class: "fd-row" }, h("span", null, "🌸 Where Tender goes when the bottle doesn't say:"),
      h("select", { "aria-label": "Where Tender goes", disabled: locked, onchange: (e) => { st().tenderSpot = e.target.value; save(); draw(); } },
        Object.entries(TENDER_SPOTS).map(([k, s2]) => h("option", { value: k, selected: (S.tenderSpot || TENDER_DEFAULT) === k ? true : undefined }, s2.word)))),
    h("div", { class: "fd-muted", style: { marginTop: "8px" } }, "💊 A needle that also says time-release, slow-release, delayed or capsule doesn't hit at once: it goes off somewhere between " + FUSE_MINS[0] + " and " + FUSE_MINS[1] + " minutes later, at a moment nobody knows. Up to " + LATER_MAX + " can wait in you; your safeword clears them."),
    h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.tolerance ? true : undefined, onchange: (e) => { st().tolerance = e.target.checked; save(); draw(); } }), h("b", null, "Tolerance")),
    h("div", { class: "fd-muted" }, "The same dose again within " + TOLERANCE_HOURS + " hours takes a fifth less for each one before it, down to two fifths. You're told when it does."),
    h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.cravings ? true : undefined, onchange: (e) => { st().cravings = e.target.checked ? Date.now() : 0; save(); draw(); } }), h("b", null, "Cravings")),
    h("div", { class: "fd-muted" }, "Once you've had " + CRAVE_AFTER + " doses in " + CRAVE_DAYS + " days, now and then, while nothin's in you, you want another (a note only you see). On the farm the farm girl notices, and offers: say ?fix and she sees to it. Only doses from here on count.")));
  return kids;
}
function gearPage() {
  const S = st(), locked = hardOn() ? true : undefined;
  const kids = [];
  // gear that doses (Nov 18, worn.js)
  kids.push(...head("Gear, drinks and kisses", "gear"));
  kids.push(h("div", { class: "fd-card fd-muted" },
    h("div", null, "Crafted gear you wear doses you when its words say a dose and how:"),
    h("div", null, "• drip, IV, laced, coated or soaked: keeps it in you while it's on (" + DRIP_MINS + " minutes' worth, topped up)"),
    h("div", null, "• injector, auto-inject, dosing or pump: a dose every " + INJECT_EVERY + " minutes (\"every 10 minutes\" sets its own)"),
    h("div", null, "• on climax, when kissed, when touched, when spanked: a dose each time"),
    h("div", null, "• roulette or mystery dose: a different one of the doses you allow, each time"),
    h("div", null, "• a drink or a treat somebody feeds you (Sip, Eat), and lip gloss or lipstick with a dose in it, on a kiss"),
    h("div", { style: { marginTop: "4px" } }, "Whoever crafted it has to be on your list. Your safeword clears what's in you and rests your gear " + PAUSE_MINS + " minutes.")));
  // kits (Nov 18, kits.js): yours to switch on, what they put on you, how fast, and your own saved ones
  kids.push(...head("Kits", "kits"));
  { const k = kitNow(), n = kitNames();
    kids.push(h("div", { class: "fd-card" },
      k ? h("div", null, "👗 On you now: " + k.key + (k.left ? " (" + k.left + " pieces still to go on)" : "")) : null,
      h("label", null, h("input", { type: "checkbox", disabled: locked, checked: S.kitsOn ? true : undefined, onchange: (e) => { st().kitsOn = e.target.checked; save(); draw(); } }), h("b", null, "Kits can dress me")),
      h("div", { class: "fd-row", style: { marginTop: "6px", gap: "10px" } },
        h("select", { "aria-label": "What kits put on you", disabled: locked, onchange: (e) => { st().kitWhat = e.target.value; save(); draw(); } },
          [["both", "Clothes and restraints"], ["clothes", "Only clothes"], ["binds", "Only restraints"]].map(([v, t]) => h("option", { value: v, selected: (S.kitWhat || "both") === v ? true : undefined }, t))),
        h("select", { "aria-label": "How fast kits go on", disabled: locked, onchange: (e) => { st().kitSpeed = e.target.value; save(); draw(); } },
          Object.keys(SPEED_NAMES).map((v) => h("option", { value: v, selected: (S.kitSpeed || "steady") === v ? true : undefined }, SPEED_NAMES[v])))),
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "A dose that says \"kit: <name>\" puts its crafter's saved outfit on you (one saved in LSCG, or on their Dispensary), a piece at a time, held on half an hour a dose: anythin' taken off creeps back on. Never your body, nothin' you've blocked, never over somethin' locked. When it's over, your old outfit slips back on. Its pieces keep their crafts, so horny gear in it is horny."),
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Your kits: " + (n.own.length ? n.own.join(", ") : "none yet") + (n.lscg.length ? " · in LSCG: " + n.lscg.join(", ") : "") + ". /dispensary kit save <name> keeps what you're wearin'.")));
  }
  // horny gear (Nov 18, horny.js): its own switch
  kids.push(...head("Horny gear", "horny"));
  kids.push(h("div", { class: "fd-card" },
    h("label", null, h("input", { type: "checkbox", disabled: locked, checked: S.hornyOn !== false ? true : undefined, onchange: (e) => { st().hornyOn = e.target.checked; save(); draw(); } }),
      h("b", null, "Horny gear can use me")),
    h("div", { class: "fd-muted" }, "Crafted gear that says horny or hungry has its way with you, all by itself, every few minutes (insatiable or ravenous: every couple): plugs and dildos thrust, nipple gear suckles, gags fuck your throat, ropes and belts grind. It pushes your arousal up, and close enough it makes you cum. \"Breeding\" on it too: it fills you when you cum. A parasite that says horny is twice as busy.")));
  kids.push(...parasitesCards(S, locked));
  return kids;
}
function bodyPage() {
  const S = st(), locked = hardOn() ? true : undefined;
  const kids = [];
  // your nipples (Nov 18, nipples.js): how open, trained, the switch, and closin' them back up
  kids.push(...head("Nipples", "nipples"));
  { const n = nipsOpen(), t = trainedLevel(), loads = nipLoads();
    kids.push(h("div", { class: "fd-card" },
      h("div", null, (n ? "⭕ " + NIP_WORDS[n][0].toUpperCase() + NIP_WORDS[n].slice(1) + ", " + n + " of 3" : "Closed") + (t ? " · trained to stay " + NIP_WORDS[t] : "") + (loads.n ? " · loads taken in them: " + loads.n : "") + (mineToy() ? " · the " + toyOf(mineToy()).label + " in them" : "")),
      h("label", { style: { marginTop: "6px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.nipsHeal !== false ? true : undefined, onchange: (e) => { st().nipsHeal = e.target.checked; save(); draw(); } }),
        h("b", null, "They close up slowly on their own")),
      h("div", { class: "fd-muted" }, "Crafted nipple gear that says dilator or stretcher holds them open while it's on. Held open (the Nipple Dilator, that gear, the leeches, a toy) and used, they train: the stretch stays after the dose or the leeches are gone, and they can still be fucked and filled. They train a step an hour toward how wide they're held, so three hours held wide leaves them gapin'. Open them up forces them a step wider right now; /dispensary nips open <who> does it to somebody who lets you dose them. With this on they close half a step a day once they've been left be twelve hours. Off: they stay as they're trained."),
      h("div", { class: "fd-row", style: { marginTop: "6px" } },
        // (Nov 19) forced open, a step wider each press, and trained to stay that way
        h("button", { disabled: t >= 3 ? true : undefined, onclick: () => { const r = nipsForce(Math.min(3, t + 1)); note = r.ok ? "Your nipples are " + NIP_WORDS[r.n] + " now, trained to stay that way." : "They're already " + NIP_WORDS[r.n] + "."; draw(); } }, "Open them up"),
        h("button", { disabled: locked || !n || toyLocked(mineToy()) ? true : undefined, onclick: () => { nipsClose(true); const out = lastPopped(); note = (out ? "The " + out + " slides out, and your" : "Your") + " nipples are closed back up, snug as they ever were."; draw(); } }, "Close them up"),
        h("span", { class: "fd-muted" }, locked ? "Hardcore: a Tightening Balm from a keyholder does it." : toyLocked(mineToy()) ? "The " + toyOf(mineToy()).label + "'s locked in, holdin' them open: its key first." : "The Dilator out, the leeches off, any toy out, the stretch undone. A Tightening Balm does it too."))));
  }
  // your holes (Nov 18, holes.js): how open, how trained, what's in them, goals, your own pick, the two switches
  kids.push(...head("Holes", "holes"));
  { const N = holesNow(), FEEL = { "0": "it fits", "1": "a good stretch", "2": "it aches", "3": "it hurts", cruel: "it's cruel to you" };
    const rows = Object.entries(N.holes).map(([hk, x]) => h("div", { style: { margin: "4px 0 8px" } },
      h("div", null, h("b", null, x.label + ": "), x.nowWord + (x.now !== x.trained ? " tonight · trained " + x.trainedWord : "") + (x.toward ? " · " + x.toward + "% to the next size" : "")),
      x.toy ? h("div", { class: "fd-muted" }, "In it: the " + x.toy.name + ", holdin' you " + sizeWord(hk, x.toy.size) + ": " + FEEL[x.toy.feel] + (x.toy.trainer ? ", trainin' you" : "") + (x.toy.pump ? ", growin' with you" : "")) : null,
      x.goal ? h("div", { class: "fd-muted" }, "🎯 Goal: " + x.goal.word + (x.goal.due ? ", " + dueWords(x.goal.due) : "") + (x.goal.by && x.goal.by !== (W.Player && W.Player.MemberNumber) ? ", set by " + keyName(x.goal.by) : "")) : null,
      h("div", { class: "fd-row", style: { marginTop: "4px" } }, h("span", { class: "fd-muted" }, "Your own pick:"),
        h("select", { "aria-label": "Your " + x.label.toLowerCase() + ", your own pick", disabled: locked, onchange: (e) => { if (e.target.value) { holesSet(hk, Number(e.target.value)); note = "Your " + x.label.toLowerCase() + " is " + sizeWord(hk, Number(e.target.value)) + " now."; } draw(); } },
          [h("option", { value: "", selected: true }, "leave it")].concat(HOLE_SIZES[hk].names.slice(HOLE_SIZES[hk].start - 1, HOLE_SIZES[hk].natural).map((w, i) => h("option", { value: String(i + HOLE_SIZES[hk].start) }, w)))))));
    kids.push(h("div", { class: "fd-card" }, rows,
      h("label", { style: { marginTop: "6px" } }, h("input", { type: "checkbox", disabled: locked, checked: N.heal ? true : undefined, onchange: (e) => { st().holesHeal = e.target.checked; save(); draw(); } }), h("b", null, "They close up slowly on their own")),
      h("label", null, h("input", { type: "checkbox", disabled: locked, checked: N.pain ? true : undefined, onchange: (e) => { st().holesPain = e.target.checked; save(); draw(); } }), h("b", null, "Too-big toys can hurt")),
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "A toy in you stretches you to its size. One size bigger than you're trained is a good stretch, two aches, three or more hurts (or only aches, with that switch off); a cruel or sadist one always means it. A trainer (crafted to say stretcher, trainer, gaper or dilator, or cruel, or with a goal like \"goal: gaping\" or \"train her to loose in 3 days\") trains you up while it's in, faster the bigger it is: a size every 12 hours at one size bigger, 6 hours at three. A pump or beads crafted as a trainer grows with you. Fingers, fists, cocks and toys count too, and a load in a loose hole drips back out. Healin' on: left be a day, they close half a size a day. Anybody who can dose you can set a goal: /dispensary train <who> <ass|pussy|throat> <size> [in 3 days]. A Tightening Balm that names a hole closes it up."),
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, N.sync ? "On the farm's books: the farm girl keeps them, and gets what happens off the farm next time you're in her room" + (N.waiting ? " (" + N.waiting + " change" + (N.waiting === 1 ? "" : "s") + " waitin')." : ".") : "These are your Dispensary's own numbers. On the farm, the farm girl keeps the books.")));
  }
  return kids;
}
function breedPage() {
  const S = st(), locked = hardOn() ? true : undefined;
  const kids = [];
  // breedin' (Nov 19, carry.js): what you're carryin' by the farm's books, wherever you are
  kids.push(...head("Breedin'", "breeding"));
  { const K = carryInfo(), STAGE = { early: "just took", show: "showin'", heavy: "heavy and close", due: "due right now" }, rows = [];
    if (K.labour) rows.push(h("div", null, "🍼 In labour: about " + Math.max(1, Math.ceil(K.labour.left / 60000)) + " minutes to go" + (K.labour.midwife ? ", " + K.labour.midwife + " helpin'" : "") + "."));
    if (K.carrying) rows.push(h("div", null, "🤰 Carryin' " + (K.carrying.count === 1 ? "a " + (K.one || "little one") : K.carrying.count + " " + (K.many || "little ones")) + (K.carrying.sires.length ? ", " + K.carrying.sires.join(" & ") + "'s" : "") + " · " + STAGE[K.carrying.stage] + " · " + K.carrying.dueWords));
    if (K.born) rows.push(h("div", null, "🍼 Delivered away from the farm: the farm girl books your litter next time you're in her room."));
    if (K.eggs) rows.push(h("div", null, "🥚 A clutch of " + K.eggs.n + (K.eggs.by ? ", " + K.eggs.by + "'s" : "") + (K.eggs.layAt > Date.now() ? ", ready " + (K.eggs.layAt - Date.now() < 36 * 3600000 ? "in " + Math.max(1, Math.round((K.eggs.layAt - Date.now()) / 3600000)) + " hours" : "in " + Math.round((K.eggs.layAt - Date.now()) / 86400000) + " days") : ", ready to lay")));
    if (K.laid) rows.push(h("div", null, "🥚 Laid away from the farm: she books them next time you're in her room."));
    if (K.heat) rows.push(h("div", null, "🔥 In heat."));
    if (ripeNow()) rows.push(h("div", null, "🌸 Ripe: a load takes twice as easy."));
    if (K.open) rows.push(h("div", null, "💞 Wide open from the birth: a load takes four times as easy, for " + Math.max(1, Math.ceil((K.open - Date.now()) / 60000)) + " more minutes."));
    kids.push(h("div", { class: "fd-card" }, rows.length ? rows : h("div", { class: "fd-muted" }, K.known ? "Not carryin' right now. Somebody should fix that." : "The farm girl tells your Dispensary what you're carryin', next time you're in her room."),
      K.litters ? h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Litters you've delivered: " + K.litters + (K.litters >= 20 ? " · 🎖️ Baby Factory" : " · twenty and the farm makes you a Baby Factory")) : null,
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Wherever you are, you feel what you're carryin': it takes hold, shows, grows heavy and kicks, your tits fill, and you crave seed. Your natural heat comes on where you are. Due away from the farm, your labour happens right there, and anybody in the room can be your midwife (a touch on your belly helps); a clutch comes out the same way. For an hour after a birth you're wide open. A Quickening Draught takes a day off; a Breeder's Scan shows the room what's in there.")));
  }
  // seed in you (Nov 19, seed.js): what's in each hole and whose, the seals, how full, every load you've taken
  kids.push(...head("Seed", "breeding"));
  { const I = seedInfo(), HW = { vulva: "Pussy", butt: "Ass", mouth: "Swallowed", nips: "Tits" }, farmHere = (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
    const rows = Object.entries(I.held).filter(([, x]) => x.ml >= 1 || x.seal).map(([hk, x]) => h("div", null, h("b", null, HW[hk] + ": "), amountSay(x.ml) + (x.who ? ", mostly " + x.who + "'s" : "") + (x.seal ? " · 🔒 sealed with " + x.seal.name + "'s " + x.seal.g : "")));
    kids.push(h("div", { class: "fd-card" },
      rows.length ? rows : h("div", { class: "fd-muted" }, "Nothin' in you right now."),
      h("label", { style: { marginTop: "6px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.breedAny ? true : undefined, onchange: (e) => { st().breedAny = e.target.checked; save(); draw(); } }), h("b", null, "Breed me anywhere")),
      h("div", { class: "fd-muted" }, "Off the farm, a cock in you that cums (the game's own actions) leaves a real load: theirs, on your books and the farm girl's, where it can catch. A knotted one ties you on the map for its minutes. Only from somebody on your list; on her farm, her own scenes count it. Off to start."),
      ripeNow() ? h("div", { style: { marginTop: "4px" } }, "🌸 You're ripe: any load in you takes twice as easy, these two days.") : null,
      tied() ? h("div", { style: { marginTop: "4px" } }, "🔒 Knotted: tied fast for " + Math.max(1, Math.ceil((tied().until - Date.now()) / 60000)) + " more minutes.") : null,
      h("div", { style: { marginTop: "4px" } }, "🤰 Your belly: " + I.pct + "% full · it holds " + amountSay(I.cap) + " before it spills" + (I.stage ? ", and it shows" : "")),
      I.loads ? h("div", { class: "fd-muted" }, "Loads you've taken: " + I.loads + ", " + amountSay(I.ml) + " all told" + (I.top.length ? " · most from " + I.top.slice(0, 3).map((t) => t.name + " (" + t.n + ")").join(", ") : "")) : null,
      h("div", { class: "fd-row", style: { marginTop: "6px" } },
        h("button", { disabled: locked || farmHere || !I.belly && !(I.held.nips.ml >= 1) ? true : undefined, onclick: () => { const n = seedDrain(); note = n ? "You let it all run out: " + amountSay(n) + ". A seal still holds what's behind it." : "Nothin' to let out but what's sealed in."; draw(); } }, "Let it all out"),
        h("span", { class: "fd-muted" }, locked ? "Hardcore: it drains on its own, or your keyholders take the seal out." : farmHere ? "On the farm, the farm girl's books say what's in you." : "Anythin' not sealed in drains away at once.")),
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "A crafted needle, drink or bit of gear that says it carries seed (Insemination, Seed Syringe, Cum Shot, filled with my seed) puts its crafter's own seed in you, as much as it says, where it says: \"500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples\", or \"in every hole\". A Breeder's Seal (gear that says so) keeps every drop in the hole it's in, opens only for its maker's seed, and while it's in only its maker's loads can catch. Off the farm it drains slowly and drips; your Dispensary hands every load to the farm girl, where it can catch with its crafter as sire" + (I.no === "breedable" ? ". She isn't bookin' yours right now: ?breedable on, in her room." : I.waiting ? " (" + I.waiting + " waitin' for her)." : "."))));
  }
  return kids;
}
// crafted parasites (Nov 18, parasites.js): each kind yours to switch on (on the Gear and kits page)
function parasitesCards(S, locked) {
  const kids = [];
  kids.push(...head("Parasites", "parasites"));
  const inMe = paraIn();
  kids.push(h("div", { class: "fd-card" },
    h("div", { class: "fd-muted" }, "Crafted parasites, anywhere: put on you in a crafted item that names them, by somebody on your list. Each kind only takes if you switch it on. Your safeword takes them off."),
    kindIds().map((k) => { const K = KINDS[k], p = inMe[k]; return h("label", { style: { marginTop: "4px" } },
      h("input", { type: "checkbox", disabled: locked, checked: S.parasites && S.parasites[k] ? true : undefined, onchange: (e) => { const P = st().parasites || (st().parasites = {}); if (e.target.checked) P[k] = true; else { delete P[k]; letGo(k, "quiet"); } save(); draw(); } }),
      h("span", null, K.icon + " " + K.label + (p ? " · in you" + (p.until ? ", " + timeLeft(Math.max(0, p.until - Date.now())) + " left" : "") + (p.name ? " (" + p.name + "'s)" : "") : ""))); }),
    h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S.mouthAuto ? true : undefined, onchange: (e) => { st().mouthAuto = e.target.checked; save(); draw(); } }),
      h("span", null, "The mouthpiece's words go straight out, without askin' me first")),
    h("div", { class: "fd-muted" }, "What each does: parasite lips feed you their crafter's strain and spread by a kiss; livin' latex drinks your climaxes; milk moss keeps you leakin'; the nestling grows your belly every time you cum; the brood mother lays little ones you pass on by a kiss; the leash vine keeps you near its crafter on a map; the mouthpiece lets its crafter put words in your mouth (/dispensary say, or nope).")));
  return kids;
}
function hardPage() { return [...keyholdersCard(), ...hardCard(), ...keysCard()]; }
function aboutPage() {
  const kids = [];
  kids.push(h("h3", null, "ℹ The Farmhand's Dispensary v" + VERSION));
  kids.push(h("div", { class: "fd-card fd-muted" }, "B&B Farm's dosing add-on: crafted needles, drinks and gear that dose whoever they're used on or worn by, anywhere. On the farm, the farm girl keeps the farm's books and your Dispensary does the rest. Your safeword lifts every dose, and your limits are yours."));
  if (lscgPresent()) {
    kids.push(...head("LSCG", "farm"));
    kids.push(h("div", { class: "fd-card fd-muted" }, lscgApi()
      ? "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's. Our doses are in LSCG's Drug Enhancements list too: switch them on there as well to see a bar with the time left."
      : "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's."));
  }
  return kids;
}

// every page, in the order down the side (the Companion's settings, the same way: extension/src/views/settingspages.js)
export const PAGES = [
  { id: "now", label: "💉 In you now", render: nowPage },
  { id: "who", label: "🛡 Who and when", render: whoPage },
  { id: "doses", label: "🧪 Doses", render: dosesPage },
  { id: "gear", label: "⛓ Gear and kits", render: gearPage },
  { id: "body", label: "⭕ Nipples and holes", render: bodyPage },
  { id: "breed", label: "🍼 Breedin'", render: breedPage },
  { id: "screen", label: "✨ On your screen", render: screenPage },
  { id: "hard", label: "🔒 Hardcore and keys", render: hardPage },
  { id: "guides", label: "📖 Guides", render: guidesPage },
  { id: "about", label: "ℹ About", render: aboutPage },
];
// one page drawn safely: a page that breaks says so, and the rest still work
const drawPage = (p) => { try { return p.render().filter((k) => k != null); } catch (e) { console.warn("[Dispensary]", e); return [h("div", { class: "fd-card fd-note" }, p.label + " hit a snag. The other pages still work.")]; } };
// "Find a setting": every card on every page with those words in it, under the page it's on
function findResults(q) {
  const want = q.trim().toLowerCase(), out = [];
  for (const p of PAGES) {
    if (p.id === "guides") continue;   // (the guides have their own list)
    const tmp = h("div", null, drawPage(p));
    const hits = [...tmp.querySelectorAll(".fd-card")].filter((c) => !c.classList.contains("fd-guide") && !(c.parentElement && c.parentElement.closest(".fd-card")) && c.textContent.toLowerCase().includes(want));
    if (hits.length) out.push(h("div", { class: "fd-found" }, p.label), ...hits);
  }
  return out.length ? out : [h("div", { class: "fd-muted" }, "Nothin' matches \"" + q.trim() + "\". Try fewer letters, or look through the pages.")];
}
function view() {
  const locked = hardOn() ? true : undefined, cur = PAGES.find((p) => p.id === pageId) || PAGES[0];
  const kids = [];
  kids.push(h("div", { class: "fd-row", style: { marginBottom: "6px" } },
    h("h2", null, "💉 The Farmhand's Dispensary"),
    h("button", { onclick: () => { if (typeof W.PreferenceSubscreenExtensionsClear === "function") W.PreferenceSubscreenExtensionsClear(); else close(); } }, "Back")));
  if (note) kids.push(h("div", { class: "fd-note" }, note));
  if (locked) kids.push(h("div", { class: "fd-card fd-note" }, "🔒 Hardcore: your keyholders hold these settings. You can look, but only they can change them."));
  kids.push(safeBar());
  // typin' redraws only what's under the box, so it keeps the focus and a phone's keyboard stays up
  const body = h("div", { class: "fd-body" });
  const fill = () => body.replaceChildren(...(find.trim() ? findResults(find) : drawPage(cur)));
  kids.push(h("input", { class: "fd-find", type: "search", placeholder: "Find a setting…", "aria-label": "Find a setting", value: find, oninput: (e) => { find = e.target.value; fill(); } }));
  fill();
  kids.push(h("div", { class: "fd-set" },
    h("nav", { class: "fd-nav", "aria-label": "Dispensary pages" }, PAGES.map((p) =>
      h("button", { class: p === cur && !find.trim() ? "fd-on" : "", "aria-current": p === cur && !find.trim() ? "page" : undefined, onclick: () => { find = ""; pageId = p.id; guide = ""; draw(); try { box.scrollTop = 0; } catch (e) { /* fine */ } } }, p.label))),
    body));
  return kids;
}
function draw() { if (box) box.replaceChildren(...view().filter((k) => k != null)); }   // (a heading's guide spot is empty till it's open)
// a page by any word for it (/dispensary page hardcore, /dispensary page seed)
const PAGE_WORDS = { now: "now", in: "now", inyounow: "now", who: "who", when: "who", whoandwhen: "who", clock: "who", ladder: "who", dose: "doses", doses: "doses",
  gear: "gear", kit: "gear", kits: "gear", gearandkits: "gear", horny: "gear", parasite: "gear", parasites: "gear", drinks: "gear",
  body: "body", nipple: "body", nipples: "body", hole: "body", holes: "body", nipplesandholes: "body", breed: "breed", breedin: "breed", breeding: "breed", seed: "breed",
  pregnancy: "breed", screen: "screen", onyourscreen: "screen", touches: "screen", icons: "screen", animal: "screen",
  hard: "hard", hardcore: "hard", keys: "hard", keyholders: "hard", hardcoreandkeys: "hard", guide: "guides", guides: "guides", about: "about", version: "about" };
export function pageFor(w) { return PAGE_WORDS[String(w || "").toLowerCase().replace(/[^a-z]/g, "")] || null; }
export const pageNames = () => PAGES.map((p) => p.label.replace(/^\S+\s+/, "")).join(", ");
let pendingPage = "";
// which: a page to open on (now, who, doses, gear, body, breed, screen, hard, guides, about)
export function open(which) {
  close(); styles();
  which = (typeof which === "string" && which) || pendingPage; pendingPage = "";
  if (which && PAGES.some((p) => p.id === which)) pageId = which;
  else if (!st().guided && !box0) pageId = "guides";   // (till you've opened a guide, it opens on the Guides, as the list at the top used to)
  box0 = true;
  if (pendingGuide) { guide = pendingGuide; guideWhere = "top"; pageId = "guides"; pendingGuide = ""; if (!st().guided) { st().guided = true; save(); } }
  box = W.document.createElement("div"); box.id = "fd-page"; W.document.body.appendChild(box); draw();
}
export function close() { if (box) { box.remove(); box = null; } note = ""; guide = ""; find = ""; }
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
// which: the page to open on (from pageFor), or the one you were on
export function openPage(which) {
  pendingPage = which || "";
  try { if (typeof W.PreferenceSubscreenExtensionsOpen === "function") { W.PreferenceSubscreenExtensionsOpen(ID); return true; } } catch (e) { /* below */ }
  open();
  return true;
}
