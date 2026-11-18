// Nov 18: Laynie's three from Nov 17 ("Id also would love a effect that makes every load take ~ for hyper pregnancy
// reasons. and maybe a nipple dialator effect and parasite that makes nipples fuckable as a real action?"):
// the Sure-Catch Serum, the Nipple Dilator, the nipple leeches, and the real Fuck nipple / Finger nipple actions, with
// LSCG and without. A pretend game page runs dist/farmhand-dispensary.user.js as player 600 (Hana); then the farm girl.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const BOT = 260239, ME = 600, OWNER = 700, LOVER = 701;

function page(opts) {
  opts = opts || {};
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
  w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true;
  w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 50 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  const C = (mn, name, cock) => ({ MemberNumber: mn, Name: name, Appearance: [], IsPlayer: () => false, HasPenis: () => !!cock });
  w.ChatRoomCharacter = [w.Player, C(OWNER, "Mistress", true), C(LOVER, "Lov", false), C(221397, "Laynie")];
  if (opts.bot) w.ChatRoomCharacter.push(C(BOT, "Farm Girl"));
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = () => {}; w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  const game = {};
  w.ChatRoomMessage = function () {};
  w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function (C2, A, Z, P) { game.timer = P; };
  w.ActivitySetArousal = function () {};
  w.ChatRoomMapViewCanEnterTile = function () { return 100; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ChatRoomMessageRunExtractors = (data) => { const d = data.Dictionary || [], a = d.find((x) => x.ActivityName), t = d.find((x) => typeof x.TargetCharacter === "number"); return { metadata: { ActivityName: a && a.ActivityName, TargetMemberNumber: t && t.TargetCharacter }, substitutions: [] }; };
  // the game's action list, as the Dispensary finds it
  w.ActivityFemale3DCG = [{ Name: "Suck", Target: ["ItemNipples"] }]; w.ActivityFemale3DCGOrdering = ["Suck"];
  w.ActivityCheckPrerequisite = function () { return "game"; };
  w.ActivityDictionaryText = function (k) { return "MISSING TEXT " + k; };
  w.PreferenceGetActivityFactor = function () { return 0; };
  if (opts.lscg) w.LSCG_OnLoad = { push: (cb) => cb(opts.lscg) }, w.LSCG = { version: "0.9.9" };
  w.eval(src);
  const charOf = (mn) => w.ChatRoomCharacter.find((c) => c.MemberNumber === mn);
  const needle = (by, name) => {
    const c = charOf(by); c.Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: "" } }];
    w.ChatRoomMessage({ Type: "Activity", Sender: by, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] });
  };
  const hidden = (from, type, data) => w.ChatRoomMessage({ Type: "Hidden", Sender: from, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) });
  const msgs = (type, to) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Dictionary.type === type && (to === undefined || d.Target === to)).map(([, d]) => d.Dictionary);
  const act = (from, to, name, grp) => w.ChatRoomMessage({ Type: "Activity", Sender: from, Content: "ChatOther-" + (grp || "ItemNipples") + "-" + name, Dictionary: [{ SourceCharacter: from }, { TargetCharacter: to }, { Tag: "FocusAssetGroup", FocusGroupName: grp || "ItemNipples" }, { ActivityName: name }] });
  return { w, sent, local, game, needle, hidden, msgs, act, charOf, D: () => w.__disp };
}

