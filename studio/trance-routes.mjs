// THE TRANCE EDITOR'S ROUTES (Nov 25, Laynie: "a session editor so I can add real hypnotic scripts, set the pacing, and
// choose a range for the binaurals"; "probably with me, with pushes to the bot"). http://localhost:4780/trance
//   <dir>/library.txt     what she's workin' on (saved as she goes; the last 30 saves kept in <dir>/old/)
//   <dir>/published.txt   what she last pushed, and published.json its stamp: the bot's own game tab reads these, nothing else
// <dir> is studio/trance/ (never on GitHub: her scripts are hers), or a test studio's own folder.
import { readFile, writeFile, mkdir, rename, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

async function readBody(req, max) {
  let body = ""; for await (const chunk of req) { body += chunk; if (body.length > max) return null; }
  return body;
}
async function keepOld(dir, text) {
  const old = join(dir, "old"); await mkdir(old, { recursive: true });
  await writeFile(join(old, "library-" + new Date().toISOString().replace(/[:.]/g, "-") + ".txt"), text);
  const all = (await readdir(old)).filter((f) => /^library-.*\.txt$/.test(f)).sort();
  for (const f of all.slice(0, Math.max(0, all.length - 30))) await unlink(join(old, f)).catch(() => {});
}
// true when it answered. ctx: { dir, shared, web, send(res, file), GAME_ORIGIN, OWN_ORIGIN }
export async function tranceRoutes(req, res, path, origin, ctx) {
  const { dir, shared, web, send, GAME_ORIGIN } = ctx;
  if (path === "/trance" || path === "/trance/") { await send(res, join(web, "trance.html")); return true; }
  if (path.startsWith("/__shared/")) {
    const name = path.slice("/__shared/".length);
    if (!/^[a-z0-9-]{1,40}\.js$/.test(name)) { res.writeHead(400).end("bad name"); return true; }
    await send(res, join(shared, name)); return true;
  }
  if (!path.startsWith("/__studio/trance/")) return false;
  const name = path.slice("/__studio/trance/".length);
  // the game's sites (the bot's own tab) may only read what was pushed
  if (origin && GAME_ORIGIN.test(origin)) {
    if (!/^published\.(json|txt)$/.test(name)) { res.writeHead(403).end("not from there"); return true; }
    res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Vary", "Origin");
    if (req.method === "OPTIONS") { res.writeHead(204, { "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Private-Network": "true", "Access-Control-Max-Age": "600" }).end(); return true; }
    if (req.method !== "GET") { res.writeHead(403).end("read only"); return true; }
  } else if (origin && !(ctx.OWN_ORIGIN && ctx.OWN_ORIGIN.test(origin))) { res.writeHead(403).end("not from there"); return true; }
  if (name === "library.txt") {
    const file = join(dir, "library.txt");
    if (req.method === "POST") {
      const body = await readBody(req, 1000000); if (body == null) { res.writeHead(413).end("too big"); return true; }
      await mkdir(dir, { recursive: true });
      if (existsSync(file)) { const was = await readFile(file, "utf8"); if (was !== body) await keepOld(dir, was); }
      await writeFile(file, body);
      res.writeHead(200, { "Content-Type": "text/plain" }).end("saved"); return true;
    }
    if (!existsSync(file)) { res.writeHead(404, { "Content-Type": "text/plain" }).end("none yet"); return true; }
    await send(res, file); return true;
  }
  if (name === "publish" && req.method === "POST") {
    // the push: what's in the editor now becomes what the bot reads (and is saved as the workin' copy too)
    const body = await readBody(req, 1000000); if (body == null) { res.writeHead(413).end("too big"); return true; }
    let info = {}; try { info = JSON.parse(req.headers["x-trance-info"] || "{}"); } catch (e) { info = {}; }
    await mkdir(dir, { recursive: true });
    const lib = join(dir, "library.txt");
    if (existsSync(lib)) { const was = await readFile(lib, "utf8"); if (was !== body) await keepOld(dir, was); }
    await writeFile(lib, body);
    await writeFile(join(dir, "published.txt.tmp"), body); await rename(join(dir, "published.txt.tmp"), join(dir, "published.txt"));
    const pub = { stamp: Date.now().toString(36), at: new Date().toISOString(), blocks: Number(info.blocks) || 0, errors: Number(info.errors) || 0 };
    await writeFile(join(dir, "published.json"), JSON.stringify(pub));
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(pub)); return true;
  }
  if (name === "published.json" || name === "published.txt") {
    const file = join(dir, name);
    if (!existsSync(file)) { res.writeHead(200, { "Content-Type": name.endsWith(".json") ? "application/json" : "text/plain", "Cache-Control": "no-store" }).end(name.endsWith(".json") ? "{}" : ""); return true; }
    await send(res, file); return true;
  }
  res.writeHead(404).end("not found"); return true;
}
