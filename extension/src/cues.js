/* WHAT'S IN THIS FILE (cues.js)
   Things the Companion does on YOUR screen for the farm, so the farm girl needn't move or whisper:
   • sight:    when it changes (and every 2 minutes), tells the bot who you can see and hear, so private farm lines reach
               exactly the people around you.
   • lead:     walks you somewhere step by step (pathfindin', at your own speed, slower when you're bound)
               instead of you bein' teleported. If there's no way through, the bot teleports you after all.
   • face:     sets your own face for a while (dazed when milk-drunk, flushed in heat, a trance stare…).
   • sound:    plays a farm sound only you hear (the pump, the stall door, the feedin' bell).
   • trance:   a soft haze at the edges of your screen during conditioning, deeper as you sink.
   • feelings: now and then, a private line about what you're actually feelin' (a plug, a cage, full
               udders, a sloshin' belly, heat), from your own gear and arousal. Only you see these.
   • markers:  staff see little badges over the stock on their own map (needs milkin', in heat, expectin').
   Each one has a switch in Toggles → "This panel".
*/
const W = window;
let ctx = null;   // { toBot, panel, local }

export function initCues(c) { ctx = c; setInterval(sightTick, 4000); setInterval(feelTick, 60000); }
const pref = (k) => !ctx.panel.prefs[k];   // every cue is on unless switched off
export const cueOff = () => ({ face: !pref("noFace") || undefined, sound: !pref("noSound") || undefined, trance: !pref("noTrance") || undefined,
  lead: !pref("noLead") || undefined });
const mapOn = () => typeof W.ChatRoomMapViewIsActive === "function" && W.ChatRoomMapViewIsActive() && W.Player && W.Player.MapData && W.Player.MapData.Pos;
const others = () => (W.ChatRoomCharacter || []).filter((c) => c && c.MemberNumber !== (W.Player && W.Player.MemberNumber));

// ── who can see and hear me ────────────────────────────────
let lastSight = "";
function sightTick() {
  try {
    if (W.CurrentScreen !== "ChatRoom" || !mapOn() || typeof W.ChatRoomMapViewCharacterIsVisible !== "function") return;
    const see = others().filter((c) => W.ChatRoomMapViewCharacterIsVisible(c)).map((c) => c.MemberNumber).sort();
    const hear = others().filter((c) => typeof W.ChatRoomMapViewCharacterIsHearable === "function" && W.ChatRoomMapViewCharacterIsHearable(c)).map((c) => c.MemberNumber).sort();
    const key = see.join(",") + "|" + hear.join(",");
    // send when it changes (checked every 4 s), and every 2 minutes anyway so the bot knows it's still fresh
    if (key === lastSight && Date.now() - (sightTick.at || 0) < 120000) return;
    lastSight = key; sightTick.at = Date.now();
    ctx.toBot("sight", { see, hear });
  } catch (e) { console.warn("[Farmhand Companion] sight:", e); }
}

// ── leadin' you somewhere on foot ──────────────────────────
let walk = null;
const DIRS = [["North", 0, -1], ["South", 0, 1], ["West", -1, 0], ["East", 1, 0]];
function canStep(x, y) { try { return W.ChatRoomMapViewCanEnterTile(x, y) > 0; } catch (e) { return false; } }
// breadth-first search to the target, or the nearest free tile right beside it if somebody's standin' on it
function findPath(from, to) {
  const wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40, key = (x, y) => x + "," + y;
  const goal = (x, y) => Math.max(Math.abs(x - to.X), Math.abs(y - to.Y)) <= (canStep(to.X, to.Y) ? 0 : 1);
  const prev = new Map([[key(from.X, from.Y), null]]), q = [[from.X, from.Y]];
  while (q.length) {
    const [x, y] = q.shift();
    if (goal(x, y)) {
      const path = []; let k = key(x, y);
      while (prev.get(k)) { const [px, py, d] = prev.get(k); path.unshift(d); k = key(px, py); }
      return path;
    }
    if (prev.size > 4000) break;
    for (const [d, dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= wide || ny >= high || prev.has(key(nx, ny)) || !canStep(nx, ny)) continue;
      prev.set(key(nx, ny), [x, y, d]); q.push([nx, ny]);
    }
  }
  return null;
}
export function lead(m) {
  const no = () => { walk = null; ctx.toBot("leadNo", { id: m.id }); };
  if (!pref("noLead") || !mapOn() || typeof W.ChatRoomMapViewMove !== "function") return no();
  const from = W.Player.MapData.Pos, to = { X: m.X, Y: m.Y };
  const path = findPath(from, to);
  if (!path) return no();
  if (!path.length) { ctx.toBot("leadOk", { id: m.id }); return; }
  ctx.local("You're led " + (m.why ? m.why : "along") + "…", "#c9a35b", true);
  walk = { id: m.id, to, path, i: 0, last: { X: from.X, Y: from.Y }, stuck: Date.now(), retried: false };
  stepWalk();
}
function stepWalk() {
  if (!walk) return;
  const w = walk, p = W.Player && W.Player.MapData && W.Player.MapData.Pos;
  if (!p) { walk = null; return; }
  if (p.X !== w.last.X || p.Y !== w.last.Y) { w.last = { X: p.X, Y: p.Y }; w.stuck = Date.now(); w.i++; }
  if (w.i >= w.path.length || Math.max(Math.abs(p.X - w.to.X), Math.abs(p.Y - w.to.Y)) <= 0) { walk = null; ctx.toBot("leadOk", { id: w.id }); return; }
  // somebody stepped in the way, or they wandered: work out a fresh path once
  if (Date.now() - w.stuck > 3000) {
    if (w.retried) { walk = null; ctx.toBot("leadNo", { id: w.id }); return; }
    const path = findPath(p, w.to);
    if (!path) { walk = null; ctx.toBot("leadNo", { id: w.id }); return; }
    Object.assign(w, { path, i: 0, stuck: Date.now(), retried: true });
  }
  if (W.ChatRoomMapViewMovement == null) { try { W.ChatRoomMapViewMove(w.path[w.i]); } catch (e) { /* the game says no: the stuck timer handles it */ } }
  setTimeout(stepWalk, 150);
}

