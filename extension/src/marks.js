/* WHAT'S IN THIS FILE (marks.js)
   The farm marking YOUR body, done on your own screen (so the game always allows it), and only with your say-so:
   two switches in Toggles, both off until you turn them on:
     "Farm can mark my body"   splatters where loads land (the game's own Splatters, on your forehead, face, chest
                               and tummy, wherever there's room) and writing on your body (the game's BodyWritings:
                               three lines on your collarbone, ribs or hips)
     "Farm can strip me"       your clothes come off when the farm says so; they're kept so you can dress again
   ?wash (or the Companion's Wash up) takes off the splatters and the writing the farm put on you.
*/
import { commitLook } from "./look.js";
import { LS, onAccount } from "./acct.js";   // each account its own (Nov 24)
const KEY = "fhc-marks";            // { splatGroup, writeGroup }: where the farm put things, so ?wash only takes those
const STRIP_KEY = "fhc-strip-backup";
const SPLAT_GROUPS = ["Mask", "FaceMarkings", "BodyMarkings"];     // Splatters fits any of these; the first free one is used
const WRITE_GROUPS = ["BodyMarkings", "ClothAccessory"];            // BodyWritings fits either
// Echo's Clothing Mod's Body Treatise. The farm wrote on it from Oct 9 to Nov 21, and doesn't any more: since the
// game's November update it trips the game's own check (see treatiseCleanup below).
const TREATISE = { group: "BodyMarkings2_Luzi", name: "身体论文" };
// the Splatters item's parts, by area (module keys)
const AREAS = { forehead: ["a", "b", "c"], face: ["d", "e", "f"], chest: ["g", "h", "i", "j"], tummy: ["k", "l", "m", "n"] };
// a load runs: from the mouth down onto the breasts, from the breasts down the belly… (a third of the time)
const SPILL = { forehead: "face", face: "chest", chest: "tummy", tummy: "chest" };
const SPILL_CHANCE = 0.35;

const P = () => window.Player;
const load = () => { try { return JSON.parse(LS.getItem(KEY)) || {}; } catch (e) { return {}; } };
const save = (v) => { try { LS.setItem(KEY, JSON.stringify(v)); } catch (e) { /* fine */ } };
const groupOf = (name) => (typeof window.AssetGroupGet === "function" ? window.AssetGroupGet(P().AssetFamily, name) : null);
const bundle = () => window.ServerAppearanceBundle(P().Appearance);
const lockedGroups = () => new Set(P().Appearance.filter((it) => it.Property && it.Property.LockedBy).map((it) => it.Asset.Group.Name));
// a piece of their FARM OUTFIT (outfits.js wearOutfit): under the farm's own high security padlock, on them, with the
// farm girl among its keyholders. The farm can lift that and put it back; nobody else's lock is ever touched.
const FARM_GIRL = 260239;
const farmOutfitPiece = (b) => { const p = b && b.Property; if (!p || p.LockedBy !== "HighSecurityPadlock" || p.LockMemberNumber !== P().MemberNumber) return false;
  return String(p.MemberNumberListKeys || "").split(",").map(Number).includes(FARM_GIRL); };
