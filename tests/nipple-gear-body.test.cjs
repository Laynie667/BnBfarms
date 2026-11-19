// NIPPLE GEAR AND THE BODY ROWS (Nov 19). Laynie: "the nipple clamps for the nipple dilation doesn't seem to work? I
// also dont see nipples as part of the body for stages in the companion". Clamps that only said "dilator" did nothin'
// (the words wanted "nipple dilator" in full); now anythin' worn on the nipples that says dilator or stretcher holds
// them open. And the Companion's Body rows show your nipples from your Dispensary.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ME = 600, OWNER = 700, STRANGER = 999;

function page() {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window; w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  return w;
}

(async () => {
  // ── the Dispensary: nipple gear that says dilator or stretcher ──
  const w = page(), local = [];
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: OWNER }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [], ArousalSettings: { Progress: 0 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  w.ChatRoomCharacter = [w.Player]; w.ServerSend = () => {}; w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, "")); w.CommandCombine = () => {}; w.ServerPlayerExtensionSettingsSync = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ChatRoomSync = function () {}; w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true;
  w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8")); await wait(1300);
  const D = w.__disp;
  const wear = (group, asset, name, desc, by) => { w.Player.Appearance = [{ Asset: { Name: asset, Group: { Name: group } }, Craft: { Name: name, Description: desc || "", MemberNumber: by || ME }, Property: {} }]; D.wornReset(); D.end("dilator"); D.wornTick(); };
  wear("ItemNipples", "NippleClamp", "Dilator Clamps");
  ok(D.worn().length === 1 && D.worn()[0].drip && D.active("dilator") && D.nips() === 1, "\"Dilator Clamps\" on the nipples hold them open while they're on (open " + D.nips() + ")");
  for (const [name, desc] of [["Nipple Clamps", "dilator"], ["Stretcher Clamps", ""], ["Dilating Clamps", ""], ["Spreader Rings", ""], ["Nipple Clamps", "nipple dilator"]]) {
    wear("ItemNipples", "NippleClamp", name, desc);
    ok(D.active("dilator") && D.nips() >= 1, "...and \"" + (name + (desc ? " | " + desc : "")) + "\" too");
  }
  wear("ItemNipples", "NippleClamp", "Stretcher Clamps x3");
  ok(D.nips() === 3, "a stronger one holds them wider: Stretcher Clamps x3 holds them 3 open (" + D.nips() + ")");
  wear("ItemNipplesPiercings", "RoundPiercing", "Dilating Barbells");
  ok(D.active("dilator"), "piercings count, they're on the nipples too");
  wear("ItemNipples", "NippleClamp", "Stretchy Clamps");
  ok(!D.active("dilator") && D.nips() === 0, "\"stretchy\" isn't a stretcher");
  wear("ItemNeck", "LeatherCollar", "Dilator Collar");
  ok(!D.active("dilator"), "only on the nipples: a Dilator Collar is just a collar");
  local.length = 0; wear("ItemNipples", "NippleClamp", "Dilator Clamps", "", STRANGER);
  ok(!D.active("dilator") && /isn't on your list|not on your list|list/i.test(local.join(" ")), "crafted by somebody not on your list: nothin', and you're told");
  D.st().off.dilator = true; wear("ItemNipples", "NippleClamp", "Dilator Clamps");
  ok(!D.active("dilator"), "the Dilator switched off on your page: clamps or not, it doesn't take");
  delete D.st().off.dilator;
  // what the Companion reads
  wear("ItemNipples", "NippleClamp", "Dilator Clamps x2");
  const I = w.FarmhandDispensary.nipsInfo();
  ok(I.open === 2 && I.word === "wide open" && I.trained === 0 && I.trainedWord === "closed" && typeof I.loads === "number", "FarmhandDispensary.nipsInfo(): how open, in words, and trained (" + JSON.stringify(I) + ")");

  // ── the Companion: nipples in the Body rows ──
  for (const farm of [true, false]) {
    const c = page(), sent = [];
    c.CurrentScreen = "ChatRoom"; c.ChatRoomCharacter = [{ MemberNumber: 500 }, { MemberNumber: 260239 }]; c.Player = { MemberNumber: 500, Name: "Moo" };
    c.ServerSend = (ev, d) => sent.push([ev, d]); c.ChatRoomMessage = () => {}; c.ChatRoomCanLeave = () => true; c.ChatRoomAttemptLeave = () => {}; c.CommandCombine = () => {};
    const HOLES = { vulva: { label: "Pussy", now: 6, trained: 5, nowWord: "well-used", trainedWord: "loose" } };
    c.FarmhandDispensary = { version: "test", active: () => false, dose: () => null, doses: () => [], grow: () => ({}), parasites: () => [], hard: () => null, who: () => "farm", dosedOf: () => false,
      nipples: () => 2, holes: () => HOLES, nipsInfo: () => ({ open: 2, trained: 1, held: 2, word: "wide open", trainedWord: "open", toward: 40, loads: 3, toy: "Black Nipple Plug", locked: false, heal: true }) };
    c.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
    await wait(4500);
    const bot = (d) => c.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, ...d } });
    bot({ type: "welcome", ver: "0.84.1", name: "Moo", proto: 2 });
    bot({ type: "state", state: { name: "Moo", onBooks: true, roles: ["LIVESTOCK"], tier: "Trained", species: "cow", gender: "female", switches: {}, ribbons: 1, body: farm ? [{ part: "udder", label: "Chest", size: "J cup" }, { part: "vulva", label: "Pussy", size: "snug" }] : [] } });
    c.document.getElementById("fhc-btn").click(); await wait(200);
    const btns = [...c.document.querySelectorAll("#fhc-panel button")], row = btns.find((b) => /📏 Body/.test(b.textContent));
    if (row) { row.click(); await wait(50); }
    const t = c.document.getElementById("fhc-panel").textContent;
    if (farm) {
      ok(row && /Chest/.test(t) && /J cup/.test(t) && /well-used \(6\/20\)/.test(t), "on the farm: the Body rows, your holes from your Dispensary");
      ok(/Nipples/.test(t) && /wide open \(2\/3\)/.test(t) && /trained open/.test(t), "...and your nipples: wide open, 2 of 3, trained to stay open");
      ok(/the Black Nipple Plug in them/.test(t) && /40% to wide open/.test(t) && /3 loads taken/.test(t), "...with the toy in them, how far along the trainin' is, and loads taken");
      ok(/Measure/.test(t), "...and the farm's Measure button");
    } else {
      ok(row && /Pussy/.test(t) && /Nipples/.test(t) && /wide open/.test(t), "without the farm's numbers: the Body row is still there, from your Dispensary");
      ok(!/Measure/.test(t), "...without the farm's Measure button");
    }
  }
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all passed"); process.exit(fails ? 1 : 0);
})();