// ── your face ──────────────────────────────────────────────
const FACES = {
  milkdrunk: { Eyes: "Dazed", Blush: "Medium", Mouth: "HalfOpen" },
  heat:      { Eyes: "Horny", Blush: "High", Mouth: "LipBite" },
  trance:    { Eyes: "Daydream", Blush: "Low", Mouth: "HalfOpen" },
  afterglow: { Eyes: "Dazed", Blush: "VeryHigh", Mouth: "Open" },
  bred:      { Eyes: "Lewd", Blush: "High", Mouth: "Moan" },
  milked:    { Eyes: "Closed", Blush: "Medium", Mouth: "HalfOpen" },
  edged:     { Eyes: "Horny", Blush: "VeryHigh", Mouth: "Pained" },
  clear:     { Eyes: null, Blush: null, Mouth: null },
};
export function face(m) {
  const f = FACES[m.mood]; if (!f || !pref("noFace") || typeof W.CharacterSetFacialExpression !== "function" || !W.Player) return;
  const secs = m.mood === "clear" ? null : Math.max(5, Math.min(1800, Number(m.secs) || 30));
  for (const [g, e] of Object.entries(f)) {
    try { W.CharacterSetFacialExpression(W.Player, g, e, secs); if (g === "Eyes") W.CharacterSetFacialExpression(W.Player, "Eyes2", e, secs); } catch (e2) { /* an expression this body doesn't have */ }
  }
}

// ── sounds only you hear (the game's own sound files, at your game volume) ──
const SOUNDS = { pump: "SciFiPump", machine: "Sybian", bell: "BellMedium", cowbell: "BellSmall", stall: "CageClose", gate: "CageOpen",
  bowl: "PlaceBowl", wet: "Slime", chain: "ChainShort", lock: "LockSmall", vibe: "VibratorShort", spank: "SpankSkin1" };
export function sound(m) {
  const f = SOUNDS[m.name]; if (!f || !pref("noSound") || typeof W.AudioPlayInstantSound !== "function") return;
  const vol = (W.Player && W.Player.AudioSettings && W.Player.AudioSettings.Volume) || 0;
  try { W.AudioPlayInstantSound("Audio/" + f + ".mp3", vol * 0.6); } catch (e) { /* no sound: fine */ }
}

// ── the trance haze ────────────────────────────────────────
export function trance(m) {
  let el = W.document.getElementById("fhc-trance");
  const lvl = pref("noTrance") ? Math.max(0, Math.min(3, Number(m.level) || 0)) : 0;
  if (!lvl) { if (el) el.remove(); return; }
  if (!el) {
    el = W.document.createElement("div"); el.id = "fhc-trance";
    el.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998;transition:opacity 4s;opacity:0;animation:fhcTrance 6s ease-in-out infinite";
    if (!W.document.getElementById("fhc-trance-css")) {
      const s = W.document.createElement("style"); s.id = "fhc-trance-css";
      s.textContent = "@keyframes fhcTrance{0%,100%{filter:brightness(1)}50%{filter:brightness(0.85)}}";
      W.document.head.appendChild(s);
    }
    W.document.body.appendChild(el);
  }
  const edge = [0, 0.25, 0.45, 0.65][lvl], inner = [0, 55, 42, 30][lvl];
  el.style.background = "radial-gradient(ellipse at center, transparent " + inner + "%, rgba(70,20,90," + edge + ") 100%)";
  (W.requestAnimationFrame || ((f) => setTimeout(f, 16)))(() => { el.style.opacity = "1"; });
}

