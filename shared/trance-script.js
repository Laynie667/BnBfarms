/* WHAT'S IN THIS FILE (shared/trance-script.js)
   THE TRANCE LIBRARY FORMAT (Nov 25, Laynie: "definitely need to choose a format for the session editor thats consistent,
   and with labels, so they can be combined in different ways, like deepeners, inductions, etc.").
   One plain text file of labelled blocks. The studio's trance editor writes it, the bot runs it, the tests read it.

     === induction: Heavy Eyes          ← every block starts with its kind and its name
     level: fun, deep, nhl              ← labels, one per line, before the first spoken line
     for: any
     pace: 15s
     beats: alpha 10 → theta 6 over 3m
     look: haze 20%, spiral slow

     That's it, {name}… let your eyes go heavy.
     Every breath out takes you further down. [wait 20s]
     Good {animal}. Nothin' left to think about. [deeper +10]

   KINDS: induction · deepener · convincer · suggestion (spoken) · trigger (spoken, then planted as an LSCG suggestion) ·
          wake · session (a recipe: which blocks, in what order) ·
          slip (part 2: what comes out of their mouth in place of their own words, when their speech is hijacked) ·
          nudge (part 2: the farm's whispers through the day, as its pull builds up in them) ·
          compulsion (part 3: spoken, then kept: somethin' happenin' sets it off, now and then, no trigger word) ·
          hangon (part 3: spoken, then it stays with them a while after they come up)
          Slips and nudges are said outside sessions, so a session never lists them.
   COMPULSION BLOCKS have:  when  wake | leader | leader talks | stall | full | fed | pat | squeeze | cum
                            does  (as a trigger's)   ·   waits   ·   chance 10%  (how likely each time, 1-50%; 10% if left out)
   HANGON BLOCKS have:      effect  mootalk | cowtalk | yes | edge | needy | fours | handsoff | hearing | names | heel
                            lasts   30m  (1 minute to 4 hours; never past what the session's level allows)
   HOW LONG WHAT'S PLANTED STAYS (part 3, "the deeper, the more permanent"): from a Fun session a day, and a compulsion
   fires once; from Deep a week; each time it lands it's renewed. From No human left it's set for good, and only their
   herd leader or a proprietor takes it out. ?hypno off rests all of it; the safeword ends whatever's runnin'.
   LABELS (any block):
     level   fun, deep, nhl           which depths it's for (none = all three)
     for     any | cow, pony, …       which kinds of stock (none = any)
     wears   collar, bell, …          only for somebody wearin' one of these
     pace    30s | 20-40s | 1m        the gap between lines
     pick    3                        use 3 of the lines, picked fresh each time, kept in order
     beats   theta | 6 | alpha 10 → theta 6 over 3m | delta → 2 over 4m | off
             bands: delta 1-4, theta 4-8, alpha 8-12, beta 12-30 Hz. A band picks a fresh rate inside it each run.
     volume  60%                      of their own beats volume (never louder than theirs)
     look    haze 40%, spiral slow|on|off, rings on|off, words drift|off, names blur|clear, clear
     deeper  +10                      how much deeper they are once the block's done
     pull    60                       slips and nudges only: used once the farm's pull in them is built up this far (0-100)
   TRIGGER BLOCKS also have:
     trigger milkin' time             the phrase that sets it off
     does    strip top → pose {low} → say "Moo… milk me please."   (LSCG's own instructions, at most three)
     waits   2s, 2s                   before the second and third (1 to 30 s)
   SESSION BLOCKS list the blocks in order, one label each:  deepener: The Hayloft Ladder, any   ·  suggestion: any 2  ·  trigger: all
   LINE CUES, in square brackets:  [wait 20s] [deeper +10] [beats theta 5] [look haze 60%]
   FILL-INS: {name} {animal} {sound} {body} {pet} {paws} {low} {herd} and anything else the bot knows.
   Round brackets are taken out of spoken lines: hypno add-ons skip anything after one (it reads as out of character).

   "does", word by word (LSCG's instructions, docs: LSCG src/Modules/hypno.ts):
     cum · deny · needy · strip top|bottoms|underwear|feet|all|random|<slot> · pose {low}|kneel|kneel spread|all fours|stand|
     hands behind|hands up|upper <Pose>|lower <Pose>|full <Pose> · say "words" (or say: whatever follows the trigger) ·
     follow · touch <Activity> <zone> [self|speaker] · forget [all|deny|needy|follow|say]
   and the farm's own (part 2, LSCG extension instructions: "From extensions" in LSCG's suggestion editor):
     moo [1-3] (their own animal's sound, out loud) · stall (walk to a free milkin' stall, which milks them) ·
     beg ["words"] (beg out loud to be milked, then head for a free stall) · dose <name> [half|double] (a Dispensary dose)
*/

export const KINDS = ["induction", "deepener", "convincer", "suggestion", "trigger", "compulsion", "hangon", "wake", "slip", "nudge", "session"];
export const SPOKEN = KINDS.filter((k) => k !== "session");
// what a session is made of; slips and nudges are said outside sessions (the farm's pull, part 2)
export const SESSION_KINDS = ["induction", "deepener", "convincer", "suggestion", "trigger", "compulsion", "hangon", "wake"];
export const ASIDE = ["slip", "nudge"];
// what's planted at the end of the block (part 1's triggers; part 3's compulsions and hang-ons)
export const PLANTED = ["trigger", "compulsion", "hangon"];
// part 3: what sets a compulsion off, and what a hang-on does
export const WHEN = { wake: "they come up out of a session", leader: "their herd leader walks in", "leader talks": "their herd leader says somethin'",
  stall: "a milkin' stall takes them", full: "they're near full (80%)", fed: "a feeder feeds them", pat: "somebody pats their head",
  squeeze: "somebody gropes their tits", cum: "they cum" };
