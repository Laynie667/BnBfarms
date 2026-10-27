// Oct 27 (Laynie): "limit how much has to be sent via my connection". The Companion side: it keeps the store's shelf on the
// computer and says which panel and shelf it holds, asks for a whole panel when a patch doesn't fit, shows a shared room
// line only when it names you, sends your look as just the pieces that changed (gathered), and on the bot's own account
// the room isn't drawn.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, m) => { out(m + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const SRC = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");
function game(me, seed) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], items = [], whole = [], drawn = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
  for (const [k, v] of Object.entries(seed || {})) w.localStorage.setItem(k, v);
  w.CurrentScreen = "ChatRoom";
  w.ChatRoomCharacter = [{ MemberNumber: me }, { MemberNumber: 260239 }, { MemberNumber: 600 }];
  const G = (g) => ({ Name: g, Category: /^Item/.test(g) ? "Item" : "Appearance", Clothing: g === "Cloth" });
  const item = (g, n, x) => Object.assign({ Asset: { Name: n, Group: G(g) }, Property: {} }, x || {});
  w.Player = { MemberNumber: me, Name: "Moo", AssetFamily: "Female3DCG", Appearance: [item("Cloth", "Shirt"), item("BodyUpper", "Normal")] };
  w.ServerSend = (ev, d) => sent.push([ev, d]);
  w.ChatRoomMessage = () => {};
  w.CommandCombine = () => {};
  w.ChatRoomSendLocal = (html) => local.push(String(html));
  w.AssetGroupGet = (f, g) => G(g); w.AssetGet = (f, g, n) => ({ Name: n, Group: G(g) });
  w.ServerAppearanceBundle = (A) => A.map((it) => ({ Group: it.Asset.Group.Name, Name: it.Asset.Name, Color: it.Color, Property: JSON.parse(JSON.stringify(it.Property || {})), Craft: it.Craft }));
  w.ServerAppearanceLoadFromBundle = (C, f, b) => { C.Appearance = b.map((x) => item(x.Group, x.Name, { Color: x.Color, Property: x.Property || {}, Craft: x.Craft })); };
  w.CharacterRefresh = () => {};
  w.ChatRoomCharacterItemUpdate = (C, g) => items.push(g);
  w.ChatRoomCharacterUpdate = () => whole.push(Date.now());
  w.CommonDrawAppearanceBuild = (C) => { drawn.push(C && C.MemberNumber); };
  w.CharacterLoadCanvas = (C) => w.CommonDrawAppearanceBuild(C, {});
  let reg = null; w.PreferenceRegisterExtensionSetting = (o) => { reg = o; };
  w.eval(SRC);
  const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, ...d } });
  const toBot = (type) => sent.filter((s) => s[1] && s[1].Content === "FarmhandMsg" && s[1].Dictionary.type === type).map((s) => s[1].Dictionary);
  return { w, sent, local, items, whole, drawn, bot, toBot, settings: () => reg };
}
const STATE = { name: "Moo", onBooks: true, roles: ["LIVESTOCK"], species: "cow", gender: "female", staff: false, keys: [], switches: {}, today: { tally: 0, naughty: 0, praised: 0, degraded: 0 }, ribbons: 5 };
(async () => {
  const shelf = [{ id: "spin", name: "A spin of the wheel", price: 3, desc: "Spin it.", gift: false, kind: "" }];
  const g = game(500, { "fhc-store": JSON.stringify({ h: "abc.1", items: shelf }), "fhc-prefs": JSON.stringify({ marks: true }) });
  await wait(4500);
  const h0 = g.toBot("hello");
  ok(h0.length && h0[0].sh === "abc.1" && h0[0].seq === 0, "a Companion with a saved shelf says which one it holds in its hello (" + JSON.stringify(h0[0] || {}).slice(0, 120) + ")");
  g.bot({ type: "welcome", ver: "0.52.0", name: "Moo", proto: 2 });
  g.bot({ type: "state", state: STATE, seq: 10 });
  await wait(200);
  const D = g.w.document, text = () => D.getElementById("fhc-panel").textContent;
  const click = (label) => { const b = [...D.querySelectorAll("#fhc-panel button")].find((x) => x.textContent.trim().startsWith(label)); if (b) b.click(); return !!b; };
  click("🎀 Store");
  ok(/A spin of the wheel/.test(text()), "the saved shelf shows in the store without the bot sendin' it");
  g.bot({ type: "stateDiff", set: { ribbons: 9 }, del: [], base: 10, seq: 11 });
  await wait(100); click("🎀 Store");
  ok(/ribbons\s*9(?!\d)/.test(text()), "a patch onto the panel it holds is put on");
  let n = g.toBot("hello").length;
  g.bot({ type: "stateDiff", set: { ribbons: 40 }, del: [], base: 99, seq: 100 });
  g.bot({ type: "stateDiff", set: { ribbons: 41 }, del: [], base: 100, seq: 101 });
  await wait(100); click("🎀 Store");
  const again = g.toBot("hello").slice(n);
  ok(/ribbons\s*9(?!\d)/.test(text()) && again.length === 1 && again[0].again === true && again[0].relay !== undefined && again[0].off, "a patch for a panel it doesn't hold is left off, and it asks once for a whole panel (with its switches)");
  g.bot({ type: "store", items: [{ id: "bell", name: "A brass bell", price: 4, desc: "Ding.", gift: false, kind: "" }], h: "xyz.2" });
  await wait(100);
  const kept = JSON.parse(g.w.localStorage.getItem("fhc-store") || "{}");
  ok(kept.h === "xyz.2" && kept.items[0].name === "A brass bell", "a new shelf is saved on this computer with its fingerprint");
  n = g.toBot("hello").length; g.bot({ type: "ping", ver: "0.52.0" }); await wait(100);
  const ph = g.toBot("hello").slice(n);
  ok(ph.length === 1 && ph[0].seq === 0 && ph[0].sh === "xyz.2" && ph[0].w === true, "answerin' a ping: the panel number, the shelf and that it's welcomed");
  g.bot({ type: "state", state: STATE, seq: 200 });
  n = g.toBot("hello").length; g.bot({ type: "ping", ver: "0.52.0" }); await wait(100);
  ok(g.toBot("hello").slice(n)[0].seq === 200, "...holdin' a whole new panel, it says that one's number");

  // barn life's stats on the Me tab (Laynie, Oct 27)
  const mods = { "barn-life": { label: "Barn life", cards: [
    { title: "Barn life", me: true, toggles: [{ label: "Barn life (food, water, grooming)", on: true, cmd: "needs off" }],
      bars: [{ label: "🌾 Food", value: "62%", pct: 62 }, { label: "💧 Water", value: "18%", pct: 18, kind: "alert" }, { label: "🪮 Grooming", value: "90%", pct: 90 }],
      chips: [{ text: "🥛 milk-drunk", kind: "acc" }], buttons: [{ label: "Eat (at a trough)", cmd: "eat" }] },
    { title: "Turn-out", text: "The herd's out in the pasture." }] } };
  g.bot({ type: "stateDiff", set: { mods }, del: [], base: 200, seq: 201 });
  await wait(100); click("🐄 Me");
  ok(/Food/.test(text()) && /62%/.test(text()) && /Water/.test(text()) && /milk-drunk/.test(text()), "the Me tab shows barn life: food, water, grooming and milk-drunk");
  click("Farm extras");
  ok(/Turn-out/.test(text()) && !/62%/.test(text()), "...and Farm extras keeps the rest, without showin' it twice");

  // shared room lines
  const nl = g.local.length;
  g.bot({ type: "roomlines", to: [600, 500], text: "*The farm girl scratches Moo behind the ears.", kind: "emote" });
  g.bot({ type: "roomlines", to: [600, 700], text: "*The farm girl pats Rex.", kind: "emote" });
  const lines = g.local.slice(nl).join(" ");
  ok(/scratches Moo/.test(lines) && !/pats Rex/.test(lines), "a shared room line shows only when it names you");

  // your look: just the pieces that changed, gathered
  g.items.length = 0; g.whole.length = 0;
  g.bot({ type: "mark", splat: ["face"] });
  g.bot({ type: "mark", splat: ["chest"], color: "#5fae3a" });
  await wait(300);
  ok(!g.items.length && !g.whole.length, "two marks close together: nothin' sent straight away");
  await wait(1200);
  ok(g.items.length >= 1 && g.items.length <= 3 && !g.whole.length && g.items.every((x) => /Mask|FaceMarkings|BodyMarkings/.test(x)), "...then only the marked pieces go to the room, once (" + g.items.join(",") + ")");
  const wore = g.w.Player.Appearance.filter((it) => it.Asset.Name === "Splatters").length;
  ok(wore >= 1, "the marks were on her at once all the same");
  g.items.length = 0; g.whole.length = 0;
  g.w.localStorage.setItem("fhc-prefs", g.w.localStorage.getItem("fhc-prefs") || "{}");
  g.bot({ type: "mark", wash: true }); await wait(1300);
  ok(g.items.length >= 1 && !g.whole.length, "a wash goes as the pieces it took off (" + g.items.join(",") + ")");

  // the bot's own account: the room isn't drawn
  const b = game(260239, {});
  await wait(4500);
  b.drawn.length = 0;
  b.w.CommonDrawAppearanceBuild({ MemberNumber: 600 }, {});
  b.w.CommonDrawAppearanceBuild({ MemberNumber: 260239 }, {});
  ok(b.drawn.length === 0, "on the farm girl's own account nobody in the room is drawn");
  b.w.CurrentScreen = "Appearance";
  b.w.CommonDrawAppearanceBuild({ MemberNumber: 260239 }, {});
  ok(b.drawn.length === 1, "...out of the room (the wardrobe) she's drawn as normal");
  b.w.CurrentScreen = "ChatRoom";
  const reg = b.settings();
  ok(!!reg, "the Farmhand settings page is there");
  if (reg) {
    reg.load();
    const sw = [...b.w.document.querySelectorAll("#fhc-settings button")].find((x) => x.getAttribute("aria-label") === "Draw the room on the farm girl's screen");
    ok(!!sw && sw.getAttribute("aria-pressed") === "false", "the bot's account has the switch, off to begin with");
    if (sw) sw.click();
    await wait(150);
    ok(b.drawn.includes(600), "switched on: everybody in the room is drawn again");
    b.drawn.length = 0; b.w.CommonDrawAppearanceBuild({ MemberNumber: 600 }, {});
    ok(b.drawn.length === 1, "...and keeps bein' drawn");
  }
  const p = game(500, {}); await wait(4500);
  p.drawn.length = 0; p.w.CommonDrawAppearanceBuild({ MemberNumber: 600 }, {});
  ok(p.drawn.length === 1, "a player's own Companion draws the room as always");
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
