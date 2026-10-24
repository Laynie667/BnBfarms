// ==UserScript==
// @name         BnB Farm — Farmhand Companion
// @namespace    bnbfarm
// @version      0.38.0
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-companion.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-companion.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Your B&B Farm panel: the farm girl's answers, stat cards and guides, right in the game.
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
  var VERSION = "0.38.0";

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
#fhc-settings{position:fixed;left:50%;top:3%;transform:translateX(-50%);width:min(860px,96vw);max-height:94vh;max-height:94dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;z-index:2147483000;padding:14px 18px;border-radius:10px;box-shadow:0 6px 30px rgba(0,0,0,0.6);box-sizing:border-box;background:var(--fh-ground);color:var(--fh-text);border:2px solid var(--fh-accent);font:14px/1.4 "Source Sans 3","Segoe UI",sans-serif}
@media (max-width:700px),(pointer:coarse) and (max-width:1000px){#fhc-settings{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;max-height:none;border-radius:0;border-width:0;padding:10px 12px calc(10px + env(safe-area-inset-bottom))}#fhc-settings h2{font-size:18px}#fhc-settings .fhc-row{position:sticky;top:-10px;background:var(--fh-ground);z-index:1}}
@media (pointer:coarse){#fhc-settings input,#fhc-settings select,#fhc-settings textarea{font-size:16px}#fhc-settings button{min-height:38px}}
#fhc-settings button{font:inherit;cursor:pointer}
#fhc-settings{overflow-x:hidden}#fhc-settings input,#fhc-settings select,#fhc-settings textarea{max-width:100%;min-width:0;box-sizing:border-box}#fhc-settings label select,#fhc-settings .fhc-kv select{flex:1 1 0;width:auto}
#fhc-settings h2{font-family:Bitter,Georgia,serif;color:var(--fh-accent)}
#fhc-btn{position:fixed;right:12px;bottom:12px;z-index:9999;width:46px;height:46px;border-radius:50%;
  border:2px solid var(--fh-accent);background:#3b2a1a;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 2px 8px #0008}
#fhc-btn[data-unread]:after{content:attr(data-unread);position:absolute;top:-4px;right:-4px;background:var(--fh-alert);
  color:#fff;border-radius:9px;font-size:11px;padding:1px 5px;font-family:sans-serif}
#fhc-panel{position:fixed;right:12px;bottom:66px;z-index:9999;width:min(440px,calc(100vw - 24px));height:min(640px,78vh);
  display:none;flex-direction:column;background:var(--fh-ground);color:var(--fh-text);border:2px solid var(--fh-accent);border-radius:12px;
  font:14px/1.4 "Source Sans 3","Segoe UI",sans-serif;box-shadow:0 4px 18px #000a;overflow:hidden}
#fhc-panel.open{display:flex}
#fhc-panel.full{left:0!important;top:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100vh!important;
  height:100dvh!important;border-radius:0;border-width:0}
#fhc-panel.full .fhc-grip{display:none}
.fhc-top{flex:1;min-height:0;display:flex;flex-direction:column}
.fhc-grip{position:absolute;right:0;bottom:0;width:22px;height:22px;cursor:nwse-resize;touch-action:none;z-index:2;
  background:linear-gradient(135deg,transparent 50%,var(--fh-accent) 50%,var(--fh-accent) 58%,transparent 58%,transparent 70%,var(--fh-accent) 70%,var(--fh-accent) 78%,transparent 78%)}
/* phones: 16px text in boxes, or the browser zooms the whole page in when one gets focus */
@media (pointer:coarse),(max-width:1000px){#fhc-panel input,#fhc-panel select,#fhc-panel textarea,#fhc-settings input,#fhc-settings select,#fhc-settings textarea{font-size:16px!important}}
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
.fhc-fold{cursor:pointer;user-select:none}.fhc-fold::after{content:" \u25BE";color:var(--fh-muted);font-size:11px}.fhc-box.fold>:not(:first-child){display:none}.fhc-box.fold .fhc-fold::after{content:" \u25B8"}.fhc-box.fold{padding:8px 11px}
nav.fhc-row.fhc-tabs{flex-wrap:nowrap;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;-webkit-overflow-scrolling:touch}nav.fhc-row.fhc-tabs .fhc-pill{flex:0 0 auto;white-space:nowrap}
@media (min-width:701px) and (pointer:fine){nav.fhc-row.fhc-tabs{flex-wrap:wrap;overflow-x:visible}}
.fhc-sos{background:var(--fh-alert)!important;color:#fff!important;border-color:var(--fh-alert)!important;font-weight:700}
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
      else if (k === "value") {
        el.value = v;
        el.setAttribute("value", v);
      } else el.setAttribute(k, v === true ? "" : String(v));
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
  var FOLD_KEY = "fhc-folded";
  var folded = null;
  var foldSet = () => {
    if (!folded) {
      try {
        folded = new Set(JSON.parse(window.localStorage.getItem(FOLD_KEY)) || []);
      } catch (e) {
        folded = /* @__PURE__ */ new Set();
      }
    }
    return folded;
  };
  var foldSave = () => {
    try {
      window.localStorage.setItem(FOLD_KEY, JSON.stringify([...foldSet()].slice(-200)));
    } catch (e) {
    }
  };
  var card = (...kids) => {
    const box2 = h("div", { class: "fhc-box" }, ...kids);
    const first = box2.firstElementChild, t = first && (first.classList.contains("fhc-h") ? first : first.querySelector(":scope > .fhc-h"));
    if (!t || box2.children.length < 2) return box2;
    const key = (t.textContent || "").replace(/[·:].*$/, "").replace(/\d+/g, "").trim().slice(0, 40);
    if (!key) return box2;
    t.classList.add("fhc-fold");
    t.setAttribute("role", "button");
    t.setAttribute("tabindex", "0");
    const set = (on2) => {
      box2.classList.toggle("fold", on2);
      t.setAttribute("aria-expanded", on2 ? "false" : "true");
    };
    set(foldSet().has(key));
    const flip = (e) => {
      e.preventDefault();
      const on2 = !box2.classList.contains("fold");
      if (on2) foldSet().add(key);
      else foldSet().delete(key);
      foldSave();
      set(on2);
    };
    t.addEventListener("click", flip);
    t.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") flip(e);
    });
    return box2;
  };
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
  function toggle(label, desc, on2, onflip) {
    return h(
      "div",
      { class: "fhc-tog" },
      h("div", null, h("div", { class: "fhc-tog-l" }, label), desc ? h("div", { class: "fhc-muted" }, desc) : null),
      h("button", { type: "button", class: "fhc-sw" + (on2 ? " on" : ""), "aria-pressed": on2 ? "true" : "false", "aria-label": label, onclick: onflip }, h("span"))
    );
  }
  var ml = (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + " L" : Math.round(n) + " mL";

  // shared/guides.js
  var BOOKS = [["Rules", "rules"], ["Consent", "consent"], ["Tour", "tour"], ["Doors", "doors"], ["Species", "species"], ["Help", "help"]];
  var PUBLIC_GROUPS = [
    { name: "Safety", cmds: ["safe", "stuck", "staff", "report"] },
    { name: "Suggestion box", cmds: ["feedback <what you think>", "suggest <an idea>", "bug <what went wrong>", "feedback mine", "meh", "more"] },
    { name: "Gettin' started", cmds: ["help", "help me", "rules", "consent", "tour", "apply", "friend", "species", "luxury", "doors", "addons"] },
    { name: "You and the farm", cmds: ["today", "record", "keys", "who", "herd", "notice", "weather", "feeding", "curfew", "beg"] },
    { name: "Milk", cmds: ["stats", "board", "milkable", "quota"] },
    { name: "Stock with stock", cmds: ["milk <who>", "edge <who>", "groom <who>"] },
    { name: "Breedin'", cmds: ["breedable", "fertile", "mpreg", "freeuse", "jarok", "yes", "no", "naturalheat", "breed <who>", "cum <who>", "wash", "tally", "eggs", "praise", "degrade", "rights", "accept", "pedigree"] },
    { name: "Body", cmds: ["size", "measure", "penis", "futa", "gender <word>"] },
    { name: "Clothes", cmds: ["dressme", "outfit", "outfits", "uniform", "outfit back"] },
    { name: "Mind", cmds: ["hypno", "hypnotize me", "echs", "teaseme", "teaseme light", "teaseme steady", "teaseme needy", "teaseme off"] },
    { name: "Fun", cmds: ["fair", "enter"] },
    { name: "Ribbons and the store", cmds: ["ribbons", "ribbons top", "store", "buy <item>", "gift <who> <potion>", "potions", "potions on", "dares on", "dare", "dared", "dare skip", "bench", "bench on", "bench me <minutes>", "use <mouth|pussy|ass>", "bench top"] }
  ];
  var STAFF_GROUPS = [
    { name: "Books", cmds: ["queue", "app <n>", "approve <who> livestock", "deny <who>", "appclear", "roster", "stock", "find <who>", "record <who>", "note <who>", "signed", "addfriend <who>", "unregister <who>", "unregister <who> <role>"] },
    { name: "Herd", cmds: ["claim <who>", "release <who>", "myherd", "herdname <name>", "herdcall", "herdsummon", "turnout <who>", "letup <who>", "brand <who>", "walk <who>"] },
    { name: "Stock", cmds: ["tier <who> <tier>", "stocks <who>", "unstock <who>", "vet <who>", "inspect <who>", "tease list", "tease add <line>", "tease for <who> <line>", "teaseme <who> on", "hypnotize <who>", "allow <who> cum", "allow <who> all", "echs <who>"] },
    { name: "Contracts", cmds: ["contract list", "contract show deep <who>", "contract offer deep <who> 1w", "contract check <who>", "contract release <who>", "contract rules", "contracts"] },
    { name: "Outfits", cmds: ["outfit", "outfit offer <who>", "outfit offer <who> <species> <gender>"] },
    { name: "Barn", cmds: ["milk <who>", "collect <who>", "jars", "inseminate <who> <jar>", "machine <who> <jar>", "drain <who>", "edge <who>", "denial <who>", "ruin <who>", "nomilk <who> <hours>", "quota <who>", "heat <who>", "heatline", "shotlog"] },
    { name: "Map", cmds: ["spot", "spot set <name>", "spot place <name> <x> <y>", "zone", "zone who", "zone a <name>", "zone b <name>", "zone box <name> <ax> <ay> <bx> <by>", "zone pair <name> <group>", "tourstop", "setrescue", "where", "stucklog"] },
    { name: "Voice", cmds: ["voice", "voice on herd", "voice add herd <line>", "voice every herd 15"] },
    { name: "Work and play", cmds: ["clockin", "clockout", "hours", "done", "chores", "chore add <job> @<place>", "wheel", "spin", "begphrase", "score"] },
    { name: "Ribbons, potions, dares", cmds: ["ribbon give <who> <n>", "ribbon fine <who> <n>", "ribbons <who>", "potion give <who> <potion>", "potion end <who>", "dare <who>", "dare <who> reckless", "corral <who> <minutes>", "uncorral <who>", "bench <who> <minutes>", "unbench <who>", "wheel farm", "store approve <who>"] },
    { name: "Keys and calls", cmds: ["keys <who>", "keysync", "keydump", "grant <who> <tier>", "revoke <who>", "forced", "summon <who>", "summon all", "pasture", "onduty", "cover"] }
  ];
  var OWNER_GROUPS = [
    { name: "Proprietors", cmds: ["staffadd <who> <role>", "staffremove <who>", "goldkey <who>", "notice <text>", "feeding on", "curfew on", "fair open", "addons off <name>", "addons on <name>", "backup", "health", "edit <who>", "feedback list", "feedback list ideas", "feedback list lines", "feedback done <n>", "feedback export", "store price <item> <n>", "store off <item>", "store on <item>"] }
  ];
  var needsInput = (cmd) => /</.test(cmd);
  var cmdStem = (cmd) => cmd.replace(/\s*<.*$/, "").trim();

  // extension/src/views/common.js
  function safetyTab(ctx3) {
    const big = (label, cmd, red, note2) => h(
      "div",
      { style: { marginBottom: "10px" } },
      h("button", { type: "button", class: "fhc-safe" + (red ? " red" : ""), style: { width: "100%", minHeight: "48px", fontSize: "16px" }, onclick: () => ctx3.send(cmd) }, label),
      muted(note2)
    );
    return [
      card(
        title("Safety"),
        big("Safe word", "safe", true, "Stops everything at once, from anybody, anywhere on the farm. No contract overrides it. On-call staff are called to you."),
        big("I'm stuck", "stuck", false, "Can't move, can't reach a door, stuck in somethin'? Staff are told where you are, and you're brought somewhere safe."),
        big("Call staff", "staff", false, "Just want a hand, or somebody to talk to? This calls whoever's on duty.")
      ),
      muted("From chat, without the panel: ?safe \xB7 ?stuck \xB7 ?staff"),
      sayCard(ctx3)
    ];
  }
  function sayCard(ctx3) {
    if (!ctx3.api || !ctx3.api.say) return null;
    const box2 = h("textarea", {
      class: "fhc-in",
      rows: 2,
      maxlength: 300,
      placeholder: "What you need to say\u2026",
      value: ctx3.ui.sayText || "",
      oninput: (e) => ctx3.setUi({ sayText: e.target.value }, true)
    });
    const go = (to) => {
      if (ctx3.api.say(box2.value, to)) ctx3.setUi({ sayText: "" });
    };
    return card(
      title("\u{1F5E3}\uFE0F Say it"),
      muted("Gagged, made to moo, or held silent? Type it here and it gets through exactly as you typed it. A trap that wants a line said hears it, and so do yes, no and commands. Nobody else sees it."),
      box2,
      h("div", { style: { marginTop: "6px" } }, btn("Say it to the farm", () => go("farm"), true), btn("Tell staff", () => go("staff"))),
      muted("Tell staff sends it to whoever's on duty, and your herd leader.")
    );
  }
  function guidesTab(ctx3, staff) {
    const q2 = (ctx3.ui.search || "").toLowerCase();
    const groups = PUBLIC_GROUPS.concat(
      staff ? STAFF_GROUPS : [],
      staff && ctx3.s.proprietor ? OWNER_GROUPS : [],
      (ctx3.s.addonCmds || []).map((g) => ({ name: "\u{1F9E9} " + g.name, cmds: (g.cmds || []).map(String) }))
    );
    const shown = groups.map((g) => ({ name: g.name, cmds: g.cmds.filter((c) => !q2 || c.includes(q2) || g.name.toLowerCase().includes(q2)) })).filter((g) => g.cmds.length);
    const input2 = h("input", {
      class: "fhc-in",
      placeholder: "milk, breed, keys\u2026",
      value: ctx3.ui.search || "",
      oninput: (e) => ctx3.setUi({ search: e.target.value }, true)
    });
    return [
      h("label", { class: "fhc-label" }, "Search guides and commands", input2),
      h("div", null, BOOKS.map(([label, cmd]) => btn(label, () => ctx3.send(cmd), true))),
      shown.map((g) => card(title(g.name), h("div", null, g.cmds.map((c) => h("button", {
        type: "button",
        class: "fhc-cmd",
        title: needsInput(c) ? "Fill in the rest, then send" : "Send it",
        onclick: () => needsInput(c) ? ctx3.fillBox(cmdStem(c) + " ") : ctx3.send(c)
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

  // extension/src/views/store.js
  var minsLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 6e4));
  var KIND = { reward: "\u{1F36C}", punish: "\u{1F53B}", silly: "\u{1F3AD}" };
  function storeTab(ctx3) {
    const s = ctx3.s, items = s.store || [], fx = s.fx || [], log2 = s.ribbonLog || [];
    const purse = card(
      title("\u{1F380} Your ribbons"),
      h("div", { style: { fontSize: "28px", fontWeight: "700", margin: "4px 0" } }, String(s.ribbons || 0)),
      s.quotaGrace ? chip("quota grace \xD7 " + s.quotaGrace, "good") : null,
      log2.length ? h("div", { style: { marginTop: "6px" } }, log2.map((e) => h("div", { class: "fhc-kv" }, h("span", null, e.why), h("b", null, (e.n > 0 ? "+" : "") + e.n)))) : null,
      muted("Earn 'em: your milk quota, a full stall session, chores, glory shifts, dares, shows, best of the week, and staff who think you've been good."),
      h("div", { style: { marginTop: "6px" } }, btn("This week's board", () => ctx3.send("ribbons top")))
    );
    const vat = s.vat ? card(
      title("\u{1F95B} Your vat"),
      h("div", { style: { fontSize: "20px", fontWeight: "700", margin: "4px 0" } }, s.vat >= 1e3 ? (s.vat / 1e3).toFixed(1) + " L" : s.vat + " ml"),
      muted("Everything milked and collected from you. It buys potions and shots at " + (s.vatPer || 500) + ' ml for each ribbon of the price: "Pay with milk" on the shelf.')
    ) : null;
    const now = fx.length ? card(
      title("\u{1F9EA} In you right now"),
      fx.map((f) => h("div", { class: "fhc-kv" }, h("span", null, f.name), h("b", null, minsLeft(f.until) + " min"))),
      muted("Your safeword pours every one of them out.")
    ) : null;
    const dare = s.dare ? card(
      title(s.dare.reckless ? "\u{1F3B2} A reckless dare" : "\u{1F3B2} Your dare"),
      h("p", null, s.dare.text),
      muted(minsLeft(s.dare.until) + " minutes left."),
      h("div", null, btn("I did it", () => ctx3.send("dared"), true), btn("Chicken out (1 ribbon)", () => ctx3.send("dare skip")))
    ) : null;
    const pen = s.penned ? card(title("\u{1F6A7} Corralled"), muted("At " + s.penned.at + " for " + minsLeft(s.penned.until) + " more minutes. Wander off and you'll be walked back.")) : null;
    const who = () => String(ctx3.ui.giftWho || "").trim();
    const row = (it) => h(
      "div",
      { class: "fhc-box", style: { padding: "8px", marginTop: "6px" } },
      h(
        "div",
        { class: "fhc-kv", style: { borderBottom: "none", padding: "0" } },
        h("b", null, (KIND[it.kind] ? KIND[it.kind] + " " : "") + it.name),
        chip(it.price + " \u{1F380}", (s.ribbons || 0) >= it.price ? "good" : "")
      ),
      muted(it.desc),
      it.id === "bounty" || it.id === "greeting" || it.id === "tag" || it.id === "dedicate" ? btn("Write it\u2026", () => ctx3.fillBox("buy " + it.id + " ")) : h(
        "div",
        null,
        btn("Buy", () => ctx3.send("buy " + it.id), true),
        s.vat && (it.kind || /^shot-/.test(it.id)) ? btn("Pay with milk", () => ctx3.send("buy " + it.id + " with milk")) : null,
        it.gift ? btn("Gift it", () => who() ? ctx3.send("buy " + it.id + " for " + who()) : ctx3.hint("Type who it's for in the box above the potions first.")) : null
      )
    );
    const shelf = (label, list) => list.length ? card(title(label), list.map(row)) : null;
    const potions = items.filter((it) => it.kind), shots = items.filter((it) => /^shot-/.test(it.id)), messes = items.filter((it) => it.shelf === "mess"), treats = items.filter((it) => !it.kind && !/^shot-/.test(it.id) && it.shelf !== "mess");
    const messWho = () => String(ctx3.ui.messWho || "").trim();
    const messRow = (it) => h(
      "div",
      { class: "fhc-box", style: { padding: "8px", marginTop: "6px" } },
      h("div", { class: "fhc-kv", style: { borderBottom: "none", padding: "0" } }, h("b", null, it.name), chip(it.price + " \u{1F380}", (s.ribbons || 0) >= it.price ? "good" : "")),
      muted(it.desc),
      h(
        "div",
        null,
        btn("On them", () => messWho() ? ctx3.send("buy " + it.id + " for " + messWho()) : ctx3.hint("Type who it's for in the box above the messes first."), true),
        btn("On me", () => ctx3.send("buy " + it.id))
      )
    );
    const messCard = messes.length ? card(
      title("\u{1F4A6} Messes"),
      muted(`Put a mess on somebody: they're asked first, unless they've said ?messes on. Their limits count. It shows on them with "Farm can mark my body" switched on, and ?wash cleans it off.`),
      h(
        "label",
        { class: "fhc-label" },
        "For (name or member number)",
        h("input", { class: "fhc-in", value: ctx3.ui.messWho || "", oninput: (e) => ctx3.setUi({ messWho: e.target.value }, true) })
      ),
      h("div", { style: { marginTop: "4px" } }, btn(s.messesOn ? "Messes on me: no askin' (switch off)" : "Let anybody mess me up without askin'", () => ctx3.send("messes " + (s.messesOn ? "off" : "on")))),
      messes.map(messRow)
    ) : null;
    return [
      purse,
      vat,
      now,
      dare,
      pen,
      messCard,
      shelf("\u{1F6CD}\uFE0F Treats and favors", treats),
      shelf("\u{1F489} Shots", shots),
      potions.length ? card(
        title("\u{1F9EA} Potions"),
        muted("Gifts always ask them first, and you only pay if they say yes. They need Potions switched on in their Toggles."),
        h(
          "label",
          { class: "fhc-label" },
          "Gift to (name or member number)",
          h("input", { class: "fhc-in", value: ctx3.ui.giftWho || "", oninput: (e) => ctx3.setUi({ giftWho: e.target.value }, true) })
        ),
        potions.map(row)
      ) : null
    ];
  }

  // extension/src/gearlore.js
  var GEAR_LORE = {
    "Pump Bung": "A fat black rubber bung, pushed in while the hose was still runnin' and swollen up behind your ring so it can't be squeezed out. Your belly's packed round and tight behind it and every step sets the lot sloshin'. You can feel it press on everything. It stays in till you've soaked up what you were given, so walk careful, and don't let anybody poke that belly unless you want to moan in front of them.",
    "Egg Post Plug": "The post didn't just lay in you, it corked you after. A thick ridged plug is seated right up against the clutch, each ridge holdin' you open a little wider than the last, so the eggs sit deep and warm and can't slip. When you clench, you clench on it. When the eggs shift, it shifts with them. It comes out when they've settled, and you'll gape for a while after.",
    "The Water's Grip": "Wet, heavy arms as thick as your wrist, wound round you from hand to elbow, every sucker kissin' your skin and holdin' on. They pull when you pull. They squeeze in time with whatever the rest of it is doin' between your legs, so you feel each thrust twice. You're not gettin' your hands back till it's finished.",
    "The Water's Embrace": "It has you round the middle as well: thick wet arms wound over your belly and ribs and up between your tits, squeezing slow, holding you up out of the water like something it caught. You can feel it breathe against you. Every squeeze pushes what it's put in you a little deeper.",
    "The Water's Coils": "Slick coils round both thighs, hauled wide and kept wide. They're warm, they're strong, and they flex like somethin' breathin'. Try to close your legs and they open you further and hold you there, drippin', spread for it like a mare in the stocks. It wants room to work, and it's made some.",
    "Slime Seal": "It left the tip of itself in you. A fat knot of livin' flesh is buried to the root, pulsin' slow, plugged tight against a womb it packed with eggs, and it's still leakin' somethin' warm that keeps you wet and soft and wantin'. You can feel it twitch when you walk. It lets go when the clutch has taken hold, and not one second before.",
    "Boar's Plug": "What a boar leaves so his work isn't wasted: a hard waxy plug thick as your wrist, set deep while he was still tied in you. Behind it there's more hog seed than you'd think a belly could hold, hot and heavy, and you can hear it when you move. You smell of him. Everybody who gets close knows exactly what happened to you and how long it took.",
    "Seed Pod Stem": "A length of green vine as thick as two fingers, cut off and left rooted in you, still weepin' sap. It's holdin' its seed pods right where it planted them, and every so often it tightens, like it's checkin' they're still there. The sap tingles. It's makin' you slick enough to take the next thing that finds you.",
    "Slime Sleeves": "Thick green slime from your fingertips to your shoulders, warm as a mouth and twice as clingy. It strings between your arm and your ribs when you lift it, and it sucks at anything you touch. Your hands are no use for anything fiddly, least of all gettin' yourself off, which is the idea.",
    "Slime Stockings": "Slime to the hip on both legs, oozin' down your thighs and pullin' at the floor with every step. It's inside you as well, a slow warm crawl that never quite stops movin'. Walkin' rubs it everywhere at once. Standin' still, you can feel it explorin'.",
    "Denial Clamp": "Cold steel locked over everything worth touchin', and it's not empty in there. Somethin' soft and wet laps at you, slow, then hums, then stops dead the instant your hips start to chase it. Over and over, right up to the edge and no further. You can rub the outside of it all you like. You're not cummin' till it opens.",
    "Growth Cups": "Two wide glass bells, pumped down hard, with your teats drawn up long and dark inside them where anybody can watch. The suction never lets up. You can feel them swellin', hot and tight, a deep ache that goes straight down between your legs. They come off when your tits are a size bigger, and they'll be tender as fresh bruises when they do.",
    "Trap Milker": "Steel cups latched on with a pull that means it, nipples stretched right down the glass, bein' milked in hard steady strokes whether you've anything left to give or not. You can hear it hit the bottle. You can't shake them off, and the more you squirm the better they seat.",
    "Winch Chain": "The chain that walked you across the yard on your tiptoes with everybody watchin', like a heifer bein' taken to the bull. It's still clipped to your collar and still warm from the winch. Whoever picks up the other end can take you anywhere they like.",
    "Feed Chute": "A wide rubber funnel strapped between your teeth, your throat held open, and warm sweet mash slidin' down whether you swallow or not. Your belly's goin' round and tight under it. You can't close your mouth, you can't say no, and you're droolin' round the rim like stock at the trough.",
    "Snare Rope": "Rough rope cinched round both wrists and hauled up over your head, stretchin' you out long and helpless. Your tits are lifted, your ribs are showin', and there's not a thing you can cover. The little machine it brought with it knows it.",
    "Snare Hobble": "Rope round each ankle, pullin' your feet wide apart and keepin' them there. Everything between your legs is open to the air and to anybody passin', and you can't reach it yourself. You can feel yourself drippin' onto the dirt.",
    "Breedin' Frame Cuffs": "Padded steel on both wrists, locked to the frame: bent over, hips up, back arched, held still the way a mare's held for the stud. You can rock an inch. That's all it gives you, and it's just enough to push back onto what's comin'.",
    "Kennel Lead": "A short lead clipped to the ring at the back of the kennel. Long enough for all fours, long enough to get your ass up. Not long enough to reach the door. You'll be let out when he's finished trainin' you.",
    "Pack's Knot": "The last wolf's knot, swollen fat as a fist behind your ring and throbbin', lockin' in a bellyful of the whole pack's seed. You're tied. Pull and it only hurts sweet; hold still and you can feel it pulse, pumpin' the last of him into you. It goes down when it goes down.",
    "Stud's Stopper": "A stable hand's rubber stopper, shoved up you the moment the stallion dragged himself out, so a mare's worth of horse cum stays where he put it. You're so full of him your belly's pushed out, and every step you can feel it roll. Pull that stopper and you'd flood the yard.",
    "Pillory Spreader": "A steel bar ratcheted between your ankles so your legs can't close. Bent in the pillory with your ass in the air, that leaves both holes on show and on offer. Whoever walks up gets their pick, and you get to guess who it was.",
    "Parasite Lips": "Fat, wet, livin' lips sealed over your own, and a tentacle down your throat that you stopped gaggin' on a while ago. It feeds you its brew in slow warm pulses, and it swallows every load you suck out of anybody before you taste a drop. Your mouth is a hole it uses to eat. You'd let it, too. That's the serum talkin', and it's very persuasive.",
    "Parasite Suckers": "Two soft pink mouths latched over your teats, suckin' in long greedy pulls. They drink every drop of milk you make and push somethin' hotter back in, and your tits are swellin' with it. Try to pull one off and it only latches deeper and sucks harder.",
    "Parasite Belt": "A band of hot livin' flesh sealed round your hips, with a thick root of itself throbbin' in each hole. It drinks every load you're given, it pumps its own brew back up into you, and it never stops movin'. It's decided what your body's for, and it's makin' the changes itself.",
    "Parasite Root": "The thing has rooted in you: a thick, pulsin' length of itself seated deep and feedin'. It swells when you're filled and it squeezes when it's hungry, and right now you can't tell which of you is the one that wants bred.",
    "Brood Sac": "The Breeder has wrapped your belly in a warm web of itself, cradlin' it from underneath like two hands. It takes the weight of what's been put in you, and it squeezes, slow, whenever anything in there moves. It's proud of that belly. It means to make it bigger.",
    "Grower's Sheath": "A livin' violet sleeve has swallowed your cock and balls whole and it's kneadin' them, root to tip, without ever lettin' you finish. Every so often it loosens to let you look, and every time there's more of you than there was. It won't come off till it's done growin' you.",
    "Glutton's Sleeve": "A wet golden throat is closed over your cock right down to the root, swallowin' in slow, patient waves. At every feed it milks you dry and drinks all of it, then doses you so there's more next time. Your balls ache, and they're fillin' again already.",
    "Tyrant's Cage": "A tight dark sheath is locked down over your cock, too small to get hard in, with one wet tongue of itself lickin' at the tip. It takes you right to the edge and eats what comes next. Your balls just get heavier. You don't cum till it's gone.",
    "Tyrant's Web": "Dark livin' cords are drawn tight over all of you, wrist to hip to throat. It moves you where it wants you and holds you dead still when it's teasin'. Every quarter hour it works every part of you at once, right to the top, and then lets go of everything.",
    "Growin' Plug": "It seemed a sensible size goin' in. It isn't any more. Every ten minutes it swells a little fatter inside you, slow and patient, stretchin' your ring a hair past what you thought you could take, and it will not come out till it's done growin'. Walk and it rocks. Sit and it goes deeper.",
    "Hungry Belt": "A pretty filigree belt that locked itself the second it touched your skin. It hums against everything it covers, never quite enough, and every time you get close it drinks the orgasm right out of you before it can start. You're soaked under it and it's lovin' that.",
    "Milkmaid's Cups": "Two silver cups that latched on by themselves and began to pull. Your udders are fillin' twice as fast to keep up with them, hot and heavy and achin', and the cups only want more. You can feel the milk let down every time they squeeze.",
    "Glutton's Funnel": "A gilded funnel that strapped itself between your teeth. Every ten minutes it pours another warm, thick helpin' straight down your throat whether there's room or not, and your belly rounds a little further. There's no closin' your mouth and no turnin' your head.",
    "The Hobble": "Two dainty cuffs joined by a hand's length of chain. They looked like anklets in the box. Now every step is a tiny swayin' shuffle with your thighs rubbin' together, and you won't be outrunnin' anything on this farm.",
    "Living Suit (legs)": "Glossy black livin' latex, grown up both your legs to the hip, warm as skin and a good deal tighter. It ripples when you walk and strokes the backs of your knees when you stand still. It's still spreadin'. You can feel the edge of it creepin' higher.",
    "Living Suit (hips)": "It's closed over your hips and everything between in one seamless black skin, with a soft thick root of itself pushed up inside you. It squeezes when you get close and holds you right there, pantin', and it will not let you over. It's feedin' on how bad you want it.",
    "Living Suit (chest)": "Livin' latex moulded over both your tits, kneadin' them in slow waves, with a wet little mouth of itself sealed on each nipple. It suckles when you breathe in. It's learnin' what makes you whine.",
    "Living Suit (arms)": "It's run down both your arms and webbed your fingers together. Your hands are its hands now. It'll let you hold a rail. It won't let you touch yourself, and it moves them where it pleases.",
    "Living Suit (mouth)": "The last of it: a smooth black sheath over your face from the nose down, and a tongue of itself in your mouth, fillin' it. Every inch of you is inside it now. It walks you where it likes, and you go."
  };
  var gearLore = (name) => GEAR_LORE[name] || "";

  // extension/src/localsave.js
  var W = window;
  var MINE = /^(fhc-|farmhand-)/;
  var S = { db: null, dir: null, perm: "none", at: 0, last: "", err: "" };
  var onChange = () => {
  };
  function db() {
    if (S.db) return S.db;
    S.db = new Promise((ok2, no) => {
      try {
        const rq = W.indexedDB.open("farmhand-companion", 1);
        rq.onupgradeneeded = () => {
          try {
            rq.result.createObjectStore("kv");
          } catch (e) {
          }
        };
        rq.onsuccess = () => ok2(rq.result);
        rq.onerror = () => no(rq.error);
      } catch (e) {
        no(e);
      }
    });
    S.db.catch(() => {
      S.db = null;
    });
    return S.db;
  }
  async function get(k) {
    const d = await db();
    return new Promise((ok2, no) => {
      const rq = d.transaction("kv").objectStore("kv").get(k);
      rq.onsuccess = () => ok2(rq.result);
      rq.onerror = () => no(rq.error);
    });
  }
  async function put(k, v) {
    const d = await db();
    return new Promise((ok2, no) => {
      const tx = d.transaction("kv", "readwrite");
      tx.objectStore("kv").put(v, k);
      tx.oncomplete = () => ok2(true);
      tx.onerror = () => no(tx.error);
    });
  }
  var me = () => W.Player && W.Player.MemberNumber || 0;
  var fileName = () => "farmhand-companion-" + (me() || "player") + ".json";
  function snapshot(version) {
    const data = {};
    try {
      for (let i = 0; i < W.localStorage.length; i++) {
        const k = W.localStorage.key(i);
        if (k && MINE.test(k)) data[k] = W.localStorage.getItem(k);
      }
    } catch (e) {
    }
    return { kind: "farmhand-companion", v: 1, member: me(), version, data };
  }
  async function writeNow(version, force) {
    if (!S.dir || S.perm !== "granted" || !me()) return;
    const snap2 = snapshot(version), body2 = JSON.stringify(snap2.data);
    if (!force && body2 === S.last) return;
    const errWas = S.err;
    try {
      const fh = await S.dir.getFileHandle(fileName(), { create: true }), w = await fh.createWritable();
      await w.write(JSON.stringify(Object.assign(snap2, { savedAt: (/* @__PURE__ */ new Date()).toISOString() }), null, 1));
      await w.close();
      S.last = body2;
      S.at = Date.now();
      S.err = "";
    } catch (e) {
      S.err = String(e && e.message || e);
      if (/permission|not allowed/i.test(S.err)) S.perm = "prompt";
    }
    if (force || S.err !== errWas) onChange();
  }
  function localSaveState() {
    return { can: typeof W.showDirectoryPicker === "function", folder: S.dir ? S.dir.name : "", perm: S.perm, at: S.at, err: S.err, file: fileName() };
  }
  async function localSavePick(version) {
    try {
      const d = await W.showDirectoryPicker({ id: "bnb-farm", mode: "readwrite" });
      S.dir = d;
      S.perm = "granted";
      await put("dir", d);
      await writeNow(version, true);
    } catch (e) {
      if (!/abort/i.test(String(e && e.name))) S.err = String(e && e.message || e);
    }
    onChange();
  }
  async function localSaveReconnect(version) {
    try {
      S.perm = await S.dir.requestPermission({ mode: "readwrite" });
      if (S.perm === "granted") await writeNow(version, true);
    } catch (e) {
      S.err = String(e && e.message || e);
    }
    onChange();
  }
  function localSaveNow(version) {
    return writeNow(version, true);
  }
  function localSaveLoad(say) {
    const inp = W.document.createElement("input");
    inp.type = "file";
    inp.accept = ".json,application/json";
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      f.text().then((t) => {
        let d = null;
        try {
          d = JSON.parse(t);
        } catch (e) {
        }
        if (!d || d.kind !== "farmhand-companion" || !d.data || typeof d.data !== "object") {
          say && say("That file isn't a Farmhand Companion save.");
          return;
        }
        const keys = Object.keys(d.data).filter((k) => MINE.test(k) && typeof d.data[k] === "string");
        if (!W.confirm("Load these settings?\n\n" + f.name + (d.savedAt ? "\nsaved " + new Date(d.savedAt).toLocaleString() : "") + "\n" + keys.length + " things in it.\n\nWhat this browser has now is replaced, and the page reloads.")) return;
        try {
          for (let i = W.localStorage.length - 1; i >= 0; i--) {
            const k = W.localStorage.key(i);
            if (k && MINE.test(k) && !(k in d.data)) W.localStorage.removeItem(k);
          }
          for (const k of keys) W.localStorage.setItem(k, d.data[k]);
        } catch (e) {
          say && say("Couldn't load it: " + (e && e.message || e));
          return;
        }
        W.location.reload();
      });
    };
    inp.click();
  }
  function initLocalSave(version, changed) {
    if (typeof changed === "function") onChange = changed;
    get("dir").then(async (d) => {
      if (!d) return;
      S.dir = d;
      try {
        S.perm = await d.queryPermission({ mode: "readwrite" });
      } catch (e) {
        S.perm = "prompt";
      }
      onChange();
      if (S.perm === "granted") writeNow(version, true);
    }).catch(() => {
    });
    setInterval(() => {
      writeNow(version, false);
    }, 6e4);
  }

  // studio/web/breasts-drawing.js
  (() => {
    const NATIVE = ["FlatSmall", "FlatMedium", "Small", "Normal", "Large", "XLarge"];
    const CUPS = ["Flat", "AA", "A", "B", "C", "D", "DD", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"];
    const DRAWN_FROM = NATIVE.length;
    const ROOT_Y = 284;
    const clamp2 = (v) => Math.max(0, Math.min(255, Math.round(v)));
    const rgb2 = (c, k) => "rgb(" + clamp2(c[0] * k) + "," + clamp2(c[1] * k) + "," + clamp2(c[2] * k) + ")";
    function shape(cup, adj) {
      const a = adj || {}, i = Math.max(0, cup - DRAWN_FROM), n = CUPS.length - 1 - DRAWN_FROM;
      const k = i / n, hang = a.hang == null ? 1 : a.hang, full = a.full == null ? 1 : a.full, apart = a.apart == null ? 1 : a.apart;
      const r = (44 + 2.6 * i) * full;
      const sag = (0.06 + 0.22 * k) * hang;
      const top = 1.34 + 0.16 * k * hang;
      const bx = (r * (1.03 - 0.13 * k) + 5 * (1 - k)) * apart;
      const by = r * top;
      return { cup, i, k, r, sag, top, bx, by };
    }
    const GAME = { dx: 42, cy: 330, ro: 34, rv: 42, y1: 252, y2: 289, y3: 398 };
    const heldScale = (S3) => S3.r / 41;
    function heldY(y, sc) {
      if (y <= GAME.y1) return y;
      const top = GAME.y1 + (GAME.y2 - GAME.y1) * (1 + sc) / 2;
      if (y >= GAME.y2) return top + (y - GAME.y2) * sc;
      const t = (y - GAME.y1) / (GAME.y2 - GAME.y1);
      return GAME.y1 + (GAME.y2 - GAME.y1) * (t + (sc - 1) * (t * t * t - t * t * t * t / 2));
    }
    function held(S3) {
      const sc = heldScale(S3);
      return Object.assign({}, S3, { held: true, sc, bx: GAME.dx * sc, by: heldY(GAME.cy, sc) - ROOT_Y, ro: GAME.ro * sc, ri: GAME.dx * sc, rv: GAME.rv * sc, r: GAME.rv * sc, sag: 0, top: 1 });
    }
    function point(S3, s, t) {
      const sn = Math.sin(t), cs = Math.cos(t);
      if (S3.held) return [s * S3.bx + (s * cs > 0 ? S3.ro : S3.ri) * cs, S3.by + S3.rv * sn];
      if (sn >= 0) return [s * S3.bx + S3.r * cs * (1 + S3.sag * 0.3 * sn * sn) + s * S3.r * 0.06 * S3.k * sn * sn, S3.by + S3.r * sn * (1 + S3.sag)];
      const up = -sn;
      return [s * S3.bx + S3.r * cs * (1 - 0.5 * up * up) - s * S3.r * 0.2 * up * up, S3.by - S3.r * S3.top * up];
    }
    function path(g, S3, s, from, to, ox, oy) {
      const steps = 80;
      for (let j = 0; j <= steps; j++) {
        const p = point(S3, s, from + (to - from) * j / steps);
        if (j) g.lineTo(ox + p[0], oy + p[1]);
        else g.moveTo(ox + p[0], oy + p[1]);
      }
    }
    function nipples(S3) {
      if (S3.held) {
        const hx = S3.bx + 4 * S3.sc, hy = S3.by - 0.43 * S3.rv;
        return [[-hx, hy], [hx, hy]];
      }
      const x = S3.bx + S3.r * (0.02 + 0.2 * S3.k), y = S3.by + S3.r * (-0.15 + 0.42 * S3.k);
      return [[-x, y], [x, y]];
    }
    function canvas(S3, skin) {
      const pad = 8, half = S3.bx + S3.r * (1 + S3.sag * 0.35) + pad, up = Math.max(0, S3.r * S3.top - S3.by) + pad, down = S3.by + S3.r * (1 + S3.sag) + pad + 10;
      const out = document.createElement("canvas");
      out.width = Math.ceil(Math.max(half, 110) * 2);
      out.height = Math.ceil(up + Math.max(down, 110));
      const cv = document.createElement("canvas");
      cv.width = out.width;
      cv.height = out.height;
      const g = cv.getContext("2d"), ox = out.width / 2, oy = up;
      cv.ax = ox;
      cv.ay = oy;
      cv.nips = nipples(S3);
      const side = (s, draw2) => {
        g.save();
        g.beginPath();
        if (s < 0) g.rect(0, 0, ox, cv.height);
        else g.rect(ox, 0, cv.width - ox, cv.height);
        g.clip();
        draw2();
        g.restore();
      };
      const whole = (s) => {
        g.beginPath();
        path(g, S3, s, 0, Math.PI * 2, ox, oy);
        g.closePath();
      };
      for (const s of [-1, 1]) side(s, () => {
        g.save();
        g.translate(0, 5 + S3.r * 0.04);
        g.filter = "blur(4px)";
        g.fillStyle = "rgba(120,60,50,0.22)";
        whole(s);
        g.fill();
        g.restore();
      });
      for (const s of [-1, 1]) side(s, () => {
        const cx = ox + s * S3.bx, low = oy + S3.by + S3.r * 0.25;
        const grad = g.createRadialGradient(cx - S3.r * 0.25, low - S3.r * 0.5, S3.r * 0.1, cx, low, S3.r * 1.25);
        grad.addColorStop(0, rgb2(skin, 1.03));
        grad.addColorStop(0.55, rgb2(skin, 1));
        grad.addColorStop(1, rgb2([skin[0], skin[1] * 0.93, skin[2] * 0.92], 0.94));
        g.fillStyle = grad;
        whole(s);
        g.fill();
        g.save();
        whole(s);
        g.clip();
        const under = g.createLinearGradient(0, low + S3.r * 0.2, 0, oy + S3.by + S3.r * (1 + S3.sag));
        under.addColorStop(0, "rgba(150,70,60,0)");
        under.addColorStop(1, "rgba(150,70,60,0.24)");
        g.fillStyle = under;
        g.fillRect(0, 0, cv.width, cv.height);
        const cl = g.createLinearGradient(ox, 0, ox + s * S3.r * 0.3, 0);
        cl.addColorStop(0, "rgba(150,70,60,0.20)");
        cl.addColorStop(1, "rgba(150,70,60,0)");
        g.fillStyle = cl;
        g.fillRect(0, oy + S3.by - S3.r * 0.6, cv.width, cv.height);
        g.translate(cx - S3.r * 0.38, low - S3.r * 0.42);
        g.rotate(-0.25);
        const sh = g.createRadialGradient(0, 0, 0, 0, 0, S3.r * 0.34);
        sh.addColorStop(0, "rgba(255,255,255,0.8)");
        sh.addColorStop(0.5, "rgba(255,255,255,0.3)");
        sh.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = sh;
        g.scale(0.36, 1);
        g.beginPath();
        g.arc(0, 0, S3.r * 0.34, 0, Math.PI * 2);
        g.fill();
        g.restore();
      });
      g.globalCompositeOperation = "destination-out";
      {
        const topY = oy + S3.by - S3.r * S3.top, fx = Math.min(S3.bx * 1.15, 72), fy = S3.r * S3.top * 0.95;
        g.save();
        g.translate(ox, topY);
        g.scale(1, fy / fx);
        const fade = g.createRadialGradient(0, 0, fx * 0.45, 0, 0, fx);
        fade.addColorStop(0, "rgba(0,0,0,1)");
        fade.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = fade;
        g.beginPath();
        g.arc(0, 0, fx, 0, Math.PI * 2);
        g.fill();
        g.restore();
      }
      g.globalCompositeOperation = "source-over";
      g.strokeStyle = rgb2(skin, 0.28);
      g.lineCap = "round";
      g.lineJoin = "round";
      for (const s of [-1, 1]) side(s, () => {
        const hi = (0.22 + 0.16 * S3.k) * Math.PI, outer = s > 0 ? [-hi, Math.PI * 1.02] : [Math.PI + hi, -0.02 * Math.PI];
        g.lineWidth = 1.5;
        g.beginPath();
        path(g, S3, s, outer[0], outer[1], ox, oy);
        g.stroke();
        g.lineWidth = 2.2;
        g.beginPath();
        path(g, S3, s, Math.PI * 0.15, Math.PI * 0.85, ox, oy);
        g.stroke();
      });
      let y0 = Infinity, y1 = -Infinity;
      for (let t = 0; t < Math.PI * 2; t += 0.02) {
        const p = point(S3, 1, t);
        if (p[0] <= 0) {
          y0 = Math.min(y0, p[1]);
          y1 = Math.max(y1, p[1]);
        }
      }
      if (S3.held) {
        y0 = S3.by - S3.rv * 0.2;
        y1 = S3.by + S3.rv * 0.72;
      }
      if (y1 > y0) {
        const a = Math.max(y0, S3.by - S3.r * 0.45), lg = g.createLinearGradient(0, oy + a, 0, oy + y1);
        lg.addColorStop(0, "rgba(0,0,0,0)");
        lg.addColorStop(0.35, rgb2(skin, 0.28));
        lg.addColorStop(1, rgb2(skin, 0.28));
        g.strokeStyle = lg;
        g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(ox, oy + a);
        g.lineTo(ox, oy + y1);
        g.stroke();
      }
      const og = out.getContext("2d");
      og.save();
      og.translate(ox, oy + 46);
      og.scale(1, 0.66);
      const patch = og.createRadialGradient(0, 0, 62, 0, 0, 80);
      patch.addColorStop(0, rgb2(skin, 1));
      patch.addColorStop(1, "rgba(" + clamp2(skin[0]) + "," + clamp2(skin[1]) + "," + clamp2(skin[2]) + ",0)");
      og.fillStyle = patch;
      og.beginPath();
      og.arc(0, 0, 80, 0, Math.PI * 2);
      og.fill();
      og.restore();
      og.fillStyle = rgb2(skin, 1);
      for (const s of [-1, 1]) {
        og.beginPath();
        og.ellipse(ox + s * 70, oy + 6, 6, 13, 0, 0, Math.PI * 2);
        og.fill();
      }
      og.drawImage(cv, 0, 0);
      out.ax = cv.ax;
      out.ay = cv.ay;
      out.nips = cv.nips;
      const mask = document.createElement("canvas");
      mask.width = out.width;
      mask.height = out.height;
      const mg = mask.getContext("2d");
      mg.fillStyle = "#000";
      for (const s of [-1, 1]) {
        mg.beginPath();
        path(mg, S3, s, 0, Math.PI * 2, ox, oy);
        mg.closePath();
        mg.fill();
      }
      out.mask = mask;
      return out;
    }
    const GAME_ALLFOURS = { dx: 33, cy: 288, ro: 22, rv: 25, y1: 236, y2: 262, y3: 318 }, GROUND = 398;
    function fitOf(S3, pose, nip) {
      if (pose === "AllFours") {
        const G2 = GAME_ALLFOURS, ro2 = S3.r * (1 + S3.sag * 0.3), rv2 = S3.r * (1 + S3.sag), kx2 = (S3.bx + ro2) / (G2.dx + G2.ro);
        const bottom = Math.min(GROUND, ROOT_Y + S3.by + rv2), top2 = Math.max(G2.y1 + 4, Math.min(bottom - 40, ROOT_Y + S3.by - S3.r * S3.top * 0.8)), ky2 = (bottom - top2) / (G2.cy + G2.rv - G2.y2);
        return { G: G2, gi: G2.dx - G2.ro, go: G2.dx + G2.ro, ti: Math.max(0, S3.bx - S3.r), to: S3.bx + ro2, kx: kx2, ro: ro2, ri: Math.min(S3.r, S3.bx), rv: rv2, mapY: (y) => y <= G2.y1 ? y : y >= G2.y2 ? top2 + (y - G2.y2) * ky2 : G2.y1 + (top2 - G2.y1) * (y - G2.y1) / (G2.y2 - G2.y1) };
      }
      if (S3.held) return { kx: S3.sc, ro: S3.ro, ri: S3.ri, rv: S3.rv, mapY: (y) => heldY(y, S3.sc) };
      const ro = S3.r * (1 + S3.sag * 0.3), rv = S3.r * (1 + S3.sag), kx = (S3.bx + ro) / (GAME.dx + GAME.ro), ky = rv / GAME.rv;
      const cy = ROOT_Y + S3.by, top = Math.max(GAME.y1 + 4, cy - (GAME.cy - GAME.y2) * ky);
      const gnx = GAME.dx + 4, gny = GAME.cy - 0.43 * GAME.rv, pn = nipples(S3)[1], tnx = nip ? nip[0] : pn[0], tny = ROOT_Y + (nip ? nip[1] : pn[1]), bot = cy + rv, gbot = GAME.cy + GAME.rv;
      const okY = tny > top + 6 && tny < bot - 6;
      const mapY = (y) => y <= GAME.y1 ? y : y >= GAME.y2 ? top + (y - GAME.y2) * ky : GAME.y1 + (top - GAME.y1) * (y - GAME.y1) / (GAME.y2 - GAME.y1);
      const mapYN = (y) => {
        if (y <= GAME.y1) return y;
        if (y < GAME.y2) return GAME.y1 + (top - GAME.y1) * (y - GAME.y1) / (GAME.y2 - GAME.y1);
        if (!okY) return top + (y - GAME.y2) * ky;
        if (y <= gny) return top + (y - GAME.y2) * (tny - top) / (gny - GAME.y2);
        return tny + (y - gny) * (bot - tny) / (gbot - gny);
      };
      const ti = Math.max(0, S3.bx - S3.r), to = S3.bx + ro;
      return { gi: 0, go: GAME.dx + GAME.ro, gn: gnx, tn: tnx > ti + 6 && tnx < to - 6 ? tnx : null, ti, to, kx, ro, ri: Math.min(S3.r, S3.bx), rv, mapY, mapYN };
    }
    window.FarmBreasts = { fitOf, NATIVE, CUPS, DRAWN_FROM, ROOT_Y, GAME, shape, held, heldY, point, nipples, canvas };
  })();

  // studio/web/body-engine.js
  (() => {
    window.FarmBodyEngine = function(host) {
      "use strict";
      const S3 = host.S;
      const bodyItem = (g) => host.bodyItem(g);
      const setBody = (g, n) => host.setBody(g, n);
      const bellyDraw = () => {
        try {
          host.redraw();
        } catch (e) {
          console.warn("[body] redraw:", e);
        }
      };
      const FIT0 = () => ({ on: false, rx: 70, ry: 80, sag: 0.22, x: 0, y: 0, behind: false, flat: false, cut: 0.74 });
      const BELLY = { fits: { std: FIT0(), AllFours: Object.assign(FIT0(), { behind: true, y: -60 }), Hogtied: Object.assign(FIT0(), { behind: true, y: -75 }) }, skin: /* @__PURE__ */ new Map() };
      const poseKey = () => {
        const m = S3.C && S3.C.PoseMapping || {};
        const all = Object.values(m).concat(S3.C && S3.C.Pose || []);
        return all.includes("AllFours") ? "AllFours" : all.includes("Hogtied") ? "Hogtied" : "std";
      };
      const fitNow = () => BELLY.fits[poseKey()];
      function bellySkin(src, hex, pose) {
        const key = src + "|" + (hex || ""), v = BELLY.skin.get(key);
        if (Array.isArray(v)) return v;
        const guess = /_Black\./.test(src) ? FarmBelly.FALLBACK.Black : /_Asian\./.test(src) ? FarmBelly.FALLBACK.Asian : FarmBelly.FALLBACK.White;
        if (!v) {
          BELLY.skin.set(key, "loading");
          const img2 = new Image();
          img2.onload = () => {
            let c = guess;
            try {
              const at = FarmBelly.skinPatch(pose), cv = document.createElement("canvas");
              cv.width = 48;
              cv.height = 40;
              const g = cv.getContext("2d");
              g.drawImage(img2, -at[0], -at[1]);
              const d = g.getImageData(0, 0, 48, 40).data, good = [];
              for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && d[i] + d[i + 1] + d[i + 2] > 90 && Math.min(d[i], d[i + 1], d[i + 2]) < 238) good.push([d[i], d[i + 1], d[i + 2]]);
              if (good.length >= 40) {
                good.sort((m, n) => m[0] + m[1] + m[2] - (n[0] + n[1] + n[2]));
                const p = good[Math.floor(good.length * 0.7)];
                c = hex ? [1, 3, 5].map((i) => Math.min(255, parseInt(hex.slice(i, i + 2), 16) * (p[0] + p[1] + p[2]) / 383)) : p;
              }
            } catch (e) {
            }
            BELLY.skin.set(key, c);
            bellyDraw();
          };
          img2.onerror = () => BELLY.skin.set(key, guess);
          img2.src = src;
        }
        return guess;
      }
      const MOULD = { ver: 0, lies: /* @__PURE__ */ new Set(), span: /* @__PURE__ */ new Map(), cover: /* @__PURE__ */ new Map(), items: /* @__PURE__ */ new Set(), mode: /* @__PURE__ */ new Map(), ext: /* @__PURE__ */ new Map(), img: /* @__PURE__ */ new Map(), prof: /* @__PURE__ */ new Map(), out: /* @__PURE__ */ new Map(), M: 150 };
      const mouldKey = (it) => it.Asset.Group.Name + "/" + it.Asset.Name;
      const W10 = window;
      const takesDrawings = () => typeof W10.GLDrawLoadTransient === "function";
      const mapSrc = host.mapSrc || ((src) => {
        if (typeof W10.DrawGetImage !== "function") return src;
        const lists = [typeof DrawCacheImage !== "undefined" ? DrawCacheImage : W10.DrawCacheImage, W10.DrawImageCache].filter((c) => c && typeof c.get === "function");
        if (!lists.length) return src;
        let seen2 = null;
        const kept = lists.map((c) => [c, Object.prototype.hasOwnProperty.call(c, "get"), c.get]);
        try {
          for (const [c] of kept) c.get = function(k) {
            if (seen2 == null) seen2 = k;
            return { isLoaded: () => false, data: void 0, complete: false };
          };
          W10.DrawGetImage(src);
        } catch (e) {
        } finally {
          for (const [c, own, g] of kept) {
            if (own) c.get = g;
            else delete c.get;
          }
        }
        return typeof seen2 === "string" && seen2 ? seen2 : src;
      });
      function mouldImg(src) {
        let e = MOULD.img.get(src);
        if (!e) {
          e = { img: new Image(), ok: false };
          e.img.onload = () => {
            e.ok = true;
            clearTimeout(MOULD.t);
            MOULD.t = setTimeout(bellyDraw, 60);
          };
          e.img.onerror = () => {
            if (!e.retried) {
              e.retried = true;
              let url = src;
              try {
                url = mapSrc(src) || src;
              } catch (er) {
                url = src;
              }
              if (url !== src) {
                e.img.crossOrigin = "anonymous";
                e.img.src = url;
                return;
              }
            }
            e.bad = true;
          };
          e.img.src = src;
          MOULD.img.set(src, e);
        }
        return e.ok ? e.img : null;
      }
      function edges(source, w, h2) {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h2;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(source, 0, 0);
        const d = g.getImageData(0, 0, w, h2).data, L = new Int16Array(h2).fill(-1), R = new Int16Array(h2).fill(-1);
        for (let y = 0; y < h2; y++) {
          let l = -1, r = -1;
          const o = y * w * 4;
          for (let x = 0; x < w; x++) if (d[o + x * 4 + 3] > 60) {
            if (l < 0) l = x;
            r = x;
          }
          L[y] = l;
          R[y] = r;
        }
        return { L, R, w, h: h2 };
      }
      function edgesOf(src) {
        let p = MOULD.prof.get(src);
        if (p) return p;
        const im = mouldImg(src);
        if (!im) return null;
        p = edges(im, im.naturalWidth, im.naturalHeight);
        MOULD.prof.set(src, p);
        return p;
      }
      function outline(ctx3) {
        const parts = [];
        for (const b of ctx3.bodies) {
          const p = edgesOf(b.src);
          if (!p) return null;
          parts.push({ p, x: b.x, y: b.y });
        }
        const bp = ctx3.belly.prof || (ctx3.belly.prof = edges(ctx3.belly.cv, ctx3.belly.cv.width, ctx3.belly.cv.height));
        const row = (yy, withBelly) => {
          let l = Infinity, r = -Infinity;
          for (const q2 of parts) {
            const j = yy - Math.round(q2.y);
            if (j >= 0 && j < q2.p.h && q2.p.L[j] >= 0) {
              l = Math.min(l, q2.x + q2.p.L[j]);
              r = Math.max(r, q2.x + q2.p.R[j]);
            }
          }
          if (l === Infinity) return null;
          if (withBelly) {
            const j = yy - Math.round(ctx3.belly.dy);
            if (j >= 0 && j < bp.h && bp.L[j] >= 0) {
              l = Math.min(l, ctx3.belly.dx + bp.L[j]);
              r = Math.max(r, ctx3.belly.dx + bp.R[j]);
            }
          }
          return { l, r };
        };
        return { old: (yy) => row(yy, false), neu: (yy) => row(yy, true) };
      }
      function bellyCover(src, x, y, ctx3) {
        const im = mouldImg(src);
        if (!im) return 0;
        const b = ctx3.belly, key = "bc|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + Math.round(b.dx) + "," + Math.round(b.dy) + "," + b.cv.width + "," + b.cv.height;
        let v = MOULD.cover.get(key);
        if (v != null) return v;
        const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
        c.width = w;
        c.height = h2;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, w, h2).data, cx = b.dx + b.cv.width / 2 - x, cy = b.dy + b.cv.height / 2 - y, rx = b.cv.width * 0.3, ry = b.cv.height * 0.3;
        let hit = 0, all = 0;
        for (let j = -ry; j <= ry; j += 3) for (let i = -rx; i <= rx; i += 3) {
          if (i / rx * (i / rx) + j / ry * (j / ry) > 1) continue;
          all++;
          const px = Math.round(cx + i), py = Math.round(cy + j);
          if (px >= 0 && py >= 0 && px < w && py < h2 && d[(py * w + px) * 4 + 3] > 60) hit++;
        }
        v = all ? hit / all : 0;
        if (MOULD.cover.size > 400) MOULD.cover.clear();
        MOULD.cover.set(key, v);
        return v;
      }
      function bellyAuto(src, x, y, ctx3, behind, pieceKey) {
        if (!ctx3.belly || behind || BELLY.auto === false || typeof src !== "string") return null;
        const m0 = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/").exec(src);
        if (!m0) return false;
        if (m0[1] !== "Panties" && !chestSlot(m0[1])) return false;
        if (m0[1] === "Panties") return mouldCanvas(src, x, y, ctx3, "under|" + (pieceKey || src), "under");
        const pk = pieceKey || src;
        if (bellyCover(src, x, y, ctx3) >= 0.15) MOULD.lies.add(pk);
        if (!MOULD.lies.has(pk)) return false;
        return mouldCanvas(src, x, y, ctx3, "auto|" + (pieceKey || src), "auto");
      }
      function pieceSpan(pk, src, x, y) {
        const span = MOULD.span.get("p|" + pk) || { L: new Float32Array(2600).fill(1e9), R: new Float32Array(2600).fill(-1e9), v: 0, bottom: -1 };
        MOULD.span.set("p|" + pk, span);
        const p0 = edgesOf(src);
        let grew = false;
        if (p0) for (let j = 0; j < p0.h; j++) {
          const yy = Math.round(y) + j;
          if (p0.L[j] < 0 || yy < 0 || yy >= 2600) continue;
          if (x + p0.L[j] < span.L[yy]) {
            span.L[yy] = x + p0.L[j];
            grew = true;
          }
          if (x + p0.R[j] > span.R[yy]) {
            span.R[yy] = x + p0.R[j];
            grew = true;
          }
          if (yy > span.bottom) {
            span.bottom = yy;
            grew = true;
          }
        }
        if (grew) {
          span.v++;
          MOULD.ver++;
          clearTimeout(MOULD.t);
          MOULD.t = setTimeout(bellyDraw, 60);
        }
        return span;
      }
      function bellyForm(cv) {
        if (cv.formF !== void 0) return cv.formF;
        const w = cv.width, h2 = cv.height;
        let d;
        try {
          d = cv.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h2).data;
        } catch (e) {
          return cv.formF = null;
        }
        const lum = (i) => d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11, ls = [];
        for (let i = 0; i < d.length; i += 4 * 5) if (d[i + 3] > 250) ls.push(lum(i));
        if (ls.length < 50) return cv.formF = null;
        ls.sort((p, q2) => p - q2);
        const med = ls[Math.floor(ls.length * 0.6)] || 1;
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h2;
        const g = c.getContext("2d", { willReadFrequently: true }), im = g.createImageData(w, h2);
        for (let i = 0; i < d.length; i += 4) {
          const a = d[i + 3] / 255, fr = Math.max(0.62, Math.min(1.1, lum(i) / med)), v = 1 + (fr - 1) * a;
          im.data[i] = im.data[i + 1] = im.data[i + 2] = Math.round(v * 200);
          im.data[i + 3] = 255;
        }
        g.putImageData(im, 0, 0);
        const c2 = document.createElement("canvas");
        c2.width = w;
        c2.height = h2;
        const g2 = c2.getContext("2d", { willReadFrequently: true });
        g2.fillStyle = "rgb(200,200,200)";
        g2.fillRect(0, 0, w, h2);
        g2.filter = "blur(1.2px)";
        g2.drawImage(c, 0, 0);
        g2.filter = "none";
        const dd = g2.getImageData(0, 0, w, h2).data, F = new Float32Array(w * h2);
        for (let i = 0, j = 0; j < F.length; i += 4, j++) F[j] = dd[i] / 200;
        return cv.formF = { F, w, h: h2 };
      }
      const underSeen = /* @__PURE__ */ new Map();
      function gameUnder(src) {
        if (underSeen.has(src)) return underSeen.get(src);
        const im = mouldImg(src);
        if (!im || !im.naturalWidth) return null;
        let out = null;
        try {
          const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
          c.width = w;
          c.height = h2;
          const g = c.getContext("2d", { willReadFrequently: true });
          g.drawImage(im, 0, 0);
          const d = g.getImageData(0, 0, w, h2).data;
          const L = (x, y) => {
            if (x < 0 || x >= w || y < 0 || y >= h2) return -1;
            const o = (y * w + x) * 4;
            return d[o + 3] < 128 ? -1 : 0.3 * d[o] + 0.59 * d[o + 1] + 0.11 * d[o + 2];
          };
          const vals = [];
          for (let y = 300; y < Math.min(h2, 420); y += 4) for (let x = 200; x < 300; x += 4) {
            const v = L(x, y);
            if (v >= 0) vals.push(v);
          }
          vals.sort((p, q2) => p - q2);
          const skin = vals[vals.length >> 1];
          if (skin > 0) {
            const u = new Int16Array(w).fill(-1);
            let first = -1, last = -1;
            for (let x = 0; x < w; x++) {
              for (let y = 250; y < Math.min(h2, 420); y++) {
                const v = L(x, y);
                if (v >= 0 && v < skin * 0.6 && L(x - 3, y) >= 0 && L(x + 3, y) >= 0) u[x] = y;
              }
              if (u[x] >= 0) {
                if (first < 0) first = x;
                last = x;
              }
            }
            if (first >= 0) {
              for (let x = first, p = first; x <= last; x++) if (u[x] >= 0) {
                for (let k = p + 1; k < x; k++) u[k] = Math.round(u[p] + (u[x] - u[p]) * (k - p) / (x - p));
                p = x;
              }
              for (let k = 1; k <= 30; k++) {
                if (first - k >= 0) u[first - k] = u[first];
                if (last + k < w) u[last + k] = u[last];
              }
              out = u;
            }
          }
        } catch (e) {
          out = null;
        }
        underSeen.set(src, out);
        if (underSeen.size > 40) underSeen.delete(underSeen.keys().next().value);
        return out;
      }
      function bellyUnder(cv, dx, dy, src, ux, uy) {
        const u = gameUnder(src);
        if (!u) return cv;
        const key = [Math.round(dx), Math.round(dy), Math.round(ux), Math.round(uy), src].join("|");
        if (cv.underKey === key) return cv.under;
        const c = document.createElement("canvas");
        c.width = cv.width;
        c.height = cv.height;
        const g = c.getContext("2d");
        g.drawImage(cv, 0, 0);
        for (let cx = 0; cx < cv.width; cx++) {
          const px = Math.round(cx + dx - ux);
          if (px < 0 || px >= u.length || u[px] < 0) continue;
          const cut = Math.round(uy + u[px] + 1 - dy);
          if (cut > 0) g.clearRect(cx, 0, 1, cut);
        }
        cv.underKey = key;
        cv.under = c;
        return c;
      }
      const shadeSeen = /* @__PURE__ */ new WeakMap();
      function bellyShade(img2, sx, sy, ctx3) {
        const b = ctx3.belly;
        if (!b || !img2) return null;
        const fm = bellyForm(b.cv);
        if (!fm) return null;
        const w = img2.naturalWidth || img2.width, h2 = img2.naturalHeight || img2.height;
        if (!w || !h2) return null;
        const key = Math.round(sx) + "," + Math.round(sy) + "|" + ctx3.sig + "|" + (ctx3.breast ? ctx3.breast.sig : "");
        let e = shadeSeen.get(img2);
        if (e && e.key === key) return e.out;
        const ox = Math.round(b.dx - sx), oy = Math.round(b.dy - sy), x0 = Math.max(0, ox), y0 = Math.max(0, oy), x1 = Math.min(w, ox + fm.w), y1 = Math.min(h2, oy + fm.h);
        let out = null;
        if (x1 > x0 && y1 > y0) {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h2;
          const g = c.getContext("2d", { willReadFrequently: true });
          g.drawImage(img2, 0, 0);
          const part = g.getImageData(x0, y0, x1 - x0, y1 - y0), d = part.data;
          let any = false;
          let bm = null;
          const Bb = ctx3.breast;
          if (Bb && Bb.mask) {
            const mc = document.createElement("canvas");
            mc.width = x1 - x0;
            mc.height = y1 - y0;
            const mg = mc.getContext("2d", { willReadFrequently: true });
            mg.filter = "blur(2px)";
            mg.drawImage(Bb.mask, Bb.mx - sx - x0, Bb.my - sy - y0);
            bm = mg.getImageData(0, 0, mc.width, mc.height).data;
          }
          for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
            const i = ((yy - y0) * (x1 - x0) + (xx - x0)) * 4;
            if (d[i + 3] < 8) continue;
            let k = fm.F[(yy - oy) * fm.w + (xx - ox)];
            if (bm) k = 1 + (k - 1) * (1 - bm[i + 3] / 255);
            if (Math.abs(k - 1) < 0.01) continue;
            any = true;
            d[i] = Math.min(255, d[i] * k);
            d[i + 1] = Math.min(255, d[i + 1] * k);
            d[i + 2] = Math.min(255, d[i + 2] * k);
          }
          if (any) {
            g.putImageData(part, x0, y0);
            out = c;
          }
        }
        shadeSeen.set(img2, { key, out });
        return out;
      }
      function bellyRows(ctx3) {
        const b = ctx3.belly, bp = b.prof || (b.prof = edges(b.cv, b.cv.width, b.cv.height));
        let t = -1, e = -1;
        for (let j = 0; j < bp.h; j++) if (bp.L[j] >= 0) {
          if (t < 0) t = j;
          e = j;
        }
        return t < 0 ? null : { top: Math.round(b.dy) + t, bottom: Math.round(b.dy) + e };
      }
      function mouldCanvas(src, x, y, ctx3, piece, mode) {
        let im = mouldImg(src);
        if (!im) return null;
        const M = MOULD.M, w = im.naturalWidth;
        let h2 = im.naturalHeight;
        const p = edgesOf(src);
        let ext = MOULD.ext.get(piece);
        if (p) {
          let t = -1, e = -1;
          for (let j = 0; j < p.h; j++) if (p.L[j] >= 0) {
            if (t < 0) t = j;
            e = j;
          }
          if (t >= 0) {
            const T = Math.round(y) + t, B = Math.round(y) + e;
            if (!ext || T < ext.top || B > ext.bottom) {
              ext = { top: ext ? Math.min(ext.top, T) : T, bottom: ext ? Math.max(ext.bottom, B) : B };
              MOULD.ext.set(piece, ext);
              clearTimeout(MOULD.t);
              MOULD.t = setTimeout(bellyDraw, 60);
            }
          }
        }
        const key = src + "|" + Math.round(x) + "," + Math.round(y) + "|" + mode + "|" + (ext ? ext.top + "-" + ext.bottom : "") + "|" + ctx3.sig;
        if (MOULD.out.has(key)) return MOULD.out.get(key);
        const keep2 = (res) => {
          keepIn(MOULD.out, key, res);
          return res;
        };
        if (mode === "under") {
          const c2 = document.createElement("canvas");
          c2.width = w + M * 2;
          c2.height = h2;
          const g2 = c2.getContext("2d");
          g2.drawImage(im, M, 0);
          g2.globalCompositeOperation = "destination-out";
          g2.drawImage(ctx3.belly.cv, ctx3.belly.dx - x + M, ctx3.belly.dy - y);
          return keep2(c2);
        }
        const ol = ctx3.outline || (ctx3.outline = outline(ctx3));
        if (!ol) return null;
        let changed = false;
        if (mode === "over" && ext) {
          const br = bellyRows(ctx3), from = br ? Math.max(ext.top, br.top) : 0, to = br ? br.bottom - 2 : 0;
          if (br && ext.bottom > from + 4 && ext.bottom < to) {
            const a = from - Math.round(y), b = ext.bottom - Math.round(y), b2 = to - Math.round(y), tall = document.createElement("canvas");
            tall.width = w;
            tall.height = Math.max(h2, b2 + 1 + (h2 - 1 - b));
            const tg = tall.getContext("2d");
            if (a > 0) tg.drawImage(im, 0, 0, w, a, 0, 0, w, a);
            tg.drawImage(im, 0, a, w, b - a + 1, 0, a, w, b2 - a + 1);
            if (b + 1 < h2) tg.drawImage(im, 0, b + 1, w, h2 - b - 1, 0, b2 + 1, w, h2 - b - 1);
            im = tall;
            h2 = tall.height;
            changed = true;
          }
        }
        const c = document.createElement("canvas");
        c.width = w + M * 2;
        c.height = h2;
        const g = c.getContext("2d");
        let longSrc = false;
        if (mode === "auto" && ext) {
          const br = bellyRows(ctx3), mid = br ? (br.top + br.bottom) / 2 : 0, to = br ? br.bottom - 2 : 0, from = br ? Math.max(ext.top, br.top) : 0;
          const ps = pieceSpan(piece, src, x, y), bp0 = ctx3.belly.prof || (ctx3.belly.prof = edges(ctx3.belly.cv, ctx3.belly.cv.width, ctx3.belly.cv.height));
          let endW = 1e9, bW = 0;
          for (let k = 3; k <= 8; k++) {
            const yy = ext.bottom - k;
            if (yy >= 0 && yy < 2600 && ps.L[yy] < 1e8) endW = Math.min(endW, ps.R[yy] - ps.L[yy]);
          }
          for (let j = 0; j < bp0.h; j++) if (bp0.L[j] >= 0) bW = Math.max(bW, bp0.R[j] - bp0.L[j]);
          if (br && endW < bW * 0.45 && ext.bottom > mid && ext.bottom < to - 2 && ext.bottom > from + 4) {
            const a = from - Math.round(y), b = ext.bottom - Math.round(y), b2 = to - Math.round(y);
            if (b > a) {
              const tall = document.createElement("canvas");
              tall.width = w;
              tall.height = Math.max(h2, b2 + 1 + Math.max(0, h2 - 1 - b));
              const tg = tall.getContext("2d");
              if (a > 0) tg.drawImage(im, 0, 0, w, Math.min(a, h2), 0, 0, w, Math.min(a, h2));
              if (b >= a && a < h2) tg.drawImage(im, 0, Math.max(0, a), w, Math.min(h2, b + 1) - Math.max(0, a), 0, Math.max(0, a), w, b2 - Math.max(0, a) + 1);
              if (b + 1 < h2) tg.drawImage(im, 0, b + 1, w, h2 - b - 1, 0, b2 + 1, w, h2 - b - 1);
              im = tall;
              h2 = tall.height;
              longSrc = true;
            }
          }
        }
        if (mode === "auto") {
          const b = ctx3.belly, bp = b.prof || (b.prof = edges(b.cv, b.cv.width, b.cv.height)), cxs = b.dx + b.cv.width / 2;
          if (longSrc) {
            c.height = h2;
          }
          const spanKey = piece + (longSrc ? "|long" + (ext ? ext.top + "-" + ext.bottom : "") : ""), span = MOULD.span.get(spanKey) || { L: new Float32Array(2600).fill(1e9), R: new Float32Array(2600).fill(-1e9), v: 0 };
          MOULD.span.set(spanKey, span);
          const p0 = longSrc ? edges(im, w, h2) : edgesOf(src);
          let grew = false;
          if (p0) for (let j = 0; j < p0.h; j++) {
            const yy = Math.round(y) + j;
            if (p0.L[j] < 0 || yy < 0 || yy >= 2600) continue;
            if (x + p0.L[j] < span.L[yy]) {
              span.L[yy] = x + p0.L[j];
              grew = true;
            }
            if (x + p0.R[j] > span.R[yy]) {
              span.R[yy] = x + p0.R[j];
              grew = true;
            }
          }
          if (grew) {
            span.v++;
            MOULD.ver++;
            clearTimeout(MOULD.t);
            MOULD.t = setTimeout(bellyDraw, 60);
          }
          const key2 = key + "|span" + span.v;
          if (MOULD.out.has(key2)) return MOULD.out.get(key2);
          const rowOf = (yy) => {
            if (yy < 0 || yy >= 2600 || span.L[yy] > 1e8) return null;
            const j = yy - Math.round(b.dy);
            if (j < 0 || j >= bp.h || bp.L[j] < 0) return null;
            const gl = span.L[yy], gr = span.R[yy], bl = b.dx + bp.L[j], br2 = b.dx + bp.R[j];
            if (gl > cxs || gr < cxs) return null;
            return { gl, gr, nl: Math.min(gl, bl), nr: Math.max(gr, br2), bw: br2 - bl };
          };
          const strappy = bellyCover(src, x, y, ctx3) < 0.35;
          for (let j = 0; j < h2; j++) {
            const yy = Math.round(y) + j;
            g.drawImage(im, 0, j, w, 1, M, j, w, 1);
            let gl = 0, gr = 0, nl2 = 0, nr = 0, bw = 0, n2 = 0;
            for (let d = -4; d <= 4; d++) {
              const e = rowOf(yy + d);
              if (e) {
                gl += e.gl;
                gr += e.gr;
                nl2 += e.nl;
                nr += e.nr;
                bw += e.bw;
                n2++;
              }
            }
            if (n2 < 5 || !rowOf(yy)) continue;
            gl /= n2;
            gr /= n2;
            nl2 /= n2;
            nr /= n2;
            if (gr - gl < (strappy ? Math.max(6, bw / n2 * 0.45) : 6) || nl2 >= gl - 0.5 && nr <= gr + 0.5) continue;
            const k = (nr - nl2) / (gr - gl), sa = Math.max(0, gl - x), sb = Math.min(w, gr - x + 1);
            if (sb - sa < 1) continue;
            changed = true;
            g.clearRect(M + nl2 - x - 1, j, nr - nl2 + 2, 1);
            g.drawImage(im, sa, j, sb - sa, 1, M + (nl2 - x) + (sa - (gl - x)) * k, j, (sb - sa) * k, 1);
          }
          const res2 = changed ? c : false;
          keepIn(MOULD.out, key2, res2);
          return res2;
        }
        for (let j = 0; j < h2; j++) {
          const yy = Math.round(y) + j, o = ol.old(yy), n = ol.neu(yy);
          if (!o || !n || n.l >= o.l && n.r <= o.r) {
            g.drawImage(im, 0, j, w, 1, M, j, w, 1);
            continue;
          }
          changed = true;
          const l0 = Math.max(0, Math.min(w - 1, Math.round(o.l - x))), r0 = Math.max(l0, Math.min(w - 1, Math.round(o.r - x))), l1 = Math.round(n.l - x), r1 = Math.round(n.r - x);
          if (l0 > 0) g.drawImage(im, 0, j, l0, 1, M + (l1 - l0), j, l0, 1);
          g.drawImage(im, l0, j, r0 - l0 + 1, 1, M + l1, j, r1 - l1 + 1, 1);
          if (r0 + 1 < w) g.drawImage(im, r0 + 1, j, w - r0 - 1, 1, M + r1 + 1, j, w - r0 - 1, 1);
        }
        return keep2(changed ? c : false);
      }
      const BUDGET = host && host.budget || 256e6;
      const bytesOf = (v) => {
        if (!v || typeof v !== "object") return 0;
        if (v.width && v.height && typeof v.getContext === "function") return v.width * v.height * 4;
        let n = 0;
        for (const k in v) {
          const x = v[k];
          if (x && typeof x === "object" && x.width && x.height && typeof x.getContext === "function") n += x.width * x.height * 4;
        }
        return n;
      };
      function keepIn(map, key, v) {
        map.delete(key);
        map.set(key, v);
        return v;
      }
      function trim() {
        const maps = [BREAST.out, MOULD.out];
        let total = 0;
        for (const m of maps) for (const x of m.values()) total += bytesOf(x);
        while (total > BUDGET) {
          let gone2 = false;
          for (const m of maps) {
            const k = m.keys().next();
            if (k.done) continue;
            total -= bytesOf(m.get(k.value));
            m.delete(k.value);
            gone2 = true;
            if (total <= BUDGET) break;
          }
          if (!gone2) break;
        }
      }
      function keptBytes() {
        let t = 0;
        for (const m of [BREAST.out, MOULD.out]) for (const x of m.values()) t += bytesOf(x);
        return t;
      }
      const BREAST = { band: {}, solid: {}, tuck: true, on: {}, free: true, holds: {}, holdSig: "", wear: {}, dress: true, cover: /* @__PURE__ */ new Map(), cup: null, full: 1, hang: 1, apart: 1, x: 0, y: 0, nip: 1, nipY: 0, nipX: 0, cv: null, cvKey: "", halves: /* @__PURE__ */ new Map(), out: /* @__PURE__ */ new Map() };
      const BREAST_SLIDERS = [
        ["full", "Fullness", 0.7, 1.4, 0.01],
        ["hang", "Weight (how low and heavy they hang)", 0, 2, 0.01],
        ["apart", "Apart / together", 0.6, 1.5, 0.01],
        ["x", "Left / right", -60, 60, 1],
        ["y", "Up / down", -80, 80, 1],
        ["nip", "Nipple size (and what's worn on them)", 0.4, 4, 0.05],
        ["nipY", "Nipples up / down", -80, 80, 1],
        ["nipX", "Nipples in / out", -60, 60, 1]
      ];
      const NIP_GROUPS = /* @__PURE__ */ new Set(["Nipples", "ItemNipples", "ItemNipplesPiercings"]);
      const HAND_GROUPS = /* @__PURE__ */ new Set(["HandsLeft", "HandsRight", "ItemHands", "Gloves"]);
      const NIP_PIECES = new RegExp("Forbidden|Pastie|Nipple|Shield|Tape|Heart|Tassel|Piercing", "i");
      const NIP_DESC = new RegExp("Pastie|Nipple|Tassel|Breast Pump|Suction Cup", "i");
      const ARM_GROUPS = /* @__PURE__ */ new Set(["ItemArms", "Bracelet"]);
      const heldNow = () => false;
      const chestSlot = (g) => !!g && !/^Hair/.test(g) && !NIP_GROUPS.has(g) && !HAND_GROUPS.has(g) && !/^(Body|Arms|Head|Eyes|Eyebrows|Mouth|Blush|Fluids|Pussy|Emoticon|Height)/.test(g);
      const STRAPS = {
        FrameBra1: { ring: 6, centre: 4 },
        FrameBra2: { ring: 3.5, cross: 2.5 },
        BondageBra1: { across: 0.42, under: 6 },
        HarnessBra2: { ring: 6, under: 8 },
        StarHarnessBra: { ring: 4, cross: 3.5, over: 3.5 },
        StuddedHarness: { ring: 8, under: 8 },
        LeatherBreastBinder: { over: 10, under: 10, centre: 6 },
        LeatherHarness: { ring: 6, centre: 5, under: 6 },
        LeatherStrapHarness: { ring: 6, centre: 5, under: 6 },
        HarnessBra1: { ring: 5, under: 6 }
      };
      const GAME_BREAST_ALLFOURS = { dx: 33, y: 288, r: 24 };
      const gameBreast = (B) => B.pose === "AllFours" ? GAME_BREAST_ALLFOURS : GAME_BREAST;
      const GAME_BREAST = { dx: 42, y: 330, r: 41 };
      const upperName = () => {
        const it = bodyItem("BodyUpper");
        return it && it.Asset ? it.Asset.Name : "";
      };
      function breastNow() {
        if (!window.FarmBreasts || BREAST.cup == null || BREAST.cup < FarmBreasts.DRAWN_FROM) return null;
        if (upperName() !== "XLarge") return null;
        return BREAST;
      }
      function setCup(i) {
        BREAST.cup = i;
        setBody("BodyUpper", i < FarmBreasts.DRAWN_FROM ? FarmBreasts.NATIVE[i] : "XLarge");
        bellyDraw();
      }
      function cupNow() {
        if (breastNow()) return BREAST.cup;
        const n = FarmBreasts.NATIVE.indexOf(upperName());
        return n < 0 ? 3 : n;
      }
      function nipHalves(src, split) {
        const key = src + "|" + split;
        let v = BREAST.halves.get(key);
        if (v) return v;
        const im = mouldImg(src);
        if (!im) return null;
        const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
        c.width = w;
        c.height = h2;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, w, h2).data, acc = [[0, 0, 0], [0, 0, 0]];
        for (let y = 0; y < h2; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 60) {
          const a = acc[x < split ? 0 : 1];
          a[0] += x;
          a[1] += y;
          a[2]++;
        }
        v = acc.map((a) => a[2] ? [a[0] / a[2], a[1] / a[2]] : null);
        BREAST.halves.set(key, v);
        return v;
      }
      const GEN = { inches: 6, box: {}, drawn: true, kind: "human", knot: false, girth: 1, balls: 3, cv: null, cvKey: "" };
      function draw2(C, cb, game) {
        trim();
        {
          let finish = null, seenNow = null, handFNow = null;
          try {
            const fit = C === S3.C ? fitNow() : null, br = C === S3.C ? breastNow() : null, real = cb;
            const put2 = (name, img2, x, y, o) => {
              if (img2 && typeof img2 !== "string" && img2.MX != null && o && o.TextureAlphaMask) o = Object.assign({}, o, { TextureAlphaMask: void 0 });
              if (typeof img2 === "string" || !host.picture || takesDrawings()) return real[name](img2, x, y, o);
              const p = host.picture(img2);
              if (p) return real[name](p.src, x + p.dx, y + p.dy, o);
            };
            if (fit && cb && typeof cb.drawImage === "function") {
              let upper = null, lower = false, done = false;
              const ctx3 = { bodies: [], belly: null, sig: "", seen: {} };
              if (br) {
                seenNow = ctx3.seen;
                handFNow = { get v() {
                  return ctx3.handF;
                } };
              }
              const slot = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/");
              const groupOf3 = (src) => {
                const m = slot.exec(src);
                return m ? m[1] : "";
              };
              const mouldList = S3.C.Appearance.filter((it) => MOULD.items.has(mouldKey(it))).map((it) => ({ folders: [it.Asset.Group.Name, it.Asset.DynamicGroupName], name: it.Asset.Name, key: mouldKey(it), mode: MOULD.mode.get(mouldKey(it)) || "wide" }));
              const wornList = S3.C.Appearance.map((it) => ({ folders: [it.Asset.Group.Name, it.Asset.DynamicGroupName], name: it.Asset.Name, desc: String(it.Asset.Description || ""), key: mouldKey(it), flat: !!(it.Asset.Prerequisite || []).includes("HasFlatChest") && !InventoryIsItemInList(S3.C, "BodyUpper", ["FlatSmall", "FlatMedium"]) })).sort((a, b) => b.name.length - a.name.length);
              const pieceOf = (src) => {
                const g = groupOf3(src), file = src.slice(src.lastIndexOf("/") + 1);
                return wornList.find((w) => w.folders.includes(g) && file.startsWith(w.name)) || null;
              };
              const isMoulded = (src) => {
                if (!mouldList.length) return null;
                const g = groupOf3(src), file = src.slice(src.lastIndexOf("/") + 1);
                return mouldList.find((q2) => q2.folders.includes(g) && file.startsWith(q2.name)) || null;
              };
              const gate = FarmBelly.skinGate(C);
              const prio = (src) => {
                const g = AssetGroupGet(C.AssetFamily, groupOf3(src));
                return g && typeof g.DrawingPriority === "number" ? g.DrawingPriority : 99;
              };
              const paint = () => {
                if (done || !upper) return;
                done = true;
                if (fit.on) {
                  const shape = { rx: fit.rx, ry: fit.ry, sag: fit.sag, cut: fit.cut };
                  const cv0 = FarmBelly.bellyCanvas(shape, bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2])), !!fit.flat);
                  const dx = upper[0] + 250 - cv0.width / 2 + fit.x, dy = upper[1] + 392 + fit.ry * 0.62 - cv0.height / 2 + fit.y;
                  const cv = br || fit.behind ? cv0 : bellyUnder(cv0, dx, dy, upper[2], upper[0], upper[1]);
                  put2("drawImage", cv, dx, dy, {});
                  if (typeof real.drawImageBlink === "function") put2("drawImageBlink", cv, dx, dy, {});
                  ctx3.belly = { cv, dx, dy };
                  ctx3.sig = [fit.rx, fit.ry, fit.sag, fit.cut, fit.flat ? 1 : 0, Math.round(dx), Math.round(dy)].join(",") + "|" + ctx3.bodies.map((b) => b.src + "@" + Math.round(b.x) + "," + Math.round(b.y)).join(";");
                }
                if (ctx3.cock) {
                  const k = ctx3.cock;
                  ctx3.cock = null;
                  put2("drawImage", k[0], k[1], k[2], {});
                  if (typeof real.drawImageBlink === "function") put2("drawImageBlink", k[0], k[1], k[2], {});
                }
                if (br) {
                  const isHeld = FarmBelly.bellyPose(upper[2]) !== "AllFours" && heldNow(), freeS = FarmBreasts.shape(br.cup, br), S32 = isHeld ? FarmBreasts.held(freeS) : freeS;
                  const key = [br.cup, br.full, br.hang, br.apart, isHeld ? "held" : "free"].join(",") + "|" + bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2])).join(",");
                  if (BREAST.cvKey !== key) {
                    BREAST.cv = FarmBreasts.canvas(S32, bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2])));
                    BREAST.cvKey = key;
                  }
                  const bpose = FarmBelly.bellyPose(upper[2]), rx = upper[0] + 250 + br.x, ry = upper[1] + FarmBreasts.ROOT_Y + br.y, ground = upper[1] + 398;
                  let bc = BREAST.cv;
                  if (bpose === "AllFours" && ry - bc.ay + bc.height > ground) {
                    if (BREAST.flatKey !== key + "|" + Math.round(ry)) {
                      const fc = document.createElement("canvas");
                      fc.width = bc.width;
                      fc.height = bc.height;
                      const fg = fc.getContext("2d"), cut = Math.round(ground - (ry - bc.ay));
                      fg.drawImage(bc, 0, 0);
                      fg.clearRect(0, cut, fc.width, fc.height - cut);
                      const row = fg.getImageData(0, Math.max(0, cut - 3), fc.width, 1).data;
                      let x0 = -1, x1 = -1;
                      for (let i = 0; i < fc.width; i++) if (row[i * 4 + 3] > 120) {
                        if (x0 < 0) x0 = i;
                        x1 = i;
                      }
                      if (x0 >= 0) {
                        const soft = 16, mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
                        fg.globalCompositeOperation = "destination-out";
                        const fade = fg.createLinearGradient(0, cut - soft, 0, cut);
                        fade.addColorStop(0, "rgba(0,0,0,0)");
                        fade.addColorStop(1, "rgba(0,0,0,0.9)");
                        fg.fillStyle = fade;
                        fg.fillRect(0, cut - soft, fc.width, soft);
                        for (const sd of [-1, 1]) {
                          const cx = mid + sd * half, rg = fg.createRadialGradient(cx, cut, 0, cx, cut, soft * 1.8);
                          rg.addColorStop(0, "rgba(0,0,0,1)");
                          rg.addColorStop(1, "rgba(0,0,0,0)");
                          fg.fillStyle = rg;
                          fg.fillRect(cx - soft * 2, cut - soft * 2, soft * 4, soft * 2);
                        }
                        fg.globalCompositeOperation = "destination-over";
                        const sh = fg.createRadialGradient(mid, cut - 3, 0, mid, cut - 3, half * 1.05);
                        sh.addColorStop(0, "rgba(70,40,36,0.34)");
                        sh.addColorStop(0.75, "rgba(70,40,36,0.2)");
                        sh.addColorStop(1, "rgba(70,40,36,0)");
                        fg.save();
                        fg.translate(0, cut - 3);
                        fg.scale(1, 0.09);
                        fg.translate(0, -(cut - 3));
                        fg.fillStyle = sh;
                        fg.beginPath();
                        fg.arc(mid, cut - 3, half * 1.05, 0, Math.PI * 2);
                        fg.fill();
                        fg.restore();
                        fg.globalCompositeOperation = "source-over";
                      }
                      fc.ax = bc.ax;
                      fc.ay = bc.ay;
                      fc.nips = bc.nips;
                      fc.mask = bc.mask;
                      BREAST.flat = fc;
                      BREAST.flatKey = key + "|" + Math.round(ry);
                    }
                    bc = BREAST.flat;
                  }
                  put2("drawImage", bc, rx - bc.ax, ry - bc.ay, {});
                  if (typeof real.drawImageBlink === "function") put2("drawImageBlink", bc, rx - bc.ax, ry - bc.ay, {});
                  ctx3.breast = { fit: FarmBreasts.fitOf(S32, FarmBelly.bellyPose(upper[2]), [bc.nips[1][0] + br.nipX, bc.nips[1][1] + br.nipY]), held: isHeld, upperSrc: upper[2], ux: upper[0], pose: bpose, ground: bpose === "AllFours" ? ground : Infinity, S: S32, rx, ry, uy: upper[1], mask: bc.mask, mx: rx - bc.ax, my: ry - bc.ay, nips: bc.nips.map((p, i) => [rx + p[0] + (i ? 1 : -1) * br.nipX, ry + p[1] + br.nipY]), k: FarmBreasts.shape(br.cup, br).k, kN: (1 + 0.45 * FarmBreasts.shape(br.cup, br).k) * br.nip, sig: key + "|" + Math.round(rx) + "," + Math.round(ry) + "|" + [br.nip, br.nipX, br.nipY].join(","), mid: upper[0] + 250 };
                  if (!held.length) {
                    const B = ctx3.breast, sk = bellySkin(upper[2], upper[3], bpose), rad = 7 * B.kN, ncKey = rad.toFixed(2) + "|" + sk.join(",");
                    let nc = BREAST.nc;
                    if (!nc || BREAST.ncKey !== ncKey) {
                      nc = document.createElement("canvas");
                      nc.width = nc.height = Math.ceil(rad * 2 + 4);
                      const ng = nc.getContext("2d"), gr = ng.createRadialGradient(nc.width / 2, nc.height / 2, 0, nc.width / 2, nc.height / 2, rad), tone = (m, a) => "rgba(" + Math.round(Math.min(255, sk[0] * m)) + "," + Math.round(sk[1] * 0.62 * m) + "," + Math.round(sk[2] * 0.62 * m) + "," + a + ")";
                      gr.addColorStop(0, tone(0.92, 1));
                      gr.addColorStop(0.3, tone(1, 0.95));
                      gr.addColorStop(0.75, tone(1.02, 0.8));
                      gr.addColorStop(1, tone(1.02, 0));
                      ng.fillStyle = gr;
                      ng.beginPath();
                      ng.arc(nc.width / 2, nc.height / 2, rad, 0, Math.PI * 2);
                      ng.fill();
                      BREAST.nc = nc;
                      BREAST.ncKey = ncKey;
                    }
                    for (const p of B.nips) if (p[1] + rad < B.ground) {
                      put2("drawImage", nc, p[0] - nc.width / 2, p[1] - nc.height / 2, {});
                      if (typeof real.drawImageBlink === "function") put2("drawImageBlink", nc, p[0] - nc.width / 2, p[1] - nc.height / 2, {});
                    }
                  }
                  for (const h2 of held.splice(0)) {
                    try {
                      if (!nipDraw(...h2)) put2(h2[0], h2[1], h2[2], h2[3], h2[4]);
                    } catch (e) {
                      console.warn("[studio] nipples:", e);
                    }
                  }
                }
              };
              const handHidden = (src, x, y) => {
                const B = ctx3.breast, im = B && mouldImg(src);
                if (!im) return null;
                const key = "hh|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig;
                let v = BREAST.cover.get(key);
                if (v != null) return v;
                const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
                c.width = w;
                c.height = h2;
                const g = c.getContext("2d", { willReadFrequently: true });
                const count = () => {
                  const d = g.getImageData(0, 0, w, h2).data;
                  let n = 0;
                  for (let i = 3; i < d.length; i += 16) if (d[i] > 100) n++;
                  return n;
                };
                g.drawImage(im, 0, 0);
                const all = count();
                g.globalCompositeOperation = "destination-in";
                g.drawImage(B.mask, B.mx - x, B.my - y);
                const under = count();
                v = all ? under / all : 0;
                BREAST.cover.size > 2e3 && BREAST.cover.clear(), BREAST.cover.set(key, v);
                return v;
              };
              const LOWER_GROUPS = /^(Panties|ClothLower|SuitLower|ItemPelvis|ItemVulva|ItemButt|ItemLegs|Garters|Socks)$/;
              const handDraw = (name, src, x, y, o) => {
                const B = ctx3.breast, im = B && mouldImg(src);
                if (!im) return false;
                let bv = null;
                try {
                  bv = ctx3.belly && !fit.behind && LOWER_GROUPS.test(groupOf3(src)) ? bellyAuto(src, x, y, ctx3, fit.behind, (pieceOf(src) || {}).key) : null;
                } catch (e) {
                  bv = null;
                }
                const base = bv || im, ox = bv ? MOULD.M : 0;
                const key = "hand|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + (bv ? "|b" + ctx3.sig + "|" + MOULD.ver + "|" + base.width + "x" + base.height : "") + (ctx3.belly ? "|s" + ctx3.sig : "");
                let c = BREAST.out.get(key);
                if (!c) {
                  c = document.createElement("canvas");
                  c.width = base.naturalWidth || base.width;
                  c.height = base.naturalHeight || base.height;
                  const g = c.getContext("2d");
                  g.drawImage(base, 0, 0);
                  g.globalCompositeOperation = "destination-out";
                  g.drawImage(B.mask, B.mx - (x - ox), B.my - y);
                  if (ctx3.belly && !fit.behind && chestSlot(groupOf3(src)) && groupOf3(src) !== "Panties") {
                    try {
                      const sh = bellyShade(c, x - ox, y, ctx3);
                      if (sh) c = sh;
                    } catch (e) {
                      console.warn("[body] belly form:", e);
                    }
                  }
                  keepIn(BREAST.out, key, c);
                }
                put2(name, c, x - ox, y, o);
                return true;
              };
              const frameCover = (src, im, x, y, B) => {
                const key = "fr|" + src + "|" + Math.round(x) + "," + Math.round(y);
                let v = BREAST.cover.get(key);
                if (v != null) return v;
                const fm = frameMeasure(src, im, x, y, B);
                v = fm ? fm.share : 0;
                BREAST.cover.size > 2e3 && BREAST.cover.clear(), BREAST.cover.set(key, v);
                return v;
              };
              const FRAME_N = 96;
              const frameMeasure = (src, im, x, y, B) => {
                const key = "fm|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.pose;
                let v = BREAST.out.get(key);
                if (v !== void 0) return v;
                const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
                c.width = w;
                c.height = h2;
                const g = c.getContext("2d", { willReadFrequently: true });
                g.drawImage(im, 0, 0);
                const d = g.getImageData(0, 0, w, h2).data;
                const GB = gameBreast(B), R = GB.r, sides = [];
                let hits = 0, all = 0, top = 0, tAll = 0;
                const runs = [], cols = [];
                for (const sd of [-1, 1]) {
                  const cx = B.mid + sd * GB.dx - x, cy = B.uy + GB.y - y, hit = [];
                  for (let a = 0; a < FRAME_N; a++) {
                    const t = a / FRAME_N * Math.PI * 2, ux = Math.cos(t) * sd, uy = Math.sin(t);
                    let r0 = -1, r1 = -1;
                    for (let rr2 = R * 0.8; rr2 <= R * 1.32; rr2 += 0.5) {
                      const px = Math.round(cx + ux * rr2), py = Math.round(cy + uy * rr2);
                      const on2 = px >= 0 && py >= 0 && px < w && py < h2 && d[(py * w + px) * 4 + 3] > 60;
                      if (on2) {
                        if (r0 < 0) r0 = rr2;
                        r1 = rr2;
                        const o = (py * w + px) * 4;
                        cols.push(d[o], d[o + 1], d[o + 2]);
                      } else if (r0 >= 0) break;
                    }
                    const ok2 = r0 >= 0 && r1 - r0 >= 1.5 && r1 - r0 <= R * 0.35;
                    hit.push(ok2 ? [r0, r1] : null);
                    all++;
                    if (ok2) {
                      hits++;
                      runs.push(r1 - r0);
                    }
                    if (uy < -0.3) {
                      tAll++;
                      if (ok2) top++;
                    }
                  }
                  for (let a = 0; a < FRAME_N; a++) if (!hit[a]) {
                    let p = -1, q2 = -1;
                    for (let k = 1; k <= 6; k++) {
                      if (p < 0 && hit[(a - k + FRAME_N) % FRAME_N]) p = (a - k + FRAME_N) % FRAME_N;
                      if (q2 < 0 && hit[(a + k) % FRAME_N]) q2 = (a + k) % FRAME_N;
                    }
                    if (p >= 0 && q2 >= 0) hit[a] = [(hit[p][0] + hit[q2][0]) / 2, (hit[p][1] + hit[q2][1]) / 2, true];
                  }
                  const att = [];
                  let grp = [];
                  for (let a = 0; a <= FRAME_N; a++) {
                    const k = a % FRAME_N, hr = hit[k], t = k / FRAME_N * Math.PI * 2, ux = Math.cos(t) * sd, uy = Math.sin(t);
                    let on2 = false;
                    if (hr && uy < -0.3 && Math.cos(t) > -0.6 && a < FRAME_N) {
                      on2 = true;
                      for (let q2 = 2; q2 <= 7; q2++) {
                        const px = Math.round(cx + ux * (hr[1] + q2)), py = Math.round(cy + uy * (hr[1] + q2));
                        if (!(px >= 0 && py >= 0 && px < w && py < h2 && d[(py * w + px) * 4 + 3] > 60)) {
                          on2 = false;
                          break;
                        }
                      }
                    }
                    if (on2) grp.push(k);
                    else if (grp.length) {
                      const m = grp[grp.length >> 1], hm = hit[m], tm = m / FRAME_N * Math.PI * 2;
                      att.push({ a: m, x: cx + Math.cos(tm) * sd * (hm[1] + 1), y: cy + Math.sin(tm) * (hm[1] + 1) });
                      grp = [];
                    }
                  }
                  sides.push({ sd, cx, cy, hit, att });
                }
                if (sides.length === 2) {
                  for (const [p, q2] of [[0, 1], [1, 0]]) if (!sides[p].att.length && sides[q2].att.length) sides[p].att = sides[q2].att.map((at) => ({ a: at.a, x: 2 * (B.mid - x) - at.x, y: at.y }));
                }
                if (!runs.length) {
                  BREAST.out.set(key, null);
                  return null;
                }
                runs.sort((p, q2) => p - q2);
                let rr = 0, gg = 0, bb = 0;
                const n = cols.length / 3;
                for (let i = 0; i < cols.length; i += 3) {
                  rr += cols[i];
                  gg += cols[i + 1];
                  bb += cols[i + 2];
                }
                let hiL = 0, hiC = [rr / n, gg / n, bb / n];
                for (let i = 0; i < cols.length; i += 3) {
                  const L = cols[i] + cols[i + 1] + cols[i + 2];
                  if (L > hiL) {
                    hiL = L;
                    hiC = [cols[i], cols[i + 1], cols[i + 2]];
                  }
                }
                v = { sides, width: runs[runs.length >> 1] + 1, col: [rr / n, gg / n, bb / n], hi: hiC, share: tAll ? top / tAll : 0, all: hits / all };
                BREAST.out.set(key, v);
                return v;
              };
              const herOutline = (B) => {
                const key = "ho|" + B.sig;
                let v = BREAST.out.get(key);
                if (v) return v;
                const m = B.mask, w = m.width, h2 = m.height, d = m.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h2).data, mid = B.mid - B.mx, cs = [];
                for (const sd of [-1, 1]) {
                  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
                  for (let yy = 0; yy < h2; yy += 2) for (let xx = 0; xx < w; xx += 2) {
                    if ((xx - mid) * sd < 0 || d[(yy * w + xx) * 4 + 3] <= 60) continue;
                    x0 = Math.min(x0, xx);
                    x1 = Math.max(x1, xx);
                    y0 = Math.min(y0, yy);
                    y1 = Math.max(y1, yy);
                  }
                  const rx = (x1 - x0) / 2, cx = (x0 + x1) / 2, cy = y1 - rx, edge = [];
                  for (let a = 0; a < FRAME_N; a++) {
                    const t = a / FRAME_N * Math.PI * 2, ux = Math.cos(t) * sd, uy = Math.sin(t);
                    let re = 0;
                    for (let rr = 2; rr < 400; rr += 1) {
                      const px = Math.round(cx + ux * rr), py = Math.round(cy + uy * rr);
                      if (px < 0 || py < 0 || px >= w || py >= h2 || d[(py * w + px) * 4 + 3] <= 60) {
                        re = rr;
                        break;
                      }
                    }
                    edge.push(Math.min(re, rx));
                  }
                  const sm = edge.map((_, a) => {
                    let t = 0;
                    for (let k = -3; k <= 3; k++) t += edge[(a + k + FRAME_N) % FRAME_N];
                    return t / 7;
                  });
                  edge.splice(0, FRAME_N, ...sm);
                  cs.push({ sd, cx: cx + B.mx, cy: cy + B.my, edge });
                }
                v = cs;
                keepIn(BREAST.out, key, v);
                return v;
              };
              const frameDraw = (name, src, x, y, o) => {
                const B = ctx3.breast, im = B && mouldImg(src);
                if (!im || B.pose === "AllFours" || cupNow() <= 5) return false;
                const fm = frameMeasure(src, im, x, y, B);
                if (!fm) return false;
                const key = "frame|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig;
                let c = BREAST.out.get(key);
                if (!c) {
                  const MX = 260, MY = 480, w = im.naturalWidth, h2 = im.naturalHeight;
                  c = document.createElement("canvas");
                  c.width = w + MX * 2;
                  c.height = h2 + MY * 2;
                  c.MX = MX;
                  c.MY = MY;
                  const g = c.getContext("2d");
                  g.drawImage(im, MX, MY);
                  g.globalCompositeOperation = "destination-out";
                  g.lineCap = "round";
                  for (const sv of fm.sides) for (let a = 0; a < FRAME_N; a++) {
                    const hr = sv.hit[a], t = a / FRAME_N * Math.PI * 2;
                    if (!hr || Math.sin(t) >= 0.3) continue;
                    const ux = Math.cos(t) * sv.sd, uy = Math.sin(t);
                    g.lineWidth = Math.max(3, (hr[0] + hr[1]) / 2 * Math.PI * 2 / FRAME_N * 1.6);
                    g.beginPath();
                    g.moveTo(MX + sv.cx + ux * (hr[0] - 1.5), MY + sv.cy + uy * (hr[0] - 1.5));
                    g.lineTo(MX + sv.cx + ux * (hr[1] + 1.5), MY + sv.cy + uy * (hr[1] + 1.5));
                    g.stroke();
                  }
                  g.drawImage(B.mask, MX + B.mx - x, MY + B.my - y);
                  g.globalCompositeOperation = "source-over";
                  const ho = herOutline(B), W11 = fm.width, rgb2 = (q2, k) => "rgb(" + q2.map((u) => Math.max(0, Math.min(255, Math.round(u * k)))).join(",") + ")";
                  for (const hv of ho) {
                    const sv = fm.sides.find((q2) => q2.sd === hv.sd);
                    if (!sv) continue;
                    const segs = [];
                    let cur = null;
                    for (let k = 0; k <= FRAME_N; k++) {
                      const a = k % FRAME_N, ta = a / FRAME_N * Math.PI * 2, on2 = !!sv.hit[a] && hv.edge[a] > 0 && Math.sin(ta) < 0.3 && Math.cos(ta) > -0.6;
                      if (on2) {
                        const t = a / FRAME_N * Math.PI * 2, ux = Math.cos(t) * hv.sd, uy = Math.sin(t), rr = hv.edge[a] - W11 * 0.45;
                        (cur || (cur = [])).push([MX + hv.cx - x + ux * rr, MY + hv.cy - y + uy * rr]);
                      } else if (cur) {
                        segs.push(cur);
                        cur = null;
                      }
                    }
                    if (cur) segs.push(cur);
                    if (segs.length > 1 && sv.hit[0] && sv.hit[FRAME_N - 1]) {
                      const last = segs.pop();
                      segs[0] = last.concat(segs[0]);
                    }
                    const path = (pts) => {
                      g.beginPath();
                      pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]));
                    };
                    g.lineCap = "round";
                    g.lineJoin = "round";
                    for (const at of sv.att || []) {
                      const t = at.a / FRAME_N * Math.PI * 2, ux = Math.cos(t) * hv.sd, uy = Math.sin(t), rr = hv.edge[at.a] - W11 * 0.45;
                      segs.push([[MX + at.x, MY + at.y], [MX + hv.cx - x + ux * rr, MY + hv.cy - y + uy * rr]]);
                    }
                    for (const pts of segs) {
                      if (pts.length < 2) continue;
                      path(pts);
                      g.strokeStyle = rgb2(fm.col, 0.55);
                      g.lineWidth = W11 + 1.5;
                      g.stroke();
                      path(pts);
                      g.strokeStyle = rgb2(fm.col, 1);
                      g.lineWidth = W11;
                      g.stroke();
                      path(pts.map((p, i) => {
                        const q2 = pts[Math.min(pts.length - 1, i + 1)], pp = pts[Math.max(0, i - 1)], dx = q2[0] - pp[0], dy = q2[1] - pp[1], L = Math.hypot(dx, dy) || 1;
                        return [p[0] - dy / L * W11 * 0.18, p[1] + dx / L * W11 * 0.18];
                      }));
                      g.globalAlpha = 0.55;
                      g.strokeStyle = rgb2(fm.hi, 1);
                      g.lineWidth = Math.max(1, W11 * 0.22);
                      g.stroke();
                      g.globalAlpha = 1;
                    }
                  }
                  keepIn(BREAST.out, key, c);
                }
                put2(name, c, x - c.MX, y - c.MY, o);
                return true;
              };
              const underBand = (src, im, x, y, B) => {
                const key = "ub|" + src + "|" + Math.round(x) + "," + Math.round(y);
                let v = BREAST.cover.get(key);
                if (v != null) return v;
                const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
                c.width = w;
                c.height = h2;
                const g = c.getContext("2d", { willReadFrequently: true });
                g.drawImage(im, 0, 0);
                const GB = gameBreast(B), d = g.getImageData(0, 0, w, h2).data;
                let hit = 0, all = 0;
                for (const sd of [-1, 1]) for (let i = -Math.round(GB.r * 0.8); i <= Math.round(GB.r * 0.8); i += 2) {
                  all++;
                  const px = Math.round(B.mid + sd * GB.dx - x) + i;
                  let any = false;
                  for (let j = Math.round(GB.r * 0.7); j <= Math.round(GB.r * 1.6); j++) {
                    const py = Math.round(B.uy + GB.y - y) + j;
                    if (px >= 0 && py >= 0 && px < w && py < h2 && d[(py * w + px) * 4 + 3] > 60) {
                      any = true;
                      break;
                    }
                  }
                  if (any) hit++;
                }
                v = all ? hit / all : 0;
                BREAST.cover.size > 2e3 && BREAST.cover.clear(), BREAST.cover.set(key, v);
                return v;
              };
              const bandDraw = (name, src, x, y, o) => {
                const B = ctx3.breast, im = mouldImg(src);
                if (!B || !im) return false;
                const key = "band|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig;
                let c = BREAST.out.get(key);
                if (!c) {
                  const GB = gameBreast(B), MX = 260, MY = 480, w = im.naturalWidth, h2 = im.naturalHeight, S22 = B.S;
                  c = document.createElement("canvas");
                  c.width = w + MX * 2;
                  c.height = h2 + MY * 2;
                  c.MX = MX;
                  c.MY = MY;
                  const g = c.getContext("2d");
                  g.drawImage(im, MX, MY);
                  g.globalCompositeOperation = "destination-out";
                  g.drawImage(B.mask, MX + B.mx - x, MY + B.my - y);
                  g.globalCompositeOperation = "source-over";
                  const b0 = Math.round(B.uy + GB.y + GB.r * 0.62 - y), b1 = Math.round(B.uy + GB.y + GB.r * 1.65 - y), gUnder = B.uy + GB.y + GB.r, herUnder = B.ry + S22.by + (B.fit.rv || S22.r), dy = herUnder - gUnder, kx = 1, mid = B.mid - x;
                  if (b1 > b0) {
                    const strip = document.createElement("canvas");
                    strip.width = w;
                    strip.height = b1 - b0;
                    strip.getContext("2d").drawImage(im, 0, b0, w, b1 - b0, 0, 0, w, b1 - b0);
                    g.drawImage(strip, MX + mid - mid * kx, MY + b0 + dy, w * kx, b1 - b0);
                  }
                  keepIn(BREAST.out, key, c);
                }
                put2(name, c, x - c.MX, y - c.MY, o);
                return true;
              };
              const chestCover = (src, im, x, y, B, wide) => {
                const key = (wide ? "w|" : "n|") + src + "|" + Math.round(x) + "," + Math.round(y);
                let v = BREAST.cover.get(key);
                if (v != null) return v;
                const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
                c.width = w;
                c.height = h2;
                const g = c.getContext("2d", { willReadFrequently: true });
                g.drawImage(im, 0, 0);
                const GB = gameBreast(B), d = g.getImageData(0, 0, w, h2).data, R = Math.round(GB.r * (wide ? 1.3 : 0.82));
                let hit = 0, all = 0;
                for (const sd of [-1, 1]) {
                  const cx = Math.round(B.mid + sd * GB.dx - x), cy = Math.round(B.uy + GB.y - y);
                  for (let j = -R; j <= R; j += 2) for (let i = -R; i <= R; i += 2) {
                    if (i * i + j * j > R * R) continue;
                    all++;
                    const px = cx + i, py = cy + j;
                    if (px >= 0 && py >= 0 && px < w && py < h2 && d[(py * w + px) * 4 + 3] > 60) hit++;
                  }
                }
                v = all ? hit / all : 0;
                BREAST.cover.size > 2e3 && BREAST.cover.clear(), BREAST.cover.set(key, v);
                return v;
              };
              const distMap = (alpha, w, h2) => {
                const d = new Float32Array(w * h2), BIG = 1e6, D = 1.4142;
                for (let i = 0; i < d.length; i++) d[i] = alpha[i] > 60 ? BIG : 0;
                for (let yy = 0; yy < h2; yy++) for (let xx = 0; xx < w; xx++) {
                  const i = yy * w + xx;
                  if (!d[i]) continue;
                  let v = d[i];
                  if (xx > 0) v = Math.min(v, d[i - 1] + 1);
                  if (yy > 0) {
                    v = Math.min(v, d[i - w] + 1);
                    if (xx > 0) v = Math.min(v, d[i - w - 1] + D);
                    if (xx < w - 1) v = Math.min(v, d[i - w + 1] + D);
                  }
                  d[i] = v;
                }
                for (let yy = h2 - 1; yy >= 0; yy--) for (let xx = w - 1; xx >= 0; xx--) {
                  const i = yy * w + xx;
                  if (!d[i]) continue;
                  let v = d[i];
                  if (xx < w - 1) v = Math.min(v, d[i + 1] + 1);
                  if (yy < h2 - 1) {
                    v = Math.min(v, d[i + w] + 1);
                    if (xx < w - 1) v = Math.min(v, d[i + w + 1] + D);
                    if (xx > 0) v = Math.min(v, d[i + w - 1] + D);
                  }
                  d[i] = v;
                }
                return d;
              };
              const strapHalf = (src, im, x, y, B) => {
                const key = "thin|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.pose;
                let v = BREAST.cover.get(key);
                if (v != null) return v;
                const w = im.naturalWidth, h2 = im.naturalHeight, c = document.createElement("canvas");
                c.width = w;
                c.height = h2;
                const g = c.getContext("2d", { willReadFrequently: true });
                g.drawImage(im, 0, 0);
                const px = g.getImageData(0, 0, w, h2).data, a = new Uint8Array(w * h2);
                for (let i = 0; i < a.length; i++) a[i] = px[i * 4 + 3];
                const d = distMap(a, w, h2), GB = gameBreast(B), R = GB.r + 4, ridge = [];
                for (const sd of [-1, 1]) {
                  const cx = Math.round(B.mid + sd * GB.dx - x), cy = Math.round(B.uy + GB.y - y);
                  for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) {
                    if (i * i + j * j > R * R) continue;
                    const xx = cx + i, yy = cy + j;
                    if (xx < 1 || yy < 1 || xx >= w - 1 || yy >= h2 - 1) continue;
                    const k = yy * w + xx, v0 = d[k];
                    if (v0 < 1) continue;
                    if (v0 >= d[k - 1] && v0 >= d[k + 1] && v0 >= d[k - w] && v0 >= d[k + w] && v0 >= d[k - w - 1] && v0 >= d[k - w + 1] && v0 >= d[k + w - 1] && v0 >= d[k + w + 1]) ridge.push(v0);
                  }
                }
                ridge.sort((m, n) => m - n);
                v = ridge.length >= 24 ? ridge[Math.floor(ridge.length * 0.2)] : 0;
                BREAST.cover.size > 2e3 && BREAST.cover.clear(), BREAST.cover.set(key, v);
                return v;
              };
              const TEX = { FuzzyDress: {}, FurCoat: {}, FurBolero: {}, DressFur: {}, FlowerDress: { bl: 9, cell: 34 } };
              const dressDraw = (name, src, x, y, o) => {
                const B = ctx3.breast, im = B && mouldImg(src);
                if (!im) return false;
                const pk0 = (pieceOf(src) || {}).key;
                if (!BREAST.on[pk0] && chestCover(src, im, x, y, B, false) < 0.012 && frameCover(src, im, x, y, B) >= 0.55) {
                  if (frameDraw(name, src, x, y, o)) return true;
                }
                if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0] && underBand(src, im, x, y, B) >= 0.35) BREAST.band[pk0] = true;
                if (BREAST.band[pk0] && !BREAST.on[pk0]) return handDraw(name, src, x, y, o);
                if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0]) {
                  const e0 = edgesOf(src);
                  if (e0) {
                    let t0 = -1;
                    for (let j = 0; j < e0.h; j++) if (e0.L[j] >= 0) {
                      t0 = j;
                      break;
                    }
                    if (t0 >= 0 && y + t0 > B.uy + gameBreast(B).y) return handDraw(name, src, x, y, o);
                  }
                }
                if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0]) return BREAST.holds[pk0] ? handDraw(name, src, x, y, o) : false;
                const pc0 = pieceOf(src), flatK = pc0 && pc0.flat ? 0.87 : 1, wm = pc0 && BREAST.wear[pc0.key] || "", pin = wm === "nipple" || wm === "" && !!pc0 && (NIP_PIECES.test(pc0.name) || NIP_DESC.test(pc0.desc)), mapYp = pin && B.fit.mapYN ? B.fit.mapYN : B.fit.mapY;
                const key = "dress|" + (pin ? "pin|" : "") + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + "|" + (ctx3.belly && !fit.behind && BELLY.auto !== false ? ctx3.sig : "") + "|" + MOULD.ver;
                let c = BREAST.out.get(key);
                if (!c) {
                  const MX = 260, MY = 480, w = im.naturalWidth, h2 = im.naturalHeight, S22 = Object.assign({}, B.S, { sc: B.fit.kx, ro: B.fit.ro, ri: B.fit.ri, rv: B.fit.rv }), G = B.fit.G || FarmBreasts.GAME, sc = S22.sc;
                  c = document.createElement("canvas");
                  c.width = w + MX * 2;
                  c.height = h2 + MY * 2;
                  c.MX = MX;
                  c.MY = MY;
                  const g = c.getContext("2d", { willReadFrequently: true }), midX = MX + B.mid - x, uyc = MY + B.uy - y;
                  const pk = (pieceOf(src) || {}).key || src, CW = c.width, CH = c.height;
                  const overBelly = bellyAuto(src, x, y, ctx3, fit.behind, pk);
                  if (overBelly) g.drawImage(overBelly, MX - MOULD.M, MY);
                  else g.drawImage(im, MX, MY);
                  let sleeves = null, spA = null;
                  if (pc0 && pc0.flat) {
                    const fsrc = String(B.upperSrc).replace("/XLarge", "/FlatMedium").replace("XLarge_", "FlatMedium_").replace(/XLarge(?=[_.])/, "FlatMedium"), fp = edgesOf(fsrc);
                    if (!fp) return false;
                    const fux = MX + B.ux - x, r0 = Math.max(0, Math.round(uyc + G.y1 - 40)), r1 = Math.min(CH, Math.round(uyc + G.y3 + 30));
                    sleeves = document.createElement("canvas");
                    sleeves.width = CW;
                    sleeves.height = CH;
                    const id = g.getImageData(0, r0, CW, r1 - r0), d = id.data, sg0 = sleeves.getContext("2d"), sd = sg0.createImageData(CW, r1 - r0), e = sd.data;
                    for (let j = 0; j < r1 - r0; j++) {
                      const pj = r0 + j - uyc;
                      if (pj < 0 || pj >= fp.h || fp.L[pj] < 0) continue;
                      const L = Math.round(fux + fp.L[pj]), R = Math.round(fux + fp.R[pj]), o2 = j * CW * 4;
                      for (let xx = 0; xx < CW; xx++) {
                        if (xx >= L - 1 && xx <= R + 1) continue;
                        const p = o2 + xx * 4;
                        if (!d[p + 3]) continue;
                        e[p] = d[p];
                        e[p + 1] = d[p + 1];
                        e[p + 2] = d[p + 2];
                        e[p + 3] = d[p + 3];
                        d[p + 3] = 0;
                      }
                    }
                    g.putImageData(id, 0, r0);
                    spA = g.getImageData(0, 0, CW, CH).data;
                    for (let j = 0; j < r1 - r0; j++) {
                      const pj = r0 + j - uyc;
                      if (pj < 0 || pj >= fp.h || fp.L[pj] < 0) continue;
                      const L = Math.round(fux + fp.L[pj]), R = Math.round(fux + fp.R[pj]), o2 = j * CW * 4;
                      for (const [edge, step] of [[R, 1], [L, -1]]) {
                        let src2 = -1;
                        for (let k = 6; k < 12; k++) {
                          const xx = edge - step * k, p = o2 + xx * 4;
                          if (xx >= 0 && xx < CW && d[p + 3] > 200) {
                            src2 = p;
                            break;
                          }
                        }
                        if (src2 < 0) continue;
                        for (let k = 1; k <= 40; k++) {
                          const xx = edge + step * k;
                          if (xx < 0 || xx >= CW) break;
                          const p = o2 + xx * 4;
                          if (d[p + 3] > 200) break;
                          d[p] = d[src2];
                          d[p + 1] = d[src2 + 1];
                          d[p + 2] = d[src2 + 2];
                          d[p + 3] = d[src2 + 3];
                        }
                      }
                    }
                    g.putImageData(id, 0, r0);
                    sg0.putImageData(sd, 0, r0);
                  }
                  const sp = g.getImageData(0, 0, CW, CH).data;
                  if (spA) g.putImageData(new ImageData(spA, CW, CH), 0, 0);
                  const spb = (() => {
                    const cb2 = document.createElement("canvas");
                    cb2.width = CW;
                    cb2.height = CH;
                    const gb = cb2.getContext("2d", { willReadFrequently: true });
                    gb.filter = "blur(1.5px)";
                    gb.drawImage(c, 0, 0);
                    gb.filter = "none";
                    return gb.getImageData(0, 0, CW, CH).data;
                  })();
                  const sharp = (t, w2) => {
                    const u = Math.max(0, Math.min(1, (t - 0.5 + w2) / (2 * w2)));
                    return u * u * (3 - 2 * u);
                  };
                  const sample = (fx, fy, mag, od, o4) => {
                    const ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy, p00 = (iy * CW + ix) * 4, p10 = p00 + 4, p01 = p00 + CW * 4, p11 = p01 + 4;
                    const a00 = sp[p00 + 3] * (1 - ax) * (1 - ay), a10 = sp[p10 + 3] * ax * (1 - ay), a01 = sp[p01 + 3] * (1 - ax) * ay, a11 = sp[p11 + 3] * ax * ay, at = a00 + a10 + a01 + a11;
                    let r = 0, gg = 0, bl = 0;
                    if (at >= 1) {
                      r = (sp[p00] * a00 + sp[p10] * a10 + sp[p01] * a01 + sp[p11] * a11) / at;
                      gg = (sp[p00 + 1] * a00 + sp[p10 + 1] * a10 + sp[p01 + 1] * a01 + sp[p11 + 1] * a11) / at;
                      bl = (sp[p00 + 2] * a00 + sp[p10 + 2] * a10 + sp[p01 + 2] * a01 + sp[p11 + 2] * a11) / at;
                    }
                    let alpha = at;
                    if (mag > 1.15) {
                      const w2 = Math.max(0.06, Math.min(0.5, 0.3 / mag)), P3 = [p00, p10, p01, p11];
                      const b00 = spb[p00 + 3] * (1 - ax) * (1 - ay), b10 = spb[p10 + 3] * ax * (1 - ay), b01 = spb[p01 + 3] * (1 - ax) * ay, b11 = spb[p11 + 3] * ax * ay, bt = b00 + b10 + b01 + b11;
                      let amin = 255, amax = 0, aEnds = 0, aN = 0;
                      for (let yy = iy - 1; yy <= iy + 2; yy++) for (let xx = ix - 1; xx <= ix + 2; xx++) {
                        if (xx < 0 || yy < 0 || xx >= CW || yy >= CH) continue;
                        const a = sp[(yy * CW + xx) * 4 + 3];
                        aN++;
                        if (a < 20 || a > 235) aEnds++;
                        if (a < amin) amin = a;
                        if (a > amax) amax = a;
                      }
                      if (amax - amin > 140 && aEnds >= aN * 0.75) alpha = amin + (amax - amin) * sharp((bt - amin) / (amax - amin), w2);
                      let lo = -1, hi = -1, lmin = 1e9, lmax = -1, n = 0;
                      const Q = [];
                      for (let yy = iy - 1; yy <= iy + 2; yy++) for (let xx = ix - 1; xx <= ix + 2; xx++) {
                        if (xx < 0 || yy < 0 || xx >= CW || yy >= CH) continue;
                        const p = (yy * CW + xx) * 4;
                        if (sp[p + 3] < 200) continue;
                        Q.push(p);
                        n++;
                        const L = sp[p] * 0.3 + sp[p + 1] * 0.59 + sp[p + 2] * 0.11;
                        if (L < lmin) {
                          lmin = L;
                          lo = p;
                        }
                        if (L > lmax) {
                          lmax = L;
                          hi = p;
                        }
                      }
                      if (n >= 2 && bt >= 1) {
                        const dr = sp[hi] - sp[lo], dg = sp[hi + 1] - sp[lo + 1], db2 = sp[hi + 2] - sp[lo + 2], dd = dr * dr + dg * dg + db2 * db2;
                        if (dd > 900) {
                          let two2 = true, ends = 0;
                          for (const p of Q) {
                            const er = sp[p] - sp[lo], eg = sp[p + 1] - sp[lo + 1], eb = sp[p + 2] - sp[lo + 2], u = Math.max(0, Math.min(1, (er * dr + eg * dg + eb * db2) / dd)), qr = er - u * dr, qg = eg - u * dg, qb = eb - u * db2;
                            if (qr * qr + qg * qg + qb * qb > dd * 0.03 + 60) {
                              two2 = false;
                              break;
                            }
                            if (u < 0.12 || u > 0.88) ends++;
                          }
                          if (ends < Q.length * 0.5) two2 = false;
                          if (two2) {
                            const br2 = (spb[p00] * b00 + spb[p10] * b10 + spb[p01] * b01 + spb[p11] * b11) / bt, bg = (spb[p00 + 1] * b00 + spb[p10 + 1] * b10 + spb[p01 + 1] * b01 + spb[p11 + 1] * b11) / bt, bb = (spb[p00 + 2] * b00 + spb[p10 + 2] * b10 + spb[p01 + 2] * b01 + spb[p11 + 2] * b11) / bt;
                            const ts = sharp(((br2 - sp[lo]) * dr + (bg - sp[lo + 1]) * dg + (bb - sp[lo + 2]) * db2) / dd, w2), tr = ((r - sp[lo]) * dr + (gg - sp[lo + 1]) * dg + (bl - sp[lo + 2]) * db2) / dd;
                            const t = Math.abs(tr - ts) > 0.65 ? Math.max(0, Math.min(1, tr)) : ts;
                            r = sp[lo] + dr * t;
                            gg = sp[lo + 1] + dg * t;
                            bl = sp[lo + 2] + db2 * t;
                          }
                        }
                      }
                    }
                    od[o4] = r;
                    od[o4 + 1] = gg;
                    od[o4 + 2] = bl;
                    od[o4 + 3] = alpha;
                    return alpha;
                  };
                  const gUnderY = (G.cy || 330) + (G.rv || 42) + 4, y1 = uyc + G.y1, y2 = uyc + G.y2, y3 = uyc + Math.min(G.y3, gUnderY), flapEnd = uyc + mapYp(Math.min(G.y3, gUnderY));
                  const span = pieceSpan(pk, src, x, y), pb = span.bottom > 0 ? MY + span.bottom - y : 0;
                  const drape = pb > flapEnd + 24;
                  const sm = (t) => {
                    t = Math.max(0, Math.min(1, t));
                    return t * t * (3 - 2 * t);
                  };
                  const grown = (yn) => 1 + (sc - 1) * sm((yn - y1) / (y2 - y1));
                  const lands = (yn) => uyc + mapYp(yn - uyc);
                  const ynMax = y3, yEnd = Math.min(CH - 2, Math.floor(flapEnd));
                  const prof = edgesOf(B.upperSrc), ux = MX + B.ux - x, bcy = MY + B.ry - y + S22.by, bcx = [midX + (B.rx - B.mid) - S22.bx, midX + (B.rx - B.mid) + S22.bx];
                  const onBreast = (qx, qy) => {
                    for (let k = 0; k < 2; k++) {
                      const dx = qx - bcx[k], rxk = (k ? dx > 0 : dx < 0) ? S22.ro : S22.ri, dy = (qy - bcy) / (S22.rv + 2);
                      if (dx / (rxk + 2) * (dx / (rxk + 2)) + dy * dy <= 1) return true;
                    }
                    return false;
                  };
                  const x0 = Math.max(0, Math.floor(midX - 110 * sc)), bw = Math.min(CW - x0, Math.ceil(220 * sc)), y0 = Math.max(0, Math.floor(y1)), bh = Math.min(CH - 2, Math.max(yEnd, Math.floor(BREAST.solid[pk] ? Math.min(pb > 0 ? pb : flapEnd, MY + B.ry - y + S22.by + S22.rv * 2.4) : 0))) - y0 + 1;
                  if (bw > 0 && bh > 0) {
                    const out2 = g.createImageData(bw, bh), od = out2.data, hi = g.createImageData(bw, bh);
                    const fxA = new Float32Array(bw * bh).fill(-1), fyA = new Float32Array(bw * bh), magA = new Float32Array(bw * bh);
                    const pj1 = Math.round(y1 - uyc), bodyHalf = prof && pj1 >= 0 && pj1 < prof.h && prof.L[pj1] >= 0 ? Math.max(midX - (ux + prof.L[pj1]), ux + prof.R[pj1] - midX) : 80;
                    const slopeEnd = bcy - S22.rv * 0.65, sideHalf = S22.bx + S22.ro * 0.76;
                    const slopeHalf = (qy) => {
                      const t = Math.max(0, Math.min(1, (qy - y1) / Math.max(1, slopeEnd - y1)));
                      return bodyHalf + (sideHalf - bodyHalf) * t * t * (3 - 2 * t);
                    };
                    const nipPull = (() => {
                      if (true) return null;
                      const G0 = FarmBreasts.GAME, gx = G0.dx + 4, gy = G0.cy - 0.43 * G0.rv;
                      const land = B.fit.ti + (gx - B.fit.gi) * (B.fit.to - B.fit.ti) / Math.max(1, B.fit.go - B.fit.gi), landY = uyc + B.fit.mapY(gy), R = S22.r * 0.95;
                      return B.nips.map((p, i) => {
                        const tx = MX + p[0] - x, ty = MY + p[1] - y;
                        return { tx, ty, dx: midX + (i ? 1 : -1) * land - tx, dy: landY - ty, R };
                      });
                    })();
                    const kyAt = (yn2) => Math.max(0.2, B.fit.mapY(yn2 - uyc + 1) - B.fit.mapY(yn2 - uyc));
                    const FT = B.fit, srcOff = (off, sg) => {
                      if (FT.to == null || sc <= 1.001) return off / sg;
                      const e = Math.max(0, Math.min(1, (sg - 1) / (sc - 1))), a = Math.abs(off);
                      const m = a <= FT.ti ? FT.ti > 0.5 ? a * FT.gi / FT.ti : FT.gi : FT.tn == null || !pin ? FT.gi + (a - FT.ti) * (FT.go - FT.gi) / Math.max(1, FT.to - FT.ti) : a <= FT.tn ? FT.gi + (a - FT.ti) * (FT.gn - FT.gi) / Math.max(1, FT.tn - FT.ti) : FT.gn + (a - FT.tn) * (FT.go - FT.gn) / Math.max(1, FT.to - FT.tn);
                      return (off < 0 ? -1 : 1) * ((1 - e) * a + e * m);
                    };
                    const groundRow = B.ground < 1e8 ? MY + B.ground - y - 1 : 1e9;
                    const tentOn = false, tEnd = tentOn ? Math.min(pb > 0 ? pb : flapEnd, bcy + S22.rv * 2.4) : 0;
                    const bodyHalfAt = (qy) => {
                      const pj = Math.round(qy - uyc);
                      return prof && pj >= 0 && pj < prof.h && prof.L[pj] >= 0 ? Math.max(midX - (ux + prof.L[pj]), ux + prof.R[pj] - midX) : 80;
                    };
                    const tentTop = S22.bx + S22.ro * 0.96, tentBot = tentOn ? bodyHalfAt(tEnd) + 1 : 0;
                    const tentHalf = (qy) => {
                      const t = Math.max(0, Math.min(1, (qy - bcy) / Math.max(1, tEnd - bcy)));
                      return tentTop + (tentBot - tentTop) * Math.pow(t, 1.25);
                    };
                    const solidRows = /* @__PURE__ */ new Map(), rowSolid = (qy) => {
                      let v = solidRows.get(qy);
                      if (v != null) return v;
                      const hb = bodyHalfAt(qy), yy = Math.round(qy);
                      let n = 0, k = 0;
                      for (let xx = Math.round(midX - hb * 0.9); xx <= Math.round(midX + hb * 0.9); xx += 2) {
                        k++;
                        if (xx >= 0 && xx < CW && yy >= 0 && yy < CH && sp[(yy * CW + xx) * 4 + 3] > 60) n++;
                      }
                      v = k > 0 && n / k >= 0.85;
                      solidRows.set(qy, v);
                      return v;
                    };
                    let yn = y1;
                    for (let j = 0; j < bh; j++) {
                      const qy = y0 + j;
                      while (yn < ynMax && lands(yn + 0.25) < qy) yn += 0.25;
                      const sg = grown(yn), pj = Math.round(qy - uyc), tl = prof && pj >= 0 && pj < prof.h ? prof.L[pj] : -1, tr = tl >= 0 ? prof.R[pj] : -1;
                      for (let i = 0; i < bw; i++) {
                        const qx = x0 + i;
                        if (qy > groundRow) continue;
                        const inRows = qy <= yEnd, under = tentOn && qy > bcy;
                        const onB = inRows && onBreast(qx, qy), onBody = inRows && !under && (!drape || qy <= bcy) && (prof ? tl >= 0 && qx >= ux + tl && qx <= ux + tr : Math.abs(qx - midX) <= 80);
                        const bridge = inRows && !onB && qy > bcy && Math.abs(qx - midX) < S22.bx && qy <= bcy + S22.rv * (0.94 + 0.06 * Math.pow(Math.abs(qx - midX) / S22.bx, 2));
                        const onSlope = inRows && !onB && !onBody && qy <= slopeEnd && Math.abs(qx - midX) <= slopeHalf(qy);
                        const th = under && qy <= tEnd && rowSolid(qy) ? tentHalf(qy) : 0, bh2 = th ? bodyHalfAt(qy) : 0, onTent = th > bh2 + 1 && !onB && !bridge && Math.abs(qx - midX) <= th;
                        if (!(onB || onBody || bridge || onSlope || onTent)) continue;
                        const o4 = (j * bw + i) * 4;
                        if (!onSlope) hi.data[o4 + 3] = 255;
                        let px2 = qx, pyS = 0;
                        if (nipPull && !onTent) {
                          const np = nipPull[qx < midX ? 0 : 1], dd = Math.hypot(qx - np.tx, qy - np.ty);
                          if (dd < np.R) {
                            const wv = Math.pow(1 - dd / np.R, 2) * (3 - 2 * (1 - dd / np.R));
                            px2 = qx + np.dx * wv;
                            pyS = np.dy * wv;
                          }
                        }
                        const asIs = !onB && !onTent && !bridge && qy > bcy;
                        const fx = asIs ? qx : onTent ? midX + (qx - midX) * bh2 / th : midX + srcOff(px2 - midX, sg) * flatK, fy = asIs ? qy : onTent ? qy : yn + pyS / kyAt(yn), ix = Math.floor(fx), iy = Math.floor(fy);
                        if (ix < 0 || iy < 0 || ix >= CW - 1 || iy >= CH - 1) continue;
                        const mg = asIs ? 1 : Math.max(sg, kyAt(yn));
                        if (asIs && spA) {
                          const p = (qy * CW + qx) * 4;
                          if (spA[p + 3] < 1) {
                            od[o4 + 3] = 0;
                            continue;
                          }
                          od[o4] = spA[p];
                          od[o4 + 1] = spA[p + 1];
                          od[o4 + 2] = spA[p + 2];
                          od[o4 + 3] = spA[p + 3];
                          continue;
                        }
                        const at = sample(fx, fy, mg, od, o4);
                        if (at < 1) {
                          od[o4 + 3] = 0;
                          continue;
                        }
                        if (!asIs && !onSlope) {
                          fxA[j * bw + i] = fx;
                          fyA[j * bw + i] = fy;
                          magA[j * bw + i] = mg;
                        }
                        if (groundRow < 1e8 && groundRow - qy < 16) od[o4 + 3] = at * Math.max(0.1, (groundRow - qy) / 16);
                      }
                    }
                    const texOf = (() => {
                      const tx = TEX[(pieceOf(src) || {}).name];
                      if (!tx) return null;
                      const BL = tx.bl || 7, S4 = tx.cell || 30;
                      const spL = (() => {
                        const cb2 = document.createElement("canvas");
                        cb2.width = CW;
                        cb2.height = CH;
                        const gb = cb2.getContext("2d", { willReadFrequently: true });
                        gb.filter = "blur(" + BL + "px)";
                        gb.drawImage(c, 0, 0);
                        gb.filter = "none";
                        return gb.getImageData(0, 0, CW, CH).data;
                      })();
                      const lum = (A, p) => A[p] * 0.3 + A[p + 1] * 0.59 + A[p + 2] * 0.11;
                      const ch = [[], [], []];
                      for (const sd of [-1, 1]) for (let yy = Math.round(uyc + G.cy - G.rv * 0.6); yy < Math.round(uyc + G.cy + G.rv * 0.6); yy += 2) for (let xx = Math.round(midX + sd * G.dx - G.ro * 0.6); xx < Math.round(midX + sd * G.dx + G.ro * 0.6); xx += 2) {
                        if (xx < 0 || yy < 0 || xx >= CW || yy >= CH) continue;
                        const p = (yy * CW + xx) * 4;
                        if (sp[p + 3] < 250) continue;
                        const t = spL[p] + spL[p + 1] + spL[p + 2] || 1;
                        ch[0].push(spL[p] / t);
                        ch[1].push(spL[p + 1] / t);
                        ch[2].push(spL[p + 2] / t);
                      }
                      if (ch[0].length < 300) return null;
                      const bn = ch.map((a) => {
                        a.sort((p, q2) => p - q2);
                        return a[a.length >> 1];
                      });
                      const rx0 = Math.max(1, Math.round(midX - G.dx - G.ro - 30)), rx1 = Math.min(CW - 2, Math.round(midX + G.dx + G.ro + 30)), ry0 = Math.max(1, Math.round(uyc + G.y1)), ry1 = Math.min(CH - 2, Math.round(uyc + G.y3 + 90));
                      const RW = rx1 - rx0 + 1, RH = ry1 - ry0 + 1, clean3 = new Uint8Array(RW * RH);
                      let nC = 0, sD = 0, bl = 0;
                      for (let yy = ry0; yy <= ry1; yy++) for (let xx = rx0; xx <= rx1; xx++) {
                        const p = (yy * CW + xx) * 4;
                        if (sp[p + 3] < 250) continue;
                        const t = spL[p] + spL[p + 1] + spL[p + 2] || 1;
                        if (Math.abs(spL[p] / t - bn[0]) + Math.abs(spL[p + 1] / t - bn[1]) + Math.abs(spL[p + 2] / t - bn[2]) > 0.05) continue;
                        const gr = Math.abs(lum(spL, p + 4) - lum(spL, p - 4)) + Math.abs(lum(spL, p + CW * 4) - lum(spL, p - CW * 4));
                        if (gr > 9) continue;
                        clean3[(yy - ry0) * RW + (xx - rx0)] = 1;
                        nC++;
                        sD += Math.abs(lum(sp, p) - lum(spL, p));
                        bl += lum(spL, p);
                      }
                      if (nC < 800) return null;
                      const det = sD / nC;
                      if (det < 2.5) return null;
                      const I = new Float32Array((RW + 1) * (RH + 1));
                      for (let yy = 0; yy < RH; yy++) {
                        let row = 0;
                        for (let xx = 0; xx < RW; xx++) {
                          row += clean3[yy * RW + xx];
                          I[(yy + 1) * (RW + 1) + xx + 1] = I[yy * (RW + 1) + xx + 1] + row;
                        }
                      }
                      const box2 = (x2, y4, r) => {
                        const a = Math.max(0, x2 - r), b = Math.max(0, y4 - r), c2 = Math.min(RW, x2 + r + 1), d2 = Math.min(RH, y4 + r + 1);
                        return (I[d2 * (RW + 1) + c2] - I[b * (RW + 1) + c2] - I[d2 * (RW + 1) + a] + I[b * (RW + 1) + a]) / ((2 * r + 1) * (2 * r + 1));
                      };
                      const srcs = [];
                      for (let yy = S4; yy < RH - S4; yy += 3) for (let xx = S4; xx < RW - S4; xx += 3) if (clean3[yy * RW + xx] && box2(xx, yy, S4) > 0.8) srcs.push([xx + rx0, yy + ry0]);
                      if (srcs.length < 4) return null;
                      return { S: S4, spL, srcs, bn, base: bl / nC, det, cleanAt: (x2, y4) => {
                        const xx = Math.round(x2) - rx0, yy = Math.round(y4) - ry0;
                        return xx >= 0 && yy >= 0 && xx < RW && yy < RH && clean3[yy * RW + xx] === 1;
                      } };
                    })();
                    if (texOf) {
                      const { S: S4, spL, srcs, bn, base, cleanAt } = texOf, lum = (A, p) => A[p] * 0.3 + A[p + 1] * 0.59 + A[p + 2] * 0.11;
                      const bil = (A, fx, fy, k) => {
                        const ix = Math.floor(fx), iy = Math.floor(fy);
                        if (ix < 0 || iy < 0 || ix >= CW - 1 || iy >= CH - 1) return -1;
                        const ax = fx - ix, ay = fy - iy, p = (iy * CW + ix) * 4 + k;
                        return A[p] * (1 - ax) * (1 - ay) + A[p + 4] * ax * (1 - ay) + A[p + CW * 4] * (1 - ax) * ay + A[p + CW * 4 + 4] * ax * ay;
                      };
                      const pick = (ci, cj) => {
                        let hsh = ci * 73856093 ^ cj * 19349663 ^ srcs.length;
                        hsh = Math.imul(hsh ^ hsh >>> 13, 1540483477);
                        hsh ^= hsh >>> 15;
                        return srcs[Math.abs(hsh) % srcs.length];
                      };
                      const sm2 = (t) => t * t * (3 - 2 * t);
                      for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
                        const pi = j * bw + i;
                        if (fxA[pi] < 0) continue;
                        const o4 = pi * 4;
                        if (od[o4 + 3] < 200) continue;
                        const mg = magA[pi], wm2 = Math.max(0, Math.min(1, (mg - 1.2) / 0.5));
                        if (wm2 <= 0) continue;
                        const fx = fxA[pi], fy = fyA[pi], Lr = bil(spL, fx, fy, 0), Lg = bil(spL, fx, fy, 1), Lb = bil(spL, fx, fy, 2);
                        if (Lr < 0) continue;
                        const ls = Lr + Lg + Lb || 1, dc = Math.abs(Lr / ls - bn[0]) + Math.abs(Lg / ls - bn[1]) + Math.abs(Lb / ls - bn[2]), lk = (Lr * 0.3 + Lg * 0.59 + Lb * 0.11) / (base || 1);
                        const wc = Math.max(0, Math.min(1, (0.075 - dc) / 0.03)) * (lk > 0.35 && lk < 1.8 ? 1 : 0);
                        if (wc <= 0) continue;
                        const pg = Math.abs(bil(spL, fx + 1.5, fy, 0) - bil(spL, fx - 1.5, fy, 0)) + Math.abs(bil(spL, fx, fy + 1.5, 0) - bil(spL, fx, fy - 1.5, 0)) + Math.abs(bil(spL, fx + 1.5, fy, 1) - bil(spL, fx - 1.5, fy, 1)) + Math.abs(bil(spL, fx, fy + 1.5, 1) - bil(spL, fx, fy - 1.5, 1));
                        const we = Math.max(0, Math.min(1, 1 - (pg - 14) / 24));
                        const w2 = wm2 * wc * we;
                        if (w2 <= 0.01) continue;
                        const qx = i + x0, qy = j + y0, u = qx / S4 - 0.5, v = qy / S4 - 0.5, ci = Math.floor(u), cj = Math.floor(v), du = sm2(u - ci), dv = sm2(v - cj);
                        let sr = 0, sg2 = 0, sb = 0, sw = 0, sw2 = 0;
                        for (const [di, dj, bwt] of [[0, 0, (1 - du) * (1 - dv)], [1, 0, du * (1 - dv)], [0, 1, (1 - du) * dv], [1, 1, du * dv]]) {
                          if (bwt <= 1e-3) continue;
                          const P3 = pick(ci + di, cj + dj), cx = (ci + di + 0.5) * S4, cy = (cj + dj + 0.5) * S4, sx = P3[0] + (qx - cx), sy = P3[1] + (qy - cy);
                          if (!cleanAt(sx, sy)) continue;
                          const p = (Math.round(sy) * CW + Math.round(sx)) * 4;
                          sr += bwt * (sp[p] - spL[p]);
                          sg2 += bwt * (sp[p + 1] - spL[p + 1]);
                          sb += bwt * (sp[p + 2] - spL[p + 2]);
                          sw += bwt;
                          sw2 += bwt * bwt;
                        }
                        if (sw < 0.2) continue;
                        const nrm = 1 / Math.sqrt(sw2), ww = w2 * Math.min(1, (sw - 0.2) / 0.3), k = Math.min(1.6, lk);
                        od[o4] = od[o4] * (1 - ww) + Math.max(0, Math.min(255, Lr + sr * nrm * k)) * ww;
                        od[o4 + 1] = od[o4 + 1] * (1 - ww) + Math.max(0, Math.min(255, Lg + sg2 * nrm * k)) * ww;
                        od[o4 + 2] = od[o4 + 2] * (1 - ww) + Math.max(0, Math.min(255, Lb + sb * nrm * k)) * ww;
                      }
                    }
                    if (tentOn) {
                      const midR = midX - x0, jEnd = Math.min(bh - 1, Math.round(bcy - y0)), side = S22.bx + S22.ro, row = new Uint8ClampedArray(bw * 4);
                      for (const sg2 of [-1, 1]) {
                        const halfOf = (j) => {
                          const o2 = j * bw * 4;
                          let far = 0;
                          for (let d = 1; d < bw; d++) {
                            const i = Math.round(midR + sg2 * d);
                            if (i < 0 || i >= bw) break;
                            if (od[o2 + i * 4 + 3] > 40) far = d;
                          }
                          return far;
                        };
                        let j0 = -1, top = 0;
                        for (let j = 0; j < jEnd; j++) {
                          const hf = halfOf(j);
                          if (hf > 12) {
                            j0 = j;
                            top = hf;
                            break;
                          }
                        }
                        if (j0 < 0 || jEnd - j0 <= 8) continue;
                        for (let j = j0 + 1; j <= jEnd; j++) {
                          const hf = halfOf(j), want = top + (side - top) * (j - j0) / (jEnd - j0);
                          if (hf < 8 || want <= hf + 1) continue;
                          const o2 = j * bw * 4, inner = 0;
                          row.set(od.subarray(o2, o2 + bw * 4));
                          for (let d = 1; d <= want; d++) {
                            const i = Math.round(midR + sg2 * d);
                            if (i < 0 || i >= bw) break;
                            const si = Math.round(midR + sg2 * (inner + (d - inner) * (hf - inner) / (want - inner)));
                            if (si < 0 || si >= bw) continue;
                            od[o2 + i * 4] = row[si * 4];
                            od[o2 + i * 4 + 1] = row[si * 4 + 1];
                            od[o2 + i * 4 + 2] = row[si * 4 + 2];
                            od[o2 + i * 4 + 3] = row[si * 4 + 3];
                          }
                        }
                      }
                    }
                    const T = document.createElement("canvas");
                    T.width = bw;
                    T.height = bh;
                    T.getContext("2d").putImageData(out2, 0, 0);
                    const hole = document.createElement("canvas");
                    hole.width = bw;
                    hole.height = bh;
                    hole.getContext("2d").putImageData(hi, 0, 0);
                    g.globalCompositeOperation = "destination-out";
                    g.drawImage(hole, x0, y0);
                    g.globalCompositeOperation = "source-over";
                    const atop = (draw3) => {
                      g.save();
                      g.globalCompositeOperation = "source-atop";
                      draw3();
                      g.restore();
                    };
                    const ell = (k, grow, dy) => {
                      g.beginPath();
                      g.ellipse(bcx[k] + (k ? 1 : -1) * (S22.ro - S22.ri) / 2, bcy + (dy || 0), (S22.ro + S22.ri) / 2 + grow, S22.rv + grow, 0, 0, Math.PI * 2);
                    };
                    g.drawImage(T, x0, y0);
                    if (pc0 && pc0.flat && chestCover(src, im, x, y, B, false) >= 0.5) {
                      const bl = document.createElement("canvas");
                      bl.width = CW;
                      bl.height = CH;
                      const bg2 = bl.getContext("2d");
                      bg2.filter = "blur(6px)";
                      bg2.drawImage(c, 0, 0);
                      bg2.filter = "none";
                      const mk = document.createElement("canvas");
                      mk.width = CW;
                      mk.height = CH;
                      const mg2 = mk.getContext("2d");
                      mg2.filter = "blur(5px)";
                      mg2.fillStyle = "#000";
                      for (let k = 0; k < 2; k++) {
                        mg2.beginPath();
                        mg2.ellipse(bcx[k] + (k ? 1 : -1) * (S22.ro - S22.ri) / 2, bcy, (S22.ro + S22.ri) / 2 - 8, S22.rv - 8, 0, 0, Math.PI * 2);
                        mg2.fill();
                      }
                      bg2.globalCompositeOperation = "destination-in";
                      bg2.drawImage(mk, 0, 0);
                      g.save();
                      g.globalCompositeOperation = "source-atop";
                      g.drawImage(bl, 0, 0);
                      g.restore();
                    }
                    atop(() => {
                      g.beginPath();
                      g.rect(0, 0, CW, CH);
                      for (let k = 0; k < 2; k++) g.ellipse(bcx[k] + (k ? 1 : -1) * (S22.ro - S22.ri) / 2, bcy, (S22.ro + S22.ri) / 2 + 1, S22.rv + 1, 0, 0, Math.PI * 2);
                      g.clip("evenodd");
                      g.beginPath();
                      g.rect(0, bcy + S22.rv * 0.55, CW, CH);
                      g.clip();
                      g.filter = "blur(4px)";
                      g.fillStyle = "rgba(0,0,0,0.20)";
                      for (let k = 0; k < 2; k++) {
                        ell(k, -6, 6 + S22.rv * 0.05);
                        g.fill();
                      }
                    });
                    atop(() => {
                      for (let k = 0; k < 2; k++) {
                        g.save();
                        ell(k, 1, 0);
                        g.clip();
                        const under = g.createLinearGradient(0, bcy + S22.rv * 0.5, 0, bcy + S22.rv);
                        under.addColorStop(0, "rgba(0,0,0,0)");
                        under.addColorStop(1, "rgba(0,0,0,0.16)");
                        g.fillStyle = under;
                        g.fillRect(0, bcy, CW, S22.rv + 4);
                        const hx = bcx[k] - S22.ro * 0.18, hy = bcy - S22.rv * 0.38, light = g.createRadialGradient(hx, hy, 0, hx, hy, S22.rv * 0.6);
                        light.addColorStop(0, "rgba(255,255,255,0.04)");
                        light.addColorStop(1, "rgba(255,255,255,0)");
                        g.fillStyle = light;
                        g.fillRect(0, 0, CW, CH);
                        g.restore();
                      }
                      const cl = g.createLinearGradient(midX - S22.ri * 0.3, 0, midX + S22.ri * 0.3, 0);
                      cl.addColorStop(0, "rgba(0,0,0,0)");
                      cl.addColorStop(0.5, "rgba(0,0,0,0.14)");
                      cl.addColorStop(1, "rgba(0,0,0,0)");
                      g.save();
                      g.beginPath();
                      for (let k = 0; k < 2; k++) g.ellipse(bcx[k] + (k ? 1 : -1) * (S22.ro - S22.ri) / 2, bcy, (S22.ro + S22.ri) / 2, S22.rv, 0, 0, Math.PI * 2);
                      g.clip();
                      g.fillStyle = cl;
                      g.fillRect(midX - S22.ri * 0.3, bcy - S22.rv * 0.35, S22.ri * 0.6, S22.rv * 1.3);
                      g.restore();
                      g.strokeStyle = "rgba(0,0,0,0.42)";
                      g.lineWidth = 1.5;
                      g.lineCap = "round";
                      for (let k = 0; k < 2; k++) {
                        g.beginPath();
                        g.ellipse(bcx[k] + (k ? 1 : -1) * (S22.ro - S22.ri) / 2, bcy, (S22.ro + S22.ri) / 2, S22.rv, 0, Math.PI * 0.08, Math.PI * 0.92);
                        g.stroke();
                      }
                    });
                  }
                  if (sleeves) {
                    g.save();
                    g.globalCompositeOperation = "destination-over";
                    g.drawImage(sleeves, 0, 0);
                    g.restore();
                  }
                  if (ctx3.belly && !fit.behind) {
                    try {
                      const sh = bellyShade(c, x - c.MX, y - c.MY, ctx3);
                      if (sh) {
                        sh.MX = c.MX;
                        sh.MY = c.MY;
                        c = sh;
                      }
                    } catch (e) {
                      console.warn("[body] belly form:", e);
                    }
                  }
                  keepIn(BREAST.out, key, c);
                }
                put2(name, c, x - c.MX, y - c.MY, o);
                return true;
              };
              const ownColour = (src, im) => {
                const key = "col|" + src;
                let v = BREAST.cover.get(key);
                if (v) return v;
                const c = document.createElement("canvas");
                c.width = im.naturalWidth;
                c.height = im.naturalHeight;
                const g = c.getContext("2d", { willReadFrequently: true });
                g.drawImage(im, 0, 0);
                const d = g.getImageData(0, 0, c.width, c.height).data, px = [];
                for (let i = 0; i < d.length; i += 16) if (d[i + 3] > 200) px.push([d[i], d[i + 1], d[i + 2]]);
                px.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
                v = px.length ? px[Math.floor(px.length * 0.6)] : [40, 40, 44];
                BREAST.cover.size > 2e3 && BREAST.cover.clear(), BREAST.cover.set(key, v);
                return v;
              };
              const strapBase = {};
              const strapDraw = (name, src, x, y, o, piece) => {
                const B = ctx3.breast, im = B && mouldImg(src);
                if (!im) return false;
                if (!strapBase[piece.key]) strapBase[piece.key] = src;
                const base = strapBase[piece.key] === src, R = STRAPS[piece.name], tinted = !!(o && o.HexColor);
                const key = "strap|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + "|" + (tinted ? 1 : 0);
                let c = BREAST.out.get(key);
                if (!c) {
                  const MX = 220, MY = 420, w = im.naturalWidth, h2 = im.naturalHeight, S22 = B.S;
                  c = document.createElement("canvas");
                  c.width = w + MX * 2;
                  c.height = h2 + MY * 2;
                  c.MX = MX;
                  c.MY = MY;
                  const g = c.getContext("2d"), ox = MX + B.rx - x, oy = MY + B.ry - y;
                  const P3 = (sd, t) => {
                    const p = FarmBreasts.point(S22, sd, t);
                    return [ox + p[0], oy + p[1]];
                  };
                  const arc = (sd, from, to) => {
                    g.beginPath();
                    for (let j = 0; j <= 60; j++) {
                      const p = P3(sd, from + (to - from) * j / 60);
                      if (j) g.lineTo(p[0], p[1]);
                      else g.moveTo(p[0], p[1]);
                    }
                  };
                  g.drawImage(im, MX, MY);
                  g.globalCompositeOperation = "destination-out";
                  for (const sd of [-1, 1]) {
                    arc(sd, 0, Math.PI * 2);
                    g.closePath();
                    g.fill();
                  }
                  g.globalCompositeOperation = "source-over";
                  if (base) {
                    const col = tinted ? [205, 205, 205] : ownColour(src, im), k = (m) => "rgb(" + col.map((v) => Math.max(0, Math.min(255, Math.round(v * m)))).join(",") + ")";
                    const grow = 1 + 0.5 * S22.k;
                    const strap = (wd, path) => {
                      g.lineCap = "round";
                      g.lineJoin = "round";
                      g.strokeStyle = k(0.35);
                      g.lineWidth = wd + 2.2;
                      path();
                      g.stroke();
                      g.strokeStyle = k(1);
                      g.lineWidth = wd;
                      path();
                      g.stroke();
                      g.strokeStyle = tinted ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)";
                      g.lineWidth = Math.max(1, wd * 0.22);
                      g.save();
                      g.translate(-wd * 0.18, -wd * 0.18);
                      path();
                      g.stroke();
                      g.restore();
                    };
                    const side = (sd, draw3) => {
                      g.save();
                      g.beginPath();
                      if (sd < 0) g.rect(0, 0, ox, c.height);
                      else g.rect(ox, 0, c.width - ox, c.height);
                      g.clip();
                      draw3();
                      g.restore();
                    };
                    const nipY = oy + S22.by + S22.r * (-0.15 + 0.42 * S22.k), topY = oy + S22.by - S22.r * S22.top, botY = oy + S22.by + S22.r * (1 + S22.sag);
                    if (R.across) {
                      const wd = S22.r * R.across;
                      for (const sd of [-1, 1]) side(sd, () => strap(wd, () => {
                        g.beginPath();
                        g.moveTo(ox + sd * (S22.bx + S22.r * 1.02), nipY - S22.r * 0.1);
                        g.quadraticCurveTo(ox + sd * S22.bx, nipY + S22.r * 0.22, ox, nipY - S22.r * 0.05);
                      }));
                    }
                    if (R.over) {
                      const wd = R.over * grow, yy = oy + S22.by - S22.r * 0.62;
                      for (const sd of [-1, 1]) side(sd, () => strap(wd, () => {
                        g.beginPath();
                        g.moveTo(ox + sd * (S22.bx + S22.r * 0.86), yy);
                        g.quadraticCurveTo(ox + sd * S22.bx, yy + S22.r * 0.16, ox, yy - S22.r * 0.02);
                      }));
                    }
                    if (R.under) {
                      const wd = R.under * grow;
                      for (const sd of [-1, 1]) side(sd, () => strap(wd, () => sd > 0 ? arc(sd, -0.02 * Math.PI, Math.PI * 1.04) : arc(sd, Math.PI * 1.02, -0.04 * Math.PI)));
                    }
                    if (R.ring) {
                      const wd = R.ring * grow;
                      for (const sd of [-1, 1]) side(sd, () => strap(wd, () => {
                        arc(sd, 0, Math.PI * 2);
                        g.closePath();
                      }));
                    }
                    if (R.cross) {
                      const wd = R.cross * grow;
                      for (const sd of [-1, 1]) strap(wd, () => {
                        const a = P3(sd, -Math.PI / 2), b = P3(-sd, Math.PI * (sd > 0 ? 0.72 : 0.28));
                        g.beginPath();
                        g.moveTo(a[0], a[1]);
                        g.lineTo(b[0], b[1]);
                      });
                    }
                    if (R.centre) {
                      const wd = R.centre * grow;
                      strap(wd, () => {
                        g.beginPath();
                        g.moveTo(ox, topY + S22.r * 0.25);
                        g.lineTo(ox, botY - S22.r * 0.1);
                      });
                    }
                  }
                  keepIn(BREAST.out, key, c);
                }
                put2(name, c, x - c.MX, y - c.MY, o);
                return true;
              };
              const held = [];
              const PUMP = { cups: [[188, 296, 40, 42], [272, 296, 40, 42]], cupMid: [[207, 316], [293, 316]], join: [250, 376], pumpTop: 700 };
              const pumpDraw = (name, src, x, y, o) => {
                const B = ctx3.breast, im = B && mouldImg(src);
                if (!im || im.naturalHeight < 900) return false;
                const key = "pump|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig;
                let c = BREAST.out.get(key);
                if (!c) {
                  const MX = 320, MY = 200, w = im.naturalWidth, h2 = im.naturalHeight;
                  c = document.createElement("canvas");
                  c.width = w + MX * 2;
                  c.height = h2 + MY * 2;
                  c.MX = MX;
                  c.MY = MY;
                  const g = c.getContext("2d"), N = B.nips.map((p) => [p[0] - x, p[1] - y]);
                  const jx = (N[0][0] + N[1][0]) / 2, jy = Math.min(PUMP.pumpTop - 90, Math.max(N[0][1], N[1][1]) + 40 + 30 * B.k);
                  g.drawImage(im, 0, PUMP.pumpTop, w, h2 - PUMP.pumpTop, MX, MY + PUMP.pumpTop, w, h2 - PUMP.pumpTop);
                  for (let yy = Math.round(jy); yy < PUMP.pumpTop; yy++) {
                    const t = (yy - jy) / (PUMP.pumpTop - jy), sy = PUMP.join[1] + t * (PUMP.pumpTop - PUMP.join[1]);
                    g.drawImage(im, 0, sy, w, 1, MX + (jx - PUMP.join[0]) * (1 - t), MY + yy, w, 1);
                  }
                  g.lineCap = "round";
                  g.lineJoin = "round";
                  for (const [col, wd] of [["rgba(120,126,134,0.9)", 6.5], ["rgba(232,236,240,0.95)", 4.2]]) {
                    g.strokeStyle = col;
                    g.lineWidth = wd;
                    for (let i = 0; i < 2; i++) {
                      g.beginPath();
                      g.moveTo(MX + N[i][0], MY + N[i][1] + 10);
                      g.quadraticCurveTo(MX + N[i][0] + (jx - N[i][0]) * 0.25, MY + jy - 6, MX + jx, MY + jy + 4);
                      g.stroke();
                    }
                  }
                  PUMP.cups.forEach(([sx, sy, sw, sh], i) => g.drawImage(im, sx, sy, sw, sh, MX + N[i][0] - (PUMP.cupMid[i][0] - sx), MY + N[i][1] - (PUMP.cupMid[i][1] - sy), sw, sh));
                  keepIn(BREAST.out, key, c);
                }
                put2(name, c, x - c.MX, y - c.MY, o);
                return true;
              };
              const nipDraw = (name, src, x, y, o) => {
                if (/LactationPump/.test(src)) {
                  try {
                    if (pumpDraw(name, src, x, y, o)) return true;
                  } catch (e) {
                    console.warn("[studio] pump:", e);
                  }
                }
                const B = ctx3.breast, im = B && mouldImg(src);
                if (!im) return false;
                const split = Math.max(0, Math.min(im.naturalWidth, Math.round(B.mid - x))), own = nipHalves(src, split);
                if (!own) return false;
                if (!ctx3.native && groupOf3(src) === "Nipples") ctx3.native = own.map((p) => p && [x + p[0], y + p[1]]);
                const key = src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + "|" + (ctx3.native ? "n" : "o");
                let c = BREAST.out.get(key);
                if (!c) {
                  const MX = 320, MY = 460, w = im.naturalWidth, h2 = im.naturalHeight, kN = B.kN;
                  c = document.createElement("canvas");
                  c.width = w + MX * 2;
                  c.height = h2 + MY * 2;
                  c.MX = MX;
                  c.MY = MY;
                  const g = c.getContext("2d");
                  [[0, split], [split, w - split]].forEach(([sx, sw], i) => {
                    if (sw <= 0) return;
                    const N = ctx3.native && ctx3.native[i] || own[i] && [x + own[i][0], y + own[i][1]];
                    if (!N) return;
                    const T = B.nips[i];
                    g.drawImage(im, sx, 0, sw, h2, MX + (T[0] - x) + (sx + x - N[0]) * kN, MY + (T[1] - y) + (y - N[1]) * kN, sw * kN, h2 * kN);
                  });
                  keepIn(BREAST.out, key, c);
                }
                put2(name, c, x - c.MX, y - c.MY, o);
                return true;
              };
              const before = (src, x, y, o) => {
                if (done || typeof src !== "string") return;
                if (src.includes("/BodyUpper/") && fit.on && fit.behind) {
                  upper = [x, y, src, o && o.HexColor];
                  paint();
                  return;
                }
                if (gate ? gate(src) : lower && prio(src) > 12) paint();
              };
              let upperSkin = null;
              const after = (src, x, y, o) => {
                if (typeof src !== "string") return;
                if (src.includes("/BodyUpper/")) {
                  try {
                    upperSkin = bellySkin(src, o && o.HexColor, FarmBelly.bellyPose(src));
                  } catch (e) {
                  }
                  upper = [x, y, src, o && o.HexColor];
                  ctx3.bodies.push({ src, x, y });
                }
                if (src.includes("/BodyLower/")) {
                  lower = true;
                  ctx3.bodies.push({ src, x, y });
                }
              };
              const wrap = (name) => typeof real[name] === "function" ? (src, x, y, o) => {
                const blink = /Blink$/.test(name);
                if (!blink) {
                  try {
                    before(src, x, y, o);
                  } catch (e) {
                    console.warn("[studio] belly:", e);
                  }
                }
                if (br && typeof src === "string") {
                  const gname = groupOf3(src);
                  if (!done && gname === "Nipples") {
                    held.push([name, src, x, y, o]);
                    return;
                  }
                  if (done && NIP_GROUPS.has(gname)) {
                    try {
                      if (nipDraw(name, src, x, y, o)) return;
                    } catch (e) {
                      console.warn("[studio] nipples:", e);
                    }
                  }
                  if (done && /Decal/i.test(gname) && ctx3.breast && ctx3.breast.pose !== "AllFours") {
                    try {
                      const p0 = edgesOf(src);
                      if (p0) {
                        let t0 = -1, t1 = -1;
                        for (let j = 0; j < p0.h; j++) if (p0.L[j] >= 0) {
                          if (t0 < 0) t0 = j;
                          t1 = j;
                        }
                        if (t0 >= 0) {
                          const cyL = y + (t0 + t1) / 2 - ctx3.breast.uy;
                          put2(name, src, x, y + (ctx3.breast.fit.mapY(cyL) - cyL), o);
                          return;
                        }
                      }
                    } catch (e) {
                      console.warn("[studio] decal:", e);
                    }
                  }
                  if (done && chestSlot(gname) && !/Decal/i.test(gname) && !isMoulded(src)) {
                    const piece = pieceOf(src), how = piece && BREAST.wear[piece.key] || "";
                    try {
                      const im0 = piece && ctx3.breast && mouldImg(src);
                      if (im0 && chestCover(src, im0, x, y, ctx3.breast, true) >= 0.05) ctx3.seen[piece.key] = true;
                      if (im0 && chestCover(src, im0, x, y, ctx3.breast, false) >= 0.012) ctx3.seen["on:" + piece.key] = true;
                      if (im0 && chestCover(src, im0, x, y, ctx3.breast, false) >= 0.6) ctx3.seen["solid:" + piece.key] = true;
                    } catch (e) {
                    }
                    try {
                      if (how === "behind") {
                        if (handDraw(name, src, x, y, o)) return;
                      } else if (how !== "plain" && BREAST.dress) {
                        if (dressDraw(name, src, x, y, o)) return;
                      }
                    } catch (e) {
                      console.warn("[studio] chest wear:", e);
                    }
                  }
                  if (done && BREAST.tuck && (HAND_GROUPS.has(gname) || ARM_GROUPS.has(gname) && !/Rope|Harness|Binder|Jacket|Strait|Dress|Suit|Belt|Yoke|Pillory|Chain|Web|Tape|Bondage/i.test(src.slice(src.lastIndexOf("/") + 1)) || /Hand|Glove|Nail|Ring|Bracelet|Sleeve/i.test(gname)) && ctx3.breast && ctx3.breast.pose !== "AllFours") {
                    try {
                      if (/^Hands/.test(gname)) {
                        const fr = handHidden(src, x, y);
                        if (fr != null) ctx3.handF = Math.max(ctx3.handF || 0, fr);
                      }
                    } catch (e) {
                      console.warn("[studio] hands:", e);
                    }
                    try {
                      if (handDraw(name, src, x, y, o)) return;
                    } catch (e) {
                      console.warn("[studio] hands:", e);
                    }
                  }
                }
                if (GEN.drawn && window.FarmCock && typeof src === "string" && groupOf3(src) === "Pussy" && /Penis/.test(src)) {
                  try {
                    const hard = /\/Hard\//.test(src), skin = upperSkin || FarmBelly.FALLBACK.White;
                    const key = [GEN.kind, GEN.knot, GEN.inches, GEN.girth, GEN.balls, hard, skin.join(",")].join("|");
                    if (GEN.cvKey !== key) {
                      GEN.cv = FarmCock.canvas({ kind: GEN.kind, knot: GEN.knot, inches: GEN.inches, girth: GEN.girth, balls: GEN.balls, hard, skin });
                      GEN.cvKey = key;
                    }
                    if (hard) {
                      if (!blink) ctx3.cock = [GEN.cv, x + 49.5 - GEN.cv.ax, y + 110 - GEN.cv.ay];
                      return;
                    }
                    put2(blink ? "drawImageBlink" : "drawImage", GEN.cv, x + 49.5 - GEN.cv.ax, y + 110 - GEN.cv.ay, {});
                    return;
                  } catch (e) {
                    console.warn("[studio] cock:", e);
                  }
                }
                let drawn = false;
                try {
                  if (ctx3.belly && !fit.behind && typeof src === "string") {
                    const q2 = isMoulded(src), m = q2 ? mouldCanvas(src, x, y, ctx3, q2.key, q2.mode) : bellyAuto(src, x, y, ctx3, fit.behind, (pieceOf(src) || {}).key);
                    const gname2 = groupOf3(src), formed = done && chestSlot(gname2) && gname2 !== "Panties" && (!q2 || q2.mode !== "under") ? m ? bellyShade(m, x - MOULD.M, y, ctx3) : bellyShade(mouldImg(src), x, y, ctx3) : null;
                    if (formed) {
                      put2(name, formed, m ? x - MOULD.M : x, y, o);
                      drawn = true;
                    } else if (m) {
                      put2(name, m, x - MOULD.M, y, o);
                      drawn = true;
                    }
                  }
                } catch (e) {
                  console.warn("[studio] mould:", e);
                }
                if (!drawn) put2(name, src, x, y, o);
                if (!blink) {
                  try {
                    after(src, x, y, o);
                  } catch (e) {
                    console.warn("[studio] belly:", e);
                  }
                }
              } : real[name];
              cb = Object.assign({}, real, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize"), drawImageBlink: wrap("drawImageBlink"), drawImageColorizeBlink: wrap("drawImageColorizeBlink") });
              finish = paint;
            }
          } catch (e) {
            console.warn("[studio] belly hook:", e);
          }
          const out = game(cb);
          if (finish) {
            try {
              finish();
            } catch (e) {
              console.warn("[studio] belly:", e);
            }
          }
          if (finish && seenNow && handFNow && handFNow.v != null) {
            const behind = handFNow.v >= 0.45;
            if (behind !== !!BREAST.handsBehind) {
              BREAST.handsBehind = behind;
              clearTimeout(BREAST.holdT);
              BREAST.holdT = setTimeout(bellyDraw, 40);
            }
          }
          if (finish && seenNow) {
            const sig = Object.keys(seenNow).sort().join("|");
            if (sig !== BREAST.holdSig) {
              BREAST.holds = seenNow;
              BREAST.on = {};
              for (const k of Object.keys(seenNow)) if (k.startsWith("on:")) BREAST.on[k.slice(3)] = true;
              BREAST.solid = {};
              for (const k of Object.keys(seenNow)) if (k.startsWith("solid:")) BREAST.solid[k.slice(6)] = true;
              BREAST.holdSig = sig;
              clearTimeout(BREAST.holdT);
              BREAST.holdT = setTimeout(bellyDraw, 40);
            }
          }
          return out;
        }
      }
      return {
        BELLY,
        FIT0,
        poseKey,
        fitNow,
        bellySkin,
        MOULD,
        mouldKey,
        mouldImg,
        edges,
        edgesOf,
        outline,
        bellyCover,
        bellyAuto,
        pieceSpan,
        bellyRows,
        mouldCanvas,
        BREAST,
        BREAST_SLIDERS,
        keptBytes,
        NIP_GROUPS,
        HAND_GROUPS,
        NIP_PIECES,
        ARM_GROUPS,
        heldNow,
        chestSlot,
        STRAPS,
        gameBreast,
        upperName,
        breastNow,
        setCup,
        cupNow,
        nipHalves,
        GEN,
        draw: draw2
      };
    };
  })();

  // extension/src/belly.js
  var W2 = window;
  var SKIN_TOP = 12;
  var trial = 0;
  var SIZES = [null, { rx: 50, ry: 54, sag: 0.16 }, { rx: 70, ry: 80, sag: 0.22, lift: 5 }, { rx: 92, ry: 112, sag: 0.28, lift: 20 }];
  var FALLBACK = { White: [236, 204, 196], Asian: [232, 200, 164], Black: [120, 86, 70] };
  var clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  var rgb = (c, k) => "rgb(" + clamp(c[0] * k) + "," + clamp(c[1] * k) + "," + clamp(c[2] * k) + ")";
  function bellyPoint(S3, cx, cy, t) {
    const sn = Math.sin(t), cs = Math.cos(t);
    const wide = 1 + S3.sag * sn - S3.sag * 0.55 * (sn < 0 ? sn * sn : 0);
    const drop = sn > 0 ? 1 + S3.sag * 0.35 * sn : 1 - S3.sag * 0.25 * -sn;
    return [cx + S3.rx * cs * wide / (1 + S3.sag), cy + S3.ry * sn * drop / (1 + S3.sag * 0.35)];
  }
  function bellyPath(g, S3, cx, cy, from, to) {
    const steps = 72;
    for (let i = 0; i <= steps; i++) {
      const p = bellyPoint(S3, cx, cy, from + (to - from) * i / steps);
      if (i) g.lineTo(p[0], p[1]);
      else g.moveTo(p[0], p[1]);
    }
  }
  function bellyCanvas(size, skin, pressed) {
    const byHand = typeof size === "object" && !!size, S0 = byHand ? size : SIZES[size];
    if (byHand) size = S0.rx >= 84 ? 3 : S0.rx >= 60 ? 2 : 1;
    const S3 = pressed && !byHand ? { rx: S0.rx * 1.2, ry: S0.ry * 0.6, sag: S0.sag + 0.12 } : S0, pad = 6, w = S3.rx * 2 + pad * 2, hgt = S3.ry * 2 + pad * 2, cx = w / 2, cy = hgt / 2, low = cy + S3.ry * 0.28;
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = hgt;
    const g = cv.getContext("2d");
    const whole = () => {
      g.beginPath();
      bellyPath(g, S3, cx, cy, 0, Math.PI * 2);
      g.closePath();
    };
    const grad = g.createRadialGradient(cx - S3.rx * 0.22, low - S3.ry * 0.42, S3.rx * 0.1, cx, low, S3.ry * 1.05);
    grad.addColorStop(0, rgb(skin, 1.03));
    grad.addColorStop(0.55, rgb(skin, 1));
    grad.addColorStop(1, rgb([skin[0], skin[1] * 0.93, skin[2] * 0.92], 0.94));
    g.fillStyle = grad;
    whole();
    g.fill();
    g.save();
    whole();
    g.clip();
    const under = g.createLinearGradient(0, low + S3.ry * 0.25, 0, cy + S3.ry + pad);
    under.addColorStop(0, "rgba(150,70,60,0)");
    under.addColorStop(1, "rgba(150,70,60,0.22)");
    g.fillStyle = under;
    g.fillRect(0, 0, w, hgt);
    const blush = g.createRadialGradient(cx, low + S3.ry * 0.2, 2, cx, low + S3.ry * 0.2, S3.rx * 0.85);
    blush.addColorStop(0, "rgba(214,120,120,0.14)");
    blush.addColorStop(1, "rgba(214,120,120,0)");
    g.fillStyle = blush;
    g.fillRect(0, 0, w, hgt);
    g.translate(cx - S3.rx * 0.36, low - S3.ry * 0.3);
    g.rotate(-0.22);
    const sh = g.createRadialGradient(0, 0, 0, 0, 0, S3.ry * 0.36);
    sh.addColorStop(0, "rgba(255,255,255,0.8)");
    sh.addColorStop(0.5, "rgba(255,255,255,0.3)");
    sh.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sh;
    g.scale(0.34, 1);
    g.beginPath();
    g.arc(0, 0, S3.ry * 0.36, 0, Math.PI * 2);
    g.fill();
    g.restore();
    g.globalCompositeOperation = "destination-out";
    {
      const fr = Math.min(S3.rx * 0.9, 56);
      g.save();
      g.translate(cx, cy - S3.ry * 0.98);
      g.scale(1, S3.ry * 0.7 / fr);
      const fade = g.createRadialGradient(0, 0, fr * 0.3, 0, 0, fr);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = fade;
      g.beginPath();
      g.arc(0, 0, fr, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    g.globalCompositeOperation = "source-over";
    const up = [0, -0.14, 0.02, 0.3][size] * Math.PI;
    g.strokeStyle = rgb(skin, 0.28);
    g.lineCap = "round";
    g.lineJoin = "round";
    g.lineWidth = 1.5;
    g.beginPath();
    bellyPath(g, S3, cx, cy, -up, Math.PI + up);
    g.stroke();
    g.lineWidth = 2.1;
    g.beginPath();
    bellyPath(g, S3, cx, cy, Math.PI * 0.2, Math.PI * 0.8);
    g.stroke();
    g.strokeStyle = rgb(skin, 0.45);
    g.lineWidth = 1.4;
    g.beginPath();
    const ny = low + S3.ry * 0.12;
    if (size >= 3) {
      g.ellipse(cx, ny, 4.5, 3.2, 0, 0, Math.PI * 2);
    } else {
      g.moveTo(cx - 0.5, ny - S3.ry * 0.07);
      g.quadraticCurveTo(cx + 3, ny, cx - 0.5, ny + S3.ry * 0.07);
    }
    g.stroke();
    if (size >= 2) {
      g.strokeStyle = rgb(skin, 0.72);
      g.lineWidth = 1;
      g.globalAlpha = 0.45;
      g.beginPath();
      g.moveTo(cx, ny + 6);
      g.lineTo(cx, cy + S3.ry * 0.86);
      g.stroke();
      g.globalAlpha = 1;
    }
    if (pressed) {
      const cut = Math.round(cy + S3.ry * (byHand && S0.cut > 0 ? S0.cut : 0.74));
      g.clearRect(0, cut, w, hgt - cut);
      let x0 = cx, x1 = cx;
      for (let t = 0; t <= Math.PI; t += 0.01) {
        const p = bellyPoint(S3, cx, cy, t);
        if (p[1] >= cut) {
          x0 = Math.min(x0, p[0]);
          x1 = Math.max(x1, p[0]);
        }
      }
      g.strokeStyle = rgb(skin, 0.28);
      g.lineWidth = 2;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(x0, cut - 1);
      g.lineTo(x1, cut - 1);
      g.stroke();
      cv.cut = cut;
    }
    return cv;
  }
  function bellyPlace(size, upperX, upperY, cv, pose) {
    const S3 = SIZES[size];
    if (pose === "AllFours") return [upperX + 250 - cv.width / 2, upperY + GROUND_Y - (cv.cut || cv.height)];
    if (pose === "Hogtied") return [upperX + 250 - cv.width / 2, upperY + 300 + S3.ry * 0.34 - cv.height / 2];
    return [upperX + 250 - cv.width / 2, upperY + 392 + S3.ry * 0.62 - (S3.lift || 0) - cv.height / 2];
  }
  var ALL_FOURS_BELLY = false;
  var GROUND_Y = 386;
  function bellyPose(src) {
    const m = /\/BodyUpper\/(AllFours|Hogtied)\//.exec(String(src));
    return m ? m[1] : "";
  }
  function skinPatch(pose) {
    return pose === "AllFours" ? [226, 236] : pose === "Hogtied" ? [226, 236] : [226, 388];
  }
  var SKIN_UNDER = { BodyUpper: 1, BodyLower: 1, Pussy: 1 };
  function skinGate(C) {
    const layers = C && C.AppearanceLayers;
    if (!Array.isArray(layers) || !layers.length) return null;
    const groupOf3 = (l) => l && l.Asset && l.Asset.Group && l.Asset.Group.Name || "";
    let last = -1, at = 0;
    for (let i = 0; i < layers.length; i++) if (SKIN_UNDER[groupOf3(layers[i])]) last = i;
    if (last < 0) return null;
    const slot = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/");
    return (src) => {
      const m = slot.exec(String(src));
      if (!m) return false;
      let i = at;
      while (i < layers.length && groupOf3(layers[i]) !== m[1] && (layers[i].Asset && layers[i].Asset.DynamicGroupName) !== m[1]) i++;
      if (i >= layers.length) return false;
      at = i + 1;
      return i > last;
    };
  }
  var bellyDrawing = { SIZES, bellyCanvas, bellyPlace, bellyPose, skinPatch, skinGate, FALLBACK };
  var pictures = /* @__PURE__ */ new Map();
  function bellyPicture(size, skin, pressed) {
    const key = size + (pressed ? "p" : "") + ":" + skin.map((v) => Math.round(v / 4) * 4).join(",");
    let p = pictures.get(key);
    if (!p) {
      const cv = bellyCanvas(size, skin, pressed);
      p = { url: cv.toDataURL("image/png"), width: cv.width, height: cv.height, cut: cv.cut };
      if (pictures.size > 24) pictures.clear();
      pictures.set(key, p);
    }
    return p;
  }
  function scrubCache() {
    let n = 0;
    try {
      for (const name of ["DrawImageCache", "GLDrawImageCache"]) {
        const m = W2[name];
        if (m && typeof m.forEach === "function" && typeof m.delete === "function") {
          const bad = [];
          m.forEach((v, k) => {
            if (typeof k !== "string") bad.push(k);
          });
          for (const k of bad) {
            m.delete(k);
            n++;
          }
        }
      }
    } catch (e) {
    }
    return n;
  }
  var skinSeen = /* @__PURE__ */ new Map();
  var hexRGB = (h2) => [parseInt(h2.slice(1, 3), 16), parseInt(h2.slice(3, 5), 16), parseInt(h2.slice(5, 7), 16)];
  function skinGuess(src, hex) {
    if (hex) return hexRGB(hex).map((v) => clamp(v * 1.62));
    return /_Black\./.test(src) ? FALLBACK.Black : /_Asian\./.test(src) ? FALLBACK.Asian : FALLBACK.White;
  }
  function skinFor(src, hex) {
    hex = typeof hex === "string" && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "";
    const key = src + "|" + hex, v = skinSeen.get(key);
    if (Array.isArray(v)) return v;
    if (!v) {
      if (skinSeen.size > 16) skinSeen.clear();
      skinSeen.set(key, "loading");
      skinLoad(key, src, hex);
    }
    return skinGuess(src, hex);
  }
  function skinLoad(key, src, hex) {
    const img2 = new Image();
    img2.onload = () => {
      let c = skinGuess(src, hex);
      try {
        const bw = 48, bh = 40, cv = document.createElement("canvas");
        cv.width = bw;
        cv.height = bh;
        const g = cv.getContext("2d"), at = skinPatch(bellyPose(src));
        g.drawImage(img2, -at[0], -at[1]);
        const d = g.getImageData(0, 0, bw, bh).data, good = [];
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && d[i] + d[i + 1] + d[i + 2] > 90 && Math.min(d[i], d[i + 1], d[i + 2]) < 238) good.push([d[i], d[i + 1], d[i + 2]]);
        if (good.length >= 40) {
          good.sort((m, n) => m[0] + m[1] + m[2] - (n[0] + n[1] + n[2]));
          const p = good[Math.floor(good.length * 0.7)];
          c = hex ? hexRGB(hex).map((v) => clamp(v * (p[0] + p[1] + p[2]) / 383)) : p;
        }
      } catch (e) {
      }
      skinSeen.set(key, c);
      try {
        if (trial && W2.Player && typeof W2.CharacterLoadCanvas === "function") W2.CharacterLoadCanvas(W2.Player);
      } catch (e) {
      }
    };
    img2.onerror = () => skinSeen.set(key, skinGuess(src, hex));
    img2.src = src;
  }
  var hooked = false;
  var sdk = null;
  function initBelly(mod2) {
    sdk = mod2;
    setTimeout(scrubCache, 4e3);
  }
  function hookBelly(mod2) {
    if (hooked || !mod2) return;
    hooked = true;
    try {
      mod2.hookFunction("CommonDrawAppearanceBuild", 1, (args, next) => {
        let finish = null;
        try {
          const C = args[0], cb = args[1];
          if (trial && !W2.__farmDrawnBody && C && W2.Player && C.MemberNumber === W2.Player.MemberNumber && cb && typeof cb.drawImage === "function") {
            let upper = null, lower = false, done = false;
            const gate = skinGate(C);
            const prio = (src) => {
              const m = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/").exec(src);
              if (!m) return 99;
              try {
                const g = W2.AssetGroupGet && W2.AssetGroupGet(C.AssetFamily, m[1]);
                return g && typeof g.DrawingPriority === "number" ? g.DrawingPriority : 99;
              } catch (e) {
                return 99;
              }
            };
            const paint = () => {
              if (done || !upper || !lower) return;
              done = true;
              const S3 = SIZES[trial], cv = bellyPicture(trial, skinFor(upper[2], upper[3]), upper[4] === "AllFours");
              const [dx, dy] = bellyPlace(trial, upper[0], upper[1], cv, upper[4]);
              cb.drawImage(cv.url, dx, dy, {});
              if (typeof cb.drawImageBlink === "function") cb.drawImageBlink(cv.url, dx, dy, {});
            };
            const before = (src, x, y, o) => {
              if (done || typeof src !== "string") return;
              if (src.includes("/BodyUpper/")) {
                const pose = bellyPose(src);
                if (pose === "AllFours" && !ALL_FOURS_BELLY) {
                  done = true;
                  return;
                }
                if (pose === "AllFours" || pose === "Hogtied") {
                  upper = [x, y, src, o && o.HexColor, pose];
                  lower = true;
                  paint();
                  return;
                }
              }
              if (gate ? gate(src) : lower && prio(src) > SKIN_TOP) paint();
            };
            const after = (src, x, y, o) => {
              if (typeof src !== "string") return;
              if (src.includes("/BodyUpper/")) upper = [x, y, src, o && o.HexColor, bellyPose(src)];
              if (src.includes("/BodyLower/")) lower = true;
            };
            const wrap = (name) => typeof cb[name] === "function" ? (src, x, y, o) => {
              try {
                before(src, x, y, o);
              } catch (e) {
                console.warn("[Farmhand Companion] belly:", e);
              }
              cb[name](src, x, y, o);
              try {
                after(src, x, y, o);
              } catch (e) {
                console.warn("[Farmhand Companion] belly:", e);
              }
            } : cb[name];
            args[1] = Object.assign({}, cb, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize") });
            finish = paint;
          }
        } catch (e) {
          console.warn("[Farmhand Companion] belly hook:", e);
        }
        const out = next(args);
        if (finish) {
          try {
            finish();
          } catch (e) {
            console.warn("[Farmhand Companion] belly:", e);
          }
        }
        return out;
      });
    } catch (e) {
      console.warn("[Farmhand Companion] belly test unavailable:", e);
    }
  }
  function bellyTrial(n, say) {
    trial = Math.max(0, Math.min(3, Math.round(Number(n)) || 0));
    scrubCache();
    if (trial) hookBelly(sdk);
    const redraw2 = () => {
      try {
        if (W2.Player && typeof W2.CharacterLoadCanvas === "function") W2.CharacterLoadCanvas(W2.Player);
      } catch (e) {
        console.warn("[Farmhand Companion] belly redraw:", e);
      }
    };
    redraw2();
    setTimeout(redraw2, 500);
    setTimeout(redraw2, 1800);
    if (say) say(trial ? "Belly test: " + ["", "small", "medium", "large"][trial] + ". Look at your character with nothing over your middle. Only you can see it. Tell Claude how it looks: the shape, the colour match, where it sits." : "Belly test off.");
  }

  // extension/src/drawnbody.js
  var W3 = window;
  var KEY = "farmhand-drawn-body";
  var SEE_KEY = "farmhand-drawn-body-see";
  var FARM_KEY = "farmhand-drawn-body-farm";
  var CODE_HEAD = "FARMBODY1:";
  var STUDIO = "http://localhost:4780";
  var DEFAULTS = () => ({ v: 1, on: false, cup: 12, breast: {}, wear: {}, belly: null, auto: true, tuck: true, dress: true, mould: { items: [], mode: {} } });
  var S2 = DEFAULTS();
  var sdk2 = null;
  var hooked2 = false;
  var seeOthers = true;
  var farm = null;
  var mine = { S: null, E: null };
  var others = /* @__PURE__ */ new Map();
  function load() {
    try {
      const d = JSON.parse(W3.localStorage.getItem(KEY));
      if (d && typeof d === "object") S2 = Object.assign(DEFAULTS(), d);
    } catch (e) {
    }
    try {
      seeOthers = W3.localStorage.getItem(SEE_KEY) !== "0";
    } catch (e) {
    }
    try {
      const f = JSON.parse(W3.localStorage.getItem(FARM_KEY));
      if (f && typeof f.at === "number" && f.body) {
        const b = clean(f.body);
        if (b) farm = { at: f.at, body: b };
      }
    } catch (e) {
    }
    mine.S = S2;
  }
  var farmMe = null;
  var BELLY_STAGES = [null, { k: 50 / 92, kr: 54 / 112, sag: 0.16, lift: 0 }, { k: 70 / 92, kr: 80 / 112, sag: 0.22, lift: 5 }, { k: 1, kr: 1, sag: 0.28, lift: 20 }, { k: 1.2, kr: 1.2, sag: 0.32, lift: 30 }];
  var bellyMode = () => S2.bellyMode || (S2.bellyOn ? "on" : "farm");
  function bellyAt(base, stage) {
    const out = {}, s = BELLY_STAGES[stage], ref = BELLY_STAGES[3];
    for (const k of ["std", "AllFours", "Hogtied"]) {
      const b = base && base[k] || (k === "std" ? { rx: 92, ry: 112, sag: 0.28, x: 0, y: -20, behind: false, flat: false, cut: 0.74 } : null);
      if (!b) continue;
      if (!s) {
        out[k] = Object.assign({}, b, { on: false });
        continue;
      }
      out[k] = Object.assign({}, b, { on: k === "std" ? true : !!b.on, rx: Math.round((b.rx || 92) * s.k), ry: Math.round((b.ry || 112) * s.kr), sag: Math.max(0, Math.min(0.5, (b.sag || 0.28) * s.sag / ref.sag)), y: (b.y || 0) + (k === "std" ? ref.lift - s.lift : 0) });
    }
    return out;
  }
  function eff() {
    const base = S2.saved || !farm ? S2 : farm.body, e = Object.assign({}, base, { on: S2.on });
    if (S2.cupSet) e.cup = S2.cup;
    else if (farmMe && farmMe.cup >= 1) e.cup = farmMe.cup;
    const mode = bellyMode();
    e.belly = mode === "studio" ? base.belly : bellyAt(base.belly, mode === "off" ? 0 : mode === "on" ? 3 : Math.max(0, Math.min(4, Math.round(Number(farmMe && farmMe.belly) || 0))));
    return e;
  }
  function drawnBodyFarmState(d) {
    if (!d || typeof d !== "object") return;
    const cup = Math.max(0, Math.min(20, Math.round(Number(d.cup) || 0))), belly = Math.max(0, Math.min(4, Math.round(Number(d.belly) || 0)));
    if (farmMe && farmMe.cup === cup && farmMe.belly === belly) return;
    farmMe = { cup, belly };
    if (!S2.on) return;
    if (mine.E) apply(mine.E, eff());
    redraw(60);
    tell(true);
  }
  function save() {
    try {
      W3.localStorage.setItem(KEY, JSON.stringify(S2));
    } catch (e) {
    }
  }
  var made = /* @__PURE__ */ new WeakMap();
  var used = /* @__PURE__ */ new Map();
  var fresh = false;
  var gone = /* @__PURE__ */ new Set();
  function picture(cv) {
    let p = made.get(cv);
    if (p) {
      if (!p.src) return null;
      if (gone.delete(p.src)) fresh = true;
      used.set(p.src, Date.now());
      return p;
    }
    const w = cv.width, h2 = cv.height;
    if (!w || !h2) return null;
    let x0 = w, y0 = h2, x1 = -1, y1 = -1;
    try {
      const d = cv.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h2).data;
      for (let y = 0; y < h2; y++) {
        const o = y * w * 4;
        for (let x = 0; x < w; x++) if (d[o + x * 4 + 3]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    } catch (e) {
      x0 = 0;
      y0 = 0;
      x1 = w - 1;
      y1 = h2 - 1;
    }
    if (x1 < 0) {
      p = { src: null, dx: 0, dy: 0 };
      made.set(cv, p);
      return null;
    }
    const c = W3.document.createElement("canvas");
    c.width = x1 - x0 + 1;
    c.height = y1 - y0 + 1;
    c.getContext("2d").drawImage(cv, -x0, -y0);
    p = { src: c.toDataURL("image/png"), dx: x0, dy: y0 };
    made.set(cv, p);
    if (!used.has(p.src)) fresh = true;
    used.set(p.src, Date.now());
    return p;
  }
  function prune() {
    const old = Date.now() - 3e4;
    let n = 0;
    for (const [src, t] of used) {
      if (t > old) continue;
      used.delete(src);
      gone.add(src);
      n++;
      try {
        const m = W3.GLDrawImageCache;
        if (m && typeof m.delete === "function") m.delete(src);
      } catch (e) {
      }
      try {
        const m = W3.DrawImageCache;
        if (m && typeof m.delete === "function") m.delete(src);
      } catch (e) {
      }
      try {
        const gl = W3.GLDrawCanvas && W3.GLDrawCanvas.GL, tc = gl && gl.textureCache;
        const t2 = tc && tc.get(src);
        if (t2) {
          if (t2.texture) gl.deleteTexture(t2.texture);
          tc.delete(src);
        }
      } catch (e) {
      }
    }
    if (gone.size > 400) gone.clear();
    for (const [mn, o] of others) if (Date.now() - o.at > 36e5 && !charOf(mn)) others.delete(mn);
    for (const [mn, o] of others) if (o.E && Date.now() - o.at > 12e4 && !charOf(mn)) o.E = null;
    return n;
  }
  var charOf = (mn) => W3.Player && W3.Player.MemberNumber === mn ? W3.Player : (W3.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || null;
  var itemOf = (C, g) => C && Array.isArray(C.Appearance) ? C.Appearance.find((a) => a && a.Asset && a.Asset.Group && a.Asset.Group.Name === g) : void 0;
  var againT = /* @__PURE__ */ new Map();
  function redrawMn(mn, soon) {
    clearTimeout(againT.get(mn));
    againT.set(mn, setTimeout(() => {
      try {
        const C = charOf(mn);
        if (C && typeof W3.CharacterLoadCanvas === "function") W3.CharacterLoadCanvas(C);
      } catch (e) {
        console.warn("[Farmhand Companion] drawn body redraw:", e);
      }
    }, soon || 60));
  }
  var redraw = (soon) => {
    if (W3.Player) redrawMn(W3.Player.MemberNumber, soon);
  };
  function makeEngine(mn) {
    if (!W3.FarmBelly) W3.FarmBelly = bellyDrawing;
    if (typeof W3.FarmBodyEngine !== "function" || !W3.FarmBreasts) return null;
    const who = mn == null ? () => W3.Player || null : () => charOf(mn);
    return W3.FarmBodyEngine({
      S: { get C() {
        return who();
      } },
      bodyItem: (g) => itemOf(who(), g),
      setBody: () => {
      },
      // never: their body items are theirs
      redraw: () => mn == null ? redraw(60) : redrawMn(mn, 60),
      picture,
      budget: mn == null ? 192e6 : 96e6
      // how much of its drawings it keeps between drawings (body-engine.js): yours more, everybody else's less
    });
  }
  function engine() {
    if (!mine.E && W3.Player) mine.E = makeEngine(null);
    if (mine.E) apply(mine.E, eff());
    return mine.E;
  }
  function apply(E, s) {
    if (!E) return;
    const B = E.BREAST, b = s.breast || {};
    B.cup = Math.max(0, Math.min(W3.FarmBreasts.CUPS.length - 1, Math.round(Number(s.cup) || 0)));
    for (const k of ["full", "hang", "apart", "x", "y", "nip", "nipY", "nipX"]) if (typeof b[k] === "number" && isFinite(b[k])) B[k] = b[k];
    B.wear = s.wear && typeof s.wear === "object" ? Object.assign({}, s.wear) : {};
    B.out.clear();
    B.cover.clear();
    B.cvKey = "";
    B.holdSig = "";
    const fits = s.belly && typeof s.belly === "object" ? s.belly : null;
    for (const k of Object.keys(E.BELLY.fits)) {
      const f = E.BELLY.fits[k];
      Object.assign(f, E.FIT0(), k === "std" ? {} : { behind: true, y: k === "AllFours" ? -60 : -75 });
      if (fits && fits[k]) Object.assign(f, fits[k]);
    }
    E.BELLY.auto = s.auto !== false;
    B.tuck = s.tuck !== false;
    B.dress = s.dress !== false;
    E.MOULD.items.clear();
    E.MOULD.mode.clear();
    E.MOULD.out.clear();
    for (const it of s.mould && s.mould.items || []) E.MOULD.items.add(String(it));
    for (const [k, m] of Object.entries(s.mould && s.mould.mode || {})) if (E.MOULD.items.has(k)) E.MOULD.mode.set(k, String(m));
    E.GEN.drawn = false;
  }
  function clean(d) {
    if (!d || typeof d !== "object") return null;
    const num = (v, lo, hi, def) => typeof v === "number" && isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def;
    const s = DEFAULTS();
    s.cup = Math.round(num(d.cup, 0, 20, 12));
    for (const k of ["full", "hang", "apart", "x", "y", "nip", "nipY", "nipX"]) {
      const v = d.breast && d.breast[k];
      if (typeof v === "number" && isFinite(v)) s.breast[k] = num(v, -100, 100, 0);
    }
    let n = 0;
    for (const [k, v] of Object.entries(d.wear || {})) if (n < 80 && /^[\w/ -]{1,80}$/.test(k) && ["behind", "plain", "nipple", ""].includes(v)) {
      s.wear[k] = v;
      n++;
    }
    s.belly = {};
    for (const k of ["std", "AllFours", "Hogtied"]) {
      const f = d.belly && d.belly[k];
      if (!f || typeof f !== "object") continue;
      s.belly[k] = { on: !!f.on, behind: !!f.behind, flat: !!f.flat, rx: num(f.rx, 20, 170, 70), ry: num(f.ry, 20, 190, 80), sag: num(f.sag, 0, 0.5, 0.22), x: num(f.x, -120, 120, 0), y: num(f.y, -200, 200, 0), cut: num(f.cut, 0.2, 1, 0.74) };
    }
    s.auto = d.auto !== false;
    s.tuck = d.tuck !== false;
    s.dress = d.dress !== false;
    s.mould = { items: (Array.isArray(d.mould && d.mould.items) ? d.mould.items : []).filter((k) => typeof k === "string" && /^[\w/ -]{1,80}$/.test(k)).slice(0, 60), mode: {} };
    for (const [k, m] of Object.entries(d.mould && d.mould.mode || {})) if (s.mould.items.includes(k) && ["wide", "over", "under"].includes(m)) s.mould.mode[k] = m;
    return s;
  }
  var shareOf = (s) => ({ cup: s.cup, breast: s.breast, wear: s.wear, belly: s.belly, auto: s.auto, tuck: s.tuck, dress: s.dress, mould: s.mould });
  var send = (type, data) => {
    try {
      if (W3.ServerSend && W3.ServerPlayerIsInChatRoom && W3.ServerPlayerIsInChatRoom()) W3.ServerSend("ChatRoomChat", makeMsg(type, data));
    } catch (e) {
    }
  };
  var toldAt = 0;
  var askedAt = 0;
  function tell(force) {
    if (!force && Date.now() - toldAt < 8e3) return;
    toldAt = Date.now();
    send("body", S2.on ? { on: true, body: shareOf(eff()) } : { on: false });
  }
  function ask() {
    if (Date.now() - askedAt < 8e3) return;
    askedAt = Date.now();
    send("bodyAsk", {});
  }
  function onBodyMsg(m) {
    const mn = m.from;
    if (!mn || W3.Player && mn === W3.Player.MemberNumber) return;
    if (m.type === "bodyAsk") {
      if (S2.on) setTimeout(() => tell(), 300 + Math.random() * 1500);
      return;
    }
    if (m.type !== "body") return;
    if (!m.on) {
      if (others.delete(mn)) redrawMn(mn, 60);
      return;
    }
    const s = clean(m.body);
    if (!s) return;
    let o = others.get(mn);
    if (!o) {
      o = { S: s, E: makeEngine(mn), at: Date.now() };
      others.set(mn, o);
    } else {
      o.S = s;
      o.at = Date.now();
    }
    if (o.E) apply(o.E, s);
    hook();
    redrawMn(mn, 120);
    setTimeout(() => redrawMn(mn, 0), 1500);
  }
  function hook() {
    if (hooked2 || !sdk2) return;
    hooked2 = true;
    try {
      sdk2.hookFunction("CommonDrawAppearanceBuild", 2, (args, next) => {
        const C = args[0];
        if (!C) return next(args);
        let E = null;
        if (C === W3.Player) {
          if (S2.on) E = mine.E || engine();
        } else if (seeOthers && typeof C.MemberNumber === "number") {
          const o = others.get(C.MemberNumber);
          if (o) {
            o.at = Date.now();
            if (!o.E) {
              o.E = makeEngine(C.MemberNumber);
              if (o.E) apply(o.E, o.S);
            }
            E = o.E;
          }
        }
        if (!E) return next(args);
        fresh = false;
        let out;
        try {
          out = E.draw(C, args[1], (cb2) => {
            args[1] = cb2;
            return next(args);
          });
        } catch (e) {
          console.warn("[Farmhand Companion] drawn body:", e);
          return next(args);
        }
        if (fresh) {
          const mn = C.MemberNumber;
          redrawMn(mn, 250);
          setTimeout(() => redrawMn(mn, 0), 1200);
        }
        return out;
      });
      sdk2.hookFunction("ChatRoomSync", 0, (args, next) => {
        const r = next(args);
        setTimeout(() => {
          if (S2.on) tell(true);
          if (seeOthers) ask();
        }, 2500);
        return r;
      });
    } catch (e) {
      console.warn("[Farmhand Companion] drawn body unavailable:", e);
      hooked2 = false;
    }
  }
  function initDrawnBody(mod2) {
    sdk2 = mod2;
    load();
    setInterval(prune, 2e4);
    setTimeout(() => {
      if (S2.on && engine()) {
        W3.__farmDrawnBody = true;
        redraw(500);
      }
      hook();
      if (S2.on) tell(true);
      if (seeOthers) ask();
    }, 3e3);
  }
  function drawnBodyState() {
    const up = itemOf(W3.Player, "BodyUpper"), cups = W3.FarmBreasts && W3.FarmBreasts.CUPS || [], e = eff();
    return {
      on: !!S2.on,
      cup: e.cup,
      cupName: cups[e.cup] || "?",
      cups,
      cupSet: !!S2.cupSet,
      farmCup: farmMe && farmMe.cup >= 1 ? farmMe.cup : 0,
      farmBelly: farmMe ? farmMe.belly : 0,
      bellyMode: bellyMode(),
      chest: up && up.Asset ? up.Asset.Name : "",
      fromStudio: !!S2.saved,
      fromFarm: !S2.saved && !!farm,
      belly: !!(e.belly && e.belly.std && e.belly.std.on),
      seeOthers,
      othersHere: Array.from(others.keys()).filter((mn) => charOf(mn)).length
    };
  }
  function farmLookWanted(look) {
    const at = Number(look) || 0;
    return at && (!farm || farm.at !== at) ? farm ? farm.at : 0 : null;
  }
  function onFarmLook(m) {
    const at = Number(m && m.at), b = clean(m && m.body);
    if (!at || !b) return;
    if (farm && farm.at === at) return;
    farm = { at, body: b };
    try {
      W3.localStorage.setItem(FARM_KEY, JSON.stringify(farm));
    } catch (e) {
    }
    if (S2.saved) return;
    if (mine.E) apply(mine.E, eff());
    if (S2.on) {
      redraw(60);
      tell(true);
    }
  }
  function drawnBodyBelly(mode, say) {
    S2.bellyMode = ["farm", "on", "off", "studio"].includes(mode) ? mode : "farm";
    delete S2.bellyOn;
    save();
    if (mine.E) apply(mine.E, eff());
    redraw(60);
    tell(true);
    if (say) say({ farm: "Your belly follows the farm: it shows, and grows, as you fill up or get bred.", on: "Belly always on.", off: "Belly off.", studio: "Your belly is the one your own studio has." }[S2.bellyMode]);
  }
  function drawnBodyUseFarm(say) {
    delete S2.saved;
    S2.cupSet = false;
    save();
    if (mine.E) apply(mine.E, eff());
    redraw(60);
    tell(true);
    if (say) say(farm ? "Back to the farm's look." : "Back to the farm's look: it comes from the farm girl when you're in her room.");
  }
  function drawnBodySet(on2, say) {
    S2.on = !!on2;
    save();
    if (S2.on) {
      if (!engine()) {
        S2.on = false;
        save();
        return say && say("The drawn body didn't load. Reload the page and try again.");
      }
      bellyTrial(0);
      W3.__farmDrawnBody = true;
      hook();
    } else W3.__farmDrawnBody = false;
    tell(true);
    redraw(60);
    setTimeout(() => redraw(0), 800);
    if (say) {
      const st2 = drawnBodyState();
      if (!S2.on) say("Drawn body off. You're the game's own picture again, for you and everybody else.");
      else if (S2.cup >= 6 && st2.chest !== "XLarge") say("Drawn body on, " + st2.cupName + " cup. Your chest needs to be the game's biggest size (wardrobe, body, upper body: the largest) for the drawn breasts to show; the belly and fitting work already.");
      else say("Drawn body on: " + st2.cupName + " cup" + (st2.belly ? " with your belly" : "") + ". Everyone here with the Companion sees it too.");
    }
  }
  function drawnBodySeeOthers(on2, say) {
    seeOthers = !!on2;
    try {
      W3.localStorage.setItem(SEE_KEY, on2 ? "1" : "0");
    } catch (e) {
    }
    for (const mn of others.keys()) redrawMn(mn, 60);
    if (on2) {
      hook();
      ask();
    }
    if (say) say(on2 ? "You'll see other people's drawn bodies." : "Other people are drawn the game's own way on your screen.");
  }
  function drawnBodyCup(i, say) {
    const n = W3.FarmBreasts ? W3.FarmBreasts.CUPS.length : 21;
    if (i === "auto") {
      S2.cupSet = false;
      save();
      if (mine.E) apply(mine.E, eff());
      redraw(60);
      tell(true);
      if (say) say("Your cup follows the farm: " + drawnBodyState().cupName + " now, and it changes as you grow.");
      return;
    }
    S2.cup = Math.max(6, Math.min(n - 1, Math.round(Number(i) || 0)));
    S2.cupSet = true;
    save();
    if (mine.E) apply(mine.E, eff());
    redraw(60);
    tell(true);
    if (say) say("Cup: " + drawnBodyState().cupName + ", whatever the farm does. Pick Follow the farm to have it grow with you again.");
  }
  function take(d, say, from) {
    const s = clean(d);
    if (!s) throw new Error("the settings are damaged");
    s.on = S2.on;
    s.bellyMode = S2.bellyMode;
    s.bellyOn = S2.bellyOn;
    s.cupSet = S2.cupSet;
    s.cup = S2.cupSet ? S2.cup : s.cup;
    s.saved = typeof d.saved === "string" ? d.saved.slice(0, 40) : (/* @__PURE__ */ new Date()).toISOString();
    S2 = s;
    mine.S = S2;
    save();
    if (mine.E) apply(mine.E, eff());
    redraw(60);
    tell(true);
    if (say) say("Settings " + from + " put in: " + drawnBodyState().cupName + " cup" + (S2.belly.std && S2.belly.std.on ? ", your belly" : "") + ", " + Object.keys(S2.wear).length + " piece choices. " + (S2.on ? "" : "Switch the drawn body on to see it."));
    return true;
  }
  function drawnBodyPaste(text, say) {
    try {
      const t = String(text || "").trim();
      if (!t.startsWith(CODE_HEAD)) throw new Error("that isn't a code from the studio (it starts with " + CODE_HEAD + ")");
      const raw = W3.LZString && typeof W3.LZString.decompressFromBase64 === "function" ? W3.LZString.decompressFromBase64(t.slice(CODE_HEAD.length)) : null;
      const d = raw && JSON.parse(raw);
      if (!d || typeof d !== "object" || d.v !== 1) throw new Error("the code is damaged or from a newer studio");
      return take(d, say, "from the code");
    } catch (e) {
      if (say) say("I couldn't read that code: " + (e && e.message || e));
      return false;
    }
  }
  async function drawnBodyFromStudio(say) {
    try {
      const get2 = async (f) => {
        const r = await fetch(STUDIO + "/__studio/fits/" + f, { cache: "no-store" });
        if (!r.ok) throw new Error(f + ": " + r.status);
        return r.json();
      };
      const [br, be, it] = await Promise.all([get2("breasts.json"), get2("belly.json").catch(() => null), get2("items.json").catch(() => null)]);
      if (!br) throw new Error("the studio hasn't saved any breasts yet (Save the breasts)");
      return take({ cup: br.cup, breast: br, wear: br.wear, belly: be && be.fits, tuck: br.tuck, dress: br.dress, mould: it ? { items: it.mould || [], mode: it.mouldMode || {} } : null, saved: br.saved }, say, "from your studio");
    } catch (e) {
      if (say) say("I couldn't reach your studio (" + (e && e.message || e) + "). Is it running? Start the studio.bat, then try again. Or use its Copy for the Companion button and paste the code here.");
      return false;
    }
  }
  function drawnBodyMemory() {
    let kept = 0, engines = 0;
    for (const E of [mine.E, ...Array.from(others.values()).map((o) => o.E)]) if (E) {
      engines++;
      try {
        kept += E.keptBytes ? E.keptBytes() : 0;
      } catch (e) {
      }
    }
    return { engines, others: others.size, pictures: used.size, keptMB: Math.round(kept / 1e6) };
  }

  // studio/web/splatters.js
  (function(root) {
    "use strict";
    function rng(seed) {
      let a = seed >>> 0 || 1;
      return () => {
        a |= 0;
        a = a + 1831565813 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    const KINDS2 = {
      // cum matches the game's own Splatters (Laynie: "match the color and translucency of the games own splatters"): read off its
      // pictures, a cool white, #E3E4E5 in the middle, #C2C3C5 in the shade, #FBFBFB at the shine, solid in the middle, soft at the edges
      cum: { style: "run", base: "#E6E7E8", edge: "#B4B6B9", gloss: "#FDFDFD", alpha: 0.97, run: 1, width: 1, ropes: 1, beads: 0.6 },
      cumThick: { style: "run", base: "#E1E2E3", edge: "#AEB0B3", gloss: "#FDFDFD", alpha: 1, run: 0.7, width: 1.4, ropes: 0.6, beads: 0.8 },
      piss: { style: "run", tint: "#F6D23A", stampAlpha: 0.55, narrow: [0.45, 0.75], long: 1.35, turn: 0.3, texture: "sheen", base: "#F0D040", edge: "#C9A422", gloss: "#FFF6C0", alpha: 0.34, run: 1.6, width: 0.7, beads: 0.3, droplets: 1.5 },
      milk: { style: "run", tint: "#FFFFFF", stampAlpha: 0.8, narrow: [0.6, 0.9], long: 1.2, turn: 0.4, texture: "milky", base: "#FBFBF6", edge: "#DADAD0", gloss: "#FFFFFF", alpha: 0.72, run: 1.4, width: 0.8, beads: 0.4, droplets: 0.8 },
      honey: { style: "run", tint: "#E9A21C", stampAlpha: 0.88, narrow: [1, 1.35], long: 1.15, turn: 0.25, texture: "streaks", base: "#E09A18", edge: "#9C6208", gloss: "#FFE7A3", alpha: 0.74, run: 1.1, width: 1.2, beads: 0.9 },
      maple: { style: "run", tint: "#9A521A", stampAlpha: 0.9, narrow: [0.9, 1.25], long: 1.2, turn: 0.3, texture: "streaks", base: "#94501A", edge: "#56290A", gloss: "#F0B47A", alpha: 0.78, run: 1.3, width: 1, beads: 0.7 },
      chocolate: { style: "run", tint: "#5A3018", narrow: [1, 1.3], long: 1, turn: 0.4, texture: "shine", base: "#4A2814", edge: "#251208", gloss: "#B98A6A", alpha: 0.95, run: 1, width: 1.2, beads: 0.8 },
      strawberry: { style: "run", tint: "#E0304E", stampAlpha: 0.9, narrow: [0.9, 1.2], long: 1.1, turn: 0.35, texture: "seeds", base: "#D52F4C", edge: "#951628", gloss: "#FFB3C0", alpha: 0.8, run: 1.2, width: 1, beads: 0.7, seeds: "#F6E27A" },
      slime: { style: "smear", tint: "#79D04F", stampAlpha: 0.7, narrow: [1.2, 1.6], long: 0.9, turn: 1.2, texture: "bubbles", stampToo: true, base: "#6CC24A", edge: "#3A8226", gloss: "#D9FFC8", alpha: 0.6, run: 1, width: 1.1, beads: 0.6, bubbles: true, also: "run" },
      cream: { style: "smear", base: "#FFF6E4", edge: "#E2D4B4", gloss: "#FFFFFF", alpha: 0.96, run: 0.35, width: 1.2 },
      cake: { style: "smear", smudge: 0.3, sprinkleN: 30, base: "#FFD8E6", edge: "#E3A9BC", gloss: "#FFFFFF", alpha: 0.97, run: 0.2, width: 1.3, patches: "#FFFFFF", crumbs: ["#E8C27A", "#D9A85B", "#C98F45", "#7A4A2A"], sprinkles: ["#FF5C8A", "#5CC8FF", "#FFE05C", "#7CE07C"] },
      mud: { style: "smear", base: "#6B4A2B", edge: "#45301A", gloss: "#9C7A55", alpha: 0.9, run: 0.5, width: 1.2, specks: "#3A2614", also: "run" },
      mash: { style: "smear", base: "#D9C28C", edge: "#B09860", gloss: "#F5E8C2", alpha: 0.95, run: 0.25, width: 1.2, specks: "#A88A4A" }
    };
    function ribbon(ctx3, pts) {
      const L = [], R = [];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i], q2 = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
        let dx = q2[0] - o[0], dy = q2[1] - o[1];
        const l = Math.hypot(dx, dy) || 1;
        dx /= l;
        dy /= l;
        L.push([p[0] - dy * p[2] / 2, p[1] + dx * p[2] / 2]);
        R.push([p[0] + dy * p[2] / 2, p[1] - dx * p[2] / 2]);
      }
      ctx3.beginPath();
      ctx3.moveTo(L[0][0], L[0][1]);
      for (let i = 1; i < L.length; i++) {
        const m = [(L[i - 1][0] + L[i][0]) / 2, (L[i - 1][1] + L[i][1]) / 2];
        ctx3.quadraticCurveTo(L[i - 1][0], L[i - 1][1], m[0], m[1]);
      }
      ctx3.lineTo(L[L.length - 1][0], L[L.length - 1][1]);
      ctx3.lineTo(R[R.length - 1][0], R[R.length - 1][1]);
      for (let i = R.length - 2; i >= 0; i--) {
        const m = [(R[i + 1][0] + R[i][0]) / 2, (R[i + 1][1] + R[i][1]) / 2];
        ctx3.quadraticCurveTo(R[i + 1][0], R[i + 1][1], m[0], m[1]);
      }
      ctx3.lineTo(R[0][0], R[0][1]);
      ctx3.closePath();
      return { L, R };
    }
    function puddle(ctx3, r, x, y, w, h2, rough) {
      const n = 14, pts = [];
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2, k = 1 + (r() - 0.5) * rough;
        pts.push([x + Math.cos(a) * w * k, y + Math.sin(a) * h2 * k]);
      }
      ctx3.beginPath();
      for (let i = 0; i <= n; i++) {
        const p = pts[i % n], q2 = pts[(i + 1) % n], m = [(p[0] + q2[0]) / 2, (p[1] + q2[1]) / 2];
        if (i === 0) ctx3.moveTo(m[0], m[1]);
        else ctx3.quadraticCurveTo(p[0], p[1], m[0], m[1]);
      }
      ctx3.closePath();
    }
    function wet(ctx3, K, a) {
      ctx3.globalAlpha = K.alpha * (a || 1);
      ctx3.fillStyle = K.base;
      ctx3.fill();
      ctx3.globalAlpha = Math.min(1, K.alpha * 0.8);
      ctx3.strokeStyle = K.edge;
      ctx3.lineWidth = 0.9;
      ctx3.stroke();
    }
    function shine(ctx3, K, side, from, to) {
      ctx3.globalAlpha = 0.7;
      ctx3.strokeStyle = K.gloss;
      ctx3.lineWidth = 1.1;
      ctx3.lineCap = "round";
      ctx3.beginPath();
      for (let i = from; i < to; i++) {
        const p = side[i];
        if (i === from) ctx3.moveTo(p[0] + 1.2, p[1]);
        else ctx3.lineTo(p[0] + 1.2, p[1]);
      }
      ctx3.stroke();
    }
    function strandPts(r, x, y, len, w, ang) {
      const n = 12, pts = [], beads = [r(), r(), r()].map((v) => [v, 0.6 + r() * 0.9]);
      let px = x, py = y, a = ang;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        a += (r() - 0.5) * 0.35;
        px += Math.sin(a) * len / n;
        py += Math.cos(a) * len / n;
        let ww = w * (0.55 + 0.25 * (1 - t));
        for (const [bt, bs] of beads) ww += w * bs * Math.exp(-Math.pow((t - bt) / 0.07, 2));
        pts.push([px, py, Math.max(1, ww)]);
      }
      return pts;
    }
    function strandDraw(ctx3, K, pts) {
      const wide = pts.map((p) => [p[0], p[1], p[2] + 1.8]);
      ribbon(ctx3, wide);
      ctx3.globalAlpha = Math.min(1, K.alpha + 0.05);
      ctx3.fillStyle = K.edge;
      ctx3.fill();
      const side = ribbon(ctx3, pts);
      ctx3.globalAlpha = K.alpha;
      ctx3.fillStyle = K.base;
      ctx3.fill();
      ctx3.globalAlpha = 0.85;
      ctx3.strokeStyle = K.gloss;
      ctx3.lineWidth = 1;
      ctx3.lineCap = "round";
      ctx3.beginPath();
      side.L.forEach((p, i) => {
        const q2 = pts[i];
        const x = p[0] * 0.35 + q2[0] * 0.65, y = p[1] * 0.35 + q2[1] * 0.65;
        if (i === 0) ctx3.moveTo(x, y);
        else ctx3.lineTo(x, y);
      });
      ctx3.stroke();
    }
    function strand(ctx3, r, K, x, y, size, ang0) {
      const len = size * (0.25 + r() * 0.55) * (0.6 + K.run * 0.4), w = Math.max(1.6, size * 0.032 * K.width * (0.7 + r() * 0.6)), ang = ang0 !== void 0 ? ang0 : (r() - 0.5) * 0.9;
      const pts = strandPts(r, x, y, len, w, ang);
      if (r() < 0.3) {
        const cut = 4 + Math.floor(r() * 4);
        strandDraw(ctx3, K, pts.slice(0, cut));
        strandDraw(ctx3, K, pts.slice(cut + 2));
      } else strandDraw(ctx3, K, pts);
      {
        const e = pts[pts.length - 1], d = w * (1.1 + r() * 0.6);
        strandDraw(ctx3, K, [[e[0], e[1] - d * 0.4, d], [e[0], e[1], d * 1.25], [e[0], e[1] + d * 0.4, d]]);
      }
      for (let b = 0, nb = r() < 0.6 ? 1 + (r() < 0.35 ? 1 : 0) : 0; b < nb; b++) {
        const p = pts[2 + Math.floor(r() * 7)], side = r() < 0.5 ? -1 : 1;
        strandDraw(ctx3, K, strandPts(r, p[0], p[1], len * (0.3 + r() * 0.35), w * 0.8, ang + side * (0.4 + r() * 0.5)));
      }
      for (let d = 0, nd = Math.floor(r() * 3); d < nd; d++) {
        const p = pts[Math.floor(r() * pts.length)], bx = p[0] + (r() - 0.5) * size * 0.5, by = p[1] + (r() - 0.5) * size * 0.3, bw = w * (0.8 + r() * 0.6);
        strandDraw(ctx3, K, [[bx, by - bw * 0.5, bw], [bx, by, bw * 1.2], [bx, by + bw * 0.5, bw]]);
      }
    }
    function run(ctx3, r, K, x, y, len, w) {
      const steps = 14, pts = [], wob = (r() - 0.5) * 6, swell = r() * Math.PI * 2;
      let px = x;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        px += (r() - 0.5) * 1.4 + wob * 0.06;
        const ww = w * (0.55 + 0.35 * Math.sin(t * 6 + swell) * (r() * 0.5 + 0.5)) * (1 - t * 0.25);
        pts.push([px, y + t * len, Math.max(1.2, ww)]);
      }
      const side = ribbon(ctx3, pts);
      wet(ctx3, K);
      shine(ctx3, K, side.L, 1, Math.floor(steps * 0.7));
      const end = pts[pts.length - 1];
      if (r() < 0.55) {
        puddle(ctx3, r, end[0], end[1] + w * 0.15, w * (0.9 + r() * 0.6), w * (0.45 + r() * 0.25), 0.35);
        wet(ctx3, K);
      } else {
        ctx3.beginPath();
        ctx3.ellipse(end[0], end[1] + w * 0.25, w * 0.55, w * 0.75, 0, 0, Math.PI * 2);
        wet(ctx3, K);
      }
      ctx3.globalAlpha = 0.85;
      ctx3.fillStyle = K.gloss;
      ctx3.beginPath();
      ctx3.arc(end[0] - w * 0.2, end[1], Math.max(0.7, w * 0.12), 0, Math.PI * 2);
      ctx3.fill();
    }
    function splash(ctx3, r, K, x, y, size, amount) {
      const w = size * (0.11 + r() * 0.12) * K.width, h2 = w * (0.35 + r() * 0.2), ang = (r() - 0.5) * 1.2;
      ctx3.save();
      ctx3.translate(x, y);
      ctx3.rotate(ang);
      puddle(ctx3, r, 0, 0, w, h2, 0.55);
      ctx3.restore();
      wet(ctx3, K);
      const n = 1 + Math.round(r() * 2.2 * Math.min(1.4, K.run));
      for (let i = 0; i < n; i++) {
        const sx = x + (r() - 0.5) * w * 1.2, len = size * (0.4 + r() * 1.3) * K.run * (0.8 + amount * 0.25), sw = Math.max(2, w * (0.3 + r() * 0.3));
        run(ctx3, r, K, sx, y + h2 * 0.3, len, sw);
      }
    }
    function rope(ctx3, r, K, x, y, size) {
      const a = (r() - 0.5) * 1.4 + (r() < 0.5 ? 0 : Math.PI), l = size * (0.5 + r() * 0.8), pts = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        pts.push([x + Math.cos(a) * l * t, y + Math.sin(a) * l * t * 0.5 + Math.sin(t * Math.PI) * 6, 1.4 + Math.sin(t * Math.PI) * size * 0.05 * K.width]);
      }
      const side = ribbon(ctx3, pts);
      wet(ctx3, K);
      shine(ctx3, K, side.L, 2, 8);
      if (r() < 0.6) {
        const p = pts[3 + Math.floor(r() * 5)];
        run(ctx3, r, K, p[0], p[1], size * (0.3 + r() * 0.6) * K.run, Math.max(2, p[2] * 1.3));
      }
    }
    function smear(ctx3, r, K, x, y, size) {
      const a = (r() - 0.5) * 1.8, l = size * (0.5 + r() * 0.8), w0 = size * (0.18 + r() * 0.14) * K.width, pts = [];
      for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        pts.push([x + Math.cos(a) * l * (t - 0.5) + (r() - 0.5) * 2, y + Math.sin(a) * l * (t - 0.5) * 0.6 + (r() - 0.5) * 2, w0 * (0.4 + Math.sin(t * Math.PI) * 0.8) * (0.8 + r() * 0.4)]);
      }
      const side = ribbon(ctx3, pts);
      wet(ctx3, K);
      ctx3.globalAlpha = 0.45;
      ctx3.strokeStyle = K.gloss;
      ctx3.lineWidth = 0.9;
      for (let s = 0; s < 3; s++) {
        const off = (r() - 0.5) * w0 * 0.6;
        ctx3.beginPath();
        pts.forEach((p, i) => i ? ctx3.lineTo(p[0], p[1] + off) : ctx3.moveTo(p[0], p[1] + off));
        ctx3.stroke();
      }
      if (K.patches) {
        ctx3.fillStyle = K.patches;
        for (let s = 0; s < 6; s++) {
          const p = (r() < 0.5 ? side.L : side.R)[Math.floor(r() * side.L.length)];
          ctx3.globalAlpha = 0.9;
          puddle(ctx3, r, p[0], p[1], 2 + r() * w0 * 0.35, 1.5 + r() * w0 * 0.2, 0.6);
          ctx3.fill();
        }
      }
      if (r() < K.run) {
        const p = pts[Math.floor(r() * pts.length)];
        run(ctx3, r, K, p[0], p[1] + p[2] * 0.3, size * (0.3 + r() * 0.7) * K.run, Math.max(2.5, p[2] * 0.4));
      }
    }
    const STAMP_FILES = ["Chest1", "Chest2", "Chest3", "Chest4", "Face1", "Face2", "Face3", "Forehead1", "Forehead2", "Forehead3", "Tummy1", "Tummy2", "Tummy3", "Tummy4"];
    const STAMPS = [];
    function cutStamps(img2) {
      const c = document.createElement("canvas");
      c.width = img2.width;
      c.height = img2.height;
      const x = c.getContext("2d");
      x.drawImage(img2, 0, 0);
      const W10 = c.width, H = c.height, d = x.getImageData(0, 0, W10, H).data, seen2 = new Uint8Array(W10 * H), out = [];
      for (let i = 0; i < W10 * H; i++) {
        if (seen2[i] || d[i * 4 + 3] < 16) continue;
        const q2 = [i];
        seen2[i] = 1;
        let x0 = W10, y0 = H, x1 = 0, y1 = 0, n = 0;
        while (q2.length) {
          const p = q2.pop(), px = p % W10, py = p / W10 | 0;
          n++;
          if (px < x0) x0 = px;
          if (px > x1) x1 = px;
          if (py < y0) y0 = py;
          if (py > y1) y1 = py;
          for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
            const nx = px + dx, ny = py + dy;
            if (nx < 0 || ny < 0 || nx >= W10 || ny >= H) continue;
            const k = ny * W10 + nx;
            if (!seen2[k] && d[k * 4 + 3] >= 16) {
              seen2[k] = 1;
              q2.push(k);
            }
          }
        }
        if (n < 25) continue;
        const s2 = document.createElement("canvas");
        s2.width = x1 - x0 + 3;
        s2.height = y1 - y0 + 3;
        s2.getContext("2d").drawImage(c, x0 - 1, y0 - 1, s2.width, s2.height, 0, 0, s2.width, s2.height);
        out.push(s2);
      }
      return out;
    }
    async function loadStamps(base) {
      if (STAMPS.length) return STAMPS.length;
      for (const n of STAMP_FILES) {
        try {
          const img2 = new Image();
          img2.crossOrigin = "anonymous";
          await new Promise((ok2, no) => {
            img2.onload = ok2;
            img2.onerror = no;
            setTimeout(no, 8e3);
            img2.src = (base || "") + "Assets/Female3DCG/BodyMarkings/Splatters_" + n + ".png";
          });
          STAMPS.push(...cutStamps(img2));
        } catch (e) {
        }
      }
      return STAMPS.length;
    }
    const tintCache = /* @__PURE__ */ new Map();
    function tinted(st2, K) {
      if (!K.tint) return st2;
      const key = STAMPS.indexOf(st2) + K.tint;
      if (tintCache.has(key)) return tintCache.get(key);
      const c = document.createElement("canvas");
      c.width = st2.width;
      c.height = st2.height;
      const x = c.getContext("2d");
      x.drawImage(st2, 0, 0);
      x.globalCompositeOperation = "multiply";
      x.fillStyle = K.tint;
      x.fillRect(0, 0, c.width, c.height);
      x.globalCompositeOperation = "destination-in";
      x.drawImage(st2, 0, 0);
      if (K.texture) {
        x.globalCompositeOperation = "source-atop";
        TEXTURES[K.texture](x, c.width, c.height, rng(st2.width * 31 + st2.height));
      }
      tintCache.set(key, c);
      return c;
    }
    const TEXTURES = {
      streaks: (x, w, h2, r) => {
        x.globalAlpha = 0.55;
        x.strokeStyle = "#FFF2B8";
        x.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          const sx = r() * w;
          x.beginPath();
          x.moveTo(sx, 0);
          x.lineTo(sx + (r() - 0.5) * 4, h2);
          x.stroke();
        }
      },
      bubbles: (x, w, h2, r) => {
        x.globalAlpha = 0.7;
        x.strokeStyle = "#E4FFD6";
        x.lineWidth = 0.8;
        for (let i = 0; i < Math.max(2, w * h2 / 120); i++) {
          x.beginPath();
          x.arc(r() * w, r() * h2, 0.8 + r() * 2, 0, Math.PI * 2);
          x.stroke();
        }
      },
      seeds: (x, w, h2, r) => {
        x.globalAlpha = 0.9;
        x.fillStyle = "#F7E27A";
        for (let i = 0; i < Math.max(1, w * h2 / 160); i++) {
          x.beginPath();
          x.ellipse(r() * w, r() * h2, 0.6, 1, r() * 3, 0, Math.PI * 2);
          x.fill();
        }
      },
      shine: (x, w, h2, r) => {
        x.globalAlpha = 0.45;
        x.strokeStyle = "#D8B49A";
        x.lineWidth = 1.2;
        x.beginPath();
        x.moveTo(w * 0.3, 0);
        x.lineTo(w * 0.35, h2);
        x.stroke();
      },
      sheen: (x, w, h2, r) => {
        x.globalAlpha = 0.35;
        x.fillStyle = "#FFFBE0";
        x.fillRect(w * 0.25, 0, w * 0.2, h2);
      },
      milky: (x, w, h2, r) => {
        x.globalAlpha = 0.4;
        x.fillStyle = "#FFFFFF";
        x.fillRect(0, 0, w, h2);
      }
    };
    function stamp(ctx3, r, K, x, y, size) {
      const st2 = STAMPS[Math.floor(r() * STAMPS.length)], img2 = tinted(st2, K), sc = size / 60 * (0.75 + r() * 0.5);
      const flip = r() < 0.5 ? -1 : 1, narrow = K.narrow ? K.narrow[0] + r() * (K.narrow[1] - K.narrow[0]) : 0.85 + r() * 0.3, long = (K.long || 1) * (K.runX || 1);
      ctx3.save();
      ctx3.translate(x, y);
      ctx3.rotate((r() - 0.5) * (K.turn || 0.6));
      ctx3.scale(sc * flip * narrow, sc * long);
      ctx3.globalAlpha = K.stampAlpha || 1;
      ctx3.drawImage(img2, -img2.width / 2, -img2.height * 0.3);
      ctx3.restore();
    }
    function paint(ctx3, kind, opt) {
      const K0 = KINDS2[kind] || KINDS2.cum, K = opt && opt.runX ? Object.assign({}, K0, { run: K0.run * opt.runX, runX: 0.85 + 0.15 * opt.runX }) : K0, r = rng(opt && opt.seed || 1), amount = Math.max(0.3, opt && opt.amount || 1), at = opt && opt.at || [[250, 330, 40]];
      ctx3.save();
      ctx3.lineJoin = "round";
      for (const [ax, ay, size] of at) {
        const spot = () => [ax + (r() - 0.5) * size * 1.5, ay + (r() - 0.5) * size * 0.9];
        if (K.style === "smear") {
          for (let i = 0, n = Math.round((2 + r() * 2) * amount); i < n; i++) {
            const [x, y] = spot();
            smear(ctx3, r, K, x, y, size);
          }
          if (K.also === "run") for (let i = 0, n = Math.round(r() * 2 * amount); i < n; i++) {
            const [x, y] = spot();
            splash(ctx3, r, K, x, y, size * 0.8, amount);
          }
          if (K.stampToo && STAMPS.length) for (let i = 0, n = Math.round((4 + r() * 4) * amount); i < n; i++) {
            const [x, y] = spot();
            stamp(ctx3, r, K, x, y, size);
          }
        } else if (STAMPS.length && K.stamp !== false) {
          for (let i = 0, n = Math.round((10 + r() * 8) * amount); i < n; i++) {
            const a = r() * Math.PI * 2, d = size * Math.sqrt(r()) * 1.5;
            stamp(ctx3, r, K, ax + Math.cos(a) * d, ay + Math.sin(a) * d * 0.7 - size * 0.2, size);
          }
          for (let i = 0, n = Math.round(r() * 1.2 * amount * Math.min(1, K.run - 0.2)); i < n; i++) {
            const [x, y] = spot();
            const p = [x, y];
            run(ctx3, r, K, p[0], p[1], size * (0.4 + r() * 0.9) * K.run, Math.max(2, size * 0.05));
          }
        } else if (K.strands !== false) {
          for (let i = 0, n = Math.round((7 + r() * 6) * amount); i < n; i++) {
            const a = r() * Math.PI * 2, d = size * (0.1 + r() * 0.75), x = ax + Math.cos(a) * d, y = ay + Math.sin(a) * d * 0.7;
            const out = Math.atan2(Math.cos(a), Math.sin(a) * 0.7) * 0.6;
            strand(ctx3, r, K, x, y, size, out + (r() - 0.5) * 0.4);
          }
          for (let i = 0, n = Math.round(r() * 1.6 * amount * Math.min(1, K.run)); i < n; i++) {
            const [x, y] = spot();
            splash(ctx3, r, K, x, y, size * 0.8, amount);
          }
        } else {
          for (let i = 0, n = Math.round((1.5 + r() * 2) * amount); i < n; i++) {
            const [x, y] = spot();
            splash(ctx3, r, K, x, y, size, amount);
          }
          for (let i = 0, n = K.ropes ? Math.round(r() * 2 * K.ropes * amount) : 0; i < n; i++) {
            const [x, y] = spot();
            rope(ctx3, r, K, x, y, size);
          }
        }
        for (let i = 0, n = Math.round((4 + r() * 6) * amount * (K.droplets || 0.5)); i < n; i++) {
          const a = r() * Math.PI * 2, d = size * (0.5 + r() * 0.8);
          ctx3.beginPath();
          ctx3.ellipse(ax + Math.cos(a) * d, ay + Math.sin(a) * d * 0.7, 0.8 + r() * 1.6, 0.8 + r() * 2.2, 0, 0, Math.PI * 2);
          wet(ctx3, K, 0.9);
        }
        if (K.bubbles) for (let i = 0; i < 6 * amount; i++) {
          const [x, y] = spot();
          ctx3.globalAlpha = 0.55;
          ctx3.strokeStyle = K.gloss;
          ctx3.lineWidth = 0.9;
          ctx3.beginPath();
          ctx3.arc(x, y, 1.2 + r() * 3, 0, Math.PI * 2);
          ctx3.stroke();
        }
        if (K.seeds) for (let i = 0; i < 8 * amount; i++) {
          const [x, y] = spot();
          ctx3.globalAlpha = 0.9;
          ctx3.fillStyle = K.seeds;
          ctx3.beginPath();
          ctx3.ellipse(x, y, 0.8, 1.3, r() * 3, 0, Math.PI * 2);
          ctx3.fill();
        }
        if (K.specks) for (let i = 0; i < 16 * amount; i++) {
          const [x, y] = spot();
          ctx3.globalAlpha = 0.75;
          ctx3.fillStyle = K.specks;
          ctx3.beginPath();
          ctx3.arc(x, y, 0.5 + r() * 1.3, 0, Math.PI * 2);
          ctx3.fill();
        }
        if (K.crumbs) for (let i = 0; i < 14 * amount; i++) {
          const [x, y] = spot();
          ctx3.globalAlpha = 1;
          puddle(ctx3, r, x, y, 1.2 + r() * (r() < 0.15 ? 5 : 2.2), 1 + r() * 2, 0.7);
          ctx3.fillStyle = K.crumbs[Math.floor(r() * K.crumbs.length)];
          ctx3.fill();
        }
        if (K.sprinkles) for (let i = 0; i < (K.sprinkleN || 12) * amount; i++) {
          const [x, y] = spot(), a = r() * Math.PI;
          ctx3.globalAlpha = 1;
          ctx3.strokeStyle = K.sprinkles[Math.floor(r() * K.sprinkles.length)];
          ctx3.lineWidth = 1.6;
          ctx3.lineCap = "round";
          ctx3.beginPath();
          ctx3.moveTo(x - Math.cos(a) * 2.2, y - Math.sin(a) * 2.2);
          ctx3.lineTo(x + Math.cos(a) * 2.2, y + Math.sin(a) * 2.2);
          ctx3.stroke();
        }
      }
      ctx3.restore();
    }
    function paintOn(ctx3, body2, kind, opt) {
      const c = document.createElement("canvas");
      c.width = ctx3.canvas.width;
      c.height = ctx3.canvas.height;
      const x = c.getContext("2d");
      paint(x, kind, opt);
      const m = document.createElement("canvas");
      m.width = c.width;
      m.height = c.height;
      const mx = m.getContext("2d");
      const sm = KINDS2[kind] && KINDS2[kind].smudge !== void 0 ? KINDS2[kind].smudge : 1;
      mx.filter = "blur(" + 5 * sm + "px)";
      mx.globalAlpha = 0.5 * sm;
      mx.drawImage(c, 0, 4);
      mx.filter = "blur(" + 3 * sm + "px)";
      mx.globalAlpha = 0.45 * sm;
      mx.drawImage(c, 1, 2);
      mx.filter = "blur(" + Math.max(0.3, 1.2 * sm) + "px)";
      mx.globalAlpha = 0.5;
      mx.drawImage(c, 0, 1);
      mx.filter = "blur(" + Math.max(0.2, 0.9 * sm) + "px)";
      mx.globalAlpha = 0.95;
      mx.drawImage(c, 0, 0);
      if (body2) {
        mx.filter = "none";
        mx.globalCompositeOperation = "destination-in";
        mx.drawImage(body2, 0, 0);
      }
      ctx3.drawImage(m, 0, 0);
    }
    const AREAS3 = {
      face: [250, 185, 34],
      forehead: [250, 150, 26],
      hair: [250, 120, 40],
      chest: [250, 330, 60],
      tummy: [250, 450, 50],
      crotch: [250, 560, 30],
      thighL: [215, 650, 30],
      thighR: [285, 650, 30],
      armL: [150, 380, 22],
      armR: [350, 380, 22],
      back: [250, 380, 60]
    };
    root.FarmMess = { KINDS: KINDS2, AREAS: AREAS3, paint, paintOn, rng, loadStamps, STAMPS };
  })(typeof window !== "undefined" ? window : globalThis);

  // extension/src/messes.js
  var W4 = window;
  var KEY2 = "farmhand-messes";
  var MAX = 60;
  var sdk3 = null;
  var hooked3 = false;
  var mine2 = [];
  var DIAG = { marks: [], draw: null, draws: 0, lastErr: "", got: 0 };
  var others2 = /* @__PURE__ */ new Map();
  var BY_COLOR = {
    "#fff4dc": "cream",
    "#e0a030": "honey",
    "#8b4a1c": "maple",
    "#4a2a18": "chocolate",
    "#e04a6a": "strawberry",
    "#f7f7f0": "milk",
    "#5fae3a": "slime",
    "#6b4a2b": "mud",
    "#d8c08a": "mash",
    "#d9c13a": "piss",
    "#ffd8e6": "cake"
  };
  var AREA_OF = { face: "face", forehead: "forehead", chest: "chest", tummy: "tummy", hair: "hair", thighs: "thighL", back: "back" };
  function load2() {
    try {
      const v = JSON.parse(W4.localStorage.getItem(KEY2));
      if (Array.isArray(v)) mine2 = v.filter(ok).slice(-MAX);
    } catch (e) {
      mine2 = [];
    }
  }
  function save2() {
    try {
      W4.localStorage.setItem(KEY2, JSON.stringify(mine2));
    } catch (e) {
    }
  }
  var ok = (e) => e && typeof e.k === "string" && W4.FarmMess && W4.FarmMess.KINDS[e.k] && Array.isArray(e.a) && Number.isFinite(e.s);
  var clean2 = (list) => Array.isArray(list) ? list.filter(ok).slice(-MAX).map((e) => ({ k: e.k, a: e.a.filter((x) => typeof x === "string" && W4.FarmMess.AREAS[x]).slice(0, 6), s: e.s | 0, t: +e.t || 0, m: Math.max(0.5, Math.min(3, Number(e.m) || 1)) })) : [];
  function messFromMark(m) {
    DIAG.marks.push({ at: Date.now(), mess: m && m.mess, splat: m && m.splat, farmMess: !!W4.FarmMess });
    if (DIAG.marks.length > 5) DIAG.marks.shift();
    if (!m || !Array.isArray(m.splat) || !m.splat.length || !W4.FarmMess) return false;
    const kind = typeof m.mess === "string" && W4.FarmMess.KINDS[m.mess] ? m.mess : (typeof m.color === "string" ? BY_COLOR[m.color.toLowerCase()] : null) || "cum";
    const a = [];
    for (const x of m.splat) {
      const k = AREA_OF[x];
      if (k && !a.includes(k)) a.push(k);
    }
    if (a.includes("tummy") && ["cum", "piss", "milk", "honey", "maple", "chocolate", "strawberry", "slime"].includes(kind) && Math.random() < 0.4) a.push(Math.random() < 0.5 ? "thighL" : "thighR");
    if (!a.length) a.push("chest");
    const amt = Number(m.amount) > 0 ? Math.max(0.5, Math.min(3, Number(m.amount))) : 1;
    mine2.push({ k: kind, a, s: Math.random() * 1e9 | 0, t: Date.now(), m: Math.round(amt * 10) / 10 });
    if (mine2.length > MAX) mine2 = mine2.slice(-MAX);
    save2();
    tell2(true);
    redrawMe();
    return true;
  }
  function messWash() {
    if (!mine2.length) return false;
    mine2 = [];
    save2();
    tell2(true);
    redrawMe();
    return true;
  }
  var send2 = (type, data) => {
    try {
      if (W4.ServerSend && W4.ServerPlayerIsInChatRoom && W4.ServerPlayerIsInChatRoom()) W4.ServerSend("ChatRoomChat", makeMsg(type, data));
    } catch (e) {
    }
  };
  var toldAt2 = 0;
  var askedAt2 = 0;
  function tell2(force) {
    if (!force && Date.now() - toldAt2 < 8e3) return;
    toldAt2 = Date.now();
    send2("mess", { list: mine2 });
  }
  function ask2() {
    if (Date.now() - askedAt2 < 8e3) return;
    askedAt2 = Date.now();
    send2("messAsk", {});
  }
  function onMessMsg(m) {
    const mn = m.from;
    if (!mn || W4.Player && mn === W4.Player.MemberNumber) return;
    if (m.type === "messAsk") {
      if (mine2.length) setTimeout(() => tell2(), 300 + Math.random() * 1500);
      return;
    }
    if (m.type !== "mess") return;
    const list = clean2(m.list);
    if (!list.length) {
      if (others2.delete(mn)) redrawMn2(mn);
      return;
    }
    others2.set(mn, { list, at: Date.now() });
    hook2();
    redrawMn2(mn);
  }
  var charOf2 = (mn) => W4.Player && W4.Player.MemberNumber === mn ? W4.Player : (W4.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || null;
  var againT2 = /* @__PURE__ */ new Map();
  function redrawMn2(mn, soon) {
    clearTimeout(againT2.get(mn));
    againT2.set(mn, setTimeout(() => {
      try {
        const C = charOf2(mn);
        if (C && typeof W4.CharacterLoadCanvas === "function") W4.CharacterLoadCanvas(C);
      } catch (e) {
      }
    }, soon || 80));
  }
  var redrawMe = () => {
    if (W4.Player) redrawMn2(W4.Player.MemberNumber);
  };
  var listFor = (C) => C === W4.Player ? mine2 : (others2.get(C.MemberNumber) || {}).list || [];
  var imgs = /* @__PURE__ */ new Map();
  function img(src, mn) {
    let i = imgs.get(src);
    if (i) return i.complete && i.naturalWidth ? i : null;
    i = new Image();
    i.onload = () => redrawMn2(mn, 100);
    i.src = src;
    imgs.set(src, i);
    return null;
  }
  if (W4.FarmMess && W4.FarmMess.loadStamps) W4.FarmMess.loadStamps("").then((n) => {
    if (n) {
      redrawMe();
      for (const mn of others2.keys()) redrawMn2(mn);
    }
  });
  var BODY = /(?:^|\/)(?:BodyUpper|BodyLower|Head|Arms|ArmsLeft|ArmsRight|Hands|HandsLeft|HandsRight|Pussy)\/[^?#]*\.(?:png|webp|jpe?g)/i;
  var made2 = /* @__PURE__ */ new Map();
  var skinOf = /* @__PURE__ */ new Map();
  function forget(src) {
    if (!src || typeof src !== "string") return;
    setTimeout(() => {
      for (const p of made2.values()) if (p.src === src) return;
      try {
        const m = W4.GLDrawImageCache;
        if (m && typeof m.delete === "function") m.delete(src);
      } catch (e) {
      }
      try {
        const m = W4.DrawImageCache;
        if (m && typeof m.delete === "function") m.delete(src);
      } catch (e) {
      }
      try {
        const gl = W4.GLDrawCanvas && W4.GLDrawCanvas.GL, tc = gl && gl.textureCache;
        const t2 = tc && tc.get(src);
        if (t2) {
          if (t2.texture) gl.deleteTexture(t2.texture);
          tc.delete(src);
        }
      } catch (e) {
      }
    }, 5e3);
  }
  function keep(mn, p) {
    const was = made2.get(mn);
    made2.set(mn, p);
    if (was && was.src && was.src !== p.src) forget(was.src);
  }
  function messPicture(C, list, body2) {
    const over = W4.CanvasUpperOverflow || 700, h2 = C.Canvas && C.Canvas.height || 1e3 + over;
    const up = body2.find((b) => /\/BodyUpper\//.test(b[0])), ox = up ? up[1] : 0, oy = up ? up[2] - over : 0;
    const age = (e) => Math.min(5, Math.floor((Date.now() - (e.t || 0)) / 6e4));
    const key = JSON.stringify(list) + "|" + list.map(age).join("") + "|" + body2.map((b) => b[0] + "@" + b[1] + "," + b[2]).join(";");
    const was = made2.get(C.MemberNumber);
    if (was && was.key === key) return was;
    let mask = null;
    if (body2.length) {
      mask = W4.document.createElement("canvas");
      mask.width = 500;
      mask.height = h2;
      const mg = mask.getContext("2d");
      for (const [src, x, y] of body2) {
        const i = img(src, C.MemberNumber);
        if (!i) return was || null;
        mg.drawImage(i, x, y);
      }
    }
    const c = W4.document.createElement("canvas");
    c.width = 500;
    c.height = h2;
    const g = c.getContext("2d");
    const at = (names) => names.map((n) => {
      const A = W4.FarmMess.AREAS[n];
      return [A[0] + ox, A[1] + over + oy, A[2]];
    });
    for (const e of list) W4.FarmMess.paintOn(g, mask, e.k, { at: at(e.a), seed: e.s, amount: e.m || 1, runX: 0.55 + 0.09 * age(e) });
    if (typeof W4.GLDrawLoadTransient === "function") {
      const p2 = { key, src: c, dx: 0, dy: 0 };
      keep(C.MemberNumber, p2);
      return p2;
    }
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3]) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    if (x1 < 0) {
      const p2 = { key, src: null };
      keep(C.MemberNumber, p2);
      return p2;
    }
    const t = W4.document.createElement("canvas");
    t.width = x1 - x0 + 1;
    t.height = y1 - y0 + 1;
    t.getContext("2d").drawImage(c, -x0, -y0);
    const p = { key, src: t.toDataURL("image/png"), dx: x0, dy: y0, fresh: true };
    keep(C.MemberNumber, p);
    return p;
  }
  function hook2() {
    if (hooked3 || !sdk3) return;
    hooked3 = true;
    try {
      const SKIN = /^(BodyUpper|BodyLower|Head|Arms|ArmsLeft|ArmsRight|Hands|HandsLeft|HandsRight|Pussy|Nipples|Eyes|Eyes2|Eyebrows|Mouth|Blush|Fluids|Emoticon|BodyMarkings|FaceMarkings|Mask|HairBack|HairFront|Height|BodyStyle)$/;
      const groupRe = /(?:^|\/)Assets\/[^/]+\/(?:Override\/[^/]+\/)?([^/]+)\//;
      sdk3.hookFunction("CommonDrawAppearanceBuild", 3, (args, next) => {
        const C = args[0], real = args[1];
        if (!C || !real || typeof real.drawImage !== "function" || !W4.FarmMess) return next(args);
        const list = listFor(C);
        if (C === W4.Player) DIAG.got++;
        if (!list.length) return next(args);
        const body2 = [], all = [], sample = [];
        let canv = 0, done = false;
        const before = skinOf.get(C.MemberNumber) || [];
        const lay = () => {
          if (done) return;
          done = true;
          try {
            const have = new Set(body2.map((b) => b[0]));
            for (const b of before) if (!have.has(b[0])) {
              body2.push(b);
              have.add(b[0]);
            }
            const p = messPicture(C, list, body2);
            if (C === W4.Player) {
              DIAG.draws++;
              DIAG.draw = { at: Date.now(), list: list.length, body: body2.map((b) => String(b[0]).replace(/^.*Assets\/[^/]+\//, "") + "@" + b[1] + "," + b[2]), sample: sample.slice(), canv, pic: p ? p.src ? typeof p.src === "string" ? "picture" : "drawing " + p.src.width + "x" + p.src.height : "empty" : "waiting for the body pictures" };
            }
            if (p && p.src) {
              real.drawImage(p.src, p.dx, p.dy, {});
              if (typeof real.drawImageBlink === "function") real.drawImageBlink(p.src, p.dx, p.dy, {});
              if (p.fresh) {
                p.fresh = false;
                const mn = C.MemberNumber;
                redrawMn2(mn, 250);
                setTimeout(() => redrawMn2(mn, 0), 1200);
              }
            }
          } catch (e) {
            DIAG.lastErr = String(e && e.message || e);
            console.warn("[Farmhand Companion] messes:", e);
          }
        };
        const seen2 = (name) => (src, x, y, ...rest) => {
          if (C === W4.Player) {
            if (typeof src === "string") {
              if (sample.length < 6) sample.push(src.replace(/^.*\/(?=[^/]+\/[^/]+$)/, ""));
            } else canv++;
          }
          if (typeof src === "string" && BODY.test(src) && !all.some((b) => b[0] === src)) all.push([src, x, y]);
          if (typeof src === "string" && !done) {
            if (BODY.test(src)) {
              if (!body2.some((b) => b[0] === src)) body2.push([src, x, y]);
            } else {
              const m = groupRe.exec(src);
              if (m && !SKIN.test(m[1]) && body2.length && body2.length >= before.length) lay();
            }
          }
          return real[name](src, x, y, ...rest);
        };
        const wrap = {};
        for (const n of ["drawImage", "drawImageBlink", "drawImageColorize", "drawImageColorizeBlink"]) if (typeof real[n] === "function") wrap[n] = seen2(n);
        args[1] = Object.assign({}, real, wrap);
        const out = next(args);
        lay();
        if (all.length) {
          const was = skinOf.get(C.MemberNumber);
          skinOf.set(C.MemberNumber, all);
          if (!was || was.map((b) => b[0]).join() !== all.map((b) => b[0]).join()) redrawMn2(C.MemberNumber, 120);
        }
        return out;
      });
      sdk3.hookFunction("ChatRoomSync", 0, (args, next) => {
        const r = next(args);
        setTimeout(() => {
          if (mine2.length) tell2(true);
          ask2();
        }, 3e3);
        return r;
      });
    } catch (e) {
      DIAG.lastErr = "hook: " + String(e && e.message || e);
      console.warn("[Farmhand Companion] messes unavailable:", e);
      hooked3 = false;
    }
  }
  function initMesses(mod2) {
    sdk3 = mod2;
    load2();
    setInterval(() => {
      const fresh2 = (l) => l.some((e) => Date.now() - (e.t || 0) < 6 * 6e4);
      if (fresh2(mine2)) redrawMe();
      for (const [mn, o] of others2) if (fresh2(o.list)) redrawMn2(mn);
    }, 6e4);
    setTimeout(() => {
      hook2();
      if (mine2.length) {
        tell2(true);
        redrawMe();
      }
      ask2();
    }, 3500);
  }
  function messMemory() {
    let pics = 0;
    for (const p of made2.values()) if (p.src) pics++;
    return { pictures: pics, bytesKB: Math.round(Array.from(made2.values()).reduce((n, p) => n + (p.src ? p.src.length : 0), 0) / 1e3), imgs: imgs.size, others: others2.size };
  }
  function messDiag() {
    const ago = (t) => t ? Math.round((Date.now() - t) / 1e3) + "s ago" : "never";
    const L = [];
    L.push("hooked: " + hooked3 + " \xB7 splatter kit: " + !!W4.FarmMess + (W4.FarmMess && W4.FarmMess.KINDS ? " (" + Object.keys(W4.FarmMess.KINDS).length + " kinds)" : ""));
    L.push("on you now: " + mine2.length + (mine2.length ? " \xB7 newest " + mine2[mine2.length - 1].k + " on " + mine2[mine2.length - 1].a.join("+") + ", " + ago(mine2[mine2.length - 1].t) : ""));
    L.push("marks from the bot: " + (DIAG.marks.length ? DIAG.marks.map((x) => (x.mess || "?") + " " + ago(x.at)).join(", ") : "none since this page opened"));
    L.push("your body drawn: " + DIAG.got + " times, with a mess " + DIAG.draws + " times");
    if (DIAG.draw) L.push("last mess drawing: " + ago(DIAG.draw.at) + ", " + DIAG.draw.list + " messes, " + DIAG.draw.pic + "; skin pictures seen: " + (DIAG.draw.body.join(" ") || "NONE") + "; first pictures: " + (DIAG.draw.sample || []).join(" ") + "; drawings handed over: " + (DIAG.draw.canv || 0));
    if (DIAG.lastErr) L.push("last error: " + DIAG.lastErr);
    L.push("others with messes: " + others2.size);
    return L.join("\n");
  }

  // extension/src/trimpics.js
  var W5 = window;
  var LIMIT = 38e7;
  var TARGET = 26e7;
  var IDLE = 5 * 6e4;
  var seen = /* @__PURE__ */ new Map();
  var sdk4 = null;
  var trimmed = 0;
  var started = Date.now();
  function bytes(tc) {
    let n = 0;
    for (const v of tc.values()) n += (v.width || 0) * (v.height || 0) * 4;
    return n;
  }
  function trimPictures(force, idle, target) {
    const gl = W5.GLDrawCanvas && W5.GLDrawCanvas.GL, tc = gl && gl.textureCache, cache = W5.GLDrawImageCache;
    if (!cache || typeof cache.purge === "function") return 0;
    if (!tc || typeof tc.forEach !== "function") return 0;
    let total = bytes(tc);
    if (!force && total <= LIMIT) return 0;
    const now = Date.now(), old = [];
    for (const [url, v] of tc) {
      if (typeof url !== "string") continue;
      const t = seen.get(url) || started;
      if (now - t < (idle ?? IDLE)) continue;
      const img2 = cache.get(url);
      if (img2 && img2.complete === false) continue;
      old.push([t, url, v]);
    }
    old.sort((a, b) => a[0] - b[0]);
    let n = 0;
    for (const [, url, v] of old) {
      if (total <= (target ?? TARGET)) break;
      try {
        if (v.texture) gl.deleteTexture(v.texture);
      } catch (e) {
      }
      tc.delete(url);
      cache.delete(url);
      seen.delete(url);
      total -= (v.width || 0) * (v.height || 0) * 4;
      n++;
    }
    trimmed += n;
    return n;
  }
  function trimStats() {
    return { trimmed };
  }
  function initTrim(mod2) {
    sdk4 = mod2;
    W5.__farmTrim = trimPictures;
    try {
      sdk4.hookFunction("GLDrawLoadImage", 0, (args, next) => {
        if (typeof args[1] === "string") seen.set(args[1], Date.now());
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] picture trim unavailable:", e);
      return;
    }
    setInterval(() => {
      try {
        trimPictures(false);
      } catch (e) {
        console.warn("[Farmhand Companion] picture trim:", e);
      }
    }, 6e4);
  }

  // extension/src/memlog.js
  var W6 = window;
  var KEY3 = "farmhand-memlog";
  var MAX2 = 120;
  var log = [];
  try {
    const v = JSON.parse(W6.localStorage.getItem(KEY3));
    if (Array.isArray(v)) log = v.slice(-MAX2);
  } catch (e) {
    log = [];
  }
  function snap() {
    const s = { t: Date.now() };
    try {
      if (W6.performance && W6.performance.memory) s.heapMB = Math.round(W6.performance.memory.usedJSHeapSize / 1e6);
    } catch (e) {
    }
    try {
      const c0 = W6.GLDrawImageCache, m = c0 && c0.cache instanceof Map ? c0.cache : c0;
      if (m && typeof m.keys === "function") {
        s.gamePics = m.size;
        let d = 0, dk = 0;
        for (const k of m.keys()) if (typeof k === "string" && k.startsWith("data:")) {
          d++;
          dk += k.length;
        }
        s.madePics = d;
        s.madePicsKB = Math.round(dk / 1e3);
      }
      const gl = W6.GLDrawCanvas && W6.GLDrawCanvas.GL, tc = gl && gl.textureCache;
      if (tc) {
        let px = 0;
        for (const v of tc.values()) px += (v.width || 0) * (v.height || 0);
        s.textures = tc.size;
        s.textureMB = Math.round(px * 4 / 1e6);
      } else if (m && m !== c0) {
        let px = 0, n = 0;
        for (const v of m.values()) {
          const dd = v && v.data;
          if (dd && dd.width) {
            px += dd.width * dd.height;
            n++;
          }
        }
        s.textures = n;
        s.textureMB = Math.round(px * 4 / 1e6);
      }
    } catch (e) {
    }
    try {
      s.body = drawnBodyMemory();
    } catch (e) {
    }
    try {
      s.mess = messMemory();
    } catch (e) {
    }
    try {
      s.let = trimStats().trimmed;
    } catch (e) {
    }
    try {
      s.room = (W6.ChatRoomCharacter || []).length;
      s.screen = W6.CurrentScreen;
    } catch (e) {
    }
    return s;
  }
  function save3() {
    try {
      W6.localStorage.setItem(KEY3, JSON.stringify(log));
    } catch (e) {
      log = log.slice(-30);
    }
  }
  function tick() {
    const s = snap(), prev = log[log.length - 1];
    if (prev && s.t - prev.t > 5 * 6e4) s.gap = true;
    log.push(s);
    if (log.length > MAX2) log = log.slice(-MAX2);
    save3();
  }
  var line = (s) => new Date(s.t).toTimeString().slice(0, 5) + (s.gap ? " (after a gap)" : "") + "  page " + (s.heapMB ?? "?") + " MB \xB7 game pictures " + (s.gamePics ?? "?") + " (" + (s.madePics ?? 0) + " ours, " + (s.madePicsKB ?? 0) + " KB) \xB7 graphics card " + (s.textureMB ?? "?") + " MB in " + (s.textures ?? "?") + " \xB7 drawn bodies " + (s.body ? s.body.engines + ", keeping " + s.body.keptMB + " MB" : "?") + " \xB7 messes " + (s.mess ? s.mess.pictures : "?") + " \xB7 " + (s.room ?? "?") + " in the room" + (s.let ? " \xB7 " + s.let + " old pictures let go" : "");
  var FAST = "farmhand-memfast";
  var born = Date.now();
  var fast = [];
  try {
    const v = JSON.parse(W6.localStorage.getItem(FAST));
    if (Array.isArray(v)) fast = v.slice(-40);
  } catch (e) {
    fast = [];
  }
  var lastPage = fast.filter((x) => x.t < born).slice(-12);
  function quick() {
    const x = { t: Date.now() };
    try {
      if (W6.performance && W6.performance.memory) x.h = Math.round(W6.performance.memory.usedJSHeapSize / 1e6);
    } catch (e) {
    }
    try {
      const gl = W6.GLDrawCanvas && W6.GLDrawCanvas.GL, tc = gl && gl.textureCache, c0 = W6.GLDrawImageCache;
      x.p = tc ? tc.size : c0 && c0.cache instanceof Map ? c0.cache.size : void 0;
    } catch (e) {
    }
    try {
      x.r = (W6.ChatRoomCharacter || []).length;
      x.s = W6.CurrentScreen;
    } catch (e) {
    }
    fast.push(x);
    if (fast.length > 40) fast = fast.slice(-40);
    try {
      W6.localStorage.setItem(FAST, JSON.stringify(fast));
    } catch (e) {
    }
  }
  var quickLine = (x) => new Date(x.t).toTimeString().slice(0, 8) + "  page " + (x.h ?? "?") + " MB \xB7 " + (x.p ?? "?") + " pictures \xB7 " + (x.r ?? "?") + " in the room \xB7 " + (x.s || "");
  function memlogText(n) {
    return log.slice(-(n || 20)).map(line).join("\n");
  }
  function initMemlog() {
    setTimeout(tick, 2e4);
    setInterval(tick, 3e4);
    setInterval(quick, 3e3);
    if (typeof W6.CommandCombine === "function") {
      W6.CommandCombine([{ Tag: "farmmem", Description: ": the Farmhand Companion's memory log (the last hour), and copies it", Action: () => {
        tick();
        const text = "Companion v" + VERSION + "\n" + memlogText(24) + (lastPage.length ? "\nThe last seconds of the page before this one:\n" + lastPage.map(quickLine).join("\n") : "");
        try {
          W6.navigator.clipboard.writeText(JSON.stringify(log));
        } catch (e) {
        }
        if (typeof W6.ChatRoomSendLocal === "function") W6.ChatRoomSendLocal("Farmhand memory log (copied, paste it to Claude):\n" + text, 12e4);
        else console.log(text);
      } }, { Tag: "farmmess", Description: ": where the farm's messes on you got to (for Claude)", Action: () => {
        let text = "";
        try {
          text = messDiag();
        } catch (e) {
          text = "couldn't check: " + e.message;
        }
        text = "Companion v" + VERSION + "\n" + text;
        try {
          W6.navigator.clipboard.writeText(text);
        } catch (e) {
        }
        if (typeof W6.ChatRoomSendLocal === "function") W6.ChatRoomSendLocal("Farmhand messes (copied, paste it to Claude):\n" + text, 12e4);
        else console.log(text);
      } }]);
    }
  }

  // extension/src/settings.js
  var W7 = window;
  var ID = "FarmhandCompanion";
  var panel = null;
  var box = null;
  var tab = "switches";
  var settingsAvailable = () => typeof W7.PreferenceRegisterExtensionSetting === "function";
  function ctx() {
    const c = panel.ctx();
    return Object.assign({}, c, {
      setPref: (k, v) => {
        c.setPref(k, v);
        draw();
      },
      setUi: (p, quiet) => {
        c.setUi(p, true);
        if (!quiet) draw();
      },
      send: (cmd) => {
        c.send(cmd);
        setTimeout(draw, 1500);
      },
      hint: (m) => {
        c.hint(m);
        note(m);
      }
    });
  }
  function note(m) {
    const n = box && box.querySelector("#fhc-set-note");
    if (n) {
      n.textContent = m;
      n.style.display = "block";
    }
  }
  var TABS = [
    ["switches", "Switches"],
    ["guides", "Guides"],
    ["files", "Your settings file"],
    ["about", "About"]
  ];
  function body(c) {
    const p = c.prefs, s = c.s || {};
    if (tab === "guides") return guidesTab(c, !!s.staff);
    if (tab === "files") return [card(
      title("\u{1F9E0} Memory log"),
      muted("For chasing a page that runs out of room: how big things were, every half minute, for the last hour. /farmmem in chat shows it too."),
      h("pre", { style: { whiteSpace: "pre-wrap", fontSize: "11px", maxHeight: "300px", overflowY: "auto" } }, memlogText(12) || "Nothing yet.")
    )];
    if (tab === "about") return [card(
      title("\u{1F33E} Farmhand Companion v" + VERSION),
      muted("The B&B Farm's helper: the \u{1F33E} panel, the drawn body, the farm's messes and gear on you, and your switches. It only talks to the farm girl."),
      toggle(
        "Farmhand Companion on",
        "Switched off, the Companion stays quiet after your next reload: no panel, no drawn body, no messes or farm gear on you, nothing sent to the farm. This page stays, so you can switch it back on.",
        !p.off,
        () => c.setPref("off", !p.off)
      ),
      p.off ? h("div", { style: { marginTop: "6px" } }, btn("Reload now", () => W7.location.reload(), true)) : null
    )];
    return [drawnBodyCard(c), panelPrefs(c)];
  }
  function draw() {
    if (!box) return;
    const c = ctx();
    box.replaceChildren(
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" } },
        h("h2", { style: { margin: "0", flex: "1" } }, "\u{1F33E} Farmhand Companion"),
        btn("Back", () => {
          if (typeof W7.PreferenceSubscreenExtensionsClear === "function") W7.PreferenceSubscreenExtensionsClear();
          else close();
        }, true)
      ),
      h("nav", { class: "fhc-row" }, TABS.map(([id, label]) => h("button", { type: "button", class: "fhc-pill" + (tab === id ? " on" : ""), onclick: () => {
        tab = id;
        draw();
      } }, label))),
      h("div", { id: "fhc-set-note", style: { display: "none", margin: "6px 0", color: "#c9a35b" } }),
      h("div", { style: { marginTop: "8px" } }, body(c))
    );
  }
  function open() {
    close();
    box = W7.document.createElement("div");
    box.id = "fhc-settings";
    W7.document.body.appendChild(box);
    draw();
  }
  function close() {
    if (box) {
      box.remove();
      box = null;
    }
  }
  function initSettings(p) {
    panel = p;
    if (!settingsAvailable()) return false;
    try {
      W7.PreferenceRegisterExtensionSetting({
        Identifier: ID,
        ButtonText: "Farmhand Companion",
        load: () => open(),
        run: () => {
        },
        click: () => {
        },
        exit: () => {
          close();
          return true;
        },
        unload: () => close()
      });
      return true;
    } catch (e) {
      console.warn("[Farmhand Companion] settings page unavailable:", e);
      return false;
    }
  }
  function openSettings(which) {
    if (which) tab = which;
    try {
      if (typeof W7.PreferenceSubscreenExtensionsOpen === "function") {
        W7.PreferenceSubscreenExtensionsOpen(ID);
        return true;
      }
    } catch (e) {
    }
    return false;
  }

  // extension/src/views/livestock.js
  var pct = (a, b) => b ? 100 * a / b : 0;
  var hoursLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 36e5));
  function happeningCard(ctx3) {
    const s = ctx3.s, hp = s.happening || [], quiet = s.quietUntil && s.quietUntil > Date.now();
    if (!hp.length && !s.onBooks) return null;
    return card(
      h("div", { class: "fhc-kv" }, title("What's happenin' to you"), quiet ? chip("quiet", "acc") : null),
      hp.length ? hp.map((t) => h("div", { style: { margin: "3px 0" } }, t)) : muted("Nothin' has hold of you right now."),
      h(
        "div",
        null,
        quiet ? btn("End the quiet", () => ctx3.send("quiet off")) : btn("An hour's quiet", () => ctx3.send("quiet 60")),
        muted(quiet ? "Nothin' new starts on you till it's over." : "Quiet: no new traps, urges, scents or teasin' for an hour. It doesn't stop what already has you; the safe word does.")
      )
    );
  }
  function me2(ctx3) {
    const s = ctx3.s;
    const chips = [
      s.tier && chip(s.tier, "acc"),
      s.species && chip(s.species),
      s.gender && chip(s.gender),
      ...(s.keys || []).map((k) => chip(k + " key")),
      s.heatUntil && chip("in heat", "alert"),
      s.preg && chip("carryin'", "good")
    ];
    const bars = [
      s.milk && bar("Milk", ml(s.milk.ml) + " of " + ml(s.milk.cap) + " \xB7 grade " + s.milk.grade, pct(s.milk.ml, s.milk.cap)),
      s.quota && bar("Today's quota", ml(s.quota.ml) + " of " + ml(s.quota.goal) + (s.quota.streak ? " \xB7 streak " + s.quota.streak : ""), pct(s.quota.ml, s.quota.goal), "good"),
      s.semen && bar("Seed", ml(s.semen.ml) + " of " + ml(s.semen.cap), pct(s.semen.ml, s.semen.cap)),
      s.holding && s.holding.ml > 0 && bar("Holding", ml(s.holding.ml) + " of " + ml(s.holding.cap), pct(s.holding.ml, s.holding.cap), "alert")
    ];
    return [
      card(h("div", { class: "fhc-title" }, s.name), h("div", { style: { marginTop: "6px" } }, chips)),
      happeningCard(ctx3),
      bars.some(Boolean) && card(
        title("Today"),
        bars,
        s.heatUntil && muted("In heat for " + hoursLeft(s.heatUntil) + " more hours"),
        s.preg && muted("Carryin' for " + s.preg.sires.join(" & ") + " \xB7 due in " + Math.max(0, Math.ceil((s.preg.due - Date.now()) / 864e5)) + " day(s)")
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
      s.kept && card(
        h("div", { class: "fhc-kv" }, title("\u{1F3F7}\uFE0F Kept by " + s.kept.by), chip(Math.max(1, Math.ceil((s.kept.until - Date.now()) / 864e5)) + " day(s)", "acc")),
        s.kept.tag ? muted("Your tag: " + s.kept.tag) : null,
        s.kept.name ? muted("This week you're called: " + s.kept.name) : null,
        (s.kept.milk || []).length ? muted("Milked at " + s.kept.milk.map((x) => x + ":00").join(" and ")) : null,
        h("div", null, btn("What that means", () => ctx3.send("kept")), btn("End it", () => ctx3.send("kept off")))
      ),
      s.intensity && card(
        title("How the farm talks to you"),
        h("div", null, [["tender", "Tender"], ["rough", "Rough"], ["filthy", "Filthy"]].map(([id, label]) => h("button", { type: "button", class: "fhc-pill" + (s.intensity === id ? " on" : ""), onclick: () => ctx3.send("intensity " + id) }, label))),
        muted(s.intensity === "tender" ? "Softer words, and the traps lean mild." : s.intensity === "filthy" ? "Dirtier words, and the traps lean brutal." : "As written."),
        muted("It calls you: " + (((s.words || {}).call || []).join(", ") || "whatever comes to mind") + " \xB7 never: " + (((s.words || {}).never || []).join(", ") || "nothin' ruled out")),
        h("div", null, btn("Names I love\u2026", () => ctx3.fillBox("callme ")), btn("Never call me\u2026", () => ctx3.fillBox("nevercall ")))
      ),
      h("div", { class: "fhc-quick" }, ["stats", "measure", "record", "pedigree", "keys"].map((c) => btn(c[0].toUpperCase() + c.slice(1), () => ctx3.send(c))), btn("Dress me", () => ctx3.send("dressme")))
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
        muted(["", "Gentle", "Steady", "Hard", "Max"][g.milk.level] + (g.milk.kind === "echo" ? " \xB7 the more worked up you are, the faster it draws" : ""))
      ] : muted("No pump on right now. A lactation pump, Echo's portable pump, the milk vendor or a milkin' stall all milk you here."),
      g.machine && h("div", { class: "fhc-kv" }, h("span", null, "\u2699\uFE0F " + g.machine.name), h("span", { class: "fhc-muted" }, g.machine.intensity < 0 ? "off" : "intensity " + g.machine.intensity)),
      g.funnel && h("div", { class: "fhc-kv" }, h("span", null, "Funnel gag"), h("span", { class: "fhc-muted" }, "fitted, and it counts as open"))
    );
  }
  function milking(ctx3) {
    const s = ctx3.s;
    if (!s.milk && !s.semen) return [card(title("Milking"), muted("You're not makin' milk right now. Flip Milkable on in Toggles if you'd like to."))];
    return [
      s.milk && card(
        title("Milk"),
        bar("In your udder", ml(s.milk.ml) + " of " + ml(s.milk.cap), pct(s.milk.ml, s.milk.cap)),
        muted("Grade " + s.milk.grade + (s.milk.lastAt ? " \xB7 last milked " + Math.round((Date.now() - s.milk.lastAt) / 6e4) + " min ago" : ""))
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
      s.dial && card(
        h("div", { class: "fhc-kv" }, title("The stall dial"), s.milkCums ? chip("milked till you came \xD7 " + s.milkCums, "acc") : null),
        h("div", null, [["gentle", "Gentle"], ["steady", "Steady"], ["hard", "Hard"], ["punishing", "Punishin'"]].map(([id, label]) => h("button", { type: "button", class: "fhc-pill" + (s.dial === id ? " on" : ""), onclick: () => ctx3.send("stalldial " + id) }, label))),
        muted({ gentle: "Slow and sweet. It leaves you a third.", steady: "It drains you to a quarter.", hard: "Fast and deep, down to an eighth, and sore teats after.", punishing: "Past empty. You'll be sensitive for an hour after." }[s.dial] || ""),
        muted("Run hot enough in the stall and the cups will tip you over.")
      ),
      h("div", null, btn("Quota", () => ctx3.send("quota")), btn("Milk board", () => ctx3.send("board")))
    ];
  }
  function breeding(ctx3) {
    const s = ctx3.s, sw = s.switches || {};
    const rows2 = [
      ["Breedable", sw.breedable],
      ["Fertile", sw.fertile],
      ["Jar insemination", sw.jarok ? "asks first" : "never"],
      ["Free use", sw.freeuse],
      ["Natural heat", sw.naturalheat]
    ];
    return [
      card(
        title("Breedin'"),
        rows2.map(([k, v]) => h("div", { class: "fhc-kv" }, h("span", null, k), h("span", { class: "fhc-muted" }, v === true ? "on" : v === false ? "off" : v))),
        s.heatUntil && muted("\u{1F525} In heat \xB7 " + hoursLeft(s.heatUntil) + " h left"),
        s.preg && muted("\u{1F37C} Carryin' for " + s.preg.sires.join(" & ")),
        s.eggs && muted("\u{1F95A} Carryin' " + s.eggs.n + " eggs \xB7 ?lay at the nest, or they come when they're due")
      ),
      s.trapCard && muted("\u{1F9EA} Your trap card is on the Traps tab."),
      h("div", null, btn("My tally", () => ctx3.send("tally")), btn("Eggs", () => ctx3.send("eggs")), btn("Wash up", () => ctx3.send("wash")), btn("Pedigree", () => ctx3.send("pedigree")))
    ];
  }
  function traps(ctx3) {
    const s = ctx3.s, tc = s.trapCard, ad = s.trapAdmin, gear = s.farmGear || [];
    return [
      happeningCard(ctx3),
      s.stateErr && card(title("Somethin' broke on the farm girl's end"), muted("Part of your panel didn't arrive. Tell the proprietors this line: " + s.stateErr)),
      tc ? card(
        h("div", { class: "fhc-kv" }, title("Trap card" + (tc.rank ? " \xB7 " + tc.rank : "")), chip(tc.total + " sprung" + (tc.nextRank ? " \xB7 next rank at " + tc.nextRank : ""), "acc")),
        tc.kinds.length ? h("div", null, tc.kinds.map((k) => chip(k.kind + " \xD7" + k.n))) : muted("Nothin's caught you yet. Give it time."),
        muted(tc.left + " kind" + (tc.left === 1 ? "" : "s") + " still to find" + (tc.eggs ? " \xB7 " + tc.eggs + " eggs laid" : "") + (tc.paused ? " \xB7 traps paused" : "") + (tc.eager ? " \xB7 eager (no waits)" : "") + (tc.danger ? " \xB7 Danger Draught in you" : "")),
        tc.corr || tc.under ? bar("Corruption", tc.corr + " of 100" + (tc.under ? " \xB7 gone under, depth " + tc.under : ""), tc.corr, "alert") : null,
        tc.hunt && muted("\u{1F514} The hunt is on: get to " + tc.hunt.goal),
        h(
          "div",
          null,
          btn("Struggle", () => ctx3.send("struggle")),
          btn("Switch traps off", () => ctx3.send("traps off")),
          btn(tc.eager ? "Eager: on" : "Eager: off", () => ctx3.send("traps eager " + (tc.eager ? "off" : "on"))),
          btn("What's out there", () => ctx3.send("traps")),
          btn("Lay (at the nest)", () => ctx3.send("lay")),
          btn("My brood book", () => ctx3.send("brood"))
        )
      ) : card(title("Traps"), muted("The farm's traps are off for you, so you can walk right over them. Switch them on and every trap spot on the farm can spring for you."), h("div", null, btn("Switch traps on", () => ctx3.send("traps on")))),
      card(
        title("On you right now"),
        gear.length ? gear.map((g) => h("div", { style: { marginTop: "6px" } }, h("div", { class: "fhc-kv" }, h("b", null, g.name), h("span", { class: "fhc-muted" }, Math.max(0, Math.ceil((g.until - Date.now()) / 6e4)) + " min")), muted(gearLore(g.name) || g.desc || ""))) : muted("No farm gear on you."),
        !ctx3.prefs.gear && muted('Trap gear only goes on for real with "Farm can put real gear on me" switched on (Toggles \u2192 This panel).')
      ),
      s.sitting && card(title("\u{1FABA} Sittin' the nest"), muted(s.sitting.n + " eggs under you. They hatch in about " + Math.max(1, Math.ceil((s.sitting.until - Date.now()) / 6e4)) + " min."), h("div", null, btn("Get up", () => ctx3.send("sit up")))),
      s.holes && s.holes.length ? card(
        title("What you've taken"),
        s.holes.map((x) => h("div", { class: "fhc-kv" }, h("span", null, "Your " + x.hole + " \xB7 " + x.rank), h("span", { class: "fhc-muted" }, x.loads + " loads" + (x.knots ? " \xB7 " + x.knots + " knots" : "") + (x.next ? " \xB7 next at " + x.next : "")))),
        muted("Every step a hole is trained, you hold more for good and the traps pour more into it.")
      ) : null,
      s.album && s.album.length ? card(
        title("\u{1F4D4} Keepsakes"),
        s.album.map((e) => h("div", { style: { marginTop: "6px" } }, h("div", { class: "fhc-kv" }, h("b", null, e.i + " " + e.h), h("span", { class: "fhc-muted" }, new Date(e.t).toLocaleDateString())), muted(e.x))),
        muted("Only you can open this album.")
      ) : null,
      ad && card(
        h("div", { class: "fhc-kv" }, title("Proprietor: traps"), chip(ad.subjects.length + " with traps on", "acc")),
        ad.subjects.length ? ad.subjects.map((x) => h("div", { class: "fhc-kv" }, h("span", null, (x.here ? "\u25CF " : "") + x.name), h("span", { class: "fhc-muted" }, x.n + " sprung" + (x.paused ? " \xB7 paused" : "")))) : muted("Nobody's switched their traps on yet."),
        muted("Trap spots: " + (ad.spots.length ? ad.spots.join(", ") : "none yet (?spot set trap-<kind>)")),
        muted("Water: " + (ad.water.length ? ad.water.join(", ") : "none yet (?spot set pond)") + (ad.nest ? " \xB7 " + ad.nest + " eggs in the nest" : "") + (ad.pack ? " \xB7 pack at " + ad.pack : "")),
        ad.hunt && muted("\u{1F514} Hunt on: finish at " + ad.hunt.goal + ", " + ad.hunt.done + " home"),
        h(
          "div",
          null,
          btn("Kinds & spots", () => ctx3.send("traps")),
          btn("Subjects", () => ctx3.send("subject")),
          btn(ad.hunt ? "Stop the hunt" : "Start a hunt", () => ctx3.send(ad.hunt ? "hunt stop" : "hunt start")),
          btn("Gather eggs", () => ctx3.send("gather"))
        )
      )
    ];
  }
  function inbox(ctx3) {
    const f = ctx3.ui.filter || "all";
    const items = ctx3.feed.filter((x) => f === "all" || x.kind === f);
    return [
      h("div", null, [["all", "All"], ["notice", "From the farm"], ["reply", "Answers"], ["mine", "You asked"]].map(([id, label]) => h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx3.setUi({ filter: id }) }, label))),
      items.length ? items.slice().reverse().map((x) => h(
        "div",
        { class: "fhc-card " + x.kind },
        h("span", { class: "fhc-time" }, new Date(x.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + (x.kind === "notice" ? " \xB7 from the farm" : x.kind === "mine" ? " \xB7 you asked" : "")),
        x.text
      )) : muted("Nothin' here yet.")
    ];
  }
  var SWITCH_INFO = [
    ["hypno", "Hypno", "Conditioning's trance sessions can take you, in the farm's voice, never deeper than your ?depth (fun, deep or no human left). ?wake ends one"],
    ["teaseme", "Tease me", "The farm whispers you a tease 3 or 4 times an hour while you're here, about whatever's goin' on with you: full udders, a load still in you, a heat, a mess. ?teaseme steady or needy for more. Your herd leader can switch it for you too"],
    ["breedable", "Breedable", "You can be bred and filled"],
    ["fertile", "Fertile", "You can catch"],
    ["mpreg", "Mpreg", "A load in your ass can take too, no item needed (with Breedable and Fertile on)"],
    ["jarok", "Jar insemination", "On: staff still ask every time \xB7 Off: never"],
    ["freeuse", "Free use", "Any stud may have you without askin'"],
    ["futa", "Futa", "Cock and vulva both, milk and semen both"],
    ["milkable", "Milkable", "Make milk"],
    ["naturalheat", "Natural heat", "Come into heat on your own every 7 days"],
    ["praise", "Praise", "Let staff's praise count"],
    ["degrade", "Degrade", "Let staff's degradin' count"],
    ["tally", "Tally marks", "Show your tally on ?who and the board"],
    ["potions", "Potions", "Staff and the wheel can give you potions, and others can gift you one (you're asked first). Your limits still rule some out"],
    ["dares", "Dares", "Staff and the wheel can hand you a dare to do in half an hour"],
    ["watersports", "Watersports", "Piss play can find you: the spray trap, a feeder crafted for it, and the scenes that have it. Off until you say so"],
    ["parasite", "Parasite", "Swallow at the glory stalls and, rarely, a pair of livin' lips seals over your mouth for 12 hours: it feeds you fertility, growth, hyper pregnancy and capacity serum and turns every load you swallow into more"],
    ["symbiote", "Symbiotes", "Livin' latex, milk moss or the nestling can bond to you. Each gives you somethin' for as long as it's fed: room to hold more, more milk, an easier catch. They grow into real clothes on you (latex, moss), and they spread: latex by a touch, moss in the milk, the nestling by a breedin', to others who switched this on. Your safeword sends it away"],
    ["traps", "Traps", "The farm's traps spring for you: step on a trap spot and it might dose, drain, breed, strip, pump or fill you with eggs, and the water's not safe either. Off: you walk right over them. Your limits and your safeword still rule"],
    ["ownoutfit", "Bring my own outfit", "Keep the look you came in when you sign a contract. Off: your first contract dresses you, once, in the farm's outfit for your kind, and nothin' changes it back after"],
    ["eager", "Traps: no cooldown", "With traps on: no breather between traps and no wait for a trap to reset. Step off and back on and it springs again"],
    ["bench", "Use bench", "Staff and the wheel can sentence you to time strapped over the use bench, where anybody can use you. Your safeword ends it at once"]
  ];
  var NEEDS = { freeuse: ["breedable", "Turn Breedable on first"] };
  function farmSwitches(ctx3, list) {
    const sw = ctx3.s.switches || {};
    return list.map(([cmd, label, desc]) => {
      const need = NEEDS[cmd];
      if (need && !sw[need[0]] && !sw[cmd]) return toggle(label, need[1] + " \xB7 " + desc, false, () => ctx3.send(cmd + " on"));
      return toggle(label, desc, !!sw[cmd], () => ctx3.send(cmd + " " + (sw[cmd] ? "off" : "on")));
    });
  }
  function panelPrefsOrLink(ctx3) {
    if (!settingsAvailable()) return panelPrefs(ctx3);
    return card(
      title("This panel, your settings file and the full guides"),
      muted("They're in the game's own settings now: Preferences \u2192 Extensions \u2192 Farmhand Companion."),
      btn("Open the Farmhand settings", () => {
        if (!openSettings("switches")) ctx3.hint("Open the game's Preferences, then Extensions, then Farmhand Companion.");
      }, true)
    );
  }
  function panelPrefs(ctx3) {
    return card(
      title("This panel"),
      muted("Only on your computer."),
      [
        ["chatToo", "Farm messages in chat too", "Tease lines, heat, summons and other farm messages also show in your chat log"],
        ["compact", "Compact cards", "Smaller text, more on screen"],
        ["chime", "Chime on notices", "A soft sound when the farm messages you"],
        ["popopen", "Open on new notice", "Pop the panel open by itself"],
        ["btnPinned", "Pin the \u{1F33E} button", "Unpinned, you can drag it anywhere (mouse or finger). Pin it so it stays put."]
      ].map(([k, label, desc]) => toggle(label, desc, !!ctx3.prefs[k], () => ctx3.setPref(k, !ctx3.prefs[k]))),
      toggle(
        "Farm emotes about me come from me",
        "Belly kicks, milkin', breedin'\u2026 are posted as your own emote (no name in front), so the people who can see you see them and the farm girl needn't move. Only lines about you.",
        !ctx3.prefs.noRelay,
        () => {
          ctx3.setPref("noRelay", !ctx3.prefs.noRelay);
          ctx3.api.rehello && ctx3.api.rehello();
        }
      ),
      // the farm's little cues on your own screen (cues.js); each one on unless you switch it off
      [
        ["noLead", "Lead me instead of teleportin'", "When the farm moves you (feedin' time, the stocks, a summon), you walk there yourself, step by step"],
        ["noFace", "Farm can set my face", "Dazed when milk-drunk, flushed in heat, a trance stare\u2026 for a little while"],
        ["noSound", "Farm sounds", "The pump, the stall door, the feedin' bell. Only you hear them, at your game volume"],
        ["noTrance", "Trance haze", "A soft haze at the edges of your screen during conditioning sessions"],
        ["noFeelings", "Private feelings", "Now and then, a line only you see about what you're feelin' (your gear, your arousal, how full you are)"],
        ["noSlow", "Carryin' slows me down", "The fuller you are (a pumped belly, a late litter, a clutch of eggs), the slower you walk on the map"],
        ["noMarkers", "Map markers (staff)", "Small badges over stock on your map: M needs milkin', H in heat, B expectin', X teats capped"]
      ].map(([k, label, desc]) => toggle(label, desc, !ctx3.prefs[k], () => {
        ctx3.setPref(k, !ctx3.prefs[k]);
        ctx3.api.rehello && ctx3.api.rehello();
      })),
      // OFF until you turn it on: the farm touchin' your arousal meter (cues.js)
      toggle(
        "Farm can stir me up",
        "Traps, toys and scenes nudge your arousal meter up, and while the farm has you denied you're held at the edge instead of cummin'. A buzzin' toy you're wearin' follows a trap too: low while it teases, high when it breeds you, still while you're denied, then back how you had it. Your safeword still stops everything.",
        !!ctx3.prefs.stir,
        () => {
          ctx3.setPref("stir", !ctx3.prefs.stir);
          ctx3.api.rehello && ctx3.api.rehello();
        }
      ),
      // OFF until you turn it on: real items from the traps (marks.js)
      toggle(
        "Farm can put real gear on me",
        "A trap that plugs, cups, clamps, chains, ropes or funnels you puts the real item on your character, and takes it off again when its time's up. Pull one off early and it goes back. Your safeword takes it all off. (The parasite doesn't need this: ?parasite on is its switch.)",
        !!ctx3.prefs.gear,
        () => {
          ctx3.setPref("gear", !ctx3.prefs.gear);
          ctx3.api.rehello && ctx3.api.rehello();
        }
      ),
      // OFF until you turn it on: your character's own chest and hips growin' with the farm's sizes (marks.js)
      toggle(
        "Farm can change my body shape",
        "Your chest grows a size on your character for every two udder sizes the farm gives you (up to the game's biggest), and your hips widen with a growin' ass or a heavy belly. Everything you're wearin' is redrawn to fit. Your own shape is remembered and comes back when the growth goes, when you switch this off, and for an hour after your safeword.",
        !!ctx3.prefs.shape,
        () => {
          ctx3.setPref("shape", !ctx3.prefs.shape);
          ctx3.api.rehello && ctx3.api.rehello();
        }
      ),
      // these two are OFF until you turn them on, and anybody can: the farm changin' what your character looks like (marks.js)
      toggle(
        "Farm can mark my body",
        "Loads leave the game's own splatters on your face, chest or tummy, wherever there's room, and farm words can be written on your body. ?wash takes them off.",
        !!ctx3.prefs.marks,
        () => ctx3.setPref("marks", !ctx3.prefs.marks)
      ),
      toggle(
        "Farm can strip me",
        "When the farm says so, your clothes come off (locked pieces stay). They're kept on this computer so you can dress again.",
        !!ctx3.prefs.strip,
        () => ctx3.setPref("strip", !ctx3.prefs.strip)
      ),
      // (the scale trial and the belly experiment are gone: the drawn body does both. Laynie, Oct 14: "can also remove the
      // scaling test from earlier from the companion")
      btn("Put the button and panel back (size and full screen too)", () => ctx3.resetPlaces && ctx3.resetPlaces()),
      // everything above, and the drawn body, messes and memory log, kept as a file on this computer too (localsave.js)
      saveCard(ctx3),
      // the record (chatlog.js): opt-in, at the very bottom. Proprietors are always recorded, so they get no switch.
      ctx3.s.logMust ? muted("\u{1F4DC} Your chat, beeps and commands are recorded for the farm (always, for proprietors).") : toggle(
        "Send a record of commands sent to and received from the bot",
        "Everything that lands in your chat (whispers, beeps, the farm's lines and answers) and the commands you send go to the farm girl once a minute, privately, and she keeps them by the hour. It helps staff find what went wrong when somethin' does. The same line from two places is kept once. Off unless you switch it on.",
        !!ctx3.prefs.chatlog,
        () => ctx3.setPref("chatlog", !ctx3.prefs.chatlog)
      )
    );
  }
  function saveCard(ctx3) {
    const ls = localSaveState(), say = (t2) => ctx3.hint(t2), t = (ms) => new Date(ms).toTimeString().slice(0, 5);
    const line3 = !ls.folder ? ls.can ? "Not saving to a folder yet." : "This browser can't save to a folder (Chrome and Edge can). You can still load a file." : ls.perm !== "granted" ? "Saving to " + ls.folder + " is paused till you reconnect it (the browser asks again after a restart)." : ls.err ? "Trouble saving to " + ls.folder + ": " + ls.err : "Saving to " + ls.folder + " every minute" + (ls.at ? ", last at " + t(ls.at) : "") + ", as " + ls.file + ".";
    return h(
      "div",
      {},
      muted("Your settings as a file on this computer: everything here, your drawn body, your messes and the memory log. It survives a crash, a cleared browser or a new one. " + line3),
      ls.folder && ls.perm !== "granted" ? btn("Reconnect " + ls.folder, () => localSaveReconnect(VERSION)) : null,
      ls.can ? btn(ls.folder ? "Save to a different folder" : "Save my settings to a folder\u2026", () => localSavePick(VERSION)) : null,
      ls.folder && ls.perm === "granted" ? btn("Save now", () => localSaveNow(VERSION).then(() => say("Saved."))) : null,
      btn("Load my settings from a file\u2026", () => {
        say("Pick the farmhand-companion file to load\u2026");
        localSaveLoad(say);
      })
    );
  }
  function drawnBodyCard(ctx3) {
    const st2 = drawnBodyState(), say = (t) => ctx3.hint(t);
    const code = h("textarea", { class: "fhc-in", rows: 2, placeholder: "\u2026or paste the code from the studio's Copy for the Companion button" });
    return card(
      title("Drawn body (outfit studio)"),
      toggle(
        "Show my drawn body",
        "Breasts from DD to R in your own skin, your belly, and what you wear fitted to them, on your character. Everyone here with the Companion sees it; people without it see the game's own picture of you. Off takes it away.",
        st2.on,
        () => {
          drawnBodySet(!st2.on, say);
          ctx3.setPref("drawnBody", !st2.on);
        }
      ),
      h(
        "div",
        { class: "fhc-kv", style: { marginTop: "6px" } },
        muted("Cup"),
        h(
          "select",
          { class: "fhc-sel", onchange: (e) => {
            const v = e.target.value;
            drawnBodyCup(v === "auto" ? "auto" : Number(v), say);
            ctx3.setPref("drawnBodyCup", v);
          } },
          [h("option", { value: "auto", selected: !st2.cupSet }, "Follow the farm" + (st2.farmCup ? " (" + (st2.cups[st2.farmCup] || "?") + " now)" : ""))].concat(
            st2.cups.map((c, i) => i < 6 ? null : h("option", { value: String(i), selected: st2.cupSet && i === st2.cup }, c))
          )
        )
      ),
      st2.on && st2.cup >= 6 && st2.chest && st2.chest !== "XLarge" ? muted("Your chest is set to " + st2.chest + " in the wardrobe. Set it to the biggest for the drawn breasts to show.") : null,
      h(
        "div",
        { class: "fhc-kv", style: { marginTop: "6px" } },
        muted("Belly"),
        h(
          "select",
          { class: "fhc-sel", onchange: (e) => {
            drawnBodyBelly(e.target.value, say);
            ctx3.setPref("drawnBodyBelly", e.target.value);
          } },
          [["farm", "Follow the farm" + (st2.farmBelly ? " (showing now)" : " (flat now)")], ["on", "Always"], ["off", "Never"]].concat(st2.fromStudio ? [["studio", "As my studio has it"]] : []).map(([v, label]) => h("option", { value: v, selected: st2.bellyMode === v }, label))
        )
      ),
      muted("Following the farm, your cup is the size the farm has grown your udder to, and your belly shows and grows as you fill up, carry eggs or get bred."),
      muted(st2.fromStudio ? "Using your own studio settings." : st2.fromFarm ? "Using the farm's look, with your own cup and belly." : "The farm's look comes from the farm girl once you're in her room; plain settings till then."),
      st2.fromStudio ? btn("Use the farm's look instead", () => {
        drawnBodyUseFarm(say);
        ctx3.setPref("drawnBodyAt", Date.now());
      }) : null,
      h("div", { style: { marginTop: "8px" } }, muted("Got an outfit studio of your own? Bring its settings over:")),
      h("div", { style: { marginTop: "4px" } }, btn("Get my studio's settings", () => {
        drawnBodyFromStudio(say).then((ok2) => {
          if (ok2) ctx3.setPref("drawnBodyAt", Date.now());
        });
      }, true)),
      muted("Works while the studio is running on this computer: it takes what you last saved there (Save the breasts, Save all the fits)."),
      h("div", { style: { marginTop: "6px" } }, code),
      btn("Put in the pasted code", () => {
        if (drawnBodyPaste(code.value, say)) ctx3.setPref("drawnBodyAt", Date.now());
      }),
      toggle(
        "See other people's drawn bodies",
        "Draw other Companion users the way their studio settings say" + (st2.othersHere ? " (" + st2.othersHere + " here now)" : "") + ". Off: everybody else is the game's own picture on your screen.",
        st2.seeOthers,
        () => {
          drawnBodySeeOthers(!st2.seeOthers, say);
          ctx3.setPref("drawnBodySee", !st2.seeOthers);
        }
      )
    );
  }
  function extraSwitches(ctx3) {
    const list = [];
    for (const m of Object.values(ctx3.s.mods || {})) for (const c of (m.cards || []).filter((c2) => c2 && !c2.staff)) for (const t of c.toggles || []) list.push([m.label, t]);
    if (!list.length) return null;
    return card(
      title("Farm extras"),
      muted("The farm's add-ons. Each one is off until you switch it on."),
      list.map(([label, t]) => toggle(String(t.label), (t.desc ? String(t.desc) + " " : "") + "(" + label + ")", !!t.on, () => ctx3.send(String(t.cmd))))
    );
  }
  function toggles(ctx3) {
    return [
      drawnBodyCard(ctx3),
      card(title("Farm settings"), muted("Saved by the farm girl. Your limits still win."), farmSwitches(ctx3, SWITCH_INFO)),
      extraSwitches(ctx3),
      card(
        title("Gender"),
        muted("How the farm sees you. It picks your farm outfit."),
        h("div", { style: { marginTop: "6px" } }, ["female", "male", "futa", "femboy", "nonbinary"].map((g) => h("button", { type: "button", class: "fhc-pill" + (ctx3.s.gender === g ? " on" : ""), onclick: () => ctx3.send("gender " + g) }, g)))
      ),
      card(
        title("Farm outfit"),
        muted("Dress me puts back on the outfit your record calls for (your species and gender, or your uniform while you're clocked in), in case it's come off or been changed."),
        btn("Dress me", () => ctx3.send("dressme"), true),
        ctx3.api.hasBackup && ctx3.api.hasBackup() ? h("div", null, muted("Your own clothes are kept on this computer."), btn("Change back into my own clothes", () => ctx3.api.back && ctx3.api.back())) : null
      ),
      panelPrefsOrLink(ctx3)
    ];
  }
  var LIVESTOCK_TABS = [
    { id: "me", label: "\u{1F404} Me", render: me2 },
    { id: "milk", label: "\u{1F95B} Milking", render: milking },
    { id: "breed", label: "\u{1F402} Breeding", render: breeding },
    { id: "traps", label: "\u{1F9EA} Traps", render: traps },
    { id: "store", label: "\u{1F380} Store", render: storeTab },
    { id: "inbox", label: "\u{1F4EC} Inbox", render: inbox },
    { id: "toggles", label: "\u2699\uFE0F Toggles", render: toggles },
    { id: "guides", label: "\u{1F4D6} Guides", render: (ctx3) => guidesTab(ctx3, false) },
    { id: "safety", label: "\u{1F198} Safety", render: safetyTab, offRow: true }
    // (the 🆘 button in the header opens it)
  ];

  // extension/src/views/guest.js
  var GUEST_TABS = [
    { id: "welcome", label: "\u{1F44B} Welcome", render: (ctx3) => [
      card(
        h("div", { class: "fhc-title" }, "Howdy, " + (ctx3.welcome.name || "sugar") + "!"),
        h("p", null, "Welcome to B&B Farm. Everybody here chose to be here and signed to say so. Have a look around, mind the ruts, and holler if you need a hand."),
        btn("Take the tour", () => ctx3.send("tour"), true),
        btn("Apply to join", () => ctx3.send("apply")),
        btn("Luxury stay", () => ctx3.send("luxury")),
        btn("Dress me", () => ctx3.send("dressme"))
      ),
      card(title("Your keys"), muted("Guests don't carry keys. Staff can let you through any door."))
    ] },
    { id: "farm", label: "\u{1F33E} The farm", render: () => AREAS.map(([n, key, d]) => card(h("div", { class: "fhc-kv" }, h("b", null, n), h("span", { class: "fhc-muted" }, key)), muted(d))) },
    { id: "rules", label: "\u{1F4CF} Rules", render: (ctx3) => [
      h(
        "div",
        { class: "fhc-box alert" },
        h("b", null, "Safe word stops everything"),
        muted("Anywhere, from anybody. No contract overrides it. Beepin' the farm girl works from anywhere on the property, too.")
      ),
      card(title("On consent"), h("p", null, "Every animal and every hand here chose to be here, and signed for it. What you see in the pens, stalls and barn was asked for. The contract's a fence that holds both ways: what ain't in it, don't happen.")),
      h("div", null, btn("Full rules", () => ctx3.send("rules")), btn("Consent", () => ctx3.send("consent")), btn("What opens what", () => ctx3.send("doors")))
    ] },
    { id: "inbox", label: "\u{1F4EC} Inbox", render: inbox },
    { id: "guides", label: "\u{1F4D6} Guides", render: (ctx3) => guidesTab(ctx3, false) },
    { id: "safety", label: "\u{1F198} Safety", render: safetyTab, offRow: true },
    // (the 🆘 button in the header opens it)
    { id: "settings", label: "\u2699\uFE0F Settings", render: (ctx3) => [card(title("Farm settings"), muted("Once you're on the books, your milkin', breedin' and teasin' switches show up here."), btn("Apply to join", () => ctx3.send("apply"), true)), drawnBodyCard(ctx3), panelPrefsOrLink(ctx3)] }
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
    // (no 1 hour any more: Laynie, Oct 22, "change the minimum contract length to 12 hours, even in the applications")
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
  function herd(ctx3) {
    const f = ctx3.ui.herdF || "all", list = (ctx3.s.herd || []).filter((x) => f === "all" || f === "mine" && x.mine || f === "milk" && x.milk !== null && x.milk >= 75 || f === "heat" && x.heat);
    const act = (c, x) => () => ctx3.send(c + " " + x.mn);
    return [
      h("div", null, [["all", "On the map"], ["mine", "My herd"], ["milk", "Needs milkin'"], ["heat", "In heat"]].map(([id, l]) => h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx3.setUi({ herdF: id }) }, l))),
      list.length ? list.map((x) => card(
        h("div", { class: "fhc-kv" }, h("b", null, x.name), h("span", { class: "fhc-muted" }, x.role + (x.where ? " \xB7 " + x.where : ""))),
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
  var COLORS = ["#8fbf6a", "#c9a35b", "#b8403a", "#7fa8c9", "#c48bd9", "#d98c6a"];
  function zones(ctx3) {
    const zs = ctx3.s.zones;
    if (!zs) return [muted("The farm map is for staff.")];
    const canEdit = ctx3.s.mapEdit !== false;
    const groups = [...new Set(Object.values(zs).map((z) => z.group))];
    const color = (g) => COLORS[groups.indexOf(g) % COLORS.length];
    const sel = ctx3.ui.zone && zs[ctx3.ui.zone] ? ctx3.ui.zone : Object.keys(zs)[0];
    const name = () => (ctx3.ui.zoneName || sel || "").trim().toLowerCase();
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
            onclick: () => ctx3.setUi({ zone: n }),
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
          Object.entries(ctx3.s.spots || {}).filter(([, p]) => p && Number.isFinite(p.X)).map(([n, p]) => h("span", {
            title: n + " \xB7 " + p.X + "," + p.Y,
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
          { type: "button", class: "fhc-doc" + (n === sel ? " on" : ""), style: { width: "100%", marginBottom: "4px" }, onclick: () => ctx3.setUi({ zone: n }) },
          h("b", null, n),
          h("div", { class: "fhc-muted" }, "part of " + z.group + " \xB7 A " + (z.a ? z.a.X + "," + z.a.Y : "\u2014") + " \u2192 B " + (z.b ? z.b.X + "," + z.b.Y : "\u2014"))
        )) : muted("No zones yet."),
        btn("Who's where", () => ctx3.send("zone who"))
      ),
      canEdit ? card(
        title(sel ? "Editin' " + sel : "New zone"),
        h("label", { class: "fhc-label" }, "Zone name (one word)", h("input", { class: "fhc-in", value: ctx3.ui.zoneName || sel || "", oninput: (e) => ctx3.setUi({ zoneName: e.target.value }, true) })),
        h("div", null, btn("Draw it on the map", () => {
          const n = name();
          if (!n) return ctx3.hint("Name the zone first.");
          ctx3.api.pickTiles(2, "zone '" + n + "'", ([a, b]) => ctx3.send("zone box " + n + " " + a.X + " " + a.Y + " " + b.X + " " + b.Y));
        }, true)),
        muted("Or walk it: stand on one corner, then the other."),
        h("div", null, btn("Set A where I stand", () => name() ? ctx3.send("zone a " + name()) : ctx3.hint("Name the zone first.")), btn("Set B where I stand", () => name() ? ctx3.send("zone b " + name()) : ctx3.hint("Name the zone first."))),
        h("label", { class: "fhc-label" }, "Pair with (one place, odd shapes)", h("input", { class: "fhc-in", placeholder: "barn", value: ctx3.ui.zonePair || "", oninput: (e) => ctx3.setUi({ zonePair: e.target.value }, true) })),
        h(
          "div",
          null,
          btn("Pair", () => name() && ctx3.ui.zonePair ? ctx3.send("zone pair " + name() + " " + ctx3.ui.zonePair.trim().toLowerCase()) : ctx3.hint("Name the zone, and the place to pair it with.")),
          btn("Unpair", () => name() ? ctx3.send("zone unpair " + name()) : ctx3.hint("Name the zone first.")),
          btn("Delete", () => name() ? ctx3.send("zone clear " + name()) : ctx3.hint("Name the zone first."))
        )
      ) : null,
      canEdit ? spotsCard(ctx3) : spotsList(ctx3),
      canEdit ? null : muted("Zones and spots are set by herdmasters and proprietors.")
    ];
  }
  function spotsList(ctx3) {
    const sp = Object.entries(ctx3.s.spots || {});
    return card(title("Spots"), sp.length ? sp.map(([n, p]) => h("div", { class: "fhc-kv" }, h("b", null, n), h("span", { class: "fhc-muted" }, p.X + "," + p.Y))) : muted("No spots yet."));
  }
  function spotsCard(ctx3) {
    const sp = Object.entries(ctx3.s.spots || {});
    const nm = () => (ctx3.ui.spotName || "").trim().toLowerCase();
    const ok2 = () => /^[a-z][a-z0-9_-]{1,19}$/.test(nm()) || (ctx3.hint("Give the spot a one-word name, like speaker-barn, trough-1 or glory-1."), false);
    return card(
      title("Spots"),
      muted("home \xB7 speaker-\u2026 (the bot talks from these) \xB7 trough-\u2026 \xB7 water-\u2026 \xB7 glory-1 and glory-1-visitor \xB7 placard-\u2026"),
      sp.length ? sp.map(([n, p]) => h(
        "div",
        { class: "fhc-kv" },
        h("span", null, h("b", null, n), " ", h("span", { class: "fhc-muted" }, p.X + "," + p.Y)),
        h(
          "span",
          null,
          h("button", { type: "button", class: "fhc-b", onclick: () => ctx3.setUi({ spotName: n }) }, "Pick"),
          h("button", { type: "button", class: "fhc-b", onclick: () => ctx3.send("spot clear " + n) }, "Clear")
        )
      )) : muted("No spots yet."),
      h("label", { class: "fhc-label" }, "Spot name", h("input", { class: "fhc-in", placeholder: "speaker-barn", value: ctx3.ui.spotName || "", oninput: (e) => ctx3.setUi({ spotName: e.target.value }, true) })),
      h(
        "div",
        null,
        btn("Click it on the map", () => {
          if (!ok2()) return;
          const n = nm();
          ctx3.api.pickTiles(1, "spot '" + n + "'", ([p]) => ctx3.send("spot place " + n + " " + p.X + " " + p.Y));
        }, true),
        btn("Set where I stand", () => ok2() && ctx3.send("spot set " + nm()))
      ),
      // clearin' old ones: everything with a name startin' like the box (speaker- clears every speaker), or all, with a second press
      sp.length ? h(
        "div",
        { style: { marginTop: "6px" } },
        btn("Clear all startin' with the name", () => {
          const n = nm();
          if (!n) return ctx3.hint("Type the start of the names first, like speaker-");
          ctx3.send("spot clear " + n + "*");
        }),
        ctx3.s.proprietor && (ctx3.ui.clearAllSpots ? btn("Yes, clear all " + sp.length + " spots", () => {
          ctx3.setUi({ clearAllSpots: false });
          ctx3.send("spot clear all yes");
        }, true) : btn("Clear all spots\u2026", () => ctx3.setUi({ clearAllSpots: true })))
      ) : null
    );
  }
  function voice() {
    return [
      card(
        title("ECHS sessions by depth"),
        muted("Still their ECHS: they agree to every induction, and their own switches and safeword win."),
        [
          ["Fun", "Drifting \xB7 Yielding", "Not noticin' clothes or touches, posture, can't touch yourself, made to act"],
          ["Deep", "Entranced", "Follow and leash, made to speak, hears only your voice, arousal and orgasm"],
          ["No human left", "Deep \xB7 Blank", "Clothing illusion, planted triggers, suggestions that last after wakin'"]
        ].map(([a, b, c]) => h("div", { class: "fhc-kv", style: { display: "block" } }, h("b", null, a + " \xB7 "), h("span", { style: { color: "var(--fh-accent)" } }, b), muted(c)))
      )
    ];
  }
  function shift(ctx3) {
    const sh = ctx3.s.shift || {};
    return [
      card(h(
        "div",
        { class: "fhc-kv" },
        h("div", null, title("Your shift"), muted((sh.clocked ? "On the clock" : "Off the clock") + " \xB7 " + (sh.weekH || 0) + " h this week")),
        btn(sh.clocked ? "Clock out" : "Clock in", () => ctx3.send(sh.clocked ? "clockout" : "clockin"), !sh.clocked)
      )),
      card(title("On duty"), (sh.onDuty || []).length ? sh.onDuty.map((n) => chip(n)) : muted("Nobody on duty here.")),
      card(
        title("On call"),
        muted("Mandated farmhands, plus staff who switched it on. Only these can be pulled in from other rooms."),
        (sh.onCall || []).length ? sh.onCall.map((o) => chip(o.name + (o.mandated ? " \xB7 mandated" : "") + (o.here ? " \xB7 here" : " \xB7 away"), o.here ? "good" : null)) : muted("Nobody's on call.")
      ),
      ctx3.s.log && card(title("Farm log"), ctx3.s.log.map((e) => h(
        "div",
        { class: "fhc-kv", style: { fontFamily: "ui-monospace,Consolas,monospace", fontSize: "11px" } },
        h("span", { class: "fhc-muted" }, new Date(e.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
        h("span", { style: { color: "var(--fh-accent)" } }, e.a),
        h("span", null, e.by + (e.d ? " \xB7 " + e.d : ""))
      ))),
      h("div", null, btn("Hours", () => ctx3.send("hours")), btn("Chores", () => ctx3.send("chores")), btn("Spin the wheel", () => ctx3.send("spin")))
    ];
  }

  // extension/src/views/log.js
  var KINDS = [["", "Everything"], ["whisper", "Whispers"], ["beep", "Beeps"], ["cmd", "Commands"], ["farm", "The farm"], ["chat", "Chat"], ["emote", "Emotes"], ["action", "Actions"]];
  var two = (n) => String(n).padStart(2, "0");
  var when = (t) => {
    const d = new Date(t);
    return two(d.getMonth() + 1) + "-" + two(d.getDate()) + " " + two(d.getHours()) + ":" + two(d.getMinutes()) + ":" + two(d.getSeconds());
  };
  var line2 = (r) => when(r.t) + " [" + r.k + "] " + (r.n || r.f || "") + (r.w ? " \u2192 " + r.w : "") + ": " + r.x;
  function logTab(ctx3) {
    const ui = ctx3.ui, who = ctx3.s.logWho || [], res = ui.logRows;
    const ask3 = () => ctx3.api.logAsk({ who: Number(ui.logWho) || 0, hours: Number(ui.logHours) || 3, kind: ui.logKind || "", q: String(ui.logQ || "").trim().slice(0, 80) });
    const save5 = () => {
      try {
        const blob = new Blob([(res.rows || []).map(line2).join("\n")], { type: "text/plain" }), a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "farm-log-" + (ui.logWho || "all") + "-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 13).replace("T", "-") + ".txt";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
      } catch (e) {
        ctx3.hint("Couldn't save it: " + e.message);
      }
    };
    return [
      card(
        title("\u{1F4DC} The record"),
        muted("What players see in their chat, the beeps they get and the commands they send the farm, kept by the hour. Proprietors are always recorded; anybody else only if they switched it on."),
        h(
          "label",
          { class: "fhc-label" },
          "Whose",
          h(
            "select",
            { class: "fhc-sel", onchange: (e) => ctx3.setUi({ logWho: e.target.value }, true) },
            [["", "Everybody"]].concat(who.map((w) => [String(w.mn), w.name + " (" + w.mn + ")"])).map(([v, l]) => h("option", { value: v, selected: String(ui.logWho || "") === v ? "selected" : null }, l))
          )
        ),
        h(
          "label",
          { class: "fhc-label" },
          "How far back",
          h(
            "select",
            { class: "fhc-sel", onchange: (e) => ctx3.setUi({ logHours: e.target.value }, true) },
            [["1", "The last hour"], ["3", "3 hours"], ["12", "12 hours"], ["24", "A day"], ["72", "3 days"], ["168", "A week"]].map(([v, l]) => h("option", { value: v, selected: String(ui.logHours || "3") === v ? "selected" : null }, l))
          )
        ),
        h("div", { style: { marginTop: "4px" } }, KINDS.map(([k, l]) => h("button", { type: "button", class: "fhc-pill" + ((ui.logKind || "") === k ? " on" : ""), onclick: () => ctx3.setUi({ logKind: k }) }, l))),
        h(
          "label",
          { class: "fhc-label" },
          "Words to look for",
          h("input", { class: "fhc-in", value: ui.logQ || "", placeholder: "a name, a command, anything", oninput: (e) => ctx3.setUi({ logQ: e.target.value }, true), onkeydown: (e) => {
            if (e.key === "Enter") ask3();
          } })
        ),
        h("div", { style: { marginTop: "6px" } }, btn("Show", ask3, true), res && (res.rows || []).length ? btn("Save as a file", save5) : null)
      ),
      res ? card(
        title(res.busy ? "Lookin'\u2026" : (res.total || 0) + " lines" + (res.total > (res.rows || []).length ? ", the newest " + res.rows.length + " shown" : "")),
        (res.rows || []).length ? h(
          "div",
          { style: { fontFamily: "monospace", fontSize: "11px", maxHeight: "420px", overflowY: "auto", whiteSpace: "pre-wrap" } },
          res.rows.map((r) => h("div", { style: { borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "2px 0" } }, line2(r)))
        ) : muted(res.busy ? "" : "Nothing matches.")
      ) : null
    ];
  }

  // extension/src/views/staff.js
  function latest(ctx3) {
    const r = ctx3.feed.filter((x) => x.kind === "reply").slice(-1)[0];
    return r ? card(title("Latest answer"), h("div", { class: "fhc-card" }, r.text)) : null;
  }
  var field = (label, input2) => h("label", { class: "fhc-label" }, label, input2);
  var input = (ph, key, ctx3) => h("input", { class: "fhc-in", placeholder: ph, value: ctx3.ui[key] || "", oninput: (e) => ctx3.setUi({ [key]: e.target.value }, true) });
  var select = (key, opts, ctx3) => h(
    "select",
    { class: "fhc-sel", onchange: (e) => ctx3.setUi({ [key]: e.target.value }, true) },
    opts.map(([v, l]) => h("option", { value: v, selected: (ctx3.ui[key] || opts[0][0]) === v ? "selected" : null }, l))
  );
  function me3(ctx3) {
    const s = ctx3.s;
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
          h("div", null, title("Duty"), muted(s.onDuty ? "On duty \xB7 silver and gold keys out" : "Out to pasture \xB7 bronze key only \xB7 your Livestock panel is yours")),
          s.pastureLock ? chip("kept out by " + s.pastureLock, "alert") : btn(s.onDuty ? "Go to pasture" : "Back on duty", () => ctx3.send(s.onDuty ? "pasture" : "onduty"), !s.onDuty)
        ),
        muted("Pasture puts your silver and gold keys away, makes you livestock for the visit, and takes you off call (mandated staff stay summonable). It doesn't lock you out. Only a ?turnout from your herd leader does that.")
      ),
      h("div", null, ["record", "hours", "myherd", "keys", "chores"].map((c) => btn(c[0].toUpperCase() + c.slice(1), () => ctx3.send(c)))),
      latest(ctx3)
    ];
  }
  function safeCards(ctx3) {
    const recent2 = ctx3.feed.filter((x) => x.kind === "notice" && /SAFEWORD/.test(x.text) && Date.now() - x.at < 60 * 6e4 && !ctx3.ui["done" + x.at]);
    return recent2.map((x) => h(
      "div",
      { class: "fhc-box alert" },
      h("b", null, x.text),
      muted("Everything's paused and on-call staff were summoned. Nothin' has been released. Check on them first, then decide."),
      h(
        "div",
        { style: { marginTop: "8px" } },
        btn("I'm goin' to them", () => ctx3.send("where"), true),
        btn("All okay, close it", () => ctx3.setUi({ ["done" + x.at]: true }))
      )
    ));
  }
  function office(ctx3) {
    const docs = ctx3.docs.slice().reverse();
    const sel = docs.find((d) => d.id === ctx3.ui.doc) || docs[0];
    return [
      safeCards(ctx3),
      muted("Anything you look up about somebody else lands here, not in the chat: record, stats, vet, quota, keys, size, pedigree."),
      h("div", null, h("input", {
        class: "fhc-in",
        placeholder: "Look somebody up: vet Bessie",
        value: ctx3.ui.look || "",
        oninput: (e) => ctx3.setUi({ look: e.target.value }, true),
        onkeydown: (e) => {
          if (e.key === "Enter" && ctx3.ui.look) {
            ctx3.send(ctx3.ui.look);
            ctx3.setUi({ look: "" });
          }
        }
      })),
      docs.length ? h(
        "div",
        { class: "fhc-split" },
        h("div", { class: "fhc-docs" }, docs.map((d) => h(
          "button",
          { type: "button", class: "fhc-doc" + (sel && d.id === sel.id ? " on" : ""), onclick: () => ctx3.setUi({ doc: d.id }) },
          h("b", null, d.who),
          h("div", { class: "fhc-muted" }, d.kind + " \xB7 " + new Date(d.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ))),
        sel && h(
          "div",
          { class: "fhc-box", style: { flex: "1", minWidth: "0" } },
          h("div", { class: "fhc-card" }, sel.text),
          h("div", { style: { marginTop: "8px" } }, btn("Refresh", () => ctx3.send(sel.kind + " " + sel.about)), btn("Close", () => ctx3.closeDoc(sel.id)))
        )
      ) : card(title("Nothin' on the desk"), muted("Try ?vet, ?record or ?stats with somebody's name."))
    ];
  }
  function contracts(ctx3) {
    const tpl = () => (ctx3.ui.ctTpl || "deep").trim(), who = () => (ctx3.ui.ctWho || "").trim(), dur = () => ctx3.ui.ctDur || "1w";
    const q2 = (v) => /\s/.test(v) ? '"' + v + '"' : v;
    const when2 = () => {
      const u = ctx3.ui, p = [];
      if (u.ctRoom) p.push("room=" + u.ctRoom);
      if ((u.ctNames || "").trim()) p.push((u.ctNamesMode === "notin" ? "notnames=" : "names=") + q2(u.ctNames.trim()));
      if ((u.ctMembers || "").trim()) p.push((u.ctMembersMode === "absent" ? "without=" : "with=") + u.ctMembers.trim().replace(/\s+/g, ""));
      if (u.ctRole) p.push((u.ctRoleMode === "absent" ? "norole=" : "role=") + u.ctRole);
      if (u.ctFrom && u.ctTo) p.push("time=" + u.ctFrom + "-" + u.ctTo);
      if ((u.ctOnly || "").trim()) p.push("only=" + u.ctOnly.trim().replace(/\s+/g, ""));
      return p.length ? " when " + p.join(" ") : "";
    };
    const sel = (key, opts) => h("select", { class: "fhc-sel", onchange: (e) => ctx3.setUi({ [key]: e.target.value }, true) }, opts.map(([v, l]) => h("option", { value: v, selected: (ctx3.ui[key] || "") === v ? "selected" : null }, l)));
    const timeIn = (key) => h("input", { class: "fhc-in", type: "time", value: ctx3.ui[key] || "", style: { width: "110px" }, oninput: (e) => ctx3.setUi({ [key]: e.target.value }, true) });
    return [
      card(
        title("Offer a BC+ contract"),
        muted("They read it in their own BC+ and only sign if they want it. Herdmasters and proprietors can offer."),
        field("Contract", h("input", { class: "fhc-in", value: ctx3.ui.ctTpl || "deep", placeholder: "fun, deep, nhl, or one of yours", oninput: (e) => ctx3.setUi({ ctTpl: e.target.value }, true) })),
        field("For (name or member number, here in the room)", input("Bessie", "ctWho", ctx3)),
        field("How long", select("ctDur", DURATIONS.map((d) => [d.key, d.label]), ctx3)),
        h(
          "details",
          { style: { margin: "6px 0" } },
          h("summary", null, "When the rules apply (BC+ conditions: leave empty for always)"),
          field("Rooms", sel("ctRoom", [["", "Any room"], ["public", "Public rooms only"], ["private", "Private rooms only"]])),
          field("Room names", h(
            "div",
            { class: "fhc-row", style: { padding: "0", border: "none" } },
            sel("ctNamesMode", [["in", "Only in"], ["notin", "Not in"]]),
            h("input", { class: "fhc-in", value: ctx3.ui.ctNames || "", placeholder: "farm, barn (part of the name)", oninput: (e) => ctx3.setUi({ ctNames: e.target.value }, true) })
          )),
          field("Who's there", h(
            "div",
            { class: "fhc-row", style: { padding: "0", border: "none" } },
            sel("ctMembersMode", [["present", "While one of these is there"], ["absent", "While none of these is there"]]),
            h("input", { class: "fhc-in", value: ctx3.ui.ctMembers || "", placeholder: "member numbers, like 221397, 232922", oninput: (e) => ctx3.setUi({ ctMembers: e.target.value }, true) })
          )),
          field("Their BC+ roles", h(
            "div",
            { class: "fhc-row", style: { padding: "0", border: "none" } },
            sel("ctRoleMode", [["present", "While somebody this close is there"], ["absent", "While nobody this close is there"]]),
            sel("ctRole", [["", "Anybody"], ["owner", "Owner"], ["lover", "Lover"], ["mistress", "Mistress"], ["whitelist", "Whitelist"], ["friend", "Friend"]])
          )),
          field("Time of day", h("div", { class: "fhc-row", style: { padding: "0", border: "none" } }, "from", timeIn("ctFrom"), "to", timeIn("ctTo"))),
          field("Only these rules (empty: all of them)", h("input", { class: "fhc-in", value: ctx3.ui.ctOnly || "", placeholder: "pet.speech, pet.hearing", oninput: (e) => ctx3.setUi({ ctOnly: e.target.value }, true) }))
        ),
        h(
          "div",
          null,
          btn("Preview", () => ctx3.send("contract show " + tpl() + (who() ? " " + who() : "") + when2())),
          btn("Offer it", () => who() ? ctx3.send("contract offer " + tpl() + " " + who() + " " + dur() + when2()) : ctx3.hint("Type who it's for first, in the For box."), true)
        )
      ),
      card(
        title("In force"),
        btn("List farm contracts", () => ctx3.send("contract list")),
        field("Somebody's contracts", input("Bessie", "ctLook", ctx3)),
        h(
          "div",
          null,
          btn("Ask their BC+", () => ctx3.ui.ctLook ? ctx3.send("contract check " + ctx3.ui.ctLook) : ctx3.hint("Type whose contracts first.")),
          btn("Release", () => ctx3.ui.ctLook ? ctx3.send("contract release " + ctx3.ui.ctLook) : ctx3.hint("Type whose contract to release first."))
        )
      ),
      latest(ctx3)
    ];
  }
  function barn(ctx3) {
    const who = () => (ctx3.ui.barnWho || "").trim();
    const act = (c) => () => who() ? ctx3.send(c + " " + who()) : ctx3.hint("Type who first, in the Who box.");
    return [
      card(
        title("Barn work"),
        field("Who", input("Bessie", "barnWho", ctx3)),
        h("div", null, ["milk", "collect", "drain", "edge", "denial", "ruin", "inspect", "vet", "quota"].map((c) => btn(c[0].toUpperCase() + c.slice(1), act(c))))
      ),
      card(
        title("Jars"),
        btn("The jar shelf", () => ctx3.send("jars")),
        muted("To inseminate: ?inseminate <who> <jar> [hole]. They always get asked first, and anyone with jar insemination off can't be."),
        h("div", null, btn("Inseminate\u2026", () => ctx3.fillBox("inseminate " + (who() ? who() + " " : ""))))
      ),
      card(
        title("Herd"),
        h("div", null, ["myherd", "herdcall", "herdsummon", "roster", "stock", "queue"].map((c) => btn(c, () => ctx3.send(c)))),
        h("div", null, btn("Summon to me", act("summon")), btn("Claim", act("claim")), btn("Turn out", act("turnout")), btn("Let up", act("letup")))
      ),
      latest(ctx3)
    ];
  }
  function queue(ctx3) {
    const apps = ctx3.s.apps || [], m = ctx3.s.mail;
    const role = (a) => ctx3.ui["role" + a.mn] || (a.staffTrack ? "farmhand" : "livestock");
    return [
      card(
        h("div", { class: "fhc-kv" }, title("Applications"), chip(apps.length + " waitin'", apps.length ? "alert" : null)),
        apps.length ? apps.map((a) => h(
          "div",
          { class: "fhc-box", style: { margin: "6px 0" } },
          h("div", { class: "fhc-kv" }, h("b", null, a.n + ". " + a.name), h("span", { class: "fhc-muted" }, new Date(a.at).toLocaleDateString())),
          muted(a.sum + (a.staffTrack ? " \xB7 wants to be staff" : "")),
          h("label", { class: "fhc-label" }, "Approve as", h(
            "select",
            { class: "fhc-sel", onchange: (e) => ctx3.setUi({ ["role" + a.mn]: e.target.value }, true) },
            ["livestock", "guest", "luxury", "gloryhole", "farmhand", "mandated", "herdmaster"].map((r) => h("option", { value: r, selected: role(a) === r ? "selected" : null }, r))
          )),
          h("div", null, btn("Read it", () => ctx3.send("app " + a.n)), btn("Approve", () => ctx3.send("approve " + a.mn + " " + role(a)), true), btn("Deny", () => ctx3.send("deny " + a.mn)))
        )) : muted("Nobody's waitin'. New ones beep you as well as showin' here.")
      ),
      m && card(
        title("The bot's messages"),
        h("div", { class: "fhc-kv" }, h("span", null, "Waitin' to send"), h("b", null, String(m.sending))),
        h("div", { class: "fhc-kv" }, h("span", null, "People with messages held (away or unreachable)"), h("b", null, String(m.held))),
        h("div", { class: "fhc-kv" }, h("span", null, "Online and beep-able (friends both ways)"), h("b", null, m.beepable === null ? "checkin'\u2026" : String(m.beepable))),
        muted("Held messages turn into one short summary when that person's back.")
      ),
      latest(ctx3)
    ];
  }
  function summonCheck() {
    const r = summonReady(BOT_MEMBER);
    if (r === null) return muted("BCX isn't loaded here. If you use BC+'s Ready to be summoned instead, add the farm bot (" + BOT_MEMBER + ") to it.");
    return h("div", { class: "fhc-kv" }, h("span", null, "Summon rule"), chip(r.ok ? "ready" : r.why, r.ok ? "good" : "alert"));
  }
  function toggles2(ctx3) {
    const s = ctx3.s, sw = s.switches || {};
    return [
      drawnBodyCard(ctx3),
      card(
        title("Work"),
        muted("Most staff leave this off. Mandated farmhands are always on call."),
        s.mandated ? h("div", { class: "fhc-kv" }, h("span", null, "On call"), chip("always (mandated)", "alert")) : toggle("On call", "Let the office summon you from anywhere with BCX or BC+ summoning", !!sw.forced, () => ctx3.send("forced")),
        s.onCall && summonCheck()
      ),
      muted("Your own milkin' and breedin' switches are on your Livestock panel."),
      panelPrefsOrLink(ctx3)
    ];
  }
  var STAFF_TABS = [
    { id: "me", label: "\u{1F9D1}\u200D\u{1F33E} Me", render: me3 },
    { id: "shift", label: "\u23F1\uFE0F Shift", render: shift },
    { id: "herd", label: "\u{1F411} Herd", render: herd },
    { id: "queue", label: "\u{1F4DD} Queue", render: queue, badge: (ctx3) => (ctx3.s.apps || []).length },
    { id: "office", label: "\u{1F5C2}\uFE0F Office", render: office, badge: (ctx3) => ctx3.docs.length },
    { id: "contracts", label: "\u{1F4DC} Contracts", render: contracts },
    { id: "barn", label: "\u{1F3DA}\uFE0F Barn", render: barn },
    { id: "zones", label: "\u{1F5FA}\uFE0F Zones", render: zones },
    { id: "voice", label: "\u{1F50A} ECHS", render: voice },
    { id: "toggles", label: "\u2699\uFE0F Toggles", render: toggles2 },
    { id: "guides", label: "\u{1F4D6} Guides", render: (ctx3) => guidesTab(ctx3, true) },
    { id: "log", label: "\u{1F4D2} Log", render: logTab, show: (ctx3) => !!ctx3.s.logReader }
    // the record (chatlog.js), for whoever may read it
  ];

  // extension/src/views/dashboard.js
  var field2 = (label, el) => h("label", { class: "fhc-label" }, label, el);
  var q = (v) => '"' + String(v).replace(/"/g, "'") + '"';
  function settingControl(ctx3, rule, s) {
    const key = "set:" + rule.id + ":" + s.name, cur = ctx3.ui[key];
    const set = (v) => ctx3.setUi({ [key]: v }, true);
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
          placeholder: "one " + (s.entryLabel || "entry") + " per line" + (s.maxEntries ? " \xB7 up to " + s.maxEntries : ""),
          oninput: (e) => set(e.target.value)
        }, cur !== void 0 ? cur : def);
      case "members":
        return h("input", { class: "fhc-in", placeholder: "farm, staff, or member numbers", value: cur !== void 0 ? cur : "farm", oninput: (e) => set(e.target.value) });
      default:
        return h("input", { class: "fhc-in", maxlength: s.maxChars || 256, value: cur !== void 0 ? cur : def, oninput: (e) => set(e.target.value) });
    }
  }
  function addCommand(ctx3, name, rule) {
    const pairs = rule.settings.map((s) => {
      const key = "set:" + rule.id + ":" + s.name;
      let v = ctx3.ui[key];
      if (v === void 0) v = s.type === "checkbox" ? s.default ? "on" : "off" : s.type === "members" ? "farm" : Array.isArray(s.default) ? s.default.join("\n") : s.default;
      if (s.type === "stringList") v = String(v).split("\n").map((x) => x.trim()).filter(Boolean).join("|");
      return s.name + "=" + q(v);
    });
    return ("contract add " + name + " " + rule.id + " " + pairs.join(" ")).trim();
  }
  function contracts2(ctx3) {
    const nm = () => (ctx3.ui.dName || "").trim().toLowerCase();
    const name = nm();
    const cats = [...new Set([...RULES.values()].map((r) => r.category))];
    const cat = ctx3.ui.dCat || cats[0];
    const inCat = [...RULES.values()].filter((r) => r.category === cat);
    const rule = RULES.get(ctx3.ui.dRule) && RULES.get(ctx3.ui.dRule).category === cat ? RULES.get(ctx3.ui.dRule) : inCat[0];
    const need = () => !nm() && (ctx3.hint("Give your contract a name first (one word, like prizecow)."), true);
    return [
      card(
        title("Your contract"),
        field2("Name (one word)", h("input", { class: "fhc-in", placeholder: "prizecow", value: ctx3.ui.dName || "", oninput: (e) => ctx3.setUi({ dName: e.target.value }, true) })),
        ctx3.ui.dWarn && !name ? muted("Give it a name first, sugar.") : null,
        h(
          "div",
          null,
          ["fun", "deep", "nhl"].map((b) => btn("New from " + b, () => !need() && ctx3.send("contract new " + nm() + " from " + b))),
          btn("New, empty", () => !need() && ctx3.send("contract new " + nm()))
        ),
        field2("Title", h("input", { class: "fhc-in", maxlength: 60, value: ctx3.ui.dTitle || "", oninput: (e) => ctx3.setUi({ dTitle: e.target.value }, true) })),
        field2("Terms they'll read (%name% becomes their name)", h("textarea", { class: "fhc-in", rows: 3, maxlength: 1e3, oninput: (e) => ctx3.setUi({ dTerms: e.target.value }, true) }, ctx3.ui.dTerms || "")),
        h(
          "div",
          null,
          btn("Save title", () => !need() && (ctx3.ui.dTitle ? ctx3.send("contract title " + nm() + " " + ctx3.ui.dTitle) : ctx3.hint("Type the title first."))),
          btn("Save terms", () => !need() && (ctx3.ui.dTerms ? ctx3.send("contract terms " + nm() + " " + ctx3.ui.dTerms) : ctx3.hint("Write the terms first."))),
          btn("Farm ends it", () => !need() && ctx3.send("contract policy " + nm() + " farm")),
          btn("Either side ends it", () => !need() && ctx3.send("contract policy " + nm() + " either"))
        )
      ),
      card(
        title("Add a BC+ rule"),
        muted("Every rule and setting BC+ " + BCPLUS_VERSION + " has. Only values BC+ accepts can be picked."),
        field2("Kind", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx3.setUi({ dCat: e.target.value, dRule: "" }) },
          cats.map((c) => h("option", { value: c, selected: c === cat ? "selected" : null }, c))
        )),
        field2("Rule", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx3.setUi({ dRule: e.target.value }) },
          inCat.map((r) => h("option", { value: r.id, selected: r === rule ? "selected" : null }, r.name + (NEVER[r.id] ? " (never on the farm)" : "")))
        )),
        rule && muted(rule.description),
        rule && NEVER[rule.id] ? h("div", { class: "fhc-box alert" }, "The farm never uses this one: it " + NEVER[rule.id] + ".") : rule && [
          rule.settings.map((s) => field2((s.label || s.name).replace(/:$/, ""), settingControl(ctx3, rule, s))),
          h(
            "div",
            null,
            btn("Add to " + (name || "contract"), () => !need() && ctx3.send(addCommand(ctx3, nm(), rule)), true),
            btn("Take it out", () => !need() && ctx3.send("contract remove " + nm() + " " + rule.id))
          )
        ]
      ),
      card(title("Check and send"), h(
        "div",
        null,
        btn("Preview", () => !need() && ctx3.send("contract show " + nm())),
        btn("All contracts", () => ctx3.send("contract list")),
        btn("Delete", () => !need() && ctx3.send("contract delete " + nm()))
      ), muted("Offer it from the Staff panel's Contracts tab.")),
      latest(ctx3)
    ];
  }
  function addons(ctx3) {
    const b = bcplusStatus(), s = summonReady(BOT_MEMBER);
    return [
      card(
        title("BC+"),
        chip(b.text, b.has ? b.match ? "good" : "alert" : "alert"),
        muted("Contracts are checked against BC+ " + BCPLUS_VERSION + ". If the club's BC+ moves on, re-run the catalog tool and rebuild.")
      ),
      card(
        title("BCX summoning (you)"),
        s === null ? muted("BCX isn't loaded here.") : chip(s.ok ? "Ready to be summoned \xB7 the farm bot is allowed" : s.why, s.ok ? "good" : "alert"),
        muted("On-call staff see the same check on their Staff panel.")
      ),
      card(title("Comin' soon"), muted("Echo's pumps and milk vendor, outfits by species and gender with high security locks, and the farm's own Listen to my voice (ECHS first)."))
    ];
  }
  var SPECIES = ["cow", "bull", "pony", "horse", "goat", "sheep", "pig", "bunny", "rabbit", "pup", "dog", "kitt", "cat", "fox", "wolf", "deer", "goblin"];
  var GENDERS = ["female", "male", "futa", "femboy", "nonbinary"];
  var KEYS_TEXT = { staff: "farm staff + their herd leader", leader: "their herd leader only", owners: "the proprietors only" };
  function outfits(ctx3) {
    const saved = ctx3.s.outfits || {}, rules = ctx3.s.outfitRules || {};
    const sp = ctx3.ui.oSp || "cow";
    const slotBox = (key, label) => h(
      "div",
      { class: "fhc-box", style: { padding: "8px", borderColor: saved[key] ? "var(--fh-good)" : "var(--fh-line)", borderStyle: saved[key] ? "solid" : "dashed" } },
      h("b", null, label),
      muted(saved[key] ? saved[key].items + " pieces" + (saved[key].locks ? ", " + saved[key].locks + " locked" : "") : "Not set \xB7 uses the fallback"),
      h(
        "div",
        { style: { marginTop: "6px" } },
        btn("Save what I'm wearin'", () => ctx3.api.save && ctx3.api.save(key)),
        saved[key] ? btn("Clear", () => ctx3.send("outfit clear " + key.replace("uniform:", "").replace("special:", "special ").replace("|", " ").replace("*", "any"))) : null
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
          { class: "fhc-sel", onchange: (e) => ctx3.setUi({ oSp: e.target.value }) },
          SPECIES.map((x) => h("option", { value: x, selected: x === sp ? "selected" : null }, x))
        )),
        h(
          "div",
          { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
          GENDERS.map((g) => slotBox(sp + "|" + g, sp + " \xB7 " + g)).concat([slotBox(sp + "|*", sp + " \xB7 any gender")])
        ),
        h(
          "div",
          { class: "fhc-grid", style: { gridTemplateColumns: "repeat(2,minmax(0,1fr))", marginTop: "8px" } },
          GENDERS.map((g) => slotBox("*|" + g, "any species \xB7 " + g)).concat([slotBox("stock", "Any new stock")])
        ),
        muted("No exact match? The farm falls back: this species + gender \u2192 this species \u2192 this gender \u2192 any new stock.")
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
          "New special (one word: luxury, fairday, prizecow\u2026)",
          h("input", { class: "fhc-in", value: ctx3.ui.oSpecial || "", oninput: (e) => ctx3.setUi({ oSpecial: e.target.value }, true) })
        ),
        btn("Save what I'm wearin' as this special", () => {
          const n = (ctx3.ui.oSpecial || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
          if (n.length < 2) return ctx3.hint("Name the special first (one word, like luxury).");
          ctx3.api.save && ctx3.api.save("special:" + n);
        })
      ),
      card(
        title("Locks"),
        h("div", { class: "fhc-kv" }, h("b", null, "High security padlock"), chip("every farm lock", "good")),
        h("label", { class: "fhc-label" }, "Who holds the keys", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx3.send("outfit keys " + e.target.value) },
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
            onclick: () => ctx3.send("outfit rule " + cmd + " " + (rules[k] ? "off" : "on"))
          }, h("span"))
        )),
        muted("Contracts offer an outfit when they're signed, too: ?contract outfit <name> auto|none|<slot>.")
      ),
      latest(ctx3)
    ];
  }
  var EDIT_FIELDS = [
    ["name", "Name"],
    ["species", "Species"],
    ["gender", "Gender"],
    ["stay", "Stay"],
    ["depth", "Depth"],
    ["limits", "Hard limits"],
    ["triggers", "Triggers"],
    ["aftercare", "Aftercare"],
    ["notes", "Notes (replaces them)"],
    ["app.name", "Application: what to call them"],
    ["app.role", "Application: here as"],
    ["app.likes", "Application: what sounds good"],
    ["app.curious", "Application: curious about"],
    ["app.soft", "Application: soft limits"],
    ["app.else", "Application: anything else"],
    ["app.handled", "Application (staff): handled before"],
    ["app.duties", "Application (staff): duties"],
    ["app.sideways", "Application (staff): steppin' in"]
  ];
  var EDIT_HINT = {
    gender: "female, male, futa, femboy or nonbinary",
    stay: "12 hours, 1 day, 1 week, 2 weeks, 1 month, permanent",
    depth: "fun, deep or no human left",
    species: "cow, pony, bunny, kitty\u2026 any animal",
    name: "what the farm calls them; clear goes back to their game nickname"
  };
  function records(ctx3) {
    const who = () => String(ctx3.ui.eWho || "").trim().replace(/\s+/g, " ");
    const fld = ctx3.ui.eField || "species";
    const need = () => who() ? false : (ctx3.hint("Who? Their member number is safest."), true);
    return [
      card(
        title("Edit a record"),
        muted("Fix a mistake on somebody's application or change their details. Member numbers are safest; a name works if it's on the books."),
        field2("Who (member number or name)", h("input", { class: "fhc-in", value: ctx3.ui.eWho || "", oninput: (e) => ctx3.setUi({ eWho: e.target.value }, true) })),
        btn("Show what's on file", () => !need() && ctx3.send("edit " + who())),
        field2("What to change", h(
          "select",
          { class: "fhc-sel", onchange: (e) => ctx3.setUi({ eField: e.target.value }) },
          EDIT_FIELDS.map(([k, label]) => h("option", { value: k, selected: k === fld ? "selected" : null }, label))
        )),
        field2("New value", h("input", { class: "fhc-in", placeholder: EDIT_HINT[fld] || "", value: ctx3.ui.eVal || "", oninput: (e) => ctx3.setUi({ eVal: e.target.value }, true) })),
        h(
          "div",
          null,
          btn("Save", () => {
            if (need()) return;
            const v = String(ctx3.ui.eVal || "").replace(/\s+/g, " ").trim();
            if (!v) return ctx3.hint("Type the new value first (or press Clear it).");
            ctx3.send("edit " + who() + " " + fld + " " + v);
            ctx3.setUi({ eVal: "" });
          }),
          btn("Clear it", () => !need() && ctx3.send("edit " + who() + " " + fld + " clear"))
        ),
        muted("Changes are saved on their record and in the audit log. Typed: ?edit <who> <field> <value>.")
      ),
      latest(ctx3)
    ];
  }
  var FB_ICON = { feedback: "\u{1F4AC}", idea: "\u{1F4A1}", bug: "\u{1F41B}", meh: "\u{1F44E}", more: "\u2764\uFE0F" };
  var FB_STATUS = { open: ["open", "acc"], done: ["done", "good"], later: ["later", ""], no: ["not now", "alert"] };
  function suggestions(ctx3) {
    const all = ctx3.s.feedback || [], f = ctx3.ui.fbFilter || "open";
    const shown = all.filter((x) => f === "all" ? true : f === "open" ? x.status === "open" : f === "lines" ? (x.kind === "meh" || x.kind === "more") && x.status === "open" : x.kind === f && x.status === "open");
    const pill = (id, label) => h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx3.setUi({ fbFilter: id }) }, label);
    return [
      h("div", null, pill("open", "Open"), pill("idea", "\u{1F4A1} Ideas"), pill("bug", "\u{1F41B} Bugs"), pill("feedback", "\u{1F4AC} Feedback"), pill("lines", "\u{1F44E}\u2764\uFE0F Lines"), pill("all", "Everything")),
      shown.length ? shown.map((x) => {
        const key = "fbnote_" + x.id, act = (what) => {
          const note2 = (ctx3.ui[key] || "").trim();
          ctx3.send("feedback " + what + " " + x.id + (note2 ? " " + note2 : ""));
          ctx3.setUi({ [key]: "" });
        };
        return card(
          h(
            "div",
            { class: "fhc-kv" },
            h("b", null, FB_ICON[x.kind] + " #" + x.id + " \xB7 " + x.name),
            h("span", null, chip(FB_STATUS[x.status][0], FB_STATUS[x.status][1]), " ", h("span", { class: "fhc-muted" }, new Date(x.t).toLocaleDateString()))
          ),
          h("div", { class: "fhc-card", style: { whiteSpace: "pre-wrap" } }, (x.kind === "meh" || x.kind === "more" ? "Line: " : "") + x.text),
          x.why && muted("Why: " + x.why),
          x.note && muted("Your note: " + x.note),
          h("input", { class: "fhc-in", placeholder: "a note back to " + x.name + " (optional)", value: ctx3.ui[key] || "", oninput: (e) => ctx3.setUi({ [key]: e.target.value }, true) }),
          h(
            "div",
            { style: { marginTop: "6px" } },
            btn("Done", () => act("done"), true),
            btn("Later", () => act("later")),
            btn("Not now", () => act("no")),
            btn("Delete", () => ctx3.send("feedback del " + x.id))
          )
        );
      }) : muted(f === "all" ? "The suggestion box is empty." : "Nothin' open here. Players send them with ?suggest, ?bug and ?feedback."),
      h("div", { style: { marginTop: "6px" } }, btn("Export everything (for Claude)", () => ctx3.send("feedback export")))
    ];
  }
  var DASHBOARD_TABS = [
    { id: "contracts", label: "BC+ contracts", render: contracts2 },
    { id: "outfits", label: "Outfits", render: outfits },
    { id: "addons", label: "Other addons", render: addons },
    { id: "records", label: "Records", render: records },
    { id: "suggestions", label: "\u{1F4A1} Suggestions", render: suggestions, badge: (ctx3) => (ctx3.s.feedback || []).filter((x) => x.status === "open").length }
  ];

  // extension/src/views/extras.js
  function modsFor(ctx3, view) {
    const mods = ctx3.s.mods || {};
    return Object.entries(mods).filter(([, m]) => m && typeof m === "object" && (!Array.isArray(m.views) || m.views.includes(view)) && Array.isArray(m.cards)).map(([name, m]) => [name, Object.assign({}, m, { cards: m.cards.filter((c) => c && (view === "staff" ? true : !c.staff)) })]).filter(([, m]) => m.cards.length);
  }
  function drawCard(ctx3, name, c, i) {
    const key = "x_" + name + "_" + i;
    return card(
      c.title && title(String(c.title)),
      c.text && h("div", { class: "fhc-card", style: { whiteSpace: "pre-wrap" } }, String(c.text)),
      Array.isArray(c.lines) && c.lines.map((l) => h("div", { class: "fhc-kv" }, h("span", null, String(l[0] ?? l)), l[1] !== void 0 ? h("b", null, String(l[1])) : null)),
      Array.isArray(c.bars) && c.bars.map((b) => bar(String(b.label || ""), String(b.value ?? ""), Number(b.pct) || 0, b.kind)),
      Array.isArray(c.chips) && c.chips.length ? h("div", null, c.chips.map((x) => chip(String(x.text ?? x), x.kind))) : null,
      Array.isArray(c.toggles) && c.toggles.map((t) => toggle(String(t.label || ""), t.desc ? String(t.desc) : "", !!t.on, () => ctx3.send(String(t.cmd)))),
      c.input && h(
        "div",
        null,
        h("input", { class: "fhc-in", placeholder: String(c.input.placeholder || ""), value: ctx3.ui[key] || "", oninput: (e) => ctx3.setUi({ [key]: e.target.value }, true) }),
        btn(String(c.input.label || "Send"), () => {
          const v = (ctx3.ui[key] || "").trim();
          if (!v) return ctx3.hint("Type somethin' in the box first.");
          ctx3.send(String(c.input.cmd) + " " + v);
          ctx3.setUi({ [key]: "" });
        }, true)
      ),
      Array.isArray(c.buttons) && c.buttons.length ? h("div", { style: { marginTop: "6px" } }, c.buttons.map((b) => btn(String(b.label || b.cmd), () => ctx3.send(String(b.cmd)), !!b.accent))) : null,
      c.note && muted(String(c.note))
    );
  }
  function render(ctx3, view) {
    const list = modsFor(ctx3, view);
    if (!list.length) return [muted("No farm extras for you right now.")];
    return list.map(([name, m]) => h(
      "div",
      null,
      h("div", { class: "fhc-muted", style: { margin: "8px 2px 2px" } }, "\u{1F9E9} " + String(m.label || name)),
      m.cards.map((c, i) => drawCard(ctx3, name, c, i))
    ));
  }
  function withExtras(tabs, view, ctx3) {
    if (!modsFor(ctx3, view).length) return tabs;
    const t = { id: "extras", label: "Farm extras", render: (c) => render(c, view) };
    const at = tabs.findIndex((x) => x.id === "guides");
    return at < 0 ? tabs.concat(t) : tabs.slice(0, at).concat(t, tabs.slice(at));
  }

  // extension/src/panel.js
  var left = (t) => {
    const m = Math.max(0, Math.ceil((t - Date.now()) / 6e4));
    return m >= 60 ? Math.floor(m / 60) + "h " + m % 60 + "m" : m + "m";
  };
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
      this.status = "\u2026";
      const doc = window.document;
      const style = doc.createElement("style");
      style.textContent = CSS + ":root{" + Object.entries(THEME).map(([k, v]) => "--fh-" + k + ":" + v).join(";") + "}";
      doc.head.appendChild(style);
      this.btn = h("button", { id: "fhc-btn", type: "button", title: "B&B Farm", "aria-label": "B&B Farm panel" }, "\u{1F33E}");
      this.btn.style.touchAction = "none";
      this.btn.addEventListener("pointerdown", (e) => this.dragButton(e));
      this.btn.addEventListener("click", () => {
        if (!this.btnDragged) this.toggle();
        this.btnDragged = false;
      });
      this.el = h("div", { id: "fhc-panel", role: "dialog", "aria-label": "B&B Farm" });
      this.el.addEventListener("keydown", (e) => e.stopPropagation());
      this.quietUntil = 0;
      this.pending = false;
      const busy = () => {
        this.quietUntil = Date.now() + 900;
        this.later();
      };
      for (const ev of ["touchmove", "wheel", "scroll"]) this.el.addEventListener(ev, busy, { passive: true, capture: true });
      this.el.addEventListener("focusout", () => setTimeout(() => this.later(), 300));
      const vp = () => doc.querySelector('meta[name="viewport"]');
      let vpWas = null;
      doc.addEventListener("focusin", (e) => {
        const t = e.target;
        if (!t || !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || !t.closest || !t.closest("#fhc-panel,#fhc-settings")) return;
        let m = vp();
        if (!m) {
          m = doc.createElement("meta");
          m.name = "viewport";
          m.content = "width=device-width, initial-scale=1";
          doc.head.appendChild(m);
        }
        if (vpWas === null) vpWas = m.getAttribute("content") || "";
        if (!/maximum-scale/.test(vpWas)) m.setAttribute("content", (vpWas ? vpWas + ", " : "") + "maximum-scale=1");
      });
      doc.addEventListener("focusout", (e) => {
        const t = e.target;
        if (vpWas === null || !t || !t.closest || !t.closest("#fhc-panel,#fhc-settings")) return;
        const m = vp();
        if (m) m.setAttribute("content", vpWas);
        vpWas = null;
      });
      this.top = h("div", { class: "fhc-top" });
      this.form = h(
        "form",
        { class: "fhc-form", onsubmit: (e) => {
          e.preventDefault();
          const i = this.form.querySelector("#fhc-input");
          if (i.value.trim()) this.ask(i.value.trim(), true);
          i.value = "";
        } },
        h(
          "label",
          { class: "fhc-grow", style: { display: "flex" } },
          h("span", { class: "fhc-sr" }, "Ask the farm girl"),
          h("input", { id: "fhc-input", class: "fhc-in", placeholder: "Ask the farm girl\u2026 (stats, size, help me)", autocomplete: "off" })
        ),
        h("button", { type: "submit", class: "fhc-b fhc-b-acc", style: { margin: "0" } }, "Send")
      );
      this.grip = h("div", { class: "fhc-grip", title: "Drag to resize", "aria-hidden": "true" });
      this.grip.addEventListener("pointerdown", (e) => this.resize(e));
      this.el.append(this.top, this.form, this.grip);
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
      this.el.classList.toggle("full", !!this.prefs.full);
      const sz = this.prefs.size;
      if (sz) Object.assign(this.el.style, { width: Math.min(sz.w, window.innerWidth - 8) + "px", height: Math.min(sz.h, window.innerHeight - 8) + "px" });
      else Object.assign(this.el.style, { width: "", height: "" });
      if (this.prefs.pos) {
        Object.assign(this.el.style, { left: this.clampX(this.prefs.pos.x, 120) + "px", top: this.clampY(this.prefs.pos.y, 60) + "px", right: "auto", bottom: "auto" });
        return;
      }
      if (!this.prefs.btnPos) {
        Object.assign(this.el.style, { left: "", top: "", right: "12px", bottom: "66px" });
        return;
      }
      const b = this.btn.getBoundingClientRect(), r0 = this.el.getBoundingClientRect();
      const pw = r0.width || Math.min(440, window.innerWidth - 24), ph = r0.height || Math.min(640, window.innerHeight * 0.78);
      const left2 = this.clampX(b.left + 46 - pw, pw);
      const top = b.top - ph - 8 >= 0 ? b.top - ph - 8 : this.clampY(b.bottom + 8, ph);
      Object.assign(this.el.style, { left: left2 + "px", top: top + "px", right: "auto", bottom: "auto" });
    }
    resetPlaces() {
      delete this.prefs.btnPos;
      delete this.prefs.pos;
      delete this.prefs.size;
      delete this.prefs.full;
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
      this.renderSoon();
    }
    setState(s) {
      this.s = s || this.s;
      this.renderSoon();
    }
    add(text, kind = "reply") {
      this.feed.push({ text: String(text), kind, at: Date.now() });
      if (kind !== "mine") this.fresh = { text: String(text), kind };
      while (this.feed.length > HISTORY_MAX) this.feed.shift();
      if (kind !== "mine") this.ping();
      if (kind === "mine") this.render();
      else this.renderSoon();
    }
    addDoc(d) {
      this.docs = this.docs.filter((x) => !(x.about === d.about && x.kind === d.kind));
      this.docs.push(Object.assign({ id: "d" + Date.now() + Math.random().toString(36).slice(2, 6), at: Date.now() }, d));
      this.ui.doc = this.docs[this.docs.length - 1].id;
      if (this.view() === "staff") this.ui.tab_staff = "office";
      this.ping();
      this.renderSoon();
    }
    addAsk(a) {
      this.asks = this.asks.filter((x) => Date.now() - x.at < 10 * 6e4).concat([Object.assign({ at: Date.now() }, a)]);
      this.ping(true);
      this.renderSoon();
    }
    setChoose(c) {
      this.choose = c;
      this.ping(true);
      this.renderSoon();
    }
    setOutfit(o) {
      this.outfit = o;
      this.ping(true);
      this.renderSoon();
    }
    // typed: they wrote it (or picked one of the bot's offered answers), so it may be an answer to a question the bot
    // asked; anything else is a button or a switch, and the bot is told so
    ask(cmd, typed) {
      this.add(cmd, "mine");
      this.onCommand(cmd, !!typed);
    }
    toggle(open2 = !this.el.classList.contains("open")) {
      if (open2) this.placePanel();
      this.el.classList.toggle("open", open2);
      if (open2) {
        this.unread = 0;
        this.btn.removeAttribute("data-unread");
      }
      clearInterval(this.clock);
      if (open2) this.clock = setInterval(() => {
        if ((this.s.now || []).some((x) => x.until)) this.renderSoon();
      }, 3e4);
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
        hint: (msg) => this.add("\u{1F449} " + msg, "notice"),
        fillBox: (text) => {
          this.add("\u{1F449} Finish it in the box at the bottom, then press Send: ?" + text + "\u2026", "notice");
          const i = this.form.querySelector("#fhc-input");
          if (i) {
            i.value = text;
            if (!touchScreen()) i.focus();
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
          this.add("\u{1F449} The \u{1F33E} button and panel are back in the corner, at their usual size.", "notice");
        }
      };
    }
    // somebody's in the middle of somethin' in here: swipin', or typin' in a box a redraw would replace
    busy() {
      if (Date.now() < this.quietUntil) return true;
      const a = window.document.activeElement;
      return !!(a && this.top && this.top.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
    }
    later() {
      clearTimeout(this.laterT);
      if (this.pending) this.laterT = setTimeout(() => {
        if (!this.pending) return;
        if (this.busy()) return this.later();
        this.render();
      }, 350);
    }
    renderSoon() {
      if (this.busy()) {
        this.pending = true;
        this.later();
        return;
      }
      this.render();
    }
    render() {
      this.pending = false;
      const ctx3 = this.ctx(), view = this.view(), V = VIEWS[view];
      const tabs = (view === "guest" ? V.tabs : withExtras(V.tabs, view, ctx3)).filter((t) => !t.show || t.show(ctx3));
      const tabKey = "tab_" + view, tab2 = tabs.find((t) => t.id === this.ui[tabKey]) || tabs[0];
      const scroll = this.el.querySelector(".fhc-body"), keep2 = scroll ? scroll.scrollTop : 0;
      const nav0 = this.el.querySelector("nav.fhc-tabs"), navKeep = nav0 ? nav0.scrollLeft : 0;
      this.el.classList.toggle("compact", !!this.prefs.compact);
      const full = !!this.prefs.full;
      this.top.replaceChildren(
        h(
          "div",
          { class: "fhc-head", style: { touchAction: "none" }, onpointerdown: (e) => this.drag(e) },
          h("div", null, h("div", { class: "fhc-title" }, "\u{1F33E} B&B Farm"), h("div", { id: "fhc-status", class: "fhc-muted" }, this.status)),
          h(
            "div",
            { style: { display: "flex", gap: "6px" } },
            h("button", {
              type: "button",
              class: "fhc-pill fhc-sos",
              title: "Safety: safe word, I'm stuck, call staff",
              "aria-label": "Safety",
              onclick: () => this.goSafety()
            }, "\u{1F198}"),
            h("button", {
              type: "button",
              class: "fhc-pill",
              title: full ? "Back to a panel" : "Full screen",
              "aria-label": full ? "Back to a panel" : "Full screen",
              onclick: () => {
                this.prefs.full = !full;
                savePrefs(this.prefs);
                this.placePanel();
                this.render();
              }
            }, full ? "\u{1F5D7}" : "\u26F6"),
            h("button", { type: "button", class: "fhc-pill", "aria-label": "Close the panel", onclick: () => this.toggle(false) }, "\u2715")
          )
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
        // Safe word, I'm stuck and Call staff live in the Safety tab (Guest and Livestock panels; staff reach it from Livestock)
        h("nav", { class: "fhc-row fhc-tabs", "aria-label": "Panel sections" }, tabs.filter((t) => !t.offRow || t === tab2).map((t) => {
          const n = t.badge ? t.badge(ctx3) : 0;
          return h("button", { type: "button", class: "fhc-pill" + (t === tab2 ? " on" : ""), onclick: () => {
            this.ui[tabKey] = t.id;
            this.render();
          } }, t.label + (n ? " \xB7 " + n : ""));
        })),
        h("div", { class: "fhc-body" }, this.banners(), safeRender(tab2, ctx3))
      );
      const body2 = this.el.querySelector(".fhc-body");
      if (body2) body2.scrollTop = keep2;
      const nav = this.el.querySelector("nav.fhc-tabs");
      if (nav) {
        nav.scrollLeft = navKeep;
        const on2 = nav.querySelector(".fhc-pill.on");
        if (on2 && (on2.offsetLeft < nav.scrollLeft || on2.offsetLeft + on2.offsetWidth > nav.scrollLeft + nav.clientWidth)) nav.scrollLeft = Math.max(0, on2.offsetLeft - 12);
      }
    }
    // 🆘: the Safety tab, from whichever panel they're on (staff go to it in their Livestock panel)
    goSafety() {
      let view = this.view();
      if (!VIEWS[view].tabs.some((t) => t.id === "safety")) {
        const alt = this.views().find((v) => VIEWS[v].tabs.some((t) => t.id === "safety"));
        if (alt) {
          view = alt;
          this.prefs.view = alt;
          savePrefs(this.prefs);
        }
      }
      this.ui["tab_" + view] = "safety";
      this.render();
    }
    // questions waitin' on you, on every tab
    banners() {
      const out = [];
      const view = this.view(), tabNow = this.ui["tab_" + view];
      const now = (this.s.now || []).filter((x) => !x.until || x.until > Date.now());
      if (now.length) out.push(h(
        "div",
        { class: "fhc-row", style: { flexWrap: "wrap", gap: "4px", margin: "0 0 6px" }, "aria-label": "Right now" },
        now.map((x) => chip(x.icon + " " + x.text + (x.until ? " \xB7 " + left(x.until) : ""), /🚫|🪵|⛓️|🚧|🔥/.test(x.icon) ? "alert" : "acc"))
      ));
      for (const b of this.s.benchHere || []) out.push(h(
        "div",
        { class: "fhc-box" },
        h("div", null, h("b", null, "\u{1FAB5} " + b.name + " is on the use bench"), h("span", { class: "fhc-muted" }, " \xB7 used " + b.uses + " time" + (b.uses === 1 ? "" : "s"))),
        h("div", { style: { marginTop: "6px" } }, (b.holes || []).map((hole) => btn({ mouth: "Use their mouth", vulva: "Use their pussy", butt: "Use their ass" }[hole], () => this.ask("use " + b.mn + " " + { mouth: "mouth", vulva: "pussy", butt: "ass" }[hole]), true))),
        h("div", { class: "fhc-muted" }, "Get within a couple of steps of the bench first.")
      ));
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
          } }, "\u2715")
        ),
        h("div", { class: "fhc-card" + (this.fresh.kind === "notice" ? " notice" : ""), style: { maxHeight: "180px", overflowY: "auto" } }, this.fresh.text)
      ));
      const o = this.outfit;
      if (o) out.push(h(
        "div",
        { class: "fhc-box ask" },
        h("b", null, "\u{1F457} " + (o.why ? o.why + ": " : "") + "put on your " + o.label + "?"),
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
          this.ask(c, true);
        }, true)))
      ));
      for (const w of this.s.wants || []) out.push(h(
        "div",
        { class: "fhc-box ask" },
        h("b", null, (w.icon || "\u{1F5E3}\uFE0F") + " " + w.label),
        w.say ? h("div", { class: "fhc-muted" }, "\u201C" + w.say + "\u201D") : null,
        h(
          "div",
          { style: { marginTop: "8px" } },
          w.say ? btn("Say it", () => {
            this.api.say && this.api.say(w.say);
          }, true) : btn(w.cmd.split(" ")[0] === "beg" ? "Beg" : "Do it", () => this.ask(w.cmd, true), true)
        ),
        h("div", { class: "fhc-muted" }, "Straight to the farm, past any gag or speech rule.")
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
            this.ask("yes", true);
          }, true),
          btn("No", () => {
            this.asks = this.asks.filter((x) => x !== a);
            this.ask("no", true);
          })
        )
      ));
      return out;
    }
    // drag the corner grip: the panel grows or shrinks from its top-left corner, and remembers the size
    resize(e) {
      e.preventDefault();
      e.stopPropagation();
      const r = this.el.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
      Object.assign(this.el.style, { left: r.left + "px", top: r.top + "px", right: "auto", bottom: "auto" });
      const move = (ev) => {
        const w = Math.max(300, Math.min(window.innerWidth - r.left - 4, r.width + ev.clientX - x0));
        const hh = Math.max(300, Math.min(window.innerHeight - r.top - 4, r.height + ev.clientY - y0));
        Object.assign(this.el.style, { width: w + "px", height: hh + "px" });
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        const b = this.el.getBoundingClientRect();
        this.prefs.size = { w: Math.round(b.width), h: Math.round(b.height) };
        this.prefs.pos = { x: Math.round(b.left), y: Math.round(b.top) };
        savePrefs(this.prefs);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }
    drag(e) {
      if (e.target.closest("button") || this.prefs.full) return;
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
  function touchScreen() {
    try {
      return window.matchMedia("(pointer: coarse)").matches;
    } catch (e) {
      return false;
    }
  }
  function safeRender(tab2, ctx3) {
    try {
      return tab2.render(ctx3);
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
  function commit(bundle2) {
    window.ServerAppearanceLoadFromBundle(P(), P().AssetFamily, bundle2, P().MemberNumber);
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
  function canLock(it) {
    try {
      const A = window.AssetGet && window.AssetGet(P().AssetFamily || "Female3DCG", it.Group, it.Name);
      if (!A) return false;
      const tr = it.Property && it.Property.TypeRecord;
      if (A.AllowLockType && tr && typeof tr === "object") return Object.entries(tr).some(([k, i]) => A.AllowLockType[k] && A.AllowLockType[k].has && A.AllowLockType[k].has(i));
      return !!A.AllowLock;
    } catch (e) {
      return false;
    }
  }
  function wearOutfit(data, keys) {
    const outfit = JSON.parse(window.LZString.decompressFromBase64(String(data)) || "null");
    if (!outfit || !Array.isArray(outfit.items)) return { ok: false, why: "that outfit didn't come through right" };
    const cur = window.ServerAppearanceBundle(P().Appearance), stuck = lockedGroups();
    const mine3 = new Set(outfit.items.map((i) => i.Group));
    const next = cur.filter((b) => {
      if (stuck.has(b.Group)) return true;
      const g = groupOf(b.Group);
      if (isClothes(g)) return false;
      return !mine3.has(b.Group);
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
      if ((it.locked || canLock(it)) && keys && keys.length) {
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

  // extension/src/marks.js
  var KEY4 = "fhc-marks";
  var STRIP_KEY = "fhc-strip-backup";
  var SPLAT_GROUPS = ["Mask", "FaceMarkings", "BodyMarkings"];
  var WRITE_GROUPS = ["BodyMarkings", "ClothAccessory"];
  var TREATISE = { group: "BodyMarkings2_Luzi", name: "\u8EAB\u4F53\u8BBA\u6587" };
  var T_AREAS = { collar: [0, 1, 2], chest: [3, 4, 5], ribs: [6, 7, 8], waist: [9, 10, 11], hips: [12, 13, 14] };
  var TALLY_PLACE = 11;
  var AREAS2 = { forehead: ["a", "b", "c"], face: ["d", "e", "f"], chest: ["g", "h", "i", "j"], tummy: ["k", "l", "m", "n"] };
  var SPILL = { forehead: "face", face: "chest", chest: "tummy", tummy: "chest" };
  var SPILL_CHANCE = 0.35;
  var P2 = () => window.Player;
  var load3 = () => {
    try {
      return JSON.parse(window.localStorage.getItem(KEY4)) || {};
    } catch (e) {
      return {};
    }
  };
  var save4 = (v) => {
    try {
      window.localStorage.setItem(KEY4, JSON.stringify(v));
    } catch (e) {
    }
  };
  var groupOf2 = (name) => typeof window.AssetGroupGet === "function" ? window.AssetGroupGet(P2().AssetFamily, name) : null;
  var bundle = () => window.ServerAppearanceBundle(P2().Appearance);
  var lockedGroups2 = () => new Set(P2().Appearance.filter((it) => it.Property && it.Property.LockedBy).map((it) => it.Asset.Group.Name));
  function commit2(next) {
    window.ServerAppearanceLoadFromBundle(P2(), P2().AssetFamily, next, P2().MemberNumber);
    if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(P2());
    window.ChatRoomCharacterUpdate(P2());
  }
  var cleanText = (t) => String(t || "").replace(/[^A-Za-z0-9 !?.,'&#*+-]/g, "").slice(0, 20);
  function markBody(m, prefs) {
    if (!P2() || !Array.isArray(P2().Appearance) || typeof window.ServerAppearanceBundle !== "function") return { ok: false, why: "not in a room" };
    const did = [];
    if (m.wash) return washMarks();
    if (!prefs.marks) return { ok: false, why: "off" };
    let next = bundle(), mem = load3();
    const has = (g) => next.find((b) => b.Group === g);
    if (Array.isArray(m.splat) && m.splat.length) {
      const col = typeof m.color === "string" && /^#[0-9a-fA-F]{6}$/.test(m.color) ? m.color.toUpperCase() : null;
      const colOf = (b) => typeof b.Color === "string" && /^#/.test(b.Color) ? b.Color.toUpperCase() : null;
      const mine3 = next.filter((b) => b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group));
      let it = mine3.find((b) => colOf(b) === col);
      if (!it) {
        const g = SPLAT_GROUPS.find((x) => !has(x) && groupOf2(x));
        if (g) {
          it = { Group: g, Name: "Splatters", Property: { TypeRecord: {} } };
          if (col) it.Color = col;
          next.push(it);
          mem.splatGroup = g;
        } else it = mine3[0];
      }
      if (it) {
        it.Property = Object.assign({}, it.Property || {});
        const tr = it.Property.TypeRecord = Object.assign({}, it.Property.TypeRecord || {});
        for (const area of m.splat) {
          const want = (AREAS2[area] || []).filter((k2) => !tr[k2]);
          const any = Object.values(AREAS2).flat().filter((k2) => !tr[k2]);
          const k = (want.length ? want : any)[Math.floor(Math.random() * (want.length ? want : any).length)];
          if (k) {
            tr[k] = 1;
            did.push(area);
          }
          if (k && SPILL[area] && Math.random() < SPILL_CHANCE) {
            const down = AREAS2[SPILL[area]].filter((x) => !tr[x]);
            if (down.length) {
              tr[down[Math.floor(Math.random() * down.length)]] = 1;
              did.push(SPILL[area]);
            }
          }
        }
      }
    }
    if (m.write && cleanText(m.write.line) || m.tally) {
      if (groupOf2(TREATISE.group)) {
        let it = next.find((b) => b.Group === TREATISE.group && b.Name === TREATISE.name);
        if (!it && !has(TREATISE.group)) {
          it = { Group: TREATISE.group, Name: TREATISE.name, Property: { TypeRecord: {} } };
          next.push(it);
          mem.treatise = true;
        }
        if (it) {
          const pr = it.Property = Object.assign({}, it.Property || {}), tr = pr.TypeRecord = Object.assign({}, pr.TypeRecord || {});
          const put2 = (place, line3, text) => {
            pr["Text" + (place * 3 + line3)] = cleanText(text).toUpperCase();
            tr[String.fromCharCode(97 + place)] = 1;
          };
          if (m.tally) {
            put2(TALLY_PLACE, 1, String(m.tally));
            did.push("tally");
          }
          if (m.write && cleanText(m.write.line)) {
            const pref2 = T_AREAS[m.write.area] || (m.write.pos !== void 0 ? [Math.min(14, Number(m.write.pos))] : [13, 10, 4, 1, 7]);
            const all = [...pref2, ...Array.from({ length: 15 }, (_, i) => i).filter((i) => !pref2.includes(i) && i !== TALLY_PLACE)];
            let spot = null;
            for (const pl of all) {
              for (const ln of [1, 2, 3]) if (!pr["Text" + (pl * 3 + ln)]) {
                spot = [pl, ln];
                break;
              }
              if (spot) break;
            }
            if (!spot) spot = [pref2[0], 1 + Math.floor(Math.random() * 3)];
            put2(spot[0], spot[1], m.write.line);
            did.push("writing");
          }
          save4(mem);
          commit2(next);
          return { ok: true, did };
        }
      }
    }
    if (m.write && cleanText(m.write.line)) {
      let it = next.find((b) => b.Name === "BodyWritings" && WRITE_GROUPS.includes(b.Group));
      if (!it) {
        const g = WRITE_GROUPS.find((x) => !has(x) && groupOf2(x));
        if (g) {
          it = { Group: g, Name: "BodyWritings", Property: { Text: "", Text2: "", Text3: "", TypeRecord: { p: 4, s: 0, t: 1 } } };
          next.push(it);
          mem.writeGroup = g;
        }
      }
      if (it) {
        const pr = it.Property = Object.assign({ Text: "", Text2: "", Text3: "" }, it.Property || {});
        pr.Text3 = pr.Text2 || "";
        pr.Text2 = pr.Text || "";
        pr.Text = cleanText(m.write.line).toUpperCase();
        pr.TypeRecord = Object.assign({ p: 4, s: 0, t: 1 }, pr.TypeRecord || {}, m.write.pos !== void 0 ? { p: m.write.pos } : {}, m.write.style !== void 0 ? { s: m.write.style } : {}, { t: 1 });
        did.push("writing");
      }
    }
    if (!did.length) return { ok: false, why: "no room" };
    save4(mem);
    commit2(next);
    return { ok: true, did };
  }
  var FARM_TAG = "BnB Farm gear.";
  var OLD_TAG = "[B&B Farm gear]";
  var FARM_NAMES = [
    "Parasite Lips",
    "Parasite Belt",
    "Pump Bung",
    "Egg Post Plug",
    "Slime Seal",
    "Boar's Plug",
    "Seed Pod Stem",
    "Denial Clamp",
    "Growth Cups",
    "Trap Milker",
    "Winch Chain",
    "Feed Chute",
    "Snare Rope",
    "Breedin' Frame Cuffs",
    "Kennel Lead",
    "The Water's Grip",
    "The Water's Coils",
    "Slime Sleeves",
    "Slime Stockings",
    "Snare Hobble",
    "Pack's Knot",
    "Stud's Stopper",
    "Pillory Spreader",
    "Parasite Suckers",
    "Parasite Root",
    "The Water's Embrace",
    "Brood Sac",
    "Grower's Sheath",
    "Glutton's Sleeve",
    "Tyrant's Cage",
    "Tyrant's Web",
    "Growin' Plug",
    "Hungry Belt",
    "Milkmaid's Cups",
    "Glutton's Funnel",
    "The Hobble",
    "Living Suit (legs)",
    "Living Suit (hips)",
    "Living Suit (chest)",
    "Living Suit (arms)",
    "Living Suit (mouth)",
    // Oct 15: the newer traps' equipment
    "Buckin' Saddle",
    "Saddle Post",
    "Hayloft Net",
    "Lost Cow Bell",
    "Teasin' Stall",
    "Sheep Dip",
    "Breedin' Crate",
    "Sire's Stopper",
    "Carousel Milkers",
    "Carousel Cuffs",
    "Plow Bit",
    "Plow Harness",
    "Bale Twine",
    "Scarecrow Post",
    "Scarecrow Ropes",
    "Clothespins",
    "Washin' Line",
    "Fair Stocks",
    "The Pillory",
    "Breedin' Wheel",
    "Windmill Sails",
    "Kissin' Gate",
    "The Fence",
    "Collection Bench",
    "Auction Block",
    "Livin' Latex (hands)",
    "Livin' Latex (arms)",
    "Livin' Latex (feet)",
    "Livin' Latex (legs)",
    "Livin' Latex (body)",
    "Livin' Latex (heels)",
    "Milk Moss",
    "Milk Moss (bloom)"
  ];
  var GEAR_SLOTS = {
    plug: { groups: ["ItemButt"], names: ["InflVibeButtPlug", "BlackButtPlug", "ButtPlug", "ButtPump"], re: /ButtPlug|Plug/, color: "#2B2B2B" },
    dildo: { groups: ["ItemVulva"], names: ["InflatableVibeDildo", "VibratingDildo", "ClitoralStimulator"], re: /Dildo/, color: "#2B2B2B" },
    belt: { groups: ["ItemPelvis"], names: ["PolishedChastityBelt", "LeatherChastityBelt", "SleekLeatherChastityBelt", "MetalChastityBelt"], re: /ChastityBelt/ },
    cups: { groups: ["ItemNipples"], names: ["LactationPump", "NippleSuctionCups"], re: /Pump|Suction/ },
    leash: { groups: ["ItemNeckRestraints"], names: ["CollarChainLong", "CollarLeash", "CollarChainShort"], re: /Chain|Leash/, needs: "ItemNeck" },
    funnel: { groups: ["ItemMouth", "ItemMouth2", "ItemMouth3"], names: ["FunnelGag"], re: /Funnel/ },
    ropeArms: { groups: ["ItemArms"], names: ["HempRope"], re: /Rope/ },
    arms: { groups: ["ItemArms"], names: ["HempRope", "LeatherCuffs"], re: /Rope|Cuffs/ },
    legs: { groups: ["ItemLegs"], names: ["HempRope", "LeatherLegCuffs"], re: /Rope|Cuffs/ },
    ropeFeet: { groups: ["ItemFeet"], names: ["HempRope"], re: /Rope/ },
    // (a piece can ask for a spreader bar here instead)
    lips: { groups: ["ItemMouth", "ItemMouth2", "ItemMouth3"], names: ["LipGag"], re: /LipGag/, color: ["#E0607F", "#7A2B47", "#7A2B47"] },
    torso: { groups: ["ItemTorso", "ItemTorso2"], names: ["TentacleSuit", "HempRopeHarness"], re: /Harness/ },
    tag: { groups: ["ItemNeckAccessories"], names: ["CollarNameTagLivestock", "CollarNameTag"], re: /NameTag/, needs: "ItemNeck" },
    // the big pieces (Oct 15): the game's own devices, only the ones a piece names (no stray device off the list)
    // clothes a symbiote grows into (Oct 15): these take the spot over if you're wearing something there, and put yours
    // back when the piece comes off (takeover)
    gloves: { groups: ["Gloves"], names: ["LatexShortGloves"], re: /^Latex/, takeover: true },
    socks: { groups: ["Socks"], names: ["LatexSocks1"], re: /^Latex/, takeover: true },
    suit: { groups: ["Suit"], names: ["LatexCatsuit"], re: /^LatexCatsuit$/, takeover: true },
    suitLower: { groups: ["SuitLower"], names: ["LatexCatsuit"], re: /^LatexCatsuit$/, takeover: true },
    bra: { groups: ["Bra"], names: ["FlowerBra"], re: /^FlowerBra$/, takeover: true },
    hat: { groups: ["Hat"], names: ["FlowerCrown"], re: /^FlowerCrown$/, takeover: true },
    boots: { groups: ["ItemBoots"], names: ["ThighHighLatexHeels"], re: /^ThighHighLatexHeels$/ },
    device: { groups: ["ItemDevices"], names: ["WoodenStocks"], re: /^(WoodenStocks|SaddleStand|WoodenHorse|Net|Kennel|LowCage|KabeshiriWall|WheelFortune|LuckyWheel|X-Cross|BondageBench|TheDisplayFrame|MilkCan)$/ }
  };
  var GEAR_OPT = {
    "ItemArms:LeatherCuffs": "Wrist",
    "ItemArms:SteelCuffs": "Wrist",
    "ItemArms:WristShackles": "Behind",
    "ItemArms:WoodenCuffs": "HandsBack",
    "ItemArms:HempRope": "BoxTie",
    "ItemLegs:LeatherLegCuffs": "Chained",
    "ItemLegs:HempRope": "Basic",
    "ItemFeet:HempRope": "Basic",
    "ItemFeet:SpreaderMetal": "Wide",
    "ItemFeet:HeavySpreaderMetal": "Wide",
    "ItemFeet:WoodenCuffs": "Spread2",
    "ItemMouth:FunnelGag": "Funnel",
    "ItemMouth2:FunnelGag": "Funnel",
    "ItemMouth3:FunnelGag": "Funnel",
    "ItemNipples:LactationPump": "MediumSuction",
    "ItemDevices:BondageBench": "Normal",
    "ItemTorso:HempRopeHarness": "Harness",
    "ItemTorso2:HempRopeHarness": "Harness"
  };
  function itemHome(name, slot, taken) {
    const all = Array.isArray(window.Asset) ? window.Asset : [];
    const homes = all.filter((a) => a && a.Name === name && a.Group && a.Group.Family === P2().AssetFamily && /^Item/.test(a.Group.Name)).map((a) => a.Group.Name);
    return homes.find((g) => slot.groups.includes(g) && !taken(g)) || homes.find((g) => !taken(g)) || null;
  }
  function setGearOpt(group, name, want) {
    try {
      const it = typeof window.InventoryGet === "function" ? window.InventoryGet(P2(), group) : null;
      if (!it || it.Asset.Name !== name || typeof window.ExtendedItemGetData !== "function" || typeof window.ExtendedItemSetOptionByRecord !== "function") return false;
      const data = window.ExtendedItemGetData(it.Asset, it.Asset.Archetype);
      if (!data || data.archetype !== "typed" || !Array.isArray(data.options)) return false;
      const i = data.options.findIndex((o) => o.Name === want);
      if (i < 0) return false;
      window.ExtendedItemSetOptionByRecord(P2(), it, { typed: i }, { push: true, refresh: true, C_Source: P2() });
      return true;
    } catch (e) {
      console.warn("[Farmhand Companion] gear setting:", e);
      return false;
    }
  }
  function gearAsset(group, slot, prefer) {
    const fam = P2().AssetFamily, get2 = (n) => {
      try {
        return typeof window.AssetGet === "function" ? window.AssetGet(fam, group, n) : null;
      } catch (e) {
        return null;
      }
    };
    for (const n of Array.isArray(prefer) ? prefer.map(String) : []) if (/^[A-Za-z0-9_]{2,40}$/.test(n) && get2(n)) return n;
    for (const n of slot.names) if (get2(n)) return n;
    const all = Array.isArray(window.Asset) ? window.Asset : [];
    const hit = all.find((a) => a && a.Group && a.Group.Name === group && slot.re.test(a.Name) && !a.OwnerOnly && !a.LoverOnly && !a.FamilyOnly);
    return hit ? hit.Name : typeof window.AssetGet !== "function" ? slot.names[0] : null;
  }
  var NAMES_KEY = "fhc-gear-names";
  var knownNames = () => {
    try {
      return FARM_NAMES.concat(JSON.parse(window.localStorage.getItem(NAMES_KEY)) || []);
    } catch (e) {
      return FARM_NAMES;
    }
  };
  var learnName = (n) => {
    try {
      const have = JSON.parse(window.localStorage.getItem(NAMES_KEY)) || [];
      if (!FARM_NAMES.includes(n) && !have.includes(n)) window.localStorage.setItem(NAMES_KEY, JSON.stringify(have.concat(n).slice(-80)));
    } catch (e) {
    }
  };
  var isFarmGear = (b) => {
    const c = b.Craft, d = c ? String(c.Description || "") : "";
    return !!(c && (d.includes(FARM_TAG) || d.includes(OLD_TAG) || knownNames().includes(c.Name) && (!c.MemberNumber || c.MemberNumber === P2().MemberNumber)));
  };
  var GEAR_KEY = "fhc-gear";
  var gearMem = () => {
    try {
      return JSON.parse(window.localStorage.getItem(GEAR_KEY)) || {};
    } catch (e) {
      return {};
    }
  };
  var gearMemSave = (m) => {
    try {
      window.localStorage.setItem(GEAR_KEY, JSON.stringify(m));
    } catch (e) {
    }
  };
  var gearNameOf = (b, mem) => isFarmGear(b) ? b.Craft.Name : Object.keys(mem).find((n) => mem[n].group === b.Group && mem[n].item === b.Name && (!(b.Craft && b.Craft.Name) || b.Craft.Name === n)) || null;
  function syncFarmGear(list, allow) {
    if (!P2() || !Array.isArray(P2().Appearance) || typeof window.ServerAppearanceBundle !== "function") return { on: [], off: [] };
    const want = (Array.isArray(list) ? list : []).filter((g) => g && GEAR_SLOTS[g.slot] && (g.always || allow) && (!g.until || g.until > Date.now()));
    const cur = bundle(), stuck = lockedGroups2(), did = { on: [], off: [] }, mem = gearMem(), setLater = [];
    let next = cur.slice();
    for (const b of cur) {
      const n = gearNameOf(b, mem);
      if (!n || want.some((g) => g.name === n) || stuck.has(b.Group)) continue;
      next = next.filter((x) => x !== b);
      did.off.push(n);
      if (mem[n] && mem[n].was && !next.some((x) => x.Group === b.Group)) next.push(mem[n].was);
      delete mem[n];
    }
    for (const n of Object.keys(mem)) if (!want.some((g) => g.name === n) && !next.some((b) => gearNameOf(b, mem) === n)) delete mem[n];
    for (const g of want) {
      if (next.some((b) => gearNameOf(b, mem) === g.name)) continue;
      const slot = GEAR_SLOTS[g.slot];
      if (slot.needs && !next.some((b) => b.Group === slot.needs)) continue;
      let group = slot.groups.find((x) => !next.some((b) => b.Group === x) && groupOf2(x)), was = null, item = null;
      for (const n of Array.isArray(g.items) ? g.items.map(String) : []) {
        if (!/^[A-Za-z0-9_-]{2,40}$/.test(n)) continue;
        const home = itemHome(n, slot, (x) => next.some((b) => b.Group === x) || stuck.has(x) || !groupOf2(x));
        if (home) {
          group = home;
          item = n;
          break;
        }
      }
      if (!group && slot.takeover) {
        group = slot.groups.find((x) => groupOf2(x) && !stuck.has(x) && next.some((b) => b.Group === x && !gearNameOf(b, mem)));
        if (group) {
          was = next.find((b) => b.Group === group);
          next = next.filter((b) => b !== was);
        }
      }
      if (!group) continue;
      if (!item) item = gearAsset(group, slot, g.items);
      if (!item) {
        if (was) next.push(was);
        continue;
      }
      const color = (typeof g.color === "string" && /^#[0-9a-fA-F]{6}$/.test(g.color) ? g.color : null) || slot.color || "Default";
      const it = {
        Group: group,
        Name: item,
        Difficulty: 20,
        Property: {},
        Craft: {
          Item: item,
          Name: String(g.name).slice(0, 30),
          Description: (FARM_TAG + " " + String(g.desc || "").slice(0, 180)).trim(),
          Property: "Normal",
          Color: Array.isArray(color) ? color.join(",") : color,
          Lock: "",
          Private: true,
          MemberNumber: P2().MemberNumber,
          MemberName: P2().Name,
          ItemProperty: {},
          Type: null,
          TypeRecord: null
        }
      };
      if (color !== "Default") it.Color = color;
      next.push(it);
      did.on.push(g.name);
      mem[g.name] = was ? { group, item, was: JSON.parse(JSON.stringify(was)) } : { group, item };
      learnName(String(g.name).slice(0, 30));
      const opt = typeof g.opt === "string" && g.opt || GEAR_OPT[group + ":" + item];
      if (opt) setLater.push([group, item, opt]);
    }
    gearMemSave(mem);
    if (did.on.length || did.off.length) commit2(next);
    for (const [gr, nm, op] of setLater) setGearOpt(gr, nm, op);
    return did;
  }
  var SHAPES = { BodyUpper: ["FlatSmall", "FlatMedium", "Small", "Normal", "Large", "XLarge"], BodyLower: ["Small", "Normal", "Large", "XLarge"] };
  var SHAPE_KEY = "fhc-shape";
  function syncShape(shape, allow) {
    if (!P2() || !Array.isArray(P2().Appearance) || typeof window.ServerAppearanceBundle !== "function") return [];
    let mem;
    try {
      mem = JSON.parse(window.localStorage.getItem(SHAPE_KEY)) || {};
    } catch (e) {
      mem = {};
    }
    const next = bundle().map((b) => Object.assign({}, b)), did = [];
    for (const [group, steps] of [["BodyUpper", shape && allow ? Number(shape.up) || 0 : 0], ["BodyLower", shape && allow ? Number(shape.low) || 0 : 0]]) {
      const order = SHAPES[group], b = next.find((x) => x.Group === group);
      if (!b) continue;
      const m = mem[group];
      const own = m && m.set === b.Name && order.includes(m.own) ? m.own : b.Name;
      const at = order.indexOf(own);
      if (at < 0) continue;
      const want = order[Math.max(0, Math.min(order.length - 1, at + Math.round(steps)))];
      if (typeof window.AssetGet === "function" && !window.AssetGet(P2().AssetFamily, group, want)) continue;
      if (want !== b.Name) {
        b.Name = want;
        did.push(group + " " + want);
      }
      if (want === own) delete mem[group];
      else mem[group] = { own, set: want };
    }
    try {
      window.localStorage.setItem(SHAPE_KEY, JSON.stringify(mem));
    } catch (e) {
    }
    if (did.length) commit2(next);
    return did;
  }
  var TRIAL_CLEAN = ["BodyUpper", "BodyLower", "Bra", "ItemNipples", "ItemBreast", "ItemTorso"];
  function scaleTrialCleanup() {
    try {
      const C = P2();
      if (!C || !Array.isArray(C.Appearance)) return false;
      let n = 0;
      for (const it of C.Appearance) {
        if (!it || !it.Asset || !it.Asset.Group || !TRIAL_CLEAN.includes(it.Asset.Group.Name) || !it.Property) continue;
        if (it.Property.ScaleX === 1.15) {
          delete it.Property.ScaleX;
          n++;
        }
        if (it.Property.ScaleY === 1.15) {
          delete it.Property.ScaleY;
          n++;
        }
        if (it.Property.TranslationY === -12) {
          delete it.Property.TranslationY;
          n++;
        }
      }
      if (!n) return false;
      if (typeof window.CharacterRefresh === "function") window.CharacterRefresh(C);
      if (typeof window.ChatRoomCharacterUpdate === "function" && window.CurrentScreen === "ChatRoom") window.ChatRoomCharacterUpdate(C);
      return true;
    } catch (e) {
      return false;
    }
  }
  function washMarks() {
    const mem = load3(), stuck = lockedGroups2();
    const next = bundle().filter((b) => stuck.has(b.Group) || !(b.Name === "Splatters" && SPLAT_GROUPS.includes(b.Group) || b.Name === "BodyWritings" && b.Group === mem.writeGroup || mem.treatise && b.Group === TREATISE.group));
    save4({});
    commit2(next);
    return { ok: true, did: ["wash"] };
  }
  function stripMe(prefs) {
    if (!prefs.strip) return { ok: false, why: "off" };
    const cur = bundle(), stuck = lockedGroups2();
    if (!window.localStorage.getItem(STRIP_KEY)) {
      try {
        window.localStorage.setItem(STRIP_KEY, JSON.stringify({ at: Date.now(), bundle: cur }));
      } catch (e) {
      }
    }
    const mem = load3();
    const next = cur.filter((b) => {
      const g = groupOf2(b.Group);
      return !(g && g.Clothing) || stuck.has(b.Group) || b.Name === "BodyWritings" || b.Name === "Splatters" || b.Group === TREATISE.group;
    });
    if (next.length === cur.length) return { ok: false, why: "nothin' to take off" };
    commit2(next);
    return { ok: true, did: ["strip"] };
  }
  function dressMe() {
    let bk = null;
    try {
      bk = JSON.parse(window.localStorage.getItem(STRIP_KEY));
    } catch (e) {
    }
    if (!bk || !Array.isArray(bk.bundle)) return { ok: false, why: "no clothes kept" };
    const next = bundle(), have = new Set(next.map((b) => b.Group));
    for (const b of bk.bundle) {
      const g = groupOf2(b.Group);
      if (g && g.Clothing && !have.has(b.Group)) next.push(b);
    }
    commit2(next);
    try {
      window.localStorage.removeItem(STRIP_KEY);
    } catch (e) {
    }
    return { ok: true, did: ["dress"] };
  }

  // extension/src/chatlog.js
  var W8 = window;
  var KEY5 = "farmhand-chatlog";
  var MAX3 = 1500;
  var CHUNK = 6e3;
  var rows = [];
  var sdk5 = null;
  var on = () => false;
  var botMn = 0;
  var botHere = () => false;
  var saveT = null;
  var recent = /* @__PURE__ */ new Map();
  try {
    const v = JSON.parse(W8.localStorage.getItem(KEY5));
    if (Array.isArray(v)) rows = v.slice(-MAX3);
  } catch (e) {
    rows = [];
  }
  function saveSoon() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try {
        W8.localStorage.setItem(KEY5, JSON.stringify(rows));
      } catch (e) {
        rows = rows.slice(-300);
      }
    }, 2e3);
  }
  var squash = (t) => String(t).toLowerCase().replace(/\s+/g, " ").replace(/[^\p{L}\p{N} ]/gu, "").trim().slice(0, 240);
  function logRow(k, f, x) {
    try {
      if (!on()) return;
      x = String(x == null ? "" : x).replace(/\s+/g, " ").trim();
      if (!x) return;
      const n = squash(x), now = Date.now();
      if (n) {
        const t0 = recent.get(n);
        if (t0 && now - t0 < 9e4) return;
        recent.set(n, now);
        if (recent.size > 800) {
          for (const [kk, tt] of recent) if (now - tt > 9e4) recent.delete(kk);
        }
      }
      rows.push({ t: now, k: String(k).slice(0, 12), f: Number(f) || 0, x: x.slice(0, 600) });
      if (rows.length > MAX3) rows = rows.slice(-MAX3);
      saveSoon();
    } catch (e) {
    }
  }
  function flush() {
    if (!on() || !rows.length || !botHere() || typeof W8.ServerSend !== "function") return;
    let sent = 0;
    for (let part = 0; part < 4 && rows.length; part++) {
      const batch = [];
      let size = 0;
      while (rows.length && batch.length < 120) {
        const r = rows[0], s = JSON.stringify(r).length;
        if (size + s > CHUNK && batch.length) break;
        batch.push(rows.shift());
        size += s;
      }
      try {
        W8.ServerSend("ChatRoomChat", makeMsg("chatlog", { rows: batch }, botMn));
        sent += batch.length;
      } catch (e) {
        rows = batch.concat(rows);
        break;
      }
    }
    if (sent) saveSoon();
  }
  function initChatlog(mod2, opts) {
    sdk5 = mod2;
    on = opts.on;
    botMn = opts.botMn;
    botHere = opts.botHere;
    try {
      sdk5.hookFunction("ChatRoomAppendChat", 0, (args, next) => {
        try {
          const div = args[0];
          if (div && div.classList && on()) {
            const cls = Array.from(div.classList).find((c) => /^ChatMessage[A-Z]/.test(c) && c !== "ChatMessageName") || "ChatMessageChat";
            logRow(cls.replace(/^ChatMessage/, "").toLowerCase().replace("localmessage", "local").replace("servermessage", "server"), div.dataset && div.dataset.sender, div.textContent);
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] record: chat log unavailable:", e);
    }
    try {
      sdk5.hookFunction("ServerAccountBeep", 0, (args, next) => {
        try {
          const d = args[0];
          if (d && on() && !d.BeepType) {
            const msg = typeof d.Message === "string" ? d.Message : "";
            if (!/^\s*[{[]/.test(msg)) logRow("beep", d.MemberNumber, (d.MemberName || "") + (msg ? ": " + msg : " beeped you"));
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] record: beeps unavailable:", e);
    }
    try {
      sdk5.hookFunction("ServerSend", 0, (args, next) => {
        try {
          const [ev, d] = args;
          if (on() && d) {
            if (ev === "AccountBeep" && !d.BeepType && typeof d.Message === "string" && d.Message && !/^\s*[{[]/.test(d.Message)) logRow("beep-out", d.MemberNumber, d.Message);
            else if (ev === "ChatRoomChat" && d.Type === "Hidden" && d.Content === FARM_MSG && d.Dictionary && d.Dictionary.type === "cmd") logRow("cmd", botMn, "?" + String(d.Dictionary.text || ""));
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] record: sending unavailable:", e);
    }
    setInterval(flush, 6e4);
    setTimeout(flush, 15e3);
  }

  // extension/src/cues.js
  var W9 = window;
  var ctx2 = null;
  function initCues(c) {
    ctx2 = c;
    setInterval(sightTick, 4e3);
    setInterval(feelTick, 6e4);
  }
  var pref = (k) => !ctx2.panel.prefs[k];
  var cueOff = () => ({
    face: !pref("noFace") || void 0,
    sound: !pref("noSound") || void 0,
    trance: !pref("noTrance") || void 0,
    lead: !pref("noLead") || void 0,
    slow: !pref("noSlow") || void 0,
    stir: ctx2.panel.prefs.stir ? void 0 : true,
    gear: ctx2.panel.prefs.gear ? void 0 : true
  });
  var mapOn = () => typeof W9.ChatRoomMapViewIsActive === "function" && W9.ChatRoomMapViewIsActive() && W9.Player && W9.Player.MapData && W9.Player.MapData.Pos;
  var others3 = () => (W9.ChatRoomCharacter || []).filter((c) => c && c.MemberNumber !== (W9.Player && W9.Player.MemberNumber));
  var lastSight = "";
  function sightTick() {
    try {
      if (W9.CurrentScreen !== "ChatRoom" || !mapOn() || typeof W9.ChatRoomMapViewCharacterIsVisible !== "function") return;
      const see = others3().filter((c) => W9.ChatRoomMapViewCharacterIsVisible(c)).map((c) => c.MemberNumber).sort();
      const hear = others3().filter((c) => typeof W9.ChatRoomMapViewCharacterIsHearable === "function" && W9.ChatRoomMapViewCharacterIsHearable(c)).map((c) => c.MemberNumber).sort();
      const LS = W9.Player && W9.Player.LSCG, S3 = LS && LS.SplatterModule;
      const splat = S3 ? !!(S3.enabled && S3.taker !== false && (!LS.GlobalModule || LS.GlobalModule.enabled !== false)) : void 0;
      const key = see.join(",") + "|" + hear.join(",") + "|" + splat;
      if (key === lastSight && Date.now() - (sightTick.at || 0) < 12e4) return;
      lastSight = key;
      sightTick.at = Date.now();
      ctx2.toBot("sight", splat === void 0 ? { see, hear } : { see, hear, splat });
    } catch (e) {
      console.warn("[Farmhand Companion] sight:", e);
    }
  }
  var walk = null;
  var DIRS = [["North", 0, -1], ["South", 0, 1], ["West", -1, 0], ["East", 1, 0]];
  function canStep(x, y) {
    try {
      return W9.ChatRoomMapViewCanEnterTile(x, y) > 0;
    } catch (e) {
      return false;
    }
  }
  function findPath(from, to) {
    const wide = W9.ChatRoomMapViewWidth || 40, high = W9.ChatRoomMapViewHeight || 40, key = (x, y) => x + "," + y;
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
      ctx2.toBot("leadNo", { id: m.id });
    };
    if (!pref("noLead") || !mapOn() || typeof W9.ChatRoomMapViewMove !== "function") return no();
    const from = W9.Player.MapData.Pos, to = { X: m.X, Y: m.Y };
    const path = findPath(from, to);
    if (!path) return no();
    if (!path.length) {
      ctx2.toBot("leadOk", { id: m.id });
      return;
    }
    ctx2.local("You're led " + (m.why ? m.why : "along") + "\u2026", "#c9a35b", true);
    walk = { id: m.id, to, path, i: 0, last: { X: from.X, Y: from.Y }, stuck: Date.now(), retried: false };
    stepWalk();
  }
  function stepWalk() {
    if (!walk) return;
    const w = walk, p = W9.Player && W9.Player.MapData && W9.Player.MapData.Pos;
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
      ctx2.toBot("leadOk", { id: w.id });
      return;
    }
    if (Date.now() - w.stuck > 3e3) {
      if (w.retried) {
        walk = null;
        ctx2.toBot("leadNo", { id: w.id });
        return;
      }
      const path = findPath(p, w.to);
      if (!path) {
        walk = null;
        ctx2.toBot("leadNo", { id: w.id });
        return;
      }
      Object.assign(w, { path, i: 0, stuck: Date.now(), retried: true });
    }
    if (W9.ChatRoomMapViewMovement == null) {
      try {
        W9.ChatRoomMapViewMove(w.path[w.i]);
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
    if (!f || !pref("noFace") || typeof W9.CharacterSetFacialExpression !== "function" || !W9.Player) return;
    const secs = m.mood === "clear" ? null : Math.max(5, Math.min(1800, Number(m.secs) || 30));
    for (const [g, e] of Object.entries(f)) {
      try {
        W9.CharacterSetFacialExpression(W9.Player, g, e, secs);
        if (g === "Eyes") W9.CharacterSetFacialExpression(W9.Player, "Eyes2", e, secs);
      } catch (e2) {
      }
    }
  }
  var SOUNDS = {
    pump: "SciFiPump",
    machine: "Sybian",
    bell: "BellMedium",
    cowbell: "BellSmall",
    stall: "HydraulicLock",
    gate: "CageOpen",
    latch: "HydraulicLock",
    unlatch: "HydraulicUnlock",
    clip: "MetalClip",
    hiss: "Deflation",
    rope: "RopeShort1",
    ropelong: "RopeLong1",
    rip: "ClothSlip",
    clamp: "MetalShut",
    inflate: "Inflation",
    chainlong: "ChainLong",
    softgate: "SofterCageClose",
    latex: "BalloonStretch",
    rubber: "BalloonRubbing",
    wood: "WoodenCuffs",
    straw: "SoftFurniture",
    biglock: "LockLarge",
    unlock: "UnlockSmall",
    buzz: "VibrationTone4ShortLoop",
    zap: "Shocks",
    creak: "LeatherCreak",
    paddle: "BrushSpank1",
    crop: "SmackCrop1",
    scifi: "SciFiEffect",
    beeps: "SciFiBeeps1",
    squeak: "SqueakToy",
    cuffs: "CuffsMetal",
    // (the stall latchin' on used to be a cage door slammin': jarring, said Laynie, Oct 12)
    bowl: "PlaceBowl",
    wet: "Slime",
    chain: "ChainShort",
    lock: "LockSmall",
    vibe: "VibratorShort",
    spank: "SpankSkin1"
  };
  var QUIET = { stall: 0.35, latch: 0.35, unlatch: 0.35, pump: 0.4, machine: 0.4, inflate: 0.4, hiss: 0.4, buzz: 0.3, zap: 0.35, clamp: 0.45, softgate: 0.4 };
  function sound(m) {
    const f = SOUNDS[m.name];
    if (!f || !pref("noSound") || typeof W9.AudioPlayInstantSound !== "function") return;
    const vol = W9.Player && W9.Player.AudioSettings && W9.Player.AudioSettings.Volume || 0;
    try {
      W9.AudioPlayInstantSound("Audio/" + f + ".mp3", vol * (QUIET[m.name] || 0.6));
    } catch (e) {
    }
  }
  function trance(m) {
    let el = W9.document.getElementById("fhc-trance");
    const lvl = pref("noTrance") ? Math.max(0, Math.min(3, Number(m.level) || 0)) : 0;
    if (!lvl) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = W9.document.createElement("div");
      el.id = "fhc-trance";
      el.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998;transition:opacity 4s;opacity:0;animation:fhcTrance 6s ease-in-out infinite";
      if (!W9.document.getElementById("fhc-trance-css")) {
        const s = W9.document.createElement("style");
        s.id = "fhc-trance-css";
        s.textContent = "@keyframes fhcTrance{0%,100%{filter:brightness(1)}50%{filter:brightness(0.85)}}";
        W9.document.head.appendChild(s);
      }
      W9.document.body.appendChild(el);
    }
    const edge = [0, 0.25, 0.45, 0.65][lvl], inner = [0, 55, 42, 30][lvl];
    el.style.background = "radial-gradient(ellipse at center, transparent " + inner + "%, rgba(70,20,90," + edge + ") 100%)";
    (W9.requestAnimationFrame || ((f) => setTimeout(f, 16)))(() => {
      el.style.opacity = "1";
    });
  }
  var FEEL = {
    plug: [
      "The plug shifts inside you every time you move, a full, stubborn pressure you can't ignore.",
      "You sit down carefully. The plug reminds you exactly where it is.",
      "Every step nudges the plug a little deeper, and your breath catches each time.",
      "The plug sits snug and heavy, stretching you just enough that you never forget it.",
      "You clench around the plug without meaning to, and feel your face go warm."
    ],
    chaste: [
      "Your chastity aches. You're throbbing against it and it doesn't give an inch.",
      "You strain against the cage and it holds you exactly where it wants you.",
      "A hot pulse of want hits the steel and goes nowhere. It never goes anywhere.",
      "You shift your hips, hoping for friction. The chastity makes sure there isn't any."
    ],
    udders: [
      "Your udders are tight and heavy, prickling with milk. Any squeeze at all would make them leak.",
      "Your breasts ache with milk, swollen and warm. You're overdue for the stall.",
      "A bead of milk slips free and runs down. You're so full it's starting to leak on its own.",
      "Every movement makes your heavy breasts sway, and every sway reminds you how full they are.",
      "Your nipples tingle and stiffen, begging for the cups."
    ],
    sloshing: [
      "Everything they put in you sloshes when you shift your weight. You can feel how full you are.",
      "You're warm and heavy inside, full of what the farm gave you.",
      "A little trickles out when you move, and you squeeze your thighs together to keep the rest.",
      "Your belly feels round and full. You put a hand on it without thinking.",
      "You can still feel every load inside you, sitting warm and heavy."
    ],
    heat: [
      "Heat rolls through you in slow waves. Every brush of fabric is almost too much.",
      "You're in heat, and the whole farm smells like an invitation.",
      "Your skin is flushed and sensitive, and you can't stop thinking about being bred.",
      "You catch yourself rubbing against things. The heat isn't letting up.",
      "A slow, aching need settles low in your belly and stays there."
    ],
    preg: [
      "Something shifts low in your belly, slow and heavy. The litter is settling in.",
      "A tiny kick, then another. Somebody in there is awake.",
      "Your belly feels heavier today. You rest a hand on the curve of it.",
      "A flutter low inside you, soft as a moth, then gone.",
      "You catch yourself craving something salty, and something sweet, and then both at once.",
      "Your back aches pleasantly under the weight you're carrying.",
      "The little ones roll over inside you, and your whole belly shifts with them.",
      "You feel round and full and very, very bred.",
      "A firm little push against your palm, right where your hand was resting."
    ],
    drool: [
      "Drool gathers around the gag and slips down your chin. You can't stop it.",
      "Your jaw aches around the gag, and a string of drool finally gives way.",
      "You try to swallow around the gag. It doesn't help. Your chin is wet again.",
      "The gag fills your mouth, and every breath reminds you you can't say a word."
    ],
    edge: [
      "You're right on the edge and everyone around you can probably tell.",
      "One more touch, anywhere at all, and you'd tip right over.",
      "Your breath is coming fast and shallow. You're so close it hurts.",
      "You squirm in place, aching, hovering right at the brink.",
      "Every little sensation is too much. You're balanced on a knife's edge."
    ],
    milked: [
      "Your breasts feel light and tender after the milking, nipples still a little puffy.",
      "There's a pleasant, empty ache in your chest where all that milk used to be.",
      "Your nipples are still sensitive from the cups. Even your clothes feel like too much."
    ]
  };
  var recentFeel = [];
  function feelTick() {
    try {
      if (!pref("noFeelings") || W9.CurrentScreen !== "ChatRoom" || !W9.Player || !ctx2.panel.s || !ctx2.panel.s.onBooks) return;
      if (Date.now() < (feelTick.next || 0)) return;
      feelTick.next = Date.now() + (7 + Math.random() * 6) * 6e4;
      const s = ctx2.panel.s, items = (W9.Player.Appearance || []).filter((x) => x && x.Asset && x.Asset.Group);
      const grp = (g) => items.find((x) => x.Asset.Group.Name === g);
      const eff2 = (x) => [].concat(x.Property && x.Property.Effect || [], x.Asset.Effect || []);
      const arousal = W9.Player.ArousalSettings && W9.Player.ArousalSettings.Progress || 0;
      const kinds = [];
      if (grp("ItemButt")) kinds.push("plug");
      if (items.some((x) => eff2(x).includes("Chaste")) && arousal > 40) kinds.push("chaste");
      if (s.milk && s.milk.cap && s.milk.ml / s.milk.cap > 0.8) kinds.push("udders");
      if (s.milk && s.milk.cap && s.milk.lastAt && Date.now() - s.milk.lastAt < 30 * 6e4 && s.milk.ml / s.milk.cap < 0.35) kinds.push("milked");
      if (s.holding && s.holding.cap && s.holding.ml / s.holding.cap > 0.6) kinds.push("sloshing");
      if (s.heatUntil && s.heatUntil > Date.now()) kinds.push("heat");
      if (s.preg) kinds.push("preg");
      if (grp("ItemMouth") && items.some((x) => ["ItemMouth", "ItemMouth2", "ItemMouth3"].includes(x.Asset.Group.Name) && eff2(x).includes("BlockMouth"))) kinds.push("drool");
      if (arousal > 85) kinds.push("edge");
      const pool = [].concat(...kinds.map((k) => FEEL[k])).filter((l) => !recentFeel.includes(l));
      if (!pool.length) return;
      const line3 = pool[Math.floor(Math.random() * pool.length)];
      recentFeel.push(line3);
      while (recentFeel.length > 8) recentFeel.shift();
      ctx2.local(line3, "#b58ad9", true);
    } catch (e) {
      console.warn("[Farmhand Companion] feelings:", e);
    }
  }
  function drawMarkers() {
    try {
      const s = ctx2.panel.s;
      if (!s || !s.staff || !Array.isArray(s.herd) || !pref("noMarkers") || !mapOn() || typeof W9.DrawText !== "function") return;
      const R = W9.ChatRoomMapViewPerceptionRange || 6, tile = 1e3 / (R * 2 + 1), me4 = W9.Player.MapData.Pos;
      for (const x of s.herd) {
        const C = (W9.ChatRoomCharacter || []).find((c) => c.MemberNumber === x.mn);
        if (!C || !C.MapData || !C.MapData.Pos || !W9.ChatRoomMapViewCharacterIsVisible(C)) continue;
        const tags = [];
        if (x.milk !== null && x.milk >= 75) tags.push(["M", "#7fa8c9"]);
        if (x.heat) tags.push(["H", "#d9534f"]);
        if (x.preg) tags.push(["B", "#8fbf6a"]);
        if (x.denied) tags.push(["X", "#c9a35b"]);
        if (!tags.length) continue;
        const sx = (C.MapData.Pos.X - me4.X + R) * tile, sy = (C.MapData.Pos.Y - me4.Y) * tile + R * tile;
        if (sx < 0 || sy < 0 || sx > 1e3 || sy > 1e3) continue;
        tags.forEach(([t, col], i) => W9.DrawText(t, sx + tile * 0.2 + i * tile * 0.22, sy + tile * 0.15, col, "black"));
      }
    } catch (e) {
    }
  }
  var stirOn = () => !!ctx2.panel.prefs.stir;
  var deniedNow = () => {
    const s = ctx2.panel.s;
    return !!(s && s.deniedUntil && s.deniedUntil > Date.now());
  };
  function slowFactor() {
    const s = ctx2 && ctx2.panel && ctx2.panel.s;
    if (!s || !pref("noSlow") || !(s.slow > 1)) return 1;
    return Math.max(1, Math.min(3, Number(s.slow) || 1));
  }
  function arouse(m) {
    try {
      if (!stirOn() || !W9.Player || !W9.Player.ArousalSettings || typeof W9.ActivitySetArousal !== "function") return;
      if (W9.Player.ArousalSettings.Active === "Inactive" || W9.Player.ArousalSettings.Active === "NoMeter") return;
      const cur = Number(W9.Player.ArousalSettings.Progress) || 0, cap = Math.max(0, Math.min(deniedNow() ? 94 : 100, Number(m.cap) || 100));
      const next = Math.max(0, Math.min(cap, cur + (Number(m.add) || 0)));
      if (next > cur || m.add < 0) W9.ActivitySetArousal(W9.Player, next);
    } catch (e) {
      console.warn("[Farmhand Companion] arouse:", e);
    }
  }
  var VIBE_MODE = ["Low", "Medium", "High", "Maximum"];
  var vibeWas = null;
  var vibeTimer = null;
  var vibeToys = () => (W9.Player && Array.isArray(W9.Player.Appearance) ? W9.Player.Appearance : []).filter((it) => it && it.Asset && it.Asset.Group && it.Property && typeof it.Property.Intensity === "number" && !(it.Property.LockedBy && typeof W9.DialogCanUnlock === "function" && !W9.DialogCanUnlock(W9.Player, it)));
  function vibePush(toys) {
    if (typeof W9.CharacterRefresh === "function") W9.CharacterRefresh(W9.Player, false);
    if (typeof W9.ChatRoomCharacterItemUpdate === "function") toys.forEach((it) => W9.ChatRoomCharacterItemUpdate(W9.Player, it.Asset.Group.Name));
    else if (typeof W9.ChatRoomCharacterUpdate === "function") W9.ChatRoomCharacterUpdate(W9.Player);
  }
  function vibeSet(it, level, mode) {
    it.Property.Intensity = level;
    it.Property.Mode = mode || (level < 0 ? "Off" : VIBE_MODE[level]);
    const eff2 = new Set(Array.isArray(it.Property.Effect) ? it.Property.Effect : []);
    if (level < 0) eff2.delete("Vibrating");
    else eff2.add("Vibrating");
    it.Property.Effect = Array.from(eff2);
  }
  function vibeRestore() {
    clearTimeout(vibeTimer);
    vibeTimer = null;
    const was = vibeWas;
    vibeWas = null;
    if (!was) return;
    try {
      const toys = vibeToys().filter((it) => was[it.Asset.Group.Name + "/" + it.Asset.Name]);
      toys.forEach((it) => {
        const w = was[it.Asset.Group.Name + "/" + it.Asset.Name];
        vibeSet(it, w.level, w.mode);
      });
      if (toys.length) vibePush(toys);
    } catch (e) {
      console.warn("[Farmhand Companion] toys back:", e);
    }
  }
  function vibe(m) {
    try {
      if (m.level == null) return vibeRestore();
      if (!stirOn()) return;
      const toys = vibeToys();
      if (!toys.length) return;
      if (!vibeWas) {
        vibeWas = {};
        toys.forEach((it) => {
          vibeWas[it.Asset.Group.Name + "/" + it.Asset.Name] = { level: it.Property.Intensity, mode: it.Property.Mode };
        });
      }
      const level = Math.max(-1, Math.min(3, Math.round(Number(m.level)) || 0));
      const change = toys.filter((it) => it.Property.Intensity !== level);
      change.forEach((it) => vibeSet(it, level));
      if (change.length) vibePush(change);
      clearTimeout(vibeTimer);
      const hold = Number(m.until) - Date.now();
      vibeTimer = setTimeout(vibeRestore, hold > 0 ? Math.min(hold, 36e5) : 12e4);
    } catch (e) {
      console.warn("[Farmhand Companion] toys:", e);
    }
  }
  function initBody(mod2) {
    try {
      mod2.hookFunction("ChatRoomMapViewCanEnterTile", 0, (args, next) => {
        const t = next(args);
        try {
          const f = slowFactor();
          return t > 0 && f > 1 && !(typeof W9.ChatRoomMapViewHasSuperPowers === "function" && W9.ChatRoomMapViewHasSuperPowers()) ? t * f : t;
        } catch (e) {
          return t;
        }
      });
    } catch (e) {
      console.warn("[Farmhand Companion] slowed walkin' unavailable:", e);
    }
    try {
      mod2.hookFunction("ActivityOrgasmPrepare", 0, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && stirOn() && deniedNow()) {
            C.ArousalSettings.Progress = 94;
            if (Date.now() - (initBody.told || 0) > 6e4) {
              initBody.told = Date.now();
              ctx2.local("Right at the edge, and the farm won't let you over it. Not yet, sugar.", "#c9a35b", true);
            }
            return;
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] denial unavailable:", e);
    }
  }

  // extension/src/index.js
  var bcModSdk = import_bondage_club_mod_sdk.default.default || import_bondage_club_mod_sdk.default;
  function twoCopies(running) {
    const note2 = "\u{1F33E} Two copies of the Farmhand Companion are installed" + (running ? " (v" + running + " is running, v" + VERSION + " stepped aside)" : "") + ". Open Tampermonkey's dashboard and delete the older one, then reload.";
    console.warn("[Farmhand Companion] " + note2);
    const t = setInterval(() => {
      if (window.CurrentScreen !== "ChatRoom" || typeof window.ChatRoomSendLocal !== "function") return;
      clearInterval(t);
      try {
        const p = window.document.createElement("div");
        p.style.cssText = "color:#c9a35b;white-space:pre-wrap";
        p.textContent = note2;
        window.ChatRoomSendLocal(p.outerHTML);
      } catch (e) {
      }
    }, 3e3);
    throw new Error("Farmhand Companion: another copy is already running");
  }
  if (window.__farmhandCompanion) twoCopies(window.__farmhandCompanion);
  var mod;
  try {
    mod = bcModSdk.registerMod({ name: "FarmhandCompanion", fullName: "B&B Farm Farmhand Companion", version: VERSION });
  } catch (e) {
    if (/already|registered|loaded/i.test(String(e && e.message))) twoCopies(null);
    throw e;
  }
  window.__farmhandCompanion = VERSION;
  var st = { panel: null, welcomed: false, lastHello: 0, parts: /* @__PURE__ */ new Map() };
  var NOISES = {
    cow: ["moo", "mooo", "mrrrm"],
    bull: ["moo", "hrrmph"],
    pony: ["neigh", "nicker", "whinny"],
    horse: ["neigh", "whinny", "nicker"],
    pup: ["arf", "woof", "awoo"],
    dog: ["woof", "arf", "ruff"],
    kitty: ["mew", "nya", "mrrp"],
    cat: ["meow", "mrrp", "purr"],
    bunny: ["squeak", "eep"],
    rabbit: ["squeak", "eep"],
    pig: ["oink", "snrk"],
    goat: ["baa", "maa"],
    sheep: ["baa", "baaa"],
    fox: ["yip", "ack"],
    wolf: ["awoo", "grr"],
    deer: ["bleat", "mweh"],
    goblin: ["heh", "nngh"]
  };
  function mooify(text, species) {
    const say = NOISES[String(species || "").toLowerCase()] || NOISES.cow;
    return String(text).replace(/[A-Za-z']{3,}/g, (w) => {
      if (Math.random() < 0.5) return w;
      const n = say[Math.floor(Math.random() * say.length)];
      return w[0] === w[0].toUpperCase() ? n[0].toUpperCase() + n.slice(1) : n;
    });
  }
  function dumbDown(text, depth) {
    const max = depth >= 4 ? 4 : depth === 3 ? 6 : 8, fillers = ["mm", "uh", "...", "nn"];
    let out = String(text).replace(/[A-Za-z']+/g, (w) => {
      if (w.length <= max) return w;
      if (depth >= 4) return Math.random() < 0.5 ? fillers[Math.floor(Math.random() * fillers.length)] : w.slice(0, 3) + "...";
      return Math.random() < (depth === 3 ? 0.7 : 0.4) ? w.slice(0, Math.max(3, max - 2)) + "..." : w;
    });
    if (depth >= 3) out = out.toLowerCase();
    return out;
  }
  var botHere2 = () => window.CurrentScreen === "ChatRoom" && Array.isArray(window.ChatRoomCharacter) && window.ChatRoomCharacter.some((c) => c.MemberNumber === BOT_MEMBER);
  var onBotAccount = () => !!(window.Player && window.Player.MemberNumber === BOT_MEMBER);
  var direct = () => onBotAccount() && window.Farmhand && typeof window.Farmhand.own === "function";
  function toBot(type, data) {
    if (direct() && window.Farmhand.own(Object.assign({}, data, { type }))) return;
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
    const P3 = window.Player || {}, names = [P3.Nickname, P3.Name].filter(Boolean).map((n) => String(n).toLowerCase());
    const now = Date.now();
    st.relayed = (st.relayed || []).filter((t) => now - t < 6e4);
    const blocked = typeof window.ChatRoomOwnerPresenceRule === "function" && (() => {
      try {
        return window.ChatRoomOwnerPresenceRule("BlockEmote", null);
      } catch (e) {
        return false;
      }
    })();
    const ok2 = text && names.some((n) => text.toLowerCase().includes(n)) && !st.panel.prefs.noRelay && !blocked && st.relayed.length < 8;
    if (!ok2) {
      toBot("relayNo", { id: m.id });
      return;
    }
    st.relayed.push(now);
    window.ServerSend("ChatRoomChat", { Type: "Emote", Content: "*" + text });
  }
  function sendCommand(text, typed) {
    text = String(text || "").trim();
    if (!text) return;
    if (botHere2()) {
      if (!st.welcomed) hello();
      toBot("cmd", typed ? { text } : { text, btn: true });
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
  function parasiteSync() {
    try {
      const s = st.panel && st.panel.s;
      if (!st.gotState || !s || window.CurrentScreen !== "ChatRoom") return;
      let list = Array.isArray(s.farmGear) ? s.farmGear : [];
      if (!Array.isArray(s.farmGear) && s.parasite && s.parasite.until > Date.now())
        list = [{ slot: s.parasite.form === "belt" ? "belt" : "lips", name: s.parasite.form === "belt" ? "Parasite Belt" : "Parasite Lips", always: true, color: "#E0607F", until: s.parasite.until, desc: "It feeds its host serum and drinks every load." }];
      const did = syncFarmGear(list, !!st.panel.prefs.gear);
      try {
        syncShape(st.panel.s && st.panel.s.shape, !!st.panel.prefs.shape);
      } catch (e2) {
        console.warn("[Farmhand Companion] body shape:", e2);
      }
      for (const n of did.on) toChat("The farm puts somethin' on you: " + n + ".", "#c9a35b", true);
      for (const n of did.off) toChat(n + " comes off.", "#c9a35b", true);
    } catch (e) {
      console.warn("[Farmhand Companion] farm gear:", e);
    }
  }
  function onFarmMsg(m) {
    if (m.type === "body" || m.type === "bodyAsk") {
      try {
        onBodyMsg(m);
      } catch (e) {
        console.warn("[Farmhand Companion] drawn body:", e);
      }
      return;
    }
    if (m.type === "mess" || m.type === "messAsk") {
      try {
        onMessMsg(m);
      } catch (e) {
        console.warn("[Farmhand Companion] messes:", e);
      }
      return;
    }
    if (m.from !== BOT_MEMBER) return;
    if (m.type !== "ping" && m.type !== "state") st.lastHeard = Date.now();
    switch (m.type) {
      case "ping":
        hello();
        break;
      case "welcome":
        st.welcomed = true;
        try {
          const at = onBotAccount() ? null : farmLookWanted(m.look);
          if (at != null) toBot("bodyFarmAsk", { at });
        } catch (e) {
        }
        st.panel.setWelcome(m);
        if (!m.proto || m.proto < 2) {
          st.panel.setStatus("connected \xB7 farm girl v" + m.ver + " (needs updatin')");
          st.panel.add("The farm girl is runnin' an older bot (v" + m.ver + ") that doesn't send this panel your roles, keys or numbers, so only the basic panel shows. Update farmhand-bot.user.js on HER browser (the bot's account), then reload her page.", "notice");
        } else {
          st.panel.setStatus("connected \xB7 farm girl v" + m.ver);
          setTimeout(() => {
            if (!st.gotState) st.panel.add("Connected, but the farm girl hasn't sent your roles yet. If Staff or Dashboard don't show up, reload the page.", "notice");
          }, 12e3);
        }
        break;
      case "bodyFarm":
        try {
          if (!onBotAccount()) onFarmLook(m);
        } catch (e) {
          console.warn("[Farmhand Companion] farm look:", e);
        }
        break;
      case "state":
        if (m.state && typeof m.state === "object") {
          st.gotState = true;
          st.panel.setState(m.state);
          parasiteSync();
          try {
            drawnBodyFarmState(m.state.drawn);
          } catch (e) {
            console.warn("[Farmhand Companion] drawn body size:", e);
          }
        }
        break;
      case "reply":
      case "notice": {
        const text = collect(m);
        if (text === null) break;
        logRow("farm", BOT_MEMBER, text);
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
        toChat(String(m.text || "") + "  (Yes / No in your \u{1F33E} panel)", "#c9a35b");
        break;
      case "choose":
        st.panel.setChoose({ text: String(m.text || ""), choices: Array.isArray(m.choices) ? m.choices.map(String).slice(0, 30) : [] });
        toChat(String(m.text || "") + "  (pick in your \u{1F33E} panel)", "#c9a35b");
        break;
      case "outfit":
        if (m.auto) {
          api.wear({ slot: String(m.slot || ""), label: String(m.label || "farm outfit"), data: String(m.data || ""), keys: Array.isArray(m.keys) ? m.keys.filter(Number.isInteger) : [] });
          toChat("\u{1F457} You've been dressed in your " + String(m.label || "farm outfit") + " for your new contract.", "#c9a35b");
          break;
        }
        st.panel.setOutfit({
          slot: String(m.slot || ""),
          label: String(m.label || "farm outfit"),
          data: String(m.data || ""),
          keys: Array.isArray(m.keys) ? m.keys.filter(Number.isInteger) : [],
          why: String(m.why || "")
        });
        toChat("\u{1F457} The farm's offerin' you your " + String(m.label || "outfit") + ". Yes or Not now in your \u{1F33E} panel.", "#c9a35b");
        break;
      case "mark": {
        let r = { ok: false };
        try {
          const prefs = m.asked ? Object.assign({}, st.panel.prefs, { marks: true }) : st.panel.prefs;
          if (m.wash) {
            try {
              messWash();
            } catch (e) {
              console.warn("[Farmhand Companion] wash:", e);
            }
            try {
              r = washMarks();
            } catch (e) {
              console.warn("[Farmhand Companion] wash splatters:", e);
              r = { ok: true, did: ["mess"], why: e.message };
            }
          } else if (m.strip) r = stripMe(prefs);
          else if (m.dress) r = dressMe();
          else {
            let drew = false;
            try {
              if (prefs.marks && Array.isArray(m.splat) && m.splat.length) drew = messFromMark(m);
            } catch (e) {
              console.warn("[Farmhand Companion] mess:", e);
            }
            try {
              r = markBody(m, prefs);
            } catch (e) {
              console.warn("[Farmhand Companion] splatters:", e);
              r = { ok: drew, did: drew ? ["mess"] : [], why: e.message };
            }
            if (drew && !r.ok) r = { ok: true, did: ["mess"], why: r.why || "" };
          }
        } catch (e) {
          r = { ok: false, why: e.message };
        }
        toBot("markDone", { ok: !!r.ok, did: r.did || [], why: r.why || "" });
        break;
      }
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
      case "vibe":
        vibe(m);
        break;
      // a scene turns the dial on a buzzin' toy you're wearin' (cues.js)
      case "arouse":
        arouse(m);
        break;
      // a trap or a toy stirs you up, if you let the farm do that (cues.js)
      case "sound":
        sound(m);
        break;
      case "trance":
        trance(m);
        break;
      case "voice": {
        const line3 = String(m.text || "").slice(0, 300);
        if (!toChat("[Voice] " + line3, "#a67fd4", true)) st.panel.add("[Voice] " + line3, "notice");
        break;
      }
      case "roomline": {
        const line3 = String(m.text || "").slice(0, 1200);
        if (typeof window.ChatRoomSendLocal === "function") {
          const p = window.document.createElement("div");
          p.className = m.kind === "emote" ? "ChatMessage ChatMessageEmote" : "ChatMessage ChatMessageChat";
          p.style.cssText = m.kind === "emote" ? "font-style:italic" : "";
          p.textContent = forChat(m.kind === "emote" ? line3 : "Farm girl: " + line3);
          window.ChatRoomSendLocal(p.outerHTML);
        } else st.panel.add(line3, "notice");
        break;
      }
      case "logRows": {
        const ui = st.panel.ui, cur = ui.logRows && ui.logRows.id === m.id ? ui.logRows : { id: m.id, rows: [], total: 0 };
        cur.rows = cur.rows.concat(Array.isArray(m.rows) ? m.rows : []);
        cur.total = Number(m.total) || cur.rows.length;
        cur.busy = (Number(m.part) || 1) < (Number(m.of) || 1);
        ui.logRows = cur;
        st.panel.render();
        break;
      }
      case "outfitBack": {
        const r = changeBack();
        st.panel.add(r.ok ? "\u{1F457} Back in your own clothes" + (r.stillLocked ? " (farm-locked pieces stay till a keyholder opens 'em)" : "") + "." : "\u{1F457} " + r.why + ".", "notice");
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
      st.panel.add(r.ok ? "\u{1F457} Dressed in " + o.label + ": " + r.worn + " pieces" + (r.locks ? ", " + r.locks + " locked with high security padlocks" : "") + (r.skipped ? ". " + r.skipped + " spots were already locked, so I left 'em be" : "") + "." : "\u{1F457} Couldn't dress you: " + r.why + ".", "notice");
      if (r.ok) toBot("outfitAnswer", { answer: "worn", slot: o.slot, locks: r.locks });
    },
    decline(o) {
      toBot("outfitAnswer", { answer: "declined", slot: o.slot });
    },
    // Say it: their words straight to the farm (or to staff) as a hidden message, so no gag, speech rule or trance
    // rewrites them on the way (Laynie, Oct 23: "speech impaired pets need a guaranteed way to be able to say what they need to say")
    say(text, to) {
      text = String(text || "").trim().slice(0, 300);
      if (!text) return false;
      if (!botHere2()) {
        st.panel.add("\u{1F449} The farm girl isn't in this room, so nobody's there to hear it.", "notice");
        return false;
      }
      if (!st.welcomed) hello();
      toBot("say", { text, to: to === "staff" ? "staff" : "farm" });
      st.panel.add("\u{1F5E3}\uFE0F You said" + (to === "staff" ? ", to staff" : "") + ": " + text, "mine");
      return true;
    },
    back() {
      onFarmMsg({ from: BOT_MEMBER, type: "outfitBack" });
    },
    save(slot) {
      let c;
      try {
        c = captureOutfit();
      } catch (e) {
        st.panel.add("\u{1F457} Couldn't read what you're wearin': " + e.message, "notice");
        return;
      }
      if (!c.items) {
        st.panel.add("\u{1F457} You're not wearin' any clothes or restraints to save, sugar.", "notice");
        return;
      }
      toBot("outfitSave", { slot, data: c.data, items: c.items, locks: c.locks });
    },
    hasBackup,
    rehello: () => hello(),
    // tell the bot a setting changed (the relay switch)
    // the Log tab asks the farm girl for the record (views/log.js)
    logAsk(q2) {
      st.panel.ui.logRows = { id: 0, rows: [], total: 0, busy: true };
      st.panel.render();
      toBot("logAsk", q2);
    },
    // map tool: the next `count` clicks on the game's map pick tiles instead of walkin' you there
    pickTiles(count, what, done) {
      if (typeof window.ChatRoomMapViewIsActive === "function" && !window.ChatRoomMapViewIsActive()) {
        st.panel.add(`\u{1F5FA}\uFE0F Switch the room to map view first, then press the button again. (Walkin' to the spot and using the "where I stand" buttons still works too.)`, "notice");
        return;
      }
      if (typeof window.ChatRoomMapViewPixelToTileCoordinates !== "function") {
        st.panel.add(`\u{1F5FA}\uFE0F This version of the game doesn't let me read map clicks. Use the "where I stand" buttons instead.`, "notice");
        return;
      }
      st.pick = { count, what, done, got: [] };
      st.panel.add("\u{1F5FA}\uFE0F Click " + (count > 1 ? "one corner of " : "the tile for ") + what + " on the map. You won't walk there. (Esc cancels.)", "notice");
      st.panel.toggle(false);
    },
    cancelPick() {
      if (st.pick) {
        st.pick = null;
        st.panel.add("\u{1F5FA}\uFE0F Map pickin' cancelled.", "notice");
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
      st.panel.add("\u{1F5FA}\uFE0F Got " + tile.X + "," + tile.Y + ". Now click the opposite corner.", "notice");
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
    initSettings(st.panel);
    if (st.panel.prefs.off) {
      st.panel.show(false);
      console.log("[Farmhand Companion] v" + VERSION + " is switched off (Preferences \u2192 Extensions \u2192 Farmhand Companion)");
      return;
    }
    st.panel.setStatus("waitin' for the farm girl");
    initCues({ toBot, panel: st.panel, local: toChat });
    setInterval(parasiteSync, 6e4);
    initBelly(mod);
    initDrawnBody(mod);
    initMesses(mod);
    initChatlog(mod, { on: () => !!(st.panel && st.panel.s && st.panel.s.logMust) || !!(st.panel && st.panel.prefs.chatlog), botMn: BOT_MEMBER, botHere: botHere2 });
    initMemlog();
    initLocalSave(VERSION, () => st.panel && st.panel.render && st.panel.render());
    initTrim(mod);
    setTimeout(() => scaleTrialCleanup(), 15e3);
    initBody(mod);
    window.__farmhandOwnPanel = (data) => {
      if (!onBotAccount()) return;
      const m = readMsg(data);
      if (m) {
        try {
          onFarmMsg(m);
        } catch (e) {
          console.warn("[Farmhand Companion]", e);
        }
      }
    };
    setTimeout(() => {
      if (onBotAccount() && !st.gotState) st.panel.add("This is the farm bot's own account. " + (window.Farmhand ? "The bot (v" + window.Farmhand.version + ") hasn't sent this panel your roles yet; update farmhand-bot.user.js to v0.13.1 or newer and reload." : "The bot script isn't running on this page. Install farmhand-bot.user.js here (it runs next to the Companion), then reload."), "notice");
    }, 3e4);
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
      mod.hookFunction("ServerSend", 3, (args, next) => {
        try {
          const d = args[1], s = st.panel && st.panel.s;
          if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && s && !/^\s*[(\[?!./\-*]/.test(d.Content)) {
            let text = d.Content;
            if (s.under >= 2) text = dumbDown(text, s.under);
            if (s.corrWord && Math.random() < 0.17) text = text.replace(/\s+$/, "") + " ..." + String(s.corrWord).slice(0, 20) + ".";
            if (text !== d.Content) args = [args[0], Object.assign({}, d, { Content: text })];
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] gone-under speech unavailable:", e);
    }
    try {
      mod.hookFunction("ServerSend", 4, (args, next) => {
        try {
          const d = args[1], s = st.panel && st.panel.s;
          if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && s && Array.isArray(s.farmGear) && s.farmGear.some((g) => g.slot === "lips" && g.name === "Parasite Lips" && g.until > Date.now()) && !/^\s*[(\[?!./\-*]/.test(d.Content) && Math.random() < 0.2) {
            const wants = ["...feed me.", "...more.", "...breed me.", "...need cum.", "...fill me.", "...so hungry.", "...use my mouth."];
            args = [args[0], Object.assign({}, d, { Content: d.Content.replace(/\s+$/, "") + " " + wants[Math.floor(Math.random() * wants.length)] })];
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] parasite speech unavailable:", e);
    }
    try {
      mod.hookFunction("ServerSend", 5, (args, next) => {
        try {
          const d = args[1], s = st.panel && st.panel.s;
          if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && s && Array.isArray(s.fx) && s.fx.some((f) => f.id === "moo" && f.until > Date.now()) && !/^\s*[(\[?!./\-*]/.test(d.Content))
            args = [args[0], Object.assign({}, d, { Content: mooify(d.Content, s.species) })];
        } catch (e) {
          console.warn("[Farmhand Companion] moo:", e);
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Farmhand Companion] moo juice unavailable:", e);
    }
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
          sendCommand(args, true);
          st.panel.toggle(true);
        }
      }]);
    }
    setInterval(() => {
      const here = botHere2();
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
