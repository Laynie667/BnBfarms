/* WHAT'S IN THIS FILE (breeding/index.js)
   Breeding, an add-on for the farm bot: pregnancy stages, belly size, cravings, nesting, baby kicks,
   midwives, stud bookings and breeding week. It builds on the bot's own pregnancy (conception, due date,
   labour and birth stay in the bot).

   • Stages: early → showing → heavy → nesting, worked out from how far along they are. Each new stage
     gets a private note and a belly emote the people nearby see. Belly size 1–5 is on their Companion
     card (ready for custom belly art).
   • Cravings while showing and heavy, every 2–4 hours they're here, privately.
   • Baby kicks once they're heavy, every 20–40 minutes they're here, seen by whoever's nearby.
   • Midwife: during labour, staff ?midwife <who> standing next to them; the birth gets a midwife's
     touch and the midwife a staff point.
   • Stud bookings, no fee: only staff add them. ?book <stud> <who>, ?book, ?book done <#>.
     When both are on the farm, they're both told it's time.
   • Breeding season: the third week of each month (the 15th to the 21st). Everyone who said ?season on
     (and is breedable and fertile) comes into heat for it; studs near someone in heat get rutty.
     Signed-up studs fill half again faster all week and get pent up after 4 hours full (not a day).
     Every load in a signed-up dam's pussy goes in the season's stud book (from a stud, the ?use bench, or
     a glory stall stranger). Each night from 9 pm the stud book is read out to the farm, and on the last
     night the most-bred dam is crowned (10 ribbons) along with the busiest stud (5 ribbons).
*/
import { connect, pick, between, fill } from "../_lib/connect.js";
import { MORE } from "./more-lines.js";

let api = null;
function D() {
  const d = api.data();
  d.preg = d.preg || {};          // member → { stage, kickAt, craveAt }
  d.bookings = d.bookings || [];  // [{ id, stud, dam, by, at, told }]
  d.week = d.week || {};          // { month: "2026-10", started, said }
  d.optIn = d.optIn || {};        // breeding week opt-in
  d.scent = d.scent || {};        // stud → last rutty line
  return d;
}

// how far along, 0 to 1, and which stage
function along(p) { return p && p.preg ? Math.min(1, Math.max(0, (Date.now() - p.preg.since) / Math.max(1, p.preg.due - p.preg.since))) : null; }
const STAGES = [
  { at: 0, key: "early", label: "early days" },
  { at: 0.33, key: "showing", label: "showin'" },
  { at: 0.66, key: "heavy", label: "heavy with the litter" },
  { at: 0.9, key: "nesting", label: "nestin'" },
];
const stageOf = (f) => STAGES.filter((s) => f >= s.at).slice(-1)[0];
const bellySize = (f) => Math.min(5, 1 + Math.floor(f * 5));   // 1–5, for the belly art

const STAGE_LINES = {
  showing: { you: "🤰 Your belly's started to round out, %name%. Anybody lookin' can tell now.",
    room: "%name%'s belly has started to round out, soft and unmistakable. The litter's showin'." },
  heavy: { you: "🤰 You're heavy with it now, %name%: belly full and tight, the litter movin' inside you.",
    room: "%name% is heavy with the litter now, belly big and tight, and they move a little slower for it." },
  nesting: { you: "🤰 You're nestin', %name%. Restless, achy, and wantin' a soft corner of straw. It won't be long.",
    room: "%name% is restless and nestin', pawing straw into a pile and lowering themselves into it with a groan. It won't be long now." },
};
const CRAVINGS = [
  "You're cravin' somethin' salty somethin' fierce, %name%.", "All you can think about is a big bowl of warm milk, %name%.",
  "You'd do just about anything for somethin' sweet right now, %name%.", "You're achin' for a big, thick load, %name%. Funny what a litter does to you.",
  "You want to be held and rubbed, %name%. Your belly especially.", "You're starvin', %name%. Eatin' for a whole litter now.",
];
const KICKS = [
  "%name%'s belly jumps as the litter kicks hard enough to see from across the pen.",
  "A little foot pushes out against %name%'s tight belly, then rolls away. They gasp and rub the spot.",
  "%name%'s whole belly shifts and rolls as the litter turns over. They stop and breathe through it.",
  "Something kicks %name% right in the ribs. They wince and laugh and press a hand to it.",
];
const MIDWIFE = [
  "%by% kneels beside %name% in the straw, one hand on their belly and the other on their back, talking them through every push.",
  "%by% settles in as midwife, wiping %name%'s brow and guiding them through the next contraction.",
];
const RUTTY = [
  "The scent of somebody in heat drifts over, and %name%'s cock twitches. They breathe it in deep.",
  "%name% catches the smell of heat on the air and goes stiff and restless, nostrils flaring.",
  "%name% can't stop lookin' toward the scent of heat nearby. Their breathing's gone heavy.",
];

