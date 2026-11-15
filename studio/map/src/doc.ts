/* WHAT'S IN THIS FILE (studio/map/src/doc.ts)
   docs/farm-map-decoded.txt, written from the studio (it used to take a console one-liner on the bot's PC and a script).
   Same sections as before, plus the zones. ⚠️ That page is on GitHub, which anybody can read: no trap spot is ever
   written into it (a trap you can look up isn't a trap).
*/
import { MapModel, N, W, H, tileOf, objectOf, doodadName, BLANK } from "./game";
import { FarmLayer, xy, idx } from "./model";
import { kindOf } from "./farm";

const nm = (d: any): string => (d ? (d.Name || d.Style) + " [" + d.Type + "]" : "?");
export function decodedText(m: MapModel, f: FarmLayer, layoutName: string): string {
  const out: string[] = [];
  const count = (arr: number[]) => { const c = new Map<number, number>(); for (const id of arr) c.set(id, (c.get(id) || 0) + 1); return [...c].sort((a, b) => a[0] - b[0]); };
  out.push("(Written by the B&B map studio from the layout \"" + layoutName + "\", " + new Date().toISOString().slice(0, 10) + ". Trap spots are never listed here.)", "");
  out.push("TILES"); for (const [id, n] of count(m.tiles)) out.push("  " + id + " ×" + n + " " + nm(tileOf(id)));
  out.push("", "OBJECTS"); for (const [id, n] of count(m.objects)) out.push("  " + id + " ×" + n + " " + nm(objectOf(id)));
  out.push("", "OBJECT PLACES");
  for (let i = 0; i < N; i++) if (m.objects[i] !== BLANK) { const o = objectOf(m.objects[i]); if (o && o.Style !== "Blank") { const p = xy(i); out.push("  " + p.X + "," + p.Y + " " + (o.Style) + " [" + o.Type + "]"); } }
  out.push("", "SPOTS");
  for (const [name, p] of Object.entries(f.spots).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (kindOf(name).secret) continue;
    out.push("  " + name + " @" + p.X + "," + p.Y + ": " + nm(tileOf(m.tiles[idx(p.X, p.Y)])));
  }
  out.push("", "ZONES");
  for (const [name, z] of Object.entries(f.zones).sort((a, b) => a[0].localeCompare(b[0])))
    out.push("  " + name + (z.group && z.group !== name ? " (part of " + z.group + ")" : "") + ": " + (z.a ? z.a.X + "," + z.a.Y : "?") + " → " + (z.b ? z.b.X + "," + z.b.Y : "?"));
  // the picture: a letter for each kind of tile, * where there's furniture
  const letters = new Map<number, string>(), ABC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  out.push("", "PICTURE (* = furniture)", "   " + Array.from({ length: W }, (_, x) => String(x % 10)).join(""));
  for (let y = 0; y < H; y++) {
    let row = "";
    for (let x = 0; x < W; x++) {
      const i = idx(x, y), o = objectOf(m.objects[i]);
      if (m.objects[i] !== BLANK && o && o.Style !== "Blank") { row += "*"; continue; }
      if (!letters.has(m.tiles[i])) letters.set(m.tiles[i], ABC[letters.size] || "?");
      row += letters.get(m.tiles[i]);
    }
    out.push(String(y).padStart(2) + " " + row);
  }
  out.push("", "LEGEND"); for (const [id, l] of letters) { const t = tileOf(id); out.push("  " + l + " " + (t ? t.Type + "/" + (t.Name || t.Style) : String(id))); }
  return out.join("\n") + "\n";
}
export { doodadName };
