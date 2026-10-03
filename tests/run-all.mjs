// npm test → builds, then runs every *.test.cjs in this folder.
// Each test prints "what I checked -> result". Any line showin' "false" counts as a failure.
import { readdirSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";

execFileSync("node", ["build.mjs"], { stdio: "ignore" });
let bad = 0;
for (const f of readdirSync("tests").filter((f) => f.endsWith(".test.cjs")).sort()) {
  process.stdout.write("\n▶ " + f + "\n");
  const r = spawnSync("node", ["tests/" + f], { encoding: "utf8", timeout: 600000 });
  const lines = (r.stdout || "").split("\n").filter((l) => l.includes("->"));
  for (const l of lines) {
    const fail = /(^|\s)false(\s|$)/.test(l);
    if (fail) bad++;
    process.stdout.write((fail ? "  ❌ " : "  ✓ ") + l.slice(0, 160) + "\n");
  }
  if (r.status !== 0) { bad++; process.stdout.write("  ❌ crashed:\n" + (r.stderr || "").slice(0, 800) + "\n"); }
}
console.log(bad ? `\n${bad} problem(s) found.` : "\n✅ Everything passed.");
process.exit(bad ? 1 : 0);
