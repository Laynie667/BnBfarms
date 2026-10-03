/* WHAT'S IN THIS FILE (glory-stalls/index.js)
   Glory stalls, an add-on for the farm bot. Runs on the bot's computer next to the bot script.

   Setup (herdmasters): build little walled booths in the room's map editor (walls block sight), then set
     glory-1          the tile inside booth 1, where the stock stands
     glory-1-visitor  the tile outside the hole
   …and glory-2, glory-2-visitor, and so on. The Companion's Zones tab can place them by clicking the map.

   What happens:
   • Someone who said ?glory on stands on glory-1 and nobody's on glory-1-visitor: every 10–30 minutes a
     random ~5 minute scene plays out for them in private emotes (scenes.js). The stranger is never named.
     It counts: their load count, the cum they're holding, their tally, the stall's count, and their herd
     leader's staff score. A pussy finish can take if they're breedable and fertile.
   • A real visitor on glory-1-visitor pauses the scenes and can ?stall use mouth|pussy|ass.
   • Shifts: ?stall shift 60 (yourself), staff: ?stall shift <who> <minutes>.
   • Punishment shifts (staff): ?stall punish <who> <minutes> sends them to a free stall, with scenes
     every 5–15 minutes. Only for people who said ?glory on.
   • ?stalls is the board. Nobody but staff sees who's in which stall.
   Everything respects their limits and what's blocked (a gag, chastity, a plug); a funnel gag counts as a
   mouth.
*/
import { connect, pick, between, fill } from "../_lib/connect.js";
import { SCENES, TAUNTS } from "./scenes.js";

const HOLE_WORDS = { mouth: "mouth", vulva: "pussy", butt: "ass" };
const holeFrom = (w) => {
  w = String(w || "").toLowerCase();
  if (/^(mouth|throat|oral)$/.test(w)) return "mouth";
  if (/^(pussy|vulva|cunt|vagina)$/.test(w)) return "vulva";
  if (/^(ass|butt|anus|anal)$/.test(w)) return "butt";
  return null;
};

let api = null;
const running = new Map();   // stall id → { mn, scene, i, deg, ml }
const prompted = new Map();  // visitor → stall they were told about (so it's said once)

// ── saved data ─────────────────────────────────────────────
function D() {
  const d = api.data();
  d.optIn = d.optIn || {};       // member → true
  d.people = d.people || {};     // member → { day, today, total, holes:{mouth,vulva,butt}, ml }
  d.stalls = d.stalls || {};     // stall → { day, today, total, next }
  d.shifts = d.shifts || {};     // member → { until, by, punish }
  return d;
}
const today = () => api.dayKey();
function bump(obj, n) { if (obj.day !== today()) { obj.day = today(); obj.today = 0; } obj.today += n; obj.total = (obj.total || 0) + n; }

// ── the stalls on the map ──────────────────────────────────
function stallIds() {
  return Object.keys(api.spots()).map((n) => (/^glory-([a-z0-9]+)$/.exec(n) || [])[1]).filter(Boolean)
    .sort((a, b) => (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0) || a.localeCompare(b));
}
const occupantOf = (id) => api.whoOnSpot("glory-" + id, 0)[0] || null;
const visitorOf = (id) => api.whoOnSpot("glory-" + id + "-visitor", 0)[0] || null;
const stallOf = (mn) => stallIds().find((id) => api.onSpot(mn, "glory-" + id, 0)) || null;
const visitorStallOf = (mn) => stallIds().find((id) => api.onSpot(mn, "glory-" + id + "-visitor", 0)) || null;

// holes the stranger can use right now (respectin' gags, chastity, plugs; a funnel gag is open)
function openHoles(mn) {
  return api.HOLES.filter((h) => (h !== "vulva" || api.hasVulva(mn)) && !api.holeBlocked(mn, h));
}
// can scenes run on them at all? null = yes, otherwise why not
function whyNot(mn) {
  const r = api.rec(mn);
  if (!r) return "you're not on the farm's books yet";
  if (!D().optIn[mn]) return "you haven't said ?glory on";
  if (api.limitBlocks(mn, "breed")) return "your limits rule it out";
  if (!openHoles(mn).length) return "everything's covered up (gag, chastity or plug)";
  return null;
}

