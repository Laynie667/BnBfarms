/* WHAT'S IN THIS FILE (homeward.js)
   THE FARM GIRL'S WHISTLE (Nov 23; Laynie: "It might be worth building the farm girls summon into the companion itself, so
   summoning cattle back doesnt rely on bc plus or being friends"). For somebody under a contract that has them ready to be
   summoned (the bot's roam passes, 10uk-roam.js):
   • While they're on the farm the bot sends their roam rules, and the Companion keeps them on this computer: the pass and
     when it ends, how many they hold, the contract's end, whether it's permanent, who may summon them.
   • Off the farm, the Companion keeps the time itself, so nothin' needs BC+ or the farm girl on their friend list:
       a note at 10 and at 2 minutes left on the pass;
       out of time (or out with no pass): 30 seconds' warnin', then it walks them home, out of wherever they are, past
       leashes and locked doors, into the farm. A full farm: in the moment there's a space.
       holdin' passes but none started (they logged in somewhere else, or were pulled away): one starts, the same as the
       farm girl would start it, and she's told when they're back so it comes off their books.
   • A summon from the farm girl or staff (the bot's beep, "summon · …") does the same: 30 seconds, then home. BC+'s own
     summon still works alongside it, as a backup.
   • Permanent contracts roam too, half an hour a pass: BC+'s Forbid leaving keeps the door shut, so the Companion walks
     them out for it (a forced move, which BC+ lets through, like a leash).
   • Never: for ROAM_SAFE_MIN after their safeword (the farm's or the game's), once the contract's over, or with the
     Companion off.
*/
const W = window, KEY = "fhc-home", WARN_S = 30, SAFE_MIN = 30, TICK_MS = 5000, BUSY_MAX = 3 * 60000;
const BUSY = new Set(["Appearance", "Crafting", "Wardrobe", "Shop", "Shop2", "InformationSheet", "Preference", "FriendList", "Title", "OnlineProfile"]);
let deps = { botMn: 0, say: null, onBack: null }, walking = false, countdown = null, retryAt = 0, busySince = 0, wantOutAt = 0;
const load = () => { try { return JSON.parse(W.localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
const save = (h) => { try { if (h) W.localStorage.setItem(KEY, JSON.stringify(h)); else W.localStorage.removeItem(KEY); } catch (e) { /* fine */ } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clock = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };
const loggedIn = () => !!(W.Player && W.Player.MemberNumber) && W.CurrentScreen !== "Login" && W.CurrentScreen !== "Relog";
const inRoom = () => W.CurrentScreen === "ChatRoom" && !!W.ChatRoomData;
export const atFarm = (h) => inRoom() && !!h && String(W.ChatRoomData.Name || "").toLowerCase() === String(h.room || "").toLowerCase();
// a note they'll see: in a room, in the chat; anywhere else, the game's own pop-up
function tell(text) {
  try { if (inRoom() && deps.say) { deps.say(text); return; } } catch (e) { /* fall through */ }
  try { if (typeof W.ServerShowBeep === "function") W.ServerShowBeep(text, 8000, { silent: false }); } catch (e) { /* fine */ }
}

// the bot's state (on the farm): their roam rules, kept here for when they're off it
export function homeKeep(s) {
  if (!s || typeof s !== "object") return;
  const ro = s.roam, prev = load(), now = Date.now();
  if (!ro) { if (prev) save(null); return; }   // no summonin' contract any more
  const h = {
    room: String(ro.room || (prev && prev.room) || "B&B Farm"), space: String(ro.space || (prev && prev.space) || "X"),
    until: Number(ro.until) || 0, left: Number(ro.left) || 0, mins: Number(ro.mins) || 60, perm: !!ro.perm,
    ends: Number((s.contract && s.contract.until) || ro.ends) || 0, by: Array.isArray(ro.by) ? ro.by.filter(Number.isInteger).slice(0, 60) : [],
    safeUntil: Math.max(ro.safe ? now + SAFE_MIN * 60000 : 0, (prev && prev.safeUntil) || 0), warned: [], at: now,
  };
  if (prev && prev.until === h.until) h.warned = prev.warned || [];
  if (prev && prev.local && !(h.until > now)) h.local = prev.local;   // a pass started off the farm, still to be told
  save(h);
  // a permanent contract's pass: the door won't let them out, so the Companion walks them out (they asked a minute ago)
  if (h.perm && h.until > now && wantOutAt && now - wantOutAt < 90000 && atFarm(h)) { wantOutAt = 0; walkOut(h); }
}
// they asked to roam (the panel's Roam button, or the door): for a permanent contract's walk out
export function homeWantOut() { wantOutAt = Date.now(); }
// a safeword (the farm's, or the game's own): nobody's fetchin' them for a while
export function homeSafe() { const h = load(); if (!h) return; h.safeUntil = Date.now() + SAFE_MIN * 60000; save(h); cancel(); }
// back on the farm: a pass the Companion started off it, for the farm girl's books (index.js tells her)
export function homeLocalPass() { const h = load(); if (!h || !h.local) return null; const l = h.local; delete h.local; save(h); return l; }
function cancel() { if (countdown) { clearTimeout(countdown.t); countdown = null; } }

function whistle(h, why) {
  if (countdown) return;
  const warn = deps.warnS || WARN_S;   // (the tests shorten it)
  tell("🧭 " + why + " The farm girl's whistle carries all the way out here: back on the farm in " + warn + " seconds.");
  countdown = { at: Date.now(), t: setTimeout(() => { countdown = null; const h2 = load(); if (h2 && !atFarm(h2) && !(h2.safeUntil > Date.now())) walkHome(h2); }, warn * 1000) };
}

// out of wherever they are (past a leash or a locked door: a forced move, like BC+'s summon), into the farm
export async function walkHome(h) {
  if (walking || !h) return false;
  walking = true;
  try {
    tell("🧭 Home to the farm you go, sugar.");
    try { if (typeof W.ServerPlayerIsInChatRoom === "function" && W.ServerPlayerIsInChatRoom() && typeof W.ChatRoomLeave === "function") W.ChatRoomLeave(true); } catch (e) { /* on to the search anyway */ }
    if (typeof W.ChatSearchStart === "function") await W.ChatSearchStart(h.space || "X", ["Room", "MainHall"], { Background: "Introduction" });
    for (let i = 0; i < 20 && W.CurrentScreen !== "ChatSearch"; i++) await sleep(500);
    let res = null;
    if (typeof W.ServerRoomJoin === "function") res = await W.ServerRoomJoin(h.room);
    else { W.ServerSend("ChatRoomJoin", { Name: h.room }); res = null; }
    const err = res && res.error ? String(res.error.message || res.error) : "";
    if (err) {
      retryAt = Date.now() + 30000;
      tell(/full/i.test(err) ? "🧭 The farm's full right now. You'll go in the moment there's a space." : "🧭 Couldn't get you through the farm gate (" + err.slice(0, 60) + "). Tryin' again shortly.");
      return false;
    }
    return true;
  } catch (e) { console.warn("[Farmhand Companion] walkin' home:", e); retryAt = Date.now() + 30000; return false; }
  finally { walking = false; }
}
// a permanent contract's pass: out the door they can't use, to the lobby, and the pass runs from here
async function walkOut(h) {
  if (walking) return; walking = true;
  try {
    tell("🧭 The farm girl walks you out to the gate, sugar. Half an hour: back by " + clock(h.until) + ", or she whistles you home.");
    if (typeof W.ChatRoomLeave === "function") W.ChatRoomLeave(true);
    if (typeof W.ChatSearchStart === "function") await W.ChatSearchStart(h.space || "X", ["Room", "MainHall"], { Background: "Introduction" });
  } catch (e) { console.warn("[Farmhand Companion] walkin' out:", e); }
  finally { walking = false; }
}

export function homeTick() {
  const h = load(); if (!h) { cancel(); return; }
  const now = Date.now();
  if (h.ends && h.ends <= now) { save(null); cancel(); return; }   // the contract's over
  if (!loggedIn() || walking) return;
  if (h.safeUntil > now || atFarm(h)) { cancel(); busySince = 0; return; }
  if (retryAt > now) return;
  // in the middle of dressin', craftin', a profile: wait for them (a few minutes at most)
  if (BUSY.has(String(W.CurrentScreen || ""))) { if (!busySince) busySince = now; if (now - busySince < BUSY_MAX) return; } else busySince = 0;
  if (h.until > now) {
    const mins = Math.ceil((h.until - now) / 60000);
    for (const w of [10, 2]) if (mins <= w && !(h.warned || []).includes(w)) {
      h.warned = (h.warned || []).concat(w); save(h);
      tell(w > 2 ? "🧭 " + mins + " minutes left on your roam pass, sugar. Start headin' home." : "🧭 " + mins + " minutes, sugar. Be back on the farm or she whistles you home.");
      break;
    }
    return;
  }
  // holdin' a pass but none started: one starts, as the farm girl would start it (and she's told when they're back)
  if (h.left > 0 && !h.spentFor && !h.until) {
    const len = (h.perm ? 30 : h.mins || 60) * 60000;
    h.left--; h.until = now + len; h.warned = []; h.local = { at: now, started: true }; h.spentFor = now; save(h);
    tell("🧭 You're off the farm, sugar, so that's a roam pass spent: back by " + clock(h.until) + ". " + h.left + " left.");
    return;
  }
  if (h.until && !h.late) { h.late = true; if (!h.local) h.local = { at: h.until }; h.local.late = true; save(h); }   // out past their pass: the farm girl hears, when they're back
  whistle(h, h.until ? "Your roam's over, sugar." : "You're off the farm without a roam pass, sugar.");
}
// a summon from the farm girl or staff (a beep that starts with "summon"): 30 seconds, then home, pass or no pass
export function homeBeep(data) {
  const h = load(); if (!h || !data) return false;
  const from = Number(data.MemberNumber) || 0, msg = String(data.Message || "");
  if (!/^\s*summon\b/i.test(msg)) return false;
  if (from !== deps.botMn && !(h.by || []).includes(from)) return false;
  if (h.safeUntil > Date.now() || atFarm(h) || (h.ends && h.ends <= Date.now())) return false;
  h.until = 0; h.spentFor = Date.now(); save(h);   // a summon ends the roam
  cancel(); whistle(h, "You've been summoned home, sugar.");
  return true;
}

export function initHomeward(mod, d) {
  deps = Object.assign(deps, d || {});
  try { mod.hookFunction("ServerAccountBeep", 4, (args, next) => { try { homeBeep(args[0]); } catch (e) { /* fine */ } return next(args); }); }
  catch (e) { console.warn("[Farmhand Companion] the whistle can't hear beeps:", e); }
  for (const fn of ["ChatRoomSafewordRevert", "ChatRoomSafewordRelease"]) {
    try { mod.hookFunction(fn, 4, (args, next) => { try { homeSafe(); } catch (e) { /* fine */ } return next(args); }); } catch (e) { /* that one's not in this game */ }
  }
  setInterval(() => { try { homeTick(); } catch (e) { console.warn("[Farmhand Companion] whistle:", e); } }, TICK_MS);
}
// (tests)
export const homeState = () => ({ h: load(), countdown: !!countdown, walking, retryAt });
export const homeReset = () => { cancel(); walking = false; retryAt = 0; busySince = 0; wantOutAt = 0; };
