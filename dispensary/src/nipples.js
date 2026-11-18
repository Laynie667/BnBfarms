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
   • THE STRETCH THAT STAYS (Nov 18; Laynie: "if the stretching persist after the leeches are removed, it would make
     since to be able to use and fuck them, or creampie them too"; closin' up on their own: "up to the individual
     player with a toggle"). Held open (the Dilator, the leeches) they train: a tenth of a level every half hour toward
     how wide they're held, and a little more every time somethin' goes in. What's trained stays when the dose wears off
     or the leeches drop, and they're still open, still offered, still usable. Your switch, on to start: they close up
     slowly on their own, half a level a day once they've gone twelve hours unopened and unused. Close them up (the
     page, /dispensary nips close, or a Tightening Balm somebody doses you with) puts them back as they were.
   • CREAMPIES: when somebody who's been fuckin' your nipple cums (their own Dispensary knows: they went over within a
     minute and a half of it), it tells yours (dispCream). It wells back out: a line for the room, cum on your chest for
     everybody with the Companion, and a count of your own (loads in your tits). On the farm the farm girl's told
     (dispNipLoad): her own count, and it comes back out with your milk.
*/
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { LSCG_ID } from "./config.js";
import { active, xOfDose, end } from "./doses.js";
import { mine, nipsFed, letGo } from "./parasites.js";
import { st, save } from "./store.js";
import { allowed } from "./ladder.js";
import { action } from "./say.js";
import { LINES } from "./lines.js";
import { local, pick, fill, nameOf } from "./say.js";

