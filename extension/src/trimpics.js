// LETTING GO OF OLD GAME PICTURES (Oct 15). Laynie's page kept dying "out of memory" with the drawn body and messes
// off. The memory log showed what was climbing: the game's own pictures. The game keeps every clothing and body picture
// it has ever drawn, and a copy of each on the graphics card, for as long as the page is open. In a busy room where
// people change and get tied up all night, that only grows: 1,100 pictures and 630 MB on the card when it died.
// So once the game holds more than LIMIT, the pictures nobody has drawn for a while are let go, oldest first, down to
// TARGET. Anything let go that's wanted again is just loaded again (from the browser's own copy) and drawn.
const W = window;
const LIMIT = 380e6, TARGET = 260e6, IDLE = 5 * 60000;
const seen = new Map();          // picture → when the game last asked for it
let sdk = null, trimmed = 0, started = Date.now();

function bytes(tc) { let n = 0; for (const v of tc.values()) n += (v.width || 0) * (v.height || 0) * 4; return n; }
export function trimPictures(force, idle, target) {
  const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL, tc = gl && gl.textureCache, cache = W.GLDrawImageCache;
  if (!tc || !cache || typeof tc.forEach !== "function") return 0;
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
export function trimStats() { return { trimmed }; }
export function initTrim(mod) {
  sdk = mod; W.__farmTrim = trimPictures;   // (from the console: __farmTrim(true) lets go of everything unused for 5 minutes, now)
  try { sdk.hookFunction("GLDrawLoadImage", 0, (args, next) => { if (typeof args[1] === "string") seen.set(args[1], Date.now()); return next(args); }); }
  catch (e) { console.warn("[Farmhand Companion] picture trim unavailable:", e); return; }
  setInterval(() => { try { trimPictures(false); } catch (e) { console.warn("[Farmhand Companion] picture trim:", e); } }, 60000);
}
