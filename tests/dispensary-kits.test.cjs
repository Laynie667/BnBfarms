// KITS (Nov 18). Laynie: "lscg imports outfits, so maybe ones saved there, to utilize them similar to lscg curses"; when
// it's over "your old outfit slips back on"; a "Kits can dress me" switch off to start: "sounds good, and yes"; "maybe set
// a few speed options".
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700, LOVER = 701;

(async () => {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  // a stand-in wardrobe: clothes, restraints, a body
  const GROUPS = { Cloth: { Category: "Appearance", Clothing: true }, ClothLower: { Category: "Appearance", Clothing: true }, Shoes: { Category: "Appearance", Clothing: true },
    ItemArms: { Category: "Item" }, ItemMouth: { Category: "Item" }, ItemNeck: { Category: "Item" }, BodyUpper: { Category: "Appearance", Clothing: false }, FarmInk1: { Category: "Appearance", Clothing: false, BodyCosplay: true } };
  for (const [n, g] of Object.entries(GROUPS)) g.Name = n;
  w.AssetGroupGet = (f, n) => GROUPS[n] || null;
  w.AssetGet = (f, g, n) => (GROUPS[g] ? { Name: n, Group: GROUPS[g], Description: n.replace(/([a-z])([A-Z])/g, "$1 $2"), Category: [] } : null);
  w.InventoryGet = (C, g) => C.Appearance.find((i) => i.Asset.Group.Name === g) || null;
  let updates = 0;
  w.InventoryWear = (C, name, group, color, diff, mn, craft) => { const A = w.AssetGet("Female3DCG", group, name); if (!A) return null; C.Appearance = C.Appearance.filter((i) => i.Asset.Group.Name !== group); const it = { Asset: A, Color: color, Difficulty: diff, Craft: craft, Property: {} }; C.Appearance.push(it); return it; };
  w.InventoryRemove = (C, g) => { C.Appearance = C.Appearance.filter((i) => i.Asset.Group.Name !== g); };
  w.ChatRoomCharacterItemUpdate = () => updates++; w.ChatRoomCharacterUpdate = () => updates++; w.CharacterRefresh = () => {};
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  const owner = { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true };
  w.ChatRoomCharacter = [w.Player, owner, { MemberNumber: LOVER, Name: "Lov", Appearance: [], IsPlayer: () => false }];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function () {}; w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.eval(src); await wait(1300);
  const D = w.__disp, P = w.Player;
  const wear = (g, n, extra) => Object.assign(w.InventoryWear(P, n, g, "Default", 0, ME, null), extra || {});
  const worn = (g) => { const i = w.InventoryGet(P, g); return i ? i.Asset.Name : null; };
  const needle = (name) => { owner.Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: "" } }];
    w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] }); };
  const hidden = (from, type, data) => w.ChatRoomMessage({ Type: "Hidden", Sender: from, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) });
  const msgs = (type) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Dictionary.type === type).map(([, d]) => d);
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text || "");
  const pack = (b) => Buffer.from(JSON.stringify(b)).toString("base64");
  let now = Date.now();

  // what she's wearin' to start
  P.Appearance = []; wear("BodyUpper", "Normal"); wear("Cloth", "TShirt"); wear("Shoes", "Sneakers"); wear("FarmInk1", "KnotSlave");

  needle("Kit: Bunny Set");
  ok(!D.active("kit") && !msgs("dispKitAsk").length && worn("Cloth") === "TShirt", "\"Kits can dress me\" off (as it starts): a kit dose doesn't take");
  ok(D.st().kitsOn !== true, "...it's off to start");
  D.kitCmd("on"); D.kitCmd("speed fast");
  ok(D.st().kitsOn === true && D.st().kitSpeed === "fast" && local.some((l) => /Kits can dress you now/.test(l)), "/dispensary kit on, speed fast");

  sent.length = 0; needle("Kit: Bunny Set");
  const ask = msgs("dispKitAsk");
  ok(D.active("kit") && ask.length === 1 && ask[0].Target === OWNER && ask[0].Dictionary.key === "bunny set", "a Kit: Bunny Set from her owner: in, and her Dispensary asks her owner's for it");
  hidden(OWNER, "dispKit", { key: "bunny set", code: pack([{ Group: "Cloth", Name: "BunnySuit", Color: "#ffffff" }, { Group: "ItemArms", Name: "LeatherCuffs", Property: { LockedBy: "MetalPadlock", LockMemberNumber: OWNER } }, { Group: "BodyUpper", Name: "XLarge" }, { Group: "ClothLower", Name: "BunnyTail" }]) });
  ok(worn("Cloth") === "BunnySuit" && worn("ItemArms") === null, "her owner's sends it: the first piece creeps on, the rest wait their turn");
  ok(actions().some((l) => /Bunny Set|bunny set/i.test(l) && /Mistress/.test(l)), "...and the room hears it start (" + actions().slice(-2).join(" | ").slice(0, 160) + ")");
  now += 11000; D.kitTick(now);
  ok(worn("ItemArms") === "LeatherCuffs" && !(w.InventoryGet(P, "ItemArms").Property || {}).LockedBy, "ten seconds on (fast): the cuffs, without the lock they came with (the kit holds itself on)");
  ok(worn("BodyUpper") === "Normal", "...and never her body");
  now += 11000; D.kitTick(now);
  ok(worn("ClothLower") === "BunnyTail" && D.kit().done === true && worn("Shoes") === "Sneakers" && worn("FarmInk1") === "KnotSlave", "all on: her shoes and her ink left be, they weren't in it");
  sent.length = 0; w.InventoryRemove(P, "ItemArms"); now += 6000; D.kitTick(now); now += 11000; D.kitTick(now);
  ok(worn("ItemArms") === "LeatherCuffs" && actions().some((l) => /pair of leather cuffs/.test(l)), "she takes the cuffs off: they creep back on, and it reads right (" + actions().join(" | ").slice(0, 120) + ")");
  sent.length = 0; D.end("kit");
  ok(worn("Cloth") === "TShirt" && worn("ItemArms") === null && worn("ClothLower") === null && worn("Shoes") === "Sneakers" && !D.kit(), "it's over: the kit comes off, and her old outfit slips back on");
  ok(actions().some((l) => /old outfit|own clothes/i.test(l)), "...and the room hears it let go");

  // the crafter's side: somebody asks for your kit
  P.Appearance = []; wear("BodyUpper", "Normal"); wear("Cloth", "MaidDress"); wear("ItemNeck", "SlaveCollar"); wear("FarmInk1", "KnotSlave");
  const r = D.kitSave("Maid Duty");
  ok(r.ok && r.key === "maid duty" && r.n === 2, "/dispensary kit save Maid Duty: what she's wearin', clothes and restraints (not her body or ink)");
  sent.length = 0; hidden(LOVER, "dispKitAsk", { key: "maid duty" });
  const reply = msgs("dispKit")[0];
  const items = reply && JSON.parse(Buffer.from(reply.Dictionary.code, "base64").toString());
  ok(reply && reply.Target === LOVER && items.map((i) => i.Name).join() === "MaidDress,SlaveCollar", "her lover's kit dose asks for it: hers sends it over");
  sent.length = 0; hidden(LOVER, "dispKitAsk", { key: "nope" });
  ok(msgs("dispKit")[0].Dictionary.none === true, "...one she hasn't got: it says so");

  // LSCG's outfits, a cursed kit, all at once, only clothes
  w.LSCG = { Outfits: () => ({ GetOutfit: (k) => (k.toLowerCase() === "demon bride" ? { key: "Demon Bride" } : undefined), GetOutfitBundle: () => [{ Group: "Cloth", Name: "WeddingDress" }, { Group: "ItemMouth", Name: "BallGag" }, { Group: "Shoes", Name: "Heels" }], GetOutfitNames: () => ["Demon Bride"] }) };
  ok(D.kitLookup("Demon Bride").length === 3, "an outfit saved in LSCG works as a kit too");
  D.kitCmd("speed now"); D.kitCmd("what clothes");
  sent.length = 0; D.give("kit", { by: ME, p: "demon bride#demon", x: 1 });
  ok(worn("Cloth") === "WeddingDress" && worn("Shoes") === "Heels" && worn("ItemMouth") === null, "her own cursed kit, all at once, clothes only: the dress and heels, not the gag");
  ok(actions().some((l) => /sigil|curse|brimstone|cruel|red/i.test(l)) && !actions().some((l) => /the the|%g/i.test(l)), "...a cursed one burns on, sigils and all (" + actions().join(" | ").slice(0, 160) + ")");
  D.end("kit");
  ok(worn("Cloth") === "MaidDress" && worn("ItemNeck") === "SlaveCollar", "...and her maid things back after");

  // the crafter's gone: no kit
  D.kitCmd("what both"); D.kitCmd("speed steady");
  sent.length = 0; local.length = 0; needle("Kit: Something Else");
  ok(D.active("kit"), "a kit from her owner...");
  now = Date.now() + 25000; D.kitTick(now);
  ok(!D.active("kit") && local.some((l) => /can't be found|didn't send/.test(l)), "...whose Dispensary never answers: it says so, and the dose is gone");
  const page = fs.readFileSync(path.join(__dirname, "../dispensary/src/page.js"), "utf8");
  ok(/Kits can dress me/.test(page) && /SPEED_NAMES/.test(page), "the page: the switch, what they put on, how fast");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
