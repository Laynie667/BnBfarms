// Nov 17: the Dispensary's new doses, the ones Laynie picked ("I love it", then "the new drug effects go in"):
// Let-Down, Fill-Out, the Airhead Elixir, Babble Brew, Deep Throat Drops, Rut and Tender, time-release capsules,
// tolerance and cravings, and what the farm girl and the Companion do with them.
// A pretend game page runs dist/farmhand-dispensary.user.js as player 600 (Hana), the Companion beside it.
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
    WhiteList: [WHITE], FriendList: [FRIEND], BlackList: [BLACK], ArousalSettings: { Active: "Hybrid", Progress: 50 }, IsPlayer: () => true, Appearance: [] };
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
  return { marks, w, sent, local, cmds, synced, faces, pages, game, beeps, needle, fromBot, toBot, to, actions, D: () => w.__disp };
}

(async () => {
  // ---- the new doses (Laynie, Nov 17: "I love it", then "the new drug effects go in")
  const s = page({ companion: true, prefs: { marks: true } }); await wait(1300);
  const D = s.D(), P = s.w.Player, evs = [];
  s.w.addEventListener("farmhand-dispensary", (e) => evs.push(e.detail));
  const said = (t) => { const n = s.sent.length; s.w.ServerSend("ChatRoomChat", { Type: "Chat", Content: t }); const d = s.sent[n] && s.sent[n][1]; return d ? d.Content : ""; };
  const acts = () => s.actions().join(" | ");

  // Let-Down: it leaks, and the Companion's messes show it
  s.needle(OWNER, "Let-Down Tonic");
  ok(D.active("letdown") && /Hana/.test(acts()), "Let-Down takes, and the room hears it");
  ok(evs.some((e) => e.type === "leak" && e.mess === "milk" && e.areas.includes("chest")), "...the first leak at once: milk on the chest, for the Companion to draw");
  const leaks = evs.filter((e) => e.type === "leak").length;
  D.moment("letdown");
  ok(evs.filter((e) => e.type === "leak").length > leaks, "...and again with each wet moment");
  ok(s.w.FarmhandCompanion && s.marks() > 0, "...with the Companion's 'Farm can mark my body' on, the milk lands on you (" + s.marks() + ")");

  // Fill-Out: the part on the bottle, and the Companion's drawn body reads it
  s.needle(OWNER, "Fill-Out Serum (belly) x2");
  const fo = s.w.FarmhandDispensary.dose("fillout");
  ok(fo && fo.p === "belly" && fo.x === 2 && fo.left > 0, "Fill-Out: the belly, x2, as the bottle says");
  ok(/belly|tummy|middle/.test(s.actions().pop()), "...and the room hears the belly swell");
  ok(evs.some((e) => e.type === "dose" && e.id === "fillout" && e.on), "...the Companion's told, so it draws you bigger");
  D.end("fillout");
  s.needle(OWNER, "Fill-Out Serum");
  ok(s.w.FarmhandDispensary.dose("fillout").p === "cup", "...and the cup when the bottle doesn't say");
  ok(evs.some((e) => e.type === "dose" && e.id === "fillout" && e.on === false), "...the Companion's told when it ends, so you shrink back");

  // the Airhead Elixir
  s.needle(OWNER, "Airhead Elixir x3");
  const plain = "I really think this is a very important conversation about everything happening tonight.";
  let changed = 0, airy = 0;
  for (let i = 0; i < 12; i++) { const a = said(plain); if (a !== plain) changed++; if (/like,|um,|totally|super|\?|giggl|thingy|whatchamacallit|big-word|hair|hehe|lol/.test(a)) airy++; }
  ok(changed >= 11 && airy >= 11, "the Airhead Elixir: likes, ums, uptalk and big words floatin' off (" + said(plain) + ")");
  ok(said("(ooc: brb") === "(ooc: brb" && said("*smiles") === "*smiles", "...never out of character, never an emote");
  D.end("airhead");

  // Babble Brew
  s.needle(OWNER, "Babble Brew");
  let filthy = 0;
  for (let i = 0; i < 12; i++) if (/cock|fuck|breed|tit|dick|ass|butt|cum|knot|—|moan|hump|cream|milk/.test(said("I need to check the clock before class"))) filthy++;
  ok(filthy === 12, "Babble Brew: somethin' filthy gets out every time (" + said("I need to check the clock before class") + ")");
  D.end("babble");

  // Deep Throat Drops: the mouth counts double, and nothing else does
  s.needle(OWNER, "Deep Throat Drops");
  s.w.ActivitySetArousalTimer(P, {}, "ItemMouth", 5);
  const mouth = s.game.timer;
  s.w.ActivitySetArousalTimer(P, {}, "ItemBreast", 5);
  ok(D.active("deepthroat") && mouth === 10 && s.game.timer === 5, "Deep Throat Drops: the mouth counts double (5 → " + mouth + "), the rest as ever");
  ok(s.local.some((t) => /No gag|throat|choke/.test(t)), "...and you feel it go down easy");

  // Rut: back up straight after, and a simmer it won't drop below
  s.needle(OWNER, "Rut Serum x2");
  s.w.ActivityOrgasmStop(P, 0);
  ok(D.active("rut") && P.ArousalSettings.Progress >= 56, "Rut: you go over and bounce straight back up (" + P.ArousalSettings.Progress + ")");
  P.ArousalSettings.Progress = 0; D.tick();
  ok(P.ArousalSettings.Progress >= 30, "...and it never lets you cool right off (" + P.ArousalSettings.Progress + ")");
  D.end("rut");

  // Tender: the spot on the bottle counts triple
  s.needle(OWNER, "Tender Drops (ears)");
  s.w.ActivitySetArousalTimer(P, {}, "ItemEars", 4);
  const ears = s.game.timer;
  s.w.ActivitySetArousalTimer(P, {}, "ItemNeck", 4);
  ok(D.active("tender") && ears === 12 && s.game.timer === 4, "Tender: the ears count triple (4 → " + ears + "), the neck doesn't");
  ok(/ears/.test(s.actions().pop()), "...and the room hears where");
  D.end("tender");
  D.st().tenderSpot = "neck";
  s.needle(OWNER, "Tender Drops");
  s.w.ActivitySetArousalTimer(P, {}, "ItemNeck", 4);
  ok(s.game.timer === 12, "...the spot you picked on the page, when the bottle doesn't say");
  D.end("tender");

  // Hair Trigger and Tender together: they stack
  s.needle(OWNER, "Hair Trigger");
  s.needle(OWNER, "Tender Drops (nipples)");
  s.w.ActivitySetArousalTimer(P, {}, "ItemNipples", 2);
  ok(s.game.timer === 12, "Hair Trigger and Tender together: 2 → 12 on the nipples");
  D.end("hairtrigger"); D.end("tender");

  // time-release capsules
  let na = s.actions().length;
  s.needle(OWNER, "Hiccup Fizz, time-release capsule");
  ok(!D.active("hiccup") && D.st().later.length === 1 && s.actions().slice(na).some((t) => /capsule|small and slow|Not yet|sweet time/.test(t)), "a time-release capsule: nothin' yet, and the room knows somethin's waitin'");
  ok(D.st().later[0].in >= 5 * 60000 && D.st().later[0].in <= 40 * 60000, "...it goes off 5 to 40 minutes on (" + Math.round(D.st().later[0].in / 60000) + " min)");
  D.st().later[0].in = 0; na = s.actions().length; D.tick();
  ok(D.active("hiccup") && D.st().later.length === 0 && s.actions().slice(na).some((t) => /capsule|took its time/.test(t)), "...and when it goes off, the dose hits");
  D.end("hiccup");
  s.needle(OWNER, "Rut Serum, slow-release");
  ok(D.st().later.length === 1, "...slow-release works the same");
  s.cmds.find((c) => c.Tag === "dispensary").Action("safeword");
  ok(D.st().later.length === 0, "...and the safeword clears what's waitin' too");

  // tolerance (yours to switch on)
  D.st().tolerance = true; D.st().taken = {};
  D.give("hiccup", { by: OWNER }); D.end("hiccup");
  D.give("hiccup", { by: OWNER });
  const second = D.leftMs("hiccup");
  ok(second < 15 * 60000 * 0.85 && second > 15 * 60000 * 0.7, "tolerance: the same dose again soon takes less (" + Math.round(second / 60000) + " of 15 min)");
  ok(s.local.some((t) => /gettin' used to/.test(t)), "...and you're told");
  D.end("hiccup");
  D.st().tolerance = false;
  D.give("hiccup", { by: OWNER });
  ok(D.leftMs("hiccup") > 14 * 60000, "...and with it off, a full dose");
  D.end("hiccup");

  // cravings (yours to switch on)
  ok(D.craving() === "", "no cravings till you switch them on");
  D.st().cravings = Date.now() - 1000;
  D.st().taken = {}; for (let i = 0; i < 6; i++) { D.give("feather", { by: OWNER }); D.end("feather"); }
  ok(D.craving() === "feather", "cravings: six doses in three days and you want more of your favourite");
  D.give("moo", { by: OWNER });
  ok(D.craving() === "", "...not while somethin's in you");
  D.end("moo");
  const nl = s.local.length; D.craveNow(); D.tick();
  ok(s.local.slice(nl).some((t) => /Featherlight|needle|flat|edge/.test(t)), "...now and then, a note only you see");
  D.st().cravings = 0;

  // the page
  const dp = s.pages.find((x) => x.Identifier === "FarmhandDispensary");
  dp.load();
  const pg = s.w.document.getElementById("fd-page");
  ok(pg.querySelector("select[aria-label='Where Tender goes']") && /Tolerance/.test(pg.textContent) && /Cravings/.test(pg.textContent) && /time-release/.test(pg.textContent),
    "the page: where Tender goes, tolerance, cravings, and how time-release works");
  ok(["Let-Down", "Fill-Out", "Airhead Elixir", "Babble Brew", "Deep Throat Drops", "Rut", "Tender"].every((l) => pg.textContent.includes(l)), "...and each new dose with its own switch");
  dp.exit();

  // the farm: her hello knows what's in you, and whether you're cravin'
  const f = page({ bot: true }); await wait(1300);
  const F = f.D();
  f.needle(OWNER, "Deep Throat Drops"); await wait(700);
  ok((f.toBot("dispHello").pop() || {}).on.includes("deepthroat"), "on the farm: your Dispensary tells the farm girl what's in you (so a dosed throat doesn't gag)");
  F.st().cravings = Date.now() - 1000; F.st().taken = { rut: [Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now()] };
  F.end("deepthroat"); await wait(700);
  ok((f.toBot("dispHello").pop() || {}).crave === "rut", "...and whether you're cravin', and what (so she can offer)");
  f.fromBot("dose", { id: 9, dose: "rut", x: 1, by: BOT });
  ok(F.active("rut"), "...and her ?fix comes through like any of her calls");

  // LSCG's list takes the new ones, with their soak words
  const reg = {};
  const L = { getModApi: () => ({ drugs: { register: (d) => { reg[d.name] = d; return () => {}; }, dose: () => true }, events: { on() {}, before() {} } }), capabilities: new Set(["core", "events", "drugs"]) };
  page({ lscg: L }); await wait(1300);
  ok(["letdown", "fillout", "airhead", "babble", "deepthroat", "rut", "tender"].every((id) => reg[id] && reg[id].soakKeywords && reg[id].soakKeywords.length), "LSCG's list: every new dose, with its soak words (a rut-soaked gag, a babble-laced bit)");

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