// ── private feelings, from your own gear and arousal ───────
let lastFeel = "";
function feelTick() {
  try {
    if (!pref("noFeelings") || W.CurrentScreen !== "ChatRoom" || !W.Player || !ctx.panel.s || !ctx.panel.s.onBooks) return;
    if (Date.now() < (feelTick.next || 0)) return;
    feelTick.next = Date.now() + (7 + Math.random() * 6) * 60000;
    const s = ctx.panel.s, items = (W.Player.Appearance || []).filter((x) => x && x.Asset && x.Asset.Group);
    const grp = (g) => items.find((x) => x.Asset.Group.Name === g);
    const eff = (x) => [].concat((x.Property && x.Property.Effect) || [], x.Asset.Effect || []);
    const arousal = (W.Player.ArousalSettings && W.Player.ArousalSettings.Progress) || 0;
    const lines = [];
    if (grp("ItemButt")) lines.push("The plug shifts inside you every time you move, a full, stubborn pressure you can't ignore.");
    if (items.some((x) => eff(x).includes("Chaste")) && arousal > 40) lines.push("Your chastity aches. You're throbbing against it and it doesn't give an inch.");
    if (s.milk && s.milk.cap && s.milk.ml / s.milk.cap > 0.8) lines.push("Your udders are tight and heavy, prickling with milk. Any squeeze at all would make them leak.");
    if (s.holding && s.holding.cap && s.holding.ml / s.holding.cap > 0.6) lines.push("Everything they put in you sloshes when you shift your weight. You can feel how full you are.");
    if (s.heatUntil && s.heatUntil > Date.now()) lines.push("Heat rolls through you in slow waves. Every brush of fabric is almost too much.");
    if (s.preg) lines.push("Something shifts low in your belly, slow and heavy. The litter is settling in.");
    if (grp("ItemMouth") && items.some((x) => ["ItemMouth", "ItemMouth2", "ItemMouth3"].includes(x.Asset.Group.Name) && eff(x).includes("BlockMouth"))) lines.push("Drool gathers around the gag and slips down your chin. You can't stop it.");
    if (arousal > 85) lines.push("You're right on the edge and everyone around you can probably tell.");
    const pool = lines.filter((l) => l !== lastFeel);
    if (!pool.length) return;
    lastFeel = pool[Math.floor(Math.random() * pool.length)];
    ctx.local(lastFeel, "#b58ad9", true);
  } catch (e) { console.warn("[Farmhand Companion] feelings:", e); }
}

// ── staff map markers ──────────────────────────────────────
export function drawMarkers() {
  try {
    const s = ctx.panel.s;
    if (!s || !s.staff || !Array.isArray(s.herd) || !pref("noMarkers") || !mapOn() || typeof W.DrawText !== "function") return;
    const R = W.ChatRoomMapViewPerceptionRange || 6, tile = 1000 / (R * 2 + 1), me = W.Player.MapData.Pos;
    for (const x of s.herd) {
      const C = (W.ChatRoomCharacter || []).find((c) => c.MemberNumber === x.mn);
      if (!C || !C.MapData || !C.MapData.Pos || !W.ChatRoomMapViewCharacterIsVisible(C)) continue;
      const tags = [];
      if (x.milk !== null && x.milk >= 75) tags.push(["M", "#7fa8c9"]);
      if (x.heat) tags.push(["H", "#d9534f"]);
      if (x.preg) tags.push(["B", "#8fbf6a"]);
      if (x.denied) tags.push(["X", "#c9a35b"]);
      if (!tags.length) continue;
      const sx = (C.MapData.Pos.X - me.X + R) * tile, sy = (C.MapData.Pos.Y - me.Y) * tile + R * tile;
      if (sx < 0 || sy < 0 || sx > 1000 || sy > 1000) continue;
      tags.forEach(([t, col], i) => W.DrawText(t, sx + tile * 0.2 + i * tile * 0.22, sy + tile * 0.15, col, "black"));
    }
  } catch (e) { /* never break the game's drawing */ }
}
