// The map studio's side of the studio's little server (studio/server.mjs asks this first; true = handled).
//   /map                         the game's own page with the map studio on top (studio/map/src, built here by esbuild)
//   /__studio/maps/…             layouts: studio/maps/<name>.json, each save keeping the one before in versions/<name>/.
//                                Never on GitHub (.gitignore): a layout knows where every trap is.
//                                The bot's own tab may READ one (its ?layout command), nothing else.
//   /__studio/stamps             kept stamps (studio/maps/_stamps.json)
//   /__studio/farm-now           the bot's spots, zones and heat map from its newest ledger backup in backup/ (read only)
//   /__studio/docs/…             docs/farm-map-decoded.txt, written from the studio (never with a trap in it)
import { readFile, writeFile, mkdir, readdir, stat, copyFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));          // studio/map/
const ROOT = join(HERE, "../..");                                    // the project
const MAPS = process.env.FARM_STUDIO_MAPS || join(HERE, "../maps");  // studio/maps/ (tests point it somewhere else)
const NAME = /^[a-z0-9][a-z0-9-]{0,39}$/;
const KEEP_VERSIONS = 40;

let built = { at: 0, js: "" };
async function newestSource(dir) {
  let t = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    t = Math.max(t, e.isDirectory() ? await newestSource(p) : (await stat(p)).mtimeMs);
  }
  return t;
}
async function bundle() {
  const t = await newestSource(join(HERE, "src"));
  if (built.js && t <= built.at) return built.js;
  const esbuild = await import("esbuild");
  const r = await esbuild.build({ entryPoints: [join(HERE, "src/main.tsx")], bundle: true, write: false, format: "iife", target: "es2020",
    jsx: "automatic", jsxImportSource: "preact", sourcemap: "inline", logLevel: "silent", absWorkingDir: ROOT });
  built = { at: t, js: r.outputFiles[0].text };
  return built.js;
}
async function body(req, max) {
  let s = ""; for await (const c of req) { s += c; if (s.length > max) throw Object.assign(new Error("too big"), { code: 413 }); }
  return s;
}
const json = (res, o, code = 200) => res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-cache" }).end(JSON.stringify(o));

// the bot's newest ledger backup on this computer (it saves one every minute or so to backup/)
async function newestLedger() {
  for (const dir of [join(ROOT, "backup"), join(ROOT, "Backups")]) {
    if (!existsSync(dir)) continue;
    const latest = join(dir, "bnb-ledger-latest.json");
    if (existsSync(latest)) return latest;
    const files = (await readdir(dir)).filter((f) => /^bnb-ledger-.*\.json$/.test(f)).sort();
    if (files.length) return join(dir, files[files.length - 1]);
  }
  return null;
}

