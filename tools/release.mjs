// npm run release -- "what changed"     one command for a release (Nov 3, the plan's Phase 0)
//   1. stops if GitHub has commits this copy doesn't (the OneDrive copy fell 16 releases behind once)
//   2. builds, and bumps the version of every script whose built file changed (patch; --minor for x.Y.0)
//   3. keeps INSTALL-STATUS.md's table right, dates it, and adds the line "what changed" if it isn't there yet
//   4. runs the tests (all of them; --no-test to skip), and stops on a failure
//   5. commits (your studio saves in studio/fits/ are left out) and pushes (--no-push to keep it here)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";

const args = process.argv.slice(2), flag = (f) => args.includes(f), summary = args.filter((a) => !a.startsWith("--")).join(" ").trim();
const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();
const say = (t) => console.log(t);
const stop = (t) => { console.error("✋ " + t); process.exit(1); };

// 1. never release from behind
try { git("fetch", "-q", "origin"); } catch (e) { stop("Couldn't reach GitHub to check for newer work: " + e.message); }
const behind = Number(git("rev-list", "--count", "HEAD..origin/main"));
if (behind) stop("GitHub has " + behind + " commit(s) this copy doesn't. Run  git pull  first, then release again.");

// 2. build, then bump whatever changed
const build = () => execFileSync("node", ["build.mjs"], { stdio: "ignore" });
build();
const atHead = (path) => { try { return JSON.parse(git("show", "HEAD:" + path)); } catch (e) { return null; } };
const changed = (file) => spawnSync("git", ["diff", "--quiet", "HEAD", "--", file]).status !== 0 || !git("ls-files", file);
const bump = (v) => { const p = v.split(".").map(Number); return flag("--minor") ? p[0] + "." + (p[1] + 1) + ".0" : p[0] + "." + p[1] + "." + (p[2] + 1); };
const pkg = JSON.parse(readFileSync("package.json", "utf8")), pkgHead = atHead("package.json") || { versions: {} };
const bumped = [];
for (const [k, file] of [["bot", "dist/farmhand-bot.user.js"], ["companion", "dist/farmhand-companion.user.js"], ["watcher", "dist/farm-watcher.user.js"]]) {
  if (!changed(file)) continue;
  if (pkg.versions[k] === pkgHead.versions[k]) pkg.versions[k] = bump(pkg.versions[k]);
  bumped.push({ name: k[0].toUpperCase() + k.slice(1), file, v: pkg.versions[k] });
}
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
const LABEL = { "barn-life": "Barn life", "glory-stalls": "Glory stalls", "map-tools": "Map tools" };
for (const d of readdirSync("addons", { withFileTypes: true })) {
  if (!d.isDirectory() || d.name.startsWith("_") || d.name.startsWith("private-") || !existsSync("addons/" + d.name + "/addon.json")) continue;
  const file = "dist/farmhand-" + d.name + ".user.js"; if (!changed(file)) continue;
  const path = "addons/" + d.name + "/addon.json", meta = JSON.parse(readFileSync(path, "utf8")), head = atHead(path) || {};
  if (meta.version === head.version) { const raw = readFileSync(path, "utf8"); writeFileSync(path, raw.replace('"version": "' + meta.version + '"', '"version": "' + bump(meta.version) + '"')); meta.version = bump(meta.version); }
  bumped.push({ name: LABEL[d.name] || d.name[0].toUpperCase() + d.name.slice(1), file, v: meta.version });
}
if (!bumped.length) stop("Nothin' players get has changed. (Studio, test or tool changes alone: commit them with git.)");
build();   // (the new numbers into the scripts' headers)

// 3. INSTALL-STATUS.md: the table, the date, and the entry
let st = readFileSync("INSTALL-STATUS.md", "utf8"); const crlf = st.includes("\r\n"); st = st.replace(/\r\n/g, "\n");
for (const b of bumped) {
  const re = new RegExp("(\\| [^\\n]*`" + b.file.replace("dist/", "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`[^\\n]*\\| \\*\\*)([0-9.]+)(\\*\\* \\|)");
  if (re.test(st)) st = st.replace(re, "$1" + b.v + "$3"); else say("(no table row for " + b.file + ": add one by hand)");
}
st = st.replace(/Updated \d{4}-\d{2}-\d{2}\./, "Updated " + new Date().toISOString().slice(0, 10) + ".");
const head = bumped.map((b) => b.name + " " + b.v).join(" + ");
if (summary && !st.includes("**" + head)) st = st.replace("## Latest changes (newest first)\n\n", "## Latest changes (newest first)\n\n- **" + head + ": " + summary + "**\n");
writeFileSync("INSTALL-STATUS.md", crlf ? st.replace(/\n/g, "\r\n") : st);
say("Release: " + head);

// 4. the tests
if (!flag("--no-test")) {
  const t = spawnSync("node", ["tests/run-all.mjs", "--no-build"], { stdio: "inherit" });
  if (t.status !== 0) stop("Tests failed: nothin' committed. Fix them, then release again (the versions above are already set).");
}

// 5. commit and push (your studio saves stay out of it)
git("add", "-A", "--", ".", ":!studio/fits");
// never anything private (Nov 10: three chat records went out with a release because the ignore list missed their
// folder): chat records, ledger backups, logins, private add-ons. Unstaged again, and the release stops.
const PRIVATE = /(^|\/)(backup|Backups)\/|(^|\/)record-[^/]*\.txt$|ledger[^/]*\.json$|(^|\/)\.env$|(^|\/)addons\/private-|farmhand-private-/i;
const risky = git("diff", "--cached", "--name-only").split("\n").filter((f) => f && PRIVATE.test(f));
if (risky.length) { try { git("reset", "-q", "--", ...risky); } catch (e) { /* fine */ } stop("These look private and were about to go to GitHub, so nothin' was committed:\n  " + risky.join("\n  ") + "\nAdd them to .gitignore, then release again."); }
const msg = head + (summary ? ": " + summary : "") + "\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n";
execFileSync("git", ["commit", "-q", "-F", "-"], { input: msg });
say("Committed: " + git("log", "--oneline", "-1"));
if (flag("--no-push")) say("Not pushed (--no-push). Players get it when you push.");
else { execFileSync("git", ["push", "origin", "main"], { stdio: "inherit" }); say("✅ Pushed. Players get it automatically."); }
