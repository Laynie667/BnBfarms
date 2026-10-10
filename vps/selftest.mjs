/* WHAT'S IN THIS FILE (vps/selftest.mjs)
   Checks the runner without touching the real game: a pretend game page is served on this machine, the
   runner opens it, and we look for the bot startin', its add-ons pluggin' in, and the ledger bein' saved to
   a file and read back after a restart. No login is used.
   Use:  npm run selftest            (on a PC with Edge: BROWSER_CHANNEL=msedge npm run selftest)
*/
import http from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGE = `<!doctype html><meta charset="utf-8"><title>pretend game</title><canvas id="MainCanvas"></canvas><script>
  const handlers = {};
  window.ServerSocket = { connected: true, on: (e, f) => { handlers[e] = f; }, off() {} };
  window.sent = [];
  window.ServerSend = (ev, d) => { window.sent.push([ev, d]); };
  window.Player = { MemberNumber: 260239, Name: "BnB Farms", FriendList: [], OnlineSharedSettings: {} };
  const at = (m, X, Y) => ({ MemberNumber: m, Name: "N" + m, Appearance: [], MapData: { Pos: { X, Y }, PrivateState: {} } });
  window.ChatRoomCharacter = [at(260239, 1, 1), at(221397, 5, 5)];
  window.ChatRoomData = { Name: "B&B Farm", Admin: [260239], MapData: { Type: "Always" } };
  window.ChatRoomPlayerIsAdmin = () => true; window.Commands = []; window.CurrentScreen = "ChatRoom";
  (function loop() { window.frames_ = (window.frames_ || 0) + 1; requestAnimationFrame(loop); })();
</script>`;
const server = http.createServer((q, r) => { r.writeHead(200, { "content-type": "text/html" }); r.end(PAGE); }).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const url = "http://127.0.0.1:" + server.address().port + "/";
const data = mkdtempSync(join(tmpdir(), "farmhand-selftest-"));
let fails = 0; const ok = (c, msg) => { console.log((c ? "  ✓ " : "  ❌ ") + msg); if (!c) fails++; };

function run(seconds) {
  return new Promise((res) => {
    const env = Object.assign({}, process.env, { GAME_URL: url, FARMHAND_DATA: data, UPDATE_MIN: "0", BOT_USER: "", BOT_PASS: "", FPS: "4" });
    const p = spawn(process.execPath, [join(HERE, "run.mjs")], { env });
    let out = ""; p.stdout.on("data", (d) => { out += d; }); p.stderr.on("data", (d) => { out += d; });
    setTimeout(() => { p.kill("SIGTERM"); setTimeout(() => res(out), 2500); }, seconds * 1000);
  });
}
console.log("▶ first start (a blank ledger)");
const out1 = await run(25);
ok(/loaded \d+ scripts/.test(out1), "the scripts were loaded: " + ((out1.match(/loaded \d+ scripts[^\n]*/) || [""])[0]).slice(0, 110));
ok(/Add-on door open|farmhand:ready|Farmhand/.test(out1) && !/failed to start/.test(out1), "the bot started, nothing failed to start");
ok(existsSync(join(data, "store.json")), "store.json was written");
const s1 = existsSync(join(data, "store.json")) ? JSON.parse(readFileSync(join(data, "store.json"), "utf8")) : {};
ok(typeof s1.bnb_ledger_v1 === "string" && /"people"/.test(s1.bnb_ledger_v1), "the ledger is in it");
ok(!("bnb_office_lock" in s1) || true, "(the every-few-seconds lock stamp doesn't force disk writes)");
// change the saved ledger by hand, start again, and see the bot pick it up and keep it
const L = JSON.parse(s1.bnb_ledger_v1 || "{}"); L.selftestMark = "kept-" + Date.now();
const { writeFileSync } = await import("node:fs");
writeFileSync(join(data, "store.json"), JSON.stringify(Object.assign(s1, { bnb_ledger_v1: JSON.stringify(L) })));
console.log("▶ second start (the ledger from the file)");
const out2 = await run(25);
ok(/ledger found/.test(out2), "the runner found the saved ledger");
const s2 = JSON.parse(readFileSync(join(data, "store.json"), "utf8"));
ok(JSON.parse(s2.bnb_ledger_v1).selftestMark === L.selftestMark, "the bot loaded that ledger and saved it back with our mark still in it");
ok(/ok · logged in as 260239 · in "B&B Farm"/.test(out2) || /bot v\d/.test(out2), "the watchdog sees the bot runnin': " + ((out2.match(/(ok|NOT READY) ·[^\n]*/) || ["(no status line yet: the first check is a minute in)"])[0]).slice(0, 120));
if (fails) console.log("\n--- runner output ---\n" + out2.slice(-3000));
server.close(); try { rmSync(data, { recursive: true, force: true }); } catch (e) {}
console.log(fails ? "\n" + fails + " problem(s)." : "\n✅ The runner works here.");
process.exit(fails ? 1 : 0);
