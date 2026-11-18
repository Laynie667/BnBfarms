/* WHAT'S IN THIS FILE (doses.js)
   THE DOSE BOOK, THE CLOCK, AND WHAT EACH DOSE DOES.
   A dose is words on a crafted item ("Denial Serum x2"). Givin' one adds its time; the clock counts it down, either
   only while you're online or in real time (with the penalty on top, config.js).
     step 1 (Nov 17)   Denial Serum, the Sedative (LSCG's own whenever LSCG is loaded)
     step 3 (Nov 17)   the shots and potions that work anywhere: Needy Nectar (LSCG's aphrodisiac when it's loaded),
                       Hair Trigger, Bitterroot, Moo Juice, Hiccup Fizz, Featherlight, Heat, the Purge, and Suggestible
                       (LSCG's only: without LSCG, the farm's obedience shot stays the farm's trance)
     more (Nov 17)     the ones Laynie picked ("I love it"): Let-Down, Fill-Out, the Airhead Elixir, Babble Brew, Deep
                       Throat Drops, Rut and Tender. Fill-Out and Tender read a part or a spot off the bottle ("Fill-Out
                       (belly)", "Tender Drops (ears)"); time-release capsules, cravings and the rest are in later.js;
                       tolerance is here (give).
   The farm's potions speak in the farm girl's own voice (shared/potion-voice.js), on the farm and off it alike.
   The new ones tell the Companion (a "farmhand-dispensary" event on the page): Let-Down's leaks land as milk on you,
   Fill-Out swells your drawn body.
*/
import { st, save } from "./store.js";
import { LINES, NOTES } from "./lines.js";
import { TOLERANCE_NOTE } from "./lines-more.js";
import "./lines-senses.js";
import { settle } from "./senses.js";
import { POTION_VOICE } from "../../shared/potion-voice.js";
import { local, action, fill, pick, inRoom, myName } from "./say.js";
import { lscgPresent, lscgShow, lscgDose } from "./lscg.js";

const W = window, MIN = 60000, CAP = 48 * 60 * MIN;

