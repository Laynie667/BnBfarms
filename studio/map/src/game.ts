/* WHAT'S IN THIS FILE (studio/map/src/game.ts)
   The game's own map code, used as it is. The map studio runs on top of the game's own page (studio/server.mjs serves
   it from this computer, signed in to nothing), so the tile and furniture catalogue, the /mapcopy and /mappaste strings
   and the drawing are exactly the game's: whatever the studio makes pastes straight into the farm room.

   ⚠️ Some of the game's globals are declared with let/const (MainCanvas, MapDataTiles…), so they are NOT on window.
   They're reached here by their bare names (the declarations below), never as window.Something.
*/
export const W = 40, H = 40, N = W * H;
export const BLANK = 100;          // the game's empty tile and empty object
export const BLANK_EFFECT = 10;    // the game's "no lighting" effect

export interface Doodad {
  ID: number; Type: string; Style: string; Name?: string; Unique?: boolean; Exit?: boolean;
  Top?: number; Left?: number; Width?: number; Height?: number; Rotation?: number;
  CanEnter?: (dir: string) => boolean;
}
export interface MapEffect { ID: number; Type: string; TypeId?: number; Color?: number[] }
export interface SignCell { Type: "Sign"; Text: string }
// (R134, Nov 18) a tile's object can also be a teleport pad (where it goes, its colour, shared) or a tether point
export interface TeleporterCell { Type: "Teleporter"; Destination?: { X: number; Y: number }; Color?: string; Shared?: boolean }
export interface TetherCell { Type: "Tether" }
export type CellConfig = SignCell | TeleporterCell | TetherCell;
// (R134) how an admin turned, sized and coloured the object on a tile; it only applies while that object (ID) is there
export interface ObjectSettings { ID: number; Rotation?: number; Size?: number; Colors?: string[]; Decal?: string; DecalColor?: string }
export interface MapModel {
  tiles: number[];               // a tile id per square, N of them
  objects: number[];             // a furniture id per square (BLANK for none)
  effects: number[][];           // the effect ids on each square
  cells: Record<number, CellConfig>;
  settings?: Record<number, ObjectSettings>;   // (R134; older layouts have none)
  fog: boolean;
}

/* eslint-disable no-var */
declare var CurrentScreen: string;
declare var CurrentScreenFunctions: Record<string, unknown>;
declare var Player: any;
declare var ChatRoomData: any;
declare var ChatRoomCharacter: any[];
declare var MainCanvas: CanvasRenderingContext2D;
declare var MouseX: number;
declare var MouseY: number;
declare var ChatRoomMapViewPerceptionRange: number;
declare var ChatRoomMapViewEditMode: string;
declare const MapManager: { Map: any };
declare const MapDataTiles: Map<number, Doodad>;
declare const MapDataObjects: Map<number, Doodad>;
declare const MapDataEffects: Map<number, MapEffect>;
declare function MapDataLoad(): void;
declare function MapGetAssetUrl(kind: "Tile" | "Object", type?: string, style?: string): string;
declare var ChatRoomMapViewDrawGrid: (l: number, t: number, w: number, h: number) => void;
declare var ChatRoomMapViewGetSightRange: () => number;
declare var ChatRoomMapFogIsActive: () => boolean;
declare var ChatRoomMapViewCollision: () => void;
declare var ChatRoomMapViewScheduleMapUpdate: () => void;
declare var ChatRoomMapViewHasSuperPowers: () => boolean;

// has the game's own start-up got far enough (its sign-in screen, the map catalogue loaded)?
export function gameReady(): boolean {
  try {
    return typeof CurrentScreen === "string" && CurrentScreen === "Login" && typeof MapManager === "object" && !!MapManager &&
      typeof MapDataTiles === "object" && typeof ChatRoomMapViewDrawGrid === "function" && typeof Player === "object" && !!Player &&
      typeof CurrentScreenFunctions === "object";
  } catch (e) { return false; }
}

// our own screen in place of the game's sign-in screen: the game draws nothing, the studio's page does
export function takeOverScreen(): void {
  const none = () => {};
  try { (CurrentScreenFunctions as any).Unload?.(); } catch (e) { /* fine */ }
  CurrentScreen = "FarmMapStudio";
  CurrentScreenFunctions = { Run: none, Draw: none, Click: none, MouseDown: none, MouseUp: none, MouseMove: none, MouseWheel: none,
    Load: async () => {}, Unload: none, Resize: none, KeyDown: () => false, KeyUp: () => false, Exit: none, Paste: none };
}

