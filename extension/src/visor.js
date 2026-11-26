/* WHAT'S IN THIS FILE (visor.js)
   THE FARM'S VISOR (Nov 25; Laynie: "For the hypnotic visor items in bc and echoes, what if we built on a subliminal set
   of effects… renders nothing else map wise, in combination with our session and binaurals beats? with a onscreen
   button to turn the visor off… for hardcore mode players, is locked until a set number of sessions is finished";
   "pictures and gifs being links, as long as it points at the pictures address"; "once a visor is built, its settings
   should be locked in unless the crafter changes them"; "The button needs to be a small icon").
   • WEARIN' ONE: any item you wear whose crafted description says "farm visor: #code" (BC's visors, Echoes', anything).
     The room goes dark: no map, nobody else, just one body (the crafter's, or your own, as they picked), the crafter's
     pictures see-through underneath, subliminal words fadin' in and out, and the farm's trance on top (LSCG's own in the
     farm's name if you let the farm in, its beats if you turned them on). Sessions from the farm's public list play one
     after another while it's on. The chat stays. A small icon in the corner takes it off.
   • HARDCORE (the Dispensary's): the icon stays locked till the visor's number of full sessions are done. The crafter or
     your keyholders can open it early (/visor unlock <name> in their Companion). Your safeword always ends it.
   • ON THE FARM, a finished session counts toward your conditioning tiers and feeds the farm's pull.
   • THE VISOR MAKER (Settings › 🌀 Visor maker): pick sessions from the farm's list, how many before a hardcore wearer
     can take it off, whose body, the words, the pictures, how strong. It gives you a line for the item's description.
     The code in it is a fingerprint of those settings (shared/visor.js), so the visor stays as you built it.
   • Words never strobe: one at most every 2 seconds, under a second each, never bright. "Calm trance look": they drift.
*/
import { LS, onAccount } from "./acct.js";
import { BOT_MEMBER } from "./config.js";
import { makeMsg } from "../../shared/protocol.js";
import { parseLibrary, planSession, sessionSteps, fillIn, LEVELS } from "../../shared/trance-script.js";
import { STARTER } from "../../shared/trance-starter.js";
import { normTuning, tuningCode, codeOk, codeIn, descLine, okLink, PUBLIC_BASE, VISOR_KINDS, MAX_SESSIONS } from "../../shared/visor.js";
import { onHypno, tranceVoice, tranceState, onTranceEnd } from "./trance.js";
import { h, card, title, muted, btn } from "./dom.js";

const W = window;
const CACHE_KEY = "fhc-visor-tunings", DONE_KEY = "fhc-visor-done", MAKER_KEY = "fhc-visor-maker";
let ctx = null;   // { toBot, toChat, prefs(), botHere(), mod }
const V = { lib: null, sets: {}, listAt: 0, listFrom: "", cache: {}, done: {}, on: null, off: {}, unlocked: {}, asked: {}, run: null, el: null, timers: [], wordT: null, picT: null, drawT: null };

export function initVisor(c) {
  ctx = c;
  load();
  onAccount(() => { stop(true); V.off = {}; V.unlocked = {}; load(); });
  onTranceEnd(() => { if (V.on) { V.off[V.on.code] = true; stop(false, "🌀 The visor lets go of you."); } });   // the safeword (the farm's, or LSCG's)
  // the game's own safeword ends it too, always
  const mod = ctx.mod;
  if (mod) for (const f of ["ChatRoomSafewordRevert", "ChatRoomSafewordRelease"]) {
    try { mod.hookFunction(f, 20, (args, next) => { try { if (V.on) { V.off[V.on.code] = true; stop(false, "🌀 Your safeword: the visor lets go of you."); } } catch (e) { /* fine */ } return next(args); }); } catch (e) { /* an older game */ }
  }
  if (typeof W.CommandCombine === "function") {
    try { W.CommandCombine([{ Tag: "visor", Description: "unlock <name>: open a hardcore wearer's farm visor early (you crafted it, or you hold their key)", Action: (args) => command(String(args || "")) }]); } catch (e) { /* fine */ }
  }
  setInterval(check, 2000);
  setTimeout(publicList, 4000);
}

