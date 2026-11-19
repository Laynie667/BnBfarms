/* WHAT'S IN THIS FILE (index.js)
   THE FARMHAND'S DISPENSARY (Laynie, Nov 16: "a add-on that doesnt rely on the farm, or farmhand companion, but would
   work in tandem with it. A extension with a extension menu for craft descriptions similar to lscg's or our shots, but
   self contained"). Doses from crafted items, anywhere in the club. Its own page under Preferences → Extensions.
   Step 1 (Nov 17): the bones. Settings on your account, who can dose you, the clock, needles, the safeword, LSCG, the
   farm girl's call, and the first two doses (Denial Serum, the Sedative). docs/DISPENSARY.md has the whole plan.
*/
import { registerInk } from "../../shared/ink/ink.js";
import sdkModule from "bondage-club-mod-sdk";
import { VERSION } from "./version.js";
import { load, st, save } from "./store.js";
import { initDoses, tick, active, leftMs, doseIds, BOOK, give, setClock, end, moment, grown, dosesIn } from "./doses.js";
import { laterTick, craving, craveSoon } from "./later.js";
import { initWorn, wornTick, wornGear, trigger, wornReset } from "./worn.js";
import { initParasites, paraTick, paraClimax, mine as paraMine, latch, sayAsked, mouthSend, KINDS, paraSuckled } from "./parasites.js";
import { initNipples, nipsTell, nipsOpen, openOf, nipsState, nipsAddOwn, nipsUsed, nipsOnSuckle, nipsTrainTick, nipsClose, nipsOnFarmLoad, nipLoads, nipsCream, nipsClimax, trainedLevel, lastPopped, nipsToyUsed } from "./nipples.js";
import { initToys } from "./toys.js";
import { initKits, kitTick, kitNow, kitSave, kitDelete, kitNames, kitLookup, kitEnd, SPEEDS, SPEED_NAMES } from "./kits.js";
import { initHorny, hornyTick, hornyParaTick, hornyGear, hornyBeat, hornyClimax, hornyReset } from "./horny.js";
import { mineToy, toyOf, toyLocked } from "./toys-list.js";
import { initHoles, holesTick, holesNow, holesUsed, holesClimaxOf, holesBalm, holesSet, holesReset, holesState, holesDrips, sendNow as holesSend, sendGoal, sendClear, setGoal, clearGoal, HOLE_OF_WORD, dueWords, toysNow } from "./holes.js";
import { HOLE_WORD, sizeWord, HOLE_SIZES } from "../../shared/holes.js";
import "./lines-nips.js";
import "./lines-worn.js";
import { initSenses, hazeTick, settle } from "./senses.js";
import { initIcons, iconsTell, iconsFor, iconsReset, iconsDosed } from "./icons.js";
import "./lines-para.js";
import { initNeedle } from "./needle.js";
import { initFarm, hello, tellNipLoad } from "./farm.js";
import { initLscg } from "./lscg.js";
import { initSafeword, safeword } from "./safeword.js";
import { initHardcore, tickHard, hardOn, dueAt, onHardChange, lock, keyholders } from "./hardcore.js";
import { initSpeech, dosedSpeech } from "./speech.js";
import { screenTick } from "./screen.js";
import { initPage, openPage, pageOpen, redrawPage, timeLeft, guideNext } from "./page.js";
import { GUIDES, guideFor } from "./guides.js";
import { ladderWho, allowed } from "./ladder.js";
import { local, nameOf } from "./say.js";

const W = window;
const bcModSdk = sdkModule.default || sdkModule;

if (W.__farmDispensary) {
  console.warn("[Dispensary] Two copies of the Farmhand's Dispensary are installed. Delete the older one in Tampermonkey, then reload.");
  throw new Error("The Farmhand's Dispensary: another copy is already running");
}
const mod = bcModSdk.registerMod({ name: "FarmhandDispensary", fullName: "The Farmhand's Dispensary", version: VERSION });
W.__farmDispensary = VERSION;
registerInk(W, mod);   // the ink and brand slots, the same as the Companion's (whichever loads first adds them)
initToys(mod, { nipsOpen: () => nipsOpen(), openOf: (mn) => openOf(mn) });   // the nipple toys, in the game's nipple slot (before your own clothes load)

