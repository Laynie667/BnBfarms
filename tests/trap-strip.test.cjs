// TRAPS TAKE CLOTHES (Nov 26, bot/src/parts/traps/10z9-trap-strip.js). Laynie: "traps should be more liberal with stripping
// clothing, like for penetrative events or ones that mention stripping"; then "yes": everything for a line that strips them,
// whatever's in the way for somethin' goin' into them, the top for udders and nipples, bare till they dress themselves,
// and a line when it happens.
const fs = require("fs"), path = require("path");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const BOT = 260239;

(async () => {
  const store = {}, sent = [], handlers = {};
  store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
    "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] },
    "500": { mn: 500, name: "Moo", roles: ["LIVESTOCK"], trapsOn: true, species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", breedable: true, fertile: true, milkable: true },
  }, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: { pond: { X: 30, Y: 30 } } });
  global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
  const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
  const at = (m, X, Y) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
  const chars = [at(BOT, 1, 1), at(221397, 10, 10), at(500, 15, 10)];
  const B = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
    ServerSend: (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
    Player: { MemberNumber: BOT, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [BOT], MapData: { Type: "Always" } }, ChatRoomCharacter: chars,
    ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} } };
  global.unsafeWindow = B; global.window = B; global.Blob = class {}; global.URL = { createObjectURL() {} };
  const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(" ")) };
  B.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
  await wait(3500);
  const cfg = B.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 2; cfg.TRAP_BEAT_S = 0.05; cfg.TRAP_COOLDOWN_MIN = 0; cfg.CHAIN_CHANCE = 0;
  chars[1].Name = "Laynie"; chars[2].Name = "Moo";
  const L = () => B.FarmhandLedger(), P = (mn) => L().people[mn];
  const hid = async (mn, type, data, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) }); await wait(ms || 200); };
  const marks = (n) => sent.slice(n).filter(([e, d]) => d && d.Type === "Hidden" && d.Target === 500 && d.Dictionary && d.Dictionary.type === "mark" && d.Dictionary.strip != null).map(([, d]) => d.Dictionary.strip);
  const cloth = (group, name, desc, locked) => ({ Asset: { Name: name, Description: desc, Group: { Name: group, Clothing: true } }, Property: locked ? { LockedBy: "MetalPadlock" } : {} });
  const dress = () => { chars[2].Appearance = [cloth("ClothLower", "Jeans1", "Jeans"), cloth("Panties", "Panties1", "Panties"), cloth("Bra", "Bra1", "Bra"), cloth("Shoes", "Shoes1", "Shoes"), cloth("Cloth", "TShirt1", "T-Shirt"),
    cloth("HairAccessory1", "Ears1", "Cow Ears"), { Asset: { Name: "HempRope", Description: "Rope", Group: { Name: "ItemArms", Clothing: false } }, Property: {} }]; };
  const part = B.__trapStripPart, line = B.__trapStripLine;

  // ── which lines take what (the line as written: %n the one in the trap, %h the hole it's usin') ──
  ok(part("He sinks his %c cock into %n's %h a hand's width at a time.") === "lower" && part("The thing in the corn leaves %n bred in the dirt.") === "lower" && part("Each egg lands inside them with a heavy little bump.") === "lower",
    'somethin\' goin\' into them: the bottoms');
  ok(part("Suckers latch onto both of %n's nipples and pull.") === "top" && part("%n's teats are pinched and pulled till they're drippin'.") === "top", 'their nipples or teats bein\' used: the top');
  ok(part("Every hook finds a seam, and %n's clothes leave in six directions at once.") === "all" && part("It eats their clothes a thread at a time.") === "all" && part("%n stands there naked and goosefleshed.") === "all"
    && part("A third coil peels their clothes down to the ankles.") === "all", 'a line that says clothes come off: everything');
  ok(!part("The plow bites the dirt and starts to move.") && !part("%n slides down on their knees into a long tin trough.") && !part("The light at the top of the well is a long way off now.")
    && !part("%n's clothes are rucked up and pulled aside and hangin' off them.") && !part("The needle sinks into %n to the hub.") && !part("%n's face is squashed between a pair of huge tits while she pumps them full.")
    && !part("Fingers sink deep into %n's warm fleece.") && !part("The dairy girl's own stripping cups, cold steel.") && !part("He pushes himself into %n's mouth and holds them there."),
    'never: a plow, a trough, the top of a well, clothes only pushed aside, a needle, somebody else\'s tits, their fleece, the dairy\'s strippin\' cups, their mouth alone');

  // ── on Moo (her Companion has "Farm can strip me" on) ──
  dress();
  await hid(500, "hello", { ver: "0.90.0", relay: true, off: {} });
  let n = sent.length, run = {};
  const l1 = line(500, "breeder", "He sinks his %c cock into %n's %h a hand's width at a time.", run);
  ok(/^ Moo's /.test(l1) && /jeans/.test(l1) && /\?/.test(l1) && !/%/.test(l1), 'somethin\' goes into her: a line namin\' what went: ' + l1);
  await wait(100);
  ok(marks(n).join() === "lower", '...and her Companion\'s told to take the bottoms (and whatever covers them)');
  ok(line(500, "breeder", "He breeds %n in long rollin' thrusts.", run) === "", '...once per trap');
  n = sent.length;
  const l2 = line(500, "breeder", "Suckers latch onto both of %n's nipples and pull.", run);
  await wait(100);
  ok(/bra/i.test(l2) && marks(n).join() === "top", 'then her nipples: the top too: ' + l2);
  n = sent.length;
  const l3 = line(500, "wire", "Every hook finds a seam, and %n's clothes leave in six directions at once.", {});
  await wait(100);
  ok(/Moo/.test(l3) && marks(n).join() === "true", 'a line that strips her: everything: ' + l3);
  // only what's really there, unlocked, and never ears
  ok(B.__stripWorn(chars[2], "all").map((it) => it.Asset.Name).sort().join() === "Bra1,Jeans1,Panties1,Shoes1,TShirt1", 'every stitch: clothes only, never her ears or the rope');
  chars[2].Appearance = [cloth("ClothLower", "Skirt1", "Skirt", true)];
  n = sent.length;
  ok(line(500, "breeder", "He sinks into %n's %h.", {}) === "" && (await wait(100), !marks(n).length), 'nothin\' unlocked in the way (a padlocked skirt): no line, nothin\' sent');
  dress();
  // who it never happens to
  await hid(500, "hello", { ver: "0.90.0", relay: true, off: { strip: true } });
  ok(line(500, "breeder", "He sinks into %n's %h.", {}) === "", '"Farm can strip me" switched off: nothin\'');
  await hid(500, "hello", { ver: "0.89.1", relay: true, off: {} });
  ok(line(500, "breeder", "He sinks into %n's %h.", {}) === "", 'an older Companion (it only knows "everything"): nothin\'');
  await hid(500, "hello", { ver: "0.90.0", relay: true, off: {} });
  P(500).limits = "no stripping please";
  ok(line(500, "breeder", "He sinks into %n's %h.", {}) === "", 'strippin\' in her trap limits: never');
  P(500).limits = "";
  ok(!warns.some((w) => /trap strip/.test(w)), '(no trouble along the way)');
  // ── a trap told through: the strip line rides on its own ──
  P(500).trapAt = 0; P(500).penned = null; P(500).trapQuiet = 0; P(500).spotTrapAt = {}; P(500).gear = null; dress();
  n = sent.length;
  handlers.ChatRoomMessage({ Sender: 221397, Type: "Whisper", Content: "?trap spring Moo wire", Target: BOT });
  for (let i = 0; i < 40 && !marks(n).length; i++) await wait(150);
  await wait(300);
  // (the trap's lines: as emotes, or relayed through her own Companion as hers)
  const told = sent.slice(n).map(([, d]) => (d && d.Dictionary && d.Dictionary.type === "relay" ? d.Dictionary.text : d && typeof d.Content === "string" && /^\(?\*/.test(d.Content) ? d.Content : "")).filter(Boolean).join(" | ");
  const said = /\? (Yanked|Gone|Torn|Dragged|Pulled)|Every stitch|clothes are gone|Nothin' of Moo's clothes/.test(told);
  ok(marks(n).length && /Moo/.test(told) && !warns.some((w) => /trap strip|trap wire/.test(w)), 'the wire trap, told through: her clothes come off (' + marks(n).join() + ')' + (said ? ', with the line about it' : ''));
  out(fails ? "FAIL " + fails : "ALL OK"); process.exit(fails ? 1 : 0);
})();
