/* WHAT'S IN THIS FILE (watcher/index.js)
   The Farm Watcher: a stand-alone diagnostics script. It isn't part of the bot and doesn't talk to it.
   Run it on a player's game (yours, a tester's, an account without the Companion) and it writes down
   everything that game sees for a while, then saves it as a plain text file to hand to Claude:

     • what the server sends this game: chat, whispers, emotes, actions, beeps, hidden messages
       (the farm bot's messages to the Companion included), people joinin', leavin' and movin' on the map,
       items and restraints put on, taken off and locked
     • what this game sends: its chat, whispers, beeps, and the Companion's messages to the bot
     • what actually showed up in the chat log on screen (so "arrived but never shown" can be spotted)
     • local-only lines (the Companion's own lines, other mods' notes)
     • errors and warnings on the page, and the connection droppin' and comin' back

   Start/stop: the small 👁 button (top right), the Tampermonkey menu, or /watch in the chat:
     /watch start [minutes]  (60 if left out, up to 240) · /watch stop · /watch save · /watch mark <note>
   A reload in the middle doesn't lose anything: the recording carries on where it was.
   Never written down: passwords, e-mails, login data.
*/
const W = (typeof unsafeWindow !== "undefined" && unsafeWindow) ? unsafeWindow : window;
const VERSION = typeof __FARMHAND_VERSION__ !== "undefined" ? __FARMHAND_VERSION__ : "dev";
const KEY = "farm_watch_v1";
const MAX_LINES = 80000, MAX_CHARS = 9000000;

let S = { on: false, until: 0, started: 0, lines: [], chars: 0 };
try { const old = JSON.parse(GM_getValue(KEY, "null")); if (old && Array.isArray(old.lines)) S = Object.assign(S, old); } catch (e) {}

// ── names and time ────────────────────────────────────────────
const names = new Map();
function nameOf(mn) {
  if (mn === undefined || mn === null || mn === "") return "?";
  try {
    const c = (W.ChatRoomCharacter || []).find((x) => x.MemberNumber === mn);
    if (c) { const n = c.Nickname || c.Name; if (n) names.set(mn, n); }
  } catch (e) {}
  return (names.get(mn) || "#" + mn) + "(" + mn + ")";
}
const me = () => { try { return W.Player && W.Player.MemberNumber; } catch (e) { return null; } };
const clock = (t) => { const d = new Date(t); const p = (n, l) => String(n).padStart(l || 2, "0"); return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()) + "." + p(d.getMilliseconds(), 3); };
const short = (s, n) => { s = String(s === undefined ? "" : s).replace(/\s+/g, " ").trim(); return s.length > (n || 400) ? s.slice(0, n || 400) + "…" : s; };

// ── writing a line ────────────────────────────────────────────
let lastMove = null;
function line(kind, text) {
  if (!S.on) return;
  if (Date.now() > S.until) { finish("time's up"); return; }
  const l = clock(Date.now()) + "  " + (kind + "         ").slice(0, 9) + " " + text;
  S.lines.push(l); S.chars += l.length + 1;
  while (S.lines.length > MAX_LINES || S.chars > MAX_CHARS) S.chars -= S.lines.shift().length + 1;
  saveSoon(); badge();
}
// someone walkin' makes a move every step: a run of steps by the same person becomes one line
function moveLine(mn, pos) {
  const now = Date.now(), p = pos ? pos.X + "," + pos.Y : "?";
  if (lastMove && lastMove.mn === mn && now - lastMove.at < 3000 && S.lines.length - 1 === lastMove.idx) {
    S.lines[lastMove.idx] = S.lines[lastMove.idx].replace(/ → [\d?,]+$/, " → " + p) ; lastMove.at = now; return;
  }
  line("MOVE", nameOf(mn) + " → " + p);
  lastMove = { mn, at: now, idx: S.lines.length - 1 };
}
let saveT = null;
function saveSoon() { if (saveT) return; saveT = setTimeout(() => { saveT = null; save(); }, 30000); }
function save() { try { GM_setValue(KEY, JSON.stringify(S)); } catch (e) { console.warn("[Farm Watcher] save:", e); } }

