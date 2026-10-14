// The outfit studio's little server. It runs on this computer only and talks to nobody.
//   node studio/server.mjs [path to the game's BondageClub folder] [port]
// It serves the game's own files (pictures, item list, drawing code) from your copy of the game, and adds the
// studio's panel on top. Nothing is signed in to: the game's code is only used to draw.
// Then open http://localhost:4780/ in a browser.
import { createServer } from "node:http";
import { readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const GAME = resolve(process.argv[2] || join(HERE, "../../reference/Bondage-College-new/Bondage-College-master/BondageClub"));
const PORT = Number(process.argv[3] || process.env.PORT || 4780);
const WEB = join(HERE, "web");
const FITS = join(HERE, "fits");                                  // what the sliders save: one small JSON file per body part
const BELLY_SRC = join(HERE, "../extension/src/belly.js");        // the Companion's own belly drawing: the studio draws with the very same code
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
  ".csv": "text/csv; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2", ".ico": "image/x-icon" };

if (!existsSync(join(GAME, "index.html"))) {
  console.error("I can't find the game at " + GAME + "\nGive me the folder that has index.html, Assets and Scripts in it:\n  node studio/server.mjs \"C:\\path\\to\\BondageClub\"");
  process.exit(1);
}
// a file inside `root`, or null if the address tries to climb out of it
function inside(root, urlPath) {
  const p = normalize(join(root, decodeURIComponent(urlPath)));
  return p === root || p.startsWith(root + sep) ? p : null;
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
      let html = await readFile(join(GAME, "index.html"), "utf8");
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
    if (path.startsWith("/__studio/")) { const f = inside(WEB, path.slice("/__studio/".length)); if (f) return send(res, f); }
    const f = inside(GAME, path);
    // A piece the game only draws for a flat chest (the Button Shirt, the vests: "male" clothes) has no pictures for a chest
    // with breasts, and draws nothing there. Its flat-chest picture is sent instead, and fitted to her like anything else.
    // (Laynie, Oct 14: "some clothes are gendered~ but no worries we can plan for them anyway".)
    if (f && !existsSync(f) && /_(Small|Normal|Large|XLarge)(?=[_.])/.test(f)) { const flat = f.replace(/_(Small|Normal|Large|XLarge)(?=[_.])/, "_FlatMedium"); if (existsSync(flat)) return send(res, flat); }
    if (f) return send(res, f);
    res.writeHead(403).end("no");
  } catch (e) { res.writeHead(500, { "Content-Type": "text/plain" }).end(String(e && e.message || e)); }
}).listen(PORT, "127.0.0.1", () => console.log("B&B outfit studio: http://localhost:" + PORT + "/\nGame files from: " + GAME + "\nThis computer only. Ctrl+C stops it."));
