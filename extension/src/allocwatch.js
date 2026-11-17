/* WHAT'S IN THIS FILE (allocwatch.js)
   THE BOT TAB'S FLIGHT RECORDER (Nov 17). The farm girl's tab kept dying "out of memory" with the page's own memory
   small. Opera's crash report showed why: the tab itself had grown to 12.9 GB in 8 and a half minutes, about 25 MB a
   second, outside the page's JavaScript (pictures, canvases, picture data), so the memory log couldn't see it. This
   counts, on the bot's own tab only, everything that can make that kind of memory, and memlog.js writes the counts down
   every 3 seconds with the rest ("the last seconds of the page before this one" in /farmmem). After the next crash, the
   one that ran away is the answer. It only counts: nothing is changed, held on to or sent anywhere.
*/
const W = window;
const C = { cvPx: 0, cvNew: 0, readPx: 0, img: 0, bitmap: 0, texPx: 0, tex: 0, blob: 0, blobFree: 0, audio: 0, actx: 0, sync: 0, msg: 0 };
let on = false;
export const allocCounts = () => Object.assign({}, C);

function wrapSetter(proto, prop, after) {
  const d = proto && Object.getOwnPropertyDescriptor(proto, prop);
  if (!d || typeof d.set !== "function") return;
  Object.defineProperty(proto, prop, Object.assign({}, d, { set(v) { d.set.call(this, v); try { after(this, v); } catch (e) { /* only countin' */ } } }));
}
function wrapMethod(obj, name, before) {
  const f = obj && obj[name];
  if (typeof f !== "function") return;
  obj[name] = function (...a) { try { before.apply(this, a); } catch (e) { /* only countin' */ } return f.apply(this, a); };
}

export function initAllocWatch(isBot, mod) {
  if (on) return false;
  // (the Companion starts before login: wait to know whose tab this is, then only ever on the bot's own)
  if (!W.Player || typeof W.Player.MemberNumber !== "number") { setTimeout(() => initAllocWatch(isBot, mod), 3000); return false; }
  if (!isBot()) return false;
  on = true;
  try {
    // canvas sheets: every width or height set is a new backing store of width × height pixels
    const H = W.HTMLCanvasElement && W.HTMLCanvasElement.prototype;
    const sized = (cv) => { C.cvPx += (cv.width || 0) * (cv.height || 0); };
    wrapSetter(H, "width", sized); wrapSetter(H, "height", sized);
    wrapMethod(W.document, "createElement", (tag) => { if (String(tag).toLowerCase() === "canvas") C.cvNew++; });
    // pixels read back (picture data held outside the page's JavaScript)
    const C2 = W.CanvasRenderingContext2D && W.CanvasRenderingContext2D.prototype;
    wrapMethod(C2, "getImageData", (x, y, w, h) => { C.readPx += Math.abs((w || 0) * (h || 0)); });
    // pictures and picture bitmaps
    wrapSetter(W.HTMLImageElement && W.HTMLImageElement.prototype, "src", () => { C.img++; });
    wrapMethod(W, "createImageBitmap", () => { C.bitmap++; });
    // picture data sent to the graphics card
    for (const G of [W.WebGLRenderingContext, W.WebGL2RenderingContext]) {
      const P = G && G.prototype; if (!P) continue;
      wrapMethod(P, "texImage2D", function (...a) { C.tex++; const s = a[a.length - 1]; const w = (s && (s.width || s.videoWidth)) || a[3] || 0, h = (s && (s.height || s.videoHeight)) || a[4] || 0; C.texPx += (Number(w) || 0) * (Number(h) || 0); });
    }
    // blob links made and let go (one never let go keeps its whole file in memory)
    wrapMethod(W.URL, "createObjectURL", () => { C.blob++; });
    wrapMethod(W.URL, "revokeObjectURL", () => { C.blobFree++; });
    // sound players and sound engines
    wrapSetter(W.HTMLMediaElement && W.HTMLMediaElement.prototype, "src", () => { C.audio++; });
    for (const k of ["AudioContext", "webkitAudioContext"]) {
      const A = W[k]; if (typeof A !== "function") continue;
      W[k] = class extends A { constructor(...a) { super(...a); C.actx++; } };
    }
  } catch (e) { console.warn("[Farmhand Companion] flight recorder:", e); }
  // how often the server sends room updates and messages
  for (const f of ["ChatRoomSync", "ChatRoomSyncCharacter", "ChatRoomSyncSingle", "ChatRoomSyncItem", "ChatRoomSyncMapData"]) {
    try { mod.hookFunction(f, 0, (args, next) => { C.sync++; return next(args); }); } catch (e) { /* an older game */ }
  }
  try { mod.hookFunction("ChatRoomMessage", 0, (args, next) => { C.msg++; return next(args); }); } catch (e) { /* fine */ }
  return true;
}
// one line for the fast log: only what's moved since the last line
let last = null;
export function allocLine() {
  if (!on) return "";
  const now = allocCounts(), d = {};
  for (const k of Object.keys(now)) d[k] = now[k] - ((last && last[k]) || 0);
  last = now;
  const mp = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "k" : String(n));
  const bits = [];
  if (d.cvNew || d.cvPx) bits.push("canvas " + d.cvNew + " new, " + mp(d.cvPx) + " px");
  if (d.readPx) bits.push("read " + mp(d.readPx) + " px");
  if (d.img) bits.push("pictures " + d.img);
  if (d.bitmap) bits.push("bitmaps " + d.bitmap);
  if (d.tex) bits.push("to card " + d.tex + " (" + mp(d.texPx) + " px)");
  if (d.blob || d.blobFree) bits.push("blobs +" + d.blob + " -" + d.blobFree + " (kept " + (now.blob - now.blobFree) + ")");
  if (d.audio || d.actx) bits.push("sound " + d.audio + (d.actx ? ", engines " + d.actx : ""));
  if (d.sync) bits.push("syncs " + d.sync);
  if (d.msg) bits.push("msgs " + d.msg);
  return bits.join(" · ");
}
