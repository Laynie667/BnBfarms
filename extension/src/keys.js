/* WHAT'S IN THIS FILE (keys.js)
   KEYS YOU HOLD, from the Companion (Laynie, Nov 17: "a keyholder, owner, proprieters companion needs to ping the
   hardcore users dispensary and companion atleast once every 30 days, otherwise, it will unlock after 30 days without
   the ping"). Somebody runnin' The Farmhand's Dispensary in hardcore, who names you as a keyholder (their owner, or a
   proprietor for farm stock), tells your add-on so when you share a room. Your Companion checks in for you, by itself,
   at most once an hour. And /keys lets you look after them without the Dispensary:
     /keys                     who you hold keys for (seen in a room with you), and when their hardcore lets go
     /keys check <who>         check in (in the room, or by beep)
     /keys letout <who>        every dose in them lifted
     /keys end <who>           their hardcore off
   <who> is a member number or a name. Only their Dispensary decides whether you really hold a key: this just asks.
*/
import { makeMsg } from "../../shared/protocol.js";

const W = window, KEY = "fhc-wards";
let wards = {};
try { wards = JSON.parse(W.localStorage.getItem(KEY)) || {}; } catch (e) { wards = {}; }
const save = () => { try { W.localStorage.setItem(KEY, JSON.stringify(wards)); } catch (e) { /* fine */ } };
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const here = (mn) => (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn);
let say = () => {};

function sendTo(mn, data) {
  try { if (here(mn) && typeof W.ServerSend === "function") { W.ServerSend("ChatRoomChat", makeMsg("dispKey", data, mn)); return true; } } catch (e) { /* fine */ }
  return false;
}
const WORDS = { check: "checked in on your hardcore", letout: "let you out: every dose lifted", end: "ended your hardcore" };
function keyDo(mn, what) {
  if (sendTo(mn, { do: what })) return "in the room";
  try {
    if (typeof W.ServerSend !== "function") return null;
    const nm = (W.Player && (W.Player.Nickname || W.Player.Name)) || "Your keyholder";
    W.ServerSend("AccountBeep", { MemberNumber: mn, BeepType: "", Message: "🗝️ " + nm + " " + WORDS[what] + ". [fd:" + what + "]" });
    return "by beep";
  } catch (e) { return null; }
}

// a ward's Dispensary, in the room with you
export function onWardMsg(from, m) {
  if (!m || typeof from !== "number" || from === me()) return false;
  if (m.type === "dispHard") {
    if (!Array.isArray(m.keys) || !m.keys.includes(me())) return true;
    if (!m.on) { if (wards[from]) { delete wards[from]; save(); } return true; }
    const was = wards[from], now = Date.now();
    wards[from] = Object.assign({}, was, { name: String(m.name || "").slice(0, 40), until: Number(m.until) || 0, due: Number(m.due) || 0, seen: now });
    if (!was || now - (was.checked || 0) > 3600000) { wards[from].checked = now; sendTo(from, { do: "check" }); }
    save();
    return true;
  }
  if (m.type === "dispAsk" && wards[from]) {
    wards[from].asked = Date.now(); save();
    say("🗝️ " + (wards[from].name || "#" + from) + " is askin' to be let out of hardcore. /keys letout " + from + " lifts every dose in them; /keys end " + from + " ends their hardcore.");
    return true;
  }
  return m.type === "dispKeyState";
}

function find(word) {
  const w = String(word || "").trim().toLowerCase(); if (!w) return null;
  if (/^\d+$/.test(w) && wards[Number(w)]) return Number(w);
  if (/^\d+$/.test(w)) return Number(w);   // not seen yet: their Dispensary still decides
  const hit = Object.entries(wards).find(([, x]) => (x.name || "").toLowerCase() === w) || Object.entries(wards).find(([, x]) => (x.name || "").toLowerCase().startsWith(w));
  return hit ? Number(hit[0]) : null;
}
const when = (t) => { if (!t) return "?"; const d = Math.ceil((t - Date.now()) / 86400000); return d <= 0 ? "today" : d === 1 ? "tomorrow" : "in " + d + " days"; };

export function keysCommand(args) {
  const [a0, ...rest] = String(args || "").trim().split(/\s+/), what = (a0 || "").toLowerCase();
  if (!what || what === "list") {
    const list = Object.entries(wards);
    say(list.length ? "🗝️ You hold keys for: " + list.map(([mn, x]) => (x.name || "#" + mn) + " (" + mn + ", " + (x.until ? "ends " : "lets go without a check-in ") + when(x.due) + (x.asked ? ", askin' to be let out" : "") + ")").join("; ") + ". /keys check|letout|end <who>."
      : "🗝️ Nobody's told your Companion you hold their key yet. It hears when you share a room with somebody in hardcore who names you.");
    return;
  }
  if (!WORDS[what]) { say("🗝️ /keys, /keys check <who>, /keys letout <who>, /keys end <who>."); return; }
  const mn = find(rest.join(" "));
  if (!mn) { say("🗝️ Who? A member number or the name of somebody you hold a key for."); return; }
  const how = keyDo(mn, what);
  if (wards[mn] && what === "check") { wards[mn].checked = Date.now(); save(); }
  if (wards[mn] && what === "end") { delete wards[mn]; save(); }
  say(how ? "🗝️ Sent " + how + ". Their Dispensary does it if you really hold their key." : "🗝️ Couldn't reach them just now.");
}

export function initKeys(sayLocal) {
  say = sayLocal;
  if (typeof W.CommandCombine === "function") {
    try { W.CommandCombine([{ Tag: "keys", Description: "[check | letout | end <who>]: the hardcore keys you hold (The Farmhand's Dispensary)", Action: (args) => keysCommand(args) }]); } catch (e) { /* fine */ }
  }
}
