/* WHAT'S IN THIS FILE (shared/ink/ink.js)
   FARM INK: four ink slots and a brand slot in the game's own wardrobe, the way Echo's mod adds its slots (Laynie, Nov 17:
   "if we can add a few branding slots into the wardrobe too, like echoes adds wardrobe slots, that would be cool too. then
   players can select tattoos and place them their selves if the wanted too as parts of different outfits").

   • Five new slots: Farm Ink 1 to 4, and Farm Brand. Every design from the tattoo sheets is an item in them, free to wear.
   • They're ordinary pictures, so the game's own Layering button places them: move, scale, turn, and over or under
     anything else. They save in wardrobe outfits like any item, and the colour picker re-inks them (a brand's three
     layers are its dark edge, angry core and shine: fresh or healed).
   • They sit on the skin, under clothes, unless someone moves them up.
   • The pictures live in the public repo (ink/v1/) and load from GitHub, like the add-ons do.
   • Only people running the Companion or the Dispensary see them (whichever loads first adds the slots, once), the
     same as Echo's clothes only show for people with Echo's mod. Everyone else sees plain skin.
   • The game draws the front only, so designs meant for the back (a tramp stamp, a butt cheek) start on the hip.
   • THE LIVE ONES (step 2, Nov 17; live.js): 28 designs that print the wearer's own. A count from the farm's books, their
     number, a name, a date, their own words. They're drawn on the spot from what's written on the item (Property.FarmInk),
     so everybody with an add-on sees the same. The farm's counts are written on as they change (the Companion hands
     them over: counts); names and words with /ink. Days without cummin' is counted here, on the wearer's own game.
   • THE FARM'S OWN INK (Nov 18, farmInkSync): what the farm says should be inked on somebody (its brand, their species'
     brand, the corruption's words) goes in their brand slot or a free ink slot, by their own game, if they've switched
     "Farm can ink me" on. A brand heals from angry red to pale over three days; marker wears off in hours, henna in a week.
   • THE FARM'S MARKS (Nov 18, Laynie: "we can include hidden slots the farm uses, that can be removed with ?wash unless
     permanently branded"): three more slots, Farm Mark 1 to 3, that the wardrobe doesn't show (the game's own
     AllowCustomize: false, the way it keeps the arms and hands out of it). What a trap leaves on you goes there, never
     in your own slots. Each sits at its own spot on your other side (hip, thigh, shoulder), so it isn't on your brand.
   • TROPHIES (Nov 18, Laynie: "it should be offered, and if its a permanent trophy, have a way to equip or take it off
     at any time"): live ink the farm hands out when somethin' first happens to you. The Companion offers it; on, it's
     in a free Farm Ink slot (or one you pick), marked a trophy, and keeps the farm's count. Off and on again any time.
*/
import LIST from "./ink-designs.json";
import { LIVE_BY, isLive, valuesFor, picture, loadLiveArt, cleanValues } from "./live.js";
import { openInkPanel } from "./panel.js";

export const INK_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/";
const LIVE_HOST = INK_HOST + "live/";   // (no pictures there: a live design's address, for us to draw in its place)
export const INK_SLOTS = ["FarmInk1", "FarmInk2", "FarmInk3", "FarmInk4"];
export const BRAND_SLOT = "FarmBrand";
export const MARK_SLOTS = ["FarmMark1", "FarmMark2", "FarmMark3"];
const ALL_SLOTS = [...INK_SLOTS, BRAND_SLOT, ...MARK_SLOTS];
const SLOT_NAMES = { FarmInk1: "Farm Ink 1", FarmInk2: "Farm Ink 2", FarmInk3: "Farm Ink 3", FarmInk4: "Farm Ink 4", FarmBrand: "Farm Brand", FarmMark1: "Farm Mark 1", FarmMark2: "Farm Mark 2", FarmMark3: "Farm Mark 3" };
const RES = LIST.res || 1;
const OURS = /\/ink[^/]*\/(?:v\d+\/)?Farm(?:Ink|Brand)\//;   // one of our pictures (from the repo, or a local copy in a test)
const LIVE_SRC = /\/live\/(Farm(?:Ink[1-4]|Brand))\/(Live[A-Za-z]+)_([A-Za-z0-9]+)\.png$/;   // a live design, drawn here
const STILL_SRC = /\/(Farm(?:Ink|Brand))\/([A-Za-z0-9]+)_([A-Za-z0-9]+)\.png$/;   // one of the still ones: its kind, its name and the layer
const MARK_SRC = /\/(FarmMark[1-3])\/([A-Za-z0-9]+)_([A-Za-z0-9]+)\.png$/;          // one of the farm's marks: an address of our own, drawn from the brand's picture
// the item a still picture belongs to (the same design in two slots shares the first one's size)
const stillItem = (C, kind, name) => (C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Name === name && it.Asset.Group && kindOf(it.Asset.Group.Name) === kind) : null);
const PRIORITY = 11;   // on the skin (the body and the game's own body markings are under 11), under socks, underwear and clothes
const kindOf = (slot) => (slot === BRAND_SLOT ? "FarmBrand" : /^FarmInk[1-4]$/.test(String(slot)) ? "FarmInk" : null);
const isMark = (slot) => MARK_SLOTS.includes(slot);
const ours = (slot) => !!kindOf(slot) || isMark(slot);
const picKind = (slot) => (isMark(slot) ? "FarmBrand" : kindOf(slot));   // the folder its pictures are in (a mark: the brands')
export const isInkSlot = (slot) => !!kindOf(slot);
// K: each design's starting size (Nov 18, Laynie: "does that tattoos sizing and placement seem esthetically and visibly the
// right scale per tattoo for the defaults?"): fitted to a box for its spot, width and height, so long lettering gets room
const TITLES = {}, MANIFEST = {}, K = {};
for (const kind of ["FarmInk", "FarmBrand"]) for (const a of LIST.groups[kind]) { TITLES[kind + ":" + a.name] = a.title; if (a.live) MANIFEST[a.name] = a; if (a.k && a.k !== 1) K[kind + ":" + a.name] = a.k; }
// where the farm's marks sit (centre x, y on the 500-wide body, and the spot's box, like the wardrobe's own): on your
// other side from where your own ink starts, so a mark is never on your brand
const MARK_AT = { FarmMark1: [296, 580, 54, 48], FarmMark2: [292, 662, 50, 64], FarmMark3: [318, 300, 36, 38] };
const MK = {};
for (const slot of MARK_SLOTS) for (const a of LIST.groups.FarmBrand) { const [, , bw, bh] = MARK_AT[slot]; MK[slot + ":" + a.name] = Math.round(Math.max(0.3, Math.min(1.2, Math.min(bw / (a.w / RES), bh / (a.h / RES)))) * 100) / 100; }
const kOf = (it) => { const g = it && it.Asset && it.Asset.Group && it.Asset.Group.Name; if (!g) return 1; return (isMark(g) ? MK[g + ":" + it.Asset.Name] : K[kindOf(g) + ":" + it.Asset.Name]) || 1; };