export async function mapRoutes(req, res, path, origin, { gameFile, send, GAME_ORIGIN, LIVE }) {
  if (path === "/map" || path === "/map/") {
    const idx = await gameFile("index.html"); if (!idx) { res.writeHead(502).end("the game's page couldn't be fetched"); return true; }
    let html = await readFile(idx, "utf8");
    if (LIVE) html = html.replace("</head>", "<script>window.__studioLive = " + JSON.stringify(LIVE.ver) + ";</script>\n</head>");
    html = html.replace("</body>", `<link rel="stylesheet" href="/__studio/map.css">\n<script src="/__studio/map-studio.js"></script>\n</body>`).replace("<title>Bondage Club</title>", "<title>B&B map studio</title>");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }).end(html);
    return true;
  }
  if (path === "/__studio/map-studio.js") {
    try { res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache" }).end(await bundle()); }
    catch (e) { res.writeHead(500, { "Content-Type": "text/plain" }).end("the map studio didn't build: " + (e && e.message || e)); }
    return true;
  }
  if (path === "/__studio/map.css") { await send(res, join(HERE, "map.css")); return true; }

  if (path.startsWith("/__studio/maps/")) {
    const rest = path.slice("/__studio/maps/".length);
    // the bot's own tab may read a layout (?layout <name>); nothing else from the game's sites
    if (GAME_ORIGIN.test(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Vary", "Origin");
      if (req.method === "OPTIONS") { res.writeHead(204, { "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Private-Network": "true", "Access-Control-Max-Age": "600" }).end(); return true; }
      if (req.method !== "GET") { res.writeHead(403).end("read only"); return true; }
    }
    if (rest === "") {
      const out = [];
      if (existsSync(MAPS)) for (const f of (await readdir(MAPS)).filter((f) => f.endsWith(".json") && !f.startsWith("_")).sort()) {
        try { const L = JSON.parse(await readFile(join(MAPS, f), "utf8")); out.push({ name: f.slice(0, -5), savedAt: L.savedAt, notes: String(L.notes || "").slice(0, 200) }); } catch (e) { /* a broken file is skipped */ }
      }
      json(res, { layouts: out }); return true;
    }
    let m = /^([a-z0-9][a-z0-9-]{0,39})\.json$/.exec(rest);
    if (m) {
      const file = join(MAPS, m[1] + ".json");
      if (req.method === "POST") {
        const text = await body(req, 3e6), L = JSON.parse(text);
        if (!L || typeof L !== "object" || !L.map || !L.farm) { res.writeHead(400).end("that isn't a layout"); return true; }
        await mkdir(MAPS, { recursive: true });
        if (existsSync(file)) {   // the one before is kept
          const vdir = join(MAPS, "versions", m[1]); await mkdir(vdir, { recursive: true });
          let was = ""; try { was = JSON.parse(await readFile(file, "utf8")).savedAt || ""; } catch (e) { /* fine */ }
          const stamp = (was || new Date((await stat(file)).mtimeMs).toISOString()).replace(/[:.]/g, "-");
          await copyFile(file, join(vdir, stamp + ".json"));
          const old = (await readdir(vdir)).filter((f) => f.endsWith(".json")).sort();
          for (const f of old.slice(0, Math.max(0, old.length - KEEP_VERSIONS))) await unlink(join(vdir, f));
        }
        await writeFile(file, text);
        json(res, { saved: m[1] }); return true;
      }
      if (!existsSync(file)) { res.writeHead(404, { "Content-Type": "text/plain" }).end("no layout called " + m[1]); return true; }
      await send(res, file); return true;
    }
    m = /^([a-z0-9][a-z0-9-]{0,39})\/versions(?:\/([0-9TZ-]+\.json))?$/.exec(rest);
    if (m) {
      const vdir = join(MAPS, "versions", m[1]);
      if (m[2]) { await send(res, join(vdir, m[2])); return true; }
      const list = existsSync(vdir) ? (await readdir(vdir)).filter((f) => f.endsWith(".json")).sort().reverse() : [];
      json(res, { versions: list.map((f) => ({ file: f, savedAt: f.slice(0, -5).replace(/^(\d{4}-\d\d-\d\dT\d\d)-(\d\d)-(\d\d)-(\d+)Z$/, "$1:$2:$3.$4Z") })) });
      return true;
    }
    res.writeHead(400).end("bad path"); return true;
  }
  if (path === "/__studio/stamps") {
    const file = join(MAPS, "_stamps.json");
    if (req.method === "POST") { const text = await body(req, 3e6); JSON.parse(text); await mkdir(MAPS, { recursive: true }); await writeFile(file, text); json(res, { saved: true }); return true; }
    if (!existsSync(file)) { json(res, { stamps: [] }); return true; }
    await send(res, file); return true;
  }
  if (path === "/__studio/farm-now") {
    if (GAME_ORIGIN.test(origin)) { res.writeHead(403).end("not from the game"); return true; }
    const f = await newestLedger();
    if (!f) { res.writeHead(404, { "Content-Type": "text/plain" }).end("there's no ledger backup on this computer (the bot saves one to backup/ when its backup folder is set)"); return true; }
    const L = JSON.parse(await readFile(f, "utf8")), heat = (L.mods && L.mods["map-tools"] && L.mods["map-tools"].heat && L.mods["map-tools"].heat.time) || {};
    const snap = L.roomSnapshot && L.roomSnapshot.room, map = snap && snap.MapData && typeof snap.MapData.Tiles === "string" ? snap.MapData : null;   // the room as the bot last saw it
    json(res, { farm: { spots: L.spots || {}, zones: L.zones || {} }, heat, map, mapAt: (L.roomSnapshot && L.roomSnapshot.at) || null,
      from: f.split(/[\\/]/).slice(-2).join("/"), at: new Date((await stat(f)).mtimeMs).toISOString() });
    return true;
  }
  if (path === "/__studio/docs/farm-map-decoded.txt" && req.method === "POST") {
    const text = await body(req, 600000);
    if (/(^|[^a-z])trap-/i.test(text)) { res.writeHead(400).end("that has a trap in it, and this page is public: not written"); return true; }
    await writeFile(join(ROOT, "docs", "farm-map-decoded.txt"), text);
    json(res, { written: true }); return true;
  }
  return false;
}
