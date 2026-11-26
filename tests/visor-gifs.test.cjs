// MOVIN' PICTURES IN THE VISOR (Nov 26). Laynie: "is there a way to make animated gifs work for the visor?", then "all four":
// silent video links play like movin' pictures, a link fixer for GIF sites' page links, a kaleidoscope that keeps GIFs
// movin', and "Test my links" in the Visor maker.
const path = require('path'), os = require('os'), fs = require('fs'), { pathToFileURL } = require('url');
const { JSDOM } = require('jsdom');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const V = await import(pathToFileURL(path.join(__dirname, '../shared/visor.js')).href);
  // ── the link fixer ──
  const fx = (u) => V.fixLink(u);
  ok(fx('https://giphy.com/gifs/cow-spin-dance-3o7TKSjRrfIPjeiVyM').url === 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' && fx('https://giphy.com/embed/xT9IgG50Fb7Mi0prBC').url === 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
    'a Giphy page (or embed) link: made into its GIF');
  ok(fx('https://i.imgur.com/AbC123x.gifv').url === 'https://i.imgur.com/AbC123x.mp4' && V.isVideo(fx('https://i.imgur.com/AbC123x.gifv').url), 'Imgur\'s .gifv: made into its video');
  ok(fx('https://www.google.com/imgres?imgurl=https%3A%2F%2Fx.example%2Fspin.gif&imgrefurl=https%3A%2F%2Fx.example%2F').url === 'https://x.example/spin.gif', 'a Google image-result link: made into the picture\'s own address');
  ok(!fx('https://tenor.com/view/cow-moo-gif-123456').url && /media\.tenor\.com/.test(fx('https://tenor.com/view/cow-moo-gif-123456').note) && !fx('https://www.redgifs.com/watch/somethingslow').url && /Copy video address/.test(fx('https://www.redgifs.com/watch/somethingslow').note),
    'Tenor and RedGIFs pages can\'t be worked out: told plainly what to copy instead');
  ok(!fx('https://imgur.com/a/xyz').url && !fx('https://www.reddit.com/r/x/comments/1').url && !fx('https://v.redd.it/abc').url && !fx('https://x.example/page.html').url, '...nor albums, Reddit pages or web pages');
  ok(fx('http://x.example/a.gif').url === 'https://x.example/a.gif' && fx('https://media.tenor.com/abc/cow.gif').url === 'https://media.tenor.com/abc/cow.gif' && !fx('https://media.tenor.com/abc/cow.gif').note, 'a picture\'s own address stays as it is (http made https)');
  ok(/still picture/.test(fx('https://encrypted-tbn0.gstatic.com/images?q=tbn:x').note) && /stop working/.test(fx('https://cdn.discordapp.com/attachments/1/2/a.gif?ex=1').note), 'Google thumbnails and Discord links: kept, with a word of warnin\'');
  ok(V.okLink('https://x.example/loop.webm') && V.isVideo('https://x.example/loop.mp4?x=1') && !V.isVideo('https://x.example/a.gif'), 'silent videos count as a visor\'s pictures (.mp4, .webm)');
  // ── does a picture move: its own bytes say ──
  const B = (s, extra) => Uint8Array.from([...Buffer.from(s, 'latin1'), ...(extra || [])]);
  const gce = [0x21, 0xf9, 0x04, 0, 0, 0, 0, 0];
  ok(V.framesOf(B('GIF89a', [...gce, 1, 2, ...gce])) === true && V.framesOf(B('GIF89a', gce)) === false, 'a GIF with more than one frame moves; with one, it\'s still');
  ok(V.framesOf(B('RIFF\0\0\0\0WEBPVP8XxxxxANIM')) === true && V.framesOf(B('RIFF\0\0\0\0WEBPVP8 ')) === false && V.framesOf(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10, ...Buffer.from('xxxxacTL')])) === true &&
    V.framesOf(Uint8Array.from([0xff, 0xd8, 0xff])) === false && V.framesOf(B('<html>')) === null, '...animated WebP and PNG move; a JPEG never; somethin\' else: can\'t tell');

  // ── a game page ──
  const page = new JSDOM('<!doctype html><html><head></head><body><canvas id="MainCanvas" width="2000" height="1000"></canvas><div id="TextAreaChatLog"></div></body></html>', { url: 'https://www.bondageprojects.elementfx.com/R134/BondageClub/' });
  const W = page.window; global.window = W; global.document = W.document;
  W.HTMLCanvasElement.prototype.getContext = function () { const cv = this; return new Proxy({}, { get: (o, k) => (k === 'canvas' ? cv : k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true }); };
  // (stand-ins for the browser loadin' pictures and videos: a link with "missing" in it never loads)
  const played = [], letGo = [];
  Object.defineProperty(W.HTMLImageElement.prototype, 'src', { configurable: true, get() { return this.getAttribute('src') || ''; },
    set(v) { this.setAttribute('src', v); setTimeout(() => this.dispatchEvent(new W.Event(/missing/.test(v) ? 'error' : 'load')), 5); } });
  Object.defineProperty(W.HTMLMediaElement.prototype, 'src', { configurable: true, get() { return this.getAttribute('src') || ''; },
    set(v) { this.setAttribute('src', v); setTimeout(() => { if (/missing/.test(v)) { this.dispatchEvent(new W.Event('error')); return; } this.dispatchEvent(new W.Event('loadedmetadata')); this.dispatchEvent(new W.Event('loadeddata')); }, 5); } });
  W.HTMLMediaElement.prototype.play = function () { played.push(this.getAttribute('src')); return Promise.resolve(); };
  W.HTMLMediaElement.prototype.pause = function () {};
  W.HTMLMediaElement.prototype.load = function () { if (!this.getAttribute('src')) letGo.push(this); };
  const gifBytes = B('GIF89a', [...gce, 1, ...gce]), stillBytes = B('GIF89a', gce), jpg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]);
  W.fetch = async (u) => {
    if (/library\.txt$/.test(u)) return { ok: true, text: async () => "=== induction: In\npace: 1s\n\nHear my voice.\n\n=== wake: Up\npace: 1s\n\nUp.\n\n=== session: For Visors\nvisor: yes\nlevel: fun\ninduction: any\nwake: any\n" };
    if (/nocors/.test(u)) throw new TypeError('Failed to fetch');
    if (/anim\.gif/.test(u)) return { ok: true, arrayBuffer: async () => gifBytes.buffer };
    if (/still\.gif/.test(u)) return { ok: true, arrayBuffer: async () => stillBytes.buffer };
    if (/\.jpg/.test(u)) return { ok: true, arrayBuffer: async () => jpg.buffer };
    return { ok: false };
  };
  const chats = [];
  W.Player = { MemberNumber: 500, Name: 'Moo', Appearance: [], ActivePose: [], ArousalSettings: { Progress: 10 }, IsPlayer: () => true, Canvas: { width: 500, height: 1850 } };
  W.ChatRoomCharacter = [W.Player, { MemberNumber: 221397, Name: 'Laynie', Canvas: { width: 500, height: 1850 } }];
  W.ChatRoomData = { Name: 'Barn' };
  W.ServerSend = () => {}; W.ServerPlayerIsInChatRoom = () => true; W.ChatRoomRegisterMessageHandler = () => {};
  const esbuild = require('esbuild'), entry = path.join(os.tmpdir(), 'fh-vgifs-entry-' + process.pid + '.js'), tmp = path.join(os.tmpdir(), 'fh-vgifs-' + process.pid + '.cjs');
  const src = (f) => JSON.stringify(path.join(__dirname, '../extension/src/', f).replace(/\\/g, '/'));
  fs.writeFileSync(entry, 'export * from ' + src('trance.js') + ';\nexport * as Vis from ' + src('visor.js') + ';\n');
  await esbuild.build({ entryPoints: [entry], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent', define: { __FARMHAND_VERSION__: '"0.88.0"' } });
  const Tr = require(tmp), Vis = Tr.Vis, S = Vis.visorState;
  const c = { toBot: () => {}, toChat: (t) => chats.push(t), prefs: () => ({}), botHere: () => false, mod: { hookFunction: () => {} } };
  Tr.initTrance(Object.assign({}, c, { arouse: () => {}, lead: () => {} }));
  Vis.initVisor(c);
  await Vis.publicList(true);
  const el = () => W.document.getElementById('fhc-visor');
  const wear = (t) => { const code = V.tuningCode(t); W.Player.Appearance = [{ Asset: { Name: 'HypnoticVisor' }, Craft: { Name: 'Loop Visor', Description: V.descLine(code, t), MemberNumber: 221397 } }]; Vis.check(); Vis.onVisorMsg({ type: 'visorTune', from: 221397, code, t }); return code; };
  const takeOff = () => { W.Player.Appearance = []; Vis.check(); };

  // ── a silent video plays like a movin' picture ──
  wear({ sessions: ['For Visors'], need: 0, pictures: ['https://x.example/loop.mp4', 'https://x.example/anim.gif'], picEvery: 8, picOp: 0.5 });
  await wait(60);
  const v = el().querySelector('video.pic');
  ok(v && v.muted && v.loop && v.hasAttribute('muted') && v.hasAttribute('playsinline') && !v.controls && played.includes('https://x.example/loop.mp4'), 'a video link: a silent, loopin\' video in the picture\'s place, playin\' (never a sound, no controls)');
  ok(v.style.opacity === '0.5' && el().querySelectorAll('.pic').length === 2, '...shown see-through like any picture, once it\'s loaded');
  await wait(8200);
  const g = el().querySelector('img.pic[src="https://x.example/anim.gif"]');
  ok(g && g.style.opacity === '0.5' && v.style.opacity === '0', 'the next one (a GIF) fades in over it');
  await wait(5800);
  ok(letGo.includes(v), '...and the video, faded out, is stopped and let go of (so it isn\'t held in memory)');
  takeOff();

  // ── the kaleidoscope keeps a GIF movin' ──
  wear({ sessions: ['For Visors'], need: 0, pictures: ['https://x.example/anim.gif', 'https://x.example/loop.webm'], picEvery: 8, picOp: 0.4, fx: ['kalei'] });
  await wait(60);
  const kc = el().querySelector('.kaleiC'), wedges = kc && kc.querySelectorAll('.wedge img');
  ok(kc && wedges.length === 6 && [...wedges].every((w) => w.getAttribute('src') === 'https://x.example/anim.gif') && kc.style.opacity === '0.4', 'the kaleidoscope: six folded copies of the GIF itself, so it keeps movin\' in every one');
  ok([...kc.querySelectorAll('.wedge')].map((w) => w.style.transform).join('|') === 'rotate(0deg)|rotate(60deg) scaleY(-1)|rotate(120deg)|rotate(180deg) scaleY(-1)|rotate(240deg)|rotate(300deg) scaleY(-1)', '...each turned a sixth, every other one mirrored');
  ok(el().querySelector('img.pic').style.visibility === 'hidden' && /px$/.test(el().style.getPropertyValue('--R')), '...with the plain picture under it hidden, and the folds reachin\' the corners');
  await wait(8200);
  ok(kc.style.opacity === '0' && S.kv && S.kv.tagName === 'VIDEO', 'a video in the kaleidoscope: drawn from its frames instead (six videos at once would be too heavy)');
  takeOff();

  // ── the Visor maker: the fixer, and "Test my links" ──
  const cards = Vis.visorMakerCards({ setUi: () => {} }); W.document.body.appendChild(cards[0]);
  const sel = [...cards[0].querySelectorAll('select')].find((s) => [...s.options].some((o) => o.value === '__own'));
  sel.value = '__own'; sel.dispatchEvent(new W.Event('change'));
  const box = cards[0].querySelector('textarea');
  box.value = ['https://giphy.com/gifs/cow-3o7TKSjRrfIPjeiVyM', 'https://i.imgur.com/AbC123x.gifv', 'https://tenor.com/view/cow-moo-gif-1', 'https://x.example/still.gif'].join('\n'); box.dispatchEvent(new W.Event('change'));
  [...cards[0].querySelectorAll('button')].find((b) => /Make the visor/.test(b.textContent)).click();
  const made = Object.values(S.cache).pop();
  ok(made && made.pictures.join() === 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif,https://i.imgur.com/AbC123x.mp4,https://x.example/still.gif', 'Make the visor: the Giphy page and Imgur .gifv fixed into their own addresses, the Tenor page left out');
  ok(/3 of your links in it \(1 of them silent videos\); 2 fixed \(a Giphy page, made into its GIF, and more\); 1 left out/.test(cards[0].textContent) && /✘ https:\/\/tenor\.com\/view\/cow-moo-gif-1: a Tenor page/.test(cards[0].textContent),
    '...and it says what it fixed and what it left out, and why');
  ok(box.value.split('\n')[0] === 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', '...their own list is fixed for them too');
  const sp = (r) => r.map((x) => x.icon + ' ' + x.text).join(' | ');
  const res = await Vis.testLinks(['https://x.example/anim.gif', 'https://x.example/still.gif', 'https://x.example/photo.jpg', 'https://x.example/loop.mp4', 'https://x.example/missing.png', 'https://x.example/nocors.gif', 'https://tenor.com/view/x-1'].join('\n'), W.document.createElement('div'));
  ok(res[0].moves === true && res[1].moves === false && res[2].moves === false && res[3].moves === true && /silent video/.test(res[3].text) && !res[4].ok && res[5].ok && /a \.gif usually does/.test(res[5].text) && res[6].ok === false,
    'Test my links: a movin\' GIF, a still GIF, a photo, a video, one that won\'t load, one whose site won\'t say, a page: ' + sp(res.slice(0, 6)));
  const tb = [...cards[0].querySelectorAll('button')].find((b) => /Test my links/.test(b.textContent));
  tb.click(); await wait(200);
  ok(/✔ https:\/\/media\.giphy\.com\/media\/3o7TKSjRrfIPjeiVyM\/giphy\.gif: /.test(cards[0].textContent) && /▫ https:\/\/x\.example\/still\.gif: a still picture/.test(cards[0].textContent), 'the button in the Visor maker: each of their links, and what it does');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
