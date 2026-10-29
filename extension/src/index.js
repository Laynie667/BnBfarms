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
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { VERSION } from "./version.js";
import { speciesKeyOf } from "../../shared/species.js";
import { BOT_MEMBER, HELLO_EVERY_MS } from "./config.js";
import { Panel } from "./panel.js";
import { captureOutfit, wearOutfit, changeBack, hasBackup } from "./outfits.js";
import { markBody, washMarks, stripMe, dressMe, syncFarmGear, syncShape, scaleTrialCleanup } from "./marks.js";
import { initBelly } from "./belly.js";
import { initDrawnBody, onBodyMsg, onFarmLook, farmLookWanted, drawnBodyFarmState } from "./drawnbody.js";
import { initMesses, onMessMsg, messFromMark, messWash, messBrand } from "./messes.js";
import { initMemlog } from "./memlog.js";
import { initTrim } from "./trimpics.js";
import { initLocalSave } from "./localsave.js";
import { initChatlog, logRow } from "./chatlog.js";
import { initSettings } from "./settings.js";
import { nurseryWear, nurseryOff, nurseryWorn, nurseryChange, nurseryPowderTick, nurseryStatsNow } from "./nursery.js";
import { initCues, cueOff, lead, face, sound, trance, drawMarkers, arouse, vibe, initBody } from "./cues.js";

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

const st = { panel: null, welcomed: false, lastHello: 0, parts: new Map() };
// Moo Juice: about half the words turn into the noise your animal makes
const NOISES = { cow: ["moo", "mooo", "mrrrm"], bull: ["moo", "hrrmph"], pony: ["neigh", "nicker", "whinny"], horse: ["neigh", "whinny", "nicker"],
  pup: ["arf", "woof", "awoo"], dog: ["woof", "arf", "ruff"], kitty: ["mew", "nya", "mrrp"], cat: ["meow", "mrrp", "purr"], bunny: ["squeak", "eep"],
  rabbit: ["squeak", "eep"], pig: ["oink", "snrk"], goat: ["baa", "maa"], sheep: ["baa", "baaa"], fox: ["yip", "ack"], wolf: ["awoo", "grr"],
  deer: ["bleat", "mweh"], goblin: ["heh", "nngh"], rat: ["squeak", "eek", "chitter"], dragon: ["rawr", "grr", "hsss"], kitt: ["mew", "nya", "mrrp"] };
function mooify(text, species) {
  const say = NOISES[String(species || "").toLowerCase()] || NOISES[speciesKeyOf(species)] || NOISES.cow;   // "catgirl", "ratslut" (shared/species.js)
  return String(text).replace(/[A-Za-z']{3,}/g, (w) => {
    if (Math.random() < 0.5) return w;
    const n = say[Math.floor(Math.random() * say.length)];
    return w[0] === w[0].toUpperCase() ? n[0].toUpperCase() + n.slice(1) : n;
  });
}

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
function toBot(type, data) {
  if (direct() && window.Farmhand.own(Object.assign({}, data, { type }))) return;
  window.ServerSend("ChatRoomChat", makeMsg(type, data, BOT_MEMBER));
}