// ── what someone is wearin', and what changed ────────────────
const looks = new Map();
function look(app) {
  const m = {};
  for (const it of app || []) {
    try {
      const g = it.Group || (it.Asset && it.Asset.Group && it.Asset.Group.Name); if (!g) continue;
      if (!/^Item/.test(g)) continue;   // restraints and toys; clothes and body parts would drown the file
      const a = it.Name || (it.Asset && it.Asset.Name) || "?";
      const craft = it.Craft && it.Craft.Name ? " \"" + short(it.Craft.Name, 40) + "\"" : "";
      const lock = it.Property && it.Property.LockedBy ? " [" + it.Property.LockedBy + "]" : "";
      m[g] = a + craft + lock;
    } catch (e) {}
  }
  return m;
}
function lookChange(mn, app, by) {
  if (!mn || !app) return;
  const now = look(app), was = looks.get(mn);
  looks.set(mn, now);
  if (!was) { const list = Object.entries(now).map(([g, v]) => g + ": " + v); line("WEARING", nameOf(mn) + (list.length ? " · " + list.join(" · ") : " · no restraints")); return; }
  const ch = [];
  for (const g of new Set(Object.keys(now).concat(Object.keys(was)))) {
    if (now[g] === was[g]) continue;
    ch.push(now[g] ? (was[g] ? g + ": " + was[g] + " → " + now[g] : "+" + g + ": " + now[g]) : "-" + g + ": " + was[g]);
  }
  if (ch.length) line("ITEMS", nameOf(mn) + (by ? " (by " + nameOf(by) + ")" : "") + " · " + ch.join(" · "));
}

