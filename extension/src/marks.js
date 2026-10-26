/* WHAT'S IN THIS FILE (marks.js)
   The farm marking YOUR body, done on your own screen (so the game always allows it), and only with your say-so:
   two switches in Toggles, both off until you turn them on:
     "Farm can mark my body"   splatters where loads land (the game's own Splatters, on your forehead, face, chest
                               and tummy, wherever there's room) and writing on your body (the game's BodyWritings:
                               three lines on your collarbone, ribs or hips)
     "Farm can strip me"       your clothes come off when the farm says so; they're kept so you can dress again
   ?wash (or the Companion's Wash up) takes off the splatters and the writing the farm put on you.
*/
const KEY = "fhc-marks";            // { splatGroup, writeGroup }: where the farm put things, so ?wash only takes those
const STRIP_KEY = "fhc-strip-backup";
const SPLAT_GROUPS = ["Mask", "FaceMarkings", "BodyMarkings"];     // Splatters fits any of these; the first free one is used
const WRITE_GROUPS = ["BodyMarkings", "ClothAccessory"];            // BodyWritings fits either
// Echo's Clothing Mod's Body Treatise (if they have it): 15 places, 3 lines each. Places 0-14 are collarbone,
// chest, ribs, waist, hips, each right / center / left. Module keys a..o turn a place on; its lines are
// Text{i*3+1}..Text{i*3+3}.
const TREATISE = { group: "BodyMarkings2_Luzi", name: "身体论文" };
const T_AREAS = { collar: [0, 1, 2], chest: [3, 4, 5], ribs: [6, 7, 8], waist: [9, 10, 11], hips: [12, 13, 14] };
const TALLY_PLACE = 11;   // waist left: the running tally lives here
// the Splatters item's parts, by area (module keys)
const AREAS = { forehead: ["a", "b", "c"], face: ["d", "e", "f"], chest: ["g", "h", "i", "j"], tummy: ["k", "l", "m", "n"] };
// a load runs: from the mouth down onto the breasts, from the breasts down the belly… (a third of the time)
const SPILL = { forehead: "face", face: "chest", chest: "tummy", tummy: "chest" };
const SPILL_CHANCE = 0.35;

