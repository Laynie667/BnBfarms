// Oct 15: the books kept past Tampermonkey (Laynie: "i mean better storage than what tampermonkey has"). Every save also
// goes into the browser's own database; if Tampermonkey's copy is lost, the bot puts the database copy back and restarts;
// a backup folder gets hourly files and a latest copy; and nothing saves over the books while a backup is going back in.
const fs = require("fs"), path = require("path");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// a small stand-in for the browser's database: one store, kept in memory, shared across "page loads"
function fakeIDB(mem) {
  const later = (f) => setTimeout(f, 1);
  return { open() {
    const rq = {};
    later(() => {
      const db = { createObjectStore() {}, transaction() {
        const tx = { objectStore() { return {
          get(k) { const r = {}; later(() => { r.result = mem.get(k); r.onsuccess && r.onsuccess(); }); return r; },
          put(v, k) { mem.set(k, v); later(() => tx.oncomplete && tx.oncomplete()); } }; } };
        return tx; } };
      rq.result = db; if (!mem.has("__made")) { mem.set("__made", 1); rq.onupgradeneeded && rq.onupgradeneeded(); } rq.onsuccess && rq.onsuccess();
    });
    return rq; } };
}
// a folder on the computer
function fakeDir(files) {
  return { name: "BnB Farm", async queryPermission() { return "granted"; }, async requestPermission() { return "granted"; },
    async getFileHandle(n) { return { async createWritable() { let t = ""; return { async write(x) { t += x; }, async close() { files.set(n, t); } }; } }; },
    async *entries() { for (const k of Array.from(files.keys())) yield [k, {}]; },
    async removeEntry(n) { files.delete(n); } };
}

function bootBot(store, mem, reloads) {
  const sent = [], handlers = {};
  global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
  const els = [];
  const el = () => { const e = { style: {}, children: [], addEventListener(t, f) { e["on" + t] = f; }, appendChild(c) { e.children.push(c); }, remove() {}, click() { e.onclick && e.onclick(); } }; els.push(e); return e; };
  const doc = { body: { appendChild(c) { els.push(c); } }, createElement: el, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
  const at = (m) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X: 1, Y: 1 }, PrivateState: {} } });
  const W = { document: doc, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {}, location: { reload() { reloads.n++; } }, alert() {}, prompt() {}, confirm: () => true,
    ServerSend: (ev, d) => sent.push([ev, d]), ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
    Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [260239] }, ChatRoomCharacter: [at(260239), at(221397)],
    ChatRoomPlayerIsAdmin: () => true, Commands: [], indexedDB: fakeIDB(mem), localStorage: { getItem: () => null, setItem() {} } };
  global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
  global.console = { ...console, log: () => {}, warn: () => {} };
  W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
  return { W, els };
}

(async () => {
  const FOLDER = process.argv[2] === "folder";
  const people = { "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [] }, "500": { mn: 500, name: "Moo", roles: ["LIVESTOCK"], onDuty: true, herds: [], tempKeys: [], cover: [] }, "501": { mn: 501, name: "Daisy", roles: ["LIVESTOCK"], onDuty: true, herds: [], tempKeys: [], cover: [] } };
  const mem = new Map(), reloads = { n: 0 };
  const store = { bnb_ledger_v1: JSON.stringify({ v: 4, people, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: {} }) };
  if (!FOLDER) {
    const { W } = bootBot(store, mem, reloads);
    await wait(3500);
    const L = W.FarmhandLedger(); L.people["501"].notes = "sweet girl";
    // a change: the save goes to both
    L.people["502"] = Object.assign({}, people["500"], { mn: 502, name: "Clover" });
  }
  if (!FOLDER) {
  await wait(2500);
  const db = mem.get("ledger");
  ok(db && typeof db.json === "string" && JSON.parse(db.json).people["221397"], "every save of the books lands in the browser's database too");
  ok(!/bnb_pass|bnb_user/.test(db ? db.json : ""), "...and the bot's login is never in it");

  // Tampermonkey's copy lost: the database copy comes back and the bot restarts
  {
    delete store.bnb_ledger_v1; reloads.n = 0;
    const saved = mem.get("ledger");
    bootBot(store, mem, reloads);
    await wait(3000);
    ok(store.bnb_ledger_v1 && Object.keys(JSON.parse(store.bnb_ledger_v1).people).length >= 3, "the books missing from Tampermonkey: put back from the database");
    ok(reloads.n === 1, "...and the bot restarts on them (" + reloads.n + ")");
    ok(mem.get("ledger") === saved || JSON.parse(mem.get("ledger").json).people["501"], "...without the fresh blank books savin' over the copy first");
  }

  // a backup folder: latest and hourly files, old hourly ones go (its own run: the copies above are still "in the office")
  const r = require("child_process").spawnSync(process.execPath, [__filename, "folder"], { encoding: "utf8" });
  out(r.stdout.trim()); if (r.status) fails++;
  }
  if (FOLDER) {
    const files = new Map([["bnb-ledger-2020-01-01-00.json", "{}"], ["other.txt", "x"]]);
    mem.set("dir", fakeDir(files)); reloads.n = 0;
    const { W, els } = bootBot(store, mem, reloads);
    await wait(4000);
    ok(files.has("bnb-ledger-latest.json") && JSON.parse(files.get("bnb-ledger-latest.json")).people["221397"], "a backup folder gets the latest books");
    ok(Array.from(files.keys()).some((k) => /^bnb-ledger-\d{4}-\d\d-\d\d-\d\d\.json$/.test(k) && !k.startsWith("bnb-ledger-2020")), "...and a dated hourly copy");
    ok(!files.has("bnb-ledger-2020-01-01-00.json") && files.has("other.txt"), "...old hourly copies go, nothing else is touched");
    const chip = els.find((e) => typeof e.textContent === "string" && e.textContent.startsWith("💾"));
    ok(chip && /backed up/.test(chip.textContent) && /BnB Farm/.test(chip.textContent), "the 💾 chip says it's backed up, and where (" + (chip && chip.textContent) + ")");
  }
  out(fails ? "FAILED " + fails : "all passed");
  process.exit(fails ? 1 : 0);
})();