// a panel update from the farm bot: which parts of it changed since the last one (the full thing is long and
// gets cut off, so the reason for an update was invisible)
const lastState = new Map();
function stateDiff(from, s) {
  const was = lastState.get(from); lastState.set(from, s);
  if (!was) return "first";
  const flat = (o, p, out) => { out = out || {}; if (o && typeof o === "object" && !Array.isArray(o)) { for (const k of Object.keys(o)) flat(o[k], p ? p + "." + k : k, out); } else out[p] = JSON.stringify(o); return out; };
  const a = flat(was), b = flat(s), ch = [];
  for (const k of new Set(Object.keys(a).concat(Object.keys(b)))) if (k !== "at" && a[k] !== b[k]) ch.push(k + (String(b[k] || "").length < 30 ? "=" + b[k] : ""));
  return ch.length ? "changed: " + ch.slice(0, 12).join(", ") + (ch.length > 12 ? " +" + (ch.length - 12) : "") : "nothing changed";
}
// ── what the server sends this game ──────────────────────────
const SECRET = /pass(word)?|e-?mail|token|secret|accountname|cookie/i;
function clean(v, d) {
  if (v === null || typeof v !== "object") return v;
  if ((d || 0) > 3) return "…";
  if (Array.isArray(v)) return v.slice(0, 20).map((x) => clean(x, (d || 0) + 1));
  const o = {}; for (const k of Object.keys(v).slice(0, 30)) o[k] = SECRET.test(k) ? "[hidden]" : clean(v[k], (d || 0) + 1);
  return o;
}
const json = (v, n) => short(JSON.stringify(clean(v)), n || 300);
function dictText(dict) {
  // an action's details: who, to whom, which body part, which item or activity
  if (!Array.isArray(dict)) return "";
  const o = [];
  for (const e of dict) {
    if (!e || typeof e !== "object") continue;
    if (e.SourceCharacter !== undefined) o.push("by " + nameOf(e.SourceCharacter));
    else if (e.TargetCharacter !== undefined) o.push("on " + nameOf(e.TargetCharacter));
    else if (e.FocusGroupName) o.push("at " + e.FocusGroupName);
    else if (e.ActivityName) o.push("activity " + e.ActivityName);
    else if (e.AssetName) o.push("item " + e.AssetName);
    else if (e.Tag && e.Text !== undefined) o.push(e.Tag + "=" + short(e.Text, 60));
  }
  return o.join(", ");
}
function onIn(ev, d) {
  if (!S.on) return;
  try {
    switch (ev) {
      case "ChatRoomMessage": {
        if (!d) return;
        const from = nameOf(d.Sender), to = d.Target ? " → " + nameOf(d.Target) : "";
        const text = typeof d.Content === "string" ? d.Content : json(d.Content);
        if (d.Type === "Hidden") {
          if (d.Content === "FarmhandMsg" && d.Dictionary && d.Dictionary.type === "state" && d.Dictionary.state) { line("FARM-IN", from + to + " · state (" + stateDiff(d.Sender, d.Dictionary.state) + ")"); return; }
          if (d.Content === "FarmhandMsg") { const m = d.Dictionary || {}; line("FARM-IN", from + to + " · " + (m.type || "?") + (m.text ? ": " + short(m.text, 600) : "") + (m.type && !m.text ? " " + json(m, 250) : "")); }
          else line("HIDDEN", from + to + " · " + short(text, 120) + (d.Dictionary ? " " + json(d.Dictionary, 160) : ""));
          return;
        }
        if (d.Type === "Activity" || d.Type === "Action" || d.Type === "ServerMessage") { line(d.Type.toUpperCase().slice(0, 9), short(text, 80) + " · " + dictText(d.Dictionary)); return; }
        line(String(d.Type || "MSG").toUpperCase(), from + to + ": " + short(text, 1000));
        return;
      }
      case "ChatRoomSync": {
        if (!d) return;
        line("ROOM", "joined/synced \"" + d.Name + "\" · map " + (d.MapData && d.MapData.Type) + " · " + (d.Character || []).length + " people · admins " + (d.Admin || []).length + " · whitelist " + (d.Whitelist || []).length);
        for (const c of d.Character || []) { if (c.Nickname || c.Name) names.set(c.MemberNumber, c.Nickname || c.Name); line("HERE", nameOf(c.MemberNumber) + " at " + (c.MapData && c.MapData.Pos ? c.MapData.Pos.X + "," + c.MapData.Pos.Y : "?")); lookChange(c.MemberNumber, c.Appearance); }
        return;
      }
      case "ChatRoomSyncSingle": case "ChatRoomSyncCharacter": if (d && d.Character) lookChange(d.Character.MemberNumber, d.Character.Appearance, d.SourceMemberNumber); return;
      case "ChatRoomSyncItem": if (d && d.Item) line("ITEM", nameOf(d.Item.Target) + " · " + d.Item.Group + ": " + (d.Item.Name || "(removed)") + (d.Item.Craft && d.Item.Craft.Name ? " \"" + short(d.Item.Craft.Name, 40) + "\"" : "") + (d.Item.Property && d.Item.Property.LockedBy ? " [" + d.Item.Property.LockedBy + "]" : "") + " · by " + nameOf(d.Source)); return;
      case "ChatRoomSyncMapData": if (d) moveLine(d.MemberNumber, d.MapData && d.MapData.Pos); return;
      case "ChatRoomSyncMemberJoin": if (d && d.Character) { names.set(d.Character.MemberNumber, d.Character.Nickname || d.Character.Name); line("JOIN", nameOf(d.Character.MemberNumber) + (d.Character.MapData && d.Character.MapData.Pos ? " at " + d.Character.MapData.Pos.X + "," + d.Character.MapData.Pos.Y : "")); lookChange(d.Character.MemberNumber, d.Character.Appearance); } return;
      case "ChatRoomSyncMemberLeave": if (d) line("LEAVE", nameOf(d.SourceMemberNumber)); return;
      case "ChatRoomSyncRoomProperties": if (d) line("ROOMPROP", json({ Name: d.Name, Admin: d.Admin, Whitelist: d.Whitelist, Ban: d.Ban, Locked: d.Locked, Private: d.Private }, 400)); return;
      case "AccountBeep": if (d) line("BEEP-IN", nameOf(d.MemberNumber) + (d.MemberName ? " \"" + d.MemberName + "\"" : "") + (d.BeepType ? " [" + d.BeepType + "]" : "") + (d.ChatRoomName ? " in " + d.ChatRoomName : "") + ": " + (typeof d.Message === "string" ? short(d.Message, 1000) : json(d.Message, 300))); return;
      case "LoginResponse": line("LOGIN", typeof d === "object" ? "logged in" : String(d)); return;   // never the account data
      case "AccountQueryResult": if (d) line("QUERY", d.Query + " · " + (Array.isArray(d.Result) ? d.Result.length + " results" : json(d.Result, 120))); return;
      case "ChatRoomSearchResult": line("SEARCH", (Array.isArray(d) ? d.length : "?") + " rooms"); return;
      default: line("IN", ev + " " + json(d, 200));
    }
  } catch (e) { line("WATCHERR", "reading " + ev + ": " + e); }
}
// ── what this game sends ─────────────────────────────────────
function onOut(ev, d) {
  if (!S.on) return;
  try {
    if (/Login|Password|AccountCreate|AccountUpdateEmail/i.test(ev)) { line("OUT", ev + " [hidden]"); return; }
    if (ev === "ChatRoomChat" && d) {
      const to = d.Target ? " → " + nameOf(d.Target) : "";
      if (d.Type === "Hidden" && d.Content === "FarmhandMsg") { const m = d.Dictionary || {}; line("FARM-OUT", "me" + to + " · " + (m.type || "?") + (m.text ? ": " + short(m.text, 400) : "")); return; }
      line("SENT", "[" + d.Type + "]" + to + ": " + short(typeof d.Content === "string" ? d.Content : json(d.Content), 1000) + (d.Type === "Activity" || d.Type === "Action" ? " · " + dictText(d.Dictionary) : ""));
      return;
    }
    if (ev === "AccountBeep" && d) { line("BEEP-OUT", "→ " + nameOf(d.MemberNumber) + (d.BeepType ? " [" + d.BeepType + "]" : "") + ": " + (typeof d.Message === "string" ? short(d.Message, 1000) : json(d.Message, 300))); return; }
    if (ev === "AccountUpdate") { line("OUT", "AccountUpdate (" + Object.keys(d || {}).join(", ") + ")"); return; }
    if (ev === "ChatRoomCharacterMapDataUpdate") { return; }   // our own steps show up as MOVE from the server
    line("OUT", ev + " " + json(d, 200));
  } catch (e) {}
}
// ── what showed up on screen ─────────────────────────────────
function htmlText(h) { const div = W.document.createElement("div"); div.innerHTML = String(h); return div.textContent || ""; }
let seenObs = null;
function watchChatLog() {
  const log = W.document.getElementById("TextAreaChatLog");
  if (!log || log.__farmWatched) return;
  log.__farmWatched = true;
  seenObs = new W.MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) {
      try { const t = short(n.textContent || "", 1000); if (t) line("SHOWN", t); } catch (e) {}
    }
  });
  seenObs.observe(log, { childList: true });
}

