/* WHAT'S IN THIS FILE (visor.js)
   THE FARM'S VISOR (Nov 25; Laynie: "For the hypnotic visor items in bc and echoes, what if we built on a subliminal set
   of effects… renders nothing else map wise, in combination with our session and binaurals beats? with a onscreen
   button to turn the visor off… for hardcore mode players, is locked until a set number of sessions is finished";
   "pictures and gifs being links, as long as it points at the pictures address"; "once a visor is built, its settings
   should be locked in unless the crafter changes them"; "The button needs to be a small icon").
   • WEARIN' ONE: any item you wear whose crafted description says "farm visor: #code" (BC's visors, Echoes', anything).
     The room goes dark: no map, nobody else, just one body (the crafter's, or your own, as they picked), the crafter's
     pictures see-through underneath, subliminal words fadin' in and out, and the farm's trance on top (LSCG's own in the
     farm's name if you let the farm in, its beats if you turned them on). Sessions from the farm's public list play one
     after another while it's on. The chat stays. A small icon in the corner takes it off.
   • HARDCORE (the Dispensary's): the icon stays locked till the visor's number of full sessions are done. The crafter or
     your keyholders can open it early (/visor unlock <name> in their Companion). Your safeword always ends it.
   • ON THE FARM, a finished session counts toward your conditioning tiers and feeds the farm's pull.
   • THE VISOR MAKER (Settings › 🌀 Visor maker): pick sessions from the farm's list, how many before a hardcore wearer
     can take it off, whose body, the words, the pictures, how strong. It gives you a line for the item's description.
     The code in it is a fingerprint of those settings (shared/visor.js), so the visor stays as you built it.
   • Words never strobe: one at most every 2 seconds, under a second each, never bright. "Calm trance look": they drift.
   • THE LOOK (Nov 25, Laynie: "i love those, so yes please… More effects too… similar to HSC"; "the close up effect of
     the face"): the crafter picks a spiral (ten kinds, slow, behind the body or over it), what happens in the chat
     (whispers between lines, other voices meltin' or fadin', a spiral turnin' over it), lines to write out (counted
     here, never sent, and they can count toward the lock), and more: voices floatin' by, the farm's voice over the
     head, breath, tunnel vision, a pink bloom, a meltin' warp, ripples, a watchin' crowd, a kaleidoscope, risin' hearts,
     an aura, a trance meter, a close-up of the face, the view comin' in to it. All of it's in the code, so it's locked
     in too. Nothin' flashes; the calm look slows it all and holds the spiral still.
   • The body's drawn from BC's own character canvas (R134: 700 over the body, the body's 1000, 150 under the feet).
   • WHAT STAYS WITH THEM (Nov 25, Laynie picked "1, 5-8, 10, 11, 12"; this is 1, 10, 11 and 12, the room's are next):
     a pet name (their name in the room while it holds, and their trigger), the visor comin' back on its own (hardcore:
     the icon holds it off only till they next log in or join a room), an afterimage after it comes off, and the
     sinkin' (stronger the more hours it's worn). Their safeword ends all of it and gives their own name back.
*/
import { LS, onAccount } from "./acct.js";
import { BOT_MEMBER } from "./config.js";
import { makeMsg } from "../../shared/protocol.js";
import { parseLibrary, planSession, sessionSteps, fillIn, LEVELS } from "../../shared/trance-script.js";
import { STARTER } from "../../shared/trance-starter.js";
import { normTuning, tuningCode, codeOk, codeIn, descLine, okLink, PUBLIC_BASE, VISOR_KINDS, MAX_SESSIONS, lookOf, SPIRALS, SPINS, PLACES, CHAT_FX, FX, LOOK_DEFAULTS } from "../../shared/visor.js";
import { onHypno, tranceVoice, tranceState, onTranceEnd, oocOf } from "./trance.js";
import { h, card, title, muted, btn } from "./dom.js";

const W = window;
const CACHE_KEY = "fhc-visor-tunings", DONE_KEY = "fhc-visor-done", MAKER_KEY = "fhc-visor-maker", LINES_KEY = "fhc-visor-lines";
const NAME_KEY = "fhc-visor-name", AFTER_KEY = "fhc-visor-after", HOURS_KEY = "fhc-visor-hours", OFF_KEY = "fhc-visor-off";
const LOAD_ID = Math.random().toString(36).slice(2, 10);   // (this page load: a hardcore visor taken off comes back on the next one)
let ctx = null;   // { toBot, toChat, prefs(), botHere(), mod }
const V = { lib: null, sets: {}, listAt: 0, listFrom: "", cache: {}, done: {}, lines: {}, on: null, off: {}, unlocked: {}, asked: {}, run: null, el: null, timers: [], ivs: [], wordT: null, picT: null, drawT: null,
  raf: 0, lastF: 0, lastB: 0, spun: false, depth: 0, geo: null, obs: null, obsOn: null, wm: null, L: null,
  name: null, nameBack: "", nameAt: 0, dropAt: 0, after: null, afterEl: null, afterT: null, hours: {}, hourAt: 0, hoursAt: 0, joins: 0, room: "", miss: 0, fed: [] };

export function initVisor(c) {
  ctx = c;
  load();
  onAccount(() => { stop(true); V.unlocked = {}; load(); afterDraw(); });
  onTranceEnd(() => safeword("🌀 The visor lets go of you."));   // the safeword (the farm's, or LSCG's)
  // the game's own safeword ends it too, always
  const mod = ctx.mod;
  if (mod) for (const f of ["ChatRoomSafewordRevert", "ChatRoomSafewordRelease"]) {
    try { mod.hookFunction(f, 20, (args, next) => { try { safeword("🌀 Your safeword: the visor lets go of you."); } catch (e) { /* fine */ } return next(args); }); } catch (e) { /* an older game */ }
  }
  if (typeof W.CommandCombine === "function") {
    try { W.CommandCombine([{ Tag: "visor", Description: "unlock <name> · name <name> · reset <name>: open a farm visor early, give its wearer their own name back, or start its sinkin' over (you crafted it, or you hold their key)", Action: (args) => command(String(args || "")) }]); } catch (e) { /* fine */ }
  }
  // writin' lines: a line that matches the visor's, typed out loud, is counted here and never goes to the room
  if (mod) {
    try {
      mod.hookFunction("ServerSend", 12, (args, next) => {
        try {
          const d = args[1], L = V.on && lookOf(V.on.t);
          if (L && L.lines && L.linesNeed && (V.lines[V.on.code] || 0) < L.linesNeed && args[0] === "ChatRoomChat" && d && (d.Type === "Chat" || d.Type === "Whisper") && typeof d.Content === "string" && normLine(d.Content) === normLine(L.lines)) {
            const n = V.lines[V.on.code] = Math.min(L.linesNeed, (V.lines[V.on.code] || 0) + 1); keepLines(); icon();
            ctx.toChat(n >= L.linesNeed ? "✍ " + n + " of " + L.linesNeed + ". That's all of them. Good." : "✍ " + n + " of " + L.linesNeed + ". Good. Again.", "#c39be0", true);
            return;
          }
        } catch (e) { /* say it plain, then */ }
        return next(args);
      });
    } catch (e) { console.warn("[Farmhand Companion] visor lines:", e); }
  }
  // other people's voices while it's on: meltin' (words lost), and floatin' by across the dark (never out-of-character lines)
  const reg = () => {
    if (typeof W.ChatRoomRegisterMessageHandler !== "function") { setTimeout(reg, 3000); return; }
    try {
      W.ChatRoomRegisterMessageHandler({ Priority: 225, Description: "B&B Farm visor voices", Callback: (data, sender, msg) => {
        try {
          if (!data || !sender || typeof msg !== "string") return false;
          const me = W.Player && W.Player.MemberNumber, ty = data.Type;
          if (sender.MemberNumber === me || sender.MemberNumber === BOT_MEMBER || msg.includes("(")) return false;
          // their pet name, said by somebody in the room: down they go (while the name holds, worn or after)
          if ((ty === "Chat" || ty === "Whisper" || ty === "Emote") && nameHeard(msg)) dropName(sender);
          if (!V.on || (ty !== "Chat" && ty !== "Whisper")) return false;
          const L = look();
          if (L.fx.includes("float")) floatBy(String(sender.Nickname || sender.Name || "") + ": " + msg);
          if (rungs().some((r) => r.fed)) feed(msg);
          if (L.chat.includes("melt")) return { msg: melt(msg) };
        } catch (e) { /* fine */ }
        return false;
      } });
    } catch (e) { console.warn("[Farmhand Companion] visor voices:", e); }
  };
  reg();
  setInterval(check, 2000);
  setTimeout(publicList, 4000);
}
const normLine = (s) => String(s).toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
function keepLines() { try { LS.setItem(LINES_KEY, JSON.stringify(V.lines)); } catch (e) { /* fine */ } }
// words lost from somebody else's line: some go to "…", some to the visor's own words
function melt(msg) {
  const words = wordsOf();
  return String(msg).split(" ").map((w) => (Math.random() < 0.28 ? (Math.random() < 0.55 ? "…" : pick(words)) : w)).join(" ");
}

// ── what's kept on this computer ─────────────────────────────
function load() {
  try { const c = JSON.parse(LS.getItem(CACHE_KEY)); V.cache = c && typeof c === "object" ? c : {}; } catch (e) { V.cache = {}; }
  for (const [code, t] of Object.entries(V.cache)) if (!codeOk(code, t)) delete V.cache[code];   // (only ever ones that match their code)
  try { const d = JSON.parse(LS.getItem(DONE_KEY)); V.done = d && typeof d === "object" ? d : {}; } catch (e) { V.done = {}; }
  try { const l = JSON.parse(LS.getItem(LINES_KEY)); V.lines = l && typeof l === "object" ? l : {}; } catch (e) { V.lines = {}; }
  const obj = (k) => { try { const v = JSON.parse(LS.getItem(k)); return v && typeof v === "object" ? v : null; } catch (e) { return null; } };
  V.name = obj(NAME_KEY); V.after = obj(AFTER_KEY); V.hours = obj(HOURS_KEY) || {}; V.off = obj(OFF_KEY) || {};
  if (V.name && !V.name.pet) V.name = null;
}
const keepJson = (k, v) => { try { if (v == null) LS.removeItem(k); else LS.setItem(k, JSON.stringify(v)); } catch (e) { /* fine */ } };
const keepName = () => keepJson(NAME_KEY, V.name), keepAfter = () => keepJson(AFTER_KEY, V.after), keepHours = () => keepJson(HOURS_KEY, V.hours), keepOff = () => keepJson(OFF_KEY, V.off);
function keepCache() { const k = Object.keys(V.cache); for (const x of k.slice(0, Math.max(0, k.length - 50))) delete V.cache[x]; try { LS.setItem(CACHE_KEY, JSON.stringify(V.cache)); } catch (e) { /* fine */ } }
function keepDone() { try { LS.setItem(DONE_KEY, JSON.stringify(V.done)); } catch (e) { /* fine */ } }
function remember(code, t) { if (!codeOk(code, t)) return false; V.cache[code] = normTuning(t); keepCache(); return true; }