// a pretend room the game's map code can work in. It never sends anything anywhere: the studio isn't signed in, and the
// game's "send the new map to the room" is switched off for good.
let roomReady = false;
function room(): void {
  if (roomReady) return;
  if (MapDataTiles.size === 0) MapDataLoad();
  if (typeof Player.MemberNumber !== "number") Player.MemberNumber = 1;
  Player.MapData = { Pos: { X: 20, Y: 20 }, PrivateState: {} };
  // (the game's own loop still draws a background behind the studio, under its hidden canvas: one that exists)
  ChatRoomData = { Name: "B&B map studio", Admin: [Player.MemberNumber], Character: [], Background: "MainHall", MapData: { Type: "Always" } };
  (window as any).FarmMapStudioBackground = "MainHall";
  ChatRoomCharacter = [];
  ChatRoomMapViewScheduleMapUpdate = () => {};
  ChatRoomMapViewHasSuperPowers = () => false;
  MapManager.Map.clear();
  roomReady = true;
}

// ── the catalogue ──
export interface Catalogue { tiles: Doodad[]; objects: Doodad[]; effects: MapEffect[] }
export function catalogue(): Catalogue {
  room();
  return { tiles: [...MapDataTiles.values()], objects: [...MapDataObjects.values()], effects: [...MapDataEffects.values()] };
}
export const tileOf = (id: number): Doodad | undefined => MapDataTiles.get(id);
export const objectOf = (id: number): Doodad | undefined => MapDataObjects.get(id);
export const effectOf = (id: number): MapEffect | undefined => MapDataEffects.get(id);
export const assetUrl = (kind: "Tile" | "Object", d: Doodad): string => MapGetAssetUrl(kind, d.Type, d.Style);
export const doodadName = (d: Doodad | undefined): string => !d ? "nothing" : d.Name || (d.Style.replace(/([a-z])([A-Z])/g, "$1 $2") + " (" + d.Type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase() + ")");
const LIGHT_NAMES: Record<number, string> = { 10: "No lighting", 11: "Light shadow", 12: "Shadow", 13: "Dark shadow", 14: "Red tint", 15: "Blue tint", 16: "Green tint", 17: "Yellow glow" };
export const effectName = (e: MapEffect | undefined): string => !e ? "none" : LIGHT_NAMES[e.ID] || (e.Type.replace(/([a-z])([A-Z])/g, "$1 $2") + " " + e.ID);

// ── models in and out ──
export function emptyModel(): MapModel {
  return { tiles: new Array(N).fill(BLANK), objects: new Array(N).fill(BLANK), effects: Array.from({ length: N }, () => []), cells: {}, settings: {}, fog: false };
}
function readFromGame(): MapModel {
  const M = MapManager.Map, m = emptyModel();
  for (let i = 0; i < N; i++) {
    m.tiles[i] = M.getTileId(i) ?? BLANK;
    m.objects[i] = M.getObjectId(i) ?? BLANK;
    m.effects[i] = ((M.getEffectsByIndex(i) || []) as MapEffect[]).map((e) => e.ID).filter((id) => id !== BLANK_EFFECT);
    const c = M.getObjectConfig(i);
    if (c && c.Type === "Sign") m.cells[i] = { Type: "Sign", Text: String(c.Text || "") };
    else if (c && (c.Type === "Teleporter" || c.Type === "Tether")) m.cells[i] = JSON.parse(JSON.stringify(c));   // (R134: kept as they are)
    if (typeof M.getObjectSettings === "function") { const s = M.getObjectSettings(i); if (s && typeof s.ID === "number") m.settings![i] = JSON.parse(JSON.stringify(s)); }
  }
  m.fog = !!M.hasFogEnabled;
  return m;
}
// the room's own map data (what the bot keeps in its ledger's room snapshot: Tiles, Objects, Effects, CellData, Fog)
export function fromRoomData(data: any): MapModel | null {
  room();
  if (!data || typeof data.Tiles !== "string") return null;
  try { MapManager.Map.clear(); return MapManager.Map.loadGlobalMapData(data) ? readFromGame() : null; } catch (e) { return null; }
}
// what /mapcopy gave you → a model (null: not a map string the game can read)
export function importString(s: string): MapModel | null {
  room();
  let ok = false;
  try { ok = MapManager.Map.importString(String(s || "").trim()); } catch (e) { ok = false; }
  return ok ? readFromGame() : null;
}
// the model into the game's own map, for drawing, checks and exporting. The game keeps an undo list of its own, so
// it's emptied first every time (clear), or it would grow with every redraw.
export function pushToGame(m: MapModel): void {
  room();
  const data: any = { Type: "Always", Tiles: m.tiles.map((id) => String.fromCharCode(id)).join(""),
    Objects: m.objects.map((id) => String.fromCharCode(id)).join(""), CellData: m.cells };
  if (m.fog) data.Fog = true;
  ChatRoomData.MapData = data;
  MapManager.Map.clear();
  MapManager.Map.loadGlobalMapData(data);
  const list = m.effects.map((ids) => { const l = ids.map((id) => MapDataEffects.get(id)).filter(Boolean); return l.length ? l : [MapDataEffects.get(BLANK_EFFECT)]; });
  MapManager.Map.replaceAllEffects(list);
  // (R134) each object turned, sized and coloured as it was: only where the same object is still on that tile
  if (typeof MapManager.Map.setObjectSettings === "function") {
    for (const [k, s] of Object.entries(m.settings || {})) {
      const i = Number(k); if (!s || s.ID !== m.objects[i]) continue;
      const { ID: _id, ...rest } = s;
      try { MapManager.Map.setObjectSettings(i, rest, false); } catch (e) { /* the game says no */ }
    }
  }
}
// the model → the string for /mappaste in the farm room
export function exportString(m: MapModel): string {
  pushToGame(m);
  return String(MapManager.Map.exportString() || "");
}

