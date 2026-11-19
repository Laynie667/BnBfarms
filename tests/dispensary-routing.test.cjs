// ONE DOOR PER DOSE, EVERY SPELLIN' (Nov 19). Laynie: "need to double check that everything gets routed correctly, and
// that its accurately checking the phrases, even if we need to hyphenate". On the farm, with the farm girl in the room,
// a farm dose is hers to read (her books) and every other dose is the Dispensary's. So: every farm dose, in every
// spellin' ("Needy Nectar", "needy-nectar", "NeedyNectar"), takes through her; every Dispensary-only dose gets nothin'
// from her for somebody runnin' the Dispensary (no doublin'), and she stays quiet about it; without a Dispensary she
// reads her own words as ever.
const fs = require("fs"), path = require("path");
const store = {}; const sent = []; const handlers = {};
const S = (mn, name, extra) => Object.assign({ mn, name, roles: ["LIVESTOCK"], species: "cow", gender: "female", onDuty: true, herds: [], tempKeys: [], cover: [], limits: "", breedable: true, fertile: true, milkable: true, potions: true }, extra || {});
store.bnb_ledger_v1 = JSON.stringify({ v: 4, people: {
  "221397": { mn: 221397, name: "Laynie", roles: ["PROPRIETOR"], onDuty: true, herds: [], tempKeys: [], cover: [], gender: "female" },
  "500": S(500, "Moo"), "600": S(600, "Hana"), "700": S(700, "Rex", { gender: "male", species: "dog" }),
}, applications: [], archive: {}, log: [], stuckLog: [], chores: [], wheel: [], spots: { rescue: { X: 50, Y: 50 } } });
global.GM_getValue = (k, d) => (k in store ? store[k] : d); global.GM_setValue = (k, v) => (store[k] = v); global.GM_registerMenuCommand = () => {};
const doc = { body: { appendChild() {} }, createElement() { return { style: {}, addEventListener() {} }; }, addEventListener() {}, getElementById() { return null; }, visibilityState: "visible" };
const at = (m, X, Y) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
const chars = [at(260239, 1, 1), at(221397, 10, 10), at(500, 15, 10), at(600, 16, 10), at(700, 18, 10)];
const C = (mn) => chars.find((c) => c.MemberNumber === mn);
const evts = {};
const W = { document: doc, addEventListener(e, f) { (evts[e] = evts[e] || []).push(f); }, dispatchEvent(ev) { (evts[ev.type] || []).forEach((f) => f(ev)); },
  CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } }, location: { reload() {} }, alert() {}, prompt() {},
  ServerSend: (ev, d) => { sent.push([ev, d]); }, ServerSocket: { connected: true, on: (e, f) => (handlers[e] = f) },
  Player: { MemberNumber: 260239, FriendList: [] }, ChatRoomData: { Name: "B&B Farm", Admin: [260239], MapData: { Type: "Always" } }, ChatRoomCharacter: chars,
  ChatRoomPlayerIsAdmin: () => true, Commands: [] };
W.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
global.unsafeWindow = W; global.window = W; global.Blob = class {}; global.URL = { createObjectURL() {} };
global.console = { ...console, log: () => {}, warn: () => {} };
W.__FARMHAND_TEST__ = true; eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const prod = (mn) => W.__prodOf(mn);
const say = async (mn, msg, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Whisper", Content: msg, Target: 260239 }); await wait(ms || 500); };
const hid = async (mn, type, data, ms) => { handlers.ChatRoomMessage({ Sender: mn, Type: "Hidden", Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data || {}) }); await wait(ms || 300); };
const doses = (mn, from) => sent.slice(from || 0).filter(([e, d]) => d && d.Content === "FarmhandMsg" && d.Target === mn && d.Dictionary && d.Dictionary.type === "dose").map(([, d]) => d.Dictionary.dose);
const tellsTo = (mn, from) => sent.slice(from || 0).filter(([e, d]) => e === "AccountBeep" ? d && d.MemberNumber === mn : e === "ChatRoomChat" && d && d.Target === mn && d.Content !== "FarmhandMsg").map(([, d]) => JSON.stringify(d)).join(" ");
const inject = async (by, to, name, desc) => {
  C(by).Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: desc || "" } }];
  handlers.ChatRoomMessage({ Sender: by, Type: "Activity", Content: "ChatOther-ItemArms-Inject", Dictionary: [{ SourceCharacter: by }, { TargetCharacter: to }, { Tag: "FocusAssetGroup", FocusGroupName: "ItemArms" }, { ActivityName: "Inject" }] });
  await wait(60);
};

