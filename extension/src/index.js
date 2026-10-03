// Farmhand Companion: the player-side extension for B&B Farm.
// When the farm bot is in my room, I tell it I'm here; from then on it sends its
// answers to me as hidden messages and I show 'em in the farm panel, so nothin'
// gets lost in whispers or beeps.
import sdkModule from "bondage-club-mod-sdk";
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { VERSION } from "./version.js";
import { BOT_MEMBER, HELLO_EVERY_MS } from "./config.js";
import { Panel } from "./panel.js";

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
  toBot("hello", { ver: VERSION });
}

function sendCommand(text) {
  text = String(text || "").trim();
  if (!text) return;
  if (botHere()) {
    if (!st.welcomed) hello();
    toBot("cmd", { text });
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

function onFarmMsg(m) {
  if (m.from !== BOT_MEMBER) return;
  switch (m.type) {
    case "ping": hello(); break;
    case "welcome":
      st.welcomed = true;
      st.panel.setStatus("connected · bot v" + m.ver);
      break;
    case "reply":
    case "notice": {
      const text = collect(m);
      if (text !== null) st.panel.add(text, m.type);
      break;
    }
  }
}

function start() {
  st.panel = new Panel(sendCommand);
  st.panel.setStatus("waitin' for the farm girl");

  mod.hookFunction("ChatRoomMessage", 10, (args, next) => {
    const m = readMsg(args[0]);
    if (m) { try { onFarmMsg(m); } catch (e) { console.warn("[Farmhand Companion]", e); } return; }
    return next(args);
  });

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