// ── drawing: the game's own map drawing, the whole 40×40 at once, onto our canvas ──
// The game draws a square of (range × 2 + 1) tiles around the player; standing at 20,20 with a range of 20 covers the farm.
export function drawWholeMap(ctx: CanvasRenderingContext2D, tile: number): void {
  const keep = { canvas: MainCanvas, range: ChatRoomMapViewPerceptionRange, sight: ChatRoomMapViewGetSightRange, fog: ChatRoomMapFogIsActive,
    coll: ChatRoomMapViewCollision, edit: ChatRoomMapViewEditMode, mx: MouseX, my: MouseY, pos: Player.MapData, chars: ChatRoomCharacter };
  try {
    MainCanvas = ctx;
    ChatRoomMapViewPerceptionRange = 20;
    ChatRoomMapViewGetSightRange = () => 99;
    ChatRoomMapFogIsActive = () => false;
    ChatRoomMapViewCollision = () => {};
    ChatRoomMapViewEditMode = "";
    MouseX = -9999; MouseY = -9999;
    Player.MapData = { Pos: { X: 20, Y: 20 }, PrivateState: {} };
    ChatRoomCharacter = [];
    ctx.save();
    ctx.fillStyle = "#14161b"; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ChatRoomMapViewDrawGrid(0, 0, tile * 41, tile * 41);
    ctx.restore();
  } finally {
    MainCanvas = keep.canvas; ChatRoomMapViewPerceptionRange = keep.range; ChatRoomMapViewGetSightRange = keep.sight; ChatRoomMapFogIsActive = keep.fog;
    ChatRoomMapViewCollision = keep.coll; ChatRoomMapViewEditMode = keep.edit; MouseX = keep.mx; MouseY = keep.my; Player.MapData = keep.pos; ChatRoomCharacter = keep.chars;
  }
}

// ── what somebody standin' at x,y can see and hear (the game's own reckoning: walls block, range is the normal one) ──
export function perceptionFrom(x: number, y: number): { sight: boolean[]; hearing: boolean[] } {
  const keep = Player.MapData;
  try {
    Player.MapData = { Pos: { X: x, Y: y }, PrivateState: {} };
    MapManager.Map.updatePlayerPerception();
    return { sight: [...MapManager.Map.sightMask], hearing: [...MapManager.Map.hearingMask] };
  } finally { Player.MapData = keep; }
}

// ── can somebody stand here? (the game's own CanEnter rules, from any side) ──
const DIRS = ["North", "South", "East", "West", ""];
function enterable(f: ((d: string) => boolean) | undefined): boolean {
  if (typeof f !== "function") return true;
  return DIRS.some((d) => { try { return !!f(d); } catch (e) { return true; } });
}
export function standable(m: MapModel, i: number): boolean {
  const o = MapDataObjects.get(m.objects[i]);
  if (o && typeof o.CanEnter === "function") return enterable(o.CanEnter);
  const t = MapDataTiles.get(m.tiles[i]);
  if (t && t.Type === "Wall" && typeof t.CanEnter !== "function") return false;
  return enterable(t && t.CanEnter);
}