// LSCG can load before or after us, and before login: its queue waits either way
initLscg();

function status() {
  const on = doseIds().filter(active);
  local((on.length ? "In you now: " + on.map((id) => BOOK[id].label + " (" + timeLeft(leftMs(id)) + ")").join(", ") + "." : "No doses in you.") +
    " Who can dose you: " + ladderWho() + ". /dispensary safeword lifts every dose; /dispensary page opens the settings.");
}
function commands() {
  if (typeof W.CommandCombine !== "function") return;
  try {
    W.CommandCombine([{
      Tag: "dispensary",
      Description: "[guide <topic> | safeword | page | say | nope | mouth <who> <words> | nips [close | heal on|off] | holes [heal|pain on|off] | train <who> <ass|pussy|throat> <size> [in 3 days] | horny on|off]: The Farmhand's Dispensary. What's in you, the safeword, the settings, the mouthpiece, your nipples, your holes, horny gear",
      Action: (args) => {
        const a = String(args || "").trim().toLowerCase();
        // your nipples (Nov 18): how they are, closin' them back up, and whether they close up on their own
        const nm = /^nips?(?:\s+(close|reset|heal)(?:\s+(on|off))?)?$/.exec(a);
        if (nm) {
          if (nm[1] === "close" || nm[1] === "reset") { if (hardOn()) { local("🔒 Hardcore: closin' them back up is your keyholders' to do (a Tightening Balm from one of them does it)."); return; }
            const lt = mineToy(); if (lt && toyLocked(lt)) { local("🔒 The " + toyOf(lt).label + "'s locked in, holdin' them open. Whoever holds its key has to take it out first."); return; }
            const was = nipsClose(true), out = lastPopped();
            local(was ? (out ? "The " + out + " slides out, and your" : "Your") + " nipples close up again, snug and tender, as if they'd never been stretched." : "Your nipples aren't stretched, sugar."); return; }
          if (nm[1] === "heal" && nm[2]) { if (hardOn()) { local("🔒 Hardcore: your keyholders hold that switch."); return; } st().nipsHeal = nm[2] === "on"; save(); local(nm[2] === "on" ? "Your nipples will close up slowly on their own, once they've been left be a while." : "Your nipples stay as stretched as they're trained, till somebody closes them up."); return; }
          const L2 = nipLoads(), tw = mineToy(); local("Your nipples: " + (nipsOpen() ? "open, " + nipsOpen() + " wide" : "closed") + (trainedLevel() ? " (trained to stay " + trainedLevel() + " wide)" : "") + ". " +
            (tw ? "The " + toyOf(tw).label + " is in them" + (toyLocked(tw) ? ", locked" : "") + ". " : "") +
            (st().nipsHeal !== false ? "They close up slowly on their own." : "They stay as they're trained.") + (L2.n ? " Loads taken in them: " + L2.n + "." : "") + " /dispensary nips close · /dispensary nips heal on|off"); return;
        }
        // your holes (Nov 18): how open, how trained, the switches; and trainin' goals for somebody
        const hlm = /^holes?(?:\s+(heal|pain)\s+(on|off))?$/.exec(a);
        if (hlm) { holesCommand(hlm[1], hlm[2]); return; }
        const trm = /^train\s+(.+)$/i.exec(String(args || "").trim());
        if (trm) { trainCommand(trm[1]); return; }
        // kits (Nov 18): yours to switch on, what they put on you, how fast; your own saved ones
        const km = /^kits?(?:\s+(.*))?$/.exec(String(args || "").trim());
        if (km) { kitCommand(String(km[1] || "").trim()); return; }
        // horny gear (Nov 18): its own switch
        const hm = /^horny\s+(on|off)$/.exec(a);
        if (hm) { if (hardOn()) { local("🔒 Hardcore: your keyholders hold that switch."); return; } st().hornyOn = hm[1] === "on"; save(); local(hm[1] === "on" ? "Horny gear can use you: crafted gear that says horny or hungry has its way with you, now and then." : "Horny gear sits still on you now."); return; }
        // the guides (Nov 19): the page, open at one
        const gm = /^(?:guides?|help|how)(?:\s+(.+))?$/.exec(a);
        if (gm) {
          const G = gm[1] ? guideFor(gm[1].replace(/^(?:to|for|on|about)\s+/, "").split(/\s+/)[0]) || guideFor(gm[1]) : guideFor("start");
          if (!G) { local("No guide for that. The guides: " + GUIDES.map((g) => g.id).join(", ") + ". /dispensary guide <one of those>, or /dispensary guide on its own to start."); return; }
          guideNext(G.id); openPage(); return;
        }
        if (/^(safe|safeword|red)$/.test(a)) { safeword("command"); return; }
        if (/^(page|settings|open)$/.test(a)) { openPage(); return; }
        // the mouthpiece: say what its crafter asked, or let it pass; or, as the crafter, send some words
        if (/^say$/.test(a)) { if (!sayAsked(true)) local("Nobody's asked you to say anything."); return; }
        if (/^(nope|no|pass)$/.test(a)) { if (!sayAsked(false)) local("Nobody's asked you to say anything."); return; }
        const mm = /^mouth\s+(\S+)\s+(.+)$/i.exec(String(args || "").trim());
        if (mm) { const t = mouthTarget(mm[1]); if (!t) { local("Who? Their name or member number, in this room."); return; } local(mouthSend(t, mm[2]) ? "🗣️ Sent to " + mm[1] + "'s mouthpiece. If it's yours, they'll see it." : "Couldn't reach them."); return; }
        status();
      },
    }]);
  } catch (e) { console.warn("[Dispensary] /dispensary unavailable:", e); }
}

