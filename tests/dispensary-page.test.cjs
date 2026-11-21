// THE DISPENSARY'S PAGE, laid out like the Companion's (Nov 21). Laynie: "can you organize the dispensary similar to the
// farmhand companion, and make sure absolutely everything is in the way it is supposed to be". Pages down the side, the
// safeword at the top of every one, "Find a setting", and every setting on exactly one page.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700;

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
  w.confirm = () => true;
  w.eval(src); await wait(1300);
  return { w, sent, local, cmds, D: w.__disp };
}

(async () => {
  let { w, D, cmds, local } = await boot();
  const cmd = cmds.find((x) => x.Tag === "dispensary");
  cmd.Action("page"); await wait(50);
  const page = () => w.document.getElementById("fd-page");
  const nav = () => [...page().querySelectorAll(".fd-nav button")];
  const go = async (label) => { const b = nav().find((x) => x.textContent.includes(label)); if (b) b.click(); await wait(20); return !!b; };
  const PAGES = ["In you now", "Who and when", "Doses", "Gear and kits", "Nipples and holes", "Breedin'", "On your screen", "Hardcore and keys", "Guides", "About"];
  ok(nav().length === PAGES.length && PAGES.every((p, i) => nav()[i].textContent.includes(p)), "pages down the side, like the Companion's: " + nav().map((b) => b.textContent).join(" · "));
  ok(/Guides/.test((nav().find((b) => b.classList.contains("fd-on")) || {}).textContent || ""), "the first time, it opens on the Guides");

  // every page draws, with the safeword at the top; what each page holds
  const drawn = {}, ctl = {}, heads = {};
  for (const p of PAGES) {
    await go(p);
    const body = page().querySelector(".fd-body");
    drawn[p] = !/hit a snag/.test(body.textContent) && !/\bundefined\b|\bNaN\b|\[object/.test(body.textContent) && body.children.length > 0;
    ctl[p] = [...body.querySelectorAll("input, select")].map((e) => (e.getAttribute("aria-label") || (e.closest("label") ? e.closest("label").textContent.trim() : "") || e.getAttribute("placeholder") || e.type));
    heads[p] = [...body.querySelectorAll(".fd-head h3, h3")].map((x) => x.textContent);
    if (!/Safeword: lift every dose/.test((page().querySelector(".fd-bar") || {}).textContent || "")) drawn[p] = false;
  }
  ok(PAGES.every((p) => drawn[p]), "every page draws, safeword on top, nothin' broken or blank (" + PAGES.filter((p) => !drawn[p]).join(", ") + ")");
  // every setting on the page it belongs on, and only there
  const WANT = {
    "Who and when": ["Who can dose you", "While online", "Real time"],
    "Doses": ["Where Tender goes", "Tolerance", "Cravings"],
    "Gear and kits": ["Kits can dress me", "What kits put on you", "How fast kits go on", "Horny gear can use me", "The mouthpiece's words go straight out"],
    "Nipples and holes": ["They close up slowly on their own", "Too-big toys can hurt"],
    "Breedin'": ["Breed me anywhere"],
    "On your screen": ["Screen touches", "Dose icons by people", "Let others see mine", "Your animal"],
    "Hardcore and keys": ["Add a keyholder by member number", "When hardcore ends"] };
  const where = (lbl) => PAGES.filter((p) => ctl[p].some((c) => c.startsWith(lbl)));
  const wrong = [];
  for (const [p, list] of Object.entries(WANT)) for (const l of list) { const at = where(l); if (at.length !== 1 || at[0] !== p) wrong.push(l + " on " + (at.join(" + ") || "no page")); }
  ok(!wrong.length, "every setting on its own page, and on no other (" + wrong.join("; ") + ")");
  const doses = Object.keys(D.book()).length;
  ok(ctl["Doses"].filter((c) => /^\S+ /.test(c) && !/^(Where|Tolerance|Cravings)/.test(c)).length >= doses, "...a switch for every one of the " + doses + " doses on Doses");
  const paraKinds = ctl["Gear and kits"].length - WANT["Gear and kits"].length;
  ok(paraKinds >= 7, "...and every crafted parasite's switch on Gear and kits (" + paraKinds + ")");
  ok(heads["Hardcore and keys"].includes("Keyholders") && heads["Hardcore and keys"].includes("Hardcore") && heads["Gear and kits"].includes("Parasites") && heads["Breedin'"].includes("Seed"),
    "...keyholders with hardcore, parasites with the gear, seed with breedin'");
  // every section's 📖, on its own page
  let how = 0; for (const p of PAGES) { if (p === "Guides") continue; await go(p); how += [...page().querySelectorAll(".fd-body button.fd-how")].length; }
  ok(how >= 14, "every section still has its 📖 How it works (" + how + ")");
  // a section's guide opens right under its heading, on its page
  await go("Nipples and holes");
  [...page().querySelectorAll(".fd-body button.fd-how")].find((b) => /Holes/.test(b.getAttribute("aria-label"))).click(); await wait(20);
  const gc = page().querySelector(".fd-guide");
  ok(gc && /Hole training/.test(gc.textContent) && /Holes/.test(gc.previousElementSibling.textContent), "📖 on Holes opens Hole training right under the Holes heading");

  // Find a setting
  const find = page().querySelector("input.fd-find");
  const look = async (q) => { find.value = q; find.dispatchEvent(new w.Event("input")); await wait(10); return page().querySelector(".fd-body"); };
  let r = await look("tolerance");
  ok(/Doses/.test(r.querySelector(".fd-found").textContent) && /Tolerance/.test(r.textContent) && !/Breed me anywhere/.test(r.textContent), "Find a setting: \"tolerance\" finds it, under the page it's on");
  r = await look("breed me");
  ok(/Breedin'/.test(r.textContent) && /Breed me anywhere/.test(r.textContent), "...\"breed me\" finds Breed me anywhere");
  ok(page().querySelector("input.fd-find") === find, "...and typin' keeps the box, so a phone keyboard stays up");
  r = await look("wibblewobble");
  ok(/Nothin' matches/.test(r.textContent), "...and says so when nothin' matches");
  r = await look("");
  ok(r.querySelector("h3"), "...emptied, the page is back");
  // a switch found by searching still works
  r = await look("screen touches");
  const box = [...r.querySelectorAll("label")].find((l) => /Screen touches/.test(l.textContent)).querySelector("input");
  box.click(); await wait(20);
  ok(D.st().screen === false, "a switch found by searchin' still switches");
  await look("");

  // the safeword, from any page
  D.give("needy", { by: ME, x: 1 }); await go("Breedin'");
  [...page().querySelectorAll(".fd-bar button")].find((b) => /Safeword/.test(b.textContent)).click(); await wait(20);
  ok(!D.active("needy") && /every dose lifted/.test(page().textContent), "the safeword at the top lifts every dose, from any page");
  // /dispensary guide still opens at a guide, on the Guides page
  cmd.Action("guide keyholders"); await wait(50);
  ok(/Hardcore and keyholders/.test((page().querySelector(".fd-guide h4") || {}).textContent || "") && /Guides/.test(nav().find((b) => b.classList.contains("fd-on")).textContent), "/dispensary guide keyholders opens the Guides page at it");

  // /dispensary page <which>: straight there
  cmd.Action("page hardcore"); await wait(50);
  ok(/Hardcore and keys/.test(nav().find((b) => b.classList.contains("fd-on")).textContent), "/dispensary page hardcore opens straight on Hardcore and keys");
  cmd.Action("page seed"); await wait(50);
  ok(/Breedin'/.test(nav().find((b) => b.classList.contains("fd-on")).textContent), "...page seed on Breedin'");
  const loc0 = local.length; cmd.Action("page wibble"); await wait(50);
  ok(/No page called that/.test(local.slice(loc0).join(" ")) && /Hardcore and keys/.test(local.slice(loc0).join(" ")), "...and a page it doesn't know: it names the ones it does");

  // hardcore: everything still locked, on every page
  ({ w, D, cmds } = await boot());
  D.st().keys = [OWNER]; D.lock(7);
  cmds.find((x) => x.Tag === "dispensary").Action("page"); await wait(50);
  const free = [];
  for (const p of ["Who and when", "Doses", "Gear and kits", "Nipples and holes", "Breedin'"]) {
    await go(p);
    const el = [...page().querySelectorAll(".fd-body input, .fd-body select")].filter((e) => !e.disabled);
    if (el.length) free.push(p + ": " + el.map((e) => e.getAttribute("aria-label") || (e.closest("label") || {}).textContent).join(", "));
  }
  ok(!free.length, "hardcore: every setting on every page is held for the keyholders (" + free.join("; ") + ")");
  ok(/Ask to be let out/.test(page().querySelector(".fd-bar").textContent), "...and the button at the top asks to be let out");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all passed"); process.exit(fails ? 1 : 0);
})();