function assetDef(a) {
  return {
    Name: a.name, Random: false, Value: 0, Left: a.left, Top: a.top,
    DefaultColor: a.layers.filter((l) => l.colorize).map((l) => l.color),   // (the game up to R133 reads the starting colours here...)
    PoseMapping: { AllFours: "Hide", Hogtied: "Hide" },   // (the body's drawn another way in those: the ink would float)
    // (...and from R134 on, off each layer: without its own Color every layer started "Default", plain grey. Nov 18)
    Layer: a.layers.map((l) => (l.colorize ? { Name: l.name, AllowColorize: true, Color: [l.color] } : { Name: l.name, AllowColorize: false })),
  };
}
function groupDef(slot) {
  return { Group: slot, Priority: PRIORITY, Default: false, Random: false, BodyCosplay: true, Clothing: false, AllowNone: true,
    Color: ["Default"], Asset: LIST.groups[kindOf(slot)].map(assetDef) };
}
// a farm's mark slot: the brands, each moved to this slot's spot; not in the wardrobe (AllowCustomize: false)
function markDef(slot) {
  const [cx, cy] = MARK_AT[slot];
  return { Group: slot, Priority: PRIORITY, Default: false, Random: false, BodyCosplay: true, Clothing: false, AllowNone: true, AllowCustomize: false,
    Color: ["Default"], Asset: LIST.groups.FarmBrand.map((a) => Object.assign(assetDef(a), { Left: Math.round(cx - a.w / 2), Top: Math.round(cy - a.h / 2) })) };
}
// the slots' and designs' names in the wardrobe (the game sets "MISSING DESCRIPTION" on anything its own list doesn't have)
function describe(W) {
  for (const slot of ALL_SLOTS) {
    const G = W.AssetGroupMap && W.AssetGroupMap.get(slot); if (!G) continue;
    G.Description = SLOT_NAMES[slot];
    for (const A of G.Asset || []) { const t = TITLES[picKind(slot) + ":" + A.Name]; if (t) A.Description = t; }
  }
}
const gameReady = (W) => typeof W.AssetGroupAdd === "function" && typeof W.AssetAdd === "function" && W.AssetGroupMap && W.AssetGroupMap.size > 30;
function addSlots(W) {
  let added = false;
  for (const slot of ALL_SLOTS) {
    if (W.AssetGroupMap.has(slot)) continue;   // (the other add-on, or an older copy of this, put it there already)
    const def = isMark(slot) ? markDef(slot) : groupDef(slot), G = W.AssetGroupAdd("Female3DCG", def);
    for (const a of def.Asset) W.AssetAdd(G, a, W.AssetFemale3DCGExtended || {}, def);
    added = true;
  }
  describe(W);
  return added;
}

// ── the live designs ──
const itemIn = (C, slot) => (C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot) : null);
// whose it is: their number, and their owner's name (what a live design shows when nothin's written on it)
const whoOf = (C) => ({ num: C && C.MemberNumber, owner: C && C.Ownership && typeof C.Ownership.Name === "string" ? C.Ownership.Name : "" });
function liveSrc(W, C, slot, name, layer) {
  const d = LIVE_BY[name], m = MANIFEST[name], it = itemIn(C, slot);
  if (!d || !m || !it || it.Asset.Name !== name) return null;
  try { return picture(W, d, m, layer, valuesFor(d, it.Property && it.Property.FarmInk, whoOf(C))); } catch (e) { console.warn("[Farm ink] couldn't draw " + name, e); return null; }
}
// the live designs you're wearin': [{ slot, name, item }]
function wornLive(W) { const P = W.Player, out = []; for (const slot of [...INK_SLOTS, BRAND_SLOT]) { const it = itemIn(P, slot); if (it && isLive(it.Asset.Name)) out.push({ slot, name: it.Asset.Name, item: it }); } return out; }
// write on one of yours (merged with what's there; null takes a thing off), and let the room see it
const lastWrite = {};
function write(W, slot, values, now) {
  const it = itemIn(W.Player, slot);
  if (!it || !kindOf(slot)) return false;   // (any of ours: a size on any, words and counts on a live one)
  const cur = (it.Property && it.Property.FarmInk) || {}, merged = Object.assign({}, cur, values);
  for (const k of Object.keys(merged)) if (merged[k] == null) delete merged[k];
  const next = cleanValues(merged);
  if (merged.manual === true) next.manual = true;
  if (JSON.stringify(next) === JSON.stringify(cur)) return false;
  // the farm's counts go on at most once a minute a slot (a count can't jump about faster than anybody would notice)
  const since = Date.now() - (lastWrite[slot] || 0);
  if (!now && since < 60000) { clearTimeout(retry[slot]); retry[slot] = setTimeout(() => refreshAuto(W), 60500 - since); return false; }
  lastWrite[slot] = Date.now();
  it.Property = Object.assign({}, it.Property, { FarmInk: next });
  try { if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(W.Player); } catch (e) { /* fine */ }
  try { if (typeof W.ChatRoomCharacterItemUpdate === "function") W.ChatRoomCharacterItemUpdate(W.Player, slot); } catch (e) { /* not in a room */ }
  return true;
}
const retry = {};
// the farm's counts (the Companion hands them over from the farm girl's books) and days without cummin' (counted here)
let counts = {};
const DAY = 86400000;
const cumKey = (W) => "farmink-lastcum-" + (W.Player && W.Player.MemberNumber);
function daysDenied(W) { let t = 0; try { t = Number(W.localStorage.getItem(cumKey(W))) || 0; } catch (e) { /* fine */ } return t ? Math.max(0, Math.floor((Date.now() - t) / DAY)) : 0; }
function autoOf(W, auto) {
  if (auto === "denied") return { n: daysDenied(W) };
  const c = counts[auto];
  if (auto === "studs") return c && Array.isArray(c.list) ? { list: c.list, more: c.more || null } : null;
  if (auto === "scores") return Array.isArray(c) ? { rows: c } : null;
  if (auto === "bredOn") return c && c.d ? { d: c.d, due: c.due || null } : null;
  if (auto === "passport") return Array.isArray(c) && c.length ? { list: c } : null;   // where the last four traps had you (Nov 18)
  return typeof c === "number" ? { n: c } : null;
}
function refreshAuto(W) {
  for (const { slot, name, item } of wornLive(W)) {
    const d = LIVE_BY[name], own = item.Property && item.Property.FarmInk;
    if (!d.auto || (own && own.manual)) continue;
    const v = autoOf(W, d.auto);
    if (v) write(W, slot, v);
  }
}

