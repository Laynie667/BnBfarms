// THE FARM GIRL'S BOOKS FOR THE COMPANION'S WHISTLE (Nov 23), and the rest of that batch on the bot's side:
//   • what a contract's Companion needs to keep the rules off the farm (roamState: pass length, permanent, end, room, who
//     may summon), and a pass it kept for them while they were away comes off their books (roamSpent); late is late.
//   • back on the farm under a contract: anything missin' from their farm outfit goes back on (Laynie: "also reapplying
//     their farm outfits upon them returning, if contracted and anything is missing"), only in the empty spots.
//   • Crystal's #74: "A timer in the status for when your knot (not just the other party's knot) releases would be nice."
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const S = (mn, name, extra) => Object.assign({ mn, name, roles: ['LIVESTOCK'], species: 'cow', gender: 'female', onDuty: true, herds: [], tempKeys: [], cover: [], limits: '', ribbons: 70 }, extra || {});
const until = Date.now() + 86400000 * 3;
const b64 = { compressToBase64: (t) => Buffer.from(t).toString('base64'), decompressFromBase64: (t) => Buffer.from(t, 'base64').toString() };
const outfit = b64.compressToBase64(JSON.stringify({ items: [{ Group: 'Cloth', Name: 'CowPrintDress' }, { Group: 'ItemNeck', Name: 'LeatherCollar', locked: true }, { Group: 'Shoes', Name: 'Heels1' }] }));
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  221397: { mn: 221397, name: 'Laynie', roles: ['PROPRIETOR'], onDuty: true, herds: [], tempKeys: [], cover: [] },
  500: S(500, 'Moo', { contractDressedAt: Date.now() - 86400000, contractSlot: 'cow|female', roamPasses: 2 }),
  600: S(600, 'Rex', { gender: 'male', species: 'dog', futa: true }),
  700: S(700, 'Pip', { contractDressedAt: Date.now() - 86400000, ownOutfit: true }),
}, contracts: [{ key: 'a', mn: 500, status: 'signed', depth: 'deep', rules: ['other.summon'], signedAt: Date.now(), until },
               { key: 'b', mn: 700, status: 'signed', depth: 'deep', rules: ['other.summon'], signedAt: Date.now(), until }],
  outfits: { 'cow|female': { data: outfit, items: 3, locks: 1, by: 221397, at: 1 } },
  applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const item = (g, n) => ({ Asset: { Name: n, Group: { Name: g } } });