// ── what's kept on this computer ─────────────────────────────
function load() {
  try { const c = JSON.parse(LS.getItem(CACHE_KEY)); V.cache = c && typeof c === "object" ? c : {}; } catch (e) { V.cache = {}; }
  for (const [code, t] of Object.entries(V.cache)) if (!codeOk(code, t)) delete V.cache[code];   // (only ever ones that match their code)
  try { const d = JSON.parse(LS.getItem(DONE_KEY)); V.done = d && typeof d === "object" ? d : {}; } catch (e) { V.done = {}; }
}
function keepCache() { const k = Object.keys(V.cache); for (const x of k.slice(0, Math.max(0, k.length - 50))) delete V.cache[x]; try { LS.setItem(CACHE_KEY, JSON.stringify(V.cache)); } catch (e) { /* fine */ } }
function keepDone() { try { LS.setItem(DONE_KEY, JSON.stringify(V.done)); } catch (e) { /* fine */ } }
function remember(code, t) { if (!codeOk(code, t)) return false; V.cache[code] = normTuning(t); keepCache(); return true; }

// ── the farm's public list (published from the trance studio onto GitHub), the starter library till there is one ──
export async function publicList(force) {
  if (!force && V.lib && Date.now() - V.listAt < 3600000) return V.lib;
  V.listAt = Date.now();
  try {
    if (typeof W.fetch !== "function") throw new Error("no fetch");
    const [t, s] = await Promise.all([W.fetch(PUBLIC_BASE + "library.txt", { cache: "no-store" }), W.fetch(PUBLIC_BASE + "sets.json", { cache: "no-store" })]);
    if (!t.ok) throw new Error("no list yet");
    const lib = parseLibrary(await t.text());
    if (!lib.blocks.some((b) => b.kind === "session" && b.labels.visor && !b.bad)) throw new Error("no visor sessions");
    V.lib = lib; V.listFrom = "the farm's list";
    try { const sets = s.ok ? await s.json() : {}; V.sets = {}; for (const [n, l] of Object.entries(sets || {})) { const g = (Array.isArray(l) ? l : []).filter(okLink); if (g.length) V.sets[String(n).slice(0, 40)] = g.slice(0, 20); } } catch (e) { V.sets = {}; }
  } catch (e) {
    if (!V.lib) { V.lib = parseLibrary(STARTER); V.listFrom = "the starter library"; }
  }
  return V.lib;
}
const library = () => V.lib || (V.lib = parseLibrary(STARTER), V.listFrom = "the starter library", V.lib);
export const visorSessions = () => library().blocks.filter((b) => b.kind === "session" && !b.bad && b.labels.visor).map((b) => ({ name: b.name, level: b.labels.level && b.labels.level.length ? b.labels.level : LEVELS }));

