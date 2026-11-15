/* WHAT'S IN THIS FILE (studio/map/src/model.ts)
   What the map studio edits: a LAYOUT is a whole farm as it stands for one occasion (the everyday farm, a race day, a
   trap maze…): the room's map (tiles, furniture, lighting) plus the farm's own layer on top (the bot's spots and zones).
   Swapping layouts for an event = paste its map with /mappaste, then ?layout <name> so the bot's spots and zones match.
   Here: layouts, the farm layer, regions and stamps (copy, paste, move a block of the map), flood fill, and undo.
*/
import { MapModel, N, W, H, BLANK, emptyModel } from "./game";

export interface Pt { X: number; Y: number }
export interface Zone { a?: Pt; b?: Pt; group?: string }
export interface FarmLayer { spots: Record<string, Pt>; zones: Record<string, Zone> }
export interface Tint { color: string; alpha: number }
export interface Layout {
  v: 1;
  name: string;
  notes: string;
  map: MapModel;
  farm: FarmLayer;
  tints: Record<string, Tint>;   // the soft glaze over each kind of spot (a design for the Companion to draw later)
  savedAt?: string;
}
export const idx = (x: number, y: number): number => x + y * W;
export const xy = (i: number): Pt => ({ X: i % W, Y: Math.floor(i / W) });
export const inMap = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < W && y < H;
export const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o));

export function newLayout(name: string): Layout {
  return { v: 1, name, notes: "", map: emptyModel(), farm: { spots: {}, zones: {} }, tints: {} };
}
// a layout from the server, mended where it's missing bits (an older save, a hand edit)
export function mendLayout(raw: any, name: string): Layout {
  const L = newLayout(String(raw && raw.name || name));
  if (!raw || typeof raw !== "object") return L;
  L.notes = String(raw.notes || "");
  const m = raw.map;
  if (m && Array.isArray(m.tiles) && m.tiles.length === N && Array.isArray(m.objects) && m.objects.length === N) {
    L.map = { tiles: m.tiles.map(Number), objects: m.objects.map(Number),
      effects: Array.isArray(m.effects) && m.effects.length === N ? m.effects.map((l: any) => (Array.isArray(l) ? l.map(Number) : [])) : L.map.effects,
      cells: m.cells && typeof m.cells === "object" ? m.cells : {}, fog: !!m.fog };
  }
  if (raw.farm && typeof raw.farm === "object") {
    for (const [k, p] of Object.entries(raw.farm.spots || {})) if (p && typeof (p as Pt).X === "number") L.farm.spots[k] = { X: (p as Pt).X, Y: (p as Pt).Y };
    for (const [k, z] of Object.entries(raw.farm.zones || {})) if (z && typeof z === "object") L.farm.zones[k] = Object.assign(clone(z as Zone), { group: (z as Zone).group || k });
  }
  if (raw.tints && typeof raw.tints === "object") L.tints = clone(raw.tints);
  L.savedAt = raw.savedAt;
  return L;
}

// ── the layers you paint on ──
export type PaintLayer = "tiles" | "objects" | "effects";
export function getCell(m: MapModel, layer: PaintLayer, i: number): string {
  return layer === "effects" ? m.effects[i].slice().sort().join(",") : String(m[layer][i]);
}
export function setCell(m: MapModel, layer: PaintLayer, i: number, id: number, replaceEffects = true): void {
  if (layer === "tiles") m.tiles[i] = id;
  else if (layer === "objects") m.objects[i] = id;
  else if (id === 10 || id === 0) m.effects[i] = [];
  else if (replaceEffects) m.effects[i] = [id];
  else if (!m.effects[i].includes(id)) m.effects[i] = m.effects[i].concat(id);
}
// the squares a brush of this size covers, centred on x,y
export function brush(x: number, y: number, size: number): number[] {
  const r = Math.floor(size / 2), out: number[] = [];
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (inMap(x + dx, y + dy)) out.push(idx(x + dx, y + dy));
  return out;
}
export function rectCells(a: Pt, b: Pt): number[] {
  const out: number[] = [];
  for (let y = Math.min(a.Y, b.Y); y <= Math.max(a.Y, b.Y); y++) for (let x = Math.min(a.X, b.X); x <= Math.max(a.X, b.X); x++) if (inMap(x, y)) out.push(idx(x, y));
  return out;
}
// every square joined to x,y (up, down, left, right) that holds the same thing on this layer
export function floodCells(m: MapModel, layer: PaintLayer, x: number, y: number): number[] {
  const start = idx(x, y), want = getCell(m, layer, start), seen = new Uint8Array(N), out: number[] = [], stack = [start];
  while (stack.length) {
    const i = stack.pop()!; if (seen[i]) continue; seen[i] = 1;
    if (getCell(m, layer, i) !== want) continue;
    out.push(i);
    const p = xy(i);
    if (p.X > 0) stack.push(i - 1); if (p.X < W - 1) stack.push(i + 1); if (p.Y > 0) stack.push(i - W); if (p.Y < H - 1) stack.push(i + W);
  }
  return out;
}

