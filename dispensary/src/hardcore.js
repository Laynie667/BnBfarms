/* WHAT'S IN THIS FILE (hardcore.js)
   HARDCORE (Laynie, Nov 16: "a hardcore option, like bc plus does - but make sure that the owner level, and the
   proprietors of the farm can always access and change their settings"; Nov 17: "it can be set to have no end date, but
   a keyholder, owner, proprieters companion needs to ping the hardcore users dispensary and companion atleast once
   every 30 days, otherwise, it will unlock after 30 days without the ping").
   - Only you switch it on, for yourself, after a plain warning, and only with a keyholder: your owner, or the
     proprietors if you're on the farm's books.
   - Then you can't change your own settings, and your safeword asks your keyholders to let you out instead of liftin'
     your doses. Your keyholders can check in, let you out (every dose lifted), change your settings, or end it.
   - It ends on its end date (1 to 30 days), or, with none, after 30 days without a keyholder checkin' in. Bein' in the
     same room as one counts by itself (their Dispensary or Companion answers yours); they can check in by beep too.
   - Every change a keyholder makes is shown to you, and kept in a short log.
   Messages (the farm's own envelope, shared/protocol.js; only ever acted on from your keyholders):
     you → keyholder   dispHard { on, until, due, keys, name }   in the room: here's my hardcore, you hold a key
     keyholder → you   dispKey { do: check | letout | end | extend | set | state, ... }
     you → keyholder   dispKeyState { who, clock, off, doses, until, due }   for their settings editor
     you → keyholder   dispAsk { name }                           your safeword: please let me out
   Out of the room: a beep. Yours to them is plain words they can read without any add-on; theirs to you carries a small
   tag ([fd:check], [fd:letout], [fd:end]) your Dispensary acts on and tidies away. (The game only lets friends beep
   each other; otherwise sharin' a room does it.)
*/
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { PROPRIETORS, LADDER } from "./config.js";
import { st, save } from "./store.js";
import { local, nameOf } from "./say.js";
import { clearAll, setClock, doseIds, active, leftMs } from "./doses.js";

const W = window, DAY = 86400000;
export const CHECK_DAYS = 30;
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const here = (mn) => (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn);
const who = (mn) => (here(mn) ? nameOf(mn) : "#" + mn);
let onChange = () => {};
export function onHardChange(f) { onChange = f; }

export const hardOn = () => !!(st().hard && st().hard.on);
export function keyholders() {
  const P = W.Player, out = [];
  const own = P && P.Ownership && P.Ownership.MemberNumber;
  if (typeof own === "number" && own > 0 && own !== me()) out.push(own);
  if (st().stock) for (const m of PROPRIETORS) if (m !== me() && !out.includes(m)) out.push(m);
  for (const m of st().keys || []) if (m !== me() && !out.includes(m)) out.push(m);   // added by member number
  return out;
}
// keyholders you add yourself, by member number (Laynie, Nov 17: "there should be a way to add keyholders by id").
// Only outside hardcore: once you're locked in, who holds your key is locked in with you.
export const MAX_KEYS = 10;
export function addKey(mn) {
  mn = Math.round(Number(mn));
  if (hardOn()) return { ok: false, why: "locked" };
  if (!Number.isInteger(mn) || mn <= 0 || mn >= 1e9) return { ok: false, why: "number" };
  if (mn === me()) return { ok: false, why: "self" };
  const S = st(); S.keys = S.keys || [];
  if (S.keys.includes(mn) || keyholders().includes(mn)) return { ok: false, why: "already" };
  if (S.keys.length >= MAX_KEYS) return { ok: false, why: "full" };
  S.keys.push(mn); save(); onChange();
  return { ok: true };
}
export function removeKey(mn) {
  if (hardOn()) return { ok: false, why: "locked" };
  const S = st(), i = (S.keys || []).indexOf(Number(mn));
  if (i < 0) return { ok: false, why: "none" };
  S.keys.splice(i, 1); save(); onChange();
  return { ok: true };
}
const companion = () => { try { const C = W.FarmhandCompanion; return C && typeof C.hardPrefs === "function" ? C : null; } catch (e) { return null; } };
export const isKey = (mn) => typeof mn === "number" && keyholders().includes(mn);
// when it lets go by itself: the end date, or 30 days after the last check-in
export function dueAt() { const H = st().hard || {}; return H.until ? H.until : (H.checkAt || H.since || Date.now()) + CHECK_DAYS * DAY; }

function log(by, what) { const H = st().hard; H.log = (H.log || []).concat({ t: Date.now(), by, what: String(what).slice(0, 200) }).slice(-50); }
export const hardLog = () => ((st().hard && st().hard.log) || []).slice();

