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
function page(member, prefs) {
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
  // the game's own build: two full-size sheets when there are none, and the pictures drawn on them listed
  const built = [];
  w.CharacterAppearanceBuildCanvas = function (C) {
    built.push(C.MemberNumber);
    for (const k of ["Canvas", "CanvasBlink"]) if (!C[k]) { C[k] = w.document.createElement("canvas"); C[k].width = 500; C[k].height = 1000; }
    if (C.DrawnAssets) C.DrawnAssets.add("Assets/Female3DCG/Cloth/drawn.png");
  };
  w.CharacterLoadCanvas = function (C) { w.CharacterAppearanceBuildCanvas(C); C.MustDraw = false; };
  w.DrawRect = () => { drawn.rect++; };
  w.DrawText = (t) => drawn.text.push(t);
  // the new game's two picture caches
  const mk = (w2, h2, used) => ({ data: { width: w2, height: h2 }, lastUsed: used, isLoading: () => false });
  const cache = (entries) => { const m = w.eval("new Map()"); for (const [k, v] of entries) m.set(k, v); return { cache: m, deleted: [], delete(u) { this.deleted.push(u); m.delete(u); } }; };
  const now = realNow();
  w.GLDrawImageCache = cache([["Assets/Female3DCG/Cloth/old.png", mk(500, 1000, now - 20 * 60000)], ["Assets/Female3DCG/Cloth/new.png", mk(500, 1000, now)], ["blob:x", mk(500, 1000, 0)]]);
  w.DrawImageCache = cache([["Icons/old.png", mk(100, 100, now - 20 * 60000)], ["Backgrounds/Map/new.png", mk(100, 100, now)]]);
  w.Character = [{ Canvas: { width: 500, height: 1000 }, CanvasBlink: { width: 500, height: 1000 } }, { Canvas: { width: 500, height: 1000 } }];
  if (prefs) w.localStorage.setItem("fhc-prefs", JSON.stringify(prefs));
  w.eval(src);
  return { w, local, cmds, drawn, built, later: (ms) => { shift += ms; } };
}

