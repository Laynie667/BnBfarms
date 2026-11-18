// Nov 18 (Laynie: "keep going with everything for the dispensary"): every way to dose (gear that doses, triggers,
// roulette, drinks, lip gloss), crafted parasites (lips, latex, moss, nestling, brood mother, leash vine, mouthpiece),
// poses and senses (Weak Knees, Down Girl, Blinder Drops, Cotton Ears, Tunnel Vision, Haze), and dose icons.
// A pretend game page runs dist/farmhand-dispensary.user.js as player 600 (Hana).
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
  // the game's canvas (the dose icons draw on it): what's written, where, and how big
  const drawnAt = [];
  w.MainCanvas = { save() {}, restore() {}, strokeText() {}, fillRect() {}, strokeRect() {}, measureText: (t) => ({ width: String(t).length * 10 }),
    fillText(t, x, y) { drawnText.push(String(t)); drawnAt.push([String(t), x, y, this.font]); } };
  w.MouseIn = function (x, y, ww, hh) { return !!w.__mouse && w.__mouse[0] >= x && w.__mouse[0] <= x + ww && w.__mouse[1] >= y && w.__mouse[1] <= y + hh; };
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
  return { drawnText, drawnAt, marks, w, sent, local, cmds, synced, faces, pages, game, beeps, needle, fromBot, toBot, to, actions, D: () => w.__disp };
}