const P = () => window.Player;
const load = () => { try { return JSON.parse(window.localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const save = (v) => { try { window.localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* fine */ } };
const groupOf = (name) => (typeof window.AssetGroupGet === "function" ? window.AssetGroupGet(P().AssetFamily, name) : null);
const bundle = () => window.ServerAppearanceBundle(P().Appearance);
const lockedGroups = () => new Set(P().Appearance.filter((it) => it.Property && it.Property.LockedBy).map((it) => it.Asset.Group.Name));
function commit(next) {
  window.ServerAppearanceLoadFromBundle(P(), P().AssetFamily, next, P().MemberNumber);
  if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(P());
  window.ChatRoomCharacterUpdate(P());
}
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
  // ── Body Treatise first (Echo's mod): a word in a free line near where it belongs, all over the body ──
  if ((m.write && cleanText(m.write.line)) || m.tally) {
    if (groupOf(TREATISE.group)) {
      let it = next.find((b) => b.Group === TREATISE.group && b.Name === TREATISE.name);
      if (!it && !has(TREATISE.group)) { it = { Group: TREATISE.group, Name: TREATISE.name, Property: { TypeRecord: {} } }; next.push(it); mem.treatise = true; }
      if (it) {
        const pr = it.Property = Object.assign({}, it.Property || {}), tr = pr.TypeRecord = Object.assign({}, pr.TypeRecord || {});
        const put = (place, line, text) => { pr["Text" + (place * 3 + line)] = cleanText(text).toUpperCase(); tr[String.fromCharCode(97 + place)] = 1; };
        if (m.tally) { put(TALLY_PLACE, 1, String(m.tally)); did.push("tally"); }
        if (m.write && cleanText(m.write.line)) {
          const pref = T_AREAS[m.write.area] || (m.write.pos !== undefined ? [Math.min(14, Number(m.write.pos))] : [13, 10, 4, 1, 7]);
          const all = [...pref, ...Array.from({ length: 15 }, (_, i) => i).filter((i) => !pref.includes(i) && i !== TALLY_PLACE)];
          let spot = null;
          for (const pl of all) { for (const ln of [1, 2, 3]) if (!pr["Text" + (pl * 3 + ln)]) { spot = [pl, ln]; break; } if (spot) break; }
          if (!spot) spot = [pref[0], 1 + Math.floor(Math.random() * 3)];   // covered all over: write over somethin'
          put(spot[0], spot[1], m.write.line); did.push("writing");
        }
        save(mem); commit(next);
        return { ok: true, did };
      }
    }
  }
  // ── a line written on the body (newest on top; three lines, the oldest drops off) ──
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
const FARM_NAMES = ["Parasite Lips", "Parasite Belt", "Pump Bung", "Egg Post Plug", "Slime Seal", "Boar's Plug", "Seed Pod Stem", "Denial Clamp", "Growth Cups",
  "Trap Milker", "Winch Chain", "Feed Chute", "Snare Rope", "Breedin' Frame Cuffs", "Kennel Lead", "The Water's Grip", "The Water's Coils", "Slime Sleeves", "Slime Stockings",
  "Snare Hobble", "Pack's Knot", "Stud's Stopper", "Pillory Spreader", "Parasite Suckers", "Parasite Root", "The Water's Embrace", "Brood Sac", "Grower's Sheath", "Glutton's Sleeve", "Tyrant's Cage", "Tyrant's Web",
  "Growin' Plug", "Hungry Belt", "Milkmaid's Cups", "Glutton's Funnel", "The Hobble", "Living Suit (legs)", "Living Suit (hips)", "Living Suit (chest)", "Living Suit (arms)", "Living Suit (mouth)",
  // Oct 15: the newer traps' equipment
  "Buckin' Saddle", "Saddle Post", "Hayloft Net", "Lost Cow Bell", "Teasin' Stall", "Sheep Dip", "Breedin' Crate", "Sire's Stopper", "Carousel Milkers", "Carousel Cuffs",
  "Plow Bit", "Plow Harness", "Bale Twine", "Scarecrow Post", "Scarecrow Ropes", "Clothespins", "Washin' Line", "Fair Stocks", "The Pillory", "Breedin' Wheel",
  "Windmill Sails", "Kissin' Gate", "The Fence", "Collection Bench", "Auction Block",
  "Vacuum Bed", "Vat Skin", "Vat Skin (hands)", "Doll Hood", "Doll Binder", "Doll Tag", "Stall Sheath", "Rubber Cups", "Inflatable Body Bag",
  "Dairymaid's Mitts", "Dairymaid's Muzzle", "Black Pool Latex (legs)", "Black Pool Latex (arms)", "Rubber Pup Hood", "Rubber Paws",
  "Livin' Latex (hands)", "Livin' Latex (arms)", "Livin' Latex (feet)", "Livin' Latex (legs)", "Livin' Latex (body)", "Livin' Latex (heels)", "Milk Moss", "Milk Moss (bloom)"];
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
};
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
  return homes.find((g) => slot.groups.includes(g) && !taken(g)) || homes.find((g) => !taken(g)) || null;
}
// set an item the way GEAR_OPT (or the piece) says, through the game's own extended-item setter
function setGearOpt(group, name, want) {
  try {
    const it = typeof window.InventoryGet === "function" ? window.InventoryGet(P(), group) : null;
    if (!it || it.Asset.Name !== name || typeof window.ExtendedItemGetData !== "function" || typeof window.ExtendedItemSetOptionByRecord !== "function") return false;
    const data = window.ExtendedItemGetData(it.Asset, it.Asset.Archetype);
    if (!data || data.archetype !== "typed" || !Array.isArray(data.options)) return false;
    const i = data.options.findIndex((o) => o.Name === want); if (i < 0) return false;
    window.ExtendedItemSetOptionByRecord(P(), it, { typed: i }, { push: true, refresh: true, C_Source: P() });
    return true;
  } catch (e) { console.warn("[Farmhand Companion] gear setting:", e); return false; }
}
function gearAsset(group, slot, prefer) {
  const fam = P().AssetFamily, get = (n) => { try { return typeof window.AssetGet === "function" ? window.AssetGet(fam, group, n) : null; } catch (e) { return null; } };
  for (const n of (Array.isArray(prefer) ? prefer.map(String) : [])) if (/^[A-Za-z0-9_]{2,40}$/.test(n) && get(n)) return n;   // the piece's own choice, if this game has it there
  for (const n of slot.names) if (get(n)) return n;
  const all = Array.isArray(window.Asset) ? window.Asset : [];
  const hit = all.find((a) => a && a.Group && a.Group.Name === group && slot.re.test(a.Name) && !a.OwnerOnly && !a.LoverOnly && !a.FamilyOnly);
  return hit ? hit.Name : (typeof window.AssetGet !== "function" ? slot.names[0] : null);
}
const NAMES_KEY = "fhc-gear-names";
const knownNames = () => { try { return FARM_NAMES.concat(JSON.parse(window.localStorage.getItem(NAMES_KEY)) || []); } catch (e) { return FARM_NAMES; } };
const learnName = (n) => { try { const have = JSON.parse(window.localStorage.getItem(NAMES_KEY)) || []; if (!FARM_NAMES.includes(n) && !have.includes(n)) window.localStorage.setItem(NAMES_KEY, JSON.stringify(have.concat(n).slice(-80))); } catch (e) { /* fine */ } };
const isFarmGear = (b) => { const c = b.Craft, d = c ? String(c.Description || "") : ""; return !!(c && (d.includes(FARM_TAG) || d.includes(OLD_TAG) || (knownNames().includes(c.Name) && (!c.MemberNumber || c.MemberNumber === P().MemberNumber)))); };
// what we put where, kept on this computer too: if the game ever hands an item back without its crafted name,
// we still know it's ours and can take it off again
const GEAR_KEY = "fhc-gear";
const gearMem = () => { try { return JSON.parse(window.localStorage.getItem(GEAR_KEY)) || {}; } catch (e) { return {}; } };
const gearMemSave = (m) => { try { window.localStorage.setItem(GEAR_KEY, JSON.stringify(m)); } catch (e) { /* fine */ } };
const gearNameOf = (b, mem) => (isFarmGear(b) ? b.Craft.Name : (Object.keys(mem).find((n) => mem[n].group === b.Group && mem[n].item === b.Name && (!(b.Craft && b.Craft.Name) || b.Craft.Name === n)) || null));
// list: [{ slot, name, desc, color, always }] · allow: trap gear is switched on. Returns what it did.
export function syncFarmGear(list, allow) {
  if (!P() || !Array.isArray(P().Appearance) || typeof window.ServerAppearanceBundle !== "function") return { on: [], off: [] };
  const want = (Array.isArray(list) ? list : []).filter((g) => g && GEAR_SLOTS[g.slot] && (g.always || allow) && (!g.until || g.until > Date.now()));
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
    const slot = GEAR_SLOTS[g.slot];
    if (slot.needs && !next.some((b) => b.Group === slot.needs)) continue;            // a chain needs a collar to clip to
    let group = slot.groups.find((x) => !next.some((b) => b.Group === x) && groupOf(x)), was = null, item = null;
    // the piece's own item first, in whichever spot it lives (a spreader bar asked for in "legs" goes to the ankles)
    for (const n of (Array.isArray(g.items) ? g.items.map(String) : [])) {
      if (!/^[A-Za-z0-9_-]{2,40}$/.test(n)) continue;
      const home = itemHome(n, slot, (x) => next.some((b) => b.Group === x) || stuck.has(x) || !groupOf(x));
      if (home) { group = home; item = n; break; }
    }
    if (!group && slot.takeover) {
      group = slot.groups.find((x) => groupOf(x) && !stuck.has(x) && next.some((b) => b.Group === x && !gearNameOf(b, mem)));
      if (group) { was = next.find((b) => b.Group === group); next = next.filter((b) => b !== was); }
    }
    if (!group) continue;                                                              // that spot's taken: it's on the farm's books just the same
    if (!item) item = gearAsset(group, slot, g.items);
    if (!item) { if (was) next.push(was); continue; }   // (nothing to put there after all: theirs stays)
    const color = (typeof g.color === "string" && /^#[0-9a-fA-F]{6}$/.test(g.color) ? g.color : null) || slot.color || "Default";
    const it = { Group: group, Name: item, Difficulty: 20, Property: {},
      Craft: { Item: item, Name: String(g.name).slice(0, 30), Description: (FARM_TAG + " " + String(g.desc || "").slice(0, 180)).trim(),
        Property: "Normal", Color: Array.isArray(color) ? color.join(",") : color, Lock: "", Private: true, MemberNumber: P().MemberNumber, MemberName: P().Name, ItemProperty: {}, Type: null, TypeRecord: null } };
    if (color !== "Default") it.Color = color;
    next.push(it); did.on.push(g.name); mem[g.name] = was ? { group, item, was: JSON.parse(JSON.stringify(was)) } : { group, item }; learnName(String(g.name).slice(0, 30));
    const opt = (typeof g.opt === "string" && g.opt) || GEAR_OPT[group + ":" + item];
    if (opt) setLater.push([group, item, opt]);
  }
  gearMemSave(mem);
  if (did.on.length || did.off.length) commit(next);
  // and set the way they're meant to be (cuffs chained, the spreader wide), once they're on
  for (const [gr, nm, op] of setLater) setGearOpt(gr, nm, op);
  return did;
}

// ── a body that shows its size ──
// The game's own body sizes, smallest to biggest. Everything you wear is drawn for each of them, so it all still fits.
const SHAPES = { BodyUpper: ["FlatSmall", "FlatMedium", "Small", "Normal", "Large", "XLarge"], BodyLower: ["Small", "Normal", "Large", "XLarge"] };
const SHAPE_KEY = "fhc-shape";   // { BodyUpper: { own, set }, BodyLower: { own, set } }: your own shape, and what the farm last made it
// shape: { up, low } = steps above (or below) your own shape; null or switched off = your own shape back. Returns what changed.
export function syncShape(shape, allow) {
  if (!P() || !Array.isArray(P().Appearance) || typeof window.ServerAppearanceBundle !== "function") return [];
  let mem; try { mem = JSON.parse(window.localStorage.getItem(SHAPE_KEY)) || {}; } catch (e) { mem = {}; }
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
  try { window.localStorage.setItem(SHAPE_KEY, JSON.stringify(mem)); } catch (e) { /* fine */ }
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

// a rinse at the water (Oct 26): one patch of the farm's splatters comes off (never the writing)
export function rinseMarks() {
  const stuck = lockedGroups(), cur = bundle();
  const i = cur.findIndex((b) => b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group) && !stuck.has(b.Group));
  if (i < 0) return { ok: true, did: [] };
  cur.splice(i, 1); commit(cur);
  return { ok: true, did: ["rinse"] };
}

// strip: clothes off (locked ones stay), kept on this computer · dress: back on
export function stripMe(prefs) {
  if (!prefs.strip) return { ok: false, why: "off" };
  const cur = bundle(), stuck = lockedGroups();
  if (!window.localStorage.getItem(STRIP_KEY)) { try { window.localStorage.setItem(STRIP_KEY, JSON.stringify({ at: Date.now(), bundle: cur })); } catch (e) { /* no storage: no dressin' back */ } }
  const mem = load();
  const next = cur.filter((b) => { const g = groupOf(b.Group); return !(g && g.Clothing) || stuck.has(b.Group) || b.Name === "BodyWritings" || b.Name === "Splatters" || b.Group === TREATISE.group; });   // the farm's own marks stay on
  if (next.length === cur.length) return { ok: false, why: "nothin' to take off" };
  commit(next);
  return { ok: true, did: ["strip"] };
}
export function dressMe() {
  let bk = null;
  try { bk = JSON.parse(window.localStorage.getItem(STRIP_KEY)); } catch (e) { /* none */ }
  if (!bk || !Array.isArray(bk.bundle)) return { ok: false, why: "no clothes kept" };
  const next = bundle(), have = new Set(next.map((b) => b.Group));
  for (const b of bk.bundle) { const g = groupOf(b.Group); if (g && g.Clothing && !have.has(b.Group)) next.push(b); }
  commit(next);
  try { window.localStorage.removeItem(STRIP_KEY); } catch (e) { /* fine */ }
  return { ok: true, did: ["dress"] };
}