// ── are you wearin' one ──────────────────────────────────────
export function wornVisor() {
  const P = W.Player; if (!P || !Array.isArray(P.Appearance)) return null;
  for (const it of P.Appearance) {
    const c = it && it.Craft, code = c && codeIn(c.Description);
    if (code) return { code, crafter: Number(c.MemberNumber) || 0, item: String(c.Name || (it.Asset && it.Asset.Name) || "visor").slice(0, 40) };
  }
  return null;
}
const isBot = () => !!(W.Player && W.Player.MemberNumber === BOT_MEMBER);
export function check() {
  try {
    if (!ctx || isBot()) return;
    // their own switch: "Farm visors" off and a farm visor's just a visor (somebody else may have put it on them)
    if ((ctx.prefs() || {}).noVisor) { if (V.on) stop(false, "🌀 Farm visors are switched off for you: the room comes back."); return; }
    const w = wornVisor();
    if (!w) {
      if (V.on) stop(false, "🌀 The visor comes off, and the room comes back.");
      for (const k of Object.keys(V.done)) if (V.done[k]) { V.done[k] = 0; keepDone(); }   // (a fresh wearin' starts the count again)
      V.off = {}; V.unlocked = {}; return;
    }
    if (V.off[w.code]) return;                      // taken off (or the safeword) till it's put on again
    if (V.on && V.on.code === w.code) { place(); return; }
    if (V.on) stop(true);
    const t = V.cache[w.code];
    if (t) { start(w, t); return; }
    ask(w.code);
  } catch (e) { console.warn("[Farmhand Companion] visor:", e); }
}
// a tuning nobody here has given us yet: ask the room (any Companion that knows it), and the farm
function ask(code) {
  if (Date.now() - (V.asked[code] || 0) < 20000) return;
  V.asked[code] = Date.now();
  try { if (W.ServerSend && (!W.ServerPlayerIsInChatRoom || W.ServerPlayerIsInChatRoom())) W.ServerSend("ChatRoomChat", makeMsg("visorAsk", { code })); } catch (e) { /* not in a room */ }
  try { if (ctx.botHere()) ctx.toBot("visorAsk", { code }); } catch (e) { /* fine */ }
}
// messages: another Companion (or the farm) handin' over a tuning, askin' for one, or unlockin'
export function onVisorMsg(m) {
  if (!m || !m.from) return;
  const me = W.Player && W.Player.MemberNumber;
  if (m.from === me) return;
  const code = String(m.code || "").toLowerCase();
  if (m.type === "visorTune") { if (remember(code, m.t)) check(); return; }
  if (m.type === "visorAsk") { if (V.cache[code] && !isBot()) setTimeout(() => { try { W.ServerSend("ChatRoomChat", makeMsg("visorTune", { code, t: V.cache[code] }, m.from)); } catch (e) { /* fine */ } }, 300 + Math.random() * 1200); return; }
  if (m.type === "visorUnlock") {
    if (!V.on) return;
    const kh = keyholders(), ok = m.from === V.on.crafter || kh.includes(m.from);
    if (!ok) return;
    V.unlocked[V.on.code] = true; icon();
    ctx.toChat("🔓 " + nameOf(m.from) + " opened your visor: you can take it off now.", "#a67fd4", true);
    try { W.ServerSend("ChatRoomChat", makeMsg("visorUnlocked", { name: nameOf(me) }, m.from)); } catch (e) { /* fine */ }
    return;
  }
  if (m.type === "visorUnlocked") ctx.toChat("🔓 " + String(m.name || "They").slice(0, 40) + "'s visor is open: they can take it off now.", "#a67fd4", true);
}
const charOf = (mn) => (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || null;
const nameOf = (mn) => { const c = charOf(mn); return c ? String(c.Nickname || c.Name || "#" + mn) : "#" + mn; };
function keyholders() { try { const D = W.FarmhandDispensary; return D && typeof D.keyholders === "function" ? D.keyholders().map(Number) : []; } catch (e) { return []; } }
function hardcore() { try { const D = W.FarmhandDispensary, x = D && typeof D.hard === "function" ? D.hard() : null; return !!(x && x.on); } catch (e) { return false; } }
export const visorLocked = () => !!(V.on && hardcore() && (V.done[V.on.code] || 0) < V.on.t.need && !V.unlocked[V.on.code]);
// /visor unlock <name>: the crafter or a keyholder opens a hardcore wearer's visor early
function command(args) {
  const m = /^\s*unlock\s+(.+)$/i.exec(args);
  if (!m) { ctx.toChat("🌀 /visor unlock <name>: open the farm visor on somebody whose key you hold, or one you crafted.", "#a67fd4", true); return; }
  const q = m[1].trim().toLowerCase(), c = (W.ChatRoomCharacter || []).find((x) => x && [x.Nickname, x.Name, String(x.MemberNumber)].some((n) => n && String(n).toLowerCase() === q));
  if (!c) { ctx.toChat("🌀 Nobody here by that name.", "#a67fd4", true); return; }
  try { W.ServerSend("ChatRoomChat", makeMsg("visorUnlock", {}, c.MemberNumber)); } catch (e) { /* fine */ }
  ctx.toChat("🌀 Sent: if you crafted their visor or hold their key, it opens.", "#a67fd4", true);
}

// ── the visor on: the dark, the one body, the pictures, the words, the icon ──
function start(w, t) {
  V.on = { code: w.code, crafter: w.crafter, item: w.item, t: normTuning(t), since: Date.now() };
  build();
  ctx.toChat("🌀 The " + w.item + " settles over your eyes, and the room goes dark around you." + (visorLocked() ? " It won't come off till " + V.on.t.need + " session" + (V.on.t.need === 1 ? "'s" : "s are") + " done." : ""), "#a67fd4", true);
  later(nextSession, 5000);
}
export function stop(quiet, say) {
  const was = V.on;
  for (const x of V.timers) clearTimeout(x); V.timers = [];
  clearInterval(V.wordT); clearInterval(V.picT); clearInterval(V.drawT);
  if (V.run) { V.run = null; try { onHypno({ do: "wake" }); } catch (e) { /* fine */ } }
  if (V.el) { V.el.remove(); V.el = null; }
  V.on = null;
  if (was && !quiet && say) ctx.toChat(say, "#a67fd4", true);
}
const later = (f, ms) => { V.timers.push(setTimeout(() => { try { f(); } catch (e) { console.warn("[Farmhand Companion] visor:", e); } }, ms)); };
function css() {
  const d = W.document; if (d.getElementById("fhc-visor-css")) return;
  const s = d.createElement("style"); s.id = "fhc-visor-css";
  s.textContent = "#fhc-visor{position:fixed;z-index:9995;overflow:hidden;background:radial-gradient(ellipse at 50% 55%,#1b0f26 0%,#0b0610 55%,#050307 100%);pointer-events:auto}" +
    "#fhc-visor>*{position:absolute}" +
    "#fhc-visor .pic{left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity 5s ease-in-out;-webkit-mask-image:radial-gradient(ellipse at center,#000 35%,rgba(0,0,0,.15) 100%);mask-image:radial-gradient(ellipse at center,#000 35%,rgba(0,0,0,.15) 100%)}" +
    "#fhc-visor .body{left:0;top:0;width:100%;height:100%}" +
    "#fhc-visor .sub{font:600 1.7rem Georgia,serif;color:#f6e2ff;letter-spacing:.06em;text-shadow:0 0 12px rgba(200,140,240,.7);opacity:0;white-space:nowrap;pointer-events:none;animation:fhcSub var(--ms,800ms) ease-in-out forwards}" +
    "#fhc-visor.calm .sub{animation:fhcSubCalm 9s linear forwards}" +
    "#fhc-visor .icon{left:10px;bottom:10px;width:30px;height:30px;border-radius:50%;border:1px solid rgba(198,139,230,.55);background:rgba(30,16,40,.75);color:#ecd9f6;font-size:15px;line-height:28px;text-align:center;cursor:pointer;padding:0;opacity:.7}" +
    "#fhc-visor .icon:hover{opacity:1}#fhc-visor .icon.locked{border-color:#7a5b33;cursor:not-allowed}" +
    "@keyframes fhcSub{0%{opacity:0}45%{opacity:var(--op,.45)}100%{opacity:0}}" +
    "@keyframes fhcSubCalm{0%{opacity:0;transform:translateY(0)}20%{opacity:.35}80%{opacity:.25}100%{opacity:0;transform:translateY(-10vh)}}";
  d.head.appendChild(s);
}
function build() {
  const d = W.document; if (!d || !d.body) return;
  css();
  const t = V.on.t, el = d.createElement("div"); el.id = "fhc-visor";
  el.classList.toggle("calm", !!(ctx.prefs() || {}).calmLook);
  el.style.setProperty("--ms", t.wordMs + "ms"); el.style.setProperty("--op", String(t.wordOp));
  for (let i = 0; i < 2; i++) { const p = d.createElement("img"); p.className = "pic"; p.alt = ""; p.style.objectFit = t.fit; p.referrerPolicy = "no-referrer"; el.appendChild(p); }
  const cv = d.createElement("canvas"); cv.className = "body"; el.appendChild(cv);
  const b = d.createElement("button"); b.type = "button"; b.className = "icon"; b.addEventListener("click", iconClick); el.appendChild(b);
  // (the room under it can't be clicked: no walkin' about the map you can't see)
  el.addEventListener("mousedown", (e) => e.stopPropagation()); el.addEventListener("click", (e) => { if (e.target === el || e.target === cv) e.stopPropagation(); });
  d.body.appendChild(el); V.el = el;
  place(); icon();
  // pictures: crossfade, slowly (if none of the crafter's will load, the farm's own patterns instead of nothin')
  let pics = t.pictures.length ? t.pictures.slice() : farmPatterns();
  let i = 0, side = 0, loaded = 0, failed = 0;
  const next = () => { if (!V.el) return; const imgs = V.el.querySelectorAll(".pic"), show = imgs[side], hide = imgs[1 - side];
    show.onload = () => { loaded++; show.style.opacity = String(t.picOp); hide.style.opacity = "0"; };
    show.onerror = () => { show.style.opacity = "0"; if (++failed >= pics.length && !loaded && t.pictures.length) { pics = farmPatterns(); failed = 0; i = 0; } if (!loaded) setTimeout(next, 400); };
    show.src = pics[i++ % pics.length]; side = 1 - side; };
  next(); V.picT = setInterval(() => { if (pics.length > 1) next(); }, t.picEvery * 1000);
  // subliminal words: one at a time, up and gone, never a strobe
  V.wordT = setInterval(() => { if (Math.random() < 0.85) word(); }, Math.max(2, t.wordEvery) * 1000);
  // the one body
  V.drawT = setInterval(drawBody, 150); drawBody();
}
// over the room's half of the game (the chat, and the game's own buttons, stay where they are)
function place() {
  const c = W.document.getElementById("MainCanvas"); if (!c || !V.el) return;
  const r = c.getBoundingClientRect(), w = r.width / 2;
  Object.assign(V.el.style, { left: r.left + "px", top: r.top + "px", width: w + "px", height: r.height + "px" });
  const cv = V.el.querySelector(".body"); if (cv && (cv.width !== Math.round(w) || cv.height !== Math.round(r.height))) { cv.width = Math.round(w) || 500; cv.height = Math.round(r.height) || 1000; }
}
function drawBody() {
  if (!V.el) return;
  const cv = V.el.querySelector(".body"), g = cv && cv.getContext ? cv.getContext("2d") : null; if (!g) return;
  const t = V.on.t, C = (t.show === "crafter" && charOf(V.on.crafter)) || W.Player;
  if (C && !C.Canvas && typeof W.CharacterLoadCanvas === "function") { try { W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } }
  g.clearRect(0, 0, cv.width, cv.height);
  const src = C && C.Canvas; if (!src) return;
  const hh = cv.height * 0.96, ww = hh / 2;
  try { g.drawImage(src, (cv.width - ww) / 2, cv.height - hh, ww, hh); } catch (e) { /* not drawn yet */ }
}
function word() {
  if (!V.el) return;
  const words = V.on.t.words.length ? V.on.t.words : ["good " + animal(), "empty", "deeper", "obey the farm", "so warm", "no thoughts"];
  const w = W.document.createElement("div"); w.className = "sub"; w.textContent = words[Math.floor(Math.random() * words.length)];
  w.style.left = (15 + Math.random() * 45) + "%"; w.style.top = (18 + Math.random() * 55) + "%";
  V.el.appendChild(w); setTimeout(() => w.remove(), V.el.classList.contains("calm") ? 9500 : V.on.t.wordMs + 200);
}
function icon() {
  const b = V.el && V.el.querySelector(".icon"); if (!b) return;
  const lk = visorLocked();
  b.classList.toggle("locked", lk); b.textContent = lk ? "🔒" : "👁";
  b.title = lk ? "Locked: " + (V.done[V.on.code] || 0) + " of " + V.on.t.need + " sessions done. The crafter or your keyholders can open it; your safeword always ends it." : "Take the visor off (the room comes back)";
}
function iconClick(e) {
  e.stopPropagation();
  if (!V.on) return;
  if (visorLocked()) { ctx.toChat("🔒 The visor won't come off yet: " + (V.done[V.on.code] || 0) + " of " + V.on.t.need + " sessions done. Its crafter or your keyholders can open it early; your safeword always ends it.", "#a67fd4", true); return; }
  V.off[V.on.code] = true;
  stop(false, "🌀 You take the visor's hold off. The room comes back (it starts again if you put it back on).");
}
// the farm's own patterns, for a visor with no pictures of its own
function farmPatterns() {
  const pts = (k, c) => { const o = []; for (let t = 0.2; t < 12 * Math.PI; t += 0.1) { const r = 10 * t; o.push((300 + r * Math.cos(t + k)).toFixed(1) + "," + (300 + r * Math.sin(t + k)).toFixed(1)); } return "<polyline points='" + o.join(" ") + "' stroke='" + c + "'/>"; };
  const a = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='#1a0b24'/><g fill='none' stroke-width='14' stroke-linecap='round'>" + pts(0, "#b978e1") + pts(Math.PI, "#f0aad7") + "</g></svg>";
  let rings = ""; for (let r = 20; r < 300; r += 22) rings += "<circle cx='300' cy='300' r='" + r + "' fill='none' stroke='" + (r % 44 ? "#e7a6d8" : "#8f5bc4") + "' stroke-width='9'/>";
  const b = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='#160a1f'/>" + rings + "</svg>";
  return [a, b].map((s) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s));
}