const W = window;
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const charOf = (mn) => (mn === me() ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
const inRoom = () => W.CurrentScreen === "ChatRoom" && typeof W.ServerSend === "function";
const others = new Map();   // member → { n, at }

// how wide they're held open right now (the Dilator, the leeches): 0 to 3
function heldOpen() {
  let n = active("dilator") ? Math.max(1, Math.min(3, xOfDose("dilator"))) : 0;
  const p = mine().nips;
  if (p) n = Math.max(n, (p.n || 0) >= 3 ? 3 : 2);
  return n;
}
// THE STRETCH THAT STAYS: st().nipTrain { lvl (0 to 3), at (last looked at), open (last held open), used (last used) }
const MIN = 60000, HOUR = 3600000, DAY = 86400000;
export const TRAIN = { step: 0.1, every: 30 * MIN, cock: 0.15, finger: 0.05, grace: 12 * HOUR, perDay: 0.5 };
const trainOf = () => st().nipTrain || (st().nipTrain = { lvl: 0, at: Date.now(), open: 0, used: 0 });
export const trainedLevel = () => Math.max(0, Math.min(3, Math.floor(((st().nipTrain || {}).lvl || 0) + 1e-9)));
// how open yours are: 0 shut, 1 to 3 (held open, or trained to stay that way)
export function nipsOpen() { return Math.max(heldOpen(), trainedLevel()); }
// every few seconds: held open they train; left be (with your switch on) they close up slowly
export function nipsTrainTick(now) {
  now = now || Date.now();
  const T = trainOf(), held = heldOpen(), dt = Math.max(0, Math.min(now - (T.at || now), 15 * MIN));
  T.at = now;
  if (held > 0) { T.open = now; if (T.lvl < held) T.lvl = Math.min(held, T.lvl + TRAIN.step * dt / TRAIN.every); }
  else if (st().nipsHeal !== false && T.lvl > 0 && now - Math.max(T.open || 0, T.used || 0) > TRAIN.grace) T.lvl = Math.max(0, T.lvl - TRAIN.perDay * dt / DAY);
}
// put them back as they were: the Dilator out, the leeches off, the stretch gone
export function nipsClose(quiet) {
  const was = nipsOpen();
  st().nipTrain = { lvl: 0, at: Date.now(), open: 0, used: 0 };
  try { if (active("dilator")) end("dilator", "quiet"); } catch (e) { /* fine */ }
  try { if (mine().nips) letGo("nips", "quiet"); } catch (e) { /* fine */ }
  save(); nipsTell(false);
  if (!quiet && was) local("Your nipples close up again, snug and tender, as if they'd never been stretched.");
  return was;
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
const tellPage = (detail) => { try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail })); } catch (e) { /* fine */ } };
let shown = -1;   // (what the page was last told about yours: the Companion draws them again when it changes)
export function nipsTell(force) {
  const n = nipsOpen();
  if (n !== shown) { shown = n; tellPage({ type: "nips", from: me(), n }); }
  if (!inRoom() || (!force && n === told) || (force && !n)) return false;
  told = n;
  try { W.ServerSend("ChatRoomChat", makeMsg("dispNips", { n })); return true; } catch (e) { return false; }
}
function onNips(from, m) {
  const n = Math.max(0, Math.min(3, Math.round(Number(m.n) || 0))), was = openOf(from);
  if (n) others.set(from, { n, at: Date.now() }); else others.delete(from);
  if (was !== n) tellPage({ type: "nips", from, n });   // (the Companion draws them again)
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
const lastIn = new Map();   // who's been fuckin' your nipples, and when (a creampie's only taken from them)
export function nipsUsed(from, kind) {
  if (from && from !== me()) nipsFed(from, kind);   // the leeches feed (parasites.js)
  const now = Date.now();
  { const T = trainOf(); T.used = now; T.lvl = Math.min(3, T.lvl + (kind === "cock" ? TRAIN.cock : TRAIN.finger)); save(); }   // (it trains them wider)
  if (kind === "cock" && from && from !== me()) lastIn.set(from, now);
  if (now - usedAt > 3 * 60000) { usedAt = now; const L = LINES.nips && LINES.nips[!from || from === me() ? "self" : kind === "cock" ? "fucked" : "fingered"]; if (L && L.length) local(fill(pick(L), { by: from && from !== me() ? nameOf(from) : "you" })); }
}

// ── CREAMPIES ──
const CREAM_WINDOW = 90 * 1000;
let lastFuck = null;   // { target, at }: the nipple you last fucked
function fucked(target) { if (target && target !== me()) lastFuck = { target: Number(target), at: Date.now() }; }
// you went over: a load in the nipple you were just fuckin' (their Dispensary takes it)
function onMyClimax() {
  const f = lastFuck; lastFuck = null;
  if (!f || Date.now() - f.at > CREAM_WINDOW || W.ActivityOrgasmRuined) return;
  if (!hasCock(W.Player) || !charOf(f.target)) return;
  try { W.ServerSend("ChatRoomChat", makeMsg("dispCream", {}, f.target)); } catch (e) { return; }
  local(fill(pick(LINES.nips.came), { by: nameOf(f.target) }));
}
let onFarmLoad = null;   // (farm.js: tell the farm girl)
export function nipsOnFarmLoad(f) { onFarmLoad = f; }
// a load in your tit: from somebody who was just in it
function onCream(from) {
  const at = lastIn.get(from); if (!at || Date.now() - at > 3 * 60000) return;
  lastIn.delete(from);
  const S = st(); S.nipLoads = (S.nipLoads || 0) + 1; const by = S.nipLoadsBy || (S.nipLoadsBy = {}); by[from] = (by[from] || 0) + 1;
  const keys = Object.keys(by); if (keys.length > 40) delete by[keys[0]];
  save();
  action(fill(pick(LINES.nips.creamed), { by: nameOf(from) }));
  try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail: { type: "leak", mess: "cum", areas: ["chest"], amount: 1 } })); } catch (e) { /* fine */ }
  if (onFarmLoad) { try { onFarmLoad(from); } catch (e) { /* fine */ } }
}
export const nipLoads = () => ({ n: st().nipLoads || 0, by: Object.assign({}, st().nipLoadsBy || {}) });

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
        onSend: ({ target }) => { try { if (k === "cock") fucked(target); } catch (e) { /* fine */ } },
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
        if (/FarmDisp_NippleFuck$/.test(String(d.Content)) && src === me()) fucked(tgt);   // (for a creampie)
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
          else if (m && m.type === "dispCream") onCream(data.Sender);
          else if (m && m.type === "dispIconsAsk") setTimeout(() => nipsTell(true), 600);
        }
      } catch (e) { console.warn("[Dispensary] nipples:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] nipples can't hear:", e); }
  // you went over: a creampie, if you'd just been fuckin' somebody's nipple
  try { mod.hookFunction("ActivityOrgasmStart", 2, (args, next) => { try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer()) setTimeout(() => onMyClimax(), 300); } catch (e) { /* fine */ } return next(args); }); } catch (e) { /* fine */ }
}
// (tests)
export const nipsState = () => ({ mode, others: [...others.entries()], told, names: Object.keys(ACTS).map(gameName), text: Object.assign({}, TEXT), lscg: !!lscgApi, train: Object.assign({}, st().nipTrain || {}), lastFuck });
export const nipsCream = (from) => onCream(from);
export const nipsClimax = () => onMyClimax();
export const nipsAddOwn = (mod) => addOwn(mod);
