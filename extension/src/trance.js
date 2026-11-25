/* WHAT'S IN THIS FILE (trance.js)
   THE FARM'S TRANCE, on your own game (Nov 25, Conditioning 2.0). Laynie: LSCG's hypnosis at the core, with ECHS's feel
   and HSC-style looks; "with lscg, the farms version"; beats by band ("theta and delta"); "focus on lscgs default
   suggestion inputs on the first rendition".

   • WITH LSCG (its hypnosis on, and the farm let in: LSCG settings → Extensions → B&B Farm, Hypnosis and States):
     a session puts you under LSCG's own trance in the farm's name, keeps it up till the session's done (LSCG's trance
     time would cut it short), plays the session's beats through LSCG's own binaural beats if you turned them on there
     (never louder than your own setting), and wakes you. The farm's triggers go into your LSCG as its own suggestions
     (the bot plants them; LSCG checks it like any hypnotist's) and LSCG carries them out.
   • WITHOUT LSCG: the farm's own trance on your screen; the farm's beats if you switch them on here (headphones); the
     farm's triggers kept here and carried out here, with a give-in-or-fight choice like LSCG's.
   • THE LOOK (HSC-style, never flashing: everything moves at breathin' pace and nothin' follows the beat rate): a lilac
     haze at the edges, a slow turning spiral (LSCG's own when it's drawin' one), soft rings, the farm's words driftin' up
     the screen, blurred names, a warm glow when you cum. "Calm trance look" keeps it still. "Trance look" off: none of it.
   • Your safeword ends it all. Nothin' here reaches past what your LSCG allows.
*/
import { LS, onAccount } from "./acct.js";
import { VERSION } from "./version.js";
import { BOT_MEMBER } from "./config.js";

const W = window;
const LSCG_ID = "bnbfarm";
const SUGG_PREFIX = "bnbfarm-";
const FARM_KEY = "fhc-farm-sugg";
const INSTR = ["Orgasm", "Denial", "Insatiable", "Perform Activity", "Strip", "Assume Pose", "Follow", "Speak Phrase", "Forget"];
const MAX_MS = 3 * 3600000;
let ctx = null;   // { toBot, toChat, prefs(), botHere(), mod, arouse(add, cap), lead(m), relayOk() }
let LA = null;    // our handle on LSCG's extension API
// the trance as it is: the session (who put you under, till when, LSCG's or the farm's), the look, the farm's triggers
const T = { session: null, lingerUntil: 0, look: {}, depth: 0, farm: [], pull: {}, pending: null, phrase: null, denyUntil: 0, needyUntil: 0, needyAt: 0,
  keptAt: 0, waking: false, lastReport: "", glide: null };
export const tranceState = T;   // (tests)

export function initTrance(c) {
  ctx = c;
  loadFarm();
  hookLscg();
  hookChat();
  hookGame();
  onAccount(() => { endAll(true); loadFarm(); T.lastReport = ""; });
  setInterval(tick, 5000);
}

// ── LSCG ─────────────────────────────────────────────────────
const H = () => { const P = W.Player && W.Player.LSCG; return (P && P.HypnoModule) || null; };
function lscgHypnoOn() {
  const P = W.Player && W.Player.LSCG, h = H();
  return !!(LA && h && h.enabled && !(P.GlobalModule && P.GlobalModule.enabled === false));
}
function granted(scope) { try { return !!(LA && LA.operations && LA.operations.isGranted(scope)); } catch (e) { return false; } }
function hypnotized() { try { return granted("hypno") ? !!LA.operations.hypno.isHypnotized() : false; } catch (e) { return false; } }
function hypState() { try { return granted("states") ? LA.operations.states.get("hypnotized") || null : null; } catch (e) { return null; } }
function hookLscg() {
  const q = (W.LSCG_OnLoad = W.LSCG_OnLoad || []);
  q.push((Lg) => {
    try { LA = Lg.getModApi({ id: LSCG_ID, name: "B&B Farm", version: VERSION }); } catch (e) { LA = null; return; }   // (turned off on LSCG's login badge)
    try { LA.operations.request(["hypno", "states"], "The farm's trance sessions: put you under LSCG's own trance in the farm's name, keep it up for the session, wake you, and play the session's beats if you turned beats on (never louder than your setting)."); } catch (e) { /* an older LSCG */ }
    const on = (ev, f) => { try { LA.events.on(ev, (p) => { try { f(p || {}); } catch (e) { console.warn("[Farmhand Companion] trance:", e); } }); } catch (e) { /* an older LSCG */ } };
    on("hypno.awakened", (p) => brought(p.method || "other"));
    on("state.recovered", (p) => { if (p.type === "hypnotized") brought(p.reason === "expired" ? "timeout" : p.reason === "safeword" ? "safeword" : p.reason === "dispel" ? "dispel" : "other"); });
    on("safeword", () => { event({ ev: "safeword" }); endAll(); });
    on("hypno.suggestionResolved", (p) => { if (Number(p.installedBy) === BOT_MEMBER) event({ ev: "resolved", name: String(p.suggestion || "").slice(0, 80), resisted: !!p.resisted }); });
    on("hypno.triggered", () => report());
    on("settings.saved", () => report());
    try { LA.operations.onChange(() => report(true)); } catch (e) { /* fine */ }
    try { LA.onReady(() => report(true)); } catch (e) { /* fine */ }
  });
}
// they came up out of LSCG's trance some way the farm didn't ask for (a snap, a boop, their wake word, LSCG's own time)
function brought(method) {
  const s = T.session;
  if (T.waking || !s || s.via !== "lscg" || s.ended) return;
  if (method === "safeword") { event({ ev: "safeword" }); endAll(); return; }
  s.ended = true;
  event({ ev: "awake", method });
  report(true);
}

