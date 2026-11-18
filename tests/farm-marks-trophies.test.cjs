// TROPHIES, THE FARM'S MARKS AND THE TRAP PASSPORT (Nov 18). Laynie: trophies "should be offered, and if its a permanent
// trophy, have a way to equip or take it off at any time"; trap brands "newest wins, or we can include hidden slots the
// farm uses, that can be removed with ?wash unless permanently branded"; and a belly toggle: "the drawn belly, basically
// show/hide belly".
const fs = require('fs'), path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const H = 3600000, DAY = 24 * H;

(async () => {
  // ── the ink module, on a stand-in game: the hidden mark slots, and trophies ──
  {
    const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-marks-' + process.pid + '.cjs');
    await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/ink/ink.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
    const INK = require(tmp); fs.unlinkSync(tmp);
    const LIST = require('../shared/ink/ink-designs.json');
    const store = {};
    const W = { addEventListener() {}, AssetGroupMap: new Map(), AssetGroup: [], AssetFemale3DCGExtended: {}, localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => (store[k] = String(v)) } };
    for (let i = 0; i < 40; i++) { const g = { Name: 'G' + i, Asset: [] }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); }
    W.AssetGroupAdd = (fam, def) => { const g = { Family: fam, Name: def.Group, Description: def.Group, Asset: [], def }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); return g; };
    W.AssetAdd = (G, def) => { const a = { Name: def.Name, Description: def.Name, Group: G, Layer: def.Layer, DefaultColor: def.DefaultColor, def }; G.Asset.push(a); return a; };
    W.AssetBaseURL = (C, group, groupName) => 'Assets/Female3DCG/' + groupName + '/';
    W.AssetGetPreviewPath = (A) => 'Assets/Female3DCG/' + A.Group.Name + '/Preview';
    W.AssetBuildDescription = () => {}; W.AssetLoadAll = () => {};
    let toDraw = [];
    W.CommonDrawAppearanceBuild = (C, cb) => { for (const [s, o] of toDraw) cb.drawImageColorize(s, 0, 0, Object.assign({}, o)); };
    const P = W.Player = { MemberNumber: 500, Appearance: [], IsPlayer: () => true };
    let updates = 0;
    W.InventoryWear = (C, name, group, color) => { const G = W.AssetGroupMap.get(group), A = G && G.Asset.find((a) => a.Name === name); if (!A) return; C.Appearance = C.Appearance.filter((it) => it.Asset.Group.Name !== group); C.Appearance.push({ Asset: A, Color: color, Property: {} }); };
    W.InventoryRemove = (C, group) => { C.Appearance = C.Appearance.filter((it) => it.Asset.Group.Name !== group); };
    W.CharacterRefresh = () => {}; W.ChatRoomCharacterUpdate = () => updates++;
    W.WardrobeFastLoad = (C) => { C.Appearance = []; };   // (an outfit from the wardrobe: everything off, the outfit on)
    const mod = { hookFunction(fn, pri, h) { const orig = W[fn]; W[fn] = function (...args) { return h(args, (a) => orig.apply(this, a)); }; } };
    const st = INK.registerInk(W, mod);
    await wait(150);
    const inSlot = (s) => P.Appearance.find((it) => it.Asset.Group.Name === s);
    const wear = (s, name) => W.InventoryWear(P, name, s, 'Default');
    const now = Date.now();

    const G1 = W.AssetGroupMap.get('FarmMark1');
    ok(['FarmMark1', 'FarmMark2', 'FarmMark3'].every((s) => W.AssetGroupMap.get(s) && W.AssetGroupMap.get(s).def.AllowCustomize === false), 'three Farm Mark slots, kept out of the wardrobe (AllowCustomize: false)');
    ok(G1.Asset.length === LIST.groups.FarmBrand.length && W.AssetGroupMap.get('FarmInk1').def.AllowCustomize === undefined, '...holdin\' the brands, and the wardrobe\'s own ink slots still show');
    const tr = LIST.groups.FarmBrand.find((a) => a.name === 'TentacleRingBrand'), trDef = G1.Asset.find((a) => a.Name === 'TentacleRingBrand').def;
    ok(Math.abs(trDef.Left + tr.w / 2 - 296) < 1 && Math.abs(trDef.Top + tr.h / 2 - 580) < 1, 'Farm Mark 1 sits on the other hip from your own brand (' + (trDef.Left + tr.w / 2) + ', ' + (trDef.Top + tr.h / 2) + ')');
    ok(/\/ink\/v2\/FarmMark1\/$/.test(W.AssetBaseURL(P, null, 'FarmMark1')), 'a mark\'s pictures: an address of our own (' + W.AssetBaseURL(P, null, 'FarmMark1') + ')');

    const tent = { id: 'mark:TentacleRingBrand:1', slot: 'mark', design: 'TentacleRingBrand', at: now, heal: 3 * DAY };
    const paw = { id: 'mark:MoonPawBrand:2', slot: 'mark', design: 'MoonPawBrand', at: now, heal: 3 * DAY };
    wear('FarmBrand', 'Hucow'); wear('FarmInk1', 'KnotSlave');
    let r = st.farm([tent], true);
    const m1 = inSlot('FarmMark1');
    ok(m1 && m1.Asset.Name === 'TentacleRingBrand' && m1.Property.FarmInk.farm === tent.id && m1.Property.FarmInk.heal === 3 * DAY, 'a trap\'s mark goes in Farm Mark 1, marked the farm\'s, healin\' three days');
    ok(inSlot('FarmBrand').Asset.Name === 'Hucow' && inSlot('FarmInk1').Asset.Name === 'KnotSlave' && !inSlot('FarmInk2'), '...never in their own slots: their brand and ink stay as they were');
    ok(r.marked.join() === 'TentacleRingBrand' && !r.put.length && !r.taken.length, '...and it\'s news as a mark, not as wardrobe ink');
    r = st.farm([tent, paw], true);
    ok(inSlot('FarmMark2') && inSlot('FarmMark2').Asset.Name === 'MoonPawBrand' && inSlot('FarmMark1').Asset.Name === 'TentacleRingBrand', 'a second mark: the next hidden slot');
    W.InventoryRemove(P, 'FarmMark1');
    r = st.farm([tent, paw], true);
    ok(inSlot('FarmMark1') && inSlot('FarmMark1').Asset.Name === 'TentacleRingBrand' && !r.marked.length, 'a mark gone missin\': straight back on, quietly (only ?wash takes them off)');
    W.WardrobeFastLoad(P, 0, true);
    ok(inSlot('FarmMark1') && inSlot('FarmMark2') && !inSlot('FarmBrand'), 'an outfit from the wardrobe: their own ink goes with the outfit, the farm\'s marks stay on');
    const tent2 = Object.assign({}, tent, { id: 'mark:TentacleRingBrand:9', at: now + 1000 });
    st.farm([tent2, paw], true);
    ok(inSlot('FarmMark1') && inSlot('FarmMark1').Property.FarmInk.farm === tent2.id && !inSlot('FarmMark3'), 'the same trap again: seared fresh in its place (newest wins), not a second one');
    r = st.farm([paw], true);
    ok(!inSlot('FarmMark1') && inSlot('FarmMark2') && r.off.join() === 'TentacleRingBrand', 'washed off (the farm\'s list drops it): it comes off');
    // drawn: the brand's own picture, at the slot's size, healin'
    P.Appearance = []; INK.farmInkSync(W, [Object.assign({}, paw, { at: now - 1.5 * DAY })], true);
    toDraw = [['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmMark1/MoonPawBrand_Brand.png', { HexColor: '#b4524a' }]];
    let got = []; W.CommonDrawAppearanceBuild(P, { drawImage: () => {}, drawImageColorize: (s, x, y, o) => got.push([s, o]) });
    const mid = INK.healedHex('#b4524a', 'Brand', 0.5);
    ok(got.length === 1 && got[0][0] === 'https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmBrand/MoonPawBrand_Brand.png', 'drawn from the brand\'s own picture (' + (got[0] && got[0][0]) + ')');
    ok(got[0][1].HexColor === mid && got[0][1].ScaleX > 0.15 && got[0][1].ScaleX < 0.45, '...healin\' like any of the farm\'s, at the slot\'s size (' + got[0][1].HexColor + ', ' + got[0][1].ScaleX.toFixed(3) + ')');
    toDraw = [['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmMark3/MoonPawBrand_Brand.png', { HexColor: '#b4524a' }]];
    got = []; W.CommonDrawAppearanceBuild(P, { drawImage: () => {}, drawImageColorize: (s, x, y, o) => got.push(s) });
    ok(!got.length, 'a mark slot with nothin\' (or somethin\' else) in it draws nothin\'');
    st.farm([paw], false);
    ok(!P.Appearance.some((it) => /^FarmMark/.test(it.Asset.Group.Name)), '"Farm can ink me" off: the marks come off too');

    // trophies
    P.Appearance = []; store['farmink-done-500'] = '{}';
    st.counts({ punches: 3, loads: 3, passport: ['THE POND', 'THE WOLF DEN'] });
    r = st.trophyWear({ id: 'card', design: 'LiveBreedingCard' });
    const c1 = inSlot('FarmInk1');
    ok(r.ok && r.slot === 'FarmInk1' && c1 && c1.Asset.Name === 'LiveBreedingCard' && c1.Property.FarmInk.trophy === 'card' && c1.Property.FarmInk.n === 3, 'Wear it: the Breeding Card in the first free ink slot, marked a trophy, with the farm\'s count (3 punches)');
    ok(JSON.stringify(st.trophyWorn()) === '{"card":"FarmInk1"}', '...and the Trophies row knows it\'s on');
    st.farm([], true);
    ok(inSlot('FarmInk1') && inSlot('FarmInk1').Asset.Name === 'LiveBreedingCard', 'the farm\'s own ink sync never takes a trophy off');
    r = st.trophyWear({ id: 'passport', design: 'LiveTrapPassport' });
    ok(r.ok && inSlot('FarmInk2').Property.FarmInk.list.join() === 'THE POND,THE WOLF DEN', 'the Trap Passport: a stamp for each place a trap had them');
    r = st.trophyOff('card');
    ok(r.ok && !inSlot('FarmInk1') && !st.trophyWorn().card, 'Take it off: off, any time');
    r = st.trophyWear({ id: 'card', design: 'LiveBreedingCard' });
    ok(r.ok && inSlot('FarmInk1').Asset.Name === 'LiveBreedingCard', '...and on again whenever they like');
    P.Appearance = [];
    for (const s of ['FarmInk1', 'FarmInk2', 'FarmInk3', 'FarmInk4']) wear(s, 'KnotSlave');
    r = st.trophyWear({ id: 'tied', design: 'LiveTied' });
    ok(!r.ok && r.full && r.slots.length === 4 && r.slots[2].name === 'Farm Ink 3', 'four slots full: it says so, and which slots hold what');
    r = st.trophyWear({ id: 'tied', design: 'LiveTied' }, 'FarmInk3');
    ok(r.ok && inSlot('FarmInk3').Asset.Name === 'LiveTied' && inSlot('FarmInk2').Asset.Name === 'KnotSlave', '...and they pick one: it goes on in place of what was there');
    ok(!st.trophyWear({ id: 'x', design: 'Hucow' }).ok && !st.trophyWear({ id: 'BAD ID', design: 'LiveTied' }).ok, 'nothin\' that isn\'t a live design, or with a strange name, goes on as a trophy');
  }

  // ── the farm girl: trophies earned, the marks, the passport, ?wash, ?marks, ?brand ──
  {
    const store = {}, sent = [], handlers = {};
    const person = (mn, name, gender, species, roles) => ({ mn, name, gender, species, roles: roles || ['LIVESTOCK'], onDuty: true, herds: [], tempKeys: [], cover: [] });
    const people = { '221397': person(221397, 'Laynie', 'female', '', ['PROPRIETOR']), '500': person(500, 'Moo', 'female', 'cow'), '600': person(600, 'Bull', 'male', 'cow') };
    store.bnb_ledger_v1 = JSON.stringify({ v: 4, people, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
    global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
    const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
    const at = (m) => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } });
    const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
      ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
      Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239] }, ChatRoomCharacter: [at(260239), at(221397), at(500), at(600)],
      ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} } };
    global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
    const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => { const t = a.join(' '); if (!/Worker/.test(t)) warns.push(t); } };
    W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
    await wait(3000); W.__cfg.SEND_INTERVAL_MS = 2; W.__cfg.USER_COOLDOWN_S = 0; W.__cfg.WASH_BEAT_S = 0.05;
    const sayAs = async (mn, text) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Chat', Content: text }); await wait(600); };
    const said = (n) => JSON.stringify(sent.slice(n));
    const L = W.FarmhandLedger(), moo = L.people['500'];
    const S = (mn) => W.__stateFor(mn);
    const marks = (mn) => (S(mn).farmInk || []).filter((e) => e.slot === 'mark');
    W.__st().companions.set(500, { at: Date.now(), ver: '0.63.0' });

    // trophies
    ok(!S(500).trophies, 'nothin\'s happened to her yet: no trophies');
    const p = W.__prodOf(500); p.totals = Object.assign(p.totals || {}, { loads: 1, by: { 600: { n: 1, at: Date.now() } } });
    let tr = S(500).trophies || [];
    ok(tr.length === 1 && tr[0].id === 'card' && tr[0].design === 'LiveBreedingCard' && tr[0].why && tr[0].at > 0, 'her first load: the Breeding Card trophy (' + JSON.stringify(tr) + ')');
    const firstAt = tr[0].at; await wait(20);
    ok(S(500).trophies[0].at === firstAt && moo.trophies.card === firstAt, '...kept on her record from the first time, for good');
    p.totals.tied = 1; p.totals.loads = 30; p.totals.by[600].n = 6;
    ok(['card', 'tied', 'scores', 'bred'].every((id) => S(500).trophies.some((t) => t.id === id)), 'her first knot, a stud who\'s bred her five times, twenty-five loads: three more');
    p.totals.loads = 0;
    ok(S(500).trophies.some((t) => t.id === 'bred'), 'a trophy stays earned, whatever the counts do after');

    // a trap that marks its own
    let n = sent.length;
    W.__trapEnded(500, 'tentacle', {});
    ok(marks(500).length === 1 && marks(500)[0].design === 'TentacleRingBrand' && marks(500)[0].heal === 3 * DAY, 'the pond lets her go: its tentacle ring, for her Farm Mark slots (' + JSON.stringify(marks(500)) + ')');
    ok(S(500).ink.passport.join() === 'THE POND' && S(500).trophies.some((t) => t.id === 'passport'), '...a stamp in her passport, and the Trap Passport trophy');
    await wait(6600);
    ok(/tentacle|pond/i.test(said(n)) && /\?wash scrubs it off/.test(said(n)), '...the room hears it seared on, and she\'s told ?wash scrubs it off');
    moo.trapLog = (moo.trapLog || []).concat({ t: Date.now(), kind: 'wolves', spot: 'trap-wolves' });
    W.__trapEnded(500, 'wolves', {});
    ok(marks(500).map((e) => e.design).join() === 'TentacleRingBrand,MoonPawBrand' && S(500).ink.passport.join() === 'THE POND,THE WOLF DEN', 'the wolf pack: its moon paw too, and the wolf den in her passport');
    const firstTent = marks(500)[0].id; await wait(10);
    W.__trapEnded(500, 'tentacle', {});
    ok(marks(500).length === 2 && marks(500)[1].design === 'TentacleRingBrand' && marks(500)[1].id !== firstTent, 'the pond again: the same mark seared fresh (newest wins), never two');
    W.__trapEnded(500, 'milker', {});
    ok(marks(500).length === 2 && S(500).ink.passport.length === 4, 'a trap that leaves no mark: just a stamp (the passport keeps the last four)');

    // ?marks, ?wash
    n = sent.length; await sayAs(500, '?marks');
    ok(/tentacle ring/.test(said(n)) && /moon paw/.test(said(n)) && /\?marks keep/.test(said(n)), '?marks: what the farm\'s marked on her, and how to keep them');
    n = sent.length; await sayAs(500, '?wash'); await wait(4500);
    ok(!marks(500).length && !moo.marks, '?wash: the farm\'s marks scrub off');
    const washLine = (said(n).match(/[^"]{0,120}(?:tentacle ring and moon paw|moon paw and tentacle ring)[^"]{0,60}/) || [''])[0];
    ok(/scrub/i.test(washLine), '...with a line sayin\' so (' + washLine + ')');
    W.__trapEnded(500, 'boar', {}); await wait(6600);
    n = sent.length; await sayAs(500, '?marks keep');
    ok(moo.marks.length === 1 && moo.marks[0].keep === 1 && /for good/.test(said(n)), '?marks keep: the boar\'s ring, on for good, her own choice');
    W.__trapEnded(500, 'tentacle', {}); await wait(100);
    n = sent.length; await sayAs(500, '?wash'); await wait(6500);
    ok(moo.marks.length === 1 && moo.marks[0].d === 'SnoutRingBrand' && marks(500).length === 1, '?wash: the fresh tentacle ring scrubs off, the kept boar\'s ring doesn\'t');
    ok(/nothin' budges|won't shift/.test(said(n)), '...and the room hears it didn\'t budge');
    await sayAs(600, '?brand Moo clear');
    ok(moo.marks.length === 1, 'somebody who isn\'t staff can\'t clear them');
    n = sent.length; await sayAs(221397, '?brand Moo clear');
    ok(!moo.marks && !marks(500).length && /marks are off/.test(said(n)), '?brand <who> clear (a proprietor): every mark off, kept ones too');
    W.__trapEnded(500, 'wolves', {});
    await sayAs(221397, '?brand Moo keep');
    ok(moo.marks.length === 1 && moo.marks[0].keep === 1, '?brand <who> keep (a proprietor): on for good');

    // when the farm doesn't mark
    moo.limits = 'no brands please'; ok(!marks(500).length, 'her limits rule out brands: no marks go on her (and ones she had come off)');
    moo.limits = ''; moo.marks = null;
    W.__st().companions.set(500, { at: Date.now(), ver: '0.62.0' });
    W.__trapEnded(500, 'tentacle', {});
    ok(!moo.marks && !marks(500).length, 'a Companion too old for the mark slots: no mark');
    W.__st().companions.set(500, { at: Date.now(), ver: '0.63.0', off: { ink: true } });
    W.__trapEnded(500, 'tentacle', {});
    ok(!moo.marks, '"Farm can ink me" off: no mark');
    ok(W.__stampOf('trap-theme-kennel', 'kennel') === 'THE KENNELS' && W.__stampOf('', 'tentacle') === 'THE POND' && W.__stampOf('', 'zzz') === 'B&B FARM', 'passport stamps: the place, the pond, else the farm');
    const errs = warns.filter((w) => /TypeError|ReferenceError/i.test(w)); ok(!errs.length, 'no errors in the bot ' + errs.join(' | ').slice(0, 300));
  }

  // ── the Companion: the belly toggle and the trophy row ──
  {
    const comp = fs.readFileSync(path.join(__dirname, '../dist/farmhand-companion.user.js'), 'utf8');
    ok(comp.includes('"Show my drawn belly"') && /"(?:\\u\{1F3C6\}|🏆) Trophies"/u.test(comp) && comp.includes('"Wear it"') && comp.includes('"No thanks"'), 'the Companion has the belly toggle, and the Trophies row with Wear it and No thanks');
  }
  out(fails ? '\n❌ ' + fails + ' failed' : '\n✅ all good'); process.exit(fails ? 1 : 0);
})();
