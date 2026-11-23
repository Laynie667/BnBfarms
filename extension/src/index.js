/* WHAT'S IN THIS FILE (index.js)
   The Companion's front door: connects to the farm bot with hidden messages, sends your commands,
   routes what comes back (answers, notices, yes/no, docs, outfits, voice) to the panel, and says so if
   nothin' comes back.
*/
// Farmhand Companion: the player-side extension for B&B Farm.
// When the farm bot is in my room, I tell it I'm here; from then on it sends me your live state
// (roles, keys, switches, numbers), its answers, yes/no questions, and staff lookups as hidden
// messages, and the panel shows them in the right place instead of whispers and beeps.
import sdkModule from "bondage-club-mod-sdk";
import { registerInk } from "../../shared/ink/ink.js";
// the farm's counts for your live ink (state.ink from the farm girl), to whichever add-on carries the ink
const inkCounts = (c) => { try { if (c && window.__farmInk && typeof window.__farmInk.counts === "function") window.__farmInk.counts(c); } catch (e) { console.warn("[Farmhand Companion] ink counts:", e); } };
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { VERSION } from "./version.js";
import { speciesKeyOf } from "../../shared/species.js";
import { mooify } from "../../shared/noises.js";
import { BOT_MEMBER, HELLO_EVERY_MS, PREFS_KEY } from "./config.js";
import { Panel } from "./panel.js";
import { captureOutfit, wearOutfit, topUpOutfit, changeBack, hasBackup } from "./outfits.js";
import { markBody, washMarks, rinseMarks, stripMe, dressMe, syncFarmGear, syncShape, scaleTrialCleanup, treatiseCleanup, farmPieceIn, gearFreedHere, farmGearLetGo, ECHO_TELEPORTER } from "./marks.js";
import { initBelly } from "./belly.js";
import { initDrawnBody, onBodyMsg, onFarmLook, farmLookWanted, drawnBodyFarmState, drawnBodyFillCheck, drawnBodyRedrawFor } from "./drawnbody.js";
import { initStatue, onStatueMsg, statueCheck } from "./statue.js";
import { initMesses, onMessMsg, messFromMark, messWash, messRinse, messBrand } from "./messes.js";
import { initMemlog } from "./memlog.js";
import { initNetGuard } from "./netguard.js";
import { initHomeward, homeKeep, homeLocalPass, homeWantOut, homeSafe } from "./homeward.js";
import { initBotScreen, screenNapping } from "./botscreen.js";
import { initAllocWatch } from "./allocwatch.js";
import { initTrim } from "./trimpics.js";
import { initLocalSave } from "./localsave.js";
import { initChatlog, logRow } from "./chatlog.js";
import { initKeys, onWardMsg } from "./keys.js";
import { hardPrefsOf, setHardPrefsOn } from "./hardlock.js";
import { initSettings } from "./settings.js";
import { nurseryWear, nurseryOff, nurseryWorn, nurseryChange, nurseryPowderTick, nurseryStatsNow } from "./nursery.js";
import { trophyNews, trophyNext, trophyAnswered, trophyWear, trophyOff, trophyWorn } from "./trophies.js";
import { initCues, cueOff, lead, face, sound, trance, drawMarkers, arouse, vibe, initBody, reinsState } from "./cues.js";

// the SDK ships as an old-style module; this digs the real thing out either way
const bcModSdk = sdkModule.default || sdkModule;

// Two copies installed (an old pasted one and one from the GitHub link): the second can't start, and the mod
// loader's own "already loaded" error doesn't say why. Say it plainly, in chat, once, and step aside.
function twoCopies(running) {
  const note = "🌾 Two copies of the Farmhand Companion are installed" + (running ? " (v" + running + " is running, v" + VERSION + " stepped aside)" : "") +
    ". Open Tampermonkey's dashboard and delete the older one, then reload.";
  console.warn("[Farmhand Companion] " + note);
  const t = setInterval(() => {
    if (window.CurrentScreen !== "ChatRoom" || typeof window.ChatRoomSendLocal !== "function") return;
    clearInterval(t);
    try { const p = window.document.createElement("div"); p.style.cssText = "color:#c9a35b;white-space:pre-wrap"; p.textContent = note; window.ChatRoomSendLocal(p.outerHTML); } catch (e) { /* the console has it */ }
  }, 3000);
  throw new Error("Farmhand Companion: another copy is already running");
}
if (window.__farmhandCompanion) twoCopies(window.__farmhandCompanion);
let mod;
try {
  mod = bcModSdk.registerMod({ name: "FarmhandCompanion", fullName: "B&B Farm Farmhand Companion", version: VERSION });
} catch (e) {
  if (/already|registered|loaded/i.test(String(e && e.message))) twoCopies(null);
  throw e;
}
window.__farmhandCompanion = VERSION;
registerInk(window, mod);   // the ink and brand slots in the wardrobe (shared/ink/ink.js): before anyone's outfit loads

const st = { panel: null, welcomed: false, lastHello: 0, parts: new Map() };
// Moo Juice: about half the words turn into the noise your animal makes (shared/noises.js, the Dispensary uses it too)

// simpler words for somebody who's gone under: depth 2 trims the longest words, 3 trims more and drops the capitals,
// 4 and 5 leave short words and little sighs
function dumbDown(text, depth) {
  const max = depth >= 4 ? 4 : depth === 3 ? 6 : 8, fillers = ["mm", "uh", "...", "nn"];
  let out = String(text).replace(/[A-Za-z']+/g, (w) => {
    if (w.length <= max) return w;
    if (depth >= 4) return Math.random() < 0.5 ? fillers[Math.floor(Math.random() * fillers.length)] : w.slice(0, 3) + "...";
    return Math.random() < (depth === 3 ? 0.7 : 0.4) ? w.slice(0, Math.max(3, max - 2)) + "..." : w;
  });
  if (depth >= 3) out = out.toLowerCase();
  return out;
}
const botHere = () =>
  window.CurrentScreen === "ChatRoom" &&
  Array.isArray(window.ChatRoomCharacter) &&
  window.ChatRoomCharacter.some((c) => c.MemberNumber === BOT_MEMBER);

