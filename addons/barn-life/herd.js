/* WHAT'S IN THIS FILE (barn-life/herd.js)
   Things for the herd to do with no staff around (part of the Barn life add-on).

   • PLAY: ?play <who> [romp|rps|race]. The other animal gets a yes/no first (good for a couple of hours).
       romp  a tumble in the straw, three beats, seen by whoever's near
       rps   rock, paper, scissors: each says ?rps rock|paper|scissors privately (a minute to pick); the loser
             pays a little forfeit
       race  the farm girl names a spot (a trough, the water, the pasture…); first of the two to stand on it wins
     The first win of the day earns a ribbon. Playin' tops up both animals' grooming a little (they're happier).
   • EVENIN' TURN-OUT: at 7 pm on the bot's clock the bell rings, and everybody on the books who's on the farm is
     called out to the pasture (a spot named pasture, or turnout). Ten minutes later whoever's there shares a
     little scene and gets a ribbon. Nobody's moved, and nobody's marked down for stayin' in.
     Proprietors: ?bell (how it's set) · ?bell now · ?bell hour <0-23> · ?bell off|on
*/
import { pick, between, fill } from "../_lib/connect.js";

let api = null, D = null, needsOf = null, isOn = null;
export function herdSetup(a, data, needs, on) { api = a; D = data; needsOf = needs; isOn = on; }
const H = () => { const d = D(); d.herd = d.herd || { ok: {}, wins: {}, bell: {} }; d.herd.ok = d.herd.ok || {}; d.herd.wins = d.herd.wins || {}; d.herd.bell = d.herd.bell || {}; return d.herd; };
const games = new Map();   // "a:b" → { a, b, kind, picks, until, spot }
const keyOf = (a, b) => (a < b ? a + ":" + b : b + ":" + a);
const gameOf = (mn) => [...games.values()].find((g) => g.a === mn || g.b === mn) || null;
const onBooks = (mn) => { const r = api.rec(mn); return !!(r && r.roles && r.roles.length); };
const nextTo = (a, b, reach) => { const p = api.pos(a), q = api.pos(b); return !!(p && q && Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y)) <= (reach || 2)); };

// ── lines ──────────────────────────────────────────────────
const ROMP = [
  ["%a% drops their shoulders, rump in the air, and bounces at %b%. It's on.",
    "%a% and %b% go tumbling through the straw, a tangle of limbs and tails, each tryin' to pin the other.",
    "%w% ends up on top, pantin' and pleased with themselves, with %l% squirmin' and laughin' underneath."],
  ["%a% nips at %b%'s flank and bolts. %b% is after them before the straw settles.",
    "Round the pen they go, %b% gainin', till the pair of them go down in a heap by the fence.",
    "%w% sits right on %l%'s back and won't budge till they cry uncle. Or moo."],
  ["%a% butts their head into %b%'s shoulder, playful, askin' for trouble.",
    "%b% shoves back and the two of them wrestle, shoulder to shoulder, gruntin' and gigglin'.",
    "%w% rolls %l% over and blows a raspberry on their belly. %l% shrieks."],
  ["%b% snatches a wisp of hay and dangles it. %a% lunges for it.",
    "A tug-of-war over one piece of hay, the both of them growlin' through their teeth and tails goin'.",
    "The hay snaps. %w% gets the bigger half and prances a victory lap round %l%."],
];
const RPS_FORFEIT = [
  "%l% has to moo for %w%, loud enough for the barn to hear.",
  "%w% gets to pin %l% and lick their face clean, ear to ear.",
  "%l% carries %w%'s pride around all day: loser grooms the winner. Get to it.",
  "%w% claims a forfeit: %l% kneels and nuzzles their hand like good stock.",
  "%l% gets their rump swatted, once, by %w%. Fair's fair.",
  "%l% owes %w% a belly rub. A long one.",
];
const BEATS = { rock: "scissors", scissors: "paper", paper: "rock" };
const TURNOUT_CALL = [
  "🔔 Evenin' turn-out! The bell's ringin', y'all. Come on out to the pasture: ten minutes, and there's a ribbon for everybody who shows.",
  "🔔 That's the turn-out bell. Everybody out to the pasture for the evenin'. Ten minutes, and a ribbon if you make it.",
  "🔔 Clang, clang! Turn-out time. Stretch your legs in the pasture, sweet things. Ten minutes.",
];
const TURNOUT_SCENE = [
  "🌾 The herd's out for the evenin': %names% graze shoulder to shoulder as the light goes gold, tails flickin', nobody in any hurry.",
  "🌾 Turn-out. %names% settle into the pasture together, nosin' the grass and each other, warm flanks touchin' as the sun goes down.",
  "🌾 %names% amble out under the evenin' sky and bunch up the way a herd does, chewin' slow, one of them already half asleep on another's shoulder.",
];
const TURNOUT_ALONE = [
  "🌾 %names% has the whole pasture to themselves this evenin', and makes the most of it: a long stretch, a roll in the grass, and a ribbon for showin' up.",
];

