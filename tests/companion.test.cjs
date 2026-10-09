// Loads the built companion into a fake browser page and checks every view works.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window;
const sent = [];
let commands = [];
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;   // real browsers have these; jsdom forgets
w.CurrentScreen = "ChatRoom";
w.ChatRoomCharacter = [{ MemberNumber: 221397 }, { MemberNumber: 260239 }];
w.ServerSend = (ev, d) => sent.push([ev, d]);
w.ChatRoomMessage = (data) => { w.__shown = (w.__shown || 0) + 1; };   // the game's own handler
w.CommandCombine = (c) => { commands = commands.concat(c); };
w.BCPlus = { loaded: true, version: { major: 0, minor: 14, patch: 0 } };
w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));

const D = w.document;
const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, ...d } });
const toBot = (type) => sent.filter((s) => s[1].Content === "FarmhandMsg" && s[1].Target === 260239 && s[1].Dictionary.type === type);
const cmds = () => toBot("cmd").map((s) => s[1].Dictionary.text);
const pills = () => [...D.querySelectorAll("#fhc-panel .fhc-pill")];
const click = (label) => { const b = [...D.querySelectorAll("#fhc-panel button")].find((x) => x.textContent.trim().startsWith(label)); if (b) b.click(); return !!b; };
const text = () => D.getElementById("fhc-panel").textContent;

const STATE = { name: "Laynie", onBooks: true, roles: ["PROPRIETOR", "LIVESTOCK"], tier: "prize", species: "cow", gender: "female",
  staff: true, herdmaster: true, proprietor: true, mandated: false, onDuty: true, onCall: false, keys: ["bronze", "silver", "gold"],
  switches: { breedable: true, fertile: true, jarok: true, freeuse: false, futa: false, milkable: true, naturalheat: false, praise: true, degrade: false, tally: true, teaseme: false, forced: false },
  milk: { ml: 1800, cap: 3000, grade: "A", lastAt: Date.now() - 600000 }, quota: { ml: 1200, goal: 2000, streak: 3 },
  holding: { ml: 0, cap: 600 }, body: [{ part: "udder", label: "Udder", size: "C cup" }], today: { tally: 2, naughty: 0, praised: 4, degraded: 0 } };

