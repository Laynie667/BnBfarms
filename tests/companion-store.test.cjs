// The Companion's 🎀 Store tab (ribbons, potions in you, a dare, the shelf, gifts) and Moo Juice turning
// some of your words into moos while it lasts (and never commands, whispers or emotes).
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window;
const sent = [];
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
w.CurrentScreen = "ChatRoom";
w.ChatRoomCharacter = [{ MemberNumber: 500 }, { MemberNumber: 260239 }];
w.Player = { MemberNumber: 500 };
w.ServerSend = (ev, d) => sent.push([ev, d]);
w.ChatRoomMessage = () => {};
w.CommandCombine = () => {};
w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
const D = w.document;
let fails = 0; const ok = (c, m) => { out(m + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, ...d } });
const cmds = () => sent.filter((s) => s[1] && s[1].Content === "FarmhandMsg" && s[1].Dictionary.type === "cmd").map((s) => s[1].Dictionary.text);
const click = (label) => { const b = [...D.querySelectorAll("#fhc-panel button")].find((x) => x.textContent.trim().startsWith(label)); if (b) b.click(); return !!b; };
const text = () => D.getElementById("fhc-panel").textContent;
const STATE = { name: "Moo", onBooks: true, roles: ["LIVESTOCK"], tier: "new", species: "cow", gender: "female", staff: false, keys: ["bronze"],
  switches: { breedable: true, potions: false, dares: true }, today: { tally: 0, naughty: 0, praised: 0, degraded: 0 },
  ribbons: 12, quotaGrace: 1, ribbonLog: [{ n: 3, why: "makin' your milk quota" }],
  store: [{ id: "spin", name: "A spin of the wheel", price: 3, desc: "Spin it.", gift: false, kind: "" },
          { id: "tag", name: "A ribbon tag", price: 5, desc: "A tag.", gift: false, kind: "" },
          { id: "hiccup", name: "Hiccup Fizz", price: 3, desc: "Hiccups.", gift: true, kind: "silly" }],
  fx: [{ id: "moo", name: "Moo Juice", until: Date.now() + 600000 }],
  dare: { text: "Crawl to the trough.", until: Date.now() + 900000, reckless: false } };
(async () => {
  await wait(4500);
  bot({ type: "welcome", ver: "0.16.0", name: "Moo", proto: 2 });
  bot({ type: "state", state: STATE });
  await wait(300);
  ok(click("🎀 Store"), "there's a Store tab");
  ok(/12/.test(text()) && /makin' your milk quota/.test(text()), "it shows the ribbons and where they came from");
  ok(/Moo Juice/.test(text()) && /Crawl to the trough/.test(text()), "potions in you and your dare");
  click("Buy");
  ok(cmds().includes("buy spin"), "Buy sends ?buy");
  click("I did it");
  ok(cmds().includes("dared"), "I did it sends ?dared");
  const inp = [...D.querySelectorAll("#fhc-panel input")].find((i) => i.parentNode && /Gift to/.test(i.parentNode.textContent));
  inp.value = "Bessie"; inp.dispatchEvent(new w.Event("input"));
  click("Gift it");
  ok(cmds().includes("buy hiccup for Bessie"), "Gift it sends ?buy <potion> for <who>");
  // Moo Juice
  const said = [];
  for (let i = 0; i < 6; i++) { w.ServerSend("ChatRoomChat", { Type: "Chat", Content: "Hello there everybody, what lovely weather today" }); said.push(sent[sent.length - 1][1].Content); }
  ok(said.some((s) => /moo|mrrrm/i.test(s)), "Moo Juice turns words into moos (" + said[0] + ")");
  w.ServerSend("ChatRoomChat", { Type: "Chat", Content: "?stats please" });
  ok(sent[sent.length - 1][1].Content === "?stats please", "a command is left alone");
  w.ServerSend("ChatRoomChat", { Type: "Emote", Content: "smiles at everybody" });
  ok(sent[sent.length - 1][1].Content === "smiles at everybody", "an emote is left alone");
  bot({ type: "state", state: Object.assign({}, STATE, { fx: [] }) });
  w.ServerSend("ChatRoomChat", { Type: "Chat", Content: "Hello there everybody, what lovely weather today" });
  ok(sent[sent.length - 1][1].Content === "Hello there everybody, what lovely weather today", "no potion, no moos");
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