// ── the bot's cues ──────────────────────────────────────────
export function onHypno(m) {
  if (!m || typeof m.do !== "string") return;
  switch (m.do) {
    case "under": under(m); break;
    case "keep": if (T.session) T.session.until = Date.now() + clampMs(m.ms); break;
    case "cue": if (T.session || lingering()) { if (m.look && typeof m.look === "object") look(m.look); if (m.beats && typeof m.beats === "object") beats(m.beats, m.volume); else if (m.volume != null) beatsVolume(m.volume); } break;
    case "depth": T.depth = Math.max(0, Math.min(100, Number(m.depth) || 0)); drawLook(); break;
    case "wake": wake(); break;
    case "linger": linger(Number(m.secs) || 120); break;
    case "check": check(m.ids); break;
    case "suggestions": setFarm(m.list); break;
    case "clear": endAll(); break;
  }
}
const clampMs = (ms) => Math.max(60000, Math.min(MAX_MS, Number(ms) || 1800000));
const lingering = () => T.lingerUntil > Date.now();
function under(m) {
  const now = Date.now();
  T.session = { by: Number(m.by) || BOT_MEMBER, until: now + clampMs(m.ms), level: String(m.level || ""), via: "farm", ours: false, ended: false };
  T.lingerUntil = 0; T.depth = 0; T.look = {};
  // LSCG's own trance, in the farm's name: LSCG then counts the farm as the one who put them under (its suggestions need it)
  if (lscgHypnoOn()) {
    const h = hypState();
    if (h) { try { h.activate(T.session.by, T.session.until - now); T.session.via = "lscg"; T.session.ours = true; T.keptAt = now; } catch (e) { console.warn("[Farmhand Companion] LSCG trance:", e); } }
  }
  look({ haze: 20 }, true);
  event({ ev: "under", via: T.session.via });
  report(true);
}
function wake() {
  const s = T.session;
  T.session = null; T.lingerUntil = 0;
  if (s && s.via === "lscg" && s.ours && !s.ended && hypnotized()) {
    const h = hypState();
    if (h) { T.waking = true; try { h.recover(); } catch (e) { /* fine */ } T.waking = false; }
  }
  glideStop(); farmBeatsStop(2); clearLook(); report(true);
}
// No human left: the trance runs out on its own (LSCG's time, or its length), the look lifts after a while
function linger(secs) {
  if (T.session) T.session.keepOff = true;
  T.lingerUntil = Date.now() + Math.max(10, Math.min(600, secs)) * 1000;
  report(true);
}
function endAll(quiet) {
  const had = !!(T.session || lingering() || T.pending || T.phrase || T.denyUntil > Date.now() || T.needyUntil > Date.now());
  wake();
  T.pending = null; T.phrase = null; T.denyUntil = 0; T.needyUntil = 0;
  const el = W.document && W.document.querySelectorAll ? W.document.querySelectorAll(".fhc-sg-ask") : [];
  for (const x of el) x.remove();
  if (had && !quiet && ctx) ctx.toChat("🌀 All of it lets go of you.", "#a67fd4", true);
}
function check(ids) {
  const h = H(), have = h && Array.isArray(h.suggestions) ? h.suggestions.map((s) => s && s.id) : [];
  const list = Array.isArray(ids) ? ids.filter((x) => typeof x === "string").slice(0, 100) : [];
  event({ ev: "checked", ids: list, found: list.filter((id) => have.includes(id)) });
  report(true);
}
// (the bot's own account runs a Companion too: it's never hypnotized and never tells the farm about itself)
const isBot = () => !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
function event(e) { try { if (!isBot() && ctx.botHere()) ctx.toBot("hypnoEvent", e); } catch (er) { /* fine */ } }

