// SET ASIDE FOR THE SCENE (Nov 24, the suggestion box's #70). Kitty Sera: "temporarily removing an outfit for trap scenes if
// they are applying different restraints (can be disconnecting to be told 'you are tied in ropes' and see nothing…)".
// Laynie: farm pieces only, plus a switch for your own gear. A trap's piece whose spots are all full sets the farm
// outfit's piece aside, padlock and all, and it goes straight back after; their own things only with their switch on;
// never anythin' somebody else locked.
const path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-marks-aside-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/marks.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const ASSETS = { ItemArms: ['PawPaddedPetsuitArms', 'LeatherCuffs', 'HempRope'], ItemLegs: ['HempRope'], ItemNeck: ['LeatherCollar'], Cloth: ['Shirt'] };
  const mk = (Group, Name, extra) => Object.assign({ Asset: { Name, Group: { Name: Group }, Archetype: 'typed' }, Property: {} }, extra || {});
  const P = { MemberNumber: 500, Name: 'Moo', AssetFamily: 'Female3DCG', Appearance: [] };
  const ls = {};
  global.window = { Player: P, localStorage: { getItem(k) { return k in ls ? ls[k] : null; }, setItem(k, v) { ls[k] = String(v); } },
    Asset: Object.entries(ASSETS).flatMap(([g, ns]) => ns.map((n) => ({ Name: n, Group: { Name: g, Family: 'Female3DCG' } }))),
    AssetGet: (f, g, n) => ((ASSETS[g] || []).includes(n) ? { Name: n } : null), AssetGroupGet: (f, g) => (ASSETS[g] ? { Name: g } : null),
    ServerAppearanceBundle: (A) => A.map((it) => ({ Group: it.Asset.Group.Name, Name: it.Asset.Name, Color: it.Color, Craft: it.Craft, Property: JSON.parse(JSON.stringify(it.Property || {})), Difficulty: it.Difficulty })),
    ServerAppearanceLoadFromBundle: (C, f, b) => { C.Appearance = b.map((x) => mk(x.Group, x.Name, { Color: x.Color, Craft: x.Craft, Property: x.Property || {}, Difficulty: x.Difficulty })); },
    CharacterRefresh() {}, ChatRoomCharacterUpdate() {}, InventoryGet: (C, g) => C.Appearance.find((it) => it.Asset.Group.Name === g) || null,
    ExtendedItemGetData: () => ({ archetype: 'typed', options: [{ Name: 'BoxTie' }] }), ExtendedItemSetOptionByRecord() {}, ChatRoomCharacterItemUpdate() {} };
  const { syncFarmGear } = require(tmp);
  const at = (g) => P.Appearance.find((it) => it.Asset.Group.Name === g);
  const far = Date.now() + 3600000;
  const farmLock = (keys) => ({ Effect: ['Lock'], LockedBy: 'HighSecurityPadlock', LockMemberNumber: 500, MemberNumberListKeys: keys || '221397,232922,260239' });
  const rope = [{ slot: 'arms', name: 'Trap Ropes', items: ['HempRope'], until: far }];

  // the farm outfit's petsuit arms, padlocked by the farm: set aside for the ropes, and back after
  P.Appearance = [mk('Cloth', 'Shirt'), mk('ItemArms', 'PawPaddedPetsuitArms', { Property: farmLock() })];
  let d = syncFarmGear(rope, true);
  ok(d.on.includes('Trap Ropes') && at('ItemArms').Asset.Name === 'HempRope', 'tied in ropes: the ropes are on you, where you can see them');
  ok((d.aside || []).length === 1 && at('Cloth').Asset.Name === 'Shirt', '...the farm outfit\'s petsuit arms set aside for it, and nothin\' else touched');
  d = syncFarmGear([], true);
  const back = at('ItemArms');
  ok(d.off.includes('Trap Ropes') && back && back.Asset.Name === 'PawPaddedPetsuitArms', 'the ropes come off: the petsuit arms go straight back on');
  ok(back.Property.LockedBy === 'HighSecurityPadlock' && back.Property.MemberNumberListKeys === '221397,232922,260239', '...padlocked just as they were, the same keyholders');

  // their own cuffs: left be unless they've said so
  P.Appearance = [mk('ItemArms', 'LeatherCuffs')];
  d = syncFarmGear(rope, true);
  ok(!d.on.length && at('ItemArms').Asset.Name === 'LeatherCuffs', 'their own cuffs, switch off: they stay, and the ropes wait');
  d = syncFarmGear(rope, true, { aside: true });
  ok(d.on.includes('Trap Ropes') && at('ItemArms').Asset.Name === 'HempRope', '...switch on: their cuffs set aside for the ropes');
  d = syncFarmGear([], true, { aside: true });
  ok(at('ItemArms') && at('ItemArms').Asset.Name === 'LeatherCuffs', '...and back on them after');

  // never what somebody else locked, switch or no switch
  P.Appearance = [mk('ItemArms', 'LeatherCuffs', { Property: { Effect: ['Lock'], LockedBy: 'MetalPadlock', LockMemberNumber: 777 } })];
  d = syncFarmGear(rope, true, { aside: true });
  ok(!d.on.length && at('ItemArms').Property.LockedBy === 'MetalPadlock', 'their owner\'s padlocked cuffs: never moved, whatever the switch says');
  P.Appearance = [mk('ItemArms', 'LeatherCuffs', { Property: farmLock('777,888') })];
  d = syncFarmGear(rope, true);
  ok(!d.on.length, '...nor a high security padlock the farm girl doesn\'t hold a key to');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
