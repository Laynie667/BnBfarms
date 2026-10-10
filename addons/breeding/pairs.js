/* WHAT'S IN THIS FILE (breeding/pairs.js)
   Two things for the herd to do on their own (part of the Breeding add-on).

   • CALL A STUD: studs who want the work say ?studcall on. Anybody in heat (and ?breedable) says ?callstud, and
     every stud who's signed up and on the farm gets a private nudge with where they are. Once every 20 minutes.
   • MATES FOR THE DAY: ?mate <who> asks them; on a yes the two are mates till midnight. Breedin' your mate that
     day is likelier to take (a second roll of the dice), and the first time earns each of you a ribbon.
     ?mate shows yours · ?mate off ends it. One mate a day each.
*/
import { pick, fill } from "../_lib/connect.js";

let api = null, D = null;
export function pairsSetup(a, data) { api = a; D = data; }
const P = () => { const d = D(); d.pairs = d.pairs || { studs: {}, called: {}, day: "", mates: {}, paid: {} }; const p = d.pairs;
  if (p.day !== api.dayKey()) { p.day = api.dayKey(); p.mates = {}; p.paid = {}; }
  p.studs = p.studs || {}; p.called = p.called || {}; return p; };
const onBooks = (mn) => { const r = api.rec(mn); return !!(r && r.roles && r.roles.length); };
const whereIs = (mn) => { const z = api.zonesOf(mn)[0]; const q = api.pos(mn); return z ? "in " + z.name.replace(/-/g, " ") : q ? "at " + q.X + "," + q.Y : "on the farm"; };

const CALL_STUD = [
  "🔥 %name% is in heat %where% and callin' for a stud. Tail up, achin' for it. Go on, sugar.",
  "🔥 Somebody needs breedin': %name%, %where%, in heat and askin' for you studs by name. First one there gets her.",
  "🔥 %name%'s in season %where% and beggin' for a cock. You signed up for stud calls, so here's one.",
];
const CALLED = [
  "🔥 You lift your tail and call. %n% stud%s% heard you. Stay put and present, sugar.",
  "🔥 The call's gone out to %n% stud%s% on the farm. Somebody'll be along to see to you.",
];
const MATED = [
  "💞 %a% and %b% rub noses and it's settled: mates for the day. Anybody watchin' can guess what comes next.",
  "💞 %a% nuzzles up under %b%'s chin and gets nuzzled right back. Mates till midnight, those two.",
  "💞 %b% says yes. %a% and %b% are a pair today, flank to flank, and the farm girl chalks their names side by side on the barn door.",
];