// ── what the farm knows about your LSCG ─────────────────────
export function tranceStatus() {
  const h = H(), scopes = ["hypno", "states"].filter(granted);
  return { lscg: !!LA, ver: LA && W.LSCG ? String(W.LSCG.version || "") : "", on: lscgHypnoOn(), sugg: !!(h && h.allowSuggestions), needHyp: !h || h.suggestionRequireHypnotizer !== false,
    mins: h ? Number(h.triggerTime) || 0 : 0, beats: !!(h && h.enableBinaural), scopes, under: !!(T.session || hypnotized()),
    ours: !!(T.session && T.session.via === "lscg" && T.session.ours && !T.session.ended && hypnotized()), farmBeats: !!(ctx && ctx.prefs().farmBeats),
    planted: h && Array.isArray(h.suggestions) ? h.suggestions.filter((s) => s && typeof s.id === "string" && s.id.indexOf(SUGG_PREFIX) === 0).map((s) => s.id) : [] };
}
export function tranceHello() { T.lastReport = ""; report(true); }
function report(force) {
  if (!ctx || isBot() || !ctx.botHere()) return;
  const s = tranceStatus(), k = JSON.stringify(s);
  if (!force && k === T.lastReport) return;
  T.lastReport = k;
  ctx.toBot("hypnoState", s);
}
// what to do in LSCG for the farm's trance, in plain words (the settings page)
export function lscgTodo() {
  const s = tranceStatus();
  if (!s.lscg) return { ok: false, text: "No LSCG here, so the farm's own trance: the look on your screen, the farm's beats if you switch them on, and the farm's triggers kept and carried out by this Companion." };
  if (!s.on) return { ok: false, text: "LSCG's hypnosis is off, so the farm's own trance. Switch it on in LSCG's settings and the farm uses LSCG's instead." };
  const need = [];
  if (!s.scopes.includes("hypno") || !s.scopes.includes("states")) need.push("LSCG settings → Extensions → B&B Farm: allow Hypnosis and States");
  if (!s.sugg) need.push("LSCG settings → Hypnosis: tick Allow suggestions, so the farm's triggers can go in");
  if (!s.beats) need.push("(only if you want them) LSCG settings → Hypnosis: binaural beats, and wear headphones");
  return { ok: need.length <= (s.beats ? 0 : 1), text: need.length ? need.join(" · ") : "Ready: you go under LSCG's own trance in the farm's name, with its beats." };
}

// ── beats ────────────────────────────────────────────────────
// LSCG's own when the session's under LSCG; the farm's own (here) only without LSCG's hypnosis, and only if switched on
function lscgBeats() { try { return T.session && T.session.via === "lscg" && granted("hypno") ? LA.operations.hypno.binaural : null; } catch (e) { return null; } }
function beats(b, vol) {
  const B = lscgBeats();
  if (B) {
    try {
      if (b.off) { glideStop(); B.stop({ fadeSeconds: 3 }); return; }
      const st = B.getState();
      if (!st.enabled) return;   // their choice, in LSCG
      if (vol != null) B.setVolume(Math.max(0, Math.min(1, Number(vol) / 100)));
      if (!st.playing) B.play({ fadeSeconds: 10 });
      glideTo(b.from != null ? b.from : st.beatHz || null, b.to, b.over, (hz) => B.setBeat(hz));
    } catch (e) { console.warn("[Farmhand Companion] LSCG beats:", e); }
    return;
  }
  if (lscgHypnoOn() || !ctx.prefs().farmBeats) return;   // LSCG's hypnosis is theirs to set up; the farm's beats only if they asked
  if (b.off) { glideStop(); farmBeatsStop(3); return; }
  farmBeatsStart(b.from != null ? b.from : FB.hz, vol);
  glideTo(b.from, b.to, b.over, farmBeatsSet);
}
function beatsVolume(vol) {
  const B = lscgBeats();
  if (B) { try { B.setVolume(Math.max(0, Math.min(1, Number(vol) / 100))); } catch (e) { /* fine */ } return; }
  if (FB.ac && FB.g) FB.g.gain.setTargetAtTime(farmVol(vol), FB.ac.currentTime, 1);
}
// slide the beat from one rate to another over a while, a step every 3 seconds
function glideStop() { if (T.glide) clearInterval(T.glide); T.glide = null; }
function glideTo(from, to, over, set) {
  glideStop();
  const ok = (x) => typeof x === "number" && x >= 1 && x <= 30;
  if (ok(from)) set(from);
  if (!ok(to)) return;
  if (!over || !ok(from)) { setTimeout(() => set(to), 100); return; }
  const t0 = Date.now(), ms = Math.max(1, over) * 1000;
  T.glide = setInterval(() => {
    const k = Math.min(1, (Date.now() - t0) / ms);
    set(Math.round((from + (to - from) * k) * 10) / 10);
    if (k >= 1) glideStop();
  }, 3000);
}
// the farm's own binaural beat: a tone in each ear a few hertz apart (headphones), never loud
const FB = { ac: null, l: null, r: null, g: null, carrier: 200, hz: 8 };
function farmVol(v) {
  const p = Number(ctx.prefs().farmBeatsVol), pct = p > 0 ? Math.min(100, p) : 15;
  const a = W.Player && W.Player.AudioSettings, bc = a && Number.isFinite(Number(a.Volume)) ? Math.max(0, Math.min(1, Number(a.Volume))) : 1;
  return 0.3 * (pct / 100) * bc * (v == null ? 1 : Math.max(0, Math.min(1, Number(v) / 100)));
}
function farmBeatsStart(hz, vol) {
  if (FB.ac) { if (vol != null) FB.g.gain.setTargetAtTime(farmVol(vol), FB.ac.currentTime, 1); return; }
  const AC = W.AudioContext || W.webkitAudioContext;
  if (!AC) return;
  try {
    const ac = new AC(), l = ac.createOscillator(), r = ac.createOscillator(), m = ac.createChannelMerger(2), g = ac.createGain();
    hz = Math.max(1, Math.min(30, Number(hz) || 8));
    l.frequency.value = FB.carrier - hz / 2; r.frequency.value = FB.carrier + hz / 2;
    l.connect(m, 0, 0); r.connect(m, 0, 1); m.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(farmVol(vol), ac.currentTime + 10);
    l.start(); r.start();
    Object.assign(FB, { ac, l, r, g, hz });
    if (ac.state === "suspended" && ac.resume) ac.resume().catch(() => {});
  } catch (e) { console.warn("[Farmhand Companion] farm beats:", e); }
}
function farmBeatsSet(hz) {
  if (!FB.ac) return;
  FB.hz = hz; const t = FB.ac.currentTime;
  FB.l.frequency.setTargetAtTime(FB.carrier - hz / 2, t, 0.8); FB.r.frequency.setTargetAtTime(FB.carrier + hz / 2, t, 0.8);
}
function farmBeatsStop(fade) {
  if (!FB.ac) return;
  const { ac, g, l, r } = FB; FB.ac = null;
  try {
    g.gain.cancelScheduledValues(ac.currentTime); g.gain.setValueAtTime(g.gain.value, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + (fade || 1));
    setTimeout(() => { try { l.stop(); r.stop(); ac.close(); } catch (e) { /* gone */ } }, ((fade || 1) + 0.3) * 1000);
  } catch (e) { /* gone */ }
}

