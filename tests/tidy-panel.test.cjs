// Nov 4, Phase 3: the tidy Livestock panel and the settings pages (Laynie: "thats so much cleaner", and the switches,
// guides and "how it talks to you" moved to ⚙ Settings). Every switch is still somewhere, the Me tab's rows open where
// they sit, its quick buttons send the right thing, and the record switch says exactly what she asked it to.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, m) => { if (!c) fails++; out(m + " -> " + !!c); };

const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window, sent = [];
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
w.CurrentScreen = "ChatRoom";
w.ChatRoomCharacter = [{ MemberNumber: 500 }, { MemberNumber: 260239 }];
w.Player = { MemberNumber: 500, Name: "Moo" };
w.ServerSend = (ev, d) => sent.push([ev, d]);
w.ChatRoomMessage = () => {};
w.ChatRoomCanLeave = () => true; w.ChatRoomAttemptLeave = () => {};
w.CommandCombine = () => {};
w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
const D = w.document;
const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, ...d } });
const cmds = () => sent.filter((s) => s[1] && s[1].Content === "FarmhandMsg" && s[1].Dictionary.type === "cmd").map((s) => s[1].Dictionary.text);
const bare = (t) => t.trim().replace(/^[^\p{L}\d?]+/u, "");
const click = (label) => { const all = [...D.querySelectorAll("#fhc-panel button")]; const b = all.find((x) => x.textContent.trim().startsWith(label)) || all.find((x) => bare(x.textContent).startsWith(bare(label))); if (b) b.click(); return !!b; };
const text = () => D.getElementById("fhc-panel").textContent;
const H = Date.now(), hr = 3600000;
const SW = { breedable: true, fertile: true, jarok: true, freeuse: false, futa: false, mpreg: false, milkable: true, seedmilk: true, naturalheat: false, praise: true, degrade: false,
  tally: true, teaseme: false, hypno: false, potions: true, dares: false, watersports: false, parasite: false, symbiote: false, traps: true, ownoutfit: false, eager: false, bench: false };
const STATE = { name: "Moo", onBooks: true, roles: ["LIVESTOCK"], tier: "Trained", species: "cow", gender: "female", herdLeader: "Laynie", staff: false, keys: ["bronze"],
  ribbons: 34, contract: { title: "deep", until: H + 54 * hr }, switches: SW,
  milk: { ml: 1800, cap: 2400, grade: "A" }, quota: { ml: 6200, goal: 8000, streak: 5 }, holding: { ml: 620, cap: 1000 },
  preg: { due: H + 2 * 86400000, sires: ["Rex"] }, eggs: { n: 4 }, body: [{ part: "udder", label: "Chest", size: "J cup" }],
  today: { tally: 7, naughty: 1, praised: 3, degraded: 0 }, now: [{ icon: "🔥", text: "Heat", until: H + 3 * hr }],
  kept: { by: "Laynie", until: H + 3 * 86400000 }, roam: { left: 2, price: 29 },
  feats: { tracks: [{ key: "dairy", icon: "🥛", name: "Dairy", tier: 4, n: 612, prev: 400, next: 1000, unit: "L milked", perk: "Heavy Udders", desc: "+5% milk capacity a tier" }] },
  mods: { "barn-life": { label: "Barn life", cards: [{ title: "Barn life", me: true, bars: [{ label: "🌾 Food", value: "72%", pct: 72 }], chips: [{ text: "🥛 Milk-drunk" }], buttons: [{ label: "Eat (at a trough)", cmd: "eat" }] }] } } };