// voice: the farm's potion its lines come from · every: minutes between its moments · room: those moments for the room
// (otherwise just for you) · lscg: LSCG's own drug of that kind (whenever LSCG's loaded it's LSCG's) · soak: the words
// that read right before "-soaked" or "-laced" on LSCG's soaked gear · instant: done at once, no clock
export const BOOK = {
  denial: {
    label: "Denial Serum", icon: "🚫", mins: 120, color: "#b04a7a", farm: true,
    words: /\b(denial serum|edge serum|orgasm (?:block\w*|denial)|held at the edge)\b/,
    keywords: ["denial serum", "edge serum", "orgasm block"], soak: ["denial", "edging"],
    desc: "Held right at the edge: you can climb all you like, but you can't go over till it wears off. Two hours a dose.",
  },
  sedative: {
    label: "Sedative", icon: "💤", mins: 60, color: "#6d7fa8", farm: true, lscg: "sedative",
    words: /\b(sedat\w*|tranquili[sz]\w*|drowsy|sleepy serum)\b/,
    keywords: ["sedative", "tranquilizer"],
    desc: "Heavy, drowsy and slow: a sleepy face, slow feet, and eyes that keep wantin' to close. An hour a dose.",
  },
  needy: {
    label: "Needy Nectar", icon: "💗", mins: 30, color: "#e0607e", farm: true, lscg: "horny", voice: "needy", every: [4, 7],
    words: /\b(aphrodisiac|horny|lust serum|libido|needy nectar)\b/,
    keywords: ["needy nectar", "aphrodisiac", "lust serum"],
    desc: "Achin' and squirmin': your arousal creeps up and won't settle, and your face gives you away. Half an hour a dose.",
  },
  hairtrigger: {
    label: "Hair Trigger", icon: "⚡", mins: 60, color: "#e8b04a", farm: true, every: [6, 10],
    words: /\b(hair[- ]?trigger|sensiti[sz]er|oversensitiv\w*)\b/,
    keywords: ["hair trigger", "sensitizer"], soak: ["sensitizer", "sensitizing"],
    desc: "Every touch counts double: whatever anybody does to you works you up twice as fast. An hour a dose.",
  },
  bitterroot: {
    label: "Bitterroot", icon: "🌿", mins: 30, color: "#6f8f4a", farm: true, voice: "bitterroot", every: [5, 8],
    words: /\b(bitterroot|ruin(?:ing|ed)? (?:serum|draught|tonic|shot))\b/,
    keywords: ["bitterroot"], soak: ["bitterroot", "ruin"],
    desc: "Every orgasm slips away ruined: you go over, and get none of the relief. Half an hour a dose.",
  },
  moo: {
    label: "Moo Juice", icon: "🐄", mins: 20, color: "#c9a35b", farm: true, voice: "moo", every: [6, 10], room: true,
    words: /\b(moo (?:serum|shot|juice))\b/,
    keywords: ["moo juice", "moo serum"], soak: ["moo"],
    desc: "Your words keep comin' out as the noises your animal makes. Twenty minutes a dose.",
  },
  hiccup: {
    label: "Hiccup Fizz", icon: "🫧", mins: 15, color: "#7ec8e3", farm: true, voice: "hiccup", every: [1, 3], room: true,
    words: /\b(hiccup\w*)\b/,
    keywords: ["hiccup fizz"], soak: ["hiccup"],
    desc: "Hiccups. In every other sentence. At the worst possible moments. Fifteen minutes a dose.",
  },
  feather: {
    label: "Featherlight", icon: "🪶", mins: 15, color: "#d9c8f0", farm: true, voice: "feather", every: [2, 4], room: true,
    words: /\b(featherlight|tickl\w* (?:serum|draught|potion|shot))\b/,
    keywords: ["featherlight"], soak: ["tickle", "tickling"],
    desc: "Unbearably ticklish: giggles slip into everything you say. Fifteen minutes a dose.",
  },
  heat: {
    label: "Heat", icon: "🔥", mins: 60, color: "#e0703a", farm: true, voice: "heatmist", every: [4, 6], room: true,
    words: /\b(heat[- ]?inducer|heat mist|in heat serum)\b/,
    keywords: ["heat inducer", "heat mist"], soak: ["heat"],
    desc: "In heat: your arousal won't drop below a simmer, and everybody near can tell. On the farm, the farm keeps the heat itself. An hour a dose.",
  },
  suggestible: {
    label: "Suggestible", icon: "🌀", mins: 30, color: "#4cd964", farm: true, lscg: "suggestible", lscgOnly: true,
    words: /\b(obedien\w*|docile|compliance|suggest[ia]ble)\b/,
    keywords: ["obedience", "docile"],
    desc: "LSCG's Suggestible: the more of it in you, the more you want to do as you're told. Only with LSCG; without it, the farm's obedience shot is the farm's trance.",
  },
  // ── Nov 17, more (none of these is a farm shot: on the farm too, your Dispensary reads the needle) ──
  letdown: {
    label: "Let-Down", icon: "🍼", mins: 30, color: "#efe3c8", every: [4, 7], room: true,
    words: /\b(let[- ]?down (?:tonic|serum|shot|draught|drops?|potion)|leaky (?:tits|teats|udders?) (?:tonic|serum|shot))\b/,
    keywords: ["let-down tonic", "letdown serum"], soak: ["let-down", "leaky"],
    desc: "Your tits go heavy and leak: fresh wet spots bloom through your top every few minutes. With the Companion and its \"Farm can mark my body\" on, the milk shows on your chest for everybody with a Companion. Half an hour a dose.",
  },
  fillout: {
    label: "Fill-Out", icon: "🎈", mins: 30, color: "#f0a0b8", every: [6, 10], room: true,
    words: /\b(fill-out|fill[- ]?out (?:serum|shot|tonic|potion|drops?)|swell(?:ing)? (?:serum|shot|tonic|potion|drops?))\b/,
    keywords: ["fill-out", "swelling serum"], soak: ["swelling", "fill-out"],
    desc: "A swell that comes and goes: your tits a few cups bigger, or your belly round and full, for as long as it lasts, then it shrinks back. Say which on the bottle (Fill-Out (belly), Fill-Out (ass)); it's the cup if it doesn't say. The Companion's drawn body draws your tits and belly swollen for everybody with a Companion (a swollen ass gets its lines, not a picture, for now). Half an hour a dose.",
  },
  airhead: {
    label: "Airhead Elixir", icon: "🎀", mins: 20, color: "#ff9ccf", every: [6, 10], room: true,
    words: /\b((?:airhead|bimbo) (?:elixir|potion|serum|tonic|shot|juice|drops?))\b/,
    keywords: ["airhead elixir", "bimbo serum"], soak: ["airhead", "bimbo"],
    desc: "Everything you say comes out, like, totally airheaded: likes and ums, uptalk, giggles, and big words that just sort of float off. The stronger the dose, the emptier your head. Twenty minutes a dose.",
  },
  babble: {
    label: "Babble Brew", icon: "💬", mins: 20, color: "#c0508a", every: [6, 10], room: true,
    words: /\b(babble (?:brew|potion|tonic|shot|serum)|potty[- ]?mouth (?:potion|tonic|brew|serum))\b/,
    keywords: ["babble brew", "potty mouth potion"], soak: ["babble"],
    desc: "Filthy words keep slippin' out in the middle of what you say, and innocent ones come out wrong (the clock, the class, the bread...). The stronger the dose, the filthier your mouth. Twenty minutes a dose.",
  },
  deepthroat: {
    label: "Deep Throat Drops", icon: "👄", mins: 60, color: "#d06070", every: [8, 12],
    words: /\b(deep[- ]?throat (?:drops?|serum|spray|shot|tonic)|throat relax\w*|gag[- ]?reflex (?:blocker|drops?|serum))\b/,
    keywords: ["deep throat drops", "throat relaxer"], soak: ["deep throat"],
    desc: "No gag reflex: anything goes down easy, and whatever's done to your mouth counts double. On the farm, a dosed throat takes a load without gaggin', and the trainin' counts twice. An hour a dose.",
  },
  rut: {
    label: "Rut", icon: "🐂", mins: 60, color: "#a8432c", every: [5, 8], room: true,
    words: /\b(rut(?:ting)? (?:serum|shot|tonic|potion|musk|drops?)|in[- ]rut (?:serum|shot|tonic))\b/,
    keywords: ["rut serum", "rutting tonic"], soak: ["rut", "rutting"],
    desc: "In rut: hot, hungry and ready again almost as soon as you've finished. Your arousal never cools right off, and after you go over it bounces straight back up. On the farm, your loads come bigger and you don't run dry. An hour a dose.",
  },
  tender: {
    label: "Tender", icon: "🌸", mins: 30, color: "#f2a6b8", every: [6, 9],
    words: /\b(tender (?:drops?|serum|balm|oil|shot|tonic)|tenderi[sz]er)\b/,
    keywords: ["tender drops", "tenderizer"], soak: ["tender"],
    desc: "One spot goes sweetly tender: touches there count three times over. Say where on the bottle (Tender Drops (nipples)), or it's the spot you pick on this page. Half an hour a dose.",
  },
  // ── Nov 18: the farm girl's four voice potions, anywhere, from a crafted needle, drink or gear (her lines:
  // shared/potion-voice.js). Bought at her store on the farm, they're hers as ever: she says them herself (and Golden
  // Hour earns ribbons there) ──
  honey: {
    label: "Honey Tongue", icon: "🍯", mins: 45, color: "#e8b04a", farm: false, voice: "honey", every: [5, 9],
    words: /\bhoney[- ]tongue\b/,
    keywords: ["honey tongue"], soak: ["honey tongue"],
    desc: "Forty-five minutes of the farm girl's sweet, filthy praise in your ear, every few minutes. Only you hear it.",
  },
  golden: {
    label: "Golden Hour", icon: "✨", mins: 60, color: "#f0c040", farm: false, voice: "golden", every: [5, 8],
    words: /\bgolden[- ]hour\b/,
    keywords: ["golden hour"], soak: ["golden"],
    desc: "An hour of glowin' easy, and every time you cum you're doted on for it. On the farm it earns ribbons too.",
  },
  musk: {
    label: "Blue Ribbon Musk", icon: "💐", mins: 45, color: "#5a7fd0", farm: false, voice: "musk", every: [5, 9], room: true,
    words: /\b(blue[- ]ribbon[- ]musk|ribbon musk)\b/,
    keywords: ["blue ribbon musk"], soak: ["musk"],
    desc: "For 45 minutes everybody nearby keeps noticin' you, and the room hears about it now and then.",
  },
  echo: {
    label: "Echo Elixir", icon: "🗣️", mins: 20, color: "#a0d0e0", farm: false, voice: "echo",
    words: /\becho[- ]elixir\b/,
    keywords: ["echo elixir"], soak: ["echo"],
    desc: "Twice in twenty minutes, somethin' you said is repeated back to the room. Sweetly.",
  },
  // ── Nov 18: GROWTH OFF THE FARM (Laynie: "seems good"). The farm's own growth shots, anywhere: on the farm with
  // the farm girl in the room they're hers (her books); anywhere else your Dispensary keeps the size, and it stays.
  // Your cup shows on the Companion's drawn breasts; the rest is counted till they're drawn too. ──
  growcup: {
    label: "Udder Growth", icon: "🍈", mins: 0, color: "#f2b6c6", farm: true, instant: true, grow: "cup",
    words: /\b(udder|breast|tits?|boobs?|chest|cup) (growth|boost|enlarger)\b/,
    keywords: ["udder growth", "breast growth"],
    desc: "A cup bigger for every dose, and it stays. Your Companion's drawn breasts show it. A reducing serum takes one back off.",
  },
  growass: {
    label: "Ass Growth", icon: "🍑", mins: 0, color: "#f0a080", farm: true, instant: true, grow: "ass",
    words: /\b(ass|butt|booty|hips?) (growth|enlarger)\b/,
    keywords: ["ass growth"],
    desc: "A size rounder behind for every dose, and it stays (counted now; drawn when the drawn body learns hips).",
  },
  growcock: {
    label: "Cock Growth", icon: "🍆", mins: 0, color: "#c07090", farm: true, instant: true, grow: "cock",
    words: /\b(cock|penis|dick|shaft) (growth|enlarger)\b/,
    keywords: ["cock growth"],
    desc: "A size longer for every dose, and it stays (counted now; drawn with the drawn cock).",
  },
  growballs: {
    label: "Balls Growth", icon: "🥚", mins: 0, color: "#d8a0b0", farm: true, instant: true, grow: "balls",
    words: /\b(balls?|testes|testicles?|nuts) (growth|enlarger)\b/,
    keywords: ["balls growth"],
    desc: "A size heavier for every dose, and it stays (counted now; drawn with the drawn cock).",
  },
  reducing: {
    label: "Reducing Serum", icon: "🔻", mins: 0, color: "#90a0c0", farm: true, instant: true, grow: "less",
    words: /\b(reducing (?:serum|shot|tonic|potion|drops?)|(?:udder|breast|boob|tits?|ass|butt|balls?|testicle|testes|penis|cock|dick) (?:reducer|reducing))\b/,   // (not "shrinking": that's LSCG's, and it shrinks all of you)
    keywords: ["reducing serum"],
    desc: "Takes a size back off whatever the bottle names (Udder Reducer, Cock Reducer, Reducing Serum (ass)...; tits if it doesn't say).",
  },
  // ── Nov 18: poses and senses (senses.js) ──
  weakknees: {
    label: "Weak Knees", icon: "🦵", mins: 20, color: "#c9a0dc", every: [6, 10],
    words: /\b(weak[- ]?knees?|jelly[- ]?legs?|kneel(?:ing)? (?:serum|draught|shot|tonic|potion))\b/,
    keywords: ["weak knees", "jelly legs"], soak: ["weak knees"],
    desc: "Down on your knees, and you can't get up on your own: somebody has to help you up (the game's own \"with help\"). Twenty minutes a dose.",
  },
  allfours: {
    label: "Down Girl", icon: "🐾", mins: 20, color: "#a0785a", every: [6, 10],
    words: /\b(down[- ](?:girl|boy|pet) (?:serum|draught|shot|tonic|potion|drops?)|all[- ]fours (?:serum|draught|shot|tonic|potion|drops?))\b/,
    keywords: ["down girl serum", "all fours tonic"], soak: ["all fours"],
    desc: "Down on all fours, and you stay down there: gettin' up needs a hand. Twenty minutes a dose.",
  },
  blinder: {
    label: "Blinder Drops", icon: "🕶️", mins: 15, color: "#3a3550", every: [6, 10],
    words: /\b(blind(?:er|ing)? drops?|dim(?:ming)? drops?|darkness drops?)\b/,
    keywords: ["blinder drops", "dimming drops"], soak: ["blinding"],
    desc: "Your sight dims: the game's own blindness, darker with a stronger dose. Fifteen minutes a dose.",
  },
  cotton: {
    label: "Cotton Ears", icon: "🦻", mins: 15, color: "#e8e2d0", every: [6, 10],
    words: /\b(cotton[- ]?ears?|deaf(?:ening)? (?:drops?|serum|draught|tonic)|muffl\w* drops?)\b/,
    keywords: ["cotton ears", "deafening drops"], soak: ["deafening"],
    desc: "Everything muffled: the game's own deafness, deafer with a stronger dose. Fifteen minutes a dose.",
  },
  tunnel: {
    label: "Tunnel Vision", icon: "🔭", mins: 15, color: "#202030", every: [6, 10],
    words: /\b(tunnel[- ]?vision(?: (?:drops?|serum|draught|tonic))?|blinker (?:drops?|serum))\b/,
    keywords: ["tunnel vision", "blinker drops"], soak: ["tunnel vision"],
    desc: "Only a small circle in the middle of your screen; the rest is dark. It's the dose itself, so the screen-touches switch doesn't take it away. Fifteen minutes a dose.",
  },
  haze: {
    label: "Haze", icon: "🌫️", mins: 15, color: "#c8c0d8", every: [6, 10],
    words: /\b(haze (?:drops?|serum|potion|mist|tonic)|hazy (?:drops?|serum|potion)|daze (?:drops?|serum))\b/,
    keywords: ["haze drops", "haze mist"], soak: ["haze"],
    desc: "Everything soft and blurry: the game's picture goes hazy (not the chat). Fifteen minutes a dose.",
  },
  purge: {
    label: "Purge", icon: "🧼", mins: 0, color: "#9fc7c7", farm: true, instant: true,
    words: /\b(purge (?:serum|shot)|antidote|detox|cleanser)\b/,
    keywords: ["purge serum", "antidote"],
    desc: "Every dose in you flushed out at once (and LSCG's too, with its own antidote, when it's loaded).",
  },
};
export const doseIds = () => Object.keys(BOOK);

