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
// the Splatters item's parts, by area (module keys)
const AREAS = { forehead: ["a", "b", "c"], face: ["d", "e", "f"], chest: ["g", "h", "i", "j"], tummy: ["k", "l", "m", "n"] };

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
    let it = next.find((b) => b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group));
    if (!it) {
      const g = SPLAT_GROUPS.find((x) => !has(x) && groupOf(x));
      if (g) { it = { Group: g, Name: "Splatters", Property: { TypeRecord: {} } }; next.push(it); mem.splatGroup = g; }
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

// off with what the farm put on (the splatters and the writing), nothin' else
export function washMarks() {
  const mem = load(), stuck = lockedGroups();
  const next = bundle().filter((b) => stuck.has(b.Group) || !((b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group)) || (b.Name === "BodyWritings" && b.Group === mem.writeGroup)));
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
  const next = cur.filter((b) => { const g = groupOf(b.Group); return !(g && g.Clothing) || stuck.has(b.Group) || b.Name === "BodyWritings" || b.Name === "Splatters"; });   // the farm's own marks stay on
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
