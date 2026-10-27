/* WHAT'S IN THIS FILE (cues.js)
   Things the Companion does on YOUR screen for the farm, so the farm girl needn't move or whisper:
   • sight:    when it changes (at most every 8 s, and every 2 minutes), tells the bot who you can see and hear, so private farm lines reach
               exactly the people around you.
   • lead:     walks you somewhere step by step (pathfindin', at your own speed, slower when you're bound)
               instead of you bein' teleported. If there's no way through, the bot teleports you after all.
   • face:     sets your own face for a while (dazed when milk-drunk, flushed in heat, a trance stare…).
   • sound:    plays a farm sound only you hear (the pump, the stall door, the feedin' bell).
   • trance:   a soft haze at the edges of your screen during conditioning, deeper as you sink.
   • feelings: now and then, a private line about what you're actually feelin' (a plug, a cage, full
               udders, a sloshin' belly, heat), from your own gear and arousal. Only you see these.
   • markers:  staff see little badges over the stock on their own map (needs milkin', in heat, expectin').
   • slow:     you walk slower the more you're carryin' (a pumped belly, a late litter, a clutch of eggs).
   • stir:     OFF until you switch it on: traps, toys and scenes nudge your arousal meter, and while the farm has
               you denied you're held at the edge.
   Each one has a switch in Toggles → "This panel".
*/
const W = window;
let ctx = null;   // { toBot, panel, local }

export function initCues(c) { ctx = c; setInterval(sightTick, 4000); setInterval(feelTick, 60000); setInterval(heelTick, 500); }
const pref = (k) => !ctx.panel.prefs[k];   // every cue is on unless switched off
export const cueOff = () => ({ face: !pref("noFace") || undefined, sound: !pref("noSound") || undefined, trance: !pref("noTrance") || undefined,
  lead: !pref("noLead") || undefined, slow: !pref("noSlow") || undefined, stir: (ctx.panel.prefs.stir ? undefined : true), gear: (ctx.panel.prefs.gear ? undefined : true) });
const mapOn = () => typeof W.ChatRoomMapViewIsActive === "function" && W.ChatRoomMapViewIsActive() && W.Player && W.Player.MapData && W.Player.MapData.Pos;
const others = () => (W.ChatRoomCharacter || []).filter((c) => c && c.MemberNumber !== (W.Player && W.Player.MemberNumber));

