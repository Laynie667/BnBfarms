// YOUR SIDE OF IT (Nov 23):
//   • back on the farm under a contract, the farm outfit tops up: only the pieces whose spot is EMPTY go back on (locked
//     like the first time); whatever's in a spot now stays; the change-back copy isn't touched.
//   • Nikto's #14: "the traps that strip you also remove ears, wings and tails as well as hair additions", "for me these
//     items are considered part of the characters body". Stripped, or dressed in a farm outfit: they stay on.
const path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-topup-' + process.pid + '.cjs'), entry = path.join(os.tmpdir(), 'fh-topup-entry-' + process.pid + '.js');
  require('fs').writeFileSync(entry, 'export * from ' + JSON.stringify(path.join(__dirname, '../extension/src/outfits.js').replace(/\\/g, '/')) + ';\nexport { stripMe, BODY_BITS } from ' + JSON.stringify(path.join(__dirname, '../extension/src/marks.js').replace(/\\/g, '/')) + ';\n');
  await esbuild.build({ entryPoints: [entry], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const ls = {};
  const G = {};
  for (const g of ['Cloth', 'Shoes', 'HairAccessory1', 'HairAccessory2', 'TailStraps', 'Wings']) G[g] = { Name: g, Clothing: true, Category: 'Appearance' };
  for (const g of ['ItemNeck', 'ItemArms']) G[g] = { Name: g, Clothing: false, Category: 'Item' };
  G.HairFront = { Name: 'HairFront', Clothing: false, Category: 'Appearance' };
  const item = (g, n, p) => ({ Asset: { Name: n, Group: G[g], AllowLock: g === 'ItemNeck' }, Property: p || {} });
  global.window = {
    localStorage: { getItem(k) { return k in ls ? ls[k] : null; }, setItem(k, v) { ls[k] = String(v); }, removeItem(k) { delete ls[k]; } },
    LZString: { compressToBase64: (t) => Buffer.from(t).toString('base64'), decompressFromBase64: (t) => Buffer.from(t, 'base64').toString() },
    AssetGroupGet: (f, n) => G[n] || null, AssetGet: (f, g, n) => ({ Name: n, Group: G[g], AllowLock: g === 'ItemNeck' }),
    ServerAppearanceBundle: (a) => a.map((it) => ({ Group: it.Asset.Group.Name, Name: it.Asset.Name, Property: JSON.parse(JSON.stringify(it.Property || {})) })),
    ServerAppearanceLoadFromBundle: (C, f, b) => { C.Appearance = b.map((x) => item(x.Group, x.Name, x.Property)); },
    ChatRoomCharacterUpdate: () => {}, CurrentScreen: 'ChatRoom',
  };
  const M = require(tmp);
  const me = (list) => { window.Player = { MemberNumber: 500, AssetFamily: 'Female3DCG', Appearance: list }; };
  const has = (g) => window.Player.Appearance.find((it) => it.Asset.Group.Name === g);
  const data = window.LZString.compressToBase64(JSON.stringify({ items: [{ Group: 'Cloth', Name: 'CowPrintDress' }, { Group: 'ItemNeck', Name: 'LeatherCollar', locked: true }, { Group: 'Shoes', Name: 'Heels1' }] }));
  // the top-up
  ls['fhc-outfit-backup'] = JSON.stringify({ at: 1, bundle: [{ Group: 'Cloth', Name: 'Hoodie' }], added: [] });
  me([item('Cloth', 'TShirt1'), item('HairFront', 'Hair1')]);
  const r = M.topUpOutfit(data, [260239], ['ItemNeck', 'Shoes']);
  ok(r.ok && r.worn === 2 && has('ItemNeck').Asset.Name === 'LeatherCollar' && has('Shoes').Asset.Name === 'Heels1', 'back home: the collar and shoes that were missin\' go back on');
  ok(has('Cloth').Asset.Name === 'TShirt1', '...the shirt they\'re wearin\' in the dress\'s spot stays');
  ok(has('ItemNeck').Property.LockedBy === 'HighSecurityPadlock' && r.locks === 1, '...the collar padlocked, like the first time');
  ok(JSON.parse(ls['fhc-outfit-backup']).bundle[0].Name === 'Hoodie', '...and the change-back copy is just as it was');
  const r2 = M.topUpOutfit(data, [260239], ['ItemNeck', 'Shoes']);
  ok(r2.ok && r2.worn === 0, 'already back in it: nothin\' more goes on');
  // ears, tails, wings and hair bits: never stripped
  me([item('Cloth', 'TShirt1'), item('HairAccessory2', 'CowEars'), item('TailStraps', 'CowTail'), item('Wings', 'AngelWings'), item('HairAccessory1', 'Ahoge'), item('HairFront', 'Hair1')]);
  delete ls['fhc-strip-backup'];
  const s = M.stripMe({ strip: true });
  ok(s.ok && !has('Cloth') && has('HairAccessory2') && has('TailStraps') && has('Wings') && has('HairAccessory1'), 'stripped: the clothes come off, the ears, tail, wings and ahoge stay');
  // dressed in a farm outfit: the same
  me([item('Cloth', 'TShirt1'), item('HairAccessory2', 'CowEars'), item('TailStraps', 'CowTail')]);
  M.wearOutfit(data, [260239]);
  ok(has('Cloth').Asset.Name === 'CowPrintDress' && has('HairAccessory2') && has('TailStraps'), 'dressed in a farm outfit: their ears and tail stay on');
  const withTail = window.LZString.compressToBase64(JSON.stringify({ items: [{ Group: 'TailStraps', Name: 'HorseTail' }] }));
  M.wearOutfit(withTail, [260239]);
  ok(has('TailStraps').Asset.Name === 'HorseTail', '...unless the outfit brings its own tail');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
