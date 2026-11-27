// PROGRESSIVE RESTRAINTS and THE GEAR THE FARM LEAVES OFF (Nov 26, bot/src/parts/traps/10z9b-gear-build.js). Sera's ideas,
// passed on by Laynie: "traps and wild traps doing 'progressive restraints', which is to say the equipment builds a
// outfit over several traps" and "a way to disable hoods, or certain types of restraints". Laynie: "for the species, or
// atleast themed and complimenting their species and gender", how it comes off "iii toggleable", and "seems good".
const fs = require("fs"), path = require("path");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const BOT = 260239;

(async () => {
  const store = {}, sent = [], handlers = {};
  const person = (mn, name, species, gender, o) => Object.assign({ mn, name, roles: ["LIVESTOCK"], trapsOn: true, species, gender, onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", breedable: true, fertile: true, milkable: true }, o || {});
  store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
    "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] },
    "500": person(500, "Moo", "cow", "female"), "501": person(501, "Ferdinand", "bull", "male", { milkable: false }), "502": person(502, "Dash", "horse", "female"),
    "503": person(503, "Rex", "wolf", "male"), "504": person(504, "Tabby", "cat", "female"), "505": person(505, "Thumper", "bunny", "female"), "506": person(506, "Ember", "dragon", "female"),
  }, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: { pond: { X: 30, Y: 30 } } });
  global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
  const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
  const at = (m, X, Y) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
  const chars = [at(BOT, 1, 1), at(221397, 10, 10), at(500, 15, 10), at(501, 16, 10), at(502, 17, 10), at(503, 18, 10), at(504, 19, 10), at(505, 20, 10), at(506, 21, 10)];
  const B = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
    ServerSend: (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
    Player: { MemberNumber: BOT, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [BOT], MapData: { Type: "Always" } }, ChatRoomCharacter: chars,
    ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} } };
  global.unsafeWindow = B; global.window = B; global.Blob = class {}; global.URL = { createObjectURL() {} };
  const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(" ")) };
  B.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
  await wait(3500);
  const cfg = B.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 2; cfg.TRAP_BEAT_S = 0.05; cfg.TRAP_COOLDOWN_MIN = 0; cfg.CHAIN_CHANCE = 0;
  for (const c of chars.slice(2)) c.Name = { 500: "Moo", 501: "Ferdinand", 502: "Dash", 503: "Rex", 504: "Tabby", 505: "Thumper", 506: "Ember" }[c.MemberNumber];
  chars[1].Name = "Laynie";
  const L = () => B.FarmhandLedger(), P = (mn) => L().people[mn];
  const hid = async (mn, type, data, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) }); await wait(ms || 200); };
  const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Whisper", Content: msg, Target: BOT }); await wait(ms || 1200); };
  const told = (n) => sent.slice(n).map(([, d]) => (d && d.Dictionary && d.Dictionary.type === "relay" ? d.Dictionary.text : d && typeof d.Content === "string" ? d.Content : "")).filter(Boolean).join(" | ");
  const build = (mn) => Object.entries(P(mn).gear || {}).filter(([, g]) => g.src === "build");
  const hello = (mn, o) => hid(mn, "hello", Object.assign({ ver: "0.91.0", relay: true, off: {} }, o || {}));

  // ── their set suits their kind and body ──
  ok(B.__buildKind(500) === "dairy" && B.__buildKind(502) === "pony" && B.__buildKind(503) === "pup" && B.__buildKind(504) === "kitty" && B.__buildKind(505) === "hutch" && B.__buildKind(506) === "rubber",
    'a cow\'s dairy tack, a horse\'s pony tack, a wolf\'s kennel gear, a cat\'s kitty kit, a bunny\'s hutch gear, everybody else rubber');
  const labels = (mn) => B.__buildPieces(mn, B.__buildKind(mn)).map((p) => p.label);
  ok(labels(500).includes("Udder Cups") && !labels(500).includes("Bull Lock") && labels(501).includes("Bull Lock") && !labels(501).includes("Udder Cups"), 'the cow gets udder cups, the bull a lock: it suits their body');
  ok(labels(502).includes("Mare's Tail") && labels(503).includes("Kennel Lock") && labels(500)[0] === "Dairy Collar" && labels(500).slice(-1)[0] === "Heifer Hood", 'a mare\'s tail, a wolf\'s kennel lock; a collar first and the hood last');
  ok(Object.values({ 500: 1, 501: 1, 502: 1, 503: 1, 504: 1, 505: 1, 506: 1 }).length && [500, 501, 502, 503, 504, 505, 506].every((mn) => B.__buildPieces(mn, B.__buildKind(mn)).every((p) => p.label.length <= 28 && p.desc.length <= 180 && /%n/.test(p.say) && !/\(/.test(p.say))),
    'every piece: a name that fits the game, a description that fits, a line about them');

  // ── on: a piece each trap ──
  await hello(500);
  ok(!B.__buildAfterTrap(500, 1) && !build(500).length, 'off till they say so: nothin\'');
  await say(500, "?traps build on");
  ok(P(500).buildOn === true && B.__stateFor(500).switches.buildtraps === true && B.__stateFor(500).buildMode === "both", '?traps build on: on, it shows in their switches, and it comes off whichever-first unless they pick');
  let n = sent.length;
  B.__buildAfterTrap(500, 1); await wait(100);
  ok(build(500).map(([s]) => s).join() === "collar" && /Dairy stock now/.test(told(n)), 'a trap lets go: the first piece, the dairy collar, and a line about it');
  B.__buildAfterTrap(500, 2); await wait(100);
  ok(build(500).map(([s]) => s).sort().join() === "collar,nose,tag", '...a wild trap: two more (the cowbell, the nose ring)');
  const g0 = P(500).gear.collar;
  ok(g0.keep === true && g0.until - Date.now() > 59 * 60000 && g0.until - Date.now() <= 60 * 60000, 'whichever-first: an hour from the last piece, and only somebody else can free them');
  ok((B.__stateFor(500).build || {}).n === 3 && B.__stateFor(500).build.title === "dairy tack", 'their panel: 3 pieces of their dairy tack on');
  // ── the gear they've asked the farm to leave off ──
  await hello(500, { noSlots: ["arms", "hood"] });
  ok(B.__gearBlocked(500, "hood") && !B.__gearBlocked(500, "tag"), 'their Companion says: no arm restraints, no hoods');
  B.__buildAfterTrap(500, 1); await wait(100);
  ok(!P(500).gear.arms && P(500).gear.feet && P(500).gear.feet.src === "build", '...so the set skips the cuffs and goes on to the hobbles');
  // every piece of the set (the hood left off): done
  n = sent.length;
  for (let i = 0; i < 8; i++) B.__buildAfterTrap(500, 1);
  await wait(150);
  ok(P(500).build.done && !P(500).gear.hood && /That's the whole of it/.test(told(n)) && P(500).fitted === 1, 'every piece it can put on: the whole set, a closin\' line (and the hood they left off never came)');
  const before = build(500).length; B.__buildAfterTrap(500, 1);
  ok(build(500).length === before, '...and nothin\' more till it\'s come off');
  // how it comes off, their pick
  await say(500, "?traps build hour");
  ok(P(500).buildMode === "hour" && B.__stateFor(500).buildMode === "hour", '?traps build hour: their pick');
  await say(500, "?traps build off");
  ok(!build(500).length && !P(500).build, '?traps build off: all of it off at once');
  await say(500, "?traps build on");
  B.__buildAfterTrap(500, 1);
  ok(!P(500).gear.collar.keep && P(500).gear.collar.until - Date.now() > 59 * 60000, 'the hour: it comes off an hour after the last piece (and nobody frees them before)');
  await say(500, "?traps build free"); B.__buildAfterTrap(500, 1);
  ok(P(500).gear.collar.keep === true && P(500).gear.collar.until - Date.now() > 24 * 3600000, 'only when somebody else frees them: no hour on it');
  // a trap's own gear never pushes a piece of the set out of its spot
  ok(!B.__gearOn(500, "collar", "Other Collar", "x", 5, "trap", {}) && P(500).gear.collar.label === "Dairy Collar", 'another trap\'s gear doesn\'t push a piece of the set out of its spot');
  ok(!B.__gearOn(500, "hood", "Trap Hood", "x", 5, "trap", {}), 'nor does a hood go on somebody who asked for no hoods, from anywhere');
  // the safeword takes it all off
  await say(500, "?safeword", 2500);
  ok(!build(500).length && !P(500).build, 'the safeword: all of it off');
  // "Farm can put real gear on me" off: nothin'
  await hello(501, { off: { gear: true } }); await say(501, "?traps build on");
  B.__buildAfterTrap(501, 1);
  ok(!build(501).length, '"Farm can put real gear on me" off: no pieces');
  // a trap told through, start to finish: the next piece when it lets go
  await hello(502); await say(502, "?traps build on");
  P(502).trapAt = 0; P(502).penned = null; P(502).trapQuiet = 0; P(502).spotTrapAt = {}; P(502).gear = null;
  n = sent.length;
  handlers.ChatRoomMessage({ Sender: 221397, Type: "Whisper", Content: "?trap spring Dash wire", Target: BOT });
  for (let i = 0; i < 40 && !build(502).length; i++) await wait(150);
  ok(build(502).map(([s]) => s).join() === "collar" && /posture collar/i.test(told(n)), 'a real trap lets Dash go: the first piece of her pony tack');
  ok(!warns.some((w) => /gear build|build/.test(w)), 'no trouble along the way' + (warns.length ? ' (' + warns.slice(0, 2).join(' | ') + ')' : ''));
  out(fails ? "FAIL " + fails : "ALL OK"); process.exit(fails ? 1 : 0);
})();
