// HOLE TRAINING, ANYWHERE (Nov 18). Laynie: "if we can do the hole training better, i would love to explore that idea",
// then all seven ideas, too big goes in "aching, sometimes even painful", a "cruel" or "sadist" tag, the heal switch
// off to start, and goals from "anyone who can dose". Also: the settings a reload used to forget.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700, STRANGER = 999, BOT = 260239, MIN = 60000, HOUR = 3600000, DAY = 86400000;

async function boot(settings) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [], evs = [], pumps = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: settings || {}, Ownership: { MemberNumber: OWNER }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, HasVagina: () => true, Appearance: [] };
  w.ChatRoomCharacter = [w.Player, { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true }, { MemberNumber: STRANGER, Name: "Rando", Appearance: [], IsPlayer: () => false, HasPenis: () => true }];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function (C, n) { C.ArousalSettings.Progress = n; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.InventoryPrerequisiteMessage = () => "";
  w.ExtendedItemSetOptionByRecord = (C, item, rec) => { pumps.push(rec); item.Property = item.Property || {}; item.Property.TypeRecord = Object.assign({}, item.Property.TypeRecord, rec); const n = rec.f != null ? rec.f : rec.typed; if (item.Asset.Name === "AnalBeads2") item.Property.InsertedBeads = n + 1; else item.Property.InflateLevel = n; };
  w.addEventListener("farmhand-dispensary", (e) => evs.push(e.detail));
  w.eval(src); await wait(1300);
  return { w, sent, local, cmds, evs, pumps, D: w.__disp };
}

