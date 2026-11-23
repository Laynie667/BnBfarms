// STRAPPED INTO THE STALL, AND TO THE NEST (Nov 23), from the suggestion box:
//   #10 (Nikto): "having the option of locking stock in the milking stall for the duration of a session"; Laynie: "that
//     should be on a toggle with equipment, like a stand, symbian, and lactation pump. so those wanting immersion can
//     toggle it on. removed after".
//   #30 (Crystal): the nest is "kind of hard to figure out where that actually is"; Laynie: "add a "Move to nest" command
//     or button".
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const P = (mn, name, x) => Object.assign({ mn, name, roles: ['LIVESTOCK'], onDuty: true, herds: [], tempKeys: [], cover: [] }, x);
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  500: P(500, 'Moo', { species: 'cow', gender: 'female', milkable: true }),
  501: P(501, 'Rex', { species: 'dog', gender: 'male' }),
}, spots: { 'milking-1': { X: 5, Y: 5 }, nest: { X: 20, Y: 20 } }, applications: [], archive: {}, log: [], stuckLog: [] });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const at = (m, X, Y) => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
const moo = at(500, 5, 5), rex = at(501, 30, 30);
const chars = [at(260239, 1, 1), moo, rex];
const W = { document: doc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239], MapData: { Type: 'Always' } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const L = () => W.FarmhandLedger(), Pp = mn => L().people[mn];
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Whisper', Content: msg, Target: 260239 }); await wait(ms || 1300); };
const all = n => sent.slice(n).filter(([e, d]) => d && typeof d.Content === 'string').map(([, d]) => d.Content === 'FarmhandMsg' ? JSON.stringify(d.Dictionary) : d.Content).join(' | ');
const fillUp = () => { const p = W.__prodOf(500); p.milk = W.__milkCapOf(500); p.stall = null; p.stallPaused = null; p.stallRest = 0; p.stallSeen = 0; };
(async () => { await wait(3500); const cfg = W.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 2;
  // switch off: a session's just a session
  fillUp(); W.__ms(); W.__ms();
  ok(W.__prodOf(500).stall && !W.__stallGear(500).length, 'switch off: the stall milks them, and puts nothin\' on them');
  // switch on
  let n = sent.length; await say(500, '?stallgear on');
  ok(Pp(500).stallGear === true && /Strapped into the stall/.test(all(n)) && /: ON/.test(all(n)), '?stallgear on: their own switch');
  fillUp(); moo.MapData.Pos = { X: 5, Y: 5 }; W.__ms(); W.__ms();
  const g = W.__stallGear(500);
  ok(g.some(x => x.slot === 'cups' && x.items[0] === 'LactationPump' && x.always) && g.some(x => x.slot === 'device' && x.items[0] === 'Sybian' && x.always), 'a session: the stall\'s pump on their teats and its Sybian under them (' + g.map(x => x.name).join(', ') + ')');
  ok((W.__stateFor(500).farmGear || []).some(x => x.name === 'Stall Sybian'), '...sent to their Companion as farm gear, their switch the say-so');
  // step off: straight back on
  moo.MapData.Pos = { X: 9, Y: 9 }; n = sent.length; W.__ms(); await wait(1500);
  ok(W.__prodOf(500).stall && W.__prodOf(500).stall.heldAt > 0 && /strapped in till the stall's done/.test(all(n)), 'steppin\' off: put straight back on the stall, and told why');
  // safeword: loose, gear and all
  n = sent.length; await say(500, '?safeword', 2500);
  ok(!W.__stallGear(500).length && !W.__stallHold(500), 'their safeword: the gear comes off and they\'re loose');
  // done: it all comes off
  W.__prodOf(500).stallFreeUntil = 0; W.__prodOf(500).stall = null; ok(!W.__stallGear(500).length, 'the session over: nothin\' left on them');
  // a body without a pussy: the stand
  await say(501, '?stallgear on'); W.__prodOf(501).stall = { since: Date.now(), until: Date.now() + 600000, kind: 'cock', spot: { X: 5, Y: 5 } };
  const g2 = W.__stallGear(501);
  ok(g2.length === 1 && g2[0].items[0] === 'LegSpreadDisplayStand', 'milkin\' a cock with no pussy: the spreadin\' stand, and no teat cups (' + g2.map(x => x.name).join(', ') + ')');
  // ?nest
  n = sent.length; await say(501, '?nest');
  ok(/Off to the nest with you/.test(all(n)), '?nest: off to the nest');
  delete L().spots.nest; await wait(2000); n = sent.length; await say(501, '?tonest', 2000);
  ok(/hasn't got a nest set up/.test(all(n)), '...and if there isn\'t one, they\'re told how staff make one');
  ok(!warns.some(w => /stall|nest/i.test(w)), 'no errors: ' + warns.filter(w => /stall|nest/i.test(w)).slice(0, 2).join(' | '));
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
