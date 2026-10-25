/* WHAT'S IN THIS FILE (shared/farm-outfit-names.js)
   A name and a description for each of the farm's 45 starter outfits (shared/farm-outfits.js), one for every species
   and gender (Laynie, Oct 25: "we have them implemented, but they arent named and described").
   outfitName(species, gender) → "Dairy Darling" · outfitDesc(species, gender) → the blurb, then what's in it, read off
   the outfit's own pieces so it never says somethin' the outfit doesn't have.
*/
import { outfitPieces } from "./farm-outfits.js";

// [name, the blurb] for each species, by gender. The blurb is the look; the piece list after it is worked out.
const NAMES = {
  cow: {
    female:    ["Dairy Darling", "Pastel pink and cream, a cowbell that rings with every crawl, and udders cupped and pumpin' on a slow, steady draw. Made for the milkin' line."],
    male:      ["Brass-Bell Bullock", "A jockstrap, a cognac chest harness and a cowbell on a locked collar: a young bull on all fours, caged and kept for the herd."],
    futa:      ["Cream Queen", "Everything a dairy girl wears, cow-print and milkin' cups, and nothin' locked between the legs to get in the way of breedin'."],
    femboy:    ["Buttercup Milkmaid", "A frilly pink maid bikini and a ribbon cincher on a crawlin' little cow, bell ringin', cage locked."],
    nonbinary: ["Clover Heifer", "Pastel lingerie under a padded cream petsuit, horns, a nose ring and a cowbell, belted and locked."],
  },
  kitt: {
    female:    ["Lilac Lap Kitten", "Lavender ears, a lilac petsuit with pink paw pads and a belled pink collar: a pet that purrs on all fours."],
    male:      ["Alley Tom", "A tomcat in a jockstrap and a leather harness, belled, leashed and caged, crawlin' in lilac."],
    futa:      ["Velvet Pounce", "Open lace in lavender, a belled collar and a petsuit to crawl in, with nothin' locked between the legs."],
    femboy:    ["Ribbon Kitten", "A pink maid bikini, a tulle skirt and ribbons on a kitten in a lilac petsuit, caged and belled."],
    nonbinary: ["Lavender Purr", "A corset bikini and crotchless lace under a lilac petsuit, belted and belled."],
  },
  bunny: {
    female:    ["Hutch Honey", "A see-through pink bunny suit, cream ears and a puff of a tail, bow collar and cuffs, wrists cuffed and ankles chained."],
    male:      ["Buck in Bows", "A jockstrap, a chest harness and bow-tied socks on a cuffed buck, leashed and caged."],
    futa:      ["Clover Hopper", "The see-through bunny suit with nothin' locked on: cuffed, collared and ready to be bred like a rabbit."],
    femboy:    ["Sugar Bun", "All pink frills: a maid bikini, a tulle skirt, ribbons and bunny ears, cuffed, chained at the ankles and caged."],
    nonbinary: ["Cottontail Charm", "A corset bikini and crotchless lace, bunny ears and tail, cuffed and belted."],
  },
  goat: {
    female:    ["Bluebell Nanny", "Cream horns, a brass bell and nose ring, a bit between the teeth, hooves for hands and pet legs to kneel on, in pastel blue."],
    male:      ["Brass-Belled Billy", "A jockstrap and harness on a billy with hoof mittens, a bit and a bell, kneelin' and caged."],
    futa:      ["Mountain Milker", "Pastel blue lace, a bit, a bell and hoof mittens, horns up and everything below left free."],
    femboy:    ["Little Kid Frills", "A pink maid bikini and tulle skirt on a kid with horns, hoof mittens and a bit, caged and kneelin'."],
    nonbinary: ["Meadow Caprine", "A corset bikini in pastel blue, hoof mittens, a bit and a bell, belted."],
  },
  deer: {
    female:    ["Twine-Bound Fawn", "Peach and mint, a reindeer band, a hemp rope harness and crossed rope on the legs, hooves on her hands and her feet."],
    male:      ["Stag in Hemp", "A jockstrap and a rope harness, hoof mittens and hooves, a bit and a bell, legs roped and caged."],
    futa:      ["Hart of the Hayloft", "Open peach lace under rope, hooves and a bit, tied pretty and left free to breed."],
    femboy:    ["Bambi Frills", "A pink maid bikini and tulle skirt under hemp rope, hoof mittens and hooves, caged."],
    nonbinary: ["Mint Meadow Deer", "A corset bikini under a rope harness, hooves and a bit, belted."],
  },
  pony: {
    female:    ["Midnight Mare", "Goth black and wine: a posture collar, a bridle and bit, a leather harness, hoof mittens behind the back and pony boots. Show ring ready."],
    male:      ["Brass-Bit Stallion", "A jockstrap, a harness and long fishnets, bridled and bitted, hoof mittens and boots, caged."],
    futa:      ["Dark Horse", "Latex corset, harness bra and crotchless latex under the tack: a bridled filly nobody locks shut."],
    femboy:    ["Pink Ribbon Colt", "A pink maid bikini under a cognac harness, bridle, hoof mittens and pony boots, caged."],
    nonbinary: ["Black Velvet Pony", "A classic latex corset under the harness and bridle, hoof mittens and pony boots, belted."],
  },
  pup: {
    female:    ["Good Girl in Black", "A black and wine padded petsuit, a bone tag on a locked dog collar, a ring gag and a lead: a pup who sits, crawls and opens wide."],
    male:      ["Wine-Collar Hound", "A jockstrap and harness on a hound in a black petsuit, collared, tagged, leashed and caged."],
    futa:      ["Alpha Bitch", "Latex and a harness bra under a black petsuit, collared and gagged open, nothin' locked below."],
    femboy:    ["Frilly Puppy", "Pink frills on a pup in a black petsuit: a maid bikini, a ribbon cincher, a bone tag, and a cage."],
    nonbinary: ["Midnight Mutt", "A latex corset and bra under a black petsuit, a bone tag and a ring gag, belted."],
  },
  fox: {
    female:    ["Vixen Noir", "Black with rust lacing and cream paws, a fluffy pair of tails, a wine collar and a ring gag."],
    male:      ["Rust Reynard", "A jockstrap and harness on a fox in a black and rust petsuit, two tails, leashed and caged."],
    futa:      ["Fox in the Henhouse", "Latex and a harness bra under the fox suit, tails up, gagged open and free to breed."],
    femboy:    ["Kit in Ribbons", "A pink maid bikini and tulle skirt on a little fox in black and rust, caged."],
    nonbinary: ["Ember Tail", "A latex corset and bra under the fox suit, two tails and a ring gag, belted."],
  },
  pig: {
    female:    ["Prize Sow", "Pink, with dark trotters, floppy ears and the snout hooked up, a rope harness for haulin' by and a bell on a locked collar."],
    male:      ["Penned Boar", "A jockstrap and harness on a boar in a pink petsuit, snout hooked, roped, belled and caged."],
    futa:      ["Truffle Queen", "Open lace in rose under the sow's petsuit and rope, snout hooked, nothin' locked below."],
    femboy:    ["Piglet Pink", "A pink maid bikini and tulle skirt on a little piglet in trotters, snout hooked and caged."],
    nonbinary: ["Rosy Trotter", "A corset bikini in rose under the petsuit and rope harness, snout hooked, belted."],
  },
  goblin: {
    female:    ["Ragged Raider", "Rags, elf ears and a slave collar, frog-tied on her knees with long mittens on, a bit and a nose ring, barefoot."],
    male:      ["Rag-Tag Grunt", "A jockstrap and harness on a frog-tied goblin, mittened, bitted, barefoot and caged."],
    futa:      ["Warband Brood-Queen", "Rags and a slave collar, frog-tied and mittened, nothin' locked where the warband breeds her."],
    femboy:    ["Camp Trinket", "Pink frills on a frog-tied goblin, long mittens and a bit, barefoot and caged."],
    nonbinary: ["Cave Scrapper", "Rags and a slave collar, frog-tied and mittened, a bit and a nose ring, belted."],
  },
};
const ALIAS = { bull: "cow", horse: "pony", dog: "pup", wolf: "pup", cat: "kitt", rabbit: "bunny", sheep: "goat" };

