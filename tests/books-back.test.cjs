// YOUR BOOKS COME BACK (Nov 23). Nikto's #22: "i accidentally got wiped earlier and it reset all the toggles in "farm
// settings", also of course lost all my ribbons, had to redo the application and lost all the stats, achievements and so
// on". The archive always kept it; nothin' put it back. Now ?approve brings back what was theirs.
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const old = { mn: 500, name: 'Pup', roles: ['LIVESTOCK'], species: 'pup', gender: 'male', ribbons: 140, ribbonsEver: 300, titles: ['Good Pup'], feats: { milk: { tier: 2 } },
  trapsOn: true, breedable: true, hypno: true, wildIn: true, kryptoSafe: true, naughtyMarks: 3, roamPasses: 2,
  prod: { milk: 0, semen: 40, held: { vulva: 0, butt: 300, mouth: 0 }, totals: { loads: 12, given: 900 }, tieUntil: Date.now() + 60000, tiedTo: 9 },
  gear: { plug: { label: 'Trap Plug', until: Date.now() + 999999 } }, penned: { until: Date.now() + 99999 }, contractSigned: true, contractDressedAt: 5,
  herds: [{ leader: 221397, type: 'perm', since: 1 }], application: { byKey: { species: 'pup', depth: 'deep' } }, parasite: { strain: 'x' } };
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  221397: { mn: 221397, name: 'Laynie', roles: ['PROPRIETOR'], onDuty: true, herds: [], tempKeys: [], cover: [] },
}, archive: { 500: old }, applications: [], log: [], stuckLog: [], contracts: [] });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const chars = [260239, 221397, 500, 600].map(m => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } }));
const W = { document: doc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239] }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const L = () => W.FarmhandLedger(), P = mn => L().people[mn];
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Whisper', Content: msg, Target: 260239 }); await wait(ms || 1500); };
const all = n => sent.slice(n).filter(([e, d]) => d && typeof d.Content === 'string').map(([, d]) => d.Content === 'FarmhandMsg' ? JSON.stringify(d.Dictionary) : d.Content).join(' | ');
(async () => { await wait(3500); const cfg = W.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 2;
  ok(!P(500) && L().archive[500], '(Pup was taken off the books; the archive kept their paperwork)');
  let n = sent.length; await say(221397, '?approve 500 livestock', 2500);
  const r = P(500);
  ok(r && r.roles.includes('LIVESTOCK') && /Back on the books: their old ribbons \(140\)/.test(all(n)), 'approved again: back on the books, and staff are told what came back');
  ok(r.ribbons === 140 && r.ribbonsEver === 300 && r.titles[0] === 'Good Pup' && r.feats.milk.tier === 2 && r.naughtyMarks === 3 && r.roamPasses === 2, 'their ribbons, titles, feats, marks and bought passes are theirs again');
  ok(r.trapsOn === true && r.breedable === true && r.hypno === true && r.wildIn === true && r.kryptoSafe === true && r.species === 'pup' && r.gender === 'male', 'every switch they\'d set, and their words for themselves');
  ok(r.prod.totals.loads === 12 && r.prod.semen === 40, 'their farm numbers');
  ok(r.prod.held.butt === 0 && !r.prod.tieUntil && !r.prod.tiedTo, '...but not what was in them, or a knot, from back then');
  ok(!r.gear && !r.penned && !r.parasite && !r.contractSigned && !r.contractDressedAt && !(r.herds || []).length, 'nothin\' that was happenin\' to them then: no gear, no pen, no parasite, no old contract, no herd');
  ok(r.oldApplication && r.oldApplication.byKey.depth === 'deep', 'their old application is there to see again');
  await wait(6000);
  ok(/Welcome back, sugar\. The farm kept your books: your 140 ribbons/.test(all(n)), 'and they\'re told, in the farm\'s voice');
  // somebody the archive doesn't know: a fresh start, as ever
  n = sent.length; await say(221397, '?approve 600 livestock', 2500);
  ok(P(600) && !P(600).ribbons && !/Back on the books/.test(all(n)), 'somebody brand new: a fresh start, nothin\' said');
  // approvin' somebody already on the books (a second role): nothin' restored over what they have now
  P(500).ribbons = 5; await say(221397, '?approve 500 luxury', 2500);
  ok(P(500).ribbons === 5, 'a second role for somebody on the books: their books aren\'t rolled back');
  ok(!warns.some(w => /books back/i.test(w)), 'no errors');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
