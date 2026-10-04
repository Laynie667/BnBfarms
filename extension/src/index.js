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
import { BOT_MEMBER, HELLO_EVERY_MS } from "./config.js";
import { Panel } from "./panel.js";
import { captureOutfit, wearOutfit, changeBack, hasBackup } from "./outfits.js";

// the SDK ships as an old-style module; this digs the real thing out either way
const bcModSdk = sdkModule.default || sdkModule;

const mod = bcModSdk.registerMod({
  name: "FarmhandCompanion",
  fullName: "B&B Farm Farmhand Companion",
  version: VERSION,
});

const st = { panel: null, welcomed: false, lastHello: 0, parts: new Map() };

const botHere = () =>
  window.CurrentScreen === "ChatRoom" &&
  Array.isArray(window.ChatRoomCharacter) &&
  window.ChatRoomCharacter.some((c) => c.MemberNumber === BOT_MEMBER);

function toBot(type, data) {
  window.ServerSend("ChatRoomChat", makeMsg(type, data, BOT_MEMBER));
}

function hello() {
  st.lastHello = Date.now();
  // relay: whether this Companion posts farm emotes about you as your own (Toggles, on unless you switch it off)
  toBot("hello", { ver: VERSION, relay: !(st.panel && st.panel.prefs.noRelay) });
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

function sendCommand(text) {
  text = String(text || "").trim();
  if (!text) return;
  if (botHere()) {
    if (!st.welcomed) hello();
    toBot("cmd", { text });
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

function onFarmMsg(m) {
  if (m.from !== BOT_MEMBER) return;     // only the farm bot gets to talk to the panel
  if (m.type !== "ping" && m.type !== "state") st.lastHeard = Date.now();
  switch (m.type) {
    case "ping": hello(); break;
    case "welcome":
      st.welcomed = true;
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
    case "state":
      if (m.state && typeof m.state === "object") { st.gotState = true; st.panel.setState(m.state); }
      break;
    case "reply":
    case "notice": {
      const text = collect(m);
      if (text === null) break;
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
      st.panel.setOutfit({ slot: String(m.slot || ""), label: String(m.label || "farm outfit"), data: String(m.data || ""),
        keys: Array.isArray(m.keys) ? m.keys.filter(Number.isInteger) : [], why: String(m.why || "") });
      toChat("👗 The farm's offerin' you your " + String(m.label || "outfit") + ". Yes or Not now in your 🌾 panel.", "#c9a35b");
      break;
    case "relay": relay(m); break;
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
    case "outfitBack": {
      const r = changeBack();
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
  },
  decline(o) { toBot("outfitAnswer", { answer: "declined", slot: o.slot }); },
  back() { onFarmMsg({ from: BOT_MEMBER, type: "outfitBack" }); },
  save(slot) {
    let c;
    try { c = captureOutfit(); } catch (e) { st.panel.add("👗 Couldn't read what you're wearin': " + e.message, "notice"); return; }
    if (!c.items) { st.panel.add("👗 You're not wearin' any clothes or restraints to save, sugar.", "notice"); return; }
    toBot("outfitSave", { slot, data: c.data, items: c.items, locks: c.locks });
  },
  hasBackup,
  rehello: () => hello(),   // tell the bot a setting changed (the relay switch)
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
  st.panel.setStatus("waitin' for the farm girl");

  mod.hookFunction("ChatRoomMessage", 10, (args, next) => {
    const m = readMsg(args[0]);
    if (m) { try { onFarmMsg(m); } catch (e) { console.warn("[Farmhand Companion]", e); } return; }
    return next(args);
  });

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
      Action: (args) => { sendCommand(args); st.panel.toggle(true); },
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
