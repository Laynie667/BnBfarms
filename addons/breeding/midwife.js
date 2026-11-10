/* WHAT'S IN THIS FILE (breeding/midwife.js)
   MIDWIVES (Nov 10). Laynie: "Midwifes need a way to check progress, speed labor along, variable messages per species".
   Who: staff, and anybody a herdmaster or proprietor trusts with it (?midwives add <who>; ?midwives shows them).

   • ?checkup <who>, standin' next to them: how far along, how long to go, how they're carryin', and a guess at how many
     that sharpens the further along they are (too soon to tell → at least two → three, maybe four → exact). The
     midwife hears it privately, the room sees hands on the belly, and the one carryin' is told what was found.
     On for everybody; ?checkup off keeps hands off you (?checkup on lets them back). ?checkup on your own: a rough feel.
     A staff point for each one checked, once a day.
   • ?midwife <who>:
       – in labour: the first time takes the job. Every time after (once every HELP_GAP_MIN, any midwife) coaches, rubs,
         holds or helps them push, and takes MIDWIFE_HELP_MIN off the labour. A stuck one: it turns it instead.
       – just birthed (within AFTER_MIN): tends them, and their milk comes in fresh a day longer.
       – carryin', not in labour yet: a checkup.
   • ?induce <who>: once they're nestin', a midwife can bring labour on. They're asked first; the one who brought it on
     is their midwife.
   • When labour starts, staff on duty and trusted midwives on the farm get called; a stuck one calls them again.
   • At the birth: the midwife's staff points grow with how much they helped (2, and one more for every help, four at
     most, and one for turnin' a stuck one). Trusted midwives who aren't staff get ribbons instead. Two helps or more
     and the one who birthed gets a ribbon for a smooth birthin'.
   • The Expectin' card: staff (in the Staff panel) and trusted midwives see who's carryin' on the farm, how far along,
     when they're due, who's in labour right now (and whether one's stuck), and when each was last checked.
*/
import { pick, fill, lineFor, animalOf, untag } from "../_lib/connect.js";

let api = null, D = null, POOLS = { claim: [], born: [] };
export function midwifeSetup(a, data, pools) { api = a; D = data; POOLS = Object.assign(POOLS, pools || {}); }
const HELP_GAP_MIN = 3, AFTER_MIN = 60;
const M = () => {
  const d = D(); d.mw = d.mw || {};
  for (const k of ["trusted", "noCheck", "checked", "paid", "helpAt", "born", "labour"]) d.mw[k] = d.mw[k] || {};
  return d.mw;
};
export const canMidwife = (mn) => !!(mn && (api.rank(mn) >= 1 || M().trusted[mn]));
const near = (a, b) => { const p = api.pos(a), q = api.pos(b); return !!(p && q && Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y)) <= 1); };
const along = (p) => p && p.preg ? Math.min(1, Math.max(0, (Date.now() - p.preg.since) / Math.max(1, p.preg.due - p.preg.since))) : null;
const stageKey = (f) => f < 0.33 ? "early" : f < 0.66 ? "showing" : f < 0.9 ? "heavy" : "nesting";
const STAGE_WORD = { early: "early days", showing: "showin'", heavy: "heavy with it", nesting: "nestin'" };

// their kind's words, from the bot (10y2b-birthing.js) when it has them
function vars(mn, by, extra) {
  const an = animalOf(api, mn), L = api.labour, y = (L && L.young) ? L.young(mn) : an.young, p = api.prod(mn), n = (p && p.preg && p.preg.count) || 1;
  return Object.assign({ name: api.name(mn), by: by ? api.name(by) : "", young: y[0], youngs: y[1], brood: n > 1 ? y[1] : y[0],
    place: L && L.place ? L.place(mn) : "the birthin' straw", sound: L && L.sound ? L.sound(mn) : an.sound }, extra || {});
}
const line = (mn, pool, key, by, extra) => fill(lineFor(api, mn, pool, "mw:" + key), vars(mn, by, extra));

