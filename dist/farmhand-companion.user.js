// ==UserScript==
// @name         BnB Farm — Farmhand Companion
// @namespace    bnbfarm
// @version      0.10.0
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
        function h2() {
          const o2 = [];
          for (const e2 of f.values()) o2.push({ name: e2.name, fullName: e2.fullName, version: e2.version, repository: e2.repository });
          return o2;
        }
        let m;
        const y = void 0 === window.bcModSdk ? window.bcModSdk = function() {
          const e2 = { version: o, apiVersion: 1, registerMod: g, getModsInfo: h2, getPatchingInfo: p, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) };
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
  var PROTOCOL = 2;
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
  var VERSION = "0.10.0";

  // extension/src/config.js
  var BOT_MEMBER = 260239;
  var HELLO_EVERY_MS = 30 * 60 * 1e3;
  var HISTORY_MAX = 60;
  var PREFS_KEY = "fhc-prefs";

  // extension/src/styles.js
  var THEME = {
    ground: "#21170f",
    card: "#2f2216",
    line: "#5a432a",
    accent: "#c9a35b",
    text: "#f3e9d8",
    muted: "#bfae95",
    good: "#8fbf6a",
    alert: "#b8403a",
    well: "#140e09"
  };
  var CSS = `
#fhc-btn{position:fixed;right:12px;bottom:12px;z-index:9999;width:46px;height:46px;border-radius:50%;
  border:2px solid var(--fh-accent);background:#3b2a1a;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 2px 8px #0008}
#fhc-btn[data-unread]:after{content:attr(data-unread);position:absolute;top:-4px;right:-4px;background:var(--fh-alert);
  color:#fff;border-radius:9px;font-size:11px;padding:1px 5px;font-family:sans-serif}
#fhc-panel{position:fixed;right:12px;bottom:66px;z-index:9999;width:min(440px,calc(100vw - 24px));height:min(640px,78vh);
  display:none;flex-direction:column;background:var(--fh-ground);color:var(--fh-text);border:2px solid var(--fh-accent);border-radius:12px;
  font:14px/1.4 "Source Sans 3","Segoe UI",sans-serif;box-shadow:0 4px 18px #000a;overflow:hidden}
#fhc-panel.open{display:flex}
#fhc-panel.compact{font-size:12.5px}
#fhc-panel button{font:inherit;cursor:pointer}
.fhc-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid var(--fh-line);cursor:move}
.fhc-title{font-family:Bitter,Georgia,serif;font-weight:700;font-size:17px;color:var(--fh-accent)}
.fhc-row{display:flex;align-items:center;gap:6px;padding:7px 12px;border-bottom:1px solid var(--fh-line);flex-wrap:wrap}
.fhc-grow{flex:1}
.fhc-safe{flex:1;min-height:38px;border-radius:8px;border:1px solid var(--fh-alert);background:transparent;color:var(--fh-text);font-weight:600}
.fhc-safe.red{background:var(--fh-alert);color:#fff;font-weight:700}
.fhc-pill{min-height:32px;padding:0 11px;border-radius:999px;border:1px solid var(--fh-line);background:transparent;color:var(--fh-text);font-weight:600}
.fhc-pill.on{background:var(--fh-accent);border-color:var(--fh-accent);color:var(--fh-ground)}
.fhc-body{flex:1;min-height:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.fhc-box{background:var(--fh-card);border:1px solid var(--fh-line);border-radius:10px;padding:11px}
.fhc-box.ask{border-color:var(--fh-accent)}
.fhc-box.alert{border:2px solid var(--fh-alert)}
.fhc-h{font-family:Bitter,Georgia,serif;font-weight:700;color:var(--fh-accent);margin-bottom:6px}
.fhc-muted{color:var(--fh-muted);font-size:12px}
.fhc-chip{display:inline-block;font-size:12px;padding:2px 9px;border-radius:999px;border:1px solid var(--fh-line);margin:0 4px 4px 0}
.fhc-chip-good{border-color:var(--fh-good)} .fhc-chip-alert{border-color:var(--fh-alert)} .fhc-chip-acc{border-color:var(--fh-accent)}
.fhc-b{min-height:36px;padding:0 12px;border-radius:8px;border:1px solid var(--fh-accent);background:var(--fh-line);color:var(--fh-text);font-weight:600;margin:0 6px 6px 0}
.fhc-b-acc{background:var(--fh-accent);color:var(--fh-ground);font-weight:700}
.fhc-cmd{min-height:32px;padding:0 9px;border-radius:6px;border:1px solid var(--fh-line);background:var(--fh-well);color:var(--fh-text);
  font-family:ui-monospace,Consolas,monospace;font-size:12px;margin:0 5px 5px 0}
.fhc-bar{margin:6px 0}
.fhc-bar-row{display:flex;justify-content:space-between}
.fhc-bar-track{height:9px;border-radius:5px;background:var(--fh-line);overflow:hidden;margin-top:3px}
.fhc-bar-fill{height:100%;background:var(--fh-accent)} .fhc-fill-good{background:var(--fh-good)} .fhc-fill-alert{background:var(--fh-alert)}
.fhc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.fhc-kv{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--fh-line)}
.fhc-tog{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fh-line)}
.fhc-tog-l{font-weight:600}
.fhc-sw{flex-shrink:0;position:relative;width:48px;height:28px;border-radius:14px;border:1px solid var(--fh-line);background:var(--fh-well);padding:0}
.fhc-sw span{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:10px;background:var(--fh-muted);transition:left .15s}
.fhc-sw.on{background:var(--fh-good);border-color:var(--fh-good)} .fhc-sw.on span{left:23px;background:var(--fh-ground)}
.fhc-card{background:var(--fh-card);border-left:3px solid var(--fh-accent);border-radius:6px;padding:6px 8px;white-space:pre-wrap;
  font-family:ui-monospace,Consolas,monospace;font-size:12px}
.fhc-card.notice{border-left-color:var(--fh-good)}
.fhc-card.mine{background:transparent;border-left-color:#7a6a55;color:var(--fh-muted);font-family:inherit}
.fhc-time{display:block;font-family:sans-serif;font-size:10px;color:var(--fh-muted);margin-bottom:2px}
.fhc-form{display:flex;gap:6px;padding:8px 12px;border-top:1px solid var(--fh-line)}
.fhc-in,.fhc-sel{flex:1;min-height:36px;box-sizing:border-box;background:var(--fh-well);color:var(--fh-text);border:1px solid var(--fh-line);border-radius:8px;padding:4px 8px;font:inherit}
.fhc-sel{flex:none;width:100%}
.fhc-label{display:flex;flex-direction:column;gap:3px;font-size:12px;color:var(--fh-muted);margin:6px 0}
.fhc-split{display:flex;gap:8px;align-items:flex-start}
.fhc-docs{width:130px;flex-shrink:0;display:flex;flex-direction:column;gap:5px}
.fhc-doc{text-align:left;min-height:40px;padding:5px 8px;border-radius:8px;border:1px solid var(--fh-line);background:transparent;color:var(--fh-text)}
.fhc-doc.on{border-color:var(--fh-accent);background:var(--fh-card)}
.fhc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
`;

  // extension/src/dom.js
  function h(tag, props, ...kids) {
    const el = window.document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === void 0 || v === null || v === false) continue;
      if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (k === "class") el.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k === "value") el.value = v;
      else el.setAttribute(k, v === true ? "" : String(v));
    }
    add(el, kids);
    return el;
  }
  function add(el, kids) {
    for (const k of kids) {
      if (k === null || k === void 0 || k === false) continue;
      if (Array.isArray(k)) add(el, k);
      else el.appendChild(typeof k === "object" ? k : window.document.createTextNode(String(k)));
    }
  }
  var card = (...kids) => h("div", { class: "fhc-box" }, ...kids);
  var title = (text) => h("div", { class: "fhc-h" }, text);
  var muted = (text) => h("div", { class: "fhc-muted" }, text);
  var btn = (label, onclick, accent) => h("button", { type: "button", class: accent ? "fhc-b fhc-b-acc" : "fhc-b", onclick }, label);
  var chip = (text, kind) => h("span", { class: "fhc-chip" + (kind ? " fhc-chip-" + kind : "") }, text);
  function bar(label, value, pct2, kind) {
    return h(
      "div",
      { class: "fhc-bar" },
      h("div", { class: "fhc-bar-row" }, h("span", null, label), h("span", { class: "fhc-muted" }, value)),
      h("div", { class: "fhc-bar-track" }, h("div", { class: "fhc-bar-fill" + (kind ? " fhc-fill-" + kind : ""), style: { width: Math.max(0, Math.min(100, pct2)) + "%" } }))
    );
  }
  function toggle(label, desc, on, onflip) {
    return h(
      "div",
      { class: "fhc-tog" },
      h("div", null, h("div", { class: "fhc-tog-l" }, label), desc ? h("div", { class: "fhc-muted" }, desc) : null),
      h("button", { type: "button", class: "fhc-sw" + (on ? " on" : ""), "aria-pressed": on ? "true" : "false", "aria-label": label, onclick: onflip }, h("span"))
    );
  }
  var ml = (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + " L" : Math.round(n) + " mL";

  // shared/guides.js
  var BOOKS = [["Rules", "rules"], ["Consent", "consent"], ["Tour", "tour"], ["Doors", "doors"], ["Species", "species"], ["Help", "help"]];
  var PUBLIC_GROUPS = [
    { name: "Safety", cmds: ["safe", "stuck", "staff", "report"] },
    { name: "Gettin' started", cmds: ["help", "help me", "rules", "consent", "tour", "apply", "friend", "species", "luxury", "doors", "addons"] },
    { name: "You and the farm", cmds: ["record", "keys", "who", "herd", "notice", "weather", "feeding", "curfew", "beg"] },
    { name: "Milk", cmds: ["stats", "board", "milkable", "quota"] },
    { name: "Breedin'", cmds: ["breedable", "fertile", "freeuse", "jarok", "yes", "no", "naturalheat", "breed <who>", "cum <who>", "wash", "tally", "eggs", "praise", "degrade", "rights", "accept", "pedigree"] },
    { name: "Body", cmds: ["size", "measure", "penis", "futa", "gender <word>"] },
    { name: "Clothes", cmds: ["outfit", "outfits", "uniform", "outfit back"] },
    { name: "Mind", cmds: ["hypno", "teaseme"] },
    { name: "Fun", cmds: ["fair", "enter"] }
  ];
  var STAFF_GROUPS = [
    { name: "Books", cmds: ["queue", "app <n>", "approve <who> livestock", "deny <who>", "appclear", "roster", "stock", "find <who>", "record <who>", "note <who>", "signed", "addfriend <who>", "unregister <who>"] },
    { name: "Herd", cmds: ["claim <who>", "release <who>", "myherd", "herdname <name>", "herdcall", "herdsummon", "turnout <who>", "letup <who>", "brand <who>", "walk <who>"] },
    { name: "Stock", cmds: ["tier <who> <tier>", "stocks <who>", "unstock <who>", "vet <who>", "inspect <who>", "tease list"] },
    { name: "Contracts", cmds: ["contract list", "contract show deep <who>", "contract offer deep <who> 1w", "contract check <who>", "contract release <who>", "contract rules", "contracts"] },
    { name: "Outfits", cmds: ["outfit", "outfit offer <who>", "outfit offer <who> <species> <gender>"] },
    { name: "Barn", cmds: ["milk <who>", "collect <who>", "jars", "inseminate <who> <jar>", "machine <who> <jar>", "drain <who>", "edge <who>", "denial <who>", "ruin <who>", "nomilk <who> <hours>", "quota <who>", "heat <who>", "heatline", "shotlog"] },
    { name: "Map", cmds: ["spot", "spot set <name>", "spot place <name> <x> <y>", "zone", "zone who", "zone a <name>", "zone b <name>", "zone box <name> <ax> <ay> <bx> <by>", "zone pair <name> <group>", "tourstop", "setrescue", "where", "stucklog"] },
    { name: "Voice", cmds: ["voice", "voice on herd", "voice add herd <line>", "voice every herd 15"] },
    { name: "Work and play", cmds: ["clockin", "clockout", "hours", "done", "chores", "chore add <job> @<place>", "wheel", "spin", "begphrase", "score"] },
    { name: "Keys and calls", cmds: ["keys <who>", "keysync", "keydump", "grant <who> <tier>", "revoke <who>", "forced", "summon <who>", "summon all", "pasture", "onduty", "cover"] }
  ];
  var OWNER_GROUPS = [
    { name: "Proprietors", cmds: ["staffadd <who> <role>", "staffremove <who>", "goldkey <who>", "notice <text>", "feeding on", "curfew on", "fair open", "addons off <name>", "addons on <name>", "backup", "health"] }
  ];
  var needsInput = (cmd) => /</.test(cmd);
  var cmdStem = (cmd) => cmd.replace(/\s*<.*$/, "").trim();

  // extension/src/views/common.js
  function guidesTab(ctx2, staff) {
    const q2 = (ctx2.ui.search || "").toLowerCase();
    const groups = PUBLIC_GROUPS.concat(
      staff ? STAFF_GROUPS : [],
      staff && ctx2.s.proprietor ? OWNER_GROUPS : [],
      (ctx2.s.addonCmds || []).map((g) => ({ name: "🧩 " + g.name, cmds: (g.cmds || []).map(String) }))
    );
    const shown = groups.map((g) => ({ name: g.name, cmds: g.cmds.filter((c) => !q2 || c.includes(q2) || g.name.toLowerCase().includes(q2)) })).filter((g) => g.cmds.length);
    const input2 = h("input", {
      class: "fhc-in",
      placeholder: "milk, breed, keys…",
      value: ctx2.ui.search || "",
      oninput: (e) => ctx2.setUi({ search: e.target.value }, true)
    });
    return [
      h("label", { class: "fhc-label" }, "Search guides and commands", input2),
      h("div", null, BOOKS.map(([label, cmd]) => btn(label, () => ctx2.send(cmd), true))),
      shown.map((g) => card(title(g.name), h("div", null, g.cmds.map((c) => h("button", {
        type: "button",
        class: "fhc-cmd",
        title: needsInput(c) ? "Fill in the rest, then send" : "Send it",
        onclick: () => needsInput(c) ? ctx2.fillBox(cmdStem(c) + " ") : ctx2.send(c)
      }, "?" + c))))),
      staff ? null : muted("Staff see their own commands on the Staff panel.")
    ];
  }
  var AREAS = [
    ["The pasture", "Open", "Open ground, good grass, the heart of the place. Four milkin' stalls along the side."],
    ["The barn", "Open", "Warm and dim. Where the stock sleeps and the machines live."],
    ["Barn safe room", "Bronze", "Quiet and soft, off the back of the barn. Nobody follows you through it."],
    ["The pens", "Open", "Gloryhole stalls, for punishment, breedin', or leavin' somethin' out for guests."],
    ["Kennel and ring", "Open", "Pets, trainin' and the show ring, with a locker room attached."],
    ["Medical", "Silver", "Checkups, injections, and watchin' what develops."],
    ["Staff room", "Silver", "Interviews and staff business, back of the pasture."],
    ["Security wing", "Gold", "Permanent displays down the back hall."],
    ["The cabin", "Booking", "Laynie and Alexia's home, unless somebody books it."]
  ];

  // extension/src/views/livestock.js
  var pct = (a, b) => b ? 100 * a / b : 0;
  var hoursLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 36e5));
  function me(ctx2) {
    const s = ctx2.s;
    const chips = [
      s.tier && chip(s.tier, "acc"),
      s.species && chip(s.species),
      s.gender && chip(s.gender),
      ...(s.keys || []).map((k) => chip(k + " key")),
      s.heatUntil && chip("in heat", "alert"),
      s.preg && chip("carryin'", "good")
    ];
    const bars = [
      s.milk && bar("Milk", ml(s.milk.ml) + " of " + ml(s.milk.cap) + " · grade " + s.milk.grade, pct(s.milk.ml, s.milk.cap)),
      s.quota && bar("Today's quota", ml(s.quota.ml) + " of " + ml(s.quota.goal) + (s.quota.streak ? " · streak " + s.quota.streak : ""), pct(s.quota.ml, s.quota.goal), "good"),
      s.semen && bar("Seed", ml(s.semen.ml) + " of " + ml(s.semen.cap), pct(s.semen.ml, s.semen.cap)),
      s.holding && s.holding.ml > 0 && bar("Holding", ml(s.holding.ml) + " of " + ml(s.holding.cap), pct(s.holding.ml, s.holding.cap), "alert")
    ];
    return [
      card(h("div", { class: "fhc-title" }, s.name), h("div", { style: { marginTop: "6px" } }, chips)),
      bars.some(Boolean) && card(
        title("Today"),
        bars,
        s.heatUntil && muted("In heat for " + hoursLeft(s.heatUntil) + " more hours"),
        s.preg && muted("Carryin' for " + s.preg.sires.join(" & ") + " · due in " + Math.max(0, Math.ceil((s.preg.due - Date.now()) / 864e5)) + " day(s)")
      ),
      (s.body || []).length && card(title("Body"), h(
        "div",
        { class: "fhc-grid" },
        s.body.map((b) => h("div", null, muted(b.label), h("div", { style: { fontWeight: 600 } }, b.size)))
      )),
      s.today && card(title("Marks"), h(
        "div",
        { class: "fhc-grid" },
        [["Used today", s.today.tally], ["Naughty marks", s.today.naughty], ["Praised", s.today.praised]].map(([k, v]) => h("div", null, muted(k), h("div", { style: { fontWeight: 600 } }, v)))
      )),
      h("div", { class: "fhc-quick" }, ["stats", "measure", "record", "pedigree", "keys"].map((c) => btn(c[0].toUpperCase() + c.slice(1), () => ctx2.send(c))))
    ];
  }
  function gearCard(s) {
    const g = s.gear || {};
    const steps = (lv) => h(
      "div",
      { style: { display: "flex", gap: "4px", marginTop: "6px" } },
      [1, 2, 3, 4].map((n) => h("div", { style: { flex: "1", height: "9px", borderRadius: "3px", background: n <= lv ? "var(--fh-accent)" : "var(--fh-line)" } }))
    );
    return card(
      title("Milkin' gear"),
      g.milk ? [
        h("div", { class: "fhc-kv" }, h("b", null, g.milk.name), h("span", null, g.milk.ml + " mL a minute")),
        steps(g.milk.level),
        muted(["", "Gentle", "Steady", "Hard", "Max"][g.milk.level] + (g.milk.kind === "echo" ? " · the more worked up you are, the faster it draws" : ""))
      ] : muted("No pump on right now. A lactation pump, Echo's portable pump, the milk vendor or a milkin' stall all milk you here."),
      g.machine && h("div", { class: "fhc-kv" }, h("span", null, "⚙️ " + g.machine.name), h("span", { class: "fhc-muted" }, g.machine.intensity < 0 ? "off" : "intensity " + g.machine.intensity)),
      g.funnel && h("div", { class: "fhc-kv" }, h("span", null, "Funnel gag"), h("span", { class: "fhc-muted" }, "fitted, and it counts as open"))
    );
  }
  function milking(ctx2) {
    const s = ctx2.s;
    if (!s.milk && !s.semen) return [card(title("Milking"), muted("You're not makin' milk right now. Flip Milkable on in Toggles if you'd like to."))];
    return [
      s.milk && card(
        title("Milk"),
        bar("In your udder", ml(s.milk.ml) + " of " + ml(s.milk.cap), pct(s.milk.ml, s.milk.cap)),
        muted("Grade " + s.milk.grade + (s.milk.lastAt ? " · last milked " + Math.round((Date.now() - s.milk.lastAt) / 6e4) + " min ago" : ""))
      ),
      s.quota && card(title("Quota"), bar("Today", ml(s.quota.ml) + " of " + ml(s.quota.goal), pct(s.quota.ml, s.quota.goal), "good")),
      s.semen && card(title("Seed"), bar("Stored", ml(s.semen.ml) + " of " + ml(s.semen.cap), pct(s.semen.ml, s.semen.cap))),
      gearCard(s),
      s.stallUntil && card(h(
        "div",
        { class: "fhc-kv" },
        title("Milkin' stall"),
        chip(Math.max(0, Math.round((s.stallUntil - Date.now()) / 6e4)) + " min left", "acc")
      ), muted("It drains you down to a quarter of what you hold, then lets go.")),
      h("div", null, btn("Quota", () => ctx2.send("quota")), btn("Milk board", () => ctx2.send("board")))
    ];
  }
  function breeding(ctx2) {
    const s = ctx2.s, sw = s.switches || {};
    const rows = [
      ["Breedable", sw.breedable],
      ["Fertile", sw.fertile],
      ["Jar insemination", sw.jarok ? "asks first" : "never"],
      ["Free use", sw.freeuse],
      ["Natural heat", sw.naturalheat]
    ];
    return [
      card(
        title("Breedin'"),
        rows.map(([k, v]) => h("div", { class: "fhc-kv" }, h("span", null, k), h("span", { class: "fhc-muted" }, v === true ? "on" : v === false ? "off" : v))),
        s.heatUntil && muted("🔥 In heat · " + hoursLeft(s.heatUntil) + " h left"),
        s.preg && muted("🍼 Carryin' for " + s.preg.sires.join(" & "))
      ),
      h("div", null, btn("My tally", () => ctx2.send("tally")), btn("Eggs", () => ctx2.send("eggs")), btn("Wash up", () => ctx2.send("wash")), btn("Pedigree", () => ctx2.send("pedigree")))
    ];
  }
  function inbox(ctx2) {
    const f = ctx2.ui.filter || "all";
    const items = ctx2.feed.filter((x) => f === "all" || x.kind === f);
    return [
      h("div", null, [["all", "All"], ["notice", "From the farm"], ["reply", "Answers"], ["mine", "You asked"]].map(([id, label]) => h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx2.setUi({ filter: id }) }, label))),
      items.length ? items.slice().reverse().map((x) => h(
        "div",
        { class: "fhc-card " + x.kind },
        h("span", { class: "fhc-time" }, new Date(x.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + (x.kind === "notice" ? " · from the farm" : x.kind === "mine" ? " · you asked" : "")),
        x.text
      )) : muted("Nothin' here yet.")
    ];
  }
  var SWITCH_INFO = [
    ["breedable", "Breedable", "You can be bred and filled"],
    ["fertile", "Fertile", "You can catch"],
    ["jarok", "Jar insemination", "On: staff still ask every time · Off: never"],
    ["freeuse", "Free use", "Any stud may have you without askin'"],
    ["futa", "Futa", "Cock and vulva both, milk and semen both"],
    ["milkable", "Milkable", "Make milk"],
    ["naturalheat", "Natural heat", "Come into heat on your own every 7 days"],
    ["praise", "Praise", "Let staff's praise count"],
    ["degrade", "Degrade", "Let staff's degradin' count"],
    ["tally", "Tally marks", "Show your tally on ?who and the board"],
    ["teaseme", "Tease me", "Let staff tease lines name you"],
    ["hypno", "Hypno", "Let your herd leader's voice lines reach you, privately"]
  ];
  var NEEDS = { freeuse: ["breedable", "Turn Breedable on first"] };
  function farmSwitches(ctx2, list) {
    const sw = ctx2.s.switches || {};
    return list.map(([cmd, label, desc]) => {
      const need = NEEDS[cmd];
      if (need && !sw[need[0]] && !sw[cmd]) return toggle(label, need[1] + " · " + desc, false, () => ctx2.send(cmd + " on"));
      return toggle(label, desc, !!sw[cmd], () => ctx2.send(cmd + " " + (sw[cmd] ? "off" : "on")));
    });
  }
  function panelPrefs(ctx2) {
    return card(
      title("This panel"),
      muted("Only on your computer."),
      [
        ["chatToo", "Farm messages in chat too", "Tease lines, heat, summons and other farm messages also show in your chat log"],
        ["compact", "Compact cards", "Smaller text, more on screen"],
        ["chime", "Chime on notices", "A soft sound when the farm messages you"],
        ["popopen", "Open on new notice", "Pop the panel open by itself"],
        ["btnPinned", "Pin the 🌾 button", "Unpinned, you can drag it anywhere (mouse or finger). Pin it so it stays put."]
      ].map(([k, label, desc]) => toggle(label, desc, !!ctx2.prefs[k], () => ctx2.setPref(k, !ctx2.prefs[k]))),
      toggle(
        "Farm emotes about me come from me",
        "Belly kicks, milkin', breedin'… are posted as your own emote (no name in front), so the people who can see you see them and the farm girl needn't move. Only lines about you.",
        !ctx2.prefs.noRelay,
        () => {
          ctx2.setPref("noRelay", !ctx2.prefs.noRelay);
          ctx2.api.rehello && ctx2.api.rehello();
        }
      ),
      // the farm's little cues on your own screen (cues.js); each one on unless you switch it off
      [
        ["noLead", "Lead me instead of teleportin'", "When the farm moves you (feedin' time, the stocks, a summon), you walk there yourself, step by step"],
        ["noFace", "Farm can set my face", "Dazed when milk-drunk, flushed in heat, a trance stare… for a little while"],
        ["noSound", "Farm sounds", "The pump, the stall door, the feedin' bell. Only you hear them, at your game volume"],
        ["noTrance", "Trance haze", "A soft haze at the edges of your screen during conditioning sessions"],
        ["noFeelings", "Private feelings", "Now and then, a line only you see about what you're feelin' (your gear, your arousal, how full you are)"],
        ["noMarkers", "Map markers (staff)", "Small badges over stock on your map: M needs milkin', H in heat, B expectin', X teats capped"]
      ].map(([k, label, desc]) => toggle(label, desc, !ctx2.prefs[k], () => {
        ctx2.setPref(k, !ctx2.prefs[k]);
        ctx2.api.rehello && ctx2.api.rehello();
      })),
      btn("Put the button and panel back in the corner", () => ctx2.resetPlaces && ctx2.resetPlaces())
    );
  }
  function toggles(ctx2) {
    return [
      card(title("Farm settings"), muted("Saved by the farm girl. Your limits still win."), farmSwitches(ctx2, SWITCH_INFO)),
      card(
        title("Gender"),
        muted("How the farm sees you. It picks your farm outfit."),
        h("div", { style: { marginTop: "6px" } }, ["female", "male", "futa", "femboy"].map((g) => h("button", { type: "button", class: "fhc-pill" + (ctx2.s.gender === g ? " on" : ""), onclick: () => ctx2.send("gender " + g) }, g)))
      ),
      ctx2.api.hasBackup && ctx2.api.hasBackup() ? card(
        title("Farm outfit"),
        muted("The farm dressed you, and your own clothes are kept on this computer."),
        btn("Change back into my own clothes", () => ctx2.api.back && ctx2.api.back())
      ) : null,
      panelPrefs(ctx2)
    ];
  }
  var LIVESTOCK_TABS = [
    { id: "me", label: "Me", render: me },
    { id: "milk", label: "Milking", render: milking },
    { id: "breed", label: "Breeding", render: breeding },
    { id: "inbox", label: "Inbox", render: inbox },
    { id: "guides", label: "Guides", render: (ctx2) => guidesTab(ctx2, false) },
    { id: "toggles", label: "Toggles", render: toggles }
  ];

  // extension/src/views/guest.js
  var GUEST_TABS = [
    { id: "welcome", label: "Welcome", render: (ctx2) => [
      card(
        h("div", { class: "fhc-title" }, "Howdy, " + (ctx2.welcome.name || "sugar") + "!"),
        h("p", null, "Welcome to B&B Farm. Everybody here chose to be here and signed to say so. Have a look around, mind the ruts, and holler if you need a hand."),
        btn("Take the tour", () => ctx2.send("tour"), true),
        btn("Apply to join", () => ctx2.send("apply")),
        btn("Luxury stay", () => ctx2.send("luxury"))
      ),
      card(title("Your keys"), muted("Guests don't carry keys. Staff can let you through any door."))
    ] },
    { id: "farm", label: "The farm", render: () => AREAS.map(([n, key, d]) => card(h("div", { class: "fhc-kv" }, h("b", null, n), h("span", { class: "fhc-muted" }, key)), muted(d))) },
    { id: "rules", label: "Rules", render: (ctx2) => [
      h(
        "div",
        { class: "fhc-box alert" },
        h("b", null, "Safe word stops everything"),
        muted("Anywhere, from anybody. No contract overrides it. Beepin' the farm girl works from anywhere on the property, too.")
      ),
      card(title("On consent"), h("p", null, "Every animal and every hand here chose to be here, and signed for it. What you see in the pens, stalls and barn was asked for. The contract's a fence that holds both ways: what ain't in it, don't happen.")),
      h("div", null, btn("Full rules", () => ctx2.send("rules")), btn("Consent", () => ctx2.send("consent")), btn("What opens what", () => ctx2.send("doors")))
    ] },
    { id: "inbox", label: "Inbox", render: inbox },
    { id: "guides", label: "Guides", render: (ctx2) => guidesTab(ctx2, false) },
    { id: "settings", label: "Settings", render: (ctx2) => [card(title("Farm settings"), muted("Once you're on the books, your milkin', breedin' and teasin' switches show up here."), btn("Apply to join", () => ctx2.send("apply"), true)), panelPrefs(ctx2)] }
  ];

  // shared/bcplus-rules.json
  var bcplus_rules_default = {
    bcplusVersion: "0.14.0",
    made: "2026-10-03",
    rules: [
      {
        id: "speech.forbidWhisper",
        name: "Forbid whispering",
        category: "Speech",
        description: "The player cannot send whispers to other people in the room.",
        bcxEquivalent: "speech_restrict_whisper_send",
        settings: [
          {
            type: "checkbox",
            name: "allowLover",
            label: "Still allow whispering to Lover-ranked roles and above",
            default: true
          }
        ]
      },
      {
        id: "speech.forbidOOC",
        name: "Forbid OOC messages",
        category: "Speech",
        description: "The player cannot send messages containing out-of-character (parenthesized) text. Whispers are not affected.",
        bcxEquivalent: "speech_block_ooc",
        settings: []
      },
      {
        id: "speech.gaggedOOC",
        name: "Block OOC while gagged",
        category: "Speech",
        description: "The player cannot use out-of-character (parenthesized) text while gagged - a gag should not be so easy to talk around.",
        bcxEquivalent: "speech_block_gagged_ooc",
        settings: []
      },
      {
        id: "speech.forbiddenWords",
        name: "Forbidden words",
        category: "Speech",
        description: "The player cannot use the configured words in chat or whispers.",
        bcxEquivalent: "speech_ban_words",
        settings: [
          {
            type: "stringList",
            name: "words",
            label: "Forbidden words:",
            default: [],
            maxChars: 100,
            entryLabel: "word"
          },
          {
            type: "checkbox",
            name: "includeOOC",
            label: "Also forbid the words in OOC (parentheses)",
            default: false
          }
        ]
      },
      {
        id: "speech.mandatoryWords",
        name: "Mandatory words",
        category: "Speech",
        description: 'Every chat message must contain at least one of the configured words (e.g. "Miss, please, humbly"). Purely out-of-character messages are exempt.',
        bcxEquivalent: "speech_mandatory_words",
        settings: [
          {
            type: "stringList",
            name: "words",
            label: "Required words:",
            default: [],
            maxChars: 100,
            entryLabel: "word"
          },
          {
            type: "checkbox",
            name: "includeWhispers",
            label: "Also apply to whispers",
            default: false
          }
        ]
      },
      {
        id: "speech.minimumWords",
        name: "Require detailed speech",
        category: "Speech",
        description: "Every chat message must contain at least the configured number of words - doll talk in reverse, for detailed roleplay. Purely out-of-character messages and emotes are exempt.",
        settings: [
          {
            type: "option",
            name: "minWords",
            label: "Minimum words per message:",
            options: [
              "2",
              "3",
              "4",
              "5",
              "6",
              "8",
              "10",
              "15",
              "20"
            ],
            default: "5"
          },
          {
            type: "checkbox",
            name: "includeWhispers",
            label: "Also apply to whispers",
            default: false
          }
        ]
      },
      {
        id: "speech.restrainedSpeech",
        name: "Restrained speech",
        category: "Speech",
        description: "The player can only say the configured phrases, nothing else (case and end punctuation are ignored). Purely out-of-character messages are exempt.",
        bcxEquivalent: "speech_restrained_speech",
        settings: [
          {
            type: "stringList",
            name: "phrases",
            label: "Allowed phrases:",
            default: [
              "Yes Miss",
              "No Miss",
              "Thank you Miss",
              "Please Miss"
            ],
            maxChars: 120,
            entryLabel: "phrase"
          }
        ]
      },
      {
        id: "speech.dollTalk",
        name: "Doll talk",
        category: "Speech",
        description: "The player can only speak in short, simple phrases: limited words per message and letters per word. Out-of-character text is not affected.",
        bcxEquivalent: "speech_doll_talk",
        settings: [
          {
            type: "option",
            name: "maxWords",
            label: "Maximum words per message",
            options: [
              "3",
              "5",
              "7",
              "10"
            ],
            default: "5"
          },
          {
            type: "option",
            name: "maxWordLength",
            label: "Maximum letters per word",
            options: [
              "4",
              "5",
              "6",
              "7",
              "8"
            ],
            default: "6"
          }
        ]
      },
      {
        id: "speech.wordReplace",
        name: "Replace spoken words",
        category: "Speech",
        description: 'Configured words are replaced in everything the player says. Each entry is word:replacement (e.g. "i:this doll"). Out-of-character text is not affected.',
        bcxEquivalent: "speech_replace_spoken_words",
        settings: [
          {
            type: "stringList",
            name: "replacements",
            label: "Replacements:",
            default: [],
            maxChars: 120,
            entryLabel: "word:replacement"
          }
        ]
      },
      {
        id: "speech.faltering",
        name: "Enforce faltering speech",
        category: "Speech",
        description: "The player's spoken messages come out st-st-stuttering. Out-of-character text is not affected.",
        bcxEquivalent: "speech_alter_faltering",
        settings: []
      },
      {
        id: "speech.forbidShouting",
        name: "Forbid shouting",
        category: "Speech",
        description: "All-caps chat messages are lowered to normal speech when enforced.",
        settings: []
      },
      {
        id: "speech.forbidEmotes",
        name: "Forbid emotes",
        category: "Speech",
        description: "The player cannot send emote messages to the room.",
        bcxEquivalent: "speech_forbid_emotes",
        settings: []
      },
      {
        id: "social.forbidBeepMessages",
        name: "Forbid beep messages",
        category: "Social",
        description: "The player cannot send beeps with message content to friends.",
        bcxEquivalent: "speech_restrict_beep_send",
        settings: [
          {
            type: "checkbox",
            name: "allowPlainBeeps",
            label: "Still allow plain beeps without a message",
            default: true
          }
        ]
      },
      {
        id: "social.forbidBeeps",
        name: "Forbid sending beeps",
        category: "Social",
        description: "The player cannot send any beeps at all, with or without a message. Hidden mod-to-mod beeps (leashes, summons, BCX) are unaffected, and configured members can still be beeped.",
        settings: [
          {
            type: "members",
            name: "allowedMembers",
            label: "Members who may still be beeped:",
            default: []
          }
        ]
      },
      {
        id: "social.friendListChanges",
        name: "Forbid friend-list changes",
        category: "Social",
        description: "The player cannot add or remove BC friends; each direction can be toggled separately. Covers the friend list screen and in-room dialogs.",
        settings: [
          {
            type: "checkbox",
            name: "blockAdding",
            label: "Block adding friends",
            default: true
          },
          {
            type: "checkbox",
            name: "blockRemoving",
            label: "Block removing friends",
            default: true
          }
        ]
      },
      {
        id: "chat.forbidLeaving",
        name: "Forbid leaving the room",
        category: "Other",
        description: "The player cannot leave the chat room they are in - the exit button and leave commands from other mods are both blocked. Forced moves (leashes, kicks, BC's safeword release) and disconnects are not prevented.",
        bcxEquivalent: "block_leaving_room",
        settings: []
      },
      {
        id: "rooms.create",
        name: "Forbid creating new rooms",
        category: "Rooms",
        description: "The player cannot open the room creation screen. Changing settings of an existing room they administrate is unaffected.",
        bcxEquivalent: "block_creating_rooms",
        settings: []
      },
      {
        id: "rooms.entry",
        name: "Restrict entering rooms",
        category: "Rooms",
        description: 'The player can only join rooms whose name is on the configured list (case-insensitive). As a safety measure the rule does nothing while the list is empty. Being moved by a BC+ command or summon is not restricted. Combines well with "Forbid creating new rooms".',
        bcxEquivalent: "block_entering_rooms",
        settings: [
          {
            type: "stringList",
            name: "allowedRooms",
            label: "Allowed room names:",
            default: [],
            maxChars: 60,
            entryLabel: "room name"
          }
        ]
      },
      {
        id: "rooms.adminUI",
        name: "Forbid room admin UI while blind",
        category: "Rooms",
        description: "The player cannot open the room administration screen while unable to see - it would disclose the room background and admin member numbers. Admin chat commands still work.",
        bcxEquivalent: "block_room_admin_UI",
        settings: []
      },
      {
        id: "social.greetRoom",
        name: "Order to greet the room",
        category: "Social",
        description: "On entering a chat room, the player automatically says the configured greeting.",
        bcxEquivalent: "greet_room_order",
        settings: [
          {
            type: "text",
            name: "greeting",
            label: "Greeting:",
            default: "Hello everyone!",
            maxChars: 200
          }
        ]
      },
      {
        id: "social.farewell",
        name: "Farewell on leave",
        category: "Social",
        description: "When leaving a chat room, the player automatically says the configured farewell first.",
        bcxEquivalent: "farewell_on_slow_leave",
        settings: [
          {
            type: "text",
            name: "farewell",
            label: "Farewell:",
            default: "Goodbye everyone!",
            maxChars: 200
          }
        ]
      },
      {
        id: "other.listenToMyVoice",
        name: "Listen to my voice",
        category: "Other",
        description: "One of the configured sentences appears to the player at random, at the set interval, while they are in a chat room. Only they can see it.",
        bcxEquivalent: "other_constant_reminder",
        settings: [
          {
            type: "stringList",
            name: "sentences",
            label: "Sentences:",
            default: [],
            maxChars: 200,
            entryLabel: "sentence",
            legacySeparator: "|"
          },
          {
            type: "option",
            name: "frequency",
            label: "Minutes between sentences",
            options: [
              "2",
              "5",
              "10",
              "15",
              "30"
            ],
            default: "15"
          }
        ]
      },
      {
        id: "other.summon",
        name: "Ready to be summoned",
        category: "Other",
        description: `Configured members can summon the player from anywhere in the club with a beep whose message starts with the summon text (or just "summon"). After the delay, the player is pulled to the summoner's room - ignoring leashes and locked doors. If the target room is full, they end up in the lobby. The summoner must be in a room and leave "attach room" enabled when writing the beep, or it carries no room to move to.`,
        bcxEquivalent: "alt_forced_summoning",
        settings: [
          {
            type: "members",
            name: "allowedMembers",
            label: "Members who may summon:",
            default: []
          },
          {
            type: "text",
            name: "summonText",
            label: "Summon text:",
            default: "Come to my room immediately",
            maxChars: 100
          },
          {
            type: "option",
            name: "delay",
            label: "Seconds before enforcing",
            options: [
              "10",
              "15",
              "30",
              "60"
            ],
            default: "15"
          }
        ]
      },
      {
        id: "protect.ownerChanges",
        name: "Forbid club owner changes",
        category: "Protection",
        description: "The player cannot leave their current club owner or submit to a new one. Advancing a trial to full ownership is unaffected, and their owner can still release them.",
        bcxEquivalent: "rc_club_owner",
        settings: []
      },
      {
        id: "protect.newLovers",
        name: "Forbid getting new lovers",
        category: "Protection",
        description: "The player cannot start dating anyone new. Advancing an existing lovership (dating to engagement to marriage) is unaffected.",
        bcxEquivalent: "rc_lover_new",
        settings: []
      },
      {
        id: "protect.breakup",
        name: "Forbid breaking up with lovers",
        category: "Protection",
        description: "The player cannot leave any of their lovers, at any lovership stage - neither through the Management mistress nor directly in a chat room. Their lovers can still break up with them.",
        bcxEquivalent: "rc_lover_leave",
        settings: []
      },
      {
        id: "protect.newSubs",
        name: "Forbid taking new submissives",
        category: "Protection",
        description: "The player cannot offer an ownership trial to a new submissive. Advancing an existing trial to full ownership is unaffected.",
        bcxEquivalent: "rc_sub_new",
        settings: []
      },
      {
        id: "protect.disowning",
        name: "Forbid disowning submissives",
        category: "Protection",
        description: "The player cannot let go of any of their submissives (trial or full ownership). Their submissives can still break the bond themselves.",
        bcxEquivalent: "rc_sub_leave",
        settings: []
      },
      {
        id: "protect.blacklist",
        name: "Prevent blacklisting",
        category: "Protection",
        description: "The player cannot add people holding the configured role (or higher) to their BC blacklist or ghostlist.",
        bcxEquivalent: "block_blacklisting",
        settings: [
          {
            type: "option",
            name: "minRole",
            label: "Protect this role and higher",
            options: [
              "BC Owner",
              "Co-Owner",
              "Lover",
              "Mistress",
              "Whitelist",
              "Friend"
            ],
            default: "Mistress"
          }
        ]
      },
      {
        id: "protect.whitelist",
        name: "Prevent whitelisting",
        category: "Protection",
        description: "The player can only add people holding the configured role (or higher) to their BC whitelist.",
        bcxEquivalent: "block_whitelisting",
        settings: [
          {
            type: "option",
            name: "minRole",
            label: "Lowest role allowed on the whitelist",
            options: [
              "BC Owner",
              "Co-Owner",
              "Lover",
              "Mistress",
              "Whitelist",
              "Friend"
            ],
            default: "Mistress"
          }
        ]
      },
      {
        id: "protect.hardcore",
        name: "Hardcore Mode",
        category: "Protection",
        description: "Forces both hardcore options from the General page on while this rule is in effect, locked: the player cannot open their own BC+ while their hands are bound, and people whose hands are bound are refused when they try to change anything in the player's BC+. The player's own choice of the two options is untouched underneath and returns the moment the rule ends. Requires enforcement to have any effect.",
        settings: []
      },
      {
        id: "items.tyingSelf",
        name: "Forbid tying up self",
        category: "Items",
        description: "The player cannot use items on their own body, including swapping worn items.",
        bcxEquivalent: "block_tying_self",
        settings: []
      },
      {
        id: "items.tyingOthers",
        name: "Forbid tying up others",
        category: "Items",
        description: "The player cannot use items on other characters. Can be limited to characters with a higher dominant score than the player.",
        bcxEquivalent: "block_tying_others",
        settings: [
          {
            type: "checkbox",
            name: "onlyDominants",
            label: "Only forbid using items on more dominant characters",
            default: true
          }
        ]
      },
      {
        id: "items.freeingSelf",
        name: "Forbid freeing self",
        category: "Items",
        description: "The player cannot remove, struggle out of or escape items on their own body. Others can still remove them. Low-difficulty items (hand-held toys, plushies...) can optionally stay removable.",
        bcxEquivalent: "block_freeing_self",
        settings: [
          {
            type: "checkbox",
            name: "allowEasy",
            label: "Still allow removing low-difficulty items",
            default: false
          }
        ]
      },
      {
        id: "items.freeingOthers",
        name: "Forbid freeing others",
        category: "Items",
        description: "The player cannot remove items from other characters. Low-difficulty items (hand-held toys, plushies...) can optionally stay removable.",
        bcxEquivalent: "block_freeing_others",
        settings: [
          {
            type: "checkbox",
            name: "allowEasy",
            label: "Still allow removing low-difficulty items",
            default: false
          }
        ]
      },
      {
        id: "items.wardrobeSelf",
        name: "Forbid wardrobe use on self",
        category: "Items",
        description: "The player cannot change their own clothes. Others can still change them.",
        bcxEquivalent: "block_wardrobe_access_self",
        settings: []
      },
      {
        id: "items.wardrobeOthers",
        name: "Forbid wardrobe use on others",
        category: "Items",
        description: "The player cannot change the clothes of other club members.",
        bcxEquivalent: "block_wardrobe_access_others",
        settings: []
      },
      {
        id: "locks.remotesSelf",
        name: "Forbid using remotes on self",
        category: "Items",
        description: "The player cannot use a vibrator remote on their own body. Others can still use remotes on them.",
        bcxEquivalent: "block_remoteuse_self",
        settings: []
      },
      {
        id: "locks.remotesOthers",
        name: "Forbid using remotes on others",
        category: "Items",
        description: "The player cannot use a vibrator remote on anyone else.",
        bcxEquivalent: "block_remoteuse_others",
        settings: []
      },
      {
        id: "locks.keysSelf",
        name: "Forbid using keys on self",
        category: "Items",
        description: "The player cannot unlock locks on their own body, even with the key.",
        bcxEquivalent: "block_keyuse_self",
        settings: []
      },
      {
        id: "locks.keysOthers",
        name: "Forbid using keys on others",
        category: "Items",
        description: "The player cannot unlock locks on anyone else.",
        bcxEquivalent: "block_keyuse_others",
        settings: []
      },
      {
        id: "locks.pickSelf",
        name: "Forbid picking locks on self",
        category: "Items",
        description: "The player cannot pick locks on their own body.",
        bcxEquivalent: "block_lockpicking_self",
        settings: []
      },
      {
        id: "locks.pickOthers",
        name: "Forbid picking locks on others",
        category: "Items",
        description: "The player cannot pick locks on anyone else.",
        bcxEquivalent: "block_lockpicking_others",
        settings: []
      },
      {
        id: "locks.lockSelf",
        name: "Forbid using locks on self",
        category: "Items",
        description: "The player cannot apply locks to their own body.",
        bcxEquivalent: "block_lockuse_self",
        settings: []
      },
      {
        id: "locks.lockOthers",
        name: "Forbid using locks on others",
        category: "Items",
        description: "The player cannot apply locks to anyone else.",
        bcxEquivalent: "block_lockuse_others",
        settings: []
      },
      {
        id: "sensory.sound",
        name: "Sensory deprivation: Sound",
        category: "Sensory",
        description: "Impacts the player's natural hearing the same way items do, independent of them. Strength is adjustable; stacks with worn items.",
        bcxEquivalent: "alt_restrict_hearing",
        settings: [
          {
            type: "option",
            name: "strength",
            label: "Hearing impairment",
            options: [
              "Light",
              "Medium",
              "Heavy"
            ],
            default: "Light"
          }
        ]
      },
      {
        id: "sensory.hearingWhitelist",
        name: "Hearing whitelist",
        category: "Sensory",
        description: "The listed members are always understood clearly, no matter how deafened the player is (by items or rules). Optionally even when those members are gagged.",
        bcxEquivalent: "alt_hearing_whitelist",
        settings: [
          {
            type: "members",
            name: "members",
            label: "Members always heard:",
            default: []
          },
          {
            type: "checkbox",
            name: "includeGagged",
            label: "Understand them even while they are gagged",
            default: false
          }
        ]
      },
      {
        id: "sensory.sight",
        name: "Sensory deprivation: Sight",
        category: "Sensory",
        description: "Impacts the player's natural eyesight the same way items do, independent of them. Strength is adjustable; stacks with worn items.",
        bcxEquivalent: "alt_restrict_sight",
        settings: [
          {
            type: "option",
            name: "strength",
            label: "Eyesight impairment",
            options: [
              "Light",
              "Medium",
              "Heavy"
            ],
            default: "Light"
          }
        ]
      },
      {
        id: "sensory.seeingWhitelist",
        name: "Seeing whitelist",
        category: "Sensory",
        description: "The listed members are always seen normally, no matter how blinded the player is (by items or rules).",
        bcxEquivalent: "alt_seeing_whitelist",
        settings: [
          {
            type: "members",
            name: "members",
            label: "Members always seen:",
            default: []
          }
        ]
      },
      {
        id: "body.forbidPoses",
        name: "Forbid changing poses",
        category: "Body",
        description: "The player cannot change their own body pose unaided - kneeling, standing up, spreading and every other pose stays as it is. Others (and items) can still pose them.",
        bcxEquivalent: "block_restrict_allowed_poses",
        settings: []
      },
      {
        id: "body.forbiddenPoses",
        name: "Forbid specific poses",
        category: "Body",
        description: "The player cannot change into the listed poses by themselves. Pose names: BaseUpper, BackBoxTie, BackCuffs, BackElbowTouch, OverTheHead, Yoked, BaseLower, Kneel, KneelingSpread, LegsClosed, Spread, Hogtied, AllFours, Suspension, TapedHands.",
        bcxEquivalent: "block_restrict_allowed_poses",
        settings: [
          {
            type: "stringList",
            name: "poses",
            label: "Forbidden poses:",
            default: [],
            maxChars: 30,
            entryLabel: "pose name"
          }
        ]
      },
      {
        id: "body.forceKneel",
        name: "Forced to kneel",
        category: "Body",
        description: "The player must stay on their knees: choosing a standing lower-body pose is blocked, and if they end up standing they are put back down. Poses that need aid (restraints forcing them upright) are left alone rather than fought.",
        settings: []
      },
      {
        id: "body.forcedPosition",
        name: "Forced position",
        category: "Body",
        description: "The player is held in a chosen position: pick an arms pose, a legs pose, or both (e.g. hands behind back with legs spread), or a full-body position (hogtied or all fours) that overrides the other two. Changing away is blocked and any deviation is corrected. Poses held by restraints are left alone rather than fought.",
        settings: [
          {
            type: "option",
            name: "fullPose",
            label: "Full body (overrides arms/legs)",
            options: [
              "Any",
              "Hogtied",
              "All fours"
            ],
            default: "Any"
          },
          {
            type: "option",
            name: "armsPose",
            label: "Arms",
            options: [
              "Any",
              "Free",
              "Hands behind back",
              "Elbows behind back",
              "Wrists behind back",
              "Yoked",
              "Arms overhead"
            ],
            default: "Any"
          },
          {
            type: "option",
            name: "legsPose",
            label: "Legs",
            options: [
              "Any",
              "Standing",
              "Legs closed",
              "Legs spread",
              "Kneeling",
              "Kneeling spread"
            ],
            default: "Any"
          }
        ]
      },
      {
        id: "body.afkBehavior",
        name: "Forced AFK behavior",
        category: "Body",
        description: "When the player goes idle, the configured behaviors apply automatically: the Afk emoticon, closed eyes, kneeling, and an automatic reply to whispers. Emoticon and eyes are restored the moment the player is back; a forced kneel is left for them to stand up from.",
        settings: [
          {
            type: "option",
            name: "idleMinutes",
            label: "Minutes until idle",
            options: [
              "2",
              "5",
              "10",
              "15",
              "30"
            ],
            default: "5"
          },
          {
            type: "checkbox",
            name: "afkEmoticon",
            label: "Show the Afk emoticon",
            default: true
          },
          {
            type: "checkbox",
            name: "closeEyes",
            label: "Close the eyes",
            default: false
          },
          {
            type: "checkbox",
            name: "kneel",
            label: "Kneel down",
            default: false
          },
          {
            type: "checkbox",
            name: "autoReply",
            label: "Auto-reply to whispers",
            default: false
          },
          {
            type: "text",
            name: "replyText",
            label: "Auto-reply text:",
            default: "I am away from the club right now.",
            maxChars: 150
          }
        ]
      },
      {
        id: "pet.speech",
        name: "Speak like a pet",
        category: "Pet",
        description: "The player's speech turns pet-like: Sprinkle mode weaves animal sounds between the words, Replace mode swaps words for sounds outright - up to fully non-verbal at Max intensity. Pick an animal sound set or provide custom sounds. Out-of-character text is never touched.",
        settings: [
          {
            type: "option",
            name: "animal",
            label: "Sound set",
            options: [
              "Bunny",
              "Cat",
              "Cow",
              "Dog",
              "Fox",
              "Mouse",
              "Pony",
              "Wolf",
              "Custom"
            ],
            default: "Cat"
          },
          {
            type: "stringList",
            name: "sounds",
            label: "Custom sounds (used with the Custom set):",
            default: [],
            maxChars: 24,
            maxEntries: 20,
            entryLabel: "sound"
          },
          {
            type: "option",
            name: "mode",
            label: "Mode",
            options: [
              "Sprinkle",
              "Replace"
            ],
            default: "Sprinkle"
          },
          {
            type: "option",
            name: "intensity",
            label: "Intensity",
            options: [
              "Low",
              "Medium",
              "High",
              "Max"
            ],
            default: "Medium"
          }
        ]
      },
      {
        id: "pet.hearing",
        name: "Hear like a pet",
        category: "Pet",
        description: `Pet words - commands, praise, the pet's own name, the chosen animal's vocabulary and any custom extras - always come through clearly, while the rest of what the player hears garbles away. "Only when deafened" merely lets the pet words pierce existing deafness (item- or hunger-induced); Light and Heavy garble everything else all the time. Out-of-character text is never touched.`,
        settings: [
          {
            type: "option",
            name: "animal",
            label: "Vocabulary set",
            options: [
              "Bunny",
              "Cat",
              "Cow",
              "Dog",
              "Fox",
              "Mouse",
              "Pony",
              "Wolf",
              "Custom"
            ],
            default: "Cat"
          },
          {
            type: "stringList",
            name: "words",
            label: "Extra understood words:",
            default: [],
            maxChars: 32,
            maxEntries: 30,
            entryLabel: "word"
          },
          {
            type: "option",
            name: "strength",
            label: "Everything else garbles",
            options: [
              "Only when deafened",
              "Light",
              "Heavy"
            ],
            default: "Light"
          }
        ]
      },
      {
        id: "body.controlOrgasms",
        name: "Control orgasms",
        category: "Body",
        description: "Controls what happens when the player's arousal peaks, independent of items: Edge keeps the meter just below the top so the orgasm never starts; Ruin starts the orgasm screen but denies the actual climax; No resisting removes the option to fight an orgasm off. Requires the arousal meter to be enabled.",
        bcxEquivalent: "alt_control_orgasms",
        settings: [
          {
            type: "option",
            name: "mode",
            label: "Orgasm attempts are:",
            options: [
              "Edged",
              "Ruined",
              "Unresistable"
            ],
            default: "Edged"
          }
        ]
      },
      {
        id: "body.secretOrgasms",
        name: "Secret arousal meter",
        category: "Body",
        description: "The player cannot see their own arousal meter even while it is active - the orgasm quick-time event comes as a surprise. Whether others can see the meter is unchanged (that stays a BC setting).",
        bcxEquivalent: "alt_secret_orgasms",
        settings: []
      },
      {
        id: "control.difficulty",
        name: "Forbid changing difficulty",
        category: "Other",
        description: "The player cannot change their Bondage Club multiplayer difficulty, whatever it currently is.",
        bcxEquivalent: "block_difficulty_change",
        settings: []
      },
      {
        id: "control.activities",
        name: "Forbid using activities",
        category: "Other",
        description: "The player cannot use any (sexual) activities on anyone - the activities button vanishes from the item dialogs. Others can still use activities on the player; the arousal system itself stays untouched.",
        bcxEquivalent: "block_activities",
        settings: []
      },
      {
        id: "control.emoticon",
        name: "Forbid changing emoticon",
        category: "Social",
        description: "The player cannot show, change or remove the emoticon (afk, sleep, ...) over their own head.",
        bcxEquivalent: "block_changing_emoticon",
        settings: []
      },
      {
        id: "control.leash",
        name: "Restrict who may leash",
        category: "Protection",
        description: "Only people of at least the configured BC+ role can take the player onto a leash; everyone else's leash slips off with a room message.",
        bcxEquivalent: "alt_restrict_leashability",
        settings: [
          {
            type: "option",
            name: "minimumRole",
            label: "Leashing needs at least:",
            options: [
              "BC Owner",
              "Co-Owner",
              "Lover",
              "Mistress",
              "Whitelist",
              "Friend"
            ],
            default: "Co-Owner"
          }
        ]
      },
      {
        id: "control.nickname",
        name: "Control nickname",
        category: "Social",
        description: "Locks the player's BC nickname: with a nickname configured it is forced to that; with the field left empty the nickname the player had when the rule took hold is kept. The nickname stays as-is when the rule ends.",
        bcxEquivalent: "alt_set_nickname",
        settings: [
          {
            type: "text",
            name: "nickname",
            label: "Forced nickname (empty = lock current):",
            default: "",
            maxChars: 20
          }
        ]
      },
      {
        id: "control.profile",
        name: "Lock profile description",
        category: "Social",
        description: "Freezes the player's online profile description: any change is reverted to the text it had when the rule took hold. The description stays as-is when the rule ends.",
        bcxEquivalent: "alt_set_profile_description",
        settings: []
      },
      {
        id: "settings.itemPermission",
        name: "Force 'Item permission'",
        category: "Settings",
        description: "Pins who is allowed to use items on the player. While enforced, the 'Item permission' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_item_permission",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Everyone, no exceptions",
              "Everyone, except blacklist",
              "Owner, Lovers, whitelist & Dominants",
              "Owner, Lovers and whitelist only",
              "Owner and Lovers only",
              "Owner only"
            ],
            default: "Everyone, no exceptions"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.lockpickingSelf",
        name: "Force 'Locks on you can't be picked'",
        category: "Settings",
        description: "Pins whether locks on the player can be picked at all. While enforced, the 'Locks on you can't be picked' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_lockpicking",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Locks cannot be picked",
              "Locks can be picked"
            ],
            default: "Locks cannot be picked"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.spRooms",
        name: "Force 'Cannot enter single-player rooms when restrained'",
        category: "Settings",
        description: "Pins whether being restrained blocks entering single-player rooms. While enforced, the 'Cannot enter single-player rooms when restrained' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_SP_rooms",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Blocked while restrained",
              "Always allowed"
            ],
            default: "Blocked while restrained"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.safeword",
        name: "Force 'Allow safeword use'",
        category: "Settings",
        description: "Pins BC's safeword setting. Forcing it off removes the player's in-game safeword release - use with care and consent. While enforced, the 'Allow safeword use' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_safeword",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Safeword allowed",
              "Safeword disabled"
            ],
            default: "Safeword disabled"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.arousalMeter",
        name: "Force 'Arousal meter'",
        category: "Settings",
        description: "Pins the arousal meter's activation mode. While enforced, the 'Arousal meter' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_arousal_meter",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Disable sexual activities",
              "Allow without a meter",
              "Allow with a manual meter",
              "Allow with a hybrid meter",
              "Allow with a locked meter"
            ],
            default: "Allow with a hybrid meter"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.arousalStutter",
        name: "Force 'Arousal speech stuttering'",
        category: "Settings",
        description: "Pins when arousal makes the player's speech stutter. While enforced, the 'Arousal speech stuttering' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_arousal_stutter",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Never stutter",
              "When aroused",
              "When vibrated",
              "Aroused & vibrated"
            ],
            default: "Aroused & vibrated"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.vibeModes",
        name: "Force 'Block advanced vibrator modes'",
        category: "Settings",
        description: "Pins whether advanced (escalating/random/edging) vibrator modes work on the player. While enforced, the 'Block advanced vibrator modes' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_block_vibe_modes",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Advanced modes blocked",
              "Advanced modes allowed"
            ],
            default: "Advanced modes allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.afkBubble",
        name: "Force 'Show AFK bubble'",
        category: "Settings",
        description: "Pins whether the player shows the automatic AFK bubble when idle. While enforced, the 'Show AFK bubble' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_show_afk",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "AFK bubble shown",
              "AFK bubble hidden"
            ],
            default: "AFK bubble shown"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.bodyMod",
        name: "Force 'Allow others to alter your whole appearance'",
        category: "Settings",
        description: "Pins whether people with wardrobe access may change the player's whole appearance including body parts. While enforced, the 'Allow others to alter your whole appearance' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_allow_body_mod",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Full appearance access",
              "Body is off-limits"
            ],
            default: "Full appearance access"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.cosplayChange",
        name: "Force 'Prevent others from changing cosplay items'",
        category: "Settings",
        description: "Pins whether others may change the player's cosplay items (ears, tails, wings). While enforced, the 'Prevent others from changing cosplay items' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_cosplay_change",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Cosplay items protected",
              "Cosplay items changeable"
            ],
            default: "Cosplay items changeable"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.sensdep",
        name: "Force 'Sensory deprivation setting'",
        category: "Settings",
        description: "Pins how strongly blindness items affect the player. While enforced, the 'Sensory deprivation setting' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_sensdep",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Light",
              "Normal",
              "Hide names",
              "Heavy",
              "Total"
            ],
            default: "Normal"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.hideNonAdjacent",
        name: "Force 'Hide non-adjacent players while partially blind'",
        category: "Settings",
        description: "Pins whether partial blindness hides everyone not standing next to the player. While enforced, the 'Hide non-adjacent players while partially blind' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_hide_non_adjecent",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Hidden while blind",
              "Always visible"
            ],
            default: "Hidden while blind"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.blindRoomGarbling",
        name: "Force 'Garble chatroom names and descriptions while blind'",
        category: "Settings",
        description: "Pins whether room names and descriptions garble while the player is blind. While enforced, the 'Garble chatroom names and descriptions while blind' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_blind_room_garbling",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Garbled while blind",
              "Always readable"
            ],
            default: "Garbled while blind"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.relogKeepsRestraints",
        name: "Force 'Keep all restraints when relogging'",
        category: "Settings",
        description: "Pins whether restraints stay on through a relog. While enforced, the 'Keep all restraints when relogging' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_relog_keeps_restraints",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Restraints kept",
              "Restraints removed"
            ],
            default: "Restraints kept"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.leashedRoomChange",
        name: "Force 'Players can drag you to rooms when leashed'",
        category: "Settings",
        description: "Pins whether leash holders can drag the player between rooms. While enforced, the 'Players can drag you to rooms when leashed' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_leashed_roomchange",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Dragging allowed",
              "Dragging blocked"
            ],
            default: "Dragging allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.roomRejoin",
        name: "Force 'Return to chatrooms on relog'",
        category: "Settings",
        description: "Pins whether the player returns to the room they were in when they relog. While enforced, the 'Return to chatrooms on relog' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_room_rejoin",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Returns to the room",
              "Starts in the main hall"
            ],
            default: "Returns to the room"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.plugVibeEvents",
        name: "Force 'Events while plugged or vibed'",
        category: "Settings",
        description: "Pins whether worn plugs and vibrators cause random immersive chat events. While enforced, the 'Events while plugged or vibed' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_plug_vibe_events",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Events enabled",
              "Events disabled"
            ],
            default: "Events enabled"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.tintEffects",
        name: "Force 'Allow item tint effects'",
        category: "Settings",
        description: "Pins whether items may tint the player's vision (colored hoods etc.). While enforced, the 'Allow item tint effects' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_allow_tint_effects",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Tints allowed",
              "Tints disabled"
            ],
            default: "Tints allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.blurEffects",
        name: "Force 'Allow item blur effects'",
        category: "Settings",
        description: "Pins whether items may blur the player's vision. While enforced, the 'Allow item blur effects' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_allow_blur_effects",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Blur allowed",
              "Blur disabled"
            ],
            default: "Blur allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.upsideDownView",
        name: "Force 'Flip room vertically when upside-down'",
        category: "Settings",
        description: "Pins whether hanging upside-down flips the player's view of the room. While enforced, the 'Flip room vertically when upside-down' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_upsidedown_view",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "View flips",
              "View stays upright"
            ],
            default: "View flips"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      }
    ]
  };

  // shared/bcplus.js
  var BCPLUS_VERSION = bcplus_rules_default.bcplusVersion;
  var RULES = new Map(bcplus_rules_default.rules.map((r) => [r.id, r]));
  var NEVER = {
    "settings.safeword": "turns off their safeword",
    "social.forbidBeeps": "stops them beepin' the farm for help",
    "social.forbidBeepMessages": "stops them beepin' the farm for help",
    "speech.forbidOOC": "stops them speakin' out of character",
    "speech.gaggedOOC": "stops them speakin' out of character"
  };
  var DURATIONS = [
    { key: "1h", label: "1 hour", min: 60, words: ["1h", "hour", "1 hour", "an hour"] },
    { key: "12h", label: "12 hours", min: 720, words: ["12h", "12 hours", "half a day", "a night", "night", "overnight"] },
    { key: "1d", label: "1 day", min: 1440, words: ["1d", "day", "1 day", "a day"] },
    { key: "1w", label: "1 week", min: 10080, words: ["1w", "week", "1 week", "a week"] },
    { key: "2w", label: "2 weeks", min: 20160, words: ["2w", "2 weeks", "two weeks", "fortnight"] },
    { key: "1m", label: "1 month", min: 43200, words: ["1m", "month", "1 month", "a month", "30 days", "a season", "season"] },
    { key: "perm", label: "Permanent", min: 0, words: ["perm", "permanent", "forever", "for good", "until released"] }
  ];

  // extension/src/addons.js
  function bcplusStatus() {
    const b = window.BCPlus;
    if (!b || !b.loaded) return { has: false, text: "not loaded" };
    const v = b.version || {};
    const ver = [v.major, v.minor, v.patch].join(".");
    return { has: true, ver, match: ver === BCPLUS_VERSION, text: ver === BCPLUS_VERSION ? "BC+ " + ver + " matches the farm" : "BC+ " + ver + " (the farm knows " + BCPLUS_VERSION + ")" };
  }
  function summonReady(bot) {
    try {
      const api2 = window.bcx && window.bcx.getModApi && window.bcx.getModApi("FarmhandCompanion");
      if (!api2) return null;
      const r = api2.getRuleState("alt_forced_summoning");
      if (!r || !r.inEffect) return { ok: false, why: "BCX's Ready to be summoned rule is off" };
      const allowed = r.customData && r.customData.allowedMembers || [];
      return allowed.includes(bot) ? { ok: true, why: "ready" } : { ok: false, why: "the farm bot (" + bot + ") isn't on the rule's allowed list" };
    } catch (e) {
      return null;
    }
  }

  // extension/src/views/staffdata.js
  var MAP = 40;
  var PX = 7;
  function herd(ctx2) {
    const f = ctx2.ui.herdF || "all", list = (ctx2.s.herd || []).filter((x) => f === "all" || f === "mine" && x.mine || f === "milk" && x.milk !== null && x.milk >= 75 || f === "heat" && x.heat);
    const act = (c, x) => () => ctx2.send(c + " " + x.mn);
    return [
      h("div", null, [["all", "On the map"], ["mine", "My herd"], ["milk", "Needs milkin'"], ["heat", "In heat"]].map(([id, l]) => h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx2.setUi({ herdF: id }) }, l))),
      list.length ? list.map((x) => card(
        h("div", { class: "fhc-kv" }, h("b", null, x.name), h("span", { class: "fhc-muted" }, x.role + (x.where ? " · " + x.where : ""))),
        x.milk !== null ? h(
          "div",
          { class: "fhc-bar-track", style: { margin: "6px 0" } },
          h("div", { class: "fhc-bar-fill" + (x.milk >= 75 ? " fhc-fill-alert" : ""), style: { width: Math.min(100, x.milk) + "%" } })
        ) : null,
        h(
          "div",
          null,
          x.mine && chip("my herd", "acc"),
          x.heat && chip("in heat", "alert"),
          x.preg && chip("carryin'", "good"),
          x.denied && chip("teats capped", "alert"),
          x.milk !== null && chip(x.milk + "% full")
        ),
        h(
          "div",
          { style: { marginTop: "6px" } },
          btn("Record", act("record", x), true),
          btn("Milk", act("milk", x)),
          btn("Drain", act("drain", x)),
          btn("Edge", act("edge", x)),
          btn("Summon to me", act("summon", x))
        )
      )) : muted("Nobody matches right now.")
    ];
  }
  function tease(ctx2) {
    const lines = ctx2.s.tease;
    if (!lines) return [muted("Tease lines are for herdmasters and proprietors.")];
    return [
      card(
        h("div", { class: "fhc-kv" }, title("Tease lines"), h("span", { class: "fhc-muted" }, lines.length + " lines · " + (ctx2.s.teaseOpted || 0) + " opted in")),
        lines.length ? lines.map((t, i) => h(
          "div",
          { class: "fhc-kv" },
          h("span", null, h("b", null, i + 1 + ". "), t),
          h("button", { type: "button", class: "fhc-b", onclick: () => ctx2.send("tease remove " + (i + 1)) }, "Remove")
        )) : muted("No lines yet.")
      ),
      card(
        h(
          "label",
          { class: "fhc-label" },
          "New line · %name% becomes their name",
          h("textarea", { class: "fhc-in", rows: 2, oninput: (e) => ctx2.setUi({ teaseDraft: e.target.value }, true) }, ctx2.ui.teaseDraft || "")
        ),
        btn("Add line", () => {
          const t = (ctx2.ui.teaseDraft || "").trim();
          if (!t) return ctx2.hint("Write the line first.");
          ctx2.send("tease add " + t);
          ctx2.setUi({ teaseDraft: "" });
        }, true)
      )
    ];
  }
  var COLORS = ["#8fbf6a", "#c9a35b", "#b8403a", "#7fa8c9", "#c48bd9", "#d98c6a"];
  function zones(ctx2) {
    const zs = ctx2.s.zones;
    if (!zs) return [muted("Zones are for herdmasters and proprietors.")];
    const groups = [...new Set(Object.values(zs).map((z) => z.group))];
    const color = (g) => COLORS[groups.indexOf(g) % COLORS.length];
    const sel = ctx2.ui.zone && zs[ctx2.ui.zone] ? ctx2.ui.zone : Object.keys(zs)[0];
    const name = () => (ctx2.ui.zoneName || sel || "").trim().toLowerCase();
    return [
      card(
        title("Farm map"),
        h(
          "div",
          { style: { position: "relative", width: MAP * PX + "px", height: MAP * PX + "px", margin: "6px auto 0", background: "var(--fh-well)", border: "1px solid var(--fh-line)", borderRadius: "6px" } },
          Object.entries(zs).filter(([, z]) => z.a && z.b).map(([n, z]) => h("button", {
            type: "button",
            title: n,
            "aria-label": n,
            onclick: () => ctx2.setUi({ zone: n }),
            style: {
              position: "absolute",
              padding: "0",
              left: Math.min(z.a.X, z.b.X) * PX + "px",
              top: Math.min(z.a.Y, z.b.Y) * PX + "px",
              width: (Math.abs(z.a.X - z.b.X) + 1) * PX + "px",
              height: (Math.abs(z.a.Y - z.b.Y) + 1) * PX + "px",
              background: color(z.group) + "44",
              border: n === sel ? "3px solid var(--fh-text)" : "1px solid " + color(z.group)
            }
          })),
          // spots: little dots, hover for the name
          Object.entries(ctx2.s.spots || {}).filter(([, p]) => p && Number.isFinite(p.X)).map(([n, p]) => h("span", {
            title: n + " · " + p.X + "," + p.Y,
            style: {
              position: "absolute",
              left: p.X * PX + 1 + "px",
              top: p.Y * PX + 1 + "px",
              width: PX - 2 + "px",
              height: PX - 2 + "px",
              borderRadius: "50%",
              background: /^speaker/.test(n) ? "#7fa8c9" : n === "home" ? "#c9a35b" : "var(--fh-text)",
              pointerEvents: "auto"
            }
          }))
        ),
        h("div", { style: { marginTop: "6px" } }, groups.map((g) => h("span", { class: "fhc-chip", style: { borderColor: color(g) } }, g)))
      ),
      card(
        title("Zones"),
        Object.keys(zs).length ? Object.entries(zs).map(([n, z]) => h(
          "button",
          { type: "button", class: "fhc-doc" + (n === sel ? " on" : ""), style: { width: "100%", marginBottom: "4px" }, onclick: () => ctx2.setUi({ zone: n }) },
          h("b", null, n),
          h("div", { class: "fhc-muted" }, "part of " + z.group + " · A " + (z.a ? z.a.X + "," + z.a.Y : "—") + " → B " + (z.b ? z.b.X + "," + z.b.Y : "—"))
        )) : muted("No zones yet."),
        btn("Who's where", () => ctx2.send("zone who"))
      ),
      card(
        title(sel ? "Editin' " + sel : "New zone"),
        h("label", { class: "fhc-label" }, "Zone name (one word)", h("input", { class: "fhc-in", value: ctx2.ui.zoneName || sel || "", oninput: (e) => ctx2.setUi({ zoneName: e.target.value }, true) })),
        h("div", null, btn("Draw it on the map", () => {
          const n = name();
          if (!n) return ctx2.hint("Name the zone first.");
          ctx2.api.pickTiles(2, "zone '" + n + "'", ([a, b]) => ctx2.send("zone box " + n + " " + a.X + " " + a.Y + " " + b.X + " " + b.Y));
        }, true)),
        muted("Or walk it: stand on one corner, then the other."),
        h("div", null, btn("Set A where I stand", () => name() ? ctx2.send("zone a " + name()) : ctx2.hint("Name the zone first.")), btn("Set B where I stand", () => name() ? ctx2.send("zone b " + name()) : ctx2.hint("Name the zone first."))),
        h("label", { class: "fhc-label" }, "Pair with (one place, odd shapes)", h("input", { class: "fhc-in", placeholder: "barn", value: ctx2.ui.zonePair || "", oninput: (e) => ctx2.setUi({ zonePair: e.target.value }, true) })),
        h(
          "div",
          null,
          btn("Pair", () => name() && ctx2.ui.zonePair ? ctx2.send("zone pair " + name() + " " + ctx2.ui.zonePair.trim().toLowerCase()) : ctx2.hint("Name the zone, and the place to pair it with.")),
          btn("Unpair", () => name() ? ctx2.send("zone unpair " + name()) : ctx2.hint("Name the zone first.")),
          btn("Delete", () => name() ? ctx2.send("zone clear " + name()) : ctx2.hint("Name the zone first."))
        )
      ),
      spotsCard(ctx2)
    ];
  }
  function spotsCard(ctx2) {
    const sp = Object.entries(ctx2.s.spots || {});
    const nm = () => (ctx2.ui.spotName || "").trim().toLowerCase();
    const ok = () => /^[a-z][a-z0-9_-]{1,19}$/.test(nm()) || (ctx2.hint("Give the spot a one-word name, like speaker-barn, trough-1 or glory-1."), false);
    return card(
      title("Spots"),
      muted("home · speaker-… (the bot talks from these) · trough-… · water-… · glory-1 and glory-1-visitor · placard-…"),
      sp.length ? sp.map(([n, p]) => h(
        "div",
        { class: "fhc-kv" },
        h("span", null, h("b", null, n), " ", h("span", { class: "fhc-muted" }, p.X + "," + p.Y)),
        h(
          "span",
          null,
          h("button", { type: "button", class: "fhc-b", onclick: () => ctx2.setUi({ spotName: n }) }, "Pick"),
          h("button", { type: "button", class: "fhc-b", onclick: () => ctx2.send("spot clear " + n) }, "Clear")
        )
      )) : muted("No spots yet."),
      h("label", { class: "fhc-label" }, "Spot name", h("input", { class: "fhc-in", placeholder: "speaker-barn", value: ctx2.ui.spotName || "", oninput: (e) => ctx2.setUi({ spotName: e.target.value }, true) })),
      h(
        "div",
        null,
        btn("Click it on the map", () => {
          if (!ok()) return;
          const n = nm();
          ctx2.api.pickTiles(1, "spot '" + n + "'", ([p]) => ctx2.send("spot place " + n + " " + p.X + " " + p.Y));
        }, true),
        btn("Set where I stand", () => ok() && ctx2.send("spot set " + nm()))
      ),
      // clearin' old ones: everything with a name startin' like the box (speaker- clears every speaker), or all, with a second press
      sp.length ? h(
        "div",
        { style: { marginTop: "6px" } },
        btn("Clear all startin' with the name", () => {
          const n = nm();
          if (!n) return ctx2.hint("Type the start of the names first, like speaker-");
          ctx2.send("spot clear " + n + "*");
        }),
        ctx2.s.proprietor && (ctx2.ui.clearAllSpots ? btn("Yes, clear all " + sp.length + " spots", () => {
          ctx2.setUi({ clearAllSpots: false });
          ctx2.send("spot clear all yes");
        }, true) : btn("Clear all spots…", () => ctx2.setUi({ clearAllSpots: true })))
      ) : null
    );
  }
  function voice(ctx2) {
    const v = ctx2.s.voice;
    if (!v) return [muted("Listen to my voice is for herd leaders.")];
    const target = ctx2.ui.vTarget || "herd";
    const member = v.members.find((m) => String(m.mn) === String(target));
    const cur = target === "herd" ? v.herd : member || { on: false, lines: [], every: "15" };
    const who = target === "herd" ? "herd" : String(target);
    return [
      card(
        h(
          "div",
          { class: "fhc-kv" },
          h("div", null, title("Listen to my voice"), muted("Lines drift in privately, like a voice in their head. Only for stock who said ?hypno on.")),
          h("button", {
            type: "button",
            class: "fhc-sw" + (cur.on ? " on" : ""),
            "aria-pressed": cur.on ? "true" : "false",
            "aria-label": "Voice on or off",
            onclick: () => ctx2.send("voice " + (cur.on ? "off" : "on") + " " + who)
          }, h("span"))
        ),
        h(
          "div",
          { style: { marginTop: "6px" } },
          h("button", { type: "button", class: "fhc-pill" + (target === "herd" ? " on" : ""), onclick: () => ctx2.setUi({ vTarget: "herd" }) }, "Whole herd"),
          v.members.map((m) => h(
            "button",
            { type: "button", class: "fhc-pill" + (String(target) === String(m.mn) ? " on" : ""), onclick: () => ctx2.setUi({ vTarget: m.mn }) },
            m.name + (m.hypno ? "" : " (no ?hypno)")
          ))
        ),
        (cur.lines || []).length ? cur.lines.map((l, i) => h(
          "div",
          { class: "fhc-kv" },
          h("i", { style: { color: "#c9a3e6" } }, "[Voice] " + l),
          h("button", { type: "button", class: "fhc-b", onclick: () => ctx2.send("voice remove " + who + " " + (i + 1)) }, "Remove")
        )) : muted("No lines yet."),
        h("label", { class: "fhc-label" }, "New line · %name% works", h("input", { class: "fhc-in", maxlength: 200, value: ctx2.ui.vDraft || "", oninput: (e) => ctx2.setUi({ vDraft: e.target.value }, true) })),
        btn("Add", () => {
          const t = (ctx2.ui.vDraft || "").trim();
          if (!t) return ctx2.hint("Write the line first.");
          ctx2.send("voice add " + who + " " + t);
          ctx2.setUi({ vDraft: "" });
        }, true),
        h("label", { class: "fhc-label" }, "How often", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx2.send("voice every " + who + " " + e.target.value) },
          [["5", "Every 5 minutes"], ["15", "Every 15 minutes"], ["30", "Every 30 minutes"], ["chores", "Only during milkin' and chores"]].map(([k, l]) => h("option", { value: k, selected: String(cur.every) === k ? "selected" : null }, l))
        ))
      ),
      card(
        title("ECHS sessions by depth"),
        muted("Still their ECHS: they agree to every induction, and their own switches and safeword win."),
        [
          ["Fun", "Drifting · Yielding", "Not noticin' clothes or touches, posture, can't touch yourself, made to act"],
          ["Deep", "Entranced", "Follow and leash, made to speak, hears only your voice, arousal and orgasm"],
          ["No human left", "Deep · Blank", "Clothing illusion, planted triggers, suggestions that last after wakin'"]
        ].map(([a, b, c]) => h("div", { class: "fhc-kv", style: { display: "block" } }, h("b", null, a + " · "), h("span", { style: { color: "var(--fh-accent)" } }, b), muted(c)))
      )
    ];
  }
  function shift(ctx2) {
    const sh = ctx2.s.shift || {};
    return [
      card(h(
        "div",
        { class: "fhc-kv" },
        h("div", null, title("Your shift"), muted((sh.clocked ? "On the clock" : "Off the clock") + " · " + (sh.weekH || 0) + " h this week")),
        btn(sh.clocked ? "Clock out" : "Clock in", () => ctx2.send(sh.clocked ? "clockout" : "clockin"), !sh.clocked)
      )),
      card(title("On duty"), (sh.onDuty || []).length ? sh.onDuty.map((n) => chip(n)) : muted("Nobody on duty here.")),
      card(
        title("On call"),
        muted("Mandated farmhands, plus staff who switched it on. Only these can be pulled in from other rooms."),
        (sh.onCall || []).length ? sh.onCall.map((o) => chip(o.name + (o.mandated ? " · mandated" : "") + (o.here ? " · here" : " · away"), o.here ? "good" : null)) : muted("Nobody's on call.")
      ),
      ctx2.s.log && card(title("Farm log"), ctx2.s.log.map((e) => h(
        "div",
        { class: "fhc-kv", style: { fontFamily: "ui-monospace,Consolas,monospace", fontSize: "11px" } },
        h("span", { class: "fhc-muted" }, new Date(e.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
        h("span", { style: { color: "var(--fh-accent)" } }, e.a),
        h("span", null, e.by + (e.d ? " · " + e.d : ""))
      ))),
      h("div", null, btn("Hours", () => ctx2.send("hours")), btn("Chores", () => ctx2.send("chores")), btn("Spin the wheel", () => ctx2.send("spin")))
    ];
  }

  // extension/src/views/staff.js
  function latest(ctx2) {
    const r = ctx2.feed.filter((x) => x.kind === "reply").slice(-1)[0];
    return r ? card(title("Latest answer"), h("div", { class: "fhc-card" }, r.text)) : null;
  }
  var field = (label, input2) => h("label", { class: "fhc-label" }, label, input2);
  var input = (ph, key, ctx2) => h("input", { class: "fhc-in", placeholder: ph, value: ctx2.ui[key] || "", oninput: (e) => ctx2.setUi({ [key]: e.target.value }, true) });
  var select = (key, opts, ctx2) => h(
    "select",
    { class: "fhc-sel", onchange: (e) => ctx2.setUi({ [key]: e.target.value }, true) },
    opts.map(([v, l]) => h("option", { value: v, selected: (ctx2.ui[key] || opts[0][0]) === v ? "selected" : null }, l))
  );
  function me2(ctx2) {
    const s = ctx2.s;
    return [
      card(
        h("div", { class: "fhc-title" }, s.name),
        h(
          "div",
          { style: { marginTop: "6px" } },
          (s.roles || []).map((r) => chip(r.toLowerCase(), "acc")),
          (s.keys || []).map((k) => chip(k + " key")),
          s.onCall && chip("on call", "alert"),
          s.herdLeader && chip("herd: " + s.herdLeader)
        )
      ),
      card(
        h(
          "div",
          { class: "fhc-kv" },
          h("div", null, title("Duty"), muted(s.onDuty ? "On duty · silver and gold keys out" : "Out to pasture · bronze key only · your Livestock panel is yours")),
          s.pastureLock ? chip("kept out by " + s.pastureLock, "alert") : btn(s.onDuty ? "Go to pasture" : "Back on duty", () => ctx2.send(s.onDuty ? "pasture" : "onduty"), !s.onDuty)
        ),
        muted("Pasture puts your silver and gold keys away, makes you livestock for the visit, and takes you off call (mandated staff stay summonable). It doesn't lock you out. Only a ?turnout from your herd leader does that.")
      ),
      h("div", null, ["record", "hours", "myherd", "keys", "chores"].map((c) => btn(c[0].toUpperCase() + c.slice(1), () => ctx2.send(c)))),
      latest(ctx2)
    ];
  }
  function safeCards(ctx2) {
    const recent = ctx2.feed.filter((x) => x.kind === "notice" && /SAFEWORD/.test(x.text) && Date.now() - x.at < 60 * 6e4 && !ctx2.ui["done" + x.at]);
    return recent.map((x) => h(
      "div",
      { class: "fhc-box alert" },
      h("b", null, x.text),
      muted("Everything's paused and on-call staff were summoned. Nothin' has been released. Check on them first, then decide."),
      h(
        "div",
        { style: { marginTop: "8px" } },
        btn("I'm goin' to them", () => ctx2.send("where"), true),
        btn("All okay, close it", () => ctx2.setUi({ ["done" + x.at]: true }))
      )
    ));
  }
  function office(ctx2) {
    const docs = ctx2.docs.slice().reverse();
    const sel = docs.find((d) => d.id === ctx2.ui.doc) || docs[0];
    return [
      safeCards(ctx2),
      muted("Anything you look up about somebody else lands here, not in the chat: record, stats, vet, quota, keys, size, pedigree."),
      h("div", null, h("input", {
        class: "fhc-in",
        placeholder: "Look somebody up: vet Bessie",
        value: ctx2.ui.look || "",
        oninput: (e) => ctx2.setUi({ look: e.target.value }, true),
        onkeydown: (e) => {
          if (e.key === "Enter" && ctx2.ui.look) {
            ctx2.send(ctx2.ui.look);
            ctx2.setUi({ look: "" });
          }
        }
      })),
      docs.length ? h(
        "div",
        { class: "fhc-split" },
        h("div", { class: "fhc-docs" }, docs.map((d) => h(
          "button",
          { type: "button", class: "fhc-doc" + (sel && d.id === sel.id ? " on" : ""), onclick: () => ctx2.setUi({ doc: d.id }) },
          h("b", null, d.who),
          h("div", { class: "fhc-muted" }, d.kind + " · " + new Date(d.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ))),
        sel && h(
          "div",
          { class: "fhc-box", style: { flex: "1", minWidth: "0" } },
          h("div", { class: "fhc-card" }, sel.text),
          h("div", { style: { marginTop: "8px" } }, btn("Refresh", () => ctx2.send(sel.kind + " " + sel.about)), btn("Close", () => ctx2.closeDoc(sel.id)))
        )
      ) : card(title("Nothin' on the desk"), muted("Try ?vet, ?record or ?stats with somebody's name."))
    ];
  }
  function contracts(ctx2) {
    const tpl = () => (ctx2.ui.ctTpl || "deep").trim(), who = () => (ctx2.ui.ctWho || "").trim(), dur = () => ctx2.ui.ctDur || "1w";
    return [
      card(
        title("Offer a BC+ contract"),
        muted("They read it in their own BC+ and only sign if they want it. Herdmasters and proprietors can offer."),
        field("Contract", h("input", { class: "fhc-in", value: ctx2.ui.ctTpl || "deep", placeholder: "fun, deep, nhl, or one of yours", oninput: (e) => ctx2.setUi({ ctTpl: e.target.value }, true) })),
        field("For (name or member number, here in the room)", input("Bessie", "ctWho", ctx2)),
        field("How long", select("ctDur", DURATIONS.map((d) => [d.key, d.label]), ctx2)),
        h(
          "div",
          null,
          btn("Preview", () => ctx2.send("contract show " + tpl() + (who() ? " " + who() : ""))),
          btn("Offer it", () => who() ? ctx2.send("contract offer " + tpl() + " " + who() + " " + dur()) : ctx2.hint("Type who it's for first, in the For box."), true)
        )
      ),
      card(
        title("In force"),
        btn("List farm contracts", () => ctx2.send("contract list")),
        field("Somebody's contracts", input("Bessie", "ctLook", ctx2)),
        h(
          "div",
          null,
          btn("Ask their BC+", () => ctx2.ui.ctLook ? ctx2.send("contract check " + ctx2.ui.ctLook) : ctx2.hint("Type whose contracts first.")),
          btn("Release", () => ctx2.ui.ctLook ? ctx2.send("contract release " + ctx2.ui.ctLook) : ctx2.hint("Type whose contract to release first."))
        )
      ),
      latest(ctx2)
    ];
  }
  function barn(ctx2) {
    const who = () => (ctx2.ui.barnWho || "").trim();
    const act = (c) => () => who() ? ctx2.send(c + " " + who()) : ctx2.hint("Type who first, in the Who box.");
    return [
      card(
        title("Barn work"),
        field("Who", input("Bessie", "barnWho", ctx2)),
        h("div", null, ["milk", "collect", "drain", "edge", "denial", "ruin", "inspect", "vet", "quota"].map((c) => btn(c[0].toUpperCase() + c.slice(1), act(c))))
      ),
      card(
        title("Jars"),
        btn("The jar shelf", () => ctx2.send("jars")),
        muted("To inseminate: ?inseminate <who> <jar> [hole]. They always get asked first, and anyone with jar insemination off can't be."),
        h("div", null, btn("Inseminate…", () => ctx2.fillBox("inseminate " + (who() ? who() + " " : ""))))
      ),
      card(
        title("Herd"),
        h("div", null, ["myherd", "herdcall", "herdsummon", "roster", "stock", "queue"].map((c) => btn(c, () => ctx2.send(c)))),
        h("div", null, btn("Summon to me", act("summon")), btn("Claim", act("claim")), btn("Turn out", act("turnout")), btn("Let up", act("letup")))
      ),
      latest(ctx2)
    ];
  }
  function queue(ctx2) {
    const apps = ctx2.s.apps || [], m = ctx2.s.mail;
    const role = (a) => ctx2.ui["role" + a.mn] || (a.staffTrack ? "farmhand" : "livestock");
    return [
      card(
        h("div", { class: "fhc-kv" }, title("Applications"), chip(apps.length + " waitin'", apps.length ? "alert" : null)),
        apps.length ? apps.map((a) => h(
          "div",
          { class: "fhc-box", style: { margin: "6px 0" } },
          h("div", { class: "fhc-kv" }, h("b", null, a.n + ". " + a.name), h("span", { class: "fhc-muted" }, new Date(a.at).toLocaleDateString())),
          muted(a.sum + (a.staffTrack ? " · wants to be staff" : "")),
          h("label", { class: "fhc-label" }, "Approve as", h(
            "select",
            { class: "fhc-sel", onchange: (e) => ctx2.setUi({ ["role" + a.mn]: e.target.value }, true) },
            ["livestock", "guest", "luxury", "gloryhole", "farmhand", "mandated", "herdmaster"].map((r) => h("option", { value: r, selected: role(a) === r ? "selected" : null }, r))
          )),
          h("div", null, btn("Read it", () => ctx2.send("app " + a.n)), btn("Approve", () => ctx2.send("approve " + a.mn + " " + role(a)), true), btn("Deny", () => ctx2.send("deny " + a.mn)))
        )) : muted("Nobody's waitin'. New ones beep you as well as showin' here.")
      ),
      m && card(
        title("The bot's messages"),
        h("div", { class: "fhc-kv" }, h("span", null, "Waitin' to send"), h("b", null, String(m.sending))),
        h("div", { class: "fhc-kv" }, h("span", null, "People with messages held (away or unreachable)"), h("b", null, String(m.held))),
        h("div", { class: "fhc-kv" }, h("span", null, "Online and beep-able (friends both ways)"), h("b", null, m.beepable === null ? "checkin'…" : String(m.beepable))),
        muted("Held messages turn into one short summary when that person's back.")
      ),
      latest(ctx2)
    ];
  }
  function summonCheck() {
    const r = summonReady(BOT_MEMBER);
    if (r === null) return muted("BCX isn't loaded here. If you use BC+'s Ready to be summoned instead, add the farm bot (" + BOT_MEMBER + ") to it.");
    return h("div", { class: "fhc-kv" }, h("span", null, "Summon rule"), chip(r.ok ? "ready" : r.why, r.ok ? "good" : "alert"));
  }
  function toggles2(ctx2) {
    const s = ctx2.s, sw = s.switches || {};
    return [
      card(
        title("Work"),
        muted("Most staff leave this off. Mandated farmhands are always on call."),
        s.mandated ? h("div", { class: "fhc-kv" }, h("span", null, "On call"), chip("always (mandated)", "alert")) : toggle("On call", "Let the office summon you from anywhere with BCX or BC+ summoning", !!sw.forced, () => ctx2.send("forced")),
        s.onCall && summonCheck()
      ),
      muted("Your own milkin' and breedin' switches are on your Livestock panel."),
      panelPrefs(ctx2)
    ];
  }
  var STAFF_TABS = [
    { id: "me", label: "Me", render: me2 },
    { id: "herd", label: "Herd", render: herd },
    { id: "office", label: "Office", render: office, badge: (ctx2) => ctx2.docs.length },
    { id: "queue", label: "Queue", render: queue, badge: (ctx2) => (ctx2.s.apps || []).length },
    { id: "contracts", label: "Contracts", render: contracts },
    { id: "barn", label: "Barn", render: barn },
    { id: "tease", label: "Tease lines", render: tease },
    { id: "voice", label: "Voice", render: voice },
    { id: "zones", label: "Zones", render: zones },
    { id: "shift", label: "Shift", render: shift },
    { id: "guides", label: "Guides", render: (ctx2) => guidesTab(ctx2, true) },
    { id: "toggles", label: "Toggles", render: toggles2 }
  ];

  // extension/src/views/dashboard.js
  var field2 = (label, el) => h("label", { class: "fhc-label" }, label, el);
  var q = (v) => '"' + String(v).replace(/"/g, "'") + '"';
  function settingControl(ctx2, rule, s) {
    const key = "set:" + rule.id + ":" + s.name, cur = ctx2.ui[key];
    const set = (v) => ctx2.setUi({ [key]: v }, true);
    const def = Array.isArray(s.default) ? s.default.join("\n") : String(s.default);
    switch (s.type) {
      case "checkbox":
        return h(
          "select",
          { class: "fhc-sel", onchange: (e) => set(e.target.value) },
          ["on", "off"].map((v) => h("option", { value: v, selected: (cur || (s.default ? "on" : "off")) === v ? "selected" : null }, v))
        );
      case "option":
        return h(
          "select",
          { class: "fhc-sel", onchange: (e) => set(e.target.value) },
          s.options.map((o) => h("option", { value: o, selected: (cur || s.default) === o ? "selected" : null }, o))
        );
      case "stringList":
        return h("textarea", {
          class: "fhc-in",
          rows: 3,
          placeholder: "one " + (s.entryLabel || "entry") + " per line" + (s.maxEntries ? " · up to " + s.maxEntries : ""),
          oninput: (e) => set(e.target.value)
        }, cur !== void 0 ? cur : def);
      case "members":
        return h("input", { class: "fhc-in", placeholder: "farm, staff, or member numbers", value: cur !== void 0 ? cur : "farm", oninput: (e) => set(e.target.value) });
      default:
        return h("input", { class: "fhc-in", maxlength: s.maxChars || 256, value: cur !== void 0 ? cur : def, oninput: (e) => set(e.target.value) });
    }
  }
  function addCommand(ctx2, name, rule) {
    const pairs = rule.settings.map((s) => {
      const key = "set:" + rule.id + ":" + s.name;
      let v = ctx2.ui[key];
      if (v === void 0) v = s.type === "checkbox" ? s.default ? "on" : "off" : s.type === "members" ? "farm" : Array.isArray(s.default) ? s.default.join("\n") : s.default;
      if (s.type === "stringList") v = String(v).split("\n").map((x) => x.trim()).filter(Boolean).join("|");
      return s.name + "=" + q(v);
    });
    return ("contract add " + name + " " + rule.id + " " + pairs.join(" ")).trim();
  }
  function contracts2(ctx2) {
    const nm = () => (ctx2.ui.dName || "").trim().toLowerCase();
    const name = nm();
    const cats = [...new Set([...RULES.values()].map((r) => r.category))];
    const cat = ctx2.ui.dCat || cats[0];
    const inCat = [...RULES.values()].filter((r) => r.category === cat);
    const rule = RULES.get(ctx2.ui.dRule) && RULES.get(ctx2.ui.dRule).category === cat ? RULES.get(ctx2.ui.dRule) : inCat[0];
    const need = () => !nm() && (ctx2.hint("Give your contract a name first (one word, like prizecow)."), true);
    return [
      card(
        title("Your contract"),
        field2("Name (one word)", h("input", { class: "fhc-in", placeholder: "prizecow", value: ctx2.ui.dName || "", oninput: (e) => ctx2.setUi({ dName: e.target.value }, true) })),
        ctx2.ui.dWarn && !name ? muted("Give it a name first, sugar.") : null,
        h(
          "div",
          null,
          ["fun", "deep", "nhl"].map((b) => btn("New from " + b, () => !need() && ctx2.send("contract new " + nm() + " from " + b))),
          btn("New, empty", () => !need() && ctx2.send("contract new " + nm()))
        ),
        field2("Title", h("input", { class: "fhc-in", maxlength: 60, value: ctx2.ui.dTitle || "", oninput: (e) => ctx2.setUi({ dTitle: e.target.value }, true) })),
        field2("Terms they'll read (%name% becomes their name)", h("textarea", { class: "fhc-in", rows: 3, maxlength: 1e3, oninput: (e) => ctx2.setUi({ dTerms: e.target.value }, true) }, ctx2.ui.dTerms || "")),
        h(
          "div",
          null,
          btn("Save title", () => !need() && (ctx2.ui.dTitle ? ctx2.send("contract title " + nm() + " " + ctx2.ui.dTitle) : ctx2.hint("Type the title first."))),
          btn("Save terms", () => !need() && (ctx2.ui.dTerms ? ctx2.send("contract terms " + nm() + " " + ctx2.ui.dTerms) : ctx2.hint("Write the terms first."))),
          btn("Farm ends it", () => !need() && ctx2.send("contract policy " + nm() + " farm")),
          btn("Either side ends it", () => !need() && ctx2.send("contract policy " + nm() + " either"))
        )
      ),
      card(
        title("Add a BC+ rule"),
        muted("Every rule and setting BC+ " + BCPLUS_VERSION + " has. Only values BC+ accepts can be picked."),
        field2("Kind", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx2.setUi({ dCat: e.target.value, dRule: "" }) },
          cats.map((c) => h("option", { value: c, selected: c === cat ? "selected" : null }, c))
        )),
        field2("Rule", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx2.setUi({ dRule: e.target.value }) },
          inCat.map((r) => h("option", { value: r.id, selected: r === rule ? "selected" : null }, r.name + (NEVER[r.id] ? " (never on the farm)" : "")))
        )),
        rule && muted(rule.description),
        rule && NEVER[rule.id] ? h("div", { class: "fhc-box alert" }, "The farm never uses this one: it " + NEVER[rule.id] + ".") : rule && [
          rule.settings.map((s) => field2((s.label || s.name).replace(/:$/, ""), settingControl(ctx2, rule, s))),
          h(
            "div",
            null,
            btn("Add to " + (name || "contract"), () => !need() && ctx2.send(addCommand(ctx2, nm(), rule)), true),
            btn("Take it out", () => !need() && ctx2.send("contract remove " + nm() + " " + rule.id))
          )
        ]
      ),
      card(title("Check and send"), h(
        "div",
        null,
        btn("Preview", () => !need() && ctx2.send("contract show " + nm())),
        btn("All contracts", () => ctx2.send("contract list")),
        btn("Delete", () => !need() && ctx2.send("contract delete " + nm()))
      ), muted("Offer it from the Staff panel's Contracts tab.")),
      latest(ctx2)
    ];
  }
  function addons(ctx2) {
    const b = bcplusStatus(), s = summonReady(BOT_MEMBER);
    return [
      card(
        title("BC+"),
        chip(b.text, b.has ? b.match ? "good" : "alert" : "alert"),
        muted("Contracts are checked against BC+ " + BCPLUS_VERSION + ". If the club's BC+ moves on, re-run the catalog tool and rebuild.")
      ),
      card(
        title("BCX summoning (you)"),
        s === null ? muted("BCX isn't loaded here.") : chip(s.ok ? "Ready to be summoned · the farm bot is allowed" : s.why, s.ok ? "good" : "alert"),
        muted("On-call staff see the same check on their Staff panel.")
      ),
      card(title("Comin' soon"), muted("Echo's pumps and milk vendor, outfits by species and gender with high security locks, and the farm's own Listen to my voice (ECHS first)."))
    ];
  }
  var SPECIES = ["cow", "bull", "pony", "horse", "goat", "sheep", "pig", "bunny", "rabbit", "pup", "dog", "kitt", "cat", "fox", "wolf", "deer", "goblin"];
  var GENDERS = ["female", "male", "futa", "femboy"];
  var KEYS_TEXT = { staff: "farm staff + their herd leader", leader: "their herd leader only", owners: "the proprietors only" };
  function outfits(ctx2) {
    const saved = ctx2.s.outfits || {}, rules = ctx2.s.outfitRules || {};
    const sp = ctx2.ui.oSp || "cow";
    const slotBox = (key, label) => h(
      "div",
      { class: "fhc-box", style: { padding: "8px", borderColor: saved[key] ? "var(--fh-good)" : "var(--fh-line)", borderStyle: saved[key] ? "solid" : "dashed" } },
      h("b", null, label),
      muted(saved[key] ? saved[key].items + " pieces" + (saved[key].locks ? ", " + saved[key].locks + " locked" : "") : "Not set · uses the fallback"),
      h(
        "div",
        { style: { marginTop: "6px" } },
        btn("Save what I'm wearin'", () => ctx2.api.save && ctx2.api.save(key)),
        saved[key] ? btn("Clear", () => ctx2.send("outfit clear " + key.replace("uniform:", "").replace("special:", "special ").replace("|", " ").replace("*", "any"))) : null
      )
    );
    const specials = Object.keys(saved).filter((k) => k.startsWith("special:"));
    return [
      card(
        title("What gets saved"),
        chip("Clothes", "good"),
        chip("Restraints", "good"),
        chip("Locks", "good"),
        chip("never bodies or hair"),
        muted("Dress yourself (or a willin' helper), lock the pieces that should stay locked, then save it to a slot. Every saved lock goes on as a high security padlock.")
      ),
      card(
        title("New stock, by species and gender"),
        h("label", { class: "fhc-label" }, "Species", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx2.setUi({ oSp: e.target.value }) },
          SPECIES.map((x) => h("option", { value: x, selected: x === sp ? "selected" : null }, x))
        )),
        h(
          "div",
          { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
          GENDERS.map((g) => slotBox(sp + "|" + g, sp + " · " + g)).concat([slotBox(sp + "|*", sp + " · any gender")])
        ),
        h(
          "div",
          { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))", marginTop: "8px" } },
          GENDERS.map((g) => slotBox("*|" + g, "any species · " + g)).concat([slotBox("stock", "Any new stock")])
        ),
        muted("No exact match? The farm falls back: this species + gender → this species → this gender → any new stock.")
      ),
      card(title("Staff uniforms"), h(
        "div",
        { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
        ["farmhand", "mandated", "herdmaster", "proprietor"].map((r) => slotBox("uniform:" + r, r))
      )),
      card(
        title("Specials"),
        specials.map((k) => slotBox(k, k.slice(8))),
        h(
          "label",
          { class: "fhc-label" },
          "New special (one word: luxury, fairday, prizecow…)",
          h("input", { class: "fhc-in", value: ctx2.ui.oSpecial || "", oninput: (e) => ctx2.setUi({ oSpecial: e.target.value }, true) })
        ),
        btn("Save what I'm wearin' as this special", () => {
          const n = (ctx2.ui.oSpecial || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
          if (n.length < 2) return ctx2.hint("Name the special first (one word, like luxury).");
          ctx2.api.save && ctx2.api.save("special:" + n);
        })
      ),
      card(
        title("Locks"),
        h("div", { class: "fhc-kv" }, h("b", null, "High security padlock"), chip("every farm lock", "good")),
        h("label", { class: "fhc-label" }, "Who holds the keys", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx2.send("outfit keys " + e.target.value) },
          Object.entries(KEYS_TEXT).map(([k, v]) => h("option", { value: k, selected: (rules.keys || "staff") === k ? "selected" : null }, v))
        ))
      ),
      card(
        title("When to dress people"),
        [
          ["approve", "onApprove", "Offer the stock outfit on approval", "Picked by species and gender"],
          ["clockin", "onClockIn", "Offer the uniform at clock-in", "Mandated staff get theirs every shift"],
          ["changeback", "changeBack", "Change back at clock-out", "Their own clothes were kept and go back on"]
        ].map(([cmd, k, label, desc]) => h(
          "div",
          { class: "fhc-tog" },
          h("div", null, h("div", { class: "fhc-tog-l" }, label), muted(desc)),
          h("button", {
            type: "button",
            class: "fhc-sw" + (rules[k] ? " on" : ""),
            "aria-pressed": rules[k] ? "true" : "false",
            "aria-label": label,
            onclick: () => ctx2.send("outfit rule " + cmd + " " + (rules[k] ? "off" : "on"))
          }, h("span"))
        )),
        muted("Contracts offer an outfit when they're signed, too: ?contract outfit <name> auto|none|<slot>.")
      ),
      latest(ctx2)
    ];
  }
  var DASHBOARD_TABS = [
    { id: "contracts", label: "BC+ contracts", render: contracts2 },
    { id: "outfits", label: "Outfits", render: outfits },
    { id: "addons", label: "Other addons", render: addons }
  ];

  // extension/src/views/extras.js
  function modsFor(ctx2, view) {
    const mods = ctx2.s.mods || {};
    return Object.entries(mods).filter(([, m]) => m && typeof m === "object" && (!Array.isArray(m.views) || m.views.includes(view)) && Array.isArray(m.cards) && m.cards.length);
  }
  function drawCard(ctx2, name, c, i) {
    const key = "x_" + name + "_" + i;
    return card(
      c.title && title(String(c.title)),
      c.text && h("div", { class: "fhc-card", style: { whiteSpace: "pre-wrap" } }, String(c.text)),
      Array.isArray(c.lines) && c.lines.map((l) => h("div", { class: "fhc-kv" }, h("span", null, String(l[0] ?? l)), l[1] !== void 0 ? h("b", null, String(l[1])) : null)),
      Array.isArray(c.bars) && c.bars.map((b) => bar(String(b.label || ""), String(b.value ?? ""), Number(b.pct) || 0, b.kind)),
      Array.isArray(c.chips) && c.chips.length ? h("div", null, c.chips.map((x) => chip(String(x.text ?? x), x.kind))) : null,
      Array.isArray(c.toggles) && c.toggles.map((t) => toggle(String(t.label || ""), t.desc ? String(t.desc) : "", !!t.on, () => ctx2.send(String(t.cmd)))),
      c.input && h(
        "div",
        null,
        h("input", { class: "fhc-in", placeholder: String(c.input.placeholder || ""), value: ctx2.ui[key] || "", oninput: (e) => ctx2.setUi({ [key]: e.target.value }, true) }),
        btn(String(c.input.label || "Send"), () => {
          const v = (ctx2.ui[key] || "").trim();
          if (!v) return ctx2.hint("Type somethin' in the box first.");
          ctx2.send(String(c.input.cmd) + " " + v);
          ctx2.setUi({ [key]: "" });
        }, true)
      ),
      Array.isArray(c.buttons) && c.buttons.length ? h("div", { style: { marginTop: "6px" } }, c.buttons.map((b) => btn(String(b.label || b.cmd), () => ctx2.send(String(b.cmd)), !!b.accent))) : null,
      c.note && muted(String(c.note))
    );
  }
  function render(ctx2, view) {
    const list = modsFor(ctx2, view);
    if (!list.length) return [muted("No farm extras for you right now.")];
    return list.map(([name, m]) => h(
      "div",
      null,
      h("div", { class: "fhc-muted", style: { margin: "8px 2px 2px" } }, "🧩 " + String(m.label || name)),
      m.cards.map((c, i) => drawCard(ctx2, name, c, i))
    ));
  }
  function withExtras(tabs, view, ctx2) {
    if (!modsFor(ctx2, view).length) return tabs;
    const t = { id: "extras", label: "Farm extras", render: (c) => render(c, view) };
    const at = tabs.findIndex((x) => x.id === "guides");
    return at < 0 ? tabs.concat(t) : tabs.slice(0, at).concat(t, tabs.slice(at));
  }

  // extension/src/panel.js
  var VIEWS = {
    guest: { label: "Guest", tabs: GUEST_TABS },
    livestock: { label: "Livestock", tabs: LIVESTOCK_TABS },
    staff: { label: "Staff", tabs: STAFF_TABS },
    dashboard: { label: "Dashboard", tabs: DASHBOARD_TABS }
  };
  function loadPrefs() {
    try {
      return JSON.parse(window.localStorage.getItem(PREFS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function savePrefs(p) {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(p));
    } catch (e) {
    }
  }
  var Panel = class {
    constructor(onCommand, api2) {
      this.onCommand = onCommand;
      this.api = api2 || {};
      this.outfit = null;
      this.unread = 0;
      this.welcome = {};
      this.s = { name: "", onBooks: false };
      this.feed = [];
      this.docs = [];
      this.asks = [];
      this.choose = null;
      this.ui = {};
      this.prefs = loadPrefs();
      if (this.prefs.chatToo === void 0) this.prefs.chatToo = true;
      this.status = "…";
      const doc = window.document;
      const style = doc.createElement("style");
      style.textContent = CSS + ":root{" + Object.entries(THEME).map(([k, v]) => "--fh-" + k + ":" + v).join(";") + "}";
      doc.head.appendChild(style);
      this.btn = h("button", { id: "fhc-btn", type: "button", title: "B&B Farm", "aria-label": "B&B Farm panel" }, "🌾");
      this.btn.style.touchAction = "none";
      this.btn.addEventListener("pointerdown", (e) => this.dragButton(e));
      this.btn.addEventListener("click", () => {
        if (!this.btnDragged) this.toggle();
        this.btnDragged = false;
      });
      this.el = h("div", { id: "fhc-panel", role: "dialog", "aria-label": "B&B Farm" });
      this.el.addEventListener("keydown", (e) => e.stopPropagation());
      doc.body.appendChild(this.btn);
      doc.body.appendChild(this.el);
      this.placeButton();
      this.render();
    }
    /* ── the 🌾 button: drag it anywhere (mouse or finger), pin it to keep it put ── */
    placeButton() {
      const p = this.prefs.btnPos;
      if (p) Object.assign(this.btn.style, { left: this.clampX(p.x, 46) + "px", top: this.clampY(p.y, 46) + "px", right: "auto", bottom: "auto" });
      else Object.assign(this.btn.style, { left: "", top: "", right: "12px", bottom: "12px" });
    }
    clampX(x, w) {
      return Math.max(0, Math.min(window.innerWidth - w, x));
    }
    clampY(y, hgt) {
      return Math.max(0, Math.min(window.innerHeight - hgt, y));
    }
    dragButton(e) {
      if (this.prefs.btnPinned) return;
      const r = this.btn.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top, x0 = e.clientX, y0 = e.clientY;
      let moving = false;
      const move = (ev) => {
        if (!moving && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
        moving = true;
        this.btnDragged = true;
        Object.assign(this.btn.style, { left: this.clampX(ev.clientX - dx, 46) + "px", top: this.clampY(ev.clientY - dy, 46) + "px", right: "auto", bottom: "auto" });
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        if (!moving) return;
        const b = this.btn.getBoundingClientRect();
        this.prefs.btnPos = { x: Math.round(b.left), y: Math.round(b.top) };
        savePrefs(this.prefs);
        if (this.el.classList.contains("open") && !this.prefs.pos) this.placePanel();
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }
    // the panel opens beside the button (unless you've dragged the panel somewhere yourself)
    placePanel() {
      if (this.prefs.pos) {
        Object.assign(this.el.style, { left: this.clampX(this.prefs.pos.x, 120) + "px", top: this.clampY(this.prefs.pos.y, 60) + "px", right: "auto", bottom: "auto" });
        return;
      }
      if (!this.prefs.btnPos) {
        Object.assign(this.el.style, { left: "", top: "", right: "12px", bottom: "66px" });
        return;
      }
      const b = this.btn.getBoundingClientRect(), pw = Math.min(440, window.innerWidth - 24), ph = Math.min(640, window.innerHeight * 0.78);
      const left = this.clampX(b.left + 46 - pw, pw);
      const top = b.top - ph - 8 >= 0 ? b.top - ph - 8 : this.clampY(b.bottom + 8, ph);
      Object.assign(this.el.style, { left: left + "px", top: top + "px", right: "auto", bottom: "auto" });
    }
    resetPlaces() {
      delete this.prefs.btnPos;
      delete this.prefs.pos;
      savePrefs(this.prefs);
      this.placeButton();
      this.placePanel();
      this.render();
    }
    /* ── what the rest of the Companion calls ── */
    setStatus(text) {
      this.status = text;
      const s = this.el.querySelector("#fhc-status");
      if (s) s.textContent = text;
    }
    setWelcome(w) {
      this.welcome = w || {};
      this.render();
    }
    setState(s) {
      this.s = s || this.s;
      this.render();
    }
    add(text, kind = "reply") {
      this.feed.push({ text: String(text), kind, at: Date.now() });
      if (kind !== "mine") this.fresh = { text: String(text), kind };
      while (this.feed.length > HISTORY_MAX) this.feed.shift();
      if (kind !== "mine") this.ping();
      this.render();
    }
    addDoc(d) {
      this.docs = this.docs.filter((x) => !(x.about === d.about && x.kind === d.kind));
      this.docs.push(Object.assign({ id: "d" + Date.now() + Math.random().toString(36).slice(2, 6), at: Date.now() }, d));
      this.ui.doc = this.docs[this.docs.length - 1].id;
      if (this.view() === "staff") this.ui.tab_staff = "office";
      this.ping();
      this.render();
    }
    addAsk(a) {
      this.asks = this.asks.filter((x) => Date.now() - x.at < 10 * 6e4).concat([Object.assign({ at: Date.now() }, a)]);
      this.ping(true);
      this.render();
    }
    setChoose(c) {
      this.choose = c;
      this.ping(true);
      this.render();
    }
    setOutfit(o) {
      this.outfit = o;
      this.ping(true);
      this.render();
    }
    ask(cmd) {
      this.add(cmd, "mine");
      this.onCommand(cmd);
    }
    toggle(open = !this.el.classList.contains("open")) {
      if (open) this.placePanel();
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
    /* ── inside ── */
    ping(important) {
      if (this.el.classList.contains("open")) return;
      this.unread++;
      this.btn.setAttribute("data-unread", String(this.unread));
      if (this.prefs.popopen || important) {
        if (this.prefs.popopen) this.toggle(true);
      }
      if (this.prefs.chime) this.chime();
    }
    chime() {
      try {
        const A = window.AudioContext || window.webkitAudioContext;
        if (!A) return;
        const a = new A(), o = a.createOscillator(), g = a.createGain();
        o.frequency.value = 660;
        g.gain.value = 0.05;
        o.connect(g);
        g.connect(a.destination);
        o.start();
        o.stop(a.currentTime + 0.15);
      } catch (e) {
      }
    }
    views() {
      const s = this.s, v = [s.onBooks ? "livestock" : "guest"];
      if (s.staff) v.push("staff");
      if (s.proprietor) v.push("dashboard");
      return v;
    }
    view() {
      const v = this.views();
      return v.includes(this.prefs.view) ? this.prefs.view : v[v.length > 1 && this.s.staff ? 1 : 0];
    }
    ctx() {
      return {
        s: this.s,
        welcome: this.welcome,
        feed: this.feed,
        docs: this.docs,
        ui: this.ui,
        prefs: this.prefs,
        api: this.api,
        send: (cmd) => this.ask(cmd),
        // a button that can't do anything yet says why, instead of quietly doin' nothin'
        hint: (msg) => this.add("👉 " + msg, "notice"),
        fillBox: (text) => {
          this.add("👉 Finish it in the box at the bottom, then press Send: ?" + text + "…", "notice");
          const i = this.el.querySelector("#fhc-input");
          if (i) {
            i.value = text;
            i.focus();
          }
        },
        setUi: (patch, quiet) => {
          Object.assign(this.ui, patch);
          if (!quiet) this.render();
        },
        setPref: (k, v) => {
          this.prefs[k] = v;
          savePrefs(this.prefs);
          this.render();
        },
        closeDoc: (id) => {
          this.docs = this.docs.filter((d) => d.id !== id);
          this.render();
        },
        resetPlaces: () => {
          this.resetPlaces();
          this.add("👉 The 🌾 button and panel are back in the corner.", "notice");
        }
      };
    }
    render() {
      const ctx2 = this.ctx(), view = this.view(), V = VIEWS[view];
      const tabs = view === "guest" ? V.tabs : withExtras(V.tabs, view, ctx2);
      const tabKey = "tab_" + view, tab = tabs.find((t) => t.id === this.ui[tabKey]) || tabs[0];
      const scroll = this.el.querySelector(".fhc-body"), keep = scroll ? scroll.scrollTop : 0;
      const box = this.el.querySelector("#fhc-input"), typed = box ? box.value : "", hadFocus = box && window.document.activeElement === box;
      this.el.classList.toggle("compact", !!this.prefs.compact);
      this.el.replaceChildren(
        h(
          "div",
          { class: "fhc-head", style: { touchAction: "none" }, onpointerdown: (e) => this.drag(e) },
          h("div", null, h("div", { class: "fhc-title" }, "🌾 B&B Farm"), h("div", { id: "fhc-status", class: "fhc-muted" }, this.status)),
          h("button", { type: "button", class: "fhc-pill", "aria-label": "Close the panel", onclick: () => this.toggle(false) }, "✕")
        ),
        this.views().length > 1 && h(
          "div",
          { class: "fhc-row" },
          h("span", { class: "fhc-grow fhc-muted" }, "Panel"),
          this.views().map((v) => h("button", { type: "button", class: "fhc-pill" + (v === view ? " on" : ""), onclick: () => {
            this.prefs.view = v;
            savePrefs(this.prefs);
            this.render();
          } }, VIEWS[v].label))
        ),
        h(
          "div",
          { class: "fhc-row" },
          h("button", { type: "button", class: "fhc-safe red", onclick: () => this.ask("safe") }, "Safe word"),
          h("button", { type: "button", class: "fhc-safe", onclick: () => this.ask("stuck") }, "I'm stuck"),
          h("button", { type: "button", class: "fhc-safe", style: { borderColor: "var(--fh-line)" }, onclick: () => this.ask("staff") }, "Call staff")
        ),
        h("nav", { class: "fhc-row", "aria-label": "Panel sections" }, tabs.map((t) => {
          const n = t.badge ? t.badge(ctx2) : 0;
          return h("button", { type: "button", class: "fhc-pill" + (t === tab ? " on" : ""), onclick: () => {
            this.ui[tabKey] = t.id;
            this.render();
          } }, t.label + (n ? " · " + n : ""));
        })),
        h("div", { class: "fhc-body" }, this.banners(), safeRender(tab, ctx2)),
        h(
          "form",
          { class: "fhc-form", onsubmit: (e) => {
            e.preventDefault();
            const i = e.target.querySelector("#fhc-input");
            if (i.value.trim()) this.ask(i.value.trim());
            i.value = "";
          } },
          h(
            "label",
            { class: "fhc-grow", style: { display: "flex" } },
            h("span", { class: "fhc-sr" }, "Ask the farm girl"),
            h("input", { id: "fhc-input", class: "fhc-in", placeholder: "Ask the farm girl… (stats, size, help me)", autocomplete: "off" })
          ),
          h("button", { type: "submit", class: "fhc-b fhc-b-acc", style: { margin: "0" } }, "Send")
        )
      );
      const body = this.el.querySelector(".fhc-body");
      if (body) body.scrollTop = keep;
      const box2 = this.el.querySelector("#fhc-input");
      if (box2) {
        box2.value = typed;
        if (hadFocus) box2.focus();
      }
    }
    // questions waitin' on you, on every tab
    banners() {
      const out = [];
      const view = this.view(), tabNow = this.ui["tab_" + view];
      if (this.fresh && tabNow !== "inbox") out.push(h(
        "div",
        { class: "fhc-box", style: { borderColor: this.fresh.kind === "notice" ? "var(--fh-good)" : "var(--fh-accent)" } },
        h(
          "div",
          { class: "fhc-kv", style: { borderBottom: "none", padding: "0" } },
          h("span", { class: "fhc-muted" }, this.fresh.kind === "notice" ? "From the farm" : "Answer"),
          h("button", { type: "button", class: "fhc-pill", "aria-label": "Dismiss", onclick: () => {
            this.fresh = null;
            this.render();
          } }, "✕")
        ),
        h("div", { class: "fhc-card" + (this.fresh.kind === "notice" ? " notice" : ""), style: { maxHeight: "180px", overflowY: "auto" } }, this.fresh.text)
      ));
      const o = this.outfit;
      if (o) out.push(h(
        "div",
        { class: "fhc-box ask" },
        h("b", null, "👗 " + (o.why ? o.why + ": " : "") + "put on your " + o.label + "?"),
        h("div", { class: "fhc-muted" }, "Your own clothes are kept so you can change back. Body and hair aren't touched, and nothin' already locked on you moves." + (o.keys.length ? " Any locked pieces get high security padlocks the farm's keyholders can open." : "")),
        h(
          "div",
          { style: { marginTop: "8px" } },
          btn("Yes, dress me", () => {
            this.outfit = null;
            this.api.wear && this.api.wear(o);
            this.render();
          }, true),
          btn("Not now", () => {
            this.outfit = null;
            this.api.decline && this.api.decline(o);
            this.render();
          })
        )
      ));
      if (this.choose) out.push(h(
        "div",
        { class: "fhc-box ask" },
        h("div", { style: { whiteSpace: "pre-wrap" } }, this.choose.text),
        h("div", { style: { marginTop: "8px" } }, (this.choose.choices || []).map((c) => btn(c, () => {
          this.choose = null;
          this.ask(c);
        }, true)))
      ));
      for (const a of this.asks) out.push(h(
        "div",
        { class: "fhc-box ask" },
        h("div", null, a.text),
        h(
          "div",
          { style: { marginTop: "8px" } },
          btn("Yes", () => {
            this.asks = this.asks.filter((x) => x !== a);
            this.ask("yes");
          }, true),
          btn("No", () => {
            this.asks = this.asks.filter((x) => x !== a);
            this.ask("no");
          })
        )
      ));
      return out;
    }
    drag(e) {
      if (e.target.closest("button")) return;
      const r = this.el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
      const move = (ev) => Object.assign(this.el.style, { left: this.clampX(ev.clientX - dx, 120) + "px", top: this.clampY(ev.clientY - dy, 60) + "px", right: "auto", bottom: "auto" });
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        const b = this.el.getBoundingClientRect();
        this.prefs.pos = { x: Math.round(b.left), y: Math.round(b.top) };
        savePrefs(this.prefs);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }
  };
  function safeRender(tab, ctx2) {
    try {
      return tab.render(ctx2);
    } catch (e) {
      console.warn("[Farmhand Companion]", e);
      return h("div", { class: "fhc-box alert" }, "This tab hit a snag. The rest of the panel still works.");
    }
  }

  // extension/src/outfits.js
  var BACKUP_KEY = "fhc-outfit-backup";
  var LOCK_FIELDS = [
    "LockedBy",
    "LockMemberNumber",
    "LockMemberName",
    "LockMessage",
    "CombinationNumber",
    "Password",
    "Hint",
    "LockSet",
    "LockPickSeed",
    "RemoveTimer",
    "RemoveItem",
    "ShowTimer",
    "EnableRandomInput",
    "MemberNumberList",
    "MemberNumberListKeys",
    "RemoveOnUnlock"
  ];
  var P = () => window.Player;
  var groupOf = (name) => typeof window.AssetGroupGet === "function" ? window.AssetGroupGet(P().AssetFamily, name) : null;
  var isClothes = (g) => !!(g && g.Clothing);
  var isItem = (g) => !!(g && g.Category === "Item");
  var lockedGroups = () => new Set(P().Appearance.filter((it) => it.Property && it.Property.LockedBy).map((it) => it.Asset.Group.Name));
  function unlocked(prop) {
    const c = Object.assign({}, prop || {});
    for (const k of LOCK_FIELDS) delete c[k];
    if (Array.isArray(c.Effect)) c.Effect = c.Effect.filter((e) => e !== "Lock");
    return c;
  }
  function commit(bundle) {
    window.ServerAppearanceLoadFromBundle(P(), P().AssetFamily, bundle, P().MemberNumber);
    if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(P());
    window.ChatRoomCharacterUpdate(P());
  }
  function captureOutfit() {
    const items = [];
    let locks = 0;
    for (const it of P().Appearance) {
      const g = it.Asset && it.Asset.Group;
      if (!g || !(isClothes(g) || isItem(g))) continue;
      const b = window.ServerBundledItemFromAppearanceItem(it);
      const locked = !!(it.Property && it.Property.LockedBy);
      if (locked) locks++;
      items.push(Object.assign({}, b, { Property: unlocked(b.Property), locked }));
    }
    return { data: window.LZString.compressToBase64(JSON.stringify({ v: 1, items })), items: items.length, locks };
  }
  function wearOutfit(data, keys) {
    const outfit = JSON.parse(window.LZString.decompressFromBase64(String(data)) || "null");
    if (!outfit || !Array.isArray(outfit.items)) return { ok: false, why: "that outfit didn't come through right" };
    const cur = window.ServerAppearanceBundle(P().Appearance), stuck = lockedGroups();
    const mine = new Set(outfit.items.map((i) => i.Group));
    const next = cur.filter((b) => {
      if (stuck.has(b.Group)) return true;
      const g = groupOf(b.Group);
      if (isClothes(g)) return false;
      return !mine.has(b.Group);
    });
    let worn = 0, locks = 0, skipped = 0;
    const added = [];
    for (const it of outfit.items) {
      const g = groupOf(it.Group);
      if (!g || !(isClothes(g) || isItem(g))) continue;
      if (stuck.has(it.Group)) {
        skipped++;
        continue;
      }
      const b = { Group: it.Group, Name: it.Name, Color: it.Color, Difficulty: it.Difficulty, Craft: it.Craft, Property: unlocked(it.Property) };
      if (it.locked && keys && keys.length) {
        b.Property.Effect = (b.Property.Effect || []).concat(["Lock"]);
        Object.assign(b.Property, { LockedBy: "HighSecurityPadlock", LockMemberNumber: P().MemberNumber, MemberNumberListKeys: keys.join(",") });
        locks++;
      }
      next.push(b);
      worn++;
      if (isItem(g)) added.push(it.Group);
    }
    try {
      window.localStorage.setItem(BACKUP_KEY, JSON.stringify({ at: Date.now(), bundle: cur, added }));
    } catch (e) {
    }
    commit(next);
    return { ok: true, worn, locks, skipped };
  }
  function changeBack() {
    let bk = null;
    try {
      bk = JSON.parse(window.localStorage.getItem(BACKUP_KEY));
    } catch (e) {
    }
    if (!bk || !Array.isArray(bk.bundle)) return { ok: false, why: "I don't have your own clothes saved on this computer" };
    const stuck = lockedGroups();
    const next = window.ServerAppearanceBundle(P().Appearance).filter((b) => {
      if (stuck.has(b.Group)) return true;
      const g = groupOf(b.Group);
      if (isClothes(g)) return false;
      return !(bk.added || []).includes(b.Group);
    });
    const have = new Set(next.map((b) => b.Group));
    for (const b of bk.bundle) {
      const g = groupOf(b.Group);
      if (have.has(b.Group) || stuck.has(b.Group)) continue;
      if (isClothes(g) || isItem(g) && (bk.added || []).includes(b.Group)) next.push(b);
    }
    commit(next);
    try {
      window.localStorage.removeItem(BACKUP_KEY);
    } catch (e) {
    }
    return { ok: true, stillLocked: stuck.size };
  }
  var hasBackup = () => {
    try {
      return !!window.localStorage.getItem(BACKUP_KEY);
    } catch (e) {
      return false;
    }
  };

  // extension/src/cues.js
  var W = window;
  var ctx = null;
  function initCues(c) {
    ctx = c;
    setInterval(sightTick, 4e3);
    setInterval(feelTick, 6e4);
  }
  var pref = (k) => !ctx.panel.prefs[k];
  var cueOff = () => ({
    face: !pref("noFace") || void 0,
    sound: !pref("noSound") || void 0,
    trance: !pref("noTrance") || void 0,
    lead: !pref("noLead") || void 0
  });
  var mapOn = () => typeof W.ChatRoomMapViewIsActive === "function" && W.ChatRoomMapViewIsActive() && W.Player && W.Player.MapData && W.Player.MapData.Pos;
  var others = () => (W.ChatRoomCharacter || []).filter((c) => c && c.MemberNumber !== (W.Player && W.Player.MemberNumber));
  var lastSight = "";
  function sightTick() {
    try {
      if (W.CurrentScreen !== "ChatRoom" || !mapOn() || typeof W.ChatRoomMapViewCharacterIsVisible !== "function") return;
      const see = others().filter((c) => W.ChatRoomMapViewCharacterIsVisible(c)).map((c) => c.MemberNumber).sort();
      const hear = others().filter((c) => typeof W.ChatRoomMapViewCharacterIsHearable === "function" && W.ChatRoomMapViewCharacterIsHearable(c)).map((c) => c.MemberNumber).sort();
      const key = see.join(",") + "|" + hear.join(",");
      if (key === lastSight && Date.now() - (sightTick.at || 0) < 2e4) return;
      lastSight = key;
      sightTick.at = Date.now();
      ctx.toBot("sight", { see, hear });
    } catch (e) {
      console.warn("[Farmhand Companion] sight:", e);
    }
  }
  var walk = null;
  var DIRS = [["North", 0, -1], ["South", 0, 1], ["West", -1, 0], ["East", 1, 0]];
  function canStep(x, y) {
    try {
      return W.ChatRoomMapViewCanEnterTile(x, y) > 0;
    } catch (e) {
      return false;
    }
  }
  function findPath(from, to) {
    const wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40, key = (x, y) => x + "," + y;
    const goal = (x, y) => Math.max(Math.abs(x - to.X), Math.abs(y - to.Y)) <= (canStep(to.X, to.Y) ? 0 : 1);
    const prev = /* @__PURE__ */ new Map([[key(from.X, from.Y), null]]), q2 = [[from.X, from.Y]];
    while (q2.length) {
      const [x, y] = q2.shift();
      if (goal(x, y)) {
        const path = [];
        let k = key(x, y);
        while (prev.get(k)) {
          const [px, py, d] = prev.get(k);
          path.unshift(d);
          k = key(px, py);
        }
        return path;
      }
      if (prev.size > 4e3) break;
      for (const [d, dx, dy] of DIRS) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= wide || ny >= high || prev.has(key(nx, ny)) || !canStep(nx, ny)) continue;
        prev.set(key(nx, ny), [x, y, d]);
        q2.push([nx, ny]);
      }
    }
    return null;
  }
  function lead(m) {
    const no = () => {
      walk = null;
      ctx.toBot("leadNo", { id: m.id });
    };
    if (!pref("noLead") || !mapOn() || typeof W.ChatRoomMapViewMove !== "function") return no();
    const from = W.Player.MapData.Pos, to = { X: m.X, Y: m.Y };
    const path = findPath(from, to);
    if (!path) return no();
    if (!path.length) {
      ctx.toBot("leadOk", { id: m.id });
      return;
    }
    ctx.local("You're led " + (m.why ? m.why : "along") + "…", "#c9a35b", true);
    walk = { id: m.id, to, path, i: 0, last: { X: from.X, Y: from.Y }, stuck: Date.now(), retried: false };
    stepWalk();
  }
  function stepWalk() {
    if (!walk) return;
    const w = walk, p = W.Player && W.Player.MapData && W.Player.MapData.Pos;
    if (!p) {
      walk = null;
      return;
    }
    if (p.X !== w.last.X || p.Y !== w.last.Y) {
      w.last = { X: p.X, Y: p.Y };
      w.stuck = Date.now();
      w.i++;
    }
    if (w.i >= w.path.length || Math.max(Math.abs(p.X - w.to.X), Math.abs(p.Y - w.to.Y)) <= 0) {
      walk = null;
      ctx.toBot("leadOk", { id: w.id });
      return;
    }
    if (Date.now() - w.stuck > 3e3) {
      if (w.retried) {
        walk = null;
        ctx.toBot("leadNo", { id: w.id });
        return;
      }
      const path = findPath(p, w.to);
      if (!path) {
        walk = null;
        ctx.toBot("leadNo", { id: w.id });
        return;
      }
      Object.assign(w, { path, i: 0, stuck: Date.now(), retried: true });
    }
    if (W.ChatRoomMapViewMovement == null) {
      try {
        W.ChatRoomMapViewMove(w.path[w.i]);
      } catch (e) {
      }
    }
    setTimeout(stepWalk, 150);
  }
  var FACES = {
    milkdrunk: { Eyes: "Dazed", Blush: "Medium", Mouth: "HalfOpen" },
    heat: { Eyes: "Horny", Blush: "High", Mouth: "LipBite" },
    trance: { Eyes: "Daydream", Blush: "Low", Mouth: "HalfOpen" },
    afterglow: { Eyes: "Dazed", Blush: "VeryHigh", Mouth: "Open" },
    bred: { Eyes: "Lewd", Blush: "High", Mouth: "Moan" },
    milked: { Eyes: "Closed", Blush: "Medium", Mouth: "HalfOpen" },
    edged: { Eyes: "Horny", Blush: "VeryHigh", Mouth: "Pained" },
    clear: { Eyes: null, Blush: null, Mouth: null }
  };
  function face(m) {
    const f = FACES[m.mood];
    if (!f || !pref("noFace") || typeof W.CharacterSetFacialExpression !== "function" || !W.Player) return;
    const secs = m.mood === "clear" ? null : Math.max(5, Math.min(1800, Number(m.secs) || 30));
    for (const [g, e] of Object.entries(f)) {
      try {
        W.CharacterSetFacialExpression(W.Player, g, e, secs);
        if (g === "Eyes") W.CharacterSetFacialExpression(W.Player, "Eyes2", e, secs);
      } catch (e2) {
      }
    }
  }
  var SOUNDS = {
    pump: "SciFiPump",
    machine: "Sybian",
    bell: "BellMedium",
    cowbell: "BellSmall",
    stall: "CageClose",
    gate: "CageOpen",
    bowl: "PlaceBowl",
    wet: "Slime",
    chain: "ChainShort",
    lock: "LockSmall",
    vibe: "VibratorShort",
    spank: "SpankSkin1"
  };
  function sound(m) {
    const f = SOUNDS[m.name];
    if (!f || !pref("noSound") || typeof W.AudioPlayInstantSound !== "function") return;
    const vol = W.Player && W.Player.AudioSettings && W.Player.AudioSettings.Volume || 0;
    try {
      W.AudioPlayInstantSound("Audio/" + f + ".mp3", vol * 0.6);
    } catch (e) {
    }
  }
  function trance(m) {
    let el = W.document.getElementById("fhc-trance");
    const lvl = pref("noTrance") ? Math.max(0, Math.min(3, Number(m.level) || 0)) : 0;
    if (!lvl) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = W.document.createElement("div");
      el.id = "fhc-trance";
      el.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998;transition:opacity 4s;opacity:0;animation:fhcTrance 6s ease-in-out infinite";
      if (!W.document.getElementById("fhc-trance-css")) {
        const s = W.document.createElement("style");
        s.id = "fhc-trance-css";
        s.textContent = "@keyframes fhcTrance{0%,100%{filter:brightness(1)}50%{filter:brightness(0.85)}}";
        W.document.head.appendChild(s);
      }
      W.document.body.appendChild(el);
    }
    const edge = [0, 0.25, 0.45, 0.65][lvl], inner = [0, 55, 42, 30][lvl];
    el.style.background = "radial-gradient(ellipse at center, transparent " + inner + "%, rgba(70,20,90," + edge + ") 100%)";
    (W.requestAnimationFrame || ((f) => setTimeout(f, 16)))(() => {
      el.style.opacity = "1";
    });
  }
  var lastFeel = "";
  function feelTick() {
    try {
      if (!pref("noFeelings") || W.CurrentScreen !== "ChatRoom" || !W.Player || !ctx.panel.s || !ctx.panel.s.onBooks) return;
      if (Date.now() < (feelTick.next || 0)) return;
      feelTick.next = Date.now() + (7 + Math.random() * 6) * 6e4;
      const s = ctx.panel.s, items = (W.Player.Appearance || []).filter((x) => x && x.Asset && x.Asset.Group);
      const grp = (g) => items.find((x) => x.Asset.Group.Name === g);
      const eff = (x) => [].concat(x.Property && x.Property.Effect || [], x.Asset.Effect || []);
      const arousal = W.Player.ArousalSettings && W.Player.ArousalSettings.Progress || 0;
      const lines = [];
      if (grp("ItemButt")) lines.push("The plug shifts inside you every time you move, a full, stubborn pressure you can't ignore.");
      if (items.some((x) => eff(x).includes("Chaste")) && arousal > 40) lines.push("Your chastity aches. You're throbbing against it and it doesn't give an inch.");
      if (s.milk && s.milk.cap && s.milk.ml / s.milk.cap > 0.8) lines.push("Your udders are tight and heavy, prickling with milk. Any squeeze at all would make them leak.");
      if (s.holding && s.holding.cap && s.holding.ml / s.holding.cap > 0.6) lines.push("Everything they put in you sloshes when you shift your weight. You can feel how full you are.");
      if (s.heatUntil && s.heatUntil > Date.now()) lines.push("Heat rolls through you in slow waves. Every brush of fabric is almost too much.");
      if (s.preg) lines.push("Something shifts low in your belly, slow and heavy. The litter is settling in.");
      if (grp("ItemMouth") && items.some((x) => ["ItemMouth", "ItemMouth2", "ItemMouth3"].includes(x.Asset.Group.Name) && eff(x).includes("BlockMouth"))) lines.push("Drool gathers around the gag and slips down your chin. You can't stop it.");
      if (arousal > 85) lines.push("You're right on the edge and everyone around you can probably tell.");
      const pool = lines.filter((l) => l !== lastFeel);
      if (!pool.length) return;
      lastFeel = pool[Math.floor(Math.random() * pool.length)];
      ctx.local(lastFeel, "#b58ad9", true);
    } catch (e) {
      console.warn("[Farmhand Companion] feelings:", e);
    }
  }
  function drawMarkers() {
    try {
      const s = ctx.panel.s;
      if (!s || !s.staff || !Array.isArray(s.herd) || !pref("noMarkers") || !mapOn() || typeof W.DrawText !== "function") return;
      const R = W.ChatRoomMapViewPerceptionRange || 6, tile = 1e3 / (R * 2 + 1), me3 = W.Player.MapData.Pos;
      for (const x of s.herd) {
        const C = (W.ChatRoomCharacter || []).find((c) => c.MemberNumber === x.mn);
        if (!C || !C.MapData || !C.MapData.Pos || !W.ChatRoomMapViewCharacterIsVisible(C)) continue;
        const tags = [];
        if (x.milk !== null && x.milk >= 75) tags.push(["M", "#7fa8c9"]);
        if (x.heat) tags.push(["H", "#d9534f"]);
        if (x.preg) tags.push(["B", "#8fbf6a"]);
        if (x.denied) tags.push(["X", "#c9a35b"]);
        if (!tags.length) continue;
        const sx = (C.MapData.Pos.X - me3.X + R) * tile, sy = (C.MapData.Pos.Y - me3.Y) * tile + R * tile;
        if (sx < 0 || sy < 0 || sx > 1e3 || sy > 1e3) continue;
        tags.forEach(([t, col], i) => W.DrawText(t, sx + tile * 0.2 + i * tile * 0.22, sy + tile * 0.15, col, "black"));
      }
    } catch (e) {
    }
  }

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
    toBot("hello", { ver: VERSION, relay: !(st.panel && st.panel.prefs.noRelay), off: st.panel ? cueOff() : {} });
  }
  var EMOJI = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[\uFE0F\u200D\u20E3])/gu;
  var forChat = (s) => String(s).replace(EMOJI, "").replace(/[ \t]{2,}/g, " ").replace(/^([*]?)[ \t]+/gm, "$1").trim();
  var inCharacter = (s) => String(s).replace(/\(/g, "[").replace(/\)/g, "]");
  function relay(m) {
    const text = inCharacter(forChat(m.text || "")).slice(0, 900);
    const P2 = window.Player || {}, names = [P2.Nickname, P2.Name].filter(Boolean).map((n) => String(n).toLowerCase());
    const now = Date.now();
    st.relayed = (st.relayed || []).filter((t) => now - t < 6e4);
    const blocked = typeof window.ChatRoomOwnerPresenceRule === "function" && (() => {
      try {
        return window.ChatRoomOwnerPresenceRule("BlockEmote", null);
      } catch (e) {
        return false;
      }
    })();
    const ok = text && names.some((n) => text.toLowerCase().includes(n)) && !st.panel.prefs.noRelay && !blocked && st.relayed.length < 8;
    if (!ok) {
      toBot("relayNo", { id: m.id });
      return;
    }
    st.relayed.push(now);
    window.ServerSend("ChatRoomChat", { Type: "Emote", Content: "*" + text });
  }
  function sendCommand(text) {
    text = String(text || "").trim();
    if (!text) return;
    if (botHere()) {
      if (!st.welcomed) hello();
      toBot("cmd", { text });
      const sentAt = Date.now();
      st.lastSent = sentAt;
      setTimeout(() => {
        if (st.lastHeard >= sentAt || st.lastSent !== sentAt) return;
        st.panel.add('No answer to "' + text + `" yet. The farm girl may be busy, or not runnin' the newest bot. ` + (st.welcomed ? "If it keeps happenin', tell staff which button it was." : "She hasn't said hello to this panel yet: is her script on?"), "notice");
      }, 1e4);
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
  function toChat(text, color, italic) {
    if (typeof window.ChatRoomSendLocal !== "function") return false;
    const p = window.document.createElement("div");
    p.style.cssText = "color:" + color + ";white-space:pre-wrap;margin:0.25em 0" + (italic ? ";font-style:italic" : "");
    p.textContent = forChat(text);
    window.ChatRoomSendLocal(p.outerHTML);
    return true;
  }
  function onFarmMsg(m) {
    if (m.from !== BOT_MEMBER) return;
    if (m.type !== "ping" && m.type !== "state") st.lastHeard = Date.now();
    switch (m.type) {
      case "ping":
        hello();
        break;
      case "welcome":
        st.welcomed = true;
        st.panel.setWelcome(m);
        if (!m.proto || m.proto < 2) {
          st.panel.setStatus("connected · farm girl v" + m.ver + " (needs updatin')");
          st.panel.add("The farm girl is runnin' an older bot (v" + m.ver + ") that doesn't send this panel your roles, keys or numbers, so only the basic panel shows. Update farmhand-bot.user.js on HER browser (the bot's account), then reload her page.", "notice");
        } else {
          st.panel.setStatus("connected · farm girl v" + m.ver);
          setTimeout(() => {
            if (!st.gotState) st.panel.add("Connected, but the farm girl hasn't sent your roles yet. If Staff or Dashboard don't show up, reload the page.", "notice");
          }, 12e3);
        }
        break;
      case "state":
        if (m.state && typeof m.state === "object") {
          st.gotState = true;
          st.panel.setState(m.state);
        }
        break;
      case "reply":
      case "notice": {
        const text = collect(m);
        if (text === null) break;
        st.panel.add(text, m.type);
        if (m.type === "notice" && st.panel.prefs.chatToo !== false) toChat(text, "#c9a35b");
        break;
      }
      case "doc": {
        const text = collect(m);
        if (text !== null) st.panel.addDoc({ text, kind: String(m.kind || "record"), who: String(m.who || "?"), about: m.about });
        break;
      }
      case "ask":
        st.panel.addAsk({ kind: String(m.kind || ""), text: String(m.text || "") });
        toChat(String(m.text || "") + "  (Yes / No in your 🌾 panel)", "#c9a35b");
        break;
      case "choose":
        st.panel.setChoose({ text: String(m.text || ""), choices: Array.isArray(m.choices) ? m.choices.map(String).slice(0, 30) : [] });
        toChat(String(m.text || "") + "  (pick in your 🌾 panel)", "#c9a35b");
        break;
      case "outfit":
        st.panel.setOutfit({
          slot: String(m.slot || ""),
          label: String(m.label || "farm outfit"),
          data: String(m.data || ""),
          keys: Array.isArray(m.keys) ? m.keys.filter(Number.isInteger) : [],
          why: String(m.why || "")
        });
        toChat("👗 The farm's offerin' you your " + String(m.label || "outfit") + ". Yes or Not now in your 🌾 panel.", "#c9a35b");
        break;
      case "relay":
        relay(m);
        break;
      case "lead":
        lead(m);
        break;
      // walk me there (cues.js)
      case "face":
        face(m);
        break;
      case "sound":
        sound(m);
        break;
      case "trance":
        trance(m);
        break;
      case "voice": {
        const line = String(m.text || "").slice(0, 300);
        if (!toChat("[Voice] " + line, "#a67fd4", true)) st.panel.add("[Voice] " + line, "notice");
        break;
      }
      case "roomline": {
        const line = String(m.text || "").slice(0, 1200);
        if (typeof window.ChatRoomSendLocal === "function") {
          const p = window.document.createElement("div");
          p.className = m.kind === "emote" ? "ChatMessage ChatMessageEmote" : "ChatMessage ChatMessageChat";
          p.style.cssText = m.kind === "emote" ? "font-style:italic" : "";
          p.textContent = forChat(m.kind === "emote" ? line : "Farm girl: " + line);
          window.ChatRoomSendLocal(p.outerHTML);
        } else st.panel.add(line, "notice");
        break;
      }
      case "outfitBack": {
        const r = changeBack();
        st.panel.add(r.ok ? "👗 Back in your own clothes" + (r.stillLocked ? " (farm-locked pieces stay till a keyholder opens 'em)" : "") + "." : "👗 " + r.why + ".", "notice");
        if (r.ok) toBot("outfitAnswer", { answer: "back" });
        break;
      }
    }
  }
  var api = {
    wear(o) {
      let r;
      try {
        r = wearOutfit(o.data, o.keys);
      } catch (e) {
        r = { ok: false, why: "the game wouldn't take it (" + e.message + ")" };
      }
      st.panel.add(r.ok ? "👗 Dressed in " + o.label + ": " + r.worn + " pieces" + (r.locks ? ", " + r.locks + " locked with high security padlocks" : "") + (r.skipped ? ". " + r.skipped + " spots were already locked, so I left 'em be" : "") + "." : "👗 Couldn't dress you: " + r.why + ".", "notice");
      if (r.ok) toBot("outfitAnswer", { answer: "worn", slot: o.slot, locks: r.locks });
    },
    decline(o) {
      toBot("outfitAnswer", { answer: "declined", slot: o.slot });
    },
    back() {
      onFarmMsg({ from: BOT_MEMBER, type: "outfitBack" });
    },
    save(slot) {
      let c;
      try {
        c = captureOutfit();
      } catch (e) {
        st.panel.add("👗 Couldn't read what you're wearin': " + e.message, "notice");
        return;
      }
      if (!c.items) {
        st.panel.add("👗 You're not wearin' any clothes or restraints to save, sugar.", "notice");
        return;
      }
      toBot("outfitSave", { slot, data: c.data, items: c.items, locks: c.locks });
    },
    hasBackup,
    rehello: () => hello(),
    // tell the bot a setting changed (the relay switch)
    // map tool: the next `count` clicks on the game's map pick tiles instead of walkin' you there
    pickTiles(count, what, done) {
      if (typeof window.ChatRoomMapViewIsActive === "function" && !window.ChatRoomMapViewIsActive()) {
        st.panel.add(`🗺️ Switch the room to map view first, then press the button again. (Walkin' to the spot and using the "where I stand" buttons still works too.)`, "notice");
        return;
      }
      if (typeof window.ChatRoomMapViewPixelToTileCoordinates !== "function") {
        st.panel.add(`🗺️ This version of the game doesn't let me read map clicks. Use the "where I stand" buttons instead.`, "notice");
        return;
      }
      st.pick = { count, what, done, got: [] };
      st.panel.add("🗺️ Click " + (count > 1 ? "one corner of " : "the tile for ") + what + " on the map. You won't walk there. (Esc cancels.)", "notice");
      st.panel.toggle(false);
    },
    cancelPick() {
      if (st.pick) {
        st.pick = null;
        st.panel.add("🗺️ Map pickin' cancelled.", "notice");
      }
    }
  };
  function pickClick() {
    if (!st.pick || window.MouseX > 1e3) return false;
    if (window.MouseX >= 790 && window.MouseY >= 860) return false;
    const tile = window.ChatRoomMapViewPixelToTileCoordinates(window.MouseX, window.MouseY);
    if (!tile) return true;
    const p = st.pick;
    p.got.push({ X: tile.X, Y: tile.Y });
    if (p.got.length < p.count) {
      st.panel.add("🗺️ Got " + tile.X + "," + tile.Y + ". Now click the opposite corner.", "notice");
      return true;
    }
    st.pick = null;
    try {
      p.done(p.got);
    } catch (e) {
      console.warn("[Farmhand Companion]", e);
    }
    st.panel.toggle(true);
    return true;
  }
  function start() {
    st.panel = new Panel(sendCommand, api);
    st.panel.setStatus("waitin' for the farm girl");
    initCues({ toBot, panel: st.panel, local: toChat });
    try {
      mod.hookFunction("ChatRoomMapViewDraw", 0, (args, next) => {
        const r = next(args);
        drawMarkers();
        return r;
      });
    } catch (e) {
      console.warn("[Farmhand Companion] map markers unavailable:", e);
    }
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
    try {
      mod.hookFunction("ChatRoomMapViewClick", 10, (args, next) => {
        let took = false;
        try {
          took = pickClick();
        } catch (e) {
          console.warn("[Farmhand Companion]", e);
          st.pick = null;
        }
        return took ? void 0 : next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] map clicks unavailable:", e);
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && st.pick) api.cancelPick();
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
