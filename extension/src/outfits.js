// Farm outfits, done on the player's own screen after they say yes (so the game always allows it).
// Saved outfits hold clothes and restraints, plus which pieces were locked. Puttin' one on:
//   1. keep what they're wearin' now (for "change back")
//   2. swap their clothes for the outfit's and add its restraints. Body and hair are never touched,
//      and nothin' already locked on them is moved
//   3. every piece that was locked in the saved outfit gets a high security padlock keyed to the farm
const BACKUP_KEY = "fhc-outfit-backup";
// lock details are never saved or copied: the farm puts its own locks on
const LOCK_FIELDS = ["LockedBy", "LockMemberNumber", "LockMemberName", "LockMessage", "CombinationNumber", "Password", "Hint", "LockSet",
  "LockPickSeed", "RemoveTimer", "RemoveItem", "ShowTimer", "EnableRandomInput", "MemberNumberList", "MemberNumberListKeys", "RemoveOnUnlock"];

const P = () => window.Player;
const groupOf = (name) => (typeof window.AssetGroupGet === "function" ? window.AssetGroupGet(P().AssetFamily, name) : null);
const isClothes = (g) => !!(g && g.Clothing);
const isItem = (g) => !!(g && g.Category === "Item");
const lockedGroups = () => new Set(P().Appearance.filter((it) => it.Property && it.Property.LockedBy).map((it) => it.Asset.Group.Name));
function unlocked(prop) {
  const c = Object.assign({}, prop || {});
  for (const k of LOCK_FIELDS) delete c[k];
  if (Array.isArray(c.Effect)) c.Effect = c.Effect.filter((e) => e !== "Lock");
  return c;
}
function commit(bundle) {
  window.ServerAppearanceLoadFromBundle(P(), P().AssetFamily, bundle, P().MemberNumber);
  if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(P());
  window.ChatRoomCharacterUpdate(P());
}

// what they're wearin' now, as a farm outfit: { data, items, locks }
export function captureOutfit() {
  const items = [];
  let locks = 0;
  for (const it of P().Appearance) {
    const g = it.Asset && it.Asset.Group;
    if (!g || !(isClothes(g) || isItem(g))) continue;
    const b = window.ServerBundledItemFromAppearanceItem(it);
    const locked = !!(it.Property && it.Property.LockedBy);
    if (locked) locks++;
    items.push(Object.assign({}, b, { Property: unlocked(b.Property), locked }));
  }
  return { data: window.LZString.compressToBase64(JSON.stringify({ v: 1, items })), items: items.length, locks };
}

// put a saved outfit on; keys = member numbers who may open the farm's locks
export function wearOutfit(data, keys) {
  const outfit = JSON.parse(window.LZString.decompressFromBase64(String(data)) || "null");
  if (!outfit || !Array.isArray(outfit.items)) return { ok: false, why: "that outfit didn't come through right" };
  const cur = window.ServerAppearanceBundle(P().Appearance), stuck = lockedGroups();
  const mine = new Set(outfit.items.map((i) => i.Group));
  // clothes come off (unless locked on), restraints stay unless the outfit puts somethin' in that spot
  const next = cur.filter((b) => {
    if (stuck.has(b.Group)) return true;
    const g = groupOf(b.Group);
    if (isClothes(g)) return false;
    return !mine.has(b.Group);
  });
  let worn = 0, locks = 0, skipped = 0;
  const added = [];
  for (const it of outfit.items) {
    const g = groupOf(it.Group);
    if (!g || !(isClothes(g) || isItem(g))) continue;
    if (stuck.has(it.Group)) { skipped++; continue; }
    const b = { Group: it.Group, Name: it.Name, Color: it.Color, Difficulty: it.Difficulty, Craft: it.Craft, Property: unlocked(it.Property) };
    if (it.locked && keys && keys.length) {
      b.Property.Effect = (b.Property.Effect || []).concat(["Lock"]);
      Object.assign(b.Property, { LockedBy: "HighSecurityPadlock", LockMemberNumber: P().MemberNumber, MemberNumberListKeys: keys.join(",") });
      locks++;
    }
    next.push(b); worn++;
    if (isItem(g)) added.push(it.Group);
  }
  try { window.localStorage.setItem(BACKUP_KEY, JSON.stringify({ at: Date.now(), bundle: cur, added })); } catch (e) { /* no storage: no change-back */ }
  commit(next);
  return { ok: true, worn, locks, skipped };
}

// back into what they wore before the farm dressed them (locked farm pieces stay till a keyholder opens 'em)
export function changeBack() {
  let bk = null;
  try { bk = JSON.parse(window.localStorage.getItem(BACKUP_KEY)); } catch (e) { /* none */ }
  if (!bk || !Array.isArray(bk.bundle)) return { ok: false, why: "I don't have your own clothes saved on this computer" };
  const stuck = lockedGroups();
  const next = window.ServerAppearanceBundle(P().Appearance).filter((b) => {
    if (stuck.has(b.Group)) return true;
    const g = groupOf(b.Group);
    if (isClothes(g)) return false;
    return !(bk.added || []).includes(b.Group);
  });
  const have = new Set(next.map((b) => b.Group));
  for (const b of bk.bundle) {
    const g = groupOf(b.Group);
    if (have.has(b.Group) || stuck.has(b.Group)) continue;
    if (isClothes(g) || (isItem(g) && (bk.added || []).includes(b.Group))) next.push(b);
  }
  commit(next);
  try { window.localStorage.removeItem(BACKUP_KEY); } catch (e) { /* fine */ }
  return { ok: true, stillLocked: stuck.size };
}
export const hasBackup = () => { try { return !!window.localStorage.getItem(BACKUP_KEY); } catch (e) { return false; } };
