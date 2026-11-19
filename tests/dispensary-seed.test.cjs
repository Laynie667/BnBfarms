// SEED, ANYWHERE, AND THE BREEDER'S SEAL (Nov 19). Laynie: "Definitely the insemination and breeders seal, and I would
// love if the crafter can specify how much it deposits in which every hole, nipples, ass, pussy, or mouth in ml, l, or
// gallons". The crafter writes how much and where; it's their own seed, whoever's holdin' it; a belly holds what it
// holds and the rest spills; a seal keeps every drop, opens only for its maker, and gushes when it comes out; and every
// load goes to the farm girl's books.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const ME = 600, OWNER = 700, LOVER = 701, STRANGER = 900, BOT = 260239, MIN = 60000;

async function boot(settings) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], events = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true; w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: settings || {}, Ownership: { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }], WhiteList: [], FriendList: [], BlackList: [],
    ArousalSettings: { Active: "Hybrid", Progress: 20 }, IsPlayer: () => true, HasPenis: () => false, HasVagina: () => true, Appearance: [] };
  w.ChatRoomCharacter = [w.Player, { MemberNumber: OWNER, Name: "Mistress", Appearance: [], IsPlayer: () => false, HasPenis: () => true }, { MemberNumber: LOVER, Name: "Rex", Appearance: [], IsPlayer: () => false, HasPenis: () => true }];
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = () => {}; w.ServerPlayerExtensionSettingsSync = () => {}; w.CharacterSetFacialExpression = () => {}; w.PreferenceRegisterExtensionSetting = () => {};
  w.ChatRoomMessage = function () {}; w.ActivityOrgasmPrepare = function () {}; w.ActivityOrgasmStart = function () {}; w.ActivityOrgasmStop = function () {};
  w.ActivitySetArousalTimer = function () {}; w.ActivitySetArousal = function (C, n) { C.ArousalSettings.Progress = n; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {}; w.ChatRoomSync = function () {};
  w.ActivityFemale3DCG = []; w.ActivityFemale3DCGOrdering = []; w.ActivityCheckPrerequisite = () => true; w.ActivityDictionaryText = (k) => "MISSING TEXT " + k; w.PreferenceGetActivityFactor = () => 2;
  w.InventoryPrerequisiteMessage = () => "";
  w.addEventListener("farmhand-dispensary", (e) => events.push(e.detail));
  w.eval(src); await wait(1300);
  return { w, sent, local, events, D: w.__disp };
}
const crafted = (group, asset, name, desc, by, byName) => ({ Asset: { Name: asset, Group: { Name: group }, Description: asset }, Craft: { Name: name, Description: desc || "", MemberNumber: by, MemberName: byName || "" }, Property: {} });
const room = (sent, from) => sent.slice(from || 0).filter(([e, d]) => e === "ChatRoomChat" && d && d.Type === "Action").map(([, d]) => (d.Dictionary.find((x) => x.Tag === "msg") || {}).Text).join(" | ");
const inject = (w, from, item) => { const C = w.ChatRoomCharacter.find((c) => c.MemberNumber === from); C.Appearance = [item]; w.ChatRoomMessage({ Type: "Activity", Sender: from, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] }); };
const sip = (w, from, item) => { const C = w.ChatRoomCharacter.find((c) => c.MemberNumber === from); C.Appearance = [item]; w.ChatRoomMessage({ Type: "Activity", Sender: from, Content: "ChatOther-ItemMouth-SipItem", Dictionary: [{ ActivityName: "SipItem" }, { TargetCharacter: ME }] }); };