// ── a scene, beat by beat ──────────────────────────────────
function startScene(id, mn) {
  const holes = openHoles(mn);
  const scenes = SCENES.filter((s) => holes.includes(s.hole));
  if (!scenes.length) return;
  const scene = pick(scenes);
  const deg = !!(api.rec(mn) || {}).degradeMe;
  running.set(id, { mn, scene, i: 0, deg, funnel: scene.hole === "mouth" && api.funnelOn(mn) });
  api.log("stall " + id + ": " + scene.id + " for " + mn);
  step(id);
}
function step(id) {
  const run = running.get(id);
  if (!run) return;
  const { mn, scene } = run;
  // they stepped off the stall: the stranger gives up, nothin' counted
  if (!api.onSpot(mn, "glory-" + id, 0)) {
    running.delete(id);
    api.privateEmote(mn, "Behind you, the stranger at stall " + id + " grumbles at the empty hole and wanders off.");
    return;
  }
  const beat = scene.beats[run.i];
  if (!beat) { running.delete(id); scheduleNext(id, mn); return; }
  const line = (run.funnel && beat.f) || (run.deg && beat.d) || beat.t;
  api.privateEmote(mn, fill(line, { name: api.name(mn) }));
  if (beat.finish) finish(id, mn, scene.hole, between(18, 45));
  else if (run.deg && Math.random() < 0.3 && run.i > 0) api.later(() => running.get(id) === run && api.privateEmote(mn, fill(pick(TAUNTS), { name: api.name(mn) })), 9000);
  run.i++;
  api.later(() => step(id), between(22, 32) * 1000);
}

// the finish counts everywhere: their record, the stall, the herd leader's score, maybe a pregnancy
function finish(id, mn, hole, ml) {
  const d = D(), p = api.prod(mn);
  if (p) {
    p.held[hole] = (p.held[hole] || 0) + ml;
    p.totals.received = (p.totals.received || 0) + ml;
    p.last = p.last || Date.now();
  }
  api.tally(mn);
  const me = d.people[mn] = d.people[mn] || { holes: {}, ml: 0 };
  bump(me, 1); me.holes[hole] = (me.holes[hole] || 0) + 1; me.ml = (me.ml || 0) + ml;
  bump(d.stalls[id] = d.stalls[id] || {}, 1);
  const leader = api.herdLeaderOf(mn);
  if (leader) api.staffPoints(leader, 1, "glory");
  const r = api.rec(mn);
  if (hole === "vulva" && r && r.breedable && r.fertile && !api.limitBlocks(mn, "breed")) {
    const took = api.rollConception(mn, api.ANON_STUD, ml);
    if (took === "new") api.later(() => api.notice(mn, "🍼 A warm, heavy feelin' settles low in your belly… somethin' from the stalls took, sugar. (?stats shows it)"), 20000);
  }
  api.save();
}

// next scene: 10–30 minutes (5–15 on a punishment shift)
function scheduleNext(id, mn) {
  const sh = D().shifts[mn], pun = sh && sh.punish && sh.until > Date.now();
  const s = D().stalls[id] = D().stalls[id] || {};
  s.next = Date.now() + (pun ? between(5, 15) : between(10, 30)) * 60000;
  api.save();
}