(async () => {
  // ── without LSCG: the actions go in the game's own list ──
  const s = page({ bot: true }); await wait(1300);
  const D = s.D(), w = s.w, P = w.Player, Mistress = s.charOf(OWNER), Lov = s.charOf(LOVER);
  ok(D.nipsAddOwn() && D.nipsState().mode === "own", "no LSCG: the Dispensary adds the nipple actions to the game itself");
  const names = w.ActivityFemale3DCG.map((a) => a.Name);
  ok(names.includes("FarmDisp_NippleFuck") && names.includes("FarmDisp_NippleFinger") && w.ActivityFemale3DCGOrdering.includes("FarmDisp_NippleFuck"), "...Fuck nipple and Finger nipple, in the game's action list");
  const fuckA = w.ActivityFemale3DCG.find((a) => a.Name === "FarmDisp_NippleFuck"), fingA = w.ActivityFemale3DCG.find((a) => a.Name === "FarmDisp_NippleFinger");
  ok(fuckA.Target.join() === "ItemNipples" && fuckA.Prerequisite.includes("ZoneNaked") && fuckA.Prerequisite.includes("FarmDispNipsOpen") && fuckA.Prerequisite.includes("FarmDispHasCock") && !fuckA.TargetSelf,
    "...on the nipples, bare ones, open ones, with a cock; not on yourself");
  ok(fingA.Prerequisite.includes("UseHands") && fingA.TargetSelf && fingA.TargetSelf.join() === "ItemNipples", "...the finger needs free hands, and you can do it to your own");
  ok(w.ActivityDictionaryText("Label-ChatOther-ItemNipples-FarmDisp_NippleFuck") === "Fuck nipple" && /^MISSING/.test(w.ActivityDictionaryText("Label-ChatOther-ItemArms-Pinch")), "...with their own words in the menu, and the game's left as they were");
  ok(w.PreferenceGetActivityFactor(P, "FarmDisp_NippleFuck", false) === 2 && w.PreferenceGetActivityFactor(P, "Spank", false) === 0, "...rated neutral, like LSCG's own");
  const can = (who, acted) => w.ActivityCheckPrerequisite("FarmDispNipsOpen", who, acted, { Name: "ItemNipples" });
  ok(can(Mistress, P) === false && w.ActivityCheckPrerequisite("UseHands", Mistress, P) === "game", "her nipples shut: not offered (and the game's own checks are left alone)");

  // the Nipple Dilator
  s.needle(OWNER, "Nipple Dilator x2");
  ok(D.active("dilator") && D.nips() === 2, "the Nipple Dilator: open, two wide for a double dose");
  ok(can(Mistress, P) === true && w.ActivityCheckPrerequisite("FarmDispHasCock", Mistress, P) === true && w.ActivityCheckPrerequisite("FarmDispHasCock", Lov, P) === false, "...now offered: Fuck nipple to somebody with a cock, Finger nipple to anybody");
  D.nipsTell(false);
  ok(s.msgs("dispNips").some((m) => m.n === 2), "...and the room's Dispensaries are told hers are open (2)");
  w.ActivitySetArousalTimer(P, {}, "ItemNipples", 10);
  ok(s.game.timer === 20, "...touches there count double");
  // a real action, sent: the line goes with it, names in
  w.ServerSend("ChatRoomChat", { Type: "Activity", Content: "ChatOther-ItemNipples-FarmDisp_NippleFuck", Dictionary: [{ SourceCharacter: ME }, { TargetCharacter: OWNER }, { Tag: "FocusAssetGroup", FocusGroupName: "ItemNipples" }, { ActivityName: "FarmDisp_NippleFuck" }] });
  const tag = s.sent[s.sent.length - 1][1].Dictionary.find((x) => /^MISSING TEXT IN/.test(String(x.Tag)));
  ok(tag && tag.Text === "Hana pushes into Mistress's stretched-open nipple, slow and deep, and fucks it.", "sendin' one: the chat line travels with it, names filled in, for people without the Dispensary (" + (tag && tag.Text) + ")");
  // done to her
  let n = s.local.length;
  s.act(OWNER, ME, "FarmDisp_NippleFuck");
  ok(s.local.slice(n).some((t) => /Mistress/.test(t) && /nipple/.test(t)), "Mistress fucks her nipple: a line only she sees (" + s.local.slice(n).join(" ") + ")");
  // somebody else's
  ok(can(P, Mistress) === false, "Mistress's own nipples: shut, so nothin's offered on her");
  s.hidden(OWNER, "dispNips", { n: 3 });
  ok(can(P, Mistress) === true && D.nipsOf(OWNER) === 3, "...till her Dispensary tells the room they're open");
  s.hidden(OWNER, "dispNips", { n: 0 });
  ok(can(P, Mistress) === false, "...and shut again when they close");
  D.end("dilator"); D.nipsTell(false);
  ok(D.nips() === 0 && s.msgs("dispNips").slice(-1)[0].n === 0, "the dilator wears off: shut, and the room's told once");
  let before = s.msgs("dispNips").length; D.nipsTell(false);
  ok(s.msgs("dispNips").length === before, "...and not again while they stay shut");

  // crafted nipple gear that says dilator keeps it in
  P.Appearance.push({ Asset: { Name: "NippleClamp", Group: { Name: "ItemNipples" } }, Craft: { Name: "Nipple Dilator", MemberNumber: OWNER, MemberName: "Mistress" } });
  D.wornTick();
  ok(D.active("dilator") && D.nips() >= 1, "crafted nipple gear that says dilator: open while it's worn");
  P.Appearance = []; D.end("dilator");

  // the nipple leeches
  D.st().parasites = { nips: true, lips: true };
  P.Appearance.push({ Asset: { Name: "NippleSuctionCups", Group: { Name: "ItemNipples" } }, Craft: { Name: "Nipple Parasite", Description: "Needy Nectar", MemberNumber: OWNER, MemberName: "Mistress" } });
  D.paraTick();
  ok(D.para().nips && !D.para().lips, "a crafted nipple parasite: the leeches latch on (not the parasite lips, though those are on too)");
  ok(D.nips() === 2, "...and hold her nipples open, two wide");
  P.Appearance = [];
  const tb = s.sent.length;
  D.nipsUsed(OWNER, "cock");
  ok(D.para().nips.n === 1 && D.active("needy"), "a cock in her nipple: the leeches feed, and pass her their strain (Needy Nectar)");
  D.nipsUsed(OWNER, "cock"); n = s.local.length; D.nipsUsed(OWNER, "finger");
  ok(D.nips() === 3 && s.local.slice(n).some((t) => /wider|opened your nipples right up/i.test(t)), "fed three times: wider still (3)");
  D.suckled(LOVER);
  ok(s.msgs("dispPara", LOVER).some((m) => m.kind === "nips"), "somebody suckles her: the leeches can go across to them");
  s.act(OWNER, ME, "Suck");
  ok(s.msgs("dispPara", OWNER).some((m) => m.kind === "nips"), "...the game's own Suck on her nipples does it too");
  D.para().nips.fed = Date.now() - 9 * 3600000; D.paraTick();
  ok(!D.para().nips && D.nips() === 0, "starved eight hours: they drop off, and her nipples close");

  // the Sure-Catch Serum: the farm girl hears it's in her
  s.needle(OWNER, "Sure-Catch Serum");
  ok(D.active("surecatch"), "the Sure-Catch Serum takes");
  await wait(800);
  const hellos = s.msgs("dispHello", BOT);
  ok(hellos.length > 0 && hellos.slice(-1)[0].on.includes("surecatch"), "...and her hello to the farm girl says so (" + JSON.stringify(hellos.slice(-1)[0] && hellos.slice(-1)[0].on) + ")");

  // ── with LSCG: they're LSCG extension activities ──
  const reg = {}, pre = {};
  const L = { getModApi: () => ({ drugs: { register: () => () => {}, dose: () => true }, events: { on() {}, before() {} }, activities: { register: (d) => { reg[d.name] = d; return () => {}; }, registerPrerequisite: (d) => { pre[d.name] = d; return () => {}; } } }),
    capabilities: new Set(["drugs", "events", "activities"]) };
  const s2 = page({ lscg: L }); await wait(1300);
  const D2 = s2.D();
  ok(D2.nipsState().mode === "lscg" && reg.nipplefuck && reg.nipplefinger, "with LSCG: Fuck nipple and Finger nipple go in as LSCG extension activities");
  ok(reg.nipplefuck.targets[0].group === "ItemNipples" && reg.nipplefuck.prerequisites.includes("nipsopen") && reg.nipplefuck.prerequisites.includes("hascock") && reg.nipplefinger.targets[0].selfAllowed,
    "...on the nipples, open ones, a cock for the one, and the finger on yourself too");
  ok(s2.w.ActivityFemale3DCG.length === 1, "...and nothin' of ours added to the game's own list as well");
  ok(pre.nipsopen.check({ acted: s2.w.Player }) === false, "...offered only on open nipples: hers are shut");
  s2.needle(OWNER, "Nipple Stretcher"); await wait(1700);   // (LSCG gets first go at a needle)
  ok(pre.nipsopen.check({ acted: s2.w.Player }) === true && pre.hascock.check({ acting: { MemberNumber: OWNER } }) === true && pre.hascock.check({ acting: { MemberNumber: LOVER } }) === false, "...a nipple stretcher opens them, and LSCG offers it");
  n = s2.local.length; reg.nipplefinger.onReceive({ sender: LOVER });
  ok(s2.local.slice(n).some((t) => /Lov/.test(t)), "...and done to her, she feels it (" + s2.local.slice(n).join(" ") + ")");
  await wait(7200);
  ok(s2.w.ActivityFemale3DCG.length === 1, "...still nothin' added to the game's own list once the fallback's time comes");

  // ── the farm girl: every load takes ──
  {
    const store = {}, sentB = [], handlers = {};
    const S = (mn, name, extra) => Object.assign({ mn, name, roles: ["LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", breedable: true, fertile: true, milkable: true }, extra || {});
    store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: { "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] },
      "600": S(600, "Hana"), "700": S(700, "Rex", { gender: "male", species: "dog" }), "701": S(701, "Bull", { gender: "male" }) }, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
    global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
    const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
    const at = (m) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } });
    const B = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
      ServerSend: (ev, d) => sentB.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
      Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [260239] }, ChatRoomCharacter: [at(260239), at(221397), at(600), at(700), at(701)],
      ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} } };
    B.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
    global.unsafeWindow = B; global.window = B; global.Blob = class {}; global.URL = { createObjectURL() {} };
    const warns = []; const keep = global.console; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(" ")) };
    B.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
    await wait(3500); B.__cfg.USER_COOLDOWN_S = 0; B.__cfg.SEND_INTERVAL_MS = 2;
    const hid = async (mn, type, data) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) }); await wait(300); };
    const p = B.__prodOf(600);
    await hid(600, "dispHello", { ver: "0.12.0", farm: true, lscg: false, off: [], on: ["surecatch"] });
    let r = B.__conceive(600, 700, 200, 1, "vulva");
    ok(r === "new" && p.preg && p.preg.count >= 1, "Sure-Catch: her first load takes, every time (" + r + ")");
    const c0 = p.preg.count, since0 = p.preg.since, due0 = p.preg.due;
    r = B.__conceive(600, 700, 200, 1, "vulva");
    ok(r === "more" && p.preg.count === c0 + 1 && p.preg.sires.length === 1, "...the same stud again: that one takes too, one more in the litter (" + c0 + " → " + p.preg.count + ")");
    ok(p.preg.since < since0 && p.preg.due < due0, "...and it brings the litter on a little, so her belly shows it");
    p.preg.since -= 3 * 86400000; p.preg.due -= 3 * 86400000; p.preg.due = Math.max(p.preg.due, Date.now() + 5 * 86400000);
    r = B.__conceive(600, 701, 200, 1, "vulva");
    ok(r === "more" && p.preg.sires.includes(701), "...days in, a new stud: still takes, and he's a sire too");
    ok([1, 2, 3, 4, 5, 6].every(() => { const l = B.__sureLine(600, 701); return /Hana|N600/.test(l) && l.includes(String(p.preg.count)); }), "...with a line for the room (" + B.__sureLine(600, 701) + ")");
    p.preg.count = B.__cfg.HYPER_MAX;
    r = B.__conceive(600, 700, 200, 1, "vulva");
    ok(r === "more" && p.preg.count === B.__cfg.HYPER_MAX && /full|no more room|not one more/i.test(B.__sureLine(600, 700)), "...full to the farm's hyper size: it still takes, and only brings 'em on (" + B.__sureLine(600, 700) + ")");
    await hid(600, "dispHello", { ver: "0.12.0", farm: true, lscg: false, off: [], on: [] });
    r = B.__conceive(600, 700, 200, 1, "vulva");
    ok(r === null, "no Sure-Catch in her: the same stud again doesn't take, as before");
    await hid(600, "dispHello", { ver: "0.12.0", farm: true, lscg: false, off: [], on: ["surecatch"] });
    B.FarmhandLedger().people["600"].fertile = false; p.preg = null;
    ok(B.__conceive(600, 700, 200, 1, "vulva") === null, "her Fertile switch off: nothin' takes, serum or not");
    const errs = warns.filter((x) => /TypeError|ReferenceError/i.test(x) && !/Worker/.test(x)); ok(!errs.length, "no errors in the bot " + errs.join(" | ").slice(0, 200));
    global.console = keep;
  }
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