// "Denial Serum x2", "triple sedative": how many doses in one go (1 to 5), like the farm's shots
export function stackOf(text) {
  const t = String(text || "").toLowerCase(), m = /\bx\s?([2-5])\b|\b([2-5])\s?x\b/.exec(t);
  if (m) return Number(m[1] || m[2]);
  return /\btriple\b/.test(t) ? 3 : /\bdouble\b/.test(t) ? 2 : 1;
}
// TENDER's spots: the words on a bottle, the game's zones a touch there lands on, and what the lines call it
export const TENDER_SPOTS = {
  nipples: { word: "nipples", zones: ["ItemNipples", "ItemNipplesPiercings"], re: /\b(nipples?|teats?)\b/ },
  breasts: { word: "tits", zones: ["ItemBreast"], re: /\b(breasts?|tits?|titties|boobs?|chest|udders?)\b/ },
  clit: { word: "clit", zones: ["ItemVulvaPiercings"], re: /\bclit\w*\b/ },
  pussy: { word: "pussy", zones: ["ItemVulva"], re: /\b(pussy|cunt|slit|vulva|cooch)\b/ },
  ass: { word: "ass", zones: ["ItemButt"], re: /\b(ass|butt|bum|rear|asshole)\b/ },
  neck: { word: "neck", zones: ["ItemNeck"], re: /\b(neck|throat|nape)\b/ },
  ears: { word: "ears", zones: ["ItemEars"], re: /\bears?\b/ },
  mouth: { word: "lips", zones: ["ItemMouth"], re: /\b(lips?|mouth|tongue)\b/ },
  belly: { word: "belly", zones: ["ItemPelvis"], re: /\b(belly|tummy|stomach|navel)\b/ },
  thighs: { word: "thighs", zones: ["ItemLegs"], re: /\b(thighs?|legs?)\b/ },
  feet: { word: "feet", zones: ["ItemFeet", "ItemBoots"], re: /\b(feet|foot|toes?|soles?)\b/ },
};
export const TENDER_DEFAULT = "nipples";
// FILL-OUT's parts
const PART_RE = { belly: /\b(belly|tummy|stomach|womb)\b/, ass: /\b(ass|butt|bum|rear|hips?|booty)\b/ };
export function partFor(id, text) {
  const t = String(text || "").toLowerCase();
  if (id === "fillout") return PART_RE.belly.test(t) ? "belly" : PART_RE.ass.test(t) ? "ass" : "cup";
  if (id === "reducing") return /\b(cock|penis|dick|shaft)\b/.test(t) ? "cock" : /\b(balls?|testes|testicles?|nuts)\b/.test(t) ? "balls" : PART_RE.ass.test(t) ? "ass" : "cup";
  if (id === "tender") { for (const [k, s] of Object.entries(TENDER_SPOTS)) if (s.re.test(t.replace(BOOK.tender.words, " "))) return k; return ""; }
  return "";
}
export function dosesIn(text) {
  const t = String(text || "").toLowerCase(), x = stackOf(t);
  return doseIds().filter((id) => BOOK[id].words.test(t)).map((id) => { const p = partFor(id, t); return p ? { id, x, p } : { id, x }; });
}
// the part or spot a dose is on (Fill-Out: cup, belly or ass · Tender: the bottle's spot, or the one you picked)
export function partOf(id) {
  const d = st().doses[id];
  if (id === "fillout") return (d && d.p) || "cup";
  if (id === "tender") { const p = (d && d.p) || st().tenderSpot; return TENDER_SPOTS[p] ? p : TENDER_DEFAULT; }
  return "";
}
export const tenderZones = () => TENDER_SPOTS[partOf("tender")].zones;

