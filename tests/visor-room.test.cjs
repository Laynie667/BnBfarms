// THE VISOR'S ROOM SIDE (Nov 26, extension/src/visor.js). Laynie picked 5-8 ("sounds good"): seen from outside, peek
// inside (and feed a word), herd trance, the crafter looms; and "yes" to the afterimage bein' the crafter's pick with a
// wearer's own switch.
const path = require('path'), os = require('os'), fs = require('fs'), { pathToFileURL } = require('url');
const { JSDOM } = require('jsdom');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const V = await import(pathToFileURL(path.join(__dirname, '../shared/visor.js')).href);
  const T1 = { sessions: ['For Visors'], need: 2, show: 'crafter', words: ['good cow', 'empty'], pictures: ['https://x.example/a.gif'] };
  ok(V.tuningCode(T1) === 'fzpu33rn' && V.normTuning(Object.assign({}, T1, { show: 'loom', feed: 'keys' })).show === 'loom' && V.normTuning({ show: 'sideways' }).show === 'crafter' && V.normTuning({ feed: 'everyone' }).feed === undefined,
    'old visors keep their code; the new choices (the crafter loomin\', who may feed it) kept inside their limits');

  // ── a game page ──
  const page = new JSDOM('<!doctype html><html><head></head><body><canvas id="MainCanvas" width="2000" height="1000"></canvas><div id="TextAreaChatLog"></div></body></html>', { url: 'https://www.bondageprojects.elementfx.com/R134/BondageClub/' });
  const W = page.window; global.window = W; global.document = W.document;
  const drawn = [], mainLog = [];
  W.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/webp;base64,AAAA';
  W.HTMLCanvasElement.prototype.getContext = function () {
    const cv = this, main = cv.id === 'MainCanvas';
    return new Proxy({}, { get: (o, k) => (k === 'canvas' ? cv : k === 'measureText' ? () => ({ width: 10 }) : k === 'createRadialGradient' ? () => ({ addColorStop() {} })
      : k === 'drawImage' ? (...a) => drawn.push({ on: cv.className, src: a[0] }) : (...a) => { if (main) mainLog.push([k, a[0]]); }), set: () => true });
  };
  // (pictures load at once; a kept likeness reads as 250 x 560)
  Object.defineProperty(W.HTMLImageElement.prototype, 'src', { configurable: true, get() { return this.getAttribute('src') || ''; }, set(v) { this.setAttribute('src', v); setTimeout(() => this.dispatchEvent(new W.Event('load')), 5); } });
  Object.defineProperty(W.HTMLImageElement.prototype, 'complete', { configurable: true, get() { return true; } });
  Object.defineProperty(W.HTMLImageElement.prototype, 'naturalWidth', { configurable: true, get() { return this.getAttribute('src') ? 250 : 0; } });
  Object.defineProperty(W.HTMLImageElement.prototype, 'naturalHeight', { configurable: true, get() { return this.getAttribute('src') ? 560 : 0; } });
  W.MainCanvas = W.document.getElementById('MainCanvas'); W.CurrentScreen = 'ChatRoom'; W.CurrentCharacter = null;
  W.HTMLMediaElement.prototype.play = () => Promise.resolve(); W.HTMLMediaElement.prototype.pause = () => {}; W.HTMLMediaElement.prototype.load = () => {};
  const sent = [], chats = [], cmds = [];
  W.Player = { MemberNumber: 500, Name: 'Moo', Appearance: [], ActivePose: [], ArousalSettings: { Progress: 10 }, IsPlayer: () => true, Canvas: { width: 500, height: 1850, id: 'moo' } };
  const crafter = { MemberNumber: 221397, Name: 'Laynie', Canvas: { width: 500, height: 1850, id: 'laynie' } };
  const keeper = { MemberNumber: 700, Name: 'Keeper', Canvas: { width: 500, height: 1850, id: 'keeper' } }, low = { MemberNumber: 300, Name: 'Daisy', Canvas: { width: 500, height: 1850, id: 'daisy' } };
  const stranger = { MemberNumber: 999, Name: 'Stranger', HeightRatio: 1, Canvas: { width: 500, height: 1850, id: 'stranger' } };
  W.ChatRoomCharacter = [W.Player, crafter, keeper, stranger, low];
  W.ChatRoomData = { Name: 'Barn' };
  W.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  W.ServerPlayerIsInChatRoom = () => true;
  W.CommandCombine = (list) => cmds.push(...list);
  W.ChatRoomRegisterMessageHandler = () => {};
  W.FarmhandDispensary = { hard: () => ({ on: false }), keyholders: () => [700] };
  const LIB = "=== induction: In\npace: 1s\n\nHear my voice, {name}.\nSink.\n\n=== wake: Up\npace: 1s\n\nUp you come.\n\n=== session: For Visors\nvisor: yes\nlevel: deep\ninduction: any\nwake: any\n";
  W.fetch = async (u) => (/library\.txt$/.test(u) ? { ok: true, text: async () => LIB } : { ok: false });
  const esbuild = require('esbuild'), entry = path.join(os.tmpdir(), 'fh-vroom-entry-' + process.pid + '.js'), tmp = path.join(os.tmpdir(), 'fh-vroom-' + process.pid + '.cjs');
  const src = (f) => JSON.stringify(path.join(__dirname, '../extension/src/', f).replace(/\\/g, '/'));
  fs.writeFileSync(entry, 'export * from ' + src('trance.js') + ';\nexport * as Vis from ' + src('visor.js') + ';\nexport * as Hide from ' + src('hidehyp.js') + ';\n');
  await esbuild.build({ entryPoints: [entry], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent', define: { __FARMHAND_VERSION__: '"0.89.0"' } });
  const Tr = require(tmp), Vis = Tr.Vis, S = Vis.visorState;
  const prefs = {}, hooks = {};
  const c = { toBot: () => {}, toChat: (t) => chats.push(t), prefs: () => prefs, botHere: () => false, mod: { hookFunction: (name, pri, fn) => { hooks[name] = fn; } } };
  Tr.initTrance(Object.assign({}, c, { arouse: () => {}, lead: () => {} }));
  Vis.initVisor(c);
  await Vis.publicList(true);
  const el = () => W.document.getElementById('fhc-visor'), peek = () => W.document.getElementById('fhc-peek');
  const said = (re) => chats.some((x) => re.test(x));
  const room = (type) => sent.filter(([e, d]) => e === 'ChatRoomChat' && d.Type === 'Hidden' && d.Dictionary && d.Dictionary.type === type).map(([, d]) => Object.assign({ to: d.Target }, d.Dictionary));
  const msg = (type, from, data) => Vis.onVisorMsg(Object.assign({ type, from }, data || {}));
  const wear = (t) => { const code = V.tuningCode(t); W.Player.Appearance = [{ Asset: { Name: 'HypnoticVisor' }, Craft: { Name: 'Glow Visor', Description: V.descLine(code, t), MemberNumber: 221397 } }]; Vis.check(); msg('visorTune', 221397, { code, t }); return code; };
  const takeOff = () => { W.Player.Appearance = []; Vis.check(); };

  // ── the afterimage: the crafter's pick, and the wearer's own switch ──
  wear({ sessions: ['For Visors'], need: 0, words: ['good cow'] }); takeOff();
  ok(!S.after && !W.document.getElementById('fhc-visor-after'), 'a visor whose crafter didn\'t pick the afterimage leaves none');
  wear({ sessions: ['For Visors'], need: 0, words: ['good cow'], fx: ['after'] }); takeOff();
  ok(S.after && W.document.getElementById('fhc-visor-after'), 'one that did, does');
  prefs.noAfter = true; Vis.check();
  ok(!S.after && !W.document.getElementById('fhc-visor-after'), '"Visor afterimages" switched off: the one showin\' goes');
  wear({ sessions: ['For Visors'], need: 0, words: ['good cow'], fx: ['after'] }); takeOff();
  ok(!S.after, '...and none come');
  prefs.noAfter = false;

  // ── seen from outside: what a wearer's Companion tells the room ──
  sent.length = 0;
  const code = wear({ sessions: ['For Visors'], need: 0, words: ['good cow'], feed: 'keys' });
  Vis.check();
  const st = room('visorState').pop();
  ok(st && st.on === 1 && st.code === code && st.crafter === 221397 && st.feed === 'keys' && !st.to, 'on: the room\'s told (its code, how deep, who may feed it)');
  sent.length = 0; S.emoteAt = 1; Vis.check();
  const em = sent.find(([e, d]) => e === 'ChatRoomChat' && d.Type === 'Emote');
  ok(em && /^\*.*Moo/.test(em[1].Content) && !/\(/.test(em[1].Content), 'now and then a line about them, as their own emote: ' + (em && em[1].Content));
  prefs.noVisorEmotes = true; sent.length = 0; S.emoteAt = 1; Vis.check();
  ok(!sent.some(([e, d]) => d.Type === 'Emote'), '..."Visor lines in the room" switched off: none');
  prefs.noVisorEmotes = false;

  // ── the wearer's side of a peek, and feedin' ──
  chats.length = 0; msg('visorPeek', 700, { on: 1 });
  ok(said(/Keeper is lookin' in through your visor/), 'somebody peeks in: they\'re told who');
  sent.length = 0; S.picNow = 'https://x.example/p.gif'; S.lineNow = 'Hear my voice, Moo.'; S.wordNow = 'good cow'; S.wordAt = Date.now(); Vis.check();
  const vw = room('visorView').pop();
  ok(vw && vw.to === 700 && vw.pic === 'https://x.example/p.gif' && vw.l === 'Hear my voice, Moo.' && vw.w === 'good cow', '...and what they\'re seein\' goes to the peeker only');
  sent.length = 0; Vis.check();
  ok(!room('visorView').length, '...not again till somethin\'s changed (at most every 4 s)');
  msg('visorFeed', 999, { w: 'obey' });
  ok(room('visorFed').some((m) => m.to === 999 && !m.ok && /doesn't take words from you/.test(m.why)), 'a stranger can\'t feed it a word (the crafter said keyholders only)');
  msg('visorFeed', 700, { w: 'good <b>girl</b> (x)' });
  ok(room('visorFed').some((m) => m.to === 700 && m.ok) && S.given.join() === 'good bgirlb x', 'a keyholder feeds one: it\'s the next word in their dark (cleaned of anything but words)');
  msg('visorFeed', 700, { w: 'again' });
  ok(room('visorFed').some((m) => m.to === 700 && !m.ok && /30 seconds/.test(m.why)), '...one every 30 seconds');
  msg('visorPeek', 999, { on: 1 }); msg('visorPeek', 300, { on: 1 }); msg('visorPeek', 221397, { on: 1 });
  ok(Object.keys(S.peekers).length === 3, 'three peekers at a time');
  takeOff(); Vis.check();
  ok(room('visorState').some((m) => m.on === 0), 'off: the room\'s told');

  // ── seen from outside: somebody else under a visor, on this screen ──
  msg('visorState', 999, { on: 1, code: 'abcd1234', crafter: 221397, d: 40, feed: 'all' });
  const tintCss = (W.document.getElementById('fhc-visor-room') || {}).textContent || '';
  ok(/data-sender="999"/.test(tintCss), 'their lines tinted pink in the chat');
  mainLog.length = 0;
  hooks.DrawCharacter([stranger, 100, 0, 0.5], () => {});
  ok(mainLog.some(([k]) => k === 'ellipse') && mainLog.some(([k, a]) => k === 'fillText' && a === '🌀 40') && mainLog.some(([k, a]) => k === 'fillText' && a === '👁'), 'drawn over them: a glow over the eyes, how deep, and the 👁');
  mainLog.length = 0; hooks.DrawCharacter([keeper, 100, 0, 0.5], () => {});
  ok(!mainLog.length, '...nobody else gets one');
  let passed = 0;
  hooks.ChatRoomCharacterViewClickCharacter([stranger, 100, 0, 0.5, 250, 600], () => { passed++; });
  ok(passed === 1 && !peek(), 'a click anywhere else on them: the game\'s own click');
  sent.length = 0; hooks.ChatRoomCharacterViewClickCharacter([stranger, 100, 0, 0.5, 402, 66], () => { passed++; });
  ok(passed === 1 && peek() && room('visorPeek').some((m) => m.to === 999 && m.on === 1) && /Inside Stranger's visor/.test(peek().textContent), 'a click on the 👁: a little window into their visor (and they\'re asked, them only)');
  msg('visorTune', 221397, { code: 'abcd1234', t: {} });   // (not its code: never kept)
  ok(!S.cache.abcd1234, '(a tuning that doesn\'t match its code is never taken)');
  msg('visorView', 999, { pic: 'https://x.example/q.webm', w: 'empty', l: 'Deeper now.', d: 60 });
  const pv = peek().querySelector('video.pic');
  ok(pv && pv.getAttribute('src') === 'https://x.example/q.webm' && pv.muted && /Deeper now\./.test(peek().textContent) && /🌀 60/.test(peek().textContent) && peek().querySelector('.w'), '...showin\' what they see right now: the picture (a silent video here), the word, the line, how deep');
  msg('visorView', 999, { pic: 'javascript:alert(1)' });
  ok(peek().querySelector('video.pic'), '...never anythin\' that isn\'t a picture\'s own address');
  const fin = peek().querySelector('.fd input');
  ok(fin && /Anybody can feed it/.test(peek().textContent), 'the crafter lets anybody feed it: a box to feed a word');
  fin.value = 'sleepy'; peek().querySelector('.fd button').click();
  ok(room('visorFeed').some((m) => m.to === 999 && m.w === 'sleepy'), '...sent to them');
  msg('visorFed', 999, { ok: 1 });
  ok(/Your word went into their dark/.test(peek().textContent), '...and it took');
  msg('visorState', 999, { on: 0 });
  ok(!peek() && said(/Stranger's visor is off now/) && !((W.document.getElementById('fhc-visor-room') || {}).textContent || '').includes('999'), 'their visor goes off: the window closes, the tint goes');
  // (Nov 26, Laynie: "i dont see the button for peeking": the farm's rooms are map rooms)
  msg('visorState', 999, { on: 1, code: 'abcd1234', crafter: 221397, d: 20 });
  mainLog.length = 0; const Zmap = 0.13;   // (a character on the map, as the game draws them: small)
  hooks.DrawCharacter([stranger, 400, 300, Zmap], () => {});
  const eye = S.eyes[999];
  ok(eye && mainLog.some(([k, a]) => k === 'fillText' && a === '👁') && eye.r >= 14, 'on the map too: the glow, how deep, and a 👁 big enough to click');
  W.CurrentCharacter = stranger; mainLog.length = 0; hooks.DrawCharacter([stranger, 400, 300, Zmap], () => {}); W.CurrentCharacter = null;
  ok(!mainLog.length, '...not while somebody\'s dialog is open');
  let mapPassed = 0; W.MouseX = eye.x + 100; W.MouseY = eye.y;
  hooks.ChatRoomMapViewClick([], () => { mapPassed++; });
  ok(mapPassed === 1 && !peek(), 'a click elsewhere on the map: the game\'s own click');
  W.MouseX = eye.x + 3; W.MouseY = eye.y - 2;
  hooks.ChatRoomMapViewClick([], () => { mapPassed++; });
  ok(mapPassed === 1 && peek() && /Inside Stranger's visor/.test(peek().textContent), 'a click on the map\'s 👁: the window into their visor');
  Vis.closePeek();
  cmds.find((x) => x.Tag === 'visor').Action('peek Stranger');
  ok(peek(), '/visor peek <name> opens it too');
  Vis.closePeek(); chats.length = 0;
  cmds.find((x) => x.Tag === 'visor').Action('peek Keeper');
  ok(!peek() && said(/Keeper isn't under a farm visor/), '...and says so when they aren\'t under one');
  msg('visorState', 999, { on: 0 });

  // ── herd trance ──
  const T = { sessions: ['For Visors'], need: 0, words: ['good cow'] }, hc = V.tuningCode(T);
  msg('visorState', 300, { on: 1, code: hc, crafter: 221397, d: 0 });
  chats.length = 0; wear(T);
  await wait(5500);
  ok(!S.run && !chats.some((x) => /^\[Voice\]/.test(x)), 'Daisy (a lower number) wears the same visor: she leads, so no session of their own');
  drawn.length = 0; await wait(200);
  ok(drawn.some((d) => d.on === 'body' && d.src === W.Player.Canvas) && drawn.some((d) => d.on === 'body' && d.src === low.Canvas), 'both bodies, side by side in their dark');
  msg('visorHerd', 700, { code: hc, i: 0, n: 2, level: 'deep', name: 'For Visors', s: { text: 'Not the leader.' } });
  ok(!chats.some((x) => /Not the leader/.test(x)), 'lines from somebody who isn\'t the herd\'s leader: ignored');
  msg('visorHerd', 300, { code: hc, i: 0, n: 2, level: 'deep', name: 'For Visors', hl: 1, ms: 600000, s: { text: 'Hear my voice, {name}.', gap: 1, look: { haze: 9999, evil: 'x' }, beats: { to: 99 } } });
  ok(Tr.tranceState.session && chats.some((x) => /^\[Voice\] Look at you all, standin' together/.test(x)) && chats.includes('[Voice] Hear my voice, Moo.'), 'Daisy\'s lines: under, the herd\'s welcome, and the line in their own name');
  msg('visorHerd', 300, { code: hc, i: 1, n: 2, level: 'deep', name: 'For Visors', s: { text: 'Up you come.', gap: 1 } });
  await wait(1300);
  ok(S.done[hc] === 1 && said(/Session over: For Visors/), '...the herd\'s session done: counted for them too');
  takeOff(); msg('visorState', 300, { on: 0 });
  ok(!Tr.tranceState.session, "taken off just after the session ended: the trance the visor started is woken, not left hangin'");
  // leadin' one: a higher number in the same visor follows them
  msg('visorState', 700, { on: 1, code: hc, crafter: 221397, d: 0 });
  sent.length = 0; wear(T); await wait(5600);
  const hs = room('visorHerd');
  ok(S.run && !S.run.follow && hs.length && hs[0].code === hc && hs[0].i === 0 && !hs[0].to && hs[0].s && typeof hs[0].s.text === 'string', 'Keeper (a higher number) wears it too: they lead, and their lines go to the room for the herd');
  takeOff(); msg('visorState', 700, { on: 0 });

  // ── the crafter looms ──
  wear({ sessions: ['For Visors'], need: 0, words: ['good cow'], show: 'loom' });
  drawn.length = 0; await wait(250);
  const bodies = drawn.filter((d) => d.on === 'body').map((d) => d.src);
  ok(bodies.includes(crafter.Canvas) && bodies.includes(W.Player.Canvas) && bodies.lastIndexOf(W.Player.Canvas) > bodies.indexOf(crafter.Canvas), 'the crafter towerin\', them small at the crafter\'s feet (drawn in front)');
  ok(S.likes[221397] && /^data:image\/webp/.test(S.likes[221397].data) && W.localStorage.getItem('fhc-visor-likeness@500'), 'a small likeness of the crafter kept (on this computer only)');
  W.ChatRoomCharacter = [W.Player, keeper, stranger, low];
  await wait(150); drawn.length = 0; await wait(250);
  ok(drawn.some((d) => d.on === 'body' && d.src && d.src.tagName === 'IMG'), 'the crafter leaves the room: their likeness stands in');
  W.ChatRoomCharacter = [W.Player, crafter, keeper, stranger, low];
  takeOff();
  wear({ sessions: ['For Visors'], need: 0, words: ['good cow'], show: 'eyes' });
  drawn.length = 0; await wait(250);
  ok(el().querySelector('canvas.eyes') && drawn.some((d) => d.on === 'eyes' && d.src === crafter.Canvas) && drawn.some((d) => d.on === 'body' && d.src === W.Player.Canvas), 'their own body, with the crafter\'s face in the middle of the spiral, watchin\'');
  takeOff();

  // ── the maker: the new choices ──
  const cards = Vis.visorMakerCards({ setUi: () => {} }); W.document.body.appendChild(cards[0]);
  const showSel = [...cards[0].querySelectorAll('select')].find((s) => [...s.options].some((o) => o.value === 'loom'));
  const feedSel = [...cards[0].querySelectorAll('select')].find((s) => [...s.options].some((o) => o.value === 'keys'));
  showSel.value = 'eyes'; showSel.dispatchEvent(new W.Event('change')); feedSel.value = 'all'; feedSel.dispatchEvent(new W.Event('change'));
  const after = [...cards[0].querySelectorAll('label')].find((l) => /an afterimage at the edges/.test(l.textContent)).querySelector('input'); after.click();
  [...cards[0].querySelectorAll('button')].find((b) => /Make the visor/.test(b.textContent)).click();
  const made = Object.values(S.cache).pop();
  ok(made && made.show === 'eyes' && made.feed === 'all' && made.fx.includes('after'), 'the Visor maker: whose body (the crafter\'s face watchin\'), who may feed it, and the afterimage, all locked into the code');

  // ── Sera's suggestion (Nov 26): "The hypno effects should hide when an accounts profile page, or preference windows are open." ──
  const Hide = Tr.Hide, html = W.document.documentElement;
  Hide.initHide(c.mod);
  wear({ sessions: ['For Visors'], need: 0, words: ['good cow'] });
  ok(el() && !html.classList.contains('fhc-offroom'), '(in the room, the visor\'s dark is up)');
  W.CurrentScreen = 'InformationSheet'; Hide.hideTick();
  const hideCss = (W.document.getElementById('fhc-hide-css') || {}).textContent || '';
  ok(html.classList.contains('fhc-offroom') && ['fhc-visor', 'fhc-visor-after', 'fhc-visor-wm', 'fhc-visor-on', 'fhc-peek', 'fhc-hyp', 'fhc-nudge', 'fhc-trance'].every((i) => hideCss.includes('#' + i)), 'somebody\'s profile open: the visor, the afterimage, the 🌀, the peek window and the trance\'s own look all step aside');
  W.CurrentScreen = 'ChatRoom'; Hide.hideTick();
  ok(!html.classList.contains('fhc-offroom') && el(), 'back in the room: all of it comes back (the visor never came off)');
  await hooks.CommonSetScreen(['Character', 'Preference'], () => { W.CurrentScreen = 'Preference'; return Promise.resolve(); });
  ok(html.classList.contains('fhc-offroom'), 'the preferences opened: hidden the moment the screen changes, not a beat later');
  W.CurrentScreen = 'ChatRoom'; Hide.hideTick(); takeOff();
  Vis.stop(true);
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