// the Companion on the bot's OWN account (both scripts on one page): talk to the bot directly
const onBotAccount = () => !!(window.Player && window.Player.MemberNumber === BOT_MEMBER);
const direct = () => onBotAccount() && window.Farmhand && typeof window.Farmhand.own === "function";
// THE FARM'S OWN INK (Nov 18, shared/ink/ink.js): what the farm girl says should be inked on you, put on (or taken off)
// by your own game, with "Farm can ink me" on. Her list comes in your panel state (farmInk); it's checked again every
// few minutes, so marker and henna come off once they've worn away.
function inkSync() {
  try {
    const I = window.__farmInk, s = st.lastState; if (!I || typeof I.farm !== "function" || !s || !st.gotState) return;
    let hard = false; try { const D = window.FarmhandDispensary; hard = !!(D && typeof D.hard === "function" && D.hard()); } catch (e) { /* fine */ }
    const r = I.farm(Array.isArray(s.farmInk) ? s.farmInk : [], !!(st.panel && st.panel.prefs.ink), { hard });
    if (!r) return;
    const name = (d) => String(d).replace(/([a-z])([A-Z])/g, "$1 $2");
    if (r.put.length) toChat("🔥 The farm's ink is on you now: " + r.put.map(name).join(", ") + ". It's in your wardrobe's Farm Brand and Farm Ink slots.", "#c79bd8");
    if (r.taken.length) toChat("🔥 The farm wanted its brand (" + r.taken.map(name).join(", ") + ") in your Farm Brand slot, but you've your own there. Take yours off and it'll go on.", "#c79bd8");
    if (r.full.length) toChat("🖋️ The farm wanted to ink " + r.full.map(name).join(", ") + " on you, but your four Farm Ink slots are full.", "#c79bd8");
  } catch (e) { console.warn("[Farmhand Companion] farm ink:", e); }
}
// a trophy the farm's just handed you (trophies.js): a line in chat, once; the offer itself waits in the panel
function trophyTell(list) {
  try { const t = trophyNews(list); if (t) { toChat(t, "#d9a400"); if (st.panel) st.panel.renderSoon(); } } catch (e) { console.warn("[Farmhand Companion] trophies:", e); }
}
// the farm's brand the old way (messes.js draws it): not when it's off, and not when it's already in your brand slot
function brandShown(b) {
  if (st.panel && st.panel.prefs.brandOff) return null;
  try { if (window.__farmInk && typeof window.__farmInk.farmBrandWorn === "function" && window.__farmInk.farmBrandWorn()) return null; } catch (e) { /* fine */ }
  return b;
}
// (every five minutes; in hardcore every minute, so the farm's ink pulled off is back on at once)
let inkTicks = 0;
setInterval(() => { inkTicks++; if (!st.gotState) return; let hard = false; try { const D = window.FarmhandDispensary; hard = !!(D && typeof D.hard === "function" && D.hard()); } catch (e) { /* fine */ } if (hard || inkTicks % 5 === 0) inkSync(); }, 60000);

function toBot(type, data) {
  if (direct() && window.Farmhand.own(Object.assign({}, data, { type }))) return;
  window.ServerSend("ChatRoomChat", makeMsg(type, data, BOT_MEMBER));
}

// again: the panel I have doesn't match what the farm girl's patchin' (or I have none): ask for a whole one
function hello(again) {
  st.lastHello = Date.now();
  if (again) st.seq = 0;
  // relay: whether this Companion posts farm emotes about you as your own (Toggles, on unless you switch it off)
  // seq and sh: which panel and which store I hold, so she doesn't send them again if they're still right (Oct 27)
  // limbs: this game has Echo's Limb Teleportation Device, so a wild trap's kit can take your arms and legs (Nov 20)
  let limbs = false; try { limbs = typeof window.AssetGet === "function" && !!window.AssetGet(window.Player.AssetFamily || "Female3DCG", "ItemAddon", ECHO_TELEPORTER); } catch (e) { /* no */ }
  toBot("hello", { ver: VERSION, relay: !(st.panel && st.panel.prefs.noRelay), off: st.panel ? cueOff() : {}, seq: st.seq || 0, sh: st.storeH || "", w: !!st.welcomed, again: !!again, limbs });
}
// a patch that doesn't fit: ask once, not once per patch while the whole panel is on its way
function askWhole() {
  if (Date.now() - (st.wholeAt || 0) < 8000) return;
  st.wholeAt = Date.now();
  hello(true);
}
// the store's shelf, kept on this computer: after a reload she only sends it if it changed (11 KB saved each time)
const STORE_KEY = "fhc-store";
function loadStore() {
  try { const o = JSON.parse(window.localStorage.getItem(STORE_KEY) || "null"); if (o && Array.isArray(o.items) && typeof o.h === "string") { st.store = o.items; st.storeH = o.h; } } catch (e) { /* none saved */ }
}
function keepStore() {
  try { if (st.storeH) window.localStorage.setItem(STORE_KEY, JSON.stringify({ h: st.storeH, items: st.store })); } catch (e) { /* full or blocked: she'll send it again */ }
}

// emojis break in BC's chat, and round brackets make a line out-of-character (seen map-wide): chat lines get neither
const EMOJI = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[\uFE0F\u200D\u20E3])/gu;
const forChat = (s) => String(s).replace(EMOJI, "").replace(/[ \t]{2,}/g, " ").replace(/^([*]?)[ \t]+/gm, "$1").trim();
const inCharacter = (s) => String(s).replace(/\(/g, "[").replace(/\)/g, "]");

// The bot asks this Companion to post a farm emote about YOU as your own emote ("**…" in BC: no name in
// front), so exactly the people who can see you see it. Only ever a line that names you; never speech.
// If it can't (you switched it off, an owner rule blocks emotes, or too many at once), the bot is told
// and sends it privately to the people near you instead.
function relay(m) {
  const text = inCharacter(forChat(m.text || "")).slice(0, 900);
  const P = window.Player || {}, names = [P.Nickname, P.Name].filter(Boolean).map((n) => String(n).toLowerCase());
  const now = Date.now();
  st.relayed = (st.relayed || []).filter((t) => now - t < 60000);
  const blocked = typeof window.ChatRoomOwnerPresenceRule === "function" && (() => { try { return window.ChatRoomOwnerPresenceRule("BlockEmote", null); } catch (e) { return false; } })();
  const ok = text && names.some((n) => text.toLowerCase().includes(n)) && !st.panel.prefs.noRelay && !blocked && st.relayed.length < 8;
  if (!ok) { toBot("relayNo", { id: m.id }); return; }
  st.relayed.push(now);
  window.ServerSend("ChatRoomChat", { Type: "Emote", Content: "*" + text });
}

