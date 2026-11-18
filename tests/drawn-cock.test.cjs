// Nov 18: the drawn cock in the game. Laynie on the studio's: "the balls should scale too, and it should blend better at
// the base", then "looked great". The bot says the farm's length, ball size and pent up in the drawn state; the Companion
// draws the studio's cock at that size (Cock and Balls Growth off the farm on top), and tells the room, so every
// Companion draws it the same.
const fs = require("fs"), path = require("path");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  // ── the bot: a stud's drawn state has his cock in it, a cow's doesn't ──
  {
    const store = {}, sent = [], handlers = {};
    const person = (mn, name, gender) => ({ mn, name, gender, roles: ["LIVESTOCK"], onDuty: true, herds: [], tempKeys: [], cover: [] });
    const people = { "500": person(500, "Moo", "female"), "600": person(600, "Bull", "male") };
    store.bnb_ledger_v1 = JSON.stringify({ v: 4, people, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
    global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
    const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
    const at = (m) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } });
    const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
      ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
      Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [260239] }, ChatRoomCharacter: [at(260239), at(500), at(600)],
      ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: () => null, setItem() {} } };
    global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
    const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => { const t = a.join(" "); if (!/Worker/.test(t)) warns.push(t); } };
    W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
    await wait(3000);
    const cow = W.__stateFor(500).drawn, bull = W.__stateFor(600).drawn;
    ok(cow && !("cock" in cow), "a cow's drawn state has no cock in it (" + JSON.stringify(cow) + ")");
    ok(bull && bull.cock === 6 && bull.balls === 3 && bull.pent === false, "a stud's has the farm's length, ball size and pent up (" + JSON.stringify(bull) + ")");
    const errs = warns.filter((w) => /TypeError|ReferenceError/i.test(w)); ok(!errs.length, "no errors in the bot " + errs.join(" | ").slice(0, 200));
  }

  // ── a Companion ──
  {
    const { JSDOM } = require("jsdom");
    const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
    const w = dom.window, sent = [];
    w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.__FARMHAND_TEST__ = true;
    w.CurrentScreen = "ChatRoom"; w.Player = { MemberNumber: 600, Appearance: [] }; w.ChatRoomCharacter = [{ MemberNumber: 600 }, { MemberNumber: 260239 }, { MemberNumber: 777 }];
    w.ServerSend = (ev, d) => sent.push([ev, d]); w.ServerPlayerIsInChatRoom = () => true;
    w.ChatRoomMessage = () => {}; w.CommandCombine = () => {};
    w.localStorage.setItem("farmhand-drawn-body", JSON.stringify({ v: 1, on: true, cup: 12 }));
    w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
    await wait(3500);
    const D = w.__drawnBody;
    ok(D && w.FarmCock && typeof w.FarmCock.canvas === "function", "the Companion carries the studio's cock drawing");
    const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2 }, d) });
    const mine = (n, type) => sent.slice(n).map((s) => s[1]).filter((m) => m && m.Content === "FarmhandMsg" && m.Dictionary.type === type);
    const STATE = (drawn) => ({ name: "Bull", onBooks: true, roles: ["LIVESTOCK"], tier: "", species: "bull", gender: "male", staff: false, herdmaster: false, proprietor: false, mandated: false, onDuty: true, onCall: false, keys: [], switches: {}, drawn });
    const G = () => D.mine.E && D.mine.E.GEN;
    for (let i = 0; i < 40 && !D.mine.E; i++) await wait(250);   // (the drawn body is set up a few seconds after the game is)

    let n = sent.length; bot({ type: "state", state: STATE({ cup: 0, belly: 0, cock: 12, balls: 5, pent: true }) }); await wait(300);
    let t = mine(n, "body").pop(), d = t && t.Dictionary;
    ok(d && d.ck === 12 && d.bl === 5 && d.pt === 1, "the farm's 12 inches, balls at 5, pent up: the room's told (" + JSON.stringify(d) + ")");
    ok(G() && G().inches === 12 && G().balls === 5 && G().pent === true && G().kind === "human", "...and his own drawing is at that size");
    ok(G() && G().drawn === false, "no pictures yet (they come from GitHub): the game's own cock till they're in");
    ok(d && JSON.stringify(d).length < 200, "...still a tiny message (" + (d ? JSON.stringify(d).length : 0) + " characters)");

    w.FarmhandDispensary = { grow: () => ({ cup: 0, ass: 0, cock: 2, balls: 1 }), dose: () => null };
    n = sent.length; w.dispatchEvent(new w.CustomEvent("farmhand-dispensary", { detail: { type: "grow", part: "cock", n: 2 } })); await wait(300);
    d = (mine(n, "body").pop() || {}).Dictionary;
    ok(d && d.ck === 16 && d.bl === 6, "Cock Growth twice and Balls Growth once off the farm: 4 inches and a size on top (" + JSON.stringify(d) + ")");
    w.FarmhandDispensary = { grow: () => ({ cup: 0, ass: 0, cock: 6, balls: 6 }), dose: () => null };
    n = sent.length; w.dispatchEvent(new w.CustomEvent("farmhand-dispensary", { detail: { type: "grow", part: "cock", n: 6 } })); await wait(300);
    n = sent.length; bot({ type: "state", state: STATE({ cup: 0, belly: 0, cock: 30, balls: 20, pent: false }) }); await wait(300);
    d = (mine(n, "body").pop() || {}).Dictionary;
    ok(d && d.ck === 36 && d.bl === 20 && d.pt === 0, "the farm's biggest with growth on top: no longer than 36, balls no past 20 (" + JSON.stringify(d) + ")");
    delete w.FarmhandDispensary;
    n = sent.length; bot({ type: "state", state: STATE({ cup: 0, belly: 0 }) }); await wait(300);
    d = (mine(n, "body").pop() || {}).Dictionary;
    ok(d && d.ck === 6 && d.bl === 3 && d.pt === 0, "the farm counts no cock for him: the farm's starting 6 inches and 3 (" + JSON.stringify(d) + ")");

    // the pictures in: drawn
    const has = w.FarmCock.hasStamps; w.FarmCock.hasStamps = (k) => k === "human";
    n = sent.length; bot({ type: "state", state: STATE({ cup: 0, belly: 0, cock: 9, balls: 4 }) }); await wait(300);
    ok(G() && G().drawn === true && G().inches === 9, "with the pictures in, it's drawn");

    // somebody else's Companion: drawn at the size they say
    w.ChatRoomMessage({ Sender: 777, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, type: "body", on: true, farm: JSON.parse(fs.readFileSync(path.join(__dirname, "../shared/farm-look.json"), "utf8")).id, cup: 10, bm: "farm", bs: 0, ck: 20, bl: 8, pt: 1, sy: 2 } }); await wait(300);
    let o = D.others.get(777);
    ok(o && o.E && o.E.GEN.inches === 20 && o.E.GEN.balls === 8 && o.E.GEN.pent === true && o.E.GEN.style === 2 && o.E.GEN.drawn === true, "somebody else's 20 inches, balls at 8, pent up, their third shaft: drawn that way");
    const FLid = JSON.parse(fs.readFileSync(path.join(__dirname, "../shared/farm-look.json"), "utf8")).id;
    w.ChatRoomMessage({ Sender: 777, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, type: "body", on: true, farm: FLid, cup: 10, bm: "farm", bs: 0, ck: 999, bl: -4, pt: 0, sy: 9 } }); await wait(300);
    o = D.others.get(777);
    ok(o && o.E.GEN.inches === 36 && o.E.GEN.balls === 1 && o.E.GEN.style === 2, "...sizes out of range kept in range (" + (o && [o.E.GEN.inches, o.E.GEN.balls, o.E.GEN.style].join(",")) + ")");
    w.ChatRoomMessage({ Sender: 777, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, type: "body", on: true, farm: FLid, cup: 11, bm: "farm", bs: 0 } }); await wait(300);
    o = D.others.get(777);
    ok(o && o.E.GEN.inches === 6 && o.E.GEN.balls === 3 && o.E.GEN.pent === false, "an older Companion that says nothin' about it: the farm's starting one");
    w.FarmCock.hasStamps = has;
    n = sent.length; bot({ type: "state", state: STATE({ cup: 0, belly: 0, cock: 10, balls: 4 }) }); await wait(300);
    ok(G() && G().drawn === false, "no pictures: the game's own again");

    // the cock picture's swapped for the drawing only while the drawn body's on, and the studio's own
    // (cock-drawing.js) asks for its pictures from GitHub so their colours can be read
    const src = fs.readFileSync(path.join(__dirname, "../studio/web/cock-drawing.js"), "utf8");
    ok(/crossOrigin = "anonymous"/.test(src), "pictures from GitHub are asked for so their colours can be read");
    const dist = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");
    ok(dist.includes("raw.githubusercontent.com/Laynie667/BnBfarms/main/cock/v1/"), "the Companion fetches them from the repo's cock/v1/");
  }
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
