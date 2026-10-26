/* WHAT'S IN THIS FILE (addons/_lib/connect.js)
   How an add-on script finds the farm bot on the page. The bot opens window.Farmhand once it has
   started; an add-on that loads first waits for the "farmhand:ready" signal.
*/
const W = (typeof unsafeWindow !== "undefined" && unsafeWindow) ? unsafeWindow : typeof window !== "undefined" ? window : globalThis;   // (globalThis: a test loadin' the scenes on their own)

export function connect(def) {
  let done = false;
  const go = () => {
    if (done || !W.Farmhand || !W.Farmhand.register) return;
    done = true;
    try { W.Farmhand.register(def); }
    catch (e) { console.warn("[Farmhand add-on " + def.name + "] couldn't plug in:", e); }
  };
  if (W.Farmhand && W.Farmhand.register) go();
  else {
    W.addEventListener("farmhand:ready", go);
    // belt and braces: check every second for a minute in case the signal was missed, then every 10 seconds
    // for as long as it takes (a bot that starts late, after a slow page load, still gets every add-on)
    let n = 0; const t = setInterval(() => { go(); if (done || ++n > 60) clearInterval(t); }, 1000);
    const slow = setInterval(() => { go(); if (done) clearInterval(slow); }, 10000);
  }
}

// pick one at random
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
// a whole number between lo and hi
export const between = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
// %name% → their name
export const fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));

// ── lines that fit the body, the gear and the species (bot 0.30.6 and on; older bots get plain picks) ──
// A line can say who it's for with a tag on the front, and the tag never shows:
//   {v} has a pussy · {nv} hasn't · {c} has a cock · {nc} hasn't · {t} has tits · {nt} flat
//   {f} female · {m} male · {fu} futa · {fb} femboy            (several tags: all must fit)
// An untagged line is checked by its words: one about a pussy or a womb is left out for somebody without one, the same
// for tits and udders on a flat chest, and "girl", "heifer" or "mare" for a male.
const TAG_ANY = /\{(?:nv|nc|nt|fu|fb|nb|ok|v|c|t|f|m)\}/g;
const TAG_LEAD = /^((?:\{(?:nv|nc|nt|fu|fb|nb|v|c|t|f|m)\})+)/;
const VULVA_W = /\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i;
const TITS_W = /\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i;
const GIRL_W = /\b(girl|heifer|mare|broodmare)\b/i;
export const untag = (t) => String(t == null ? "" : t).replace(TAG_ANY, "");
// what they've got: { g, vulva, cock, tits } (null if the bot is too old to say)
export const bodyOf = (api, mn) => { try { return api && api.body && mn ? api.body(mn) : null; } catch (e) { return null; } };
// what they're wearing: { gag, blind, collar, leash, bell, arms, paws, nipples, cage, plugBack, tail, ... } (all false if unknown)
export const gearOf = (api, mn) => { try { return (api && api.gear && mn && api.gear(mn)) || {}; } catch (e) { return {}; } };
export function fits(line, b) {
  const s = String(line), m = s.match(TAG_LEAD);
  if (!b) return !m;   // nobody's body known: only the lines written for anybody
  if (m) {
    for (const t of m[1].slice(1, -1).split("}{")) {
      if ((t === "v" && !b.vulva) || (t === "nv" && b.vulva) || (t === "c" && !b.cock) || (t === "nc" && b.cock) ||
          (t === "t" && !b.tits) || (t === "nt" && b.tits) || (t === "f" && b.g !== "female") || (t === "m" && b.g !== "male") ||
          (t === "fu" && b.g !== "futa") || (t === "fb" && b.g !== "femboy") || (t === "nb" && b.g !== "nonbinary")) return false;
    }
    return true;
  }
  if (!b.vulva && VULVA_W.test(s)) return false;
  if (!b.tits && TITS_W.test(s)) return false;
  if (b.g === "male" && GIRL_W.test(s)) return false;
  return true;
}
// the lines in a pool that suit this body (if none do, the ones written for anybody, then the lot)
export function fitting(list, b) {
  const ok = list.filter((l) => fits(l, b));
  if (ok.length) return ok;
  const plain = list.filter((l) => !TAG_LEAD.test(l));
  return plain.length ? plain : list;
}
// pick one that suits them, tag off
export const pickFit = (list, b) => untag(pick(fitting(list, b)));
// a line about somebody, picked and fitted for their body, marked so it can be told to anybody without bein' fitted again.
// With a key, the bot keeps track so the same line doesn't come round again too soon.
export function lineFor(api, mn, list, key) {
  if (!Array.isArray(list) || !list.length) return "";
  const b = bodyOf(api, mn);
  let t;
  try { t = key && api && api.pickFor && api.tags >= 2 ? untag(api.pickFor(mn, key, list)) : pickFit(list, b); } catch (e) { t = pickFit(list, b); }
  return api && api.fit && api.tags >= 2 ? api.fit(mn, t) : t;
}
// mark text that's already been fitted to somebody (joined pieces, a line about one person told to another)
export const fitted = (api, mn, t) => (api && api.fit && api.tags >= 2 ? api.fit(mn, untag(t)) : untag(t));

