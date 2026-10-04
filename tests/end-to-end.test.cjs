// The real Companion and the real bot, wired to each other. Every button on every tab of every panel
// is clicked, and each click must visibly do SOMETHING in the panel (an answer, a notice, a doc, a card,
// a hint, or a change on screen). A button that does nothing at all is reported by name.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BOT = 260239, ME = 221397;

/* ── the bot, in its own pretend browser ── */
const store = {}, handlers = {};
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR", "LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], breedable: true },
  "500": { mn: 500, name: "Moo", roles: ["LIVESTOCK"], species: "cow", onDuty: true, herds: [{ leader: 221397, type: "perm", at: 1 }], tempKeys: [], cover: [], breedable: true, hypno: true },
}, applications: [], archive: {}, log: [], stuckLog: [], spots: { staff: { X: 2, Y: 2 } }, jars: [{ id: 1, ml: 20, stud: 500, t: Date.now() }] });
global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
const bdoc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
const at = (m, X, Y) => ({ MemberNumber: m, Name: "N" + m, MapData: { Pos: { X, Y }, PrivateState: {} }, Appearance: [] });
const chars = [at(BOT, 0, 0), at(ME, 10, 10), at(500, 12, 12)];
chars[1].Name = "Laynie"; chars[2].Name = "Moo";
let toPanel = () => {};
const BW = { document: bdoc, addEventListener() {}, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => { if (ev === "ChatRoomChat" && d && d.Target === ME && d.Type === "Hidden") toPanel(d); if (ev === "AccountBeep" && d.MemberNumber === ME) toPanel({ beep: d.Message }); },
  ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
  Player: { MemberNumber: BOT, FriendList: [ME, 500] }, ChatRoomData: { Name: "B&B Farm", Admin: [BOT], MapData: { Type: "Always" } },
  ChatRoomCharacter: chars, ChatRoomPlayerIsAdmin: () => true, Commands: [] };
global.unsafeWindow = BW; global.window = BW; global.Blob = class {}; global.URL = { createObjectURL() {} };
const realConsole = console; global.console = { ...console, log: () => {}, warn: () => {} };
BW.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));

/* ── the Companion, in a real-ish page ── */
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window, D = w.document;
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
w.CurrentScreen = "ChatRoom"; w.ChatRoomCharacter = [{ MemberNumber: ME }, { MemberNumber: BOT }];
// a dressed player, so the outfit "Save" buttons really save (otherwise every one gives the same "couldn't read" note)
w.Player = { MemberNumber: ME, Name: "Laynie", Appearance: [{ Asset: { Name: "Dress", Group: { Name: "Cloth", Category: "Appearance", Clothing: true, AllowNone: true }, Category: [] }, Color: "Default" }] };
w.ServerBundledItemFromAppearanceItem = (x) => ({ Group: x.Asset.Group.Name, Name: x.Asset.Name, Color: x.Color, Property: x.Property });
w.ServerAppearanceBundle = (a) => a.map((x) => ({ Group: x.Asset.Group.Name, Name: x.Asset.Name, Color: x.Color }));
w.LZString = { compressToBase64: (s) => Buffer.from(String(s)).toString("base64"), decompressFromBase64: (s) => Buffer.from(String(s), "base64").toString() };
w.ChatRoomMessage = () => {}; w.CommandCombine = () => {};
w.ChatRoomSendLocal = () => {};
w.BCPlus = { loaded: true, version: { major: 0, minor: 14, patch: 0 } };
// what the panel sends goes to the bot as if from Laynie
w.ServerSend = (ev, d) => {
  if (ev === "ChatRoomChat") handlers.ChatRoomMessage(Object.assign({}, d, { Sender: ME }));
  if (ev === "AccountBeep") handlers.AccountBeep({ MemberNumber: ME, Message: d.Message });
};
toPanel = (d) => { if (!d.beep) w.ChatRoomMessage(Object.assign({}, d, { Sender: BOT })); };
w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));

const panel = () => D.getElementById("fhc-panel");
// a fingerprint of what the panel shows; any visible change counts as the button doin' somethin'
const look = () => panel().querySelector(".fhc-body").innerHTML;   // text AND looks (a switch flippin' only changes its look)
const pills = () => [...D.querySelectorAll("#fhc-panel .fhc-row .fhc-pill")];
const pick = (label) => { const b = pills().find((x) => x.textContent.trim().startsWith(label)); if (b) b.click(); return !!b; };
const SKIP = /^(Safe word|I'm stuck|Call staff|✕|Send|Dismiss)$/;

(async () => {
  await wait(4500);
  panel().classList.add("open");
  await wait(3000);   // hello → welcome → state
  out("0 bot and panel connected ->", /connected/.test(D.getElementById("fhc-status").textContent));
  const dead = [], tried = new Set();
  for (const view of ["Livestock", "Staff", "Dashboard"]) {
    if (!pick(view)) { dead.push("view " + view + " missing"); continue; }
    await wait(300);
    const tabs = [...D.querySelectorAll('#fhc-panel nav[aria-label="Panel sections"] .fhc-pill')].map((b) => b.textContent.replace(/ · \d+$/, "").trim());
    for (const tab of tabs) {
      const go = () => { pick(view); const t = [...D.querySelectorAll('#fhc-panel nav[aria-label="Panel sections"] .fhc-pill')].find((b) => b.textContent.trim().startsWith(tab)); if (t) t.click(); };
      go(); await wait(200);
      // fill any empty boxes so buttons that need a name have one
      for (const i of D.querySelectorAll("#fhc-body input:not(#fhc-input), #fhc-panel .fhc-body input, #fhc-panel .fhc-body textarea")) {
        if (!i.value) { i.value = /prizecow|name/i.test(i.placeholder || "") ? "prizecow" : "Moo"; i.dispatchEvent(new w.Event("input")); }
      }
      const labels = [...D.querySelectorAll("#fhc-panel .fhc-body button")].map((b) => b.getAttribute("aria-label") || b.textContent.trim());
      for (const label of labels) {
        if (SKIP.test(label) || tried.has(view + "/" + tab + "/" + label)) continue;
        tried.add(view + "/" + tab + "/" + label);
        go(); await wait(150);
        const b = [...D.querySelectorAll("#fhc-panel .fhc-body button")].find((x) => (x.getAttribute("aria-label") || x.textContent.trim()) === label);
        if (!b) continue;
        // clickin' the filter or person that's already picked has nothin' to change; that's fine
        if (b.classList.contains("on") && b.classList.contains("fhc-pill")) continue;
        const before = look();
        b.click();
        let changed = false;
        for (let i = 0; i < 25 && !changed; i++) { await wait(200); changed = look() !== before; }
        if (!changed) dead.push(view + " › " + tab + " › " + label);
      }
    }
  }
  out("1 buttons clicked ->", tried.size);
  out("1 every button visibly does somethin' ->", dead.length === 0, dead.length ? "dead: " + dead.join(" · ") : "");
  process.exit(0);
})();
