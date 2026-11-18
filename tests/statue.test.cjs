// Nov 18: the Statue Serum (Laynie approved the defaults). The Dispensary: the material off the bottle, the lines, arousal
// frozen. The Companion (statue.js): it tells the room, it hears who else is one, and which pictures turn (skin and hair),
// go (blush, tears) or stay (eyes, clothes). A pretend game page runs both as player 600 (Hana).
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
  // the game's drawing of a character, cut down: eyes, hair, blush, a sweater
  w.CommonDrawAppearanceBuild = function (C, cb) { cb.drawImage("Assets/Female3DCG/Eyes/Eyes9.png", 0, 0, {}); cb.drawImageColorize("Assets/Female3DCG/HairFront/H.png", 0, 0, { HexColor: "#fff" }); cb.drawImage("Assets/Female3DCG/Blush/Blush.png", 0, 0, {}); cb.drawImage("Assets/Female3DCG/Cloth/Sweater/Large.png", 0, 0, {}); };
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
  // ---- THE DISPENSARY'S SIDE: the material off the bottle, the lines, arousal frozen
  const s = page({ companion: true }); await wait(3500);
  const D = s.D(), w = s.w, P = w.Player, FD = w.FarmhandDispensary;
  const evs = []; w.addEventListener("farmhand-dispensary", (e) => evs.push(e.detail));

  s.needle(OWNER, "Statue Serum (gold)");
  ok(D.active("statue") && FD.dose("statue").p === "gold", "Statue Serum (gold): half an hour as a gold statue");
  ok(/gold/.test(s.actions().pop()), "...and the room sees them turn to gold");
  ok(evs.some((e) => e.type === "dose" && e.id === "statue" && e.on && e.p === "gold"), "...and the Companion's told");
  // arousal stops right where it is
  P.ArousalSettings.Progress = 40;
  w.ActivitySetArousal(P, 90);
  ok(P.ArousalSettings.Progress === 40, "arousal frozen: nothin' raises it");
  const o0 = s.game.orgasm; w.ActivityOrgasmPrepare(P);
  ok(s.game.orgasm === o0, "...and nobody makes a statue cum");
  // the Companion tells the room
  await wait(300);
  const told = s.sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Dictionary.type === "statue").map(([, d]) => d.Dictionary).pop();
  ok(told && told.mat === "gold" && told.left > 25 * 60000, "the Companion tells the room: gold, about half an hour (" + JSON.stringify(told) + ")");
  D.end("statue"); w.dispatchEvent(new w.CustomEvent("farmhand-dispensary", { detail: { type: "dose", id: "statue", on: false } })); await wait(300);
  const told2 = s.sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Dictionary.type === "statue").map(([, d]) => d.Dictionary).pop();
  ok(told2 && told2.mat === "", "...and when it wears off, flesh again for everybody");
  w.ActivitySetArousal(P, 70);
  ok(P.ArousalSettings.Progress === 70, "...and arousal moves again");

  // the other materials, and stone when the bottle doesn't say
  for (const [name, mat] of [["Petrifying Draught", "stone"], ["Statue Serum, black latex", "latex"], ["Marble Statue Potion", "marble"], ["Statue Elixir (porcelain doll)", "porcelain"], ["Bronze Statue Tonic", "bronze"]]) {
    s.needle(OWNER, name);
    ok(D.active("statue") && FD.dose("statue").p === mat, name + ": " + mat);
    D.end("statue");
  }

  // ---- THE COMPANION'S SIDE: somebody else under it
  const st = w.__statue;
  ok(st && typeof st.statueOf === "function", "the Companion has the Statue Serum");
  const Lov = w.ChatRoomCharacter.find((c) => c.MemberNumber === LOVER);
  w.ChatRoomMessage({ Type: "Hidden", Sender: LOVER, Content: "FarmhandMsg", Dictionary: { v: 2, type: "statue", mat: "marble", left: 20 * 60000 } });
  ok(st.statueOf(Lov) === "marble", "another Companion says they're marble: drawn marble here");
  w.ChatRoomMessage({ Type: "Hidden", Sender: LOVER, Content: "FarmhandMsg", Dictionary: { v: 2, type: "statue", mat: "plutonium", left: 20 * 60000 } });
  ok(st.statueOf(Lov) === null, "...somethin' that isn't one of the six: flesh");
  w.ChatRoomMessage({ Type: "Hidden", Sender: LOVER, Content: "FarmhandMsg", Dictionary: { v: 2, type: "statue", mat: "stone", left: 99 * 3600000 } });
  ok(st.others.get(LOVER).until - Date.now() <= 31 * 60000 + 1000, "...and never for longer than a dose could last");
  w.ChatRoomMessage({ Type: "Hidden", Sender: LOVER, Content: "FarmhandMsg", Dictionary: { v: 2, type: "statue", mat: "" } });
  ok(st.statueOf(Lov) === null, "...and flesh again when they say so");
  // which pictures turn
  const k = (u) => st.kindOf(u);
  ok(k("Assets/Female3DCG/BodyUpper/XLarge_White.png") === "skin" && k("Assets/Female3DCG/Override/EchoV2/BodyUpper/XLarge_White.png") === "skin" && k("Assets/Female3DCG/BodyLower/Kneel/Large_White.png") === "skin", "the body turns (the game's, Echo's override, a pose's)");
  ok(k("Assets/Female3DCG/HairFront/HairFront18_NoEars.png") === "hair" && k("Assets/Female3DCG/Eyebrows/Eyebrows8.png") === "hair", "...the hair and brows");
  ok(k("Assets/Female3DCG/Eyes/Eyes9.png") === "eyes" && k("Assets/Female3DCG/Eyes2/Eyes9.png") === "eyes", "...the eyes turn too, in their own way (Laynie: \"needs to affect the eyes in some way\")");
  ok(k("Assets/Female3DCG/Pussy/Penis_White.png") === "skin" && k("Assets/Female3DCG/Pussy/Hard/Penis_White.png") === "skin", "...and the cock and balls, soft or hard (Laynie: \"it needs to work on the cock and balls too\")");
  ok(k("Assets/Female3DCG/Blush/Blush.png") === "hide" && k("Assets/Female3DCG/Fluids/Fluids.png") === "hide", "...stone doesn't blush or cry");
  ok(k("Assets/Female3DCG/Cloth/Sweater/Large.png") === null && k("Assets/Female3DCG/ItemArms/Rope/Large.png") === null, "...and what's worn stays as it is");
  ok(k(Object.assign(w.document.createElement("canvas"), { __farmFrom: "skin" })) === "skin" && k(Object.assign(w.document.createElement("canvas"), { __farmFrom: "Assets/Female3DCG/Bra/x.png" })) === null, "...the drawn belly and breasts turn; a piece fitted to them doesn't");
  // drawin' one: blush gone, clothes as they are (and the eyes, till their picture's in: as they are for now)
  w.ChatRoomMessage({ Type: "Hidden", Sender: LOVER, Content: "FarmhandMsg", Dictionary: { v: 2, type: "statue", mat: "stone", left: 20 * 60000 } });
  const drawn = [];
  w.CommonDrawAppearanceBuild(Lov, { drawImage: (src) => drawn.push(src), drawImageColorize: (src) => drawn.push(src), drawImageBlink: () => {}, drawImageColorizeBlink: () => {} });
  ok(!drawn.some((u) => /Blush/.test(u)) && drawn.some((u) => /Eyes/.test(u)) && drawn.some((u) => /Cloth/.test(u)), "drawin' a statue: no blush, the eyes and clothes as they are (" + drawn.length + " drawn)");
  // the ink asks
  ok(typeof w.__farmInkTint === "function" && w.__farmInkTint(w.ChatRoomCharacter.find((c) => c.MemberNumber === FRIEND), "x.png", 0, 0) === undefined, "the ink's left be on somebody who isn't a statue");
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
