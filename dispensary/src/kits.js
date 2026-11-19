/* WHAT'S IN THIS FILE (kits.js)
   KITS (Nov 18; Laynie: "lscg imports outfits, so maybe ones saved there, to utilize them similar to lscg curses"; when
   it's over "your old outfit slips back on"; "Kits can dress me" off to start, "sounds good, and yes"; "maybe set a few
   speed options").
   • A crafted dose that says "kit: <name>" (a needle, a drink, gear) puts that outfit on whoever it doses and keeps it on
     for the dose's time (half an hour a dose). The outfit is the crafter's: one they saved in LSCG (its outfits), or one
     they saved on their own Dispensary (/dispensary kit save <name>). Their Dispensary sends it over when it's asked.
   • It creeps on a piece at a time: a minute a piece, half a minute, ten seconds, or all at once (yours to pick). While
     it lasts, a piece taken off creeps back on.
   • Clothes and restraints only, never your body; you pick clothes, restraints or both. Nothin' you've blocked, nothin'
     the room doesn't allow, and never over somethin' locked on you. Its locks don't come with it: the kit holds itself on.
   • Its pieces keep their crafts: a horny plug in it is horny, a dilator drip keeps you open, and so on.
   • When it's over (its time, the safeword, the Purge) the kit comes off and your old outfit slips back on.
   • The words on the bottle flavour the lines: livin' (latex, tentacles, slime), demonic (cursed, enchanted, sigils),
     brainwashin' (hypno, trance, conditioning), or plain.
*/
import { st, save } from "./store.js";
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { LINES } from "./lines.js";
import { local, action, fill, pick, nameOf, inRoom } from "./say.js";
import "./lines-kits.js";

