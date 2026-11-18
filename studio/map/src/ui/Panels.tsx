/* WHAT'S IN THIS FILE (studio/map/src/ui/Panels.tsx)
   The right-hand side of the map studio: layouts (save, open, old versions, use one for an event), bringing the room's
   map in and the finished one out, the farm layer (spots, zones, what's wrong), what's shown, the glaze, stamps, and
   what's on a square.
*/
import { useEffect, useState } from "preact/hooks";
import { ed } from "../editor";
import { importString, exportString, fromRoomData, tileOf, objectOf, effectOf, doodadName, effectName, BLANK } from "../game";
import { Layout, clone, idx, newLayout } from "../model";
import { SPOT_KINDS, kindOf, checkFarm, tintFor, DEFAULT_TINTS } from "../farm";
import { listLayouts, loadLayout, saveLayout, listVersions, loadVersion, farmNow, writeDoc, saveStamps, cleanName, NAME_RE, LayoutInfo, VersionInfo } from "../io";
import { decodedText } from "../doc";

const copyText = async (t: string): Promise<boolean> => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };
const when = (s?: string) => (s ? new Date(s).toLocaleString() : "never saved");

// ── layouts ──
export function LayoutsPanel() {
  const [list, setList] = useState<LayoutInfo[]>([]), [vers, setVers] = useState<VersionInfo[] | null>(null), [busy, setBusy] = useState(false);
  const refresh = () => listLayouts().then(setList).catch((e) => ed.say("Couldn't list the layouts: " + e.message));
  useEffect(() => { refresh(); }, []);
  const L = ed.layout;
  async function save(asName?: string) {
    setBusy(true);
    try { const out = clone(L); if (asName) out.name = asName; await saveLayout(out); if (asName) ed.load(out, true); else { ed.layout.savedAt = out.savedAt; ed.unsaved = false; } ed.say("Saved \"" + out.name + "\"."); refresh(); }
    catch (e: any) { ed.say("Couldn't save: " + e.message); }
    setBusy(false);
  }
  async function open(name: string) {
    if (ed.unsaved && !confirm("\"" + L.name + "\" has changes that aren't saved. Open \"" + name + "\" anyway?")) return;
    try { ed.load(await loadLayout(name)); setVers(null); ed.say("Opened \"" + name + "\"."); } catch (e: any) { ed.say("Couldn't open it: " + e.message); }
  }
  async function useForEvent() {
    const s = exportString(ed.map);
    const ok = await copyText("/mappaste " + s);
    ed.say(ok ? "Copied. In the farm room: paste it into the chat and send (it starts /mappaste). Then tell the bot ?layout " + L.name + " so its spots and zones match." + (ed.unsaved ? " Save first, or the bot gets the last saved spots." : "")
      : "The browser wouldn't let me copy. Use the Bring out box below.");
  }
  return (
    <div class="panel">
      <h3>Layout</h3>
      <div class="row"><b class="lname">{L.name}</b>{ed.unsaved ? <span class="chip warn">not saved</span> : <span class="chip">saved {when(L.savedAt)}</span>}</div>
      <textarea class="notes" placeholder="Notes: what this layout is for (race day, the trap maze, the everyday farm…)" value={L.notes}
        onInput={(e) => { L.notes = (e.target as HTMLTextAreaElement).value; ed.unsaved = true; ed.emit(); }} />
      <div class="row">
        <button class="primary" disabled={busy} onClick={() => save()}>Save</button>
        <button disabled={busy} onClick={() => { const n = cleanName(prompt("Save a copy under a new name (small letters, numbers and dashes): race-day, trap-maze…") || ""); if (n) { if (!NAME_RE.test(n)) return ed.say("That name won't do."); save(n); } }}>Save as…</button>
        <button onClick={() => { const n = cleanName(prompt("A new, empty layout's name?") || ""); if (n && (!ed.unsaved || confirm("Leave unsaved changes behind?"))) { ed.load(newLayout(n)); ed.say("A fresh layout: bring in a map below, or paint one."); } }}>New</button>
      </div>
      <button class="wide event" onClick={useForEvent}>Use this layout in the room…</button>
      <h4>All layouts</h4>
      <ul class="list">{list.map((x) => <li class={x.name === L.name ? "on" : ""}><a onClick={() => open(x.name)}>{x.name}</a><small>{when(x.savedAt)}</small></li>)}{!list.length && <li class="muted">None saved yet.</li>}</ul>
      <h4>Old versions of "{L.name}"</h4>
      {vers === null ? <button onClick={() => listVersions(L.name).then(setVers).catch(() => setVers([]))}>Show them</button>
        : <ul class="list">{vers.map((v) => <li><a onClick={async () => { if (!confirm("Bring back the version from " + when(v.savedAt) + "? (Your current one can be undone.)")) return; const old = await loadVersion(L.name, v.file); ed.begin(); old.name = L.name; ed.layout = old; ed.unsaved = true; ed.mapChanged(); ed.say("Brought back the version from " + when(v.savedAt) + ". Save to keep it."); }}>{when(v.savedAt)}</a></li>)}{!vers.length && <li class="muted">No older versions.</li>}</ul>}
    </div>
  );
}

