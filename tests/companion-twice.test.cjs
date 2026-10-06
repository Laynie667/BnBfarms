// Reported live: with two copies of the Companion installed (an old pasted one and one from the GitHub link),
// the Companion "refused to load, saying it's already loaded". Now the second copy steps aside and says why,
// in chat, and the first keeps working.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { out(msg + " -> " + (c ? "true" : "false")); if (!c) fails++; };
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
const w = dom.window;
const local = [], warns = [];
w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
w.CurrentScreen = "ChatRoom";
w.ChatRoomCharacter = [{ MemberNumber: 221397 }, { MemberNumber: 260239 }];
w.ServerSend = () => {};
w.ChatRoomMessage = () => {};
w.CommandCombine = () => {};
w.ChatRoomSendLocal = (h) => local.push(h);
w.console.warn = (...a) => warns.push(a.join(" "));
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");
(async () => {
  w.eval(src); await wait(3000);
  ok(!!w.document.getElementById("fhc-btn"), "the first copy starts");
  let threw = null; try { w.eval(src); } catch (e) { threw = e; }
  ok(!!threw && /another copy is already running/.test(String(threw.message)), "the second copy steps aside");
  await wait(3500);
  ok(w.document.querySelectorAll("#fhc-btn").length === 1, "...so there is only one 🌾 button");
  ok(local.some((h) => /Two copies of the Farmhand Companion are installed/.test(h) && /delete the older one/.test(h)), "it says so in chat, with what to do");
  ok(warns.some((x) => /Two copies/.test(x)), "...and in the console");
  out(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
})();
