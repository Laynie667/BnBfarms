/* WHAT'S IN THIS FILE (shared/seed.js)
   SEED AND THE BREEDER'S SEAL: the rules the Dispensary and the farm girl both read (Nov 19; Laynie: "Definitely the
   insemination and breeders seal, and I would love if the crafter can specify how much it deposits in which every hole,
   nipples, ass, pussy, or mouth in ml, l, or gallons").
   • SEED (the Dispensary's dose `seed`): a crafted needle, drink or bit of gear that says it carries seed ("Insemination",
     "Seed Syringe", "Cum Shot", "filled with my seed") puts a load of its CRAFTER'S seed in you. The game keeps the
     maker's number on every crafted item, so it's always theirs. How much, and where, is written on it plain:
       "500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples" · "fills her ass with half a gallon" · "1.5 litres in every hole"
     A hole with no amount gets a load (SEED_DEFAULT_ML); an amount with no hole goes where a needle goes (the pussy, or
     the ass without one), or down the throat from a drink or a kiss. "Every hole": pussy, ass and mouth, and the
     nipples too while they're open. "Both holes": pussy and ass.
   • THE BREEDER'S SEAL: crafted gear that says so ("Breeder's Seal", "Breeding Seal", "Sire's Seal", "Seed Lock",
     "Cum Stopper"). The hole it's worn in (its slot: pussy, ass, mouth, nipples; a belt seals both below) keeps every
     drop, opens only for its maker's seed, and while it's in, only its maker's loads can catch. Out it comes: a gush.
*/
import { loosen } from "./dose-words.js";

export const SEED_HOLES = ["vulva", "butt", "mouth", "nips"];
export const SEED_WORD = { vulva: "pussy", butt: "ass", mouth: "throat", nips: "nipples" };
export const SEED_DEFAULT_ML = 50;                       // a hole named with no amount: a good thick load
export const SEED_HOLE_MAX = 20000, SEED_TOTAL_MAX = 40000;   // 20 L a hole (a little over five gallons), 40 L a dose
export const GALLON_ML = 3785;                          // a US gallon
// the farm's own numbers (bot CFG.PROD), for your Dispensary's count off the farm
export const SEED_HALF_LIFE_H = { vulva: 12, butt: 6, mouth: 1, nips: 12 };   // what's held halves this often
export const GAPE_LEAK_X = 0.15;                        // each size looser than tight drains it 15% faster
export const BASE_CAP = 200;                            // a belly holds this much before it spills (shots stretch it)
export const NIP_CAP = 1000;                            // what your tits hold (twice that sealed or plugged)
export const SEED_GAP_MS = 10 * 60000;                  // the farm counts one load a sire every ten minutes

// THE SEAL'S WORDS (worn gear, not a dose: the farm girl reads it on you too)
export const SEAL_WORDS = loosen(/\b(breeder['’]?s seal|breeding seal|sire['’]?s seal|(?:seed|cum) (?:seal|lock|keeper|stopper))\b/);
// the holes a seal in this slot keeps
export function sealHolesOf(group) {
  const g = String(group || "");
  if (g === "ItemVulva" || g === "ItemVulvaPiercings") return ["vulva"];
  if (g === "ItemButt") return ["butt"];
  if (/^ItemMouth/.test(g)) return ["mouth"];
  if (/^ItemNipples/.test(g)) return ["nips"];
  if (g === "ItemPelvis") return ["vulva", "butt"];
  return [];
}
// the seals on somebody: [{ holes, by (its maker), name, key }]. textOf: that side's own crafted-text reader
export function sealsOn(appearance, textOf) {
  const out = [];
  for (const it of Array.isArray(appearance) ? appearance : []) {
    if (!it || !it.Craft || !it.Asset || !it.Asset.Group) continue;
    const by = Number(it.Craft.MemberNumber) || 0, holes = sealHolesOf(it.Asset.Group.Name);
    if (!by || !holes.length || !SEAL_WORDS.test(String(textOf(it) || ""))) continue;
    out.push({ holes, by, maker: String(it.Craft.MemberName || "").slice(0, 40), name:String(it.Craft.Name || it.Asset.Description || it.Asset.Name || "seal").slice(0, 40), key: it.Asset.Group.Name + ":" + (it.Craft.Name || "") });
  }
  return out;
}