// /dispensary kit ...
function kitCommand(rest) {
  const a = rest.toLowerCase(), S = st();
  const lockedOut = () => { if (hardOn()) { local("🔒 Hardcore: your keyholders hold that switch."); return true; } return false; };
  let m;
  if (/^(on|off)$/.test(a)) { if (lockedOut()) return; S.kitsOn = a === "on"; save(); local(a === "on" ? "Kits can dress you now: a dose that says \"kit: <name>\" puts its crafter's outfit on you, " + SPEED_NAMES[S.kitSpeed || "steady"] + "." : "Kits can't dress you now."); return; }
  if ((m = /^speed\s+(slow|steady|fast|now)$/.exec(a))) { S.kitSpeed = m[1]; save(); local("Kits go on you " + SPEED_NAMES[m[1]] + "."); return; }
  if ((m = /^(?:what|put)\s+(clothes|binds|restraints|both)$/.exec(a))) { if (lockedOut()) return; S.kitWhat = m[1] === "restraints" ? "binds" : m[1]; save(); local("Kits can put " + ({ clothes: "clothes", binds: "restraints", both: "clothes and restraints" })[S.kitWhat] + " on you."); return; }
  if ((m = /^save\s+(.+)$/.exec(rest))) { const r = kitSave(m[1]); local(r.ok ? "Saved what you're wearin' as the kit \"" + r.key + "\" (" + r.n + " pieces). Craft a dose that says \"Kit: " + r.key + "\" to put it on somebody." : ({ name: "Give it a name: /dispensary kit save <name>.", full: "You've eight kits saved already: /dispensary kit del <name> makes room.", empty: "You've nothin' on to save, sugar.", big: "That outfit's too big to keep as a kit." })[r.why]); return; }
  if ((m = /^(?:del|delete|remove)\s+(.+)$/.exec(rest))) { local(kitDelete(m[1]) ? "Kit \"" + m[1].toLowerCase().trim() + "\" deleted." : "You've no kit called that."); return; }
  if (/^(stop|end|off now)$/.test(a)) { if (lockedOut()) return; local(kitNow() ? (end("kit", "quiet"), "The kit lets go of you, and your own outfit's back on.") : "No kit's on you."); return; }
  const k = kitNow(), n = kitNames();
  local((k ? "👗 On you: " + k.key + " from " + (nameOf(k.by) || "#" + k.by) + " (" + k.on + " pieces on" + (k.left ? ", " + k.left + " to go" : "") + "). " : "") +
    "Kits can dress you: " + (S.kitsOn ? "yes" : "no") + " · they put on " + ({ clothes: "clothes", binds: "restraints", both: "clothes and restraints" })[S.kitWhat || "both"] + " · " + SPEED_NAMES[S.kitSpeed || "steady"] + ". " +
    "Your kits: " + (n.own.length ? n.own.join(", ") : "none") + (n.lscg.length ? " · in LSCG: " + n.lscg.join(", ") : "") + ". " +
    "/dispensary kit on|off · speed slow|steady|fast|now · what clothes|binds|both · save <name> · del <name>");
}

