// Nov 18, nipples, the rest of it. Laynie: "if the stretching persist after the leeches are removed, it would make since
// to be able to use and fuck them, or creampie them too"; closin' up on their own: "up to the individual player with a
// toggle"; nipple loads: "its own count"; and "need to have a way to reset them".
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const BOT = 260239, ME = 600, OWNER = 700, LOVER = 701;
const H = 3600000, MIN = 60000;

function page() {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [], evs = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 50 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  const C = (mn, name, cock) => ({ MemberNumber: mn, Name: name, Appearance: [], IsPlayer: () => false, HasPenis: () => !!cock });
  w.ChatRoomCharacter = [w.Player, C(OWNER, "Mistress", true), C(LOVER, "Lov"), C(BOT, "Farm Girl")];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function () {}; w.ChatRoomMapViewCanEnterTile = function () { return 100; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ChatRoomMessageRunExtractors = (data) => { const d = data.Dictionary || [], a = d.find((x) => x.ActivityName), t = d.find((x) => typeof x.TargetCharacter === "number"); return { metadata: { ActivityName: a && a.ActivityName, TargetMemberNumber: t && t.TargetCharacter }, substitutions: [] }; };
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.addEventListener("farmhand-dispensary", (e) => evs.push(e.detail));
  w.eval(src);
  const charOf = (mn) => w.ChatRoomCharacter.find((c) => c.MemberNumber === mn);
  const needle = (by, name) => { const c = charOf(by); c.Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: "" } }];
    w.ChatRoomMessage({ Type: "Activity", Sender: by, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] }); };
  const hidden = (from, type, data) => w.ChatRoomMessage({ Type: "Hidden", Sender: from, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) });
  const msgs = (type, to) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Dictionary.type === type && (to === undefined || d.Target === to)).map(([, d]) => d.Dictionary);
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text || "");
  const cmd = (a) => { const c = cmds.find((x) => x.Tag === "dispensary"); c.Action(a); };
  return { w, sent, local, evs, needle, hidden, msgs, actions, cmd, D: () => w.__disp };
}