// ── the look ─────────────────────────────────────────────────
const lookOn = () => !ctx.prefs().noTrance;
const calm = () => !!ctx.prefs().calmLook;
function look(l, reset) { T.look = Object.assign(reset ? {} : T.look, l || {}); drawLook(); }
const lscgSpiral = () => !!(T.session && T.session.via === "lscg" && T.session.ours && hypnotized() && H() && H().enableSpiralOverlay !== false);
function root() {
  const d = W.document; if (!d || !d.body) return null;
  let el = d.getElementById("fhc-hyp");
  if (el) return el;
  if (!d.getElementById("fhc-hyp-css")) {
    const s = d.createElement("style"); s.id = "fhc-hyp-css";
    s.textContent = "#fhc-hyp{position:fixed;inset:0;pointer-events:none;z-index:9997;overflow:hidden}" +
      "#fhc-hyp>div{position:absolute;transition:opacity 4s}" +
      "#fhc-hyp .haze{inset:0;animation:fhcBreathe 8s ease-in-out infinite}" +
      "#fhc-hyp.calm .haze{animation:none}" +
      "#fhc-hyp .spiral{left:50%;top:50%;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;opacity:0;animation:fhcSpin 70s linear infinite;" +
      "-webkit-mask-image:radial-gradient(circle,rgba(0,0,0,.9) 0%,rgba(0,0,0,0) 38%);mask-image:radial-gradient(circle,rgba(0,0,0,.9) 0%,rgba(0,0,0,0) 38%)}" +
      "#fhc-hyp .spiral.on{animation-duration:35s}#fhc-hyp.calm .spiral{animation:none}" +
      "#fhc-hyp .ring{left:50%;top:50%;width:30vmin;height:30vmin;margin:-15vmin 0 0 -15vmin;border-radius:50%;border:2px solid rgba(205,160,235,.35);opacity:0;animation:fhcRing 9s ease-out infinite}" +
      "#fhc-hyp .word{left:0;top:72%;max-width:42vw;font:italic 1.15rem Georgia,serif;color:rgba(232,200,250,.8);text-shadow:0 0 6px rgba(120,40,160,.8);opacity:0;animation:fhcDrift 16s linear forwards}" +
      "#fhc-hyp .glow{inset:0;opacity:0;background:radial-gradient(ellipse at center,rgba(255,225,245,.55),rgba(240,150,210,.25) 55%,transparent 80%);animation:fhcGlow 3.4s ease-out forwards}" +
      "@keyframes fhcBreathe{0%,100%{opacity:.85}50%{opacity:1}}@keyframes fhcSpin{to{transform:rotate(360deg)}}" +
      "@keyframes fhcRing{0%{transform:scale(.4);opacity:0}30%{opacity:.35}100%{transform:scale(3.4);opacity:0}}" +
      "@keyframes fhcDrift{0%{transform:translateY(0);opacity:0}15%{opacity:.85}80%{opacity:.6}100%{transform:translateY(-48vh);opacity:0}}" +
      "@keyframes fhcGlow{0%{opacity:0}25%{opacity:1}100%{opacity:0}}" +
      "@keyframes fhcShudder{0%,100%{transform:translate(0,0)}20%{transform:translate(-2px,1px)}40%{transform:translate(2px,-1px)}60%{transform:translate(-1px,2px)}80%{transform:translate(1px,-1px)}}";
    d.head.appendChild(s);
  }
  el = d.createElement("div"); el.id = "fhc-hyp";
  const haze = d.createElement("div"); haze.className = "haze"; el.appendChild(haze);
  const sp = d.createElement("div"); sp.className = "spiral"; sp.style.background = "center/contain no-repeat url(\"" + spiralSvg() + "\")"; el.appendChild(sp);
  for (let i = 0; i < 3; i++) { const r = d.createElement("div"); r.className = "ring"; r.style.animationDelay = i * 3 + "s"; r.style.display = "none"; el.appendChild(r); }
  d.body.appendChild(el);
  return el;
}
// a two-armed spiral, drawn once
let SPIRAL = "";
function spiralSvg() {
  if (SPIRAL) return SPIRAL;
  const pts = (k) => { const out = []; for (let t = 0.2; t < 14 * Math.PI; t += 0.12) { const r = 16 * t; out.push((500 + r * Math.cos(t + k)).toFixed(1) + "," + (500 + r * Math.sin(t + k)).toFixed(1)); } return out.join(" "); };
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'><g fill='none' stroke='rgb(185,120,225)' stroke-width='26' stroke-linecap='round'>" +
    "<polyline points='" + pts(0) + "'/><polyline points='" + pts(Math.PI) + "' stroke='rgb(240,170,215)'/></g></svg>";
  SPIRAL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  return SPIRAL;
}
function drawLook() {
  if (!lookOn() || (!T.session && !lingering())) { clearLook(); return; }
  const el = root(); if (!el) return;
  const L = T.look, haze = Math.max(0, Math.min(100, (Number(L.haze) || 0) + T.depth / 5));
  el.classList.toggle("calm", calm());
  const hz = el.querySelector(".haze");
  hz.style.background = "radial-gradient(ellipse at center, transparent " + Math.max(18, 62 - haze * 0.4) + "%, rgba(88,28,118," + (haze / 100 * 0.78).toFixed(3) + ") 100%)";
  hz.style.opacity = haze ? "1" : "0";
  const sp = el.querySelector(".spiral"), wantSpiral = L.spiral && L.spiral !== "off" && !lscgSpiral();
  sp.classList.toggle("on", L.spiral === "on");
  sp.style.opacity = wantSpiral ? (calm() ? "0.07" : "0.13") : "0";
  for (const r of el.querySelectorAll(".ring")) r.style.display = L.rings && !calm() ? "" : "none";
  names(!!L.names);
}
function names(on) {
  const d = W.document; let s = d.getElementById("fhc-hyp-names");
  if (!on) { if (s) s.remove(); return; }
  if (s) return;
  s = d.createElement("style"); s.id = "fhc-hyp-names";
  s.textContent = ".ChatMessageName{filter:blur(3px)}";
  d.head.appendChild(s);
}
function clearLook() {
  const d = W.document; if (!d || !d.getElementById) return;
  const el = d.getElementById("fhc-hyp");
  if (el) { for (const x of el.children) x.style.opacity = "0"; setTimeout(() => { if (el.parentNode && ((!T.session && !lingering()) || !lookOn())) el.remove(); }, 4200); }
  names(false);
  T.look = {};
}
// a line in the farm's voice drifts up the screen, when the look says so
export function tranceVoice(text) {
  try {
    if (!lookOn() || !T.look.words || (!T.session && !lingering())) return;
    const el = root(); if (!el) return;
    if (el.querySelectorAll(".word").length >= 3) return;
    const w = W.document.createElement("div"); w.className = "word";
    w.textContent = String(text || "").replace(/^\[Voice\]\s*/, "").slice(0, 140);
    w.style.left = (12 + Math.random() * 46) + "%";
    el.appendChild(w);
    setTimeout(() => w.remove(), 16500);
  } catch (e) { /* fine */ }
}
function glow() {
  if (!lookOn() || (!T.session && !lingering())) return;
  const el = root(); if (!el) return;
  const g = W.document.createElement("div"); g.className = "glow"; el.appendChild(g);
  setTimeout(() => g.remove(), 3600);
  if (!calm()) { const c = W.document.getElementById("MainCanvas"); if (c && c.animate) c.animate([{ transform: "translate(0,0)" }, { transform: "translate(-2px,1px)" }, { transform: "translate(2px,-1px)" }, { transform: "translate(-1px,2px)" }, { transform: "translate(0,0)" }], { duration: 1200, easing: "ease-in-out" }); }
}

