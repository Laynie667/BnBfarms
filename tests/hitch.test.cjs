// Nov 18: HITCHIN' POSTS (BC R134's tether points). Laynie: the game's own leash setting decides, "any staff or owner"
// can hitch, and it lasts "until the time's up, or milked according to their settings".
// The bot, on a pretend R134 room: three posts, the game's tether request faked the way the game answers it.
const fs = require('fs'), path = require('path');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const store = {}, sent = [], handlers = {}, requests = [];
  const S = (mn, name, extra) => Object.assign({ mn, name, roles: ['LIVESTOCK'], species: 'cow', gender: 'female', onDuty: true, herds: [], tempKeys: [], cover: [], limits: '', milkable: true }, extra || {});
  store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: { '221397': { mn: 221397, name: 'Laynie', roles: ['PROPRIETOR'], onDuty: true, herds: [], tempKeys: [], cover: [] },
    '500': S(500, 'Moo'), '600': S(600, 'Bull', { gender: 'male', milkable: false }), '700': S(700, 'Rex', { gender: 'male', species: 'dog', milkable: false }), '800': S(800, 'Daisy') },
    applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [],
    spots: { milking1: { X: 35, Y: 28 }, stocks: { X: 30, Y: 2 }, pasture: { X: 31, Y: 16 }, home: { X: 34, Y: 33 } },
    zones: { stockade: { group: 'stockade', a: { X: 29, Y: 0 }, b: { X: 31, Y: 4 } }, pasture: { group: 'pasture', a: { X: 28, Y: 20 }, b: { X: 39, Y: 7 } } } });
  global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
  const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible' };
  const LEAD = { Asset: { Name: 'CollarLeash', Group: { Name: 'ItemNeckRestraints' } } }, COLLAR = { Asset: { Name: 'LeatherCollar', Group: { Name: 'ItemNeck' } } };
  const at = (m, X, Y, app) => ({ MemberNumber: m, Name: 'N' + m, Appearance: app || [], OnlineSharedSettings: {}, MapData: { Pos: { X, Y }, PrivateState: {} }, IsPlayer: () => false });
  const idx = (x, y) => y * 40 + x;
  const chars = [at(260239, 34, 33), at(221397, 33, 33), at(500, 33, 29, [COLLAR, LEAD]), at(600, 30, 30), at(700, 31, 31), at(800, 30, 15, [COLLAR])];
  const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
    ServerSend: (ev, d) => { sent.push([ev, JSON.parse(JSON.stringify(d))]);
      // their game moves them where I teleport them (the farm's teleport)
      if (ev === 'ChatRoomChat' && d && d.Content === 'ChatRoomMapViewTeleport') { const C = chars.find((c) => c.MemberNumber === d.Target), e = d.Dictionary.find((x) => x.Position); if (C && e) C.MapData.Pos = { X: e.Position.X, Y: e.Position.Y }; } },
    ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
    Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomCharacter: chars, ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} },
    ChatRoomData: { Name: 'B&B Farm', Admin: [260239], MapData: { Type: 'Always', CellData: { [idx(37, 30)]: { Type: 'Tether' }, [idx(30, 0)]: { Type: 'Tether' }, [idx(32, 17)]: { Type: 'Tether' }, [idx(10, 10)]: { Type: 'Sign', Text: 'B&B' } } } },
    ChatRoomMapViewWidth: 40, ChatRoomMapViewHeight: 40 };
  const STYLE = { [idx(37, 30)]: 'Pole', [idx(30, 0)]: 'X-Cross', [idx(32, 17)]: 'NordicPillar' };
  W.MapManager = { Map: { isValidObjectConfig: (i, t) => t === 'Tether' && !!STYLE[i], getObject: (i) => ({ Style: STYLE[i] || 'Blank' }) } };
  W.InventoryItemHasEffect = (it, eff) => eff === 'Leash' && it && it.Asset && /Leash|Chain/.test(it.Asset.Name);
  W.ChatRoomCanBeLeashedBy = (src, C) => C.Appearance.some((it) => W.InventoryItemHasEffect(it, 'Leash'));
  W.ServerChatRoomGetAllowItem = () => true;
  const D = (a, b) => Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y));
  // the game's tether request, answered the way the target's game answers it
  W.ChatRoomMapViewSendTetherRequest = (C, tether) => {
    requests.push([C.MemberNumber, tether && tether.Position]);
    const me = chars[0].MapData.Pos;
    if (!tether) { delete C.MapData.Tether; return; }
    if (C.OnlineSharedSettings.AllowPlayerLeashing !== false && W.ChatRoomCanBeLeashedBy(260239, C) && D(me, tether.Position) <= 1 && D(C.MapData.Pos, tether.Position) <= 1) C.MapData.Tether = tether;
  };
  W.LZString = { compressToBase64: (t) => Buffer.from(t).toString('base64'), decompressFromBase64: (t) => Buffer.from(t, 'base64').toString() };
  global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
  const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => { const t = a.join(' '); if (!/Worker/.test(t)) warns.push(t); } };
  W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
  await wait(3000); W.__cfg.SEND_INTERVAL_MS = 2; W.__cfg.USER_COOLDOWN_S = 0;
  const say = async (mn, text) => { handlers.ChatRoomMessage({ Sender: mn, Type: 'Chat', Content: text }); await wait(500); };
  const said = (n) => JSON.stringify(sent.slice(n));
  const tick = async (times) => { for (let i = 0; i < (times || 3); i++) { W.__hitchTick(); await wait(1700); } };
  const L = W.FarmhandLedger(), moo = chars[2], book = () => W.__hitchBook();

  const posts = W.__hitchPosts();
  ok(posts.length === 3 && posts.map((p) => p.name).sort().join() === 'the parlour pole,the pasture post,the stockade cross', 'the posts on the map, named for where they are (' + posts.map((p) => p.name).join(', ') + ')');
  let n = sent.length; await say(221397, '?hitch');
  ok(/parlour pole/.test(said(n)) && /stockade cross/.test(said(n)), '?hitch alone lists them');

  // milkin' time: tied by the stalls, till she's milked
  n = sent.length; await say(221397, '?hitch Moo parlour');
  ok(D(moo.MapData.Pos, { X: 37, Y: 30 }) <= 1, 'Moo\'s brought right beside the parlour pole (' + JSON.stringify(moo.MapData.Pos) + ')');
  await tick(3);
  ok(moo.MapData.Tether && moo.MapData.Tether.Position.X === 37 && moo.MapData.Tether.MemberNumber === 260239, '...and her lead\'s tied to it, by me (the game took the knot)');
  ok(book()[500] && book()[500].milk === true && book()[500].name === 'the parlour pole', '...a milk hitch: she makes milk, and it\'s the parlour (' + JSON.stringify(book()[500]) + ')');
  ok(/hitch|ties|tie|knot/i.test(said(n)) && /till you're milked/.test(said(n)), '...the room hears it, and she\'s told it\'s till she\'s milked');
  ok((W.__stateFor(500).now || []).some((x) => /Hitched to the parlour pole/.test(x.text)), '...and her panel\'s right-now strip says so');
  n = sent.length; W.__prodOf(500).lastMilkAt = Date.now() + 1; await tick(1);
  ok(!book()[500] && !moo.MapData.Tether && requests.some((r) => r[0] === 500 && r[1] === null), 'milked: I untie her');
  ok(/Milked and done|Emptied out/.test(said(n)), '...with a line for it');

  // a timed one at the stockade, and who may
  n = sent.length; await say(600, '?hitch Moo stockade 20');
  ok(!W.__hitchWant().has(500) && /staff|owner|leader/.test(said(n)), 'a stud who\'s neither staff nor her owner can\'t hitch her');
  moo.Ownership = { MemberNumber: 600 };
  await say(600, '?hitch 500 stockade 20'); await tick(3);   // (said differently: the same line twice in a row is ignored)
  ok(book()[500] && book()[500].name === 'the stockade cross' && !book()[500].milk && Math.abs(book()[500].until - Date.now() - 20 * 60000) < 15000, '...her owner can: the stockade cross, twenty minutes');
  n = sent.length; await say(700, '?unhitch Moo');
  ok(book()[500] && /Only whoever could hitch/.test(said(n)), 'somebody else can\'t untie her');
  book()[500].until = Date.now() - 1; await tick(1);
  ok(!book()[500] && !moo.MapData.Tether, 'time\'s up: untied');

  // the safeword, and the game sayin' no
  await say(221397, '?hitch Moo pasture 30'); await tick(3);
  ok(book()[500] && book()[500].name === 'the pasture post', 'the pasture post');
  await say(500, '?safeword');
  ok(!book()[500] && !moo.MapData.Tether, 'her safeword unties her at once');
  moo.OnlineSharedSettings.AllowPlayerLeashing = false; n = sent.length;
  await say(221397, '?hitch Moo parlour');
  ok(!W.__hitchWant().has(500) && /leashing switched off/.test(said(n)), 'leashing off in her game: nobody ties her');
  moo.OnlineSharedSettings.AllowPlayerLeashing = true;
  L.people['500'].limits = 'no leashing please'; n = sent.length;
  await say(221397, '?hitch 500 parlour');
  ok(!W.__hitchWant().has(500) && /limits/.test(said(n)), 'her limits rule it out: not tied');
  L.people['500'].limits = '';
  n = sent.length; await say(221397, '?hitch Moo the moon');
  ok(/No post by that name/.test(said(n)), 'a post that isn\'t there: says which there are');
  n = sent.length; await say(221397, '?hitch Rex parlour milk');
  ok(/doesn't make milk/.test(said(n)), 'a milk hitch for somebody who makes none: minutes instead');

  // no lead on her: her Companion clips one on when she's let the farm put gear on her
  const daisy = chars[5]; n = sent.length;
  await say(221397, '?hitch Daisy pasture 15');
  ok(!W.__hitchWant().has(800) && /needs a lead/.test(said(n)), 'no lead, no Companion: she needs a lead on first');
  W.__st().companions.set(800, { at: Date.now(), ver: '0.64.0' });
  await say(221397, '?hitch 800 pasture 15');
  ok(L.people['800'].gear && L.people['800'].gear.leash && L.people['800'].gear.leash.src === 'hitch', 'a collar and farm gear allowed: her Companion\'s told to clip a lead on');
  await tick(2);
  ok(!daisy.MapData.Tether, '...and I wait for it before askin\' her game to tie her');
  daisy.MapData.Pos = { X: 33, Y: 17 };   // (her Companion walks her over: nobody's walkin' her in here)
  daisy.Appearance.push(LEAD); await tick(3);
  ok(daisy.MapData.Tether && book()[800], '...it\'s on: tied to the pasture post');
  await say(221397, '?unhitch Daisy');
  ok(!book()[800] && !(L.people['800'].gear && L.people['800'].gear.leash), '?unhitch: untied, and the farm\'s lead comes off with the knot');

  const errs = warns.filter((w) => /TypeError|ReferenceError/i.test(w)); ok(!errs.length, 'no errors in the bot ' + errs.join(' | ').slice(0, 200));
  out(fails ? '\n❌ ' + fails + ' failed' : '\n✅ all good'); process.exit(fails ? 1 : 0);
})();