// ── in and out ──
export function InOutPanel() {
  const [text, setText] = useState("");
  async function bringIn() {
    const s = text.trim().replace(/^\/?mappaste\s+/i, "");
    const m = s && importString(s);
    if (!m) return ed.say("That isn't a map I can read. In the farm room, type /mapcopy, then paste what it copied here.");
    ed.begin(); ed.layout.map = m; setText(""); ed.mapChanged(); ed.say("The room's map is in. The farm's spots and zones are as they were: get the bot's with the button below.");
  }
  async function bringFarm() {
    try {
      const now = await farmNow();
      if (!confirm("Take the bot's spots and zones (" + Object.keys(now.farm.spots).length + " spots, " + Object.keys(now.farm.zones).length + " zones, from its backup of " + when(now.at) + ") in place of this layout's?")) return;
      ed.begin(); ed.layout.farm = now.farm; ed.heat = now.heat || {}; ed.emit(); ed.say("The bot's spots and zones are in (" + now.from + ").");
    } catch (e: any) { ed.say("Couldn't read the bot's backup: " + e.message); }
  }
  // the room's map as the bot last saw it (its ledger keeps a snapshot of the room)
  async function bringRoom() {
    try {
      const now = await farmNow(), m = now.map && fromRoomData(now.map);
      if (!m) return ed.say("The bot's backup has no map of the room in it. Use /mapcopy in the farm room instead.");
      if (!confirm("Take the room's map as the bot last saw it (backup of " + when(now.at) + ") in place of this layout's map? (Spots and zones stay as they are.)")) return;
      ed.begin(); ed.layout.map = m; ed.mapChanged(); ed.say("The room's map is in, from the bot's backup. For the very latest, use /mapcopy in the room.");
    } catch (e: any) { ed.say("Couldn't read the bot's backup: " + e.message); }
  }
  async function bringOut() { const s = exportString(ed.map); const ok = await copyText("/mappaste " + s); setText(ok ? "" : "/mappaste " + s); ed.say(ok ? "Copied: paste it into the farm room's chat and send." : "Copy the text in the box."); }
  async function doc() {
    if (!confirm("Write docs/farm-map-decoded.txt from this layout? (That page goes on GitHub, so traps are left out.)")) return;
    try { await writeDoc(decodedText(ed.map, ed.layout.farm, ed.layout.name)); ed.say("docs/farm-map-decoded.txt is written."); } catch (e: any) { ed.say("Couldn't write it: " + e.message); }
  }
  return (
    <div class="panel">
      <h3>Bring in, bring out</h3>
      <p class="muted">In the farm room, type <code>/mapcopy</code> and paste here. To put a map in the room: <code>/mappaste</code> (you need to be room admin).</p>
      <textarea class="mapstr" placeholder="Paste what /mapcopy copied" value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
      <div class="row"><button class="primary" onClick={bringIn}>Bring the map in</button><button onClick={bringOut}>Copy for /mappaste</button></div>
      <button class="wide" onClick={bringRoom}>Get the room's map from the bot's backup</button>
      <button class="wide" onClick={bringFarm}>Get the bot's spots and zones</button>
      <button class="wide" onClick={doc}>Write the map doc</button>
    </div>
  );
}

