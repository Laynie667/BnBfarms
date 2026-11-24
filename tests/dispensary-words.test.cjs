// EVERY WORD (Nov 24). Laynie: "full list in dispensary of all craft and dose tags, and the strap on". The Dispensary's
// Every word guide lists every word that does somethin' on a crafted item: its doses (straight from the dose book), its
// gear, seed, toys and parasites, and the farm's own shots and toys (the farm girl's ?help shots, one shared text). Here
// every word on it is tried against the real thing, and every tag the farm girl reads is on the farm's list.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const url = (p) => require("url").pathToFileURL(path.join(__dirname, p)).href;

async function bootDisp() {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window;
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: 600, Name: "Hana", ExtensionSettings: {}, Ownership: { MemberNumber: 700 }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, HasVagina: () => true, Appearance: [] };
  w.ChatRoomCharacter = [w.Player];
  w.ServerSend = () => {}; w.ChatRoomSendLocal = () => {}; w.CommandCombine = () => {}; w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function (C, n) { C.ArousalSettings.Progress = n; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.InventoryPrerequisiteMessage = () => "";
  w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8")); await wait(1300);
  return w.__disp;
}

(async () => {
  const { GUIDE_BY, guideFor } = await import(url("../dispensary/src/guides.js"));
  const SEED = await import(url("../shared/seed.js")), HOLES = await import(url("../shared/holes.js")), { FARM_SHOTS } = await import(url("../shared/farm-shots.js"));
  const G = GUIDE_BY.words;
  ok(!!G && G.doses === true && G.lists.length >= 6 && G.farm === FARM_SHOTS, "an Every word guide: the doses, " + (G ? G.lists.length : 0) + " lists of words, and the farm's own");
  ok(guideFor("words") === G && guideFor("tags") === G && guideFor("strapon") === G, "/dispensary guide words (or tags, or strapon) opens it");
  const D = await bootDisp();

  // ── every dose in the book is on it, and each of its words really is that dose ──
  const book = D.book(), wrongDose = [];
  for (const [id, B] of Object.entries(book)) {
    if (id === "kit") continue;
    if (!B.keywords.length) wrongDose.push(id + " has no words to list");
    for (const kw of B.keywords) if (!D.dosesIn(kw).some((d) => d.id === id)) wrongDose.push(kw + " isn't " + id);
  }
  ok(!wrongDose.length, "every dose's words, as listed, are that dose (" + Object.keys(book).length + " doses" + (wrongDose.length ? ": " + wrongDose.join("; ") : "") + ")");

  // ── every gear word listed does what its row says ──
  const STRENGTH = { x2: 2, x3: 3, x4: 4, x5: 5, double: 2, triple: 3 };
  const tries = { checked: 0, wrong: [] };
  const check = (row, w) => {
    const c = row.check, low = w.toLowerCase();
    if (c === "strength") { const d = D.dosesIn("denial serum " + low)[0]; return d && d.x === STRENGTH[low]; }
    if (c.startsWith("pick:")) { const [, id, base] = c.split(":"); const b0 = base.replace("{w} ", ""), d0 = (D.dosesIn(b0).find((d) => d.id === id) || {}).p, d = D.dosesIn(base.includes("{w}") ? base.replace("{w}", low) : base + " " + low).find((x) => x.id === id); return !!d && !!d.p && d.p !== d0; }
    if (c.startsWith("trig:")) return D.phrases.trig(low).includes(c.slice(5));
    if (c.startsWith("para:")) return D.phrases.para(low).includes(c.slice(5));
    if (c === "dose:seed") return D.dosesIn(low).some((d) => d.id === "seed");
    if (c === "amount") return SEED.amountsIn(low).length > 0 || Object.values(SEED.seedAmounts(low + " pussy") || {}).some((v) => v > 0);
    if (c === "hole") return SEED.holesIn(low).length > 0;
    if (c === "seal") return SEED.SEAL_WORDS.test(low);
    if (c === "bigger") return HOLES.sizeShift(low) > 0;
    if (c === "smaller") return HOLES.sizeShift(low) < 0;
    if (c === "trainer") return HOLES.TRAINER.test(low);
    if (c === "cruel") return HOLES.CRUEL.test(low);
    if (c === "later") return !!D.phrases.later(low);
    if (c === "horny") return !!D.phrases.horny(low);
    if (D.phrases[c]) return !!D.phrases[c](low);
    return null;
  };
  for (const L of G.lists) for (const row of L.rows) {
    if (!row.check) continue;
    for (const w of row.words) { const r = check(row, w); tries.checked++; if (r !== true) tries.wrong.push(row.what + ": " + w + (r === null ? " (no check for " + row.check + ")" : "")); }
  }
  ok(tries.checked >= 120 && !tries.wrong.length, "every word on the lists does what it says: " + tries.checked + " tried" + (tries.wrong.length ? ", wrong: " + tries.wrong.join("; ") : ""));
  const unchecked = G.lists.flatMap((L) => L.rows.filter((r) => !r.check).map((r) => r.what));
  ok(unchecked.length === 1 && /strap-on/i.test(unchecked[0]), "...all but the farm's strap-on, which the farm's own test tries (strap-seed): " + unchecked.join(", "));
  const all = JSON.stringify(G.lists);
  ok(!/[()]/.test(G.lists.flatMap((L) => L.rows.map((r) => r.does)).join(" ")), "no round brackets in what the rows say");
  ok(/strap-on/.test(all) && /breeding/.test(all) && /300 ml/.test(all), "the seeded strap-on is on it, with its words and how to say how much");

  // ── the farm's own list: the very text the farm girl gives for ?help shots, and every tag she reads is on it ──
  const bot = fs.readFileSync(path.join(__dirname, "../dist/farmhand-bot.user.js"), "utf8"), disp = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
  ok(bot.includes("breeding, seeding or breeder \\u00B7 on a strap-on") || bot.includes("breeding, seeding or breeder · on a strap-on") || /breeding, seeding or breeder .xB7 on a strap-on/.test(bot), "the farm girl's ?help shots has the seeded strap-on now");
  ok(disp.includes("SHOTS & TAGGED ITEMS") || disp.includes("SHOTS &amp; TAGGED ITEMS"), "...and the Dispensary carries the same list");
  const src = fs.readFileSync(path.join(__dirname, "../bot/src/parts/core/01-config.js"), "utf8") + fs.readFileSync(path.join(__dirname, "../bot/src/parts/farm/10ur-shots-more.js"), "utf8");
  const tagBlocks = [...src.matchAll(/TAG_WORDS(?::| ?, ?)\s*\{([\s\S]*?)\n\s*\}\)?[,;]/g)].map((m) => m[1]).join("\n");
  const tags = [...tagBlocks.matchAll(/(\w+)\s*:\s*\[([^\]]*)\]/g)].map((m) => [m[1], [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1])]);
  const text = FARM_SHOTS.toLowerCase(), missing = tags.filter(([, ws]) => !ws.some((w) => text.includes(w.toLowerCase().replace(/-/g, " ")) || text.includes(w.toLowerCase())));
  ok(tags.length >= 20 && !missing.length, "every tag the farm girl reads is on the farm's list (" + tags.length + " tags" + (missing.length ? ", missing: " + missing.map(([t, ws]) => t + " [" + ws.slice(0, 3).join(", ") + "]").join("; ") : "") + ")");
  ok(!/kryptonite word|\?kryptonite set/i.test(FARM_SHOTS), "...and the kryptonite word stays the proprietors' secret");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
})();
