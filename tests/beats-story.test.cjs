// THE BEATS PASS (Nov 20). Laynie: "Need a beats pass too, to make sure each beat makes sense like a story. some beats
// seem unconnected". A trap's story is its own beats with more woven in: its two extra scene beats, two or three from what
// kind of trap it is, one about the state they're in, a sentence on the end now and then. Those were woven in blind:
// the breeder greased them up after it had been ruttin' them, a hose pump got "whoever's in them is getting near", the
// giggle gas got the heat gas's beats, the same tail twice in one scene, and the tickle rack's woven beats came before
// its brushes had started. These are the rules that keep a story a story.
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const S = (mn, name, extra) => Object.assign({ mn, name, roles: ["LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", trapsOn: true, breedable: true, fertile: true }, extra || {});
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: { "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] }, "500": S(500, "Moo") },
  applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const at = (m, X, Y, name) => ({ MemberNumber: m, Name: name, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
const chars = [at(260239, 1, 1, 'Farm'), at(221397, 2, 2, 'Laynie'), at(500, 10, 10, 'Moo')];
const evts = {};
const W = { document: doc, addEventListener(e, f) { (evts[e] = evts[e] || []).push(f); }, dispatchEvent(ev) { (evts[ev.type] || []).forEach(f => f(ev)); },
  CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } }, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => { sent.push([ev, d]); }, ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239], MapData: { Type: 'Always' } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true;
let own = null; W.__onTrapBeats = (mn, kind, beats) => { own = beats.map(b => [].concat(b).map(String)); };
eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const L = () => W.FarmhandLedger(), P = mn => L().people[mn];
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Whisper', Content: msg, Target: 260239 }); await wait(ms || 300); };
const story = (n) => sent.slice(n).filter(([e, d]) => e === 'ChatRoomChat' && d && (d.Type === 'Emote' || (d.Type === 'Whisper' && d.Target === 500))).map(([, d]) => String(d.Content)).filter(t => /^\(\*/.test(t) || !/^\(/.test(t)).map(t => t.replace(/^\(\*\s*/, '').replace(/^[^\w"'“]+\s/, ''));   // (the trap's icon, when there is one)
const fill = (t) => String(t).replace(/^\{[^}]*\}/, '').replace(/%n/g, 'Moo');
const spring = async (kind) => {
  const r = P(500); r.trapAt = 0; r.spotTrapAt = {}; r.penned = null; r.trapWait = null; r.trapQuiet = 0; r.benched = null;
  if (W.__st().trapRuns) W.__st().trapRuns.delete(500);
  own = null; const n = sent.length;
  await say(221397, '?trap spring 500 ' + kind, 150);
  for (let i = 0; i < 120; i++) { await wait(40); if (!(W.__st().trapRuns && W.__st().trapRuns.has(500))) break; }
  await wait(150);
  return { lines: story(n), own };
};
(async () => {
  await wait(3500);
  const cfg = W.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 1; cfg.TRAP_BEAT_S = 0.02; cfg.CHAIN_CHANCE = 0; cfg.AFTER_CHANCE = 0;
  await say(500, '?stats', 300);
  const PARTNER = /whoever's in|breath on Moo's neck|weight on (their|Moo's) back|slap of skin|big hand/i;
  const scene = W.__trapScene;

  // a machine in them: nobody's breath on their neck
  let partnerLines = [], prepAt = [], repeats = [];
  const prep = (scene.breeder[0] || []).map(fill).map(t => t.slice(0, 40));
  for (let i = 0; i < 12; i++) {
    const { lines } = await spring('breeder');
    partnerLines.push(...lines.filter(t => PARTNER.test(t)));
    const k = lines.findIndex(t => prep.some(p => t.startsWith(p))); if (k >= 0) prepAt.push(k);
    const seen = new Map(); for (const t of lines) for (const s of t.split(/(?<=[.!?])\s+/)) if (s.length > 30) seen.set(s, (seen.get(s) || 0) + 1);
    repeats.push(...[...seen.entries()].filter(([, c]) => c > 1).map(([s]) => s));
  }
  ok(!partnerLines.length, 'the breedin\' frame is a machine: no "whoever\'s in them", no breath on their neck, no weight on their back (' + partnerLines.slice(0, 1).join('') + ')');
  ok(prepAt.length > 0 && prepAt.every(k => k <= 4), 'its gettin\'-ready beat (strapped, hobbled, greased) comes early, not after it\'s been ruttin\' them (at ' + prepAt.join(',') + ')');
  ok(!repeats.length, 'no sentence said twice in one scene (' + repeats.slice(0, 1).join('') + ')');

  // a gas or spray variant: its own story, not the plain gas trap's scene beats
  const gasScene = [].concat(...(scene.gas || [])).map(fill).map(t => t.slice(0, 40));
  let gasHits = [];
  for (let i = 0; i < 12; i++) { const { lines } = await spring('gas'); gasHits.push(...lines.filter(t => gasScene.some(p => t.startsWith(p)))); }
  ok(gasScene.length > 0 && !gasHits.length, 'every gas variant tells its own story: none of the plain gas trap\'s scene beats (' + gasHits.slice(0, 1).join('') + ')');

  // the tickle rack: its story leads into the hold, so what's woven in comes after its own last beat
  let wovenBefore = 0, runs = 0;
  for (let i = 0; i < 8; i++) {
    const r = P(500); r.trapWait = null;
    const { lines, own: o } = await spring('tickle'); P(500).trapWait = null;
    if (!o || !lines.length) continue; runs++;
    const lastOwn = o[o.length - 1].map(fill).map(t => t.slice(0, 35));
    const k = lines.findIndex(t => lastOwn.some(p => t.startsWith(p)));
    const ownAll = [].concat(...o).map(fill).map(t => t.slice(0, 35));
    if (k > 0 && lines.slice(0, k).some(t => !ownAll.some(p => t.startsWith(p)))) wovenBefore++;
  }
  ok(runs > 0 && wovenBefore === 0, 'the tickle rack: nothin\'s woven in before its brushes have started (' + wovenBefore + ' of ' + runs + ')');

  ok(!warns.some(w => /trap|beat|scene/i.test(w)), 'no errors: ' + warns.filter(w => /trap|beat|scene/i.test(w)).slice(0, 2).join(' | '));
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