export const EFFECTS = { mootalk: "their sound slips out between their words", cowtalk: "no I: just this {animal}", yes: "every no comes out yes",
  edge: "kept right at the edge", needy: "kept warm and needy", fours: "they stay down low (kneelin' or all fours, their pick)",
  handsoff: "their hands won't touch themselves", hearing: "only the farm's voice (and their herd leader's) comes through",
  names: "everybody's names go fuzzy", heel: "drawn to their herd leader's side" };
export const KEEP_MS = { fun: 86400000, deep: 7 * 86400000 };          // nhl: set for good
export const HANG_CAP_S = { fun: 20 * 60, deep: 60 * 60, nhl: 4 * 3600 };
export const LEVELS = ["fun", "deep", "nhl"];
export const BANDS = { delta: [1.5, 3.5], theta: [4.5, 7], alpha: [8.5, 11.5], beta: [13, 20] };
export const BAND_RANGE = { delta: "1-4 Hz", theta: "4-8 Hz", alpha: "8-12 Hz", beta: "12-30 Hz" };
export const HZ_MIN = 1, HZ_MAX = 30;
export const MAX_DOES = 3;
const LABELS = ["level", "for", "wears", "pace", "pick", "beats", "volume", "look", "deeper", "pull", "trigger", "does", "waits", "when", "chance", "effect", "lasts", "visor"];

// LSCG's own instruction names (Settings/Models/hypno.ts, LSCGHypnoInstruction)
export const LSCG = { cum: "Orgasm", deny: "Denial", needy: "Insatiable", touch: "Perform Activity", strip: "Strip", pose: "Assume Pose",
  follow: "Follow", say: "Speak Phrase", forget: "Forget" };
// the farm's own (part 2): LSCG extension instructions, "<extension id>.<name>". The Companion registers bnbfarm's; the
// Dispensary registers its dose.
export const FARM = { sound: "bnbfarm.sound", stall: "bnbfarm.stall", beg: "bnbfarm.beg", dose: "farmhand-dispensary.dose" };
export const FARM_TYPES = Object.values(FARM);
// how a step reads to people (LSCG's own read as LSCG names them)
const STEP_NAMES = { [FARM.sound]: "Their Sound", [FARM.stall]: "To a Free Stall", [FARM.beg]: "Beg to Be Milked", [FARM.dose]: "Take a Dose" };
export const stepName = (type) => STEP_NAMES[type] || String(type);
// a few names for the game's poses (the game's own names work too: upper/lower/full <Name>)
export const POSES = {
  kneel: { lower: "Kneel" }, "kneel spread": { lower: "KneelingSpread" }, "kneeling spread": { lower: "KneelingSpread" },
  "all fours": { full: "AllFours" }, fours: { full: "AllFours" }, stand: { upper: "BaseUpper", lower: "BaseLower" },
  "legs closed": { lower: "LegsClosed" }, "legs spread": { lower: "Spread" },
  "hands behind": { upper: "BackBoxTie" }, "hands behind back": { upper: "BackBoxTie" }, "elbows behind": { upper: "BackElbowTouch" },
  "hands up": { upper: "OverTheHead" }, "arms up": { upper: "OverTheHead" }, yoked: { upper: "Yoked" },
};
// what a word strips (the game's clothing slots)
export const STRIP = {
  top: ["ClothOuter", "Cloth", "Suit", "Bra", "Corset"], bottoms: ["ClothLower", "SuitLower", "Panties", "Garters"], bottom: ["ClothLower", "SuitLower", "Panties", "Garters"],
  underwear: ["Bra", "Panties"], feet: ["Shoes", "Socks", "SocksLeft", "SocksRight"], shoes: ["Shoes"], gloves: ["Gloves"], hat: ["Hat"],
};
// friendly zone names for touch (the game's own Item… names work too)
export const ZONES = {
  head: "ItemHead", hair: "ItemHead", ears: "ItemEars", nose: "ItemNose", mouth: "ItemMouth", lips: "ItemMouth", neck: "ItemNeck",
  arms: "ItemArms", hands: "ItemHands", tits: "ItemBreast", breasts: "ItemBreast", chest: "ItemBreast", udders: "ItemBreast",
  nipples: "ItemNipples", belly: "ItemTorso", torso: "ItemTorso", hips: "ItemPelvis", pelvis: "ItemPelvis", pussy: "ItemVulva",
  vulva: "ItemVulva", clit: "ItemVulvaPiercings", cock: "ItemPenis", butt: "ItemButt", ass: "ItemButt", legs: "ItemLegs",
  thighs: "ItemLegs", feet: "ItemBoots",
};
const FORGET = { deny: "Denial", denial: "Denial", needy: "Insatiable", insatiable: "Insatiable", follow: "Follow", say: "Speak Phrase" };

const clean = (s) => String(s == null ? "" : s).trim();
const lc = (s) => clean(s).toLowerCase();
const list = (s) => clean(s).split(/\s*,\s*/).map(clean).filter(Boolean);
export const slug = (s) => lc(s).replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "block";

