/* WHAT'S IN THIS FILE (shared/farm-outfits.js)
   The farm's own starter outfits, one for every species and gender. A proprietor's own saved outfit for a slot always
   wins (?outfit save); these fill every slot nobody has dressed yet. outfitPieces(species, gender) →
   [{ Group, Name, Color, Property, locked, opt }] · OUTFIT_SPECIES · OUTFIT_GENDERS · outfitOpts()

   What Laynie asked for, Oct 22-23, in order: restraints and fetish gear (cows and pups in pet crawlers); no chains to
   the floor (they pin somebody to a tile); pony mittens for ponies, deer and goats; padded petsuits for cows, kitties
   and pups, pet legs for goats; restraints set the way they're meant to be; no chastity on women or futas ("they deserve
   unrestricted breeding") but on males, femboys and nonbinary; every hole still usable (O-ring and bit gags, tails on
   straps); pastel sissy colours and goth mommy ones with rustic accents; and the clothes sexy and flattering.

   HOW IT'S BUILT. Every piece here was picked from the game's own wardrobe laid out side by side in the studio
   (scratch-previews/gal-*.png), on the body it's for: bras don't draw on a flat chest at all, so flat bodies get a
   babydoll, a harness or skin; pale colours draw almost white, so the pastels are mixed a step deeper than they look.
   Two looks:
     pastel sissy (cows, kitties, bunnies, goats, deer): lace open-cup lingerie and crotchless panties, fluffy
       thigh-high socks tied with bows, pumps
     goth mommy (ponies, pups, foxes, goblins): an underbust latex corset with suspenders, a harness bra, crotchless
       latex panties, seamed stockings, stilettos, opera gloves
   every femboy is sissy, whatever the species: a frilly maid bikini, a ribbon cincher, a pleated skirt, bow socks, ribbons.
   Rustic accents run through both: cognac leather, aged brass, rope. Then each species' tack over the top.
*/
import { OUTFIT_PROPS } from "./farm-outfit-props.js";
export { outfitName, outfitDesc } from "./farm-outfit-names.js";
export const OUTFIT_GENDERS = ["female", "male", "futa", "femboy", "nonbinary"];
const L = true;   // (locked: the farm puts its own padlock on, keyed to staff)

// the colours, as the game draws them (a pastel has to be mixed deeper than it should look)
const C = {
  pink: "#E67FA3", pinkpig: "#EFA3B6", rose: "#D9638E", lav: "#9370C8", lilac: "#AE8FD6", mint: "#7CC4A6", blue: "#6FA3D9", peach: "#E8A07A", cream: "#F2E6D0",
  black: "#161214", wine: "#6E1F33", plum: "#4A2850", silver: "#B8B8C0",
  brass: "#A8843A", cognac: "#8C4A22", rope: "#C8A26A", hoof: "#3A2A1E",
};

