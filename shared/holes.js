/* WHAT'S IN THIS FILE (shared/holes.js)
   HOLE TRAINING'S RULE BOOK (Nov 18; Laynie: "if we can do the hole training better, i would love to explore that
   idea", then all seven: it trains anywhere, the toy's size matters, a trainer that grows with you, use counts,
   stretched and trained both shown, a heal switch, and the room notices). The farm girl and the Dispensary both read
   this, so they agree on every number.
     • SIZES: a pussy, an ass and a throat each have a size, 1 to 20. Up to 10 is natural; past that only the farm's
       shots go. "Stretched" is how open a hole is right now (it tightens back a size a day); "trained" is its usual.
     • TOYS: every plug, dildo, egg and gag of the game's that goes in you has a size here. A pump or beads has one
       for each notch. Words on a crafted one move it: small -1 · big +1 · huge +2 · monster +3 · colossal +5.
     • TRAINING: a trainer (crafted to say stretcher, gaper, trainer, dilator and such, or cruel, or with a goal on it)
       trains your usual up a size every 12 hours it's in you, faster the bigger it is than you (1 size: 12 h, 2: 8 h,
       3 or more: 6 h), and half again as fast if it's cruel. It can't train you past its own size, nor past 10.
     • HOW IT FEELS: one size bigger than you're trained is a good stretch, two aches, three or more hurts. A cruel
       one always hurts (Laynie: "let it in, aching, sometimes even painful. A 'cruel' or 'sadist' tag might be fun").
     • USE: fingers, a tongue, a fist, a cock or a toy from somebody's hand stretch you to their size, and train you a
       little if they're bigger than you're trained.
     • GOALS: "goal: gaping", "train her to loose", "until ruined" on a trainer, with "in 3 days" or "by friday" if it's
       in a hurry. Only from somebody who's allowed to dose you (Laynie: "anyone who can dose").
*/
export const HOLES = ["vulva", "butt", "throat"];
const GAPE = ["tight", "snug", "slightly gaped", "gaped", "loose", "well-used", "gaping", "wide open", "cavernous", "ruined",
  "hyper-gaped", "fist-wide", "yawning", "arm-deep", "sloppy and slack", "bottomless", "hollowed out", "endless", "abyssal", "impossibly gaped"];
const THROAT = ["gaggy", "tight", "learnin'", "eager", "practiced", "trained", "deep", "greedy", "no gag reflex", "bottomless",
  "hyper-trained", "stretchy", "endless", "swallow-anything", "cock sleeve", "limitless", "living funnel", "insatiable", "abyssal", "impossibly deep"];
// the farm's own numbers (bot 01-config.js CFG.SIZES holds the same: a test checks they match)
export const HOLE_SIZES = {
  vulva: { label: "Pussy", start: 1, natural: 10, max: 20, names: GAPE },
  butt: { label: "Ass", start: 1, natural: 10, max: 20, names: GAPE },
  throat: { label: "Throat", start: 2, natural: 10, max: 20, names: THROAT },
};
export const HOLE_WORD = { vulva: "pussy", butt: "ass", throat: "throat" };
export const TRAIN_H = 12;              // hours of trainin' for a size, at one size bigger
export const TIGHTEN_H = 24;            // a stretched hole tightens back a size this often, down to its usual
export const HEAL_GRACE_H = 24;         // with the heal switch on: left be this long, and the usual starts closin'
export const HEAL_PER_DAY = 0.5;        // ...half a size a day
export const USE_BUDGET_H = 6;          // what use can train in an hour, at most (somebody clickin' Fast all night)
export const clampSize = (h, n) => { const S = HOLE_SIZES[h]; return Math.max(1, Math.min(S ? S.max : 20, Math.round(Number(n) || 1))); };
export const sizeWord = (h, n) => (HOLE_SIZES[h] || HOLE_SIZES.butt).names[clampSize(h, n) - 1];
// in a sentence ("%t's throat is %s now"): a few of the throat's read better said another way
const THROAT_SAY = { "no gag reflex": "past gaggin'", "trained": "well trained", "swallow-anything": "ready to swallow anything", "cock sleeve": "a cock sleeve", "living funnel": "a livin' funnel" };
export const sizeSay = (h, n) => { const w = sizeWord(h, n); return h === "throat" ? THROAT_SAY[w] || w : w; };