// ── small readers ─────────────────────────────────────────────
// "20s", "1m", "1m30s", "1h", "1h30m", "90" → seconds (null if it isn't a time)
export function seconds(s) {
  s = lc(s); if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  const m = /^(?:(\d+(?:\.\d+)?)\s*h(?:ours?|rs?)?)?\s*(?:(\d+(?:\.\d+)?)\s*m(?:in)?s?)?\s*(?:(\d+(?:\.\d+)?)\s*s(?:ec)?s?)?$/.exec(s);
  if (!m || (!m[1] && !m[2] && !m[3])) return null;
  return Math.round((Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)) * 10) / 10;
}
// "30s" or "20-40s" → { min, max } seconds
export function parsePace(s) {
  s = lc(s); const m = /^(\d+(?:\.\d+)?)\s*(?:s|sec|secs)?\s*(?:-|to|–)\s*(\d+(?:\.\d+)?\s*(?:s|sec|secs|m|min)?)$/.exec(s);
  if (m) { const a = seconds(m[1]), b = seconds(/[a-z]/.test(m[2]) ? m[2] : m[2] + "s"); return a != null && b != null && a > 0 && b >= a ? { min: a, max: b } : null; }
  const one = seconds(s); return one != null && one > 0 ? { min: one, max: one } : null;
}
// one rate: a band name ("theta", "deep theta"), a number ("6", "4.5hz"), or a band with a number ("theta 6")
function rate(s) {
  s = lc(s).replace(/hz$/, "").trim();
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) { const n = Number(s); return n >= HZ_MIN && n <= HZ_MAX ? { hz: n } : null; }
  const m = /^(?:deep\s+)?(delta|theta|alpha|beta)(?:\s+(\d+(?:\.\d+)?))?$/.exec(s);
  if (!m) return null;
  if (m[2]) { const n = Number(m[2]); return n >= HZ_MIN && n <= HZ_MAX ? { hz: n, band: m[1] } : null; }
  return { band: m[1] };
}
// "alpha 10 → theta 6 over 3m", "theta", "6", "→ delta 2 over 4m" (from wherever it is now), "off" → { from, to, over } or { off }
export function parseBeats(s) {
  s = lc(s); if (!s) return null;
  if (/^(off|none|stop|silent)$/.test(s)) return { off: true };
  let over = null; const o = /\s+over\s+(.+)$/.exec(s);
  if (o) { over = seconds(o[1]); if (over == null) return null; s = s.slice(0, o.index); }
  const parts = s.split(/\s*(?:→|->|=>|\bto\b)\s*/);
  if (parts.length > 2) return null;
  const from = parts[0] ? rate(parts[0]) : null, to = parts.length === 2 ? rate(parts[1]) : null;
  if (parts[0] && !from) return null;
  if (parts.length === 2 && !to) return null;
  if (!from && !to) return null;
  return { from: from || null, to: to || null, over: over != null ? Math.min(3600, Math.max(0, over)) : null };
}
// a rate to a number: a band picks somewhere inside itself
export function hzOf(r, rng) {
  if (!r) return null;
  if (r.hz != null) return r.hz;
  const b = BANDS[r.band]; if (!b) return null;
  return Math.round((b[0] + (rng || Math.random)() * (b[1] - b[0])) * 10) / 10;
}
// the look on their screen: haze %, spiral, rings, drifting words, blurred names
export function parseLook(s) {
  const out = {}, bad = [];
  for (const part of list(lc(s))) {
    let m;
    if (part === "clear" || part === "off" || part === "none") { Object.assign(out, { haze: 0, spiral: "off", rings: false, words: false, names: false }); continue; }
    if ((m = /^haze\s+(\d{1,3})\s*%?$/.exec(part))) { out.haze = Math.min(100, Number(m[1])); continue; }
    if (/^haze\s+(off|none)$/.test(part)) { out.haze = 0; continue; }
    if ((m = /^spiral(?:\s+(off|slow|on|fast))?$/.exec(part))) { out.spiral = m[1] === "fast" ? "on" : m[1] || "slow"; continue; }
    if ((m = /^rings(?:\s+(on|off))?$/.exec(part))) { out.rings = m[1] !== "off"; continue; }
    if ((m = /^words(?:\s+(drift|on|off))?$/.exec(part))) { out.words = m[1] !== "off"; continue; }
    if ((m = /^names(?:\s+(blur|blurred|on|clear|off))?$/.exec(part))) { out.names = !(m[1] === "clear" || m[1] === "off"); continue; }
    bad.push(part);
  }
  return { look: out, bad };
}

