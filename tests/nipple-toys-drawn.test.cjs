// THE NIPPLE TOYS ON THE DRAWN BREASTS (Nov 20). Laynie: "the toys are on layer 22, the breast are layer 49, the toys dont
// match or follow where the nipple is". The toys' pictures come from the repo (…/toys/v1/ItemNipples/…), and the drawn
// body only knew a picture's slot from the game's own folders (Assets/Female3DCG/<slot>/). So a toy wasn't seen as
// nipple gear (never moved onto her drawn nipples), wasn't seen as worn (the drawn breasts waited for the next worn piece
// and went on over it), and, from another site, couldn't be read to find its nipples without leave to read it.
const fs = require("fs"), path = require("path"), vm = require("vm");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ROOT = path.join(__dirname, "..");
const TOY = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/toys/v1/ItemNipples/FarmNipDildo_XLarge_Toy.png";
const A = (g, f) => "Assets/Female3DCG/" + g + "/" + (f || "Normal.png");

// ── the belly drawing block (the same block the studio lifts out): its slot reader and the skin gate ──
const belly = fs.readFileSync(path.join(ROOT, "extension/src/belly.js"), "utf8");
const a = belly.indexOf("// >>> belly drawing"), b = belly.indexOf("// <<< belly drawing");
const sb = {}; vm.runInNewContext(belly.slice(a, b) + "\nthis.skinGate = skinGate; this.SLOT_SRC = SLOT_SRC;", sb);
const slotOf = (src) => { const m = new RegExp(sb.SLOT_SRC).exec(src); return m ? m[1] : ""; };
ok(slotOf(TOY) === "ItemNipples", "a toy from the repo: its slot is the nipples");
ok(slotOf(A("ItemNipples", "NippleClamp_XLarge.png")) === "ItemNipples" && slotOf("Assets/Female3DCG/Override/EchoV2/Pussy/Pussy1.png") === "Pussy" && slotOf("https://example.com/whatever.png") === "",
  "...the game's own pictures and a body style's read as ever, and somethin' else isn't guessed at");
const L = (g) => ({ Asset: { Group: { Name: g } } });
const gate = sb.skinGate({ AppearanceLayers: [L("BodyUpper"), L("BodyLower"), L("Nipples"), L("Pussy"), L("ItemNipples"), L("HairFront")] });
const seen = [A("BodyUpper"), A("BodyLower"), A("Nipples"), A("Pussy"), TOY].map((s) => gate(s));
ok(seen.slice(0, 4).every((v) => v === false) && seen[4] === true, "bare but for a toy: the toy is the first thing worn, so the drawn breasts go on just before it, not over it (" + seen.join(",") + ")");

// ── the body engine reads slots the same way ──
const engine = fs.readFileSync(path.join(ROOT, "studio/web/body-engine.js"), "utf8");
const eSlot = /const SLOT_SRC = "([^"]+)";/.exec(engine), bSlot = /const SLOT_SRC = "([^"]+)";/.exec(belly);
ok(eSlot && bSlot && eSlot[1] === bSlot[1], "the body engine and the Companion's belly read a picture's slot the same way");
ok(!/new RegExp\("\(\?:\^\|\/\)Assets/.test(engine), "...and nowhere in the engine still reads only the game's folders");

// ── a picture from another site is asked for with leave to read it ──
const dom = new JSDOM("<!doctype html><html><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window; w.console.warn = () => {};
w.eval(engine);
const E = w.FarmBodyEngine({ S: { C: { Appearance: [] } }, bodyItem: () => null, setBody: () => {}, redraw: () => {} });
E.mouldImg(TOY); E.mouldImg(A("ItemNipples", "NippleClamp_XLarge.png"));
const imgOf = (s) => E.MOULD.img.get(s).img;
ok(imgOf(TOY).crossOrigin === "anonymous", "a toy's picture from the repo: fetched with leave to read it (so its nipples can be found and it can be moved)");
ok(!imgOf(A("ItemNipples", "NippleClamp_XLarge.png")).crossOrigin, "...the game's own pictures, from the game's own site, as ever");
out(fails ? "\n❌ " + fails + " failed" : "\n✅ all good"); process.exit(fails ? 1 : 0);
