/* WHAT'S IN THIS FILE (vps/run.mjs)
   Runs the Farmhand bot on a server with no screen. It opens Bondage Club in a headless Chromium, gives the
   userscripts what Tampermonkey would (GM_getValue / GM_setValue / unsafeWindow), and loads the bot, its
   add-ons and (optionally) its own Companion from dist/. Nothing in the bot itself is changed.

   • The ledger and the saved login live in vps/data/store.json (GM_setValue writes there), with a dated
     backup kept every day.
   • The login is read from vps/.env (BOT_USER, BOT_PASS) the first time; the bot logs itself in, finds the
     farm room and rebuilds it if it's gone, exactly as on the PC.
   • A watchdog checks every minute: page crashed, game not connected, or not in a room for 5 minutes →
     reload. Three bad reloads in a row → the browser is restarted.
   • Every UPDATE_MIN minutes it runs `git pull`; if the scripts in dist/ changed, the page is reloaded with
     the new ones (so a push to GitHub updates the server by itself).
   Settings: vps/.env (see .env.example).
*/
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, readdirSync, copyFileSync, unlinkSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA = process.env.FARMHAND_DATA || join(HERE, "data");
const STORE = join(DATA, "store.json");
mkdirSync(DATA, { recursive: true });

// ── settings (.env, then the real environment on top) ──────
function loadEnv() {
  const out = {};
  const f = join(HERE, ".env");
  if (existsSync(f)) for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith("#")) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return Object.assign(out, process.env);
}
const ENV = loadEnv();
const CFG = {
  url: ENV.GAME_URL || "https://www.bondageprojects.elementfx.com/",
  fps: Math.max(1, Math.min(30, Number(ENV.FPS) || 4)),             // the game's drawing loop, slowed right down: nobody's watching
  updateMin: ENV.UPDATE_MIN === undefined ? 30 : Number(ENV.UPDATE_MIN),   // 0 = never git pull
  companion: String(ENV.LOAD_COMPANION || "yes") !== "no",            // the bot's own Companion panel (it talks to the bot on the page)
  skip: String(ENV.SKIP_SCRIPTS || "").split(",").map((s) => s.trim()).filter(Boolean),   // e.g. farmhand-shows.user.js
  extra: String(ENV.EXTRA_SCRIPTS || "").split(",").map((s) => s.trim()).filter(Boolean), // URLs or files of other userscripts (FUSAM…)
  headless: String(ENV.HEADLESS || "yes") !== "no",
  channel: ENV.BROWSER_CHANNEL || undefined,                          // "msedge" or "chrome" to use an installed browser (testing on a PC)
  tz: ENV.TZ || undefined,
};
const log = (...a) => console.log(new Date().toISOString().replace("T", " ").slice(0, 19), ...a);

// ── the store: what GM_setValue saves ──────────────────────
let store = {};
try { if (existsSync(STORE)) store = JSON.parse(readFileSync(STORE, "utf8")); }
catch (e) { log("!! store.json is damaged:", e.message, "- keeping it as store.json.broken and starting from the newest backup"); try { renameSync(STORE, STORE + ".broken"); } catch (e2) {} store = newestBackup(); }
function newestBackup() {
  const b = readdirSync(DATA).filter((f) => /^store-\d{4}-\d\d-\d\d\.json$/.test(f)).sort().pop();
  try { return b ? JSON.parse(readFileSync(join(DATA, b), "utf8")) : {}; } catch (e) { return {}; }
}
// the login from .env is put in once (and again whenever .env changes it); the bot reads it like a saved Tampermonkey login
if (ENV.BOT_USER && ENV.BOT_PASS && (store.bnb_user !== ENV.BOT_USER || store.bnb_pass !== ENV.BOT_PASS)) {
  store.bnb_user = ENV.BOT_USER; store.bnb_pass = ENV.BOT_PASS; store.bnb_login_bad = "";
}
let dirty = false, saving = false;
function saveSoon() { dirty = true; }
function flush() {
  if (!dirty || saving) return;
  saving = true; dirty = false;
  try {
    const tmp = STORE + ".tmp";
    writeFileSync(tmp, JSON.stringify(store));
    renameSync(tmp, STORE);          // never a half-written ledger
    const day = join(DATA, "store-" + new Date().toISOString().slice(0, 10) + ".json");
    if (!existsSync(day)) { copyFileSync(STORE, day); pruneBackups(); }
  } catch (e) { log("!! could not save the store:", e.message); dirty = true; }
  saving = false;
}
function pruneBackups() {
  const all = readdirSync(DATA).filter((f) => /^store-\d{4}-\d\d-\d\d\.json$/.test(f)).sort();
  for (const f of all.slice(0, Math.max(0, all.length - 14))) try { unlinkSync(join(DATA, f)); } catch (e) {}
}
setInterval(flush, 3000);

