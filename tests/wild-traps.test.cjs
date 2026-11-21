// WILD TRAPS (Nov 20). Laynie: "What if trap spots place and move themselves at random? more when a hunt is active?",
// then "id like for the spots I have set to stay as is, but 3-8 roaming spots would be great. the barn and pasture
// mostly, and receiving." and no warning: "they hit harder, more ruthlessly, and by suprise with much much heavier
// consequences. Id even let the gear remain til removed by someone else."
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const S = (mn, name, extra) => Object.assign({ mn, name, roles: ["LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", trapsOn: true, breedable: true, fertile: true }, extra || {});
// a made-up farm (not the real map): zones grouped like the real one's, a safe pen inside the barn, and a few spots
const ZONES = { barn: { a: { X: 24, Y: 2 }, b: { X: 14, Y: 2 }, group: "barn" }, barn1: { a: { X: 14, Y: 4 }, b: { X: 24, Y: 12 }, group: "barn" },
  barnsafe: { a: { X: 15, Y: 5 }, b: { X: 18, Y: 8 }, group: "barnsafe" }, pasture: { a: { X: 26, Y: 14 }, b: { X: 38, Y: 2 }, group: "pasture" },
  receiving: { a: { X: 14, Y: 16 }, b: { X: 22, Y: 20 }, group: "receiving" }, office: { a: { X: 26, Y: 16 }, b: { X: 34, Y: 20 }, group: "office" } };
const SPOTS = { "trap-snare": { X: 5, Y: 5 }, "door-barn": { X: 20, Y: 2 }, "milking-1": { X: 21, Y: 9 }, "pond": { X: 3, Y: 30 } };
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: { "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] },
  "500": S(500, "Moo"), "501": S(501, "Bea"), "502": S(502, "Cass"), "503": S(503, "Dot"), "504": S(504, "Eve"), "600": S(600, "Fay", { trapsOn: false }) },
  applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: SPOTS, zones: ZONES });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const at = (m, X, Y, name) => ({ MemberNumber: m, Name: name, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
const moo = at(500, 10, 10, 'Moo'), fay = at(600, 11, 11, 'Fay');
const chars = [at(260239, 1, 1, 'Farm'), at(221397, 2, 2, 'Laynie'), moo, fay];
const evts = {};
const walls = new Set(); for (let x = 14; x <= 24; x++) walls.add(x + ',12');   // (a wall along the barn's back)
const W = { document: doc, addEventListener(e, f) { (evts[e] = evts[e] || []).push(f); }, dispatchEvent(ev) { (evts[ev.type] || []).forEach(f => f(ev)); },
  CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } }, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => { sent.push([ev, d]); }, ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239], MapData: { Type: 'Always' } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [], ChatRoomMapViewPositionIsBlocked: (x, y) => walls.has(x + ',' + y) };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const L = () => W.FarmhandLedger(), P = mn => L().people[mn];
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Whisper', Content: msg, Target: 260239 }); await wait(ms || 900); };
const reply = (n, mn) => sent.slice(n).filter(([e, d]) => e === 'ChatRoomChat' && d && d.Type === 'Whisper' && d.Target === mn).map(([, d]) => String(d.Content)).join('\n');
const move = (c, X, Y) => { c.MapData.Pos = { X, Y }; handlers.ChatRoomSyncMapData({ MemberNumber: c.MemberNumber, MapData: { Pos: { X, Y } } }); };
const done = async () => { for (let i = 0; i < 600; i++) { await wait(60); if (!(W.__st().trapRuns && W.__st().trapRuns.has(500))) break; } await wait(400); };
const inZ = (z, p) => p.X >= Math.min(z.a.X, z.b.X) && p.X <= Math.max(z.a.X, z.b.X) && p.Y >= Math.min(z.a.Y, z.b.Y) && p.Y <= Math.max(z.a.Y, z.b.Y);
const companion = (mn, d) => handlers.ChatRoomMessage({ Sender: mn, Type: 'Hidden', Content: 'FarmhandMsg', Dictionary: Object.assign({ v: 2 }, d) });
(async () => {
  await wait(3500);
  const cfg = W.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 1; cfg.TRAP_BEAT_S = 0.03; cfg.CHAIN_CHANCE = 0; cfg.WILD.CHAIN = 0; cfg.AFTER_CHANCE = 0;
  await say(500, '?stats', 400);

  // ── where they go, and how many ──
  W.__wildTick();
  let ws = W.__wild();
  ok(ws.length === 3, 'three wild traps out with one person in the room with traps on (' + ws.length + ')');
  const allowed = ['barn', 'pasture', 'receiving'];
  let bad = [];
  for (let k = 0; k < 40; k++) {   // (placed again and again: never anywhere it shouldn't be)
    for (const w of ws) w.moveAt = 0; W.__wildTick(); ws = W.__wild();
    for (const w of ws) {
      const p = { X: w.X, Y: w.Y };
      if (!allowed.includes(w.g)) bad.push('group ' + w.g);
      if (!Object.values(ZONES).some(z => allowed.includes(z.group) && inZ(z, p))) bad.push('outside ' + JSON.stringify(p));
      if (inZ(ZONES.barnsafe, p)) bad.push('barnsafe ' + JSON.stringify(p));
      if (walls.has(p.X + ',' + p.Y)) bad.push('wall');
      if (Object.values(SPOTS).some(s => Math.max(Math.abs(s.X - p.X), Math.abs(s.Y - p.Y)) <= 1)) bad.push('by a spot ' + JSON.stringify(p));
    }
  }
  ok(!bad.length, 'always in the barn, the pasture or receiving: never a wall, the safe barn, the office, or on or beside a spot (' + bad.slice(0, 3).join('; ') + ')');
  const groups = {}; for (let k = 0; k < 60; k++) { for (const w of W.__wild()) { w.moveAt = 0; } W.__wildTick(); for (const w of W.__wild()) groups[w.g] = (groups[w.g] || 0) + 1; }
  ok(groups.barn > groups.receiving && groups.pasture > groups.receiving && groups.receiving > 0, 'the barn and the pasture most, receiving less (' + JSON.stringify(groups) + ')');
  ok(SPOTS['trap-snare'] && L().spots['trap-snare'].X === 5, 'the trap tiles you set stay just as they are');
  // more people with traps on: more of them, eight at most; eight in a hunt
  for (const [mn, nm] of [[501, 'Bea'], [502, 'Cass'], [503, 'Dot'], [504, 'Eve']]) chars.push(at(mn, 1, 20 + mn - 500, nm));
  W.__wildTick();
  ok(W.__wild().length === 5, 'five people with traps on: five wild traps (' + W.__wild().length + ')');
  L().hunt = { until: Date.now() + 600000, goal: 'pasture', done: [] };
  W.__wildTick();
  const now = Date.now();
  ok(W.__wild().length === 8 && W.__wild().every(w => w.moveAt - now <= 3 * 60000 + 1000), 'a hunt: eight, and each movin\' on within three minutes');
  L().hunt = null; chars.splice(4); W.__wildTick();
  ok(W.__wild().length === 3, 'back to three when the hunt\'s over and the room\'s quiet');
  // movin' on when it's due
  const w0 = W.__wild()[0], was = w0.X + ',' + w0.Y; w0.moveAt = 0; W.__wildTick();
  ok(w0.X + ',' + w0.Y !== was || w0.moveAt > Date.now(), 'one that\'s due moves to another tile');

  // ── it has them: no warnin', no breather ──
  const r = P(500); r.trapAt = Date.now() - 2 * 60000; r.spotTrapAt = {}; r.gear = {};
  const w1 = W.__wild()[0], pos = w1.X + ',' + w1.Y, area1 = w1.g, n0 = (r.trapLog || []).length;
  let n = sent.length; move(moo, w1.X, w1.Y); await wait(50);
  ok(W.__wildOn(500), 'step on one two minutes after the last trap: it has them at once, breather or no');
  await done();
  ok((P(500).trapLog || []).length === n0 + 1, '...it springs a trap on them');
  const told = sent.slice(n).map(([, d]) => String(d && d.Content || '')).join(' ');
  ok(/Nobody set this one|wasn't there|never sees it|only a board|isn't straw|nothin' on that tile|ground that was solid/.test(told), '...with a line that says it came out of nowhere');
  ok(W.__wild()[0].X + ',' + W.__wild()[0].Y !== pos, '...and it\'s somewhere else now');
  ok(!W.__wildOn(500), '...and it stops hittin\' harder once it lets them go');
  const g = Object.values(P(500).gear || {});
  ok(g.length > 0 && g.every(x => x.keep && x.src === 'wild' && x.until > Date.now() + 7 * 86400000), 'what it left on them stays: no time on it, till somebody else takes it off (' + g.map(x => x.label).join(', ') + ')');
  // a whole kit from the place it hid (Nov 20: "definitely could use more complete, restrictive sets")
  const KITS = W.__farmSets().WILD_KITS, kit = (KITS[area1] || []).find(k => k.pieces.every(p => g.some(x => x.label === p.label)));
  ok(!!kit && g.length >= 5 && P(500).wildKit === kit.name, 'what it leaves is a whole kit from ' + area1 + ' (' + (kit ? kit.name + ', ' + g.length + ' pieces' : g.map(x => x.label).join(', ')) + ')');
  ok(/It'll take somebody else to undo any of it/.test(told), '...and the story ends on what it left them in');
  ok(W.__farmGear(500).filter(x => x.keep).length === g.length, '...every piece of it on the list their Companion gets');
  const fg0 = P(500).gear.leash; P(500).gear.leash = { label: 'Field Stake', desc: 'x', until: Date.now() + 86400000, src: 'wild', keep: true, items: ['PetPost'], rec: { d: 1, l: 2 }, text: ['Free', 'To', 'Breed'] };
  const stake = W.__farmGear(500).find(x => x.name === 'Field Stake');
  ok(stake && stake.rec && stake.rec.l === 2 && stake.text.join(' ') === 'Free To Breed', 'a stake goes to their Companion with its mud, its chain and its sign');
  if (fg0) P(500).gear.leash = fg0; else delete P(500).gear.leash;
  ok(Object.values(KITS).every(ks => ks.every(k => k.pieces.length >= 5 && k.pieces.every(p => p.label.length <= 28 && p.slot && p.items && p.items.length) && new Set(k.pieces.map(p => p.slot)).size === k.pieces.length)),
    'every kit: five pieces or more, each in its own slot, each with a name that fits');
  // within a minute of the last: it lets them be
  move(moo, 10, 10); await wait(50);
  const w2 = W.__wild()[1], n1 = (P(500).trapLog || []).length; P(500).trapAt = Date.now() - 20000;
  move(moo, w2.X, w2.Y); await wait(300);
  ok((P(500).trapLog || []).length === n1 && !W.__wildOn(500), 'twenty seconds after the last trap let go: it waits (a minute\'s all the grace there is)');
  // somebody with traps off walks right over one
  const w3 = W.__wild()[2]; move(fay, w3.X, w3.Y); await wait(300);
  ok(!(P(600).trapLog || []).length, 'somebody with traps off walks right over a wild one');
  // ?traps wild off
  move(moo, 10, 10); await wait(50);
  n = sent.length; await say(500, '?traps wild off');
  ok(P(500).wildOff === true && /Wild traps: off/.test(reply(n, 500)), '?traps wild off: the wild ones leave you be');
  P(500).trapAt = Date.now() - 5 * 60000; const n2 = (P(500).trapLog || []).length;
  move(moo, W.__wild()[1].X, W.__wild()[1].Y); await wait(300);
  ok((P(500).trapLog || []).length === n2, '...and stepping on one does nothin\'');
  await say(500, '?traps wild on'); move(moo, 10, 10); await wait(50);
  ok(P(500).wildOff === false, '?traps wild on brings them back');

  // ── the gear: put back if they pull it off, off when somebody else does ──
  const piece = Object.values(P(500).gear)[0].label;
  companion(500, { type: 'gearFreed', name: piece, by: 500 });
  await wait(200);
  ok(Object.values(P(500).gear).some(x => x.label === piece), 'they can\'t free themselves: their own Companion sayin\' they took it off changes nothin\'');
  n = sent.length; companion(500, { type: 'gearFreed', name: piece, by: 221397 });
  await wait(400);
  ok(!Object.values(P(500).gear || {}).some(x => x.label === piece) && /Laynie takes the .* off Moo/.test(sent.slice(n).map(([, d]) => String(d && d.Content || '')).join(' ')), 'somebody else takes it off: it\'s off, and the room hears who did it');
  // a long name: the game keeps 30 letters of it, and that's what their Companion sends
  const long = 'Breeding Frame Strap Harness, Locked Tight';
  P(500).gear.legs = { label: long, desc: 'x', until: Date.now() + 86400000, src: 'wild', keep: true };
  companion(500, { type: 'gearFreed', name: long.slice(0, 30), by: 221397 });
  await wait(400);
  ok(!(P(500).gear || {}).legs, 'a piece with a name longer than the game keeps still comes off when somebody else frees it');
  // a safeword takes every bit of it off
  // caught again in a hunt: a hunt prize
  L().hunt = { until: Date.now() + 600000, goal: 'pasture', done: [] }; W.__wildTick();
  const hl0 = (P(500).trapLog || []).length, hw = W.__wild()[0], hpos = hw.X + ',' + hw.Y;
  P(500).trapAt = Date.now() - 5 * 60000; move(moo, hw.X, hw.Y); const hOn = W.__wildOn(500); await done();
  const hg = Object.values(P(500).gear || {});
  ok(hg.some(x => x.keep) && KITS.hunt.some(k => k.pieces.every(p => hg.some(x => x.label === p.label))), 'caught in a hunt, it leaves a hunt prize (' + P(500).wildKit + '; sprang ' + hOn + ', traps ' + hl0 + '->' + (P(500).trapLog || []).length + ' at ' + hpos + ', moo ' + JSON.stringify(moo.MapData.Pos) + ')');
  L().hunt = null; W.__wildTick();
  await say(500, '?safeword', 900);
  ok(!Object.values(P(500).gear || {}).some(x => x.keep), 'the safeword takes off everything a wild trap left');

  // ── staff can see them, nobody else ──
  n = sent.length; await say(221397, '?trap where'); const tw = reply(n, 221397);
  ok(/WILD TRAPS/.test(tw) && (tw.match(/ at \d+,\d+/g) || []).length === W.__wild().length, '?trap where: staff see every wild trap and where it is');
  n = sent.length; await say(500, '?trap where');
  ok(/That's for staff/.test(reply(n, 500)) && !/ at \d+,\d+/.test(reply(n, 500)), '...anybody else is told they\'re hidden');
  ok(!warns.some(w => /wild|trap|gear/i.test(w)), 'no errors: ' + warns.filter(w => /wild|trap|gear/i.test(w)).slice(0, 2).join(' | '));
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