// ── every heartbeat (about 20 s) ───────────────────────────
function tick() {
  const d = D(), now = Date.now();
  // shifts endin'
  for (const [mn, sh] of Object.entries(d.shifts)) {
    if (sh.until > now) continue;
    delete d.shifts[mn];
    api.notice(Number(mn), "🕳️ Your " + (sh.punish ? "punishment " : "") + "shift in the glory stalls is over, sugar. You can step out.");
    api.save();
  }
  for (const id of stallIds()) {
    if (running.has(id)) continue;
    const mn = occupantOf(id), s = d.stalls[id] = d.stalls[id] || {};
    if (!mn) { s.next = 0; s.who = 0; continue; }
    // somebody new just stepped in
    if (s.who !== mn) {
      s.who = mn;
      const why = whyNot(mn);
      if (why) { api.notice(mn, "🕳️ This is glory stall " + id + ", but nothin' will happen here: " + why + "."); s.next = Infinity; continue; }
      s.next = now + between(2, 5) * 60000;
      api.notice(mn, "🕳️ You're in glory stall " + id + ". Somebody will come along soon. Step off the spot whenever you want to stop.");
      continue;
    }
    if (s.next === Infinity) { if (!whyNot(mn)) s.next = now + 60000; continue; }   // they opted in or took the gag off
    // a real visitor at the hole pauses the scenes; tell 'em how it works, once
    const v = visitorOf(id);
    if (v && v !== mn) {
      if (prompted.get(v) !== id) { prompted.set(v, id); api.notice(v, "🕳️ Stall " + id + " is occupied. ?stall use mouth, ?stall use pussy or ?stall use ass. Whoever's inside never learns your name."); }
      continue;
    }
    if (now >= (s.next || 0) && !whyNot(mn)) startScene(id, mn);
  }
  for (const [v, id] of prompted) if (!api.onSpot(v, "glory-" + id + "-visitor", 0)) prompted.delete(v);
}

// ── commands ───────────────────────────────────────────────
function cmdGlory(c) {
  const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
  if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar. ?apply gets you started.");
  if (w === "on" || w === "off") {
    if (w === "on") d.optIn[sender] = true; else delete d.optIn[sender];
    A.save();
    return c.reply(w === "on"
      ? "🕳️ Glory stalls: ON. Stand on a glory stall spot and strangers will use you, and staff can put you on punishment shifts. Your limits and whatever's locked on you still count. ?glory off any time."
      : "🕳️ Glory stalls: OFF. Nothin' will happen to you in the stalls, and nobody can put you on a punishment shift.");
  }
  const me = d.people[sender];
  c.reply("🕳️ Glory stalls: " + (d.optIn[sender] ? "ON" : "OFF") + " (?glory on / ?glory off)" +
    (me ? "\nToday: " + (me.day === today() ? me.today : 0) + " · all time: " + (me.total || 0) +
      " (mouth " + (me.holes.mouth || 0) + ", pussy " + (me.holes.vulva || 0) + ", ass " + (me.holes.butt || 0) + ")" : "") +
    (d.shifts[sender] ? "\nOn " + (d.shifts[sender].punish ? "a punishment " : "") + "shift for " + Math.ceil((d.shifts[sender].until - Date.now()) / 60000) + " more minutes." : ""));
}

function board(staff) {
  const d = D(), ids = stallIds();
  if (!ids.length) return "🕳️ No glory stalls are set up yet. Herdmasters: ?spot set glory-1 inside the booth and ?spot set glory-1-visitor outside the hole.";
  return "🕳️ GLORY STALLS\n" + ids.map((id) => {
    const s = d.stalls[id] || {}, mn = occupantOf(id), n = s.day === today() ? s.today : 0;
    const sh = mn && d.shifts[mn];
    return "Stall " + id + ": " + (mn ? (staff ? api.name(mn) : "occupied") + (running.has(id) ? " · busy right now" : "") : "empty") +
      " · " + n + " today" + (staff && sh ? " · " + (sh.punish ? "punishment " : "") + "shift, " + Math.ceil((sh.until - Date.now()) / 60000) + " min left" : "");
  }).join("\n");
}