// ── the scripts, as Tampermonkey would run them ────────────
function scriptFiles() {
  const dist = join(ROOT, "dist");
  const all = readdirSync(dist).filter((f) => f.endsWith(".user.js") && !CFG.skip.includes(f));
  const bot = all.filter((f) => f === "farmhand-bot.user.js");
  const addons = all.filter((f) => f.startsWith("farmhand-") && f !== "farmhand-bot.user.js" && f !== "farmhand-companion.user.js").sort();
  const comp = CFG.companion ? all.filter((f) => f === "farmhand-companion.user.js") : [];
  return bot.concat(addons, comp).map((f) => join(dist, f));   // never the watcher: it records to Downloads, there's nobody to read it here
}
async function readExtra(src) {
  if (/^https?:\/\//.test(src)) { const r = await fetch(src); if (!r.ok) throw new Error(src + " → " + r.status); return await r.text(); }
  return readFileSync(resolve(HERE, src), "utf8");
}
// what every script gets: the GM functions over the store, and unsafeWindow = the page itself
const SHIM = `
  window.__gmStore = window.__gmStore || {};
  const GM_getValue = (k, d) => (Object.prototype.hasOwnProperty.call(window.__gmStore, k) ? window.__gmStore[k] : d);
  const GM_setValue = (k, v) => { window.__gmStore[k] = v; try { window.__gmSave(String(k), JSON.stringify(v === undefined ? null : v)); } catch (e) {} };
  const GM_deleteValue = (k) => { delete window.__gmStore[k]; try { window.__gmSave(String(k), "__deleted__"); } catch (e) {} };
  const GM_registerMenuCommand = (name, fn) => { (window.__gmMenu = window.__gmMenu || {})[name] = fn; };
  const GM_info = { script: { name: __NAME__, version: "vps" }, scriptHandler: "farmhand-vps" };
  const unsafeWindow = window;
`;
function wrap(name, code) {
  return "(function(){ try {" + SHIM.replace("__NAME__", JSON.stringify(name)) + "\n" + code + "\n} catch (e) { console.error('[vps] " + name.replace(/'/g, "") + " failed to start:', e && e.stack || e); } })();";
}
let scriptStamp = "";
function stampNow() { try { return scriptFiles().map((f) => f + ":" + statSync(f).mtimeMs + ":" + statSync(f).size).join("|"); } catch (e) { return ""; } }

