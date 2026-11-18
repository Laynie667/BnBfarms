/* WHAT'S IN THIS FILE (shared/noises.js)
   MOO JUICE: some of what you say comes out as the noise your animal makes. One copy, for the Farmhand Companion and The
   Farmhand's Dispensary (Nov 17: the Dispensary takes Moo Juice over, so it works off the farm too).
*/
import { speciesKeyOf } from "./species.js";

export const NOISES = { cow: ["moo", "mooo", "mrrrm"], bull: ["moo", "hrrmph"], pony: ["neigh", "nicker", "whinny"], horse: ["neigh", "whinny", "nicker"],
  pup: ["arf", "woof", "awoo", "whine"], dog: ["woof", "arf", "ruff", "whine"], kitty: ["mew", "nya", "mrrp", "purr"], cat: ["meow", "mrrp", "purr"], bunny: ["squeak", "eep"],
  rabbit: ["squeak", "eep"], pig: ["oink", "snrk"], goat: ["baa", "maa"], sheep: ["baa", "baaa"], fox: ["yip", "ack"], wolf: ["awoo", "grr", "growl", "howl"],
  deer: ["bleat", "mweh"], goblin: ["heh", "nngh"], rat: ["squeak", "eek", "chitter"], dragon: ["rawr", "grr", "hsss", "rumble"], kitt: ["mew", "nya", "mrrp", "purr"] };
export const ANIMALS = Object.keys(NOISES).filter((k) => k !== "kitt");

const noisesOf = (species) => NOISES[String(species || "").toLowerCase()] || NOISES[speciesKeyOf(species)] || NOISES.cow;   // "catgirl", "ratslut" (shared/species.js)
// about half the words (share: 0 to 1) turn into your animal's noise
export function mooify(text, species, share) {
  const say = noisesOf(species);
  const keep = 1 - (typeof share === "number" ? Math.max(0, Math.min(1, share)) : 0.5);
  return String(text).replace(/[A-Za-z']{3,}/g, (w) => {
    if (Math.random() < keep) return w;
    const n = say[Math.floor(Math.random() * say.length)];
    return w[0] === w[0].toUpperCase() ? n[0].toUpperCase() + n.slice(1) : n;
  });
}

// THE ANIMAL TONGUE (Nov 18; Laynie: "Those suit just fine"): stronger, dose by dose. One dose, a noise slips in between
// words now and then; two, about half the words are noises; three or more, nothin' but.
export function tongueSpeak(text, species, x) {
  const say = noisesOf(species), n = () => say[Math.floor(Math.random() * say.length)];
  const cap = (w, v) => (/[A-Z]/.test(w[0]) ? v[0].toUpperCase() + v.slice(1) : v);
  x = Math.max(1, Math.round(Number(x) || 1));
  if (x >= 3) return String(text).replace(/[A-Za-z][A-Za-z']*/g, (w) => cap(w, n()));
  if (x === 2) return mooify(text, species, 0.5);
  const words = String(text).split(" "), out = [];
  words.forEach((w, i) => { out.push(w); if (i < words.length - 1 && Math.random() < 0.25) out.push("*" + n() + "*"); });
  if (out.length === words.length) out.splice(words.length > 1 ? 1 + Math.floor(Math.random() * (words.length - 1)) : 1, 0, "*" + n() + "*");
  return out.join(" ");
}
