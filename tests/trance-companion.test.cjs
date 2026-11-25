// THE FARM'S TRANCE ON YOUR OWN GAME (Nov 25, extension/src/trance.js). Laynie: LSCG's hypnosis at the core with ECHS's
// feel, "with lscg, the farms version", beats by band, HSC-style looks. LSCG itself is played here by hand: its extension
// API the way its docs/api.md and src/api/operations.ts give it (getModApi, operations.hypno / states / binaural, events).
const path = require('path'), os = require('os');
const { JSDOM } = require('jsdom');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const page = new JSDOM('<!doctype html><html><head></head><body><canvas id="MainCanvas"></canvas></body></html>', { url: 'https://www.bondageprojects.elementfx.com/R134/BondageClub/' });
  const W = page.window;
  global.window = W; global.document = W.document;
  // the game, as much as the trance touches
  const sent = [], poses = [], removed = [], chatBoxes = [];
  W.Player = { MemberNumber: 500, Name: 'Moo', AssetFamily: 'Female3DCG', ActivePose: [], ArousalSettings: { Progress: 10 }, CanChangeOwnClothes: () => true, IsPlayer: () => true,
    LSCG: { GlobalModule: { enabled: true }, HypnoModule: { enabled: true, allowSuggestions: false, suggestionRequireHypnotizer: true, triggerTime: 5, enableBinaural: true, enableSpiralOverlay: true, suggestions: [] } } };
  W.ServerSend = (ev, d) => sent.push([ev, d]);
  W.ChatRoomCharacter = [W.Player, { MemberNumber: 221397, Name: 'Laynie', MapData: { Pos: { X: 3, Y: 4 } } }, { MemberNumber: 777, Name: 'Stranger' }];
  let handler = null; W.ChatRoomRegisterMessageHandler = (h) => { handler = h; };
  W.ChatRoomAppendChat = (el) => { chatBoxes.push(el); W.document.body.appendChild(el); };
  W.ServerChatRoomGetAllowItem = (src) => src.MemberNumber !== 777;
  W.PoseSetActive = (C, p) => poses.push(p); W.PoseCategoryAvailable = () => true; W.CharacterLoadCanvas = () => {};
  W.AssetGroup = ['Cloth', 'ClothLower', 'Bra', 'Panties', 'Shoes', 'ItemBreast'].map((n) => ({ Name: n, Family: 'Female3DCG', Category: n.startsWith('Item') ? 'Item' : 'Appearance', AllowCustomize: true, Clothing: !n.startsWith('Item') }));
  const worn = new Set(['Cloth', 'Bra', 'Panties']);
  W.InventoryGet = (C, g) => (worn.has(g) ? { Asset: { Name: g } } : null); W.InventoryRemove = (C, g) => { removed.push(g); worn.delete(g); }; W.ChatRoomCharacterUpdate = () => {};
  // the farm's own beats: a stand-in for the browser's sound
  const tones = [];
  class Param { constructor(v) { this.value = v; } setValueAtTime(v) { this.value = v; } linearRampToValueAtTime(v) { this.value = v; } setTargetAtTime(v) { this.value = v; } cancelScheduledValues() {} }
  W.AudioContext = class { constructor() { this.currentTime = 0; this.destination = {}; this.state = 'running'; tones.push(this); this.osc = []; }
    createOscillator() { const o = { frequency: new Param(0), connect() {}, start() { o.on = true; }, stop() { o.on = false; } }; this.osc.push(o); return o; }
    createChannelMerger() { return { connect() {} }; } createGain() { return { gain: new Param(1), connect() {} }; } close() { this.closed = true; } };
  // LSCG, played by hand
  const calls = [], evs = {}; let under = false, granted = new Set(), beat = { playing: false, beatHz: 0 };
  // LSCG's own note of the trance (Player.LSCG.StateModule.states), and its HypnoState: puttin' someone under who's already
  // under does nothin' at all, no new start and no new length (Nov 25: the farm's keep-alive leaned on that and Alexia came
  // up every time her 5 minutes ran out)
  const hcfg = { type: 'hypnotized', activatedAt: 0, activatedBy: -1, duration: undefined, recoveredAt: 0 };
  Object.defineProperty(hcfg, 'active', { get: () => under, set: (v) => { under = v; }, enumerable: true });
  W.Player.LSCG.StateModule = { enabled: true, states: [hcfg] };
  const hstate = { type: 'hypnotized', get active() { return under; },
    activate: (by, ms) => { calls.push(['activate', by, ms]); if (under) return; under = true; Object.assign(hcfg, { activatedAt: Date.now(), activatedBy: by == null ? -1 : by, duration: ms }); },
    recover: () => { calls.push(['recover']); under = false; hcfg.recoveredAt = Date.now(); (evs['state.recovered'] || []).forEach((f) => f({ type: 'hypnotized', reason: 'manual' })); } };
  // LSCG's own clock: brings them up its trance time after the trance started
  const lscgWouldWake = () => under && W.Player.LSCG.HypnoModule.triggerTime > 0 && hcfg.activatedAt + W.Player.LSCG.HypnoModule.triggerTime * 60000 < Date.now();
  const guard = (s, f) => (...a) => { if (!granted.has(s)) throw new Error('not allowed: ' + s); return f(...a); };
  const api = {
    events: { on: (e, f) => { (evs[e] = evs[e] || []).push(f); return () => {}; } },
    onReady: (f) => f(),
    operations: {
      request: (scopes, why) => calls.push(['request', scopes.join(','), why]),
      isGranted: (s) => granted.has(s), granted: () => [...granted], onChange: () => () => {},
      hypno: { isHypnotized: guard('hypno', () => under), binaural: {
        getState: guard('hypno', () => ({ enabled: W.Player.LSCG.HypnoModule.enableBinaural, playing: beat.playing, hypnotized: under, beatHz: beat.beatHz })),
        play: guard('hypno', (o) => { calls.push(['play', o && o.fadeSeconds]); beat.playing = true; return true; }), stop: guard('hypno', () => { beat.playing = false; return true; }),
        setBeat: guard('hypno', (hz) => { calls.push(['beat', hz]); beat.beatHz = hz; }), setVolume: guard('hypno', (v) => calls.push(['volume', v])) } },
      states: { get: guard('states', (t) => (t === 'hypnotized' ? hstate : undefined)) },
    },
  };
  W.LSCG = { version: '0.9.12', getModApi: (info) => { calls.push(['getModApi', info.id, info.name]); return api; } };
  const fire = (e, p) => (evs[e] || []).forEach((f) => f(p || {}));

  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-trance-c-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/trance.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent', define: { __FARMHAND_VERSION__: '"0.81.0"' } });
  const Tr = require(tmp);
  const toBot = [], chats = [], hooks = {}, arousals = [], leads = [];
  const prefs = {};
  Tr.initTrance({ toBot: (t, m) => toBot.push([t, JSON.parse(JSON.stringify(m))]), toChat: (t) => chats.push(t), prefs: () => prefs, botHere: () => true,
    mod: { hookFunction: (name, pri, fn) => { hooks[name] = fn; } }, arouse: (a, c) => arousals.push([a, c]), lead: (m) => leads.push(m) });
  for (const f of W.LSCG_OnLoad) f(W.LSCG);   // LSCG loads (after the Companion here; the queue works either way)
  const last = (t) => toBot.filter((x) => x[0] === t).map((x) => x[1]).pop();
  const evts = () => toBot.filter((x) => x[0] === 'hypnoEvent').map((x) => x[1]);

  // ── hookup ──
  ok(calls.some((c) => c[0] === 'getModApi' && c[1] === 'bnbfarm' && c[2] === 'B&B Farm'), 'the Companion is an LSCG extension: B&B Farm');
  ok(calls.some((c) => c[0] === 'request' && c[1] === 'hypno,states' && /in the farm's name/.test(c[2])), '...and asks for LSCG\'s Hypnosis and States, sayin\' plainly what for');
  Tr.tranceHello();
  let s = last('hypnoState');
  ok(s && s.lscg && s.on && !s.sugg && s.scopes.length === 0 && s.mins === 5 && s.beats, 'it tells the farm about their LSCG: hypnosis on, suggestions not allowed, the farm not let in yet, a 5-minute trance time: ' + JSON.stringify(s));
  ok(/Extensions → B&B Farm/.test(Tr.lscgTodo().text) && /Allow suggestions/.test(Tr.lscgTodo().text), 'the settings page says what to do in LSCG: ' + Tr.lscgTodo().text.slice(0, 90));

  // without the farm let in: the farm's own trance, never forced through LSCG
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' });
  ok(!calls.some((c) => c[0] === 'activate') && evts().pop().via === 'farm', 'not let in yet: no LSCG trance, the farm\'s own look instead');
  Tr.onHypno({ do: 'wake' });

  // let in
  granted = new Set(['hypno', 'states']); W.Player.LSCG.HypnoModule.allowSuggestions = true;
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' });
  const act = calls.filter((c) => c[0] === 'activate').pop();
  ok(act && act[1] === 260239 && act[2] > 590000, 'let in: under LSCG\'s own trance in the farm\'s name (so its suggestions count the farm as their hypnotist)');
  ok(evts().pop().via === 'lscg' && last('hypnoState').ours === true, '...and the farm hears it\'s under through LSCG, in its name');
  Tr.onHypno({ do: 'cue', kind: 'induction', beats: { from: 10, to: 6, over: 0 }, volume: 60, look: { haze: 40, spiral: 'slow', words: true, names: true, rings: true } });
  await wait(250);
  ok(calls.some((c) => c[0] === 'play') && calls.some((c) => c[0] === 'beat' && c[1] === 10) && calls.some((c) => c[0] === 'beat' && c[1] === 6) && calls.some((c) => c[0] === 'volume' && c[1] === 0.6),
    'the session\'s beats go through LSCG\'s own: started, 10 Hz sliding to 6, at 60% of their own volume');
  ok(!tones.length, '...and never the farm\'s beats on top');
  const el = W.document.getElementById('fhc-hyp');
  ok(el && /rgba\(88,28,118/.test(el.querySelector('.haze').style.background) && W.document.getElementById('fhc-hyp-names'), 'the look: a haze at the edges, names blurred');
  ok(el.querySelector('.spiral').style.opacity === '0', '...and no spiral of ours while LSCG draws its own');
  Tr.tranceVoice('[Voice] Deeper now, Moo.');
  ok(el.querySelectorAll('.word').length === 1 && el.querySelector('.word').textContent === 'Deeper now, Moo.', 'the farm\'s words drift up the screen');
  ok([...el.querySelectorAll('.ring')].every((r) => r.style.display === ''), 'soft rings');
  ok(!/flash|blink/i.test(require('fs').readFileSync(path.join(__dirname, '../extension/src/trance.js'), 'utf8').replace(/never flash\w*|nothin' ever flashes|never flashing|Nothin' ever flashes/gi, '').match(/@keyframes[^"]*/g).join(' ')), 'nothin\' in the look flashes');
  prefs.calmLook = true; Tr.onHypno({ do: 'depth', depth: 30 });
  ok([...el.querySelectorAll('.ring')].every((r) => r.style.display === 'none') && el.classList.contains('calm'), 'calm trance look: no rings, nothin\' turnin\'');
  prefs.calmLook = false;

  // kept up for the session: LSCG's own trance time (5 minutes here) would end it partway
  ok(hcfg.activatedBy === 260239 && hcfg.duration > 590000, 'LSCG notes the farm put them under, for the session\'s length');
  hcfg.activatedAt = Date.now() - 280000;   // 4 min 40 s in
  Tr.tranceState.keptAt = Date.now() - 16000;
  const before = calls.filter((c) => c[0] === 'activate').length;
  Tr.tranceTick();
  ok(Date.now() - hcfg.activatedAt < 2000 && !lscgWouldWake() && under, 'kept up: the trance\'s start moves up, so LSCG\'s 5 minutes never run out mid-session');
  ok(Math.abs(hcfg.activatedAt + hcfg.duration - Tr.tranceState.session.until) < 2000, '...and LSCG still ends it when the session would');
  hcfg.activatedAt = Date.now() - 280000; Tr.tranceState.keptAt = Date.now() - 16000; Tr.tranceTick();
  ok(Date.now() - hcfg.activatedAt < 2000 && !lscgWouldWake(), '...again and again, as long as the session runs');
  // somebody snaps them out of it
  under = false; fire('hypno.awakened', { method: 'snap', by: 221397 });
  ok(evts().pop().ev === 'awake' && evts().pop().method === 'snap', 'snapped out of it: the farm hears how');
  const at0 = hcfg.activatedAt;
  Tr.tranceState.keptAt = Date.now() - 16000; Tr.tranceTick();
  ok(calls.filter((c) => c[0] === 'activate').length === before && hcfg.activatedAt === at0 && !under, '...and never puts them back under on its own');
  Tr.onHypno({ do: 'wake' });
  ok(!calls.some((c) => c[0] === 'recover'), 'woken after they already came up: LSCG isn\'t touched again');
  await wait(4300);
  ok(!W.document.getElementById('fhc-hyp') && !W.document.getElementById('fhc-hyp-names'), 'the look lifts');

  // a whole session, woken by the farm
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'fun' });
  Tr.onHypno({ do: 'wake' });
  ok(calls.filter((c) => c[0] === 'recover').length === 1 && !evts().some((e, i, a) => i === a.length - 1 && e.ev === 'awake'), 'the farm wakes them out of LSCG\'s trance itself, and doesn\'t mistake that for bein\' snapped out');
  // No human left: left to run out
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'nhl' });
  const n0 = calls.filter((c) => c[0] === 'activate').length;
  Tr.onHypno({ do: 'linger', secs: 60 });
  Tr.tranceState.keptAt = Date.now() - 31000; Tr.tranceTick();
  ok(calls.filter((c) => c[0] === 'activate').length === n0 && under, 'No human left: not woken, and not kept up either; the trance runs out on its own');
  Tr.tranceState.lingerUntil = Date.now() - 1; Tr.tranceTick();
  ok(!Tr.tranceState.session, '...the look lifts after a while');
  under = false;

  // let in through States only (not Hypnosis): still kept up, still woken by the farm
  granted = new Set(['states']);
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' });
  hcfg.activatedAt = Date.now() - 280000; Tr.tranceState.keptAt = Date.now() - 16000; Tr.tranceTick();
  ok(under && hcfg.activatedBy === 260239 && Date.now() - hcfg.activatedAt < 2000, 'let in through States only: still kept up for the session');
  Tr.onHypno({ do: 'wake' });
  ok(!under, '...and the farm still wakes them at the end');
  granted = new Set(['hypno', 'states']);

  // already under somebody else's trance when the session starts: LSCG keeps it theirs, so it's theirs
  under = true; Object.assign(hcfg, { activatedBy: 221397, activatedAt: Date.now() - 60000, duration: undefined });
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' });
  ok(hcfg.activatedBy === 221397 && Tr.tranceState.session.ours === false, 'already under somebody else\'s trance: it stays theirs');
  const at1 = hcfg.activatedAt; Tr.tranceState.keptAt = Date.now() - 16000; Tr.tranceTick();
  ok(hcfg.activatedAt === at1, '...the farm doesn\'t keep it up');
  const r0 = calls.filter((c) => c[0] === 'recover').length; Tr.onHypno({ do: 'wake' });
  ok(calls.filter((c) => c[0] === 'recover').length === r0 && under, '...and doesn\'t end it either');
  under = false;

  // plantin': the farm checks what LSCG took
  W.Player.LSCG.HypnoModule.suggestions = [{ id: 'bnbfarm-milking-time', name: 'B&B Milking Time', trigger: 'milking time', instructions: [] }, { id: 'someone-else', trigger: 'x' }];
  Tr.onHypno({ do: 'check', ids: ['bnbfarm-milking-time', 'bnbfarm-good-animal'] });
  const ch = evts().pop();
  ok(ch.ev === 'checked' && ch.found.length === 1 && ch.found[0] === 'bnbfarm-milking-time', 'what the farm planted, checked in their LSCG');
  ok(last('hypnoState').planted.join() === 'bnbfarm-milking-time', '...and only the farm\'s own show in what it\'s told');
  fire('hypno.suggestionResolved', { suggestion: 'B&B Milking Time', sender: 221397, installedBy: 260239, resisted: true });
  ok(evts().pop().ev === 'resolved' && evts().pop().resisted === true, 'one of the farm\'s fired and they fought it off: the farm hears');
  fire('safeword', { kind: 'release' });
  ok(evts().pop().ev === 'safeword', 'LSCG\'s safeword: the farm hears');

  // ── the farm's own (no LSCG hypnosis) ──
  W.Player.LSCG.HypnoModule.enabled = false;
  const sugg = { id: 'bnbfarm-milking-time', name: 'B&B Milking Time', trigger: 'milking time', installedBy: 260239, instructions: [
    { type: 'Strip', arguments: { selection: { all: false, random: false, groups: ['Cloth', 'Bra', 'Corset'] } } },
    { type: 'Assume Pose', arguments: { selection: { full: 'AllFours', upper: '', lower: '' } }, delay: 1000 },
    { type: 'Speak Phrase', arguments: { config: 'Moo… milk me, please.' }, delay: 1000 }] };
  Tr.onHypno({ do: 'suggestions', list: [sugg, { id: 'bad', trigger: 'x', instructions: [{ type: 'Serve' }] }] });
  ok(Tr.farmSuggestions().length === 1, 'the farm\'s triggers kept here (anything that isn\'t one of LSCG\'s own instructions is dropped)');
  const say = (mn, text, type) => handler.Callback({ Type: type || 'Chat', Content: text, Sender: mn }, W.ChatRoomCharacter.find((c) => c.MemberNumber === mn) || { MemberNumber: mn });
  say(221397, '(milking time)'); say(500, 'milking time'); say(777, 'milking time');
  ok(!Tr.tranceState.pending, 'never from out of character, never from their own mouth, never from somebody who may not touch them');
  say(221397, 'Alright girls, MILKING TIME!');
  ok(Tr.tranceState.pending && chatBoxes.length === 1 && /Laynie's words reach right down into you/.test(chatBoxes[0].textContent) && chatBoxes[0].querySelectorAll('button').length === 2,
    'said by somebody who may: their words reach in, with Give in and Fight it');
  chatBoxes[0].querySelectorAll('button')[0].click();
  await wait(2300);
  ok(removed.join() === 'Cloth,Bra' && poses.includes('AllFours'), 'given in: the top comes off (what\'s worn of it) and down on all fours');
  ok(Tr.tranceState.phrase === 'Moo… milk me, please.' && evts().pop().ev === 'fired', '...and only the one thing will come out');
  const send = hooks.ServerSend;
  let r = send(['ChatRoomChat', { Type: 'Chat', Content: 'wait what' }], (a) => a);
  ok(r[1].Type === 'Emote' && /opens their mouth, but nothin' comes out/.test(r[1].Content), 'anything else they try to say: their mouth opens and nothin\' comes out');
  r = send(['ChatRoomChat', { Type: 'Chat', Content: '(OOC: brb)' }], (a) => a);
  ok(r[1].Content === '(OOC: brb)', '...out of character always goes through');
  r = send(['ChatRoomChat', { Type: 'Chat', Content: 'Moo… milk me, please.' }], (a) => a);
  ok(r[1].Content === 'Moo… milk me, please.' && !Tr.tranceState.phrase, 'sayin\' it lets them go');
  // fightin' it
  Tr.onHypno({ do: 'suggestions', list: [{ id: 'bnbfarm-needy-thing', name: 'B&B Needy Thing', trigger: 'needy cow', instructions: [{ type: 'Denial', arguments: {} }] }] });
  Tr.tranceState.pull['bnbfarm-needy-thing'] = 0;
  say(221397, 'such a needy cow');
  W.document.querySelectorAll('.fhc-sg-ask button')[1].click();
  ok(Tr.tranceState.denyUntil === 0 && /shake Laynie's words off/.test(chats.join(' ')) && evts().pop().resisted === true, 'fought off (when it hasn\'t got its hooks in deep): nothin\' happens, the farm hears');
  Tr.tranceState.pull['bnbfarm-needy-thing'] = 100;
  say(221397, 'such a needy cow');
  W.document.querySelectorAll('.fhc-sg-ask button')[1].click();
  await wait(100);
  ok(Tr.tranceState.denyUntil > Date.now(), 'fought, but it\'s in too deep: denied');
  W.ActivityOrgasmRuined = false;
  hooks.ActivityOrgasmStart([W.Player], () => {});
  ok(W.ActivityOrgasmRuined === true, '...and when they get there, it\'s ruined');
  Tr.onHypno({ do: 'clear' });
  ok(Tr.tranceState.denyUntil === 0 && !Tr.tranceState.phrase, 'a safeword lets go of all of it');

  // the farm's own beats, only if they asked
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' });
  Tr.onHypno({ do: 'cue', beats: { from: 8, to: 3, over: 0 } });
  ok(!tones.length, 'no LSCG hypnosis and the farm\'s beats switched off: silence');
  prefs.farmBeats = true;
  Tr.onHypno({ do: 'cue', beats: { from: 8, to: 3, over: 0 } });
  await wait(250);
  const ac = tones[0];
  ok(ac && ac.osc.length === 2 && Math.abs((ac.osc[1].frequency.value - ac.osc[0].frequency.value) - 3) < 0.01, 'switched on: a tone in each ear, 3 Hz apart (delta)');
  Tr.onHypno({ do: 'wake' });
  await wait(2600);
  ok(ac.closed === true, 'woken: the beats fade away');
  prefs.noTrance = true;
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' });
  Tr.onHypno({ do: 'cue', look: { haze: 60 } });
  await wait(4400);
  ok(!W.document.getElementById('fhc-hyp'), 'trance look switched off: nothin\' on their screen');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
