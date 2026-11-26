/* WHAT'S IN THIS FILE (shared/visor.js)
   THE FARM'S VISOR (Nov 25; Laynie: "For the hypnotic visor items in bc and echoes, what if we built on a subliminal set
   of effects"; "once a visor is built, its settings should be locked in unless the crafter changes them"; "The button
   needs to be a small icon").
   A visor's tuning is what its crafter picked in their Companion's Visor maker: which of the farm's public sessions,
   how many full sessions before a hardcore wearer may take it off, whose body shows, the words, the pictures, how strong.
   Its CODE is a fingerprint of exactly that tuning: change anything and the code changes, and only the crafter can change
   their crafted item's description, so a visor stays as it was built. Any Companion holdin' a tuning can hand it to
   another; the code proves it's the right one.
   In the crafted item's description (200 characters at most):   farm visor: #k7f2a9q1 · 2 sessions
   Safety: words fade in and out, never strobe (at most one every 2 seconds, shown under a second, never bright);
   pictures are only links straight to a picture (https, .png .jpg .gif .webp).
*/

export const VISOR_RE = /farm visor:\s*#([a-z0-9]{6,12})/i;
export const PUBLIC_BASE = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/public/visor/";
export const MAX_SESSIONS = 5, MAX_NEED = 5, MAX_WORDS = 12, MAX_PICS = 20;
// the kinds a visor's session is made of: trance only (triggers, compulsions and hang-ons are the farm's to plant)
export const VISOR_KINDS = ["induction", "deepener", "convincer", "suggestion", "wake"];