// ── the game's toys ──
export function holeOfGroup(g) {
  g = String(g || "");
  return g === "ItemVulva" ? "vulva" : g === "ItemButt" ? "butt" : /^ItemMouth[23]?$/.test(g) ? "throat" : null;
}
// a size for every toy that goes in you (anything not here doesn't). [sizes]: one for each notch of a pump, or each
// bead in; { typed: [..] }: one for each of its options (0 = it's not in you then)
const TOYS = {
  ItemButt: {
    BlackButtPlug: 3, PenisPlug: 3, SuccubusButtPlug: 3, SuccubusHeartButtPlug: 3, DemonPlug: 4, VibratingButtplug: 3, ButtPlugLock: 3,
    VibratingDildoPlug: 3, LockingVibePlug: 3, ShockPlug: 3, FuckPlug: 4, Tentacles: 4, HollowButtPlug: 5, EggVibePlugXXL: 6, AnalHook: 2, AnalBeads: 2,
    TailButtPlug: 2, HorsetailPlug: 2, HorsetailPlug1: 2, PuppyTailPlug: 2, PuppyTailPlug1: 2, FoxTails: 2, FoxTail: 2, RaccoonButtPlug: 2, RaccoonTailPlug: 2,
    KittenTail1: 2, KittenTail2: 2, WolfTail1: 2, WolfTail2: 2, WolfTail3: 2, MouseTail1: 2, MouseTail2: 2, BunnyTailPlug1: 2, BunnyTailPlug2: 2,
    BunnyTailVibePlug: 2, Cowtail: 2,
    ButtPump: { pump: "typed", sizes: [2, 4, 6, 8, 10] },
    InflVibeButtPlug: { pump: "f", sizes: [2, 4, 5, 7, 8] },
    AnalBeads2: { pump: "beads", sizes: [2, 2, 3, 3, 4] },
  },
  ItemVulva: {
    VibratingEgg: 1, WiredEgg: 1, MoreWiredVibrators: 1, LoversVibrator: 1, BenWaBalls: 2, FuturisticVibrator: 2,
    PenisDildo: 3, ShockDildo: 3, VibratingDildo: 3, ClitAndDildoVibratorbelt: 3,
    DoubleEndDildo: { typed: [3, 5] },
    InflatableVibeDildo: { pump: "f", sizes: [2, 4, 5, 7, 8] },
    InflatableVibratingPanties: { pump: "f", sizes: [1, 2, 3, 4, 5] },
  },
  ItemMouth: {
    DildoGag: 3, DeepthroatGag: 5, LargeDildo: 5, Tentacles: 5,
    PlugGag: { typed: [0, 2] }, DildoPlugGag: { typed: [0, 4] }, OTNPlugGag: { typed: [0, 3] },
    PumpGag: { pump: "typed", sizes: [1, 2, 3, 4, 5] },
  },
};
const toyRow = (group, name) => { const T = TOYS[/^ItemMouth/.test(group) ? "ItemMouth" : group]; return T ? T[name] : undefined; };
// which notch a pump or beads is on (0 to 4), and which option a typed one is on
function notchOf(item, row) {
  const P = (item && item.Property) || {}, TR = P.TypeRecord || {};
  if (row.pump === "beads") return Math.max(0, Math.min(4, (Number(P.InsertedBeads) || (typeof TR.typed === "number" ? TR.typed + 1 : 1)) - 1));
  if (typeof P.InflateLevel === "number") return Math.max(0, Math.min(4, P.InflateLevel));
  const n = row.pump === "f" ? TR.f : TR.typed;
  return Math.max(0, Math.min(row.sizes ? row.sizes.length - 1 : 4, Number(n) || 0));
}
// the words on a crafted one
const BIGGER = [[5, /\b(colossal|titanic|impossible|hyper)\b/], [3, /\b(xxl|enormous|monster|monstrous|giant|horse|stallion|equine|dragon)\b/],
  [2, /\b(huge|xl|extra[- ]large|massive|beefy|hefty)\b/], [1, /\b(large|big|thick|fat|chunky|girthy)\b/]];