// ── THE FARM'S OWN INK (Nov 18) ──
// Laynie: "Farm can ink me" is its own switch (splatters and words without permanent ink, or the other way round); a
// fresh brand heals pale over three days, marker wears off in a few hours, henna in a week ("seems good to me").
// The farm girl's panel state says what should be on you (farmInk: [{ id, slot: "brand"|"ink", design, at, heal, fade,
// keep, color, values }]). Your own game puts each on once, in the brand slot (empty, or holding the farm's own) or the
// first empty ink slot, never over ink you picked, and marks it the farm's (Property.FarmInk.farm = its id). Take one
// off yourself and it stays off, unless the farm keeps it (the corruption's: back by mornin'). The farm's list
// dropping it, or the switch going off, takes it back off. Healing and fading are worked out as it's drawn, on every
// screen, from when it went on: nothin' goes round the room for them.
const HEALED = { BrandEdge: [150, 96, 88], Brand: [226, 184, 172], BrandShine: [246, 226, 218] };   // a healed brand: pale and raised, pink at the edge
export const FADE_OF = { UseMeFreshMarker: 6 * 3600000, HennaTrail: 7 * DAY };                      // marker: a few hours; henna: a week
export const HEAL_MS = 3 * DAY;
const hexRGB = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || "")); if (!m) return null; const v = parseInt(m[1], 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
const toHex = (c) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
// how far along a piece is: healed (0 fresh … 1 healed), and how much of it is left (1 … 0: a fade holds, then goes in its last two fifths)
export function ageOf(f, now) {
  const at = Number(f && f.at) || 0; if (!at) return null;
  const h = Number(f.heal) || 0, fd = Number(f.fade) || 0, t = (now || Date.now()) - at;
  const heal = h > 0 ? Math.max(0, Math.min(1, t / h)) : null, gone = fd > 0 ? Math.max(0, Math.min(1, t / fd)) : 0;
  return { heal, alpha: gone < 0.6 ? 1 : Math.max(0, 1 - (gone - 0.6) / 0.4), done: fd > 0 && t >= fd, still: (heal != null && heal < 1) || (fd > 0 && t < fd) };
}
// a brand layer's colour, healed as far as it's got
export function healedHex(hex, layer, p) {
  const to = HEALED[layer], c = hexRGB(hex); if (!to || !c || p == null || p <= 0) return hex;
  const e = p * p * (3 - 2 * p); return toHex(c.map((v, i) => v + (to[i] - v) * e));
}
const DESIGNS = { brand: new Set(LIST.groups.FarmBrand.map((a) => a.name)), ink: new Set(LIST.groups.FarmInk.map((a) => a.name)) };
DESIGNS.mark = DESIGNS.brand;   // (a farm's mark is one of the brands)
const LAYERS_OF = {}; for (const kind of ["FarmInk", "FarmBrand"]) for (const a of LIST.groups[kind]) LAYERS_OF[kind + ":" + a.name] = a.layers.filter((l) => l.colorize).map((l) => l.color);
const farmOf = (it) => { const f = it && it.Property && it.Property.FarmInk; return f && typeof f.farm === "string" ? f.farm : null; };
const doneKey = (W) => "farmink-done-" + (W.Player && W.Player.MemberNumber);
const KEEP_AGAIN = 20 * 3600000;   // the farm's kept ink, taken off: back by mornin'
function cleanEntry(e) {
  if (!e || typeof e !== "object" || typeof e.id !== "string" || !/^[\w:.-]{1,48}$/.test(e.id)) return null;
  const slot = e.slot === "brand" ? "brand" : e.slot === "ink" ? "ink" : e.slot === "mark" ? "mark" : null; if (!slot || !DESIGNS[slot].has(e.design)) return null;
  const n = (v, max) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? Math.min(max, Math.round(x)) : 0; };
  const color = Array.isArray(e.color) ? e.color.filter((c) => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c)).slice(0, 8) : null;
  return { id: e.id, slot, design: e.design, at: n(e.at, 4e12), heal: n(e.heal, 60 * DAY), fade: n(e.fade, 60 * DAY) || FADE_OF[e.design] || 0, keep: !!e.keep, color: color && color.length ? color : null, values: e.values && typeof e.values === "object" ? e.values : null };
}
// make what you wear match the farm's list. list: the farm girl's (null: she's said nothin', leave it be); on: "Farm can ink me".
// opts.hard: in hardcore (The Farmhand's Dispensary), the farm's ink pulled off goes straight back on (approved Nov 17:
// "ink a contract or hardcore says stays is put back if someone takes it off").
// A mark (slot "mark", what a trap leaves) goes in the farm's own hidden slots, never yours: the first empty one, else in
// place of the oldest. You can't take one off yourself (only ?wash, through the farm girl), so one that's gone missin'
// (an outfit put on over it) just goes back.
// Gives { put, off, full, taken, marked } (designs), or null when nothin' could be done (not in the game yet).
export function farmInkSync(W, list, on, now, opts) {
  const hard = !!(opts && opts.hard);
  const P = W.Player; if (!P || !Array.isArray(P.Appearance) || !Array.isArray(list) || typeof W.InventoryWear !== "function") return null;
  now = now || Date.now();
  const want = on ? list.map(cleanEntry).filter(Boolean) : [], ids = new Set(want.map((e) => e.id)), out = { put: [], off: [], full: [], taken: [], marked: [] }, changed = [];
  let done = {}; try { done = JSON.parse(W.localStorage.getItem(doneKey(W))) || {}; } catch (e) { done = {}; }
  const remove = (slot) => { try { if (typeof W.InventoryRemove === "function") W.InventoryRemove(P, slot, false); else P.Appearance = P.Appearance.filter((it) => !(it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot)); } catch (e) { return false; } changed.push(slot); return true; };
  // off: the farm's pieces it no longer wants (or you've switched it off), and anything faded right out
  for (const slot of ALL_SLOTS) {
    const it = itemIn(P, slot), id = farmOf(it); if (!id) continue;
    const a = ageOf(it.Property.FarmInk, now);
    if (!ids.has(id) || (a && a.done)) { if (remove(slot)) out.off.push(it.Asset.Name); if (a && a.done) done[id] = now; }
  }
  // on: what it wants that isn't on you
  for (const e of want) {
    if (ALL_SLOTS.some((s) => farmOf(itemIn(P, s)) === e.id)) continue;
    const mark = e.slot === "mark";
    if (!mark && done[e.id] && !hard && !(e.keep && now - done[e.id] > KEEP_AGAIN)) continue;   // put on once: you took it off, it stays off (not in hardcore)
    if (e.fade && e.at && now - e.at >= e.fade) continue;                      // worn off already
    let slot = null;
    if (mark) { const atOf = (s) => { const f = farmOf(itemIn(P, s)) && itemIn(P, s).Property.FarmInk; return (f && f.at) || 0; }; slot = MARK_SLOTS.find((s) => !itemIn(P, s)) || MARK_SLOTS.slice().sort((a, b) => atOf(a) - atOf(b))[0]; }
    else if (e.slot === "brand") { const it = itemIn(P, BRAND_SLOT); if (!it || farmOf(it)) slot = BRAND_SLOT; else { out.taken.push(e.design); continue; } }
    else { slot = INK_SLOTS.find((s) => !itemIn(P, s)) || null; if (!slot) { out.full.push(e.design); continue; } }
    if (itemIn(P, slot)) remove(slot);
    const kind = picKind(slot), color = e.color || LAYERS_OF[kind + ":" + e.design] || "Default";
    try { W.InventoryWear(P, e.design, slot, color, 0, P.MemberNumber, null, false); } catch (err) { continue; }
    const it = itemIn(P, slot); if (!it || it.Asset.Name !== e.design) continue;
    it.Property = Object.assign({}, it.Property, { FarmInk: cleanValues(Object.assign({}, e.values || {}, { farm: e.id, at: e.at || now, heal: e.heal || null, fade: e.fade || null, keep: e.keep || null })) });
    if (mark) { if (!done[e.id]) out.marked.push(e.design); } else out.put.push(e.design);   // (a mark back on after an outfit: not news)
    done[e.id] = now; changed.push(slot);
  }
  // remembered for 60 days past the farm forgettin' it
  for (const k of Object.keys(done)) if (!ids.has(k) && now - done[k] > 60 * DAY) delete done[k];
  try { W.localStorage.setItem(doneKey(W), JSON.stringify(done)); } catch (e) { /* fine */ }
  if (changed.length) {
    try { if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(P); } catch (e) { /* fine */ }
    try { if (typeof W.ChatRoomCharacterUpdate === "function") W.ChatRoomCharacterUpdate(P); } catch (e) { /* not in a room */ }
  }
  return out;
}
// is the farm's brand in your brand slot (then it isn't drawn a second time by the Companion's old way)
export const farmBrandWorn = (W) => { const id = farmOf(itemIn(W.Player, BRAND_SLOT)); return !!(id && /^brand:/.test(id)); };
// GLOW INK THAT ONLY SHOWS WHILE YOU'RE DOSED (approved Nov 17, "conditional glow"): the UV ink is there all the time and
// shows only while somethin' from The Farmhand's Dispensary is in you. Your own Dispensary knows what's in you, and
// everybody else's from your dose icons (so it shows for people with the Dispensary, and not if you've switched off
// lettin' others see your icons). Without a Dispensary nobody can tell, and it stays hidden.
export const DOSED_ONLY = new Set(["GlowSlutGlowInk"]);
const dosed = (W, C) => { try { const D = W.FarmhandDispensary; return !!(D && typeof D.dosedOf === "function" && C && D.dosedOf(C.MemberNumber)); } catch (e) { return false; } };
const wearsDosedOnly = (C) => ALL_SLOTS.some((s) => { const it = itemIn(C, s); return !!(it && DOSED_ONLY.has(it.Asset.Name)); });
// somebody whose farm ink is still healin' or fadin': drawn again now and then, so it moves along on every screen
const stillChanging = (C, now) => ALL_SLOTS.some((s) => { const it = itemIn(C, s), f = farmOf(it) && it.Property.FarmInk, a = f && ageOf(f, now); return !!(a && a.still); });

