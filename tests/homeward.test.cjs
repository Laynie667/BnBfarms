// THE FARM GIRL'S WHISTLE, IN THE COMPANION (Nov 23). Laynie: "It might be worth building the farm girls summon into the
// companion itself, so summoning cattle back doesnt rely on bc plus or being friends", then yes to: 30 seconds' warnin',
// pulled from anywhere past leashes and locked doors, BC+'s summon kept as a backup, permanent contracts roamin' half an
// hour a pass, and their farm outfit back on when they're home (that part is the bot's: roam-companion.test.cjs).
const path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-home-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/homeward.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const ls = {}, said = [], pops = [], moves = [], hooks = {};
  let joinAnswer = null;
  global.window = {
    localStorage: { getItem(k) { return k in ls ? ls[k] : null; }, setItem(k, v) { ls[k] = String(v); }, removeItem(k) { delete ls[k]; } },
    Player: { MemberNumber: 500 }, CurrentScreen: 'ChatRoom', ChatRoomData: { Name: 'B&B Farm' },
    ServerShowBeep: (t) => pops.push(t),
    ServerPlayerIsInChatRoom: () => window.CurrentScreen === 'ChatRoom',
    ChatRoomLeave: () => { moves.push('leave'); window.CurrentScreen = 'MainHall'; window.ChatRoomData = null; },
    ChatSearchStart: async (space) => { moves.push('search ' + space); window.CurrentScreen = 'ChatSearch'; },
    ServerRoomJoin: async (name) => { moves.push('join ' + name); if (joinAnswer) return { error: { message: joinAnswer } }; window.CurrentScreen = 'ChatRoom'; window.ChatRoomData = { Name: name }; return { value: name, error: null }; },
    ServerSend: () => {},
  };
  const H = require(tmp);
  const mod = { hookFunction: (name, pr, f) => { hooks[name] = f; } };
  H.initHomeward(mod, { botMn: 260239, say: (t) => said.push(t), warnS: 1 });
  const all = () => said.concat(pops).join(' | ');
  const room = (name) => { window.CurrentScreen = 'ChatRoom'; window.ChatRoomData = { Name: name }; };
  const now = () => Date.now();
  const state = (ro, extra) => Object.assign({ roam: Object.assign({ left: 1, of: 1, until: 0, price: 30, safe: false, mins: 60, perm: false, ends: 0, room: 'B&B Farm', space: 'X', by: [260239, 900] }, ro) }, extra || {});

  // on the farm: the rules are kept here, and nothin' happens
  room('B&B Farm'); H.homeKeep(state({ left: 0 })); H.homeTick();
  ok(H.homeState().h && H.homeState().h.room === 'B&B Farm' && !H.homeState().countdown, 'on the farm the bot\'s roam rules are kept on this computer, and nothin\'s whistled');
  // a pass runnin', off the farm: notes at 10 and 2 minutes, then the whistle
  H.homeKeep(state({ until: now() + 9 * 60000 })); room('Somewhere Else'); said.length = 0; H.homeTick();
  ok(/9 minutes left on your roam pass/.test(all()), 'off the farm with 9 minutes left: a note, from the Companion itself');
  H.homeTick(); ok(said.length === 1, '...once');
  let h = H.homeState().h; h.until = now() + 90000; ls['fhc-home'] = JSON.stringify(h); H.homeTick();
  ok(/2 minutes, sugar/.test(all()), '...and at 2 minutes');
  h = H.homeState().h; h.until = now() - 1000; ls['fhc-home'] = JSON.stringify(h); said.length = 0; moves.length = 0; H.homeTick();
  ok(H.homeState().countdown && /Your roam's over.*back on the farm in 1 seconds/.test(all()), 'the pass runs out: the whistle, with its warnin\'');
  await wait(1500);
  ok(moves.join(',') === 'leave,search X,join B&B Farm' && window.ChatRoomData.Name === 'B&B Farm', 'then home: out of that room (leash or locked door, it\'s a forced move), the room search, and into the farm');
  ok(H.homeState().h.local && H.homeState().h.local.late === true, '...late back: the farm girl hears so when they\'re home');
  // back home: the bot's state comes; the late return goes to her books
  H.homeKeep(state({ left: 0 })); const l = H.homeLocalPass();
  ok(l && l.late === true && !H.homeLocalPass(), 'home: the late return is handed to the farm girl, once');
  // holdin' a pass, logged in somewhere else: one starts by itself, as she'd start it
  room('Somewhere Else'); H.homeKeep(state({ left: 2 })); said.length = 0; H.homeTick();
  h = H.homeState().h;
  ok(h.left === 1 && h.until > now() + 55 * 60000 && h.local && h.local.started && /a roam pass spent/.test(all()), 'off the farm holdin\' passes: one\'s spent, an hour, and they\'re told (' + h.left + ' left)');
  room('B&B Farm'); H.homeKeep(state({ left: 2 })); const l2 = H.homeLocalPass();
  ok(l2 && l2.started === true, '...and when they\'re home it goes to her books');
  // off the farm with no pass at all: the whistle
  room('Somewhere Else'); H.homeKeep(state({ left: 0 })); H.homeReset(); said.length = 0; H.homeTick();
  ok(/without a roam pass/.test(all()) && H.homeState().countdown, 'off the farm with no pass: the whistle');
  // back on the farm inside the 30 seconds: called off
  room('B&B Farm'); H.homeTick(); ok(!H.homeState().countdown, '...back on the farm before it blows: called off');
  // a summon beep: from the farm girl or staff, home; from anybody else, nothin'
  room('Somewhere Else'); H.homeKeep(state({ left: 0, until: now() + 30 * 60000 })); H.homeReset(); said.length = 0;
  ok(!H.homeBeep({ MemberNumber: 777, Message: 'summon · come here' }) && !H.homeState().countdown, 'a summon from a stranger: nothin\'');
  ok(H.homeBeep({ MemberNumber: 900, Message: 'summon · Back to the farm.' }) && H.homeState().countdown && /summoned home/.test(all()), 'a summon from staff, mid-pass: the whistle, pass or no pass');
  H.homeReset();
  ok(hooks.ServerAccountBeep && hooks.ChatRoomSafewordRevert, 'it hears the game\'s beeps and the game\'s own safeword');
  // a safeword: nobody whistles them home
  H.homeSafe(); said.length = 0; H.homeTick();
  ok(!H.homeState().countdown && !said.length, 'after a safeword: no whistle');
  ok(!H.homeBeep({ MemberNumber: 260239, Message: 'summon · home' }), '...not even a summon');
  // the contract's over: forgotten
  H.homeKeep(state({ left: 0 }, { contract: { until: now() - 1000 } })); H.homeTick();
  ok(!H.homeState().h, 'the contract\'s over: the rules are forgotten, nobody\'s whistled');
  // no summonable contract at all: nothin' kept
  H.homeKeep(state({})); H.homeKeep({}); ok(!H.homeState().h, 'the bot says there\'s no summonable contract: nothin\'s kept');
  // a full farm: tried again
  room('Somewhere Else'); H.homeKeep(state({ left: 0 })); H.homeReset(); joinAnswer = 'RoomFull'; said.length = 0;
  await H.walkHome(H.homeState().h);
  ok(/The farm's full right now/.test(all()) && H.homeState().retryAt > now(), 'the farm\'s full: they\'re told, and it\'s tried again shortly');
  joinAnswer = null;
  // a permanent contract's half hour: the door's shut (BC+), so the Companion walks them out
  room('B&B Farm'); H.homeReset(); H.homeKeep(state({ left: 1, perm: true, mins: 30 })); moves.length = 0;
  H.homeWantOut(); H.homeKeep(state({ left: 0, perm: true, mins: 30, until: now() + 30 * 60000 })); await wait(300);
  ok(moves.join(',') === 'leave,search X' && /walks you out to the gate/.test(all()), 'a permanent contract asks to roam: the Companion walks them out the door BC+ keeps shut');
  // busy in the wardrobe: it waits for them
  window.CurrentScreen = 'Appearance'; window.ChatRoomData = null; H.homeKeep(state({ left: 0 })); H.homeReset(); said.length = 0; H.homeTick();
  ok(!H.homeState().countdown, 'busy in the wardrobe: it waits for them to finish');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
