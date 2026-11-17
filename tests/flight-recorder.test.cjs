// Nov 17: the bot's tab kept dying "out of memory" while the page's own memory stayed small. Opera's crash report said
// the tab had grown to 12.9 GB in 8.5 minutes, outside the page's JavaScript. The flight recorder counts, on the bot's
// tab only, what can make that kind of memory, and the memory log writes it down every 3 seconds.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");
function page(member) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window;
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.CurrentScreen = "ChatRoom"; w.Player = { MemberNumber: member, Name: "X" }; w.ChatRoomCharacter = []; w.ServerSend = () => {};
  w.ChatRoomMessage = function () {}; w.ChatRoomSync = function () {}; w.CommonDrawAppearanceBuild = function () {}; w.ChatRoomMapViewDrawGrid = function () {};
  w.eval(src);
  return w;
}
const lastFast = (w) => { try { const f = JSON.parse(w.localStorage.getItem("farmhand-memfast")) || []; return f[f.length - 1] || {}; } catch (e) { return {}; } };
(async () => {
  const bot = page(260239), pl = page(221397);
  await wait(1500);
  for (const w of [bot, pl]) { for (let i = 0; i < 3; i++) { const c = w.document.createElement("canvas"); c.width = 500; c.height = 1000; } w.ChatRoomMessage({ Type: "Chat", Content: "hi" }); w.ChatRoomSync({}); }
  await wait(3600);
  const a = lastFast(bot).a || "";
  const m = /canvas (\d+) new, ([\d.]+)M px/.exec(a);
  ok(m && Number(m[1]) >= 3 && Number(m[2]) >= 1.5, "on the bot's tab: three new 500 x 1000 canvases are counted, every resize a new sheet (" + a + ")");
  ok(/msgs 1/.test(a) && /syncs 1/.test(a), "...and the server's messages and room updates");
  await wait(3200);
  const b = lastFast(bot).a || "";
  ok(!/canvas/.test(b), "the next line only counts what's new since the last one");
  ok(!lastFast(pl).a, "never on a player's tab");
  // a runaway: a script makin' huge canvases over and over gets named (here, the test page's own address)
  bot.eval("for (let i = 0; i < 12; i++) { const c = document.createElement('canvas'); c.width = 4000; c.height = 4000; }");
  await wait(3300);
  const c2 = lastFast(bot).a || "";
  ok(/WHO: cvPx from /.test(c2), "a jump past normal names the script that asked (" + c2.slice(0, 160) + ")");
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