// ── hooking into the game (once it's there) ──────────────────
let hooked = { sock: null, send: false, local: false, cons: false };
const anyFn = (ev, d) => onIn(ev, d);
function hook() {
  try {
    // the game can swap its connection for a new one after the page loads (seen live: an hour of nothing coming in),
    // so follow whichever one it's using now, and put our listener back if it was taken off
    const s = W.ServerSocket;
    const intact = (x) => { try { return typeof x.listenersAny !== "function" || x.listenersAny().includes(anyFn); } catch (e) { return true; } };
    if (s && typeof s.onAny === "function" && (hooked.sock !== s || !intact(s))) {
      if (hooked.sock) { try { hooked.sock.offAny(anyFn); } catch (e) {} line("NET", hooked.sock !== s ? "the game swapped its connection; listening on the new one" : "our listener was taken off the connection; put it back"); }
      s.onAny(anyFn);
      s.on("disconnect", (r) => line("NET", "disconnected: " + r));
      s.on("connect", () => line("NET", "connected"));
      hooked.sock = s;
    }
    if (!hooked.send && typeof W.ServerSend === "function" && !W.ServerSend.__farmWatch) {
      const orig = W.ServerSend;
      const wrapped = function (ev, d) { onOut(ev, d); return orig.apply(this, arguments); };
      wrapped.__farmWatch = true; W.ServerSend = wrapped; hooked.send = true;
    }
    if (!hooked.local && typeof W.ChatRoomSendLocal === "function" && !W.ChatRoomSendLocal.__farmWatch) {
      const orig = W.ChatRoomSendLocal;
      const wrapped = function (h) { line("LOCAL", short(htmlText(h), 1000)); return orig.apply(this, arguments); };
      wrapped.__farmWatch = true; W.ChatRoomSendLocal = wrapped; hooked.local = true;
    }
    if (!hooked.cons) {
      for (const lvl of ["warn", "error"]) {
        // the page's console (the game's and every script's), not just this script's own
        const C = W.console, orig = C[lvl].bind(C);
        C[lvl] = (...a) => { try { line(lvl === "warn" ? "WARN" : "ERROR", short(a.map((x) => (x instanceof Error ? x.stack || x : typeof x === "object" ? json(x, 300) : x)).join(" "), 800)); } catch (e) {} orig(...a); };
      }
      W.addEventListener("error", (e) => line("PAGEERR", short((e.message || "") + " @ " + (e.filename || "") + ":" + (e.lineno || ""), 600)));
      W.addEventListener("unhandledrejection", (e) => line("PAGEERR", "promise: " + short(e.reason && (e.reason.stack || e.reason), 600)));
      hooked.cons = true;
    }
    watchChatLog();
    if (!hook.cmd && typeof W.CommandCombine === "function") {
      W.CommandCombine([{ Tag: "watch", Description: "start [minutes] | stop | save | mark <note>: the Farm Watcher's diagnostics recording",
        Action: (args) => command(String(args || "")) }]);
      hook.cmd = true;
    }
  } catch (e) { console.log("[Farm Watcher] hook:", e); }
}
setInterval(hook, 1000);

