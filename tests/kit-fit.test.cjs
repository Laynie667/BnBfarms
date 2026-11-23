// THE WILD KITS ON A DRAWN BODY (Nov 21). Laynie: the kits "dont size correctly with the tits and bellies in game".
// Two things were wrong, neither of them the drawn breasts' fault:
//   • furniture was fitted like cloth: the inspection frame's steel side bars bent round her breasts. Furniture is drawn
//     straight now, in front of her; what wraps her body (a vac bed, a sack, a body bag, a net) still takes her shape.
//   • the pasture kit put the Full Body Leather Harness (the game counts it as an ARM restraint: elbows pinned behind)
//     beside the yoke (arms up). The game can't do both, so it did neither: no arms, the hooves floatin' under her tits.
//     So no kit may ask for two different arm poses.
const fs = require("fs"), path = require("path"), vm = require("vm");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ROOT = path.join(__dirname, "..");

// ── furniture stays straight (studio/web/body-engine.js, rigidSrc) ──
const engine = fs.readFileSync(path.join(ROOT, "studio/web/body-engine.js"), "utf8");
const pick = (re) => { const m = re.exec(engine); return m ? m[0] : ""; };
const code = pick(/const SLOT_SRC = "[^"]+";/) + "\n" + pick(/  const WRAPS = .+;/) + "\n" + pick(/  const rigidSrc = .+;/) + "\nthis.rigidSrc = rigidSrc;";
const sb = {}; vm.runInNewContext(code, sb);
ok(typeof sb.rigidSrc === "function", "the drawn body knows furniture from what's worn");
const A = (g, f) => "https://www.bondageprojects.elementfx.com/R134/BondageClub/Assets/Female3DCG/" + g + "/" + f;
const rigid = ["TheDisplayFrame.png", "WoodenStocks_Frame.png", "Trolley_typed0_Main.png", "WoodenHorse.png", "Kennel_Door.png", "WoodenBoxOpenHead_Box.png", "XFrame.png", "Locker.png"];
const wraps = ["VacBedDeluxe_Frame.png", "VacBedDeluxe_XLarge_ArmsDown.png", "Vacbed_Latex.png", "VacbedClear.png", "VacCube.png", "InflatableBodyBag.png", "FurBlanketWrap.png", "Net_Net.png", "BurlapSack.png", "Cement.png"];
ok(rigid.every((f) => sb.rigidSrc(A("ItemDevices", f))), "frames, stocks, the hand truck, the horse, cages and crates are drawn straight, not bent round her");
ok(wraps.every((f) => !sb.rigidSrc(A("ItemDevices", f))), "...a vac bed, a body bag, the fur wrap, a net, a sack or cement still takes her shape");
ok(!sb.rigidSrc(A("ItemArms", "HighSecurityStraitJacket_XLarge_StrapsLoose.png")) && !sb.rigidSrc(A("ItemTorso", "LeatherHarness_XLarge.png")) && !sb.rigidSrc(A("Cloth", "TShirt1_XLarge.png")),
  "...and everything that isn't furniture is fitted as ever");
ok(sb.rigidSrc("Assets/Female3DCG/ItemDevices/TheDisplayFrame.png") && !sb.rigidSrc(null) && !sb.rigidSrc("https://example.com/TheDisplayFrame.png"), "...from the studio's own copy too, and nothin' guessed at");
// the three places it's kept straight: not grown to the belly, not chest-fitted, not shaded as cloth over the belly
ok(/if \(rigidSrc\(src\)\) return false;/.test(engine) && /!isMoulded\(src\) && !rigidSrc\(src\)/.test(engine) && /gname2 !== "Panties" && !rigidSrc\(src\)/.test(engine),
  "...not grown to her belly, not fitted to her tits, not shaded like cloth");

// ── no kit asks for two arm poses ──
const src = fs.readFileSync(path.join(ROOT, "bot/src/parts/traps/10z8b-wild-kits.js"), "utf8");
const kb = {}; vm.runInNewContext(src + "\nthis.K = WILD_KITS;", kb);
// the game's own SetPose for the upper body, for the items the farm's kits use (R134 Female3DCG.js). On the arms:
const ARM_POSE = {
  HempRope: "BackBoxTie", DuctTape: "BackElbowTouch", LeatherArmbinder: "BackElbowTouch", ArmbinderJacket: "BackElbowTouch", StraitJacket: "BackElbowTouch",
  BitchSuit: "BackElbowTouch", BoxTieArmbinder: "BackElbowTouch", HighSecurityStraitJacket: "BackElbowTouch", StrictLeatherPetCrawler: "BackElbowTouch",
  SeamlessLatexArmbinder: "BackElbowTouch", LatexArmbinder: "BackElbowTouch", Yoke: "Yoked", HeavyYoke: "Yoked",
};
// and the ones that take her arms from any other spot (the same rope or tape on her legs or mouth doesn't)
const ANY_SLOT_POSE = { FullBodyLeatherHarness: "BackElbowTouch", TheDisplayFrame: "BackElbowTouch", Vacbed: "Yoked", VacBedDeluxe: "BaseUpper" };
const kits = Object.entries(kb.K).flatMap(([area, ks]) => ks.map((k) => [area, k]));
ok(kits.length >= 13, "every wild kit is checked (" + kits.length + ")");
const fights = [];
for (const [area, k] of kits) {
  const want = {};
  for (const p of k.pieces) { const n = (p.items || [])[0], pose = ANY_SLOT_POSE[n] || (p.slot === "arms" ? ARM_POSE[n] : null); if (pose) (want[pose] = want[pose] || []).push(p.slot + ":" + n); }
  if (Object.keys(want).length > 1) fights.push(area + ": " + k.name + " (" + Object.entries(want).map(([pz, ns]) => ns.join("+") + " wants " + pz).join(", ") + ")");
}
ok(!fights.length, "no kit puts two things on that want her arms in different poses" + (fights.length ? ": " + fights.join("; ") : ""));
const pasture = kits.find(([, k]) => k.name === "Put Out to Pasture")[1];
ok(pasture.pieces.find((p) => p.slot === "torso").items[0] === "LeatherHarness" && pasture.pieces.find((p) => p.slot === "arms").items[0] === "Yoke",
  "the pasture pony: a plain harness on her body, and the yoke has her arms");

out(fails ? "FAIL " + fails : "ALL OK"); process.exit(fails ? 1 : 0);
