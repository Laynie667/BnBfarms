// THE ANIMAL TONGUE (Nov 18). Laynie, on the noises for each animal: "Those suit just fine". The bottle names the
// animal (or it's your own), and it gets stronger dose by dose: noises slip in, then half the words, then nothin' but.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700;

(async () => {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: OWNER }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 50 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  const owner = { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true };
  w.ChatRoomCharacter = [w.Player, owner];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function () {}; w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.eval(src); await wait(1300);
  const D = w.__disp;
  const needle = (name) => { owner.Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: "" } }];
    w.ChatRoomMessage({ Type: "Activity", Sender: OWNER, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] }); };
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text || "");
  const LINE = "I really want to be a good girl for you tonight";
  const words = LINE.split(" "), kept = (t) => words.filter((x) => new RegExp("\\b" + x + "\\b").test(t)).length;
  const avg = (f, n) => { let s = 0; for (let i = 0; i < n; i++) s += f(); return s / n; };

  sent.length = 0; needle("Kitty Tongue");
  ok(D.active("tongue") && D.st().doses.tongue.p === "kitty", "a Kitty Tongue from her owner: in, and it's a kitty's (" + JSON.stringify(D.st().doses.tongue) + ")");
  ok(actions().some((l) => /kitty/.test(l) && /Hana/.test(l)), "...the room sees it take, in a kitty's words (" + actions().join(" | ").slice(0, 160) + ")");
  const one = Array.from({ length: 20 }, () => D.speech(LINE));
  ok(one.every((t) => /\*(mew|nya|mrrp|purr)\*/.test(t)) && avg(() => kept(D.speech(LINE)), 30) >= words.length - 0.5, "one dose: kitty noises slip in between her words, every word still there (" + one[0] + ")");
  D.end("tongue"); D.give("tongue", { x: 2, p: "kitty", by: OWNER, quiet: true });
  const k2 = avg(() => kept(D.speech(LINE)), 60);
  ok(k2 > words.length * 0.3 && k2 < words.length * 0.8, "two: about half her words are noises (" + k2.toFixed(1) + " of " + words.length + " kept; " + D.speech(LINE) + ")");
  D.end("tongue"); D.give("tongue", { x: 3, p: "kitty", by: OWNER, quiet: true });
  const three = D.speech(LINE);
  ok(kept(three) === 0 && three.split(" ").length === words.length && /^[A-Z]/.test(three), "three: nothin' but noises, word for word (" + three + ")");
  D.end("tongue"); needle("Puppy Tongue");
  ok(/\*(arf|woof|awoo|whine)\*/.test(D.speech(LINE)), "a Puppy Tongue: a pup's woofs and whines");
  D.end("tongue"); D.st().species = "pony"; needle("Animal Tongue");
  ok(D.st().doses.tongue.p === undefined || D.st().doses.tongue.p === "", "an Animal Tongue names no animal: her own");
  ok(/\*(neigh|nicker|whinny)\*/.test(D.speech(LINE)), "...and she's a pony: neighs and whinnies");
  D.end("tongue"); D.give("tongue", { x: 3, p: "wolf", by: OWNER, quiet: true });
  ok(/^(Awoo|Grr|Growl|Howl)$/.test(D.speech("Hello")), "a wolf's tongue growls and howls");
  D.end("tongue"); D.give("tongue", { x: 3, p: "dragon", by: OWNER, quiet: true });
  const drag = new Set(Array.from({ length: 40 }, () => D.speech("hello").toLowerCase()));
  ok(drag.has("rumble"), "a dragon's rumbles (" + [...drag].join(",") + ")");
  D.end("tongue");
  ok(D.speech(LINE) === LINE, "worn off: her words are her own again");
  const honey = /honey[- ]tongue/;
  ok(!D.st().doses.tongue || !D.active("tongue"), "(the farm girl's Honey Tongue isn't this)");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
