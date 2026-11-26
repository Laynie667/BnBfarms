// THE TRANCE LIBRARY FORMAT (Nov 25). Laynie: "definitely need to choose a format for the session editor thats consistent,
// and with labels, so they can be combined in different ways, like deepeners, inductions, etc." and "choose a range for the
// binaurals, like theta and delta". One text file of labelled blocks (shared/trance-script.js); the starter library
// (shared/trance-starter.js) is Conditioning's lines in it. Trigger blocks become LSCG's own suggestions, built only from
// LSCG's default instructions for now ("focus on lscgs default suggestion inputs on the first rendition").
const path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-trance-' + process.pid + '.cjs'), tmp2 = tmp.replace('.cjs', '-s.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/trance-script.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  await esbuild.build({ entryPoints: [path.join(__dirname, '../shared/trance-starter.js')], bundle: true, format: 'cjs', outfile: tmp2, logLevel: 'silent' });
  const T = require(tmp), { STARTER } = require(tmp2);
  let seed = 7; const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // ── the starter library ──
  const lib = T.parseLibrary(STARTER);
  ok(lib.errors.length === 0, 'the starter library reads clean: ' + (lib.errors.map((e) => e.line + ' ' + e.msg).join(' | ') || 'no errors'));
  ok(lib.warnings.length === 0, '...with nothin\' to fix up: ' + (lib.warnings.map((e) => e.line + ' ' + e.msg).join(' | ') || 'no warnings'));
  const kinds = (k) => lib.blocks.filter((b) => b.kind === k);
  ok(kinds('induction').length >= 1 && kinds('deepener').length >= 3 && kinds('wake').length >= 3 && kinds('trigger').length >= 4 && T.LEVELS.every((l) => kinds('session').some((s) => !s.labels.level || s.labels.level.includes(l))),
    'it has inductions, a deepener and a wake for every level, triggers and sessions for each level');
  for (const level of T.LEVELS) {
    const plan = T.planSession(lib.blocks, { level, species: 'cow', wears: ['collar'] }, { rng });
    const ks = plan.blocks.map((b) => b.kind);
    ok(plan.name && ks[0] === 'induction' && ks.includes('deepener') && ks[ks.length - 1] === 'wake' && plan.blocks.every((b) => T.fits(b, { level, species: 'cow', wears: ['collar'] })),
      level + ': a session picked from the recipe, every block fit for the level: ' + plan.name + ' = ' + plan.blocks.map((b) => b.kind + ':' + b.name).join(' · '));
  }
  const fun = T.planSession(lib.blocks, { level: 'fun', species: 'cow' }, { rng });
  ok(!fun.blocks.some((b) => b.name === 'Milking Time' || b.name === 'Dark and Warm' || b.name === 'Past the Words'), 'a fun session never gets the deep stripping trigger or a deeper level\'s deepener');
  ok(!T.planSession(lib.blocks, { level: 'deep', species: 'cow', wears: [] }, { rng }).blocks.some((b) => (b.labels.wears || []).length), 'gear lines only for somebody wearin\' that gear');

  // ── steps ── (a recipe naming its induction and deepener, so the checks know which ones play)
  const pinned = T.parseLibrary(STARTER + '\n=== session: Test Deep\nlevel: deep\ninduction: Settling In\ndeepener: Dark and Warm\nconvincer: Heavy Hands\nsuggestion: any 3\ntrigger: any 2\ncompulsion: any\nhangon: any\nwake: any\n');
  const plan = T.planSession(pinned.blocks, { level: 'deep', species: 'cow', wears: [] }, { rng, name: 'Test Deep' });
  const st = T.sessionSteps(plan, { rng, keep: (t) => !/^\{c\}/.test(t) });
  ok(st.length >= 10 && st.every((s) => s.gap >= 0), 'the session line by line: ' + st.length + ' lines');
  ok(st[0].start && st[0].beats && st[0].beats.from >= 8 && st[0].beats.from <= 12 && st[0].beats.to >= 4 && st[0].beats.to <= 8 && st[0].beats.over === 180,
    'the induction\'s beats: alpha slides to theta over 3 minutes, a fresh rate in each band: ' + JSON.stringify(st[0].beats));
  const deep = st.find((s) => s.block === 'Dark and Warm' && s.start);
  ok(deep && deep.beats.to >= 1 && deep.beats.to <= 4 && deep.look.haze === 50 && deep.look.rings === true, 'the deepener goes down into delta, the haze thickens: ' + JSON.stringify(deep && deep.beats));
  ok(!st.some((s) => /^\{c\}/.test(s.text)), 'a line for a body they haven\'t got is left out');
  ok(st.filter((s) => s.block === 'Dark and Warm').length === 4, 'pick 4: four lines of the deepener, fresh each time');
  const planted = st.filter((s) => s.plant);
  ok(planted.filter((s) => s.plant.kind === 'trigger').length === 2 && planted.filter((s) => s.plant.kind === 'compulsion').length === 1 && planted.filter((s) => s.plant.kind === 'hangon').length === 1 && planted.length === 4,
    'two triggers, a compulsion and a hang-on planted (Deep in the Barn, part 3), each after its own words');
  ok(st.filter((s) => s.deeper).reduce((n, s) => n + s.deeper, 0) === 25, 'the deepener takes them 25 deeper');

  // ── the format, both ways ──
  const again = T.parseLibrary(T.formatLibrary(lib.blocks));
  ok(again.errors.length === 0 && again.blocks.length === lib.blocks.length && T.formatLibrary(again.blocks) === T.formatLibrary(lib.blocks), 'written out and read back: the same library, word for word');

  // ── beats and bands ──
  ok(JSON.stringify(T.parseBeats('alpha 10 → theta 6 over 3m')) === JSON.stringify({ from: { hz: 10, band: 'alpha' }, to: { hz: 6, band: 'theta' }, over: 180 }), 'alpha 10 → theta 6 over 3m');
  ok(T.parseBeats('delta').from.band === 'delta' && T.parseBeats('2').from.hz === 2 && T.parseBeats('theta -> delta 2 over 90s').over === 90 && T.parseBeats('off').off, 'a band, a number, ->, seconds, off');
  ok(T.parseBeats('40') === null && T.parseBeats('gamma') === null && T.parseBeats('0.5') === null, 'nothin\' outside 1-30 Hz, no made-up bands');
  const d = Array.from({ length: 50 }, () => T.hzOf({ band: 'delta' }, rng));
  ok(d.every((x) => x >= 1 && x <= 4) && new Set(d).size > 5, 'delta picks a fresh rate inside 1-4 Hz each time');

  // ── what a trigger does ──
  const ms = T.parseDoes('strip top → pose {low} → say "Moo… milk me, please."', '3s, 3s', { low: 'fours' });
  ok(ms.ok && ms.instructions.length === 3 && ms.instructions[0].type === 'Strip' && ms.instructions[0].arguments.selection.groups.includes('Cloth') &&
    ms.instructions[1].type === 'Assume Pose' && ms.instructions[1].arguments.selection.full === 'AllFours' && ms.instructions[1].delay === 3000 &&
    ms.instructions[2].type === 'Speak Phrase' && ms.instructions[2].arguments.config === 'Moo… milk me, please.', 'strip top → pose {low} → say: LSCG\'s own Strip, Assume Pose and Speak Phrase, 3 s apart');
  ok(T.parseDoes('pose {low}', '', { low: 'kneel' }).instructions[0].arguments.selection.lower === 'Kneel', '{low} is whichever they picked: kneelin\' or all fours');
  const all = ['cum', 'deny', 'needy', 'strip all', 'strip random', 'pose kneel spread', 'say', 'follow', 'touch Caress tits self', 'forget deny, needy', 'forget'].map((s) => T.parseStep(s, {}));
  ok(all.every((x) => !x.error) && all.map((x) => x.type).join(',') === 'Orgasm,Denial,Insatiable,Strip,Strip,Assume Pose,Speak Phrase,Follow,Perform Activity,Forget,Forget',
    'every one of LSCG\'s default instructions but Serve: ' + all.map((x) => x.type || x.error).join(', '));
  ok(all[8].arguments.selection.group === 'ItemBreast' && all[8].arguments.self === true && all[10].arguments.selection.all === true, 'touch: the game\'s zone and activity, on themselves; forget: everything');
  ok(T.parseDoes('cum → deny → needy → strip all').error && T.parseStep('serve drinks').error && T.parseDoes('cum → deny', '45s').error, 'never more than three, no Serve, waits 1 to 30 s');
  const s = T.lscgSuggestion(lib.blocks.find((b) => b.kind === 'trigger' && b.name === 'Milking Time'), { words: { animal: 'cow', sound: 'moo', low: 'on all fours' }, low: 'fours', by: 260239, byName: 'Farmhand', now: 1 });
  ok(s.id === 'bnbfarm-milking-time' && s.trigger === 'milking time' && s.installedBy === 260239 && s.exclusive === false && s.instructions.length === 3 &&
    s.instructions[2].arguments.config === 'moo… milk me, please.' && s.instructions[1].arguments.selection.full === 'AllFours', 'as LSCG\'s own suggestion: its id, phrase, the farm as the one who planted it, their sound and pose filled in');
  const g = T.lscgSuggestion(lib.blocks.find((b) => b.kind === 'trigger' && b.name === 'Good Animal'), { words: { animal: 'pony', sound: 'whinny' }, low: 'kneel' });
  ok(g.trigger === 'good pony' && g.instructions[0].arguments.config === 'whinny~', 'the phrase fits the animal: good pony, and a whinny');

  // ── mistakes are told plainly ──
  const bad = T.parseLibrary('=== deepener: X\nlevel: medium\nbeats: gamma\n\nSink (now).\n=== trigger: Y\ntrigger: no\n=== session: Z\ndeepener: Nope\n=== nonsense: Q\n');
  const msgs = bad.errors.map((e) => e.msg).join(' | ');
  ok(/level is fun, deep or nhl/.test(msgs) && /beats like/.test(msgs) && /trigger needs its phrase/.test(msgs) && /needs what it does/.test(msgs) && /no deepener called Nope/.test(msgs) && /no such kind/.test(msgs),
    'mistakes are named, with the line: ' + bad.errors.map((e) => e.line).join(','));
  ok(bad.warnings.some((w) => /round brackets/.test(w.msg)) && bad.blocks[0].lines[0].text === 'Sink now.', 'round brackets are taken out of spoken lines (hypno add-ons skip what follows one)');
  ok(T.planSession(bad.blocks, { level: 'fun' }, { rng }).blocks.every((b) => !b.bad), 'a block with a mistake is never used');

  // ── tone (Nov 25: ?praise / ?degrade followed) and the bigger library ──
  const { pathToFileURL } = require('url');
  const { fits: fitsBody } = await import(pathToFileURL(path.join(__dirname, '../addons/_lib/connect.js')).href);
  const tl = T.parseLibrary('=== suggestion: Sweet\ntone: praise\n\nGood.\n\n=== suggestion: Rough\ntone: degrade\n\nDumb.\n\n=== suggestion: Plain\n\nHi.\n\n=== suggestion: Odd\ntone: spicy\n\nX.\n');
  ok(tl.blocks[0].labels.tone === 'praise' && tl.blocks[1].labels.tone === 'degrade' && tl.errors.some((e) => /tone is praise or degrade/.test(e.msg)), 'tone: praise or degrade (anything else is a mistake)');
  ok(T.fits(tl.blocks[0], { tone: ['praise'] }) && !T.fits(tl.blocks[0], {}) && !T.fits(tl.blocks[1], { tone: ['praise'] }) && T.fits(tl.blocks[1], { tone: ['degrade', 'praise'] }) && T.fits(tl.blocks[2], {}),
    '...a praise block only reaches somebody with ?praise on, degrade only ?degrade; one with no tone reaches anybody');
  ok(/^tone: praise$/m.test(T.formatBlock(tl.blocks[0])), '...and the studio writes it back');
  const full = T.parseLibrary(STARTER), byKind = {};
  for (const b of full.blocks) byKind[b.kind] = (byKind[b.kind] || 0) + 1;
  ok(!full.errors.length && !full.warnings.length && full.blocks.length >= 120 && byKind.suggestion >= 40 && byKind.session >= 10, 'the starter library, bulked up: no mistakes, ' + full.blocks.length + ' blocks (' + JSON.stringify(byKind) + ')');
  const { CLINICAL } = await import(pathToFileURL(path.join(__dirname, '../tools/lines.mjs')).href);
  const clin = STARTER.split('\n').filter((l) => !/^#/.test(l) && CLINICAL.test(l));
  ok(!clin.length, 'not one clinical word in it (the farm\'s voice): ' + clin.slice(0, 2).join(' | '));
  for (const sp of ['cow', 'bull', 'pony', 'horse', 'pup', 'dog', 'wolf', 'fox', 'kitty', 'cat', 'pig', 'bunny', 'rabbit', 'goat', 'sheep', 'deer', 'rat', 'dragon', 'goblin']) {
    if (!full.blocks.some((b) => b.kind === 'suggestion' && b.labels.for && b.labels.for.includes(sp))) ok(false, 'no suggestion block for ' + sp);
  }
  ok(true, 'every kind of stock has blocks of its own');
  const lineFor = (b, body) => b.lines.filter((l) => fitsBody(l.text, body)).map((l) => l.text);
  const ache = full.blocks.find((b) => b.name === 'The Ache');
  ok(lineFor(ache, { g: 'male', cock: true }).every((t) => !/pussy|tits/.test(t)) && lineFor(ache, { g: 'female', vulva: true, tits: true }).every((t) => !/cock/.test(t)) && lineFor(ache, { g: 'futa', vulva: true, cock: true, tits: true }).some((t) => /cock/.test(t)),
    'each body gets its own lines (a bull never hears about a pussy; a futa hears about both)');
  const udder = T.planSession(full.blocks, { level: 'deep', species: 'cow', tone: ['degrade'] }, { name: 'Udder Worship', rng });
  ok(udder.name === 'Udder Worship' && udder.blocks.some((b) => b.name === 'Dairy Thoughts') && udder.blocks.every((b) => !b.labels.tone || b.labels.tone === 'degrade'), 'a cow who asked for it rough: Udder Worship, no praise blocks in it: ' + udder.blocks.map((b) => b.name).join(', '));
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