// what it says: the farm girl's own lines for a farm potion, otherwise the Dispensary's (lines.js, lines-more.js)
const voiceOf = (id) => (BOOK[id] && BOOK[id].voice && POTION_VOICE[BOOK[id].voice]) || null;
const nameIn = (t) => String(t).replace(/%n/g, myName());
const poolOf = (id, p) => (id === "fillout" ? LINES["fillout_" + (p || partOf(id))] || LINES.fillout_cup : LINES[id]);
const spotIn = (t, id, p) => (id === "tender" ? String(t).replace(/%s/g, TENDER_SPOTS[TENDER_SPOTS[p] ? p : partOf(id)].word) : t);
const ours = (id, kind, p) => { const L = poolOf(id, p); return L && L[kind] && L[kind].length ? spotIn(fill(pick(L[kind])), id, p) : ""; };
export function takeLine(id) { const v = voiceOf(id); return v && v.seen.length ? nameIn(pick(v.seen)) : ours(id, "take"); }
function nowLine(id) { const v = voiceOf(id); return v && v.now.length ? nameIn(pick(v.now)) : ours(id, "now"); }
function offLine(id, p) { const v = voiceOf(id); return v && v.off.length ? nameIn(pick(v.off)) : ours(id, "off", p); }
// the Companion (and any other add-on) hears what's goin' on: { type: "dose", id, on } · { type: "leak", mess, areas, amount }
function tellPage(detail) { try { W.dispatchEvent(new W.CustomEvent("farmhand-dispensary", { detail })); } catch (e) { /* fine */ } }

