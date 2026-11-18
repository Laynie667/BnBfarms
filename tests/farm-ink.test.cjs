// THE FARM'S OWN INK (Nov 18; approved Nov 17). Laynie: "Farm can ink me" is its own switch, studs get "either" brand,
// three days to heal and marker and henna as planned ("seems good to me"). The farm girl says what should be inked on
// somebody (farmInk in their panel state); their own game puts it in the brand slot or a free ink slot, never over ink
// they picked, heals a brand from angry red to pale, wears marker and henna away, and takes it all off with the switch.
const fs = require('fs'), path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const H = 3600000, DAY = 24 * H;

(async () => {
  // ── the ink module, on a stand-in game ──
  {
    const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-farmink-' + process.pid + '.cjs');
    await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/ink/ink.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
    const INK = require(tmp); fs.unlinkSync(tmp);
    const store = {}, listeners = [];
    const W = { addEventListener: (t, f) => { if (t === 'farmhand-dispensary') listeners.push(f); }, AssetGroupMap: new Map(), AssetGroup: [], AssetFemale3DCGExtended: {}, localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => (store[k] = String(v)) } };
    for (let i = 0; i < 40; i++) { const g = { Name: 'G' + i, Asset: [] }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); }
    W.AssetGroupAdd = (fam, def) => { const g = { Family: fam, Name: def.Group, Description: def.Group, Asset: [], def }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); return g; };
    W.AssetAdd = (G, def) => { const a = { Name: def.Name, Description: def.Name, Group: G, Layer: def.Layer, DefaultColor: def.DefaultColor }; G.Asset.push(a); return a; };
    W.AssetBaseURL = (C, group, groupName) => 'Assets/Female3DCG/' + groupName + '/';
    W.AssetGetPreviewPath = (A) => 'Assets/Female3DCG/' + A.Group.Name + '/Preview';
    W.AssetBuildDescription = () => {}; W.AssetLoadAll = () => {};
    let toDraw = [];
    W.CommonDrawAppearanceBuild = (C, cb) => { for (const [s, o] of toDraw) cb.drawImageColorize(s, 0, 0, Object.assign({}, o)); };
    const P = W.Player = { MemberNumber: 500, Appearance: [] };
    let updates = 0;
    W.InventoryWear = (C, name, group, color) => { const G = W.AssetGroupMap.get(group), A = G && G.Asset.find((a) => a.Name === name); if (!A) return; C.Appearance = C.Appearance.filter((it) => it.Asset.Group.Name !== group); C.Appearance.push({ Asset: A, Color: color, Property: {} }); };
    W.InventoryRemove = (C, group) => { C.Appearance = C.Appearance.filter((it) => it.Asset.Group.Name !== group); };
    W.CharacterRefresh = () => {}; W.ChatRoomCharacterUpdate = () => updates++;
    const mod = { hookFunction(fn, pri, h) { const orig = W[fn]; W[fn] = function (...args) { return h(args, (a) => orig.apply(this, a)); }; } };
    const st = INK.registerInk(W, mod);
    await wait(150);
    const inSlot = (s) => P.Appearance.find((it) => it.Asset.Group.Name === s);
    const wear = (s, name) => W.InventoryWear(P, name, s, 'Default');
    const now = Date.now();
    const brand = { id: 'brand:Hucow:1', slot: 'brand', design: 'Hucow', at: now, heal: 3 * DAY };
    const corrupt = { id: 'corrupt50:BRED', slot: 'ink', design: 'BredCorrupted', keep: 1 };

    let r = st.farm([brand], false);
    ok(r && !r.put.length && !inSlot('FarmBrand'), 'switch off: nothin\'s put on');
    r = st.farm([brand, corrupt], true);
    const b = inSlot('FarmBrand'), c1 = inSlot('FarmInk1');
    ok(b && b.Asset.Name === 'Hucow' && b.Property.FarmInk.farm === brand.id && b.Property.FarmInk.heal === 3 * DAY, 'switched on: the farm\'s brand goes in the brand slot, marked the farm\'s, healin\' over three days');
    ok(c1 && c1.Asset.Name === 'BredCorrupted' && c1.Property.FarmInk.keep === 1, '...and the corruption\'s words in the first ink slot');
    ok(r.put.length === 2 && updates === 1, 'the room\'s told once for both');
    ok(Array.isArray(b.Color) && b.Color.join() === '#5e1414,#b4524a,#f2b9a8', 'a brand goes on in its fresh colours');
    r = st.farm([brand, corrupt], true);
    ok(!r.put.length && !r.off.length && updates === 1, 'the same list again: nothin\' changes');

    // their own ink stays theirs
    P.Appearance = []; store['farmink-done-500'] = '{}';
    wear('FarmInk1', 'KnotSlave'); wear('FarmBrand', 'MoonPawBrand');
    r = st.farm([brand, corrupt], true);
    ok(inSlot('FarmBrand').Asset.Name === 'MoonPawBrand' && r.taken.join() === 'Hucow', 'their own brand in the slot: the farm\'s doesn\'t go over it');
    ok(inSlot('FarmInk1').Asset.Name === 'KnotSlave' && inSlot('FarmInk2') && inSlot('FarmInk2').Asset.Name === 'BredCorrupted', '...and the farm\'s ink goes in a free slot, not over theirs');
    P.Appearance = []; store['farmink-done-500'] = '{}';
    for (const s of ['FarmInk1', 'FarmInk2', 'FarmInk3', 'FarmInk4']) wear(s, 'KnotSlave');
    r = st.farm([corrupt], true);
    ok(r.full.join() === 'BredCorrupted' && ['FarmInk1', 'FarmInk2', 'FarmInk3', 'FarmInk4'].every((s) => inSlot(s).Asset.Name === 'KnotSlave'), 'four slots full of their own: nothin\' goes over, and they\'re told');

    // takin' it off
    P.Appearance = []; store['farmink-done-500'] = '{}';
    st.farm([brand, corrupt], true);
    W.InventoryRemove(P, 'FarmBrand'); W.InventoryRemove(P, 'FarmInk1');
    r = st.farm([brand, corrupt], true);
    ok(!inSlot('FarmBrand') && !inSlot('FarmInk1') && !r.put.length, 'they take the farm\'s off themselves: it stays off (the corruption\'s too, till mornin\')');
    r = INK.farmInkSync(W, [brand, corrupt], true, now + 21 * H);
    ok(!inSlot('FarmBrand') && inSlot('FarmInk1') && inSlot('FarmInk1').Asset.Name === 'BredCorrupted', '...and by mornin\' the corruption\'s words are back, the brand not');
    r = st.farm([], true);
    ok(!inSlot('FarmInk1') && r.off.join() === 'BredCorrupted', 'the farm\'s list drops it (the mark lifted): it comes off');
    P.Appearance = []; store['farmink-done-500'] = '{}';
    wear('FarmInk1', 'KnotSlave'); st.farm([brand, corrupt], true);
    r = st.farm([brand, corrupt], false);
    ok(!inSlot('FarmBrand') && !inSlot('FarmInk2') && inSlot('FarmInk1').Asset.Name === 'KnotSlave', 'switch off: the farm\'s ink comes off, theirs stays');

    // marker wears off
    P.Appearance = []; store['farmink-done-500'] = '{}';
    const marker = { id: 'writ:1', slot: 'ink', design: 'UseMeFreshMarker', at: now - 7 * H };
    r = st.farm([marker], true);
    ok(!inSlot('FarmInk1') && !r.put.length, 'marker put on seven hours ago: worn off already, never goes on');
    const marker2 = { id: 'writ:2', slot: 'ink', design: 'UseMeFreshMarker', at: now };
    st.farm([marker2], true);
    ok(inSlot('FarmInk1') && inSlot('FarmInk1').Property.FarmInk.fade === 6 * H, 'fresh marker goes on, wearin\' off in a few hours (6)');
    r = INK.farmInkSync(W, [marker2], true, now + 6 * H + 1);
    ok(!inSlot('FarmInk1') && r.off.join() === 'UseMeFreshMarker', '...and once it\'s worn away it comes off by itself');
    ok(INK.FADE_OF.HennaTrail === 7 * DAY, 'henna: a week');

    // healin' and fadin', as it's drawn
    const near = (a, b2) => Math.abs(a - b2) < 1e-6;
    ok(INK.healedHex('#b4524a', 'Brand', 0) === '#b4524a' && INK.healedHex('#b4524a', 'Brand', 1) === '#e2b8ac', 'a brand\'s core: angry red fresh, pale once healed');
    ok(INK.healedHex('#5e1414', 'BrandEdge', 1) === '#966058' && INK.healedHex('#123456', 'Ink', 1) === '#123456', '...its edge softens; ink that isn\'t a brand doesn\'t heal to another colour');
    const mid = INK.healedHex('#b4524a', 'Brand', 0.5);
    ok(mid !== '#b4524a' && mid !== '#e2b8ac', 'half way through: half healed (' + mid + ')');
    P.Appearance = []; store['farmink-done-500'] = '{}';
    INK.farmInkSync(W, [Object.assign({}, brand, { at: now - 1.5 * DAY })], true);
    toDraw = [['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmBrand/Hucow_Brand.png', { HexColor: '#b4524a' }],
              ['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmBrand/Hucow_BrandEdge.png', { HexColor: '#5e1414' }]];
    let got = []; W.CommonDrawAppearanceBuild(P, { drawImage: () => {}, drawImageColorize: (s, x, y, o) => got.push(o) });
    ok(got.length === 2 && got[0].HexColor === mid && got[1].HexColor !== '#5e1414', 'drawn a day and a half in: half healed, on every screen (' + got.map((o) => o.HexColor).join(', ') + ')');
    P.Appearance = []; store['farmink-done-500'] = '{}';
    INK.farmInkSync(W, [Object.assign({}, marker2, { at: now - 5 * H })], true);
    toDraw = [['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmInk/UseMeFreshMarker_Ink.png', { HexColor: '#151c3c' }]];
    got = []; W.CommonDrawAppearanceBuild(P, { drawImage: () => {}, drawImageColorize: (s, x, y, o) => got.push(o) });
    ok(got.length === 1 && got[0].Alpha > 0.3 && got[0].Alpha < 0.5, 'marker five hours on: goin\' (' + (got[0] && got[0].Alpha) + ')');
    const a1 = INK.ageOf({ at: now - 2 * H, fade: 6 * H }, now);
    ok(a1.alpha === 1, '...and two hours on, still all there');
    P.Appearance = []; wear('FarmBrand', 'Hucow');
    toDraw = [['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmBrand/Hucow_Brand.png', { HexColor: '#b4524a' }]];
    got = []; W.CommonDrawAppearanceBuild(P, { drawImage: () => {}, drawImageColorize: (s, x, y, o) => got.push(o) });
    ok(got[0].HexColor === '#b4524a' && got[0].Alpha === undefined, 'a brand they put on themselves: drawn just as they coloured it');
    // what a later /ink size keeps
    P.Appearance = []; store['farmink-done-500'] = '{}';
    st.farm([brand], true); st.write('FarmBrand', { sz: 1.5 });
    ok(inSlot('FarmBrand').Property.FarmInk.farm === brand.id && inSlot('FarmBrand').Property.FarmInk.sz === 1.5, 'sized in the ink panel: still the farm\'s');

    // hardcore: pulled off, straight back on
    P.Appearance = []; store['farmink-done-500'] = '{}';
    st.farm([brand], true); W.InventoryRemove(P, 'FarmBrand');
    r = st.farm([brand], true);
    ok(!inSlot('FarmBrand'), 'not in hardcore: taken off, it stays off');
    r = st.farm([brand], true, { hard: true });
    ok(inSlot('FarmBrand') && inSlot('FarmBrand').Asset.Name === 'Hucow' && r.put.join() === 'Hucow', 'in hardcore: the farm\'s brand pulled off goes straight back on');
    r = st.farm([brand], false, { hard: true });
    ok(!inSlot('FarmBrand'), '...though the switch off still takes it off (hardcore locks the switch, so only a keyholder can)');

    // glow ink: only while dosed
    P.Appearance = []; wear('FarmInk1', 'GlowSlutGlowInk');
    toDraw = [['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmInk/GlowSlutGlowInk_Glow.png', { HexColor: '#4dfff0' }],
              ['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmInk/GlowSlutGlowInk_GlowInk.png', { HexColor: '#4dfff0' }]];
    const glowDraws = () => { const g2 = []; W.CommonDrawAppearanceBuild(P, { drawImage: () => {}, drawImageColorize: (s) => g2.push(s) }); return g2.length; };
    ok(glowDraws() === 0, 'glow ink with no Dispensary to say what\'s in you: hidden');
    let isDosed = false; W.FarmhandDispensary = { dosedOf: (mn) => mn === 500 && isDosed };
    ok(glowDraws() === 0, '...with nothin\' in you: hidden');
    isDosed = true;
    ok(glowDraws() === 2, '...dosed: it lights up, both layers');
    let redrawn = 0; W.CharacterLoadCanvas = (C) => { if (C === P) redrawn++; };
    const ev = (detail) => { for (const f of listeners) f({ detail }); };
    ev({ type: 'dose', id: 'needy', on: true });
    ok(redrawn === 1, 'a dose goin\' in draws them again, so it shows straight away');
    P.Appearance = []; ev({ type: 'dose', id: 'needy', on: false });
    ok(redrawn === 1, '...nobody wearin\' glow ink: no drawin\' again for it');
    delete W.FarmhandDispensary;
  }

  // ── the farm girl: what she says should be inked on who ──
  {
    const store = {}, sent = [], handlers = {};
    const person = (mn, name, gender, species, roles) => ({ mn, name, gender, species, roles: roles || ['LIVESTOCK'], onDuty: true, herds: [], tempKeys: [], cover: [] });
    const people = { '221397': person(221397, 'Laynie', 'female', '', ['PROPRIETOR']), '500': person(500, 'Moo', 'female', 'cow'), '600': person(600, 'Bull', 'male', 'cow'), '700': person(700, 'Wolfie', 'female', 'wolf girl') };
    store.bnb_ledger_v1 = JSON.stringify({ v: 4, people, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
    global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
    const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
    const at = (m) => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } });
    const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
      ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
      Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239] }, ChatRoomCharacter: [at(260239), at(221397), at(500), at(600), at(700)],
      ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} } };
    global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
    const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => { const t = a.join(' '); if (!/Worker/.test(t)) warns.push(t); } };
    W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
    await wait(3000); W.__cfg.SEND_INTERVAL_MS = 2; W.__cfg.USER_COOLDOWN_S = 0;   // (commands one after another)
    const say = async (text) => { handlers.ChatRoomMessage({ Sender: 221397, Type: 'Chat', Content: text }); await wait(500); };
    const fi = (mn) => W.__stateFor(mn).farmInk || [];
    ok(!fi(500).length, 'nobody branded: nothin\' to ink');
    await say('?brand Moo species');
    let e = fi(500)[0];
    ok(e && e.slot === 'brand' && e.design === 'Hucow' && e.heal === 3 * DAY && /^brand:Hucow:/.test(e.id), 'a cow branded with her species: Hucow, in the brand slot, healin\' three days (' + JSON.stringify(e) + ')');
    await say('?brand Bull stud');
    e = fi(600)[0];
    ok(e && e.design === 'StudService', 'a stud can carry Stud Service');
    await say('?brand Bull species');
    ok(fi(600)[0] && fi(600)[0].design === 'Hucow', '...or his species\' brand, either one (Laynie: "either")');
    await say('?brand Wolfie species');
    ok(fi(700)[0] && fi(700)[0].design === 'SheWolf', 'a wolf girl gets She-Wolf');
    await say('?brand Moo logo');
    e = fi(500)[0];
    ok(e && e.design === 'TheFarmsMark' && /^brand:logo:/.test(e.id), 'the farm\'s logo goes in the brand slot too');
    await say('?brand Moo clear');
    ok(!fi(500).length, '?brand clear: the farm\'s ink list empties, so it comes off');
    await say('?brand all logo');
    ok(fi(500)[0] && fi(500)[0].design === 'TheFarmsMark' && fi(700)[0].design === 'SheWolf', 'the whole herd branded: the farm\'s mark on everybody without a brand of their own');
    const L = W.FarmhandLedger(); L.people['500'].corrMarks = [10, 20, 30, 40, 50]; L.people['500'].corrBrand = 'USE ME';
    const ce = fi(500).find((x) => /^corrupt50/.test(x.id));
    ok(ce && ce.design === 'LiveWordsBlackletter' && ce.values.t === 'USE ME' && ce.keep === 1 && ce.color[0] === '#3a0d52', 'corruption 50: its words in blackletter, in its dark ink, kept on');
    L.people['500'].corrBrand = 'BRED';
    ok(fi(500).find((x) => /^corrupt50/.test(x.id)).design === 'BredCorrupted', '...and its own design where it has one');
    const errs = warns.filter((w) => /TypeError|ReferenceError/i.test(w)); ok(!errs.length, 'no errors in the bot ' + errs.join(' | ').slice(0, 200));
  }

  // ── the Companion: the switch ──
  {
    const comp = fs.readFileSync(path.join(__dirname, '../dist/farmhand-companion.user.js'), 'utf8');
    ok(comp.includes('"Farm can ink me"') && /ink: \(?ctx\d*\.panel\.prefs\.ink \? (?:undefined|void 0) : true/.test(comp), 'the Companion has its own "Farm can ink me" switch, and tells the farm girl when it\'s off');
  }
  out(fails ? '\n❌ ' + fails + ' failed' : '\n✅ all good'); process.exit(fails ? 1 : 0);
})();
