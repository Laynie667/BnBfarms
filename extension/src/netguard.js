/* WHAT'S IN THIS FILE (netguard.js)
   THE LINE TO THE GAME'S SERVER (Nov 21, Laynie: "I keep getting disconnected"). The server cuts a game off the moment
   it's sent 50 messages in one second (Bondage-Club-Server app.js, CLIENT_MESSAGE_RATE_LIMIT). Every add-on in your game
   sends through the same pipe, so a burst from any of them (or all of them at once, walkin' into a full room) can drop you.
     • Never more than 40 go out in any one second from here. A burst past that waits its turn, a fraction of a second,
       in the order it was sent. Nothin' is dropped.
     • Every drop is written down: what the server said, and how much had just been sent. And the busiest second
       there's been. /farmmem shows both, so a drop can be read instead of guessed at.
*/
const W = window, LIMIT = 40, KEEP = 12, DROPS_KEY = "fhc-drops";
const sent = [], queue = [];
let mod = null, flushing = false, held = 0, heldMax = 0, watched = null;
const busiest = { n: 0, at: 0, kinds: "" };

// what a message is, in a word or two (no content: only its kind)
const kindOf = (a) => {
  const t = String((a && a[0]) || "?"), d = (a && a[1]) || {};
  if (t !== "ChatRoomChat") return t;
  return "Chat/" + (d.Type || "?") + (d.Content === "FarmhandMsg" ? " farm" : /^[A-Z][A-Za-z]+Msg$/.test(String(d.Content || "")) ? " " + d.Content : "");
};
const trim = (now) => { while (sent.length && now - sent[0].t > 1000) sent.shift(); };
function count(a, now) {
  sent.push({ t: now, k: kindOf(a) });
  trim(now);
  if (sent.length > busiest.n) {
    const c = {}; for (const s of sent) c[s.k] = (c[s.k] || 0) + 1;
    busiest.n = sent.length; busiest.at = now; busiest.kinds = Object.entries(c).sort((x, y) => y[1] - x[1]).slice(0, 4).map(([k, n]) => k + " ×" + n).join(", ");
  }
}
function flush() {
  const now = Date.now(); trim(now);
  while (queue.length && sent.length < LIMIT) {
    const a = queue.shift(); count(a, Date.now());
    try { mod.callOriginal("ServerSend", a); } catch (e) { console.warn("[Farmhand Companion] sendin' a held message:", e); }
  }
  if (!queue.length) { flushing = false; return; }
  setTimeout(flush, Math.max(25, 1005 - (Date.now() - (sent[0] ? sent[0].t : Date.now()))));
}

// the drops, kept on this computer (a drop takes you to the game's Relog screen; the page stays, but keep them anyway)
const drops = (() => { try { return JSON.parse(W.localStorage.getItem(DROPS_KEY)) || []; } catch (e) { return []; } })();
function dropped(how, why) {
  const now = Date.now(); trim(now);
  const c = {}; for (const s of sent) c[s.k] = (c[s.k] || 0) + 1;
  drops.push({ at: now, how: String(how || "?").slice(0, 40), why: String(why || "").slice(0, 60), sent: sent.length, waiting: queue.length,
    kinds: Object.entries(c).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([k, n]) => k + " ×" + n).join(", ") });
  while (drops.length > KEEP) drops.shift();
  try { W.localStorage.setItem(DROPS_KEY, JSON.stringify(drops)); } catch (e) { /* fine */ }
}
// the game's socket: its own drop, and the server sayin' why it's cuttin' us off
function watchSocket() {
  const S = W.ServerSocket;
  if (!S || typeof S.on !== "function") { setTimeout(watchSocket, 2000); return; }
  if (watched === S) return;
  watched = S;
  try {
    S.on("ForceDisconnect", (why) => dropped("the server cut us off", why));
    S.on("disconnect", (reason) => dropped(reason === "io server disconnect" ? "the server closed it" : reason === "ping timeout" ? "no answer in time (ping timeout)" : reason === "transport close" ? "the line went (transport close)" : reason, ""));
  } catch (e) { console.warn("[Farmhand Companion] can't watch the connection:", e); }
}

export function initNetGuard(m) {
  mod = m;
  try {
    // (lowest of ours, so every change to what's said is made first; a held message goes as it would have)
    mod.hookFunction("ServerSend", -100, (args, next) => {
      const now = Date.now(); trim(now);
      if (queue.length || sent.length >= LIMIT) {
        queue.push(args); held++; heldMax = Math.max(heldMax, queue.length);
        if (!flushing) { flushing = true; setTimeout(flush, 50); }
        return undefined;
      }
      count(args, now);
      return next(args);
    });
  } catch (e) { console.warn("[Farmhand Companion] the send guard couldn't go on:", e); }
  watchSocket();
}

const clock = (t) => { try { return new Date(t).toTimeString().slice(0, 8); } catch (e) { return "?"; } };
// for /farmmem
export function netText() {
  const out = ["The line to the server:"];
  out.push("  busiest second: " + busiest.n + " sent" + (busiest.n ? " at " + clock(busiest.at) + " (" + busiest.kinds + ")" : "") + " · the server cuts you off at 50");
  if (held) out.push("  held back to keep under it: " + held + " message" + (held === 1 ? "" : "s") + " (at most " + heldMax + " waitin' at once)");
  const recent = drops.slice(-6);
  out.push(recent.length ? "  drops (newest last):" : "  no drops written down yet");
  for (const d of recent) out.push("    " + new Date(d.at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + clock(d.at) + ": " + d.how + (d.why ? " · " + d.why : "") + " · " + d.sent + " sent in the second before" + (d.kinds ? " (" + d.kinds + ")" : "") + (d.waiting ? " · " + d.waiting + " waitin'" : ""));
  return out.join("\n");
}
// for the tests
export const netState = () => ({ sent: sent.length, queue: queue.length, held, busiest: Object.assign({}, busiest), drops: drops.slice() });
