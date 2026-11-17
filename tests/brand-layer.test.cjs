// Nov 17: the farm's brand (and the messes) go on the skin, under what's worn. Laynie: the brand "renders over a lot of
// things and clothes". Two things held it late: the drawn body's fitted pieces (a bra or top over the drawn breasts) are
// handed to the game as drawings, and weren't seen as worn; and it waited for every skin picture the last drawing had,
// so arms drawn in front after the clothes held it back. Where it goes in, for a list of what the game draws:
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window;
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
w.CurrentScreen = "ChatRoom"; w.Player = { MemberNumber: 600, Name: "Hana" }; w.ChatRoomCharacter = []; w.ServerSend = () => {}; w.ChatRoomMessage = () => {};
w.eval(src);
const at = w.__farmMessLayAt;
const A = (g, f) => "Assets/Female3DCG/" + g + "/" + (f || "Normal.png");
const U = A("BodyUpper", "Small.png"), Lo = A("BodyLower", "Normal.png"), ARM = A("BodyUpper", "ArmsFront.png"), HANDS = A("Hands", "Normal.png");
const drawn = (from) => ({ __farmFrom: from });   // one of the drawn body's drawings, sayin' what it is

ok(typeof at === "function", "the Companion can say where the brand goes in");
// the drawn body: breasts (skin), then a fitted bra over them (a drawing standin' in for the game's Bra picture)
ok(at([U, Lo, drawn("skin"), drawn(A("Bra")), A("Cloth"), ARM], [U, Lo, ARM]) === 3, "with the drawn body: under the fitted bra over the drawn breasts (it used to land on top of it)");
// arms drawn in front, after the clothes: the brand goes under the clothes all the same
ok(at([U, Lo, A("Panties"), A("Cloth"), ARM, HANDS], [U, Lo, ARM, HANDS]) === 2, "arms drawn after the clothes don't hold it back: under the panties");
ok(at([U, Lo, drawn("skin"), drawn("skin"), A("Cloth")], [U, Lo]) === 4, "the drawn belly and breasts are skin: it goes on top of them, under the dress");
ok(at([A("TailStraps"), A("Wings"), U, Lo, A("Socks")], [U, Lo]) === 4, "a tail or wings drawn behind the body don't count: under the socks");
ok(at([U, A("Necklace"), Lo, A("Panties")], [U, Lo]) === 3, "it waits for the lower body too: under the panties, not before the hips are drawn");
ok(at([U, A("Bra")], []) === 1, "the very first drawing: under the first thing worn after the torso");
ok(at([U, Lo, A("HairFront"), A("Eyes"), A("Mouth")], [U, Lo]) === 5, "naked: nothing worn, so it's the last thing drawn");
out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
