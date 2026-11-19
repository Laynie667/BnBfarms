// Nov 18: the farm girl's four voice potions from a crafted bottle (Honey Tongue, Golden Hour, Blue Ribbon Musk, Echo
// Elixir), and growth off the farm (Udder, Ass, Cock and Balls Growth, the reducers). A pretend game page runs
// dist/farmhand-dispensary.user.js as player 600 (Hana).
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const companionSrc = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");
const BOT = 260239, ME = 600, OWNER = 700, LOVER = 701, WHITE = 702, FRIEND = 703, BLACK = 704, STRANGER = 705;

function page(opts) {
  opts = opts || {};
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [], synced = [], faces = [], pages = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
  w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true;
  w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  const my = opts.me || ME;
  w.Player = { MemberNumber: my, Name: my === ME ? "Hana" : "Keeper" + my, ExtensionSettings: opts.ext || {}, Ownership: opts.noOwner ? null : { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }],
    WhiteList: [WHITE], FriendList: [FRIEND], BlackList: [BLACK], ArousalSettings: { Active: "Hybrid", Progress: 50 }, IsPlayer: () => true, Appearance: [], ActivePose: [], GetBlindLevel: () => 0, GetDeafLevel: () => 0 };
  const C = (mn, name) => ({ MemberNumber: mn, Name: name, Appearance: [], IsPlayer: () => false });
  w.ChatRoomCharacter = [w.Player, ...(my !== ME ? [C(ME, "Hana")] : []), ...(my !== OWNER ? [C(OWNER, "Mistress")] : []), C(LOVER, "Lov"), C(WHITE, "Whit"), C(FRIEND, "Fren"), C(BLACK, "Blackie"), C(STRANGER, "Stranger"), C(221397, "Laynie")];
  if (opts.bot) w.ChatRoomCharacter.push(C(BOT, "Farm Girl"));
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list);
  w.ServerPlayerExtensionSettingsSync = (k) => synced.push(k);
  w.CharacterSetFacialExpression = (C2, g, e) => faces.push([g, e]);
  w.PreferenceRegisterExtensionSetting = (p) => pages.push(p);
  // what the Dispensary hooks
  const game = { orgasm: 0, msgs: 0 };
  w.ChatRoomMessage = function () { game.msgs++; };
  w.ActivityOrgasmPrepare = function () { game.orgasm++; };
  w.ActivityOrgasmStart = function () { game.ruined = !!w.ActivityOrgasmRuined; };
  w.ActivityOrgasmStop = function (C, v) { C.ArousalSettings.Progress = v; };
  // poses, senses and the status icons (Nov 18)
  w.PoseChangeStatus = { NEVER: 0, NEVER_WITHOUT_AID: 1, ALWAYS_WITH_STRUGGLE: 2, ALWAYS: 3 };
  w.PoseAllStanding = ["BaseLower", "LegsClosed", "LegsOpen"];
  w.PoseCanChangeUnaidedStatus = function () { return 3; };
  w.PoseSetActive = function (C, p) { C.ActivePose = [p]; };
  w.ChatRoomCharacterUpdate = function () {};
  const drawnText = [];
  w.ChatRoomDrawCharacterStatusIcons = function () {};
  w.DrawTextFit = function (t) { drawnText.push(String(t)); };
  { const mc = w.document.createElement("canvas"); mc.id = "MainCanvas"; w.document.body.appendChild(mc); }
  w.ActivitySetArousalTimer = function (C, A, Z, P) { game.timer = P; };
  w.ActivitySetArousal = function (C, v) { C.ArousalSettings.Progress = v; };
  w.ChatRoomMapViewCanEnterTile = function () { return 100; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {};
  w.ChatRoomSync = function () {};
  const beeps = [];
  w.ServerAccountBeep = function (d) { beeps.push(d && d.Message); };
  w.confirm = () => true;
  w.ChatRoomMessageRunExtractors = (data) => { const d = data.Dictionary || []; const a = d.find((x) => x.ActivityName); const t = d.find((x) => typeof x.TargetCharacter === "number"); return { metadata: { ActivityName: a && a.ActivityName, TargetMemberNumber: t && t.TargetCharacter } }; };
  if (opts.lscg) w.LSCG_OnLoad = { push: (cb) => cb(opts.lscg) }, w.LSCG = { version: "0.9.8" };
  if (opts.prefs) w.localStorage.setItem("fhc-prefs", JSON.stringify(opts.prefs));
  if (opts.companion) { w.ChatRoomData = { Name: "B&B Farm" }; w.eval(companionSrc); }   // the Companion first, as Tampermonkey might load it
  if (!opts.noDisp) w.eval(src);
  const charOf = (mn) => w.ChatRoomCharacter.find((c) => c.MemberNumber === mn);
  // somebody uses the Inject activity on me, holding a crafted item
  const needle = (by, name, desc) => {
    const c = charOf(by); c.Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: desc || "" } }];
    w.ChatRoomMessage({ Type: "Activity", Sender: by, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] });
  };
  const to = (mn, type) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Target === mn && d.Dictionary.type === type).map(([, d]) => d.Dictionary);
  const fromBot = (type, data, sender) => w.ChatRoomMessage({ Type: "Hidden", Sender: sender || BOT, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data) });
  const toBot = (type) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Target === BOT && d.Dictionary.type === type).map(([, d]) => d.Dictionary);
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => d.Dictionary.find((x) => x.Tag === "msg").Text);
  const marks = () => { try { return (JSON.parse(w.localStorage.getItem("farmhand-messes")) || []).length; } catch (e) { return 0; } };
  return { drawnText, marks, w, sent, local, cmds, synced, faces, pages, game, beeps, needle, fromBot, toBot, to, actions, D: () => w.__disp };
}