function sendTo(mn, type, data) {
  try { if (here(mn) && typeof W.ServerSend === "function") { W.ServerSend("ChatRoomChat", makeMsg(type, data, mn)); return true; } } catch (e) { /* fine */ }
  return false;
}
function beepTo(mn, text) {
  try { if (typeof W.ServerSend === "function") { W.ServerSend("AccountBeep", { MemberNumber: mn, BeepType: "", Message: String(text).slice(0, 900) }); return true; } } catch (e) { /* fine */ }
  return false;
}

// ── you ──────────────────────────────────────────────────
// tell the keyholders in the room about it (their add-on checks in by itself)
export function announce() {
  const H = st().hard || {}, keys = keyholders();
  for (const k of keys) sendTo(k, "dispHard", { on: hardOn(), until: H.until || 0, due: hardOn() ? dueAt() : 0, keys, name: (W.Player && (W.Player.Nickname || W.Player.Name)) || "" });
}
export function lock(days) {
  if (hardOn()) return { ok: false, why: "on" };
  if (!keyholders().length) return { ok: false, why: "nokey" };
  const now = Date.now(), d = Math.max(0, Math.min(CHECK_DAYS, Math.round(Number(days) || 0)));
  st().hard = { on: true, since: now, until: d ? now + d * DAY : 0, checkAt: now, log: (st().hard && st().hard.log) || [] };
  log(me(), d ? "locked in for " + d + " day" + (d === 1 ? "" : "s") : "locked in, no end date");
  save(true); announce(); onChange();
  return { ok: true };
}
export function unlock(by, why) {
  if (!hardOn()) return false;
  const H = st().hard; H.on = false; H.until = 0;
  log(by, "hardcore off: " + why);
  save(true); announce(); onChange();
  local("🔓 Hardcore's off (" + why + "). Your settings are yours again, and so is your safeword.");
  return true;
}
export function checkIn(by) {
  if (!hardOn() || !isKey(by)) return false;
  const H = st().hard, now = Date.now(), last = H.checkAt || 0;
  H.checkAt = now;
  if (now - last > DAY) log(by, "checked in");
  save(); onChange();
  return true;
}
export function tickHard() {
  if (!hardOn()) return;
  const H = st().hard, now = Date.now();
  if (H.until && now >= H.until) unlock(me(), "the end date came");
  else if (!H.until && now - (H.checkAt || H.since || now) >= CHECK_DAYS * DAY) unlock(0, CHECK_DAYS + " days without a keyholder checkin' in");
}
// your safeword, in hardcore: ask, don't lift
let askedAt = 0;
export function askOut() {
  const now = Date.now(), keys = keyholders(), name = (W.Player && (W.Player.Nickname || W.Player.Name)) || "Somebody";
  if (now - askedAt < 5 * 60000) { local("🗝️ Your keyholders have already been asked. Your doses stay till one of them lets you out."); return 0; }
  askedAt = now;
  let n = 0;
  for (const k of keys) {
    if (sendTo(k, "dispAsk", { name })) n++;
    else if (beepTo(k, "🗝️ " + name + " (" + me() + ") is askin' to be let out of hardcore in The Farmhand's Dispensary. If you've the Dispensary, open its page (Keys you hold); with the Companion, /keys letout " + me() + ".")) n++;
  }
  log(me(), "asked to be let out");
  save();
  local("🗝️ Hardcore: your doses stay. " + (n ? "Your keyholders have been asked to let you out: " + keys.map(who).join(", ") + "." : "None of your keyholders could be reached just now."));
  return n;
}

