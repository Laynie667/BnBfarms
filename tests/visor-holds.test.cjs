// WHAT A VISOR LEAVES ON THEM (Nov 25, extension/src/visor.js). Laynie picked "1, 5-8, 10, 11, 12" and said "sounds good"
// to the plan; this is 1 (the pet name, their name in the room and their trigger), 10 (it comes back on its own),
// 11 (the afterimage) and 12 (it sinks with them).
const path = require('path'), os = require('os'), fs = require('fs'), { pathToFileURL } = require('url');
const { JSDOM } = require('jsdom');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const V = await import(pathToFileURL(path.join(__dirname, '../shared/visor.js')).href);
  ok(V.petName('  Bessie <3 (cow)!! ') === 'Bessie 3 cow' && V.petName('x'.repeat(30)).length === 20 && V.petName("Moo-Moo O'Hara") === "Moo-Moo O'Hara", 'a pet name the game takes: letters, numbers, spaces, \' and -, 20 at most');
  const T1 = { sessions: ['For Visors'], need: 2, show: 'crafter', words: ['good cow', 'empty'], pictures: ['https://x.example/a.gif'] };
  ok(V.tuningCode(Object.assign({}, T1, { pet: '', sink: false })) === 'fzpu33rn' && V.tuningCode(Object.assign({}, T1, { pet: 'Bessie' })) !== 'fzpu33rn', 'old visors keep their code; a pet name makes a new one');

  // ── a game page ──
  const page = new JSDOM('<!doctype html><html><head></head><body><canvas id="MainCanvas" width="2000" height="1000"></canvas><div id="TextAreaChatLog"></div></body></html>', { url: 'https://www.bondageprojects.elementfx.com/R134/BondageClub/' });
  const W = page.window; global.window = W; global.document = W.document;
  W.HTMLCanvasElement.prototype.getContext = function () { const cv = this; return new Proxy({}, { get: (o, k) => (k === 'canvas' ? cv : k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true }); };
  const sent = [], chats = [], toBot = [], cmds = [];
  W.Player = { MemberNumber: 500, Name: 'Moo', Nickname: 'Moo-moo', Appearance: [], ActivePose: [], ArousalSettings: { Progress: 10 }, IsPlayer: () => true, Canvas: { width: 500, height: 1850 } };
  const crafter = { MemberNumber: 221397, Name: 'Laynie', Canvas: { width: 500, height: 1850 } };
  W.ChatRoomCharacter = [W.Player, crafter, { MemberNumber: 700, Name: 'Keeper' }, { MemberNumber: 999, Name: 'Stranger' }];
  W.ChatRoomData = { Name: 'Barn' };
  W.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  W.ServerPlayerIsInChatRoom = () => true;
  W.CommandCombine = (list) => cmds.push(...list);
  const handlers = []; W.ChatRoomRegisterMessageHandler = (h) => handlers.push(h);
  // (the game's own nickname change, as BC R134 does it)
  let nickLocked = false;
  W.CharacterSetNickname = (C, Nick) => {
    Nick = (Nick == null ? '' : Nick).trim();
    if (C.Nickname === Nick || (!Nick && !C.Nickname)) return null;
    if (!Nick) { delete C.Nickname; return null; }
    if (nickLocked) return 'NicknameLocked';
    if (Nick.length > 20) return 'NicknameTooLong';
    if (!/^[\p{L}\p{Nd}\p{Z}'\-]{1,20}$/u.test(Nick)) return 'NicknameInvalidChars';
    C.Nickname = Nick; return null;
  };
  const LIB = "=== induction: In\npace: 1s\n\nHear my voice, {name}.\n\n=== wake: Up\npace: 1s\n\nUp you come.\n\n=== session: For Visors\nvisor: yes\nlevel: deep\ninduction: any\nwake: any\n";
  W.fetch = async (u) => (/library\.txt$/.test(u) ? { ok: true, text: async () => LIB } : { ok: false });
  const esbuild = require('esbuild'), entry = path.join(os.tmpdir(), 'fh-vholds-entry-' + process.pid + '.js'), tmp = path.join(os.tmpdir(), 'fh-vholds-' + process.pid + '.cjs');
  const src = (f) => JSON.stringify(path.join(__dirname, '../extension/src/', f).replace(/\\/g, '/'));
  fs.writeFileSync(entry, 'export * from ' + src('trance.js') + ';\nexport * as Vis from ' + src('visor.js') + ';\n');
  await esbuild.build({ entryPoints: [entry], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent', define: { __FARMHAND_VERSION__: '"0.87.0"' } });
  const Tr = require(tmp), Vis = Tr.Vis, S = Vis.visorState;
  const prefs = {}; const hooks = {};
  const c = { toBot: (t, m) => toBot.push([t, JSON.parse(JSON.stringify(m))]), toChat: (t) => chats.push(t), prefs: () => prefs, botHere: () => false, mod: { hookFunction: (name, pri, fn) => { hooks[name] = fn; } } };
  Tr.initTrance(Object.assign({}, c, { arouse: () => {}, lead: () => {} }));
  Vis.initVisor(c);
  await Vis.publicList(true);
  const el = () => W.document.getElementById('fhc-visor'), after = () => W.document.getElementById('fhc-visor-after');
  const said = (re) => chats.some((x) => re.test(x));
  const room = (type) => sent.filter(([e, d]) => e === 'ChatRoomChat' && d.Type === 'Hidden' && d.Dictionary && d.Dictionary.type === type).map(([, d]) => Object.assign({ to: d.Target }, d.Dictionary));
  const voices = () => handlers.find((x) => /visor voices/.test(x.Description));
  const hear = (mn, name, text, type) => voices().Callback({ Type: type || 'Chat' }, { MemberNumber: mn, Name: name }, text);
  const wear = (t, name) => {
    const code = V.tuningCode(t);
    W.Player.Appearance = [{ Asset: { Name: 'HypnoticVisor', Group: { Name: 'ItemHead' } }, Craft: { Name: name || 'Bessie Visor', Description: V.descLine(code, t), MemberNumber: 221397 } }];
    Vis.check(); Vis.onVisorMsg({ type: 'visorTune', from: 221397, code, t }); return code;
  };
  const takeOff = () => { W.Player.Appearance = []; Vis.check(); };
  const T = { sessions: ['For Visors'], need: 1, words: ['good cow'], pet: 'Bessie', chat: [] };

  // ── 1. the pet name ──
  const code = wear(T);
  ok(el() && W.Player.Nickname === 'Bessie' && said(/Your name's Bessie now\. Anybody who says it takes you down/), 'the visor on: their name in the room is the pet name, and they\'re told what it does');
  ok(S.name && S.name.old === 'Moo-moo' && W.localStorage.getItem('fhc-visor-name@500'), '...their own name kept to give back (kept on this computer, for this account)');
  chats.length = 0; hear(999, 'Stranger', 'hey bessie, come here');
  ok(Tr.tranceState.session && said(/Stranger says “Bessie”… and down you go/), 'somebody in the room says it: down they go');
  chats.length = 0; hear(999, 'Stranger', 'Bessie!');
  ok(!chats.length, '...at most once every 2 minutes');
  Tr.onHypno({ do: 'wake' }); S.dropAt = 0;
  hear(999, 'Stranger', '(bessie, brb)'); hear(500, 'Moo', 'I am Bessie'); hear(260239, 'Farm', 'Bessie, to the stalls'); hear(999, 'Stranger', 'Bessieville is a town');
  ok(!Tr.tranceState.session && !S.dropAt, '...never an out-of-character line, their own, the farm\'s, or a word that only starts with it');
  hear(999, 'Stranger', 'pets Bessie', 'Emote');
  ok(Tr.tranceState.session && S.dropAt, '...an emote with it in counts too');
  Tr.onHypno({ do: 'wake' }); S.dropAt = 0;

  // ── 11. comin' off: the name hangs on, and the afterimage ──
  S.on.deepest = 'deep'; S.name.level = 'deep'; chats.length = 0;
  takeOff();
  const left = S.name && S.name.until - Date.now();
  ok(!el() && W.Player.Nickname === 'Bessie' && left > 23.9 * 3600000 && left <= 24 * 3600000 && said(/You're still Bessie for a while yet/), 'taken off after a deep session: still Bessie, for a day');
  ok(after() && S.after && S.after.total === 120 * 60000 && /good cow/.test(S.after.words.join()), '...and an afterimage at the edges of the screen, two hours after a deep one');
  ok(Vis.visorHolds().join(' | ') === 'called Bessie (24 h) | the visor\'s afterimage (2 h)', 'the trance card lists what\'s holdin\' on: ' + Vis.visorHolds().join(' | '));
  hear(999, 'Stranger', 'where did Bessie go');
  ok(Tr.tranceState.session, '...and the name still takes them down after');
  Tr.onHypno({ do: 'wake' }); S.dropAt = 0;
  S.name.until = Date.now() - 1; S.after.until = Date.now() - 1; Vis.check();
  ok(W.Player.Nickname === 'Moo-moo' && !S.name && !after() && said(/Bessie slips off you, and your own name comes back/), 'time\'s up: their own name back, the afterimage gone');

  // changed back by hand: hardcore puts it back; otherwise that ends it
  wear(T); W.FarmhandDispensary = { hard: () => ({ on: true }), keyholders: () => [700] };
  W.Player.Nickname = 'Moo'; S.nameAt = 0; chats.length = 0; Vis.check();
  ok(W.Player.Nickname === 'Bessie' && said(/That isn't your name\. You're Bessie/), 'hardcore, and they change their name back by hand: the visor puts it back');
  W.FarmhandDispensary = { hard: () => ({ on: false }), keyholders: () => [700] };
  W.Player.Nickname = 'Moo'; chats.length = 0; Vis.check();
  ok(W.Player.Nickname === 'Moo' && !S.name && said(/You take your own name back/), '...not hardcore: changin\' it back ends the name\'s hold');
  takeOff();

  // the crafter or a keyholder gives it back
  W.Player.Nickname = 'Moo-moo';
  wear(T);
  ok(W.Player.Nickname === 'Bessie', '(on again: Bessie)');
  Vis.onVisorMsg({ type: 'visorName', from: 999 });
  ok(W.Player.Nickname === 'Bessie', 'somebody who isn\'t the crafter or a keyholder can\'t give it back');
  Vis.onVisorMsg({ type: 'visorName', from: 700 }); Vis.check();
  ok(W.Player.Nickname === 'Moo-moo' && !S.name && room('visorOk').some((m) => m.to === 700 && m.what === 'name'), 'a keyholder gives them their own name back (and stays given back while it\'s on)');
  cmds.find((x) => x.Tag === 'visor').Action('name Keeper'); cmds.find((x) => x.Tag === 'visor').Action('reset Keeper');
  ok(room('visorName').some((m) => m.to === 700) && room('visorReset').some((m) => m.to === 700), '/visor name <name> and /visor reset <name>: sent to them only');
  takeOff();
  // no-holds-barred: till it's given back
  wear(T); S.on.deepest = 'nhl'; chats.length = 0; takeOff();
  ok(S.name && S.name.perm && said(/stays your name till your crafter or a keyholder gives you yours back/), 'after no-holds-barred: Bessie till it\'s given back');
  Vis.check();
  ok(W.Player.Nickname === 'Bessie' && Vis.visorHolds()[0] === 'called Bessie till it\'s given back', '...and it holds');
  Vis.onVisorMsg({ type: 'visorName', from: 221397 });
  ok(W.Player.Nickname === 'Moo-moo' && !S.name, 'the crafter gives it back');
  // the safeword: everythin' at once
  wear(T); S.on.deepest = 'fun'; takeOff();
  ok(S.name && after(), '(a light session: the name and the afterimage holdin\' on)');
  hooks.ChatRoomSafewordRelease([], () => {});
  ok(W.Player.Nickname === 'Moo-moo' && !S.name && !after() && !S.after, 'the safeword: their own name back and the afterimage gone, at once');
  // a name the game won't change (their owner keeps it): the farm calls them it anyway, and it still works
  nickLocked = true; chats.length = 0; wear(T);
  ok(W.Player.Nickname === 'Moo-moo' && said(/can't change: your owner keeps your name/), 'their owner keeps their name: told so');
  S.dropAt = 0; hear(999, 'Stranger', 'hi Bessie');
  ok(Tr.tranceState.session, '...and the pet name still takes them down');
  Tr.onHypno({ do: 'wake' }); takeOff(); hooks.ChatRoomSafewordRelease([], () => {}); nickLocked = false;

  // ── 10. it comes back on its own ──
  const T2 = { sessions: ['For Visors'], need: 1, words: ['good cow'] }, c2 = V.tuningCode(T2);
  W.Player.Appearance = []; Vis.check(); S.off = {};
  wear(T2); S.unlocked[c2] = true; chats.length = 0;
  el().querySelector('button.icon').click();
  ok(!el() && S.off[c2] && S.off[c2].why === 'icon' && JSON.parse(W.localStorage.getItem('fhc-visor-off@500'))[c2], 'the icon takes it off, and that\'s remembered (a reload doesn\'t undo it)');
  S.off[c2].load = 'an-older-load'; Vis.check();
  ok(!el(), '...not hardcore: it stays off while it\'s worn, even after a reload');
  W.FarmhandDispensary = { hard: () => ({ on: true }), keyholders: () => [700] };
  Vis.check();
  ok(el() && said(/still on you, and it takes hold of you again/), 'hardcore: the next log-in and it takes hold again');
  S.unlocked[c2] = true; chats.length = 0; el().querySelector('button.icon').click();
  ok(!el() && said(/for now: it takes hold again when you next log in or change rooms/), '...taken off again, and told it\'s only for now');
  Vis.check();
  ok(!el(), '(same room, same log-in: off)');
  W.ChatRoomData = { Name: 'Pasture' }; Vis.check();
  ok(el(), '...they join another room: it takes hold again');
  hooks.ChatRoomSafewordRelease([], () => {});
  W.ChatRoomData = { Name: 'Barn' }; Vis.check(); S.off[c2].load = 'an-older-load'; Vis.check();
  ok(!el() && S.off[c2].why === 'safeword', 'the safeword\'s off sticks, rooms and log-ins or not, till it\'s taken off and put back on');
  // turnin' it back on without takin' it off (Laynie, Nov 26: "need to add a action on the visors so can turn it back on if they want, without re equipping")
  const onBtn = () => W.document.getElementById('fhc-visor-on');
  ok(onBtn() && onBtn().textContent === '🌀' && /take hold of you again/.test(onBtn().title), 'worn but switched off: a small 🌀 in the corner');
  chats.length = 0; cmds.find((x) => x.Tag === 'visor').Action('on');
  ok(el() && !onBtn() && said(/You let the Bessie Visor take hold of you again, and the room goes dark/), '/visor on: it takes hold again, no re-equippin\' (after the safeword too: their own choice)');
  chats.length = 0; cmds.find((x) => x.Tag === 'visor').Action('on');
  ok(said(/already got hold of you/), '...already on: says so');
  S.unlocked[c2] = true; el().querySelector('button.icon').click();
  ok(!el() && onBtn() && said(/sooner with the little 🌀 in the corner or \/visor on/), 'taken off with its icon: the 🌀 shows straight away, and they\'re told about it');
  onBtn().click();
  ok(el() && !onBtn(), 'a click on the 🌀: on again');
  prefs.noVisor = true; Vis.check();
  ok(!el() && !onBtn(), '"Farm visors" switched off: no visor, no 🌀');
  prefs.noVisor = false;
  takeOff();
  chats.length = 0; cmds.find((x) => x.Tag === 'visor').Action('on');
  ok(said(/no farm visor on you that's switched off/), '/visor on with nothin\' to turn on: says so');
  ok(!Object.keys(S.off).length, '(taken off for real: the slate\'s clean)');

  // ── 12. it sinks with them ──
  const T3 = { sessions: ['For Visors'], need: 1, words: ['good cow'], sink: true, chat: [], pet: 'Bessie' }, c3 = V.tuningCode(T3);
  S.hours[c3] = { ms: 3600000 - 500, crafter: 221397 };
  wear(T3); chats.length = 0;
  ok(!S.L.chat.includes('whisper'), '(under an hour on it: no whispers, the crafter didn\'t pick them)');
  await wait(2300); Vis.check();
  ok(S.L.chat.includes('whisper') && said(/sinks a little deeper into you: it whispers to you in the chat now/), 'an hour worn: it whispers in the chat now, and they\'re told');
  S.hours[c3].ms = 6 * 3600000 - 500; await wait(1200); Vis.check();
  ok(el() && el().querySelector('.vig') && Vis.visorLocked() && /0 of 2 sessions/.test(el().querySelector('button.icon').title), 'six hours: tunnel vision closin\' in, and one more session before it comes off (hardcore)');
  S.hours[c3].ms = 10 * 3600000; S.on.deepest = 'fun'; S.name.level = 'fun'; takeOff();
  ok(S.name && S.name.until - Date.now() > 1.9 * 3600000, 'ten hours: the name holds twice as long after (two hours after a light session)');
  hooks.ChatRoomSafewordRelease([], () => {}); takeOff();
  S.hours[c3].ms = 40 * 3600000; wear(T3);
  for (let i = 0; i < 30; i++) hear(999, 'Stranger', 'the milking stalls smell like fresh hay today');
  ok(S.fed.length && S.fed.every((x) => /^[a-z' -]+$/.test(x) && x.length <= 24), 'forty hours: bits of the room\'s own words get fed into the dark: ' + S.fed.slice(0, 3).join(' / '));
  Vis.onVisorMsg({ type: 'visorReset', from: 999 });
  ok(S.hours[c3], 'somebody else can\'t start its sinkin\' over');
  Vis.onVisorMsg({ type: 'visorReset', from: 221397 });
  ok(!S.hours[c3] && !S.L.chat.includes('whisper') && room('visorOk').some((m) => m.to === 221397 && m.what === 'reset'), 'its crafter starts it over: back to how they made it');

  // ── the maker: the pet name and the sinkin' ──
  const cards = Vis.visorMakerCards({ setUi: () => {} }); W.document.body.appendChild(cards[0]);
  const pet = cards[0].querySelector('input[placeholder="Bessie"]'); pet.value = 'Daisy <3'; pet.dispatchEvent(new W.Event('change'));
  const sink = [...cards[0].querySelectorAll('label')].find((l) => /it sinks with them/.test(l.textContent)).querySelector('input'); sink.click();
  [...cards[0].querySelectorAll('button')].find((b) => /Make the visor/.test(b.textContent)).click();
  const made = Object.values(S.cache).pop();
  ok(made && made.pet === 'Daisy 3' && made.sink === true && /farm visor: #[a-z0-9]{8}/.test(cards[0].textContent), 'the Visor maker: a pet name and "it sinks with them", locked into the code');
  Vis.stop(true);
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