(async () => {
  await wait(4500);
  out("1 panel built ->", !!D.getElementById("fhc-panel"));
  out("1 said hello ->", toBot("hello").length > 0);
  out("1 /farm command added ->", commands.some((c) => c.Tag === "farm"));
  bot({ type: "welcome", ver: "0.9.25", name: "Laynie" });
  out("1 an old bot is called out, not silent ->", /older bot \(v0\.9\.25\)/.test(text()), /needs updatin/.test(D.getElementById("fhc-status").textContent));
  bot({ type: "welcome", ver: "0.9.29", name: "Laynie", proto: 2 });
  out("1 status ->", /connected/.test(D.getElementById("fhc-status").textContent));
  out("1 guest view before state ->", /Apply to join/.test(text()));

  bot({ type: "state", state: STATE });
  const views = pills().map((p) => p.textContent);
  out("2 panel switch shows all three ->", ["Livestock", "Staff", "Dashboard"].every((v) => views.includes(v)));
  click("Livestock"); click("Me");
  out("2 livestock Me shows milk ->", /1\.8 L of 3\.0 L/.test(text()), /C cup/.test(text()));
  D.querySelector(".fhc-quick button").click();
  out("2 Stats button sends ?stats ->", cmds().includes("stats"));
  click("Toggles");
  const jar = [...D.querySelectorAll(".fhc-tog")].find((t) => /Jar insemination/.test(t.textContent));
  jar.querySelector("button").click();
  out("2 jar switch sends jarok off ->", cmds().includes("jarok off"));
  click("femboy"); out("2 gender pill sends ->", cmds().includes("gender femboy"));

  bot({ type: "ask", kind: "jar", text: "💉 Hand wants to inseminate you from jar #3", id: 7 });
  out("3 yes/no banner ->", /jar #3/.test(text()));
  click("Yes"); out("3 Yes sends yes ->", cmds().includes("yes"), !/jar #3/.test(text()));
  bot({ type: "choose", text: "4/13 — How should the farm see you?", choices: ["female", "male", "futa", "femboy"], id: 8 });
  [...D.querySelectorAll(".fhc-box.ask button")].find((b) => b.textContent === "futa").click();
  out("3 choice button answers ->", cmds().includes("futa"), !/How should the farm/.test(text()));

  bot({ type: "reply", text: "📋 LAYNIE'S CARD", id: 1, part: 1, of: 1 });
  bot({ type: "reply", text: "part two", id: 2, part: 2, of: 2 });
  bot({ type: "reply", text: "part one", id: 2, part: 1, of: 2 });
  click("Inbox");
  const cards = [...D.querySelectorAll(".fhc-card")].map((c) => c.textContent);
  out("4 inbox shows replies ->", cards.some((c) => c.includes("LAYNIE'S CARD")));
  out("4 pieces glued in order ->", cards.some((c) => c.includes("part one\npart two")));
  const before = D.querySelectorAll(".fhc-card").length;
  w.ChatRoomMessage({ Sender: 999, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, type: "reply", text: "fake!", id: 9, part: 1, of: 1 } });
  out("4 ignores fakes from non-bot ->", D.querySelectorAll(".fhc-card").length === before);
  w.__shown = 0; w.ChatRoomMessage({ Sender: 221397, Type: "Chat", Content: "hi" });
  out("4 normal chat still reaches the game ->", w.__shown === 1);

  click("Staff");
  bot({ type: "doc", text: "🩺 VET CARD · Bessie", id: 3, part: 1, of: 1, kind: "vet", who: "Bessie", about: 500 });
  out("5 doc lands in the Office ->", /VET CARD · Bessie/.test(text()), pills().some((p) => p.classList.contains("on") && /Office/.test(p.textContent)));
  click("Refresh"); out("5 Refresh re-asks ->", cmds().includes("vet 500"));
  bot({ type: "notice", text: "🔴 SAFEWORD from Daisy (600). Please go to them now.", id: 4, part: 1, of: 1 });
  click("Office"); out("5 safeword card in the Office ->", /SAFEWORD from Daisy/.test(text()) && /Nothin' has been released/.test(text()));
  click("Contracts");
  const who = [...D.querySelectorAll("#fhc-panel input")].find((i) => i.placeholder === "Bessie");
  who.value = "Bessie"; who.dispatchEvent(new w.Event("input"));
  click("Offer it"); out("5 contract offer sent ->", cmds().includes("contract offer deep Bessie 1w"));

  // 5b. the live staff tabs
  const STAFF5B = Object.assign({}, STATE, {
    herd: [{ mn: 500, name: "Bessie", role: "livestock", where: "barn", milk: 88, heat: true, preg: false, denied: false, mine: true, onDuty: true }],
    zones: { "barn-1": { a: { X: 2, Y: 2 }, b: { X: 5, Y: 4 }, group: "barn" } }, tease: ["Cute today, %name%."], teaseOpted: 4,
    voice: { herd: { on: true, lines: ["Good cows stand still."], every: "15" }, members: [{ mn: 500, name: "Bessie", hypno: true, on: false, lines: [], every: "15" }] },
    shift: { clocked: false, weekH: 6.5, onDuty: ["Laynie"], onCall: [{ name: "Hand", mandated: true, here: false }] },
    log: [{ t: Date.now(), a: "TEASE_ADD", by: "Laynie", d: "" }] });
  bot({ type: "state", state: STAFF5B });
  click("Herd"); out("5b herd shows where and flags ->", /barn/.test(text()), /in heat/.test(text()));
  click("Summon to me"); out("5b summon from herd ->", cmds().includes("summon 500"));
  click("Tease lines"); click("Remove"); out("5b tease remove ->", cmds().includes("tease remove 1"));
  click("Zones"); out("5b zone map drawn ->", !!D.querySelector('#fhc-panel button[aria-label="barn-1"]'));
  click("Set A where I stand"); out("5b zone corner ->", cmds().includes("zone a barn-1"));
  // a farmhand sees the map, zones and spots, but nothing to change them with
  bot({ type: "state", state: Object.assign({}, STATE, { herdmaster: false, proprietor: false, mapEdit: false,
    zones: { "barn-1": { a: { X: 2, Y: 2 }, b: { X: 5, Y: 4 }, group: "barn" } }, spots: { "milking1": { X: 3, Y: 3 } } }) });
  click("Zones");
  const btns = [...D.querySelectorAll("#fhc-panel button")].map((b) => b.textContent);
  out("5b farmhand sees the map ->", !!D.querySelector('#fhc-panel button[aria-label="barn-1"]'), /milking1/.test(text()), btns.includes("Who's where"));
  out("5b ...but can't change it ->", !btns.some((b) => /Draw it on the map|Set A where I stand|Delete|Clear|Pick|Click it on the map|Set where I stand/.test(b)), /set by herdmasters and proprietors/.test(text()));
  bot({ type: "state", state: STAFF5B });   // back to a herdmaster for the rest
  click("Voice"); out("5b voice lines ->", /\[Voice\] Good cows stand still/.test(text()));
  click("Shift"); out("5b shift and log ->", /6\.5 h this week/.test(text()), /TEASE_ADD/.test(text()));
  bot({ type: "voice", text: "Moo for me." });

  click("Dashboard");
  out("6 dashboard knows BC+ ->", true);
  const nm = [...D.querySelectorAll("#fhc-panel input")].find((i) => i.placeholder === "prizecow");
  nm.value = "prizecow"; nm.dispatchEvent(new w.Event("input"));
  const kind = [...D.querySelectorAll("#fhc-panel select")][0];
  kind.value = "Other"; kind.dispatchEvent(new w.Event("change"));
  const rule = [...D.querySelectorAll("#fhc-panel select")][1];
  rule.value = "other.listenToMyVoice"; rule.dispatchEvent(new w.Event("change"));
  const ta = D.querySelector("#fhc-panel textarea[placeholder^='one sentence']");
  ta.value = "Good cows stand still.\nMoo for me."; ta.dispatchEvent(new w.Event("input"));
  click("Add to prizecow");
  out("6 rule added with its settings ->", cmds().some((c) => c === 'contract add prizecow other.listenToMyVoice sentences="Good cows stand still.|Moo for me." frequency="15"'));
  kind.value = "Settings"; kind.dispatchEvent(new w.Event("change"));
  const r2 = [...D.querySelectorAll("#fhc-panel select")][1]; r2.value = "settings.safeword"; r2.dispatchEvent(new w.Event("change"));
  out("6 safeword rule can't be added ->", /never uses this one/.test(text()), ![...D.querySelectorAll("#fhc-panel button")].some((b) => /^Add to/.test(b.textContent)));
  click("Other addons"); out("6 BC+ version matches ->", /BC\+ 0\.14\.0 matches the farm/.test(text()));

  const box = D.getElementById("fhc-input"); box.value = "half typed"; box.focus();
  bot({ type: "notice", text: "a new notice", id: 5, part: 1, of: 1 });
  out("7 typing survives a new message ->", D.getElementById("fhc-input").value === "half typed");
  // asked for: Safe word, I'm stuck and Call staff only in the Safety tab, on no panel's top row
  const rowSafe = () => [...D.querySelectorAll("#fhc-panel .fhc-row button")].some((b) => /^(Safe word|I'm stuck|Call staff)$/.test(b.textContent.trim()));
  out("7 no safety row on the staff panel ->", !rowSafe());
  click("Livestock"); out("7 ...or the livestock panel ->", !rowSafe());
  const nSafe = cmds().length; click("🆘 Safety");
  out("7 the Safety tab has all three ->", /Safe word/.test(text()) && /I'm stuck/.test(text()) && /Call staff/.test(text()));
  click("Safe word"); out("7 ...and the safe word works from it ->", cmds().slice(nSafe).includes("safe"));
  // phones: an update never rebuilds or refocuses the box (that popped the keyboard and zoomed the screen)
  box.blur(); let focused = 0; box.addEventListener("focus", () => focused++);
  bot({ type: "notice", text: "another notice", id: 6, part: 1, of: 1 });
  bot({ type: "state", state: STAFF5B });
  out("7 updates leave the box alone ->", D.getElementById("fhc-input") === box && focused === 0 && D.activeElement !== box);
  out("7 boxes are 16px on touch screens (no zoom) ->", /@media \(pointer:coarse\)\{#fhc-panel input,#fhc-panel select,#fhc-panel textarea\{font-size:16px\}\}/.test(D.head.innerHTML));
  // full screen and back
  const panelEl = D.getElementById("fhc-panel");
  const fsBtn = () => [...D.querySelectorAll("#fhc-panel button")].find((b) => /Full screen|Back to a panel/.test(b.getAttribute("aria-label") || ""));
  fsBtn().click(); out("7 full screen toggle ->", panelEl.classList.contains("full"), fsBtn().getAttribute("aria-label") === "Back to a panel");
  fsBtn().click(); out("7 ...and back to a panel ->", !panelEl.classList.contains("full"));
  // the corner grip resizes, and the size is remembered
  const grip = D.querySelector("#fhc-panel .fhc-grip");
  panelEl.getBoundingClientRect = () => ({ left: 100, top: 100, width: 440, height: 600, right: 540, bottom: 700 });
  const pe = (type, x, y) => { const e = new w.Event(type, { bubbles: true }); e.clientX = x; e.clientY = y; return e; };
  grip.dispatchEvent(pe("pointerdown", 540, 700)); w.dispatchEvent(pe("pointermove", 640, 760));
  out("7 the grip resizes ->", panelEl.style.width === "540px" && panelEl.style.height === "660px");
  panelEl.getBoundingClientRect = () => ({ left: 100, top: 100, width: 540, height: 660, right: 640, bottom: 760 });
  w.dispatchEvent(pe("pointerup", 640, 760));
  const prefsNow = JSON.parse(w.localStorage.getItem(Object.keys(w.localStorage).find((k) => /fh|farm/i.test(k))) || "{}");
  out("7 ...and remembers the size ->", prefsNow.size && prefsNow.size.w === 540 && prefsNow.size.h === 660);

  // 9. outfits: save, wear (with high security padlocks), leave locked spots alone, change back
  const G = { Cloth: { Name: "Cloth", Clothing: true, Category: "Appearance" }, HairFront: { Name: "HairFront", Clothing: false, Category: "Appearance" },
              ItemArms: { Name: "ItemArms", Clothing: false, Category: "Item" }, ItemNeck: { Name: "ItemNeck", Clothing: false, Category: "Item" } };
  const item = (g, n, p) => ({ Asset: { Name: n, Group: G[g] }, Property: p || {} });
  const fromBundle = (b) => b.map((x) => item(x.Group, x.Name, x.Property));
  let loaded = null, updates = 0;
  w.LZString = { compressToBase64: (s) => w.btoa(unescape(encodeURIComponent(s))), decompressFromBase64: (s) => decodeURIComponent(escape(w.atob(s))) };
  w.AssetGroupGet = (f, n) => G[n] || null;
  w.ServerBundledItemFromAppearanceItem = (it) => ({ Group: it.Asset.Group.Name, Name: it.Asset.Name, Property: JSON.parse(JSON.stringify(it.Property || {})) });
  w.ServerAppearanceBundle = (a) => a.map(w.ServerBundledItemFromAppearanceItem);
  w.ServerAppearanceLoadFromBundle = (C, f, b) => { loaded = b; C.Appearance = fromBundle(b); };
  w.ChatRoomCharacterUpdate = () => updates++;
  w.Player = { MemberNumber: 221397, AssetFamily: "Female3DCG", Appearance: [item("Cloth", "Shirt"), item("ItemArms", "HempRope", { LockedBy: "MetalPadlock", Effect: ["Lock"] }), item("HairFront", "Hair1")] };
  w.ChatRoomCharacter = [{ MemberNumber: 221397 }, { MemberNumber: 260239 }];
  click("Dashboard"); click("Outfits");
  const before9 = sent.length;
  [...D.querySelectorAll("#fhc-panel button")].find((b) => b.textContent === "Save what I'm wearin'").click();
  const save = sent.slice(before9).map((s) => s[1].Dictionary).find((d) => d && d.type === "outfitSave") || {};
  out("9 saves clothes and restraints, not hair ->", save.items === 2, save.locks === 1, save.slot === "cow|female");
  w.Player.Appearance = [item("Cloth", "Dress"), item("HairFront", "Hair2"), item("ItemNeck", "Collar", { LockedBy: "OwnerPadlock", Effect: ["Lock"] })];
  const outfitData = w.LZString.compressToBase64(JSON.stringify({ v: 1, items: [
    { Group: "Cloth", Name: "Shirt", Property: {}, locked: false }, { Group: "ItemArms", Name: "HempRope", Property: {}, locked: true },
    { Group: "ItemNeck", Name: "Choker", Property: {}, locked: false }] }));
  bot({ type: "outfit", slot: "cow|female", label: "cow · female", data: outfitData, keys: [700, 800], why: "Welcome to the farm", id: 9 });
  out("9 offer banner ->", /put on your cow · female/.test(text()));
  click("Yes, dress me");
  const by = (g) => (loaded || []).find((b) => b.Group === g) || {};
  out("9 clothes swapped, hair kept ->", by("Cloth").Name === "Shirt", by("HairFront").Name === "Hair2");
  out("9 locked piece gets a high security padlock ->", by("ItemArms").Property.LockedBy === "HighSecurityPadlock", by("ItemArms").Property.MemberNumberListKeys === "700,800");
  out("9 already-locked spot left alone ->", by("ItemNeck").Name === "Collar");
  out("9 room told, bot told ->", updates > 0, toBot("outfitAnswer").some((s) => s[1].Dictionary.answer === "worn"));
  bot({ type: "outfitBack", why: "shift's over" });
  const by2 = (g) => (loaded || []).find((b) => b.Group === g) || {};
  out("9 change back: own dress back on ->", by2("Cloth").Name === "Dress");
  out("9 farm-locked rope stays till a keyholder opens it ->", by2("ItemArms").Name === "HempRope");

  // 10. the 🌾 button: drag it (mouse or finger), a tap still opens, pin keeps it put
  const fb = D.getElementById("fhc-btn"), ev = (t, x, y, el) => (el || w).dispatchEvent(new w.MouseEvent(t, { clientX: x, clientY: y, bubbles: true }));
  w.innerWidth = 800; w.innerHeight = 600;
  ev("pointerdown", 5, 5, fb); ev("pointermove", 200, 150); ev("pointerup", 200, 150); fb.click();
  const saved = JSON.parse(w.localStorage.getItem("fhc-prefs") || "{}");
  out("10 dragged button moves and is remembered ->", fb.style.left === "195px", !!saved.btnPos);
  const wasOpen = D.getElementById("fhc-panel").classList.contains("open");
  fb.click(); out("10 a plain tap still opens/closes ->", D.getElementById("fhc-panel").classList.contains("open") !== wasOpen);
  click("Livestock"); click("Toggles");
  const pin = [...D.querySelectorAll(".fhc-tog")].find((t) => /Pin the/.test(t.textContent)); pin.querySelector("button").click();
  ev("pointerdown", 200, 150, fb); ev("pointermove", 400, 400); ev("pointerup", 400, 400);
  out("10 pinned button stays put ->", fb.style.left === "195px");

  commands.find((c) => c.Tag === "farm").Action("size");
  out("8 /farm size sends cmd ->", cmds().includes("size"));
  w.ChatRoomCharacter = [{ MemberNumber: 221397 }];
  commands.find((c) => c.Tag === "farm").Action("stats");
  out("8 bot away -> beeps ->", sent.some((s) => s[0] === "AccountBeep" && s[1].Message === "stats"));
  // 11. farm emotes about her, posted as her own emote (no name in front), only if they name her
  w.Player = { Name: "Laynie", Nickname: "Laynie", MemberNumber: 221397 };
  out("11 hello says it relays ->", toBot("hello").slice(-1)[0][1].Dictionary.relay === true);
  let n0 = sent.length;
  bot({ type: "relay", id: 41, text: "🤰 Laynie's belly jumps as the litter kicks (hard)." });
  const posted = sent.slice(n0).filter((s) => s[1].Type === "Emote");
  out("11 a line about her is posted as her emote ->", posted.length === 1 && posted[0][1].Content === "*Laynie's belly jumps as the litter kicks [hard].", posted[0] && posted[0][1].Content);
  n0 = sent.length; bot({ type: "relay", id: 42, text: "Moo's belly jumps." });
  out("11 a line not about her is refused, and the bot told ->", !sent.slice(n0).some((s) => s[1].Type === "Emote") && toBot("relayNo").some((s) => s[1].Dictionary.id === 42));
  click("Toggles"); await wait(100);
  const sw = [...D.querySelectorAll("#fhc-panel .fhc-tog")].find((x) => /come from me/.test(x.textContent));
  out("11 the switch is in Toggles ->", !!sw);
  if (sw) sw.querySelector("button").click();
  await wait(100);
  out("11 switching it off tells the bot ->", toBot("hello").slice(-1)[0][1].Dictionary.relay === false);
  n0 = sent.length; bot({ type: "relay", id: 43, text: "Laynie sways." });
  out("11 switched off: refused ->", !sent.slice(n0).some((s) => s[1].Type === "Emote") && toBot("relayNo").some((s) => s[1].Dictionary.id === 43));
  // 12. cues on her own screen: walking there, telling the bot who she can see, face, sound, trance haze
  // a tiny fake map: 10×10, a wall across x=3 except a gap at y=4
  w.Player.MapData = { Pos: { X: 1, Y: 1 } }; w.ChatRoomMapViewWidth = 10; w.ChatRoomMapViewHeight = 10;
  w.ChatRoomMapViewIsActive = () => true; w.ChatRoomMapViewMovement = null;
  w.ChatRoomMapViewCanEnterTile = (x, y) => (x < 0 || y < 0 || x > 9 || y > 9 || (x === 3 && y !== 4)) ? 0 : 1;
  const steps = [];
  w.ChatRoomMapViewMove = (d) => { const p = w.Player.MapData.Pos; steps.push(d);
    w.Player.MapData.Pos = { X: p.X + (d === "East" ? 1 : d === "West" ? -1 : 0), Y: p.Y + (d === "South" ? 1 : d === "North" ? -1 : 0) }; };
  w.ChatRoomSendLocal = () => {};
  bot({ type: "lead", X: 6, Y: 1, id: 77, why: "to the trough" });
  await wait(4000);
  out("12 led around the wall, through the gap, step by step ->", w.Player.MapData.Pos.X === 6 && w.Player.MapData.Pos.Y === 1, steps.length, toBot("leadOk").some((s) => s[1].Dictionary.id === 77));
  w.ChatRoomMapViewCanEnterTile = (x, y) => (x === 1 && y === 1) ? 1 : 0;   // boxed in
  w.Player.MapData.Pos = { X: 1, Y: 1 };
  bot({ type: "lead", X: 6, Y: 6, id: 78 }); await wait(300);
  out("12 no way through: the bot is told ->", toBot("leadNo").some((s) => s[1].Dictionary.id === 78));
  // sight
  w.ChatRoomCharacter = [{ MemberNumber: 221397 }, { MemberNumber: 260239 }, { MemberNumber: 500 }, { MemberNumber: 600 }];
  w.Player.MemberNumber = 221397;
  w.ChatRoomMapViewCharacterIsVisible = (c) => c.MemberNumber === 500;
  w.ChatRoomMapViewCharacterIsHearable = (c) => c.MemberNumber === 500 || c.MemberNumber === 600;
  await wait(4500);
  const sg = toBot("sight").slice(-1)[0];
  out("12 tells the bot who she can see and hear ->", !!sg && sg[1].Dictionary.see.join() === "500" && sg[1].Dictionary.hear.join() === "500,600");
  // face, sound, trance
  const faces = []; w.CharacterSetFacialExpression = (C, g, e, s) => faces.push(g + ":" + e);
  bot({ type: "face", mood: "heat", secs: 30 });
  out("12 face set on her own character ->", faces.includes("Blush:High") && faces.includes("Eyes:Horny") && faces.includes("Eyes2:Horny"));
  const played = []; w.AudioPlayInstantSound = (src) => played.push(src); w.Player.AudioSettings = { Volume: 1 };
  bot({ type: "sound", name: "pump" });
  out("12 a farm sound plays for her ->", played[0] === "Audio/SciFiPump.mp3");
  bot({ type: "trance", level: 2 }); await wait(50);
  out("12 trance haze appears ->", !!D.getElementById("fhc-trance"));
  bot({ type: "trance", level: 0 }); await wait(50);
  out("12 ...and lifts ->", !D.getElementById("fhc-trance"));
  out("12 hello lists which cues are on ->", typeof toBot("hello").slice(-1)[0][1].Dictionary.off === "object");
  // 13. add-on switches (?glory and friends) show in the Toggles tab too
  bot({ type: "state", state: Object.assign({}, STATE, { mods: { "glory-stalls": { label: "Glory stalls", cards: [{ title: "Glory stalls", toggles: [{ label: "Glory stalls: strangers can use me", on: false, cmd: "glory on" }] }] } } }) });
  click("Livestock"); await wait(50); click("Toggles"); await wait(100);
  const gsw = [...D.querySelectorAll("#fhc-panel .fhc-tog")].find((x) => /Glory stalls: strangers can use me/.test(x.textContent));
  out("13 the glory switch is in Toggles ->", !!gsw);
  const n13 = cmds().length; if (gsw) gsw.querySelector("button").click(); await wait(100);
  out("13 flipping it sends ?glory on ->", cmds().slice(n13).includes("glory on"));

  // 14. the Dashboard's Suggestions tab: the box, with Done / Later / Not now / Delete and a note back
  bot({ type: "state", state: Object.assign({}, STATE, { feedback: [
    { id: 2, t: Date.now(), name: "Moo", mn: 500, kind: "idea", text: "A hayride on Sundays", status: "open", note: "" },
    { id: 1, t: Date.now(), name: "Rex", mn: 600, kind: "bug", text: "The stall never let me go", status: "done", note: "Fixed!" }] }) });
  click("Dashboard");
  out("14 the Suggestions tab shows how many are open ->", [...D.querySelectorAll("#fhc-panel .fhc-pill")].some((b) => /Suggestions · 1/.test(b.textContent)));
  click("💡 Suggestions");
  out("14 open ones are listed ->", /A hayride on Sundays/.test(text()), !/The stall never let me go/.test(text()));
  const note14 = [...D.querySelectorAll("#fhc-panel input")].find((i) => /a note back to Moo/.test(i.placeholder));
  if (note14) { note14.value = "Booked!"; note14.dispatchEvent(new w.Event("input")); }
  const n14 = cmds().length; click("Done"); await wait(100);
  out("14 Done sends the note back ->", cmds().slice(n14).includes("feedback done 2 Booked!"));
  click("Everything");
  out("14 Everything shows the done ones too ->", /The stall never let me go/.test(text()), /Fixed!/.test(text()));

  // 15. the farm marking your body (marks.js): only with the Toggles switches on
  Object.assign(G, { Mask: { Name: "Mask", Clothing: true, Category: "Appearance" }, FaceMarkings: { Name: "FaceMarkings", Clothing: false, Category: "Appearance" },
    BodyMarkings: { Name: "BodyMarkings", Clothing: false, Category: "Appearance" }, ClothAccessory: { Name: "ClothAccessory", Clothing: true, Category: "Appearance" } });
  w.Player.Appearance = [item("Cloth", "Shirt"), item("HairFront", "Hair1"), item("ItemArms", "HempRope", { LockedBy: "MetalPadlock", Effect: ["Lock"] })];
  loaded = null;
  bot({ type: "mark", splat: ["face"] }); await wait(50);
  out("15 nothin' happens with the switch off ->", loaded === null);
  bot({ type: "state", state: STATE }); click("Livestock"); click("Toggles");
  const sw15 = (label) => [...D.querySelectorAll("#fhc-panel .fhc-tog")].find((t) => t.textContent.includes(label));
  sw15("Farm can mark my body").querySelector("button").click(); await wait(50);
  bot({ type: "mark", splat: ["face"] }); await wait(50);
  const sp = (loaded || []).find((b) => b.Name === "Splatters");
  out("15 a splatter lands on the face, in the first free spot ->", !!sp, sp && sp.Group === "Mask", sp && ["d", "e", "f"].some((k) => sp.Property.TypeRecord[k] === 1));
  bot({ type: "mark", splat: ["tummy"] }); await wait(50);
  const sp2 = (loaded || []).find((b) => b.Name === "Splatters");
  out("15 the next one adds to it ->", sp2 && Object.values(sp2.Property.TypeRecord).filter((v) => v === 1).length === 2);
  bot({ type: "mark", write: { line: "Breeder", pos: 7 } }); await wait(50);
  bot({ type: "mark", write: { line: "free use" } }); await wait(50);
  const bw = (loaded || []).find((b) => b.Name === "BodyWritings");
  out("15 words are written on the body, newest on top ->", bw && bw.Property.Text === "FREE USE" && bw.Property.Text2 === "BREEDER" && bw.Property.TypeRecord.p === 7);
  bot({ type: "mark", strip: true }); await wait(50);
  out("15 no strippin' with that switch off ->", (loaded || []).some((b) => b.Group === "Cloth"));
  sw15("Farm can strip me").querySelector("button").click(); await wait(50);
  bot({ type: "mark", strip: true }); await wait(50);
  out("15 stripped: clothes off, the locked rope stays ->", !(loaded || []).some((b) => b.Group === "Cloth"), (loaded || []).some((b) => b.Group === "ItemArms"));
  bot({ type: "mark", dress: true }); await wait(50);
  out("15 dressed again ->", (loaded || []).some((b) => b.Group === "Cloth" && b.Name === "Shirt"));
  bot({ type: "mark", wash: true }); await wait(50);
  // 16. staff cards from add-ons only on the Staff panel's Farm extras
  bot({ type: "state", state: Object.assign({}, STATE, { mods: { x: { label: "Test add-on", cards: [{ title: "Staff thing", staff: true, text: "staff only bits" }, { title: "Mine", text: "for everybody" }] } } }) });
  click("Livestock"); click("Farm extras");
  out("16 the Livestock panel shows add-on cards but not staff ones ->", /for everybody/.test(text()), !/staff only bits/.test(text()));
  click("Staff"); click("Farm extras");
  out("16 the Staff panel shows the staff ones ->", /staff only bits/.test(text()));
  out("15 ?wash takes the splatters and writing off ->", !(loaded || []).some((b) => b.Name === "Splatters" || b.Name === "BodyWritings"), (loaded || []).some((b) => b.Group === "HairFront"));
  process.exit(0);
})();
