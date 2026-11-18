/* WHAT'S IN THIS FILE (nipples.js)
   NIPPLES THAT OPEN UP (Laynie, Nov 17: "maybe a nipple dialator effect and parasite that makes nipples fuckable as a
   real action?"). Two ways they open:
     • the Nipple Dilator (a dose, doses.js): stretched open while it's in you, wider for a stronger dose (1 to 3).
       Crafted nipple gear that says dilator or stretcher keeps it in you while it's worn (worn.js).
     • the nipple leeches (a crafted parasite, parasites.js): they hold your nipples open while they live, and wider
       once they've been fed a few times.
   While they're open, two real actions are offered on your nipples in the game's own action menu: Fuck nipple (for
   somebody with a cock) and Finger nipple (anybody with free hands; you can do that one to yourself). They work the
   arousal meter like any action. With LSCG they're LSCG extension activities, so they're in its trigger settings too;
   without it the Dispensary adds them to the game itself. Either way the chat line travels with the message, so people
   without either still read it.
   • Who can: the game's own rules for the spot (bare and reachable), and the nipples have to be open. Everybody with
     the Dispensary knows whose are: your Dispensary tells the room (dispNips { n }) while they're open, once when they
     close, and when somebody new asks (dispIconsAsk).
   • Done to you: it's a touch there like any other (Tender and Hair Trigger stack on it; open nipples count double),
     the leeches feed on it, and now and then a line only you see.
*/
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { LSCG_ID } from "./config.js";
import { active, xOfDose } from "./doses.js";
import { mine, nipsFed } from "./parasites.js";
import { LINES } from "./lines.js";
import { local, pick, fill, nameOf } from "./say.js";

