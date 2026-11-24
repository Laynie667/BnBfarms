// BRED TO HIS KIND (Nov 23, the suggestion box's #60). Laynie: "the pregnancy by species impregnated by, and pregnancy
// lines". The sire's kind sets how many, how long, and what's born (bot 10y2c-sired.js); a sire with no kind on file
// leaves it to the mother's. The breeding add-on's cravings, kicks and stages follow what's in there (breeding/carrying.js).
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const P0 = (mn, name, x) => Object.assign({ mn, name, roles: ['LIVESTOCK'], onDuty: true, herds: [], tempKeys: [], cover: [], breedable: true, fertile: true }, x);
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  500: P0(500, 'Moo', { species: 'cow', gender: 'female' }),
  501: P0(501, 'Rex', { species: 'dog', gender: 'male' }),
  502: P0(502, 'Bun', { species: 'bunny', gender: 'female' }),
  503: P0(503, 'Stud', { species: 'stallion', gender: 'male' }),
  504: P0(504, 'Hank', { gender: 'male' }),
  505: P0(505, 'Dot', { species: 'rat', gender: 'female' }),
}, spots: {}, applications: [], archive: {}, log: [], stuckLog: [] });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const at = (m, X, Y) => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
const chars = [at(260239, 1, 1), at(500, 5, 5), at(501, 6, 6), at(502, 20, 20), at(503, 22, 22), at(504, 24, 24), at(505, 26, 26)];
const W = { document: doc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239], MapData: { Type: 'Always' } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const prod = (m) => W.__prodOf(m);
const DAY = 86400000;
const drain = async () => { await wait(300); for (let i = 0; i < 200; i++) { const s = W.__st(); if (!s.queue.length && !s.urgent.length && !s.sending) break; await wait(100); } await wait(200); };
// a load that takes, every time (the ripe shot)
const breed = (mother, stud, hole) => { const p = prod(mother); p.preg = null; p.labour = null; p.boosts = Object.assign(p.boosts || {}, { ripe: Date.now() + 3600000 }); p.held = Object.assign(p.held || {}, { vulva: 200, butt: 200 }); return W.__conceive(mother, stud, 200, 1, hole || 'vulva'); };
(async () => { await wait(3500);
  chars.forEach((c, i) => { c.Name = ['Farm', 'Moo', 'Rex', 'Bun', 'Stud', 'Hank', 'Dot'][i]; });
  const C = W.__cfg;
  ok(Object.keys(C.SPECIES).every(k => C.SPECIES[k].days > 0), 'every kind has its own carryin\' time (' + ['bunny', 'dog', 'cow', 'horse'].map(k => k + ' ' + C.SPECIES[k].days).join(', ') + ' days)');

  // a cow bred by a dog: pups, a dog's litter, a dog's days
  let took = breed(500, 501); let g = prod(500).preg;
  const daysOf = (g) => Math.round((g.due - g.since) / DAY * 10) / 10;
  ok(took === 'new' && g.kind === 'dog', 'a cow bred by a dog carries his kind (' + took + ', ' + (g && g.kind) + ')');
  ok(g.count >= 3 && g.count <= 8, '...a dog\'s litter, 3 to 8, not a cow\'s one calf (' + g.count + ')');
  ok(Math.abs(daysOf(g) - 3) < 0.01, '...for a dog\'s 3 days, not a cow\'s 7 (' + daysOf(g) + ')');
  ok(W.__birthWords(500).many === 'pups' && W.__birthWords(500).place === "the calvin' pen", 'what\'s in there is pups, and she still births in her own calvin\' pen');
  ok(W.__birthWords(500).cross === true, '...and it\'s another kind than hers');
  // the birth: crowned and tended in the cross lines, the pups counted as pups
  const n0 = sent.length; prod(500).preg.count = 4;
  const cr = [...Array(10)].map(() => W.__birthLine('crownMany', 500, null, 'crown')).join(' ');
  ok(!/hooves|wobbly legs/.test(cr) && /pup/.test(cr), 'the crownin\': no calf\'s hooves on a pup (' + cr.slice(0, 120) + '…)');
  C.LAY_SCENE = false; C.SEND_INTERVAL_MS = 2; C.USER_COOLDOWN_S = 0;   // (the birth in one line, not beats)
  W.__birth(500); await drain();
  const said = sent.slice(n0).map(([, d]) => d && (d.Content || d.Message)).filter(Boolean).join(' | ');
  const sb = W.FarmhandLedger().studbook.slice(-1)[0];
  ok(sb.dam === 500 && sb.kind === 'dog', 'the stud book writes down what kind was born');
  const birthSaid = said.split(' | ').filter(t => /Moo/.test(t)).join(' | ');   // (the cross lines say "not a calf among them" on purpose)
  ok(/4 pups/.test(birthSaid) && !/\b\d+ calves\b|delivered a calf|a calf, a little/.test(birthSaid), 'the birth: "4 pups", no calves born (' + birthSaid.slice(0, 200) + '…)');

  // a bunny bred by a stallion: one foal, long
  took = breed(502, 503); g = prod(502).preg;
  ok(took === 'new' && g.kind === 'horse' && g.count <= 2 && Math.abs(daysOf(g) - 8) < 0.01, 'a bunny bred by a stallion: one foal (twins at most), 8 days (' + [g.kind, g.count, daysOf(g)].join(', ') + ')');
  ok(W.__birthWords(502).one === 'foal' && W.__birthWords(502).place === 'the fur-lined nest', '...a foal, born in her own fur-lined nest');

  // a sire with no kind on file: the mother's own, as before
  took = breed(505, 504); g = prod(505).preg;
  ok(took === 'new' && g.kind === 'rat' && g.count >= 6 && Math.abs(daysOf(g) - 2) < 0.01, 'a rat bred by a plain human: a rat\'s litter and days, her own kind (' + [g.kind, g.count, daysOf(g)].join(', ') + ')');
  ok(W.__birthWords(505).cross === false, '...nothing crossed');

  // the farm's own studs: the wolf pack breeds wolves into her
  ok(W.__sireKind(-10) === 'wolf' && W.__sireKind(-11) === 'horse' && W.__sireKind(-13) === 'rabbit' && W.__sireKind(-71) === null, 'trap sires are their kinds (the wolf pack wolves, the stallion stud a horse; the yeti none)');
  took = breed(500, -10); g = prod(500).preg;
  ok(took === 'new' && g.kind === 'wolf' && W.__birthWords(500).many === 'pups', 'a cow bred by the wolf pack carries wolf pups (' + (g && g.kind) + ')');

  // a pregnancy from before today: no kind on it, the mother's own
  prod(500).preg = { since: Date.now() - DAY, due: Date.now() + DAY, sires: [501], count: 1, warned: true };
  ok(W.__youngKindOf(500) === 'cow' && W.__birthWords(500).one === 'calf', 'a pregnancy from before (no kind written on it): still her own calf');

  // what's said when it takes: the young and the real days
  prod(500).preg = null;
  const doc2 = fs.readFileSync(path.join(__dirname, '../bot/src/parts/farm/08-production.js'), 'utf8');
  ok(/carryWord\(t\)/.test(doc2) && /dueWords\(t\)/.test(doc2) && !/Due in "\+CFG\.PROD\.PREG_DAYS/.test(doc2), '"It took!" says what they\'re carryin\' and when it\'s due, not a flat 5 days');

  // the cross lines: no round brackets, every one fills
  const X = W.__birthCross(), lines = [].concat(...Object.values(X));
  ok(lines.length >= 14 && !lines.some(l => /[()]/.test(l)), 'the cross lines: ' + lines.length + ', no round brackets');

  // the breeding add-on: cravings, kicks and stages by what's in there
  eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-breeding.user.js'), 'utf8')); await wait(300);
  const src = fs.readFileSync(path.join(__dirname, '../addons/breeding/carrying.js'), 'utf8');
  const kinds = ['cow', 'horse', 'deer', 'pig', 'dog', 'den', 'cat', 'bunny', 'goat', 'sheep', 'rat', 'goblin', 'dragon'];
  ok(kinds.every(k => new RegExp('\\n  ' + k + ': \\{').test(src)), 'the add-on has lines for every kind that can be carried');
  ok(!/[()]/.test(src.split('export const BY_KIND')[1].split('export function')[0].replace(/\[|\]|\{|\}/g, '').split('\n').filter(l => /"/.test(l)).join('')), 'no round brackets in the add-on\'s carryin\' lines');
  // a cow carryin' pups, heavy: her kick line is a pup's more often than not
  prod(500).preg = { since: Date.now() - 2.5 * DAY, due: Date.now() + 0.5 * DAY, sires: [501], count: 5, warned: true, kind: 'dog' };
  const kicks = [];
  for (let i = 0; i < 14; i++) {
    const L0 = W.FarmhandLedger(); L0.mods = L0.mods || {}; const d = L0.mods.breeding = L0.mods.breeding || {}; d.preg = d.preg || {}; d.preg[500] = { stage: 'heavy', kickAt: 1, craveAt: Date.now() + DAY };
    const k = sent.length; W.__addons('tick'); await drain();
    kicks.push(sent.slice(k).map(([, x]) => x && x.Content).filter(t => /Moo/.test(String(t))).join(' '));
  }
  const pupKicks = kicks.filter(t => /pups?\b/.test(t)).length;
  ok(pupKicks >= 3, 'a cow carryin\' pups gets pups\' kicks more often than not: ' + pupKicks + ' of ' + kicks.filter(Boolean).length + ' (' + (kicks.find(t => /pup/.test(t)) || kicks[0] || '').slice(0, 110) + '…)');
  ok(!/a calf's kick|hoof/.test(kicks.join(' ')), '...and never a calf\'s');
  ok(!warns.some(w => /sired|birth|breeding|carry/i.test(w)), 'no errors: ' + warns.filter(w => /sired|birth|breeding|carry/i.test(w)).slice(0, 2).join(' | '));
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
