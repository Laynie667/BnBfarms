// BREEDIN' ANYWHERE, PART ONE (Nov 19). Laynie: "I want to be the best baby factory wherever I go", then "all of them,
// non clinical language please, make it hot and sexy". With "Breed me anywhere" on, a real cock that cums in you off the
// farm leaves a real load on your books (theirs, for the farm girl); a knotted one ties you on the map; hips up after
// a load gives it its chance; and you feel your ripe days.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700, LOVER = 701, STRANGER = 900, BOT = 260239, MIN = 60000, DAY = 86400000;

async function boot(settings) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: settings || {}, Ownership: { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, HasVagina: () => true, Appearance: [], PoseMapping: { BodyLower: "BaseLower" }, MapData: { Pos: { X: 5, Y: 5 } } };
  w.ChatRoomCharacter = [w.Player, { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true, MapData: { Pos: { X: 9, Y: 9 } } },
    { MemberNumber: LOVER, Name: "Rex", Appearance: [], IsPlayer: () => false, HasPenis: () => true, MapData: { Pos: { X: 5, Y: 6 } } },
    { MemberNumber: STRANGER, Name: "Nobody", Appearance: [], IsPlayer: () => false, HasPenis: () => true, MapData: { Pos: { X: 2, Y: 2 } } }];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = () => {}; w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function (C, n) { C.ArousalSettings.Progress = n; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ChatRoomMapViewCanEnterTile = function () { return 1; };
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.InventoryPrerequisiteMessage = () => "";
  w.eval(src); await wait(1300);
  return { w, sent, local, D: w.__disp };
}
const room = (sent, from) => sent.slice(from || 0).filter(([e, d]) => e === "ChatRoomChat" && d && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text).join(" | ");
const fuck = (w, from, to, group) => w.ChatRoomMessage({ Type: "Activity", Sender: from, Content: "ChatOther-" + group + "-PenetrateSlow", Dictionary: [{ SourceCharacter: from }, { TargetCharacter: to }, { FocusGroupName: group }, { ActivityName: "PenetrateSlow" }] });
const cums = (w, from) => w.ChatRoomMessage({ Type: "Activity", Sender: from, Content: "Orgasm1", Dictionary: [{ SourceCharacter: from }] });
const hidden = (w, from, type, data) => w.ChatRoomMessage({ Type: "Hidden", Sender: from, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data) });