// ── the browser ─────────────────────────────────────────────
let browser = null, context = null, page = null, badReloads = 0, lastGood = Date.now(), startedAt = 0;
async function start() {
  if (browser) try { await browser.close(); } catch (e) {}
  browser = await chromium.launch({ headless: CFG.headless, channel: CFG.channel,
    args: ["--disable-dev-shm-usage", "--no-sandbox", "--mute-audio", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows"] });
  context = await browser.newContext({ viewport: { width: 1280, height: 720 }, timezoneId: CFG.tz, serviceWorkers: "block" });
  await context.exposeBinding("__gmSave", (src, k, json) => {
    if (json === "__deleted__") delete store[k]; else { try { store[k] = JSON.parse(json); } catch (e) { return; } }
    if (k !== "bnb_office_lock") saveSoon();   // the bot's "I'm the one runnin'" stamp changes every few seconds: not worth a disk write
  });
  // slow the game's drawing loop: at 60 frames a second a headless browser burns a whole CPU drawing for nobody
  await context.addInitScript((fps) => {
    const gap = 1000 / fps; let id = 0; const pending = new Map();
    window.requestAnimationFrame = (cb) => { const n = ++id; pending.set(n, setTimeout(() => { pending.delete(n); try { cb(performance.now()); } catch (e) { console.error(e); } }, gap)); return n; };
    window.cancelAnimationFrame = (n) => { clearTimeout(pending.get(n)); pending.delete(n); };
    // the bot's prompts and alerts have nobody to answer them here
    window.alert = (m) => console.log("[alert] " + m); window.confirm = () => true; window.prompt = () => null;
  }, CFG.fps);
  page = await context.newPage();
  page.on("console", (m) => { const t = m.text(); if (/\[Farmhand|\[vps\]|\[alert\]|add-on/i.test(t) || m.type() === "error" && /farmhand|vps/i.test(t)) log("page:", t.slice(0, 400)); });
  page.on("pageerror", (e) => { if (/farmhand|GM_/i.test(String(e && e.stack))) log("page error:", String(e).slice(0, 300)); });
  page.on("crash", () => { log("!! the page crashed"); lastGood = 0; });
  page.on("load", () => inject().catch((e) => log("!! inject failed:", e.message)));
  startedAt = Date.now();
  log("opening", CFG.url);
  await page.goto(CFG.url, { waitUntil: "load", timeout: 120000 });
}
async function inject() {
  // userscripts run at document-idle: wait for the game's own code to be there first
  await page.waitForFunction(() => typeof window.ServerSend === "function" && typeof window.Player === "object", null, { timeout: 120000 }).catch(() => log("(the game is slow to load; injecting anyway)"));
  const files = scriptFiles();
  scriptStamp = stampNow();
  await page.evaluate((s) => { window.__gmStore = s; }, store);   // what's saved, handed over once
  for (const f of files) {
    const name = f.split(/[\\/]/).pop();
    await page.evaluate(wrap(name, readFileSync(f, "utf8")));
  }
  for (const src of CFG.extra) {
    try { await page.evaluate(wrap(src, await readExtra(src))); }
    catch (e) { log("!! extra script", src, "failed:", e.message); }
  }
  log("loaded " + files.length + " scripts" + (CFG.extra.length ? " + " + CFG.extra.length + " extra" : "") + ": " + files.map((f) => f.split(/[\\/]/).pop().replace(/^farmhand-|\.user\.js$/g, "")).join(", "));
}

// ── the watchdog ────────────────────────────────────────────
async function status() {
  return await page.evaluate(() => ({
    connected: !!(window.ServerSocket && window.ServerSocket.connected),
    member: window.Player && window.Player.MemberNumber || 0,
    room: (window.ChatRoomData && window.ChatRoomData.Name) || "",
    here: (window.ChatRoomCharacter || []).length,
    bot: !!(window.Farmhand && window.Farmhand.__bot), version: window.Farmhand && window.Farmhand.version || "",
    addons: window.Farmhand && window.Farmhand.list ? window.Farmhand.list().length : 0,
    screen: window.CurrentScreen || "",
  }));
}
let lastLine = "", lastLineAt = 0;
async function watchdog() {
  let s = null;
  try { s = await Promise.race([status(), new Promise((_, r) => setTimeout(() => r(new Error("no answer in 20 s")), 20000))]); }
  catch (e) { log("!! the page isn't answering:", e.message); }
  const good = s && s.connected && s.member && s.room && s.bot;
  if (good) { lastGood = Date.now(); badReloads = 0; }
  const line = s ? (good ? "ok" : "NOT READY") + " · " + (s.member ? "logged in as " + s.member : "not logged in") + " · " + (s.room ? "in \"" + s.room + "\" with " + (s.here - 1) + " others" : "no room (" + s.screen + ")") +
    " · bot " + (s.bot ? "v" + s.version + ", " + s.addons + " add-ons" : "not started") : "no status";
  if (line !== lastLine || Date.now() - lastLineAt > 30 * 60000) { log(line); lastLine = line; lastLineAt = Date.now(); }
  const grace = Date.now() - startedAt < 4 * 60000;     // logging in and finding the room takes a couple of minutes
  if (!good && !grace && Date.now() - lastGood > 5 * 60000) {
    badReloads++; lastGood = Date.now(); startedAt = Date.now();
    if (badReloads >= 3) { log("!! three reloads didn't fix it: restarting the browser"); badReloads = 0; await start().catch((e) => log("!! restart failed:", e.message)); }
    else { log("!! not healthy for 5 minutes: reloading the page (" + badReloads + ")"); await page.reload({ waitUntil: "load", timeout: 120000 }).catch((e) => log("!! reload failed:", e.message)); }
  }
}

// ── updates from GitHub ─────────────────────────────────────
function gitPull() {
  return new Promise((res) => execFile("git", ["-C", ROOT, "pull", "--ff-only", "--quiet"], { timeout: 120000 }, (err, so, se) => { if (err) log("(git pull:", String(se || err.message).trim().slice(0, 200) + ")"); res(); }));
}
async function updateCheck() {
  if (CFG.updateMin > 0) await gitPull();
  const now = stampNow();
  if (now && scriptStamp && now !== scriptStamp) {
    log("new scripts in dist/: reloading the page with them");
    flush(); startedAt = Date.now();
    await page.reload({ waitUntil: "load", timeout: 120000 }).catch((e) => log("!! reload failed:", e.message));
  }
}

// ── go ──────────────────────────────────────────────────────
async function shutdown(why) {
  log("stopping (" + why + ")"); dirty = true; flush();
  try { await browser.close(); } catch (e) {}
  process.exit(0);
}
process.on("SIGINT", () => shutdown("SIGINT")); process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (e) => log("!! unhandled:", e && e.message || e));

if (!store.bnb_user || !store.bnb_pass) log("!! No bot login yet. Put BOT_USER and BOT_PASS in vps/.env and restart (see .env.example).");
log("Farmhand VPS runner · data in " + DATA + " · " + (store.bnb_ledger_v1 ? "ledger found (" + Math.round(String(store.bnb_ledger_v1).length / 1024) + " KB)" : "NO ledger yet (a blank one will be started; import yours first with: node vps/import-ledger.mjs <file>)"));
dirty = true; flush();
await start();
setTimeout(() => watchdog().catch((e) => log("watchdog:", e.message)), 15000);   // a first look, so the log says early how it's goin'
setInterval(() => watchdog().catch((e) => log("watchdog:", e.message)), 60000);
setInterval(() => updateCheck().catch((e) => log("update:", e.message)), Math.max(1, CFG.updateMin || 5) * 60000);
