// THE LINES SWEEP (Nov 23), from the suggestion box:
//   #11/#12/#18 (Nikto): lines for a pussy goin' to men ("blows a thin stream of warm air right where they're wettest",
//     "a naga who coils you up and takes two holes at once"). Laynie: "it definitely is worth a sweep".
//   #35 (Lyn): "?wash seems pretty likely to play dialogue that should only play if you have a dick, even if you dont".
//   #48 (Ella 👎): the overdue-milk nag, three lines every ten minutes.
//   #54 (Lucira): "During the hypnosis, my limbs are reffered too as paws despite being a horse".
//   #61 (Rosey 👎): the toffee apple endin'.
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const P = (mn, name, x) => Object.assign({ mn, name, roles: ['LIVESTOCK'], onDuty: true, herds: [], tempKeys: [], cover: [] }, x);
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  501: P(501, 'Moo', { species: 'cow', gender: 'female' }),
  502: P(502, 'Rex', { species: 'dog', gender: 'male' }),
  503: P(503, 'Hana', { species: 'cow', gender: 'futa', futa: true }),
}, applications: [], archive: {}, log: [], stuckLog: [] });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const chars = [260239, 501, 502, 503].map(m => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } }));
const W = { document: doc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239] }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
global.console = { ...console, log: () => {}, warn: () => {} };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const many = (mn, key, pool, n = 60) => { const seen = new Set(); for (let i = 0; i < n; i++) seen.add(W.__pickFor(mn, key + i, pool)); return [...seen]; };
(async () => { await wait(3500);
  const B = (mn) => W.__body(mn);
  ok(!B(502).vulva && B(502).cock && B(501).vulva && !B(501).cock, '(the bodies: Rex a cock and no pussy, Moo a pussy and no cock: '+JSON.stringify([B(502),B(501)])+')');
  // #11/#12: "wettest" counts as a pussy word now
  const wet = ['It blows a thin stream of warm air right where they\'re wettest.', 'It strokes %n\'s belly slow and warm.'];
  ok(many(502, 'wet', wet).every(l => !/wettest/.test(l)), 'Nikto\'s line: "right where they\'re wettest" never goes to a man');
  ok(many(501, 'wet2', wet).some(l => /wettest/.test(l)), '...and still does to somebody with a pussy');
  ok(/neediest/.test(W.__bodyWords(502, 'Right where %n\'s wettest.')), '...and the last resort swaps it ("neediest")');
  // #35: their own cock, for somebody without one
  const cockPool = ['A soapy hand works down %n\'s cock and takes its time.', 'A soapy hand works down %n\'s thighs and takes its time.'];
  ok(many(501, 'cock', cockPool).every(l => !/cock/.test(l)), 'Lyn\'s ?wash: a line about their own cock never goes to somebody without one');
  ok(many(502, 'cock2', cockPool).some(l => /cock/.test(l)), '...and still does to somebody with one');
  ok(many(501, 'other', ['The farmhand pulls out his cock and slaps it on %n\'s cheek.']).length === 1, '...somebody ELSE\'s cock is anybody\'s to hear about');
  const tagged = ['{c}A soapy hand milks %n\'s cock dry.', 'The farmhand rinses %n down from head to tail.'];
  ok(many(501, 'tag', ['{c}A soapy hand milks %n\'s cock dry.', '{c}%n\'s cock jumps under the sponge.', 'Nothin\' fits but this: the farmhand rinses %n down.']).every(l => !/^\{c\}/.test(l)), 'nothin\' tagged for them: an untagged line, never one tagged for a cock');
  ok(W.__bodyWords(501, '%n\'s cock throbs under the sponge.') === '%n\'s clit throbs under the sponge.', 'the last resort: their cock becomes their clit');
  ok(W.__bodyWords(501, 'Your aching balls draw up tight.') === 'Your aching pussy draws up tight.' || /pussy/.test(W.__bodyWords(501, 'Your aching balls draw up tight.')), '...their balls, their pussy');
  ok(W.__bodyWords(502, '%n\'s cock throbs.') === '%n\'s cock throbs.', '...and a cock stays a cock on somebody who has one');
  // the lines themselves
  const src = (f) => fs.readFileSync(path.join(__dirname, '../bot/src/parts', f), 'utf8');
  ok(/a naga who coils you up and fills you at both ends/.test(src('traps/10u3-anthro-traps.js')) && !/takes two holes at once"/.test(src('traps/10u3-anthro-traps.js')), 'the naga trap: "fills you at both ends", for anybody');
  ok(/"\{v\}%n is so wet from the heat mist/.test(src('ribbons/10m2-potion-lines.js')) && /"\{c\}%n's cock won't go down in the heat mist/.test(src('ribbons/10m2-potion-lines.js')), 'the heat mist: wet for a pussy, leakin\' for a cock');
  ok(/pickFor\(mn, "fxbit:"/.test(src('ribbons/10m2-potion-lines.js')), '...and a potion\'s line is fitted to the body it\'s about (it never was)');
  ok(/"\{v\}Your heat's got you so wet and twitchy/.test(src('voice/10uh2-tease-lines.js')) && /"\{nv\}Your heat's got you leakin'/.test(src('voice/10uh2-tease-lines.js')), 'the heat tease: one for each');
  // #48: the nag
  const ud = src('farm/10y7-udders.js'), nag = (ud.match(/over4nag: \[([\s\S]*?)\],/) || ['', ''])[1].split('\n').filter(l => /"/.test(l)).length;
  ok(nag >= 9 && /\(CFG\.OVERDUE_NAG_MIN \|\| 30\)\*60000/.test(ud), 'Ella\'s nag: every half hour, not ten minutes, and ' + nag + ' lines, not three');
  // #61: the toffee apple
  ok(!/sweet as a toffee apple/.test(src('traps/ends/10z6b-trap-ends-2.js')), 'Rosey\'s 👎 toffee apple endin\' is rewritten');
  // #54: Conditioning's paws
  const ci = fs.readFileSync(path.join(__dirname, '../addons/conditioning/index.js'), 'utf8'), cm = fs.readFileSync(path.join(__dirname, '../addons/conditioning/more-lines.js'), 'utf8');
  const hooves = (ci.match(/const HOOVES = \[([^\]]*)\]/) || ['', ''])[1];
  ok(/"horse"/.test(hooves) && /"pony"/.test(hooves) && /"cow"/.test(hooves), 'Lucira\'s hypnosis: a horse, a pony, a cow have hooves');
  ok(/\.replace\(\/\\\{paws\\\}\/g, w\.paws/.test(ci) && !/\b[Pp]aws (don't|now)\b/.test(cm) && /Your hands are \{paws\} now/.test(cm) && /Hands are \{paws\}\./.test(cm), '...and the script says {paws}, filled in by species, never "paws" for everybody');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
