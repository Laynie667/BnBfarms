// THE TRANCE EDITOR'S ROUTES (Nov 25, Laynie: "a session editor so I can add real hypnotic scripts, set the pacing, and
// choose a range for the binaurals"; "probably with me, with pushes to the bot"). http://localhost:4780/trance
//   <dir>/library.txt     what she's workin' on (saved as she goes; the last 30 saves kept in <dir>/old/)
//   <dir>/published.txt   what she last pushed, and published.json its stamp: the bot's own game tab reads these, nothing else
// <dir> is studio/trance/ (never on GitHub: her scripts are hers), or a test studio's own folder.
//   <dir>/sets.json       her picture sets for the visor ({ name: [links] }), kept as she goes
// THE VISOR'S PUBLIC LIST (Nov 25; Laynie: "select which sessions load from a list I make publically accessible"):
// "Publish for visors" writes the sessions she marked "visor: yes" (and the trance blocks they're made of) and her picture
// sets into public/visor/, then puts just those files on GitHub (tools/publish-visor.mjs), where every Companion reads them.
import { readFile, writeFile, mkdir, rename, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { execFile } from "node:child_process";

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
  // the visor's picture sets, as she keeps them
  if (name === "sets.json") {
    const file = join(dir, "sets.json"), V = await visorLib(ctx);
    if (req.method === "POST") {
      const body = await readBody(req, 300000); if (body == null) { res.writeHead(413).end("too big"); return true; }
      let sets; try { sets = cleanSets(JSON.parse(body), V); } catch (e) { res.writeHead(400).end("not a list of sets"); return true; }
      await mkdir(dir, { recursive: true }); await writeFile(file, JSON.stringify(sets, null, 1));
      res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ saved: Object.keys(sets).length })); return true;
    }
    if (!existsSync(file)) { res.writeHead(200, { "Content-Type": "application/json" }).end("{}"); return true; }
    await send(res, file); return true;
  }
  // publish for visors: the public list, then (her real studio) onto GitHub
  if (name === "publish-visor" && req.method === "POST") {
    const body = await readBody(req, 1000000); if (body == null) { res.writeHead(413).end("too big"); return true; }
    const T = await import(pathToFileURL(join(ctx.shared, "trance-script.js")).href), V = await visorLib(ctx);
    const lib = T.parseLibrary(body), good = lib.blocks.filter((b) => !b.bad);
    const sessions = good.filter((b) => b.kind === "session" && b.labels.visor);
    if (!sessions.length) { res.writeHead(400, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "No session is marked for visors yet: tick \"for visors\" on the sessions crafters may pick." })); return true; }
    const blocks = good.filter((b) => V.VISOR_KINDS.includes(b.kind)).concat(sessions);
    let sets = {}; try { sets = cleanSets(JSON.parse(await readFile(join(dir, "sets.json"), "utf8")), V); } catch (e) { sets = {}; }
    const pub = ctx.publicDir; await mkdir(pub, { recursive: true });
    await writeFile(join(pub, "library.txt"), "# The farm's public visor list: the sessions crafters can pick for a visor, and what they're made of.\n# Published from the trance studio. Edit it there, not here.\n\n" + T.formatLibrary(blocks));
    await writeFile(join(pub, "sets.json"), JSON.stringify(sets, null, 1) + "\n");
    const index = { at: new Date().toISOString(), sessions: sessions.map((b) => ({ name: b.name, level: (b.labels.level && b.labels.level.length ? b.labels.level : T.LEVELS) })), sets: Object.keys(sets) };
    await writeFile(join(pub, "index.json"), JSON.stringify(index, null, 1) + "\n");
    const out = { wrote: true, sessions: index.sessions.length, sets: index.sets.length };
    if (ctx.github) out.github = await new Promise((ok) => execFile(process.execPath, [ctx.github], { timeout: 120000 }, (err, so, se) => ok(err ? "not sent: " + String(se || so || err.message).trim().split("\n").pop().slice(0, 200) : String(so).trim().split("\n").pop().slice(0, 200))));
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(out)); return true;
  }
  res.writeHead(404).end("not found"); return true;
}
async function visorLib(ctx) { return import(pathToFileURL(join(ctx.shared, "visor.js")).href); }
// { name: [links] }: up to 40 sets, each up to 20 links straight to a picture
function cleanSets(v, V) {
  const out = {};
  if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("not sets");
  for (const [k, links] of Object.entries(v).slice(0, 40)) {
    const name = String(k).replace(/[()<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
    const good = (Array.isArray(links) ? links : []).filter(V.okLink).slice(0, V.MAX_PICS);
    if (name && good.length) out[name] = good;
  }
  return out;
}
