// ==UserScript==
// @name         BnB Farm — Farmhand Companion
// @namespace    bnbfarm
// @version      0.1.0
// @description  Your B&B Farm panel: the farm girl's answers, stat cards and guides, right in the game.
// @author       Laynie & Alexia
// @match        *://*.bondageprojects.elementfx.com/*
// @match        *://bondageprojects.elementfx.com/*
// @match        *://*.bondage-europe.com/*
// @match        *://bondage-europe.com/*
// @match        *://*.bondageprojects.com/*
// @match        *://bondageprojects.com/*
// @match        *://*.bondage-asia.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
    mod2
  ));

  // node_modules/bondage-club-mod-sdk/dist/bcmodsdk.js
  var require_bcmodsdk = __commonJS({
    "node_modules/bondage-club-mod-sdk/dist/bcmodsdk.js"(exports) {
      var bcModSdk2 = function() {
        "use strict";
        const o = "1.2.0";
        function e(o2) {
          alert("Mod ERROR:\n" + o2);
          const e2 = new Error(o2);
          throw console.error(e2), e2;
        }
        const t = new TextEncoder();
        function n(o2) {
          return !!o2 && "object" == typeof o2 && !Array.isArray(o2);
        }
        function r(o2) {
          const e2 = /* @__PURE__ */ new Set();
          return o2.filter((o3) => !e2.has(o3) && e2.add(o3));
        }
        const i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
        function c(o2) {
          a.has(o2) || (a.add(o2), console.warn(o2));
        }
        function s(o2) {
          const e2 = [], t2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Set();
          for (const r3 of f.values()) {
            const i3 = r3.patching.get(o2.name);
            if (i3) {
              e2.push(...i3.hooks);
              for (const [e3, a2] of i3.patches.entries()) t2.has(e3) && t2.get(e3) !== a2 && c(`ModSDK: Mod '${r3.name}' is patching function ${o2.name} with same pattern that is already applied by different mod, but with different pattern:
Pattern:
${e3}
Patch1:
${t2.get(e3) || ""}
Patch2:
${a2}`), t2.set(e3, a2), n2.add(r3.name);
            }
          }
          e2.sort((o3, e3) => e3.priority - o3.priority);
          const r2 = function(o3, e3) {
            if (0 === e3.size) return o3;
            let t3 = o3.toString().replaceAll("\r\n", "\n");
            for (const [n3, r3] of e3.entries()) t3.includes(n3) || c(`ModSDK: Patching ${o3.name}: Patch ${n3} not applied`), t3 = t3.replaceAll(n3, r3);
            return (0, eval)(`(${t3})`);
          }(o2.original, t2);
          let i2 = function(e3) {
            var t3, i3;
            const a2 = null === (i3 = (t3 = m.errorReporterHooks).hookChainExit) || void 0 === i3 ? void 0 : i3.call(t3, o2.name, n2), c2 = r2.apply(this, e3);
            return null == a2 || a2(), c2;
          };
          for (let t3 = e2.length - 1; t3 >= 0; t3--) {
            const n3 = e2[t3], r3 = i2;
            i2 = function(e3) {
              var t4, i3;
              const a2 = null === (i3 = (t4 = m.errorReporterHooks).hookEnter) || void 0 === i3 ? void 0 : i3.call(t4, o2.name, n3.mod), c2 = n3.hook.apply(this, [e3, (o3) => {
                if (1 !== arguments.length || !Array.isArray(e3)) throw new Error(`Mod ${n3.mod} failed to call next hook: Expected args to be array, got ${typeof o3}`);
                return r3.call(this, o3);
              }]);
              return null == a2 || a2(), c2;
            };
          }
          return { hooks: e2, patches: t2, patchesSources: n2, enter: i2, final: r2 };
        }
        function l(o2, e2 = false) {
          let r2 = i.get(o2);
          if (r2) e2 && (r2.precomputed = s(r2));
          else {
            let e3 = window;
            const a2 = o2.split(".");
            for (let t2 = 0; t2 < a2.length - 1; t2++) if (e3 = e3[a2[t2]], !n(e3)) throw new Error(`ModSDK: Function ${o2} to be patched not found; ${a2.slice(0, t2 + 1).join(".")} is not object`);
            const c2 = e3[a2[a2.length - 1]];
            if ("function" != typeof c2) throw new Error(`ModSDK: Function ${o2} to be patched not found`);
            const l2 = function(o3) {
              let e4 = -1;
              for (const n2 of t.encode(o3)) {
                let o4 = 255 & (e4 ^ n2);
                for (let e5 = 0; e5 < 8; e5++) o4 = 1 & o4 ? -306674912 ^ o4 >>> 1 : o4 >>> 1;
                e4 = e4 >>> 8 ^ o4;
              }
              return ((-1 ^ e4) >>> 0).toString(16).padStart(8, "0").toUpperCase();
            }(c2.toString().replaceAll("\r\n", "\n")), d2 = { name: o2, original: c2, originalHash: l2 };
            r2 = Object.assign(Object.assign({}, d2), { precomputed: s(d2), router: () => {
            }, context: e3, contextProperty: a2[a2.length - 1] }), r2.router = /* @__PURE__ */ function(o3) {
              return function(...e4) {
                return o3.precomputed.enter.apply(this, [e4]);
              };
            }(r2), i.set(o2, r2), e3[r2.contextProperty] = r2.router;
          }
          return r2;
        }
        function d() {
          for (const o2 of i.values()) o2.precomputed = s(o2);
        }
        function p() {
          const o2 = /* @__PURE__ */ new Map();
          for (const [e2, t2] of i) o2.set(e2, { name: e2, original: t2.original, originalHash: t2.originalHash, sdkEntrypoint: t2.router, currentEntrypoint: t2.context[t2.contextProperty], hookedByMods: r(t2.precomputed.hooks.map((o3) => o3.mod)), patchedByMods: Array.from(t2.precomputed.patchesSources) });
          return o2;
        }
        const f = /* @__PURE__ */ new Map();
        function u(o2) {
          f.get(o2.name) !== o2 && e(`Failed to unload mod '${o2.name}': Not registered`), f.delete(o2.name), o2.loaded = false, d();
        }
        function g(o2, t2) {
          o2 && "object" == typeof o2 || e("Failed to register mod: Expected info object, got " + typeof o2), "string" == typeof o2.name && o2.name || e("Failed to register mod: Expected name to be non-empty string, got " + typeof o2.name);
          let r2 = `'${o2.name}'`;
          "string" == typeof o2.fullName && o2.fullName || e(`Failed to register mod ${r2}: Expected fullName to be non-empty string, got ${typeof o2.fullName}`), r2 = `'${o2.fullName} (${o2.name})'`, "string" != typeof o2.version && e(`Failed to register mod ${r2}: Expected version to be string, got ${typeof o2.version}`), o2.repository || (o2.repository = void 0), void 0 !== o2.repository && "string" != typeof o2.repository && e(`Failed to register mod ${r2}: Expected repository to be undefined or string, got ${typeof o2.version}`), null == t2 && (t2 = {}), t2 && "object" == typeof t2 || e(`Failed to register mod ${r2}: Expected options to be undefined or object, got ${typeof t2}`);
          const i2 = true === t2.allowReplace, a2 = f.get(o2.name);
          a2 && (a2.allowReplace && i2 || e(`Refusing to load mod ${r2}: it is already loaded and doesn't allow being replaced.
Was the mod loaded multiple times?`), u(a2));
          const c2 = (o3) => {
            let e2 = g2.patching.get(o3.name);
            return e2 || (e2 = { hooks: [], patches: /* @__PURE__ */ new Map() }, g2.patching.set(o3.name, e2)), e2;
          }, s2 = (o3, t3) => (...n2) => {
            var i3, a3;
            const c3 = null === (a3 = (i3 = m.errorReporterHooks).apiEndpointEnter) || void 0 === a3 ? void 0 : a3.call(i3, o3, g2.name);
            g2.loaded || e(`Mod ${r2} attempted to call SDK function after being unloaded`);
            const s3 = t3(...n2);
            return null == c3 || c3(), s3;
          }, p2 = { unload: s2("unload", () => u(g2)), hookFunction: s2("hookFunction", (o3, t3, n2) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3), a3 = c2(i3);
            "number" != typeof t3 && e(`Mod ${r2} failed to hook function '${o3}': Expected priority number, got ${typeof t3}`), "function" != typeof n2 && e(`Mod ${r2} failed to hook function '${o3}': Expected hook function, got ${typeof n2}`);
            const s3 = { mod: g2.name, priority: t3, hook: n2 };
            return a3.hooks.push(s3), d(), () => {
              const o4 = a3.hooks.indexOf(s3);
              o4 >= 0 && (a3.hooks.splice(o4, 1), d());
            };
          }), patchFunction: s2("patchFunction", (o3, t3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3), a3 = c2(i3);
            n(t3) || e(`Mod ${r2} failed to patch function '${o3}': Expected patches object, got ${typeof t3}`);
            for (const [n2, i4] of Object.entries(t3)) "string" == typeof i4 ? a3.patches.set(n2, i4) : null === i4 ? a3.patches.delete(n2) : e(`Mod ${r2} failed to patch function '${o3}': Invalid format of patch '${n2}'`);
            d();
          }), removePatches: s2("removePatches", (o3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const t3 = l(o3);
            c2(t3).patches.clear(), d();
          }), callOriginal: s2("callOriginal", (o3, t3, n2) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to call a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3);
            return Array.isArray(t3) || e(`Mod ${r2} failed to call a function: Expected args array, got ${typeof t3}`), i3.original.apply(null != n2 ? n2 : globalThis, t3);
          }), getOriginalHash: s2("getOriginalHash", (o3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to get hash: Expected function name string, got ${typeof o3}`);
            return l(o3).originalHash;
          }) }, g2 = { name: o2.name, fullName: o2.fullName, version: o2.version, repository: o2.repository, allowReplace: i2, api: p2, loaded: true, patching: /* @__PURE__ */ new Map() };
          return f.set(o2.name, g2), Object.freeze(p2);
        }
        function h() {
          const o2 = [];
          for (const e2 of f.values()) o2.push({ name: e2.name, fullName: e2.fullName, version: e2.version, repository: e2.repository });
          return o2;
        }
        let m;
        const y = void 0 === window.bcModSdk ? window.bcModSdk = function() {
          const e2 = { version: o, apiVersion: 1, registerMod: g, getModsInfo: h, getPatchingInfo: p, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) };
          return m = e2, Object.freeze(e2);
        }() : (n(window.bcModSdk) || e("Failed to init Mod SDK: Name already in use"), 1 !== window.bcModSdk.apiVersion && e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== o && alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')
One of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk);
        return "undefined" != typeof exports && (Object.defineProperty(exports, "__esModule", { value: true }), exports.default = y), y;
      }();
    }
  });

  // extension/src/index.js
  var import_bondage_club_mod_sdk = __toESM(require_bcmodsdk(), 1);

  // shared/protocol.js
  var FARM_MSG = "FarmhandMsg";
  var PROTOCOL = 1;
  function makeMsg(type, data = {}, target) {
    const m = { Content: FARM_MSG, Type: "Hidden", Dictionary: { v: PROTOCOL, type, ...data } };
    if (target) m.Target = target;
    return m;
  }
  function readMsg(data) {
    if (!data || data.Type !== "Hidden" || data.Content !== FARM_MSG) return null;
    const d = data.Dictionary;
    if (!d || typeof d !== "object" || Array.isArray(d) || typeof d.type !== "string") return null;
    return { ...d, from: data.Sender };
  }

  // extension/src/version.js
  var VERSION = "0.1.0";

  // extension/src/config.js
  var BOT_MEMBER = 260239;
  var HELLO_EVERY_MS = 30 * 60 * 1e3;
  var HISTORY_MAX = 40;
  var QUICK = [
    // buttons along the top of the panel
    ["📋 Stats", "stats"],
    ["📏 Size", "size"],
    ["🥛 Quota", "quota"],
    ["✏️ Tally", "tally"],
    ["❓ Help", "help me"]
  ];

  // extension/src/panel.js
  var CSS = `
#fhc-btn{position:fixed;right:12px;bottom:12px;z-index:9999;width:44px;height:44px;border-radius:50%;
  border:2px solid #c9a35b;background:#3b2a1a;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 2px 8px #0008}
#fhc-btn[data-unread]:after{content:attr(data-unread);position:absolute;top:-4px;right:-4px;background:#d9534f;
  color:#fff;border-radius:9px;font-size:11px;padding:1px 5px;font-family:sans-serif}
#fhc-panel{position:fixed;right:12px;bottom:64px;z-index:9999;width:min(420px,calc(100vw - 24px));height:min(560px,70vh);
  display:none;flex-direction:column;background:#21170f;color:#f3e9d8;border:2px solid #c9a35b;border-radius:10px;
  font:13px/1.35 sans-serif;box-shadow:0 4px 18px #000a}
#fhc-panel.open{display:flex}
#fhc-head{padding:8px 10px;font-weight:bold;border-bottom:1px solid #5a432a;display:flex;justify-content:space-between}
#fhc-quick{display:flex;flex-wrap:wrap;gap:4px;padding:6px 8px;border-bottom:1px solid #5a432a}
#fhc-quick button,#fhc-form button{background:#5a432a;color:#f3e9d8;border:1px solid #c9a35b;border-radius:6px;padding:3px 7px;cursor:pointer}
#fhc-feed{flex:1;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:8px}
.fhc-card{background:#2f2216;border-left:3px solid #c9a35b;border-radius:6px;padding:6px 8px;white-space:pre-wrap;
  font-family:ui-monospace,Consolas,monospace;font-size:12px}
.fhc-card.notice{border-left-color:#8fbf6a}
.fhc-card.mine{background:transparent;border-left-color:#7a6a55;color:#bfae95;font-family:sans-serif}
.fhc-time{display:block;font-family:sans-serif;font-size:10px;color:#9c8a70;margin-bottom:2px}
#fhc-form{display:flex;gap:4px;padding:6px 8px;border-top:1px solid #5a432a}
#fhc-input{flex:1;background:#140e09;color:#f3e9d8;border:1px solid #5a432a;border-radius:6px;padding:4px 6px}
`;
  var Panel = class {
    constructor(onCommand) {
      this.onCommand = onCommand;
      this.unread = 0;
      const doc = window.document;
      const style = doc.createElement("style");
      style.textContent = CSS;
      doc.head.appendChild(style);
      this.btn = doc.createElement("button");
      this.btn.id = "fhc-btn";
      this.btn.title = "B&B Farm";
      this.btn.textContent = "🌾";
      this.btn.addEventListener("click", () => this.toggle());
      this.el = doc.createElement("div");
      this.el.id = "fhc-panel";
      this.el.innerHTML = '<div id="fhc-head"><span>🌾 B&amp;B Farm</span><span id="fhc-status">…</span></div><div id="fhc-quick"></div><div id="fhc-feed"></div><form id="fhc-form"><input id="fhc-input" placeholder="Ask the farm girl… (stats, size, help me)" autocomplete="off"><button>Send</button></form>';
      const quick = this.el.querySelector("#fhc-quick");
      for (const [label, cmd] of QUICK) {
        const b = doc.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", () => this.ask(cmd));
        quick.appendChild(b);
      }
      this.feed = this.el.querySelector("#fhc-feed");
      this.status = this.el.querySelector("#fhc-status");
      const input = this.el.querySelector("#fhc-input");
      this.el.querySelector("#fhc-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (input.value.trim()) this.ask(input.value.trim());
        input.value = "";
      });
      this.el.addEventListener("keydown", (e) => e.stopPropagation());
      doc.body.appendChild(this.btn);
      doc.body.appendChild(this.el);
    }
    ask(cmd) {
      this.add(cmd, "mine");
      this.onCommand(cmd);
    }
    toggle(open = !this.el.classList.contains("open")) {
      this.el.classList.toggle("open", open);
      if (open) {
        this.unread = 0;
        this.btn.removeAttribute("data-unread");
      }
    }
    show(visible) {
      this.btn.style.display = visible ? "" : "none";
      if (!visible) this.toggle(false);
    }
    setStatus(text) {
      this.status.textContent = text;
    }
    add(text, kind = "reply") {
      const card = window.document.createElement("div");
      card.className = "fhc-card " + kind;
      const time = window.document.createElement("span");
      time.className = "fhc-time";
      time.textContent = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + (kind === "notice" ? " · from the farm" : kind === "mine" ? " · you asked" : "");
      card.appendChild(time);
      card.appendChild(window.document.createTextNode(text));
      this.feed.appendChild(card);
      while (this.feed.children.length > HISTORY_MAX) this.feed.firstChild.remove();
      this.feed.scrollTop = this.feed.scrollHeight;
      if (kind !== "mine" && !this.el.classList.contains("open")) {
        this.unread++;
        this.btn.setAttribute("data-unread", String(this.unread));
      }
    }
  };

  // extension/src/index.js
  var bcModSdk = import_bondage_club_mod_sdk.default.default || import_bondage_club_mod_sdk.default;
  var mod = bcModSdk.registerMod({
    name: "FarmhandCompanion",
    fullName: "B&B Farm Farmhand Companion",
    version: VERSION
  });
  var st = { panel: null, welcomed: false, lastHello: 0, parts: /* @__PURE__ */ new Map() };
  var botHere = () => window.CurrentScreen === "ChatRoom" && Array.isArray(window.ChatRoomCharacter) && window.ChatRoomCharacter.some((c) => c.MemberNumber === BOT_MEMBER);
  function toBot(type, data) {
    window.ServerSend("ChatRoomChat", makeMsg(type, data, BOT_MEMBER));
  }
  function hello() {
    st.lastHello = Date.now();
    toBot("hello", { ver: VERSION });
  }
  function sendCommand(text) {
    text = String(text || "").trim();
    if (!text) return;
    if (botHere()) {
      if (!st.welcomed) hello();
      toBot("cmd", { text });
    } else {
      window.ServerSend("AccountBeep", { MemberNumber: BOT_MEMBER, BeepType: "", Message: text });
      st.panel.add("The farm girl isn't in your room, so I beeped her. Her answer comes back as a beep.", "notice");
    }
  }
  function collect(m) {
    if (!m.of || m.of <= 1) return String(m.text || "");
    const got = st.parts.get(m.id) || [];
    got[m.part - 1] = String(m.text || "");
    st.parts.set(m.id, got);
    if (got.filter((x) => x !== void 0).length < m.of) return null;
    st.parts.delete(m.id);
    return got.join("\n");
  }
  function onFarmMsg(m) {
    if (m.from !== BOT_MEMBER) return;
    switch (m.type) {
      case "ping":
        hello();
        break;
      case "welcome":
        st.welcomed = true;
        st.panel.setStatus("connected · bot v" + m.ver);
        break;
      case "reply":
      case "notice": {
        const text = collect(m);
        if (text !== null) st.panel.add(text, m.type);
        break;
      }
    }
  }
  function start() {
    st.panel = new Panel(sendCommand);
    st.panel.setStatus("waitin' for the farm girl");
    mod.hookFunction("ChatRoomMessage", 10, (args, next) => {
      const m = readMsg(args[0]);
      if (m) {
        try {
          onFarmMsg(m);
        } catch (e) {
          console.warn("[Farmhand Companion]", e);
        }
        return;
      }
      return next(args);
    });
    if (typeof window.CommandCombine === "function") {
      window.CommandCombine([{
        Tag: "farm",
        Description: "<command>: ask the B&B Farm girl, e.g. /farm stats",
        Action: (args) => {
          sendCommand(args);
          st.panel.toggle(true);
        }
      }]);
    }
    setInterval(() => {
      const here = botHere();
      st.panel.show(window.CurrentScreen === "ChatRoom");
      if (!here) {
        if (st.welcomed) st.panel.setStatus("farm girl's not in this room");
        st.welcomed = false;
        return;
      }
      if (!st.welcomed && Date.now() - st.lastHello > 15e3) hello();
      else if (st.welcomed && Date.now() - st.lastHello > HELLO_EVERY_MS) hello();
    }, 3e3);
    console.log("[Farmhand Companion] v" + VERSION + " loaded");
  }
  var wait = setInterval(() => {
    if (typeof window.ServerSend === "function" && window.document && window.document.body) {
      clearInterval(wait);
      start();
    }
  }, 1e3);
})();
