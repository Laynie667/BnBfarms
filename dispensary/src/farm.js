/* WHAT'S IN THIS FILE (farm.js)
   THE FARM GIRL'S CALL (Laynie, Nov 17: "have the farm girl 'call' on the extension to apply shots", "anything to make
   the farmgirls load a little lighter"). On the farm she still reads the needle and keeps the books (milk, heat,
   denial, sentences): your game can't be trusted with those, and they cost her almost nothin'. What you feel, see and
   say is ours: she sends one hidden "dose", your Dispensary does it and says the line from your own game, and tells her
   whether it took. Without a Dispensary, she does it all herself, as ever.
     you → her    dispHello { ver, farm, lscg, off }   who you are to her: is the farm on your ladder, is LSCG here,
                                                       which doses you've switched off (so she counts it as a limit)
     her → you    dispWelcome { farm }                 who the farm is (her staff), for your ladder
     her → you    dose { id, dose, x, mins, by, line, hand, quiet }
     you → her    doseDone { id, ok, why }             took, or why not (ladder, off, lscg-off)
     you → her    dispSafeword {}                      your safeword: she lifts the farm's side of your doses too
     her → you    dispClear {}                         her safeword: every dose in you lifted
   Only ever from the farm girl herself (the server says who sent a message; nobody can pretend to be her).
*/
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { BOT } from "./config.js";
import { VERSION } from "./version.js";
import { BOOK, give, clearAll } from "./doses.js";
import { allowed } from "./ladder.js";
import { st, save, onSave } from "./store.js";
import { lscgPresent, lscgDose, lscgHas, lastLscgDose } from "./lscg.js";
import { botHere } from "./needle.js";
import { local, action } from "./say.js";
import { NOTES } from "./lines.js";

const W = window;
function send(type, data) {
  try { if (botHere() && typeof W.ServerSend === "function") { W.ServerSend("ChatRoomChat", makeMsg(type, data, BOT)); return true; } } catch (e) { /* fine */ }
  return false;
}
let helloAt = 0, helloSig = "";
const sigNow = () => JSON.stringify([allowed(BOT), lscgPresent(), Object.keys(st().off).sort()]);
export function hello(force) {
  const now = Date.now(), sig = sigNow();
  if (!force && sig === helloSig && now - helloAt < 30 * 60000) return false;
  if (!send("dispHello", { ver: VERSION, farm: allowed(BOT), lscg: lscgPresent(), off: Object.keys(st().off) })) return false;
  helloAt = now; helloSig = sig;
  return true;
}
export const tellSafeword = () => send("dispSafeword", {});

export function onDoseCall(m) {
  const id = String(m.dose || ""), B = BOOK[id];
  const reply = (ok, why) => { send("doseDone", { id: m.id, dose: id, ok: !!ok, why: why || "" }); return { ok: !!ok, why: why || "" }; };
  if (!B) return reply(false, "unknown");
  if (!allowed(BOT)) return reply(false, "ladder");
  if (st().off[id]) return reply(false, "off");
  const by = Number(m.by) || BOT, x = Math.max(1, Math.min(5, Math.round(Number(m.x) || 1)));
  const mins = Number(m.mins) > 0 ? Math.min(48 * 60, Number(m.mins)) : undefined, line = m.line ? String(m.line).slice(0, 900) : undefined;
  if (B.lscg && lscgPresent()) {
    if (m.hand) return reply(true, "lscg");   // a needle in the hand: LSCG caught that one itself
    const ok = lscgDose(B.lscg, { x, by });   // a trap, an injector: through LSCG's front door, and our own line
    if (ok && line && !m.quiet) action(line);
    return reply(ok, ok ? "lscg" : "lscg-off");
  }
  // the very same needle already came through LSCG a moment ago: top it up to the farm's time instead of addin' it twice
  const twice = lscgHas(id) && Date.now() - lastLscgDose(id) < 8000;
  const r = give(id, { by, x, mins, line, upto: twice, quiet: twice || !!m.quiet });   // (quiet: a drip toppin' them up)
  return reply(r.ok, r.why);
}

function onFarmMsg(m) {
  if (m.type === "ping") { hello(true); return; }
  if (m.type === "dose") { onDoseCall(m); return; }
  if (m.type === "dispWelcome") {
    const S = st();
    S.farm = Array.isArray(m.farm) ? m.farm.filter((x) => Number.isInteger(x) && x > 0).slice(0, 300) : S.farm;
    S.farmAt = Date.now();
    save();
    return;
  }
  if (m.type === "dispClear") { if (clearAll("safeword")) local(NOTES.safeword); return; }
}

export function initFarm(mod) {
  try {
    // ahead of the Companion (10), which keeps the farm girl's messages to itself: we read hers first, and always pass
    // them on (Nov 17: with both installed, her calls never reached us)
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {
      try {
        const data = args[0];
        if (data && data.Type === "Hidden" && data.Sender === BOT) { const m = readMsg(data); if (m) onFarmMsg(m); }
      } catch (e) { console.warn("[Dispensary] farm:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] can't hear the farm girl:", e); }
  // walkin' into her room: say hello
  try { mod.hookFunction("ChatRoomSync", 2, (args, next) => { const r = next(args); setTimeout(() => hello(true), 2500); return r; }); } catch (e) { /* the ping still reaches us */ }
  // a setting she cares about changed: tell her (at most once in a while unless it really changed)
  onSave(() => { setTimeout(() => hello(false), 500); });
  setInterval(() => hello(false), 5 * 60000);
}