const penaltyF = () => 1 + st().penalty / 100;
export function active(id) {
  const d = st().doses[id];
  return !!d && (typeof d.until === "number" ? d.until > Date.now() : d.left > 0);
}
// what's left: real time on the real clock, your online time on the online one
export function leftMs(id) {
  const d = st().doses[id];
  if (!d) return 0;
  return typeof d.until === "number" ? Math.max(0, d.until - Date.now()) : Math.max(0, d.left || 0);
}

// TOLERANCE (yours to switch on): the same dose again within three hours takes a fifth less for each one before it,
// down to two fifths. A breath through soaked gear toppin' a dose up doesn't count.
export const TOLERANCE_HOURS = 3;
const TOLERANCE_STEP = 0.2, TOLERANCE_FLOOR = 0.4;
export function toleranceOf(id, now) {
  const S = st();
  if (!S.tolerance) return 1;
  const recent = (S.taken[id] || []).filter((t) => (now || Date.now()) - t < TOLERANCE_HOURS * 3600000).length;
  return Math.max(TOLERANCE_FLOOR, 1 - TOLERANCE_STEP * recent);
}

// give a dose. o: { by, x, mins (instead of the book's time × x), line (the room's line instead of ours), quiet,
// upto (top it up to at least this much instead of addin': the same dose arriving twice by two roads),
// p (Fill-Out's part, Tender's spot) }
export function give(id, o) {
  o = o || {};
  const B = BOOK[id], S = st();
  if (!B) return { ok: false, why: "unknown" };
  if (S.off[id]) return { ok: false, why: "off" };
  if (B.instant) return B.grow ? grow(id, o) : purge(o);
  if (B.lscg && lscgPresent()) return { ok: false, why: "lscg" };   // LSCG's own: the callers route it there
  if (B.lscgOnly) return { ok: false, why: "nolscg" };               // (and without LSCG, nothing of ours)
  const now = Date.now(), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
  const tol = o.upto ? 1 : toleranceOf(id, now);
  const dur = Math.max(MIN, Math.min(CAP, (Number(o.mins) > 0 ? Number(o.mins) : B.mins * x) * MIN * tol));
  const was = active(id), d = S.doses[id], by = Number(o.by) || 0;
  const xNow = Math.max(x, was && d ? d.x || 1 : 1);
  const p = typeof o.p === "string" && o.p ? o.p : was && d && d.p ? d.p : "";
  if (S.clock === "real") {
    const add = dur * penaltyF(), base = was && typeof d.until === "number" ? d.until : now;
    S.doses[id] = { x: xNow, by, at: now, until: Math.min(now + CAP * penaltyF(), o.upto ? Math.max(base, now + add) : base + add) };
  } else {
    const base = was && typeof d.left === "number" ? d.left : 0;
    S.doses[id] = { x: xNow, by, at: now, left: Math.min(CAP, o.upto ? Math.max(base, dur) : base + dur) };
  }
  if (p) S.doses[id].p = p;
  // the record, for tolerance and cravings (the last 20 of each, three days back)
  if (!o.upto) S.taken[id] = (S.taken[id] || []).concat(now).filter((t) => now - t < 3 * 86400000).slice(-20);
  save();
  if (!was) start(id);
  if (!o.quiet) action(o.line || takeLine(id));
  if (tol < 1) local(fill(TOLERANCE_NOTE, { dose: B.label }).replace("%p", String(Math.round(tol * 100))));
  if (!was || (p && d && d.p !== p) || xNow !== (d && d.x)) tellPage({ type: "dose", id, on: true, x: xNow, p });
  try { lscgShow(id, by); } catch (e) { /* fine */ }
  return { ok: true };
}
// GROWTH: a size up (or, reducin', down) that stays. o.p: the part a reducing serum names
export const GROW_LIMITS = { cup: [-6, 10], ass: [-3, 6], cock: [-3, 6], balls: [-3, 6] };
function grow(id, o) {
  const B = BOOK[id], S = st(), g = S.grow || (S.grow = {}), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
  const part = B.grow === "less" ? (o.p && GROW_LIMITS[o.p] ? o.p : "cup") : B.grow, sign = B.grow === "less" ? -1 : 1;
  const [lo, hi] = GROW_LIMITS[part], was = g[part] || 0, now = Math.max(lo, Math.min(hi, was + sign * x));
  if (now === was) { if (!o.quiet) local(fill(NOTES.growMax, { dose: B.label })); return { ok: false, why: "max" }; }
  g[part] = now; save();
  if (!o.quiet) action(o.line || fill(pick(LINES.grow[sign > 0 ? part : "less"])).replace(/%p/g, ({ cup: "tits", ass: "ass", cock: "cock", balls: "balls" })[part]));
  tellPage({ type: "grow", part, n: now });
  return { ok: true, part, n: now };
}
export const grown = () => Object.assign({ cup: 0, ass: 0, cock: 0, balls: 0 }, st().grow || {});
// the Purge: everything out at once, ours and (with LSCG) LSCG's own through its antidote
function purge(o) {
  const n = clearAll("purge");
  let lscg = false; if (lscgPresent()) { try { lscg = lscgDose("antidote", { by: o.by }); } catch (e) { /* fine */ } }
  if (!o.quiet) action(o.line || fill("%t shudders as the purge hits, and every dose in them drains away, clean and cold."));
  return { ok: true, n, lscg };
}

