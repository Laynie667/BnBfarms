// A STRAP-ON LOADED WITH ITS CRAFTER'S SEED (Nov 23). Alexia's ask, through Laynie: "making the strapons capable of using
// the crafters cum when arousal is high enough for climax". Laynie's answers: the crafter's seed even when they aren't
// there (no switch), real potency through the breedin' switches, it goes when the WEARER reaches the edge, and only one
// crafted with the right words. "Imagine Alexia and a denied sub both using me, but only Alexia's seed is going in me."
const fs = require('fs'), path = require('path');
const store = {}; const sent = []; const handlers = {};
const P = (mn, name, x) => Object.assign({ mn, name, roles: ['LIVESTOCK'], onDuty: true, herds: [], tempKeys: [], cover: [] }, x);
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  700: P(700, 'Mistress', { roles: ['LUXURY'], gender: 'futa', futa: true }),           // crafted it; never in the room
  701: P(701, 'Sub', { species: 'pup', gender: 'female' }),                              // wears it, no cock of their own
  702: P(702, 'Moo', { species: 'cow', gender: 'female', breedable: true, freeuse: true }),
  703: P(703, 'Shy', { species: 'cow', gender: 'female', breedable: true }),             // breedable, but asks first
  704: P(704, 'Dry', { species: 'cow', gender: 'female', breedable: false }),            // not breedable
}, applications: [], archive: {}, log: [], stuckLog: [] });
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
const strap = (desc, by, name) => ({ Asset: { Name: 'StrapOnSmooth', Group: { Name: 'ItemDevices' } }, Craft: { Name: name || 'Breeding Strap', Description: desc, MemberNumber: by, MemberName: 'Mistress' } });
const chars = [260239, 701, 702, 703, 704].map(m => ({ MemberNumber: m, Name: 'N' + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} }, ArousalSettings: { Progress: 0 } }));
const sub = chars[1];
const W = { document: doc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => handlers[e] = f },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: 'B&B Farm', Admin: [260239] }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
global.console = { ...console, log: () => {}, warn: () => {} };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const L = () => W.FarmhandLedger();
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const msg = d => handlers.ChatRoomMessage(d);
const thrust = (src, tgt, group, asset) => msg({ Sender: src, Type: 'Activity', Content: 'ChatOther-' + group + '-PenetrateFast',
  Dictionary: [{ SourceCharacter: src }, { TargetCharacter: tgt }, { FocusGroupName: group }, { ActivityName: 'PenetrateFast' },
    ...(asset ? [{ Tag: 'ActivityAsset', AssetName: asset, GroupName: 'ItemDevices', CraftName: 'Breeding Strap' }] : [])] });
const arouse = (mn, p) => { chars.find(c => c.MemberNumber === mn).ArousalSettings.Progress = p; handlers.ChatRoomSyncArousal({ MemberNumber: mn, Progress: p }); };
const said = n => sent.slice(n).filter(([e, d]) => e === 'ChatRoomChat' && d && typeof d.Content === 'string').map(([e, d]) => d.Content + JSON.stringify(d.Dictionary || '')).join(' | ');
const held = mn => { const p = L().people[mn].prod; return p && p.held ? Object.values(p.held).reduce((a, b) => a + (b || 0), 0) : 0; };
(async () => { await wait(3500);
  ok(typeof W.__strapSeen === 'function', 'the farm knows seeded strap-ons');
  // a plain strap-on: nothin' to give
  sub.Appearance = [strap('Just a big silicone toy.', 700, 'Big Strap')];
  let n = sent.length; thrust(701, 702, 'ItemVulva', 'StrapOnSmooth'); await wait(1500); arouse(701, 95); await wait(2500);
  ok(!/seed/.test(said(n)) && held(702) === 0, 'a strap-on without the words is just a strap-on: nothin\' goes in');
  // seeded: the crafter's seed, worn by somebody else, the crafter nowhere near
  sub.Appearance = [strap('A breeding strap-on, loaded with her seed.', 700)]; arouse(701, 30);
  n = sent.length; thrust(701, 702, 'ItemVulva', 'StrapOnSmooth'); await wait(2500);
  ok(/N701 is in N702's pussy with Breeding Strap, and it's loaded with Mistress's seed/.test(said(n)), 'the room hears whose seed is in it (' + (said(n).match(/N701 is in[^|"]*/) || [''])[0].slice(0, 90) + ')');
  ok(held(702) === 0, '...and nothin\'s gone in yet: the wearer isn\'t at the edge');
  n = sent.length; arouse(701, 92); await wait(3000);
  const s1 = said(n);
  ok(/N701 hits the edge with Breeding Strap buried in N702, and it pumps .* of Mistress's seed into N702's pussy/.test(s1), 'the wearer hits the edge: it pumps the crafter\'s seed (' + (s1.match(/N701 hits the edge[^|"]*/) || [''])[0].slice(0, 110) + ')');
  const P2 = L().people[702].prod;
  ok(held(702) >= 40, '...a real load, in what they hold (' + Math.round(held(702)) + ' mL)');
  ok(P2.lastStud === 700 && P2.totals.by && P2.totals.by[700] && P2.totals.by[700].n === 1, '...on the books as the crafter\'s, not the wearer\'s');
  ok(!P2.totals.by[701], '...the denied sub gave none of their own');
  ok(P2.lastFill && P2.lastFill.stud === 700, '...and it can catch: the crafter\'s potency, the crafter\'s line');
  ok(P2.scent && P2.scent.stud === 700, '...they smell of the crafter now');
  // held at the edge: once now, again in two minutes; down and back up: again
  const h1 = held(702); n = sent.length; arouse(701, 97); await wait(2000);
  ok(held(702) === h1, 'still at the edge a moment later: it doesn\'t go again straight away');
  arouse(701, 50); arouse(701, 93); await wait(2000);
  ok(held(702) > h1, 'down off the edge and back up: it pumps again');
  // the crafter's seed in somebody who hasn't said yes: asked, with both names; a yes, and it goes at once
  arouse(701, 20); n = sent.length; thrust(701, 703, 'ItemButt', 'StrapOnSmooth'); await wait(1500); arouse(701, 95); await wait(2500);
  ok(held(703) === 0 && /strap-on is loaded with Mistress's seed, and it's in your ass/.test(said(n)), 'not free use: asked first, sayin\' whose seed and whose strap-on');
  msg({ Sender: 703, Type: 'Chat', Content: '?yes', Dictionary: [] }); await wait(3500);
  ok(held(703) > 0, '...a yes, and it goes in at once, the wearer still at the edge');
  // their switches: not breedable, nothin' goes in
  arouse(701, 20); n = sent.length; thrust(701, 704, 'ItemVulva', 'StrapOnSmooth'); await wait(1500); arouse(701, 95); await wait(2500);
  ok(held(704) === 0, 'somebody who isn\'t breedable gets none of it');
  // an amount in the craft is what it gives
  ok(Math.round(W.__strapLoad(700, 'breeding strap-on, 300 ml')) === 300, 'an amount in the craft is what it gives (300 mL)');
  out(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