const isBreedWeek = (d = new Date()) => d.getDate() >= 15 && d.getDate() <= 21;
const NIGHT_HOUR = 21;                       // the stud book is read out from 9 pm (the bot's clock)
const PENT_H = 4;                            // in season, a signed-up stud full this long is pent up
const PRIZE = { dam: 10, stud: 5 };          // ribbons for the season's most-bred and busiest stud
const localDay = (d = new Date()) => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
const monthKey = (d = new Date()) => d.toISOString().slice(0, 7);
function weekEnd() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 22, 0, 0, 0).getTime(); }

// ── every heartbeat ────────────────────────────────────────
function tick() {
  const d = D(), now = Date.now(), here = api.here();
  for (const mn of here) {
    const p = api.prod(mn); if (!p) continue;
    const f = along(p);
    if (f === null) { delete d.preg[mn]; continue; }
    const x = d.preg[mn] = d.preg[mn] || { stage: "early" };
    const st = stageOf(f);
    if (st.key !== x.stage && STAGE_LINES[st.key]) {
      x.stage = st.key;
      api.notice(mn, fill(STAGE_LINES[st.key].you, { name: api.name(mn) }));
      if (api.onMap(mn)) api.emote("🤰 " + fill(pick([STAGE_LINES[st.key].room].concat((MORE.STAGE_ROOM || {})[st.key] || [])), { name: api.name(mn) }), mn);
      api.save();
    }
    if ((st.key === "showing" || st.key === "heavy") && now >= (x.craveAt || 0)) {
      if (x.craveAt) api.notice(mn, "🤰 " + fill(pick(CRAVINGS), { name: api.name(mn) }));
      x.craveAt = now + between(120, 240) * 60000;
    }
    if ((st.key === "heavy" || st.key === "nesting") && api.onMap(mn) && now >= (x.kickAt || 0)) {
      if (x.kickAt) api.emote("🤰 " + fill(pick(KICKS), { name: api.name(mn) }), mn);
      x.kickAt = now + between(20, 40) * 60000;
    }
  }
  bookingsTick(here);
  breedWeekTick(here);
}

