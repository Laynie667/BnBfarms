// THE TRANCE EDITOR'S SERVER (Nov 25, studio/trance-routes.mjs). Laynie: "probably with me, with pushes to the bot". The
// library stays on this computer; the bot's own game tab may only READ what was pushed; no web page may save or push.
const fs = require("fs"), path = require("path"), os = require("os");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const ROOT = path.join(__dirname, "..");
(async () => {
  const { tranceRoutes } = await import("file://" + path.join(ROOT, "studio/trance-routes.mjs").replace(/\\/g, "/"));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fh-trance-studio-"));
  const GAME_ORIGIN = /^https:\/\/([a-z0-9-]+[.])*(bondageprojects[.]elementfx[.]com|bondage-europe[.]com|bondageprojects[.]com)$/;
  const OWN_ORIGIN = /^http:\/\/(localhost|127[.]0[.]0[.]1)(:[0-9]+)?$/;
  const call = async (method, url, origin, body, headers) => {
    const req = (async function* () { if (body != null) yield Buffer.from(body); })();
    req.method = method; req.headers = Object.assign({}, headers || {});
    const res = { code: 0, head: {}, body: "", setHeader(k, v) { this.head[k] = v; }, writeHead(c, h) { this.code = c; Object.assign(this.head, h || {}); return this; }, end(b) { this.body = String(b == null ? "" : b); return this; } };
    const handled = await tranceRoutes(req, res, url, origin || "", { dir, shared: path.join(ROOT, "shared"), web: path.join(ROOT, "studio/web"), GAME_ORIGIN, OWN_ORIGIN,
      send: async (rs, f) => { if (!fs.existsSync(f)) { rs.writeHead(404).end("nf"); return; } rs.writeHead(200).end(fs.readFileSync(f, "utf8")); } });
    return Object.assign(res, { handled });
  };
  const game = "https://www.bondageprojects.elementfx.com";
  let r = await call("GET", "/trance", "");
  ok(r.handled && r.code === 200 && /Trance Library/.test(r.body), "the editor's page at /trance");
  r = await call("GET", "/__shared/trance-script.js", "");
  ok(r.code === 200 && /parseLibrary/.test(r.body), "the shared format, for the editor");
  r = await call("GET", "/__shared/../build.mjs", "");
  ok(r.code === 400, "nothin' else out of the project through it");
  r = await call("GET", "/__studio/trance/library.txt", "");
  ok(r.code === 404, "nothin' saved yet: the editor starts from the starter");
  r = await call("POST", "/__studio/trance/library.txt", "http://localhost:4780", "=== induction: One\n\nHi.\n");
  ok(r.code === 200 && fs.readFileSync(path.join(dir, "library.txt"), "utf8").includes("induction: One"), "saved from the editor");
  r = await call("POST", "/__studio/trance/library.txt", "http://localhost:4780", "=== induction: Two\n\nHi.\n");
  ok(fs.readdirSync(path.join(dir, "old")).length === 1, "...and the save before kept, in case");
  r = await call("POST", "/__studio/trance/library.txt", "https://evil.example", "=== induction: Bad\n");
  ok(r.code === 403 && !fs.readFileSync(path.join(dir, "library.txt"), "utf8").includes("Bad"), "no other web page can save over it");
  r = await call("GET", "/__studio/trance/published.json", game);
  ok(r.code === 200 && r.body === "{}" && r.head["Access-Control-Allow-Origin"] === game, "nothin' pushed yet: the bot's tab is told so");
  r = await call("POST", "/__studio/trance/publish", "http://localhost:4780", "=== induction: Pushed\n\nHi.\n", { "x-trance-info": JSON.stringify({ blocks: 1, errors: 0 }) });
  const pub = JSON.parse(r.body);
  ok(r.code === 200 && pub.stamp && pub.blocks === 1 && fs.readFileSync(path.join(dir, "published.txt"), "utf8").includes("Pushed"), "pushed to the bot: the text and its stamp");
  r = await call("GET", "/__studio/trance/published.json", game);
  ok(JSON.parse(r.body).stamp === pub.stamp, "the bot's own tab reads the stamp");
  r = await call("GET", "/__studio/trance/published.txt", game);
  ok(r.body.includes("Pushed"), "...and what was pushed");
  r = await call("OPTIONS", "/__studio/trance/published.txt", game);
  ok(r.code === 204 && r.head["Access-Control-Allow-Private-Network"] === "true", "(the browser's check before it reads from this computer)");
  r = await call("GET", "/__studio/trance/library.txt", game);
  ok(r.code === 403, "the game's sites can't read the workin' copy, only what was pushed");
  r = await call("POST", "/__studio/trance/publish", game, "=== induction: Hijack\n");
  ok(r.code === 403 && !fs.readFileSync(path.join(dir, "published.txt"), "utf8").includes("Hijack"), "...and can never push");
  const gi = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8");
  ok(/^studio\/trance\/$/m.test(gi), "studio/trance/ (her scripts, what she pushed) never goes on GitHub");
  fs.rmSync(dir, { recursive: true, force: true });
  out(fails ? "FAIL " + fails : "ALL OK"); process.exit(fails ? 1 : 0);
})();