// ── the farm layer ──
export function FarmPanel() {
  const [q, setQ] = useState("");
  const F = ed.layout.farm, warns = checkFarm(ed.map, F), S = ed.selected;
  const spots = Object.entries(F.spots).filter(([n]) => !q || n.includes(q.toLowerCase())).sort((a, b) => a[0].localeCompare(b[0]));
  const zones = Object.entries(F.zones).sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <div class="panel">
      <h3>The farm's layer</h3>
      {warns.length ? <ul class="warns">{warns.map((w) => <li class={w.level}><a onClick={() => { if (w.at) { ed.selected = { kind: "tile", at: w.at }; ed.emit(); } }}>{w.text}</a></li>)}</ul> : <p class="ok">Nothing wrong with the spots and zones.</p>}
      {S && S.kind === "spot" && F.spots[S.name] && (
        <div class="edit"><b>{S.name}</b> <span class="muted">{kindOf(S.name).label} · {F.spots[S.name].X},{F.spots[S.name].Y}</span>
          <div class="row"><button onClick={() => { const n = String(prompt("A new name for " + S.name + "?", S.name) || "").trim(); if (n && n !== S.name) { if (F.spots[n]) return ed.say(n + " is taken."); ed.renameSpot(S.name, n); } }}>Rename</button>
            <button class="bad" onClick={() => confirm("Take " + S.name + " off the map?") && ed.deleteSpot(S.name)}>Remove</button></div></div>
      )}
      {S && S.kind === "zone" && F.zones[S.name] && (
        <div class="edit"><b>{S.name}</b> <span class="muted">{F.zones[S.name].group ? "part of " + F.zones[S.name].group : "a place of its own"}</span>
          <div class="row"><button onClick={() => { const n = String(prompt("A new name?", S.name) || "").trim(); if (!n) return; const g = String(prompt("Part of a bigger place? Its name, or empty.", F.zones[S.name].group || "") || "").trim(); ed.renameZone(S.name, n, g || undefined); }}>Rename</button>
            <button class="bad" onClick={() => confirm("Take the zone " + S.name + " away?") && ed.deleteZone(S.name)}>Remove</button></div></div>
      )}
      <h4>Spots ({Object.keys(F.spots).length})</h4>
      <input placeholder="Find a spot" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
      <ul class="list tight">{spots.map(([n, p]) => <li class={S && S.kind === "spot" && S.name === n ? "on" : ""}><span class="dot" style={{ background: kindOf(n).color }} /><a onClick={() => { ed.selected = { kind: "spot", name: n }; ed.emit(); }}>{n}</a><small>{p.X},{p.Y}</small></li>)}</ul>
      <h4>Zones ({zones.length})</h4>
      <ul class="list tight">{zones.map(([n, z]) => <li class={S && S.kind === "zone" && S.name === n ? "on" : ""}><a onClick={() => { ed.selected = { kind: "zone", name: n }; ed.emit(); }}>{n}</a><small>{z.group && z.group !== n ? z.group : ""}</small></li>)}</ul>
    </div>
  );
}

// ── what's shown ──
export function ViewPanel() {
  const v = ed.view, flip = (k: keyof typeof v) => { (v as any)[k] = !(v as any)[k]; ed.emit(); };
  const Box = ({ k, label, hint }: { k: keyof typeof v; label: string; hint?: string }) => <label class="check" title={hint}><input type="checkbox" checked={!!(v as any)[k]} onChange={() => flip(k)} />{label}</label>;
  return (
    <div class="panel">
      <h3>Show</h3>
      <Box k="grid" label="Grid" /><Box k="coords" label="Numbers along the edges" /><Box k="objects" label="Furniture" /><Box k="effects" label="Lighting" />
      <Box k="zones" label="Zones" /><Box k="labels" label="Names on the map" />
      <Box k="walk" label="Where nobody can stand (red ×)" /><Box k="heat" label="Where folks spend their time (from the bot's backup)" />
      <Box k="sight" label="What they see from the picked square" hint="Dark: can't see it. Blue: can't see it, but can hear it. The dashed box is whisper range." />
      <Box k="glaze" label="As players would see the glaze (nothing else)" />
      <h4>Spots</h4>
      {SPOT_KINDS.map((k) => <label class="check"><input type="checkbox" checked={v.spots[k.key]} onChange={() => { v.spots[k.key] = !v.spots[k.key]; ed.emit(); }} /><span class="dot" style={{ background: k.color }} />{k.label}{k.secret ? " (secret)" : ""}</label>)}
    </div>
  );
}