// ── TROPHIES (Nov 18) ──
// The farm hands out live ink when somethin' first happens to you (the farm girl's panel state: trophies). Your
// Companion offers each one; Wear it puts it in a free Farm Ink slot (or the one you pick, over what's there), marked
// as a trophy (Property.FarmInk.trophy), with the farm's count on it, kept up like any live design's. The farm's own
// ink never takes it off. Take it off and put it on again whenever you like.
const trophyOf = (it) => { const f = it && it.Property && it.Property.FarmInk; return f && typeof f.trophy === "string" ? f.trophy : null; };
export function trophyWorn(W) { const o = {}; for (const s of INK_SLOTS) { const id = trophyOf(itemIn(W.Player, s)); if (id) o[id] = s; } return o; }
const roomSees = (W, P) => {
  try { if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(P); } catch (e) { /* fine */ }
  try { if (typeof W.ChatRoomCharacterUpdate === "function") W.ChatRoomCharacterUpdate(P); } catch (e) { /* not in a room */ }
};
export function trophyWear(W, t, slot) {
  const P = W.Player; if (!P || !Array.isArray(P.Appearance) || typeof W.InventoryWear !== "function") return { ok: false, why: "you're not in the game yet" };
  if (!t || typeof t.id !== "string" || !/^[a-z0-9-]{1,24}$/.test(t.id) || !LIVE_BY[t.design] || !DESIGNS.ink.has(t.design)) return { ok: false, why: "that isn't a trophy the farm gives" };
  const worn = trophyWorn(W); if (worn[t.id]) return { ok: true, slot: worn[t.id], already: true };
  if (slot != null && !INK_SLOTS.includes(slot)) return { ok: false, why: "there's no slot by that name" };
  slot = slot || INK_SLOTS.find((s) => !itemIn(P, s));
  if (!slot) return { ok: false, full: true, why: "your four Farm Ink slots are full", slots: INK_SLOTS.map((s) => { const it = itemIn(P, s); return { slot: s, name: SLOT_NAMES[s], title: it ? TITLES["FarmInk:" + it.Asset.Name] || it.Asset.Name : "" }; }) };
  if (itemIn(P, slot)) { try { W.InventoryRemove(P, slot, false); } catch (e) { return { ok: false, why: "what's in " + SLOT_NAMES[slot] + " wouldn't come off" }; } }
  try { W.InventoryWear(P, t.design, slot, LAYERS_OF["FarmInk:" + t.design] || "Default", 0, P.MemberNumber, null, false); } catch (e) { return { ok: false, why: "the game wouldn't take it" }; }
  const it = itemIn(P, slot); if (!it || it.Asset.Name !== t.design) return { ok: false, why: "the game wouldn't take it" };
  const d = LIVE_BY[t.design], v = d.auto ? autoOf(W, d.auto) : null;
  it.Property = Object.assign({}, it.Property, { FarmInk: cleanValues(Object.assign({}, v || {}, { trophy: t.id })) });
  roomSees(W, P);
  return { ok: true, slot, name: SLOT_NAMES[slot] };
}
export function trophyOff(W, id) {
  const P = W.Player, slot = P && trophyWorn(W)[id]; if (!slot) return { ok: true, already: true };
  try { if (typeof W.InventoryRemove === "function") W.InventoryRemove(P, slot, false); else P.Appearance = P.Appearance.filter((it) => !(it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot)); } catch (e) { return { ok: false, why: "it wouldn't come off" }; }
  roomSees(W, P);
  return { ok: true, slot, name: SLOT_NAMES[slot] };
}

