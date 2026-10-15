// The outfit studio's little server. It runs on this computer only and signs in to nothing.
//   node studio/server.mjs live [port]             the live game's own files, fetched from its site as they're needed
//   node studio/server.mjs live:R132 [port]        ...a version of your choosing
//   node studio/server.mjs [path to a BondageClub folder] [port]   a copy of the game on this computer (the default:
//                                                  the one in reference/, the developers' newest work)
// It serves the game's own files (pictures, item list, drawing code) and adds the studio's panel on top. The game's
// code is only used to draw. Then open http://localhost:4780/ in a browser.
// LIVE (Laynie, Oct 14: sharing the studio with players): nothing to download first. Each game file is fetched from the
// live game's own site the first time the studio asks for it and kept in studio/game-cache/<version>, so it's the very
// version players are on (and the Echo mod, made for it, behaves as in the game). Needs the internet the first time.
import { createServer } from "node:http";
import { readFile, stat, writeFile, mkdir, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const ARG = String(process.argv[2] || "");
const GAME = resolve(ARG && !/^live/i.test(ARG) ? ARG : join(HERE, "../../reference/Bondage-College-new/Bondage-College-master/BondageClub"));
const LIVE_SITE = "https://www.bondageprojects.elementfx.com/";
let LIVE = null;   // { ver, base, dir, missing, busy } when the game comes from its site
const PORT = Number(process.argv[3] || process.env.PORT || 4780);
const WEB = join(HERE, "web");
const FITS = join(HERE, "fits");                                  // what the sliders save: one small JSON file per body part
const BELLY_SRC = join(HERE, "../extension/src/belly.js");
const ECHO_RES = (() => { const p = join(HERE, "../../reference/addons/echocloth-new/resources"); return existsSync(p) ? p : null; })();   // the Echo clothing mod's pictures, if a copy is here        // the Companion's own belly drawing: the studio draws with the very same code
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
  ".csv": "text/csv; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2", ".ico": "image/x-icon" };