// ── who can see and hear me ────────────────────────────────
let lastSight = "";
function sightTick() {
  try {
    if (W.CurrentScreen !== "ChatRoom" || !mapOn() || typeof W.ChatRoomMapViewCharacterIsVisible !== "function") return;
    const see = others().filter((c) => W.ChatRoomMapViewCharacterIsVisible(c)).map((c) => c.MemberNumber).sort();
    const hear = others().filter((c) => typeof W.ChatRoomMapViewCharacterIsHearable === "function" && W.ChatRoomMapViewCharacterIsHearable(c)).map((c) => c.MemberNumber).sort();
    // my own LSCG splatter switch: the bot has no LSCG, so it can't see it any other way
    const LS = W.Player && W.Player.LSCG, S = LS && LS.SplatterModule;
    const splat = S ? !!(S.enabled && S.taker !== false && (!LS.GlobalModule || LS.GlobalModule.enabled !== false)) : undefined;
    const key = see.join(",") + "|" + hear.join(",") + "|" + splat;
    // send when it changes (checked every 4 s, sent at most every 8: walkin' about changed it every check, and every one
    // landed on the farm girl's connection, Oct 27), and every 2 minutes anyway so the bot knows it's still fresh
    if (key === lastSight && Date.now() - (sightTick.at || 0) < 120000) return;
    if (Date.now() - (sightTick.at || 0) < 8000) return;
    lastSight = key; sightTick.at = Date.now();
    ctx.toBot("sight", splat === undefined ? { see, hear } : { see, hear, splat });
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
  const no = () => { if (walk && !walk.heel) walk = null; ctx.toBot("leadNo", { id: m.id }); };
  if (!pref("noLead") || !mapOn() || typeof W.ChatRoomMapViewMove !== "function") return no();
  const from = W.Player.MapData.Pos, to = { X: m.X, Y: m.Y };
  const path = findPath(from, to);
  if (!path) return no();
  if (!path.length) { ctx.toBot("leadOk", { id: m.id }); return; }
  ctx.local("You're led " + (m.why ? m.why : "along") + "…", "#c9a35b", true);
  startWalk({ id: m.id, to, path, i: 0, last: { X: from.X, Y: from.Y }, stuck: Date.now(), retried: false });
}
// one walk at a time, one step loop at a time (the reins start a fresh walk every time the leader moves on)
let stepping = false;
function startWalk(w) { walk = w; if (!stepping) { stepping = true; stepWalk(); } }
function stepWalk() {
  const w = walk, p = W.Player && W.Player.MapData && W.Player.MapData.Pos;
  // done: the farm hears how it went (a walk on the reins says nothin', it just stops)
  const end = (ok) => { if (walk === w) walk = null; stepping = false; if (w && !w.heel) ctx.toBot(ok ? "leadOk" : "leadNo", { id: w.id }); };
  if (!w) { stepping = false; return; }
  if (!p) { walk = null; stepping = false; return; }
  if (p.X !== w.last.X || p.Y !== w.last.Y) { w.last = { X: p.X, Y: p.Y }; w.stuck = Date.now(); w.i++; }
  if (w.i >= w.path.length || Math.max(Math.abs(p.X - w.to.X), Math.abs(p.Y - w.to.Y)) <= 0) return end(true);
  // somebody stepped in the way, or they wandered: work out a fresh path once
  if (Date.now() - w.stuck > 3000) {
    if (w.retried) return end(false);
    const path = findPath(p, w.to);
    if (!path) return end(false);
    Object.assign(w, { path, i: 0, stuck: Date.now(), retried: true });
  }
  if (W.ChatRoomMapViewMovement == null) { try { W.ChatRoomMapViewMove(w.path[w.i]); } catch (e) { /* the game says no: the stuck timer handles it */ } }
  setTimeout(stepWalk, 150);
}

// ── on the reins (?reins): at heel, a step behind whoever holds them ──
// The farm says who (your panel's "reins"); this walks you, at your own pace, to the tile just behind them: the side
// they came from. It waits while somethin' else of the farm's has hold of you (hold), and stops when the reins come off.
let heel = null;
export function reinsState(r) {
  const on = r && Number(r.mn) && !r.hold && Number(r.until || 0) > Date.now();
  if (!on) {
    if (heel && !(r && r.hold)) ctx.local("🐴 The reins come off.", "#c9a35b", true);
    heel = (r && r.hold && heel) ? Object.assign(heel, { hold: true }) : null;
    if (walk && walk.heel) walk = null;
    return;
  }
  if (!heel || heel.mn !== Number(r.mn)) ctx.local("🐴 You're on " + String(r.name || "somebody") + "'s reins: you'll follow a step behind them till they let go. Your safeword frees you.", "#c9a35b", true);
  if (!heel || heel.mn !== Number(r.mn)) heel = { mn: Number(r.mn), trail: [] };
  heel.hold = false; heel.until = Number(r.until);
}
function heelTick() {
  try {
    if (!heel || heel.hold || W.CurrentScreen !== "ChatRoom" || !mapOn() || !pref("noLead") || typeof W.ChatRoomMapViewMove !== "function") return;
    if (heel.until && heel.until < Date.now()) { heel = null; return; }
    const C = others().find((c) => c.MemberNumber === heel.mn), lp = C && C.MapData && C.MapData.Pos;
    if (!lp || lp.X < 0) return;
    const t = heel.trail, last = t[t.length - 1];
    if (!last || last.X !== lp.X || last.Y !== lp.Y) { t.push({ X: lp.X, Y: lp.Y }); if (t.length > 4) t.shift(); }
    const me = W.Player.MapData.Pos;
    if (Math.max(Math.abs(me.X - lp.X), Math.abs(me.Y - lp.Y)) <= 1) { if (walk && walk.heel) walk = null; return; }   // at heel
    if (walk && !walk.heel) return;   // the farm's walkin' you somewhere else just now
    // a step behind: next to them, on the side they came from (or wherever's free beside them)
    const from = t.length > 1 ? t[t.length - 2] : me, dx = Math.sign(from.X - lp.X), dy = Math.sign(from.Y - lp.Y);
    const to = (dx || dy) && canStep(lp.X + dx, lp.Y + dy) ? { X: lp.X + dx, Y: lp.Y + dy } : { X: lp.X, Y: lp.Y };
    if (walk && walk.heel && walk.to.X === to.X && walk.to.Y === to.Y) return;
    const path = findPath(me, to);
    if (!path || !path.length) return;
    startWalk({ id: 0, heel: true, to, path, i: 0, last: { X: me.X, Y: me.Y }, stuck: Date.now(), retried: false });
  } catch (e) { console.warn("[Farmhand Companion] reins:", e); }
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
// Every name here is one of the game's own files in BondageClub/Audio (checked against the game's folder, Oct 12).
// A name this panel doesn't know is simply not played, so the farm girl can ask for new ones safely.
const SOUNDS = { pump: "SciFiPump", machine: "Sybian", bell: "BellMedium", cowbell: "BellSmall", stall: "HydraulicLock", gate: "CageOpen",
  latch: "HydraulicLock", unlatch: "HydraulicUnlock", clip: "MetalClip", hiss: "Deflation", rope: "RopeShort1", ropelong: "RopeLong1", rip: "ClothSlip",
  clamp: "MetalShut", inflate: "Inflation", chainlong: "ChainLong", softgate: "SofterCageClose", latex: "BalloonStretch", rubber: "BalloonRubbing",
  wood: "WoodenCuffs", straw: "SoftFurniture", biglock: "LockLarge", unlock: "UnlockSmall", buzz: "VibrationTone4ShortLoop", zap: "Shocks",
  creak: "LeatherCreak", paddle: "BrushSpank1", crop: "SmackCrop1", scifi: "SciFiEffect", beeps: "SciFiBeeps1", squeak: "SqueakToy", cuffs: "CuffsMetal",   // (the stall latchin' on used to be a cage door slammin': jarring, said Laynie, Oct 12)
  bowl: "PlaceBowl", wet: "Slime", chain: "ChainShort", lock: "LockSmall", vibe: "VibratorShort", spank: "SpankSkin1" };
const QUIET = { stall: 0.35, latch: 0.35, unlatch: 0.35, pump: 0.4, machine: 0.4, inflate: 0.4, hiss: 0.4, buzz: 0.3, zap: 0.35, clamp: 0.45, softgate: 0.4 };   // the ones that run under a scene sit lower
export function sound(m) {
  const f = SOUNDS[m.name]; if (!f || !pref("noSound") || typeof W.AudioPlayInstantSound !== "function") return;
  const vol = (W.Player && W.Player.AudioSettings && W.Player.AudioSettings.Volume) || 0;
  try { W.AudioPlayInstantSound("Audio/" + f + ".mp3", vol * (QUIET[m.name] || 0.6)); } catch (e) { /* no sound: fine */ }
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
// Each feeling has a handful of ways to say it (seen live: "The litter is settling in." twelve times in a day).
// The last several lines shown aren't used again for a while.
const FEEL = {
  plug: ["The plug shifts inside you every time you move, a full, stubborn pressure you can't ignore.",
         "You sit down carefully. The plug reminds you exactly where it is.",
         "Every step nudges the plug a little deeper, and your breath catches each time.",
         "The plug sits snug and heavy, stretching you just enough that you never forget it.",
         "You clench around the plug without meaning to, and feel your face go warm."],
  chaste: ["Your chastity aches. You're throbbing against it and it doesn't give an inch.",
           "You strain against the cage and it holds you exactly where it wants you.",
           "A hot pulse of want hits the steel and goes nowhere. It never goes anywhere.",
           "You shift your hips, hoping for friction. The chastity makes sure there isn't any."],
  udders: ["Your udders are tight and heavy, prickling with milk. Any squeeze at all would make them leak.",
           "Your breasts ache with milk, swollen and warm. You're overdue for the stall.",
           "A bead of milk slips free and runs down. You're so full it's starting to leak on its own.",
           "Every movement makes your heavy breasts sway, and every sway reminds you how full they are.",
           "Your nipples tingle and stiffen, begging for the cups."],
  sloshing: ["Everything they put in you sloshes when you shift your weight. You can feel how full you are.",
             "You're warm and heavy inside, full of what the farm gave you.",
             "A little trickles out when you move, and you squeeze your thighs together to keep the rest.",
             "Your belly feels round and full. You put a hand on it without thinking.",
             "You can still feel every load inside you, sitting warm and heavy."],
  heat: ["Heat rolls through you in slow waves. Every brush of fabric is almost too much.",
         "You're in heat, and the whole farm smells like an invitation.",
         "Your skin is flushed and sensitive, and you can't stop thinking about being bred.",
         "You catch yourself rubbing against things. The heat isn't letting up.",
         "A slow, aching need settles low in your belly and stays there."],
  preg: ["Something shifts low in your belly, slow and heavy. The litter is settling in.",
         "A tiny kick, then another. Somebody in there is awake.",
         "Your belly feels heavier today. You rest a hand on the curve of it.",
         "A flutter low inside you, soft as a moth, then gone.",
         "You catch yourself craving something salty, and something sweet, and then both at once.",
         "Your back aches pleasantly under the weight you're carrying.",
         "The little ones roll over inside you, and your whole belly shifts with them.",
         "You feel round and full and very, very bred.",
         "A firm little push against your palm, right where your hand was resting."],
  drool: ["Drool gathers around the gag and slips down your chin. You can't stop it.",
          "Your jaw aches around the gag, and a string of drool finally gives way.",
          "You try to swallow around the gag. It doesn't help. Your chin is wet again.",
          "The gag fills your mouth, and every breath reminds you you can't say a word."],
  edge: ["You're right on the edge and everyone around you can probably tell.",
         "One more touch, anywhere at all, and you'd tip right over.",
         "Your breath is coming fast and shallow. You're so close it hurts.",
         "You squirm in place, aching, hovering right at the brink.",
         "Every little sensation is too much. You're balanced on a knife's edge."],
  milked: ["Your breasts feel light and tender after the milking, nipples still a little puffy.",
           "There's a pleasant, empty ache in your chest where all that milk used to be.",
           "Your nipples are still sensitive from the cups. Even your clothes feel like too much."],
};
const recentFeel = [];
function feelTick() {
  try {
    if (!pref("noFeelings") || W.CurrentScreen !== "ChatRoom" || !W.Player || !ctx.panel.s || !ctx.panel.s.onBooks) return;
    if (Date.now() < (feelTick.next || 0)) return;
    feelTick.next = Date.now() + (7 + Math.random() * 6) * 60000;
    const s = ctx.panel.s, items = (W.Player.Appearance || []).filter((x) => x && x.Asset && x.Asset.Group);
    const grp = (g) => items.find((x) => x.Asset.Group.Name === g);
    const eff = (x) => [].concat((x.Property && x.Property.Effect) || [], x.Asset.Effect || []);
    const arousal = (W.Player.ArousalSettings && W.Player.ArousalSettings.Progress) || 0;
    const kinds = [];
    if (grp("ItemButt")) kinds.push("plug");
    if (items.some((x) => eff(x).includes("Chaste")) && arousal > 40) kinds.push("chaste");
    if (s.milk && s.milk.cap && s.milk.ml / s.milk.cap > 0.8) kinds.push("udders");
    if (s.milk && s.milk.cap && s.milk.lastAt && Date.now() - s.milk.lastAt < 30 * 60000 && s.milk.ml / s.milk.cap < 0.35) kinds.push("milked");
    if (s.holding && s.holding.cap && s.holding.ml / s.holding.cap > 0.6) kinds.push("sloshing");
    if (s.heatUntil && s.heatUntil > Date.now()) kinds.push("heat");
    if (s.preg) kinds.push("preg");
    if (grp("ItemMouth") && items.some((x) => ["ItemMouth", "ItemMouth2", "ItemMouth3"].includes(x.Asset.Group.Name) && eff(x).includes("BlockMouth"))) kinds.push("drool");
    if (arousal > 85) kinds.push("edge");
    const pool = [].concat(...kinds.map((k) => FEEL[k])).filter((l) => !recentFeel.includes(l));
    if (!pool.length) return;
    const line = pool[Math.floor(Math.random() * pool.length)];
    recentFeel.push(line); while (recentFeel.length > 8) recentFeel.shift();
    ctx.local(line, "#b58ad9", true);
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

// ── your body, the farm's way (index.js hooks these in) ────
// slow: the more you're carryin' (a pumped belly, a late litter, a clutch of eggs), the slower you walk. The farm girl
//       works out how much (state.slow); this just stretches the game's own step time. On unless you switch it off.
// arouse: a trap, a toy or a scene nudges your arousal meter. OFF until you turn "Farm can stir me up" on.
// denied: while the farm has you denied, the same switch holds you at the edge instead of lettin' you cum.
const stirOn = () => !!ctx.panel.prefs.stir;
const deniedNow = () => { const s = ctx.panel.s; return !!(s && s.deniedUntil && s.deniedUntil > Date.now()); };
export function slowFactor() {
  const s = ctx && ctx.panel && ctx.panel.s;
  if (!s || !pref("noSlow") || !(s.slow > 1)) return 1;
  return Math.max(1, Math.min(3, Number(s.slow) || 1));
}
export function arouse(m) {
  try {
    if (!stirOn() || !W.Player || !W.Player.ArousalSettings || typeof W.ActivitySetArousal !== "function") return;
    if (W.Player.ArousalSettings.Active === "Inactive" || W.Player.ArousalSettings.Active === "NoMeter") return;
    const cur = Number(W.Player.ArousalSettings.Progress) || 0, cap = Math.max(0, Math.min(deniedNow() ? 94 : 100, Number(m.cap) || 100));
    const next = Math.max(0, Math.min(cap, cur + (Number(m.add) || 0)));
    if (next > cur || m.add < 0) W.ActivitySetArousal(W.Player, next);
  } catch (e) { console.warn("[Farmhand Companion] arouse:", e); }
}
// vibe: while a trap has you, any buzzin' toy you're really wearin' follows the scene: low while it teases, high when it
// breeds you, dead still while you're denied. The same "Farm can stir me up" switch. Your toys go back how you had
// them when it's done (or two minutes after the farm girl last said anything, whatever happens to her).
const VIBE_MODE = ["Low", "Medium", "High", "Maximum"];
let vibeWas = null, vibeTimer = null;
const vibeToys = () => (W.Player && Array.isArray(W.Player.Appearance) ? W.Player.Appearance : []).filter((it) => it && it.Asset && it.Asset.Group && it.Property && typeof it.Property.Intensity === "number" &&
  !(it.Property.LockedBy && typeof W.DialogCanUnlock === "function" && !W.DialogCanUnlock(W.Player, it)));
function vibePush(toys) {
  if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(W.Player, false);
  if (typeof W.ChatRoomCharacterItemUpdate === "function") toys.forEach((it) => W.ChatRoomCharacterItemUpdate(W.Player, it.Asset.Group.Name));
  else if (typeof W.ChatRoomCharacterUpdate === "function") W.ChatRoomCharacterUpdate(W.Player);
}
function vibeSet(it, level, mode) {
  it.Property.Intensity = level; it.Property.Mode = mode || (level < 0 ? "Off" : VIBE_MODE[level]);
  const eff = new Set(Array.isArray(it.Property.Effect) ? it.Property.Effect : []);
  if (level < 0) eff.delete("Vibrating"); else eff.add("Vibrating");
  it.Property.Effect = Array.from(eff);
}
function vibeRestore() {
  clearTimeout(vibeTimer); vibeTimer = null;
  const was = vibeWas; vibeWas = null;
  if (!was) return;
  try {
    const toys = vibeToys().filter((it) => was[it.Asset.Group.Name + "/" + it.Asset.Name]);
    toys.forEach((it) => { const w = was[it.Asset.Group.Name + "/" + it.Asset.Name]; vibeSet(it, w.level, w.mode); });
    if (toys.length) vibePush(toys);
  } catch (e) { console.warn("[Farmhand Companion] toys back:", e); }
}
export function vibe(m) {
  try {
    if (m.level == null) return vibeRestore();
    if (!stirOn()) return;
    const toys = vibeToys();
    if (!toys.length) return;
    if (!vibeWas) { vibeWas = {}; toys.forEach((it) => { vibeWas[it.Asset.Group.Name + "/" + it.Asset.Name] = { level: it.Property.Intensity, mode: it.Property.Mode }; }); }
    const level = Math.max(-1, Math.min(3, Math.round(Number(m.level)) || 0));
    const change = toys.filter((it) => it.Property.Intensity !== level);
    change.forEach((it) => vibeSet(it, level));
    if (change.length) vibePush(change);
    clearTimeout(vibeTimer);
    const hold = Number(m.until) - Date.now();
    vibeTimer = setTimeout(vibeRestore, hold > 0 ? Math.min(hold, 3600000) : 120000);
  } catch (e) { console.warn("[Farmhand Companion] toys:", e); }
}
export function initBody(mod) {
  // the step time the game works out, stretched. Never turns a blocked tile into an open one or the other way round.
  try {
    mod.hookFunction("ChatRoomMapViewCanEnterTile", 0, (args, next) => {
      const t = next(args);
      try { const f = slowFactor(); return t > 0 && f > 1 && !(typeof W.ChatRoomMapViewHasSuperPowers === "function" && W.ChatRoomMapViewHasSuperPowers()) ? t * f : t; } catch (e) { return t; }
    });
  } catch (e) { console.warn("[Farmhand Companion] slowed walkin' unavailable:", e); }
  // denied by the farm: held at the edge instead of goin' over (only with "Farm can stir me up" on)
  try {
    mod.hookFunction("ActivityOrgasmPrepare", 0, (args, next) => {
      try {
        const C = args[0];
        if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && stirOn() && deniedNow()) {
          C.ArousalSettings.Progress = 94;
          if (Date.now() - (initBody.told || 0) > 60000) { initBody.told = Date.now(); ctx.local("Right at the edge, and the farm won't let you over it. Not yet, sugar.", "#c9a35b", true); }
          return;
        }
      } catch (e) { /* the game's own way, then */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] denial unavailable:", e); }
}
