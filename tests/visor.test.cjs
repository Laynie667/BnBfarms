// THE FARM'S VISOR (Nov 25, extension/src/visor.js + shared/visor.js). Laynie: "renders nothing else map wise, in
// combination with our session and binaurals beats"; "with a onscreen button to turn the visor off… for hardcore mode
// players, is locked until a set number of sessions is finished"; "the keyholders and crafter" open it early; "once a
// visor is built, its settings should be locked in unless the crafter changes them"; "The button needs to be a small icon".
const path = require('path'), os = require('os'), fs = require('fs'), { pathToFileURL } = require('url');
const { JSDOM } = require('jsdom');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  // ── the tuning and its code (shared/visor.js) ──
  const V = await import(pathToFileURL(path.join(__dirname, '../shared/visor.js')).href);
  const n = V.normTuning({ sessions: ['Pink Daze', 'x'.repeat(90)], need: 9, wordEvery: 0.5, wordMs: 50, wordOp: 1, picOp: 2, words: 'good cow, empty (sneaky), deeper',
    pictures: ['https://x.example/a.gif', 'http://x.example/b.gif', 'https://x.example/page.html', 'javascript:alert(1).gif', 'https://x.example/c.webp?s=2'] });
  ok(n.need === 5 && n.wordEvery === 2 && n.wordMs === 500 && n.wordOp === 0.6 && n.picOp === 0.8, 'every setting kept inside its limits: words never more than one every 2 s, never under half a second, never bright');
  ok(n.pictures.join() === 'https://x.example/a.gif,https://x.example/c.webp?s=2' && n.words.join('|') === 'good cow|empty sneaky|deeper' && n.sessions[1].length === 60, '...only links straight to a picture; no brackets in the words');
  const T1 = { sessions: ['For Visors'], need: 2, show: 'crafter', words: ['good cow', 'empty'], pictures: ['https://x.example/a.gif'] };
  const code = V.tuningCode(T1);
  ok(/^[a-z0-9]{8}$/.test(code) && V.tuningCode(JSON.parse(JSON.stringify(T1))) === code && V.tuningCode(Object.assign({}, T1, { need: 3 })) !== code && V.tuningCode(Object.assign({}, T1, { words: ['good cow'] })) !== code,
    'the code: the same settings always give the same one, any change a new one (' + code + ')');
  const line = V.descLine(code, T1);
  ok(line === 'farm visor: #' + code + ' · 2 sessions' && V.codeIn('A pretty visor. ' + line) === code && line.length < 200, 'the line for the crafted description: ' + line);

  // ── a game page ──
  const page = new JSDOM('<!doctype html><html><head></head><body><canvas id="MainCanvas" width="2000" height="1000"></canvas><div id="TextAreaChatLog"></div></body></html>', { url: 'https://www.bondageprojects.elementfx.com/R134/BondageClub/' });
  const W = page.window; global.window = W; global.document = W.document;
  const drawn = []; W.HTMLCanvasElement.prototype.getContext = function () { return { clearRect() {}, drawImage: (src) => drawn.push(src) }; };   // (a stand-in for the browser's drawin')
  const sent = [], chats = [], toBot = [], cmds = [];
  W.Player = { MemberNumber: 500, Name: 'Moo', Appearance: [], ActivePose: [], ArousalSettings: { Progress: 10 }, IsPlayer: () => true, Canvas: { width: 500, height: 1000 } };
  const crafter = { MemberNumber: 221397, Name: 'Laynie', Canvas: { width: 500, height: 1000 } };
  W.ChatRoomCharacter = [W.Player, crafter, { MemberNumber: 700, Name: 'Keeper' }, { MemberNumber: 999, Name: 'Stranger' }];
  W.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  W.ServerPlayerIsInChatRoom = () => true;
  W.CommandCombine = (list) => cmds.push(...list);
  W.ChatRoomRegisterMessageHandler = () => {};
  const LIB = "=== induction: In\npace: 1s\n\nHear my voice, {name}.\nGood {animal}.\n\n=== wake: Up\npace: 1s\n\nUp you come.\n\n=== session: For Visors\nvisor: yes\nlevel: deep\ninduction: any\nwake: any\n";
  W.fetch = async (u) => (/library\.txt$/.test(u) ? { ok: true, text: async () => LIB } : /sets\.json$/.test(u) ? { ok: true, json: async () => ({ 'Pink Daze': ['https://x.example/p.gif'] }) } : { ok: false });
  const esbuild = require('esbuild'), entry = path.join(os.tmpdir(), 'fh-visor-entry-' + process.pid + '.js'), tmp = path.join(os.tmpdir(), 'fh-visor-' + process.pid + '.cjs');
  const src = (f) => JSON.stringify(path.join(__dirname, '../extension/src/', f).replace(/\\/g, '/'));
  fs.writeFileSync(entry, 'export * from ' + src('trance.js') + ';\nexport * as Vis from ' + src('visor.js') + ';\n');
  await esbuild.build({ entryPoints: [entry], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent', define: { __FARMHAND_VERSION__: '"0.84.0"' } });
  const Tr = require(tmp), Vis = Tr.Vis;
  const prefs = {}; let botHere = true; const hooks = {};
  const c = { toBot: (t, m) => toBot.push([t, JSON.parse(JSON.stringify(m))]), toChat: (t) => chats.push(t), prefs: () => prefs, botHere: () => botHere, mod: { hookFunction: (name, pri, fn) => { hooks[name] = fn; } } };
  Tr.initTrance(Object.assign({}, c, { arouse: () => {}, lead: () => {} }));
  Vis.initVisor(c);
  const room = (type) => sent.filter(([e, d]) => e === 'ChatRoomChat' && d.Type === 'Hidden' && d.Dictionary && d.Dictionary.type === type).map(([, d]) => Object.assign({ to: d.Target }, d.Dictionary));
  const bot = (type) => toBot.filter((x) => x[0] === type).map((x) => x[1]);
  const el = () => W.document.getElementById('fhc-visor');
  ok(cmds.some((x) => x.Tag === 'visor'), '/visor is a command (for the crafter and keyholders: /visor unlock <name>)');

  // ── the visor maker ──
  await Vis.publicList(true);
  ok(Vis.visorSessions().map((s) => s.name).join() === 'For Visors', 'the maker offers the sessions on the farm\'s public list');
  const cards = Vis.visorMakerCards({ setUi: () => {} });
  W.document.body.appendChild(cards[0]);
  ok(/Visor maker/.test(cards[0].textContent) && /For Visors \(deep\)/.test(cards[0].textContent) && /Pink Daze \(the farm's set\)/.test(cards[0].textContent), 'the Visor maker: the farm\'s sessions and picture sets to pick from');
  cards[0].querySelector('input[type=checkbox]').click();
  const sels = cards[0].querySelectorAll('select'); sels[0].value = '2'; sels[0].dispatchEvent(new W.Event('change'));
  const ws = cards[0].querySelector('input[placeholder^="good cow"]'); ws.value = 'good cow, empty'; ws.dispatchEvent(new W.Event('change'));
  sels[2].value = 'Pink Daze'; sels[2].dispatchEvent(new W.Event('change'));
  [...cards[0].querySelectorAll('button')].find((b) => /Make the visor/.test(b.textContent)).click();
  const made = bot('visorKeep').pop();
  ok(made && V.codeOk(made.code, made.t) && made.t.sessions.join() === 'For Visors' && made.t.need === 2 && made.t.pictures.join() === 'https://x.example/p.gif' && /farm visor: #[a-z0-9]{8} · 2 sessions/.test(cards[0].textContent),
    'Make the visor: the line to paste, the picture set\'s links locked in with it, and the farm keeps a copy: ' + (made && made.code));

  // ── wearin' one: the tuning comes from whoever knows it, proven by its code ──
  W.Player.Appearance = [{ Asset: { Name: 'HypnoticVisor', Group: { Name: 'ItemHead' } }, Craft: { Name: 'Pink Daze Visor', Description: 'Soft and glowing. ' + line, MemberNumber: 221397 } }];
  Vis.check();
  ok(room('visorAsk').some((m) => m.code === code) && bot('visorAsk').some((m) => m.code === code) && !el(), 'a visor this Companion hasn\'t seen: it asks the room and the farm, and waits');
  Vis.onVisorMsg({ type: 'visorTune', from: 999, code, t: Object.assign({}, T1, { need: 0 }) });
  ok(!el() && !Vis.visorState.cache[code], 'a tuning that doesn\'t match its code (somebody fiddled with it): turned away');
  Vis.onVisorMsg({ type: 'visorTune', from: 221397, code, t: T1 });
  ok(el(), 'the crafter\'s Companion hands it over, and it matches: the visor comes on');
  ok(/Pink Daze Visor settles over your eyes, and the room goes dark/.test(chats.join(' ')), '...and they\'re told');
  const pics = el().querySelectorAll('img.pic'), icon = el().querySelector('button.icon');
  ok(pics.length === 2 && [...pics].some((p) => p.getAttribute('src') === 'https://x.example/a.gif') && el().querySelector('canvas.body'), 'the crafter\'s pictures, see-through, and one body drawn (nobody else, no map)');
  ok(icon && icon.textContent === '👁' && /Take the visor off/.test(icon.title), 'a small icon in the corner to take it off');
  ok(drawn.length && drawn.every((s) => s === crafter.Canvas), 'the one body drawn is the crafter\'s (they picked theirs)');
  await wait(3200);
  const sub = el().querySelector('.sub');
  ok(sub && ['good cow', 'empty'].includes(sub.textContent), 'a subliminal word, up and gone: ' + (sub && sub.textContent));
  // another Companion asks for this one: handed over (to them only)
  Vis.onVisorMsg({ type: 'visorAsk', from: 700, code }); await wait(1600);
  ok(room('visorTune').some((m) => m.to === 700 && m.code === code && V.codeOk(m.code, m.t)), 'somebody else asks for it: handed to them, to them only');

  // ── the session plays under it ──
  await wait(3000);
  ok(Tr.tranceState.session && Tr.tranceState.session.level === 'deep', 'a session from the farm\'s list starts: under (the farm\'s trance on top)');
  await wait(6000);
  ok(chats.some((x) => x === '[Voice] Hear my voice, Moo.') && chats.some((x) => x === '[Voice] Up you come.'), '...in the farm\'s voice, filled in for them');
  ok(bot('visorDone').some((d) => d.code === code && d.level === 'deep' && d.session === 'For Visors') && Vis.visorState.done[code] === 1, 'a session done: counted on the visor, and the farm counts it toward their tiers');

  // ── hardcore: locked till its sessions are done; the crafter or a keyholder can open it ──
  W.FarmhandDispensary = { hard: () => ({ on: true }), keyholders: () => [700] };
  Vis.check(); await wait(50);
  const ic = () => el().querySelector('button.icon');
  // (the icon reads the lock as it's drawn: one more look)
  Vis.onVisorMsg({ type: 'visorUnlock', from: 999 });
  ok(Vis.visorLocked() && !Vis.visorState.unlocked[code], 'the Dispensary\'s hardcore, 1 of 2 sessions done: locked; somebody who isn\'t the crafter or a keyholder can\'t open it');
  ic().click();
  ok(el() && /won't come off yet: 1 of 2 sessions done/.test(chats.pop()), 'the icon, locked: it stays on, and says why');
  Vis.onVisorMsg({ type: 'visorUnlock', from: 700 });
  ok(!Vis.visorLocked() && ic().textContent === '👁' && /Keeper opened your visor/.test(chats.pop()) && room('visorUnlocked').some((m) => m.to === 700), 'a keyholder opens it early: the icon\'s free, and they\'re told it worked');
  ic().click();
  ok(!el() && /take the visor's hold off/.test(chats.pop()), 'the icon: off it comes, and the room comes back');
  Vis.check();
  ok(!el(), '...and it stays off while it\'s worn');
  W.Player.Appearance = []; Vis.check();
  ok(Vis.visorState.done[code] === 0, 'taken off for real: a fresh wearin\' starts the count again');
  // the crafter opens it too
  W.Player.Appearance = [{ Asset: { Name: 'FuturisticVisor', Group: { Name: 'Mask' } }, Craft: { Name: 'Pink Daze Visor', Description: line, MemberNumber: 221397 } }];
  Vis.check();
  ok(el() && Vis.visorLocked(), 'worn again (any visor, any slot): on, and locked again');
  Vis.onVisorMsg({ type: 'visorUnlock', from: 221397 });
  ok(!Vis.visorLocked(), 'its crafter opens it early');
  // /visor unlock <name>, from the crafter's or keyholder's own Companion
  cmds.find((x) => x.Tag === 'visor').Action('unlock Keeper');
  ok(room('visorUnlock').some((m) => m.to === 700), '/visor unlock Keeper: sent to them only');

  // ── the safeword always ends it, hardcore or not ──
  Vis.visorState.unlocked = {}; Vis.check();
  ok(Vis.visorLocked(), '(locked again)');
  Tr.onHypno({ do: 'clear' });
  ok(!el() && !Tr.tranceState.session, 'the safeword: the visor lets go at once, lock or no lock');
  W.Player.Appearance = []; Vis.check(); W.Player.Appearance = [{ Asset: { Name: 'HypnoticVisor', Group: { Name: 'ItemHead' } }, Craft: { Description: line, MemberNumber: 221397 } }]; Vis.check();
  ok(el(), '(on again)');
  hooks.ChatRoomSafewordRelease([], () => {});
  ok(!el(), 'the game\'s own safeword too');
  // their own switch
  W.Player.Appearance = []; Vis.check(); W.Player.Appearance = [{ Asset: { Name: 'HypnoticVisor', Group: { Name: 'ItemHead' } }, Craft: { Description: line, MemberNumber: 221397 } }];
  prefs.noVisor = true; Vis.check();
  ok(!el(), '"Farm visors" switched off: a farm visor\'s just a visor');
  prefs.noVisor = false; Vis.check();
  ok(el(), '...switched back on: it works again');
  Vis.stop(true);
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