const clamp = (v, lo, hi, d) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
const str = (s, n) => String(s == null ? "" : s).replace(/[()<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
// a picture's own address: any https link (Nov 25: Laynie's were Google image links, with no .jpg on the end), only never
// one that's plainly a page or a file of some other kind. It's only ever shown as a picture, so it can't run anythin'; one
// that isn't a picture just doesn't show.
export const okLink = (u) => typeof u === "string" && u.length <= 600 && /^https:\/\/[a-z0-9.-]+(:[0-9]+)?\/[^\s"'<>()]*$/i.test(u) &&
  !/\.(html?|php|aspx?|jsp|js|mjs|css|json|txt|xml|pdf|zip|rar|7z|exe|msi|apk|mp4|webm|mov|mp3|wav|ogg|svg)([?#]|$)/i.test(u);

// THE LOOK (Nov 25, Laynie: "i love those, so yes please", "More effects too… similar to HSC", "the close up effect of the
// face"): the spiral, what happens in the chat, the lines to write, and the extra effects. Each is kept only when it
// isn't the default, so a visor built before them keeps the very same code.
export const SPIRALS = ["classic", "pinwheel", "tight", "tunnel", "counter", "hearts", "paws", "bells", "words", "none"];
export const SPINS = ["slow", "slower", "still"];
export const PLACES = ["behind", "over", "both"];
export const CHAT_FX = ["whisper", "melt", "fade", "watermark"];
export const FX = ["float", "wave", "breath", "tunnel", "bloom", "warp", "ripple", "crowd", "kalei", "hearts", "aura", "meter", "face", "zoom"];
// …and (Nov 25, Laynie picked them: "1, 5-8, 10, 11, 12 are good") the pet name the visor gives its wearer (their name in
// the room while it holds, and their trigger), and whether it sinks deeper the longer it's worn
export const LOOK_DEFAULTS = { spiral: "classic", spin: "slow", place: "behind", spOp: 0.4, breathe: true, drift: true, chat: ["whisper", "fade", "watermark"], lines: "", linesNeed: 0, linesLock: false, fx: [], pet: "", sink: false };
// a pet name the game takes as a name: letters, numbers, spaces, ' and -, 20 at most (BC's ServerCharacterNicknameRegex)
export const petName = (s) => String(s == null ? "" : s).replace(/[^\p{L}\p{Nd}\p{Z}'-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 20).trim();
export function lookOf(t) { return Object.assign({}, LOOK_DEFAULTS, t || {}); }   // (a tuning with its defaults filled in, for showin' it)
// a tuning, every value checked and kept inside its limits (so nothin' a crafter or another Companion sends is unsafe)
export function normTuning(t) {
  t = t && typeof t === "object" ? t : {};
  const list = (a, n, len) => (Array.isArray(a) ? a : String(a || "").split(",")).map((x) => str(x, len)).filter(Boolean).slice(0, n);
  const out = base(t, list), D = LOOK_DEFAULTS, keep = (k, v) => { if (JSON.stringify(v) !== JSON.stringify(D[k])) out[k] = v; };
  keep("spiral", SPIRALS.includes(t.spiral) ? t.spiral : D.spiral);
  keep("spin", SPINS.includes(t.spin) ? t.spin : D.spin);
  keep("place", PLACES.includes(t.place) ? t.place : D.place);
  keep("spOp", Math.round(clamp(t.spOp, 0.1, 0.7, D.spOp) * 100) / 100);
  keep("breathe", t.breathe === undefined ? D.breathe : !!t.breathe);
  keep("drift", t.drift === undefined ? D.drift : !!t.drift);
  keep("chat", t.chat === undefined ? D.chat : CHAT_FX.filter((x) => (Array.isArray(t.chat) ? t.chat : []).includes(x)));
  keep("lines", str(t.lines, 80));
  keep("linesNeed", out.lines ? Math.round(clamp(t.linesNeed, 0, 20, 0)) : 0);
  keep("linesLock", !!(out.lines && t.linesLock));
  keep("fx", FX.filter((x) => (Array.isArray(t.fx) ? t.fx : []).includes(x)));
  keep("pet", petName(t.pet));
  keep("sink", !!t.sink);
  return out;
}
function base(t, list) {
  return {
    v: 1,
    sessions: list(t.sessions, MAX_SESSIONS, 60),
    need: Math.round(clamp(t.need, 0, MAX_NEED, 1)),
    show: t.show === "wearer" ? "wearer" : "crafter",
    words: list(t.words, MAX_WORDS, 24),
    set: str(t.set, 40),
    pictures: (Array.isArray(t.pictures) ? t.pictures : []).filter(okLink).slice(0, MAX_PICS),
    wordEvery: clamp(t.wordEvery, 2, 8, 3),          // seconds between words, never under 2
    wordMs: Math.round(clamp(t.wordMs, 500, 1000, 800)),   // how long each shows (fadin' in and out inside it)
    wordOp: clamp(t.wordOp, 0.15, 0.6, 0.45),        // how bright a word gets, never full
    picOp: clamp(t.picOp, 0.1, 0.8, 0.35),           // how see-through the pictures are
    picEvery: Math.round(clamp(t.picEvery, 8, 60, 20)),
    fit: t.fit === "contain" ? "contain" : "cover",
  };
}
// the same tuning always gives the same string (keys in order)
function stable(v) {
  if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
  if (v && typeof v === "object") return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + stable(v[k])).join(",") + "}";
  return JSON.stringify(v);
}
// two FNV-1a hashes side by side → 8 letters and numbers
function fnv(s, seed) { let h = seed >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
export function tuningCode(t) {
  const s = stable(normTuning(t));
  return (fnv(s, 2166136261).toString(36).padStart(7, "0").slice(-4) + fnv(s, 0x9747b28c).toString(36).padStart(7, "0").slice(-4)).toLowerCase();
}
export const codeOk = (code, t) => typeof code === "string" && !!t && tuningCode(t) === code.toLowerCase();
// what goes in the crafted item's description
export function descLine(code, t) {
  const n = normTuning(t).need;
  return "farm visor: #" + code + (n ? " · " + n + " session" + (n === 1 ? "" : "s") : "");
}
export const codeIn = (desc) => { const m = VISOR_RE.exec(String(desc || "")); return m ? m[1].toLowerCase() : ""; };