(async () => {
  const bot = page(260239), player = page(221397);
  await wait(3500);

  // ---- the nap, on the bot's own tab: from the moment it's in the room (Nov 17), not 2 minutes after
  bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 0 && bot.drawn.rect === 1, "the bot's map naps from the moment it's in the room: nobody's touched it since it walked in");
  ok(bot.drawn.text.some((t) => /nappin'/.test(t)) && bot.drawn.text.some((t) => /wake it/.test(t)), "...a plain nappin' card instead, saying how to wake it");
  bot.w.document.dispatchEvent(new bot.w.MouseEvent("mousemove", { bubbles: true }));
  bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 1, "a mouse move after that wakes it at once");
  bot.later(3 * 60000);
  bot.w.ChatRoomMapViewDraw(); bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 1 && bot.drawn.rect === 3, "after 3 untouched minutes it naps again");
  bot.w.document.dispatchEvent(new bot.w.MouseEvent("mousemove", { bubbles: true }));
  bot.w.ChatRoomMapViewDraw();
  ok(bot.drawn.grid === 2, "...and a mouse move wakes it again");
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
  ok(/napped 2 times, nappin' now/.test(text), "/farmmem on the bot says how often it napped, and that it's nappin' now");
  ok(/graphics card 6 MB in 3/.test(text), "...counts the new graphics card cache");
  ok(/screen pictures 2, 0 MB/.test(text), "...and the screen's own pictures, which it missed before");
  ok(/2 characters loaded \(0 who left the room\), 6 MB drawn/.test(text), "...and every character loaded, with their drawing");

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

  // ---- folks who left the room: on the bot's tab, let go after 10 minutes gone (the game only does it when you leave)
  const lv = page(260239), pl = page(221397); await wait(3500);
  const mkC = (mn) => ({ AccountName: "Online-" + mn, MemberNumber: mn, ID: mn });
  for (const p of [lv, pl]) {
    p.stay = mkC(111); p.left = mkC(222); p.looked = mkC(333); p.npc = { AccountName: "NPC-Maid", ID: 9 };
    p.w.Character = [p.w.Player, p.stay, p.left, p.looked, p.npc];
    p.w.ChatRoomCharacter = [p.w.Player, p.stay];
    p.w.ChatRoomData = { Name: "B&B Farm" };
    p.w.InformationSheetSelection = p.looked;
    p.w.CharacterDelete = (C) => { const i = p.w.Character.indexOf(C); if (i >= 0) p.w.Character.splice(i, 1); };
  }
  const t1 = Date.now();
  ok(lv.w.__farmLetGo(t1) === 0 && lv.w.Character.includes(lv.left), "somebody who just left isn't let go straight away");
  ok(lv.w.__farmLetGo(t1 + 5 * 60000) === 0, "...nor after 5 minutes");
  ok(lv.w.__farmLetGo(t1 + 11 * 60000) === 1 && !lv.w.Character.includes(lv.left), "after 10 minutes gone, they're let go");
  ok(lv.w.Character.includes(lv.stay) && lv.w.Character.includes(lv.w.Player), "...never anybody still in the room, nor the bot herself");
  ok(lv.w.Character.includes(lv.looked), "...nor somebody whose profile is open");
  ok(lv.w.Character.includes(lv.npc), "...nor the game's own characters");
  const back = mkC(444); lv.w.Character.push(back);
  lv.w.__farmLetGo(t1 + 12 * 60000);                                        // gone
  lv.w.ChatRoomCharacter.push(back); lv.w.__farmLetGo(t1 + 15 * 60000);     // came back
  lv.w.ChatRoomCharacter.pop(); lv.w.__farmLetGo(t1 + 16 * 60000);          // left again
  ok(lv.w.__farmLetGo(t1 + 23 * 60000) === 0 && lv.w.Character.includes(back), "somebody who came back and left again gets a fresh 10 minutes");
  ok(lv.w.__farmLetGo(t1 + 27 * 60000) === 1 && !lv.w.Character.includes(back), "...then goes like anybody else");
  lv.w.CurrentScreen = "InformationSheet"; lv.w.Character.push(mkC(555)); lv.w.__farmLetGo(t1 + 30 * 60000);
  ok(lv.w.__farmLetGo(t1 + 50 * 60000) === 0, "never while the bot's out of the room");
  lv.w.CurrentScreen = "ChatRoom";
  pl.w.__farmLetGo(t1); ok(pl.w.__farmLetGo(t1 + 60 * 60000) === 0 && pl.w.Character.includes(pl.left), "never on a player's tab");
  lv.cmds.find((c) => c.Tag === "farmmem").Action();
  const lt = lv.local[lv.local.length - 1] || "";
  ok(/\(2 who left the room\)/.test(lt) && /2 who left let go/.test(lt), "/farmmem says how many loaded folks have left, and how many were let go");

  // ---- nothing drawn at all (Nov 17): in the room, a person's drawing isn't built on the bot's tab; their sheets are a speck
  const sp = page(260239), pp = page(221397); await wait(3500);
  const who = (mn) => ({ MemberNumber: mn, DrawnAssets: new Set(["Assets/Female3DCG/Cloth/old.png"]) });
  const a = who(600);
  sp.w.CharacterLoadCanvas(a);
  ok(sp.built.length === 0, "on the bot's tab in the room, a person's drawing isn't built at all");
  ok(a.Canvas && a.Canvas.width === 1 && a.Canvas.height === 1 && a.CanvasBlink && a.CanvasBlink.width === 1 && a.CanvasBlink.height === 1, "...their two sheets are a speck, 1 by 1");
  ok(a.DrawnAssets.size === 0, "...with nothin' listed on them for the game to keep warm");
  const big2 = who(601); big2.Canvas = sp.w.document.createElement("canvas"); big2.Canvas.width = 500; big2.Canvas.height = 1000;
  sp.w.CharacterLoadCanvas(big2);
  ok(big2.Canvas.width === 1 && big2.Canvas.height === 1, "a full-size sheet from before goes down to a speck");
  const b = who(602); pp.w.CharacterLoadCanvas(b);
  ok(pp.built.join() === "602" && b.Canvas.width === 500 && b.DrawnAssets.size === 2, "a player's tab builds everybody as ever, full size");
  sp.w.CurrentScreen = "InformationSheet"; sp.w.CharacterLoadCanvas(a);
  ok(sp.built.join() === "600" && a.Canvas.width === 500 && a.CanvasBlink.height === 1000, "out of the room (somebody's profile) the bot builds them for real, on full-size sheets again");
  sp.w.CurrentScreen = "ChatRoom";
  // the bot herself, drawn full size in the hall, walks into the room: a speck within a second
  const hall = page(260239); hall.w.CurrentScreen = "MainHall";
  await wait(3500);
  hall.w.Player.Canvas = hall.w.document.createElement("canvas"); hall.w.Player.Canvas.width = 500; hall.w.Player.Canvas.height = 1000;
  hall.w.CurrentScreen = "ChatRoom"; await wait(1300);
  ok(hall.w.Player.Canvas.width === 1, "the bot's own sheets from the hall go down to a speck once she's in the room");
  hall.w.CurrentScreen = "MainHall"; await wait(1300);
  ok(hall.w.Player.Canvas.width === 500 && hall.built.includes(260239), "...and she's drawn for real again when she leaves it");
  const d = who(604); sp.w.CharacterLoadCanvas(d); sp.w.Character = [a, big2, d];
  sp.cmds.find((c) => c.Tag === "farmmem").Action();
  ok(/2 kept a speck/.test(sp.local[sp.local.length - 1] || ""), "/farmmem says how many are kept a speck");
  // "Draw the room on the farm girl's screen" on: everybody built for real
  const dr = page(260239, { drawRoom: true }); await wait(3500);
  const c = who(603); dr.w.CharacterLoadCanvas(c);
  ok(dr.built.join() === "603" && c.Canvas.width === 500, "with \"Draw the room on the farm girl's screen\" on, the bot builds everybody for real");
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