// /dispensary holes [heal|pain on|off]
function holesCommand(sw, v) {
  if (sw) {
    if (hardOn()) { local("🔒 Hardcore: your keyholders hold that switch."); return; }
    if (sw === "heal") { st().holesHeal = v === "on"; save(); local(v === "on" ? "Your holes close up slowly on their own now, once they've been left be a day." : "Your holes stay as they're trained, till somethin' tightens them."); return; }
    st().holesPain = v === "on"; save(); local(v === "on" ? "Too-big toys can hurt you now, and cruel ones mean it." : "Too-big toys only ache now, however big they are."); return;
  }
  const N = holesNow(), rows = Object.entries(N.holes).map(([h, x]) => "Your " + HOLE_WORD[h] + ": " + x.nowWord + (x.now !== x.trained ? " tonight, trained " + x.trainedWord : "") + (x.toward ? " (" + x.toward + "% to the next)" : "") +
    (x.toy ? ", the " + x.toy.name + " in it" : "") + (x.goal ? ", goal " + x.goal.word + (x.goal.due ? " " + dueWords(x.goal.due) : "") : "") + ".");
  local(rows.join(" ") + " Heal: " + (N.heal ? "on" : "off") + " · too-big toys hurt: " + (N.pain ? "yes" : "no") + (N.waiting ? " · " + N.waiting + " change" + (N.waiting === 1 ? "" : "s") + " waitin' to hand the farm girl" : "") + ". /dispensary holes heal on|off · /dispensary holes pain on|off · /dispensary train <who> <ass|pussy|throat> <size> [in 3 days]");
}
// /dispensary train <who> <ass|pussy|throat> <size> [in 3 days | by friday] · /dispensary train <who> clear [hole]
function trainCommand(rest) {
  const m = /^(\S+)\s+(\S+)\s*(.*)$/.exec(String(rest || "").trim());
  if (!m) { local("/dispensary train <who> <ass|pussy|throat> <size> [in 3 days | by friday], or /dispensary train <who> clear. The size is one of the farm's words: snug, loose, gaping, ruined, or size 1 to 10."); return; }
  const who = /^(me|myself|self)$/i.test(m[1]) ? (W.Player && W.Player.MemberNumber) : mouthTarget(m[1]);
  if (!who) { local("Who? Their name or member number, in this room (or me)."); return; }
  const self = who === (W.Player && W.Player.MemberNumber);
  if (/^(clear|stop|off|lift)$/i.test(m[2])) {
    if (self && hardOn()) { local("🔒 Hardcore: your keyholders lift your goals."); return; }
    const h = HOLE_OF_WORD(m[3].trim().split(/\s+/)[0]);
    const r = sendClear(who, h); local(r.self ? (r.ok ? "Your trainin' goal" + (h ? " for your " + HOLE_WORD[h] : "s") + " lifted." : "You've no goal to lift.") : r.ok ? "Sent: their goal's lifted, if they've let you dose them." : "Couldn't reach them."); return;
  }
  const h = HOLE_OF_WORD(m[2]);
  if (!h) { local("Which: ass, pussy or throat?"); return; }
  const r = sendGoal(who, h, m[3]);
  if (!r.ok) { local(r.why === "size" ? "What size? One of the farm's words: snug, loose, well-used, gaping, wide open, ruined (a throat: eager, trained, deep, past gaggin', bottomless), or size 1 to 10." : r.why === "already" ? "Your " + HOLE_WORD[h] + "'s already that open." : r.why === "hole" ? "You haven't got that." : "Couldn't reach them."); return; }
  local(r.self ? "🎯 Your goal: your " + HOLE_WORD[h] + ", " + sizeWord(h, r.to) + ". Your trainers will work you there." : "🎯 Sent: a goal for their " + HOLE_WORD[h] + ", " + sizeWord(h, r.to) + ". Their Dispensary tells you if it took.");
}