// ── /ink: what your live ink says, and writin' on it ──
const SLOT_OF = { 1: "FarmInk1", 2: "FarmInk2", 3: "FarmInk3", 4: "FarmInk4", brand: BRAND_SLOT };
const say = (W, t) => { try { if (typeof W.ChatRoomSendLocal === "function") { const d = W.document.createElement("div"); d.style.cssText = "color:#c79bd8;white-space:pre-wrap"; d.textContent = "🖋️ " + t; W.ChatRoomSendLocal(d.outerHTML); } } catch (e) { /* fine */ } };
// for the panel: every slot you've ink in, what it's called, and what's written on it
function wornAll(W) {
  const out = [];
  for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
    const it = itemIn(W.Player, slot); if (!it) continue;
    const d = LIVE_BY[it.Asset.Name];
    out.push({ slot, name: it.Asset.Name, title: TITLES[kindOf(slot) + ":" + it.Asset.Name] || it.Asset.Name, live: !!d, fields: d ? d.fields : [], auto: d ? d.auto || null : null, values: (it.Property && it.Property.FarmInk) || {} });
  }
  return out;
}
const panelApi = (W) => ({ worn: () => wornAll(W), write: (slot, v) => write(W, slot, v, true), command: (a) => inkCommand(W, a) });
export function inkCommand(W, args) {
  const a = String(args || "").trim(), m = /^(1|2|3|4|brand)\b\s*(.*)$/i.exec(a);
  const worn = wornLive(W);
  // /ink alone: the panel (sizes, words, the farm's counts)
  if (!a && W.document && W.document.body) { openInkPanel(W, panelApi(W)); return; }
  if (/^why$/i.test(a)) return say(W, whyText());
  // /ink <slot> size 150 (and wide, tall): how big, in percent
  const sm = m && /^(size|wide|width|tall|height)\s+(\d{1,3})%?$/i.exec(m[2].trim());
  if (sm) {
    const slot = SLOT_OF[m[1].toLowerCase()], k = /^s/i.test(sm[1]) ? "sz" : /^w/i.test(sm[1]) ? "sw" : "sh", lim = k === "sz" ? [25, 400] : [50, 200];
    const v = Math.max(lim[0], Math.min(lim[1], Number(sm[2]))) / 100;
    if (!itemIn(W.Player, slot)) return say(W, "Nothin' in " + SLOT_NAMES[slot] + ".");
    write(W, slot, { [k]: v === 1 ? null : v }, true);
    return say(W, SLOT_NAMES[slot] + ": " + ({ sz: "size", sw: "width", sh: "height" }[k]) + " " + Math.round(v * 100) + "%.");
  }
  if (!m) {
    if (!worn.length) return say(W, "You've no live ink on. Pick one in the wardrobe (Farm Ink 1 to 4): the ones that say keeps count, a name, your number or your words. Then /ink <slot> <words> writes on it.");
    return say(W, "Your live ink:\n" + worn.map(({ slot, name, item }) => { const d = LIVE_BY[name], own = (item.Property && item.Property.FarmInk) || {}, k = Object.keys(SLOT_OF).find((x) => SLOT_OF[x] === slot);
      return "• " + k + ": " + d.title + (own.t ? " · \"" + own.t + "\"" : "") + (own.n != null ? " · " + own.n : "") + (own.list ? " · " + own.list.join(", ") : "") + (d.auto ? (own.manual ? " (your number, not the farm's)" : " (follows the farm)") : ""); }).join("\n") +
      "\n/ink opens the ink panel · /ink <slot> <words> writes on it · /ink <slot> <number> sets a count · /ink <slot> a, b, c for a list · /ink <slot> auto follows the farm again · /ink <slot> clear · /ink <slot> size 150 (wide, tall)");
  }
  const slot = SLOT_OF[m[1].toLowerCase()], rest = m[2].trim(), it = itemIn(W.Player, slot);
  if (!it) return say(W, "Nothin' in " + SLOT_NAMES[slot] + ".");
  if (!isLive(it.Asset.Name)) return say(W, (TITLES["FarmInk:" + it.Asset.Name] || TITLES["FarmBrand:" + it.Asset.Name] || "That") + " doesn't take writin': it's drawn as it is.");
  const d = LIVE_BY[it.Asset.Name];
  let v;
  if (!rest) return inkCommand(W, "");
  if (/^clear$/i.test(rest)) v = { t: null, n: null, num: null, list: null, more: null, rows: null, d: null, due: null, manual: null };
  else if (/^auto$/i.test(rest)) { v = { manual: null, n: null, list: null, more: null, rows: null }; }
  else if (/^\d{1,9}$/.test(rest) && (d.fields.includes("n") || d.fields.includes("num"))) v = d.fields.includes("num") ? { num: Number(rest) } : { n: Number(rest), manual: true };
  else if (rest.includes(",") && d.fields.includes("list")) v = { list: rest.split(",").map((x) => x.trim()).filter(Boolean), manual: true };
  else if (d.fields.includes("t")) v = { t: rest };
  else return say(W, d.title + " takes " + (d.fields.includes("n") ? "a number" : d.fields.includes("num") ? "a number" : d.fields.includes("list") ? "names, with commas between" : "nothin'") + ".");
  write(W, slot, v, true);
  if (/^auto$/i.test(rest)) refreshAuto(W);
  say(W, "Written on " + d.title + ".");
}