function hello() {
  st.lastHello = Date.now();
  // relay: whether this Companion posts farm emotes about you as your own (Toggles, on unless you switch it off)
  toBot("hello", { ver: VERSION, relay: !(st.panel && st.panel.prefs.noRelay), off: st.panel ? cueOff() : {} });
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
    // not in the farm right now: a beep still reaches the bot, and it beeps back
    window.ServerSend("AccountBeep", { MemberNumber: BOT_MEMBER, BeepType: "", Message: text });
    st.panel.add("The farm girl isn't in your room, so I beeped her. Her answer comes back as a beep.", "notice");
  }
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
    let list = Array.isArray(s.farmGear) ? s.farmGear : [];
    // an older farm girl only says "parasite": that's still a piece of gear
    if (!Array.isArray(s.farmGear) && s.parasite && s.parasite.until > Date.now())
      list = [{ slot: s.parasite.form === "belt" ? "belt" : "lips", name: s.parasite.form === "belt" ? "Parasite Belt" : "Parasite Lips", always: true, color: "#E0607F", until: s.parasite.until, desc: "It feeds its host serum and drinks every load." }];
    const did = syncFarmGear(list, !!st.panel.prefs.gear);
    try { syncShape(st.panel.s && st.panel.s.shape, !!st.panel.prefs.shape); } catch (e2) { console.warn("[Farmhand Companion] body shape:", e2); }   // chest and hips that show the farm's sizes (marks.js)
    for (const n of did.on) toChat("The farm puts somethin' on you: " + n + ".", "#c9a35b", true);
    for (const n of did.off) toChat(n + " comes off.", "#c9a35b", true);
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
  if (m.type === "mess" || m.type === "messAsk") { try { onMessMsg(m); } catch (e) { console.warn("[Farmhand Companion] messes:", e); } return; }   // another Companion's messes (messes.js)
  if (m.from !== BOT_MEMBER) return;     // only the farm bot gets to talk to the panel
  if (m.type !== "ping" && m.type !== "state") st.lastHeard = Date.now();
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
    case "state":
      if (m.state && typeof m.state === "object") { st.gotState = true; st.panel.setState(m.state); parasiteSync(); try { messBrand(st.panel.prefs.brandOff ? null : m.state.brand); } catch (e) { console.warn("[Farmhand Companion] brand:", e); } try { drawnBodyFarmState(m.state.drawn); } catch (e) { console.warn("[Farmhand Companion] drawn body size:", e); } }
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
  brandSync() { try { messBrand(st.panel.prefs.brandOff ? null : st.panel.s.brand); } catch (e) { console.warn("[Farmhand Companion] brand:", e); } },
  // the nursery's stuffies and baby things, on your own character (nursery.js)
  nurseryWear(g) { try { return nurseryWear(g); } catch (e) { return { ok: false, why: e.message }; } },
  nurseryOff(group) { try { return nurseryOff(group); } catch (e) { return { ok: false, why: e.message }; } },
  nurseryWorn() { try { return nurseryWorn(); } catch (e) { return {}; } },
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
  initMesses(mod);     // the farm's own messes on everybody (messes.js)
  // the record: what lands in your chat, your beeps and your commands, to the farm girl by the hour (chatlog.js).
  // Always for the proprietors; anybody else only with Toggles → "Send a record..." on.
  initChatlog(mod, { on: () => !!(st.panel && st.panel.s && st.panel.s.logMust) || !!(st.panel && st.panel.prefs.chatlog), botMn: BOT_MEMBER, botHere });
  initMemlog();        // a log of how big things are, for chasing a page that runs out of room (memlog.js, /farmmem)
  initLocalSave(VERSION, () => st.panel && st.panel.render && st.panel.render());   // your settings as a file in a folder you pick (localsave.js)
  initTrim(mod);       // the game never lets go of a picture: past 380 MB on the graphics card, old unused ones go (trimpics.js)
  setTimeout(() => scaleTrialCleanup(), 15000);   // what the old scale trial left on anybody (marks.js)
  initBody(mod);   // slowed walkin' when you're carryin' a lot, and bein' held at the edge while denied (cues.js)
  // the bot hands this page's own-account messages straight here (see toBot above)
  window.__farmhandOwnPanel = (data) => { if (!onBotAccount()) return; const m = readMsg(data); if (m) { try { onFarmMsg(m); } catch (e) { console.warn("[Farmhand Companion]", e); } } };
  // on the bot's account with a bot too old for the direct link: say so instead of sittin' on the guest panel
  setTimeout(() => {
    if (onBotAccount() && !st.gotState) st.panel.add("This is the farm bot's own account. " + (window.Farmhand ? "The bot (v" + window.Farmhand.version + ") hasn't sent this panel your roles yet; update farmhand-bot.user.js to v0.13.1 or newer and reload." :
      "The bot script isn't running on this page. Install farmhand-bot.user.js here (it runs next to the Companion), then reload."), "notice");
  }, 30000);
  // staff map markers, drawn over the game's own map (never breaks the game's drawing)
  try { mod.hookFunction("ChatRoomMapViewDraw", 0, (args, next) => { const r = next(args); drawMarkers(); return r; }); }
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
            s.fx.some((f) => f.id === "moo" && f.until > Date.now()) && !/^\s*[(\[?!./\-*]/.test(d.Content))
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

  // /farm stats, /farm size... (BC eats lines that start with / otherwise)
  if (typeof window.CommandCombine === "function") {
    window.CommandCombine([{
      Tag: "farm",
      Description: "<command>: ask the B&B Farm girl, e.g. /farm stats",
      Action: (args) => { sendCommand(args, true); st.panel.toggle(true); },
    }]);
  }

  setInterval(() => {
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