function sendCommand(text, typed) {
  text = String(text || "").trim();
  if (!text) return;
  // (homeward.js) a roam pass asked for: a permanent contract's door is shut, so the Companion walks them out; a safeword:
  // nobody whistles them home for a while
  try { if (/^roam (start|go|now|on)$/i.test(text)) homeWantOut(); if (/^(safe|safeword|red)$/i.test(text)) homeSafe(); } catch (e) { /* fine */ }
  if (botHere()) {
    if (!st.welcomed) hello();
    toBot("cmd", typed ? { text } : { text, btn: true });   // btn: a button or switch, never an answer to a question
    // if nothin' comes back, say so: a quiet failure is the hardest kind to find
    const sentAt = Date.now();
    st.lastSent = sentAt;
    setTimeout(() => {
      if (st.lastHeard >= sentAt || st.lastSent !== sentAt) return;
      st.panel.add("No answer to \"" + text + "\" yet. The farm girl may be busy, or not runnin' the newest bot. " +
        (st.welcomed ? "If it keeps happenin', tell staff which button it was." : "She hasn't said hello to this panel yet: is her script on?"), "notice");
    }, 10000);
  } else {
    // a safeword away from the farm (Nov 20): the farm's gear goes on in any room, and a beep can go astray, so everything
    // she put on comes off right here, now, and stays off (marks.js), as well as tellin' her
    if (/^(safe|safeword|red)$/i.test(text)) {
      const n = farmGearLetGo((st.panel && st.panel.s && st.panel.s.farmGear) || []);
      if (n) { parasiteSync(); st.panel.add("🛑 Safeword: every bit of the farm's gear comes off you now, right here. It stays off.", "notice"); }
    }
    // not in the farm right now: a beep still reaches the bot, and it beeps back
    window.ServerSend("AccountBeep", { MemberNumber: BOT_MEMBER, BeepType: "", Message: text });
    st.panel.add("The farm girl isn't in your room, so I beeped her. Her answer comes back as a beep.", "notice");
  }
}
// somebody else took a wild trap's kept piece off you: the farm girl's told now, or as soon as she's in your room
// (it's already off for good here: marks.js). Kept on this computer so a reload doesn't lose it
const FREED_Q = "fhc-freed-queue";
function gearFreedTell(name, by) {
  let q; try { q = JSON.parse(window.localStorage.getItem(FREED_Q)) || []; } catch (e) { q = []; }
  if (name) q.push({ name: String(name).slice(0, 30), by: Number(by) || 0, at: Date.now() });
  q = q.filter((x) => Date.now() - x.at < 31 * 86400000).slice(-40);
  if (q.length && botHere()) { for (const x of q) toBot("gearFreed", { name: x.name, by: x.by }); q = []; }
  try { window.localStorage.setItem(FREED_Q, JSON.stringify(q)); } catch (e) { /* fine */ }
}

// a long card can arrive in pieces; glue 'em back together
function collect(m) {
  if (!m.of || m.of <= 1) return String(m.text || "");
  const got = st.parts.get(m.id) || [];
  got[m.part - 1] = String(m.text || "");
  st.parts.set(m.id, got);
  if (got.filter((x) => x !== undefined).length < m.of) return null;
  st.parts.delete(m.id);
  return got.join("\n");
}

// a line in YOUR chat log only (nobody else sees it); text goes in as text, never as code
function toChat(text, color, italic) {
  if (typeof window.ChatRoomSendLocal !== "function") return false;
  const p = window.document.createElement("div");
  p.style.cssText = "color:" + color + ";white-space:pre-wrap;margin:0.25em 0" + (italic ? ";font-style:italic" : "");
  p.textContent = forChat(text);
  window.ChatRoomSendLocal(p.outerHTML);
  return true;
}

