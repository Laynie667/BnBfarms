// THE MEMORY LOG (Oct 15). Laynie's page kept dying ("crashed again, out of memory"), and a page that's died can't say
// what filled it. So every half minute the Companion writes down how big things are: the page's own memory, the
// game's pictures and what's on the graphics card, the drawn body's and the messes' keepings, and who's in the room.
// It keeps the last hour of it (in this browser only). After a crash, reload and type /farmmem: it shows how things
// grew, and copies the whole log so it can be pasted to whoever's looking into it.
import { drawnBodyMemory } from "./drawnbody.js";
import { messMemory } from "./messes.js";
import { trimStats } from "./trimpics.js";
import { VERSION } from "./version.js";

const W = window, KEY = "farmhand-memlog", MAX = 120;
let log = [];
try { const v = JSON.parse(W.localStorage.getItem(KEY)); if (Array.isArray(v)) log = v.slice(-MAX); } catch (e) { log = []; }

function snap() {
  const s = { t: Date.now() };
  try { if (W.performance && W.performance.memory) s.heapMB = Math.round(W.performance.memory.usedJSHeapSize / 1e6); } catch (e) { /* not this browser */ }
  try {
    const m = W.GLDrawImageCache; if (m) { s.gamePics = m.size; let d = 0, dk = 0; for (const k of m.keys()) if (typeof k === "string" && k.startsWith("data:")) { d++; dk += k.length; } s.madePics = d; s.madePicsKB = Math.round(dk / 1000); }
    const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL, tc = gl && gl.textureCache;
    if (tc) { let px = 0; for (const v of tc.values()) px += (v.width || 0) * (v.height || 0); s.textures = tc.size; s.textureMB = Math.round(px * 4 / 1e6); }
  } catch (e) { /* fine */ }
  try { s.body = drawnBodyMemory(); } catch (e) { /* fine */ }
  try { s.mess = messMemory(); } catch (e) { /* fine */ }
  try { s.let = trimStats().trimmed; } catch (e) { /* fine */ }
  try { s.room = (W.ChatRoomCharacter || []).length; s.screen = W.CurrentScreen; } catch (e) { /* fine */ }
  return s;
}
function save() { try { W.localStorage.setItem(KEY, JSON.stringify(log)); } catch (e) { log = log.slice(-30); } }
function tick() {
  const s = snap(), prev = log[log.length - 1];
  if (prev && s.t - prev.t > 5 * 60000) s.gap = true;   // a jump in time: the page was closed or died in between
  log.push(s); if (log.length > MAX) log = log.slice(-MAX); save();
}
const line = (s) => new Date(s.t).toTimeString().slice(0, 5) + (s.gap ? " (after a gap)" : "") +
  "  page " + (s.heapMB ?? "?") + " MB · game pictures " + (s.gamePics ?? "?") + " (" + (s.madePics ?? 0) + " ours, " + (s.madePicsKB ?? 0) + " KB) · graphics card " + (s.textureMB ?? "?") + " MB in " + (s.textures ?? "?") +
  " · drawn bodies " + (s.body ? s.body.engines + ", keeping " + s.body.keptMB + " MB" : "?") + " · messes " + (s.mess ? s.mess.pictures : "?") + " · " + (s.room ?? "?") + " in the room" + (s.let ? " · " + s.let + " old pictures let go" : "");

// and every three seconds, a quick look (the last two minutes): a page that fills up all at once, between two half-minute
// looks, still leaves its last seconds behind. /farmmem shows the last of these from the page before this one.
const FAST = "farmhand-memfast", born = Date.now();
let fast = []; try { const v = JSON.parse(W.localStorage.getItem(FAST)); if (Array.isArray(v)) fast = v.slice(-40); } catch (e) { fast = []; }
const lastPage = fast.filter((x) => x.t < born).slice(-12);
function quick() {
  const x = { t: Date.now() };
  try { if (W.performance && W.performance.memory) x.h = Math.round(W.performance.memory.usedJSHeapSize / 1e6); } catch (e) { /* fine */ }
  try { const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL, tc = gl && gl.textureCache; if (tc) x.p = tc.size; } catch (e) { /* fine */ }
  try { x.r = (W.ChatRoomCharacter || []).length; x.s = W.CurrentScreen; } catch (e) { /* fine */ }
  fast.push(x); if (fast.length > 40) fast = fast.slice(-40);
  try { W.localStorage.setItem(FAST, JSON.stringify(fast)); } catch (e) { /* fine */ }
}
const quickLine = (x) => new Date(x.t).toTimeString().slice(0, 8) + "  page " + (x.h ?? "?") + " MB · " + (x.p ?? "?") + " pictures · " + (x.r ?? "?") + " in the room · " + (x.s || "");
export function memlogText(n) { return log.slice(-(n || 20)).map(line).join("\n"); }
export function initMemlog() {
  setTimeout(tick, 20000); setInterval(tick, 30000); setInterval(quick, 3000);
  if (typeof W.CommandCombine === "function") {
    W.CommandCombine([{ Tag: "farmmem", Description: ": the Farmhand Companion's memory log (the last hour), and copies it", Action: () => {
      tick();
      const text = "Companion v" + VERSION + "\n" + memlogText(24) + (lastPage.length ? "\nThe last seconds of the page before this one:\n" + lastPage.map(quickLine).join("\n") : "");
      try { W.navigator.clipboard.writeText(JSON.stringify(log)); } catch (e) { /* no clipboard: fine */ }
      if (typeof W.ChatRoomSendLocal === "function") W.ChatRoomSendLocal("Farmhand memory log (copied, paste it to Claude):\n" + text, 120000);
      else console.log(text);
    } }]);
  }
}