const W = window;
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const charOf = (mn) => (mn === me() ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
const inRoom = () => W.CurrentScreen === "ChatRoom" && typeof W.ServerSend === "function";
const others = new Map();   // member → { n, at }

// how open yours are: 0 shut, 1 to 3
export function nipsOpen() {
  let n = active("dilator") ? Math.max(1, Math.min(3, xOfDose("dilator"))) : 0;
  const p = mine().nips;
  if (p) n = Math.max(n, (p.n || 0) >= 3 ? 3 : 2);
  return n;
}
// how open somebody's are (yours, or what their Dispensary told the room)
export function openOf(mn) {
  mn = Number(mn);
  if (mn === me()) return nipsOpen();
  const e = others.get(mn);
  return e && Date.now() - e.at < 6 * 3600000 ? e.n : 0;
}

// tell the room: while they're open, once when they close, and to anybody who asks
let told = 0;
export function nipsTell(force) {
  const n = nipsOpen();
  if (!inRoom() || (!force && n === told) || (force && !n)) return false;
  told = n;
  try { W.ServerSend("ChatRoomChat", makeMsg("dispNips", { n })); return true; } catch (e) { return false; }
}
function onNips(from, m) {
  const n = Math.max(0, Math.min(3, Math.round(Number(m.n) || 0)));
  if (n) others.set(from, { n, at: Date.now() }); else others.delete(from);
}

// ── the two actions ──
const ACTS = {
  cock: { name: "NippleFuck", label: "Fuck nipple", image: "Icons/Activity/PenetrateSlow.png", max: 90,
    action: "SourceCharacter pushes into TargetCharacter's stretched-open nipple, slow and deep, and fucks it." },
  finger: { name: "NippleFinger", label: "Finger nipple", selfLabel: "Finger your nipple", image: "Icons/Activity/MasturbateHand.png", max: 70,
    action: "SourceCharacter works a finger right inside TargetCharacter's open nipple.",
    selfAction: "SourceCharacter slips a finger inside one of PronounPossessive own open nipples." },
};
const hasCock = (C) => { try { return !!(C && typeof C.HasPenis === "function" && C.HasPenis()); } catch (e) { return false; } };
// what the game calls ours, by kind (with LSCG: LSCG's name for it; without: our own)
let mode = "", lscgApi = null;
const gameName = (k) => (mode === "lscg" ? "LSCG_" + LSCG_ID + "." + ACTS[k].name.toLowerCase() : "FarmDisp_" + ACTS[k].name);
const kindOfName = (n) => Object.keys(ACTS).find((k) => gameName(k) === n) || null;

// somebody did one to you
let usedAt = 0;
export function nipsUsed(from, kind) {
  if (from && from !== me()) nipsFed(from, kind);   // the leeches feed (parasites.js)
  const now = Date.now();
  if (now - usedAt > 3 * 60000) { usedAt = now; const L = LINES.nips && LINES.nips[!from || from === me() ? "self" : kind === "cock" ? "fucked" : "fingered"]; if (L && L.length) local(fill(pick(L), { by: from && from !== me() ? nameOf(from) : "you" })); }
}

// WITH LSCG: through its extension API (lscg.js hands us its handle once LSCG's ready)
export function nipsLscg(api, caps) {
  if (!api || !caps || !caps.has("activities") || mode) return false;
  try {
    api.activities.registerPrerequisite({ name: "nipsopen", check: ({ acted }) => openOf(acted && acted.MemberNumber) > 0 });
    api.activities.registerPrerequisite({ name: "hascock", check: ({ acting }) => hasCock(charOf(acting && acting.MemberNumber)) });
    for (const k of Object.keys(ACTS)) {
      const A = ACTS[k];
      api.activities.register({
        name: A.name.toLowerCase(), maxProgress: A.max, maxProgressSelf: A.max, image: A.image,
        prerequisites: k === "cock" ? ["ZoneAccessible", "ZoneNaked", "CanUsePenis", "hascock", "nipsopen"] : ["ZoneAccessible", "ZoneNaked", "UseHands", "nipsopen"],
        targets: [Object.assign({ group: "ItemNipples", label: A.label, action: A.action }, A.selfAction ? { selfAllowed: true, selfLabel: A.selfLabel, selfAction: A.selfAction } : {})],
        onReceive: ({ sender }) => { try { nipsUsed(Number(sender) || 0, k); } catch (e) { /* fine */ } },
      });
    }
    mode = "lscg"; lscgApi = api;
    return true;
  } catch (e) { console.warn("[Dispensary] LSCG wouldn't take the nipple actions:", e); return false; }
}

// WITHOUT LSCG: added to the game's own action list, the way LSCG does it
const TEXT = {};
function addOwn(mod) {
  if (mode) return false;
  // (the game keeps its order list as a plain const, not on window: reached by its bare name)
  /* global ActivityFemale3DCG, ActivityFemale3DCGOrdering */
  const list = W.ActivityFemale3DCG || (typeof ActivityFemale3DCG !== "undefined" ? ActivityFemale3DCG : null);
  const order = W.ActivityFemale3DCGOrdering || (typeof ActivityFemale3DCGOrdering !== "undefined" ? ActivityFemale3DCGOrdering : null);
  if (!Array.isArray(list) || !Array.isArray(order) || typeof W.ActivityCheckPrerequisite !== "function") return false;
  mode = "own";
  for (const k of Object.keys(ACTS)) {
    const A = ACTS[k], n = gameName(k);
    if (list.some((a) => a && a.Name === n)) continue;
    list.push({ Name: n, MaxProgress: A.max, MaxProgressSelf: A.max, Target: ["ItemNipples"], TargetSelf: A.selfAction ? ["ItemNipples"] : undefined,
      Prerequisite: k === "cock" ? ["ZoneAccessible", "ZoneNaked", "CanUsePenis", "FarmDispHasCock", "FarmDispNipsOpen"] : ["ZoneAccessible", "ZoneNaked", "UseHands", "FarmDispNipsOpen"] });
    order.push(n);
    TEXT["Activity" + n] = A.label;
    TEXT["Label-ChatOther-ItemNipples-" + n] = A.label; TEXT["ChatOther-ItemNipples-" + n] = A.action;
    if (A.selfAction) { TEXT["Label-ChatSelf-ItemNipples-" + n] = A.selfLabel; TEXT["ChatSelf-ItemNipples-" + n] = A.selfAction; }
  }
  const hook = (fn, pri, f) => { try { mod.hookFunction(fn, pri, f); } catch (e) { console.warn("[Dispensary] nipples can't hook " + fn + ":", e); } };
  hook("ActivityCheckPrerequisite", 5, (args, next) => {
    if (args[0] === "FarmDispNipsOpen") { try { return openOf(args[2] && args[2].MemberNumber) > 0; } catch (e) { return false; } }
    if (args[0] === "FarmDispHasCock") return hasCock(args[1]);
    return next(args);
  });
  // how the game rates it (it has no slot in anybody's arousal settings): neutral, like LSCG's own
  hook("PreferenceGetActivityFactor", 5, (args, next) => (/^FarmDisp_Nipple/.test(String(args[1])) ? 2 : next(args)));
  // the menu's words, and the chat line
  hook("ActivityDictionaryText", 5, (args, next) => (Object.prototype.hasOwnProperty.call(TEXT, args[0]) ? TEXT[args[0]] : next(args)));
  // the icon: one of the game's own
  hook("ElementButton.CreateForActivity", 5, (args, next) => {
    try { const a = args[1], k = a && a.Activity && kindOfName(a.Activity.Name); if (k && !a.Item) { args[4] = Object.assign({}, args[4] || {}); args[4].image = ACTS[k].image; } } catch (e) { /* fine */ }
    return next(args);
  });
  // the line goes with the message, names filled in, so people without the Dispensary read it too
  hook("ServerSend", 5, (args, next) => {
    try {
      const d = args[1];
      if (args[0] === "ChatRoomChat" && d && d.Type === "Activity" && Array.isArray(d.Dictionary) && /FarmDisp_Nipple/.test(String(d.Content))) {
        const get = (key) => { const e = d.Dictionary.find((x) => x && x[key] != null); return e ? e[key] : null; };
        const src = Number(get("SourceCharacter")), tgt = Number(get("TargetCharacter"));
        const nm = (mn) => { const C = charOf(mn); return C ? String(C.Nickname || C.Name || mn) : String(mn); };
        const text = String(TEXT[d.Content] || "").replace(/SourceCharacter/g, nm(src)).replace(/TargetCharacter/g, nm(tgt)).replace(/PronounPossessive/g, "their");
        if (text) d.Dictionary.push({ Tag: 'MISSING TEXT IN "ActivityDictionary.csv": ' + d.Content, Text: text });
      }
    } catch (e) { /* fine */ }
    return next(args);
  });
  return true;
}

// an action seen in the room: ours done to you (without LSCG; LSCG calls onReceive itself), and somebody suckin' on
// your nipples while the leeches are on them (they go across: parasites.js)
let onSuckled = null;
export function nipsOnSuckle(f) { onSuckled = f; }
function onActivity(data) {
  const D = Array.isArray(data.Dictionary) ? data.Dictionary : [], get = (key) => { const e = D.find((x) => x && x[key] != null); return e ? e[key] : null; };
  const name = String(get("ActivityName") || ""), src = Number(get("SourceCharacter")) || 0, tgt = Number(get("TargetCharacter")) || 0, grp = String(get("FocusGroupName") || "");
  if (tgt !== me() || !/^ItemNipples/.test(grp)) return;
  const k = mode === "own" ? kindOfName(name) : null;
  if (k) { nipsUsed(src, k); return; }
  if (src && src !== me() && /^(Suck|Nibble|Lick|Kiss)/.test(name) && onSuckled) onSuckled(src);
}

export function initNipples(mod) {
  // the game's lists are there once you're logged in; LSCG gets first go (it hands us its handle: lscg.js)
  setTimeout(() => { try { if (!mode) addOwn(mod); } catch (e) { console.warn("[Dispensary] the nipple actions:", e); } }, 8000);
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try {
        const data = args[0];
        if (data && data.Type === "Activity") onActivity(data);
        else if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me()) {
          const m = readMsg(data);
          if (m && m.type === "dispNips") onNips(data.Sender, m);
          else if (m && m.type === "dispIconsAsk") setTimeout(() => nipsTell(true), 600);
        }
      } catch (e) { console.warn("[Dispensary] nipples:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] nipples can't hear:", e); }
}
// (tests)
export const nipsState = () => ({ mode, others: [...others.entries()], told, names: Object.keys(ACTS).map(gameName), text: Object.assign({}, TEXT), lscg: !!lscgApi });
export const nipsAddOwn = (mod) => addOwn(mod);