// ── the lines ──────────────────────────────────────────────
// %name% the one carryin' · %by% the midwife · %young% one of their kind's young, %youngs% many, %brood% whichever
// they're carryin' · %sound% a noise their kind makes · %place% where their kind births
const CHECKUP = [
  "%by% kneels beside %name% and lays both hands flat on their belly, feelin' slow and careful for the %brood%.",
  "%by% presses an ear to %name%'s swollen belly, listenin', one hand rubbin' slow circles.",
  "%by% runs practiced hands over %name%'s belly, pressin' here and there, judgin' how high they're carryin'.",
  "%by% has %name% lie back in the straw and feels along their belly from top to bottom, hummin' to themselves.",
  "%by% cups the underside of %name%'s belly and gives it a gentle heft, weighin' what's in there.",
  "%by% checks %name% over the way a good hand checks stock: belly, teats, hips, then a pat on the rump.",
  "%by% spreads warm hands on %name%'s belly and waits. Somethin' in there kicks right back, and %by% grins.",
];
const SELF_CHECK = [
  "%name% sits back in the straw with both hands on their belly, feelin' for the %brood%.",
  "%name% rubs slow circles on their own belly, pressin' gently, tryin' to feel what's in there.",
];
const CARRY = {
  early: ["carryin' small yet, hardly a swell", "barely showin', just a little firmness low down"],
  showing: ["carryin' high and round", "belly firm and high, and growin' nicely"],
  heavy: ["carryin' heavy and wide", "belly big and tight, and plenty movin' in there"],
  nesting: ["dropped low and heavy, any time now", "sittin' low, belly hard, ready to come"],
};
const HELP = [
  "%by% gets behind %name% and holds them up under the arms. \"Breathe with me. Now push, long and slow.\"",
  "%by% digs the heel of their hand into the small of %name%'s back, right where it aches, and the next push goes deeper.",
  "%by% counts %name% through the push, one hand flat on their belly, feelin' it work. \"That's it. That's it. Good.\"",
  "%by% presses warm cloths low on %name%'s belly and talks them through it, soft and steady.",
  "%by% kneels between %name%'s knees, watchin', coachin'. \"I can see it movin'. One more like that.\"",
  "%by% lets %name% grip both their hands through a long one, and doesn't flinch when they squeeze.",
  "%by% strokes the sweaty hair back off %name%'s face and murmurs to them, and %name% pushes harder for it.",
  "%by% presses on the top of %name%'s belly in time with the push, helpin' it down.",
  "%name% lets out %sound% and bears down with everything, %by% right there holdin' them.",
  "%by% rolls %name%'s nipples slow between finger and thumb, and the next squeeze comes harder and quicker for it.",
  "%by% rocks %name%'s hips side to side through the squeeze, openin' them up, coaxin' the %brood% lower.",
];
const UNSTICK = [
  "%by% slicks their hand and reaches in slow and gentle, feelin' for the stuck %young%. A careful turn, a long groan from %name%, and it comes round right. \"There. Now push.\"",
  "%by% presses on %name%'s belly from outside with both hands, coaxin' the %young% round, slow, slow, till it shifts. \"Got it. Push, sugar.\"",
  "%by% has %name% up on all fours, rocks their hips side to side, and works the %young% round with patient hands till it lines up.",
];
const INDUCE = [
  "%by% rubs %name%'s belly low and firm, workin' slow circles, and brings them a cup of the farm's bitter labour tea. It isn't long before the first real squeeze comes.",
  "%by% walks %name% up and down the barn, hands on their hips, then has them squat and rock. The %brood% drops low. Their body's ready.",
  "%by% kneads the base of %name%'s belly and rolls their nipples between finger and thumb till %name% gasps. That does it: here comes the first squeeze.",
];
const AFTER = [
  "%by% cleans %name% up with warm water and soft cloths, then kneads their swollen breasts till the milk lets down in a rush.",
  "%by% props %name% up in fresh straw, brings them water, and rubs their achin' belly while they nurse the %brood%.",
  "%by% kneads %name%'s heavy breasts slow and firm, coaxin' the milk in, then tucks a blanket round them. Good work, sugar.",
  "%by% washes %name% down, checks them over gentle, and sits with them a while, hand on their emptied belly, till they doze.",
];
const CALL = [
  "🍼 %name% has gone into labour in %place%. Midwives wanted: ?midwife %name%, standin' next to them.",
  "🍼 Labour's started: %name%, in %place%. A midwife's hands would help. ?midwife %name%, right beside them.",
];
const STUCK_CALL = [
  "🍼 %name% has one stuck, turned crossways! A midwife's hands, quick: ?midwife %name%, standin' next to them.",
  "🍼 %name%'s labour has stalled on a stuck %young%. Anybody who can midwife: ?midwife %name%, right beside them.",
];