(async () => {
  // ---- EVERY WAY TO DOSE (Nov 18, worn.js)
  const s = page(); await wait(1300);
  const D = s.D(), P = s.w.Player, w = s.w;
  const wear = (group, name, desc, by) => { P.Appearance = P.Appearance.filter((i) => i.Asset.Group.Name !== group); P.Appearance.push({ Asset: { Name: "Gear", Group: { Name: group } }, Craft: { Name: name, Description: desc || "", MemberNumber: by || OWNER, MemberName: "Mistress" } }); };
  const off = (group) => { P.Appearance = P.Appearance.filter((i) => i.Asset.Group.Name !== group); };
  const act = (from, name, target) => w.ChatRoomMessage({ Type: "Activity", Sender: from, Content: "ChatOther-ItemMouth-" + name, Dictionary: [{ ActivityName: name }, { TargetCharacter: target || ME }] });
  const acts = () => s.actions().join(" | ");

  // a drip: it keeps the dose in you while it's on
  wear("ItemNeck", "Needy Collar", "a drip of hiccup fizz, always", OWNER);
  D.wornTick();
  ok(D.active("hiccup") && D.leftMs("hiccup") <= 10 * 60000 + 1000 && /seep|leak|drip|soaked/.test(acts()), "a drip in worn gear keeps its dose in you (10 minutes' worth), and the room hears it start");
  const before = s.sent.length; D.wornTick();
  ok(s.sent.length === before, "...and doesn't top up every few seconds (no spam)");
  off("ItemNeck"); D.end("hiccup");

  // an injector: the first dose after the wait, then on its clock
  wear("ItemArms", "Dosing Cuff", "auto-injector: rut serum every 10 minutes", OWNER);
  D.wornTick();
  ok(!D.active("rut"), "an injector waits its time before its first dose");
  D.worn()[0] && (D.wornReset(), D.wornTick());
  ok(!D.active("rut"), "...(still waitin')");
  // jump its clock
  const gear = D.worn().find((g) => g.inject); ok(gear && gear.every === 10, "...every 10 minutes, as its words say");
  D.wornReset(); D.wornTick(); const realNow = w.Date.now; w.Date.now = () => realNow() + 11 * 60000; D.wornTick(); w.Date.now = realNow;
  ok(D.active("rut") && /click|pinch|hiss|goes off/.test(acts()), "...and it goes off on time");
  off("ItemArms"); D.end("rut");

  // somebody not on your list crafted it: nothin', and you're told
  wear("ItemNeck", "Stranger's Collar", "drip of featherlight", STRANGER);
  D.wornTick();
  ok(!D.active("feather") && s.local.some((t) => /not on your list/.test(t)), "gear crafted by somebody not on your list does nothin' (and you're told)");
  off("ItemNeck");

  // triggers
  wear("ItemPelvis", "Climax Belt", "bitterroot tonic on climax", OWNER);
  D.trigger("climax");
  ok(D.active("bitterroot"), "on climax: its dose when you cum");
  D.end("bitterroot");
  wear("ItemPelvis", "Kiss Belt", "hair trigger when kissed", OWNER);
  act(LOVER, "Kiss");
  ok(D.active("hairtrigger") && /kiss/i.test(acts()), "when kissed: a kiss sets it off");
  D.end("hairtrigger");
  wear("ItemPelvis", "Spank Belt", "moo juice when spanked", OWNER);
  act(LOVER, "Spank");
  ok(D.active("moo"), "when spanked: a smack sets it off");
  D.end("moo"); off("ItemPelvis");

  // roulette
  wear("ItemPelvis", "Roulette Belt", "mystery dose on climax", OWNER);
  D.wornReset(); D.trigger("climax");
  ok(D.st() && Object.keys(D.st().doses).length === 1, "roulette: a mystery dose is one of the doses you allow (" + Object.keys(D.st().doses).join(",") + ")");
  for (const id of Object.keys(D.st().doses)) D.end(id);
  off("ItemPelvis");

  // drinks and treats fed to you
  const hand = (by, name) => { const c = w.ChatRoomCharacter.find((x) => x.MemberNumber === by); c.Appearance = [{ Asset: { Name: "Cup", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: "" } }]; };
  hand(OWNER, "Featherlight Cocktail Potion"); act(OWNER, "SipItem");
  ok(D.active("feather"), "a drink fed to you: its words are the dose (Featherlight)");
  D.end("feather");
  hand(OWNER, "Airhead Elixir Bonbon"); act(OWNER, "EatItem");
  ok(D.active("airhead"), "...and a treat (the Airhead Elixir)");
  D.end("airhead");

  // lip gloss
  const lov = w.ChatRoomCharacter.find((x) => x.MemberNumber === LOVER);
  lov.Appearance = [{ Asset: { Name: "Lips", Group: { Name: "ItemMouth" } }, Craft: { Name: "Sweet Lip Gloss", Description: "laced with tender drops", MemberNumber: LOVER } }];
  act(LOVER, "FrenchKiss");
  ok(D.active("tender") && /gloss|lips|shine/i.test(acts()), "lip gloss with a dose in it: their kiss doses you");
  D.end("tender");

  // the safeword: everything out, and the gear rests
  wear("ItemNeck", "Needy Collar", "a drip of hiccup fizz", OWNER);
  D.wornTick(); ok(D.active("hiccup"), "(drip back on)");
  s.cmds.find((c) => c.Tag === "dispensary").Action("safeword");
  D.wornTick();
  ok(!D.active("hiccup") && D.st().wornPause > Date.now(), "the safeword: the drip's dose out, and the gear rests a while before it doses again");
  off("ItemNeck"); D.st().wornPause = 0;

  // ---- CRAFTED PARASITES (Nov 18, parasites.js)
  wear("ItemMouth", "Hungry Lips", "a parasite with needy nectar in its strain", OWNER);
  D.paraTick();
  ok(!D.para().lips, "a parasite doesn't take till you switch that kind on");
  D.st().parasites = { lips: true, latex: true, nestling: true, brood: true, vine: true, mouth: true, moss: true };
  D.paraTick();
  const lips = D.para().lips;
  ok(lips && lips.by === OWNER && lips.strain.includes("needy") && /parasite|lips/i.test(acts()), "switched on: it latches, with its crafter's strain (" + (lips && lips.strain) + ")");
  ok(lips && lips.until - Date.now() > 11 * 3600000, "...for 12 hours");
  off("ItemMouth"); D.paraTick();
  ok(D.para().lips, "...and it stays when the gear comes off: it's in you now");
  lips.next = 0; D.paraTick();
  ok(D.active("needy") || D.st().doses.needy, "...and it feeds you its strain");
  // spreads by a kiss you give
  w.ChatRoomMessage({ Type: "Activity", Sender: ME, Content: "ChatOther-ItemMouth-Kiss", Dictionary: [{ ActivityName: "Kiss" }, { TargetCharacter: LOVER }] });
  ok(s.to(LOVER, "dispPara").some((m) => m.kind === "lips"), "your kiss carries it to whoever you kiss (their Dispensary decides)");

  // somebody else's kiss carryin' one
  const s2 = page(); await wait(1300); const D2 = s2.D();
  s2.fromBot("dispPara", { kind: "lips", strain: ["heat"], by: OWNER, name: "Mistress" }, LOVER);
  ok(!D2.para().lips, "a kiss carryin' one doesn't take if you've not switched that kind on");
  D2.st().parasites = { lips: true };
  s2.fromBot("dispPara", { kind: "lips", strain: ["heat"], by: OWNER, name: "Mistress" }, STRANGER);
  ok(!D2.para().lips, "...nor from somebody not on your list");
  s2.fromBot("dispPara", { kind: "lips", strain: ["heat"], by: OWNER, name: "Mistress" }, LOVER);
  ok(D2.para().lips && D2.para().lips.strain[0] === "heat", "...switched on, from somebody on your list: it takes, their strain and all");

  // livin' latex and the nestling feed on climaxes
  wear("ItemTorso", "Black Suit", "living latex", OWNER); D.paraTick();
  wear("ItemPelvis", "Warm Plug", "a nestling", OWNER); D.paraTick();
  D.climax();
  ok(D.para().latex && D.active("hairtrigger"), "livin' latex drinks your climax, and everything feels more (Hair Trigger)");
  ok(D.para().nestling && D.para().nestling.stage === 1 && D.active("fillout") && w.FarmhandDispensary.dose("fillout").p === "belly", "the nestling grows a stage, and your belly fills out with it");
  D.climax();
  ok(D.para().nestling.stage === 2 && w.FarmhandDispensary.dose("fillout").x === 2, "...and again (stage 2, rounder)");

  // the brood mother lays, and a kiss passes one on
  wear("ItemButt", "Brood Plug", "a brood mother", OWNER); D.paraTick();
  D.para().brood.next = 0; D.paraTick();
  ok(D.para().brood.eggs === 1, "the brood mother lays a little one");
  const n0 = s.to(FRIEND, "dispPara").length;
  w.ChatRoomMessage({ Type: "Activity", Sender: ME, Content: "ChatOther-ItemMouth-Kiss", Dictionary: [{ ActivityName: "Kiss" }, { TargetCharacter: FRIEND }] });
  ok(s.to(FRIEND, "dispPara").length > n0 && D.para().brood.eggs === 0, "...and your next kiss passes it on");

  // the leash vine: on a map, no further than three tiles from its crafter
  w.ChatRoomCharacter.find((x) => x.MemberNumber === OWNER).MapData = { Pos: { X: 10, Y: 10 } };
  wear("ItemNeck", "Vine Collar", "a leash vine", OWNER); D.paraTick();
  ok(w.ChatRoomMapViewCanEnterTile(12, 12) > 0 && w.ChatRoomMapViewCanEnterTile(14, 10) === 0, "the leash vine: you can step near its crafter, not more than three tiles away");
  off("ItemNeck"); D.paraTick();
  ok(!D.para().vine && w.ChatRoomMapViewCanEnterTile(14, 10) > 0, "...and it lets go when its gear comes off");

  // the mouthpiece
  wear("ItemMouth", "Speaking Gag", "a mouthpiece", OWNER); D.paraTick();
  s.fromBot("dispSay", { text: "I love bein' bred" }, OWNER);
  ok(s.local.some((t) => /wants you to say/.test(t)) && !s.sent.some(([e, d]) => d.Type === "Chat" && /bein' bred/.test(d.Content)), "the mouthpiece: its crafter's words, shown to you first");
  s.cmds.find((c) => c.Tag === "dispensary").Action("say");
  ok(s.sent.some(([e, d]) => d.Type === "Chat" && /bein' bred/.test(d.Content)) && s.to(OWNER, "dispSaid").some((m) => m.ok), "...said when you say so, and they're told");
  s.fromBot("dispSay", { text: "only from my crafter" }, LOVER);
  ok(!s.local.some((t) => /only from my crafter/.test(t)), "...only from whoever crafted it");
  D.st().mouthAuto = true;
  s.fromBot("dispSay", { text: "straight through" }, OWNER);
  ok(s.sent.some(([e, d]) => d.Type === "Chat" && d.Content === "straight through"), "...straight through, if you've let it");

  // the safeword takes every parasite off
  s.cmds.find((c) => c.Tag === "dispensary").Action("safeword");
  ok(!Object.keys(D.para()).length, "the safeword: every parasite off at once");

  // ---- POSES AND SENSES (Nov 18, senses.js)
  s.needle(OWNER, "Weak Knees Draught");
  await wait(400);
  ok(D.active("weakknees") && [].concat(P.ActivePose || []).includes("Kneel"), "Weak Knees: down on your knees");
  ok(w.PoseCanChangeUnaidedStatus(P, "BaseLower") === w.PoseChangeStatus.NEVER_WITHOUT_AID && w.PoseCanChangeUnaidedStatus(P, "Kneel") === w.PoseChangeStatus.ALWAYS, "...and standin' up needs somebody's help");
  D.end("weakknees");
  ok(w.PoseCanChangeUnaidedStatus(P, "BaseLower") === w.PoseChangeStatus.ALWAYS, "...till it wears off");
  s.needle(OWNER, "Down Girl Serum");
  await wait(400);
  ok([].concat(P.ActivePose || []).includes("AllFours") && w.PoseCanChangeUnaidedStatus(P, "Kneel") === w.PoseChangeStatus.NEVER_WITHOUT_AID, "Down Girl: on all fours, and you stay down");
  D.end("allfours");
  s.needle(OWNER, "Blinder Drops x2");
  ok(P.GetBlindLevel() === 2, "Blinder Drops: the game's own blindness, darker with a stronger dose (" + P.GetBlindLevel() + ")");
  D.end("blinder");
  ok(P.GetBlindLevel() === 0, "...and back when it's done");
  s.needle(OWNER, "Cotton Ears");
  ok(P.GetDeafLevel() === 2, "Cotton Ears: the game's own deafness");
  D.end("cotton");
  D.st().screen = false;
  s.needle(OWNER, "Tunnel Vision Drops");
  ok(D.screen() === "tunnel", "Tunnel Vision: only a circle in the middle, even with the screen touches off (it's the dose itself)");
  D.end("tunnel"); D.screen(); D.st().screen = true;
  s.needle(OWNER, "Haze Mist");
  D.tick(); w.__disp.haze && w.__disp.haze();
  ok(/blur/.test(w.document.getElementById("MainCanvas").style.filter), "Haze: the game's picture goes soft and blurry");
  D.end("haze"); w.__disp.haze && w.__disp.haze();
  ok(!w.document.getElementById("MainCanvas").style.filter, "...and sharp again when it's done");

  // ---- DOSE ICONS (Nov 18, icons.js)
  s.needle(OWNER, "Rut Serum");
  ok(D.icons(ME).includes("🐂"), "dose icons: yours show what's in you");
  let nIc = s.sent.length; D.iconsTell(true);
  ok(s.sent.slice(nIc).some(([e, d]) => d.Content === "FarmhandMsg" && d.Dictionary.type === "dispIcons" && d.Dictionary.ids.includes("rut")), "...your Dispensary tells the room");
  const iconEv = []; w.addEventListener("farmhand-dispensary", (e) => { if (e.detail && e.detail.type === "icons") iconEv.push(e.detail.from); });
  ok(w.FarmhandDispensary.dosedOf(ME) === true && w.FarmhandDispensary.dosedOf(LOVER) === false, "dosed or not (for glow ink): you with Rut in you, yes; them, not yet");
  s.fromBot("dispIcons", { ids: ["needy", "moo"], para: true }, LOVER);
  ok(w.FarmhandDispensary.dosedOf(LOVER) === true && iconEv.join() === String(LOVER), "...their icons say they're dosed now, and the page is told (their glow ink lights up)");
  const lovC = w.ChatRoomCharacter.find((x) => x.MemberNumber === LOVER); s.drawnText.length = 0;
  w.ChatRoomDrawCharacterStatusIcons(lovC, 100, 100, 1);
  ok(["💗", "🐄", "🪱"].every((t) => s.drawnText.includes(t)), "...and theirs are drawn by them (Needy Nectar, Moo Juice, a parasite)");
  // Laynie, Nov 18: "they are just big": the size of the game's own icons, in its free spots on that top row
  const at = s.drawnAt.filter(([t]) => ["💗", "🐄", "🪱"].includes(t));
  ok(at.length === 3 && at.every(([, x, y, f]) => /\b30px/.test(f) && y === 120) && at[0][1] === 100 + 190 + 20 && at[2][1] === 100 + 190 + 100, "...each the game's icon size, in a row where the game's own leave room (" + at.map((a) => a[1]).join(",") + ")");
  s.drawnText.length = 0; s.drawnAt.length = 0; w.ChatRoomDrawCharacterStatusIcons(lovC, 1000, 0, 0.5);
  ok(s.drawnAt.length === 3 && s.drawnAt.every(([, , , f]) => /\b15px/.test(f)), "...half that on the map, where the game draws its own at half size by the name");
  s.fromBot("dispIcons", { ids: ["needy", "moo", "rut", "heat"], para: true }, LOVER);
  s.drawnText.length = 0; w.ChatRoomDrawCharacterStatusIcons(lovC, 100, 100, 1);
  ok(s.drawnText.join("|") === "💗|🐄|+3", "five things in them: two icons and \"+3\", not a long row (" + s.drawnText.join("|") + ")");
  w.__mouse = [100 + 190 + 10, 110]; s.drawnText.length = 0; w.ChatRoomDrawCharacterStatusIcons(lovC, 100, 100, 1); w.__mouse = null;
  ok(s.drawnText.some((t) => /Needy Nectar/.test(t)) && s.drawnText.some((t) => /🪱 A parasite/.test(t)) && s.drawnText.filter((t) => /^\S+ [A-Z]/.test(t)).length === 5, "...hover them: every one, by name");
  s.fromBot("dispIcons", { ids: ["needy", "moo"], para: true }, LOVER);
  D.st().iconsShow = false; s.drawnText.length = 0; w.ChatRoomDrawCharacterStatusIcons(lovC, 100, 100, 1);
  ok(!s.drawnText.length, "...not if you've switched the icons off");
  D.st().iconsShow = true; D.st().iconsShare = false; nIc = s.sent.length; D.iconsTell(true);
  ok(s.sent.slice(nIc).some(([e, d]) => d.Content === "FarmhandMsg" && d.Dictionary.type === "dispIcons" && !d.Dictionary.ids.length), "...and nobody sees yours if you'd rather they didn't");
  D.st().iconsShare = true; D.end("rut");

  // the page
  const dp = s.pages.find((x) => x.Identifier === "FarmhandDispensary"); dp.load();
  const pg = w.document.getElementById("fd-page");
  ok(/Gear, drinks and kisses/.test(pg.textContent) && /Parasites/.test(pg.textContent) && pg.querySelectorAll("input[type=checkbox]").length >= 7, "the page: gear, and a switch for each kind of parasite");
  dp.exit();

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
