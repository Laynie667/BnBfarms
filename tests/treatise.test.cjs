// ECHO'S BODY TREATISE (Nov 21). Laynie: "I keep getting disconnected", "I turned everything off and am still having
// problems". Her console: since the game's November update the game calls the Treatise unfinished every time her own
// character comes back from the server, changes nothin', and sends her whole look up again, round and round, till the
// server cuts her off for sendin' too much. The farm doesn't write on it any more, one the farm put on comes off, and
// one of your own gets a heads-up (once a week, not every load).
const path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-treatise-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/marks.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const ls = {};
  const G = {};
  for (const g of ['BodyMarkings', 'ClothAccessory', 'BodyMarkings2_Luzi', 'HairFront', 'ItemArms']) G[g] = { Name: g, Clothing: false };
  const item = (g, n, p) => ({ Asset: { Name: n, Group: G[g] }, Property: p || {} });
  let sends = 0;
  global.window = {
    localStorage: { getItem(k) { return k in ls ? ls[k] : null; }, setItem(k, v) { ls[k] = String(v); }, removeItem(k) { delete ls[k]; } },
    AssetGroupGet: (f, n) => G[n] || null,
    ServerAppearanceBundle: (a) => a.map((it) => ({ Group: it.Asset.Group.Name, Name: it.Asset.Name, Property: JSON.parse(JSON.stringify(it.Property || {})) })),
    ServerAppearanceLoadFromBundle: (C, f, b) => { C.Appearance = b.map((x) => item(x.Group, x.Name, x.Property)); },
    ChatRoomCharacterUpdate: () => sends++,
    CurrentScreen: 'ChatRoom',
  };
  const me = (list) => { window.Player = { MemberNumber: 221397, AssetFamily: 'Female3DCG', Appearance: list }; };
  const has = (g) => window.Player.Appearance.find((it) => it.Asset.Group.Name === g);
  const M = require(tmp);

  // 1. the farm writes: never on the Treatise now, even when the game has it
  me([item('HairFront', 'Hair1')]);
  M.markBody({ write: { line: 'cum bucket', area: 'hips' } }, { marks: true });
  M.markBody({ tally: 'USED 3X TODAY' }, { marks: true });
  const bw = window.Player.Appearance.find((it) => it.Asset.Name === 'BodyWritings');
  ok(!has('BodyMarkings2_Luzi'), 'the farm writes on you: no Body Treatise goes on, though the game has it');
  ok(bw && bw.Property.Text === 'USED 3X TODAY' && bw.Property.Text2 === 'CUM BUCKET', '...the words go on the game\'s own body writing, and the day\'s tally is a line of it (' + (bw && bw.Property.Text) + ' / ' + (bw && bw.Property.Text2) + ')');
  const mine = item('BodyMarkings2_Luzi', '身体论文', { TypeRecord: { a: 1 }, Text1: 'MINE' });
  me([item('HairFront', 'Hair1'), mine]);
  M.markBody({ write: { line: 'breeder' } }, { marks: true });
  ok(has('BodyMarkings2_Luzi').Property.Text1 === 'MINE' && Object.keys(has('BodyMarkings2_Luzi').Property).length === 2, '...and one you\'re wearin\' yourself isn\'t touched');

  // 2. one the farm put on: off, once, with a note
  let notes = [];
  ls['fhc-marks'] = JSON.stringify({ treatise: true, writeGroup: 'BodyMarkings' });
  me([item('HairFront', 'Hair1'), item('BodyMarkings2_Luzi', '身体论文', { TypeRecord: { l: 1 }, Text34: 'USED 3X TODAY' })]);
  let r = M.treatiseCleanup((t) => notes.push(t));
  ok(r.did[0] === 'off' && !has('BodyMarkings2_Luzi') && !!has('HairFront'), 'one the farm put on comes off when the Companion starts, and nothin\' else does');
  ok(notes.length === 1 && /offline/.test(notes[0]) && !JSON.parse(ls['fhc-marks']).treatise && JSON.parse(ls['fhc-marks']).writeGroup === 'BodyMarkings', '...you\'re told why, and the farm forgets it (the rest of what it remembers stays)');

  // 3. your own: a heads-up, once a week
  notes = [];
  me([item('HairFront', 'Hair1'), item('BodyMarkings2_Luzi', '身体论文', { TypeRecord: { a: 1 }, Text1: 'MINE' })]);
  r = M.treatiseCleanup((t) => notes.push(t));
  ok(r.did[0] === 'told' && !!has('BodyMarkings2_Luzi') && notes.length === 1 && /wardrobe/.test(notes[0]), 'one of your own stays on, with a heads-up: what it can do, and where to take it off');
  r = M.treatiseCleanup((t) => notes.push(t));
  ok(!r.did.length && notes.length === 1, '...and not again on the next load');
  ls['fhc-treatise-note'] = String(Date.now() - 8 * 86400000);
  r = M.treatiseCleanup((t) => notes.push(t));
  ok(r.did[0] === 'told' && notes.length === 2, '...but again a week on, if it\'s still on');

  // 4. a locked one stays (the farm never pulls a lock)
  ls['fhc-marks'] = JSON.stringify({ treatise: true });
  me([item('BodyMarkings2_Luzi', '身体论文', { LockedBy: 'MetalPadlock' })]);
  r = M.treatiseCleanup(() => {});
  ok(!!has('BodyMarkings2_Luzi'), 'a locked one stays on: the farm never pulls a lock');

  // 5. none on: nothin' happens, nothin' is sent
  const s0 = sends; me([item('HairFront', 'Hair1')]);
  r = M.treatiseCleanup(() => notes.push('x'));
  ok(r.ok && !r.did.length && sends === s0 && !JSON.parse(ls['fhc-marks']).treatise, 'no Treatise on: nothin\' happens and nothin\' is sent');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