// ── how much, and where ──
const WORDN = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const UNIT = "(ml|mls|millilit(?:er|re)s?|cc|l|ltrs?|lit(?:er|re)s?|gal|gals|gallons?)";
const NUM = "(\\d{1,3}(?:,\\d{3})+|\\d+(?:[.,]\\d+)?(?:\\s*\\/\\s*\\d+)?|half\\s+an?|an?\\s+half|(?:a\\s+)?quarter(?:\\s+of)?(?:\\s+an?)?|half|one|two|three|four|five|six|seven|eight|nine|ten|an?)";
const AMOUNT = new RegExp("(?<![a-z0-9.,/])" + NUM + "[\\s_-]*(?:full[\\s_-]+)?" + UNIT + "(?![a-z])", "g");
function valueOf(s) {
  s = String(s).trim().replace(/\s+/g, " ");
  let m = /^(\d+)\s*\/\s*(\d+)$/.exec(s); if (m) return Number(m[1]) / Math.max(1, Number(m[2]));
  if (/^\d{1,3}(,\d{3})+$/.test(s)) return Number(s.replace(/,/g, ""));
  if (/^\d/.test(s)) return Number(s.replace(",", "."));
  if (/half/.test(s)) return 0.5;
  if (/quarter/.test(s)) return 0.25;
  return WORDN[s] || 1;
}
const mlOf = (n, u) => n * (/^(ml|mls|cc|millilit)/.test(u) ? 1 : /^gal/.test(u) ? GALLON_ML : 1000);
export function amountsIn(text) {
  const out = [], t = String(text || "").toLowerCase();
  AMOUNT.lastIndex = 0;
  let m; while ((m = AMOUNT.exec(t))) { const ml = mlOf(valueOf(m[1]), m[2]); if (ml > 0) out.push({ ml: Math.min(SEED_HOLE_MAX, Math.round(ml)), at: m.index }); }
  return out;
}
const HOLE_FIND = [
  ["every", /\b(?:every|all|each)(?:[\s_-]+(?:of[\s_-]+)?(?:her|his|their|your|my|the|its|three|four))?[\s_-]+holes?\b/g],
  ["both", /\bboth(?:[\s_-]+(?:of[\s_-]+)?(?:her|his|their|your|my|the))?[\s_-]+holes\b/g],
  ["vulva", /\b(?:pussy|pussies|cunt|vulva|vagina\w*|womb|slit|cooch|twat|front[\s_-]?hole)\b/g],
  ["butt", /\b(?:ass|arse|asshole|butt|butthole|anus|anal|rear|bum|backdoor|bowels?|back[\s_-]?hole)\b/g],
  ["mouth", /\b(?:mouth|throat|oral|gullet|stomach)\b/g],
  ["nips", /\b(?:nipples?|nips|teats?|tits?|titties|breasts?|boobs?|udders?)\b/g],
];
export function holesIn(text) {
  const out = [], t = String(text || "").toLowerCase();
  for (const [k, re] of HOLE_FIND) { re.lastIndex = 0; let m; while ((m = re.exec(t))) out.push({ k, at: m.index }); }
  return out.sort((a, b) => a.at - b.at);
}
// a comma between two digits is a number's own ("1,5 l", "1,000 ml"); a full stop before a digit is a decimal point
const CLAUSE = /(?<!\d),|,(?!\d)|[;|\n]+|\.(?!\d)|\s(?:then|plus)\s/;
// { vulva, butt, mouth, nips, every, both, any }: mL, as the crafter wrote it ("any": wherever it goes by default)
export function seedAmounts(text) {
  const t = String(text || "").toLowerCase().replace(/_+/g, " "), out = {};
  const add = (k, v) => { out[k] = Math.min(SEED_HOLE_MAX, (out[k] || 0) + Math.max(0, Math.round(v))); };
  const orphanH = [], orphanA = [];
  for (const c of t.split(CLAUSE)) {
    if (!c || !c.trim()) continue;
    const A = amountsIn(c), H = holesIn(c);
    if (!H.length) { for (const a of A) orphanA.push(a.ml); continue; }
    if (!A.length) { for (const x of H) orphanH.push(x.k); continue; }
    if (A.length === 1) { for (const x of H) add(x.k, A[0].ml); continue; }
    if (A.length === H.length) { H.forEach((x, i) => add(x.k, A[i].ml)); continue; }
    for (const x of H) { let best = A[0], bd = Infinity; for (const a of A) { const d = Math.abs(a.at - x.at); if (d < bd) { bd = d; best = a; } } add(x.k, best.ml); }
  }
  if (orphanH.length) orphanH.forEach((k, i) => add(k, orphanA.length ? orphanA[Math.min(i, orphanA.length - 1)] : SEED_DEFAULT_ML));
  else if (orphanA.length && !Object.keys(out).length) add("any", orphanA.reduce((a, b) => a + b, 0));
  if (!Object.keys(out).length) add("any", SEED_DEFAULT_ML);
  return out;
}
// as a dose's part (a short string the dose plumbing carries): "vulva=500,butt=1000"
const KEYS = ["vulva", "butt", "mouth", "nips", "every", "both", "any"];
export const seedEncode = (a) => KEYS.filter((k) => a && a[k] > 0).map((k) => k + "=" + Math.round(a[k])).join(",");
export function seedDecode(p) {
  const out = {};
  for (const bit of String(p || "").split(",")) { const m = /^([a-z]+)=(\d{1,6})$/.exec(bit.trim()); if (m && KEYS.includes(m[1])) out[m[1]] = Math.min(SEED_HOLE_MAX, Number(m[2])); }
  return out;
}
// where it all goes, for this body: { vulva, butt, mouth, nips } in mL. have: the holes you've got (pussy or not) ·
// nipsOpen: your nipples are open · via: "sip" or "kiss" (down the throat by default), anythin' else a needle's way ·
// x: how many doses
export function seedPlan(a, o) {
  o = o || {};
  const pussy = !o.have || o.have.includes("vulva"), out = {}, x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
  const drunk = o.via === "sip" || o.via === "kiss";   // (a drink or a kiss only goes one way: down the throat)
  const put = (h, v) => { if (drunk) h = "mouth"; if (h === "vulva" && !pussy) h = "butt"; out[h] = (out[h] || 0) + v; };
  for (const [k, v] of Object.entries(a || {})) {
    if (!(v > 0)) continue;
    if ((k === "every" || k === "both") && drunk) put("mouth", v);
    else if (k === "every") { for (const h of ["vulva", "butt", "mouth"]) if (h !== "vulva" || pussy) put(h, v); if (o.nipsOpen) put("nips", v); }
    else if (k === "both") { if (pussy) put("vulva", v); put("butt", v); }
    else if (k === "any") put(o.via === "sip" || o.via === "kiss" ? "mouth" : o.hole && SEED_HOLES.includes(o.hole) ? o.hole : "vulva", v);
    else if (SEED_HOLES.includes(k)) put(k, v);
  }
  let total = 0;
  for (const h of Object.keys(out)) { out[h] = Math.min(SEED_HOLE_MAX, Math.round(out[h] * x)); total += out[h]; }
  if (total > SEED_TOTAL_MAX) for (const h of Object.keys(out)) out[h] = Math.round(out[h] * SEED_TOTAL_MAX / total);
  return out;
}
// an amount said plain: "40 mL", "1.5 L", "2 gallons"
export function amountSay(ml) {
  ml = Math.max(0, Number(ml) || 0);
  if (ml >= GALLON_ML * 0.95) { const g = Math.round(ml / GALLON_ML * 10) / 10; return (g === Math.round(g) ? String(Math.round(g)) : g.toFixed(1)) + (g === 1 ? " gallon" : " gallons"); }
  if (ml >= 1000) return (Math.round(ml / 100) / 10).toFixed(1).replace(/\.0$/, "") + " L";
  return Math.round(ml) + " mL";
}
// how big a load that is, in the farm's words (bot CFG.LOAD_WORDS, and bigger)
export function loadSay(ml) {
  return ml < 5 ? "a little dribble" : ml < 15 ? "a load" : ml < 40 ? "a thick load" : ml < 100 ? "a huge load" : ml < 300 ? "a gushin' flood" : ml < 1000 ? "a floodin' torrent" : ml < GALLON_ML ? "a bellyful" : "a flood fit to burst a body";
}
// how round a belly that much makes (the farm's own sum, 10y2-brood.js bellyStage): 0 flat to 4 huge
export function bellyFrom(held, cap) {
  const full = Math.max(0, Number(held) || 0) / Math.max(1, Number(cap) || BASE_CAP), w = full > 0.8 ? (full - 0.8) * 3 : 0;
  return w >= 8 ? 4 : w >= 4 ? 3 : w >= 2 ? 2 : w >= 0.8 ? 1 : 0;
}