const SMALLER = /\b(tiny|small|little|petite|slim|slender|thin|mini)\b/;
export function sizeShift(text) {
  const t = String(text || "").toLowerCase();
  for (const [n, re] of BIGGER) if (re.test(t)) return n;
  return SMALLER.test(t) ? -1 : 0;
}
export const TRAINER = /\b(stretch\w*|gap(?:er|e|ing)|dilat\w*|expander|spreader|train(?:er|ing)|widener|loosener)\b/;
export const CRUEL = /\b(cruel\w*|sadist\w*|merciless|vicious|punishing|brutal)\b/;
// a toy in you: { hole, size, base, name, pump: { kind, n, sizes } | null, trainer, cruel, goal, by } (null: it isn't one)
export function toyIn(item, text) {
  if (!item || !item.Asset || !item.Asset.Group) return null;
  const group = item.Asset.Group.Name, hole = holeOfGroup(group), row = hole ? toyRow(group, item.Asset.Name) : undefined;
  if (row === undefined) return null;
  text = String(text || "").toLowerCase();
  let base, pump = null;
  if (typeof row === "number") base = row;
  else if (row.typed) { base = row.typed[Math.max(0, Math.min(row.typed.length - 1, Number(((item.Property || {}).TypeRecord || {}).typed) || 0))]; }
  else { const n = notchOf(item, row); base = row.sizes[n]; pump = { kind: row.pump, n, sizes: row.sizes.slice() }; }
  if (!base) return null;   // (a ring gag left open: nothin' in you)
  const shift = sizeShift(text), size = Math.max(1, Math.min(20, base + shift));
  const by = Number(item.Craft && item.Craft.MemberNumber) || 0;
  const cruel = CRUEL.test(text), goal = goalIn(text, hole);
  return { hole, size, base, shift, name: (item.Craft && item.Craft.Name) || item.Asset.Description || item.Asset.Name, pump, cruel, goal, by,
    trainer: TRAINER.test(text) || cruel || !!goal };
}
// a pump's size on another notch
export const pumpSize = (t, n) => (t && t.pump ? Math.max(1, Math.min(20, t.pump.sizes[Math.max(0, Math.min(t.pump.sizes.length - 1, n))] + (t.shift || 0))) : t ? t.size : 0);
// what the game needs to put a pump on notch n
export const pumpRecord = (t, n) => (t.pump.kind === "f" ? { f: n } : { typed: n });

// ── trainin' ──
// how fast a toy d sizes bigger than your usual trains you (0: it doesn't)
export function rateOf(d, cruel) { if (!(d >= 1)) return 0; const r = d >= 3 ? 2 : d === 2 ? 1.5 : 1; return cruel ? r * 1.5 : r; }
// how it feels: 0 fits, 1 a good stretch, 2 aches, 3 hurts. painOk false: never past achin'
export function hurtOf(d, cruel, painOk) {
  let a = !(d >= 1) ? 0 : d === 1 ? 1 : d === 2 ? 2 : 3;
  if (cruel) a = Math.max(a, d >= 1 ? 3 : 2);
  return painOk === false ? Math.min(a, 2) : a;
}

// ── use ──
// what went in, by the game's own actions: kind, size, how much it trains (hours, at one size bigger)
const USE_ACT = { MasturbateHand: { kind: "fingers", size: 1, cr: 0.25 }, MasturbateTongue: { kind: "tongue", size: 1, cr: 0.1 }, MasturbateFist: { kind: "fist", size: 7, cr: 2.5 },
  PenetrateSlow: { kind: "cock", size: 3, cr: 1 }, PenetrateFast: { kind: "cock", size: 3, cr: 1.5, rough: true } };
