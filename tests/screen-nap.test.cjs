// Nov 7: the bot's tab kept running out of memory and working hard. The game's newest version (R133) does extra work
// for every picture it draws, every frame, and only lets go of old pictures once an hour, in two caches the memory log
// didn't fully count. So: on the farm girl's own tab the map naps after 2 minutes with nobody touching it (a mouse
// move wakes it), the picture trim works on the new caches again, and /farmmem counts both caches and the characters.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");

// a pretend game page, as the given account
function page(member) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, local = [], cmds = [];
  let shift = 0; const realNow = w.Date.now.bind(w.Date); w.Date.now = () => realNow() + shift;
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
  w.console.warn = () => {}; w.console.log = () => {};
  w.CurrentScreen = "ChatRoom";
  w.Player = { MemberNumber: member, Name: "Someone" };
  w.ChatRoomCharacter = [{ MemberNumber: 221397 }, { MemberNumber: 260239 }];
  w.ServerSend = () => {}; w.ChatRoomMessage = () => {};
  w.CommandCombine = (list) => cmds.push(...list);
  w.ChatRoomSendLocal = (h) => local.push(String(h));
  const drawn = { grid: 0, rect: 0, text: [] };
  w.ChatRoomMapViewDrawGrid = function () { drawn.grid++; };
  w.ChatRoomMapViewDraw = function () { w.ChatRoomMapViewDrawGrid(0, 0, 1000, 1000); };
  w.CommonDrawAppearanceBuild = function () {};
  w.DrawRect = () => { drawn.rect++; };
  w.DrawText = (t) => drawn.text.push(t);
  // the new game's two picture caches
  const mk = (w2, h2, used) => ({ data: { width: w2, height: h2 }, lastUsed: used, isLoading: () => false });
  const cache = (entries) => { const m = w.eval("new Map()"); for (const [k, v] of entries) m.set(k, v); return { cache: m, deleted: [], delete(u) { this.deleted.push(u); m.delete(u); } }; };
  const now = realNow();
  w.GLDrawImageCache = cache([["Assets/Female3DCG/Cloth/old.png", mk(500, 1000, now - 20 * 60000)], ["Assets/Female3DCG/Cloth/new.png", mk(500, 1000, now)], ["blob:x", mk(500, 1000, 0)]]);
  w.DrawImageCache = cache([["Icons/old.png", mk(100, 100, now - 20 * 60000)], ["Backgrounds/Map/new.png", mk(100, 100, now)]]);
  w.Character = [{ Canvas: { width: 500, height: 1000 }, CanvasBlink: { width: 500, height: 1000 } }, { Canvas: { width: 500, height: 1000 } }];
  w.eval(src);
  return { w, local, cmds, drawn, later: (ms) => { shift += ms; } };
}

(async () => {
  const bot = page(260239), player = page(221397);
  await wait(3500);

  // ---- the nap, on the bot's own tab
  bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 1 && bot.drawn.rect === 0, "the bot's map draws while somebody's just been at it");
  bot.later(3 * 60000);
  bot.w.ChatRoomMapViewDraw(); bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 1, "after 3 untouched minutes the map isn't drawn");
  ok(bot.drawn.rect === 2 && bot.drawn.text.some((t) => /nappin'/.test(t)) && bot.drawn.text.some((t) => /wake it/.test(t)), "...a plain nappin' card instead, saying how to wake it");
  bot.w.document.dispatchEvent(new bot.w.MouseEvent("mousemove", { bubbles: true }));
  bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 2, "a mouse move wakes it at once");
  bot.later(3 * 60000);
  bot.w.document.dispatchEvent(new bot.w.KeyboardEvent("keydown", { key: "a", bubbles: true }));
  bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 3, "...and so does a key");
  bot.later(3 * 60000);
  bot.w.CurrentScreen = "InformationSheet"; bot.w.ChatRoomMapViewDraw(); bot.w.CurrentScreen = "ChatRoom";
  ok(bot.drawn.grid === 4, "it only naps in the room");

  // ---- the nap never touches anybody else's tab
  player.later(10 * 60000);
  player.w.ChatRoomMapViewDraw();
  ok(player.drawn.grid === 1 && player.drawn.rect === 0, "a player's map always draws, however long they sit still");

  // ---- /farmmem counts both caches, the characters, and the naps
  const mem = bot.cmds.find((c) => c.Tag === "farmmem");
  mem.Action();
  const text = bot.local[bot.local.length - 1] || "";
  ok(/napped 1 times, nappin' now/.test(text), "/farmmem on the bot says how often it napped, and that it's nappin' now");
  ok(/graphics card 6 MB in 3/.test(text), "...counts the new graphics card cache");
  ok(/screen pictures 2, 0 MB/.test(text), "...and the screen's own pictures, which it missed before");
  ok(/2 characters loaded, 6 MB drawn/.test(text), "...and every character loaded, with their drawing");

  // ---- the trim works on the new game's caches again
  ok(player.w.__farmTrim(false) === 0, "a player under the limit: nothing let go");
  ok(player.w.GLDrawImageCache.deleted.length === 0 && player.w.DrawImageCache.deleted.length === 0, "...both caches untouched");
  // (the bot's pretend clock moved on 9 minutes above: what's on screen was just drawn again)
  bot.w.GLDrawImageCache.cache.get("Assets/Female3DCG/Cloth/new.png").lastUsed = bot.w.Date.now();
  bot.w.DrawImageCache.cache.get("Backgrounds/Map/new.png").lastUsed = bot.w.Date.now();
  const n = bot.w.__farmTrim(true, 5 * 60000, 0);
  ok(n === 2, "on the bot, every picture unused for 5 minutes goes (" + n + ")");
  ok(bot.w.GLDrawImageCache.deleted.join() === "Assets/Female3DCG/Cloth/old.png" && bot.w.DrawImageCache.deleted.join() === "Icons/old.png", "...from both caches, the old ones only");
  ok(!bot.w.GLDrawImageCache.deleted.includes("blob:x"), "...never a blob picture (it couldn't be fetched again)");
  ok(bot.w.GLDrawImageCache.cache.has("Assets/Female3DCG/Cloth/new.png") && bot.w.DrawImageCache.cache.has("Backgrounds/Map/new.png"), "...what's on screen now stays");

  // a player past the limit: the oldest go first, down to the target
  const big = page(221397); await wait(3500);
  const m = big.w.GLDrawImageCache.cache; m.clear();
  const t0 = Date.now();
  for (let i = 0; i < 200; i++) m.set("Assets/p" + i + ".png", { data: { width: 1000, height: 1000 }, lastUsed: t0 - (60 + i) * 60000, isLoading: () => false });
  m.set("Assets/loading.png", { data: null, lastUsed: 0, isLoading: () => true });
  const let_ = big.w.__farmTrim(false);
  const left = [...m.values()].reduce((a, v) => a + (v.data ? v.data.width * v.data.height * 4 : 0), 0);
  ok(let_ > 0 && left <= 260e6 && left > 250e6, "a player past 380 MB: let go down to 260 MB (" + let_ + " pictures, " + Math.round(left / 1e6) + " MB left)");
  ok(m.has("Assets/p0.png") && !m.has("Assets/p199.png"), "...the longest unused first");
  ok(m.has("Assets/loading.png"), "...never one still loading");

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
