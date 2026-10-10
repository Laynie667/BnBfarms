/* WHAT'S IN THIS FILE (vps/import-ledger.mjs)
   Puts a ledger exported from the PC bot (Tampermonkey menu → "Farmhand: export ledger", the file
   bnb-ledger-YYYY-MM-DD.json) into the server's store, so the farm's books move with the bot.
   Use:  node vps/import-ledger.mjs bnb-ledger-2026-10-09.json      (stop the bot first: sudo systemctl stop farmhand)
*/
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = process.env.FARMHAND_DATA || join(HERE, "data");
const STORE = join(DATA, "store.json");
const file = process.argv[2];
if (!file || !existsSync(file)) { console.error("Which file? node vps/import-ledger.mjs <bnb-ledger-….json>"); process.exit(1); }
let L;
try { L = JSON.parse(readFileSync(file, "utf8")); } catch (e) { console.error("That file isn't a ledger (not JSON):", e.message); process.exit(1); }
if (!L || typeof L !== "object" || !L.people) { console.error("That doesn't look like a farm ledger (no people in it)."); process.exit(1); }
mkdirSync(DATA, { recursive: true });
let store = {};
if (existsSync(STORE)) {
  store = JSON.parse(readFileSync(STORE, "utf8"));
  const keep = join(DATA, "store-before-import-" + Date.now() + ".json");
  copyFileSync(STORE, keep);
  console.log("The store that was there is kept as " + keep);
}
store.bnb_ledger_v1 = JSON.stringify(L);
writeFileSync(STORE, JSON.stringify(store));
const people = Object.values(L.people), onBooks = people.filter((p) => p && p.roles && p.roles.length).length;
console.log("Imported: " + people.length + " records (" + onBooks + " on the books), " + Object.keys(L.spots || {}).length + " spots, " +
  (L.applications || []).length + " applications waiting, " + Object.keys(L.mods || {}).length + " add-ons' data.");
console.log("Start the bot again: sudo systemctl start farmhand");
