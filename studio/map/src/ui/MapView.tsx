/* WHAT'S IN THIS FILE (studio/map/src/ui/MapView.tsx)
   The farm, drawn by the game's own map drawing (game.ts), with the farm's layer on top: zones, spots by kind, the soft
   glaze, where nobody can stand, the heat map, what somebody can see and hear from a square. And every tool's clicks.
*/
import { useEffect, useRef, useState } from "preact/hooks";
import { ed } from "../editor";
import { W, H, pushToGame, drawWholeMap, perceptionFrom } from "../game";
import { Pt, idx, inMap } from "../model";
import { kindOf, zoneColor, tintFor } from "../farm";

export const TS = 48;   // pixels per square in the picture (it's zoomed on screen)
const SIZE = W * TS;

export function MapView() {
  const base = useRef<HTMLCanvasElement>(null), over = useRef<HTMLCanvasElement>(null);
  const off = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(0.5);
  const drag = useRef<{ kind: string; a: Pt; last: Pt; spot?: string; moved?: boolean } | null>(null);

  // ── the base picture: the game draws the whole map (again for a few seconds, while its pictures load) ──
  useEffect(() => {
    let timer = 0, until = 0, lastMap = -1, lastView = "";
    const draw = () => {
      if (!off.current) { off.current = document.createElement("canvas"); off.current.width = off.current.height = TS * 41; }
      const o = off.current.getContext("2d")!, b = base.current!.getContext("2d")!;
      try { pushToGame(ed.viewModel()); drawWholeMap(o, TS); } catch (e) { console.error("[map studio] drawing:", e); }
      b.clearRect(0, 0, SIZE, SIZE); b.drawImage(off.current, 0, 0, SIZE, SIZE, 0, 0, SIZE, SIZE);
      try { pushToGame(ed.map); } catch (e) { /* fine */ }
    };
    const tick = () => { draw(); if (Date.now() < until) timer = window.setTimeout(tick, 400); };
    const check = () => {
      const v = ed.view.objects + "," + ed.view.effects;
      if (ed.mapVer === lastMap && v === lastView) return;
      lastMap = ed.mapVer; lastView = v; until = Date.now() + 5000; clearTimeout(timer); tick();
    };
    check();
    const off1 = ed.on(check);
    return () => { off1(); clearTimeout(timer); };
  }, []);

  // ── the overlay: redrawn on any change ──
  useEffect(() => {
    let raf = 0;
    const paint = () => { raf = 0; drawOverlay(over.current!.getContext("2d")!, drag.current); };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    ask();
    return ed.on(ask);
  }, []);

  const at = (e: MouseEvent): Pt => ({ X: Math.floor(e.offsetX / (TS * zoom)), Y: Math.floor(e.offsetY / (TS * zoom)) });
  const insideSel = (p: Pt) => !!ed.sel && p.X >= Math.min(ed.sel.a.X, ed.sel.b.X) && p.X <= Math.max(ed.sel.a.X, ed.sel.b.X) && p.Y >= Math.min(ed.sel.a.Y, ed.sel.b.Y) && p.Y <= Math.max(ed.sel.a.Y, ed.sel.b.Y);

  function down(e: MouseEvent) {
    const p = at(e); if (!inMap(p.X, p.Y)) return;
    if (e.button === 2 || e.altKey) { ed.eyedrop(p); return; }
    const t = ed.tool;
    if (t === "look") { const s = ed.spotAt(p); ed.selected = s ? { kind: "spot", name: s } : { kind: "tile", at: p }; ed.emit(); return; }
    if (t === "paint" || t === "erase") { ed.begin(); ed.paintAt(p); drag.current = { kind: "paint", a: p, last: p }; return; }
    if (t === "fill") { ed.fillAt(p); return; }
    if (t === "stamp") { ed.stampHere(p); return; }
    if (t === "rect" || t === "zone") { drag.current = { kind: t, a: p, last: p }; ed.emit(); return; }
    if (t === "select") {
      if (insideSel(p)) drag.current = { kind: "move", a: p, last: p };
      else { ed.sel = { a: p, b: p }; drag.current = { kind: "select", a: p, last: p }; ed.emit(); }
      return;
    }
    if (t === "spot") {
      const s = ed.spotAt(p);
      if (s) { ed.selected = { kind: "spot", name: s }; ed.begin(); drag.current = { kind: "spot", a: p, last: p, spot: s }; ed.emit(); return; }
      const name = prompt("A name for the spot at " + p.X + "," + p.Y + "? The bot goes by these names: trough-1, water-3, milking1, glory-2, glory-2-visitor, stocks, home, trap-snare…");
      const clean = String(name || "").trim();
      if (clean) { if (ed.layout.farm.spots[clean]) { alert(clean + " is already on the map. Pick it with the spot tool and drag it instead."); return; } ed.addSpot(clean, p); }
    }
  }
  function move(e: MouseEvent) {
    const p = at(e);
    if (!ed.hover || ed.hover.X !== p.X || ed.hover.Y !== p.Y) { ed.hover = inMap(p.X, p.Y) ? p : null; }
    const d = drag.current;
    if (d && inMap(p.X, p.Y) && (p.X !== d.last.X || p.Y !== d.last.Y)) {
      if (d.kind === "paint") ed.paintAt(p);
      else if (d.kind === "select" && ed.sel) ed.sel = { a: d.a, b: p };
      else if (d.kind === "spot" && d.spot) ed.moveSpot(d.spot, p);
      else if (d.kind === "move") { ed.moveSel(p.X - d.last.X, p.Y - d.last.Y); }
      d.last = p; d.moved = true;
    }
    ed.emit();
  }
  function up(e: MouseEvent) {
    const d = drag.current; drag.current = null; if (!d) return;
    const p = at(e), b = inMap(p.X, p.Y) ? p : d.last;
    if (d.kind === "rect") ed.fillRect(d.a, b);
    else if (d.kind === "zone") {
      const name = String(prompt("A name for the zone from " + d.a.X + "," + d.a.Y + " to " + b.X + "," + b.Y + "? (barn, pasture, office…)") || "").trim();
      if (name) {
        const group = String(prompt("Part of a bigger place made of several boxes (barn-1 and barn-2 make the barn)? Its name, or leave it empty.") || "").trim();
        ed.addZone(name, d.a, b, group || undefined);
      } else ed.emit();
    } else ed.emit();
  }

  const px = SIZE * zoom;
  return (
    <div class="mv">
      <div class="mv-zoom">
        <button onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.125).toFixed(3)))}>−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.125).toFixed(3)))}>+</button>
        <span class="mv-hover">{ed.hover ? ed.hover.X + "," + ed.hover.Y : ""}</span>
      </div>
      <div class="mv-scroll" onWheel={(e) => { if (e.ctrlKey) { e.preventDefault(); setZoom((z) => Math.min(2, Math.max(0.25, z * (e.deltaY < 0 ? 1.15 : 1 / 1.15)))); } }}>
        <div class="mv-stack" style={{ width: px + "px", height: px + "px" }}>
          <canvas ref={base} width={SIZE} height={SIZE} style={{ width: px + "px", height: px + "px" }} />
          <canvas ref={over} width={SIZE} height={SIZE} style={{ width: px + "px", height: px + "px" }} class={"mv-over tool-" + ed.tool}
            onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={() => { ed.hover = null; ed.emit(); }} onContextMenu={(e) => e.preventDefault()} />
        </div>
      </div>
    </div>
  );
}