// a dose ends: worn off ("done"), LSCG's antidote ("lscg"), a safeword ("safeword"), the Purge, or quietly ("quiet")
export function end(id, why) {
  const S = st();
  if (!S.doses[id]) return false;
  const p = S.doses[id].p || (id === "tender" ? partOf(id) : "");
  delete S.doses[id];
  save();
  stop(id);
  tellPage({ type: "dose", id, on: false });
  if (why === "done" || why === "lscg") { const l = offLine(id, p); if (l) local(l); }
  return true;
}
// everything out (the safeword, the Purge, a keyholder lettin' you out): time-release capsules waitin' in you too
export function clearAll(why) {
  let n = 0; for (const id of Object.keys(st().doses)) if (end(id, why)) n++;
  if (st().later && st().later.length) { n += st().later.length; st().later = []; save(); }
  // (Nov 18) parasites let go, and worn gear rests 15 minutes so it doesn't dose you straight back up (worn.js, parasites.js)
  if (st().para && Object.keys(st().para).length) { n += Object.keys(st().para).length; st().para = {}; }
  st().wornPause = Date.now() + 15 * MIN; save();
  return n;
}

// the clock, every few seconds. Online: only time you're here counts (a sleepin' laptop's gap doesn't).
let lastTick = 0, lastSave = 0;
export function tick() {
  const S = st(), now = Date.now(), gap = lastTick ? Math.max(0, Math.min(now - lastTick, 15000)) : 0;
  lastTick = now;
  for (const [id, d] of Object.entries(S.doses)) {
    if (!BOOK[id]) { delete S.doses[id]; continue; }
    if (typeof d.until !== "number") d.left = Math.max(0, (d.left || 0) - gap);
    if (!active(id)) end(id, "done");
    else feel(id, now);
  }
  if (now - lastSave > MIN) { lastSave = now; if (Object.keys(S.doses).length) save(); }
}

