/* WHAT'S IN THIS FILE (shared/noises.js)
   MOO JUICE: some of what you say comes out as the noise your animal makes. One copy, for the Farmhand Companion and The
   Farmhand's Dispensary (Nov 17: the Dispensary takes Moo Juice over, so it works off the farm too).
*/
import { speciesKeyOf } from "./species.js";

export const NOISES = { cow: ["moo", "mooo", "mrrrm"], bull: ["moo", "hrrmph"], pony: ["neigh", "nicker", "whinny"], horse: ["neigh", "whinny", "nicker"],
  pup: ["arf", "woof", "awoo"], dog: ["woof", "arf", "ruff"], kitty: ["mew", "nya", "mrrp"], cat: ["meow", "mrrp", "purr"], bunny: ["squeak", "eep"],
  rabbit: ["squeak", "eep"], pig: ["oink", "snrk"], goat: ["baa", "maa"], sheep: ["baa", "baaa"], fox: ["yip", "ack"], wolf: ["awoo", "grr"],
  deer: ["bleat", "mweh"], goblin: ["heh", "nngh"], rat: ["squeak", "eek", "chitter"], dragon: ["rawr", "grr", "hsss"], kitt: ["mew", "nya", "mrrp"] };
export const ANIMALS = Object.keys(NOISES).filter((k) => k !== "kitt");

// about half the words (share: 0 to 1) turn into your animal's noise
export function mooify(text, species, share) {
  const say = NOISES[String(species || "").toLowerCase()] || NOISES[speciesKeyOf(species)] || NOISES.cow;   // "catgirl", "ratslut" (shared/species.js)
  const keep = 1 - (typeof share === "number" ? Math.max(0, Math.min(1, share)) : 0.5);
  return String(text).replace(/[A-Za-z']{3,}/g, (w) => {
    if (Math.random() < keep) return w;
    const n = say[Math.floor(Math.random() * say.length)];
    return w[0] === w[0].toUpperCase() ? n[0].toUpperCase() + n.slice(1) : n;
  });
}