// ── species words, the same farm-wide ──────────────────────
// a: what they are (by their body: a cow, a bull), young: one and many, sound: a noise they make, call: the word for it
const ANIMALS = {
  cow:    { f: "cow", m: "bull", young: ["calf", "calves"], call: "moo", sound: ["a low moo", "a soft, needy moo", "a long, shaky moo"] },
  bull:   { f: "cow", m: "bull", young: ["calf", "calves"], call: "snort", sound: ["a deep snort", "a low bellow", "a rumbling snort"] },
  pony:   { f: "pony", m: "pony", young: ["foal", "foals"], call: "whinny", sound: ["a breathy whinny", "a soft nicker", "a shaky little whinny"] },
  horse:  { f: "mare", m: "stallion", young: ["foal", "foals"], call: "whinny", sound: ["a breathy whinny", "a low nicker", "a long, trembling whinny"] },
  deer:   { f: "doe", m: "buck", young: ["fawn", "fawns"], call: "bleat", sound: ["a thin, wavering bleat", "a soft bleat"] },
  pig:    { f: "sow", m: "boar", young: ["piglet", "piglets"], call: "oink", sound: ["a needy little oink", "a soft grunt", "a squealing gasp"] },
  pup:    { f: "pup", m: "pup", young: ["pup", "pups"], call: "woof", sound: ["a high, needy whine", "a soft whimper", "a breathless yip"] },
  dog:    { f: "bitch", m: "dog", young: ["pup", "pups"], call: "woof", sound: ["a needy whine", "a low whimper", "a shaky yip"] },
  kitt:   { f: "kitty", m: "kitty", young: ["kitten", "kittens"], call: "mew", sound: ["a needy mewl", "a soft, broken purr", "a breathy mew"] },
  cat:    { f: "cat", m: "tom", young: ["kitten", "kittens"], call: "mew", sound: ["a needy mewl", "a rumbling purr", "a breathy mew"] },
  goblin: { f: "goblin", m: "goblin", young: ["goblin brat", "goblin brats"], call: "cackle", sound: ["a ragged little cackle that turns into a moan", "a breathless giggle"] },
  bunny:  { f: "bunny", m: "bunny", young: ["kit", "kits"], call: "squeak", sound: ["a breathy squeak", "a soft little squeak", "a thump of one foot"] },
  rabbit: { f: "doe", m: "buck", young: ["kit", "kits"], call: "squeak", sound: ["a breathy squeak", "a soft little squeak", "a thump of one foot"] },
  fox:    { f: "vixen", m: "fox", young: ["kit", "kits"], call: "yip", sound: ["a high yip", "a breathy little whine", "a sharp, startled yip"] },
  wolf:   { f: "wolf", m: "wolf", young: ["pup", "pups"], call: "howl", sound: ["a low, wavering howl", "a needy whine", "a rumbling growl"] },
  goat:   { f: "nanny", m: "billy", young: ["kid", "kids"], call: "bleat", sound: ["a shaky bleat", "a soft bleat", "a loud, startled bleat"] },
  rat:    { f: "rat", m: "rat", young: ["pinkie", "pinkies"], call: "squeak", sound: ["a high, needy squeak", "a breathless little squeak", "a shaky chitter"] },
  sheep:  { f: "ewe", m: "ram", young: ["lamb", "lambs"], call: "baa", sound: ["a soft baa", "a trembling baa"] },
  default: { f: "animal", m: "animal", young: ["little one", "little ones"], call: "moan", sound: ["a soft moan", "a needy whimper", "a shaky gasp"] },
};
// a kind's closest cousin, for the line tables that only have one of a pair (a pup reads the dog's, a kitty the cat's)
const KIN = { bull: "cow", cow: "bull", pony: "horse", horse: "pony", pup: "dog", dog: "pup", wolf: "dog", fox: "dog", kitt: "cat", cat: "kitt",
              rabbit: "bunny", bunny: "rabbit", sheep: "goat", goat: "sheep" };
export function animalOf(api, mn) {
  let k = "default";
  try { k = (api && api.species && api.species(mn)) || "default"; } catch (e) {}
  const w = ANIMALS[k] || ANIMALS.default, b = bodyOf(api, mn), male = !!(b && (b.g === "male" || b.g === "femboy"));
  return { key: ANIMALS[k] ? k : "default", kin: KIN[k] || null, a: male ? w.m : w.f, young: w.young, call: w.call, sound: pick(w.sound), sounds: w.sound, male };
}
