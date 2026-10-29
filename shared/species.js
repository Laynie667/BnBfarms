/* WHAT'S IN THIS FILE (shared/species.js)
   One place that reads what somebody's species says and gives back the farm's own key for it, so the outfit, the
   contract's pet sounds and everything else agree (Laynie, Oct 26: "the cat outfit and cat sounds dont get applied to
   someone who chose kitty, need to maybe make sure the outfits and rules try to smart match"). Records say "kitty" out
   loud while the outfits were keyed "kitt", so a kitty fell through to a cow's moo and no outfit at all.
   speciesKeyOf("Kitty") → "kitt" · ("catgirl") → "kitt" · ("hucow slut") → "cow" · ("ratslut") → "rat" · ("dragon") → "dragon"
*/
// every word the farm knows, to its key. The keys are the farm's kinds (bot CFG.SPECIES)
const WORDS = {
  cow: "cow", cows: "cow", cattle: "cow", heifer: "cow", hucow: "cow", bovine: "cow", calf: "cow", dairy: "cow", moo: "cow", cowgirl: "cow",
  bull: "bull", ox: "bull", steer: "bull",
  pony: "pony", filly: "pony", foal: "pony", colt: "pony", ponygirl: "pony", ponyboy: "pony",
  horse: "horse", mare: "horse", stallion: "horse", equine: "horse",
  deer: "deer", doe: "deer", fawn: "deer", stag: "deer", reindeer: "deer",
  pig: "pig", piggy: "pig", piglet: "pig", sow: "pig", hog: "pig", swine: "pig", oink: "pig", boar: "pig",
  pup: "pup", puppy: "pup", pupper: "pup", pupgirl: "pup", pupboy: "pup",
  dog: "dog", doggy: "dog", doggie: "dog", hound: "dog", canine: "dog", bitch: "dog",
  kitt: "kitt", kitty: "kitt", kitten: "kitt", kittie: "kitt", kit: "kitt", kitteh: "kitt", neko: "kitt", catgirl: "kitt", catboy: "kitt",
  cat: "cat", feline: "cat", tomcat: "cat", pussycat: "kitt",
  goblin: "goblin", gob: "goblin", gobbo: "goblin",
  bunny: "bunny", bun: "bunny", bunbun: "bunny",
  rabbit: "rabbit", hare: "rabbit",
  fox: "fox", vixen: "fox", foxy: "fox", kitsune: "fox",
  wolf: "wolf", lupine: "wolf", wolfie: "wolf",
  goat: "goat", nanny: "goat", billy: "goat", kid: "goat",
  sheep: "sheep", lamb: "sheep", ewe: "sheep", ram: "sheep",
  dragon: "dragon", dragoness: "dragon", drake: "dragon", wyrm: "dragon", wyvern: "dragon", draconic: "dragon", drakeling: "dragon", kobold: "dragon", dragonborn: "dragon",
  rat: "rat", ratty: "rat", rattie: "rat", ratgirl: "rat", ratboy: "rat", ratslut: "rat", rodent: "rat", mouse: "rat", mousey: "rat", mice: "rat",
};
// the endings people put on an animal ("cowgirl", "ratslut", "puppies", "kittens")
const ENDINGS = /(girl|boy|gal|guy|kin|slut|sluts|whore|toy|pet|bimbo|s)$/;
const known = (w) => {
  if (WORDS[w]) return WORDS[w];
  const cut = w.replace(ENDINGS, "");
  if (cut !== w && cut.length > 1){ if (WORDS[cut]) return WORDS[cut]; const again = cut.replace(ENDINGS, ""); if (WORDS[again]) return WORDS[again]; }
  if (/ves$/.test(w) && WORDS[w.replace(/ves$/, "f")]) return WORDS[w.replace(/ves$/, "f")];
  return null;
};
// longest first, so "catgirl" is a cat before it's "cat"… and "hucowslut" still finds its cow
const INSIDE = Object.keys(WORDS).filter((w) => w.length >= 3).sort((a, b) => b.length - a.length);
export function speciesKeyOf(text) {
  const low = String(text || "").toLowerCase().replace(/[^a-z\s\/-]/g, " ").replace(/\s+/g, " ").trim();
  if (!low) return null;
  const whole = low.replace(/[\s\/-]+/g, "");
  if (known(whole)) return known(whole);
  const words = low.split(/[\s\/-]+/).filter(Boolean);
  for (const w of words) { const k = known(w); if (k) return k; }
  for (const w of words) { const hit = INSIDE.find((x) => w.startsWith(x) || w.endsWith(x)); if (hit) return WORDS[hit]; }   // ("scatter" is no cat)
  return null;
}