// what each piece is called in a description (the game's own name is used for anything not here)
const SAY = {
  "Bra:CorsetBikini1": "corset bikini top", "Bra:CowPrintedBra": "cow-print bra", "Bra:LatexBra1": "latex bra", "Bra:OuvertPerl1": "open-cup pearl lace bra",
  "Bra:StarHarnessBra": "harness bra", "Cloth:MaidBikini": "frilly maid bikini", "Cloth:SlaveRags": "rags", "Cloth:TransparentBunnyGirl": "see-through bunny suit",
  "ClothAccessory:BunnyCollarCuffs": "bunny collar and cuffs", "ClothLower:TulleSkirt": "tulle skirt", "Corset:ClassicLatexCorset": "classic latex corset",
  "Corset:LatexCorset1": "underbust latex corset", "Corset:RibbonCorset": "ribbon waist cincher", "Garters:SocksBow": "bows on the socks",
  "HairAccessory1:CowHorns": "cow horns", "HairAccessory1:Horns2": "goat horns", "HairAccessory2:BunnyEars1": "bunny ears", "HairAccessory2:CowEars": "cow ears",
  "HairAccessory2:Ears2": "soft ears", "HairAccessory2:ElfEars": "goblin ears", "HairAccessory2:FoxEars1": "fox ears", "HairAccessory2:KittenEars2": "kitten ears",
  "HairAccessory2:PonyEars1": "pony ears", "HairAccessory2:PuppyEars1": "puppy ears", "HairAccessory2:PuppyEars2": "floppy ears", "HairAccessory3:Ribbons1": "hair ribbons",
  "Hat:ReindeerBand": "antler band", "ItemArms:LeatherCuffs": "leather wrist cuffs", "ItemArms:PawPaddedPetsuitArms": "padded petsuit arms",
  "ItemBoots:PonyBoots": "pony boots", "ItemFeet:LeatherAnkleCuffs": "ankle cuffs chained together", "ItemHands:ElbowLengthMittens": "long mittens",
  "ItemHands:PonyMittensBinder": "hoof mittens strapped together", "ItemLegs:FrogtieMetalCuffs": "frog-tie cuffs", "ItemLegs:HempRope": "rope on the legs",
  "ItemLegs:PawPaddedPetsuitLegs": "padded petsuit legs", "ItemMouth:BitGag": "bit gag", "ItemMouth:HarnessPonyBits": "bridle and bit", "ItemMouth:RingGag": "ring gag",
  "ItemNeck:DogCollar": "dog collar", "ItemNeck:LeatherCollar": "leather collar", "ItemNeck:LeatherCollarBell": "belled collar", "ItemNeck:LeatherCollarBow": "bow collar",
  "ItemNeck:PostureCollar": "posture collar", "ItemNeck:SlaveCollar": "slave collar", "ItemNeckAccessories:CollarBell": "brass bell", "ItemNeckAccessories:CollarCowBell": "cowbell",
  "ItemNeckAccessories:CollarPupBone": "bone tag", "ItemNeckRestraints:CollarLeash": "leash", "ItemNipples:BellClamps": "bell nipple clamps",
  "ItemNipples:ChainClamp": "chained nipple clamps", "ItemNipples:LactationPump": "milkin' cups", "ItemNipples:NippleClamps1": "nipple clamps",
  "ItemNose:NoseRing": "nose ring", "ItemNose:PigNoseHook": "nose hook", "ItemPelvis:SleekLeatherChastityBelt": "leather chastity belt",
  "ItemTorso:HempRopeHarness": "rope harness", "ItemTorso:LeatherChestHarness1": "chest harness", "ItemTorso:LeatherHarness": "leather harness",
  "ItemVulva:FlatChastityCage": "chastity cage", "ItemVulva:PlasticChastityCage1": "pink chastity cage", "Panties:Bikini1": "bikini panties",
  "Panties:CowPrintedPanties": "cow-print panties", "Panties:CrotchPanties1": "crotchless lace panties", "Panties:Jockstrap": "jockstrap",
  "Panties:LatexCrotchlessPanties": "crotchless latex panties", "Shoes:HeellessHoof": "hooves", "Shoes:Heels1": "heels", "Shoes:MaryJaneShoes": "Mary Janes",
  "Shoes:StilettoHeels": "stilettos", "Shoes:ThighBoots": "thigh boots", "Socks:LatexSocks1": "latex stockings", "Socks:LongFishnets": "long fishnets",
  "Socks:SilkStockings3": "seamed stockings", "Socks:Socks6": "fluffy thigh-high socks", "TailStraps:BunnyTailStrap": "puff tail", "TailStraps:CowtailStrap": "cow tail",
  "TailStraps:FoxTailsStrap": "two fox tails", "TailStraps:HorseTailStrap": "horse tail", "TailStraps:KittenTailStrap1": "kitten tail", "TailStraps:PuppyTailStrap": "puppy tail",
};
const say = (p) => SAY[p.Group + ":" + p.Name] || p.Name;
const list = (a) => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];

const entry = (species, gender) => (NAMES[species] || NAMES[ALIAS[species]] || {})[gender] || null;
export function outfitName(species, gender) { const e = entry(species, gender); return e ? e[0] : null; }
export function outfitDesc(species, gender) {
  const e = entry(species, gender), pieces = outfitPieces(species, gender);
  if (!e || !pieces) return null;
  const locked = pieces.filter(p => p.locked).map(say);
  return e[1] + "\nIn it: " + list(pieces.map(say)) + "." + (locked.length ? "\nPadlocked: " + list(locked) + "." : "");
}
