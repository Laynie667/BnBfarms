// Nov 14: the map studio (studio/map). Laynie: "similar to the outfit studio, could we make a map studio?" → "all of it".
// What's checked here, without a browser: the TypeScript is sound (tsc), the editing works (fill, blocks and stamps, a
// moved block takes its spots and zones along, undo), the farm checks catch a spot nobody can stand on, the doc never
// lists a trap, and the studio's server keeps layouts to this computer (only the bot's own game tab may read one; no
// web page may save one or read the bot's backup; a doc with a trap in it is refused).
const fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync } = require("child_process");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ROOT = path.join(__dirname, "..");

(async () => {
  // ── the TypeScript is sound ──
  let tscOk = true, tscOut = "";
  try { execFileSync(process.execPath, [path.join(ROOT, "node_modules/typescript/bin/tsc"), "-p", path.join(ROOT, "studio/map")], { stdio: "pipe" }); }
  catch (e) { tscOk = false; tscOut = String(e.stdout || e.message).slice(0, 400); }
  ok(tscOk, "the map studio type-checks " + tscOut);

  // ── the editing, built from the studio's own source ──
  const esbuild = require(path.join(ROOT, "node_modules/esbuild"));
  const entry = "export * from './studio/map/src/model'; export * from './studio/map/src/farm'; export { decodedText } from './studio/map/src/doc'; export { Editor } from './studio/map/src/editor';";
  const r = esbuild.buildSync({ stdin: { contents: entry, resolveDir: ROOT, loader: "ts" }, bundle: true, write: false, format: "cjs", platform: "node",
    jsx: "automatic", jsxImportSource: "preact", logLevel: "silent" });
  // the game's catalogue, as the studio finds it in the page: a plain floor, a wall, water, a bed, nothing
  globalThis.MapDataTiles = new Map([[100, { ID: 100, Type: "Floor", Style: "OakWood", Name: "Oak Planks" }], [215, { ID: 215, Type: "FloorExterior", Style: "LongGrass", Name: "Long Grass" }],
    [1000, { ID: 1000, Type: "Wall", Style: "MixedWood" }], [2000, { ID: 2000, Type: "Water", Style: "Pool", Name: "Pool" }]]);
  globalThis.MapDataObjects = new Map([[100, { ID: 100, Type: "LivingRoom", Style: "Blank" }], [166, { ID: 166, Type: "Bedroom", Style: "Bed" }],
    [900, { ID: 900, Type: "FloorObstacle", Style: "Rock", CanEnter: () => false }]]);
  globalThis.MapDataEffects = new Map([[10, { ID: 10, Type: "StaticLighting" }]]);
  const mod = { exports: {} }; new Function("module", "exports", "require", r.outputFiles[0].text)(mod, mod.exports, require); const M = mod.exports;
  const { Editor, newLayout, idx, checkFarm, decodedText, kindOf } = M;
  const ed = new Editor(); const L = newLayout("test"); ed.load(L);
  // a little farm: grass with a wall row at y=10 and a rock at 5,5
  for (let i = 0; i < 1600; i++) ed.map.tiles[i] = 215;
  for (let x = 0; x < 40; x++) ed.map.tiles[idx(x, 10)] = 1000;
  ed.map.objects[idx(5, 5)] = 900;
  ed.pick = { layer: "tiles", id: 2000 }; ed.fillAt({ X: 3, Y: 3 });
  ok(ed.map.tiles[idx(3, 3)] === 2000 && ed.map.tiles[idx(3, 20)] === 215 && ed.map.tiles.filter((t) => t === 2000).length === 400, "fill stops at the wall: the 400 squares above it, none below");
  ed.undo(); ok(ed.map.tiles[idx(3, 3)] === 215 && ed.map.tiles.filter((t) => t === 2000).length === 0, "...and undo puts it back");
  ed.layout.farm.spots = { "trough-1": { X: 12, Y: 12 }, "trap-snare": { X: 13, Y: 12 }, "glory-1": { X: 20, Y: 20 }, stocks: { X: 5, Y: 5 }, wally: { X: 2, Y: 10 } };
  ed.layout.farm.zones = { pen: { a: { X: 11, Y: 11 }, b: { X: 14, Y: 13 } }, half: { a: { X: 30, Y: 30 } } };
  ed.sel = { a: { X: 11, Y: 11 }, b: { X: 14, Y: 13 } }; ed.map.objects[idx(12, 12)] = 166;
  ed.moveSel(5, 2);
  const F = ed.layout.farm;
  ok(F.spots["trough-1"].X === 17 && F.spots["trough-1"].Y === 14 && F.spots["trap-snare"].X === 18, "a moved block takes its spots along");
  ok(F.zones.pen.a.X === 16 && F.zones.pen.b.Y === 15, "...and its zones");
  ok(ed.map.objects[idx(17, 14)] === 166 && ed.map.objects[idx(12, 12)] === 100, "...and its furniture, leavin' nothing behind");
  ed.undo(); ok(F !== ed.layout.farm && ed.layout.farm.spots["trough-1"].X === 12, "undo moves it all back");
  ed.sel = { a: { X: 4, Y: 4 }, b: { X: 6, Y: 6 } }; ed.copy(); ed.stampHere({ X: 30, Y: 2 });
  ok(ed.map.objects[idx(31, 3)] === 900 && ed.clip.w === 3 && ed.clip.h === 3, "copy and stamp a block elsewhere");
  // the checks
  const warns = checkFarm(ed.map, ed.layout.farm).map((w) => w.text).join(" | ");
  ok(/stocks is on a square nobody can stand on/.test(warns), "a spot on a rock: nobody can stand there");
  ok(/wally is on a square nobody can stand on/.test(warns), "a spot on a wall: the same");
  ok(/glory-1 has no visitor side/.test(warns), "a glory hole with no visitor side");
  ok(/zone half is missing its B corner/.test(warns), "a zone with one corner");
  ok(!/trough-1/.test(warns), "a good spot is left alone");
  ok(kindOf("trap-snare").secret && kindOf("water-3").key === "water" && kindOf("trough-2").key === "feed", "spots know their kind from their name");
  const doc = decodedText(ed.map, ed.layout.farm, "test");
  ok(/trough-1 @12,12/.test(doc) && !/trap-/.test(doc), "the map doc lists spots, never a trap");
  ok(/^PICTURE/m.test(doc) && /^LEGEND/m.test(doc) && /^ZONES/m.test(doc), "...with the picture, the legend and the zones");

  // ── the studio's server: kept to this computer ──
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bnb-maps-")); process.env.FARM_STUDIO_MAPS = tmp;
  const { mapRoutes } = await import("file://" + path.join(ROOT, "studio/map/routes.mjs").replace(/\\/g, "/"));
  const GAME_ORIGIN = /^https:\/\/([a-z0-9-]+[.])*(bondageprojects[.]elementfx[.]com)$/;
  const call = async (method, url, origin, body) => {
    const res = { code: 0, headers: {}, text: "", setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, writeHead(c, h) { this.code = c; Object.assign(this.headers, h || {}); return this; }, end(t) { this.text = String(t == null ? "" : t); return this; } };
    const req = { method, headers: { origin: origin || "" }, async *[Symbol.asyncIterator]() { if (body) yield Buffer.from(body); } };
    const handled = await mapRoutes(req, res, url, origin || "", { gameFile: async () => null, send: async (rs, f) => { rs.writeHead(200).end(fs.readFileSync(f, "utf8")); }, GAME_ORIGIN, LIVE: null });
    return Object.assign(res, { handled });
  };
  const layout = JSON.stringify(Object.assign(newLayout("race-day"), { notes: "first" }));
  let x = await call("POST", "/__studio/maps/race-day.json", "", layout);
  ok(x.code === 200 && fs.existsSync(path.join(tmp, "race-day.json")), "the studio saves a layout");
  await call("POST", "/__studio/maps/race-day.json", "", layout.replace('"first"', '"second"'));
  x = await call("GET", "/__studio/maps/race-day/versions", "");
  ok(JSON.parse(x.text).versions.length === 1, "...and keeps the one before as a version");
  x = await call("GET", "/__studio/maps/race-day.json", "https://www.bondageprojects.elementfx.com");
  ok(x.code === 200 && x.headers["access-control-allow-origin"] === "https://www.bondageprojects.elementfx.com", "the bot's own game tab may read a layout (?layout)");
  x = await call("POST", "/__studio/maps/race-day.json", "https://www.bondageprojects.elementfx.com", layout);
  ok(x.code === 403, "...but never save one");
  x = await call("GET", "/__studio/maps/race-day.json", "https://evil.example");
  ok(!x.headers["access-control-allow-origin"], "another website gets no permission to read it");
  x = await call("GET", "/__studio/farm-now", "https://www.bondageprojects.elementfx.com");
  ok(x.code === 403, "a game page can't read the bot's backup");
  x = await call("POST", "/__studio/maps/race-day.json", "", "{\"nope\":1}");
  ok(x.code === 400, "something that isn't a layout isn't saved");
  x = await call("GET", "/__studio/maps/..%2f..%2fsecret.json", "");
  ok(x.code === 400, "no climbin' out of the folder");
  x = await call("POST", "/__studio/docs/farm-map-decoded.txt", "", "SPOTS\n  trap-snare @1,1\n");
  ok(x.code === 400, "a doc with a trap in it is refused (that page is public)");
  ok(!fs.readFileSync(path.join(ROOT, "docs/farm-map-decoded.txt"), "utf8").includes("trap-snare"), "...and the doc is left as it was");
  fs.rmSync(tmp, { recursive: true, force: true });

  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