(async () => {
  let { w, sent, local, D } = await boot();

  // ── a real load, off till she says so ──
  fuck(w, LOVER, ME, "ItemVulva"); cums(w, LOVER); await wait(2800);
  ok(D.seed().held.vulva.ml === 0, "\"Breed me anywhere\" off to start: Rex cummin' in her leaves nothin' on her books");
  D.st().breedAny = true;
  local.length = 0;
  fuck(w, LOVER, ME, "ItemVulva"); cums(w, LOVER); await wait(2800);
  let I = D.seed();
  ok(I.held.vulva.ml >= 30 && I.held.vulva.ml <= 60 && I.held.vulva.who === "Rex", "switched on: Rex cums in her, and it's a load of his on her books (" + I.held.vulva.ml + " mL)");
  ok(local.some((l) => /Rex/.test(l) && /unload|cums|empties|seed|load/.test(l)), "...told hot, just to her (" + local.filter((l) => /Rex/.test(l)).join(" / ").slice(0, 160) + ")");
  ok(D.seedState().pend.some((l) => l.by === LOVER && l.h === "vulva" && l.via === "cock"), "...and waitin' for the farm girl, a real cock's load");
  // a stranger: not on her list
  fuck(w, STRANGER, ME, "ItemButt"); cums(w, STRANGER); await wait(2800);
  ok(D.seed().held.butt.ml === 0, "somebody not on her list: nothin' booked");
  // the farm girl's here: her own scenes count it
  w.ChatRoomCharacter.push({ MemberNumber: BOT, Name: "Farm Girl", Appearance: [], IsPlayer: () => false });
  const b0 = D.seed().held.butt.ml;
  fuck(w, LOVER, ME, "ItemButt"); cums(w, LOVER); await wait(2800);
  ok(D.seed().held.butt.ml === b0, "on the farm, with her in the room: her own scenes count it, not the Dispensary");
  w.ChatRoomCharacter.pop();

  // ── their Dispensary says how big, and that they're knotted: a tie ──
  D.seedReset();
  let n = sent.length;
  fuck(w, LOVER, ME, "ItemVulva"); cums(w, LOVER); await wait(100);
  hidden(w, LOVER, "dispLoad", { h: "vulva", ml: 90, knot: 1, mins: 12 }); await wait(50);
  I = D.seed();
  ok(I.held.vulva.ml === 90, "Rex's Dispensary says it was a big one: 90 mL, and that's what she gets (" + I.held.vulva.ml + ")");
  ok(D.tied() && D.tied().by === LOVER && /knot/.test(room(sent, n)), "...and he's knotted: she's tied fast, and the room sees it lock (" + room(sent, n).slice(0, 140) + ")");
  ok(w.ChatRoomMapViewCanEnterTile(9, 9) === 0 && w.ChatRoomMapViewCanEnterTile(6, 6) === 1, "tied, she can't step away from him on the map (a step beside him's fine)");
  local.length = 0; w.ChatRoomMapViewCanEnterTile(9, 9);
  n = sent.length; D.breedTick(Date.now() + 20 * MIN);
  ok(!D.tied() && /slips|goes down|untied/.test(room(sent, n)) && w.ChatRoomMapViewCanEnterTile(9, 9) === 1, "the knot goes down, she's let go, and she can walk again");

  // ── your side: you came in somebody ──
  w.Player.HasPenis = () => true;
  n = sent.length;
  fuck(w, ME, LOVER, "ItemButt");
  ok(D.breedLastIn() && D.breedLastIn().target === LOVER && D.breedLastIn().h === "butt", "her own cock in Rex's ass is noticed");
  D.breedWelcome({ cock: { load: 140, knot: true, tie: [8, 14] } });
  D.breedClimax();
  const dl = sent.slice(n).map(([, d]) => d).find((d) => d && d.Content === "FarmhandMsg" && d.Dictionary.type === "dispLoad");
  ok(dl && dl.Target === LOVER && dl.Dictionary.ml === 140 && dl.Dictionary.knot === 1 && dl.Dictionary.mins >= 8 && dl.Dictionary.mins <= 14, "she cums: Rex's Dispensary is told how big her load was (the farm's numbers: 140 mL) and that her knot ties him");
  w.Player.HasPenis = () => false;

  // ── hips up ──
  D.seedReset(); D.st().breedAny = true;
  fuck(w, LOVER, ME, "ItemVulva"); cums(w, LOVER); await wait(2800);
  local.length = 0;
  w.Player.PoseMapping = { BodyLower: "AllFours" };
  D.breedTick(Date.now());
  ok(D.seedState().pend.some((l) => l.h === "vulva" && l.up === 1) && local.some((l) => /hips|Rump up|rump/i.test(l)), "on all fours after Rex's load: it's marked for its chance with her hips up (" + local.join(" / ").slice(0, 120) + ")");
  local.length = 0; D.breedTick(Date.now());
  ok(!local.some((l) => /hips|rump/i.test(l)), "...and said once, not every tick");
  w.Player.PoseMapping = { BodyLower: "BaseLower" };

  // ── ripe days ──
  D.breedWelcome({ ripe: { at: Date.now() - 3.2 * DAY, every: 7, from: 3, days: 2 } });
  ok(D.ripe() === true && D.ripe(Date.now() + 2 * DAY) === false, "the farm's ripe days for her: ripe now, not in two days");
  D.breedTick(Date.now()); local.length = 0; n = sent.length;
  D.breedTick(Date.now() + 3 * 3600000);
  ok(local.some((l) => /ripe|achin'|bred/i.test(l)), "ripe, she feels it now and then (" + local.join(" / ").slice(0, 120) + ")");
  ok(/ripe|bred|breedin'/i.test(room(sent, n)), "...and now and then the room can tell");

  // ── it's all kept ──
  await wait(1700);
  const saved = Object.assign({}, w.Player.ExtensionSettings);
  ({ w, sent, local, D } = await boot(saved));
  ok(D.st().breedAny === true && D.st().ripe && D.st().cock && D.st().cock.knot === true, "after a reload: her switch, her ripe days and her cock's numbers are still there");

  out(fails ? fails + " FAILED" : "all passed");
  process.exit(fails ? 1 : 0);
})();