// ── the overlay ──
function drawOverlay(c: CanvasRenderingContext2D, drag: { kind: string; a: Pt; last: Pt } | null) {
  const v = ed.view, F = ed.layout.farm, sq = (p: Pt) => [p.X * TS, p.Y * TS] as const;
  c.clearRect(0, 0, SIZE, SIZE);
  c.font = "bold 13px system-ui, sans-serif"; c.textBaseline = "top";
  // as players would see it: only the soft glaze over each spot, nothing else
  if (v.glaze) {
    for (const [name, p] of Object.entries(F.spots)) { const k = kindOf(name), t = tintFor(ed.layout.tints, k.key); if (!v.spots[k.key]) continue; c.globalAlpha = t.alpha; c.fillStyle = t.color; c.fillRect(p.X * TS, p.Y * TS, TS, TS); }
    c.globalAlpha = 1; return;
  }
  // what somebody standin' on the picked square can see (and hear)
  if (v.sight && ed.selected && ed.selected.kind !== "zone") {
    const from = ed.selected.kind === "tile" ? ed.selected.at : F.spots[ed.selected.name];
    if (from) {
      const pr = perceptionFrom(from.X, from.Y);
      for (let i = 0; i < W * H; i++) {
        if (pr.sight[i]) continue;
        c.fillStyle = pr.hearing[i] ? "rgba(20,30,70,0.45)" : "rgba(0,0,0,0.6)"; c.fillRect((i % W) * TS, Math.floor(i / W) * TS, TS, TS);
      }
      c.strokeStyle = "#7fd3ff"; c.lineWidth = 3; c.setLineDash([6, 4]); c.strokeRect((from.X - 1) * TS, (from.Y - 1) * TS, TS * 3, TS * 3); c.setLineDash([]);   // whisper range: one square
    }
  }
  if (v.walk) {
    c.strokeStyle = "rgba(255,70,70,0.55)"; c.lineWidth = 2;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!ed.standable({ X: x, Y: y })) { const [X, Y] = sq({ X: x, Y: y }); c.beginPath(); c.moveTo(X + 4, Y + 4); c.lineTo(X + TS - 4, Y + TS - 4); c.moveTo(X + TS - 4, Y + 4); c.lineTo(X + 4, Y + TS - 4); c.stroke(); }
  }
  if (v.heat) {
    const max = Math.max(1, ...Object.values(ed.heat));
    for (const [name, z] of Object.entries(F.zones)) {
      const mins = ed.heat[z.group || name] || ed.heat[name] || 0; if (!mins || !z.a || !z.b) continue;
      c.fillStyle = "rgba(255,60,30," + (0.1 + 0.5 * mins / max).toFixed(2) + ")";
      c.fillRect(Math.min(z.a.X, z.b.X) * TS, Math.min(z.a.Y, z.b.Y) * TS, (Math.abs(z.a.X - z.b.X) + 1) * TS, (Math.abs(z.a.Y - z.b.Y) + 1) * TS);
    }
  }
  if (v.grid) {
    c.strokeStyle = "rgba(255,255,255,0.12)"; c.lineWidth = 1; c.beginPath();
    for (let k = 0; k <= W; k++) { c.moveTo(k * TS + 0.5, 0); c.lineTo(k * TS + 0.5, SIZE); c.moveTo(0, k * TS + 0.5); c.lineTo(SIZE, k * TS + 0.5); }
    c.stroke();
  }
  if (v.coords) {
    c.fillStyle = "rgba(255,255,255,0.75)"; c.font = "11px system-ui, sans-serif";
    for (let k = 0; k < W; k++) { c.fillText(String(k), k * TS + 3, 2); if (k) c.fillText(String(k), 3, k * TS + 2); }
    c.font = "bold 13px system-ui, sans-serif";
  }
  if (v.zones) {
    for (const [name, z] of Object.entries(F.zones)) {
      if (!z.a || !z.b) continue;
      const x0 = Math.min(z.a.X, z.b.X) * TS, y0 = Math.min(z.a.Y, z.b.Y) * TS, w = (Math.abs(z.a.X - z.b.X) + 1) * TS, h = (Math.abs(z.a.Y - z.b.Y) + 1) * TS;
      const sel = ed.selected && ed.selected.kind === "zone" && ed.selected.name === name;
      c.strokeStyle = zoneColor(z.group || name); c.lineWidth = sel ? 5 : 2.5; c.strokeRect(x0 + 2, y0 + 2, w - 4, h - 4);
      if (v.labels) { c.fillStyle = "rgba(0,0,0,0.55)"; const label = name + (z.group && z.group !== name ? " · " + z.group : ""); c.fillRect(x0 + 4, y0 + h - 20, c.measureText(label).width + 8, 17); c.fillStyle = zoneColor(z.group || name); c.fillText(label, x0 + 8, y0 + h - 18); }
    }
  }
  for (const [name, p] of Object.entries(F.spots)) {
    const k = kindOf(name); if (!v.spots[k.key]) continue;
    const [X, Y] = sq(p), sel = ed.selected && ed.selected.kind === "spot" && ed.selected.name === name;
    c.globalAlpha = 0.22; c.fillStyle = k.color; c.fillRect(X, Y, TS, TS); c.globalAlpha = 1;
    c.strokeStyle = sel ? "#fff" : k.color; c.lineWidth = sel ? 4 : 2.5;
    c.beginPath(); c.arc(X + TS / 2, Y + TS / 2, TS * 0.32, 0, Math.PI * 2); c.stroke();
    if (!ed.standable(p)) { c.fillStyle = "#ff4a4a"; c.fillText("!", X + TS - 10, Y + 2); }
    if (v.labels) { c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(X, Y + TS - 15, Math.min(TS * 3, c.measureText(name).width + 6), 15); c.fillStyle = k.color; c.fillText(name, X + 3, Y + TS - 14); }
  }
  // the selection, and whatever the mouse is about to do
  if (ed.sel) {
    const { a, b } = ed.sel; c.strokeStyle = "#ffd84a"; c.lineWidth = 3; c.setLineDash([10, 6]);
    c.strokeRect(Math.min(a.X, b.X) * TS + 1, Math.min(a.Y, b.Y) * TS + 1, (Math.abs(a.X - b.X) + 1) * TS - 2, (Math.abs(a.Y - b.Y) + 1) * TS - 2); c.setLineDash([]);
  }
  if (drag && (drag.kind === "rect" || drag.kind === "zone")) {
    c.strokeStyle = drag.kind === "zone" ? "#7fffb0" : "#ffffff"; c.lineWidth = 3;
    c.strokeRect(Math.min(drag.a.X, drag.last.X) * TS, Math.min(drag.a.Y, drag.last.Y) * TS, (Math.abs(drag.a.X - drag.last.X) + 1) * TS, (Math.abs(drag.a.Y - drag.last.Y) + 1) * TS);
  }
  const h = ed.hover;
  if (h) {
    c.strokeStyle = "rgba(255,255,255,0.9)"; c.lineWidth = 2;
    if (ed.tool === "paint" || ed.tool === "erase") { const r = Math.floor(ed.size / 2); c.strokeRect((h.X - r) * TS, (h.Y - r) * TS, ed.size * TS, ed.size * TS); }
    else if (ed.tool === "stamp" && ed.clip) { c.strokeStyle = "#ffd84a"; c.strokeRect(h.X * TS, h.Y * TS, ed.clip.w * TS, ed.clip.h * TS); }
    else c.strokeRect(h.X * TS, h.Y * TS, TS, TS);
  }
  if (ed.selected && ed.selected.kind === "tile") { const p = ed.selected.at; c.strokeStyle = "#7fd3ff"; c.lineWidth = 3; c.strokeRect(p.X * TS + 2, p.Y * TS + 2, TS - 4, TS - 4); }
  void idx;
}
