// Bakes the farm's look for the drawn body INTO the Companion (Laynie, Oct 26: "routing the settings from my pc to all
// the companions ... is bogging down my connection ... would building them into the companion instead be feasible").
// Reads what the studio's Save buttons saved (studio/fits/breasts.json, belly.json, items.json, brand.json if there are) and
// writes shared/farm-look.json, which the Companion is built with. Change the look in the studio, Save, run this,
// release the Companion: everybody's Companion updates with it, and nothing goes over the room at all.
//   node tools/farm-look-bake.mjs [fits folder]
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FITS = process.argv[2] || join(ROOT, "studio", "fits");
const get = async (f) => { try { return JSON.parse(await readFile(join(FITS, f), "utf8")); } catch (e) { return null; } };
const [br, be, it, bd] = await Promise.all([get("breasts.json"), get("belly.json"), get("items.json"), get("brand.json")]);
if (!br) { console.error("No studio/fits/breasts.json: Save the breasts in the studio first (or name the fits folder)."); process.exit(1); }
const body = { cup: typeof br.cup === "number" ? br.cup : 12, breast: {}, wear: br.wear || {}, belly: (be && be.fits) || null,
  auto: true, tuck: br.tuck !== false, dress: br.dress !== false, mould: it ? { items: it.mould || [], mode: it.mouldMode || {} } : { items: [], mode: {} } };
for (const k of ["full", "hang", "apart", "x", "y", "nip", "nipY", "nipX"]) if (typeof br[k] === "number") body.breast[k] = br[k];
const id = createHash("sha1").update(JSON.stringify(body)).digest("hex").slice(0, 8);
const saved = [br.saved, be && be.saved, it && it.saved, bd && bd.saved].filter(Boolean).sort().pop() || new Date().toISOString();
// the farm's brand as the studio placed it (Oct 29): its art, look, size and each spot's own size and nudge
const brand = bd && typeof bd === "object" ? { art: bd.art === "full" ? "full" : "mark", look: bd.look || "seared", size: bd.size || 46, places: bd.places || {} } : undefined;
await writeFile(join(ROOT, "shared", "farm-look.json"), JSON.stringify(brand ? { id, saved, body, brand } : { id, saved, body }, null, 1) + "\n");
console.log("✅ farm look " + id + " (saved " + saved + ") → shared/farm-look.json. Release the Companion to hand it out.");
