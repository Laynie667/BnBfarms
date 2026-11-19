// HORNY GEAR (Nov 18). Laynie: "the devices being horny. Which we could make a horny tag on parasites so they are more
// active with thrusting", then yes to it makin' you cum, yes to its own switch, yes to breeding gear.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700, STRANGER = 999, MIN = 60000;

(async () => {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [], evs = [];
  let orgasms = 0;
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: OWNER }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  w.ChatRoomCharacter = [w.Player, { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true }];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () { orgasms++; }; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function (C, n) { C.ArousalSettings.Progress = n; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.addEventListener("farmhand-dispensary", (e) => evs.push(e.detail));
  w.eval(src); await wait(1300);
  const D = w.__disp;
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text || "");
  const crafted = (group, asset, name, by) => ({ Asset: { Name: asset, Group: { Name: group }, Description: asset }, Craft: { Name: name, Description: "", MemberNumber: by }, Property: {} });
  const A = w.Player.ArousalSettings;
  let now = Date.now();
  const run = (mins) => { const n = Math.round(mins * 12); for (let i = 0; i < n; i++) { now += 5000; D.hornyTick(now); } };
  const said = () => local.concat(actions()).join(" | ");

  w.Player.Appearance = [crafted("ItemVulva", "VibratingDildo", "Hungry Tentacle Plug", OWNER)];
  const g = D.horny();
  ok(g.length === 1 && g[0].where === "hole" && g[0].lvl === 1 && !g[0].breed, "a Hungry Tentacle Plug from her owner: horny gear, in her pussy (" + JSON.stringify(g.map((x) => [x.where, x.lvl])) + ")");
  local.length = 0; sent.length = 0;
  run(2);
  ok(!said(), "put in just now: it gives her a little while first");
  run(14);
  const beats1 = local.length + actions().length;
  ok(beats1 >= 1 && beats1 <= 4 && /Hungry Tentacle Plug/.test(said()), "every six to ten minutes it fucks her by itself (" + beats1 + " in a quarter hour: " + said().slice(0, 140) + ")");
  ok(A.Progress > 20 && A.Progress <= 20 + 12 * beats1, "...each time her arousal goes up a step (" + A.Progress + ")");
  ok(/thrust|fuck|push|deep|stroke|swell/i.test(said()), "...and it's thrustin', the way a plug would");

  // over the edge
  A.Progress = 90; orgasms = 0;
  D.hornyBeat(Object.assign({}, D.horny()[0]));
  ok(orgasms === 1 && actions().some((l) => /cum|edge|over/i.test(l)), "close enough: it tips her right over, the game's own orgasm, and the room sees it");
  A.Progress = 90; orgasms = 0; D.give("denial", { by: OWNER, quiet: true });
  D.hornyBeat(Object.assign({}, D.horny()[0]));
  ok(orgasms === 0, "...not while she's denied");
  D.end("denial");

  // insatiable, rough, and where it's worn
  w.Player.Appearance = [crafted("ItemMouth", "DildoGag", "Insatiable Gag", OWNER), crafted("ItemNipples", "NippleSuctionCups", "Horny Suckers", OWNER), crafted("ItemPelvis", "CrotchRope", "Hungry Rope", OWNER)];
  const wh = D.horny().map((x) => x.where + x.lvl).join(",");
  ok(wh === "mouth2,nips1,crotch1", "a gag fucks her throat, nipple gear suckles, a crotch rope grinds; insatiable's rougher (" + wh + ")");
  local.length = 0; sent.length = 0; A.Progress = 0; D.hornyReset();
  run(30);
  const gagged = (said().match(/Insatiable Gag/g) || []).length, sucked = (said().match(/Horny Suckers/g) || []).length;
  ok(gagged > sucked && gagged >= 6, "insatiable: every two to four minutes, far busier than horny (" + gagged + " to " + sucked + " in half an hour)");
  ok(/throat|mouth|drool|gag|swallow/i.test(said()) && /suck|nipple|tug/i.test(said()) && /grind|rub|tight/i.test(said()), "...each in its own way: her throat, her nipples, her crotch");

  // a horny nipple toy in an open nipple fucks it, and they train
  D.st().parasites = {}; w.Player.Appearance = [crafted("ItemNipples", "FarmNipPlug", "Hungry Nipple Plug", OWNER)];
  const before = (D.nipsState().train || {}).lvl || 0;
  D.hornyBeat(Object.assign({}, D.horny()[0]));
  ok(((D.nipsState().train || {}).lvl || 0) > before, "a hungry plug in her open nipples fucks them, and they train wider");

  // a name that's more than one thing still reads right
  w.Player.Appearance = [crafted("ItemNipples", "NippleClamp", "Hungry Clamps", OWNER)];
  local.length = 0; sent.length = 0; D.hornyBeat(Object.assign({}, D.horny()[0]));
  ok(/pair of Hungry Clamps/.test(said()), "gear with a plural name reads as a pair (" + said().slice(0, 110) + ")");

  // who and when
  w.Player.Appearance = [crafted("ItemButt", "BlackButtPlug", "Hungry Plug", STRANGER)];
  local.length = 0; sent.length = 0; D.hornyReset(); run(30);
  ok(!said(), "crafted by somebody not on her list: it sits still");
  w.Player.Appearance = [crafted("ItemButt", "BlackButtPlug", "Hungry Plug", OWNER)];
  D.st().hornyOn = false; local.length = 0; sent.length = 0; D.hornyReset(); run(30);
  ok(!said(), "her switch off: it sits still");
  const c = cmds.find((x) => x.Tag === "dispensary"); c.Action("horny on");
  ok(D.st().hornyOn === true && local.some((l) => /Horny gear can use you/.test(l)), "/dispensary horny on: back on");
  D.st().wornPause = now + 15 * MIN; local.length = 0; sent.length = 0; D.hornyReset(); run(10);
  ok(!said(), "after her safeword: it rests with the rest of her gear");
  D.st().wornPause = 0;

  // breeding gear
  w.Player.Appearance = [crafted("ItemVulva", "VibratingDildo", "Horny Breeding Plug", OWNER)];
  ok(D.horny()[0].breed === true, "\"breeding\" on it: breeding gear");
  sent.length = 0; evs.length = 0;
  ok(D.hornyClimax() === 1 && actions().some((l) => /fill|flood|load|seed|pump|empties|bred|stuffed/i.test(l)) && evs.some((e) => e.type === "leak" && e.mess === "cum" && e.areas.includes("thighs")), "she cums: so does it, fillin' her, and it runs down her thighs (a mess for the Companion)");

  // horny parasites
  D.st().parasites = { latex: true };
  w.Player.Appearance = [crafted("ItemSuit", "Catsuit", "Horny livin' latex", OWNER)];
  D.paraTick();
  ok(D.para().latex && D.para().latex.horny === 1, "a horny livin' latex latches on, horny");
  local.length = 0; sent.length = 0; A.Progress = 0;
  run(20);
  ok(/latex/i.test(said()) && A.Progress > 0, "...and between feeds it gropes and squeezes her, pushin' her up (" + said().slice(0, 120) + ")");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