// ── play ───────────────────────────────────────────────────
function allowed(a, b) { const u = H().ok[b + ":" + a]; return !!(u && u > Date.now()); }
function startGame(a, b, kind) {
  const N = api.name;
  if (kind === "rps") {
    games.set(keyOf(a, b), { a, b, kind, picks: {}, until: Date.now() + 75000 });
    for (const m of [a, b]) api.notice(m, "✊✋✌️ Rock, paper, scissors with " + N(m === a ? b : a) + "! Say ?rps rock, ?rps paper or ?rps scissors. You've got a minute, and only I see what you pick.");
    return;
  }
  if (kind === "race") {
    const spots = Object.keys(api.spots()).filter((s) => /^(trough|water|pasture|turnout|pen|bench|milking)/.test(s) && !api.onSpot(a, s, 3) && !api.onSpot(b, s, 3));
    if (!spots.length) return startGame(a, b, "romp");
    const spot = pick(spots);
    games.set(keyOf(a, b), { a, b, kind, spot, until: Date.now() + 150000 });
    api.emote("🏁 " + N(a) + " and " + N(b) + " line up, noses level. The farm girl points: \"First one to " + spot.replace(/-/g, " ") + " wins. Go!\"", a);
    for (const m of [a, b]) api.notice(m, "🏁 Race! First to stand on " + spot + " wins. Run, sugar!");
    return;
  }
  // a romp: three beats, a winner picked by the straw
  const [w, l] = Math.random() < 0.5 ? [a, b] : [b, a], beats = pick(ROMP);
  beats.forEach((t, i) => api.later(() => { if (api.onMap(a) && api.onMap(b)) api.emote("🐾 " + fill(t, { a: N(a), b: N(b), w: N(w), l: N(l) }), a); }, i * 9000));
  api.later(() => won(w, l, "romp"), beats.length * 9000);
}
function won(w, l, kind) {
  const h = H(), day = api.dayKey();
  for (const m of [w, l]) if (isOn(m)) { const n = needsOf(m); n.groom = Math.min(100, n.groom + 10); }
  if (h.wins[w] !== day) { h.wins[w] = day; if (api.ribbons) api.ribbons(w, 1, "winnin' at " + (kind === "rps" ? "rock, paper, scissors" : kind === "race" ? "a race" : "a romp")); }
  api.save();
}
function cmdPlay(c) {
  const { sender, args, api: A } = c, N = A.name;
  if (!onBooks(sender)) return c.reply("Playin's for folks on the farm's books, sugar. ?apply gets you started.");
  const t = A.find(args[0]), kind = /^(rps|rock|paper|scissors)$/i.test(args[1] || "") ? "rps" : /^(race|run|chase)$/i.test(args[1] || "") ? "race" : /^(romp|wrestle|tumble)$/i.test(args[1] || "") ? "romp" : pick(["romp", "romp", "rps", "race"]);
  if (!t || !onBooks(t)) return c.reply("🐾 Who do you want to play with, sugar? ?play <who> picks a game for you, or name it: ?play <who> romp · ?play <who> rps (rock, paper, scissors) · ?play <who> race");
  if (t === sender) return c.reply("Playin' with yourself is a different command, sugar. Find a friend.");
  if (!A.onMap(sender) || !A.onMap(t) || !nextTo(sender, t, 3)) return c.reply("Get up close to " + N(t) + " first, sugar.");
  if (gameOf(sender) || gameOf(t)) return c.reply("One game at a time, sugar. Finish the one that's goin'.");
  const go = () => startGame(sender, t, kind);
  if (allowed(sender, t)) { go(); return c.reply("🐾 Game on with " + N(t) + "!"); }
  A.ask(t, "🐾 " + N(sender) + " wants to play with you (" + (kind === "rps" ? "rock, paper, scissors" : kind === "race" ? "a race" : "a romp in the straw") + "), sugar. Say yes or no.", (yes) => {
    if (!yes) return A.notice(sender, N(t) + " doesn't feel like playin' right now, sugar.");
    H().ok[t + ":" + sender] = Date.now() + 2 * 3600000; H().ok[sender + ":" + t] = Date.now() + 2 * 3600000; A.save();
    if (A.onMap(sender) && A.onMap(t)) go();
  });
  c.reply("🐾 I've asked " + N(t) + " if they want to play.");
}
function cmdRps(c) {
  const g = gameOf(c.sender), p = String(c.args[0] || "").toLowerCase();
  if (!g || g.kind !== "rps") return c.reply("You're not in a game of rock, paper, scissors, sugar. ?play <who> rps starts one.");
  if (!BEATS[p]) return c.reply("?rps rock, ?rps paper or ?rps scissors, sugar.");
  if (g.picks[c.sender]) return c.reply("You've already thrown " + g.picks[c.sender] + ", sugar. No take-backs.");
  g.picks[c.sender] = p;
  c.reply("🤫 " + p[0].toUpperCase() + p.slice(1) + " it is. Waitin' on the other one.");
  if (g.picks[g.a] && g.picks[g.b]) settleRps(g);
}
function settleRps(g) {
  games.delete(keyOf(g.a, g.b));
  const N = api.name, pa = g.picks[g.a], pb = g.picks[g.b];
  if (!pa && !pb) return;
  if (!pa || !pb) {   // one never threw: the other wins by default
    const w = pa ? g.a : g.b, l = pa ? g.b : g.a;
    api.emote("✊ " + N(w) + " throws " + (pa || pb) + ", and " + N(l) + " just stands there chewin'. " + N(w) + " wins by default.", w);
    return won(w, l, "rps");
  }
  if (pa === pb) return api.emote("✊ " + N(g.a) + " and " + N(g.b) + " both throw " + pa + ". A draw! They eye each other. Best go again.", g.a);
  const [w, l, pw, pl] = BEATS[pa] === pb ? [g.a, g.b, pa, pb] : [g.b, g.a, pb, pa];
  api.emote("✊ " + N(w) + " throws " + pw + ", " + N(l) + " throws " + pl + ". " + N(w) + " wins! " + fill(pick(RPS_FORFEIT), { w: N(w), l: N(l) }), w);
  won(w, l, "rps");
}

