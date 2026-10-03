// Loads the built companion into a fake browser page and checks the panel works.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only" });
const w = dom.window;
const sent = [];
let commands = [];
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;   // real browsers have these; jsdom forgets
w.CurrentScreen = "ChatRoom";
w.ChatRoomCharacter = [{ MemberNumber: 221397 }, { MemberNumber: 260239 }];
w.ServerSend = (ev, d) => sent.push([ev, d]);
w.ChatRoomMessage = (data) => { w.__shown = (w.__shown || 0) + 1; };   // the game's own handler
w.CommandCombine = (c) => { commands = commands.concat(c); };
w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));

const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 1, ...d } });
const toBot = (type) => sent.filter((s) => s[1].Content === "FarmhandMsg" && s[1].Target === 260239 && s[1].Dictionary.type === type);

(async () => {
  await wait(4500);
  out("panel built ->", !!w.document.getElementById("fhc-panel"));
  out("said hello ->", toBot("hello").length > 0);
  out("/farm command added ->", commands.some((c) => c.Tag === "farm"));
  bot({ type: "welcome", ver: "0.9.25", name: "Laynie" });
  out("status ->", w.document.getElementById("fhc-status").textContent);
  w.document.querySelector("#fhc-quick button").click();
  out("stats button sends cmd ->", toBot("cmd").some((s) => s[1].Dictionary.text === "stats"));
  bot({ type: "reply", text: "📋 LAYNIE'S CARD", id: 1, part: 1, of: 1 });
  bot({ type: "reply", text: "part two", id: 2, part: 2, of: 2 });
  bot({ type: "reply", text: "part one", id: 2, part: 1, of: 2 });
  const cards = [...w.document.querySelectorAll(".fhc-card")].map((c) => c.textContent);
  out("card shown ->", cards.some((c) => c.includes("LAYNIE'S CARD")));
  out("pieces glued in order ->", cards.some((c) => c.includes("part one\npart two")));
  out("unread badge ->", w.document.getElementById("fhc-btn").getAttribute("data-unread"));
  const before = w.document.querySelectorAll(".fhc-card").length;
  w.ChatRoomMessage({ Sender: 999, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 1, type: "reply", text: "fake!", id: 9, part: 1, of: 1 } });
  out("ignores fakes from non-bot ->", w.document.querySelectorAll(".fhc-card").length === before);
  w.__shown = 0; w.ChatRoomMessage({ Sender: 221397, Type: "Chat", Content: "hi" });
  out("normal chat still reaches the game ->", w.__shown === 1);
  commands.find((c) => c.Tag === "farm").Action("size");
  out("/farm size sends cmd ->", toBot("cmd").some((s) => s[1].Dictionary.text === "size"));
  w.ChatRoomCharacter = [{ MemberNumber: 221397 }];
  commands.find((c) => c.Tag === "farm").Action("stats");
  out("bot away -> beeps ->", sent.some((s) => s[0] === "AccountBeep" && s[1].Message === "stats"));
  process.exit(0);
})();
