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
import { initDoses, tick, active, leftMs, doseIds, BOOK, give, setClock, end, moment, grown } from "./doses.js";
import { laterTick, craving, craveSoon } from "./later.js";
import { initWorn, wornTick, wornGear, trigger, wornReset } from "./worn.js";
import { initParasites, paraTick, paraClimax, mine as paraMine, latch, sayAsked, mouthSend, KINDS, paraSuckled } from "./parasites.js";
import { initNipples, nipsTell, nipsOpen, openOf, nipsState, nipsAddOwn, nipsUsed, nipsOnSuckle, nipsTrainTick, nipsClose, nipsOnFarmLoad, nipLoads, nipsCream, nipsClimax, trainedLevel } from "./nipples.js";
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
import { initPage, openPage, pageOpen, redrawPage, timeLeft } from "./page.js";
import { ladderWho, allowed } from "./ladder.js";
import { local } from "./say.js";

const W = window;
const bcModSdk = sdkModule.default || sdkModule;

if (W.__farmDispensary) {
  console.warn("[Dispensary] Two copies of the Farmhand's Dispensary are installed. Delete the older one in Tampermonkey, then reload.");
  throw new Error("The Farmhand's Dispensary: another copy is already running");
}
const mod = bcModSdk.registerMod({ name: "FarmhandDispensary", fullName: "The Farmhand's Dispensary", version: VERSION });
W.__farmDispensary = VERSION;
registerInk(W, mod);   // the ink and brand slots, the same as the Companion's (whichever loads first adds them)

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
      Description: "[safeword | page | say | nope | mouth <who> <words> | nips [close | heal on|off]]: The Farmhand's Dispensary. What's in you, the safeword, the settings, the mouthpiece, your nipples",
      Action: (args) => {
        const a = String(args || "").trim().toLowerCase();
        // your nipples (Nov 18): how they are, closin' them back up, and whether they close up on their own
        const nm = /^nips?(?:\s+(close|reset|heal)(?:\s+(on|off))?)?$/.exec(a);
        if (nm) {
          if (nm[1] === "close" || nm[1] === "reset") { if (hardOn()) { local("🔒 Hardcore: closin' them back up is your keyholders' to do (a Tightening Balm from one of them does it)."); return; } local(nipsClose(true) ? "Your nipples close up again, snug and tender, as if they'd never been stretched." : "Your nipples aren't stretched, sugar."); return; }
          if (nm[1] === "heal" && nm[2]) { if (hardOn()) { local("🔒 Hardcore: your keyholders hold that switch."); return; } st().nipsHeal = nm[2] === "on"; save(); local(nm[2] === "on" ? "Your nipples will close up slowly on their own, once they've been left be a while." : "Your nipples stay as stretched as they're trained, till somebody closes them up."); return; }
          const L2 = nipLoads(); local("Your nipples: " + (nipsOpen() ? "open, " + nipsOpen() + " wide" : "closed") + (trainedLevel() ? " (trained to stay " + trainedLevel() + " wide)" : "") + ". " +
            (st().nipsHeal !== false ? "They close up slowly on their own." : "They stay as they're trained.") + (L2.n ? " Loads taken in them: " + L2.n + "." : "") + " /dispensary nips close · /dispensary nips heal on|off"); return;
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
  onHardChange(() => { if (pageOpen()) redrawPage(true); });
  initPage();
  commands();
  tick();
  setInterval(() => { try { tick(); laterTick(); wornTick(); paraTick(); nipsTrainTick(); nipsTell(false); tickHard(); screenTick(); hazeTick(); iconsTell(false); if (pageOpen()) redrawPage(); } catch (e) { console.warn("[Dispensary] clock:", e); } }, 5000);
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
if (W.__FARMHAND_TEST__) W.__disp = { st: () => st(), give: (...a) => give(...a), tick: () => { tick(); laterTick(); tickHard(); }, setClock: (m) => setClock(m), active, leftMs, allowed: (mn) => allowed(mn), started: () => started,
  lock: (d) => lock(d), hardOn: () => hardOn(), keyholders: () => keyholders(), dueAt: () => dueAt(),
  speech: (t) => dosedSpeech(t), screen: () => screenTick(),
  end: (id) => end(id, "quiet"), moment: (id) => moment(id), craving: () => craving(), craveNow: () => { craveSoon(); laterTick(); },
  worn: () => wornGear(), wornTick: () => wornTick(), wornReset: () => wornReset(), trigger: (k, f) => trigger(k, f), para: () => paraMine(), paraTick: () => paraTick(), latch: (k, o) => latch(k, o), climax: () => paraClimax(), haze: () => hazeTick(), icons: (mn) => iconsFor(mn), iconsTell: (f) => iconsTell(f),
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
});