// ── what a checkup finds ───────────────────────────────────
function timeLeft(p) {
  const ms = p.preg.due - Date.now(); if (ms <= 0) return "past their time";
  const h = ms / 3600000;
  if (h < 24) { const r = Math.max(1, Math.round(h)); return "due within " + r + " hour" + (r === 1 ? "" : "s"); }
  const dd = Math.round(h / 24); return "about " + dd + " day" + (dd === 1 ? "" : "s") + " to go";
}
function countGuess(mn, f, n, rough) {
  const v = vars(mn);
  if (f < 0.33) return "too soon to feel how many";
  if (rough && f < 0.9) return "can't tell how many on your own";
  if (f < 0.66) return n === 1 ? "just the one, by the feel of it" : "more than one in there, at least two";
  if (f < 0.9) {
    if (n <= 2) return n === 1 ? "one " + v.young + ", by the feel of it" : "two, by the feel of it";
    const lo = n - (Math.random() < 0.5 ? 1 : 0); return "feels like " + lo + ", maybe " + (lo + 1);
  }
  return n === 1 ? "one " + v.young + ", sure as anything" : n + " " + v.youngs + ", every one countable now";
}
// rough: what they can feel for themselves (no count till they're nestin', no sires)
function findings(mn, rough, forThem) {
  const p = api.prod(mn), f = along(p), n = p.preg.count || 1, k = stageKey(f);
  const parts = [STAGE_WORD[k] + ", " + timeLeft(p), p.preg.due <= Date.now() ? "more than ready" : pick(CARRY[k]), countGuess(mn, f, n, rough)];
  if (p.preg.via === "butt") parts.push("carried in the ass, high and snug");
  if (p.preg2) parts.push("and a second litter in the other hole");
  if (!rough && !forThem) parts.push("bred by " + p.preg.sires.map(api.name).join(" & "));
  return parts.map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(". ") + ".";
}

function doCheckup(c, by, t, lead) {
  const m = M();
  if (api.onMap(t)) api.emote("🩺 " + line(t, CHECKUP, "checkup", by), t);
  c.reply("🩺 " + (lead || "") + "Checkup on " + api.name(t) + ": " + findings(t, false, false));
  api.notice(t, "🩺 " + api.name(by) + " gave you a checkup: " + findings(t, false, true));
  m.checked[t] = { at: Date.now(), by };
  const key = by + ":" + t;
  if (m.paid[key] !== api.dayKey()) { m.paid[key] = api.dayKey(); if (api.isStaff(by)) api.staffPoints(by, 1, "checkup"); }
  api.save();
}

// ── commands ───────────────────────────────────────────────
function cmdCheckup(c) {
  const { sender, args } = c, w = String(args[0] || "").toLowerCase(), m = M();
  if (w === "off" || w === "on") {
    if (w === "off") m.noCheck[sender] = true; else delete m.noCheck[sender];
    api.save();
    return c.reply(w === "off" ? "🩺 No checkups on you, sugar. ?checkup on lets the midwives' hands back." : "🩺 Midwives can check you over again, sugar. ?checkup off stops it.");
  }
  const t = args[0] ? api.find(args[0]) : sender;
  if (!t) return c.reply("Who am I checkin', sugar? ?checkup <who>, standin' next to them.");
  const p = api.prod(t);
  if (t === sender) {
    if (!p || !p.preg) return c.reply("You're not carryin' right now, sugar.");
    if (api.onMap(t)) api.emote("🩺 " + line(t, SELF_CHECK, "self"), t);
    return c.reply("🩺 What you can feel: " + findings(t, true, true));
  }
  if (!canMidwife(sender)) return c.reply("Checkups are for staff and the midwives they trust, sugar. ?midwives shows who.");
  if (!p || !p.preg) return c.reply(api.name(t) + " isn't carryin' right now, hon.");
  if (m.noCheck[t]) return c.reply(api.name(t) + " has said no checkups, sugar.");
  if (p.labour) return c.reply(api.name(t) + " is in labour right now! ?midwife " + api.name(t) + " to help 'em through it.");
  if (!near(sender, t)) return c.reply("Get right down next to " + api.name(t) + " to feel, sugar.");
  doCheckup(c, sender, t);
}

