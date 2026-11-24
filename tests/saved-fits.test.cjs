// THE FITS, SAVED (Nov 23, the suggestion box's #44; Laynie: "fitting in background, and keeping saved might help alot").
// Fitted pieces are saved in the player's own browser (studio/web/fit-store.js) under names made from what they're made
// of, so after a reload they're found instead of fitted again. Checked in the studio for real (a heavy look, reloaded:
// 34 pieces fitted fresh and 1.1 s of drawing without them, 21 to 28 from saved and about 0.4 s with them, the worst
// freeze 346 ms down to about 100, and the picture pixel for pixel the same). Here: the names don't depend on the page,
// what's learned goes out and comes back whole, and a browser with no saved space just doesn't save.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ROOT = path.join(__dirname, "..");
const engineSrc = fs.readFileSync(path.join(ROOT, "studio/web/body-engine.js"), "utf8");
const storeSrc = fs.readFileSync(path.join(ROOT, "studio/web/fit-store.js"), "utf8");

// ── the names a fit is kept under come from what it's made of, never a count from this page ──
ok(/const key2 = key \+ "\|span" \+ spanSig\(span\)/.test(engineSrc) && !/"\|span" \+ span\.v/.test(engineSrc), "a grown piece is named by how far it reaches, not by how many times it grew");
ok(/v\.__mkey \|\| v\.__mid/.test(engineSrc) && /res2\.__mkey = hashKey\(key2\)/.test(engineSrc) && /res\.__mkey = hashKey\(key\)/.test(engineSrc), "...and a fit made from it is named by that piece's own name, not its place in line");
const lookups = engineSrc.split("\n").filter((l) => /let c = (BREAST\.out\.get|keptOf\(BREAST\.out)/.test(l));
ok(lookups.length === 7 && lookups.every((l) => /keptOf\(BREAST\.out, key\)/.test(l)), "every fitted piece looks in the saved ones before fitting (" + lookups.length + ")");

// ── an engine in a page with no saved space: draws as ever, saves nothing ──
const dom = new JSDOM("<!doctype html><html><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window; w.console.warn = () => {};
w.eval(storeSrc); w.eval(engineSrc);
const st = w.FarmFitStore({ stamp: "t|R134" });
ok(typeof st.take === "function" && st.take("B|dress|x") === undefined, "a browser with no saved space: nothin' found");
st.keep("B|dress|x", false); ok(true, "...and keepin' one there doesn't throw");
setTimeout(() => {
  const s = st.stats();
  ok(s.ready && !s.on && /no saved space/.test(s.why), "...it says why it's off (" + s.why + ")");

  // ── what's learned goes out and comes back whole ──
  const mk = () => w.FarmBodyEngine({ S: { C: { Appearance: [] } }, bodyItem: () => null, setBody: () => {}, redraw: () => {} });
  const A = mk(), B = mk();
  const sp = { L: new w.Float32Array(2600).fill(1e9), R: new w.Float32Array(2600).fill(-1e9), v: 3, bottom: 812 };
  for (let y = 300; y < 420; y++) { sp.L[y] = 180 + (y % 7); sp.R[y] = 320 - (y % 5); }
  A.MOULD.span.set("p|Cloth/ChineseDress1", sp); A.MOULD.ext.set("Cloth/ChineseDress1", { top: 290, bottom: 812 }); A.MOULD.lies.add("Cloth/ChineseDress1");
  A.BREAST.holds = { "on:Cloth/ChineseDress1": true, "solid:Cloth/ChineseDress1": true }; A.BREAST.holdSig = "on:Cloth/ChineseDress1|solid:Cloth/ChineseDress1";
  A.BREAST.cover.set("w|Assets/Female3DCG/Cloth/ChineseDress1_XLarge.png|0,0", 0.62);
  A.MOULD.prof.set("Assets/Female3DCG/Cloth/ChineseDress1_XLarge.png", { L: new w.Int16Array([5, 6, -1]), R: new w.Int16Array([40, 41, -1]), w: 50, h: 3 });
  const L = A.learned();
  ok(B.learn(L) === true, "a new body learns what the last one did");
  const s2 = B.MOULD.span.get("p|Cloth/ChineseDress1");
  ok(s2 && s2.bottom === 812 && s2.L[300] === sp.L[300] && s2.R[419] === sp.R[419] && s2.L[299] > 1e8, "...how far each piece reaches, to the pixel");
  ok(B.MOULD.ext.get("Cloth/ChineseDress1").bottom === 812 && B.MOULD.lies.has("Cloth/ChineseDress1"), "...where it starts and ends, and that it lies on the belly");
  ok(B.BREAST.on["Cloth/ChineseDress1"] && B.BREAST.solid["Cloth/ChineseDress1"] && B.BREAST.holdSig === A.BREAST.holdSig, "...which pieces lie on her breasts, and which are solid over them");
  ok(B.BREAST.cover.get("w|Assets/Female3DCG/Cloth/ChineseDress1_XLarge.png|0,0") === 0.62 && B.MOULD.prof.get("Assets/Female3DCG/Cloth/ChineseDress1_XLarge.png").R[1] === 41, "...and what was measured off each picture");
  const before = B.learnedSig(); B.MOULD.lies.add("Bra/Bra2"); ok(B.learnedSig() !== before, "what it's learned has a fingerprint that changes when it learns more (so it's saved then, and not every half minute)");
  // a body that's learned its own breasts keeps them
  const C2 = mk(); C2.BREAST.holdSig = "on:Bra/Bra1"; C2.BREAST.holds = { "on:Bra/Bra1": true }; C2.learn(L);
  ok(C2.BREAST.holdSig === "on:Bra/Bra1", "...but a body that's already seen what's on its own breasts keeps that");
  ok(B.learn({ v: 2 }) === false && B.learn(null) === false, "somethin' it doesn't know the shape of is left alone");

  // ── the Companion: stamped with the drawing's own fingerprint and the game's version ──
  const comp = fs.readFileSync(path.join(ROOT, "dist/farmhand-companion.user.js"), "utf8");
  const stamp = /DRAWING_STAMP = (?:true \? )?"([0-9a-f]{12})"/.exec(comp);
  ok(!!stamp, "the Companion carries the drawing code's fingerprint (" + (stamp && stamp[1]) + ")");
  ok(/stamp: DRAWING_STAMP \+ "\|" \+ \w+\.GameVersion/.test(comp) && /FarmFitStore/.test(comp) && /Tag: "farmfits"/.test(comp), "...stamps its saved fits with the game's version too, and has /farmfits to see them and clear them");
  const build = fs.readFileSync(path.join(ROOT, "build.mjs"), "utf8");
  ok(["studio/web/body-engine.js", "studio/web/breasts-drawing.js", "studio/web/fit-store.js", "extension/src/belly.js"].every((f) => build.includes('"' + f + '"')), "the fingerprint is taken from every file that decides how a piece is fitted");
  out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
}, 300);
