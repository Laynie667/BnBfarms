// LIVE INK (shared/ink/live.js, Nov 17, step 2 of "build it all"): the 29 designs that print the wearer's own (the womb mark, Nov 19, the 29th). Each is an
// item in the ink slots, drawn on the spot from what's written on it (Property.FarmInk): a count from the farm's books,
// their number, a name, their own words. /ink writes on it; the Companion hands over the farm's counts; days without
// cummin' is counted on the wearer's own game. No canvas in node, so a pretend one records the words drawn.
const fs = require('fs'), path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-inklive-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/ink/ink.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const INK = require(tmp); fs.unlinkSync(tmp);
  const LIST = JSON.parse(fs.readFileSync(path.join(__dirname, '../shared/ink/ink-designs.json'), 'utf8'));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // a pretend canvas: it remembers the words drawn on it (and on anything drawn onto it), and its "picture" is them
  let lastWords = [];
  function fakeCanvas() {
    const c = { width: 300, height: 150, words: [] }, store = {};
    const ctx = new Proxy(store, {
      get(t, k) {
        if (k === 'canvas') return c;
        if (k === 'measureText') return (s) => ({ width: String(s).length * 10 });
        // (pixels pass words along: what's read off one canvas and put on another carries them)
        if (k === 'getImageData') return (x, y, w, h) => { lastWords = c.words.slice(); return { data: new Uint8ClampedArray(Math.max(4, w * h * 4)) }; };
        if (k === 'createImageData') return (w, h) => ({ data: new Uint8ClampedArray(Math.max(4, w * h * 4)) });
        if (k === 'putImageData') return () => { c.words.push(...lastWords); };
        if (k === 'fillText' || k === 'strokeText') return (s) => { c.words.push(String(s)); };
        if (k === 'drawImage') return (src) => { if (src && src.words) c.words.push(...src.words); };
        if (k in t) return t[k];
        return () => ctx;
      },
      set(t, k, v) { t[k] = v; return true; },
    });
    c.getContext = () => ctx;
    c.toDataURL = () => 'data:image/png;fake,' + encodeURIComponent(c.words.join('|'));
    return c;
  }
  const local = {};
  const W = { AssetGroupMap: new Map(), AssetGroup: [], AssetFemale3DCGExtended: {}, localStorage: { getItem: (k) => (k in local ? local[k] : null), setItem: (k, v) => { local[k] = String(v); } },
    document: { createElement: (t) => (t === 'canvas' ? fakeCanvas() : { style: {}, set textContent(v) { this._t = v; }, get outerHTML() { return this._t; } }) } };
  for (let i = 0; i < 40; i++) { const g = { Name: 'G' + i, Asset: [] }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); }
  W.AssetGroupAdd = (fam, def) => { const g = { Family: fam, Name: def.Group, Description: def.Group, Asset: [], def }; W.AssetGroupMap.set(g.Name, g); W.AssetGroup.push(g); return g; };
  W.AssetAdd = (G, def) => { const a = { Name: def.Name, Description: def.Name, Group: G, Layer: def.Layer, Left: def.Left, Top: def.Top }; G.Asset.push(a); return a; };
  W.AssetBaseURL = (C, group, groupName) => 'Assets/Female3DCG/' + groupName + '/';
  W.AssetGetPreviewPath = (A) => 'Assets/Female3DCG/' + A.Group.Name + '/Preview';
  W.AssetBuildDescription = () => {}; W.AssetLoadAll = () => {};
  // the game's drawing, pretend: every item's first layer, by its address, the way the game asks for it
  W.CommonDrawAppearanceBuild = (C, cb) => {
    for (const it of C.Appearance) {
      const A = W.AssetGroupMap.get(it.Asset.Group.Name).Asset.find((a) => a.Name === it.Asset.Name), L = A.Layer[0];
      cb.drawImageColorize(W.AssetBaseURL(C, A.Group, A.Group.Name, '', L, '', A) + A.Name + '_' + L.Name + '.png', 0, 0, { ScaleX: 1 });
    }
  };
  W.ActivityOrgasmStart = () => {};
  // the game's "naked": everything worn as body cosplay comes off (our ink with it, before Nov 18)
  W.CharacterAppearanceNaked = (C) => { C.Appearance = C.Appearance.filter((it) => !/^(Farm|Cloth)/.test(it.Asset.Group.Name)); };
  W.CharacterAppearanceStripLayer = (C) => { C.Appearance = C.Appearance.filter((it) => !/^Farm/.test(it.Asset.Group.Name)); };
  W.CharacterLoadCanvas = () => {};
  const cmds = [], said = [], updates = []; let refreshed = 0;
  W.CommandCombine = (l) => cmds.push(...l);
  W.ChatRoomSendLocal = (h) => said.push(String(h));
  W.ChatRoomCharacterItemUpdate = (C, g) => updates.push(g);
  W.CharacterRefresh = () => { refreshed++; };
  const mod = { hookFunction(fn, pri, h) { const orig = W[fn]; W[fn] = function (...args) { return h(args, (a) => orig.apply(this, a)); }; } };
  const st = INK.registerInk(W, mod);
  await wait(150);
  const draw = (C) => { const got = []; W.CommonDrawAppearanceBuild(C, { drawImageColorize: (s, x, y, o) => got.push({ src: s, o, words: decodeURIComponent(String(s).split('fake,')[1] || '') }) }); return got; };

  // the list: the live ones are items now, measured and previewed like the rest
  const live = LIST.groups.FarmInk.filter((a) => a.live);
  ok(live.length === 29 && st.live === 29, 'all 29 live designs are in the ink slots, the womb mark too (' + live.length + ')');
  ok(W.AssetGroupMap.get('FarmInk3').Asset.some((a) => a.Name === 'LiveTimesBred') && W.AssetGroupMap.get('FarmInk3').Asset.length === LIST.groups.FarmInk.length, '...in every ink slot, with the rest');
  ok(live.every((a) => fs.existsSync(path.join(__dirname, '../ink/v2/FarmInk/Preview', a.name + '.png'))), '...each with its wardrobe preview');
  ok(live.every((a) => Array.isArray(a.box) && a.s > 0 && a.w > 0 && a.h > 0), '...each measured: where it sits and how big');
  ok(!/221397|232922|Alexia|Laynie/.test(JSON.stringify(LIST)), 'no name or member number in the list: the samples are made up');

  // where its picture comes from: an address of our own
  const G2 = W.AssetGroupMap.get('FarmInk2');
  const base = W.AssetBaseURL({}, G2, 'FarmInk2', '', {}, '', G2.Asset.find((a) => a.Name === 'LiveTimesBred'));
  ok(/\/ink\/v2\/live\/FarmInk2\/$/.test(base), 'a live design has its own address, with the slot in it (' + base + ')');
  ok(W.AssetBaseURL({}, G2, 'FarmInk2', '', {}, '', G2.Asset.find((a) => a.Name === 'KnotSlave')) === INK.INK_HOST + 'FarmInk/', '...a still one comes from the repo as before');

  // drawn from what's written on it, else the wearer's own, else the sample
  const her = { MemberNumber: 4242, Ownership: { Name: 'Miss Rosa', MemberNumber: 9 }, Appearance: [
    { Asset: { Name: 'LiveTimesBred', Group: { Name: 'FarmInk2' } }, Property: { FarmInk: { n: 31 } } },
    { Asset: { Name: 'LiveStockNumber', Group: { Name: 'FarmInk3' } } },
    { Asset: { Name: 'LiveOwnedBy', Group: { Name: 'FarmInk4' } } },
    { Asset: { Name: 'KnotSlave', Group: { Name: 'FarmInk1' } } }] };
  const d1 = draw(her);
  // each design's starting size (Nov 18: k, fitted to its spot on the body)
  const kOf = (name) => (LIST.groups.FarmInk.concat(LIST.groups.FarmBrand).find((a) => a.name === name) || {}).k || 1;
  const kTB = kOf('LiveTimesBred'), kKS = kOf('KnotSlave');
  ok(d1[0].src.startsWith('data:image/png') && d1[0].words.includes('31'), 'TIMES BRED drawn with the count written on it (31)');
  ok(Math.abs(d1[0].o.ScaleX - kTB / 3) < 1e-9, '...at a third of the size it was made, times its starting size (' + kTB + ')');
  ok(LIST.groups.FarmInk.concat(LIST.groups.FarmBrand).filter((a) => a.k < 1).length > 100 && Math.max(...LIST.groups.FarmInk.map((a) => a.k || 1)) <= 1.2, 'the starting sizes are in proportion to the body: most come down, none is blown up');
  ok(/Nº 4242/.test(d1[1].words), 'STOCK NUMBER, nothin\' written: the wearer\'s own number');
  ok(/Miss Rosa/.test(d1[2].words), 'OWNED BY, nothin\' written: their owner\'s name');
  ok(/\/ink\/v2\/FarmInk\/KnotSlave_Ink\.png$/.test(d1[3].src), '...and a still design drawn from the repo, untouched');
  her.Appearance[0].Property.FarmInk.n = 32;
  ok(draw(her)[0].words.includes('32'), 'a new count, a new picture');
  her.Appearance[2].Property = { FarmInk: { t: '<b>Big\u0000Red</b>' } };
  ok(/Big ?Red/.test(draw(her)[2].words) && !/[<>]/.test(draw(her)[2].words), 'odd things written on it are cleaned off before it\'s drawn');

  // /ink: writin' on your own
  W.Player = { MemberNumber: 600, Appearance: [
    { Asset: { Name: 'LiveWordsScript', Group: { Name: 'FarmInk1' } } },
    { Asset: { Name: 'LiveTimesBred', Group: { Name: 'FarmInk2' } } },
    { Asset: { Name: 'LiveDaysDenied', Group: { Name: 'FarmInk3' } } },
    { Asset: { Name: 'KnotSlave', Group: { Name: 'FarmInk4' } } }] };
  const ink = cmds.find((c) => c.Tag === 'ink');
  ok(!!ink, '/ink is a command');
  ink.Action('1 Daddy\'s Girl');
  ok(W.Player.Appearance[0].Property.FarmInk.t === "Daddy's Girl" && updates.includes('FarmInk1') && refreshed > 0, '/ink 1 <words>: written on, and the room told');
  ink.Action('4 hello');
  ok(/doesn't take writin'/.test(said.pop()), '...a still design says it can\'t be written on');
  ink.Action('');
  ok(/Your live ink/.test(said[said.length - 1]) && /follows the farm/.test(said[said.length - 1]), '/ink alone: what your live ink says');

  // the farm's counts, from the Companion (and days without cummin', counted here: five and a half days ago)
  local['farmink-lastcum-600'] = String(Date.now() - 5.5 * 86400000);
  st.counts({ loads: 12 });
  ok(W.Player.Appearance[1].Property.FarmInk.n === 12, 'the farm\'s count goes on TIMES BRED');
  updates.length = 0; st.counts({ loads: 13 });
  ok(W.Player.Appearance[1].Property.FarmInk.n === 12 && !updates.length, '...but not more than once a minute (a minute later it catches up)');
  ink.Action('2 99');
  ok(W.Player.Appearance[1].Property.FarmInk.n === 99 && W.Player.Appearance[1].Property.FarmInk.manual === true, '/ink 2 99: your own number, and the farm stops writin\' over it');
  ink.Action('2 auto');
  ok(!W.Player.Appearance[1].Property.FarmInk.manual, '/ink 2 auto: back to the farm\'s count');

  // days without cummin', on your own game
  ok(W.Player.Appearance[2].Property.FarmInk.n === 5, 'DAYS SINCE LAST ORGASM: five and a half days, five on the sign');
  W.Player.IsPlayer = () => true; W.ActivityOrgasmRuined = true; W.ActivityOrgasmStart(W.Player);
  ok(Number(local['farmink-lastcum-600']) < Date.now() - 86400000, '...a ruined one doesn\'t reset it');
  W.ActivityOrgasmRuined = false; W.ActivityOrgasmStart(W.Player);
  ok(Date.now() - Number(local['farmink-lastcum-600']) < 5000, '...a real one does');

  // RECOLOURABLE (Nov 18): every design, every layer, takes the colour picker; a full-colour one is a layer per colour
  const allDesigns = LIST.groups.FarmInk.concat(LIST.groups.FarmBrand);
  ok(allDesigns.every((a) => a.layers.every((l) => l.colorize && /^#[0-9a-f]{6}$/.test(l.color))), 'every design is recolourable, every layer with its own colour to start');
  const mare = LIST.groups.FarmInk.find((a) => a.name === 'BredMare');
  ok(mare && mare.layers.length >= 3 && mare.layers.some((l) => l.name === 'Gold') && mare.layers[mare.layers.length - 1].name === 'Ink', 'a flash design is split by colour (Bred Mare: ' + (mare && mare.layers.map((l) => l.name).join(', ')) + ', outlines last)');
  // SIZE (Nov 18): from the panel or /ink, on the item, on top of the game's own scale
  ink.Action('2 size 150');
  ok(W.Player.Appearance[1].Property.FarmInk.sz === 1.5, '/ink 2 size 150: half again as big, written on the item');
  const pl = draw({ MemberNumber: 600, Appearance: [W.Player.Appearance[1]] })[0];
  ok(Math.abs(pl.o.ScaleX - 0.5 * kTB) < 1e-9 && Math.abs(pl.o.ScaleY - 0.5 * kTB) < 1e-9, '...drawn half again as big (' + pl.o.ScaleX.toFixed(3) + ')');
  ink.Action('2 wide 200'); ink.Action('2 tall 50');
  const p2 = draw({ MemberNumber: 600, Appearance: [W.Player.Appearance[1]] })[0];
  ok(Math.abs(p2.o.ScaleX - kTB) < 1e-9 && Math.abs(p2.o.ScaleY - 0.25 * kTB) < 1e-9, '...and width and height on their own (wide 200, tall 50)');
  ink.Action('4 size 300');
  const still = W.Player.Appearance[3];
  ok(still.Property && still.Property.FarmInk.sz === 3, 'a still design takes a size too');
  const p3 = draw({ MemberNumber: 600, Appearance: [still] })[0];
  ok(Math.abs(p3.o.ScaleX - kKS) < 1e-9 && /KnotSlave_Ink\.png$/.test(p3.src), '...three times its size, from its own picture (stored at three times, so still crisp)');
  ink.Action('4 size 900');
  ok(still.Property.FarmInk.sz === 4, '...four times at the most');
  // A TATTOO STAYS ON: the game's naked, and strip a layer
  W.Player.Appearance.push({ Asset: { Name: 'Dress', Group: { Name: 'Cloth' } } });
  W.CharacterAppearanceNaked(W.Player);
  ok(W.Player.Appearance.filter((it) => /^Farm/.test(it.Asset.Group.Name)).length === 4 && !W.Player.Appearance.some((it) => it.Asset.Group.Name === 'Cloth'), "the game's naked takes the clothes and leaves the ink on");
  W.CharacterAppearanceStripLayer(W.Player);
  ok(W.Player.Appearance.filter((it) => /^Farm/.test(it.Asset.Group.Name)).length === 4, "...and so does strippin' a layer at a time");
  // THE WOMB MARK (Nov 19, Laynie: "I love it"): litters and what she's carryin', from the farm's books, or from her
  // Dispensary's away from the farm; BABY FACTORY at twenty
  {
    const item = { Asset: { Name: 'LiveWombMark', Group: { Name: 'FarmInk1' } } }; W.Player.Appearance[0] = item;
    const wm = () => (item.Property || {}).FarmInk || {};
    const realNow = Date.now; let skew = 0; Date.now = () => realNow() + skew; const later = () => { skew += 61000; };   // (a count goes on once a minute a slot)
    later(); st.counts({ loads: 13 }); st.mine({ womb: { n: 2, c: 1 } });
    ok(wm().n === 2 && wm().c === 1, 'WOMB MARK, no farm count: her Dispensary\'s own (2 litters, carryin\' 1) ' + JSON.stringify(wm()));
    later(); st.counts({ loads: 13, womb: { n: 4, c: 3 } });
    ok(wm().n === 4 && wm().c === 3, '...the farm\'s books win when there are some (4 litters, carryin\' 3)');
    later(); st.mine({ womb: { n: 5, c: 0, away: true } });
    ok(wm().n === 5 && wm().c === 0, '...unless she\'s given birth away and the farm hasn\'t booked it yet (5, empty)');
    later(); st.counts({ loads: 13, womb: { n: 5, c: 0 } }); st.mine({ womb: { n: 5, c: 0 } });
    ok(wm().n === 5 && wm().c === 0, '...and the farm\'s again once she has');
    const words = () => draw({ MemberNumber: 600, Appearance: [item] })[0].words.replace(/\|/g, '');
    ok(!/BABY FACTORY/.test(words()), '...five litters: no BABY FACTORY yet');
    later(); st.counts({ loads: 13, womb: { n: 20, c: 6 } });
    ok(wm().n === 20 && /BABY FACTORY/.test(words()), 'twenty litters: BABY FACTORY under it');
    const m = LIST.groups.FarmInk.find((a) => a.name === 'LiveWombMark');
    ok(m && m.layers.map((l) => l.name).join() === 'White,Pink,Ink' && m.k > 0.5 && m.spot === 'womb', '...over the womb, in three colours to pick: the dots, the pink, the ink');
    Date.now = realNow;
  }
  out(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})().catch((e) => { out('CRASHED ' + (e && e.stack || e)); process.exit(1); });
