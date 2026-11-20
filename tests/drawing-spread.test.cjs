// DRAWIN' PEOPLE, ONE AT A TIME, AND TIMED (Nov 20). Laynie: "Is there any way to improve the drawing engine per browser?
// so its faster and not laggy?". The game draws somebody again the moment anything about them changes, so a lot at once
// froze the page till all of it was drawn. Now once a frame has spent 40 ms drawing people, anybody else with a drawn body
// waits for the next frame (showing their last picture; the game's own "must draw" mark brings them round). You never
// wait, nor does somebody with no picture yet, nor somebody without a drawn body. /farmmem says what drawin' took.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const FL = JSON.parse(fs.readFileSync(path.join(__dirname, "../shared/farm-look.json"), "utf8"));

(async () => {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, local = [], cmds = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.__FARMHAND_TEST__ = true;
  w.console.warn = () => {}; w.console.log = () => {};
  // the page's frames, run by hand
  let frames = []; w.requestAnimationFrame = (f) => { frames.push(f); return frames.length; };
  const frame = () => { const f = frames; frames = []; for (const g of f) g(performance.now()); };
  const C = (mn, name, canvas) => ({ MemberNumber: mn, Name: name, Appearance: [], Canvas: canvas === false ? null : { width: 500, height: 1000 }, MustDraw: false });
  const me = C(600, "Moo"), a = C(777, "Alexia"), b = C(778, "Bea"), fresh = C(779, "Cass", false), plain = C(888, "Dot");
  w.CurrentScreen = "ChatRoom"; w.Player = me; w.ChatRoomCharacter = [me, a, b, fresh, plain, { MemberNumber: 260239 }];
  w.ServerSend = () => {}; w.ServerPlayerIsInChatRoom = () => true; w.ChatRoomMessage = () => {};
  w.CommandCombine = (list) => cmds.push(...list); w.ChatRoomSendLocal = (h) => local.push(String(h));
  // the game's own drawing of somebody: as costly as we say, and noted
  let cost = 0; const built = [];
  w.CommonDrawAppearanceBuild = function () {};
  w.CharacterAppearanceBuildCanvas = function (X) { const t = Date.now(); while (Date.now() - t < cost) { /* drawin' */ } built.push(X.MemberNumber); if (!X.Canvas) X.Canvas = { width: 500, height: 1000 }; };
  w.CharacterLoadCanvas = function (X) { w.CharacterAppearanceBuildCanvas(X); X.MustDraw = false; };
  w.localStorage.setItem("farmhand-drawn-body", JSON.stringify({ v: 1, on: true, cup: 12 }));
  w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
  await wait(3500);
  // three others tell the room they've a drawn body (Dot hasn't)
  for (const mn of [777, 778, 779]) w.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, type: "body", on: true, farm: FL.id, cup: 10, bm: "farm", bs: 0 } });
  await wait(2200);   // (their own first drawings, done)
  fresh.Canvas = null;
  const D = w.__drawnBody;
  ok(D && D.others.has(777) && D.others.has(778) && D.others.has(779) && !D.others.has(888), "three drawn bodies in the room, and Dot without one");

  // a lot at once, each costly
  cost = 60; frame(); built.length = 0;
  for (const X of [a, b, me, plain, fresh]) w.CharacterLoadCanvas(X);
  ok(built[0] === 777, "the first in a frame is drawn (" + built.join(",") + ")");
  ok(!built.includes(778), "...Bea, next with a drawn body, waits for the next frame: her last picture stays up meanwhile");
  ok(built.includes(600), "...you never wait: your own drawing is done at once");
  ok(built.includes(888), "...nor somebody without a drawn body (the game's own is quick)");
  ok(built.includes(779), "...nor somebody with no picture yet");
  ok(!b.MustDraw, "(Bea isn't marked yet: the game clears the mark after its own drawing)");
  frame();
  ok(b.MustDraw === true, "next frame: Bea is marked \"must draw\", so the game draws her itself the next time it shows her");
  built.length = 0; for (const X of w.ChatRoomCharacter) if (X.MustDraw) w.CharacterLoadCanvas(X);
  ok(built.length === 1 && built[0] === 778, "...and she's drawn then (" + built.join(",") + ")");
  // quick drawings share a frame
  cost = 5; frame(); built.length = 0;
  for (const X of [a, b, fresh]) w.CharacterLoadCanvas(X);
  ok(built.length === 3, "quick drawings all go in the same frame: nobody waits for nothing (" + built.join(",") + ")");

  // /farmmem says what drawin' took
  const mem = cmds.find((c) => c.Tag === "farmmem");
  ok(!!mem, "/farmmem is there");
  local.length = 0; mem.Action("");
  const text = local.join("\n");
  ok(/Drawin' people/.test(text) && /the last few: .*ms/.test(text), "/farmmem: the last drawings of people, timed (" + (text.match(/the last few:[^\n]*/) || [""])[0].slice(0, 160) + ")");
  if (process.env.SHOW) out("----\n" + text.split("\n").slice(0, 7).join("\n") + "\n----");
  ok(/Alexia \(777\) \d+ ms/.test(text) && /you \d+ ms/.test(text), "...by name, and yours as \"you\"");
  ok(/the slowest: /.test(text) && /waited a frame: [1-9]\d* times/.test(text), "...the slowest, and how often somebody waited a frame");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