// ── the farm's public list (published from the trance studio onto GitHub), the starter library till there is one ──
export async function publicList(force) {
  if (!force && V.lib && Date.now() - V.listAt < 3600000) return V.lib;
  V.listAt = Date.now();
  try {
    if (typeof W.fetch !== "function") throw new Error("no fetch");
    const [t, s] = await Promise.all([W.fetch(PUBLIC_BASE + "library.txt", { cache: "no-store" }), W.fetch(PUBLIC_BASE + "sets.json", { cache: "no-store" })]);
    if (!t.ok) throw new Error("no list yet");
    const lib = parseLibrary(await t.text());
    if (!lib.blocks.some((b) => b.kind === "session" && b.labels.visor && !b.bad)) throw new Error("no visor sessions");
    V.lib = lib; V.listFrom = "the farm's list";
    try { const sets = s.ok ? await s.json() : {}; V.sets = {}; for (const [n, l] of Object.entries(sets || {})) { const g = (Array.isArray(l) ? l : []).filter(okLink); if (g.length) V.sets[String(n).slice(0, 40)] = g.slice(0, 20); } } catch (e) { V.sets = {}; }
  } catch (e) {
    if (!V.lib) { V.lib = parseLibrary(STARTER); V.listFrom = "the starter library"; }
  }
  return V.lib;
}
const library = () => V.lib || (V.lib = parseLibrary(STARTER), V.listFrom = "the starter library", V.lib);
export const visorSessions = () => library().blocks.filter((b) => b.kind === "session" && !b.bad && b.labels.visor).map((b) => ({ name: b.name, level: b.labels.level && b.labels.level.length ? b.labels.level : LEVELS }));

