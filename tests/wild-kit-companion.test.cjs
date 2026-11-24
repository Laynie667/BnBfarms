// THE WILD KITS ON THEIR CHARACTER (Nov 20). Laynie: "definitely could use more complete, restrictive sets".
// The Companion's half: the new spots (blindfold, ear plugs, a nose ring, two gags, mittens, the ankles), a stake's
// settings and its sign, tape that stays where it belongs, and the safety: a safeword said away from the farm takes it
// all off at once, and a piece somebody else freed stays off on this computer (a reload, another room) till the farm hears.
const path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-marks-kit-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/marks.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const ASSETS = { ItemHead: ['LeatherBlindfold', 'DuctTape'], ItemEars: ['HeavyDutyEarPlugs'], ItemNose: ['NoseShackle', 'DuctTape'], ItemMouth: ['RingGag', 'PlugGag', 'DuctTape', 'HarnessBallGag1'],
    ItemMouth2: ['HarnessPanelGag', 'DuctTape'], ItemMouth3: ['HarnessPanelGag', 'DuctTape'], ItemHands: ['PaddedLeatherMittens', 'DuctTape'], ItemFeet: ['BallChain', 'DuctTape', 'HempRope'],
    ItemArms: ['LeatherArmbinder', 'DuctTape', 'HempRope'], ItemLegs: ['FrogtieStraps', 'DuctTape'], ItemNeck: ['LeatherCollar'], ItemNeckRestraints: ['PetPost', 'CollarChainShort'],
    ItemNeckAccessories: ['CollarCowBell'], ItemNipples: ['LactationPump'], ItemVulva: ['InflatableVibeDildo'], ItemButt: ['Cowtail'], Cloth: ['Shirt'] };
  const mk = (Group, Name, extra) => Object.assign({ Asset: { Name, Group: { Name: Group }, Archetype: Name === 'PetPost' ? 'modular' : 'typed' }, Property: {} }, extra || {});
  const P = { MemberNumber: 500, Name: 'Moo', AssetFamily: 'Female3DCG', Appearance: [mk('Cloth', 'Shirt')] };
  const ls = {}, recs = [], pushes = [];
  global.window = { Player: P, localStorage: { getItem(k) { return k in ls ? ls[k] : null; }, setItem(k, v) { ls[k] = String(v); } },
    Asset: Object.entries(ASSETS).flatMap(([g, ns]) => ns.map((n) => ({ Name: n, Group: { Name: g, Family: 'Female3DCG' } }))),
    AssetGet: (f, g, n) => ((ASSETS[g] || []).includes(n) ? { Name: n } : null), AssetGroupGet: (f, g) => (ASSETS[g] ? { Name: g } : null),
    ServerAppearanceBundle: (A) => A.map((it) => ({ Group: it.Asset.Group.Name, Name: it.Asset.Name, Color: it.Color, Craft: it.Craft, Property: it.Property, Difficulty: it.Difficulty })),
    ServerAppearanceLoadFromBundle: (C, f, b) => { C.Appearance = b.map((x) => mk(x.Group, x.Name, { Color: x.Color, Craft: x.Craft, Property: x.Property || {}, Difficulty: x.Difficulty })); },
    CharacterRefresh() {}, ChatRoomCharacterUpdate() {},
    InventoryGet: (C, g) => C.Appearance.find((it) => it.Asset.Group.Name === g) || null,
    ExtendedItemGetData: (a) => (a.Name === 'PetPost' ? { archetype: 'modular', modules: [{ Key: 'p', Options: [1, 2] }, { Key: 'd', Options: [1, 2] }, { Key: 'l', Options: [1, 2, 3] }] }
      : { archetype: 'typed', options: [{ Name: 'None' }, { Name: 'Strap' }, { Name: 'WrapStrap' }, { Name: 'Wrap' }, { Name: 'Full' }, { Name: 'Complete' }] }),
    ExtendedItemSetOptionByRecord: (C, it, rec, o) => { recs.push([it.Asset.Group.Name, it.Asset.Name, JSON.stringify(rec), o && o.push]); it.Property = Object.assign(it.Property || {}, { TypeRecord: rec }); },
    ChatRoomCharacterItemUpdate: (C, g) => pushes.push(g) };
  const { syncFarmGear, farmGearLetGo, gearFreedHere, GEAR_SLOTS } = require(tmp);
  const at = (g) => P.Appearance.find((it) => it.Asset.Group.Name === g);
  const far = Date.now() + 30 * 86400000;
  const kit = [
    { slot: 'hands', name: 'Stall Mitts', items: ['PaddedLeatherMittens'], until: far, keep: true },
    { slot: 'arms', name: 'Stall Armbinder', items: ['LeatherArmbinder'], opt: 'WrapStrap', until: far, keep: true },
    { slot: 'legs', name: 'Stall Frogtie', items: ['FrogtieStraps'], until: far, keep: true },
    { slot: 'blind', name: 'Stall Blindfold', items: ['LeatherBlindfold'], until: far, keep: true },
    { slot: 'earplugs', name: 'Stall Plugs', items: ['HeavyDutyEarPlugs'], until: far, keep: true },
    { slot: 'nose', name: 'Farm Bull Ring', items: ['NoseShackle'], until: far, keep: true },
    { slot: 'gag', name: 'Shipping Gag', items: ['PlugGag'], until: far, keep: true },
    { slot: 'gag2', name: 'Shipping Panel', items: ['HarnessPanelGag'], until: far, keep: true },
    { slot: 'feet', name: 'Pasture Ball and Chain', items: ['BallChain'], until: far, keep: true },
    { slot: 'collar', name: 'Heifer Collar', items: ['LeatherCollar'], until: far, keep: true },
    { slot: 'tag', name: 'Farm Cowbell', items: ['CollarCowBell'], until: far, keep: true },
    { slot: 'leash', name: 'Field Stake', items: ['PetPost'], rec: { d: 1, l: 2, zz: 9 }, text: ['Free', 'To', 'Breed<script>'], until: far, keep: true } ];
  ok(['blind', 'earplugs', 'nose', 'gag', 'gag2', 'hands', 'feet'].every((s) => GEAR_SLOTS[s]), 'the new spots are there: blindfold, ear plugs, nose ring, two gags, mittens, the ankles');
  let d = syncFarmGear(kit, true);
  ok(d.on.length === kit.length, 'the whole kit goes on (' + d.on.length + ' of ' + kit.length + ')');
  ok(at('ItemHead').Asset.Name === 'LeatherBlindfold' && at('ItemEars').Asset.Name === 'HeavyDutyEarPlugs' && at('ItemNose').Asset.Name === 'NoseShackle', '...blind, deaf, ring through the nose');
  ok(at('ItemMouth').Asset.Name === 'PlugGag' && at('ItemMouth2').Asset.Name === 'HarnessPanelGag', '...gagged two deep: the plug, the panel over it');
  ok(at('ItemHands').Asset.Name === 'PaddedLeatherMittens' && at('ItemFeet').Asset.Name === 'BallChain' && at('ItemNeckRestraints').Asset.Name === 'PetPost', '...mittened, the ball and chain, the stake');
  const stakeSet = recs.find((r) => r[1] === 'PetPost');
  ok(stakeSet && stakeSet[2] === JSON.stringify({ d: 1, l: 2 }) && stakeSet[3] === false, 'the stake is set muddy with a chain lead (and nothing the stake hasn\'t got): ' + (stakeSet && stakeSet[2]));
  const sign = at('ItemNeckRestraints').Property;
  ok(sign.Text === 'Free' && sign.Text2 === 'To' && sign.Text3 === 'Breedscript' && pushes.includes('ItemNeckRestraints'), 'its sign says what they\'re for, in plain letters, and the room is told: ' + [sign.Text, sign.Text2, sign.Text3].join(' '));
  ok(recs.some((r) => r[1] === 'LeatherArmbinder' && r[2] === JSON.stringify({ typed: 2 })), 'the armbinder is strapped the way the piece says (WrapStrap)');
  // tape that belongs on the arms never ends up on the mouth
  P.Appearance = [mk('Cloth', 'Shirt'), mk('ItemArms', 'HempRope', { Craft: { Name: 'Her own rope', Description: 'mine' } })];
  d = syncFarmGear([{ slot: 'arms', name: 'Mummy Wraps (arms)', items: ['DuctTape'], opt: 'Complete', until: far }], true);
  ok(!d.on.length && !P.Appearance.some((it) => it.Asset.Name === 'DuctTape'), 'arms tape with the arms taken: it waits, it doesn\'t go over the mouth or the eyes');
  P.Appearance = [mk('Cloth', 'Shirt')];
  // a safeword away from the farm
  recs.length = 0; d = syncFarmGear(kit, true);
  const n = farmGearLetGo(kit);
  d = syncFarmGear(kit, true);
  ok(n === kit.length && d.off.length === kit.length && !P.Appearance.some((it) => /^Item/.test(it.Asset.Group.Name)), 'a safeword with the farm girl out of reach: every piece comes off, here and now');
  d = syncFarmGear(kit, true);
  ok(!d.on.length, '...and stays off, though her old list still has it');
  const fresh = kit.map((g) => Object.assign({}, g, { until: far + 600000 }));
  d = syncFarmGear(fresh, true);
  ok(d.on.length === kit.length, 'a later trap\'s kit (a fresh one) goes on as ever');
  // somebody else frees a piece: it stays off, even after a reload (a fresh copy of marks.js on the same computer)
  gearFreedHere('Stall Blindfold', fresh[3].until);
  d = syncFarmGear(fresh, true);
  ok(d.off.includes('Stall Blindfold') && !at('ItemHead'), 'a piece somebody else took off stays off here');
  delete require.cache[require.resolve(tmp)];
  const again = require(tmp);
  d = again.syncFarmGear(fresh, true);
  ok(!d.on.includes('Stall Blindfold') && !at('ItemHead'), '...after a reload too, till the farm hears and drops it');
  // the farm drops it: after a while it's forgotten (so the same name can be put on fresh one day)
  const lg = JSON.parse(ls['fhc-gear-letgo@500']); for (const k of Object.keys(lg)) lg[k].at = Date.now() - 11 * 60000; ls['fhc-gear-letgo@500'] = JSON.stringify(lg);
  again.syncFarmGear(fresh.filter((g) => g.name !== 'Stall Blindfold'), true);
  ok(!Object.keys(JSON.parse(ls['fhc-gear-letgo@500'])).some((k) => k.startsWith('Stall Blindfold|')), '...and once the farm\'s list has dropped it, it\'s forgotten');
  // Echo's Limb Teleportation Device: named in plain letters, put on as Echo's own item, only if the game has it
  ASSETS.ItemAddon = []; window.Asset = window.Asset.filter((a) => a.Group.Name !== 'ItemAddon');
  P.Appearance = [mk('Cloth', 'Shirt')];
  const rings = { slot: 'addon', name: 'Barn Teleporter Rings', items: ['EchoLimbTeleporter'], rec: { a: 2, l: 1 }, only: true, until: far + 1, keep: true };
  d = again.syncFarmGear([rings], true);
  ok(!d.on.length && !at('ItemAddon'), 'no Echo\'s clothing mod in the game: the rings don\'t go on, and nothin\' goes on in their place');
  ASSETS.ItemAddon = [again.ECHO_TELEPORTER]; window.Asset.push({ Name: again.ECHO_TELEPORTER, Group: { Name: 'ItemAddon', Family: 'Female3DCG' } });
  d = again.syncFarmGear([rings], true);
  ok(d.on.includes('Barn Teleporter Rings') && at('ItemAddon') && at('ItemAddon').Asset.Name === '隐形药水', 'with it: Echo\'s Limb Teleportation Device goes on, under its own name');
  // a fight: somethin' keeps takin' a piece off. It's put back three times in two minutes, then left off for ten
  // (Nov 21, Laynie: "it keeps taking off the things i put on, and putting back the things it tries to take off")
  P.Appearance = [mk('Cloth', 'Shirt')];
  const fight = [{ slot: 'nose', name: 'Fought Ring', items: ['NoseShackle'], until: far + 7, keep: true }];
  let puts = 0, stuckSaid = null;
  for (let i = 0; i < 6; i++) { const d2 = again.syncFarmGear(fight, true); puts += d2.on.length; if (d2.stuck && d2.stuck.length) stuckSaid = d2.stuck; P.Appearance = P.Appearance.filter((it) => it.Asset.Group.Name !== 'ItemNose'); }
  ok(puts === 3 && stuckSaid && stuckSaid[0] === 'Fought Ring', 'a piece that keeps comin\' off: put back three times, then left off (' + puts + ' times)');
  ok(!again.syncFarmGear(fight, true).on.length, '...and it stays off for now, so a fight can\'t flood the server');

  // every farm switch has a place on the settings pages (Nov 20, Laynie: "I dont see the toggles": the wild traps'
  // three were in the list of switches but on no page)
  const fs = require('fs');
  const lv = fs.readFileSync(path.join(__dirname, '../extension/src/views/livestock.js'), 'utf8'), sp = fs.readFileSync(path.join(__dirname, '../extension/src/views/settingspages.js'), 'utf8');
  const ids = [...lv.slice(lv.indexOf('export const SWITCH_INFO'), lv.indexOf('];', lv.indexOf('export const SWITCH_INFO'))).matchAll(/\[\s*"([a-z]+)",\s*"/g)].map((m) => m[1]);
  const shown = new Set([...sp.matchAll(/"([a-z]+)"/g)].map((m) => m[1]));
  const lost = ids.filter((id) => !shown.has(id));
  ok(ids.length > 20 && ids.includes('wildtraps') && !lost.length, 'every farm switch shows on a settings page (' + ids.length + ' switches; on none: ' + lost.join(', ') + ')');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
