// Nov 17: The Farmhand's Dispensary, step 1 (the bones). Laynie: "a add-on that doesnt rely on the farm, or farmhand
// companion, but would work in tandem with it", then the ladder, the clock, LSCG's way, the farm girl's call.
// A pretend game page runs dist/farmhand-dispensary.user.js as player 600 (Hana).
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
const companionSrc = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");
const BOT = 260239, ME = 600, OWNER = 700, LOVER = 701, WHITE = 702, FRIEND = 703, BLACK = 704, STRANGER = 705;

function page(opts) {
  opts = opts || {};
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], local = [], cmds = [], synced = [], faces = [], pages = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
  w.console.warn = () => {}; w.console.log = () => {};
  w.__FARMHAND_TEST__ = true;
  w.CurrentScreen = "ChatRoom";
  w.LZString = { compressToBase64: (t) => Buffer.from(t).toString("base64"), decompressFromBase64: (t) => Buffer.from(t, "base64").toString() };
  const my = opts.me || ME;
  w.Player = { MemberNumber: my, Name: my === ME ? "Hana" : "Keeper" + my, ExtensionSettings: opts.ext || {}, Ownership: opts.noOwner ? null : { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }],
    WhiteList: [WHITE], FriendList: [FRIEND], BlackList: [BLACK], ArousalSettings: { Progress: 50 }, IsPlayer: () => true, Appearance: [] };
  const C = (mn, name) => ({ MemberNumber: mn, Name: name, Appearance: [], IsPlayer: () => false });
  w.ChatRoomCharacter = [w.Player, ...(my !== ME ? [C(ME, "Hana")] : []), ...(my !== OWNER ? [C(OWNER, "Mistress")] : []), C(LOVER, "Lov"), C(WHITE, "Whit"), C(FRIEND, "Fren"), C(BLACK, "Blackie"), C(STRANGER, "Stranger"), C(221397, "Laynie")];
  if (opts.bot) w.ChatRoomCharacter.push(C(BOT, "Farm Girl"));
  w.ServerSend = (ev, d) => sent.push([ev, JSON.parse(JSON.stringify(d))]);
  w.ChatRoomSendLocal = (h) => local.push(String(h).replace(/<[^>]+>/g, ""));
  w.CommandCombine = (list) => cmds.push(...list);
  w.ServerPlayerExtensionSettingsSync = (k) => synced.push(k);
  w.CharacterSetFacialExpression = (C2, g, e) => faces.push([g, e]);
  w.PreferenceRegisterExtensionSetting = (p) => pages.push(p);
  // what the Dispensary hooks
  const game = { orgasm: 0, msgs: 0 };
  w.ChatRoomMessage = function () { game.msgs++; };
  w.ActivityOrgasmPrepare = function () { game.orgasm++; };
  w.ChatRoomMapViewCanEnterTile = function () { return 100; };
  w.ChatRoomSafewordRevert = function () {}; w.ChatRoomSafewordRelease = function () {};
  w.ChatRoomSync = function () {};
  const beeps = [];
  w.ServerAccountBeep = function (d) { beeps.push(d && d.Message); };
  w.confirm = () => true;
  w.ChatRoomMessageRunExtractors = (data) => { const d = data.Dictionary || []; const a = d.find((x) => x.ActivityName); const t = d.find((x) => typeof x.TargetCharacter === "number"); return { metadata: { ActivityName: a && a.ActivityName, TargetMemberNumber: t && t.TargetCharacter } }; };
  if (opts.lscg) w.LSCG_OnLoad = { push: (cb) => cb(opts.lscg) }, w.LSCG = { version: "0.9.8" };
  if (opts.companion) { w.ChatRoomData = { Name: "B&B Farm" }; w.eval(companionSrc); }   // the Companion first, as Tampermonkey might load it
  if (!opts.noDisp) w.eval(src);
  const charOf = (mn) => w.ChatRoomCharacter.find((c) => c.MemberNumber === mn);
  // somebody uses the Inject activity on me, holding a crafted item
  const needle = (by, name, desc) => {
    const c = charOf(by); c.Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: desc || "" } }];
    w.ChatRoomMessage({ Type: "Activity", Sender: by, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] });
  };
  const to = (mn, type) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Target === mn && d.Dictionary.type === type).map(([, d]) => d.Dictionary);
  const fromBot = (type, data, sender) => w.ChatRoomMessage({ Type: "Hidden", Sender: sender || BOT, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data) });
  const toBot = (type) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Target === BOT && d.Dictionary.type === type).map(([, d]) => d.Dictionary);
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => d.Dictionary.find((x) => x.Tag === "msg").Text);
  return { w, sent, local, cmds, synced, faces, pages, game, beeps, needle, fromBot, toBot, to, actions, D: () => w.__disp };
}