// ── are you wearin' one ──────────────────────────────────────
export function wornVisor() {
  const P = W.Player; if (!P || !Array.isArray(P.Appearance)) return null;
  for (const it of P.Appearance) {
    const c = it && it.Craft, code = c && codeIn(c.Description);
    if (code) return { code, crafter: Number(c.MemberNumber) || 0, item: String(c.Name || (it.Asset && it.Asset.Name) || "visor").slice(0, 40) };
  }
  return null;
}
const isBot = () => !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
export function check() {
  try {
    if (!ctx || isBot() || !W.Player || !W.Player.MemberNumber) return;   // (nobody logged in yet)
    const room = (W.ChatRoomData && W.ChatRoomData.Name) || "";
    if (room && room !== V.room) V.joins++;   // (joined a room: a hardcore visor taken off comes back)
    V.room = room;
    // their own switch: "Farm visors" off and a farm visor's just a visor (somebody else may have put it on them); its name and afterimage go too
    if ((ctx.prefs() || {}).noVisor) {
      if (V.on) stop(false, "🌀 Farm visors are switched off for you: the room comes back.");
      if (V.name) giveName("🌀 Farm visors are switched off for you: your own name comes back.");
      if (V.after) { V.after = null; keepAfter(); afterDraw(); }
      onIcon(null);
      return;
    }
    visorCheck();
    nameTick(); afterTick();
  } catch (e) { console.warn("[Farmhand Companion] visor:", e); }
}
function visorCheck() {
  const w = wornVisor();
  onIcon(w && V.off[w.code] && !V.on ? w : null);
  if (!w) {
    if (V.on) off("🌀 The visor comes off, and the room comes back.");
    for (const k of Object.keys(V.done)) if (V.done[k]) { V.done[k] = 0; keepDone(); }   // (a fresh wearin' starts the count again)
    for (const k of Object.keys(V.lines)) if (V.lines[k]) { V.lines[k] = 0; keepLines(); }
    if (Object.keys(V.off).length) { V.off = {}; keepOff(); }
    V.unlocked = {}; V.nameBack = ""; return;
  }
  // taken off (the icon, or the safeword) while it's still worn: it stays off till it's put on again. Only in the
  // Dispensary's hardcore, the icon holds it off just till they next log in or join a room; then it takes hold again.
  let back = false;
  const o = V.off[w.code];
  if (o) {
    if (o.why === "icon" && hardcore() && (o.load !== LOAD_ID || o.joins !== V.joins)) { delete V.off[w.code]; keepOff(); back = true; }
    else return;
  }
  if (V.on && V.on.code === w.code) { place(); tickHours(); return; }
  if (V.on) stop(true);
  const t = V.cache[w.code], mode = back ? "back" : V.again ? "again" : "";
  V.again = false;
  if (t) { start(w, t, mode); return; }
  ask(w.code);
}
const setOff = (code, why) => { V.off[code] = { why, load: LOAD_ID, joins: V.joins }; keepOff(); };
// Laynie, Nov 26: "need to add a action on the visors so can turn it back on if they want, without re equipping".
// While a farm visor's worn but switched off (its icon, or the safeword), a small dim 🌀 sits in the same corner: a click
// (or /visor on) and it takes hold again. Always their own choice: nothin' asks them to.
function onIcon(w) {
  const d = W.document; if (!d || !d.body) return;
  let b = d.getElementById("fhc-visor-on");
  if (!w) { if (b) b.remove(); return; }
  css();
  if (!b) {
    b = d.createElement("button"); b.type = "button"; b.id = "fhc-visor-on"; b.textContent = "🌀";
    b.addEventListener("click", (e) => { e.stopPropagation(); turnOn(); });
    b.addEventListener("mousedown", (e) => e.stopPropagation());
    d.body.appendChild(b);
  }
  b.title = "Let the " + w.item + " take hold of you again (the room goes dark)";
  const c = d.getElementById("MainCanvas"), r = c && c.getBoundingClientRect();
  if (r) Object.assign(b.style, { left: (r.left + 10) + "px", top: (r.top + Math.max(40, r.height) - 40) + "px" });
}
export function turnOn() {
  if ((ctx.prefs() || {}).noVisor) { ctx.toChat("🌀 Farm visors are switched off for you (Settings › the farm's trance). Switch them back on first.", "#a67fd4", true); return; }
  const w = wornVisor();
  if (!w || V.on || !V.off[w.code]) { ctx.toChat(V.on ? "🌀 Your visor's already got hold of you." : "🌀 There's no farm visor on you that's switched off.", "#a67fd4", true); return; }
  delete V.off[w.code]; keepOff();
  V.again = true;
  check();
}
// the safeword: the visor lets go at once, their own name comes back, no afterimage, lock or no lock
function safeword(say) {
  if (V.on) { setOff(V.on.code, "safeword"); stop(false, say); onIcon(wornVisor()); }
  if (V.name) giveName("🌀 Your own name comes back to you.");
  if (V.after) { V.after = null; keepAfter(); afterDraw(); }
}
// a tuning nobody here has given us yet: ask the room (any Companion that knows it), and the farm
function ask(code) {
  if (Date.now() - (V.asked[code] || 0) < 20000) return;
  V.asked[code] = Date.now();
  try { if (W.ServerSend && (!W.ServerPlayerIsInChatRoom || W.ServerPlayerIsInChatRoom())) W.ServerSend("ChatRoomChat", makeMsg("visorAsk", { code })); } catch (e) { /* not in a room */ }
  try { if (ctx.botHere()) ctx.toBot("visorAsk", { code }); } catch (e) { /* fine */ }
}
// messages: another Companion (or the farm) handin' over a tuning, askin' for one, or unlockin'
export function onVisorMsg(m) {
  if (!m || !m.from) return;
  const me = W.Player && W.Player.MemberNumber;
  if (m.from === me) return;
  const code = String(m.code || "").toLowerCase();
  if (m.type === "visorTune") { if (remember(code, m.t)) check(); return; }
  if (m.type === "visorAsk") { if (V.cache[code] && !isBot()) setTimeout(() => { try { W.ServerSend("ChatRoomChat", makeMsg("visorTune", { code, t: V.cache[code] }, m.from)); } catch (e) { /* fine */ } }, 300 + Math.random() * 1200); return; }
  if (m.type === "visorUnlock") {
    if (!V.on) return;
    const kh = keyholders(), ok = m.from === V.on.crafter || kh.includes(m.from);
    if (!ok) return;
    V.unlocked[V.on.code] = true; icon();
    ctx.toChat("🔓 " + nameOf(m.from) + " opened your visor: you can take it off now.", "#a67fd4", true);
    try { W.ServerSend("ChatRoomChat", makeMsg("visorUnlocked", { name: nameOf(me) }, m.from)); } catch (e) { /* fine */ }
    return;
  }
  if (m.type === "visorUnlocked") { ctx.toChat("🔓 " + String(m.name || "They").slice(0, 40) + "'s visor is open: they can take it off now.", "#a67fd4", true); return; }
  // the crafter or a keyholder gives them their own name back
  if (m.type === "visorName") {
    const n = V.name; if (!n || !(m.from === n.crafter || keyholders().includes(m.from))) return;
    giveName("🌀 " + nameOf(m.from) + " gives you your own name back.");
    try { W.ServerSend("ChatRoomChat", makeMsg("visorOk", { what: "name", name: nameOf(me) }, m.from)); } catch (e) { /* fine */ }
    return;
  }
  // …or starts its sinkin' over (the crafter: the visors they made; a keyholder: all of them)
  if (m.type === "visorReset") {
    const kh = keyholders().includes(m.from); let n = 0;
    for (const [c, e] of Object.entries(V.hours)) if (kh || (e && e.crafter === m.from)) { delete V.hours[c]; n++; }
    if (!n) return;
    keepHours();
    if (V.on) { V.L = computeLook(); if (V.el) { unbuild(); build(); } icon(); }
    ctx.toChat("🌀 " + nameOf(m.from) + " starts your visor's sinkin' over.", "#a67fd4", true);
    try { W.ServerSend("ChatRoomChat", makeMsg("visorOk", { what: "reset", name: nameOf(me) }, m.from)); } catch (e) { /* fine */ }
    return;
  }
  if (m.type === "visorOk") ctx.toChat("🌀 " + String(m.name || "They").slice(0, 40) + (m.what === "name" ? " has their own name back." : "'s visor starts its sinkin' over."), "#a67fd4", true);
}
const charOf = (mn) => (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || null;
const nameOf = (mn) => { const c = charOf(mn); return c ? String(c.Nickname || c.Name || "#" + mn) : "#" + mn; };
function keyholders() { try { const D = W.FarmhandDispensary; return D && typeof D.keyholders === "function" ? D.keyholders().map(Number) : []; } catch (e) { return []; } }
function hardcore() { try { const D = W.FarmhandDispensary, x = D && typeof D.hard === "function" ? D.hard() : null; return !!(x && x.on); } catch (e) { return false; } }
// locked (the Dispensary's hardcore): till its sessions are done, and its lines too if the crafter said they count
const linesOwed = () => { const L = V.on && lookOf(V.on.t); return !!(L && L.lines && L.linesNeed && L.linesLock && (V.lines[V.on.code] || 0) < L.linesNeed); };
export const visorLocked = () => !!(V.on && hardcore() && ((V.done[V.on.code] || 0) < needOf() || linesOwed()) && !V.unlocked[V.on.code]);
const owedText = () => {
  const L = lookOf(V.on.t), o = [], need = needOf();
  if (need || !(L.lines && L.linesNeed && L.linesLock)) o.push((V.done[V.on.code] || 0) + " of " + need + " sessions");
  if (L.lines && L.linesNeed && L.linesLock) o.push((V.lines[V.on.code] || 0) + " of " + L.linesNeed + " lines");
  return o.join(", ") + " done";
};
// what it's waitin' for, said when it goes on
const owedTill = () => { const n = needOf(), o = []; if ((V.done[V.on.code] || 0) < n) o.push(n + " session" + (n === 1 ? "'s" : "s are") + " done"); if (linesOwed()) o.push("its lines are written"); return o.join(" and "); };
// /visor unlock|name|reset <name>: the crafter or a keyholder opens a hardcore wearer's visor early, gives them their own
// name back, or starts its sinkin' over
const ASKS = { unlock: ["visorUnlock", "it opens"], name: ["visorName", "they get their own name back"], reset: ["visorReset", "its sinkin' starts over"] };
function command(args) {
  if (/^\s*on\s*$/i.test(args)) { turnOn(); return; }
  const m = /^\s*(unlock|name|reset)\s+(.+)$/i.exec(args);
  if (!m) { ctx.toChat("🌀 /visor on: let your switched-off farm visor take hold of you again. /visor unlock <name>: open somebody's farm visor early. /visor name <name>: give them their own name back. /visor reset <name>: start its sinkin' over (those three: for a visor you crafted, or somebody whose key you hold).", "#a67fd4", true); return; }
  const q = m[2].trim().toLowerCase(), c = (W.ChatRoomCharacter || []).find((x) => x && [x.Nickname, x.Name, String(x.MemberNumber)].some((n) => n && String(n).toLowerCase() === q));
  if (!c) { ctx.toChat("🌀 Nobody here by that name.", "#a67fd4", true); return; }
  const [type, then] = ASKS[m[1].toLowerCase()];
  try { W.ServerSend("ChatRoomChat", makeMsg(type, {}, c.MemberNumber)); } catch (e) { /* fine */ }
  ctx.toChat("🌀 Sent: if you crafted their visor or hold their key, " + then + ".", "#a67fd4", true);
}

// ── the visor on: the dark, the one body, the pictures, the words, the spiral, the icon ──
const calmNow = () => !!(ctx && (ctx.prefs() || {}).calmLook);
const look = () => V.L || lookOf(V.on && V.on.t);   // (the crafter's look, and whatever the sinkin' has added to it)
const fxOn = (k) => !!(V.on && look().fx.includes(k));
const DEFAULT_WORDS = () => ["good " + animal(), "empty", "deeper", "obey the farm", "so warm", "no thoughts"];
const wordsOf = () => (V.on && V.on.t.words.length ? V.on.t.words : DEFAULT_WORDS());
const pick = (a) => a[Math.floor(Math.random() * a.length)];
function start(w, t, back) {
  V.on = { code: w.code, crafter: w.crafter, item: w.item, t: normTuning(t), since: Date.now(), deepest: "" };
  V.depth = 0.1; V.geo = null; V.spun = false; V.hourAt = Date.now(); V.fed = [];
  V.L = computeLook();
  if (V.after) { V.after = null; keepAfter(); }   // (on again: the old afterimage goes under the new dark)
  onIcon(null);
  afterDraw();
  build();
  ctx.toChat((back === "back" ? "🌀 The " + w.item + "'s still on you, and it takes hold of you again." : back === "again" ? "🌀 You let the " + w.item + " take hold of you again, and the room goes dark." :
    "🌀 The " + w.item + " settles over your eyes, and the room goes dark around you.") + (visorLocked() ? " It won't come off till " + owedTill() + "." : ""), "#a67fd4", true);
  nameOn();
  linesAsk();
  later(nextSession, back ? 1500 : 5000);
}
// it comes off (taken off, or the icon): the name hangs on a while, and so does an afterimage
function off(say) {
  const was = V.on; if (!was) return;
  stop(false, say);
  nameAfter(was); afterStart(was);
}
// writin' lines: what to write, and how many are left
function linesAsk() {
  const L = V.on && lookOf(V.on.t); if (!L || !L.lines || !L.linesNeed) return;
  const n = V.lines[V.on.code] || 0; if (n >= L.linesNeed) return;
  ctx.toChat("✍ Write it out in the chat, " + (L.linesNeed - n) + " more time" + (L.linesNeed - n === 1 ? "" : "s") + ", just as it's written: “" + L.lines + "”. Lines that match stay between you and the visor; nobody else sees them." +
    (L.linesLock && hardcore() ? " It won't come off till they're done." : ""), "#c39be0", true);
}
export function stop(quiet, say) {
  const was = V.on;
  for (const x of V.timers) clearTimeout(x); V.timers = [];
  unbuild();
  if (V.run) { V.run = null; try { onHypno({ do: "wake" }); } catch (e) { /* fine */ } }
  if (was && V.hours[was.code]) keepHours();
  V.on = null; V.depth = 0; V.geo = null; V.L = null;
  afterDraw();
  if (was && !quiet && say) ctx.toChat(say, "#a67fd4", true);
}
// the dark and everythin' drawn in it, taken down (the session underneath carries on: the sinkin' builds it again)
function unbuild() {
  for (const x of V.ivs) clearInterval(x); V.ivs = [];
  clearInterval(V.wordT); clearInterval(V.picT); clearInterval(V.drawT);
  if (V.raf) { try { if (typeof W.cancelAnimationFrame === "function") W.cancelAnimationFrame(V.raf); clearTimeout(V.raf); } catch (e) { /* fine */ } V.raf = 0; }
  if (V.obs) { try { V.obs.disconnect(); } catch (e) { /* fine */ } V.obs = null; V.obsOn = null; }
  if (V.wm) { V.wm.remove(); V.wm = null; }
  try { for (const x of W.document.querySelectorAll(".fhc-vfade")) x.classList.remove("fhc-vfade"); } catch (e) { /* fine */ }
  if (V.el) { V.el.remove(); V.el = null; }
}
const later = (f, ms) => { V.timers.push(setTimeout(() => { try { f(); } catch (e) { console.warn("[Farmhand Companion] visor:", e); } }, ms)); };
const every = (ms, f) => { V.ivs.push(setInterval(() => { try { if (V.el) f(); } catch (e) { /* fine */ } }, ms)); };
function css() {
  const d = W.document; if (d.getElementById("fhc-visor-css")) return;
  const s = d.createElement("style"); s.id = "fhc-visor-css";
  s.textContent = "#fhc-visor{position:fixed;z-index:9995;overflow:hidden;background:radial-gradient(ellipse at 50% 55%,#1b0f26 0%,#0b0610 55%,#050307 100%);pointer-events:auto}" +
    "#fhc-visor>*{position:absolute;pointer-events:none}" +
    "#fhc-visor .pic{left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity 5s ease-in-out;-webkit-mask-image:radial-gradient(ellipse at center,#000 35%,rgba(0,0,0,.15) 100%);mask-image:radial-gradient(ellipse at center,#000 35%,rgba(0,0,0,.15) 100%)}" +
    "#fhc-visor .body,#fhc-visor .spin,#fhc-visor .spinO,#fhc-visor .kalei{left:0;top:0;width:100%;height:100%}" +
    "#fhc-visor .body.aura{animation:fhcAura 5s ease-in-out infinite}" +
    "#fhc-visor.warp>.pic,#fhc-visor.warp>.spin,#fhc-visor.warp>.kalei{filter:url(#fhc-warpf)}" +
    "#fhc-visor .sub{font:600 1.7rem Georgia,serif;color:#f6e2ff;letter-spacing:.06em;text-shadow:0 0 12px rgba(200,140,240,.7);opacity:0;white-space:nowrap;animation:fhcSub var(--ms,800ms) ease-in-out forwards}" +
    "#fhc-visor.calm .sub{animation:fhcSubCalm 9s linear forwards}" +
    "#fhc-visor .face{right:4%;top:4%;border-radius:50%;border:2px solid rgba(240,190,240,.55);box-shadow:0 0 24px rgba(220,140,240,.55),inset 0 0 18px rgba(20,8,30,.8);background:#120818;animation:fhcFace 9s ease-in-out infinite}" +
    "#fhc-visor .crowd{left:0;right:0;bottom:0;height:30%;opacity:.95}#fhc-visor .crowd svg{width:100%;height:100%}" +
    "#fhc-visor .vig{left:0;top:0;width:100%;height:100%;background:radial-gradient(ellipse at 50% 50%,transparent var(--in,45%),rgba(5,2,8,.92) 100%);transition:background 3s;animation:fhcVig 10s ease-in-out infinite}" +
    "#fhc-visor .bloom{left:0;top:0;width:100%;height:100%;opacity:0;background:radial-gradient(ellipse at center,rgba(255,180,225,.38),rgba(240,140,210,.18) 60%,transparent 85%);transition:opacity 2.5s ease-in-out}" +
    "#fhc-visor .meter{right:14px;bottom:14px;width:40px;height:40px;border-radius:50%;border:2px solid rgba(198,139,230,.6);overflow:hidden;background:rgba(20,10,28,.6)}" +
    "#fhc-visor .meter i{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(#f2aad6,#9b5bd0);transition:height 2s}" +
    "#fhc-visor .meter b{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:600 11px system-ui,sans-serif;color:#fff}" +
    "#fhc-visor .float{white-space:nowrap;font:italic 15px Georgia,serif;color:rgba(225,200,240,.55);animation:fhcFloat var(--dur,15s) linear forwards}" +
    "#fhc-visor .wave{transform:translateX(-50%);font:600 1.15rem Georgia,serif;color:#f4dcff;text-shadow:0 0 10px rgba(200,140,240,.8);white-space:nowrap;opacity:0;animation:fhcWaveIn 7s ease-in-out forwards}" +
    "#fhc-visor .wave span{display:inline-block;animation:fhcBob 2.4s ease-in-out infinite}" +
    "#fhc-visor .puff{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle,rgba(255,235,250,.55),rgba(255,200,240,0) 70%);animation:fhcPuff 2.4s ease-out forwards}" +
    "#fhc-visor .ripple{width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:2px solid rgba(220,170,245,.4);animation:fhcRipple 7s ease-out forwards}" +
    "#fhc-visor .mote{font-size:14px;color:rgba(250,190,230,.6);animation:fhcRise var(--dur,14s) linear forwards}" +
    "#fhc-visor.calm .float,#fhc-visor.calm .mote,#fhc-visor.calm .ripple{animation-duration:30s}#fhc-visor.calm .face,#fhc-visor.calm .vig,#fhc-visor.calm .body.aura{animation:none}" +
    "#fhc-visor .icon{left:10px;bottom:10px;width:30px;height:30px;border-radius:50%;border:1px solid rgba(198,139,230,.55);background:rgba(30,16,40,.75);color:#ecd9f6;font-size:15px;line-height:28px;text-align:center;cursor:pointer;padding:0;opacity:.7;pointer-events:auto;z-index:5}" +
    "#fhc-visor .icon:hover{opacity:1}#fhc-visor .icon.locked{border-color:#7a5b33;cursor:not-allowed}" +
    "#fhc-visor-on{position:fixed;z-index:9995;width:30px;height:30px;border-radius:50%;border:1px solid rgba(198,139,230,.4);background:rgba(30,16,40,.55);color:#ecd9f6;font-size:15px;line-height:28px;text-align:center;cursor:pointer;padding:0;opacity:.45}" +
    "#fhc-visor-on:hover{opacity:.95}" +
    "#fhc-visor-wm{position:fixed;z-index:9994;pointer-events:none;opacity:.07;animation:fhcSpin 80s linear infinite}#fhc-visor-wm.calm{animation:none}" +
    "#TextAreaChatLog .fhc-vfade{opacity:.28;transition:opacity 3s}" +
    // the afterimage: a faint spiral at the edges of the ordinary screen, and the odd word driftin' by
    "#fhc-visor-after{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9990;pointer-events:none;overflow:hidden;transition:opacity 4s;-webkit-mask-image:radial-gradient(ellipse at center,transparent 50%,#000 95%);mask-image:radial-gradient(ellipse at center,transparent 50%,#000 95%)}" +
    "#fhc-visor-after img{position:absolute;left:50%;top:50%;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;opacity:.16;animation:fhcSpin 120s linear infinite}#fhc-visor-after.calm img{animation:none}" +
    "#fhc-visor-after .aw{position:absolute;font:600 1.2rem Georgia,serif;color:#f6e2ff;text-shadow:0 0 10px rgba(200,140,240,.7);opacity:0;white-space:nowrap;animation:fhcAfterWord 7s ease-in-out forwards}" +
    "#fhc-visor-after.calm .aw{animation-name:fhcAfterWordCalm}" +
    "@keyframes fhcAfterWord{0%{opacity:0;transform:translateY(0)}30%{opacity:.35}70%{opacity:.25}100%{opacity:0;transform:translateY(-6vh)}}" +
    "@keyframes fhcAfterWordCalm{0%{opacity:0}30%{opacity:.3}70%{opacity:.25}100%{opacity:0}}" +
    "@keyframes fhcSub{0%{opacity:0}45%{opacity:var(--op,.45)}100%{opacity:0}}" +
    "@keyframes fhcSubCalm{0%{opacity:0;transform:translateY(0)}20%{opacity:.35}80%{opacity:.25}100%{opacity:0;transform:translateY(-10vh)}}" +
    "@keyframes fhcSpin{to{transform:rotate(360deg)}}" +
    "@keyframes fhcAura{0%,100%{filter:drop-shadow(0 0 14px rgba(255,150,220,.5)) drop-shadow(0 0 30px rgba(200,120,240,.3))}50%{filter:drop-shadow(0 0 26px rgba(255,150,220,.85)) drop-shadow(0 0 56px rgba(200,120,240,.55))}}" +
    "@keyframes fhcFace{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}" +
    "@keyframes fhcVig{0%,100%{filter:brightness(1)}50%{filter:brightness(1.15)}}" +
    "@keyframes fhcFloat{0%{transform:translateX(0);opacity:0}10%{opacity:1}85%{opacity:.8}100%{transform:translateX(calc(-1 * var(--dx)));opacity:0}}" +
    "@keyframes fhcBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}" +
    "@keyframes fhcWaveIn{0%{opacity:0}15%{opacity:1}80%{opacity:1}100%{opacity:0}}" +
    "@keyframes fhcPuff{0%{transform:translate(0,0) scale(.4);opacity:0}20%{opacity:.8}100%{transform:translate(-40px,-50px) scale(2.2);opacity:0}}" +
    "@keyframes fhcRipple{0%{transform:scale(.3);opacity:0}15%{opacity:.6}100%{transform:scale(18);opacity:0}}" +
    "@keyframes fhcRise{0%{transform:translateY(0) translateX(0);opacity:0}15%{opacity:.8}100%{transform:translateY(-70vh) translateX(var(--sway,20px));opacity:0}}";
  d.head.appendChild(s);
}
// the meltin' warp: a slow wobble through the pictures and the spiral behind (never the body, never the words)
const WARP_SVG = "<svg width='0' height='0' style='position:absolute'><filter id='fhc-warpf'><feTurbulence type='fractalNoise' baseFrequency='0.008 0.012' numOctaves='2' seed='3'>" +
  "<animate attributeName='baseFrequency' dur='24s' values='0.008 0.012;0.012 0.008;0.008 0.012' repeatCount='indefinite'/></feTurbulence><feDisplacementMap in='SourceGraphic' scale='14'/></filter></svg>";
function build() {
  const d = W.document; if (!d || !d.body) return;
  css();
  const t = V.on.t, L = look(), calm = calmNow(), el = d.createElement("div"); el.id = "fhc-visor";
  el.classList.toggle("calm", calm); el.classList.toggle("warp", L.fx.includes("warp"));
  el.style.setProperty("--ms", t.wordMs + "ms"); el.style.setProperty("--op", String(t.wordOp));
  const add = (tag, cls) => { const x = d.createElement(tag); x.className = cls; el.appendChild(x); return x; };
  if (L.fx.includes("warp")) el.insertAdjacentHTML("beforeend", WARP_SVG);
  for (let i = 0; i < 2; i++) { const p = add("img", "pic"); p.alt = ""; p.style.objectFit = t.fit; p.referrerPolicy = "no-referrer"; if (L.fx.includes("kalei")) p.style.visibility = "hidden"; }
  if (L.fx.includes("kalei")) add("canvas", "kalei");
  if (L.spiral !== "none" && L.place !== "over") add("canvas", "spin");
  const cv = add("canvas", "body"); if (L.fx.includes("aura")) cv.classList.add("aura");
  if (L.spiral !== "none" && L.place !== "behind") add("canvas", "spinO");
  if (L.fx.includes("crowd")) add("div", "crowd").innerHTML = crowdSvg();
  if (L.fx.includes("tunnel")) add("div", "vig");
  if (L.fx.includes("bloom")) add("div", "bloom");
  if (L.fx.includes("face")) add("canvas", "face");
  if (L.fx.includes("meter")) add("div", "meter").innerHTML = "<i></i><b>0</b>";
  const b = add("button", "icon"); b.type = "button"; b.addEventListener("click", iconClick);
  // (the room under it can't be clicked: no walkin' about the map you can't see)
  el.addEventListener("mousedown", (e) => e.stopPropagation()); el.addEventListener("click", (e) => { if (e.target === el) e.stopPropagation(); });
  d.body.appendChild(el); V.el = el;
  // the spiral turnin' faint over the chat
  if (L.chat.includes("watermark")) { const wm = d.createElement("img"); wm.id = "fhc-visor-wm"; wm.alt = ""; wm.src = spiralMark(); wm.classList.toggle("calm", calm); d.body.appendChild(wm); V.wm = wm; }
  place(); icon();
  // pictures: crossfade, slowly (if none of the crafter's will load, the farm's own patterns instead of nothin')
  let pics = t.pictures.length ? t.pictures.slice() : farmPatterns();
  let i = 0, side = 0, loaded = 0, failed = 0;
  const next = () => { if (!V.el) return; const imgs = V.el.querySelectorAll(".pic"), show = imgs[side], hide = imgs[1 - side];
    show.onload = () => { loaded++; show.style.opacity = String(t.picOp); hide.style.opacity = "0"; };
    show.onerror = () => { show.style.opacity = "0"; if (++failed >= pics.length && !loaded && t.pictures.length) { pics = farmPatterns(); failed = 0; i = 0; } if (!loaded) setTimeout(next, 400); };
    show.src = pics[i++ % pics.length]; side = 1 - side; };
  next(); V.picT = setInterval(() => { if (pics.length > 1) next(); }, t.picEvery * 1000);
  // subliminal words: one at a time, up and gone, never a strobe
  V.wordT = setInterval(() => { if (Math.random() < 0.85) word(); }, Math.max(2, t.wordEvery) * 1000);
  // the one body, the spiral, the kaleidoscope, the close-up: drawn as the screen draws
  V.lastF = 0; V.lastB = 0; frame();
  // the chat: whispers between the lines, other voices fadin'
  if (L.chat.includes("whisper")) every(25000, () => { if (Math.random() < 0.7) ctx.toChat("…" + pick(wordsOf()) + "…", "rgba(195,155,224,.6)", true); });
  if (L.chat.includes("fade")) fadeWatch();
  // the rest, slow
  if (L.fx.includes("ripple")) { ripples(); every(11000, ripples); }
  if (L.fx.includes("bloom")) every(26000, bloomOnce);
  if (L.fx.includes("breath")) every(30000, () => { if (Math.random() < 0.6) breathPuffs(5); });
  if (L.fx.includes("hearts")) every(calm ? 4000 : 1600, mote);
  if (L.fx.includes("tunnel") || L.fx.includes("meter")) { every(1000, depthDraw); depthDraw(); }
}
// over the room's half of the game (the chat, and the game's own buttons, stay where they are)
function place() {
  const d = W.document, c = d.getElementById("MainCanvas"); if (!c || !V.el) return;
  const r = c.getBoundingClientRect(), w = r.width / 2;
  Object.assign(V.el.style, { left: r.left + "px", top: r.top + "px", width: w + "px", height: r.height + "px" });
  V.el.classList.toggle("calm", calmNow());
  const cw = Math.round(w) || 500, ch = Math.round(r.height) || 1000;
  for (const cv of V.el.querySelectorAll("canvas.body,canvas.spin,canvas.spinO,canvas.kalei")) if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; V.spun = false; }
  const fc = V.el.querySelector("canvas.face"), fs = Math.max(60, Math.round(Math.min(cw, ch) * 0.28));
  if (fc && fc.width !== fs) { fc.width = fs; fc.height = fs; fc.style.width = fs + "px"; fc.style.height = fs + "px"; }
  if (V.wm) {
    const l = d.getElementById("TextAreaChatLog"), q = l && l.getBoundingClientRect();
    if (q && q.width > 40 && q.height > 40) { const s = Math.min(q.width, q.height) * 0.9; Object.assign(V.wm.style, { display: "", left: (q.left + (q.width - s) / 2) + "px", top: (q.top + (q.height - s) / 2) + "px", width: s + "px", height: s + "px" }); }
    else V.wm.style.display = "none";
  }
}
// the screen's own clock (a plain timer where there isn't one)
function frame() {
  const go = (now) => { V.raf = 0; if (!V.el || !V.on) return; try { draw(now); } catch (e) { /* the next one */ } V.raf = frame(); };
  return (V.raf = typeof W.requestAnimationFrame === "function" ? W.requestAnimationFrame(go) : setTimeout(() => go(Date.now()), 40));
}
function draw(now) {
  if (now - V.lastF < 33) return;    // (about 30 a second, smooth and slow)
  V.lastF = now;
  const t = now / 1000, L = look(), calm = calmNow();
  const moving = !calm && (L.spin !== "still" || L.breathe || L.drift || L.spiral === "tunnel");
  if (L.spiral !== "none" && (moving || !V.spun)) {
    V.spun = true;
    const sb = V.el.querySelector("canvas.spin"), so = V.el.querySelector("canvas.spinO");
    if (sb && sb.getContext) spiral(sb.getContext("2d"), t, L.spOp, L, calm);
    if (so && so.getContext) spiral(so.getContext("2d"), t, L.place === "both" ? L.spOp * 0.4 : L.spOp * 0.55, L, calm);
  }
  if (now - V.lastB >= 66) { V.lastB = now; drawBody(t); if (L.fx.includes("kalei")) kalei(t, calm); }
}
// BC draws each character on a canvas of its own, 500 wide: 700 of room over the body for tall hair, ears and hats,
// the body's own 1000, then 150 under the feet (R134; older games had just the 1000)
function bodyRect(src) {
  const up = src.height > 1000 ? Math.max(0, src.height - 1150) : 0, sy = Math.max(0, up - 120);
  return { up, sx: 0, sy, sw: src.width, sh: Math.min(src.height - sy, up + 1000 - sy) };
}
function drawBody(t) {
  if (!V.el || !V.on) return;
  const cv = V.el.querySelector("canvas.body"), g = cv && cv.getContext ? cv.getContext("2d") : null; if (!g) return;
  const C = (V.on.t.show === "crafter" && charOf(V.on.crafter)) || W.Player;
  if (C && !C.Canvas && typeof W.CharacterLoadCanvas === "function") { try { W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } }
  g.clearRect(0, 0, cv.width, cv.height);
  const src = C && C.Canvas; if (!src || !src.width || !src.height) return;
  const R = bodyRect(src), L = look(), faceY = R.up + 145;
  // the view comin' in close to the face and back out, slow (closer the deeper they've gone)
  let z = 0;
  if (L.fx.includes("zoom")) z = (calmNow() ? 0.5 : 0.5 - 0.5 * Math.cos(2 * Math.PI * (t || 0) / 60)) * (0.3 + 0.6 * V.depth);
  const fh = Math.min(360, R.sh), fw = fh * R.sw / R.sh, fx0 = src.width / 2 - fw / 2, fy = Math.max(R.sy, faceY - fh / 2);
  const sx = R.sx + (fx0 - R.sx) * z, sy = R.sy + (fy - R.sy) * z, sw = R.sw + (fw - R.sw) * z, sh = R.sh + (fh - R.sh) * z;
  const hh = cv.height * 0.96, ww = hh * R.sw / R.sh, dx = (cv.width - ww) / 2, dy = cv.height - hh;
  try { g.drawImage(src, sx, sy, sw, sh, dx, dy, ww, hh); } catch (e) { /* not drawn yet */ }
  // where the face is on screen now (for the breath, and the voice over the head)
  const k = hh / sh;
  V.geo = { faceX: dx + (src.width / 2 - sx) * k, faceY: dy + (faceY - sy) * k, top: dy + (R.up - 20 - sy) * k, k };
  // the close-up: their face in a soft circle, up in the corner
  const fc = V.el.querySelector("canvas.face"), fg = fc && fc.getContext ? fc.getContext("2d") : null;
  if (fg) { fg.clearRect(0, 0, fc.width, fc.height); try { fg.drawImage(src, src.width / 2 - 105, R.up + 40, 210, 210, 0, 0, fc.width, fc.height); } catch (e) { /* fine */ } }
}
// ── the spirals: behind the body, over it faint, or both; at their fastest a turn every 14 seconds ──
const SPEED = { still: 0, slower: 2 * Math.PI / 30, slow: 2 * Math.PI / 14 };
function cols(t, L, calm) { const d = L.drift && !calm ? 24 * Math.sin(2 * Math.PI * t / 60) : 0; return ["hsl(" + (276 + d) + ",62%,68%)", "hsl(" + (326 + d) + ",78%,80%)", "hsl(" + (262 + d) + ",52%,46%)"]; }
function heart(g, s) { g.beginPath(); g.moveTo(0, s * 0.35); g.bezierCurveTo(-s, -s * 0.35, -s * 0.45, -s, 0, -s * 0.45); g.bezierCurveTo(s * 0.45, -s, s, -s * 0.35, 0, s * 0.35); g.fill(); }
function paw(g, s) { g.beginPath(); g.ellipse(0, s * 0.25, s * 0.45, s * 0.38, 0, 0, 7); g.fill(); for (const [x, y] of [[-0.5, -0.25], [-0.18, -0.55], [0.18, -0.55], [0.5, -0.25]]) { g.beginPath(); g.ellipse(x * s, y * s, s * 0.16, s * 0.2, 0, 0, 7); g.fill(); } }
function bell(g, s) { g.beginPath(); g.moveTo(-s * 0.55, s * 0.4); g.quadraticCurveTo(-s * 0.5, -s * 0.6, 0, -s * 0.65); g.quadraticCurveTo(s * 0.5, -s * 0.6, s * 0.55, s * 0.4); g.closePath(); g.fill(); g.beginPath(); g.arc(0, s * 0.48, s * 0.14, 0, 7); g.fill(); }
function spiral(g, t, alpha, L, calm) {
  const cw = g.canvas.width, ch = g.canvas.height;
  g.clearRect(0, 0, cw, ch);
  if (L.spiral === "none" || alpha <= 0) return;
  const a = calm ? 0 : t * SPEED[L.spin], sc = L.breathe && !calm ? 1 + 0.07 * Math.sin(2 * Math.PI * t / 9) : 1;
  const R = Math.hypot(cw, ch) * 0.55 * sc, [c1, c2, c3] = cols(t, L, calm);
  g.save(); g.globalAlpha = alpha; g.translate(cw / 2, ch * 0.5); g.lineCap = "round";
  const arm = (k, b, w, col, dir) => { g.beginPath(); for (let th = 0.2; th < R / b; th += 0.04) { const r = b * th, an = th + (dir || 1) * a + k; if (th === 0.2) g.moveTo(r * Math.cos(an), r * Math.sin(an)); else g.lineTo(r * Math.cos(an), r * Math.sin(an)); } g.strokeStyle = col; g.lineWidth = w; g.stroke(); };
  const along = (shape, sz) => { const b = R / (2 * Math.PI * 6); for (let th = 1.2; th < R / b; th += Math.max(0.12, (sz(b * th) * 2.4) / (b * th))) { const r = b * th, an = th + a; g.save(); g.translate(r * Math.cos(an), r * Math.sin(an)); g.rotate(an + Math.PI / 2); g.fillStyle = Math.round(th * 3) % 2 ? c1 : c2; shape(g, sz(r)); g.restore(); } };
  if (L.spiral === "classic") { const b = R / (2 * Math.PI * 7); arm(0, b, b * 1.7, c1); arm(Math.PI, b, b * 1.7, c2); }
  else if (L.spiral === "tight") { const b = R / (2 * Math.PI * 15); for (let i = 0; i < 4; i++) arm(i * Math.PI / 2, b, b * 1.3, i % 2 ? c2 : c1); }
  else if (L.spiral === "counter") { const b = R / (2 * Math.PI * 7); g.globalAlpha = alpha * 0.55; arm(0, b, b * 1.4, c1, 1); arm(Math.PI, b, b * 1.4, c2, 1); arm(0, b, b * 1.4, c3, -1); arm(Math.PI, b, b * 1.4, c1, -1); }
  else if (L.spiral === "pinwheel") {
    for (let i = 0; i < 8; i++) {
      const p = (r, off) => { const an = i * Math.PI / 4 + off + a + r * 0.006; return [r * Math.cos(an), r * Math.sin(an)]; };
      g.beginPath(); g.moveTo(0, 0); for (let r = 0; r <= R; r += 8) g.lineTo(...p(r, 0)); for (let r = R; r >= 0; r -= 8) g.lineTo(...p(r, Math.PI / 8)); g.closePath(); g.fillStyle = i % 2 ? c1 : c2; g.fill();
    }
  }
  else if (L.spiral === "tunnel") { const n = 11, flow = calm ? 0 : t * 0.08; for (let i = 0; i < n; i++) { const k = ((i / n) + flow) % 1, r = k * R; g.beginPath(); g.arc(0, 0, r, 0, 7); g.strokeStyle = i % 2 ? c1 : c2; g.globalAlpha = alpha * (1 - k) * 0.9; g.lineWidth = 6 + r * 0.05; g.stroke(); } }
  else if (L.spiral === "hearts") along(heart, (r) => 6 + r * 0.06);
  else if (L.spiral === "paws") along(paw, (r) => 6 + r * 0.06);
  else if (L.spiral === "bells") along(bell, (r) => 6 + r * 0.06);
  else if (L.spiral === "words") {
    const text = (wordsOf().join("  ·  ") + "  ·  ").repeat(20), b = R / (2 * Math.PI * 6); let th = 1.6, i = 0;
    while (th < R / b && i < text.length) { const r = b * th, an = th + a, fs = 8 + r * 0.055; g.save(); g.translate(r * Math.cos(an), r * Math.sin(an)); g.rotate(an + Math.PI / 2); g.font = "600 " + fs.toFixed(1) + "px Georgia, serif"; g.fillStyle = i % 9 < 5 ? c2 : c1; g.fillText(text[i], 0, 0); g.restore(); th += (fs * 0.62) / r; i++; }
  }
  g.restore();
}
// the kaleidoscope: the picture showin', folded into six, turnin' slow
function kalei(t, calm) {
  const kc = V.el.querySelector("canvas.kalei"), g = kc && kc.getContext ? kc.getContext("2d") : null; if (!g) return;
  g.clearRect(0, 0, kc.width, kc.height);
  const img = Array.from(V.el.querySelectorAll("img.pic")).find((p) => Number(p.style.opacity) > 0 && p.complete && p.naturalWidth);
  if (!img) return;
  const R = Math.hypot(kc.width, kc.height) / 2, a = calm ? 0 : t * (2 * Math.PI / 40);
  g.save(); g.globalAlpha = V.on.t.picOp; g.translate(kc.width / 2, kc.height / 2);
  for (let i = 0; i < 6; i++) {
    g.save(); g.rotate(a + i * Math.PI / 3); if (i % 2) g.scale(1, -1);
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, -Math.PI / 6, Math.PI / 6); g.closePath(); g.clip();
    try { g.drawImage(img, 0, -R / 2, R, R); } catch (e) { /* fine */ }
    g.restore();
  }
  g.restore();
}
// ── the chat: other voices fadin' a while after they're said (never the farm, the crafter, or out-of-character lines) ──
function fadeWatch() {
  const d = W.document; if (typeof W.MutationObserver !== "function") return;
  const hook = () => {
    const l = d.getElementById("TextAreaChatLog"); if (!l || l === V.obsOn) return;
    if (V.obs) V.obs.disconnect();
    V.obsOn = l; V.obs = new W.MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) fadeOne(n); });
    V.obs.observe(l, { childList: true });
  };
  hook(); every(3000, hook);
}
function fadeOne(n) {
  try {
    if (!V.on || !n || !n.classList || !/\bChatMessage(Chat|Whisper)\b/.test(n.className)) return;
    const s = Number(n.getAttribute("data-sender")), me = W.Player && W.Player.MemberNumber;
    if (!s || s === me || s === BOT_MEMBER || s === V.on.crafter || oocOf(n)) return;
    setTimeout(() => { if (V.on) n.classList.add("fhc-vfade"); }, 6000);
  } catch (e) { /* fine */ }
}
// ── the rest, HSC-style but the farm's own, all slow (nothin' here flashes) ──
const size = () => ({ w: (V.el && (V.el.clientWidth || parseFloat(V.el.style.width))) || 500, h: (V.el && (V.el.clientHeight || parseFloat(V.el.style.height))) || 1000 });
const fx = (cls, ms, set) => { if (!V.el) return; const x = W.document.createElement("div"); x.className = cls; set(x); V.el.appendChild(x); setTimeout(() => x.remove(), calmNow() ? ms * 2 : ms); };
// somebody else's words driftin' across, far away
function floatBy(text) {
  const { w } = size();
  fx("float", 19000, (f) => { f.textContent = String(text).slice(0, 140); f.style.left = w + "px"; f.style.top = (8 + Math.random() * 70) + "%"; f.style.setProperty("--dx", (w + 600) + "px"); f.style.setProperty("--dur", (13 + Math.random() * 5) + "s"); });
}
// the farm's voice over the head, the letters bobbin' slow
function waveOver(text) {
  const g = V.geo, { w } = size();
  fx("wave", 7200, (x) => {
    x.style.left = (g ? g.faceX : w / 2) + "px"; x.style.top = Math.max(8, (g ? g.top : 80) - 40) + "px";
    Array.from(String(text).slice(0, 70)).forEach((c, i) => { const s = W.document.createElement("span"); s.textContent = c === " " ? " " : c; s.style.animationDelay = (i * 0.08) + "s"; x.appendChild(s); });
  });
}
// a few soft breaths out of the mouth
function breathPuffs(n) {
  for (let i = 0; i < (n || 5); i++) later(() => { const g = V.geo; if (g) fx("puff", 2500, (p) => { p.style.left = (g.faceX - 6) + "px"; p.style.top = (g.faceY + 40 * g.k) + "px"; }); }, i * 1700);
}
function bloomOnce() { const b = V.el && V.el.querySelector(".bloom"); if (!b) return; b.style.opacity = "1"; later(() => { b.style.opacity = "0"; }, 3000); }
function ripples() { const { w, h } = size(); for (let i = 0; i < 3; i++) later(() => fx("ripple", 7200, (p) => { p.style.left = (w * (0.15 + Math.random() * 0.7)) + "px"; p.style.top = (h * (0.15 + Math.random() * 0.7)) + "px"; }), i * 900); }
function mote() {
  const { w, h } = size();
  fx("mote", 19000, (m) => { m.textContent = Math.random() < 0.7 ? "♥" : "💧"; m.style.left = (w * Math.random()) + "px"; m.style.top = (h - 20) + "px"; m.style.fontSize = (10 + Math.random() * 12) + "px"; m.style.setProperty("--sway", ((Math.random() - 0.5) * 80) + "px"); m.style.setProperty("--dur", (11 + Math.random() * 7) + "s"); });
}
// tunnel vision closes in, and the meter fills, as the session goes deeper
function depthDraw() {
  const v = V.el && V.el.querySelector(".vig"); if (v) v.style.setProperty("--in", Math.round(52 - V.depth * 30) + "%");
  const m = V.el && V.el.querySelector(".meter"); if (m) { m.firstChild.style.height = Math.round(V.depth * 100) + "%"; m.lastChild.textContent = String(Math.round(V.depth * 100)); }
}
// the watchin' crowd: the farm's own silhouettes, ears and hats, along the bottom, eyes glowin' soft
function crowdSvg() {
  let s = "";
  ["cow", "pony", "pup", "hat", "kitty", "bunny", "hat", "cow", "pup"].forEach((k, i) => {
    const x = 60 + i * 110 + (i % 2) * 20, y = 170 + (i % 3) * 18, c = i % 2 ? "#0a0510" : "#130a1a";
    s += "<g fill='" + c + "'><ellipse cx='" + x + "' cy='" + y + "' rx='34' ry='38'/><path d='M" + (x - 60) + " 300 Q" + (x - 58) + " " + (y + 40) + " " + x + " " + (y + 36) + " Q" + (x + 58) + " " + (y + 40) + " " + (x + 60) + " 300 Z'/>";
    if (k === "cow") s += "<ellipse cx='" + (x - 40) + "' cy='" + (y - 18) + "' rx='16' ry='8'/><ellipse cx='" + (x + 40) + "' cy='" + (y - 18) + "' rx='16' ry='8'/>";
    if (k === "pony" || k === "kitty") s += "<path d='M" + (x - 22) + " " + (y - 28) + " l8 -26 l10 22Z M" + (x + 22) + " " + (y - 28) + " l-8 -26 l-10 22Z'/>";
    if (k === "pup") s += "<path d='M" + (x - 30) + " " + (y - 20) + " l-14 26 l20 -6Z M" + (x + 30) + " " + (y - 20) + " l14 26 l-20 -6Z'/>";
    if (k === "bunny") s += "<ellipse cx='" + (x - 12) + "' cy='" + (y - 58) + "' rx='9' ry='30'/><ellipse cx='" + (x + 12) + "' cy='" + (y - 58) + "' rx='9' ry='30'/>";
    if (k === "hat") s += "<rect x='" + (x - 50) + "' y='" + (y - 34) + "' width='100' height='10' rx='4'/><rect x='" + (x - 26) + "' y='" + (y - 64) + "' width='52' height='34' rx='8'/>";
    s += "<circle cx='" + (x - 11) + "' cy='" + (y - 2) + "' r='3' fill='rgba(240,170,220,.55)'/><circle cx='" + (x + 11) + "' cy='" + (y - 2) + "' r='3' fill='rgba(240,170,220,.55)'/></g>";
  });
  return "<svg viewBox='0 0 1000 300' preserveAspectRatio='xMidYMax slice'>" + s + "</svg>";
}
// the spiral for over the chat: two arms, nothin' behind them
function spiralMark() {
  const pts = (k) => { const o = []; for (let t = 0.2; t < 14 * Math.PI; t += 0.12) { const r = 16 * t; o.push((500 + r * Math.cos(t + k)).toFixed(1) + "," + (500 + r * Math.sin(t + k)).toFixed(1)); } return o.join(" "); };
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'><g fill='none' stroke-width='26' stroke-linecap='round'><polyline points='" + pts(0) + "' stroke='rgb(185,120,225)'/><polyline points='" + pts(Math.PI) + "' stroke='rgb(240,170,215)'/></g></svg>");
}
function word() {
  if (!V.el) return;
  const w = W.document.createElement("div"); w.className = "sub"; w.textContent = V.fed.length && Math.random() < 0.5 ? V.fed.shift() : pick(wordsOf());
  w.style.left = (15 + Math.random() * 45) + "%"; w.style.top = (18 + Math.random() * 55) + "%";
  V.el.appendChild(w); setTimeout(() => w.remove(), V.el.classList.contains("calm") ? 9500 : V.on.t.wordMs + 200);
}
function icon() {
  const b = V.el && V.el.querySelector(".icon"); if (!b) return;
  const lk = visorLocked();
  b.classList.toggle("locked", lk); b.textContent = lk ? "🔒" : "👁";
  b.title = lk ? "Locked: " + owedText() + ". The crafter or your keyholders can open it; your safeword always ends it." : "Take the visor off (the room comes back)";
}
function iconClick(e) {
  e.stopPropagation();
  if (!V.on) return;
  if (visorLocked()) { ctx.toChat("🔒 The visor won't come off yet: " + owedText() + ". Its crafter or your keyholders can open it early; your safeword always ends it.", "#a67fd4", true); return; }
  setOff(V.on.code, "icon");
  const w = wornVisor();
  off("🌀 You take the visor's hold off. The room comes back" + (hardcore() ? " for now: it takes hold again when you next log in or change rooms, or sooner with the little 🌀 in the corner or /visor on." : ". The little 🌀 in the corner, or /visor on, lets it take hold again."));
  onIcon(w);
}
// the farm's own patterns, for a visor with no pictures of its own
function farmPatterns() {
  const pts = (k, c) => { const o = []; for (let t = 0.2; t < 12 * Math.PI; t += 0.1) { const r = 10 * t; o.push((300 + r * Math.cos(t + k)).toFixed(1) + "," + (300 + r * Math.sin(t + k)).toFixed(1)); } return "<polyline points='" + o.join(" ") + "' stroke='" + c + "'/>"; };
  const a = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='#1a0b24'/><g fill='none' stroke-width='14' stroke-linecap='round'>" + pts(0, "#b978e1") + pts(Math.PI, "#f0aad7") + "</g></svg>";
  let rings = ""; for (let r = 20; r < 300; r += 22) rings += "<circle cx='300' cy='300' r='" + r + "' fill='none' stroke='" + (r % 44 ? "#e7a6d8" : "#8f5bc4") + "' stroke-width='9'/>";
  const b = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='#160a1f'/>" + rings + "</svg>";
  return [a, b].map((s) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s));
}