const W = window;
export const SPEEDS = { slow: 60, steady: 30, fast: 10, now: 0 };   // seconds a piece
export const SPEED_NAMES = { slow: "a piece a minute", steady: "a piece every half minute", fast: "a piece every ten seconds", now: "all at once" };
const KIT_RE = /\bkit\s*:\s*([a-z0-9][^|,.;!?\n]{0,39})/;
export const kitKeyOf = (text) => { const m = KIT_RE.exec(String(text || "").toLowerCase()); return m ? m[1].trim().replace(/\s+/g, " ") : ""; };
const FLAVOURS = [["living", /\b(living|livin'?|alive|symbiot\w*|tentacle\w*|slime\w*|latex)\b/], ["demon", /\b(demon\w*|cursed|enchanted|infernal|hell\w*|sigil\w*|succubus)\b/],
  ["brain", /\b(brainwash\w*|hypno\w*|mind\w*|conditioning|trance)\b/]];
export const flavourOf = (text) => { const t = String(text || "").toLowerCase(), f = FLAVOURS.filter(([, re]) => re.test(t)).map(([k]) => k); return f.length ? f.join("+") : "plain"; };
// the dose's part: "<kit name>#<flavour>" (doses.js partFor)
export const kitPart = (text) => { const k = kitKeyOf(text); return k ? k + "#" + flavourOf(text) : ""; };
const splitPart = (p) => { const i = String(p || "").lastIndexOf("#"); return i > 0 ? { key: p.slice(0, i), flav: p.slice(i + 1) } : { key: String(p || ""), flav: "plain" }; };

export const kitsOn = () => !!st().kitsOn;
const what = () => (["clothes", "binds", "both"].includes(st().kitWhat) ? st().kitWhat : "both");
const speedOf = () => (SPEEDS[st().kitSpeed] != null ? SPEEDS[st().kitSpeed] : SPEEDS.steady);
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const send = (type, data, to) => { try { if (typeof W.ServerSend === "function") W.ServerSend("ChatRoomChat", makeMsg(type, data, to)); return true; } catch (e) { return false; } };
const LZ = () => W.LZString;
const pack = (bundle) => { try { return LZ().compressToBase64(JSON.stringify(bundle)); } catch (e) { return ""; } };
const unpack = (code) => { try { const b = JSON.parse(LZ().decompressFromBase64(String(code || ""))); return Array.isArray(b) ? b.filter((i) => i && typeof i.Group === "string" && typeof i.Name === "string") : null; } catch (e) { return null; } };

// clothes or restraints (never a body part, the farm's ink, or anythin' the wardrobe keeps to itself)
const groupOf = (name) => { try { return (typeof W.AssetGroupGet === "function" && W.AssetGroupGet("Female3DCG", name)) || (W.AssetGroupMap && W.AssetGroupMap.get(name)) || null; } catch (e) { return null; } };
export function kindOfGroup(g) {
  if (!g || g.BodyCosplay || g.AllowCustomize === false) return null;
  if (g.Category === "Item") return "binds";
  if (g.Category === "Appearance" && g.Clothing) return "clothes";
  return null;
}
const wanted = (gname) => { const k = kindOfGroup(groupOf(gname)); return !!k && (what() === "both" || what() === k); };
const itemIn = (group) => (W.Player && Array.isArray(W.Player.Appearance) ? W.Player.Appearance.find((i) => i && i.Asset && i.Asset.Group && i.Asset.Group.Name === group) : null);
const lockedOn = (it) => !!(it && it.Property && it.Property.LockedBy);

// what you're wearin' now, clothes and restraints (to put back after)
function wornBundle() {
  const P = W.Player; if (!P || !Array.isArray(P.Appearance)) return [];
  return P.Appearance.filter((i) => i && i.Asset && i.Asset.Group && kindOfGroup(i.Asset.Group)).map((i) => {
    const b = { Group: i.Asset.Group.Name, Name: i.Asset.Name };
    if (i.Color != null) b.Color = i.Color; if (i.Difficulty != null) b.Difficulty = i.Difficulty; if (i.Craft) b.Craft = i.Craft;
    if (i.Property) { try { b.Property = typeof W.ItemPropertiesCompress === "function" ? W.ItemPropertiesCompress(i) : JSON.parse(JSON.stringify(i.Property)); } catch (e) { b.Property = JSON.parse(JSON.stringify(i.Property)); } }
    return b;
  });
}

// ── the crafter's side: your saved outfits ──
const lscgOutfits = () => { try { const L = W.LSCG; return L && typeof L.Outfits === "function" ? L.Outfits() : null; } catch (e) { return null; } };
export function kitNames() {
  const own = Object.keys(st().kits || {}), C = lscgOutfits();
  let lscg = []; try { lscg = C && typeof C.GetOutfitNames === "function" ? C.GetOutfitNames() : C && typeof C.GetOutfitKeys === "function" ? C.GetOutfitKeys() : []; } catch (e) { lscg = []; }
  return { own, lscg };
}
// a saved outfit by name: your own Dispensary's first, then LSCG's
export function kitLookup(key) {
  key = String(key || "").toLowerCase().trim(); if (!key) return null;
  const own = (st().kits || {})[key]; if (own) return unpack(own);
  const C = lscgOutfits();
  try { if (C && C.GetOutfit(key)) { const b = C.GetOutfitBundle(key); return Array.isArray(b) ? b : null; } } catch (e) { /* LSCG moved it */ }
  return null;
}
// /dispensary kit save <name>: what you've on now (clothes and restraints)
export function kitSave(name) {
  const key = String(name || "").toLowerCase().trim().replace(/\s+/g, " ").slice(0, 40); if (!key) return { ok: false, why: "name" };
  const S = st(); S.kits = S.kits || {};
  if (!S.kits[key] && Object.keys(S.kits).length >= 8) return { ok: false, why: "full" };
  const b = wornBundle(); if (!b.length) return { ok: false, why: "empty" };
  const code = pack(b); if (!code || code.length > 12000) return { ok: false, why: "big" };
  S.kits[key] = code; save();
  return { ok: true, key, n: b.length };
}
export function kitDelete(name) { const S = st(), key = String(name || "").toLowerCase().trim(); if (!S.kits || !S.kits[key]) return false; delete S.kits[key]; save(); return true; }
// somebody your kit dosed asks for it: sent (only what a kit can put on: clothes and restraints)
function onAsk(from, m) {
  const key = String(m.key || "").slice(0, 40), b = kitLookup(key);
  const clean = b ? b.filter((i) => kindOfGroup(groupOf(i.Group))) : null;
  send("dispKit", clean && clean.length ? { key, code: pack(clean) } : { key, none: true }, from);
}

// ── the one bein' dressed ──
const K = () => st().kit || null;   // { key, flav, by, old, queue, pieces, next, at, done }
let waiting = null;                  // { key, by, at }: asked the crafter, waitin' on their answer
const lineOf = (key, flav, v) => {
  const L = LINES.kits || {}, pools = String(flav || "plain").split("+").map((f) => L[key + "_" + f]).filter((p) => p && p.length);
  const pool = pools.length ? pools[Math.floor(Math.random() * pools.length)] : L[key + "_plain"] || [];
  return pool.length ? fill(pick(pool), { by: (v && v.by) || "somebody" }).replace(/%g/g, (v && v.g) || "it").replace(/%k/g, (v && v.k) || "the kit") : "";
};
// (the lines say "it": leather cuffs read as a pair of them)
const onePiece = (n) => (/[^s]s$/i.test(String(n).trim()) ? "pair of " + n : n);
const pieceName = (b) => { try { const A = W.AssetGet("Female3DCG", b.Group, b.Name); return onePiece(String((b.Craft && b.Craft.Name) || (A && (A.Description || A.Name)) || b.Name).toLowerCase()); } catch (e) { return String(b.Name).toLowerCase(); } };
function update(group) { try { if (group && typeof W.ChatRoomCharacterItemUpdate === "function") W.ChatRoomCharacterItemUpdate(W.Player, group); else if (typeof W.ChatRoomCharacterUpdate === "function") W.ChatRoomCharacterUpdate(W.Player); } catch (e) { /* not in a room */ } }
function refresh() { try { if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(W.Player, false); } catch (e) { /* fine */ } }

// one piece on, the way the game puts it on (gives whether it went on)
function putOn(b, by) {
  const P = W.Player; if (!P || typeof W.InventoryWear !== "function" || typeof W.AssetGet !== "function") return false;
  const A = W.AssetGet("Female3DCG", b.Group, b.Name); if (!A || !wanted(b.Group)) return false;
  const cur = itemIn(b.Group);
  if (cur && cur.Asset.Name === b.Name) return true;
  if (cur && lockedOn(cur)) return false;                                              // (never over somethin' locked on)
  try { if (typeof W.InventoryBlockedOrLimited === "function" && W.InventoryBlockedOrLimited(P, { Asset: A })) return false; } catch (e) { /* fine */ }   // (nothin' you've blocked)
  try { if (typeof W.InventoryChatRoomAllow === "function" && !W.InventoryChatRoomAllow(A.Category || [])) return false; } catch (e) { /* fine */ }       // (nor the room)
  let it = null;
  try { it = W.InventoryWear(P, b.Name, b.Group, b.Color, b.Difficulty, by || me(), b.Craft, false); } catch (e) { return false; }
  it = it || itemIn(b.Group); if (!it || it.Asset.Name !== b.Name) return false;
  if (b.Property) { try { it.Property = typeof W.ItemPropertiesDecompress === "function" ? W.ItemPropertiesDecompress(Object.assign(it, { Property: {} }), b.Property) : JSON.parse(JSON.stringify(b.Property)); } catch (e) { it.Property = JSON.parse(JSON.stringify(b.Property)); } }
  if (lockedOn(it)) { try { if (typeof W.InventoryUnlock === "function") W.InventoryUnlock(P, it, false); else { for (const k of ["LockedBy", "LockMemberNumber", "RemoveTimer", "Password", "CombinationNumber", "MemberNumberList"]) delete it.Property[k]; } } catch (e) { /* fine */ } }   // (its locks don't come with it)
  if (it.Property && it.Property.Effect) it.Property.Effect = it.Property.Effect.filter((e) => e !== "Lock");
  return true;
}

// the dose took: ask for the kit (or, your own, put it straight on)
export function kitBegin(part, by) {
  const { key, flav } = splitPart(part); if (!key) return false;
  const k = K();
  if (k && k.key === key && k.by === by) { k.flav = flav; save(); return true; }   // (more of the same: just longer)
  if (!by || by === me()) { const b = kitLookup(key); if (!b) { local(fill(pick(LINES.kits.missing_own)).replace(/%k/g, key)); return false; } return dress(key, flav, by || me(), b); }
  waiting = { key, flav, by, at: Date.now() };
  send("dispKitAsk", { key }, by);
  return true;
}
function onKit(from, m) {
  if (!waiting || waiting.by !== from || String(m.key) !== waiting.key) return;
  const w = waiting; waiting = null;
  const b = m.none ? null : unpack(m.code);
  if (!b || !b.length) { local(fill(pick(LINES.kits.missing), { by: nameOf(from) }).replace(/%k/g, w.key)); try { endDose("kit"); } catch (e) { /* fine */ } return; }
  dress(w.key, w.flav, from, b);
}
let endDose = () => {};
function dress(key, flav, by, bundle) {
  const S = st(), was = K();
  const pieces = bundle.filter((b) => wanted(b.Group)).slice(0, 60);
  if (!pieces.length) { local(fill(pick(LINES.kits.nothing)).replace(/%k/g, key)); return false; }
  S.kit = { key, flav, by, old: was ? was.old : wornBundle(), pieces, queue: pieces.map((b) => b.Group), next: Date.now(), at: Date.now(), done: false };
  save();
  action(lineOf("start", flav, { by: nameOf(by) || "somebody", k: key }));
  kitTick(Date.now());
  return true;
}
// every few seconds: the next piece creeps on, and what came off creeps back
export function kitTick(now) {
  now = now || Date.now();
  if (waiting && now - waiting.at > 20000) { const w = waiting; waiting = null; local(fill(pick(LINES.kits.missing), { by: nameOf(w.by) || "whoever made it" }).replace(/%k/g, w.key)); try { endDose("kit"); } catch (e) { /* fine */ } return; }
  const k = K(); if (!k) return;
  if (!inRoom()) return;
  // taken off while it lasts: back on the list
  if (k.done) for (const b of k.pieces) { const cur = itemIn(b.Group); if (!cur && !k.queue.includes(b.Group) && wanted(b.Group)) { k.queue.push(b.Group); k.back = (k.back || 0) + 1; } }
  if (!k.queue.length || now < k.next) return;
  const gap = speedOf(), n = gap ? 1 : k.queue.length;
  const put = [];
  for (let i = 0; i < n && k.queue.length; i++) {
    const g = k.queue.shift(), b = k.pieces.find((p) => p.Group === g); if (!b) continue;
    if (putOn(b, k.by)) put.push(b);
  }
  k.next = now + gap * 1000;
  if (put.length) {
    refresh(); put.forEach((b) => update(b.Group));
    const v = { g: pieceName(put[0]), k: k.key, by: nameOf(k.by) || "somebody" };
    const back = k.done && k.back > 0;
    const t = put.length > 1 ? "" : lineOf(back ? "back" : "piece", k.flav, v);   // (all at once: the "all on" line says it)
    if (t) (back || Math.random() < 0.4 ? action(t) : local(t));
    if (back) k.back = Math.max(0, k.back - put.length);
  }
  if (!k.queue.length && !k.done) { k.done = true; action(lineOf("done", k.flav, { k: k.key, by: nameOf(k.by) || "somebody" })); }
  save();
}
// it's over: the kit off, your old outfit back on
export function kitEnd(quiet) {
  const k = K(); waiting = null; if (!k) return false;
  const P = W.Player, S = st();
  for (const b of k.pieces) { const cur = itemIn(b.Group); if (cur && cur.Asset.Name === b.Name && !lockedOn(cur)) { try { W.InventoryRemove(P, b.Group, false); } catch (e) { /* fine */ } } }   // (somebody's locked it on since: it's theirs now, it stays)
  for (const b of k.old || []) { if (!itemIn(b.Group)) { try { putBack(b); } catch (e) { /* fine */ } } }
  S.kit = null; save();
  refresh(); update(null);
  if (!quiet) action(lineOf("off", k.flav, { k: k.key }));
  return true;
}
// your old things, as they were (their own locks too)
function putBack(b) {
  const A = W.AssetGet("Female3DCG", b.Group, b.Name); if (!A) return;
  const it = W.InventoryWear(W.Player, b.Name, b.Group, b.Color, b.Difficulty, me(), b.Craft, false) || itemIn(b.Group);
  if (it && b.Property) { try { it.Property = typeof W.ItemPropertiesDecompress === "function" ? W.ItemPropertiesDecompress(Object.assign(it, { Property: {} }), b.Property) : JSON.parse(JSON.stringify(b.Property)); } catch (e) { it.Property = JSON.parse(JSON.stringify(b.Property)); } }
}
export const kitNow = () => { const k = K(); return k ? { key: k.key, flav: k.flav, by: k.by, left: k.queue.length, on: k.pieces.length - k.queue.length, done: k.done } : null; };

export function initKits(mod, o) {
  endDose = o && typeof o.end === "function" ? o.end : endDose;
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try { const data = args[0]; if (data && data.Type === "Hidden" && typeof data.Sender === "number") { const m = readMsg(data); if (m) kitMessage(data.Sender, m); } } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { /* fine */ }
  // the dose's own clock: when it takes, dress; when it's over, undress
  try {
    W.addEventListener("farmhand-dispensary", (e) => {
      const d = e && e.detail; if (!d || d.type !== "dose" || d.id !== "kit") return;
      try { if (d.on) kitBegin(d.p, o && o.byOf ? o.byOf("kit") : 0); else kitEnd(false); } catch (err) { console.warn("[Dispensary] kit:", err); }
    });
  } catch (e) { /* fine */ }
}
// the messages: somebody asks for your kit; your kit's maker sends it
export function kitMessage(from, m) {
  if (!m || from === me()) return false;
  if (m.type === "dispKitAsk") { onAsk(from, m); return true; }
  if (m.type === "dispKit") { onKit(from, m); return true; }
  return false;
}