// real farm gear (a trap's plug, cups, the clamp, the parasite…): on your character while the farm's list says so,
// off the moment it doesn't (marks.js). Checked on every state update and once a minute.
function parasiteSync() {
  try {
    const s = st.panel && st.panel.s;
    if (!st.gotState || !s || window.CurrentScreen !== "ChatRoom") return;
    // (never more than once every 2.5 seconds: a run of state updates used to put your gear on, and send it, each time)
    const gap = Date.now() - (st.gearSyncAt || 0);
    if (gap < 2500) { if (!st.gearSyncT) st.gearSyncT = setTimeout(() => { st.gearSyncT = null; parasiteSync(); }, 2600 - gap); return; }
    st.gearSyncAt = Date.now();
    let list = Array.isArray(s.farmGear) ? s.farmGear : [];
    // an older farm girl only says "parasite": that's still a piece of gear
    if (!Array.isArray(s.farmGear) && s.parasite && s.parasite.until > Date.now())
      list = [{ slot: s.parasite.form === "belt" ? "belt" : "lips", name: s.parasite.form === "belt" ? "Parasite Belt" : "Parasite Lips", always: true, color: "#E0607F", until: s.parasite.until, desc: "It feeds its host serum and drinks every load." }];
    const did = syncFarmGear(list, !!st.panel.prefs.gear);
    if (botHere()) gearFreedTell(null);   // (any freein' she hasn't heard about yet)
    try { syncShape(st.panel.s && st.panel.s.shape, !!st.panel.prefs.shape); } catch (e2) { console.warn("[Farmhand Companion] body shape:", e2); }   // chest and hips that show the farm's sizes (marks.js)
    for (const n of did.on) toChat("The farm puts somethin' on you: " + n + ".", "#c9a35b", true);
    for (const n of did.off) toChat(n + " comes off.", "#c9a35b", true);
    for (const n of (did.stuck || [])) toChat("The farm's " + n + " keeps comin' off you, so it's left off for ten minutes.", "#c9a35b", true);
  } catch (e) { console.warn("[Farmhand Companion] farm gear:", e); }
}
// a little's paddin' (ABCL) and Littlish Club grown-ups, sent to the farm when it changes (only for littles on the nursery list)
let nurseryLast = "", nurseryLastAt = 0;
function nurseryStatsSend(force) {
  try {
    const n = st.panel && st.panel.s && st.panel.s.nursery;
    if (!n || n.role !== "little" || !botHere()) return;
    const s = nurseryStatsNow(), key = JSON.stringify(s);
    if (!force && key === nurseryLast && Date.now() - nurseryLastAt < 10 * 60000) return;
    if (!s.abcl && !s.mommy && !(s.carers || []).length && !force) return;
    nurseryLast = key; nurseryLastAt = Date.now();
    toBot("nurseryStats", s);
  } catch (e) { console.warn("[Farmhand Companion] nursery stats:", e); }
}
function onFarmMsg(m) {
  if (m.type === "body" || m.type === "bodyAsk") { try { onBodyMsg(m); } catch (e) { console.warn("[Farmhand Companion] drawn body:", e); } return; }   // another Companion's drawn body (drawnbody.js)
  if (m.type === "statue" || m.type === "statueAsk") { try { onStatueMsg(m); } catch (e) { console.warn("[Farmhand Companion] statue:", e); } return; }   // somebody under the Statue Serum (statue.js)
  if (m.type === "mess" || m.type === "messAsk") { try { onMessMsg(m); } catch (e) { console.warn("[Farmhand Companion] messes:", e); } return; }   // another Companion's messes (messes.js)
  if (/^disp(Hard|Ask|KeyState)$/.test(m.type)) { try { onWardMsg(m.from, m); } catch (e) { console.warn("[Farmhand Companion] keys:", e); } return; }   // somebody's Dispensary hardcore names you a keyholder (keys.js)
  if (m.from !== BOT_MEMBER) return;     // only the farm bot gets to talk to the panel
  if (!/^(ping|state|stateDiff|store|roomlines)$/.test(m.type)) st.lastHeard = Date.now();   // (an answer to somethin' you sent)
  switch (m.type) {
    case "ping": hello(); break;
    case "welcome":
      st.welcomed = true;
      try { const at = onBotAccount() ? null : farmLookWanted(m.look); if (at != null) toBot("bodyFarmAsk", { at }); } catch (e) { /* the drawn body isn't loaded */ }   // the farm's look for the drawn body (drawnbody.js)
      st.panel.setWelcome(m);
      if (!m.proto || m.proto < 2) {
        // an older bot never sends the panel your roles, so Staff and Dashboard can't show: say so
        st.panel.setStatus("connected · farm girl v" + m.ver + " (needs updatin')");
        st.panel.add("The farm girl is runnin' an older bot (v" + m.ver + ") that doesn't send this panel your roles, keys or numbers, " +
          "so only the basic panel shows. Update farmhand-bot.user.js on HER browser (the bot's account), then reload her page.", "notice");
      } else {
        st.panel.setStatus("connected · farm girl v" + m.ver);
        // the bot sends your state right after hello; if it doesn't come, say so
        setTimeout(() => { if (!st.gotState) st.panel.add("Connected, but the farm girl hasn't sent your roles yet. If Staff or Dashboard don't show up, reload the page.", "notice"); }, 12000);
      }
      break;
    case "bodyFarm":
      try { if (!onBotAccount()) onFarmLook(m); } catch (e) { console.warn("[Farmhand Companion] farm look:", e); }   // (on the bot's own account, its settings ARE the farm's look)
      break;
    case "store":   // the store's shelf, on its own and only when it changes (Oct 26: it was most of every panel update)
      if (Array.isArray(m.items)) {
        st.store = m.items; st.storeH = typeof m.h === "string" ? m.h : ""; keepStore();
        if (st.lastState) { st.lastState = Object.assign({}, st.lastState, { store: st.store }); st.panel.setState(st.lastState); }
      }
      break;
    case "stateDiff":   // only the parts of your panel that changed (Oct 26)
      // base: the panel this patch goes on. Missed one (or have none)? Ask for a whole panel instead (Oct 27)
      if (st.lastState && m.set && typeof m.set === "object" && (m.base == null || m.base === st.seq)) {
        const s = Object.assign({}, st.lastState, m.set); for (const k of (Array.isArray(m.del) ? m.del : [])) delete s[k];
        if (st.store) s.store = st.store;
        if (m.seq != null) st.seq = m.seq;
        st.lastState = s; st.panel.setState(s); parasiteSync(); try { if ("drawn" in m.set) drawnBodyFarmState(s.drawn); } catch (e) { /* fine */ }
        if ("farmInk" in m.set || (m.del || []).includes("farmInk")) inkSync();   // the farm's own ink (shared/ink)
        if ("brand" in m.set || (m.del || []).includes("brand") || "farmInk" in m.set) { try { messBrand(brandShown(s.brand)); } catch (e) { console.warn("[Farmhand Companion] brand:", e); } }   // the farm's brand (messes.js)
        if ("reins" in m.set || (m.del || []).includes("reins")) { try { reinsState(s.reins); } catch (e) { console.warn("[Farmhand Companion] reins:", e); } }   // on somebody's reins (cues.js)
        if ("ink" in m.set) inkCounts(s.ink);   // the counts your live ink prints (shared/ink)
        if ("trophies" in m.set) trophyTell(s.trophies);   // a trophy earned (trophies.js)
      } else askWhole();
      break;
    case "state":
      if (m.state && typeof m.state === "object" && !("store" in m.state) && st.store) m.state.store = st.store;
      if (m.state && typeof m.state === "object") { st.seq = m.seq != null ? m.seq : 0; st.lastState = m.state; st.gotState = true; st.panel.setState(m.state); parasiteSync(); inkSync(); trophyTell(m.state.trophies); try { messBrand(brandShown(m.state.brand)); } catch (e) { console.warn("[Farmhand Companion] brand:", e); } try { drawnBodyFarmState(m.state.drawn); } catch (e) { console.warn("[Farmhand Companion] drawn body size:", e); } try { reinsState(m.state.reins); } catch (e) { console.warn("[Farmhand Companion] reins:", e); } inkCounts(m.state.ink);
        // the farm girl's whistle (homeward.js): their roam rules, kept for when they're off the farm; and a pass it kept
        // for them while they were away, for her books now they're back
        try { homeKeep(m.state); const l = homeLocalPass(); if (l) toBot("roamSpent", l); } catch (e) { console.warn("[Farmhand Companion] whistle:", e); } }
      break;
    case "reply":
    case "notice": {
      const text = collect(m);
      if (text === null) break;
      logRow("farm", BOT_MEMBER, text);   // the record (chatlog.js): the farm's answers in the panel count too
      st.panel.add(text, m.type);
      // farm messages you didn't ask for (tease lines, heat, summons…) also land in your chat,
      // so you see them even when the panel's closed (Toggles → "Farm messages in chat too")
      if (m.type === "notice" && st.panel.prefs.chatToo !== false) toChat(text, "#c9a35b");
      break;
    }
    case "doc": {
      const text = collect(m);
      if (text !== null) st.panel.addDoc({ text, kind: String(m.kind || "record"), who: String(m.who || "?"), about: m.about });
      break;
    }
    case "ask":
      st.panel.addAsk({ kind: String(m.kind || ""), text: String(m.text || "") });
      toChat(String(m.text || "") + "  (Yes / No in your 🌾 panel)", "#c9a35b");
      break;
    case "choose":
      st.panel.setChoose({ text: String(m.text || ""), choices: Array.isArray(m.choices) ? m.choices.map(String).slice(0, 30) : [] });
      toChat(String(m.text || "") + "  (pick in your 🌾 panel)", "#c9a35b");
      break;
    case "outfit":
      // back on the farm under a contract: only what's missin' goes back on (outfits.js topUpOutfit, Nov 23)
      if (m.auto && Array.isArray(m.topup)) {
        let r; try { r = topUpOutfit(String(m.data || ""), Array.isArray(m.keys) ? m.keys.filter(Number.isInteger) : [], m.topup.map(String)); } catch (e) { r = { ok: false, why: e.message }; }
        if (r.ok && r.worn) st.panel.add("👗 Back on the farm, and back in your farm outfit: " + r.worn + " piece" + (r.worn === 1 ? "" : "s") + " you'd come home without" + (r.locks ? ", padlocked on" : "") + ".", "notice");
        toBot("outfitAnswer", { answer: "topped", slot: String(m.slot || ""), worn: r.ok ? r.worn : 0, locks: r.ok ? r.locks : 0 });
        break;
      }
      // with a contract they've just signed: on at once, no second askin' (they can still change back from the panel)
      if (m.auto) { const ok = api.wear({ slot: String(m.slot || ""), label: String(m.label || "farm outfit"), data: String(m.data || ""), keys: Array.isArray(m.keys) ? m.keys.filter(Number.isInteger) : [] }); if (ok) toChat("👗 You've been dressed in your " + String(m.label || "farm outfit") + " for your new contract.", "#c9a35b"); break; }
      st.panel.setOutfit({ slot: String(m.slot || ""), label: String(m.label || "farm outfit"), desc: String(m.desc || "").slice(0, 1200), data: String(m.data || ""),
        keys: Array.isArray(m.keys) ? m.keys.filter(Number.isInteger) : [], why: String(m.why || "") });
      toChat("👗 The farm's offerin' you your " + String(m.label || "outfit") + ". Yes or Not now in your 🌾 panel.", "#c9a35b");
      break;
    case "mark": {
      // the farm marks your body (splatters, writing), strips you, dresses you or washes you, if your Toggles allow it (marks.js)
      let r = { ok: false };
      try {
        // a mess off the shelf they said yes to (or ?messes on) is drawn even with "Farm can mark my body" off
        const prefs = m.asked ? Object.assign({}, st.panel.prefs, { marks: true }) : st.panel.prefs;
        // the farm's own messes first, on their own: if takin' the game's splatters off failed on somebody's outfit, the
        // messes stayed on and ?wash "wouldn't let me clean all the messes on me" (Laynie, Oct 22)
        if (m.wash) { try { messWash(); } catch (e) { console.warn("[Farmhand Companion] wash:", e); } try { r = washMarks(); } catch (e) { console.warn("[Farmhand Companion] wash splatters:", e); r = { ok: true, did: ["mess"], why: e.message }; } }
        else if (m.rinse) { let d = []; try { if (messRinse()) d.push("mess"); } catch (e) { console.warn("[Farmhand Companion] rinse:", e); } try { d = d.concat(rinseMarks().did || []); } catch (e) { console.warn("[Farmhand Companion] rinse splatters:", e); } r = { ok: true, did: d }; }
        else if (m.strip) r = stripMe(prefs);
        else if (m.dress) r = dressMe();
        else {
          // our own mess, drawn by the Companion (messes.js), first and on its own: when the game's splatters below failed
          // on somebody's outfit, the mess never went on either, and nobody saw a thing (Laynie, Oct 20: the cake smash)
          let drew = false;
          try { if (prefs.marks && Array.isArray(m.splat) && m.splat.length) drew = messFromMark(m); } catch (e) { console.warn("[Farmhand Companion] mess:", e); }
          try { r = markBody(m, prefs); } catch (e) { console.warn("[Farmhand Companion] splatters:", e); r = { ok: drew, did: drew ? ["mess"] : [], why: e.message }; }
          if (drew && !r.ok) r = { ok: true, did: ["mess"], why: r.why || "" };
        }
      } catch (e) { r = { ok: false, why: e.message }; }
      toBot("markDone", { ok: !!r.ok, did: r.did || [], why: r.why || "" });
      break;
    }
    case "nursery": {
      // the nursery (nursery.js): a grown-up changed you, or is offerin' you a stuffie
      if (m.do === "change") { const did = nurseryChange(); if (did.length) toChat("🧷 Fresh and dry" + (did.includes("powder") ? ", with a puff of baby powder" : "") + ".", "#d98bb5", true); nurseryStatsSend(true); }
      else if (m.do === "offer") { st.panel.ui.nurseryOffer = { gear: String(m.gear || ""), label: String(m.label || "stuffie"), from: String(m.from || "A grown-up") }; st.panel.renderSoon(); toChat("🧸 " + String(m.from || "A grown-up") + " is holdin' out a " + String(m.label || "stuffie") + " for you. Hold it from your 🌾 panel's Nursery.", "#d98bb5", true); }
      break;
    }
    case "relay": relay(m); break;
    case "lead": lead(m); break;       // walk me there (cues.js)
    case "face": face(m); break;
    case "vibe": vibe(m); break;       // a scene turns the dial on a buzzin' toy you're wearin' (cues.js)
    case "arouse": arouse(m); break;   // a trap or a toy stirs you up, if you let the farm do that (cues.js)
    case "sound": sound(m); break;
    case "trance": trance(m); break;
    case "voice": {
      // only you see it, like a thought; nothin' goes to the room
      const line = String(m.text || "").slice(0, 300);
      if (!toChat("[Voice] " + line, "#a67fd4", true)) st.panel.add("[Voice] " + line, "notice");
      break;
    }
    case "roomlines":   // the same line for several people at once, sent to the whole room once: only the ones it names show it (Oct 27)
      if (!Array.isArray(m.to) || !window.Player || !m.to.includes(window.Player.MemberNumber)) break;
    // falls through
    case "roomline": {
      // a farm line said from a speaker spot near you: shown in your chat like any emote or chat line
      const line = String(m.text || "").slice(0, 1200);
      if (typeof window.ChatRoomSendLocal === "function") {
        const p = window.document.createElement("div");
        p.className = m.kind === "emote" ? "ChatMessage ChatMessageEmote" : "ChatMessage ChatMessageChat";
        p.style.cssText = m.kind === "emote" ? "font-style:italic" : "";
        p.textContent = forChat(m.kind === "emote" ? line : "Farm girl: " + line);
        window.ChatRoomSendLocal(p.outerHTML);
      } else st.panel.add(line, "notice");
      break;
    }
    case "logRows": {
      // the record, for the Log tab (views/log.js): sent in parts when it's long
      const ui = st.panel.ui, cur = ui.logRows && ui.logRows.id === m.id ? ui.logRows : { id: m.id, rows: [], total: 0 };
      cur.rows = cur.rows.concat(Array.isArray(m.rows) ? m.rows : []); cur.total = Number(m.total) || cur.rows.length;
      cur.busy = (Number(m.part) || 1) < (Number(m.of) || 1);
      ui.logRows = cur; st.panel.render();
      break;
    }
    case "outfitBack": {
      const r = changeBack({ farmLocks: !!m.farmLocks });   // (the outfit wheel's time is up: the farm opens its own padlocks)
      st.panel.add(r.ok ? "👗 Back in your own clothes" + (r.stillLocked ? " (farm-locked pieces stay till a keyholder opens 'em)" : "") + "." : "👗 " + r.why + ".", "notice");
      if (r.ok) toBot("outfitAnswer", { answer: "back" });
      break;
    }
  }
}

