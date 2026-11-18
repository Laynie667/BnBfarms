// THE NIPPLE TOYS (Nov 18). Laynie: "maybe make them plug able with certain toys? like beads, dildos, vibrators, etc?
// we can look them over and possibly create assets that look good for each option", "I mean art for existing items",
// "the dildos could look more like how the plugs do". The game's own toys, in the game's nipple slot, only into open
// nipples, holdin' them open while they're in.
const fs = require("fs"), path = require("path"), os = require("os");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ROOT = path.join(__dirname, "..");

(async () => {
  // ── toys.js on a stand-in game ──
  const esbuild = require("esbuild"), tmp = path.join(os.tmpdir(), "fh-toys-" + process.pid + ".cjs");
  await esbuild.build({ entryPoints: [path.join(ROOT, "dispensary/src/toys.js")], bundle: true, format: "cjs", outfile: tmp, logLevel: "silent" });
  const added = [], hooks = {};
  const W = global.window = {
    AssetGroupMap: new Map([["ItemNipples", { Name: "ItemNipples", Asset: [] }]]),
    AssetFemale3DCG: [
      { Group: "ItemNipples", Asset: [{ Name: "NippleSuctionCups" }] },
      { Group: "ItemButt", Asset: [{ Name: "AnalBeads2", Time: 14, Fetish: ["Metal"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] }, { Name: "ButtPlugLock", Difficulty: 50, RemoveTime: 50, Time: 30 }, "BlackButtPlug"] },
      { Group: "ItemVulva", Asset: [{ Name: "PenisDildo", Audio: "LeatherCreak" }] },
    ],
    AssetFemale3DCGExtended: { ItemNipples: {} },
    AssetAdd(G, def, ext, gdef) { const a = { Name: def.Name, Description: def.Name, Group: G, def }; G.Asset.push(a); added.push([def, gdef.Group]); return a; },
    AssetBaseURL: () => "Assets/Female3DCG/x/", AssetGetPreviewPath: () => "Assets/Female3DCG/x/Preview", AssetBuildDescription: () => {}, AssetLoadAll: () => {},
    InventoryAvailable: (C, name, group) => C.Inventory.some((i) => i.Name === name && i.Group === group),
    InventoryPrerequisiteMessage: () => "OTHER", InterfaceTextGet: (k) => "MISSING " + k, ServerSend: (ev, d) => hooks.sent.push([ev, d]),
  };
  hooks.sent = [];
  const mod = { hookFunction(fn, pri, h) { const orig = W[fn]; W[fn] = function (...args) { return h(args, (a) => orig.apply(this, a)); }; } };
  const T = require(tmp); fs.unlinkSync(tmp);
  const L = require(path.join(ROOT, "dispensary/src/toys-list.js").replace(/\.js$/, ".js"));
  let open = 0;
  T.initToys(mod, { nipsOpen: () => open, openOf: () => open });
  const G = W.AssetGroupMap.get("ItemNipples"), byName = (n) => added.find(([d]) => d.Name === n);
  ok(added.length === 15 && added.every(([, g]) => g === "ItemNipples") && G.Asset.length === 15, "fifteen of the game's toys, in the game's own nipple slot");
  ok(added.every(([d]) => d.Prerequisite.join() === "AccessBreast,FarmNipsOpen" && d.Value === -1 && d.Layer[0].Name === "Toy"), "...each needs the chest bare and the nipples open, and isn't sold on its own");
  const bx = byName("FarmNipBeadsXL")[0], lk = byName("FarmNipLockPlug")[0], pd = byName("FarmNipPumpDildo")[0], dl = byName("FarmNipDildo")[0];
  ok(bx.CreateLayerTypes.join() === "typed" && W.AssetFemale3DCGExtended.ItemNipples.FarmNipBeadsXL.CopyConfig.AssetName === "AnalBeads2" && bx.Time === 14 && bx.Fetish.join() === "Metal", "the beads: the game's bead count (a picture each), and the game's own beads' feel");
  ok(pd.Layer[0].CreateLayerTypes.join() === "f" && W.AssetFemale3DCGExtended.ItemNipples.FarmNipPumpDildo.Archetype === "modular" && pd.Effect.includes("UseRemote"), "the pump-ups: the game's inflate and vibrate settings, a picture for how pumped up");
  ok(W.AssetFemale3DCGExtended.ItemNipples.FarmNipEgg.Archetype === "vibrating" && !W.AssetFemale3DCGExtended.ItemNipples.FarmNipPlug, "the vibes take the game's remote; the plain ones have no settings");
  ok(lk.AllowLock === true && lk.IsRestraint === true && lk.Difficulty === 50 && !dl.AllowLock, "the lock plug takes a lock");
  ok(G.Asset.find((a) => a.Name === "FarmNipDildo").Description === "Nipple Dildo", "...and each has its name in the wardrobe");
  ok(W.AssetBaseURL(null, null, "ItemNipples", "", {}, "", { Name: "FarmNipDildo" }) === "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/toys/v1/ItemNipples/" && W.AssetBaseURL(null, null, "ItemNipples", "", {}, "", { Name: "NippleSuctionCups" }) === "Assets/Female3DCG/x/", "their pictures from the repo; the game's own nipple items as ever");
  ok(W.AssetGetPreviewPath({ Name: "FarmNipEgg", Group: { Name: "ItemNipples" } }).endsWith("/toys/v1/ItemNipples/Preview"), "...the wardrobe's preview too");
  const C = { MemberNumber: 9, Inventory: [], Appearance: [], IsPlayer: () => true };
  ok(!W.InventoryAvailable(C, "FarmNipBeadsXL", "ItemNipples"), "nobody owns the nipple beads without the game's beads");
  C.Inventory.push({ Name: "AnalBeads2", Group: "ItemButt" });
  ok(W.InventoryAvailable(C, "FarmNipBeadsXL", "ItemNipples") && !W.InventoryAvailable(C, "FarmNipDildo", "ItemNipples"), "...own the game's Anal Beads XL and they're yours; the dildo isn't");
  ok(W.InventoryPrerequisiteMessage(C, "FarmNipsOpen") === "FarmNipsShut" && W.InterfaceTextGet("PrerequisiteFarmNipsShut").includes("aren't open"), "shut nipples: no toy goes in, and the menu says why");
  open = 2;
  ok(W.InventoryPrerequisiteMessage(C, "FarmNipsOpen") === "" && W.InventoryPrerequisiteMessage(C, "AccessBreast") === "OTHER", "open: in it goes (the game's own checks as ever)");
  open = 0; C.Appearance = [{ Asset: { Name: "FarmNipPlug", Group: { Name: "ItemNipples" } } }];
  ok(W.InventoryPrerequisiteMessage(C, "FarmNipsOpen") === "", "one already in: swappin' it for another is fine");
  W.ServerSend("ChatRoomChat", { Type: "Action", Content: "ActionUse", Dictionary: [{ SourceCharacter: 1 }, { Tag: "NextAsset", AssetName: "FarmNipBeadsXL", GroupName: "ItemNipples" }, { Tag: "Other", AssetName: "NippleSuctionCups", GroupName: "ItemNipples" }] });
  const dict = hooks.sent[0][1].Dictionary;
  ok(dict[1].Tag === "NextAsset" && dict[1].Text === "nipple beads xl" && !dict[1].AssetName && dict[2].AssetName === "NippleSuctionCups", "in chat everybody reads the toy's name, even without the Dispensary");
  ok(L.toyOpen(C) === 3 && L.toyOpen({ Appearance: [{ Asset: { Name: "FarmNipPumpPlug", Group: { Name: "ItemNipples" } }, Property: { InflateLevel: 0 } }] }) === 2 &&
    L.toyOpen({ Appearance: [{ Asset: { Name: "FarmNipPumpPlug", Group: { Name: "ItemNipples" } }, Property: { InflateLevel: 3 } }] }) === 3 && L.toyOpen({ Appearance: [] }) === 0, "how wide each holds them: a plug three, a pump-up wider the more it's pumped");

  // ── their pictures: every toy, size and state, in the repo ──
  const dir = path.join(ROOT, "toys/v1/ItemNipples"), missing = [];
  for (const t of L.TOYS) { const sts = t.states ? L.STATES[t.states] : [null]; for (const sz of L.SIZES) for (const st of sts) { const f = t.id + "_" + sz + (st ? "_" + st : "") + "_Toy.png"; if (!fs.existsSync(path.join(dir, f))) missing.push(f); } if (!fs.existsSync(path.join(dir, "Preview", t.id + ".png"))) missing.push("Preview/" + t.id + ".png"); }
  ok(!missing.length, "every picture the game will ask for is there (" + missing.slice(0, 4).join(", ") + ")");
  const art = fs.readFileSync(path.join(ROOT, "tools/nipple-toys-art.js"), "utf8");
  ok(L.TOYS.every((t) => art.includes('id: "' + t.id + '", from: ["' + t.from[0] + '", "' + t.from[1] + '"]')) && L.TOYS.every((t) => new RegExp("\\b" + t.id + "\\(g,").test(art)), "...drawn by the art tool from the same list, each its own drawing");

  // ── in the Dispensary: they hold them open, the balm and /dispensary nips close, and no fuckin' a plugged nipple ──
  const src = fs.readFileSync(path.join(ROOT, "dist/farmhand-dispensary.user.js"), "utf8");
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: 600, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: 700 }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 50 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  const other = { MemberNumber: 700, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true };
  w.ChatRoomCharacter = [w.Player, other];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function () {}; w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  let updated = 0; w.InventoryRemove = (C, g) => { C.Appearance = C.Appearance.filter((i) => i.Asset.Group.Name !== g); }; w.CharacterRefresh = () => {}; w.ChatRoomCharacterItemUpdate = () => updated++;
  w.eval(src); await wait(1300);
  const D = w.__disp; D.nipsAddOwn();
  const cmd = (a) => cmds.find((x) => x.Tag === "dispensary").Action(a);
  const toy = (name, prop) => ({ Asset: { Name: name, Group: { Name: "ItemNipples" } }, Property: prop || {} });
  ok(D.nips() === 0, "shut, to start");
  w.Player.Appearance = [toy("FarmNipPlug")];
  ok(D.nips() === 3, "a plug in them: held open three wide");
  ok(w.ActivityCheckPrerequisite("FarmDispNipsOpen", other, w.Player) === false, "...and nobody can fuck or finger a nipple that's plugged");
  local.length = 0; cmd("nips");
  ok(local.some((l) => /Black Nipple Plug/.test(l)), "/dispensary nips: says what's in them (" + local.join(" | ").slice(0, 160) + ")");
  w.Player.Appearance = [toy("FarmNipLockPlug", { LockedBy: "MetalPadlock" })];
  local.length = 0; cmd("nips close");
  ok(local.some((l) => /locked in/.test(l)) && w.Player.Appearance.length === 1 && D.nips() === 3, "a locked plug: closin' them won't, it's holdin' them open (its key first)");
  w.Player.Appearance = [toy("FarmNipDildo")]; updated = 0;
  local.length = 0; cmd("nips close");
  ok(!w.Player.Appearance.length && updated === 1 && local.some((l) => /Nipple Dildo/.test(l) && /close up/.test(l)) && D.nips() === 0, "unlocked: closin' them pushes the dildo out, and the room's told it's gone");
  w.Player.Appearance = [toy("FarmNipEgg")]; sent.length = 0;
  D.give("balm", { by: 700, quiet: false });
  const bl = sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => JSON.stringify(d.Dictionary)).join(" ");
  ok(!w.Player.Appearance.length && /Nipple Vibrating Egg|vibrating egg/i.test(bl), "the Tightening Balm: draws them closed and squeezes the egg right out");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
