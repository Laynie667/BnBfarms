// The Companion running on the bot's OWN account (260239), with the real bot on the same page. Worst case:
// the server never hands messages to yourself back. The two scripts talk directly on the page instead, so
// the bot account still gets the Livestock, Staff and Dashboard panels like any proprietor.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BOT = 260239;

const store = {}, handlers = {};
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {}, applications: [], archive: {}, log: [], stuckLog: [], spots: {} });
global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
const bdoc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
const chars = [{ MemberNumber: BOT, Name: "Farm Girl", MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} }, Appearance: [] }];
let toCompanion = () => {}, selfSent = 0;
const BW = { document: bdoc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {},
  // the server: worst case, a message addressed to the bot's own account never comes back
  ServerSend: (ev, d) => { if (ev === "ChatRoomChat" && d && d.Type === "Hidden" && d.Target === BOT) selfSent++; },
  ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
  Player: { MemberNumber: BOT, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [BOT], MapData: { Type: "Always" } },
  ChatRoomCharacter: chars, ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = BW; global.window = BW; global.Blob = class {}; global.URL = { createObjectURL() {} };
const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => warns.push(a.join(" ")) };
BW.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));

const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window, D = w.document;
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
w.CurrentScreen = "ChatRoom"; w.ChatRoomCharacter = [{ MemberNumber: BOT }]; w.Player = { MemberNumber: BOT, Name: "Farm Girl" };
w.ChatRoomMessage = () => {}; w.CommandCombine = () => {}; w.ChatRoomSendLocal = () => {};
// the Companion's sends go through the same server
w.ServerSend = (ev, d) => BW.ServerSend(ev, d);
toCompanion = (m) => w.ChatRoomMessage(m);
w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
// in the game both scripts share one window; here the two pretend windows are joined the same way
setTimeout(() => { BW.__farmhandOwnPanel = w.__farmhandOwnPanel; }, 1500);
setTimeout(() => { w.Farmhand = BW.Farmhand; }, 4000);

(async () => {
  await wait(5000);
  const panel = D.getElementById("fhc-panel");
  panel.classList.add("open");
  await wait(16000);   // the Companion says hello within 15 s of seeing the bot
  const views = [...D.querySelectorAll("#fhc-panel .fhc-row .fhc-pill")].map((b) => b.textContent.trim());
  out("status says connected ->", /connected/.test(D.getElementById("fhc-status").textContent), D.getElementById("fhc-status").textContent);
  out("Livestock, Staff and Dashboard panels ->", ["Livestock", "Staff", "Dashboard"].every((v) => views.includes(v)), views.join(","));
  out("nothing went through the server to itself ->", selfSent === 0, selfSent);
  out("no errors ->", !warns.filter((x) => !/CustomEvent|Worker|ModSDK/.test(x)).some((x) => /error|failed/i.test(x)), warns.filter((x) => /error|failed/i.test(x)).slice(0, 3).join(" | "));
  process.exit(0);
})();