// what the panel can do besides send commands
const api = {
  wear(o) {
    let r;
    try { r = wearOutfit(o.data, o.keys); } catch (e) { r = { ok: false, why: "the game wouldn't take it (" + e.message + ")" }; }
    st.panel.add(r.ok ? "👗 Dressed in " + o.label + ": " + r.worn + " pieces" + (r.locks ? ", " + r.locks + " locked with high security padlocks" : "") +
      (r.skipped ? ". " + r.skipped + " spots were already locked, so I left 'em be" : "") + "." : "👗 Couldn't dress you: " + r.why + ".", "notice");
    if (r.ok) toBot("outfitAnswer", { answer: "worn", slot: o.slot, locks: r.locks });
    else toBot("outfitAnswer", { answer: "failed", slot: o.slot, why: String(r.why || "").slice(0, 200) });   // so the farm doesn't think you're dressed
    return !!r.ok;
  },
  decline(o) { toBot("outfitAnswer", { answer: "declined", slot: o.slot }); },
  // Say it: their words straight to the farm (or to staff) as a hidden message, so no gag, speech rule or trance
  // rewrites them on the way (Laynie, Oct 23: "speech impaired pets need a guaranteed way to be able to say what they need to say")
  say(text, to) {
    text = String(text || "").trim().slice(0, 300);
    if (!text) return false;
    if (!botHere()) { st.panel.add("👉 The farm girl isn't in this room, so nobody's there to hear it.", "notice"); return false; }
    if (!st.welcomed) hello();
    toBot("say", { text, to: to === "staff" ? "staff" : "farm" });
    st.panel.add("🗣️ You said" + (to === "staff" ? ", to staff" : "") + ": " + text, "mine");
    return true;
  },
  back() { onFarmMsg({ from: BOT_MEMBER, type: "outfitBack" }); },
  brandSync() { try { messBrand(brandShown(st.panel.s.brand)); } catch (e) { console.warn("[Farmhand Companion] brand:", e); } },
  inkSync() { inkSync(); try { messBrand(brandShown(st.panel.s.brand)); } catch (e) { /* fine */ } },
  // the nursery's stuffies and baby things, on your own character (nursery.js)
  nurseryWear(g) { try { return nurseryWear(g); } catch (e) { return { ok: false, why: e.message }; } },
  nurseryOff(group) { try { return nurseryOff(group); } catch (e) { return { ok: false, why: e.message }; } },
  nurseryWorn() { try { return nurseryWorn(); } catch (e) { return {}; } },
  // trophies: offered once, then kept to put on or take off any time (trophies.js, views/livestock.js)
  trophyNext, trophyAnswered, trophyWear, trophyOff, trophyWorn,
  save(slot) {
    let c;
    try { c = captureOutfit(); } catch (e) { st.panel.add("👗 Couldn't read what you're wearin': " + e.message, "notice"); return; }
    if (!c.items) { st.panel.add("👗 You're not wearin' any clothes or restraints to save, sugar.", "notice"); return; }
    toBot("outfitSave", { slot, data: c.data, items: c.items, locks: c.locks });
  },
  hasBackup,
  rehello: () => hello(),   // tell the bot a setting changed (the relay switch)
  // the Log tab asks the farm girl for the record (views/log.js)
  logAsk(q) { st.panel.ui.logRows = { id: 0, rows: [], total: 0, busy: true }; st.panel.render(); toBot("logAsk", q); },
  // map tool: the next `count` clicks on the game's map pick tiles instead of walkin' you there
  pickTiles(count, what, done) {
    if (typeof window.ChatRoomMapViewIsActive === "function" && !window.ChatRoomMapViewIsActive()) {
      st.panel.add("🗺️ Switch the room to map view first, then press the button again. (Walkin' to the spot and using the \"where I stand\" buttons still works too.)", "notice"); return;
    }
    if (typeof window.ChatRoomMapViewPixelToTileCoordinates !== "function") {
      st.panel.add("🗺️ This version of the game doesn't let me read map clicks. Use the \"where I stand\" buttons instead.", "notice"); return;
    }
    st.pick = { count, what, done, got: [] };
    st.panel.add("🗺️ Click " + (count > 1 ? "one corner of " : "the tile for ") + what + " on the map. You won't walk there. (Esc cancels.)", "notice");
    st.panel.toggle(false);   // out of the way of the map
  },
  cancelPick() { if (st.pick) { st.pick = null; st.panel.add("🗺️ Map pickin' cancelled.", "notice"); } },
};