// ── the sessions, one after another while it's on ────────────
const animal = () => (tranceState.me && tranceState.me.animal) || "animal";
function words() {
  const me = tranceState.me || {}, P = W.Player || {}, a = animal();
  return { name: String((V.name && V.name.pet) || P.Nickname || P.Name || "sugar"), animal: a, sound: me.sound || "mmh", body: "body", pet: "good " + a, act: "obey", pose: "still", paws: "paws",
    low: me.low === "fours" ? "on all fours" : "on your knees", herd: "the farm", a, s: me.sound || "mmh", p: "body" };
}
const say = (t) => fillIn(String(t).replace(/^(\{(?:nv|nc|nt|v|c|t|f|m|fu|fb|nb|ok)\})+/, ""), words()).replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
// does a line fit them: the tags on its front against the body the farm last told us about (none known: only untagged lines)
export function fitLine(line, b) {
  const m = /^((?:\{[a-z]{1,2}\})+)/.exec(String(line));
  if (!m) return true;
  if (!b || !b.g) return false;
  for (const t of m[1].slice(1, -1).split("}{")) {
    if ((t === "v" && !b.vulva) || (t === "nv" && b.vulva) || (t === "c" && !b.cock) || (t === "nc" && b.cock) || (t === "t" && !b.tits) || (t === "nt" && b.tits) ||
        (t === "f" && b.g !== "female") || (t === "m" && b.g !== "male") || (t === "fu" && b.g !== "futa") || (t === "fb" && b.g !== "femboy") || (t === "nb" && b.g !== "nonbinary")) return false;
  }
  return true;
}
function nextSession() {
  if (!V.on || V.run) return;
  if (tranceState.session) { later(nextSession, 60000); return; }   // (the farm's runnin' a session on you: the visor waits its turn)
  const lib = library(), blocks = lib.blocks.filter((b) => !b.bad && (VISOR_KINDS.includes(b.kind) || (b.kind === "session" && b.labels.visor)));
  const all = blocks.filter((b) => b.kind === "session").map((b) => b.name), names = V.on.t.sessions.filter((n) => all.some((x) => x.toLowerCase() === n.toLowerCase()));
  const name = (names.length ? names : all)[Math.floor(Math.random() * Math.max(1, (names.length ? names : all).length))];
  const recipe = blocks.find((b) => b.kind === "session" && !!name && b.name.toLowerCase() === name.toLowerCase());
  const level = recipe && recipe.labels.level && recipe.labels.level.length ? recipe.labels.level[0] : "fun";
  const me = tranceState.me || {};
  const plan = planSession(blocks, { level, species: me.species || "", wears: [], tone: me.tone || [] }, { name: recipe ? recipe.name : "" });
  const steps = sessionSteps(plan, { keep: (t) => fitLine(t, me.body) }).filter((s) => VISOR_KINDS.includes(s.kind));
  if (!steps.length) { later(nextSession, 120000); return; }
  const ms = steps.reduce((n, s) => n + (s.gap || 0) * 1000, 0);
  V.run = { steps, i: 0, level, name: recipe ? recipe.name : "", depth: 0, base: Math.max(0.1, V.depth * 0.6) };
  V.on.deepest = deeper(V.on.deepest, level);   // (how deep it's had them: how long the name and the afterimage hold after)
  if (V.name && V.name.code === V.on.code) { V.name.level = deeper(V.name.level, level); keepName(); }
  V.depth = V.run.base;
  onHypno({ do: "under", by: BOT_MEMBER, ms: Math.round(ms + 300000), level });
  step();
}
function step() {
  const r = V.run; if (!r || !V.on) return;
  const s = r.steps[r.i];
  if (!s) { finish(); return; }
  if (s.start || s.beats || s.look || s.volume != null) onHypno({ do: "cue", kind: s.kind, block: s.block, beats: s.beats || undefined, volume: s.volume, look: Object.assign({ words: true }, s.look || {}) });
  if (s.deeper) { r.depth = Math.max(0, Math.min(100, r.depth + s.deeper)); onHypno({ do: "depth", depth: r.depth }); }
  if (s.text) {
    const line = say(s.text); ctx.toChat("[Voice] " + line, "#a67fd4", true); tranceVoice(line);
    if (fxOn("wave")) waveOver(line.length > 60 ? line.split(/[.!?]/)[0] : line);
    if (fxOn("breath") && r.i > 3 && Math.random() < 0.35) breathPuffs(3);
    if (fxOn("bloom") && /deeper|down|sink/i.test(line) && Math.random() < 0.5) bloomOnce();
  }
  r.i++;
  V.depth = Math.max(r.base, r.i / r.steps.length);
  later(step, Math.max(1, s.gap || 0) * 1000);
}
function finish() {
  const r = V.run; V.run = null; if (!V.on || !r) return;
  if (r.level === "nhl") onHypno({ do: "linger", secs: 120 }); else later(() => { if (!V.run) onHypno({ do: "wake" }); }, 4000);
  const code = V.on.code; V.done[code] = (V.done[code] || 0) + 1; keepDone();
  V.depth = 1; icon();
  const need = needOf(), n = V.done[code];
  ctx.toChat("🌀 Session over" + (r.name ? ": " + r.name : "") + "." + (hardcore() && need ? (n >= need ? " That's " + need + " of " + need + ": the visor can come off now." : " " + n + " of " + need + " before the visor can come off.") : ""), "#a67fd4", true);
  // on the farm: it counts toward your tiers, and feeds the farm's pull
  try { if (ctx.botHere()) ctx.toBot("visorDone", { code, level: r.level, session: r.name }); } catch (e) { /* fine */ }
  later(linesAsk, 6000);
  later(nextSession, 90000);   // (another, in a while, as long as it's on)
}

