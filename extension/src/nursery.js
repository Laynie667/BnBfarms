/* WHAT'S IN THIS FILE (nursery.js)
   The nursery, on a little's own screen (so the game always allows it): stuffies and baby things put on or taken off
   when THEY press the button (or say yes to a grown-up's offer), a fresh change when a grown-up changes them (the ABCL
   mod's wetness set back to dry, and a puff of baby powder for a little while), and what their padding's like for the
   farm (ABCL), with who their Littlish Club grown-ups are. Nothin' the nursery put on is ever locked, and nothin' it
   didn't put on is ever taken off.
*/
const KEY = "fhc-nursery";   // { gear: { Group: Name }, powderUntil }
const P = () => window.Player;
const load = () => { try { return JSON.parse(window.localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const save = (v) => { try { window.localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* fine */ } };
const ready = () => P() && Array.isArray(P().Appearance) && typeof window.ServerAppearanceBundle === "function" && typeof window.ServerAppearanceLoadFromBundle === "function";
const bundle = () => window.ServerAppearanceBundle(P().Appearance);
function commit(next) {
  window.ServerAppearanceLoadFromBundle(P(), P().AssetFamily, next, P().MemberNumber);
  if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(P());
  if (typeof window.ChatRoomCharacterUpdate === "function") window.ChatRoomCharacterUpdate(P());
}
const locked = (g) => P().Appearance.some((it) => it.Asset && it.Asset.Group && it.Asset.Group.Name === g && it.Property && it.Property.LockedBy);
const exists = (g, n) => typeof window.AssetGet !== "function" || !!window.AssetGet(P().AssetFamily, g, n);

// put one on: only where nothin' is (or where the nursery's own thing was)
export function nurseryWear(g) {
  if (!ready()) return { ok: false, why: "not in a room" };
  if (!g || !g.group || !g.name) return { ok: false, why: "nothin' to put on" };
  if (!exists(g.group, g.name)) return { ok: false, why: "the game doesn't have that one" };
  if (locked(g.group)) return { ok: false, why: "there's somethin' locked there" };
  const mem = load(); mem.gear = mem.gear || {};
  let next = bundle();
  const there = next.find((b) => b.Group === g.group);
  if (there && mem.gear[g.group] !== there.Name) return { ok: false, why: g.group === "ItemHandheld" ? "your hands are full" : "you've already got somethin' on there" };
  next = next.filter((b) => b.Group !== g.group).concat([{ Group: g.group, Name: g.name }]);
  commit(next); mem.gear[g.group] = g.name; save(mem);
  return { ok: true };
}
// take off what the nursery put on (one piece, or all of it)
export function nurseryOff(group) {
  if (!ready()) return { ok: false, why: "not in a room" };
  const mem = load(), gear = mem.gear || {};
  const groups = group ? [group] : Object.keys(gear);
  const next = bundle().filter((b) => !(groups.includes(b.Group) && gear[b.Group] === b.Name && !locked(b.Group)));
  for (const g of groups) delete gear[g];
  mem.gear = gear; save(mem); commit(next);
  return { ok: true };
}
export const nurseryWorn = () => Object.assign({}, load().gear || {});

// a grown-up changed them: dry again (ABCL), and a puff of baby powder for ten minutes
export function nurseryChange() {
  const A = window.ABCL, did = [];
  try {
    if (A && A.stats) {
      A.stats.WetnessValue = 0; A.stats.SoilinessValue = 0; did.push("dry");
      try { A.raw.updateDiaperColor(); } catch (e) { /* older ABCL */ }
      try { A.raw.sendUpdateMyData(); } catch (e) { /* older ABCL */ }
    }
  } catch (e) { console.warn("[Farmhand Companion] nursery change:", e); }
  try {
    if (ready() && exists("BodyMarkings", "BabyPowderDust") && !bundle().some((b) => b.Group === "BodyMarkings")) {
      commit(bundle().concat([{ Group: "BodyMarkings", Name: "BabyPowderDust" }]));
      const mem = load(); mem.powderUntil = Date.now() + 10 * 60000; save(mem); did.push("powder");
    }
  } catch (e) { console.warn("[Farmhand Companion] baby powder:", e); }
  return did;
}
// the powder brushes off on its own
export function nurseryPowderTick() {
  try {
    const mem = load(); if (!mem.powderUntil || Date.now() < mem.powderUntil || !ready()) return;
    const next = bundle().filter((b) => !(b.Group === "BodyMarkings" && b.Name === "BabyPowderDust"));
    mem.powderUntil = 0; save(mem); commit(next);
  } catch (e) { /* fine */ }
}
// their padding (ABCL) and their Littlish Club grown-ups, for the farm
export function nurseryStatsNow() {
  const out = {};
  try {
    const A = window.ABCL;
    if (A && A.stats) {
      out.abcl = true;
      try { out.diaper = !!A.raw.hasDiaper(P()); } catch (e) { out.diaper = false; }
      try { out.wet = Math.round((Number(A.stats.WetnessPercentage) || 0) * 100) / 100; } catch (e) { out.wet = 0; }
      try { out.leak = !!A.raw.isLeaking("pee"); } catch (e) { out.leak = false; }
    }
  } catch (e) { /* no ABCL */ }
  try {
    const LC = window.LITTLISH_CLUB;
    if (LC) {
      try { const m = LC.getMommyOf(P()); if (m && Number.isInteger(m.id)) out.mommy = m.id; } catch (e) { /* fine */ }
      try { out.carers = (LC.getCaregiversOf(P()) || []).filter(Number.isInteger).slice(0, 12); } catch (e) { /* fine */ }
    }
  } catch (e) { /* no Littlish Club */ }
  return out;
}
