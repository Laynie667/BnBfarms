// Oct 14: the farm's look for the drawn body goes through the bot (Laynie: "the outfit studio settings should route
// through the bot anyway"; her main on her phone had no studio to fetch from). The bot reads what its own Companion
// has, keeps it, says which one it has in its welcome, and hands it to whoever asks; a Companion takes it, draws with
// it under the player's own cup and belly, and tells the room the result.
const fs = require("fs"), path = require("path");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const LOOK = { v: 1, on: true, cup: 15, saved: "2026-10-14T22:00:00Z", breast: { full: 12, hang: -4 }, wear: { "Cloth/Sweater": "plain" }, belly: { std: { on: true, rx: 90, ry: 100, sag: 0.2, x: 0, y: 10, cut: 0.7 } }, auto: true, tuck: true, dress: true, mould: { items: [], mode: {} } };

(async () => {
  // ── the bot ──
  {
    const store = {}, sent = [], handlers = {}, ls = { "farmhand-drawn-body": JSON.stringify(LOOK) };
    const people = { "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] }, "500": { mn: 500, name: "Moo", roles: ["LIVESTOCK"], onDuty: true, herds: [], tempKeys: [], cover: [] } };
    store.bnb_ledger_v1 = JSON.stringify({ v: 4, people, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} });
    global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
    const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
    const at = (m) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } });
    const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() {} }, alert() {}, prompt() {},
      ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
      Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [260239] }, ChatRoomCharacter: [at(260239), at(221397), at(500)],
      ChatRoomPlayerIsAdmin: () => true, Commands: [], localStorage: { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => (ls[k] = String(v)) } };
    global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
    const warns = []; global.console = { ...console, log: () => {}, warn: (...a) => { const t = a.join(" "); if (!/Worker/.test(t)) warns.push(t); } };
    W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
    await wait(3000); W.__cfg.SEND_INTERVAL_MS = 2;
    const L = () => W.FarmhandLedger(), farmMsgs = (n) => sent.slice(n).filter((s) => s[1] && s[1].Content === "FarmhandMsg").map((s) => s[1]);
    const hidden = (mn, d) => handlers.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2 }, d) });
    W.__farmLookTick(); await wait(200);
    ok(L().drawnFarm && L().drawnFarm.body.cup === 15 && L().drawnFarm.body.belly.std.rx === 90, "the bot takes its own Companion's settings as the farm's look");
    ok(!("on" in L().drawnFarm.body) && !("saved" in L().drawnFarm.body), "...without whether it's switched on there");
    const at0 = L().drawnFarm.at;
    let n = sent.length; hidden(500, { type: "hello", ver: "0.19.2" }); await wait(600);
    const wel = farmMsgs(n).find((m) => m.Dictionary.type === "welcome" && m.Target === 500);
    ok(wel && wel.Dictionary.look === at0, "its welcome says which look it has");
    n = sent.length; hidden(500, { type: "bodyFarmAsk", at: 0 }); await wait(400);
    const got = farmMsgs(n).find((m) => m.Dictionary.type === "bodyFarm");
    ok(got && got.Target === 500 && got.Dictionary.at === at0 && got.Dictionary.body.cup === 15, "a Companion that asks gets it, and only that Companion");
    n = sent.length; hidden(500, { type: "bodyFarmAsk", at: at0 }); await wait(400);
    ok(!farmMsgs(n).some((m) => m.Dictionary.type === "bodyFarm"), "...and isn't sent it again when it has it already");
    n = sent.length; W.__farmLookTick(); await wait(200);
    ok(!farmMsgs(n).some((m) => m.Dictionary.type === "bodyFarm"), "nothing changed: nothing said");
    ls["farmhand-drawn-body"] = JSON.stringify(Object.assign({}, LOOK, { cup: 17 })); await wait(5);
    n = sent.length; W.__farmLookTick(); await wait(400);
    const bc = farmMsgs(n).find((m) => m.Dictionary.type === "bodyFarm");
    ok(L().drawnFarm.body.cup === 17 && L().drawnFarm.at > at0, "Laynie changes it on the bot: the farm's look changes");
    ok(bc && !bc.Target && bc.Dictionary.body.cup === 17, "...and every Companion in the room is told");
    const sd = W.__stateFor(500).drawn;
    ok(sd && sd.cup === 3 && sd.belly === 0, "a player's panel says their cup as the farm counts it and their belly (" + JSON.stringify(sd) + ")");
    const errs = warns.filter((w) => /farm look|TypeError|ReferenceError/i.test(w)); ok(!errs.length, "no errors in the bot " + errs.join(" | ").slice(0, 200));
  }

  // ── a Companion: takes it, draws with it under the player's own cup and belly ──
  {
    const { JSDOM } = require("jsdom");
    const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
    const w = dom.window, sent = [];
    w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
    w.CurrentScreen = "ChatRoom"; w.Player = { MemberNumber: 500, Appearance: [] }; w.ChatRoomCharacter = [{ MemberNumber: 500 }, { MemberNumber: 260239 }];
    w.ServerSend = (ev, d) => sent.push([ev, d]); w.ServerPlayerIsInChatRoom = () => true;
    w.ChatRoomMessage = () => {}; w.CommandCombine = () => {};
    w.localStorage.setItem("farmhand-drawn-body", JSON.stringify({ v: 1, on: true, cup: 12 }));   // switched on, nothing of their own
    w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
    await wait(3500);
    const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2 }, d) });
    const mine = (n, type) => sent.slice(n).map((s) => s[1]).filter((m) => m && m.Content === "FarmhandMsg" && m.Dictionary.type === type);
    let n = sent.length; bot({ type: "welcome", ver: "0.30.2", name: "Moo", proto: 2, look: 1111 }); await wait(300);
    const ask = mine(n, "bodyFarmAsk")[0];
    ok(ask && ask.Target === 260239 && ask.Dictionary.at === 0, "told the farm has a look it hasn't got: it asks for it");
    n = sent.length; bot({ type: "bodyFarm", at: 1111, body: Object.assign({}, LOOK, { on: undefined, saved: undefined }) }); await wait(300);
    const kept = JSON.parse(w.localStorage.getItem("farmhand-drawn-body-farm") || "null");
    ok(kept && kept.at === 1111 && kept.body.cup === 15, "it keeps the farm's look");
    const told = mine(n, "body")[0];
    ok(told && told.Dictionary.on && told.Dictionary.body.cup === 15 && told.Dictionary.body.breast.full === 12, "...draws with it, and tells the room so");
    ok(told && !(told.Dictionary.body.belly.std && told.Dictionary.body.belly.std.on), "...with no belly till they switch theirs on");
    n = sent.length; bot({ type: "welcome", ver: "0.30.2", name: "Moo", proto: 2, look: 1111 }); await wait(300);
    ok(!mine(n, "bodyFarmAsk").length, "a welcome with the look it has: no asking again");
    w.ChatRoomMessage({ Sender: 777, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, type: "bodyFarm", at: 2222, body: { cup: 3 } } }); await wait(200);
    ok(JSON.parse(w.localStorage.getItem("farmhand-drawn-body-farm")).at === 1111, "a farm look from anybody but the farm girl is ignored");
    // her size follows the farm (Laynie: "the belly sizes in game need to automatically adjust", "same for tit sizes and growth")
    const STATE = (drawn) => ({ name: "Moo", onBooks: true, roles: ["LIVESTOCK"], tier: "", species: "cow", gender: "female", staff: false, herdmaster: false, proprietor: false, mandated: false, onDuty: true, onCall: false, keys: [], switches: {}, drawn });
    n = sent.length; bot({ type: "state", state: STATE({ cup: 14, belly: 2 }) }); await wait(300);
    let t2 = mine(n, "body").pop();
    ok(t2 && t2.Dictionary.body.cup === 14, "the farm has grown her to an L: she's drawn an L");
    ok(t2 && t2.Dictionary.body.belly.std && t2.Dictionary.body.belly.std.on && t2.Dictionary.body.belly.std.rx === Math.round(90 * 70 / 92), "...with a middling belly while she's that full: the farm look's belly, in proportion (" + JSON.stringify(t2 && t2.Dictionary.body.belly.std) + ")");
    n = sent.length; bot({ type: "state", state: STATE({ cup: 16, belly: 4 }) }); await wait(300);
    t2 = mine(n, "body").pop();
    ok(t2 && t2.Dictionary.body.cup === 16 && t2.Dictionary.body.belly.std.rx > 100, "she grows, and so does her belly");
    n = sent.length; bot({ type: "state", state: STATE({ cup: 16, belly: 0 }) }); await wait(300);
    t2 = mine(n, "body").pop();
    ok(t2 && !t2.Dictionary.body.belly.std.on, "emptied out: the belly goes");
    n = sent.length; bot({ type: "state", state: STATE({ cup: 16, belly: 0 }) }); await wait(300);
    ok(!mine(n, "body").length, "the same size again: nothing new said");
  }
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