// ── stud bookings ──────────────────────────────────────────
function bookingsTick(here) {
  const d = D(), set = new Set(here);
  for (const b of d.bookings) {
    if (b.told || !set.has(b.stud) || !set.has(b.dam) || !api.onMap(b.stud) || !api.onMap(b.dam)) continue;
    b.told = Date.now();
    api.notice(b.stud, "🐂 Your booking with " + api.name(b.dam) + " is up, sugar. They're here. Head for the breeding stand.");
    api.notice(b.dam, "🐄 " + api.name(b.stud) + " is here for your booking, sugar. Head for the breeding stand.");
    api.save();
  }
}
function cmdBook(c) {
  const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
  if (w === "done" || w === "remove" || w === "cancel") {
    const i = d.bookings.findIndex((b) => String(b.id) === String(args[1] || "").replace(/^#/, ""));
    if (i < 0) return c.reply("Which booking, sugar? ?book shows the numbers.");
    const b = d.bookings.splice(i, 1)[0]; A.save();
    if (w === "done") A.staffPoints(sender, 1, "booking");
    return c.reply("🐂 Booking #" + b.id + " (" + A.name(b.stud) + " × " + A.name(b.dam) + ") " + (w === "done" ? "done. Good work!" : "taken off the list."));
  }
  const stud = A.find(args[0]), dam = A.find(args[1]);
  if (!stud || !dam || !A.rec(stud) || !A.rec(dam)) return c.reply("Here's how, sugar: ?book <stud> <who>, like ?book Rex Bessie. ?book shows the list.");
  const rd = A.rec(dam);
  if (!rd.breedable || A.limitBlocks(dam, "breed")) return c.reply(A.name(dam) + " isn't breedable, hon, so they can't be booked.");
  if (d.bookings.some((b) => b.stud === stud && b.dam === dam)) return c.reply("That pair's already booked, sugar.");
  d.seq = (d.seq || 0) + 1;
  d.bookings.push({ id: d.seq, stud, dam, by: sender, at: Date.now(), told: 0 });
  A.save(); A.audit(sender, "BOOK", stud + "x" + dam);
  A.notice(stud, "🐂 You've been booked to breed " + A.name(dam) + ". I'll tell you when you're both on the farm.");
  A.notice(dam, "🐄 You've been booked with " + A.name(stud) + ". I'll tell you when you're both on the farm.");
  c.reply("🐂 Booked: #" + d.seq + " " + A.name(stud) + " × " + A.name(dam) + ".");
}
const bookingsText = () => {
  const b = D().bookings;
  return b.length ? "🐂 STUD BOOKINGS\n" + b.map((x) => "#" + x.id + " " + api.name(x.stud) + " × " + api.name(x.dam) + (x.told ? " · told, waitin' on 'em" : "")).join("\n")
    : "🐂 No stud bookings right now. Staff add them with ?book <stud> <who>.";
};

// ── breeding week: the 15th to the 21st ─────────────────────
function breedWeekTick(here) {
  const d = D(), now = new Date(), mk = monthKey(now);
  if (d.week.month !== mk) d.week = { month: mk };
  if (now.getDate() === 14 && !d.week.warned && here.length) {
    d.week.warned = true; api.announce("📅 Breedin' season starts tomorrow, y'all! Anybody who said ?season on comes into heat for it, and every breedin' goes in the stud book."); api.save();
  }
  if (!isBreedWeek(now)) { crownTick(here); return; }
  if (!d.week.said && here.length) {
    d.week.said = true;
    api.announce("🔥 It's breedin' season on the farm! Everybody signed up is comin' into heat, the studs are fillin' up fast, and every breedin' goes in the stud book. I read it out every night, and the most-bred gets crowned on the last one. 🐂");
    for (const mn of here) if (d.optIn[mn] && api.makesSemen(mn)) api.notice(mn, "🐂 Breedin' season's on, sugar. Your balls fill half again faster all week, and four hours full leaves you pent up. Go find somebody in heat.");
    api.save();
  }
  seasonPentTick(here);
  nightlyTick(here);
  d.week.heated = d.week.heated || {};
  for (const mn of here) {
    const r = api.rec(mn), p = api.prod(mn);
    if (!r || !p || !d.optIn[mn] || d.week.heated[mn] || !r.breedable || !r.fertile || api.limitBlocks(mn, "heat") || p.preg) continue;
    d.week.heated[mn] = true;
    api.startHeat(mn, api.ANON_STUD, Math.max(1, (weekEnd() - Date.now()) / 3600000));
    api.save();
  }
  // scent drift: a stud within 3 tiles of somebody in heat gets a rutty line now and then
  const inHeat = here.filter((mn) => api.prod(mn) && api.inHeat(api.prod(mn)) && !api.prod(mn).heat.quiet);   // a quiet heat isn't smelled
  if (!inHeat.length) return;
  for (const stud of here) {
    if (!api.makesSemen(stud) || inHeat.includes(stud) || Date.now() - (d.scent[stud] || 0) < 15 * 60000) continue;
    const sp = api.pos(stud);
    if (!sp || !inHeat.some((m) => { const q = api.pos(m); return q && Math.max(Math.abs(q.X - sp.X), Math.abs(q.Y - sp.Y)) <= 3; })) continue;
    d.scent[stud] = Date.now();
    api.privateEmote(stud, fill(pick(RUTTY), { name: api.name(stud) }));
  }
}

// ── breeding season: the stud book, pent-up studs, the crown ──
function season() {
  const d = D(), mk = monthKey();
  if (d.week.month !== mk) d.week = { month: mk };
  const w = d.week;
  w.bred = w.bred || {}; w.took = w.took || {}; w.covers = w.covers || {};
  return w;
}
// every load into somebody's pussy, from anywhere (the bot's fills, the bench, the glory stalls)
const BRED_MARKS = {
  3: ["The farm girl hangs a little red ribbon on %name%'s gate. Three breedin's this season, and countin'.",
    "%name% gets a chalk mark on the barn door for every breedin'. That's three now."],
  5: ["Five times bred this season. The farm girl ties a second ribbon on %name%'s gate and gives their belly a pat.",
    "%name%'s chalk marks on the barn door have reached five. Folks are startin' to notice."],
  10: ["Ten! The barn door's runnin' out of room for %name%'s chalk marks. That's a real breeder.",
    "Ten loads this season. The farm girl just shakes her head and hangs a whole bunch of ribbons on %name%'s gate."],
};
// more lines for the pools above (more-lines.js)
CRAVINGS.push(...MORE.CRAVINGS); KICKS.push(...MORE.KICKS); MIDWIFE.push(...MORE.MIDWIFE); RUTTY.push(...MORE.RUTTY);
for (const k of Object.keys(MORE.BRED_MARKS)) BRED_MARKS[k].push(...MORE.BRED_MARKS[k]);
function onBred(stud, dam, hole, mlIn, took) {
  if (hole !== "vulva" || !isBreedWeek() || !D().optIn[dam] || !(mlIn > 0)) return;
  const w = season();
  w.bred[dam] = (w.bred[dam] || 0) + 1;
  if (took) w.took[dam] = (w.took[dam] || 0) + 1;
  if (stud > 0 && stud !== dam && D().optIn[stud]) w.covers[stud] = (w.covers[stud] || 0) + 1;
  api.save();
  const lines = BRED_MARKS[w.bred[dam]];
  if (lines && api.onMap(dam)) api.later(() => api.emote("🔥 " + fill(pick(lines), { name: api.name(dam) }), dam), 6000);
}
function rankList(o, n, unit) {
  return Object.entries(o).filter(([m]) => Number(m) > 0).sort((a, b) => b[1] - a[1]).slice(0, n)
    .map(([m, v], i) => "  " + (["🥇", "🥈", "🥉"][i] || (i + 1) + ".") + " " + api.name(Number(m)) + ", " + v + " " + unit(v)).join("\n");
}
function bookText(night) {
  const w = season();
  const dams = rankList(w.bred, 5, (v) => v === 1 ? "time" : "times"), studs = rankList(w.covers, 3, (v) => v === 1 ? "cover" : "covers");
  const caught = Object.keys(w.took).filter((m) => Number(m) > 0).map((m) => api.name(Number(m)));
  const head = "📖 THE STUD BOOK" + (night ? ", night " + night + " of breedin' season" : "");
  if (!dams && !studs) return head + "\nNot one breedin' in it yet. Y'all are slackin'. 🐂";
  return head + "\n🐄 Most bred\n" + (dams || "  (nobody yet)") + "\n🐂 Busiest studs\n" + (studs || "  (nobody yet)") +
    (caught.length ? "\n🍼 Caught this season: " + caught.join(", ") : "");
}
// signed-up studs: pent up after 4 hours full, not a whole day
function seasonPentTick(here) {
  const d = D(), now = Date.now();
  for (const mn of here) {
    if (!d.optIn[mn] || !api.makesSemen(mn)) continue;
    const p = api.prod(mn);
    if (!p || p.pentUp || !p.semenFullSince || now - p.semenFullSince < PENT_H * 3600000) continue;
    p.pentUp = true; api.save();
    api.notice(mn, "😤 Breedin' season's got you achin', " + api.name(mn) + ". You're all pent up: the next load's a big, potent one.");
  }
}
// the stud book goes to everybody on the farm: a card in the panel for Companion users, a private line otherwise
// (an older bot without privateSay/hasCompanion just announces it)
function readOut(here, text) {
  if (!api.hasCompanion || !api.privateSay) return api.announce(text);
  for (const mn of here) { if (api.hasCompanion(mn)) api.notice(mn, text); else api.privateSay(mn, text); }
}
// each night from 9 pm, the stud book is read out (the last night's reading crowns the winners)
function nightlyTick(here) {
  const w = season(), now = new Date();
  if (!here.length || now.getHours() < NIGHT_HOUR || w.readDay === localDay(now)) return;
  if (now.getDate() === 21) { crownTick(here, true); return; }
  w.readDay = localDay(now); api.save();
  readOut(here, bookText(now.getDate() - 14));
}
function crownTick(here, lastNight) {
  const d = D(), w = season(), now = new Date();
  if (w.prized || !w.said || !here.length) return;
  if (!lastNight && now.getDate() < 22) return;
  w.prized = true; w.readDay = localDay(now);
  const top = (o) => Object.entries(o).filter(([m]) => Number(m) > 0).sort((a, b) => b[1] - a[1] || ((w.took[b[0]] || 0) - (w.took[a[0]] || 0)))[0];
  const dam = top(w.bred), stud = top(w.covers);
  if (!dam) { api.save(); readOut(here, "📖 Breedin' season's over, and not a single breedin' made the stud book. Next month, y'all. 🐂"); return; }
  const champ = { month: w.month, dam: Number(dam[0]), times: dam[1], stud: stud ? Number(stud[0]) : 0, covers: stud ? stud[1] : 0 };
  d.champions = (d.champions || []).concat(champ).slice(-12);
  api.save();
  readOut(here, bookText(7) + "\n\n👑 That's the season, y'all! " + api.name(champ.dam) + " is the farm's most-bred, " + champ.times + " times" +
    (champ.stud ? ", and " + api.name(champ.stud) + " the busiest stud with " + champ.covers : "") + ". Ribbons for the winners! 🐂");
  if (api.ribbons) api.ribbons(champ.dam, PRIZE.dam, "bein' the most-bred of breedin' season", true);
  if (champ.stud && api.ribbons) api.ribbons(champ.stud, PRIZE.stud, "bein' the busiest stud of breedin' season", true);
  if (api.onMap(champ.dam)) api.later(() => api.emote("👑 The farm girl pins a big blue rosette on " + api.name(champ.dam) + "'s collar: most bred of the season. Their belly's earned it.", champ.dam), 4000);
  api.audit(api.cfg.BOT_MEMBER, "SEASON", w.month + " " + champ.dam + "x" + champ.times + (champ.stud ? " stud " + champ.stud + "x" + champ.covers : ""));
}

// ── midwives and births ────────────────────────────────────
function cmdMidwife(c) {
  const { sender, args, api: A } = c;
  const t = A.find(args[0]), p = t && A.prod(t);
  if (!t || !p) return c.reply("Who's birthin', sugar? ?midwife <who>, standin' next to them.");
  if (!p.labour) return c.reply(A.name(t) + " isn't in labour, hon. I'll let staff know when they are.");
  const me = A.pos(sender), them = A.pos(t);
  if (!me || !them || Math.max(Math.abs(me.X - them.X), Math.abs(me.Y - them.Y)) > 1) return c.reply("Get right down next to " + A.name(t) + " to help, sugar.");
  p.labour.midwife = sender; A.save();
  A.emote("🍼 " + fill(pick(MIDWIFE), { name: A.name(t), by: A.name(sender) }), t);
}
function onBirth(mn) {
  const d = D(); delete d.preg[mn];
  // the bot clears p.labour right before the birth, so the midwife is remembered by watchLabour()
  const m = d.lastMidwife && d.lastMidwife[mn];
  if (m) {
    api.staffPoints(m, 2, "midwife");
    if (api.onMap(mn)) api.emote("🍼 " + api.name(m) + " cleans the newborns and tucks them against " + api.name(mn) + ", every one of them healthy. Good work, midwife.", mn);
    delete d.lastMidwife[mn];
  }
  api.save();
}
// remember who's midwifing (the bot drops p.labour right before the birth)
function watchLabour() {
  const d = D(); d.lastMidwife = d.lastMidwife || {};
  for (const mn of api.here()) { const p = api.prod(mn); if (p && p.labour && p.labour.midwife) d.lastMidwife[mn] = p.labour.midwife; }
}

// ── commands and Companion cards ───────────────────────────
function cmdBreedweek(c) {
  const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
  if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar.");
  if (w === "book" || w === "top" || w === "board") return c.reply(bookText() + (isBreedWeek() ? "" : "\n(Breedin' season is the 15th to the 21st.)") + champText());
  if (w === "on" || w === "off") {
    if (w === "on") d.optIn[sender] = true; else delete d.optIn[sender];
    A.save();
    const rs = A.rec(sender);
    return c.reply(w === "on" ? "🔥 You're in for breedin' season (the 15th to the 21st each month). " +
        (A.makesSemen(sender) ? "Your balls fill faster that week and you get pent up quicker. " : "") +
        (rs.breedable && rs.fertile ? "You'll come into heat for it. " : rs.breedable ? "Say ?fertile on to come into heat for it. " : "Say ?breedable on (and ?fertile on) to come into heat for it. ") +
        "Every time you're bred goes in the stud book, read out to the farm each night."
      : "Breedin' season: you're out. No heat, and you're not in the stud book.");
  }
  const w0 = season();
  c.reply("🔥 Breedin' season is the 15th to the 21st each month" + (isBreedWeek() ? ", and it's on right now!" : ".") + " You're " + (d.optIn[sender] ? "in" : "out") +
    " (?season on / off). ?season book shows the stud book." +
    (isBreedWeek() && d.optIn[sender] ? "\nYou've been bred " + (w0.bred[sender] || 0) + " times this season" + (A.makesSemen(sender) ? " and covered " + (w0.covers[sender] || 0) : "") + "." : "") + champText());
}
function champText() {
  const c = (D().champions || []).slice(-1)[0];
  return c ? "\n👑 Last season's most-bred: " + api.name(c.dam) + " (" + c.times + ")" + (c.stud ? " · busiest stud: " + api.name(c.stud) + " (" + c.covers + ")" : "") : "";
}
function companion(mn) {
  const r = api.rec(mn); if (!r) return null;
  const d = D(), p = api.prod(mn), f = along(p), cards = [];
  if (f !== null) {
    const st = stageOf(f), days = Math.max(0, Math.ceil((p.preg.due - Date.now()) / 86400000));
    cards.push({ title: "Expectin'", bars: [{ label: "Along", value: Math.round(f * 100) + "%", pct: f * 100, kind: "good" }],
      lines: [["Stage", st.label], ["Belly size", bellySize(f) + " of 5"], ["Due", days ? "in " + days + " day" + (days === 1 ? "" : "s") : "any time now"], ["Sired by", p.preg.sires.map(api.name).join(" & ")]] });
  }
  const w = season(), seasonLines = isBreedWeek() && d.optIn[mn] ? [["Bred this season", String(w.bred[mn] || 0)]].concat(api.makesSemen(mn) ? [["Covers this season", String(w.covers[mn] || 0)]] : []) : undefined;
  cards.push({ title: "Breedin' season", note: "The 15th to the 21st each month. You come into heat for it if you're breedable and fertile; studs fill faster. Every breedin' goes in the stud book, read out each night, and the most-bred is crowned on the last one.",
    lines: seasonLines,
    toggles: [{ label: "Join breedin' season", on: !!d.optIn[mn], cmd: "season " + (d.optIn[mn] ? "off" : "on") }],
    chips: isBreedWeek() ? [{ text: "on now", kind: "alert" }] : undefined, buttons: [{ label: "My pedigree", cmd: "pedigree" }, { label: "Stud book", cmd: "season book" }] });
  const mine = d.bookings.filter((b) => b.stud === mn || b.dam === mn);
  if (mine.length) cards.push({ title: "My bookings", lines: mine.map((b) => ["#" + b.id, api.name(b.stud) + " × " + api.name(b.dam)]) });
  if (api.isStaff(mn)) cards.push({ staff: true, title: "Stud bookings", text: bookingsText(), input: { placeholder: "Rex Bessie", label: "Book (stud, who)", cmd: "book" } });
  return { cards };
}

connect({
  name: "breeding",
  label: "Breeding",
  version: "1.1.0",
  guide: "Pregnancy now has stages (early, showin', heavy, nestin') with a belly size 1–5, cravings, and kicks nearby people can see. " +
    "Breedin' season is the 15th–21st of each month: ?season on to come into heat for it (studs fill faster and get pent up sooner). Every breedin' goes in the stud book, read out each night from 9 pm; the most-bred is crowned on the last night (10 ribbons, 5 for the busiest stud). ?season book shows it. Staff: ?book <stud> <who>, ?book, ?book done <#>, and ?midwife <who> during labour.",
  setup(a) { api = a; D(); },
  commands: {
    // ?book lists them (anyone) · staff: ?book <stud> <who> adds one, ?book done|remove <#>
    book: { usage: "book [<stud> <who>]", aliases: ["bookings"], private: true, run: (c) => {
      if (!c.args.length) return c.reply(bookingsText());
      if (!c.api.isStaff(c.sender)) return c.reply("Only staff add stud bookings, sugar. ?book shows the list.");
      cmdBook(c);
    } },
    // the "Expectin'" card, for people without the Companion
    belly: { usage: "belly", private: true, run: (c) => {
      const t = c.args[0] ? c.api.find(c.args[0]) : c.sender, p = t && c.api.prod(t), f = along(p);
      if (f === null) return c.reply((t === c.sender ? "You're" : c.api.name(t) + " is") + " not expectin' right now, sugar.");
      const days = Math.max(0, Math.ceil((p.preg.due - Date.now()) / 86400000));
      c.reply("🤰 " + c.api.name(t) + ": " + stageOf(f).label + " · belly size " + bellySize(f) + " of 5 · " + Math.round(f * 100) + "% along · due " +
        (days ? "in " + days + " day" + (days === 1 ? "" : "s") : "any time now") + " · sired by " + p.preg.sires.map(c.api.name).join(" & "));
    } },
    season: { usage: "season on|off|book", aliases: ["breedweek", "studbook"], private: true, run: cmdBreedweek },
    midwife: { usage: "midwife <who>", rank: "staff", run: cmdMidwife },
  },
  on: { tick: () => { watchLabour(); tick(); }, birth: onBirth, bred: onBred },
  // signed-up studs fill half again faster during breedin' season
  rates: { semen: (mn) => (isBreedWeek() && D().optIn[mn] ? 1.5 : 1) },
  companion,
});