const USE_ASSET = { Penis: 3, SmallDildo: 2, LargeDildo: 4, StraponPanties: 3, StrapOnSmooth: 3, StrapOnStuds: 3, Tentacles: 4, UnicornHorn: 3, DildocornHorn: 4, GrilledSausage: 2, DildoGag: 3 };
export function useOf(act, asset, text) {
  const U = USE_ACT[String(act || "")]; if (!U) return null;
  const o = Object.assign({}, U);
  if (/^Penetrate/.test(act)) {
    const a = String(asset || "");
    if (a && a !== "Penis") { o.kind = "toy"; o.size = USE_ASSET[a] || 3; o.toy = a; }
    o.size = Math.max(1, Math.min(20, o.size + sizeShift(text)));
    o.cock = !a || a === "Penis";
  }
  return o;
}

// ── goals ──
const SAY_TO = { "well used": 6, "wide-open": 8, "learning": 3, "practised": 5, "past gagging": 9, "past gaggin'": 9, "deep throated": 7, "deepthroat": 7 };
const NUM_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, ten: 10, fourteen: 14 };
const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
// the size a goal names, for this hole: a size's own word, or "size 7"
export function goalSize(hole, words) {
  const w = String(words || "").toLowerCase().trim(), S = HOLE_SIZES[hole]; if (!S) return 0;
  const m = /\b(?:size|level)\s*(\d{1,2})\b/.exec(w);
  if (m) return Math.max(S.start, Math.min(S.natural, Number(m[1])));
  const names = S.names.slice(0, S.natural).map((n, i) => [n, i + 1]).concat(Object.entries(SAY_TO)).sort((a, b) => b[0].length - a[0].length);
  for (const [n, lvl] of names) { if (new RegExp("(^|[^a-z])" + n.replace(/[.*+?^${}()|[\]\\']/g, (c) => (c === "'" ? "'?" : "\\" + c)) + "(?![a-z])").test(w)) return Math.max(S.start, Math.min(S.natural, lvl)); }
  return 0;
}
// how long it's got: "in 3 days", "in 12 hours", "in a week", "by friday", "by tomorrow" (ms from now, or 0)
export function goalDue(text, now) {
  const t = String(text || "").toLowerCase(); now = now || Date.now();
  let m = /\bin\s+(\d{1,3}|an?|one|two|three|four|five|six|seven|ten|fourteen)\s*(hours?|hrs?|h|days?|d|weeks?|wks?)\b/.exec(t);
  if (m) { const n = /^\d/.test(m[1]) ? Number(m[1]) : NUM_WORDS[m[1]] || 1, u = /^h/.test(m[2]) ? 3600000 : /^w/.test(m[2]) ? 7 * 86400000 : 86400000; return Math.max(3600000, Math.min(30 * 86400000, n * u)); }
  m = /\bby\s+(tomorrow|tonight|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/.exec(t);
  if (m) {
    const d = new Date(now); d.setHours(23, 59, 0, 0);
    if (m[1] === "tomorrow") d.setDate(d.getDate() + 1);
    else if (m[1] !== "tonight") { const want = DAYS.indexOf(m[1]); let add = (want - d.getDay() + 7) % 7; if (!add) add = 7; d.setDate(d.getDate() + add); }
    return Math.max(3600000, Math.min(30 * 86400000, d.getTime() - now));
  }
  return 0;
}
// a goal on a crafted trainer: { to, inMs } or null
export function goalIn(text, hole) {
  const t = String(text || "").toLowerCase();
  const m = /\b(?:goal|target|train(?:s|ed|ing|er)?(?:\s+(?:her|him|them|you|me|it|this\s+\w+))?\s+(?:to|till|until|up\s+to)|until|till|stretch(?:es|ed|ing)?(?:\s+(?:her|him|them|you|me|it))?\s+(?:to|till|until))\s*[:=-]?\s*(?:be\s+|is\s+|she'?s\s+|he'?s\s+|they'?re\s+|you'?re\s+)?([^.|;!,]{2,32})/.exec(t);
  if (!m) return null;
  const to = goalSize(hole, m[1]);
  return to ? { to, inMs: goalDue(t) } : null;
}