// switchin' the clock: what's left carries over, with the penalty added (or taken back off)
export function setClock(mode) {
  const S = st(), want = mode === "real" ? "real" : "online";
  if (S.clock === want) return;
  const now = Date.now(), f = penaltyF();
  for (const d of Object.values(S.doses)) {
    if (want === "real" && typeof d.until !== "number") { d.until = now + (d.left || 0) * f; delete d.left; }
    else if (want === "online" && typeof d.until === "number") { d.left = Math.max(0, d.until - now) / f; delete d.until; }
  }
  S.clock = want;
  save();
}

// ── what they do ───────────────────────────────────────────
const face = (group, expr, secs) => { try { if (typeof W.CharacterSetFacialExpression === "function" && W.Player) W.CharacterSetFacialExpression(W.Player, group, expr, secs); } catch (e) { /* fine */ } };
const meter = () => { const A = W.Player && W.Player.ArousalSettings; return A && A.Active !== "Inactive" && A.Active !== "NoMeter" ? A : null; };
function setArousal(v) {
  try { const A = meter(); if (!A) return; const n = Math.max(0, Math.min(100, Math.round(v))); if (typeof W.ActivitySetArousal === "function") W.ActivitySetArousal(W.Player, n); else A.Progress = n; } catch (e) { /* fine */ }
}
const xOf = (id) => (st().doses[id] && st().doses[id].x) || 1;
const felt = {};   // id → { face, next } (when its face was last set, when its next moment is)
const FLUSHED = ["needy", "heat", "rut", "letdown"];
export const xOfDose = (id) => (st().doses[id] && st().doses[id].x) || 1;
// Let-Down: a leak, for the Companion to draw (milk on the chest, a little more for a stronger dose)
const leak = () => tellPage({ type: "leak", mess: "milk", areas: ["chest"], amount: Math.min(2, 0.5 + 0.25 * xOf("letdown")) });
function start(id) {
  if (id === "sedative") face("Eyes", "Dazed", 180);
  if (FLUSHED.includes(id)) face("Blush", id === "letdown" ? "Low" : "Medium", 120);
  if (id === "airhead") face("Eyes", "Dazed", 120);
  if (id === "letdown") leak();
  if (id === "weakknees" || id === "allfours") setTimeout(settle, 300);   // (down you go)
}
function stop(id) {
  if ((id === "sedative" && !active("airhead")) || (id === "airhead" && !active("sedative"))) face("Eyes", null);
  if (FLUSHED.includes(id) && !FLUSHED.some(active)) face("Blush", null);
  delete felt[id];
}
// a dose's next moment, now (for the tests)
export function moment(id) { tick(); if (felt[id]) felt[id].next = 0; tick(); }
function feel(id, now) {
  const B = BOOK[id];
  const f = felt[id] || (felt[id] = { face: now, next: now + ((B.every ? B.every[0] : 3) + Math.random() * 2) * MIN });
  // what it does to you
  if (id === "sedative" && now - f.face > 2 * MIN) { f.face = now; face("Eyes", "Dazed", 180); }
  if (id === "needy") {   // creepin' up, and it won't settle (up to 70, more for a stronger dose)
    const A = meter(), cap = Math.min(92, 60 + 10 * xOf(id));
    if (A && (Number(A.Progress) || 0) < cap) setArousal((Number(A.Progress) || 0) + 2);
    if (now - f.face > 2 * MIN) { f.face = now; face("Blush", "Medium", 120); }
  }
  if (id === "heat") {    // a simmer it won't drop below
    const A = meter(), floor = Math.min(70, 25 + 15 * xOf(id));
    if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
    if (now - f.face > 2 * MIN) { f.face = now; face("Blush", "Medium", 120); }
  }
  if (id === "rut") {     // never cools right off (and bounces back after: initDoses)
    const A = meter(), floor = Math.min(60, 20 + 10 * xOf(id));
    if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
    if (now - f.face > 2 * MIN) { f.face = now; face("Blush", "Medium", 120); }
  }
  if (id === "airhead" && now - f.face > 2 * MIN) { f.face = now; face("Eyes", "Dazed", 120); }
  // its moments, now and then: for the room, or just for you
  if (B.every && now >= f.next && inRoom()) {
    f.next = now + (B.every[0] + Math.random() * (B.every[1] - B.every[0])) * MIN;
    const l = nowLine(id);
    if (l) { if (B.room) action(l); else local(id === "honey" ? "🍯 The farm girl leans in close to your ear: " + l : id === "golden" ? "✨ " + l : l); }
    if (id === "letdown") leak();
  } else if (!B.every && id === "sedative" && now >= f.next && inRoom()) {
    f.next = now + (8 + Math.random() * 6) * MIN; local(pick(LINES.sedative.drift));
  }
}

