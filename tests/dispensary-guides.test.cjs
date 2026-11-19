// THE GUIDES (Nov 19). Laynie: "need to make guides in the dispensary for everything". Every guide is there, every
// "Try it" craft really is what its guide says it is, the 📖 on each section opens its guide right there, and
// /dispensary guide <topic> opens the page at one.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700, DAY = 86400000;

async function boot(settings) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: settings || {}, Ownership: { MemberNumber: OWNER }, Lovership: [], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, HasVagina: () => true, Appearance: [] };
  w.ChatRoomCharacter = [w.Player, { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true }];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list); w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function (C, n) { C.ArousalSettings.Progress = n; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.InventoryPrerequisiteMessage = () => "";
  w.eval(src); await wait(1300);
  return { w, sent, local, cmds, D: w.__disp };
}

(async () => {
  const url = (p) => require("url").pathToFileURL(path.join(__dirname, p)).href;
  const { GUIDES, GUIDE_BY, guideFor } = await import(url("../dispensary/src/guides.js"));
  const H = await import(url("../shared/holes.js"));

  // ── the guides themselves ──
  const want = ["start", "craft", "give", "gear", "timing", "pick", "kits", "horny", "breeding", "nipples", "holes", "parasites", "safety", "hardcore", "farm", "commands"];
  ok(want.every((id) => GUIDE_BY[id]) && GUIDES.length === want.length, "a guide for every part of the Dispensary (" + GUIDES.map((g) => g.id).join(", ") + ")");
  ok(GUIDES.every((g) => g.title && g.icon && g.intro && Array.isArray(g.steps) && g.steps.length >= 2 && (g.see || []).every((k) => GUIDE_BY[k] && k !== g.id)), "...each with a title, an intro, its steps, and see-alsos that are real guides");
  const all = GUIDES.map((g) => [g.intro, ...g.steps, ...(g.tips || []), ...(g.craft || []).map((c) => c.note)].join(" ")).join(" ");
  ok(!/[<>]{2}|undefined|TODO/.test(all) && !/\b(clinical|patient|subject)\b/i.test(all), "...in the farm's own voice, nothin' clinical and nothin' left unfinished");
  ok(guideFor("hole") === GUIDE_BY.holes && guideFor("needle") === GUIDE_BY.give && guideFor("keyholders") === GUIDE_BY.hardcore && guideFor("statue") === GUIDE_BY.pick && guideFor("every") === GUIDE_BY.commands && guideFor("zzz") === null,
    "a topic by its name or a word for it: hole, needle, keyholders, statue");

  // ── every "Try it" craft is what its guide says ──
  let { w, local, cmds, D } = await boot();
  const crafts = GUIDES.flatMap((g) => (g.craft || []).map((c) => Object.assign({ guide: g.id }, c)));
  const wrong = [];
  for (const c of crafts) {
    if (c.name.length > 30) wrong.push(c.name + ": longer than the game's 30-letter name");
    const got = D.dosesIn((c.name + " | " + (c.desc || "")).toLowerCase()).map((d) => (c.expect.some((e) => e.startsWith(d.id + ":")) ? d.id + ":" + d.p : d.id)).sort();
    if (JSON.stringify(got) !== JSON.stringify(c.expect.slice().sort())) wrong.push(c.name + " gave " + JSON.stringify(got) + ", wants " + JSON.stringify(c.expect));
  }
  ok(crafts.length >= 20 && !wrong.length, "every craft to try gives just the doses its guide says, and fits the game's name box (" + crafts.length + " crafts" + (wrong.length ? ": " + wrong.join("; ") : "") + ")");
  ok(D.dosesIn("denial serum x2")[0].x === 2 && D.dosesIn("fill-out, belly x2 | ")[0].x === 2, "...and x2 is two doses' worth, as the guide says");

  // gear: drip, a kiss trigger, roulette on an injector
  const crafted = (group, asset, name, desc) => ({ Asset: { Name: asset, Group: { Name: group }, Description: asset }, Craft: { Name: name, Description: desc || "", MemberNumber: OWNER }, Property: {} });
  const G = Object.fromEntries(GUIDE_BY.gear.craft.map((c) => [c.name, c]));
  w.Player.Appearance = [crafted("ItemMouth", "BallGag", "Drip Gag", G["Drip Gag"].desc), crafted("ItemNeck", "LeatherCollar", "Kiss Me Collar", G["Kiss Me Collar"].desc), crafted("ItemButt", "BlackButtPlug", "Roulette Plug", G["Roulette Plug"].desc)];
  const worn = D.worn(), by = (n) => worn.find((g) => g.item.Craft.Name === n);
  ok(by("Drip Gag") && by("Drip Gag").drip && by("Drip Gag").list.some((d) => d.id === "denial"), "the Drip Gag keeps denial in you while it's on");
  ok(by("Kiss Me Collar") && by("Kiss Me Collar").trig.includes("kissed"), "...the Kiss Me Collar doses on a kiss");
  ok(by("Roulette Plug") && by("Roulette Plug").roulette && by("Roulette Plug").inject && by("Roulette Plug").every === 20, "...the Roulette Plug: a mystery dose every 20 minutes");
  w.Player.Appearance = [crafted("ItemNipples", "NippleClamp", "Dilator Clamps", "nipple dilator drip")];
  ok(D.worn()[0] && D.worn()[0].drip, "...the Dilator Clamps hold the Dilator in you while they're on");
  // horny: hungry thrusts, insatiable breeding is rough and breeds
  w.Player.Appearance = [crafted("ItemVulva", "VibratingDildo", "Hungry Tentacle Plug"), crafted("ItemMouth", "DildoGag", "Insatiable Breeding Gag")];
  const hg = D.horny(), hp = hg.find((g) => g.where === "hole"), hm = hg.find((g) => g.where === "mouth");
  ok(hp && hp.lvl === 1 && hm && hm.lvl === 2 && hm.breed, "the horny gear to try: a hungry plug, and an insatiable gag that breeds");
  w.Player.Appearance = [];
  // holes: the cruel plug with a goal, and the throat trainer
  const it = (group, asset, name, desc) => ({ Asset: { Name: asset, Group: { Name: group }, Description: asset }, Craft: { Name: name, Description: desc, MemberNumber: OWNER }, Property: {} });
  const hc = Object.fromEntries(GUIDE_BY.holes.craft.map((c) => [c.name, c]));
  const p = H.toyIn(it("ItemButt", "BlackButtPlug", "Cruel Training Plug", hc["Cruel Training Plug"].desc), ("Cruel Training Plug | " + hc["Cruel Training Plug"].desc).toLowerCase());
  ok(p && p.cruel && p.trainer && p.goal && p.goal.to === 7 && p.goal.inMs === 2 * DAY, "the Cruel Training Plug: cruel, a trainer, aimin' for gaping in 2 days (" + JSON.stringify(p && p.goal) + ")");
  const tg = H.toyIn(it("ItemMouth", "DildoGag", "Throat Trainer Gag", hc["Throat Trainer Gag"].desc), ("Throat Trainer Gag | " + hc["Throat Trainer Gag"].desc).toLowerCase());
  ok(tg && tg.hole === "throat" && tg.trainer && tg.goal && H.sizeWord("throat", tg.goal.to) === "deep", "...the Throat Trainer Gag trains a throat to deep");
  ok(GUIDE_BY.holes.tips[0].includes(H.HOLE_SIZES.butt.names.slice(0, 10).join(", ")) && GUIDE_BY.holes.tips[0].includes(H.HOLE_SIZES.throat.names.slice(0, 8).join(", ")), "...and its list of sizes is the farm's own words");

  // ── on the page ──
  const cmd = cmds.find((x) => x.Tag === "dispensary");
  cmd.Action("page"); await wait(50);
  const page = () => w.document.getElementById("fd-page");
  ok(page() && /📖 Guides/.test(page().textContent) && page().querySelectorAll(".fd-chip").length === GUIDES.length, "the page opens with every guide listed at the top, the first time");
  ok(![...page().childNodes].some((n) => n.nodeType === 3 && /null|undefined/.test(n.textContent)), "...and no stray \"null\" where a guide isn't open");
  const how = [...page().querySelectorAll("button.fd-how")].filter((b) => /How it works/.test(b.textContent));
  ok(how.length >= 13, "every section has its own 📖 How it works (" + how.length + ")");
  // the Holes section's guide opens right under its heading
  const holesBtn = how.find((b) => /Holes/.test(b.getAttribute("aria-label")));
  holesBtn.click(); await wait(20);
  const gc = page().querySelector(".fd-guide"), heads = [...page().querySelectorAll(".fd-head h3")].map((x) => x.textContent);
  ok(gc && /Hole training/.test(gc.textContent) && gc.previousElementSibling && /Holes/.test(gc.previousElementSibling.textContent), "📖 on Holes opens Hole training right under the Holes heading");
  ok(gc.querySelectorAll("ol li").length === GUIDE_BY.holes.steps.length && /Cruel Training Plug/.test(gc.textContent) && /goal: gaping in 2 days/.test(gc.textContent), "...with its steps and its crafts to try, word for word");
  ok(D.st().guided === true, "...and the list at the top folds away from now on");
  // a see-also goes to that guide, in the same place
  [...gc.querySelectorAll(".fd-chip")].find((b) => /Nipples/.test(b.textContent)).click(); await wait(20);
  ok(/Nipples/.test(page().querySelector(".fd-guide h4").textContent) && page().querySelectorAll(".fd-guide").length === 1, "a see-also opens that guide in its place");
  [...page().querySelectorAll(".fd-guide button")].find((b) => b.textContent === "Close").click(); await wait(20);
  ok(!page().querySelector(".fd-guide"), "Close puts it away");
  ok(heads.includes("Horny gear") && heads.includes("Keyholders") && heads.includes("Hardcore"), "horny gear has its own heading now, and keyholders and hardcore have their 📖 too");
  // the command, at a topic
  cmd.Action("guide keyholders"); await wait(50);
  ok(page() && /Hardcore and keyholders/.test((page().querySelector(".fd-guide h4") || {}).textContent || ""), "/dispensary guide keyholders opens the page at Hardcore and keyholders");
  cmd.Action("help"); await wait(50);
  ok(/Getting started/.test((page().querySelector(".fd-guide h4") || {}).textContent || ""), "/dispensary help opens Getting started");
  local.length = 0; cmd.Action("guide wibble"); await wait(20);
  ok(/No guide for that/.test(local.join(" ")) && /holes/.test(local.join(" ")), "a topic it doesn't know: it lists the ones it does");
  // a reload remembers you've seen them
  await wait(1800);
  const saved = JSON.parse(JSON.stringify(w.Player.ExtensionSettings));
  ({ w, D, cmds } = await boot(saved));
  ok(D.st().guided === true, "after a reload, it still knows you've opened the guides");
  cmds.find((x) => x.Tag === "dispensary").Action("page"); await wait(50);
  ok(!w.document.getElementById("fd-page").querySelector(".fd-chip"), "...so the list at the top stays folded, a tap away");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all passed"); process.exit(fails ? 1 : 0);
})();
