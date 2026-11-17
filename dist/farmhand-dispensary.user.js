// ==UserScript==
// @name         BnB Farm — The Farmhand's Dispensary
// @namespace    bnbfarm
// @version      0.1.0
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-dispensary.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-dispensary.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  Doses from crafted items: a needle with the right words on it does what it says. Works anywhere, with or without the farm.
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

  // dispensary/src/index.js
  var import_bondage_club_mod_sdk = __toESM(require_bcmodsdk(), 1);

  // dispensary/src/version.js
  var VERSION = "0.1.0";

  // dispensary/src/config.js
  var BOT = 260239;
  var PROPRIETORS = [221397, 232922];
  var KEY = "FarmhandDispensary";
  var LSCG_ID = "farmhand-dispensary";
  var LADDER = [
    { id: "me", label: "Only me", who: "only you" },
    { id: "owner", label: "My owner", who: "you and your owner" },
    { id: "lovers", label: "+ my lovers", who: "your owner and your lovers" },
    { id: "farm", label: "+ the farm", who: "your owner, your lovers and the farm" },
    { id: "white", label: "+ my whitelist", who: "your owner, lovers, the farm and your whitelist" },
    { id: "friends", label: "+ my friends", who: "your owner, lovers, the farm, your whitelist and your friends" },
    { id: "all", label: "Everyone but my blacklist", who: "anybody who isn't on your blacklist" },
    { id: "any", label: "Everyone, blacklist too", who: "anybody at all, your blacklist too" }
  ];
  var DEFAULT_RUNG = "farm";
  var PENALTY = 50;

  // dispensary/src/store.js
  var W = window;
  var S = null;
  var saveT = null;
  var listeners = [];
  var fresh = () => ({ v: 1, who: DEFAULT_RUNG, clock: "online", penalty: PENALTY, off: {}, doses: {}, farm: [], farmAt: 0, seen: 0 });
  var num = (v, lo, hi, d) => typeof v === "number" && isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d;
  function clean(d) {
    const s = fresh();
    if (!d || typeof d !== "object") return s;
    if (LADDER.some((r) => r.id === d.who)) s.who = d.who;
    if (d.clock === "real") s.clock = "real";
    s.penalty = Math.round(num(d.penalty, 0, 200, PENALTY));
    if (d.off && typeof d.off === "object") {
      for (const [k, v] of Object.entries(d.off)) if (/^[a-z]{2,20}$/.test(k) && v === true) s.off[k] = true;
    }
    if (d.doses && typeof d.doses === "object") {
      for (const [k, x] of Object.entries(d.doses)) {
        if (!/^[a-z]{2,20}$/.test(k) || !x || typeof x !== "object") continue;
        const o = { x: Math.round(num(x.x, 1, 5, 1)), by: Math.round(num(x.by, 0, 1e9, 0)), at: num(x.at, 0, 1e14, 0) };
        if (typeof x.until === "number") o.until = num(x.until, 0, 1e14, 0);
        else o.left = num(x.left, 0, 30 * 864e5, 0);
        s.doses[k] = o;
      }
    }
    if (Array.isArray(d.farm)) s.farm = d.farm.filter((m) => Number.isInteger(m) && m > 0).slice(0, 300);
    s.farmAt = num(d.farmAt, 0, 1e14, 0);
    s.seen = num(d.seen, 0, 1e14, 0);
    return s;
  }
  var localKey = () => "fd-" + (W.Player && W.Player.MemberNumber);
  function fromAccount() {
    try {
      const raw = W.Player && W.Player.ExtensionSettings && W.Player.ExtensionSettings[KEY];
      if (typeof raw !== "string" || !raw) return null;
      const txt = W.LZString && typeof W.LZString.decompressFromBase64 === "function" ? W.LZString.decompressFromBase64(raw) : null;
      return txt ? JSON.parse(txt) : null;
    } catch (e) {
      return null;
    }
  }
  function fromBrowser() {
    try {
      return JSON.parse(W.localStorage.getItem(localKey()));
    } catch (e) {
      return null;
    }
  }
  function load() {
    S = clean(fromAccount() || fromBrowser());
    return S;
  }
  var st = () => S || load();
  function save(now) {
    clearTimeout(saveT);
    const go = () => {
      try {
        W.localStorage.setItem(localKey(), JSON.stringify(S));
      } catch (e) {
      }
      try {
        if (W.Player && W.Player.ExtensionSettings && W.LZString && typeof W.ServerPlayerExtensionSettingsSync === "function") {
          W.Player.ExtensionSettings[KEY] = W.LZString.compressToBase64(JSON.stringify(S));
          W.ServerPlayerExtensionSettingsSync(KEY);
        }
      } catch (e) {
        console.warn("[Dispensary] couldn't save to your account:", e);
      }
    };
    if (now) go();
    else saveT = setTimeout(go, 1500);
    for (const f of listeners) {
      try {
        f();
      } catch (e) {
      }
    }
  }
  function onSave(f) {
    listeners.push(f);
  }

  // dispensary/src/lines.js
  var LINES = {
    denial: {
      take: [
        "Somethin' cold settles low in %t's belly and locks there. They can feel the edge, and they can feel it isn't goin' to let them past.",
        "%t's breath catches as the serum spreads. Everything down there goes tight and achin', and stays right there, one step short.",
        "The serum takes %t like a hand closin' round them, low and firm. They can climb all they like. They won't be goin' over.",
        "A slow, sweet ache blooms in %t and sits. Wantin' more is easy now. Gettin' there isn't on the menu.",
        "%t shivers as it takes. Whatever they had buildin' is caught and held, right at the lip, and that's where it'll stay.",
        "It goes in warm and settles heavy. %t can feel the edge come up to meet them, and stop."
      ],
      held: [
        "Right at the edge, and it won't let you over. Not yet, sugar.",
        "You climb, and climb, and the serum holds you right there at the top. No further.",
        "So close it hurts, and the serum just keeps you there.",
        "Your body tries. The serum says no. You're left shakin' at the edge.",
        "Almost... and then nothin'. The serum's still got its hand on you.",
        "There it is, right there, and you can't reach it. The serum won't have it."
      ],
      off: [
        "The Denial Serum's run its course. The lock low in your belly lets go, and you can go over whenever somebody lets you.",
        "That cold hold down low finally melts away. The edge is just an edge again.",
        "The serum's worn off. Nothin' holdin' you back now but whoever's got their hands on you."
      ]
    },
    sedative: {
      take: [
        "%t's eyelids droop as the sedative takes them. Their knees go loose and their head goes soft and quiet.",
        "The sedative rolls through %t slow and warm. Their shoulders drop, their eyes go heavy, and every thought takes the long way round.",
        "%t sways where they stand as it hits, blinkin' slow, like the whole room just got a blanket thrown over it.",
        "A thick, sleepy calm pours into %t. Their hands go heavy. Their feet forget how to hurry.",
        "%t yawns before they can stop it. The sedative's got them now, soft and slow and dozy.",
        "It goes in and the world goes soft at the edges. %t's eyes half close and don't quite open again."
      ],
      drift: [
        "Your eyes slide shut on their own. You drag them open again. Slowly.",
        "Everything feels far away and warm. Movin' seems like an awful lot of work.",
        "Your head nods. You catch it. It nods again.",
        "A yawn takes you whole. Your arms and legs feel full of warm sand.",
        "Your thoughts drift off somewhere soft and come back late.",
        "Standin' up straight is gettin' harder. Lyin' down sounds wonderful."
      ],
      off: [
        "The sedative's lettin' go. The fog lifts and your legs remember they're yours.",
        "You blink, and this time your eyes stay open. The sleepy weight's slid off you.",
        "The last of the sedative fades. You're awake again, if a little slow about it."
      ]
    }
  };
  var NOTES = {
    notListed: "%b tried to give you %d, but they're not on your list, so nothin' happened.",
    switchedOff: "%d came your way, but you've switched it off, so nothin' happened.",
    safeword: "Safeword: every dose in you is lifted. You're clear.",
    lscgOff: "%d came your way, but it's switched off in LSCG's Drug Enhancements, so LSCG let it pass. Switch it on there if you want it."
  };

  // dispensary/src/say.js
  var W2 = window;
  var inRoom = () => W2.CurrentScreen === "ChatRoom" && typeof W2.ServerSend === "function";
  var myName = () => {
    const P = W2.Player || {};
    return String(P.Nickname || P.Name || "Somebody");
  };
  function nameOf(mn) {
    const C = (W2.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
    return C ? String(C.Nickname || C.Name || "somebody") : "somebody";
  }
  var pick = (a) => a[Math.floor(Math.random() * a.length)];
  var fill = (t, v) => String(t).replace(/%t/g, myName()).replace(/%b/g, v && v.by || "somebody").replace(/%d/g, v && v.dose || "a dose");
  function local(text, color) {
    try {
      if (typeof W2.ChatRoomSendLocal !== "function" || W2.CurrentScreen !== "ChatRoom") return false;
      const d = W2.document.createElement("div");
      d.style.cssText = "color:" + (color || "#c79bd8") + ";white-space:pre-wrap";
      d.textContent = "\u{1F489} " + text;
      W2.ChatRoomSendLocal(d.outerHTML);
      return true;
    } catch (e) {
      return false;
    }
  }
  function action(text) {
    if (!inRoom() || !text) return false;
    const msg = String(text).slice(0, 900);
    try {
      W2.ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [
        { Tag: "Beep", Text: "msg" },
        { Tag: "\u53D1\u9001\u79C1\u804A", Text: "msg" },
        { Tag: "Biep", Text: "msg" },
        { Tag: "Sonner", Text: "msg" },
        { Tag: "msg", Text: msg }
      ] });
      return true;
    } catch (e) {
      return false;
    }
  }

  // dispensary/src/ladder.js
  var W3 = window;
  var has = (list, mn) => Array.isArray(list) && list.some((x) => (typeof x === "object" && x ? x.MemberNumber : x) === mn);
  var isFarm = (mn) => mn === BOT || PROPRIETORS.includes(mn) || st().farm.includes(mn);
  function isOwner(mn) {
    const P = W3.Player;
    try {
      if (P && typeof P.IsOwnedByMemberNumber === "function" && P.IsOwnedByMemberNumber(mn)) return true;
    } catch (e) {
    }
    return !!(P && P.Ownership && P.Ownership.MemberNumber === mn);
  }
  function isLover(mn) {
    const P = W3.Player;
    try {
      if (P && typeof P.IsLoverOfMemberNumber === "function" && P.IsLoverOfMemberNumber(mn)) return true;
    } catch (e) {
    }
    return has(P && P.Lovership, mn);
  }
  function rungOf(mn) {
    const P = W3.Player;
    if (!P || mn === P.MemberNumber) return 0;
    if (has(P.BlackList, mn)) return 7;
    if (isOwner(mn)) return 1;
    if (isLover(mn)) return 2;
    if (isFarm(mn)) return 3;
    if (has(P.WhiteList, mn)) return 4;
    if (has(P.FriendList, mn)) return 5;
    return 6;
  }
  var rungIndex = (id) => Math.max(0, LADDER.findIndex((r) => r.id === id));
  function allowed(mn, rung) {
    return typeof mn === "number" && rungOf(mn) <= rungIndex(rung || st().who);
  }
  var ladderWho = () => (LADDER[rungIndex(st().who)] || LADDER[0]).who;

  // dispensary/src/lscg.js
  var W4 = window;
  var api = null;
  var caps = null;
  var syncing = null;
  var REG = {};
  var lastLscg = {};
  var ours = (id) => LSCG_ID + "." + id;
  var minsLeft = (id) => Math.ceil(leftMs(id) / 6e4);
  function lscgPresent() {
    if (W4.LSCG) return true;
    try {
      const sdk = W4.bcModSdk;
      if (sdk && typeof sdk.getModsInfo === "function") return sdk.getModsInfo().some((m) => m && m.name === "LSCG");
    } catch (e) {
    }
    return false;
  }
  var lscgApi = () => !!(api && caps && caps.has("drugs"));
  var lscgHas = (id) => lscgApi() && !!REG[id];
  var lastLscgDose = (id) => lastLscg[id] || 0;
  function lscgDose(type, o) {
    if (!lscgApi()) return false;
    o = o || {};
    try {
      return !!api.drugs.dose(type, { multiplier: Math.max(0.2, Math.min(3, Number(o.x) || 1)), method: o.method || "inject", sender: o.by, minigame: false });
    } catch (e) {
      return false;
    }
  }
  function lscgShow(id, by) {
    if (!lscgHas(id) || syncing) return;
    syncing = id;
    try {
      api.drugs.dose(ours(id), { multiplier: 1, method: "inject", sender: by || void 0, minigame: false });
    } catch (e) {
    } finally {
      syncing = null;
    }
  }
  function setUp(L) {
    try {
      api = L.getModApi({ id: LSCG_ID, name: "The Farmhand's Dispensary", version: VERSION });
    } catch (e) {
      api = null;
      return;
    }
    caps = L.capabilities || /* @__PURE__ */ new Set();
    if (caps.has("drugs")) {
      for (const [id, B] of Object.entries(BOOK)) {
        if (B.lscg || REG[id]) continue;
        try {
          api.drugs.register({
            name: id,
            label: B.label,
            description: B.desc,
            keywords: B.keywords,
            color: B.color,
            max: 600,
            decayPerMinute: 0,
            tickSeconds: 20,
            onDose(ctx) {
              if (syncing === id) {
                ctx.setLevel(minsLeft(id));
                return;
              }
              lastLscg[id] = Date.now();
              const mult = Math.max(0.5, Math.min(2, Number(ctx.multiplier) || 1));
              const r = give(id, { by: ctx.sender, mins: Math.round(B.mins * mult) });
              ctx.setLevel(r.ok ? minsLeft(id) : 0);
            },
            onTick(ctx) {
              const m = active(id) ? minsLeft(id) : 0;
              if (ctx.level !== m) ctx.setLevel(m);
            },
            onWearOff() {
              if (active(id)) end(id, "lscg");
            }
            // LSCG's antidote, or LSCG's safeword
          });
          REG[id] = true;
        } catch (e) {
          console.warn("[Dispensary] LSCG wouldn't take " + id + ":", e);
        }
      }
    }
    if (caps.has("events")) {
      try {
        api.events.on("safeword", () => clearAll("safeword"));
      } catch (e) {
      }
      try {
        api.events.before("drug.beforeApply", (c) => {
          const p = c && c.payload;
          if (!p || !Array.isArray(p.types) || syncing) return;
          for (let i = p.types.length - 1; i >= 0; i--) {
            const m = /^farmhand-dispensary\.([a-z]+)$/.exec(String(p.types[i]));
            if (m && (st().off[m[1]] || typeof p.sender === "number" && !allowed(p.sender))) p.types.splice(i, 1);
          }
        });
      } catch (e) {
      }
    }
  }
  function initLscg() {
    const q = W4.LSCG_OnLoad = W4.LSCG_OnLoad || [];
    q.push((L) => {
      try {
        setUp(L);
      } catch (e) {
        console.warn("[Dispensary] LSCG hookup:", e);
      }
    });
  }

  // dispensary/src/doses.js
  var W5 = window;
  var MIN = 6e4;
  var CAP = 48 * 60 * MIN;
  var BOOK = {
    denial: {
      label: "Denial Serum",
      icon: "\u{1F6AB}",
      mins: 120,
      color: "#b04a7a",
      farm: true,
      words: /\b(denial serum|edge serum|orgasm (?:block\w*|denial)|held at the edge)\b/,
      keywords: ["denial serum", "edge serum", "orgasm block"],
      desc: "Held right at the edge: you can climb all you like, but you can't go over till it wears off. Two hours a dose."
    },
    sedative: {
      label: "Sedative",
      icon: "\u{1F4A4}",
      mins: 60,
      color: "#6d7fa8",
      farm: true,
      lscg: "sedative",
      words: /\b(sedat\w*|tranquili[sz]\w*|drowsy|sleepy serum)\b/,
      keywords: ["sedative", "tranquilizer"],
      desc: "Heavy, drowsy and slow: a sleepy face, slow feet, and eyes that keep wantin' to close. An hour a dose."
    }
  };
  var doseIds = () => Object.keys(BOOK);
  function stackOf(text) {
    const t = String(text || "").toLowerCase(), m = /\bx\s?([2-5])\b|\b([2-5])\s?x\b/.exec(t);
    if (m) return Number(m[1] || m[2]);
    return /\btriple\b/.test(t) ? 3 : /\bdouble\b/.test(t) ? 2 : 1;
  }
  function dosesIn(text) {
    const t = String(text || "").toLowerCase(), x = stackOf(t);
    return doseIds().filter((id) => BOOK[id].words.test(t)).map((id) => ({ id, x }));
  }
  var penaltyF = () => 1 + st().penalty / 100;
  function active(id) {
    const d = st().doses[id];
    return !!d && (typeof d.until === "number" ? d.until > Date.now() : d.left > 0);
  }
  function leftMs(id) {
    const d = st().doses[id];
    if (!d) return 0;
    return typeof d.until === "number" ? Math.max(0, d.until - Date.now()) : Math.max(0, d.left || 0);
  }
  function give(id, o) {
    o = o || {};
    const B = BOOK[id], S2 = st();
    if (!B) return { ok: false, why: "unknown" };
    if (S2.off[id]) return { ok: false, why: "off" };
    if (B.lscg && lscgPresent()) return { ok: false, why: "lscg" };
    const now = Date.now(), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
    const dur = Math.max(MIN, Math.min(CAP, (Number(o.mins) > 0 ? Number(o.mins) : B.mins * x) * MIN));
    const was = active(id), d = S2.doses[id], by = Number(o.by) || 0;
    if (S2.clock === "real") {
      const add2 = dur * penaltyF(), base = was && typeof d.until === "number" ? d.until : now;
      S2.doses[id] = { x, by, at: now, until: Math.min(now + CAP * penaltyF(), o.upto ? Math.max(base, now + add2) : base + add2) };
    } else {
      const base = was && typeof d.left === "number" ? d.left : 0;
      S2.doses[id] = { x, by, at: now, left: Math.min(CAP, o.upto ? Math.max(base, dur) : base + dur) };
    }
    save();
    if (!was) start(id);
    if (!o.quiet) action(fill(o.line || pick(LINES[id].take)));
    try {
      lscgShow(id, by);
    } catch (e) {
    }
    return { ok: true };
  }
  function end(id, why) {
    const S2 = st();
    if (!S2.doses[id]) return false;
    delete S2.doses[id];
    save();
    stop(id);
    if ((why === "done" || why === "lscg") && LINES[id]) local(pick(LINES[id].off));
    return true;
  }
  function clearAll(why) {
    let n = 0;
    for (const id of Object.keys(st().doses)) if (end(id, why)) n++;
    return n;
  }
  var lastTick = 0;
  var lastSave = 0;
  function tick() {
    const S2 = st(), now = Date.now(), gap = lastTick ? Math.max(0, Math.min(now - lastTick, 15e3)) : 0;
    lastTick = now;
    for (const [id, d] of Object.entries(S2.doses)) {
      if (!BOOK[id]) {
        delete S2.doses[id];
        continue;
      }
      if (typeof d.until !== "number") d.left = Math.max(0, (d.left || 0) - gap);
      if (!active(id)) end(id, "done");
      else feel(id, now);
    }
    if (now - lastSave > MIN) {
      lastSave = now;
      if (Object.keys(S2.doses).length) save();
    }
  }
  function setClock(mode) {
    const S2 = st(), want = mode === "real" ? "real" : "online";
    if (S2.clock === want) return;
    const now = Date.now(), f = penaltyF();
    for (const d of Object.values(S2.doses)) {
      if (want === "real" && typeof d.until !== "number") {
        d.until = now + (d.left || 0) * f;
        delete d.left;
      } else if (want === "online" && typeof d.until === "number") {
        d.left = Math.max(0, d.until - now) / f;
        delete d.until;
      }
    }
    S2.clock = want;
    save();
  }
  var face = (group, expr, secs) => {
    try {
      if (typeof W5.CharacterSetFacialExpression === "function" && W5.Player) W5.CharacterSetFacialExpression(W5.Player, group, expr, secs);
    } catch (e) {
    }
  };
  var felt = {};
  function start(id) {
    if (id === "sedative") face("Eyes", "Dazed", 180);
  }
  function stop(id) {
    if (id === "sedative") face("Eyes", null);
    delete felt[id];
  }
  function feel(id, now) {
    if (id !== "sedative" || !inRoom()) return;
    const f = felt[id] || (felt[id] = { face: now, drift: now + (3 + Math.random() * 4) * MIN });
    if (now - f.face > 2 * MIN) {
      f.face = now;
      face("Eyes", "Dazed", 180);
    }
    if (now >= f.drift) {
      f.drift = now + (8 + Math.random() * 6) * MIN;
      local(pick(LINES.sedative.drift));
    }
  }
  var heldTold = 0;
  function initDoses(mod2) {
    try {
      mod2.hookFunction("ActivityOrgasmPrepare", 6, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("denial")) {
            if (C.ArousalSettings) C.ArousalSettings.Progress = 94;
            face("Blush", "High", 20);
            if (Date.now() - heldTold > MIN) {
              heldTold = Date.now();
              local(pick(LINES.denial.held));
            }
            return void 0;
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Denial Serum can't hold you:", e);
    }
    try {
      mod2.hookFunction("ChatRoomMapViewCanEnterTile", 1, (args, next) => {
        const t = next(args);
        try {
          return t > 0 && active("sedative") ? t * 1.6 : t;
        } catch (e) {
          return t;
        }
      });
    } catch (e) {
      console.warn("[Dispensary] the Sedative can't slow you:", e);
    }
  }

  // dispensary/src/needle.js
  var W6 = window;
  var botHere = () => (W6.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var charOf = (mn) => (W6.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || (W6.Player && W6.Player.MemberNumber === mn ? W6.Player : null);
  function craftText(item) {
    if (!item || !item.Craft) return "";
    let d = item.Craft.Description || "";
    try {
      if (W6.CraftingDescription && typeof W6.CraftingDescription.Decode === "function") d = W6.CraftingDescription.Decode(d);
    } catch (e) {
    }
    return ((item.Craft.Name || "") + " | " + d).toLowerCase();
  }
  var handOf = (C) => C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemHandheld") : null;
  function factsOf(data, sender) {
    try {
      if (typeof W6.ChatRoomMessageRunExtractors === "function") {
        const m = W6.ChatRoomMessageRunExtractors(data, sender).metadata;
        if (m) return { name: m.ActivityName, target: m.TargetMemberNumber };
      }
    } catch (e) {
    }
    const dict = Array.isArray(data.Dictionary) ? data.Dictionary : [];
    const name = (dict.find((d) => d && d.ActivityName) || {}).ActivityName;
    const t = dict.find((d) => d && (typeof d.TargetCharacter === "number" || d.Tag === "TargetCharacter"));
    return { name, target: t ? typeof t.TargetCharacter === "number" ? t.TargetCharacter : t.MemberNumber : void 0 };
  }
  var LSCG_WAIT_MS = 1500;
  function onNeedle(by, item) {
    const text = craftText(item), list = dosesIn(text), at = Date.now(), done = [];
    for (const { id, x } of list) {
      const B = BOOK[id];
      if (B.farm && botHere()) continue;
      if (B.lscg && lscgPresent()) continue;
      if (!allowed(by)) {
        local(fill(NOTES.notListed, { by: nameOf(by), dose: B.label }));
        continue;
      }
      const go = () => {
        const r = give(id, { by, x });
        if (!r.ok && r.why === "off") local(fill(NOTES.switchedOff, { dose: B.label }));
        return r;
      };
      if (lscgHas(id)) setTimeout(() => {
        if (lastLscgDose(id) < at) go();
      }, LSCG_WAIT_MS);
      else {
        go();
        done.push(id);
      }
    }
    return done;
  }
  function initNeedle(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 1, (args, next) => {
        try {
          const data = args[0], P = W6.Player;
          if (data && data.Type === "Activity" && P && typeof data.Sender === "number") {
            const sender = charOf(data.Sender), f = factsOf(data, sender);
            if (f.name === "Inject" && f.target === P.MemberNumber && sender) onNeedle(data.Sender, handOf(sender));
          }
        } catch (e) {
          console.warn("[Dispensary] needle:", e);
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] can't feel needles:", e);
    }
  }

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

  // dispensary/src/farm.js
  var W7 = window;
  function send(type, data) {
    try {
      if (botHere() && typeof W7.ServerSend === "function") {
        W7.ServerSend("ChatRoomChat", makeMsg(type, data, BOT));
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  var helloAt = 0;
  var helloSig = "";
  var sigNow = () => JSON.stringify([allowed(BOT), lscgPresent(), Object.keys(st().off).sort()]);
  function hello(force) {
    const now = Date.now(), sig = sigNow();
    if (!force && sig === helloSig && now - helloAt < 30 * 6e4) return false;
    if (!send("dispHello", { ver: VERSION, farm: allowed(BOT), lscg: lscgPresent(), off: Object.keys(st().off) })) return false;
    helloAt = now;
    helloSig = sig;
    return true;
  }
  var tellSafeword = () => send("dispSafeword", {});
  function onDoseCall(m) {
    const id = String(m.dose || ""), B = BOOK[id];
    const reply = (ok, why) => {
      send("doseDone", { id: m.id, dose: id, ok: !!ok, why: why || "" });
      return { ok: !!ok, why: why || "" };
    };
    if (!B) return reply(false, "unknown");
    if (!allowed(BOT)) return reply(false, "ladder");
    if (st().off[id]) return reply(false, "off");
    const by = Number(m.by) || BOT, x = Math.max(1, Math.min(5, Math.round(Number(m.x) || 1)));
    const mins = Number(m.mins) > 0 ? Math.min(48 * 60, Number(m.mins)) : void 0, line = m.line ? String(m.line).slice(0, 900) : void 0;
    if (B.lscg && lscgPresent()) {
      if (m.hand) return reply(true, "lscg");
      const ok = lscgDose(B.lscg, { x, by });
      if (ok && line && !m.quiet) action(line);
      return reply(ok, ok ? "lscg" : "lscg-off");
    }
    const twice = lscgHas(id) && Date.now() - lastLscgDose(id) < 8e3;
    const r = give(id, { by, x, mins, line, upto: twice, quiet: twice || !!m.quiet });
    return reply(r.ok, r.why);
  }
  function onFarmMsg(m) {
    if (m.type === "ping") {
      hello(true);
      return;
    }
    if (m.type === "dose") {
      onDoseCall(m);
      return;
    }
    if (m.type === "dispWelcome") {
      const S2 = st();
      S2.farm = Array.isArray(m.farm) ? m.farm.filter((x) => Number.isInteger(x) && x > 0).slice(0, 300) : S2.farm;
      S2.farmAt = Date.now();
      save();
      return;
    }
    if (m.type === "dispClear") {
      if (clearAll("safeword")) local(NOTES.safeword);
      return;
    }
  }
  function initFarm(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 2, (args, next) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && data.Sender === BOT) {
            const m = readMsg(data);
            if (m) onFarmMsg(m);
          }
        } catch (e) {
          console.warn("[Dispensary] farm:", e);
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] can't hear the farm girl:", e);
    }
    try {
      mod2.hookFunction("ChatRoomSync", 2, (args, next) => {
        const r = next(args);
        setTimeout(() => hello(true), 2500);
        return r;
      });
    } catch (e) {
    }
    onSave(() => {
      setTimeout(() => hello(false), 500);
    });
    setInterval(() => hello(false), 5 * 6e4);
  }

  // dispensary/src/safeword.js
  function safeword(from) {
    const n = clearAll("safeword");
    tellSafeword();
    local(NOTES.safeword, "#e0a0a0");
    return n;
  }
  function initSafeword(mod2) {
    for (const f of ["ChatRoomSafewordRevert", "ChatRoomSafewordRelease"]) {
      try {
        mod2.hookFunction(f, 0, (args, next) => {
          const r = next(args);
          try {
            safeword("game");
          } catch (e) {
          }
          return r;
        });
      } catch (e) {
      }
    }
  }

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

  // dispensary/src/page.js
  var W8 = window;
  var ID = "FarmhandDispensary";
  var box = null;
  var note = "";
  var CSS = `
#fd-page{position:fixed;left:50%;top:3%;transform:translateX(-50%);width:min(760px,96vw);max-height:94vh;max-height:94dvh;overflow-y:auto;overflow-x:hidden;
  -webkit-overflow-scrolling:touch;z-index:2147483000;padding:14px 18px;box-sizing:border-box;background:#211a24;color:#ecdfe8;border:2px solid #b78ac8;
  border-radius:12px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 6px 30px #000a}
@media (max-width:700px),(pointer:coarse) and (max-width:1000px){#fd-page{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;max-height:none;border-radius:0;border-width:0;padding:10px 12px}}
#fd-page h2{margin:0;flex:1;font-family:Bitter,Georgia,serif;color:#d9b3e6}
#fd-page h3{margin:16px 0 6px;font-size:15px;color:#d9b3e6}
#fd-page .fd-card{background:#2b2230;border:1px solid #4a3a52;border-radius:8px;padding:10px 12px;margin:6px 0}
#fd-page .fd-muted{color:#b3a2b8;font-size:12.5px}
#fd-page .fd-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#fd-page button{font:inherit;cursor:pointer;border-radius:7px;border:1px solid #8e6aa0;background:#3a2c42;color:#ecdfe8;padding:5px 12px;min-height:32px}
#fd-page button.fd-safe{background:#6e2330;border-color:#c06070;font-weight:700}
#fd-page select{font:inherit;max-width:100%;padding:4px 6px;border-radius:6px;background:#1b151e;color:#ecdfe8;border:1px solid #6e5a78}
#fd-page label{display:flex;align-items:center;gap:8px;cursor:pointer}
#fd-page .fd-note{color:#e6c37a;margin:6px 0}
@media (pointer:coarse){#fd-page select,#fd-page input{font-size:16px}#fd-page button{min-height:40px}}
`;
  function styles() {
    if (W8.document.getElementById("fd-style")) return;
    const s = W8.document.createElement("style");
    s.id = "fd-style";
    s.textContent = CSS;
    W8.document.head.appendChild(s);
  }
  var clockTip = (mode) => {
    const p = st().penalty;
    return mode === "real" ? "Real time: your timers keep running while you're logged off. To make up for it, every timer runs " + p + "% longer, so a 2-hour dose lasts " + (2 * (1 + p / 100)).toFixed(1).replace(/\.0$/, "") + " hours." : "While online: your timers only count down while you're logged in. A 2-hour dose is 2 hours of you being here.";
  };
  function timeLeft(ms) {
    const m = Math.ceil(ms / 6e4);
    return m >= 120 ? Math.floor(m / 60) + " h " + (m % 60 ? m % 60 + " min" : "") : m >= 60 ? "1 h " + (m - 60 ? m - 60 + " min" : "") : m + " min";
  }
  function view() {
    const S2 = st(), now = doseIds().filter(active);
    const kids = [];
    kids.push(h(
      "div",
      { class: "fd-row", style: { marginBottom: "6px" } },
      h("h2", null, "\u{1F489} The Farmhand's Dispensary"),
      h("button", { onclick: () => {
        if (typeof W8.PreferenceSubscreenExtensionsClear === "function") W8.PreferenceSubscreenExtensionsClear();
        else close();
      } }, "Back")
    ));
    if (note) kids.push(h("div", { class: "fd-note" }, note));
    kids.push(h("h3", null, "In you now"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      now.length ? now.map((id) => h("div", null, BOOK[id].icon + " " + BOOK[id].label + (st().doses[id].x > 1 ? " \xD7" + st().doses[id].x : "") + ": " + timeLeft(leftMs(id)) + " left" + (S2.clock === "online" ? " of your time here" : ""))) : h("div", { class: "fd-muted" }, "Nothin'. You're clear."),
      h(
        "div",
        { class: "fd-row", style: { marginTop: "8px" } },
        h("button", { class: "fd-safe", onclick: () => {
          safeword("page");
          note = "Safeword: every dose lifted.";
          draw();
        } }, "\u{1F534} Safeword: lift every dose"),
        h("span", { class: "fd-muted" }, "Always works. The game's own safeword does it too, and so does /dispensary safeword.")
      )
    ));
    kids.push(h("h3", null, "Who can dose you"));
    const sel = h(
      "select",
      { "aria-label": "Who can dose you", onchange: (e) => {
        st().who = e.target.value;
        save();
        note = "";
        draw();
      } },
      LADDER.map((r) => h("option", { value: r.id, selected: r.id === S2.who ? true : void 0 }, r.label))
    );
    kids.push(h("div", { class: "fd-card" }, sel, h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Right now: " + ladderWho() + ". You can always dose yourself.")));
    kids.push(h("h3", null, "The clock"));
    const radio = (mode, label) => h(
      "label",
      { title: clockTip(mode) },
      h("input", { type: "radio", name: "fd-clock", checked: S2.clock === mode ? true : void 0, onchange: () => {
        setClock(mode);
        draw();
      } }),
      label
    );
    kids.push(h(
      "div",
      { class: "fd-card" },
      h("div", { class: "fd-row", style: { gap: "18px" } }, radio("online", "While online"), radio("real", "Real time (+" + S2.penalty + "%)")),
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, clockTip(S2.clock))
    ));
    kids.push(h("h3", null, "Doses"));
    const lscg = lscgPresent();
    for (const id of doseIds()) {
      const B = BOOK[id], theirs = B.lscg && lscg;
      kids.push(h(
        "div",
        { class: "fd-card" },
        h(
          "label",
          null,
          h("input", {
            type: "checkbox",
            checked: !S2.off[id] ? true : void 0,
            disabled: theirs ? true : void 0,
            onchange: (e) => {
              if (e.target.checked) delete st().off[id];
              else st().off[id] = true;
              save();
              draw();
            }
          }),
          h("b", null, B.icon + " " + B.label)
        ),
        h("div", { class: "fd-muted" }, B.desc),
        h("div", { class: "fd-muted" }, "Words on a crafted item: " + B.keywords.join(", ") + ". Add x2 to x5 for a stronger dose."),
        theirs ? h("div", { class: "fd-note" }, "LSCG is loaded, so this one is LSCG's own sedative: LSCG's settings decide.") : null
      ));
    }
    if (lscg) {
      kids.push(h("div", { class: "fd-card fd-muted" }, lscgApi() ? "LSCG is loaded. Its sedative, aphrodisiac, mind control and antidote are LSCG's. Our doses are in LSCG's Drug Enhancements list too: switch them on there as well to see a bar with the time left." : "LSCG is loaded. Its sedative, aphrodisiac, mind control and antidote are LSCG's."));
    }
    kids.push(h("div", { class: "fd-muted", style: { marginTop: "14px" } }, "The Farmhand's Dispensary v" + VERSION + " \xB7 B&B Farm. On the farm, the farm girl keeps the farm's books and your Dispensary does the rest."));
    return kids;
  }
  function draw() {
    if (box) box.replaceChildren(...view());
  }
  function open() {
    close();
    styles();
    box = W8.document.createElement("div");
    box.id = "fd-page";
    W8.document.body.appendChild(box);
    draw();
  }
  function close() {
    if (box) {
      box.remove();
      box = null;
    }
    note = "";
  }
  var pageOpen = () => !!box;
  function redrawPage() {
    draw();
  }
  function initPage() {
    if (typeof W8.PreferenceRegisterExtensionSetting !== "function") return false;
    try {
      W8.PreferenceRegisterExtensionSetting({
        Identifier: ID,
        ButtonText: "The Farmhand's Dispensary",
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
      console.warn("[Dispensary] its page couldn't go in the game's Extensions:", e);
      return false;
    }
  }
  function openPage() {
    try {
      if (typeof W8.PreferenceSubscreenExtensionsOpen === "function") {
        W8.PreferenceSubscreenExtensionsOpen(ID);
        return true;
      }
    } catch (e) {
    }
    open();
    return true;
  }

  // dispensary/src/index.js
  var W9 = window;
  var bcModSdk = import_bondage_club_mod_sdk.default.default || import_bondage_club_mod_sdk.default;
  if (W9.__farmDispensary) {
    console.warn("[Dispensary] Two copies of the Farmhand's Dispensary are installed. Delete the older one in Tampermonkey, then reload.");
    throw new Error("The Farmhand's Dispensary: another copy is already running");
  }
  var mod = bcModSdk.registerMod({ name: "FarmhandDispensary", fullName: "The Farmhand's Dispensary", version: VERSION });
  W9.__farmDispensary = VERSION;
  initLscg();
  function status() {
    const on = doseIds().filter(active);
    local((on.length ? "In you now: " + on.map((id) => BOOK[id].label + " (" + timeLeft(leftMs(id)) + ")").join(", ") + "." : "No doses in you.") + " Who can dose you: " + ladderWho() + ". /dispensary safeword lifts every dose; /dispensary page opens the settings.");
  }
  function commands() {
    if (typeof W9.CommandCombine !== "function") return;
    try {
      W9.CommandCombine([{
        Tag: "dispensary",
        Description: "[safeword | page]: The Farmhand's Dispensary. What's in you, the safeword, the settings",
        Action: (args) => {
          const a = String(args || "").trim().toLowerCase();
          if (/^(safe|safeword|red)$/.test(a)) {
            safeword("command");
            return;
          }
          if (/^(page|settings|open)$/.test(a)) {
            openPage();
            return;
          }
          status();
        }
      }]);
    } catch (e) {
      console.warn("[Dispensary] /dispensary unavailable:", e);
    }
  }
  var started = false;
  function start2() {
    if (started) return;
    started = true;
    load();
    initDoses(mod);
    initNeedle(mod);
    initFarm(mod);
    initSafeword(mod);
    initPage();
    commands();
    tick();
    setInterval(() => {
      try {
        tick();
        if (pageOpen()) redrawPage();
      } catch (e) {
        console.warn("[Dispensary] clock:", e);
      }
    }, 5e3);
    setTimeout(() => hello(true), 3e3);
  }
  var boot = setInterval(() => {
    const P = W9.Player;
    if (!P || typeof P.MemberNumber !== "number" || !P.ExtensionSettings) return;
    clearInterval(boot);
    try {
      start2();
    } catch (e) {
      console.warn("[Dispensary] didn't start:", e);
    }
  }, 1e3);
  if (W9.__FARMHAND_TEST__) W9.__disp = { st: () => st(), give: (...a) => give(...a), tick: () => tick(), setClock: (m) => setClock(m), active, leftMs, allowed: (mn) => allowed(mn), started: () => started };
  W9.FarmhandDispensary = Object.freeze({
    version: VERSION,
    active: (id) => active(String(id)),
    doses: () => doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })),
    who: () => st().who
  });
})();
