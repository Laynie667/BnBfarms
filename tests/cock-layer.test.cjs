// A FUTA'S COCK LAYERED ABOVE THE CLOTHES (Nov 23). Nadine's #55: "as a futa: having my cock layered above clothes makes
// my expanded chest peak out of them as well, as if they are sharing the same layering levels. layering the cock
// underneath any dress or wearing underwear fixes it". The drawn belly and breasts go on after the last of the skin, and
// the genitals counted as skin: layered above the clothes, they held it all back till after the clothes, over them.
const fs = require("fs"), path = require("path"), vm = require("vm");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ROOT = path.join(__dirname, "..");
const belly = fs.readFileSync(path.join(ROOT, "extension/src/belly.js"), "utf8");
const a = belly.indexOf("// >>> belly drawing"), b = belly.indexOf("// <<< belly drawing");
const sb = {}; vm.runInNewContext(belly.slice(a, b) + "\nthis.skinGate = skinGate;", sb);
const L = (g, clothing, cat) => ({ Asset: { Group: { Name: g, Clothing: !!clothing, Category: cat || (clothing ? "Appearance" : "Appearance") } } });
const A = (g, f) => "Assets/Female3DCG/" + g + "/" + (f || "Normal.png");
// as the game usually layers it: the cock with the body, under the clothes
let gate = sb.skinGate({ AppearanceLayers: [L("BodyUpper"), L("BodyLower"), L("Pussy"), L("Cloth", true), L("HairFront")] });
let seen = [A("BodyUpper"), A("BodyLower"), A("Pussy", "Penis/Hard/Penis.png"), A("Cloth", "Dress.png")].map((s) => gate(s));
ok(JSON.stringify(seen) === "[false,false,false,true]", "the cock with the body: the belly and breasts go on after it, before the dress (" + seen.join(",") + ")");
// layered above the clothes with the game's own layering: it doesn't hold the skin back
gate = sb.skinGate({ AppearanceLayers: [L("BodyUpper"), L("BodyLower"), L("Cloth", true), L("Pussy"), L("HairFront")] });
seen = [A("BodyUpper"), A("BodyLower"), A("Cloth", "Dress.png"), A("Pussy", "Penis/Hard/Penis.png")].map((s) => gate(s));
ok(seen[2] === true, "the cock layered above the dress: the belly and breasts still go on before the dress, under it (" + seen.join(",") + ")");
// a restraint first, the cock after it: the same
gate = sb.skinGate({ AppearanceLayers: [L("BodyUpper"), L("BodyLower"), L("ItemTorso", false, "Item"), L("Pussy")] });
seen = [A("BodyUpper"), A("BodyLower"), A("ItemTorso", "Harness.png"), A("Pussy", "Penis/Hard/Penis.png")].map((s) => gate(s));
ok(seen[2] === true, "...above a harness too (" + seen.join(",") + ")");
// and the engine draws a hard cock that comes after that right where the game put it, instead of holdin' it for a belly that's already on
const engine = fs.readFileSync(path.join(ROOT, "studio/web/body-engine.js"), "utf8");
ok(/if \(hard && !done\) \{ if \(!blink\) ctx\.cock = /.test(engine), "the engine draws a late hard cock in its place, over the dress, not lost");
out(fails ? "FAIL " + fails : "ALL OK"); process.exit(fails ? 1 : 0);