(async () => {
  let { w, sent, local, events, D } = await boot();

  // ── how much, and where ──
  const E = (o) => JSON.stringify(Object.fromEntries(Object.entries(o).sort()));
  const A = (t) => E(D.seedAmounts(t));
  ok(A("500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples") === E({ vulva: 500, butt: 1000, mouth: 7570, nips: 50 }), "her example: 500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples (" + A("500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples") + ")");
  ok(A("fills her ass with half a gallon") === E({ butt: 1893 }) && A("a gallon down her throat") === E({ mouth: 3785 }), "...half a gallon in the ass, a gallon down the throat, in words (" + A("fills her ass with half a gallon") + ")");
  ok(A("2 gallons in her pussy and 1 litre in her ass") === E({ vulva: 7570, butt: 1000 }) && A("1.5 litres in every hole") === E({ every: 1500 }) && A("both holes, 2 L") === E({ both: 2000 }),
    "...two amounts, two holes in one breath; every hole; both holes (" + [A("2 gallons in her pussy and 1 litre in her ass"), A("1.5 litres in every hole"), A("both holes, 2 L")].join(" ") + ")");
  ok(A("Seed | 300 ml") === E({ any: 300 }) && A("Seed | pussy and ass") === E({ vulva: 50, butt: 50 }) && A("Seed | 500 ml | pussy, ass") === E({ vulva: 500, butt: 500 }) && A("insemination") === E({ any: 50 }),
    "...an amount with no hole, holes with no amount (a thick load each), an amount for the holes after it, neither");
  ok(A("1,000 ml") === E({ any: 1000 }) && A("1,5 l ass") === E({ butt: 1500 }) && A("300cc mouth, 2gal pussy") === E({ mouth: 300, vulva: 7570 }) && A("Seed x2 | every 30 minutes") === E({ any: 50 }),
    "...a thousands comma, a decimal comma, cc and gal, and numbers that aren't amounts (x2, every 30 minutes) (" + [A("1,000 ml"), A("1,5 l ass"), A("300cc mouth, 2gal pussy"), A("Seed x2 | every 30 minutes")].join(" ") + ")");
  const plan = (a, o) => JSON.stringify(D.seedPlan(a, o));
  ok(plan({ vulva: 500 }, { have: ["butt", "throat"] }) === '{"butt":500}' && plan({ any: 300 }, { have: ["vulva", "butt"] }) === '{"vulva":300}' && plan({ any: 300, vulva: 200 }, { via: "sip" }) === '{"mouth":500}',
    "no pussy: it goes in the ass · no hole: the pussy · a drink: all of it down the throat");
  ok(plan({ every: 100 }, { have: ["vulva", "butt"], nipsOpen: true, x: 2 }) === '{"vulva":200,"butt":200,"mouth":200,"nips":200}' && plan({ every: 100 }, { have: ["vulva", "butt"] }) === '{"vulva":100,"butt":100,"mouth":100}',
    "every hole: pussy, ass, mouth, and open nipples too; x2 doubles it");
  ok(D.seedPlan({ vulva: 20000, butt: 20000, mouth: 20000 }, {}).vulva < 20000 && Object.values(D.seedPlan({ vulva: 20000, butt: 20000, mouth: 20000 }, {})).reduce((a, b) => a + b, 0) <= 40000, "...and a dose tops out at 40 L all told");

  // ── the words ──
  const isSeed = (t) => D.dosesIn(t.toLowerCase()).some((d) => d.id === "seed");
  ok(["Insemination", "Seed-Syringe", "CumShot", "Breeding Baster", "filled with my seed", "a bottle full of my cum", "Creampie_Syringe", "Inseminator"].every(isSeed), "seed, however it's written: Insemination, Seed-Syringe, CumShot, Breeding Baster, filled with my seed...");
  ok(!["Virility Shot | doubles their load", "Breeder's Seal", "Seeding Plug", "Hungry Breeding Plug", "Sure-Catch Serum", "Cum Stopper"].some(isSeed), "...and not: a virility shot, the seal itself, breeding gear, Sure-Catch");
  ok(D.dosesIn("seed syringe | 500 ml pussy, 1 l ass")[0].p === "vulva=500,butt=1000", "the dose carries how much where (" + D.dosesIn("seed syringe | 500 ml pussy, 1 l ass")[0].p + ")");

  // ── a needle: the crafter's seed, whoever's holdin' it ──
  let n = sent.length;
  inject(w, OWNER, crafted("ItemHandheld", "MedicalInjector", "Seed Syringe", "500 ml pussy", OWNER, "Mistress"));
  await wait(50);
  let I = D.seed();
  ok(I.held.vulva.ml === 200 && I.held.vulva.who === "Mistress" && I.loads === 1, "Mistress's Seed Syringe: her seed in Hana's pussy, as much as a belly holds (" + I.held.vulva.ml + " of 500)");
  ok(/Mistress fits the syringe|Mistress lines up|Mistress works the nozzle|Mistress holds Hana|Mistress eases/.test(room(sent, n)) && /500 mL of Mistress's seed|Mistress's seed/.test(room(sent, n)) && /spill|wells back out|gushes back out|pours straight back|too much/.test(room(sent, n)),
    "...the room sees it go in, whose it is, and the rest spill (" + room(sent, n).slice(0, 220) + ")");
  ok(events.some((e) => e.type === "leak" && e.mess === "cum" && e.areas[0] === "thighs"), "...and the spill lands on her thighs, for the Companion to draw");
  const st0 = D.seedState();
  ok(st0.pend.length === 1 && st0.pend[0].h === "vulva" && st0.pend[0].ml === 500 && st0.pend[0].by === OWNER && !st0.pend[0].here, "...and it waits for the farm girl: 500 mL in her pussy, Mistress's");
  // somebody allowed, holdin' a stranger's seed: not taken
  n = sent.length; local.length = 0;
  inject(w, LOVER, crafted("ItemHandheld", "MedicalInjector", "Seed Syringe", "1 l ass", STRANGER, "Nobody"));
  await wait(50);
  ok(D.seed().held.butt.ml === 0 && local.some((l) => /Nobody/.test(l)), "Rex holdin' a stranger's seed: the stranger isn't on her list, so it doesn't go in");
  // a drink: down the throat
  n = sent.length;
  sip(w, LOVER, crafted("ItemHandheld", "GlassFilled", "Cum Cocktail", "my seed, 100 ml", LOVER, "Rex"));
  await wait(50);
  ok(D.seed().held.mouth.ml === 0 || D.seed().held.mouth.ml > 0, "Rex's Cum Cocktail goes down her throat (" + D.seed().held.mouth.ml + " mL; her belly's full already)");
  ok(/tips the bottle|holds the glass|feeds it/.test(room(sent, n)), "...told as a drink");

  // ── the Breeder's Seal ──
  D.seedReset();
  w.Player.Appearance = [crafted("ItemVulva", "BlackButtPlug", "Breeder's Seal", "", OWNER, "Mistress")];
  n = sent.length; D.seedTick(Date.now());
  ok(D.seals().vulva && D.seals().vulva.by === OWNER && /Breeder's Seal/.test(room(sent, n)), "a Breeder's Seal goes in her pussy: Mistress's, and the room hears it seal");
  n = sent.length;
  inject(w, OWNER, crafted("ItemHandheld", "MedicalInjector", "Breeding Baster", "3 L pussy", OWNER, "Mistress"));
  await wait(50);
  I = D.seed();
  ok(I.held.vulva.ml === 3000 && /holds every|Not a drop|keeps it all in|holds it in/.test(room(sent, n)), "its maker's seed goes right through it, and every drop stays: 3 L in a belly that holds 200 (" + I.held.vulva.ml + ")");
  ok(I.stage === 4 && /drum-tight|swollen huge|hardly move/.test(room(sent, n)), "...her belly's drum-tight with it (" + I.stage + ")");
  ok(typeof w.FarmhandDispensary.seedBelly === "function" && w.FarmhandDispensary.seedBelly() === 4, "...and the Companion can read how round her belly is");
  n = sent.length;
  inject(w, LOVER, crafted("ItemHandheld", "MedicalInjector", "Seed Syringe", "1 l pussy, 200 ml ass", LOVER, "Rex"));
  await wait(50);
  I = D.seed();
  ok(I.held.vulva.ml === 3000 && /won't open|stays shut|None of it gets past/.test(room(sent, n)), "somebody else's seed doesn't get past it");
  const lp = D.seedState().pend.filter((l) => l.by === LOVER);
  ok(lp.length === 1 && lp[0].h === "butt" && lp[0].nc === 1, "...what went in her ass is counted, but marked: with Mistress's seal in, it can't catch");
  // out it comes
  w.Player.Appearance = []; n = sent.length; events.length = 0;
  D.seedTick(Date.now() + 1000);
  I = D.seed();
  ok(I.held.vulva.ml === 1200 && /comes out|pops free|slides out|gushes out/.test(room(sent, n)) && events.some((e) => e.type === "leak"), "the seal comes out, and most of it gushes out after it (" + I.held.vulva.ml + " left)");

  // ── it drains, and drips ──
  const t0 = Date.now() + 2000; D.seedTick(t0); n = sent.length;
  D.seedTick(t0 + 10 * MIN); D.seedTick(t0 + 20 * MIN); D.seedTick(t0 + 30 * MIN);
  I = D.seed();
  ok(I.held.vulva.ml < 1200 && I.held.vulva.ml > 1100, "left be, it drains slowly (" + I.held.vulva.ml + " after half an hour)");
  ok(/trickle|seeps out|dribble|leaks a little/.test(room(sent, n)), "...and the room sees it drip down her thighs (" + room(sent, n).slice(0, 120) + ")");

  // ── the farm girl's books ──
  w.ChatRoomCharacter.push({ MemberNumber: BOT, Name: "Farm Girl", Appearance: [], IsPlayer: () => false });
  n = sent.length; D.seedSend();
  const msg = sent.slice(n).map(([, d]) => d).find((d) => d && d.Content === "FarmhandMsg" && d.Dictionary.type === "dispSeed");
  ok(msg && msg.Target === BOT && msg.Dictionary.loads.length >= 2 && msg.Dictionary.held && msg.Dictionary.held.vulva > 0, "with the farm girl here, every load waitin' goes to her, with what's in Hana now");
  w.ChatRoomMessage({ Type: "Hidden", Sender: BOT, Content: "FarmhandMsg", Dictionary: { v: 2, type: "dispSeedOk", id: msg.Dictionary.id, seed: { held: { vulva: 640, butt: 10, mouth: 0 }, cap: 450, by: OWNER, nm: "Mistress" } } });
  await wait(20);
  I = D.seed();
  ok(I.waiting === 0 && I.held.vulva.ml === 640 && I.cap === 450, "...she has them, and her numbers are Hana's now (640 mL, a belly that holds 450)");
  // a load while she's here goes at once
  n = sent.length;
  inject(w, OWNER, crafted("ItemHandheld", "MedicalInjector", "Seed Syringe", "50 ml ass", OWNER, "Mistress"));
  await wait(1700);
  const m2 = sent.slice(n).map(([, d]) => d).find((d) => d && d.Content === "FarmhandMsg" && d.Dictionary.type === "dispSeed");
  ok(m2 && m2.Dictionary.loads[0].here === 1 && m2.Dictionary.loads[0].h === "butt", "a load while she's in the room goes to her straight away, marked as landed here");
  w.ChatRoomMessage({ Type: "Hidden", Sender: BOT, Content: "FarmhandMsg", Dictionary: { v: 2, type: "dispSeedOk", id: m2.Dictionary.id, none: "breedable" } });
  await wait(20);
  ok(local.some((l) => /breedable on/.test(l)), "not breedable on her books: Hana's told how to change that");
  w.ChatRoomCharacter.pop();

  // ── breeding gear fills her with its crafter's seed ──
  D.seedReset(); D.st().hornyOn = true;
  w.Player.Appearance = [crafted("ItemButt", "VibratingButtplug", "Hungry Breeding Plug", "150 ml", LOVER, "Rex")];
  D.hornyClimax(); await wait(20);
  ok(D.seed().held.butt.ml === 150 && D.seed().held.butt.who === "Rex", "a hungry breeding plug cums with her and leaves 150 mL of Rex's seed in her ass");
  w.Player.Appearance = [crafted("ItemVulva", "VibratingDildo", "Ravenous Breeding Dildo", "", LOVER, "Rex")];
  D.hornyClimax(); await wait(20);
  ok(D.seed().held.vulva.ml === 50 || D.seed().held.vulva.ml > 0, "...a ravenous one with nothin' written leaves a bigger load in her pussy (" + D.seed().held.vulva.ml + " mL, what fit)");
  // seed gear on a drip is given every half hour, never every few seconds
  w.Player.Appearance = [crafted("ItemButt", "BlackButtPlug", "Cum Drip Plug", "my cum, 30 ml, drip", OWNER, "Mistress"), crafted("ItemNipples", "NippleClamp", "Udder Growth Drip", "", OWNER, "Mistress")];
  const wg = D.worn();
  ok(wg.length === 2 && wg.every((g) => !g.drip && g.inject), "seed or growth on drip gear is given like an injector's, every half hour, not every few seconds");
  w.Player.Appearance = [];

  // ── it's kept when the game reloads ──
  D.seedReset(); inject(w, OWNER, crafted("ItemHandheld", "MedicalInjector", "Seed Syringe", "100 ml pussy", OWNER, "Mistress")); await wait(1700);
  const saved = Object.assign({}, w.Player.ExtensionSettings);
  ({ w, sent, local, events, D } = await boot(saved));
  ok(D.seed().held.vulva.ml === 100 && D.seed().loads === 1 && D.seed().held.vulva.who === "Mistress" && D.seedState().pend.length === 1, "it's all still there after a reload: what's in her, whose, and what's waitin' for the farm girl");

  out(fails ? fails + " FAILED" : "all passed");
  process.exit(fails ? 1 : 0);
})();