function cmdMidwife(c) {
  const { sender, args } = c, m = M();
  const t = args[0] ? api.find(args[0]) : null, p = t && api.prod(t);
  if (!t || !p) return c.reply("Who's birthin', sugar? ?midwife <who>, standin' next to them.");
  if (!canMidwife(sender)) return c.reply("Midwifin' is for staff and the midwives they trust, sugar. ?midwives shows who.");
  if (t === sender) return c.reply("You can't midwife yourself, sugar. ?checkup on your own gives you a feel.");
  const lb = p.labour, now = Date.now();
  if (!lb) {
    const born = m.born[t];
    if (born && now - born.at < AFTER_MIN * 60000 && !born.tended) {
      if (!near(sender, t)) return c.reply("Get right down next to " + api.name(t) + " to tend 'em, sugar.");
      born.tended = sender;
      p.freshUntil = Math.max(p.freshUntil || now, now) + 86400000;   // their milk comes in fresh a day longer
      if (api.onMap(t)) api.emote("🍼 " + line(t, AFTER, "after", sender), t);
      if (api.isStaff(sender)) api.staffPoints(sender, 1, "midwife");
      api.notice(t, "🍼 " + api.name(sender) + " tended you after the birth. Your milk'll stay fresh and heavy a day longer.");
      api.save();
      return c.reply("🍼 You tended " + api.name(t) + ". Their milk'll stay fresh a day longer.");
    }
    if (p.preg) {
      if (m.noCheck[t]) return c.reply(api.name(t) + " isn't in labour yet, and they've said no checkups, sugar.");
      if (!near(sender, t)) return c.reply(api.name(t) + " isn't in labour yet. Get right down next to 'em for a checkup, sugar.");
      return doCheckup(c, sender, t, "Not in labour yet, so you give 'em a checkup. ");
    }
    return c.reply(api.name(t) + " isn't carryin', hon. The midwives get called when somebody goes into labour.");
  }
  if (!near(sender, t)) return c.reply("Get right down next to " + api.name(t) + " to help, sugar.");
  const rec = m.labour[t] = m.labour[t] || { helpers: {} };
  rec.helpers = rec.helpers || {};
  if (!lb.midwife) {
    lb.midwife = sender; rec.midwife = sender;
    api.emote("🍼 " + line(t, POOLS.claim, "claim", sender), t);
    api.save();
    return c.reply("🍼 You're " + api.name(t) + "'s midwife. Stay by 'em, and ?midwife " + api.name(t) + " every few minutes to help 'em along.");
  }
  if (!rec.midwife) rec.midwife = lb.midwife;
  const k = sender + ":" + t, wait = (m.helpAt[k] || 0) + HELP_GAP_MIN * 60000 - now;
  if (wait > 0) return c.reply("Let 'em catch their breath, sugar. You can help again in " + (wait > 90000 ? Math.ceil(wait / 60000) + " minutes" : "a moment") + ".");
  if (!api.labour) {   // (an older bot: the midwife's there, but can't hurry anything)
    api.emote("🍼 " + line(t, HELP, "help", sender), t);
    return c.reply("🍼 You help " + api.name(t) + " through it.");
  }
  m.helpAt[k] = now;
  rec.helpers[sender] = (rec.helpers[sender] || 0) + 1;
  if (lb.stuck) {
    api.labour.unstick(t, sender); rec.turned = sender;
    api.emote("🍼 " + line(t, UNSTICK, "unstick", sender), t);
    api.save();
    return c.reply("🍼 You turned it. " + api.name(t) + "'s movin' again.");
  }
  const left = api.labour.help(t);
  api.emote("🍼 " + line(t, HELP, "help", sender), t);
  api.save();
  c.reply("🍼 That helped. " + (left == null ? "" : left <= 4 ? "Nearly there." : "About " + left + " minutes to go."));
}