// ── regions and stamps: a block of the map, lifted and put down elsewhere ──
export interface Stamp { name?: string; w: number; h: number; tiles?: number[]; objects?: number[]; effects?: number[][] }
export function cut(m: MapModel, a: Pt, b: Pt, layers: PaintLayer[]): Stamp {
  const x0 = Math.min(a.X, b.X), y0 = Math.min(a.Y, b.Y), w = Math.abs(a.X - b.X) + 1, h = Math.abs(a.Y - b.Y) + 1;
  const s: Stamp = { w, h };
  for (const L of layers) {
    const arr: any[] = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = idx(x0 + x, y0 + y); arr.push(L === "effects" ? m.effects[i].slice() : m[L][i]); }
    (s as any)[L] = arr;
  }
  return s;
}
export function clearRegion(m: MapModel, a: Pt, b: Pt, layers: PaintLayer[], floor = BLANK): void {
  for (const i of rectCells(a, b)) for (const L of layers) {
    if (L === "tiles") m.tiles[i] = floor; else if (L === "objects") m.objects[i] = BLANK; else m.effects[i] = [];
  }
}
export function stampAt(m: MapModel, s: Stamp, x0: number, y0: number): void {
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
    if (!inMap(x0 + x, y0 + y)) continue;
    const i = idx(x0 + x, y0 + y), k = x + y * s.w;
    if (s.tiles) m.tiles[i] = s.tiles[k];
    if (s.objects) m.objects[i] = s.objects[k];
    if (s.effects) m.effects[i] = s.effects[k].slice();
  }
}
// the farm layer moves with a block that's moved: spots and zone corners inside it go along
export function moveFarm(f: FarmLayer, a: Pt, b: Pt, dx: number, dy: number): void {
  const inside = (p?: Pt) => !!p && p.X >= Math.min(a.X, b.X) && p.X <= Math.max(a.X, b.X) && p.Y >= Math.min(a.Y, b.Y) && p.Y <= Math.max(a.Y, b.Y);
  for (const p of Object.values(f.spots)) if (inside(p)) { p.X += dx; p.Y += dy; }
  for (const z of Object.values(f.zones)) for (const c of [z.a, z.b]) if (inside(c)) { c!.X += dx; c!.Y += dy; }
}

// ── undo: whole snapshots of the layout (a farm is small: a few kilobytes each) ──
export class History {
  private back: string[] = []; private fwd: string[] = [];
  constructor(private max = 200) {}
  push(state: Layout): void { this.back.push(JSON.stringify(state)); if (this.back.length > this.max) this.back.shift(); this.fwd = []; }
  undo(now: Layout): Layout | null { const s = this.back.pop(); if (!s) return null; this.fwd.push(JSON.stringify(now)); return JSON.parse(s); }
  redo(now: Layout): Layout | null { const s = this.fwd.pop(); if (!s) return null; this.back.push(JSON.stringify(now)); return JSON.parse(s); }
  get canUndo(): boolean { return this.back.length > 0; }
  get canRedo(): boolean { return this.fwd.length > 0; }
  clear(): void { this.back = []; this.fwd = []; }
}