function cmdStudcall(c) {
  const { sender, args, api: A } = c, p = P(), w = String(args[0] || "").toLowerCase();
  if (!onBooks(sender)) return c.reply("That's for folks on the farm's books, sugar.");
  if (w !== "on" && w !== "off") return c.reply("🐂 Stud calls are " + (p.studs[sender] ? "ON" : "off") + " for you. ?studcall on and I'll tell you when somebody in heat calls for a stud; ?studcall off to stop.");
  if (w === "on") p.studs[sender] = true; else delete p.studs[sender];
  A.save();
  c.reply(w === "on" ? "🐂 Stud calls ON. When somebody in heat says ?callstud, I'll tell you where they are." + (A.makesSemen(sender) ? "" : " (You'll need a cock for it to be much use, sugar.)") : "🐂 Stud calls off.");
}
function cmdCallstud(c) {
  const { sender, api: A } = c, p = P(), pr = A.prod(sender), r = A.rec(sender);
  if (!onBooks(sender) || !pr) return c.reply("That's for stock on the farm's books, sugar.");
  if (!r.breedable) return c.reply("You'd need ?breedable on before callin' a stud, sugar.");
  if (!A.inHeat(pr)) return c.reply("You're not in heat, sugar. A stud call's for when you're achin' for it.");
  if (!A.onMap(sender)) return c.reply("You've got to be here on the farm to be found, sugar.");
  if (Date.now() - (p.called[sender] || 0) < 20 * 60000) return c.reply("You called not long ago, sugar. Give the studs a chance to get to you.");
  const studs = A.here().filter((m) => m !== sender && p.studs[m] && A.makesSemen(m) && A.onMap(m));
  if (!studs.length) return c.reply("No stud on the farm is takin' calls right now, sugar. (Studs sign up with ?studcall on.)");
  p.called[sender] = Date.now(); A.save();
  const line = fill(pick(CALL_STUD), { name: A.name(sender), where: whereIs(sender) });
  for (const m of studs) A.notice(m, line);
  c.reply(fill(pick(CALLED), { n: studs.length, s: studs.length === 1 ? "" : "s" }));
}
function cmdMate(c) {
  const { sender, args, api: A } = c, p = P(), N = A.name, w = String(args[0] || "").toLowerCase();
  if (!onBooks(sender)) return c.reply("That's for folks on the farm's books, sugar.");
  if (!w) return c.reply(p.mates[sender] ? "💞 Your mate today is " + N(p.mates[sender]) + ". Breedin' each other is likelier to take, and the first time pays you both a ribbon. ?mate off ends it."
    : "💞 You've no mate today, sugar. ?mate <who> asks them. Mates last till midnight: breedin' your mate is likelier to take, and the first time pays you both a ribbon.");
  if (w === "off") {
    const m = p.mates[sender]; if (!m) return c.reply("You've no mate to part from, sugar.");
    delete p.mates[sender]; delete p.mates[m]; A.save();
    A.notice(m, "💔 " + N(sender) + " has wandered off. You're not mates any more today, sugar.");
    return c.reply("💔 You and " + N(m) + " aren't mates any more today.");
  }
  const t = A.find(args[0]);
  if (!t || !onBooks(t) || t === sender) return c.reply("Who, sugar? ?mate <who>, somebody on the farm's books.");
  if (p.mates[sender]) return c.reply("You've already got a mate today: " + N(p.mates[sender]) + ". ?mate off first, if you must.");
  if (p.mates[t]) return c.reply(N(t) + " is already somebody's mate today, sugar.");
  if (!A.onMap(sender) || !A.onMap(t)) return c.reply("You both need to be here on the farm, sugar.");
  A.ask(t, "💞 " + N(sender) + " wants to be your mate for the day, sugar: breedin' each other is likelier to take, and the first time pays you both a ribbon. Say yes or no.", (yes) => {
    const q = P();
    if (!yes) return A.notice(sender, N(t) + " said no to bein' your mate today, sugar.");
    if (q.mates[sender] || q.mates[t]) return A.notice(sender, "Too late, sugar: one of you paired off with somebody else.");
    q.mates[sender] = t; q.mates[t] = sender; A.save();
    A.emote(fill(pick(MATED), { a: N(sender), b: N(t) }), sender);
  });
  c.reply("💞 I've asked " + N(t) + ".");
}
// a load from one mate into the other: a second roll if it didn't take, and a ribbon each the first time
export function pairsBred(stud, dam, hole, mlIn, took) {
  if (!(stud > 0) || !(mlIn > 0)) return;
  const p = P();
  if (p.mates[stud] !== dam) return;
  if (!took && (hole === "vulva" || hole === "butt") && api.rollConception) {
    const again = api.rollConception(dam, stud, mlIn, 1, hole);
    if (again) api.later(() => api.emote("💞 Mates catch easier: a moment later somethin' settles deep in " + api.name(dam) + ". " + api.name(stud) + "'s seed took after all.", dam), 9000);
  }
  const key = stud < dam ? stud + ":" + dam : dam + ":" + stud;
  if (!p.paid[key]) { p.paid[key] = true; api.save(); if (api.ribbons) { api.ribbons(stud, 1, "breedin' your mate"); api.ribbons(dam, 1, "bein' bred by your mate"); } }
}
export const pairsCommands = {
  studcall: { usage: "studcall on|off", private: true, run: cmdStudcall },
  callstud: { usage: "callstud", private: true, run: cmdCallstud },
  mate: { usage: "mate <who>", private: true, run: cmdMate },
};
export function pairsCards(mn) {
  const p = P(), out = [];
  out.push({ title: "💞 Mates and stud calls", lines: [["Mate today", p.mates[mn] ? api.name(p.mates[mn]) : "nobody"]],
    toggles: [{ label: "Take stud calls", desc: "When somebody in heat says ?callstud, you're told where they are", on: !!p.studs[mn], cmd: "studcall " + (p.studs[mn] ? "off" : "on") }],
    buttons: [{ label: "Call a stud (in heat)", cmd: "callstud" }], input: { placeholder: "Bessie", label: "Ask to be mates", cmd: "mate" } });
  return out;
}
export const PAIRS_GUIDE = " Studs: ?studcall on to be told when somebody in heat says ?callstud. Mates for the day: ?mate <who> (breedin' your mate is likelier to take, and pays you both a ribbon).";