// ── the sessions, one after another while it's on ────────────
const animal = () => (tranceState.me && tranceState.me.animal) || "animal";
function words() {
  const me = tranceState.me || {}, P = W.Player || {}, a = animal();
  return { name: String(P.Nickname || P.Name || "sugar"), animal: a, sound: me.sound || "mmh", body: "body", pet: "good " + a, act: "obey", pose: "still", paws: "paws",
    low: me.low === "fours" ? "on all fours" : "on your knees", herd: "the farm", a, s: me.sound || "mmh", p: "body" };
}
const say = (t) => fillIn(String(t).replace(/^(\{(?:nv|nc|nt|v|c|t|f|m|fu|fb|nb|ok)\})+/, ""), words()).replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
// does a line fit them: the tags on its front against the body the farm last told us about (none known: only untagged lines)
export function fitLine(line, b) {
  const m = /^((?:\{[a-z]{1,2}\})+)/.exec(String(line));
  if (!m) return true;
  if (!b || !b.g) return false;
  for (const t of m[1].slice(1, -1).split("}{")) {
    if ((t === "v" && !b.vulva) || (t === "nv" && b.vulva) || (t === "c" && !b.cock) || (t === "nc" && b.cock) || (t === "t" && !b.tits) || (t === "nt" && b.tits) ||
        (t === "f" && b.g !== "female") || (t === "m" && b.g !== "male") || (t === "fu" && b.g !== "futa") || (t === "fb" && b.g !== "femboy") || (t === "nb" && b.g !== "nonbinary")) return false;
  }
  return true;
}
function nextSession() {
  if (!V.on || V.run) return;
  if (tranceState.session) { later(nextSession, 60000); return; }   // (the farm's runnin' a session on you: the visor waits its turn)
  const lib = library(), blocks = lib.blocks.filter((b) => !b.bad && (VISOR_KINDS.includes(b.kind) || (b.kind === "session" && b.labels.visor)));
  const all = blocks.filter((b) => b.kind === "session").map((b) => b.name), names = V.on.t.sessions.filter((n) => all.some((x) => x.toLowerCase() === n.toLowerCase()));
  const name = (names.length ? names : all)[Math.floor(Math.random() * Math.max(1, (names.length ? names : all).length))];
  const recipe = blocks.find((b) => b.kind === "session" && !!name && b.name.toLowerCase() === name.toLowerCase());
  const level = recipe && recipe.labels.level && recipe.labels.level.length ? recipe.labels.level[0] : "fun";
  const me = tranceState.me || {};
  const plan = planSession(blocks, { level, species: me.species || "", wears: [], tone: me.tone || [] }, { name: recipe ? recipe.name : "" });
  const steps = sessionSteps(plan, { keep: (t) => fitLine(t, me.body) }).filter((s) => VISOR_KINDS.includes(s.kind));
  if (!steps.length) { later(nextSession, 120000); return; }
  const ms = steps.reduce((n, s) => n + (s.gap || 0) * 1000, 0);
  V.run = { steps, i: 0, level, name: recipe ? recipe.name : "", depth: 0 };
  onHypno({ do: "under", by: BOT_MEMBER, ms: Math.round(ms + 300000), level });
  step();
}
function step() {
  const r = V.run; if (!r || !V.on) return;
  const s = r.steps[r.i];
  if (!s) { finish(); return; }
  if (s.start || s.beats || s.look || s.volume != null) onHypno({ do: "cue", kind: s.kind, block: s.block, beats: s.beats || undefined, volume: s.volume, look: Object.assign({ words: true }, s.look || {}) });
  if (s.deeper) { r.depth = Math.max(0, Math.min(100, r.depth + s.deeper)); onHypno({ do: "depth", depth: r.depth }); }
  if (s.text) { const line = say(s.text); ctx.toChat("[Voice] " + line, "#a67fd4", true); tranceVoice(line); }
  r.i++;
  later(step, Math.max(1, s.gap || 0) * 1000);
}
function finish() {
  const r = V.run; V.run = null; if (!V.on || !r) return;
  if (r.level === "nhl") onHypno({ do: "linger", secs: 120 }); else later(() => { if (!V.run) onHypno({ do: "wake" }); }, 4000);
  const code = V.on.code; V.done[code] = (V.done[code] || 0) + 1; keepDone();
  icon();
  const need = V.on.t.need, n = V.done[code];
  ctx.toChat("🌀 Session over" + (r.name ? ": " + r.name : "") + "." + (hardcore() && need ? (n >= need ? " That's " + need + " of " + need + ": the visor can come off now." : " " + n + " of " + need + " before the visor can come off.") : ""), "#a67fd4", true);
  // on the farm: it counts toward your tiers, and feeds the farm's pull
  try { if (ctx.botHere()) ctx.toBot("visorDone", { code, level: r.level, session: r.name }); } catch (e) { /* fine */ }
  later(nextSession, 90000);   // (another, in a while, as long as it's on)
}

