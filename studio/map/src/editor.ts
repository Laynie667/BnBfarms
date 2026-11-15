/* WHAT'S IN THIS FILE (studio/map/src/editor.ts)
   The map studio's one source of truth: the layout being edited, its undo history, the tool in hand, what's picked from
   the palette, what's shown, what's selected. The screens (ui/) only show it and call its actions; every change goes
   through begin() first, so anything can be undone.
*/
import { MapModel, BLANK, N, standable } from "./game";
import { Layout, History, Pt, Stamp, PaintLayer, newLayout, clone, idx, brush, rectCells, floodCells, setCell, cut, clearRegion, stampAt, moveFarm, inMap } from "./model";
import { SPOT_KINDS } from "./farm";

export type Tool = "look" | "paint" | "fill" | "rect" | "erase" | "select" | "stamp" | "spot" | "zone";
export interface View {
  grid: boolean; coords: boolean; objects: boolean; effects: boolean; zones: boolean; labels: boolean;
  spots: Record<string, boolean>; walk: boolean; heat: boolean; glaze: boolean; sight: boolean;
}
export type Selected = { kind: "tile"; at: Pt } | { kind: "spot"; name: string } | { kind: "zone"; name: string } | null;

export class Editor {
  layout: Layout = newLayout("farm");
  history = new History();
  tool: Tool = "look";
  pick: { layer: PaintLayer; id: number } = { layer: "tiles", id: 215 };
  size = 1;
  view: View = { grid: true, coords: true, objects: true, effects: true, zones: true, labels: true,
    spots: Object.fromEntries(SPOT_KINDS.map((k) => [k.key, true])), walk: false, heat: false, glaze: false, sight: false };
  sel: { a: Pt; b: Pt } | null = null;
  selected: Selected = null;
  hover: Pt | null = null;
  clip: Stamp | null = null;
  stamps: Stamp[] = [];
  heat: Record<string, number> = {};
  unsaved = false;
  mapVer = 0;   // goes up when the map itself changes (the base picture is drawn again)
  ver = 0;      // goes up on any change at all (the screens draw again)
  message = "";
  private fns = new Set<() => void>();

  on(f: () => void): () => void { this.fns.add(f); return () => this.fns.delete(f); }
  emit(): void { this.ver++; for (const f of this.fns) f(); }
  say(text: string): void { this.message = text; this.emit(); }
  get map(): MapModel { return this.layout.map; }

  // ── changes ──
  begin(): void { this.history.push(this.layout); this.unsaved = true; }
  mapChanged(): void { this.mapVer++; this.emit(); }
  load(L: Layout, keepHistory = false): void { this.layout = L; if (!keepHistory) this.history.clear(); this.unsaved = false; this.sel = null; this.selected = null; this.mapChanged(); }
  undo(): void { const s = this.history.undo(this.layout); if (s) { this.layout = s; this.unsaved = true; this.mapChanged(); } }
  redo(): void { const s = this.history.redo(this.layout); if (s) { this.layout = s; this.unsaved = true; this.mapChanged(); } }

  // ── painting (a stroke: begin() once on mouse down, then these as the mouse moves) ──
  paintAt(p: Pt): void {
    if (!inMap(p.X, p.Y)) return;
    const id = this.tool === "erase" ? (this.pick.layer === "tiles" ? BLANK : this.pick.layer === "objects" ? BLANK : 10) : this.pick.id;
    for (const i of brush(p.X, p.Y, this.size)) setCell(this.map, this.pick.layer, i, id);
    this.mapChanged();
  }
  fillAt(p: Pt): void { if (!inMap(p.X, p.Y)) return; this.begin(); for (const i of floodCells(this.map, this.pick.layer, p.X, p.Y)) setCell(this.map, this.pick.layer, i, this.pick.id); this.mapChanged(); }
  fillRect(a: Pt, b: Pt): void { this.begin(); for (const i of rectCells(a, b)) setCell(this.map, this.pick.layer, i, this.pick.id); this.mapChanged(); }
  eyedrop(p: Pt): void {
    if (!inMap(p.X, p.Y)) return; const i = idx(p.X, p.Y);
    this.pick = this.pick.layer === "tiles" ? { layer: "tiles", id: this.map.tiles[i] } : this.pick.layer === "objects" ? { layer: "objects", id: this.map.objects[i] } : { layer: "effects", id: this.map.effects[i][0] || 10 };
    this.emit();
  }

