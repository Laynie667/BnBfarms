// THE RECORD (Oct 19). Laynie: "to help with diagnostics, we can add a toggle that is opt-in ... to send a record of
// commands sent to and recieved from the bot that would send a copy of everything that user recieves, beeps and
// whispers on their screen in chat to the bot to be saved hourly as a log file, omiting duplicate entries acorss
// multiple sources ... mandatory atleast for the proprieters".
// What's kept: every line that lands in your chat log (chat, whispers, emotes, actions, the farm's lines), the beeps you
// get, the commands you send the farm (typed or from the panel) and the farm's answers in the panel. The same words
// arriving twice (the farm's answer in the panel and in your chat, a beep shown in chat too) are kept once. They go to
// the farm girl once a minute, privately (only she gets them), and she saves them by the hour.
// Off unless you switch it on (Toggles → This panel), except for the farm's proprietors, where it's always on.
import { makeMsg, FARM_MSG } from "../../shared/protocol.js";

const W = window, KEY = "farmhand-chatlog", MAX = 1500, CHUNK = 6000;
let rows = [], sdk = null, on = () => false, botMn = 0, botHere = () => false, saveT = null;
const recent = new Map();   // the words, squashed → when they were last kept (for the duplicates)
try { const v = JSON.parse(W.localStorage.getItem(KEY)); if (Array.isArray(v)) rows = v.slice(-MAX); } catch (e) { rows = []; }
function saveSoon() { clearTimeout(saveT); saveT = setTimeout(() => { try { W.localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) { rows = rows.slice(-300); } }, 2000); }
const squash = (t) => String(t).toLowerCase().replace(/\s+/g, " ").replace(/[^\p{L}\p{N} ]/gu, "").trim().slice(0, 240);

// k: chat · whisper · emote · action · activity · beep · beep-out · cmd · farm · local · server · …
export function logRow(k, f, x) {
  try {
    if (!on()) return;
    x = String(x == null ? "" : x).replace(/\s+/g, " ").trim();
    if (!x) return;
    const n = squash(x), now = Date.now();
    if (n) {
      const t0 = recent.get(n);
      if (t0 && now - t0 < 90000) return;   // the same words from another source: kept once
      recent.set(n, now);
      if (recent.size > 800) for (const [kk, tt] of recent) if (now - tt > 90000) recent.delete(kk);
    }
    rows.push({ t: now, k: String(k).slice(0, 12), f: Number(f) || 0, x: x.slice(0, 600) });
    if (rows.length > MAX) rows = rows.slice(-MAX);
    saveSoon();
  } catch (e) { /* never in the way */ }
}
export function chatlogCount() { return rows.length; }

// once a minute: what's waiting goes to the farm girl, in pieces small enough to send
function flush() {
  if (!on() || !rows.length || !botHere() || typeof W.ServerSend !== "function") return;
  let sent = 0;
  for (let part = 0; part < 4 && rows.length; part++) {
    const batch = []; let size = 0;
    while (rows.length && batch.length < 120) { const r = rows[0], s = JSON.stringify(r).length; if (size + s > CHUNK && batch.length) break; batch.push(rows.shift()); size += s; }
    try { W.ServerSend("ChatRoomChat", makeMsg("chatlog", { rows: batch }, botMn)); sent += batch.length; }
    catch (e) { rows = batch.concat(rows); break; }
  }
  if (sent) saveSoon();
}

export function initChatlog(mod, opts) {
  sdk = mod; on = opts.on; botMn = opts.botMn; botHere = opts.botHere;
  // every line that lands in the chat log, as it lands
  try {
    sdk.hookFunction("ChatRoomAppendChat", 0, (args, next) => {
      try {
        const div = args[0];
        if (div && div.classList && on()) {
          const cls = Array.from(div.classList).find((c) => /^ChatMessage[A-Z]/.test(c) && c !== "ChatMessageName") || "ChatMessageChat";
          logRow(cls.replace(/^ChatMessage/, "").toLowerCase().replace("localmessage", "local").replace("servermessage", "server"), div.dataset && div.dataset.sender, div.textContent);
        }
      } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] record: chat log unavailable:", e); }
  // beeps, shown in chat or not
  try {
    sdk.hookFunction("ServerAccountBeep", 0, (args, next) => {
      try {
        const d = args[0];
        if (d && on() && !d.BeepType) {
          const msg = typeof d.Message === "string" ? d.Message : "";
          if (!/^\s*[{[]/.test(msg)) logRow("beep", d.MemberNumber, (d.MemberName || "") + (msg ? ": " + msg : " beeped you"));
        }
      } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] record: beeps unavailable:", e); }
  // what you send: beeps out, and the commands the panel sends the farm (your typed ones show in your chat already)
  try {
    sdk.hookFunction("ServerSend", 0, (args, next) => {
      try {
        const [ev, d] = args;
        if (on() && d) {
          if (ev === "AccountBeep" && !d.BeepType && typeof d.Message === "string" && d.Message && !/^\s*[{[]/.test(d.Message)) logRow("beep-out", d.MemberNumber, d.Message);
          else if (ev === "ChatRoomChat" && d.Type === "Hidden" && d.Content === FARM_MSG && d.Dictionary && d.Dictionary.type === "cmd") logRow("cmd", botMn, "?" + String(d.Dictionary.text || ""));
        }
      } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] record: sending unavailable:", e); }
  setInterval(flush, 60000);
  setTimeout(flush, 15000);
}