// "mouth <who>": a member number, or somebody in the room by name
function mouthTarget(w) {
  if (/^\d+$/.test(w)) return Number(w);
  const low = String(w).toLowerCase(), C = (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber !== (W.Player && W.Player.MemberNumber) && [c.Nickname, c.Name].some((n) => n && String(n).toLowerCase().startsWith(low)));
  return C ? C.MemberNumber : 0;
}

let started = false;
function start() {
  if (started) return;
  started = true;
  load();
  initDoses(mod);
  initNeedle(mod);
  initFarm(mod);
  initSafeword(mod);
  initHardcore(mod);
  initSpeech(mod);
  initWorn(mod);
  initSenses(mod);
  initIcons(mod);
  initParasites(mod);
  initNipples(mod); nipsOnSuckle(paraSuckled); nipsOnFarmLoad(tellNipLoad);
  initHorny(mod, { nipsToyUsed: () => nipsToyUsed(), para: () => paraMine() });
  initKits(mod, { end: (id) => end(id, "quiet"), byOf: (id) => (st().doses[id] && st().doses[id].by) || 0 });
  initHoles(mod);
  onHardChange(() => { if (pageOpen()) redrawPage(true); });
  initPage();
  commands();
  tick();
  setInterval(() => { try { tick(); laterTick(); wornTick(); paraTick(); nipsTrainTick(); hornyTick(); hornyParaTick(); kitTick(); holesTick(); nipsTell(false); tickHard(); screenTick(); hazeTick(); iconsTell(false); if (pageOpen()) redrawPage(); } catch (e) { console.warn("[Dispensary] clock:", e); } }, 5000);
  setTimeout(() => hello(true), 3000);
}
// after login: your account's settings are there to read
const boot = setInterval(() => {
  const P = W.Player;
  if (!P || typeof P.MemberNumber !== "number" || !P.ExtensionSettings) return;
  clearInterval(boot);
  try { start(); } catch (e) { console.warn("[Dispensary] didn't start:", e); }
}, 1000);