function cmdStall(c) {
  const { sender, args, api: A } = c, d = D(), sub = String(args[0] || "").toLowerCase(), staff = A.isStaff(sender);
  if (!sub || sub === "board") return c.reply(board(staff));

  if (sub === "use") {
    const id = visitorStallOf(sender);
    if (!id) return c.reply("Stand on a stall's visitor spot first, sugar (glory-1-visitor and so on).");
    const mn = occupantOf(id);
    if (!mn || mn === sender) return c.reply("Stall " + id + " is empty right now, hon.");
    if (whyNot(mn)) return c.reply("Stall " + id + " isn't takin' visitors right now, sugar.");
    if (running.has(id)) return c.reply("Somebody else is busy at stall " + id + ". Give 'em a few minutes.");
    const hole = holeFrom(args[1]) || pick(openHoles(mn));
    if (!openHoles(mn).includes(hole)) return c.reply("That one's blocked off at stall " + id + ". Try " + openHoles(mn).map((h) => HOLE_WORDS[h]).join(" or ") + ".");
    if (A.makesSemen(sender) && A.holeBlocked(sender, "penis")) return c.reply("You're locked up, sugar. Can't use the stall like that.");
    const sp = A.prod(sender);
    const load = A.makesSemen(sender) && sp ? A.drainSemen(sender, Math.max(sp.semen * A.cfg.PROD.LOAD_SHARE, Math.min(sp.semen, A.cfg.PROD.MIN_LOAD))) : 0;
    if (sp && load) sp.totals.given = (sp.totals.given || 0) + load;
    const w = HOLE_WORDS[hole];
    A.privateEmote(sender, "You step up to stall " + id + " and use the " + w + " waiting at the hole until you finish" + (load ? ", leaving " + A.ml(load) + " behind" : "") + ". Nobody inside knows who you are.");
    A.privateEmote(mn, "Someone real steps up to the hole this time. They use your " + w + " without a word, steady and greedy, until they finish" + (load ? " deep inside" : "") + " and walk away. You never see who.");
    finish(id, mn, hole, load);
    scheduleNext(id, mn);
    A.audit(sender, "USE", "stall " + id);
    return;
  }

  if (sub === "shift") {
    // ?stall shift <minutes> (yourself) · staff: ?stall shift <who> <minutes>
    let who = sender, minArg = args[1];
    if (args[2] !== undefined || (args[1] && isNaN(parseInt(args[1], 10)))) {
      if (!staff) return c.reply("Only staff put somebody else on a shift, sugar. ?stall shift <minutes> puts yourself on one.");
      who = A.find(args[1]); minArg = args[2];
    }
    const mins = parseInt(minArg, 10);
    if (!who || !A.rec(who)) return c.reply("Who's that, hon? ?stall shift <who> <minutes>.");
    if (!(mins >= 10 && mins <= 240)) return c.reply("How long, sugar? 10 to 240 minutes, like ?stall shift 60.");
    if (!d.optIn[who]) return c.reply(A.name(who) + " hasn't said ?glory on, so they can't be put on a shift.");
    d.shifts[who] = { until: Date.now() + mins * 60000, by: sender, punish: false };
    A.save(); A.audit(sender, "SHIFT", who + " " + mins + "m");
    if (who !== sender) A.notice(who, "🕳️ " + A.name(sender) + " put you on a " + mins + " minute shift in the glory stalls. Find an empty stall, sugar.");
    return c.reply("🕳️ " + (who === sender ? "You're" : A.name(who) + " is") + " on a " + mins + " minute stall shift.");
  }

  if (sub === "punish") {
    if (!staff) return c.reply("Punishment shifts are for staff to hand out, sugar.");
    const who = A.find(args[1]), mins = parseInt(args[2], 10);
    if (!who || !A.rec(who)) return c.reply("Here's how: ?stall punish <who> <minutes>, like ?stall punish Bessie 30.");
    if (!(mins >= 10 && mins <= 240)) return c.reply("How long, sugar? 10 to 240 minutes.");
    if (!d.optIn[who]) return c.reply(A.name(who) + " hasn't said ?glory on, so they can't be sent to the stalls. Pick another punishment.");
    const free = stallIds().find((id) => !occupantOf(id));
    d.shifts[who] = { until: Date.now() + mins * 60000, by: sender, punish: true };
    A.save(); A.audit(sender, "PUNISH", who + " " + mins + "m");
    if (free && A.onMap(who)) A.teleport(who, A.spot("glory-" + free), true);
    A.notice(who, "🕳️ " + A.name(sender) + " sentenced you to " + mins + " minutes in the glory stalls" + (free ? ", stall " + free : ". Find a free stall") +
      ". Strangers come more often on a punishment shift. Your safeword still works.");
    return c.reply("🕳️ " + A.name(who) + " is on a " + mins + " minute punishment shift" + (free ? " in stall " + free : " (no stall's free right now, they'll have to wait for one)") + ".");
  }

  if (sub === "release" || sub === "end") {
    const who = args[1] ? A.find(args[1]) : sender;
    if (who !== sender && !staff) return c.reply("Only staff end somebody else's shift, sugar.");
    if (!who || !d.shifts[who]) return c.reply((who === sender ? "You're" : A.name(who) + " isn't") + (who === sender ? " not on a shift, hon." : " on a shift, hon."));
    if (who === sender && d.shifts[who].punish) return c.reply("You can't let yourself off a punishment shift, sugar. Ask staff, or use your safeword if you need out.");
    delete d.shifts[who]; A.save();
    if (who !== sender) A.notice(who, "🕳️ " + A.name(sender) + " let you off your stall shift.");
    return c.reply("🕳️ Shift ended.");
  }
  c.reply("?stalls shows the board · ?stall use mouth|pussy|ass (from a visitor spot) · ?stall shift <minutes>" +
    (staff ? " · ?stall shift <who> <minutes> · ?stall punish <who> <minutes> · ?stall release <who>" : ""));
}