// what each body wears under the tack, by look. "$a" the species' main colour, "$b" its second, "$leg" its legwear
const WEAR = {
  pastel: {
    female:    [["Bra", "OuvertPerl1", "$a"], ["Panties", "CrotchPanties1", "$a"], ["Socks", "Socks6", "$leg"], ["Garters", "SocksBow", "$b"],
                ["Shoes", "PumpHighHeels", "$a"], ["ItemNipples", "BellClamps", "Default"]],
    futa:      [["Bra", "OuvertPerl1", "$a"], ["Panties", "CrotchPanties1", "$a"], ["Socks", "Socks6", "$leg"], ["Garters", "SocksBow", "$b"],
                ["Shoes", "PumpHighHeels", "$a"], ["ItemNipples", "BellClamps", "Default"]],
    nonbinary: [["Bra", "CorsetBikini1", "$a"], ["Panties", "CrotchPanties1", "$a"], ["Socks", "Socks6", "$leg"], ["Garters", "SocksBow", "$b"],
                ["Shoes", "MaryJaneShoes", "$a"], ["ItemNipples", "ChainClamp", "Default"]],
    male:      [["Panties", "Jockstrap", "$a"], ["ItemTorso", "LeatherChestHarness1", C.cognac], ["Socks", "Socks6", "$leg"], ["Garters", "SocksBow", "$b"],
                ["Shoes", "MaryJaneShoes", "$a"]],
  },
  goth: {
    female:    [["Corset", "LatexCorset1", "$a"], ["Bra", "StarHarnessBra", "$a"], ["Panties", "LatexCrotchlessPanties", "$a"], ["Socks", "SilkStockings3", "$leg"],
                ["Shoes", "StilettoHeels", "$a"], ["Gloves", "LatexElbowGloves", "$a"], ["ItemNipples", "BellClamps", "Default"]],
    futa:      [["Corset", "LatexCorset1", "$a"], ["Bra", "StarHarnessBra", "$a"], ["Panties", "LatexCrotchlessPanties", "$a"], ["Socks", "SilkStockings3", "$leg"],
                ["Shoes", "StilettoHeels", "$a"], ["Gloves", "LatexElbowGloves", "$a"], ["ItemNipples", "BellClamps", "Default"]],
    nonbinary: [["Corset", "ClassicLatexCorset", "$a"], ["Bra", "LatexBra1", "$b"], ["Panties", "LatexCrotchlessPanties", "$a"], ["Socks", "LatexSocks1", "$a"],
                ["Shoes", "StilettoHeels", "$a"], ["ItemNipples", "ChainClamp", "Default"]],
    male:      [["Panties", "Jockstrap", "$a"], ["ItemTorso", "LeatherChestHarness1", "$a"], ["Garters", "HipHarness", "$b"], ["Socks", "LongFishnets", "$a"],
                ["Shoes", "ThighBoots", "$a"], ["Gloves", "LatexElbowGloves", "$a"]],
  },
};
// every femboy is sissy, whatever the species
// (a frilly maid bikini, a ribbon waist cincher and a short pleated skirt; a babydoll was tried first, but the game only
// ever draws it black)
const FEMBOY = [["Cloth", "MaidBikini", C.pink], ["Corset", "RibbonCorset", C.pink], ["ClothLower", "TulleSkirt", C.pink], ["Panties", "Bikini1", C.pink],
  ["Socks", "Socks6", C.pink], ["Garters", "SocksBow", C.cream], ["Shoes", "MaryJaneShoes", C.pink], ["HairAccessory3", "Ribbons1", C.pink],
  ["ItemNipples", "NippleClamps1", "Default"]];
// Chastity (Laynie, Oct 22: "I wouldn't place chastity items on futanari or females but definitely on males, femboy, and
// non binary options. Futanari and women are hot and deserve unrestricted breeding"): a locked cage for a cock, a locked
// belt for a nonbinary body, put on after the tack so nothing takes its place. Women and futas go free for breedin'.
const CHASTITY = {
  male:      [["ItemVulva", "FlatChastityCage", "$a", L]],
  femboy:    [["ItemVulva", "PlasticChastityCage1", C.pink, L]],
  nonbinary: [["ItemPelvis", "SleekLeatherChastityBelt", "$a", L]],
};
// petsuit colours, layer by layer (the game's order): arms Base,Gloss,LacingBack,Lacing,LacingTrim,Pad,Paws,Straps,Buckles ·
// legs Base,Gloss,LacingBack,Lacing,LacingTrim,Straps,Pad,Paws,Buckles
const petsuit = (base, lace, trim, pad, paws, straps, buckle) => ({
  arms: [base, "Default", lace, lace, trim, pad, paws, straps, buckle], legs: [base, "Default", lace, lace, trim, straps, pad, paws, buckle] });
const COW_SUIT = petsuit(C.cream, C.pink, C.cognac, C.pink, C.cream, C.cognac, C.brass);
const KIT_SUIT = petsuit(C.lilac, C.cream, C.lav, C.pink, C.cream, C.cognac, C.brass);
const PUP_SUIT = petsuit(C.black, C.wine, C.plum, C.wine, C.black, C.black, C.silver);
const FOX_SUIT = petsuit(C.black, C.cognac, C.wine, C.cream, C.cream, C.cognac, C.brass);   // (black with rust lacing and cream paws, like the tails)
const PIG_SUIT = petsuit(C.pinkpig, C.rose, C.cognac, C.rose, C.hoof, C.cognac, C.brass);   // (dark trotters)
const GOAT_LEGS = petsuit(C.blue, C.cream, C.cognac, C.cream, C.hoof, C.cognac, C.brass).legs;
// pony mitten binders, layer by layer: Mittens,Horseshoes,Cuffs,Rings,Lock and the same again on the binder, its harness
// and its chain. Chained: the mittens strapped together behind the back
const mitts = (mitt, shoe, cuff, ring) => [mitt, shoe, cuff, ring, "Default", mitt, shoe, cuff, ring, cuff, ring, "Default", "Default"];

