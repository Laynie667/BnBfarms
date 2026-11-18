/* WHAT'S IN THIS FILE (speech-more.js)
   The Nov 17 speech doses (speech.js calls these):
     the Airhead Elixir   likes and ums, uptalk, a giggle, and big words that float off (more, the stronger the dose)
     Babble Brew          filthy words slip in, and innocent ones come out wrong
   Both leave the start of a message alone if it's a command, and never touch out-of-character lines (speech.js).
*/
const pickOf = (a) => a[Math.floor(Math.random() * a.length)];
// keep a word's own capitals: "Very" → "Super"
function sameCase(from, to) {
  if (from === from.toUpperCase() && from.length > 1) return to.toUpperCase();
  if (from[0] === from[0].toUpperCase()) return to[0].toUpperCase() + to.slice(1);
  return to;
}
// a word with its punctuation round it: ["(", "word", "),"]
const parts = (w) => /^([^A-Za-z']*)([A-Za-z][A-Za-z']*)([^A-Za-z']*)$/.exec(w);

// ── the Airhead Elixir ──
const AIR_SWAP = {
  very: "super", really: "totally", yes: "yesss", yeah: "yeahhh", good: "cute", great: "sooo good", nice: "cute",
  think: "think? like,", maybe: "maybe? idk", know: "know, like,", sure: "totally", definitely: "totally",
  probably: "like, prolly", absolutely: "totally", understand: "get it", remember: "remember? I think",
  because: "cuz", important: "big", interesting: "fun", difficult: "hard", wonderful: "sooo pretty", beautiful: "sooo pretty",
  excellent: "super good", amazing: "omg amazing", perhaps: "maybe?", correct: "right?", hello: "hiii", hi: "hiii", bye: "byeee",
};
const AIR_FILL = ["like,", "like,", "um,", "like, totally", "uh,"];
const AIR_LOST = ["um... thingy", "big-word thing", "whatchamacallit", "the, um...", "whatever it's called"];
const AIR_OPEN = ["Um, ", "Sooo, ", "Like, ", "Omg, ", "Okay so, "];
const AIR_END = ["*giggles*", "hehe", "...wait, what was I sayin'?", "*twirls hair*", "lol", "*giggle*"];
export function airhead(text, x) {
  const p = Math.min(0.6, 0.2 + 0.08 * (x || 1));
  const words = String(text).split(" ");
  const out = words.map((w, i) => {
    const m = parts(w); if (!m) return w;
    let core = m[2]; const low = core.toLowerCase();
    if (AIR_SWAP[low] && Math.random() < p + 0.25) core = sameCase(core, AIR_SWAP[low]);
    else if (core.length >= 10 && Math.random() < p) core = pickOf(AIR_LOST);   // the big words float off
    const pre = i > 0 && i < words.length - 1 && Math.random() < p * 0.45 ? pickOf(AIR_FILL) + " " : "";
    return pre + m[1] + core + m[3];
  });
  let t = out.join(" ");
  if (Math.random() < p) { const first = t.split(" ")[0]; t = pickOf(AIR_OPEN) + (first === "I" || first.startsWith("I'") || first === first.toUpperCase() ? t : t[0].toLowerCase() + t.slice(1)); }
  t = t.replace(/\.(\s|$)/g, (m0, s) => (Math.random() < p ? "?" + s : m0));   // uptalk
  if (Math.random() < p * 0.7) t += " " + pickOf(AIR_END);
  return t;
}

// ── Babble Brew ──
// innocent words that come out wrong
const SLIPS = {
  clock: "cock", sock: "cock", rock: "cock", block: "cock", duck: "fuck", luck: "fuck", truck: "fuck", stuck: "fucked",
  hit: "tit", bit: "tit", sit: "tit", fit: "tit", sick: "dick", pick: "dick", kick: "dick", trick: "dick",
  bread: "breed", need: "breed", feed: "breed", read: "breed", come: "cum", coming: "cumming", comes: "cums",
  not: "knot", hot: "knot", glass: "ass", pass: "ass", class: "ass", grass: "ass", city: "titty", pretty: "titty",
  dream: "cream", stream: "cream", seat: "teat", sweet: "teat", heard: "herd", hug: "hump", jump: "hump", bump: "hump",
  mild: "milked", silk: "milk", slick: "lick", beast: "breast", best: "breast", pussycat: "pussy",
  butter: "butt", button: "butt", but: "butt", whole: "hole", bowl: "hole", ball: "balls",
  what: "wet", "what's": "wet", sir: "stud", stood: "stud", sorry: "sore", thank: "spank",
};
const BLURTS = ["—fuck—", "—breed me—", "*moan*", "—cock—", "—milk me—", "—use me—", "—so wet—", "—knot me—", "—please—",
  "—fill me—", "—tits—", "—harder—", "—mmh, cum—", "—pet me—", "—spank me—", "—mount me—"];
export function babble(text, x) {
  const p = Math.min(0.55, 0.15 + 0.08 * (x || 1));
  const words = String(text).split(" "), out = [];
  let blurted = false, slipped = false;
  words.forEach((w, i) => {
    const m = parts(w);
    if (m && SLIPS[m[2].toLowerCase()] && SLIPS[m[2].toLowerCase()] !== m[2].toLowerCase() && Math.random() < p + 0.2) { out.push(m[1] + sameCase(m[2], SLIPS[m[2].toLowerCase()]) + m[3]); slipped = true; }
    else out.push(w);
    if (i < words.length - 1 && Math.random() < p * 0.35) { out.push(pickOf(BLURTS)); blurted = true; }
  });
  // at least one filthy thing gets out
  if (!blurted && !slipped) out.splice(out.length < 2 ? out.length : 1 + Math.floor(Math.random() * (out.length - 1)), 0, pickOf(BLURTS));
  return out.join(" ");
}