(async () => {
  await wait(4500);
  bot({ type: "welcome", ver: "0.70.2", name: "Moo", proto: 2 });
  bot({ type: "state", state: STATE });
  D.getElementById("fhc-btn").click();
  await wait(200);

  // the frame: four tabs that fit the width, quiet header icons, only 🆘 red-edged, no stray "false"
  const seg = [...D.querySelectorAll("#fhc-panel nav.fhc-seg button")].map((b) => bare(b.textContent));
  ok(seg.join(",") === "Me,Body,Play,Ribbons", "the Livestock panel has four tabs: " + seg.join(", "));
  ok(["Settings", "Full screen", "Safety", "Close the panel"].every((l) => D.querySelector('#fhc-panel .fhc-head button[aria-label="' + l + '"]')), "the header has ⚙, full screen, 🆘 and ✕");
  ok(D.querySelectorAll("#fhc-panel .fhc-head .sos").length === 1, "only 🆘 has the red edge");
  ok(!D.querySelector("#fhc-panel .fhc-top").textContent.includes("false"), "no stray \"false\" under the header (one panel only)");

  // Me: one card, then rows
  ok(/Moo/.test(text()) && /🎀 34/.test(text()) && /Trained cow · Laynie's herd · contract 2 d 6 h/.test(text()), "the Me card: name, purse, and the line with the herd and the contract");
  ok(/Milk-drunk/.test(text()) && /Food/.test(text()) && /72%/.test(text()) && /1\.8 \/ 2\.4 L/.test(text()), "barn life's meter and chip sit in the card with the milk");
  ok(/Carryin'/.test(text()) && /Rex's, due in 2 d · 4 eggs/.test(text()), "a row sums up what you're carryin'");
  ok(!/Eat \(at a trough\)/.test(text()), "the rows start folded");
  click("Farm extras"); await wait(50);
  ok(/Eat \(at a trough\)/.test(text()), "a row opens where it sits");
  click("Farm extras"); await wait(50);
  ok(!/Eat \(at a trough\)/.test(text()), "...and folds again");
  click("Next feat"); await wait(50);
  ok(/612 of 1000 L milked/.test(text()), "the next feat row shows how close it is");
  click("All my feats"); await wait(50);
  ok(D.querySelector("#fhc-panel nav.fhc-seg button.on") && /Ribbons/.test(D.querySelector("#fhc-panel nav.fhc-seg button.on").textContent) && /Heavy Udders/.test(text()), "...and takes you to your feats on Ribbons");

  // Me's quick buttons
  click("Me"); await wait(50);
  let n = cmds().length;
  click("🚿 Wash"); click("💉 Shots"); click("🪣 Drain");
  ok(cmds().slice(n).join("|") === "wash|myshots|drain 500", "Wash, Shots and Drain (your own number, so it's you) send " + cmds().slice(n).join(", "));
  click("More"); await wait(50);
  ok(["Stats", "Measure", "Record", "Pedigree", "Keys", "Dress me", "Quiet hour"].every((l) => [...D.querySelectorAll("#fhc-panel .fhc-menu button")].some((b) => bare(b.textContent) === l)), "More has the rest");
  n = cmds().length; click("🤫 Quiet hour");
  ok(cmds().slice(n)[0] === "quiet 60" && !D.querySelector("#fhc-panel .fhc-menu"), "a More item sends, and the menu closes");

  // the other tabs
  click("Body"); await wait(50);
  ok(/Milk/.test(text()) && /Breedin'/.test(text()) && /Holdin'/.test(text()) && /Seed/.test(text()), "Body: milk, breedin', holdin' and seed");
  click("Play"); await wait(50);
  ok(/Traps/.test(text()) && /On you right now/.test(text()), "Play: traps and what's on you");

  // ⚙ Settings (no game settings page here: the panel's own)
  D.querySelector('#fhc-panel button[aria-label="Settings"]').click(); await wait(50);
  const pages = [...D.querySelectorAll("#fhc-panel .fhc-set-nav button")].map((b) => bare(b.textContent).replace(/^ℹ\s*/, ""));
  ok(pages.join(",") === "Farm switches,Body and look,Gear and marks,Messages,Privacy and record,Guides,Advanced,About", "eight settings pages: " + pages.join(", "));
  ok(/‹ Back to/.test(text()), "with a way back to the tabs");
  // every switch the old Toggles tab had is on one of them
  const OLD = ["Hypno", "Tease me", "Breedable", "Fertile", "Mpreg", "Jar breedin'", "Free use", "Futa", "Milkable", "Milk my seed", "Natural heat", "Praise", "Degrade",
    "Tally marks", "Potions", "Dares", "Watersports", "Parasite", "Symbiotes", "Traps", "Bring my own outfit", "Traps: no cooldown", "Use bench",
    "Farm messages in chat too", "Compact cards", "Chime on notices", "Open on new notice", "Pin the 🌾 button", "Farm emotes about me come from me",
    "Lead me instead of teleportin'", "Farm can set my face", "Farm sounds", "Trance haze", "Private feelings", "Carryin' slows me down",
    "Farm can stir me up", "Farm can put real gear on me", "Farm can change my body shape", "Farm can mark my body", "Farm can strip me",
    "Show my drawn body", "See other people's drawn bodies", "Send a record of what I see", "Farmhand Companion on"];
  const found = new Set();
  for (let i = 0; i < pages.length; i++) {
    if (pages[i] === "Guides") continue;
    D.querySelectorAll("#fhc-panel .fhc-set-nav button")[i].click(); await wait(30);
    for (const t of D.querySelectorAll("#fhc-panel .fhc-tog .fhc-tog-l")) found.add(t.textContent.trim());
  }
  const lost = OLD.filter((l) => !found.has(l));
  ok(!lost.length, "every switch is on a settings page" + (lost.length ? " (missing: " + lost.join(", ") + ")" : ""));
  // her words for the record, exactly
  click("Privacy and record"); await wait(30);
  const rec = [...D.querySelectorAll("#fhc-panel .fhc-tog")].find((t) => /Send a record of what I see/.test(t.textContent));
  ok(rec && rec.querySelector(".fhc-muted").textContent === "This option sends a copy of what the companion receives and sends for bug squashing. Completely voluntary participation.",
    "the record switch says exactly what Laynie asked");
  ok(rec && !/beep|whisper/i.test(rec.textContent), "...and nothing about beeps or whispers");
  // Find a setting
  const find = D.querySelector('#fhc-panel input[aria-label="Find a setting"]');
  find.value = "stud"; find.dispatchEvent(new w.Event("input")); await wait(30);
  const futa = [...D.querySelectorAll("#fhc-panel .fhc-tog")].find((t) => /^Futa/.test(t.textContent.trim()));
  ok(!!futa && /Be a stud for a while/.test(futa.textContent), "Find a setting: \"stud\" finds Futa (a turn as a stud)");
  n = cmds().length; if (futa) futa.querySelector("button").click(); await wait(30);
  ok(cmds().slice(n)[0] === "futa on", "...and its switch works from the search");
  const find2 = D.querySelector('#fhc-panel input[aria-label="Find a setting"]');   // (the switch redrew the panel)
  find2.value = "zzqq"; find2.dispatchEvent(new w.Event("input")); await wait(30);
  ok(/Nothin' matches/.test(text()), "a search that finds nothin' says so");

  // a proprietor: no record switch, a line instead
  find2.value = ""; find2.dispatchEvent(new w.Event("input"));
  bot({ type: "state", state: Object.assign({}, STATE, { logMust: true }) }); await wait(100);
  click("Privacy and record"); await wait(30);
  ok(!/Send a record of what I see/.test(text()) && /always sends its record/.test(text()), "a proprietor's record has no switch");

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