// ── what a trigger does: LSCG's own instructions ─────────────
// splits on → / -> / ; but never inside quotes
function steps(s) {
  const out = []; let cur = "", q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "“") { q = c === "“" ? "”" : '"'; cur += c; continue; }
    if (c === "→" || c === ";") { out.push(cur); cur = ""; continue; }
    if ((c === "-" || c === "=") && s[i + 1] === ">") { out.push(cur); cur = ""; i++; continue; }
    cur += c;
  }
  out.push(cur);
  return out.map(clean).filter(Boolean);
}
export const splitDoes = (s) => steps(String(s == null ? "" : s));   // (the studio's form: one row per step)
const unquote = (s) => clean(s).replace(/^["“](.*)["”]$/, "$1").trim();
// one step → an LSCG instruction ({ type, arguments }), or { error }
export function parseStep(s, ctx) {
  ctx = ctx || {};
  const t = clean(s), l = t.toLowerCase();
  let m;
  if (/^(cum|orgasm|come)$/.test(l)) return { type: LSCG.cum, arguments: {} };
  if (/^(deny|denial|denied|edge)$/.test(l)) return { type: LSCG.deny, arguments: {} };
  if (/^(needy|insatiable|horny)$/.test(l)) return { type: LSCG.needy, arguments: {} };
  if ((m = /^strip(?:\s+(.+))?$/i.exec(t))) {
    const what = list((m[1] || "all").replace(/\s+and\s+/gi, ","));
    if (what.some((w) => /^(all|everything)$/i.test(w))) return { type: LSCG.strip, arguments: { selection: { all: true, random: false, groups: [] } } };
    if (what.some((w) => /^(random|one|something)$/i.test(w))) return { type: LSCG.strip, arguments: { selection: { all: false, random: true, groups: [] } } };
    const groups = [];
    for (const w of what) {
      if (STRIP[w.toLowerCase()]) groups.push(...STRIP[w.toLowerCase()]);
      else if (/^[A-Z][A-Za-z]+$/.test(w)) groups.push(w);
      else return { error: 'strip what? "' + w + '" (top, bottoms, underwear, feet, all, random, or a slot like ClothLower)' };
    }
    return { type: LSCG.strip, arguments: { selection: { all: false, random: false, groups: Array.from(new Set(groups)) } } };
  }
  if ((m = /^pose\s+(.+)$/i.exec(t))) {
    let p = clean(m[1]).toLowerCase();
    if (p === "{low}" || p === "low") p = ctx.low === "fours" ? "all fours" : "kneel";
    const raw = /^(upper|lower|full)\s+([A-Za-z]+)$/i.exec(clean(m[1]));
    const sel = raw ? { [raw[1].toLowerCase()]: raw[2] } : POSES[p];
    if (!sel) return { error: 'pose what? "' + m[1] + '" ({low}, kneel, kneel spread, all fours, stand, hands behind, hands up, or upper/lower/full <the game\'s pose>)' };
    return { type: LSCG.pose, arguments: { selection: Object.assign({ upper: "", lower: "", full: "" }, sel) } };
  }
  if ((m = /^say(?:\s*:)?(?:\s+(.+))?$/i.exec(t))) {
    const words = m[1] ? unquote(m[1]) : "";
    if (/[()]/.test(words) || /^[*!/.]/.test(words)) return { error: "what they say can't start with * ! / . or have round brackets" };
    return { type: LSCG.say, arguments: words ? { config: words.slice(0, 200) } : {} };
  }
  if (/^follow(\s+(me|speaker|them))?$/i.test(t)) return { type: LSCG.follow, arguments: { speakerOnly: true } };
  if ((m = /^(?:touch|do|activity)\s+([A-Za-z]+)\s+(?:on\s+)?(?:(?:their|your|the|my)\s+)?([A-Za-z]+)(?:\s+(self|own|speaker|me|them|named))?$/i.exec(t))) {
    const act = m[1][0].toUpperCase() + m[1].slice(1), zw = m[2].toLowerCase(), zone = ZONES[zw] || (/^Item[A-Z][A-Za-z]+$/.test(m[2]) ? m[2] : null);
    if (!zone) return { error: 'touch where? "' + m[2] + '" (head, mouth, neck, tits, nipples, belly, pussy, cock, butt, hands, feet, or the game\'s Item… name)' };
    const who = (m[3] || "").toLowerCase(), a = { selection: { name: act, group: zone } };
    if (who === "self" || who === "own") a.self = true; else if (who === "speaker" || who === "me") a.speakerOnly = true;
    return { type: LSCG.touch, arguments: a };
  }
  if ((m = /^forget(?:\s+(.+))?$/i.exec(t))) {
    const what = list((m[1] || "all").replace(/\s+and\s+/gi, ","));
    if (what.some((w) => /^(all|everything)$/i.test(w))) return { type: LSCG.forget, arguments: { selection: { all: true, instructions: [] } } };
    const ins = []; for (const w of what) { const f = FORGET[w.toLowerCase()]; if (!f) return { error: 'forget what? "' + w + '" (all, deny, needy, follow, say)' }; ins.push(f); }
    return { type: LSCG.forget, arguments: { selection: { all: false, instructions: Array.from(new Set(ins)) } } };
  }
  // the farm's own (part 2): its options go in arguments.options, the way LSCG keeps an extension instruction's
  if ((m = /^(?:moo|sound|noise|make (?:their|your|a) (?:sound|noise))(?:\s+(\d+))?$/i.exec(t))) {
    const n = Number(m[1] || 1);
    if (!(n >= 1 && n <= 3)) return { error: "moo once, twice or three times (moo, moo 2, moo 3)" };
    return { type: FARM.sound, arguments: { options: { times: n } } };
  }
  if (/^(?:stall|to (?:a |the )?stalls?|go to (?:a |the )?(?:free )?(?:milk(?:in'?g?)? )?stall)$/i.test(t)) return { type: FARM.stall, arguments: { options: {} } };
  if ((m = /^beg(?:\s+to be milked|\s+for it)?(?:\s*:)?(?:\s+(.+))?$/i.exec(t))) {
    const words = m[1] ? unquote(m[1]) : "";
    if (/[()]/.test(words) || /^[*!/.]/.test(words)) return { error: "what they beg can't start with * ! / . or have round brackets" };
    return { type: FARM.beg, arguments: { options: words ? { words: words.slice(0, 120) } : {} } };
  }
  if ((m = /^dose\s+(.+?)(?:\s+(half|whole|double))?$/i.exec(t))) return { type: FARM.dose, arguments: { options: { dose: lc(m[1]).slice(0, 40), strength: lc(m[2] || "whole") } } };
  return { error: 'I don\'t know "' + t + '" (cum, deny, needy, strip …, pose …, say "…", follow, touch <Activity> <zone>, forget …, or the farm\'s: moo, stall, beg "…", dose <name>)' };
}
// "strip top → pose {low} → say "Moo"" with "2s, 2s" → { ok, instructions } (LSCG's shape, delay in ms) or { error }
export function parseDoes(does, waits, ctx) {
  const parts = steps(clean(does));
  if (!parts.length) return { error: "does what? (at least one: cum, deny, needy, strip, pose, say, follow, touch, forget, moo, stall, beg, dose)" };
  if (parts.length > MAX_DOES) return { error: "at most " + MAX_DOES + " things (LSCG's limit), not " + parts.length };
  const w = list(waits || "").map(seconds), out = [];
  for (let i = 0; i < parts.length; i++) {
    const r = parseStep(parts[i], ctx);
    if (r.error) return { error: r.error };
    if (i > 0 && w[i - 1] != null) { if (w[i - 1] < 1 || w[i - 1] > 30) return { error: "a wait is 1 to 30 seconds" }; r.delay = Math.round(w[i - 1] * 1000); }
    out.push(r);
  }
  return { ok: true, instructions: out };
}

// ── the library ───────────────────────────────────────────────
const CUE = /\[([^\]]*)\]/g;
function readCue(c) {
  const s = lc(c); let m;
  if ((m = /^(?:wait|pause)\s+(.+)$/.exec(s))) { const v = seconds(m[1]); return v != null && v >= 0 && v <= 600 ? { wait: v } : { bad: c }; }
  if ((m = /^deeper\s*\+?\s*(-?\d+)$/.exec(s))) return { deeper: Math.max(-100, Math.min(100, Number(m[1]))) };
  if ((m = /^beats\s+(.+)$/.exec(s))) { const b = parseBeats(m[1]); return b ? { beats: b } : { bad: c }; }
  if ((m = /^look\s+(.+)$/.exec(s))) { const L = parseLook(m[1]); return L.bad.length ? { bad: c } : { look: L.look }; }
  return { bad: c };
}
// the whole file → { blocks, errors, warnings } (errors stop a block from being used; warnings are fixed up)
export function parseLibrary(text) {
  const blocks = [], errors = [], warnings = [];
  const rows = String(text == null ? "" : text).replace(/\r\n?/g, "\n").split("\n");
  let b = null, inLabels = false;
  const err = (n, msg) => { errors.push({ line: n, block: b ? b.kind + ": " + b.name : "", msg }); if (b) b.bad = true; };
  const warn = (n, msg) => warnings.push({ line: n, block: b ? b.kind + ": " + b.name : "", msg });
  const close = () => { if (b) { finish(b, err, warn); blocks.push(b); } b = null; };
  rows.forEach((raw, i) => {
    const n = i + 1, line = raw.replace(/\s+$/, "");
    const head = /^===\s*([A-Za-z]+)\s*:\s*(.*?)\s*=*\s*$/.exec(line);
    if (head) {
      close();
      const kind = head[1].toLowerCase(), name = clean(head[2]);
      b = { kind, name, labels: {}, raw: {}, lines: [], at: n };
      inLabels = true;
      if (!KINDS.includes(kind)) err(n, 'no such kind "' + head[1] + '" (' + KINDS.join(", ") + ")");
      if (!name) err(n, "a block needs a name: === " + kind + ": Its Name");
      return;
    }
    if (/^\s*(#|\/\/)/.test(line)) return;   // a note to yourself
    if (!b) { if (clean(line)) warn(n, "this is outside any block, so it's skipped (start one with === kind: Name)"); return; }
    if (!clean(line)) { if (b.lines.length || Object.keys(b.raw).length) inLabels = false; return; }
    const lab = /^\s*([A-Za-z]+)\s*:\s*(.*)$/.exec(line);
    const key = lab && lab[1].toLowerCase();
    if (inLabels && lab && (LABELS.includes(key) || (b.kind === "session" && SESSION_KINDS.includes(key)))) {
      if (b.kind === "session" && SESSION_KINDS.includes(key)) (b.raw.picks = b.raw.picks || []).push([key, lab[2], n]);
      else b.raw[key] = [lab[2], n];
      return;
    }
    inLabels = false;
    if (b.kind === "session") { warn(n, "a session only lists blocks (like deepener: any); this line is skipped"); return; }
    let text = line.trim(); const cues = [];
    text = text.replace(CUE, (all, c) => { const r = readCue(c); if (r.bad != null) warn(n, 'I don\'t know the cue [' + c + '] (wait, deeper, beats, look)'); else cues.push(r); return " "; });
    if (/[()]/.test(text)) { warn(n, "round brackets taken out: hypno add-ons skip anything after one"); text = text.replace(/[()]/g, ""); }
    text = text.replace(/\s{2,}/g, " ").trim();
    if (text || cues.length) b.lines.push({ text, cues, at: n });
  });
  close();
  // names must be different within a kind
  const seen = new Map();
  for (const x of blocks) { const k = x.kind + ":" + lc(x.name); if (seen.has(k)) { errors.push({ line: x.at, block: x.kind + ": " + x.name, msg: "two " + x.kind + "s are called " + x.name + " (line " + seen.get(k) + ")" }); x.bad = true; } else seen.set(k, x.at); }
  // a session's picks must name blocks that exist
  for (const x of blocks.filter((y) => y.kind === "session" && !y.bad)) {
    for (const p of x.labels.picks || []) for (const it of p.items) if (it.name && !blocks.some((y) => y.kind === p.kind && lc(y.name) === lc(it.name))) {
      errors.push({ line: p.at, block: "session: " + x.name, msg: "there's no " + p.kind + " called " + it.name }); x.bad = true;
    }
  }
  return { blocks, errors, warnings };
}
function finish(b, err, warn) {
  const r = b.raw, L = b.labels;
  const get = (k) => (r[k] ? r[k] : null);
  if (get("level")) { const v = list(lc(r.level[0])).map((x) => (x === "no human left" ? "nhl" : x)); const bad = v.filter((x) => !LEVELS.includes(x) && x !== "any" && x !== "all"); if (bad.length) err(r.level[1], "level is fun, deep or nhl, not " + bad.join(", ")); L.level = v.includes("any") || v.includes("all") ? LEVELS.slice() : v.filter((x) => LEVELS.includes(x)); }
  if (get("for")) { const v = list(lc(r.for[0])); L.for = v.includes("any") || v.includes("all") ? null : v; }
  if (get("wears")) L.wears = list(lc(r.wears[0]));
  if (get("pace")) { const p = parsePace(r.pace[0]); if (!p) err(r.pace[1], 'pace is like 30s or 20-40s, not "' + r.pace[0] + '"'); else L.pace = p; }
  if (get("pick")) { const p = Number(clean(r.pick[0])); if (!(p >= 1 && p <= 99 && Math.floor(p) === p)) err(r.pick[1], "pick is a number of lines, like 3"); else L.pick = p; }
  if (get("beats")) { const v = parseBeats(r.beats[0]); if (!v) err(r.beats[1], 'beats like "theta", "6", "alpha 10 → theta 6 over 3m" or "off" (1 to 30 Hz), not "' + r.beats[0] + '"'); else L.beats = v; }
  if (get("volume")) { const m = /^(\d{1,3})\s*%?$/.exec(clean(r.volume[0])); if (!m || Number(m[1]) > 100) err(r.volume[1], "volume is 0% to 100% of their own"); else L.volume = Number(m[1]); }
  if (get("look")) { const v = parseLook(r.look[0]); if (v.bad.length) err(r.look[1], "I don't know the look " + v.bad.join(", ") + " (haze N%, spiral slow|on|off, rings on|off, words drift|off, names blur|clear, clear)"); else L.look = v.look; }
  if (get("deeper")) { const m = /^\+?\s*(-?\d+)$/.exec(clean(r.deeper[0])); if (!m) err(r.deeper[1], "deeper is a number, like +10"); else L.deeper = Math.max(-100, Math.min(100, Number(m[1]))); }
  if (get("pull")) {
    const m = /^(\d{1,3})\s*%?\s*\+?$/.exec(clean(r.pull[0]));
    if (!ASIDE.includes(b.kind)) warn(r.pull[1], "pull only means somethin' on a slip or a nudge, so it's skipped here");
    else if (!m || Number(m[1]) > 100) err(r.pull[1], "pull is how far the farm's pull has to be built up first, 0 to 100, like: pull: 60");
    else L.pull = Number(m[1]);
  }
  if (b.kind === "trigger") {
    if (!get("trigger") || clean(r.trigger[0]).length < 4) err(get("trigger") ? r.trigger[1] : b.at, "a trigger needs its phrase, 4 letters or more: trigger: milkin' time");
    else { L.trigger = clean(r.trigger[0]).replace(/[()]/g, "").slice(0, 80); if (/^[*!/.]/.test(L.trigger)) err(r.trigger[1], "a trigger can't start with * ! / ."); }
  } else if (get("trigger")) warn(r.trigger[1], "trigger only means somethin' on a trigger block, so it's skipped here");
  if (b.kind === "trigger" || b.kind === "compulsion") {
    if (!get("does")) err(b.at, "a " + b.kind + " needs what it does: does: pose {low} → say \"Moo\"");
    else { const d = parseDoes(r.does[0], get("waits") ? r.waits[0] : "", { low: "kneel" }); if (d.error) err(r.does[1], d.error); else { L.does = clean(r.does[0]); L.waits = get("waits") ? clean(r.waits[0]) : ""; } }
  } else for (const k of ["does", "waits"]) if (get(k)) warn(r[k][1], k + " only means somethin' on a trigger or a compulsion, so it's skipped here");
  // part 3: what sets a compulsion off, and how likely
  if (b.kind === "compulsion") {
    const w = get("when") ? lc(r.when[0]).replace(/[-_]+/g, " ").replace(/\s+/g, " ") : "";
    if (!w) err(b.at, "a compulsion needs what sets it off: when: " + Object.keys(WHEN).join(" | "));
    else if (!WHEN[w]) err(r.when[1], 'when is one of ' + Object.keys(WHEN).join(", ") + ', not "' + r.when[0] + '"');
    else L.when = w;
    if (get("chance")) { const m = /^(\d{1,2}(?:\.\d+)?)\s*%?$/.exec(clean(r.chance[0])); if (!m || Number(m[1]) < 1 || Number(m[1]) > 50) err(r.chance[1], "chance is 1% to 50% (a small one: 10% if you leave it out)"); else L.chance = Number(m[1]); }
  } else for (const k of ["when", "chance"]) if (get(k)) warn(r[k][1], k + " only means somethin' on a compulsion, so it's skipped here");
  // part 3: what a hang-on does, and for how long
  if (b.kind === "hangon") {
    const e = get("effect") ? lc(r.effect[0]).replace(/[\s'-]+/g, "") : "";
    if (!e) err(b.at, "a hang-on needs its effect: effect: " + Object.keys(EFFECTS).join(" | "));
    else if (!EFFECTS[e]) err(r.effect[1], 'effect is one of ' + Object.keys(EFFECTS).join(", ") + ', not "' + r.effect[0] + '"');
    else L.effect = e;
    if (get("lasts")) { const s = seconds(r.lasts[0]); if (s == null || s < 60 || s > 4 * 3600) err(r.lasts[1], "lasts is 1m to 4h, like: lasts: 30m"); else L.lasts = s; }
  } else for (const k of ["effect", "lasts"]) if (get(k)) warn(r[k][1], k + " only means somethin' on a hang-on, so it's skipped here");
  // the visor (Nov 25): a session marked for visors goes on the farm's public list, for crafters to pick
  if (get("visor")) { if (b.kind !== "session") warn(r.visor[1], "visor only means somethin' on a session, so it's skipped here"); else L.visor = /^(yes|on|true|y)$/i.test(clean(r.visor[0])); }
  if (b.kind === "session") {
    L.picks = (r.picks || []).map(([kind, v, n]) => ({ kind, at: n, items: list(v).map((it) => {
      const m = /^any(?:\s+(\d+))?$/i.exec(it);
      if (m) return { any: Number(m[1] || 1) };
      if (/^all$/i.test(it)) return { all: true };
      return { name: it };
    }) }));
    if (!L.picks.length) err(b.at, "a session lists its blocks in order, like: induction: any");
  } else if (!b.lines.length && b.kind !== "trigger") warn(b.at, "this " + b.kind + " has no lines");
  if (L.pick && L.pick > b.lines.length && b.lines.length) warn(r.pick[1], "pick " + L.pick + " but there are only " + b.lines.length + " lines");
  delete b.raw;
}

// the file again, from blocks (the studio's form writes through this, so the text always reads the same way)
export function formatLevel(v) { return !v || v.length === 3 ? "" : v.join(", "); }
export function formatBeats(v) {
  if (!v) return "";
  if (v.off) return "off";
  const r = (x) => (!x ? "" : x.band && x.hz != null ? x.band + " " + x.hz : x.band ? x.band : String(x.hz));
  return (r(v.from) + (v.to ? (v.from ? " → " : "→ ") + r(v.to) : "") + (v.over != null ? " over " + fmtSecs(v.over) : "")).trim();
}
export function fmtSecs(s) {
  s = Number(s) || 0;
  if (s >= 3600 && s % 60 === 0) { const h = Math.floor(s / 3600), m = (s % 3600) / 60; return h + "h" + (m ? m + "m" : ""); }
  if (s >= 60 && s % 60 === 0) return s / 60 + "m"; if (s > 60) return Math.floor(s / 60) + "m" + Math.round(s % 60) + "s"; return s + "s";
}
export function formatLook(v) {
  if (!v) return "";
  const out = [];
  if (v.haze != null) out.push(v.haze ? "haze " + v.haze + "%" : "haze off");
  if (v.spiral) out.push("spiral " + v.spiral);
  if (v.rings != null) out.push("rings " + (v.rings ? "on" : "off"));
  if (v.words != null) out.push("words " + (v.words ? "drift" : "off"));
  if (v.names != null) out.push("names " + (v.names ? "blur" : "clear"));
  return out.join(", ");
}
export function formatBlock(b) {
  const L = b.labels || {}, out = ["=== " + b.kind + ": " + b.name];
  if (L.level && formatLevel(L.level)) out.push("level: " + formatLevel(L.level));
  if (L.for && L.for.length) out.push("for: " + L.for.join(", "));
  if (L.wears && L.wears.length) out.push("wears: " + L.wears.join(", "));
  if (L.pace) out.push("pace: " + (L.pace.min === L.pace.max ? fmtSecs(L.pace.min) : L.pace.min + "-" + fmtSecs(L.pace.max)));
  if (L.pick) out.push("pick: " + L.pick);
  if (L.beats) out.push("beats: " + formatBeats(L.beats));
  if (L.volume != null) out.push("volume: " + L.volume + "%");
  if (L.look && formatLook(L.look)) out.push("look: " + formatLook(L.look));
  if (L.deeper) out.push("deeper: " + (L.deeper > 0 ? "+" : "") + L.deeper);
  if (L.pull && ASIDE.includes(b.kind)) out.push("pull: " + L.pull);
  if (b.kind === "trigger" && L.trigger) out.push("trigger: " + L.trigger);
  if (b.kind === "compulsion") { if (L.when) out.push("when: " + L.when); if (L.chance) out.push("chance: " + L.chance + "%"); }
  if (b.kind === "trigger" || b.kind === "compulsion") { if (L.does) out.push("does: " + L.does); if (L.waits) out.push("waits: " + L.waits); }
  if (b.kind === "hangon") { if (L.effect) out.push("effect: " + L.effect); if (L.lasts) out.push("lasts: " + fmtSecs(L.lasts)); }
  if (b.kind === "session" && L.visor) out.push("visor: yes");
  if (b.kind === "session") for (const p of L.picks || []) out.push(p.kind + ": " + p.items.map((it) => (it.all ? "all" : it.any ? (it.any > 1 ? "any " + it.any : "any") : it.name)).join(", "));
  if (b.lines && b.lines.length) {
    out.push("");
    for (const l of b.lines) out.push((l.text + " " + (l.cues || []).map(formatCue).join(" ")).trim());
  }
  return out.join("\n");
}
export function formatCue(c) {
  if (c.wait != null) return "[wait " + fmtSecs(c.wait) + "]";
  if (c.deeper != null) return "[deeper " + (c.deeper >= 0 ? "+" : "") + c.deeper + "]";
  if (c.beats) return "[beats " + formatBeats(c.beats) + "]";
  if (c.look) return "[look " + formatLook(c.look) + "]";
  return "";
}
export function formatLibrary(blocks) { return blocks.map(formatBlock).join("\n\n") + "\n"; }

// ── pickin' a session ─────────────────────────────────────────
// does a block suit them? { level, species, wears: [things they have on] }
export function fits(b, who) {
  const L = b.labels || {}; who = who || {};
  if (b.bad) return false;
  if (who.level && L.level && L.level.length && !L.level.includes(who.level)) return false;
  if (L.for && L.for.length && !L.for.includes(lc(who.species))) return false;
  if (L.wears && L.wears.length && !L.wears.some((w) => (who.wears || []).includes(w))) return false;
  return true;
}
const shuffle = (a, rng) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rng || Math.random)() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// which blocks, in order. A named session if asked for and it suits them, else one of the sessions that do, else the
// plain shape: an induction, a deepener, a couple of suggestions, a trigger, a wake.
export function planSession(blocks, who, opts) {
  opts = opts || {}; const rng = opts.rng || Math.random;
  const good = blocks.filter((b) => !b.bad);
  const sessions = good.filter((b) => b.kind === "session" && fits(b, who));
  let recipe = opts.name ? sessions.find((b) => lc(b.name) === lc(opts.name)) : null;
  if (!recipe && sessions.length) recipe = sessions[Math.floor(rng() * sessions.length)];
  const picks = recipe ? recipe.labels.picks : [
    { kind: "induction", items: [{ any: 1 }] }, { kind: "deepener", items: [{ any: 1 }] }, { kind: "suggestion", items: [{ any: 2 }] },
    { kind: "trigger", items: [{ any: 1 }] }, { kind: "wake", items: [{ any: 1 }] }];
  const used = new Set(), out = [];
  for (const p of picks) {
    const pool = good.filter((b) => b.kind === p.kind && fits(b, who));
    for (const it of p.items) {
      if (it.name) { const b = good.find((x) => x.kind === p.kind && lc(x.name) === lc(it.name)); if (b && !used.has(b)) { out.push(b); used.add(b); } continue; }
      const free = shuffle(pool.filter((b) => !used.has(b)), rng);
      const take = it.all ? free : free.slice(0, it.any || 1);
      for (const b of take) { out.push(b); used.add(b); }
    }
  }
  return { name: recipe ? recipe.name : "", recipe: recipe || null, blocks: out };
}
// the session, line by line: { kind, block, text, gap (seconds after it), beats/look/deeper (from the block's labels,
// on its first line; from a cue, on that line), plant (on a trigger block's last line) }
// opts: rng, keep(text) → false drops a line (a line that doesn't fit their body), hz(rate) → a number
export function sessionSteps(plan, opts) {
  opts = opts || {}; const rng = opts.rng || Math.random, keep = opts.keep || (() => true);
  const out = [];
  for (const b of plan.blocks) {
    const L = b.labels || {};
    let lines = b.lines.filter((l) => !l.text || keep(l.text));
    if (L.pick && lines.length > L.pick) { const idx = shuffle(lines.map((x, i) => i), rng).slice(0, L.pick).sort((a, c) => a - c); lines = idx.map((i) => lines[i]); }
    const pace = L.pace || { min: 30, max: 30 };
    const gap = () => Math.round((pace.min + rng() * (pace.max - pace.min)) * 10) / 10;
    const first = { kind: b.kind, block: b.name, start: true };
    if (L.beats) first.beats = beatsNow(L.beats, rng);
    if (L.volume != null) first.volume = L.volume;
    if (L.look) first.look = L.look;
    if (!lines.length) { out.push(Object.assign(first, { text: "", gap: 0 })); }
    lines.forEach((l, i) => {
      const s = i === 0 ? first : { kind: b.kind, block: b.name };
      s.text = l.text; s.gap = gap();
      for (const c of l.cues || []) {
        if (c.wait != null) s.gap = c.wait;
        if (c.deeper != null) s.deeper = (s.deeper || 0) + c.deeper;
        if (c.beats) s.beats = beatsNow(c.beats, rng);
        if (c.look) s.look = Object.assign({}, s.look || {}, c.look);
      }
      out.push(s);
    });
    const last = out[out.length - 1];
    if (L.deeper) last.deeper = (last.deeper || 0) + L.deeper;
    if (PLANTED.includes(b.kind)) last.plant = b;
  }
  return out;
}
// beats with the bands turned into numbers for this run
export function beatsNow(v, rng) {
  if (!v) return null;
  if (v.off) return { off: true };
  return { from: hzOf(v.from, rng), to: hzOf(v.to, rng), over: v.over };
}
// fill-ins: {name} {animal} … from a map; anything unknown is left as it is
export function fillIn(text, words) {
  return String(text == null ? "" : text).replace(/\{([a-z]+)\}/gi, (all, k) => (words && words[k.toLowerCase()] != null ? String(words[k.toLowerCase()]) : all));
}

// ── LSCG ──────────────────────────────────────────────────────
// a trigger block as LSCG's own suggestion (Modules/hypno.ts HypnoSuggestion), planted by the farm
export const SUGG_PREFIX = "bnbfarm-";
export function lscgSuggestion(b, opts) {
  opts = opts || {}; const words = opts.words || {};
  // ({low} in "does" is the pose they picked, worked out below; everywhere else it's the words for it)
  const L = b.labels, d = parseDoes(fillIn(L.does, Object.assign({}, words, { low: "{low}" })), L.waits, { low: opts.low });
  if (d.error) return { error: d.error };
  return {
    id: SUGG_PREFIX + slug(b.name), name: "B&B " + b.name, trigger: fillIn(L.trigger, words).replace(/[()]/g, "").slice(0, 80),
    installedBy: opts.by || -1, installedByName: opts.byName || "The farm", installedAt: opts.now || Date.now(), exclusive: false,
    instructions: d.instructions.map((x) => { const o = { type: x.type, arguments: x.arguments }; if (x.delay != null) o.delay = x.delay; return o; }),
  };
}
// part 3: a compulsion block as the farm keeps it (their Companion carries it out when it's set off): what sets it off,
// how likely, and what it does (the same instructions a trigger's made of)
export function farmCompulsion(b, opts) {
  opts = opts || {}; const words = opts.words || {}, L = b.labels;
  const d = parseDoes(fillIn(L.does, Object.assign({}, words, { low: "{low}" })), L.waits, { low: opts.low });
  if (d.error) return { error: d.error };
  return { id: SUGG_PREFIX + "c-" + slug(b.name), name: "B&B " + b.name, trigger: "", when: L.when, chance: Math.max(0.01, Math.min(0.5, (L.chance || 10) / 100)),
    instructions: d.instructions.map((x) => { const o = { type: x.type, arguments: x.arguments }; if (x.delay != null) o.delay = x.delay; return o; }) };
}