// each species: its look, its colours and its tack. pieces: [Group, Name, Color, locked, opt]. tits/pussy/cock/flat:
// only for a body with (or, flat, without) them. No chains to the floor or the wall. Open-mouth gags only.
const KIT = {
  cow: { label: "Cow", look: "pastel", pal: { a: C.pink, b: C.cream, leg: C.pink },
    pieces: [["HairAccessory2", "CowEars", "Default"], ["HairAccessory1", "CowHorns", C.cream], ["TailStraps", "CowtailStrap", "Default"],
      ["ItemNeck", "LeatherCollar", C.cognac, L], ["ItemNeckAccessories", "CollarCowBell", "Default"], ["ItemNose", "NoseRing", C.brass],
      ["ItemNeckRestraints", "CollarLeash", [C.pink, C.cognac, C.brass]], ["ItemMouth", "RingGag", C.pink],
      ["ItemArms", "PawPaddedPetsuitArms", COW_SUIT.arms, false, "Padding"], ["ItemLegs", "PawPaddedPetsuitLegs", COW_SUIT.legs, false, "Padding"]],
    tits: [["Bra", "CowPrintedBra", "Default"], ["ItemNipples", "LactationPump", "Default", false, "MediumSuction"]],
    pussy: [["Panties", "CowPrintedPanties", "Default"]] },
  kitt: { label: "Kitty", look: "pastel", pal: { a: C.lav, b: C.pink, leg: C.lilac },
    pieces: [["HairAccessory2", "KittenEars2", C.lav], ["TailStraps", "KittenTailStrap1", "#7650B5"]   /* (drawn paler than the ears: mixed deeper to match) */, ["ItemNeck", "LeatherCollarBell", C.pink, L],
      ["ItemNeckRestraints", "CollarLeash", [C.pink, C.cognac, C.brass]], ["ItemMouth", "RingGag", C.pink],
      ["ItemArms", "PawPaddedPetsuitArms", KIT_SUIT.arms, false, "Padding"], ["ItemLegs", "PawPaddedPetsuitLegs", KIT_SUIT.legs, false, "Padding"]] },
  bunny: { label: "Bunny", look: "pastel", pal: { a: C.pink, b: C.cream, leg: C.pink },
    pieces: [["HairAccessory2", "BunnyEars1", C.cream], ["TailStraps", "BunnyTailStrap", C.cream], ["ItemNeck", "LeatherCollarBow", C.pink, L],
      ["ClothAccessory", "BunnyCollarCuffs", "Default"], ["Shoes", "Heels1", C.pink],   /* (thigh-high stockings with bows, not fishnets: Laynie, Oct 23) */
      ["ItemArms", "LeatherCuffs", [C.pink, C.brass], L, "Both"], ["ItemFeet", "LeatherAnkleCuffs", [C.brass, C.pink, C.brass], false, "Chained"],
      ["ItemNeckRestraints", "CollarLeash", [C.pink, C.cognac, C.brass]], ["ItemMouth", "RingGag", C.pink]],
    tits: [["Cloth", "TransparentBunnyGirl", C.pink]], noBow: true },
  goat: { label: "Goat", look: "pastel", pal: { a: C.blue, b: C.cream, leg: C.blue },
    pieces: [["HairAccessory1", "Horns2", C.cream], ["HairAccessory2", "Ears2", C.cream], ["TailStraps", "BunnyTailStrap", C.cream],
      ["ItemNeck", "LeatherCollar", C.cognac, L], ["ItemNeckAccessories", "CollarBell", C.brass], ["ItemNose", "NoseRing", C.brass],
      ["ItemMouth", "BitGag", [C.cream, C.cognac]], ["ItemHands", "PonyMittensBinder", mitts(C.cream, C.hoof, C.cognac, C.brass), L, "Chained"],
      ["ItemLegs", "PawPaddedPetsuitLegs", GOAT_LEGS, false, "Padding"]] },
  deer: { label: "Deer", look: "pastel", pal: { a: C.peach, b: C.mint, leg: C.peach },
    pieces: [["Hat", "ReindeerBand", "Default"], ["HairAccessory2", "Ears2", C.peach], ["TailStraps", "BunnyTailStrap", C.cream],
      ["ItemNeck", "LeatherCollar", C.cognac, L], ["ItemNeckAccessories", "CollarBell", C.brass], ["ItemTorso", "HempRopeHarness", C.rope],
      ["ItemLegs", "HempRope", C.rope, false, "Crossed"], ["ItemHands", "PonyMittensBinder", mitts(C.peach, C.hoof, C.cognac, C.brass), L, "Chained"],
      ["ItemMouth", "BitGag", [C.cream, C.cognac]], ["Shoes", "HeellessHoof", C.hoof]], noBow: true },
  pony: { label: "Pony", look: "goth", pal: { a: C.black, b: C.wine, leg: C.black },
    pieces: [["HairAccessory2", "PonyEars1", C.black], ["TailStraps", "HorseTailStrap", C.black], ["ItemNeck", "PostureCollar", C.black, L],
      ["ItemMouth", "HarnessPonyBits", [C.brass, C.cognac, C.brass], false, "Attached"], ["ItemTorso", "LeatherHarness", C.cognac],
      ["ItemHands", "PonyMittensBinder", mitts(C.black, C.brass, C.wine, C.brass), L, "Chained"], ["ItemBoots", "PonyBoots", C.black],
      ["ItemFeet", "LeatherAnkleCuffs", [C.brass, C.wine, C.brass], false, "Chained"], ["ItemNeckRestraints", "CollarLeash", [C.cognac, C.black, C.brass]]] },
  pup: { label: "Pup", look: "goth", pal: { a: C.black, b: C.wine, leg: C.black },
    pieces: [["HairAccessory2", "PuppyEars1", C.black], ["TailStraps", "PuppyTailStrap", C.black], ["ItemNeck", "DogCollar", C.wine, L],
      ["ItemNeckAccessories", "CollarPupBone", "Default"], ["ItemNeckRestraints", "CollarLeash", [C.wine, C.cognac, C.brass]], ["ItemMouth", "RingGag", C.wine],
      ["ItemArms", "PawPaddedPetsuitArms", PUP_SUIT.arms, false, "Padding"], ["ItemLegs", "PawPaddedPetsuitLegs", PUP_SUIT.legs, false, "Padding"]] },
  fox: { label: "Fox", look: "goth", pal: { a: C.black, b: C.wine, leg: C.black },
    pieces: [["HairAccessory2", "FoxEars1", C.cognac], ["TailStraps", "FoxTailsStrap", [C.cream, C.cognac]], ["ItemNeck", "LeatherCollar", C.wine, L],
      ["ItemNeckRestraints", "CollarLeash", [C.wine, C.black, C.brass]], ["ItemMouth", "RingGag", C.wine],
      ["ItemArms", "PawPaddedPetsuitArms", FOX_SUIT.arms, false, "Padding"], ["ItemLegs", "PawPaddedPetsuitLegs", FOX_SUIT.legs, false, "Padding"]] },   // (Laynie, Oct 23: pet arms and legs for foxes too)
  // pigs (Laynie, Oct 23: "also need pig outfits too"): a sow on all fours in a pink petsuit with dark trotters, the
  // snout hooked up, floppy ears (the game has no curly tail: a spade or a cat's looked wrong, so none), a livestock tag on a locked collar, a rope harness for haulin' by
  pig: { label: "Pig", look: "pastel", pal: { a: C.rose, b: C.cream, leg: C.rose },
    pieces: [["HairAccessory2", "PuppyEars2", C.pinkpig], ["ItemNose", "PigNoseHook", [C.cognac, C.brass]],
      ["ItemNeck", "LeatherCollar", C.cognac, L], ["ItemNeckAccessories", "CollarBell", C.brass],
      ["ItemNeckRestraints", "CollarLeash", [C.rose, C.cognac, C.brass]], ["ItemMouth", "RingGag", C.rose], ["ItemTorso", "HempRopeHarness", C.rope],
      ["ItemArms", "PawPaddedPetsuitArms", PIG_SUIT.arms, false, "Padding"], ["ItemLegs", "PawPaddedPetsuitLegs", PIG_SUIT.legs, false, "Padding"]] },
  // goblins (Laynie, Oct 23: "I did love the rags on the goblins. maybe give the goblins frog cuffs and the long mittens
  // without the back cuffs"): rags, frog-tied on their knees, long mittens on and nothing at the back, barefoot
  goblin: { label: "Goblin", look: "goth", pal: { a: "#2E3A22", b: C.cognac, leg: "#2E3A22" }, barefoot: true,
    skip: { male: ["Cloth"], femboy: ["Cloth"] },   // (the game doesn't draw the rags on a flat chest: they keep their own)
    pieces: [["HairAccessory2", "ElfEars", "#7A9440"], ["Cloth", "SlaveRags", "#6E6248"], ["ItemNeck", "SlaveCollar", "Default", L],
      ["ItemLegs", "FrogtieMetalCuffs", "Default", L], ["ItemHands", "ElbowLengthMittens", ["#4A3A28", C.cognac, C.brass, C.brass, "Default"], L, "Unchained"],
      ["ItemNose", "NoseRing", C.brass], ["ItemMouth", "BitGag", [C.hoof, C.cognac]]] },
};
export const OUTFIT_SPECIES = Object.keys(KIT);
// the farm's other kinds wear their cousins' outfits
const ALIAS = { bull: "cow", horse: "pony", dog: "pup", wolf: "pup", cat: "kitt", rabbit: "bunny", sheep: "goat" };
export const speciesLabel = (sp) => (KIT[sp] || {}).label || sp;
const BODY = { female: { tits: true, pussy: true }, male: { cock: true, flat: true }, futa: { tits: true, pussy: true, cock: true }, femboy: { cock: true, flat: true }, nonbinary: { pussy: true, flat: true } };