// on you at once; the room hears only the spots that changed, gathered with anything else in the same moment (look.js)
const commit = (next) => commitLook(next);
// game text boxes take letters, numbers, spaces and a little punctuation, 20 characters a line
const cleanText = (t) => String(t || "").replace(/[^A-Za-z0-9 !?.,'&#*+-]/g, "").slice(0, 20);

// splat: ["face", "tummy"...] · write: { line: "BREEDER", pos: 0-8, style: 0-2 } · wash: true
export function markBody(m, prefs) {
  if (!P() || !Array.isArray(P().Appearance) || typeof window.ServerAppearanceBundle !== "function") return { ok: false, why: "not in a room" };
  const did = [];
  if (m.wash) return washMarks();
  if (!prefs.marks) return { ok: false, why: "off" };
  let next = bundle(), mem = load();
  const has = (g) => next.find((b) => b.Group === g);
  // ── splatters, wherever there's room ──
  if (Array.isArray(m.splat) && m.splat.length) {
    // a colour (piss yellow, mud brown) gets a Splatters item of its own, so the white ones stay white
    const col = typeof m.color === "string" && /^#[0-9a-fA-F]{6}$/.test(m.color) ? m.color.toUpperCase() : null;
    const colOf = (b) => (typeof b.Color === "string" && /^#/.test(b.Color) ? b.Color.toUpperCase() : null);
    const mine = next.filter((b) => b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group));
    let it = mine.find((b) => colOf(b) === col);
    if (!it) {
      const g = SPLAT_GROUPS.find((x) => !has(x) && groupOf(x));
      if (g) { it = { Group: g, Name: "Splatters", Property: { TypeRecord: {} } }; if (col) it.Color = col; next.push(it); mem.splatGroup = g; }
      else it = mine[0];   // no room for another: it lands on the ones already there
    }
    if (it) {
      it.Property = Object.assign({}, it.Property || {});
      const tr = it.Property.TypeRecord = Object.assign({}, it.Property.TypeRecord || {});
      for (const area of m.splat) {
        // that area first; if it's covered, any other part that's still clean
        const want = (AREAS[area] || []).filter((k) => !tr[k]);
        const any = Object.values(AREAS).flat().filter((k) => !tr[k]);
        const k = (want.length ? want : any)[Math.floor(Math.random() * (want.length ? want : any).length)];
        if (k) { tr[k] = 1; did.push(area); }
        // and it runs
        if (k && SPILL[area] && Math.random() < SPILL_CHANCE) {
          const down = AREAS[SPILL[area]].filter((x) => !tr[x]);
          if (down.length) { tr[down[Math.floor(Math.random() * down.length)]] = 1; did.push(SPILL[area]); }
        }
      }
    }
  }
  // ── a line written on the body (newest on top; three lines, the oldest drops off). The day's tally is a line too ──
  if (!(m.write && cleanText(m.write.line)) && m.tally && cleanText(String(m.tally))) m = Object.assign({}, m, { write: { line: String(m.tally) } });
  if (m.write && cleanText(m.write.line)) {
    let it = next.find((b) => b.Name === "BodyWritings" && WRITE_GROUPS.includes(b.Group));
    if (!it) {
      const g = WRITE_GROUPS.find((x) => !has(x) && groupOf(x));
      if (g) { it = { Group: g, Name: "BodyWritings", Property: { Text: "", Text2: "", Text3: "", TypeRecord: { p: 4, s: 0, t: 1 } } }; next.push(it); mem.writeGroup = g; }
    }
    if (it) {
      const pr = it.Property = Object.assign({ Text: "", Text2: "", Text3: "" }, it.Property || {});
      pr.Text3 = pr.Text2 || ""; pr.Text2 = pr.Text || ""; pr.Text = cleanText(m.write.line).toUpperCase();
      pr.TypeRecord = Object.assign({ p: 4, s: 0, t: 1 }, pr.TypeRecord || {}, m.write.pos !== undefined ? { p: m.write.pos } : {}, m.write.style !== undefined ? { s: m.write.style } : {}, { t: 1 });
      did.push("writing");
    }
  }
  if (!did.length) return { ok: false, why: "no room" };
  save(mem); commit(next);
  return { ok: true, did };
}

// FARM GEAR: real items the farm keeps on you (a trap's plug, growth cups, the clamp, a chain, the feed funnel, rope,
// the parasite's lips or belt). The farm girl sends the list of what should be on you right now, and this makes your
// character match it: a listed piece goes on, a piece that's no longer listed comes off, and one pulled off early
// goes back. Trap gear needs "Farm can put real gear on me" (Toggles); the parasite's own switch is its say-so.
// Each piece is crafted with FARM_TAG in its description, which is how we know which items are ours to remove.
const FARM_TAG = "BnB Farm gear.";   // plain letters, and at the FRONT of the description, so the game can neither strip it nor cut it off
const OLD_TAG = "[B&B Farm gear]";
// every name the farm gives a piece. An item YOU crafted onto yourself under one of these names is the farm's, whatever became
// of its description (live, Oct 11: a Slime Seal lost its tag and never came off)
const FARM_NAMES = ["Parasite Lips", "Stall Milker", "Stall Sybian", "Stall Stand", "Parasite Belt", "Pump Bung", "Egg Post Plug", "Slime Seal", "Boar's Plug", "Seed Pod Stem", "Denial Clamp", "Growth Cups",
  "Trap Milker", "Winch Chain", "Feed Chute", "Snare Rope", "Breedin' Frame Cuffs", "Kennel Lead", "The Water's Grip", "The Water's Coils", "Slime Sleeves", "Slime Stockings",
  "Snare Hobble", "Pack's Knot", "Stud's Stopper", "Pillory Spreader", "Parasite Suckers", "Parasite Root", "The Water's Embrace", "Brood Sac", "Grower's Sheath", "Glutton's Sleeve", "Tyrant's Cage", "Tyrant's Web",
  "Growin' Plug", "Hungry Belt", "Milkmaid's Cups", "Glutton's Funnel", "The Hobble", "Living Suit (legs)", "Living Suit (hips)", "Living Suit (chest)", "Living Suit (arms)", "Living Suit (mouth)",
  // Oct 15: the newer traps' equipment
  "Buckin' Saddle", "Saddle Post", "Hayloft Net", "Lost Cow Bell", "Teasin' Stall", "Sheep Dip", "Breedin' Crate", "Sire's Stopper", "Carousel Milkers", "Carousel Cuffs",
  "Plow Bit", "Plow Harness", "Bale Twine", "Scarecrow Post", "Scarecrow Ropes", "Clothespins", "Washin' Line", "Fair Stocks", "The Pillory", "Breedin' Wheel",
  "Windmill Sails", "Kissin' Gate", "The Fence", "Collection Bench", "Auction Block",
  "Vacuum Bed", "Vat Skin", "Vat Skin (hands)", "Doll Hood", "Doll Binder", "Doll Tag", "Stall Sheath", "Rubber Cups", "Inflatable Body Bag",
  "Dairymaid's Mitts", "Dairymaid's Muzzle", "Black Pool Latex (legs)", "Black Pool Latex (arms)", "Rubber Pup Hood", "Rubber Paws",
  "Livin' Latex (hands)", "Livin' Latex (arms)", "Livin' Latex (feet)", "Livin' Latex (legs)", "Livin' Latex (body)", "Livin' Latex (heels)", "Milk Moss", "Milk Moss (bloom)",
  // Oct 27: Halloween's (and the farm girl's costume)
  "Horseman's Rope", "Hellhound's Knot", "Demon's Horns", "Spider's Web", "Spider Silk", "Samhain Antlers", "The Great Pumpkin", "Bobbin' Ties", "The Witch's Cauldron",
  "Broom Ties", "Candy Stick", "Taffy Hooks (arms)", "Taffy Hooks (legs)", "Mummy Wraps (arms)", "Mummy Wraps (body)", "Mummy Wraps (legs)", "Costume Ears", "Costume Tail",
  "Witch's Hat", "Black Cat Ears", "Black Cat Tail",
  // Oct 27: winter's and Yule's
  "Frozen Fast", "Bakery Ribbon", "Mistletoe Ribbon", "Yeti's Fur Wrap", "Gift Ribbon (arms)", "Gift Ribbon (legs)", "Gift Box", "The Big Stockin'", "Stockin' Stuffer",
  "Cocoa Stand Ribbon", "Frost Lace", "The Farmyard Snowman", "Winter Hat", "Winter Shawl", "Fur Gloves",
  "Yule Log Ribbons", "Solstice Ribbon", "Holly King's Crown", "The Hunt's Rope", "Wassail Ribbons", "Ivy (arms)", "Ivy (legs)", "Vigil Cord (arms)",
  "Vigil Cord (legs)", "Holly Crown", "Yule Cloak",
  // Oct 27: the spring, summer and autumn seasons' (Ostara, Easter, Litha, Mabon)
  "Ivy Bands", "First Bloom Crown", "Plough Rope", "Dye-Tub Ribbon", "See-Saw Straps", "Waterweed", "Spring Crown", "Hare Ears", "Hare's Tail",
  "Easter Egg Plug", "Fountain Ribbon", "Bunny Girl Suit", "Bunny Suit Ears", "Bunny Collar and Cuffs", "Bunny Tail Plug", "Basket Ribbon (arms)",
  "Basket Ribbon (legs)", "Sugar Twine", "Egg-Roll Ribbon", "Parade Bonnet", "Mould Straps", "Easter Bonnet", "Bunny Ears", "Bunny Tail",
  "Midsummer Ribbon", "Oak King's Crown", "Fae Ribbon", "The Sun Wheel", "Rose Garlands", "Barrel Rope", "Midsummer Crown",
  "Sheaf Twine", "Sheaf Twine (legs)", "Corn Dolly Plaits", "Corn Dolly Plaits (legs)", "Vintner's Ribbon", "Press Strap", "Wagon Ribbon",
  "The Harvest Crown", "Table Ribbons", "Harvest Crown", "Harvest Apron",
  // Oct 27: the whole rubber pup, and the parasite strains' fuller outfits (10y9k-latex-traps.js, 10v6-parasite-strains-more.js)
  "Rubber Pup Skin", "Rubber Pup Skin (legs)", "Rubber Petsuit", "Rubber Petsuit (legs)", "Kennel Collar", "Good Pup Tag", "Kennel Leash",
  "Pup's Tail Plug", "Rubber Pup Tail", "Parasite Tail", "Parasite Sleeves", "Parasite Stockings", "Ooze Gloves", "Ooze Sleeves", "Ooze Stockings",
  "Ooze Skin (legs)", "Ooze Skin (body)", "Ooze Sleeve", "Silk Harness", "Silk Gloves", "Silk Stockings", "Weaver's Cocoon", "Deep's Tail",
  "Deep's Sleeves", "Deep's Stockings", "Deep's Embrace", "Deep's Coil", "Gloss Gloves", "Gloss Sleeves", "Gloss Stockings", "Gloss Skin (legs)",
  "Gloss Skin (body)", "Gloss Heels", "Gloss Sheath",
  // Nov 20: the wild traps' kits (10z8b-wild-kits.js), and the fuller hogtie, saddle, mummy and rubber vat
  "Wild Trap Cuffs", "Farm Bull Ring", "Stall Plugs", "Pasture Plugs", "Shipping Plugs", "Farm Cow Tail", "Farm Cowbell", "Farm Ear Tag", "Farm Cow Hood",
  "Farm Hoof Mitts", "Stall Mitts", "Stall Milker", "Breedin' Plug", "Stall Harness", "Stall Armbinder", "Stall Frogtie", "Stall Blindfold", "Feedin' Ring",
  "Stall Collar", "Stall Chain", "Bull's Hoof Boots", "Bull's Bell Clamps", "Bull's Warm-Up", "Bull's Rope Harness", "Mountin' Ropes", "Muddy Stake",
  "Pasture Weighted Clamps", "Trottin' Plug", "Pasture Pony Tail", "Pasture Harness", "Pasture Yoke", "Pasture Hooves", "Pasture Ball and Chain",
  "Pasture Pony Hood", "Pasture Bit", "Pony's Posture Collar", "Pasture Lead", "Field Milker", "Heifer Plug", "Heifer Crawl Suit", "Heifer Collar",
  "Field Stake", "Heifer's Feed Bowl", "Shipping Clamps", "Shipping Bra", "Shipping Plug", "Shipping Egg", "Shipping Belt", "Shipping Jacket",
  "Shipping Binder", "Shipping Heels", "Shipping Blindfold", "Shipping Gag", "Shipping Panel", "Shipping Collar", "Receivin' Hand Truck", "Crate Plug",
  "Crate Plug (back)", "Crate Rope", "Crate Rope (legs)", "Crate Rope (ankles)", "Packin' Tape", "Packin' Tape (mouth)", "Crate Collar", "Shippin' Crate",
  "Lot Teat Suction", "Lot Clit Suction", "Inspection Plug", "Lot Blindfold", "Inspection Ring", "Inspection Collar", "Inspection Frame", "Prize Mitts",
  "Prize Bells", "Horse's Plug", "Prize Plug", "Breakin' Corset", "Prize Binder", "Prize Hood", "Prize Collar", "Prize Wedges", "Prize Shackles",
  "The Wooden Horse", "Vac Milker", "Vac Plug", "Vac Plug (back)", "Breathin' Tube", "Dairy Vac Bed",
  "Rodeo Rope", "Saddle Bit", "Spur Clamps", "Vat Skin (legs)", "Vat Skin (head)", "Vat Plug", "Vat Collar", "Vat Binder", "Vat Binder (legs)", "Vat Heels",
  "Mummy Wraps (feet)", "Mummy Wraps (hands)", "Mummy Wraps (head)", "Hog Tie (knees)", "Sty Gag", "Sty Blindfold", "Snout Ring",
  "Barn Teleporter Rings", "Fence Teleporter Rings", "Parcel Teleporter Rings", "Trophy Teleporter Rings", "Trophy Plug"];
// slot → where it can go and which game item it is: the first that this game has; the pattern is a fallback
export const GEAR_SLOTS = {
  plug:     { groups: ["ItemButt"], names: ["InflVibeButtPlug", "BlackButtPlug", "ButtPlug", "ButtPump"], re: /ButtPlug|Plug/, color: "#2B2B2B" },
  dildo:    { groups: ["ItemVulva"], names: ["InflatableVibeDildo", "VibratingDildo", "ClitoralStimulator"], re: /Dildo/, color: "#2B2B2B" },
  belt:     { groups: ["ItemPelvis"], names: ["PolishedChastityBelt", "LeatherChastityBelt", "SleekLeatherChastityBelt", "MetalChastityBelt"], re: /ChastityBelt/ },
  cups:     { groups: ["ItemNipples"], names: ["LactationPump", "NippleSuctionCups"], re: /Pump|Suction/ },
  leash:    { groups: ["ItemNeckRestraints"], names: ["CollarChainLong", "CollarLeash", "CollarChainShort"], re: /Chain|Leash/, needs: "ItemNeck" },
  funnel:   { groups: ["ItemMouth", "ItemMouth2", "ItemMouth3"], names: ["FunnelGag"], re: /Funnel/ },
  ropeArms: { groups: ["ItemArms"], names: ["HempRope"], re: /Rope/ },
  arms:     { groups: ["ItemArms"], names: ["HempRope", "LeatherCuffs"], re: /Rope|Cuffs/ },
  legs:     { groups: ["ItemLegs"], names: ["HempRope", "LeatherLegCuffs"], re: /Rope|Cuffs/ },
  ropeFeet: { groups: ["ItemFeet"], names: ["HempRope"], re: /Rope/ },   // (a piece can ask for a spreader bar here instead)
  lips:     { groups: ["ItemMouth", "ItemMouth2", "ItemMouth3"], names: ["LipGag"], re: /LipGag/, color: ["#E0607F", "#7A2B47", "#7A2B47"] },
  torso:    { groups: ["ItemTorso", "ItemTorso2"], names: ["TentacleSuit", "HempRopeHarness"], re: /Harness/ },
  tag:      { groups: ["ItemNeckAccessories"], names: ["CollarNameTagLivestock", "CollarNameTag"], re: /NameTag/, needs: "ItemNeck" },
  // the big pieces (Oct 15): the game's own devices, only the ones a piece names (no stray device off the list)
  // clothes a symbiote grows into (Oct 15): these take the spot over if you're wearing something there, and put yours
  // back when the piece comes off (takeover)
  gloves:   { groups: ["Gloves"], names: ["LatexShortGloves"], re: /^Latex/, takeover: true },
  socks:    { groups: ["Socks"], names: ["LatexSocks1"], re: /^Latex/, takeover: true },
  suit:     { groups: ["Suit"], names: ["LatexCatsuit"], re: /^LatexCatsuit$/, takeover: true },
  suitLower:{ groups: ["SuitLower"], names: ["LatexCatsuit"], re: /^LatexCatsuit$/, takeover: true },
  bra:      { groups: ["Bra"], names: ["FlowerBra"], re: /^FlowerBra$/, takeover: true },
  hat:      { groups: ["Hat"], names: ["FlowerCrown"], re: /^FlowerCrown$/, takeover: true },
  boots:    { groups: ["ItemBoots"], names: ["ThighHighLatexHeels"], re: /^ThighHighLatexHeels$/ },
  device:   { groups: ["ItemDevices"], names: ["WoodenStocks"], re: /^(WoodenStocks|SaddleStand|WoodenHorse|Net|Kennel|LowCage|KabeshiriWall|WheelFortune|LuckyWheel|XFrame|BondageBench|TheDisplayFrame|MilkCan|VacBedDeluxe|InflatableBodyBag)$/ },
  // the latex traps (Oct 25): a hood and mitts
  hood:     { groups: ["ItemHood"], names: ["LatexHood"], re: /^(LatexHood|TransparentLatexHood|LatexDogHood|VacHood)$/, color: "#121214" },
  mitts:    { groups: ["ItemHands"], names: ["LatexBondageMitts"], re: /^LatexBondageMitts$/, color: "#121214" },
  // the parasite's suckers and the trough leeches (Laynie, Oct 26: "switch the parasites lactation pumps for the forbidden chastity bra")
  chestbra: { groups: ["ItemBreast"], names: ["ForbiddenChastityBra", "PolishedChastityBra", "MetalChastityBra"], re: /ChastityBra$/ },
  // costume pieces (Oct 27: Halloween's cat ears and tails, a demon's horns, the farm girl dressed for the season). These
  // only ever put on the item the piece names, so there's no stand-in: if this game hasn't got it, nothin' goes on
  ears:     { groups: ["HairAccessory2"], names: [], re: /^$/, takeover: true },
  horns:    { groups: ["HairAccessory1"], names: [], re: /^$/, takeover: true },
  tail:     { groups: ["TailStraps"], names: [], re: /^$/, takeover: true },
  // the farm girl's winter shawl and Yule cloak (Oct 27): the same, over her own clothes' accessory spot
  cloak:    { groups: ["ClothAccessory"], names: [], re: /^$/, takeover: true },
  // a collar (Oct 27: the rubber pup's). Only the item a piece names, and never in place of a collar of yours: if you're
  // wearin' one, the leash and the tag clip to it instead
  collar:   { groups: ["ItemNeck"], names: [], re: /^$/ },
  // WILD TRAP KITS (Nov 20, Laynie: "definitely could use more complete, restrictive sets"): blind, deaf, a ring through
  // the nose, gagged two deep (a plug under a panel), mittened, the ankles too. Each puts on the item its piece names
  // first, wherever that lives; these are only the stand-ins
  blind:    { groups: ["ItemHead"], names: ["LeatherBlindfold", "FullBlindfold"], re: /Blindfold/ },
  earplugs: { groups: ["ItemEars"], names: ["HeavyDutyEarPlugs", "LightDutyEarPlugs"], re: /EarPlugs/ },
  nose:     { groups: ["ItemNose"], names: ["NoseShackle"], re: /^NoseShackle$/ },
  gag:      { groups: ["ItemMouth", "ItemMouth2", "ItemMouth3"], names: ["HarnessBallGag1", "BitGag"], re: /BallGag|BitGag/ },
  gag2:     { groups: ["ItemMouth2", "ItemMouth3", "ItemMouth"], names: ["HarnessPanelGag"], re: /PanelGag/ },
  hands:    { groups: ["ItemHands"], names: ["PaddedLeatherMittens", "LeatherMittens"], re: /Mittens/ },
  feet:     { groups: ["ItemFeet"], names: ["LeatherAnkleCuffs"], re: /AnkleCuffs|AnkleShackles/ },
  // Echo's Limb Teleportation Device (Nov 20, a wild kit that takes the limbs): only the item the piece names, or nothin'
  addon:    { groups: ["ItemAddon"], names: [], re: /^$/ },
};
// a game item whose own name a piece can't carry (Echo's are in Chinese): the piece names it in plain letters
export const ECHO_TELEPORTER = "隐形药水";   // Echo's clothing mod: "Limb Teleportation Device", in ItemAddon
const ITEM_ALIAS = { EchoLimbTeleporter: ECHO_TELEPORTER };
const itemName = (n) => ITEM_ALIAS[n] || n;
const nameOk = (n) => !!ITEM_ALIAS[n] || /^[A-Za-z0-9_-]{2,40}$/.test(n);
// HOW EACH PIECE IS SET (Laynie, Oct 19: "I had a knee spreader described as being a knee spreader, but it was just hemp
// rope and the cuffs weren't restraining me at all with their configuration"). The game puts most restraints on in their
// loosest setting: cuffs unchained, a funnel gag with no funnel, a bench with no straps, the pump switched off. So each
// one the farm uses is set the way its description says: cuffs locked together behind, a spreader wide, the funnel in.
// A piece can ask for its own (opt: "Hogtied"); otherwise this list; otherwise the game's own first setting.
export const GEAR_OPT = {
  "ItemArms:LeatherCuffs": "Wrist", "ItemArms:SteelCuffs": "Wrist", "ItemArms:WristShackles": "Behind", "ItemArms:WoodenCuffs": "HandsBack",
  "ItemArms:HempRope": "BoxTie", "ItemLegs:LeatherLegCuffs": "Chained", "ItemLegs:HempRope": "Basic", "ItemFeet:HempRope": "Basic",
  "ItemFeet:SpreaderMetal": "Wide", "ItemFeet:HeavySpreaderMetal": "Wide", "ItemFeet:WoodenCuffs": "Spread2",
  "ItemMouth:FunnelGag": "Funnel", "ItemMouth2:FunnelGag": "Funnel", "ItemMouth3:FunnelGag": "Funnel",
  "ItemNipples:LactationPump": "MediumSuction", "ItemDevices:BondageBench": "Normal",
  "ItemTorso:HempRopeHarness": "Harness", "ItemTorso2:HempRopeHarness": "Harness",
};
// a piece's own item may live in another spot than its slot's (a spreader bar is at the ankles): find where
function itemHome(name, slot, taken) {
  const all = Array.isArray(window.Asset) ? window.Asset : [];
  const homes = all.filter((a) => a && a.Name === name && a.Group && a.Group.Family === P().AssetFamily && /^Item/.test(a.Group.Name)).map((a) => a.Group.Name);
  // (clothes never go anywhere but their own spot: a tentacle TAIL is not the game's tentacles for the arms, Oct 27)
  // (and an item the slot's own spot has goes there or nowhere: tape is in nearly every spot, and the arms' tape mustn't
  // end up over the mouth because the arms were taken, Nov 20)
  const own = homes.filter((g) => slot.groups.includes(g));
  if (own.length) return own.find((g) => !taken(g)) || null;
  return slot.takeover ? null : homes.find((g) => !taken(g)) || null;
}
// a sign's words (the stake's "Free / To / Breed"): plain letters, short, three lines at most
const signWords = (text) => {
  if (!Array.isArray(text) || !text.length) return null;
  const w = text.slice(0, 3).map((s) => String(s || "").replace(/[^A-Za-z0-9 !?.,'&#*+-]/g, "").slice(0, 12));
  return { Text: w[0] || "", Text2: w[1] || "", Text3: w[2] || "" };
};
// set an item the way GEAR_OPT (or the piece) says, through the game's own extended-item setter. A modular item (the stake:
// its mud, its chain) takes a record instead (rec: { d: 1, l: 2 }), and a sign takes its words (text) once it's set
function setGearOpt(group, name, want, rec, text) {
  try {
    const it = typeof window.InventoryGet === "function" ? window.InventoryGet(P(), group) : null;
    if (!it || it.Asset.Name !== name || typeof window.ExtendedItemGetData !== "function" || typeof window.ExtendedItemSetOptionByRecord !== "function") return false;
    const data = window.ExtendedItemGetData(it.Asset, it.Asset.Archetype), words = signWords(text);
    let record = null;
    if (data && data.archetype === "typed" && want && Array.isArray(data.options)) {
      const i = data.options.findIndex((o) => o.Name === want); if (i >= 0) record = { typed: i };
    } else if (data && data.archetype === "modular" && rec && typeof rec === "object" && Array.isArray(data.modules)) {
      const got = {};
      for (const m of data.modules) { const v = rec[m.Key]; if (Number.isInteger(v) && v >= 0 && v < (m.Options || []).length) got[m.Key] = v; }
      if (Object.keys(got).length) record = Object.assign({}, (it.Property && it.Property.TypeRecord) || {}, got);
    }
    if (record) window.ExtendedItemSetOptionByRecord(P(), it, record, { push: !words, refresh: true, C_Source: P() });
    if (words) {
      it.Property = Object.assign(it.Property || {}, words);
      if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(P(), false);
      if (typeof window.ChatRoomCharacterItemUpdate === "function") window.ChatRoomCharacterItemUpdate(P(), group);
    }
    return !!(record || words);
  } catch (e) { console.warn("[Farmhand Companion] gear setting:", e); return false; }
}
// only: the piece's own items or nothin' (a witch's hat the game might not have mustn't turn into a flower crown)
function gearAsset(group, slot, prefer, only) {
  const fam = P().AssetFamily, get = (n) => { try { return typeof window.AssetGet === "function" ? window.AssetGet(fam, group, n) : null; } catch (e) { return null; } };
  for (const n0 of (Array.isArray(prefer) ? prefer.map(String) : [])) { const n = itemName(n0); if (nameOk(n0) && get(n)) return n; }   // the piece's own choice, if this game has it there
  if (only) return typeof window.AssetGet !== "function" && Array.isArray(prefer) && prefer.length ? itemName(String(prefer[0])) : null;
  for (const n of slot.names) if (get(n)) return n;
  const all = Array.isArray(window.Asset) ? window.Asset : [];
  const hit = all.find((a) => a && a.Group && a.Group.Name === group && slot.re.test(a.Name) && !a.OwnerOnly && !a.LoverOnly && !a.FamilyOnly);
  return hit ? hit.Name : (typeof window.AssetGet !== "function" ? slot.names[0] : null);
}
const NAMES_KEY = "fhc-gear-names";
const knownNames = () => { try { return FARM_NAMES.concat(JSON.parse(LS.getItem(NAMES_KEY)) || []); } catch (e) { return FARM_NAMES; } };
const learnName = (n) => { try { const have = JSON.parse(LS.getItem(NAMES_KEY)) || []; if (!FARM_NAMES.includes(n) && !have.includes(n)) LS.setItem(NAMES_KEY, JSON.stringify(have.concat(n).slice(-80))); } catch (e) { /* fine */ } };
const isFarmGear = (b) => { const c = b.Craft, d = c ? String(c.Description || "") : ""; return !!(c && (d.includes(FARM_TAG) || d.includes(OLD_TAG) || (knownNames().includes(c.Name) && (!c.MemberNumber || c.MemberNumber === P().MemberNumber)))); };
// what we put where, kept on this computer too: if the game ever hands an item back without its crafted name,
// we still know it's ours and can take it off again
const GEAR_KEY = "fhc-gear";
const gearMem = () => { try { return JSON.parse(LS.getItem(GEAR_KEY)) || {}; } catch (e) { return {}; } };
const gearMemSave = (m) => { try { LS.setItem(GEAR_KEY, JSON.stringify(m)); } catch (e) { /* fine */ } };
const gearNameOf = (b, mem) => (isFarmGear(b) ? b.Craft.Name : (Object.keys(mem).find((n) => mem[n].group === b.Group && mem[n].item === b.Name && (!(b.Craft && b.Craft.Name) || b.Craft.Name === n)) || null));
// WHAT A WILD TRAP LEFT (Nov 20, Laynie: "Id even let the gear remain til removed by someone else"): a piece the farm
// keeps (keep) is put back if they pull it off themselves, like all the farm's gear; when somebody ELSE takes it off,
// index.js tells the farm girl (gearFreed), and it's never put back on here. The farm's gear goes on in any room, so
// this is kept on this computer: somebody frees them in a room the farm girl isn't in, and it stays off till she hears.
// The same for a safeword said away from the farm (farmGearLetGo): everything she put on comes off at once, here.
// Each is known by its name and its time (name|until): a fresh piece from a later trap is a new one.
const LETGO_KEY = "fhc-gear-letgo";
const letGo = () => { try { return JSON.parse(LS.getItem(LETGO_KEY)) || {}; } catch (e) { return {}; } };
const letGoSave = (m) => { try { LS.setItem(LETGO_KEY, JSON.stringify(m)); } catch (e) { /* fine */ } };
const pieceKey = (name, until) => String(name).slice(0, 30) + "|" + (Number(until) || 0);
export function gearFreedHere(name, until) { const m = letGo(); m[pieceKey(name, until)] = { why: "freed", at: Date.now() }; letGoSave(m); }
// a piece that keeps comin' off (syncFarmGear): when it went on lately, and till when it's left off
const putAt = new Map(), stuckUntil = new Map(), PUT_MAX = 3, PUT_WINDOW = 120000, STUCK_MS = 600000;
export function farmGearLetGo(list) {
  const m = letGo(); let n = 0;
  for (const g of (Array.isArray(list) ? list : [])) if (g && g.name) { m[pieceKey(g.name, g.until)] = { why: "safe", at: Date.now() }; n++; }
  letGoSave(m); return n;
}
// the farm piece in one of their spots, if there is one (its name)
export function farmPieceIn(group) {
  try { const b = (P() && P().Appearance || []).find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === group); if (!b) return null;
    const mem = gearMem(); return gearNameOf({ Group: group, Name: b.Asset.Name, Craft: b.Craft }, mem); } catch (e) { return null; }
}
// list: [{ slot, name, desc, color, always }] · allow: trap gear is switched on · opts.aside: their own things may be set
// aside too (Traps can set my own things aside). Returns what it did.
// SET ASIDE FOR THE SCENE (Nov 24, the suggestion box's #70, Kitty Sera: "temporarily removing an outfit for trap scenes if
// they are applying different restraints (can be disconnecting to be told 'you are tied in ropes' and see nothing…)";
// Laynie: "farm pieces only, plus the opt-in switch for your own gear"). A trap's piece whose spot was taken just didn't
// go on. Now, when every spot it could go in is full: a piece of their farm outfit there is set aside (padlock and all)
// and the trap's goes on in its place; when the trap's comes off, the outfit's piece goes straight back, locked as it was.
// Their own things are only set aside with their switch on, and never anythin' somebody else has locked.
export function syncFarmGear(list, allow, opts) {
  const aside = !!(opts && opts.aside);
  if (!P() || !Array.isArray(P().Appearance) || typeof window.ServerAppearanceBundle !== "function") return { on: [], off: [] };
  const lg = letGo(), now = Date.now();
  // (let go of what the farm's stopped listin' for a while, or a month on)
  let pruned = false;
  for (const k of Object.keys(lg)) if (now - (lg[k].at || 0) > 31 * 86400000 || (now - (lg[k].at || 0) > 600000 && !(list || []).some((g) => g && pieceKey(g.name, g.until) === k))) { delete lg[k]; pruned = true; }
  if (pruned) letGoSave(lg);
  // (a piece the game, another mod or the wearer keeps takin' off isn't put back more than 3 times in 2 minutes: then it's
  // left off for 10. Nov 21, Laynie: "it keeps taking off the things i put on, and putting back the things it tries to take
  // off", and her game was cut off by the server for sendin' too much. A fight can't run away like that again.)
  for (const [n, t] of stuckUntil) if (t <= now) stuckUntil.delete(n);
  const want = (Array.isArray(list) ? list : []).filter((g) => g && GEAR_SLOTS[g.slot] && (g.always || allow) && (!g.until || g.until > now) && !lg[pieceKey(g.name, g.until)] && !stuckUntil.has(g.name))
    .sort((a, b) => (GEAR_SLOTS[a.slot].needs ? 1 : 0) - (GEAR_SLOTS[b.slot].needs ? 1 : 0));   // (the collar first, then the leash and the tag that clip to it)
  const cur = bundle(), stuck = lockedGroups(), did = { on: [], off: [] }, mem = gearMem(), setLater = [];
  let next = cur.slice();
  // off: ours, and not on the list any more
  for (const b of cur) {
    const n = gearNameOf(b, mem);
    if (!n || want.some((g) => g.name === n) || stuck.has(b.Group)) continue;
    next = next.filter((x) => x !== b); did.off.push(n);
    if (mem[n] && mem[n].was && !next.some((x) => x.Group === b.Group)) next.push(mem[n].was);   // your own clothes back on
    delete mem[n];
  }
  for (const n of Object.keys(mem)) if (!want.some((g) => g.name === n) && !next.some((b) => gearNameOf(b, mem) === n)) delete mem[n];   // gone some other way
  // on: listed, and not on you
  for (const g of want) {
    if (next.some((b) => gearNameOf(b, mem) === g.name)) continue;
    const hist = (putAt.get(g.name) || []).filter((t) => now - t < PUT_WINDOW);
    if (hist.length >= PUT_MAX) { stuckUntil.set(g.name, now + STUCK_MS); putAt.delete(g.name); (did.stuck = did.stuck || []).push(g.name); continue; }
    const slot = GEAR_SLOTS[g.slot];
    if (slot.needs && !next.some((b) => b.Group === slot.needs)) continue;            // a chain needs a collar to clip to
    let group = slot.groups.find((x) => !next.some((b) => b.Group === x) && groupOf(x)), was = null, item = null;
    // the piece's own item first, in whichever spot it lives (a spreader bar asked for in "legs" goes to the ankles)
    for (const n0 of (Array.isArray(g.items) ? g.items.map(String) : [])) {
      if (!nameOk(n0)) continue;
      const n = itemName(n0);
      const home = itemHome(n, slot, (x) => next.some((b) => b.Group === x) || stuck.has(x) || !groupOf(x));
      if (home) { group = home; item = n; break; }
    }
    if (!group && slot.takeover) {
      group = slot.groups.find((x) => groupOf(x) && !stuck.has(x) && next.some((b) => b.Group === x && !gearNameOf(b, mem)));
      if (group) { was = next.find((b) => b.Group === group); next = next.filter((b) => b !== was); }
    }
    if (!group) {   // (#70: every spot full. The piece's own item's spot first, then the slot's: a farm outfit piece steps aside, or with their switch on, their own)
      const homes = [];
      for (const n0 of (Array.isArray(g.items) ? g.items.map(String) : [])) { if (!nameOk(n0)) continue; const n = itemName(n0), all = Array.isArray(window.Asset) ? window.Asset : [];
        for (const a of all) if (a && a.Name === n && a.Group && a.Group.Family === P().AssetFamily && slot.groups.includes(a.Group.Name) && !homes.includes(a.Group.Name)) homes.push(a.Group.Name); }
      for (const x of slot.groups) if (!homes.includes(x)) homes.push(x);
      group = homes.find((x) => { if (!groupOf(x)) return false; const b = next.find((y) => y.Group === x); if (!b || gearNameOf(b, mem)) return false;
        return farmOutfitPiece(b) || (aside && !stuck.has(x)); }) || null;
      if (group) { was = next.find((b) => b.Group === group); next = next.filter((b) => b !== was); (did.aside = did.aside || []).push(was.Name); }
    }
    if (!group) continue;                                                              // that spot's taken: it's on the farm's books just the same
    if (!item) item = gearAsset(group, slot, g.items, !!g.only);
    if (!item) { if (was) next.push(was); continue; }   // (nothing to put there after all: theirs stays)
    const color = (typeof g.color === "string" && /^#[0-9a-fA-F]{6}$/.test(g.color) ? g.color : null) || slot.color || "Default";
    const it = { Group: group, Name: item, Difficulty: 20, Property: {},
      Craft: { Item: item, Name: String(g.name).slice(0, 30), Description: (FARM_TAG + " " + String(g.desc || "").slice(0, 180)).trim(),
        Property: "Normal", Color: Array.isArray(color) ? color.join(",") : color, Lock: "", Private: true, MemberNumber: P().MemberNumber, MemberName: P().Name, ItemProperty: {}, Type: null, TypeRecord: null } };
    if (color !== "Default") it.Color = color;
    next.push(it); did.on.push(g.name); mem[g.name] = was ? { group, item, was: JSON.parse(JSON.stringify(was)) } : { group, item }; learnName(String(g.name).slice(0, 30));
    putAt.set(g.name, hist.concat(now));
    const opt = (typeof g.opt === "string" && g.opt) || GEAR_OPT[group + ":" + item];
    if (opt || g.rec || g.text) setLater.push([group, item, opt, g.rec, g.text]);
  }
  gearMemSave(mem);
  if (did.on.length || did.off.length) commit(next);
  // and set the way they're meant to be (cuffs chained, the spreader wide, the stake's sign), once they're on
  for (const [gr, nm, op, rc, tx] of setLater) setGearOpt(gr, nm, op, rc, tx);
  return did;
}

// ── a body that shows its size ──
// The game's own body sizes, smallest to biggest. Everything you wear is drawn for each of them, so it all still fits.
const SHAPES = { BodyUpper: ["FlatSmall", "FlatMedium", "Small", "Normal", "Large", "XLarge"], BodyLower: ["Small", "Normal", "Large", "XLarge"] };
const SHAPE_KEY = "fhc-shape";   // { BodyUpper: { own, set }, BodyLower: { own, set } }: your own shape, and what the farm last made it
// shape: { up, low } = steps above (or below) your own shape; null or switched off = your own shape back. Returns what changed.
export function syncShape(shape, allow) {
  if (!P() || !Array.isArray(P().Appearance) || typeof window.ServerAppearanceBundle !== "function") return [];
  let mem; try { mem = JSON.parse(LS.getItem(SHAPE_KEY)) || {}; } catch (e) { mem = {}; }
  const next = bundle().map((b) => Object.assign({}, b)), did = [];
  for (const [group, steps] of [["BodyUpper", shape && allow ? Number(shape.up) || 0 : 0], ["BodyLower", shape && allow ? Number(shape.low) || 0 : 0]]) {
    const order = SHAPES[group], b = next.find((x) => x.Group === group); if (!b) continue;
    const m = mem[group];
    // changed it yourself since? then that's your own shape now
    const own = m && m.set === b.Name && order.includes(m.own) ? m.own : b.Name;
    const at = order.indexOf(own); if (at < 0) continue;
    const want = order[Math.max(0, Math.min(order.length - 1, at + Math.round(steps)))];
    if (typeof window.AssetGet === "function" && !window.AssetGet(P().AssetFamily, group, want)) continue;
    if (want !== b.Name) { b.Name = want; did.push(group + " " + want); }
    if (want === own) delete mem[group]; else mem[group] = { own, set: want };
  }
  try { LS.setItem(SHAPE_KEY, JSON.stringify(mem)); } catch (e) { /* fine */ }
  if (did.length) commit(next);
  return did;
}

// ── the scale trial (Oct 12), retired Oct 14 ──
// It set 15% bigger (ScaleX/ScaleY 1.15, TranslationY -12) on the chest and what was worn on it, to see if the game kept it.
const TRIAL_CLEAN = ["BodyUpper", "BodyLower", "Bra", "ItemNipples", "ItemBreast", "ItemTorso"];
// The trial's button is gone (Oct 14). Anyone who left it on gets it taken off once, quietly, when their Companion starts:
// only the trial's own exact numbers are touched, and nothing is sent unless something was there.
export function scaleTrialCleanup() {
  try {
    const C = P(); if (!C || !Array.isArray(C.Appearance)) return false;
    let n = 0;
    for (const it of C.Appearance) {
      if (!it || !it.Asset || !it.Asset.Group || !TRIAL_CLEAN.includes(it.Asset.Group.Name) || !it.Property) continue;
      if (it.Property.ScaleX === 1.15) { delete it.Property.ScaleX; n++; } if (it.Property.ScaleY === 1.15) { delete it.Property.ScaleY; n++; } if (it.Property.TranslationY === -12) { delete it.Property.TranslationY; n++; }
    }
    if (!n) return false;
    if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(C);
    if (typeof window.ChatRoomCharacterUpdate === "function" && window.CurrentScreen === "ChatRoom") window.ChatRoomCharacterUpdate(C);
    return true;
  } catch (e) { return false; }
}
// off with what the farm put on (the splatters and the writing), nothin' else
export function washMarks() {
  const mem = load(), stuck = lockedGroups();
  const next = bundle().filter((b) => stuck.has(b.Group) || !((b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group)) || (b.Name === "BodyWritings" && b.Group === mem.writeGroup) || (mem.treatise && b.Group === TREATISE.group)));
  save({});
  commit(next);
  return { ok: true, did: ["wash"] };
}

// ── Echo's Body Treatise (Nov 21) ──
// Laynie: "I keep getting disconnected", with everything turned off. Since the game's November update, every time the
// server hands your own character back, the game checks the Treatise, calls it unfinished, finds nothin' to change,
// and sends your whole look back up anyway. The server answers, and round it goes, till the server cuts you off for
// sendin' too much. So the farm doesn't write on it any more (the game's own body writing instead). One the farm put
// on you comes off once, when your Companion starts. One you put on yourself stays yours: once a week while you wear
// it, you're told what it's been doin', and where to take it off.
const TREATISE_NOTE_KEY = "fhc-treatise-note", WEEK = 7 * 86400000;
export function treatiseCleanup(note) {
  try {
    const C = P(); if (!C || !Array.isArray(C.Appearance) || typeof window.ServerAppearanceBundle !== "function") return { ok: false, did: [] };
    const mem = load(), on = C.Appearance.some((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === TREATISE.group);
    if (!on) { if (mem.treatise) { delete mem.treatise; save(mem); } return { ok: true, did: [] }; }
    if (mem.treatise && !lockedGroups().has(TREATISE.group)) {
      commit(bundle().filter((b) => b.Group !== TREATISE.group));
      delete mem.treatise; save(mem);
      if (note) note("The Body Treatise the farm wrote on you is off now. Since the game's November update it's been knockin' folks offline. The farm writes on your skin the game's own way instead.");
      return { ok: true, did: ["off"] };
    }
    let last = 0; try { last = Number(LS.getItem(TREATISE_NOTE_KEY)) || 0; } catch (e) { /* fine */ }
    if (Date.now() - last < WEEK) return { ok: true, did: [] };
    try { LS.setItem(TREATISE_NOTE_KEY, String(Date.now())); } catch (e) { /* fine */ }
    if (note) note("Heads up: you're wearin' Echo's Body Treatise. Since the game's November update it can make your game re-send your look over and over till the server drops you. If you keep gettin' disconnected, take it off in the wardrobe.");
    return { ok: true, did: ["told"] };
  } catch (e) { return { ok: false, did: [] }; }
}

// a rinse at the water (Oct 26): one patch of the farm's splatters comes off (never the writing)
export function rinseMarks() {
  const stuck = lockedGroups(), cur = bundle();
  const i = cur.findIndex((b) => b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group) && !stuck.has(b.Group));
  if (i < 0) return { ok: true, did: [] };
  cur.splice(i, 1); commit(cur);
  return { ok: true, did: ["rinse"] };
}

// ears (HairAccessory1-3), tails, wings: never stripped
export const BODY_BITS = /^(HairAccessory\d|TailStraps|Wings)$/;
// strip: clothes off (locked ones stay), kept on this computer · dress: back on
export function stripMe(prefs) {
  if (!prefs.strip) return { ok: false, why: "off" };
  const cur = bundle(), stuck = lockedGroups();
  if (!LS.getItem(STRIP_KEY)) { try { LS.setItem(STRIP_KEY, JSON.stringify({ at: Date.now(), bundle: cur })); } catch (e) { /* no storage: no dressin' back */ } }
  const mem = load();
  // (the farm's own marks stay on; and so do ears, tails, wings and hair bits: the game files them as clothes, but they're
  // part of who somebody is. Nikto's #14, Oct 11: "for me these items are considered part of the characters body")
  const next = cur.filter((b) => { const g = groupOf(b.Group); return !(g && g.Clothing) || stuck.has(b.Group) || BODY_BITS.test(b.Group) || b.Name === "BodyWritings" || b.Name === "Splatters" || b.Group === TREATISE.group; });
  if (next.length === cur.length) return { ok: false, why: "nothin' to take off" };
  commit(next);
  return { ok: true, did: ["strip"] };
}
export function dressMe() {
  let bk = null;
  try { bk = JSON.parse(LS.getItem(STRIP_KEY)); } catch (e) { /* none */ }
  if (!bk || !Array.isArray(bk.bundle)) return { ok: false, why: "no clothes kept" };
  const next = bundle(), have = new Set(next.map((b) => b.Group));
  for (const b of bk.bundle) { const g = groupOf(b.Group); if (g && g.Clothing && !have.has(b.Group)) next.push(b); }
  commit(next);
  try { LS.removeItem(STRIP_KEY); } catch (e) { /* fine */ }
  return { ok: true, did: ["dress"] };
}
