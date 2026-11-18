// Nov 18: BC R134 (Laynie: "BC also just released a update, so we will need to update too"). Two things in it broke the
// farm's ink, checked on the live R134 game in the studio and pinned here:
//   • the starting colours moved from the item onto each layer: without a Color of its own every ink layer started
//     "Default", plain grey, when picked in the wardrobe
//   • only the properties the game knows go to the server (ItemPropertiesGetBundleProperties), and only ones with an
//     entry (PropertyData) survive comin' back in: FarmInk (sizes, live counts, the farm's brands and marks, trophies)
//     was dropped both ways
const fs = require('fs'), path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-r134-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/ink/ink.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  // the game's own property entry class, the way R134 has it (a plain class, reached by its bare name)
  global.PropertyDataEntry = class { constructor(name, meta, fns) { this.name = name; Object.assign(this, { _v: fns.validate, _c: fns.compare }); }
    validate(p, d) { return this._v.call(this, p, d); } compare(a, b) { return this._c ? this._c.call(this, a, b) : a === b; } };
  const INK = require(tmp); fs.unlinkSync(tmp);
  const W = { addEventListener() {}, AssetGroupMap: new Map(), AssetGroup: [], AssetFemale3DCGExtended: {}, localStorage: { getItem: () => null, setItem() {} }, PropertyData: {} };
  for (let i = 0; i < 40; i++) { const g = { Name: 'G' + i, Asset: [] }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); }
  W.AssetGroupAdd = (fam, def) => { const g = { Family: fam, Name: def.Group, Asset: [], def }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); return g; };
  W.AssetAdd = (G, def) => { const a = { Name: def.Name, Group: G, def }; G.Asset.push(a); return a; };
  W.AssetBaseURL = () => ''; W.AssetGetPreviewPath = () => ''; W.AssetBuildDescription = () => {}; W.AssetLoadAll = () => {}; W.CommonDrawAppearanceBuild = () => {};
  W.ItemPropertiesGetBundleProperties = (item) => ({ properties: new Set(['OverridePriority']), extendedOptions: [] });
  W.Player = { MemberNumber: 500, Appearance: [] };
  const mod = { hookFunction(fn, pri, h) { const orig = W[fn]; W[fn] = function (...args) { return h(args, (a) => orig.apply(this, a)); }; } };
  INK.registerInk(W, mod);
  await wait(150);

  // the colours, on each layer
  const hucow = W.AssetGroupMap.get('FarmBrand').Asset.find((a) => a.Name === 'Hucow').def;
  ok(hucow.Layer.map((l) => l.Color && l.Color[0]).join() === '#5e1414,#b4524a,#f2b9a8', 'each brand layer carries its own starting colour (R134 reads them there)');
  ok(hucow.DefaultColor.join() === '#5e1414,#b4524a,#f2b9a8', '...and the item still carries them too, for older games');
  const knot = W.AssetGroupMap.get('FarmInk1').Asset.find((a) => a.Name === 'KnotSlave').def;
  ok(knot.Layer.every((l) => !l.AllowColorize || (Array.isArray(l.Color) && /^#/.test(l.Color[0]))), 'every colourable ink layer has its colour');
  const mark = W.AssetGroupMap.get('FarmMark2').Asset.find((a) => a.Name === 'MoonPawBrand').def;
  ok(mark.Layer[1].Color[0] === '#b4524a', 'the farm\'s mark slots too');

  // what goes to the server
  const item = (group, name) => ({ Asset: { Name: name, Group: { Name: group } }, Property: {} });
  const sent = (it) => [...W.ItemPropertiesGetBundleProperties(it).properties];
  ok(sent(item('FarmInk1', 'LiveTied')).includes('FarmInk') && sent(item('FarmMark1', 'TentacleRingBrand')).includes('FarmInk') && sent(item('FarmBrand', 'Hucow')).includes('FarmInk'),
    'FarmInk goes to the server with our slots\' items');
  ok(!sent(item('ItemArms', 'LeatherCuffs')).includes('FarmInk') && sent(item('ItemArms', 'LeatherCuffs')).includes('OverridePriority'), '...and nothin\'s added to anybody else\'s');

  // what's kept comin' back in
  const E = W.PropertyData.FarmInk;
  ok(E instanceof global.PropertyDataEntry && E.name === 'FarmInk', 'FarmInk has its own entry in the game\'s property list');
  const asset = (g) => ({ asset: { Group: { Name: g } } });
  let v = E.validate({ n: 7, trophy: 'card', sz: 1.5, manual: true, junk: '<script>' }, asset('FarmInk1'));
  ok(v.status === 'ok' && v.value.n === 7 && v.value.trophy === 'card' && v.value.sz === 1.5 && v.value.manual === true && !('junk' in v.value), 'kept on our slots, cleaned the way we clean it (' + JSON.stringify(v.value) + ')');
  v = E.validate({ farm: 'mark:TentacleRingBrand:1', at: 1795000000000, heal: 259200000 }, asset('FarmMark3'));
  ok(v.status === 'ok' && v.value.farm === 'mark:TentacleRingBrand:1' && v.value.heal === 259200000, '...the farm\'s marks keep their healin\'');
  ok(E.validate({ n: 1 }, asset('ItemArms')).status === 'criticalError' && E.validate('nope', asset('FarmInk1')).status === 'criticalError', '...dropped anywhere else, or when it isn\'t a FarmInk at all');
  ok(E.compare({ n: 1, sz: 2 }, { n: 1, sz: 2 }) === true && E.compare({ n: 1 }, { n: 2 }) === false, 'two the same are the same (so an unchanged update isn\'t a change)');
  ok(INK.farmInkEntry(W) === false, '...and it\'s only added once');
  out(fails ? '\n❌ ' + fails + ' failed' : '\n✅ all good'); process.exit(fails ? 1 : 0);
})();