function cmdInduce(c) {
  const { sender, args } = c;
  const t = args[0] ? api.find(args[0]) : null, p = t && api.prod(t);
  if (!canMidwife(sender)) return c.reply("Bringin' labour on is for staff and the midwives they trust, sugar.");
  if (!t || !p || !p.preg) return c.reply("Who's ready to birth, sugar? ?induce <who>, standin' next to them.");
  if (t === sender) return c.reply("Ask a midwife to bring it on for you, sugar.");
  if (p.labour) return c.reply(api.name(t) + " is already in labour, hon. ?midwife " + api.name(t) + " to help.");
  const f = along(p);
  if (f < 0.9) return c.reply("Too soon, sugar: " + api.name(t) + " is only " + STAGE_WORD[stageKey(f)] + ". Wait till they're nestin'.");
  if (!api.labour) return c.reply("The farm girl can't bring labour on yet, sugar: she needs updatin'.");
  if (!near(sender, t)) return c.reply("Get right down next to " + api.name(t) + " first, sugar.");
  c.reply("🩺 I've asked " + api.name(t) + " if they're ready to birth.");
  api.ask(t, "🩺 " + api.name(sender) + " wants to bring your labour on now, sugar. Ready to birth? Say yes or no.", (yes) => {
    if (!yes) { api.notice(sender, "🩺 " + api.name(t) + " isn't ready yet. Let 'em be, sugar."); return; }
    const pp = api.prod(t); if (!pp || !pp.preg || pp.labour) return;
    if (!api.onMap(t)) { api.notice(sender, "🩺 " + api.name(t) + " said yes, but they're not on the farm anymore."); return; }
    api.emote("🩺 " + line(t, INDUCE, "induce", sender), t);
    api.labour.start(t);
    const lb = api.prod(t).labour;
    if (lb) lb.midwife = sender;
    M().labour[t] = { midwife: sender, helpers: {}, induced: true };
    api.save();
  });
}

function cmdMidwives(c) {
  const { sender, args } = c, m = M(), w = String(args[0] || "").toLowerCase();
  if (w === "add" || w === "remove" || w === "off") {
    if (api.rank(sender) < 2) return c.reply("Only herdmasters and proprietors trust somebody with midwifin', sugar.");
    const t = args[1] ? api.find(args[1]) : null;
    if (!t || !api.rec(t)) return c.reply("Who, sugar? ?midwives " + w + " <who> (they need to be on the farm's books).");
    if (w === "add") {
      m.trusted[t] = { by: sender, at: Date.now() }; api.save();
      api.notice(t, "🩺 " + api.name(sender) + " trusts you as one of the farm's midwives now, sugar: ?checkup <who> to feel how far along somebody is, ?midwife <who> to see 'em through labour, ?induce <who> once they're nestin'.");
      return c.reply("🩺 " + api.name(t) + " is a farm midwife now.");
    }
    delete m.trusted[t]; api.save();
    return c.reply("🩺 " + api.name(t) + " isn't a farm midwife anymore" + (api.isStaff(t) ? " (staff can always midwife, though)" : "") + ".");
  }
  const names = Object.keys(m.trusted).map((x) => api.name(Number(x)));
  c.reply("🩺 Midwives: every member of staff" + (names.length ? ", plus " + names.join(", ") : "") + "." +
    (api.rank(sender) >= 2 ? " ?midwives add <who> / remove <who>." : ""));
}

export const midwifeCommands = {
  checkup: { usage: "checkup [<who>|on|off]", private: true, run: cmdCheckup },
  midwife: { usage: "midwife <who>", private: true, run: cmdMidwife },
  induce: { usage: "induce <who>", private: true, run: cmdInduce },
  midwives: { usage: "midwives [add|remove <who>]", private: true, run: cmdMidwives },
};

