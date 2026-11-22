// THE LINE TO THE SERVER (Nov 21). Laynie: "i am repeatedly losing connection right now", "whan i try to move, it
// disconnects too". The game's server cuts off a game that sends it 50 messages in a second. The Companion never lets
// more than 40 go in a second (the rest wait their turn, in order, none lost), and writes every drop down for /farmmem.
const path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-net-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/netguard.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const ls = {}, wire = [], handlers = {};
  global.window = { localStorage: { getItem(k) { return k in ls ? ls[k] : null; }, setItem(k, v) { ls[k] = String(v); } },
    ServerSocket: { on: (ev, f) => { handlers[ev] = f; } } };
  // the game's own ServerSend, and a stand-in for the mod sdk's hook
  const original = (ev, data) => wire.push([Date.now(), ev, data && data.n]);
  let hook = null;
  const mod = { hookFunction: (name, pr, f) => { hook = f; }, callOriginal: (name, args) => original(...args) };
  window.ServerSend = (...args) => hook(args, (a) => original(...a));
  const { initNetGuard, netText, netState } = require(tmp);
  initNetGuard(mod);
  ok(typeof hook === 'function', 'the guard sits on the game\'s ServerSend');
  // a burst of 100 in one go
  const t0 = Date.now();
  for (let i = 0; i < 100; i++) window.ServerSend('ChatRoomChat', { n: i, Type: 'Hidden', Content: 'FarmhandMsg' });
  ok(wire.length === 40 && netState().queue === 60, 'a burst of 100: 40 go at once, 60 wait (' + wire.length + ' sent)');
  await wait(2600);
  ok(wire.length === 100 && wire.every((w, i) => w[2] === i), 'every one of them goes in the end, in the order it was sent (' + wire.length + ')');
  let worst = 0; for (let i = 0; i < wire.length; i++) { let n = 0; for (let j = i; j < wire.length && wire[j][0] - wire[i][0] < 1000; j++) n++; worst = Math.max(worst, n); }
  ok(worst <= 40, '...and never more than 40 inside any one second (most: ' + worst + ', took ' + (Date.now() - t0) + ' ms)');
  // a drop, written down
  handlers.ForceDisconnect('ErrorRateLimited'); handlers.disconnect('io server disconnect');
  const text = netText();
  ok(/busiest second: 40 sent/.test(text) && /Chat\/Hidden farm ×40/.test(text), '/farmmem says the busiest second and what it was: ' + text.split('\n')[1].trim());
  ok(/the server cut us off · ErrorRateLimited/.test(text) && /the server closed it/.test(text), '...and every drop, with what the server said');
  ok(JSON.parse(ls['fhc-drops']).length === 2, '...kept on this computer, so a reload still has them');
  // ordinary sending: straight through
  const before = wire.length; await wait(1100);
  window.ServerSend('ChatRoomChat', { n: 'x' });
  ok(wire.length === before + 1, 'an ordinary message goes straight out, no waitin\'');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
