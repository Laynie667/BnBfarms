// THE TRAPS' BRANDS AND TATTOOS (Nov 18). Laynie: "need to make sure the traps use the proper brands and tattoos", then,
// on the list of which beast leaves what: "looks good, add the tattoos". Every beast that breeds them sears its own
// brand (the farm's hidden mark slots); the big breeders leave a tattoo too, and the words a trap writes go on in the
// farm's own ink (two more hidden slots, Farm Tattoo 1 and 2), wearin' off in a day.
const fs = require('fs'), path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const H = 3600000, DAY = 24 * H;
const LIST = require('../shared/ink/ink-designs.json');
const BRANDS = new Set(LIST.groups.FarmBrand.map((a) => a.name)), INKS = new Set(LIST.groups.FarmInk.map((a) => a.name));

(async () => {
  // ── the ink module: the two hidden tattoo slots ──
  {
    const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-tats-' + process.pid + '.cjs');
    await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/ink/ink.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
    const INK = require(tmp); fs.unlinkSync(tmp);
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
    W.InventoryWear = (C, name, group, color) => { const G = W.AssetGroupMap.get(group), A = G && G.Asset.find((a) => a.Name === name); if (!A) return; C.Appearance = C.Appearance.filter((it) => it.Asset.Group.Name !== group); C.Appearance.push({ Asset: A, Color: color, Property: {} }); };
    W.InventoryRemove = (C, group) => { C.Appearance = C.Appearance.filter((it) => it.Asset.Group.Name !== group); };
    W.CharacterRefresh = () => {}; W.ChatRoomCharacterUpdate = () => {};
    W.WardrobeFastLoad = (C) => { C.Appearance = []; };
    const mod = { hookFunction(fn, pri, h) { const orig = W[fn]; W[fn] = function (...args) { return h(args, (a) => orig.apply(this, a)); }; } };
    const st = INK.registerInk(W, mod);
    await wait(150);
    const inSlot = (s) => P.Appearance.find((it) => it.Asset.Group.Name === s);
    const now = Date.now();

    const T1 = W.AssetGroupMap.get('FarmTat1'), T2 = W.AssetGroupMap.get('FarmTat2');
    ok(T1 && T2 && T1.def.AllowCustomize === false && T2.def.AllowCustomize === false && T1.Description === 'Farm Tattoo 1', 'two Farm Tattoo slots, kept out of the wardrobe like the marks');
    ok(T2.Asset.length === LIST.groups.FarmInk.length && !T2.Asset.some((a) => a.Name === 'MoonPawBrand'), '...holdin\' the ink designs, not the brands');
    const tb = LIST.groups.FarmInk.find((a) => a.name === 'TentacleBred'), tbDef = T2.Asset.find((a) => a.Name === 'TentacleBred').def;
    const lw = LIST.groups.FarmInk.find((a) => a.name === 'LiveWordsTypewriter'), lwDef = T1.Asset.find((a) => a.Name === 'LiveWordsTypewriter').def;
    ok(Math.abs(tbDef.Left + tb.w / 2 - 250) < 1 && Math.abs(tbDef.Top + tb.h / 2 - 492) < 1, 'Farm Tattoo 2 sits on the belly, above where your own ink starts (' + (tbDef.Left + tb.w / 2) + ', ' + (tbDef.Top + tb.h / 2) + ')');
    ok(Math.abs(lwDef.Left + lw.w / 2 - 250) < 1 && Math.abs(lwDef.Top + lw.h / 2 - 246) < 1, 'Farm Tattoo 1 runs across the chest above the breasts, for words (' + (lwDef.Left + lw.w / 2) + ', ' + (lwDef.Top + lw.h / 2) + ')');
    ok(/\/ink\/v2\/FarmTat2\/$/.test(W.AssetBaseURL(P, null, 'FarmTat2', '', {}, '', { Name: 'TentacleBred' })) && /\/ink\/v2\/live\/FarmTat1\/$/.test(W.AssetBaseURL(P, null, 'FarmTat1', '', {}, '', { Name: 'LiveWordsTypewriter' })), 'their pictures: an address of our own, a live one\'s drawn live');

    const pic = { id: 'tat:TentacleBred:1', slot: 'tat', design: 'TentacleBred', at: now, fade: DAY };
    const words = { id: 'tat:LiveWordsTypewriter:2', slot: 'tat', design: 'LiveWordsTypewriter', at: now, fade: DAY, values: { t: 'BREEDING STOCK' }, color: ['#b3161b'] };
    const mark = { id: 'mark:MoonPawBrand:3', slot: 'mark', design: 'MoonPawBrand', at: now, heal: 3 * DAY };
    W.InventoryWear(P, 'KnotSlave', 'FarmInk1', 'Default');
    let r = st.farm([mark, pic, words], true);
    ok(inSlot('FarmTat2') && inSlot('FarmTat2').Asset.Name === 'TentacleBred' && inSlot('FarmTat2').Property.FarmInk.fade === DAY, 'a trap\'s tattoo goes in Farm Tattoo 2, wearin\' off in a day');
    ok(inSlot('FarmTat1') && inSlot('FarmTat1').Asset.Name === 'LiveWordsTypewriter' && inSlot('FarmTat1').Property.FarmInk.t === 'BREEDING STOCK' && inSlot('FarmTat1').Color.join() === '#b3161b', '...its words in Farm Tattoo 1, in the ink it was written in');
    ok(inSlot('FarmMark1').Asset.Name === 'MoonPawBrand' && inSlot('FarmInk1').Asset.Name === 'KnotSlave' && !inSlot('FarmInk2'), '...the brand in its mark slot, and their own ink left be');
    ok(r.marked.length === 3 && !r.put.length, '...all news as the farm\'s marks, not wardrobe ink');
    const pic2 = { id: 'tat:GoblinLoot:4', slot: 'tat', design: 'GoblinLoot', at: now + 1, fade: DAY };
    st.farm([mark, pic2, words], true);
    ok(inSlot('FarmTat2').Asset.Name === 'GoblinLoot' && inSlot('FarmTat1').Asset.Name === 'LiveWordsTypewriter', 'a newer trap tattoo: in place of the last one');
    W.WardrobeFastLoad(P, 0, true);
    ok(inSlot('FarmTat1') && inSlot('FarmTat2') && inSlot('FarmMark1'), 'an outfit from the wardrobe: the tattoos stay on, like the marks');
    // drawn: from the ink's own pictures, fadin' out at the end
    P.Appearance = []; INK.farmInkSync(W, [Object.assign({}, pic, { at: now - 0.9 * DAY })], true);
    toDraw = [['https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmTat2/TentacleBred_Ink.png', { HexColor: '#16121c' }]];
    let got = []; W.CommonDrawAppearanceBuild(P, { drawImage: () => {}, drawImageColorize: (s, x, y, o) => got.push([s, o]) });
    ok(got.length === 1 && got[0][0] === 'https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmInk/TentacleBred_Ink.png', 'drawn from the ink\'s own picture (' + (got[0] && got[0][0]) + ')');
    ok(got[0][1].Alpha > 0 && got[0][1].Alpha < 1 && got[0][1].ScaleX > 0.15 && got[0][1].ScaleX < 0.4, '...near the end of its day, wearin\' thin, at the slot\'s size (' + (got[0][1].Alpha || 0).toFixed(2) + ', ' + got[0][1].ScaleX.toFixed(3) + ')');
    r = INK.farmInkSync(W, [Object.assign({}, pic, { at: now - 0.9 * DAY })], true, now + 0.2 * DAY);
    ok(!inSlot('FarmTat2') && r.off.join() === 'TentacleBred', 'a day gone: worn right off');
    ok(!st.farm([{ id: 'tat:Hucow:5', slot: 'tat', design: 'Hucow', at: now, fade: DAY }], true).marked.length && !inSlot('FarmTat2'), 'a brand never goes in a tattoo slot');
  }

  // ── the farm girl: which beast leaves what ──
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
    const ink = (mn, slot) => (S(mn).farmInk || []).filter((e) => e.slot === slot);
    W.__st().companions.set(500, { at: Date.now(), ver: '0.66.0' });

    // the lists themselves
    const X = W.__trapMarkSets(), KINDS = W.__farmSets().TRAP_KINDS;
    const badKind = Object.keys(X.TRAP_MARK).concat(Object.keys(X.TRAP_TAT)).filter((k) => !KINDS[k]);
    ok(!badKind.length, 'every trap on the lists is a real trap (' + badKind.join(',') + ')');
    const badBrand = Object.values(X.TRAP_MARK).filter((d) => !BRANDS.has(d)), badTat = Object.values(X.TRAP_TAT).filter((d) => !INKS.has(d));
    ok(!badBrand.length && !badTat.length, '...every brand one of the farm\'s brands, every tattoo one of its ink designs (' + badBrand.concat(badTat).join(',') + ')');
    const noLines = Object.entries(X.TRAP_MARK).filter(([k, d]) => !(X.KIND_MARK_LINES[k] || X.MARK_LINES[d] || []).length).map(([k]) => k);
    ok(!noLines.length && Object.values(X.TRAP_TAT).every((d) => (X.TAT_LINES[d] || []).length >= 3), '...and every one has its own lines (' + noLines.join(',') + ')');
    const allLines = [].concat(...Object.values(X.MARK_LINES), ...Object.values(X.KIND_MARK_LINES), ...Object.values(X.TAT_LINES));
    const notThey = allLines.filter((l) => !l.includes('%n') || /\b(she|her|hers|herself|himself)\b/.test(l.replace(/\bher (?:apron|piglets)\b/g, '')) || /%n's \w+ \w*\s*(his|her)\b/.test(l));
    ok(!notThey.length, 'the lines name them, and say "they" (the matron keeps her own apron) ' + notThey.join(' | ').slice(0, 200));
    ok(['wolves', 'werewolf', 'stallion', 'bull', 'minotaur', 'warren', 'foxden', 'ramstud', 'stag', 'goat', 'drake', 'toms', 'kennel', 'goblinraid', 'warband', 'breeder'].every((k) => X.TRAP_MARK[k]), 'the beasts Laynie looked over all brand');

    // a beast's brand and its tattoo
    let n = sent.length;
    W.__trapEnded(500, 'stallion', {});
    ok(ink(500, 'mark').map((e) => e.design).join() === 'Mare' && ink(500, 'tat').map((e) => e.design).join() === 'BredMare', 'the stallion: the Mare brand, and BRED MARE inked low on the belly (' + JSON.stringify(S(500).farmInk) + ')');
    ok(ink(500, 'tat')[0].fade === DAY && !ink(500, 'tat')[0].heal, '...the tattoo wears off in a day');
    await wait(11800);
    const t1 = said(n);
    ok(/MARE/.test(t1) && /BRED MARE/.test(t1) && /wears off in a day/.test(t1) && /\?wash scrubs it off/.test(t1), '...the room hears both, and she\'s told what each is');
    W.__trapEnded(500, 'sow', {}); n = sent.length; await wait(6500);
    ok(ink(500, 'mark').map((e) => e.design).join() === 'Mare,SnoutRingBrand' && /matron/.test(said(n)), 'the matron: the snout ring, with her own line (not the boar\'s)');
    W.__trapEnded(500, 'hive', {});
    ok(ink(500, 'mark').length === 2 && ink(500, 'tat').map((e) => e.design).join() === 'EggLayerCrest', 'the hive: no brand, the egg-layer\'s crest in place of the last tattoo');
    moo.brand = { ink: 'Hucow', at: Date.now() };
    W.__trapEnded(500, 'bull', {});
    ok(!ink(500, 'mark').some((e) => e.design === 'Hucow'), 'the bull, on a cow already wearin\' the Hucow brand: not a second one');
    moo.brand = null;

    // words a trap writes
    W.__trapWords(500, 'breeding stock', 'neat');
    let w = ink(500, 'tat').find((e) => /^LiveWords/.test(e.design));
    ok(w && w.design === 'LiveWordsTypewriter' && w.values.t === 'BREEDING STOCK' && w.color.join() === '#16121c' && ink(500, 'tat').length === 2, 'the brandin\' arm\'s words: in the farm\'s ink across the chest, beside the picture');
    W.__trapWords(500, 'for sale 5 ribbons', 'red');
    w = ink(500, 'tat').filter((e) => /^LiveWords/.test(e.design));
    ok(w.length === 1 && w[0].values.t === 'FOR SALE 5 RIBBONS' && w[0].color.join() === '#b3161b', '...newer words in place of the old, in red marker for the sale block');
    n = sent.length; await sayAs(500, '?marks');
    ok(/FOR SALE 5 RIBBONS/.test(said(n)) && /egg-layer/.test(said(n)) && /wears off in/.test(said(n)), '?marks: the traps\' ink too, and when it wears off');
    n = sent.length; await sayAs(500, '?wash'); await wait(6500);
    ok(!ink(500, 'tat').length && !moo.tats && /traps' ink|ink the traps left/.test(said(n)), '?wash: the traps\' ink scrubs off, with a line sayin\' so');
    moo.tats = [{ d: 'TentacleBred', at: Date.now() - 25 * H }];
    ok(!ink(500, 'tat').length, 'a day gone: worn off, gone from the list');

    // when it goes on the old way, or not at all
    moo.limits = 'no tattoos'; W.__trapEnded(500, 'tentacle', {});
    ok(!ink(500, 'tat').length && ink(500, 'mark').some((e) => e.design === 'TentacleRingBrand'), 'tattoos in her limits: the brand, but no tattoo');
    moo.limits = '';
    W.__st().companions.set(500, { at: Date.now(), ver: '0.65.0' });
    W.__trapEnded(500, 'wolves', {});
    ok(!moo.tats && ink(500, 'mark').some((e) => e.design === 'MoonPawBrand'), 'a Companion without the tattoo slots: the brand, no tattoo');
    n = sent.length; const done = W.__trapWords(500, 'knot slut', 'marker');
    ok(!moo.tats && !ink(500, 'tat').length, '...and a trap\'s words go on the old way, as marker writin\'');
    const errs = warns.filter((x) => /TypeError|ReferenceError/i.test(x)); ok(!errs.length, 'no errors in the bot ' + errs.join(' | ').slice(0, 300));
  }
  out(fails ? '\n❌ ' + fails + ' failed' : '\n✅ all good'); process.exit(fails ? 1 : 0);
})();
