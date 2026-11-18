// FARM INK (shared/ink/ink.js): the four ink slots and the brand slot in the game's wardrobe. Added once whichever add-on
// comes first, every design from the sheets an item in them, the pictures from the repo, drawn at half the size they're
// stored at, and put back if the game rebuilds its lists. Also: no design on the public pictures carries a name or number.
const fs = require('fs'), path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-ink-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/ink/ink.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const INK = require(tmp); fs.unlinkSync(tmp);
  const LIST = JSON.parse(fs.readFileSync(path.join(__dirname, '../shared/ink/ink-designs.json'), 'utf8'));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // a small stand-in for the game: its lists, the two functions that add to them, and the ones we hook
  const W = { AssetGroupMap: new Map(), AssetGroup: [], AssetFemale3DCGExtended: {} };
  for (let i = 0; i < 40; i++) { const g = { Name: 'G' + i, Asset: [] }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); }
  let groupAdds = 0;
  W.AssetGroupAdd = (fam, def) => { groupAdds++; const g = { Family: fam, Name: def.Group, Description: def.Group, Asset: [], def }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); return g; };
  W.AssetAdd = (G, def) => { const a = { Name: def.Name, Description: def.Name, Group: G, Layer: def.Layer, DefaultColor: def.DefaultColor, Left: def.Left, Top: def.Top, Value: def.Value, PoseMapping: def.PoseMapping }; G.Asset.push(a); return a; };
  W.AssetBaseURL = (C, group, groupName) => 'Assets/Female3DCG/' + groupName + '/';
  W.AssetGetPreviewPath = (A) => 'Assets/Female3DCG/' + A.Group.Name + '/Preview';
  W.AssetBuildDescription = () => { for (const g of W.AssetGroup) { g.Description = 'MISSING ASSETGROUP DESCRIPTION: ' + g.Name; for (const a of g.Asset) a.Description = 'MISSING ASSET DESCRIPTION'; } };
  W.AssetLoadAll = () => { for (const n of [...W.AssetGroupMap.keys()]) if (/^Farm/.test(n)) W.AssetGroupMap.delete(n); W.AssetGroup = W.AssetGroup.filter((g) => !/^Farm/.test(g.Name)); };
  let drawn = [];
  W.CommonDrawAppearanceBuild = (C, cb) => { cb.drawImage('https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmInk/KnotSlave_Ink.png', 175, 477, { ScaleX: 1.5 }); cb.drawImage('Assets/Female3DCG/Cloth/Dress.png', 0, 0, {}); cb.drawImageColorize('https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/FarmBrand/Hucow_Brand.png', 0, 0, undefined); };
  // a ModSDK handle that wraps the functions on W the way the real one does
  const mod = (name) => ({ hookFunction(fn, pri, h) { const orig = W[fn]; W[fn] = function (...args) { return h(args, (a) => orig.apply(this, a)); }; } });

  const st = INK.registerInk(W, mod('FarmhandCompanion'));
  const again = INK.registerInk(W, mod('FarmhandDispensary'));
  await wait(150);
  ok(st.ready && again === st, 'the Companion adds the slots; the Dispensary, loaded after, finds them done');
  ok(groupAdds === 8 && ['FarmInk1', 'FarmInk2', 'FarmInk3', 'FarmInk4', 'FarmBrand', 'FarmMark1', 'FarmMark2', 'FarmMark3'].every((n) => W.AssetGroupMap.has(n)), 'five wardrobe slots (Farm Ink 1 to 4 and Farm Brand), and the farm\'s three hidden Farm Mark slots (added ' + groupAdds + ')');
  const G1 = W.AssetGroupMap.get('FarmInk1'), GB = W.AssetGroupMap.get('FarmBrand');
  ok(G1.Asset.length === LIST.groups.FarmInk.length && W.AssetGroupMap.get('FarmInk4').Asset.length === G1.Asset.length && GB.Asset.length === LIST.groups.FarmBrand.length,
    'every design is in each ink slot (' + G1.Asset.length + '), every brand in the brand slot (' + GB.Asset.length + ')');
  ok(G1.def.Priority === 11 && G1.def.Clothing === false && G1.def.Default === false && G1.def.AllowNone === true, 'on the skin, not clothing (stripping leaves it), and can be left empty');
  ok(G1.Asset.every((a) => a.Value === 0), 'free to wear: nobody has to buy a tattoo');
  ok(G1.Description === 'Farm Ink 1' && GB.Description === 'Farm Brand' && G1.Asset.find((a) => a.Name === 'KnotSlave').Description === 'Knot Slave', 'the slots and designs have their names in the wardrobe');
  const hucow = GB.Asset.find((a) => a.Name === 'Hucow');
  ok(hucow && hucow.Layer.map((l) => l.Name).join() === 'BrandEdge,Brand,BrandShine' && hucow.DefaultColor.length === 3, "a brand is three layers you can colour: the dark edge, the angry core, the shine (fresh or healed)");
  ok(G1.Asset.every((a) => a.PoseMapping && a.PoseMapping.AllFours === 'Hide' && a.PoseMapping.Hogtied === 'Hide'), 'hidden on all fours and hogtied, where the body is drawn another way');
  // where the pictures come from
  ok(W.AssetBaseURL({}, G1, 'FarmInk2') === INK.INK_HOST + 'FarmInk/' && W.AssetBaseURL({}, GB, 'FarmBrand') === INK.INK_HOST + 'FarmBrand/', 'our pictures come from the repo (' + INK.INK_HOST + ')');
  ok(W.AssetBaseURL({}, W.AssetGroupMap.get('G3'), 'Cloth') === 'Assets/Female3DCG/Cloth/', "...and the game's own come from the game, as ever");
  ok(W.AssetGetPreviewPath(G1.Asset[0]) === INK.INK_HOST + 'FarmInk/Preview' && W.AssetGetPreviewPath({ Group: { Name: 'Cloth' } }) === 'Assets/Female3DCG/Cloth/Preview', "the wardrobe's previews too");
  // drawn at half the size they're stored at
  drawn = []; W.CommonDrawAppearanceBuild({}, { drawImage: (s, x, y, o) => drawn.push([s, o]), drawImageColorize: (s, x, y, o) => drawn.push([s, o]) });
  const near = (v, x) => Math.abs(v - x) < 1e-9;
  ok(LIST.res === 3 && near(drawn[0][1].ScaleX, 0.5) && near(drawn[0][1].ScaleY, 1 / 3), "a design's drawn at a third of its stored size, times whatever the Layering screen says (1.5 → " + drawn[0][1].ScaleX + ')');
  ok(drawn[1][1].ScaleX === undefined && near(drawn[2][1].ScaleX, 1 / 3), "...the game's own pictures untouched, and a recoloured layer at a third too");
  // (Nov 18) somebody under the Statue Serum: the Companion hands back the ink cut into the material, drawn plain at the same size
  const stoneInk = { stone: true }, plain = [];
  W.__farmInkTint = (C, src) => (/Farm(Ink|Brand)\//.test(src) ? stoneInk : undefined);
  W.CommonDrawAppearanceBuild({}, { drawImage: (s, x, y, o) => plain.push([s, o, 'plain']), drawImageColorize: (s, x, y, o) => plain.push([s, o, 'colour']) });
  delete W.__farmInkTint;
  ok(plain[0][0] === stoneInk && near(plain[0][1].ScaleX, 0.5) && plain[2][0] === stoneInk && plain[2][2] === 'plain' && plain[2][1].HexColor === undefined, "a statue's ink: in the material, at its own size, drawn plain (not recoloured over)");
  ok(plain[1][0] === drawn[1][0], "...and the game's own pictures still as they are");
  // the game rebuilding its lists
  W.AssetBuildDescription(); ok(G1.Description === 'Farm Ink 1' && G1.Asset[0].Description !== 'MISSING ASSET DESCRIPTION', 'when the game re-reads its names (a language change), ours are put back');
  W.AssetLoadAll(); ok(W.AssetGroupMap.has('FarmInk1') && W.AssetGroupMap.has('FarmBrand'), 'when the game reloads its items, the slots are added again');
  // the pictures themselves
  const missing = [];
  for (const kind of ['FarmInk', 'FarmBrand']) for (const a of LIST.groups[kind]) { if (!a.live) for (const l of a.layers) { const f = path.join(__dirname, '../ink/v2', kind, a.name + '_' + l.name + '.png'); if (!fs.existsSync(f)) missing.push(f); } if (!fs.existsSync(path.join(__dirname, '../ink/v2', kind, 'Preview', a.name + '.png'))) missing.push(kind + '/Preview/' + a.name); }
  ok(!missing.length, 'every layer and preview picture is in the repo' + (missing.length ? ': missing ' + missing.slice(0, 3).join(', ') : ''));
  const text = JSON.stringify(LIST);
  ok(!/221397|232922|Alexia|Laynie/.test(text), 'no name or member number in the list (the ones that print a name or number are drawn live)');
  const liveN = LIST.groups.FarmInk.filter((x) => x.live).length;
  ok(liveN === 28 && LIST.groups.FarmInk.some((x) => x.live && /Farm Property/.test(x.title)), 'the designs with live names, numbers and counts are drawn live, not from pictures (' + liveN + '; tests/ink-live.test.cjs)');
  out(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})().catch((e) => { out('CRASHED ' + (e && e.stack || e)); process.exit(1); });