const at = (m, X, Y) => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
const moo = at(500, 15, 10);
const chars = [at(260239, 1, 1), at(221397, 10, 10), moo, at(600, 20, 20), at(700, 30, 30)];
const W = { document: doc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {}, LZString: b64,
  ServerSend: (ev, d) => { sent.push([ev, d]); }, ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, Name: 'Farmhand', FriendList: [] },
  ChatRoomData: { Name: 'B&B Farm', Admin: [260239], MapData: { Type: 'Always' } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const L = () => W.FarmhandLedger(), P = mn => L().people[mn];
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Whisper', Content: msg, Target: 260239 }); await wait(ms || 1300); };
const comp = (mn, type, data) => handlers.ChatRoomMessage({ Sender: mn, Type: 'Hidden', Content: 'FarmhandMsg', Dictionary: Object.assign({ v: 2, type }, data || {}) });
const toMe = (n, mn, type) => sent.slice(n).filter(([e, d]) => e === 'ChatRoomChat' && d && d.Content === 'FarmhandMsg' && d.Target === mn && d.Dictionary && d.Dictionary.type === type).map(([, d]) => d.Dictionary);
const all = n => sent.slice(n).filter(([e, d]) => d && (typeof d.Content === 'string' || e === 'AccountBeep')).map(([e, d]) => d.Content === 'FarmhandMsg' ? JSON.stringify(d.Dictionary) : String(d.Content || d.Message)).join(' | ');
(async () => { await wait(3500); const cfg = W.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 2;
  ['Laynie', 'Moo', 'Rex', 'Pip'].forEach((nm, i) => chars[i + 1].Name = nm); chars[0].Name = 'Farmhand';
  for (const mn of [500, 600, 700]) { comp(mn, 'hello', { ver: '0.76.0' }); await wait(300); }
  await wait(1500);
  // ── what their Companion is told ──
  const ro = W.__stateFor(500).roam;
  ok(ro && ro.mins === 60 && ro.perm === false && ro.ends === until && ro.room === 'B&B Farm' && ro.space && ro.by.includes(260239) && ro.by.includes(221397),
    'their Companion gets what it needs to keep the rules off the farm: pass length, the contract\'s end, the room, who may summon (' + JSON.stringify(ro).slice(0, 120) + ')');
  // ── a pass their Companion started while they were away ──
  const left0 = W.__stateFor(500).roam.left; let n = sent.length; const at1 = Date.now() - 20 * 60000;
  comp(500, 'roamSpent', { at: at1, started: true }); await wait(1500);
  ok(W.__stateFor(500).roam.left === left0 - 1 && /Welcome home/.test(all(n)), 'a pass the Companion started off the farm comes off their books when they\'re home (' + left0 + ' → ' + W.__stateFor(500).roam.left + ')');
  comp(500, 'roamSpent', { at: at1, started: true }); await wait(800);
  ok(W.__stateFor(500).roam.left === left0 - 1, '...once, however often it\'s said');
  // ── late back ──
  const marks0 = P(500).naughtyMarks || 0; n = sent.length;
  comp(500, 'roamSpent', { at: Date.now() - 5 * 60000, late: true }); await wait(1500);
  ok((P(500).naughtyMarks || 0) === marks0 + 1 && W.__stateFor(500).roam.left === left0 - 1 && /You were late/.test(all(n)), 'whistled home past their pass: a naughty mark and the fine, and no second pass taken');
  // ── back on the farm: the farm outfit topped up ──
  moo.Appearance = [item('Cloth', 'TShirt1'), item('ItemNeck', 'LeatherCollar')];   // their own shirt in the dress's spot; shoes gone
  n = sent.length; handlers.ChatRoomSyncMemberJoin({ Character: { MemberNumber: 500 } }); await wait(300); comp(500, 'hello', { ver: '0.76.0' }); await wait(5500);
  const tops = toMe(n, 500, 'outfit');
  ok(tops.length === 1 && tops[0].auto && JSON.stringify(tops[0].topup) === '["Shoes"]', 'back on the farm: only what\'s missin\' (the shoes) goes back on; their own shirt in the dress\'s spot stays (' + JSON.stringify(tops.map(t => t.topup)) + ')');
  n = sent.length; comp(500, 'hello', { ver: '0.76.0' }); await wait(5000);
  ok(!toMe(n, 500, 'outfit').length, '...once per return, not every hello');
  moo.Appearance = [item('Cloth', 'CowPrintDress'), item('ItemNeck', 'LeatherCollar'), item('Shoes', 'Heels1')];
  n = sent.length; handlers.ChatRoomSyncMemberJoin({ Character: { MemberNumber: 500 } }); await wait(300); comp(500, 'hello', { ver: '0.76.0' }); await wait(5000);
  ok(!toMe(n, 500, 'outfit').length, 'nothin\' missin\': nothin\' sent');
  n = sent.length; handlers.ChatRoomSyncMemberJoin({ Character: { MemberNumber: 700 } }); await wait(300); comp(700, 'hello', { ver: '0.76.0' }); await wait(5000);
  ok(!toMe(n, 700, 'outfit').length, 'somebody who brings their own outfit is never topped up');
  n = sent.length; comp(500, 'outfitAnswer', { answer: 'topped', slot: 'cow|female', worn: 1, locks: 0 }); await wait(1500);
  ok(/puts Moo back in their farm outfit: 1 piece/.test(all(n)), 'the room sees the farm girl put them back in it');
  // ── Crystal's #74: your own knot's timer ──
  const pm = W.__prodOf(500); pm.tieUntil = Date.now() + 12 * 60000; pm.tiedTo = 600;
  const hap = (W.__stateFor(600).happening || []).join(' ');
  ok(/Your knot's locked in Moo: 12 min till it lets go/.test(hap), 'the stud\'s own panel shows their knot, and when it lets go (' + hap.slice(0, 80) + ')');
  ok(/Knotted to Rex: 12 min/.test((W.__stateFor(500).happening || []).join(' ')), '...and the one tied says who to');
  n = sent.length; await say(600, '?stats', 2000);
  ok(/Your knot's locked in Moo for 12 more minutes/.test(all(n)), '?status: "your knot\'s locked in Moo for 12 more minutes" (' + (all(n).match(/Your knot[^|]{0,50}/) || [''])[0] + ')');
  n = sent.length; await say(500, '?stats', 2000);
  ok(/KNOTTED[\s\S]{0,20}Tied to Rex for 12 more minutes/.test(all(n)), '...and theirs, cock or not');
  ok(!warns.some(w => /roam|outfit|knot/i.test(w)), 'no errors: ' + warns.filter(w => /roam|outfit|knot/i.test(w)).slice(0, 2).join(' | '));
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
