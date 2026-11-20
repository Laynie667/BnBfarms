// Nov 19, the traps use open nipples. Laynie: "since tits are fuckable via nipple, some traps should use it. like knotting
// in them, eggs in them, etc." and, to the list of ten: "all of them, and more, like the kraken".
// Part one: the farm girl (whose are open, the traps' nipple beats, what they leave, the kraken). Part two: the Dispensary
// (opened quietly by the farm, trained by her traps, leeches from the barn, open nipples in its hello).
const fs = require("fs"), path = require("path");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const BOT = 260239;

(async () => {
  // ── part one: the farm girl ──
  {
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
    const warns = []; const keep = global.console; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(" ")) };
    B.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
    await wait(3500);
    const cfg = B.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 2; cfg.TRAP_BEAT_S = 0.05; cfg.TRAP_COOLDOWN_MIN = 0; cfg.CHAIN_CHANCE = 0;
    chars[1].Name = "Laynie"; chars[2].Name = "Moo";
    const L = () => B.FarmhandLedger(), P = (mn) => L().people[mn], prod = (mn) => B.__prodOf(mn);
    const hid = async (mn, type, data, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) }); await wait(ms || 200); };
    const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Whisper", Content: msg, Target: BOT }); await wait(ms || 1200); };
    const room = (n) => sent.slice(n).filter(([e, d]) => d && typeof d.Content === "string" && /^\(?\*/.test(d.Content)).map(([, d]) => d.Content).join(" | ");   // (the scene: emotes; off the map they come as whispers)
    const allText = (n) => sent.slice(n).map(([, d]) => JSON.stringify(d)).join(" | ");
    const hiddenTo = (mn, type, n) => sent.slice(n || 0).filter(([e, d]) => d && d.Type === "Hidden" && d.Target === mn && d.Dictionary && d.Dictionary.type === type).map(([, d]) => d.Dictionary);
    const fresh = () => { const r = P(500); r.trapAt = 0; r.penned = null; r.trapQuiet = 0; r.spotTrapAt = {}; r.gear = null; };
    const spring = async (kind) => { fresh(); const n = sent.length; await say(221397, "?trap spring Moo " + kind, 300); await wait(2600); return n; };
    const hello = (o) => hid(500, "dispHello", Object.assign({ ver: "0.24.0", farm: true, lscg: false, off: [], hard: false, on: [], holes: 1, seed: 1, breed: 1, nips: 0 }, o || {}));

    // whose are open: their hello, and what their Dispensary tells the room
    await hello({ nips: 2 });
    ok(B.__nipsOpenOf(500) === 2, "their Dispensary's hello says their nipples are open, two wide");
    await hid(500, "dispNips", { n: 0 }); ok(B.__nipsOpenOf(500) === 0, "...and when it tells the room they've closed, she knows");
    await hid(500, "dispNips", { n: 3 }); ok(B.__nipsOpenOf(500) === 3, "...and gapin' again");
    ok(B.__nipKindOf("werewolf") === "knot" && B.__nipKindOf("foxden") === "knot" && B.__nipKindOf("clutch") === "eggs" && B.__nipKindOf("goblinraid") === "goblin" &&
       B.__nipKindOf("stocks") === "held" && B.__nipKindOf("pump") === "pump" && B.__nipKindOf("milker") === "milk" && B.__nipKindOf("tentacle") === "tendril" &&
       B.__nipKindOf("breeder") === "breed" && B.__nipKindOf("mud") === null, "every kind of trap knows what it does with nipples");
    // {np}: lines only for open nipples; {nn}: only for shut
    ok([1, 2, 3, 4, 5, 6].every((i) => B.__pickFor(500, "t:np" + i, ["{np}OPEN", "{nn}SHUT"]) === "{np}OPEN"), "a line tagged for open nipples is picked when theirs are open");
    await hid(500, "dispNips", { n: 0 });
    ok([1, 2, 3, 4, 5, 6].every((i) => B.__pickFor(500, "t:nn" + i, ["{np}OPEN", "{nn}SHUT"]) === "{nn}SHUT"), "...and never when they're shut");
    await hid(500, "dispNips", { n: 3 });

    // knotted by the tit
    let loads = (prod(500).totals.nipLoads || 0), tied = prod(500).totals.tied || 0;
    let n = await spring("werewolf");
    ok(/nipple/i.test(room(n)) && /knot/i.test(room(n)), "the werewolf: the knot goes in a nipple (" + (room(n).match(/[^"|]*knot[^"|]*nipple[^"|]*|[^"|]*nipple[^"|]*knot[^"|]*/i) || [""])[0].slice(0, 140) + ")");
    ok((prod(500).totals.nipLoads || 0) === loads + 1 && (prod(500).totals.tied || 0) === tied + 1, "...a load in the tit on her books, and a tie counted");
    ok(P(500).penned && /tied by the tit/.test(P(500).penned.name || ""), "...and tied by the tit a while past the end");
    ok(hiddenTo(500, "dispNipsUsed", n).some((m) => m.n === 2), "...and her Dispensary's told, so the stretch trains");
    ok(/Tied by the tit/.test(allText(n)), "...she's told why she's stuck");

    // eggs in the tits, out when she's milked
    n = await spring("eggs");
    const te = prod(500).titEggs;
    ok(te && te.n >= 2 && te.n <= 16 && /nipple/i.test(room(n)), "the egg post lays part of the clutch in her tits (" + (te && te.n) + ")");
    ok(B.__titCups(500) >= 1, "...her tits are drawn a cup bigger while they're in there (" + B.__titCups(500) + ")");
    const laid0 = (prod(500).offspring.eggs || 0), had = te.n;
    n = sent.length; prod(500).milk = 900; B.__drainMilk(500, 400); await wait(300);
    ok(!prod(500).titEggs && prod(500).offspring.eggs === laid0 + had && /egg/i.test(room(n)) && /nipple|tits/i.test(room(n)), "milked: the eggs come out of her nipples into the pail, and they're counted as laid");
    // or on their own
    prod(500).titEggs = { n: 4, by: -5, since: Date.now() - 86400000, layAt: Date.now() - 1000 };
    n = sent.length; B.__titTick(500); await wait(200);
    ok(!prod(500).titEggs && /egg/i.test(room(n)) && /nipple|tits/i.test(room(n)), "...or on their own once they're ready");

    // the pump fills them
    n = await spring("pump");
    ok(prod(500).titPump && prod(500).titPump.until > Date.now() && B.__titCups(500) === 2, "the pump fills her tits through the nipples: two cups bigger for a while");
    n = sent.length; await say(500, "?stats", 1500);
    ok(/Tits pumped full/.test(allText(n)), "?stats says so");
    prod(500).titPump.until = Date.now() - 1; B.__titTick(500);
    ok(!prod(500).titPump && B.__titCups(500) === 0, "...and they go back down when it wears off");

    // goblins, the stocks
    loads = prod(500).totals.nipLoads || 0;
    n = await spring("goblinraid");
    ok((prod(500).totals.nipLoads || 0) >= loads + 2 && /goblin/i.test(room(n)), "the goblins take turns in her nipples (" + ((prod(500).totals.nipLoads || 0) - loads) + " loads)");
    n = await spring("stocks");
    ok(/nipple/i.test(room(n)) && /Fuck nipple/.test(allText(n)), "held in the stocks: passers-by use them too, and she's told folks can");

    // the milker opens shut ones, through her Dispensary; not with the Dilator off, not on an old Dispensary
    await hid(500, "dispNips", { n: 0 }); await hello({ nips: 0 });
    fresh(); n = sent.length; await say(221397, "?trap spring Moo milker", 300);
    ok(hiddenTo(500, "dispNipsOpen", n).some((m) => m.n === 2 && m.quiet === true), "the milker asks her Dispensary to open them, quietly (the trap tells it)");
    await hid(500, "dispNips", { n: 2 }); await wait(2400);
    ok(/opened your nipples/.test(allText(n)) && /stretch|open/i.test(room(n)), "...they come out open, and she's told");
    await hid(500, "dispNips", { n: 0 }); await hello({ nips: 0, off: ["dilator"] });
    n = await spring("milker");
    ok(!hiddenTo(500, "dispNipsOpen", n).length, "with the Nipple Dilator switched off, the cups leave them shut");
    await hello({ nips: 0, ver: "0.23.0" });
    n = await spring("milker");
    ok(!hiddenTo(500, "dispNipsOpen", n).length, "...and on a Dispensary too old to open them quietly");

    // nipples in her limits: none of it
    await hello({ nips: 3 }); P(500).limits = "no nipples please";
    loads = prod(500).totals.nipLoads || 0;
    n = await spring("werewolf");
    ok((prod(500).totals.nipLoads || 0) === loads && !hiddenTo(500, "dispNipsUsed", n).length, "nipples in her limits: the traps leave them be");
    P(500).limits = "";

    // the kraken
    B.__waterForce = "kraken"; loads = prod(500).totals.nipLoads || 0; prod(500).eggs = null; prod(500).titEggs = null;
    n = await spring("tentacle"); await wait(1500);
    ok(/kraken/i.test(room(n)), "the kraken: a new thing in the water");
    ok(prod(500).titEggs && prod(500).titEggs.n >= 4 && (prod(500).totals.nipLoads || 0) >= loads + 2, "...it fills her nipples and lays in her tits too (" + (prod(500).titEggs && prod(500).titEggs.n) + " eggs)");
    ok(prod(500).eggs && prod(500).eggs.n > 0, "...and her belly");
    ok(/kraken bait/i.test(allText(n)), "...and she's kraken bait now");
    B.__waterForce = null;
    // the state beat: open nipples are noticed by any trap
    ok(B.__stateOf(500).nipsOpen === true && B.__stateOf(500).titEggs === true, "a trap's state beat knows her nipples are open, and what's in them");

    const errs = warns.filter((x) => /TypeError|ReferenceError/i.test(x) && !/Worker/.test(x)); ok(!errs.length, "no errors in the bot " + errs.join(" | ").slice(0, 300));
    global.console = keep;
  }

  // ── part two: the Dispensary ──
  {
    const { JSDOM } = require("jsdom");
    const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
    const ME = 600, OWNER = 700;
    const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
    const w = dom.window, sent = [], local = [], cmds = [];
    w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
    w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
    w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
    w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: OWNER }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [],
      ArousalSettings: { Active: "Hybrid", Progress: 50 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
    const C = (mn, name) => ({ MemberNumber: mn, Name: name, Appearance: [], IsPlayer: () => false, HasPenis: () => false });
    w.ChatRoomCharacter = [w.Player, C(OWNER, "Mistress"), C(BOT, "Farm Girl")];
    w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
    w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
    w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
    w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
    w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function () {}; w.ChatRoomMapViewCanEnterTile = function () { return 100; };
    w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
    w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
    w.eval(src);
    await wait(3600);
    const D = w.__disp;
    const hidden = (from, type, data) => w.ChatRoomMessage({ Type: "Hidden", Sender: from, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) });
    const msgs = (type, to) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Dictionary.type === type && (to === undefined || d.Target === to)).map(([, d]) => d.Dictionary);
    const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text || "");

    hidden(BOT, "ping", {}); await wait(200);
    ok(msgs("dispHello").length && msgs("dispHello").slice(-1)[0].nips === 0, "the Dispensary's hello says how open her nipples are (shut)");
    let a0 = actions().length;
    hidden(BOT, "dispNipsOpen", { n: 2, quiet: true });
    ok(D.trained() === 2 && actions().length === a0, "the farm's trap opens them quietly: two wide, trained to stay, no line of ours (the trap tells it)");
    ok((msgs("dispNipsOpenOk", BOT).slice(-1)[0] || {}).ok === true, "...and the farm girl's told it took");
    await wait(900);
    ok(msgs("dispHello").slice(-1)[0].nips === 2, "...and the next hello says they're open");
    hidden(OWNER, "dispNipsOpen", { n: 3, quiet: true });
    ok(D.trained() === 3 && actions().length > a0, "quiet is only for the farm: Mistress forcin' them is seen by the room");
    D.nipsClose(); hidden(BOT, "dispNipsOpen", { n: 1, quiet: true });
    const lv0 = D.nipsState().train.lvl;
    hidden(BOT, "dispNipsUsed", { n: 3 });
    ok(D.nipsState().train.lvl > lv0 + 0.4, "a trap used them three times: they train wider (" + lv0.toFixed(2) + " to " + D.nipsState().train.lvl.toFixed(2) + ")");
    const lv1 = D.nipsState().train.lvl;
    hidden(OWNER, "dispNipsUsed", { n: 3 });
    ok(D.nipsState().train.lvl === lv1, "...only the farm girl can say a trap did");
    D.st().parasites = {};
    hidden(BOT, "dispLatch", { kind: "nips", name: "The barn" });
    ok(!D.para().nips, "leeches in the milkin' cups: not with her nipple leeches switched off");
    D.st().parasites = { nips: true }; a0 = actions().length;
    hidden(BOT, "dispLatch", { kind: "nips", name: "The barn" });
    ok(!!D.para().nips && actions().length > a0, "...switched on: they latch, and the room sees it (" + actions().slice(-1)[0] + ")");
  }
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})().catch((e) => { out("CRASHED " + (e && e.stack || e)); process.exit(1); });