(async () => {
  await wait(3500); const cfg = W.__cfg; cfg.USER_COOLDOWN_S = 0; cfg.SEND_INTERVAL_MS = 1;
  ["Laynie", "Moo", "Hana", "Rex"].forEach((nm, i) => (chars[i + 1].Name = nm));
  for (const mn of [221397, 500, 600, 700]) await say(mn, "?stats", 400);
  const { DOSE_WORDS, FARM_DOSES } = await import(require("url").pathToFileURL(path.join(__dirname, "../shared/dose-words.js")).href);
  // the book's keywords, by dose (what the page tells people to write)
  const KW = {}; let cur = null;
  for (const line of fs.readFileSync(path.join(__dirname, "../dispensary/src/doses.js"), "utf8").split("\n")) {
    const m = /^  ([a-z]+): \{$/.exec(line); if (m) cur = m[1];
    const k = /keywords: \[([^\]]*)\]/.exec(line); if (k && cur) KW[cur] = (k[1].match(/"[^"]+"/g) || []).map((s) => s.slice(1, -1));
  }
  const title = (s) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
  const spellings = (k) => [title(k), title(k).replace(/ /g, "-"), title(k).replace(/[- ]/g, "")];
  for (const mn of [600, 700]) await hid(mn, "dispHello", { ver: "0.20.0", farm: true, lscg: false, off: [], on: [], holes: 1 });
  // a clean slate between needles: no shots, no potions (a second bottle of one only stacks)
  const reset = (mn) => { const p = prod(mn); p.deniedUntil = 0; p.boosts = {}; p.heat = null; const R = W.FarmhandLedger().people[String(mn)]; if (R) R.fx = {}; };

  // ── farm doses: hers to read, in every spellin' ──
  // what each one does on her side (her books), or the dose she hands their Dispensary
  const DID = {
    denial: (mn) => prod(mn).deniedUntil > Date.now(), sedative: (mn) => (prod(mn).boosts.sedate || 0) > Date.now(), hairtrigger: (mn) => (prod(mn).boosts.trigger || 0) > Date.now(),
    heat: (mn, from) => doses(mn, from).includes("heat"), purge: (mn, from) => doses(mn, from).includes("purge"),
    needy: (mn, from) => doses(mn, from).includes("needy"), moo: (mn, from) => doses(mn, from).includes("moo"), bitterroot: (mn, from) => doses(mn, from).includes("bitterroot"),
    hiccup: (mn, from) => doses(mn, from).includes("hiccup"), feather: (mn, from) => doses(mn, from).includes("feather"),
  };
  const missed = [];
  for (const id of Object.keys(DID)) {
    for (const k of KW[id] || []) for (const sp of spellings(k)) {
      reset(600); const n = sent.length;
      await inject(700, 600, sp);
      if (!DID[id](600, n)) missed.push(id + ": " + JSON.stringify(sp));
    }
  }
  ok(!missed.length, "every farm dose, every spellin' on the page, takes through the farm girl (" + Object.keys(DID).join(", ") + (missed.length ? ": MISSED " + missed.join("; ") : "") + ")");
  // growth: her own sizes
  const grew = [];
  for (const [id, mn, part] of [["growcup", 600, "udder"], ["growcock", 700, "penis"], ["growballs", 700, "testes"]]) {
    for (const k of KW[id] || []) for (const sp of spellings(k)) {
      const p = prod(mn); p.size = Object.assign(p.size || {}, { [part]: 8 }); p.sizeBase = Object.assign(p.sizeBase || {}, { [part]: 8 });
      await inject(mn === 600 ? 700 : 600, mn, sp);
      if (!(prod(mn).size[part] > 8)) grew.push(id + ": " + JSON.stringify(sp));
    }
  }
  ok(!grew.length, "Udder, Cock and Balls Growth, every spellin', grow her own sizes (" + (grew.join("; ") || "all of them") + ")");
  ok(FARM_DOSES.every((id) => DID[id] || ["growcup", "growcock", "growballs", "growass", "reducing", "suggestible"].includes(id)), "...and that's every farm dose in the shared book (" + FARM_DOSES.join(", ") + ")");

  // ── the Dispensary's own doses: nothin' from her, for somebody runnin' it ──
  const doubled = [], noisy = [];
  for (const id of Object.keys(DOSE_WORDS).filter((x) => !FARM_DOSES.includes(x))) {
    for (const k of KW[id] || []) for (const sp of spellings(k)) {
      const p = prod(600); p.size = Object.assign(p.size || {}, { vulva: 6, butt: 6, throat: 6 }); p.sizeBase = Object.assign(p.sizeBase || {}, { vulva: 6, butt: 6, throat: 6 }); reset(600);
      const n = sent.length, before = JSON.stringify([p.size, p.boosts, p.deniedUntil]);
      await inject(700, 600, sp);
      if (doses(600, n).length || JSON.stringify([prod(600).size, prod(600).boosts, prod(600).deniedUntil]) !== before) doubled.push(id + ": " + JSON.stringify(sp));
      if (/couldn't read|isn't on the farm books/.test(tellsTo(700, n))) noisy.push(id + ": " + JSON.stringify(sp));
    }
  }
  ok(!doubled.length, "every Dispensary-only dose, every spellin': the farm girl does nothin' of her own with it (no doublin': Deep Throat Drops, tighteners, Sure-Catch...) (" + (doubled.join("; ") || "none doubled") + ")");
  ok(!noisy.length, "...and she doesn't tell the doser she couldn't read it (" + (noisy.join("; ") || "quiet") + ")");

  // ── without a Dispensary, her own words as ever ──
  { const p = prod(500); p.size = Object.assign(p.size || {}, { throat: 3, vulva: 6 }); p.sizeBase = Object.assign(p.sizeBase || {}, { throat: 3, vulva: 6 });
    await inject(700, 500, "Throat Relaxer"); const t1 = prod(500).size.throat;
    await inject(700, 500, "Pussy Tightener"); const v1 = prod(500).size.vulva;
    ok(t1 > 3 && v1 < 6, "no Dispensary: Throat Relaxer trains her throat and a Pussy Tightener tightens, the farm's own shots (" + t1 + ", " + v1 + ")"); }
  { const n = sent.length; await inject(700, 500, "StatueSerum");
    ok(/one of the Dispensary's doses/.test(tellsTo(700, n)), "...and a Dispensary-only dose on somebody without one: she tells the doser it needs the Dispensary, even run together"); }

  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all passed"); process.exit(fails ? 1 : 0);
})();
