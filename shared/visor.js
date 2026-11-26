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
   pictures are only links straight to a picture (https, .png .jpg .gif .webp), or a silent video (.mp4 .webm, muted).
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
// (Nov 26, Laynie: "is there a way to make animated gifs work for the visor?" and "all four": most GIF sites send a silent
// video now, so a link straight to an .mp4 or .webm counts too; it plays muted and loopin', never a sound.)
export const okLink = (u) => typeof u === "string" && u.length <= 600 && /^https:\/\/[a-z0-9.-]+(:[0-9]+)?\/[^\s"'<>()]*$/i.test(u) &&
  !/\.(html?|php|aspx?|jsp|js|mjs|css|json|txt|xml|pdf|zip|rar|7z|exe|msi|apk|mov|mp3|wav|ogg|svg)([?#]|$)/i.test(u);
export const isVideo = (u) => /\.(mp4|webm)([?#]|$)/i.test(String(u || ""));
// a link pasted from a GIF site, made into the picture's own address where that can be worked out; where it can't, a
// plain word on what to copy instead. { url: "" when it can't be used, note }
export function fixLink(raw) {
  let u = String(raw || "").trim(), m;
  if (!u) return { url: "", note: "" };
  if (/^http:\/\//i.test(u)) u = "https://" + u.slice(7);
  if ((m = /^https:\/\/(?:www\.)?giphy\.com\/(?:gifs|stickers|embed)\/(?:[^/?#]*-)?([A-Za-z0-9]+)(?:[/?#].*)?$/i.exec(u))) return { url: "https://media.giphy.com/media/" + m[1] + "/giphy.gif", note: "a Giphy page, made into its GIF" };
  if ((m = /^(https:\/\/i\.imgur\.com\/[A-Za-z0-9]+)\.gifv(?:[?#].*)?$/i.exec(u))) return { url: m[1] + ".mp4", note: "Imgur's .gifv is a page, made into its video" };
  if ((m = /^https:\/\/(?:www\.)?google\.[a-z.]+\/(?:imgres|url)\?(?:[^#]*?&)?(?:imgurl|url)=([^&#]+)/i.exec(u))) {
    let inner = ""; try { inner = decodeURIComponent(m[1]); } catch (e) { inner = ""; }
    if (okLink(inner)) return { url: inner, note: "a Google link, made into the picture's own address" };
    return { url: "", note: "a Google page: open the picture itself, right-click it, Copy image address" };
  }
  if (/^https:\/\/(?:www\.)?tenor\.com\/(?:[a-z-]+\/)?view\//i.test(u)) return { url: "", note: "a Tenor page: right-click the GIF, Copy image address (it starts media.tenor.com)" };
  if (/^https:\/\/(?:www\.|v3\.)?redgifs\.com\/(?:watch|ifr)\//i.test(u)) return { url: "", note: "a RedGIFs page: right-click the video, Copy video address (an .mp4 link)" };
  if (/^https:\/\/(?:www\.)?imgur\.com\/(?:a|gallery|t)\//i.test(u)) return { url: "", note: "an Imgur album page: open the picture, right-click it, Copy image address (it starts i.imgur.com)" };
  if (/^https:\/\/(?:www\.|old\.|new\.)?reddit\.com\//i.test(u)) return { url: "", note: "a Reddit page: open the picture, right-click it, Copy image address (it starts i.redd.it)" };
  if (/^https:\/\/v\.redd\.it\//i.test(u)) return { url: "", note: "Reddit's own videos can't be linked straight to; use a GIF or an .mp4 from somewhere else" };
  if (!okLink(u)) return { url: "", note: "not a picture's own address (it has to be https, and not a web page)" };
  if (/encrypted-tbn\d*\.gstatic\.com/i.test(u)) return { url: u, note: "Google's little search thumbnail: always a still picture, and blurry full-screen" };
  if (/(?:cdn|media)\.discordapp\.(?:com|net)\/attachments\//i.test(u)) return { url: u, note: "a Discord link: those stop working after a day or so" };
  return { url: u, note: "" };
}
// does a picture move: what its own bytes say (a GIF with more than one frame, an animated WebP or PNG); null when it
// can't tell
export function framesOf(b) {
  if (!b || !b.length) return null;
  const at = (i, s) => { for (let k = 0; k < s.length; k++) if (b[i + k] !== s.charCodeAt(k)) return false; return true; };
  if (at(0, "GIF8")) { let n = 0; for (let i = 0; i < b.length - 2 && n < 2; i++) if (b[i] === 0x21 && b[i + 1] === 0xf9 && b[i + 2] === 0x04) n++; return n >= 2; }
  if (at(0, "RIFF") && at(8, "WEBP")) { for (let i = 12; i <= Math.min(b.length - 4, 4096); i++) if (at(i, "ANIM")) return true; return false; }
  if (b[0] === 0x89 && at(1, "PNG")) { for (let i = 8; i <= b.length - 4; i++) { if (at(i, "acTL")) return true; if (at(i, "IDAT")) return false; } return false; }
  if (b[0] === 0xff && b[1] === 0xd8) return false;   // (a JPEG never moves)
  return null;
}

// THE LOOK (Nov 25, Laynie: "i love those, so yes please", "More effects too… similar to HSC", "the close up effect of the
// face"): the spiral, what happens in the chat, the lines to write, and the extra effects. Each is kept only when it
// isn't the default, so a visor built before them keeps the very same code.
export const SPIRALS = ["classic", "pinwheel", "tight", "tunnel", "counter", "hearts", "paws", "bells", "words", "none"];
export const SPINS = ["slow", "slower", "still"];
export const PLACES = ["behind", "over", "both"];
export const CHAT_FX = ["whisper", "melt", "fade", "watermark"];
// ("after", Nov 26: the afterimage once it comes off is the crafter's pick now, not every visor's; Laynie: "yes")
export const FX = ["float", "wave", "breath", "tunnel", "bloom", "warp", "ripple", "crowd", "kalei", "hearts", "aura", "meter", "face", "zoom", "after"];
// whose body they see (Nov 26, "the crafter looms"): the crafter's, their own, the crafter towerin' over them small at
// their feet, or their own with the crafter's face in the middle of the spiral, watchin'
export const SHOWS = ["crafter", "wearer", "loom", "eyes"];
// who may feed a word into it when they peek in: nobody, the crafter and the wearer's keyholders, or anyone
export const FEEDS = ["", "keys", "all"];
// …and (Nov 25, Laynie picked them: "1, 5-8, 10, 11, 12 are good") the pet name the visor gives its wearer (their name in
// the room while it holds, and their trigger), and whether it sinks deeper the longer it's worn
export const LOOK_DEFAULTS = { spiral: "classic", spin: "slow", place: "behind", spOp: 0.4, breathe: true, drift: true, chat: ["whisper", "fade", "watermark"], lines: "", linesNeed: 0, linesLock: false, fx: [], pet: "", sink: false, feed: "" };
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
  keep("feed", FEEDS.includes(t.feed) ? t.feed : "");
  return out;
}
function base(t, list) {
  return {
    v: 1,
    sessions: list(t.sessions, MAX_SESSIONS, 60),
    need: Math.round(clamp(t.need, 0, MAX_NEED, 1)),
    show: SHOWS.includes(t.show) ? t.show : "crafter",
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