// their outfit: the body's wear for the species' look, then the tack over it (a tack piece takes that slot), then chastity
export function outfitPieces(species, gender) {
  const K = KIT[species] || KIT[ALIAS[species]], B = BODY[gender];
  const W = gender === "femboy" ? FEMBOY : (WEAR[K && K.look] || {})[gender];
  if (!K || !W) return null;
  const by = new Map();
  const col = (c) => (typeof c === "string" && c[0] === "$" ? K.pal[c.slice(1)] || "Default" : c);
  const put = ([Group, Name, Color, locked, opt]) => {
    const p = { Group, Name, Color: Array.isArray(Color) ? Color.slice() : col(Color), locked: !!locked };
    if (opt) { p.opt = opt; const prop = OUTFIT_PROPS[Group + ":" + Name + ":" + opt]; if (prop) p.Property = JSON.parse(JSON.stringify(prop)); }
    by.set(Group, p);
  };
  W.forEach(put);
  K.pieces.filter(p => !((K.skip || {})[gender] || []).includes(p[0])).forEach(put);
  for (const part of ["tits", "pussy", "cock", "flat"]) if (B[part] && K[part]) K[part].forEach(put);
  (CHASTITY[gender] || []).forEach(put);
  // what the tack covers or replaces comes off: a petsuit's legs or a pony's hooves need no socks, garters or shoes;
  // mittens and petsuit arms need no gloves; a bunny suit or a goblin's rags take the bra's place
  const has = (g, re) => by.has(g) && re.test(by.get(g).Name);
  if (has("ItemLegs", /Petsuit/)) for (const g of ["Socks", "Garters", "Shoes"]) by.delete(g);
  if (has("ItemBoots", /./) || has("Shoes", /Hoof/)) by.delete("Garters");
  if (has("ItemArms", /Petsuit|Armbinder|Cuffs/) || by.has("ItemHands")) by.delete("Gloves");
  if (has("Cloth", /Bunny|Rags/)) { by.delete("Bra"); by.delete("Corset"); }
  if (has("Cloth", /Bunny/)) by.delete("Panties");   // (the suit is the panties)
  if (by.has("SuitLower")) by.delete("Socks");   // (fishnets worn as a suit's legs take the socks' place)
  if (K.noBow) by.delete("HairAccessory3");
  if (K.barefoot) for (const g of ["Shoes", "Socks", "Garters"]) by.delete(g);
  return [...by.values()];
}
// every piece that needs a setting, for readin' the game's Property off it (the studio does it)
export function outfitOpts() {
  const out = new Set();
  for (const K of Object.values(KIT)) for (const list of [K.pieces, K.tits || [], K.pussy || [], K.cock || [], K.flat || []]) for (const p of list) if (p[4]) out.add(p[0] + ":" + p[1] + ":" + p[4]);
  return [...out];
}