(async () => {
  // ---- THE FARM GIRL'S FOUR VOICE POTIONS, from a crafted bottle (Nov 18)
  const s = page(); await wait(1300);
  const D = s.D(), w = s.w, P = w.Player, FD = w.FarmhandDispensary;
  const evs = []; w.addEventListener("farmhand-dispensary", (e) => evs.push(e.detail));
  const later = (min) => { const realNow = w.Date.now; w.Date.now = () => realNow() + min * 60000; D.tick(); w.Date.now = realNow; };

  s.needle(OWNER, "Honey Tongue Elixir"); D.tick();
  ok(D.active("honey") && D.leftMs("honey") > 40 * 60000, "Honey Tongue from a crafted bottle: in you for 45 minutes");
  const nl = s.local.length; later(10);
  ok(s.local.slice(nl).some((t) => /🍯 The farm girl leans in close to your ear: /.test(t)), "...and the farm girl's sweet talk comes in your ear, only you hear it (" + (s.local.slice(nl)[0] || "").slice(0, 90) + ")");
  D.end("honey");

  s.needle(OWNER, "Golden Hour Tonic");
  ok(D.active("golden"), "Golden Hour from a crafted bottle");
  const gl = s.local.length; w.ActivityOrgasmStart(P); await wait(2700);
  if (!s.local.slice(gl).some((t) => /✨/.test(t))) out("  (golden: " + JSON.stringify(s.local.slice(gl)) + ")");
  ok(s.local.slice(gl).some((t) => /✨/.test(t)), "...and you're doted on every time you cum");
  D.end("golden");

  s.needle(OWNER, "Blue Ribbon Musk");
  ok(D.active("musk"), "Blue Ribbon Musk from a crafted bottle"); D.tick();
  const ma = s.actions().length; later(10);
  ok(s.actions().length > ma, "...and the room hears about you now and then");
  D.end("musk");

  s.needle(OWNER, "Echo Elixir");
  ok(D.active("echo"), "Echo Elixir from a crafted bottle");
  const realRandom = w.Math.random; w.Math.random = () => 0.9;
  const ea = s.actions().length;
  w.ServerSend("ChatRoomChat", { Type: "Chat", Content: "I love the farm so much" }); await wait(2700);
  ok(s.actions().slice(ea).some((t) => /I love the farm so much/.test(t) && /Hana/.test(t)), "...and somethin' you said comes back to the room, sweetly");
  const eb = s.actions().length;
  w.ServerSend("ChatRoomChat", { Type: "Chat", Content: "and the cows too" }); await wait(2700);
  ok(s.actions().length === eb, "...not again straight away (three minutes apart, twice a dose)");
  w.ServerSend("ChatRoomChat", { Type: "Chat", Content: "((ooc: brb))" }); await wait(300);
  ok(!s.actions().slice(eb).some((t) => /brb/.test(t)), "...and never OOC");
  w.Math.random = realRandom; D.end("echo");

  // on the farm, a crafted bottle of hers is still yours (she only reads the ones bought at her store)
  const f = page({ bot: true }); await wait(1300);
  f.needle(OWNER, "Honey Tongue Elixir");
  ok(f.D().active("honey"), "a crafted Honey Tongue works on the farm too (her store's are hers)");

  // ---- GROWTH OFF THE FARM
  s.needle(OWNER, "Udder Growth x2");
  ok(FD.grow().cup === 2 && /chest|tits|breasts/.test(s.actions().pop()), "Udder Growth x2: two cups bigger, and the room sees it");
  ok(evs.some((e) => e.type === "grow" && e.part === "cup" && e.n === 2), "...the Companion's told, so the drawn breasts grow");
  s.needle(OWNER, "Breast Enlarger");
  ok(FD.grow().cup === 3, "...the farm's own words work too (Breast Enlarger)");
  s.needle(OWNER, "Cock Growth"); s.needle(OWNER, "Ball Enlarger x2"); s.needle(OWNER, "Booty Growth");
  const g = FD.grow();
  ok(g.cock === 1 && g.balls === 2 && g.ass === 1, "cock, balls and booty growth each counted (" + JSON.stringify(g) + ")");
  s.needle(OWNER, "Cock Reducer");
  ok(FD.grow().cock === 0 && /shrinks|smaller/.test(s.actions().pop()), "a Cock Reducer takes a size back off the cock");
  s.needle(OWNER, "Reducing Serum");
  ok(FD.grow().cup === 2, "...a plain Reducing Serum takes it off the tits");
  s.needle(OWNER, "Shrinking Potion");
  ok(FD.grow().cup === 2, "...and a Shrinking Potion is LSCG's, not ours: nothin' from us");
  for (const nm of ["Udder Growth x5", "Breast Growth x5", "Boob Growth x5"]) s.needle(OWNER, nm);
  ok(FD.grow().cup === 10, "growth stops at its limit (10 cups up)");
  if (!s.local.slice(-4).some((t) => /any further/.test(t))) out("  (max: " + JSON.stringify(s.local.slice(-4)) + ")");
  ok(s.local.slice(-4).some((t) => /any further/.test(t)), "...and you're told it can't take you further");
  ok(D.st().grow && D.st().grow.cup === 10, "...and it's kept with your settings");
  // it stays through the Purge
  s.needle(OWNER, "Purge Serum");
  ok(FD.grow().cup === 10, "the Purge doesn't undo growth (it stays)");
  // and after a reload
  await wait(1700);
  const again = page({ ext: P.ExtensionSettings }); await wait(1300);
  ok(again.w.FarmhandDispensary.grow().cup === 10 && again.w.FarmhandDispensary.grow().balls === 2, "...and it's still there when you come back");
  // on the farm with her in the room, growth is hers (her books)
  const ff = page({ bot: true }); await wait(1300);
  ff.needle(OWNER, "Udder Growth");
  ok(ff.w.FarmhandDispensary.grow().cup === 0, "on the farm, growth is the farm girl's to give (her own books), not ours");

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
