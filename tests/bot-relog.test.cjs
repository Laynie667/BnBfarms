// THE FARM OFFICE AFTER A DROP (Nov 23). Laynie: "make the relog feature more robust, it seems not to currently work",
// "i meant the bot relogging after a disconnect". The records: back in a minute or two most times, but gone for half an
// hour to eight hours three times. Since R134 a server kick closes the game's own connection and nothin' reopens it; the
// watchdog's reload could stop dead at WCE's "leave the club?"; a full room keeps out even its admin.
const fs = require('fs'), path = require('path');
const store = { bnb_user: 'farmbot', bnb_pass: 'pw', bnb_login_bad: '' }; const sent = []; const handlers = {};
global.GM_getValue = (k, d) => k in store ? store[k] : d; global.GM_setValue = (k, v) => store[k] = v; global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: 'visible', activeElement: null };
let logins = 0, reloads = 0, connects = 0;
class BeforeUnloadEvent { preventDefault() { this.stopped = true; } }
Object.defineProperty(BeforeUnloadEvent.prototype, 'returnValue', { configurable: true, get() { return this._rv || ''; }, set(v) { this._rv = v; } });
const sock = { connected: true, active: true, on: (e, f) => handlers[e] = f, off() {}, connect() { connects++; } };
const W = { document: doc, addEventListener() {}, location: { reload() { reloads++; } }, alert() {}, prompt() {}, BeforeUnloadEvent,
  ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: sock, ServerIsConnected: true,
  LoginDoLogin: () => { logins++; }, Player: {}, Commands: [] };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(' ')) };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, '../dist/farmhand-bot.user.js'), 'utf8'));
const wait = ms => new Promise(r => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => { await wait(3500);
  const realNow = Date.now; let skew = 0; Date.now = () => realNow() + skew;
  const st = W.__st();
  // the server throws the bot off: the game closes its own connection and sits on the Relog screen, "not connected"
  W.Player = { MemberNumber: 260239, AccountName: 'FarmBotAcct', Name: 'Farm' }; W.CurrentScreen = 'Relog';
  handlers.ForceDisconnect('ErrorRateLimited'); handlers.disconnect('io client disconnect');
  sock.connected = false; sock.active = false; W.ServerIsConnected = false;
  ok(st.droppedAt > 0 && W.__dropsList().slice(-1)[0].why === 'ErrorRateLimited', 'a kick is written down, with what the server said');
  let c0 = connects; W.__tryLogin();
  ok(connects === c0, 'not straight away');
  skew += 11000; W.__tryLogin();
  ok(connects === c0 + 1, 'ten seconds on, the bot opens the closed connection itself (the game never would)');
  skew += 5000; W.__tryLogin(); ok(connects === c0 + 1, '...and not again a few seconds later');
  skew += 16000; W.__tryLogin(); ok(connects === c0 + 2, '...but again twenty seconds on, if it still isn\'t back');
  for (let i = 0; i < 8; i++) { skew += 130000; W.__tryLogin(); }
  ok(connects === c0 + 10 && st.reconnectTries === 10, '...and never more than two minutes apart, for as long as it takes');
  // socket.io is still tryin' by itself (an ordinary blip): leave it be
  st.droppedAt = Date.now(); st.reconnectAt = 0; st.reconnectTries = 0; sock.active = true; c0 = connects;
  skew += 30000; W.__tryLogin(); ok(connects === c0, 'a blip the game is reconnectin\' by itself is left to it');
  sock.active = false;
  // it's back: the login goes as ever
  sock.connected = true; W.ServerIsConnected = true; st.lastLoginAttempt = 0; st.loginTried = 0; let l0 = logins; W.__tryLogin();
  ok(logins === l0 + 1, 'once the connection is back, the bot logs back in');
  // back on duty, after a long drop: the proprietors hear
  st.droppedAt = Date.now() - 12 * 60000; st.dropWhy = 'ErrorRateLimited'; const s0 = sent.length;
  st.mutual = { at: Date.now(), set: new Set([221397, 232922]) };   // (the proprietors are friends with the bot: a beep reaches them)
  const q0 = st.queue.length; W.__droppedBack();
  // (beeps wait in the send queue till the bot's back in the room)
  const beeps = sent.slice(s0).concat(st.queue.slice(q0).map(x => [x.ev, x.data])).filter(([e]) => e === 'AccountBeep');
  ok(beeps.some(([, d]) => /dropped 12 minutes ago, the server cut it off for sendin' too much, and it's back/.test(JSON.stringify(d))) && !st.droppedAt, 'back after twelve minutes: the proprietors get a beep sayin\' why and how long');
  ok(W.__dropsList().slice(-1)[0].back > 0 && /back after/.test(W.__dropsText()), '...and the drop is closed in the list, which the status shows');
  st.droppedAt = Date.now() - 60000; st.dropWhy = 'transport close'; const s1 = sent.length, q1 = st.queue.length; W.__droppedBack();
  ok(!sent.slice(s1).concat(st.queue.slice(q1).map(x => [x.ev, x.data])).some(([e]) => e === 'AccountBeep'), 'a one-minute blip bothers nobody');
  // somebody opens the bot's account elsewhere: three minutes before it's taken back
  W.CurrentScreen = 'Relog'; handlers.ForceDisconnect('ErrorDuplicatedLogin'); st.lastLoginAttempt = 0; l0 = logins;
  W.__tryLogin(); skew += 60000; st.lastLoginAttempt = 0; W.__tryLogin();
  ok(logins === l0, 'the account opened elsewhere: the bot doesn\'t kick them straight off');
  skew += 2.5 * 60000; st.lastLoginAttempt = 0; W.__tryLogin();
  ok(logins === l0 + 1, '...three minutes on, it takes the account back');
  st.droppedAt = 0; st.dupUntil = 0;
  // the watchdog
  W.CurrentScreen = 'ChatSearch'; st.lastHealthy = Date.now() - 6 * 60000; st.reloading = false; let r0 = reloads;
  W.__watchdog(); await wait(3300);
  ok(reloads === r0, 'six minutes out of sorts: no reload yet, the reconnect gets its go');
  st.lastHealthy = Date.now() - 11 * 60000; st.roomFullAt = Date.now(); W.__watchdog(); await wait(3300);
  ok(reloads === r0, 'the farm is full: no reload over it (the room keeps out even its admin)');
  st.roomFullAt = 0; W.__watchdog(); await wait(3300);
  ok(reloads === r0 + 1, 'ten minutes and nothin\'s worked: the page is reloaded');
  const e = new BeforeUnloadEvent(); e.preventDefault(); e.returnValue = 'Are you sure you want to leave the club?';
  ok(!e.stopped && e.returnValue === '', '...and nothin\' can stop it to ask "leave the club?"');
  W.__watchdog(); await wait(3300); ok(reloads === r0 + 1, 'a reload under way isn\'t sent twice');
  skew += 125000; st.lastHealthy = Date.now() - 20 * 60000; W.__watchdog(); await wait(3300);
  ok(reloads === r0 + 2, '...but one that never happened is tried again two minutes on');
  // a full room: the bot waits for a space, and says so
  handlers.ChatRoomSearchResponse('RoomFull');
  ok(st.roomFullAt > 0, 'the server says the farm is full: the bot notes it and keeps tryin\' to get in');
  out(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