// R134's entry for our property (see the hooks below). The game's PropertyDataEntry is a plain class declaration, so it's
// reached by its bare name, not on window.
/* global PropertyDataEntry */
export function farmInkEntry(W) {
  const PD = W.PropertyData, PDE = typeof PropertyDataEntry !== "undefined" ? PropertyDataEntry : W.PropertyDataEntry;
  if (!PD || typeof PDE !== "function" || PD.FarmInk) return false;
  const same = (a, b) => { try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; } };
  PD.FarmInk = new PDE("FarmInk", undefined, {
    validate(prop, itemData) {
      const g = itemData && itemData.asset && itemData.asset.Group && itemData.asset.Group.Name;
      if (!ours(g) || !prop || typeof prop !== "object" || Array.isArray(prop)) return { status: "criticalError", value: undefined, errorDescription: "FarmInk belongs on the farm's ink slots" };
      const v = cleanValues(prop); if (prop.manual === true) v.manual = true;
      return { status: "ok", value: v };
    },
    compare(a, b) { return same(a, b); },
  });
  return true;
}

// Whichever add-on loads first calls this; the second finds it done. `mod` is that add-on's ModSDK handle.
export function registerInk(W, mod) {
  if (W.__farmInk) return W.__farmInk;
  const st = (W.__farmInk = { ready: false, slots: [...INK_SLOTS, BRAND_SLOT], designs: LIST.groups.FarmInk.length + LIST.groups.FarmBrand.length, live: Object.keys(MANIFEST).length,
    // for the Companion: the farm's counts for live ink (state.ink from the farm girl)
    counts: (c) => { if (c && typeof c === "object") { counts = c; try { refreshAuto(W); } catch (e) { /* next time */ } } },
    write: (slot, v) => write(W, slot, v, true),
    command: (a) => inkCommand(W, a),
    // the farm's own ink (the Companion hands over the farm girl's list and the "Farm can ink me" switch)
    farm: (list, on, opts) => farmInkSync(W, list, on, undefined, opts),
    farmBrandWorn: () => farmBrandWorn(W),
    // trophies (the Companion's 🏆 Trophies row)
    trophyWear: (t, slot) => trophyWear(W, t, slot), trophyOff: (id) => trophyOff(W, id), trophyWorn: () => trophyWorn(W),
    worn: () => wornLive(W).map(({ slot, name }) => ({ slot, name })) });
  const hooks = () => {
    const hook = (name, pri, fn) => { try { if (typeof W[name] === "function") mod.hookFunction(name, pri, fn); else console.warn("[Farm ink] the game has no " + name); } catch (e) { console.warn("[Farm ink] couldn't hook " + name, e); } };
    // where the game looks for a layer's picture, and for the wardrobe's preview: ours come from the repo (a live design's
    // is an address of our own, drawn below)
    hook("AssetBaseURL", 0, (args, next) => {
      const slot = args[2] || (args[1] && args[1].Name);
      if (isMark(slot)) return INK_HOST + slot + "/";   // (a farm's mark: our own address, drawn from the brand's picture below)
      const kind = kindOf(slot); if (!kind) return next(args);
      return args[6] && isLive(args[6].Name) ? LIVE_HOST + slot + "/" : INK_HOST + kind + "/";
    });
    hook("AssetGetPreviewPath", 0, (args, next) => { const A = args[0], kind = A && A.Group && picKind(A.Group.Name); return kind ? INK_HOST + kind + "/Preview" : next(args); });
    hook("AssetBuildDescription", 0, (args, next) => { const r = next(args); try { describe(W); } catch (e) { /* next time */ } return r; });
    // the pictures are stored at RES times the size they show: drawn at 1/RES, round their middle (the game scales an
    // item round its centre), so the Layering screen's 1.0 is the design's own size and scalin' up stays crisp. On top,
    // the size the wearer set in the ink panel (Property.FarmInk sz, sw, sh). A live design is drawn here, from what's
    // written on it, in place of its address.
    // (Priority 5: this hook runs before the Companion's drawn body (2) and belly (1), so its wrapper is the last one a
    // picture passes through: theirs see our addresses as they are, and hold the ink back till the drawn belly and
    // breasts are on. It sits on them, not under them. Nov 18.)
    hook("CommonDrawAppearanceBuild", 5, (args, next) => {
      const C = args[0], cb = args[1]; if (!cb || typeof cb !== "object") return next(args);
      const sized = (o, it) => {
        const f = (it && it.Property && it.Property.FarmInk) || {}, sz = (f.sz || 1) * kOf(it), kx = sz * (f.sw || 1) / RES, ky = sz * (f.sh || 1) / RES;
        o = Object.assign({}, o); o.ScaleX = (o.ScaleX == null ? 1 : o.ScaleX) * kx; o.ScaleY = (o.ScaleY == null ? 1 : o.ScaleY) * ky; return o;
      };
      const seen = new Set(), notReady = [];
      const ready = (u) => { try { const c = W.GLDrawImageCache; if (c && typeof c.has === "function" && c.has(u) && !c.get(u).isLoaded()) return false; } catch (e) { /* fine */ } return true; };
      // (Nov 18) somebody under the Statue Serum: their ink is cut into the material. The Companion's statue.js hands
      // back the picture in it (W.__farmInkTint: a picture, or undefined to leave it be), drawn plain, at the same size.
      const statue = (plain, self, u, x, y, o) => {
        const T = W.__farmInkTint; if (typeof T !== "function") return false;
        let t; try { t = T(C, u, x, y); } catch (e) { t = undefined; }
        if (!t) return false;
        const o2 = Object.assign({}, o || {}); delete o2.HexColor; delete o2.FullAlpha; plain.call(self, t, x, y, o2); return true;
      };
      // (Nov 18) the farm's own ink: a brand healin' from red to pale, marker and henna fadin', as far as they've got
      const now = Date.now();
      const aged = (o, it, layer) => {
        const f = farmOf(it) && it.Property.FarmInk, a = f && ageOf(f, now); if (!a) return o;
        o = Object.assign({}, o);
        if (a.heal != null && typeof o.HexColor === "string") o.HexColor = healedHex(o.HexColor, layer, a.heal);
        if (a.alpha < 1) o.Alpha = (o.Alpha == null ? 1 : o.Alpha) * a.alpha;
        return o;
      };
      const wrap = (f, plain) => (typeof f !== "function" ? f : function (src, x, y, o) {
        if (typeof src === "string") {
          // a farm's mark: the brand's own picture, at this slot's size, healin' like any of the farm's
          const mm = src.indexOf("/FarmMark") > 0 ? MARK_SRC.exec(src) : null;
          if (mm) { const it = itemIn(C, mm[1]); if (!it || it.Asset.Name !== mm[2]) return undefined; const u = src.replace("/" + mm[1] + "/", "/FarmBrand/"); const o3 = aged(sized(o, it), it, mm[3]); if (o3.Alpha === 0) return undefined; seen.add(mm[2]); if (!ready(u)) notReady.push(mm[2]); if (statue(plain, this, u, x, y, o3)) return undefined; return f.call(this, u, x, y, o3); }
          const lm = src.indexOf("/live/") > 0 ? LIVE_SRC.exec(src) : null;
          if (lm) { const u = liveSrc(W, C, lm[1], lm[2], lm[3]); seen.add(lm[2]); if (!u) { notReady.push(lm[2] + " (not drawn yet)"); return undefined; } if (!ready(u)) notReady.push(lm[2]); const it = itemIn(C, lm[1]), o3 = aged(sized(o, it), it, lm[3]); if (o3.Alpha === 0) return undefined; if (statue(plain, this, u, x, y, o3)) return undefined; return f.call(this, u, x, y, o3); }
          const sm = OURS.test(src) ? STILL_SRC.exec(src) : null;
          if (sm) { if (DOSED_ONLY.has(sm[2]) && !dosed(W, C)) return undefined;   // (glow ink: only while dosed)
            const it = stillItem(C, sm[1], sm[2]); o = aged(sized(o, it), it, sm[3]); if (o.Alpha === 0) return undefined; seen.add(sm[2]); if (!ready(src)) notReady.push(sm[2]); if (statue(plain, this, src, x, y, o)) return undefined; }
        }
        return f.call(this, src, x, y, o);
      });
      const out = next([args[0], Object.assign({}, cb, { drawImage: wrap(cb.drawImage, cb.drawImage), drawImageBlink: wrap(cb.drawImageBlink, cb.drawImageBlink), drawImageColorize: wrap(cb.drawImageColorize, cb.drawImage), drawImageColorizeBlink: wrap(cb.drawImageColorizeBlink, cb.drawImageBlink) }), ...args.slice(2)]);
      try { note(W, C, seen, notReady); } catch (e) { /* fine */ }
      return out;
    });
    // A TATTOO STAYS ON (Nov 18): the game's "naked" (and the last of "strip a layer") takes off anything worn as body
    // cosplay, the game's own body markings included. Farm ink isn't somethin' you strip: it goes back on. It comes off
    // one slot at a time in the wardrobe, like takin' it off on purpose.
    const keepInk = (name) => hook(name, 0, (args, next) => {
      const C = args[0], keep = C && Array.isArray(C.Appearance) ? C.Appearance.filter((it) => it && it.Asset && it.Asset.Group && ours(it.Asset.Group.Name)) : [];
      const r = next(args);
      try {
        let back = 0;
        if (keep.length && C && Array.isArray(C.Appearance)) for (const it of keep) if (!C.Appearance.includes(it) && !itemIn(C, it.Asset.Group.Name)) { C.Appearance.push(it); back++; }
        if (back && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C);
      } catch (e) { /* fine */ }
      return r;
    });
    keepInk("CharacterAppearanceNaked");
    keepInk("CharacterAppearanceStripLayer");
    // ...and the farm's marks stay on through an outfit put on from the wardrobe (only ?wash takes them off). Your own
    // ink goes with the outfit, as it always has.
    hook("WardrobeFastLoad", 0, (args, next) => {
      const C = args[0], keep = C && typeof C.IsPlayer === "function" && C.IsPlayer() && Array.isArray(C.Appearance) ? C.Appearance.filter((it) => it && it.Asset && it.Asset.Group && isMark(it.Asset.Group.Name) && farmOf(it)) : [];
      const r = next(args);
      try {
        let back = 0;
        for (const it of keep) if (!itemIn(C, it.Asset.Group.Name)) { C.Appearance.push(it); back++; }
        if (back) { if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(C, false); if (args[2] && typeof W.ChatRoomCharacterUpdate === "function") W.ChatRoomCharacterUpdate(C); }
      } catch (e) { /* fine */ }
      return r;
    });
    hook("AssetLoadAll", 0, (args, next) => { const r = next(args); try { addSlots(W); } catch (e) { console.warn("[Farm ink] couldn't add the slots again", e); } return r; });
    // R134 (Nov 18): what's sent to the server about an item is only the properties the game knows (it keeps LSCG's
    // and WCE's own on a list of its own). Ours (FarmInk: the size, a live design's words and counts, the farm's healin'
    // brands and marks, a trophy) were dropped on the way: nobody else saw them, and a relog lost them. Kept, on our
    // slots only.
    if (typeof W.ItemPropertiesGetBundleProperties === "function") hook("ItemPropertiesGetBundleProperties", 0, (args, next) => {
      const r = next(args);
      try { const it = args[0]; if (it && it.Asset && it.Asset.Group && ours(it.Asset.Group.Name) && r && r.properties && typeof r.properties.add === "function") r.properties.add("FarmInk"); } catch (e) { /* fine */ }
      return r;
    });
    // ...and on the way in, the game keeps only properties it has an entry for (PropertyData) and drops the rest. So
    // FarmInk gets one: kept on our slots, cleaned the same way we clean it ourselves, compared by what's in it.
    farmInkEntry(W);
    // days without cummin': your own game counts it (a ruined one doesn't count as cummin')
    hook("ActivityOrgasmStart", 0, (args, next) => {
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && !W.ActivityOrgasmRuined) { W.localStorage.setItem(cumKey(W), String(Date.now())); setTimeout(() => refreshAuto(W), 1000); } } catch (e) { /* fine */ }
      return next(args);
    });
  };
  const t = setInterval(() => {
    if (!gameReady(W)) return;
    clearInterval(t);
    try { hooks(); addSlots(W); st.ready = true; } catch (e) { console.warn("[Farm ink] couldn't add the slots", e); }
    // the farm's logo, for the two live designs that carry it; then draw anybody wearin' one again
    loadLiveArt().then(() => { try { for (const C of W.ChatRoomCharacter || []) if (wornByLogo(C) && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } });
    try { if (typeof W.CommandCombine === "function") W.CommandCombine([{ Tag: "ink", Description: "[slot words]: your live farm ink (counts, names, your own words)", Action: (a) => inkCommand(W, a) }]); } catch (e) { /* fine */ }
  }, 50);
  // the counts that change on their own (days without cummin')
  setInterval(() => { try { if (W.Player && W.Player.Appearance) refreshAuto(W); } catch (e) { /* fine */ } }, 10 * 60000);
  // a dose in or out (yours, or somebody's icons): anybody wearin' glow ink drawn again, so it lights up or goes dark
  try {
    W.addEventListener("farmhand-dispensary", (e) => {
      const d = e && e.detail; if (!d || !(d.type === "dose" || d.type === "icons")) return;
      const mn = d.type === "icons" ? d.from : W.Player && W.Player.MemberNumber;
      const C = (W.Player && W.Player.MemberNumber === mn ? W.Player : (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
      if (C && wearsDosedOnly(C) && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C);
    });
  } catch (e) { /* fine */ }
  // the farm's ink healin' and fadin': anybody whose is still on its way drawn again every half hour
  setInterval(() => { try { const now = Date.now(); for (const C of W.ChatRoomCharacter || []) if (stillChanging(C, now) && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } }, 30 * 60000);
  return st;
}
// INK THAT DIDN'T SHOW (Laynie, Nov 18: "the tattoos temporarily disappear when facial animations change", on other
// people, a split second, with the drawn body, WCE, LSCG and Echo running). Each time somebody's drawn, any ink they wear
// that wasn't asked for, or whose picture wasn't ready, is noted here; /ink why shows the last few.
const DIAG = [];
function note(W, C, seen, notReady) {
  if (!C || !Array.isArray(C.Appearance)) return;
  const pose = [].concat(C.ActivePose || [], C.Pose || []).join(",");
  if (/AllFours|Hogtied/.test(pose)) return;   // (hidden in those poses on purpose)
  const worn = C.Appearance.filter((it) => it && it.Asset && it.Asset.Group && ours(it.Asset.Group.Name)).map((it) => it.Asset.Name);
  const missing = worn.filter((n) => !seen.has(n));
  if (!missing.length && !notReady.length) return;
  DIAG.push({ t: Date.now(), who: C.MemberNumber, name: String(C.Nickname || C.Name || ""), missing, notReady: [...new Set(notReady)] });
  if (DIAG.length > 40) DIAG.shift();
}
export const inkDiag = () => DIAG.slice();
function whyText() {
  if (!DIAG.length) return "No ink has gone missin' since you logged in.";
  return "Ink that didn't show, newest last:\n" + DIAG.slice(-10).map((d) => new Date(d.t).toLocaleTimeString() + " · " + d.name + " (" + d.who + ")" +
    (d.missing.length ? " · not drawn at all: " + d.missing.join(", ") : "") + (d.notReady.length ? " · picture not loaded yet: " + d.notReady.join(", ") : "")).join("\n");
}
const wornByLogo = (C) => (C && Array.isArray(C.Appearance) ? C.Appearance.some((it) => it && it.Asset && LIVE_BY[it.Asset.Name] && LIVE_BY[it.Asset.Name].logo) : false);