// ── it sinks with them (Laynie, Nov 25: "12" of the ideas): the longer a visor's worn, the stronger it gets ──
// Hours worn are counted per wearer and per visor, kept across wearin's; the crafter or a keyholder can start it over
// (/visor reset <name>). Only on a visor whose crafter let it sink.
const RUNGS = [
  { h: 1, chat: "whisper", say: "it whispers to you in the chat now" },
  { h: 3, fx: "tunnel", say: "the dark closes in at the edges as you sink" },
  { h: 6, need: 1, say: "it wants one more session before it comes off" },
  { h: 10, nameX: 2, say: "your name holds twice as long after" },
  { h: 20, chat: "melt", afterX: 2, say: "other voices melt, and it stays with you twice as long after" },
  { h: 40, need: 1, fed: true, say: "one more session again, and the room's own words find their way in" },
];
const hoursOf = (code) => ((V.hours[code] && V.hours[code].ms) || 0) / 3600000;
const rungsFor = (code, t) => (lookOf(t).sink ? RUNGS.filter((r) => hoursOf(code) >= r.h) : []);
const rungs = () => (V.on ? rungsFor(V.on.code, V.on.t) : []);
const timesX = (list, k) => list.reduce((n, r) => n * (r[k] || 1), 1);
const needOf = () => (V.on ? V.on.t.need + rungs().reduce((n, r) => n + (r.need || 0), 0) : 0);
function computeLook() {
  const L = lookOf(V.on.t); L.chat = L.chat.slice(); L.fx = L.fx.slice();
  for (const r of rungs()) { if (r.chat && !L.chat.includes(r.chat)) L.chat.push(r.chat); if (r.fx && !L.fx.includes(r.fx)) L.fx.push(r.fx); }
  return L;
}
function tickHours() {
  if (!V.on || !look().sink) return;
  const now = Date.now(), e = V.hours[V.on.code] || (V.hours[V.on.code] = { ms: 0, crafter: V.on.crafter });
  const had = rungs().length;
  e.ms += Math.max(0, Math.min(10000, now - (V.hourAt || now))); V.hourAt = now;
  if (now - V.hoursAt > 30000) { V.hoursAt = now; keepHours(); }
  const got = rungs();
  if (got.length > had) sinkDeeper(got[got.length - 1]);
}
function sinkDeeper(r) {
  keepHours();
  V.L = computeLook();
  if (V.el) { unbuild(); build(); }
  icon();
  ctx.toChat("🌀 The visor sinks a little deeper into you: " + r.say + ".", "#a67fd4", true);
}
// the room's own words, a bit of somebody's line at a time, fed up into the dark among the visor's
function feed(msg) {
  if (Math.random() < 0.5) return;
  const w = String(msg).replace(/[^\p{L}\p{Nd}' -]/gu, " ").split(/\s+/).filter((x) => x.length > 2);
  if (!w.length) return;
  const i = Math.floor(Math.random() * w.length);
  V.fed.push(w.slice(i, i + 1 + Math.floor(Math.random() * 2)).join(" ").toLowerCase().slice(0, 24));
  V.fed = V.fed.slice(-6);
}

// ── the pet name (Laynie, Nov 25: "1" of the ideas): their name in the room while it holds, and their trigger ──
// While the visor's on, their name in the room is the crafter's pet name (the game's own nickname: it tells the room).
// Somebody in the room says it and down they go, a minute or two (deeper if they're under already), at most once every
// 2 minutes, never from their own lines, the farm's, or out-of-character ones. When the visor comes off, it hangs on:
// an hour after light sessions, a day after deep ones, after no-holds-barred till the crafter or a keyholder gives
// their own name back (/visor name <name>). Changed back by hand: in the Dispensary's hardcore the visor puts it back;
// otherwise that ends it. Their safeword always gives it back. If the game won't let their name change (their owner
// keeps it), the farm's voice calls them it anyway, and it still takes them down.
const LEVELS_IN = ["", "fun", "deep", "nhl"];
const deeper = (a, b) => (LEVELS_IN.indexOf(b) > LEVELS_IN.indexOf(a || "") ? b : a || "");
const HOLD_H = { "": 1, fun: 1, deep: 24 };
function nameOn() {
  const L = look(), P = W.Player; if (!L.pet || !P || V.nameBack === V.on.code) return;
  if (!V.name || V.name.pet !== L.pet) V.name = { pet: L.pet, old: V.name ? V.name.old : String(P.Nickname || ""), level: "" };
  Object.assign(V.name, { code: V.on.code, crafter: V.on.crafter, until: 0, perm: false });
  keepName();
  if (setNick(L.pet)) ctx.toChat("🌀 Your name's " + L.pet + " now. Anybody who says it takes you down.", "#a67fd4", true);
}
function setNick(n) {
  const P = W.Player; if (!P) return false;
  if (String(P.Nickname || "") === n) return true;
  if (typeof W.CharacterSetNickname !== "function") { failName("the game won't take it"); return false; }
  let r = null; try { r = W.CharacterSetNickname(P, n); } catch (e) { r = "error"; }
  if (r) { if (n) failName(r === "NicknameLocked" ? "your owner keeps your name" : "the game won't take it"); return false; }
  if (V.name && n === V.name.pet && V.name.failed) { V.name.failed = false; keepName(); }
  return true;
}
function failName(why) {
  if (!V.name || V.name.failed) return;
  V.name.failed = true; keepName();
  ctx.toChat("🌀 The visor calls you " + V.name.pet + ", but your name in the room can't change: " + why + ". The farm's voice calls you it all the same, and it still takes you down.", "#a67fd4", true);
}
function nameAfter(was) {
  const n = V.name; if (!n || n.code !== was.code) return;
  n.level = deeper(n.level, was.deepest);
  if (n.perm || n.level === "nhl") { n.perm = true; n.until = 0; ctx.toChat("🌀 You're still " + n.pet + ". It stays your name till your crafter or a keyholder gives you yours back.", "#a67fd4", true); }
  else { n.until = Date.now() + (HOLD_H[n.level] || 1) * timesX(rungsFor(was.code, was.t), "nameX") * 3600000; ctx.toChat("🌀 You're still " + n.pet + " for a while yet.", "#a67fd4", true); }
  keepName();
}
function nameTick() {
  const n = V.name, P = W.Player; if (!n || !P) return;
  const now = Date.now(), wearing = !!(V.on && V.on.code === n.code);
  // came off while nobody was lookin' (taken off between visits): the hold starts now
  if (!wearing && !n.perm && !n.until) { nameAfter({ code: n.code, t: V.cache[n.code] || {}, deepest: "" }); return; }
  if (!wearing && !n.perm && n.until <= now) { giveName("🌀 " + n.pet + " slips off you, and your own name comes back."); return; }
  if (n.failed || String(P.Nickname || "") === n.pet) return;
  // they changed it back themselves
  if (hardcore()) { if (now - V.nameAt > 15000) { V.nameAt = now; if (setNick(n.pet)) ctx.toChat("🌀 That isn't your name. You're " + n.pet + ".", "#a67fd4", true); } return; }
  V.name = null; keepName();
  ctx.toChat("🌀 You take your own name back, and the visor lets go of it.", "#a67fd4", true);
}
function giveName(say) {
  const n = V.name; if (!n) return;
  V.name = null; keepName();
  if (V.on && V.on.code === n.code) V.nameBack = n.code;   // (given back while it's still on: it stays given back this wearin')
  if (!n.failed && String((W.Player || {}).Nickname || "") === n.pet) setNick(n.old || "");
  if (say) ctx.toChat(say, "#a67fd4", true);
}
function nameHeard(msg) {
  const n = V.name; if (!n || !n.pet) return false;
  if (!(n.perm || n.until > Date.now() || (V.on && V.on.code === n.code))) return false;
  const esc = n.pet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^\\p{L}\\p{Nd}])" + esc + "($|[^\\p{L}\\p{Nd}])", "iu").test(msg);
}
function dropName(sender) {
  const now = Date.now(); if (now - V.dropAt < 120000) return;
  V.dropAt = now;
  const who = String(sender.Nickname || sender.Name || "Somebody").slice(0, 30), pet = V.name.pet;
  if (V.run || tranceState.session) {
    V.depth = Math.min(1, V.depth + 0.15); depthDraw();
    if (tranceState.session) onHypno({ do: "depth", depth: Math.min(100, (Number(tranceState.depth) || 0) + 15) });
    ctx.toChat("🌀 " + who + " says “" + pet + "”, and you sink deeper.", "#a67fd4", true);
    return;
  }
  onHypno({ do: "under", by: BOT_MEMBER, ms: 120000, level: "fun" });
  const s = tranceState.session;
  ctx.toChat("🌀 " + who + " says “" + pet + "”… and down you go.", "#a67fd4", true);
  try { tranceVoice("That's your name now, " + pet + ". Hear it, and drop."); } catch (e) { /* fine */ }
  setTimeout(() => { try { if (s && tranceState.session === s && !V.run) onHypno({ do: "wake" }); } catch (e) { /* fine */ } }, 90000 + Math.random() * 30000);
}