  // ── regions ──
  private layersAll: PaintLayer[] = ["tiles", "objects", "effects"];
  copy(): void { if (!this.sel) return; this.clip = cut(this.map, this.sel.a, this.sel.b, this.layersAll); this.say("Copied " + this.clip.w + " × " + this.clip.h + ". Pick the stamp tool (or press V) and click where it goes."); }
  cutSel(): void { if (!this.sel) return; this.copy(); this.begin(); clearRegion(this.map, this.sel.a, this.sel.b, this.layersAll); this.mapChanged(); }
  clearSel(): void { if (!this.sel) return; this.begin(); clearRegion(this.map, this.sel.a, this.sel.b, ["objects", "effects"]); this.mapChanged(); }
  stampHere(p: Pt): void { if (!this.clip) { this.say("Nothing to stamp yet: select a block and copy it (Ctrl+C), or pick a saved stamp."); return; } this.begin(); stampAt(this.map, this.clip, p.X, p.Y); this.mapChanged(); }
  // move the selected block (map and the farm's spots and zones inside it) by dx,dy
  moveSel(dx: number, dy: number): void {
    if (!this.sel || (!dx && !dy)) return;
    const { a, b } = this.sel; this.begin();
    const s = cut(this.map, a, b, this.layersAll);
    clearRegion(this.map, a, b, this.layersAll);
    stampAt(this.map, s, Math.min(a.X, b.X) + dx, Math.min(a.Y, b.Y) + dy);
    moveFarm(this.layout.farm, a, b, dx, dy);
    this.sel = { a: { X: a.X + dx, Y: a.Y + dy }, b: { X: b.X + dx, Y: b.Y + dy } };
    this.mapChanged();
  }

  // ── the farm layer ──
  spotAt(p: Pt): string | null { for (const [n, s] of Object.entries(this.layout.farm.spots)) if (s.X === p.X && s.Y === p.Y) return n; return null; }
  addSpot(name: string, p: Pt): void { this.begin(); this.layout.farm.spots[name] = { X: p.X, Y: p.Y }; this.selected = { kind: "spot", name }; this.emit(); }
  moveSpot(name: string, p: Pt): void { const s = this.layout.farm.spots[name]; if (!s || !inMap(p.X, p.Y)) return; s.X = p.X; s.Y = p.Y; this.emit(); }
  renameSpot(from: string, to: string): void { const f = this.layout.farm.spots; if (!f[from] || !to || f[to]) return; this.begin(); f[to] = f[from]; delete f[from]; this.selected = { kind: "spot", name: to }; this.emit(); }
  deleteSpot(name: string): void { this.begin(); delete this.layout.farm.spots[name]; if (this.selected && this.selected.kind === "spot" && this.selected.name === name) this.selected = null; this.emit(); }
  // (a zone's group is its own name when it's a place of its own, the way the bot writes them: the bot throws away
  // every zone at once if one comes without a group)
  addZone(name: string, a: Pt, b: Pt, group?: string): void { this.begin(); this.layout.farm.zones[name] = { a: { ...a }, b: { ...b }, group: group || name }; this.selected = { kind: "zone", name }; this.emit(); }
  zoneAt(p: Pt): string | null {
    for (const [n, z] of Object.entries(this.layout.farm.zones)) if (z.a && z.b && p.X >= Math.min(z.a.X, z.b.X) && p.X <= Math.max(z.a.X, z.b.X) && p.Y >= Math.min(z.a.Y, z.b.Y) && p.Y <= Math.max(z.a.Y, z.b.Y)) return n;
    return null;
  }
  renameZone(from: string, to: string, group?: string): void {
    const z = this.layout.farm.zones; if (!z[from] || !to || (to !== from && z[to])) return; this.begin();
    const v = z[from]; delete z[from]; v.group = group || to; z[to] = v; this.selected = { kind: "zone", name: to }; this.emit();
  }
  deleteZone(name: string): void { this.begin(); delete this.layout.farm.zones[name]; if (this.selected && this.selected.kind === "zone" && this.selected.name === name) this.selected = null; this.emit(); }

  // a copy of the map with what's hidden taken out (furniture, lighting), for the picture
  viewModel(): MapModel {
    if (this.view.objects && this.view.effects) return this.map;
    const m = clone(this.map);
    if (!this.view.objects) m.objects = new Array(N).fill(BLANK);
    if (!this.view.effects) m.effects = Array.from({ length: N }, () => []);
    return m;
  }
  standable(p: Pt): boolean { return standable(this.map, idx(p.X, p.Y)); }
}
export const ed = new Editor();