// ── the visor maker (Settings › 🌀 Visor maker) ───────────────
function maker() { try { const v = JSON.parse(LS.getItem(MAKER_KEY)); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } }
function keepMaker(m) { try { LS.setItem(MAKER_KEY, JSON.stringify(m)); } catch (e) { /* fine */ } }
export function visorMakerCards(pctx) {
  const M = Object.assign({ sessions: [], need: 1, show: "crafter", words: "", set: "", own: "", picOp: 0.35, wordEvery: 3, wordOp: 0.45, fit: "cover" }, maker());
  const set = (k, v) => { M[k] = v; keepMaker(M); };
  if (!V.lib || Date.now() - V.listAt > 3600000) publicList().then(() => { try { if (pctx.setUi) pctx.setUi({}); } catch (e) { /* fine */ } });
  const list = visorSessions(), sets = Object.keys(V.sets);
  const result = h("div", { class: "fhc-muted" });
  const make = () => {
    const own = String(M.own || "").split(/\s+/).filter(Boolean);
    const pictures = M.set === "__own" ? own.filter(okLink) : M.set && V.sets[M.set] ? V.sets[M.set].slice() : [];
    const skipped = M.set === "__own" ? own.length - pictures.length : 0;
    const t = normTuning({ sessions: M.sessions, need: M.need, show: M.show, words: M.words, set: M.set === "__own" ? "" : M.set, pictures, picOp: M.picOp, wordEvery: M.wordEvery, wordOp: M.wordOp, fit: M.fit });
    const code = tuningCode(t); remember(code, t);
    try { if (ctx.botHere()) ctx.toBot("visorKeep", { code, t }); } catch (e) { /* fine */ }
    const line = descLine(code, t);
    result.textContent = "";
    result.appendChild(h("div", { style: { margin: "6px 0", padding: "6px 8px", border: "1px dashed #8a6aa0", borderRadius: "6px", userSelect: "all", fontFamily: "monospace" } }, line));
    result.appendChild(btn("Copy it", () => { try { W.navigator.clipboard.writeText(line); } catch (e) { /* select it by hand */ } }, true));
    if (M.set === "__own") result.appendChild(h("div", null, pictures.length + " of your links in it" + (skipped ? "; " + skipped + " left out (not a picture's own address: https, and not a web page)" : "") +
      (pictures.length ? "" : ", so it shows the farm's own patterns") + "."));
    if (pictures.some((u) => /encrypted-tbn\d*\.gstatic\.com/i.test(u))) result.appendChild(h("div", null, "(Those are Google's little search thumbnails: they'll look blurry stretched across the screen. Open the picture itself and Copy image address for the full size.)"));
    result.appendChild(h("div", null, "Craft the visor (any visor, or anything worn over the eyes) and put this line in its description. These settings are locked in by that code: change any of them and you get a new line."));
  };
  const opt = (v, label, now) => h("option", { value: String(v), selected: String(v) === String(now) || null }, label);
  return [card(title("🌀 Visor maker"),
    muted("Make a farm visor: a crafted item that takes the room away from whoever wears it, and puts them under. Sessions come from " + (V.listFrom || "the farm's list") + "."),
    h("div", null, muted("Sessions it plays (one at a time, picked fresh):"),
      list.length ? list.map((s) => h("label", { style: { display: "block" } }, h("input", { type: "checkbox", checked: M.sessions.includes(s.name) || null, onchange: (e) => set("sessions", (e.target.checked ? M.sessions.concat(s.name) : M.sessions.filter((x) => x !== s.name)).slice(0, MAX_SESSIONS)) }), " " + s.name + " (" + s.level.join(", ") + ")"))
        : muted("(the farm's list is still loadin')")),
    h("div", null, muted("Before a hardcore wearer can take it off:"), h("select", { onchange: (e) => set("need", Number(e.target.value)) }, [0, 1, 2, 3, 4, 5].map((n) => opt(n, n ? n + " full session" + (n === 1 ? "" : "s") : "any time", M.need)))),
    h("div", null, muted("Whose body they see:"), h("select", { onchange: (e) => set("show", e.target.value) }, opt("crafter", "mine (the crafter's)", M.show), opt("wearer", "their own", M.show))),
    h("div", null, muted("Subliminal words (comma between):"), h("input", { value: M.words, size: 40, placeholder: "good cow, empty, deeper", onchange: (e) => set("words", e.target.value) })),
    h("div", null, muted("Pictures:"), h("select", { onchange: (e) => set("set", e.target.value) }, opt("", "the farm's own patterns", M.set), sets.map((n) => opt(n, n + " (the farm's set)", M.set)), opt("__own", "my own links", M.set)),
      h("textarea", { rows: 3, cols: 40, placeholder: "my own links, one per line: https://…/spiral.gif", onchange: (e) => set("own", e.target.value) }, M.own || "")),
    h("div", null, muted("How strong:"),
      h("select", { title: "how see-through the pictures are", onchange: (e) => set("picOp", Number(e.target.value)) }, [0.2, 0.35, 0.5, 0.65].map((v) => opt(v, "pictures " + Math.round(v * 100) + "%", M.picOp))),
      h("select", { title: "how often a word shows", onchange: (e) => set("wordEvery", Number(e.target.value)) }, [2, 3, 4, 6].map((v) => opt(v, "a word every " + v + " s", M.wordEvery))),
      h("select", { title: "how bright a word gets", onchange: (e) => set("wordOp", Number(e.target.value)) }, [[0.25, "faint words"], [0.45, "soft words"], [0.6, "strong words"]].map(([v, l]) => opt(v, l, M.wordOp))),
      h("select", { onchange: (e) => set("fit", e.target.value) }, opt("cover", "pictures fill", M.fit), opt("contain", "whole pictures", M.fit))),
    h("div", { style: { marginTop: "6px" } }, btn("Make the visor", make, true)),
    result,
    muted("Words fade in and out (never a strobe). Wearers can switch the trance look off, or keep it calm, in their own Companion; their safeword always ends it."))];
}
export const visorState = V;   // (tests)