// ── the afterimage (Laynie, Nov 25: "11"): after it comes off, a faint spiral at the edges of the ordinary screen and the
// odd word driftin' by; 15 minutes after light sessions, 2 hours after deep, 6 after no-holds-barred (5 minutes if no
// session ever started). It lasts through a reload; the calm look holds it still; the safeword clears it.
const AFTER_MIN = { "": 5, fun: 15, deep: 120, nhl: 360 };
function afterStart(was) {
  const mins = (AFTER_MIN[was.deepest || ""] || 5) * timesX(rungsFor(was.code, was.t), "afterX");
  V.after = { until: Date.now() + mins * 60000, total: mins * 60000, words: (was.t.words.length ? was.t.words : DEFAULT_WORDS()).slice(0, 12) };
  keepAfter(); afterDraw();
}
function afterTick() {
  if (V.after && !(V.after.until > Date.now() && Array.isArray(V.after.words) && V.after.words.length)) { V.after = null; keepAfter(); }
  afterDraw();
}
function afterDraw() {
  const d = W.document; if (!d || !d.body) return;
  if (!(V.after && !V.on && ctx && !(ctx.prefs() || {}).noVisor)) { if (V.afterEl) { V.afterEl.remove(); V.afterEl = null; } clearInterval(V.afterT); V.afterT = null; return; }
  css();
  if (!V.afterEl) {
    const el = d.createElement("div"); el.id = "fhc-visor-after";
    const img = d.createElement("img"); img.alt = ""; img.src = spiralMark(); el.appendChild(img);
    d.body.appendChild(el); V.afterEl = el;
    V.afterT = setInterval(() => { try { if (V.afterEl && V.after && Math.random() < 0.5) afterWord(); } catch (e) { /* fine */ } }, 30000);
  }
  const left = Math.max(0, V.after.until - Date.now()) / Math.max(1, V.after.total);
  V.afterEl.style.opacity = (0.35 + 0.65 * left).toFixed(3);
  V.afterEl.classList.toggle("calm", calmNow());
}
function afterWord() {
  const w = W.document.createElement("div"); w.className = "aw"; w.textContent = pick(V.after.words);
  w.style.left = (Math.random() < 0.5 ? 2 + Math.random() * 10 : 78 + Math.random() * 12) + "%"; w.style.top = (8 + Math.random() * 80) + "%";
  V.afterEl.appendChild(w); setTimeout(() => w.remove(), 7000);
}
// what's holdin' on to them from a visor (the trance card lists it)
const leftText = (ms) => (ms > 5400000 ? Math.round(ms / 3600000) + " h" : Math.max(1, Math.round(ms / 60000)) + " min");
export function visorHolds() {
  const o = [], now = Date.now();
  if (V.name) o.push("called " + V.name.pet + (V.on && V.on.code === V.name.code ? " while the visor's on" : V.name.perm ? " till it's given back" : V.name.until ? " (" + leftText(V.name.until - now) + ")" : ""));
  if (V.after && !V.on) o.push("the visor's afterimage (" + leftText(V.after.until - now) + ")");
  return o;
}

