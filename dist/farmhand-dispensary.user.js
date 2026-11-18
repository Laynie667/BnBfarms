// ==UserScript==
// @name         BnB Farm — The Farmhand's Dispensary
// @namespace    bnbfarm
// @version      0.3.0
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

  // shared/ink/ink-designs.json
  var ink_designs_default = {
    made: "2026-11-18T00:49:11.491Z",
    res: 2,
    groups: {
      FarmInk: [
        {
          name: "KnotSlave",
          title: "Knot Slave",
          where: "lower belly or above the tail",
          desc: "blackletter, with a knot under it",
          sheet: 1,
          spot: "womb",
          left: 140,
          top: 465,
          w: 220,
          h: 126,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "BreedingSow",
          title: "Breeding Sow",
          where: "tramp stamp",
          desc: "flowing script on a curve, a heart and a snout",
          sheet: 1,
          spot: "hip",
          left: 134,
          top: 515,
          w: 144,
          h: 66,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "BreedingBitch",
          title: "Breeding Bitch",
          where: "thigh",
          desc: "drippin' graffiti, paw prints",
          sheet: 1,
          spot: "thigh",
          left: 148,
          top: 632,
          w: 120,
          h: 60,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "FoalFactory",
          title: "Foal Factory",
          where: "lower belly",
          desc: "western, a horseshoe for luck",
          sheet: 1,
          spot: "womb",
          left: 140,
          top: 483,
          w: 220,
          h: 91,
          layers: [
            {
              name: "Ink",
              color: "#19151f",
              colorize: true
            }
          ]
        },
        {
          name: "PuppyFactory",
          title: "Puppy Factory",
          where: "lower belly",
          desc: "bubble graffiti, paw prints",
          sheet: 1,
          spot: "womb",
          left: 140,
          top: 485,
          w: 220,
          h: 87,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "KittenFactory",
          title: "Kitten Factory",
          where: "lower belly",
          desc: "flowing script, a heart with ears",
          sheet: 1,
          spot: "womb",
          left: 140,
          top: 448,
          w: 220,
          h: 161,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "WombCrest",
          title: "Womb Crest",
          where: "over the womb",
          desc: "the lewd crest, glowin' pink",
          sheet: 1,
          spot: "womb",
          left: 140,
          top: 458,
          w: 220,
          h: 141,
          layers: [
            {
              name: "Ink",
              color: "#d4237a",
              colorize: true
            }
          ]
        },
        {
          name: "CumHere",
          title: "Cum Here",
          where: "lower belly, pointin' down",
          desc: "marker scrawl and an arrow",
          sheet: 1,
          spot: "womb",
          left: 140,
          top: 458,
          w: 220,
          h: 141,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "FreeUse",
          title: "Free Use",
          where: "tramp stamp",
          desc: "blackletter, with arrows",
          sheet: 1,
          spot: "hip",
          left: 134,
          top: 514,
          w: 144,
          h: 69,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "TentacleBred",
          title: "Tentacle Bred",
          where: "a hip or the belly",
          desc: "graffiti, with a curl of tentacle",
          sheet: 1,
          spot: "hip",
          left: 134,
          top: 506,
          w: 144,
          h: 85,
          layers: [
            {
              name: "Ink",
              color: "#1b1720",
              colorize: true
            }
          ]
        },
        {
          name: "WolfBredPackBitch",
          title: "Wolf Bred \xB7 Pack Bitch",
          where: "thigh",
          desc: "a wolf's paw and the pack's words",
          sheet: 1,
          spot: "thigh",
          left: 148,
          top: 609,
          w: 120,
          h: 106,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "QueenInHeat",
          title: "Queen In Heat",
          where: "lower back",
          desc: "a crown in flames",
          sheet: 1,
          spot: "hip",
          left: 134,
          top: 503,
          w: 144,
          h: 91,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "TrapBait",
          title: "Trap Bait",
          where: "a calf or a shoulder",
          desc: "a warning label",
          sheet: 1,
          spot: "thigh",
          left: 148,
          top: 633,
          w: 120,
          h: 58,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "MilkedAndBred",
          title: "Milked And Bred",
          where: "above a breast",
          desc: "a dairy-print badge",
          sheet: 1,
          spot: "chest",
          left: 154,
          top: 209,
          w: 192,
          h: 146,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "WombCrestSeeded",
          title: "Womb Crest, Seeded",
          where: "over the womb",
          desc: "the crest once you've taken: an egg in the heart",
          sheet: 2,
          spot: "womb",
          left: 140,
          top: 458,
          w: 220,
          h: 141,
          layers: [
            {
              name: "Ink",
              color: "#d4237a",
              colorize: true
            }
          ]
        },
        {
          name: "GoblinLoot",
          title: "Goblin Loot",
          where: "anywhere they could reach",
          desc: "a crude stick-and-poke, crossed daggers",
          sheet: 2,
          spot: "hip",
          left: 134,
          top: 509,
          w: 144,
          h: 79,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "SlutStickAndPoke",
          title: "Slut (stick-and-poke)",
          where: "a cheek or a wrist",
          desc: "little hand-poked dots",
          sheet: 2,
          spot: "cheek",
          left: 202,
          top: 171,
          w: 48,
          h: 19,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "MooCowPrint",
          title: "Moo (cow-print)",
          where: "a shoulder or a hip",
          desc: "inside a cow-print patch",
          sheet: 2,
          spot: "shoulder",
          left: 140,
          top: 272,
          w: 84,
          h: 56,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "UseMeFreshMarker",
          title: "Use Me (fresh marker)",
          where: "a thigh: wears off in a few hours",
          desc: "wet marker, still shiny",
          sheet: 2,
          spot: "thigh",
          left: 148,
          top: 648,
          w: 120,
          h: 28,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "GlowSlutGlowInk",
          title: "Glow Slut (glow ink)",
          where: "lower belly: only shows while you're dosed",
          desc: "UV ink, glowin'",
          sheet: 2,
          spot: "womb",
          left: 140,
          top: 475,
          w: 220,
          h: 106,
          layers: [
            {
              name: "Glow",
              color: "#4dfff0",
              colorize: true
            },
            {
              name: "GlowInk",
              color: "#4dfff0",
              colorize: true
            }
          ]
        },
        {
          name: "ForSize",
          title: "For Size",
          where: "an inner thigh",
          desc: "a ruler, inches, BIGGER at the top",
          sheet: 2,
          spot: "innerThigh",
          left: 182,
          top: 610,
          w: 96,
          h: 60,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "InsertHere",
          title: "Insert Here",
          where: "low on the belly or the small of the back",
          desc: "a bullseye and a slot",
          sheet: 2,
          spot: "womb",
          left: 140,
          top: 410,
          w: 220,
          h: 237,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "ThisWayToTheStable",
          title: "This Way To The Stable",
          where: "from the belly button down",
          desc: "hoof prints trailin' down",
          sheet: 2,
          spot: "belly",
          left: 158,
          top: 366,
          w: 184,
          h: 192,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "TheFullSign",
          title: "The Full Sign",
          where: "the small of the back",
          desc: "the whole sign: Farm \xB7 Dairy \xB7 Kennel",
          sheet: 3,
          spot: "hip",
          left: 136,
          top: 465,
          w: 140,
          h: 166,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "PropertyOfBB",
          title: "Property Of B&B",
          where: "a butt cheek",
          desc: "stencil words round the BB",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 493,
          w: 144,
          h: 111,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "GradeABreeder",
          title: "Grade A Breeder",
          where: "a hip or a flank",
          desc: "a purple inspection stamp",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 476,
          w: 144,
          h: 144,
          layers: [
            {
              name: "Stamp",
              color: "#5b2a86",
              colorize: true
            }
          ]
        },
        {
          name: "BBWombCrest",
          title: "B&B Womb Crest",
          where: "over the womb",
          desc: "the crest, with the BB in its heart",
          sheet: 3,
          spot: "womb",
          left: 140,
          top: 456,
          w: 220,
          h: 144,
          layers: [
            {
              name: "Ink",
              color: "#d4237a",
              colorize: true
            }
          ]
        },
        {
          name: "RingForService",
          title: "Ring For Service",
          where: "just above the slit",
          desc: "the bell, an arrow, an invitation",
          sheet: 3,
          spot: "womb",
          left: 140,
          top: 445,
          w: 220,
          h: 166,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "DrippingBB",
          title: "Dripping B&B",
          where: "a thigh or the belly",
          desc: "the BB so wet it runs, still shinin'",
          sheet: 3,
          spot: "thigh",
          left: 148,
          top: 603,
          w: 120,
          h: 119,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            },
            {
              name: "Wet",
              color: "#ffffff",
              colorize: true
            }
          ]
        },
        {
          name: "GoodGirlKennelBone",
          title: "Good Girl (kennel bone)",
          where: "a collarbone",
          desc: "the sign's bone, with praise in it",
          sheet: 3,
          spot: "chest",
          left: 154,
          top: 229,
          w: 192,
          h: 106,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "BreedingBitchKennelBone",
          title: "Breeding Bitch (kennel bone)",
          where: "a thigh",
          desc: "the bone, and the bell hung off it",
          sheet: 3,
          spot: "thigh",
          left: 148,
          top: 624,
          w: 120,
          h: 77,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "FarmFreshMilkCap",
          title: "Farm Fresh (milk cap)",
          where: "above a breast",
          desc: "a dairy bottle cap in dairy blue",
          sheet: 3,
          spot: "chest",
          left: 154,
          top: 186,
          w: 192,
          h: 192,
          layers: [
            {
              name: "Ink",
              color: "#1d3f8f",
              colorize: true
            }
          ]
        },
        {
          name: "BestInShowRosette",
          title: "Best In Show (rosette)",
          where: "a thigh",
          desc: "a prize ribbon from the county fair",
          sheet: 3,
          spot: "thigh",
          left: 153,
          top: 593,
          w: 111,
          h: 138,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "BreedMeTrampStamp",
          title: "Breed Me (tramp stamp)",
          where: "the small of the back",
          desc: "curls, hearts and the BB",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 517,
          w: 144,
          h: 62,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "SpankedAtBBPaddleWelt",
          title: "Spanked At B&B (paddle welt)",
          where: "a butt cheek: fades in a day",
          desc: "a paddle with BB cut through it",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 466,
          w: 144,
          h: 165,
          layers: [
            {
              name: "Welt",
              color: "#c22f3a",
              colorize: true
            },
            {
              name: "WeltCore",
              color: "#d8434c",
              colorize: true
            },
            {
              name: "WeltShine",
              color: "#ff8f8a",
              colorize: true
            }
          ]
        },
        {
          name: "TitsUp",
          title: "Tits Up",
          where: "the chest or a shoulder blade",
          desc: "our biggest cup out a porthole, a B seared on each",
          sheet: 3,
          spot: "chest",
          left: 156,
          top: 172,
          w: 189,
          h: 221,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            },
            {
              name: "MarkEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Mark",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "MarkShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "ReBreed",
          title: "Re-Breed",
          where: "a hip or a flank",
          desc: "a red inspection stamp: didn't take, go again",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 502,
          w: 144,
          h: 93,
          layers: [
            {
              name: "Stamp",
              color: "#b3122e",
              colorize: true
            }
          ]
        },
        {
          name: "CareInstructions",
          title: "Care Instructions",
          where: "the hip, by the waistband",
          desc: "a laundry tag: how to treat her",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 489,
          w: 144,
          h: 118,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "ThisEndUp",
          title: "This End Up",
          where: "the small of the back",
          desc: "shipping arrows, handle roughly",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 492,
          w: 144,
          h: 113,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "SlipperyWhenWet",
          title: "Slippery When Wet",
          where: "an inner thigh",
          desc: "a yellow wet-floor sign",
          sheet: 4,
          spot: "innerThigh",
          left: 182,
          top: 589,
          w: 96,
          h: 102,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "25PerRide",
          title: "25\xA2 Per Ride",
          where: "just above the crack",
          desc: "an arcade coin slot",
          sheet: 4,
          spot: "womb",
          left: 143,
          top: 402,
          w: 215,
          h: 253,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "OutOfOrder",
          title: "Out Of Order",
          where: "a butt cheek",
          desc: "a sign taped on: use the other hole",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 494,
          w: 144,
          h: 109,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "ScanToBreed",
          title: "Scan To Breed",
          where: "the back of a thigh",
          desc: "a made-up code: it scans as nothin'",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 487,
          w: 144,
          h: 122,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "PetCollar",
          title: "Pet (collar)",
          where: "round the neck",
          desc: "a collar inked on for good, a bone tag hangin'",
          sheet: 4,
          spot: "neck",
          left: 180,
          top: 205,
          w: 140,
          h: 70,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "MissingHerDignity",
          title: "Missing: Her Dignity",
          where: "a hip",
          desc: "a milk carton notice",
          sheet: 4,
          spot: "hip",
          left: 145,
          top: 465,
          w: 122,
          h: 166,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "FuckToyGraffiti",
          title: "Fuck Toy (graffiti)",
          where: "across the belly",
          desc: "a spray-painted tag, crown and drips",
          sheet: 4,
          spot: "belly",
          left: 158,
          top: 416,
          w: 184,
          h: 92,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "BredMare",
          title: "Bred Mare",
          where: "a hip or a flank",
          desc: "a steel horseshoe, a yellow banner",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 505,
          w: 144,
          h: 86,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "BitchInHeat",
          title: "Bitch In Heat",
          where: "a hip or the small of the back",
          desc: "a paw print in flames",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 504,
          w: 144,
          h: 89,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "CherryPopped",
          title: "Cherry Popped",
          where: "a hip",
          desc: "two cherries and a banner",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 490,
          w: 144,
          h: 116,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "DrippingPeach",
          title: "Dripping Peach",
          where: "a butt cheek",
          desc: "a ripe peach, crease and all, drippin' white",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 475,
          w: 144,
          h: 146,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            },
            {
              name: "Wet",
              color: "#f7f2ea",
              colorize: true
            }
          ]
        },
        {
          name: "BredLikeARabbit",
          title: "Bred Like A Rabbit",
          where: "a hip or an ankle",
          desc: "a bunny with her ears up",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 501,
          w: 144,
          h: 95,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "LayingHen",
          title: "Laying Hen",
          where: "a hip",
          desc: "a nest of eggs, for the ovipositor girls",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 506,
          w: 144,
          h: 85,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "HelloMyNameIs",
          title: "Hello, My Name Is",
          where: "a breast or the belly",
          desc: "a name-tag sticker, filled in",
          sheet: 5,
          spot: "chest",
          left: 154,
          top: 218,
          w: 192,
          h: 128,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "PleaseDisturb",
          title: "Please Disturb",
          where: "a hip",
          desc: "a door hanger: breedin' in progress, walk right in",
          sheet: 5,
          spot: "hip",
          left: 148,
          top: 465,
          w: 117,
          h: 166,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "Sold",
          title: "Sold",
          where: "a butt cheek",
          desc: "a price tag on a string",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 511,
          w: 144,
          h: 75,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "TipYourCow",
          title: "Tip Your Cow",
          where: "just above the crack",
          desc: "a tip jar, half full",
          sheet: 5,
          spot: "womb",
          left: 171,
          top: 402,
          w: 158,
          h: 253,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "StudParkingOnly",
          title: "Stud Parking Only",
          where: "the small of the back",
          desc: "a reserved sign: everyone else gets milked",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 479,
          w: 144,
          h: 138,
          layers: [
            {
              name: "Ink",
              color: "#1f4fa8",
              colorize: true
            }
          ]
        },
        {
          name: "FillMeDotwork",
          title: "Fill Me (dotwork)",
          where: "round the belly button",
          desc: "a mandala in tiny dots",
          sheet: 5,
          spot: "belly",
          left: 158,
          top: 362,
          w: 184,
          h: 201,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "HennaTrail",
          title: "Henna Trail",
          where: "down a thigh: fades in a week",
          desc: "mehndi vines and paisleys",
          sheet: 5,
          spot: "thigh",
          left: 106,
          top: 596,
          w: 204,
          h: 133,
          layers: [
            {
              name: "Ink",
              color: "#7a3410",
              colorize: true
            }
          ]
        },
        {
          name: "FertileWatercolour",
          title: "Fertile (watercolour)",
          where: "low on the belly",
          desc: "a fine-line womb in a wash of colour",
          sheet: 5,
          spot: "womb",
          left: 140,
          top: 456,
          w: 220,
          h: 145,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "GoodGirlFineLine",
          title: "good girl (fine line)",
          where: "a hip bone",
          desc: "tiny script and a tiny heart",
          sheet: 5,
          spot: "hip",
          left: 134,
          top: 525,
          w: 144,
          h: 47,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "MooTheHeart",
          title: "Moo (the heart)",
          where: "an upper arm",
          desc: "the classic MOM heart, for a cow",
          sheet: 6,
          spot: "shoulder",
          left: 140,
          top: 274,
          w: 84,
          h: 52,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "Swallows",
          title: "Swallows",
          where: "the chest",
          desc: "two swallows, for the girls who do",
          sheet: 6,
          spot: "chest",
          left: 154,
          top: 225,
          w: 192,
          h: 115,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "HoldStill",
          title: "Hold Still",
          where: "a forearm",
          desc: "the sailor's anchor, rope and all",
          sheet: 6,
          spot: "forearm",
          left: 140,
          top: 299,
          w: 80,
          h: 63,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "BrokenIn",
          title: "Broken In",
          where: "over the heart",
          desc: "a heart with a dagger through it",
          sheet: 6,
          spot: "heart",
          left: 228,
          top: 251,
          w: 108,
          h: 83,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "RopeHarness",
          title: "Rope Harness",
          where: "the chest and belly",
          desc: "a shibari harness that never comes off",
          sheet: 6,
          spot: "chest",
          left: 106,
          top: 188,
          w: 288,
          h: 189,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "ChainBand",
          title: "Chain Band",
          where: "round a thigh",
          desc: "a chain inked round, a padlock hangin' off it",
          sheet: 6,
          spot: "thigh",
          left: 130,
          top: 630,
          w: 156,
          h: 65,
          layers: [
            {
              name: "Ink",
              color: "#19151f",
              colorize: true
            }
          ]
        },
        {
          name: "Cuffs",
          title: "Cuffs",
          where: "wrists or ankles",
          desc: "leather cuffs inked on, D-ring and all",
          sheet: 6,
          spot: "wrist",
          left: 126,
          top: 331,
          w: 108,
          h: 39,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "UnzipForService",
          title: "Unzip For Service",
          where: "down the belly",
          desc: "a zipper inked down her front, half open",
          sheet: 6,
          spot: "belly",
          left: 140,
          top: 343,
          w: 221,
          h: 239,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "MaximumLoad",
          title: "Maximum Load",
          where: "the belly",
          desc: "an elevator plate: this cow has no limit",
          sheet: 6,
          spot: "belly",
          left: 158,
          top: 399,
          w: 184,
          h: 127,
          layers: [
            {
              name: "InkArt",
              color: null,
              colorize: false
            }
          ]
        },
        {
          name: "TearHere",
          title: "Tear Here",
          where: "on the panty line",
          desc: "a dotted line and scissors",
          sheet: 6,
          spot: "womb",
          left: 140,
          top: 489,
          w: 220,
          h: 78,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ]
        },
        {
          name: "FreeRange",
          title: "Free Range",
          where: "a shoulder",
          desc: "a green farm-shop sticker",
          sheet: 6,
          spot: "shoulder",
          left: 140,
          top: 258,
          w: 84,
          h: 84,
          layers: [
            {
              name: "Ink",
              color: "#3f8a2e",
              colorize: true
            }
          ]
        },
        {
          name: "ThornedCrest",
          title: "Thorned Crest",
          where: "over the womb, glowin'",
          desc: "a rose in a heart, thorny vines",
          sheet: 7,
          spot: "womb",
          left: 140,
          top: 483,
          w: 220,
          h: 91,
          layers: [
            {
              name: "Glow",
              color: "#ff4fd8",
              colorize: true
            },
            {
              name: "GlowInk",
              color: "#ff4fd8",
              colorize: true
            }
          ]
        },
        {
          name: "ButterflyCrest",
          title: "Butterfly Crest",
          where: "over the womb, glowin'",
          desc: "wings and a chain of hearts",
          sheet: 7,
          spot: "womb",
          left: 140,
          top: 452,
          w: 220,
          h: 153,
          layers: [
            {
              name: "Glow",
              color: "#ff4fd8",
              colorize: true
            },
            {
              name: "GlowInk",
              color: "#ff4fd8",
              colorize: true
            }
          ]
        },
        {
          name: "SuccubusCrest",
          title: "Succubus Crest",
          where: "over the womb, glowin'",
          desc: "horns, bat wings, a spade tail",
          sheet: 7,
          spot: "womb",
          left: 140,
          top: 460,
          w: 220,
          h: 137,
          layers: [
            {
              name: "Glow",
              color: "#ff4fd8",
              colorize: true
            },
            {
              name: "GlowInk",
              color: "#ff4fd8",
              colorize: true
            }
          ]
        },
        {
          name: "TribalCrest",
          title: "Tribal Crest",
          where: "over the womb, glowin'",
          desc: "tribal blades round a heart",
          sheet: 7,
          spot: "womb",
          left: 140,
          top: 473,
          w: 220,
          h: 110,
          layers: [
            {
              name: "Glow",
              color: "#ff4fd8",
              colorize: true
            },
            {
              name: "GlowInk",
              color: "#ff4fd8",
              colorize: true
            }
          ]
        },
        {
          name: "EggLayerCrest",
          title: "Egg-Layer Crest",
          where: "over the womb, glows with eggs in",
          desc: "a heart and a chain of eggs",
          sheet: 7,
          spot: "womb",
          left: 140,
          top: 465,
          w: 220,
          h: 127,
          layers: [
            {
              name: "Glow",
              color: "#ff4fd8",
              colorize: true
            },
            {
              name: "GlowInk",
              color: "#ff4fd8",
              colorize: true
            }
          ]
        },
        {
          name: "FarmPropertyCorrupted",
          title: "Farm Property (corrupted)",
          where: "where the parasite chose",
          desc: "its own words, veins creepin' out",
          sheet: 7,
          spot: "hip",
          left: 134,
          top: 497,
          w: 144,
          h: 103,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ]
        },
        {
          name: "RuinedStockCorrupted",
          title: "Ruined Stock (corrupted)",
          where: "a thigh",
          desc: "the corruption's own words",
          sheet: 7,
          spot: "thigh",
          left: 148,
          top: 605,
          w: 120,
          h: 114,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ]
        },
        {
          name: "FarmAnimalCorrupted",
          title: "Farm Animal (corrupted)",
          where: "the belly",
          desc: "the corruption's own words",
          sheet: 7,
          spot: "belly",
          left: 158,
          top: 387,
          w: 184,
          h: 151,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ]
        },
        {
          name: "BredCorrupted",
          title: "Bred (corrupted)",
          where: "low on the belly",
          desc: "one word, spreadin'",
          sheet: 7,
          spot: "womb",
          left: 140,
          top: 459,
          w: 220,
          h: 138,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ]
        }
      ],
      FarmBrand: [
        {
          name: "TentacleRingBrand",
          title: "Tentacle Ring Brand",
          where: "a thigh, seared",
          desc: "a tentacle in a ring: the pond had you",
          sheet: 2,
          spot: "thigh",
          left: 148,
          top: 602,
          w: 120,
          h: 120,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "MoonPawBrand",
          title: "Moon Paw Brand",
          where: "a hip, seared",
          desc: "a paw under a moon: the pack's",
          sheet: 2,
          spot: "hip",
          left: 134,
          top: 476,
          w: 144,
          h: 145,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "SnoutRingBrand",
          title: "Snout Ring Brand",
          where: "a butt cheek, seared",
          desc: "a snout in a ring",
          sheet: 2,
          spot: "hip",
          left: 134,
          top: 476,
          w: 144,
          h: 144,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "TheFarmsMark",
          title: "The Farm's Mark",
          where: "a hip or a butt cheek",
          desc: "the BB and its bell, seared in",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 472,
          w: 144,
          h: 153,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "TheBarnsBrand",
          title: "The Barn's Brand",
          where: "a thigh, seared",
          desc: "a lucky horseshoe round the BB",
          sheet: 3,
          spot: "thigh",
          left: 148,
          top: 617,
          w: 120,
          h: 91,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "TheKennelsBrand",
          title: "The Kennel's Brand",
          where: "a hip, seared",
          desc: "a bone in a ring, a paw cut through",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 476,
          w: 144,
          h: 144,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "RockingBb",
          title: "Rocking Bb",
          where: "a flank, seared",
          desc: "a cattle brand: the BB on a rocker",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 495,
          w: 144,
          h: 107,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "BreedingStock",
          title: "Breeding Stock",
          where: "across the ass, seared",
          desc: "iron letters in a frame",
          sheet: 3,
          spot: "hip",
          left: 134,
          top: 511,
          w: 144,
          h: 75,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "FreeUse",
          title: "Free Use",
          where: "a butt cheek, seared",
          desc: "an oval brand: no need to ask",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 504,
          w: 144,
          h: 89,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "CumHere",
          title: "Cum Here",
          where: "just above the slit, seared",
          desc: "the words and an arrow, burned in",
          sheet: 4,
          spot: "womb",
          left: 140,
          top: 454,
          w: 220,
          h: 149,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "MilkMe",
          title: "Milk Me",
          where: "above a breast, seared",
          desc: "an udder in a ring",
          sheet: 4,
          spot: "chest",
          left: 154,
          top: 186,
          w: 192,
          h: 192,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "StudService",
          title: "Stud Service",
          where: "a hip, seared",
          desc: "a knot in a ring, for the farm's studs",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 476,
          w: 144,
          h: 144,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "TripleXBar",
          title: "Triple X Bar",
          where: "a flank, seared",
          desc: "a cattle brand: rated for the rough stuff",
          sheet: 4,
          spot: "hip",
          left: 134,
          top: 504,
          w: 144,
          h: 89,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Hucow",
          title: "Hucow",
          where: "a flank, seared",
          desc: "horns and a muzzle",
          sheet: 6,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Mare",
          title: "Mare",
          where: "a flank, seared",
          desc: "a horseshoe; STALLION for studs",
          sheet: 6,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Bitch",
          title: "Bitch",
          where: "a hip, seared",
          desc: "a paw; STUD DOG for studs",
          sheet: 6,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Sow",
          title: "Sow",
          where: "a butt cheek, seared",
          desc: "a snout; BOAR for studs",
          sheet: 6,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Vixen",
          title: "Vixen",
          where: "a hip, seared",
          desc: "a brush of a tail",
          sheet: 6,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Bunny",
          title: "Bunny",
          where: "a hip, seared",
          desc: "ears up; BUCK for studs",
          sheet: 6,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Kitten",
          title: "Kitten",
          where: "a hip, seared",
          desc: "ears and whiskers; TOM for studs",
          sheet: 6,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Dragoness",
          title: "Dragoness",
          where: "a shoulder, seared",
          desc: "a wing",
          sheet: 6,
          spot: "shoulder",
          left: 141,
          top: 252,
          w: 83,
          h: 97,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Nanny",
          title: "Nanny",
          where: "a flank, seared",
          desc: "horns and a beard; BILLY for studs",
          sheet: 7,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Ewe",
          title: "Ewe",
          where: "a flank, seared",
          desc: "a curly fleece; RAM for studs",
          sheet: 7,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "SheWolf",
          title: "She-Wolf",
          where: "a hip, seared",
          desc: "ears up and a long muzzle",
          sheet: 7,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Doe",
          title: "Doe",
          where: "a hip, seared",
          desc: "big soft ears and a spotted brow; BUCK for studs",
          sheet: 7,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Rat",
          title: "Rat",
          where: "a shoulder, seared",
          desc: "round ears and a long tail",
          sheet: 7,
          spot: "shoulder",
          left: 141,
          top: 252,
          w: 83,
          h: 97,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        },
        {
          name: "Goblins",
          title: "Goblin's",
          where: "a butt cheek, seared",
          desc: "a goblin's ear, earring and all: their plunder",
          sheet: 7,
          spot: "hip",
          left: 135,
          top: 465,
          w: 142,
          h: 166,
          layers: [
            {
              name: "BrandEdge",
              color: "#5e1414",
              colorize: true
            },
            {
              name: "Brand",
              color: "#b4524a",
              colorize: true
            },
            {
              name: "BrandShine",
              color: "#f2b9a8",
              colorize: true
            }
          ]
        }
      ]
    },
    live: [
      {
        sheet: 1,
        title: "FARM PROPERTY"
      },
      {
        sheet: 1,
        title: "USED BY STRANGERS"
      },
      {
        sheet: 2,
        title: "TIMES BRED (keeps count)"
      },
      {
        sheet: 2,
        title: "LITTERS (keeps count)"
      },
      {
        sheet: 2,
        title: "LITRES MILKED (keeps count)"
      },
      {
        sheet: 2,
        title: "EGGS LAID (keeps count)"
      },
      {
        sheet: 2,
        title: "DAYS SINCE LAST ORGASM"
      },
      {
        sheet: 2,
        title: "OWNED BY (the crafter signs it)"
      },
      {
        sheet: 2,
        title: "STOCK NUMBER"
      },
      {
        sheet: 2,
        title: "LOCKED (keyholder's name)"
      },
      {
        sheet: 3,
        title: "BRED BY B&B"
      },
      {
        sheet: 3,
        title: "B&B EAR TAG"
      },
      {
        sheet: 4,
        title: "CUM TANK (keeps count)"
      },
      {
        sheet: 4,
        title: "BREEDING FACTS (keeps count)"
      },
      {
        sheet: 4,
        title: "LOADING (keeps count)"
      },
      {
        sheet: 4,
        title: "LIPSTICK KISSES"
      },
      {
        sheet: 4,
        title: "\u2605\u2605\u2605\u2605\u2605 WOULD BREED AGAIN"
      },
      {
        sheet: 5,
        title: "BRED BY (keeps count)"
      },
      {
        sheet: 5,
        title: "BREEDING CARD (keeps count)"
      },
      {
        sheet: 5,
        title: "TRAP PASSPORT (keeps count)"
      },
      {
        sheet: 5,
        title: "HIGH SCORES (keeps count)"
      },
      {
        sheet: 5,
        title: "TIED \xD77 (keeps count)"
      },
      {
        sheet: 6,
        title: "BRED ON"
      },
      {
        sheet: 7,
        title: "HEAT CREST (keeps count)"
      },
      {
        sheet: 7,
        title: "YOUR WORDS: blackletter"
      },
      {
        sheet: 7,
        title: "YOUR WORDS: script"
      },
      {
        sheet: 7,
        title: "YOUR WORDS: typewriter"
      },
      {
        sheet: 7,
        title: "YOUR WORDS: graffiti"
      }
    ]
  };

  // shared/ink/ink.js
  var INK_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v1/";
  var INK_SLOTS = ["FarmInk1", "FarmInk2", "FarmInk3", "FarmInk4"];
  var BRAND_SLOT = "FarmBrand";
  var SLOT_NAMES = { FarmInk1: "Farm Ink 1", FarmInk2: "Farm Ink 2", FarmInk3: "Farm Ink 3", FarmInk4: "Farm Ink 4", FarmBrand: "Farm Brand" };
  var RES = ink_designs_default.res || 1;
  var OURS = /\/ink[^/]*\/(?:v\d+\/)?Farm(?:Ink|Brand)\//;
  var PRIORITY = 11;
  var kindOf = (slot) => slot === BRAND_SLOT ? "FarmBrand" : /^FarmInk[1-4]$/.test(String(slot)) ? "FarmInk" : null;
  var TITLES = {};
  for (const kind of ["FarmInk", "FarmBrand"]) for (const a of ink_designs_default.groups[kind]) TITLES[kind + ":" + a.name] = a.title;
  function assetDef(a) {
    return {
      Name: a.name,
      Random: false,
      Value: 0,
      Left: a.left,
      Top: a.top,
      DefaultColor: a.layers.filter((l) => l.colorize).map((l) => l.color),
      PoseMapping: { AllFours: "Hide", Hogtied: "Hide" },
      // (the body's drawn another way in those: the ink would float)
      Layer: a.layers.map((l) => ({ Name: l.name, AllowColorize: !!l.colorize }))
    };
  }
  function groupDef(slot) {
    return {
      Group: slot,
      Priority: PRIORITY,
      Default: false,
      Random: false,
      BodyCosplay: true,
      Clothing: false,
      AllowNone: true,
      Color: ["Default"],
      Asset: ink_designs_default.groups[kindOf(slot)].map(assetDef)
    };
  }
  function describe(W12) {
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const G = W12.AssetGroupMap && W12.AssetGroupMap.get(slot);
      if (!G) continue;
      G.Description = SLOT_NAMES[slot];
      for (const A of G.Asset || []) {
        const t = TITLES[kindOf(slot) + ":" + A.Name];
        if (t) A.Description = t;
      }
    }
  }
  var gameReady = (W12) => typeof W12.AssetGroupAdd === "function" && typeof W12.AssetAdd === "function" && W12.AssetGroupMap && W12.AssetGroupMap.size > 30;
  function addSlots(W12) {
    if (W12.AssetGroupMap.has(INK_SLOTS[0])) {
      describe(W12);
      return false;
    }
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const def = groupDef(slot), G = W12.AssetGroupAdd("Female3DCG", def);
      for (const a of def.Asset) W12.AssetAdd(G, a, W12.AssetFemale3DCGExtended || {}, def);
    }
    describe(W12);
    return true;
  }
  function registerInk(W12, mod2) {
    if (W12.__farmInk) return W12.__farmInk;
    const st2 = W12.__farmInk = { ready: false, slots: [...INK_SLOTS, BRAND_SLOT], designs: ink_designs_default.groups.FarmInk.length + ink_designs_default.groups.FarmBrand.length, live: ink_designs_default.live.length };
    const hooks = () => {
      const hook = (name, pri, fn) => {
        try {
          if (typeof W12[name] === "function") mod2.hookFunction(name, pri, fn);
          else console.warn("[Farm ink] the game has no " + name);
        } catch (e) {
          console.warn("[Farm ink] couldn't hook " + name, e);
        }
      };
      hook("AssetBaseURL", 0, (args, next) => {
        const kind = kindOf(args[2] || args[1] && args[1].Name);
        return kind ? INK_HOST + kind + "/" : next(args);
      });
      hook("AssetGetPreviewPath", 0, (args, next) => {
        const A = args[0], kind = A && A.Group && kindOf(A.Group.Name);
        return kind ? INK_HOST + kind + "/Preview" : next(args);
      });
      hook("AssetBuildDescription", 0, (args, next) => {
        const r = next(args);
        try {
          describe(W12);
        } catch (e) {
        }
        return r;
      });
      if (RES !== 1) hook("CommonDrawAppearanceBuild", 0, (args, next) => {
        const cb = args[1];
        if (!cb || typeof cb !== "object") return next(args);
        const wrap = (f) => typeof f !== "function" ? f : function(src, x, y, o) {
          if (typeof src === "string" && OURS.test(src)) {
            o = Object.assign({}, o);
            o.ScaleX = (o.ScaleX == null ? 1 : o.ScaleX) / RES;
            o.ScaleY = (o.ScaleY == null ? 1 : o.ScaleY) / RES;
          }
          return f.call(this, src, x, y, o);
        };
        return next([args[0], Object.assign({}, cb, { drawImage: wrap(cb.drawImage), drawImageBlink: wrap(cb.drawImageBlink), drawImageColorize: wrap(cb.drawImageColorize), drawImageColorizeBlink: wrap(cb.drawImageColorizeBlink) }), ...args.slice(2)]);
      });
      hook("AssetLoadAll", 0, (args, next) => {
        const r = next(args);
        try {
          addSlots(W12);
        } catch (e) {
          console.warn("[Farm ink] couldn't add the slots again", e);
        }
        return r;
      });
    };
    const t = setInterval(() => {
      if (!gameReady(W12)) return;
      clearInterval(t);
      try {
        hooks();
        addSlots(W12);
        st2.ready = true;
      } catch (e) {
        console.warn("[Farm ink] couldn't add the slots", e);
      }
    }, 50);
    return st2;
  }

  // dispensary/src/index.js
  var import_bondage_club_mod_sdk = __toESM(require_bcmodsdk(), 1);

  // dispensary/src/version.js
  var VERSION = "0.3.0";

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
  var fresh = () => ({
    v: 1,
    who: DEFAULT_RUNG,
    clock: "online",
    penalty: PENALTY,
    off: {},
    doses: {},
    farm: [],
    farmAt: 0,
    seen: 0,
    stock: false,
    hard: { on: false, log: [] },
    wards: {},
    keys: [],
    species: "",
    speciesFarm: "",
    screen: true,
    tolerance: false,
    cravings: 0,
    taken: {},
    later: [],
    tenderSpot: ""
  });
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
        if (typeof x.p === "string" && /^[a-z]{2,12}$/.test(x.p)) o.p = x.p;
        s.doses[k] = o;
      }
    }
    s.tolerance = d.tolerance === true;
    s.cravings = num(d.cravings, 0, 1e14, 0);
    if (typeof d.tenderSpot === "string" && /^[a-z]{2,12}$/.test(d.tenderSpot)) s.tenderSpot = d.tenderSpot;
    if (d.taken && typeof d.taken === "object") {
      for (const [k, list] of Object.entries(d.taken).slice(0, 40)) {
        if (!/^[a-z]{2,20}$/.test(k) || !Array.isArray(list)) continue;
        const l = list.filter((t) => typeof t === "number" && isFinite(t) && t > 0).slice(-20);
        if (l.length) s.taken[k] = l;
      }
    }
    if (Array.isArray(d.later)) {
      s.later = d.later.filter((c) => c && typeof c === "object" && /^[a-z]{2,20}$/.test(c.id)).slice(0, 5).map((c) => {
        const o = { id: c.id, x: Math.round(num(c.x, 1, 5, 1)), by: Math.round(num(c.by, 0, 1e9, 0)) };
        if (typeof c.p === "string" && /^[a-z]{2,12}$/.test(c.p)) o.p = c.p;
        if (typeof c.fire === "number") o.fire = num(c.fire, 0, 1e14, 0);
        else o.in = num(c.in, 0, 6 * 36e5, 0);
        return o;
      });
    }
    if (Array.isArray(d.farm)) s.farm = d.farm.filter((m) => Number.isInteger(m) && m > 0).slice(0, 300);
    s.farmAt = num(d.farmAt, 0, 1e14, 0);
    s.seen = num(d.seen, 0, 1e14, 0);
    s.stock = d.stock === true;
    if (typeof d.species === "string" && /^[a-z]{2,12}$/.test(d.species)) s.species = d.species;
    if (typeof d.speciesFarm === "string" && /^[a-z]{2,20}$/.test(d.speciesFarm)) s.speciesFarm = d.speciesFarm;
    s.screen = d.screen !== false;
    if (Array.isArray(d.keys)) s.keys = [...new Set(d.keys.filter((m) => Number.isInteger(m) && m > 0 && m < 1e9))].slice(0, 10);
    if (d.hard && typeof d.hard === "object") {
      const H = d.hard;
      s.hard = {
        on: H.on === true,
        since: num(H.since, 0, 1e14, 0),
        until: num(H.until, 0, 1e14, 0),
        checkAt: num(H.checkAt, 0, 1e14, 0),
        log: Array.isArray(H.log) ? H.log.filter((l) => l && typeof l === "object").slice(-50).map((l) => ({ t: num(l.t, 0, 1e14, 0), by: Math.round(num(l.by, 0, 1e9, 0)), what: String(l.what || "").slice(0, 200) })) : []
      };
    }
    if (d.wards && typeof d.wards === "object") {
      for (const [k, x] of Object.entries(d.wards).slice(0, 50)) {
        if (!/^\d{1,9}$/.test(k) || !x || typeof x !== "object") continue;
        s.wards[k] = { name: String(x.name || "").slice(0, 40), until: num(x.until, 0, 1e14, 0), due: num(x.due, 0, 1e14, 0), seen: num(x.seen, 0, 1e14, 0), checked: num(x.checked, 0, 1e14, 0), asked: num(x.asked, 0, 1e14, 0) };
      }
    }
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
  Object.assign(LINES, {
    hairtrigger: {
      take: [
        "%t jumps as the sensitizer goes in. Even the air feels like a touch now.",
        "Every nerve in %t lights up at once. A brush of fabric makes them gasp.",
        "%t shivers all over. Whatever comes next is goin' to hit twice as hard, and they know it.",
        "The serum spreads warm under %t's skin, and suddenly every inch of it is listenin'."
      ],
      now: [
        "Your clothes shift and you nearly whimper. Everything's too much, and you can't stop wantin' more of it.",
        "A breath of air across your skin and your knees go weak. The serum's still got every nerve wide awake.",
        "You hold very, very still. Moving at all feels like being touched.",
        "Somebody brushes past and your whole body answers. You bite your lip to keep quiet."
      ],
      off: [
        "The Hair Trigger fades. Your skin is just skin again, and a touch is just a touch.",
        "The buzzing under your skin quiets down. You can breathe without it feelin' like a caress."
      ]
    }
  });
  var NOTES = {
    notListed: "%b tried to give you %d, but they're not on your list, so nothin' happened.",
    switchedOff: "%d came your way, but you've switched it off, so nothin' happened.",
    safeword: "Safeword: every dose in you is lifted. You're clear.",
    lscgOff: "%d came your way, but it's switched off in LSCG's Drug Enhancements, so LSCG let it pass. Switch it on there if you want it."
  };

  // dispensary/src/lines-more.js
  Object.assign(LINES, {
    letdown: {
      take: [
        "%t gasps and cups their chest as it hits. Somethin' warm swells up behind each nipple, achin' to get out.",
        "The tonic goes straight to %t's tits. They go heavy and tight, and the first warm bead slips out before they can stop it.",
        "%t's nipples stiffen and darken as the let-down takes. A slow, sweet ache fills both breasts right up.",
        "It hits %t like the stall's pump just switched on: a warm rush, a tingle, and then the leakin' starts.",
        "%t feels their chest fill, heavy and warm. Two damp spots are already bloomin' through their top.",
        "%t's breath hitches. They can feel it risin' in them, full and warm, with nowhere to go but out."
      ],
      now: [
        "Two fresh wet spots spread across %t's top. They're leakin' again.",
        "A warm drip runs down %t's belly from one achin' nipple.",
        "%t's chest twinges and lets down all at once. Their top's soaked through at the tips now.",
        "%t crosses their arms over their chest. It doesn't stop the drip.",
        "A milky bead swells on %t's nipple, hangs there a moment, and falls.",
        "%t's tits feel fuller by the minute, and they're leakin' to prove it.",
        "Somebody only has to glance at %t's chest and it lets down again, warm and wet and impossible to hide."
      ],
      off: [
        "The ache in your chest eases off. The leakin' slows to nothin', and you're left damp and a little tender.",
        "The Let-Down's worn off. Your top's still wet, but nothin' new is comin'.",
        "Your tits settle and stop leakin'. Somebody might want to fetch you a dry top."
      ]
    },
    // Fill-Out: which part swells is on the bottle ("Fill-Out (belly)"), the cup if it doesn't say
    fillout_cup: {
      take: [
        "%t's top goes tight all at once. Their tits swell up and out, a cup size, then another, and keep on goin'.",
        "%t looks down as their chest fills out, round and heavy, strainin' every seam they've got.",
        "Warmth floods into %t's breasts and they plump up under it, fuller and rounder by the second.",
        "%t's buttons creak. Their tits are swellin', soft and heavy, and there's no stoppin' it.",
        "%t gasps as their chest blooms outward. Their bra gives up first."
      ],
      now: [
        "%t's chest is still swollen full and heavy. Every step makes it bounce.",
        "%t tugs at their top. It isn't built for what it's holdin' right now.",
        "%t's tits feel tight and warm and far too big. Somebody's starin'.",
        "%t tries to see their own feet. There's too much in the way."
      ],
      off: [
        "Your chest slowly settles back down to its own size. Your top can breathe again.",
        "The Fill-Out's done. Your tits shrink back to where they were, a little tender for the trip."
      ]
    },
    fillout_belly: {
      take: [
        "%t's belly rounds out under their hands, swellin' soft and taut like they've been bred full.",
        "A warm pressure blooms low in %t's belly, and it grows: rounder, tighter, heavier.",
        "%t's tummy pushes out against their clothes. They look a few months along and countin'.",
        "%t sways as their belly fills out, heavy and round and impossible to hide.",
        "%t presses a hand to their middle and feels it swell up to meet it."
      ],
      now: [
        "%t rubs their swollen belly. It's still round and tight and warm.",
        "%t's belly sloshes when they shift. It's still filled right out.",
        "Every time %t moves, that round belly gets in the way.",
        "%t's waistband has given up. The belly's won."
      ],
      off: [
        "Your belly slowly flattens back down. The tight, full feelin' fades with it.",
        "The Fill-Out's worn off. Your tummy's your own size again."
      ]
    },
    fillout_ass: {
      take: [
        "%t yelps as their ass plumps up, round and soft and suddenly far too big for what they're wearin'.",
        "Warmth spreads through %t's hips and rear, and it all swells: wider, rounder, heavier.",
        "%t's hips fill out with a jiggle. Their clothes are holdin' on for dear life back there.",
        "%t looks over their shoulder and finds a whole lot more of themselves than there was a moment ago."
      ],
      now: [
        "%t's swollen rear sways with every step. Nobody's lookin' anywhere else.",
        "%t tries to sit and finds there's a lot more of them to sit on.",
        "%t's hips bump the furniture. They've not got used to the width yet."
      ],
      off: [
        "Your hips and ass slowly settle back down. Your clothes fit again.",
        "The Fill-Out's done with your rear. It shrinks back, one jiggle at a time."
      ]
    },
    airhead: {
      take: [
        "%t blinks, slow and sweet, as the elixir takes. Whatever they were thinkin' about just sort of... floats off.",
        "A pink, bubbly fog rolls into %t's head. They giggle, and can't remember why.",
        "%t's eyes go big and soft. Thinkin' feels like a lot of work all of a sudden. Smilin' doesn't.",
        "%t twirls a bit of hair round one finger without meanin' to. The elixir's got them, like, totally.",
        "Every serious thought in %t's head pops like a bubble. What's left is warm and giggly and empty."
      ],
      now: [
        "%t loses their train of thought halfway through and just... giggles.",
        "%t stares at nothin' for a long, happy moment, then remembers they were doin' somethin'.",
        "%t twirls their hair and hums. Nobody's home, and it's lovely in there.",
        "%t starts to say somethin' clever, frowns, and gives up with a giggle.",
        "%t's head tilts, all soft and empty. What were we talkin' about?",
        "%t counts on their fingers, gets to three, and decides that's plenty."
      ],
      off: [
        "The pink fog thins out. Your thoughts come back one at a time, a bit embarrassed about where they've been.",
        "The Airhead Elixir's worn off. Big words come back. So does rememberin' what you said.",
        "You blink, and your head's clear. That was, like... no. That was a lot."
      ]
    },
    babble: {
      take: [
        "%t swallows, and their tongue starts to tingle. Somethin' filthy is waitin' right behind their teeth.",
        "The brew goes down warm and their mouth goes loose. %t has a feelin' they're about to say somethin' they shouldn't.",
        "%t's lips buzz. Every word they reach for, a dirtier one gets there first.",
        "%t clamps their mouth shut as it takes. It won't help for long.",
        "%t licks their lips. They taste of somethin' sweet and rude."
      ],
      now: [
        "%t opens their mouth to say somethin' polite. It doesn't come out polite.",
        "%t goes red to the ears. They definitely didn't mean to say that out loud.",
        "%t bites their lip hard, tryin' to keep the next one in.",
        "%t covers their mouth with both hands. Somethin' filthy still leaks out between their fingers.",
        "%t starts a sentence, hears where it's headed, and stops dead."
      ],
      off: [
        "Your tongue stops tinglin'. Words come out the way you meant them again. Mostly.",
        "The Babble Brew's worn off. Your mouth is your own again, for what that's worth after the last while."
      ]
    },
    deepthroat: {
      take: [
        "%t's throat goes warm and loose as the drops take. Swallowin' feels easy. Everything feels easy.",
        "A tingle slides down the back of %t's throat and everything there just... relaxes. No gag, no fight.",
        "%t opens and closes their mouth, testin'. The back of their throat feels soft and open and wantin'.",
        "The drops numb the fight right out of %t's throat. Whatever goes in there now is goin' all the way.",
        "%t swallows once, twice, and finds nothin' stops it. Their throat's wide open."
      ],
      now: [
        "%t swallows slow and easy. Their throat's still loose and waitin'.",
        "%t's mouth hangs a little open. It's hard to remember why they'd ever close it.",
        "%t licks their lips. Their throat feels open, soft and ready.",
        "%t keeps swallowin' on nothin'. Their throat wants somethin' in it."
      ],
      used: [
        "It slides right down. No gag, no fight, just your throat takin' it.",
        "Your throat opens up and lets it in, easy as anything.",
        "Deeper than you'd ever manage on your own, and you don't even choke.",
        "All the way down, and your throat just holds it there, soft and willin'."
      ],
      off: [
        "The tingle in your throat fades. Your gag reflex comes back, and with it, a little sense.",
        "The Deep Throat Drops wear off. Your throat remembers how to say no."
      ]
    },
    rut: {
      take: [
        "%t's breath goes ragged as the rut takes. Heat pours straight down between their legs and stays there.",
        "Somethin' wild and hungry wakes up in %t. Their eyes go dark and fix on the nearest warm body.",
        "%t growls before they can stop it. They're hot and achin' and dyin' to breed somethin'.",
        "The rut hits %t like a kick. Every thought they had narrows down to one.",
        "%t's heart pounds. They're ready, and they're goin' to stay ready."
      ],
      now: [
        "%t paces like a stud in a pen, all heat and want.",
        "%t's eyes follow every hip that sways past.",
        "%t is achin' again already. The rut doesn't let 'em rest long.",
        "%t's breathin' heavy, flushed and restless, sniffin' the air.",
        "A low, needy grunt slips out of %t. The rut's still ridin' them."
      ],
      again: [
        "Barely done, and the rut's got you achin' for more already.",
        "You've hardly caught your breath, and you're ready again.",
        "Spent, for about a heartbeat. Then the rut hauls you right back up.",
        "It should be over. The rut says otherwise."
      ],
      off: [
        "The rut burns itself out. The hunger fades, and you're left wrung out and very, very satisfied.",
        "The Rut's worn off. You can think about somethin' besides breedin' again. Mostly."
      ]
    },
    tender: {
      take: [
        "Warmth gathers in %t's %s and stays there. The lightest touch there is goin' to feel like three.",
        "The drops soak into %t's %s, hot and tingly. They can feel their own pulse there now.",
        "%t shivers as it takes. All the feelin' in them just pooled in their %s.",
        "It sinks into %t's %s, soft and warm. Anybody who touches them there is goin' to find out how much."
      ],
      now: [
        "The ache in your %s throbs, warm and tender. Even your clothes brushin' there is a lot.",
        "You can't stop thinkin' about your %s. One touch there and you'd melt.",
        "Every move you make, that tingle in your %s answers."
      ],
      touched: [
        "A touch on your %s, and it hits three times over. Your knees nearly give.",
        "Right there on your tender %s. You can't help the noise you make.",
        "That one touch on your %s goes through you like a bell.",
        "Your %s, of all places. It's too much, and you want more of it."
      ],
      off: [
        "The tenderness in your %s fades. A touch there is just a touch again.",
        "The Tender drops have worn off, and your %s can take a touch again without you meltin'."
      ]
    },
    // a time-release capsule: given now, goes off later
    later: {
      set: [
        "%t feels the capsule settle somewhere deep inside. Nothin' yet. They'll have to wait and see.",
        "The needle leaves somethin' small and slow behind in %t. It'll go off when it's good and ready.",
        "%t braces for it to hit. It doesn't. Not yet.",
        "Just a little pinch, and then nothin'. Whatever's in %t is takin' its sweet time."
      ],
      fire: [
        "Somethin' gives way inside %t without warnin': the capsule's finally cracked open.",
        "%t jolts. The capsule they'd half forgot about just burst, all at once.",
        "Out of nowhere, %t's knees wobble. That slow capsule's gone off.",
        "%t stops mid-step. There it is. It took its time, and now it's all comin' at once."
      ]
    },
    // cravings (only if you switched them on): now and then, while nothin's in you
    crave: {
      want: [
        "Your arm itches right where the needle usually goes.",
        "You catch yourself thinkin' about %d again. Just a little one wouldn't hurt.",
        "Everything feels a bit flat without somethin' in you.",
        "You find yourself lookin' round for whoever's holdin' the needles.",
        "A little %d would really take the edge off right now.",
        "You can almost taste it. %d. You know exactly who you'd ask."
      ]
    }
  });
  var TOLERANCE_NOTE = "Your body's gettin' used to %d: this one only takes %p% as long.";

  // shared/potion-voice.js
  var POTION_VOICE = {
    needy: {
      seen: [
        "%n drinks the Needy Nectar, and within a minute they're rubbing their thighs together and biting their lip.",
        "The Needy Nectar blooms in %n's belly, and they start squirmin' against whatever they're sitting on.",
        "%n finishes the Needy Nectar and goes pink and fidgety. Their hands keep drifting down and getting caught halfway.",
        "One sip of Needy Nectar and %n is leaning on things, pressing on things, aching for things. They might have to ask nicely."
      ],
      now: [
        "The ache doesn't let up. Every shift of your hips makes it worse, and better, and worse.",
        "You catch yourself rubbin' your thighs together and can't make yourself stop.",
        "Every brush of fabric, every breeze through the barn, goes straight between your legs.",
        "You'd beg. You'd beg anybody. The thought won't leave you alone.",
        "It throbs, slow and patient and merciless, like it's got all day.",
        "%n can't keep their hips still. They're grindin' against nothin', pantin' through their nose.",
        "%n's pussy is soaked and swollen and so needy they'd climb anybody who stood still long enough.",
        "%n keeps lookin' at every hand on the farm like it might be the one that finally helps.",
        "A thin string of wet slides down the inside of %n's thigh. They don't even notice anymore."
      ],
      off: [
        "The ache finally fades to a dull, sticky throb. You're soaked, and you know it."
      ]
    },
    hiccup: {
      seen: [
        "%n drinks a Hiccup Fizz. *Hic.* They try to look dignified. *Hic.*",
        "The Hiccup Fizz goes down bubbly, and %n hiccups so hard their whole body jumps.",
        "%n downs a Hiccup Fizz and hiccups through an apology. Then hiccups through the apology for the hiccup.",
        "One Hiccup Fizz later, %n can't get through a sentence. Or a moan. *Hic.*"
      ],
      now: [
        "%n lets out a loud *hic*, right in the middle of everything.",
        "*HIC.* %n claps a hand over their mouth. Too late.",
        "%n tries so hard to hold it in that the *hic* comes out as a squeak.",
        "Three little *hics* in a row out of %n. The whole pen is grinnin'."
      ],
      off: [
        "One last *hic*, and the Hiccup Fizz is spent."
      ]
    },
    feather: {
      seen: [
        "%n drinks a Featherlight and shrieks with laughter when their own sleeve brushes their arm.",
        "The Featherlight goes down, and suddenly %n can't stand still: every breeze, every touch, sets them giggling.",
        "%n swallows a Featherlight and dissolves into helpless giggles the second anybody breathes near their neck.",
        "One Featherlight, and %n squirms at the brush of their own hair. Anyone with a feather is very much invited."
      ],
      now: [
        "A stray bit of straw brushes %n's side and they dissolve into helpless giggles.",
        "%n squeaks and twists away from absolutely nothin'. The air tickled 'em.",
        "Somebody breathes near %n's neck and they nearly fall over laughin'."
      ],
      off: [
        "Your skin stops tinglin'. The next breeze is just a breeze."
      ]
    },
    heatmist: {
      seen: [
        "%n breathes in the Heat Mist and goes flushed and slick and squirmy all at once.",
        "One puff of Heat Mist, and %n's scent changes. Every stud in the yard lifts his head.",
        "%n inhales the Heat Mist, shivers, and starts rubbing against the nearest post like a mare in season.",
        "The Heat Mist settles on %n like a warm hand, and they come into heat right there in front of everybody."
      ],
      now: [
        "%n's skin is pink and hot, and they can't stop squeezin' their thighs together.",
        "The heat's got %n swayin' their hips without meanin' to, presentin' to anyone in reach.",
        "%n smells like heat, sweet and thick, and the studs nearby have noticed."
      ],
      off: [
        "The heat mist burns off, leavin' you damp and dazed."
      ]
    },
    moo: {
      seen: [
        "%n drinks the Moo Juice, opens their mouth to say thank you, and lows like a heifer at feeding time.",
        "One bottle of Moo Juice later, %n tries to complain. What comes out is a long, mournful mooooo.",
        "%n swallows the Moo Juice and claps a hand over their mouth. Too late: the moo's out, and everyone heard it.",
        "The Moo Juice goes down, and %n's next three words are all the same word, and that word is moo."
      ],
      now: [
        "%n opens their mouth to argue and a long, low moo rolls out instead.",
        "Every word %n tries comes out as somethin' a cow would say. They've stopped tryin'."
      ],
      off: [
        "Your words come back. The first one you say is still a little bit of a moo."
      ]
    },
    bitterroot: {
      seen: [
        "%n gags on a Bitterroot and glares at the bottle. Everything that was building in 'em just went sour.",
        "A swig of Bitterroot, and %n's face scrunches up. Whatever pleasure's comin' their way for the next half hour, it's comin' ruined.",
        "%n swallows the Bitterroot like medicine. Then their thighs press together, and they whimper, because now it aches and it won't pay out.",
        "The Bitterroot goes down mean. %n squirms, already frustrated, and they haven't even been touched yet."
      ],
      now: [
        "%n's thighs are slick and tremblin', and the Bitterroot won't let 'em anywhere near the edge.",
        "Every time %n gets close the heat just drains away, mean and sudden. They whine through their teeth.",
        "%n squirms, desperate, achin', and absolutely nothin' they do is gonna be enough.",
        "The Bitterroot's got %n wound tight and leakin', ruined before they even start."
      ],
      off: [
        "The Bitterroot loosens its grip, slow and grudgin'. You can cum again, if you can still remember how.",
        "That mean, bitter knot finally unties. Go on. Somebody finish what it wouldn't let you."
      ]
    }
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

  // dispensary/src/later.js
  var MIN = 6e4;
  var DAY = 864e5;
  var LATER_WORDS = /\b(time[- ]?release\w*|slow[- ]?release\w*|delayed|capsules?)\b/;
  var isLater = (text) => LATER_WORDS.test(String(text || "").toLowerCase());
  var LATER_MAX = 5;
  var FUSE_MINS = [5, 40];
  var CRAVE_AFTER = 6;
  var CRAVE_DAYS = 3;
  var CRAVE_EVERY = [20, 40];
  function queue(id, o) {
    o = o || {};
    const S2 = st();
    if (!BOOK[id] || BOOK[id].instant || S2.off[id]) return false;
    if (S2.later.length >= LATER_MAX) return false;
    const fuse = (FUSE_MINS[0] + Math.random() * (FUSE_MINS[1] - FUSE_MINS[0])) * MIN;
    const c = { id, x: Math.max(1, Math.min(5, Math.round(Number(o.x) || 1))), by: Number(o.by) || 0 };
    if (o.p) c.p = String(o.p);
    if (S2.clock === "real") c.fire = Date.now() + fuse * (1 + S2.penalty / 100);
    else c.in = fuse;
    S2.later.push(c);
    save();
    if (!o.quiet) action(fill(pick(LINES.later.set)));
    return true;
  }
  var lastAt = 0;
  var craveNext = 0;
  function laterTick() {
    const S2 = st(), now = Date.now(), gap = lastAt ? Math.max(0, Math.min(now - lastAt, 15e3)) : 0;
    lastAt = now;
    let changed = false;
    for (const c of S2.later) if (typeof c.fire !== "number") {
      c.in = Math.max(0, (c.in || 0) - gap);
    }
    if (inRoom()) {
      const due = S2.later.filter((c) => typeof c.fire === "number" ? c.fire <= now : c.in <= 0);
      for (const c of due) {
        S2.later.splice(S2.later.indexOf(c), 1);
        changed = true;
        action(fill(pick(LINES.later.fire)));
        give(c.id, { by: c.by, x: c.x, p: c.p, later: true });
      }
    }
    if (changed) save();
    craveTick(now);
  }
  function since() {
    const S2 = st(), from = Math.max(S2.cravings || 0, Date.now() - CRAVE_DAYS * DAY), out = {};
    for (const [id, list] of Object.entries(S2.taken || {})) {
      const n = list.filter((t) => t >= from).length;
      if (n) out[id] = n;
    }
    return out;
  }
  var ours = (id) => {
    const B = BOOK[id];
    return !!B && !B.instant && !st().off[id] && !(B.lscg && lscgPresent()) && !B.lscgOnly;
  };
  function craving() {
    const S2 = st();
    if (!S2.cravings) return "";
    const n = since(), total = Object.values(n).reduce((a, b) => a + b, 0);
    if (total < CRAVE_AFTER || doseIds().some(active)) return "";
    const fav = Object.keys(n).filter(ours).sort((a, b) => n[b] - n[a])[0];
    return fav || "";
  }
  function craveTick(now) {
    const want = craving();
    if (!want) {
      craveNext = 0;
      return;
    }
    if (!craveNext) {
      craveNext = now + CRAVE_EVERY[0] / 2 * MIN;
      return;
    }
    if (now < craveNext || !inRoom()) return;
    craveNext = now + (CRAVE_EVERY[0] + Math.random() * (CRAVE_EVERY[1] - CRAVE_EVERY[0])) * MIN;
    local(fill(pick(LINES.crave.want), { dose: BOOK[want].label }));
  }
  function craveSoon() {
    craveNext = 1;
  }

  // dispensary/src/needle.js
  var W4 = window;
  var botHere = () => (W4.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var charOf = (mn) => (W4.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || (W4.Player && W4.Player.MemberNumber === mn ? W4.Player : null);
  function craftText(item) {
    if (!item || !item.Craft) return "";
    let d = item.Craft.Description || "";
    try {
      if (W4.CraftingDescription && typeof W4.CraftingDescription.Decode === "function") d = W4.CraftingDescription.Decode(d);
    } catch (e) {
    }
    return ((item.Craft.Name || "") + " | " + d).toLowerCase();
  }
  var handOf = (C) => C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemHandheld") : null;
  var handTextOf = (mn) => craftText(handOf(charOf(mn)));
  function factsOf(data, sender) {
    try {
      if (typeof W4.ChatRoomMessageRunExtractors === "function") {
        const m = W4.ChatRoomMessageRunExtractors(data, sender).metadata;
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
    const text = craftText(item), list = dosesIn(text), at = Date.now(), done = [], later = isLater(text);
    for (const { id, x, p } of list) {
      const B = BOOK[id];
      if (B.farm && botHere()) continue;
      if (B.lscg && lscgPresent()) continue;
      if (!allowed(by)) {
        local(fill(NOTES.notListed, { by: nameOf(by), dose: B.label }));
        continue;
      }
      const go = () => {
        if (later && !B.instant) {
          if (st().off[id]) {
            local(fill(NOTES.switchedOff, { dose: B.label }));
            return { ok: false, why: "off" };
          }
          return { ok: queue(id, { by, x, p }), later: true };
        }
        const r = give(id, { by, x, p });
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
          const data = args[0], P = W4.Player;
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

  // dispensary/src/hardcore.js
  var W5 = window;
  var DAY2 = 864e5;
  var CHECK_DAYS = 30;
  var me = () => W5.Player && W5.Player.MemberNumber || 0;
  var here = (mn) => (W5.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn);
  var who = (mn) => here(mn) ? nameOf(mn) : "#" + mn;
  var onChange = () => {
  };
  function onHardChange(f) {
    onChange = f;
  }
  var hardOn = () => !!(st().hard && st().hard.on);
  function keyholders() {
    const P = W5.Player, out = [];
    const own = P && P.Ownership && P.Ownership.MemberNumber;
    if (typeof own === "number" && own > 0 && own !== me()) out.push(own);
    if (st().stock) {
      for (const m of PROPRIETORS) if (m !== me() && !out.includes(m)) out.push(m);
    }
    for (const m of st().keys || []) if (m !== me() && !out.includes(m)) out.push(m);
    return out;
  }
  var MAX_KEYS = 10;
  function addKey(mn) {
    mn = Math.round(Number(mn));
    if (hardOn()) return { ok: false, why: "locked" };
    if (!Number.isInteger(mn) || mn <= 0 || mn >= 1e9) return { ok: false, why: "number" };
    if (mn === me()) return { ok: false, why: "self" };
    const S2 = st();
    S2.keys = S2.keys || [];
    if (S2.keys.includes(mn) || keyholders().includes(mn)) return { ok: false, why: "already" };
    if (S2.keys.length >= MAX_KEYS) return { ok: false, why: "full" };
    S2.keys.push(mn);
    save();
    onChange();
    return { ok: true };
  }
  function removeKey(mn) {
    if (hardOn()) return { ok: false, why: "locked" };
    const S2 = st(), i = (S2.keys || []).indexOf(Number(mn));
    if (i < 0) return { ok: false, why: "none" };
    S2.keys.splice(i, 1);
    save();
    onChange();
    return { ok: true };
  }
  var companion = () => {
    try {
      const C = W5.FarmhandCompanion;
      return C && typeof C.hardPrefs === "function" ? C : null;
    } catch (e) {
      return null;
    }
  };
  var isKey = (mn) => typeof mn === "number" && keyholders().includes(mn);
  function dueAt() {
    const H = st().hard || {};
    return H.until ? H.until : (H.checkAt || H.since || Date.now()) + CHECK_DAYS * DAY2;
  }
  function log(by, what) {
    const H = st().hard;
    H.log = (H.log || []).concat({ t: Date.now(), by, what: String(what).slice(0, 200) }).slice(-50);
  }
  var hardLog = () => (st().hard && st().hard.log || []).slice();
  function sendTo(mn, type, data) {
    try {
      if (here(mn) && typeof W5.ServerSend === "function") {
        W5.ServerSend("ChatRoomChat", makeMsg(type, data, mn));
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  function beepTo(mn, text) {
    try {
      if (typeof W5.ServerSend === "function") {
        W5.ServerSend("AccountBeep", { MemberNumber: mn, BeepType: "", Message: String(text).slice(0, 900) });
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  function announce() {
    const H = st().hard || {}, keys = keyholders();
    for (const k of keys) sendTo(k, "dispHard", { on: hardOn(), until: H.until || 0, due: hardOn() ? dueAt() : 0, keys, name: W5.Player && (W5.Player.Nickname || W5.Player.Name) || "" });
  }
  function lock(days) {
    if (hardOn()) return { ok: false, why: "on" };
    if (!keyholders().length) return { ok: false, why: "nokey" };
    const now = Date.now(), d = Math.max(0, Math.min(CHECK_DAYS, Math.round(Number(days) || 0)));
    st().hard = { on: true, since: now, until: d ? now + d * DAY2 : 0, checkAt: now, log: st().hard && st().hard.log || [] };
    log(me(), d ? "locked in for " + d + " day" + (d === 1 ? "" : "s") : "locked in, no end date");
    save(true);
    announce();
    onChange();
    return { ok: true };
  }
  function unlock(by, why) {
    if (!hardOn()) return false;
    const H = st().hard;
    H.on = false;
    H.until = 0;
    log(by, "hardcore off: " + why);
    save(true);
    announce();
    onChange();
    local("\u{1F513} Hardcore's off (" + why + "). Your settings are yours again, and so is your safeword.");
    return true;
  }
  function checkIn(by) {
    if (!hardOn() || !isKey(by)) return false;
    const H = st().hard, now = Date.now(), last = H.checkAt || 0;
    H.checkAt = now;
    if (now - last > DAY2) log(by, "checked in");
    save();
    onChange();
    return true;
  }
  function tickHard() {
    if (!hardOn()) return;
    const H = st().hard, now = Date.now();
    if (H.until && now >= H.until) unlock(me(), "the end date came");
    else if (!H.until && now - (H.checkAt || H.since || now) >= CHECK_DAYS * DAY2) unlock(0, CHECK_DAYS + " days without a keyholder checkin' in");
  }
  var askedAt = 0;
  function askOut() {
    const now = Date.now(), keys = keyholders(), name = W5.Player && (W5.Player.Nickname || W5.Player.Name) || "Somebody";
    if (now - askedAt < 5 * 6e4) {
      local("\u{1F5DD}\uFE0F Your keyholders have already been asked. Your doses stay till one of them lets you out.");
      return 0;
    }
    askedAt = now;
    let n = 0;
    for (const k of keys) {
      if (sendTo(k, "dispAsk", { name })) n++;
      else if (beepTo(k, "\u{1F5DD}\uFE0F " + name + " (" + me() + ") is askin' to be let out of hardcore in The Farmhand's Dispensary. If you've the Dispensary, open its page (Keys you hold); with the Companion, /keys letout " + me() + ".")) n++;
    }
    log(me(), "asked to be let out");
    save();
    local("\u{1F5DD}\uFE0F Hardcore: your doses stay. " + (n ? "Your keyholders have been asked to let you out: " + keys.map(who).join(", ") + "." : "None of your keyholders could be reached just now."));
    return n;
  }
  function onKey(by, m) {
    if (!isKey(by) || !m || typeof m !== "object") return false;
    const H = st().hard, nm = who(by);
    if (m.do === "check") {
      if (checkIn(by)) sendTo(by, "dispHard", { on: true, until: H.until || 0, due: dueAt(), keys: keyholders(), name: W5.Player && (W5.Player.Nickname || W5.Player.Name) || "" });
      return true;
    }
    if (!hardOn()) return false;
    if (m.do === "state") {
      sendTo(by, "dispKeyState", stateFor());
      checkIn(by);
      return true;
    }
    if (m.do === "letout") {
      const n = clearAll("keyholder");
      log(by, "let you out (" + n + " dose" + (n === 1 ? "" : "s") + " lifted)");
      save();
      local("\u{1F5DD}\uFE0F " + nm + " let you out: every dose in you is lifted.");
      checkIn(by);
      onChange();
      return true;
    }
    if (m.do === "end") {
      checkIn(by);
      return unlock(by, "ended by " + nm);
    }
    if (m.do === "extend") {
      const d = Math.max(0, Math.min(CHECK_DAYS, Math.round(Number(m.days) || 0)));
      H.until = d ? Date.now() + d * DAY2 : 0;
      H.checkAt = Date.now();
      log(by, d ? "set the end to " + d + " day" + (d === 1 ? "" : "s") + " from now" : "took the end date away");
      save();
      local("\u{1F5DD}\uFE0F " + nm + " " + (d ? "set your hardcore to end in " + d + " day" + (d === 1 ? "" : "s") + "." : "took your end date away. A keyholder checks in every " + CHECK_DAYS + " days instead."));
      onChange();
      return true;
    }
    if (m.do === "set") {
      const S2 = st(), said = [];
      if (typeof m.who === "string" && LADDER.some((r) => r.id === m.who) && m.who !== S2.who) {
        S2.who = m.who;
        said.push("who can dose you: " + LADDER.find((r) => r.id === m.who).label);
      }
      if ((m.clock === "real" || m.clock === "online") && m.clock !== S2.clock) {
        setClock(m.clock);
        said.push("the clock: " + (m.clock === "real" ? "real time" : "while online"));
      }
      if (m.off && typeof m.off === "object") {
        for (const id of doseIds()) if (typeof m.off[id] === "boolean" && !!S2.off[id] !== m.off[id]) {
          if (m.off[id]) S2.off[id] = true;
          else delete S2.off[id];
          said.push(id + (m.off[id] ? " switched off" : " switched on"));
        }
      }
      if (m.companion && typeof m.companion === "object" && companion()) {
        try {
          said.push(...companion().setHardPrefs(m.companion));
        } catch (e) {
        }
      }
      if (!said.length) return true;
      log(by, "changed " + said.join(", "));
      save();
      checkIn(by);
      onChange();
      local("\u{1F5DD}\uFE0F " + nm + " changed your Dispensary: " + said.join("; ") + ".");
      sendTo(by, "dispKeyState", stateFor());
      return true;
    }
    return false;
  }
  function stateFor() {
    const S2 = st();
    let comp = null;
    try {
      comp = companion() ? companion().hardPrefs() : null;
    } catch (e) {
      comp = null;
    }
    return { who: S2.who, clock: S2.clock, off: Object.assign({}, S2.off), doses: doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })), until: S2.hard && S2.hard.until || 0, due: dueAt(), companion: comp };
  }
  var wards = () => st().wards || (st().wards = {});
  function onWardHard(from, m) {
    if (!Array.isArray(m.keys) || !m.keys.includes(me())) return;
    const w = wards();
    if (!m.on) {
      if (w[from]) {
        delete w[from];
        save();
        onChange();
      }
      return;
    }
    const was = w[from], now = Date.now();
    w[from] = Object.assign({}, was, { name: String(m.name || "").slice(0, 40), until: Number(m.until) || 0, due: Number(m.due) || 0, seen: now });
    save();
    onChange();
    if (!was || now - (was.checked || 0) > 36e5) {
      w[from].checked = now;
      sendTo(from, "dispKey", { do: "check" });
    }
  }
  var wardStates = {};
  var wardState = (mn) => wardStates[mn] || null;
  function keyDo(mn, what, data) {
    if (sendTo(mn, "dispKey", Object.assign({ do: what }, data || {}))) return "room";
    const words = { check: "checked in on your hardcore", letout: "let you out: every dose lifted", end: "ended your hardcore" };
    if (!words[what]) return null;
    const nm = W5.Player && (W5.Player.Nickname || W5.Player.Name) || "Your keyholder";
    return beepTo(mn, "\u{1F5DD}\uFE0F " + nm + " " + words[what] + ". [fd:" + what + "]") ? "beep" : null;
  }
  function initHardcore(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me()) {
            const m = readMsg(data);
            if (m && m.type === "dispKey") onKey(data.Sender, m);
            else if (m && m.type === "dispHard") onWardHard(data.Sender, m);
            else if (m && m.type === "dispKeyState") {
              wardStates[data.Sender] = m;
              onChange();
            } else if (m && m.type === "dispAsk" && wards()[data.Sender]) {
              wards()[data.Sender].asked = Date.now();
              save();
              onChange();
              local("\u{1F5DD}\uFE0F " + who(data.Sender) + " is askin' to be let out of hardcore. Open the Dispensary's page (Keys you hold) to let them out.");
            }
          }
        } catch (e) {
          console.warn("[Dispensary] hardcore:", e);
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] keyholders can't reach you:", e);
    }
    try {
      mod2.hookFunction("ServerAccountBeep", 11, (args, next) => {
        try {
          const d = args[0], t = d && typeof d.Message === "string" ? /\s*\[fd:(check|letout|end)\]\s*$/.exec(d.Message) : null;
          if (t) {
            if (isKey(d.MemberNumber)) onKey(d.MemberNumber, { do: t[1] });
            d.Message = d.Message.slice(0, t.index);
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
    }
    try {
      mod2.hookFunction("ChatRoomSync", 11, (args, next) => {
        const r = next(args);
        setTimeout(() => {
          if (hardOn()) announce();
        }, 3e3);
        return r;
      });
    } catch (e) {
    }
  }

  // dispensary/src/lscg.js
  var W6 = window;
  var api = null;
  var caps = null;
  var syncing = null;
  var REG = {};
  var lastLscg = {};
  var ours2 = (id) => LSCG_ID + "." + id;
  var minsLeft = (id) => Math.ceil(leftMs(id) / 6e4);
  var BREATH_MINS = 10;
  function lscgPresent() {
    if (W6.LSCG) return true;
    try {
      const sdk = W6.bcModSdk;
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
      api.drugs.dose(ours2(id), { multiplier: 1, method: "inject", sender: by || void 0, minigame: false });
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
        if (B.lscg || B.instant || REG[id]) continue;
        try {
          api.drugs.register({
            name: id,
            label: B.label,
            description: B.desc,
            keywords: B.keywords,
            color: B.color,
            soakKeywords: B.soak || void 0,
            max: 600,
            decayPerMinute: 0,
            tickSeconds: 20,
            onDose(ctx) {
              if (syncing === id) {
                ctx.setLevel(minsLeft(id));
                return;
              }
              lastLscg[id] = Date.now();
              if (ctx.method === "breath") {
                const r0 = give(id, { by: ctx.sender, mins: BREATH_MINS, upto: true, quiet: active(id) });
                ctx.setLevel(r0.ok ? minsLeft(id) : 0);
                return;
              }
              const mult = Math.max(0.5, Math.min(2, Number(ctx.multiplier) || 1));
              const text = typeof ctx.sender === "number" ? handTextOf(ctx.sender) : "", p = partFor(id, text) || void 0;
              if (text && isLater(text)) {
                queue(id, { by: ctx.sender, x: 1, p });
                ctx.setLevel(active(id) ? minsLeft(id) : 0);
                return;
              }
              const r = give(id, { by: ctx.sender, mins: Math.round(B.mins * mult), p });
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
        api.events.on("safeword", () => {
          if (hardOn()) askOut();
          else clearAll("safeword");
        });
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
    const q = W6.LSCG_OnLoad = W6.LSCG_OnLoad || [];
    q.push((L) => {
      try {
        setUp(L);
      } catch (e) {
        console.warn("[Dispensary] LSCG hookup:", e);
      }
    });
  }

  // dispensary/src/doses.js
  var W7 = window;
  var MIN2 = 6e4;
  var CAP = 48 * 60 * MIN2;
  var BOOK = {
    denial: {
      label: "Denial Serum",
      icon: "\u{1F6AB}",
      mins: 120,
      color: "#b04a7a",
      farm: true,
      words: /\b(denial serum|edge serum|orgasm (?:block\w*|denial)|held at the edge)\b/,
      keywords: ["denial serum", "edge serum", "orgasm block"],
      soak: ["denial", "edging"],
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
    },
    needy: {
      label: "Needy Nectar",
      icon: "\u{1F497}",
      mins: 30,
      color: "#e0607e",
      farm: true,
      lscg: "horny",
      voice: "needy",
      every: [4, 7],
      words: /\b(aphrodisiac|horny|lust serum|libido|needy nectar)\b/,
      keywords: ["needy nectar", "aphrodisiac", "lust serum"],
      desc: "Achin' and squirmin': your arousal creeps up and won't settle, and your face gives you away. Half an hour a dose."
    },
    hairtrigger: {
      label: "Hair Trigger",
      icon: "\u26A1",
      mins: 60,
      color: "#e8b04a",
      farm: true,
      every: [6, 10],
      words: /\b(hair[- ]?trigger|sensiti[sz]er|oversensitiv\w*)\b/,
      keywords: ["hair trigger", "sensitizer"],
      soak: ["sensitizer", "sensitizing"],
      desc: "Every touch counts double: whatever anybody does to you works you up twice as fast. An hour a dose."
    },
    bitterroot: {
      label: "Bitterroot",
      icon: "\u{1F33F}",
      mins: 30,
      color: "#6f8f4a",
      farm: true,
      voice: "bitterroot",
      every: [5, 8],
      words: /\b(bitterroot|ruin(?:ing|ed)? (?:serum|draught|tonic|shot))\b/,
      keywords: ["bitterroot"],
      soak: ["bitterroot", "ruin"],
      desc: "Every orgasm slips away ruined: you go over, and get none of the relief. Half an hour a dose."
    },
    moo: {
      label: "Moo Juice",
      icon: "\u{1F404}",
      mins: 20,
      color: "#c9a35b",
      farm: true,
      voice: "moo",
      every: [6, 10],
      room: true,
      words: /\b(moo (?:serum|shot|juice))\b/,
      keywords: ["moo juice", "moo serum"],
      soak: ["moo"],
      desc: "Your words keep comin' out as the noises your animal makes. Twenty minutes a dose."
    },
    hiccup: {
      label: "Hiccup Fizz",
      icon: "\u{1FAE7}",
      mins: 15,
      color: "#7ec8e3",
      farm: true,
      voice: "hiccup",
      every: [1, 3],
      room: true,
      words: /\b(hiccup\w*)\b/,
      keywords: ["hiccup fizz"],
      soak: ["hiccup"],
      desc: "Hiccups. In every other sentence. At the worst possible moments. Fifteen minutes a dose."
    },
    feather: {
      label: "Featherlight",
      icon: "\u{1FAB6}",
      mins: 15,
      color: "#d9c8f0",
      farm: true,
      voice: "feather",
      every: [2, 4],
      room: true,
      words: /\b(featherlight|tickl\w* (?:serum|draught|potion|shot))\b/,
      keywords: ["featherlight"],
      soak: ["tickle", "tickling"],
      desc: "Unbearably ticklish: giggles slip into everything you say. Fifteen minutes a dose."
    },
    heat: {
      label: "Heat",
      icon: "\u{1F525}",
      mins: 60,
      color: "#e0703a",
      farm: true,
      voice: "heatmist",
      every: [4, 6],
      room: true,
      words: /\b(heat[- ]?inducer|heat mist|in heat serum)\b/,
      keywords: ["heat inducer", "heat mist"],
      soak: ["heat"],
      desc: "In heat: your arousal won't drop below a simmer, and everybody near can tell. On the farm, the farm keeps the heat itself. An hour a dose."
    },
    suggestible: {
      label: "Suggestible",
      icon: "\u{1F300}",
      mins: 30,
      color: "#4cd964",
      farm: true,
      lscg: "suggestible",
      lscgOnly: true,
      words: /\b(obedien\w*|docile|compliance|suggest[ia]ble)\b/,
      keywords: ["obedience", "docile"],
      desc: "LSCG's Suggestible: the more of it in you, the more you want to do as you're told. Only with LSCG; without it, the farm's obedience shot is the farm's trance."
    },
    // ── Nov 17, more (none of these is a farm shot: on the farm too, your Dispensary reads the needle) ──
    letdown: {
      label: "Let-Down",
      icon: "\u{1F37C}",
      mins: 30,
      color: "#efe3c8",
      every: [4, 7],
      room: true,
      words: /\b(let[- ]?down (?:tonic|serum|shot|draught|drops?|potion)|leaky (?:tits|teats|udders?) (?:tonic|serum|shot))\b/,
      keywords: ["let-down tonic", "letdown serum"],
      soak: ["let-down", "leaky"],
      desc: 'Your tits go heavy and leak: fresh wet spots bloom through your top every few minutes. With the Companion and its "Farm can mark my body" on, the milk shows on your chest for everybody with a Companion. Half an hour a dose.'
    },
    fillout: {
      label: "Fill-Out",
      icon: "\u{1F388}",
      mins: 30,
      color: "#f0a0b8",
      every: [6, 10],
      room: true,
      words: /\b(fill-out|fill[- ]?out (?:serum|shot|tonic|potion|drops?)|swell(?:ing)? (?:serum|shot|tonic|potion|drops?))\b/,
      keywords: ["fill-out", "swelling serum"],
      soak: ["swelling", "fill-out"],
      desc: "A swell that comes and goes: your tits a few cups bigger, or your belly round and full, for as long as it lasts, then it shrinks back. Say which on the bottle (Fill-Out (belly), Fill-Out (ass)); it's the cup if it doesn't say. The Companion's drawn body draws your tits and belly swollen for everybody with a Companion (a swollen ass gets its lines, not a picture, for now). Half an hour a dose."
    },
    airhead: {
      label: "Airhead Elixir",
      icon: "\u{1F380}",
      mins: 20,
      color: "#ff9ccf",
      every: [6, 10],
      room: true,
      words: /\b((?:airhead|bimbo) (?:elixir|potion|serum|tonic|shot|juice|drops?))\b/,
      keywords: ["airhead elixir", "bimbo serum"],
      soak: ["airhead", "bimbo"],
      desc: "Everything you say comes out, like, totally airheaded: likes and ums, uptalk, giggles, and big words that just sort of float off. The stronger the dose, the emptier your head. Twenty minutes a dose."
    },
    babble: {
      label: "Babble Brew",
      icon: "\u{1F4AC}",
      mins: 20,
      color: "#c0508a",
      every: [6, 10],
      room: true,
      words: /\b(babble (?:brew|potion|tonic|shot|serum)|potty[- ]?mouth (?:potion|tonic|brew|serum))\b/,
      keywords: ["babble brew", "potty mouth potion"],
      soak: ["babble"],
      desc: "Filthy words keep slippin' out in the middle of what you say, and innocent ones come out wrong (the clock, the class, the bread...). The stronger the dose, the filthier your mouth. Twenty minutes a dose."
    },
    deepthroat: {
      label: "Deep Throat Drops",
      icon: "\u{1F444}",
      mins: 60,
      color: "#d06070",
      every: [8, 12],
      words: /\b(deep[- ]?throat (?:drops?|serum|spray|shot|tonic)|throat relax\w*|gag[- ]?reflex (?:blocker|drops?|serum))\b/,
      keywords: ["deep throat drops", "throat relaxer"],
      soak: ["deep throat"],
      desc: "No gag reflex: anything goes down easy, and whatever's done to your mouth counts double. On the farm, a dosed throat takes a load without gaggin', and the trainin' counts twice. An hour a dose."
    },
    rut: {
      label: "Rut",
      icon: "\u{1F402}",
      mins: 60,
      color: "#a8432c",
      every: [5, 8],
      room: true,
      words: /\b(rut(?:ting)? (?:serum|shot|tonic|potion|musk|drops?)|in[- ]rut (?:serum|shot|tonic))\b/,
      keywords: ["rut serum", "rutting tonic"],
      soak: ["rut", "rutting"],
      desc: "In rut: hot, hungry and ready again almost as soon as you've finished. Your arousal never cools right off, and after you go over it bounces straight back up. On the farm, your loads come bigger and you don't run dry. An hour a dose."
    },
    tender: {
      label: "Tender",
      icon: "\u{1F338}",
      mins: 30,
      color: "#f2a6b8",
      every: [6, 9],
      words: /\b(tender (?:drops?|serum|balm|oil|shot|tonic)|tenderi[sz]er)\b/,
      keywords: ["tender drops", "tenderizer"],
      soak: ["tender"],
      desc: "One spot goes sweetly tender: touches there count three times over. Say where on the bottle (Tender Drops (nipples)), or it's the spot you pick on this page. Half an hour a dose."
    },
    purge: {
      label: "Purge",
      icon: "\u{1F9FC}",
      mins: 0,
      color: "#9fc7c7",
      farm: true,
      instant: true,
      words: /\b(purge (?:serum|shot)|antidote|detox|cleanser)\b/,
      keywords: ["purge serum", "antidote"],
      desc: "Every dose in you flushed out at once (and LSCG's too, with its own antidote, when it's loaded)."
    }
  };
  var doseIds = () => Object.keys(BOOK);
  function stackOf(text) {
    const t = String(text || "").toLowerCase(), m = /\bx\s?([2-5])\b|\b([2-5])\s?x\b/.exec(t);
    if (m) return Number(m[1] || m[2]);
    return /\btriple\b/.test(t) ? 3 : /\bdouble\b/.test(t) ? 2 : 1;
  }
  var TENDER_SPOTS = {
    nipples: { word: "nipples", zones: ["ItemNipples", "ItemNipplesPiercings"], re: /\b(nipples?|teats?)\b/ },
    breasts: { word: "tits", zones: ["ItemBreast"], re: /\b(breasts?|tits?|titties|boobs?|chest|udders?)\b/ },
    clit: { word: "clit", zones: ["ItemVulvaPiercings"], re: /\bclit\w*\b/ },
    pussy: { word: "pussy", zones: ["ItemVulva"], re: /\b(pussy|cunt|slit|vulva|cooch)\b/ },
    ass: { word: "ass", zones: ["ItemButt"], re: /\b(ass|butt|bum|rear|asshole)\b/ },
    neck: { word: "neck", zones: ["ItemNeck"], re: /\b(neck|throat|nape)\b/ },
    ears: { word: "ears", zones: ["ItemEars"], re: /\bears?\b/ },
    mouth: { word: "lips", zones: ["ItemMouth"], re: /\b(lips?|mouth|tongue)\b/ },
    belly: { word: "belly", zones: ["ItemPelvis"], re: /\b(belly|tummy|stomach|navel)\b/ },
    thighs: { word: "thighs", zones: ["ItemLegs"], re: /\b(thighs?|legs?)\b/ },
    feet: { word: "feet", zones: ["ItemFeet", "ItemBoots"], re: /\b(feet|foot|toes?|soles?)\b/ }
  };
  var TENDER_DEFAULT = "nipples";
  var PART_RE = { belly: /\b(belly|tummy|stomach|womb)\b/, ass: /\b(ass|butt|bum|rear|hips?|booty)\b/ };
  function partFor(id, text) {
    const t = String(text || "").toLowerCase();
    if (id === "fillout") return PART_RE.belly.test(t) ? "belly" : PART_RE.ass.test(t) ? "ass" : "cup";
    if (id === "tender") {
      for (const [k, s] of Object.entries(TENDER_SPOTS)) if (s.re.test(t.replace(BOOK.tender.words, " "))) return k;
      return "";
    }
    return "";
  }
  function dosesIn(text) {
    const t = String(text || "").toLowerCase(), x = stackOf(t);
    return doseIds().filter((id) => BOOK[id].words.test(t)).map((id) => {
      const p = partFor(id, t);
      return p ? { id, x, p } : { id, x };
    });
  }
  function partOf(id) {
    const d = st().doses[id];
    if (id === "fillout") return d && d.p || "cup";
    if (id === "tender") {
      const p = d && d.p || st().tenderSpot;
      return TENDER_SPOTS[p] ? p : TENDER_DEFAULT;
    }
    return "";
  }
  var tenderZones = () => TENDER_SPOTS[partOf("tender")].zones;
  var voiceOf = (id) => BOOK[id] && BOOK[id].voice && POTION_VOICE[BOOK[id].voice] || null;
  var nameIn = (t) => String(t).replace(/%n/g, myName());
  var poolOf = (id, p) => id === "fillout" ? LINES["fillout_" + (p || partOf(id))] || LINES.fillout_cup : LINES[id];
  var spotIn = (t, id, p) => id === "tender" ? String(t).replace(/%s/g, TENDER_SPOTS[TENDER_SPOTS[p] ? p : partOf(id)].word) : t;
  var ours3 = (id, kind, p) => {
    const L = poolOf(id, p);
    return L && L[kind] && L[kind].length ? spotIn(fill(pick(L[kind])), id, p) : "";
  };
  function takeLine(id) {
    const v = voiceOf(id);
    return v && v.seen.length ? nameIn(pick(v.seen)) : ours3(id, "take");
  }
  function nowLine(id) {
    const v = voiceOf(id);
    return v && v.now.length ? nameIn(pick(v.now)) : ours3(id, "now");
  }
  function offLine(id, p) {
    const v = voiceOf(id);
    return v && v.off.length ? nameIn(pick(v.off)) : ours3(id, "off", p);
  }
  function tellPage(detail) {
    try {
      W7.dispatchEvent(new W7.CustomEvent("farmhand-dispensary", { detail }));
    } catch (e) {
    }
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
  var TOLERANCE_HOURS = 3;
  var TOLERANCE_STEP = 0.2;
  var TOLERANCE_FLOOR = 0.4;
  function toleranceOf(id, now) {
    const S2 = st();
    if (!S2.tolerance) return 1;
    const recent = (S2.taken[id] || []).filter((t) => (now || Date.now()) - t < TOLERANCE_HOURS * 36e5).length;
    return Math.max(TOLERANCE_FLOOR, 1 - TOLERANCE_STEP * recent);
  }
  function give(id, o) {
    o = o || {};
    const B = BOOK[id], S2 = st();
    if (!B) return { ok: false, why: "unknown" };
    if (S2.off[id]) return { ok: false, why: "off" };
    if (B.instant) return purge(o);
    if (B.lscg && lscgPresent()) return { ok: false, why: "lscg" };
    if (B.lscgOnly) return { ok: false, why: "nolscg" };
    const now = Date.now(), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
    const tol = o.upto ? 1 : toleranceOf(id, now);
    const dur = Math.max(MIN2, Math.min(CAP, (Number(o.mins) > 0 ? Number(o.mins) : B.mins * x) * MIN2 * tol));
    const was = active(id), d = S2.doses[id], by = Number(o.by) || 0;
    const xNow = Math.max(x, was && d ? d.x || 1 : 1);
    const p = typeof o.p === "string" && o.p ? o.p : was && d && d.p ? d.p : "";
    if (S2.clock === "real") {
      const add2 = dur * penaltyF(), base = was && typeof d.until === "number" ? d.until : now;
      S2.doses[id] = { x: xNow, by, at: now, until: Math.min(now + CAP * penaltyF(), o.upto ? Math.max(base, now + add2) : base + add2) };
    } else {
      const base = was && typeof d.left === "number" ? d.left : 0;
      S2.doses[id] = { x: xNow, by, at: now, left: Math.min(CAP, o.upto ? Math.max(base, dur) : base + dur) };
    }
    if (p) S2.doses[id].p = p;
    if (!o.upto) S2.taken[id] = (S2.taken[id] || []).concat(now).filter((t) => now - t < 3 * 864e5).slice(-20);
    save();
    if (!was) start(id);
    if (!o.quiet) action(o.line || takeLine(id));
    if (tol < 1) local(fill(TOLERANCE_NOTE, { dose: B.label }).replace("%p", String(Math.round(tol * 100))));
    if (!was || p && d && d.p !== p || xNow !== (d && d.x)) tellPage({ type: "dose", id, on: true, x: xNow, p });
    try {
      lscgShow(id, by);
    } catch (e) {
    }
    return { ok: true };
  }
  function purge(o) {
    const n = clearAll("purge");
    let lscg = false;
    if (lscgPresent()) {
      try {
        lscg = lscgDose("antidote", { by: o.by });
      } catch (e) {
      }
    }
    if (!o.quiet) action(o.line || fill("%t shudders as the purge hits, and every dose in them drains away, clean and cold."));
    return { ok: true, n, lscg };
  }
  function end(id, why) {
    const S2 = st();
    if (!S2.doses[id]) return false;
    const p = S2.doses[id].p || (id === "tender" ? partOf(id) : "");
    delete S2.doses[id];
    save();
    stop(id);
    tellPage({ type: "dose", id, on: false });
    if (why === "done" || why === "lscg") {
      const l = offLine(id, p);
      if (l) local(l);
    }
    return true;
  }
  function clearAll(why) {
    let n = 0;
    for (const id of Object.keys(st().doses)) if (end(id, why)) n++;
    if (st().later && st().later.length) {
      n += st().later.length;
      st().later = [];
      save();
    }
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
    if (now - lastSave > MIN2) {
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
      if (typeof W7.CharacterSetFacialExpression === "function" && W7.Player) W7.CharacterSetFacialExpression(W7.Player, group, expr, secs);
    } catch (e) {
    }
  };
  var meter = () => {
    const A = W7.Player && W7.Player.ArousalSettings;
    return A && A.Active !== "Inactive" && A.Active !== "NoMeter" ? A : null;
  };
  function setArousal(v) {
    try {
      const A = meter();
      if (!A) return;
      const n = Math.max(0, Math.min(100, Math.round(v)));
      if (typeof W7.ActivitySetArousal === "function") W7.ActivitySetArousal(W7.Player, n);
      else A.Progress = n;
    } catch (e) {
    }
  }
  var xOf = (id) => st().doses[id] && st().doses[id].x || 1;
  var felt = {};
  var FLUSHED = ["needy", "heat", "rut", "letdown"];
  var leak = () => tellPage({ type: "leak", mess: "milk", areas: ["chest"], amount: Math.min(2, 0.5 + 0.25 * xOf("letdown")) });
  function start(id) {
    if (id === "sedative") face("Eyes", "Dazed", 180);
    if (FLUSHED.includes(id)) face("Blush", id === "letdown" ? "Low" : "Medium", 120);
    if (id === "airhead") face("Eyes", "Dazed", 120);
    if (id === "letdown") leak();
  }
  function stop(id) {
    if (id === "sedative" && !active("airhead") || id === "airhead" && !active("sedative")) face("Eyes", null);
    if (FLUSHED.includes(id) && !FLUSHED.some(active)) face("Blush", null);
    delete felt[id];
  }
  function moment(id) {
    tick();
    if (felt[id]) felt[id].next = 0;
    tick();
  }
  function feel(id, now) {
    const B = BOOK[id];
    const f = felt[id] || (felt[id] = { face: now, next: now + ((B.every ? B.every[0] : 3) + Math.random() * 2) * MIN2 });
    if (id === "sedative" && now - f.face > 2 * MIN2) {
      f.face = now;
      face("Eyes", "Dazed", 180);
    }
    if (id === "needy") {
      const A = meter(), cap = Math.min(92, 60 + 10 * xOf(id));
      if (A && (Number(A.Progress) || 0) < cap) setArousal((Number(A.Progress) || 0) + 2);
      if (now - f.face > 2 * MIN2) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "heat") {
      const A = meter(), floor = Math.min(70, 25 + 15 * xOf(id));
      if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
      if (now - f.face > 2 * MIN2) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "rut") {
      const A = meter(), floor = Math.min(60, 20 + 10 * xOf(id));
      if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
      if (now - f.face > 2 * MIN2) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "airhead" && now - f.face > 2 * MIN2) {
      f.face = now;
      face("Eyes", "Dazed", 120);
    }
    if (B.every && now >= f.next && inRoom()) {
      f.next = now + (B.every[0] + Math.random() * (B.every[1] - B.every[0])) * MIN2;
      const l = nowLine(id);
      if (l) {
        if (B.room) action(l);
        else local(l);
      }
      if (id === "letdown") leak();
    } else if (!B.every && id === "sedative" && now >= f.next && inRoom()) {
      f.next = now + (8 + Math.random() * 6) * MIN2;
      local(pick(LINES.sedative.drift));
    }
  }
  var heldTold = 0;
  var toldAt = {};
  function feltOnce(id, kind, gap) {
    const now = Date.now(), k = id + ":" + kind;
    if (now - (toldAt[k] || 0) < gap) return;
    toldAt[k] = now;
    const l = ours3(id, kind);
    if (l) local(l);
  }
  function initDoses(mod2) {
    try {
      mod2.hookFunction("ActivityOrgasmPrepare", 6, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("denial")) {
            if (C.ArousalSettings) C.ArousalSettings.Progress = 94;
            face("Blush", "High", 20);
            if (Date.now() - heldTold > MIN2) {
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
      mod2.hookFunction("ActivityOrgasmStart", 6, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("bitterroot")) W7.ActivityOrgasmRuined = true;
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Bitterroot can't ruin you:", e);
    }
    try {
      mod2.hookFunction("ActivitySetArousalTimer", 6, (args, next) => {
        try {
          const C = args[0], zone = String(args[2] || "");
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && Number(args[3]) > 0) {
            let f = 1;
            if (active("hairtrigger")) f *= 2;
            if (active("deepthroat") && /^ItemMouth/.test(zone)) {
              f *= 2;
              feltOnce("deepthroat", "used", 9e4);
            }
            if (active("tender") && tenderZones().includes(zone)) {
              f *= 3;
              feltOnce("tender", "touched", 12e4);
            }
            if (f > 1) args[3] = Number(args[3]) * f;
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Hair Trigger can't reach you:", e);
    }
    try {
      mod2.hookFunction("ActivityOrgasmStop", 6, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("rut")) {
            const back = Math.min(80, 40 + 8 * xOf("rut"));
            if ((Number(args[1]) || 0) < back) {
              args = [args[0], back].concat(args.slice(2));
              feltOnce("rut", "again", MIN2);
            }
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Rut can't keep you goin':", e);
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

  // dispensary/src/farm.js
  var W8 = window;
  function send(type, data) {
    try {
      if (botHere() && typeof W8.ServerSend === "function") {
        W8.ServerSend("ChatRoomChat", makeMsg(type, data, BOT));
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  var helloAt = 0;
  var helloSig = "";
  var onNow = () => doseIds().filter(active).sort();
  var sigNow = () => JSON.stringify([allowed(BOT), lscgPresent(), Object.keys(st().off).sort(), hardOn(), hardOn() ? keyholders() : [], hardOn() ? Math.floor(dueAt() / 36e5) : 0, onNow(), craving()]);
  function hello(force) {
    const now = Date.now(), sig = sigNow();
    if (!force && sig === helloSig && now - helloAt < 30 * 6e4) return false;
    if (!send("dispHello", {
      ver: VERSION,
      farm: allowed(BOT),
      lscg: lscgPresent(),
      off: Object.keys(st().off),
      hard: hardOn(),
      due: hardOn() ? dueAt() : 0,
      keys: hardOn() ? keyholders() : [],
      on: onNow(),
      crave: craving()
    })) return false;
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
      if (typeof m.stock === "boolean") S2.stock = m.stock;
      if (typeof m.species === "string" && /^[a-z]{2,20}$/.test(m.species)) S2.speciesFarm = m.species;
      S2.farmAt = Date.now();
      save();
      return;
    }
    if (m.type === "dispClear") {
      if (hardOn()) {
        local("\u{1F512} Hardcore: your doses stay. The farm's fetchin' help, and the proprietors can let you out.");
        return;
      }
      if (clearAll("safeword")) local(NOTES.safeword);
      return;
    }
  }
  function initFarm(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next) => {
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
    if (hardOn()) {
      askOut();
      return 0;
    }
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

  // shared/species.js
  var WORDS = {
    cow: "cow",
    cows: "cow",
    cattle: "cow",
    heifer: "cow",
    hucow: "cow",
    bovine: "cow",
    calf: "cow",
    dairy: "cow",
    moo: "cow",
    cowgirl: "cow",
    bull: "bull",
    ox: "bull",
    steer: "bull",
    pony: "pony",
    filly: "pony",
    foal: "pony",
    colt: "pony",
    ponygirl: "pony",
    ponyboy: "pony",
    horse: "horse",
    mare: "horse",
    stallion: "horse",
    equine: "horse",
    deer: "deer",
    doe: "deer",
    fawn: "deer",
    stag: "deer",
    reindeer: "deer",
    pig: "pig",
    piggy: "pig",
    piglet: "pig",
    sow: "pig",
    hog: "pig",
    swine: "pig",
    oink: "pig",
    boar: "pig",
    pup: "pup",
    puppy: "pup",
    pupper: "pup",
    pupgirl: "pup",
    pupboy: "pup",
    dog: "dog",
    doggy: "dog",
    doggie: "dog",
    hound: "dog",
    canine: "dog",
    bitch: "dog",
    kitt: "kitt",
    kitty: "kitt",
    kitten: "kitt",
    kittie: "kitt",
    kit: "kitt",
    kitteh: "kitt",
    neko: "kitt",
    catgirl: "kitt",
    catboy: "kitt",
    cat: "cat",
    feline: "cat",
    tomcat: "cat",
    pussycat: "kitt",
    goblin: "goblin",
    gob: "goblin",
    gobbo: "goblin",
    bunny: "bunny",
    bun: "bunny",
    bunbun: "bunny",
    rabbit: "rabbit",
    hare: "rabbit",
    fox: "fox",
    vixen: "fox",
    foxy: "fox",
    kitsune: "fox",
    wolf: "wolf",
    lupine: "wolf",
    wolfie: "wolf",
    goat: "goat",
    nanny: "goat",
    billy: "goat",
    kid: "goat",
    sheep: "sheep",
    lamb: "sheep",
    ewe: "sheep",
    ram: "sheep",
    dragon: "dragon",
    dragoness: "dragon",
    drake: "dragon",
    wyrm: "dragon",
    wyvern: "dragon",
    draconic: "dragon",
    drakeling: "dragon",
    kobold: "dragon",
    dragonborn: "dragon",
    rat: "rat",
    ratty: "rat",
    rattie: "rat",
    ratgirl: "rat",
    ratboy: "rat",
    ratslut: "rat",
    rodent: "rat",
    mouse: "rat",
    mousey: "rat",
    mice: "rat"
  };
  var ENDINGS = /(girl|boy|gal|guy|kin|slut|sluts|whore|toy|pet|bimbo|s)$/;
  var known = (w) => {
    if (WORDS[w]) return WORDS[w];
    const cut = w.replace(ENDINGS, "");
    if (cut !== w && cut.length > 1) {
      if (WORDS[cut]) return WORDS[cut];
      const again = cut.replace(ENDINGS, "");
      if (WORDS[again]) return WORDS[again];
    }
    if (/ves$/.test(w) && WORDS[w.replace(/ves$/, "f")]) return WORDS[w.replace(/ves$/, "f")];
    return null;
  };
  var INSIDE = Object.keys(WORDS).filter((w) => w.length >= 3).sort((a, b) => b.length - a.length);
  function speciesKeyOf(text) {
    const low = String(text || "").toLowerCase().replace(/[^a-z\s\/-]/g, " ").replace(/\s+/g, " ").trim();
    if (!low) return null;
    const whole = low.replace(/[\s\/-]+/g, "");
    if (known(whole)) return known(whole);
    const words = low.split(/[\s\/-]+/).filter(Boolean);
    for (const w of words) {
      const k = known(w);
      if (k) return k;
    }
    for (const w of words) {
      const hit = INSIDE.find((x) => w.startsWith(x) || w.endsWith(x));
      if (hit) return WORDS[hit];
    }
    return null;
  }

  // shared/noises.js
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
    goblin: ["heh", "nngh"],
    rat: ["squeak", "eek", "chitter"],
    dragon: ["rawr", "grr", "hsss"],
    kitt: ["mew", "nya", "mrrp"]
  };
  var ANIMALS = Object.keys(NOISES).filter((k) => k !== "kitt");
  function mooify(text, species, share) {
    const say = NOISES[String(species || "").toLowerCase()] || NOISES[speciesKeyOf(species)] || NOISES.cow;
    const keep = 1 - (typeof share === "number" ? Math.max(0, Math.min(1, share)) : 0.5);
    return String(text).replace(/[A-Za-z']{3,}/g, (w) => {
      if (Math.random() < keep) return w;
      const n = say[Math.floor(Math.random() * say.length)];
      return w[0] === w[0].toUpperCase() ? n[0].toUpperCase() + n.slice(1) : n;
    });
  }

  // dispensary/src/speech-more.js
  var pickOf = (a) => a[Math.floor(Math.random() * a.length)];
  function sameCase(from, to) {
    if (from === from.toUpperCase() && from.length > 1) return to.toUpperCase();
    if (from[0] === from[0].toUpperCase()) return to[0].toUpperCase() + to.slice(1);
    return to;
  }
  var parts = (w) => /^([^A-Za-z']*)([A-Za-z][A-Za-z']*)([^A-Za-z']*)$/.exec(w);
  var AIR_SWAP = {
    very: "super",
    really: "totally",
    yes: "yesss",
    yeah: "yeahhh",
    good: "cute",
    great: "sooo good",
    nice: "cute",
    think: "think? like,",
    maybe: "maybe? idk",
    know: "know, like,",
    sure: "totally",
    definitely: "totally",
    probably: "like, prolly",
    absolutely: "totally",
    understand: "get it",
    remember: "remember? I think",
    because: "cuz",
    important: "big",
    interesting: "fun",
    difficult: "hard",
    wonderful: "sooo pretty",
    beautiful: "sooo pretty",
    excellent: "super good",
    amazing: "omg amazing",
    perhaps: "maybe?",
    correct: "right?",
    hello: "hiii",
    hi: "hiii",
    bye: "byeee"
  };
  var AIR_FILL = ["like,", "like,", "um,", "like, totally", "uh,"];
  var AIR_LOST = ["um... thingy", "big-word thing", "whatchamacallit", "the, um...", "whatever it's called"];
  var AIR_OPEN = ["Um, ", "Sooo, ", "Like, ", "Omg, ", "Okay so, "];
  var AIR_END = ["*giggles*", "hehe", "...wait, what was I sayin'?", "*twirls hair*", "lol", "*giggle*"];
  function airhead(text, x) {
    const p = Math.min(0.6, 0.2 + 0.08 * (x || 1));
    const words = String(text).split(" ");
    const out = words.map((w, i) => {
      const m = parts(w);
      if (!m) return w;
      let core = m[2];
      const low = core.toLowerCase();
      if (AIR_SWAP[low] && Math.random() < p + 0.25) core = sameCase(core, AIR_SWAP[low]);
      else if (core.length >= 10 && Math.random() < p) core = pickOf(AIR_LOST);
      const pre = i > 0 && i < words.length - 1 && Math.random() < p * 0.45 ? pickOf(AIR_FILL) + " " : "";
      return pre + m[1] + core + m[3];
    });
    let t = out.join(" ");
    if (Math.random() < p) {
      const first = t.split(" ")[0];
      t = pickOf(AIR_OPEN) + (first === "I" || first.startsWith("I'") || first === first.toUpperCase() ? t : t[0].toLowerCase() + t.slice(1));
    }
    t = t.replace(/\.(\s|$)/g, (m0, s) => Math.random() < p ? "?" + s : m0);
    if (Math.random() < p * 0.7) t += " " + pickOf(AIR_END);
    return t;
  }
  var SLIPS = {
    clock: "cock",
    sock: "cock",
    rock: "cock",
    block: "cock",
    duck: "fuck",
    luck: "fuck",
    truck: "fuck",
    stuck: "fucked",
    hit: "tit",
    bit: "tit",
    sit: "tit",
    fit: "tit",
    sick: "dick",
    pick: "dick",
    kick: "dick",
    trick: "dick",
    bread: "breed",
    need: "breed",
    feed: "breed",
    read: "breed",
    come: "cum",
    coming: "cumming",
    comes: "cums",
    not: "knot",
    hot: "knot",
    glass: "ass",
    pass: "ass",
    class: "ass",
    grass: "ass",
    city: "titty",
    pretty: "titty",
    dream: "cream",
    stream: "cream",
    seat: "teat",
    sweet: "teat",
    heard: "herd",
    hug: "hump",
    jump: "hump",
    bump: "hump",
    mild: "milked",
    silk: "milk",
    slick: "lick",
    beast: "breast",
    best: "breast",
    pussycat: "pussy",
    butter: "butt",
    button: "butt",
    but: "butt",
    whole: "hole",
    bowl: "hole",
    ball: "balls",
    what: "wet",
    "what's": "wet",
    sir: "stud",
    stood: "stud",
    sorry: "sore",
    thank: "spank"
  };
  var BLURTS = [
    "\u2014fuck\u2014",
    "\u2014breed me\u2014",
    "*moan*",
    "\u2014cock\u2014",
    "\u2014milk me\u2014",
    "\u2014use me\u2014",
    "\u2014so wet\u2014",
    "\u2014knot me\u2014",
    "\u2014please\u2014",
    "\u2014fill me\u2014",
    "\u2014tits\u2014",
    "\u2014harder\u2014",
    "\u2014mmh, cum\u2014",
    "\u2014pet me\u2014",
    "\u2014spank me\u2014",
    "\u2014mount me\u2014"
  ];
  function babble(text, x) {
    const p = Math.min(0.55, 0.15 + 0.08 * (x || 1));
    const words = String(text).split(" "), out = [];
    let blurted = false, slipped = false;
    words.forEach((w, i) => {
      const m = parts(w);
      if (m && SLIPS[m[2].toLowerCase()] && SLIPS[m[2].toLowerCase()] !== m[2].toLowerCase() && Math.random() < p + 0.2) {
        out.push(m[1] + sameCase(m[2], SLIPS[m[2].toLowerCase()]) + m[3]);
        slipped = true;
      } else out.push(w);
      if (i < words.length - 1 && Math.random() < p * 0.35) {
        out.push(pickOf(BLURTS));
        blurted = true;
      }
    });
    if (!blurted && !slipped) out.splice(out.length < 2 ? out.length : 1 + Math.floor(Math.random() * (out.length - 1)), 0, pickOf(BLURTS));
    return out.join(" ");
  }

  // dispensary/src/speech.js
  var xOf2 = (id) => st().doses[id] && st().doses[id].x || 1;
  var GIGGLES = ["hehe", "*giggle*", "hee", "*snrk*", "ahaha", "*giggles*"];
  var pickOf2 = (a) => a[Math.floor(Math.random() * a.length)];
  function sprinkle(text, bits, every) {
    const words = String(text).split(" ");
    if (words.length < 2) return text + " " + pickOf2(bits);
    const out = [];
    let since2 = 0;
    words.forEach((w, i) => {
      out.push(w);
      since2++;
      if (i < words.length - 1 && since2 >= every && Math.random() < 0.5) {
        out.push(pickOf2(bits));
        since2 = 0;
      }
    });
    if (!out.some((w) => bits.includes(w))) out.splice(1 + Math.floor(Math.random() * (out.length - 1)), 0, pickOf2(bits));
    return out.join(" ");
  }
  function dosedSpeech(text) {
    let t = String(text);
    if (active("moo")) t = mooify(t, st().species || st().speciesFarm || "cow", Math.min(0.9, 0.4 + 0.1 * xOf2("moo")));
    if (active("hiccup")) t = sprinkle(t, ["*hic*", "*hic!*", "\u2014hic\u2014"], 4);
    if (active("feather")) t = sprinkle(t, GIGGLES, 5);
    if (active("airhead")) t = airhead(t, xOf2("airhead"));
    if (active("babble")) t = babble(t, xOf2("babble"));
    return t;
  }
  var touched = () => ["moo", "hiccup", "feather", "airhead", "babble"].some(active);
  function initSpeech(mod2) {
    try {
      mod2.hookFunction("ServerSend", 6, (args, next) => {
        try {
          const d = args[1];
          if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && touched() && !/^\s*[(\[?!./\-*]/.test(d.Content))
            args = [args[0], Object.assign({}, d, { Content: dosedSpeech(d.Content) })];
        } catch (e) {
          console.warn("[Dispensary] speech:", e);
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] what you say can't be dosed:", e);
    }
  }

  // dispensary/src/screen.js
  var W9 = window;
  var el = null;
  var styled = false;
  var CSS = `
#fd-screen{position:fixed;inset:0;pointer-events:none;z-index:2147482000;transition:opacity 1.5s ease}
#fd-screen.breathe{animation:fd-breathe 7s ease-in-out infinite}
#fd-screen.pulse{animation:fd-pulse 2.4s ease-in-out infinite}
@keyframes fd-breathe{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes fd-pulse{0%,100%{opacity:.25}50%{opacity:.9}}
@media (prefers-reduced-motion: reduce){#fd-screen.breathe,#fd-screen.pulse{animation:none;opacity:.6}}
`;
  function ensure() {
    if (!styled) {
      const s = W9.document.createElement("style");
      s.textContent = CSS;
      W9.document.head.appendChild(s);
      styled = true;
    }
    if (!el) {
      el = W9.document.createElement("div");
      el.id = "fd-screen";
      el.setAttribute("aria-hidden", "true");
      W9.document.body.appendChild(el);
    }
    return el;
  }
  var arousal = () => {
    const A = W9.Player && W9.Player.ArousalSettings;
    return A ? Number(A.Progress) || 0 : 0;
  };
  function screenNow() {
    if (st().screen === false || W9.CurrentScreen !== "ChatRoom") return null;
    if (active("denial") && arousal() >= 85) return { bg: "radial-gradient(ellipse at center, transparent 55%, rgba(220,60,130,.55) 100%)", cls: "pulse", id: "denial" };
    if (active("sedative")) return { bg: "radial-gradient(ellipse at center, transparent 35%, rgba(10,10,20,.75) 100%)", cls: "breathe", id: "sedative" };
    if (active("rut")) return { bg: "radial-gradient(ellipse at center, transparent 45%, rgba(170,40,20,.42) 100%)", cls: "breathe", id: "rut" };
    if (active("airhead")) return { bg: "radial-gradient(ellipse at center, rgba(255,200,235,.10) 25%, rgba(255,150,210,.38) 100%)", cls: "breathe", id: "airhead" };
    if (active("heat")) return { bg: "radial-gradient(ellipse at center, rgba(255,140,60,.06) 30%, rgba(255,110,40,.35) 100%)", cls: "breathe", id: "heat" };
    if (active("needy")) return { bg: "radial-gradient(ellipse at center, rgba(255,120,170,.05) 40%, rgba(255,90,150,.3) 100%)", cls: "breathe", id: "needy" };
    return null;
  }
  function screenTick() {
    const s = screenNow();
    if (!s) {
      if (el) {
        el.remove();
        el = null;
      }
      return null;
    }
    const e = ensure();
    if (e.dataset.id !== s.id) {
      e.dataset.id = s.id;
      e.style.background = s.bg;
      e.className = s.cls;
    }
    return s.id;
  }

  // extension/src/dom.js
  function h(tag, props, ...kids) {
    const el2 = window.document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === void 0 || v === null || v === false) continue;
      if (k.startsWith("on") && typeof v === "function") el2.addEventListener(k.slice(2), v);
      else if (k === "class") el2.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(el2.style, v);
      else if (k === "value") {
        el2.value = v;
        el2.setAttribute("value", v);
      } else el2.setAttribute(k, v === true ? "" : String(v));
    }
    add(el2, kids);
    return el2;
  }
  function add(el2, kids) {
    for (const k of kids) {
      if (k === null || k === void 0 || k === false) continue;
      if (Array.isArray(k)) add(el2, k);
      else el2.appendChild(typeof k === "object" ? k : window.document.createTextNode(String(k)));
    }
  }

  // dispensary/src/page.js
  var W10 = window;
  var ID = "FarmhandDispensary";
  var box = null;
  var note = "";
  var CSS2 = `
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
    if (W10.document.getElementById("fd-style")) return;
    const s = W10.document.createElement("style");
    s.id = "fd-style";
    s.textContent = CSS2;
    W10.document.head.appendChild(s);
  }
  var clockTip = (mode) => {
    const p = st().penalty;
    return mode === "real" ? "Real time: your timers keep running while you're logged off. To make up for it, every timer runs " + p + "% longer, so a 2-hour dose lasts " + (2 * (1 + p / 100)).toFixed(1).replace(/\.0$/, "") + " hours." : "While online: your timers only count down while you're logged in. A 2-hour dose is 2 hours of you being here.";
  };
  var partLabel = (id) => id === "fillout" ? " (" + ({ cup: "tits", belly: "belly", ass: "ass" }[partOf(id)] || "tits") + ")" : id === "tender" ? " (" + TENDER_SPOTS[partOf(id)].word + ")" : "";
  function timeLeft(ms) {
    const m = Math.ceil(ms / 6e4);
    return m >= 120 ? Math.floor(m / 60) + " h " + (m % 60 ? m % 60 + " min" : "") : m >= 60 ? "1 h " + (m - 60 ? m - 60 + " min" : "") : m + " min";
  }
  var DAY_MS = 864e5;
  var dateOf = (t) => {
    try {
      return new Date(t).toLocaleDateString(void 0, { day: "numeric", month: "short" });
    } catch (e) {
      return "";
    }
  };
  var inDays = (t) => {
    const d = Math.ceil((t - Date.now()) / DAY_MS);
    return d <= 0 ? "today" : d === 1 ? "tomorrow" : "in " + d + " days (" + dateOf(t) + ")";
  };
  var keyName = (mn) => {
    const P = W10.Player || {};
    const own = P.Ownership && P.Ownership.MemberNumber === mn;
    const c = (W10.ChatRoomCharacter || []).find((x) => x && x.MemberNumber === mn);
    return (c ? c.Nickname || c.Name : "#" + mn) + (own ? " (your owner)" : PROPRIETORS.includes(mn) ? " (proprietor)" : "");
  };
  var endPick = "7";
  function hardWarning(days, keys) {
    return "Hardcore. Until it ends, you can't change your Dispensary settings, and your safeword won't lift your doses: it asks your keyholders (" + keys.map(keyName).join(", ") + ") to let you out instead.\n\nIt ends " + (days ? "in " + days + " day" + (days === 1 ? "" : "s") : "when a keyholder ends it, or after " + CHECK_DAYS + " days with no keyholder checkin' in (bein' in a room with you counts)") + ". Your keyholders can change your settings, let you out, or end it whenever they like.\n\nLock yourself in?";
  }
  var keyInput = "";
  var WHY_NOT = { number: "That isn't a member number.", self: "You can't hold your own key.", already: "They already hold your key.", full: "That's ten keyholders: remove one first.", locked: "Not while you're locked in." };
  function keyholdersCard() {
    const S2 = st(), locked = hardOn(), P = W10.Player || {}, own = P.Ownership && P.Ownership.MemberNumber, rows = [];
    if (typeof own === "number" && own > 0) rows.push(h("div", null, "\u{1F5DD}\uFE0F " + keyName(own) + ": always, as your owner"));
    if (S2.stock) rows.push(h("div", null, "\u{1F5DD}\uFE0F " + PROPRIETORS.map(keyName).join(" and ") + ": you're on the farm's books"));
    for (const mn of S2.keys || []) rows.push(h("div", { class: "fd-row" }, "\u{1F5DD}\uFE0F " + keyName(mn), locked ? null : h("button", { onclick: () => {
      removeKey(mn);
      note = "";
      draw();
    } }, "Remove")));
    if (!rows.length) rows.push(h("div", { class: "fd-muted" }, "Nobody yet."));
    const input = h("input", {
      type: "text",
      inputmode: "numeric",
      placeholder: "Member number",
      "aria-label": "Add a keyholder by member number",
      value: keyInput,
      style: { width: "11em", padding: "4px 6px", borderRadius: "6px", background: "#1b151e", color: "#ecdfe8", border: "1px solid #6e5a78" },
      oninput: (e) => {
        keyInput = e.target.value;
      }
    });
    return [h("h3", null, "Keyholders"), h(
      "div",
      { class: "fd-card" },
      rows,
      locked ? h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Locked in with you till hardcore's over.") : h(
        "div",
        { class: "fd-row", style: { marginTop: "8px" } },
        input,
        h("button", { onclick: () => {
          const n = Number(String(keyInput).trim()), r = addKey(n);
          note = r.ok ? "\u{1F5DD}\uFE0F " + keyName(n) + " holds your key now." : WHY_NOT[r.why] || "Couldn't add them.";
          if (r.ok) keyInput = "";
          draw();
        } }, "Add")
      ),
      h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Keyholders can let you out of hardcore, change your settings while you're locked in, or end it. Your limits stay yours: nobody changes them while you're locked in, not even them.")
    )];
  }
  function hardCard() {
    const out = [h("h3", null, "Hardcore")];
    const keys = keyholders();
    if (!hardOn()) {
      const endSel = h(
        "select",
        { "aria-label": "When hardcore ends", onchange: (e) => {
          endPick = e.target.value;
        } },
        [["1", "1 day"], ["3", "3 days"], ["7", "7 days"], ["14", "14 days"], ["30", "30 days"], ["0", "No end date (a keyholder checks in every " + CHECK_DAYS + " days)"]].map(([v, t]) => h("option", { value: v, selected: v === endPick ? true : void 0 }, t))
      );
      out.push(h(
        "div",
        { class: "fd-card" },
        h("div", { class: "fd-muted" }, "Lock yourself in. Your settings are your keyholders' to change, and your safeword asks them to let you out instead of liftin' your doses. Only you can switch it on."),
        h("div", { style: { margin: "6px 0" } }, keys.length ? "Your keyholders: " + keys.map(keyName).join(", ") + "." : "You've no keyholder yet: add one above by member number, or have an owner, or be on the farm's books (the proprietors hold the key for farm stock)."),
        h(
          "div",
          { class: "fd-row" },
          endSel,
          h("button", { disabled: keys.length ? void 0 : true, onclick: () => {
            const days = Number(endPick) || 0;
            if (typeof W10.confirm === "function" && !W10.confirm(hardWarning(days, keys))) return;
            const r = lock(days);
            note = r.ok ? "\u{1F512} Locked in." : "Couldn't lock in: " + (r.why === "nokey" ? "you've no keyholder." : r.why);
            draw();
          } }, "\u{1F512} Lock me in")
        )
      ));
      return out;
    }
    const H = st().hard;
    out.push(h(
      "div",
      { class: "fd-card" },
      h("div", null, "\u{1F512} Locked in since " + dateOf(H.since) + ". " + (H.until ? "It ends " + inDays(H.until) + "." : "No end date: it lets go " + inDays(dueAt()) + " unless a keyholder checks in before then.")),
      h("div", { class: "fd-muted" }, "Your keyholders: " + keys.map(keyName).join(", ") + ". They can change your settings, let you out, or end it."),
      hardLog().slice(-5).reverse().map((l) => h("div", { class: "fd-muted" }, dateOf(l.t) + " \xB7 " + (l.by === (W10.Player && W10.Player.MemberNumber) ? "you" : l.by ? keyName(l.by) : "the clock") + ": " + l.what))
    ));
    return out;
  }
  var editing = null;
  function keysCard() {
    const list = Object.entries(wards());
    if (!list.length) return [];
    const out = [h("h3", null, "Keys you hold")];
    for (const [k, x] of list) {
      const mn = Number(k), inRoom2 = (W10.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn), name = (x.name || "#" + mn) + " (" + mn + ")";
      const go = (what, data) => {
        const how = keyDo(mn, what, data);
        note = how ? "\u{1F5DD}\uFE0F Sent " + (how === "room" ? "in the room" : "by beep") + "." : "Couldn't reach " + name + " just now.";
        draw();
      };
      const kids = [
        h("div", null, "\u{1F5DD}\uFE0F " + name + ": " + (x.until ? "ends " + inDays(x.until) : "lets go " + inDays(x.due) + " without a check-in") + (x.asked && Date.now() - x.asked < DAY_MS ? " \xB7 askin' to be let out" : "")),
        h(
          "div",
          { class: "fd-row", style: { marginTop: "6px" } },
          h("button", { onclick: () => go("check") }, "Check in"),
          h("button", { onclick: () => go("letout") }, "Let out (lift every dose)"),
          h("button", { onclick: () => {
            if (typeof W10.confirm !== "function" || W10.confirm("End " + name + "'s hardcore?")) go("end");
          } }, "End hardcore"),
          inRoom2 ? h("button", { onclick: () => {
            editing = { mn };
            keyDo(mn, "state");
            draw();
          } }, "Their settings") : null
        )
      ];
      const ws = editing && editing.mn === mn ? wardState(mn) : null;
      if (editing && editing.mn === mn) {
        if (!ws) kids.push(h("div", { class: "fd-muted" }, "Askin' their Dispensary..."));
        else {
          editing.who = editing.who || ws.who;
          editing.clock = editing.clock || ws.clock;
          editing.off = editing.off || Object.assign({}, ws.off);
          if (ws.companion && !editing.comp) editing.comp = Object.fromEntries(Object.entries(ws.companion).map(([k2, v]) => [k2, !!(v && v.on)]));
          kids.push(h(
            "div",
            { class: "fd-card" },
            h("div", { class: "fd-muted" }, (ws.doses || []).length ? "In them now: " + ws.doses.map((d) => (BOOK[d.id] ? BOOK[d.id].label : d.id) + " (" + timeLeft(d.left) + ")").join(", ") : "No doses in them."),
            h("select", { "aria-label": "Who can dose them", onchange: (e) => {
              editing.who = e.target.value;
            } }, LADDER.map((r) => h("option", { value: r.id, selected: r.id === editing.who ? true : void 0 }, r.label))),
            h(
              "div",
              { class: "fd-row", style: { gap: "14px", margin: "6px 0" } },
              ["online", "real"].map((c) => h("label", null, h("input", { type: "radio", name: "fd-ward-clock", checked: editing.clock === c ? true : void 0, onchange: () => {
                editing.clock = c;
              } }), c === "real" ? "Real time" : "While online"))
            ),
            doseIds().map((id) => h("label", null, h("input", { type: "checkbox", checked: !editing.off[id] ? true : void 0, onchange: (e) => {
              editing.off[id] = !e.target.checked;
            } }), BOOK[id].label)),
            ws.companion ? [
              h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Their Companion:"),
              Object.entries(ws.companion).map(([k2, v]) => h("label", null, h("input", { type: "checkbox", checked: editing.comp[k2] ? true : void 0, onchange: (e) => {
                editing.comp[k2] = e.target.checked;
              } }), v && v.label || k2))
            ] : null,
            h(
              "div",
              { class: "fd-row", style: { marginTop: "6px" } },
              h("button", { onclick: () => {
                const off = {};
                for (const id of doseIds()) off[id] = !!editing.off[id];
                const e2 = editing;
                editing = null;
                go("set", Object.assign({ who: e2.who, clock: e2.clock, off }, e2.comp ? { companion: e2.comp } : {}));
              } }, "Save their settings"),
              h("button", { onclick: () => {
                editing = null;
                draw();
              } }, "Close")
            )
          ));
        }
      }
      out.push(h("div", { class: "fd-card" }, kids));
    }
    return out;
  }
  function view() {
    const S2 = st(), now = doseIds().filter(active), locked = hardOn() ? true : void 0;
    const kids = [];
    kids.push(h(
      "div",
      { class: "fd-row", style: { marginBottom: "6px" } },
      h("h2", null, "\u{1F489} The Farmhand's Dispensary"),
      h("button", { onclick: () => {
        if (typeof W10.PreferenceSubscreenExtensionsClear === "function") W10.PreferenceSubscreenExtensionsClear();
        else close();
      } }, "Back")
    ));
    if (note) kids.push(h("div", { class: "fd-note" }, note));
    if (locked) kids.push(h("div", { class: "fd-card fd-note" }, "\u{1F512} Hardcore: your keyholders hold these settings. You can look, but only they can change them."));
    kids.push(h("h3", null, "In you now"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      now.length ? now.map((id) => h("div", null, BOOK[id].icon + " " + BOOK[id].label + (st().doses[id].x > 1 ? " \xD7" + st().doses[id].x : "") + partLabel(id) + ": " + timeLeft(leftMs(id)) + " left" + (S2.clock === "online" ? " of your time here" : ""))) : h("div", { class: "fd-muted" }, "Nothin'. You're clear."),
      S2.later.length ? h("div", null, "\u{1F48A} " + (S2.later.length === 1 ? "A time-release capsule's" : S2.later.length + " time-release capsules are") + " waitin' in you. You won't know when.") : null,
      h(
        "div",
        { class: "fd-row", style: { marginTop: "8px" } },
        locked ? h("button", { class: "fd-safe", onclick: () => {
          safeword("page");
          note = "\u{1F5DD}\uFE0F Your keyholders have been asked to let you out.";
          draw();
        } }, "\u{1F5DD}\uFE0F Ask to be let out") : h("button", { class: "fd-safe", onclick: () => {
          safeword("page");
          note = "Safeword: every dose lifted.";
          draw();
        } }, "\u{1F534} Safeword: lift every dose"),
        h("span", { class: "fd-muted" }, locked ? "Hardcore: your safeword asks your keyholders to let you out. Your doses stay till one of them does." : "The game's own safeword does it too, and so does /dispensary safeword.")
      )
    ));
    kids.push(h("h3", null, "Who can dose you"));
    const sel = h(
      "select",
      { "aria-label": "Who can dose you", disabled: locked, onchange: (e) => {
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
      h("input", { type: "radio", name: "fd-clock", disabled: locked, checked: S2.clock === mode ? true : void 0, onchange: () => {
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
    kids.push(h("h3", null, "Touches"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      h("label", null, h("input", { type: "checkbox", checked: S2.screen !== false ? true : void 0, onchange: (e) => {
        st().screen = e.target.checked;
        save();
        draw();
      } }), h("b", null, "Screen touches")),
      h("div", { class: "fd-muted" }, "A dose you can see at the edges of your own screen: the Sedative dims it, Denial Serum pulses pink near the top, Heat hazes it warm, Needy Nectar flushes it, Rut reddens it, the Airhead Elixir goes soft and pink. Only you see them. With reduce motion set on your computer, they hold still."),
      h(
        "div",
        { class: "fd-row", style: { marginTop: "8px" } },
        h("span", null, "Your animal, for Moo Juice:"),
        h(
          "select",
          { "aria-label": "Your animal", onchange: (e) => {
            st().species = e.target.value;
            save();
            draw();
          } },
          [h("option", { value: "", selected: !S2.species ? true : void 0 }, S2.speciesFarm ? "The farm's word (" + S2.speciesFarm + ")" : "Cow, till the farm says")].concat(ANIMALS.map((a) => h("option", { value: a, selected: S2.species === a ? true : void 0 }, a)))
        )
      )
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
            disabled: theirs || locked ? true : void 0,
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
        theirs ? h("div", { class: "fd-note" }, "LSCG is loaded, so this one is LSCG's own: LSCG's settings decide.") : null,
        B.lscgOnly && !lscg ? h("div", { class: "fd-muted" }, "Needs LSCG.") : null
      ));
    }
    kids.push(h("h3", null, "How doses take you"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      h(
        "div",
        { class: "fd-row" },
        h("span", null, "\u{1F338} Where Tender goes when the bottle doesn't say:"),
        h(
          "select",
          { "aria-label": "Where Tender goes", disabled: locked, onchange: (e) => {
            st().tenderSpot = e.target.value;
            save();
            draw();
          } },
          Object.entries(TENDER_SPOTS).map(([k, s2]) => h("option", { value: k, selected: (S2.tenderSpot || TENDER_DEFAULT) === k ? true : void 0 }, s2.word))
        )
      ),
      h("div", { class: "fd-muted", style: { marginTop: "8px" } }, "\u{1F48A} A needle that also says time-release, slow-release, delayed or capsule doesn't hit at once: it goes off somewhere between " + FUSE_MINS[0] + " and " + FUSE_MINS[1] + " minutes later, at a moment nobody knows. Up to " + LATER_MAX + " can wait in you; your safeword clears them."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S2.tolerance ? true : void 0, onchange: (e) => {
        st().tolerance = e.target.checked;
        save();
        draw();
      } }), h("b", null, "Tolerance")),
      h("div", { class: "fd-muted" }, "The same dose again within " + TOLERANCE_HOURS + " hours takes a fifth less for each one before it, down to two fifths. You're told when it does."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S2.cravings ? true : void 0, onchange: (e) => {
        st().cravings = e.target.checked ? Date.now() : 0;
        save();
        draw();
      } }), h("b", null, "Cravings")),
      h("div", { class: "fd-muted" }, "Once you've had " + CRAVE_AFTER + " doses in " + CRAVE_DAYS + " days, now and then, while nothin's in you, you want another (a note only you see). On the farm the farm girl notices, and offers: say ?fix and she sees to it. Only doses from here on count.")
    ));
    if (lscg) {
      kids.push(h("div", { class: "fd-card fd-muted" }, lscgApi() ? "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's. Our doses are in LSCG's Drug Enhancements list too: switch them on there as well to see a bar with the time left." : "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's."));
    }
    kids.push(...keyholdersCard(), ...hardCard(), ...keysCard());
    kids.push(h("div", { class: "fd-muted", style: { marginTop: "14px" } }, "The Farmhand's Dispensary v" + VERSION + " \xB7 B&B Farm. On the farm, the farm girl keeps the farm's books and your Dispensary does the rest."));
    return kids;
  }
  function draw() {
    if (box) box.replaceChildren(...view());
  }
  function open() {
    close();
    styles();
    box = W10.document.createElement("div");
    box.id = "fd-page";
    W10.document.body.appendChild(box);
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
  function redrawPage(force) {
    const a = W10.document.activeElement;
    if (!force && box && a && box.contains(a) && /^(SELECT|INPUT)$/.test(a.tagName)) return;
    draw();
  }
  function initPage() {
    if (typeof W10.PreferenceRegisterExtensionSetting !== "function") return false;
    try {
      W10.PreferenceRegisterExtensionSetting({
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
      if (typeof W10.PreferenceSubscreenExtensionsOpen === "function") {
        W10.PreferenceSubscreenExtensionsOpen(ID);
        return true;
      }
    } catch (e) {
    }
    open();
    return true;
  }

  // dispensary/src/index.js
  var W11 = window;
  var bcModSdk = import_bondage_club_mod_sdk.default.default || import_bondage_club_mod_sdk.default;
  if (W11.__farmDispensary) {
    console.warn("[Dispensary] Two copies of the Farmhand's Dispensary are installed. Delete the older one in Tampermonkey, then reload.");
    throw new Error("The Farmhand's Dispensary: another copy is already running");
  }
  var mod = bcModSdk.registerMod({ name: "FarmhandDispensary", fullName: "The Farmhand's Dispensary", version: VERSION });
  W11.__farmDispensary = VERSION;
  registerInk(W11, mod);
  initLscg();
  function status() {
    const on = doseIds().filter(active);
    local((on.length ? "In you now: " + on.map((id) => BOOK[id].label + " (" + timeLeft(leftMs(id)) + ")").join(", ") + "." : "No doses in you.") + " Who can dose you: " + ladderWho() + ". /dispensary safeword lifts every dose; /dispensary page opens the settings.");
  }
  function commands() {
    if (typeof W11.CommandCombine !== "function") return;
    try {
      W11.CommandCombine([{
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
    initHardcore(mod);
    initSpeech(mod);
    onHardChange(() => {
      if (pageOpen()) redrawPage(true);
    });
    initPage();
    commands();
    tick();
    setInterval(() => {
      try {
        tick();
        laterTick();
        tickHard();
        screenTick();
        if (pageOpen()) redrawPage();
      } catch (e) {
        console.warn("[Dispensary] clock:", e);
      }
    }, 5e3);
    setTimeout(() => hello(true), 3e3);
  }
  var boot = setInterval(() => {
    const P = W11.Player;
    if (!P || typeof P.MemberNumber !== "number" || !P.ExtensionSettings) return;
    clearInterval(boot);
    try {
      start2();
    } catch (e) {
      console.warn("[Dispensary] didn't start:", e);
    }
  }, 1e3);
  if (W11.__FARMHAND_TEST__) W11.__disp = {
    st: () => st(),
    give: (...a) => give(...a),
    tick: () => {
      tick();
      laterTick();
      tickHard();
    },
    setClock: (m) => setClock(m),
    active,
    leftMs,
    allowed: (mn) => allowed(mn),
    started: () => started,
    lock: (d) => lock(d),
    hardOn: () => hardOn(),
    keyholders: () => keyholders(),
    dueAt: () => dueAt(),
    speech: (t) => dosedSpeech(t),
    screen: () => screenTick(),
    end: (id) => end(id, "quiet"),
    moment: (id) => moment(id),
    craving: () => craving(),
    craveNow: () => {
      craveSoon();
      laterTick();
    }
  };
  W11.FarmhandDispensary = Object.freeze({
    version: VERSION,
    active: (id) => active(String(id)),
    doses: () => doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })),
    // one dose, if it's in you: how strong, its part or spot (Fill-Out: cup, belly, ass · Tender: the spot), time left.
    // The Companion's drawn body reads Fill-Out from here.
    dose: (id) => {
      const d = st().doses[String(id)];
      return d && active(String(id)) ? { x: d.x || 1, p: d.p || "", left: leftMs(String(id)) } : null;
    },
    who: () => st().who,
    // hardcore, for the Companion (its own settings lock while yours is on)
    hard: () => hardOn() ? { on: true, until: st().hard && st().hard.until || 0, due: dueAt() } : null
  });
})();