if (/^live/i.test(ARG)) {
  // which version: the one asked for, or the newest the site has (old versions stay up, so: count up till one isn't there)
  let ver = (/^live:(R\d+)$/i.exec(ARG) || [])[1];
  if (!ver) {
    for (let n = 132; n < 160; n++) {
      try { const r = await fetch(LIVE_SITE + "R" + n + "/BondageClub/index.html"); if (!r.ok) break; await r.arrayBuffer(); ver = "R" + n; } catch (e) { break; }
    }
  }
  if (!ver) { console.error("I couldn't reach the game's site (" + LIVE_SITE + "). Is this computer online? Or use a copy of the game: node studio/server.mjs \"C:\\path\\to\\BondageClub\""); process.exit(1); }
  ver = ver.toUpperCase();
  LIVE = { ver, base: LIVE_SITE + ver + "/BondageClub/", dir: join(HERE, "game-cache", ver), missing: new Set(), busy: new Map() };
} else if (!existsSync(join(GAME, "index.html"))) {
  console.error("I can't find the game at " + GAME + "\nGive me the folder that has index.html, Assets and Scripts in it:\n  node studio/server.mjs \"C:\\path\\to\\BondageClub\"");
  process.exit(1);
}
// a file inside `root`, or null if the address tries to climb out of it
function inside(root, urlPath) {
  const p = normalize(join(root, decodeURIComponent(urlPath)));
  return p === root || p.startsWith(root + sep) ? p : null;
}
// a game file, by its address in the game ("Scripts/Drawing.js"): the file on this computer, or null if the game has none.
// Live, it's fetched from the site the first time and kept; one fetch at a time per file, and a miss is remembered.
async function gameFile(rel) {
  rel = String(rel).replace(/^\/+/, "");
  const root = LIVE ? LIVE.dir : GAME, f = normalize(join(root, rel));
  if (!(f === root || f.startsWith(root + sep))) return null;
  if (existsSync(f)) return f;
  if (!LIVE || LIVE.missing.has(rel)) return null;
  let p = LIVE.busy.get(rel);
  if (!p) {
    p = (async () => {
      const r = await fetch(LIVE.base + rel.split("/").map(encodeURIComponent).join("/"));
      if (!r.ok) { if (r.status === 404) LIVE.missing.add(rel); return null; }
      const buf = Buffer.from(await r.arrayBuffer());
      await mkdir(dirname(f), { recursive: true }); const tmp = f + ".part" + process.pid; await writeFile(tmp, buf); await rename(tmp, f);
      return f;
    })().catch(() => null).finally(() => LIVE.busy.delete(rel));
    LIVE.busy.set(rel, p);
  }
  return p;
}
async function send(res, file) {
  try {
    const st = await stat(file);
    if (st.isDirectory()) { res.writeHead(404).end("not a file"); return; }
    res.writeHead(200, { "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": "no-cache" });
    res.end(await readFile(file));
  } catch (e) { res.writeHead(404, { "Content-Type": "text/plain" }).end("not found"); }
}
// The game's own sites: the Companion there may READ what the studio has saved (its "Get my studio's settings" button).
// Nothing else is shared, and only the studio's own page may save. (Any web page can send this computer a request;
// without this, one could have written into the studio's saved fits.)
const GAME_ORIGIN = new RegExp("^https://([a-z0-9-]+[.])*(bondageprojects[.]elementfx[.]com|bondage-europe[.]com|bondageprojects[.]com|bondage-asia[.]com|bondageeurope[.]com)$");
const OWN_ORIGIN = new RegExp("^http://(localhost|127[.]0[.]0[.]1)(:[0-9]+)?$");
createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://localhost").pathname, origin = String(req.headers.origin || "");
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS" && origin && !OWN_ORIGIN.test(origin)) { res.writeHead(403).end("not from here"); return; }
    if (path.startsWith("/__studio/fits/") && GAME_ORIGIN.test(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Vary", "Origin");
      if (req.method === "OPTIONS") { res.writeHead(204, { "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Private-Network": "true", "Access-Control-Max-Age": "600" }).end(); return; }
      if (req.method !== "GET") { res.writeHead(403).end("read only"); return; }
    }
    if (path === "/" || path === "/index.html") {
      // the game's own page, with the studio added at the end
      const idx = await gameFile("index.html"); if (!idx) { res.writeHead(502).end("the game's page couldn't be fetched"); return; }
      let html = await readFile(idx, "utf8");
      if (LIVE) html = html.replace("</head>", "<script>window.__studioLive = " + JSON.stringify(LIVE.ver) + ";</script>\n</head>");   // (studio.js: the live game's own drawing is used as it is)
      html = html.replace("</body>", `<link rel="stylesheet" href="/__studio/studio.css">\n<script src="/__studio/belly-drawing.js"></script>\n<script src="/__studio/breasts-drawing.js"></script>\n<script src="/__studio/cock-drawing.js"></script>\n<script src="/__studio/body-engine.js"></script>\n<script src="/__studio/studio.js"></script>\n</body>`).replace("<title>Bondage Club</title>", "<title>B&B outfit studio</title>");
      res.writeHead(200, { "Content-Type": TYPES[".html"], "Cache-Control": "no-cache" }).end(html);
      return;
    }
    if (path === "/__studio/belly-drawing.js") {
      const src = await readFile(BELLY_SRC, "utf8"), a = src.indexOf("// >>> belly drawing"), b = src.indexOf("// <<< belly drawing");
      if (a < 0 || b < 0) { res.writeHead(500).end("the belly drawing block isn't marked in extension/src/belly.js"); return; }
      res.writeHead(200, { "Content-Type": TYPES[".js"], "Cache-Control": "no-cache" }).end("(() => {\n" + src.slice(a, b) + "\nwindow.FarmBelly = { SIZES, bellyCanvas, bellyPlace, bellyPose, skinPatch, skinGate, FALLBACK };\n})();\n");   // wrapped, so its names can't clash with the game's
      return;
    }
    if (path.startsWith("/__studio/catalogue/")) {
      // a page of the catalogue, made in the browser: kept as a picture on this computer (never in the repo)
      const name = path.slice("/__studio/catalogue/".length);
      if (!/^[a-z0-9-]{1,80}\.png$/.test(name)) { res.writeHead(400).end("bad name"); return; }
      const dir = join(HERE, "catalogue"), file = join(dir, name);
      if (req.method === "POST") {
        const chunks = []; let size = 0; for await (const chunk of req) { size += chunk.length; if (size > 30e6) { res.writeHead(413).end("too big"); return; } chunks.push(chunk); }
        await mkdir(dir, { recursive: true }); await writeFile(file, Buffer.concat(chunks));
        res.writeHead(200, { "Content-Type": "text/plain" }).end("saved"); return;
      }
      return send(res, file);
    }
    if (path.startsWith("/__studio/fits/")) {
      const name = path.slice("/__studio/fits/".length);
      if (!/^[a-z0-9-]{1,40}\.json$/.test(name)) { res.writeHead(400).end("bad name"); return; }
      const file = join(FITS, name);
      if (req.method === "POST") {
        let body = ""; for await (const chunk of req) { body += chunk; if (body.length > 200000) { res.writeHead(413).end("too big"); return; } }
        JSON.parse(body);   // must be JSON, or it isn't kept
        await mkdir(FITS, { recursive: true }); await writeFile(file, body);
        res.writeHead(200, { "Content-Type": "text/plain" }).end("saved"); return;
      }
      if (!existsSync(file)) { res.writeHead(200, { "Content-Type": TYPES[".json"] }).end("null"); return; }
      return send(res, file);
    }
    // The Echo clothing mod's pictures, for the studio: its own copy on this computer when it's there, otherwise fetched from
    // its site here (the newer game copy the studio draws with asks the site in a way it refuses from a page).
    if (path.startsWith("/__echo/")) {
      const rel = decodeURIComponent(path.slice("/__echo/".length)).split("/").slice(1).join("/");   // (the first part is the version)
      // (Echo also carries its own redrawn copies of many of the game's pictures, the body's among them: same size, more
      // shading. Those are what the game shows with Echo in, so the studio shows them too.)
      const local = ECHO_RES && inside(ECHO_RES, rel);
      if (local && existsSync(local)) return send(res, local);
      const ver = path.slice("/__echo/".length).split("/")[0];
      if (!/^[0-9a-f]{7,40}$/.test(ver) || !(rel.startsWith("Assets/") && rel.toLowerCase().endsWith(".png")) || rel.includes("..")) { res.writeHead(400).end("bad path"); return; }
      const up = await fetch("https://cdn.jsdelivr.net/gh/SugarChain-Studio/echo-clothing-ext@" + ver + "/resources/" + rel.split("/").map(encodeURIComponent).join("/"));
      if (!up.ok) { res.writeHead(up.status).end("not found"); return; }
      const buf = Buffer.from(await up.arrayBuffer());
      res.writeHead(200, { "Content-Type": "image/png", "Content-Length": buf.length, "Cache-Control": "max-age=86400" }).end(buf); return;
    }
    if (path.startsWith("/__studio/")) { const f = inside(WEB, path.slice("/__studio/".length)); if (f) return send(res, f); }
    let rel; try { rel = decodeURIComponent(path).replace(/^\/+/, ""); } catch (e) { res.writeHead(400).end("bad path"); return; }
    if (rel.split("/").includes("..")) { res.writeHead(403).end("no"); return; }
    let f = await gameFile(rel);
    // A piece the game only draws for a flat chest (the Button Shirt, the vests: "male" clothes) has no pictures for a chest
    // with breasts, and draws nothing there. Its flat-chest picture is sent instead, and fitted to her like anything else.
    // (Laynie, Oct 14: "some clothes are gendered~ but no worries we can plan for them anyway".)
    if (!f && /_(Small|Normal|Large|XLarge)(?=[_.])/.test(rel)) f = await gameFile(rel.replace(/_(Small|Normal|Large|XLarge)(?=[_.])/, "_FlatMedium"));
    if (f) return send(res, f);
    res.writeHead(404, { "Content-Type": "text/plain" }).end("not found");
  } catch (e) { res.writeHead(500, { "Content-Type": "text/plain" }).end(String(e && e.message || e)); }
}).listen(PORT, "127.0.0.1", () => console.log("B&B outfit studio: http://localhost:" + PORT + "/\nGame files from: " + (LIVE ? "the live game, " + LIVE.ver + " (" + LIVE.base + "), kept in " + LIVE.dir : GAME) + "\nThis computer only. Ctrl+C stops it."));
