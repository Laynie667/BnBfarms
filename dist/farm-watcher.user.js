// ==UserScript==
// @name         BnB Farm — Farm Watcher (diagnostics)
// @namespace    bnbfarm
// @version      1.0.1
// @description  Records what this game sees for a while (chat, whispers, beeps, actions, map moves, restraints, Companion and bot messages, errors) and saves it as a text file. Not part of the bot; run it on a player's game.
// @author       Laynie & Alexia
// @match        *://*.bondageprojects.elementfx.com/*
// @match        *://bondageprojects.elementfx.com/*
// @match        *://*.bondage-europe.com/*
// @match        *://bondage-europe.com/*
// @match        *://*.bondageprojects.com/*
// @match        *://bondageprojects.com/*
// @match        *://*.bondage-asia.com/*
// @match        *://bondage-asia.com/*
// @match        *://*.bondageeurope.com/*
// @match        *://bondageeurope.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(() => {
  // watcher/index.js
  var W = typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : window;
  var VERSION = true ? "1.0.1" : "dev";
  var KEY = "farm_watch_v1";
  var MAX_LINES = 8e4;
  var MAX_CHARS = 9e6;
  var S = { on: false, until: 0, started: 0, lines: [], chars: 0 };
  try {
    const old = JSON.parse(GM_getValue(KEY, "null"));
    if (old && Array.isArray(old.lines)) S = Object.assign(S, old);
  } catch (e) {
  }
  var names = /* @__PURE__ */ new Map();
  function nameOf(mn) {
    if (mn === void 0 || mn === null || mn === "") return "?";
    try {
      const c = (W.ChatRoomCharacter || []).find((x) => x.MemberNumber === mn);
      if (c) {
        const n = c.Nickname || c.Name;
        if (n) names.set(mn, n);
      }
    } catch (e) {
    }
    return (names.get(mn) || "#" + mn) + "(" + mn + ")";
  }
  var me = () => {
    try {
      return W.Player && W.Player.MemberNumber;
    } catch (e) {
      return null;
    }
  };
  var clock = (t) => {
    const d = new Date(t);
    const p = (n, l) => String(n).padStart(l || 2, "0");
    return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()) + "." + p(d.getMilliseconds(), 3);
  };
  var short = (s, n) => {
    s = String(s === void 0 ? "" : s).replace(/\s+/g, " ").trim();
    return s.length > (n || 400) ? s.slice(0, n || 400) + "\u2026" : s;
  };
  var lastMove = null;
  function line(kind, text) {
    if (!S.on) return;
    if (Date.now() > S.until) {
      finish("time's up");
      return;
    }
    const l = clock(Date.now()) + "  " + (kind + "         ").slice(0, 9) + " " + text;
    S.lines.push(l);
    S.chars += l.length + 1;
    while (S.lines.length > MAX_LINES || S.chars > MAX_CHARS) S.chars -= S.lines.shift().length + 1;
    saveSoon();
    badge();
  }
  function moveLine(mn, pos) {
    const now = Date.now(), p = pos ? pos.X + "," + pos.Y : "?";
    if (lastMove && lastMove.mn === mn && now - lastMove.at < 3e3 && S.lines.length - 1 === lastMove.idx) {
      S.lines[lastMove.idx] = S.lines[lastMove.idx].replace(/ → [\d?,]+$/, " \u2192 " + p);
      lastMove.at = now;
      return;
    }
    line("MOVE", nameOf(mn) + " \u2192 " + p);
    lastMove = { mn, at: now, idx: S.lines.length - 1 };
  }
  var saveT = null;
  function saveSoon() {
    if (saveT) return;
    saveT = setTimeout(() => {
      saveT = null;
      save();
    }, 3e4);
  }
  function save() {
    try {
      GM_setValue(KEY, JSON.stringify(S));
    } catch (e) {
      console.warn("[Farm Watcher] save:", e);
    }
  }
  var looks = /* @__PURE__ */ new Map();
  function look(app) {
    const m = {};
    for (const it of app || []) {
      try {
        const g = it.Group || it.Asset && it.Asset.Group && it.Asset.Group.Name;
        if (!g) continue;
        if (!/^Item/.test(g)) continue;
        const a = it.Name || it.Asset && it.Asset.Name || "?";
        const craft = it.Craft && it.Craft.Name ? ' "' + short(it.Craft.Name, 40) + '"' : "";
        const lock = it.Property && it.Property.LockedBy ? " [" + it.Property.LockedBy + "]" : "";
        m[g] = a + craft + lock;
      } catch (e) {
      }
    }
    return m;
  }
  function lookChange(mn, app, by) {
    if (!mn || !app) return;
    const now = look(app), was = looks.get(mn);
    looks.set(mn, now);
    if (!was) {
      const list = Object.entries(now).map(([g, v]) => g + ": " + v);
      line("WEARING", nameOf(mn) + (list.length ? " \xB7 " + list.join(" \xB7 ") : " \xB7 no restraints"));
      return;
    }
    const ch = [];
    for (const g of new Set(Object.keys(now).concat(Object.keys(was)))) {
      if (now[g] === was[g]) continue;
      ch.push(now[g] ? was[g] ? g + ": " + was[g] + " \u2192 " + now[g] : "+" + g + ": " + now[g] : "-" + g + ": " + was[g]);
    }
    if (ch.length) line("ITEMS", nameOf(mn) + (by ? " (by " + nameOf(by) + ")" : "") + " \xB7 " + ch.join(" \xB7 "));
  }
  var SECRET = /pass(word)?|e-?mail|token|secret|accountname|cookie/i;
  function clean(v, d) {
    if (v === null || typeof v !== "object") return v;
    if ((d || 0) > 3) return "\u2026";
    if (Array.isArray(v)) return v.slice(0, 20).map((x) => clean(x, (d || 0) + 1));
    const o = {};
    for (const k of Object.keys(v).slice(0, 30)) o[k] = SECRET.test(k) ? "[hidden]" : clean(v[k], (d || 0) + 1);
    return o;
  }
  var json = (v, n) => short(JSON.stringify(clean(v)), n || 300);
  function dictText(dict) {
    if (!Array.isArray(dict)) return "";
    const o = [];
    for (const e of dict) {
      if (!e || typeof e !== "object") continue;
      if (e.SourceCharacter !== void 0) o.push("by " + nameOf(e.SourceCharacter));
      else if (e.TargetCharacter !== void 0) o.push("on " + nameOf(e.TargetCharacter));
      else if (e.FocusGroupName) o.push("at " + e.FocusGroupName);
      else if (e.ActivityName) o.push("activity " + e.ActivityName);
      else if (e.AssetName) o.push("item " + e.AssetName);
      else if (e.Tag && e.Text !== void 0) o.push(e.Tag + "=" + short(e.Text, 60));
    }
    return o.join(", ");
  }
  function onIn(ev, d) {
    if (!S.on) return;
    try {
      switch (ev) {
        case "ChatRoomMessage": {
          if (!d) return;
          const from = nameOf(d.Sender), to = d.Target ? " \u2192 " + nameOf(d.Target) : "";
          const text = typeof d.Content === "string" ? d.Content : json(d.Content);
          if (d.Type === "Hidden") {
            if (d.Content === "FarmhandMsg") {
              const m = d.Dictionary || {};
              line("FARM-IN", from + to + " \xB7 " + (m.type || "?") + (m.text ? ": " + short(m.text, 600) : "") + (m.type && !m.text ? " " + json(m, 250) : ""));
            } else line("HIDDEN", from + to + " \xB7 " + short(text, 120) + (d.Dictionary ? " " + json(d.Dictionary, 160) : ""));
            return;
          }
          if (d.Type === "Activity" || d.Type === "Action" || d.Type === "ServerMessage") {
            line(d.Type.toUpperCase().slice(0, 9), short(text, 80) + " \xB7 " + dictText(d.Dictionary));
            return;
          }
          line(String(d.Type || "MSG").toUpperCase(), from + to + ": " + short(text, 1e3));
          return;
        }
        case "ChatRoomSync": {
          if (!d) return;
          line("ROOM", 'joined/synced "' + d.Name + '" \xB7 map ' + (d.MapData && d.MapData.Type) + " \xB7 " + (d.Character || []).length + " people \xB7 admins " + (d.Admin || []).length + " \xB7 whitelist " + (d.Whitelist || []).length);
          for (const c of d.Character || []) {
            if (c.Nickname || c.Name) names.set(c.MemberNumber, c.Nickname || c.Name);
            line("HERE", nameOf(c.MemberNumber) + " at " + (c.MapData && c.MapData.Pos ? c.MapData.Pos.X + "," + c.MapData.Pos.Y : "?"));
            lookChange(c.MemberNumber, c.Appearance);
          }
          return;
        }
        case "ChatRoomSyncSingle":
        case "ChatRoomSyncCharacter":
          if (d && d.Character) lookChange(d.Character.MemberNumber, d.Character.Appearance, d.SourceMemberNumber);
          return;
        case "ChatRoomSyncItem":
          if (d && d.Item) line("ITEM", nameOf(d.Item.Target) + " \xB7 " + d.Item.Group + ": " + (d.Item.Name || "(removed)") + (d.Item.Craft && d.Item.Craft.Name ? ' "' + short(d.Item.Craft.Name, 40) + '"' : "") + (d.Item.Property && d.Item.Property.LockedBy ? " [" + d.Item.Property.LockedBy + "]" : "") + " \xB7 by " + nameOf(d.Source));
          return;
        case "ChatRoomSyncMapData":
          if (d) moveLine(d.MemberNumber, d.MapData && d.MapData.Pos);
          return;
        case "ChatRoomSyncMemberJoin":
          if (d && d.Character) {
            names.set(d.Character.MemberNumber, d.Character.Nickname || d.Character.Name);
            line("JOIN", nameOf(d.Character.MemberNumber) + (d.Character.MapData && d.Character.MapData.Pos ? " at " + d.Character.MapData.Pos.X + "," + d.Character.MapData.Pos.Y : ""));
            lookChange(d.Character.MemberNumber, d.Character.Appearance);
          }
          return;
        case "ChatRoomSyncMemberLeave":
          if (d) line("LEAVE", nameOf(d.SourceMemberNumber));
          return;
        case "ChatRoomSyncRoomProperties":
          if (d) line("ROOMPROP", json({ Name: d.Name, Admin: d.Admin, Whitelist: d.Whitelist, Ban: d.Ban, Locked: d.Locked, Private: d.Private }, 400));
          return;
        case "AccountBeep":
          if (d) line("BEEP-IN", nameOf(d.MemberNumber) + (d.MemberName ? ' "' + d.MemberName + '"' : "") + (d.BeepType ? " [" + d.BeepType + "]" : "") + (d.ChatRoomName ? " in " + d.ChatRoomName : "") + ": " + (typeof d.Message === "string" ? short(d.Message, 1e3) : json(d.Message, 300)));
          return;
        case "LoginResponse":
          line("LOGIN", typeof d === "object" ? "logged in" : String(d));
          return;
        // never the account data
        case "AccountQueryResult":
          if (d) line("QUERY", d.Query + " \xB7 " + (Array.isArray(d.Result) ? d.Result.length + " results" : json(d.Result, 120)));
          return;
        case "ChatRoomSearchResult":
          line("SEARCH", (Array.isArray(d) ? d.length : "?") + " rooms");
          return;
        default:
          line("IN", ev + " " + json(d, 200));
      }
    } catch (e) {
      line("WATCHERR", "reading " + ev + ": " + e);
    }
  }
  function onOut(ev, d) {
    if (!S.on) return;
    try {
      if (/Login|Password|AccountCreate|AccountUpdateEmail/i.test(ev)) {
        line("OUT", ev + " [hidden]");
        return;
      }
      if (ev === "ChatRoomChat" && d) {
        const to = d.Target ? " \u2192 " + nameOf(d.Target) : "";
        if (d.Type === "Hidden" && d.Content === "FarmhandMsg") {
          const m = d.Dictionary || {};
          line("FARM-OUT", "me" + to + " \xB7 " + (m.type || "?") + (m.text ? ": " + short(m.text, 400) : ""));
          return;
        }
        line("SENT", "[" + d.Type + "]" + to + ": " + short(typeof d.Content === "string" ? d.Content : json(d.Content), 1e3) + (d.Type === "Activity" || d.Type === "Action" ? " \xB7 " + dictText(d.Dictionary) : ""));
        return;
      }
      if (ev === "AccountBeep" && d) {
        line("BEEP-OUT", "\u2192 " + nameOf(d.MemberNumber) + (d.BeepType ? " [" + d.BeepType + "]" : "") + ": " + (typeof d.Message === "string" ? short(d.Message, 1e3) : json(d.Message, 300)));
        return;
      }
      if (ev === "AccountUpdate") {
        line("OUT", "AccountUpdate (" + Object.keys(d || {}).join(", ") + ")");
        return;
      }
      if (ev === "ChatRoomCharacterMapDataUpdate") {
        return;
      }
      line("OUT", ev + " " + json(d, 200));
    } catch (e) {
    }
  }
  function htmlText(h) {
    const div = W.document.createElement("div");
    div.innerHTML = String(h);
    return div.textContent || "";
  }
  var seenObs = null;
  function watchChatLog() {
    const log = W.document.getElementById("TextAreaChatLog");
    if (!log || log.__farmWatched) return;
    log.__farmWatched = true;
    seenObs = new W.MutationObserver((muts) => {
      for (const m of muts) for (const n of m.addedNodes) {
        try {
          const t = short(n.textContent || "", 1e3);
          if (t) line("SHOWN", t);
        } catch (e) {
        }
      }
    });
    seenObs.observe(log, { childList: true });
  }
  var hooked = { sock: false, send: false, local: false, cons: false };
  function hook() {
    try {
      if (!hooked.sock && W.ServerSocket && typeof W.ServerSocket.onAny === "function") {
        W.ServerSocket.onAny((ev, d) => onIn(ev, d));
        W.ServerSocket.on("disconnect", (r) => line("NET", "disconnected: " + r));
        W.ServerSocket.on("connect", () => line("NET", "connected"));
        hooked.sock = true;
      }
      if (!hooked.send && typeof W.ServerSend === "function" && !W.ServerSend.__farmWatch) {
        const orig = W.ServerSend;
        const wrapped = function(ev, d) {
          onOut(ev, d);
          return orig.apply(this, arguments);
        };
        wrapped.__farmWatch = true;
        W.ServerSend = wrapped;
        hooked.send = true;
      }
      if (!hooked.local && typeof W.ChatRoomSendLocal === "function" && !W.ChatRoomSendLocal.__farmWatch) {
        const orig = W.ChatRoomSendLocal;
        const wrapped = function(h) {
          line("LOCAL", short(htmlText(h), 1e3));
          return orig.apply(this, arguments);
        };
        wrapped.__farmWatch = true;
        W.ChatRoomSendLocal = wrapped;
        hooked.local = true;
      }
      if (!hooked.cons) {
        for (const lvl of ["warn", "error"]) {
          const C = W.console, orig = C[lvl].bind(C);
          C[lvl] = (...a) => {
            try {
              line(lvl === "warn" ? "WARN" : "ERROR", short(a.map((x) => x instanceof Error ? x.stack || x : typeof x === "object" ? json(x, 300) : x).join(" "), 800));
            } catch (e) {
            }
            orig(...a);
          };
        }
        W.addEventListener("error", (e) => line("PAGEERR", short((e.message || "") + " @ " + (e.filename || "") + ":" + (e.lineno || ""), 600)));
        W.addEventListener("unhandledrejection", (e) => line("PAGEERR", "promise: " + short(e.reason && (e.reason.stack || e.reason), 600)));
        hooked.cons = true;
      }
      watchChatLog();
      if (!hook.cmd && typeof W.CommandCombine === "function") {
        W.CommandCombine([{
          Tag: "watch",
          Description: "start [minutes] | stop | save | mark <note>: the Farm Watcher's diagnostics recording",
          Action: (args) => command(String(args || ""))
        }]);
        hook.cmd = true;
      }
    } catch (e) {
      console.log("[Farm Watcher] hook:", e);
    }
  }
  setInterval(hook, 1e3);
  setInterval(() => {
    if (!S.on) return;
    try {
      const people = (W.ChatRoomCharacter || []).map((c) => nameOf(c.MemberNumber) + "@" + (c.MapData && c.MapData.Pos ? c.MapData.Pos.X + "," + c.MapData.Pos.Y : "?"));
      line("SNAPSHOT", (W.ChatRoomData ? '"' + W.ChatRoomData.Name + '" \xB7 ' : "not in a room \xB7 ") + people.length + " people: " + people.join(" "));
    } catch (e) {
    }
  }, 3e5);
  function detect() {
    const has = (k) => {
      try {
        return W[k] !== void 0;
      } catch (e) {
        return false;
      }
    };
    return [
      has("__farmhandOwnPanel") ? "Farmhand Companion" : null,
      has("Farmhand") ? "Farmhand bot (this is the bot's page?)" : null,
      has("bcx") ? "BCX" : null,
      has("FUSAM") ? "FUSAM" : null,
      has("bcModSdk") ? "ModSDK" : null
    ].filter(Boolean).join(", ") || "none detected";
  }
  function start(min) {
    min = Math.max(1, Math.min(240, Math.round(Number(min) || 60)));
    S = { on: true, started: Date.now(), until: Date.now() + min * 6e4, lines: [], chars: 0 };
    looks.clear();
    const room = W.ChatRoomData;
    line("WATCH", "Farm Watcher v" + VERSION + " recording for " + min + " minutes");
    line("WATCH", "this game: " + nameOf(me()) + " \xB7 server " + W.location.host + " \xB7 game " + (W.GameVersion || "?") + " \xB7 scripts: " + detect());
    line("WATCH", room ? 'in "' + room.Name + '" \xB7 map ' + (room.MapData && room.MapData.Type) : "not in a room yet");
    try {
      for (const c of W.ChatRoomCharacter || []) {
        line("HERE", nameOf(c.MemberNumber) + " at " + (c.MapData && c.MapData.Pos ? c.MapData.Pos.X + "," + c.MapData.Pos.Y : "?"));
        lookChange(c.MemberNumber, c.Appearance);
      }
    } catch (e) {
    }
    save();
    badge();
    say("\u{1F441} Farm Watcher: recording for " + min + " minutes. /watch mark <note> when something odd happens; /watch save any time.");
  }
  function finish(why) {
    if (!S.on) return;
    S.lines.push(clock(Date.now()) + "  WATCH     stopped (" + why + ")");
    S.on = false;
    save();
    badge();
    say("\u{1F441} Farm Watcher stopped (" + why + "). " + S.lines.length + " lines. /watch save or the \u{1F441} button to download.");
    download();
  }
  function fileText() {
    return "B&B Farm \u2014 Farm Watcher recording\nPrivate: this has people's messages in it. No passwords or e-mails are written down.\nStarted " + new Date(S.started || Date.now()).toString() + "\nKinds: CHAT/WHISPER/EMOTE = arrived from the server \xB7 SHOWN = appeared in the chat log \xB7 LOCAL = shown only on this screen \xB7 FARM-IN/FARM-OUT = farm bot <-> Companion \xB7 SENT/BEEP-OUT = sent by this game \xB7 MOVE/JOIN/LEAVE = map \xB7 WEARING/ITEMS/ITEM = restraints \xB7 WARN/ERROR/PAGEERR = problems on the page \xB7 NET = connection\n\n" + S.lines.join("\n") + "\n";
  }
  function download() {
    try {
      const a = W.document.createElement("a");
      a.href = URL.createObjectURL(new Blob([fileText()], { type: "text/plain" }));
      a.download = "farm-watch-" + (me() || "player") + "-" + new Date(S.started || Date.now()).toISOString().slice(0, 16).replace(/[:T]/g, "-") + ".txt";
      W.document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          a.remove();
          URL.revokeObjectURL(a.href);
        } catch (e) {
        }
      }, 3e3);
    } catch (e) {
      say("\u{1F441} Couldn't save the file: " + e);
    }
  }
  function command(t) {
    const [sub, ...rest] = t.trim().split(/\s+/);
    switch ((sub || "").toLowerCase()) {
      case "start":
        start(rest[0]);
        break;
      case "stop":
        finish("stopped by hand");
        break;
      case "save":
        download();
        break;
      case "mark": {
        const note = rest.join(" ") || "(no note)";
        if (S.on) {
          line("MARK", "\u2605 " + note);
          say("\u{1F441} Marked: " + note);
        } else say("\u{1F441} Not recording. /watch start first.");
        break;
      }
      default:
        say("\u{1F441} Farm Watcher: " + (S.on ? "recording, " + Math.ceil((S.until - Date.now()) / 6e4) + " min left, " + S.lines.length + " lines" : "not recording" + (S.lines.length ? " (last recording: " + S.lines.length + " lines, /watch save)" : "")) + ". /watch start [minutes] \xB7 /watch stop \xB7 /watch save \xB7 /watch mark <note>");
    }
  }
  function say(text) {
    try {
      if (typeof W.ChatRoomSendLocal === "function" && W.ChatRoomData) {
        const p = W.document.createElement("div");
        p.style.cssText = "color:#7fb8d4;white-space:pre-wrap";
        p.textContent = text;
        origLocal(p.outerHTML);
        return;
      }
    } catch (e) {
    }
    console.log("[Farm Watcher]", text);
  }
  function origLocal(h) {
    const f = W.ChatRoomSendLocal;
    const was = S.on;
    S.on = false;
    try {
      f(h);
    } finally {
      S.on = was;
    }
  }
  var btn = null;
  function badge() {
    try {
      if (!btn) {
        btn = W.document.createElement("div");
        btn.style.cssText = "position:fixed;top:4px;right:4px;z-index:99999;font:12px sans-serif;padding:3px 7px;border-radius:9px;cursor:pointer;opacity:0.75;user-select:none";
        btn.title = "Farm Watcher: click to start/stop, right-click to save";
        btn.addEventListener("click", () => {
          if (S.on) finish("stopped by hand");
          else {
            const m = W.prompt("Farm Watcher: record for how many minutes?", "60");
            if (m !== null) start(m);
          }
        });
        btn.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          download();
        });
        W.document.body.appendChild(btn);
      }
      if (S.on) {
        btn.textContent = "\u{1F441} REC " + Math.max(0, Math.ceil((S.until - Date.now()) / 6e4)) + "m \xB7 " + S.lines.length;
        btn.style.background = "#7a1f1f";
        btn.style.color = "#fff";
      } else {
        btn.textContent = "\u{1F441}" + (S.lines.length ? " " + S.lines.length + " saved" : "");
        btn.style.background = "#333";
        btn.style.color = "#ccc";
      }
    } catch (e) {
    }
  }
  setInterval(() => {
    badge();
    if (S.on && Date.now() > S.until) finish("time's up");
  }, 15e3);
  try {
    GM_registerMenuCommand("\u{1F441} Start recording (60 min)", () => start(60));
    GM_registerMenuCommand("\u{1F441} Stop recording", () => finish("stopped by hand"));
    GM_registerMenuCommand("\u{1F441} Save the recording (.txt)", () => download());
  } catch (e) {
  }
  if (S.on) {
    if (Date.now() > S.until) finish("time ran out while the page was closed");
    else line("WATCH", "--- page reloaded; still recording ---");
  }
  badge();
  hook();
  W.addEventListener("beforeunload", () => save());
  if (W.__FARMWATCH_TEST__) W.__farmWatch = { state: () => S, command, fileText, onIn, onOut };
})();
