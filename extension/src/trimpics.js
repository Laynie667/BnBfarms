// LETTING GO OF OLD GAME PICTURES (Oct 15). Laynie's page kept dying "out of memory" with the drawn body and messes
// off. The memory log showed what was climbing: the game's own pictures. The game keeps every clothing and body picture
// it has ever drawn, and a copy of each on the graphics card, for as long as the page is open. In a busy room where
// people change and get tied up all night, that only grows: 1,100 pictures and 630 MB on the card when it died.
// So once the game holds more than LIMIT, the pictures nobody has drawn for a while are let go, oldest first, down to
// TARGET. Anything let go that's wanted again is just loaded again (from the browser's own copy) and drawn.
//
// THE GAME'S NEW PICTURE CACHE (R133, Nov 7). The game's newest version keeps its pictures two ways now: unpacked for
// the screen (the map, the buttons) and on the graphics card (people and what they wear). It lets go of ones nobody
// has drawn for half an hour, but only looks once an hour, so a busy hour still piles up, and the bot's tab kept dying
// "out of memory" while the old count (the graphics card only) stayed flat. This trim had stepped aside for the new
// cache; now it works on both halves of it: past LIMIT, pictures nobody's drawn for IDLE go, oldest first, down to
// TARGET. On the farm girl's own tab (nobody watching, the screen mostly asleep) every picture unused for IDLE goes,
// every minute, whatever the total.
import { BOT_MEMBER } from "./config.js";

const W = window;
const LIMIT = 380e6, TARGET = 260e6, IDLE = 5 * 60000;
const seen = new Map();          // picture → when the game last asked for it (the old game only)
let sdk = null, trimmed = 0, started = Date.now();

// the new game's caches: an ImageCache each, with its Map of pictures inside
const isCache = (c) => !!(c && c.cache instanceof Map && typeof c.delete === "function");
const picBytes = (img) => { const d = img && img.data; return d && d.width ? d.width * d.height * 4 : 0; };
// how big one of the game's caches is: pictures in it, how many are unpacked, MB, and how many are made on the page (data:)
export function cacheSize(c) {
  if (!isCache(c)) return null;
  let n = 0, loaded = 0, b = 0, made = 0, madeK = 0;
  for (const [url, img] of c.cache) {
    n++; const x = picBytes(img); if (x) { loaded++; b += x; }
    if (typeof url === "string" && url.startsWith("data:")) { made++; madeK += url.length; }
  }
  return { n, loaded, mb: Math.round(b / 1e6), made, madeKB: Math.round(madeK / 1000) };
}

function trimNew(force, idle, target) {
  const caches = [W.GLDrawImageCache, W.DrawImageCache].filter(isCache);
  if (!caches.length) return 0;
  const now = Date.now(), wait = idle ?? IDLE, old = [];
  let total = 0;
  for (const c of caches) for (const [url, img] of c.cache) {
    const b = picBytes(img); total += b;
    if (typeof url !== "string" || url.startsWith("blob:")) continue;   // a blob can't be fetched again once it's gone
    if (img && typeof img.isLoading === "function" && img.isLoading()) continue;   // still loading
    const used = (img && img.lastUsed) || 0;
    if (now - used < wait) continue;
    old.push([used, url, c, b]);
  }
  if (!force && total <= LIMIT) return 0;
  old.sort((a, b) => a[0] - b[0]);
  const goal = target ?? TARGET;
  let n = 0;
  for (const [, url, c, b] of old) {
    if (goal > 0 && total <= goal) break;
    try { c.delete(url); } catch (e) { continue; }
    total -= b; n++;
  }
  trimmed += n;
  return n;
}

function bytes(tc) { let n = 0; for (const v of tc.values()) n += (v.width || 0) * (v.height || 0) * 4; return n; }
export function trimPictures(force, idle, target) {
  const cache = W.GLDrawImageCache;
  if (isCache(cache) || isCache(W.DrawImageCache)) return trimNew(force, idle, target);
  // the old game (before R133): its own texture list on the graphics card
  const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL, tc = gl && gl.textureCache;
  if (!cache || !tc || typeof tc.forEach !== "function") return 0;
  let total = bytes(tc); if (!force && total <= LIMIT) return 0;
  const now = Date.now(), old = [];
  for (const [url, v] of tc) {
    if (typeof url !== "string") continue;
    const t = seen.get(url) || started;
    if (now - t < (idle ?? IDLE)) continue;
    const img = cache.get(url); if (img && img.complete === false) continue;   // still loading
    old.push([t, url, v]);
  }
  old.sort((a, b) => a[0] - b[0]);
  let n = 0;
  for (const [, url, v] of old) {
    if (total <= (target ?? TARGET)) break;
    try { if (v.texture) gl.deleteTexture(v.texture); } catch (e) { /* fine */ }
    tc.delete(url); cache.delete(url); seen.delete(url);
    total -= (v.width || 0) * (v.height || 0) * 4; n++;
  }
  trimmed += n;
  return n;
}
export function trimStats() { return { trimmed, people: letGo }; }