// ── safeword: everything stops for them, right away ────────
function onSafe(mn) {
  const d = D();
  for (const [id, run] of running) if (run.mn === mn) { running.delete(id); const s = d.stalls[id] = d.stalls[id] || {}; s.next = Date.now() + 60 * 60000; }
  if (d.shifts[mn]) delete d.shifts[mn];
  api.save();
}

// ── the Companion's "Farm extras" cards ────────────────────
function companion(mn) {
  const d = D(), r = api.rec(mn);
  if (!r) return null;
  const me = d.people[mn], sh = d.shifts[mn], cards = [];
  cards.push({
    title: "Glory stalls",
    toggles: [{ label: "Strangers can use me in the stalls", desc: "Also lets staff give you punishment shifts. Your limits and whatever's locked on you still count.", on: !!d.optIn[mn], cmd: "glory " + (d.optIn[mn] ? "off" : "on") }],
    lines: me ? [["Today", me.day === today() ? me.today : 0], ["All time", me.total || 0], ["Mouth · pussy · ass", (me.holes.mouth || 0) + " · " + (me.holes.vulva || 0) + " · " + (me.holes.butt || 0)]] : undefined,
    chips: sh ? [{ text: (sh.punish ? "punishment shift" : "on shift") + " · " + Math.max(0, Math.ceil((sh.until - Date.now()) / 60000)) + " min", kind: sh.punish ? "alert" : "acc" }] : undefined,
    buttons: [{ label: "The board", cmd: "stalls" }],
  });
  if (api.isStaff(mn) && stallIds().length) {
    cards.push({ title: "Stall board", text: board(true), input: { placeholder: "Bessie 30", label: "Punish (who, minutes)", cmd: "stall punish" },
      buttons: [{ label: "Refresh", cmd: "stalls" }] });
  }
  return { cards };
}

connect({
  name: "glory-stalls",
  label: "Glory stalls",
  version: "1.0.0",
  guide: "Stand on a glory stall spot (glory-1, glory-2…) after ?glory on, and strangers come by every 10–30 minutes. " +
    "Each visit is about five minutes of private emotes only you see, and it counts on your record. A real visitor on the stall's visitor spot can ?stall use mouth|pussy|ass. " +
    "?stalls is the board. Staff: ?stall shift <who> <minutes>, ?stall punish <who> <minutes>, ?stall release <who>. Step off the spot to stop; ?safe always works.",
  setup(a) { api = a; D(); },
  commands: {
    glory: { private: true, run: cmdGlory },
    stall: { private: true, run: cmdStall },
    stalls: { private: true, run: (c) => c.reply(board(c.api.isStaff(c.sender))) },
  },
  on: { tick, safe: onSafe },
  companion,
});
