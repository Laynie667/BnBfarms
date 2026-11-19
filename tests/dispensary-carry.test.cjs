// CARRYIN' ANYWHERE (Nov 19). Laynie: "I want to be the best baby factory wherever I go", then "all of them, non
// clinical language please, make it hot and sexy". The farm tells her Dispensary what she's carryin'; she feels it
// anywhere, her heat comes on where she is, her labour and her clutch happen where she is (with a midwife if anybody
// helps), the farm books them next time, she's wide open after, a Quickening Draught hurries it, and a Breeder's Scan
// tells the room what's in there.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700, LOVER = 701, BOT = 260239, MIN = 60000, HOUR = 3600000, DAY = 86400000;

async function boot(settings) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], events = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: settings || {}, Ownership: { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, HasVagina: () => true, Appearance: [], PoseMapping: { BodyLower: "BaseLower" } };
  w.ChatRoomCharacter = [w.Player, { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true }, { MemberNumber: LOVER, Name: "Rex", Appearance: [], IsPlayer: () => false, HasPenis: () => true }];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = () => {}; w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function (C, n) { C.ArousalSettings.Progress = n; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {}; w.ChatRoomMapViewCanEnterTile = function () { return 1; };
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.InventoryPrerequisiteMessage = () => "";
  w.addEventListener("farmhand-dispensary", (e) => events.push(e.detail));
  w.eval(src); await wait(1300);
  return { w, sent, local, events, D: w.__disp };
}
const room = (sent, from) => sent.slice(from || 0).filter(([e, d]) => e === "ChatRoomChat" && d && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text).join(" | ");
const crafted = (group, asset, name, desc, by, byName) => ({ Asset: { Name: asset, Group: { Name: group }, Description: asset }, Craft: { Name: name, Description: desc || "", MemberNumber: by, MemberName: byName || "" }, Property: {} });
const welcome = (w, carry) => w.ChatRoomMessage({ Type: "Hidden", Sender: BOT, Content: "FarmhandMsg", Dictionary: { v: 2, type: "dispWelcome", farm: [BOT], carry } });

