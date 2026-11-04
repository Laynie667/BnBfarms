// npm test → builds, then runs every *.test.cjs in this folder, six at a time.
// Each test prints "what I checked -> result". Any line showin' "false" counts as a failure.
// A file that fails while the others are runnin' is run again on its own: a few tests lean on real timers, and under
// load they can miss by a beat (Nov 3). Only a file that fails on its own too is a real failure.
//   node tests/run-all.mjs            build, then everything
//   node tests/run-all.mjs --no-build everything, as built
//   node tests/run-all.mjs nursery    just the files with "nursery" in the name
import { readdirSync } from "node:fs";
import { execFileSync, spawn } from "node:child_process";

const args = process.argv.slice(2), only = args.filter((a) => !a.startsWith("--"));
if (!args.includes("--no-build")) execFileSync("node", ["build.mjs"], { stdio: "ignore" });
const files = readdirSync("tests").filter((f) => f.endsWith(".test.cjs") && (!only.length || only.some((o) => f.includes(o)))).sort();
const AT_ONCE = Number(process.env.TEST_JOBS || 6);

function run(f) {
  return new Promise((done) => {
    const p = spawn("node", ["tests/" + f]); let out = "", err = "";
    const t = setTimeout(() => p.kill(), 600000);
    p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => {
      clearTimeout(t);
      const lines = out.split("\n").filter((l) => l.includes("->"));
      const bad = lines.filter((l) => /(^|\s)false(\s|$)/.test(l));
      done({ f, lines, bad, crashed: code !== 0 && !bad.length, err });
    });
  });
}
const started = Date.now(), results = [];
let next = 0;
await Promise.all(Array.from({ length: AT_ONCE }, async () => { while (next < files.length) { const f = files[next++]; results.push(await run(f)); process.stdout.write("."); } }));
process.stdout.write("\n");
// anything that failed under load, again on its own
let flaky = 0; const shaky = [];   // which ones, and the check that missed: worth fixin' for good
for (const r of results.filter((r) => r.bad.length || r.crashed)) {
  const again = await run(r.f);
  if (!again.bad.length && !again.crashed) { flaky++; shaky.push(r.f + (r.bad[0] ? ": " + r.bad[0].slice(0, 90) : " (crashed)")); r.bad = []; r.crashed = false; }
  else Object.assign(r, again);
}
let problems = 0;
for (const r of results.sort((a, b) => a.f.localeCompare(b.f))) {
  if (!r.bad.length && !r.crashed) continue;
  process.stdout.write("\n▶ " + r.f + "\n");
  for (const l of r.bad) { problems++; process.stdout.write("  ❌ " + l.slice(0, 200) + "\n"); }
  if (r.crashed) { problems++; process.stdout.write("  ❌ crashed:\n" + r.err.slice(0, 800) + "\n"); }
}
const checks = results.reduce((n, r) => n + r.lines.length, 0), mins = ((Date.now() - started) / 60000).toFixed(1);
console.log("\n" + files.length + " files, " + checks + " checks, " + mins + " min" + (flaky ? " (" + flaky + " passed on a second, solo run)" : ""));
for (const x of shaky) console.log("  ~ " + x);
console.log(problems ? problems + " problem(s) found." : "✅ Everything passed.");
process.exit(problems ? 1 : 0);
