/* WHAT'S IN THIS FILE (index.js)
   THE FARMHAND'S DISPENSARY (Laynie, Nov 16: "a add-on that doesnt rely on the farm, or farmhand companion, but would
   work in tandem with it. A extension with a extension menu for craft descriptions similar to lscg's or our shots, but
   self contained"). Doses from crafted items, anywhere in the club. Its own page under Preferences → Extensions.
   Step 1 (Nov 17): the bones. Settings on your account, who can dose you, the clock, needles, the safeword, LSCG, the
   farm girl's call, and the first two doses (Denial Serum, the Sedative). docs/DISPENSARY.md has the whole plan.
*/
import sdkModule from "bondage-club-mod-sdk";
import { VERSION } from "./version.js";
import { load, st } from "./store.js";
import { initDoses, tick, active, leftMs, doseIds, BOOK, give, setClock } from "./doses.js";
import { initNeedle } from "./needle.js";
import { initFarm, hello } from "./farm.js";
import { initLscg } from "./lscg.js";
import { initSafeword, safeword } from "./safeword.js";
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
      Description: "[safeword | page]: The Farmhand's Dispensary. What's in you, the safeword, the settings",
      Action: (args) => {
        const a = String(args || "").trim().toLowerCase();
        if (/^(safe|safeword|red)$/.test(a)) { safeword("command"); return; }
        if (/^(page|settings|open)$/.test(a)) { openPage(); return; }
        status();
      },
    }]);
  } catch (e) { console.warn("[Dispensary] /dispensary unavailable:", e); }
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
  initPage();
  commands();
  tick();
  setInterval(() => { try { tick(); if (pageOpen()) redrawPage(); } catch (e) { console.warn("[Dispensary] clock:", e); } }, 5000);
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
if (W.__FARMHAND_TEST__) W.__disp = { st: () => st(), give: (...a) => give(...a), tick: () => tick(), setClock: (m) => setClock(m), active, leftMs, allowed: (mn) => allowed(mn), started: () => started };

// for the Companion, other add-ons and the tests: what's in you, read-only
W.FarmhandDispensary = Object.freeze({
  version: VERSION,
  active: (id) => active(String(id)),
  doses: () => doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })),
  who: () => st().who,
});