// ── the game: cummin', and speech while a phrase holds you ──
function hookGame() {
  const mod = ctx.mod; if (!mod) return;
  try {
    mod.hookFunction("ActivityOrgasmStart", 50, (args, next) => {
      try {
        const C = args[0];
        if (C && typeof C.IsPlayer === "function" && C.IsPlayer()) {
          if (T.denyUntil > Date.now()) { W.ActivityOrgasmRuined = true; if (ctx) ctx.toChat("🌀 Right at the edge… and it won't let you.", "#a67fd4", true); }
          else glow();
        }
      } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] trance: can't watch cummin':", e); }
  try {
    mod.hookFunction("ServerSend", 10, (args, next) => {
      try {
        const d = args[1];
        if (T.phrase && args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && !/^\s*[(\[?!./\-*]/.test(d.Content)) {
          if (d.Content.trim().toLowerCase().replace(/[.!~]+$/, "") === T.phrase.toLowerCase().replace(/[.!~]+$/, "")) T.phrase = null;
          else {
            ctx.toChat("🌀 Nothin' will come out but: " + T.phrase, "#a67fd4", true);
            return next(["ChatRoomChat", { Type: "Emote", Content: "*" + myName() + " opens their mouth, but nothin' comes out." }]);
          }
        }
      } catch (e) { /* say it plain, then */ }
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] trance: can't hold a phrase:", e); }
}
const myName = () => { const P = W.Player || {}; return String(P.Nickname || P.Name || "Someone"); };
function emote(text) {
  try {
    const blocked = typeof W.ChatRoomOwnerPresenceRule === "function" && W.ChatRoomOwnerPresenceRule("BlockEmote", null);
    if (blocked || typeof W.ServerSend !== "function") return;
    W.ServerSend("ChatRoomChat", { Type: "Emote", Content: "*" + text });
  } catch (e) { /* fine */ }
}

// ── the farm's own triggers (no LSCG) ───────────────────────
function loadFarm() {
  try { const v = JSON.parse(LS.getItem(FARM_KEY)); T.farm = Array.isArray(v && v.list) ? v.list.filter(okSugg) : []; T.pull = (v && typeof v.pull === "object" && v.pull) || {}; }
  catch (e) { T.farm = []; T.pull = {}; }
}
function saveFarm() { try { LS.setItem(FARM_KEY, JSON.stringify({ list: T.farm, pull: T.pull })); } catch (e) { /* fine */ } }
function okSugg(s) {
  return !!(s && typeof s.id === "string" && s.id.indexOf(SUGG_PREFIX) === 0 && typeof s.trigger === "string" && s.trigger.trim().length >= 4 &&
    Array.isArray(s.instructions) && s.instructions.length >= 1 && s.instructions.length <= 3 && s.instructions.every((i) => i && INSTR.includes(i.type)));
}
function setFarm(list) {
  T.farm = (Array.isArray(list) ? list : []).filter(okSugg).slice(0, 100).map((s) => ({ id: s.id.slice(0, 60), name: String(s.name || "").slice(0, 80), trigger: s.trigger.trim().slice(0, 80),
    instructions: s.instructions.map((i) => ({ type: i.type, arguments: i.arguments && typeof i.arguments === "object" ? JSON.parse(JSON.stringify(i.arguments)) : {}, delay: Number(i.delay) || 0 })) }));
  for (const id of Object.keys(T.pull)) if (!T.farm.some((s) => s.id === id)) delete T.pull[id];
  saveFarm();
}
export const farmSuggestions = () => T.farm.slice();
function hookChat() {
  if (typeof W.ChatRoomRegisterMessageHandler !== "function") { setTimeout(hookChat, 3000); return; }
  try {
    W.ChatRoomRegisterMessageHandler({ Priority: 230, Description: "B&B Farm trance triggers", Callback: (data, sender) => { try { heard(data, sender); } catch (e) { /* fine */ } return false; } });
  } catch (e) { console.warn("[Farmhand Companion] trance triggers can't listen:", e); }
}
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const phraseIn = (text, phrase) => new RegExp("(\\b|^|\\s|[^\\w\\s])" + esc(phrase) + "(\\b|$|\\s|[^\\w\\s])", "i").test(text);
export function heard(data, sender) {
  if (!T.farm.length || lscgHypnoOn() || T.pending) return;
  if (!data || (data.Type !== "Chat" && data.Type !== "Whisper")) return;
  const P = W.Player;
  if (!P || !sender || sender.MemberNumber === P.MemberNumber) return;
  const text = String(data.Content || "");
  if (!text || /^\s*\(/.test(text)) return;   // out of character never sets anything off
  if (typeof W.ServerChatRoomGetAllowItem === "function" && !W.ServerChatRoomGetAllowItem(sender, P)) return;   // somebody who may touch you, as LSCG asks
  if (typeof W.ChatRoomMapViewIsActive === "function" && W.ChatRoomMapViewIsActive() && sender.MapData && typeof W.ChatRoomMapViewCharacterIsHearable === "function" && !W.ChatRoomMapViewCharacterIsHearable(sender)) return;
  const s = T.farm.find((x) => phraseIn(text, x.trigger));
  if (!s) return;
  const i = text.toLowerCase().indexOf(s.trigger.toLowerCase());
  askIt(s, sender, i >= 0 ? text.slice(i + s.trigger.length).replace(/^[\s,.:;!?-]+/, "").trim() : "");
}
// like LSCG's: their words pull at you; give in, or fight it (the harder it's pulled before, the harder to fight)
function askIt(s, sender, after) {
  const by = Number(sender.MemberNumber), byName = String(sender.Nickname || sender.Name || "Someone");
  const id = "fhc-sg-" + Date.now();
  T.pending = { s, by, byName, after, id, timer: setTimeout(() => answer(false), 30000) };
  try { if (typeof W.AudioPlaySoundEffect === "function" && !(typeof W.AudioShouldSilenceSound === "function" && W.AudioShouldSilenceSound(true))) W.AudioPlaySoundEffect("BellMedium"); } catch (e) { /* fine */ }
  const d = W.document, box = d.createElement("div");
  box.className = "ChatMessage ChatMessageChat fhc-sg-ask"; box.id = id;
  box.style.cssText = "color:#a67fd4;font-style:italic;margin:0.25em 0";
  const t = d.createElement("span"); t.textContent = "🌀 " + byName + "'s words reach right down into you… ";
  const yes = d.createElement("button"), no = d.createElement("button");
  yes.textContent = "Give in"; no.textContent = "Fight it";
  for (const [b, c] of [[yes, "#9be39b"], [no, "#e88"]]) b.style.cssText = "cursor:pointer;margin-left:5px;font-size:inherit;color:#3a1a35;background:" + c + ";border:0;border-radius:4px;padding:0 6px";
  yes.addEventListener("click", () => answer(false)); no.addEventListener("click", () => answer(true));
  box.appendChild(t); box.appendChild(yes); box.appendChild(no);
  if (typeof W.ChatRoomAppendChat === "function") W.ChatRoomAppendChat(box);
  else if (ctx) ctx.toChat("🌀 " + byName + "'s words reach right down into you… (it takes hold in 30 seconds)", "#a67fd4", true);
}
export function answer(fight) {
  const p = T.pending; if (!p) return;
  T.pending = null; clearTimeout(p.timer);
  try { const el = W.document.getElementById(p.id); if (el) el.querySelectorAll("button").forEach((b) => b.remove()); } catch (e) { /* fine */ }
  const pull = T.pull[p.s.id] == null ? 30 : T.pull[p.s.id];
  let resisted = false;
  if (fight) {
    const roll = Math.floor(Math.random() * 100);
    resisted = roll >= pull;
    ctx.toChat(resisted ? "🌀 You shake " + p.byName + "'s words off. [" + roll + "/" + pull + "]" : "🌀 You fight it, but it's in too deep. [" + roll + "/" + pull + "]", "#a67fd4", true);
  }
  T.pull[p.s.id] = Math.max(5, Math.min(95, pull + (resisted ? -3 : 4)));
  saveFarm();
  event({ ev: "fired", id: p.s.id, name: p.s.name, resisted });
  if (!resisted) perform(p);
}
function perform(p) {
  let wait = 0;
  p.s.instructions.forEach((ins, i) => {
    if (i > 0) wait += Math.max(1000, Math.min(30000, Number(ins.delay) || 1000));
    setTimeout(() => { try { doOne(ins, p); } catch (e) { console.warn("[Farmhand Companion] trigger:", e); } }, wait);
  });
}
const charOf = (mn) => (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || null;
function doOne(ins, p) {
  const P = W.Player, a = ins.arguments || {}, me = myName();
  switch (ins.type) {
    case "Orgasm":
      if (T.denyUntil > Date.now()) { ctx.toChat("🌀 It rushes right up to the edge… and the denial holds.", "#a67fd4", true); break; }
      if (P.ArousalSettings) { P.ArousalSettings.Progress = 100; P.ArousalSettings.OrgasmTimer = (Number(W.CurrentTime) || Date.now()) - 1; }
      if (typeof W.ActivityOrgasmPrepare === "function") W.ActivityOrgasmPrepare(P);
      emote(me + " gasps as it all rushes over them at once.");
      break;
    case "Denial": T.denyUntil = Date.now() + 30 * 60000; emote(me + "'s blank stare hides how close they're bein' kept."); break;
    case "Insatiable": T.needyUntil = Date.now() + 30 * 60000; T.needyAt = 0; if (ctx.arouse) ctx.arouse(15, 90); emote(me + " flushes, breathin' quick and needy."); break;
    case "Assume Pose": pose(a.selection); break;
    case "Strip": strip(a.selection); break;
    case "Speak Phrase": {
      const words = String(a.config || p.after || "").replace(/[()]/g, "").trim().slice(0, 200);
      if (!words || /^[*!/.]/.test(words)) { ctx.toChat("🌀 The words never quite come to you, so that part slides off.", "#a67fd4", true); break; }
      T.phrase = words; ctx.toChat("🌀 You want nothin' else but to say: " + words, "#a67fd4", true); emote(me + "'s mouth starts movin' on its own.");
      break;
    }
    case "Follow": {
      const c = charOf(p.by);
      if (c && c.MapData && c.MapData.Pos && ctx.lead) { ctx.lead({ X: c.MapData.Pos.X, Y: c.MapData.Pos.Y, id: 0, why: "after " + p.byName }); emote(me + "'s eyes start followin' " + p.byName + " everywhere."); }
      else ctx.toChat("🌀 You can't find " + p.byName + " to follow, so it slides off you.", "#a67fd4", true);
      break;
    }
    case "Perform Activity": activity(a, p); break;
    case "Forget": {
      const sel = a.selection || { all: true }, has = (x) => sel.all || (sel.instructions || []).includes(x);
      if (has("Denial")) T.denyUntil = 0; if (has("Insatiable")) T.needyUntil = 0; if (has("Speak Phrase")) T.phrase = null;
      emote(me + " blinks, a little lighter, somethin' let go of.");
      break;
    }
  }
}
function pose(sel) {
  const P = W.Player;
  if (!sel || typeof W.PoseSetActive !== "function") return;
  const can = (c) => typeof W.PoseCategoryAvailable !== "function" || W.PoseCategoryAvailable(P, c);
  let blocked = false;
  if (sel.full) { if (can("BodyFull")) W.PoseSetActive(P, sel.full); else blocked = true; }
  else {
    if (sel.lower) { if (can("BodyLower")) W.PoseSetActive(P, sel.lower); else blocked = true; }
    if (sel.upper) { if (can("BodyUpper")) W.PoseSetActive(P, sel.upper); else blocked = true; }
  }
  if (blocked) { ctx.toChat("🌀 Your bonds won't let you all the way into it, so that part slides off you.", "#a67fd4", true); return; }
  try { W.ServerSend("ChatRoomCharacterPoseUpdate", { Pose: P.ActivePose }); if (typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(P); } catch (e) { /* fine */ }
  emote(myName() + " sinks into it without a thought.");
}
function strip(sel) {
  const P = W.Player;
  if (!sel || typeof W.InventoryRemove !== "function" || typeof W.InventoryGet !== "function") return;
  if (typeof P.CanChangeOwnClothes === "function" && !P.CanChangeOwnClothes()) { ctx.toChat("🌀 Your hands can't get at your clothes, so that part slides off you.", "#a67fd4", true); return; }
  const cloth = (W.AssetGroup || []).filter((g) => g && g.Family === P.AssetFamily && g.Category === "Appearance" && g.AllowCustomize && g.Clothing).map((g) => g.Name);
  const worn = (g) => { const it = W.InventoryGet(P, g); return it && !(it.Property && it.Property.LockedBy); };
  let groups = sel.all ? cloth : sel.random ? (() => { const w = cloth.filter(worn); return w.length ? [w[Math.floor(Math.random() * w.length)]] : []; })() : (sel.groups || []).filter((g) => cloth.includes(g));
  groups = groups.filter(worn);
  if (!groups.length) { ctx.toChat("🌀 Nothin' left there to take off.", "#a67fd4", true); return; }
  for (const g of groups) W.InventoryRemove(P, g, false);
  try { if (typeof W.ChatRoomCharacterUpdate === "function") W.ChatRoomCharacterUpdate(P); } catch (e) { /* fine */ }
  emote(myName() + " starts takin' their clothes off without a word.");
}
function activity(a, p) {
  const P = W.Player, sel = a.selection || {};
  let target = a.self ? P : a.speakerOnly ? charOf(p.by) : null;
  if (!target && p.after) { const w = p.after.toLowerCase(); target = (W.ChatRoomCharacter || []).find((c) => c && c !== P && [c.Nickname, c.Name].some((n) => n && w.startsWith(String(n).toLowerCase()))) || null; }
  if (!target) target = charOf(p.by);
  const group = (W.AssetGroup || []).find((g) => g && g.Name === sel.group);
  const fail = (why) => ctx.toChat("🌀 Somethin' stops you (" + why + "), so that part slides off you.", "#a67fd4", true);
  if (!target || !group || typeof W.ActivityAllowedForGroup !== "function" || typeof W.ActivityRun !== "function") return fail(!target ? "nobody to do it to" : "the game can't do that one");
  if (typeof W.ServerChatRoomGetAllowItem === "function" && !W.ServerChatRoomGetAllowItem(P, target)) return fail("you may not touch them");
  const it = (W.ActivityAllowedForGroup(target, group.Name) || []).find((x) => x && !x.Blocked && x.Activity && x.Activity.Name === sel.name);
  if (!it) return fail("not somethin' that can be done there right now");
  W.ActivityRun(P, target, group, { Activity: it.Activity, Group: group.Name, Item: it.Item }, true);
}

// ── every few seconds ───────────────────────────────────────
function tick() {
  try {
    const now = Date.now(), s = T.session;
    // LSCG's trance kept up for the session (its own trance time would end it); never put back once they've come up
    if (s && s.via === "lscg" && s.ours && !s.ended && !s.keepOff && now < s.until && now - T.keptAt > 30000) {
      if (hypnotized()) { const h = hypState(); if (h) { try { h.activate(s.by, s.until - now); } catch (e) { /* fine */ } } T.keptAt = now; }
    }
    if (s && now > s.until + 60000) { T.session = null; glideStop(); farmBeatsStop(3); drawLook(); }   // the farm never said: it's over
    if (s && s.keepOff && !lingering()) { T.session = null; glideStop(); farmBeatsStop(3); clearLook(); }
    if (!s && T.lingerUntil && now > T.lingerUntil) { T.lingerUntil = 0; glideStop(); farmBeatsStop(3); clearLook(); }
    if (T.needyUntil > now && now - T.needyAt > 30000 && ctx.arouse) { T.needyAt = now; ctx.arouse(6, 92); }
    report(false);
  } catch (e) { /* next time */ }
}
export const tranceTick = tick;   // (tests)