// FOLKS WHO LEFT (Nov 7). When somebody leaves the room the game takes them off the room's list, but keeps them loaded,
// drawing and all, till YOU leave the room (then it lets everybody go at once). Players hop rooms, so theirs empties
// all the time; the farm girl never leaves the farm, so everybody who ever came by stayed loaded till her tab died
// (Laynie: "it was a mem crash"). On her tab only, somebody gone from the room for LEFT_MS gets let go the game's own
// way. Come back, and the game loads them fresh like any newcomer. The farm never reads this list (it keeps people in
// its ledger), so nothin' it does changes. Never the bot herself, nor anybody whose profile or menu is open.
const LEFT_MS = 10 * 60000;
const missing = new Map();   // member number → when the farm girl's tab first saw them gone from the room
let letGo = 0;
const isOnline = (C) => !!(C && typeof C.AccountName === "string" && C.AccountName.startsWith("Online-"));
export function letGoOfLeavers(now) {
  now = now ?? Date.now();
  if (!(W.Player && W.Player.MemberNumber === BOT_MEMBER)) return 0;
  if (W.CurrentScreen !== "ChatRoom" || !W.ChatRoomData || !Array.isArray(W.Character) || typeof W.CharacterDelete !== "function") return 0;
  const here = new Set((W.ChatRoomCharacter || []).map((c) => c && c.MemberNumber));
  const keep = new Set([W.Player, W.InformationSheetSelection, W.CurrentCharacter].filter(Boolean));
  let n = 0;
  for (const C of W.Character.slice()) {
    if (!isOnline(C) || keep.has(C)) continue;
    const mn = C.MemberNumber;
    if (here.has(mn)) { missing.delete(mn); continue; }
    const since = missing.get(mn);
    if (since == null) { missing.set(mn, now); continue; }
    if (now - since < LEFT_MS) continue;
    try { W.CharacterDelete(C, false); n++; missing.delete(mn); } catch (e) { /* fine */ }
  }
  for (const mn of [...missing.keys()]) if (!W.Character.some((c) => c && c.MemberNumber === mn)) missing.delete(mn);
  letGo += n;
  return n;
}
// how many of the game's loaded characters are people no longer in the room
export function leftLoaded() {
  if (!Array.isArray(W.Character)) return null;
  const here = new Set((W.ChatRoomCharacter || []).map((c) => c && c.MemberNumber));
  return W.Character.filter((C) => isOnline(C) && C !== W.Player && !here.has(C.MemberNumber)).length;
}

// once a minute: on the farm girl's own tab, folks long gone and everything unused for IDLE; anywhere else, only past LIMIT
export function trimTick() {
  const bot = !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
  if (!bot) return trimPictures(false);
  try { letGoOfLeavers(); } catch (e) { console.warn("[Farmhand Companion] lettin' go of folks who left:", e); }
  return trimPictures(true, IDLE, 0);
}
export function initTrim(mod) {
  sdk = mod; W.__farmTrim = trimPictures;   // (from the console: __farmTrim(true, 0, 0) lets go of every picture not loading, now)
  W.__farmLetGo = letGoOfLeavers;           // (and folks gone from the room for 10 minutes, on the bot's tab)
  // the old game only: when each picture was last asked for (the new game keeps that itself)
  try { if (typeof W.GLDrawLoadImage === "function") sdk.hookFunction("GLDrawLoadImage", 0, (args, next) => { if (typeof args[1] === "string") seen.set(args[1], Date.now()); return next(args); }); }
  catch (e) { console.warn("[Farmhand Companion] picture trim (old game) unavailable:", e); }
  setInterval(() => { try { trimTick(); } catch (e) { console.warn("[Farmhand Companion] picture trim:", e); } }, 60000);
}
