// node tools/publish-visor.mjs (the trance studio's "Publish for visors" runs it): puts public/visor/ on GitHub, and only
// those files, so every Companion anywhere can read the farm's visor list (the sessions crafters may pick, and the picture
// sets). It's data, not a script: nobody's game updates for it. It won't run over newer work on GitHub.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
try {
  git("fetch", "-q", "origin");
  if (git("rev-list", "--count", "HEAD..origin/main") !== "0") { console.log("not sent: GitHub has newer work than this PC; it goes out with the next release (or ask Claude to pull first)"); process.exit(1); }
  git("add", "--", "public/visor");
  if (!git("diff", "--cached", "--name-only", "--", "public/visor")) { console.log("already on GitHub: nothin' new to send"); process.exit(0); }
  git("commit", "-q", "--only", "-m", "Visor list: the farm's public sessions and picture sets (from the trance studio)", "--", "public/visor");
  git("push", "-q", "origin", "HEAD:main");
  console.log("sent to GitHub: every Companion picks it up within the hour");
} catch (e) {
  console.log("not sent: " + String((e && (e.stderr || e.message)) || e).trim().split("\n").pop());
  process.exit(1);
}