(async () => {
  // ── the rule book ──
  const H = await import(require("url").pathToFileURL(path.join(__dirname, "../shared/holes.js")).href);
  const item = (group, asset, name, by, prop) => ({ Asset: { Name: asset, Group: { Name: group }, Description: asset }, Craft: name ? { Name: name, Description: "", MemberNumber: by || OWNER } : undefined, Property: prop || {} });
  const t1 = H.toyIn(item("ItemButt", "BlackButtPlug", "Huge Training Plug"), "huge training plug | ");
  ok(t1 && t1.hole === "butt" && t1.size === 5 && t1.trainer && !t1.cruel, "a Huge Training Plug: the game's black plug (3) two sizes up, and a trainer (" + JSON.stringify(t1 && [t1.size, t1.trainer]) + ")");
  const t2 = H.toyIn(item("ItemButt", "ButtPump", "Pump", 0, { InflateLevel: 3 }), "pump | ");
  ok(t2 && t2.size === 8 && t2.pump && t2.pump.n === 3 && !t2.trainer, "the game's butt pump on Bloated: size 8, a pump, not a trainer till it's crafted as one");
  ok(H.toyIn(item("ItemMouth", "DildoPlugGag", "", 0, { TypeRecord: { typed: 0 } }), "") === null && H.toyIn(item("ItemMouth2", "DildoPlugGag", "", 0, { TypeRecord: { typed: 1 } }), "").size === 4, "a dildo plug gag: nothin' in your throat left open, size 4 with its plug in (any mouth slot)");
  const t3 = H.toyIn(item("ItemVulva", "VibratingDildo", "Sadist's Toy"), "sadist's toy | ");
  ok(t3 && t3.cruel && t3.trainer, "a sadist's toy is cruel, and cruel trains");
  ok(H.toyIn(item("ItemTorso", "HempRope"), "") === null && H.toyIn(item("ItemVulva", "ClitSuctionCup"), "") === null, "rope, or a clit cup, isn't in a hole");
  const g1 = H.goalIn("trainer plug | goal: gaping in 3 days", "butt"), g2 = H.goalIn("train her to loose by friday", "vulva"), g3 = H.goalIn("deepthroat trainer, train them to past gaggin'", "throat");
  ok(g1 && g1.to === 7 && g1.inMs === 3 * DAY, "\"goal: gaping in 3 days\": gaping (7), three days");
  ok(g2 && g2.to === 5 && g2.inMs > 0 && g2.inMs <= 8 * DAY, "\"train her to loose by friday\": loose (5), by friday");
  ok(g3 && g3.to === 9, "a throat: \"past gaggin'\" is 9");
  ok(H.goalIn("it stays in till it's done", "butt") === null && H.goalSize("butt", "size 12") === 10, "\"till it's done\" isn't a goal; a goal past natural is natural");
  ok([0, 1, 2, 3, 4].map((d) => H.hurtOf(d, false, true)).join() === "0,1,2,3,3" && H.hurtOf(1, true, true) === 3 && H.hurtOf(0, true, true) === 2 && H.hurtOf(4, true, false) === 2,
    "how it feels: fits, a good stretch, aches, hurts; cruel always hurts (aches even when it fits); with hurtin' off, never past an ache");
  ok([1, 2, 3, 5].map((d) => H.rateOf(d)).join() === "1,1.5,2,2" && H.rateOf(0) === 0 && H.rateOf(2, true) === 2.25, "trainin' speed: 12 h, 8 h, 6 h a size by how much bigger; none if it isn't; cruel half again");
  ok(H.useOf("MasturbateFist").size === 7 && H.useOf("PenetrateSlow", "LargeDildo").kind === "toy" && H.useOf("PenetrateFast", "Penis", "").cock && H.useOf("Kiss") === null, "use: a fist is 7, a large dildo's a toy, a cock's a cock, a kiss is nothin'");

  // ── a trainer goes in ──
  let { w, sent, local, cmds, evs, pumps, D } = await boot();
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text || "");
  const hidden = (from, type, data) => w.ChatRoomMessage({ Type: "Hidden", Sender: from, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) });
  const farmMsgs = (type) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Dictionary.type === type).map(([, d]) => d);
  const A = w.Player.ArousalSettings;
  let now = Date.now() + HOUR;
  const run = (mins, step) => { step = step || 5; for (let i = 0; i < mins / step; i++) { now += step * MIN; D.holesTick(now); } };
  const hb = () => D.holes().holes.butt, hv = () => D.holes().holes.vulva;
  D.holesReset();
  ok(hb().now === 1 && hb().trained === 1 && hv() && D.holes().holes.throat.trained === 2, "fresh: a tight pussy and ass, a tight throat (the farm's start sizes)");
  sent.length = 0; local.length = 0;
  w.Player.Appearance = [item("ItemButt", "BlackButtPlug", "Training Plug")];
  D.holesTick(now);
  ok(hb().now === 3 && hb().trained === 1 && hb().toy.feel === "2" && hb().toy.trainer, "a Training Plug in a tight ass: stretched to its size (3), trained still 1, and it aches");
  ok(actions().some((l) => /Training Plug/.test(l) && /ach|whimper|fights/i.test(l)), "...the room sees it go in, achin' (" + actions().slice(-1)[0] + ")");
  run(8 * 60);
  ok(hb().trained === 2, "eight hours at two sizes bigger: trained a size (" + hb().trained + ")");
  ok(actions().some((l) => /snug/.test(l) && /Training Plug/.test(l)), "...and the room hears it's stayed snug for good");
  run(12 * 60);
  ok(hb().trained === 3, "twelve more at one size bigger: another (" + hb().trained + ")");
  run(24 * 60);
  ok(hb().trained === 3 && hb().toy.feel === "0", "it can't train past its own size: it just fits now");
  const st0 = D.holesState();
  ok(st0.pend.some((o) => o.h === "butt" && o.up >= 2) && st0.pend.some((o) => o.h === "butt" && o.st === 3), "every change waits to be handed to the farm girl (" + JSON.stringify(st0.pend) + ")");

  // ── too big, and cruel ──
  sent.length = 0; local.length = 0;
  w.Player.Appearance = [item("ItemButt", "DemonPlug", "Monster Plug")];
  D.holesTick(now += 5000);
  ok(hb().toy.size === 7 && hb().toy.feel === "3" && actions().some((l) => /hurt|burn|cries|split|sob|wrench/i.test(l)), "a Monster Plug (the demon plug, 4, three sizes up) on a 3: it goes in, and it hurts (" + actions().slice(-1)[0] + ")");
  A.Progress = 50; run(11, 1);
  ok(A.Progress < 50, "...and while it's in, the hurt knocks your arousal down (" + A.Progress + ")");
  D.holesCmd("pain", "off");
  ok(hb().toy.feel === "2", "\"Too-big toys can hurt\" off: the same plug only aches");
  D.holesCmd("pain", "on");
  sent.length = 0;
  w.Player.Appearance = [item("ItemButt", "BlackButtPlug", "Cruel Plug")];
  D.holesTick(now += 5000);
  ok(hb().toy.feel === "cruel" && hb().toy.cruel && actions().some((l) => /cruel|mean|enjoy|savour|twist/i.test(l)), "a Cruel Plug that fits: cruel to you all the same (" + actions().slice(-1)[0] + ")");

  // ── a pump that grows with you, to its goal ──
  D.holesReset(); sent.length = 0; pumps.length = 0;
  const pump = item("ItemButt", "ButtPump", "Trainer Pump, goal: loose", OWNER, { InflateLevel: 0, TypeRecord: { typed: 0 } });
  w.Player.Appearance = [pump];
  D.holesTick(now += 5000);
  ok(hb().toy.pump && hb().goal && hb().goal.to === 5 && hb().now === 2, "a Trainer Pump with \"goal: loose\" on Empty: size 2, goal loose");
  run(13 * 60);
  ok(hb().trained === 2 && pumps.length === 1 && pump.Property.InflateLevel === 1 && hb().now === 4, "caught up with it: it pumps itself up a notch (" + JSON.stringify(pumps) + ", now " + hb().now + ")");
  ok(actions().some((l) => /hiss|swell|pump/i.test(l) && /Trainer Pump/.test(l)), "...and the room hears it swell");
  run(30 * 60);
  ok(hb().trained === 5 && pump.Property.InflateLevel === 2, "and again, till it's trained them loose (" + hb().trained + ", notch " + pump.Property.InflateLevel + ")");
  ok(actions().some((l) => /loose/.test(l) && /done|eases|still|rest/i.test(l)), "...the goal's met: it eases off, done with them");
  run(24 * 60);
  ok(hb().trained === 5 && pump.Property.InflateLevel === 2 && !hb().goal, "and it stays done: no more pumpin', no more trainin' past the goal");

  // ── goals somebody sends ──
  sent.length = 0; local.length = 0;
  D.trainCmd("me pussy gaping in 3 days");
  ok(hv().goal && hv().goal.to === 7 && Math.abs(hv().goal.due - Date.now() - 3 * DAY) < MIN, "/dispensary train me pussy gaping in 3 days: your own goal");
  D.trainCmd("me ass snug");
  ok(/already that open/.test(local.join(" ")), "a goal you're already past: it says so");
  D.trainCmd("Mistress ass loose by friday");
  const tr = farmMsgs("dispTrain").pop();
  ok(tr && tr.Target === OWNER && tr.Dictionary.h === "butt" && tr.Dictionary.to === 5 && tr.Dictionary.due > 0, "a goal for somebody else: sent to their Dispensary");
  sent.length = 0; local.length = 0;
  hidden(OWNER, "dispTrain", { h: "throat", to: 6, due: 0 });
  ok(D.holes().holes.throat.goal && D.holes().holes.throat.goal.to === 6 && D.holes().holes.throat.goal.by === OWNER && /Mistress has set you a trainin' goal: your throat, trained/.test(local.join(" ")), "your owner sends one: it's yours now, and you're told");
  ok(farmMsgs("dispTrainOk").some((d) => d.Target === OWNER && d.Dictionary.ok), "...and they're told it took");
  hidden(STRANGER, "dispTrain", { h: "butt", to: 9, due: 0 });
  ok(!(hb().goal && hb().goal.to === 9) && /Rando tried to set you a trainin' goal, but they aren't on your list/.test(local.join(" ")), "somebody who can't dose you: refused, and you're told");
  // a deadline works you harder
  D.holesReset(); w.Player.Appearance = [item("ItemVulva", "PenisDildo", "Training Dildo")];
  D.holesTick(now += 5000); D.setGoal("vulva", 3, OWNER, 12 * HOUR); run(12 * 60);
  ok(hv().trained === 3, "a goal two sizes up in twelve hours, on a dildo that'd take a day: it works them harder, and gets there (" + hv().trained + ")");
  w.Player.Appearance = [];

  // ── use ──
  D.holesReset(); sent.length = 0; local.length = 0;
  const r1 = D.holesUsed(OWNER, "MasturbateFist", "ItemVulva", "", "");
  ok(r1 && hv().now === 7 && r1.felt === 3 && /Mistress's fist/.test(local.join(" ")), "your owner's fist in a tight pussy: stretched to 7, and it hurts (" + local.slice(-1)[0] + ")");
  ok(D.holesState().m.vulva.cr > 0 && hv().trained === 1, "...and it trains it a little");
  ok(D.holesUsed(OWNER, "MasturbateFist", "ItemVulva", "", "") === null, "the same again at once: counted once");
  w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "ChatOther-ItemButt-PenetrateSlow", Dictionary: [{ SourceCharacter: OWNER }, { TargetCharacter: ME }, { Tag: "FocusAssetGroup", FocusGroupName: "ItemButt" }, { Tag: "ActivityAsset", AssetName: "Penis", GroupName: "Pussy" }, { ActivityName: "PenetrateSlow" }] });
  ok(hb().now === 3, "the game's own action: her cock in your ass stretches it (" + hb().now + ")");
  // a load: kept by a tight hole, drips from a loose one
  local.length = 0;
  w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "Orgasm3", Dictionary: [{ SourceCharacter: OWNER }] });
  ok(/Mistress/.test(local.join(" ")) && /keep|clench|tight/i.test(local.join(" ")) && !D.holesDrips().length, "she cums: your ass is still tight enough to keep it (" + local.slice(-1)[0] + ")");
  D.holesSet("butt", 6); sent.length = 0; evs.length = 0;
  D.holesUsed(OWNER, "PenetrateFast", "ItemButt", "Penis", "");
  w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "Orgasm1", Dictionary: [{ SourceCharacter: OWNER }] });
  ok(D.holesDrips().length === 1, "loose now: her load won't stay");
  run(3);
  ok(actions().some((l) => /Mistress/.test(l) && /run|dribble|trickle|leak/i.test(l)) && evs.some((e) => e.type === "leak" && e.areas.includes("thighs")), "...a minute or two later it drips back out, for the room and the Companion");

  // ── the room notices ──
  D.holesSet("vulva", 1);   // (the fist left her pussy gapin' too: only the ass, so the room's sure to pick it)
  sent.length = 0; run(100);
  ok(actions().some((l) => /Hana's ass/.test(l) && /loose|open|used/i.test(l)), "a loose ass, bare: now and then the room notices (" + actions().filter((l) => /Hana's ass/.test(l)).slice(-1)[0] + ")");

  // ── the Tightening Balm ──
  sent.length = 0;
  w.ChatRoomCharacter[1].Appearance = [{ Asset: { Name: "Syringe", Group: { Name: "ItemHandheld" } }, Craft: { Name: "Ass Tightener", Description: "", MemberNumber: OWNER } }];
  w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] });
  ok(hb().trained === 4 && hb().now === 4 && actions().some((l) => /tight/i.test(l) && /ass/.test(l)), "an Ass Tightener needle: trained two sizes back (6 to 4), closed up to it (" + JSON.stringify([hb().now, hb().trained]) + ")");
  w.ChatRoomCharacter[1].Appearance = [];

  // ── handin' it to the farm girl ──
  sent.length = 0;
  w.ChatRoomCharacter.push({ MemberNumber: BOT, Name: "Farm Girl", Appearance: [], IsPlayer: () => false, HasPenis: () => false });
  D.holesSend(true);
  const hm = farmMsgs("dispHoles").pop();
  ok(hm && hm.Target === BOT && hm.Dictionary.id >= 1 && hm.Dictionary.ops.length && /^[a-z0-9]{4,12}$/.test(hm.Dictionary.ep), "the farm girl's here: everything waitin' goes to her in one go, under one number (" + (hm && hm.Dictionary.ops.length) + " changes)");
  hidden(STRANGER, "dispHolesOk", { id: hm.Dictionary.id, sizes: { butt: [9, 9] } });
  ok(hb().trained === 4 && D.holesState().fly, "an answer from somebody else: ignored");
  hidden(BOT, "dispHolesOk", { id: hm.Dictionary.id, sizes: { vulva: [7, 2], butt: [5, 4], throat: [2, 2] }, has: ["vulva", "butt", "throat"] });
  ok(!D.holesState().fly && !D.holesState().pend.length && hv().now === 7 && hv().trained === 2 && hb().now === 5, "she has it: her numbers are yours now");
  w.ChatRoomCharacter.pop();

  // ── the safeword ──
  D.setGoal("butt", 8, OWNER, 0);
  cmds[0].Action("safeword");
  ok(!hb().goal, "the safeword lifts every trainin' goal");

  // ── healin' (off to start) ──
  D.holesReset(); D.holesSet("butt", 5);
  const S0 = D.st(); S0.holes.m.butt.t = now - 3 * DAY; S0.holes.m.butt.g = now - 3 * DAY;
  run(2 * 24 * 60, 15);
  ok(hb().trained === 5, "heal off (to start): left be two days, it stays as it's trained");
  D.holesCmd("heal", "on"); local.length = 0;
  run(2 * 24 * 60 + 30, 15);
  ok(hb().trained === 4 && D.holesState().pend.some((o) => o.down === 1) && /tightened|closed up|tighter/.test(local.join(" ")), "heal on: half a size a day, and you're told (" + hb().trained + ")");

  // ── a reload remembers ──
  const S = D.st();
  S.nipTrain = { lvl: 2, at: Date.now(), open: 0, used: 0 }; S.nipsHeal = false; S.kitsOn = true; S.kitSpeed = "fast"; S.hornyOn = false; S.kits = { latex: "abc" };
  S.kit = { key: "latex", flav: "living", by: OWNER, old: [{ Group: "Cloth", Name: "Dress" }], pieces: [{ Group: "Suit", Name: "Latex" }], queue: [], next: 0, at: 1, done: true };
  D.setGoal("vulva", 6, OWNER, DAY);
  cmds[0].Action("holes pain off");
  await wait(1800);
  const saved = JSON.parse(JSON.stringify(w.Player.ExtensionSettings));
  ({ w, D } = await boot(saved));
  const R = D.st();
  ok(R.nipTrain && R.nipTrain.lvl === 2 && R.nipsHeal === false, "after a reload: your nipples' trained stretch and their switch are still there");
  ok(R.kitsOn === true && R.kitSpeed === "fast" && R.hornyOn === false && R.kits.latex === "abc", "...the Kits and Horny switches, kit speed, your saved kits");
  ok(R.kit && R.kit.key === "latex" && R.kit.old[0].Name === "Dress", "...the kit on you, and the old outfit it's holdin' for you");
  ok(R.holes && R.holes.m.butt.u === 4 && R.holes.goals.vulva.to === 6 && R.holesHeal === true && R.holesPain === false && R.holes.pend.length, "...and your holes: trained sizes, goals, switches, and what's waitin' for the farm girl");

  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all passed"); process.exit(fails ? 1 : 0);
})();
