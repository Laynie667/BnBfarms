// EVERY PHRASE, EVERY SPELLIN' (Nov 19). Laynie: "need to double check that everything gets routed correctly, and that
// its accurately checking the phrases, even if we need to hyphenate". Every keyword the page and the guides give,
// written with spaces, hyphens, underscores, run together, in capitals or in a sentence, is read as the dose it is,
// and as nothin' else. The same for the gear words, the parts and animals, the parasites and the hole sizes.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ME = 600;

(async () => {
  const url = (p) => require("url").pathToFileURL(path.join(__dirname, p)).href;
  const { DOSE_WORDS, FARM_DOSES, loosen, phrase } = await import(url("../shared/dose-words.js"));
  const H = await import(url("../shared/holes.js"));
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window; w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: {}, Lovership: [], WhiteList: [], FriendList: [], BlackList: [], ArousalSettings: { Progress: 0 }, IsPlayer: () => true, HasPenis: () => false, Appearance: [] };
  w.ChatRoomCharacter = [w.Player]; w.ServerSend = () => {}; w.ChatRoomSendLocal = () => {}; w.CommandCombine = () => {}; w.ServerPlayerExtensionSettingsSync = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ChatRoomSync = function () {}; w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true;
  w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8")); await wait(1300);
  const D = w.__disp, P = D.phrases;

  // ── the doses ──
  const book = D.book(), KW = {};
  for (const [id, B] of Object.entries(book)) KW[id] = B.keywords;
  ok(Object.keys(DOSE_WORDS).length === Object.keys(book).length && Object.keys(book).every((id) => DOSE_WORDS[id]), "every dose's words are in the shared book (shared/dose-words.js), read by the Dispensary and the farm girl alike");
  ok(JSON.stringify(Object.keys(book).filter((id) => book[id].farm).sort()) === JSON.stringify(FARM_DOSES.slice().sort()), "...and the farm's doses are the same list on both sides (" + FARM_DOSES.join(", ") + ")");
  const title = (s) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
  const SPELL = { "as written": (k) => k, Title: (k) => title(k), CAPS: (k) => k.toUpperCase(), hyphens: (k) => k.replace(/ /g, "-"), spaces: (k) => k.replace(/-/g, " "),
    underscores: (k) => k.replace(/[- ]/g, "_"), "run together": (k) => title(k).replace(/[- ]/g, ""), "in a sentence": (k) => "a fat shot of " + title(k) + ", x2!", "double spaced": (k) => k.replace(/[- ]/g, "  ") };
  // ("fill out" on its own is plain English: "watch her fill out". It takes "fill-out", "fillout", or "fill out serum".)
  const SKIP = { "fillout|fill-out|spaces": true, "fillout|fill-out|double spaced": true, "fillout|fill-out|underscores": true };   // (an underscore reads as a space)
  const missed = [], extra = [];
  for (const [id, kws] of Object.entries(KW)) for (const k of kws) for (const [how, f] of Object.entries(SPELL)) {
    if (SKIP[id + "|" + k + "|" + how]) continue;
    const t = f(k), got = D.dosesIn(t.toLowerCase()).map((d) => d.id);
    if (!got.includes(id)) missed.push(id + " " + how + ": " + JSON.stringify(t));
    else if (got.length > 1) extra.push(JSON.stringify(t) + " is " + got.join(" and "));
  }
  const kwCount = Object.values(KW).reduce((n, l) => n + l.length, 0);
  ok(!missed.length, "every keyword on the page (" + kwCount + "), " + Object.keys(SPELL).length + " ways each: " + Object.keys(SPELL).join(", ") + (missed.length ? ". MISSED: " + missed.join("; ") : ""));
  ok(!extra.length, "...and each is its own dose, never two (" + (extra.join("; ") || "none doubled") + ")");
  ok(!D.dosesIn("watch her fill out her new dress").length && !D.dosesIn("a heat wave | so hot outside").length && !D.dosesIn("a tender moment").length && !D.dosesIn("she's in a rut").length,
    "...while plain English stays plain: fill out, a heat wave, a tender moment, in a rut");

  // the parts and animals a dose can name
  const part = (t, id) => (D.dosesIn(t.toLowerCase()).find((d) => d.id === id) || {}).p;
  ok(part("Fill-Out | for her tummy", "fillout") === "belly" && part("FillOut serum, Big-Booty", "fillout") === "ass" && part("fill_out shot", "fillout") === "cup", "Fill-Out: belly, ass or tits, however it's written");
  ok(part("Tender-Drops | inner-thighs", "tender") === "thighs" && part("TenderDrops for the CLIT", "tender") === "clit" && part("tender_drops, ear lobes", "tender") === "ears", "Tender: its spot, however it's written");
  ok(part("China-Doll Statue Serum", "statue") === "porcelain" && part("Gilding-Serum", "statue") === "gold" && part("statue_serum, black rubber", "statue") === "latex" && part("StatueSerum", "statue") === "stone", "Statue Serum: the material, however it's written");
  ok(["Puppy-Tongue", "PuppyTongue", "puppy tongue", "PUPPY_TONGUE"].every((t) => part(t, "tongue") === "pup") && part("Kitty-Tongue Tonic", "tongue") === "kitty" && (part("Animal-Tongue", "tongue") || "") === "", "Animal Tongue: the animal, however it's written");
  ok(part("Throat-Tightener", "balm") === "throat" && part("Pussy_Tightener", "balm") === "vulva" && part("Tightening-Balm | for every-hole", "balm") === "holes" && part("Virgin-Tonic", "balm") === "holes" && part("Nipple-Tightener, pussy too", "balm") === "nvulva", "Tightening Balm: which holes, however it's written");
  ok(D.dosesIn("cock-reducer".toLowerCase())[0] && D.dosesIn("cock-reducer")[0].id === "reducing" && part("Reducing-Serum | balls", "reducing") === "balls" && D.dosesIn("denial serum x3")[0].x === 3 && D.dosesIn("denial-serum 3x")[0].x === 3, "Reducing Serum's part, and x2 to x5, however they're written");

  // ── the gear words ──
  const wear = (group, asset, name, desc) => { w.Player.Appearance = [{ Asset: { Name: asset, Group: { Name: group } }, Craft: { Name: name, Description: desc || "", MemberNumber: ME }, Property: {} }]; return D.worn()[0] || {}; };
  ok(["IV-Drip", "iv_drip", "Drip-Fed", "dripfeed"].every((t) => wear("ItemMouth", "BallGag", "Gag", "denial serum " + t).drip), "drip gear: IV-Drip, iv_drip, Drip-Fed");
  ok(["Auto-Injector", "autoinjector", "AUTO_INJECTOR", "auto injecting"].every((t) => wear("ItemNeck", "LeatherCollar", "Collar", "sedative " + t).inject), "injectors: Auto-Injector, autoinjector, AUTO_INJECTOR");
  ok(wear("ItemNeck", "LeatherCollar", "Collar", "sedative auto-injector, every-15-minutes").every === 15 && wear("ItemNeck", "LeatherCollar", "Collar", "sedative injector every 15min").every === 15, "...every-15-minutes, every 15min");
  ok(["when-kissed", "WhenKissed", "when_kissed", "When Kissed"].every((t) => (wear("ItemNeck", "LeatherCollar", "Collar", "sedative " + t).trig || []).includes("kissed")) &&
    ["on-climax", "OnClimax", "whenever-she-cums", "when they orgasm"].every((t) => (wear("ItemVulva", "VibratingEgg", "Egg", "needy nectar " + t).trig || []).includes("climax")), "triggers: when-kissed, WhenKissed, on-climax, whenever-she-cums");
  ok(["Mystery-Dose", "mysterydose", "mystery_shot", "surprise-dose"].every((t) => wear("ItemButt", "BlackButtPlug", "Plug", t + " injector").roulette), "roulette: Mystery-Dose, mysterydose, surprise-dose");
  ok(["lip-gloss", "LipGloss", "lip_gloss", "lip-stick", "Lipstick"].every((t) => P.gloss(t)), "lip gloss: lip-gloss, LipGloss, lip-stick");
  ok(["Time-Release", "time_release", "timerelease", "Slow-Release", "delayed", "Capsule"].every((t) => P.later(t.toLowerCase())), "time-release: Time-Release, time_release, timerelease, Slow-Release");
  ok(["Dilator Clamps", "Dilating-Clamps", "nipple_stretcher clamps", "SpreaderRings"].every((t) => wear("ItemNipples", "NippleClamp", t).drip), "nipple gear: Dilator Clamps, Dilating-Clamps, SpreaderRings");
  w.Player.Appearance = [];
  ok(["Horny", "HUNGRY", "insatiable", "Ravenous"].every((t) => P.horny(t.toLowerCase()) > 0) && P.horny("ravenous") === 2, "horny gear: horny, hungry, insatiable, ravenous");

  // ── the parasites ──
  const kinds = (t) => P.para(t.toLowerCase());
  const PARA = { lips: ["Parasite Lips", "parasite-lips", "a parasite"], latex: ["Living Latex", "living-latex", "LivinLatex", "livin' latex", "living_rubber", "Latex-Symbiote"], moss: ["Milk Moss", "milk-moss", "MilkMoss"],
    nestling: ["Nestling", "the NESTLING"], brood: ["Brood Mother", "brood-mother", "BroodMother", "brood_queen"], vine: ["Leash Vine", "leash-vine", "LeashVine", "vine-leash"],
    mouth: ["Mouthpiece", "mouth-piece", "mouth piece"], nips: ["Nipple Leeches", "nipple-leech", "NippleLeeches", "teat-tick"] };
  const pm = [];
  for (const [k, list] of Object.entries(PARA)) for (const t of list) if (!kinds(t).includes(k)) pm.push(k + ": " + JSON.stringify(t) + " read as " + JSON.stringify(kinds(t)));
  ok(!pm.length, "every parasite, every spellin' (" + (pm.join("; ") || Object.values(PARA).flat().length + " spellings") + ")");

  // ── the hole sizes and goals ──
  const gs = (h, t) => H.goalSize(h, t);
  ok(gs("vulva", "well-used") === 6 && gs("vulva", "well used") === 6 && gs("vulva", "wellused") === 6 && gs("butt", "Wide-Open".toLowerCase()) === 8 && gs("butt", "wide open") === 8 && gs("butt", "slightly-gaped") === 3,
    "hole sizes: well-used, well used, wellused, wide-open, slightly-gaped");
  ok(gs("throat", "past gaggin'") === 9 && gs("throat", "past-gagging") === 9 && gs("throat", "no-gag-reflex") === 9 && gs("throat", "nogagreflex") === 9 && gs("throat", "learnin") === 3, "throat sizes: past gaggin', past-gagging, no-gag-reflex, learnin");
  const g = H.goalIn("trainer plug | goal: wide-open in 3 days", "butt");
  ok(g && g.to === 8 && g.inMs === 3 * 86400000, "a goal with a hyphen in it: goal: wide-open in 3 days");
  ok(phrase("past gaggin'") && new RegExp(phrase("well-used")).test("well_used") && loosen(/milk moss/).test("milk-moss"), "the shared helpers themselves");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all passed"); process.exit(fails ? 1 : 0);
})();
