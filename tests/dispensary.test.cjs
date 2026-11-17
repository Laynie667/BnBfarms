// Nov 17: The Farmhand's Dispensary, step 1 (the bones). Laynie: "a add-on that doesnt rely on the farm, or farmhand
// companion, but would work in tandem with it", then the ladder, the clock, LSCG's way, the farm girl's call.
// A pretend game page runs dist/farmhand-dispensary.user.js as player 600 (Hana).
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-dispensary.user.js"), "utf8");
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
  w.Player = { MemberNumber: ME, Name: "Hana", ExtensionSettings: opts.ext || {}, Ownership: { MemberNumber: OWNER }, Lovership: [{ MemberNumber: LOVER }],
    WhiteList: [WHITE], FriendList: [FRIEND], BlackList: [BLACK], ArousalSettings: { Progress: 50 }, IsPlayer: () => true, Appearance: [] };
  const C = (mn, name) => ({ MemberNumber: mn, Name: name, Appearance: [], IsPlayer: () => false });
  w.ChatRoomCharacter = [w.Player, C(OWNER, "Mistress"), C(LOVER, "Lov"), C(WHITE, "Whit"), C(FRIEND, "Fren"), C(BLACK, "Blackie"), C(STRANGER, "Stranger"), C(221397, "Laynie")];
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
  w.ChatRoomMessageRunExtractors = (data) => { const d = data.Dictionary || []; const a = d.find((x) => x.ActivityName); const t = d.find((x) => typeof x.TargetCharacter === "number"); return { metadata: { ActivityName: a && a.ActivityName, TargetMemberNumber: t && t.TargetCharacter } }; };
  if (opts.lscg) w.LSCG_OnLoad = { push: (cb) => cb(opts.lscg) }, w.LSCG = { version: "0.9.8" };
  w.eval(src);
  const charOf = (mn) => w.ChatRoomCharacter.find((c) => c.MemberNumber === mn);
  // somebody uses the Inject activity on me, holding a crafted item
  const needle = (by, name, desc) => {
    const c = charOf(by); c.Appearance = [{ Asset: { Name: "MedicalInjector", Group: { Name: "ItemHandheld" } }, Craft: { Name: name, Description: desc || "" } }];
    w.ChatRoomMessage({ Type: "Activity", Sender: by, Content: "ChatOther-ItemArms-Inject", Dictionary: [{ ActivityName: "Inject" }, { TargetCharacter: ME }] });
  };
  const fromBot = (type, data, sender) => w.ChatRoomMessage({ Type: "Hidden", Sender: sender || BOT, Content: "FarmhandMsg", Dictionary: Object.assign({ v: 2, type }, data) });
  const toBot = (type) => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Content === "FarmhandMsg" && d.Target === BOT && d.Dictionary.type === type).map(([, d]) => d.Dictionary);
  const actions = () => sent.filter(([e, d]) => e === "ChatRoomChat" && d.Type === "Action").map(([, d]) => d.Dictionary.find((x) => x.Tag === "msg").Text);
  return { w, sent, local, cmds, synced, faces, pages, game, needle, fromBot, toBot, actions, D: () => w.__disp };
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

  // ---- the page
  ok(p.pages.length === 1 && p.pages[0].Identifier === "FarmhandDispensary", "its own page in Preferences → Extensions");
  p.pages[0].load();
  const pg = p.w.document.getElementById("fd-page");
  ok(pg && /Who can dose you/.test(pg.textContent) && pg.querySelectorAll("select option").length === 8, "...who can dose you, all eight rungs");
  const tips = [...pg.querySelectorAll("label[title]")].map((l) => l.getAttribute("title"));
  ok(tips.some((t) => /keep running while you're logged off/.test(t) && /50% longer/.test(t) && /lasts 3 hours/.test(t)), "...the real-time tip says the penalty plainly: a 2-hour dose lasts 3");
  ok(/Safeword: lift every dose/.test(pg.textContent) && /Denial Serum/.test(pg.textContent) && /Sedative/.test(pg.textContent), "...the safeword button, and each dose with its own switch");
  p.pages[0].exit();
  ok(!p.w.document.getElementById("fd-page"), "...and it closes");

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
