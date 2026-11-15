/* WHAT'S IN THIS FILE (studio/map/src/farm.ts)
   The farm's own layer: what each spot is (by its name, the way the bot reads them), its colour and soft glaze, and the
   checks that catch a mistake before the bot ever sees it: a spot nobody can stand on, a zone missing a corner, a glory
   hole without its visitor side, two spots on one tile.
*/
import { MapModel, standable, W, H } from "./game";
import { FarmLayer, Tint, Pt, idx } from "./model";

export interface SpotKind { key: string; label: string; color: string; secret?: boolean; test: (name: string) => boolean }
// in order: the first that matches a spot's name is its kind
export const SPOT_KINDS: SpotKind[] = [
  { key: "trap", label: "Traps", color: "#e0567a", secret: true, test: (n) => n.startsWith("trap-") },
  { key: "water", label: "Water", color: "#4aa3e8", test: (n) => /^(water-|pond|pool|creek|well|bath|shower)/.test(n) },
  { key: "feed", label: "Troughs and feed", color: "#e8a33d", test: (n) => /^(trough|feed|hay)/.test(n) },
  { key: "milking", label: "Milking", color: "#f1e3c4", test: (n) => /^(milking|milkstall|pump)/.test(n) },
  { key: "glory", label: "Glory stalls", color: "#a36be0", test: (n) => n.startsWith("glory-") },
  { key: "pen", label: "Stocks, pens and benches", color: "#a07850", test: (n) => /^(stocks|pen|bench|use-bench|cage|kennel|corral)/.test(n) },
  { key: "nest", label: "Nests and birthing", color: "#d8b04a", test: (n) => /^(nest|farrow|birth|calv|foal|whelp|lamb)/.test(n) },
  { key: "safe", label: "Home, safe and staff", color: "#5fbf7a", test: (n) => /^(home|safe|staff|rescue|office|entry|exit)/.test(n) },
  { key: "other", label: "Everything else", color: "#9aa3b2", test: () => true },
];
export const kindOf = (name: string): SpotKind => SPOT_KINDS.find((k) => k.test(name))!;
export const DEFAULT_TINTS: Record<string, Tint> = Object.fromEntries(SPOT_KINDS.map((k) => [k.key, { color: k.color, alpha: 0.12 }]));
export const tintFor = (tints: Record<string, Tint>, key: string): Tint => tints[key] || DEFAULT_TINTS[key];

// a zone's colour: steady for its name (its group's, so an L-shaped barn is one colour)
export function zoneColor(name: string): string {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return "hsl(" + (h % 360) + " 70% 60%)";
}

export interface Warning { level: "bad" | "note"; text: string; at?: Pt }
export function checkFarm(m: MapModel, f: FarmLayer): Warning[] {
  const out: Warning[] = [], seen = new Map<number, string>();
  for (const [name, p] of Object.entries(f.spots)) {
    if (p.X < 0 || p.Y < 0 || p.X >= W || p.Y >= H) { out.push({ level: "bad", text: name + " is off the map (" + p.X + "," + p.Y + ")" }); continue; }
    const i = idx(p.X, p.Y);
    if (!standable(m, i)) out.push({ level: "bad", text: name + " is on a square nobody can stand on (" + p.X + "," + p.Y + ")", at: p });
    if (seen.has(i)) out.push({ level: "note", text: name + " and " + seen.get(i) + " share " + p.X + "," + p.Y, at: p }); else seen.set(i, name);
    const g = name.match(/^glory-(\d+)$/); if (g && !f.spots["glory-" + g[1] + "-visitor"]) out.push({ level: "note", text: name + " has no visitor side (glory-" + g[1] + "-visitor)", at: p });
  }
  for (const [name, z] of Object.entries(f.zones)) {
    if (!z.a || !z.b) out.push({ level: "bad", text: "zone " + name + " is missing its " + (!z.a ? "A" : "B") + " corner" });
  }
  return out;
}