// ── evenin' turn-out ───────────────────────────────────────
const pastureSpot = () => Object.keys(api.spots()).find((s) => /^(pasture|turnout)/.test(s)) || null;
function ring() {
  const h = H(), spot = pastureSpot();
  if (!spot) return false;
  h.bell.day = api.dayKey(); h.bell.until = Date.now() + 10 * 60000; h.bell.spot = spot; api.save();
  const line = pick(TURNOUT_CALL);
  for (const mn of api.here()) if (onBooks(mn)) api.notice(mn, line);
  return true;
}
function settleTurnout() {
  const h = H(), spot = h.bell.spot; h.bell.until = 0; api.save();
  const there = api.here().filter((mn) => onBooks(mn) && api.onSpot(mn, spot, 4));
  if (!there.length) return;
  const N = there.map(api.name), names = N.length === 1 ? N[0] : N.slice(0, -1).join(", ") + " and " + N[N.length - 1];
  api.emote(fill(pick(there.length === 1 ? TURNOUT_ALONE : TURNOUT_SCENE), { names }).replace("%names%", names), there[0]);
  for (const mn of there) { if (api.ribbons) api.ribbons(mn, 1, "comin' out for evenin' turn-out"); if (isOn(mn)) { const n = needsOf(mn); n.groom = Math.min(100, n.groom + 5); } }
  api.save();
}
export function herdTick() {
  const now = Date.now(), h = H();
  // games that ran out of time
  for (const g of [...games.values()]) {
    if (g.kind === "race") {
      const w = api.onSpot(g.a, g.spot, 1) ? g.a : api.onSpot(g.b, g.spot, 1) ? g.b : 0;
      if (w) { games.delete(keyOf(g.a, g.b)); const l = w === g.a ? g.b : g.a; api.emote("🏁 " + api.name(w) + " gets there first, chest heavin', and turns to watch " + api.name(l) + " come puffin' up behind. " + api.name(w) + " wins the race!", w); won(w, l, "race"); continue; }
    }
    if (now > g.until) { if (g.kind === "rps") settleRps(g); else { games.delete(keyOf(g.a, g.b)); for (const m of [g.a, g.b]) api.notice(m, "🏁 Nobody made it in time. Call it a draw, sugar."); } }
  }
  // the bell
  if (h.bell.until && now >= h.bell.until) settleTurnout();
  const hour = h.bell.hour === undefined ? 19 : h.bell.hour;
  if (!h.bell.off && new Date().getHours() === hour && h.bell.day !== api.dayKey() && api.here().some(onBooks)) ring();
}
function cmdBell(c) {
  const { sender, args, api: A } = c, h = H(), w = String(args[0] || "").toLowerCase();
  if (!A.isProprietor(sender)) return c.reply("🔔 Evenin' turn-out rings at " + (h.bell.hour === undefined ? 19 : h.bell.hour) + ":00" + (h.bell.off ? " (switched off right now)" : "") + ". Come out to the pasture when you hear it, sugar: there's a ribbon in it.");
  if (w === "now") return c.reply(ring() ? "🔔 Rung. Ten minutes for them to get to the pasture." : "There's no pasture spot yet, sugar. Stand in the pasture and say ?spot set pasture.");
  if (w === "hour" && /^\d{1,2}$/.test(args[1] || "") && Number(args[1]) < 24) { h.bell.hour = Number(args[1]); A.save(); return c.reply("🔔 Turn-out rings at " + h.bell.hour + ":00 from now on."); }
  if (w === "off" || w === "on") { h.bell.off = w === "off"; A.save(); return c.reply("🔔 Evenin' turn-out is " + (h.bell.off ? "off." : "on.")); }
  c.reply("🔔 Evenin' turn-out: " + (h.bell.off ? "OFF" : "on") + ", at " + (h.bell.hour === undefined ? 19 : h.bell.hour) + ":00 on my clock, at the " + (pastureSpot() || "pasture (not set: ?spot set pasture)") + " spot.\n?bell now · ?bell hour <0-23> · ?bell off|on");
}
export const herdCommands = {
  play: { usage: "play <who> [romp|rps|race]", run: cmdPlay },
  rps: { usage: "rps rock|paper|scissors", private: true, run: cmdRps },
  bell: { usage: "bell", private: true, run: cmdBell },
};
// a card while they're in a game of rock, paper, scissors: three buttons
export function herdCards(mn) {
  const g = gameOf(mn);
  if (g && g.kind === "rps" && !g.picks[mn]) return [{ title: "✊ Rock, paper, scissors", text: "Against " + api.name(g.a === mn ? g.b : g.a) + ". Pick one, only I see it.",
    buttons: [{ label: "✊ Rock", cmd: "rps rock", accent: true }, { label: "✋ Paper", cmd: "rps paper", accent: true }, { label: "✌️ Scissors", cmd: "rps scissors", accent: true }] }];
  if (g && g.kind === "race") return [{ title: "🏁 Race!", text: "First to stand on " + g.spot + " wins." }];
  return [];
}
export const HERD_GUIDE = " Play: ?play <who> (a romp, rock-paper-scissors or a race; they're asked first). Evenin' turn-out rings at 7 pm: come out to the pasture for a ribbon (proprietors: ?bell).";