let heldTold = 0;
// a note only you see, from a dose's own pool (Deep Throat's "used", Tender's "touched", Rut's "again"), not too often
const toldAt = {};
function feltOnce(id, kind, gap) {
  const now = Date.now(), k = id + ":" + kind;
  if (now - (toldAt[k] || 0) < gap) return;
  toldAt[k] = now;
  const l = ours(id, kind); if (l) local(l);
}
export function initDoses(mod) {
  // Denial Serum: held at the edge instead of goin' over
  try {
    mod.hookFunction("ActivityOrgasmPrepare", 6, (args, next) => {
      try {
        const C = args[0];
        if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("denial")) {
          if (C.ArousalSettings) C.ArousalSettings.Progress = 94;
          face("Blush", "High", 20);
          if (Date.now() - heldTold > MIN) { heldTold = Date.now(); local(pick(LINES.denial.held)); }
          return undefined;
        }
      } catch (e) { /* the game's own way, then */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] Denial Serum can't hold you:", e); }
  // Bitterroot: you go over, and it's ruined (the game's own ruined orgasm)
  try {
    mod.hookFunction("ActivityOrgasmStart", 6, (args, next) => {
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("bitterroot")) W.ActivityOrgasmRuined = true; } catch (e) { /* fine */ }
      // Golden Hour: you're doted on for it, every time (off the farm; on it the farm girl does it herself)
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("golden") && !W.ActivityOrgasmRuined) setTimeout(() => local(pick(LINES.goldenDote)), 2500); } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] Bitterroot can't ruin you:", e); }
  // Hair Trigger: every touch on you counts double · Deep Throat Drops: your mouth counts double · Tender: its spot
  // counts triple (they stack)
  try {
    mod.hookFunction("ActivitySetArousalTimer", 6, (args, next) => {
      try {
        const C = args[0], zone = String(args[2] || "");
        if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && Number(args[3]) > 0) {
          let f = 1;
          if (active("hairtrigger")) f *= 2;
          if (active("deepthroat") && /^ItemMouth/.test(zone)) { f *= 2; feltOnce("deepthroat", "used", 90000); }
          if (active("tender") && tenderZones().includes(zone)) { f *= 3; feltOnce("tender", "touched", 120000); }
          if (f > 1) args[3] = Number(args[3]) * f;
        }
      } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] Hair Trigger can't reach you:", e); }
  // Rut: you go over, and you're straight back up
  try {
    mod.hookFunction("ActivityOrgasmStop", 6, (args, next) => {
      try {
        const C = args[0];
        if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("rut")) {
          const back = Math.min(80, 40 + 8 * xOf("rut"));
          if ((Number(args[1]) || 0) < back) { args = [args[0], back].concat(args.slice(2)); feltOnce("rut", "again", MIN); }
        }
      } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] Rut can't keep you goin':", e); }
  // the Sedative (ours): every step on a map takes longer
  try {
    mod.hookFunction("ChatRoomMapViewCanEnterTile", 1, (args, next) => {
      const t = next(args);
      try { return t > 0 && active("sedative") ? t * 1.6 : t; } catch (e) { return t; }
    });
  } catch (e) { console.warn("[Dispensary] the Sedative can't slow you:", e); }
}