(async () => {
  const p = page(); await wait(1300);
  const D = p.D();
  ok(D && D.started(), "it starts once you're logged in");

  // ---- who can dose you (the default: your owner, lovers and the farm)
  ok(D.st().who === "farm", "out of the box: your owner, your lovers and the farm");
  ok(D.allowed(ME) && D.allowed(OWNER) && D.allowed(LOVER) && D.allowed(BOT) && D.allowed(221397), "...you, your owner, a lover, the farm girl and a proprietor");
  ok(!D.allowed(WHITE) && !D.allowed(FRIEND) && !D.allowed(STRANGER) && !D.allowed(BLACK), "...not your whitelist, friends, strangers or your blacklist");
  D.st().who = "friends"; ok(D.allowed(WHITE) && D.allowed(FRIEND) && !D.allowed(STRANGER), "+ friends: whitelist and friends too, still not a stranger");
  D.st().who = "all"; ok(D.allowed(STRANGER) && !D.allowed(BLACK), "everyone but your blacklist");
  D.st().who = "any"; ok(D.allowed(BLACK), "everyone, blacklist too");
  D.st().who = "me"; ok(D.allowed(ME) && !D.allowed(OWNER), "only me: not even your owner");
  D.st().who = "farm";

  // ---- a needle
  p.needle(OWNER, "Denial Serum x2", "for my pet");
  ok(D.active("denial"), "your owner's Denial Serum takes");
  ok(Math.abs(D.leftMs("denial") - 240 * 60000) < 5000, "...x2 is two doses: four hours");
  ok(p.actions().some((t) => /Hana/.test(t)), "...and the room hears it from your own game, with your name in it");
  const n0 = p.local.length;
  p.needle(STRANGER, "Sedative");
  ok(!D.active("sedative"), "a stranger's needle doesn't take");
  ok(p.local.slice(n0).some((t) => /Stranger tried to give you Sedative/.test(t) && /not on your list/.test(t)), "...and you're told who tried, and why nothin' happened");
  p.needle(LOVER, "Tranquilizer");
  ok(D.active("sedative") && Math.abs(D.leftMs("sedative") - 60 * 60000) < 5000, "a lover's tranquilizer: the Sedative, an hour");
  ok(p.faces.some(([g, e]) => g === "Eyes" && e === "Dazed"), "...heavy, dazed eyes");
  ok(p.w.ChatRoomMapViewCanEnterTile(3, 3) === 160, "...and every step on the map takes longer");
  p.needle(OWNER, "Plain old injector");
  ok(p.actions().length === 2, "an item with none of the words on it does nothin'");

  // ---- held at the edge
  const o0 = p.game.orgasm;
  p.w.ActivityOrgasmPrepare(p.w.Player);
  ok(p.game.orgasm === o0 && p.w.Player.ArousalSettings.Progress === 94, "Denial Serum: you climb, and it holds you at the edge instead");
  ok(p.local.some((t) => /edge|serum/i.test(t)), "...and tells you so");

  // ---- the clock
  const left0 = D.leftMs("denial");
  D.tick(); await wait(1100); D.tick();
  ok(left0 - D.leftMs("denial") >= 900 && left0 - D.leftMs("denial") < 3000, "while online: it counts down the time you're here");
  const before = D.leftMs("denial");
  D.setClock("real");
  ok(D.st().clock === "real" && Math.abs(D.leftMs("denial") - before * 1.5) < 2000, "switched to real time: what's left runs 50% longer");
  D.setClock("online");
  ok(D.st().clock === "online" && Math.abs(D.leftMs("denial") - before) < 2000, "...and back: the 50% comes off again");
  D.setClock("real"); const sed0 = D.leftMs("sedative"); D.give("sedative", { by: OWNER });
  ok(Math.abs(D.leftMs("sedative") - sed0 - 90 * 60000) < 6000, "a real-time dose: an hour's dose runs an hour and a half");
  D.setClock("online");

  // ---- your account (saved a moment after the last change)
  await wait(1700);
  ok(p.synced.includes("FarmhandDispensary") && typeof p.w.Player.ExtensionSettings.FarmhandDispensary === "string", "saved on your account, not just this browser");
  const p2 = page({ ext: { FarmhandDispensary: p.w.Player.ExtensionSettings.FarmhandDispensary } }); await wait(1300);
  ok(p2.D().active("denial") && p2.D().active("sedative"), "...so another computer picks up the doses runnin' in you");

  // ---- switched off
  D.st().off.denial = true;
  const n1 = p.local.length;
  D.give("denial", { by: 1 }); p.needle(OWNER, "Edge Serum");
  ok(p.local.slice(n1).some((t) => /switched it off/.test(t)), "a dose you've switched off doesn't take, and you're told");
  delete D.st().off.denial;

  // ---- the safeword
  p.cmds.find((c) => c.Tag === "dispensary").Action("safeword");
  ok(!D.active("denial") && !D.active("sedative"), "/dispensary safeword: every dose lifted at once");
  ok(p.local.some((t) => /Safeword: every dose in you is lifted/.test(t)), "...and you're told you're clear");
  ok(p.w.ChatRoomMapViewCanEnterTile(3, 3) === 100 && p.faces.some(([g, e]) => g === "Eyes" && e === null), "...your feet and your face are your own again");
  p.needle(OWNER, "Denial Serum");
  p.w.ChatRoomSafewordRevert();
  ok(!D.active("denial"), "the game's own safeword lifts them too");
  p.needle(OWNER, "Denial Serum");
  p.w.ChatRoomSafewordRelease();
  ok(!D.active("denial"), "...revert or release");

  // ---- the farm: her shots are hers, and she calls on you
  const f = page({ bot: true }); await wait(1300);
  const F = f.D();
  f.needle(OWNER, "Denial Serum");
  ok(!F.active("denial"), "on the farm, with the farm girl here, a farm shot is hers: the Dispensary doesn't give it twice");
  f.fromBot("ping", {});
  const hi = f.toBot("dispHello").pop();
  ok(hi && hi.farm === true && hi.lscg === false && Array.isArray(hi.off), "her ping: your Dispensary says hello, and that the farm's on your list");
  f.fromBot("dispWelcome", { farm: [BOT, 221397, 5555] });
  ok(F.allowed(5555), "...she tells it who the farm is (her staff count as the farm)");
  f.fromBot("dose", { id: 7, dose: "denial", x: 1, mins: 120, by: OWNER, line: "THE FARM'S OWN LINE", hand: true });
  ok(F.active("denial") && Math.abs(F.leftMs("denial") - 120 * 60000) < 5000, "her call: your game gives the dose");
  ok(f.actions().includes("THE FARM'S OWN LINE"), "...and says her line from your own game, so she doesn't have to");
  const done = f.toBot("doseDone").pop();
  ok(done && done.id === 7 && done.ok === true, "...and tells her it took");
  f.fromBot("dose", { id: 8, dose: "sedative", x: 1, mins: 60, by: OWNER, line: "zzz" }, 4444);
  ok(!F.active("sedative"), "a 'call' from anybody but the farm girl herself is ignored");
  f.fromBot("dose", { id: 9, dose: "sedative", x: 1, mins: 60, by: OWNER, quiet: true, line: "SHOULD NOT SHOW" });
  ok(F.active("sedative") && !f.actions().includes("SHOULD NOT SHOW"), "a quiet top-up (a drip): given, no line");
  F.st().who = "lovers";
  f.fromBot("dose", { id: 10, dose: "denial", x: 1, mins: 120, by: OWNER, line: "x" });
  const no = f.toBot("doseDone").pop();
  ok(no && no.id === 10 && no.ok === false && no.why === "ladder", "the farm off your list: her call doesn't take, and she's told why");
  f.fromBot("ping", {});
  ok(f.toBot("dispHello").pop().farm === false, "...and your hello tells her so beforehand");
  F.st().who = "farm";
  f.cmds.find((c) => c.Tag === "dispensary").Action("safeword");
  ok(f.toBot("dispSafeword").length === 1, "your safeword tells her, so she lifts the farm's side too");
  f.fromBot("dose", { id: 11, dose: "denial", x: 1, mins: 120, by: OWNER, line: "y" });
  f.fromBot("dispClear", {});
  ok(!F.active("denial"), "her safeword (?safeword): every dose in you lifted");

  // ---- with the Companion installed too (it keeps the farm girl's messages to itself)
  const both = page({ bot: true, companion: true }); await wait(1500);
  both.fromBot("dose", { id: 30, dose: "denial", x: 1, mins: 120, by: OWNER, line: "WITH THE COMPANION" });
  ok(both.D().active("denial") && both.actions().includes("WITH THE COMPANION"), "with the Companion installed as well, her call still reaches the Dispensary");
  both.fromBot("dispClear", {});
  ok(!both.D().active("denial"), "...and so does her safeword");

  // ---- LSCG, done LSCG's way
  const reg = {}, doses = [], befores = [], ons = {};
  const api = { drugs: { register: (d) => { reg[d.name] = d; return () => {}; }, dose: (type, o) => { doses.push([type, o]); return true; } },
    events: { on: (n, f2) => { ons[n] = f2; }, before: (n, f2) => befores.push([n, f2]) } };
  const L = { getModApi: () => api, capabilities: new Set(["core", "events", "drugs"]) };
  const g = page({ lscg: L, bot: true }); await wait(1300);
  const G = g.D();
  ok(reg.denial && !reg.sedative, "our Denial Serum goes in LSCG's list; the sedative is LSCG's own, never ours to add");
  g.w.ChatRoomCharacter = g.w.ChatRoomCharacter.filter((c) => c.MemberNumber !== BOT);   // off the farm
  g.needle(OWNER, "Sedative");
  ok(!G.active("sedative") && doses.length === 0, "LSCG loaded: a sedative needle is LSCG's business, not ours");
  g.w.ChatRoomCharacter.push({ MemberNumber: BOT, Name: "Farm Girl", Appearance: [] });
  g.fromBot("dose", { id: 20, dose: "sedative", x: 1, mins: 60, by: OWNER, line: "L1", hand: true });
  ok(doses.length === 0 && g.toBot("doseDone").pop().why === "lscg", "her call for a needle in the hand: LSCG caught that one itself, so not twice");
  g.fromBot("dose", { id: 21, dose: "sedative", x: 2, mins: 120, by: OWNER, line: "THE TRAP'S LINE" });
  ok(doses.length === 1 && doses[0][0] === "sedative" && g.actions().includes("THE TRAP'S LINE"), "...a trap or an injector: through LSCG's front door, with her line");
  g.w.ChatRoomCharacter = g.w.ChatRoomCharacter.filter((c) => c.MemberNumber !== BOT);
  // a Denial Serum needle LSCG catches itself (switched on there): it comes to us through LSCG, once
  g.needle(OWNER, "Denial Serum");
  const ctx = { level: 0, setLevel(v) { this.level = v; return v; }, multiplier: 1, sender: OWNER };
  reg.denial.onDose(ctx);
  await wait(1700);
  ok(G.active("denial") && Math.abs(G.leftMs("denial") - 120 * 60000) < 5000 && ctx.level === 120, "LSCG caught it: given once (not again by us), and LSCG's bar shows the minutes left");
  // switched off in LSCG: LSCG lets it pass, and we catch it ourselves a moment later
  const h = page({ lscg: { getModApi: () => ({ drugs: { register: (d) => () => {}, dose: () => false }, events: { on() {}, before() {} } }), capabilities: new Set(["drugs", "events"]) } }); await wait(1300);
  h.needle(OWNER, "Denial Serum");
  ok(!h.D().active("denial"), "not switched on in LSCG: we wait a moment to see if LSCG takes it...");
  await wait(1700);
  ok(h.D().active("denial"), "...and when it doesn't, we give it ourselves");
  // somebody not on your list gets nothin' through LSCG either
  const veto = befores.find(([n]) => n === "drug.beforeApply")[1];
  const pay = { types: ["sedative", "farmhand-dispensary.denial"], sender: STRANGER };
  veto({ payload: pay });
  ok(pay.types.join() === "sedative", "a stranger's dose through LSCG: ours is taken out, LSCG's own left to LSCG");
  ons.safeword && ons.safeword({ kind: "release" });
  ok(!G.active("denial"), "LSCG's safeword lifts ours too");

  // ---- HARDCORE (Laynie, Nov 17: "it can be set to have no end date, but a keyholder ... needs to ping the hardcore users
  // dispensary and companion atleast once every 30 days, otherwise, it will unlock after 30 days without the ping")
  const DAY = 86400000;
  const lone = page({ noOwner: true }); await wait(1300);
  ok(lone.D().keyholders().length === 0 && lone.D().lock(7).why === "nokey" && !lone.D().hardOn(), "no owner and not farm stock: no keyholder, so hardcore won't switch on");
  lone.pages[0].load();
  const lockBtn = [...lone.w.document.querySelectorAll("#fd-page button")].find((b) => /Lock me in/.test(b.textContent));
  ok(lockBtn && lockBtn.disabled && /no keyholder yet/.test(lone.w.document.getElementById("fd-page").textContent), "...the page says why, and the button won't press");
  const hc = page({ bot: true }); await wait(1300);
  const HC = hc.D();
  hc.fromBot("dispWelcome", { farm: [BOT], stock: true });
  ok(HC.keyholders().join() === [OWNER, 221397, 232922].join(), "on the farm's books: your owner, and the proprietors, hold your key");
  hc.pages[0].load();
  let warned = "";
  hc.w.confirm = (t) => { warned = t; return true; };
  const endSel = hc.w.document.querySelector("#fd-page select[aria-label='When hardcore ends']");
  endSel.value = "0"; endSel.dispatchEvent(new hc.w.Event("change"));
  [...hc.w.document.querySelectorAll("#fd-page button")].find((b) => /Lock me in/.test(b.textContent)).click();
  ok(HC.hardOn() && HC.st().hard.until === 0, "you lock yourself in from the page, with no end date");
  ok(/won't lift your doses/.test(warned) && /30 days with no keyholder checkin' in/.test(warned) && /Mistress/.test(warned), "...after a plain warning: what it means, who holds the key, when it ends");
  const ann = hc.to(OWNER, "dispHard").pop();
  ok(ann && ann.on === true && ann.keys.includes(OWNER), "your keyholder in the room hears about it");
  const pg2 = hc.w.document.getElementById("fd-page");
  ok(/Hardcore: your keyholders hold these settings/.test(pg2.textContent) && pg2.querySelector("select[aria-label='Who can dose you']").disabled, "the page locks: you can look, not change");
  ok([...pg2.querySelectorAll("button")].some((b) => /Ask to be let out/.test(b.textContent)), "...and the safeword button asks to be let out");
  hc.pages[0].exit();
  // the safewords ask instead
  HC.give("denial", { by: OWNER });
  hc.cmds.find((c) => c.Tag === "dispensary").Action("safeword");
  ok(HC.active("denial"), "in hardcore, /dispensary safeword doesn't lift your doses");
  ok(hc.to(OWNER, "dispAsk").length === 1, "...it asks your keyholder in the room to let you out");
  ok(hc.sent.some(([e, d]) => e === "AccountBeep" && d.MemberNumber === 232922 && /askin' to be let out/.test(d.Message)) && hc.to(221397, "dispAsk").length === 1, "...and beeps the ones who aren't here, in plain words");
  hc.w.ChatRoomSafewordRevert(); ok(HC.active("denial"), "the game's own safeword doesn't lift them either");
  hc.fromBot("dispClear", {}); ok(HC.active("denial"), "nor the farm's ?safeword (it still fetches help)");
  // keyholders, and only keyholders
  hc.fromBot("dispKey", { do: "set", who: "any" }, STRANGER);
  ok(HC.st().who === "farm", "somebody who isn't your keyholder can't change a thing");
  hc.fromBot("dispKey", { do: "set", who: "lovers", clock: "real", off: { sedative: true } }, OWNER);
  ok(HC.st().who === "lovers" && HC.st().clock === "real" && HC.st().off.sedative === true, "your keyholder changes your settings");
  ok(hc.local.some((t) => /Mistress changed your Dispensary/.test(t) && /real time/.test(t)), "...and you're told who changed what");
  ok(hc.to(OWNER, "dispKeyState").length >= 1, "...and their editor gets your settings back");
  HC.st().hard.checkAt = Date.now() - 20 * DAY;
  hc.fromBot("dispKey", { do: "check" }, OWNER);
  ok(Date.now() - HC.st().hard.checkAt < 5000, "a keyholder checks in: the 30 days start over");
  hc.fromBot("dispKey", { do: "letout" }, 221397);
  ok(!HC.active("denial") && HC.hardOn(), "a proprietor lets you out: every dose lifted, hardcore stays");
  hc.fromBot("dispKey", { do: "extend", days: 3 }, OWNER);
  ok(Math.abs(HC.st().hard.until - (Date.now() + 3 * DAY)) < 5000, "your keyholder gives it an end date");
  // the clock lets go by itself
  HC.st().hard.until = Date.now() - 1; HC.tick();
  ok(!HC.hardOn() && hc.local.some((t) => /Hardcore's off \(the end date came\)/.test(t)), "the end date comes: hardcore's off, and you're told");
  HC.lock(0); HC.st().hard.checkAt = Date.now() - 29 * DAY; HC.tick();
  ok(HC.hardOn(), "no end date: 29 days without a check-in, still locked");
  HC.st().hard.checkAt = Date.now() - 31 * DAY; HC.tick();
  ok(!HC.hardOn(), "...30 days without a keyholder checkin' in, and it unlocks itself");
  // a keyholder's beep, from another room
  HC.lock(0);
  hc.w.ServerAccountBeep({ MemberNumber: OWNER, Message: "🗝️ Mistress ended your hardcore. [fd:end]" });
  ok(!HC.hardOn() && hc.beeps.pop() === "🗝️ Mistress ended your hardcore.", "your keyholder's beep from another room ends it, and the tag's tidied off before you see it");
  HC.lock(0); hc.w.ServerAccountBeep({ MemberNumber: STRANGER, Message: "lol [fd:end]" });
  ok(HC.hardOn(), "the same tag from anybody else does nothin'");
  hc.fromBot("dispKey", { do: "end" }, OWNER);
  ok(!HC.hardOn(), "your keyholder ends it in the room");


  // ---- keyholders by member number (Laynie, Nov 17: "there should be a way to add keyholders by id")
  const ak = page({ noOwner: true }); await wait(1300);
  const AK = ak.D();
  ak.pages[0].load();
  const keyIn = ak.w.document.querySelector("#fd-page input[aria-label='Add a keyholder by member number']");
  keyIn.value = String(FRIEND); keyIn.dispatchEvent(new ak.w.Event("input"));
  [...ak.w.document.querySelectorAll("#fd-page button")].find((b) => b.textContent === "Add").click();
  ok(AK.keyholders().join() === String(FRIEND), "you add a keyholder by member number on the page");
  ok(AK.lock(1).ok && AK.hardOn(), "...and with them holdin' your key, hardcore switches on (no owner needed)");
  const pg3 = ak.w.document.getElementById("fd-page");
  ok(!pg3.querySelector("input[aria-label='Add a keyholder by member number']") && /Locked in with you/.test(pg3.textContent), "in hardcore, who holds your key is locked in with you");
  ak.fromBot("dispKey", { do: "end" }, FRIEND);
  ok(!AK.hardOn(), "the keyholder you added can end it");
  ak.pages[0].exit();

  // ---- the Companion in hardcore: its game-rule switches stay put; your keyholder sets them
  const cw = page({ companion: true }); await wait(1500);
  const CW = cw.D();
  const prefs = () => { try { return JSON.parse(cw.w.localStorage.getItem("fhc-prefs")) || {}; } catch (e) { return {}; } };
  CW.lock(0);
  const comp = cw.pages.find((x) => x.Identifier === "FarmhandCompanion");
  comp.load();
  [...cw.w.document.querySelectorAll("#fhc-settings nav button")].find((b) => /Body and look/.test(b.textContent)).click();
  const shapeBtn = cw.w.document.querySelector("#fhc-settings button[aria-label='Farm can change my body shape']");
  const shape0 = !!prefs().shape;
  shapeBtn && shapeBtn.click();
  ok(shapeBtn && !!prefs().shape === shape0, "in hardcore, the Companion's 'Farm can change my body shape' won't flip");
  comp.exit && comp.exit();
  cw.fromBot("dispKey", { do: "state" }, OWNER);
  const cst = cw.to(OWNER, "dispKeyState").pop();
  ok(cst && cst.companion && cst.companion.stir && cst.companion.stir.label === "Farm can stir me up" && !cst.companion.noFeelings, "your keyholder's editor sees the Companion's frozen switches (not your privacy ones)");
  cw.fromBot("dispKey", { do: "set", companion: { stir: true, noLead: false } }, OWNER);
  ok(prefs().stir === true && prefs().noLead === true, "your keyholder sets them for you");
  ok(cw.local.some((t) => /Companion "Farm can stir me up" on/.test(t)), "...and you're told which");
  cw.fromBot("dispKey", { do: "end" }, OWNER);
  comp.load();
  [...cw.w.document.querySelectorAll("#fhc-settings nav button")].find((b) => /Body and look/.test(b.textContent)).click();
  cw.w.document.querySelector("#fhc-settings button[aria-label='Farm can change my body shape']").click();
  ok(!!prefs().shape !== shape0, "hardcore over: the switch is yours again");

  // ---- you hold the key: your Dispensary checks in by itself, and the page has your ward
  const kh = page({ me: OWNER }); await wait(1300);
  kh.fromBot("dispHard", { on: true, until: 0, due: Date.now() + 30 * DAY, keys: [OWNER, 221397], name: "Hana" }, ME);
  ok(kh.to(ME, "dispKey").some((d) => d.do === "check"), "sharin' a room with somebody whose key you hold: your Dispensary checks in for you");
  kh.fromBot("dispHard", { on: true, until: 0, due: Date.now() + 30 * DAY, keys: [OWNER], name: "Hana" }, ME);
  ok(kh.to(ME, "dispKey").filter((d) => d.do === "check").length === 1, "...once an hour, not every time they say so");
  kh.pages[0].load();
  const kp = kh.w.document.getElementById("fd-page");
  ok(/Keys you hold/.test(kp.textContent) && /Hana \(600\)/.test(kp.textContent), "the page lists who you hold keys for");
  [...kp.querySelectorAll("button")].find((b) => /Let out/.test(b.textContent)).click();
  ok(kh.to(ME, "dispKey").some((d) => d.do === "letout"), "...with a button to let them out");
  kh.fromBot("dispAsk", { name: "Hana" }, ME);
  ok(kh.local.some((t) => /Hana is askin' to be let out/.test(t)), "their safeword reaches you as a note");
  kh.pages[0].exit();

  // ---- the Companion holds keys too (without the Dispensary)
  const ck = page({ me: OWNER, companion: true, noDisp: true }); await wait(1500);
  ck.fromBot("dispHard", { on: true, until: 0, due: Date.now() + 30 * DAY, keys: [OWNER], name: "Hana" }, ME);
  ok(ck.to(ME, "dispKey").some((d) => d.do === "check"), "a keyholder with only the Companion: it checks in for them too");
  ck.cmds.find((c) => c.Tag === "keys").Action("end hana");
  ok(ck.to(ME, "dispKey").some((d) => d.do === "end"), "/keys end <name> from the Companion");

  // ---- the page
  ok(p.pages.length === 1 && p.pages[0].Identifier === "FarmhandDispensary", "its own page in Preferences → Extensions");
  p.pages[0].load();
  const pg = p.w.document.getElementById("fd-page");
  ok(pg && /Who can dose you/.test(pg.textContent) && pg.querySelectorAll("select[aria-label='Who can dose you'] option").length === 8, "...who can dose you, all eight rungs");
  const tips = [...pg.querySelectorAll("label[title]")].map((l) => l.getAttribute("title"));
  ok(tips.some((t) => /keep running while you're logged off/.test(t) && /50% longer/.test(t) && /lasts 3 hours/.test(t)), "...the real-time tip says the penalty plainly: a 2-hour dose lasts 3");
  ok(/Safeword: lift every dose/.test(pg.textContent) && /Denial Serum/.test(pg.textContent) && /Sedative/.test(pg.textContent), "...the safeword button, and each dose with its own switch");
  p.pages[0].exit();
  ok(!p.w.document.getElementById("fd-page"), "...and it closes");

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
