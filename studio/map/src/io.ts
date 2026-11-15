/* WHAT'S IN THIS FILE (studio/map/src/io.ts)
   Talking to the studio's own server (studio/server.mjs, this computer only): layouts and their old versions in
   studio/maps/ (never on GitHub: they hold where every trap is), stamps, and the farm's spots and zones as they are now
   (read from the bot's newest ledger backup in backup/, read only).
*/
import { Layout, Stamp, mendLayout, FarmLayer } from "./model";

export const NAME_RE = /^[a-z0-9][a-z0-9-]{0,39}$/;
export const cleanName = (s: string): string => String(s || "").toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

async function get(path: string): Promise<any> {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error((await r.text().catch(() => "")) || path + ": " + r.status);
  return r.json();
}
async function post(path: string, body: unknown, type = "application/json"): Promise<any> {
  const r = await fetch(path, { method: "POST", headers: { "Content-Type": type }, body: typeof body === "string" ? body : JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.text().catch(() => "")) || path + ": " + r.status);
  return r.json().catch(() => ({}));
}

export interface LayoutInfo { name: string; savedAt?: string; notes?: string }
export const listLayouts = async (): Promise<LayoutInfo[]> => (await get("/__studio/maps/")).layouts || [];
export const loadLayout = async (name: string): Promise<Layout> => mendLayout(await get("/__studio/maps/" + name + ".json"), name);
export async function saveLayout(L: Layout): Promise<Layout> {
  if (!NAME_RE.test(L.name)) throw new Error("a layout's name is small letters, numbers and dashes");
  L.savedAt = new Date().toISOString();
  await post("/__studio/maps/" + L.name + ".json", L);
  return L;
}
export interface VersionInfo { file: string; savedAt: string }
export const listVersions = async (name: string): Promise<VersionInfo[]> => (await get("/__studio/maps/" + name + "/versions")).versions || [];
export const loadVersion = async (name: string, file: string): Promise<Layout> => mendLayout(await get("/__studio/maps/" + name + "/versions/" + file), name);

export const loadStamps = async (): Promise<Stamp[]> => { try { return (await get("/__studio/stamps")).stamps || []; } catch (e) { return []; } };
export const saveStamps = async (stamps: Stamp[]): Promise<void> => { await post("/__studio/stamps", { stamps }); };

// the farm as the bot has it now (its newest ledger backup): spots, zones, and the heat map's minutes per zone
export interface FarmNow { farm: FarmLayer; heat: Record<string, number>; map: any | null; mapAt: number | string | null; from: string; at: string }
export const farmNow = async (): Promise<FarmNow> => get("/__studio/farm-now");

// the decoded map, written into docs/ (traps left out: that page is public)
export const writeDoc = async (text: string): Promise<void> => { await post("/__studio/docs/farm-map-decoded.txt", text, "text/plain"); };