// the tests reach in (only when a test page says so)
if (W.__FARMHAND_TEST__) W.__disp = { st: () => st(), dosesIn: (t) => dosesIn(t), give: (...a) => give(...a), tick: () => { tick(); laterTick(); tickHard(); }, setClock: (m) => setClock(m), active, leftMs, allowed: (mn) => allowed(mn), started: () => started,
  lock: (d) => lock(d), hardOn: () => hardOn(), keyholders: () => keyholders(), dueAt: () => dueAt(),
  speech: (t) => dosedSpeech(t), screen: () => screenTick(),
  end: (id) => end(id, "quiet"), moment: (id) => moment(id), craving: () => craving(), craveNow: () => { craveSoon(); laterTick(); },
  worn: () => wornGear(), wornTick: () => wornTick(), wornReset: () => wornReset(), trigger: (k, f) => trigger(k, f), para: () => paraMine(), paraTick: () => paraTick(), latch: (k, o) => latch(k, o), climax: () => paraClimax(), haze: () => hazeTick(), icons: (mn) => iconsFor(mn), iconsTell: (f) => iconsTell(f),
  kit: () => kitNow(), kitTick: (now) => kitTick(now), kitSave: (n) => kitSave(n), kitLookup: (k) => kitLookup(k), kitEnd: () => kitEnd(false), kitCmd: (r) => kitCommand(r),
  holes: () => holesNow(), holesTick: (now) => holesTick(now), holesUsed: (...a) => holesUsed(...a), holesClimax: (f) => holesClimaxOf(f), holesBalm: (w, x) => holesBalm(w, x), holesSet: (h, n) => holesSet(h, n),
  holesReset: () => holesReset(), holesState: () => holesState(), holesDrips: () => holesDrips(), holesSend: (a) => holesSend(a), setGoal: (h, to, by, ms) => setGoal(h, to, by, ms), clearGoal: (h) => clearGoal(h), trainCmd: (r) => trainCommand(r), holesCmd: (s, v) => holesCommand(s, v), toys: () => toysNow(),
  horny: () => hornyGear(), hornyTick: (now) => { hornyTick(now); hornyParaTick(now); }, hornyBeat: (g) => hornyBeat(g), hornyClimax: () => hornyClimax(), hornyReset: () => hornyReset(),
  nips: () => nipsOpen(), nipsOf: (mn) => openOf(mn), nipsTrain: (now) => nipsTrainTick(now), nipsClose: () => nipsClose(), nipLoads: () => nipLoads(), nipsCream: (f) => nipsCream(f), nipsClimax: () => nipsClimax(), trained: () => trainedLevel(), nipsState: () => nipsState(), nipsAddOwn: () => nipsAddOwn(mod), nipsUsed: (from, k) => nipsUsed(from, k), nipsTell: (f) => nipsTell(f), suckled: (from) => paraSuckled(from) };

// for the Companion, other add-ons and the tests: what's in you, read-only
W.FarmhandDispensary = Object.freeze({
  version: VERSION,
  active: (id) => active(String(id)),
  dosedOf: (mn) => iconsDosed(Number(mn)),   // anythin' in them now (glow ink, shared/ink/ink.js)
  doses: () => doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })),
  // one dose, if it's in you: how strong, its part or spot (Fill-Out: cup, belly, ass · Tender: the spot), time left.
  // The Companion's drawn body reads Fill-Out from here.
  dose: (id) => { const d = st().doses[String(id)]; return d && active(String(id)) ? { x: d.x || 1, p: d.p || "", left: leftMs(String(id)) } : null; },
  who: () => st().who,
  // hardcore, for the Companion (its own settings lock while yours is on)
  // growth off the farm (Nov 18): { cup, ass, cock, balls } sizes up (or down) from your own. The Companion's drawn body reads it.
  grow: () => grown(),
  // the crafted parasites in you (Nov 18): [{ kind, label, by, until }]
  parasites: () => Object.entries(paraMine()).map(([k, p]) => ({ kind: k, label: KINDS[k] ? KINDS[k].label : k, by: p.by, until: p.until })),
  hard: () => (hardOn() ? { on: true, until: (st().hard && st().hard.until) || 0, due: dueAt() } : null),
  // open nipples (Nov 18, nipples.js): 0 shut, 1 to 3 open, yours or what somebody's Dispensary told the room. The
  // Companion's drawn breasts can read it.
  nipples: (mn) => openOf(mn == null ? (W.Player && W.Player.MemberNumber) : Number(mn)),
  // your holes (Nov 18, holes.js): { vulva|butt|throat: { label, now, trained, nowWord, trainedWord, toward, toy, goal } }.
  // The Companion's Body rows read it, so they're right off the farm too.
  holes: () => holesNow().holes,
});
