// SPIDERS, THE LAB, THE OVIPOSITOR AND THE MORPHIN' DRAUGHT (Nov 24, the suggestion box's #65 and #29/#67).
// Laynie: spiders "as a wild trap, like a trap door spider, or a sneak attack from the trees… a few mad science test
// events with gear with unique tag combos. Silk should pay out ribbons, just slightly more than eggs"; "ovipositer as cock
// type"; the morph "until next morph, buy for self", and ?species free only the first time, "25 ribbons".
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const S = (mn, name, extra) => Object.assign({ mn, name, roles: ["LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", trapsOn: true, breedable: true, fertile: true }, extra || {});
// a made-up farm (not the real map)
const ZONES = { barn1: { a: { X: 14, Y: 4 }, b: { X: 24, Y: 11 }, group: "barn" }, pasture: { a: { X: 26, Y: 14 }, b: { X: 38, Y: 2 }, group: "pasture" },
  receiving: { a: { X: 14, Y: 16 }, b: { X: 22, Y: 20 }, group: "receiving" } };
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: { "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] },
  "500": S(500, "Moo", { wildIn: true, eggs: true, freeuse: true }), "501": S(501, "Bea"), "503": S(503, "Dot", { gender: "male", species: "dog", futa: true }) },
  applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: { nest: { X: 2, Y: 30 } }, zones: ZONES });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const at = (m, X, Y, name) => ({ MemberNumber: m, Name: name, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
const moo = at(500, 10, 10, 'Moo'), bea = at(501, 9, 9, 'Bea'), dot = at(503, 11, 10, 'Dot');
const chars = [at(260239, 1, 1, 'Farm'), at(221397, 2, 2, 'Laynie'), moo, bea, dot];
const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } }, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => { sent.push([ev, d]); }, ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239], MapData: { Type: 'Always' } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [], ChatRoomMapViewPositionIsBlocked: () => false,
  LZString: { compressToBase64: (t) => Buffer.from(t).toString('base64'), decompressFromBase64: (t) => Buffer.from(t, 'base64').toString() } };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const L = () => W.FarmhandLedger(), P = mn => L().people[mn];
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Whisper', Content: msg, Target: 260239 }); await wait(ms || 900); };
const said = (n) => sent.slice(n).map(([, d]) => String(d && (d.Content || d.Message) || '')).join(' | ');
const move = (c, X, Y) => { c.MapData.Pos = { X, Y }; handlers.ChatRoomSyncMapData({ MemberNumber: c.MemberNumber, MapData: { Pos: { X, Y } } }); };
const done = async (mn) => { for (let i = 0; i < 600; i++) { await wait(60); if (!(W.__st().trapRuns && W.__st().trapRuns.has(mn))) break; } await wait(400); };
const free = (mn) => { const r = P(mn); if (r) { r.penned = null; r.stocked = null; r.benched = null; r.trapWait = null; r.trapAt = 0; r.spotTrapAt = {}; r.trapQuiet = 0; } };
(async () => {
  await wait(3500);
  const cfg = W.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 1; cfg.TRAP_BEAT_S = 0.03; cfg.CHAIN_CHANCE = 0; cfg.WILD.CHAIN = 0; cfg.AFTER_CHANCE = 0;
  for (const mn of [500, 501, 503]) await say(mn, '?stats', 300);

  // ── the morphin' draught ──
  let n = sent.length; await say(501, '?species pig');
  ok(P(501).species === 'cow' && /morphin' draught/.test(said(n)) && /25 ribbons/.test(said(n)), '?species, a cow tryin\' to be a pig: that takes a morphin\' draught now, 25 ribbons');
  await say(501, '?species hucow');
  ok(P(501).species === 'hucow', '...callin\' themselves a hucow, the same kind: still free');
  P(501).ribbons = 30; n = sent.length; await say(501, '?buy morph pig', 1200);
  ok(P(501).morph && P(501).morph.kind === 'pig' && P(501).ribbons === 5, '?buy morph pig: 25 ribbons, and the change starts (' + P(501).ribbons + ' left)');
  ok(/morphin' draught|draught/.test(said(n)), '...the room sees it go down: ' + said(n).slice(0, 120));
  n = sent.length; P(501).contractDressedAt = 5;
  const m = P(501).morph; m.at = Date.now() - 31 * 60000; m.until = Date.now() - 60000; W.__morphTick(); await wait(500);
  const story = said(n);
  ok(P(501).species === 'pig' && !P(501).morph, 'half an hour on: a pig, for good');
  ok(/floppy pig ears/.test(story) && /curly pink tail/.test(story) && /trotters/.test(story) && /happy grunt/.test(story), '...ears, then tail, then trotters, then the grunt, in front of everybody');
  ok(P(501).outfitOwed && /pig/.test(P(501).outfitOwed.slot), '...and dressed by the farm, so the farm dresses them again as a pig (' + (P(501).outfitOwed && P(501).outfitOwed.slot) + ')');
  n = sent.length; P(501).ribbons = 30; await say(501, '?buy morph piggy');
  ok(P(501).ribbons === 30 && /already a pig/.test(said(n)), '...buyin\' the same kind again: kept their ribbons');

  // ── the ovipositor ──
  await say(503, '?cock ovipositor');
  ok(W.__prodOf(503).penisType === 'ovipositor' || /ovipositor/.test(said(sent.length - 3)), '?cock ovipositor: a cock type');
  const p5 = W.__prodOf(500); p5.eggs = null; p5.preg = null;
  n = sent.length; await say(503, '?cum Moo vulva', 1500);
  ok(p5.eggs && p5.eggs.n > 0 && !p5.preg, 'an ovipositor in Moo, who\'s said ?eggs on: a clutch of ' + (p5.eggs && p5.eggs.n) + ' eggs, and nothin\' that catches');
  ok(/ovipositor/.test(said(n)), '...and the room hears it lay: ' + (said(n).match(/[^|]*ovipositor[^|]*/) || [''])[0].slice(0, 130));

  // ── the spiders, in the wild traps ──
  cfg.SPIDERS.CHANCE.pasture = 1; cfg.SPIDERS.CHANCE.barn = 1; cfg.SPIDERS.LAB_CHANCE = 0;
  const odd = W.__wildOdd(500, { g: 'pasture' });
  ok(odd && ['drider', 'trapdoor'].includes(odd.kind) && odd.area === 'spider', 'a wild tile in the pasture: sometimes it\'s a spider (' + (odd && odd.kind) + ')');
  ok(['weaver', 'trapdoor'].includes((W.__wildOdd(500, { g: 'barn' }) || {}).kind), '...in the barn, the weaver or the trapdoor');
  n = sent.length; await say(500, '?traps theme spiders off');
  ok(!W.__wildOdd(500, { g: 'pasture' }) && /spider/i.test(said(n)), 'arachnophobic: ?traps theme spiders off, and no spider ever has them');
  await say(500, '?traps theme spiders on');
  // a real one: step on a wild tile in the pasture
  W.__wildTick(); free(500); W.__prodOf(500).eggs = null; P(500).gear = {}; P(500).ribbons = 0;
  const w = W.__wild()[0]; w.X = 30; w.Y = 8; w.g = 'pasture'; w.zone = 'pasture'; w.moveAt = Date.now() + 3600000;
  n = sent.length; move(moo, 30, 8); await wait(80); await done(500); await wait(3600);
  const last = (P(500).trapLog || []).slice(-1)[0] || {};
  ok(['drider', 'trapdoor'].includes(last.kind), 'stepped on it: a spider had them (' + last.kind + ')');
  ok(W.__prodOf(500).eggs && W.__prodOf(500).eggs.n > 0, '...and laid in them: ' + (W.__prodOf(500).eggs && W.__prodOf(500).eggs.n) + ' eggs');
  ok(P(500).silk > 0 && P(500).ribbons >= 2, '...and they came out wrapped in silk, sold on the spot: ' + P(500).silk + ' yards, ' + P(500).ribbons + ' ribbons');
  const g = Object.values(P(500).gear || {});
  ok(g.some(x => x.keep && /Cocoon|Silk|Lace|Hogtie/.test(x.label) && (x.items || []).some(i => /Web/.test(i))), '...left cocooned in the game\'s own web, till somebody else cuts them out (' + g.map(x => x.label).join(', ') + ')');
  ok(!g.some(x => /drip of/.test(x.desc)), '...and no venom dripped in: they haven\'t switched wild traps laced on');
  const sp = said(n);
  ok(/ovipositor/.test(sp) && /silk/.test(sp), '...in the spider\'s own words: ' + (sp.match(/[^|]*(drops out of the canopy|trapdoor of silk|silk-hinged)[^|]*/) || [''])[0].slice(0, 120));

  // ── the lab, behind receivin' ──
  cfg.SPIDERS.LAB_CHANCE = 1;
  const lab = W.__wildOdd(500, { g: 'receiving' });
  ok(lab && lab.kind === 'labtest' && lab.area === 'lab', 'a wild tile in receivin\': sometimes it\'s the lab');
  free(500); P(500).gear = {}; P(500).wildLaced = true;
  const w2 = W.__wild()[0]; w2.X = 18; w2.Y = 18; w2.g = 'receiving'; w2.zone = 'receiving'; w2.moveAt = Date.now() + 3600000;
  n = sent.length; move(moo, 10, 10); await wait(50); move(moo, 18, 18); await wait(80); await done(500);
  const g2 = Object.values(P(500).gear || {});
  const proto = g2.find(x => /Milker Mk II|Stimulator|Silk Gland|Obedience Collar/.test(x.label));
  ok(((P(500).trapLog || []).slice(-1)[0] || {}).kind === 'labtest' && !!proto, 'the doc fits a prototype and sends them out to field-test it (' + g2.map(x => x.label).join(', ') + ')');
  ok(proto && /lactation|fertility|egg laying|obedience/.test(proto.desc), '...with the farm\'s own tags on it, that the farm girl reads while it\'s worn: ' + (proto && proto.desc.slice(0, 90)));
  ok(g2.some(x => /injector|drip|when touched|on climax|when spanked/i.test(x.desc)), '...and with wild traps laced on, the Dispensary\'s words too');
  ok(/lab|doc|prototype|trial/i.test(said(n)), '...in the lab\'s own words');
  // ── one thing has them at a time (Nov 24; Laynie: "trap suppression when being led by the farm, like to start a hypno session") ──
  free(500); P(500).gear = {}; await wait(300);
  ok(!W.__farmBusy(500) && !W.__trapWhyNot(500, 'drider'.replace('drider', 'snare')), 'nothin\' has them: a trap can');
  W.__lead(500, { X: 3, Y: 3 });
  ok(/walkin' them/.test(W.__farmBusy(500)) && /walkin' them/.test(W.__trapWhyNot(500, 'snare') || ''), 'the farm walkin\' them somewhere: no trap springs on them, not even by hand');
  const wildN = (P(500).trapLog || []).length, w3 = W.__wild()[0]; w3.X = 31; w3.Y = 9; w3.g = 'pasture'; w3.moveAt = Date.now() + 3600000;
  move(moo, 31, 9); await wait(300);
  ok((P(500).trapLog || []).length === wildN && !W.__wildOn(500), '...and a wild tile they cross on the way leaves them be');
  W.__st().leads.clear();
  W.__st().echs = W.__st().echs || new Map(); W.__st().echs.set(500, { phase: 'InductionInProgress', at: Date.now(), by: 260239 });
  ok(/trance/.test(W.__trapWhyNot(500, 'snare') || ''), 'reachin\' for their ECHS, or under with the farm girl: no trap either');
  W.__st().echs.delete(500);
  ok(!W.__farmBusy(500), '...and once she lets them go, the traps are back');
  ok(!warns.some(x => /spider|lab|morph|wild/i.test(x)), 'no errors: ' + warns.filter(x => /spider|lab|morph|wild/i.test(x)).slice(0, 2).join(' | '));
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