// every 5 minutes: where everybody is (the room as this game sees it)
setInterval(() => {
  if (!S.on) return;
  try {
    const people = (W.ChatRoomCharacter || []).map((c) => nameOf(c.MemberNumber) + "@" + (c.MapData && c.MapData.Pos ? c.MapData.Pos.X + "," + c.MapData.Pos.Y : "?"));
    line("SNAPSHOT", (W.ChatRoomData ? "\"" + W.ChatRoomData.Name + "\" · " : "not in a room · ") + people.length + " people: " + people.join(" "));
  } catch (e) {}
}, 300000);

// ── start, stop, save ────────────────────────────────────────
function detect() {
  const has = (k) => { try { return W[k] !== undefined; } catch (e) { return false; } };
  return [has("__farmhandOwnPanel") ? "Farmhand Companion" : null, has("Farmhand") ? "Farmhand bot (this is the bot's page?)" : null,
          has("bcx") ? "BCX" : null, has("FUSAM") ? "FUSAM" : null, has("bcModSdk") ? "ModSDK" : null].filter(Boolean).join(", ") || "none detected";
}
function start(min) {
  min = Math.max(1, Math.min(240, Math.round(Number(min) || 60)));
  S = { on: true, started: Date.now(), until: Date.now() + min * 60000, lines: [], chars: 0, who: me() || 0 };   // who: so a file saved after the page reopens (before login) still carries the right number
  looks.clear();
  const room = W.ChatRoomData;
  line("WATCH", "Farm Watcher v" + VERSION + " recording for " + min + " minutes");
  line("WATCH", "this game: " + nameOf(me()) + " · server " + W.location.host + " · game " + (W.GameVersion || "?") + " · scripts: " + detect());
  line("WATCH", room ? "in \"" + room.Name + "\" · map " + (room.MapData && room.MapData.Type) : "not in a room yet");
  try { for (const c of W.ChatRoomCharacter || []) { line("HERE", nameOf(c.MemberNumber) + " at " + (c.MapData && c.MapData.Pos ? c.MapData.Pos.X + "," + c.MapData.Pos.Y : "?")); lookChange(c.MemberNumber, c.Appearance); } } catch (e) {}
  save(); badge(); say("👁 Farm Watcher: recording for " + min + " minutes. /watch mark <note> when something odd happens; /watch save any time.");
}
function finish(why) {
  if (!S.on) return;
  S.lines.push(clock(Date.now()) + "  WATCH     stopped (" + why + ")");
  S.on = false; save(); badge();
  say("👁 Farm Watcher stopped (" + why + "). " + S.lines.length + " lines. /watch save or the 👁 button to download.");
  download();   // the browser may ask first; the button works too
}
function fileText() {
  return "B&B Farm — Farm Watcher recording\n" +
    "Private: this has people's messages in it. No passwords or e-mails are written down.\n" +
    "Started " + new Date(S.started || Date.now()).toString() + "\n" +
    "Kinds: CHAT/WHISPER/EMOTE = arrived from the server · SHOWN = appeared in the chat log · LOCAL = shown only on this screen · " +
    "FARM-IN/FARM-OUT = farm bot <-> Companion · SENT/BEEP-OUT = sent by this game · MOVE/JOIN/LEAVE = map · WEARING/ITEMS/ITEM = restraints · " +
    "WARN/ERROR/PAGEERR = problems on the page · NET = connection\n\n" + S.lines.join("\n") + "\n";
}
function download() {
  try {
    const a = W.document.createElement("a");
    a.href = URL.createObjectURL(new Blob([fileText()], { type: "text/plain" }));
    a.download = "farm-watch-" + (S.who || me() || "player") + "-" + new Date(S.started || Date.now()).toISOString().slice(0, 16).replace(/[:T]/g, "-") + ".txt";
    W.document.body.appendChild(a); a.click();
    setTimeout(() => { try { a.remove(); URL.revokeObjectURL(a.href); } catch (e) {} }, 3000);
  } catch (e) { say("👁 Couldn't save the file: " + e); }
}
function command(t) {
  const [sub, ...rest] = t.trim().split(/\s+/);
  switch ((sub || "").toLowerCase()) {
    case "start": start(rest[0]); break;
    case "stop": finish("stopped by hand"); break;
    case "save": download(); break;
    case "mark": { const note = rest.join(" ") || "(no note)"; if (S.on) { line("MARK", "★ " + note); say("👁 Marked: " + note); } else say("👁 Not recording. /watch start first."); break; }
    default: say("👁 Farm Watcher: " + (S.on ? "recording, " + Math.ceil((S.until - Date.now()) / 60000) + " min left, " + S.lines.length + " lines" : "not recording" + (S.lines.length ? " (last recording: " + S.lines.length + " lines, /watch save)" : "")) +
      ". /watch start [minutes] · /watch stop · /watch save · /watch mark <note>");
  }
}
function say(text) {
  try { if (typeof W.ChatRoomSendLocal === "function" && W.ChatRoomData) { const p = W.document.createElement("div"); p.style.cssText = "color:#7fb8d4;white-space:pre-wrap"; p.textContent = text; origLocal(p.outerHTML); return; } } catch (e) {}
  console.log("[Farm Watcher]", text);
}
// the watcher's own notes shouldn't be recorded as LOCAL lines
function origLocal(h) { const f = W.ChatRoomSendLocal; const was = S.on; S.on = false; try { f(h); } finally { S.on = was; } }