// a keyholder's word
export function onKey(by, m) {
  if (!isKey(by) || !m || typeof m !== "object") return false;
  const H = st().hard, nm = who(by);
  if (m.do === "check") { if (checkIn(by)) sendTo(by, "dispHard", { on: true, until: H.until || 0, due: dueAt(), keys: keyholders(), name: (W.Player && (W.Player.Nickname || W.Player.Name)) || "" }); return true; }
  if (!hardOn()) return false;   // outside hardcore your settings are yours
  if (m.do === "state") { sendTo(by, "dispKeyState", stateFor()); checkIn(by); return true; }
  if (m.do === "letout") { const n = clearAll("keyholder"); log(by, "let you out (" + n + " dose" + (n === 1 ? "" : "s") + " lifted)"); save(); local("🗝️ " + nm + " let you out: every dose in you is lifted."); checkIn(by); onChange(); return true; }
  if (m.do === "end") { checkIn(by); return unlock(by, "ended by " + nm); }
  if (m.do === "extend") {
    const d = Math.max(0, Math.min(CHECK_DAYS, Math.round(Number(m.days) || 0)));
    H.until = d ? Date.now() + d * DAY : 0; H.checkAt = Date.now();
    log(by, d ? "set the end to " + d + " day" + (d === 1 ? "" : "s") + " from now" : "took the end date away");
    save(); local("🗝️ " + nm + " " + (d ? "set your hardcore to end in " + d + " day" + (d === 1 ? "" : "s") + "." : "took your end date away. A keyholder checks in every " + CHECK_DAYS + " days instead.")); onChange();
    return true;
  }
  if (m.do === "set") {
    const S = st(), said = [];
    if (typeof m.who === "string" && LADDER.some((r) => r.id === m.who) && m.who !== S.who) { S.who = m.who; said.push("who can dose you: " + LADDER.find((r) => r.id === m.who).label); }
    if ((m.clock === "real" || m.clock === "online") && m.clock !== S.clock) { setClock(m.clock); said.push("the clock: " + (m.clock === "real" ? "real time" : "while online")); }
    if (m.off && typeof m.off === "object") for (const id of doseIds()) if (typeof m.off[id] === "boolean" && !!S.off[id] !== m.off[id]) { if (m.off[id]) S.off[id] = true; else delete S.off[id]; said.push(id + (m.off[id] ? " switched off" : " switched on")); }
    // the Companion's frozen switches, if it's here too (only those: your privacy choices stay yours)
    if (m.companion && typeof m.companion === "object" && companion()) { try { said.push(...companion().setHardPrefs(m.companion)); } catch (e) { /* fine */ } }
    if (!said.length) return true;
    log(by, "changed " + said.join(", "));
    save(); checkIn(by); onChange();
    local("🗝️ " + nm + " changed your Dispensary: " + said.join("; ") + ".");
    sendTo(by, "dispKeyState", stateFor());
    return true;
  }
  return false;
}
function stateFor() {
  const S = st();
  let comp = null; try { comp = companion() ? companion().hardPrefs() : null; } catch (e) { comp = null; }
  return { who: S.who, clock: S.clock, off: Object.assign({}, S.off), doses: doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })), until: (S.hard && S.hard.until) || 0, due: dueAt(), companion: comp };
}

// ── a keyholder (you hold a key for somebody) ────────────
export const wards = () => st().wards || (st().wards = {});
function onWardHard(from, m) {
  if (!Array.isArray(m.keys) || !m.keys.includes(me())) return;
  const w = wards();
  if (!m.on) { if (w[from]) { delete w[from]; save(); onChange(); } return; }
  const was = w[from], now = Date.now();
  w[from] = Object.assign({}, was, { name: String(m.name || "").slice(0, 40), until: Number(m.until) || 0, due: Number(m.due) || 0, seen: now });
  save(); onChange();
  // checkin' in by bein' here: at most once an hour each
  if (!was || now - (was.checked || 0) > 3600000) { w[from].checked = now; sendTo(from, "dispKey", { do: "check" }); }
}
const wardStates = {};
export const wardState = (mn) => wardStates[mn] || null;
// from the page's buttons: in the room a hidden word, otherwise a beep with a tag
export function keyDo(mn, what, data) {
  if (sendTo(mn, "dispKey", Object.assign({ do: what }, data || {}))) return "room";
  const words = { check: "checked in on your hardcore", letout: "let you out: every dose lifted", end: "ended your hardcore" };
  if (!words[what]) return null;
  const nm = (W.Player && (W.Player.Nickname || W.Player.Name)) || "Your keyholder";
  return beepTo(mn, "🗝️ " + nm + " " + words[what] + ". [fd:" + what + "]") ? "beep" : null;
}

export function initHardcore(mod) {
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try {
        const data = args[0];
        if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me()) {
          const m = readMsg(data);
          if (m && m.type === "dispKey") onKey(data.Sender, m);
          else if (m && m.type === "dispHard") onWardHard(data.Sender, m);
          else if (m && m.type === "dispKeyState") { wardStates[data.Sender] = m; onChange(); }
          else if (m && m.type === "dispAsk" && wards()[data.Sender]) { wards()[data.Sender].asked = Date.now(); save(); onChange(); local("🗝️ " + who(data.Sender) + " is askin' to be let out of hardcore. Open the Dispensary's page (Keys you hold) to let them out."); }
        }
      } catch (e) { console.warn("[Dispensary] hardcore:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] keyholders can't reach you:", e); }
  // a keyholder's beep with our tag: do it, and tidy the tag off before the game shows it
  try {
    mod.hookFunction("ServerAccountBeep", 11, (args, next) => {
      try {
        const d = args[0], t = d && typeof d.Message === "string" ? /\s*\[fd:(check|letout|end)\]\s*$/.exec(d.Message) : null;
        if (t) { if (isKey(d.MemberNumber)) onKey(d.MemberNumber, { do: t[1] }); d.Message = d.Message.slice(0, t.index); }
      } catch (e) { /* the beep as it is */ }
      return next(args);
    });
  } catch (e) { /* beeps can't carry it: the room still does */ }
  // walkin' into a room: your keyholders there hear about it
  try { mod.hookFunction("ChatRoomSync", 11, (args, next) => { const r = next(args); setTimeout(() => { if (hardOn()) announce(); }, 3000); return r; }); } catch (e) { /* fine */ }
}
