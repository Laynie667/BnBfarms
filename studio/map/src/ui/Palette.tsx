/* WHAT'S IN THIS FILE (studio/map/src/ui/Palette.tsx)
   The game's whole map catalogue to paint with: floors and walls, furniture, lighting. Search by name or kind; the
   picked one is what the brush, fill and box paint. Right-click (or Alt-click) on the map picks up what's there.
*/
import { useMemo, useState } from "preact/hooks";
import { ed } from "../editor";
import { catalogue, assetUrl, doodadName, effectName, Doodad, MapEffect } from "../game";
import { PaintLayer } from "../model";

const TABS: { key: PaintLayer; label: string }[] = [{ key: "tiles", label: "Floors and walls" }, { key: "objects", label: "Furniture" }, { key: "effects", label: "Lighting" }];
const pretty = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1 $2");

export function Palette() {
  const cat = useMemo(() => catalogue(), []);
  const [q, setQ] = useState("");
  const layer = ed.pick.layer;
  const list: (Doodad | MapEffect)[] = layer === "tiles" ? cat.tiles : layer === "objects" ? cat.objects.filter((o) => o.Style !== "Blank" || o.ID === 100) : cat.effects;
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase(), g = new Map<string, (Doodad | MapEffect)[]>();
    for (const d of list) {
      const label = layer === "effects" ? effectName(d as MapEffect) : doodadName(d as Doodad);
      if (needle && !(label.toLowerCase().includes(needle) || d.Type.toLowerCase().includes(needle) || String(d.ID) === needle)) continue;
      const k = pretty(d.Type); if (!g.has(k)) g.set(k, []); g.get(k)!.push(d);
    }
    return [...g];
  }, [layer, q, list]);
  const pick = (id: number) => { ed.pick = { layer, id }; if (ed.tool === "look" || ed.tool === "select" || ed.tool === "spot" || ed.tool === "zone" || ed.tool === "stamp") ed.tool = "paint"; ed.emit(); };
  return (
    <div class="pal">
      <div class="tabs">{TABS.map((t) => <button class={layer === t.key ? "on" : ""} onClick={() => { ed.pick = { layer: t.key, id: t.key === "tiles" ? 215 : t.key === "objects" ? 100 : 11 }; ed.emit(); }}>{t.label}</button>)}</div>
      <input class="pal-q" placeholder="Search: grass, steel, bed, x-cross…" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
      <div class="pal-list">
        {groups.map(([type, items]) => (
          <div class="pal-group">
            <div class="pal-type">{type}</div>
            <div class="pal-grid">
              {items.map((d) => {
                const on = ed.pick.id === d.ID;
                if (layer === "effects") {
                  const c = (d as MapEffect).Color || [0, 0, 0, 0];
                  return <button class={"pal-item fx" + (on ? " on" : "")} title={effectName(d as MapEffect) + " · " + d.ID} onClick={() => pick(d.ID)}>
                    <span class="swatch" style={{ background: "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + Math.max(0.08, c[3]) + ")" }} />{effectName(d as MapEffect)}</button>;
                }
                const dd = d as Doodad;
                return <button class={"pal-item" + (on ? " on" : "")} title={doodadName(dd) + " · " + dd.ID} onClick={() => pick(dd.ID)}>
                  {dd.Style === "Blank" ? <span class="blank">none</span> : <img loading="lazy" src={assetUrl(layer === "tiles" ? "Tile" : "Object", dd)} alt="" />}
                </button>;
              })}
            </div>
          </div>
        ))}
        {!groups.length && <p class="muted">Nothing matches that.</p>}
      </div>
    </div>
  );
}