(async () => {
  let { w, sent, local, events, D } = await boot();
  const now = Date.now();
  welcome(w, { preg: { since: now - 4 * DAY, due: now + 1 * DAY, count: 3, sires: ["Bo"] }, eggs: null, heat: { until: 0, next: 0 }, open: 0, litters: 4, one: "calf", many: "calves" });
  await wait(20);
  let K = D.carry();
  ok(K.carrying && K.carrying.count === 3 && K.carrying.stage === "heavy" && /Bo/.test(K.carrying.sires.join()), "the farm tells her Dispensary: three calves, Bo's, heavy and close (" + JSON.stringify(K.carrying) + ")");
  ok(D.bellyAll() >= 2 && w.FarmhandDispensary.seedBelly() === D.bellyAll(), "...her drawn belly's round with them, anywhere, by the farm's own sum (" + D.bellyAll() + ")");
  // she feels it
  D.carryFeelNow(); D.carryTick(Date.now()); local.length = 0; let n = sent.length; D.carryFeelNow(); D.carryTick(Date.now() + 1000);
  ok(local.some((l) => /belly|kick|heavy|tits|nipples|milk/i.test(l)) && /waddle|kick|heavy|belly/i.test(room(sent, n)), "she feels them heavy and kickin', and the room sees it (" + local.join(" / ").slice(0, 120) + ")");
  ok(events.some((e) => e.type === "leak" && e.mess === "milk"), "...and her tits leak, for the Companion to draw");
  ok(local.some((l) => /seed|load|cock/i.test(l)), "...and she craves seed");

  // ── labour, where she is ──
  welcome(w, { preg: { since: now - 5 * DAY, due: now - 10 * MIN, count: 3, sires: ["Bo"] }, eggs: null, heat: { until: 0, next: 0 }, open: 0, litters: 4, one: "calf", many: "calves" });
  await wait(20);
  n = sent.length; D.carryTick(Date.now());
  ok(D.carry().labour && /waters|gush|time|comin'/i.test(room(sent, n)), "due, away from the farm: her waters break right where she is (" + room(sent, n).slice(0, 120) + ")");
  n = sent.length;
  w.ChatRoomMessage({ Type: "Activity", Sender: LOVER, Content: "ChatOther-ItemPelvis-Caress", Dictionary: [{ SourceCharacter: LOVER }, { TargetCharacter: ME }, { FocusGroupName: "ItemPelvis" }, { ActivityName: "Caress" }] });
  await wait(20);
  ok(D.carry().labour.midwife === "Rex" && /Rex/.test(room(sent, n)), "Rex rubs her belly through a wave: he's her midwife");
  const L0 = D.st().labour; n = sent.length;
  D.carryTick(L0.next + 1);
  ok(/wave|push|belly|crownin'/i.test(room(sent, n)), "the waves come, and the room hears every one");
  n = sent.length; D.carryTick(L0.until + 1);
  ok(D.st().born && D.st().born.midwife === LOVER && /3 calves/.test(room(sent, n)) && /Rex/.test(room(sent, n)), "she delivers there: 3 calves, Bo's, into Rex's hands (" + room(sent, n).slice(0, 160) + ")");
  ok(D.bellyAll() < 2 && !D.carry().carrying, "...her belly's soft again");
  ok(D.carry().open > Date.now(), "...and she's wide open for the hour after");
  // the farm gets it in her hello
  w.ChatRoomCharacter.push({ MemberNumber: BOT, Name: "Farm Girl", Appearance: [], IsPlayer: () => false });
  n = sent.length; w.ChatRoom && 0; D.st().off = D.st().off || {};
  const helloAll = () => sent.slice(n).map(([, d]) => d).filter((d) => d && d.Content === "FarmhandMsg" && d.Dictionary.type === "dispHello");
  w.ChatRoomSync(); await wait(2700);
  const hl = helloAll().pop();
  ok(hl && hl.Dictionary.born && hl.Dictionary.born.midwife === LOVER && hl.Dictionary.born.n === 3, "in the farm girl's room, her hello carries the birth for the books");
  welcome(w, { preg: null, eggs: null, heat: { until: 0, next: 0 }, open: Date.now() + 50 * MIN, litters: 5, one: "calf", many: "calves", bornSeen: D.st().born.at });
  await wait(20);
  ok(!D.st().born && D.carry().litters === 5, "she's booked it: the birth's off the list, five litters now");
  w.ChatRoomCharacter.pop();

  // ── eggs, where she is ──
  welcome(w, { preg: null, eggs: { n: 6, layAt: Date.now() - MIN, by: "Smaug" }, heat: { until: 0, next: 0 }, open: 0, litters: 5, one: "calf", many: "calves" });
  await wait(20);
  n = sent.length; D.carryTick(Date.now());
  ok(D.st().laying && /egg|squat/i.test(room(sent, n)), "a clutch that's ready: she squats right where she is");
  let t = Date.now();
  for (let i = 0; i < 6 && !D.st().laid; i++) { t = D.st().laying.next + 1; D.carryTick(t); }
  ok(D.st().laid && D.st().laid.n === 6 && /6 eggs/.test(room(sent, n)), "...one slick egg at a time, six in all (" + room(sent, n).slice(-120) + ")");

  // ── heat comes on where she is ──
  D.carryReset();
  welcome(w, { preg: null, eggs: null, heat: { until: 0, next: Date.now() - MIN }, open: 0, litters: 5, one: "calf", many: "calves" });
  await wait(20);
  n = sent.length; D.carryTick(Date.now());
  ok(D.active("heat") && /heat/i.test(room(sent, n)), "her natural heat comes on, right where she is (" + room(sent, n).slice(0, 100) + ")");
  n = sent.length; D.carryTick(Date.now() + MIN);
  ok(!/comes into heat|hits/.test(room(sent, n)), "...once");

  // ── the Quickening Draught ──
  D.carryReset();
  welcome(w, { preg: { since: Date.now() - DAY, due: Date.now() + 4 * DAY, count: 2, sires: ["Rex"] }, eggs: null, heat: { until: 0, next: 0 }, open: 0, litters: 5, one: "pup", many: "pups" });
  await wait(20);
  const due0 = D.carry().carrying.due; n = sent.length;
  D.give("quicken", { by: LOVER, x: 2 });
  ok(D.carry().carrying.due <= due0 - 2 * DAY + 1000 && /belly|swell|grow/i.test(room(sent, n)), "a double Quickening Draught: two days closer, and her belly swells with it");
  ok(D.st().quick === 2, "...and the farm girl gets it with her loads next time");
  D.carryReset(); welcome(w, { preg: null, eggs: null, heat: { until: 0, next: 0 }, open: 0, litters: 5 }); await wait(20);
  n = sent.length; const rq = D.give("quicken", { by: LOVER });
  ok(!rq.ok && /nothin'/i.test(room(sent, n)), "nothin' in her to hurry: it says so");

  // ── the Breeder's Scan ──
  welcome(w, { preg: { since: Date.now() - DAY, due: Date.now() + 4 * DAY, count: 2, sires: ["Rex"] }, eggs: null, heat: { until: 0, next: 0 }, open: 0, litters: 5, one: "pup", many: "pups" });
  await wait(20);
  ok(D.dosesIn("breeder's scan").some((d) => d.id === "scan") && D.dosesIn("womb-scanner").some((d) => d.id === "scan"), "Breeder's Scan, Womb Scanner: the scan's words");
  n = sent.length;
  w.ChatRoomCharacter[1].Appearance = [crafted("ItemHandheld", "MedicalInjector", "Breeder's Scan", "", OWNER, "Mistress")];
  w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] });
  await wait(20);
  ok(/2 heartbeats|carryin' 2|2 in there/.test(room(sent, n)) && /Rex's/.test(room(sent, n)) && /days/.test(room(sent, n)), "Mistress scans her: the room hears two in there, Rex's, and how long to go (" + room(sent, n).slice(0, 160) + ")");
  n = sent.length;
  w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "ChatOther-ItemPelvis-Caress", Dictionary: [{ SourceCharacter: OWNER }, { TargetCharacter: ME }, { FocusGroupName: "ItemPelvis" }, { ActivityName: "Caress" }] });
  await wait(20);
  ok(/Rex's/.test(room(sent, n)), "...or with it in her hand, a touch on the belly scans too");

  // ── it's kept ──
  await wait(1700);
  ({ w, sent, local, events, D } = await boot(Object.assign({}, w.Player.ExtensionSettings)));
  ok(D.carry().carrying && D.carry().carrying.count === 2, "after a reload, she's still carryin' what the farm last said");

  out(fails ? fails + " FAILED" : "all passed");
  process.exit(fails ? 1 : 0);
})();