// ── the 👁 button ────────────────────────────────────────────
let btn = null;
function badge() {
  try {
    if (!btn) {
      btn = W.document.createElement("div");
      btn.style.cssText = "position:fixed;top:4px;right:4px;z-index:99999;font:12px sans-serif;padding:3px 7px;border-radius:9px;cursor:pointer;opacity:0.75;user-select:none";
      btn.title = "Farm Watcher: click to start/stop, right-click to save";
      btn.addEventListener("click", () => { if (S.on) finish("stopped by hand"); else { const m = W.prompt("Farm Watcher: record for how many minutes?", "60"); if (m !== null) start(m); } });
      btn.addEventListener("contextmenu", (e) => { e.preventDefault(); download(); });
      W.document.body.appendChild(btn);
    }
    if (S.on) { btn.textContent = "👁 REC " + Math.max(0, Math.ceil((S.until - Date.now()) / 60000)) + "m · " + S.lines.length; btn.style.background = "#7a1f1f"; btn.style.color = "#fff"; }
    else { btn.textContent = "👁" + (S.lines.length ? " " + S.lines.length + " saved" : ""); btn.style.background = "#333"; btn.style.color = "#ccc"; }
  } catch (e) {}
}
setInterval(() => { badge(); if (S.on && Date.now() > S.until) finish("time's up"); }, 15000);
try {
  GM_registerMenuCommand("👁 Start recording (60 min)", () => start(60));
  GM_registerMenuCommand("👁 Stop recording", () => finish("stopped by hand"));
  GM_registerMenuCommand("👁 Save the recording (.txt)", () => download());
} catch (e) {}

// carried on after a reload?
if (S.on) { if (Date.now() > S.until) finish("time ran out while the page was closed"); else line("WATCH", "--- page reloaded; still recording ---"); }
badge(); hook();
W.addEventListener("beforeunload", () => save());
// for tests
if (W.__FARMWATCH_TEST__) W.__farmWatch = { state: () => S, command, fileText, onIn, onOut };
