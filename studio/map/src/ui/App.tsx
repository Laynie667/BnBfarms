/* WHAT'S IN THIS FILE (studio/map/src/ui/App.tsx)
   The map studio's screen: the tools along the top, the catalogue on the left, the farm in the middle, the panels on
   the right. Keys: L look · B brush · E erase · F fill · R box · S select · V stamp · P spot · Z zone · 1/3/5 brush size
   · Ctrl+Z / Ctrl+Y undo, redo · Ctrl+C / Ctrl+X copy, cut · arrows move a selection · Delete · Ctrl+S save.
*/
import { useEffect, useState } from "preact/hooks";
import { ed, Tool } from "../editor";
import { MapView } from "./MapView";
import { Palette } from "./Palette";
import { LayoutsPanel, InOutPanel, FarmPanel, ViewPanel, GlazePanel, StampsPanel, Inspector } from "./Panels";
import { loadLayout, loadStamps, farmNow, saveLayout } from "../io";
import { newLayout, clone } from "../model";
import { fromRoomData } from "../game";

const TOOLS: { t: Tool; key: string; label: string; hint: string }[] = [
  { t: "look", key: "L", label: "Look", hint: "Pick a square to see what's on it (and what can be seen from it)" },
  { t: "paint", key: "B", label: "Brush", hint: "Paint what's picked in the catalogue. Right-click picks up what's under the mouse." },
  { t: "erase", key: "E", label: "Erase", hint: "Take furniture or lighting away (floors go back to plain planks)" },
  { t: "fill", key: "F", label: "Fill", hint: "Fill everything joined that's the same" },
  { t: "rect", key: "R", label: "Box", hint: "Drag a box to fill" },
  { t: "select", key: "S", label: "Select", hint: "Drag to select a block; drag inside it to move it (spots and zones go along)" },
  { t: "stamp", key: "V", label: "Stamp", hint: "Put down what's copied, or a kept stamp" },
  { t: "spot", key: "P", label: "Spot", hint: "Click to add one of the bot's spots, drag one to move it" },
  { t: "zone", key: "Z", label: "Zone", hint: "Drag a box for a zone" },
];
type Side = "layout" | "farm" | "view" | "stamps";

export function App() {
  const [, setVer] = useState(0), [side, setSide] = useState<Side>("layout");
  useEffect(() => ed.on(() => setVer(ed.ver)), []);

  // the everyday farm opens first; on the very first run, a new one with the bot's spots and zones
  useEffect(() => {
    (async () => {
      ed.stamps = await loadStamps();
      try { ed.load(await loadLayout("farm")); ed.say("Opened the farm. Pick a tool along the top, or a layout on the right."); }
      catch (e) {
        const L = newLayout("farm"); L.notes = "The everyday farm.";
        let gotMap = false;
        try { const now = await farmNow(); L.farm = now.farm; ed.heat = now.heat || {}; const m = now.map && fromRoomData(now.map); if (m) { L.map = m; gotMap = true; } } catch (e2) { /* no backup on this computer */ }
        ed.load(L); ed.unsaved = true;
        ed.say(gotMap ? "Welcome! This is the farm as the bot last saw it: the room's map with its spots and zones. Look around, then Save to keep it as the layout called farm."
          : "Welcome! This is a fresh layout called farm with the bot's spots and zones. Now bring in the room's map: in the farm room type /mapcopy, then paste it under Bring in, bring out.");
      }
    })();
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName; if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key.toLowerCase(), ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && k === "z" && !e.shiftKey) { e.preventDefault(); ed.undo(); return; }
      if (ctrl && (k === "y" || (k === "z" && e.shiftKey))) { e.preventDefault(); ed.redo(); return; }
      if (ctrl && k === "c") { ed.copy(); return; }
      if (ctrl && k === "x") { ed.cutSel(); return; }
      if (ctrl && k === "s") { e.preventDefault(); const L = clone(ed.layout); saveLayout(L).then(() => { ed.layout.savedAt = L.savedAt; ed.unsaved = false; ed.say("Saved \"" + L.name + "\"."); }).catch((x) => ed.say("Couldn't save: " + x.message)); return; }
      if (ctrl) return;
      if (k === "delete" || k === "backspace") {
        const S = ed.selected;
        if (S && S.kind === "spot") { if (confirm("Take " + S.name + " off the map?")) ed.deleteSpot(S.name); }
        else if (S && S.kind === "zone") { if (confirm("Take the zone " + S.name + " away?")) ed.deleteZone(S.name); }
        else if (ed.sel) ed.clearSel();
        return;
      }
      if (k === "escape") { ed.sel = null; ed.selected = null; ed.emit(); return; }
      if (k.startsWith("arrow") && ed.sel) { e.preventDefault(); ed.moveSel(k === "arrowleft" ? -1 : k === "arrowright" ? 1 : 0, k === "arrowup" ? -1 : k === "arrowdown" ? 1 : 0); return; }
      if (k === "1" || k === "3" || k === "5") { ed.size = Number(k); ed.emit(); return; }
      const tool = TOOLS.find((x) => x.key.toLowerCase() === k); if (tool) { ed.tool = tool.t; ed.emit(); }
    };
    const leave = (e: BeforeUnloadEvent) => { if (ed.unsaved) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("keydown", key); window.addEventListener("beforeunload", leave);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("beforeunload", leave); };
  }, []);

  return (
    <div class="ms">
      <header>
        <h1>🗺️ B&amp;B map studio</h1>
        <nav class="tools">{TOOLS.map((x) => <button class={ed.tool === x.t ? "on" : ""} title={x.hint + " (" + x.key + ")"} onClick={() => { ed.tool = x.t; ed.emit(); }}>{x.label}<kbd>{x.key}</kbd></button>)}</nav>
        {(ed.tool === "paint" || ed.tool === "erase") && <span class="sizes">{[1, 3, 5].map((n) => <button class={ed.size === n ? "on" : ""} onClick={() => { ed.size = n; ed.emit(); }}>{n}×{n}</button>)}</span>}
        <span class="undo"><button disabled={!ed.history.canUndo} onClick={() => ed.undo()} title="Ctrl+Z">Undo</button><button disabled={!ed.history.canRedo} onClick={() => ed.redo()} title="Ctrl+Y">Redo</button></span>
      </header>
      <div class="msg">{ed.message}</div>
      <main>
        <aside class="left"><Palette /></aside>
        <section class="mid"><MapView /></section>
        <aside class="right">
          <div class="tabs">{(["layout", "farm", "view", "stamps"] as Side[]).map((s) => <button class={side === s ? "on" : ""} onClick={() => setSide(s)}>{{ layout: "Layout", farm: "Farm", view: "Show", stamps: "Stamps" }[s]}</button>)}</div>
          {side === "layout" && <><LayoutsPanel /><InOutPanel /></>}
          {side === "farm" && <><Inspector /><FarmPanel /></>}
          {side === "view" && <><ViewPanel /><GlazePanel /></>}
          {side === "stamps" && <StampsPanel />}
        </aside>
      </main>
    </div>
  );
}
