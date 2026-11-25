// THE FARM'S TRANCE, PART 2, on your own game (Nov 25, extension/src/trance.js; Laynie: "build part 2", hijacked speech
// "i love it", the daily build-up "yes", hearin' narrowed "only ... in trance or for a duration when triggered"). The farm's
// own LSCG instructions (registered with LSCG's extension API, docs/api.md "Hypnosis suggestions"), the nudges, hijacked
// speech, hearin' narrowed (out-of-character lines always clear), and the switches for them.
const path = require('path'), os = require('os');
const { JSDOM } = require('jsdom');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const page = new JSDOM('<!doctype html><html><head></head><body><canvas id="MainCanvas"></canvas><div id="TextAreaChatLog"></div></body></html>', { url: 'https://www.bondageprojects.elementfx.com/R134/BondageClub/' });
  const W = page.window;
  global.window = W; global.document = W.document;
  const sent = [], chatBoxes = [];
  W.Player = { MemberNumber: 500, Name: 'Moo', AssetFamily: 'Female3DCG', ActivePose: [], ArousalSettings: { Progress: 10 }, CanChangeOwnClothes: () => true, IsPlayer: () => true,
    LSCG: { GlobalModule: { enabled: true }, HypnoModule: { enabled: true, allowSuggestions: true, suggestionRequireHypnotizer: true, triggerTime: 5, enableBinaural: false, enableSpiralOverlay: true, suggestions: [] } } };
  W.ServerSend = (ev, d) => sent.push([ev, d]);
  W.ChatRoomCharacter = [W.Player, { MemberNumber: 221397, Name: 'Laynie' }, { MemberNumber: 777, Name: 'Stranger' }, { MemberNumber: 260239, Name: 'Farmhand' }];
  let handler = null; W.ChatRoomRegisterMessageHandler = (h) => { handler = h; };
  W.ChatRoomAppendChat = (el) => { chatBoxes.push(el); W.document.body.appendChild(el); };
  W.ServerChatRoomGetAllowItem = () => true;
  const taken = []; W.FarmhandDispensary = { take: (name, strength, by) => { taken.push([name, strength, by]); return { ok: true }; } };
  // LSCG, played by hand: its extension API, now with registerInstruction
  const calls = [], evs = {}, defs = {}; let under = false;
  const hcfg = { type: 'hypnotized', activatedAt: 0, activatedBy: -1, duration: undefined };
  Object.defineProperty(hcfg, 'active', { get: () => under, set: (v) => { under = v; }, enumerable: true });
  W.Player.LSCG.StateModule = { enabled: true, states: [hcfg] };
  const hstate = { type: 'hypnotized', get active() { return under; }, activate: (by, ms) => { if (under) return; under = true; Object.assign(hcfg, { activatedAt: Date.now(), activatedBy: by, duration: ms }); }, recover: () => { under = false; } };
  const api = {
    events: { on: (e, f) => { (evs[e] = evs[e] || []).push(f); return () => {}; } },
    onReady: (f) => f(),
    hypno: { registerInstruction: (d) => { defs[d.name] = d; return () => {}; } },
    operations: { request: () => {}, isGranted: () => true, granted: () => ['hypno', 'states'], onChange: () => () => {},
      hypno: { isHypnotized: () => under, binaural: { getState: () => ({ enabled: false }), play: () => true, stop: () => true, setBeat: () => {}, setVolume: () => {} } },
      states: { get: (t) => (t === 'hypnotized' ? hstate : undefined) } },
  };
  W.LSCG = { version: '0.9.12', capabilities: new Set(['hypno.instructions', 'states']), getModApi: () => api };
  const fire = (e, p) => (evs[e] || []).forEach((f) => f(p || {}));

  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-trance-p2-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/trance.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent', define: { __FARMHAND_VERSION__: '"0.82.0"' } });
  const Tr = require(tmp);
  const toBot = [], chats = [], hooks = {}, arousals = [];
  const prefs = {}; let botHere = true;
  Tr.initTrance({ toBot: (t, m) => toBot.push([t, JSON.parse(JSON.stringify(m))]), toChat: (t) => chats.push(t), prefs: () => prefs, botHere: () => botHere,
    mod: { hookFunction: (name, pri, fn) => { hooks[name] = fn; } }, arouse: (a, c) => arousals.push([a, c]), lead: () => {} });
  for (const f of W.LSCG_OnLoad) f(W.LSCG);
  // everything the game sends goes through the Companion's hook first, as in the game
  W.ServerSend = (ev, d) => hooks.ServerSend([ev, d], (a) => sent.push(a));
  const said = () => sent.filter(([e, d]) => e === 'ChatRoomChat' && d.Type === 'Chat').map(([, d]) => d.Content);
  const emotes = () => sent.filter(([e, d]) => e === 'ChatRoomChat' && d.Type === 'Emote').map(([, d]) => d.Content);
  const asks = () => toBot.filter((x) => x[0] === 'hypnoDo').map((x) => x[1]);

  // ── the farm's own instructions in LSCG's suggestion editor ──
  ok(defs.sound && defs.stall && defs.beg, 'LSCG\'s suggestion editor gets the farm\'s own: ' + Object.values(defs).map((d) => d.label).join(', '));
  ok(defs.sound.options[0].key === 'times' && defs.sound.options[0].max === 3 && defs.beg.options.some((o) => o.key === 'stall' && o.default === true) && defs.stall.unrepeatable,
    '...with what a suggestion\'s writer can set (how many times; the words, then off to a stall)');
  Tr.onHypno({ do: 'pull', n: 0, sound: 'moo', animal: 'cow', herd: 221397, slips: [{ t: 'Moo~', p: 0 }, { t: 'Good cows give milk.', p: 60 }, { t: '(sneaky)', p: 0 }] });
  defs.sound.perform({ options: { times: 2 }, sender: 221397 });
  ok(said().pop() === 'Moo… moooo~', 'make their sound: out loud, in their own animal\'s sound: ' + said()[said().length - 1]);
  defs.stall.perform({ options: {}, sender: 221397 });
  ok(asks().pop().what === 'stall' && /feet start for the milkin' stalls/.test(emotes().pop()), 'go to a free milkin\' stall: the farm\'s asked to walk them there');
  defs.beg.perform({ options: { words: '{Sound}… please, the stall…', stall: true }, sender: 221397 });
  ok(said().pop() === 'Moo… please, the stall…', 'beg to be milked: the words they were given, in their sound');
  const n0 = asks().length; await wait(2300);
  ok(asks().length === n0 + 1, '...then off to a free stall');
  defs.beg.perform({ options: { words: '', stall: false }, sender: 221397 }); await wait(2300);
  ok(/milk/i.test(said().pop()) && asks().length === n0 + 1, 'no words given: the farm\'s own; and "then go to a stall" unticked: they stay put');
  botHere = false; defs.stall.perform({ options: {}, sender: 1 }); botHere = true;
  ok(/no farm here/.test(chats.pop()) && asks().length === n0 + 1, 'off the farm: nowhere to walk to, and they\'re told');

  // ── the nudges ──
  Tr.onHypno({ do: 'nudge', fx: 'voice', text: 'So heavy, Moo. Your eyes want to close.', n: 34 });
  ok(chats.pop() === '[Voice] So heavy, Moo. Your eyes want to close.' && Tr.tranceState.pullN === 34, 'a whisper in the farm\'s voice, only to them; the pull\'s 34');
  ok(W.document.querySelector('#fhc-nudge .breath'), '...with a soft breath of haze');
  Tr.onHypno({ do: 'nudge', fx: 'spiral', n: 45 });
  ok(W.document.querySelector('#fhc-nudge .turn'), 'a slow turn of the spiral, faint, up and gone');
  const log = W.document.getElementById('TextAreaChatLog');
  const line = (mn, text, cls) => { const d = W.document.createElement('div'); d.className = 'ChatMessage ChatMessage' + (cls || 'Chat'); d.setAttribute('data-sender', String(mn));
    const b = W.document.createElement('button'); b.className = 'ChatMessageName'; b.textContent = 'N' + mn; d.appendChild(b); d.appendChild(W.document.createTextNode(': ' + text)); log.appendChild(d); return d; };
  const said777 = line(777, 'look at her go');
  Tr.onHypno({ do: 'nudge', fx: 'blur', n: 50 });
  ok(/blur/.test(said777.style.filter), 'one line somebody else said goes soft and blurry for a while');
  const kids = W.document.getElementById('fhc-nudge').children.length;
  prefs.noPull = true; Tr.onHypno({ do: 'nudge', fx: 'haze', n: 52 });
  ok(W.document.getElementById('fhc-nudge').children.length === kids && Tr.tranceState.pullN === 50, '"The farm\'s pull through the day" switched off: nothin\'');
  ok(Tr.tranceStatus().pullOff === true, '...and the farm\'s told it\'s off');
  prefs.noPull = false;

  // ── hijacked speech ──
  const send = hooks.ServerSend;
  Tr.tranceState.pullN = 40; Tr.tranceState.hijackAt = 0; Tr.tranceState.afterUntil = 0;
  ok(Tr.hijackChance() === 0, 'the pull under 60 (and no session lately): their words are their own');
  Tr.tranceState.pullN = 100;
  ok(Math.abs(Tr.hijackChance() - 0.25) < 1e-9, 'the pull at the top: one line in four gets taken');
  const R = Math.random; Math.random = () => 0.001;
  let passed = null; send(['ChatRoomChat', { Type: 'Chat', Content: 'hello there' }], (a) => { passed = a; });
  Math.random = R;
  ok(passed === null && /lips part|words go slow|stalls there/.test(emotes().pop()) && chats.pop() === '🌀 You tried to say: hello there', 'taken: a thought tryin\' to form, and only they see what they meant to say');
  await wait(2200);
  ok(/stares, mouth open… nothin' comes/.test(emotes().pop()), '...and nothin\' comes out at all');
  ok(Tr.hijackChance() === 0, 'never twice within 45 seconds');
  Tr.tranceState.hijackAt = 0;
  for (const t of ['(brb, food)', '/me waves', '!help', '*smiles', '?stats']) { passed = null; Math.random = () => 0.001; send(['ChatRoomChat', { Type: 'Chat', Content: t }], (a) => { passed = a; }); Math.random = R; if (!passed) ok(false, 'went through: ' + t); }
  passed = null; Math.random = () => 0.001; send(['ChatRoomChat', { Type: 'Whisper', Content: 'psst', Target: 221397 }], (a) => { passed = a; }); Math.random = R;
  ok(passed && passed[1].Content === 'psst' && Tr.tranceState.hijackAt === 0, 'out of character, commands, emotes and whispers always go through');
  Tr.hijack('I want some hay', 'wrong'); await wait(2200);
  ok(said().pop() === 'Good cows give milk.', 'it comes out wrong: one of the library\'s slips, as deep as it\'s got them (never one with round brackets)');
  Tr.tranceState.hijackAt = 0; Tr.hijack('going to the barn now', 'late'); await wait(7600);
  const late = said().pop();
  ok(/^going/.test(late) && /barn/.test(late) && /…$/.test(late), 'it comes out late: slow, trailin\' off: ' + late);
  Tr.tranceState.hijackAt = 0; const ar = arousals.length; Tr.hijack('hm', 'squirm'); await wait(2200);
  ok(/squirmin' where they stand/.test(emotes().pop()) && arousals.length === ar + 1, 'or it turns into squirmin\' (and stirs them up, if they let the farm)');
  // the farm's words comin' out of them are never taken themselves
  Tr.tranceState.hijackAt = 0; Math.random = () => 0.001; defs.sound.perform({ options: { times: 1 }, sender: 1 }); Math.random = R;
  ok(said().pop() === 'Moooo~', 'the farm\'s own words comin\' out of them are never taken');
  prefs.noSlips = true; Tr.tranceState.hijackAt = 0;
  ok(Tr.hijackChance() === 0 && Tr.tranceStatus().slipsOff === true, '"Hijacked speech" switched off: never');
  prefs.noSlips = false;
  // a while after a session
  Tr.tranceState.pullN = 0; Tr.tranceState.hijackAt = 0;
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' }); Tr.onHypno({ do: 'wake' });
  ok(Math.abs(Tr.hijackChance() - 0.18) < 1e-9 && Tr.tranceState.afterUntil - Date.now() > 14 * 60000, 'woken from a Deep session: the words stay slippery for 15 minutes');

  // ── hearin' narrowed ──
  const hear = () => W.document.getElementById('fhc-hyp-hear');
  ok(!hear(), 'awake, and no trigger lately: everybody\'s heard');
  Tr.onHypno({ do: 'under', by: 260239, ms: 600000, level: 'deep' });
  const css = hear() && hear().textContent;
  ok(css && ['260239', '500', '221397'].every((m) => css.includes(':not([data-sender="' + m + '"])')) && /:not\(\.fhc-ooc\)/.test(css) && /blur/.test(css),
    'under: everybody\'s chat goes faint and blurred, but the farm\'s, their own and their herd leader\'s');
  const ooc = line(777, '(you okay in there?)'), plain = line(777, 'heh'), wh = line(777, '(psst)', 'Whisper');
  await wait(50);
  ok(ooc.classList.contains('fhc-ooc') && wh.classList.contains('fhc-ooc') && !plain.classList.contains('fhc-ooc'), 'out-of-character lines (said or whispered) are marked as they come in, so they\'re never blurred');
  Tr.onHypno({ do: 'wake' });
  ok(!hear(), 'woken: everybody\'s heard again');
  fire('hypno.suggestionResolved', { suggestion: 'B&B Milking Time', sender: 777, installedBy: 260239, resisted: false });
  ok(hear() && hear().textContent.includes(':not([data-sender="777"])') && Tr.tranceState.narrowUntil - Date.now() > 170000, 'one of the farm\'s triggers lands: for three minutes only a few voices get through (whoever set it off among them)');
  fire('hypno.suggestionResolved', { suggestion: 'Somebody Else\'s', sender: 221397, installedBy: 221397, resisted: false });
  ok(Tr.tranceState.narrowBy === 777, 'somebody else\'s suggestion landin\': not the farm\'s, so it changes nothin\' here');
  prefs.noTrance = true; Tr.tranceTick();
  ok(!hear(), '"Trance look" switched off: nobody\'s blurred');
  prefs.noTrance = false;

  // ── the farm's own triggers carry the farm's instructions too (no LSCG) ──
  W.Player.LSCG.HypnoModule.enabled = false;
  Tr.onHypno({ do: 'suggestions', list: [{ id: 'bnbfarm-to-the-stalls', name: 'B&B To the Stalls', trigger: 'to the stalls', instructions: [
    { type: 'bnbfarm.sound', arguments: { options: { times: 1 } } }, { type: 'farmhand-dispensary.dose', arguments: { options: { dose: 'moo', strength: 'half' } }, delay: 1000 }] }] });
  ok(Tr.farmSuggestions().length === 1, 'kept here: the farm\'s own instructions count');
  Tr.tranceState.hijackAt = Date.now();
  handler.Callback({ Type: 'Chat', Content: 'off to the stalls, girls', Sender: 221397 }, W.ChatRoomCharacter[1]);
  W.document.querySelectorAll('.fhc-sg-ask button')[0].click();
  await wait(1300);
  ok(said().pop() === 'Moooo~' && taken.length === 1 && taken[0].join() === 'moo,half,221397', 'given in: their sound, then the dose (their Dispensary, from whoever said it)');
  // ── part 3: a compulsion reaches in ──
  Tr.tranceState.pending = null; Tr.tranceState.hijackAt = Date.now(); Tr.tranceState.pullN = 0; Tr.tranceState.afterUntil = 0;
  const boxes0 = chatBoxes.length;
  Tr.onHypno({ do: 'compel', id: 'bnbfarm-c-pat-melt', name: 'B&B Pat Melt', when: 'pat', by: 221397, byName: 'Laynie', instructions: [{ type: 'bnbfarm.sound', arguments: { options: { times: 1 } } }, { type: 'Serve', arguments: {} }] });
  const box = chatBoxes[chatBoxes.length - 1];
  ok(chatBoxes.length === boxes0 + 1 && /That pat on your head… and somethin' the farm put in you stirs/.test(box.textContent) && box.querySelectorAll('button').length === 2, 'part 3: a compulsion set off reaches in, give in or fight it: ' + box.textContent.slice(0, 80));
  box.querySelectorAll('button')[0].click(); await wait(300);
  const fired = toBot.filter((x) => x[0] === 'hypnoEvent').map((x) => x[1]).pop();
  ok(said().pop() === 'Moooo~' && fired.ev === 'fired' && fired.id === 'bnbfarm-c-pat-melt' && fired.resisted === false, 'given in: their sound comes out (Serve isn\'t one the farm does), and the farm hears it landed');
  // ── part 3: hang-ons ──
  const hang = (effect, mins) => Tr.onHypno({ do: 'hangon', id: effect, name: effect, effect, until: Date.now() + (mins || 30) * 60000, low: 'kneel' });
  hang('cowtalk'); hang('yes');
  ok(/Somethin' stays with you after: no won't come out of you, only yes, for 30 minutes/.test(chats.pop()), 'a hang-on starts: they\'re told what it is, and for how long');
  passed = null; send(['ChatRoomChat', { Type: 'Chat', Content: 'No, I am hungry and my udders ache, give me hay' }], (a) => { passed = a; });
  ok(passed && passed[1].Content === 'Yes, this cow is hungry and this cow\'s udders ache, give this cow hay', 'no I, just this cow; and every no comes out yes: ' + (passed && passed[1].Content));
  passed = null; send(['ChatRoomChat', { Type: 'Chat', Content: '(no, I\'m fine, just checking)' }], (a) => { passed = a; });
  ok(passed && passed[1].Content === '(no, I\'m fine, just checking)', '...never out of character');
  Tr.tranceState.hang = []; hang('mootalk');
  Math.random = () => 0.01; passed = null; send(['ChatRoomChat', { Type: 'Chat', Content: 'hello there friend' }], (a) => { passed = a; }); Math.random = R;
  ok(passed && /moo~$/.test(passed[1].Content) && /moo/.test(passed[1].Content.split('…')[0]), 'moo talk: their sound slips in between the words and on the end: ' + (passed && passed[1].Content));
  hang('handsoff'); let ran = false;
  hooks.ActivityRun([W.Player, W.Player, {}, {}], () => { ran = true; });
  ok(!ran && /Your hands stop short/.test(chats.pop()), 'hands off: their own hands won\'t touch themselves');
  ran = false; hooks.ActivityRun([W.Player, W.ChatRoomCharacter[1], {}, {}], () => { ran = true; });
  ok(ran, '...somebody else is theirs to touch');
  hang('edge'); W.ActivityOrgasmRuined = false; hooks.ActivityOrgasmStart([W.Player], () => {});
  ok(W.ActivityOrgasmRuined === true, 'kept at the edge: when they get there, it\'s ruined');
  Tr.tranceState.narrowUntil = 0; hang('hearing');
  ok(hear(), 'only the farm\'s voice: hearin\' narrowed while it lasts, under or not');
  hang('names');
  ok(W.document.getElementById('fhc-hang-names'), 'names gone fuzzy');
  const poses = []; W.PoseSetActive = (C, p) => { poses.push(p); C.ActivePose = [p]; }; W.PoseCategoryAvailable = () => true; W.CharacterLoadCanvas = () => {};
  hang('fours'); Tr.tranceState.foursAt = 0; Tr.tranceTick();
  ok(poses.includes('Kneel'), 'down low: back down where they picked (kneelin\') whenever they get up');
  Tr.tranceState.hang.forEach((h) => { h.until = Date.now() - 1; }); Tr.tranceTick();
  ok(!Tr.hangons().length && /lets go of you/.test(chats.pop()) && !W.document.getElementById('fhc-hang-names') && !hear(), 'time\'s up: they all let go');
  hang('yes', 60);
  Tr.onHypno({ do: 'clear' });
  ok(!hear() && Tr.tranceState.pullN === 0 && Tr.tranceState.afterUntil === 0 && !Tr.hangons().length, 'the safeword: nothin\' slips, everybody\'s heard, the pull lets go, every hang-on ends');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