// a map click while pickin': grab the tile, don't move the player
function pickClick() {
  if (!st.pick || window.MouseX > 1000) return false;                 // the right side is chat and buttons
  if (window.MouseX >= 790 && window.MouseY >= 860) return false;       // the game's move arrows
  const tile = window.ChatRoomMapViewPixelToTileCoordinates(window.MouseX, window.MouseY);
  if (!tile) return true;                                               // off the edge: swallow it, keep pickin'
  const p = st.pick;
  p.got.push({ X: tile.X, Y: tile.Y });
  if (p.got.length < p.count) { st.panel.add("🗺️ Got " + tile.X + "," + tile.Y + ". Now click the opposite corner.", "notice"); return true; }
  st.pick = null;
  try { p.done(p.got); } catch (e) { console.warn("[Farmhand Companion]", e); }
  st.panel.toggle(true);
  return true;
}

function start() {
  loadStore();
  st.panel = new Panel(sendCommand, api);
  initSettings(st.panel);   // Preferences → Extensions → Farmhand Companion (settings.js)
  // switched off on that page: nothin' else starts (the page stays, to switch it back on)
  if (st.panel.prefs.off) { st.panel.show(false); console.log("[Farmhand Companion] v" + VERSION + " is switched off (Preferences → Extensions → Farmhand Companion)"); return; }
  st.panel.setStatus("waitin' for the farm girl");
  initCues({ toBot, panel: st.panel, local: toChat });
  setInterval(parasiteSync, 60000);
  setInterval(() => { nurseryPowderTick(); nurseryStatsSend(false); }, 30000);   // a little's paddin' (ABCL) for the nursery, and the baby powder brushin' off
  initBelly(mod);  // the drawn-belly test (belly.js)
  initDrawnBody(mod);  // the drawn body from the outfit studio, on your own character (drawnbody.js)
  initStatue(mod);     // the Statue Serum, on you and on anybody else under it (statue.js)
  initMesses(mod);     // the farm's own messes on everybody (messes.js)
  initBotScreen(mod, () => (st.panel && st.panel.prefs) || {});   // on the bot's own account the room isn't drawn (botscreen.js)
  initAllocWatch(() => onBotAccount(), mod);   // the bot tab's flight recorder (allocwatch.js)
  // the record: what lands in your chat, your beeps and your commands, to the farm girl by the hour (chatlog.js).
  // Always for the proprietors; anybody else only with Toggles → "Send a record..." on.
  initChatlog(mod, { on: () => !!(st.panel && st.panel.s && st.panel.s.logMust) || !!(st.panel && st.panel.prefs.chatlog), botMn: BOT_MEMBER, botHere });
  initHomeward(mod, { botMn: BOT_MEMBER, say: (t) => toChat(t, "#c9a35b", true) });   // the farm girl's whistle: home from anywhere, no BC+ or friendin' needed (homeward.js)
  initNetGuard(mod);   // never 50 messages in a second (the server's cut-off), and every drop written down (netguard.js, /farmmem)
  initMemlog();        // a log of how big things are, for chasing a page that runs out of room (memlog.js, /farmmem)
  initLocalSave(VERSION, () => st.panel && st.panel.render && st.panel.render());   // your settings as a file in a folder you pick (localsave.js)
  initTrim(mod);       // the game never lets go of a picture: past 380 MB on the graphics card, old unused ones go (trimpics.js)
  setTimeout(() => scaleTrialCleanup(), 15000);   // what the old scale trial left on anybody (marks.js)
  // Echo's Body Treatise loops the game's own check since R134 and gets you cut off: one the farm wrote on comes off, once
  // you're in a room; one of your own gets a heads-up once a week (marks.js)
  const treatiseOnce = () => { if (window.CurrentScreen !== "ChatRoom" || !window.Player || !Array.isArray(window.Player.Appearance)) { setTimeout(treatiseOnce, 5000); return; } treatiseCleanup((t) => toChat(t, "#c9a35b", true)); };
  setTimeout(treatiseOnce, 15000);
  initBody(mod);   // slowed walkin' when you're carryin' a lot, and bein' held at the edge while denied (cues.js)
  // the bot hands this page's own-account messages straight here (see toBot above)
  window.__farmhandOwnPanel = (data) => { if (!onBotAccount()) return; const m = readMsg(data); if (m) { try { onFarmMsg(m); } catch (e) { console.warn("[Farmhand Companion]", e); } } };
  // on the bot's account with a bot too old for the direct link: say so instead of sittin' on the guest panel
  setTimeout(() => {
    if (onBotAccount() && !st.gotState) st.panel.add("This is the farm bot's own account. " + (window.Farmhand ? "The bot (v" + window.Farmhand.version + ") hasn't sent this panel your roles yet; update farmhand-bot.user.js to v0.13.1 or newer and reload." :
      "The bot script isn't running on this page. Install farmhand-bot.user.js here (it runs next to the Companion), then reload."), "notice");
  }, 30000);
  // staff map markers, drawn over the game's own map (never breaks the game's drawing)
  // (not over the farm girl's sleeping screen: botscreen.js)
  try { mod.hookFunction("ChatRoomMapViewDraw", 0, (args, next) => { const r = next(args); if (!screenNapping()) drawMarkers(); return r; }); }
  catch (e) { console.warn("[Farmhand Companion] map markers unavailable:", e); }

  // ROAM PASSES (bot 10uk-roam.js): under a summonable contract, the farm's exit only opens with a pass. Holdin' one,
  // tryin' the door starts it; none, and the door stays shut (Laynie, Oct 24: "our in house system prevents them from
  // leaving without a pass"). A safeword doesn't open it (Oct 24: "thats just reckless"); it's open when the farm girl's not here, and forced moves always work.
  const roamGate = () => {   // "open", "start" (they hold a pass: walkin' out spends it) or "shut"
    const s = st.panel && st.panel.s, ro = s && s.roam;
    if (!ro || !botHere() || (ro.until && ro.until > Date.now())) return "open";
    return ro.left > 0 ? "start" : "shut";
  };
  try {
    // the exit button (it's asked every frame, so no side effects here: just shut with no pass)
    mod.hookFunction("ChatRoomCanLeave", 5, (args, next) => { const ok = next(args); try { return ok && roamGate() !== "shut"; } catch (e) { return ok; } });
    // pressin' it
    mod.hookFunction("ChatRoomAttemptLeave", 5, (args, next) => {
      try {
        const g = roamGate();
        if (g === "start") sendCommand("roam start");
        if (g === "shut" && (!st.roamToldAt || Date.now() - st.roamToldAt > 15000)) { st.roamToldAt = Date.now(); st.panel.add("🧭 The farm gate's shut, sugar: leavin' takes a roam pass. ?buy roampass (" + ((st.panel.s.roam || {}).price || 30) + " ribbons), then try the door again.", "notice"); }
      } catch (e) { /* let the game decide */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] roam gate unavailable:", e); }

  mod.hookFunction("ChatRoomMessage", 10, (args, next) => {
    const m = readMsg(args[0]);
    if (m) { try { onFarmMsg(m); } catch (e) { console.warn("[Farmhand Companion]", e); } return; }
    return next(args);
  });
  // WHAT A WILD TRAP LEFT ON YOU (Nov 20, Laynie: "Id even let the gear remain til removed by someone else"): it's put back
  // if you pull it off yourself; when somebody ELSE takes it off you, the farm girl's told, and it stays off (marks.js)
  try {
    mod.hookFunction("ChatRoomSyncItem", 0, (args, next) => {
      const d = args[0]; let was = null;
      const same = (a, b) => !!a && !!b && String(a).slice(0, 30) === String(b).slice(0, 30);   // (the game keeps 30 letters of a piece's name)
      try {
        const me = window.Player && window.Player.MemberNumber, kept = ((st.panel && st.panel.s && st.panel.s.farmGear) || []).filter((g) => g && g.keep);
        if (kept.length && d && d.Item && d.Item.Target === me && typeof d.Source === "number" && d.Source !== me && typeof d.Item.Group === "string") {
          const n = farmPieceIn(d.Item.Group); was = (n && kept.find((k) => same(k.name, n))) || null;
        }
      } catch (e) { was = null; }
      const r = next(args);
      if (was) {
        try {
          if (!same(farmPieceIn(d.Item.Group), was.name)) { gearFreedHere(was.name, was.until); gearFreedTell(String(was.name), d.Source); }
        } catch (e) { console.warn("[Farmhand Companion] gear freed:", e); }
      }
      return r;
    });
  } catch (e) { console.warn("[Farmhand Companion] can't see who takes the farm's gear off:", e); }

  // GONE UNDER (the haze, the lantern, the mirror box): from depth 2 your words come out simpler on screen: long words
  // shorten or trail off, the deeper the more. And once the farm has put a word in your mouth (corruption 80), it
  // slips out on the end of one line in six. Only what you say out loud; never commands, whispers or emotes.
  try {
    mod.hookFunction("ServerSend", 3, (args, next) => {
      try {
        const d = args[1], s = st.panel && st.panel.s;
        if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && s && !/^\s*[(\[?!./\-*]/.test(d.Content)) {
          let text = d.Content;
          if (s.under >= 2) text = dumbDown(text, s.under);
          if (s.corrWord && Math.random() < 0.17) text = text.replace(/\s+$/, "") + " ..." + String(s.corrWord).slice(0, 20) + ".";
          if (s.corrNoise && Math.random() < 0.12) text = text.replace(/\s+$/, "") + " ..." + String(s.corrNoise).slice(0, 12) + ".";   // (corruption 70: the animal slips out too)
          if (text !== d.Content) args = [args[0], Object.assign({}, d, { Content: text })];
        }
      } catch (e) { /* say it plain, then */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] gone-under speech unavailable:", e); }
  // The parasite talks through its host: now and then (one line in five) somethin' it wants slips out with what you
  // said out loud. Only while its lips are on you; never commands, whispers, emotes or out-of-character lines.
  try {
    mod.hookFunction("ServerSend", 4, (args, next) => {
      try {
        const d = args[1], s = st.panel && st.panel.s;
        if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && s && Array.isArray(s.farmGear) &&
            s.farmGear.some((g) => g.slot === "lips" && g.name === "Parasite Lips" && g.until > Date.now()) && !/^\s*[(\[?!./\-*]/.test(d.Content) && Math.random() < 0.2) {
          const wants = ["...feed me.", "...more.", "...breed me.", "...need cum.", "...fill me.", "...so hungry.", "...use my mouth."];
          args = [args[0], Object.assign({}, d, { Content: d.Content.replace(/\s+$/, "") + " " + wants[Math.floor(Math.random() * wants.length)] })];
        }
      } catch (e) { /* say it plain, then */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] parasite speech unavailable:", e); }
  // Moo Juice, a farm potion: while it's in you (and only then), some of what you say out loud comes out as
  // your animal's noise. Commands, whispers, emotes and out-of-character lines are never touched.
  try {
    mod.hookFunction("ServerSend", 5, (args, next) => {
      try {
        const d = args[1], s = st.panel && st.panel.s;
        if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && s && Array.isArray(s.fx) &&
            s.fx.some((f) => f.id === "moo" && f.until > Date.now()) && !/^\s*[(\[?!./\-*]/.test(d.Content) &&
            !(window.FarmhandDispensary && window.FarmhandDispensary.active("moo")))   // (the Dispensary's doin' it: not twice)
          args = [args[0], Object.assign({}, d, { Content: mooify(d.Content, s.species) })];
      } catch (e) { console.warn("[Farmhand Companion] moo:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] moo juice unavailable:", e); }

  // map pickin' (Zones tab): a click on the map picks a tile instead of walkin'
  // (an older game without the map view mustn't stop the rest of the Companion from startin')
  try {
    mod.hookFunction("ChatRoomMapViewClick", 10, (args, next) => {
      let took = false;
      try { took = pickClick(); } catch (e) { console.warn("[Farmhand Companion]", e); st.pick = null; }
      return took ? undefined : next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] map clicks unavailable:", e); }
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && st.pick) api.cancelPick(); });

  // /keys: the hardcore keys you hold (keys.js; The Farmhand's Dispensary)
  initKeys((t) => toChat(t, "#c79bd8"));
  // your Dispensary in hardcore: the frozen switches for your keyholders' editor, and their word on them (hardlock.js)
  window.FarmhandCompanion = Object.freeze({
    version: VERSION,
    hardPrefs: () => hardPrefsOf(st.panel.prefs),
    setHardPrefs: (want) => {
      const p = st.panel.prefs;
      const said = setHardPrefsOn(p, want, (k, v) => { p[k] = v; }, (k) => {
        if (k === "brandOff") api.brandSync();
        if (k === "ink") { api.inkSync(); api.rehello(); }
        if (/^no/.test(k)) api.rehello();
      });
      if (said.length) { try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) { /* fine */ } st.panel.render(); }
      return said.map((x) => "Companion " + x);
    },
  });

  // THE FARMHAND'S DISPENSARY's new doses (Nov 17): Let-Down's leaks land as milk on your chest (only with "Farm can
  // mark my body" on, like any mess), and Fill-Out swells your drawn body while it lasts (drawnbody.js)
  window.addEventListener("farmhand-dispensary", (e) => {
    const d = e && e.detail; if (!d || typeof d !== "object") return;
    try {
      if (d.type === "leak" && st.panel.prefs.marks) messFromMark({ mess: typeof d.mess === "string" ? d.mess : "milk", splat: Array.isArray(d.areas) ? d.areas : ["chest"], amount: d.amount });
      if ((d.type === "dose" && d.id === "fillout") || d.type === "grow" || d.type === "seed") drawnBodyFillCheck();   // (Fill-Out, growth off the farm, and seed in you)
      if (d.type === "dose" && d.id === "statue") statueCheck();   // (the Statue Serum)
      if (d.type === "nips") drawnBodyRedrawFor(d.from);   // (nipples opened or closed: drawn again, Nov 18)
    } catch (err) { console.warn("[Farmhand Companion] the Dispensary's doses:", err); }
  });

  // /farm stats, /farm size... (BC eats lines that start with / otherwise)
  if (typeof window.CommandCombine === "function") {
    window.CommandCombine([{
      Tag: "farm",
      Description: "<command>: ask the B&B Farm girl, e.g. /farm stats",
      Action: (args) => { sendCommand(args, true); st.panel.toggle(true); },
    }]);
  }

  setInterval(() => {
    try { drawnBodyFillCheck(); } catch (e) { /* fine */ }   // (Fill-Out easin' off in its last minutes)
    const here = botHere();
    st.panel.show(window.CurrentScreen === "ChatRoom");
    if (!here) { if (st.welcomed) st.panel.setStatus("farm girl's not in this room"); st.welcomed = false; return; }
    if (!st.welcomed && Date.now() - st.lastHello > 15000) hello();
    else if (st.welcomed && Date.now() - st.lastHello > HELLO_EVERY_MS) hello();
  }, 3000);

  console.log("[Farmhand Companion] v" + VERSION + " loaded");
}

// wait for the game to be ready before buildin' the panel
const wait = setInterval(() => {
  if (typeof window.ServerSend === "function" && window.document && window.document.body) {
    clearInterval(wait);
    start();
  }
}, 1000);