(async () => {
  const s = page(); await wait(1300);
  const D = s.D(), w = s.w;
  D.nipsAddOwn();
  let now = Date.now();
  const step = (hours) => { const n = Math.round(hours * 4); for (let i = 0; i < n; i++) { now += 15 * MIN; D.nipsTrain(now); } };

  // the leeches hold them open a day: they train to stay that way
  D.st().parasites = { nips: true };
  D.latch("nips", { by: OWNER, name: "Mistress" });
  ok(D.nips() === 2 && D.trained() === 0, "the leeches hold them open, two wide; nothin' trained yet");
  step(1);
  ok(D.trained() === 0, "an hour held open: not yet trained to stay");
  step(11);
  ok(D.trained() === 2, "twelve hours held open: trained to stay two wide (" + JSON.stringify(D.nipsState().train) + ")");
  D.para(); delete D.st().para.nips;
  ok(D.nips() === 2 && D.nipsOf(ME) === 2, "the leeches gone: still open two wide, so they can still be fucked and filled");
  ok(w.ActivityCheckPrerequisite("FarmDispNipsOpen", s.w.ChatRoomCharacter[1], w.Player) === true, "...and the game's action menu still offers it");

  // they close up slowly on their own, if you've left that switch on (it starts on)
  step(11);
  ok(D.trained() === 2, "left be under twelve hours: still two wide");
  step(13 + 24);
  ok(D.trained() === 1, "a day and a half after that: closed up half a step a day, down to one (" + D.nipsState().train.lvl.toFixed(2) + ")");
  D.st().nipsHeal = false; step(72);
  ok(D.trained() === 1, "with the switch off: three days later, still one wide");
  D.nipsUsed(OWNER, "cock"); D.nipsUsed(OWNER, "cock"); D.nipsUsed(OWNER, "cock"); D.nipsUsed(OWNER, "cock");
  ok(D.trained() === 1 && D.nipsState().train.lvl > 1.5, "every fuckin' trains them a little wider (" + D.nipsState().train.lvl.toFixed(2) + ")");

  // closin' them back up: the command, the page's button, the balm
  let n = s.local.length; s.cmd("nips");
  ok(/open, 1 wide/.test(s.local.slice(n).join(" ")) && /stay as they're trained/.test(s.local.slice(n).join(" ")), "/dispensary nips: how they are (" + s.local.slice(n).join(" ").slice(0, 160) + ")");
  s.cmd("nips heal on");
  ok(D.st().nipsHeal === true, "/dispensary nips heal on: the switch");
  n = s.local.length; s.cmd("nips close");
  ok(D.nips() === 0 && D.trained() === 0 && /close up again/.test(s.local.slice(n).join(" ")), "/dispensary nips close: snug as they ever were");
  s.needle(OWNER, "Nipple Dilator x3"); D.st().parasites = { nips: true }; D.latch("nips", { by: OWNER, name: "Mistress" }); step(12);
  ok(D.nips() === 3 && D.trained() >= 2, "opened right up again (" + D.nips() + ", trained " + D.trained() + ")");
  s.needle(LOVER, "Tightening Balm");
  ok(D.nips() === 0 && !D.active("dilator") && !D.para().nips && D.trained() === 0, "a Tightening Balm: the dilator out, the leeches off, the stretch undone");
  ok(s.actions().some((a) => /tightening balm/i.test(a) && /closed|snug/.test(a)), "...and the room hears it");
  ok(s.evs.some((e) => e.type === "nips" && e.from === ME && e.n === 0), "the Companion's told when they close (so it draws them closed)");

  // creampies: somebody who was just in her nipple cums
  D.st().nipsHeal = false; s.needle(OWNER, "Nipple Dilator x2");
  D.nipsUsed(OWNER, "cock"); n = s.sent.length;
  s.hidden(OWNER, "dispCream", {});
  ok(D.nipLoads().n === 1 && D.nipLoads().by[OWNER] === 1, "Mistress cums in her nipple: a load of its own count (" + JSON.stringify(D.nipLoads()) + ")");
  ok(s.actions().slice(-1)[0] && /Mistress/.test(s.actions().slice(-1)[0]) && /nipple|tit/.test(s.actions().slice(-1)[0]), "...the room sees it well back out (" + s.actions().slice(-1)[0] + ")");
  ok(s.evs.some((e) => e.type === "leak" && e.mess === "cum" && e.areas.includes("chest")), "...cum on her chest, for the Companion to draw");
  ok(s.msgs("dispNipLoad", BOT).some((m) => m.by === OWNER), "...and the farm girl's told, for her own count");
  s.hidden(LOVER, "dispCream", {});
  ok(D.nipLoads().n === 1, "somebody who wasn't in her nipple can't say they came in it");
  // and the other way round: she fucks Mistress's nipple and cums
  w.Player.HasPenis = () => true;
  w.ServerSend("ChatRoomChat", { Type: "Activity", Content: "ChatOther-ItemNipples-FarmDisp_NippleFuck", Dictionary: [{ SourceCharacter: ME }, { TargetCharacter: OWNER }, { Tag: "FocusAssetGroup", FocusGroupName: "ItemNipples" }, { ActivityName: "FarmDisp_NippleFuck" }] });
  n = s.local.length; D.nipsClimax();
  ok(s.msgs("dispCream", OWNER).length === 1 && /Mistress/.test(s.local.slice(n).join(" ")), "she cums right after fuckin' Mistress's nipple: Mistress's Dispensary is told, and she feels it");
  D.nipsClimax();
  ok(s.msgs("dispCream", OWNER).length === 1, "...once (the next climax isn't another load in it)");

  // ── the farm girl: her own count, and it comes back out with the milk ──
  {
    const store = {}, sentB = [], handlers = {};
    const S = (mn, name, extra) => Object.assign({ mn, name, roles: ["LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", milkable: true }, extra || {});
    store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: { "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] }, "600": S(600, "Hana"), "700": S(700, "Rex", { gender: "male" }) }, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
    global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
    const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
    const at = (m) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } });
    const B = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
      ServerSend: (ev, d) => sentB.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
      Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [260239] }, ChatRoomCharacter: [at(260239), at(221397), at(600), at(700)],
      ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} } };
    B.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
    global.unsafeWindow = B; global.window = B; global.Blob = class {}; global.URL = { createObjectURL() {} };
    const warns = []; const keep = global.console; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(" ")) };
    B.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
    await wait(3500); B.__cfg.USER_COOLDOWN_S = 0; B.__cfg.SEND_INTERVAL_MS = 2;
    const hid = async (mn, type, data) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) }); await wait(300); };
    const p = B.__prodOf(600);
    await hid(600, "dispNipLoad", { by: 700 }); await hid(600, "dispNipLoad", { by: 700 });
    ok(p.totals.nipLoads === 2 && p.totals.nipBy[700] === 2 && p.nipCream && p.nipCream.n === 2, "the farm girl keeps her own count of loads in the tits, and whose");
    ok(!p.totals.loads, "...not counted with her other loads");
    let m = sentB.length; p.milk = 800; B.__drainMilk(600, 300);
    const said = JSON.stringify(sentB.slice(m));
    ok(/N700's|Rex's/.test(said) && /milk/i.test(said) && !p.nipCream, "milked: it comes back out creamy, and whose seed it was (" + (said.match(/🥛[^"]{0,140}/) || [""])[0] + ")");
    m = sentB.length; handlers.ChatRoomMessage({ Sender: 600, Type: "Chat", Content: "?stats" }); await wait(800);
    ok(/Loads taken in the tits: 2/.test(JSON.stringify(sentB.slice(m))), "?stats shows it");
    const errs = warns.filter((x) => /TypeError|ReferenceError/i.test(x) && !/Worker/.test(x)); ok(!errs.length, "no errors in the bot " + errs.join(" | ").slice(0, 200));
    global.console = keep;
  }
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
