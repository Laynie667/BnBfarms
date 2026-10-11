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
  "Snare Hobble", "Pack's Knot", "Stud's Stopper", "Pillory Spreader", "Parasite Suckers", "Parasite Root"];
// slot → where it can go and which game item it is: the first that this game has; the pattern is a fallback
const GEAR_SLOTS = {
  plug:     { groups: ["ItemButt"], names: ["InflVibeButtPlug", "BlackButtPlug", "ButtPlug", "ButtPump"], re: /ButtPlug|Plug/, color: "#2B2B2B" },
  dildo:    { groups: ["ItemVulva"], names: ["InflatableVibeDildo", "VibratingDildo", "ClitoralStimulator"], re: /Dildo/, color: "#2B2B2B" },
  belt:     { groups: ["ItemPelvis"], names: ["PolishedChastityBelt", "LeatherChastityBelt", "SleekLeatherChastityBelt", "MetalChastityBelt"], re: /ChastityBelt/ },
  cups:     { groups: ["ItemNipples"], names: ["LactationPump", "NippleSuctionCups"], re: /Pump|Suction/ },
  leash:    { groups: ["ItemNeckRestraints"], names: ["CollarChainLong", "CollarLeash", "CollarChainShort"], re: /Chain|Leash/, needs: "ItemNeck" },
  funnel:   { groups: ["ItemMouth", "ItemMouth2", "ItemMouth3"], names: ["FunnelGag"], re: /Funnel/ },
  ropeArms: { groups: ["ItemArms"], names: ["HempRope"], re: /Rope/ },
  arms:     { groups: ["ItemArms"], names: ["HempRope", "LeatherCuffs"], re: /Rope|Cuffs/ },
  legs:     { groups: ["ItemLegs"], names: ["HempRope", "LeatherLegCuffs"], re: /Rope|Cuffs/ },
  ropeFeet: { groups: ["ItemFeet"], names: ["HempRope"], re: /Rope/ },
  lips:     { groups: ["ItemMouth", "ItemMouth2", "ItemMouth3"], names: ["LipGag"], re: /LipGag/, color: ["#E0607F", "#7A2B47", "#7A2B47"] },
};
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
  const cur = bundle(), stuck = lockedGroups(), did = { on: [], off: [] }, mem = gearMem();
  let next = cur.slice();
  // off: ours, and not on the list any more
  for (const b of cur) {
    const n = gearNameOf(b, mem);
    if (!n || want.some((g) => g.name === n) || stuck.has(b.Group)) continue;
    next = next.filter((x) => x !== b); did.off.push(n); delete mem[n];
  }
  for (const n of Object.keys(mem)) if (!want.some((g) => g.name === n) && !next.some((b) => gearNameOf(b, mem) === n)) delete mem[n];   // gone some other way
  // on: listed, and not on you
  for (const g of want) {
    if (next.some((b) => gearNameOf(b, mem) === g.name)) continue;
    const slot = GEAR_SLOTS[g.slot];
    if (slot.needs && !next.some((b) => b.Group === slot.needs)) continue;            // a chain needs a collar to clip to
    const group = slot.groups.find((x) => !next.some((b) => b.Group === x) && groupOf(x));
    if (!group) continue;                                                              // that spot's taken: it's on the farm's books just the same
    const item = gearAsset(group, slot, g.items);
    if (!item) continue;
    const color = (typeof g.color === "string" && /^#[0-9a-fA-F]{6}$/.test(g.color) ? g.color : null) || slot.color || "Default";
    const it = { Group: group, Name: item, Difficulty: 20, Property: {},
      Craft: { Item: item, Name: String(g.name).slice(0, 30), Description: (FARM_TAG + " " + String(g.desc || "").slice(0, 180)).trim(),
        Property: "Normal", Color: Array.isArray(color) ? color.join(",") : color, Lock: "", Private: true, MemberNumber: P().MemberNumber, MemberName: P().Name, ItemProperty: {}, Type: null, TypeRecord: null } };
    if (color !== "Default") it.Color = color;
    next.push(it); did.on.push(g.name); mem[g.name] = { group, item }; learnName(String(g.name).slice(0, 30));
  }
  gearMemSave(mem);
  if (did.on.length || did.off.length) commit(next);
  return did;
}

// off with what the farm put on (the splatters and the writing), nothin' else
export function washMarks() {
  const mem = load(), stuck = lockedGroups();
  const next = bundle().filter((b) => stuck.has(b.Group) || !((b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group)) || (b.Name === "BodyWritings" && b.Group === mem.writeGroup) || (mem.treatise && b.Group === TREATISE.group)));
  save({});
  commit(next);
  return { ok: true, did: ["wash"] };
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