// ── the soft glaze over each kind of spot (Laynie, Nov 7: "a subtle clue easily missed unless you look for it") ──
export function GlazePanel() {
  const T = ed.layout.tints;
  return (
    <div class="panel">
      <h3>Glaze</h3>
      <p class="muted">A faint wash over each kind of spot, like a trapped chest you'd only spot if you were looking. Designed here; the Companion will draw it for players once that's built.</p>
      {SPOT_KINDS.filter((k) => k.key !== "other").map((k) => { const t = tintFor(T, k.key); return (
        <div class="glaze"><span class="dot" style={{ background: t.color }} />{k.label}
          <input type="color" value={t.color} onInput={(e) => { T[k.key] = { color: (e.target as HTMLInputElement).value, alpha: t.alpha }; ed.unsaved = true; ed.emit(); }} />
          <input type="range" min={0} max={0.5} step={0.01} value={t.alpha} onInput={(e) => { T[k.key] = { color: t.color, alpha: +(e.target as HTMLInputElement).value }; ed.unsaved = true; ed.emit(); }} />
          <small>{Math.round(t.alpha * 100)}%</small></div>); })}
      <button onClick={() => { ed.layout.tints = clone(DEFAULT_TINTS); ed.unsaved = true; ed.emit(); }}>Back to the defaults</button>
    </div>
  );
}

// ── stamps: saved pieces of map (a milking stall, a pen, a stretch of glory row) ──
export function StampsPanel() {
  const save = async () => { try { await saveStamps(ed.stamps); } catch (e: any) { ed.say("Couldn't save the stamps: " + e.message); } };
  return (
    <div class="panel">
      <h3>Stamps</h3>
      <p class="muted">Select a block (S), copy it (Ctrl+C), then keep it here. Pick one and click the map to put it down (V).</p>
      <button class="wide" disabled={!ed.clip} onClick={() => { const n = String(prompt("A name for this stamp? (milking stall, pen, glory row…)") || "").trim(); if (!n || !ed.clip) return; ed.stamps = ed.stamps.concat({ ...clone(ed.clip), name: n }); ed.emit(); save(); }}>Keep what's copied as a stamp</button>
      <ul class="list">{ed.stamps.map((s, i) => <li class={ed.clip && ed.clip.name === s.name ? "on" : ""}><a onClick={() => { ed.clip = clone(s); ed.tool = "stamp"; ed.emit(); }}>{s.name}</a><small>{s.w} × {s.h}</small>
        <button class="x" title="Throw it away" onClick={() => { if (confirm("Throw away the stamp " + s.name + "?")) { ed.stamps = ed.stamps.filter((_, j) => j !== i); ed.emit(); save(); } }}>×</button></li>)}{!ed.stamps.length && <li class="muted">None kept yet.</li>}</ul>
    </div>
  );
}

// ── what's on the picked square ──
export function Inspector() {
  const S = ed.selected, p = S && S.kind === "tile" ? S.at : S && S.kind === "spot" ? ed.layout.farm.spots[S.name] : null;
  if (!p) return <div class="panel insp muted">Pick a square with the look tool (L) to see what's on it.</div>;
  const i = idx(p.X, p.Y), m = ed.map, o = m.objects[i] !== BLANK ? objectOf(m.objects[i]) : undefined;
  const spots = Object.entries(ed.layout.farm.spots).filter(([, s]) => s.X === p.X && s.Y === p.Y).map(([n]) => n), zone = ed.zoneAt(p);
  return (
    <div class="panel insp">
      <h3>Square {p.X},{p.Y}</h3>
      <div>Floor: {doodadName(tileOf(m.tiles[i]))}</div>
      <div>Furniture: {o && o.Style !== "Blank" ? doodadName(o) : "none"}</div>
      <div>Lighting: {m.effects[i].length ? m.effects[i].map((id) => effectName(effectOf(id))).join(", ") : "none"}</div>
      <div>Can stand here: {ed.standable(p) ? "yes" : <b class="bad">no</b>}</div>
      {zone && <div>Zone: {zone}</div>}
      {spots.length > 0 && <div>Spots: {spots.join(", ")}</div>}
      {m.cells[i] && m.cells[i].Type === "Sign" && <div>Sign: "{(m.cells[i] as { Text: string }).Text}"</div>}
      {m.cells[i] && m.cells[i].Type === "Teleporter" && <div>Teleport pad{(m.cells[i] as { Destination?: { X: number; Y: number } }).Destination ? " to " + (m.cells[i] as { Destination: { X: number; Y: number } }).Destination.X + ", " + (m.cells[i] as { Destination: { X: number; Y: number } }).Destination.Y : ""}</div>}
      {m.cells[i] && m.cells[i].Type === "Tether" && <div>Tether point</div>}
      {m.settings && m.settings[i] && m.settings[i].ID === m.objects[i] && <div>Turned, sized or coloured in the game</div>}
    </div>
  );
}
export type { Layout };