// ── the visor maker (Settings › 🌀 Visor maker) ───────────────
const SPIRAL_NAMES = { classic: "classic: two arms", pinwheel: "pinwheel: eight arms", tight: "tight: many turns", tunnel: "tunnel: rings driftin' out", counter: "two spirals, turnin' against each other",
  hearts: "hearts along a spiral", paws: "paw prints along a spiral", bells: "bells along a spiral", words: "the words, written along the spiral", none: "no spiral" };
const CHAT_NAMES = { whisper: "whispers between lines", melt: "other voices melt", fade: "other voices fade", watermark: "a spiral turnin' over the chat" };
const FX_NAMES = { float: "room voices float by", wave: "the farm's voice over the head", breath: "breath puffs", tunnel: "tunnel vision, closin' in as they sink", bloom: "a pink bloom now and then",
  warp: "meltin' warp", ripple: "ripples", crowd: "a watchin' crowd", kalei: "pictures in a kaleidoscope", hearts: "risin' hearts", aura: "an aura round the body", meter: "a trance meter",
  face: "a close-up of the face, in the corner", zoom: "the view comin' in close to the face" };
function maker() { try { const v = JSON.parse(LS.getItem(MAKER_KEY)); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } }
function keepMaker(m) { try { LS.setItem(MAKER_KEY, JSON.stringify(m)); } catch (e) { /* fine */ } }
export function visorMakerCards(pctx) {
  const M = Object.assign({ sessions: [], need: 1, show: "crafter", words: "", set: "", own: "", picOp: 0.35, wordEvery: 3, wordOp: 0.45, fit: "cover" }, JSON.parse(JSON.stringify(LOOK_DEFAULTS)), { linesNeed: 5 }, maker());
  const set = (k, v) => { M[k] = v; keepMaker(M); };
  const tick = (k, v, label) => h("label", { style: { display: "inline-block", marginRight: "10px" } }, h("input", { type: "checkbox", checked: (Array.isArray(M[k]) ? M[k].includes(v) : !!M[k]) || null,
    onchange: (e) => set(k, Array.isArray(M[k]) ? (e.target.checked ? M[k].concat(v) : M[k].filter((x) => x !== v)) : e.target.checked) }), " " + label);
  if (!V.lib || Date.now() - V.listAt > 3600000) publicList().then(() => { try { if (pctx.setUi) pctx.setUi({}); } catch (e) { /* fine */ } });
  const list = visorSessions(), sets = Object.keys(V.sets);
  const result = h("div", { class: "fhc-muted" });
  const make = () => {
    const own = String(M.own || "").split(/\s+/).filter(Boolean);
    const pictures = M.set === "__own" ? own.filter(okLink) : M.set && V.sets[M.set] ? V.sets[M.set].slice() : [];
    const skipped = M.set === "__own" ? own.length - pictures.length : 0;
    const t = normTuning({ sessions: M.sessions, need: M.need, show: M.show, words: M.words, set: M.set === "__own" ? "" : M.set, pictures, picOp: M.picOp, wordEvery: M.wordEvery, wordOp: M.wordOp, fit: M.fit,
      spiral: M.spiral, spin: M.spin, place: M.place, spOp: M.spOp, breathe: M.breathe, drift: M.drift, chat: M.chat, lines: M.lines, linesNeed: M.linesNeed, linesLock: M.linesLock, fx: M.fx,
      pet: M.pet, sink: M.sink });
    const code = tuningCode(t); remember(code, t);
    try { if (ctx.botHere()) ctx.toBot("visorKeep", { code, t }); } catch (e) { /* fine */ }
    const line = descLine(code, t);
    result.textContent = "";
    result.appendChild(h("div", { style: { margin: "6px 0", padding: "6px 8px", border: "1px dashed #8a6aa0", borderRadius: "6px", userSelect: "all", fontFamily: "monospace" } }, line));
    result.appendChild(btn("Copy it", () => { try { W.navigator.clipboard.writeText(line); } catch (e) { /* select it by hand */ } }, true));
    if (M.set === "__own") result.appendChild(h("div", null, pictures.length + " of your links in it" + (skipped ? "; " + skipped + " left out (not a picture's own address: https, and not a web page)" : "") +
      (pictures.length ? "" : ", so it shows the farm's own patterns") + "."));
    if (pictures.some((u) => /encrypted-tbn\d*\.gstatic\.com/i.test(u))) result.appendChild(h("div", null, "(Those are Google's little search thumbnails: they'll look blurry stretched across the screen. Open the picture itself and Copy image address for the full size.)"));
    result.appendChild(h("div", null, "Craft the visor (any visor, or anything worn over the eyes) and put this line in its description. These settings are locked in by that code: change any of them and you get a new line."));
  };
  const opt = (v, label, now) => h("option", { value: String(v), selected: String(v) === String(now) || null }, label);
  return [card(title("🌀 Visor maker"),
    muted("Make a farm visor: a crafted item that takes the room away from whoever wears it, and puts them under. Sessions come from " + (V.listFrom || "the farm's list") + "."),
    h("div", null, muted("Sessions it plays (one at a time, picked fresh):"),
      list.length ? list.map((s) => h("label", { style: { display: "block" } }, h("input", { type: "checkbox", checked: M.sessions.includes(s.name) || null, onchange: (e) => set("sessions", (e.target.checked ? M.sessions.concat(s.name) : M.sessions.filter((x) => x !== s.name)).slice(0, MAX_SESSIONS)) }), " " + s.name + " (" + s.level.join(", ") + ")"))
        : muted("(the farm's list is still loadin')")),
    h("div", null, muted("Before a hardcore wearer can take it off:"), h("select", { onchange: (e) => set("need", Number(e.target.value)) }, [0, 1, 2, 3, 4, 5].map((n) => opt(n, n ? n + " full session" + (n === 1 ? "" : "s") : "any time", M.need)))),
    h("div", null, muted("Whose body they see:"), h("select", { onchange: (e) => set("show", e.target.value) }, opt("crafter", "mine (the crafter's)", M.show), opt("wearer", "their own", M.show))),
    h("div", null, muted("Subliminal words (comma between):"), h("input", { value: M.words, size: 40, placeholder: "good cow, empty, deeper", onchange: (e) => set("words", e.target.value) })),
    h("div", null, muted("Pictures:"), h("select", { onchange: (e) => set("set", e.target.value) }, opt("", "the farm's own patterns", M.set), sets.map((n) => opt(n, n + " (the farm's set)", M.set)), opt("__own", "my own links", M.set)),
      h("textarea", { rows: 3, cols: 40, placeholder: "my own links, one per line: https://…/spiral.gif", onchange: (e) => set("own", e.target.value) }, M.own || "")),
    h("div", null, muted("How strong:"),
      h("select", { title: "how see-through the pictures are", onchange: (e) => set("picOp", Number(e.target.value)) }, [0.2, 0.35, 0.5, 0.65].map((v) => opt(v, "pictures " + Math.round(v * 100) + "%", M.picOp))),
      h("select", { title: "how often a word shows", onchange: (e) => set("wordEvery", Number(e.target.value)) }, [2, 3, 4, 6].map((v) => opt(v, "a word every " + v + " s", M.wordEvery))),
      h("select", { title: "how bright a word gets", onchange: (e) => set("wordOp", Number(e.target.value)) }, [[0.25, "faint words"], [0.45, "soft words"], [0.6, "strong words"]].map(([v, l]) => opt(v, l, M.wordOp))),
      h("select", { onchange: (e) => set("fit", e.target.value) }, opt("cover", "pictures fill", M.fit), opt("contain", "whole pictures", M.fit))),
    h("div", null, muted("The spiral:"),
      h("select", { onchange: (e) => set("spiral", e.target.value) }, SPIRALS.map((v) => opt(v, SPIRAL_NAMES[v] || v, M.spiral))),
      h("select", { onchange: (e) => set("spin", e.target.value) }, SPINS.map((v) => opt(v, { slow: "turnin' slow", slower: "slower", still: "still" }[v], M.spin))),
      h("select", { onchange: (e) => set("place", e.target.value) }, PLACES.map((v) => opt(v, { behind: "behind the body", over: "over everything, faint", both: "both" }[v], M.place))),
      h("select", { title: "how strong the spiral is", onchange: (e) => set("spOp", Number(e.target.value)) }, [0.2, 0.3, 0.4, 0.55, 0.7].map((v) => opt(v, "spiral " + Math.round(v * 100) + "%", M.spOp))),
      h("div", null, tick("breathe", true, "breathin' zoom"), tick("drift", true, "colours driftin'"))),
    h("div", null, muted("In the chat:"), h("div", null, CHAT_FX.map((v) => tick("chat", v, CHAT_NAMES[v])))),
    h("div", null, muted("Lines to write out (they type it in the chat; lines that match stay between them and the visor):"),
      h("input", { value: M.lines || "", size: 40, placeholder: "I am the farm's good cow", onchange: (e) => set("lines", e.target.value) }),
      h("select", { onchange: (e) => set("linesNeed", Number(e.target.value)) }, [3, 5, 10, 20].map((n) => opt(n, n + " times", M.linesNeed))),
      tick("linesLock", true, "they count toward the hardcore lock")),
    h("div", null, muted("More (all slow, nothin' flashes):"), h("div", null, FX.map((v) => tick("fx", v, FX_NAMES[v])))),
    h("div", null, muted("A pet name for whoever wears it (their name in the room while it's on, and a while after; anybody who says it takes them down):"),
      h("input", { value: M.pet || "", size: 22, maxlength: 20, placeholder: "Bessie", onchange: (e) => set("pet", e.target.value) })),
    h("div", null, tick("sink", true, "it sinks with them: the longer it's worn, the stronger it gets"),
      muted("(1 hour: whispers in the chat · 3: tunnel vision · 6: one more session before it comes off · 10: the name holds twice as long · 20: voices melt, and it lingers twice as long after · 40: one more session again, and the room's own words get fed in)")),
    h("div", { style: { marginTop: "6px" } }, btn("Make the visor", make, true)),
    result,
    muted("Words fade in and out (never a strobe). Wearers can switch the trance look off, or keep it calm, in their own Companion; their safeword always ends it."))];
}
export const visorState = V;   // (tests)