// ── the bot's labour events ────────────────────────────────
// staff on duty, and trusted midwives on the farm who aren't staff
function callMidwives(mn, text) {
  try { api.notifyStaff(untag(text), true); } catch (e) { /* an older bot */ }
  const m = M();
  for (const x of api.here()) if (m.trusted[x] && !api.isStaff(x) && x !== mn) api.notice(x, text);
}
export function midwifeLabour(mn, info) {
  const m = M(); m.labour[mn] = m.labour[mn] || { helpers: {} };
  api.save();
  callMidwives(mn, line(mn, CALL, "call", 0, { place: (info && info.place) || vars(mn).place }));
}
export function midwifeStuck(mn) { callMidwives(mn, line(mn, STUCK_CALL, "stuckcall")); }
export function midwifeBirth(mn, kids, sires, info) {
  const m = M(), rec = m.labour[mn] || {}, d = D();
  delete m.labour[mn];
  const mw = rec.midwife || (info && info.midwife) || (d.lastMidwife && d.lastMidwife[mn]) || 0;
  if (d.lastMidwife) delete d.lastMidwife[mn];
  m.born[mn] = { at: Date.now(), midwife: mw && mw !== api.cfg.BOT_MEMBER ? mw : 0 };
  const helpers = Object.assign({}, rec.helpers || {});
  if (mw && mw !== api.cfg.BOT_MEMBER && helpers[mw] == null) helpers[mw] = 0;
  let helps = 0;
  for (const [h, n0] of Object.entries(helpers)) {
    const hm = Number(h), n = Number(n0) || 0, turned = rec.turned === hm ? 1 : 0; helps += n;
    if (api.isStaff(hm)) { const pts = (hm === mw ? 2 : 0) + Math.min(4, n) + turned; if (pts > 0) api.staffPoints(hm, pts, "midwife"); }
    else if (api.ribbons && (n > 0 || hm === mw)) api.ribbons(hm, 1 + (n >= 3 ? 1 : 0), "midwifin' " + api.name(mn));
  }
  if (helps >= 2 && api.ribbons) api.ribbons(mn, 1, "a smooth birthin'");
  if (mw && mw !== api.cfg.BOT_MEMBER && api.onMap(mn) && POOLS.born.length) api.later(() => api.emote(line(mn, POOLS.born, "born", mw), mn), 8000);
  api.save();
}
// tidy what's left over: births long past, helps long ago
export function midwifeTick() {
  const m = M(), now = Date.now();
  for (const [k, b] of Object.entries(m.born)) if (now - b.at > 2 * AFTER_MIN * 60000) delete m.born[k];
  for (const [k, at] of Object.entries(m.helpAt)) if (now - at > 3600000) delete m.helpAt[k];
  for (const mn of Object.keys(m.labour)) { const p = api.prod(Number(mn)); if (!p || (!p.labour && !p.preg)) delete m.labour[mn]; }
}

// ── the Expectin' card, for staff and trusted midwives ─────
function ago(t) { const mins = Math.round((Date.now() - t) / 60000); return mins < 60 ? mins + " min ago" : mins < 1440 ? Math.round(mins / 60) + " h ago" : Math.round(mins / 1440) + " d ago"; }
export function midwifeCard(viewer) {
  if (!canMidwife(viewer)) return null;
  const m = M(), rows = [], buttons = [];
  const carrying = api.here().map((mn) => [mn, api.prod(mn)]).filter(([, p]) => p && p.preg)
    .sort((a, b) => (b[1].labour ? 1 : 0) - (a[1].labour ? 1 : 0) || a[1].preg.due - b[1].preg.due);
  for (const [mn, p] of carrying.slice(0, 12)) {
    const nm = api.name(mn);
    if (p.labour) {
      const left = Math.max(0, Math.ceil((p.labour.until - Date.now()) / 60000));
      rows.push([nm, "🍼 in labour" + (p.labour.stuck ? ", one's stuck!" : ", about " + left + " min to go") + (p.labour.midwife ? " · midwife " + api.name(p.labour.midwife) : " · no midwife yet")]);
      if (buttons.length < 4) buttons.push({ label: (p.labour.stuck ? "Turn it: " : "Help ") + nm, cmd: "midwife " + nm });
    } else {
      const f = along(p), ck = m.checked[mn];
      rows.push([nm, STAGE_WORD[stageKey(f)] + " · " + timeLeft(p) + " · " + (m.noCheck[mn] ? "no checkups" : ck ? "checked " + ago(ck.at) : "not checked yet")]);
      if (buttons.length < 4 && !m.noCheck[mn]) buttons.push({ label: "Checkup " + nm, cmd: "checkup " + nm });
    }
  }
  return { staff: api.isStaff(viewer), title: "🩺 Expectin' on the farm",
    note: "Stand right beside them first. ?checkup <who> · ?midwife <who> in labour (again every few minutes helps it along) · ?induce <who> once they're nestin'.",
    lines: rows.length ? rows : [["Nobody", "nobody carryin' on the farm right now"]], buttons: buttons.length ? buttons : undefined };
}

export const MIDWIFE_GUIDE = " Midwives (staff, and anybody a herdmaster trusts with ?midwives add <who>): ?checkup <who> feels how far along somebody is and how many; ?midwife <who> sees them through labour (again every few minutes helps it along, and turns a stuck one) and tends them after; ?induce <who> brings labour on once they're nestin', if they say yes. ?checkup off: no checkups on you.";
