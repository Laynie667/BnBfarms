// THE BC+ BUTTON (Nov 19). Laynie: "can we add a button to the companion that opens bc plus? the recent bc plus update
// made it impossible to use the standard button". With BC+ loaded, the Companion's header has a BC+ button that opens
// your BC+ window through BC+'s own /bcp menu; without BC+, there's no button.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, m) => { if (!c) fails++; out(m + " -> " + !!c); };
const src = fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8");

async function boot(withBcp, runner) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
  const w = dom.window, sent = [], calls = [];
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.console.warn = () => {}; w.console.log = () => {};
  w.CurrentScreen = "ChatRoom";
  w.ChatRoomCharacter = [{ MemberNumber: 500 }, { MemberNumber: 260239 }];
  w.Player = { MemberNumber: 500, Name: "Moo" };
  w.ServerSend = (ev, d) => sent.push([ev, d]);
  w.ChatRoomMessage = () => {}; w.ChatRoomCanLeave = () => true; w.ChatRoomAttemptLeave = () => {};
  w.CommandCombine = () => {};
  w.Commands = [{ Tag: "farm", Action: () => {} }];
  if (withBcp) {
    w.BCPlus = { version: { major: 0, minor: 14, patch: 0 }, loaded: true };
    if (!runner) w.Commands.push({ Tag: "bcp", Description: ": BC+ commands", Action: function (a, msg, args) { calls.push(["action", a, msg, args, this && this.Tag]); } });
    else { w.Commands.push({ Tag: "bcp" }); w.CommandExecute = (m) => calls.push(["exec", m]); }
  }
  w.eval(src);
  await wait(4500);
  const D = w.document;
  w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, type: "welcome", ver: "0.85.1", name: "Moo", proto: 2 } });
  D.getElementById("fhc-btn").click();
  await wait(200);
  return { w, D, calls };
}

(async () => {
  {
    const { D } = await boot(false);
    ok(!D.querySelector('#fhc-panel .fhc-head button[aria-label="Open BC+"]'), "without BC+, the header has no BC+ button");
    ok(D.querySelector('#fhc-panel .fhc-head button[aria-label="Settings"]'), "...and the rest of the header's as it was");
  }
  {
    const { D, calls } = await boot(true);
    const b = D.querySelector('#fhc-panel .fhc-head button[aria-label="Open BC+"]');
    ok(b && b.textContent.trim() === "BC+", "with BC+ loaded, the header has a BC+ button");
    b.click();
    ok(calls.length === 1 && calls[0][0] === "action" && calls[0][1] === "menu" && calls[0][2] === "/bcp menu" && JSON.stringify(calls[0][3]) === '["menu"]' && calls[0][4] === "bcp",
      "...and it runs BC+'s own /bcp menu, the way typin' it would (" + JSON.stringify(calls) + ")");
    const all = [...D.querySelectorAll("#fhc-panel .fhc-head button")].map((x) => x.getAttribute("aria-label"));
    ok(all.indexOf("Open BC+") >= 0 && all.indexOf("Open BC+") < all.indexOf("Settings"), "...sittin' just before ⚙ (" + all.join(", ") + ")");
  }
  {
    const { D, calls } = await boot(true, true);
    D.querySelector('#fhc-panel .fhc-head button[aria-label="Open BC+"]').click();
    ok(calls.length === 1 && calls[0][0] === "exec" && calls[0][1] === "/bcp menu", "a BC+ whose command can't be reached directly is opened through the game's own command runner");
  }
  out(fails ? fails + " FAILED" : "all passed");
  process.exit(fails ? 1 : 0);
})();
